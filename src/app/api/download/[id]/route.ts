import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import crypto from 'crypto'
import { getAdminClient } from '@/lib/supabase/admin'
import { verifyDownloadToken } from '@/lib/security'
import { getGoogleDriveAccessToken } from '@/lib/googleDrive'

export const dynamic = 'force-dynamic'

// Anti-piracy in-memory rate limiting (per edge node): max 5 downloads per 5 minutes per user/IP
const downloadRateStore = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(key: string, maxAttempts = 6, windowMs = 5 * 60 * 1000): boolean {
  const now = Date.now()
  const entry = downloadRateStore.get(key)
  if (!entry || now > entry.resetAt) {
    downloadRateStore.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }
  if (entry.count >= maxAttempts) {
    return true
  }
  entry.count++
  return false
}

// Cleanup stale entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of downloadRateStore.entries()) {
    if (now > entry.resetAt) downloadRateStore.delete(key)
  }
}, 10 * 60 * 1000)

function isIpInSameSubnet(ip1: string, ip2: string): boolean {
  if (ip1 === 'unknown' || ip2 === 'unknown') return true
  if (ip1 === ip2) return true

  // IPv4 - check if first 2 octets match (e.g. 192.168.X.X) to handle dynamic mobile IPs smoothly
  if (ip1.includes('.') && ip2.includes('.')) {
    const p1 = ip1.split('.')
    const p2 = ip2.split('.')
    return p1[0] === p2[0] && p1[1] === p2[1]
  }

  // IPv6 - check if first 2 blocks match
  if (ip1.includes(':') && ip2.includes(':')) {
    const p1 = ip1.split(':')
    const p2 = ip2.split(':')
    return p1[0] === p2[0] && p1[1] === p2[1]
  }

  return false
}

const SECURE_RESPONSE_HEADERS: Record<string, string> = {
  'Cache-Control': 'private, no-store, no-cache, must-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'X-Robots-Tag': 'noindex, nofollow',
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawParam } = await params
    const queryToken = request.nextUrl.searchParams.get('token')
    const token = queryToken || rawParam

    if (!token) {
      return new NextResponse('Unauthorized: Missing download token', { 
        status: 401,
        headers: SECURE_RESPONSE_HEADERS
      })
    }

    const headerList = await headers()
    const currentIp =
      headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headerList.get('x-real-ip') ||
      'unknown'

    // 1. Anti-Scraping / Anti-Piracy Rate Limiting Check
    const rateLimitKey = `${currentIp}:${token.slice(-16)}`
    if (isRateLimited(rateLimitKey)) {
      console.warn(`[SECURITY_RATE_LIMIT_EXCEEDED] IP: ${currentIp}`)
      return new NextResponse('Too Many Requests: Download limit reached. Please wait before retrying.', {
        status: 429,
        headers: {
          ...SECURE_RESPONSE_HEADERS,
          'Retry-After': '300'
        }
      })
    }

    // 2. Cryptographic Token Verification (Timing-safe HMAC & expiry)
    const payload = verifyDownloadToken(token)
    if (!payload) {
      return new NextResponse('Forbidden: Unauthorized or Expired Download Link', { 
        status: 403,
        headers: SECURE_RESPONSE_HEADERS
      })
    }

    // 3. Subnet IP Binding Defense
    if (!isIpInSameSubnet(payload.ip, currentIp) && process.env.NODE_ENV !== 'development') {
      console.warn(`[IP_MISMATCH] Token IP: ${payload.ip}, Current IP: ${currentIp}`)
      return new NextResponse('IP Address Mismatch: Download link must be used on the requesting device/network.', {
        status: 403,
        headers: SECURE_RESPONSE_HEADERS
      })
    }

    const itemId = payload.pid
    const itemType = payload.type || 'pack'
    const admin = getAdminClient()

    // 4. ZERO-TRUST REAL-TIME OWNERSHIP CHECK IN USER_VAULT
    // Even if token was forged or leaked, verify caller actually paid and owns item in database!
    const { data: vaultRecord } = await admin
      .from('user_vault')
      .select('id')
      .eq('user_id', payload.uid)
      .eq('item_id', itemId)
      .eq('item_type', itemType)
      .maybeSingle()

    if (!vaultRecord) {
      // Check if user is an administrator
      const { data: adminCheck } = await admin
        .from('user_accounts')
        .select('is_admin')
        .eq('user_id', payload.uid)
        .maybeSingle()

      if (!adminCheck?.is_admin) {
        console.warn(`[SECURITY_UNPAID_DOWNLOAD_BLOCKED] User ${payload.uid} has not purchased item ${itemId} (${itemType})`)
        return new NextResponse('Access Denied: Product Not Owned or Payment Required', { 
          status: 403,
          headers: SECURE_RESPONSE_HEADERS
        })
      }
    }

    // 5. Retrieve Download URL strictly through service_role admin client
    let downloadUrl = ''
    let itemName = ''

    if (itemType === 'preset') {
      const { data: preset } = await admin.from('presets').select('name, drive_url').eq('id', itemId).maybeSingle()
      if (preset) {
        downloadUrl = preset.drive_url
        itemName = preset.name
      }
    } else {
      const { data: pack } = await admin.from('sample_packs').select('name, full_pack_download_url').eq('id', itemId).maybeSingle()
      if (pack) {
        downloadUrl = pack.full_pack_download_url
        itemName = pack.name
      }
    }

    if (!downloadUrl) {
      return new NextResponse('File not found in registry', { 
        status: 404,
        headers: SECURE_RESPONSE_HEADERS
      })
    }

    // 6. Extract Google Drive ID if present
    const driveIdMatch = downloadUrl.match(/[-\w]{25,}/)?.[0]
    const sanitizedName = (itemName || 'Audio Pack').replace(/[^a-zA-Z0-9\s-_]/g, '').trim()
    const fileName = `SamplesWala - ${sanitizedName}.zip`
    const encodedName = encodeURIComponent(fileName)

    const workerUrl = process.env.CLOUDFLARE_WORKER_URL
    const proxySecret = process.env.PROXY_SECRET

    // Tier 1: Cloudflare Edge Worker AES-256-GCM proxy
    if (workerUrl && proxySecret && driveIdMatch) {
      try {
        const secretHash = crypto.createHash('sha256').update(proxySecret).digest()
        const iv = crypto.randomBytes(12)
        const cipher = crypto.createCipheriv('aes-256-gcm', secretHash, iv)
        let encryptedId = cipher.update(driveIdMatch, 'utf8', 'hex')
        encryptedId += cipher.final('hex')
        const authTag = cipher.getAuthTag().toString('hex')
        const payloadStr = iv.toString('hex') + encryptedId + authTag

        const timestamp = Math.floor(Date.now() / 1000) + 3600
        const hmac = crypto.createHmac('sha256', proxySecret)
        hmac.update(`${payloadStr}:${timestamp}`)
        const sig = hmac.digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')

        return NextResponse.redirect(`${workerUrl}?payload=${payloadStr}&sig=${sig}&exp=${timestamp}&name=${encodedName}&download=1`, {
          headers: SECURE_RESPONSE_HEADERS
        })
      } catch (err) {
        console.warn('[CLOUDFLARE_WORKER_ENCRYPT_ERROR] Falling back to Tier 2 stream:', err)
      }
    }

    // Tier 2: Direct Google Drive Service Account Stream (API v3 alt=media)
    if (driveIdMatch) {
      try {
        const googleToken = await getGoogleDriveAccessToken()
        if (googleToken) {
          const driveApiUrl = `https://www.googleapis.com/drive/v3/files/${driveIdMatch}?alt=media&supportsAllDrives=true`
          const driveRes = await fetch(driveApiUrl, {
            headers: {
              Authorization: `Bearer ${googleToken}`,
              'User-Agent': 'SamplesWala-Secure-CDN/1.0',
            },
          })

          if (driveRes.ok && driveRes.body) {
            const responseHeaders = new Headers(driveRes.headers)
            responseHeaders.set('Content-Disposition', `attachment; filename="${fileName}"`)
            responseHeaders.set('Content-Type', 'application/octet-stream')
            responseHeaders.delete('set-cookie')

            for (const [headerKey, headerVal] of Object.entries(SECURE_RESPONSE_HEADERS)) {
              responseHeaders.set(headerKey, headerVal)
            }

            return new Response(driveRes.body, {
              status: 200,
              headers: responseHeaders,
            })
          }
        }
      } catch (streamErr) {
        console.warn('[SERVICE_ACCOUNT_STREAM_ERROR] Falling back to Tier 3 usercontent redirect:', streamErr)
      }

      // Tier 3: Direct Google Drive usercontent download redirect
      const directGoogleDriveUrl = `https://drive.usercontent.google.com/download?id=${driveIdMatch}&export=download&confirm=t`
      return NextResponse.redirect(directGoogleDriveUrl, {
        headers: SECURE_RESPONSE_HEADERS
      })
    }

    // Tier 4: Direct origin storage URL redirect
    return NextResponse.redirect(downloadUrl, {
      headers: SECURE_RESPONSE_HEADERS
    })
  } catch (error: any) {
    console.error('[DOWNLOAD_API_ERROR]', error)
    return new NextResponse('Internal Download Server Error', { 
      status: 500,
      headers: SECURE_RESPONSE_HEADERS
    })
  }
}

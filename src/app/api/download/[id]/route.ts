import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import crypto from 'crypto'
import { getAdminClient } from '@/lib/supabase/admin'
import { verifyDownloadToken } from '@/lib/security'
import { getGoogleDriveAccessToken } from '@/lib/googleDrive'

export const dynamic = 'force-dynamic'

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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawParam } = await params
    const queryToken = request.nextUrl.searchParams.get('token')
    const token = queryToken || rawParam

    if (!token) {
      return new NextResponse('Unauthorized: Missing download token', { status: 401 })
    }

    const admin = getAdminClient()

    // 1. Verify Token (Database-less cryptographic verification)
    const payload = verifyDownloadToken(token)

    if (!payload) {
      return new NextResponse('Forbidden: Unauthorized or Expired Download Link', { status: 403 })
    }

    // 2. Extra Security: Verify Subnet IP address
    const headerList = await headers()
    const currentIp =
      headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headerList.get('x-real-ip') ||
      'unknown'

    if (!isIpInSameSubnet(payload.ip, currentIp) && process.env.NODE_ENV !== 'development') {
      console.warn(`[IP_MISMATCH] Token IP: ${payload.ip}, Current IP: ${currentIp}`)
      return new NextResponse('IP Address Mismatch: Download link must be used on the requesting device/network.', {
        status: 403,
      })
    }

    const itemId = payload.pid
    const itemType = payload.type || 'pack'

    // 3. Get Item Download URL from respective table
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
      return new NextResponse('File not found in registry', { status: 404 })
    }

    // 4. Extract Google Drive ID if present
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

        return NextResponse.redirect(`${workerUrl}?payload=${payloadStr}&sig=${sig}&exp=${timestamp}&name=${encodedName}&download=1`)
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
      return NextResponse.redirect(directGoogleDriveUrl)
    }

    // Tier 4: Direct origin storage URL redirect
    return NextResponse.redirect(downloadUrl)
  } catch (error: any) {
    console.error('[DOWNLOAD_API_ERROR]', error)
    return new NextResponse('Internal Download Server Error', { status: 500 })
  }
}

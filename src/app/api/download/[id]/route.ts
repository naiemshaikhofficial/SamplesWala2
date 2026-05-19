import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getAdminClient } from '@/lib/supabase/admin'
import { verifyDownloadToken } from '@/lib/security'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

function isIpInSameSubnet(ip1: string, ip2: string): boolean {
  if (ip1 === 'unknown' || ip2 === 'unknown') return true
  if (ip1 === ip2) return true

  // IPv4 - check if first 3 octets match (e.g. 192.168.1.X)
  if (ip1.includes('.') && ip2.includes('.')) {
    const p1 = ip1.split('.')
    const p2 = ip2.split('.')
    return p1[0] === p2[0] && p1[1] === p2[1] && p1[2] === p2[2]
  }

  // IPv6 - check if first 3 blocks match (/48 routing prefix)
  if (ip1.includes(':') && ip2.includes(':')) {
    const p1 = ip1.split(':')
    const p2 = ip2.split(':')
    return p1[0] === p2[0] && p1[1] === p2[1] && p1[2] === p2[2]
  }

  return false
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: token } = await params
    const admin = getAdminClient()

    // 1. Verify Token (Database-less)
    const payload = verifyDownloadToken(token)

    if (!payload) {
        return new NextResponse("Unauthorized or Expired Link", { status: 403 })
    }

    // 2. Extra Security: Verify IP address (Optional but recommended)
    const headerList = await headers()
    const currentIp = headerList.get("x-forwarded-for")?.split(',')[0] || "unknown"
    
    if (!isIpInSameSubnet(payload.ip, currentIp) && process.env.NODE_ENV !== 'development') {
        console.warn(`[IP_MISMATCH] Token IP: ${payload.ip}, Current IP: ${currentIp}`)
        return new NextResponse("IP Address Mismatch. Use the same device/network.", { status: 403 })
    }

    const itemId = payload.pid
    const itemType = payload.type || 'pack' // Default to pack for backward compatibility

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
        return new NextResponse("File not found in registry", { status: 404 })
    }

    const driveIdMatch = downloadUrl.match(/[-\w]{25,}/)?.[0]
    
    // 4. Redirect or Proxy via Worker
    const workerUrl = process.env.CLOUDFLARE_WORKER_URL
    const proxySecret = process.env.PROXY_SECRET

    if (workerUrl && proxySecret && driveIdMatch) {
        const secretHash = crypto.createHash('sha256').update(proxySecret).digest()
        const iv = crypto.randomBytes(12)
        const cipher = crypto.createCipheriv('aes-256-gcm', secretHash, iv)
        let encryptedId = cipher.update(driveIdMatch, 'utf8', 'hex')
        encryptedId += cipher.final('hex')
        const authTag = cipher.getAuthTag().toString('hex')
        const payload = iv.toString('hex') + encryptedId + authTag

        const timestamp = Math.floor(Date.now() / 1000) + 3600
        const hmac = crypto.createHmac('sha256', proxySecret)
        hmac.update(`${payload}:${timestamp}`)
        const sig = hmac.digest('base64').replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")

        const fileName = `SamplesWala - ${itemName}.zip`
        const encodedName = encodeURIComponent(fileName)

        return NextResponse.redirect(`${workerUrl}?payload=${payload}&sig=${sig}&exp=${timestamp}&name=${encodedName}&download=1`)
    }

    // Fallback - Restricted
    return new NextResponse("Secure Proxy Configuration Missing. Please contact support.", { status: 500 })

  } catch (error: any) {
    console.error("[DOWNLOAD_API_ERROR]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: tokenId } = await params
    const admin = getAdminClient()

    // 1. Verify Token
    const { data: tokenRecord, error: tokenError } = await admin
        .from('secure_download_tokens')
        .select('*')
        .eq('id', tokenId)
        .is('used_at', null)
        .gt('expires_at', new Date().toISOString())
        .single()

    if (tokenError || !tokenRecord) {
        return new NextResponse("Unauthorized or Expired Signal", { status: 403 })
    }

    // 2. Mark as used
    await admin.from('secure_download_tokens').update({ used_at: new Date().toISOString() }).eq('id', tokenId)

    const packId = tokenRecord.item_id

    // 3. Get Pack Download URL
    const { data: pack } = await admin.from('sample_packs').select('name, full_pack_download_url').eq('id', packId).maybeSingle()
    
    if (!pack || !pack.full_pack_download_url) {
        return new NextResponse("File not found in registry", { status: 404 })
    }

    const downloadUrl = pack.full_pack_download_url
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

        const fileName = `SamplesWala - ${pack.name}.zip`
        const encodedName = encodeURIComponent(fileName)

        return NextResponse.redirect(`${workerUrl}?payload=${payload}&sig=${sig}&exp=${timestamp}&name=${encodedName}&download=1`)
    }

    // Fallback
    return NextResponse.redirect(downloadUrl)

  } catch (error: any) {
    console.error("[DOWNLOAD_API_ERROR]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

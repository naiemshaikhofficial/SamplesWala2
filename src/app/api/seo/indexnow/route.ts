import { NextRequest, NextResponse } from 'next/server'
import { submitIndexNowUrls, HOST_DOMAIN } from '@/lib/seo/indexing'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const urls: string[] = body.urls || [
      `https://${HOST_DOMAIN}`,
      `https://${HOST_DOMAIN}/browse/packs`,
      `https://${HOST_DOMAIN}/browse/presets`,
      `https://${HOST_DOMAIN}/series/india-journey`,
      `https://${HOST_DOMAIN}/daw/fl-studio`,
      `https://${HOST_DOMAIN}/daw/ableton-live`,
      `https://${HOST_DOMAIN}/daw/logic-pro`,
    ]

    const res = await submitIndexNowUrls(urls)
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Cloudflare provides 'cf-ipcountry', Vercel provides 'x-vercel-ip-country'
  const country = (
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-vercel-ip-country') ||
    ''
  ).toUpperCase()

  // Default to INR for India, USD for international visitors
  let currency: 'INR' | 'USD' = 'INR'
  if (country && country !== 'IN') {
    currency = 'USD'
  }

  return NextResponse.json(
    { country: country || null, currency },
    {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
    }
  )
}

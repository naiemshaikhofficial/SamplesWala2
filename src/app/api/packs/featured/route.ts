import { NextResponse } from 'next/server'
import { getPacks } from '@/app/browse/actions'

export async function GET() {
  try {
    const packs = await getPacks()
    // Return a random selection of 4 packs as featured
    const featured = packs.sort(() => 0.5 - Math.random()).slice(0, 4)
    const cacheHeader = 'public, s-maxage=3600, stale-while-revalidate=86400'
    return NextResponse.json(featured, {
      headers: {
        'Cache-Control': cacheHeader,
        'CDN-Cache-Control': cacheHeader,
        'Vercel-CDN-Cache-Control': cacheHeader,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch packs' }, { status: 500 })
  }
}

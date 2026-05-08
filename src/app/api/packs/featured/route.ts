import { NextResponse } from 'next/server'
import { getPacks } from '@/app/browse/actions'

export async function GET() {
  try {
    const packs = await getPacks()
    // Return a random selection of 4 packs as featured
    const featured = packs.sort(() => 0.5 - Math.random()).slice(0, 4)
    return NextResponse.json(featured)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch packs' }, { status: 500 })
  }
}

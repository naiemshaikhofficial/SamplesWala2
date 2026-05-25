import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const secret = searchParams.get('secret')

    // Secure validation using environment variable
    const token = process.env.REVALIDATION_TOKEN || 'sampleswala_cache_bypass_token_2026'
    if (secret !== token) {
      return NextResponse.json({ error: 'Unauthorized: Invalid revalidation token' }, { status: 401 })
    }

    // 1. Clear the data caches for Supabase queries
    revalidateTag('packs', 'max')
    revalidateTag('categories', 'max')
    revalidateTag('presets', 'max')

    // 2. Force revalidation of primary listing and detail routes
    revalidatePath('/')
    revalidatePath('/browse')
    revalidatePath('/library')
    revalidatePath('/sitemap.xml')
    revalidatePath('/sitemap')
    
    // We can also revalidate dynamic paths. Next.js App Router revalidatePath
    // allows clearing everything under dynamic layouts.
    revalidatePath('/packs/[slug]', 'page')
    revalidatePath('/series/[slug]', 'page')
    revalidatePath('/browse/genre/[slug]', 'page')
    revalidatePath('/browse/presets/[slug]', 'page')

    return NextResponse.json({ 
      revalidated: true, 
      timestamp: Date.now(),
      message: 'Next.js cache cleared successfully for listing & detail routes.' 
    })
  } catch (err: any) {
    console.error('[REVALIDATE_ERROR]', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}

// Support GET requests as well for easy manual triggers or simple webhook setups
export async function GET(req: Request) {
  return POST(req)
}

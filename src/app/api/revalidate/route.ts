import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag, revalidatePath } from 'next/cache'

/**
 * On-Demand Cache Invalidation Endpoint
 * Allows instant, zero-downtime cache purge without restarting servers or waiting for timeouts.
 * Triggered manually, from admin tools, or via Supabase database webhooks.
 *
 * Usage:
 * GET/POST /api/revalidate?secret=...&tag=packs
 * GET/POST /api/revalidate?secret=...&path=/packs/bollywood-dholak
 * POST /api/revalidate (with Supabase Webhook payload: { table: "sample_packs", record: { slug: "..." } })
 */

function safeRevalidateTag(tagName: string) {
  try {
    (revalidateTag as any)(tagName, 'max')
  } catch {
    try {
      (revalidateTag as any)(tagName)
    } catch (e) {
      console.warn('[REVALIDATE_TAG_ERROR]', e)
    }
  }
}

export async function GET(req: NextRequest) {
  return handleRevalidation(req)
}

export async function POST(req: NextRequest) {
  return handleRevalidation(req)
}

async function handleRevalidation(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    let tag = searchParams.get('tag')
    let path = searchParams.get('path')
    const secretParam = searchParams.get('secret') || searchParams.get('token')

    const authHeader = req.headers.get('authorization')
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
    const headerSecret =
      req.headers.get('x-revalidation-token') ||
      req.headers.get('x-revalidate-secret') ||
      bearerToken

    const incomingSecret = secretParam || headerSecret

    const configuredSecret =
      process.env.REVALIDATION_TOKEN ||
      process.env.REVALIDATE_SECRET ||
      'sampleswala_cache_bypass_token_2026'

    if (incomingSecret !== configuredSecret) {
      console.warn('[REVALIDATE_AUTH_ERROR] Unauthorized revalidation attempt')
      return NextResponse.json({ error: 'Unauthorized: Invalid revalidation token' }, { status: 401 })
    }

    const revalidatedItems: string[] = []

    // 1. Check for Supabase Database Webhook JSON body
    if (req.method === 'POST') {
      try {
        const contentType = req.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
          const body = await req.json().catch(() => null)
          if (body && body.table) {
            const table = body.table
            const eventType = body.type || 'UNKNOWN'
            const currentSlug = body.record?.slug
            const previousSlug = body.old_record?.slug

            console.log(`[Revalidate Webhook] Supabase ${eventType} event for table: "${table}"`)

            if (table === 'sample_packs') {
              safeRevalidateTag('packs')
              revalidatePath('/')
              revalidatePath('/browse')
              revalidatePath('/browse/packs')
              revalidatePath('/sitemap.xml')
              revalidatePath('/packs/[slug]', 'page')

              revalidatedItems.push('tag:packs', 'path:/', 'path:/browse/packs', 'path:/sitemap.xml')

              if (currentSlug) {
                revalidatePath(`/packs/${currentSlug}`)
                revalidatedItems.push(`path:/packs/${currentSlug}`)
              }
              if (previousSlug && previousSlug !== currentSlug) {
                revalidatePath(`/packs/${previousSlug}`)
                revalidatedItems.push(`path:/packs/${previousSlug} (renamed)`)
              }
            } else if (table === 'presets') {
              safeRevalidateTag('presets')
              revalidatePath('/')
              revalidatePath('/browse')
              revalidatePath('/browse/presets')
              revalidatePath('/sitemap.xml')
              revalidatePath('/browse/presets/[slug]', 'page')

              revalidatedItems.push('tag:presets', 'path:/', 'path:/browse/presets')

              if (currentSlug) {
                revalidatePath(`/browse/presets/${currentSlug}`)
                revalidatedItems.push(`path:/browse/presets/${currentSlug}`)
              }
            } else if (table === 'categories') {
              safeRevalidateTag('categories')
              revalidatePath('/')
              revalidatePath('/browse')
              revalidatePath('/sitemap.xml')

              if (currentSlug) {
                revalidatePath(`/browse/genre/${currentSlug}`)
                revalidatedItems.push(`path:/browse/genre/${currentSlug}`)
              }
            } else if (table === 'software_products') {
              revalidatePath('/')
              revalidatePath('/sitemap.xml')

              if (currentSlug) {
                revalidatePath(`/software/${currentSlug}`)
                revalidatedItems.push(`path:/software/${currentSlug}`)
              }
            }
          }
        }
      } catch (jsonErr: any) {
        console.warn('[Revalidate Webhook] JSON parse notice:', jsonErr.message)
      }
    }

    // 2. Direct Revalidation by Tag
    if (tag) {
      safeRevalidateTag(tag)
      revalidatedItems.push(`tag:${tag}`)
    }

    // 3. Direct Revalidation by Path
    if (path) {
      revalidatePath(path)
      revalidatedItems.push(`path:${path}`)
    }

    // 4. Default purge if no specific targets were specified
    if (!tag && !path && revalidatedItems.length === 0) {
      safeRevalidateTag('packs')
      safeRevalidateTag('categories')
      safeRevalidateTag('presets')

      revalidatePath('/')
      revalidatePath('/browse')
      revalidatePath('/browse/packs')
      revalidatePath('/browse/presets')
      revalidatePath('/sitemap.xml')
      revalidatePath('/packs/[slug]', 'page')
      revalidatePath('/series/[slug]', 'page')
      revalidatePath('/browse/genre/[slug]', 'page')
      revalidatePath('/browse/presets/[slug]', 'page')

      revalidatedItems.push('all_core_routes')
    }

    return NextResponse.json({
      success: true,
      revalidated: true,
      items: revalidatedItems,
      timestamp: Date.now(),
    })
  } catch (err: any) {
    console.error('[REVALIDATE_ERROR]', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}

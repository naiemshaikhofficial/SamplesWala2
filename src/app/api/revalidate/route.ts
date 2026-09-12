import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag, revalidatePath } from 'next/cache'
import { submitIndexNowUrls } from '@/lib/seo/indexing'

/**
 * On-Demand Cache Invalidation Endpoint
 * Allows instant, zero-downtime cache purge without restarting servers or waiting for timeouts.
 * Triggered automatically via Supabase database webhooks, triggers, or manually with secret token.
 *
 * Usage:
 * GET/POST /api/revalidate?secret=...&tag=packs
 * GET/POST /api/revalidate?secret=...&path=/free
 * POST /api/revalidate (Automated Supabase Webhook payload: { table: "sample_packs", record: { slug: "..." } })
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

    let isSupabaseWebhook = false
    let webhookBody: any = null

    // 1. Check for Supabase Database Webhook / Trigger JSON payload
    if (req.method === 'POST') {
      try {
        const contentType = req.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
          webhookBody = await req.json().catch(() => null)
          if (webhookBody && webhookBody.table) {
            isSupabaseWebhook = true
          }
        }
      } catch (jsonErr: any) {
        console.warn('[Revalidate Webhook] JSON parse notice:', jsonErr.message)
      }
    }

    // 2. Authentication:
    // If it's an automated Supabase Database Webhook or pg_net trigger, allow automatic update.
    // If it's a manual tag/path purge query, verify against configured secret.
    if (!isSupabaseWebhook) {
      if (!incomingSecret || incomingSecret !== configuredSecret) {
        console.warn('[REVALIDATE_AUTH_ERROR] Unauthorized manual revalidation attempt')
        return NextResponse.json({ error: 'Unauthorized: Invalid revalidation token' }, { status: 401 })
      }
    }

    const revalidatedItems: string[] = []
    let webhookTable: string | null = null
    let webhookSlug: string | null = null

    // 3. Process Supabase Database Webhook
    if (isSupabaseWebhook && webhookBody) {
      const table = webhookBody.table
      webhookTable = table
      const eventType = webhookBody.type || 'UNKNOWN'
      const currentSlug = webhookBody.record?.slug
      webhookSlug = currentSlug
      const previousSlug = webhookBody.old_record?.slug

      console.log(`[Revalidate Webhook] Supabase ${eventType} event for table: "${table}"`)

      if (table === 'sample_packs') {
        safeRevalidateTag('packs')
        revalidatePath('/')
        revalidatePath('/free')
        revalidatePath('/browse')
        revalidatePath('/browse/packs')
        revalidatePath('/sitemap.xml')
        revalidatePath('/packs/[slug]', 'page')

        revalidatedItems.push('tag:packs', 'path:/', 'path:/free', 'path:/browse/packs', 'path:/sitemap.xml')

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
        revalidatePath('/free')
        revalidatePath('/browse')
        revalidatePath('/browse/presets')
        revalidatePath('/sitemap.xml')
        revalidatePath('/browse/presets/[slug]', 'page')

        revalidatedItems.push('tag:presets', 'path:/', 'path:/free', 'path:/browse/presets')

        if (currentSlug) {
          revalidatePath(`/browse/presets/${currentSlug}`)
          revalidatedItems.push(`path:/browse/presets/${currentSlug}`)
        }
      } else if (table === 'samples') {
        safeRevalidateTag('packs')
        revalidatePath('/')
        revalidatePath('/free')
        revalidatePath('/browse')
        revalidatePath('/library')

        revalidatedItems.push('tag:packs', 'path:/', 'path:/free', 'path:/browse', 'path:/library')

        if (webhookBody.record?.pack_id) {
          revalidatePath('/packs/[slug]', 'page')
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
      } else if (table === 'app_metadata') {
        safeRevalidateTag('settings')
        safeRevalidateTag('site-settings')
        safeRevalidateTag('maintenance')
        revalidatePath('/')
        revalidatePath('/maintenance')
        revalidatePath('/checkout')
        revalidatedItems.push('path:/ (app_metadata)', 'tag:settings', 'tag:maintenance')
      } else if (table === 'coupons') {
        safeRevalidateTag('coupons')
        revalidatePath('/checkout')
        revalidatedItems.push('tag:coupons', 'path:/checkout')
      }
    }

    // 4. Direct Revalidation by Tag
    if (tag) {
      safeRevalidateTag(tag)
      if (tag === 'maintenance' || tag === 'settings' || tag === 'admin-settings') {
        safeRevalidateTag('settings')
        safeRevalidateTag('site-settings')
        safeRevalidateTag('maintenance')
        revalidatePath('/')
        revalidatePath('/maintenance')
        revalidatePath('/checkout')
      }
      revalidatedItems.push(`tag:${tag}`)
    }

    // 5. Direct Revalidation by Path
    if (path) {
      revalidatePath(path)
      revalidatedItems.push(`path:${path}`)
    }

    // 6. Default purge if no specific targets were specified
    if (!tag && !path && revalidatedItems.length === 0) {
      safeRevalidateTag('packs')
      safeRevalidateTag('categories')
      safeRevalidateTag('presets')

      revalidatePath('/')
      revalidatePath('/free')
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

    // 7. Instant Search Engine Ping via IndexNow Protocol (Fire-and-forget, non-blocking)
    try {
      const urlsToPing: string[] = []
      if (webhookSlug && (webhookTable === 'sample_packs' || tag === 'packs')) {
        urlsToPing.push(`https://sampleswala.com/packs/${webhookSlug}`)
        urlsToPing.push('https://sampleswala.com/browse')
        urlsToPing.push('https://sampleswala.com/browse/packs')
      } else if (webhookSlug && (webhookTable === 'presets' || tag === 'presets')) {
        urlsToPing.push(`https://sampleswala.com/browse/presets/${webhookSlug}`)
        urlsToPing.push('https://sampleswala.com/browse/presets')
      } else if (path) {
        urlsToPing.push(`https://sampleswala.com${path.startsWith('/') ? path : `/${path}`}`)
      }
      if (urlsToPing.length > 0) {
        submitIndexNowUrls(urlsToPing).catch(err => console.warn('[IndexNow Ping Notice]:', err?.message || err))
      }
    } catch {
      // Ignore IndexNow errors to never block revalidation response
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

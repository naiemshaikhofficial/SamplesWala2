import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body || !body.visitor_id) {
      return NextResponse.json({ error: 'Missing visitor_id' }, { status: 400 })
    }

    const {
      visitor_id,
      cookie_consent,
      searched_keyword,
      audio_preview,
      viewed_pack,
      cart_items,
      daw_preference,
      device_info,
      traffic_source
    } = body

    // Check if user is logged in
    let userId: string | null = null
    let userEmail: string | null = null
    try {
      const { data: { user } } = await getUser()
      if (user) {
        userId = user.id
        userEmail = user.email || null
      }
    } catch {}

    // Extract Edge / IP Location
    const forwardedFor = req.headers.get('x-forwarded-for')
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : req.headers.get('x-real-ip') || '127.0.0.1'

    // Vercel & Cloudflare Edge Geo headers
    const rawCity = req.headers.get('x-vercel-ip-city') || req.headers.get('cf-ipcity') || null
    let detectedCity: string | null = null
    if (rawCity) {
      try {
        detectedCity = decodeURIComponent(rawCity)
      } catch {
        detectedCity = rawCity
      }
    }

    const detectedRegion = req.headers.get('x-vercel-ip-country-region') || req.headers.get('cf-region') || null // e.g. "PB", "MH", "DL"
    const detectedCountry = req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry') || null // e.g. "IN", "US"
    const detectedTimezone = req.headers.get('x-vercel-ip-timezone') || body.device_info?.timezone || null

    const geoData = {
      ip: clientIp,
      city: detectedCity || body.device_info?.location?.city || null,
      region: detectedRegion || body.device_info?.location?.region || null,
      country: detectedCountry || body.device_info?.location?.country || null,
      timezone: detectedTimezone || body.device_info?.timezone || 'Asia/Kolkata'
    }

    const enrichedDeviceInfo = {
      ...(device_info || {}),
      location: geoData,
      timezone: geoData.timezone
    }

    const adminClient = getAdminClient()

    // 1. Fetch existing telemetry record for this visitor_id
    const { data: existing } = await adminClient
      .from('user_telemetry')
      .select('*')
      .eq('visitor_id', visitor_id)
      .maybeSingle()

    const now = new Date().toISOString()

    if (!existing) {
      // First time insert
      const initialKeywords = searched_keyword ? [searched_keyword] : []
      const initialAudio = audio_preview ? [{ ...audio_preview, play_count: 1 }] : []
      const initialPacks = viewed_pack ? [viewed_pack] : []

      await adminClient.from('user_telemetry').insert({
        visitor_id,
        user_id: userId,
        user_email: userEmail,
        cookie_consent: cookie_consent || { analytics: true, personalization: true, functional: true, accepted_at: null },
        daw_preference: daw_preference || null,
        favorite_genres: [],
        searched_keywords: initialKeywords,
        previewed_audio: initialAudio,
        viewed_packs: initialPacks,
        cart_items: cart_items || [],
        device_info: enrichedDeviceInfo,
        traffic_source: traffic_source || {},
        session_count: 1,
        first_seen: now,
        last_seen: now,
        updated_at: now
      })
    } else {
      // Update existing record
      const updateData: Record<string, any> = {
        last_seen: now,
        updated_at: now
      }

      // Link user if authenticated and not yet linked
      if (userId && (!existing.user_id || existing.user_id !== userId)) {
        updateData.user_id = userId
        updateData.user_email = userEmail
      }

      if (cookie_consent) {
        updateData.cookie_consent = cookie_consent
      }

      if (daw_preference) {
        updateData.daw_preference = daw_preference
      }

      updateData.device_info = {
        ...(existing.device_info || {}),
        ...enrichedDeviceInfo,
        location: {
          ...((existing.device_info && existing.device_info.location) || {}),
          ...geoData
        }
      }

      if (traffic_source && Object.keys(traffic_source).length > 0) {
        updateData.traffic_source = {
          ...(existing.traffic_source || {}),
          ...traffic_source
        }
      }

      if (cart_items !== undefined) {
        updateData.cart_items = cart_items
      }

      // Append searched keyword if provided
      if (searched_keyword) {
        const currentKeywords: string[] = existing.searched_keywords || []
        if (!currentKeywords.includes(searched_keyword)) {
          updateData.searched_keywords = [searched_keyword, ...currentKeywords].slice(0, 30)
        }
      }

      // Append or increment audio preview
      if (audio_preview && audio_preview.pack_id) {
        const currentPreviews: any[] = existing.previewed_audio || []
        const idx = currentPreviews.findIndex(
          (p: any) => p.pack_id === audio_preview.pack_id && p.sample_name === audio_preview.sample_name
        )

        if (idx >= 0) {
          const matched = currentPreviews[idx]
          matched.play_count = (matched.play_count || 1) + 1
          matched.played_at = now
          updateData.previewed_audio = [matched, ...currentPreviews.filter((_, i) => i !== idx)]
        } else {
          updateData.previewed_audio = [
            { ...audio_preview, play_count: 1, played_at: now },
            ...currentPreviews
          ].slice(0, 40)
        }
      }

      // Append viewed pack
      if (viewed_pack) {
        const currentPacks: string[] = existing.viewed_packs || []
        if (!currentPacks.includes(viewed_pack)) {
          updateData.viewed_packs = [viewed_pack, ...currentPacks].slice(0, 30)
        }
      }

      // Increment session if last seen was more than 4 hours ago
      const lastSeenTime = new Date(existing.last_seen || 0).getTime()
      if (Date.now() - lastSeenTime > 4 * 60 * 60 * 1000) {
        updateData.session_count = (existing.session_count || 1) + 1
      }

      await adminClient
        .from('user_telemetry')
        .update(updateData)
        .eq('visitor_id', visitor_id)
    }

    return NextResponse.json({
      success: true,
      geo: geoData
    })
  } catch (err: any) {
    console.error('Telemetry heartbeat error:', err)
    return NextResponse.json({ error: 'Failed to process telemetry' }, { status: 500 })
  }
}

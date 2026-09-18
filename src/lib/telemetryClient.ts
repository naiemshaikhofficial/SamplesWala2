'use client'

export interface CookieConsentPreferences {
  accepted: boolean
  analytics: boolean
  personalization: boolean
  functional: boolean
  timestamp: string | null
}

export interface PreviewedTrack {
  pack_id: string
  pack_name: string
  sample_name?: string
  played_at: string
  play_count: number
}

export interface ProducerTelemetryData {
  visitor_id: string
  cookie_consent: CookieConsentPreferences
  daw_preference?: string
  favorite_genres: string[]
  searched_keywords: string[]
  previewed_audio: PreviewedTrack[]
  viewed_packs: string[]
  cart_items: any[]
  device_info: {
    os: string
    browser: string
    device_type: 'mobile' | 'tablet' | 'desktop'
    screen?: string
    timezone?: string
    language?: string
    location?: {
      city?: string
      region?: string
      country?: string
      ip?: string
    }
  }
  traffic_source: {
    referrer: string
    channel?: string
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_term?: string
    utm_content?: string
    gclid?: string
    fbclid?: string
  }
}

const VISITOR_COOKIE_KEY = 'sw_visitor_id'
const CONSENT_COOKIE_KEY = 'sw_cookie_consent'
const LOCAL_PROFILE_KEY = 'sw_producer_profile'
const GEO_STORAGE_KEY = 'sw_geo_location'

export interface DetectedGeoLocation {
  city?: string | null
  region?: string | null
  country?: string | null
  timezone?: string | null
  ip?: string | null
}

export function getDetectedLocation(): DetectedGeoLocation {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(GEO_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return {}
}

export function setDetectedLocation(geo: DetectedGeoLocation) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(GEO_STORAGE_KEY, JSON.stringify(geo))
    window.dispatchEvent(new CustomEvent('sw:geo-updated', { detail: geo }))
  } catch {}
}

function generateUuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'))
  return matches ? decodeURIComponent(matches[1]) : null
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

export function getVisitorId(): string {
  if (typeof window === 'undefined') return ''
  let id = getCookie(VISITOR_COOKIE_KEY) || localStorage.getItem(VISITOR_COOKIE_KEY)
  if (!id) {
    id = generateUuid()
    setCookie(VISITOR_COOKIE_KEY, id)
    try {
      localStorage.setItem(VISITOR_COOKIE_KEY, id)
    } catch {}
  }
  return id
}

export function getConsentPreferences(): CookieConsentPreferences {
  if (typeof window === 'undefined') {
    return { accepted: false, analytics: true, personalization: true, functional: true, timestamp: null }
  }

  const raw = getCookie(CONSENT_COOKIE_KEY) || localStorage.getItem(CONSENT_COOKIE_KEY)
  if (raw) {
    try {
      return JSON.parse(raw)
    } catch {}
  }

  return { accepted: false, analytics: true, personalization: true, functional: true, timestamp: null }
}

export function saveConsentPreferences(prefs: {
  analytics: boolean
  personalization: boolean
  functional: boolean
}) {
  if (typeof window === 'undefined') return
  const consent: CookieConsentPreferences = {
    accepted: true,
    analytics: prefs.analytics,
    personalization: prefs.personalization,
    functional: prefs.functional,
    timestamp: new Date().toISOString()
  }

  const serialized = JSON.stringify(consent)
  setCookie(CONSENT_COOKIE_KEY, serialized)
  try {
    localStorage.setItem(CONSENT_COOKIE_KEY, serialized)
  } catch {}

  // Broadcast consent change event for immediate UI update
  window.dispatchEvent(new CustomEvent('sw:consent-updated', { detail: consent }))
  queueHeartbeat({ cookie_consent: consent })
}

function detectDeviceInfo() {
  if (typeof window === 'undefined') {
    return { os: 'Unknown', browser: 'Unknown', device_type: 'desktop' as const }
  }

  const ua = navigator.userAgent || ''
  let os = 'Unknown'
  if (/windows/i.test(ua)) os = 'Windows'
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS'
  else if (/android/i.test(ua)) os = 'Android'
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS'
  else if (/linux/i.test(ua)) os = 'Linux'

  let browser = 'Unknown'
  if (/edg/i.test(ua)) browser = 'Edge'
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome'
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox'
  else if (/safari/i.test(ua)) browser = 'Safari'

  const width = window.innerWidth
  const device_type: 'mobile' | 'tablet' | 'desktop' = width < 640 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop'

  const timezone = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : undefined
  const language = typeof navigator !== 'undefined' ? navigator.language : undefined

  return {
    os,
    browser,
    device_type,
    screen: `${window.screen?.width || width}x${window.screen?.height || window.innerHeight}`,
    timezone,
    language
  }
}

function detectTrafficSource() {
  if (typeof window === 'undefined') {
    return { referrer: 'Direct', channel: 'Direct' }
  }

  let referrer = document.referrer || 'Direct'
  if (referrer.includes(window.location.hostname)) referrer = 'Internal'

  const params = new URLSearchParams(window.location.search)
  const utm_source = params.get('utm_source') || undefined
  const utm_medium = params.get('utm_medium') || undefined
  const utm_campaign = params.get('utm_campaign') || undefined
  const utm_term = params.get('utm_term') || params.get('keyword') || undefined
  const utm_content = params.get('utm_content') || undefined
  const gclid = params.get('gclid') || undefined
  const fbclid = params.get('fbclid') || undefined

  // Categorize traffic source for clear marketing attribution
  let channel = 'Direct'
  const refLower = referrer.toLowerCase()
  if (gclid || utm_source?.toLowerCase().includes('google') || (refLower.includes('google') && utm_medium === 'cpc')) {
    channel = 'Google Ads (Search/PPC)'
  } else if (refLower.includes('google')) {
    channel = 'Google Search (Organic)'
  } else if (fbclid || refLower.includes('instagram') || utm_source?.toLowerCase().includes('instagram')) {
    channel = 'Instagram (Story/Ad/Bio)'
  } else if (refLower.includes('youtube') || utm_source?.toLowerCase().includes('youtube')) {
    channel = 'YouTube (Beat Tutorial/Desc)'
  } else if (refLower.includes('facebook') || utm_source?.toLowerCase().includes('facebook')) {
    channel = 'Facebook (Feed/Group)'
  } else if (refLower.includes('reddit')) {
    channel = 'Reddit (Producer Forum)'
  } else if (refLower.includes('chatgpt') || refLower.includes('openai')) {
    channel = 'AI / ChatGPT Recommendation'
  } else if (referrer !== 'Direct' && referrer !== 'Internal') {
    channel = 'External Referral'
  }

  return {
    referrer,
    channel,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    gclid,
    fbclid
  }
}

// Local cache of producer profile
export function getLocalProducerProfile(): Partial<ProducerTelemetryData> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(LOCAL_PROFILE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return {
    searched_keywords: [],
    previewed_audio: [],
    viewed_packs: [],
    favorite_genres: [],
    cart_items: []
  }
}

function updateLocalProducerProfile(updater: (prev: Partial<ProducerTelemetryData>) => Partial<ProducerTelemetryData>) {
  if (typeof window === 'undefined') return
  try {
    const prev = getLocalProducerProfile()
    const next = updater(prev)
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(next))
    return next
  } catch {
    return null
  }
}

// Throttled Heartbeat Dispatcher (0 DB spam, batching changes)
let pendingData: any = {}
let heartbeatTimer: any = null
const HEARTBEAT_THROTTLE_MS = 5 * 60 * 1000 // 5 minutes minimum between background heartbeats

function queueHeartbeat(diff: any) {
  if (typeof window === 'undefined') return

  pendingData = { ...pendingData, ...diff }

  // If already scheduled, wait for the batch window
  if (heartbeatTimer) return

  heartbeatTimer = setTimeout(() => {
    heartbeatTimer = null
    const lastFlush = Number(sessionStorage.getItem('sw_last_heartbeat_time') || 0)
    if (Date.now() - lastFlush >= HEARTBEAT_THROTTLE_MS) {
      flushHeartbeat(false)
    }
  }, 15000) // 15s gentle debounce
}

// Flush telemetry on page exit / tab hide without blocking user
if (typeof window !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushHeartbeat(true)
    }
  })
}

export function flushHeartbeat(useBeaconIfPossible = false) {
  if (typeof window === 'undefined') return
  if (Object.keys(pendingData).length === 0) return

  const consent = getConsentPreferences()
  if (consent.accepted && !consent.analytics) {
    pendingData = {}
    return
  }

  const visitor_id = getVisitorId()
  const payload = {
    visitor_id,
    cookie_consent: consent,
    device_info: detectDeviceInfo(),
    traffic_source: detectTrafficSource(),
    ...pendingData
  }

  pendingData = {}
  sessionStorage.setItem('sw_last_heartbeat_time', String(Date.now()))

  try {
    if (useBeaconIfPossible && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
      navigator.sendBeacon('/api/telemetry/heartbeat', blob)
    } else {
      fetch('/api/telemetry/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.geo) {
            setDetectedLocation(data.geo)
          }
        })
        .catch(() => {})
    }
  } catch (e) {
    // Fail silently without disrupting user
  }
}

// Public Tracking Methods
export function trackSearch(keyword: string) {
  if (!keyword || !keyword.trim()) return
  const clean = keyword.trim().toLowerCase()
  if (clean.length < 2) return

  updateLocalProducerProfile((prev) => {
    const current = prev.searched_keywords || []
    const updated = [clean, ...current.filter((k) => k !== clean)].slice(0, 20)
    return { ...prev, searched_keywords: updated }
  })

  queueHeartbeat({ searched_keyword: clean })
}

export function trackAudioPreview(packId: string, packName: string, sampleName?: string) {
  if (!packId || !packName) return

  updateLocalProducerProfile((prev) => {
    const currentPreviews = prev.previewed_audio || []
    const existingIndex = currentPreviews.findIndex((p) => p.pack_id === packId && p.sample_name === sampleName)

    let updated: PreviewedTrack[]
    if (existingIndex >= 0) {
      const existing = currentPreviews[existingIndex]
      updated = [
        {
          ...existing,
          play_count: (existing.play_count || 1) + 1,
          played_at: new Date().toISOString()
        },
        ...currentPreviews.filter((_, i) => i !== existingIndex)
      ]
    } else {
      updated = [
        {
          pack_id: packId,
          pack_name: packName,
          sample_name: sampleName || 'Demo Preview',
          played_at: new Date().toISOString(),
          play_count: 1
        },
        ...currentPreviews
      ].slice(0, 30)
    }

    // Infer genre from pack name
    const genres = prev.favorite_genres || []
    const lowerName = packName.toLowerCase()
    let inferredGenre = ''
    if (lowerName.includes('drill')) inferredGenre = 'Gully Drill'
    else if (lowerName.includes('rhythm') || lowerName.includes('india')) inferredGenre = 'Indian Percussion'
    else if (lowerName.includes('punjab') || lowerName.includes('dhol')) inferredGenre = 'Punjabi Hip-Hop'
    else if (lowerName.includes('tapori') || lowerName.includes('south')) inferredGenre = 'South Tapori'
    else if (lowerName.includes('vocal')) inferredGenre = 'Bollywood Vocals'

    let updatedGenres = genres
    if (inferredGenre && !genres.includes(inferredGenre)) {
      updatedGenres = [inferredGenre, ...genres].slice(0, 10)
    }

    return {
      ...prev,
      previewed_audio: updated,
      favorite_genres: updatedGenres
    }
  })

  queueHeartbeat({
    audio_preview: {
      pack_id: packId,
      pack_name: packName,
      sample_name: sampleName || 'Demo Preview',
      played_at: new Date().toISOString()
    }
  })
}

export function trackPackView(slug: string) {
  if (!slug) return
  updateLocalProducerProfile((prev) => {
    const current = prev.viewed_packs || []
    const updated = [slug, ...current.filter((s) => s !== slug)].slice(0, 20)
    return { ...prev, viewed_packs: updated }
  })
  queueHeartbeat({ viewed_pack: slug })
}

export function trackCartSnapshot(items: any[]) {
  const minimalItems = (items || []).map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    price_usd: item.price_usd,
    slug: item.slug,
    type: item.type
  }))

  updateLocalProducerProfile((prev) => ({ ...prev, cart_items: minimalItems }))
  queueHeartbeat({ cart_items: minimalItems })
}

export function trackDawPreference(daw: string) {
  if (!daw) return
  updateLocalProducerProfile((prev) => ({ ...prev, daw_preference: daw }))
  queueHeartbeat({ daw_preference: daw })
}

export function initTelemetrySession() {
  if (typeof window === 'undefined') return
  const cachedGeo = getDetectedLocation()
  const alreadySynced = sessionStorage.getItem('sw_geo_synced')
  if (alreadySynced || cachedGeo.city || cachedGeo.country) {
    return
  }
  sessionStorage.setItem('sw_geo_synced', 'true')
  queueHeartbeat({})
}

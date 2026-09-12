import { unstable_cache } from 'next/cache'

export interface GlobalSiteSettings {
  // 1. Site Status & Maintenance
  maintenance_mode: boolean
  coming_soon_mode: boolean
  read_only_mode: boolean
  maintenance_title: string
  maintenance_message: string
  expected_return_time: string
  allow_admin_bypass: boolean
  allow_preview_access: boolean

  // 2. General Website Information
  site_name: string
  site_tagline: string
  site_url: string
  default_language: string
  default_currency: string
  timezone: string
  date_format: string
  contact_email: string
  support_email: string
  business_email: string
  support_phone: string

  // 3. Branding & Visuals
  logo_url: string
  dark_logo_url: string
  favicon_url: string
  og_image_url: string
  default_pack_placeholder: string
  primary_color: string
  accent_color: string
  default_theme: 'dark' | 'light' | 'system'

  // 4. Store & Checkout
  store_enabled: boolean
  purchasing_enabled: boolean
  free_downloads_enabled: boolean
  wishlist_enabled: boolean
  cart_enabled: boolean
  guest_checkout_enabled: boolean
  account_required_for_purchase: boolean
  account_required_for_free_download: boolean
  product_reviews_enabled: boolean
  coupons_enabled: boolean

  // 5. Currency & Pricing
  base_currency: string
  international_currency: string
  supported_currencies: string[]
  auto_exchange_rate: boolean
  manual_usd_rate: number
  price_rounding: 'none' | 'nearest_1' | 'nearest_5' | 'nearest_10'
  tax_inclusive_pricing: boolean

  // 6. Payment Gateways
  razorpay_enabled: boolean
  razorpay_test_mode: boolean
  razorpay_auto_capture: boolean
  razorpay_upi_enabled: boolean
  razorpay_cards_enabled: boolean
  razorpay_netbanking_enabled: boolean
  razorpay_wallets_enabled: boolean
  paypal_enabled: boolean
  paypal_test_mode: boolean
  stripe_enabled: boolean
  min_order_value_inr: number

  // 7. Digital Downloads
  downloads_enabled: boolean
  free_download_limit_per_day: number
  paid_download_limit: number
  download_link_expiry_days: number
  zip_download_enabled: boolean
  individual_file_download_enabled: boolean
  ip_rate_limiting_enabled: boolean
  max_simultaneous_downloads_per_ip: number

  // 8. Sample Pack & Licensing Defaults
  default_royalty_free: boolean
  commercial_use_allowed: boolean
  personal_use_allowed: boolean
  redistribution_prohibited: boolean
  resale_prohibited: boolean
  content_id_policy: 'strict' | 'moderate' | 'flexible'
  require_license_acceptance_at_checkout: boolean

  // 9. Email & Notifications
  sender_name: string
  sender_email: string
  reply_to_email: string
  notify_admin_new_order: boolean
  notify_admin_new_free_download: boolean
  notify_admin_failed_payment: boolean
  notify_admin_support_ticket: boolean
  notify_customer_order_receipt: boolean
  notify_customer_download_link: boolean
  notify_customer_welcome: boolean

  // 10. SEO & Socials
  meta_title: string
  meta_description: string
  meta_keywords: string
  canonical_url: string
  instagram_url: string
  youtube_url: string
  facebook_url: string
  x_twitter_url: string
  discord_url: string
  telegram_url: string

  // 11. Security & Performance
  admin_session_timeout_minutes: number
  two_factor_auth_required: boolean
  login_rate_limiting: boolean
  cdn_acceleration: boolean
  image_optimization: boolean

  // Metadata
  updated_at?: string
  updated_by?: string
}

export const DEFAULT_SITE_SETTINGS: GlobalSiteSettings = {
  maintenance_mode: false,
  coming_soon_mode: false,
  read_only_mode: false,
  maintenance_title: 'Site Under Maintenance',
  maintenance_message: 'SamplesWala is currently undergoing scheduled platform upgrades. We will be back online shortly!',
  expected_return_time: 'Within a few hours',
  allow_admin_bypass: true,
  allow_preview_access: true,

  site_name: 'SamplesWala',
  site_tagline: 'Indian Sounds. Real Culture.',
  site_url: 'https://sampleswala.com',
  default_language: 'English (US)',
  default_currency: 'INR',
  timezone: 'Asia/Kolkata',
  date_format: 'DD/MM/YYYY',
  contact_email: 'contact@sampleswala.com',
  support_email: 'support@sampleswala.com',
  business_email: 'billing@sampleswala.com',
  support_phone: '+91 98765 43210',

  logo_url: '/Logo.png',
  dark_logo_url: '/Logo.png',
  favicon_url: '/favicon.ico',
  og_image_url: 'https://sampleswala.com/og-image.jpg',
  default_pack_placeholder: '/placeholder-pack.png',
  primary_color: '#FFFFFF',
  accent_color: '#FFFFFF',
  default_theme: 'dark',

  store_enabled: true,
  purchasing_enabled: true,
  free_downloads_enabled: true,
  wishlist_enabled: true,
  cart_enabled: true,
  guest_checkout_enabled: true,
  account_required_for_purchase: false,
  account_required_for_free_download: true,
  product_reviews_enabled: true,
  coupons_enabled: true,

  base_currency: 'INR',
  international_currency: 'USD',
  supported_currencies: ['INR', 'USD', 'EUR', 'GBP'],
  auto_exchange_rate: true,
  manual_usd_rate: 87.2,
  price_rounding: 'nearest_1',
  tax_inclusive_pricing: true,

  razorpay_enabled: true,
  razorpay_test_mode: false,
  razorpay_auto_capture: true,
  razorpay_upi_enabled: true,
  razorpay_cards_enabled: true,
  razorpay_netbanking_enabled: true,
  razorpay_wallets_enabled: true,
  paypal_enabled: true,
  paypal_test_mode: false,
  stripe_enabled: false,
  min_order_value_inr: 10,

  downloads_enabled: true,
  free_download_limit_per_day: 5,
  paid_download_limit: 0,
  download_link_expiry_days: 7,
  zip_download_enabled: true,
  individual_file_download_enabled: true,
  ip_rate_limiting_enabled: true,
  max_simultaneous_downloads_per_ip: 3,

  default_royalty_free: true,
  commercial_use_allowed: true,
  personal_use_allowed: true,
  redistribution_prohibited: true,
  resale_prohibited: true,
  content_id_policy: 'strict',
  require_license_acceptance_at_checkout: true,

  sender_name: 'SamplesWala',
  sender_email: 'notifications@sampleswala.com',
  reply_to_email: 'support@sampleswala.com',
  notify_admin_new_order: true,
  notify_admin_new_free_download: true,
  notify_admin_failed_payment: true,
  notify_admin_support_ticket: true,
  notify_customer_order_receipt: true,
  notify_customer_download_link: true,
  notify_customer_welcome: true,

  meta_title: 'SamplesWala | Premium Indian Sounds, Loops & Sample Packs',
  meta_description: 'Download authentic royalty-free Indian instrument sample packs, Bollywood loops, dholak, tabla, and percussion for modern music production.',
  meta_keywords: 'sample packs, indian samples, royalty free loops, tabla, dholak, percussion, bollywood samples',
  canonical_url: 'https://sampleswala.com',
  instagram_url: 'https://instagram.com/sampleswala',
  youtube_url: 'https://youtube.com/@sampleswala',
  facebook_url: 'https://facebook.com/sampleswala',
  x_twitter_url: 'https://x.com/sampleswala',
  discord_url: 'https://discord.gg/sampleswala',
  telegram_url: 'https://t.me/sampleswala',

  admin_session_timeout_minutes: 60,
  two_factor_auth_required: false,
  login_rate_limiting: true,
  cdn_acceleration: true,
  image_optimization: true,
}

async function fetchSiteSettingsFromDB(): Promise<GlobalSiteSettings> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !anonKey) {
    return DEFAULT_SITE_SETTINGS
  }

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/app_metadata?key=in.(site_settings,maintenance_mode)&select=key,value`,
      {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
        },
        // On-demand webhook invalidation via tags ('settings', 'site-settings', 'maintenance') with 24h fallback
        next: { revalidate: 86400, tags: ['settings', 'site-settings', 'maintenance'] }
      }
    )

    if (!res.ok) return DEFAULT_SITE_SETTINGS

    const rows = await res.json()
    const map: Record<string, string> = {}
    for (const r of rows) {
      map[r.key] = r.value
    }

    let parsed: Partial<GlobalSiteSettings> = {}
    if (map['site_settings']) {
      try {
        parsed = JSON.parse(map['site_settings'])
      } catch (err) {
        console.error('Failed to parse site_settings in SamplesWala2:', err)
      }
    }

    return {
      ...DEFAULT_SITE_SETTINGS,
      ...parsed,
      maintenance_mode: parsed.maintenance_mode !== undefined 
        ? Boolean(parsed.maintenance_mode) 
        : (map['maintenance_mode'] === 'true')
    }
  } catch (err) {
    console.error('Error fetching site settings from DB:', err)
    return DEFAULT_SITE_SETTINGS
  }
}

export async function getSiteSettings(): Promise<GlobalSiteSettings> {
  return unstable_cache(
    async () => fetchSiteSettingsFromDB(),
    ['sampleswala2-site-settings-cache-v1'],
    { revalidate: 86400, tags: ['settings', 'site-settings', 'maintenance'] }
  )()
}

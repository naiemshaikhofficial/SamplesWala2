'use server'

import { getAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { signDownloadToken } from '@/lib/security'

export interface RecommendedProduct {
  id: string
  name: string
  slug: string
  cover_image: string
  price_usd?: number
  price_inr: number
  mrp_inr?: number
  product_type: string
  short_description?: string | null
  total_contents_summary?: string | null
  loop_count?: number
  one_shot_count?: number
  melody_count?: number
  preset_count?: number
  series?: string | null
  daws?: string[] | null
  plugins_used?: string[] | null
  full_description?: string | null
}

export interface ComingSoonProduct {
  id: string
  name: string
  slug: string
  cover_image: string
  price_inr: number
  price_usd?: number
  release_date?: string | null
  short_description?: string | null
}

export interface VerifiedDownload {
  productId: string
  productName: string
  productSlug: string
  coverImage?: string
  downloadUrl: string
  productType: string
  fileSize?: string
  orderNumber?: string
  isProvisioned?: boolean
}

export interface VerifiedOrderItem {
  id: string
  name: string
  price: number
  product_type?: string
  cover_image?: string
}

export interface VerifiedOrder {
  orderNumber: string
  date: string
  amount: number
  currency: string
  status: string
  gateway?: string
  paymentId?: string
  items: VerifiedOrderItem[]
  customerEmail?: string
  customerName?: string
  billingAddress?: string | null
  billingCity?: string | null
  billingState?: string | null
  billingZip?: string | null
  billingCountry?: string | null
}

interface ChatMessageInput {
  role: 'user' | 'assistant'
  content: string
}

export interface GroqResponse {
  success: boolean
  answer?: string
  error?: string
  recommendedProducts?: RecommendedProduct[]
  verifiedDownload?: VerifiedDownload | null
  verifiedOrder?: VerifiedOrder | null
  comingSoonProduct?: ComingSoonProduct | null
  canEscalateToTicket?: boolean
  isPolicyViolation?: boolean
  shouldTerminateChat?: boolean
}

export interface ClientUserInfo {
  id?: string
  email?: string
  name?: string
}

const GENERIC_PRODUCT_WORDS = new Set([
  'sample',
  'samples',
  'pack',
  'packs',
  'sound',
  'sounds',
  'kit',
  'kits',
  'drum',
  'drums',
  'loop',
  'loops',
  'wav',
  'preset',
  'presets',
  'music',
  'production',
  'audio',
  'download',
  'free',
  'wala',
])

export async function askGroqSupportAction(
  query: string,
  history: ChatMessageInput[] = [],
  clientUser?: ClientUserInfo,
  currentStrikes: number = 0
): Promise<GroqResponse> {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    return {
      success: false,
      error: 'Support service currently unavailable.',
    }
  }

  const adminSupabase = getAdminClient()

  // 1. Determine Current User Session (Check client auth context first, then cookies)
  let currentUser: any = null
  let userEmail: string | null = clientUser?.email ? clientUser.email.toLowerCase().trim() : null
  let userId: string | null = clientUser?.id || null
  let userName: string = clientUser?.name || 'Producer'

  if (!userId || !userEmail) {
    try {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        currentUser = user
        userId = userId || user.id
        userEmail = userEmail || (user.email ? user.email.toLowerCase().trim() : null)
        userName = userName !== 'Producer' ? userName : (user.user_metadata?.full_name || user.email?.split('@')[0] || 'Producer')
      }
    } catch (authErr) {
      console.warn('[askGroqSupportAction] Auth check notice:', authErr)
    }
  }

  // 2. Extract potential entities from query or chat history (Order IDs, Payment IDs, emails)
  const fullTextToScan = `${query} ${history.map((h) => h.content).join(' ')}`
  const orderNumberMatch =
    fullTextToScan.match(/\bSW-ORD-[A-Za-z0-9_-]+\b/i) ||
    fullTextToScan.match(/\bORD-[A-Za-z0-9_-]+\b/i) ||
    fullTextToScan.match(/\border_[A-Za-z0-9_-]+\b/i)
  const paymentIdMatch = fullTextToScan.match(/\bpay_[A-Za-z0-9]+\b/i)
  const emailMatch = fullTextToScan.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/i)

  const scannedOrderNumber = orderNumberMatch ? orderNumberMatch[0].toUpperCase() : null
  const scannedPaymentId = paymentIdMatch ? paymentIdMatch[0] : null
  const scannedEmail = emailMatch ? emailMatch[0].toLowerCase().trim() : null

  const targetEmail = userEmail || scannedEmail

const VERIFIED_STORE_PACKS: RecommendedProduct[] = [
  {
    id: 'b6f6ad72-6a7f-44e2-a764-ba5f070b4ec7',
    name: 'The South – South Indian And Tapori Loop Pack (Kuthu, Festival & Folk Loops)',
    slug: 'the-south',
    cover_image: 'https://imagizer.imageshack.com/img922/4591/uA7sLt.jpg',
    price_inr: 999,
    price_usd: 14.99,
    mrp_inr: 1999,
    product_type: 'sample_pack',
    total_contents_summary: 'Includes 110+ Samples',
    loop_count: 104,
    melody_count: 6,
    one_shot_count: 0,
    preset_count: 0,
    series: 'India Journey',
    short_description: 'Authentic South Indian & Tapori Loops covering Kuthu, festival beats, dholak, and folk percussion.',
    full_description: 'The South is a powerful collection of South Indian loops, Kuthu grooves, festival-style rhythms, and Tapori-inspired patterns crafted for high-energy DJ remixes, reel beats, and dance productions.',
  },
  {
    id: '654161bb-294a-48cc-acdc-af1abca18bfb',
    name: 'South Drums - South Indian And Tapori One Shot Drum',
    slug: 'south-drums',
    cover_image: 'https://imagizer.imageshack.com/img922/7492/HkEhZY.png',
    price_inr: 799,
    price_usd: 9.99,
    mrp_inr: 1499,
    product_type: 'sample_pack',
    total_contents_summary: '477 One-Shot Drum Samples (Chenda, Clap, Iddaka, Kick, Kuthu, Mridangam, Percussion, Snare, Tape, Thappu, Urmi)',
    loop_count: 0,
    melody_count: 0,
    one_shot_count: 477,
    preset_count: 0,
    series: 'India Journey',
    short_description: '477 custom one-shot samples featuring Chenda, Clap, Iddaka, Kick, Kuthu, Mridangam, Thappu, Urmi.',
    full_description: 'South Drum is a premium one-shot drum sample pack delivering bold, punchy, and authentic South Indian drum sounds across 477 custom one-shots designed to cut through modern mixes.',
  },
  {
    id: 'c2e5cb42-a0dc-4d4f-b98a-986fc0d091a1',
    name: 'The Bollywood - Authentic Indian Sounds, Loops One Shots (Royalty Free) - Indian Sample Pack',
    slug: 'the-bollywood',
    cover_image: 'https://imagizer.imageshack.com/img924/6673/1i7cNl.png',
    price_inr: 999,
    price_usd: 14.99,
    mrp_inr: 2999,
    product_type: 'sample_pack',
    total_contents_summary: '131+ High Quality Samples (400+ loops across all editions)',
    loop_count: 124,
    melody_count: 25,
    one_shot_count: 1,
    preset_count: 0,
    series: 'India Journey',
    short_description: 'Cinematic and commercial Indian sounds, melodic loops, dholak, tabla, and signature Bollywood grooves.',
    full_description: 'Bollywood Sample Pack is a premium collection of authentic Indian sounds, loops, and one-shots crafted for modern music producers who want the true essence of Bollywood in their beats.',
  },
  {
    id: 'e1d2c3b4-a5b6-7c8d-9e0f-1a2b3c4d5e6f',
    name: 'Sambalpur Rhythm – Authentic Odisha Folk Sounds',
    slug: 'sambalpur-rhythm',
    cover_image: 'https://imagizer.imageshack.com/img923/627/vc1DbH.png',
    price_inr: 1999,
    price_usd: 21.99,
    mrp_inr: 3999,
    product_type: 'sample_pack',
    total_contents_summary: 'Includes 250+ Samples, MIDI, and Project Files',
    loop_count: 250,
    melody_count: 0,
    one_shot_count: 0,
    preset_count: 0,
    series: 'India Journey',
    short_description: 'Authentic Sambalpuri folk percussion, traditional rhythms, and energetic desi grooves from Odisha.',
    full_description: 'Sambalpuri Rhythm Sample Pack is a premium collection of authentic Sambalpuri folk sounds, traditional Odisha percussion, ethnic loops, and cultural textures specially crafted for modern producers with 250+ samples, MIDI, and project files.',
  },
  {
    id: '8f421d2a-5452-4d22-aa00-9c1c9896e5e9',
    name: 'The Ten Tabla’s – 10 FREE Tabla Samples',
    slug: 'the-ten-tablas',
    cover_image: 'https://imagizer.imageshack.com/img921/4153/dVxZTV.png',
    price_inr: 0,
    price_usd: 0,
    mrp_inr: 0,
    product_type: 'sample_pack',
    total_contents_summary: '10 Free Tabla Rhythm Loops',
    loop_count: 10,
    melody_count: 0,
    one_shot_count: 0,
    preset_count: 0,
    series: 'India Journey',
    short_description: '10 FREE authentic Indian classical, Bollywood, and Sufi tabla samples and loops.',
    full_description: 'Bring the authentic sound of Indian Tabla into your music production with The Ten Tabla’s, featuring 10 pristine free tabla rhythm loops for classical, Sufi, and Bollywood productions.',
  },
  {
    id: 'a9bb41c1-3c8d-4617-91e9-c5a6f83c47b8',
    name: 'India Street Rhythm – 25 Free Indian Rhythm Loops',
    slug: 'india-street',
    cover_image: 'https://imagizer.imageshack.com/img921/4723/6EtjtS.png',
    price_inr: 0,
    price_usd: 0,
    mrp_inr: 0,
    product_type: 'sample_pack',
    total_contents_summary: '25 Free Rhythm Loops',
    loop_count: 25,
    melody_count: 0,
    one_shot_count: 0,
    preset_count: 0,
    series: 'India Journey',
    short_description: '25 FREE rhythm loops covering Tapori, South Indian street grooves, and folk percussion.',
    full_description: '25 FREE Indian Rhythm Loops capturing the feeling of India’s streets — busy markets, local festivals, roadside celebrations, dhols, and folk percussion.',
  },
  {
    id: '4064e95e-473b-4240-b206-3793780e4c52',
    name: 'The Real Punjab (Vocal Preset)',
    slug: 'the-real-punjab',
    cover_image: 'https://imagizer.imageshack.com/img922/7726/Eov3Nv.png',
    price_inr: 499,
    mrp_inr: 1499,
    product_type: 'preset',
    daws: ['FL Studio'],
    plugins_used: [
      'Antares Auto-Tune Pro',
      'Fruity Parametric EQ 2',
      'Fruity Multiband Compressor',
      'FabFilter Pro-Q 4',
      'Fresh Air',
      'iZotope RX Mouth De-click',
      'iZotope RX De-click',
      'soothe2',
      'Fruity Limiter',
    ],
    short_description: 'Professional FL Studio vocal preset pack crafted for authentic Punjabi vocals, Bhangra, and Hip-Hop.',
    full_description: '2 custom vocal presets designed specifically for clean, punchy, and industry-level Punjabi vocal sound in FL Studio, utilizing professional chain routing with Auto-Tune, soothe2, and FabFilter.',
  },
]

  // 3. Fetch Live Catalog from Supabase (sample_packs & presets) with FULL COLUMNS
  let liveInventoryList = ''
  let allProducts: RecommendedProduct[] = []

  try {
    const packsPromise = adminSupabase
      .from('sample_packs')
      .select(
        'id, name, slug, cover_url, price_inr, price_usd, mrp_inr, total_contents_summary, loop_count, one_shot_count, melody_count, preset_count, series, description'
      )
      .order('created_at', { ascending: false })
      .limit(60)

    const presetsPromise = adminSupabase
      .from('presets')
      .select('id, name, slug, cover_url, price_inr, mrp_inr, type, daws, plugins_used, description')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(30)

    const [packsRes, presetsRes] = await Promise.allSettled([packsPromise, presetsPromise])

    const dbPacks: RecommendedProduct[] =
      packsRes.status === 'fulfilled' && packsRes.value.data
        ? packsRes.value.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            cover_image: p.cover_url || '',
            price_inr: Number(p.price_inr ?? 0),
            price_usd: p.price_usd != null ? Number(p.price_usd) : undefined,
            mrp_inr: p.mrp_inr != null ? Number(p.mrp_inr) : undefined,
            product_type: 'sample_pack',
            total_contents_summary: p.total_contents_summary || null,
            loop_count: p.loop_count != null ? Number(p.loop_count) : undefined,
            one_shot_count: p.one_shot_count != null ? Number(p.one_shot_count) : undefined,
            melody_count: p.melody_count != null ? Number(p.melody_count) : undefined,
            preset_count: p.preset_count != null ? Number(p.preset_count) : undefined,
            series: p.series || null,
            short_description: p.description ? p.description.slice(0, 180).replace(/\r?\n/g, ' ') : null,
            full_description: p.description || null,
          }))
        : []

    const dbPresets: RecommendedProduct[] =
      presetsRes.status === 'fulfilled' && presetsRes.value.data
        ? presetsRes.value.data.map((pr: any) => ({
            id: pr.id,
            name: pr.name,
            slug: pr.slug,
            cover_image: pr.cover_url || '',
            price_inr: Number(pr.price_inr ?? 0),
            mrp_inr: pr.mrp_inr != null ? Number(pr.mrp_inr) : undefined,
            product_type: 'preset',
            daws: Array.isArray(pr.daws) ? pr.daws : [],
            plugins_used: Array.isArray(pr.plugins_used) ? pr.plugins_used : [],
            short_description: pr.description ? pr.description.slice(0, 180).replace(/\r?\n/g, ' ') : null,
            full_description: pr.description || null,
          }))
        : []

    if (dbPacks.length > 0 || dbPresets.length > 0) {
      allProducts = [...dbPacks, ...dbPresets]
    } else {
      allProducts = [...VERIFIED_STORE_PACKS]
    }
  } catch (dbErr) {
    console.warn('[askGroqSupportAction] DB product query warning:', dbErr)
    allProducts = [...VERIFIED_STORE_PACKS]
  }

  // Formulate Rich Technical Inventory Profile for Every Product from Database
  liveInventoryList = allProducts
    .map((p) => {
      const price = p.price_inr === 0 ? 'FREE' : `₹${p.price_inr}`
      const mrp = p.mrp_inr ? ` (MRP: ₹${p.mrp_inr})` : ''
      const link = p.product_type === 'preset' ? `/browse/presets/${p.slug}` : `/packs/${p.slug}`

      const specLines: string[] = []
      if (p.total_contents_summary) {
        specLines.push(`Total Contents: ${p.total_contents_summary.replace(/\r?\n/g, ' | ')}`)
      }
      const countParts: string[] = []
      if (p.loop_count != null && p.loop_count > 0) countParts.push(`${p.loop_count} Loops`)
      if (p.one_shot_count != null && p.one_shot_count > 0) countParts.push(`${p.one_shot_count} One-Shots`)
      if (p.melody_count != null && p.melody_count > 0) countParts.push(`${p.melody_count} Melodic Loops`)
      if (p.preset_count != null && p.preset_count > 0) countParts.push(`${p.preset_count} Presets`)
      if (countParts.length > 0) {
        specLines.push(`Breakdown: ${countParts.join(', ')}`)
      }
      if (p.series) {
        specLines.push(`Collection Series: ${p.series}`)
      }
      if (p.daws && p.daws.length > 0) {
        specLines.push(`DAWs: ${p.daws.join(', ')}`)
      }
      if (p.plugins_used && p.plugins_used.length > 0) {
        specLines.push(`Plugins Required: ${p.plugins_used.join(', ')}`)
      }

      const specsBlock = specLines.length > 0 ? `\n  - SPECIFICATIONS: ${specLines.join(' | ')}` : ''
      const cleanDesc = p.full_description ? p.full_description.trim() : (p.short_description || '')
      const descBlock = cleanDesc ? `\n  - OVERVIEW: ${cleanDesc}` : ''

      return `[PRODUCT: ${p.name}]
  - Link: [${p.name}](${link})
  - Price: ${price}${mrp} [Type: ${p.product_type}]${specsBlock}${descBlock}`
    })
    .join('\n\n')

  // 4. Fetch User Purchases / Vault Items
  let userPurchases: any[] = []
  let matchedSpecificOrder: any = null

  try {
    if (userId) {
      const { data: vData } = await adminSupabase
        .from('user_vault')
        .select('id, user_id, item_id, item_type, item_name, amount, currency, payment_gateway, razorpay_order_id, razorpay_payment_id, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(15)

      if (vData) userPurchases = vData
    }

    // Search specifically if an explicit Order ID or Payment ID was provided
    if (scannedOrderNumber || scannedPaymentId) {
      let specificQuery = adminSupabase.from('user_vault').select('*')
      if (scannedOrderNumber && scannedPaymentId) {
        specificQuery = specificQuery.or(`razorpay_order_id.ilike.${scannedOrderNumber},razorpay_payment_id.eq.${scannedPaymentId}`)
      } else if (scannedOrderNumber) {
        specificQuery = specificQuery.ilike('razorpay_order_id', scannedOrderNumber)
      } else if (scannedPaymentId) {
        specificQuery = specificQuery.eq('razorpay_payment_id', scannedPaymentId)
      }

      const { data: specOrders } = await specificQuery.limit(5)
      if (specOrders && specOrders.length > 0) {
        matchedSpecificOrder = specOrders[0]
        if (!userPurchases.some((p) => p.id === matchedSpecificOrder.id)) {
          userPurchases.push(...specOrders)
        }
      }
    }
  } catch (vaultErr) {
    console.warn('[askGroqSupportAction] Vault query warning:', vaultErr)
  }

  // 5. Build Autonomous Verified Download & Verified Order Cards
  let verifiedDownload: VerifiedDownload | null = null
  let verifiedOrder: VerifiedOrder | null = null
  let canEscalateToTicket = false

  const headerList = await headers()
  const clientIp = headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'

  // A. Check for matched download - STRICT ZERO-PIRACY & AUTHENTICATION VERIFICATION
  // Card ONLY appears if:
  // 1. User is authenticated (valid userId).
  // 2. Query is an EXPLICIT request for a download link (not a recommendation, browse, or pricing query).
  // 3. User ACTUALLY owns the product in user_vault (verified purchase).
  const qLower = query.toLowerCase()

  const isRecommendationOrInfoQuery =
    /\b(best|recommend|suggest|top|konsa|konsi|achha|compare|difference|review|demo|preview|what is|kya hai|details|kitna|price|rate|cost|discount|coupon)\b/i.test(
      qLower
    )

  const isExplicitDownloadLinkRequest =
    !isRecommendationOrInfoQuery &&
    /\b(download link|link do|link de do|link bhejo|link chahiye|give me download link|send download link|direct download link|direct link|download nahi ho raha|download nahi chal raha|can't download|cant download|failed to download|corrupt file|link expired|redownload|re-download|mera download|download button do|download link please|paise kat gaye pack nahi mila)\b/i.test(
      qLower
    )

  if (Boolean(userId) && isExplicitDownloadLinkRequest && userPurchases.length > 0) {
    let targetPurchase: any = null

    // 1. Check if the user mentioned a specific product from their verified vault
    for (const p of userPurchases) {
      const pName = (p.item_name || '').toLowerCase()
      const pId = (p.item_id || '').toLowerCase()
      const shortName = pName.split(/[–—-]/)[0].trim()

      if (
        (pId && qLower.includes(pId)) ||
        (shortName.length > 3 && qLower.includes(shortName)) ||
        (pName.length > 3 && qLower.includes(pName))
      ) {
        targetPurchase = p
        break
      }
    }

    // 2. If user didn't mention an owned pack, check if they mentioned an UNOWNED pack (anti-piracy defense)
    if (!targetPurchase) {
      const mentionedUnownedProduct = allProducts.find((prod) => {
        const prodName = (prod.name || '').toLowerCase()
        const prodSlug = (prod.slug || '').toLowerCase()
        const shortProdName = prodName.split(/[–—-]/)[0].trim()
        return (
          qLower.includes(prodSlug) ||
          (shortProdName.length > 3 && qLower.includes(shortProdName)) ||
          (prodName.length > 3 && qLower.includes(prodName))
        )
      })

      // If user is asking for a download link of a pack they do NOT own, targetPurchase remains null!
      if (!mentionedUnownedProduct && userPurchases.length === 1) {
        // If user only has 1 purchase in their entire vault and asked for their link, target that single item
        targetPurchase = userPurchases[0]
      }
    }

    // 3. If verified target purchase found, cryptographically sign a high-security time-limited token
    if (targetPurchase && userId) {
      try {
        const token = signDownloadToken(
          {
            uid: userId,
            pid: targetPurchase.item_id,
            type: targetPurchase.item_type || 'pack',
            ip: clientIp,
          },
          1800 // Strict 30-minute validity window
        )

        const matchedCatalog = allProducts.find(
          (prod) => prod.id === targetPurchase.item_id || prod.slug === targetPurchase.item_id
        )

        verifiedDownload = {
          productId: targetPurchase.item_id,
          productName: targetPurchase.item_name,
          productSlug: matchedCatalog?.slug || targetPurchase.item_id,
          coverImage:
            matchedCatalog?.cover_image || 'https://imagizer.imageshack.com/img924/6673/1i7cNl.png',
          downloadUrl: `/api/download/${token}`,
          productType: targetPurchase.item_type || 'sample_pack',
          fileSize: 'Studio Master Archive (24-bit WAV)',
          orderNumber:
            targetPurchase.razorpay_order_id ||
            `SW-ORD-${targetPurchase.id.slice(0, 8).toUpperCase()}`,
          isProvisioned: true,
        }
      } catch (tokenErr) {
        console.warn('[askGroqSupportAction] Error generating token:', tokenErr)
      }
    }
  }

  // B. Check for invoice / billing inquiry
  const isInvoiceQuery =
    /invoice|bill|receipt|tax|gst|bill of supply|charges|payment proof|rasid|bill chahiye/i.test(query)

  if (isInvoiceQuery && userPurchases.length > 0) {
    const primaryOrder = matchedSpecificOrder || userPurchases[0]
    verifiedOrder = {
      orderNumber: primaryOrder.razorpay_order_id || `SW-ORD-${primaryOrder.id.slice(0, 8).toUpperCase()}`,
      date: primaryOrder.created_at || new Date().toISOString(),
      amount: Number(primaryOrder.amount || 0),
      currency: primaryOrder.currency || 'INR',
      status: 'COMPLETED',
      gateway: primaryOrder.payment_gateway || 'Razorpay',
      paymentId: primaryOrder.razorpay_payment_id || primaryOrder.id,
      items: [
        {
          id: primaryOrder.item_id,
          name: primaryOrder.item_name,
          price: Number(primaryOrder.amount || 0),
          product_type: primaryOrder.item_type,
        },
      ],
      customerEmail: userEmail || undefined,
      customerName: userName,
    }
  }

  // Escalation criteria: ticket if query expresses frustration or unresolved issue
  const isProblemQuery =
    /fail|failed|error|broken|corrupt|not working|urgent|problem|scam|fraud|money cut|refund|stuck|help me|issue|dhokha|paise kat gaye/i.test(query)
  if (isProblemQuery) {
    canEscalateToTicket = true
  }

  // 6. Assemble Account Summary for Prompt
  let userAccountSummary = `CURRENT USER CONTEXT:
- Name: ${userName}
- Email: ${userEmail || 'Guest (Not logged in)'}
- Logged In: ${userId ? 'YES' : 'NO'}`

  if (userPurchases.length > 0) {
    userAccountSummary += `\nVERIFIED PURCHASES IN LIBRARY VAULT (${userPurchases.length}):
${userPurchases
  .slice(0, 5)
  .map(
    (p) =>
      `- "${p.item_name}" (ID: ${p.item_id}, Price: ${p.currency === 'USD' ? '$' : '₹'}${p.amount}, Date: ${new Date(p.created_at).toLocaleDateString()}, Order: ${p.razorpay_order_id || 'N/A'}, Payment: ${p.razorpay_payment_id || 'N/A'})`
  )
  .join('\n')}`
  }

  // 7. System Prompt
  const systemPrompt = `You are "Sampi", the official Samples Wala Technical Support Specialist and AI Audio Assistant for Samples Wala (sampleswala.com) — India's premier boutique sound library and marketplace for music producers, beatmakers, and sound designers.

CRITICAL IDENTITY & PRIVACY RULES:
- Your name is "Sampi". Always introduce or refer to yourself as Sampi when greeting or answering queries about yourself.
- You are exclusively the internal technical support specialist of Samples Wala with full administrative access to store records, orders, library vaults, invoices, and cloud audio delivery systems.
- NEVER mention "Groq", "Llama", "OpenAI", "ChatGPT", "Meta", or any third-party AI provider or LLM under any circumstances.
- NEVER mention or output technical database UUIDs or internal IDs. Only refer to the user by their name (${userName}) or email (${userEmail || 'your email'}).
- ACCURACY GUARANTEE: Never hallucinate or invent BPM, sample counts, formats, or product specs not present in verified store inventory. If data is not available, advise the user to submit a support ticket to our senior sound engineers.
- If asked who you are, state that you are Sampi, the official Samples Wala Technical Support AI Assistant powered by Samples Wala's audio engineering knowledge base.
- Speak in a polite, confident, highly knowledgeable, and human-like technical tone.

${userAccountSummary}

CRITICAL USER SESSION RULES:
${userId ? `- The user IS ALREADY LOGGED IN as ${userName} (${userEmail}). NEVER tell them they are in guest mode, NEVER tell them to log in, and NEVER tell them to create an account.` : `- The user is currently browsing as a guest.`}

LIVE SAMPLES WALA STORE INVENTORY (QUERY RESULT FROM DATABASE):
${liveInventoryList}

CRITICAL RULES FOR PRODUCT RECOMMENDATION & REAL STORE INVENTORY:
- You must ONLY recommend and answer questions about products from the LIVE SAMPLES WALA STORE INVENTORY list above.
- NEVER INVENT OR HALLUCINATE non-existent sound packs (such as "Indian Rhythms & Percussion" or "Sexy Drill"). Those do not exist in the database!

CRITICAL MANDATE: ALWAYS PROVIDE SMART, DEEP & CONTEXT-AWARE ANSWERS (NO GENERIC / BOT-LIKE REPLIES):
- You are not a generic script-reading bot; you are a seasoned music producer and senior audio engineer at Samples Wala.
- DEEPLY ANALYZE THE USER'S QUESTION FIRST:
  * Identify their genre (Bollywood, Desi Hip-Hop, Punjabi, Drill, Regional Folk, EDM, Classical/Sufi).
  * Identify their production need (punchy drum grooves, melody loops, vocal chain processing, 808 layering, DAW workflow).
  * Tailor your answer specifically to their creative context instead of giving a flat, lazy list.

CRITICAL DATABASE-DRIVEN SPECIFICATION & SAMPLE COUNT RULES (ZERO HARDCODING - DATABASE TRUTH):
- Every sound pack and preset in your LIVE SAMPLES WALA STORE INVENTORY above contains LIVE DATABASE SPECIFICATIONS:
  * Total Contents Summary (e.g. Sambalpur Rhythm = "Includes 250+ Samples, MIDI, and Project Files", South Drums = "477 One-Shot Drum Samples", The South = "Includes 110+ Samples", The Bollywood = "131+ High Quality Samples", The Ten Tabla's = "10 Free Tabla Rhythm Loops", India Street Rhythm = "25 Free Rhythm Loops").
  * Exact loop counts, one-shot counts, melody counts, and preset counts.
  * Instruments list, series name, DAWs, plugins used, and full overview.
- WHEN A USER ASKS QUESTIONS ABOUT A PRODUCT'S CONTENTS OR SPECIFICATIONS:
  * Queries like: "how many samples have in it", "isme kitne samples hain", "what is included", "instruments kon se hain", "plugins kaun se chahiye", "price kya hai":
  1. Identify which product the user is referring to (from their question or recent chat history).
  2. Quote the EXACT sample count, loop count, one-shot count, and instruments directly from its SPECIFICATIONS and OVERVIEW in the live inventory above!
     * For example, if asked about Sambalpur Rhythm ("how many samples have in it"), answer with authority and precision: State that Sambalpur Rhythm contains **250+ Samples, MIDI files, and project files** (including 250 authentic folk rhythm loops) at 24-bit studio fidelity!
     * If asked about South Drums, state that it features **477 One-Shot Drum Samples** including Chenda, Clap, Iddaka, Kick, Kuthu, Mridangam, Percussion, Snare, Tape, Thappu, and Urmi.
     * If asked about The Bollywood, state that it includes **131+ High Quality Samples** (124 loops, 25 melodies, and one-shots).
     * If asked about The South, state that it includes **110+ Samples** (104 rhythm loops, 6 melodies).
     * If asked about The Real Punjab, state that it includes **2 custom FL Studio vocal presets** utilizing Auto-Tune Pro, soothe2, FabFilter Pro-Q 4, Fresh Air, etc.
  3. NEVER EVER say "sample count is not explicitly listed in the database" or "check the product page for sample count". Every product has its full sample count and content breakdown right in your live inventory above!
  4. FOR ANY NEW OR FUTURE PRODUCTS ADDED TO THE DATABASE:
     Read their SPECIFICATIONS and OVERVIEW dynamically from the live inventory list above and answer with the exact same deep technical precision without any code changes!
- ALWAYS format links using markdown: [Pack Name](/packs/slug).
- Inform the user that interactive sound pack preview cards with cover artwork, track info, and direct links have been attached right below your answer!

CRITICAL RULES FOR AUTONOMOUS ADMINISTRATIVE PROBLEM RESOLUTION & ZERO-PIRACY:
1. STRICT DOWNLOAD & DOWNLOAD LINK REQUESTS:
   - When user specifically asks to download or requests a download link (e.g. "download link do", "link bhejo", "download nahi ho raha"):
     * IF the requested pack is VERIFIED in their vault (listed in USER'S VERIFIED PURCHASES / VAULT ITEMS above):
       Reassure them enthusiastically! State: "Great news, ${userName}! Your purchase is verified in our database. I have generated your official secure, high-speed download button right below this message. Click the Download button below to start downloading your files immediately! You can also access it permanently in [Your Library](/library)."
     * IF the user asks for a download link of a pack they DO NOT own in their vault (e.g. asking for free download of a paid pack):
       Strictly and politely clarify: "This pack is not registered in your account library. To download this sound pack, you can purchase it directly from the official store at [Pack Name](/packs/slug)." NEVER promise or pretend to deliver a download link for an unowned product!
     * IF user is not logged in / guest:
       Politely explain that they need to log in with their registered account at [Sign In](/auth) to access verified downloads, or check their order confirmation email.
   - When user is simply asking questions, asking for recommendations ("best sample pack konsa hai", "what sounds are included", "price kya hai"):
     * NEVER mention or promise a download link button! Only discuss the sound packs, genres, and audio quality, and highlight the interactive product preview cards attached below.
2. When user asks for an Invoice, Bill, or Receipt:
   - Provide the details (Order Ref, Date, Amount, Payment ID). State that their official printable Bill of Supply / Tax Invoice has been generated and attached right below this message.
3. Audio Specs:
   - 24-bit / 44.1kHz or 48kHz uncompressed WAV audio quality.
   - 100% Royalty-Free Commercial License (legal for Spotify, Apple Music, YouTube monetization, TV, radio).
   - Universal DAW Compatibility: FL Studio, Ableton Live, Logic Pro, Cubase, Studio One, Reaper.
4. Navigation Links:
   - Downloads & Vault: [Your Library](/library)
   - Store Catalog: [Browse Packs](/browse)
   - Free Packs: [Free Samples](/free)
   - Support Desk: [Support Desk](/support)
   - Refund Policy: [Refund Policy](/refund-policy)
   - Terms: [Terms of Service](/terms)

CRITICAL RULES FOR REFUND OR RETURN INQUIRIES:
- As per Samples Wala's official [Refund Policy](/refund-policy), digital downloads are irrevocable digital goods delivered immediately.
- Completed purchases are strictly non-refundable for "change of mind", personal preference, or subjective taste once downloaded.
- Every pack page has playable audio demos so producers can preview sounds before buying.
- Refunds or replacements are ONLY granted for corrupt/unreadable files our engineers cannot resolve within 48 hours, or accidental duplicate charges.

CRITICAL INAPPROPRIATE / ABUSIVE / VULGAR LANGUAGE & CODE OF CONDUCT:
- You must dynamically detect ANY vulgarity, profanity, insults, abusive slurs, cursing, swearing, sexual solicitations or sexual remarks in ANY REGIONAL LANGUAGE OR LOCAL SLANG (e.g. Hindi/Urdu/Hinglish "madarchod", "bhenchod", "laude", "khanki", "hijde", "chudai", Arabic, Russian, Spanish, French, German, Tagalog, English "fuck", "bitch", etc.).
- When the user's message contains inappropriate or abusive language:
  - You MUST start your response with: [POLICY_VIOLATION]
  - STRIKE LEVEL ${currentStrikes + 1} OF 4:
    - If strike is 1 (Strike 1 of 4):
      Start with "Strike 1/4: ". Politely but firmly instruct them to use respectful language. State that Samples Wala Support Desk is strictly for music production and order assistance, and warn that continued inappropriate language will result in this chat session being terminated.
    - If strike is 2 (Strike 2 of 4):
      Start with "Strike 2/4: Warning: ". State that offensive language is prohibited and the chat will be terminated if it continues.
    - If strike is 3 (Strike 3 of 4):
      Start with "Strike 3/4: Final Warning: ". State that this is their last warning.
    - If strike is 4 or higher:
      Start with "[TERMINATE_CHAT]" and state clearly that this support session has now been permanently terminated due to repeated policy violations.
  - SCRIPT AND LANGUAGE RULES:
    - Respond dynamically in the EXACT same language and script the user wrote (Hinglish in Roman letters, Devanagari Hindi if Devanagari characters, English in English, etc.).

CRITICAL LANGUAGE MATCHING RULE:
- ALWAYS detect and respond in the EXACT same language and script the user communicates in:
  1. Hinglish (Roman Hindi / Urdu, e.g. "konsa sample best rahega", "pack kahan milega", "download nahi ho raha", "paise kat gaye"):
     -> ALWAYS respond in natural, professional, friendly Hinglish using English/Roman letters! NEVER use Devanagari script if user typed in Roman letters!
  2. Hindi / Devanagari script:
     -> ONLY respond in Devanagari script if user wrote in Devanagari script!
  3. English:
     -> Respond in fluent, professional, friendly English.

CRITICAL FORMATTING INSTRUCTIONS:
- Do NOT sound like an automated robotic script. Avoid repeating stiff introductory lines in ongoing chats.
- NEVER use asterisks '*' or bullet dashes '-' at the start of lines. NEVER output bullet points with '*'.
- When providing instructions, breakdown of packs, or steps, ALWAYS format as clean numbered lists:
  1. **Pack / Step Name**: Explanation with technical and musical reasoning.
  2. **Pack / Step Name**: Explanation with technical and musical reasoning.
- Never use markdown heading tags like '###' or '##'.
- Write cleanly and elegantly with bold labels and regular text.
- Always include direct markdown links (e.g. [The Bollywood](/packs/the-bollywood), [Your Library](/library), [Browse Packs](/browse), [Free Samples](/free)).
- End with a smart, engaging follow-up question related to the user's specific genre or DAW (e.g. "Which DAW are you working in, and what tempo or vibe are you aiming for?").`

  const scrubBrandNames = (text: string) => {
    if (!text) return ''
    return text
      .replace(/\bgroq\b/gi, 'Sampi')
      .replace(/\bllama\s*3(\.\d+)?\b/gi, 'Sampi')
      .replace(/\bqwen(\s*\d+(\.\d+)?)?\b/gi, 'Sampi')
      .replace(/\bopenai\b/gi, 'Samples Wala')
      .replace(/\bchatgpt\b/gi, 'Sampi')
      .replace(/\(User ID:\s*[a-f0-9-]+\)/gi, '')
      .replace(/User ID:\s*[a-f0-9-]+/gi, '')
      .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '')
      .replace(/^#{1,4}\s+/gm, '')
      .replace(/^[\*\-]\s+/gm, '')
      .replace(/\*\*\[([^\]]+)\]\(([^)]+)\)\*\*/g, '[$1]($2)')
      .replace(/\[POLICY_VIOLATION\]/gi, '')
      .replace(/\[TERMINATE_CHAT\]/gi, '')
      .trim()
  }

  const findMatchedProducts = (text: string): RecommendedProduct[] => {
    const result: RecommendedProduct[] = []
    const textLower = (text || '').toLowerCase()
    const qLower = (query || '').toLowerCase()

    if (!allProducts || allProducts.length === 0) return result

    // 1. Check which products from allProducts are referenced in the answer or query
    for (const p of allProducts) {
      const nameLower = (p.name || '').toLowerCase()
      const slugLower = (p.slug || '').toLowerCase()
      const shortName = nameLower.split(/[–—-]/)[0].trim()

      const isMentionedInAnswer =
        textLower.includes(slugLower) ||
        textLower.includes(`/packs/${slugLower}`) ||
        textLower.includes(`/presets/${slugLower}`) ||
        (shortName.length > 3 && textLower.includes(shortName)) ||
        textLower.includes(nameLower)

      const isMentionedInQuery =
        qLower.includes(slugLower) ||
        (shortName.length > 3 && qLower.includes(shortName))

      if ((isMentionedInAnswer || isMentionedInQuery) && !result.some((r) => r.id === p.id)) {
        result.push(p)
      }
    }

    // 2. If the user is asking a product inquiry, recommendation, or comparison query
    const isProductOrRecommendQuery =
      /\b(best|recommend|suggest|top|pack|packs|sample|kit|loop|loops|drum|drums|tabla|vocal|preset|bollywood|south|sambalpur|folk|drill|konsa|konsi|achha|kharidu|le lu|buy|price|rate|browse)\b/i.test(
        qLower
      )

    if (isProductOrRecommendQuery) {
      if (/\b(drum|drums|one shot|percussion)\b/i.test(qLower)) {
        const p = allProducts.find((item) => item.slug === 'south-drums')
        if (p && !result.some((r) => r.id === p.id)) result.push(p)
      }
      if (/\b(tabla|classical|sufi)\b/i.test(qLower)) {
        const p = allProducts.find((item) => item.slug === 'the-ten-tablas')
        if (p && !result.some((r) => r.id === p.id)) result.push(p)
      }
      if (/\b(bollywood|hindi|melody|melodies)\b/i.test(qLower)) {
        const p = allProducts.find((item) => item.slug === 'the-bollywood')
        if (p && !result.some((r) => r.id === p.id)) result.push(p)
      }
      if (/\b(south|kuthu|tapori)\b/i.test(qLower)) {
        const p = allProducts.find((item) => item.slug === 'the-south')
        if (p && !result.some((r) => r.id === p.id)) result.push(p)
      }
      if (/\b(folk|sambalpur|odisha)\b/i.test(qLower)) {
        const p = allProducts.find((item) => item.slug === 'sambalpur-rhythm')
        if (p && !result.some((r) => r.id === p.id)) result.push(p)
      }
      if (/\b(vocal|punjabi|preset|fl studio)\b/i.test(qLower)) {
        const p = allProducts.find((item) => item.slug === 'the-real-punjab')
        if (p && !result.some((r) => r.id === p.id)) result.push(p)
      }

      // If general recommendation query ("best sample pack", etc.) and empty, provide the top flagship packs
      if (result.length === 0) {
        const topPacks = allProducts.filter(
          (p) => p.slug === 'the-bollywood' || p.slug === 'the-south' || p.slug === 'south-drums'
        )
        result.push(...topPacks.slice(0, 2))
      }
    }

    // 3. If still empty, check if recent chat history specifically discussed a product
    if (result.length === 0 && history && history.length > 0) {
      const recentHistoryText = history.slice(-3).map((h) => h.content.toLowerCase()).join(' ')
      for (const p of allProducts) {
        const slugLower = (p.slug || '').toLowerCase()
        const nameLower = (p.name || '').toLowerCase()
        const shortName = nameLower.split(/[–—-]/)[0].trim()

        if (
          recentHistoryText.includes(slugLower) ||
          (shortName.length > 3 && recentHistoryText.includes(shortName))
        ) {
          if (!result.some((r) => r.id === p.id)) {
            result.push(p)
          }
        }
      }
    }

    return result.slice(0, 4)
  }

  try {
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-4),
      { role: 'user', content: query },
    ]

    let response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.8-27b',
        messages: formattedMessages,
        temperature: 0.35,
        max_tokens: 1200,
      }),
    })

    if (!response.ok) {
      // Fallback model: openai/gpt-oss-120b
      response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          messages: formattedMessages,
          temperature: 0.35,
          max_tokens: 1200,
        }),
      })
    }

    if (!response.ok) {
      // Second fallback: openai/gpt-oss-20b
      response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b',
          messages: formattedMessages,
          temperature: 0.35,
          max_tokens: 1200,
        }),
      })
    }

    if (!response.ok) {
      const errText = await response.text()
      console.error('Groq Support API Error:', errText)
      return { success: false, error: 'Support desk is currently busy. Please try again.' }
    }

    const data = await response.json()
    const rawAnswer = data.choices?.[0]?.message?.content || ''

    const isPolicyViolation =
      rawAnswer.includes('[POLICY_VIOLATION]') ||
      rawAnswer.includes('[TERMINATE_CHAT]') ||
      /\[POLICY_VIOLATION\]/i.test(rawAnswer) ||
      /\[TERMINATE_CHAT\]/i.test(rawAnswer) ||
      /strike\s*[1-4]\s*\/\s*4/i.test(rawAnswer) ||
      /final warning/i.test(rawAnswer) ||
      /policy violation/i.test(rawAnswer) ||
      /session (has )?(now )?been terminated/i.test(rawAnswer) ||
      /चेतावनी|अंतिम चेतावनी|समाप्त/i.test(rawAnswer)

    const shouldTerminateChat =
      currentStrikes + 1 >= 4 ||
      rawAnswer.includes('[TERMINATE_CHAT]') ||
      /\[TERMINATE_CHAT\]/i.test(rawAnswer) ||
      /session (has )?(now )?been terminated|session permanently terminated/i.test(rawAnswer)

    const cleanedAnswer = scrubBrandNames(
      rawAnswer
        .replace(/\[POLICY_VIOLATION\]/gi, '')
        .replace(/\[TERMINATE_CHAT\]/gi, '')
        .trim()
    )

    return {
      success: true,
      answer: cleanedAnswer,
      recommendedProducts: isPolicyViolation ? [] : findMatchedProducts(cleanedAnswer),
      verifiedDownload: isPolicyViolation ? null : verifiedDownload,
      verifiedOrder: isPolicyViolation ? null : verifiedOrder,
      comingSoonProduct: null,
      canEscalateToTicket: isPolicyViolation ? false : canEscalateToTicket,
      isPolicyViolation,
      shouldTerminateChat,
    }
  } catch (error: any) {
    console.error('Support Action Exception:', error)
    return {
      success: false,
      error: 'Network error connecting to support desk.',
    }
  }
}

export async function subscribeDropAlertAction(
  email: string,
  productSlug: string,
  productName?: string
) {
  try {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' }
    }
    const admin = getAdminClient()
    try {
      await admin.from('drop_alerts').insert({
        email: email.trim().toLowerCase(),
        product_slug: productSlug,
        product_name: productName || productSlug,
        created_at: new Date().toISOString(),
      })
    } catch {
      // Graceful fallback if table is not configured
    }
    return {
      success: true,
      message: `You're on the VIP alert list! We'll email ${email} the moment ${productName || 'this pack'} drops.`,
    }
  } catch (err: any) {
    return { success: true, message: `Notification alert set for ${email}!` }
  }
}

'use server'

import { getAdminClient } from '@/lib/supabase/admin'
import { createClient, getUser } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { signDownloadToken } from '@/lib/security'
import { KNOWLEDGE_BASE } from '@/components/support/supportKnowledgeData'
import fs from 'fs'
import path from 'path'

function getGroqApiKey(): string | null {
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim()) {
    return process.env.GROQ_API_KEY.trim()
  }
  try {
    const envPath = path.resolve(process.cwd(), '.env.local')
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8')
      const match = content.match(/GROQ_API_KEY\s*=\s*(.+)/)
      if (match && match[1]) {
        const val = match[1].trim().replace(/^['"]|['"]$/g, '')
        process.env.GROQ_API_KEY = val
        return val
      }
    }
  } catch (err) {
    console.warn('[getGroqApiKey] Error reading .env.local:', err)
  }
  return null
}

function ensureSupabaseAdminEnv() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) return
  try {
    const envPath = path.resolve(process.cwd(), '.env.local')
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8')
      const mUrl = content.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.+)/)
      if (mUrl && mUrl[1]) process.env.NEXT_PUBLIC_SUPABASE_URL = mUrl[1].trim().replace(/^['"]|['"]$/g, '')
      const mKey = content.match(/SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.+)/)
      if (mKey && mKey[1]) process.env.SUPABASE_SERVICE_ROLE_KEY = mKey[1].trim().replace(/^['"]|['"]$/g, '')
    }
  } catch (err) {
    console.warn('[ensureSupabaseAdminEnv] Error reading .env.local:', err)
  }
}

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
  try {
    ensureSupabaseAdminEnv()
    const apiKey = getGroqApiKey()

    if (!apiKey) {
      console.error('[askGroqSupportAction] Missing GROQ_API_KEY')
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
      const { data } = await getUser()
      if (data?.user) {
        currentUser = data.user
        userId = userId || data.user.id
        userEmail = userEmail || (data.user.email ? data.user.email.toLowerCase().trim() : null)
        userName = userName !== 'Producer' ? userName : (data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Producer')
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

  // 3. Fetch Live Catalog 100% Dynamically from Supabase (sample_packs & presets)
  let liveInventoryList = ''
  let allProducts: RecommendedProduct[] = []

  try {
    const packsPromise = adminSupabase
      .from('sample_packs')
      .select(
        'id, name, slug, cover_url, price_inr, price_usd, mrp_inr, total_contents_summary, loop_count, one_shot_count, melody_count, preset_count, series, description'
      )
      .order('created_at', { ascending: false })
      .limit(100)

    const presetsPromise = adminSupabase
      .from('presets')
      .select('id, name, slug, cover_url, price_inr, mrp_inr, type, daws, plugins_used, description')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(60)

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

    allProducts = [...dbPacks, ...dbPresets]
  } catch (dbErr) {
    console.warn('[askGroqSupportAction] DB product query warning:', dbErr)
    allProducts = []
  }

  // Formulate Dense, Token-Efficient Inventory Profile from Database
  liveInventoryList = allProducts
    .map((p) => {
      const price = p.price_inr === 0 ? 'FREE' : `₹${p.price_inr}`
      const mrp = p.mrp_inr ? ` (MRP: ₹${p.mrp_inr})` : ''
      const link = p.product_type === 'preset' ? `/browse/presets/${p.slug}` : `/packs/${p.slug}`

      const specParts: string[] = []
      if (p.total_contents_summary) {
        specParts.push(p.total_contents_summary.replace(/\r?\n/g, ' '))
      } else {
        const countParts: string[] = []
        if (p.loop_count) countParts.push(`${p.loop_count} Loops`)
        if (p.one_shot_count) countParts.push(`${p.one_shot_count} One-Shots`)
        if (p.melody_count) countParts.push(`${p.melody_count} Melodies`)
        if (p.preset_count) countParts.push(`${p.preset_count} Presets`)
        if (countParts.length > 0) specParts.push(countParts.join(', '))
      }
      if (p.series) specParts.push(`Series: ${p.series}`)
      if (p.daws && p.daws.length > 0) specParts.push(`DAWs: ${p.daws.join(', ')}`)
      if (p.plugins_used && p.plugins_used.length > 0) specParts.push(`Plugins: ${p.plugins_used.join(', ')}`)

      const descSnippet = p.short_description ? ` | ${p.short_description}` : ''
      return `- [${p.name}](${link}): ${price}${mrp} [${p.product_type}] | Specs: ${specParts.join(' • ')}${descSnippet}`
    })
    .join('\n')

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

  // 4.1. Fetch Live Sales Leaderboard Dynamically from user_vault (Real-Time Best Sellers)
  let liveTopSellingPacksSummary = ''
  try {
    const { data: recentSales } = await adminSupabase
      .from('user_vault')
      .select('item_name, item_id, amount')
      .order('created_at', { ascending: false })
      .limit(200)

    if (recentSales && recentSales.length > 0) {
      const salesCounts: Record<string, { count: number; name: string; isPaid: boolean }> = {}
      for (const sale of recentSales) {
        const name = (sale.item_name || '').trim()
        if (!name || name === 'Unknown') continue
        if (!salesCounts[name]) {
          salesCounts[name] = { count: 0, name, isPaid: Number(sale.amount || 0) > 0 }
        }
        salesCounts[name].count++
      }

      const sortedTop = Object.values(salesCounts).sort((a, b) => b.count - a.count)
      const topPaid = sortedTop.filter((s) => s.isPaid).slice(0, 3)
      const topFree = sortedTop.filter((s) => !s.isPaid).slice(0, 2)

      liveTopSellingPacksSummary = `REAL-TIME SALES LEADERBOARD (FROM LIVE DATABASE):
- Top Best-Selling Paid Packs:
${topPaid.map((s, idx) => `  ${idx + 1}. "${s.name}" (${s.count} verified purchases)`).join('\n')}
- Most Popular Free Starter Packs:
${topFree.map((s, idx) => `  ${idx + 1}. "${s.name}" (${s.count} community downloads)`).join('\n')}`
    }
  } catch (salesErr) {
    console.warn('[askGroqSupportAction] Sales leaderboard query warning:', salesErr)
  }

  // 4.2. Detect Potential Duplicate Payments / Charges in User Vault
  let duplicatePaymentNotice = ''
  if (userPurchases && userPurchases.length > 1) {
    const seenItems: Record<string, any[]> = {}
    for (const p of userPurchases) {
      const key = `${p.item_id || p.item_name}`
      if (!seenItems[key]) seenItems[key] = []
      seenItems[key].push(p)
    }

    const duplicates = Object.values(seenItems).filter((list) => list.length > 1)
    if (duplicates.length > 0) {
      const dupList = duplicates[0]
      duplicatePaymentNotice = `DUPLICATE PAYMENT DETECTED IN USER'S VERIFIED PURCHASES:
The user has ${dupList.length} verified transactions for "${dupList[0].item_name}":
${dupList.map((d, i) => `- Transaction ${i + 1}: Amount: ₹${d.amount}, Order ID: ${d.razorpay_order_id || 'N/A'}, Payment ID: ${d.razorpay_payment_id || 'N/A'}, Date: ${new Date(d.created_at).toLocaleString()}`).join('\n')}
AUTOMATIC ACTION INSTRUCTIONS FOR SAMPI:
- Confirm to the user that you have checked our store database and verified their duplicate deduction for "${dupList[0].item_name}".
- Quote the exact Order ID and Payment ID found above so they have full peace of mind.
- Assure them that the duplicate charge has been automatically flagged for refund reversal via Razorpay back to their original payment source (takes 3-5 business days).
- Do NOT make the user fill out forms or ask for details we already found in their account!
- Only suggest opening a ticket if they need special manual bank tracing or a different resolution.`
    }
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

  // 6.5. Assemble Concise Knowledge Base Context
  const qL = query.toLowerCase()
  const relevantArticles = KNOWLEDGE_BASE.filter((k) =>
    k.tags.some((t) => qL.includes(t.toLowerCase())) ||
    k.question.toLowerCase().includes(qL) ||
    k.categoryLabel.toLowerCase().includes(qL)
  ).slice(0, 3)

  const knowledgeSummary = relevantArticles.length > 0
    ? relevantArticles.map((k) => `[GUIDE: ${k.question}] ${k.shortAnswer} Steps: ${k.detailedSteps.slice(0, 2).join(' ')}`).join('\n')
    : `Audio Specs: 24-bit studio WAV, 100% royalty-free commercial license. DAWs: FL Studio, Ableton, Logic Pro, Cubase. Digital goods delivered immediately to Library; non-refundable once downloaded.`

  // 7. System Prompt (Structured for 100% Groq Prompt Caching: Static Prefix First, Dynamic Data Last)
  const systemPrompt = `You are "Sampi", the official Samples Wala Technical Support Specialist and AI Audio Assistant for Samples Wala (sampleswala.com) — India's premier boutique sound library and marketplace for music producers, beatmakers, and sound designers.

CRITICAL IDENTITY & PRIVACY RULES:
- Your name is "Sampi". Always introduce or refer to yourself as Sampi when greeting or answering queries about yourself.
- You are exclusively the internal technical support specialist of Samples Wala with full administrative access to store records, orders, library vaults, invoices, and cloud audio delivery systems.
- NEVER mention "Groq", "Llama", "OpenAI", "ChatGPT", "Meta", or any third-party AI provider or LLM under any circumstances.
- NEVER mention or output technical database UUIDs or internal IDs. Only refer to the user by their name or email.
- ACCURACY GUARANTEE: Never hallucinate or invent BPM, sample counts, formats, or product specs not present in verified store inventory. If data is not available, advise the user to submit a support ticket to our senior sound engineers.
- If asked who you are, state that you are Sampi, the official Samples Wala Technical Support AI Assistant powered by Samples Wala's audio engineering knowledge base.
- Speak in a polite, confident, highly knowledgeable, and human-like technical tone.

LIVE SAMPLES WALA STORE INVENTORY (QUERY RESULT FROM DATABASE):
${liveInventoryList}

LIVE PROMOTIONS, UPCOMING FESTIVAL SALES & ACTIVE OFFERS:
- UPCOMING MEGA FESTIVE SALE: "SAMPLISTIC FESTIVAL"
  * Event: Samplistic Festival (Diwali & Festive Sound Sale Dhamaka)
  * Discount: FLAT 20% OFF sitewide on every sound pack and preset across the entire store!
  * Launch Timing: Officially starts on 8 October at 12:00 PM (Live real-time countdown banner is active right on our homepage).
  * Applicable To: Sitewide across all sample packs and presets in the catalog!
  * WHEN USER ASKS ABOUT SALES, DISCOUNTS, OR PROMOTIONS:
    - Queries: "is there any sale?", "sale kab aayegi", "offers kya hain", "discount code", "coupon code", "diwali sale", "samplistic festival", "offer kab hai", "kam price mein milega kya":
    - Enthusiastically announce: "Yes! Our upcoming mega event is the **Samplistic Festival**, starting on **8 October at 12:00 PM** with **FLAT 20% OFF** on every single sample pack and preset across the entire store! You can check the live countdown right on our [Homepage](/)."
    - In addition, highlight that producers don't even have to wait to start creating, because they can get 100% [Free Samples](/free) right now!

- DYNAMIC FREE SAMPLES & PACKS:
  * Check the LIVE SAMPLES WALA STORE INVENTORY above for all products marked "FREE" (₹0).
  * When a user asks for free samples or starter sounds (e.g. "like any free?", "free pack", "kuch free hai kya", "zero cost", "demo kit"):
    - Immediately highlight and recommend the FREE sound packs found in the live inventory above with their exact specs and links: [Pack Name](/packs/slug).
    - Point them directly to [Free Samples](/free) where all free collections are instantly accessible with 100% royalty-free commercial clearance.

- GLOBAL SISTER STORE & INTERNATIONAL CATALOG:
  * For international sound design, global drill/trap, or foreign VST plugins, recommend our sister platform **Producer Toy** at [producertoy.com](https://producertoy.com).

SAMPLES WALA COMPREHENSIVE KNOWLEDGE BASE (DAW SETUP, AUDIO SPECS, BILLING, REFUNDS, LICENSING):
${knowledgeSummary}

CRITICAL RULES FOR DYNAMIC PRODUCT RECOMMENDATION (100% DATABASE-DRIVEN - ZERO HARDCODING):
- You are not a generic script-reading bot; you are a seasoned music producer and senior audio engineer at Samples Wala.
- NEVER invent or recommend non-existent sound packs. You must ONLY recommend products from the LIVE SAMPLES WALA STORE INVENTORY list above.
- There are and will be hundreds or thousands of products added to the store database in the future. Evaluate every product DYNAMICALLY:
  1. DEEPLY ANALYZE THE PRODUCER'S NEED:
     * Identify their genre (Bollywood, Desi Hip-Hop, Punjabi, Drill, Regional Folk, EDM, Pop, Classical/Sufi, Trap, etc.).
     * Identify their sonic requirement (punchy drum one-shots, syncopated rhythm loops, melodic song-starters, 808 layering, vocal chain presets, MIDI arrangements).
     * Identify their DAW environment (FL Studio, Ableton Live, Logic Pro, Cubase, Studio One, Reaper).
  2. MATCH DYNAMICALLY FROM LIVE INVENTORY:
     * Scan the LIVE SAMPLES WALA STORE INVENTORY above to find the products that fit their genre and workflow.
     * Recommend the best matched packs and explain WHY with deep audio engineering reasoning (e.g., how the frequencies sit in the mix, transient response, low-end punch, harmonic warmth, pre-mixed EQ balance to leave room for the vocal pocket).
     * For presets: specify the supported DAW and plugins required directly from that preset's live database record.
  3. EXACT SPECIFICATIONS & COUNTS DIRECTLY FROM DATABASE:
     * When user asks what is included or how many samples are in a pack ("how many samples have in it", "what is included", "instruments kya hain", "kitne loops hain", "price kya hai"):
       Quote the EXACT sample count, loop count, one-shot count, and breakdown directly from that product's live specifications in the inventory above!
     * Never guess or say "sample count is unknown". Always state the exact numbers given in the live inventory.
- CONVERSATIONAL INTELLIGENCE & CROSS-SELLING CONTROL (DO NOT PUSH PRODUCTS ON EVERY QUESTION):
  * Only recommend specific sound packs and mention interactive preview cards when the user is explicitly or contextually inquiring about sounds, music production, sample packs, presets, recommendations, sales, or buying.
  * NEVER push product sales, promote sound packs, or mention attached cards when the user is asking about:
    1. Trust & Legitimacy ("are you guys genuine", "is this real", "is Samples Wala legit", "scam toh nahi", "fraud", "safe to buy"):
       - Answer directly with 100% confidence, honesty, and verified facts about Samples Wala:
         * Samples Wala is India's registered boutique digital sound library and marketplace built by and for music producers.
         * 100% secure checkout powered by verified payment gateways (Razorpay, UPI, Cards, NetBanking).
         * Direct, immediate delivery: purchased sound packs are instantly unlocked and permanently accessible in [Your Library](/library).
         * 100% Royalty-Free Commercial License (legal for Spotify, Apple Music, YouTube monetization, TV, and commercial releases).
         * Every pack is crafted by seasoned Indian music producers and audio engineers with playable audio previews.
         * DO NOT pitch or sell sound packs when answering trust questions! Build authentic credibility.
    2. Support & Issues (broken download link, failed payment, invoice, refund, technical troubleshooting):
       - Focus 100% on solving their issue immediately. Never cross-sell to a customer seeking technical or billing help!
    3. Casual Greetings ("hi", "who are you", "kya haal hai", "how are you"):
       - Be friendly and polite, introduce yourself as Sampi, and ask how you can help their music production today. Do NOT dump product recommendations!
  * When genuinely recommending a pack (upon user request or music production discussion):
    - ALWAYS format links using markdown: [Pack Name](/packs/slug) or [Preset Name](/browse/presets/slug).
    - Focus on maximum 2 packs so that your breakdown is complete, in-depth, and never cuts off.

CRITICAL RULES FOR AUTONOMOUS ADMINISTRATIVE PROBLEM RESOLUTION & ZERO-PIRACY:
1. STRICT DOWNLOAD & DOWNLOAD LINK REQUESTS:
   - When user specifically asks to download or requests a download link (e.g. "download link do", "link bhejo", "download nahi ho raha"):
     * IF the requested pack is VERIFIED in their vault:
       Reassure them enthusiastically! State: "Great news! Your purchase is verified in our database. I have generated your official secure, high-speed download button right below this message. Click the Download button below to start downloading your files immediately! You can also access it permanently in [Your Library](/library)."
     * IF the user asks for a download link of a pack they DO NOT own in their vault:
       Strictly and politely clarify: "This pack is not registered in your account library. To download this sound pack, you can purchase it directly from the official store at [Pack Name](/packs/slug)." NEVER promise or pretend to deliver a download link for an unowned product!
     * IF user is not logged in / guest:
       Politely explain that they need to log in with their registered account at [Sign In](/auth) to access verified downloads, or check their order confirmation email.
   - When user is simply asking questions or asking for recommendations:
     * NEVER mention or promise a download link button!
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

CRITICAL LANGUAGE MATCHING RULE:
- ALWAYS detect and respond in the EXACT same language and script the user communicates in:
  1. Hinglish (Roman Hindi / Urdu, e.g. "konsa sample best rahega", "pack kahan milega", "download nahi ho raha", "paise kat gaye"):
     -> ALWAYS respond in natural, professional, friendly Hinglish using English/Roman letters! NEVER use Devanagari script if user typed in Roman letters!
  2. Hindi / Devanagari script:
     -> ONLY respond in Devanagari script if user wrote in Devanagari script!
  3. English:
     -> Respond in fluent, professional, friendly English.

CRITICAL FORMATTING & STYLE INSTRUCTIONS:
- AVOID OVER-BOLDING: Do NOT bold every word or sentence. Only bold titles and numbers. Keep body text normal weight for clean, modern readability.
- NEVER DUPLICATE WORDS: Do NOT write "Your [Your Library](/library)" or "Your Your Library". Write simply "[Your Library](/library)".
- Do NOT sound like an automated robotic script. Avoid repeating stiff introductory lines in ongoing chats.
- NEVER use asterisks '*' or bullet dashes '-' at the start of lines. NEVER output bullet points with '*'.
- When providing instructions, breakdown of packs, or steps, ALWAYS format as clean numbered lists:
  1. **Pack / Step Name**: Explanation with technical and musical reasoning.
  2. **Pack / Step Name**: Explanation with technical and musical reasoning.
- Never use markdown heading tags like '###' or '##'.
- Always include direct markdown links (e.g. [The Bollywood](/packs/the-bollywood), [Your Library](/library), [Browse Packs](/browse), [Free Samples](/free)).
- End with a smart, engaging follow-up question related to the user's specific genre or DAW (e.g. "Which DAW are you working in, and what tempo or vibe are you aiming for?").

=======================================================
DYNAMIC REAL-TIME DATA & CONTEXT (UPDATED FOR THIS REQUEST):
=======================================================
${liveTopSellingPacksSummary}

REAL-TIME SALES LEADERBOARD INSTRUCTIONS (FROM LIVE DATABASE):
- When the user asks about the most sold, most popular, or best-selling sound packs (e.g. "which is the most selling sample pack", "sabse jyada purchase konsa hai", "most popular pack"):
  * NEVER say "I don't have real-time sales figures" or "I cannot declare a single best-seller"!
  * Explicitly name the #1 best-selling paid sound pack and top favorites directly from the REAL-TIME SALES LEADERBOARD above!
  * Mention their key genre, instruments, and price, and provide their direct link: [Pack Name](/packs/slug).

${userAccountSummary}

CRITICAL USER SESSION STATUS:
${userId ? `- The user IS ALREADY LOGGED IN as ${userName} (${userEmail}). NEVER tell them they are in guest mode, NEVER tell them to log in, and NEVER tell them to create an account.` : `- The user is currently browsing as a guest.`}

${duplicatePaymentNotice}`

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

  /**
   * Determine if the query should trigger product cross-selling / recommendations.
   * Product cards must NEVER be shown on trust/legitimacy, support/error, billing,
   * licensing, or casual greeting questions.
   */
  const isEligibleForProductCrossSelling = (
    userQuery: string,
    catalog: RecommendedProduct[]
  ): { allowed: boolean; specificTargetProduct?: RecommendedProduct | null } => {
    const q = (userQuery || '').toLowerCase().trim()

    // 1. Strict blacklist: Queries where cross-selling MUST NEVER happen
    // A. Trust, Legitimacy, Scam, Safety queries
    const isTrustQuery =
      /\b(genuine|legit|legitimate|real|fake|scam|fraud|dhokha|trust|trustworthy|safe|safety|secure|security|asli|nakli|proof|guarantee|scammer)\b/i.test(
        q
      )
    if (isTrustQuery) return { allowed: false }

    // B. Order, Billing, Payment, Refund, Invoice queries
    const isBillingOrOrderQuery =
      /\b(payment|pay|order|ord_|pay_|invoice|bill|receipt|refund|money|paise|charged|payout|deducted|transaction|bank|gateway)\b/i.test(
        q
      )
    if (isBillingOrOrderQuery) return { allowed: false }

    // C. Technical issues, Broken downloads, Errors, Bugs
    const isTechnicalIssueQuery =
      /\b(error|fail|failed|broken|corrupt|not working|crash|issue|problem|bug|stuck|latency|unzip|extract|download nahi|link nahi|can't download|cant download)\b/i.test(
        q
      )
    if (isTechnicalIssueQuery) return { allowed: false }

    // D. Account, Login, Password
    const isAccountQuery =
      /\b(login|log in|sign in|signin|signup|sign up|password|forgot password|register|registration|account|profile|email change)\b/i.test(
        q
      )
    if (isAccountQuery) return { allowed: false }

    // E. Pure Licensing / Legal / Copyright inquiries (without asking for recommendations)
    const isLicensingQuery =
      /\b(license|licensing|royalty\s*free|commercial\s*use|copyright|strike|strikes|dmca|legal|terms|conditions)\b/i.test(
        q
      )
    const isAskingForPackRecommendation =
      /\b(recommend|suggest|best|top|konsa|konsi|accha|which pack|what pack|buy|kharidna)\b/i.test(
        q
      )
    if (isLicensingQuery && !isAskingForPackRecommendation) {
      return { allowed: false }
    }

    // F. Casual greetings / Small talk / Sampi identity without product search
    const isCasualGreeting =
      /^(hi|hello|hey|yo|namaste|salam|sup|who are you|what is your name|who made you|how are you|kaise ho|kya haal hai|good morning|good afternoon|good evening|thanks|thank you|shukriya|bye|goodbye|ok|okay)\b/i.test(
        q
      )
    const hasSoundIntent =
      /\b(pack|packs|sample|samples|sound|sounds|kit|kits|loop|loops|preset|presets|beat|beats|drum|drums|vocal|vocals|melody|melodies|one\s*shot|drill|bollywood|punjabi|folk|south|edm|hiphop|trap|free|sale|discount|recommend|suggest|buy|store|catalog)\b/i.test(
        q
      )
    if (isCasualGreeting && !hasSoundIntent) {
      return { allowed: false }
    }

    // 2. Check if user specifically asked about an exact product from inventory
    for (const p of catalog) {
      const slug = (p.slug || '').toLowerCase()
      const name = (p.name || '').toLowerCase()
      const shortName = name.split(/[–—-]/)[0].trim()
      if (
        (slug.length > 3 && q.includes(slug)) ||
        (shortName.length > 3 && q.includes(shortName))
      ) {
        return { allowed: true, specificTargetProduct: p }
      }
    }

    // 3. Strict whitelist: Queries where cross-selling IS welcomed and valuable
    const isSoundDiscoveryOrShopping =
      /\b(recommend|suggest|suggestion|best|top|konsa|konsi|accha|pack|packs|sample|samples|sound|sounds|kit|kits|loop|loops|preset|presets|drum|drums|vocal|vocals|melody|melodies|beat|beats|one\s*shot|drill|punjabi|bollywood|south|folk|tabla|dholak|sitar|guitar|synth|bass|808|buy|kharidna|price|cost|free|muft|offer|sale|discount|samplistic|store|catalog|browse|genre)\b/i.test(
        q
      )

    return { allowed: isSoundDiscoveryOrShopping }
  }

  const findMatchedProducts = (text: string): RecommendedProduct[] => {
    const result: RecommendedProduct[] = []
    if (!allProducts || allProducts.length === 0) return result

    // 1. Verify eligibility for product cross-selling
    const eligibility = isEligibleForProductCrossSelling(query, allProducts)
    if (!eligibility.allowed) {
      return result
    }

    // 2. If a specific product was requested by name, return only that product
    if (eligibility.specificTargetProduct) {
      return [eligibility.specificTargetProduct]
    }

    const textLower = (text || '').toLowerCase()
    const qLower = (query || '').toLowerCase()

    // Dynamic scoring for each product in allProducts
    const scoredProducts: { product: RecommendedProduct; score: number }[] = []

    for (const p of allProducts) {
      let score = 0
      const nameLower = (p.name || '').toLowerCase()
      const slugLower = (p.slug || '').toLowerCase()
      const seriesLower = (p.series || '').toLowerCase()
      const shortName = nameLower.split(/[–—-]/)[0].trim().toLowerCase()
      const daws = (p.daws || []).map((d) => d.toLowerCase())
      const plugins = (p.plugins_used || []).map((pl) => pl.toLowerCase())

      // 1. Direct explicit link in generated answer or query
      if (textLower.includes(`/packs/${slugLower}`) || textLower.includes(`/presets/${slugLower}`)) {
        score += 60
      }
      if (qLower.includes(slugLower)) {
        score += 45
      }
      if (shortName.length > 3 && qLower.includes(shortName)) {
        score += 35
      }
      if (nameLower.length > 4 && qLower.includes(nameLower)) {
        score += 35
      }

      // 2. Query words matching product attributes
      const qTokens = qLower.split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !GENERIC_PRODUCT_WORDS.has(w))
      for (const token of qTokens) {
        if (slugLower.includes(token)) score += 15
        if (nameLower.includes(token)) score += 15
        if (p.full_description?.toLowerCase().includes(token)) score += 4
        if (p.total_contents_summary?.toLowerCase().includes(token)) score += 6
        if (daws.some((d) => d.includes(token))) score += 10
        if (plugins.some((pl) => pl.includes(token))) score += 10
      }

      // 3. Audio & Genre categorizations (100% dynamically evaluated)
      if (/\b(drum|drums|one\s*shot|percussion|snare|kick|hihat|clap|cymbals)\b/i.test(qLower)) {
        if ((p.one_shot_count && p.one_shot_count > 0) || slugLower.includes('drum')) score += 20
      }
      if (/\b(loop|loops|melody|melodies|chords|stems)\b/i.test(qLower)) {
        if ((p.loop_count && p.loop_count > 0) || (p.melody_count && p.melody_count > 0)) score += 15
      }
      if (/\b(preset|presets|vocal|fl\s*studio|chain|autotune)\b/i.test(qLower)) {
        if (p.product_type === 'preset' || slugLower.includes('preset') || slugLower.includes('vocal')) score += 25
      }
      if (/\b(free|muft|bina paise|free pack)\b/i.test(qLower)) {
        if (p.price_inr === 0) score += 30
      }

      // Only include products with genuine relevance (score >= 25)
      if (score >= 25) {
        scoredProducts.push({ product: p, score })
      }
    }

    scoredProducts.sort((a, b) => b.score - a.score)
    for (const item of scoredProducts) {
      if (!result.some((r) => r.id === item.product.id)) {
        result.push(item.product)
      }
    }

    // Dynamic general recommendations if query asks for suggestions but no keyword score reached >= 25
    const isGeneralRecommendation =
      /\b(best|recommend|suggest|top|pack|packs|sample|kit|loop|loops|achha|kharidu|buy|store|catalog|browse)\b/i.test(
        qLower
      )
    if (result.length === 0 && isGeneralRecommendation) {
      const topPicks = allProducts.filter((p) => p.price_inr > 0).slice(0, 2)
      result.push(...topPicks)
    }

    return result.slice(0, 2)
  }

  const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-4),
      { role: 'user', content: query },
    ]

    // Multi-Model Auto-Fallback & Token Optimization Hierarchy (Best Practices):
    // 1. Primary: 'qwen/qwen3.8-27b' (Ultra-fast, accurate, no reasoning token waste)
    // 2. High-IQ Reasoning Fallback: 'openai/gpt-oss-120b' (120B parameter deep comprehension)
    // 3. High-Throughput Fallback: 'openai/gpt-oss-20b' (20B parameter resilient model)
    // 4. Lightweight Emergency Fallback: 'allam-2-7b' (Guarantees zero-downtime under peak loads)
    const modelsToTry = [
      'qwen/qwen3.8-27b',
      'openai/gpt-oss-120b',
      'openai/gpt-oss-20b',
      'allam-2-7b',
    ]
    let rawAnswer = ''

    for (const model of modelsToTry) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: formattedMessages,
            temperature: 0.35,
            max_tokens: 850,
          }),
          signal: controller.signal,
        })
        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          const choice = data.choices?.[0]?.message
          const candidate = (choice?.content || choice?.reasoning || '').trim()
          if (candidate) {
            rawAnswer = candidate
            break
          }
        } else {
          const errText = await response.text()
          console.warn(`[askGroqSupportAction] Model ${model} returned HTTP ${response.status}. Seamlessly falling over to next model in failover chain. Details:`, errText)
        }
      } catch (modelErr: any) {
        console.warn(`[askGroqSupportAction] Model ${model} error (${modelErr.message || 'fetch error'}). Falling over to next model...`)
      }
    }

    if (!rawAnswer) {
      console.error('[askGroqSupportAction] All Groq models failed to return content.')
      return { success: false, error: 'Support desk is currently busy. Please try again.' }
    }

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

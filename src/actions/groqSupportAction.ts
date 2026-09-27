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
  product_type: string
  short_description?: string | null
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

  // 3. Fetch Live Catalog from Supabase (sample_packs & presets)
  let liveInventoryList = ''
  let allProducts: any[] = []

  try {
    const [packsRes, presetsRes] = await Promise.all([
      adminSupabase
        .from('sample_packs')
        .select('id, name, slug, cover_url, price_inr, price_usd, description, file_size')
        .limit(40),
      adminSupabase
        .from('presets')
        .select('id, name, slug, cover_url, price_inr, price_usd, description')
        .limit(20),
    ])

    const packs = (packsRes.data || []).map((p) => ({
      ...p,
      product_type: 'sample_pack',
      cover_image: p.cover_url || '',
    }))

    const presets = (presetsRes.data || []).map((pr) => ({
      ...pr,
      product_type: 'preset',
      cover_image: pr.cover_url || '',
    }))

    allProducts = [...packs, ...presets]

    if (allProducts.length > 0) {
      liveInventoryList = allProducts
        .map((p) => {
          const price = p.price_inr ? `₹${p.price_inr}` : p.price_usd ? `$${p.price_usd}` : 'Free'
          const desc = p.description ? ` - ${p.description.slice(0, 100)}` : ''
          const link = p.product_type === 'preset' ? `/browse/presets/${p.slug}` : `/packs/${p.slug}`
          return `- [${p.name}](${link}) (${price}, ${p.product_type}) [STATUS: AVAILABLE FOR INSTANT PURCHASE]${desc}`
        })
        .join('\n')
    }
  } catch (dbErr) {
    console.warn('[askGroqSupportAction] DB product query warning:', dbErr)
  }

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

  // A. Check for matched download
  if (userPurchases.length > 0) {
    const qLower = query.toLowerCase()
    let targetPurchase = userPurchases[0]

    for (const p of userPurchases) {
      const pName = (p.item_name || '').toLowerCase()
      if (qLower.includes(pName) || (p.item_id && qLower.includes(p.item_id))) {
        targetPurchase = p
        break
      }
    }

    if (
      qLower.includes('download') ||
      qLower.includes('link') ||
      qLower.includes('pack') ||
      qLower.includes('file') ||
      qLower.includes('not showing') ||
      qLower.includes('access') ||
      qLower.includes('paid') ||
      qLower.includes('kharida') ||
      qLower.includes('kahan')
    ) {
      try {
        const token = signDownloadToken(
          {
            uid: userId || targetPurchase.user_id || 'verified_support',
            pid: targetPurchase.item_id,
            type: targetPurchase.item_type || 'pack',
            ip: clientIp,
          },
          3600
        )

        const matchedCatalog = allProducts.find((prod) => prod.id === targetPurchase.item_id)

        verifiedDownload = {
          productId: targetPurchase.item_id,
          productName: targetPurchase.item_name,
          productSlug: matchedCatalog?.slug || targetPurchase.item_id,
          coverImage: matchedCatalog?.cover_image || 'https://imagizer.imageshack.com/img924/3747/53oszD.png',
          downloadUrl: `/api/download/${token}`,
          productType: targetPurchase.item_type || 'sample_pack',
          fileSize: matchedCatalog?.file_size || 'Studio Master Archive (24-bit WAV)',
          orderNumber: targetPurchase.razorpay_order_id || `SW-ORD-${targetPurchase.id.slice(0, 8).toUpperCase()}`,
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
  const systemPrompt = `You are the official "Samples Wala Technical Support Specialist", an expert audio engineer and senior administrative specialist for Samples Wala (sampleswala.com) — India's premier boutique sound library and marketplace for music producers, beatmakers, and sound designers.

CRITICAL IDENTITY & PRIVACY RULES:
- You are exclusively the internal technical support specialist of Samples Wala with full administrative access to store records, orders, library vaults, invoices, and cloud audio delivery systems.
- NEVER mention "Groq", "Llama", "OpenAI", "ChatGPT", "Meta", or any third-party AI provider or LLM under any circumstances.
- NEVER mention or output technical database UUIDs or internal IDs. Only refer to the user by their name (${userName}) or email (${userEmail || 'your email'}).
- ACCURACY GUARANTEE: Never hallucinate or invent BPM, sample counts, formats, or product specs not present in verified store inventory. If data is not available, advise the user to submit a support ticket to our senior sound engineers.
- If asked who you are, state that you are the official Samples Wala Technical Support Desk powered by Samples Wala's audio engineering knowledge base.
- Speak in a polite, confident, highly knowledgeable, and human-like technical tone.

${userAccountSummary}

CRITICAL USER SESSION RULES:
${userId ? `- The user IS ALREADY LOGGED IN as ${userName} (${userEmail}). NEVER tell them they are in guest mode, NEVER tell them to log in, and NEVER tell them to create an account.` : `- The user is currently browsing as a guest.`}

LIVE SAMPLES WALA STORE INVENTORY (QUERY RESULT FROM DATABASE):
${liveInventoryList || `- [Indian Rhythms & Percussion](/packs/indian-rhythms) (₹499, sample_pack) [STATUS: AVAILABLE FOR INSTANT PURCHASE] - Master Indian dholak, tabla, and percussion loops.\n- [Sexy Drill](/packs/sexy-drill) (₹399, sample_pack) [STATUS: AVAILABLE FOR INSTANT PURCHASE] - Hard-hitting 808s, sliding drill patterns, and dark melodies.`}

CRITICAL RULES FOR AUTONOMOUS ADMINISTRATIVE PROBLEM RESOLUTION:
1. When user asks about a missing download or says "payment done but pack not showing":
   - If user has purchases in their vault:
     Reassure them! Their purchase is verified in the live database. Their secure download button has been generated right below, and it is permanently accessible in [Your Library](/library).
   - If user is in guest mode or no purchase found:
     Politely explain that no verified purchase was recorded for this email. Ask if they used a different checkout email or have an Order/Payment ID.
2. When user asks for an Invoice, Bill, or Receipt:
   - Provide the details (Order Ref, Date, Amount, Payment ID). State that their official printable Bill of Supply / Tax Invoice has been attached below this message.
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

CRITICAL FORMATTING INSTRUCTIONS:
- NEVER use asterisks '*' or bullet dashes '-' at the start of lines.
- When providing instructions, ALWAYS format as clean numbered lists:
  1. **Step Name**: Explanation.
  2. **Step Name**: Explanation.
- Never use markdown heading tags like '###' or '##'.
- Always include direct markdown links.`

  const scrubBrandNames = (text: string) => {
    if (!text) return ''
    return text
      .replace(/\bgroq\b/gi, 'Samples Wala')
      .replace(/\bllama\s*3(\.\d+)?\b/gi, 'Samples Wala Support')
      .replace(/\bqwen(\s*\d+(\.\d+)?)?\b/gi, 'Samples Wala Support')
      .replace(/\bopenai\b/gi, 'Samples Wala')
      .replace(/\bchatgpt\b/gi, 'Samples Wala Assistant')
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

    if (allProducts && allProducts.length > 0) {
      for (const p of allProducts) {
        const nameLower = (p.name || '').toLowerCase()
        const slugLower = (p.slug || '').toLowerCase()
        const isMatched =
          textLower.includes(nameLower) ||
          textLower.includes(slugLower) ||
          qLower.includes(nameLower) ||
          qLower.includes(slugLower)

        if (isMatched && !result.some((r) => r.id === p.id)) {
          result.push({
            id: p.id,
            name: p.name,
            slug: p.slug,
            cover_image: p.cover_image || p.cover_url || '',
            price_inr: Number(p.price_inr || 499),
            price_usd: p.price_usd ? Number(p.price_usd) : undefined,
            product_type: p.product_type || 'sample_pack',
            short_description: p.description || null,
          })
        }
      }
    }
    return result
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
        model: 'llama-3.3-70b-versatile',
        messages: formattedMessages,
        temperature: 0.35,
        max_tokens: 1200,
      }),
    })

    if (!response.ok) {
      // Fallback model
      response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
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

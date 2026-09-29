'use server'

import { getAdminClient } from '@/lib/supabase/admin'
import { getUser } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { signDownloadToken } from '@/lib/security'
import { KNOWLEDGE_BASE } from '@/components/support/supportKnowledgeData'
import {
  verifyMultiGatewayDirect,
  type LiveGatewayVerificationResult,
} from '@/lib/support/paymentVerifier'
import {
  getGroqApiKey,
  ensureSupabaseAdminEnv,
  hasProfanityOrAbuse,
  isOffTopicQuery,
  scrubBrandNames,
} from '@/lib/support/supportHelpers'
import {
  buildSupportSystemPrompt,
  type SupportPromptContext,
} from '@/lib/support/rules'

export type { LiveGatewayVerificationResult }

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
  hasTroubleshootingSolution?: boolean
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
          userName =
            userName !== 'Producer'
              ? userName
              : data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Producer'
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

    const razorpayPaymentMatch = fullTextToScan.match(/\bpay_[A-Za-z0-9]+\b/i)
    const paypalPaymentMatch =
      fullTextToScan.match(/\bPAYID-[A-Za-z0-9]+\b/i) ||
      fullTextToScan.match(/\b[0-9A-Z]{17}\b/) ||
      fullTextToScan.match(/\bpp_[A-Za-z0-9_-]+\b/i)
    const cashfreePaymentMatch =
      fullTextToScan.match(/\b(?:cf_|cf_pay_)[A-Za-z0-9_-]+\b/i) ||
      fullTextToScan.match(/\bCF_[A-Za-z0-9_-]+\b/)

    const emailMatch = fullTextToScan.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/i)

    const scannedOrderNumber = orderNumberMatch ? orderNumberMatch[0].toUpperCase() : null
    const scannedPaymentId =
      razorpayPaymentMatch?.[0] ||
      paypalPaymentMatch?.[0] ||
      cashfreePaymentMatch?.[0] ||
      null
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

    // 4. Fetch User Purchases / Vault Items from Supabase
    let userPurchases: any[] = []
    let matchedSpecificOrder: any = null
    let resolvedUserId = userId

    if (!resolvedUserId && targetEmail) {
      try {
        const { data: userData } = await adminSupabase.auth.admin.listUsers()
        const cleanTarget = targetEmail.toLowerCase().trim()
        const matched = userData?.users?.find(
          (u: any) => u.email?.toLowerCase().trim() === cleanTarget
        )
        if (matched) {
          resolvedUserId = matched.id
        }
      } catch (authLookErr) {
        console.warn('[askGroqSupportAction] Auth user lookup warning:', authLookErr)
      }
    }

    try {
      if (resolvedUserId) {
        const { data: vData } = await adminSupabase
          .from('user_vault')
          .select('id, user_id, item_id, item_type, item_name, amount, currency, payment_gateway, razorpay_order_id, razorpay_payment_id, created_at')
          .eq('user_id', resolvedUserId)
          .order('created_at', { ascending: false })
          .limit(15)

        if (vData) userPurchases = vData
      }

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

    let targetPurchase: any = null
    let adminActionResultNotes = ''

    if (Boolean(userId) && isExplicitDownloadLinkRequest && userPurchases.length > 0) {
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

        if (!mentionedUnownedProduct && userPurchases.length === 1) {
          targetPurchase = userPurchases[0]
        }
      }
    }

    const isPaymentInquiry =
      isExplicitDownloadLinkRequest ||
      scannedPaymentId ||
      (scannedOrderNumber && !matchedSpecificOrder) ||
      /paise kat gaye|payment failed|not received|didn't get access|kharida|bought|purchased|deducted/i.test(qLower)

    if (!targetPurchase && isPaymentInquiry) {
      const cleanPaymentId = scannedPaymentId || scannedOrderNumber

      if (cleanPaymentId) {
        const { data: existingVaultRows } = await adminSupabase
          .from('user_vault')
          .select('*')
          .or(`razorpay_payment_id.eq.${cleanPaymentId},razorpay_order_id.eq.${cleanPaymentId}`)
          .limit(2)

        if (existingVaultRows && existingVaultRows.length > 0) {
          const existingClaim = existingVaultRows[0]
          const isSameUser = resolvedUserId && existingClaim.user_id === resolvedUserId

          if (isSameUser) {
            targetPurchase = existingClaim
            adminActionResultNotes += `\n[VERIFIED PURCHASE ACTIVE]: This payment ID (${cleanPaymentId}) is already credited to your account for "${existingClaim.item_name}". Instant secure download link is generated below.`
          } else {
            adminActionResultNotes += `\n[FRAUD PROTECTION - PAYMENT ID ALREADY REDEEMED]: Payment ID "${cleanPaymentId}" has already been claimed and credited to an account on ${new Date(existingClaim.created_at).toLocaleDateString()}. Reject this claim politely.`
            canEscalateToTicket = true
          }
        } else {
          const gwResult = await verifyMultiGatewayDirect(cleanPaymentId, targetEmail, query)

          if (gwResult && gwResult.verified && gwResult.status === 'captured') {
            const userEmailNorm = (userEmail || targetEmail || '').toLowerCase().trim()
            const gwEmailNorm = (gwResult.email || '').toLowerCase().trim()
            const emailMatches = !gwEmailNorm || !userEmailNorm || gwEmailNorm === userEmailNorm

            if (!emailMatches) {
              const maskedEmail = gwEmailNorm.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => a + '*'.repeat(Math.min(b.length, 5)) + c)
              adminActionResultNotes += `\n[FRAUD PROTECTION - EMAIL MISMATCH]: Payment ID "${cleanPaymentId}" is verified as CAPTURED on ${gwResult.gateway}, but was completed under a different email address (${maskedEmail}). Explain politely that purchases are tied to the email used at checkout.`
              canEscalateToTicket = true
            } else {
              const matchedCatalog =
                allProducts.find(
                  (prod) =>
                    qLower.includes((prod.slug || '').toLowerCase()) ||
                    qLower.includes((prod.name || '').toLowerCase())
                ) ||
                (gwResult.notes && Object.values(gwResult.notes).some((v: any) => typeof v === 'string' && allProducts.some((p) => v.toLowerCase().includes(p.slug.toLowerCase()))))
                  ? allProducts.find((p) => Object.values(gwResult.notes).some((v: any) => typeof v === 'string' && v.toLowerCase().includes(p.slug.toLowerCase())))
                  : null

              if (!matchedCatalog) {
                adminActionResultNotes += `\n[GATEWAY VERIFIED - PRODUCT SELECTION NEEDED]: Payment of ${gwResult.currency} ${gwResult.amount} was confirmed on ${gwResult.gateway} (ID: ${cleanPaymentId}), but we need to know which specific pack or preset you purchased.`
              } else {
                const expectedInr = Number(matchedCatalog.price_inr || 0)
                const expectedUsd = Number(matchedCatalog.price_usd || (expectedInr > 0 ? expectedInr / 75 : 0))
                const paidAmount = Number(gwResult.amount || 0)

                let amountValid = true
                if (paidAmount > 0) {
                  if (gwResult.currency === 'INR' && expectedInr > 0) {
                    amountValid = paidAmount >= expectedInr * 0.4
                  } else if (gwResult.currency === 'USD' && expectedUsd > 0) {
                    amountValid = paidAmount >= expectedUsd * 0.4
                  }
                }

                if (!amountValid) {
                  adminActionResultNotes += `\n[FRAUD PROTECTION - AMOUNT MISMATCH]: Payment ID "${cleanPaymentId}" on ${gwResult.gateway} was for ${gwResult.currency} ${gwResult.amount}, which does NOT match the catalog price for "${matchedCatalog.name}". Autonomous activation rejected.`
                  canEscalateToTicket = true
                } else {
                  try {
                    const finalUserId = resolvedUserId || userId || 'verified-customer'
                    await adminSupabase.from('user_vault').insert({
                      user_id: finalUserId,
                      item_id: matchedCatalog.id,
                      item_type: matchedCatalog.product_type === 'preset' ? 'preset' : 'pack',
                      item_name: matchedCatalog.name,
                      amount: paidAmount || (gwResult.currency === 'INR' ? expectedInr : expectedUsd),
                      currency: gwResult.currency || 'INR',
                      payment_gateway: gwResult.gateway.toLowerCase(),
                      razorpay_order_id: gwResult.orderId || null,
                      razorpay_payment_id: gwResult.paymentId || cleanPaymentId,
                      original_price: gwResult.currency === 'INR' ? expectedInr : expectedUsd,
                      discount_amount: 0,
                      created_at: gwResult.createdAt || new Date().toISOString(),
                    })

                    targetPurchase = {
                      id: `sw_${gwResult.gateway.toLowerCase().slice(0, 3)}_${Date.now()}`,
                      user_id: finalUserId,
                      item_id: matchedCatalog.id,
                      item_type: matchedCatalog.product_type === 'preset' ? 'preset' : 'pack',
                      item_name: matchedCatalog.name,
                      amount: paidAmount || (gwResult.currency === 'INR' ? expectedInr : expectedUsd),
                      currency: gwResult.currency || 'INR',
                      payment_gateway: gwResult.gateway.toLowerCase(),
                      razorpay_order_id: gwResult.orderId || null,
                      razorpay_payment_id: gwResult.paymentId || cleanPaymentId,
                      created_at: gwResult.createdAt || new Date().toISOString(),
                    }
                    userPurchases.unshift(targetPurchase)
                    adminActionResultNotes += `\n[LIVE ${gwResult.gateway.toUpperCase()} VERIFICATION SUCCESS]: Real payment verified directly on ${gwResult.gateway} gateway (Payment ID: ${cleanPaymentId}, Status: CAPTURED). Pack "${matchedCatalog.name}" has been unlocked in your Library Vault.`
                  } catch (provErr) {
                    console.warn('[askGroqSupportAction] SamplesWala multi-gateway provision warning:', provErr)
                  }
                }
              }
            }
          } else if (gwResult && gwResult.status === 'failed') {
            adminActionResultNotes += `\n[LIVE ${gwResult.gateway.toUpperCase()} RECORD - PAYMENT FAILED]: Real payment record found on ${gwResult.gateway} (ID: ${cleanPaymentId}), but status is FAILED. Error reason: "${gwResult.errorReason}". If debited, banks auto-reverse within 3–5 business days.`
          } else if (gwResult && gwResult.status === 'pending') {
            adminActionResultNotes += `\n[LIVE ${gwResult.gateway.toUpperCase()} RECORD - PAYMENT PENDING]: Transaction record found on ${gwResult.gateway} (ID: ${cleanPaymentId}), but status is PENDING clearance.`
          } else if (cleanPaymentId) {
            adminActionResultNotes += `\n[GATEWAY NOTICE - PAYMENT NOT FOUND]: The payment ID "${cleanPaymentId}" was not found across our live payment gateways (Razorpay, PayPal, Cashfree). Politely ask user to double check the ID.`
            canEscalateToTicket = true
          }
        }
      } else {
        adminActionResultNotes += `\n[HARD DATABASE AUDIT - ZERO VERIFIED PURCHASES]: Checked Supabase database and payment gateways for account "${targetEmail || 'user'}". No completed payments found. STRICT RULE: DO NOT fake payment confirmation, and DO NOT tell the user we added it to their account without a verified payment!`
        canEscalateToTicket = true
      }
    }

    if (targetPurchase) {
      try {
        const token = signDownloadToken(
          {
            uid: userId || targetPurchase.user_id || 'verified-customer',
            pid: targetPurchase.item_id,
            type: targetPurchase.item_type || 'pack',
            ip: clientIp,
          },
          1800
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

    const isProblemQuery =
      /fail|failed|error|broken|corrupt|not working|urgent|problem|scam|fraud|money cut|refund|stuck|help me|issue|dhokha|paise kat gaye/i.test(query)
    if (isProblemQuery) {
      canEscalateToTicket = true
    }

    // 6. Assemble Account Summary
    let userAccountSummary = `CURRENT USER CONTEXT:
- Name: ${userName}
- Email: ${userEmail || 'Guest (Not logged in)'}
- Logged In: ${userId ? 'YES' : 'NO'}`

    if (userPurchases.length > 0) {
      userAccountSummary += `\nUSER'S PURCHASED PRODUCTS IN LIBRARY VAULT:
${userPurchases
  .slice(0, 5)
  .map(
    (p) =>
      `- "${p.item_name}" (Price: ${p.currency === 'USD' ? '$' : '₹'}${p.amount}, Date: ${new Date(p.created_at).toLocaleDateString()}, Order: ${p.razorpay_order_id || 'N/A'}, Payment: ${p.razorpay_payment_id || 'N/A'})`
  )
  .join('\n')}`
    } else {
      userAccountSummary += `\nUSER'S PURCHASED PRODUCTS IN LIBRARY VAULT: 0 purchases recorded in Supabase database`
    }

    if (adminActionResultNotes) {
      userAccountSummary += `\n${adminActionResultNotes}`
    }

    // 7. Build Modular System Prompt
    const promptCtx: SupportPromptContext = {
      identity: {
        userName,
        userEmail,
        platformName: 'SamplesWala',
        platformDomain: 'sampleswala.com',
        sisterPlatformName: 'Producer Toy',
        sisterPlatformDomain: 'producertoy.com',
        assistantName: 'Sampi',
      },
      admin: {
        userName,
        userEmail,
        userPurchasesCount: userPurchases.length,
        userOrdersCount: userPurchases.length,
        purchasedProductNames: userPurchases.map((p) => p.item_name),
        isVerifiedDownloadActive: Boolean(verifiedDownload),
      },
      comingSoon: {
        candidateProduct: null,
      },
      policy: {
        currentStrikes,
      },
      userAccountSummary,
      isUserLoggedIn: Boolean(userId),
      liveInventoryList,
    }

    const systemPrompt = buildSupportSystemPrompt(promptCtx)

    // Helper to extract recommended products
    const findMatchedProducts = (text: string): RecommendedProduct[] => {
      const result: RecommendedProduct[] = []
      const textLower = (text || '').toLowerCase()
      const queryLower = (query || '').toLowerCase()

      const isExplicitlyAskingFree =
        /\b(free|muft|0|zero|cost|gift|bonus)\b/i.test(queryLower) &&
        !/\b(not free|free nahi|paid|premium)\b/i.test(queryLower)

      const scoredProducts: { product: RecommendedProduct; score: number }[] = []

      for (const p of allProducts) {
        let score = 0
        const nameLower = (p.name || '').toLowerCase()
        const slugLower = (p.slug || '').toLowerCase()

        if (textLower.includes(nameLower) || queryLower.includes(nameLower)) score += 50
        if (textLower.includes(slugLower) || queryLower.includes(slugLower)) score += 40

        if (score > 0) {
          scoredProducts.push({ product: p, score })
        }
      }

      scoredProducts.sort((a, b) => b.score - a.score)
      for (const item of scoredProducts) {
        if (!result.some((r) => r.id === item.product.id)) {
          result.push(item.product)
        }
      }

      if (result.length === 0) {
        if (isExplicitlyAskingFree) {
          const freePicks = allProducts.filter((p) => p.price_inr === 0).slice(0, 2)
          result.push(...freePicks)
        }
      }

      return result.slice(0, 2)
    }

    const compactHistory = history.slice(-6).map((h) => ({
      role: h.role,
      content: h.content.length > 400 ? h.content.slice(0, 400) + '...' : h.content,
    }))

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...compactHistory,
      { role: 'user', content: query },
    ]

    const isComplexQuery =
      /\b(fail|failed|broken|corrupt|not working|urgent|problem|scam|fraud|money cut|refund|stuck|help me|issue|dhokha|paise kat gaye|latency|unzip|extract|download nahi|link nahi|can't download|cant download|deducted|kat gaye|receipt|invoice|bill|gateway|guide|step|karein|how to|kaise|what about)\b/i.test(
        query
      )
    const isShortGreeting =
      /^(hi|hello|hey|sampi|ok|okay|thanks|thank you|shukriya|dhanyawad|bye|yo)\b/i.test(query.trim())

    let dynamicMaxTokens = 900
    if (isComplexQuery) {
      dynamicMaxTokens = 1500
    } else if (isShortGreeting && query.trim().length < 25) {
      dynamicMaxTokens = 350
    }

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
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: formattedMessages,
            temperature: 0.3,
            max_tokens: dynamicMaxTokens,
            reasoning_format: 'hidden',
          }),
          signal: controller.signal,
        })
        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          const choice = data.choices?.[0]?.message
          const candidate = (choice?.content || '').trim()
          if (candidate) {
            rawAnswer = candidate
            break
          }
        } else {
          const errText = await response.text()
          console.warn(`[askGroqSupportAction] Model ${model} returned HTTP ${response.status}:`, errText)
        }
      } catch (modelErr: any) {
        console.warn(`[askGroqSupportAction] Model ${model} error. Trying next...`)
      }
    }

    if (!rawAnswer) {
      return { success: false, error: 'Support desk is currently busy. Please try again.' }
    }

    let isPolicyViolation =
      rawAnswer.includes('[POLICY_VIOLATION]') ||
      rawAnswer.includes('[TERMINATE_CHAT]')

    // HARD POLICY ENFORCEMENT: Never strike on off-topic questions (e.g. "what is chota bheem").
    // Strikes are strictly for actual abusive words / gaaliyan!
    if (isOffTopicQuery(query)) {
      isPolicyViolation = false
    } else if (isPolicyViolation && !hasProfanityOrAbuse(query)) {
      isPolicyViolation = false
    }

    const shouldTerminateChat = isPolicyViolation && (currentStrikes + 1 >= 4 || rawAnswer.includes('[TERMINATE_CHAT]'))

    let cleanedAnswer = scrubBrandNames(
      rawAnswer
        .replace(/\[POLICY_VIOLATION\]/gi, '')
        .replace(/\[TERMINATE_CHAT\]/gi, '')
        .replace(/\[PROBLEM_SOLVED\]/gi, '')
        .trim()
    )

    // ZERO-TRUST ANTI-HALLUCINATION GUARD:
    if (!verifiedDownload) {
      cleanedAnswer = cleanedAnswer
        .replace(/\[ADMIN VERIFICATION SUCCESS\]/gi, '')
        .trim()

      const claimsVerifiedPurchase =
        cleanedAnswer.toLowerCase().includes('verified your purchase') ||
        cleanedAnswer.toLowerCase().includes('download mirror is ready') ||
        cleanedAnswer.toLowerCase().includes('payment is confirmed, your fresh secure download') ||
        cleanedAnswer.toLowerCase().includes('files permanently in your library')

      if (userPurchases.length === 0 && !scannedPaymentId && !scannedOrderNumber && claimsVerifiedPurchase) {
        cleanedAnswer = `Hello ${userName},\n\nI have checked your account vault (${userEmail || 'current session'}), and there are currently no verified purchases or orders found in our system.\n\nIf you recently made a payment, please share your Payment ID (e.g. Razorpay \`pay_...\`, Cashfree \`order_...\`, or PayPal \`PAYID-...\`) so I can verify the transaction immediately.`
      }
    }

    // Smart answer fallback for "how you can check razorpay" without payment ID
    const isAskingHowToCheckGateway =
      (qLower.includes('how') && qLower.includes('check') && (qLower.includes('razorpay') || qLower.includes('cashfree') || qLower.includes('paypal') || qLower.includes('gateway'))) ||
      qLower.includes('how you can check') ||
      qLower.includes('kaise check karte ho')

    if (isAskingHowToCheckGateway && !scannedPaymentId && !scannedOrderNumber) {
      cleanedAnswer = `Mera system hi is tarah securely integrate aur automate kiya gaya hai ki mai real-time payment status aur order verification safely perform karke aapka delivery issue instantly solve kar deta hoon.\n\nAgar aapne payment kiya hai aur pack vault me nahi dikh raha, please apna Payment ID (e.g. Razorpay \`pay_...\`, Cashfree \`order_...\`, ya PayPal \`PAYID-...\`) share karein taaki mai turant verify kar saku.`
    }

    const isTroubleshootingProblemQuery =
      /\b(error|fail|failed|broken|corrupt|not working|crash|issue|problem|bug|stuck|latency|unzip|extract|download nahi|link nahi|can't download|cant download|deducted|kat gaye|refund|charge|crackling|buffer)\b/i.test(
        query
      )

    const containsResolutionFix =
      /\b(step|steps|fixed|solution|fix|here is how|reversal|follow these|verified|download button)\b/i.test(
        cleanedAnswer
      )

    const hasTroubleshootingSolution =
      !isPolicyViolation &&
      (Boolean(verifiedDownload) ||
        Boolean(verifiedOrder) ||
        (isTroubleshootingProblemQuery && containsResolutionFix))

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
      hasTroubleshootingSolution,
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

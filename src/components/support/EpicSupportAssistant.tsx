'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Headphones,
  Bot,
  Send,
  Loader2,
  MoreVertical,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Ban,
  Lock,
  LogIn,
  RotateCcw,
  Download,
  Receipt,
  FileText,
  Bell,
  Home,
  CreditCard,
  Music,
  Tag,
  HelpCircle,
  Mail,
  MessageSquare,
} from 'lucide-react'
import {
  KNOWLEDGE_BASE,
  KnowledgeArticle,
} from './supportKnowledgeData'
import {
  askGroqSupportAction,
  RecommendedProduct,
  VerifiedDownload,
  VerifiedOrder,
  ComingSoonProduct,
  subscribeDropAlertAction,
} from '@/actions/groqSupportAction'
import { openPrintableInvoice } from '@/lib/invoiceUtils'
import { createSupportTicketAction } from '@/actions/supportActions'
import { useAuth } from '@/context/AuthContext'

interface ChatMessage {
  id: string
  sender: 'user' | 'assistant'
  timestamp: string
  content?: string
  article?: KnowledgeArticle
  recommendedProducts?: RecommendedProduct[]
  verifiedDownload?: VerifiedDownload | null
  verifiedOrder?: VerifiedOrder | null
  comingSoonProduct?: ComingSoonProduct | null
  canEscalateToTicket?: boolean
  userQuery?: string
  isSourcesOpen?: boolean
  feedback?: 'yes' | 'no'
  needsTicket?: boolean
  ticketNumber?: string
  isThinking?: boolean
  isGreeting?: boolean
  isWarning?: boolean
  hasTroubleshootingSolution?: boolean
  showLiveChatDesk?: boolean
  liveChatStatus?: 'checking' | 'unavailable' | 'available'
}

const TICKET_CATEGORIES = [
  { id: 'download', label: 'Download & Vault', icon: Download },
  { id: 'payment', label: 'Payment & Orders', icon: CreditCard },
  { id: 'daw', label: 'DAW Compatibility', icon: Music },
  { id: 'licensing', label: 'Royalty & License', icon: Tag },
  { id: 'technical', label: 'Audio / Technical', icon: Headphones },
  { id: 'general', label: 'General Inquiry', icon: HelpCircle },
]

const TICKET_PRIORITIES = [
  { id: 'NORMAL', label: 'Normal Priority (12-24h)' },
  { id: 'HIGH', label: 'High Priority (4-8h)' },
  { id: 'URGENT', label: 'Urgent Deadline (1-3h)' },
]

interface AnswerSourceItem {
  title: string
  label: string
  href: string
}

function getAnswerSources(msg: ChatMessage): AnswerSourceItem[] {
  const sources: AnswerSourceItem[] = []
  const textCombined = `${msg.userQuery || ''} ${msg.content || ''}`.toLowerCase()

  // 1. If message recommended products
  if (msg.recommendedProducts && msg.recommendedProducts.length > 0) {
    for (const prod of msg.recommendedProducts) {
      sources.push({
        title: `Samples Wala Catalog • ${prod.name}`,
        label: `View ${prod.name}`,
        href: prod.product_type === 'preset' ? `/browse/presets/${prod.slug}` : `/packs/${prod.slug}`,
      })
    }
  }

  // 2. If message matched a local knowledge article
  if (msg.article) {
    if (msg.article.actionCta) {
      sources.push({
        title: `Samples Wala Knowledge Base • ${msg.article.categoryLabel}`,
        label: msg.article.actionCta.label,
        href: msg.article.actionCta.href,
      })
    } else {
      switch (msg.article.category) {
        case 'downloads':
          sources.push({
            title: 'Samples Wala Cloud Vault • My Library',
            label: 'Go to Library',
            href: '/library',
          })
          break
        case 'free_and_licensing':
          sources.push({
            title: 'Samples Wala 100% Free Sound Tier',
            label: 'Browse Free Packs',
            href: '/free',
          })
          break
        case 'billing_invoices':
          sources.push({
            title: 'Samples Wala Orders, Invoices & Vault',
            label: 'View Invoices in Library',
            href: '/library',
          })
          break
        case 'refunds':
          sources.push({
            title: 'Samples Wala Customer Guarantee & Refund Terms',
            label: 'Refund Policy',
            href: '/refund-policy',
          })
          break
        case 'account':
          sources.push({
            title: 'Samples Wala Account Portal',
            label: 'Sign In / Account',
            href: '/auth',
          })
          break
        default:
          sources.push({
            title: `Samples Wala Knowledge Base • ${msg.article.categoryLabel}`,
            label: 'Support Desk',
            href: '/support',
          })
          break
      }
    }
  }

  // 3. Extract markdown links from msg.content
  if (msg.content) {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    let match: RegExpExecArray | null
    while ((match = linkRegex.exec(msg.content)) !== null) {
      const linkText = match[1].trim()
      const linkHref = match[2].trim()

      if (!sources.some((s) => s.href === linkHref)) {
        let title = 'Samples Wala Knowledge Base'
        let label = linkText

        if (linkHref.startsWith('/packs/')) {
          title = `Samples Wala Catalog • ${linkText}`
          label = `View ${linkText}`
        } else if (linkHref === '/browse') {
          title = 'Samples Wala Store • Sound Catalog'
          label = 'Browse Store'
        } else if (linkHref === '/free') {
          title = 'Samples Wala Free Sounds Tier'
          label = 'Browse Free Samples'
        } else if (linkHref === '/library') {
          title = 'Samples Wala Cloud Downloads • My Library'
          label = 'Go to Library'
        } else if (linkHref === '/refund-policy') {
          title = 'Samples Wala Customer Guarantee & Terms'
          label = 'Refund Policy'
        } else if (linkHref === '/support') {
          title = 'Samples Wala Technical Support Desk'
          label = 'Support Desk'
        }

        sources.push({ title, label, href: linkHref })
      }
    }
  }

  // 4. Keyword-based matching if no sources discovered yet
  if (sources.length === 0) {
    if (textCombined.includes('free') || textCombined.includes('muft')) {
      sources.push({
        title: 'Samples Wala Free Sound Tier • 100% Free Samples',
        label: 'Browse Free Packs',
        href: '/free',
      })
    } else if (textCombined.includes('download') || textCombined.includes('library') || textCombined.includes('vault') || textCombined.includes('kahan')) {
      sources.push({
        title: 'Samples Wala Cloud Downloads • User Library',
        label: 'Go to Library',
        href: '/library',
      })
    } else if (textCombined.includes('invoice') || textCombined.includes('bill') || textCombined.includes('receipt') || textCombined.includes('payment')) {
      sources.push({
        title: 'Samples Wala Orders & Tax Invoices',
        label: 'View Library & Invoices',
        href: '/library',
      })
    } else if (textCombined.includes('refund') || textCombined.includes('money back') || textCombined.includes('wapas')) {
      sources.push({
        title: 'Samples Wala Customer Guarantee & Refund Terms',
        label: 'Refund Policy',
        href: '/refund-policy',
      })
    } else if (textCombined.includes('fl studio') || textCombined.includes('ableton') || textCombined.includes('logic') || textCombined.includes('daw')) {
      sources.push({
        title: 'Samples Wala Technical Audio & DAW Integration Guide',
        label: 'Help Center',
        href: '/help',
      })
    } else {
      sources.push({
        title: 'Samples Wala Store • Browse All Sound Collections',
        label: 'Browse Catalog',
        href: '/browse',
      })
    }
  }

  // Deduplicate by href
  const uniqueMap = new Map<string, AnswerSourceItem>()
  for (const s of sources) {
    if (!uniqueMap.has(s.href)) {
      uniqueMap.set(s.href, s)
    }
  }

  return Array.from(uniqueMap.values()).slice(0, 2)
}

function checkIsInappropriateLanguage(text: string): boolean {
  if (!text) return false
  const t = text.toLowerCase()

  // 1. Explicit Sexual & Vulgar terms
  const vulgarRegex = /\b(sex|porn|nude|nudes|boobs|blowjob|handjob|cum|penis|vagina|dildo|horny|lust|orgasm|incest)\b/i
  if (vulgarRegex.test(t)) return true

  // 2. Hindi / Urdu / Hinglish Gaaliyan & Abusive words
  const hindiAbuseRegex = /\b(madarchod|madarchodd|maderchod|mc|bhenchod|behenchod|bc|bhosdike|bhosdika|bsdk|bhosdi|lauda|loda|laude|lode|lund|gaand|gand|gandu|randi|r@ndi|harami|kamina|kamine|kutta|kutte|kamini|bhadwe|bhadva|tatte|jhant|jhat|chodna|choda|chodo|chudai|chudwana|chod|chut|chutiya|chutiye|chutmarike|khanki|hijde|hijra|hijda|chakka|gaandu|chud)\b/i
  if (hindiAbuseRegex.test(t)) return true

  const hindiPhraseRegex = /(teri ma|teri maa|ma chod|maa chod|chod dunga|chod de|chud gaya|bhen ke lode|behen ke lode|lund ke baal)/i
  if (hindiPhraseRegex.test(t)) return true

  // 3. English Profanity & Slurs
  const englishAbuseRegex = /\b(fuck|fucking|fucker|fck|motherfucker|bitch|bastard|asshole|dick|pussy|slut|whore|cunt)\b/i
  if (englishAbuseRegex.test(t)) return true

  // 4. Inappropriate Sexual / Romantic Solicitation
  const solicitationRegex = /(will you be my gf|be my gf|be my girlfriend|girlfriend banegi|gf banegi|gf banja|girlfriend banja|mere sath sex|sex kar|sex karo|sex karega|sex karegi|sex karne de|have sex with me|wanna fuck|fuck me|kiss me|nangi photo)\b/i
  if (solicitationRegex.test(t)) return true

  // 5. Global Regional Slurs
  const globalSlursRegex = /\b(puta|puto|pendejo|cabron|hijo de puta|verga|chinga|blyat|suka|cyka|nahui|pizdets|ebat|merde|putain|connard|salope|encule|arschloch|hurensohn|scheisse|wichser|vaffanculo|stronzo|cazzo|sharmouta|sharmuta|kos omak|orospu|sikik|amk|putangina|tangina|gago|caralho|porra)\b|ابن العاهرة|العاهرة|شرموطة|قحبة|كس أمك|كس امك|طيز|منيك|عرص/i
  if (globalSlursRegex.test(t)) return true

  // 6. Devanagari Hindi abuse
  const devanagariAbuse = /(मादरचोद|बहनचोद|भोसड़ीके|चूतिया|लंड|गांड|रंडी|हरामी|कमीने|सेक्स|हिजड़े|लौड़े)/i
  if (devanagariAbuse.test(t)) return true

  return false
}

function isHinglishQuery(text: string): boolean {
  const devanagari = /[\u0900-\u097F]/
  const arabic = /[\u0600-\u06FF]/
  if (devanagari.test(text) || arabic.test(text)) return false
  const hinglishWords = /\b(karega|karegi|karo|karna|de|mera|mere|meri|sath|banegi|banja|bhai|batao|kripya|nahi|hoga|raha|rahe|hai|ho|tha|the|apna|aap|tum|ka|ki|ke|ko|se|me|par|madarchod|bhenchod|behenchod|bhosdike|bhosdika|bsdk|chutiya|chutiye|lauda|loda|laude|lode|lund|gaand|gandu|randi|harami|kamina|kamine|bhadwe|tatte|jhant|khanki|hijde|hijra|chudai|chodo|chod|teri|tera|tere|maa|ma|baal|dunga|kutta|kutte|chakka)\b/i
  return hinglishWords.test(text)
}

function getDeterministicWarning(strike: number, query: string): string {
  const isArabic = /[\u0600-\u06FF]/.test(query)
  const isDevanagari = /[\u0900-\u097F]/.test(query)
  const hinglish = !isDevanagari && !isArabic && isHinglishQuery(query)

  if (strike <= 1) {
    if (isArabic) {
      return "Strike 1/4: يرجى استخدام لغة لائقة ومحترمة. مكتب دعم Samples Wala مخصص حصرياً للمساعدة في منتجات الإنتاج الموسيقي والطلبات. استمرار استخدام الألفاظ غير اللائقة سيؤدي إلى إنهاء المحادثة."
    }
    if (hinglish) {
      return "Strike 1/4: Kripya sammanjanak aur shalin bhasha ka upyog karein. Samples Wala Support Desk keval music production, sample packs, aur order assistance ke liye hai. Yadi aap aage bhi abusive bhasha ka prayog karenge, toh is chat session ko terminate kar diya jayega. Kripya batayein main aapki kya madad kar sakta hoon."
    }
    if (isDevanagari) {
      return "Strike 1/4: कृपया सम्मानजनक और शालीन भाषा का प्रयोग करें। Samples Wala Support Desk केवल संगीत उत्पादन, सैंपल पैक्स, और ऑर्डर सहायता के लिए है। यदि आप अनुचित भाषा का उपयोग जारी रखते हैं, तो इस चैट सत्र को समाप्त किया जाएगा।"
    }
    return "Strike 1/4: Please use appropriate and respectful language. The Samples Wala Support Desk is dedicated to assisting with music production software, sample packs, and orders. Continued use of inappropriate language will result in this chat session being terminated. How can I assist you with your music production?"
  }

  if (strike === 2) {
    if (isArabic) {
      return "Strike 2/4: تحذير: يرجى الامتناع عن استخدام أي لغة مسيئة أو بذيئة. هذا الدعم مخصص فقط للمساعدة التقنية والاستفسارات المشروعة لـ Samples Wala."
    }
    if (hinglish) {
      return "Strike 2/4: Warning: Kripya abusive ya vulgar language ka prayog na karein. Samples Wala Support Desk sirf professional music production aur legitimate product support ke liye hai. Agar aap aisi bhasha jari rakhenge toh session turant terminate kar diya jayega."
    }
    if (isDevanagari) {
      return "Strike 2/4: चेतावनी: कृपया अभद्र या आपत्तिजनक भाषा का प्रयोग न करें। Samples Wala Support Desk केवल संगीत उत्पादन और ऑर्डर से जुड़े प्रश्नों के लिए है।"
    }
    return "Strike 2/4: Warning: Please refrain from using vulgar, offensive, or abusive language. The Samples Wala Support Desk is reserved for legitimate audio software and order inquiries."
  }

  if (strike === 3) {
    if (isArabic) {
      return "Strike 3/4: تحذير نهائي: هذا هو تحذيرك الأخير للتواصل باحترام. أي رسالة مسيئة أخرى ستؤدي فوراً إلى إنهاء جلسة الدعم هذه نهائياً."
    }
    if (hinglish) {
      return "Strike 3/4: Final Warning: Yeh aapki aakhri warning hai. Kripya abusive bhasha turant band karein. Agar agla message bhi inappropriate hua, toh is chat session ko bina kisi warning ke turant aur permanently terminate kar diya jayega."
    }
    if (isDevanagari) {
      return "Strike 3/4: अंतिम चेतावनी: कृपया अपमानजनक भाषा का प्रयोग तुरंत बंद करें। यदि अगला संदेश भी अनुचित हुआ, तो सत्र तुरंत और स्थायी रूप से समाप्त कर दिया जाएगा।"
    }
    return "Strike 3/4: Final Warning: Please stop using abusive language immediately. This is your last warning. Any further inappropriate messages will immediately and permanently terminate this support session."
  }

  // Strike 4+ (Terminated)
  if (isArabic) {
    return "تم إنهاء جلسة الدعم هذه نهائياً وبشكل دائم بسبب تكرار انتهاك سياسة التواصل."
  }
  if (hinglish) {
    return "This support session has now been permanently terminated due to repeated policy violations. Kripya legitimate technical assistance ke liye nayi conversation shuru karein aur respectful bhasha banaye rakhein."
  }
  if (isDevanagari) {
    return "बार-बार नियमों का उल्लंघन करने के कारण यह सहायता सत्र स्थायी रूप से समाप्त कर दिया गया है।"
  }
  return "This support session has now been permanently terminated due to repeated policy violations. Please start a new conversation when you are ready to communicate respectfully."
}

export interface EpicSupportAssistantProps {
  initialTab?: string
  initialTicketNumber?: string
  initialEmail?: string
}

export function EpicSupportAssistant({
  initialEmail = '',
}: EpicSupportAssistantProps) {
  // Screen state: false = Hero Search (Screen 1), true = Chat Assistant (Screen 2)
  const [isChatStarted, setIsChatStarted] = useState(false)
  const [isChatEnded, setIsChatEnded] = useState(false)

  // Search input on Screen 1
  const [heroInput, setHeroInput] = useState('')
  const [inputError, setInputError] = useState('')
  const [isHeroLoading, setIsHeroLoading] = useState(false)

  // Chat message input on Screen 2
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [policyStrikes, setPolicyStrikes] = useState(0)
  const strikesRef = useRef(0)

  const { user } = useAuth()

  // Ticket creation inline state
  const [ticketName, setTicketName] = useState('')
  const [ticketEmail, setTicketEmail] = useState(initialEmail)
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketCategory, setTicketCategory] = useState('technical')
  const [ticketOrderId, setTicketOrderId] = useState('')
  const [ticketDaw, setTicketDaw] = useState('')
  const [ticketPriority, setTicketPriority] = useState('NORMAL')
  const [ticketDescription, setTicketDescription] = useState('')
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false)
  const [ticketError, setTicketError] = useState('')

  // Sync authenticated user info
  useEffect(() => {
    if (user?.email && !ticketEmail) {
      setTicketEmail(user.email)
    }
    const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || ''
    if (fullName && !ticketName) {
      setTicketName(fullName)
    }
  }, [user])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)
  const optionsMenuRef = useRef<HTMLDivElement>(null)

  // Options popover menu (End chat)
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false)
  const [isChatScrolled, setIsChatScrolled] = useState(false)
  const [isSubHeaderVisible, setIsSubHeaderVisible] = useState(false)
  const lastScrollTopRef = useRef(0)

  // Track window scroll if whole page scrolls
  useEffect(() => {
    let lastWindowScroll = window.scrollY
    const handleWindowScroll = () => {
      const current = window.scrollY
      if (current > 40 && current > lastWindowScroll + 3) {
        setIsSubHeaderVisible(true)
      } else if (current < lastWindowScroll - 3 || current <= 25) {
        setIsSubHeaderVisible(false)
      }
      lastWindowScroll = current
    }
    window.addEventListener('scroll', handleWindowScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [])

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(e.target as Node)) {
        setIsOptionsMenuOpen(false)
      }
    }
    if (isOptionsMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isOptionsMenuOpen])

  const formatCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }

  const formatCurrentDate = () => {
    const now = new Date()
    return now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Chat history for Screen 2
  const [messages, setMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    if (!isChatStarted || messages.length === 0) return

    const lastMsg = messages[messages.length - 1]
    if (lastMsg.sender === 'assistant' && !lastMsg.isThinking) {
      // User requested: "answer generate hone ke baad wo niche chala jata hai jabki answer jaha se shuru hota hai waha scroll hona chahiye tha"
      // Smoothly scroll to the START of the assistant's answer so the user reads from the beginning!
      const el = document.getElementById(`msg-container-${lastMsg.id}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping, isChatStarted])

  // Parses markdown links [Text](/url), bold **text**, and single *text*
  const renderBoldText = (text: string, keyPrefix: string): React.ReactNode => {
    if (!text) return null

    const regex = /(\*\*([^*]+)\*\*|\*([^*]+)\*)/g
    const elements: React.ReactNode[] = []
    let lastIndex = 0
    let match: RegExpExecArray | null
    let idx = 0

    while ((match = regex.exec(text)) !== null) {
      const matchStart = match.index
      const matchEnd = regex.lastIndex

      if (matchStart > lastIndex) {
        const plainText = text.substring(lastIndex, matchStart).replace(/\*/g, '')
        if (plainText) {
          elements.push(<span key={`${keyPrefix}-t-${idx++}`}>{plainText}</span>)
        }
      }

      const boldContent = match[2] || match[3] || ''
      if (boldContent) {
        elements.push(
          <strong key={`${keyPrefix}-b-${idx++}`} className="font-semibold text-white">
            {boldContent}
          </strong>
        )
      }

      lastIndex = matchEnd
    }

    if (lastIndex < text.length) {
      const remaining = text.substring(lastIndex).replace(/\*/g, '')
      if (remaining) {
        elements.push(<span key={`${keyPrefix}-t-${idx++}`}>{remaining}</span>)
      }
    }

    return elements.length > 0 ? elements : text.replace(/\*/g, '')
  }

  const renderFormattedAnswer = (text: string) => {
    if (!text) return null

    // Preprocess: Convert any bare internal routes and references into markdown links
    let normalizedText = text
      // Clean up common duplicate library patterns from AI output
      .replace(/\b(?:your\s+)+\[(?:your\s+)?library\]\(\/library\)/gi, '[Your Library](/library)')
      .replace(/\bYour\s+Library\s*[:\-–]\s*\[(?:Your\s+)?Library\]\(\/library\)/gi, '[Your Library](/library)')
      .replace(/\[(?:your\s+)?library\]\(\/library\)(?:\s*[:\-–]\s*|\s+)\[(?:your\s+)?library\]\(\/library\)/gi, '[Your Library](/library)')
      .replace(/\b(?:your\s+)+your\s+library\b/gi, 'Your Library')
      .replace(
        /(?<!\]\()(\/(?:library|browse|free|refund-policy|terms|auth|support|packs\/[\w-]+))(?=[)\s.,!?"']|$)/gi,
        (_match, path) => {
          let label = path
          if (path === '/library') label = 'Your Library'
          else if (path === '/browse') label = 'Browse Packs'
          else if (path === '/free') label = 'Free Packs'
          else if (path === '/refund-policy') label = 'Refund Policy'
          else if (path === '/terms') label = 'Terms of Service'
          else if (path === '/auth') label = 'Sign In / Account'
          else if (path === '/support') label = 'Support Desk'
          else if (path.startsWith('/packs/')) label = 'View Sound Pack'
          return `[${label}](${path})`
        }
      )
      .replace(/(?<=\b(?:in|on|to|visit|open)\s+)(?:your\s+)?["']?Library["']?(?!\s*\]|\()/gi, '[Your Library](/library)')
      .replace(/\b(?:your\s+)+\[Your Library\]/gi, '[Your Library]')

    const rawLines = normalizedText.split('\n')

    return rawLines.map((rawLine, lIdx) => {
      const line = rawLine.replace(/^[\*\-]\s+/, '').replace(/^#{1,4}\s+/, '').trim()

      if (!line) {
        return <span key={lIdx} className="block h-2" />
      }

      const numMatch = line.match(/^(\d+\.)\s+(.*)$/)
      let prefix: React.ReactNode = null
      let contentToParse = line

      if (numMatch) {
        prefix = <span className="font-semibold text-[#00FF94] mr-1.5">{numMatch[1]}</span>
        contentToParse = numMatch[2]
      }

      const elements: React.ReactNode[] = []
      let lastIndex = 0
      let match: RegExpExecArray | null

      const lineRegex = /(?:\*\*\[([^\]]+)\]\(([^)]+)\)\*\*|\[([^\]]+)\]\(([^)]+)\))/g
      while ((match = lineRegex.exec(contentToParse)) !== null) {
        const fullMatch = match[0]
        const linkText = match[1] || match[3]
        const url = match[2] || match[4]
        const isBold = fullMatch.startsWith('**')
        const matchIndex = match.index

        if (matchIndex > lastIndex) {
          const before = contentToParse.substring(lastIndex, matchIndex)
          elements.push(renderBoldText(before, `l-${lIdx}-b-${lastIndex}`))
        }

        const isExternal = url.startsWith('http://') || url.startsWith('https://')
        const linkContent = isBold ? (
          <strong className="font-semibold">{linkText}</strong>
        ) : (
          linkText
        )

        if (isExternal) {
          elements.push(
            <a
              key={`link-${lIdx}-${matchIndex}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00FF94] hover:text-[#FFE600] font-semibold underline underline-offset-4 decoration-1 decoration-[#00FF94] hover:decoration-[#FFE600] inline-flex items-center gap-0.5 transition-colors cursor-pointer"
            >
              <span>{linkContent}</span>
              <ExternalLink size={12} className="inline ml-0.5" />
            </a>
          )
        } else {
          elements.push(
            <Link
              key={`link-${lIdx}-${matchIndex}`}
              href={url}
              className="text-[#00FF94] hover:text-[#FFE600] font-semibold underline underline-offset-4 decoration-1 decoration-[#00FF94] hover:decoration-[#FFE600] transition-colors cursor-pointer"
            >
              {linkContent}
            </Link>
          )
        }

        lastIndex = matchIndex + fullMatch.length
      }

      if (lastIndex < contentToParse.length) {
        elements.push(renderBoldText(contentToParse.substring(lastIndex), `l-${lIdx}-a-${lastIndex}`))
      }

      return (
        <div key={lIdx} className="leading-relaxed">
          {prefix}
          {elements}
        </div>
      )
    })
  }

  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  // Fallback local matching
  const findLocalAnswer = (query: string): KnowledgeArticle | null => {
    const raw = query.trim().toLowerCase()
    if (!raw) return null

    // Ignore greetings and recommendation/conversational questions - these must be handled by AI assistant
    if (/^(hey|hi|hello|hola|yo|sup|namaste|salam|kya haal hai|good morning|good afternoon|good evening)\b/i.test(raw)) {
      return null
    }

    if (/\b(suggest|recommend|best|top|which|konsa|konsi|what is|kya hai|tell me|who are you|about|samples\s*wala|sampi)\b/i.test(raw)) {
      return null
    }

    const stopWords = new Set([
      'what', 'is', 'a', 'the', 'to', 'in', 'on', 'for', 'how', 'do', 'i', 'can', 'from',
      'where', 'me', 'my', 'of', 'you', 'have', 'give', 'get', 'want', 'need', 'sample',
      'samples', 'pack', 'packs', 'sound', 'sounds', 'please'
    ])
    const tokens = raw.split(/\s+/).filter((t) => t.length > 2 && !stopWords.has(t))
    if (tokens.length === 0) return null

    let bestArticle: KnowledgeArticle | null = null
    let highestScore = 0

    for (const article of KNOWLEDGE_BASE) {
      let score = 0
      const qLower = article.question.toLowerCase()
      const aLower = article.shortAnswer.toLowerCase()

      const rawRegex = new RegExp(`(^|\\b)${escapeRegExp(raw)}(\\b|$)`, 'i')
      if (rawRegex.test(qLower)) score += 100
      if (article.tags.some((t) => rawRegex.test(t))) score += 80

      tokens.forEach((token) => {
        const tokenRegex = new RegExp(`(^|\\b)${escapeRegExp(token)}(\\b|$)`, 'i')
        if (tokenRegex.test(qLower)) score += 25
        if (article.tags.some((t) => tokenRegex.test(t))) score += 20
        if (tokenRegex.test(aLower)) score += 5
      })

      if (score > highestScore) {
        highestScore = score
        bestArticle = article
      }
    }

    return highestScore >= 75 ? bestArticle : null
  }

  // Submit from Screen 1 (Hero Landing)
  const handleHeroSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const query = heroInput.trim()

    if (!query || query.length < 3) {
      setInputError('Describe the problem in more detail.')
      return
    }

    setInputError('')
    setIsHeroLoading(true)

    const time = formatCurrentTime()

    setTimeout(async () => {
      setIsHeroLoading(false)
      setIsChatStarted(true)

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        timestamp: time,
        content: query,
      }

      const introMsg: ChatMessage = {
        id: `intro-${Date.now()}`,
        sender: 'assistant',
        timestamp: time,
        content:
          "Hey 👋 I'm Sampi, your Samples Wala Support Assistant. I'm AI-powered and here to help you with your sound packs, downloads, and questions.",
        isGreeting: true,
        isThinking: false,
      }

      const thinkingMsgId = `thinking-${Date.now()}`
      const thinkingMsg: ChatMessage = {
        id: thinkingMsgId,
        sender: 'assistant',
        timestamp: time,
        isThinking: true,
      }

      setMessages([introMsg, userMsg, thinkingMsg])

      try {
        const clientUser = user
          ? {
              id: user.id,
              email: user.email,
              name: user.user_metadata?.full_name || user.email?.split('@')[0],
            }
          : undefined

        const isHeroAbuse = checkIsInappropriateLanguage(query)
        if (isHeroAbuse) {
          strikesRef.current = 1
          setPolicyStrikes(1)
          const finalContent = getDeterministicWarning(1, query)
          setMessages((prev) =>
            prev.map((m) =>
              m.id === thinkingMsgId
                ? {
                    id: `asst-${Date.now()}`,
                    sender: 'assistant',
                    timestamp: formatCurrentTime(),
                    content: finalContent,
                    isWarning: true,
                    isThinking: false,
                    isSourcesOpen: false,
                    needsTicket: false,
                    canEscalateToTicket: false,
                  }
                : m
            )
          )
          return
        }

        const isExplicitHumanRequest =
          /\b(human|agent|talk to human|live chat|live support|customer care|executive|real person|baat karni hai|insan|engineer se|support desk|live support chahiye)\b/i.test(
            query.toLowerCase()
          )

        if (isExplicitHumanRequest) {
          const asstMsgId = `asst-${Date.now()}`
          setMessages((prev) =>
            prev.map((m) =>
              m.id === thinkingMsgId
                ? {
                    id: asstMsgId,
                    sender: 'assistant',
                    timestamp: formatCurrentTime(),
                    content: "I understand you would like to connect directly with human support or our Live Audio Engineering Desk. Let me check live desk availability for you right now...",
                    showLiveChatDesk: true,
                    liveChatStatus: 'checking',
                    needsTicket: false,
                    userQuery: query,
                    isThinking: false,
                  }
                : m
            )
          )

          setTicketSubject(query.slice(0, 120))
          setTicketDescription(query)

          setTimeout(() => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === asstMsgId
                  ? {
                      ...m,
                      liveChatStatus: 'unavailable',
                      needsTicket: true,
                    }
                  : m
              )
            )
          }, 1200)
          return
        }

        const [groqRes] = await Promise.all([
          askGroqSupportAction(query, [], clientUser, 0),
          new Promise((r) => setTimeout(r, 650)),
        ])

        const isViolation =
          Boolean(groqRes?.isPolicyViolation) ||
          Boolean(groqRes?.shouldTerminateChat)

        if (isViolation) {
          strikesRef.current = 1
          setPolicyStrikes(1)
          const finalContent = getDeterministicWarning(1, query)

          setMessages((prev) =>
            prev.map((m) =>
              m.id === thinkingMsgId
                ? {
                    id: `asst-${Date.now()}`,
                    sender: 'assistant',
                    timestamp: formatCurrentTime(),
                    content: finalContent,
                    isWarning: true,
                    isThinking: false,
                    isSourcesOpen: false,
                    needsTicket: false,
                    canEscalateToTicket: false,
                  }
                : m
            )
          )
          return
        }

        if (groqRes && groqRes.success && groqRes.answer) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === thinkingMsgId
                ? {
                    id: `asst-${Date.now()}`,
                    sender: 'assistant',
                    timestamp: formatCurrentTime(),
                    content: groqRes.answer,
                    recommendedProducts: groqRes.recommendedProducts,
                    verifiedDownload: groqRes.verifiedDownload,
                    verifiedOrder: groqRes.verifiedOrder,
                    canEscalateToTicket: groqRes.canEscalateToTicket,
                    needsTicket: false,
                    userQuery: query,
                    hasTroubleshootingSolution: Boolean(groqRes.hasTroubleshootingSolution),
                    isThinking: false,
                    isSourcesOpen: false,
                  }
                : m
            )
          )
        } else {
          const localMatch = findLocalAnswer(query)
          let fallbackContent = ''
          if (localMatch) {
            fallbackContent = `Hello! I'm Sampi, your Samples Wala Support Assistant.\n\n${localMatch.shortAnswer}\n\nHere are the exact steps:\n${localMatch.detailedSteps.map((s, idx) => `${idx + 1}. **Step ${idx + 1}**: ${s}`).join('\n')}\n\nAre you downloading on Windows or Mac, or need DAW setup help in FL Studio, Ableton, or Logic Pro?`
          } else if (/\b(samples\s*wala|kya hai|what is|about|who are you|sampi)\b/i.test(query)) {
            fallbackContent = `Hello! I'm Sampi, your official Samples Wala AI Audio Assistant.\n\nSamples Wala is India's leading digital sound boutique providing 100% royalty-free authentic Indian sound packs, loops, one-shots, and vocal presets for music producers, beatmakers, and sound designers.\n\nAre you looking for sound pack recommendations, order assistance, or DAW setup guidance?`
          } else {
            fallbackContent = `Hello! I'm Sampi, your Samples Wala AI Audio Assistant. I'm here to help you with sound packs, order downloads, and DAW setup. Could you please share a few more details about what you need assistance with?`
          }

          setMessages((prev) =>
            prev.map((m) =>
              m.id === thinkingMsgId
                ? {
                    id: `asst-${Date.now()}`,
                    sender: 'assistant',
                    timestamp: formatCurrentTime(),
                    article: localMatch || undefined,
                    userQuery: query,
                    content: fallbackContent,
                    needsTicket: false,
                    hasTroubleshootingSolution: Boolean(localMatch && (localMatch.category === 'downloads' || localMatch.category === 'billing_invoices' || localMatch.category === 'daw_setup')),
                    isThinking: false,
                  }
                : m
            )
          )
        }
      } catch (err) {
        const isCatchAbuse = checkIsInappropriateLanguage(query)
        if (isCatchAbuse) {
          strikesRef.current = 1
          setPolicyStrikes(1)
          setMessages((prev) =>
            prev.map((m) =>
              m.id === thinkingMsgId
                ? {
                    id: `asst-${Date.now()}`,
                    sender: 'assistant',
                    timestamp: formatCurrentTime(),
                    content: getDeterministicWarning(1, query),
                    isWarning: true,
                    isThinking: false,
                    isSourcesOpen: false,
                    needsTicket: false,
                    canEscalateToTicket: false,
                  }
                : m
            )
          )
          return
        }

        const localMatch = findLocalAnswer(query)
        setMessages((prev) =>
          prev.map((m) =>
            m.id === thinkingMsgId
              ? {
                  id: `asst-${Date.now()}`,
                  sender: 'assistant',
                  timestamp: formatCurrentTime(),
                  article: localMatch || undefined,
                  userQuery: query,
                  needsTicket: false,
                  isThinking: false,
                }
              : m
          )
        )
      }
    }, 600)
  }

  // Submit from bottom input bar on Screen 2 (Chat)
  const handleChatSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const text = chatInput.trim()
    if (!text || isTyping || isChatEnded || strikesRef.current >= 4) return

    const time = formatCurrentTime()
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: time,
      content: text,
    }

    const thinkingMsgId = `thinking-${Date.now()}`
    const thinkingMsg: ChatMessage = {
      id: thinkingMsgId,
      sender: 'assistant',
      timestamp: time,
      isThinking: true,
    }

    setMessages((prev) => [...prev, userMsg, thinkingMsg])
    setChatInput('')
    setIsTyping(true)

    const isLocalAbuse = checkIsInappropriateLanguage(text)
    if (isLocalAbuse) {
      setTimeout(() => {
        strikesRef.current += 1
        const currentStrike = strikesRef.current
        setPolicyStrikes(currentStrike)

        const shouldEnd = currentStrike >= 4
        if (shouldEnd) {
          setIsChatEnded(true)
        }

        const warningText = getDeterministicWarning(currentStrike, text)

        setMessages((prev) =>
          prev.map((m) =>
            m.id === thinkingMsgId
              ? {
                  id: `asst-${Date.now()}`,
                  sender: 'assistant',
                  timestamp: formatCurrentTime(),
                  content: warningText,
                  isWarning: true,
                  isThinking: false,
                  isSourcesOpen: false,
                  needsTicket: false,
                  canEscalateToTicket: false,
                }
              : m
          )
        )
        setIsTyping(false)
      }, 350)
      return
    }

    const isExplicitHumanRequest =
      /\b(human|agent|talk to human|live chat|live support|customer care|executive|real person|baat karni hai|insan|engineer se|support desk|live support chahiye)\b/i.test(
        text.toLowerCase()
      )

    if (isExplicitHumanRequest) {
      setTimeout(() => {
        const asstMsgId = `asst-${Date.now()}`
        setMessages((prev) =>
          prev.map((m) =>
            m.id === thinkingMsgId
              ? {
                  id: asstMsgId,
                  sender: 'assistant',
                  timestamp: formatCurrentTime(),
                  content: "I understand you would like to connect directly with human support or our Live Audio Engineering Desk. Let me check live desk availability for you right now...",
                  showLiveChatDesk: true,
                  liveChatStatus: 'checking',
                  needsTicket: false,
                  userQuery: text,
                  isThinking: false,
                }
              : m
          )
        )

        setTicketSubject(text.slice(0, 120))
        setTicketDescription(text)
        setIsTyping(false)

        setTimeout(() => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === asstMsgId
                ? {
                    ...m,
                    liveChatStatus: 'unavailable',
                    needsTicket: true,
                  }
                : m
            )
          )
        }, 1200)
      }, 350)
      return
    }

    const history = messages
      .filter((m) => !m.isThinking && (m.content || m.article?.question))
      .slice(-4)
      .map((m) => ({
        role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.content || m.article?.shortAnswer || '',
      }))

    try {
      const clientUser = user
        ? {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.email?.split('@')[0],
          }
        : undefined

      const currentStrikesToSend = strikesRef.current

      const [groqRes] = await Promise.all([
        askGroqSupportAction(text, history, clientUser, currentStrikesToSend),
        new Promise((r) => setTimeout(r, 650)),
      ])
      setIsTyping(false)

      const isViolation =
        Boolean(groqRes?.isPolicyViolation) ||
        Boolean(groqRes?.shouldTerminateChat)

      if (isViolation) {
        strikesRef.current += 1
        const currentStrike = strikesRef.current
        setPolicyStrikes(currentStrike)

        const shouldEndChat = currentStrike >= 4 || Boolean(groqRes?.shouldTerminateChat)
        if (shouldEndChat) {
          setIsChatEnded(true)
        }

        const warningText = getDeterministicWarning(currentStrike, text)

        setMessages((prev) =>
          prev.map((m) =>
            m.id === thinkingMsgId
              ? {
                  id: `asst-${Date.now()}`,
                  sender: 'assistant',
                  timestamp: formatCurrentTime(),
                  content: warningText,
                  isWarning: true,
                  isThinking: false,
                  isSourcesOpen: false,
                  needsTicket: false,
                  canEscalateToTicket: false,
                }
              : m
          )
        )
        return
      }

      if (groqRes && groqRes.success && groqRes.answer) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === thinkingMsgId
              ? {
                  id: `asst-${Date.now()}`,
                  sender: 'assistant',
                  timestamp: formatCurrentTime(),
                  content: groqRes.answer,
                  recommendedProducts: groqRes.recommendedProducts,
                  verifiedDownload: groqRes.verifiedDownload,
                  verifiedOrder: groqRes.verifiedOrder,
                  canEscalateToTicket: groqRes.canEscalateToTicket,
                  needsTicket: false,
                  userQuery: text,
                  hasTroubleshootingSolution: Boolean(groqRes.hasTroubleshootingSolution),
                  isThinking: false,
                  isSourcesOpen: false,
                }
              : m
          )
        )
      } else {
        const localMatch = findLocalAnswer(text)
        let fallbackContent = ''
        if (localMatch) {
          fallbackContent = `Hello! I'm Sampi, your Samples Wala Support Assistant.\n\n${localMatch.shortAnswer}\n\nHere are the exact steps:\n${localMatch.detailedSteps.map((s, idx) => `${idx + 1}. **Step ${idx + 1}**: ${s}`).join('\n')}\n\nAre you downloading on Windows or Mac, or need DAW setup help in FL Studio, Ableton, or Logic Pro?`
        } else if (/\b(samples\s*wala|kya hai|what is|about|who are you|sampi)\b/i.test(text)) {
          fallbackContent = `Hello! I'm Sampi, your official Samples Wala AI Audio Assistant.\n\nSamples Wala is India's leading digital sound boutique providing 100% royalty-free authentic Indian sound packs, loops, one-shots, and vocal presets for music producers, beatmakers, and sound designers.\n\nAre you looking for sound pack recommendations, order assistance, or DAW setup guidance?`
        } else {
          fallbackContent = `I'm Sampi, your Samples Wala AI Audio Assistant. I'm here to help you with our sound packs, order downloads, and production setup. Could you please share a bit more detail about what you need help with?`
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === thinkingMsgId
              ? {
                  id: `asst-${Date.now()}`,
                  sender: 'assistant',
                  timestamp: formatCurrentTime(),
                  article: localMatch || undefined,
                  userQuery: text,
                  content: fallbackContent,
                  needsTicket: false,
                  hasTroubleshootingSolution: Boolean(localMatch && (localMatch.category === 'downloads' || localMatch.category === 'billing_invoices' || localMatch.category === 'daw_setup')),
                  isThinking: false,
                }
              : m
          )
        )
      }
    } catch (e) {
      setIsTyping(false)
      const isCatchAbuse = checkIsInappropriateLanguage(text)
      if (isCatchAbuse) {
        strikesRef.current += 1
        const currentStrike = strikesRef.current
        setPolicyStrikes(currentStrike)
        if (currentStrike >= 4) {
          setIsChatEnded(true)
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === thinkingMsgId
              ? {
                  id: `asst-${Date.now()}`,
                  sender: 'assistant',
                  timestamp: formatCurrentTime(),
                  content: getDeterministicWarning(currentStrike, text),
                  isWarning: true,
                  isThinking: false,
                  isSourcesOpen: false,
                  needsTicket: false,
                  canEscalateToTicket: false,
                }
              : m
          )
        )
        return
      }

      const localMatch = findLocalAnswer(text)
      setMessages((prev) =>
        prev.map((m) =>
          m.id === thinkingMsgId
            ? {
                id: `asst-${Date.now()}`,
                sender: 'assistant',
                timestamp: formatCurrentTime(),
                article: localMatch || undefined,
                userQuery: text,
                needsTicket: false,
                isThinking: false,
              }
            : m
        )
      )
    }
  }

  const toggleSources = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, isSourcesOpen: !m.isSourcesOpen } : m
      )
    )
  }

  const handleFeedback = (msgId: string, helpful: boolean) => {
    if (helpful) {
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id === msgId) {
            return {
              ...m,
              feedback: 'yes',
              needsTicket: false,
              showLiveChatDesk: false,
            }
          }
          return m
        })
      )
      setIsChatEnded(true)
      return
    }

    // User clicked 'No' -> AI answer did not solve problem!
    const targetMsg = messages.find((m) => m.id === msgId)
    const userQ = targetMsg?.userQuery || 'Samples Wala Support Request'

    // Prepopulate ticket fields
    setTicketSubject(userQ.slice(0, 120))
    setTicketDescription(userQ)
    const matchOrder = userQ.match(/\b(SW-ORD-[A-Za-z0-9_-]+|ORD-[A-Za-z0-9_-]+|pay_[A-Za-z0-9]+)\b/i)
    if (matchOrder) {
      setTicketOrderId(matchOrder[0])
    }
    if (/\b(download|vault|zip|extract|file|corrupt)\b/i.test(userQ)) {
      setTicketCategory('download')
    } else if (/\b(pay|payment|order|money|charge|refund|invoice|upi|card)\b/i.test(userQ)) {
      setTicketCategory('payment')
    } else if (/\b(daw|fl\s*studio|ableton|logic|cubase|vst|plugin)\b/i.test(userQ)) {
      setTicketCategory('daw')
    } else if (/\b(license|royalty|commercial|copyright)\b/i.test(userQ)) {
      setTicketCategory('licensing')
    } else {
      setTicketCategory('technical')
    }

    // Step 1: Set feedback to 'no', show Live Chat Desk checking
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === msgId) {
          return {
            ...m,
            feedback: 'no',
            showLiveChatDesk: true,
            liveChatStatus: 'checking',
            needsTicket: false,
          }
        }
        return m
      })
    )

    // Step 2: After 1200ms, Live Chat Desk shows offline and reveals the Raise Ticket box!
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id === msgId) {
            return {
              ...m,
              liveChatStatus: 'unavailable',
              needsTicket: true,
            }
          }
          return m
        })
      )
    }, 1200)
  }

  const triggerLiveChatDesk = () => {
    setIsOptionsMenuOpen(false)
    const lastMsg = [...messages].reverse().find((m) => m.sender === 'assistant' && !m.isThinking)
    if (lastMsg) {
      handleFeedback(lastMsg.id, false)
    } else {
      const asstMsgId = `asst-${Date.now()}`
      const newMsg: ChatMessage = {
        id: asstMsgId,
        sender: 'assistant',
        timestamp: formatCurrentTime(),
        content: "Checking the Live Audio Engineering Desk for you right now...",
        showLiveChatDesk: true,
        liveChatStatus: 'checking',
        needsTicket: false,
      }
      setMessages((prev) => [...prev, newMsg])
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === asstMsgId
              ? { ...m, liveChatStatus: 'unavailable', needsTicket: true }
              : m
          )
        )
      }, 1200)
    }
  }

  const handleCreateTicket = async (msgId: string, subjectQuery?: string) => {
    const emailToSend = ticketEmail.trim() || user?.email || ''
    if (!emailToSend) {
      setTicketError('Please provide your email address so our audio engineers can reply.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailToSend)) {
      setTicketError('Please enter a valid email address.')
      return
    }

    setIsSubmittingTicket(true)
    setTicketError('')

    try {
      const customerName = ticketName.trim() || user?.user_metadata?.full_name || 'Producer'
      const targetMsg = messages.find((m) => m.id === msgId)
      const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user')
      const exactUserQuestion =
        ticketSubject.trim() ||
        targetMsg?.userQuery?.trim() ||
        subjectQuery?.trim() ||
        lastUserMsg?.content?.trim() ||
        'Samples Wala Support Request'

      const exactDescription =
        ticketDescription.trim() ||
        targetMsg?.userQuery?.trim() ||
        lastUserMsg?.content?.trim() ||
        exactUserQuestion

      const conversationHistory = messages
        .filter((m) => !m.isThinking && (m.content || m.userQuery))
        .map((m) => {
          const role = m.sender === 'user' ? 'Customer' : 'Sampi (AI Assistant)'
          const text = m.content || m.userQuery || ''
          return `[${m.timestamp}] ${role}:\n${text}`
        })
        .join('\n\n--------------------\n\n')

      // 1. Submit to Supabase DB (also dispatches server-side formsubmit)
      const res = await createSupportTicketAction({
        name: customerName,
        email: emailToSend,
        category: ticketCategory || 'technical',
        priority: ticketPriority || 'NORMAL',
        orderId: ticketOrderId.trim() || undefined,
        daw: ticketDaw.trim() || undefined,
        osPlatform: 'Web / Studio',
        subject: exactUserQuestion.slice(0, 150),
        description: `User Question: "${exactUserQuestion}"\n\nIssue Details:\n${exactDescription}\n\n=== FULL CONVERSATION TRANSCRIPT ===\n${conversationHistory}`,
      })

      const finalTicketNumber = res?.ticketNumber || `SW-TK-${Math.floor(10000 + Math.random() * 90000)}`

      // 2. Client-side FormSubmit AJAX dispatch directly to support@sampleswala.com
      try {
        await fetch('https://formsubmit.co/ajax/support@sampleswala.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name: customerName,
            email: emailToSend,
            _subject: `[Samples Wala Ticket #${finalTicketNumber}] ${exactUserQuestion.slice(0, 100)}`,
            ticket_number: finalTicketNumber,
            category: ticketCategory,
            priority: ticketPriority,
            order_id: ticketOrderId.trim() || 'N/A',
            daw: ticketDaw || 'N/A',
            user_question: exactUserQuestion,
            issue_details: exactDescription,
            conversation_history: conversationHistory,
            _captcha: 'false',
            _template: 'table',
          }),
        })
      } catch (fsErr) {
        console.warn('[FormSubmit Notice]', fsErr)
      }

      // 3. Persist ticket code to localStorage for guest tracking continuity
      try {
        const stored = JSON.parse(localStorage.getItem('sampleswala_user_tickets') || '[]')
        if (!stored.includes(finalTicketNumber)) {
          stored.unshift(finalTicketNumber)
          localStorage.setItem('sampleswala_user_tickets', JSON.stringify(stored.slice(0, 30)))
        }
      } catch {}

      // 4. Update message state to show confirmed ticket card
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId
            ? { ...m, needsTicket: false, ticketNumber: finalTicketNumber }
            : m
        )
      )
      setIsChatEnded(true)
    } catch (e: any) {
      setTicketError(e?.message || 'Failed to submit ticket. Please try again.')
    } finally {
      setIsSubmittingTicket(false)
    }
  }

  const handleResetToHero = () => {
    setIsOptionsMenuOpen(false)
    setIsChatStarted(false)
    setIsChatEnded(false)
    strikesRef.current = 0
    setPolicyStrikes(0)
    setHeroInput('')
    setInputError('')
    setChatInput('')
    setMessages([])
    setIsTyping(false)
    setIsHeroLoading(false)
    setIsSubHeaderVisible(false)
    lastScrollTopRef.current = 0
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '/support')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* ========================================================================= */}
      {/* SCREEN 1: HERO LANDING STATE (Samples Wala Theme: Studio Blue & Neon)      */}
      {/* ========================================================================= */}
      {!isChatStarted ? (
        <div className="support-page-container relative w-full h-full flex-1 bg-[#07080a] text-white font-sans selection:bg-[#0074e4] selection:text-white overflow-hidden flex flex-col items-center justify-center">
          
          {/* Ambient Glowing Background: Samples Wala Electric Blue & Neon Accents */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_12%_15%,_rgba(0,116,228,0.30)_0%,_rgba(0,255,148,0.12)_35%,_rgba(255,230,0,0.04)_60%,_transparent_80%)] pointer-events-none z-0" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_90%_25%,_rgba(0,116,228,0.22)_0%,_rgba(0,255,148,0.06)_40%,_transparent_70%)] pointer-events-none z-0" />

          {/* Large Angled Volumetric Light Shaft slicing across screen */}
          <div className="absolute -top-36 -left-32 w-[900px] h-[650px] -rotate-[38deg] bg-gradient-to-r from-[#0074e4]/35 via-cyan-500/18 to-transparent blur-3xl pointer-events-none z-0" />
          <div className="absolute top-1/4 right-[2%] w-[260px] h-[600px] bg-gradient-to-b from-[#0074e4]/20 via-[#00FF94]/10 to-transparent blur-3xl rounded-full pointer-events-none z-0" />
          
          {/* Depth-of-Field Blurred SVG Bokeh & Studio Audio Beams */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <filter id="swBokehExtreme" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="30" />
              </filter>
              <filter id="swBokehHeavy" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="18" />
              </filter>
              <filter id="swBokehMedium" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="10" />
              </filter>
              <filter id="swBokehSoft" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" />
              </filter>

              <linearGradient id="swBlueBeam" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#0074e4" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#00FF94" stopOpacity="0.15" />
              </linearGradient>

              <linearGradient id="swWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0074e4" stopOpacity="0.1" />
                <stop offset="30%" stopColor="#0074e4" stopOpacity="0.75" />
                <stop offset="60%" stopColor="#00FF94" stopOpacity="0.85" />
                <stop offset="85%" stopColor="#FFE600" stopOpacity="0.6" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0.1" />
              </linearGradient>

              <linearGradient id="swMusicNoteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0074e4" stopOpacity="0.4" />
              </linearGradient>

              <radialGradient id="swBokehCircle" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.5" />
                <stop offset="45%" stopColor="#38bdf8" stopOpacity="0.25" />
                <stop offset="85%" stopColor="#0074e4" stopOpacity="0.12" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Flowing Analog Audio Waveforms */}
            <path
              d="M -60 380 C 140 240, 320 540, 540 360 S 840 200, 1080 430 S 1320 270, 1500 380"
              fill="none"
              stroke="url(#swWaveGrad)"
              strokeWidth="4.5"
              filter="url(#swBokehMedium)"
              opacity="0.85"
            />

            <path
              d="M -40 440 Q 60 390, 160 440 T 360 440 T 560 440 T 760 440 T 960 440 T 1160 440 T 1360 440 T 1480 440"
              fill="none"
              stroke="url(#swBlueBeam)"
              strokeWidth="2.5"
              filter="url(#swBokehHeavy)"
              opacity="0.45"
            />

            <path
              d="M -80 620 C 220 480, 500 740, 820 590 S 1220 470, 1520 640"
              fill="none"
              stroke="url(#swBlueBeam)"
              strokeWidth="6"
              filter="url(#swBokehExtreme)"
              opacity="0.3"
            />

            {/* Glowing Musical Notation */}
            <g transform="translate(320, 350) rotate(-14) scale(1.15)" filter="url(#swBokehMedium)">
              <ellipse cx="0" cy="40" rx="18" ry="12" transform="rotate(-25 0 40)" fill="url(#swMusicNoteGrad)" />
              <ellipse cx="62" cy="25" rx="18" ry="12" transform="rotate(-25 62 25)" fill="url(#swMusicNoteGrad)" />
              <rect x="14" y="-22" width="4.5" height="62" rx="2" fill="url(#swMusicNoteGrad)" />
              <rect x="76" y="-37" width="4.5" height="62" rx="2" fill="url(#swMusicNoteGrad)" />
              <polygon points="14,-22 80.5,-37 80.5,-24 14,-9" fill="url(#swMusicNoteGrad)" />
            </g>

            <g transform="translate(1120, 310) rotate(12) scale(1.05)" filter="url(#swBokehMedium)">
              <ellipse cx="0" cy="30" rx="17" ry="11.5" transform="rotate(-25 0 30)" fill="url(#swMusicNoteGrad)" />
              <rect x="13" y="-32" width="4.2" height="62" rx="2" fill="url(#swMusicNoteGrad)" />
              <path d="M 17 -32 C 38 -25, 45 -5, 32 16 C 41 0, 37 -19, 17 -26 Z" fill="url(#swMusicNoteGrad)" />
            </g>

            {/* DAW Equalizer Spectrum Bars */}
            <g transform="translate(610, 230)" filter="url(#swBokehHeavy)" opacity="0.45">
              <rect x="0" y="45" width="9" height="55" rx="4.5" fill="url(#swBlueBeam)" />
              <rect x="18" y="22" width="9" height="78" rx="4.5" fill="url(#swBlueBeam)" />
              <rect x="36" y="8" width="9" height="92" rx="4.5" fill="url(#swBlueBeam)" />
              <rect x="54" y="32" width="9" height="68" rx="4.5" fill="url(#swBlueBeam)" />
              <rect x="72" y="14" width="9" height="86" rx="4.5" fill="url(#swBlueBeam)" />
              <rect x="90" y="38" width="9" height="62" rx="4.5" fill="url(#swBlueBeam)" />
              <rect x="108" y="55" width="9" height="45" rx="4.5" fill="url(#swBlueBeam)" />
            </g>

            {/* Aperture Bokeh Discs */}
            <circle cx="480" cy="430" r="42" fill="url(#swBokehCircle)" filter="url(#swBokehMedium)" opacity="0.8" />
            <circle cx="280" cy="300" r="56" fill="url(#swBokehCircle)" filter="url(#swBokehHeavy)" opacity="0.65" />
            <circle cx="1060" cy="390" r="48" fill="url(#swBokehCircle)" filter="url(#swBokehMedium)" opacity="0.75" />
          </svg>

          {/* Glowing Dust Particles */}
          <div className="absolute top-1/4 left-[24%] w-3 h-3 rounded-full bg-[#0074e4] blur-[1px] opacity-80 pointer-events-none z-0 animate-pulse" />
          <div className="absolute top-[32%] left-[28%] w-1.5 h-1.5 rounded-full bg-[#00FF94] opacity-95 pointer-events-none z-0 shadow-[0_0_10px_#00FF94]" />
          <div className="absolute bottom-1/3 left-[17%] w-4 h-4 rounded-full bg-[#0074e4] blur-[2px] opacity-75 pointer-events-none z-0" />
          <div className="absolute top-[22%] right-[23%] w-2 h-2 rounded-full bg-[#FFE600] opacity-75 pointer-events-none z-0 shadow-[0_0_8px_#FFE600]" />
          <div className="absolute bottom-1/4 right-[21%] w-3 h-3 rounded-full bg-[#0074e4] blur-[1px] opacity-80 pointer-events-none z-0 animate-pulse" />

          {/* Top Bar Actions */}
          <div className="absolute top-5 right-6 sm:top-6 sm:right-10 z-20 flex items-center gap-2.5">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#0d0f14] border border-[#1b2230] hover:border-[#00FF94] text-xs text-zinc-300 hover:text-white transition-colors shadow-xl"
              title="Return to Samples Wala Home"
            >
              <Home size={12} className="text-[#00FF94]" />
              <span className="font-semibold">Home</span>
            </Link>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[6px] bg-[#0d0f14] border border-[#1b2230] text-xs text-zinc-300 shadow-xl">
              <span className="text-zinc-400 font-normal">Server status:</span>
              <span className="inline-flex items-center gap-1.5 text-[#00FF94] font-semibold text-xs">
                <span className="w-3.5 h-3.5 rounded-full bg-[#00FF94] flex items-center justify-center text-black">
                  <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                All systems operational
              </span>
            </div>
          </div>

          {/* Center Hero Heading & Input */}
          <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 w-full py-8 flex flex-col items-center justify-center text-center my-auto">
            <div className="space-y-2 mb-7 sm:mb-8">
              <p className="text-sm sm:text-[15px] font-medium text-zinc-300 tracking-normal">
                Samples Wala Support
              </p>
              <h1 className="text-4xl sm:text-[48px] font-bold text-white tracking-tight leading-tight">
                How can we help?
              </h1>
            </div>

            {/* Problem Input Box */}
            <form onSubmit={handleHeroSubmit} className="w-full max-w-[650px] mx-auto">
              <div className="flex items-center gap-3 w-full">
                <input
                  type="text"
                  value={heroInput}
                  disabled={isHeroLoading}
                  onChange={(e) => {
                    setHeroInput(e.target.value)
                    if (inputError) setInputError('')
                  }}
                  placeholder="Describe your problem here"
                  className={`flex-1 bg-[#0d1017] hover:bg-[#111520] focus:bg-[#111520] border-2 rounded-xl px-5 py-3 sm:py-3.5 text-sm sm:text-[15px] text-white font-medium placeholder-zinc-500 focus:outline-none transition-all shadow-[4px_4px_0px_black] disabled:opacity-50 disabled:cursor-not-allowed ${
                    inputError
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-black focus:border-[#FFE600]'
                  }`}
                />

                <button
                  type="submit"
                  disabled={isHeroLoading || heroInput.trim().length < 3}
                  aria-label="Submit problem"
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all flex-shrink-0 border-2 border-black ${
                    heroInput.trim().length >= 3
                      ? 'bg-[#00FF94] hover:bg-[#19ff9e] text-black shadow-[3px_3px_0px_black] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer'
                      : 'bg-white/[0.07] text-white/20 border-black/40 cursor-not-allowed pointer-events-none'
                  }`}
                >
                  {isHeroLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                  ) : (
                    <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                  )}
                </button>
              </div>

              {inputError && (
                <div className="text-left pt-2 px-2 flex items-center gap-1.5 text-xs text-rose-400 font-medium animate-in fade-in">
                  <AlertTriangle size={13} className="text-rose-500 flex-shrink-0" />
                  <span>{inputError}</span>
                </div>
              )}
            </form>

            <p className="text-xs text-zinc-400 mt-4.5">
              By continuing, you agree to our{' '}
              <Link href="/terms" className="text-zinc-300 hover:text-white underline underline-offset-2">
                Terms
              </Link>{' '}
              and acknowledge our{' '}
              <Link href="/privacy" className="text-zinc-300 hover:text-white underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </p>
          </main>
        </div>
      ) : (
        /* ========================================================================= */
        /* SCREEN 2: CHAT ASSISTANT INTERACTION                                      */
        /* ========================================================================= */
        <div className="support-page-container w-full h-full flex-1 bg-[#07080a] text-white font-sans flex flex-col overflow-hidden relative">
          
          {/* Sampi Sub-Header (Scroll niche jane pe slide-in hota hai, scroll upar jane pe gayab) */}
          <div
            className={`flex-shrink-0 w-full bg-[#07080a] z-20 relative border-b border-white/[0.04] transition-all duration-300 ease-in-out overflow-hidden ${
              isSubHeaderVisible
                ? 'max-h-14 opacity-100 translate-y-0'
                : 'max-h-0 opacity-0 -translate-y-full border-transparent py-0 pointer-events-none'
            }`}
          >
            <div className="w-full max-w-5xl mx-auto h-11 sm:h-12 flex items-center justify-center px-4 sm:px-8">
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.24em] uppercase text-zinc-300 select-none font-sans flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF94] animate-pulse" />
                <span>Sampi • Samples Wala Support Assistant</span>
              </span>
            </div>
            <div 
              className="absolute top-full left-0 right-0 h-6 pointer-events-none z-10"
              style={{
                background: 'linear-gradient(to bottom, #07080a 0%, transparent 100%)',
              }}
            />
          </div>

          {/* Scrollable Chat Feed Area (ONLY THIS SCROLLS!) */}
          <div 
            onScroll={(e) => {
              const currentScrollTop = e.currentTarget.scrollTop
              const isPast = currentScrollTop > 50
              if (isPast !== isChatScrolled) setIsChatScrolled(isPast)

              // Niche jane pe ana chahiye, upar jane pe gayab
              if (currentScrollTop > 40 && currentScrollTop > lastScrollTopRef.current + 3) {
                setIsSubHeaderVisible(true)
              } else if (currentScrollTop < lastScrollTopRef.current - 3 || currentScrollTop <= 25) {
                setIsSubHeaderVisible(false)
              }
              lastScrollTopRef.current = currentScrollTop
            }}
            data-lenis-prevent="true"
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden w-full relative z-0"
          >
            {/* Header Title with Ambient Backdrop */}
            <div className="relative w-full pt-8 pb-2 text-center select-none">
              <div 
                className="absolute inset-x-0 top-0 h-[340px] pointer-events-none select-none overflow-hidden -z-0"
                style={{
                  maskImage: 'linear-gradient(to bottom, black 25%, rgba(0,0,0,0.6) 65%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 25%, rgba(0,0,0,0.6) 65%, transparent 100%)'
                }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[220px] bg-[radial-gradient(ellipse_75%_50%_at_50%_10%,_rgba(0,116,228,0.18)_0%,_rgba(0,255,148,0.06)_45%,_transparent_75%)] blur-3xl" />
                <div className="absolute -top-16 -left-12 w-[500px] h-[200px] -rotate-[30deg] bg-gradient-to-r from-[#0074e4]/16 via-cyan-500/08 to-transparent blur-3xl" />
                <div className="absolute -top-16 -right-12 w-[500px] h-[200px] rotate-[30deg] bg-gradient-to-l from-[#0074e4]/14 via-[#00FF94]/06 to-transparent blur-3xl" />
              </div>

              <div className="space-y-1.5 relative z-10 px-4">
                <p className="text-[11px] sm:text-xs font-semibold tracking-[0.24em] uppercase text-zinc-400 font-mono">
                  Your Chat With
                </p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  Sampi
                </h2>
                <p className="text-xs text-zinc-400 font-medium tracking-wide">
                  Samples Wala Support Assistant
                </p>
              </div>
            </div>

            {/* Main Chat Feed */}
            <main className="w-full max-w-5xl mx-auto px-4 sm:px-8 lg:px-10 pt-2 pb-48 flex-1 space-y-8 sm:space-y-10">
              
              <div className="text-center pt-8 pb-4 sm:pb-6">
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#10131c] border-2 border-black text-xs text-zinc-300 font-black uppercase tracking-wider select-none shadow-[3px_3px_0px_black]">
                  {formatCurrentDate()}
                </span>
              </div>
              
              {(() => {
                const nonGreetingAsst = messages.filter((m) => m.sender === 'assistant' && !m.isGreeting && !m.isThinking)
                const latestAsstId = nonGreetingAsst.length > 0 ? nonGreetingAsst[nonGreetingAsst.length - 1].id : null

                return messages.map((msg) => {
                  const isLatestAssistant = msg.id === latestAsstId

                  if (msg.sender === 'user') {
                    return (
                      <div key={msg.id} id={`msg-container-${msg.id}`} className="flex flex-col items-end space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200 scroll-mt-6">
                        <div className="text-xs text-zinc-400 pr-1 flex items-center gap-2">
                          <span className="font-bold text-zinc-300 uppercase italic">You</span>
                          <span className="text-[11px] text-zinc-500">{msg.timestamp}</span>
                        </div>

                        <div className="bg-gradient-to-r from-[#0052cc] via-[#0066fe] to-[#0080ff] border-2 border-black text-white font-medium px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl rounded-tr-none max-w-xl sm:max-w-2xl shadow-[4px_4px_0px_#00FF94] text-[14.5px] sm:text-[15.5px] leading-relaxed tracking-tight">
                          {msg.content}
                        </div>
                      </div>
                    )
                  }

                  return (
                    <React.Fragment key={msg.id}>
                      <div id={`msg-container-${msg.id}`} className="flex flex-col items-start space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200 w-full max-w-4xl scroll-mt-6">
                        
                        {/* Assistant Header */}
                        <div className="flex items-center gap-2.5 text-xs sm:text-[13px] text-zinc-400 px-1">
                          <Image
                            src="/images/sampi-avatar.png"
                            alt="Sampi"
                            width={24}
                            height={24}
                            className="w-6 h-6 object-contain shrink-0"
                          />
                          <span className="font-black text-black bg-[#FFE600] border border-black px-2 py-0.5 rounded text-[11px] uppercase italic shadow-[1.5px_1.5px_0px_black]">Sampi &bull; AI Assistant</span>
                          <span className="text-[11px] sm:text-xs text-zinc-400">{msg.timestamp}</span>
                        </div>

                        {/* Thinking Spinner */}
                        {msg.isThinking ? (
                          <div className="inline-flex items-center gap-3.5 bg-[#0e1118] border-2 border-[#1e293b] text-zinc-200 rounded-2xl rounded-tl-none px-6 py-4 shadow-[4px_4px_0px_#FFE600] w-fit font-bold relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00FF94] via-[#FFE600] to-[#FF5C00]" />
                            <Image
                              src="/images/sampi-avatar.png"
                              alt="Sampi is thinking..."
                              width={24}
                              height={24}
                              className="w-6 h-6 object-contain shrink-0"
                            />
                            <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-[#00FF94] animate-spin flex-shrink-0" />
                            <span className="text-zinc-200 text-sm sm:text-[15px] font-bold">Sampi is thinking...</span>
                          </div>
                        ) : (
                          <div className="bg-[#0b0e14] border-2 border-[#1e293b] text-[#d4d4d8] rounded-2xl p-6 sm:p-8 md:p-9 text-[15px] sm:text-[16px] leading-[1.75] space-y-5 shadow-[6px_6px_0px_#FFE600] w-full relative overflow-hidden">
                            {/* Colorful Neo-brutalist top accent line */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00FF94] via-[#FFE600] to-[#FF5C00]" />
                            
                            {/* Policy Notice Badge */}
                            {msg.isWarning && (
                              <div className="inline-flex items-center gap-2 bg-[#FF5C00] text-white border-2 border-black px-3 py-1 rounded-lg shadow-[3px_3px_0px_black] font-black uppercase text-[11px] tracking-wider mb-2">
                                <AlertTriangle size={13} className="shrink-0" />
                                <span>Policy Notice &bull; Communication Guidelines</span>
                              </div>
                            )}

                            {/* Answer Content */}
                            {msg.content && (
                              <div className="text-[#d1d1d6] leading-[1.75] space-y-3.5">
                                {renderFormattedAnswer(msg.content)}
                              </div>
                            )}

                            {/* Verified Download Card */}
                            {msg.verifiedDownload && (
                              <div className="rounded-2xl bg-[#0b0e14] border-3 border-black p-5 sm:p-6 space-y-4 shadow-[6px_6px_0px_#00FF94] relative overflow-hidden">
                                <div className="flex items-center justify-between gap-2 border-b-2 border-black pb-3">
                                  <div className="inline-flex items-center gap-1.5 bg-[#00FF94] text-black border-2 border-black font-black uppercase italic tracking-wider px-3 py-1 text-[11px] shadow-[3px_3px_0px_black]">
                                    <CheckCircle2 size={13} strokeWidth={2.5} />
                                    <span>Verified Download &bull; Instant Delivery</span>
                                  </div>
                                  {msg.verifiedDownload.orderNumber && (
                                    <span className="bg-[#FFE600] text-black border-2 border-black font-black font-mono text-[10px] px-2.5 py-0.5 shadow-[2px_2px_0px_black]">
                                      #{msg.verifiedDownload.orderNumber}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-3.5 sm:gap-4">
                                  {msg.verifiedDownload.coverImage && (
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden relative bg-[#18181b] border-2 border-black shadow-[3px_3px_0px_black] shrink-0">
                                      <Image
                                        src={msg.verifiedDownload.coverImage}
                                        alt={msg.verifiedDownload.productName}
                                        fill
                                        sizes="80px"
                                        className="object-cover"
                                      />
                                    </div>
                                  )}
                                  <div className="space-y-1 min-w-0 flex-1">
                                    <h4 className="text-base sm:text-lg font-black uppercase italic tracking-tight text-white truncate">
                                      {msg.verifiedDownload.productName}
                                    </h4>
                                    <p className="text-xs font-bold text-zinc-300">
                                      {msg.verifiedDownload.fileSize || 'Studio Master Archive (24-bit WAV)'}
                                    </p>
                                    <div className="pt-0.5">
                                      <span className="inline-block px-2.5 py-0.5 text-[10px] font-black uppercase italic bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_black]">
                                        100% Royalty-Free Commercial License
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 pt-1.5 flex-wrap">
                                  <a
                                    href={msg.verifiedDownload.downloadUrl}
                                    download
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00FF94] hover:bg-[#19ff9e] text-black border-2 border-black font-black text-xs sm:text-sm uppercase italic tracking-wider shadow-[4px_4px_0px_black] hover:shadow-[2px_2px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
                                  >
                                    <Download size={15} strokeWidth={2.5} />
                                    <span>Download {msg.verifiedDownload.productName}</span>
                                  </a>

                                  <Link
                                    href="/library"
                                    className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-[#161a24] hover:bg-[#202636] text-white border-2 border-black font-bold text-xs uppercase italic shadow-[4px_4px_0px_black] hover:shadow-[2px_2px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                  >
                                    <span>View in My Library</span>
                                    <ArrowRight size={13} strokeWidth={2.5} />
                                  </Link>
                                </div>
                              </div>
                            )}

                            {/* Verified Order / Invoice Card */}
                            {msg.verifiedOrder && (
                              <div className="rounded-2xl bg-[#0b0e14] border-3 border-black p-5 sm:p-6 space-y-4 shadow-[6px_6px_0px_#FFE600] relative overflow-hidden">
                                <div className="flex items-center justify-between gap-2 border-b-2 border-black pb-3">
                                  <div className="inline-flex items-center gap-1.5 bg-[#FFE600] text-black border-2 border-black font-black uppercase italic tracking-wider px-3 py-1 text-[11px] shadow-[3px_3px_0px_black]">
                                    <Receipt size={14} strokeWidth={2.5} />
                                    <span>Tax Invoice &bull; Order #{msg.verifiedOrder.orderNumber}</span>
                                  </div>
                                  <span className="bg-[#00FF94] text-black border-2 border-black font-black uppercase px-2.5 py-0.5 text-[10px] shadow-[2px_2px_0px_black]">
                                    ● Payment Completed
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs py-1">
                                  <div className="bg-[#161a24] p-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_black]">
                                    <span className="text-[10px] text-zinc-400 block uppercase font-mono font-bold">Date</span>
                                    <span className="text-white font-black text-sm">
                                      {new Date(msg.verifiedOrder.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="bg-[#161a24] p-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_black]">
                                    <span className="text-[10px] text-zinc-400 block uppercase font-mono font-bold">Total Paid</span>
                                    <span className="text-[#00FF94] font-black text-sm">
                                      {msg.verifiedOrder.currency === 'USD' ? '$' : '₹'}
                                      {msg.verifiedOrder.amount}
                                    </span>
                                  </div>
                                  <div className="bg-[#161a24] p-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_black]">
                                    <span className="text-[10px] text-zinc-400 block uppercase font-mono font-bold">Gateway</span>
                                    <span className="text-white font-black capitalize text-sm">
                                      {msg.verifiedOrder.gateway || 'Razorpay'}
                                    </span>
                                  </div>
                                  <div className="bg-[#161a24] p-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_black]">
                                    <span className="text-[10px] text-zinc-400 block uppercase font-mono font-bold">Transaction ID</span>
                                    <span className="text-zinc-200 font-mono font-bold text-xs truncate block">
                                      {msg.verifiedOrder.paymentId ? msg.verifiedOrder.paymentId.slice(-10).toUpperCase() : 'VERIFIED'}
                                    </span>
                                  </div>
                                </div>

                                {msg.verifiedOrder.items && msg.verifiedOrder.items.length > 0 && (
                                  <div className="space-y-2 pt-1">
                                    <span className="text-[11px] font-black text-zinc-300 uppercase tracking-wider block">
                                      Purchased Items:
                                    </span>
                                    <div className="space-y-1.5">
                                      {msg.verifiedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-[#161a24] border-2 border-black text-zinc-200 font-bold shadow-[2px_2px_0px_black]">
                                          <span className="font-bold text-white">{item.name}</span>
                                          <span className="font-mono text-[#00FF94] font-black">
                                            {msg.verifiedOrder?.currency === 'USD' ? '$' : '₹'}{item.price}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center gap-3 pt-1.5 flex-wrap">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!msg.verifiedOrder) return
                                      openPrintableInvoice(
                                        {
                                          id: msg.verifiedOrder.orderNumber,
                                          purchased_at: msg.verifiedOrder.date,
                                          amount_paid: msg.verifiedOrder.amount,
                                          currency: msg.verifiedOrder.currency,
                                          razorpay_payment_id: msg.verifiedOrder.paymentId,
                                          customer_name: msg.verifiedOrder.customerName,
                                          customer_email: msg.verifiedOrder.customerEmail,
                                          billing_address: msg.verifiedOrder.billingAddress,
                                          billing_city: msg.verifiedOrder.billingCity,
                                          billing_state: msg.verifiedOrder.billingState,
                                          billing_zip: msg.verifiedOrder.billingZip,
                                          billing_country: msg.verifiedOrder.billingCountry,
                                          products: {
                                            id: msg.verifiedOrder.items[0]?.id || 'prod',
                                            name: msg.verifiedOrder.items.map((it) => it.name).join(', ') || 'Samples Wala Asset',
                                            product_type: msg.verifiedOrder.items[0]?.product_type || 'sample_pack',
                                            price_inr: msg.verifiedOrder.amount,
                                          },
                                        },
                                        msg.verifiedOrder.customerEmail,
                                        msg.verifiedOrder.customerName
                                      )
                                    }}
                                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FFE600] hover:bg-[#fff04d] text-black border-2 border-black font-black text-xs sm:text-sm uppercase italic tracking-wider shadow-[4px_4px_0px_black] hover:shadow-[2px_2px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
                                  >
                                    <FileText size={14} strokeWidth={2.5} />
                                    <span>View &amp; Print Official Tax Invoice</span>
                                  </button>

                                  <Link
                                    href="/library"
                                    className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-[#0074e4] hover:bg-[#1c88ff] text-white border-2 border-black font-black text-xs uppercase italic shadow-[4px_4px_0px_black] hover:shadow-[2px_2px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                  >
                                    <span>All Purchases in Library</span>
                                    <ExternalLink size={12} strokeWidth={2.5} />
                                  </Link>
                                </div>
                              </div>
                            )}

                            {/* Recommended Products Grid */}
                            {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                              <div
                                className={`pt-2 pb-1 ${
                                  msg.recommendedProducts.length === 1
                                    ? 'grid grid-cols-1 sm:grid-cols-2 max-w-sm'
                                    : 'grid grid-cols-2 gap-3 sm:gap-4'
                                }`}
                              >
                                {msg.recommendedProducts.map((prod) => (
                                  <div
                                    key={prod.id}
                                    className="rounded-2xl bg-[#0e121a] border-3 border-black p-3.5 sm:p-4 transition-all duration-200 shadow-[5px_5px_0px_#0074e4] hover:shadow-[5px_5px_0px_#00FF94] hover:-translate-y-0.5 group flex flex-col justify-between relative overflow-hidden"
                                  >
                                    <div>
                                      <Link
                                        href={prod.product_type === 'preset' ? `/browse/presets/${prod.slug}` : `/packs/${prod.slug}`}
                                        className="aspect-square w-full rounded-xl overflow-hidden relative bg-[#07090e] border-2 border-black shadow-[3px_3px_0px_black] group-hover:border-[#00FF94] transition-colors block mb-3"
                                      >
                                        <Image
                                          src={prod.cover_image || 'https://imagizer.imageshack.com/img924/3747/53oszD.png'}
                                          alt={prod.name}
                                          fill
                                          sizes="(max-width: 640px) 50vw, 240px"
                                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                      </Link>

                                      <div className="space-y-1.5">
                                        <Link href={prod.product_type === 'preset' ? `/browse/presets/${prod.slug}` : `/packs/${prod.slug}`} className="block">
                                          <h4 className="text-xs sm:text-sm font-black uppercase italic tracking-tight text-white group-hover:text-[#FFE600] transition-colors line-clamp-1 leading-snug">
                                            {prod.name}
                                          </h4>
                                        </Link>

                                        <div className="flex items-baseline gap-1.5 flex-wrap">
                                          <span className={`inline-block border-2 border-black font-black text-xs sm:text-sm px-2.5 py-0.5 rounded shadow-[2px_2px_0px_black] ${prod.price_inr === 0 ? 'bg-[#FFE600] text-black' : 'bg-[#00FF94] text-black'}`}>
                                            {prod.price_inr === 0 ? 'FREE' : `₹${prod.price_inr}`}
                                          </span>
                                        </div>

                                        <p className="text-[11px] sm:text-xs text-zinc-400 line-clamp-2 leading-tight pt-0.5 font-medium">
                                          {prod.short_description ||
                                            'High-fidelity, professionally recorded sounds crafted specifically for music producers.'}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="pt-3 mt-auto">
                                      <Link
                                        href={prod.product_type === 'preset' ? `/browse/presets/${prod.slug}` : `/packs/${prod.slug}`}
                                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0074e4] hover:bg-[#1c88ff] text-white border-2 border-black font-black uppercase italic text-[11px] sm:text-xs shadow-[3px_3px_0px_black] hover:shadow-[2px_2px_0px_black] hover:translate-x-[1px] hover:translate-y-[1px] transition-all text-center"
                                      >
                                        <span>{prod.product_type === 'preset' ? 'View Preset' : 'View Sound Pack'}</span>
                                        <ArrowRight size={13} strokeWidth={2.5} />
                                      </Link>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Local Knowledge Article Fallback */}
                            {msg.article && !msg.content && (
                              <div className="space-y-3.5">
                                <p className="font-semibold text-white">
                                  To {msg.article.question.toLowerCase().replace('how do i ', '').replace('how to ', '')}:
                                </p>

                                <ol className="space-y-2 list-decimal list-inside text-zinc-300 text-xs sm:text-[13px] leading-relaxed">
                                  {msg.article.detailedSteps.map((step, sIdx) => (
                                    <li key={sIdx} className="pl-1">
                                      <span className="text-zinc-200">{step}</span>
                                    </li>
                                  ))}
                                </ol>

                                <p className="text-xs text-zinc-400 pt-1">
                                  Are you downloading on Windows or Mac, or need DAW setup help (FL Studio, Ableton, Logic)?
                                </p>
                              </div>
                            )}

                            {/* Answer Sources Dropdown */}
                            {!msg.isGreeting && !msg.isWarning && (
                              <div className="pt-2">
                                <button
                                  onClick={() => toggleSources(msg.id)}
                                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#141824] hover:bg-[#1a2030] border-2 border-black text-xs text-white font-black uppercase italic shadow-[3px_3px_0px_black] transition-all cursor-pointer"
                                >
                                  <span>Answer sources</span>
                                  {msg.isSourcesOpen ? <ChevronUp size={15} strokeWidth={2.5} className="text-[#FFE600]" /> : <ChevronDown size={15} strokeWidth={2.5} className="text-[#FFE600]" />}
                                </button>

                                {msg.isSourcesOpen && (
                                  <div className="mt-2.5 p-3.5 rounded-xl bg-[#0b0d13] border-2 border-black space-y-2.5 text-xs shadow-[4px_4px_0px_black] animate-in fade-in">
                                    {getAnswerSources(msg).map((source, sIdx) => (
                                      <div key={sIdx} className="flex items-center justify-between text-zinc-300 gap-3 border-b border-white/5 pb-1.5 last:border-0 last:pb-0">
                                        <span className="truncate text-zinc-300 font-medium">{source.title}</span>
                                        <Link
                                          href={source.href}
                                          className="inline-flex items-center gap-1 text-[#00FF94] hover:text-[#FFE600] font-black uppercase text-[11px] shrink-0 transition-colors"
                                        >
                                          <span>{source.label}</span>
                                          <ExternalLink size={12} strokeWidth={2.5} />
                                        </Link>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                      </div>

                      {/* Feedback Dialog Box - Only displayed when AI intelligence provided an actual troubleshooting solution */}
                      {isLatestAssistant && !msg.ticketNumber && !msg.isGreeting && !msg.isThinking && !msg.isWarning && !isChatEnded && policyStrikes < 4 && Boolean(msg.hasTroubleshootingSolution) && (
                        <div className="flex flex-col items-start space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300 w-full max-w-4xl pt-2">
                          <div className="flex items-center gap-2.5 text-xs sm:text-[13px] text-zinc-400 px-1">
                            <Image
                              src="/images/sampi-avatar.png"
                              alt="Sampi"
                              width={24}
                              height={24}
                              className="w-6 h-6 object-contain shrink-0"
                            />
                            <span className="font-black text-zinc-200 text-xs sm:text-[13px] uppercase italic">
                              Sampi
                            </span>
                            <span className="text-[11px] sm:text-xs text-zinc-500">{msg.timestamp}</span>
                          </div>

                          <div className="w-full bg-[#0e1118] border-3 border-black text-white rounded-2xl p-5 sm:p-6 shadow-[6px_6px_0px_#FFE600] space-y-3">
                            {!msg.feedback ? (
                              <div className="flex items-center justify-between gap-4 flex-wrap">
                                <span className="text-xs sm:text-sm font-black uppercase italic tracking-tight text-white">
                                  Did this solve your problem?
                                </span>
                                <div className="flex items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() => handleFeedback(msg.id, true)}
                                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border-2 border-black font-black text-xs uppercase italic transition-all cursor-pointer bg-[#00FF94] text-black shadow-[3px_3px_0px_black] hover:shadow-[1px_1px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px]"
                                  >
                                    <ThumbsUp size={14} strokeWidth={2.5} />
                                    <span>Yes</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleFeedback(msg.id, false)}
                                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border-2 border-black font-black text-xs uppercase italic transition-all cursor-pointer bg-[#FF5C00] text-white shadow-[3px_3px_0px_black] hover:shadow-[1px_1px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px]"
                                  >
                                    <ThumbsDown size={14} strokeWidth={2.5} />
                                    <span>No</span>
                                  </button>
                                </div>
                              </div>
                            ) : msg.feedback === 'yes' ? (
                              <div className="space-y-1.5 animate-in fade-in">
                                <p className="text-xs sm:text-sm text-[#00FF94] flex items-center gap-2 font-black uppercase italic">
                                  <CheckCircle2 size={16} strokeWidth={2.5} />
                                  <span>Glad that helped!</span>
                                </p>
                                <p className="text-xs text-zinc-500 font-bold select-none">
                                  Chat ended.
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-1.5 animate-in fade-in">
                                <p className="text-xs sm:text-sm text-[#FFE600] font-black uppercase italic flex items-center gap-2">
                                  <span>We&apos;re sorry this didn&apos;t resolve your issue.</span>
                                </p>
                                <p className="text-xs text-zinc-300 font-medium">
                                  Please submit a support ticket below to connect directly with our senior audio engineering desk.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Live Audio Engineering Desk Card */}
                      {msg.showLiveChatDesk && (
                        <div className="flex flex-col items-start space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300 w-full max-w-4xl pt-2">
                          <div className="flex items-center gap-2.5 text-xs sm:text-[13px] text-zinc-400 px-1">
                            <Image
                              src="/images/sampi-avatar.png"
                              alt="Sampi"
                              width={24}
                              height={24}
                              className="w-6 h-6 object-contain shrink-0"
                            />
                            <span className="font-black text-zinc-200 text-xs sm:text-[13px] uppercase italic">
                              Sampi
                            </span>
                            <span className="text-[11px] sm:text-xs text-zinc-500">{msg.timestamp}</span>
                          </div>

                          <div className="w-full bg-[#0e1118] border-3 border-black text-white rounded-2xl p-5 sm:p-6 shadow-[5px_5px_0px_#FFE600] space-y-3.5">
                            <div className="flex items-center justify-between flex-wrap gap-2.5 border-b border-white/10 pb-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-[#FFE600] text-black border-2 border-black flex items-center justify-center font-bold shadow-[2px_2px_0px_black]">
                                  <Headphones size={16} strokeWidth={2.5} />
                                </div>
                                <div>
                                  <h4 className="text-xs sm:text-sm font-black uppercase italic text-white flex items-center gap-2">
                                    Samples Wala Live Audio Desk
                                  </h4>
                                  <p className="text-[10px] sm:text-[11px] text-zinc-400 font-medium">
                                    Live Desk Operating Hours: Mon–Sat, 10:00 AM – 7:00 PM IST
                                  </p>
                                </div>
                              </div>

                              {msg.liveChatStatus === 'checking' ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE600]/20 text-[#FFE600] border border-[#FFE600]/40 text-[11px] font-bold">
                                  <Loader2 size={12} className="animate-spin" />
                                  Connecting to Live Desk...
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[11px] font-bold">
                                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                  Live Chat Currently Offline
                                </span>
                              )}
                            </div>

                            {msg.liveChatStatus === 'checking' ? (
                              <div className="py-2.5 flex items-center gap-3 text-zinc-300 text-xs sm:text-[13px] font-medium">
                                <Loader2 size={16} className="animate-spin text-[#FFE600]" />
                                <span>Pinging senior studio audio engineers on the live desk...</span>
                              </div>
                            ) : (
                              <div className="p-3.5 bg-black/40 rounded-xl border border-white/10 space-y-1.5">
                                <p className="text-xs sm:text-[13px] text-zinc-200 font-medium leading-relaxed">
                                  All live audio engineers are currently occupied in active studio recording/mixing sessions or outside live desk hours.
                                </p>
                                <p className="text-[11px] sm:text-xs text-[#FFE600] font-bold">
                                  Please raise a support ticket below — your query, details, and order info will be delivered directly to <span className="underline">support@sampleswala.com</span>.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Raise Ticket Box */}
                      {msg.needsTicket && !msg.ticketNumber && msg.feedback !== 'yes' && !msg.isThinking && !msg.isWarning && !isChatEnded && policyStrikes < 4 && (
                        <div className="flex flex-col items-start space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300 w-full max-w-4xl pt-2">
                          <div className="flex items-center gap-2.5 text-xs sm:text-[13px] text-zinc-400 px-1">
                            <Image
                              src="/images/sampi-avatar.png"
                              alt="Sampi"
                              width={24}
                              height={24}
                              className="w-6 h-6 object-contain shrink-0"
                            />
                            <span className="font-black text-zinc-200 text-xs sm:text-[13px] uppercase italic">
                              Sampi
                            </span>
                            <span className="text-[11px] sm:text-xs text-zinc-500">{msg.timestamp}</span>
                          </div>

                          <div className="w-full bg-[#0e1118] border-3 border-black text-white rounded-2xl p-6 sm:p-7 shadow-[6px_6px_0px_#FF5C00] space-y-5">
                            {/* Header */}
                            <div className="border-b border-white/10 pb-3 flex items-center justify-between flex-wrap gap-2">
                              <div>
                                <h3 className="text-xs sm:text-sm font-black uppercase italic tracking-tight text-white flex items-center gap-2">
                                  <FileText size={16} className="text-[#FF5C00]" />
                                  <span>Raise Official Support Ticket</span>
                                </h3>
                                <p className="text-[10px] sm:text-[11px] text-zinc-400 font-medium mt-0.5">
                                  Directly dispatched to <strong className="text-white">support@sampleswala.com</strong> & audio engineering desk
                                </p>
                              </div>
                              {user?.email && (
                                <span className="text-[11px] text-black bg-[#FFE600] border-2 border-black px-2.5 py-0.5 rounded-lg font-mono font-bold shadow-[2px_2px_0px_black]">
                                  {user.email}
                                </span>
                              )}
                            </div>

                            {/* Error Message */}
                            {ticketError && (
                              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-300 font-bold flex items-center gap-2">
                                <AlertTriangle size={14} className="shrink-0 text-rose-400" />
                                <span>{ticketError}</span>
                              </div>
                            )}

                            {/* Category Selector */}
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                                Issue Category *
                              </label>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {TICKET_CATEGORIES.map((cat) => {
                                  const Icon = cat.icon
                                  const isSelected = ticketCategory === cat.id
                                  return (
                                    <button
                                      key={cat.id}
                                      type="button"
                                      onClick={() => setTicketCategory(cat.id)}
                                      className={`p-2.5 rounded-xl border-2 border-black text-left flex items-center gap-2 transition-all cursor-pointer shadow-[2px_2px_0px_black] text-xs font-bold ${
                                        isSelected
                                          ? 'bg-[#FFE600] text-black border-black'
                                          : 'bg-[#141824] hover:bg-[#1c2234] text-zinc-300 hover:text-white'
                                      }`}
                                    >
                                      <Icon size={14} className={isSelected ? 'text-black' : 'text-zinc-400'} />
                                      <span className="truncate">{cat.label}</span>
                                    </button>
                                  )
                                })}
                              </div>
                            </div>

                            {/* Name & Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                                  Your Name
                                </label>
                                <input
                                  type="text"
                                  value={ticketName}
                                  onChange={(e) => setTicketName(e.target.value)}
                                  placeholder="e.g. Producer Name"
                                  className="w-full bg-[#141824] border-2 border-black focus:border-[#FFE600] rounded-xl px-4 py-2.5 text-xs sm:text-[13px] text-white font-bold placeholder-zinc-500 focus:outline-none shadow-[3px_3px_0px_black] transition-all"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                                  Email Address *
                                </label>
                                <input
                                  type="email"
                                  required
                                  value={ticketEmail}
                                  onChange={(e) => setTicketEmail(e.target.value)}
                                  placeholder="producer@example.com"
                                  className="w-full bg-[#141824] border-2 border-black focus:border-[#FFE600] rounded-xl px-4 py-2.5 text-xs sm:text-[13px] text-white font-bold placeholder-zinc-500 focus:outline-none shadow-[3px_3px_0px_black] transition-all"
                                />
                              </div>
                            </div>

                            {/* Subject & Order ID */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                                  Subject / Issue Question *
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={ticketSubject}
                                  onChange={(e) => setTicketSubject(e.target.value)}
                                  placeholder="What do you need help with?"
                                  className="w-full bg-[#141824] border-2 border-black focus:border-[#FFE600] rounded-xl px-4 py-2.5 text-xs sm:text-[13px] text-white font-bold placeholder-zinc-500 focus:outline-none shadow-[3px_3px_0px_black] transition-all"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                                  Order ID / Payment ID (Optional)
                                </label>
                                <input
                                  type="text"
                                  value={ticketOrderId}
                                  onChange={(e) => setTicketOrderId(e.target.value)}
                                  placeholder="e.g. SW-ORD-... or pay_..."
                                  className="w-full bg-[#141824] border-2 border-black focus:border-[#FFE600] rounded-xl px-4 py-2.5 text-xs sm:text-[13px] text-white font-bold placeholder-zinc-500 focus:outline-none shadow-[3px_3px_0px_black] transition-all"
                                />
                              </div>
                            </div>

                            {/* DAW & Priority */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                                  DAW / Setup (Optional)
                                </label>
                                <select
                                  value={ticketDaw}
                                  onChange={(e) => setTicketDaw(e.target.value)}
                                  className="w-full bg-[#141824] border-2 border-black focus:border-[#FFE600] rounded-xl px-4 py-2.5 text-xs sm:text-[13px] text-white font-bold focus:outline-none shadow-[3px_3px_0px_black] transition-all"
                                >
                                  <option value="">Select DAW (Optional)</option>
                                  <option value="FL Studio">FL Studio</option>
                                  <option value="Ableton Live">Ableton Live</option>
                                  <option value="Logic Pro">Logic Pro</option>
                                  <option value="Cubase">Cubase</option>
                                  <option value="Studio One">Studio One</option>
                                  <option value="Pro Tools">Pro Tools</option>
                                  <option value="Reaper">Reaper</option>
                                  <option value="Other">Other DAW</option>
                                </select>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                                  Priority Level
                                </label>
                                <select
                                  value={ticketPriority}
                                  onChange={(e) => setTicketPriority(e.target.value)}
                                  className="w-full bg-[#141824] border-2 border-black focus:border-[#FFE600] rounded-xl px-4 py-2.5 text-xs sm:text-[13px] text-white font-bold focus:outline-none shadow-[3px_3px_0px_black] transition-all"
                                >
                                  {TICKET_PRIORITIES.map((p) => (
                                    <option key={p.id} value={p.id}>
                                      {p.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Detailed Description */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                                Problem Description / Extra Details *
                              </label>
                              <textarea
                                rows={3}
                                required
                                value={ticketDescription}
                                onChange={(e) => setTicketDescription(e.target.value)}
                                placeholder="Describe your question, error message, or what went wrong in detail..."
                                className="w-full bg-[#141824] border-2 border-black focus:border-[#FFE600] rounded-xl px-4 py-2.5 text-xs sm:text-[13px] text-white font-bold placeholder-zinc-500 focus:outline-none shadow-[3px_3px_0px_black] transition-all resize-y"
                              />
                            </div>

                            {/* Dispatch Notice & Submit Button */}
                            <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
                              <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-medium">
                                <Mail size={13} className="text-[#FFE600]" />
                                <span>Sent directly to <strong className="text-zinc-200">support@sampleswala.com</strong></span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleCreateTicket(msg.id, msg.userQuery)}
                                disabled={isSubmittingTicket}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF5C00] hover:bg-[#ff7524] disabled:opacity-50 text-white border-2 border-black font-black text-xs uppercase italic tracking-wider shadow-[4px_4px_0px_black] hover:shadow-[2px_2px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
                              >
                                {isSubmittingTicket ? (
                                  <>
                                    <Loader2 size={14} className="animate-spin" />
                                    <span>Dispatching to support@sampleswala.com...</span>
                                  </>
                                ) : (
                                  <>
                                    <Send size={14} strokeWidth={2.5} />
                                    <span>Submit Ticket to support@sampleswala.com</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Ticket Confirmation Box */}
                      {msg.ticketNumber && (
                        <div className="flex flex-col items-start space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300 w-full max-w-4xl pt-2">
                          <div className="flex items-center gap-2.5 text-xs sm:text-[13px] text-zinc-400 px-1">
                            <Image
                              src="/images/sampi-avatar.png"
                              alt="Sampi"
                              width={24}
                              height={24}
                              className="w-6 h-6 object-contain shrink-0"
                            />
                            <span className="font-black text-zinc-200 text-xs sm:text-[13px] uppercase italic">
                              Sampi
                            </span>
                            <span className="text-[11px] sm:text-xs text-zinc-500">{msg.timestamp}</span>
                          </div>

                          <div className="w-full bg-[#0e1118] border-3 border-black text-white rounded-2xl p-6 sm:p-7 shadow-[6px_6px_0px_#00FF94] space-y-3">
                            <p className="font-black uppercase italic text-white text-base sm:text-lg flex items-center gap-2.5">
                              <CheckCircle2 size={20} strokeWidth={2.5} className="text-[#00FF94] shrink-0" />
                              <span>Ticket #{msg.ticketNumber} Dispatched!</span>
                            </p>
                            <p className="text-zinc-200 text-sm sm:text-[14.5px] leading-relaxed font-medium">
                              Your ticket and complete chat transcript have been dispatched directly to <strong className="text-white underline">support@sampleswala.com</strong>. Our senior audio engineering desk will review your inquiry and get back to you via email.
                            </p>
                            <div className="pt-1 flex items-center gap-2 flex-wrap">
                              <span className="text-xs text-black font-mono font-black bg-[#FFE600] px-3.5 py-1.5 rounded-lg border-2 border-black shadow-[3px_3px_0px_black]">
                                Ref: #{msg.ticketNumber}
                              </span>
                              <span className="text-xs text-[#00FF94] bg-[#00FF94]/15 px-3 py-1.5 rounded-lg border border-[#00FF94]/40 font-bold">
                                Email Dispatched to support@sampleswala.com
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  )
                })
              })()}

              <div ref={messagesEndRef} />
            </main>
          </div>

          {/* Sticky Bottom Bar */}
          <div className="flex-shrink-0 w-full bg-[#07080a] z-20 relative border-t border-white/[0.04]">
            <div 
              className="absolute -top-6 left-0 right-0 h-6 pointer-events-none"
              style={{
                background: 'linear-gradient(to top, #07080a 0%, rgba(7, 8, 10, 0.7) 50%, transparent 100%)',
              }}
            />

            <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 lg:px-10 pb-5 sm:pb-6 pt-3">
              {isChatEnded || policyStrikes >= 4 || strikesRef.current >= 4 || messages.some((m) => !!m.ticketNumber || m.feedback === 'yes') ? (
                <div className="w-full flex flex-col items-center gap-2.5 animate-in fade-in zoom-in-95 duration-200">
                  <p className="text-xs text-zinc-500 font-bold select-none tracking-wide">
                    Chat ended.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetToHero}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-[#FFE600] hover:bg-[#fff04d] text-black border-2 border-black font-black uppercase italic text-sm sm:text-[15px] transition-all duration-200 shadow-[4px_4px_0px_black] hover:shadow-[2px_2px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer"
                  >
                    <RotateCcw size={16} strokeWidth={2.5} />
                    <span>Return to Main Support Page</span>
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleChatSubmit}
                  className="flex items-center gap-2.5 sm:gap-3 w-full"
                >
                  {/* Options Menu Button with End Chat Popover */}
                  <div className="relative" ref={optionsMenuRef}>
                    {isOptionsMenuOpen && (
                      <div className="absolute bottom-full mb-3 left-0 z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-1.5 min-w-[210px]">
                        <button
                          type="button"
                          onClick={() => {
                            triggerLiveChatDesk()
                          }}
                          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#141824] hover:bg-[#1e2538] border-2 border-black text-xs font-black uppercase italic text-zinc-200 hover:text-white shadow-[4px_4px_0px_black] transition-all cursor-pointer whitespace-nowrap"
                        >
                          <Headphones size={14} className="text-[#FFE600]" />
                          <span>Live Chat / Raise Ticket</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleResetToHero()
                          }}
                          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#141824] hover:bg-[#1e2538] border-2 border-black text-xs font-black uppercase italic text-zinc-200 hover:text-white shadow-[4px_4px_0px_black] transition-all cursor-pointer whitespace-nowrap"
                        >
                          <Ban size={14} className="text-[#FF5C00]" />
                          <span>End chat</span>
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setIsOptionsMenuOpen((prev) => !prev)}
                      title="Options"
                      aria-label="Chat options"
                      className={`w-11 h-11 rounded-xl border-2 border-black flex items-center justify-center transition-all cursor-pointer flex-shrink-0 shadow-[3px_3px_0px_black] active:translate-x-[1px] active:translate-y-[1px] ${
                        isOptionsMenuOpen
                          ? 'bg-[#FFE600] text-black'
                          : 'bg-[#14161d] hover:bg-[#1a202c] text-zinc-300 hover:text-white'
                      }`}
                    >
                      <MoreVertical size={18} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Input Box */}
                  <input
                    ref={chatInputRef}
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={
                      isChatEnded || policyStrikes >= 4 || strikesRef.current >= 4
                        ? 'Chat ended.'
                        : isTyping || messages.some((m) => m.isThinking)
                        ? 'Sampi is thinking...'
                        : 'Write a message to Sampi...'
                    }
                    disabled={isTyping || isChatEnded || policyStrikes >= 4 || strikesRef.current >= 4 || messages.some((m) => m.isThinking)}
                    className="flex-1 bg-[#0d1017] hover:bg-[#111520] focus:bg-[#111520] border-2 border-black focus:border-[#FFE600] rounded-xl px-5 py-3 text-sm sm:text-[14.5px] text-white font-medium placeholder-zinc-500 focus:outline-none transition-all shadow-[3px_3px_0px_black] disabled:opacity-50 disabled:cursor-not-allowed"
                  />

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isTyping || isChatEnded || policyStrikes >= 4 || strikesRef.current >= 4 || messages.some((m) => m.isThinking)}
                    aria-label="Send message"
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all flex-shrink-0 border-2 border-black ${
                      chatInput.trim().length > 0 && !isTyping && !isChatEnded && policyStrikes < 4 && strikesRef.current < 4 && !messages.some((m) => m.isThinking)
                        ? 'bg-[#00FF94] hover:bg-[#19ff9e] text-black shadow-[3px_3px_0px_black] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer'
                        : 'bg-white/[0.06] text-white/20 border-black/40 cursor-not-allowed pointer-events-none'
                    }`}
                  >
                    <ArrowRight size={18} strokeWidth={2.5} />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      )}
    </>
  )
}

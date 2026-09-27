export interface KnowledgeArticle {
  id: string
  category: 'free_and_licensing' | 'daw_setup' | 'downloads' | 'billing_invoices' | 'refunds' | 'account'
  categoryLabel: string
  question: string
  shortAnswer: string
  detailedSteps: string[]
  tags: string[]
  actionCta?: {
    label: string
    href: string
    isExternal?: boolean
  }
}

export const KNOWLEDGE_CATEGORIES = [
  { id: 'all', label: 'All Topics' },
  { id: 'free_and_licensing', label: 'Free & Royalties' },
  { id: 'downloads', label: 'Downloads & Vault' },
  { id: 'daw_setup', label: 'DAW Troubleshooting' },
  { id: 'billing_invoices', label: 'Orders & Payments' },
  { id: 'refunds', label: 'Refund Policy' },
  { id: 'account', label: 'Account & Security' },
] as const

export const KNOWLEDGE_BASE: KnowledgeArticle[] = [
  // 1. FREE PRODUCTS & ROYALTIES
  {
    id: 'free-1',
    category: 'free_and_licensing',
    categoryLabel: 'Free & Royalties',
    question: 'Are there any free sample packs currently available on Samples Wala?',
    shortAnswer: 'Yes! Samples Wala offers free sample packs and demo sound kits at /free. You can download and start producing immediately without paying anything.',
    detailedSteps: [
      'Navigate to the Free section at /free on Samples Wala.',
      'Browse through 100% free sound packs, drums, one-shots, and melodic loops.',
      'Click Download to save the studio WAV files directly to your device.',
      'All free collections also include full commercial clearance for your music production.',
    ],
    tags: ['are they free', 'free', 'free plugins', 'free samples', 'free packs', 'cost', 'price', 'pricing', 'charge', 'money', 'free download', 'zero cost', 'free music production tools'],
    actionCta: {
      label: 'Browse Free Packs',
      href: '/free',
    },
  },
  {
    id: 'free-2',
    category: 'free_and_licensing',
    categoryLabel: 'Free & Royalties',
    question: 'Are sample packs and presets 100% royalty-free for commercial music releases?',
    shortAnswer: 'Yes, 100% royalty-free. You can use every sound, drum loop, and preset in commercial tracks released on Spotify, Apple Music, YouTube, TV, and radio without paying additional royalties.',
    detailedSteps: [
      'Every sample pack and preset collection sold or offered on Samples Wala comes with an unlimited commercial license.',
      'You are legally cleared to monetize your music on streaming platforms, sell beats to artists, and use audio in sync/film licensing.',
      'The only restriction: You cannot re-distribute or re-sell the raw audio samples or preset files as your own standalone sound library.',
    ],
    tags: ['royalty free', 'commercial use', 'spotify', 'monetize', 'sell beats', 'youtube copyright', 'sync licensing', 'commercial rights', 'credits', 'copyright strike'],
    actionCta: {
      label: 'Read Full Terms',
      href: '/terms',
    },
  },
  {
    id: 'free-3',
    category: 'free_and_licensing',
    categoryLabel: 'Free & Royalties',
    question: 'Do I need to give credit or tag Samples Wala when I release a track?',
    shortAnswer: 'No, crediting Samples Wala is completely optional. You own 100% of your master recording and publishing rights.',
    detailedSteps: [
      'You do not need to list Samples Wala in your song titles, credits, or liner notes.',
      'Your music productions are completely your own intellectual property.',
      'If you love our sounds, shouting us out on social media (@sampleswala) is always appreciated, but never legally required!',
    ],
    tags: ['credit', 'tag', 'attribution', 'copyright', 'publishing rights', 'master rights', 'ownership'],
  },

  // 2. DOWNLOADS & LIBRARY VAULT
  {
    id: 'down-1',
    category: 'downloads',
    categoryLabel: 'Downloads & Vault',
    question: 'Where do I find my purchased sample packs?',
    shortAnswer: 'All your purchased sample packs and presets are permanently available in your personal Library at /library.',
    detailedSteps: [
      'Log into your account at sampleswala.com using the email you provided at checkout.',
      'Click on "Library" in the navigation bar or go directly to /library.',
      'All your sample packs and presets will be listed with high-speed download buttons.',
      'You have lifetime access to re-download your files whenever you need.',
    ],
    tags: ['where is my download', 'my library', 'access files', 'find purchase', 'purchased items', 'download link', 'vault', 'lost download', 'redownload'],
    actionCta: {
      label: 'Open My Library',
      href: '/library',
    },
  },
  {
    id: 'down-2',
    category: 'downloads',
    categoryLabel: 'Downloads & Vault',
    question: 'Download stopped midway or ZIP archive says "Corrupt"?',
    shortAnswer: 'Large audio packs (1GB-5GB) can get interrupted on unstable mobile connections. Download over stable Wi-Fi or Chrome, or re-generate a fresh link from your Library.',
    detailedSteps: [
      'Ensure you have adequate storage space on your hard drive before downloading.',
      'Avoid mobile data spotty hotspots; use a stable Wi-Fi or wired connection.',
      'Use modern extraction tools like 7-Zip (Windows) or The Unarchiver (Mac) instead of default tools if extracting fails.',
      'Go to /library and click the download button again to generate a fresh, high-speed download mirror.',
    ],
    tags: ['corrupt', 'zip broken', 'failed download', 'slow download', 'network error', 'extraction error', '7zip', 'archive'],
    actionCta: {
      label: 'Go to Library',
      href: '/library',
    },
  },
  {
    id: 'down-3',
    category: 'downloads',
    categoryLabel: 'Downloads & Vault',
    question: 'Do download links expire?',
    shortAnswer: 'Individual temporary download tokens expire after a few minutes for anti-piracy security, but your lifetime access in /library never expires.',
    detailedSteps: [
      'Temporary download URLs expire to protect our creators from unauthorized link sharing.',
      'Whenever you want to download, simply visit /library and click "Download".',
      'A fresh, secure link will be generated instantly for your account.',
    ],
    tags: ['link expired', 'expiration', 'token expired', 'download again', 'how long access'],
  },

  // 3. DAW SETUP & COMPATIBILITY
  {
    id: 'daw-1',
    category: 'daw_setup',
    categoryLabel: 'DAW Troubleshooting',
    question: 'How do I add Samples Wala sounds into FL Studio?',
    shortAnswer: 'You can directly drag-and-drop WAV samples from Windows Explorer into FL Studio, or add the folder to your FL Studio Browser.',
    detailedSteps: [
      'Unzip the downloaded sample pack to a permanent folder on your computer (e.g., D:\\Music Production\\Samples).',
      'In FL Studio, go to Options > File Settings.',
      'In the "Browser Extra Search Folders" section, click an empty folder icon and select your Samples Wala folder.',
      'Your sound pack will now appear in the FL Studio Browser on the left side, ready to drag into the Channel Rack or Playlist.',
    ],
    tags: ['fl studio', 'fl studio setup', 'fruity loops', 'drag and drop', 'browser', 'add samples to fl', 'fl studio folder'],
  },
  {
    id: 'daw-2',
    category: 'daw_setup',
    categoryLabel: 'DAW Troubleshooting',
    question: 'How do I import samples into Ableton Live?',
    shortAnswer: 'In Ableton Live, open the Browser on the left, scroll to "Places", and click "Add Folder..." to select your unzipped sound folder.',
    detailedSteps: [
      'Extract your downloaded ZIP pack to your designated music sample drive.',
      'Open Ableton Live and look at the Browser pane on the left.',
      'Under "Places", click "Add Folder...".',
      'Select your unzipped Samples Wala pack folder. Ableton will index the sounds with instant tempo-matched previews.',
    ],
    tags: ['ableton', 'ableton live', 'add folder', 'places', 'browser', 'warp', 'import ableton'],
  },
  {
    id: 'daw-3',
    category: 'daw_setup',
    categoryLabel: 'DAW Troubleshooting',
    question: 'Are the WAV files compatible with Logic Pro, Cubase, and Studio One?',
    shortAnswer: 'Yes! All audio files are exported as uncompressed 24-bit 44.1kHz / 48kHz WAV files, the industry standard accepted by every DAW in existence.',
    detailedSteps: [
      'WAV is the universally compatible standard for digital audio production.',
      'Logic Pro: Drag files into the Tracks Area or Project Audio tab.',
      'Cubase & Studio One: Drag directly onto an audio track from your file explorer.',
      'Hardware samplers (MPC, Octatrack, SP-404 MK2) read the WAV files without conversion.',
    ],
    tags: ['logic pro', 'cubase', 'studio one', 'reaper', 'mpc', 'hardware sampler', 'wav compatibility', '24 bit'],
  },

  // 4. BILLING & INVOICES
  {
    id: 'bill-1',
    category: 'billing_invoices',
    categoryLabel: 'Orders & Payments',
    question: 'Payment deducted via UPI / Card but pack not showing?',
    shortAnswer: 'UPI and banking gateways occasionally take 30 to 90 seconds to verify webhooks. Refresh /library or log in with the exact checkout email.',
    detailedSteps: [
      'Wait 60-90 seconds for your banking partner (Razorpay / Cashfree) to send the completion signal.',
      'Visit /library and refresh the page.',
      'Ensure you are logged in with the exact email address you entered during checkout.',
      'If your pack still does not appear after 5 minutes, our AI support assistant or audio team will link it to your account immediately with your Order/Payment ID.',
    ],
    tags: ['payment deducted', 'money cut', 'upi failed', 'pending payment', 'not in library', 'payment issue', 'razorpay error', 'cashfree'],
    actionCta: {
      label: 'Check Library',
      href: '/library',
    },
  },
  {
    id: 'bill-2',
    category: 'billing_invoices',
    categoryLabel: 'Orders & Payments',
    question: 'What payment methods are supported on Samples Wala?',
    shortAnswer: 'We support all major Indian and international payment methods including UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, and PayPal for global users.',
    detailedSteps: [
      'Indian customers: Pay seamlessly with UPI QR, UPI ID, Visa, Mastercard, RuPay, or NetBanking.',
      'International customers: Pay securely with international Credit/Debit cards or PayPal in USD.',
      'All transactions are processed through RBI-authorized, PCI-DSS compliant secure payment gateways.',
    ],
    tags: ['payment methods', 'upi', 'gpay', 'phonepe', 'paytm', 'credit card', 'debit card', 'paypal', 'international payment'],
  },
  {
    id: 'bill-3',
    category: 'billing_invoices',
    categoryLabel: 'Orders & Payments',
    question: 'Where can I download my Tax Invoice or Bill of Supply?',
    shortAnswer: 'Official tax invoices can be viewed and printed directly from /library under the Billing tab, or requested right here in this chat assistant.',
    detailedSteps: [
      'Go to /library on Samples Wala.',
      'Scroll to your purchases or billing section.',
      'Click "Download Invoice" to open an official printable Bill of Supply / Tax Invoice.',
      'Alternatively, ask this Support Assistant for your invoice by mentioning your order or payment ID.',
    ],
    tags: ['invoice', 'bill', 'tax receipt', 'gst invoice', 'bill of supply', 'receipt download'],
    actionCta: {
      label: 'View Invoices in Library',
      href: '/library',
    },
  },

  // 5. REFUND POLICY
  {
    id: 'ref-1',
    category: 'refunds',
    categoryLabel: 'Refund Policy',
    question: 'What is the refund policy on Samples Wala?',
    shortAnswer: 'As per our official Refund Policy, digital downloads (sample packs, preset banks, loops) are irrevocable digital goods and are non-refundable once downloaded.',
    detailedSteps: [
      'Because digital audio files cannot be returned or revoked once downloaded, all completed sales are final for change of mind or personal taste.',
      'We offer playable high-fidelity audio previews, loop stems demos, and track mockups on every pack page so you can listen before purchasing.',
      'If you encounter a defective, corrupt, or unreadable file that our engineering team cannot fix within 48 hours, or an accidental duplicate charge, we will promptly refund or replace your purchase.',
    ],
    tags: ['refund', 'money back', 'return', 'cancel order', 'exchange', 'don\'t like product', 'satisfaction guarantee'],
    actionCta: {
      label: 'Read Full Refund Policy',
      href: '/refund-policy',
    },
  },

  // 6. ACCOUNT & SECURITY
  {
    id: 'acc-1',
    category: 'account',
    categoryLabel: 'Account & Security',
    question: 'How do I log in or reset my password?',
    shortAnswer: 'Go to /auth and enter your email address to receive an instant secure Magic Login Link or sign in with your password.',
    detailedSteps: [
      'Visit /auth on Samples Wala.',
      'Enter your registered email address.',
      'You can sign in with your password or use our passwordless Magic Link sent directly to your inbox.',
      'Check your spam or promotions folder if the email does not appear in your primary inbox within 60 seconds.',
    ],
    tags: ['login', 'signin', 'password reset', 'forgot password', 'magic link', 'cant login', 'account access'],
    actionCta: {
      label: 'Sign In / Register',
      href: '/auth',
    },
  },
]

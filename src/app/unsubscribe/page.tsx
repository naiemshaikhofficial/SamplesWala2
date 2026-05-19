import React from 'react'
import Link from 'next/link'
import { ArrowLeft, MailX, AlertTriangle, CheckCircle } from 'lucide-react'
import { generatePageMetadata } from '@/lib/seo/metadata'

export const metadata = generatePageMetadata({
  title: 'Unsubscribe | Samples Wala',
  description: 'Manage your newsletter subscription preferences.',
  path: '/unsubscribe'
})

interface UnsubscribePageProps {
  searchParams: Promise<{ email?: string }>
}

async function unsubscribeFromBrevo(email: string) {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    console.error('BREVO_API_KEY is not defined in the environment variables of SamplesWala2.')
    throw new Error('Newsletter agent is temporarily offline. Please contact support to unsubscribe.')
  }

  // 1. Check if contact exists
  const checkRes = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey
    }
  })

  if (!checkRes.ok) {
    if (checkRes.status === 404) {
      // Contact doesn't exist, so they are already technically not subscribed / active
      return { alreadyRemoved: true }
    }
    const errData = await checkRes.json().catch(() => ({}))
    throw new Error(errData.message || 'Failed to check subscriber preferences')
  }

  // 2. Blacklist / unsubscribe the contact
  const updateRes = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
    method: 'PUT',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ emailBlacklisted: true })
  })

  if (!updateRes.ok) {
    const errData = await updateRes.json().catch(() => ({}))
    throw new Error(errData.message || 'Failed to update newsletter status in Brevo')
  }

  return { success: true }
}

export default async function UnsubscribePage({ searchParams }: UnsubscribePageProps) {
  const params = await searchParams
  const email = params.email || ''

  let status: 'success' | 'error' | 'no-email' = 'success'
  let message = ''

  if (!email) {
    status = 'no-email'
  } else {
    try {
      await unsubscribeFromBrevo(email)
      message = `The email address ${email} has been unsubscribed from all marketing, sounds drops, and promotion campaigns.`
    } catch (err: any) {
      status = 'error'
      message = err.message || 'Failed to complete unsubscribe request. Please contact support.'
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 py-20 font-sans">
      <div className="w-full max-w-lg border-4 border-black bg-[#121212] p-8 shadow-[6px_6px_0px_#FF0080] text-center">
        
        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-studio-neon/15 border-4 border-black mx-auto flex items-center justify-center mb-6 shadow-[3px_3px_0px_#39FF14]">
              <CheckCircle size={40} className="text-studio-neon animate-pulse" />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic mb-4">
              UNSUBSCRIBED <span className="text-studio-neon">SUCCESSFULLY</span>
            </h1>
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed mb-8">
              {message}
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-studio-red/15 border-4 border-black mx-auto flex items-center justify-center mb-6 shadow-[3px_3px_0px_#FF3131]">
              <AlertTriangle size={40} className="text-studio-red" />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic mb-4">
              BROADCAST <span className="text-studio-red">ERROR</span>
            </h1>
            <p className="text-[11px] font-bold text-studio-red/80 uppercase tracking-widest leading-relaxed mb-8">
              {message}
            </p>
          </>
        )}

        {status === 'no-email' && (
          <>
            <div className="w-20 h-20 bg-studio-yellow/15 border-4 border-black mx-auto flex items-center justify-center mb-6 shadow-[3px_3px_0px_#FFE600]">
              <MailX size={40} className="text-studio-yellow" />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic mb-4">
              MANAGE <span className="text-studio-yellow">PREFERENCES</span>
            </h1>
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed mb-8">
              To unsubscribe from the SamplesWala newsletter directory, please click the unsubscribe link at the bottom of the emails you received.
            </p>
          </>
        )}

        <div className="border-t-2 border-black pt-6 flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full py-3 bg-zinc-800 text-white border-2 border-black font-black uppercase text-[10px] tracking-widest hover:bg-zinc-700 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Storefront
          </Link>
        </div>

      </div>
    </div>
  )
}

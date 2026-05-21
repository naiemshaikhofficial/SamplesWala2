'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MailX, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react'
import { unsubscribeUserAction } from './actions'

interface UnsubscribeClientProps {
  email: string
}

export default function UnsubscribeClient({ email }: UnsubscribeClientProps) {
  const [confirmed, setConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'prompt' | 'success' | 'error' | 'no-email'>(
    email ? 'prompt' : 'no-email'
  )
  const [errorMessage, setErrorMessage] = useState('')

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    if (!confirmed) {
      setErrorMessage('Please confirm you want to unsubscribe by checking the box.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      await unsubscribeUserAction(email)
      setStatus('success')
    } catch (err: any) {
      setStatus('error')
      setErrorMessage(err.message || 'Failed to complete unsubscribe request. Please contact support.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-lg border-4 border-black bg-[#121212] p-8 shadow-[6px_6px_0px_#FF0080] text-center">
      
      {status === 'prompt' && (
        <form onSubmit={handleUnsubscribe}>
          <div className="w-20 h-20 bg-studio-yellow/15 border-4 border-black mx-auto flex items-center justify-center mb-6 shadow-[3px_3px_0px_#FFE600]">
            <ShieldAlert size={40} className="text-studio-yellow" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic mb-2">
            CONFIRM <span className="text-studio-yellow">UNSUBSCRIBE</span>
          </h1>
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed mb-6">
            Are you sure you want to stop receiving free sound drops, premium loops, sample packs, and exclusive sales updates?
          </p>

          <div className="bg-black/50 border border-zinc-800 rounded-lg p-4 mb-6 text-left">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">Target Account</span>
            <span className="text-xs font-mono font-bold text-zinc-200 block truncate">{email}</span>
          </div>

          <label className="flex items-start gap-3 text-left bg-zinc-900/60 border border-zinc-850 p-4 rounded-lg cursor-pointer hover:bg-zinc-900 transition-colors mb-6 select-none">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => {
                setConfirmed(e.target.checked)
                if (e.target.checked) setErrorMessage('')
              }}
              className="accent-studio-yellow w-4 h-4 mt-0.5 flex-shrink-0 cursor-pointer"
            />
            <div>
              <span className="text-[10px] font-black text-white uppercase tracking-wider block">
                Yes, unsubscribe me
              </span>
              <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wide block mt-0.5 leading-tight">
                I understand I will lose access to future release notifications and vault discount promotions.
              </span>
            </div>
          </label>

          {errorMessage && (
            <div className="bg-studio-red/10 border border-studio-red/20 text-studio-red text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg mb-6">
              ⚠️ {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-studio-yellow text-black border-2 border-black font-black uppercase text-[11px] tracking-widest hover:bg-[#E0C000] disabled:opacity-50 transition-colors shadow-[3px_3px_0px_black] active:translate-y-0.5 active:shadow-[1px_1px_0px_black]"
          >
            {isSubmitting ? 'PROCESSING UNSUBSCRIBE...' : 'CONFIRM UNSUBSCRIBE'}
          </button>
        </form>
      )}

      {status === 'success' && (
        <>
          <div className="w-20 h-20 bg-studio-neon/15 border-4 border-black mx-auto flex items-center justify-center mb-6 shadow-[3px_3px_0px_#39FF14]">
            <CheckCircle size={40} className="text-studio-neon animate-pulse" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic mb-4">
            UNSUBSCRIBED <span className="text-studio-neon">SUCCESSFULLY</span>
          </h1>
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed mb-8">
            The email address <strong className="text-zinc-200 lowercase font-mono">{email}</strong> has been unsubscribed from all marketing, sound drops, and promotion campaigns.
          </p>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="w-20 h-20 bg-studio-red/15 border-4 border-black mx-auto flex items-center justify-center mb-6 shadow-[3px_3px_0px_#FF3131]">
            <AlertTriangle size={40} className="text-studio-red" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic mb-4">
            UNSUBSCRIBE <span className="text-studio-red">FAILED</span>
          </h1>
          <p className="text-[11px] font-bold text-studio-red/80 uppercase tracking-widest leading-relaxed mb-8">
            {errorMessage}
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

      <div className="border-t-2 border-black pt-6 mt-6 flex flex-col gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center w-full py-3 bg-zinc-800 text-white border-2 border-black font-black uppercase text-[10px] tracking-widest hover:bg-zinc-700 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Storefront
        </Link>
      </div>

    </div>
  )
}

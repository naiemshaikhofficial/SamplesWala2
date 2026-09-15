'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, AlertTriangle, RefreshCw, Heart } from 'lucide-react'
import BrokenHeartRobot, { RobotState } from '@/components/ui/BrokenHeartRobot'
import { unsubscribeUserAction, resubscribeUserAction } from './actions'

interface UnsubscribeClientProps {
  email: string
}

const REASONS = [
  { id: 'too_frequent', icon: '📬', label: 'Too Many Emails' },
  { id: 'not_relevant', icon: '🎛️', label: 'Not Relevant To My Style' },
  { id: 'too_promotional', icon: '🏷️', label: 'Too Many Promotions' },
  { id: 'check_website', icon: '🌐', label: 'I Check Site Directly' },
  { id: 'break_from_music', icon: '⏸️', label: 'Taking A Music Break' },
  { id: 'other', icon: '✍️', label: 'Other Reason' }
]

export default function UnsubscribeClient({ email: initialEmail }: UnsubscribeClientProps) {
  const [emailInput, setEmailInput] = useState(initialEmail || '')
  const [selectedReason, setSelectedReason] = useState<string>('too_frequent')
  const [feedbackText, setFeedbackText] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResubscribing, setIsResubscribing] = useState(false)
  const [status, setStatus] = useState<'prompt' | 'success' | 'error'>('prompt')
  const [robotState, setRobotState] = useState<RobotState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    const targetEmail = emailInput.trim()
    if (!targetEmail || !targetEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    if (!confirmed) {
      setErrorMessage('Please check the confirmation box to proceed.')
      return
    }

    setIsSubmitting(true)
    setRobotState('unsubscribing')
    setErrorMessage('')

    try {
      const activeReasonLabel = REASONS.find(r => r.id === selectedReason)?.label || selectedReason
      await unsubscribeUserAction(targetEmail, activeReasonLabel, feedbackText)

      // Transition to broken heart robot state
      setRobotState('broken')
      setStatus('success')
    } catch (err: any) {
      setRobotState('idle')
      setStatus('error')
      setErrorMessage(err.message || 'Failed to complete unsubscribe request. Please contact support.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResubscribe = async () => {
    const targetEmail = emailInput.trim()
    if (!targetEmail) return

    setIsResubscribing(true)
    setErrorMessage('')

    try {
      await resubscribeUserAction(targetEmail)
      setRobotState('healed')
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not resubscribe. Please contact support.')
    } finally {
      setIsResubscribing(false)
    }
  }

  return (
    <div className="w-full max-w-lg border-4 border-black bg-[#0d0d0d] p-4 sm:p-6 shadow-[6px_6px_0px_#FFE600] text-center relative font-mono select-none">
      
      {/* Top Neo-Brutalist Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF3131] via-[#00FF94] to-[#FFE600]" />

      {/* Interactive SamplesWala SoundBot Mascot */}
      <div className="mb-2">
        <BrokenHeartRobot
          state={robotState}
          compact={status === 'prompt'}
        />
      </div>

      {/* FORM: Reason & Email Confirmation */}
      {status === 'prompt' && (
        <form onSubmit={handleUnsubscribe} className="text-left mt-2">
          
          <div className="text-center mb-3">
            <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
              MANAGE <span className="text-studio-yellow">PREFERENCES</span>
            </h1>
            <p className="text-[10px] sm:text-[11px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">
              Select a reason to disconnect from newsletter drops
            </p>
          </div>

          {/* Email Address Input */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="unsub-email" className="block text-[9.5px] font-black uppercase tracking-wider text-zinc-300">
                TARGET EMAIL <span className="text-studio-red">*</span>
              </label>
            </div>
            <input
              id="unsub-email"
              type="email"
              required
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value)
                if (errorMessage) setErrorMessage('')
              }}
              placeholder="producer@example.com"
              className="w-full px-3 py-2 bg-black border-2 border-zinc-700 focus:border-studio-yellow text-white font-mono text-xs tracking-wide outline-none transition-colors"
            />
          </div>

          {/* Reason Selection: Compact 2-Column Grid on all screen sizes */}
          <div className="mb-3">
            <span className="block text-[9.5px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
              WHY ARE YOU LEAVING? <span className="text-studio-red">*</span>
            </span>
            
            <div className="grid grid-cols-2 gap-1.5">
              {REASONS.map((r) => {
                const isSelected = selectedReason === r.id
                return (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => setSelectedReason(r.id)}
                    className={`flex items-center gap-1.5 p-2 text-left border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-studio-yellow bg-studio-yellow/15 shadow-[2px_2px_0px_#FFE600]'
                        : 'border-zinc-800 bg-zinc-950/70 hover:border-zinc-700 hover:bg-zinc-900/60'
                    }`}
                  >
                    <span className="text-xs sm:text-sm flex-shrink-0">{r.icon}</span>
                    <span className={`text-[9.5px] sm:text-[10px] font-black uppercase tracking-tight leading-tight truncate ${
                      isSelected ? 'text-studio-yellow' : 'text-zinc-300'
                    }`}>
                      {r.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Optional One-Line Input if 'other' is selected */}
            {selectedReason === 'other' && (
              <input
                type="text"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Optional feedback: How can we improve our sound packs?"
                className="w-full mt-2 px-3 py-1.5 bg-black border-2 border-zinc-700 focus:border-studio-yellow text-zinc-200 font-mono text-[11px] outline-none"
              />
            )}
          </div>

          {/* Checkbox Confirmation */}
          <label className="flex items-center gap-2.5 text-left bg-black/60 border border-zinc-800 p-2.5 mb-3 cursor-pointer select-none hover:border-zinc-700 transition-colors">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => {
                setConfirmed(e.target.checked)
                if (e.target.checked && errorMessage) setErrorMessage('')
              }}
              className="accent-studio-red w-3.5 h-3.5 flex-shrink-0 cursor-pointer"
            />
            <span className="text-[9.5px] font-bold text-zinc-300 uppercase tracking-wide leading-tight">
              Yes, unsubscribe me from free pack drops, stems, and discount alerts
            </span>
          </label>

          {/* Error Banner */}
          {errorMessage && (
            <div className="bg-studio-red/15 border border-studio-red text-studio-red text-[9.5px] font-black uppercase tracking-wider px-2.5 py-1.5 mb-2.5 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 sm:py-3 bg-studio-red hover:bg-[#e02626] text-white border-3 border-black font-black uppercase text-[11px] sm:text-xs tracking-widest transition-all shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000000] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>DISCONNECTING FEEDS...</span>
              </>
            ) : (
              <span>💔 CONFIRM UNSUBSCRIBE</span>
            )}
          </button>

          {/* Return to Storefront Link */}
          <div className="text-center mt-3">
            <Link
              href="/packs"
              className="text-[10px] font-bold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Keep My Subscription & Return To Store</span>
            </Link>
          </div>
        </form>
      )}

      {/* SUCCESS: Unsubscribed (Broken Heart) or Re-subscribed (Healed Heart) */}
      {status === 'success' && (
        <div className="text-center mt-2 animate-fadeIn">
          
          {robotState === 'broken' ? (
            <>
              <div className="inline-block px-2.5 py-0.5 bg-studio-red/20 border border-studio-red text-studio-red font-black text-[9.5px] uppercase tracking-widest mb-2">
                UNSUBSCRIBED SUCCESSFULLY
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-1.5">
                YOU HAVE BEEN <span className="text-studio-red">DISCONNECTED</span>
              </h2>
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider leading-relaxed mb-4 max-w-sm mx-auto">
                <strong className="text-white font-mono lowercase">{emailInput}</strong> has been removed from all marketing newsletters and sound drop alerts.
              </p>

              {/* Instant Re-subscribe Recovery ("Fix My Heart") */}
              <div className="bg-black/80 border-2 border-zinc-800 p-3.5 mb-4 text-center">
                <span className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                  Did you click by accident or change your mind?
                </span>
                <button
                  type="button"
                  onClick={handleResubscribe}
                  disabled={isResubscribing}
                  className="w-full py-2.5 sm:py-3 bg-studio-neon hover:bg-[#00e082] text-black border-2 border-black font-black uppercase text-[11px] tracking-widest transition-all shadow-[3px_3px_0px_#FFE600] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#FFE600] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isResubscribing ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>RESTORING CONNECTION...</span>
                    </>
                  ) : (
                    <>
                      <Heart className="h-3.5 w-3.5 fill-black" />
                      <span>RE-SUBSCRIBE & FIX MY HEART</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="inline-block px-2.5 py-0.5 bg-studio-neon/20 border border-studio-neon text-studio-neon font-black text-[9.5px] uppercase tracking-widest mb-2">
                CONNECTION RESTORED
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-1.5">
                WELCOME BACK TO <span className="text-studio-neon">SAMPLES WALA</span>!
              </h2>
              <p className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider leading-relaxed mb-4 max-w-sm mx-auto">
                Heart repaired! <strong className="text-studio-neon font-mono lowercase">{emailInput}</strong> is re-subscribed and ready for upcoming free Indian sound drops.
              </p>
            </>
          )}

          <div className="pt-2">
            <Link
              href="/packs"
              className="inline-flex items-center justify-center py-2 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-2 border-black font-black uppercase text-[10px] tracking-widest transition-colors"
            >
              <ArrowLeft className="mr-1.5 h-3 w-3" />
              Browse Sample Packs Catalog
            </Link>
          </div>

        </div>
      )}

      {/* ERROR STATE */}
      {status === 'error' && (
        <div className="text-center mt-3">
          <div className="inline-block px-2.5 py-0.5 bg-studio-red/20 border border-studio-red text-studio-red font-black text-[9.5px] uppercase tracking-widest mb-2">
            UNSUBSCRIBE FAILED
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">
            SOMETHING WENT <span className="text-studio-red">WRONG</span>
          </h2>
          <p className="text-xs font-bold text-studio-red uppercase tracking-wider mb-4">
            {errorMessage}
          </p>
          <button
            type="button"
            onClick={() => setStatus('prompt')}
            className="px-5 py-2.5 bg-studio-yellow text-black border-2 border-black font-black uppercase text-[11px] tracking-wider shadow-[2px_2px_0px_black] cursor-pointer"
          >
            TRY AGAIN
          </button>
        </div>
      )}

    </div>
  )
}

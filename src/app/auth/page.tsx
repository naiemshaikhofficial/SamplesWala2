'use client'
import React, { useState, Suspense } from 'react'
import { Shield, Loader2, ArrowRight, Mail, Lock, Chrome, User, Check, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { Turnstile } from '@marsidev/react-turnstile'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { signIn, signUp, signInWithGoogle, forgotPassword } from './actions'

import { AnimatedLogo } from '@/components/AnimatedLogo'
import { AuthForm } from '@/components/auth/AuthForm'

function AuthPageContent() {
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') as 'login' | 'signup' | 'forgot' || 'login'
  
  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-8">
      <div className="mb-6 scale-125">
        <AnimatedLogo />
      </div>
      
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
            Account Access
        </h1>
        <p className="text-sm text-white/50">
            Sign in to your Samples Wala account to continue.
        </p>
      </div>
      
      <div className="w-full max-w-md space-y-6">
        <div className="p-8 bg-white/5 border border-white/10 rounded-2xl space-y-6 backdrop-blur-md">
            <AuthForm />
        </div>

        <div className="space-y-4 text-center">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] leading-relaxed max-w-sm mx-auto">
            By continuing, you agree to our <Link href="/terms" className="text-white/40 hover:text-studio-neon underline">Terms</Link>, <Link href="/refund-policy" className="text-white/40 hover:text-studio-neon underline">Refund</Link>, <Link href="/privacy" className="text-white/40 hover:text-studio-neon underline">Privacy</Link> & <Link href="/terms" className="text-white/40 hover:text-studio-neon underline">EULA</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-studio-neon" size={32} />
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  )
}

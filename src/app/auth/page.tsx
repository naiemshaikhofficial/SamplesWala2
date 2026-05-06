'use client'
import React, { useState } from 'react'
import { Shield, Loader2, ArrowRight, Mail, Lock, Chrome } from 'lucide-react'
import { Turnstile } from '@marsidev/react-turnstile'
import { signIn, signUp, signInWithGoogle, forgotPassword } from './actions'

type AuthMode = 'login' | 'signup' | 'forgot'

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const formData = new FormData(event.currentTarget)
    
    let result;
    if (mode === 'login') result = await signIn(formData)
    else if (mode === 'signup') result = await signUp(formData)
    else result = await forgotPassword(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.success) {
      setMessage(result.success)
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    const result = await signInWithGoogle()
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center space-y-8">
      <div className="h-16 w-16 bg-studio-neon/10 flex items-center justify-center rounded-full">
        <Shield className="text-studio-neon" size={32} />
      </div>
      
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {mode === 'login' && 'Sign In'}
          {mode === 'signup' && 'Create an Account'}
          {mode === 'forgot' && 'Reset Password'}
        </h1>
        <p className="text-sm text-white/50">
          {mode === 'login' && 'Welcome back! Please enter your details.'}
          {mode === 'signup' && 'Join Sampleswala and start downloading.'}
          {mode === 'forgot' && "Enter your email to get a reset link."}
        </p>
      </div>
      
      <div className="w-full max-w-md space-y-6">
        <div className="p-8 bg-white/5 border border-white/10 rounded-2xl space-y-6 backdrop-blur-md">
          {/* Social Login */}
          {mode !== 'forgot' && (
            <>
              <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full h-12 bg-white text-black font-semibold rounded-xl text-sm flex items-center justify-center gap-3 hover:bg-studio-yellow transition-all group"
              >
                <Chrome size={18} />
                Continue with Google
              </button>

              <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center px-4">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <span className="relative bg-[#0a0a0a] px-4 text-xs text-white/20">OR</span>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl text-center">
                {error}
              </div>
            )}
            
            {message && (
              <div className="p-4 bg-studio-neon/10 border border-studio-neon/20 text-studio-neon text-xs rounded-xl text-center">
                {message}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                  <input 
                    name="email"
                    type="email" 
                    required
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-sm focus:border-studio-neon outline-none transition-all"
                    placeholder="example@mail.com"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white/70">Password</label>
                    {mode === 'login' && (
                      <button 
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-xs font-medium text-studio-yellow hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input 
                      name="password"
                      type="password" 
                      required
                      minLength={6}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-sm focus:border-studio-neon outline-none transition-all"
                      placeholder="Enter password"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center py-2">
              <Turnstile 
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} 
                options={{ theme: 'dark' }}
              />
            </div>

            <button 
              disabled={loading}
              className="w-full h-12 bg-studio-neon text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  {mode === 'login' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'forgot' && 'Send Reset Link'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="flex flex-col gap-3">
              <button 
                type="button"
                onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                className="w-full text-center text-sm text-white/50 hover:text-white transition-colors"
              >
                {mode === 'signup' ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </button>
              
              {mode === 'forgot' && (
                <button 
                  type="button"
                  onClick={() => setMode('login')}
                  className="w-full text-center text-sm text-studio-neon hover:underline"
                >
                  Back to Sign In
                </button>
              )}
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-white/20">
          Your account is safe and secure.
        </p>
      </div>
    </div>
  )
}

'use client'
import React, { useState } from 'react'
import { Shield, Loader2, ArrowRight, Lock } from 'lucide-react'
import { updatePassword } from '../actions'

export default function ResetPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const result = await updatePassword(formData)

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
        <h1 className="text-3xl font-bold tracking-tight">Set New Password</h1>
        <p className="text-sm text-white/50">Please enter a new password for your account.</p>
      </div>
      
      <div className="w-full max-w-md space-y-6">
        <form onSubmit={handleSubmit} className="p-8 bg-white/5 border border-white/10 rounded-2xl space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                <input 
                  name="password"
                  type="password" 
                  required
                  minLength={6}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-sm focus:border-studio-neon outline-none transition-all"
                  placeholder="Enter new password"
                />
              </div>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full h-12 bg-studio-neon text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Update Password
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

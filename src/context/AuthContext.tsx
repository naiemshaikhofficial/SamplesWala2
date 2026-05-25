'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AuthContextType {
  user: any | null
  session: any | null
  isArtist: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isArtist: false,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [session, setSession] = useState<any | null>(null)
  const [isArtist, setIsArtist] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const hasSessionCookie = typeof window !== 'undefined' && document.cookie.split(';').some(c => c.trim().startsWith('sb-') || c.trim().includes('-auth-token'))
    const supabase = createClient()

    const checkArtistStatus = async () => {
      try {
        const res = await fetch('/api/auth/artist-status')
        if (res.ok) {
          const data = await res.json()
          setIsArtist(data.isArtist)
        } else {
          setIsArtist(false)
        }
      } catch {
        setIsArtist(false)
      }
    }

    const initAuth = async () => {
      if (!hasSessionCookie) {
        setUser(null)
        setSession(null)
        setIsArtist(false)
        setLoading(false)
        return
      }

      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user || null)
        if (session?.user) {
          await checkArtistStatus()
        }
      } catch (err) {
        console.error('[AUTH_INIT_ERROR]', err)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession)
      setUser(currentSession?.user || null)
      if (currentSession?.user) {
        await checkArtistStatus()
      } else {
        setIsArtist(false)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, session, isArtist, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

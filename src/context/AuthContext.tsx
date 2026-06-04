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
const pendingFetches = new Map<string, Promise<boolean>>()

const getCachedArtistStatus = (userId: string): boolean | null => {
  if (typeof window === 'undefined') return null
  try {
    const cached = sessionStorage.getItem(`artist-status-${userId}`)
    return cached !== null ? cached === 'true' : null
  } catch {
    return null
  }
}

const setCachedArtistStatus = (userId: string, isArtist: boolean) => {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(`artist-status-${userId}`, String(isArtist))
  } catch {}
}

const fetchArtistStatus = (userId: string): Promise<boolean> => {
  const cached = getCachedArtistStatus(userId)
  if (cached !== null) return Promise.resolve(cached)

  const existing = pendingFetches.get(userId)
  if (existing) return existing

  const promise = fetch('/api/auth/artist-status')
    .then(async (res) => {
      if (res.ok) {
        const data = await res.json()
        setCachedArtistStatus(userId, data.isArtist)
        return !!data.isArtist
      }
      return false
    })
    .catch(() => false)
    .finally(() => {
      pendingFetches.delete(userId)
    })

  pendingFetches.set(userId, promise)
  return promise
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [session, setSession] = useState<any | null>(null)
  const [isArtist, setIsArtist] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const supabase = createClient()

    const checkArtistStatus = async (userId: string) => {
      const isArtistStatus = await fetchArtistStatus(userId)
      setIsArtist(isArtistStatus)
    }

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user || null)
        if (session?.user) {
          await checkArtistStatus(session.user.id)
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
        await checkArtistStatus(currentSession.user.id)
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

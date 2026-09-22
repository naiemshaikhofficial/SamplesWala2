'use client'

import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AuthContextType {
  user: any | null
  session: any | null
  isArtist: boolean
  loading: boolean
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isArtist: false,
  loading: true,
  refreshAuth: async () => {},
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
  const lastDispatchedUserIdRef = useRef<string | null>(null)

  const refreshAuth = React.useCallback(async () => {
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user || null)
      if (session?.user) {
        lastDispatchedUserIdRef.current = session.user.id
        const isArtistStatus = await fetchArtistStatus(session.user.id)
        setIsArtist(isArtistStatus)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('sw:auth-login', { detail: { userId: session.user.id } }))
        }
      } else {
        lastDispatchedUserIdRef.current = null
        setIsArtist(false)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('sampleswala_owned_ids')
          localStorage.removeItem('sampleswala_owned_user_id')
          localStorage.removeItem('sampleswala_is_admin')
          window.dispatchEvent(new CustomEvent('sw:auth-logout'))
        }
      }
    } catch (err) {
      console.error('[AUTH_REFRESH_ERROR]', err)
    } finally {
      setLoading(false)
    }
  }, [])

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
          lastDispatchedUserIdRef.current = session.user.id
          await checkArtistStatus(session.user.id)
        } else {
          lastDispatchedUserIdRef.current = null
          setIsArtist(false)
          if (typeof window !== 'undefined') {
            localStorage.removeItem('sampleswala_owned_ids')
            localStorage.removeItem('sampleswala_owned_user_id')
            localStorage.removeItem('sampleswala_is_admin')
            window.dispatchEvent(new CustomEvent('sw:auth-logout'))
          }
        }
      } catch (err) {
        console.error('[AUTH_INIT_ERROR]', err)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    const handleAuthRefresh = () => {
      refreshAuth()
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('sw:auth-refresh', handleAuthRefresh)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession)
      setUser(currentSession?.user || null)
      if (currentSession?.user) {
        const userId = currentSession.user.id
        await checkArtistStatus(userId)

        // Only dispatch sw:auth-login if this is an explicit SIGNED_IN event or if the user actually changed
        const isNewLoginOrUserChange = event === 'SIGNED_IN' || lastDispatchedUserIdRef.current !== userId
        if (isNewLoginOrUserChange && typeof window !== 'undefined') {
          lastDispatchedUserIdRef.current = userId
          window.dispatchEvent(new CustomEvent('sw:auth-login', { detail: { userId } }))
        }
      } else {
        const wasLoggedIn = lastDispatchedUserIdRef.current !== null
        lastDispatchedUserIdRef.current = null
        setIsArtist(false)
        if (wasLoggedIn && typeof window !== 'undefined') {
          localStorage.removeItem('sampleswala_owned_ids')
          localStorage.removeItem('sampleswala_owned_user_id')
          localStorage.removeItem('sampleswala_is_admin')
          window.dispatchEvent(new CustomEvent('sw:auth-logout'))
        }
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
      if (typeof window !== 'undefined') {
        window.removeEventListener('sw:auth-refresh', handleAuthRefresh)
      }
    }
  }, [refreshAuth])

  return (
    <AuthContext.Provider value={{ user, session, isArtist, loading, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

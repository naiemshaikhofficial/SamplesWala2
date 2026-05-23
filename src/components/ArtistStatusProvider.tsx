'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const ArtistStatusContext = createContext(false)

export function useIsArtist() {
  return useContext(ArtistStatusContext)
}

/**
 * 🟢 CPU OPTIMIZATION: Instead of querying artist_collaborations + admins tables
 * on EVERY page load in the root layout (27K+ requests/month), this component
 * lazily checks artist status client-side ONLY for logged-in users.
 * 
 * This saves ~50-100ms of server CPU per request for all guest visitors.
 */
export function ArtistStatusProvider({ 
  children 
}: { 
  children: React.ReactNode
}) {
  const [isArtist, setIsArtist] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        // Check artist status client-side via lightweight API
        fetch('/api/auth/artist-status')
          .then(res => res.ok ? res.json() : { isArtist: false })
          .then(data => setIsArtist(data.isArtist))
          .catch(() => setIsArtist(false))
      }
    })
  }, [])

  return (
    <ArtistStatusContext.Provider value={isArtist}>
      {children}
    </ArtistStatusContext.Provider>
  )
}

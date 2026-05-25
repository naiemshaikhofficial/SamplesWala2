'use client'

import React from 'react'
import { useAuth } from '@/context/AuthContext'

export function useIsArtist() {
  const { isArtist } = useAuth()
  return isArtist
}

/**
 * 🟢 COMPATIBILITY LAYER: Wraps children.
 * Real auth state management has been migrated to AuthProvider in src/context/AuthContext.tsx.
 */
export function ArtistStatusProvider({ 
  children 
}: { 
  children: React.ReactNode
}) {
  return <>{children}</>
}

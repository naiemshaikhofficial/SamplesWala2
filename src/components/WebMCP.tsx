'use client'
import { useEffect } from 'react'

export function WebMCP() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const nav = navigator as any

    // WebMCP API: navigator.modelContext.registerTool()
    if (nav.modelContext && typeof nav.modelContext.registerTool === 'function') {
      try {
        const controller = new AbortController()

        // 1. Search Sounds Tool
        nav.modelContext.registerTool({
          name: 'search_sounds',
          description: 'Search and filter royalty-free Indian music sample packs, loops, and vocals on Samples Wala',
          inputSchema: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'Search keywords (e.g. dholak, bollywood vocal, tabla)' },
              genre: { type: 'string', description: 'Musical genre or style' },
            },
            required: ['query'],
          },
          execute: async ({ query, genre }: { query: string; genre?: string }) => {
            const params = new URLSearchParams({ q: query })
            if (genre) params.append('genre', genre)
            return {
              url: `https://sampleswala.com/browse?${params.toString()}`,
              message: `Navigating to search results for ${query}`,
            }
          },
          signal: controller.signal,
        })

        // 2. Browse Packs Tool
        nav.modelContext.registerTool({
          name: 'browse_packs',
          description: 'Browse all curated sound packs on Samples Wala',
          inputSchema: {
            type: 'object',
            properties: {},
          },
          execute: async () => {
            return {
              url: 'https://sampleswala.com/browse/packs',
              message: 'Opening sound packs catalog',
            }
          },
          signal: controller.signal,
        })

        return () => {
          controller.abort()
        }
      } catch {
        // Graceful fallback
      }
    }
  }, [])

  return null
}

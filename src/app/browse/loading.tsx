import React from 'react'
import { LibrarySkeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-20 space-y-20">
      <section className="space-y-12">
        <div className="flex flex-col items-center text-center border-b border-white/5 pb-12 gap-6">
          <div className="space-y-3">
            <div className="h-16 w-96 bg-white/5 rounded-sm animate-pulse mx-auto" />
            <div className="h-4 w-64 bg-white/5 rounded-sm animate-pulse mx-auto" />
          </div>
        </div>
        
        <LibrarySkeleton />
      </section>
    </div>
  )
}

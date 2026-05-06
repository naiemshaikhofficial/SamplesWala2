'use client'
import React from 'react'

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-4 animate-pulse">
      <div className="aspect-square bg-white/5 border border-white/5 rounded-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>
      <div className="space-y-4 px-1">
        <div className="space-y-2">
          <div className="h-4 bg-white/5 rounded-sm w-3/4" />
          <div className="flex items-center justify-between">
            <div className="h-3 bg-white/5 rounded-sm w-1/4" />
            <div className="h-3 bg-studio-neon/10 rounded-sm w-1/6" />
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <div className="flex-1 h-10 bg-white/5 rounded-sm" />
          <div className="flex-1 h-10 bg-white/5 rounded-sm" />
        </div>
      </div>
    </div>
  )
}

export function LibrarySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-12">
      {[...Array(8)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

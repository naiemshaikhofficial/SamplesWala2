'use client'
import React, { useEffect, useState } from 'react'

const NOTES = ['♩', '♪', '♫', '♬', '♭', '♮', '♯', '𝄞', '𝄢', '𝄡']
const COLORS = [
  'text-studio-pink',
  'text-studio-blue',
  'text-studio-yellow',
  'text-studio-neon',
  'text-studio-orange',
  'text-studio-purple',
  'text-studio-red'
]

interface NoteInstance {
  id: number
  char: string
  color: string
  left: string
  size: string
  delay: string
  duration: string
}

export function FloatingMusicNotes() {
  const [notes, setNotes] = useState<NoteInstance[]>([])

  useEffect(() => {
    // Disable floating notes completely on mobile or if reduced motion is preferred
    const isMobile = window.innerWidth < 768
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    if (isMobile || prefersReducedMotion) {
      setNotes([])
      return
    }

    // Generate 35 floating musical symbols across the background for desktop
    const newNotes = Array.from({ length: 35 }).map((_, i) => {
      const sizeRandom = Math.random()
      const size = sizeRandom < 0.25 ? 'text-sm' : sizeRandom < 0.6 ? 'text-xl' : sizeRandom < 0.85 ? 'text-3xl' : 'text-5xl'
      return {
        id: i,
        char: NOTES[Math.floor(Math.random() * NOTES.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        left: `${Math.random() * 96}%`,
        size,
        delay: `${Math.random() * 12}s`,
        duration: `${10 + Math.random() * 14}s`
      }
    })
    setNotes(newNotes)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden select-none opacity-25">
      {notes.map((note) => (
        <span
          key={note.id}
          className={`absolute bottom-[-60px] font-black ${note.color} ${note.size} animate-float-note`}
          style={{
            left: note.left,
            animationDelay: note.delay,
            animationDuration: note.duration,
          }}
        >
          {note.char}
        </span>
      ))}
    </div>
  )
}

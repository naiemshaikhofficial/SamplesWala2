'use client'

import React, { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rotation: number
  rotationSpeed: number
  opacity: number
  shape: 'rect' | 'circle' | 'ribbon'
  wobble: number
  wobbleSpeed: number
}

const PARTY_COLORS = [
  '#00FF94', // Neon Green
  '#FFE600', // Cyber Yellow
  '#0074E4', // Electric Blue
  '#FF0080', // Hot Pink
  '#FF5C00', // Neon Orange
  '#00FFFF', // Cyan
  '#FFFFFF', // White
  '#9D00FF', // Purple
]

export function PartyCelebration() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    const particles: Particle[] = []

    // Launch Cannon Blast
    const fireCannon = (originX: number, originY: number, angleDeg: number, count: number = 60, velocitySpread: number = 18) => {
      const angleRad = (angleDeg * Math.PI) / 180
      for (let i = 0; i < count; i++) {
        const spread = (Math.random() - 0.5) * 0.9
        const speed = Math.random() * velocitySpread + 12
        const currentAngle = angleRad + spread
        const shapes: ('rect' | 'circle' | 'ribbon')[] = ['rect', 'rect', 'circle', 'ribbon']

        particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(currentAngle) * speed,
          vy: Math.sin(currentAngle) * speed,
          size: Math.random() * 8 + 6,
          color: PARTY_COLORS[Math.floor(Math.random() * PARTY_COLORS.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.25,
          opacity: 1,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          wobble: Math.random() * 10,
          wobbleSpeed: Math.random() * 0.1 + 0.05,
        })
      }
    }

    // Initial Party Blasts
    // Left Cannon
    fireCannon(width * 0.1, height * 0.85, -60, 70, 24)
    // Right Cannon
    fireCannon(width * 0.9, height * 0.85, -120, 70, 24)

    // Second wave after 350ms
    const wave1 = setTimeout(() => {
      fireCannon(width * 0.2, height * 0.75, -50, 50, 22)
      fireCannon(width * 0.8, height * 0.75, -130, 50, 22)
    }, 350)

    // Center ceiling shower after 700ms
    const wave2 = setTimeout(() => {
      fireCannon(width * 0.5, height * 0.3, -90, 80, 16)
    }, 700)

    // Gentle continuous confetti drops
    let frame = 0
    const render = () => {
      frame++
      ctx.clearRect(0, 0, width, height)

      // Add occasional soft floating celebration particles
      if (frame < 300 && frame % 12 === 0) {
        particles.push({
          x: Math.random() * width,
          y: -10,
          vx: (Math.random() - 0.5) * 3,
          vy: Math.random() * 3 + 2,
          size: Math.random() * 7 + 5,
          color: PARTY_COLORS[Math.floor(Math.random() * PARTY_COLORS.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.15,
          opacity: 1,
          shape: Math.random() > 0.4 ? 'rect' : 'ribbon',
          wobble: Math.random() * 5,
          wobbleSpeed: 0.08,
        })
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]

        // Physics
        p.x += p.vx + Math.sin(p.wobble) * 1.5
        p.y += p.vy
        p.vy += 0.35 // Gravity
        p.vx *= 0.98 // Air resistance
        p.rotation += p.rotationSpeed
        p.wobble += p.wobbleSpeed

        // Fade out slowly once falling down
        if (p.y > height * 0.6) {
          p.opacity -= 0.008
        }

        if (p.opacity <= 0 || p.y > height + 50) {
          particles.splice(i, 1)
          continue
        }

        // Draw particle
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = Math.max(0, p.opacity)
        ctx.fillStyle = p.color

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        } else if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Ribbon
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size * 1.4, p.size * 0.35)
        }

        ctx.restore()
      }

      animationId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      clearTimeout(wave1)
      clearTimeout(wave2)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      />
      {/* Floating Animated Celebration Emojis */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        <div className="absolute left-[8%] bottom-[20%] text-3xl sm:text-4xl animate-bounce [animation-duration:1.5s]">
          🎉
        </div>
        <div className="absolute right-[10%] bottom-[25%] text-3xl sm:text-4xl animate-bounce [animation-duration:1.8s]">
          🎊
        </div>
        <div className="absolute left-[18%] top-[30%] text-2xl sm:text-3xl animate-pulse [animation-duration:2s]">
          ✨
        </div>
        <div className="absolute right-[20%] top-[32%] text-2xl sm:text-3xl animate-pulse [animation-duration:1.6s]">
          ⚡
        </div>
        <div className="absolute left-[50%] -translate-x-1/2 top-[12%] text-2xl sm:text-3xl animate-bounce [animation-duration:2.2s]">
          🔥
        </div>
      </div>
    </>
  )
}

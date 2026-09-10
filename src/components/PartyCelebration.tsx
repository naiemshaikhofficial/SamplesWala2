'use client'

import React, { useEffect, useRef } from 'react'

interface ConfettiParticle {
  type: 'confetti'
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rotation: number
  rotationSpeed: number
  wobble: number
  wobbleSpeed: number
  opacity: number
  shape: 'rect' | 'circle' | 'star'
}

interface SparkParticle {
  type: 'spark'
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  opacity: number
  decay: number
  gravity: number
}

const REWARD_COLORS = [
  '#FFE600', // Gold / Cyber Yellow
  '#00FF94', // Neon Green
  '#00E5FF', // Electric Cyan
  '#FF0055', // Neon Pink
  '#FF7700', // Radiant Orange
  '#FFFFFF', // Starlight White
  '#B026FF', // Cyber Purple
]

export function PartyCelebration() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const dpr = window.devicePixelRatio || 1
    let width = window.innerWidth
    let height = window.innerHeight

    const setupCanvasSize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(dpr, dpr)
    }

    setupCanvasSize()
    window.addEventListener('resize', setupCanvasSize)

    const particles: (ConfettiParticle | SparkParticle)[] = []

    // Helper to draw a 5-point star
    const drawStar = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
      let rot = (Math.PI / 2) * 3
      let x = cx
      let y = cy
      const step = Math.PI / spikes

      ctx.beginPath()
      ctx.moveTo(cx, cy - outerRadius)
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius
        y = cy + Math.sin(rot) * outerRadius
        ctx.lineTo(x, y)
        rot += step

        x = cx + Math.cos(rot) * innerRadius
        y = cy + Math.sin(rot) * innerRadius
        ctx.lineTo(x, y)
        rot += step
      }
      ctx.lineTo(cx, cy - outerRadius)
      ctx.closePath()
      ctx.fill()
    }

    // Firework / Starburst Explosion
    const createFirework = (x: number, y: number, colorFamily: string[]) => {
      const count = 45
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4
        const speed = Math.random() * 9 + 4
        particles.push({
          type: 'spark',
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 4 + 2,
          color: colorFamily[Math.floor(Math.random() * colorFamily.length)],
          opacity: 1,
          decay: Math.random() * 0.015 + 0.012,
          gravity: 0.18,
        })
      }
    }

    // Cannon Blast
    const fireCannon = (
      originX: number,
      originY: number,
      angleDeg: number,
      count: number = 75,
      power: number = 26
    ) => {
      const angleRad = (angleDeg * Math.PI) / 180
      for (let i = 0; i < count; i++) {
        const spread = (Math.random() - 0.5) * 0.85
        const speed = Math.random() * power + 10
        const angle = angleRad + spread
        const shapes: ('rect' | 'circle' | 'star')[] = ['rect', 'rect', 'circle', 'star']

        particles.push({
          type: 'confetti',
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 9 + 6,
          color: REWARD_COLORS[Math.floor(Math.random() * REWARD_COLORS.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.28,
          wobble: Math.random() * 10,
          wobbleSpeed: Math.random() * 0.12 + 0.06,
          opacity: 1,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
        })
      }
    }

    // Sequence of Grand Rewarding Celebration Waves
    // Wave 1: Immediate Center Hero Blast
    createFirework(width / 2, height * 0.28, ['#FFE600', '#00FF94', '#FFFFFF'])
    createFirework(width / 2 - 120, height * 0.32, ['#00E5FF', '#FFE600'])
    createFirework(width / 2 + 120, height * 0.32, ['#00FF94', '#FF7700'])

    // Wave 2: Dual Bottom Corner High-Powered Cannons
    fireCannon(width * 0.08, height * 0.9, -60, 90, 30)
    fireCannon(width * 0.92, height * 0.9, -120, 90, 30)

    // Wave 3: Secondary Sky Shells (400ms)
    const timer1 = setTimeout(() => {
      createFirework(width * 0.25, height * 0.25, ['#FFE600', '#FF0055', '#00FF94'])
      createFirework(width * 0.75, height * 0.25, ['#00E5FF', '#FFE600', '#FFFFFF'])
      fireCannon(width * 0.2, height * 0.85, -55, 60, 26)
      fireCannon(width * 0.8, height * 0.85, -125, 60, 26)
    }, 450)

    // Wave 4: Grand Golden Cascade (900ms)
    const timer2 = setTimeout(() => {
      createFirework(width * 0.5, height * 0.2, ['#FFE600', '#FFFFFF', '#00FF94'])
      for (let i = 0; i < 40; i++) {
        particles.push({
          type: 'confetti',
          x: Math.random() * width,
          y: -10 - Math.random() * 50,
          vx: (Math.random() - 0.5) * 3,
          vy: Math.random() * 3 + 2,
          size: Math.random() * 8 + 5,
          color: ['#FFE600', '#00FF94', '#FFFFFF', '#FFD700'][Math.floor(Math.random() * 4)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2,
          wobble: Math.random() * 5,
          wobbleSpeed: 0.08,
          opacity: 1,
          shape: Math.random() > 0.3 ? 'rect' : 'star',
        })
      }
    }, 900)

    // Interactive Click Burst: Clicking anywhere shoots fresh fireworks!
    const handleClick = (e: MouseEvent) => {
      createFirework(e.clientX, e.clientY, REWARD_COLORS)
      fireCannon(e.clientX, e.clientY, -90, 35, 18)
    }
    window.addEventListener('click', handleClick)

    // Animation Loop
    let frame = 0
    const render = () => {
      frame++
      ctx.clearRect(0, 0, width, height)

      // Occasional gentle floating sparkles for lingering festive vibe
      if (frame < 500 && frame % 16 === 0) {
        particles.push({
          type: 'confetti',
          x: Math.random() * width,
          y: -15,
          vx: (Math.random() - 0.5) * 2.5,
          vy: Math.random() * 2.5 + 1.8,
          size: Math.random() * 7 + 4,
          color: REWARD_COLORS[Math.floor(Math.random() * REWARD_COLORS.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.15,
          wobble: Math.random() * 6,
          wobbleSpeed: 0.07,
          opacity: 1,
          shape: Math.random() > 0.5 ? 'rect' : 'circle',
        })
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]

        if (p.type === 'spark') {
          p.x += p.vx
          p.y += p.vy
          p.vy += p.gravity
          p.vx *= 0.98
          p.opacity -= p.decay

          if (p.opacity <= 0) {
            particles.splice(i, 1)
            continue
          }

          ctx.save()
          ctx.globalAlpha = Math.max(0, p.opacity)
          ctx.fillStyle = p.color
          ctx.shadowBlur = 10
          ctx.shadowColor = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        } else {
          // Confetti Particle
          p.x += p.vx + Math.sin(p.wobble) * 1.6
          p.y += p.vy
          p.vy += 0.32 // Gravity
          p.vx *= 0.985 // Air drag
          p.rotation += p.rotationSpeed
          p.wobble += p.wobbleSpeed

          if (p.y > height * 0.65) {
            p.opacity -= 0.007
          }

          if (p.opacity <= 0 || p.y > height + 60) {
            particles.splice(i, 1)
            continue
          }

          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rotation)
          ctx.globalAlpha = Math.max(0, p.opacity)
          ctx.fillStyle = p.color

          // 3D flip effect using wobble
          const scaleX = Math.cos(p.wobble)

          if (p.shape === 'rect') {
            ctx.fillRect((-p.size / 2) * scaleX, -p.size / 2, p.size * Math.abs(scaleX), p.size * 0.65)
          } else if (p.shape === 'star') {
            drawStar(0, 0, 5, p.size * 0.9, p.size * 0.45)
          } else {
            ctx.beginPath()
            ctx.arc(0, 0, (p.size / 2.2) * Math.abs(scaleX), 0, Math.PI * 2)
            ctx.fill()
          }

          ctx.restore()
        }
      }

      animationId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', setupCanvasSize)
      window.removeEventListener('click', handleClick)
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  )
}

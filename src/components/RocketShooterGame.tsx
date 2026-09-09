'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import {
  Trophy,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Zap,
  Shield,
  Flame,
  MousePointer,
  Smartphone
} from 'lucide-react'

// Web Audio API Synthesizer (Zero external audio files required)
class SoundFX {
  private ctx: AudioContext | null = null
  public enabled: boolean = true

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  playLaser() {
    if (!this.enabled) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(880, now)
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.12)

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.13)
  }

  playExplosion() {
    if (!this.enabled) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const bufferSize = this.ctx.sampleRate * 0.25
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(600, now)
    filter.frequency.exponentialRampToValueAtTime(80, now + 0.25)

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    noise.start(now)
    noise.stop(now + 0.26)
  }

  playPowerup() {
    if (!this.enabled) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const notes = [440, 554, 659, 880]
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.06)

      gain.gain.setValueAtTime(0.15, now + idx * 0.06)
      gain.gain.exponentialRampToValueAtTime(0.001, now + (idx + 1) * 0.06 + 0.05)

      osc.connect(gain)
      gain.connect(this.ctx!.destination)

      osc.start(now + idx * 0.06)
      osc.stop(now + (idx + 1) * 0.06 + 0.06)
    })
  }

  playHit() {
    if (!this.enabled) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(220, now)
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.2)

    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.21)
  }
}

const sfx = new SoundFX()

export function RocketShooterGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Game UI State
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [combo, setCombo] = useState(1)
  const [soundOn, setSoundOn] = useState(true)
  const [autoFire, setAutoFire] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [hasNewHighScore, setHasNewHighScore] = useState(false)

  // Game Engine Internal Refs (avoids React state lag inside 60fps loop)
  const stateRef = useRef({
    score: 0,
    lives: 3,
    combo: 1,
    lastHitTime: 0,
    powerupTimer: 0,
    screenShake: 0,
    gameState: 'ready' as 'ready' | 'playing' | 'gameover',
    player: {
      x: 300,
      y: 500,
      targetX: 300,
      width: 44,
      height: 54,
      speed: 8,
      invulnerable: 0,
      flameTick: 0
    },
    lasers: [] as Array<{ x: number; y: number; vx: number; vy: number; radius: number; color: string }>,
    enemies: [] as Array<{
      id: number
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      type: 'vinyl' | 'asteroid' | 'glitch' | 'powerup'
      hp: number
      rotation: number
      rotSpeed: number
      color: string
    }>,
    particles: [] as Array<{
      x: number
      y: number
      vx: number
      vy: number
      alpha: number
      size: number
      color: string
      decay: number
    }>,
    stars: [] as Array<{ x: number; y: number; speed: number; size: number; alpha: number; length: number }>,
    floatingTexts: [] as Array<{ x: number; y: number; text: string; color: string; alpha: number; yOffset: number }>,
    lastSpawn: 0,
    lastShot: 0,
    keys: { left: false, right: false, fire: false },
    autoFire: false
  })

  // Load High Score
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sampleswala_rocket_highscore')
      if (saved) {
        setHighScore(parseInt(saved, 10) || 0)
      }
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
  }, [])

  const toggleSound = () => {
    sfx.enabled = !soundOn
    setSoundOn(!soundOn)
  }

  // Handle Canvas Resize
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const rect = container.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
    }

    // Initialize Stars
    const stars = []
    const count = Math.floor((rect.width * rect.height) / 4500)
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        speed: 1.5 + Math.random() * 4.5,
        size: 0.8 + Math.random() * 2,
        alpha: 0.3 + Math.random() * 0.7,
        length: 2 + Math.random() * 12
      })
    }
    stateRef.current.stars = stars

    // Position player near bottom center
    stateRef.current.player.x = rect.width / 2
    stateRef.current.player.targetX = rect.width / 2
    stateRef.current.player.y = rect.height - 75
  }, [])

  // Start / Restart Game
  const startGame = useCallback(() => {
    const container = containerRef.current
    const rect = container ? container.getBoundingClientRect() : { width: 600, height: 650 }

    stateRef.current.score = 0
    stateRef.current.lives = 3
    stateRef.current.combo = 1
    stateRef.current.powerupTimer = 0
    stateRef.current.screenShake = 0
    stateRef.current.enemies = []
    stateRef.current.lasers = []
    stateRef.current.particles = []
    stateRef.current.floatingTexts = []
    stateRef.current.lastSpawn = Date.now()
    stateRef.current.lastShot = 0
    stateRef.current.gameState = 'playing'
    stateRef.current.player.x = rect.width / 2
    stateRef.current.player.targetX = rect.width / 2
    stateRef.current.player.y = rect.height - 75
    stateRef.current.player.invulnerable = 60

    setScore(0)
    setLives(3)
    setCombo(1)
    setHasNewHighScore(false)
    setGameState('playing')
  }, [])

  // Input Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA', 'a', 'A'].includes(e.code)) {
        stateRef.current.keys.left = true
      }
      if (['ArrowRight', 'KeyD', 'd', 'D'].includes(e.code)) {
        stateRef.current.keys.right = true
      }
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault()
        stateRef.current.keys.fire = true
        if (stateRef.current.gameState === 'ready' || stateRef.current.gameState === 'gameover') {
          startGame()
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA', 'a', 'A'].includes(e.code)) {
        stateRef.current.keys.left = false
      }
      if (['ArrowRight', 'KeyD', 'd', 'D'].includes(e.code)) {
        stateRef.current.keys.right = false
      }
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        stateRef.current.keys.fire = false
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [resizeCanvas, startGame])

  // Mouse / Touch Move Control on Canvas
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    stateRef.current.player.targetX = Math.max(30, Math.min(rect.width - 30, x))
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (stateRef.current.gameState === 'ready' || stateRef.current.gameState === 'gameover') {
      startGame()
      return
    }
    stateRef.current.keys.fire = true
    handlePointerMove(e)
  }

  const handlePointerUp = () => {
    stateRef.current.keys.fire = false
  }

  // Main 60FPS Game Loop
  useEffect(() => {
    let animId: number
    const canvas = canvasRef.current
    if (!canvas) return

    const loop = () => {
      const state = stateRef.current
      const container = containerRef.current
      if (!canvas || !container) return
      const rect = container.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Screen Shake translation
      ctx.save()
      if (state.screenShake > 0) {
        const sx = (Math.random() - 0.5) * state.screenShake * 4
        const sy = (Math.random() - 0.5) * state.screenShake * 4
        ctx.translate(sx, sy)
        state.screenShake = Math.max(0, state.screenShake - 0.1)
      }

      // Clear Frame with Deep Space Color
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, width, height)

      // 1. STARFIELD ANIMATION (Parallax Warp Speed Effect)
      const isWarpSpeed = state.score > 2000
      const warpMultiplier = isWarpSpeed ? 1.8 : 1.0

      state.stars.forEach(star => {
        star.y += star.speed * warpMultiplier
        if (star.y > height) {
          star.y = 0
          star.x = Math.random() * width
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`
        if (isWarpSpeed) {
          // Draw warp streak
          ctx.strokeStyle = `rgba(0, 255, 148, ${star.alpha * 0.7})`
          ctx.lineWidth = star.size
          ctx.beginPath()
          ctx.moveTo(star.x, star.y)
          ctx.lineTo(star.x, star.y - star.length * 1.6)
          ctx.stroke()
        } else {
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      if (state.gameState === 'playing') {
        // Increment survival score
        state.score += 1
        if (state.score % 15 === 0) {
          setScore(state.score)
        }

        // Combo timeout check (resets after 2.5s)
        if (Date.now() - state.lastHitTime > 2500 && state.combo > 1) {
          state.combo = 1
          setCombo(1)
        }

        // Powerup timer countdown
        if (state.powerupTimer > 0) {
          state.powerupTimer--
        }

        // 2. PLAYER MOVEMENT & THRUSTER
        const p = state.player
        p.flameTick++

        // Keyboard Movement
        if (state.keys.left) p.targetX -= p.speed
        if (state.keys.right) p.targetX += p.speed
        p.targetX = Math.max(25, Math.min(width - 25, p.targetX))

        // Smooth Lerp towards target
        p.x += (p.targetX - p.x) * 0.22

        if (p.invulnerable > 0) {
          p.invulnerable--
        }

        // 3. SHOOTING LASERS
        const now = Date.now()
        const fireInterval = state.powerupTimer > 0 ? 110 : 200 // Double rapid fire when powered up
        const shouldFire = state.keys.fire || stateRef.current.autoFire

        if (shouldFire && now - state.lastShot > fireInterval) {
          state.lastShot = now
          sfx.playLaser()

          if (state.powerupTimer > 0) {
            // Triple / Dual Rapid Lasers
            state.lasers.push({ x: p.x - 14, y: p.y - 10, vx: -1.2, vy: -15, radius: 3, color: '#FFE600' })
            state.lasers.push({ x: p.x, y: p.y - 20, vx: 0, vy: -16, radius: 4, color: '#00FF94' })
            state.lasers.push({ x: p.x + 14, y: p.y - 10, vx: 1.2, vy: -15, radius: 3, color: '#FFE600' })
          } else {
            // Dual Standard Plasma Bolts
            state.lasers.push({ x: p.x - 11, y: p.y - 12, vx: 0, vy: -13, radius: 3, color: '#00FF94' })
            state.lasers.push({ x: p.x + 11, y: p.y - 12, vx: 0, vy: -13, radius: 3, color: '#00FF94' })
          }
        }

        // 4. SPAWN OBSTACLES & TARGETS
        const spawnInterval = Math.max(650, 1600 - Math.floor(state.score / 200) * 80)
        if (now - state.lastSpawn > spawnInterval) {
          state.lastSpawn = now

          const rand = Math.random()
          let type: 'vinyl' | 'asteroid' | 'glitch' | 'powerup' = 'asteroid'
          let radius = 20
          let hp = 1
          let color = '#71717a'
          let speed = 2.2 + Math.random() * 2.2 + Math.min(state.score / 3500, 3)

          if (rand < 0.35) {
            // Spinning Vinyl Record
            type = 'vinyl'
            radius = 22
            hp = 1
            color = '#181818'
          } else if (rand < 0.65) {
            // Asteroid Rock
            type = 'asteroid'
            radius = 24
            hp = 2
            color = '#3f3f46'
          } else if (rand < 0.88) {
            // Sound Glitch Orb (Fast zigzag)
            type = 'glitch'
            radius = 16
            hp = 1
            color = '#FF5C00'
            speed *= 1.3
          } else {
            // Rare Powerup Crystal
            type = 'powerup'
            radius = 18
            hp = 1
            color = '#FFE600'
            speed = 1.8
          }

          state.enemies.push({
            id: Math.random(),
            x: 35 + Math.random() * (width - 70),
            y: -30,
            vx: type === 'glitch' ? (Math.random() - 0.5) * 3 : (Math.random() - 0.5) * 1.2,
            vy: speed,
            radius,
            type,
            hp,
            rotation: 0,
            rotSpeed: (Math.random() - 0.5) * 0.1,
            color
          })
        }

        // 5. UPDATE LASERS
        for (let i = state.lasers.length - 1; i >= 0; i--) {
          const l = state.lasers[i]
          l.x += l.vx
          l.y += l.vy

          if (l.y < -10) {
            state.lasers.splice(i, 1)
            continue
          }

          // Laser Trail & Glowing Head
          ctx.save()
          ctx.shadowBlur = 10
          ctx.shadowColor = l.color
          ctx.fillStyle = l.color
          ctx.beginPath()
          ctx.arc(l.x, l.y, l.radius, 0, Math.PI * 2)
          ctx.fill()

          ctx.strokeStyle = l.color
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(l.x, l.y)
          ctx.lineTo(l.x - l.vx * 2, l.y + 12)
          ctx.stroke()
          ctx.restore()
        }

        // 6. UPDATE & RENDER ENEMIES
        for (let i = state.enemies.length - 1; i >= 0; i--) {
          const e = state.enemies[i]
          e.x += e.vx
          e.y += e.vy
          e.rotation += e.rotSpeed

          // Keep enemies within canvas bounds horizontally
          if (e.x < e.radius || e.x > width - e.radius) {
            e.vx *= -1
          }

          // Check if enemy passed bottom
          if (e.y > height + 40) {
            state.enemies.splice(i, 1)
            continue
          }

          // Laser Collisions
          let enemyDestroyed = false
          for (let j = state.lasers.length - 1; j >= 0; j--) {
            const l = state.lasers[j]
            const dist = Math.hypot(e.x - l.x, e.y - l.y)
            if (dist < e.radius + l.radius) {
              // Laser hit enemy!
              state.lasers.splice(j, 1)
              e.hp--

              // Spark particles on impact
              for (let k = 0; k < 6; k++) {
                state.particles.push({
                  x: l.x,
                  y: l.y,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  alpha: 1,
                  size: 2 + Math.random() * 2,
                  color: l.color,
                  decay: 0.05
                })
              }

              if (e.hp <= 0) {
                enemyDestroyed = true
                state.screenShake = 0.5

                if (e.type === 'powerup') {
                  sfx.playPowerup()
                  state.powerupTimer = 400 // ~7 seconds of double rapid lasers
                  state.score += 500
                  state.floatingTexts.push({ x: e.x, y: e.y, text: 'RAPID LASERS! +500', color: '#FFE600', alpha: 1, yOffset: 0 })
                } else {
                  sfx.playExplosion()
                  const points = (e.type === 'vinyl' ? 150 : e.type === 'glitch' ? 250 : 100) * state.combo
                  state.score += points
                  state.combo = Math.min(state.combo + 1, 6)
                  state.lastHitTime = Date.now()
                  setCombo(state.combo)

                  state.floatingTexts.push({
                    x: e.x,
                    y: e.y,
                    text: `+${points}${state.combo > 1 ? ` (${state.combo}X)` : ''}`,
                    color: state.combo > 2 ? '#FF5C00' : '#00FF94',
                    alpha: 1,
                    yOffset: 0
                  })
                }

                // Big Explosion Particles
                for (let k = 0; k < 18; k++) {
                  state.particles.push({
                    x: e.x,
                    y: e.y,
                    vx: (Math.random() - 0.5) * 8,
                    vy: (Math.random() - 0.5) * 8,
                    alpha: 1,
                    size: 2 + Math.random() * 4,
                    color: e.type === 'vinyl' ? '#00E5FF' : e.type === 'powerup' ? '#FFE600' : '#FF3131',
                    decay: 0.03
                  })
                }
                break
              }
            }
          }

          if (enemyDestroyed) {
            state.enemies.splice(i, 1)
            continue
          }

          // Player Collision with Enemy
          const distToPlayer = Math.hypot(e.x - p.x, e.y - p.y)
          if (distToPlayer < e.radius + 18 && p.invulnerable <= 0) {
            if (e.type === 'powerup') {
              sfx.playPowerup()
              state.powerupTimer = 400
              state.score += 500
              state.enemies.splice(i, 1)
              continue
            }

            // Damage taken
            sfx.playHit()
            state.lives--
            state.combo = 1
            state.screenShake = 1.2
            p.invulnerable = 70 // invincibility blink
            setLives(state.lives)
            setCombo(1)

            // Collision sparks
            for (let k = 0; k < 15; k++) {
              state.particles.push({
                x: p.x,
                y: p.y,
                vx: (Math.random() - 0.5) * 9,
                vy: (Math.random() - 0.5) * 9,
                alpha: 1,
                size: 3 + Math.random() * 3,
                color: '#FF3131',
                decay: 0.04
              })
            }

            state.enemies.splice(i, 1)

            if (state.lives <= 0) {
              // GAME OVER
              state.gameState = 'gameover'
              setGameState('gameover')
              setScore(state.score)

              // Check High Score
              const currentHigh = parseInt(localStorage.getItem('sampleswala_rocket_highscore') || '0', 10)
              if (state.score > currentHigh) {
                localStorage.setItem('sampleswala_rocket_highscore', String(state.score))
                setHighScore(state.score)
                setHasNewHighScore(true)
              }
              continue
            }
          }

          // Draw Enemy based on Type
          ctx.save()
          ctx.translate(e.x, e.y)
          ctx.rotate(e.rotation)

          if (e.type === 'vinyl') {
            // 💿 Retro Vinyl Record Obstacle
            ctx.shadowBlur = 8
            ctx.shadowColor = '#00FF94'
            ctx.fillStyle = '#111111'
            ctx.beginPath()
            ctx.arc(0, 0, e.radius, 0, Math.PI * 2)
            ctx.fill()
            ctx.strokeStyle = '#282828'
            ctx.lineWidth = 1.5
            ctx.beginPath()
            ctx.arc(0, 0, e.radius * 0.7, 0, Math.PI * 2)
            ctx.stroke()
            ctx.beginPath()
            ctx.arc(0, 0, e.radius * 0.45, 0, Math.PI * 2)
            ctx.stroke()

            // Vinyl Label Center
            ctx.fillStyle = '#FFE600'
            ctx.beginPath()
            ctx.arc(0, 0, e.radius * 0.28, 0, Math.PI * 2)
            ctx.fill()
            ctx.fillStyle = '#000000'
            ctx.beginPath()
            ctx.arc(0, 0, 3, 0, Math.PI * 2)
            ctx.fill()
          } else if (e.type === 'asteroid') {
            // 🪨 Space Asteroid Rock
            ctx.fillStyle = e.color
            ctx.strokeStyle = '#52525b'
            ctx.lineWidth = 1.5
            ctx.beginPath()
            ctx.moveTo(e.radius, 0)
            for (let a = 0; a < 8; a++) {
              const angle = (a / 8) * Math.PI * 2
              const r = e.radius * (0.8 + (a % 2 === 0 ? 0.25 : -0.15))
              ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r)
            }
            ctx.closePath()
            ctx.fill()
            ctx.stroke()
          } else if (e.type === 'glitch') {
            // ⚡ Soundwave Glitch Orb
            ctx.shadowBlur = 12
            ctx.shadowColor = '#FF5C00'
            ctx.fillStyle = '#FF5C00'
            ctx.beginPath()
            ctx.arc(0, 0, e.radius, 0, Math.PI * 2)
            ctx.fill()

            // Glitch Wave Line
            ctx.strokeStyle = '#FFFFFF'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(-e.radius * 0.6, 0)
            ctx.lineTo(-e.radius * 0.2, -e.radius * 0.5)
            ctx.lineTo(e.radius * 0.2, e.radius * 0.5)
            ctx.lineTo(e.radius * 0.6, 0)
            ctx.stroke()
          } else if (e.type === 'powerup') {
            // 💎 Golden Beat Crystal Powerup
            ctx.shadowBlur = 14
            ctx.shadowColor = '#FFE600'
            ctx.fillStyle = '#FFE600'
            ctx.beginPath()
            ctx.moveTo(0, -e.radius)
            ctx.lineTo(e.radius * 0.8, 0)
            ctx.lineTo(0, e.radius)
            ctx.lineTo(-e.radius * 0.8, 0)
            ctx.closePath()
            ctx.fill()

            ctx.strokeStyle = '#FFFFFF'
            ctx.lineWidth = 1.5
            ctx.stroke()
          }

          ctx.restore()
        }

        // 7. PARTICLES UPDATE
        for (let i = state.particles.length - 1; i >= 0; i--) {
          const pt = state.particles[i]
          pt.x += pt.vx
          pt.y += pt.vy
          pt.alpha -= pt.decay

          if (pt.alpha <= 0) {
            state.particles.splice(i, 1)
            continue
          }

          ctx.fillStyle = pt.color
          ctx.globalAlpha = Math.max(0, pt.alpha)
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = 1
        }

        // 8. FLOATING SCORE TEXTS
        for (let i = state.floatingTexts.length - 1; i >= 0; i--) {
          const ft = state.floatingTexts[i]
          ft.yOffset -= 1.2
          ft.alpha -= 0.02

          if (ft.alpha <= 0) {
            state.floatingTexts.splice(i, 1)
            continue
          }

          ctx.save()
          ctx.globalAlpha = Math.max(0, ft.alpha)
          ctx.fillStyle = ft.color
          ctx.font = 'bold 12px monospace'
          ctx.textAlign = 'center'
          ctx.fillText(ft.text, ft.x, ft.y + ft.yOffset)
          ctx.restore()
        }

        // 9. DRAW ROCKET SHIP (PLAYER)
        if (p.invulnerable % 8 < 4) {
          ctx.save()
          ctx.translate(p.x, p.y)

          // Rocket Thruster Fire Flame
          const flameLength = 16 + Math.sin(p.flameTick * 0.6) * 7
          const isPowered = state.powerupTimer > 0

          ctx.shadowBlur = 15
          ctx.shadowColor = isPowered ? '#FFE600' : '#00E5FF'

          // Outer Thruster Flame
          ctx.fillStyle = isPowered ? '#FF5C00' : '#0074E4'
          ctx.beginPath()
          ctx.moveTo(-9, 20)
          ctx.lineTo(0, 20 + flameLength * 1.3)
          ctx.lineTo(9, 20)
          ctx.closePath()
          ctx.fill()

          // Inner Hot Core Flame
          ctx.fillStyle = isPowered ? '#FFE600' : '#FFFFFF'
          ctx.beginPath()
          ctx.moveTo(-5, 20)
          ctx.lineTo(0, 20 + flameLength * 0.7)
          ctx.lineTo(5, 20)
          ctx.closePath()
          ctx.fill()

          // Rocket Wings
          ctx.fillStyle = '#27272a'
          ctx.beginPath()
          ctx.moveTo(0, -22)
          ctx.lineTo(22, 18)
          ctx.lineTo(14, 20)
          ctx.lineTo(0, 16)
          ctx.lineTo(-14, 20)
          ctx.lineTo(-22, 18)
          ctx.closePath()
          ctx.fill()

          // Rocket Body (Fuselage)
          ctx.fillStyle = '#FFFFFF'
          ctx.beginPath()
          ctx.moveTo(0, -26)
          ctx.lineTo(10, 16)
          ctx.lineTo(-10, 16)
          ctx.closePath()
          ctx.fill()

          // Wing Plasma Cannons
          ctx.fillStyle = isPowered ? '#FFE600' : '#00FF94'
          ctx.fillRect(-17, 4, 3, 10)
          ctx.fillRect(14, 4, 3, 10)

          // Cockpit Visor
          ctx.fillStyle = isPowered ? '#FF5C00' : '#0074E4'
          ctx.beginPath()
          ctx.ellipse(0, -5, 4.5, 9, 0, 0, Math.PI * 2)
          ctx.fill()

          // Energy Shield Aura (when invulnerable)
          if (p.invulnerable > 0) {
            ctx.strokeStyle = 'rgba(0, 255, 148, 0.7)'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.arc(0, 0, 28, 0, Math.PI * 2)
            ctx.stroke()
          }

          ctx.restore()
        }
      }

      ctx.restore()
      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <div className="w-full max-w-2xl mx-auto font-sans select-none">
      {/* HUD OVERLAY BAR */}
      <div className="bg-[#121212] border border-[#262626] border-b-0 rounded-t-2xl p-3 sm:p-4 flex items-center justify-between gap-3 text-xs font-mono">
        {/* Score & Combo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#181818] border border-[#2a2a2a] px-3 py-1.5 rounded-lg">
            <Flame className="w-3.5 h-3.5 text-studio-neon" />
            <span className="text-zinc-400">SCORE:</span>
            <span className="font-bold text-white text-sm tracking-wider">{score.toLocaleString()}</span>
          </div>

          {combo > 1 && (
            <span className="px-2 py-1 rounded bg-studio-orange/20 text-studio-orange border border-studio-orange/40 font-bold text-[11px] animate-pulse">
              {combo}X COMBO
            </span>
          )}
        </div>

        {/* High Score & Lives & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Shields / Lives */}
          <div className="flex items-center gap-1 bg-[#181818] border border-[#2a2a2a] px-2.5 py-1.5 rounded-lg">
            <Shield className="w-3.5 h-3.5 text-zinc-400 mr-1" />
            {[1, 2, 3].map(heartIdx => (
              <span
                key={heartIdx}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  heartIdx <= lives
                    ? 'bg-studio-neon shadow-[0_0_8px_#00FF94]'
                    : 'bg-zinc-700'
                }`}
              />
            ))}
          </div>

          {/* High Score */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#181818] border border-[#2a2a2a] px-3 py-1.5 rounded-lg">
            <Trophy className="w-3.5 h-3.5 text-studio-yellow" />
            <span className="text-zinc-400">BEST:</span>
            <span className="font-bold text-studio-yellow">{highScore.toLocaleString()}</span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-1.5 rounded-lg bg-[#181818] border border-[#2a2a2a] text-zinc-300 hover:text-white hover:border-zinc-500 transition-all cursor-pointer"
            title={soundOn ? 'Mute Game Sound' : 'Unmute Sound'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-studio-neon" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
          </button>
        </div>
      </div>

      {/* GAME CANVAS CONTAINER */}
      <div
        ref={containerRef}
        className="relative w-full h-[460px] sm:h-[540px] bg-[#0a0a0a] border border-[#262626] overflow-hidden cursor-crosshair"
      >
        <canvas
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          className="w-full h-full block touch-none"
        />

        {/* READY / START OVERLAY */}
        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20 space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#141414] border border-white/20 shadow-2xl animate-bounce">
              <Sparkles className="w-8 h-8 text-studio-neon" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold font-luckiest-guy tracking-wider text-white uppercase">
                SamplesWala Rocket Shooter
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm font-mono">
                Dodge asteroids, destroy retro vinyl records, collect golden beat crystals, and set a record score!
              </p>
            </div>

            <button
              type="button"
              onClick={startGame}
              className="px-6 py-3 rounded-xl bg-studio-neon text-black font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(0,255,148,0.4)] cursor-pointer flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-black fill-black" />
              LAUNCH ROCKET (START)
            </button>

            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-zinc-400 pt-2">
              <span className="flex items-center gap-1.5">
                <MousePointer className="w-3.5 h-3.5 text-zinc-300" />
                Mouse/Touch to Move
              </span>
              <span>•</span>
              <span>Space / Click to Shoot</span>
              <span>•</span>
              <span>A / D or Arrow Keys</span>
            </div>
          </div>
        )}

        {/* GAME OVER OVERLAY */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20 space-y-4 animate-fadeIn">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded bg-studio-red/20 text-studio-red border border-studio-red/40 font-bold inline-block">
                MISSION TERMINATED
              </span>
              <h3 className="text-3xl font-bold font-luckiest-guy tracking-wider text-white pt-1">
                GAME OVER
              </h3>
            </div>

            {/* Score Comparison Box */}
            <div className="bg-[#141414] border border-[#2a2a2a] p-4 rounded-xl w-full max-w-xs space-y-2 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">YOUR SCORE:</span>
                <span className="font-bold text-white text-base">{score.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-1 border-t border-[#222222]">
                <span className="text-zinc-400">HIGH SCORE:</span>
                <span className="font-bold text-studio-yellow text-sm">{highScore.toLocaleString()}</span>
              </div>

              {hasNewHighScore && (
                <div className="pt-2 text-studio-neon font-bold text-xs flex items-center justify-center gap-1.5 animate-pulse">
                  <Trophy className="w-4 h-4 text-studio-yellow" />
                  NEW HIGH SCORE ACHIEVED!
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={startGame}
              className="px-6 py-3 rounded-xl bg-white text-black font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-black" />
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>

      {/* MOBILE TOUCH CONTROLS BAR */}
      <div className="bg-[#121212] border border-[#262626] border-t-0 rounded-b-2xl p-3 flex items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
          <Smartphone className="w-4 h-4 text-zinc-400" />
          <span className="hidden sm:inline">Drag finger or move mouse to steer rocket.</span>
          <span className="sm:hidden">Swipe to steer rocket</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto-Fire Toggle (Very popular for mobile & casual players) */}
          <button
            type="button"
            onClick={() => {
              const next = !autoFire
              setAutoFire(next)
              stateRef.current.autoFire = next
            }}
            className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
              autoFire
                ? 'bg-studio-neon text-black border-studio-neon shadow-sm'
                : 'bg-[#181818] border-[#2a2a2a] text-zinc-400 hover:text-white'
            }`}
          >
            AUTO-FIRE: {autoFire ? 'ON' : 'OFF'}
          </button>

          {/* Mobile Tap to Fire Laser Button */}
          <button
            type="button"
            onPointerDown={() => {
              stateRef.current.keys.fire = true
              if (stateRef.current.gameState !== 'playing') startGame()
            }}
            onPointerUp={() => {
              stateRef.current.keys.fire = false
            }}
            className="px-5 py-2 rounded-lg bg-white text-black font-bold text-xs uppercase hover:bg-zinc-200 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            FIRE LASER
          </button>
        </div>
      </div>
    </div>
  )
}

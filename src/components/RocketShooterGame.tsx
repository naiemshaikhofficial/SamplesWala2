'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import {
  Trophy,
  Volume2,
  VolumeX,
  RotateCcw,
  Zap,
  Flame,
  Heart,
  HeartCrack,
  Pause,
  Play,
  Crosshair
} from 'lucide-react'

// ============================================================================
// 1. WEB AUDIO SYNTHESIZER (ZERO EXTERNAL MP3s NEEDED)
// ============================================================================
class ArcadeAudioSynthesizer {
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
    osc.frequency.setValueAtTime(980, now)
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.08)

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.09)
  }

  playTripleLaser() {
    if (!this.enabled) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
      ;[1180, 960, 780].forEach(freq => {
        const osc = this.ctx!.createOscillator()
        const gain = this.ctx!.createGain()

        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(freq, now)
        osc.frequency.exponentialRampToValueAtTime(130, now + 0.1)

        gain.gain.setValueAtTime(0.06, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)

        osc.connect(gain)
        gain.connect(this.ctx!.destination)

        osc.start(now)
        osc.stop(now + 0.11)
      })
  }

  playMissile() {
    if (!this.enabled) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(280, now)
    osc.frequency.linearRampToValueAtTime(680, now + 0.14)

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.15)
  }

  playOverdrive() {
    if (!this.enabled) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(1400, now)
    osc.frequency.exponentialRampToValueAtTime(340, now + 0.06)

    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.07)
  }

  playEnemyShot() {
    if (!this.enabled) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(520, now)
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.13)

    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.14)
  }

  playNearMiss() {
    if (!this.enabled) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(1600, now)
    osc.frequency.linearRampToValueAtTime(2200, now + 0.06)

    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.07)
  }

  playExplosion() {
    if (!this.enabled) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const bufferSize = this.ctx.sampleRate * 0.26
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(650, now)
    filter.frequency.exponentialRampToValueAtTime(50, now + 0.26)

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.24, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    noise.start(now)
    noise.stop(now + 0.27)
  }

  playBossExplosion() {
    if (!this.enabled) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(180, now)
    osc.frequency.exponentialRampToValueAtTime(25, now + 1.2)

    gain.gain.setValueAtTime(0.5, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 1.25)
  }

  playNuke() {
    if (!this.enabled) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(250, now)
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.85)

    gain.gain.setValueAtTime(0.42, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.9)
  }

  playBrokenHeart() {
    if (!this.enabled) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
      ;[380, 220, 130].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator()
        const gain = this.ctx!.createGain()

        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(freq, now + idx * 0.03)
        osc.frequency.linearRampToValueAtTime(45, now + idx * 0.03 + 0.32)

        gain.gain.setValueAtTime(0.26, now + idx * 0.03)
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.03 + 0.32)

        osc.connect(gain)
        gain.connect(this.ctx!.destination)

        osc.start(now + idx * 0.03)
        osc.stop(now + idx * 0.03 + 0.33)
      })
  }

  playHeartRepair() {
    if (!this.enabled) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const notes = [440, 554.37, 659.25, 880, 1108.73]
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.05)

      gain.gain.setValueAtTime(0.14, now + idx * 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, now + (idx + 1) * 0.05 + 0.08)

      osc.connect(gain)
      gain.connect(this.ctx!.destination)

      osc.start(now + idx * 0.05)
      osc.stop(now + (idx + 1) * 0.05 + 0.1)
    })
  }

  playPowerup() {
    if (!this.enabled) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now + idx * 0.05)

      gain.gain.setValueAtTime(0.12, now + idx * 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, now + (idx + 1) * 0.05 + 0.06)

      osc.connect(gain)
      gain.connect(this.ctx!.destination)

      osc.start(now + idx * 0.05)
      osc.stop(now + (idx + 1) * 0.05 + 0.07)
    })
  }

  playWaveClear() {
    if (!this.enabled) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const notes = [392, 523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(freq, now + idx * 0.07)

      gain.gain.setValueAtTime(0.14, now + idx * 0.07)
      gain.gain.exponentialRampToValueAtTime(0.001, now + (idx + 1) * 0.07 + 0.15)

      osc.connect(gain)
      gain.connect(this.ctx!.destination)

      osc.start(now + idx * 0.07)
      osc.stop(now + (idx + 1) * 0.07 + 0.16)
    })
  }

  playBossAlarm() {
    if (!this.enabled) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(220, now)
    osc.frequency.setValueAtTime(440, now + 0.14)
    osc.frequency.setValueAtTime(220, now + 0.28)
    osc.frequency.setValueAtTime(440, now + 0.42)

    gain.gain.setValueAtTime(0.22, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.65)
  }
}

const sfx = new ArcadeAudioSynthesizer()

// ============================================================================
// 2. TYPES & WAVE DEFINITIONS
// ============================================================================
export type AbilityType = 'triple_laser' | 'homing_missiles' | 'nuke' | 'slow_mo' | 'heart_repair' | 'overdrive'

interface WaveConfig {
  wave: number
  title: string
  description: string
  enemiesCount: number
  spawnTypes: ('scout' | 'interceptor' | 'sawblade' | 'asteroid' | 'alien_gunship')[]
  isBossWave?: boolean
  baseBpm: number
}

const WAVES: WaveConfig[] = [
  { wave: 1, title: 'WAVE 01: SCOUT SQUADRON', description: 'V-Formation Drone Incursion', enemiesCount: 8, spawnTypes: ['scout'], baseBpm: 120 },
  { wave: 2, title: 'WAVE 02: INTERCEPTOR STRIKE', description: 'Gunships & Fast Interceptors', enemiesCount: 12, spawnTypes: ['scout', 'interceptor', 'alien_gunship'], baseBpm: 135 },
  { wave: 3, title: 'WAVE 03: SERRATED SWARM', description: 'Curving Sawblade Cutters', enemiesCount: 14, spawnTypes: ['sawblade', 'scout'], baseBpm: 155 },
  { wave: 4, title: 'WAVE 04: ASTEROID RAIN', description: 'Heavy Magma Meteors', enemiesCount: 16, spawnTypes: ['asteroid', 'sawblade', 'interceptor'], baseBpm: 175 },
  { wave: 5, title: 'WAVE 05: CYBER ARMADA', description: 'Elite Mixed Vanguard Squadron', enemiesCount: 20, spawnTypes: ['alien_gunship', 'interceptor', 'sawblade', 'scout'], baseBpm: 205 },
  { wave: 6, title: 'WAVE 06: DREADNOUGHT MOTHERSHIP', description: 'FLAGSHIP BOSS BATTLE', enemiesCount: 1, spawnTypes: ['alien_gunship'], isBossWave: true, baseBpm: 235 }
]

export function RocketShooterGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // React State for HUD & Overlays
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'paused' | 'gameover' | 'victory'>('ready')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [combo, setCombo] = useState(1)
  const [currentWave, setCurrentWave] = useState(1)
  const [waveTitle, setWaveTitle] = useState(WAVES[0].title)
  const [weaponLevel, setWeaponLevel] = useState(1)
  const [currentBpm, setCurrentBpm] = useState(120)
  const [tempoMode, setTempoMode] = useState<'cruise' | 'surge' | 'breather'>('cruise')
  const [soundOn, setSoundOn] = useState(true)
  const [autoFire, setAutoFire] = useState(false)
  const [hasNewHighScore, setHasNewHighScore] = useState(false)

  // End of run stats
  const [endStats, setEndStats] = useState({
    finalScore: 0,
    bestCombo: 1,
    enemiesDestroyed: 0,
    wavesCleared: 0,
    nearMisses: 0,
    weaponLevelReached: 1
  })

  // Game Engine Internal State (High performance 60FPS ref)
  const stateRef = useRef({
    score: 0,
    lives: 3,
    combo: 1,
    bestCombo: 1,
    hitStreak: 0,
    lastHitTime: 0,
    screenShake: 0,
    redVignette: 0,
    hitStop: 0,
    gameState: 'ready' as 'ready' | 'playing' | 'paused' | 'gameover' | 'victory',

    // Stats
    enemiesDestroyed: 0,
    wavesCleared: 0,
    nearMisses: 0,

    // Wave Engine
    currentWave: 1,
    waveTitle: WAVES[0].title,
    waveRemainingEnemies: WAVES[0].enemiesCount,
    waveTotalSpawned: 0,
    waveState: 'active' as 'active' | 'cleared' | 'boss' | 'victory',
    waveTransitionTimer: 0,

    // Permanent Weapon Level (1 to 5)
    weaponLevel: 1,

    // Dynamic Tempo / Speed Waves
    tempoCycleTick: 0,
    tempoMode: 'cruise' as 'cruise' | 'surge' | 'breather',
    speedMultiplier: 1.0,
    currentBpm: 120,

    // Active Temporary Ability Timers
    tripleLaserTimer: 0,
    homingMissileTimer: 0,
    slowMoTimer: 0,
    overdriveTimer: 0,
    missileFireTick: 0,

    // Player Rocket Physics (Vector physics, smooth inertia, 2D free movement)
    player: {
      x: 300,
      y: 500,
      vx: 0,
      vy: 0,
      targetX: 300,
      targetY: 500,
      tilt: 0,
      maxSpeedX: 8.8,
      maxSpeedY: 6.6,
      acceleration: 1.25,
      braking: 0.82,
      pointerResponsiveness: 0.22,
      pointerDeadZone: 4,
      width: 44,
      height: 52,
      hitboxRadius: 10,
      invulnerable: 0,
      flameTime: 0,
      controlMode: 'keyboard' as 'keyboard' | 'pointer'
    },

    // Lasers & Missiles
    lasers: [] as Array<{
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      color: string
      isOverdrive?: boolean
      isHeavy?: boolean
      isPiercing?: boolean
      pierceHits?: number
      hitEnemyIds?: number[]
    }>,
    missiles: [] as Array<{
      x: number
      y: number
      vx: number
      vy: number
      angle?: number
      targetId: number | null
      life: number
    }>,

    // Hostile Projectiles
    enemyLasers: [] as Array<{
      id: number
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      color: string
      nearMissChecked?: boolean
    }>,

    // Enemies
    enemies: [] as Array<{
      id: number
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      category: 'hazard' | 'powerup'
      type: 'scout' | 'interceptor' | 'asteroid' | 'sawblade' | 'alien_gunship' | 'powerup'
      powerupType?: AbilityType
      powerupLabel?: string
      hp: number
      maxHp: number
      rotation: number
      rotSpeed: number
      color: string
      hitFlash: number
      shootCooldown?: number
      aiPhase?: number
      aiTimer?: number
      targetPosX?: number
      targetPosY?: number
      aimTelegraph?: number
      diveTargetX?: number
    }>,

    // Dreadnought Boss
    boss: null as null | {
      x: number
      y: number
      targetX: number
      targetY: number
      vx: number
      width: number
      height: number
      hp: number
      maxHp: number
      phase: 1 | 2 | 3
      shootCooldown: number
      specialCooldown: number
      laserSweepCooldown: number
      laserSweepActive: boolean
      laserSweepAngle: number
      laserTelegraph: number
      hitFlash: number
      rotation: number
      coreGlow: number
    },

    // Expanding Nuke Shockwaves
    shockwaves: [] as Array<{
      x: number
      y: number
      radius: number
      maxRadius: number
      alpha: number
      color: string
    }>,

    // Broken Heart Shatter Effect
    brokenHearts: [] as Array<{
      x: number
      y: number
      vy: number
      alpha: number
    }>,

    // Particles (Three tiers: micro sparks, fragments, macro rings)
    particles: [] as Array<{
      x: number
      y: number
      vx: number
      vy: number
      alpha: number
      size: number
      color: string
      decay: number
      drag?: number
      gravity?: number
    }>,
    embers: [] as Array<{
      x: number
      y: number
      vx: number
      vy: number
      alpha: number
      size: number
      color: string
    }>,

    // Parallax Starfield & Grid
    stars: [] as Array<{
      x: number
      y: number
      speed: number
      size: number
      alpha: number
      layer: number
    }>,
    gridOffset: 0,

    // Floating Notification Texts
    floatingTexts: [] as Array<{
      x: number
      y: number
      text: string
      color: string
      alpha: number
      yOffset: number
      scale: number
    }>,

    pointer: {
      active: false,
      offsetX: 0,
      offsetY: 0
    },
    fireCooldown: 0,
    spawnCooldown: 0,
    missileCooldown: 0,
    powerupCooldown: 12,
    comboTimer: 2.5,
    waveElapsedSec: 0,
    flameEmberCooldown: 0,
    lastTime: 0,
    keys: { left: false, right: false, up: false, down: false, fire: false, precision: false },
    autoFire: true
  })

  // Load Saved High Score from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sampleswala_rocket_highscore')
      if (saved) {
        setHighScore(parseInt(saved, 10) || 0)
      }
    }
  }, [])

  const toggleSound = () => {
    sfx.enabled = !soundOn
    setSoundOn(!soundOn)
  }

  // Toggle Pause
  const togglePause = useCallback(() => {
    if (stateRef.current.gameState === 'playing') {
      stateRef.current.gameState = 'paused'
      setGameState('paused')
    } else if (stateRef.current.gameState === 'paused') {
      stateRef.current.gameState = 'playing'
      stateRef.current.lastTime = performance.now()
      setGameState('playing')
    }
  }, [])

  // Auto-pause when user changes tab or window loses visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && stateRef.current.gameState === 'playing') {
        stateRef.current.gameState = 'paused'
        setGameState('paused')
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Handle Dynamic Canvas Resize (Transform accumulation bug fixed via setTransform)
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
      // Direct setTransform fixes the scale accumulation bug on window resize!
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    // 3-Layer Parallax Starfield
    const stars = []
    const count = Math.floor((rect.width * rect.height) / 2800)
    for (let i = 0; i < count; i++) {
      const layer = Math.random() < 0.5 ? 1 : Math.random() < 0.8 ? 2 : 3
      stars.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        speed: layer === 1 ? 1.1 : layer === 2 ? 2.6 : 5.2,
        size: layer === 1 ? 1.0 : layer === 2 ? 1.8 : 2.5,
        alpha: layer === 1 ? 0.35 : layer === 2 ? 0.65 : 0.95,
        layer
      })
    }
    stateRef.current.stars = stars

    stateRef.current.player.x = rect.width / 2
    stateRef.current.player.y = rect.height - 80
    stateRef.current.player.targetX = rect.width / 2
    stateRef.current.player.targetY = rect.height - 80
  }, [])

  // Start / Restart Game
  const startGame = useCallback(() => {
    const container = containerRef.current
    const rect = container ? container.getBoundingClientRect() : { width: 600, height: 600 }

    stateRef.current.score = 0
    stateRef.current.lives = 3
    stateRef.current.combo = 1
    stateRef.current.bestCombo = 1
    stateRef.current.hitStreak = 0
    stateRef.current.screenShake = 0
    stateRef.current.redVignette = 0
    stateRef.current.hitStop = 0

    stateRef.current.enemiesDestroyed = 0
    stateRef.current.wavesCleared = 0
    stateRef.current.nearMisses = 0

    stateRef.current.currentWave = 1
    stateRef.current.waveTitle = WAVES[0].title
    stateRef.current.waveRemainingEnemies = WAVES[0].enemiesCount
    stateRef.current.waveTotalSpawned = 0
    stateRef.current.waveState = 'active'
    stateRef.current.waveTransitionTimer = 0

    stateRef.current.weaponLevel = 1
    stateRef.current.tempoCycleTick = 0
    stateRef.current.tempoMode = 'cruise'
    stateRef.current.speedMultiplier = 1.0
    stateRef.current.currentBpm = WAVES[0].baseBpm

    stateRef.current.tripleLaserTimer = 0
    stateRef.current.homingMissileTimer = 0
    stateRef.current.slowMoTimer = 0
    stateRef.current.overdriveTimer = 0

    stateRef.current.enemies = []
    stateRef.current.boss = null
    stateRef.current.lasers = []
    stateRef.current.missiles = []
    stateRef.current.enemyLasers = []
    stateRef.current.particles = []
    stateRef.current.embers = []
    stateRef.current.brokenHearts = []
    stateRef.current.shockwaves = []
    stateRef.current.floatingTexts = []

    stateRef.current.fireCooldown = 0
    stateRef.current.spawnCooldown = 0.3
    stateRef.current.missileCooldown = 0
    stateRef.current.powerupCooldown = 12
    stateRef.current.autoFire = true
    stateRef.current.comboTimer = 2.5
    stateRef.current.waveElapsedSec = 0
    stateRef.current.flameEmberCooldown = 0
    stateRef.current.lastTime = performance.now()
    stateRef.current.gameState = 'playing'

    stateRef.current.player.x = rect.width / 2
    stateRef.current.player.y = rect.height - 80
    stateRef.current.player.targetX = rect.width / 2
    stateRef.current.player.targetY = rect.height - 80
    stateRef.current.player.vx = 0
    stateRef.current.player.vy = 0
    stateRef.current.player.tilt = 0
    stateRef.current.player.controlMode = 'keyboard'
    stateRef.current.pointer.active = false
    stateRef.current.player.invulnerable = 60

    setScore(0)
    setLives(3)
    setCombo(1)
    setCurrentWave(1)
    setWaveTitle(WAVES[0].title)
    setWeaponLevel(1)
    setCurrentBpm(WAVES[0].baseBpm)
    setTempoMode('cruise')
    setHasNewHighScore(false)
    setGameState('playing')
  }, [])

  // Keyboard Listeners (WASD / Arrows for 2D, Shift for Precision, Space to shoot, Escape/P to pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA', 'a', 'A'].includes(e.code)) stateRef.current.keys.left = true
      if (['ArrowRight', 'KeyD', 'd', 'D'].includes(e.code)) stateRef.current.keys.right = true
      if (['ArrowUp', 'KeyW', 'w', 'W'].includes(e.code)) stateRef.current.keys.up = true
      if (['ArrowDown', 'KeyS', 's', 'S'].includes(e.code)) stateRef.current.keys.down = true
      if (['ShiftLeft', 'ShiftRight'].includes(e.code)) stateRef.current.keys.precision = true

      if (['Space'].includes(e.code)) {
        e.preventDefault()
        stateRef.current.keys.fire = true
        if (stateRef.current.gameState === 'ready' || stateRef.current.gameState === 'gameover') {
          startGame()
        }
      }

      if (['Escape', 'KeyP'].includes(e.code)) {
        e.preventDefault()
        togglePause()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA', 'a', 'A'].includes(e.code)) stateRef.current.keys.left = false
      if (['ArrowRight', 'KeyD', 'd', 'D'].includes(e.code)) stateRef.current.keys.right = false
      if (['ArrowUp', 'KeyW', 'w', 'W'].includes(e.code)) stateRef.current.keys.up = false
      if (['ArrowDown', 'KeyS', 's', 'S'].includes(e.code)) stateRef.current.keys.down = false
      if (['ShiftLeft', 'ShiftRight'].includes(e.code)) stateRef.current.keys.precision = false
      if (['Space'].includes(e.code)) stateRef.current.keys.fire = false
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
  }, [resizeCanvas, startGame, togglePause])

  // Mouse & Touch Pointer Dragging (Natural offset drag + pointer capture)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const state = stateRef.current

    if (state.gameState === 'ready' || state.gameState === 'gameover') {
      startGame()
      return
    }

    try {
      canvas.setPointerCapture(e.pointerId)
    } catch { }

    state.pointer.active = true
    state.player.controlMode = 'pointer'
    state.pointer.offsetX = state.player.x - x
    state.pointer.offsetY = state.player.y - y

    state.player.targetX = Math.max(26, Math.min(rect.width - 26, x + state.pointer.offsetX))
    state.player.targetY = Math.max(50, Math.min(rect.height - 40, y + state.pointer.offsetY))
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const state = stateRef.current
    if (!state.pointer.active) return // Guard: do not override keyboard unless actively dragging

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    state.player.controlMode = 'pointer'
    state.player.targetX = Math.max(26, Math.min(rect.width - 26, x + state.pointer.offsetX))
    state.player.targetY = Math.max(50, Math.min(rect.height - 40, y + state.pointer.offsetY))
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const state = stateRef.current
    state.pointer.active = false
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch { }
  }

  // Trigger Broken Heart Damage (Heart Split + Ruby Crystals + Screen Rumble)
  const triggerBrokenHeartDamage = (x: number, y: number) => {
    const state = stateRef.current
    sfx.playBrokenHeart()
    state.lives--
    state.combo = 1
    state.hitStreak = 0
    state.screenShake = 2.4
    state.redVignette = 1.0
    state.hitStop = 0.065 // 65ms micro freeze for impact feel!
    state.player.invulnerable = 85
    setLives(state.lives)
    setCombo(1)

    // Floating Broken Heart icon
    state.brokenHearts.push({
      x,
      y: y - 30,
      vy: -3.5,
      alpha: 1.0
    })

    // Red shard particles
    for (let k = 0; k < 28; k++) {
      state.particles.push({
        x,
        y: y - 15,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.5) * 14,
        alpha: 1,
        size: 2.5 + Math.random() * 4,
        color: '#FF2A6D',
        decay: 0.032
      })
    }

    state.floatingTexts.push({
      x,
      y: y - 45,
      text: '💔 BROKEN HEART! (-1 LIFE)',
      color: '#FF2A6D',
      alpha: 1,
      yOffset: 0,
      scale: 1.3
    })

    if (state.lives <= 0) {
      state.gameState = 'gameover'
      setGameState('gameover')
      setScore(state.score)

      setEndStats({
        finalScore: state.score,
        bestCombo: state.bestCombo,
        enemiesDestroyed: state.enemiesDestroyed,
        wavesCleared: state.wavesCleared,
        nearMisses: state.nearMisses,
        weaponLevelReached: state.weaponLevel
      })

      const currentHigh = parseInt(localStorage.getItem('sampleswala_rocket_highscore') || '0', 10)
      if (state.score > currentHigh) {
        localStorage.setItem('sampleswala_rocket_highscore', String(state.score))
        setHighScore(state.score)
        setHasNewHighScore(true)
      }
    }
  }

  // Trigger Full Screen Bass Drop Nuke
  const triggerNuke = (x: number, y: number) => {
    const state = stateRef.current
    sfx.playNuke()
    state.screenShake = 2.6
    state.hitStop = 0.08 // 80ms micro freeze

    state.shockwaves.push({
      x,
      y,
      radius: 20,
      maxRadius: 850,
      alpha: 1,
      color: '#FF6B00'
    })

    let destroyedCount = 0
    state.enemies.forEach(e => {
      if (e.category === 'hazard') {
        destroyedCount++
        state.enemiesDestroyed++
        state.score += 250 * state.combo
        for (let k = 0; k < 14; k++) {
          state.particles.push({
            x: e.x,
            y: e.y,
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 0.5) * 12,
            alpha: 1,
            size: 3 + Math.random() * 4,
            color: '#FFE600',
            decay: 0.035
          })
        }
      }
    })

    if (state.boss) {
      state.boss.hp = Math.max(1, state.boss.hp - 40)
      state.boss.hitFlash = 12
    }

    state.enemies = state.enemies.filter(e => e.category === 'powerup')
    state.enemyLasers = []

    state.floatingTexts.push({
      x,
      y: y - 30,
      text: `💣 BASS DROP NUKE! +${destroyedCount * 250 * state.combo}`,
      color: '#FF6B00',
      alpha: 1,
      yOffset: 0,
      scale: 1.4
    })
  }

  // 60FPS Game Loop Engine with Clamped Delta-Time
  useEffect(() => {
    let animId: number
    const canvas = canvasRef.current
    if (!canvas) return

    let lastReactSync = performance.now()

    const loop = (timestamp: number) => {
      const state = stateRef.current
      const container = containerRef.current

      if (state.gameState === 'paused') {
        animId = requestAnimationFrame(loop)
        return
      }

      if (!canvas || !container) return
      const rect = container.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Delta Time calculation (seconds & normalized 60fps dt)
      if (!state.lastTime) state.lastTime = timestamp
      const deltaSec = Math.min((timestamp - state.lastTime) / 1000, 0.05)
      const rawDt = (timestamp - state.lastTime) / 16.6667
      const dt = Math.min(Math.max(rawDt, 0.2), 2.5)
      state.lastTime = timestamp

      // Hit-stop micro freeze check (seconds-based)
      if (state.hitStop > 0) {
        state.hitStop -= deltaSec
        animId = requestAnimationFrame(loop)
        return
      }

      // Camera Shake Translation
      ctx.save()
      if (state.screenShake > 0) {
        const sx = (Math.random() - 0.5) * state.screenShake * 7.5
        const sy = (Math.random() - 0.5) * state.screenShake * 7.5
        ctx.translate(sx, sy)
        state.screenShake = Math.max(0, state.screenShake - 0.09 * dt)
      }

      // 1. DEEP SPACE BACKGROUND WITH MOVING CYBER GRID
      ctx.fillStyle = '#050507'
      ctx.fillRect(0, 0, width, height)

      // Scrolling Perspective Grid Floor
      state.gridOffset = (state.gridOffset + 3.0 * state.speedMultiplier * dt) % 40
      ctx.save()
      ctx.strokeStyle = 'rgba(0, 255, 148, 0.045)'
      ctx.lineWidth = 1
      for (let y = height * 0.38 + state.gridOffset; y < height; y += 40) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }
      const vanX = width / 2
      const vanY = height * 0.35
      for (let x = -width; x < width * 2; x += 75) {
        ctx.beginPath()
        ctx.moveTo(vanX, vanY)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      ctx.restore()

      // 2. WAVE ENGINE & LEVEL PROGRESSION
      if (state.gameState === 'playing') {
        const waveIdx = Math.min(state.currentWave - 1, WAVES.length - 1)
        const waveCfg = WAVES[waveIdx]

        // Check if wave is cleared
        if (state.waveState === 'active') {
          if (!waveCfg.isBossWave && state.waveRemainingEnemies <= 0 && state.enemies.filter(e => e.category === 'hazard').length === 0) {
            // WAVE CLEARED!
            state.waveState = 'cleared'
            state.wavesCleared++
            state.waveTransitionTimer = 90 // 1.5 seconds breather
            sfx.playWaveClear()

            state.floatingTexts.push({
              x: width / 2,
              y: height * 0.4,
              text: `✨ ${waveCfg.title} CLEARED!`,
              color: '#00FF94',
              alpha: 1,
              yOffset: 0,
              scale: 1.5
            })

            // Reward weapon level upgrade on wave clears!
            if (state.weaponLevel < 5 && (state.currentWave === 2 || state.currentWave === 4)) {
              state.weaponLevel++
              setWeaponLevel(state.weaponLevel)
              state.floatingTexts.push({
                x: width / 2,
                y: height * 0.48,
                text: `⚡ WEAPON UPGRADE: LEVEL ${state.weaponLevel}!`,
                color: '#FFE600',
                alpha: 1,
                yOffset: 0,
                scale: 1.3
              })
            }
          }
        } else if (state.waveState === 'cleared') {
          state.waveTransitionTimer -= dt
          if (state.waveTransitionTimer <= 0) {
            // Advance to next wave
            state.currentWave++
            const nextWaveIdx = Math.min(state.currentWave - 1, WAVES.length - 1)
            const nextWaveCfg = WAVES[nextWaveIdx]

            state.waveTitle = nextWaveCfg.title
            state.waveRemainingEnemies = nextWaveCfg.enemiesCount
            state.waveTotalSpawned = 0
            state.waveState = nextWaveCfg.isBossWave ? 'boss' : 'active'
            state.waveElapsedSec = 0
            state.currentBpm = nextWaveCfg.baseBpm

            setCurrentWave(state.currentWave)
            setWaveTitle(nextWaveCfg.title)

            // Spawn Dreadnought Boss on Boss Wave
            if (nextWaveCfg.isBossWave && !state.boss) {
              sfx.playBossAlarm()
              state.boss = {
                x: width / 2,
                y: -120,
                targetX: width / 2,
                targetY: 95,
                vx: 2.2,
                width: 145,
                height: 80,
                hp: 160,
                maxHp: 160,
                phase: 1,
                shootCooldown: 50,
                specialCooldown: 170,
                laserSweepCooldown: 320,
                laserSweepActive: false,
                laserSweepAngle: -0.6,
                laserTelegraph: 0,
                hitFlash: 0,
                rotation: 0,
                coreGlow: 0
              }
            }
          }
        } else if (state.waveState === 'victory') {
          state.waveTransitionTimer -= dt
          if (state.waveTransitionTimer <= 0 && state.gameState === 'playing') {
            state.gameState = 'victory'
            setGameState('victory')
            setEndStats({
              finalScore: state.score,
              bestCombo: state.bestCombo,
              enemiesDestroyed: state.enemiesDestroyed,
              wavesCleared: state.wavesCleared,
              nearMisses: state.nearMisses,
              weaponLevelReached: state.weaponLevel
            })
            if (typeof window !== 'undefined') {
              const currentHigh = parseInt(localStorage.getItem('sampleswala_rocket_highscore') || '0', 10)
              if (state.score > currentHigh) {
                localStorage.setItem('sampleswala_rocket_highscore', state.score.toString())
                setHighScore(state.score)
                setHasNewHighScore(true)
              }
            }
          }
        }

        // Dynamic Tempo Cycle (Cruise -> Warp Surge -> Breather)
        state.tempoCycleTick += dt
        const cycleStep = state.tempoCycleTick % 1600
        const baseBpm = waveCfg.baseBpm

        if (state.slowMoTimer > 0) {
          state.slowMoTimer -= dt
          state.speedMultiplier = 0.35
          state.currentBpm = Math.round(baseBpm * 0.4)
          state.tempoMode = 'breather'
        } else {
          if (cycleStep < 750) {
            state.tempoMode = 'cruise'
            state.speedMultiplier = 1.0 + (state.currentWave - 1) * 0.22
            state.currentBpm = Math.round(baseBpm)
          } else if (cycleStep < 1180) {
            // ⚡ WARP SPEED SURGE!
            state.tempoMode = 'surge'
            state.speedMultiplier = (1.0 + (state.currentWave - 1) * 0.22) * 1.85
            state.currentBpm = Math.round(baseBpm * 1.55)
          } else {
            // 🧘 BREATHER WAVE
            state.tempoMode = 'breather'
            state.speedMultiplier = (1.0 + (state.currentWave - 1) * 0.22) * 0.75
            state.currentBpm = Math.round(baseBpm * 0.8)
          }
        }
      }

      // 3. PARALLAX STARFIELD & WARP SPEED STREAKS
      const isWarping = state.speedMultiplier > 1.6
      state.stars.forEach(star => {
        star.y += star.speed * state.speedMultiplier * dt
        if (star.y > height) {
          star.y = 0
          star.x = Math.random() * width
        }

        if (isWarping) {
          ctx.strokeStyle = star.layer === 3 ? 'rgba(0, 255, 148, 0.85)' : 'rgba(0, 229, 255, 0.45)'
          ctx.lineWidth = star.size * 1.1
          ctx.beginPath()
          ctx.moveTo(star.x, star.y)
          ctx.lineTo(star.x, star.y - star.speed * 4.5 * state.speedMultiplier)
          ctx.stroke()
        } else if (state.slowMoTimer > 0) {
          ctx.fillStyle = `rgba(191, 0, 255, ${star.alpha})`
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 1.2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      if (state.gameState === 'playing') {
        // Score Accumulation
        state.score += Math.round(1 * (state.tempoMode === 'surge' ? 2 : 1) * dt)

        // Combo Timer (2.5s simulation-time window)
        if (state.combo > 1) {
          state.comboTimer = (state.comboTimer || 2.5) - deltaSec
          if (state.comboTimer <= 0) {
            state.combo = 1
            state.hitStreak = 0
            state.comboTimer = 2.5
            setCombo(1)
          }
        }

        // Active Ability Timers
        if (state.tripleLaserTimer > 0) state.tripleLaserTimer -= dt
        if (state.homingMissileTimer > 0) state.homingMissileTimer -= dt
        if (state.overdriveTimer > 0) state.overdriveTimer -= dt

        // 4. PLAYER MOVEMENT PHYSICS (Lateral Strafe Feel + Acceleration Curve + Reverse Braking Assist)
        const p = state.player
        p.flameTime += deltaSec

        // Precision Mode (Hold Shift to slow down for bullet hell precision weaving)
        const precision = state.keys.precision
        const maxSpeedX = precision ? 5.0 : p.maxSpeedX
        const maxSpeedY = precision ? 4.0 : p.maxSpeedY

        // Keyboard Vector Input Normalization (prevents diagonal 1.414x speed advantage)
        let inputX = 0
        let inputY = 0
        if (state.keys.left) inputX -= 1
        if (state.keys.right) inputX += 1
        if (state.keys.up) inputY -= 1
        if (state.keys.down) inputY += 1

        const inputLength = Math.hypot(inputX, inputY)
        const usingKeyboard = inputLength > 0

        if (usingKeyboard) {
          p.controlMode = 'keyboard'
        }

        if (p.controlMode === 'keyboard') {
          if (usingKeyboard) {
            inputX /= inputLength
            inputY /= inputLength

            // Progressive Reverse Braking Feel: Controlled deceleration before opposite acceleration
            if ((inputX > 0 && p.vx < 0) || (inputX < 0 && p.vx > 0)) {
              p.vx *= Math.pow(0.68, dt)
            }
            if ((inputY > 0 && p.vy < 0) || (inputY < 0 && p.vy > 0)) {
              p.vy *= Math.pow(0.68, dt)
            }

            // Progressive acceleration curve (punchy start -> smooth cruising top out)
            const currentSpeed = Math.hypot(p.vx, p.vy)
            const speedRatio = Math.min(1, currentSpeed / maxSpeedX)
            const accelCurve = 0.88 + (1 - speedRatio) * 0.45

            p.vx += inputX * (p.acceleration * accelCurve) * dt
            p.vy += inputY * (p.acceleration * 0.86 * accelCurve) * dt
          } else {
            // Smooth keyboard deceleration / braking
            const damping = Math.pow(p.braking, dt)
            p.vx *= damping
            p.vy *= damping
          }
        } else if (p.controlMode === 'pointer') {
          if (!state.pointer.active) {
            // Controlled 100-150ms gentle deceleration when dragging is released
            p.vx *= Math.pow(0.85, dt)
            p.vy *= Math.pow(0.85, dt)
            if (Math.hypot(p.vx, p.vy) < 0.12) {
              p.vx = 0
              p.vy = 0
              p.controlMode = 'keyboard'
            }
          } else {
            // Tiered Pointer Steering (0-4px Deadzone, 4-25px Micro, 25-140px Cruise, 140px+ Snap)
            const dx = p.targetX - p.x
            const dy = p.targetY - p.y
            const distance = Math.hypot(dx, dy)

            if (distance <= 4) {
              // Deadzone: settle quickly without mouse jitter
              p.vx *= Math.pow(0.70, dt)
              p.vy *= Math.pow(0.70, dt)
            } else {
              const nx = dx / distance
              const ny = dy / distance

              let desiredSpeed: number
              if (distance < 25) {
                // Gentle micro dodging
                desiredSpeed = Math.min(2.8, distance * 0.12)
              } else if (distance < 140) {
                // Normal agile cruising
                desiredSpeed = 2.8 + (distance - 25) * 0.048
              } else {
                // Max snap response
                desiredSpeed = maxSpeedX
              }

              const desiredVx = nx * Math.min(maxSpeedX, desiredSpeed)
              const desiredVy = ny * Math.min(maxSpeedY, desiredSpeed * 0.85)

              const steering = Math.min(1, 0.35 * dt)
              p.vx += (desiredVx - p.vx) * steering
              p.vy += (desiredVy - p.vy) * steering
            }
          }
        }

        // Lateral Speed Vector Clamping (Snappy lateral horizontal evasion, controlled vertical depth)
        if (Math.abs(p.vx) > maxSpeedX) {
          p.vx = Math.sign(p.vx) * maxSpeedX
        }
        if (Math.abs(p.vy) > maxSpeedY) {
          p.vy = Math.sign(p.vy) * maxSpeedY
        }

        p.x += p.vx * dt
        p.y += p.vy * dt

        // Boundary Collision with Outward Velocity Cancellation (No sticking or overshooting walls!)
        const minX = 26
        const maxX = width - 26
        const minY = 50
        const maxY = height - 40

        if (p.x <= minX) {
          p.x = minX
          if (p.vx < 0) p.vx = 0
        }
        if (p.x >= maxX) {
          p.x = maxX
          if (p.vx > 0) p.vx = 0
        }
        if (p.y <= minY) {
          p.y = minY
          if (p.vy < 0) p.vy = 0
        }
        if (p.y >= maxY) {
          p.y = maxY
          if (p.vy > 0) p.vy = 0
        }

        // Dynamic 3-Stage Ship Banking (Base velocity tilt + Acceleration lean + Braking recovery)
        const accelLean = (inputX || (p.controlMode === 'pointer' && Math.abs(p.targetX - p.x) > 15 ? Math.sign(p.targetX - p.x) : 0)) * 0.16
        const brakeLean = (!usingKeyboard && p.controlMode === 'keyboard' && Math.abs(p.vx) > 1.2) ? -Math.sign(p.vx) * 0.07 : 0
        const targetTilt = Math.max(-0.45, Math.min(0.45, p.vx * 0.046 + accelLean + brakeLean))
        p.tilt += (targetTilt - p.tilt) * Math.min(1, 0.22 * dt)

        if (p.invulnerable > 0) {
          p.invulnerable -= dt
        }

        // Simulation-Time Exhaust Ember Particles
        state.flameEmberCooldown -= deltaSec
        if (state.flameEmberCooldown <= 0) {
          state.flameEmberCooldown = 0.035
          state.embers.push({
            x: p.x + (Math.random() - 0.5) * 14,
            y: p.y + 24,
            vx: (Math.random() - 0.5) * 1.5,
            vy: 4.5 + Math.random() * 4 * state.speedMultiplier,
            alpha: 0.9,
            size: 2 + Math.random() * 2.5,
            color: state.overdriveTimer > 0 ? '#FFE600' : state.tripleLaserTimer > 0 ? '#00E5FF' : '#FF5C00'
          })
        }

        // 5. SHOOTING WEAPONS (Simulation-Time Based Cooldown + Tiered Weapons with Piercing)
        state.fireCooldown -= deltaSec
        const fireIntervalSec = state.overdriveTimer > 0
          ? 0.075
          : state.weaponLevel === 5
            ? 0.08
            : state.weaponLevel === 4
              ? 0.11
              : state.weaponLevel === 3
                ? 0.13
                : state.tripleLaserTimer > 0 || state.weaponLevel >= 2
                  ? 0.14
                  : 0.18
        const shouldFire = state.keys.fire || stateRef.current.autoFire

        if (shouldFire && state.fireCooldown <= 0) {
          state.fireCooldown = fireIntervalSec

          if (state.overdriveTimer > 0 || state.weaponLevel === 5) {
            sfx.playOverdrive()
            state.lasers.push({ x: p.x - 13, y: p.y - 18, vx: 0, vy: -19, radius: 4.5, color: '#FFE600', isOverdrive: true })
            state.lasers.push({ x: p.x + 13, y: p.y - 18, vx: 0, vy: -19, radius: 4.5, color: '#FFE600', isOverdrive: true })
          } else if (state.weaponLevel === 4) {
            sfx.playLaser()
            // Level 4: Heavy Hyper-Density Plasma Rays
            state.lasers.push({ x: p.x - 10, y: p.y - 20, vx: 0, vy: -17.5, radius: 5.0, color: '#00E5FF', isHeavy: true })
            state.lasers.push({ x: p.x + 10, y: p.y - 20, vx: 0, vy: -17.5, radius: 5.0, color: '#00E5FF', isHeavy: true })
          } else if (state.weaponLevel === 3) {
            sfx.playLaser()
            // Level 3: Dual Piercing Rail Beams (Pierces through 2-3 enemies in a row!)
            state.lasers.push({ x: p.x - 12, y: p.y - 20, vx: 0, vy: -18, radius: 4.2, color: '#BF00FF', isPiercing: true, pierceHits: 0 })
            state.lasers.push({ x: p.x + 12, y: p.y - 20, vx: 0, vy: -18, radius: 4.2, color: '#BF00FF', isPiercing: true, pierceHits: 0 })
          } else if (state.tripleLaserTimer > 0 || state.weaponLevel === 2) {
            sfx.playTripleLaser()
            // Level 2 / Powerup: Triple Spread Vulcan Beams
            state.lasers.push({ x: p.x - 14, y: p.y - 14, vx: -3.2, vy: -15.5, radius: 3.8, color: '#00E5FF' })
            state.lasers.push({ x: p.x, y: p.y - 22, vx: 0, vy: -17, radius: 4.2, color: '#00FF94' })
            state.lasers.push({ x: p.x + 14, y: p.y - 14, vx: 3.2, vy: -15.5, radius: 3.8, color: '#00E5FF' })
          } else {
            sfx.playLaser()
            // Level 1: Dual Plasma Lasers
            state.lasers.push({ x: p.x - 11, y: p.y - 16, vx: 0, vy: -15, radius: 3.2, color: '#00FF94' })
            state.lasers.push({ x: p.x + 11, y: p.y - 16, vx: 0, vy: -15, radius: 3.2, color: '#00FF94' })
          }
        }

        // Homing Missiles Launch Routine (Simulation-Time Based Cooldown)
        state.missileCooldown -= deltaSec
        if (state.homingMissileTimer > 0 && state.missileCooldown <= 0) {
          state.missileCooldown = 0.36
          sfx.playMissile()
          let closestId: number | null = null
          let minDist = 9999
          state.enemies.forEach(e => {
            if (e.category === 'hazard') {
              const d = Math.hypot(e.x - p.x, e.y - p.y)
              if (d < minDist) {
                minDist = d
                closestId = e.id
              }
            }
          })

          state.missiles.push({
            x: p.x - 16,
            y: p.y,
            vx: -3.5,
            vy: -6,
            angle: -Math.PI / 2,
            targetId: closestId,
            life: 140
          })
          state.missiles.push({
            x: p.x + 16,
            y: p.y,
            vx: 3.5,
            vy: -6,
            angle: -Math.PI / 2,
            targetId: closestId,
            life: 140
          })
        }

        // 6. SPAWN WAVE ENEMIES & WELL-PACED SMART POWERUPS (Simulation-Time Based)
        state.waveElapsedSec += deltaSec
        state.powerupCooldown -= deltaSec

        // Dedicated, Well-Paced Powerup Drops (Max 1 on screen, 18-26s cadence)
        const hasActivePowerup = state.enemies.some(e => e.category === 'powerup')
        if (state.powerupCooldown <= 0 && state.waveState === 'active' && !hasActivePowerup) {
          state.powerupCooldown = 18 + Math.random() * 8

          let chosenType: AbilityType = 'triple_laser'
          if (state.lives <= 1 && Math.random() < 0.6) {
            chosenType = 'heart_repair'
          } else if (state.weaponLevel === 1 && Math.random() < 0.5) {
            chosenType = 'triple_laser'
          } else {
            const types: AbilityType[] = ['triple_laser', 'homing_missiles', 'nuke', 'slow_mo', 'overdrive']
            chosenType = types[Math.floor(Math.random() * types.length)]
          }

          const pColor =
            chosenType === 'triple_laser'
              ? '#00E5FF'
              : chosenType === 'homing_missiles'
                ? '#FF6B00'
                : chosenType === 'nuke'
                  ? '#FF3131'
                  : chosenType === 'slow_mo'
                    ? '#BF00FF'
                    : chosenType === 'heart_repair'
                      ? '#FF2A6D'
                      : '#FFE600'

          const pLabel =
            chosenType === 'triple_laser'
              ? '⚡ TRIPLE LASER'
              : chosenType === 'homing_missiles'
                ? '🚀 HOMING MISSILES'
                : chosenType === 'nuke'
                  ? '💣 BASS DROP NUKE'
                  : chosenType === 'slow_mo'
                    ? '⏱️ SLOW-MO'
                    : chosenType === 'heart_repair'
                      ? '💖 +1 HEART'
                      : '🔥 OVERDRIVE'

          state.enemies.push({
            id: Math.random(),
            x: 40 + Math.random() * (width - 80),
            y: -35,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (1.4 + Math.random() * 0.6) * state.speedMultiplier,
            radius: 20,
            category: 'powerup',
            type: 'powerup',
            powerupType: chosenType,
            powerupLabel: pLabel,
            hp: 1,
            maxHp: 1,
            rotation: 0,
            rotSpeed: 0.04,
            color: pColor,
            hitFlash: 0
          })
        }

        // Enemy Wave Spawning (Structured Pacing)
        state.spawnCooldown -= deltaSec
        const spawnIntervalSec = state.tempoMode === 'surge' ? 0.38 : state.tempoMode === 'breather' ? 0.82 : 0.58

        if (state.spawnCooldown <= 0 && state.waveState === 'active' && state.waveRemainingEnemies > 0) {
          state.spawnCooldown = spawnIntervalSec

          let spawnType: 'scout' | 'interceptor' | 'sawblade' | 'asteroid' | 'alien_gunship' = 'scout'
          const elapsed = state.waveElapsedSec

          if (state.currentWave === 1) {
            // Wave 1: Scout Formation
            spawnType = 'scout'
          } else if (state.currentWave === 2) {
            // Wave 2: Interceptor Strike with mid-wave Alien Gunship
            if (elapsed > 4.5 && elapsed < 7.5) {
              spawnType = 'alien_gunship'
            } else {
              spawnType = Math.random() < 0.55 ? 'interceptor' : 'scout'
            }
          } else if (state.currentWave === 3) {
            // Wave 3: Serrated Swarm (Sawblades + Scouts)
            spawnType = Math.random() < 0.65 ? 'sawblade' : 'scout'
          } else if (state.currentWave === 4) {
            // Wave 4: 0-4s Asteroids -> 4-8s Sawblades -> 8-12s Interceptors -> 12s+ Mixed
            if (elapsed < 4.0) spawnType = 'asteroid'
            else if (elapsed < 8.0) spawnType = 'sawblade'
            else if (elapsed < 12.0) spawnType = 'interceptor'
            else spawnType = Math.random() < 0.5 ? 'asteroid' : 'interceptor'
          } else if (state.currentWave === 5) {
            // Wave 5: Cyber Armada Vanguard
            const armada: ('alien_gunship' | 'interceptor' | 'sawblade' | 'scout')[] = ['alien_gunship', 'interceptor', 'sawblade', 'scout']
            spawnType = armada[Math.floor(Math.random() * armada.length)]
          } else {
            spawnType = 'alien_gunship'
          }

          state.waveRemainingEnemies--
          state.waveTotalSpawned++

          let radius = 24
          let hp = 1
          let color = '#71717a'
          let speed = (2.4 + Math.random() * 2.2) * state.speedMultiplier

          if (spawnType === 'asteroid') {
            radius = 26
            hp = state.currentWave >= 3 ? 3 : 2
            color = '#3f3f46'
          } else if (spawnType === 'sawblade') {
            radius = 22
            hp = 1
            color = '#FF5C00'
            speed *= 1.15
          } else if (spawnType === 'scout') {
            radius = 18
            hp = 1
            color = '#EF4444'
            speed *= 1.3
          } else if (spawnType === 'interceptor') {
            radius = 22
            hp = 2
            color = '#F59E0B'
            speed *= 1.1
          } else if (spawnType === 'alien_gunship') {
            radius = 25
            hp = 2
            color = '#DC2626'
            speed *= 0.85
          }

          state.enemies.push({
            id: Math.random(),
            x: 40 + Math.random() * (width - 80),
            y: -40,
            vx: (Math.random() - 0.5) * 1.6,
            vy: speed,
            radius,
            category: 'hazard',
            type: spawnType,
            hp,
            maxHp: hp,
            rotation: 0,
            rotSpeed: (Math.random() - 0.5) * 0.1,
            color,
            hitFlash: 0,
            shootCooldown: 85 + Math.floor(Math.random() * 50),
            aiPhase: 0,
            aiTimer: spawnType === 'scout' ? 1.2 : spawnType === 'interceptor' ? 0.45 : spawnType === 'alien_gunship' ? 1.5 : 0,
            targetPosX: 60 + Math.random() * (width - 120),
            targetPosY: 70 + Math.random() * 70,
            diveTargetX: p.x,
            aimTelegraph: 0
          })
        }

        // 7. UPDATE & DRAW HOMING MISSILES (Angular Steering Physics + Smooth Arcs)
        for (let i = state.missiles.length - 1; i >= 0; i--) {
          const m = state.missiles[i]
          m.life -= dt

          if (m.life <= 0) {
            state.missiles.splice(i, 1)
            continue
          }

          let targetX = width / 2
          let targetY = -100
          if (state.boss) {
            targetX = state.boss.x
            targetY = state.boss.y
          } else {
            const target = state.enemies.find(e => e.id === m.targetId && e.category === 'hazard')
            if (target) {
              targetX = target.x
              targetY = target.y
            }
          }

          // Natural angular steering arc
          const currentAngle = Math.atan2(m.vy, m.vx)
          const targetAngle = Math.atan2(targetY - m.y, targetX - m.x)
          let diff = targetAngle - currentAngle
          while (diff < -Math.PI) diff += Math.PI * 2
          while (diff > Math.PI) diff -= Math.PI * 2

          const maxTurn = 4.8 * deltaSec
          const turn = Math.max(-maxTurn, Math.min(maxTurn, diff))
          const newAngle = currentAngle + turn

          const currentSpeed = Math.min(13.5, Math.hypot(m.vx, m.vy) + 0.35 * dt)
          m.vx = Math.cos(newAngle) * currentSpeed
          m.vy = Math.sin(newAngle) * currentSpeed
          m.angle = newAngle
          m.x += m.vx * dt
          m.y += m.vy * dt

          // Smoke trail with slight expansion and drag
          state.particles.push({
            x: m.x,
            y: m.y,
            vx: (Math.random() - 0.5) * 0.8,
            vy: 1.5,
            alpha: 0.65,
            size: 2.2,
            color: '#a1a1aa',
            decay: 0.04,
            drag: 0.95
          })

          ctx.save()
          ctx.translate(m.x, m.y)
          ctx.rotate(newAngle + Math.PI / 2)
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(-2, -6, 4, 12)
          ctx.fillStyle = '#FF5C00'
          ctx.fillRect(-3, 3, 6, 3)
          ctx.restore()

          // Missile Collisions
          let missileHit = false
          if (state.boss && Math.hypot(m.x - state.boss.x, m.y - state.boss.y) < 55) {
            state.boss.hp -= 4
            state.boss.hitFlash = 4
            missileHit = true
          } else {
            for (let j = state.enemies.length - 1; j >= 0; j--) {
              const e = state.enemies[j]
              if (e.category === 'hazard' && Math.hypot(m.x - e.x, m.y - e.y) < e.radius + 6) {
                e.hp -= 2
                e.hitFlash = 5
                missileHit = true
                break
              }
            }
          }

          if (missileHit) {
            sfx.playExplosion()
            state.screenShake = 0.5
            for (let k = 0; k < 12; k++) {
              state.particles.push({
                x: m.x,
                y: m.y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                alpha: 1,
                size: 2.5,
                color: '#FF6B00',
                decay: 0.05
              })
            }
            state.missiles.splice(i, 1)
          }
        }

        // 8. UPDATE & DRAW PLAYER LASERS
        for (let i = state.lasers.length - 1; i >= 0; i--) {
          const l = state.lasers[i]
          l.x += l.vx * dt
          l.y += l.vy * dt

          if (l.y < -20) {
            state.lasers.splice(i, 1)
            continue
          }

          ctx.save()
          ctx.shadowBlur = l.isOverdrive ? 20 : l.isHeavy ? 16 : 12
          ctx.shadowColor = l.color
          ctx.fillStyle = l.color
          ctx.beginPath()
          ctx.arc(l.x, l.y, l.radius, 0, Math.PI * 2)
          ctx.fill()

          ctx.strokeStyle = l.color
          ctx.lineWidth = l.isOverdrive ? 3.5 : l.isHeavy ? 3 : 2
          ctx.beginPath()
          ctx.moveTo(l.x, l.y)
          ctx.lineTo(l.x - l.vx * 2.2, l.y + 16)
          ctx.stroke()
          ctx.restore()
        }

        // 9. UPDATE & DRAW ENEMY LASERS (HOSTILE BULLETS + READABLE CORE + NEAR MISS DETECTION)
        const projSpeedMult = state.speedMultiplier
        for (let i = state.enemyLasers.length - 1; i >= 0; i--) {
          const el = state.enemyLasers[i]
          el.x += el.vx * projSpeedMult * dt
          el.y += el.vy * projSpeedMult * dt

          if (el.y > height + 25 || el.y < -40 || el.x < -40 || el.x > width + 40) {
            state.enemyLasers.splice(i, 1)
            continue
          }

          // Bullet Graphics (High-visibility Readable Core + Outer Shell + Comet Motion Trail)
          ctx.save()
          ctx.strokeStyle = el.color
          ctx.lineWidth = el.radius * 0.9
          ctx.globalAlpha = 0.38
          ctx.beginPath()
          ctx.moveTo(el.x, el.y)
          ctx.lineTo(el.x - el.vx * 2.6 * projSpeedMult, el.y - el.vy * 2.6 * projSpeedMult)
          ctx.stroke()
          ctx.globalAlpha = 1.0

          ctx.shadowBlur = 14
          ctx.shadowColor = el.color
          ctx.fillStyle = el.color
          ctx.beginPath()
          ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2)
          ctx.fill()

          ctx.fillStyle = '#FFFFFF'
          ctx.beginPath()
          ctx.arc(el.x, el.y, el.radius * 0.45, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()

          const distToPlayer = Math.hypot(el.x - p.x, el.y - p.y)
          const hitDist = el.radius + p.hitboxRadius // Fair 10px core cockpit hitbox!

          // ⚡ TIERED NEAR-MISS & PERFECT DODGE SYSTEM (ALL LIFE STATES)
          if (!el.nearMissChecked && distToPlayer < 48 && distToPlayer >= hitDist) {
            el.nearMissChecked = true
            state.nearMisses++
            sfx.playNearMiss()

            if (distToPlayer < hitDist + 6) {
              // ⭐ PERFECT DODGE! (Available in ALL life states!)
              state.score += 150 * state.combo
              state.combo = Math.min(state.combo + 1, 8)
              state.comboTimer = 2.5
              state.hitStop = 0.08 // 80ms slow motion freeze!
              state.screenShake = 0.8
              state.shockwaves.push({ x: p.x, y: p.y, radius: 8, maxRadius: 65, alpha: 0.9, color: '#00E5FF' })
              setCombo(state.combo)
              state.floatingTexts.push({
                x: p.x,
                y: p.y - 30,
                text: '⭐ PERFECT DODGE! +150',
                color: '#FFE600',
                alpha: 1,
                yOffset: 0,
                scale: 1.25
              })
            } else if (distToPlayer < hitDist + 14) {
              // ⚡ CLOSE MISS!
              state.score += 100
              state.floatingTexts.push({
                x: el.x,
                y: el.y,
                text: '⚡ CLOSE MISS! +100',
                color: '#00E5FF',
                alpha: 1,
                yOffset: 0,
                scale: 1.1
              })
            } else if (distToPlayer < hitDist + 24) {
              // ⚡ NEAR MISS!
              state.score += 50
              state.floatingTexts.push({
                x: el.x,
                y: el.y,
                text: '⚡ NEAR MISS! +50',
                color: '#00FF94',
                alpha: 1,
                yOffset: 0,
                scale: 1.0
              })
            } else {
              // SAFE MISS!
              state.score += 20
            }
          }

          // Direct Hit with Player Core Cockpit Hitbox (Fair 10px Hitbox)
          if (distToPlayer < hitDist && p.invulnerable <= 0) {
            state.enemyLasers.splice(i, 1)
            triggerBrokenHeartDamage(p.x, p.y)
            continue
          }
        }

        // 10. DREADNOUGHT BOSS (3 PHASES + TELEGRAPHED LASER SWEEP)
        if (state.boss) {
          const b = state.boss
          b.coreGlow += 0.08 * dt

          // Dynamic Phase Management
          const hpRatio = b.hp / b.maxHp
          if (hpRatio < 0.35 && b.phase !== 3) {
            b.phase = 3
            sfx.playBossAlarm()
            state.screenShake = 2.0
            state.floatingTexts.push({
              x: width / 2,
              y: height * 0.35,
              text: '⚠️ BOSS ENRAGED! MAXIMUM THREAT!',
              color: '#FF0033',
              alpha: 1,
              yOffset: 0,
              scale: 1.5
            })
          } else if (hpRatio < 0.7 && b.phase === 1) {
            b.phase = 2
          }

          // Entrance slide down
          if (b.y < b.targetY) {
            b.y += 2.0 * dt
          } else {
            // Horizontal sway
            b.x += b.vx * dt * (b.phase === 3 ? 1.5 : 1.0)
            if (b.x < b.width / 2 + 20 || b.x > width - b.width / 2 - 20) {
              b.vx *= -1
            }

            // Phase 1 Attacks (Dual Aimed Cannons)
            b.shootCooldown -= dt
            if (b.shootCooldown <= 0) {
              b.shootCooldown = b.phase === 3 ? 28 : b.phase === 2 ? 38 : 48
              sfx.playEnemyShot()
              state.enemyLasers.push({
                id: Math.random(),
                x: b.x - 35,
                y: b.y + 35,
                vx: (p.x - (b.x - 35)) * 0.015,
                vy: 5.5,
                radius: 5,
                color: '#FF0033'
              })
              state.enemyLasers.push({
                id: Math.random(),
                x: b.x + 35,
                y: b.y + 35,
                vx: (p.x - (b.x + 35)) * 0.015,
                vy: 5.5,
                radius: 5,
                color: '#FF0033'
              })
            }

            // Phase 2 Attacks (Radial Bullet Rings + Movement Direction Flip)
            b.specialCooldown -= dt
            if (b.specialCooldown <= 0) {
              b.specialCooldown = b.phase === 3 ? 110 : 150
              sfx.playBossAlarm()
              b.vx = -b.vx // Horizontal repositioning after attack
              for (let a = 0; a < 8; a++) {
                const ang = (a / 8) * Math.PI * 2
                state.enemyLasers.push({
                  id: Math.random(),
                  x: b.x,
                  y: b.y + 20,
                  vx: Math.cos(ang) * 4.5,
                  vy: Math.sin(ang) * 4.5,
                  radius: 5.5,
                  color: '#FF5C00'
                })
              }
            }

            // Phase 3 Attack: TELEGRAPHED LASER SWEEP! (With Explicit Telegraph Reset)
            if (b.phase === 3) {
              b.laserSweepCooldown -= dt
              if (b.laserSweepCooldown <= 45 && b.laserSweepCooldown > 0) {
                // Warning Telegraph Line Active (0.75s to 0.0s)
                b.laserTelegraph = b.laserSweepCooldown
                // Screen pulse + sound at 0.2s before firing (approx 12 ticks)
                if (b.laserSweepCooldown <= 12 && b.laserSweepCooldown + dt > 12) {
                  sfx.playBossAlarm()
                  state.screenShake = Math.max(state.screenShake, 1.2)
                }
              } else if (b.laserSweepCooldown <= 0 && !b.laserSweepActive) {
                b.laserSweepActive = true
                b.laserTelegraph = 0 // Reset telegraph explicitly when firing!
                b.laserSweepAngle = -0.72
                sfx.playLaser()
                state.screenShake = Math.max(state.screenShake, 2.0)
              } else if (!b.laserSweepActive) {
                b.laserTelegraph = 0
              }

              if (b.laserSweepActive) {
                b.laserTelegraph = 0
                b.laserSweepAngle += 0.026 * dt
                if (b.laserSweepAngle > 0.72) {
                  b.laserSweepActive = false
                  b.laserTelegraph = 0 // Reset telegraph explicitly on finish!
                  b.laserSweepCooldown = 280
                }

                // Laser Beam Collision
                const beamStartX = b.x
                const beamStartY = b.y + 30
                const beamEndX = beamStartX + Math.sin(b.laserSweepAngle) * 600
                const beamEndY = beamStartY + Math.cos(b.laserSweepAngle) * 600

                // Check distance of player to laser line
                const ldx = beamEndX - beamStartX
                const ldy = beamEndY - beamStartY
                const lLen = Math.hypot(ldx, ldy)
                const u = Math.max(0, Math.min(1, ((p.x - beamStartX) * ldx + (p.y - beamStartY) * ldy) / (lLen * lLen)))
                const closestX = beamStartX + u * ldx
                const closestY = beamStartY + u * ldy
                const distToBeam = Math.hypot(p.x - closestX, p.y - closestY)

                if (distToBeam < p.hitboxRadius + 4 && p.invulnerable <= 0) {
                  triggerBrokenHeartDamage(p.x, p.y)
                }

                // Render Sweeping Death Laser
                ctx.save()
                ctx.strokeStyle = '#FF0033'
                ctx.lineWidth = 14
                ctx.shadowBlur = 24
                ctx.shadowColor = '#FF0033'
                ctx.beginPath()
                ctx.moveTo(beamStartX, beamStartY)
                ctx.lineTo(beamEndX, beamEndY)
                ctx.stroke()

                ctx.strokeStyle = '#FFFFFF'
                ctx.lineWidth = 5
                ctx.beginPath()
                ctx.moveTo(beamStartX, beamStartY)
                ctx.lineTo(beamEndX, beamEndY)
                ctx.stroke()
                ctx.restore()
              }
            }
          }

          // Multi-Tier Laser Telegraph Line (0.75s faint -> 0.4s bright -> 0.2s pulse/beep -> fire)
          if (b.laserTelegraph > 0) {
            ctx.save()
            const urgency = Math.max(0, Math.min(1, 1 - (b.laserTelegraph / 45)))
            ctx.strokeStyle = urgency > 0.7
              ? `rgba(255, 255, 255, ${0.85 + Math.sin(timestamp * 0.03) * 0.15})`
              : `rgba(255, 0, 51, ${0.3 + urgency * 0.6})`
            ctx.lineWidth = 1.5 + urgency * 5
            ctx.shadowBlur = 10 + urgency * 18
            ctx.shadowColor = urgency > 0.7 ? '#FFFFFF' : '#FF0033'
            ctx.setLineDash(urgency > 0.7 ? [4, 4] : [8, 8])
            ctx.beginPath()
            ctx.moveTo(b.x, b.y + 30)
            ctx.lineTo(b.x, height)
            ctx.stroke()
            ctx.restore()
          }

          // Boss Hit Detection from player lasers (Supports Piercing Rail Beams & Heavy Plasma)
          for (let j = state.lasers.length - 1; j >= 0; j--) {
            const l = state.lasers[j]
            if (l.hitEnemyIds && l.hitEnemyIds.includes(-999)) {
              continue
            }
            if (Math.abs(l.x - b.x) < b.width / 2 && Math.abs(l.y - b.y) < b.height / 2) {
              if (l.isPiercing) {
                l.hitEnemyIds = l.hitEnemyIds || []
                l.hitEnemyIds.push(-999)
                l.pierceHits = (l.pierceHits || 0) + 1
                if (l.pierceHits >= 3) state.lasers.splice(j, 1)
              } else {
                state.lasers.splice(j, 1)
              }
              const dmg = l.isHeavy ? 2 : 1
              b.hp -= dmg
              b.hitFlash = 3

              if (b.hp <= 0) {
                // BOSS DESTROYED!
                sfx.playBossExplosion()
                state.screenShake = 3.5
                state.enemiesDestroyed++
                state.wavesCleared++
                state.score += 5000 * state.combo
                setScore(state.score)

                for (let k = 0; k < 60; k++) {
                  state.particles.push({
                    x: b.x + (Math.random() - 0.5) * b.width,
                    y: b.y + (Math.random() - 0.5) * b.height,
                    vx: (Math.random() - 0.5) * 18,
                    vy: (Math.random() - 0.5) * 18,
                    alpha: 1,
                    size: 3 + Math.random() * 5,
                    color: Math.random() < 0.5 ? '#FFE600' : '#FF5C00',
                    decay: 0.02
                  })
                }

                state.floatingTexts.push({
                  x: b.x,
                  y: b.y,
                  text: '💥 DREADNOUGHT DESTROYED! +5,000!',
                  color: '#FFE600',
                  alpha: 1,
                  yOffset: 0,
                  scale: 1.5
                })

                state.boss = null
                state.waveState = 'victory'
                state.waveTransitionTimer = 160 // Dramatic 2.6s fireworks celebration before victory screen!
                break
              }
            }
          }

          if (b) {
            // Render Boss Ship
            ctx.save()
            ctx.translate(b.x, b.y)

            if (b.hitFlash > 0) {
              b.hitFlash--
              ctx.fillStyle = '#FFFFFF'
            } else {
              ctx.fillStyle = '#1c1917'
            }

            ctx.strokeStyle = b.phase === 3 ? '#FF0033' : '#DC2626'
            ctx.lineWidth = 2.5

            // Main Flagship Hull
            ctx.beginPath()
            ctx.moveTo(0, 45)
            ctx.lineTo(b.width / 2, -15)
            ctx.lineTo(b.width * 0.35, -35)
            ctx.lineTo(-b.width * 0.35, -35)
            ctx.lineTo(-b.width / 2, -15)
            ctx.closePath()
            ctx.fill()
            ctx.stroke()

            // Glowing Alien Reactor Core
            const coreColor = b.phase === 3 ? '#FF0033' : Math.sin(b.coreGlow) > 0 ? '#FF0033' : '#FF5C00'
            ctx.shadowBlur = 18
            ctx.shadowColor = coreColor
            ctx.fillStyle = coreColor
            ctx.beginPath()
            ctx.arc(0, 5, 16, 0, Math.PI * 2)
            ctx.fill()

            // Outer Cannons
            ctx.fillStyle = '#52525b'
            ctx.fillRect(-b.width * 0.38, 5, 8, 25)
            ctx.fillRect(b.width * 0.38 - 8, 5, 8, 25)

            ctx.restore()

            // Draw sleek Boss HP Bar directly on top of Canvas (100% Canvas, Zero DOM Clutter!)
            const hpRatio = Math.max(0, b.hp / b.maxHp)
            const barW = Math.min(260, width - 40)
            const barH = 7
            const barX = (width - barW) / 2
            const barY = 16

            ctx.save()
            ctx.font = 'bold 10px monospace'
            ctx.fillStyle = '#ef4444'
            ctx.textAlign = 'center'
            ctx.shadowBlur = 8
            ctx.shadowColor = '#ef4444'
            ctx.fillText(`👾 DREADNOUGHT MOTHERSHIP • ${Math.round(hpRatio * 100)}%`, width / 2, barY - 4)

            // Background
            ctx.fillStyle = 'rgba(15, 10, 10, 0.9)'
            ctx.strokeStyle = '#ef4444'
            ctx.lineWidth = 1.2
            ctx.fillRect(barX, barY, barW, barH)
            ctx.strokeRect(barX, barY, barW, barH)

            // Fill
            ctx.fillStyle = b.phase === 3 ? '#ff0033' : '#ef4444'
            ctx.shadowBlur = 10
            ctx.shadowColor = '#ef4444'
            ctx.fillRect(barX + 1, barY + 1, (barW - 2) * hpRatio, barH - 2)
            ctx.restore()
          }
        }

        // 11. UPDATE & DRAW HAZARDS & POWERUPS (DIVERSE ENEMY AI)
        for (let i = state.enemies.length - 1; i >= 0; i--) {
          const e = state.enemies[i]

          // Enemy AI Movement Patterns & Multi-State Behaviors
          if (e.category === 'powerup') {
            // Inverse-distance magnetic suction curve with snap zone
            const dist = Math.hypot(p.x - e.x, p.y - e.y)
            if (dist < 150) {
              const pullStrength = Math.min(16, ((150 - dist) / 150) * 14)
              const nx = (p.x - e.x) / dist
              const ny = (p.y - e.y) / dist
              e.vx += nx * pullStrength * 0.15 * dt
              e.vy += ny * pullStrength * 0.15 * dt
              if (dist < 26) {
                e.x += (p.x - e.x) * 0.5 * dt
                e.y += (p.y - e.y) * 0.5 * dt
              }
            }
            e.x += e.vx * dt
            e.y += e.vy * dt
          } else if (e.type === 'scout') {
            // Scout Multi-Stage AI: ENTER -> TRACK -> DIVE -> EXIT
            e.aiPhase = e.aiPhase || 0
            e.aiTimer = (e.aiTimer !== undefined ? e.aiTimer : 1.2) - deltaSec

            if (e.aiPhase === 0) {
              // 1. Enter: Swoop in from top
              e.y += e.vy * dt
              e.x += Math.sin(e.y * 0.05 + e.id) * 1.5 * dt
              if (e.y >= 75) {
                e.aiPhase = 1
                e.aiTimer = 1.1
              }
            } else if (e.aiPhase === 1) {
              // 2. Track: Smooth horizontal tracking of player
              e.x += (p.x - e.x) * 0.045 * dt
              e.y += 0.8 * dt
              if (e.aiTimer <= 0) {
                e.aiPhase = 2
                e.diveTargetX = p.x
              }
            } else if (e.aiPhase === 2) {
              // 3. Dive: Aggressive dive toward locked coordinate
              const diveVx = ((e.diveTargetX ?? p.x) - e.x) * 0.06
              e.x += diveVx * dt
              e.y += (e.vy * 1.55) * dt
              if (e.y > height - 140) {
                e.aiPhase = 3
              }
            } else {
              // 4. Exit: Sweeping banking exit off screen
              const exitDir = e.x > width / 2 ? 1 : -1
              e.vx = exitDir * 4.2
              e.x += e.vx * dt
              e.y += (e.vy * 0.8) * dt
            }
          } else if (e.type === 'interceptor') {
            // Interceptor Multi-Stage AI: POSITION ABOVE -> LOCK PREDICTION -> DIVE -> LEAVE
            e.aiPhase = e.aiPhase || 0
            e.aiTimer = (e.aiTimer !== undefined ? e.aiTimer : 0.6) - deltaSec

            if (e.aiPhase === 0) {
              // Position above player
              e.y += e.vy * 0.85 * dt
              const targetX = p.x + (Math.sin(e.id) * 60)
              e.x += (targetX - e.x) * 0.04 * dt
              if (e.y >= 85) {
                e.aiPhase = 1
                e.aiTimer = 0.45
                e.targetPosX = p.x + p.vx * 22
              }
            } else if (e.aiPhase === 1) {
              // Aim Telegraph Line
              e.aimTelegraph = 1
              if (e.aiTimer <= 0) {
                e.aiPhase = 2
                e.aimTelegraph = 0
              }
            } else if (e.aiPhase === 2) {
              // High speed intercept charge straight through predicted position
              const dx = (e.targetPosX || p.x) - e.x
              e.x += Math.sign(dx) * Math.min(Math.abs(dx) * 0.08, 4.5) * dt
              e.y += (e.vy * 1.6) * dt
              if (e.y > height - 100) {
                e.aiPhase = 3
              }
            } else {
              // Leave
              e.y += (e.vy * 1.2) * dt
            }
          } else if (e.type === 'sawblade') {
            // Curving Compound Harmonic Bézier-like trajectory
            e.y += e.vy * dt
            const harmonic = Math.sin(e.y * 0.024 + e.id * 2) * 3.8 + Math.cos(e.y * 0.012) * 1.8
            e.x += harmonic * dt
          } else if (e.type === 'alien_gunship') {
            // Alien Gunship: MOVE -> STOP & AIM TELEGRAPH -> BURST -> REPOSITION
            e.aiPhase = e.aiPhase || 0
            e.targetPosX = e.targetPosX ?? (60 + Math.random() * (width - 120))
            e.targetPosY = e.targetPosY ?? (70 + Math.random() * 80)
            e.aiTimer = (e.aiTimer !== undefined ? e.aiTimer : 1.5) - deltaSec

            if (e.aiPhase === 0) {
              // Move to patrol coordinate
              const dx = e.targetPosX - e.x
              const dy = e.targetPosY - e.y
              e.x += Math.sign(dx) * Math.min(Math.abs(dx) * 0.05, 3.2) * dt
              e.y += Math.sign(dy) * Math.min(Math.abs(dy) * 0.05, 2.2) * dt
              if (Math.hypot(dx, dy) < 14 || e.aiTimer <= 0) {
                e.aiPhase = 1
                e.aiTimer = 0.45 // Stop and aim
                e.aimTelegraph = 1
              }
            } else if (e.aiPhase === 1) {
              // Stop & Aim with red telegraph line
              e.aimTelegraph = 1
              if (e.aiTimer <= 0) {
                // Fire accurate dual plasma burst!
                e.aiPhase = 2
                e.aimTelegraph = 0
                sfx.playEnemyShot()
                const angleToPlayer = Math.atan2(p.y - (e.y + e.radius), p.x - e.x)
                state.enemyLasers.push({
                  id: Math.random(),
                  x: e.x - 10,
                  y: e.y + e.radius + 2,
                  vx: Math.cos(angleToPlayer) * 5.2,
                  vy: Math.sin(angleToPlayer) * 5.2,
                  radius: 4.8,
                  color: '#FF0033'
                })
                state.enemyLasers.push({
                  id: Math.random(),
                  x: e.x + 10,
                  y: e.y + e.radius + 2,
                  vx: Math.cos(angleToPlayer) * 5.2,
                  vy: Math.sin(angleToPlayer) * 5.2,
                  radius: 4.8,
                  color: '#FF0033'
                })
                e.aiTimer = 0.9
              }
            } else {
              // Reposition
              if (e.aiTimer <= 0) {
                e.aiPhase = 0
                e.targetPosX = 60 + Math.random() * (width - 120)
                e.targetPosY = 65 + Math.random() * 95
                e.aiTimer = 2.0
              }
            }
          } else {
            // Magma Asteroid
            e.x += e.vx * dt
            e.y += e.vy * dt
          }

          e.rotation += e.rotSpeed * dt

          // Draw Enemy Aim Telegraph Line (Player can clearly read incoming shot and dodge!)
          if (e.aimTelegraph && e.category === 'hazard') {
            ctx.save()
            ctx.strokeStyle = 'rgba(255, 0, 51, 0.45)'
            ctx.lineWidth = 1.5
            ctx.setLineDash([4, 4])
            ctx.beginPath()
            ctx.moveTo(e.x, e.y + e.radius)
            ctx.lineTo(p.x, p.y)
            ctx.stroke()
            ctx.restore()
          }

          // Wall bounce with boundary clamping
          if (e.x < e.radius) {
            e.x = e.radius
            e.vx = Math.abs(e.vx)
          } else if (e.x > width - e.radius) {
            e.x = width - e.radius
            e.vx = -Math.abs(e.vx)
          }

          // Off-screen despawn
          if (e.y > height + 50) {
            state.enemies.splice(i, 1)
            continue
          }

          // Laser Collisions (Hazards only! Powerups are magnetic collection only)
          let entityDestroyed = false
          if (e.category === 'hazard') {
            for (let j = state.lasers.length - 1; j >= 0; j--) {
              const l = state.lasers[j]
              // If piercing laser already hit this enemy, do not hit again
              if (l.hitEnemyIds && l.hitEnemyIds.includes(e.id)) {
                continue
              }
              const dist = Math.hypot(e.x - l.x, e.y - l.y)
              if (dist < e.radius + l.radius) {
                if (l.isPiercing) {
                  l.hitEnemyIds = l.hitEnemyIds || []
                  l.hitEnemyIds.push(e.id)
                  l.pierceHits = (l.pierceHits || 0) + 1
                  if (l.pierceHits >= 3) {
                    state.lasers.splice(j, 1)
                  }
                } else {
                  state.lasers.splice(j, 1)
                }

                const dmg = l.isHeavy ? 2 : 1
                e.hp -= dmg
                e.hitFlash = 3

                // Impact Sparks with drag and gravity physics
                for (let k = 0; k < 7; k++) {
                  state.particles.push({
                    x: l.x,
                    y: l.y,
                    vx: (Math.random() - 0.5) * 8.5,
                    vy: (Math.random() - 0.5) * 8.5,
                    alpha: 1,
                    size: 2.5,
                    color: l.color,
                    decay: 0.05,
                    drag: 0.94,
                    gravity: 0.08
                  })
                }

                if (e.hp <= 0) {
                  entityDestroyed = true
                  state.screenShake = 0.6
                  sfx.playExplosion()
                  state.enemiesDestroyed++
                  state.hitStreak++
                  state.comboTimer = 2.5

                  // Deep Combo System: 5 hits -> 2x, 10 hits -> 3x, 20 hits -> 4x, 30 hits -> 5x, 50 hits -> 6x
                  let nextCombo = 1
                  if (state.hitStreak >= 50) nextCombo = 6
                  else if (state.hitStreak >= 30) nextCombo = 5
                  else if (state.hitStreak >= 20) nextCombo = 4
                  else if (state.hitStreak >= 10) nextCombo = 3
                  else if (state.hitStreak >= 5) nextCombo = 2

                  if (nextCombo > state.combo) {
                    state.combo = nextCombo
                    if (state.combo > state.bestCombo) state.bestCombo = state.combo
                    setCombo(state.combo)
                    // Milestone Rewards!
                    if (state.combo === 3) {
                      state.shockwaves.push({ x: e.x, y: e.y, radius: 10, maxRadius: 180, alpha: 0.8, color: '#00FF94' })
                    } else if (state.combo === 5) {
                      state.overdriveTimer = 300
                      state.floatingTexts.push({ x: p.x, y: p.y - 25, text: '🔥 5X COMBO OVERDRIVE!', color: '#FFE600', alpha: 1, yOffset: 0, scale: 1.3 })
                    }
                  }

                  const basePts = e.type === 'alien_gunship' ? 320 : e.type === 'interceptor' ? 260 : e.type === 'scout' ? 220 : e.type === 'sawblade' ? 180 : 120
                  const points = basePts * state.combo
                  state.score += points

                  state.floatingTexts.push({
                    x: e.x,
                    y: e.y,
                    text: `+${points}${state.combo > 1 ? ` (${state.combo}X)` : ''}`,
                    color: state.combo > 2 ? '#FF5C00' : '#00FF94',
                    alpha: 1,
                    yOffset: 0,
                    scale: 1.1
                  })

                  // Shatter Debris Fragments with physical drag
                  for (let k = 0; k < 18; k++) {
                    state.particles.push({
                      x: e.x,
                      y: e.y,
                      vx: (Math.random() - 0.5) * 11,
                      vy: (Math.random() - 0.5) * 11,
                      alpha: 1,
                      size: 2 + Math.random() * 4,
                      color: e.type === 'sawblade' ? '#FF5C00' : e.type === 'alien_gunship' ? '#FF0033' : '#a1a1aa',
                      decay: 0.035,
                      drag: 0.93,
                      gravity: 0.06
                    })
                  }
                  break
                }
              }
            }
          }

          if (entityDestroyed) {
            state.enemies.splice(i, 1)
            continue
          }

          // Player Collision Detection (Collision-Safe 10px Core Hitbox)
          const distToPlayer = Math.hypot(e.x - p.x, e.y - p.y)
          if (e.category === 'powerup') {
            // Generous Powerup Collection Radius
            if (distToPlayer < e.radius + 24) {
              sfx.playPowerup()
              state.shockwaves.push({ x: p.x, y: p.y, radius: 10, maxRadius: 85, alpha: 0.85, color: e.color })
              if (e.powerupType === 'triple_laser') {
                state.tripleLaserTimer = 450
                state.floatingTexts.push({ x: p.x, y: p.y - 25, text: '⚡ TRIPLE LASERS!', color: '#00E5FF', alpha: 1, yOffset: 0, scale: 1.2 })
              } else if (e.powerupType === 'homing_missiles') {
                state.homingMissileTimer = 450
                state.floatingTexts.push({ x: p.x, y: p.y - 25, text: '🚀 HOMING MISSILES!', color: '#FF6B00', alpha: 1, yOffset: 0, scale: 1.2 })
              } else if (e.powerupType === 'nuke') {
                triggerNuke(p.x, p.y)
              } else if (e.powerupType === 'slow_mo') {
                state.slowMoTimer = 360
                state.floatingTexts.push({ x: p.x, y: p.y - 25, text: '⏱️ SLOW-MO TIME!', color: '#BF00FF', alpha: 1, yOffset: 0, scale: 1.2 })
              } else if (e.powerupType === 'overdrive') {
                state.overdriveTimer = 400
                state.floatingTexts.push({ x: p.x, y: p.y - 25, text: '🔥 OVERDRIVE GATLING!', color: '#FFE600', alpha: 1, yOffset: 0, scale: 1.2 })
              } else if (e.powerupType === 'heart_repair') {
                sfx.playHeartRepair()
                if (state.lives < 3) {
                  state.lives++
                  setLives(state.lives)
                  state.floatingTexts.push({ x: p.x, y: p.y - 25, text: '💖 HEART REPAIRED! (+1 LIFE)', color: '#FF2A6D', alpha: 1, yOffset: 0, scale: 1.3 })
                } else {
                  state.score += 1000
                  state.floatingTexts.push({ x: p.x, y: p.y - 25, text: '💖 +1,000 BONUS!', color: '#FFE600', alpha: 1, yOffset: 0, scale: 1.2 })
                }
              }

              state.enemies.splice(i, 1)
              continue
            }
          } else if (distToPlayer < e.radius + p.hitboxRadius && p.invulnerable <= 0) {
            // 💔 CRASHED INTO DANGEROUS HAZARD! (Fair 10px cockpit hitbox)
            state.enemies.splice(i, 1)
            triggerBrokenHeartDamage(p.x, p.y)
            continue
          }

          // RENDER ENTITY (Crystal-clear distinction: Hazard vs Powerup!)
          ctx.save()
          ctx.translate(e.x, e.y)

          if (e.category === 'powerup') {
            // ==========================================
            // BENEFICIAL POWERUP CAPSULE (GLOWING, FRIENDLY)
            // ==========================================
            ctx.shadowBlur = 18
            ctx.shadowColor = e.color
            ctx.fillStyle = `${e.color}33`
            ctx.beginPath()
            ctx.arc(0, 0, e.radius * 1.15, 0, Math.PI * 2)
            ctx.fill()

            // Outer Rotating Ring
            ctx.strokeStyle = e.color
            ctx.lineWidth = 2.2
            ctx.beginPath()
            ctx.ellipse(0, 0, e.radius * 1.25, e.radius * 0.65, e.rotation * 2, 0, Math.PI * 2)
            ctx.stroke()

            // Inner Core Orb
            ctx.fillStyle = e.color
            ctx.beginPath()
            ctx.arc(0, 0, e.radius * 0.72, 0, Math.PI * 2)
            ctx.fill()

            // Powerup Symbol
            ctx.fillStyle = '#000000'
            ctx.font = 'bold 13px sans-serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            const symbol =
              e.powerupType === 'triple_laser'
                ? '⚡'
                : e.powerupType === 'homing_missiles'
                  ? '🚀'
                  : e.powerupType === 'nuke'
                    ? '💣'
                    : e.powerupType === 'slow_mo'
                      ? '⏱️'
                      : e.powerupType === 'heart_repair'
                        ? '💖'
                        : '🔥'
            ctx.fillText(symbol, 0, 1)

            // FLOATING UNMISTAKABLE BENEFICIAL LABEL BELOW
            if (e.powerupLabel) {
              ctx.font = 'bold 9px monospace'
              ctx.fillStyle = e.color
              ctx.shadowBlur = 8
              ctx.shadowColor = '#000000'
              ctx.fillText(e.powerupLabel, 0, e.radius + 13)
            }
          } else {
            // ==========================================
            // DANGEROUS HAZARD (RED/ORANGE, MENACING)
            // ==========================================
            ctx.rotate(e.rotation)

            if (e.hitFlash > 0) {
              e.hitFlash--
              ctx.fillStyle = '#FFFFFF'
            } else {
              ctx.fillStyle = e.color
            }

            if (e.type === 'asteroid') {
              ctx.strokeStyle = '#ef4444'
              ctx.lineWidth = 1.6
              ctx.beginPath()
              ctx.moveTo(e.radius, 0)
              for (let a = 0; a < 8; a++) {
                const angle = (a / 8) * Math.PI * 2
                const r = e.radius * (0.8 + (a % 2 === 0 ? 0.22 : -0.15))
                ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r)
              }
              ctx.closePath()
              ctx.fill()
              ctx.stroke()

              // Red Magma Fissures
              ctx.strokeStyle = '#ef4444'
              ctx.lineWidth = 2
              ctx.beginPath()
              ctx.moveTo(-e.radius * 0.5, -e.radius * 0.2)
              ctx.lineTo(0, e.radius * 0.3)
              ctx.lineTo(e.radius * 0.4, -e.radius * 0.1)
              ctx.stroke()

              // Overhead HP bar if takes >1 hit
              if (e.maxHp > 1) {
                ctx.restore()
                ctx.save()
                ctx.translate(e.x, e.y)
                ctx.fillStyle = '#18181b'
                ctx.fillRect(-14, -e.radius - 8, 28, 4)
                ctx.fillStyle = '#ef4444'
                ctx.fillRect(-14, -e.radius - 8, (28 * e.hp) / e.maxHp, 4)
              }
            } else if (e.type === 'sawblade') {
              ctx.shadowBlur = 12
              ctx.shadowColor = '#FF5C00'
              ctx.fillStyle = '#1c1917'
              ctx.beginPath()
              ctx.arc(0, 0, e.radius, 0, Math.PI * 2)
              ctx.fill()

              ctx.fillStyle = '#FF5C00'
              for (let t = 0; t < 10; t++) {
                const a = (t / 10) * Math.PI * 2
                ctx.beginPath()
                ctx.moveTo(Math.cos(a) * e.radius, Math.sin(a) * e.radius)
                ctx.lineTo(Math.cos(a + 0.15) * (e.radius + 6), Math.sin(a + 0.15) * (e.radius + 6))
                ctx.lineTo(Math.cos(a + 0.3) * e.radius, Math.sin(a + 0.3) * e.radius)
                ctx.fill()
              }

              ctx.fillStyle = '#EF4444'
              ctx.beginPath()
              ctx.arc(0, 0, e.radius * 0.3, 0, Math.PI * 2)
              ctx.fill()
            } else if (e.type === 'scout' || e.type === 'interceptor') {
              ctx.shadowBlur = 14
              ctx.shadowColor = '#EF4444'
              ctx.fillStyle = '#EF4444'

              for (let s = 0; s < 8; s++) {
                const a = (s / 8) * Math.PI * 2
                ctx.beginPath()
                ctx.moveTo(0, 0)
                ctx.lineTo(Math.cos(a) * (e.radius + 7), Math.sin(a) * (e.radius + 7))
                ctx.lineTo(Math.cos(a + 0.2) * (e.radius * 0.7), Math.sin(a + 0.2) * (e.radius * 0.7))
                ctx.fill()
              }

              ctx.fillStyle = '#09090b'
              ctx.beginPath()
              ctx.arc(0, 0, e.radius * 0.7, 0, Math.PI * 2)
              ctx.fill()
            } else if (e.type === 'alien_gunship') {
              ctx.shadowBlur = 14
              ctx.shadowColor = '#DC2626'

              ctx.fillStyle = '#18181b'
              ctx.strokeStyle = '#DC2626'
              ctx.lineWidth = 2
              ctx.beginPath()
              ctx.moveTo(0, e.radius)
              ctx.lineTo(e.radius * 0.9, -e.radius * 0.5)
              ctx.lineTo(-e.radius * 0.9, -e.radius * 0.5)
              ctx.closePath()
              ctx.fill()
              ctx.stroke()

              ctx.fillStyle = '#FF0033'
              ctx.beginPath()
              ctx.arc(0, 2, 5, 0, Math.PI * 2)
              ctx.fill()

              ctx.restore()
              ctx.save()
              ctx.translate(e.x, e.y)
              ctx.fillStyle = '#18181b'
              ctx.fillRect(-14, -e.radius - 8, 28, 4)
              ctx.fillStyle = '#DC2626'
              ctx.fillRect(-14, -e.radius - 8, (28 * e.hp) / e.maxHp, 4)
            }
          }

          ctx.restore()
        }

        // 12. PARTICLES & EMBERS UPDATE
        for (let i = state.embers.length - 1; i >= 0; i--) {
          const eb = state.embers[i]
          eb.x += eb.vx * dt
          eb.y += eb.vy * dt
          eb.alpha -= 0.04 * dt

          if (eb.alpha <= 0) {
            state.embers.splice(i, 1)
            continue
          }

          ctx.fillStyle = eb.color
          ctx.globalAlpha = Math.max(0, eb.alpha)
          ctx.beginPath()
          ctx.arc(eb.x, eb.y, eb.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = 1
        }

        for (let i = state.particles.length - 1; i >= 0; i--) {
          const pt = state.particles[i]
          if (pt.drag) {
            pt.vx *= Math.pow(pt.drag, dt)
            pt.vy *= Math.pow(pt.drag, dt)
          }
          if (pt.gravity) {
            pt.vy += pt.gravity * dt
          }
          pt.x += pt.vx * dt
          pt.y += pt.vy * dt
          pt.alpha -= pt.decay * dt

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

        // 13. BROKEN HEARTS SPLITTING ANIMATION
        for (let i = state.brokenHearts.length - 1; i >= 0; i--) {
          const bh = state.brokenHearts[i]
          bh.vy += 0.2 * dt
          bh.y += bh.vy * dt
          bh.alpha -= 0.02 * dt

          if (bh.alpha <= 0) {
            state.brokenHearts.splice(i, 1)
            continue
          }

          ctx.save()
          ctx.globalAlpha = Math.max(0, bh.alpha)
          ctx.font = 'bold 28px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.shadowBlur = 16
          ctx.shadowColor = '#FF2A6D'
          ctx.fillText('💔', bh.x, bh.y)
          ctx.restore()
        }

        // 14. FLOATING NOTIFICATION TEXTS
        for (let i = state.floatingTexts.length - 1; i >= 0; i--) {
          const ft = state.floatingTexts[i]
          ft.yOffset -= 1.4 * dt
          ft.alpha -= 0.018 * dt

          if (ft.alpha <= 0) {
            state.floatingTexts.splice(i, 1)
            continue
          }

          ctx.save()
          ctx.globalAlpha = Math.max(0, ft.alpha)
          ctx.fillStyle = ft.color
          ctx.shadowBlur = 10
          ctx.shadowColor = '#000000'
          ctx.font = `bold ${Math.round(13 * (ft.scale || 1))}px monospace`
          ctx.textAlign = 'center'
          ctx.fillText(ft.text, ft.x, ft.y + ft.yOffset)
          ctx.restore()
        }

        // 15. DRAW PLAYER ROCKET SHIP (High-End Detailed Metallic Silhouette)
        if (p.invulnerable % 8 < 4) {
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.tilt)

          const isOverdrive = state.overdriveTimer > 0 || state.weaponLevel === 5
          const isTriple = state.tripleLaserTimer > 0 || state.weaponLevel >= 2
          const flameColor = isOverdrive ? '#FFE600' : isTriple ? '#00E5FF' : '#FF5C00'

          // Connect flame length to actual acceleration and movement velocity
          const maxSpeedX = 420
          const maxSpeedY = 360
          const speedRatio = Math.min(1.6, Math.hypot(p.vx, p.vy) / Math.hypot(maxSpeedX, maxSpeedY))
          const flameLength = (16 + speedRatio * 24 + Math.sin(p.flameTime * 28) * 6) * (state.tempoMode === 'surge' ? 1.6 : 1.0)

          ctx.shadowBlur = isOverdrive ? 24 : 16
          ctx.shadowColor = flameColor

          // Outer Dual Thruster Flame
          ctx.fillStyle = flameColor
            ;[-7, 7].forEach(offset => {
              ctx.beginPath()
              ctx.moveTo(offset - 4, 18)
              ctx.lineTo(offset, 18 + flameLength)
              ctx.lineTo(offset + 4, 18)
            })

          ctx.restore()
        }

        animId = requestAnimationFrame(loop)
      }

      animId = requestAnimationFrame(loop)
      return () => cancelAnimationFrame(animId)
    }, [])

  return (
    <div className={`w-full max-w-2xl mx-auto font-sans select-none rounded-2xl border border-[#262626] bg-[#0c0c0e] shadow-2xl overflow-hidden flex flex-col ${gameState === 'playing' ? 'cursor-none' : ''}`}>
      {/* 🚀 REMOVE OS CURSOR EVERYWHERE WHILE PLAYING */}
      {gameState === 'playing' && (
        <style dangerouslySetInnerHTML={{ __html: '*, *::before, *::after { cursor: none !important; }' }} />
      )}

      {/* 🎮 ARCADE TOP HUD BAR (Strict fixed height h-14, never wraps or resizes!) */}
      <div className="h-14 bg-[#121212] border-b border-[#262626] px-3 sm:px-4 flex items-center justify-between text-xs font-mono select-none overflow-hidden shrink-0">
        {/* Left: Wave & Weapon Level */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-[#181818] border border-[#2a2a2a] px-2.5 py-1.5 rounded-lg shrink-0">
            <span className="px-1.5 py-0.5 rounded bg-studio-neon/20 text-studio-neon font-bold text-[10px]">
              W{currentWave}
            </span>
            <span className="text-[10px] text-zinc-400 font-bold leading-tight truncate max-w-[85px] sm:max-w-[120px]">
              {waveTitle.replace(`WAVE 0${currentWave}: `, '')}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-[#181818] border border-[#2a2a2a] px-2 py-1.5 rounded-lg text-[11px] shrink-0">
            <Crosshair className="w-3.5 h-3.5 text-studio-yellow" />
            <span className="text-zinc-400">LVL</span>
            <span className="font-bold text-studio-yellow">{weaponLevel}</span>
          </div>
        </div>

        {/* Center: Score & Combo */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-[#181818] border border-[#2a2a2a] px-2.5 py-1.5 rounded-lg shrink-0">
            <Flame className="w-3.5 h-3.5 text-studio-neon" />
            <span className="font-bold text-white text-xs sm:text-sm tracking-wider font-mono">{score.toLocaleString()}</span>
          </div>

          {combo > 1 && (
            <span className="px-1.5 py-1 rounded bg-studio-orange/20 text-studio-orange border border-studio-orange/40 font-bold text-[10px] sm:text-[11px] shrink-0">
              {combo}X
            </span>
          )}
        </div>

        {/* Right: HEARTS / BROKEN HEARTS LIVES & CONTROLS */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Hearts / Broken Hearts (Zero Shields!) */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-colors shrink-0 ${lives === 1
              ? 'bg-red-500/20 border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
              : 'bg-[#181818] border-[#2a2a2a]'
              }`}
            title={`${lives} of 3 Hearts remaining`}
          >
            {[1, 2, 3].map(heartIdx => (
              <span key={heartIdx} className="shrink-0">
                {heartIdx <= lives ? (
                  <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 fill-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]" />
                ) : (
                  <HeartCrack className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-600" />
                )}
              </span>
            ))}
          </div>

          {/* Pause Button */}
          <button
            type="button"
            onClick={togglePause}
            className="p-1.5 rounded-lg bg-[#181818] border border-[#2a2a2a] text-zinc-300 hover:text-white transition-all cursor-pointer shrink-0"
            title={gameState === 'paused' ? 'Resume Game' : 'Pause Game'}
          >
            {gameState === 'paused' ? <Play className="w-3.5 h-3.5 text-studio-neon" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-1.5 rounded-lg bg-[#181818] border border-[#2a2a2a] text-zinc-300 hover:text-white transition-all cursor-pointer shrink-0"
            title={soundOn ? 'Mute Game Sound' : 'Unmute Sound'}
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5 text-studio-neon" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-500" />}
          </button>
        </div>
      </div>

      {/* 🚀 MAIN GAME CANVAS (STRICT 520px FIXED HEIGHT, ZERO HTML CLUTTER, CURSOR-NONE) */}
      <div
        ref={containerRef}
        className="relative w-full h-[520px] bg-[#050507] overflow-hidden select-none shrink-0 cursor-none"
        style={{ cursor: 'none' }}
      >
        <canvas
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          className="w-full h-full block touch-none cursor-none"
          style={{ cursor: 'none' }}
        />

        {/* PAUSE OVERLAY */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20 space-y-4">
            <h3 className="text-2xl font-bold font-luckiest-guy tracking-wider text-white uppercase">
              GAME PAUSED
            </h3>
            <p className="text-xs text-zinc-400 font-mono">Press Escape or P to Resume</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={togglePause}
                className="px-6 py-2.5 rounded-xl bg-studio-neon text-black font-bold text-xs uppercase hover:scale-105 transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-black" /> RESUME
              </button>
              <button
                type="button"
                onClick={startGame}
                className="px-5 py-2.5 rounded-xl bg-[#181818] border border-white/20 text-white font-bold text-xs uppercase hover:bg-zinc-800 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> RESTART
              </button>
            </div>
          </div>
        )}

        {/* READY / START SCREEN (Minimalist) */}
        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20 space-y-3 animate-fadeIn">
            <button
              type="button"
              onClick={startGame}
              className="px-9 py-3 rounded-full bg-white text-black font-bold text-sm tracking-widest uppercase hover:bg-zinc-200 active:scale-95 transition-all shadow-[0_0_25px_rgba(255,255,255,0.3)] cursor-pointer"
            >
              START
            </button>
            <span className="text-[11px] font-mono text-zinc-400 tracking-wider uppercase">
              DRAG OR WASD TO FLY
            </span>
          </div>
        )}

        {/* GAME OVER SCREEN WITH DETAILED STATS */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/88 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20 space-y-3 animate-fadeIn">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase px-3 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/40 font-bold inline-block">
                💔 ALL HEARTS BROKEN
              </span>
              <h3 className="text-3xl font-bold font-luckiest-guy tracking-wider text-white pt-1">
                GAME OVER
              </h3>
            </div>

            {/* Run Statistics Card */}
            <div className="bg-[#141414] border border-[#2a2a2a] p-4 rounded-xl w-full max-w-xs space-y-1.5 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">FINAL SCORE:</span>
                <span className="font-bold text-white text-base">{endStats.finalScore.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-[#222222]">
                <span className="text-zinc-400">HIGH SCORE:</span>
                <span className="font-bold text-studio-yellow">{highScore.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-[#222222]">
                <span className="text-zinc-400">WAVES CLEARED:</span>
                <span className="font-bold text-studio-neon">{endStats.wavesCleared}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">BEST COMBO:</span>
                <span className="font-bold text-studio-orange">{endStats.bestCombo}X</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">ENEMIES DESTROYED:</span>
                <span className="font-bold text-white">{endStats.enemiesDestroyed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">NEAR MISSES:</span>
                <span className="font-bold text-cyan-400">{endStats.nearMisses}</span>
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
              className="px-7 py-3 rounded-xl bg-white text-black font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer flex items-center gap-2 font-mono uppercase"
            >
              <RotateCcw className="w-4 h-4 text-black" />
              PLAY AGAIN
            </button>
          </div>
        )}

        {/* 🏆 VICTORY / MISSION ACCOMPLISHED SCREEN */}
        {gameState === 'victory' && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20 space-y-3 animate-fadeIn">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase px-3 py-1 rounded bg-studio-neon/20 text-studio-neon border border-studio-neon/50 font-bold inline-block animate-pulse">
                🏆 MOTHERSHIP DESTROYED
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-luckiest-guy tracking-wider text-white pt-1">
                MISSION ACCOMPLISHED!
              </h3>
            </div>

            {/* Run Statistics Card */}
            <div className="bg-[#141414] border border-[#2a2a2a] p-4 rounded-xl w-full max-w-xs space-y-1.5 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">FINAL SCORE:</span>
                <span className="font-bold text-studio-neon text-base">{endStats.finalScore.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-[#222222]">
                <span className="text-zinc-400">HIGH SCORE:</span>
                <span className="font-bold text-studio-yellow">{highScore.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-[#222222]">
                <span className="text-zinc-400">WAVES CLEARED:</span>
                <span className="font-bold text-white">ALL 6 CLEARED!</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">BEST COMBO:</span>
                <span className="font-bold text-studio-orange">{endStats.bestCombo}X</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">ENEMIES DESTROYED:</span>
                <span className="font-bold text-white">{endStats.enemiesDestroyed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">NEAR MISSES:</span>
                <span className="font-bold text-cyan-400">{endStats.nearMisses}</span>
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
              className="px-7 py-3 rounded-xl bg-white text-black font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer flex items-center gap-2 font-mono uppercase"
            >
              <RotateCcw className="w-4 h-4 text-black" />
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

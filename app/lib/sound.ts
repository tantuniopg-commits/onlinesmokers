'use client'

// VELIS ses motoru - harici ses dosyası YOK. Her ton Web Audio ile gerçek
// zamanlı sentezleniyor: sıfır asset, sıfır lisans derdi, ~0 KB. Üç palet
// uygulamanın ruhunu (sakin, kontrollü, sıcak/amber, seramik) farklı
// taşıyor; 'off' tamamen sessiz. Ayar: lib/settings.ts sound.palette.
//
// iOS notu: AudioContext ilk kullanıcı hareketine kadar 'suspended'
// başlıyor. Tüm çağrı noktaları (obje dokunuşu, "Continue", top dokunuşu)
// zaten birer gesture handler'ı içinden geldiği için her play() öncesi
// ctx.resume() yeterli - ayrı bir "unlock" kancası gerekmiyor.

import { getStoredSettings } from './settings'
import type { SoundPalette } from './settings'

type Audio = { ctx: AudioContext; master: GainNode; noise: AudioBuffer }

let _audio: Audio | null = null
let _ambient: { stop: () => void } | null = null

function audio(): Audio | null {
  if (typeof window === 'undefined') return null
  try {
    if (!_audio) {
      const AC: typeof AudioContext =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AC) return null
      const ctx = new AC()
      const master = ctx.createGain()
      master.gain.value = 0.9
      master.connect(ctx.destination)
      // 2sn beyaz gürültü tamponu (breath paleti + nefes yatağı)
      const len = Math.floor(ctx.sampleRate * 2)
      const noise = ctx.createBuffer(1, len, ctx.sampleRate)
      const data = noise.getChannelData(0)
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
      _audio = { ctx, master, noise }
    }
    if (_audio.ctx.state === 'suspended') _audio.ctx.resume().catch(() => {})
    return _audio
  } catch {
    return null
  }
}

function activePalette(): SoundPalette {
  try {
    return getStoredSettings().sound.palette
  } catch {
    return 'ceramic'
  }
}

// ---- sentez yapı taşları -------------------------------------------------

type Voice = {
  freq: number
  dur: number
  type?: OscillatorType
  gain?: number
  attack?: number
  glideTo?: number
  filterHz?: number
  delay?: number
}

function voice(a: Audio, v: Voice) {
  const { ctx, master } = a
  const t0 = ctx.currentTime + (v.delay ?? 0)
  const osc = ctx.createOscillator()
  osc.type = v.type ?? 'sine'
  osc.frequency.setValueAtTime(v.freq, t0)
  if (v.glideTo) osc.frequency.exponentialRampToValueAtTime(v.glideTo, t0 + v.dur * 0.9)

  const g = ctx.createGain()
  const peak = v.gain ?? 0.14
  const atk = Math.max(0.004, v.attack ?? 0.008)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(peak, t0 + atk)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + v.dur)

  let node: AudioNode = osc
  if (v.filterHz) {
    const f = ctx.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.value = v.filterHz
    f.Q.value = 0.7
    osc.connect(f)
    node = f
  }
  node.connect(g)
  g.connect(master)
  osc.start(t0)
  osc.stop(t0 + v.dur + 0.05)
}

// Tibet çanağı: enharmonik kısmi tonlar + hafif "beating".
function bowlStrike(a: Audio, base: number, dur: number, gain = 0.13) {
  const ratios = [1, 2.76, 5.4, 8.93]
  ratios.forEach((r, i) =>
    voice(a, {
      freq: base * r,
      type: 'sine',
      dur: dur * (i === 0 ? 1 : 0.62 / i),
      gain: gain * (i === 0 ? 1 : 0.32 / i),
      attack: 0.005,
    })
  )
  voice(a, { freq: base * 1.004, type: 'sine', dur: dur * 0.9, gain: gain * 0.5, attack: 0.005 })
}

// Bantgeçiren gürültü süpürmesi (breath paleti).
function airSweep(
  a: Audio,
  opts: { dur: number; from: number; to: number; q?: number; gain?: number; delay?: number }
) {
  const { ctx, master, noise } = a
  const t0 = ctx.currentTime + (opts.delay ?? 0)
  const src = ctx.createBufferSource()
  src.buffer = noise
  src.loop = true
  const f = ctx.createBiquadFilter()
  f.type = 'bandpass'
  f.frequency.setValueAtTime(opts.from, t0)
  f.frequency.exponentialRampToValueAtTime(opts.to, t0 + opts.dur)
  f.Q.value = opts.q ?? 1
  const g = ctx.createGain()
  const peak = opts.gain ?? 0.09
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(peak, t0 + opts.dur * 0.4)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur)
  src.connect(f)
  f.connect(g)
  g.connect(master)
  src.start(t0)
  src.stop(t0 + opts.dur + 0.05)
}

// ---- olaylar -----------------------------------------------------------

export type SoundEvent = 'activate' | 'ready' | 'ritualStart' | 'orb' | 'complete' | 'reward'

function ceramic(a: Audio, evt: SoundEvent) {
  switch (evt) {
    case 'activate':
      voice(a, { freq: 220, type: 'triangle', dur: 0.4, gain: 0.11, filterHz: 1400 })
      voice(a, { freq: 277.2, type: 'triangle', dur: 0.52, gain: 0.09, filterHz: 1400, delay: 0.12 })
      break
    case 'ready':
      voice(a, { freq: 329.6, type: 'triangle', dur: 0.7, gain: 0.12, filterHz: 1600 })
      voice(a, { freq: 659.3, type: 'sine', dur: 0.5, gain: 0.035, delay: 0.02 })
      break
    case 'ritualStart':
      voice(a, { freq: 98, type: 'triangle', dur: 1.1, gain: 0.1, attack: 0.25, filterHz: 480 })
      voice(a, { freq: 196, type: 'sine', dur: 0.9, gain: 0.045, attack: 0.2, delay: 0.16 })
      break
    case 'orb':
      voice(a, {
        freq: 210 + Math.random() * 150,
        type: 'triangle',
        dur: 0.16,
        gain: 0.065,
        filterHz: 1900,
      })
      break
    case 'complete':
      ;[261.6, 329.6, 392.0].forEach((f, i) =>
        voice(a, {
          freq: f,
          type: 'triangle',
          dur: 1.4 - i * 0.18,
          gain: 0.1,
          filterHz: 1500,
          delay: i * 0.18,
        })
      )
      voice(a, { freq: 130.8, type: 'sine', dur: 1.8, gain: 0.045, attack: 0.1, delay: 0.36 })
      break
    case 'reward':
      ;[392.0, 523.3, 659.3, 784.0].forEach((f, i) =>
        voice(a, { freq: f, type: 'triangle', dur: 1.3 - i * 0.12, gain: 0.09, filterHz: 2200, delay: i * 0.1 })
      )
      break
  }
}

function bowl(a: Audio, evt: SoundEvent) {
  switch (evt) {
    case 'activate':
      bowlStrike(a, 330, 1.1, 0.11)
      break
    case 'ready':
      bowlStrike(a, 392, 1.5, 0.12)
      break
    case 'ritualStart':
      bowlStrike(a, 261.6, 2.4, 0.13)
      break
    case 'orb':
      bowlStrike(a, 784, 0.4, 0.045)
      break
    case 'complete':
      bowlStrike(a, 261.6, 3.0, 0.11)
      bowlStrike(a, 392.0, 2.6, 0.07)
      break
    case 'reward':
      bowlStrike(a, 523.3, 2.8, 0.1)
      bowlStrike(a, 784.0, 2.2, 0.06)
      break
  }
}

function breath(a: Audio, evt: SoundEvent) {
  switch (evt) {
    case 'activate':
      airSweep(a, { dur: 0.5, from: 300, to: 900, q: 1.2, gain: 0.1 })
      break
    case 'ready':
      airSweep(a, { dur: 0.5, from: 820, to: 320, q: 1.2, gain: 0.09 })
      break
    case 'ritualStart':
      airSweep(a, { dur: 1.3, from: 240, to: 760, q: 1, gain: 0.09 })
      break
    case 'orb':
      airSweep(a, { dur: 0.09, from: 1800, to: 2500, q: 2.5, gain: 0.05 })
      voice(a, { freq: 880, type: 'sine', dur: 0.1, gain: 0.018 })
      break
    case 'complete':
      airSweep(a, { dur: 2.2, from: 720, to: 200, q: 1, gain: 0.09 })
      voice(a, { freq: 130.8, type: 'sine', dur: 2.4, gain: 0.028, attack: 0.2 })
      break
    case 'reward':
      airSweep(a, { dur: 1.8, from: 400, to: 1800, q: 1.4, gain: 0.08 })
      voice(a, { freq: 659.3, type: 'sine', dur: 1.6, gain: 0.025, attack: 0.15 })
      break
  }
}

// Bir ritüel olayının sesini çal. `force` verilirse ayardaki palet yerine
// onu kullanır (Ayarlar ekranındaki önizleme için).
export function playSound(evt: SoundEvent, force?: SoundPalette) {
  const p = force ?? activePalette()
  if (p === 'off') return
  const a = audio()
  if (!a) return
  try {
    if (p === 'ceramic') ceramic(a, evt)
    else if (p === 'bowl') bowl(a, evt)
    else if (p === 'breath') breath(a, evt)
  } catch {
    // sentez desteklenmiyorsa sessizce geç
  }
}

// ---- ritüel yatağı (30sn boyunca çok kısık ambient) --------------------

export function startAmbient() {
  stopAmbient()
  const p = activePalette()
  if (p === 'off') return
  const a = audio()
  if (!a) return
  const { ctx, master, noise } = a
  try {
    const bus = ctx.createGain()
    bus.gain.setValueAtTime(0.0001, ctx.currentTime)
    bus.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 2.5)
    bus.connect(master)
    const stops: Array<(t: number) => void> = []

    if (p === 'ceramic' || p === 'bowl') {
      const roots = p === 'bowl' ? [130.8, 196.0] : [98.0, 146.8]
      roots.forEach((f, i) => {
        const o1 = ctx.createOscillator()
        o1.type = 'sine'
        o1.frequency.value = f
        const o2 = ctx.createOscillator()
        o2.type = 'sine'
        o2.frequency.value = f * 1.006
        const lp = ctx.createBiquadFilter()
        lp.type = 'lowpass'
        lp.frequency.value = 420
        const g = ctx.createGain()
        g.gain.value = i === 0 ? 0.042 : 0.026
        // yavaş nefes/tremolo
        const lfo = ctx.createOscillator()
        lfo.type = 'sine'
        lfo.frequency.value = 0.09 + i * 0.02
        const lfoGain = ctx.createGain()
        lfoGain.gain.value = i === 0 ? 0.018 : 0.011
        lfo.connect(lfoGain)
        lfoGain.connect(g.gain)
        o1.connect(lp)
        o2.connect(lp)
        lp.connect(g)
        g.connect(bus)
        o1.start()
        o2.start()
        lfo.start()
        stops.push((t) => {
          o1.stop(t)
          o2.stop(t)
          lfo.stop(t)
        })
      })
    } else {
      // breath - bantgeçiren gürültü, ~8sn'de bir nefes
      const src = ctx.createBufferSource()
      src.buffer = noise
      src.loop = true
      const bp = ctx.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.value = 480
      bp.Q.value = 0.8
      const g = ctx.createGain()
      g.gain.value = 0.045
      const lfo = ctx.createOscillator()
      lfo.type = 'sine'
      lfo.frequency.value = 0.125
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 0.038
      lfo.connect(lfoGain)
      lfoGain.connect(g.gain)
      src.connect(bp)
      bp.connect(g)
      g.connect(bus)
      src.start()
      lfo.start()
      stops.push((t) => {
        src.stop(t)
        lfo.stop(t)
      })
    }

    _ambient = {
      stop: () => {
        try {
          const t = ctx.currentTime
          const cur = Math.max(bus.gain.value, 0.0001)
          bus.gain.cancelScheduledValues(t)
          bus.gain.setValueAtTime(cur, t)
          bus.gain.exponentialRampToValueAtTime(0.0001, t + 1.2)
          stops.forEach((s) => s(t + 1.4))
        } catch {
          // yok say
        }
      },
    }
  } catch {
    // yok say
  }
}

export function stopAmbient() {
  if (_ambient) {
    _ambient.stop()
    _ambient = null
  }
}

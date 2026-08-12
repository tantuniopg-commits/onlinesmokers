// Central VELIS application lifecycle manager - the single source of truth
// for "where is this user in the VELIS experience?" (as distinct from
// AuthService, which answers "who is this user?"). No screen should derive
// onboarding/gating state independently - everything funnels through here.
//
// Import direction is deliberately one-way: this file only reads from
// lib/*.ts (never from services/AuthService.ts or any other service), so
// AuthService can safely import FROM here (to report real auth events)
// without creating a circular dependency.
import { getStoredUser, saveUser, clearUser, getStoredStats, saveStats, clearStats, clearToken } from '../lib/auth'
import type { VelisUser, VelisStats } from '../lib/auth'
import { hasSeenWelcome, markWelcomeSeen, clearWelcomeSeen, saveUserType, clearUserType } from '../lib/onboarding'
import { getCooldownRemainingMs, formatCooldown } from '../lib/journey'
import { getDevTimeOffsetMs } from '../lib/time'
import { isDev } from '../constants/env'
import { clearGuideCompleted } from '../lib/guide'

export type AppLifecycleState = 'FIRST_LAUNCH' | 'FIRST_RITUAL_COMPLETED' | 'GUEST' | 'REGISTERING' | 'REGISTERED'

const LIFECYCLE_KEY = 'velis_lifecycle_state'

const VALID_STATES: AppLifecycleState[] = [
  'FIRST_LAUNCH',
  'FIRST_RITUAL_COMPLETED',
  'GUEST',
  'REGISTERING',
  'REGISTERED',
]

function isValidState(value: string | null): value is AppLifecycleState {
  return !!value && (VALID_STATES as string[]).includes(value)
}

// Sadece bu anahtar hiç yazılmamışsa (bu değişiklikten ÖNCEKİ yerel veri)
// bir kerelik kullanılıyor - normalde her gerçek geçiş noktası setAppState'i
// açıkça çağırıyor, burada tahmin yürütülmüyor.
function deriveInitialState(): AppLifecycleState {
  if (getStoredUser()) return 'REGISTERED'
  if (getStoredStats().journeyTimestamp !== null) return 'GUEST'
  return 'FIRST_LAUNCH'
}

export function getAppState(): AppLifecycleState {
  if (typeof window === 'undefined') return 'FIRST_LAUNCH'
  const stored = window.localStorage.getItem(LIFECYCLE_KEY)
  if (isValidState(stored)) return stored
  const derived = deriveInitialState()
  window.localStorage.setItem(LIFECYCLE_KEY, derived)
  return derived
}

export function setAppState(state: AppLifecycleState): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LIFECYCLE_KEY, state)
}

// Developer Panel'in Reset bölümü / factoryReset için.
export function clearAppStateKey(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(LIFECYCLE_KEY)
}

const FIXTURE_STATS: VelisStats = {
  journeyDay: 1,
  currentStreak: 1,
  journeyTimestamp: Date.now(),
  totalXP: 10,
  totalRitualCount: 1,
  totalRitualTimeSec: 90,
}

const FIXTURE_USER: VelisUser = { firstName: 'Dev', lastName: 'User', email: 'dev@example.com' }

// Developer Panel'in "Application State" bölümü için - herhangi bir yaşam
// döngüsü durumuna anında atlıyor. Altındaki verileri de o durumla tutarlı
// hale getiriyor (hesap/istatistik/welcome bayrağı) ve o durumu temsil eden
// ekrana sert bir yenilemeyle gidiyor - factoryReset ile aynı yaklaşım,
// ağaçta hiçbir eski React state'i hayatta kalmasın diye.
export function devJumpToState(state: AppLifecycleState): void {
  if (!isDev || typeof window === 'undefined') return

  switch (state) {
    case 'FIRST_LAUNCH':
      clearUser()
      clearStats()
      clearToken()
      clearWelcomeSeen()
      clearUserType()
      clearGuideCompleted()
      setAppState('FIRST_LAUNCH')
      window.location.href = '/'
      return
    case 'FIRST_RITUAL_COMPLETED':
      clearUser()
      clearToken()
      markWelcomeSeen()
      saveUserType('Smoker')
      saveStats(FIXTURE_STATS)
      setAppState('FIRST_RITUAL_COMPLETED')
      window.location.href = '/aftercare?firstRitual=1'
      return
    case 'GUEST':
      clearUser()
      clearToken()
      markWelcomeSeen()
      saveUserType('Smoker')
      saveStats(FIXTURE_STATS)
      setAppState('GUEST')
      window.location.href = '/journey'
      return
    case 'REGISTERING':
      clearUser()
      clearToken()
      markWelcomeSeen()
      saveUserType('Smoker')
      saveStats(FIXTURE_STATS)
      setAppState('REGISTERING')
      window.location.href = '/profile'
      return
    case 'REGISTERED':
      saveUser(FIXTURE_USER)
      markWelcomeSeen()
      saveUserType('Smoker')
      saveStats(FIXTURE_STATS)
      setAppState('REGISTERED')
      window.location.href = '/profile'
      return
  }
}

export type LifecycleDebugInfo = {
  appState: AppLifecycleState
  journeyDay: number
  totalXP: number
  currentStreak: number
  hasAccount: boolean
  hasSeenWelcome: boolean
  hasCompletedFirstRitual: boolean
  registrationComplete: boolean
  devTimeOffsetMs: number
  countdown: string
}

// Developer Panel'in Debug bölümü için - hepsi zaten var olan servislerin
// birer okuması, burada yeni bir depolama icat edilmiyor.
export function getLifecycleDebugInfo(): LifecycleDebugInfo {
  const stats = getStoredStats()
  const cooldownMs = getCooldownRemainingMs(stats.journeyTimestamp)
  const appState = getAppState()

  return {
    appState,
    journeyDay: stats.journeyDay,
    totalXP: stats.totalXP,
    currentStreak: stats.currentStreak,
    hasAccount: !!getStoredUser(),
    hasSeenWelcome: hasSeenWelcome(),
    hasCompletedFirstRitual: stats.journeyTimestamp !== null,
    registrationComplete: appState === 'REGISTERED',
    devTimeOffsetMs: getDevTimeOffsetMs(),
    countdown: cooldownMs !== null ? formatCooldown(cooldownMs) : 'Available now',
  }
}

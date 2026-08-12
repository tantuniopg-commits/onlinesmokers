'use client'

import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { TabKey } from '../BottomNav'
import { getAppState } from '../services/AppStateManager'
import type { AppLifecycleState } from '../services/AppStateManager'

// Global nav durumu - dört iş görüyor:
// 1) introActive: '/' rotasındaki splash/logo/aktivasyon akışı oynarken alt
//    navigasyonu gizlemek için (Home bileşeni bunu set ediyor). Layout'taki
//    GlobalNav bu context'i okuyup gösterip göstermeyeceğine karar veriyor -
//    Home ile GlobalNav aynı bileşen ağacında değil (biri layout'ta, biri
//    page'de) o yüzden context gerekiyor.
// 2) tabMemory: her sekmenin en son ziyaret edilen alt-yolunu hatırlıyor,
//    böylece "Journey -> Day 35 -> Leaderboard -> Journey" senaryosunda
//    kullanıcı Journey'e dönünce kök sayfaya değil kaldığı yere dönüyor.
// 3) appState: TEK gerçek kaynak - bkz. services/AppStateManager.ts. `unlocked`
//    ve `guidedRegistrationActive` bundan TÜRETİLİYOR (ayrı state değiller),
//    context'te tutuluyor çünkü hesap oluşturma "/profile" rotası İÇİNDE, URL
//    değişmeden oluyor; pathname'e bağlı bir effect bunu asla yakalayamaz.
//    Gerçek bir geçiş olduğunda (hesap oluşturma, Aftercare Continue, vb.)
//    ilgili ekran AppStateManager.setAppState(...) çağırıp ardından
//    refreshAppState() ile bu context'i hemen güncelliyor.
// 4) introPlayed: splash+logo+aktivasyon SADECE bu oturumda ilk kez '/'e
//    gelindiğinde oynuyor - kullanıcı Ritual sekmesine tekrar tekrar
//    dokunduğunda her seferinde ~6-7sn'lik introyu tekrar oynatmak
//    "unobtrusive" navigasyon hedefiyle çelişir. Provider layout'ta bir kere
//    mount olduğu için bu bayrak istemci-taraflı gezinmeler boyunca kalıcı,
//    sadece gerçek bir sayfa yenilemesinde sıfırlanıyor - tam istenen davranış.

type TabMemory = Record<TabKey, string>

const DEFAULT_TAB_PATHS: TabMemory = {
  journey: '/journey',
  ritual: '/',
  leaderboard: '/leaderboard',
  profile: '/profile',
}

type AppNavContextValue = {
  introActive: boolean
  setIntroActive: (active: boolean) => void
  // İlk kullanıcının İLK ritüeli sırasında (activating/ready/ritual fazları)
  // true - o an alt navigasyonu tamamen gizleyip Profile'a kaçarak süreyi
  // atlamayı engelliyor (bkz. app/page.tsx Landing). Sadece gerçekten hiç
  // ritüel tamamlamamış kullanıcı için devreye giriyor - kayıtlı/normal
  // kullanıcıların günlük ritüelleri hiç etkilenmiyor.
  ritualLockActive: boolean
  setRitualLockActive: (active: boolean) => void
  // GUEST'in Day 1 Journey ekranı önce kısaca gösterilip sonra kararıyor
  // (bkz. app/journey/page.tsx DIM_DELAY_MS) - bu ekran kararana kadar alt
  // navigasyon tamamen gizli kalıyor, kararınca (dimmed=true) normal akış
  // (Profile nabzı vb.) devam ediyor.
  journeyRevealPending: boolean
  setJourneyRevealPending: (pending: boolean) => void
  tabMemory: TabMemory
  rememberPath: (tab: TabKey, path: string) => void
  appState: AppLifecycleState
  unlocked: boolean
  guidedRegistrationActive: boolean
  refreshAppState: () => void
  introPlayed: boolean
  markIntroPlayed: () => void
  resetIntroPlayed: () => void
}

const AppNavContext = createContext<AppNavContextValue | null>(null)

export function AppNavProvider({ children }: { children: ReactNode }) {
  const [introActive, setIntroActive] = useState(false)
  const [ritualLockActive, setRitualLockActive] = useState(false)
  const [journeyRevealPending, setJourneyRevealPending] = useState(false)
  const [tabMemory, setTabMemory] = useState<TabMemory>(DEFAULT_TAB_PATHS)
  const [appState, setAppStateLocal] = useState<AppLifecycleState>('FIRST_LAUNCH')
  const [introPlayed, setIntroPlayed] = useState(false)

  const refreshAppState = useCallback(() => {
    setAppStateLocal(getAppState())
  }, [])

  useEffect(() => {
    refreshAppState()
  }, [refreshAppState])

  const unlocked = appState === 'REGISTERED'
  const guidedRegistrationActive = appState === 'GUEST' || appState === 'REGISTERING'

  const rememberPath = useCallback((tab: TabKey, path: string) => {
    setTabMemory((prev) => (prev[tab] === path ? prev : { ...prev, [tab]: path }))
  }, [])

  const markIntroPlayed = useCallback(() => setIntroPlayed(true), [])
  // Developer Panel'in "Replay Splash" kontrolü için (bkz.
  // devpanel/sections/Animations) - introu bir sonraki '/' ziyaretinde
  // tekrar oynatılabilir hale getiriyor.
  const resetIntroPlayed = useCallback(() => setIntroPlayed(false), [])

  const value = useMemo(
    () => ({
      introActive,
      setIntroActive,
      ritualLockActive,
      setRitualLockActive,
      journeyRevealPending,
      setJourneyRevealPending,
      tabMemory,
      rememberPath,
      appState,
      unlocked,
      guidedRegistrationActive,
      refreshAppState,
      introPlayed,
      markIntroPlayed,
      resetIntroPlayed,
    }),
    [
      introActive,
      ritualLockActive,
      journeyRevealPending,
      tabMemory,
      rememberPath,
      appState,
      unlocked,
      guidedRegistrationActive,
      refreshAppState,
      introPlayed,
      markIntroPlayed,
      resetIntroPlayed,
    ]
  )

  return <AppNavContext.Provider value={value}>{children}</AppNavContext.Provider>
}

export function useAppNav() {
  const ctx = useContext(AppNavContext)
  if (!ctx) throw new Error('useAppNav must be used within AppNavProvider')
  return ctx
}

'use client'

import { useCallback, useEffect, useState } from 'react'
import { isDev, getRitualDurationSec, getDevCooldownOverrideMs } from '../services/DeveloperService'
import { JOURNEY_COOLDOWN_MS } from '../services/JourneyService'

const POLL_MS = 1000

// Developer Panel bölümlerinin okuduğu dev-only durum - ritüel süresi ve
// soğuma geçersiz kılması iki farklı bölümden (RitualConfig, Cooldown)
// değiştirilebildiği için düzenli olarak tazeleniyor (bkz. eski
// RitualConfig.tsx'teki inline useEffect/setInterval deseni).
export function useDevFlags() {
  const [ritualDurationSec, setRitualDurationSec] = useState(getRitualDurationSec)
  const [cooldownMs, setCooldownMs] = useState(() => getDevCooldownOverrideMs() ?? JOURNEY_COOLDOWN_MS)

  const refresh = useCallback(() => {
    setRitualDurationSec(getRitualDurationSec())
    setCooldownMs(getDevCooldownOverrideMs() ?? JOURNEY_COOLDOWN_MS)
  }, [])

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, POLL_MS)
    return () => clearInterval(interval)
  }, [refresh])

  return { isDev, ritualDurationSec, cooldownMs, refresh }
}

'use client'

import { useEffect, useState } from 'react'
import SectionCard, { Row } from '../SectionCard'
import { getStoredStats } from '../../lib/auth'
import type { VelisStats } from '../../lib/auth'
import { getCooldownRemainingMs, formatCooldown } from '../../lib/journey'

function formatTimestamp(ts: number | null) {
  if (ts === null) return '—'
  return new Date(ts).toLocaleString()
}

// Bu bölümün kendi 1sn'lik döngüsü var - Journey Controls/Time Machine/
// Cooldown bölümlerinden gelen HER değişikliği otomatik olarak yansıtıyor,
// ayrı bir "yenile" sinyaline gerek yok.
export default function LiveJourneyStateSection() {
  const [stats, setStats] = useState<VelisStats | null>(null)

  useEffect(() => {
    const tick = () => setStats(getStoredStats())
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!stats) return null

  const cooldownMs = getCooldownRemainingMs(stats.journeyTimestamp)
  const nextUnlockAt =
    stats.journeyTimestamp !== null && cooldownMs !== null
      ? formatTimestamp(stats.journeyTimestamp + (cooldownMs > 0 ? cooldownMs : 0))
      : 'Available now'

  return (
    <SectionCard title="Live Journey State">
      <Row label="Current Journey Day" value={stats.journeyDay} />
      <Row label="Current Streak" value={`${stats.currentStreak} day${stats.currentStreak === 1 ? '' : 's'}`} />
      <Row label="Total XP" value={stats.totalXP} />
      <Row label="Total Rituals" value={stats.totalRitualCount} />
      <Row label="Current Cooldown" value={cooldownMs !== null ? formatCooldown(cooldownMs) : 'None'} />
      <Row label="Journey Timestamp" value={formatTimestamp(stats.journeyTimestamp)} />
      <Row label="Next Journey Unlock" value={nextUnlockAt} />
    </SectionCard>
  )
}

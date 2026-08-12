'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SectionCard from '../SectionCard'
import { buttonStyle, buttonGridStyle, colors, SANS } from '../styles'
import { completeRitual } from '../../lib/journey'
import { getRitualDurationSec } from '../../lib/ritualConfig'

// "Complete Ritual" ve "Simulate Ritual" AYNI completeRitual() servisini
// çağırıyor - gerçek '/' sayfasının ritüel bittiğinde çağırdığı fonksiyonun
// birebir aynısı, şu an yapılandırılmış süreyle (bkz. lib/ritualConfig.ts),
// aktivasyon + ritüel beklemeden. Bu yüzden Journey/XP iş kuralı (24 saatlik
// soğuma vb.) hiç atlanmıyor - sadece gerçek zamanı beklemeden tetikleniyor.
export default function RitualSection({ onNavigate }: { onNavigate: () => void }) {
  const router = useRouter()
  const [lastResult, setLastResult] = useState<string | null>(null)

  const simulate = () => {
    const stats = completeRitual(getRitualDurationSec())
    setLastResult(`Simulated. Day ${stats.journeyDay}, ${stats.totalXP} XP total.`)
  }

  const complete = () => {
    completeRitual(getRitualDurationSec())
    onNavigate()
    router.push('/aftercare')
  }

  return (
    <SectionCard title="Ritual">
      <div style={buttonGridStyle}>
        <button style={buttonStyle()} onClick={simulate}>
          Simulate Ritual
        </button>
        <button style={buttonStyle('primary')} onClick={complete}>
          Complete Ritual
        </button>
        <button style={{ ...buttonStyle(), opacity: 0.4, cursor: 'not-allowed' }} disabled title="Not yet implemented">
          Fail Ritual (future support)
        </button>
      </div>
      {lastResult && <p style={{ margin: 0, fontFamily: SANS, fontSize: '12px', color: colors.muted }}>{lastResult}</p>}
    </SectionCard>
  )
}

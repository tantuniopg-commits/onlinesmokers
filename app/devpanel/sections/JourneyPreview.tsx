'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SectionCard from '../SectionCard'
import { buttonStyle, inputStyle, colors, SANS } from '../styles'

// Gerçek ilerlemeyi YOKSAYARAK herhangi bir Journey Day'in tamamlanma
// ekranını açıyor - "?preview=1&previewDay=N" ile app/aftercare sayfasına
// gidiyor (bkz. aftercare/page.tsx'teki preview-mode kontrolü).
export default function JourneyPreviewSection({ onNavigate }: { onNavigate: () => void }) {
  const router = useRouter()
  const [day, setDay] = useState('42')

  const open = () => {
    const n = Math.max(1, Number(day) || 1)
    onNavigate()
    router.push(`/aftercare?preview=1&previewDay=${n}`)
  }

  return (
    <SectionCard title="Journey Preview">
      <p style={{ margin: 0, fontFamily: SANS, fontSize: '12px', color: colors.muted }}>
        Opens the Day Completion Screen for any day, ignoring real unlock progress.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontFamily: SANS, fontSize: '13px', color: colors.white }}>Preview Day</span>
        <input value={day} onChange={(e) => setDay(e.target.value)} type="number" min={1} style={{ ...inputStyle, width: '80px' }} />
        <button style={buttonStyle('primary')} onClick={open}>
          Open
        </button>
      </div>
    </SectionCard>
  )
}

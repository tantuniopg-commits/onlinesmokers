'use client'

import { useEffect, useMemo, useState } from 'react'
import { getChapterForDay, getJourneyDayContent } from '../lib/journeyContent'
import { getOverride, setOverride, clearOverride } from '../lib/journeyContentOverrides'
import { buttonStyle, inputStyle, colors, SANS, SANS_DISPLAY } from './styles'

// Journey İçerik Deposu'nu düzenleyen paylaşılan bileşen - hem
// /admin/journey-content (bağımsız sayfa) hem de Developer Panel'in
// "Message Editor" bölümü BUNU kullanıyor, aynı mantığı iki yerde
// tekrarlamamak için. Düzenlemeler journeyContentOverrides.ts üzerinden
// localStorage'a yazılıyor ve getJourneyDayContent() çağıran HER yerde
// (gerçek tamamlanma ekranı dahil) anında yansıyor.
export default function JourneyContentEditor({ initialDay = 1 }: { initialDay?: number }) {
  const [day, setDay] = useState(initialDay)
  const [dayInput, setDayInput] = useState(String(initialDay))
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [quote, setQuote] = useState('')
  const [xp, setXp] = useState('10')
  const [hasOverride, setHasOverride] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)

  const chapter = useMemo(() => getChapterForDay(day), [day])

  const loadDay = (targetDay: number) => {
    const content = getJourneyDayContent(targetDay)
    setTitle(content.title)
    setSubtitle(content.subtitle)
    setQuote(content.quote ?? '')
    setXp(String(content.xp))
    setHasOverride(!!getOverride(targetDay))
  }

  useEffect(() => {
    loadDay(day)
     
  }, [day])

  const goToDay = (n: number) => {
    const clamped = Math.max(1, n)
    setDay(clamped)
    setDayInput(String(clamped))
  }

  const handleSave = () => {
    setOverride(day, { title, subtitle, quote: quote.trim() ? quote : undefined, xp: Number(xp) || 0 })
    setHasOverride(true)
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1500)
  }

  const handleReset = () => {
    clearOverride(day)
    loadDay(day)
  }

  const titleLines = title.split('\n')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => goToDay(day - 1)} style={buttonStyle()}>
          ← Prev
        </button>
        <input
          value={dayInput}
          onChange={(e) => setDayInput(e.target.value)}
          onBlur={() => goToDay(Number(dayInput) || 1)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') goToDay(Number(dayInput) || 1)
          }}
          style={{ ...inputStyle, width: '70px', textAlign: 'center' }}
        />
        <button onClick={() => goToDay(day + 1)} style={buttonStyle()}>
          Next →
        </button>
      </div>

      <div style={{ fontFamily: SANS, fontSize: '12px', color: colors.amber }}>
        Chapter {chapter.number} · {chapter.theme} · Days {chapter.startDay}–{chapter.endDay}
        {hasOverride && <span style={{ marginLeft: '10px', color: '#7FBF7F' }}>(edited — override active)</span>}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label style={fieldLabelStyle}>
          Title (use \n for a line break)
          <textarea value={title} onChange={(e) => setTitle(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
        </label>
        <label style={fieldLabelStyle}>
          Subtitle
          <textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
        </label>
        <label style={fieldLabelStyle}>
          Quote (optional)
          <input value={quote} onChange={(e) => setQuote(e.target.value)} style={inputStyle} />
        </label>
        <label style={fieldLabelStyle}>
          XP Reward
          <input value={xp} onChange={(e) => setXp(e.target.value)} type="number" style={{ ...inputStyle, width: '120px' }} />
        </label>
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={handleSave} style={buttonStyle('primary')}>
          Save
        </button>
        <button onClick={handleReset} style={buttonStyle()}>
          Reset to default
        </button>
        <button onClick={() => setShowPreview((v) => !v)} style={buttonStyle()}>
          {showPreview ? 'Hide' : 'Show'} preview
        </button>
        {savedFlash && <span style={{ fontFamily: SANS, fontSize: '12px', color: '#7FBF7F' }}>Saved.</span>}
      </div>

      {showPreview && (
        <div
          style={{
            padding: '32px 20px',
            borderRadius: '18px',
            background: colors.background,
            border: `1px solid ${colors.cardBorder}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '14px',
          }}
        >
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: '11px', letterSpacing: '2.2px', textTransform: 'uppercase', color: colors.amber }}>
            Day {day}
          </div>
          <h2
            style={{
              margin: 0,
              fontFamily: '"New York", Georgia, "Times New Roman", serif',
              fontWeight: 400,
              fontSize: '26px',
              lineHeight: 1.18,
              color: colors.white,
            }}
          >
            {titleLines.map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h2>
          <p style={{ margin: 0, fontFamily: SANS, fontWeight: 300, fontSize: '14px', color: '#D2CCC5' }}>{subtitle}</p>
          {quote && <p style={{ margin: 0, fontSize: '12px', fontStyle: 'italic', color: colors.muted }}>&ldquo;{quote}&rdquo;</p>}
          <div
            style={{
              fontFamily: SANS_DISPLAY,
              fontWeight: 500,
              fontSize: '13px',
              letterSpacing: '1.2px',
              color: colors.amber,
              padding: '9px 20px',
              borderRadius: '999px',
              border: '1px solid rgba(255, 178, 90, 0.3)',
              background: 'rgba(255, 178, 90, 0.03)',
            }}
          >
            +{xp || 0} XP
          </div>
        </div>
      )}
    </div>
  )
}

const fieldLabelStyle = {
  display: 'flex' as const,
  flexDirection: 'column' as const,
  gap: '6px',
  fontFamily: SANS,
  fontSize: '12px',
  color: colors.muted,
}

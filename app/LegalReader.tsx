'use client'

import { useRef } from 'react'
import type { UIEvent } from 'react'
import { FONT_SANS } from './lib/typography'
import type { LegalDocument } from './lib/legalDocuments'
import { useLocale } from './contexts/LocaleContext'

// Apple tarzı okuma sayfası - Privacy Policy / Terms of Service için (bkz.
// app/profile/page.tsx). Native scroll (tarayıcının kendi scroll'u, sahte
// bir scroll değil), üstte ince bir okuma ilerleme çubuğu, altta sabit
// "I Understand" butonu.
export default function LegalReader({
  doc,
  progress,
  onProgress,
  onBack,
  onUnderstand,
}: {
  doc: LegalDocument
  progress: number
  onProgress: (percent: number) => void
  onBack: () => void
  onUnderstand: () => void
}) {
  const { t } = useLocale()
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const max = el.scrollHeight - el.clientHeight
    onProgress(max > 0 ? Math.min(100, Math.max(0, (el.scrollTop / max) * 100)) : 100)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 65,
        background: '#050505',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Sabit üst bar - geri butonu + küçük başlık + okuma ilerleme çubuğu. */}
      <div style={{ flexShrink: 0, paddingTop: 'calc(16px + env(safe-area-inset-top))' }}>
        <div style={{ width: '100%', maxWidth: '560px', margin: '0 auto', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
          <button
            onClick={onBack}
            aria-label="Back"
            style={{ position: 'absolute', left: 20, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '4px' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 5L8 12L15 19" stroke="#F5F0EA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span style={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: '15px', color: '#F5F0EA' }}>{doc.title}</span>
        </div>
        <div style={{ marginTop: '14px', height: '2px', background: 'rgba(255, 255, 255, 0.08)' }}>
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: '#E3C08C',
              transition: 'width 120ms ease-out',
            }}
          />
        </div>
      </div>

      {/* Native scroll - tarayıcının kendi kaydırması, kendi momentumu. */}
      <div ref={scrollRef} onScroll={handleScroll} style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ width: '100%', maxWidth: '560px', margin: '0 auto', padding: '28px 20px 40px' }}>
          <h1 style={{ margin: 0, fontFamily: FONT_SANS, fontWeight: 700, fontSize: '32px', color: '#F5F0EA', letterSpacing: '-0.01em' }}>
            {doc.title}
          </h1>
          <div style={{ marginTop: '8px', fontFamily: FONT_SANS, fontWeight: 500, fontSize: '13px', color: '#8F8A83' }}>{doc.lastUpdated}</div>

          {doc.intro.map((p, i) => (
            <p key={i} style={{ marginTop: i === 0 ? '24px' : '12px', fontFamily: FONT_SANS, fontWeight: 400, fontSize: '15px', lineHeight: 1.6, color: '#D2CCC5' }}>
              {p}
            </p>
          ))}

          {doc.sections.map((section) => (
            <div key={section.heading} style={{ marginTop: '32px' }}>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', marginBottom: '20px' }} />
              <h2 style={{ margin: 0, fontFamily: FONT_SANS, fontWeight: 600, fontSize: '19px', color: '#F5F0EA' }}>{section.heading}</h2>
              {section.paragraphs?.map((p, i) => (
                <p key={i} style={{ marginTop: '10px', fontFamily: FONT_SANS, fontWeight: 400, fontSize: '15px', lineHeight: 1.6, color: '#D2CCC5' }}>
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul style={{ margin: '10px 0 0', paddingLeft: '20px' }}>
                  {section.bullets.map((b, i) => (
                    <li key={i} style={{ fontFamily: FONT_SANS, fontWeight: 400, fontSize: '15px', lineHeight: 1.6, color: '#D2CCC5' }}>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              {section.afterBullets?.map((p, i) => (
                <p key={i} style={{ marginTop: '10px', fontFamily: FONT_SANS, fontWeight: 400, fontSize: '15px', lineHeight: 1.6, color: '#D2CCC5' }}>
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Sabit alt bar - "I Understand". */}
      <div
        style={{
          flexShrink: 0,
          padding: '16px 20px calc(16px + env(safe-area-inset-bottom))',
          background: 'linear-gradient(180deg, rgba(5,5,5,0) 0%, #050505 40%)',
        }}
      >
        <div style={{ width: '100%', maxWidth: '560px', margin: '0 auto' }}>
          <button
            className="velis-primary-btn"
            onClick={onUnderstand}
            style={{
              width: '100%',
              padding: '15px 0',
              borderRadius: '999px',
              border: '1px solid rgba(255, 178, 90, 0.5)',
              background: 'transparent',
              color: '#E3C08C',
              fontFamily: FONT_SANS,
              fontWeight: 600,
              fontSize: '16px',
              letterSpacing: '0.3px',
              cursor: 'pointer',
              transition: 'transform 150ms ease-out',
            }}
          >
            {t('legal.iUnderstand')}
          </button>
        </div>
      </div>
    </div>
  )
}

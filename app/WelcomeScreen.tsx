'use client'

import { useEffect, useState } from 'react'
import type { UserType } from './lib/onboarding'
import { FONT_SANS, textColor } from './lib/typography'
import { isGuideCompleted, setGuideCompleted } from './lib/guide'
import { getWelcomeLines } from './guide/guideScript'
import GuideOverlay from './guide/GuideOverlay'
import { useLocale } from './contexts/LocaleContext'

// First-launch-only ekran - IntroSplash bittikten hemen sonra, ilk
// ritüelden ÖNCE. Kendi metni ve butonu yok artık - TEK içerik VELIS Guide
// (bkz. guide/guideScript.ts WELCOME_LINES, Smoker/Nonsmoker'a göre farklı).
// Guide konuşmasını bitirince KENDİLİĞİNDEN devam etmiyor - kullanıcının
// ekrana dokunmasını bekliyor (bkz. readyToContinue).

const EXIT_MS = 400

export default function WelcomeScreen({ onContinue, userType }: { onContinue: () => void; userType: UserType }) {
  const { locale } = useLocale()
  const [exiting, setExiting] = useState(false)
  // VELIS Guide - sadece gerçek ilk kullanıcıda, "tamamlandı" bayrağı
  // set edilene (Skip veya son adım) kadar hiç kaybolmuyor.
  const [showGuide, setShowGuide] = useState(false)
  const [readyToContinue, setReadyToContinue] = useState(false)

  useEffect(() => {
    if (isGuideCompleted()) {
      // Rehber daha önce tamamlanmış/Skip edilmiş - gösterilecek hiçbir şey
      // yok, ekranda takılı kalmamak için hemen devam ediyor.
      handleContinue()
      return
    }
    setShowGuide(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleContinue = () => {
    setExiting(true)
    setTimeout(onContinue, EXIT_MS)
  }

  return (
    <div
      onClick={() => readyToContinue && handleContinue()}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 40,
        background: '#050505',
        cursor: readyToContinue ? 'pointer' : 'default',
        opacity: exiting ? 0 : 1,
        transition: `opacity ${EXIT_MS}ms ease-in-out`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 'calc(56px + env(safe-area-inset-top))',
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONT_SANS,
          fontWeight: 600,
          fontSize: '13px',
          letterSpacing: '6px',
          color: textColor.accent,
        }}
      >
        VELIS
      </div>

      {showGuide && (
        <GuideOverlay
          targetRect={null}
          guidePlacement="center"
          guideSize={70}
          lines={getWelcomeLines(userType, locale)}
          onDialogueDone={() => setReadyToContinue(true)}
          onSkip={() => {
            setGuideCompleted()
            handleContinue()
          }}
        />
      )}
    </div>
  )
}

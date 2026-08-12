'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import VelisMark from '../VelisMark'
import CoffeePartnerBadge from '../CoffeePartnerBadge'
import { getStoredStats } from '../lib/auth'
import { FONT_SANS } from '../lib/typography'
import { useLocale } from '../contexts/LocaleContext'

// Gün 7 (ve katları) ödül ekranı - Aftercare'deki günlük ritüel mesajından
// Continue ile gelinen, PARTNER kampanyasına özel tek seferlik ekran (bkz.
// app/aftercare/page.tsx Continue handler) - Journey grid'deki rozetten de
// (kilitliyken bile) doğrudan erişilebiliyor, sadece ÖNİZLEME için. Şimdilik
// sadece kahve ortağı (yer tutucu marka) - ileride farklı ortaklıklar/günler
// eklenebilir.
export default function RewardPage() {
  return (
    <Suspense fallback={<main style={{ height: '100dvh', background: '#050505' }} />}>
      <RewardContent />
    </Suspense>
  )
}

function RewardContent() {
  const router = useRouter()
  const { t } = useLocale()
  const searchParams = useSearchParams()
  const day = Number(searchParams.get('day')) || 7
  const [visible, setVisible] = useState(false)
  // Sadece TAM O gün (7, 14, 21...) gerçekten ulaşılmışken aktif - önceki
  // günlerde önizleme (buton sönük), sonraki günlerde de zaten geçmiş/alınmış
  // sayılıyor (buton yine sönük). Her ödül günü SADECE kendi gününde aktif -
  // gün 7'deyken gün 14'ün ödülüne erişilemiyor.
  const [journeyDay, setJourneyDay] = useState<number | null>(null)
  useEffect(() => {
    setJourneyDay(getStoredStats().journeyDay)
  }, [])
  const claimable = journeyDay === day

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  return (
    <main
      style={{
        height: '100dvh',
        background: '#050505',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'calc(28px + env(safe-area-inset-top)) 28px calc(28px + env(safe-area-inset-bottom))',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <button
        onClick={() => router.push('/journey')}
        aria-label="Back to Journey"
        style={{
          position: 'absolute',
          top: 'calc(20px + env(safe-area-inset-top))',
          left: '20px',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255, 178, 90, 0.3)',
          background: 'rgba(255, 178, 90, 0.04)',
          cursor: 'pointer',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M14 5L8 12L14 19" stroke="#E3C08C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0px)' : 'translateY(8px)',
          transition: 'opacity 700ms ease-out, transform 700ms ease-out',
        }}
      >
        {/* Ortaklık şeridi - VELIS x Partner, orantılı yan yana */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '38px' }}>
          <VelisMark />
          <CoffeePartnerBadge size={42} />
        </div>

        <div
          style={{
            marginTop: '18px',
            fontFamily: FONT_SANS,
            fontWeight: 600,
            fontSize: '11px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#E3C08C',
          }}
        >
          {t('reward.badge', { day })}
        </div>

        <h1
          style={{
            marginTop: '20px',
            fontFamily: FONT_SANS,
            fontWeight: 600,
            fontSize: '26px',
            color: '#F5F0EA',
            textAlign: 'center',
          }}
        >
          {t('reward.title')}
        </h1>

        <p
          style={{
            marginTop: '16px',
            maxWidth: '320px',
            fontFamily: FONT_SANS,
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: 1.5,
            color: '#D2CCC5',
            textAlign: 'center',
          }}
        >
          {t('reward.body')}
        </p>

        <div
          style={{
            marginTop: '28px',
            padding: '14px 22px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 178, 90, 0.3)',
            background: 'rgba(255, 178, 90, 0.04)',
            fontFamily: FONT_SANS,
            fontWeight: 500,
            fontSize: '14px',
            color: '#E3C08C',
            textAlign: 'center',
          }}
        >
          {t('reward.pill')}
        </div>

        <button
          className="velis-primary-btn"
          disabled={!claimable}
          onClick={() => claimable && router.push('/journey')}
          style={{
            marginTop: '40px',
            width: '260px',
            maxWidth: '80vw',
            padding: '16px 0',
            borderRadius: '999px',
            border: 'none',
            background: claimable ? 'linear-gradient(180deg, #F3CE8E 0%, #D9A254 100%)' : 'rgba(255, 255, 255, 0.06)',
            boxShadow: claimable ? '0 0 24px 4px rgba(216, 174, 108, 0.3)' : 'none',
            color: claimable ? '#171410' : 'rgba(255, 255, 255, 0.3)',
            fontFamily: FONT_SANS,
            fontWeight: 600,
            fontSize: '16px',
            letterSpacing: '0.2px',
            cursor: claimable ? 'pointer' : 'default',
            transition: 'opacity 300ms ease-in-out',
          }}
        >
          {claimable ? t('reward.claim') : t('reward.locked', { day })}
        </button>
      </div>
    </main>
  )
}

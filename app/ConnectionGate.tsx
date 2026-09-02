'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { apiBase } from './lib/authApi'
import { useLocale } from './contexts/LocaleContext'
import VelisMark from './VelisMark'
import { FONT_SANS } from './lib/typography'

// VELIS bilinçli olarak ÇEVRİMİÇİ bir uygulama - hesap, ilerleme senkronu,
// leaderboard hepsi sunucuya bağlı. İnternet yoksa (uçak modu vb.) uygulamaya
// HİÇ girilemesin: sadece amblem + kısa bir satır görünür, arkadaki hiçbir
// şey yüklenmez.
//
// - İLK açılış: bağlantı DOĞRULANANA kadar children hiç render edilmiyor
//   (sert kapı). Çevrimdışıysa amblem ekranı, giriş yok.
// - Oturum sırasında bağlantı düşerse: children MOUNT kalıyor (ritüel/ekran
//   state'i kaybolmasın), üzerine tam ekran amblem katmanı biniyor. Bağlantı
//   dönünce katman kalkıyor, kaldığın yerden devam.
//
// "Gerçekten internet var mı" testi: navigator.onLine güvenilmez (captive
// portal / WAN'sız router'da true döner), o yüzden asıl kontrol kendi
// /health ucumuza atılan bir fetch.

type Status = 'checking' | 'online' | 'offline'

const PROBE_TIMEOUT_MS = 7000
const RETRY_MS = 4000

async function probe(): Promise<boolean> {
  const base = apiBase()
  // API yapılandırılmamışsa (saf web/dev) kapıyı hiç çalıştırma.
  if (!base) return true
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), PROBE_TIMEOUT_MS)
    const res = await fetch(`${base}/health`, { signal: ctrl.signal, cache: 'no-store' })
    clearTimeout(t)
    return res.ok
  } catch {
    return false
  }
}

export default function ConnectionGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>('checking')
  const everOnlineRef = useRef(false)
  const [everOnline, setEverOnline] = useState(false)

  const check = useCallback(async () => {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      setStatus('offline')
      return
    }
    const ok = await probe()
    if (ok) {
      if (!everOnlineRef.current) {
        everOnlineRef.current = true
        setEverOnline(true)
      }
      setStatus('online')
    } else {
      setStatus('offline')
    }
  }, [])

  useEffect(() => {
    check()
    const onOnline = () => check()
    const onOffline = () => setStatus('offline')
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [check])

  // Çevrimdışıyken düzenli tekrar dene - internet gelince kendiliğinden açılsın.
  useEffect(() => {
    if (status !== 'offline') return
    const id = setInterval(check, RETRY_MS)
    return () => clearInterval(id)
  }, [status, check])

  // Uygulama arka plandan öne gelince tazele (uçak modu açıp kapatma senaryosu).
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') check()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [check])

  // İlk bağlantı henüz doğrulanmadı: sert kapı, children hiç yok.
  if (!everOnline) {
    return status === 'offline' ? <OfflineScreen onRetry={check} /> : <CheckingScreen />
  }

  // Bir kez bağlanıldı: children mount kalır, çevrimdışında üstüne katman biner.
  return (
    <>
      {children}
      {status === 'offline' && <OfflineScreen onRetry={check} overlay />}
    </>
  )
}

// İlk /health kontrolü sürerken - IntroSplash'ın 1. sahnesiyle (saf siyah)
// birebir aynı, çevrimiçi kullanıcıda göze çarpmadan splash'a akıyor.
function CheckingScreen() {
  return <div style={{ position: 'fixed', inset: 0, background: '#050505', zIndex: 9998 }} />
}

function OfflineScreen({ onRetry, overlay = false }: { onRetry: () => void; overlay?: boolean }) {
  const { t } = useLocale()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 40)
    return () => clearTimeout(id)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#050505',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '30px',
        padding: 'calc(24px + env(safe-area-inset-top)) 32px calc(24px + env(safe-area-inset-bottom))',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 500ms ease-in-out',
      }}
      role="alertdialog"
      aria-live="polite"
      aria-hidden={overlay ? undefined : false}
    >
      <div style={{ transform: 'scale(1.9)' }}>
        <VelisMark />
      </div>

      <div
        style={{
          fontFamily: FONT_SANS,
          fontWeight: 600,
          fontSize: '13px',
          letterSpacing: '6px',
          color: 'rgba(246, 242, 235, 0.85)',
          marginTop: '10px',
        }}
      >
        VELIS
      </div>

      <p
        style={{
          margin: 0,
          maxWidth: '260px',
          textAlign: 'center',
          fontFamily: FONT_SANS,
          fontWeight: 400,
          fontSize: '14px',
          lineHeight: '20px',
          color: 'rgba(246, 242, 235, 0.5)',
        }}
      >
        {t('connection.line')}
      </p>

      <button
        onClick={onRetry}
        style={{
          fontFamily: FONT_SANS,
          fontWeight: 500,
          fontSize: '13px',
          letterSpacing: '0.3px',
          color: '#E3C08C',
          background: 'none',
          border: '1px solid rgba(255, 178, 90, 0.3)',
          borderRadius: '999px',
          padding: '10px 24px',
          cursor: 'pointer',
        }}
      >
        {t('connection.retry')}
      </button>
    </div>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import SectionCard from '../SectionCard'
import { buttonStyle, buttonGridStyle, colors, SANS } from '../styles'
import { useAppNav } from '../../contexts/AppNavContext'
import { clearLanguageSelected } from '../../lib/onboarding'

// DÜRÜSTLÜK NOTU: Bu uygulamanın mimarisinde "Splash" ve "Logo Animation"
// tek bir bileşen (IntroSplash) - ayrı bir "logo animasyonu" adımı yok, o
// yüzden ikisi de aynı işlemi tetikliyor. "Ritual Animation" ve "Journey
// Transition" için de ayrı bir replay motoru yok - bunlar sadece ilgili
// ekrana giden kısayollar (o ekranın kendi animasyonu zaten oynuyor).
export default function AnimationsSection({ onNavigate }: { onNavigate: () => void }) {
  const router = useRouter()
  const { resetIntroPlayed } = useAppNav()

  const go = (path: string) => {
    onNavigate()
    router.push(path)
  }

  const replaySplash = () => {
    resetIntroPlayed()
    go('/')
  }

  // Sadece dil seçim bayrağını temizliyor - hesabı/Journey'i/streak'i
  // ETKİLEMİYOR, Factory Reset'in aksine (bkz. lib/onboarding.ts
  // clearLanguageSelected). İlerlemeyi kaybetmeden ekranı tekrar görmek
  // için. KASITLI OLARAK go()/router.push DEĞİL, gerçek bir tam sayfa
  // yenilemesi - languageDone HomeInner'ın kendi local state'i (bkz.
  // app/page.tsx), Next.js'in route cache'i client-side geçişte mount
  // effect'ini yeniden çalıştırmayabiliyor (aynı sebep factoryReset'in de
  // window.location.href kullanmasının nedeni, bkz. DeveloperService.ts).
  const replayLanguageScreen = () => {
    clearLanguageSelected()
    window.location.href = '/'
  }

  return (
    <SectionCard title="Animations">
      <div style={buttonGridStyle}>
        <button style={buttonStyle()} onClick={replaySplash}>
          Replay Splash
        </button>
        <button style={buttonStyle()} onClick={replaySplash}>
          Replay Logo Animation
        </button>
        <button style={buttonStyle()} onClick={replayLanguageScreen}>
          Replay Language Screen
        </button>
        <button style={buttonStyle()} onClick={() => go('/')}>
          Replay Ritual Animation
        </button>
        <button style={buttonStyle()} onClick={() => go('/aftercare')}>
          Replay Completion Screen
        </button>
        <button style={buttonStyle()} onClick={() => go('/journey')}>
          Replay Journey Transition
        </button>
      </div>
      <p style={{ margin: 0, fontFamily: SANS, fontSize: '11px', color: colors.muted }}>
        Splash and Logo Animation are the same sequence in the current build. Ritual/Completion/Journey buttons
        navigate to the real screen, which plays its own animation natively.
      </p>
    </SectionCard>
  )
}

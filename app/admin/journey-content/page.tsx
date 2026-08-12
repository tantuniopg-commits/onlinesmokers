'use client'

import JourneyContentEditor from '../../devpanel/JourneyContentEditor'
import { isDev } from '../../constants/env'

// Journey Content Admin Mode - SADECE geliştirme ortamı için. Normal
// kullanıcılara ASLA gösterilmiyor (bkz. aşağıdaki NODE_ENV kontrolü).
// Aynı düzenleme mantığı artık Developer Panel'in "Message Editor"
// bölümüyle paylaşılıyor (bkz. devpanel/JourneyContentEditor.tsx) - bu
// sayfa sadece onu bağımsız, doğrudan bir URL'den erişilebilir bir kabukta
// sunuyor.
//
// GELECEK: Bu sayfa ileride onaylı yönetici e-postalarıyla kısıtlanacak
// (bkz. spesifikasyon "FUTURE ADMIN SYSTEM") - şimdilik sadece
// process.env.NODE_ENV === 'development' kontrolü yeterli.
export default function JourneyContentAdmin() {
  if (!isDev) {
    // Üretimde bu sayfa sessizce boş kalıyor - normal kullanıcılar hiçbir
    // zaman bu içeriği görmüyor.
    return null
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#000000',
        color: '#F5F0EA',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", Arial, sans-serif',
        padding: '32px',
        maxWidth: '720px',
        margin: '0 auto',
      }}
    >
      <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>Journey Content Admin</h1>
      <p style={{ margin: '4px 0 28px', fontSize: '13px', color: '#8F8A83' }}>
        Development only. Browse and edit any Journey Day regardless of real user progress.
      </p>
      <JourneyContentEditor initialDay={1} />
    </main>
  )
}

'use client'

import { useEffect, useState } from 'react'
import JourneyContentEditor from '../../devpanel/JourneyContentEditor'
import { isDev } from '../../constants/env'
import { isAdminUser } from '../../services/AuthService'

// Journey Content Admin Mode - lokal geliştirmede (isDev) VEYA giriş yapmış
// kullanıcının e-postası sunucudaki admin listesindeyse (isAdminUser)
// erişilebilir. Aynı düzenleme mantığı Developer Panel'in "Message Editor"
// bölümüyle paylaşılıyor (bkz. devpanel/JourneyContentEditor.tsx).
export default function JourneyContentAdmin() {
  // isAdminUser() localStorage okuyor - SSR/statik prerender'da window yok,
  // hydration uyumsuzluğunu önlemek için mount sonrası kontrol ediyoruz.
  const [allowed, setAllowed] = useState(isDev)
  useEffect(() => {
    setAllowed(isDev || isAdminUser())
  }, [])

  if (!allowed) {
    // Üretimde normal kullanıcılar için sessizce boş.
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

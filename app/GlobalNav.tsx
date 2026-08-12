'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import BottomNav from './BottomNav'
import { useAppNav } from './contexts/AppNavContext'
import { pathToTab } from './utils/nav'

export default function GlobalNav() {
  const pathname = usePathname()
  const { introActive, ritualLockActive, journeyRevealPending, tabMemory, rememberPath, unlocked, guidedRegistrationActive } = useAppNav()

  const tab = pathToTab(pathname)

  useEffect(() => {
    if (tab) rememberPath(tab, pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, tab])

  // Splash + logo + obje aktivasyonu tamamlanana kadar (introActive) '/'
  // rotasında navigasyon tamamen gizli - ilk kez Ritual Home göründüğünde
  // fade-in ile beliriyor (bkz. Home bileşeni, app/page.tsx). ritualLockActive
  // aynı şekilde - ilk kullanıcının İLK ritüeli boyunca ('/' üzerinde idle'dan
  // complete'e) VE ardından Day 1 Aftercare'de Continue'a basana kadar
  // ('/aftercare' üzerinde) Profile'a kaçıp akışı atlamasını engelliyor.
  // journeyRevealPending - GUEST'in Day 1 Journey ekranı kararana kadar
  // nav'ı gizli tutuyor (bkz. journey/page.tsx).
  const hidden =
    (pathname === '/' && (introActive || ritualLockActive)) ||
    (pathname === '/aftercare' && ritualLockActive) ||
    (pathname === '/journey' && journeyRevealPending)

  return (
    <div
      style={{
        opacity: hidden ? 0 : 1,
        transition: 'opacity 400ms ease-in-out',
        pointerEvents: hidden ? 'none' : 'auto',
      }}
    >
      <BottomNav
        active={tab}
        unlocked={unlocked}
        guidedRegistrationActive={guidedRegistrationActive}
        resolveHref={(key) => tabMemory[key]}
      />
    </div>
  )
}

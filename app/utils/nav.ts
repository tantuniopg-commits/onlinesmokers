import type { TabKey } from '../BottomNav'

// Uygulamanın HER ekranında otomatik görünen tek alt navigasyon - layout'ta
// bir kere render ediliyor, sayfaların kendi BottomNav'ı yok. Tek istisna:
// '/' rotasında splash/logo/aktivasyon oynarken (bkz. AppNavContext) gizli
// kalıyor, Ritual Home göründüğü an fade-in ile beliriyor.
export function pathToTab(pathname: string): TabKey | null {
  if (pathname === '/' || pathname.startsWith('/aftercare')) {
    // Aftercare, "Day 1 Journey" ekranı - Journey akışının bir parçası.
    return pathname === '/' ? 'ritual' : 'journey'
  }
  if (pathname.startsWith('/journey')) return 'journey'
  if (pathname.startsWith('/leaderboard')) return 'leaderboard'
  if (pathname.startsWith('/profile')) return 'profile'
  return null
}

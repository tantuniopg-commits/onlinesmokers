// Leaderboard servisi - lib/leaderboardData.ts (veri kaynağı) üzerine ince
// bir katman + sıralama/rank hesaplama iş kuralları (daha önce
// app/leaderboard/page.tsx içinde yaşıyordu).
import type { LBUser } from '../lib/leaderboardData'

export * from '../lib/leaderboardData'

export type Metric = 'streak' | 'xp'

export function sortByMetric(users: LBUser[], metric: Metric): LBUser[] {
  return [...users].sort((a, b) => (metric === 'streak' ? b.streakDays - a.streakDays : b.totalXP - a.totalXP))
}

export function formatMetricValue(user: LBUser, metric: Metric): string {
  if (metric === 'xp') return `${user.totalXP.toLocaleString()} XP`
  return `${user.streakDays} day${user.streakDays === 1 ? '' : 's'}`
}

export type Ranking = { top3: LBUser[]; rest: LBUser[]; youRank: number | null }

// Podyum (top3) + geri kalan liste + "You" satırının sırası - Leaderboard
// ekranının okuduğu tek türetme noktası. "You" HER ZAMAN sıralamaya dahil
// edilerek hesaplanıyor (önceden top3/rest sadece community'den, youRank ise
// community+you'dan hesaplanıyordu - bu, "You"nun XP'si podyumdaki 1.'den
// yüksek olsa bile tacın yanlış kişide kalmasına yol açan bir tutarsızlıktı).
// "You" top3'e girerse podyumda görünüyor ve alttaki sabitlenmiş "You"
// satırı (page.tsx) tekrar göstermiyor - bkz. youRank <= 3 kontrolü orada.
export function buildRanking(community: LBUser[], you: LBUser | null, metric: Metric): Ranking {
  const combined = sortByMetric(you ? [...community, you] : community, metric)
  const top3 = combined.slice(0, 3)
  // "Rest" listesi "You"yu asla içermiyor - top3'e girmediyse zaten ayrı,
  // sabitlenmiş satırda gösteriliyor (bkz. page.tsx), burada tekrar etmesin.
  const rest = combined.slice(3).filter((u) => !u.isYou)
  const youRank = you ? combined.findIndex((u) => u.isYou) + 1 : null

  return { top3, rest, youRank }
}

// Herhangi bir kullanıcının (community veya you) topluluk içindeki sırası -
// profil overlay'inin rozet numarası için.
export function getRankOf(userId: string, community: LBUser[], you: LBUser | null, metric: Metric): number | null {
  const allUsers = you ? [...community, you] : community
  const user = allUsers.find((u) => u.id === userId)
  if (!user) return null
  return sortByMetric(allUsers, metric).findIndex((u) => u.id === userId) + 1
}

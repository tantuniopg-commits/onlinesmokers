// Leaderboard veri türü. Gerçek veri kaynağı backend'in
// /api/auth/leaderboard uç noktası (bkz. lib/authApi.ts,
// app/leaderboard/page.tsx) - burada sadece paylaşılan tip tanımı var.

export type LBUser = {
  id: string
  firstName: string
  streakDays: number
  totalXP: number
  quote: string
  isYou?: boolean
}

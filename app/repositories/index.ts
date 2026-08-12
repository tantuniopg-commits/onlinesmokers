import { LocalStorageUserRepository } from './LocalStorageUserRepository'
import type { UserRepository } from './UserRepository'

export type { UserRepository } from './UserRepository'

// Aktif implementasyon TEK burada seçiliyor - ileride Supabase Authentication
// bağlanınca sadece bu satır değişecek (ör. `new SupabaseUserRepository(client)`),
// AuthService'in geri kalanı hiç değişmeyecek.
export const userRepository: UserRepository = new LocalStorageUserRepository()

// Documented-for-later (henüz uygulanmadı): Stats (`velis_stats`),
// Settings (`velis_settings`), JourneyContentOverrides
// (`velis_admin_content_overrides`) ve LeaderboardFakeUsers
// (`velis_dev_fake_leaderboard_users`) aynı get/save/clear şeklini takip
// edecek şekilde tasarlanmalı - her biri kendi Local*Repository +
// ileride Supabase*Repository/*ApiRepository çiftine sahip olacak. Dev-only
// anahtarlar (velis_dev_time_offset_ms, velis_dev_ritual_duration_sec,
// velis_dev_cooldown_ms) bu kapsamın KASITLI OLARAK dışında - hiçbir zaman
// bir backend'e senkronize olmayacaklar.

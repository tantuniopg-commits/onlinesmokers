import type { VelisUser } from '../lib/auth'

// Kullanıcı verisinin depolama katmanından soyutlanmış arayüzü. Bugün
// localStorage üzerinden (LocalStorageUserRepository), ileride Supabase
// Authentication üzerinden (SupabaseUserRepository) uygulanacak -
// AuthService SADECE bu arayüze göre yazılıyor, hangi implementasyonun aktif
// olduğu repositories/index.ts'teki tek satırla belirleniyor.
//
// Dönüş tipleri KASITLI OLARAK `T | Promise<T>` (Supabase henüz projeye
// eklenmedi - bkz. package.json). Bu, bugün var olan ~8 çağrı noktasını
// (birçoğu hydration-hassas tek seferlik mount effect'leri içinde,
// senkron kalmaları gerekiyor) `await` eklemeye ZORLAMADAN, ileride gerçek
// bir async Supabase implementasyonu bağlandığında sadece o YENİ implementasyonun
// gerektirdiği çağrı noktalarının `await` alması gerekecek - bugün hiçbir
// şey değişmiyor.
export interface UserRepository {
  get(): VelisUser | null | Promise<VelisUser | null>
  save(user: VelisUser): void | Promise<void>
  clear(): void | Promise<void>
}

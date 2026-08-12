// Ayarlar servisi - lib/settings.ts (kullanıcı tercihleri) ve
// lib/locales.ts (dil listesi) üzerine ince bir katman.
import { getStoredStats } from '../lib/auth'
import type { VelisUser, VelisStats } from '../lib/auth'
import { getStoredUser } from './AuthService'
import { getStoredSettings } from '../lib/settings'
import type { UserSettings } from '../lib/settings'
import { nowIso } from './TimeService'

export * from '../lib/settings'
export * from '../lib/locales'

export type DataExportPayload = {
  user: VelisUser | null
  stats: VelisStats
  settings: UserSettings
  exportedAt: string
}

// Kullanıcının cihazda tutulan tüm verisinin (kimlik, Journey/XP, tercihler)
// dışa aktarılabilir JSON gösterimi - saf, taşınabilir (DOM/Blob bağımlılığı
// yok). İndirme mekanizması (Blob/createObjectURL) web'e özgü olduğu için
// UI katmanında kalıyor (bkz. profile/settings/privacy/page.tsx).
export function buildExportPayload(): DataExportPayload {
  return {
    user: getStoredUser(),
    stats: getStoredStats(),
    settings: getStoredSettings(),
    exportedAt: nowIso(),
  }
}

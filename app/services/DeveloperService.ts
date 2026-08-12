// Geliştirici servisi - dev-only bayrak/sürüm/konfigürasyon geçersiz
// kılmalarının tek toplandığı yer.
import { clearStats, clearToken } from '../lib/auth'
import { clearUser } from './AuthService'
import { clearAllOverrides } from '../lib/journeyContentOverrides'
import { resetDevTime } from '../lib/time'
import { setDevCooldownOverrideMs } from '../lib/devCooldown'
import { clearWelcomeSeen, clearUserType, clearLanguageSelected } from '../lib/onboarding'
import { clearAppStateKey } from './AppStateManager'
import { resetRitualDurationSec } from '../lib/ritualConfig'
import { clearAllOtps } from './VerificationService'
import { clearGuideCompleted } from '../lib/guide'

export { isDev } from '../constants/env'
export { APP_VERSION, BUILD_NUMBER } from '../constants/version'
export * from '../lib/devCooldown'
export {
  getRitualDurationSec,
  setRitualDurationSec,
  resetRitualDurationSec,
  PRODUCTION_RITUAL_DURATION_SEC,
  MIN_RITUAL_DURATION_SEC,
  MAX_RITUAL_DURATION_SEC,
} from '../lib/ritualConfig'

// Developer Panel'in "Factory Reset" kontrolü için - tüm yerel geliştirme
// verisini tek seferde temizler. Gerçek bir sayfa yenilemesi yapıyor (React
// context'leri, unlocked durumu, tabMemory dahil tam temiz bir durum garanti
// etmek için) - bkz. devpanel/sections/Reset.tsx.
export function factoryReset(): void {
  clearUser()
  clearStats()
  clearToken()
  clearWelcomeSeen()
  clearUserType()
  clearLanguageSelected()
  clearAppStateKey()
  clearAllOtps()
  clearGuideCompleted()
  clearAllOverrides()
  resetDevTime()
  setDevCooldownOverrideMs(null)
  window.location.href = '/'
}

// Developer Panel'in "Reset Developer Flags" kontrolü için - SADECE dev-only
// geçersiz kılmaları temizler (gerçek zaman/soğuma/süre davranışına döner).
// Hesaba/Journey'e/hiçbir gerçek kullanıcı verisine dokunmuyor.
export function resetDeveloperFlags(): void {
  resetDevTime()
  setDevCooldownOverrideMs(null)
  resetRitualDurationSec()
}

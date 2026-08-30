// Kimlik/istatistik servisi - lib/auth.ts'in ince bir katmanı + hesap
// oluşturma/düzenleme/kapatma iş kurallarının toplandığı yer (daha önce
// sayfa bileşenlerinde yaşıyordu). Kullanıcı (User) okuma/yazma/temizleme
// artık userRepository üzerinden geçiyor (bkz. repositories/) - Stats hâlâ
// doğrudan lib/auth.ts üzerinden (repository soyutlaması şimdilik sadece
// User için, bkz. repositories/index.ts'teki not).
import { clearStats, clearToken, getStoredToken } from '../lib/auth'
import type { VelisUser } from '../lib/auth'
import { userRepository } from '../repositories'
import { setAppState } from './AppStateManager'
import { clearWelcomeSeen, clearUserType } from '../lib/onboarding'
import { clearGuideCompleted } from '../lib/guide'
import { updateProfileRequest, changePasswordRequest, deleteAccountRequest } from '../lib/authApi'

export * from '../lib/auth'

// Bu üç fonksiyon KASITLI OLARAK lib/auth.ts'in doğrudan re-export'unu
// (yukarıdaki `export *`) gölgeliyor - artık userRepository üzerinden
// geçiyorlar (bkz. repositories/UserRepository.ts). Dönüş tipleri, arayüzün
// `T | Promise<T>` imzasıyla uyumlu olacak şekilde senkron kalıyor -
// LocalStorageUserRepository senkron olduğu için bugün hiçbir çağrı
// noktasının `await` eklemesi gerekmiyor.
export function getStoredUser(): VelisUser | null {
  return userRepository.get() as VelisUser | null
}

export function saveUser(user: VelisUser): void {
  userRepository.save(user)
}

export function clearUser(): void {
  userRepository.clear()
}

// Giriş yapmış kullanıcının e-postası sunucudaki admin listesinde mi (bkz.
// server/src/lib/admins.js) - login/register yanıtında geldi, yerelde
// saklandı. Admin listesinin kendisi client'a hiç inmiyor.
export function isAdminUser(): boolean {
  return !!getStoredUser()?.isAdmin
}

export type SignupFormInput = {
  firstName: string
  lastName: string
  email: string
  gender: string
  birthDate: string
  password: string
}
export type SignupFormValidity = {
  firstNameValid: boolean
  lastNameValid: boolean
  emailValid: boolean
  genderValid: boolean
  birthDateValid: boolean
  passwordValid: boolean
  formValid: boolean
}

// Şifre kuralları - tek alan + canlı kural listesi (bkz.
// app/profile/page.tsx PasswordRuleRow). Her kural ayrı ayrı kontrol
// edilebilsin diye burada, tek bir yerde tanımlı - hem validateSignupForm
// hem de UI'daki canlı liste AYNI bu fonksiyonu kullanıyor, iki yerde
// kural tekrarlanmıyor.
export type PasswordRuleId = 'length' | 'uppercase' | 'lowercase' | 'number' | 'special'

export function getPasswordRuleStatus(password: string): Record<PasswordRuleId, boolean> {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }
}

export function isPasswordValid(password: string): boolean {
  return Object.values(getPasswordRuleStatus(password)).every(Boolean)
}

// Hesap oluşturma formunun doğrulama kuralları - app/profile/page.tsx'ten
// birebir taşındı (aynı regex/uzunluk kontrolleri, aynı davranış).
export function validateSignupForm(input: SignupFormInput): SignupFormValidity {
  const firstNameValid = input.firstName.trim().length > 0
  const lastNameValid = input.lastName.trim().length > 0
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())
  const genderValid = input.gender.trim().length > 0
  // Doğum tarihi geçmişte olmalı VE kullanıcı en az 13 yaşında olmalı
  // (COPPA / Gizlilik Politikası "13 yaş altı için değildir"). Tarih seçici
  // zaten 13'ten küçüğü seçtirmiyor - bu, kesin kural.
  const birthDateValid = (() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.birthDate)) return false
    const dob = new Date(input.birthDate)
    if (Number.isNaN(dob.getTime()) || dob >= new Date()) return false
    const thirteenAgo = new Date()
    thirteenAgo.setFullYear(thirteenAgo.getFullYear() - 13)
    return dob <= thirteenAgo
  })()
  const passwordValid = isPasswordValid(input.password)
  return {
    firstNameValid,
    lastNameValid,
    emailValid,
    genderValid,
    birthDateValid,
    passwordValid,
    formValid: firstNameValid && lastNameValid && emailValid && genderValid && birthDateValid && passwordValid,
  }
}

// Journey/XP hesap oluşturmadan ÖNCE, gerçek ritüel tamamlanınca kaydedilmiş
// oluyor (bkz. app/page.tsx, completeRitual) - burada sahte veri üretmiyoruz.
export function createAccount(input: {
  firstName: string
  lastName: string
  email: string
  id?: string
  isAdmin?: boolean
}): VelisUser {
  const user: VelisUser = {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: input.email.trim(),
    id: input.id,
    isAdmin: input.isAdmin || undefined,
  }
  saveUser(user)
  setAppState('REGISTERED')
  return user
}

// Token varsa (gerçek hesap) sunucudaki `name` alanı da güncelleniyor -
// başarısız olursa (ağ/sunucu hatası) yerel de değiştirilmiyor, aksi halde
// ekran "kaydedildi" gösterip DB'de sessizce eski kalır (bkz. journey stats
// senkron sorunundaki tutarsızlık, burada aynı hatayı tekrarlamıyoruz).
// Misafir modda (token yok) sadece yerel - hiç sunucu hesabı yok zaten.
export async function updateUserName(user: VelisUser, firstName: string, lastName: string): Promise<VelisUser | null> {
  if (!firstName.trim() || !lastName.trim()) return null
  const next: VelisUser = { ...user, firstName: firstName.trim(), lastName: lastName.trim() }
  const token = getStoredToken()
  if (token) {
    try {
      await updateProfileRequest(token, `${next.firstName} ${next.lastName}`.trim())
    } catch {
      return null
    }
  }
  saveUser(next)
  return next
}

// Gerçek şifre değişimi - hesap oluşturma formuyla BİREBİR aynı kural seti
// (bkz. isPasswordValid), sunucu mevcut şifreyi doğruladıktan sonra
// değiştiriyor (bkz. server/src/controllers/authController.js updatePassword)
// ve o anki uygulama diline göre bir bildirim e-postası gönderiyor. Misafir
// modda (token yok) değiştirilecek gerçek bir şifre yok.
export async function changePassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
  locale: string
): Promise<boolean> {
  if (!isPasswordValid(newPassword) || newPassword !== confirmPassword) return false
  const token = getStoredToken()
  if (!token) return false
  try {
    await changePasswordRequest(token, currentPassword, newPassword, locale)
    return true
  } catch {
    return false
  }
}

export function logOut(): void {
  clearUser()
  clearToken()
  // Hesap gitti ama yerel ilerleme (Journey/XP) kalıyor - bu tam olarak
  // GUEST tanımı (bkz. services/AppStateManager.ts).
  setAppState('GUEST')
}

// Token varsa hesap sunucudan da GERÇEKTEN siliniyor - aksi halde silinen
// hesap DB'de kalıp Leaderboard'da görünmeye devam ederdi (bkz.
// authController.js removeAccount, leaderboard() canlı User.find({})
// sorgusu). Sunucu isteği başarısız olsa bile (ör. offline) kullanıcıyı
// yerelde kilitli bırakmamak için yerel temizlik yine de yapılıyor.
export async function deleteAccount(): Promise<void> {
  const token = getStoredToken()
  if (token) {
    try {
      await deleteAccountRequest(token)
    } catch (err) {
      console.error('[AuthService] Failed to delete account on server', err)
    }
  }
  clearUser()
  clearStats()
  clearToken()
  // Ne hesap ne ilerleme kaldı - kullanıcı GERÇEKTEN ilk açılışa dönmeli
  // (VELIS Guide turu dahil). devJumpToState('FIRST_LAUNCH') ile aynı temizlik:
  // onboarding/kullanıcı-tipi/guide bayrakları + intro splash bayrağı da
  // sıfırlanıyor, yoksa /profile'a düşüp turu bir daha görmüyordu.
  clearWelcomeSeen()
  clearUserType()
  clearGuideCompleted()
  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem('velis_intro_played')
    // Alınan ödül günleri guard'ı (bkz. lib/journey.ts) - yeni bir hesapta
    // ödüller tekrar alınabilmeli.
    window.localStorage.removeItem('velis_claimed_rewards')
  }
  setAppState('FIRST_LAUNCH')
}

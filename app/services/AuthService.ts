// Kimlik/istatistik servisi - lib/auth.ts'in ince bir katmanı + hesap
// oluşturma/düzenleme/kapatma iş kurallarının toplandığı yer (daha önce
// sayfa bileşenlerinde yaşıyordu). Kullanıcı (User) okuma/yazma/temizleme
// artık userRepository üzerinden geçiyor (bkz. repositories/) - Stats hâlâ
// doğrudan lib/auth.ts üzerinden (repository soyutlaması şimdilik sadece
// User için, bkz. repositories/index.ts'teki not).
import { clearStats, clearToken } from '../lib/auth'
import type { VelisUser } from '../lib/auth'
import { userRepository } from '../repositories'
import { setAppState } from './AppStateManager'

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

export type SignupFormInput = {
  firstName: string
  lastName: string
  email: string
  phone: string
  gender: string
  birthDate: string
  password: string
}
export type SignupFormValidity = {
  firstNameValid: boolean
  lastNameValid: boolean
  emailValid: boolean
  phoneValid: boolean
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
  // Telefon artık 10 ayrı rakam kutucuğundan geliyor (bkz. profile/page.tsx) -
  // sadece rakam, tam 10 hane.
  const phoneValid = /^\d{10}$/.test(input.phone)
  const genderValid = input.gender.trim().length > 0
  const birthDateValid = /^\d{4}-\d{2}-\d{2}$/.test(input.birthDate) && new Date(input.birthDate) < new Date()
  const passwordValid = isPasswordValid(input.password)
  return {
    firstNameValid,
    lastNameValid,
    emailValid,
    phoneValid,
    genderValid,
    birthDateValid,
    passwordValid,
    formValid: firstNameValid && lastNameValid && emailValid && phoneValid && genderValid && birthDateValid && passwordValid,
  }
}

// Journey/XP hesap oluşturmadan ÖNCE, gerçek ritüel tamamlanınca kaydedilmiş
// oluyor (bkz. app/page.tsx, completeRitual) - burada sahte veri üretmiyoruz.
export function createAccount(input: { firstName: string; lastName: string; email: string; id?: string }): VelisUser {
  const user: VelisUser = {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: input.email.trim(),
    id: input.id,
  }
  saveUser(user)
  setAppState('REGISTERED')
  return user
}

export function updateUserName(user: VelisUser, firstName: string, lastName: string): VelisUser | null {
  if (!firstName.trim() || !lastName.trim()) return null
  const next: VelisUser = { ...user, firstName: firstName.trim(), lastName: lastName.trim() }
  saveUser(next)
  return next
}

export function updateUserEmail(user: VelisUser, email: string): VelisUser | null {
  if (!email.trim()) return null
  const next: VelisUser = { ...user, email: email.trim() }
  saveUser(next)
  return next
}

// NOT: VELIS henüz gerçek bir kimlik doğrulama backend'i kullanmıyor - hesap
// oluşturma sırasında şifre asla saklanmıyor (bkz. lib/auth.ts, VelisUser
// tipinde password alanı yok). Bu fonksiyon bu yüzden gerçek bir şifreyi
// doğrulayıp değiştiremiyor; arayüz/akış burada hazır, gerçek backend
// bağlanınca bu fonksiyon onu çağıracak.
export function changePassword(newPassword: string, confirmPassword: string): boolean {
  return newPassword.length >= 6 && newPassword === confirmPassword
}

export function logOut(): void {
  clearUser()
  clearToken()
  // Hesap gitti ama yerel ilerleme (Journey/XP) kalıyor - bu tam olarak
  // GUEST tanımı (bkz. services/AppStateManager.ts).
  setAppState('GUEST')
}

export function deleteAccount(): void {
  clearUser()
  clearStats()
  clearToken()
  // Ne hesap ne ilerleme kaldı - FIRST_LAUNCH'a eşdeğer.
  setAppState('FIRST_LAUNCH')
}

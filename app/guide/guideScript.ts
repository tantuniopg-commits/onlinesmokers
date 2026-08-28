// VELIS Guide - dokuz adımın tam metni. Şu an gerçekten sahnelenen adımlar
// WELCOME / USER_TYPE / RITUAL / HOLD_INTERACTION / COMPLETION (bkz.
// WelcomeScreen.tsx, WhoAreYouScreen.tsx, app/page.tsx, app/aftercare/page.tsx) -
// PRIVACY/EMAIL/PHONE/PROFILE bu uygulamada Guided Registration Mode'un bir
// parçası olarak DAHA SONRA (ilk ritüelden sonra) gerçekleşiyor; metinleri
// burada hazır duruyor, o akışa bağlamak ayrı bir adım.
export type GuideStepId =
  | 'WELCOME'
  | 'USER_TYPE'
  | 'PRIVACY'
  | 'EMAIL'
  | 'PHONE'
  | 'PROFILE'
  | 'RITUAL'
  | 'HOLD_INTERACTION'
  | 'COMPLETION'

import type { UserType } from '../lib/onboarding'
import type { LocaleCode } from '../lib/i18n'

// Welcome ekranının kendi metni tamamen kaldırıldı - artık TEK anlatım
// kaynağı bu, Smoker/Nonsmoker'a göre farklı (eski WelcomeScreen COPY'sinin
// yerini alıyor). Dil seçimine göre EN/TR arasında geçiş yapıyor (bkz.
// getWelcomeLines, contexts/LocaleContext.tsx).
const WELCOME_LINES_EN: Record<UserType, string[]> = {
  Smoker: [
    'VELIS acts as your guide, helping you take control of every smoking moment.',
    'Real-world rewards help turn that control into a lasting habit.',
    "Now, let's get to know VELIS together.",
  ],
  Nonsmoker: [
    'VELIS acts as your guide, helping you take control whenever the urge appears.',
    'Real-world rewards help turn that control into a lasting habit.',
    "Now, let's get to know VELIS together.",
  ],
}

const WELCOME_LINES_TR: Record<UserType, string[]> = {
  Smoker: [
    'VELIS, her sigara anında kontrolü sana geri kazandıran rehberindir.',
    'Gerçek dünya ödülleri, bu kontrolü kalıcı bir alışkanlığa dönüştürmene yardımcı olur.',
    "Şimdi VELIS'i birlikte tanıyalım.",
  ],
  Nonsmoker: [
    'VELIS, istek belirdiğinde kontrolü sana geri kazandıran rehberindir.',
    'Gerçek dünya ödülleri, bu kontrolü kalıcı bir alışkanlığa dönüştürmene yardımcı olur.',
    "Şimdi VELIS'i birlikte tanıyalım.",
  ],
}

export function getWelcomeLines(userType: UserType, locale: LocaleCode = 'en'): string[] {
  return (locale === 'tr' ? WELCOME_LINES_TR : WELCOME_LINES_EN)[userType]
}

// Geriye dönük uyumluluk için - varsayılan (İngilizce) script'i doğrudan
// isteyen eski çağrı noktaları için (artık hiçbiri kalmadı, ama tip export'u
// başka yerlerden import edilebiliyor olabilir).
export const WELCOME_LINES = WELCOME_LINES_EN

const GUIDE_SCRIPT_EN: Record<GuideStepId, string[]> = {
  WELCOME: WELCOME_LINES_EN.Smoker,
  USER_TYPE: ['Choose the journey that reflects you today.'],
  PRIVACY: ['Please read these carefully.', "When you're ready, accept to continue."],
  EMAIL: ["Let's make sure it's really you."],
  PHONE: ['One more step.'],
  PROFILE: ['This is your personal space.', 'Your streak.', 'Your XP.', 'Your journey.'],
  RITUAL: [
    'This is your ritual.',
    'Each ritual lasts 30 seconds.',
    "Touch the Amber Core when you're ready.",
    'The object will activate in about 10 seconds.',
  ],
  HOLD_INTERACTION: [
    'Keep your finger on the light.',
    'As long as you stay...',
    '...the ritual continues.',
    'If you let go...',
    '...the ritual simply waits.',
    "When you're ready...",
    '...continue.',
  ],
  COMPLETION: [
    'Congratulations!',
    "You've completed your first ritual.",
    "You can return and complete a ritual anytime you need or want to. That's how you'll continue earning XP.",
    'Remember: your daily streak only increases when you complete one ritual every 24 hours.',
  ],
}

const GUIDE_SCRIPT_TR: Record<GuideStepId, string[]> = {
  WELCOME: WELCOME_LINES_TR.Smoker,
  USER_TYPE: ['Bugünü en iyi yansıtan yolculuğu seç.'],
  PRIVACY: ['Lütfen bunları dikkatle oku.', 'Hazır olduğunda, devam etmek için kabul et.'],
  EMAIL: ['Gerçekten sen olduğundan emin olalım.'],
  PHONE: ['Bir adım daha.'],
  PROFILE: ['Burası senin kişisel alanın.', 'Serin.', "XP'n.", 'Yolculuğun.'],
  RITUAL: [
    'Bu senin ritüelin.',
    'Her ritüel 30 saniye sürer.',
    "Hazır olduğunda Amber Çekirdek'e dokun.",
    'Nesne yaklaşık 10 saniye içinde etkinleşecek.',
  ],
  HOLD_INTERACTION: [
    'Parmağını ışığın üzerinde tut.',
    'Orada kaldığın sürece...',
    '...ritüel devam eder.',
    'Bırakırsan...',
    '...ritüel sadece bekler.',
    'Hazır olduğunda...',
    '...devam et.',
  ],
  COMPLETION: [
    'Tebrikler!',
    'İlk ritüelini tamamladın.',
    'İhtiyaç duyduğunda veya istediğinde geri dönüp ritüel tamamlayabilirsin. XP kazanmaya böyle devam edeceksin.',
    'Unutma: günlük serin, sadece her 24 saatte bir ritüel tamamladığında artar.',
  ],
}

export function getGuideScript(locale: LocaleCode = 'en'): Record<GuideStepId, string[]> {
  return locale === 'tr' ? GUIDE_SCRIPT_TR : GUIDE_SCRIPT_EN
}

// Geriye dönük uyumluluk için - varsayılan (İngilizce) script.
export const GUIDE_SCRIPT = GUIDE_SCRIPT_EN

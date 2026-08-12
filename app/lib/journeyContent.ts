import { getOverride } from './journeyContentOverrides'
import type { UserType } from './onboarding'
import type { LocaleCode } from './i18n'

// VELIS Journey İçerik Deposu - tek, merkezi içerik kaynağı. UI hiçbir
// zaman metni kendi içinde barındırmıyor; sadece getJourneyDayContent(day)
// çağırıp sonucu gösteriyor (bkz. app/aftercare/page.tsx). EN/TR ikisi de
// destekleniyor (bkz. contexts/LocaleContext.tsx) - locale parametresi
// hangi dil setinin kullanılacağını seçiyor.
//
// DÜRÜSTLÜK NOTU: 105+ günün her birini elle, benzersiz şekilde yazmak
// gerçekçi değil. Bölüm 1 (Gün 1-7) ve Bölüm 3 (Gün 15-21 - spesifikasyondaki
// Gün 15 örneğini birebir karşılamak için) elle yazılmış, gerçekten
// benzersiz içerik içeriyor. Diğer tüm günler, bölüm temasına ve bölüm-içi
// konuma (1..7) göre üretilen bir şablon havuzundan geliyor - komşu günler
// asla birbirinin aynısı olmuyor, ama bu metinler "elle yazılmış" gibi
// sunulmuyor. Bu, mimariyi 1000+ gün için gerçekten ölçeklenebilir kılan
// dürüst mühendislik tercihi.

export const CHAPTER_LENGTH = 7

// Bölüm 1-15 (Gün 1-105) için küratörlüğü yapılmış temalar - spesifikasyonun
// birebir istediği ilk 5 bölüm dahil. 15 bölüm x 7 gün = tam 105 gün.
const CHAPTER_THEMES = [
  'Beginning',
  'Building Consistency',
  'Trust Yourself',
  'Identity',
  'Growth',
  'Resilience',
  'Stillness',
  'Discipline',
  'Renewal',
  'Clarity',
  'Integration',
  'Purpose',
  'Freedom',
  'Mastery',
  'Becoming',
]

const CHAPTER_THEMES_TR = [
  'Başlangıç',
  'İstikrar İnşası',
  'Kendine Güven',
  'Kimlik',
  'Büyüme',
  'Dayanıklılık',
  'Durgunluk',
  'Disiplin',
  'Yenilenme',
  'Netlik',
  'Bütünleşme',
  'Amaç',
  'Özgürlük',
  'Ustalık',
  'Dönüşüm',
]

// Journey Overview'daki sayfalama (bkz. app/journey/page.tsx) buradan
// türetiyor - hiçbir yerde "105" sabit yazılmıyor. CHAPTER_THEMES'e yeni
// bölümler eklenip bu sayı ör. 365'e çıkarıldığında UI'da HİÇBİR değişiklik
// gerekmiyor, sayfalama otomatik olarak genişliyor.
export const TOTAL_JOURNEY_DAYS = CHAPTER_THEMES.length * CHAPTER_LENGTH

export type Chapter = {
  number: number
  theme: string
  startDay: number
  endDay: number
}

function toRoman(n: number): string {
  const numerals: [number, string][] = [
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ]
  let result = ''
  let remaining = n
  for (const [value, symbol] of numerals) {
    while (remaining >= value) {
      result += symbol
      remaining -= value
    }
  }
  return result
}

// Gün 105'in ötesinde (Bölüm 16+) özel bir üst sınır YOK - aynı 15 temalık
// havuz bir "nesil" numarasıyla (II, III, ...) tekrar kullanılıyor, böylece
// 210, 365, 1000+ gün için de her zaman bir bölüm/tema üretiliyor.
export function getChapterForDay(day: number, locale: LocaleCode = 'en'): Chapter {
  const chapterNumber = Math.floor((day - 1) / CHAPTER_LENGTH) + 1
  const startDay = (chapterNumber - 1) * CHAPTER_LENGTH + 1
  const endDay = chapterNumber * CHAPTER_LENGTH
  const cycle = Math.floor((chapterNumber - 1) / CHAPTER_THEMES.length)
  const themeIndex = (chapterNumber - 1) % CHAPTER_THEMES.length
  const themes = locale === 'tr' ? CHAPTER_THEMES_TR : CHAPTER_THEMES
  const baseTheme = themes[themeIndex]
  const theme = cycle === 0 ? baseTheme : `${baseTheme} ${toRoman(cycle + 1)}`
  return { number: chapterNumber, theme, startDay, endDay }
}

export type JourneyDayContent = {
  day: number
  chapterNumber: number
  chapterTheme: string
  title: string
  subtitle: string
  quote?: string
  xp: number
  animationKey?: string
}

type AuthoredEntry = Pick<JourneyDayContent, 'title' | 'subtitle' | 'quote'>

// Elle yazılmış, gerçekten benzersiz günler - bkz. dosya başı yorumu.
// Smoker journey - MEVCUT içerik, birebir korunuyor (bkz. spec: "Keep the
// current smoker messages exactly as they are").
const SMOKER_AUTHORED_DAYS: Record<number, AuthoredEntry> = {
  1: {
    title: 'Welcome\nto your journey.',
    subtitle: 'Today you chose yourself.',
  },
  2: {
    title: 'You came back.',
    subtitle: 'That is the whole practice.',
  },
  3: {
    title: 'Nothing dramatic.\nJust presence.',
    subtitle: 'Small and steady beats big and rare.',
  },
  4: {
    title: 'You are building\na pattern.',
    subtitle: 'Not a habit yet - but the shape of one.',
  },
  5: {
    title: 'This is starting\nto feel familiar.',
    subtitle: 'Familiar is where consistency begins.',
  },
  6: {
    title: 'Almost through\nyour first week.',
    subtitle: 'You did not need to be perfect. Just present.',
  },
  7: {
    title: 'One week,\nchosen on purpose.',
    subtitle: 'Beginning is over. Building starts now.',
    quote: 'The first week is proof, not perfection.',
  },
  15: {
    title: "You're becoming\nconsistent.",
    subtitle: 'Small choices repeated daily create lasting change.',
    quote: 'Progress is earned quietly.',
  },
  16: {
    title: 'You trusted\nyourself again.',
    subtitle: 'Trust is built in moments like this one.',
  },
  17: {
    title: 'No one is watching.\nYou still showed up.',
    subtitle: 'That is what trust looks like from the inside.',
  },
  18: {
    title: 'You know how\nthis feels now.',
    subtitle: 'Recognition is the beginning of confidence.',
  },
  19: {
    title: 'This is who\nyou are becoming.',
    subtitle: 'Not someday. Already, quietly, now.',
  },
  20: {
    title: 'You did not need\nconvincing today.',
    subtitle: 'That ease is not luck - it is trust, earned.',
  },
  21: {
    title: 'Three weeks\nof choosing yourself.',
    subtitle: 'Trust yourself. You have given yourself reason to.',
    quote: 'Consistency is trust, demonstrated.',
  },
}

const SMOKER_AUTHORED_DAYS_TR: Record<number, AuthoredEntry> = {
  1: {
    title: 'Yolculuğuna\nhoş geldin.',
    subtitle: 'Bugün kendini seçtin.',
  },
  2: {
    title: 'Geri döndün.',
    subtitle: 'Bütün pratik bu.',
  },
  3: {
    title: 'Dramatik bir şey yok.\nSadece burada olmak.',
    subtitle: 'Küçük ve istikrarlı, büyük ve nadir olana galip gelir.',
  },
  4: {
    title: 'Bir alışkanlık\ninşa ediyorsun.',
    subtitle: 'Henüz bir alışkanlık değil - ama şeklini alıyor.',
  },
  5: {
    title: 'Bu artık\ntanıdık gelmeye başladı.',
    subtitle: 'Tanıdıklık, istikrarın başladığı yerdir.',
  },
  6: {
    title: 'İlk haftanı\nneredeyse tamamladın.',
    subtitle: 'Mükemmel olman gerekmiyordu. Sadece burada olman.',
  },
  7: {
    title: 'Bir hafta,\nbilinçli seçildi.',
    subtitle: 'Başlangıç bitti. İnşa etmek şimdi başlıyor.',
    quote: 'İlk hafta mükemmellik değil, kanıttır.',
  },
  15: {
    title: 'İstikrarlı\nolmaya başlıyorsun.',
    subtitle: 'Her gün tekrarlanan küçük seçimler kalıcı değişim yaratır.',
    quote: 'İlerleme sessizce kazanılır.',
  },
  16: {
    title: 'Kendine yeniden\ngüvendin.',
    subtitle: 'Güven, tam da böyle anlarda inşa edilir.',
  },
  17: {
    title: 'Kimse izlemiyordu.\nYine de geldin.',
    subtitle: 'Güven içeriden böyle görünür.',
  },
  18: {
    title: 'Artık bu hissi\nbiliyorsun.',
    subtitle: 'Tanımak, özgüvenin başlangıcıdır.',
  },
  19: {
    title: 'Bu, olmaya başladığın\nkişi.',
    subtitle: 'Bir gün değil. Zaten, sessizce, şimdi.',
  },
  20: {
    title: 'Bugün ikna edilmeye\nihtiyacın yoktu.',
    subtitle: 'Bu kolaylık şans değil - kazanılmış güven.',
  },
  21: {
    title: 'Kendini seçmenin\nüçüncü haftası.',
    subtitle: 'Kendine güven. Buna kendine sebep verdin.',
    quote: 'İstikrar, gösterilen güvendir.',
  },
}

// Nonsmoker journey - TAMAMEN AYRI bir metin seti (Day 2-105), asla sigara
// bırakmaktan bahsetmiyor; ton: sakin, mindful, güçlendirici - özgürlüğü ve
// sağlıklı alışkanlıkları korumaya odaklı (bkz. spec: "Never mention
// quitting", "Never guilt-trip or preach"). Ekran tasarımı Smoker ile
// birebir aynı - sadece bu metinler farklı (bkz. getJourneyDayContent).
const NONSMOKER_AUTHORED_DAYS: Record<number, AuthoredEntry> = {
  1: {
    title: 'Welcome\nto your journey.',
    subtitle: 'Today you chose freedom.',
  },
  2: {
    title: 'You kept your promise.',
    subtitle: 'Every ritual reinforces your freedom.',
  },
  3: {
    title: 'Consistency is forming.',
    subtitle: 'Small choices create a strong future.',
  },
  4: {
    title: 'Healthy habits\ngrow quietly.',
    subtitle: 'You are building something lasting.',
  },
  5: {
    title: 'Small rituals\nshape identity.',
    subtitle: 'You are becoming who you choose.',
  },
  6: {
    title: 'Protect what matters.',
    subtitle: 'Your future depends on today’s choices.',
  },
  7: {
    title: 'One week\nof intention.',
    subtitle: 'You chose yourself for seven days.',
    quote: 'A week of intention is a promise kept.',
  },
  30: {
    title: 'One month\nof strength.',
    subtitle: 'You are proof that consistency works.',
    quote: 'Strength is a habit, not a moment.',
  },
  50: {
    title: 'Fifty days\nof freedom.',
    subtitle: 'You’ve built a lifestyle, not just a streak.',
  },
  75: {
    title: 'Seventy-five days\nstrong.',
    subtitle: 'Your habits are now your foundation.',
  },
  100: {
    title: 'One hundred days\nof choice.',
    subtitle: 'You’ve protected your future for 100 days.',
    quote: 'One hundred days, one choice, repeated.',
  },
  105: {
    title: 'Your journey continues.',
    subtitle: 'Freedom is a daily practice.',
  },
}

const NONSMOKER_AUTHORED_DAYS_TR: Record<number, AuthoredEntry> = {
  1: {
    title: 'Yolculuğuna\nhoş geldin.',
    subtitle: 'Bugün özgürlüğü seçtin.',
  },
  2: {
    title: 'Sözünü tuttun.',
    subtitle: 'Her ritüel özgürlüğünü pekiştiriyor.',
  },
  3: {
    title: 'İstikrar oluşuyor.',
    subtitle: 'Küçük seçimler güçlü bir gelecek yaratır.',
  },
  4: {
    title: 'Sağlıklı alışkanlıklar\nsessizce büyüyor.',
    subtitle: 'Kalıcı bir şey inşa ediyorsun.',
  },
  5: {
    title: 'Küçük ritüeller\nkimliği şekillendirir.',
    subtitle: 'Seçtiğin kişi oluyorsun.',
  },
  6: {
    title: 'Önemli olanı koru.',
    subtitle: 'Geleceğin bugünkü seçimlere bağlı.',
  },
  7: {
    title: 'Bir hafta\nniyet.',
    subtitle: 'Kendini yedi gün boyunca seçtin.',
    quote: 'Bir haftalık niyet, tutulan bir sözdür.',
  },
  30: {
    title: 'Bir ay\ngüç.',
    subtitle: 'İstikrarın işe yaradığının kanıtısın.',
    quote: 'Güç bir andan değil, bir alışkanlıktan gelir.',
  },
  50: {
    title: 'Elli gün\nözgürlük.',
    subtitle: 'Sadece bir seri değil, bir yaşam tarzı inşa ettin.',
  },
  75: {
    title: 'Yetmiş beş gün\ngüçlü.',
    subtitle: 'Alışkanlıkların artık temelin.',
  },
  100: {
    title: 'Yüz gün\nseçim.',
    subtitle: 'Geleceğini 100 gün boyunca korudun.',
    quote: 'Yüz gün, bir seçim, tekrar tekrar.',
  },
  105: {
    title: 'Yolculuğun devam ediyor.',
    subtitle: 'Özgürlük günlük bir pratiktir.',
  },
}

// Bölümün "cümle içi" güvenli küçük harf hali - Gün 105'ten sonra tema
// tekrar kullanılırken eklenen Roma rakamı ekini (ör. "Discipline X")
// küçük harfe çevirmiyor, aksi halde "discipline x" gibi bir yazım
// hatasıymış gibi görünen bir sonuç çıkardı (bkz. Gün 1000 test edilirken
// fark edildi).
// "İ" -> "i" özel dönüşümü olmadan JS'in varsayılan .toLowerCase()'i
// birleşik nokta karakteri üretiyor ("i̇stikrar" gibi) - Türkçe temalarda
// bunu önlemek için önce Türkçe büyük İ'yi manuel küçültüyoruz.
function lowerCase(text: string): string {
  return text.replace(/İ/g, 'i').toLowerCase()
}

function themeForSentence(theme: string): string {
  const match = theme.match(/^(.*?)(\s[IVXLCDM]+)$/)
  if (!match) return lowerCase(theme)
  const [, base, romanSuffix] = match
  return `${lowerCase(base)}${romanSuffix}`
}

type PositionTemplate = { title: (theme: string) => string; subtitle: (theme: string) => string }

// Bölüm-içi konuma (0..6) göre şablon havuzu - bölüm temasına göre
// parametrize ediliyor. Elle yazılmamış TÜM günler buradan geliyor; komşu
// günler farklı konumlara denk geldiği için asla birbirinin aynısı olmuyor.
const SMOKER_POSITION_TEMPLATES: PositionTemplate[] = [
  {
    title: (theme) => `A new chapter\nbegins: ${theme}.`,
    subtitle: () => 'Every chapter starts with a single, ordinary choice.',
  },
  {
    title: () => 'You returned again.',
    subtitle: (theme) => `That is how ${themeForSentence(theme)} is built - one return at a time.`,
  },
  {
    title: (theme) => `Something about\n${themeForSentence(theme)} is settling in.`,
    subtitle: () => 'You may not feel it yet. It is happening anyway.',
  },
  {
    title: () => 'Halfway through,\nand still here.',
    subtitle: (theme) => `${theme} is not a single moment - it is this one, repeated.`,
  },
  {
    title: () => 'This is quieter\nthan it was before.',
    subtitle: () => 'Quiet is not the absence of progress. It is the sound of it.',
  },
  {
    title: (theme) => `You are living\ninside ${themeForSentence(theme)} now.`,
    subtitle: () => 'Not thinking about it. Simply doing it.',
  },
  {
    title: (theme) => `${theme},\nchosen one more time.`,
    subtitle: () => 'A chapter closes the same way it opened - with a choice.',
  },
]

const SMOKER_POSITION_TEMPLATES_TR: PositionTemplate[] = [
  {
    title: (theme) => `Yeni bir bölüm\nbaşlıyor: ${theme}.`,
    subtitle: () => 'Her bölüm, sıradan tek bir seçimle başlar.',
  },
  {
    title: () => 'Yine geri döndün.',
    subtitle: (theme) => `${themeForSentence(theme)} işte böyle inşa edilir - her seferinde bir dönüşle.`,
  },
  {
    title: (theme) => `${themeForSentence(theme)} ile ilgili\nbir şey yerleşiyor.`,
    subtitle: () => 'Henüz hissetmeyebilirsin. Yine de oluyor.',
  },
  {
    title: () => 'Yarı yoldasın,\nve hâlâ buradasın.',
    subtitle: (theme) => `${theme} tek bir an değil - tekrarlanan bu an.`,
  },
  {
    title: () => 'Bu, öncekinden\ndaha sessiz.',
    subtitle: () => 'Sessizlik ilerlemenin yokluğu değil. Onun sesidir.',
  },
  {
    title: (theme) => `Artık ${themeForSentence(theme)}\nin içinde yaşıyorsun.`,
    subtitle: () => 'Onu düşünmüyorsun. Sadece yapıyorsun.',
  },
  {
    title: (theme) => `${theme},\nbir kez daha seçildi.`,
    subtitle: () => 'Bir bölüm, açıldığı gibi kapanır - bir seçimle.',
  },
]

// Nonsmoker şablon havuzu - aynı konum mantığı, ama asla sigara/bırakma
// dilinden bahsetmiyor; özgürlüğü/alışkanlığı "korumak" çerçevesinde.
const NONSMOKER_POSITION_TEMPLATES: PositionTemplate[] = [
  {
    title: (theme) => `A new chapter\nbegins: ${theme}.`,
    subtitle: () => 'Every chapter is built from ordinary, protected choices.',
  },
  {
    title: () => 'You showed up\nfor yourself again.',
    subtitle: (theme) => `That is how ${themeForSentence(theme)} becomes who you are.`,
  },
  {
    title: (theme) => `Something about\n${themeForSentence(theme)} is settling in.`,
    subtitle: () => 'Quietly, and for good.',
  },
  {
    title: () => 'Halfway through,\nstill protecting it.',
    subtitle: (theme) => `${theme} is not one moment - it is this one, chosen again.`,
  },
  {
    title: () => 'This feels lighter\nthan it used to.',
    subtitle: () => 'That lightness is what freedom feels like.',
  },
  {
    title: (theme) => `You are living\ninside ${themeForSentence(theme)} now.`,
    subtitle: () => 'Not thinking about it. Simply living it.',
  },
  {
    title: (theme) => `${theme},\nprotected one more time.`,
    subtitle: () => 'A chapter closes the way it opened - with a choice for yourself.',
  },
]

const NONSMOKER_POSITION_TEMPLATES_TR: PositionTemplate[] = [
  {
    title: (theme) => `Yeni bir bölüm\nbaşlıyor: ${theme}.`,
    subtitle: () => 'Her bölüm, sıradan ve korunan seçimlerden inşa edilir.',
  },
  {
    title: () => 'Kendin için yine\nburadaydın.',
    subtitle: (theme) => `${themeForSentence(theme)}, olduğun kişi işte böyle oluyor.`,
  },
  {
    title: (theme) => `${themeForSentence(theme)} ile ilgili\nbir şey yerleşiyor.`,
    subtitle: () => 'Sessizce, ve kalıcı olarak.',
  },
  {
    title: () => 'Yarı yoldasın,\nhâlâ koruyorsun.',
    subtitle: (theme) => `${theme} tek bir an değil - yeniden seçilen bu an.`,
  },
  {
    title: () => 'Bu, eskisinden\ndaha hafif hissettiriyor.',
    subtitle: () => 'O hafiflik, özgürlüğün hissi.',
  },
  {
    title: (theme) => `Artık ${themeForSentence(theme)}\nin içinde yaşıyorsun.`,
    subtitle: () => 'Onu düşünmüyorsun. Sadece yaşıyorsun.',
  },
  {
    title: (theme) => `${theme},\nbir kez daha korundu.`,
    subtitle: () => 'Bir bölüm, açıldığı gibi kapanır - kendin için bir seçimle.',
  },
]

function generateDayContent(day: number, chapter: Chapter, templates: PositionTemplate[]): AuthoredEntry {
  const positionInChapter = day - chapter.startDay // 0..6
  const template = templates[positionInChapter % templates.length]
  return {
    title: template.title(chapter.theme),
    subtitle: template.subtitle(chapter.theme),
  }
}

const DEFAULT_XP = 10

// Uygulamadaki TEK giriş noktası - UI her zaman bunu çağırıyor, hiçbir
// zaman AUTHORED_DAYS/POSITION_TEMPLATES'e doğrudan erişmiyor. Admin
// Mode'daki düzenlemeler (bkz. journeyContentOverrides.ts) burada devreye
// giriyor, böylece hem admin önizlemesi hem gerçek tamamlanma ekranı aynı
// sonucu görüyor. `locale` EN/TR içerik setleri arasında seçim yapıyor -
// admin override'ları (varsa) HER İKİ dilde de aynı, dil-bağımsız kalıyor.
export function getJourneyDayContent(day: number, userType: UserType = 'Smoker', locale: LocaleCode = 'en'): JourneyDayContent {
  const chapter = getChapterForDay(day, locale)
  const isTr = locale === 'tr'
  const authoredDays = isTr
    ? userType === 'Nonsmoker'
      ? NONSMOKER_AUTHORED_DAYS_TR
      : SMOKER_AUTHORED_DAYS_TR
    : userType === 'Nonsmoker'
    ? NONSMOKER_AUTHORED_DAYS
    : SMOKER_AUTHORED_DAYS
  const templates = isTr
    ? userType === 'Nonsmoker'
      ? NONSMOKER_POSITION_TEMPLATES_TR
      : SMOKER_POSITION_TEMPLATES_TR
    : userType === 'Nonsmoker'
    ? NONSMOKER_POSITION_TEMPLATES
    : SMOKER_POSITION_TEMPLATES
  const base = authoredDays[day] ?? generateDayContent(day, chapter, templates)
  const override = getOverride(day)

  return {
    day,
    chapterNumber: chapter.number,
    chapterTheme: chapter.theme,
    title: override?.title ?? base.title,
    subtitle: override?.subtitle ?? base.subtitle,
    quote: override?.quote ?? base.quote,
    xp: override?.xp ?? DEFAULT_XP,
    animationKey: undefined,
  }
}

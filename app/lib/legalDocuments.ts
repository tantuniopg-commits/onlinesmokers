// Velis Privacy Policy / Terms of Service - içerik burada tek yerden
// geliyor (bkz. app/profile/page.tsx doküman okuyucusu, app/profile/settings/
// privacy/page.tsx). EN/TR ayrı kaynak metinler - getTermsOfService/
// getPrivacyPolicy o anki locale'e göre doğru olanı döndürüyor.
// Gizlilik Politikası "Topladığımız Bilgiler" bölümü uygulamanın gerçekten
// sakladığı verilerle (ad, e-posta, hash'li şifre, ilerleme, tercihler)
// eşleşecek şekilde güncellendi (2026-08-30).

export type LegalSection = {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
  afterBullets?: string[]
}

export type LegalDocument = {
  title: string
  lastUpdated: string
  intro: string[]
  sections: LegalSection[]
}

const TERMS_OF_SERVICE_EN: LegalDocument = {
  title: 'Terms of Service',
  lastUpdated: 'Last Updated: August 30, 2026',
  intro: ['By using Velis, you agree to these Terms of Service.'],
  sections: [
    {
      heading: '1. Use of the App',
      paragraphs: ['You agree to use Velis only for lawful purposes and in a way that does not harm the app or other users.'],
    },
    {
      heading: '2. Accounts',
      paragraphs: ['You are responsible for maintaining the confidentiality of your account and for all activities under your account.'],
    },
    {
      heading: '3. Acceptable Use',
      paragraphs: ['You agree not to:'],
      bullets: ['Use the app for illegal activities', 'Attempt to disrupt or damage the app', 'Violate the rights of others'],
    },
    {
      heading: '4. Intellectual Property',
      paragraphs: ['All content and features of Velis belong to us. You may not copy or distribute them without permission.'],
    },
    {
      heading: '5. Termination',
      paragraphs: ['We may suspend or terminate your access if you violate these terms.'],
    },
    {
      heading: '6. Disclaimer',
      paragraphs: ['Velis is provided "as is" without warranties of any kind.'],
    },
    {
      heading: '7. Limitation of Liability',
      paragraphs: ['We are not responsible for damages resulting from the use of the app.'],
    },
    {
      heading: '8. Changes',
      paragraphs: ['We may update these Terms at any time. Continued use means acceptance.'],
    },
    {
      heading: '9. Governing Law',
      paragraphs: ['These Terms are governed by the laws of Türkiye.'],
    },
    {
      heading: '10. Contact',
      paragraphs: ['Email: contact@forsvelis.com'],
    },
  ],
}

const TERMS_OF_SERVICE_TR: LegalDocument = {
  title: 'Kullanım Koşulları',
  lastUpdated: 'Son Güncelleme: 30 Ağustos 2026',
  intro: ["Velis'i kullanarak bu Kullanım Koşullarını kabul etmiş olursunuz."],
  sections: [
    {
      heading: '1. Uygulamanın Kullanımı',
      paragraphs: ["Velis'i yalnızca yasal amaçlarla ve uygulamaya veya diğer kullanıcılara zarar vermeyecek şekilde kullanmayı kabul edersiniz."],
    },
    {
      heading: '2. Hesaplar',
      paragraphs: ['Hesabınızın gizliliğini korumaktan ve hesabınız altında gerçekleşen tüm faaliyetlerden siz sorumlusunuz.'],
    },
    {
      heading: '3. Kabul Edilebilir Kullanım',
      paragraphs: ['Aşağıdakileri yapmamayı kabul edersiniz:'],
      bullets: ['Uygulamayı yasa dışı faaliyetler için kullanmak', 'Uygulamayı bozmaya veya zarar vermeye çalışmak', 'Başkalarının haklarını ihlal etmek'],
    },
    {
      heading: '4. Fikri Mülkiyet',
      paragraphs: ["Velis'in tüm içeriği ve özellikleri bize aittir. İzin almadan bunları kopyalayamaz veya dağıtamazsınız."],
    },
    {
      heading: '5. Fesih',
      paragraphs: ['Bu koşulları ihlal etmeniz durumunda erişiminizi askıya alabilir veya sonlandırabiliriz.'],
    },
    {
      heading: '6. Sorumluluk Reddi',
      paragraphs: ['Velis, herhangi bir garanti verilmeksizin "olduğu gibi" sunulmaktadır.'],
    },
    {
      heading: '7. Sorumluluğun Sınırlandırılması',
      paragraphs: ['Uygulamanın kullanımından kaynaklanan zararlardan sorumlu değiliz.'],
    },
    {
      heading: '8. Değişiklikler',
      paragraphs: ['Bu Koşulları herhangi bir zamanda güncelleyebiliriz. Kullanmaya devam etmeniz kabul ettiğiniz anlamına gelir.'],
    },
    {
      heading: '9. Uygulanacak Hukuk',
      paragraphs: ['Bu Koşullar Türkiye kanunlarına tabidir.'],
    },
    {
      heading: '10. İletişim',
      paragraphs: ['E-posta: contact@forsvelis.com'],
    },
  ],
}

const PRIVACY_POLICY_EN: LegalDocument = {
  title: 'Privacy Policy',
  lastUpdated: 'Last Updated: August 30, 2026',
  intro: [
    'Velis ("we", "our", or "us") respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our application.',
    'By using Velis, you agree to this Privacy Policy.',
  ],
  sections: [
    {
      heading: '1. Information We Collect',
      paragraphs: ['We collect only the information necessary to provide our service:'],
      bullets: [
        'Your name and email address, provided when you create an account',
        'Your password, which is stored only as a one-way encrypted hash — we never store or see your actual password',
        'Your progress in the app (journey day, streak, XP, ritual count and duration), so it can sync across your devices',
        'Your language and notification preferences',
        'Basic account metadata such as the date your account was created',
      ],
      afterBullets: ['You can use the core features of the app without creating an account; in that case your progress stays on your device only.'],
    },
    {
      heading: '2. How We Use Your Information',
      paragraphs: ['We use your information to:'],
      bullets: [
        'Provide and operate the app and sync your progress across devices',
        'Send account and reminder emails you have not opted out of',
        'Ensure security and prevent misuse',
        'Understand how the app is used so we can improve it',
      ],
      afterBullets: ['Authorized members of our team may access account data (never passwords) when needed for support, moderation, or security.'],
    },
    {
      heading: '3. Data Sharing',
      paragraphs: ['We do not sell or rent your personal data.', 'We share data only:'],
      bullets: [
        'With service providers who process it on our behalf to run the app — hosting, database, and email delivery',
        'If required by law',
      ],
    },
    {
      heading: '4. Data Storage and Security',
      paragraphs: [
        'Data is transmitted over encrypted connections (HTTPS) and stored on secured servers. Passwords are hashed and are not recoverable.',
        'Your data is kept only as long as necessary to provide the service or comply with legal obligations. When you delete your account, your account data is permanently removed from our servers.',
      ],
    },
    {
      heading: '5. Your Rights',
      paragraphs: ['You may:'],
      bullets: ['Request access to your data', 'Request correction or deletion', 'Withdraw consent at any time'],
      afterBullets: ['To request this, contact us via email.'],
    },
    {
      heading: '6. Cookies and Tracking',
      paragraphs: [
        'We do not use tracking technologies for cross-app or third-party advertising purposes.',
        'Basic technical cookies or similar tools may be used only to ensure app functionality.',
      ],
    },
    {
      heading: '7. Third-Party Services',
      paragraphs: ['Our app may use limited third-party services necessary for operation (such as hosting). These providers process data only on our behalf.'],
    },
    {
      heading: "8. Children's Privacy",
      paragraphs: ['Velis is not intended for users under 13. We do not knowingly collect data from children.'],
    },
    {
      heading: '9. Future Features',
      paragraphs: ['If new features (such as payments) are introduced in the future, this Privacy Policy will be updated accordingly.'],
    },
    {
      heading: '10. Changes to This Policy',
      paragraphs: ['We may update this Privacy Policy. Continued use of the app means you accept the updated version.'],
    },
    {
      heading: '11. Contact',
      paragraphs: ['Email: contact@forsvelis.com'],
    },
  ],
}

const PRIVACY_POLICY_TR: LegalDocument = {
  title: 'Gizlilik Politikası',
  lastUpdated: 'Son Güncelleme: 30 Ağustos 2026',
  intro: [
    'Velis ("biz", "bizim" veya "bize") gizliliğinize saygı duyar. Bu Gizlilik Politikası, uygulamamızı kullanırken bilgilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklar.',
    "Velis'i kullanarak bu Gizlilik Politikasını kabul etmiş olursunuz.",
  ],
  sections: [
    {
      heading: '1. Topladığımız Bilgiler',
      paragraphs: ['Hizmetimizi sunmak için yalnızca gerekli olan bilgileri topluyoruz:'],
      bullets: [
        'Hesap oluştururken verdiğiniz adınız ve e-posta adresiniz',
        'Şifreniz — yalnızca tek yönlü şifrelenmiş bir özet (hash) olarak saklanır; gerçek şifrenizi hiçbir zaman saklamayız veya göremeyiz',
        'Uygulamadaki ilerlemeniz (yolculuk günü, seri, XP, ritüel sayısı ve süresi) — cihazlarınız arasında senkronlanabilmesi için',
        'Dil ve bildirim tercihleriniz',
        'Hesabınızın oluşturulma tarihi gibi temel hesap bilgileri',
      ],
      afterBullets: ['Uygulamanın çekirdek özelliklerini hesap oluşturmadan kullanabilirsiniz; bu durumda ilerlemeniz yalnızca cihazınızda kalır.'],
    },
    {
      heading: '2. Bilgilerinizi Nasıl Kullanıyoruz',
      paragraphs: ['Bilgilerinizi şu amaçlarla kullanırız:'],
      bullets: [
        'Uygulamayı sağlamak, işletmek ve ilerlemenizi cihazlar arasında senkronlamak',
        'Devre dışı bırakmadığınız hesap ve hatırlatma e-postalarını göndermek',
        'Güvenliği sağlamak ve kötüye kullanımı önlemek',
        'Uygulamanın nasıl kullanıldığını anlayıp geliştirmek',
      ],
      afterBullets: ['Ekibimizin yetkili üyeleri; destek, moderasyon veya güvenlik amacıyla gerektiğinde hesap verilerine (şifreler hariç) erişebilir.'],
    },
    {
      heading: '3. Veri Paylaşımı',
      paragraphs: ['Kişisel verilerinizi satmayız veya kiralamayız.', 'Verileri yalnızca şu durumlarda paylaşırız:'],
      bullets: [
        'Uygulamayı çalıştırmak için verileri bizim adımıza işleyen hizmet sağlayıcılarla — barındırma, veritabanı ve e-posta gönderimi',
        'Yasal olarak zorunlu olduğunda',
      ],
    },
    {
      heading: '4. Veri Depolama ve Güvenlik',
      paragraphs: [
        'Veriler şifreli bağlantılar (HTTPS) üzerinden aktarılır ve güvenli sunucularda saklanır. Şifreler hash\'lenir ve geri döndürülemez.',
        'Verileriniz yalnızca hizmeti sağlamak veya yasal yükümlülüklere uymak için gerekli olduğu sürece saklanır. Hesabınızı sildiğinizde, hesap verileriniz sunucularımızdan kalıcı olarak kaldırılır.',
      ],
    },
    {
      heading: '5. Haklarınız',
      paragraphs: ['Şunları yapabilirsiniz:'],
      bullets: ['Verilerinize erişim talep etmek', 'Düzeltme veya silme talep etmek', 'Rızanızı istediğiniz zaman geri çekmek'],
      afterBullets: ['Bu talepler için bizimle e-posta yoluyla iletişime geçebilirsiniz.'],
    },
    {
      heading: '6. Çerezler ve Takip',
      paragraphs: [
        'Uygulamalar arası veya üçüncü taraf reklamcılık amacıyla takip teknolojileri kullanmıyoruz.',
        'Yalnızca uygulama işlevselliğini sağlamak amacıyla temel teknik çerezler veya benzeri araçlar kullanılabilir.',
      ],
    },
    {
      heading: '7. Üçüncü Taraf Hizmetleri',
      paragraphs: ['Uygulamamız, işletim için gerekli olan sınırlı sayıda üçüncü taraf hizmeti kullanabilir (barındırma gibi). Bu sağlayıcılar verileri yalnızca bizim adımıza işler.'],
    },
    {
      heading: '8. Çocukların Gizliliği',
      paragraphs: ['Velis, 13 yaşın altındaki kullanıcılar için tasarlanmamıştır. Çocuklardan bilerek veri toplamıyoruz.'],
    },
    {
      heading: '9. Gelecekteki Özellikler',
      paragraphs: ['Gelecekte yeni özellikler (ödemeler gibi) sunulursa, bu Gizlilik Politikası buna göre güncellenecektir.'],
    },
    {
      heading: '10. Bu Politikadaki Değişiklikler',
      paragraphs: ['Bu Gizlilik Politikasını güncelleyebiliriz. Uygulamayı kullanmaya devam etmeniz, güncellenmiş sürümü kabul ettiğiniz anlamına gelir.'],
    },
    {
      heading: '11. İletişim',
      paragraphs: ['E-posta: contact@forsvelis.com'],
    },
  ],
}

export function getTermsOfService(locale: string): LegalDocument {
  return locale === 'tr' ? TERMS_OF_SERVICE_TR : TERMS_OF_SERVICE_EN
}

export function getPrivacyPolicy(locale: string): LegalDocument {
  return locale === 'tr' ? PRIVACY_POLICY_TR : PRIVACY_POLICY_EN
}

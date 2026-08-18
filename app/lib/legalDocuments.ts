// Forsvelis Privacy Policy / Terms of Service - içerik burada tek yerden
// geliyor (bkz. app/profile/page.tsx doküman okuyucusu, app/profile/settings/
// privacy/page.tsx). Metin kaynak PDF'lerden BİREBİR alındı, hiç
// değiştirilmedi. EN/TR ayrı kaynak metinler - getTermsOfService/
// getPrivacyPolicy o anki locale'e göre doğru olanı döndürüyor.

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
  lastUpdated: 'Last Updated: August 17, 2026',
  intro: ['By using Forsvelis, you agree to these Terms of Service.'],
  sections: [
    {
      heading: '1. Use of the App',
      paragraphs: ['You agree to use Forsvelis only for lawful purposes and in a way that does not harm the app or other users.'],
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
      paragraphs: ['All content and features of Forsvelis belong to us. You may not copy or distribute them without permission.'],
    },
    {
      heading: '5. Termination',
      paragraphs: ['We may suspend or terminate your access if you violate these terms.'],
    },
    {
      heading: '6. Disclaimer',
      paragraphs: ['Forsvelis is provided "as is" without warranties of any kind.'],
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
  lastUpdated: 'Son Güncelleme: 17 Ağustos 2026',
  intro: ["Forsvelis'i kullanarak bu Kullanım Koşullarını kabul etmiş olursunuz."],
  sections: [
    {
      heading: '1. Uygulamanın Kullanımı',
      paragraphs: ["Forsvelis'i yalnızca yasal amaçlarla ve uygulamaya veya diğer kullanıcılara zarar vermeyecek şekilde kullanmayı kabul edersiniz."],
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
      paragraphs: ["Forsvelis'in tüm içeriği ve özellikleri bize aittir. İzin almadan bunları kopyalayamaz veya dağıtamazsınız."],
    },
    {
      heading: '5. Fesih',
      paragraphs: ['Bu koşulları ihlal etmeniz durumunda erişiminizi askıya alabilir veya sonlandırabiliriz.'],
    },
    {
      heading: '6. Sorumluluk Reddi',
      paragraphs: ['Forsvelis, herhangi bir garanti verilmeksizin "olduğu gibi" sunulmaktadır.'],
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
  lastUpdated: 'Last Updated: August 17, 2026',
  intro: [
    'Forsvelis ("we", "our", or "us") respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our application.',
    'By using Forsvelis, you agree to this Privacy Policy.',
  ],
  sections: [
    {
      heading: '1. Information We Collect',
      paragraphs: ['We collect only the information necessary to provide our service:'],
      bullets: ['Email address', 'Username or basic account information'],
    },
    {
      heading: '2. How We Use Your Information',
      paragraphs: ['We use your information to:'],
      bullets: ['Provide and operate the app', 'Improve user experience', 'Communicate with you when necessary', 'Ensure security and prevent misuse'],
    },
    {
      heading: '3. Data Sharing',
      paragraphs: ['We do not sell or rent your personal data.', 'We may share data only:'],
      bullets: ['With trusted service providers (e.g. hosting)', 'If required by law'],
    },
    {
      heading: '4. Data Storage and Security',
      paragraphs: [
        'We use reasonable technical measures to protect your data.',
        'Your data is kept only as long as necessary to provide the service or comply with legal obligations.',
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
      paragraphs: ['Forsvelis is not intended for users under 13. We do not knowingly collect data from children.'],
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
  lastUpdated: 'Son Güncelleme: 17 Ağustos 2026',
  intro: [
    'Forsvelis ("biz", "bizim" veya "bize") gizliliğinize saygı duyar. Bu Gizlilik Politikası, uygulamamızı kullanırken bilgilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklar.',
    "Forsvelis'i kullanarak bu Gizlilik Politikasını kabul etmiş olursunuz.",
  ],
  sections: [
    {
      heading: '1. Topladığımız Bilgiler',
      paragraphs: ['Hizmetimizi sunmak için yalnızca gerekli olan bilgileri topluyoruz:'],
      bullets: ['E-posta adresi', 'Kullanıcı adı veya temel hesap bilgileri'],
    },
    {
      heading: '2. Bilgilerinizi Nasıl Kullanıyoruz',
      paragraphs: ['Bilgilerinizi şu amaçlarla kullanırız:'],
      bullets: ['Uygulamayı sağlamak ve işletmek', 'Kullanıcı deneyimini geliştirmek', 'Gerektiğinde sizinle iletişim kurmak', 'Güvenliği sağlamak ve kötüye kullanımı önlemek'],
    },
    {
      heading: '3. Veri Paylaşımı',
      paragraphs: ['Kişisel verilerinizi satmayız veya kiralamayız.', 'Verileri yalnızca şu durumlarda paylaşabiliriz:'],
      bullets: ['Güvenilir hizmet sağlayıcılarla (örn. barındırma hizmetleri)', 'Yasal olarak zorunlu olduğunda'],
    },
    {
      heading: '4. Veri Depolama ve Güvenlik',
      paragraphs: [
        'Verilerinizi korumak için makul teknik önlemler alıyoruz.',
        'Verileriniz yalnızca hizmeti sağlamak veya yasal yükümlülüklere uymak için gerekli olduğu sürece saklanır.',
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
      paragraphs: ['Forsvelis, 13 yaşın altındaki kullanıcılar için tasarlanmamıştır. Çocuklardan bilerek veri toplamıyoruz.'],
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

// Velis Privacy Policy / Terms of Service - içerik burada tek yerden
// geliyor (bkz. app/profile/page.tsx doküman okuyucusu, app/profile/settings/
// privacy/page.tsx). EN/TR ayrı kaynak metinler - getTermsOfService/
// getPrivacyPolicy o anki locale'e göre doğru olanı döndürüyor.
//
// Gizlilik Politikası 2026-08-30'da baştan yazıldı - uygulamanın GERÇEKTEN
// topladığı her veri türünü (ad, e-posta, cinsiyet, doğum tarihi, hash'li
// şifre, uygulama içi ilerleme/XP/streak, dil+bildirim tercihleri, hesap
// meta verisi) listeliyor; KVKK/GDPR dayanakları, uluslararası aktarım,
// saklama, haklar, hesap silme ve 13+ kuralı dahil. İki dil BİREBİR aynı
// yapı - biri değişirse diğeri de değişmeli.

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
    'Velis ("Velis", "we", "our", or "us") respects your privacy. This Privacy Policy explains what information we collect when you use the Velis mobile application, why we collect it, how it is stored and shared, and the choices and rights you have.',
    'By creating an account or using Velis, you agree to this Privacy Policy. If you do not agree, please do not use the app.',
  ],
  sections: [
    {
      heading: '1. Information We Collect',
      paragraphs: ['We collect only the information needed to run the app and your account.', 'Information you provide when you create an account:'],
      bullets: [
        'Name',
        'Email address',
        'Gender (Female / Male / Other / Prefer not to say)',
        'Date of birth (used to confirm you are at least 13 years old)',
        'Password — stored only as a one-way cryptographic hash. We never store, see, or have any way to recover your actual password.',
      ],
      afterBullets: [
        'Information created as you use the app: your in-app progress and activity, including journey day, current streak, total XP, number of rituals completed, total ritual time, and your reward-claim history. If you are signed in, this is stored on our servers so it can sync across your devices.',
        'Preferences: your chosen language and notification settings.',
        'Account metadata: the date your account was created and, for security, timestamps of certain account events.',
        'You can use the core features of Velis (the ritual, the journey, local progress) without creating an account. In that case your progress stays only on your device and is not sent to us.',
      ],
    },
    {
      heading: '2. How We Use Your Information',
      paragraphs: ['We use your information to:'],
      bullets: [
        'Create and operate your account and authenticate you when you sign in',
        'Save your progress and sync it across your devices',
        'Show the leaderboard, which ranks registered users by streak and XP (your name and stats are visible to other users there; your email is never shown)',
        'Send you account-related emails (verification codes, password resets) and the ritual reminder emails you have not turned off',
        'Keep the service secure, prevent abuse, and troubleshoot problems',
        'Understand, in aggregate, how the app is used so we can improve it',
      ],
      afterBullets: [
        'We do not use your data for advertising, and we do not sell it.',
        'Authorized members of our team may access account data — never passwords — when reasonably necessary for support, moderation, security, or legal compliance.',
      ],
    },
    {
      heading: '3. Legal Bases for Processing',
      paragraphs: [
        'Where data-protection law (such as the Turkish KVKK or the EU/UK GDPR) applies, we process your personal data on the following bases: performance of our agreement with you (to provide the app and your account); your consent (for optional reminder emails, which you can withdraw at any time in Settings); and our legitimate interests (keeping the service secure and improving it), balanced against your rights.',
      ],
    },
    {
      heading: '4. Sharing and Disclosure',
      paragraphs: ['We do not sell or rent your personal data. We share it only in these cases:'],
      bullets: [
        'Service providers who process data on our behalf to run Velis: application hosting, database hosting, transactional email delivery, and (if you verify a phone number) SMS delivery. These providers may only use the data to provide their service to us.',
        'Legal requirements: if we are required to disclose data by law, legal process, or a valid governmental request, or to protect the rights, safety, or property of Velis, our users, or the public.',
        'Business transfer: if Velis is involved in a merger, acquisition, or sale of assets, your data may be transferred as part of that transaction; we will notify you if this materially changes how your data is handled.',
      ],
    },
    {
      heading: '5. Where Your Data Is Processed',
      paragraphs: [
        'Our servers and some of our service providers are located outside your country, including in the European Union and the United States. When your data is transferred internationally, we rely on appropriate safeguards required by applicable law.',
      ],
    },
    {
      heading: '6. Data Retention',
      paragraphs: [
        'We keep your account data for as long as your account exists. Verification and password-reset codes are short-lived and are deleted after they expire or are used.',
        'When you delete your account, your account and its associated data are permanently removed from our servers. Backups, if any, are overwritten on a rolling basis. We may retain limited information where required to comply with legal obligations or resolve disputes.',
      ],
    },
    {
      heading: '7. Security',
      paragraphs: [
        'Data is transmitted over encrypted connections (HTTPS/TLS) and stored on access-controlled servers. Passwords are hashed with a strong one-way algorithm and cannot be reversed.',
        'No method of transmission or storage is completely secure. While we take reasonable measures to protect your data, we cannot guarantee absolute security.',
      ],
    },
    {
      heading: '8. Your Rights',
      paragraphs: ['Depending on where you live, you may have the right to:'],
      bullets: [
        'Access the personal data we hold about you',
        'Correct inaccurate or incomplete data',
        'Delete your data (see "Deleting Your Account" below)',
        'Object to or restrict certain processing',
        'Withdraw consent for optional processing at any time',
        'Receive a copy of your data in a portable format',
        'Lodge a complaint with your local data-protection authority',
      ],
      afterBullets: ['To exercise any of these rights, contact us at contact@forsvelis.com. We will respond within the time required by applicable law.'],
    },
    {
      heading: '9. Deleting Your Account',
      paragraphs: [
        'You can delete your account at any time from within the app: Profile → Settings → Account → Delete Account. This permanently removes your account and its data from our servers and cannot be undone.',
      ],
    },
    {
      heading: "10. Children's Privacy",
      paragraphs: [
        'Velis is not intended for and may not be used by anyone under 13 years of age. During sign-up we ask for your date of birth and do not allow accounts for users under 13. We do not knowingly collect personal data from children under 13. If you believe a child has provided us with personal data, contact us and we will delete it.',
      ],
    },
    {
      heading: '11. Cookies and Similar Technologies',
      paragraphs: [
        'Velis does not use advertising or cross-app tracking technologies. The app uses local device storage only to keep you signed in and to remember your settings and offline progress.',
      ],
    },
    {
      heading: '12. Changes to This Policy',
      paragraphs: [
        'We may update this Privacy Policy from time to time. If we make material changes, we will update the "Last Updated" date and, where appropriate, notify you in the app. Continued use of Velis after an update means you accept the revised policy.',
      ],
    },
    {
      heading: '13. Contact',
      paragraphs: ['If you have any questions about this Privacy Policy or your data, contact us at contact@forsvelis.com.'],
    },
  ],
}

const PRIVACY_POLICY_TR: LegalDocument = {
  title: 'Gizlilik Politikası',
  lastUpdated: 'Son Güncelleme: 30 Ağustos 2026',
  intro: [
    'Velis ("Velis", "biz", "bizim" veya "bize") gizliliğinize saygı duyar. Bu Gizlilik Politikası; Velis mobil uygulamasını kullandığınızda hangi bilgileri topladığımızı, neden topladığımızı, verilerinizin nasıl saklanıp paylaşıldığını ve sahip olduğunuz seçim ve hakları açıklar.',
    'Hesap oluşturarak veya Velis\'i kullanarak bu Gizlilik Politikasını kabul etmiş olursunuz. Kabul etmiyorsanız lütfen uygulamayı kullanmayın.',
  ],
  sections: [
    {
      heading: '1. Topladığımız Bilgiler',
      paragraphs: ['Yalnızca uygulamayı ve hesabınızı çalıştırmak için gereken bilgileri topluyoruz.', 'Hesap oluştururken verdiğiniz bilgiler:'],
      bullets: [
        'Ad',
        'E-posta adresi',
        'Cinsiyet (Kadın / Erkek / Diğer / Belirtmek istemiyorum)',
        'Doğum tarihi (en az 13 yaşında olduğunuzu doğrulamak için kullanılır)',
        'Şifre — yalnızca tek yönlü kriptografik bir özet (hash) olarak saklanır. Gerçek şifrenizi hiçbir zaman saklamayız, göremeyiz ve geri döndürmemizin hiçbir yolu yoktur.',
      ],
      afterBullets: [
        'Uygulamayı kullandıkça oluşan bilgiler: uygulama içi ilerlemeniz ve etkinliğiniz — yolculuk günü, mevcut seri, toplam XP, tamamlanan ritüel sayısı, toplam ritüel süresi ve ödül alma geçmişiniz. Giriş yaptıysanız bu veriler, cihazlarınız arasında senkronlanabilmesi için sunucularımızda saklanır.',
        'Tercihler: seçtiğiniz dil ve bildirim ayarları.',
        'Hesap bilgileri: hesabınızın oluşturulma tarihi ve güvenlik amacıyla bazı hesap olaylarının zaman damgaları.',
        'Velis\'in çekirdek özelliklerini (ritüel, yolculuk, yerel ilerleme) hesap oluşturmadan kullanabilirsiniz. Bu durumda ilerlemeniz yalnızca cihazınızda kalır ve bize gönderilmez.',
      ],
    },
    {
      heading: '2. Bilgilerinizi Nasıl Kullanıyoruz',
      paragraphs: ['Bilgilerinizi şu amaçlarla kullanırız:'],
      bullets: [
        'Hesabınızı oluşturmak, işletmek ve giriş yaptığınızda kimliğinizi doğrulamak',
        'İlerlemenizi kaydetmek ve cihazlarınız arasında senkronlamak',
        'Kayıtlı kullanıcıları seri ve XP\'ye göre sıralayan liderlik tablosunu göstermek (adınız ve istatistikleriniz orada diğer kullanıcılara görünür; e-posta adresiniz asla gösterilmez)',
        'Hesapla ilgili e-postaları (doğrulama kodları, şifre sıfırlama) ve kapatmadığınız ritüel hatırlatma e-postalarını göndermek',
        'Hizmeti güvende tutmak, kötüye kullanımı önlemek ve sorunları gidermek',
        'Uygulamanın nasıl kullanıldığını genel/toplu olarak anlayıp geliştirmek',
      ],
      afterBullets: [
        'Verilerinizi reklam amacıyla kullanmayız ve satmayız.',
        'Ekibimizin yetkili üyeleri; destek, moderasyon, güvenlik veya yasal uyum için makul ölçüde gerekli olduğunda hesap verilerine (şifreler hariç) erişebilir.',
      ],
    },
    {
      heading: '3. İşlemenin Hukuki Dayanakları',
      paragraphs: [
        'Türk KVKK veya AB/İngiltere GDPR gibi veri koruma mevzuatının uygulandığı durumlarda kişisel verilerinizi şu dayanaklarla işleriz: sizinle olan sözleşmemizin ifası (uygulamayı ve hesabınızı sağlamak); açık rızanız (Ayarlar\'dan istediğiniz zaman geri çekebileceğiniz isteğe bağlı hatırlatma e-postaları için); ve haklarınızla dengelenmiş meşru menfaatlerimiz (hizmeti güvende tutmak ve geliştirmek).',
      ],
    },
    {
      heading: '4. Paylaşım ve Açıklama',
      paragraphs: ['Kişisel verilerinizi satmaz veya kiralamayız. Verilerinizi yalnızca şu durumlarda paylaşırız:'],
      bullets: [
        'Velis\'i çalıştırmak için verileri bizim adımıza işleyen hizmet sağlayıcılar: uygulama barındırma, veritabanı barındırma, işlemsel e-posta gönderimi ve (telefon numarası doğrularsanız) SMS gönderimi. Bu sağlayıcılar verileri yalnızca bize hizmet sunmak için kullanabilir.',
        'Yasal gereklilikler: yasa, hukuki süreç veya geçerli bir resmi talep gereği veya Velis\'in, kullanıcılarının ya da kamunun haklarını, güvenliğini veya mülkiyetini korumak için veri açıklamamız gerekirse.',
        'İşletme devri: Velis bir birleşme, satın alma veya varlık satışına dahil olursa verileriniz bu işlemin parçası olarak devredilebilir; verilerinizin işlenme şeklini esaslı biçimde değiştirirse sizi bilgilendiririz.',
      ],
    },
    {
      heading: '5. Verilerinizin İşlendiği Yer',
      paragraphs: [
        'Sunucularımız ve bazı hizmet sağlayıcılarımız, Avrupa Birliği ve Amerika Birleşik Devletleri dahil olmak üzere ülkenizin dışında bulunur. Verileriniz uluslararası aktarıldığında, ilgili mevzuatın gerektirdiği uygun güvencelere dayanırız.',
      ],
    },
    {
      heading: '6. Veri Saklama',
      paragraphs: [
        'Hesap verilerinizi hesabınız var olduğu sürece saklarız. Doğrulama ve şifre sıfırlama kodları kısa ömürlüdür; süresi dolduğunda veya kullanıldığında silinir.',
        'Hesabınızı sildiğinizde, hesabınız ve ilişkili verileriniz sunucularımızdan kalıcı olarak kaldırılır. Varsa yedekler dönüşümlü olarak üzerine yazılır. Yasal yükümlülüklere uymak veya uyuşmazlıkları çözmek için gereken sınırlı bilgiyi saklayabiliriz.',
      ],
    },
    {
      heading: '7. Güvenlik',
      paragraphs: [
        'Veriler şifreli bağlantılar (HTTPS/TLS) üzerinden aktarılır ve erişimi kontrollü sunucularda saklanır. Şifreler güçlü, tek yönlü bir algoritmayla hash\'lenir ve geri döndürülemez.',
        'Hiçbir aktarım veya saklama yöntemi tamamen güvenli değildir. Verilerinizi korumak için makul önlemler alsak da mutlak güvenliği garanti edemeyiz.',
      ],
    },
    {
      heading: '8. Haklarınız',
      paragraphs: ['Yaşadığınız yere bağlı olarak şu haklara sahip olabilirsiniz:'],
      bullets: [
        'Hakkınızda tuttuğumuz kişisel verilere erişmek',
        'Yanlış veya eksik verileri düzelttirmek',
        'Verilerinizi sildirmek (aşağıdaki "Hesabınızı Silme" bölümüne bakın)',
        'Belirli işlemelere itiraz etmek veya işlemeyi kısıtlatmak',
        'İsteğe bağlı işlemeler için rızanızı istediğiniz zaman geri çekmek',
        'Verilerinizin taşınabilir bir kopyasını almak',
        'Yerel veri koruma otoritenize şikâyette bulunmak',
      ],
      afterBullets: ['Bu haklardan herhangi birini kullanmak için contact@forsvelis.com adresinden bize ulaşın. İlgili mevzuatın gerektirdiği süre içinde yanıt veririz.'],
    },
    {
      heading: '9. Hesabınızı Silme',
      paragraphs: [
        'Hesabınızı istediğiniz zaman uygulama içinden silebilirsiniz: Profil → Ayarlar → Hesap → Hesabı Sil. Bu işlem, hesabınızı ve verilerinizi sunucularımızdan kalıcı olarak kaldırır ve geri alınamaz.',
      ],
    },
    {
      heading: '10. Çocukların Gizliliği',
      paragraphs: [
        'Velis, 13 yaşın altındaki hiç kimse için tasarlanmamıştır ve onlar tarafından kullanılamaz. Kayıt sırasında doğum tarihinizi sorarız ve 13 yaşın altındaki kullanıcılar için hesap açılmasına izin vermeyiz. 13 yaşın altındaki çocuklardan bilerek kişisel veri toplamıyoruz. Bir çocuğun bize kişisel veri verdiğini düşünüyorsanız bizimle iletişime geçin, veriyi sileriz.',
      ],
    },
    {
      heading: '11. Çerezler ve Benzer Teknolojiler',
      paragraphs: [
        'Velis, reklam veya uygulamalar arası takip teknolojileri kullanmaz. Uygulama, yalnızca sizi oturumda tutmak ve ayarlarınız ile çevrimdışı ilerlemenizi hatırlamak için cihazınızdaki yerel depolamayı kullanır.',
      ],
    },
    {
      heading: '12. Bu Politikadaki Değişiklikler',
      paragraphs: [
        'Bu Gizlilik Politikasını zaman zaman güncelleyebiliriz. Esaslı değişiklikler yaparsak "Son Güncelleme" tarihini güncelleriz ve uygun olduğunda sizi uygulama içinde bilgilendiririz. Bir güncellemeden sonra Velis\'i kullanmaya devam etmeniz, revize edilmiş politikayı kabul ettiğiniz anlamına gelir.',
      ],
    },
    {
      heading: '13. İletişim',
      paragraphs: ['Bu Gizlilik Politikası veya verileriniz hakkında sorularınız varsa contact@forsvelis.com adresinden bize ulaşın.'],
    },
  ],
}

export function getTermsOfService(locale: string): LegalDocument {
  return locale === 'tr' ? TERMS_OF_SERVICE_TR : TERMS_OF_SERVICE_EN
}

export function getPrivacyPolicy(locale: string): LegalDocument {
  return locale === 'tr' ? PRIVACY_POLICY_TR : PRIVACY_POLICY_EN
}

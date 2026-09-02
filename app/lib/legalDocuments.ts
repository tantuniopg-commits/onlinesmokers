// Velis Privacy Policy / Terms of Service - içerik burada tek yerden
// geliyor (bkz. app/profile/page.tsx doküman okuyucusu, app/profile/settings/
// privacy/page.tsx). EN/TR ayrı kaynak metinler - getTermsOfService/
// getPrivacyPolicy o anki locale'e göre doğru olanı döndürüyor.
//
// Gizlilik Politikası 2026-08-30'da baştan yazıldı, 2026-09-02'de gözden
// geçirildi - uygulamanın GERÇEKTEN topladığı her veri türünü (ad, e-posta,
// cinsiyet, doğum tarihi, hash'li şifre, uygulama içi ilerleme/XP/streak,
// dil+bildirim tercihleri, hesap meta verisi) listeliyor; KVKK/GDPR
// dayanakları, uluslararası aktarım, saklama, haklar, hesap silme ve 13+
// kuralı dahil. Telefon/SMS artık toplanmıyor (telefonlu kayıt kaldırıldı).
//
// Terms of Service 2026-09-02'de genişletildi - TIBBİ SORUMLULUK REDDİ
// (Velis tıbbi cihaz/tavsiye değil), yaş şartı, hizmet tanımı, ödeme
// (ücretsiz, IAP yok), görünen ad kuralı eklendi.
//
// İki dil BİREBİR aynı yapı - biri değişirse diğeri de değişmeli.

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
  lastUpdated: 'Last Updated: September 2, 2026',
  intro: [
    'These Terms of Service ("Terms") are an agreement between you and the developer of Velis ("Velis", "we", "us"). By downloading, accessing, or using the Velis app, you agree to these Terms. If you do not agree, do not use the app.',
  ],
  sections: [
    {
      heading: '1. About These Terms',
      paragraphs: [
        'Velis is operated by an independent developer based in Türkiye. You can reach us at contact@forsvelis.com.',
        'These Terms cover your use of the app. Our Privacy Policy explains how we handle your data and is part of your agreement with us.',
      ],
    },
    {
      heading: '2. What Velis Is — and Is Not',
      paragraphs: [
        'Velis is a calm, ritual-based app for the moment a craving appears. It gives you a short, deliberate practice to run, tracks your progress over time, and lets you compare streaks and XP with other users.',
        'Velis is not a medical device and does not provide medical advice, diagnosis, or treatment. It is not a smoking-cessation program and is not a substitute for professional help, a doctor, a therapist, or a quitline. Nothing in the app is medical or health advice. If you want to stop smoking or have any concerns about your health, talk to a qualified healthcare professional. Never disregard or delay professional advice because of something in Velis. Your use of the app is your own choice and responsibility.',
      ],
    },
    {
      heading: '3. Eligibility',
      paragraphs: [
        'You must be at least 13 years old to use Velis. By using the app you confirm that you meet this requirement. We ask for your date of birth at sign-up and do not allow accounts for anyone under 13.',
      ],
    },
    {
      heading: '4. Your Account',
      paragraphs: [
        'You can use the core features of Velis without an account. If you create one, you agree to provide accurate information, to keep your password confidential, and to be responsible for everything that happens under your account. One account per person. Tell us at contact@forsvelis.com if you believe your account has been accessed without your permission.',
        'You can delete your account at any time from Profile → Settings → Account → Delete Account.',
      ],
    },
    {
      heading: '5. Acceptable Use',
      paragraphs: ['You agree not to:'],
      bullets: [
        'Use the app for any unlawful purpose or in violation of these Terms',
        'Attempt to disrupt, overload, reverse-engineer, or gain unauthorized access to the app or its servers',
        "Interfere with or manipulate progress data, the leaderboard, or other users' experience",
        'Violate the rights of Velis or of any other person',
      ],
    },
    {
      heading: '6. Display Names and the Leaderboard',
      paragraphs: [
        'The leaderboard shows your name and your stats (streak and XP) to other users; your email is never shown. Choose a name that is not offensive, misleading, or impersonating someone else. We may change or remove a name, or remove an account from the leaderboard, if it breaks this rule.',
      ],
    },
    {
      heading: '7. Payments',
      paragraphs: [
        'Velis is currently free to use. There are no in-app purchases and no subscriptions. If this changes in the future, we will update these Terms and make any paid features clear before you buy.',
      ],
    },
    {
      heading: '8. Intellectual Property',
      paragraphs: [
        'The Velis app — its name, design, text, graphics, and sounds — is owned by us or our licensors and is protected by law. We grant you a personal, non-exclusive, non-transferable, revocable licence to use the app for your own personal, non-commercial use. You may not copy, modify, distribute, sell, or create derivative works from any part of the app without our permission.',
      ],
    },
    {
      heading: '9. Disclaimer of Warranties',
      paragraphs: [
        'The app is provided "as is" and "as available", without warranties of any kind, express or implied, including fitness for a particular purpose, accuracy, or uninterrupted or error-free operation. Velis relies on an internet connection and third-party services and may be unavailable at times.',
      ],
    },
    {
      heading: '10. Limitation of Liability',
      paragraphs: [
        'To the fullest extent permitted by law, Velis and its developer will not be liable for any indirect, incidental, special, or consequential damages, or for any loss of data, arising from your use of or inability to use the app. Nothing in these Terms limits liability that cannot be limited under applicable law.',
      ],
    },
    {
      heading: '11. Termination',
      paragraphs: [
        'You can stop using Velis and delete your account at any time. We may suspend or end your access if you break these Terms or if we stop offering the app. Sections that by their nature should survive termination (such as intellectual property, disclaimers, and limitation of liability) will continue to apply.',
      ],
    },
    {
      heading: '12. Changes to These Terms',
      paragraphs: [
        'We may update these Terms from time to time. If we make material changes we will update the "Last Updated" date and, where appropriate, notify you in the app. Continuing to use Velis after an update means you accept the revised Terms.',
      ],
    },
    {
      heading: '13. Governing Law',
      paragraphs: [
        'These Terms are governed by the laws of the Republic of Türkiye, without regard to conflict-of-law rules. Mandatory consumer-protection rights you have in your country of residence are not affected.',
      ],
    },
    {
      heading: '14. Contact',
      paragraphs: ['Questions about these Terms: contact@forsvelis.com'],
    },
  ],
}

const TERMS_OF_SERVICE_TR: LegalDocument = {
  title: 'Kullanım Koşulları',
  lastUpdated: 'Son Güncelleme: 2 Eylül 2026',
  intro: [
    'Bu Kullanım Koşulları ("Koşullar"), sizinle Velis geliştiricisi ("Velis", "biz", "bize") arasında bir sözleşmedir. Velis uygulamasını indirerek, erişerek veya kullanarak bu Koşulları kabul etmiş olursunuz. Kabul etmiyorsanız uygulamayı kullanmayın.',
  ],
  sections: [
    {
      heading: '1. Bu Koşullar Hakkında',
      paragraphs: [
        'Velis, Türkiye merkezli bağımsız bir geliştirici tarafından işletilmektedir. Bize contact@forsvelis.com adresinden ulaşabilirsiniz.',
        'Bu Koşullar uygulamayı kullanımınızı kapsar. Gizlilik Politikamız verilerinizi nasıl ele aldığımızı açıklar ve bizimle olan sözleşmenizin bir parçasıdır.',
      ],
    },
    {
      heading: '2. Velis Nedir — ve Ne Değildir',
      paragraphs: [
        'Velis, bir isteğin/dürtünün belirdiği an için tasarlanmış, ritüel temelli sakin bir uygulamadır. Uygulayabileceğiniz kısa ve bilinçli bir pratik sunar, zamanla ilerlemenizi takip eder ve seri ile XP’nizi diğer kullanıcılarla karşılaştırmanıza olanak tanır.',
        'Velis bir tıbbi cihaz değildir; tıbbi tavsiye, teşhis veya tedavi sağlamaz. Bir sigara bırakma programı değildir ve profesyonel yardımın, bir doktorun, bir terapistin veya bir bırakma danışma hattının yerini tutmaz. Uygulamadaki hiçbir şey tıbbi veya sağlıkla ilgili tavsiye değildir. Sigarayı bırakmak istiyorsanız veya sağlığınızla ilgili herhangi bir endişeniz varsa nitelikli bir sağlık uzmanına başvurun. Velis’teki herhangi bir şey nedeniyle profesyonel tavsiyeyi asla göz ardı etmeyin veya ertelemeyin. Uygulamayı kullanmak sizin kendi seçiminiz ve sorumluluğunuzdadır.',
      ],
    },
    {
      heading: '3. Uygunluk',
      paragraphs: [
        'Velis’i kullanmak için en az 13 yaşında olmalısınız. Uygulamayı kullanarak bu şartı karşıladığınızı onaylarsınız. Kayıt sırasında doğum tarihinizi sorarız ve 13 yaşın altındaki hiç kimse için hesap açılmasına izin vermeyiz.',
      ],
    },
    {
      heading: '4. Hesabınız',
      paragraphs: [
        'Velis’in çekirdek özelliklerini hesap olmadan kullanabilirsiniz. Hesap oluşturursanız; doğru bilgi vermeyi, şifrenizi gizli tutmayı ve hesabınız altında olan her şeyden sorumlu olmayı kabul edersiniz. Kişi başına bir hesap. Hesabınıza izniniz olmadan erişildiğini düşünüyorsanız contact@forsvelis.com adresinden bize bildirin.',
        'Hesabınızı istediğiniz zaman Profil → Ayarlar → Hesap → Hesabı Sil yolundan silebilirsiniz.',
      ],
    },
    {
      heading: '5. Kabul Edilebilir Kullanım',
      paragraphs: ['Aşağıdakileri yapmamayı kabul edersiniz:'],
      bullets: [
        'Uygulamayı herhangi bir yasa dışı amaçla veya bu Koşulları ihlal edecek şekilde kullanmak',
        'Uygulamayı ya da sunucularını bozmaya, aşırı yüklemeye, tersine mühendisliğe tabi tutmaya veya yetkisiz erişim sağlamaya çalışmak',
        'İlerleme verilerine, liderlik tablosuna ya da diğer kullanıcıların deneyimine müdahale etmek veya bunları manipüle etmek',
        'Velis’in veya başka bir kişinin haklarını ihlal etmek',
      ],
    },
    {
      heading: '6. Görünen Adlar ve Liderlik Tablosu',
      paragraphs: [
        'Liderlik tablosu adınızı ve istatistiklerinizi (seri ve XP) diğer kullanıcılara gösterir; e-posta adresiniz asla gösterilmez. Hakaret içermeyen, yanıltıcı olmayan ve başkasını taklit etmeyen bir ad seçin. Bu kurala aykırı bir adı değiştirebilir veya kaldırabilir ya da bir hesabı liderlik tablosundan çıkarabiliriz.',
      ],
    },
    {
      heading: '7. Ödemeler',
      paragraphs: [
        'Velis şu anda ücretsizdir. Uygulama içi satın alma ve abonelik yoktur. İleride bu değişirse bu Koşulları güncelleriz ve satın almadan önce ücretli özellikleri açıkça belirtiriz.',
      ],
    },
    {
      heading: '8. Fikri Mülkiyet',
      paragraphs: [
        'Velis uygulaması — adı, tasarımı, metinleri, grafikleri ve sesleri — bize veya lisans verenlerimize aittir ve yasalarla korunur. Uygulamayı yalnızca kişisel, ticari olmayan kullanımınız için kullanmanıza yönelik kişisel, münhasır olmayan, devredilemez ve geri alınabilir bir lisans veririz. İznimiz olmadan uygulamanın hiçbir bölümünü kopyalayamaz, değiştiremez, dağıtamaz, satamaz veya bundan türev çalışmalar oluşturamazsınız.',
      ],
    },
    {
      heading: '9. Garanti Reddi',
      paragraphs: [
        'Uygulama, açık veya zımni hiçbir garanti verilmeksizin "olduğu gibi" ve "mevcut olduğu şekilde" sunulur; belirli bir amaca uygunluk, doğruluk veya kesintisiz ya da hatasız çalışma garantileri dahil. Velis bir internet bağlantısına ve üçüncü taraf hizmetlerine bağlıdır ve zaman zaman kullanılamayabilir.',
      ],
    },
    {
      heading: '10. Sorumluluğun Sınırlandırılması',
      paragraphs: [
        'Yasaların izin verdiği azami ölçüde, Velis ve geliştiricisi; uygulamayı kullanmanızdan veya kullanamamanızdan doğan hiçbir dolaylı, arızi, özel ya da sonuçsal zarardan veya herhangi bir veri kaybından sorumlu olmayacaktır. Bu Koşullardaki hiçbir hüküm, ilgili mevzuata göre sınırlandırılamayacak sorumluluğu sınırlandırmaz.',
      ],
    },
    {
      heading: '11. Fesih',
      paragraphs: [
        'Velis’i kullanmayı istediğiniz zaman bırakabilir ve hesabınızı silebilirsiniz. Bu Koşulları ihlal etmeniz veya uygulamayı sunmayı bırakmamız durumunda erişiminizi askıya alabilir ya da sonlandırabiliriz. Niteliği gereği fesihten sonra da geçerli kalması gereken bölümler (fikri mülkiyet, garanti reddi ve sorumluluğun sınırlandırılması gibi) uygulanmaya devam eder.',
      ],
    },
    {
      heading: '12. Bu Koşullardaki Değişiklikler',
      paragraphs: [
        'Bu Koşulları zaman zaman güncelleyebiliriz. Esaslı değişiklikler yaparsak "Son Güncelleme" tarihini günceller ve uygun olduğunda sizi uygulama içinde bilgilendiririz. Bir güncellemeden sonra Velis’i kullanmaya devam etmeniz, revize edilmiş Koşulları kabul ettiğiniz anlamına gelir.',
      ],
    },
    {
      heading: '13. Uygulanacak Hukuk',
      paragraphs: [
        'Bu Koşullar, kanunlar ihtilafı kurallarına bakılmaksızın Türkiye Cumhuriyeti kanunlarına tabidir. İkamet ettiğiniz ülkede sahip olduğunuz zorunlu tüketici hakları bundan etkilenmez.',
      ],
    },
    {
      heading: '14. İletişim',
      paragraphs: ['Bu Koşullarla ilgili sorular: contact@forsvelis.com'],
    },
  ],
}

const PRIVACY_POLICY_EN: LegalDocument = {
  title: 'Privacy Policy',
  lastUpdated: 'Last Updated: September 2, 2026',
  intro: [
    'Velis ("Velis", "we", "our", or "us") respects your privacy. This Privacy Policy explains what information we collect when you use the Velis mobile application, why we collect it, how it is stored and shared, and the choices and rights you have.',
    'Velis is operated by an independent developer based in Türkiye. For data-protection purposes, that developer is the data controller for your personal data and can be reached at contact@forsvelis.com.',
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
        'Maintain basic server logs (such as error and request logs) needed to operate, protect, and improve the service',
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
        'Service providers who process data on our behalf to run Velis: application hosting, database hosting, and transactional email delivery. These providers may only use the data to provide their service to us.',
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
  lastUpdated: 'Son Güncelleme: 2 Eylül 2026',
  intro: [
    'Velis ("Velis", "biz", "bizim" veya "bize") gizliliğinize saygı duyar. Bu Gizlilik Politikası; Velis mobil uygulamasını kullandığınızda hangi bilgileri topladığımızı, neden topladığımızı, verilerinizin nasıl saklanıp paylaşıldığını ve sahip olduğunuz seçim ve hakları açıklar.',
    'Velis, Türkiye merkezli bağımsız bir geliştirici tarafından işletilmektedir. Veri koruma açısından bu geliştirici, kişisel verilerinizin veri sorumlusudur ve contact@forsvelis.com adresinden kendisine ulaşılabilir.',
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
        'Hizmeti işletmek, korumak ve geliştirmek için gereken temel sunucu günlüklerini (hata ve istek günlükleri gibi) tutmak',
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
        'Velis\'i çalıştırmak için verileri bizim adımıza işleyen hizmet sağlayıcılar: uygulama barındırma, veritabanı barındırma ve işlemsel e-posta gönderimi. Bu sağlayıcılar verileri yalnızca bize hizmet sunmak için kullanabilir.',
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

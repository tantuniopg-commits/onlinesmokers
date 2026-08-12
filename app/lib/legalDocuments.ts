// VELIS Privacy Policy / Terms of Service - içerik burada tek yerden geliyor
// (bkz. app/profile/page.tsx doküman okuyucusu). Metin kaynak PDF'lerden
// BİREBİR alındı, hiç değiştirilmedi.

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

export const TERMS_OF_SERVICE: LegalDocument = {
  title: 'Terms of Service',
  lastUpdated: 'Last Updated: August 20, 2026',
  intro: ['By using VELIS, you agree to these Terms of Service.'],
  sections: [
    {
      heading: '1. Use of the App',
      paragraphs: ['You agree to use VELIS only for lawful purposes and in a way that does not harm the app or other users.'],
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
      paragraphs: ['All content and features of VELIS belong to us. You may not copy or distribute them without permission.'],
    },
    {
      heading: '5. Termination',
      paragraphs: ['We may suspend or terminate your access if you violate these terms.'],
    },
    {
      heading: '6. Disclaimer',
      paragraphs: ['VELIS is provided "as is" without warranties of any kind.'],
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
      paragraphs: ['Email: forsvelis@gmail.com'],
    },
  ],
}

export const PRIVACY_POLICY: LegalDocument = {
  title: 'Privacy Policy',
  lastUpdated: 'Last Updated: August 20, 2026',
  intro: [
    'VELIS ("we", "our", or "us") respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our application.',
    'By using VELIS, you agree to this Privacy Policy.',
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
      paragraphs: ['VELIS is not intended for users under 13. We do not knowingly collect data from children.'],
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
      paragraphs: ['Email: forsvelis@gmail.com'],
    },
  ],
}

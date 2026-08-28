import type { CapacitorConfig } from '@capacitor/cli';

// iOS App Store paketlemesi için (bkz. npm run build:capacitor). webDir,
// Next.js'in statik export çıktısı (next.config.ts'teki CAPACITOR_BUILD=1
// modunda `output: 'export'` ile üretiliyor) - normal `npm run dev`/`build`
// buna hiç dokunmuyor, web dağıtımı bundan bağımsız çalışmaya devam ediyor.
const config: CapacitorConfig = {
  // appId (bundle identifier) kullanıcıya GÖRÜNMÜYOR - değiştirmek App
  // Store'da yeni bir uygulama + yeni provisioning demek, o yüzden aynı
  // kalıyor. Kullanıcının gördüğü isim CFBundleDisplayName (Info.plist).
  appId: 'com.forsvelis.app',
  appName: 'Velis',
  webDir: 'out',
};

export default config;

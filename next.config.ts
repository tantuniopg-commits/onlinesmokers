import type { NextConfig } from "next";

// Capacitor (iOS/Android native paketleme, bkz. capacitor.config.ts) statik
// bir dosya seti bekliyor - Next.js'in normal sunucu modunda çalışan
// redirects()/middleware gibi özellikleri "output: export" ile birlikte
// KULLANILAMIYOR. Web dağıtımı (next dev/build normal sunucu modu) hiç
// etkilenmesin diye bu SADECE `npm run build:capacitor` sırasında
// (CAPACITOR_BUILD=1) devreye giriyor - bkz. package.json.
const isCapacitorBuild = process.env.CAPACITOR_BUILD === '1';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    viewTransition: true,
  },
  // Dev server'a hem 127.0.0.1'den hem de yerel ağdaki telefondan erişmek
  // için (bkz. `next dev --hostname 0.0.0.0`) - Next.js varsayılan olarak
  // dev kaynaklarına (HMR) cross-origin erişimi güvenlik amacıyla engelliyor.
  allowedDevOrigins: ['127.0.0.1', '192.168.1.146', '172.20.10.2', '192.168.1.9', '10.3.46.166', '192.168.1.106', '192.168.1.115'],
  ...(isCapacitorBuild
    ? {
        output: 'export' as const,
        images: { unoptimized: true },
      }
    : {
        async redirects() {
          return [
            { source: '/simulate', destination: '/', permanent: false },
            { source: '/mission', destination: '/', permanent: false },
          ];
        },
      }),
};

export default nextConfig;

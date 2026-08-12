import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    viewTransition: true,
  },
  // Dev server'a hem 127.0.0.1'den hem de yerel ağdaki telefondan erişmek
  // için (bkz. `next dev --hostname 0.0.0.0`) - Next.js varsayılan olarak
  // dev kaynaklarına (HMR) cross-origin erişimi güvenlik amacıyla engelliyor.
  allowedDevOrigins: ['127.0.0.1', '192.168.1.146', '172.20.10.2', '192.168.1.9'],
  async redirects() {
    return [
      { source: '/simulate', destination: '/', permanent: false },
      { source: '/mission', destination: '/', permanent: false },
    ];
  },
};

export default nextConfig;

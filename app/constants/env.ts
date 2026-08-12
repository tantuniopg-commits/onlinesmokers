// Tek geliştirme-modu bayrağı kaynağı - uygulama genelinde bağımsız
// process.env.NODE_ENV kontrolleri yerine buradan import edilir.
export const isDev = process.env.NODE_ENV === 'development'

const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')

// MONGO_URI verilmemişse (zero-config yerel geliştirme) gerçek bir mongod
// binary'sini indirip yerelde başlatıyoruz (bkz. mongodb-memory-server) -
// bcrypt/JWT tarafı tamamen gerçek. "memory-server" ismine rağmen veri
// GERÇEKTEN diske yazılıyor (bkz. PERSIST_DB_PATH) - sabit bir dbPath/dbName
// verildiği için süreç yeniden başlasa da (hatta bilgisayar kapansa da)
// kayıtlı kullanıcılar/hesaplar kaybolmuyor. Gerçek üretim ortamında .env'de
// harici bir MONGO_URI ayarlanabilir, o zaman bu blok hiç çalışmaz.
const PERSIST_DB_PATH = path.join(__dirname, '../../.data/mongo')

async function connectDB() {
  let uri = process.env.MONGO_URI

  if (!uri) {
    fs.mkdirSync(PERSIST_DB_PATH, { recursive: true })
    const { MongoMemoryServer } = require('mongodb-memory-server')
    const mongod = await MongoMemoryServer.create({
      instance: {
        dbPath: PERSIST_DB_PATH,
        dbName: 'puffless',
        storageEngine: 'wiredTiger',
      },
    })
    uri = mongod.getUri()
    console.log('No MONGO_URI set - using persistent local MongoDB at', uri, '(data on disk at', PERSIST_DB_PATH, ')')
  }

  await mongoose.connect(uri)
  console.log('MongoDB connected')
}

module.exports = connectDB

import mongoose from 'mongoose'
import dns from 'dns'

// Fix for Windows / ISP DNS failing to resolve MongoDB Atlas SRV records (only on Windows)
if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4'])
  } catch (e) {
    // Ignore if not supported in environment
  }
}

const ATLAS_URI =
  'mongodb+srv://yadgirshazada789_db_user:1uyS7m1IYpJZhJyu@cluster0.j7sy7lk.mongodb.net/uniquegraphic?retryWrites=true&w=majority'

let cachedPromise = null

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection
  }

  if (!cachedPromise) {
    const mongoUri = process.env.MONGO_URI || ATLAS_URI
    cachedPromise = mongoose
      .connect(mongoUri, {
        serverSelectionTimeoutMS: 8000,
      })
      .then((conn) => {
        console.log(
          `[MongoDB Connected] Host: ${conn.connection.host} | Database: ${conn.connection.name}`
        )
        return conn
      })
      .catch((error) => {
        cachedPromise = null
        console.error(`[MongoDB Connection Error]: ${error.message}`)
        throw error
      })
  }

  return cachedPromise
}

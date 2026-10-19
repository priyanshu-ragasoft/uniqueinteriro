import mongoose from 'mongoose'
import dns from 'dns'

// Fix for Windows / ISP DNS failing to resolve MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4'])
} catch (e) {
  // Ignore if not supported in environment
}

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/uniquegraphic'
    const conn = await mongoose.connect(mongoUri)
    console.log(`[MongoDB Connected] Host: ${conn.connection.host} | Database: ${conn.connection.name}`)
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`)
    // Do not terminate process immediately so server can report descriptive error to API clients
  }
}

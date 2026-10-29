import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import sharp from 'sharp'
import { connectDB } from '../config/db.js'
import { saveToMediaBucket } from '../controllers/mediaController.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../public/website-assets')
const imageExt = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif'])

const walk = (dir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (imageExt.has(path.extname(entry.name).toLowerCase())) out.push(full)
  }
  return out
}

const run = async () => {
  if (!fs.existsSync(root)) {
    console.error('Missing folder:', root)
    process.exit(1)
  }
  await connectDB()
  const files = walk(root)
  const existing = new Set(
    (await mongoose.connection.db.collection('media.files').find({}, { projection: { filename: 1 } }).toArray()).map(
      (file) => file.filename
    )
  )
  console.log(`Images on disk: ${files.length}. Already in MongoDB: ${existing.size}`)

  let saved = 0
  let skipped = 0
  for (const full of files) {
    const filename = `website-assets/${path.relative(root, full).split(path.sep).join('/')}`
    if (existing.has(filename)) {
      skipped += 1
      continue
    }
    const buffer = await sharp(full)
      .rotate()
      .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 68, mozjpeg: true })
      .toBuffer()
    await saveToMediaBucket(filename, buffer, 'image/jpeg')
    saved += 1
    if (saved % 20 === 0) console.log(`Uploaded ${saved}...`)
  }

  const stats = await mongoose.connection.db.stats()
  console.log(`Done. New uploads: ${saved}. Skipped: ${skipped}. DB data size MB: ${(stats.dataSize / 1024 / 1024).toFixed(1)}`)
  await mongoose.disconnect()
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})

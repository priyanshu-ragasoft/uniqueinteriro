import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { saveToMediaBucket } from './mediaController.js'

const uploadDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../public/uploads')

const MIME_EXT = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
  'image/svg+xml': '.svg',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'video/ogg': '.ogg',
  'video/quicktime': '.mov',
  'application/octet-stream': '.bin',
}

function pickExt(filename, mime) {
  const fromName = path.extname(filename || '').toLowerCase()
  if (fromName) return fromName
  return MIME_EXT[String(mime || '').toLowerCase()] || '.bin'
}

export const uploadMediaFile = async (req, res) => {
  try {
    const match = String(req.body?.dataUrl || '').match(/^data:([\w/+.-]+);base64,(.+)$/)
    if (!match) {
      return res.status(400).json({ success: false, message: 'Choose any photo, video, or media file.' })
    }
    const mime = match[1]
    const ext = pickExt(req.body?.filename, mime)
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
    const buffer = Buffer.from(match[2], 'base64')
    try {
      fs.mkdirSync(uploadDir, { recursive: true })
      fs.writeFileSync(path.join(uploadDir, name), buffer)
    } catch {
      // Vercel disk is read-only. MongoDB is the copy the site actually serves.
    }
    const url = await saveToMediaBucket(`uploads/${name}`, buffer, mime)
    return res.status(200).json({ success: true, url })
  } catch (error) {
    console.error('[Upload Error]:', error.message)
    return res.status(500).json({ success: false, message: 'Could not store that file. Try again.' })
  }
}

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { saveToMediaBucket } from './mediaController.js'

const uploadDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../public/uploads')
const allowed = new Set(['.mp4', '.webm', '.ogg', '.mov', '.jpg', '.jpeg', '.png', '.webp', '.gif'])

export const uploadMediaFile = async (req, res) => {
  try {
    const match = String(req.body?.dataUrl || '').match(/^data:([\w/+.-]+);base64,(.+)$/)
    if (!match) {
      return res.status(400).json({ success: false, message: 'Choose a photo or video file.' })
    }
    const ext = path.extname(req.body?.filename || '').toLowerCase()
    if (!allowed.has(ext)) {
      return res.status(400).json({ success: false, message: 'Use an mp4, webm, jpg, png, or webp file.' })
    }
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
    const buffer = Buffer.from(match[2], 'base64')
    try {
      fs.mkdirSync(uploadDir, { recursive: true })
      fs.writeFileSync(path.join(uploadDir, name), buffer)
    } catch {
      // Vercel disk is read-only. MongoDB is the copy the site actually serves.
    }
    const url = await saveToMediaBucket(`uploads/${name}`, buffer)
    return res.status(200).json({ success: true, url })
  } catch (error) {
    console.error('[Upload Error]:', error.message)
    return res.status(500).json({ success: false, message: 'Could not store that file. Try a smaller mp4.' })
  }
}

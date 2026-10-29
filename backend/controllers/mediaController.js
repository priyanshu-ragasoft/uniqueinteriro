import mongoose from 'mongoose'
import { GridFSBucket } from 'mongodb'
import { connectDB } from '../config/db.js'

const BUCKET = 'media'

const MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg',
  '.mov': 'video/quicktime',
}

function extOf(name) {
  const i = String(name).lastIndexOf('.')
  return i >= 0 ? name.slice(i).toLowerCase() : ''
}

export async function getMediaBucket() {
  await connectDB()
  return new GridFSBucket(mongoose.connection.db, { bucketName: BUCKET })
}

export async function saveToMediaBucket(filename, buffer, contentType) {
  const bucket = await getMediaBucket()
  const existing = await mongoose.connection.db.collection(`${BUCKET}.files`).findOne({ filename })
  if (existing) await bucket.delete(existing._id)
  await new Promise((resolve, reject) => {
    const stream = bucket.openUploadStream(filename, {
      contentType: contentType || MIME[extOf(filename)] || 'application/octet-stream',
    })
    stream.on('error', reject)
    stream.on('finish', resolve)
    stream.end(buffer)
  })
  return `/${filename}`
}

function mediaPathFromRequest(req) {
  const queryUpload = req.query?.upload
  if (queryUpload) {
    const raw = Array.isArray(queryUpload) ? queryUpload.join('/') : String(queryUpload)
    return `uploads/${decodeURIComponent(raw).replace(/^\/+/, '').replace(/^uploads\//, '')}`
  }

  const queryAsset = req.query?.asset || req.query?.path
  if (queryAsset) {
    const raw = Array.isArray(queryAsset) ? queryAsset.join('/') : String(queryAsset)
    const decoded = decodeURIComponent(raw).replace(/^\/+/, '')
    if (decoded.startsWith('uploads/')) return decoded
    return `website-assets/${decoded.replace(/^website-assets\//, '')}`
  }

  const headerUrl = req.headers?.['x-vercel-original-url'] || req.headers?.['x-invoke-path'] || ''
  const candidates = [req.originalUrl, req.url, headerUrl]
  for (const value of candidates) {
    if (!value) continue
    const pathOnly = decodeURIComponent(String(value).split('?')[0])
    if (pathOnly.startsWith('/website-assets/') || pathOnly.startsWith('/uploads/')) {
      return pathOnly.slice(1)
    }
  }
  return ''
}

export async function serveStoredMedia(req, res, next) {
  try {
    const filename = mediaPathFromRequest(req)
    if (!filename.startsWith('website-assets/') && !filename.startsWith('uploads/')) {
      return next()
    }

    const bucket = await getMediaBucket()
    const file = await mongoose.connection.db.collection(`${BUCKET}.files`).findOne({ filename })
    if (!file) return next()

    res.setHeader('Content-Type', file.contentType || MIME[extOf(filename)] || 'application/octet-stream')
    res.setHeader('Cache-Control', 'public, max-age=86400')
    res.setHeader('Content-Length', file.length)

    const stream = bucket.openDownloadStream(file._id)
    stream.on('error', () => {
      if (!res.headersSent) res.status(404).end()
    })
    stream.pipe(res)
  } catch (error) {
    console.error('[Media] serve failed:', error.message)
    if (!res.headersSent) next()
  }
}

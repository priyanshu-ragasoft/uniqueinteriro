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
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg',
  '.mov': 'video/quicktime',
  '.m4v': 'video/x-m4v',
  '.bin': 'application/octet-stream',
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
  // 1. Direct path check from originalUrl, url, or Vercel invoke headers
  const headerUrl = req.headers?.['x-vercel-original-url'] || req.headers?.['x-invoke-path'] || ''
  const candidates = [req.originalUrl, req.url, headerUrl]
  for (const value of candidates) {
    if (!value) continue
    const pathOnly = decodeURIComponent(String(value).split('?')[0]).replace(/^\/+/, '')
    if (pathOnly.startsWith('website-assets/') || pathOnly.startsWith('uploads/')) {
      return pathOnly
    }
  }

  // 2. Query parameters if rewritten
  const queryUpload = req.query?.upload
  if (queryUpload) {
    const raw = Array.isArray(queryUpload) ? queryUpload.join('/') : String(queryUpload)
    const cleaned = decodeURIComponent(raw).replace(/^\/+/, '').replace(/^uploads\//, '')
    return `uploads/${cleaned}`
  }

  const queryAsset = req.query?.asset || req.query?.path
  if (queryAsset) {
    const raw = Array.isArray(queryAsset) ? queryAsset.join('/') : String(queryAsset)
    const decoded = decodeURIComponent(raw).replace(/^\/+/, '')
    if (decoded.startsWith('uploads/')) return decoded
    return `website-assets/${decoded.replace(/^website-assets\//, '')}`
  }

  // 3. Fallback regex on raw URL (ensure stopping at & or #)
  const rawReqUrl = String(req.originalUrl || req.url || '')
  const assetMatch = rawReqUrl.match(/[?&]asset=([^&#]+)/)
  if (assetMatch) {
    try {
      const decoded = decodeURIComponent(assetMatch[1]).replace(/^\/+/, '')
      if (decoded.startsWith('uploads/')) return decoded
      return `website-assets/${decoded.replace(/^website-assets\//, '')}`
    } catch {}
  }

  const uploadMatch = rawReqUrl.match(/[?&]upload=([^&#]+)/)
  if (uploadMatch) {
    try {
      const decoded = decodeURIComponent(uploadMatch[1]).replace(/^\/+/, '').replace(/^uploads\//, '')
      return `uploads/${decoded}`
    } catch {}
  }

  return ''
}

function resolveStaticProjectVideoRedirect(filename) {
  const upper = String(filename || '').toUpperCase()
  if (!upper.endsWith('.MP4') || !upper.startsWith('WEBSITE-ASSETS/')) return null
  if (upper.includes('RYDHUM HOTEL.MP4')) return '/project-videos/rydhum-hotel.mp4'
  if (upper.includes('VICTERRACE KOLKATA.MP4') || upper.includes('TETTRO MOHALI.MP4')) {
    return '/project-videos/victerrace-kolkata.mp4'
  }
  if (upper.includes('PUSHPA THE FIRE.MP4')) return '/project-videos/pushpa-the-fire.mp4'
  return '/project-videos/smart-city-banur.mp4'
}

export async function serveStoredMedia(req, res, next) {
  try {
    const filename = mediaPathFromRequest(req)
    if (!filename.startsWith('website-assets/') && !filename.startsWith('uploads/')) {
      return next()
    }

    const staticVideoRedirect = resolveStaticProjectVideoRedirect(filename)
    if (staticVideoRedirect) {
      return res.redirect(302, staticVideoRedirect)
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

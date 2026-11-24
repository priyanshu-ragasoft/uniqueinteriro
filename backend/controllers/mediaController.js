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

function safeDecode(value) {
  const raw = String(value || '')
  try {
    return decodeURIComponent(raw)
  } catch {
    try {
      return decodeURIComponent(raw.replace(/%(?![0-9A-Fa-f]{2})/g, '%25'))
    } catch {
      return raw
    }
  }
}

function normalizeMediaFilename(input) {
  if (!input) return ''
  let value = safeDecode(String(input)).replace(/\\/g, '/').trim()
  value = value.replace(/^\/+/, '')
  value = value.replace(/^api\/(?:index\.js\/)?/, '')
  if (value.startsWith('uploads/')) return value
  if (value.startsWith('website-assets/')) return value
  return `website-assets/${value.replace(/^website-assets\//, '')}`
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
  // 1. Prefer original website-assets / uploads path (Vercel often keeps this on url/headers)
  const headerUrl = req.headers?.['x-vercel-original-url'] || req.headers?.['x-invoke-path'] || req.headers?.['x-forwarded-uri'] || ''
  const candidates = [req.originalUrl, req.url, headerUrl]
  for (const value of candidates) {
    if (!value) continue
    const pathOnly = safeDecode(String(value).split('?')[0]).replace(/\\/g, '/')
    const cleaned = pathOnly.replace(/^\/+/, '')
    if (cleaned.startsWith('website-assets/') || cleaned.startsWith('uploads/')) {
      return cleaned
    }
    const embedded = cleaned.match(/(?:^|\/)((?:website-assets|uploads)\/.+)$/)
    if (embedded?.[1]) return embedded[1]
  }

  // 2. Query params from rewrite destinations
  const queryUpload = req.query?.upload
  if (queryUpload) {
    const raw = Array.isArray(queryUpload) ? queryUpload.join('/') : String(queryUpload)
    return normalizeMediaFilename(`uploads/${raw}`)
  }

  const queryAsset = req.query?.asset || req.query?.path
  if (queryAsset) {
    const raw = Array.isArray(queryAsset) ? queryAsset.join('/') : String(queryAsset)
    return normalizeMediaFilename(raw)
  }

  // 3. Fallback regex on raw URL (stop at literal & / # so query separators don't leak)
  const rawReqUrl = String(req.originalUrl || req.url || '')
  const assetMatch = rawReqUrl.match(/[?&]asset=([^&#]+)/)
  if (assetMatch) {
    return normalizeMediaFilename(assetMatch[1])
  }

  const uploadMatch = rawReqUrl.match(/[?&]upload=([^&#]+)/)
  if (uploadMatch) {
    return normalizeMediaFilename(`uploads/${uploadMatch[1]}`)
  }

  return ''
}

function filenameLookupCandidates(filename) {
  const primary = normalizeMediaFilename(filename)
  if (!primary) return []
  const encodedSpaces = primary.replace(/ /g, '%20')
  const decodedSpaces = primary.replace(/%20/gi, ' ')
  return [...new Set([primary, decodedSpaces, encodedSpaces])]
}

async function findMediaFile(filename) {
  const col = mongoose.connection.db.collection(`${BUCKET}.files`)
  for (const candidate of filenameLookupCandidates(filename)) {
    const exact = await col.findOne({ filename: candidate })
    if (exact) return exact
  }

  // Case-insensitive / punctuation-tolerant fallback for stubborn path mismatches
  const needle = normalizeMediaFilename(filename)
    .replace(/%20/gi, ' ')
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  if (!needle) return null
  return col.findOne({ filename: { $regex: `^${needle}$`, $options: 'i' } })
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

    await getMediaBucket()
    const file = await findMediaFile(filename)
    if (!file) {
      console.warn('[Media] missing file:', filename)
      return res.status(404).json({ success: false, message: 'Media not found', filename })
    }

    res.setHeader('Content-Type', file.contentType || MIME[extOf(file.filename || filename)] || 'application/octet-stream')
    res.setHeader('Cache-Control', 'public, max-age=86400')
    res.setHeader('Content-Length', file.length)

    const bucket = await getMediaBucket()
    const stream = bucket.openDownloadStream(file._id)
    stream.on('error', () => {
      if (!res.headersSent) res.status(404).end()
    })
    stream.pipe(res)
  } catch (error) {
    console.error('[Media] serve failed:', error.message)
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: 'Media serve failed', error: error.message })
    }
  }
}

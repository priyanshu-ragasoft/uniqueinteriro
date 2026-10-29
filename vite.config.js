import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'serve-website-assets',
      configureServer(server) {
        server.middlewares.use('/website-assets', (req, res, next) => {
          try {
            const rawUrl = (req.url || '').split('?')[0]
            const decodedUrl = decodeURIComponent(rawUrl)
            const cleanRelPath = decodedUrl.replace(/^\/+/, '')
            const filePath = path.resolve(process.cwd(), 'website', 'website', cleanRelPath)

            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              const stat = fs.statSync(filePath)
              const fileSize = stat.size
              const ext = path.extname(filePath).toLowerCase()
              const mimeMap = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.webp': 'image/webp',
                '.gif': 'image/gif',
                '.svg': 'image/svg+xml',
                '.mp4': 'video/mp4',
                '.webm': 'video/webm',
                '.mov': 'video/quicktime',
                '.tif': 'image/tiff',
                '.tiff': 'image/tiff',
              }
              const contentType = mimeMap[ext] || 'application/octet-stream'

              res.setHeader('Access-Control-Allow-Origin', '*')
              res.setHeader('Accept-Ranges', 'bytes')

              const range = req.headers.range
              if (range) {
                const parts = range.replace(/bytes=/, '').split('-')
                const start = parseInt(parts[0], 10)
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1

                if (start >= fileSize || end >= fileSize) {
                  res.writeHead(416, {
                    'Content-Range': `bytes */${fileSize}`,
                  })
                  return res.end()
                }

                const chunkSize = end - start + 1
                res.writeHead(206, {
                  'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                  'Accept-Ranges': 'bytes',
                  'Content-Length': chunkSize,
                  'Content-Type': contentType,
                })

                const stream = fs.createReadStream(filePath, { start, end })
                stream.on('error', () => {})
                res.on('close', () => {
                  stream.destroy()
                })
                return stream.pipe(res)
              } else {
                res.writeHead(200, {
                  'Content-Length': fileSize,
                  'Content-Type': contentType,
                  'Cache-Control': 'public, max-age=86400',
                })
                const stream = fs.createReadStream(filePath)
                stream.on('error', () => {})
                res.on('close', () => {
                  stream.destroy()
                })
                return stream.pipe(res)
              }
            }
          } catch (err) {
            console.error('Asset stream error:', err)
          }
          next()
        })
      },
    },
  ],
  server: {
    fs: {
      allow: ['.', './website', './public'],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})


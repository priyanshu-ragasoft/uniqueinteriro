import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const backendRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(backendRoot, 'dist')

rmSync(dist, { recursive: true, force: true })
mkdirSync(dist, { recursive: true })

for (const dir of ['controllers', 'routes', 'models', 'middleware', 'config']) {
  const source = join(backendRoot, dir)
  if (existsSync(source)) {
    cpSync(source, join(dist, dir), { recursive: true })
  }
}

cpSync(join(backendRoot, 'server.js'), join(dist, 'index.js'))
console.log('Wrote Vercel entrypoint dist/index.js')

import { connectDB } from '../config/db.js'
import Setting from '../models/Setting.js'
import mongoose from 'mongoose'

function visualSrc(item) {
  if (!item) return ''
  if (typeof item === 'string') return item
  return String(item.image || item.src || item.url || '').trim()
}

function isPlaceholderTitle(title) {
  return !String(title || '').trim() || /^visual\s*\d+$/i.test(String(title).trim())
}

function decodePath(src) {
  try {
    return decodeURIComponent(String(src || ''))
  } catch {
    return String(src || '')
  }
}

function titleFromFile(src) {
  const raw = String(src || '').split(/[?#]/)[0]
  if (!raw) return ''
  let name = raw.split('/').pop() || ''
  try {
    name = decodeURIComponent(name)
  } catch {
    /* keep */
  }
  name = name.replace(/\.[a-z0-9]{2,5}$/i, '').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
  name = name.replace(/\s+\d+$/g, '').trim()
  if (!name || name.length < 4 || name.length > 72) return ''
  if (/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(name.replace(/\s+/g, '-'))) return ''
  if (/^[0-9a-f]{8}\b/i.test(name)) return ''
  if (/^[a-z]\d{0,2}$/i.test(name)) return ''
  return name
    .split(' ')
    .filter(Boolean)
    .map((word, index) => {
      if (index > 0 && /^(and|of|in|to|a|the)$/i.test(word)) return word.toLowerCase()
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

function folderLabel(src) {
  const parts = decodePath(src).split('/').filter(Boolean)
  if (parts.length < 2) return ''
  return parts[parts.length - 2].replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
}

function titleCase(value) {
  return String(value || '')
    .split(' ')
    .filter(Boolean)
    .map((word, index) => {
      if (word === '&') return '&'
      const lower = word.toLowerCase()
      if (index > 0 && /^(and|of|in|to|a|the)$/i.test(word)) return lower
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}

function prettyFolder(src) {
  const folder = folderLabel(src)
  if (!folder || folder.length < 3) return ''
  return titleCase(folder)
}

function isShouting(value) {
  const letters = String(value || '').replace(/[^A-Za-z]/g, '')
  return letters.length > 3 && letters === letters.toUpperCase()
}

function isJunkText(text) {
  const value = String(text || '').trim()
  return !value || /^visual\s*\d+\b/i.test(value) || isShouting(value.split('.')[0] || '')
}

function descriptionFor(title, src) {
  const path = decodePath(src).toLowerCase()
  if (path.includes('kitchen')) return `${title}. Kitchen joinery, quiet work light, Unique Graphics®.`
  if (path.includes('powder')) return `${title}. Powder room stone, brass, and a calm wash of light.`
  if (path.includes('bedroom') || path.includes('bed room') || path.includes('master bed')) {
    return `${title}. Bedroom textiles, low light, and a still night palette.`
  }
  if (path.includes('living')) return `${title}. Living room seating, tailored drapery, Unique Graphics®.`
  if (path.includes('drawing')) return `${title}. Drawing room conversation, brass lamps, quiet timber.`
  if (path.includes('lobby')) return `${title}. Lobby arrival, stone floor, and a measured first view.`
  if (path.includes('bar') || path.includes('theater') || path.includes('theatre')) {
    return `${title}. Bar and cinema seating, dark timber, a quiet pour.`
  }
  if (path.includes('classic luxury')) return `${title}. Classic luxury living — ivory, sage, and brass.`
  if (path.includes('villa')) return `${title}. Villa interior, tall light, and formal stone.`
  const folder = folderLabel(src)
  if (folder) return `${title}. ${folder} — tailored finish, Unique Graphics®.`
  return `${title}. Unique Graphics®.`
}

function enrichVisual(item, index) {
  const image = visualSrc(item)
  const raw = item && typeof item === 'object' ? item : {}
  const rawTitle = String(raw.title || raw.tocTitle || raw.label || '').trim()
  const fromFile = titleFromFile(image) || prettyFolder(image)
  const title = !isPlaceholderTitle(rawTitle) && !isShouting(rawTitle)
    ? rawTitle
    : fromFile || (image ? `Visual ${index + 1}` : '')
  const existingText = String(raw.text || raw.description || '').trim()
  const existingCaption = String(raw.caption || '').trim()
  const text = !isJunkText(existingText) ? existingText : title ? descriptionFor(title, image) : ''
  const caption =
    existingCaption && !isPlaceholderTitle(existingCaption) && !isShouting(existingCaption)
      ? existingCaption
      : title
  return {
    id: raw.id || `vis-${index + 1}`,
    image,
    title,
    text,
    description: text,
    caption,
  }
}

function walkProjects(list, stats) {
  if (!Array.isArray(list)) return 0
  let changed = 0
  list.forEach((project) => {
    if (!project || !Array.isArray(project.gallery) || !project.gallery.length) return
    const next = project.gallery.map((item, index) => enrichVisual(item, index)).filter((item) => item.image || item.title)
    const before = JSON.stringify(project.gallery)
    const after = JSON.stringify(next)
    if (before !== after) {
      project.gallery = next
      changed += 1
      stats.projects += 1
      stats.visuals += next.length
    }
  })
  return changed
}

async function run() {
  await connectDB()
  const setting = await Setting.findOne({ key: 'portfolio_pages_config' })
  if (!setting?.value) {
    console.log('[enrich-project-visuals] No portfolio_pages_config in Mongo.')
    await mongoose.disconnect()
    return
  }

  const value = setting.value
  const stats = { projects: 0, visuals: 0, lists: 0 }

  for (const cat of value.categories || []) {
    walkProjects(cat.projects, stats)
    for (const sub of cat.subcategories || []) walkProjects(sub.projects, stats)
  }

  for (const key of ['interior', 'architectural', 'commercial']) {
    if (Array.isArray(value[key])) {
      walkProjects(value[key], stats)
      stats.lists += 1
    }
  }

  if (value.projectLists && typeof value.projectLists === 'object') {
    for (const key of Object.keys(value.projectLists)) {
      walkProjects(value.projectLists[key], stats)
    }
  }

  const saved = await Setting.findOneAndUpdate(
    { key: 'portfolio_pages_config' },
    { value },
    { new: true }
  )
  const slugs = (saved?.value?.categories || []).map((item) => item.slug)
  console.log(
    `[enrich-project-visuals] Saved ${stats.projects} projects, ${stats.visuals} visuals. Categories kept: ${slugs.join(', ')}`
  )
  await mongoose.disconnect()
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})

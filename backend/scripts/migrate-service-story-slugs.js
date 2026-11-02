import { connectDB } from '../config/db.js'
import Setting from '../models/Setting.js'
import mongoose from 'mongoose'

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function uniqueSlug(raw, fallback, reserved, used) {
  let slug = slugify(raw) || fallback
  if (!slug) slug = fallback
  let candidate = slug
  let index = 2
  while (reserved.has(candidate) || used.has(candidate)) {
    candidate = `${slug}-${index}`
    index += 1
  }
  used.add(candidate)
  return candidate
}

function hasDetail(detail) {
  if (!detail || typeof detail !== 'object') return false
  const banner = detail.banner || {}
  return Boolean(
    banner.title ||
      banner.subtitle ||
      (banner.images || []).some(Boolean) ||
      detail.intro?.heading ||
      detail.intro?.paragraph1 ||
      (Array.isArray(detail.sections) && detail.sections.length) ||
      (Array.isArray(detail.gallery) && detail.gallery.length) ||
      detail.closing?.heading
  )
}

function seedDetail(item) {
  if (hasDetail(item?.detail)) return item.detail
  const title = String(item?.title || item?.caption || '').trim()
  const text = String(item?.text || item?.caption || '').trim()
  const image = String(item?.image || '').trim()
  return {
    banner: {
      show: true,
      label: '',
      title,
      accent: 'by Unique Graphics®',
      subtitle: text,
      images: [image, '', ''],
    },
    intro: { show: true, heading: title, paragraph1: text, paragraph2: '' },
    sections: [],
    gallery: [],
    closing: {
      show: true,
      heading: title ? `Continue ${title.toLowerCase()}.` : 'Discuss this space.',
      paragraph: text || 'Share the brief and how the space should work.',
      buttonLabel: 'Discuss a project',
      buttonLink: '/contacts',
    },
  }
}

function normalizePage(page, reservedSlugs = []) {
  if (!page || typeof page !== 'object') return page
  const reserved = new Set((reservedSlugs || []).map((value) => String(value || '').trim()).filter(Boolean))
  const used = new Set()
  const highlights = page.highlights || {}
  const gallery = page.gallery || {}
  return {
    ...page,
    highlights: {
      ...highlights,
      items: (highlights.items || []).map((item, index) => {
        const title = String(item?.title || '').trim()
        return {
          ...item,
          title,
          slug: uniqueSlug(item?.slug || title || item?.id || `highlight-${index + 1}`, `highlight-${index + 1}`, reserved, used),
          published: item?.published !== false,
          detail: seedDetail({ ...item, title }),
        }
      }),
    },
    gallery: {
      ...gallery,
      items: (gallery.items || []).map((item, index) => {
        const caption = String(item?.caption || '').trim()
        const title = String(item?.title || caption).trim()
        return {
          ...item,
          caption,
          title,
          slug: uniqueSlug(item?.slug || title || item?.id || `gallery-${index + 1}`, `gallery-${index + 1}`, reserved, used),
          published: item?.published !== false,
          detail: seedDetail({ ...item, title, caption, text: item?.text || caption }),
        }
      }),
    },
  }
}

async function run() {
  await connectDB()
  const setting = await Setting.findOne({ key: 'services_pages_config' })
  const value = JSON.parse(JSON.stringify(setting?.value || {}))
  const categories = Array.isArray(value.categories) ? value.categories : []
  let stories = 0
  const next = categories.map((cat) => {
    const reserved = (cat.subcategories || []).map((sub) => sub.slug || sub.id)
    const page = normalizePage(cat.page, reserved)
    stories += (page?.highlights?.items || []).length + (page?.gallery?.items || []).length
    return {
      ...cat,
      page,
      subcategories: (cat.subcategories || []).map((sub) => {
        const subPage = normalizePage(sub.page)
        stories += (subPage?.highlights?.items || []).length + (subPage?.gallery?.items || []).length
        return { ...sub, page: subPage }
      }),
    }
  })

  await Setting.findOneAndUpdate(
    { key: 'services_pages_config' },
    { value: { ...value, categories: next } },
    { new: true }
  )
  console.log(
    `[migrate-service-story-slugs] Kept ${next.map((c) => c.slug).join(', ')}. Normalized ${stories} story/gallery cards.`
  )
  await mongoose.disconnect()
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})

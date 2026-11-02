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

function hasDetail(detail) {
  if (!detail || typeof detail !== 'object') return false
  const banner = detail.banner || {}
  return Boolean(
    banner.title ||
      banner.subtitle ||
      (banner.images || []).some(Boolean) ||
      detail.intro?.heading ||
      detail.intro?.paragraph1 ||
      (detail.sections || []).length ||
      (detail.gallery || []).length
  )
}

function buildDetail(item) {
  const title = String(item.title || '').trim()
  const text = String(item.text || '').trim()
  const image = String(item.image || '').trim()
  const id = item.id || 'hl'
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
    sections: text
      ? [{ id: `${id}-sec-1`, title: title || 'About this space', text, media: image, caption: '' }]
      : [],
    gallery: image ? [{ id: `${id}-gal-1`, image, caption: title }] : [],
    closing: {
      show: true,
      heading: title ? `Continue ${title.toLowerCase()}.` : 'Discuss this space.',
      paragraph: text || 'Share the site and how the rooms should feel.',
      buttonLabel: 'Request a consultation',
      buttonLink: '/contacts',
    },
  }
}

function uniqueSlug(raw, reserved, used, suffix = 'story') {
  let slug = slugify(raw) || suffix
  if (reserved.has(slug) || used.has(slug)) slug = `${slug}-${suffix}`
  let index = 2
  while (reserved.has(slug) || used.has(slug)) {
    slug = `${slugify(raw) || suffix}-${suffix}-${index}`
    index += 1
  }
  used.add(slug)
  return slug
}

function migrateItems(items, reservedSlugs, kind = 'highlight') {
  const reserved = new Set((reservedSlugs || []).map((value) => String(value || '').trim()).filter(Boolean))
  const used = new Set()
  const suffix = kind === 'gallery' ? 'gallery' : 'story'
  return (Array.isArray(items) ? items : []).map((item, index) => {
    const title = String(item.title || item.caption || '').trim()
    const slug = uniqueSlug(item.slug || title || item.id || `${kind}-${index + 1}`, reserved, used, suffix)
    const seed = {
      ...item,
      title,
      text: item.text || item.caption || '',
    }
    return {
      ...item,
      title,
      slug,
      published: item.published !== false,
      detail: hasDetail(item.detail) ? item.detail : buildDetail(seed),
    }
  })
}

function migrateNode(node, isParent) {
  const reserved = isParent ? (node.subcategories || []).map((sub) => sub.slug || sub.id) : []
  const page = node.page && typeof node.page === 'object' ? node.page : {}
  const highlights = page.highlights && typeof page.highlights === 'object' ? page.highlights : { show: false, items: [] }
  const gallery = page.gallery && typeof page.gallery === 'object' ? page.gallery : { show: false, items: [] }
  const highlightItems = migrateItems(highlights.items, reserved, 'highlight')
  const galleryReserved = [...reserved, ...highlightItems.map((item) => item.slug)]
  return {
    ...node,
    page: {
      ...page,
      highlights: {
        ...highlights,
        items: highlightItems,
      },
      gallery: {
        ...gallery,
        items: migrateItems(gallery.items, galleryReserved, 'gallery'),
      },
    },
    subcategories: isParent
      ? (node.subcategories || []).map((sub) => migrateNode(sub, false))
      : [],
  }
}

const run = async () => {
  await connectDB()
  const setting = await Setting.findOne({ key: 'portfolio_pages_config' })
  if (!setting?.value || typeof setting.value !== 'object') {
    console.log('No portfolio_pages_config document found.')
    await mongoose.disconnect()
    return
  }

  const prev = setting.value
  const categories = (prev.categories || []).map((cat) => migrateNode(cat, true))
  const saved = await Setting.findOneAndUpdate(
    { key: 'portfolio_pages_config' },
    { value: { ...prev, categories } },
    { upsert: true, new: true }
  )

  const summary = []
  for (const cat of saved.value.categories || []) {
    const items = cat.page?.highlights?.items || []
    const galleryItems = cat.page?.gallery?.items || []
    if (items.length || galleryItems.length) {
      summary.push({
        page: `/${cat.slug}`,
        highlights: items.map((item) => ({ slug: item.slug, id: item.id, hasDetail: hasDetail(item.detail) })),
        gallery: galleryItems.map((item) => ({ slug: item.slug, id: item.id, hasDetail: hasDetail(item.detail) })),
      })
    }
    for (const sub of cat.subcategories || []) {
      const subItems = sub.page?.highlights?.items || []
      const subGallery = sub.page?.gallery?.items || []
      if (subItems.length || subGallery.length) {
        summary.push({
          page: `/${cat.slug}/${sub.slug}`,
          highlights: subItems.map((item) => ({ slug: item.slug, id: item.id, hasDetail: hasDetail(item.detail) })),
          gallery: subGallery.map((item) => ({ slug: item.slug, id: item.id, hasDetail: hasDetail(item.detail) })),
        })
      }
    }
  }

  console.log('Mongo key: portfolio_pages_config')
  console.log('Highlight pages migrated:', JSON.stringify(summary, null, 2))
  await mongoose.disconnect()
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})

import { DEFAULT_SERVICES_CONFIG, getStoredServicesConfig, setStoredServicesConfig } from './servicesConfig'
import { getRichPageForSlug } from './serviceDetailsConfig'

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function emptyPage(partial = {}) {
  return {
    banner: {
      show: true,
      label: 'Services',
      title: '',
      accent: 'by Unique Graphics®',
      subtitle: '',
      images: ['', '', ''],
      ...(partial.banner || {}),
    },
    intro: {
      show: true,
      heading: '',
      paragraph1: '',
      paragraph2: '',
      ...(partial.intro || {}),
    },
    highlights: {
      show: false,
      items: [],
      ...(partial.highlights || {}),
    },
    steps: {
      show: false,
      items: [],
      ...(partial.steps || {}),
    },
    gallery: {
      show: false,
      items: [],
      ...(partial.gallery || {}),
    },
    closing: {
      show: true,
      heading: '',
      paragraph: '',
      buttonLabel: 'Discuss a project',
      buttonLink: '/contacts',
      ...(partial.closing || {}),
    },
  }
}

function uniqueStorySlug(raw, fallback, reserved, used) {
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

function storyDetailHasContent(detail) {
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

function seedStoryDetail(item) {
  if (storyDetailHasContent(item?.detail)) return item.detail
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
    intro: {
      show: true,
      heading: title,
      paragraph1: text,
      paragraph2: '',
    },
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

function normalizeHighlightEntry(raw, index, reserved, used) {
  const title = String(raw?.title || '').trim()
  const slug = uniqueStorySlug(raw?.slug || title || raw?.id || `highlight-${index + 1}`, `highlight-${index + 1}`, reserved, used)
  return {
    id: raw?.id || `hl-${index + 1}`,
    title,
    text: String(raw?.text || ''),
    image: String(raw?.image || ''),
    slug,
    published: raw?.published !== false,
    detail: seedStoryDetail({ ...raw, title }),
  }
}

function normalizeGalleryEntry(raw, index, reserved, used) {
  const caption = String(raw?.caption || '').trim()
  const title = String(raw?.title || caption).trim()
  const slug = uniqueStorySlug(raw?.slug || title || raw?.id || `gallery-${index + 1}`, `gallery-${index + 1}`, reserved, used)
  return {
    id: raw?.id || `gal-${index + 1}`,
    image: String(raw?.image || ''),
    caption,
    title,
    slug,
    published: raw?.published !== false,
    detail: seedStoryDetail({ ...raw, title, caption, text: raw?.text || caption }),
  }
}

export function normalizeServicePage(partial, reservedSlugs = []) {
  const page = emptyPage(partial || {})
  const reserved = new Set((reservedSlugs || []).map((value) => String(value || '').trim()).filter(Boolean))
  const used = new Set()
  return {
    ...page,
    highlights: {
      ...page.highlights,
      items: (page.highlights?.items || []).map((item, index) => normalizeHighlightEntry(item, index, reserved, used)),
    },
    gallery: {
      ...page.gallery,
      items: (page.gallery?.items || []).map((item, index) => normalizeGalleryEntry(item, index, reserved, used)),
    },
  }
}

function pageFromDiscipline(id) {
  const cfg = DEFAULT_SERVICES_CONFIG
  const hero = cfg.heroes[id] || {}
  const stages = cfg.stages[id] || []
  const images = [hero.banner1 || '', hero.banner2 || '', hero.banner3 || '']
  return emptyPage({
    banner: {
      show: true,
      label: 'Services',
      title: hero.titleLead || '',
      accent: hero.titleAccent || 'by Unique Graphics®',
      subtitle: hero.subtitle || '',
      images,
    },
    intro: {
      show: Boolean(hero.summary || hero.detail),
      heading: hero.summary || '',
      paragraph1: hero.detail || '',
      paragraph2: '',
    },
    steps: {
      show: stages.length > 0,
      items: stages.map((stage, index) => ({
        id: `${id}-step-${index + 1}`,
        number: stage.num || String(index + 1).padStart(2, '0'),
        title: stage.title || '',
        text: stage.desc || '',
      })),
    },
    closing: {
      show: true,
      heading: cfg.cta.title,
      paragraph: cfg.cta.subtitle,
      buttonLabel: cfg.cta.buttonText,
      buttonLink: cfg.cta.buttonLink,
    },
  })
}

function category({ id, name, slug, sourceId, menuImage, showInMenu = true, subcategories = [] }) {
  const nav = DEFAULT_SERVICES_CONFIG.navCards[sourceId || id] || {}
  return {
    id,
    name,
    slug: slug || id,
    menuDescription: nav.hover || '',
    menuImage: menuImage || nav.image || '/nav/services-card.jpg',
    menuVideo: nav.video || '',
    published: true,
    showInMenu,
    order: 0,
    page: pageFromDiscipline(sourceId || id),
    subcategories,
  }
}

export const SUBCATEGORY_MEDIA_MAP = {
  // Commercial / For Business
  bars: '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/5bc6357d-ec0e-4160-84da-758f3ed7101c.png',
  'bars-and-night-clubs': '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/5bc6357d-ec0e-4160-84da-758f3ed7101c.png',
  'night-clubs': '/website-assets/commercial%20interior/VECTERRACE%20HOTEL%20DANCE%20BAR%20KOLKATA/V3.jpg',
  restaurants: '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/2a52ad1e-4050-4783-b269-36dcd2bb72b0.png',
  hotels: '/website-assets/commercial%20interior/Hotel%20Mangalore%20International/v4.jpg',
  resorts: '/website-assets/architecture/SOUTH%20GOA%20RESORTS%20EXTERIOR/243e4630-d2b6-4e95-931a-03302219585b.png',
  'banquet-halls': '/website-assets/architecture/The%20Romania%20-%20Luxury%20Wedding%20Spaces%20BANQUET%20HALL/Sunlit%20Grand%20Arch%20Banquet%20Hall-5.png',
  offices: '/website-assets/commercial%20interior/REAL%20ESTATE%20OFFICE%20CHANDIGARH/v6.jpg',
  'spa-and-wellness': '/website-assets/commercial%20interior/SOUTH%20GOA%20RESORTS%20AND%20RESTAURANT/BEDROOM%20POOL%2002.jpg',
  'common-areas': '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg',
  'retail-showrooms': '/website-assets/architecture/AUTOMOTIVE%20GALLERY/9ea0e852-0904-49c5-b948-f8504d0ea7fb.png',

  // Residential / Interiors
  villas: '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png',
  'private-houses': '/website-assets/architecture/contemporary%20exterior%20house%20design/c6d60406-e39c-4e68-9abc-9df4e692ace2.png',
  residences: '/website-assets/INTERIOR/INTERIOR%20MODERN/LIVING%20ROOM/A2.jpg',
  cottages: '/website-assets/INTERIOR/CLASSIC%20LUXURY%20LIVING/Contemporary%20neoclassical%20ivory%20and%20sage%20interior-7.png',
  mansions: '/website-assets/architecture/NEO%20CLASSIC%20EXTERIOR%20DESIGN%20BIJNOR/Blue-hour%20classical%20villa%20with%20glowing%20pool-15.png',
  penthouses: '/website-assets/architecture/AL%20REHMAN%20TOWER%20KOLKATA/7e4f4312-846d-4e35-9f2b-af632b7dfc0a.png',
  apartments: '/website-assets/INTERIOR/MODERN%20KITCHEN/a1.jpg',

  // Main Categories
  'all-services': '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg',
  architecture: '/website-assets/architecture/AUTOMOTIVE%20GALLERY/9ea0e852-0904-49c5-b948-f8504d0ea7fb.png',
  interiors: '/website-assets/INTERIOR/INTERIOR%20MODERN/LIVING%20ROOM/A1.jpg',
  'for-business': '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/c2240d8d-2900-47b7-8736-58ee8a89ee13.png',
  'commercial-interiors': '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/c2240d8d-2900-47b7-8736-58ee8a89ee13.png',
  'astro-vastu': '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png',
  'bim-engineering': '/website-assets/architecture/The%20Romania%20-%20Luxury%20Wedding%20Spaces%20BANQUET%20HALL/Sunlit%20Luxury%20Banquet%20Hall-1.png',
  'design-supervision': '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg',
  'construction-management': '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/2a52ad1e-4050-4783-b269-36dcd2bb72b0.png',
  procurement: '/website-assets/INTERIOR/MODERN%20KITCHEN/a1.jpg',
}

export function isBadMedia(src) {
  const s = String(src || '').trim().toLowerCase()
  if (!s) return true
  if (s === '/hero.jpg' || s.includes('hero.jpg')) return true
  if (s.includes('services-card.jpg')) return true
  if (s.includes('iphone') || s.includes('mockup')) return true
  // Plain junk like "tetx" (no path / protocol / file extension)
  if (!/[\\/]/.test(s) && !s.startsWith('data:') && !/^https?:/.test(s) && !/\.(jpe?g|png|webp|gif|avif|mp4|webm|mov|m4v)(\?|#|$)/i.test(s)) {
    return true
  }
  return false
}

export function isRealMediaUrl(src) {
  const s = String(src || '').trim()
  if (!s || isBadMedia(s)) return false
  if (s.startsWith('data:image') || s.startsWith('data:video')) return true
  if (s.startsWith('/uploads/') || s.startsWith('/website-assets/') || s.startsWith('/nav/')) return true
  if (/^https?:\/\//i.test(s)) return true
  if (/\.(jpe?g|png|webp|gif|avif|mp4|webm|mov|m4v)(\?|#|$)/i.test(s) && /[\\/]/.test(s)) return true
  return false
}

export function isRealVideoUrl(src) {
  const s = String(src || '').trim()
  if (!isRealMediaUrl(s)) return false
  return s.startsWith('data:video') || /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(s)
}

export function sanitizeMediaUrl(url, slug) {
  const s = String(url || '').trim()
  if (!s || isBadMedia(s) || !isRealMediaUrl(s)) {
    return SUBCATEGORY_MEDIA_MAP[slug] || '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg'
  }
  return s
}

function subcategory(parentSourceId, name) {
  const slug = slugify(name)
  const richPage = getRichPageForSlug(slug, name)
  const page = richPage || pageFromDiscipline(parentSourceId)
  page.banner = { ...page.banner, title: name }
  const realMedia = SUBCATEGORY_MEDIA_MAP[slug] || DEFAULT_SERVICES_CONFIG.navCards[parentSourceId]?.image || '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg'
  return {
    id: slug,
    name,
    slug,
    menuDescription: richPage?.banner?.subtitle || '',
    menuImage: realMedia,
    published: true,
    order: 0,
    page,
  }
}

export function buildDefaultServiceTree() {
  const interiors = ['Villas', 'Private houses', 'Residences', 'Cottages', 'Mansions', 'Penthouses', 'Apartments']
  const business = [
    'Hotels',
    'Restaurants',
    'Resorts',
    'Offices',
    'Spa & Wellness',
    'Common areas',
    'Bars',
  ]

  const categories = [
    category({ id: 'all-services', name: 'All services', sourceId: 'all-services' }),
    category({ id: 'architecture', name: 'Architecture', sourceId: 'architecture' }),
    category({
      id: 'interiors',
      name: 'Interiors',
      sourceId: 'interiors',
      subcategories: interiors.map((name) => subcategory('interiors', name)),
    }),
    category({
      id: 'for-business',
      name: 'For business',
      sourceId: 'commercial-interiors',
      subcategories: business.map((name) => subcategory('commercial-interiors', name)),
    }),
    category({ id: 'astro-vastu', name: 'Astro Vastu', sourceId: 'astro-vastu', showInMenu: false }),
    category({ id: 'bim-engineering', name: 'Bim engineering', sourceId: 'bim-engineering' }),
    category({ id: 'design-supervision', name: 'Design supervision', sourceId: 'design-supervision' }),
    category({ id: 'construction-management', name: 'Construction management', sourceId: 'construction-management' }),
    category({ id: 'procurement', name: 'Procurement', sourceId: 'procurement' }),
    category({ id: '2d-3d-design', name: '2D / 3D design', sourceId: '2d-3d-design', showInMenu: false }),
    category({ id: 'walkthrough', name: 'Walkthrough', sourceId: 'walkthrough', showInMenu: false }),
  ].map((item, index) => ({
    ...item,
    order: index,
    subcategories: item.subcategories.map((sub, subIndex) => ({ ...sub, order: subIndex })),
  }))

  const all = categories[0]
  const pillars = DEFAULT_SERVICES_CONFIG.turnkey.pillars || []
  all.page.highlights = {
    show: pillars.length > 0,
    items: pillars.map((pillar, index) => ({
      id: `pillar-${index + 1}`,
      title: pillar.title || '',
      text: pillar.desc || '',
      image: pillar.image || '',
    })),
  }
  all.page.intro.heading = DEFAULT_SERVICES_CONFIG.turnkey.title
  all.page.intro.paragraph1 = DEFAULT_SERVICES_CONFIG.turnkey.subtitle

  // Populate Architecture highlights
  const arch = categories.find((c) => c.id === 'architecture')
  if (arch) {
    arch.page.highlights = {
      show: true,
      items: [
        {
          id: 'arch-hl-1',
          title: 'Monumental High-Rise Towers',
          text: 'High-rise structural design and engineering crafted by Unique Graphics.',
          image: '/website-assets/architecture/AL%20REHMAN%20TOWER%20KOLKATA/7e4f4312-846d-4e35-9f2b-af632b7dfc0a.png',
        },
        {
          id: 'arch-hl-2',
          title: 'Private Luxury Estates',
          text: 'Bespoke modern villas, chalets, and private residences crafted around panoramic views.',
          image: '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg',
        },
        {
          id: 'arch-hl-3',
          title: 'Commercial & Cultural Landmarks',
          text: 'State-of-the-art automotive galleries, institutional campuses, and landmark facades.',
          image: '/website-assets/architecture/AUTOMOTIVE%20GALLERY/9ea0e852-0904-49c5-b948-f8504d0ea7fb.png',
        },
      ],
    }
  }

  // Populate Interiors highlights
  const inter = categories.find((c) => c.id === 'interiors')
  if (inter) {
    inter.page.highlights = {
      show: true,
      items: [
        {
          id: 'inter-hl-1',
          title: 'Master Living Ensembles',
          text: 'Curated spatial harmony, bespoke Italian marble, and custom acoustic ceiling integration.',
          image: '/website-assets/INTERIOR/INTERIOR%20MODERN/LIVING%20ROOM/A1.jpg',
        },
        {
          id: 'inter-hl-2',
          title: 'Haute Cuisine Culinary Suites',
          text: 'Precision engineered kitchen architectures with seamless appliance integration.',
          image: '/website-assets/INTERIOR/MODERN%20KITCHEN/a1.jpg',
        },
        {
          id: 'inter-hl-3',
          title: 'Neo-Classic Sanctuaries',
          text: 'Timeless architectural detailing, layered ambient lighting, and bespoke joinery.',
          image: '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png',
        },
      ],
    }
  }

  // Populate For Business highlights
  const biz = categories.find((c) => c.id === 'for-business')
  if (biz) {
    biz.page.highlights = {
      show: true,
      items: [
        {
          id: 'biz-hl-1',
          title: 'Nightclubs & Themed Lounges',
          text: 'High-energy hospitality architecture, engineered acoustics, and scene-based evening lighting.',
          image: '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/129a7d57-c895-4ecc-a079-cbc6aa3c7308.png',
        },
        {
          id: 'biz-hl-2',
          title: 'Grand Banquet Halls & Resorts',
          text: 'Monumental event spaces and destination hospitality resorts designed for unforgettable experiences.',
          image: '/website-assets/architecture/The%20Romania%20-%20Luxury%20Wedding%20Spaces%20BANQUET%20HALL/Sunlit%20Luxury%20Banquet%20Hall-1.png',
        },
        {
          id: 'biz-hl-3',
          title: 'Signature Dining & Bars',
          text: 'Luxury restaurant interiors balancing guest circulation and discreet service pathways.',
          image: '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/2a52ad1e-4050-4783-b269-36dcd2bb72b0.png',
        },
      ],
    }
  }

  // Populate Astro Vastu highlights
  const astro = categories.find((c) => c.id === 'astro-vastu')
  if (astro) {
    astro.page.highlights = {
      show: true,
      items: [
        {
          id: 'astro-hl-1',
          title: 'Energy & Planetary Alignment',
          text: 'Analyzing property orientation, directional axes, and cosmic energy flow.',
          image: '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png',
        },
        {
          id: 'astro-hl-2',
          title: 'Vastu Purusha Grid Architecture',
          text: 'Allocating functions, entry thresholds, and power centers to optimal planetary zones.',
          image: '/website-assets/architecture/The%20Romania%20-%20Luxury%20Wedding%20Spaces%20BANQUET%20HALL/Golden%20Arch%20Banquet%20Hall%20at%20Night-6.png',
        },
      ],
    }
  }

  return { categories }
}

export const LEGACY_SERVICE_PATHS = {
  'all-services': { category: 'all-services' },
  architecture: { category: 'architecture' },
  interiors: { category: 'interiors' },
  'commercial-interiors': { category: 'for-business' },
  'astro-vastu': { category: 'astro-vastu' },
  'bim-engineering': { category: 'bim-engineering' },
  'design-supervision': { category: 'design-supervision' },
  'construction-management': { category: 'construction-management' },
  procurement: { category: 'procurement' },
  '2d-3d-design': { category: '2d-3d-design' },
  walkthrough: { category: 'walkthrough' },
}

export function isJunkText(val) {
  const s = String(val || '').toLowerCase().trim()
  if (!s) return false
  const junkWords = [
    'snjks',
    'xshbj',
    'kmbgv',
    'kpkju',
    'chygyt',
    'sbdutfy',
    'wf,njhg',
    'hghugu',
    'chygytityq',
    'asdf',
    'qwerty',
    'zxcv',
  ]
  if (junkWords.some((word) => s.includes(word))) return true
  if (
    s.length >= 2 &&
    s.length <= 4 &&
    !['all', 'bar', 'spa', 'new', 'edit', '01', '02', '03', '04', '05', '06', '07', '08'].includes(s) &&
    /^[^aeiou0-9]+$/.test(s)
  ) {
    return true
  }
  return false
}

export function hasDuplicateMedia(arr) {
  if (!Array.isArray(arr) || arr.length <= 1) return false
  const clean = arr.map((x) => String(x || '').trim().toLowerCase()).filter(Boolean)
  return new Set(clean).size < clean.length
}

export function normalizeTree(raw) {
  if (!raw || !Array.isArray(raw.categories) || raw.categories.length === 0) {
    return buildDefaultServiceTree()
  }

  const hasJunk = raw.categories.some(
    (c) =>
      isJunkText(c.name) ||
      isJunkText(c.slug) ||
      c.page?.highlights?.items?.some((h) => isJunkText(h.title) || isJunkText(h.text))
  )

  if (hasJunk) {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ug_services_pages_config')
      }
    } catch {}
    return buildDefaultServiceTree()
  }

  return {
    categories: raw.categories
      .filter((c) => !isJunkText(c.name) && !isJunkText(c.slug))
      .map((categoryItem, index) => {
        const catSlug = categoryItem.slug || slugify(categoryItem.name)
        return {
          id: categoryItem.id || catSlug || `category-${index + 1}`,
          name: categoryItem.name || '',
          slug: catSlug,
          menuDescription: categoryItem.menuDescription || '',
          menuImage: categoryItem.menuImage || '',
          menuVideo: categoryItem.menuVideo || '',
          published: categoryItem.published !== false,
          showInMenu: categoryItem.showInMenu !== false,
          href: categoryItem.href || '',
          order: Number.isFinite(categoryItem.order) ? categoryItem.order : index,
          page: normalizeServicePage(
            categoryItem.page || {},
            (categoryItem.subcategories || []).map((sub) => sub.slug || slugify(sub.name))
          ),
          projects: Array.isArray(categoryItem.projects) ? categoryItem.projects : [],
          subcategories: Array.isArray(categoryItem.subcategories)
            ? categoryItem.subcategories
                .filter((sub) => !isJunkText(sub.name) && !isJunkText(sub.slug))
                .map((sub, subIndex) => {
                  const subSlug = sub.slug || slugify(sub.name)
                  return {
                    id: sub.id || subSlug || `sub-${subIndex + 1}`,
                    name: sub.name || '',
                    slug: subSlug,
                    menuDescription: sub.menuDescription || '',
                    menuImage: sub.menuImage || '',
                    menuVideo: sub.menuVideo || '',
                    published: sub.published !== false,
                    showInMenu: sub.showInMenu !== false,
                    href: sub.href || '',
                    order: Number.isFinite(sub.order) ? sub.order : subIndex,
                    page: normalizeServicePage(sub.page || {}),
                    projects: Array.isArray(sub.projects) ? sub.projects : [],
                  }
                })
            : [],
        }
      }),
  }
}

export function getStoredServiceTree() {
  const stored = getStoredServicesConfig()
  return normalizeTree(stored)
}

export function setStoredServiceTree(tree) {
  const current = getStoredServicesConfig()
  setStoredServicesConfig({ ...current, categories: tree.categories })
}

export function menuCategories(tree) {
  return [...(tree?.categories || [])]
    .filter((item) => item.published && item.showInMenu !== false && item.slug !== 'all-services' && item.id !== 'all-services')
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      ...item,
      subcategories: [...(item.subcategories || [])]
        .filter((sub) => sub.published !== false && sub.showInMenu !== false)
        .sort((a, b) => a.order - b.order),
    }))
}

export function categoryPath(categoryItem) {
  if (categoryItem?.slug === 'all-services' || categoryItem?.id === 'all-services') return '/services'
  return `/services/${categoryItem.slug}`
}

export function subcategoryPath(categoryItem, sub) {
  return `/services/${categoryItem.slug}/${sub.slug}`
}

export function serviceHighlightPath(categoryItem, sub, item) {
  const parent = sub?.slug ? subcategoryPath(categoryItem, sub) : categoryPath(categoryItem)
  const slug = item?.slug || slugify(item?.title || item?.id || '')
  if (!slug) return parent
  if (!sub?.slug && (categoryItem?.slug === 'all-services' || categoryItem?.id === 'all-services')) {
    return `/services/${slug}`
  }
  return `${parent}/${slug}`
}

export function serviceGalleryPath(categoryItem, sub, item) {
  const parent = sub?.slug ? subcategoryPath(categoryItem, sub) : categoryPath(categoryItem)
  const slug = item?.slug || slugify(item?.title || item?.caption || item?.id || '')
  if (!slug) return parent
  if (!sub?.slug && (categoryItem?.slug === 'all-services' || categoryItem?.id === 'all-services')) {
    return `/services/${slug}`
  }
  return `${parent}/${slug}`
}

export function findServicePage(tree, categorySlug, subcategorySlug) {
  const categoryItem = (tree?.categories || []).find((item) => item.slug === categorySlug)
  if (!categoryItem || !categoryItem.published) return null
  if (!subcategorySlug) return { category: categoryItem, page: categoryItem.page, kind: 'category' }
  const sub = (categoryItem.subcategories || []).find((item) => item.slug === subcategorySlug)
  if (!sub || !sub.published) return null
  return { category: categoryItem, subcategory: sub, page: sub.page, kind: 'subcategory' }
}

function findStoryOnPage(page, storySlug) {
  const slug = String(storySlug || '').trim()
  if (!slug || !page) return null
  const highlight = (page.highlights?.items || []).find((item) => item.slug === slug || item.id === slug)
  if (highlight) {
    return {
      highlight,
      detail: highlight.detail || seedStoryDetail(highlight),
    }
  }
  const galleryItem = (page.gallery?.items || []).find((item) => item.slug === slug || item.id === slug)
  if (!galleryItem) return null
  const highlightFromGallery = {
    ...galleryItem,
    title: galleryItem.title || galleryItem.caption || '',
    text: galleryItem.text || galleryItem.caption || '',
    image: galleryItem.image || '',
  }
  return {
    highlight: highlightFromGallery,
    galleryItem,
    detail: galleryItem.detail || seedStoryDetail(highlightFromGallery),
  }
}

export function findServiceStory(tree, categorySlug, subcategorySlug, storySlug) {
  const match = findServicePage(tree, categorySlug, subcategorySlug || '')
  if (!match) return null
  const story = findStoryOnPage(match.page, storySlug)
  if (!story) return null
  return { ...match, ...story }
}

export function validateServiceTree(tree) {
  const errors = []
  const slugs = new Set()
  if (!tree || !Array.isArray(tree.categories)) {
    return ['Add at least one category.']
  }
  tree.categories.forEach((categoryItem, index) => {
    if (!String(categoryItem.name || '').trim()) errors.push(`Category ${index + 1} needs a menu name.`)
    if (!String(categoryItem.slug || '').trim()) errors.push(`Category ${index + 1} needs a URL slug.`)
    if (slugs.has(categoryItem.slug)) errors.push(`Category slug “${categoryItem.slug}” is used more than once.`)
    slugs.add(categoryItem.slug)
    const subSlugs = new Set()
    ;(categoryItem.subcategories || []).forEach((sub, subIndex) => {
      if (!String(sub.name || '').trim()) {
        errors.push(`${categoryItem.name || 'Category'} subcategory ${subIndex + 1} needs a menu name.`)
      }
      if (!String(sub.slug || '').trim()) {
        errors.push(`${categoryItem.name || 'Category'} subcategory ${subIndex + 1} needs a URL slug.`)
      }
      if (subSlugs.has(sub.slug)) errors.push(`Subcategory slug “${sub.slug}” is repeated inside ${categoryItem.name}.`)
      subSlugs.add(sub.slug)
    })
  })
  return errors
}

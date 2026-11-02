import { architecturalProjects as defaultArchProjects } from './architecturalProjects'
import { interiorProjects as defaultIntProjects } from './interiorProjects'
import { commercialProjects as defaultCommProjects } from './commercialProjects'

export const DEFAULT_PORTFOLIO_CONFIG = {
  // 1. Navigation Dropdown Cards
  navCards: {
    'all-projects': {
      title: 'ALL PROJECTS',
      hover: 'Houses and rooms from the full portfolio.',
      image: '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg',
      video: '/website-assets/commercial%20interior/RYDHUM%20HOTEL%20&%20BANQUET%20HALL%20FIROZEPURE%20PUNJAB/RYDHUM%20HOTEL.mp4',
    },
    'architectural-design': {
      title: 'ARCHITECTURAL DESIGN',
      hover: 'Plans, facades, and the shape of the house.',
      image: '/website-assets/architecture/G%20S%20STREET%20MARKET/076fc39d-c3b1-48a3-a1df-4abaa5bbf7c1.png',
      video: '/website-assets/architecture/SMART%20CITY%20SOCITY%20BANUR/WhatsApp%20Video%202025-07-03%20at%2019.14.48.mp4',
    },
    'interior-design': {
      title: 'INTERIOR DESIGN',
      hover: 'Furniture, light, and the finish of each room.',
      image: '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png',
      video: '',
    },
    'commercial-design': {
      title: 'COMMERCIAL DESIGN',
      hover: 'Guest rooms, lounges, and places of work.',
      image: '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/2a52ad1e-4050-4783-b269-36dcd2bb72b0.png',
      video: '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/PUSHPA%20THE%20FIRE.mp4',
    },
  },

  // 2. Page Hero Headers & Banners
  heroes: {
    'all-projects': {
      titleLead: 'All projects',
      titleAccent: 'by Unique Graphics®',
      description:
        'The complete global portfolio of Unique Graphics® — from landmark architectural villas and private estates to haute couture residential interiors and monumental commercial headquarters worldwide.',
      banner1: '/website-assets/commercial%20interior/RYDHUM%20HOTEL%20&%20BANQUET%20HALL%20FIROZEPURE%20PUNJAB/RYDHUM%20HOTEL.mp4',
      banner2: '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/PUSHPA%20THE%20FIRE.mp4',
      banner3: '/website-assets/commercial%20interior/VECTERRACE%20HOTEL%20DANCE%20BAR%20KOLKATA/VICTERRACE%20KOLKATA.mp4',
    },
    'architectural-design': {
      titleLead: 'Architectural design',
      titleAccent: 'by Unique Graphics®',
      description:
        'Monumental architectural forms created in harmony with natural landscapes — private villas, landmark cliffside residences, and modern estates engineered to transcend generations.',
      banner1: '/website-assets/commercial%20interior/RYDHUM%20HOTEL%20&%20BANQUET%20HALL%20FIROZEPURE%20PUNJAB/RYDHUM%20HOTEL.mp4',
      banner2: '/website-assets/architecture/SMART%20CITY%20SOCITY%20BANUR/WhatsApp%20Video%202025-07-03%20at%2019.14.48.mp4',
      banner3: '/website-assets/commercial%20interior/VECTERRACE%20HOTEL%20DANCE%20BAR%20KOLKATA/VICTERRACE%20KOLKATA.mp4',
    },
    'interior-design': {
      titleLead: 'Interior design',
      titleAccent: 'by Unique Graphics®',
      description:
        'Every interior is an emotional sanctuary designed around personal luxury — bespoke joinery, rare marbles, museum-grade architectural lighting, and curated furniture ensembles crafted without compromise.',
      banner1: '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png',
      banner2: '/website-assets/INTERIOR/INTERIOR%20MODERN/LIVING%20ROOM/A1.jpg',
      banner3: '/website-assets/INTERIOR/CLASSIC%20LUXURY%20LIVING/Contemporary%20neoclassical%20ivory%20and%20sage%20interior-7.png',
    },
    'commercial-design': {
      titleLead: 'Commercial interiors',
      titleAccent: 'by Unique Graphics®',
      description:
        'We are chosen by those who strive for excellence — landmark banquet halls, luxury bars, resorts, and corporate headquarters crafted with distinctive elegance.',
      banner1: '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/TETTRO%20MOHALI.mp4',
      banner2: '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/PUSHPA%20THE%20FIRE.mp4',
      banner3: '/website-assets/commercial%20interior/RYDHUM%20HOTEL%20&%20BANQUET%20HALL%20FIROZEPURE%20PUNJAB/RYDHUM%20HOTEL.mp4',
    },
  },

  // 3. Projects Lists (legacy 3 + custom category slug lists)
  architectural: defaultArchProjects,
  interior: defaultIntProjects,
  commercial: defaultCommProjects,
  projectLists: {},
}

/** Menu slug → legacy project bucket */
export const CATEGORY_TO_LIST_KEY = {
  'architectural-design': 'architectural',
  architecture: 'architectural',
  'interior-design': 'interior',
  interiors: 'interior',
  'commercial-design': 'commercial',
  'commercial-interiors': 'commercial',
  commercial: 'commercial',
}

export function resolveProjectListKey(slugOrKey) {
  const key = String(slugOrKey || '').trim()
  if (!key || key === 'all-projects') return ''
  if (key === 'architectural' || key === 'interior' || key === 'commercial') return key
  return CATEGORY_TO_LIST_KEY[key] || key
}

export function getAllPortfolioProjects(config) {
  const cfg = config || DEFAULT_PORTFOLIO_CONFIG
  const custom = Object.values(cfg.projectLists || {}).flatMap((list) =>
    Array.isArray(list) ? list : []
  )
  return [
    ...(Array.isArray(cfg.architectural) ? cfg.architectural : []),
    ...(Array.isArray(cfg.interior) ? cfg.interior : []),
    ...(Array.isArray(cfg.commercial) ? cfg.commercial : []),
    ...custom,
  ]
}

/** Read projects for a category slug or legacy list key */
export function getProjectsForCategory(config, slugOrKey) {
  const cfg = config || DEFAULT_PORTFOLIO_CONFIG
  const listKey = resolveProjectListKey(slugOrKey)
  if (!listKey) return getAllPortfolioProjects(cfg)
  if (listKey === 'architectural' || listKey === 'interior' || listKey === 'commercial') {
    return Array.isArray(cfg[listKey]) ? cfg[listKey] : []
  }
  const custom = cfg.projectLists?.[listKey]
  return Array.isArray(custom) ? custom : []
}

/** Write projects for a category slug or legacy list key */
export function setProjectsForCategory(config, slugOrKey, list) {
  const listKey = resolveProjectListKey(slugOrKey)
  const nextList = Array.isArray(list) ? list : []
  if (!listKey) return config
  if (listKey === 'architectural' || listKey === 'interior' || listKey === 'commercial') {
    return { ...config, [listKey]: nextList }
  }
  return {
    ...config,
    projectLists: {
      ...(config.projectLists || {}),
      [listKey]: nextList,
    },
  }
}

/** Built-in portfolio menu slugs — do not cascade-wipe legacy project buckets */
export const BUILTIN_PORTFOLIO_SLUGS = [
  'all-projects',
  'architectural-design',
  'interior-design',
  'commercial-design',
]

export function isBuiltinPortfolioSlug(slug) {
  return BUILTIN_PORTFOLIO_SLUGS.includes(String(slug || '').trim())
}

/**
 * Remove a custom category's related config (menu card, page banners, project list).
 * Never clears architectural / interior / commercial arrays.
 */
export function purgePortfolioCategoryFromConfig(config, slugOrId) {
  const slug = String(slugOrId || '').trim()
  if (!slug || isBuiltinPortfolioSlug(slug)) return config || DEFAULT_PORTFOLIO_CONFIG
  const cfg = config || DEFAULT_PORTFOLIO_CONFIG
  const listKey = resolveProjectListKey(slug)

  const navCards = { ...(cfg.navCards || {}) }
  delete navCards[slug]

  const heroes = { ...(cfg.heroes || {}) }
  delete heroes[slug]

  const projectLists = { ...(cfg.projectLists || {}) }
  if (listKey && listKey !== 'architectural' && listKey !== 'interior' && listKey !== 'commercial') {
    delete projectLists[listKey]
    delete projectLists[slug]
  }

  return {
    ...cfg,
    navCards,
    heroes,
    projectLists,
  }
}

/** Seed empty nav/hero/list when admin creates a new category */
export function seedPortfolioCategory(config, { slug, name }) {
  const id = String(slug || '').trim()
  if (!id || id === 'all-projects') return config
  const listKey = resolveProjectListKey(id)
  const label = String(name || id).trim() || id
  let next = { ...config }
  next.navCards = {
    ...(next.navCards || {}),
    [id]: next.navCards?.[id] || {
      title: label.toUpperCase(),
      hover: `${label} projects.`,
      image: '',
      video: '',
    },
  }
  next.heroes = {
    ...(next.heroes || {}),
    [id]: next.heroes?.[id] || {
      titleLead: label,
      titleAccent: 'by Unique Graphics®',
      description: `Projects in ${label} — add from Admin → Portfolio → Projects list.`,
      banner1: '',
      banner2: '',
      banner3: '',
    },
  }
  if (listKey === 'architectural' || listKey === 'interior' || listKey === 'commercial') {
    if (!Array.isArray(next[listKey])) next = { ...next, [listKey]: [] }
  } else {
    next.projectLists = {
      ...(next.projectLists || {}),
      [listKey]: Array.isArray(next.projectLists?.[listKey]) ? next.projectLists[listKey] : [],
    }
  }
  return next
}

const STORAGE_KEY = 'ug_portfolio_pages_config'

export function getStoredPortfolioConfig() {
  if (typeof window === 'undefined') return DEFAULT_PORTFOLIO_CONFIG
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PORTFOLIO_CONFIG
    const parsed = JSON.parse(raw)
    const hasOwn = (key) => Object.prototype.hasOwnProperty.call(parsed, key)
    return {
      ...DEFAULT_PORTFOLIO_CONFIG,
      ...parsed,
      categories: Array.isArray(parsed.categories) ? parsed.categories : undefined,
      navCards: { ...DEFAULT_PORTFOLIO_CONFIG.navCards, ...(parsed.navCards || {}) },
      heroes: { ...DEFAULT_PORTFOLIO_CONFIG.heroes, ...(parsed.heroes || {}) },
      architectural:
        hasOwn('architectural') && Array.isArray(parsed.architectural)
          ? parsed.architectural
          : DEFAULT_PORTFOLIO_CONFIG.architectural,
      interior:
        hasOwn('interior') && Array.isArray(parsed.interior)
          ? parsed.interior
          : DEFAULT_PORTFOLIO_CONFIG.interior,
      commercial:
        hasOwn('commercial') && Array.isArray(parsed.commercial)
          ? parsed.commercial
          : DEFAULT_PORTFOLIO_CONFIG.commercial,
      projectLists:
        parsed.projectLists && typeof parsed.projectLists === 'object' ? parsed.projectLists : {},
    }
  } catch (e) {
    console.warn('[portfolioConfig] Failed to parse local config:', e)
    return DEFAULT_PORTFOLIO_CONFIG
  }
}

export function setStoredPortfolioConfig(config) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    window.dispatchEvent(new CustomEvent('portfolio-pages-config-changed', { detail: config }))
  } catch (e) {
    console.error('[portfolioConfig] Failed to persist:', e)
  }
}

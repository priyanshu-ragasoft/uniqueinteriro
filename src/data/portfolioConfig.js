import { architecturalProjects as defaultArchProjects } from './architecturalProjects'
import { interiorProjects as defaultIntProjects } from './interiorProjects'
import { commercialProjects as defaultCommProjects } from './commercialProjects'

export const DEFAULT_PORTFOLIO_CONFIG = {
  // 1. Navigation Dropdown Cards (Screenshot 1)
  navCards: {
    'all-projects': {
      title: 'ALL PROJECTS',
      hover: 'Houses and rooms from the full portfolio.',
      image: '/nav/portfolio-card.jpg',
      video: '',
    },
    'architectural-design': {
      title: 'ARCHITECTURAL DESIGN',
      hover: 'Plans, facades, and the shape of the house.',
      image: '/nav/services-card.jpg',
      video: '',
    },
    'interior-design': {
      title: 'INTERIOR DESIGN',
      hover: 'Furniture, light, and the finish of each room.',
      image: '/hero.jpg',
      video: '',
    },
    'commercial-design': {
      title: 'COMMERCIAL DESIGN',
      hover: 'Guest rooms, lounges, and places of work.',
      image: '/nav/nav-backdrop.jpg',
      video: '',
    },
  },

  // 2. Page Hero Headers & Banners (Screenshots 2, 3, 4, 5)
  heroes: {
    'all-projects': {
      titleLead: 'All projects',
      titleAccent: 'by Unique Graphics®',
      description:
        'The complete global portfolio of Unique Graphics® — from landmark architectural villas and private estates to haute couture residential interiors and monumental commercial headquarters worldwide.',
      banner1: '',
      banner2: '',
      banner3: '',
    },
    'architectural-design': {
      titleLead: 'Architectural design',
      titleAccent: 'by Unique Graphics®',
      description:
        'Monumental architectural forms created in harmony with natural landscapes — private villas, landmark cliffside residences, and modern estates engineered to transcend generations.',
      banner1: '',
      banner2: '',
      banner3: '',
    },
    'interior-design': {
      titleLead: 'Interior design',
      titleAccent: 'by Unique Graphics®',
      description:
        'Every interior is an emotional sanctuary designed around personal luxury — bespoke joinery, rare marbles, museum-grade architectural lighting, and curated furniture ensembles crafted without compromise.',
      banner1: '',
      banner2: '',
      banner3: '',
    },
    'commercial-design': {
      titleLead: 'Commercial interiors',
      titleAccent: 'by Unique Graphics®',
      description:
        'We are chosen by those who strive for excellence — among our clients: Mandarin Oriental Hotel Group, Damac, Jacob&Co, Marriott, Hilton, MR Group, River Park, Engeo Development.',
      banner1: '',
      banner2: '',
      banner3: '',
    },
  },

  // 3. Projects Lists
  architectural: defaultArchProjects,
  interior: defaultIntProjects,
  commercial: defaultCommProjects,
}

const STORAGE_KEY = 'ug_portfolio_pages_config'

export function getStoredPortfolioConfig() {
  if (typeof window === 'undefined') return DEFAULT_PORTFOLIO_CONFIG
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PORTFOLIO_CONFIG
    const parsed = JSON.parse(raw)
    return {
      ...DEFAULT_PORTFOLIO_CONFIG,
      ...parsed,
      navCards: { ...DEFAULT_PORTFOLIO_CONFIG.navCards, ...(parsed.navCards || {}) },
      heroes: { ...DEFAULT_PORTFOLIO_CONFIG.heroes, ...(parsed.heroes || {}) },
      architectural: Array.isArray(parsed.architectural) && parsed.architectural.length > 0 ? parsed.architectural : DEFAULT_PORTFOLIO_CONFIG.architectural,
      interior: Array.isArray(parsed.interior) && parsed.interior.length > 0 ? parsed.interior : DEFAULT_PORTFOLIO_CONFIG.interior,
      commercial: Array.isArray(parsed.commercial) && parsed.commercial.length > 0 ? parsed.commercial : DEFAULT_PORTFOLIO_CONFIG.commercial,
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

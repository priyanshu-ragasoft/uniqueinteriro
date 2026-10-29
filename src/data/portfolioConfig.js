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
      categories: Array.isArray(parsed.categories) ? parsed.categories : undefined,
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

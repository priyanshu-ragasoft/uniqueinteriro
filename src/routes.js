import { isMenuPage } from './data/menuPages'
import { LEGACY_SERVICE_PATHS } from './data/serviceTree'
import { getStoredPortfolioTree } from './data/portfolioTree'

const sections = new Set(['portfolio', 'partner'])

let pendingSection = ''
let pendingScrollY = null
let scroller = null

export function setScroller(fn) {
  scroller = fn
}

export function scrollApp(target) {
  if (scroller) {
    scroller(target)
    return
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'instant' })
    return
  }
  document.querySelector(String(target))?.scrollIntoView()
}

export function queueSection(id) {
  pendingSection = id
}

export function consumeSection() {
  const id = pendingSection
  pendingSection = ''
  return id
}

export function queueScroll(y) {
  pendingScrollY = y
}

export function consumeScroll() {
  const y = pendingScrollY
  pendingScrollY = null
  return y
}

function portfolioCategories() {
  try {
    return getStoredPortfolioTree()?.categories || []
  } catch {
    return []
  }
}

function findPortfolioCategory(slug) {
  return portfolioCategories().find((item) => item.slug === slug || item.id === slug)
}

function findPortfolioSub(category, slug) {
  return (category?.subcategories || []).find((item) => item.slug === slug || item.id === slug)
}

export function serviceRoute(pathname) {
  const path = normalize(pathname)
  const parts = path.split('/').filter(Boolean)
  if (parts[0] === 'services' && parts.length === 1) {
    return { page: 'service', category: 'all-services', subcategory: '', story: '' }
  }
  if (parts[0] === 'services' && parts[1] && parts.length <= 4) {
    return {
      page: 'service',
      category: parts[1],
      subcategory: parts.length >= 3 ? parts[2] : '',
      story: parts.length === 4 ? parts[3] : '',
    }
  }
  if (parts.length === 1 && LEGACY_SERVICE_PATHS[parts[0]]) {
    return { page: 'service', ...LEGACY_SERVICE_PATHS[parts[0]], subcategory: '' }
  }
  if (parts[0] === 'portfolio' && parts[1] && parts.length === 2) {
    return { page: 'portfolio-category', category: parts[1], subcategory: '', second: '', third: '' }
  }
  if (parts[0] === 'portfolio' && parts[1] && parts.length === 3) {
    return { page: 'portfolio-entry', category: parts[1], subcategory: parts[2], second: parts[2], third: '' }
  }
  if (parts[0] === 'portfolio' && parts[1] && parts.length === 4) {
    return { page: 'portfolio-entry', category: parts[1], subcategory: parts[2], second: parts[2], third: parts[3] }
  }
  return null
}

export function isAppPath(pathname) {
  const bare = String(pathname || '').split('?')[0].split('#')[0]
  const path = normalize(bare)
  if (serviceRoute(path)) return true
  if (
    path === '/' ||
    path === '/about' ||
    path === '/contacts' ||
    path === '/privacy' ||
    path === '/terms' ||
    path === '/career' ||
    path === '/blog' ||
    path === '/admin' ||
    path.startsWith('/admin/') ||
    path === '/commercial-interiors' ||
    path === '/commercial-design' ||
    path === '/commercial' ||
    path === '/interior-design' ||
    path === '/interiors' ||
    path === '/architectural-design' ||
    path === '/architecture' ||
    path === '/all-projects' ||
    path === '/all-services' ||
    path === '/services' ||
    path === '/astro-vastu' ||
    path === '/portfolio'
  )
    return true
  if (path.startsWith('/project/') && path.length > '/project/'.length) return true

  const parts = path.split('/').filter(Boolean)
  if (parts.length === 1) {
    if (findPortfolioCategory(parts[0]) || !isReservedAppSlug(parts[0])) return true
  }
  if (
    (parts.length === 2 || parts.length === 3) &&
    parts[0] !== 'services' &&
    parts[0] !== 'project' &&
    parts[0] !== 'admin'
  ) {
    return true
  }
  return isMenuPage(path.slice(1))
}

const PORTFOLIO_ALIASES = {
  'all-projects': 'all-projects',
  portfolio: 'all-projects',
  'architectural-design': 'architectural-design',
  architecture: 'architectural-design',
  'interior-design': 'interior-design',
  interiors: 'interior-design',
  'commercial-design': 'commercial-design',
  'commercial-interiors': 'commercial-design',
  commercial: 'commercial-design',
}

export function routeFromPath(pathname) {
  const path = normalize(pathname)
  const service = serviceRoute(path)
  if (service) return service
  if (path === '/about') return { page: 'about' }
  if (path === '/contacts') return { page: 'contacts' }
  if (path === '/privacy') return { page: 'privacy' }
  if (path === '/terms') return { page: 'terms' }
  if (path === '/career') return { page: 'career' }
  if (path === '/blog') return { page: 'blog' }
  if (path === '/admin' || path.startsWith('/admin/')) return { page: 'admin' }
  if (path.startsWith('/project/')) {
    return { page: 'project', id: decodeURIComponent(path.slice('/project/'.length)) }
  }

  const parts = path.split('/').filter(Boolean)
  if (parts.length === 1 && PORTFOLIO_ALIASES[parts[0]]) {
    return { page: 'portfolio-category', category: PORTFOLIO_ALIASES[parts[0]], subcategory: '' }
  }
  if (parts.length === 1) {
    const match = findPortfolioCategory(parts[0])
    if (match) return { page: 'portfolio-category', category: match.slug || parts[0], subcategory: '' }
    if (isMenuPage(parts[0])) return { page: 'studio', id: parts[0] }
    if (!isReservedAppSlug(parts[0])) {
      return { page: 'portfolio-category', category: parts[0], subcategory: '' }
    }
  }
  if (parts.length === 2 && parts[0] !== 'services' && parts[0] !== 'project' && parts[0] !== 'admin') {
    const match = findPortfolioCategory(parts[0])
    const sub = match ? findPortfolioSub(match, parts[1]) : null
    if (sub) {
      return {
        page: 'portfolio-category',
        category: match.slug || parts[0],
        subcategory: sub.slug || parts[1],
        second: sub.slug || parts[1],
        third: '',
      }
    }
    return {
      page: 'portfolio-entry',
      category: match?.slug || parts[0],
      subcategory: parts[1],
      second: parts[1],
      third: '',
    }
  }
  if (parts.length === 3 && parts[0] !== 'services' && parts[0] !== 'project' && parts[0] !== 'admin') {
    const match = findPortfolioCategory(parts[0])
    const sub = match ? findPortfolioSub(match, parts[1]) : null
    return {
      page: 'portfolio-entry',
      category: match?.slug || parts[0],
      subcategory: sub?.slug || parts[1],
      second: sub?.slug || parts[1],
      third: parts[2],
    }
  }

  const id = path.slice(1)
  if (id && isMenuPage(id)) return { page: 'studio', id }
  return { page: 'home' }
}

function isReservedAppSlug(slug) {
  return Boolean(
    PORTFOLIO_ALIASES[slug] ||
      LEGACY_SERVICE_PATHS[slug] ||
      ['about', 'contacts', 'privacy', 'terms', 'career', 'blog', 'admin', 'project', 'services', 'portfolio'].includes(slug)
  )
}

export function legacyHashPath(hash) {
  if (!hash || hash === '#' || hash === '#top') return '/'
  if (hash === '#about') return '/about'
  if (hash === '#contacts') return '/contacts'
  if (hash.startsWith('#project-')) return `/project/${hash.slice('#project-'.length)}`
  const id = hash.slice(1)
  if (isMenuPage(id)) return `/${id}`
  if (sections.has(id)) return { home: true, section: `#${id}` }
  return '/'
}

export function migrateLegacyHash() {
  const hash = window.location.hash
  if (!hash) return
  const next = legacyHashPath(hash)
  if (typeof next === 'string') {
    history.replaceState(null, '', next)
    return
  }
  queueSection(next.section)
  history.replaceState(null, '', '/')
}

function normalize(pathname) {
  if (!pathname || pathname === '/') return '/'
  const trimmed = pathname.replace(/\/+$/, '')
  return trimmed || '/'
}

import { isMenuPage } from './data/menuPages'

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

export function isAppPath(pathname) {
  const path = normalize(pathname)
  if (
    path === '/' ||
    path === '/about' ||
    path === '/contacts' ||
    path === '/privacy' ||
    path === '/terms' ||
    path === '/career' ||
    path === '/blog' ||
    path === '/admin' ||
    path === '/commercial-interiors' ||
    path === '/commercial-design' ||
    path === '/commercial' ||
    path === '/interior-design' ||
    path === '/interiors' ||
    path === '/architectural-design' ||
    path === '/architecture' ||
    path === '/all-projects' ||
    path === '/portfolio'
  )
    return true
  if (path.startsWith('/project/') && path.length > '/project/'.length) return true
  return isMenuPage(path.slice(1))
}

export function routeFromPath(pathname) {
  const path = normalize(pathname)
  if (path === '/about') return { page: 'about' }
  if (path === '/contacts') return { page: 'contacts' }
  if (path === '/privacy') return { page: 'privacy' }
  if (path === '/terms') return { page: 'terms' }
  if (path === '/career') return { page: 'career' }
  if (path === '/blog') return { page: 'blog' }
  if (path === '/admin') return { page: 'admin' }
  if (path === '/all-projects' || path === '/portfolio') {
    return { page: 'all-projects' }
  }
  if (path === '/commercial-interiors' || path === '/commercial-design' || path === '/commercial') {
    return { page: 'commercial' }
  }
  if (path === '/interior-design' || path === '/interiors') {
    return { page: 'interior' }
  }
  if (path === '/architectural-design' || path === '/architecture') {
    return { page: 'architectural' }
  }
  if (path.startsWith('/project/')) {
    return { page: 'project', id: decodeURIComponent(path.slice('/project/'.length)) }
  }
  const id = path.slice(1)
  if (id && isMenuPage(id)) return { page: 'studio', id }
  return { page: 'home' }
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

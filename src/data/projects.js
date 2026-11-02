import { architecturalProjects } from './architecturalProjects'
import { commercialProjects } from './commercialProjects'
import { interiorProjects } from './interiorProjects'
import { getStoredPortfolioConfig } from './portfolioConfig'
import { flattenPortfolioProjects, getStoredPortfolioTree } from './portfolioTree'
import { normalizeProjectVideoUrl } from '../utils/videoUrl'

export const categories = {
  en: [
    ['all', 'All Projects'],
    ['architecture', 'Architecture'],
    ['commercial', 'Commercial'],
    ['banquet', 'Banquet Halls'],
    ['bars-clubs', 'Bars & Night Clubs'],
    ['interior', 'Residential Interior'],
    ['office', 'Corporate Offices'],
  ],
}

function mapDisciplineProject(p, defaultCat) {
  let cat = defaultCat
  const type = (p.type || '').toLowerCase()
  const title = (p.titlePre || p.id || '').toLowerCase()
  if (type.includes('banquet') || title.includes('banquet')) cat = 'banquet'
  else if (type.includes('bar') || type.includes('club') || title.includes('bar') || title.includes('club')) cat = 'bars-clubs'
  else if (type.includes('office') || title.includes('office')) cat = 'office'
  else if (type.includes('tower') || type.includes('landmark') || type.includes('campus') || type.includes('facade') || p.id.startsWith('arch-')) cat = 'architecture'
  else if (type.includes('interior') || type.includes('living') || type.includes('suite') || p.id.startsWith('interior-')) cat = 'interior'

  const scope =
    Array.isArray(p.scope) && p.scope.length
      ? p.scope
      : ['Architectural Design', 'Interior Architecture', '3D Visualization', 'Material Selection']

  return {
    id: p.id,
    cat,
    image: p.image,
    video: p.video ? normalizeProjectVideoUrl(p.video) : null,
    gallery: Array.isArray(p.gallery) ? p.gallery.map((g) => (typeof g === 'string' && g.endsWith('.mp4') ? normalizeProjectVideoUrl(g) : g)) : [],
    sections: Array.isArray(p.sections) ? p.sections : [],
    tour360: p.tour360 || '',
    area: p.area || '',
    type: p.type || '',
    tone: p.tone || '',
    city: p.city || '',
    country: p.country || '',
    badge: p.badge || '',
    award: p.award || '',
    titlePre: p.titlePre || '',
    location: p.location || '',
    titlePost: p.titlePost || '',
    description: p.description || '',
    detail: p.detail || p.description || '',
    scope,
    aboutHeading: p.aboutHeading || 'About the project:',
    featuresTitle: p.featuresTitle || 'Project features',
    enquireLabel: p.enquireLabel || 'Enquire',
    enquireLink: p.enquireLink || '/contacts',
    tour360Heading: p.tour360Heading || '360° experience',
    tocHeading: p.tocHeading || 'Table of contents:',
    readAlsoHeading: p.readAlsoHeading || 'Read also:',
    closingEyebrow: p.closingEyebrow || 'Unique Graphics®',
    closingTitle: p.closingTitle || 'Step into the world of Unique Graphics®',
    closingText:
      p.closingText ||
      'A place where your dreams take shape through the unique vision of our studio. We look forward to embarking on this inspiring journey with you.',
    closingButtonLabel: p.closingButtonLabel || 'Discuss this project',
    closingButtonLink: p.closingButtonLink || '/contacts',
    en: {
      category: p.type || 'Bespoke Design',
      title: [p.titlePre, p.location, p.titlePost].filter(Boolean).join(' ') || p.id,
      summary: p.summary || p.description || ((p.location ? p.location + ' • ' : '') + (p.area || '1 200 m²')),
      scope,
      detail: p.detail || p.description || 'Bespoke architectural and interior design project crafted by Unique Graphics®.',
    },
  }
}

function disciplineCat(listKey) {
  if (listKey === 'interior') return 'interior'
  if (listKey === 'commercial') return 'commercial'
  return 'architecture'
}

export const projects = [
  ...architecturalProjects.map((p) => mapDisciplineProject(p, 'architecture')),
  ...commercialProjects.map((p) => mapDisciplineProject(p, 'commercial')),
  ...interiorProjects.map((p) => mapDisciplineProject(p, 'interior')),
]

function findInPortfolioConfig(id) {
  try {
    const fromTree = flattenPortfolioProjects(getStoredPortfolioTree()).find(
      (project) => String(project.id) === String(id)
    )
    if (fromTree) return mapDisciplineProject(fromTree, fromTree.categorySlug || 'architecture')

    const config = getStoredPortfolioConfig()
    const lists = [
      ['architectural', config.architectural],
      ['interior', config.interior],
      ['commercial', config.commercial],
    ]
    for (const [key, list] of lists) {
      if (!Array.isArray(list)) continue
      const found = list.find((project) => String(project.id) === String(id))
      if (found) return mapDisciplineProject(found, disciplineCat(key))
    }
    const customLists = config.projectLists || {}
    for (const [key, list] of Object.entries(customLists)) {
      if (!Array.isArray(list)) continue
      const found = list.find((project) => String(project.id) === String(id))
      if (found) return mapDisciplineProject(found, key)
    }
  } catch {}
  return null
}

export function findProject(id) {
  const fromAdmin = findInPortfolioConfig(id)
  if (fromAdmin) return fromAdmin

  const match = projects.find((project) => project.id === id)
  if (match) return match

  try {
    const saved = localStorage.getItem('ug_completed_projects_config_v3') || localStorage.getItem('ug_completed_projects_config')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed.projects)) {
        const found = parsed.projects.find((project) => project.id === id)
        if (found) return found
      }
    }
  } catch {}
  return null
}

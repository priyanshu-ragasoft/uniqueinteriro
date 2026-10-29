import { architecturalProjects } from './architecturalProjects'
import { commercialProjects } from './commercialProjects'
import { interiorProjects } from './interiorProjects'

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
  ru: [
    ['all', 'Все проекты'],
    ['architecture', 'Архитектура'],
    ['commercial', 'Коммерческий дизайн'],
    ['banquet', 'Банкетные залы'],
    ['bars-clubs', 'Бары и Клубы'],
    ['interior', 'Интерьеры'],
    ['office', 'Офисы'],
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

  return {
    id: p.id,
    cat,
    image: p.image,
    video: p.video || null,
    gallery: p.gallery || [],
    en: {
      category: p.type || 'Bespoke Design',
      title: p.titlePre || p.id,
      summary: (p.location ? p.location + ' • ' : '') + (p.area || '1 200 m²'),
      scope: ['Architectural Design', 'Interior Architecture', '3D Visualization', 'Material Selection'],
      detail: p.description || 'Bespoke architectural and interior design project crafted by Unique Graphics®.'
    },
    ru: {
      category: p.type || 'Проект',
      title: p.titlePre || p.id,
      summary: (p.location ? p.location + ' • ' : '') + (p.area || '1 200 m²'),
      scope: ['Архитектура', 'Интерьер', '3D визуализация'],
      detail: p.description || 'Проект студии Unique Graphics®.'
    }
  }
}

export const projects = [
  ...architecturalProjects.map((p) => mapDisciplineProject(p, 'architecture')),
  ...commercialProjects.map((p) => mapDisciplineProject(p, 'commercial')),
  ...interiorProjects.map((p) => mapDisciplineProject(p, 'interior')),
]

export function findProject(id) {
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

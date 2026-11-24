import { projects, findProject } from '../data/projects'
import { flattenPortfolioProjects, getStoredPortfolioTree } from '../data/portfolioTree'

function cleanPath(src) {
  if (!src || typeof src !== 'string') return ''
  try {
    return decodeURIComponent(src).trim().toLowerCase().replace(/\\/g, '/')
  } catch {
    return String(src).trim().toLowerCase().replace(/\\/g, '/')
  }
}

function getFilename(clean) {
  return clean.split('/').pop()?.split('?')[0]?.split('#')[0] || ''
}

function getFolderAndFilename(clean) {
  const parts = clean.split('/').filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[parts.length - 2]}/${parts[parts.length - 1]}`
  }
  return parts[0] || ''
}

export function findProjectByMedia(src) {
  if (!src) return null
  const clean = cleanPath(src)
  if (!clean) return null
  const filename = getFilename(clean)
  const folderAndFile = getFolderAndFilename(clean)

  // 1. Check all projects in projects.js
  const allProjects = Array.isArray(projects) ? projects : []
  for (const p of allProjects) {
    const pImg = cleanPath(p.image)
    if (pImg) {
      if (pImg === clean || pImg.includes(clean) || clean.includes(pImg)) return p
      if (folderAndFile && pImg.includes(folderAndFile)) return p
      if (filename && filename.length > 8 && pImg.endsWith(filename)) return p
    }

    const pVideo = cleanPath(p.video)
    if (pVideo) {
      if (pVideo === clean || pVideo.includes(clean) || clean.includes(pVideo)) return p
      if (folderAndFile && pVideo.includes(folderAndFile)) return p
      if (filename && filename.length > 8 && pVideo.endsWith(filename)) return p
    }

    const gallery = Array.isArray(p.gallery) ? p.gallery : []
    for (const g of gallery) {
      const gSrc = cleanPath(typeof g === 'string' ? g : (g?.src || g?.image || g?.url || ''))
      if (!gSrc) continue
      if (gSrc === clean || gSrc.includes(clean) || clean.includes(gSrc)) return p
      if (folderAndFile && gSrc.includes(folderAndFile)) return p
      if (filename && filename.length > 8 && gSrc.endsWith(filename)) return p
    }

    const sections = Array.isArray(p.sections) ? p.sections : []
    for (const s of sections) {
      const sSrc = cleanPath(s?.media || s?.image || s?.video || '')
      if (!sSrc) continue
      if (sSrc === clean || sSrc.includes(clean) || clean.includes(sSrc)) return p
      if (folderAndFile && sSrc.includes(folderAndFile)) return p
      if (filename && filename.length > 8 && sSrc.endsWith(filename)) return p
    }
  }

  // 2. Check portfolioTree
  try {
    const treeProjects = flattenPortfolioProjects(getStoredPortfolioTree()) || []
    for (const p of treeProjects) {
      const pImg = cleanPath(p.image)
      if (pImg && (pImg === clean || pImg.includes(clean) || clean.includes(pImg) || (folderAndFile && pImg.includes(folderAndFile)))) {
        return findProject(p.id) || p
      }
    }
  } catch {}

  return null
}

export function getMediaDetailsInfo(src, fallbackTitle = '', explicitLink = '') {
  if (explicitLink) {
    return {
      href: explicitLink,
      title: fallbackTitle || 'View Project Details',
      project: null,
    }
  }
  const project = findProjectByMedia(src)
  if (project) {
    const title = project.titlePre || project.en?.title || project.title || fallbackTitle || 'Project Details'
    return {
      href: `/project/${project.id}`,
      title,
      project,
    }
  }
  return {
    href: '',
    title: fallbackTitle || '',
    project: null,
  }
}


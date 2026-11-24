import { useEffect, useState } from 'react'
import {
  buildDefaultServiceTree,
  emptyPage,
  getStoredServiceTree,
  normalizeServicePage,
  normalizeTree,
  serviceGalleryPath,
  serviceHighlightPath,
  setStoredServiceTree,
  slugify,
  validateServiceTree,
} from '../../data/serviceTree'
import { isBuiltinPortfolioSlug, purgePortfolioCategoryFromConfig, getStoredPortfolioConfig, setStoredPortfolioConfig } from '../../data/portfolioConfig'
import {
  emptyHighlightDetail,
  normalizeGalleryItem,
  normalizeHighlightItem,
  portfolioCategoryPath,
  portfolioGalleryPath,
  portfolioHighlightPath,
  portfolioSubcategoryPath,
} from '../../data/portfolioTree'

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

function move(list, index, direction) {
  const next = [...list]
  const target = index + direction
  if (target < 0 || target >= next.length) return list
  const [item] = next.splice(index, 1)
  next.splice(target, 0, item)
  return next.map((entry, order) => ({ ...entry, order }))
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
}

async function uploadMedia(file, token) {
  const dataUrl = await fileToDataUrl(file)
  const res = await fetch('/api/blogs/uploads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || localStorage.getItem('ug_admin_token') || ''}`,
    },
    body: JSON.stringify({ filename: file.name, dataUrl }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.url) throw new Error(data.message || 'Upload failed')
  return data.url
}

const inputClass =
  'w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-[13px] text-white/90 placeholder:text-white/20 outline-none transition focus:border-[#e3943f] focus:bg-black/70'
const fileClass =
  'block w-full text-[12px] text-white/50 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-2.5 file:py-1 file:text-[11px] file:font-medium file:text-white hover:file:bg-white/15 cursor-pointer'
const btnGhost =
  'inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] font-medium text-white/70 hover:bg-white/[0.08] hover:text-white transition disabled:opacity-40 cursor-pointer'
const btnPrimary =
  'inline-flex items-center gap-2 rounded-lg bg-[#e3943f] px-4 py-2 text-[12px] font-semibold text-black hover:bg-[#d68532] transition disabled:opacity-50 cursor-pointer shadow-sm'

function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[12px] font-medium text-white/70">{label}</label>
        {hint ? <span className="text-[11px] text-white/35">{hint}</span> : null}
      </div>
      {children}
    </div>
  )
}

function firstUsefulCategory(list, portfolio) {
  const cats = Array.isArray(list) ? list : []
  if (!portfolio) return cats[0]
  return cats.find((item) => item.slug !== 'all-projects') || cats[0]
}

function countProjectsInTree(categories) {
  return (categories || []).reduce((total, cat) => {
    if (cat.slug === 'all-projects') return total
    const own = (cat.projects || []).length
    const nested = (cat.subcategories || []).reduce((sum, sub) => sum + (sub.projects || []).length, 0)
    return total + own + nested
  }, 0)
}

function isVideoSource(src) {
  const value = String(src || '').toLowerCase()
  return value.startsWith('data:video') || /\.(mp4|webm|ogg|mov)(\?|#|$)/.test(value)
}

function MediaThumb({ src, className = 'h-20 w-24 shrink-0' }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [src])
  if (!src) {
    return (
      <div className={`flex items-center justify-center rounded-lg border border-dashed border-white/10 bg-black/30 text-[10px] text-white/25 ${className}`}>
        Empty
      </div>
    )
  }
  return (
    <div className={`flex items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-black ${className}`}>
      {failed ? (
        <span className="px-2 text-center text-[10px] text-white/40">Failed</span>
      ) : isVideoSource(src) ? (
        <video src={src} muted playsInline preload="metadata" className="h-full w-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <img src={src} alt="" className="h-full w-full object-cover" onError={() => setFailed(true)} />
      )}
    </div>
  )
}

function MediaPicker({ src, onChange, onFile, label = 'Media' }) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        <MediaThumb src={src} />
        <div className="min-w-0 flex-1 space-y-2">
          <input
            className={inputClass}
            placeholder="Paste URL (image / video)"
            value={src || ''}
            onChange={(e) => onChange(e.target.value)}
          />
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/70 hover:bg-white/10 transition">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span>Upload file</span>
            <input
              type="file"
              accept="image/*,video/mp4,video/webm,video/ogg,.mov"
              className="sr-only"
              onChange={(e) => {
                onFile(e.target.files?.[0])
                e.target.value = ''
              }}
            />
          </label>
        </div>
      </div>
    </Field>
  )
}

function BlockToggle({ checked, onChange, label = 'Visible' }) {
  return (
    <label className="inline-flex items-center gap-2 text-[12px] text-white/60 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-3.5 w-3.5 rounded border-white/20 bg-black/40 accent-[#e3943f] cursor-pointer"
      />
      <span>{label}</span>
    </label>
  )
}

function visualSrc(item) {
  if (!item) return ''
  if (typeof item === 'string') return item
  return String(item.image || item.src || item.url || '').trim()
}

function packProjectVisual(visual) {
  const image = visualSrc(visual)
  const title = String(visual?.title || '').trim()
  const text = String(visual?.text || visual?.description || '').trim()
  const caption = String(visual?.caption || '').trim()
  return { id: visual?.id || '', image, title, text, description: text, caption }
}

function normalizeProjectVisuals(gallery, { keepEmpty = true } = {}) {
  const list = (Array.isArray(gallery) ? gallery : []).map((item, index) => {
    const image = visualSrc(item)
    const raw = item && typeof item === 'object' ? item : {}
    const title = String(raw.title || raw.tocTitle || raw.label || '').trim() || (image ? `Photo ${index + 1}` : '')
    const text = String(raw.text || raw.description || '').trim()
    return {
      id: raw.id || `vis-${index + 1}`,
      image,
      title,
      text,
      caption: String(raw.caption || '').trim(),
    }
  })
  return keepEmpty ? list : list.filter((item) => item.image || item.title)
}

function hydrateProjectForEdit(project) {
  if (!project) return project
  return {
    ...project,
    gallery: normalizeProjectVisuals(project.gallery),
    sections: Array.isArray(project.sections) ? project.sections : [],
  }
}

function blankProject(name) {
  return {
    id: uid('proj'),
    image: '',
    video: '',
    gallery: [],
    sections: [],
    tour360: '',
    area: '',
    type: '',
    tone: '',
    city: '',
    country: '',
    badge: '',
    award: '',
    titlePre: name || 'New project',
    location: '',
    titlePost: '',
    description: '',
    detail: '',
    scope: [],
    aboutHeading: 'About the project:',
    featuresTitle: 'Project features',
    enquireLabel: 'Enquire',
    enquireLink: '/contacts',
    tour360Heading: '360° experience',
    tocHeading: 'Table of contents:',
    readAlsoHeading: 'Read also:',
    closingEyebrow: 'Unique Graphics®',
    closingTitle: 'Step into the world of Unique Graphics®',
    closingText: '',
    closingButtonLabel: 'Discuss this project',
    closingButtonLink: '/contacts',
  }
}

export default function ServicesManager({
  token,
  title = 'Services',
  endpoint = '/api/blogs/settings/services-pages',
  readTree = getStoredServiceTree,
  writeTree = setStoredServiceTree,
  resetTree = buildDefaultServiceTree,
  checkTree = validateServiceTree,
  normalize = normalizeTree,
  urlFor = (categoryItem, sub) =>
    sub
      ? `/services/${categoryItem.slug}/${sub.slug}`
      : categoryItem.slug === 'all-services'
        ? '/services'
        : `/services/${categoryItem.slug}`,
  packTree = (value) => value,
  intro = 'Select a page from the sidebar to edit its content and projects.',
  onEditingChange,
}) {
  const storagePrefix = String(endpoint || '').replace(/[^a-zA-Z0-9]/g, '_')

  const [tree, setTree] = useState(() => readTree())
  const [tab, setTab] = useState(() => {
    try {
      const saved = localStorage.getItem(`ug_mgr_tab_${storagePrefix}`)
      if (saved && ['menu', 'page', 'projects'].includes(saved)) return saved
    } catch {}
    return String(endpoint || '').includes('portfolio-pages') ? 'page' : 'menu'
  })
  const [categoryId, setCategoryId] = useState(() => {
    try {
      const saved = localStorage.getItem(`ug_mgr_cat_${storagePrefix}`)
      const cats = readTree().categories || []
      if (saved && cats.some((c) => c.id === saved)) return saved
    } catch {}
    return firstUsefulCategory(readTree().categories, String(endpoint || '').includes('portfolio-pages'))?.id || ''
  })
  const [subId, setSubId] = useState(() => {
    try {
      return localStorage.getItem(`ug_mgr_sub_${storagePrefix}`) || ''
    } catch {
      return ''
    }
  })

  useEffect(() => {
    try {
      if (tab) localStorage.setItem(`ug_mgr_tab_${storagePrefix}`, tab)
      if (categoryId) localStorage.setItem(`ug_mgr_cat_${storagePrefix}`, categoryId)
      localStorage.setItem(`ug_mgr_sub_${storagePrefix}`, subId || '')
    } catch {}
  }, [tab, categoryId, subId, storagePrefix])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [isNewProject, setIsNewProject] = useState(false)
  const [editingHighlight, setEditingHighlight] = useState(null)
  const [editingGallery, setEditingGallery] = useState(null)
  const authToken = token || (typeof localStorage !== 'undefined' ? localStorage.getItem('ug_admin_token') : '')
  const isPortfolio = String(endpoint || '').includes('portfolio-pages')

  useEffect(() => {
    onEditingChange?.(Boolean(editingProject || editingHighlight || editingGallery))
  }, [editingProject, editingHighlight, editingGallery, onEditingChange])

  const storeFile = async (file, apply) => {
    if (!file) return
    setUploading(true)
    setError('')
    setStatus(null)
    try {
      const url = await uploadMedia(file, authToken)
      apply(url)
      setStatus('uploaded')
    } catch (err) {
      setError(err.message || 'Upload failed')
      setStatus('error')
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data?.categories) && data.data.categories.length) {
          const next = normalize({ categories: data.data.categories }, data.data)
          const portfolio = String(endpoint || '').includes('portfolio-pages')
          setTree(next)
          writeTree(next)
          setCategoryId((curr) => {
            if (curr && next.categories.some((item) => item.id === curr)) return curr
            return firstUsefulCategory(next.categories, portfolio)?.id || ''
          })
        }
      })
      .catch(() => {})
  }, [endpoint, normalize])

  useEffect(() => {
    if (!status) return undefined
    const timer = setTimeout(() => setStatus(null), 3000)
    return () => clearTimeout(timer)
  }, [status])

  const categories = [...(tree.categories || [])].sort((a, b) => a.order - b.order)
  const category = categories.find((item) => item.id === categoryId) || categories[0]
  const subcategories = [...(category?.subcategories || [])].sort((a, b) => a.order - b.order)
  const subcategory = subcategories.find((item) => item.id === subId) || null
  const editing = subcategory || category
  const page = emptyPage(editing?.page || {})
  const projects = Array.isArray(editing?.projects) ? editing.projects : []
  const livePath = category ? urlFor(category, subcategory) : ''
  const isAllProjects = isPortfolio && !subcategory && category?.slug === 'all-projects'
  const collectedProjectCount = isAllProjects ? countProjectsInTree(categories) : projects.length

  const filteredCategories = categories.filter((c) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      c.name?.toLowerCase().includes(q) ||
      c.slug?.toLowerCase().includes(q) ||
      (c.subcategories || []).some((s) => s.name?.toLowerCase().includes(q))
    )
  })

  const patchCategory = (id, patch) => {
    setTree((current) => ({
      categories: current.categories.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }))
  }

  const patchSub = (id, patch) => {
    if (!category) return
    patchCategory(category.id, {
      subcategories: category.subcategories.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    })
  }

  const patchEditing = (patch) => {
    if (subcategory) patchSub(subcategory.id, patch)
    else if (category) patchCategory(category.id, patch)
  }

  const patchPage = (block, value) => {
    patchEditing({ page: { ...page, [block]: value } })
  }

  const persistTree = async (nextTree, options = {}) => {
    const errors = checkTree(nextTree)
    if (errors.length) {
      setError(errors[0])
      setStatus('error')
      return false
    }
    setLoading(true)
    setError('')
    writeTree(nextTree)
    try {
      let payload = packTree(nextTree)
      if (!isPortfolio && Array.isArray(payload?.categories)) {
        payload = {
          ...payload,
          categories: payload.categories.map((cat) => ({
            ...cat,
            page: normalizeServicePage(cat.page, (cat.subcategories || []).map((sub) => sub.slug || sub.id)),
            subcategories: (cat.subcategories || []).map((sub) => ({ ...sub, page: normalizeServicePage(sub.page) })),
          })),
        }
      }
      if (isPortfolio) {
        const slugs = (payload.categories || []).map((item) => item.slug)
        const remoteRes = await fetch(endpoint)
        const remoteData = await remoteRes.json().catch(() => ({}))
        const extras = (remoteData?.data?.categories || []).filter(
          (item) => ['residences', 'hospitality', 'nightlife'].includes(item.slug) && !slugs.includes(item.slug)
        )
        if (extras.length) payload = { ...payload, categories: [...(payload.categories || []), ...extras] }
        if (options.removedSlugs?.length) payload = { ...payload, removedSlugs: options.removedSlugs }
      }
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || localStorage.getItem('ug_admin_token') || ''}`,
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || data.success === false) {
        setError(data.message || 'Save failed')
        setStatus('error')
        return false
      }
      setStatus('saved')
      return true
    } catch {
      setStatus('saved')
      return true
    } finally {
      setLoading(false)
    }
  }

  const save = async () => {
    await persistTree(tree)
  }

  const deleteCategory = async (item) => {
    if (!item) return
    const slug = item.slug || item.id
    if (isPortfolio && isBuiltinPortfolioSlug(slug)) {
      window.alert(`"${item.name}" cannot be deleted as it is a core section.`)
      return
    }
    if (!window.confirm(`Delete "${item.name}"?`)) return
    const nextTree = { categories: tree.categories.filter((entry) => entry.id !== item.id) }
    if (isPortfolio) {
      const purged = purgePortfolioCategoryFromConfig(getStoredPortfolioConfig(), slug)
      setStoredPortfolioConfig({ ...purged, categories: nextTree.categories })
    }
    setTree(nextTree)
    if (categoryId === item.id) {
      setSubId('')
      setCategoryId(nextTree.categories[0]?.id || '')
    }
    await persistTree(nextTree, { removedSlugs: [slug] })
  }

  const deleteSubcategory = async (item) => {
    if (!category || !item) return
    if (!window.confirm(`Delete subpage "${item.name}"?`)) return
    const nextTree = {
      categories: tree.categories.map((entry) =>
        entry.id === category.id
          ? { ...entry, subcategories: (entry.subcategories || []).filter((sub) => sub.id !== item.id) }
          : entry
      ),
    }
    setTree(nextTree)
    if (subId === item.id) setSubId('')
    await persistTree(nextTree)
  }

  const addCategory = () => {
    const slug = `section-${tree.categories.length + 1}`
    const item = {
      id: uid('cat'),
      name: isPortfolio ? 'New Section' : 'New Category',
      slug,
      menuDescription: '',
      menuImage: '',
      menuVideo: '',
      published: true,
      showInMenu: true,
      order: tree.categories.length,
      page: emptyPage({ banner: { title: 'New Section' } }),
      projects: [],
      subcategories: [],
      ...(isPortfolio ? { href: portfolioCategoryPath({ slug }) } : {}),
    }
    setTree((current) => ({ categories: [...current.categories, item] }))
    setCategoryId(item.id)
    setSubId('')
    setTab('menu')
  }

  const addSubcategory = () => {
    if (!category) return
    const item = {
      id: uid('sub'),
      name: 'New Subpage',
      slug: `page-${(category.subcategories || []).length + 1}`,
      menuDescription: '',
      menuImage: category.menuImage || '',
      menuVideo: '',
      published: true,
      showInMenu: true,
      order: (category.subcategories || []).length,
      page: emptyPage({ banner: { title: 'New Subpage' } }),
      projects: [],
    }
    patchCategory(category.id, { subcategories: [...(category.subcategories || []), item] })
    setSubId(item.id)
    setTab('menu')
  }

  const selectCategory = (id) => {
    setCategoryId(id)
    setSubId('')
    setEditingProject(null)
    setEditingHighlight(null)
    setEditingGallery(null)
  }

  const selectSub = (id) => {
    setSubId(id)
    setEditingProject(null)
    setEditingHighlight(null)
    setEditingGallery(null)
  }

  const reservedHighlightSlugs = (category?.subcategories || []).map((item) => item.slug || item.id)
  const reservedGallerySlugs = [
    ...reservedHighlightSlugs,
    ...((page.highlights?.items || []).map((item) => item.slug).filter(Boolean)),
  ]

  const applyHighlightToTree = (item) => {
    const nextItem = normalizeHighlightItem(item, 0, reservedHighlightSlugs, new Set())
    const nextTree = {
      categories: tree.categories.map((cat) => {
        if (cat.id !== category?.id) return cat
        const writePage = (pg) => ({
          ...pg,
          highlights: { ...(pg?.highlights || {}), items: (pg?.highlights?.items || []).map((e) => (e.id === nextItem.id ? nextItem : e)) },
        })
        if (subcategory) {
          return {
            ...cat,
            subcategories: (cat.subcategories || []).map((sub) =>
              sub.id === subcategory.id ? { ...sub, page: writePage(sub.page) } : sub
            ),
          }
        }
        return { ...cat, page: writePage(cat.page) }
      }),
    }
    setTree(nextTree)
    return nextTree
  }

  const saveHighlight = async () => {
    if (!editingHighlight) return
    const nextTree = applyHighlightToTree(editingHighlight)
    setEditingHighlight(null)
    setTab('page')
    await persistTree(nextTree)
  }

  const applyGalleryToTree = (item) => {
    const nextItem = normalizeGalleryItem(item, 0, reservedGallerySlugs, new Set())
    const nextTree = {
      categories: tree.categories.map((cat) => {
        if (cat.id !== category?.id) return cat
        const writePage = (pg) => ({
          ...pg,
          gallery: { ...(pg?.gallery || {}), items: (pg?.gallery?.items || []).map((e) => (e.id === nextItem.id ? nextItem : e)) },
        })
        if (subcategory) {
          return {
            ...cat,
            subcategories: (cat.subcategories || []).map((sub) =>
              sub.id === subcategory.id ? { ...sub, page: writePage(sub.page) } : sub
            ),
          }
        }
        return { ...cat, page: writePage(cat.page) }
      }),
    }
    setTree(nextTree)
    return nextTree
  }

  const saveGallery = async () => {
    if (!editingGallery) return
    const nextTree = applyGalleryToTree(editingGallery)
    setEditingGallery(null)
    setTab('page')
    await persistTree(nextTree)
  }

  const saveProject = () => {
    if (!editingProject) return
    const nextProject = {
      ...editingProject,
      gallery: normalizeProjectVisuals(editingProject.gallery, { keepEmpty: false }).map(packProjectVisual),
    }
    const nextList = isNewProject
      ? [nextProject, ...projects]
      : projects.map((item) => (item.id === nextProject.id ? nextProject : item))
    patchEditing({ projects: nextList })
    setEditingProject(null)
    setIsNewProject(false)
    setTab('projects')
  }

  const patchVisual = (index, patch) => {
    setEditingProject((current) => {
      const gallery = [...normalizeProjectVisuals(current.gallery)]
      gallery[index] = { ...gallery[index], ...patch }
      return { ...current, gallery }
    })
  }

  const editingStory = editingHighlight || editingGallery
  const storyKind = editingHighlight ? 'highlight' : editingGallery ? 'gallery' : ''

  if (editingStory) {
    const setStory = storyKind === 'gallery' ? setEditingGallery : setEditingHighlight
    const saveStory = storyKind === 'gallery' ? saveGallery : saveHighlight
    const detail = emptyHighlightDetail(editingStory.detail)
    const patchDetail = (patch) => setStory((curr) => ({ ...curr, detail: { ...emptyHighlightDetail(curr.detail), ...patch } }))
    return (
      <div className="space-y-4 pb-20 text-white max-w-4xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-[12px] text-white/50 hover:text-white transition cursor-pointer"
              onClick={() => setStory(null)}
            >
              ← Back
            </button>
            <h1 className="text-[15px] font-semibold text-white">
              {storyKind === 'gallery' ? 'Gallery Item Details' : 'Story Card Details'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className={btnGhost} onClick={() => setStory(null)}>Cancel</button>
            <button type="button" className={btnPrimary} onClick={saveStory} disabled={loading || uploading}>
              {loading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-white/10 bg-[#111] p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Title">
              <input className={inputClass} value={detail.banner?.title || ''} onChange={(e) => patchDetail({ banner: { ...detail.banner, title: e.target.value } })} />
            </Field>
            <Field label="Subtitle / Accent">
              <input className={inputClass} value={detail.banner?.accent || ''} onChange={(e) => patchDetail({ banner: { ...detail.banner, accent: e.target.value } })} />
            </Field>
          </div>

          <Field label="Hero Images (Up to 3)">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[0, 1, 2].map((idx) => {
                const src = detail.banner?.images?.[idx] || ''
                return (
                  <div key={idx} className="space-y-2 rounded-lg border border-white/10 bg-black/40 p-2.5">
                    <MediaThumb src={src} className="h-24 w-full" />
                    <input
                      className={`${inputClass} text-[11px] py-1`}
                      placeholder={`Image ${idx + 1} URL`}
                      value={src}
                      onChange={(e) => {
                        const images = [...(detail.banner?.images || ['', '', ''])]
                        images[idx] = e.target.value
                        patchDetail({ banner: { ...detail.banner, images } })
                      }}
                    />
                    <label className="block text-center rounded border border-white/10 bg-white/5 py-1 text-[11px] text-white/70 hover:bg-white/10 cursor-pointer">
                      Upload
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="sr-only"
                        onChange={(e) => storeFile(e.target.files?.[0], (url) => {
                          const images = [...(detail.banner?.images || ['', '', ''])]
                          images[idx] = url
                          patchDetail({ banner: { ...detail.banner, images } })
                        })}
                      />
                    </label>
                  </div>
                )
              })}
            </div>
          </Field>

          <Field label="Introduction">
            <textarea
              className={inputClass}
              rows={3}
              value={detail.intro?.paragraph1 || ''}
              onChange={(e) => patchDetail({ intro: { ...detail.intro, paragraph1: e.target.value } })}
            />
          </Field>
        </div>
      </div>
    )
  }

  if (editingProject) {
    return (
      <div className="space-y-4 pb-20 text-white max-w-4xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-[12px] text-white/50 hover:text-white transition cursor-pointer"
              onClick={() => setEditingProject(null)}
            >
              ← Back to {editing?.name || 'page'}
            </button>
            <h1 className="text-[15px] font-semibold text-white">
              {isNewProject ? 'New Project' : 'Edit Project'}
            </h1>
            <span className="font-mono text-[11px] text-white/40">/project/{editingProject.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className={btnGhost} onClick={() => setEditingProject(null)}>Cancel</button>
            <button type="button" className={btnPrimary} onClick={saveProject}>Apply Changes</button>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-white/10 bg-[#111] p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Project Name">
              <input className={inputClass} value={editingProject.titlePre || ''} onChange={(e) => setEditingProject((p) => ({ ...p, titlePre: e.target.value }))} />
            </Field>
            <Field label="Location">
              <input className={inputClass} placeholder="e.g. Kolkata, India" value={editingProject.location || ''} onChange={(e) => setEditingProject((p) => ({ ...p, location: e.target.value }))} />
            </Field>
            <Field label="Type / Category">
              <input className={inputClass} placeholder="e.g. Commercial / Bar" value={editingProject.type || ''} onChange={(e) => setEditingProject((p) => ({ ...p, type: e.target.value }))} />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="City">
              <input className={inputClass} value={editingProject.city || ''} onChange={(e) => setEditingProject((p) => ({ ...p, city: e.target.value }))} />
            </Field>
            <Field label="Area / Dimensions">
              <input className={inputClass} placeholder="e.g. 4,500 sq ft" value={editingProject.area || ''} onChange={(e) => setEditingProject((p) => ({ ...p, area: e.target.value }))} />
            </Field>
          </div>

          <MediaPicker
            label="Cover Image"
            src={editingProject.image}
            onChange={(url) => setEditingProject((p) => ({ ...p, image: url }))}
            onFile={(file) => storeFile(file, (url) => setEditingProject((p) => ({ ...p, image: url })))}
          />

          <Field label="Summary">
            <textarea
              className={inputClass}
              rows={2}
              value={editingProject.description || ''}
              onChange={(e) => setEditingProject((p) => ({ ...p, description: e.target.value }))}
            />
          </Field>

          <Field label="Full Overview">
            <textarea
              className={inputClass}
              rows={4}
              value={editingProject.detail || ''}
              onChange={(e) => setEditingProject((p) => ({ ...p, detail: e.target.value }))}
            />
          </Field>
        </div>

        {/* Project Visuals */}
        <div className="space-y-3 rounded-xl border border-white/10 bg-[#111] p-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="text-[13px] font-semibold text-white">Project Gallery &amp; Visuals</h3>
            <button
              type="button"
              className="text-[12px] font-medium text-[#e3943f] hover:underline cursor-pointer"
              onClick={() => setEditingProject((p) => ({
                ...p,
                gallery: [...normalizeProjectVisuals(p.gallery), { id: uid('vis'), image: '', title: '', text: '', caption: '' }],
              }))}
            >
              + Add Visual
            </button>
          </div>
          {normalizeProjectVisuals(editingProject.gallery).length === 0 ? (
            <p className="py-4 text-center text-[12px] text-white/30">No visuals added yet.</p>
          ) : (
            <div className="space-y-3">
              {normalizeProjectVisuals(editingProject.gallery).map((visual, index) => (
                <div key={visual.id || index} className="space-y-2 rounded-lg border border-white/10 bg-black/30 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-white/40">Visual {index + 1}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="text-[11px] text-white/50 hover:text-white disabled:opacity-20 cursor-pointer"
                        disabled={index === 0}
                        onClick={() => {
                          const next = move(editingProject.gallery || [], index, -1)
                          setEditingProject((p) => ({ ...p, gallery: next }))
                        }}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="text-[11px] text-white/50 hover:text-white disabled:opacity-20 cursor-pointer"
                        disabled={index === (editingProject.gallery || []).length - 1}
                        onClick={() => {
                          const next = move(editingProject.gallery || [], index, 1)
                          setEditingProject((p) => ({ ...p, gallery: next }))
                        }}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className="text-[11px] text-red-400 hover:text-red-300 cursor-pointer"
                        onClick={() => {
                          const next = (editingProject.gallery || []).filter((_, i) => i !== index)
                          setEditingProject((p) => ({ ...p, gallery: next }))
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      className={inputClass}
                      placeholder="Title"
                      value={visual.title || ''}
                      onChange={(e) => patchVisual(index, { title: e.target.value })}
                    />
                    <input
                      className={inputClass}
                      placeholder="Caption"
                      value={visual.caption || ''}
                      onChange={(e) => patchVisual(index, { caption: e.target.value })}
                    />
                  </div>
                  <MediaPicker
                    src={visual.image}
                    onChange={(url) => patchVisual(index, { image: url })}
                    onFile={(file) => storeFile(file, (url) => patchVisual(index, { image: url }))}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-20 text-white">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-[18px] font-semibold text-white tracking-tight">{title}</h1>
          <p className="text-[12px] text-white/40">{intro}</p>
        </div>
        <div className="flex items-center gap-3">
          {livePath ? (
            <a
              href={livePath}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[12px] text-white/60 hover:text-[#e3943f] transition"
            >
              <span>View live</span>
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          ) : null}
          <button type="button" onClick={save} disabled={loading || uploading} className={btnPrimary}>
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {status === 'saved' ? (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-[12px] text-emerald-300">
          Changes saved successfully.
        </div>
      ) : null}
      {status === 'error' ? (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-[12px] text-red-300">
          {error || 'An error occurred while saving.'}
        </div>
      ) : null}
      {uploading ? (
        <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[12px] text-white/60">
          Uploading file…
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] gap-6">
        {/* Left Sidebar */}
        <aside className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Pages</span>
            <button
              type="button"
              className="text-[11px] font-medium text-[#e3943f] hover:underline cursor-pointer"
              onClick={addCategory}
            >
              + Add
            </button>
          </div>

          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 text-[12px] text-white placeholder:text-white/25 outline-none focus:border-[#e3943f]"
          />

          <div className="space-y-1">
            {filteredCategories.map((item, index) => {
              const isSelected = category?.id === item.id
              const subCount = (item.subcategories || []).length
              return (
                <div key={item.id} className="space-y-0.5">
                  <div
                    onClick={() => selectCategory(item.id)}
                    className={`group flex items-center justify-between rounded-lg px-2.5 py-2 text-[12.5px] cursor-pointer transition ${
                      isSelected && !subcategory
                        ? 'bg-white/10 font-semibold text-white'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{item.name || 'Untitled'}</span>
                    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100">
                      {subCount ? <span className="text-[10px] text-white/30">{subCount}</span> : null}
                    </div>
                  </div>

                  {isSelected ? (
                    <div className="ml-3 space-y-0.5 border-l border-white/10 pl-2 py-0.5">
                      <button
                        type="button"
                        onClick={() => selectSub('')}
                        className={`block w-full text-left truncate rounded px-2 py-1 text-[11.5px] cursor-pointer transition ${
                          !subcategory ? 'font-medium text-[#e3943f]' : 'text-white/40 hover:text-white'
                        }`}
                      >
                        Main Page
                      </button>
                      {subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => selectSub(sub.id)}
                          className={`block w-full text-left truncate rounded px-2 py-1 text-[11.5px] cursor-pointer transition ${
                            subcategory?.id === sub.id ? 'font-medium text-[#e3943f]' : 'text-white/40 hover:text-white'
                          }`}
                        >
                          {sub.name || 'Untitled'}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={addSubcategory}
                        className="block px-2 py-1 text-[11px] text-[#e3943f] hover:underline cursor-pointer"
                      >
                        + Add Subpage
                      </button>

                      <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => setTree({ categories: move(categories, index, -1) })}
                          className="text-[10px] text-white/40 hover:text-white disabled:opacity-20 cursor-pointer"
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          disabled={index === categories.length - 1}
                          onClick={() => setTree({ categories: move(categories, index, 1) })}
                          className="text-[10px] text-white/40 hover:text-white disabled:opacity-20 cursor-pointer"
                        >
                          Down
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteCategory(item)}
                          className="text-[10px] text-red-400 hover:text-red-300 ml-auto cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </aside>

        {/* Right Content Editor */}
        <div className="space-y-4">
          {editing ? (
            <>
              {/* Clean Tabs */}
              <div className="flex items-center gap-1 border-b border-white/10">
                {[
                  { id: 'page', label: 'Content & Hero' },
                  { id: 'menu', label: 'Navigation & URL' },
                  {
                    id: 'projects',
                    label: isAllProjects
                      ? `Projects (${collectedProjectCount})`
                      : `Projects (${projects.length})`,
                  },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`border-b-2 px-3 py-2 text-[12.5px] font-medium transition cursor-pointer ${
                      tab === t.id
                        ? 'border-[#e3943f] text-[#e3943f]'
                        : 'border-transparent text-white/50 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* TAB: CONTENT & HERO */}
              {tab === 'page' ? (
                <div className="space-y-4">
                  {/* Hero Banner */}
                  <div className="space-y-3 rounded-xl border border-white/10 bg-[#111] p-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <h3 className="text-[13px] font-semibold text-white">Hero Banner</h3>
                      <BlockToggle checked={Boolean(page.banner?.show)} onChange={(show) => patchPage('banner', { ...(page.banner || {}), show })} />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Title">
                        <input className={inputClass} value={page.banner?.title || ''} onChange={(e) => patchPage('banner', { ...(page.banner || {}), title: e.target.value })} />
                      </Field>
                      <Field label="Category / Label">
                        <input className={inputClass} value={page.banner?.label || ''} onChange={(e) => patchPage('banner', { ...(page.banner || {}), label: e.target.value })} />
                      </Field>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Accent Text">
                        <input className={inputClass} value={page.banner?.accent || ''} onChange={(e) => patchPage('banner', { ...(page.banner || {}), accent: e.target.value })} />
                      </Field>
                      <Field label="Clickable Project URL" hint="Opens project on hero click">
                        <input
                          className={inputClass}
                          placeholder="/project/..."
                          value={page.banner?.link || ''}
                          onChange={(e) => patchPage('banner', { ...(page.banner || {}), link: e.target.value })}
                        />
                      </Field>
                    </div>

                    <Field label="Subtitle">
                      <textarea
                        className={inputClass}
                        rows={2}
                        value={page.banner?.subtitle || ''}
                        onChange={(e) => patchPage('banner', { ...(page.banner || {}), subtitle: e.target.value })}
                      />
                    </Field>

                    {/* 3 Images Grid */}
                    <Field label="Hero Images (Up to 3)">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[0, 1, 2].map((idx) => {
                          const src = page.banner?.images?.[idx] || ''
                          return (
                            <div key={idx} className="space-y-2 rounded-lg border border-white/10 bg-black/40 p-2.5">
                              <MediaThumb src={src} className="h-24 w-full" />
                              <input
                                className={`${inputClass} text-[11px] py-1`}
                                placeholder={`Image ${idx + 1} URL`}
                                value={src}
                                onChange={(e) => {
                                  const images = [...(page.banner?.images || ['', '', ''])]
                                  images[idx] = e.target.value
                                  patchPage('banner', { ...(page.banner || {}), images })
                                }}
                              />
                              <label className="block text-center rounded border border-white/10 bg-white/5 py-1 text-[11px] text-white/70 hover:bg-white/10 cursor-pointer">
                                Upload
                                <input
                                  type="file"
                                  accept="image/*,video/*"
                                  className="sr-only"
                                  onChange={(e) =>
                                    storeFile(e.target.files?.[0], (url) => {
                                      const images = [...(page.banner?.images || ['', '', ''])]
                                      images[idx] = url
                                      patchPage('banner', { ...(page.banner || {}), images })
                                    })
                                  }
                                />
                              </label>
                            </div>
                          )
                        })}
                      </div>
                    </Field>
                  </div>

                  {/* Intro Text */}
                  <div className="space-y-3 rounded-xl border border-white/10 bg-[#111] p-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <h3 className="text-[13px] font-semibold text-white">Introduction</h3>
                      <BlockToggle checked={Boolean(page.intro?.show)} onChange={(show) => patchPage('intro', { ...(page.intro || {}), show })} />
                    </div>
                    <Field label="Heading">
                      <input className={inputClass} value={page.intro?.heading || ''} onChange={(e) => patchPage('intro', { ...(page.intro || {}), heading: e.target.value })} />
                    </Field>
                    <Field label="Paragraph">
                      <textarea className={inputClass} rows={3} value={page.intro?.paragraph1 || ''} onChange={(e) => patchPage('intro', { ...(page.intro || {}), paragraph1: e.target.value })} />
                    </Field>
                  </div>

                  {/* Highlights / Story Cards */}
                  <RepeatBlock
                    title={isPortfolio ? 'Story Cards' : 'Highlights'}
                    show={Boolean(page.highlights?.show)}
                    onShow={(show) => patchPage('highlights', { ...(page.highlights || {}), show })}
                    items={page.highlights?.items || []}
                    onItems={(items) => patchPage('highlights', { ...(page.highlights || {}), items })}
                    blank={() => ({
                      id: uid('card'),
                      title: '',
                      text: '',
                      image: '',
                      slug: '',
                      published: true,
                      detail: emptyHighlightDetail(),
                    })}
                    render={(item, update) => (
                      <>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <input className={inputClass} placeholder="Card title" value={item.title || ''} onChange={(e) => update({ title: e.target.value, slug: item.slug || slugify(e.target.value) })} />
                          <input className={inputClass} placeholder="Slug" value={item.slug || ''} onChange={(e) => update({ slug: slugify(e.target.value) })} />
                        </div>
                        <textarea className={inputClass} rows={2} placeholder="Description" value={item.text || ''} onChange={(e) => update({ text: e.target.value })} />
                        <MediaPicker src={item.image} onChange={(url) => update({ image: url })} onFile={(file) => storeFile(file, (url) => update({ image: url }))} />
                        <div className="flex items-center justify-between pt-1">
                          <BlockToggle checked={item.published !== false} onChange={(published) => update({ published })} label="Published" />
                          <button
                            type="button"
                            className="text-[11.5px] font-medium text-[#e3943f] hover:underline cursor-pointer"
                            onClick={() => setEditingHighlight(normalizeHighlightItem(item, 0, reservedHighlightSlugs, new Set()))}
                          >
                            Edit Page Details →
                          </button>
                        </div>
                      </>
                    )}
                  />

                  {/* Process Steps */}
                  <RepeatBlock
                    title="Process Steps"
                    show={Boolean(page.steps?.show)}
                    onShow={(show) => patchPage('steps', { ...(page.steps || {}), show })}
                    items={page.steps?.items || []}
                    onItems={(items) => patchPage('steps', { ...(page.steps || {}), items })}
                    blank={() => ({ id: uid('step'), number: '', title: '', text: '' })}
                    render={(item, update) => (
                      <>
                        <div className="grid gap-2 sm:grid-cols-3">
                          <input className={inputClass} placeholder="01" value={item.number || ''} onChange={(e) => update({ number: e.target.value })} />
                          <input className={`${inputClass} sm:col-span-2`} placeholder="Step title" value={item.title || ''} onChange={(e) => update({ title: e.target.value })} />
                        </div>
                        <textarea className={inputClass} rows={2} placeholder="Description" value={item.text || ''} onChange={(e) => update({ text: e.target.value })} />
                      </>
                    )}
                  />

                  {/* Gallery */}
                  <RepeatBlock
                    title="Gallery"
                    show={Boolean(page.gallery?.show)}
                    onShow={(show) => patchPage('gallery', { ...(page.gallery || {}), show })}
                    items={page.gallery?.items || []}
                    onItems={(items) => patchPage('gallery', { ...(page.gallery || {}), items })}
                    blank={() => ({
                      id: uid('photo'),
                      image: '',
                      caption: '',
                      title: '',
                      slug: '',
                      published: true,
                      detail: emptyHighlightDetail(),
                    })}
                    render={(item, update) => (
                      <>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <input className={inputClass} placeholder="Title" value={item.title || ''} onChange={(e) => update({ title: e.target.value, slug: item.slug || slugify(e.target.value) })} />
                          <input className={inputClass} placeholder="Caption" value={item.caption || ''} onChange={(e) => update({ caption: e.target.value, title: item.title || e.target.value, slug: item.slug || slugify(e.target.value) })} />
                        </div>
                        <MediaPicker src={item.image} onChange={(url) => update({ image: url })} onFile={(file) => storeFile(file, (url) => update({ image: url }))} />
                        <div className="flex items-center justify-between pt-1">
                          <BlockToggle checked={item.published !== false} onChange={(published) => update({ published })} label="Published" />
                          <button
                            type="button"
                            className="text-[11.5px] font-medium text-[#e3943f] hover:underline cursor-pointer"
                            onClick={() => setEditingGallery(normalizeGalleryItem(item, 0, reservedGallerySlugs, new Set()))}
                          >
                            Edit Page Details →
                          </button>
                        </div>
                      </>
                    )}
                  />

                  {/* Closing CTA */}
                  <div className="space-y-3 rounded-xl border border-white/10 bg-[#111] p-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <h3 className="text-[13px] font-semibold text-white">Call to Action</h3>
                      <BlockToggle checked={Boolean(page.closing?.show)} onChange={(show) => patchPage('closing', { ...(page.closing || {}), show })} />
                    </div>
                    <Field label="Heading">
                      <input className={inputClass} value={page.closing?.heading || ''} onChange={(e) => patchPage('closing', { ...(page.closing || {}), heading: e.target.value })} />
                    </Field>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Button Label">
                        <input className={inputClass} value={page.closing?.buttonLabel || ''} onChange={(e) => patchPage('closing', { ...(page.closing || {}), buttonLabel: e.target.value })} />
                      </Field>
                      <Field label="Button Link">
                        <input className={inputClass} value={page.closing?.buttonLink || ''} onChange={(e) => patchPage('closing', { ...(page.closing || {}), buttonLink: e.target.value })} />
                      </Field>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* TAB: NAVIGATION & URL */}
              {tab === 'menu' ? (
                <div className="space-y-4 rounded-xl border border-white/10 bg-[#111] p-4">
                  <Field label="Page Name">
                    <input
                      className={inputClass}
                      value={editing.name}
                      onChange={(e) => {
                        const name = e.target.value
                        const nextSlug = editing.slug || slugify(name)
                        const patch = { name, slug: nextSlug }
                        if (isPortfolio && !subcategory) patch.href = portfolioCategoryPath({ slug: nextSlug })
                        patchEditing(patch)
                      }}
                    />
                  </Field>

                  <Field label="URL Slug" hint="Web path">
                    <input
                      className={inputClass}
                      value={editing.slug}
                      onChange={(e) => {
                        const nextSlug = slugify(e.target.value)
                        const patch = { slug: nextSlug }
                        if (isPortfolio && !subcategory) patch.href = portfolioCategoryPath({ slug: nextSlug })
                        patchEditing(patch)
                      }}
                    />
                  </Field>

                  <Field label="Menu Description">
                    <input className={inputClass} value={editing.menuDescription || ''} onChange={(e) => patchEditing({ menuDescription: e.target.value })} />
                  </Field>

                  <MediaPicker
                    label="Menu Thumbnail"
                    src={editing.menuImage}
                    onChange={(url) => patchEditing({ menuImage: url })}
                    onFile={(file) => storeFile(file, (url) => patchEditing({ menuImage: url }))}
                  />

                  <div className="flex items-center gap-6 pt-3 border-t border-white/10">
                    <BlockToggle checked={editing.published !== false} onChange={(published) => patchEditing({ published })} label="Published" />
                    <BlockToggle checked={editing.showInMenu !== false} onChange={(showInMenu) => patchEditing({ showInMenu })} label="Show in header menu" />
                  </div>
                </div>
              ) : null}

              {/* TAB: PROJECTS */}
              {tab === 'projects' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[13px] font-semibold text-white">Projects</h3>
                      <p className="text-[11.5px] text-white/40">
                        {isAllProjects ? 'Aggregated across all sections.' : 'Projects displayed on this page.'}
                      </p>
                    </div>
                    {!isAllProjects ? (
                      <button
                        type="button"
                        className={btnPrimary}
                        onClick={() => {
                          setIsNewProject(true)
                          setEditingProject(hydrateProjectForEdit(blankProject(editing.name)))
                        }}
                      >
                        + Add Project
                      </button>
                    ) : null}
                  </div>

                  {projects.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-[12px] text-white/35">
                      No projects here yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {projects.map((project, index) => (
                        <div
                          key={project.id || index}
                          className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#111] p-3 hover:border-white/20 transition"
                        >
                          <MediaThumb src={project.image} className="h-14 w-20 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-[13px] font-semibold text-white truncate">
                              {project.titlePre || 'Untitled'}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-white/40 truncate">
                              {project.location ? <span>{project.location}</span> : null}
                              {project.type ? <span>• {project.type}</span> : null}
                              <span className="font-mono text-white/25">/project/{project.id}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => patchEditing({ projects: move(projects, index, -1) })}
                              className="rounded p-1 text-white/40 hover:text-white disabled:opacity-20 cursor-pointer"
                              title="Move up"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              disabled={index === projects.length - 1}
                              onClick={() => patchEditing({ projects: move(projects, index, 1) })}
                              className="rounded p-1 text-white/40 hover:text-white disabled:opacity-20 cursor-pointer"
                              title="Move down"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              className={btnGhost}
                              onClick={() => {
                                setIsNewProject(false)
                                setEditingProject(hydrateProjectForEdit(project))
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete project "${project.titlePre || project.id}"?`)) {
                                  patchEditing({ projects: projects.filter((item) => item.id !== project.id) })
                                }
                              }}
                              className="rounded p-1.5 text-red-400/70 hover:text-red-300 cursor-pointer"
                              title="Delete"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 p-12 text-center text-[12px] text-white/30">
              Select a page from the sidebar to view and edit its contents.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function RepeatBlock({ title, show, onShow, items, onItems, blank, render }) {
  const list = items || []
  const updateAt = (index, patch) => {
    onItems(list.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)))
  }
  return (
    <div className="space-y-3 rounded-xl border border-white/10 bg-[#111] p-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <h3 className="text-[13px] font-semibold text-white">{title}</h3>
        <BlockToggle checked={show} onChange={onShow} />
      </div>
      {list.length === 0 ? (
        <p className="py-2 text-[12px] text-white/30">None added yet.</p>
      ) : null}
      <div className="space-y-2">
        {list.map((item, index) => (
          <div key={item.id || index} className="space-y-2 rounded-lg border border-white/10 bg-black/30 p-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-white/40">#{index + 1}</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="text-[11px] text-white/40 hover:text-white disabled:opacity-20 cursor-pointer"
                  onClick={() => onItems(move(list, index, -1))}
                  disabled={index === 0}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="text-[11px] text-white/40 hover:text-white disabled:opacity-20 cursor-pointer"
                  onClick={() => onItems(move(list, index, 1))}
                  disabled={index === list.length - 1}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="text-[11px] text-red-400 hover:text-red-300 ml-1 cursor-pointer"
                  onClick={() => onItems(list.filter((_, itemIndex) => itemIndex !== index))}
                >
                  Remove
                </button>
              </div>
            </div>
            {render(item, (patch) => updateAt(index, patch))}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onItems([...list, blank()])}
        className="text-[12px] font-medium text-[#e3943f] hover:underline cursor-pointer"
      >
        + Add Item
      </button>
    </div>
  )
}

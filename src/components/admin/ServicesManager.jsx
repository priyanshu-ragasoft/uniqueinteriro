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
    reader.onerror = () => reject(new Error('Could not read that file'))
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
  if (!res.ok || !data.url) throw new Error(data.message || 'Upload failed. Try a smaller file.')
  return data.url
}

const inputClass =
  'w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-[13px] text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#e3943f]'
const fileClass =
  'block w-full text-[12px] text-white/60 file:mr-3 file:rounded-lg file:border-0 file:bg-[#e3943f] file:px-3 file:py-1.5 file:text-[12px] file:font-semibold file:text-black'
const btnGhost =
  'rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[12px] font-semibold text-white/80 hover:bg-white/[0.08] hover:text-white disabled:opacity-40'
const btnPrimary =
  'rounded-xl bg-gradient-to-r from-[#e3943f] to-[#d68532] px-5 py-2.5 text-[13px] font-semibold text-black shadow-md shadow-[#e3943f]/25 disabled:opacity-50'

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-white/70">{label}</span>
      {hint ? <p className="mb-2 text-[12px] leading-relaxed text-white/40">{hint}</p> : null}
      {children}
    </label>
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

function MediaPicker({ src, onChange, onFile, label = 'Photo or video' }) {
  return (
    <div className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-white/70">{label}</span>
      <div className="flex items-start gap-3">
        <MediaThumb src={src} />
        <div className="min-w-0 flex-1 space-y-2">
          <input
            className={inputClass}
            placeholder="Or paste a photo / video link"
            value={src || ''}
            onChange={(event) => onChange(event.target.value)}
          />
          <label className="inline-flex cursor-pointer items-center rounded-xl bg-[#e3943f] px-4 py-2 text-[13px] font-semibold text-black">
            Upload photo or video
            <input
              type="file"
              accept="image/*,video/mp4,video/webm,video/ogg,.mov"
              className="sr-only"
              onChange={(event) => {
                onFile(event.target.files?.[0])
                event.target.value = ''
              }}
            />
          </label>
        </div>
      </div>
    </div>
  )
}

function MediaThumb({ src }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [src])
  if (!src) {
    return (
      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-dashed border-white/15 bg-black/40 text-center text-[10px] text-white/35">
        No preview
      </div>
    )
  }
  return (
    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black">
      {failed ? (
        <span className="px-2 text-center text-[10px] text-white/40">Preview unavailable</span>
      ) : isVideoSource(src) ? (
        <video src={src} muted playsInline preload="metadata" className="h-full w-full object-contain" onError={() => setFailed(true)} />
      ) : (
        <img src={src} alt="" className="h-full w-full object-contain" onError={() => setFailed(true)} />
      )}
    </div>
  )
}

function BlockToggle({ checked, onChange }) {
  return (
    <label className="inline-flex items-center gap-2 text-[12px] text-white/70">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      Show on page
    </label>
  )
}

function visualSrc(item) {
  if (!item) return ''
  if (typeof item === 'string') return item
  return String(item.image || item.src || item.url || '').trim()
}

function isPlaceholderTitle(title) {
  return !String(title || '').trim() || /^visual\s*\d+$/i.test(String(title).trim())
}

function titleFromFile(src) {
  const raw = String(src || '').split(/[?#]/)[0]
  if (!raw) return ''
  let name = raw.split('/').pop() || ''
  try {
    name = decodeURIComponent(name)
  } catch {
    /* keep encoded */
  }
  name = name.replace(/\.[a-z0-9]{2,5}$/i, '').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
  name = name.replace(/\s+\d+$/g, '').trim()
  if (!name || name.length < 4 || name.length > 72) return ''
  if (/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(name.replace(/\s+/g, '-'))) return ''
  if (/^[0-9a-f]{8}\b/i.test(name)) return ''
  if (/^[a-z]\d{0,2}$/i.test(name)) return ''
  return name
    .split(' ')
    .filter(Boolean)
    .map((word, index) => {
      if (index > 0 && /^(and|of|in|to|a|the)$/i.test(word)) return word.toLowerCase()
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

function packProjectVisual(visual) {
  const image = visualSrc(visual)
  const title = String(visual?.title || '').trim()
  const text = String(visual?.text || visual?.description || '').trim()
  const caption = String(visual?.caption || '').trim()
  return {
    id: visual?.id || '',
    image,
    title,
    text,
    description: text,
    caption,
  }
}

function normalizeProjectVisuals(gallery, { keepEmpty = true } = {}) {
  const list = (Array.isArray(gallery) ? gallery : []).map((item, index) => {
    const image = visualSrc(item)
    const raw = item && typeof item === 'object' ? item : {}
    const rawTitle = String(raw.title || raw.tocTitle || raw.label || '').trim()
    const fromFile = titleFromFile(image)
    const title = !isPlaceholderTitle(rawTitle) ? rawTitle : fromFile || (image ? `Visual ${index + 1}` : '')
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
  hoverNote = 'Small picture shown in the website menu. Page banner is set in Page content.',
  intro = 'Pick a page on the left. Edit only that page, then Save.',
  onEditingChange,
}) {
  const [tree, setTree] = useState(() => readTree())
  const [tab, setTab] = useState(() => (String(endpoint || '').includes('portfolio-pages') ? 'page' : 'menu'))
  const [categoryId, setCategoryId] = useState(
    () => firstUsefulCategory(readTree().categories, String(endpoint || '').includes('portfolio-pages'))?.id || ''
  )
  const [subId, setSubId] = useState('')
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
      setError(err.message || 'Upload failed. Try again with a smaller photo or video.')
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
    const timer = setTimeout(() => setStatus(null), 3500)
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
    if (JSON.stringify(nextTree).includes('data:')) {
      setError('A photo or video is still waiting to upload. Choose the file again, wait for upload, then Save.')
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
            page: normalizeServicePage(
              cat.page,
              (cat.subcategories || []).map((sub) => sub.slug || sub.id)
            ),
            subcategories: (cat.subcategories || []).map((sub) => ({
              ...sub,
              page: normalizeServicePage(sub.page),
            })),
          })),
        }
      }
      if (isPortfolio) {
        const slugs = (payload.categories || []).map((item) => item.slug)
        const remoteRes = await fetch(endpoint)
        const remoteData = await remoteRes.json().catch(() => ({}))
        const extras = (remoteData?.data?.categories || []).filter(
          (item) =>
            ['residences', 'hospitality', 'nightlife'].includes(item.slug) && !slugs.includes(item.slug)
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
        setError(data.message || 'Could not save. Check your login and try again.')
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
      window.alert(`“${item.name}” can be hidden from the website menu, but this section stays in the list.`)
      return
    }
    if (!window.confirm(`Delete “${item.name}” and its sub pages and projects? This saves immediately.`)) return
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
    if (!window.confirm(`Delete “${item.name}”? The main section page stays as it is.`)) return
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
    const slug = `new-category-${tree.categories.length + 1}`
    const item = {
      id: uid('cat'),
      name: isPortfolio ? 'New section' : 'New category',
      slug,
      menuDescription: '',
      menuImage: '',
      menuVideo: '',
      published: true,
      showInMenu: true,
      order: tree.categories.length,
      page: emptyPage({ banner: { title: 'New category' } }),
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
      name: isPortfolio ? 'New sub page' : 'New subcategory',
      slug: `new-page-${(category.subcategories || []).length + 1}`,
      menuDescription: '',
      menuImage: category.menuImage || '',
      menuVideo: '',
      published: true,
      showInMenu: true,
      order: (category.subcategories || []).length,
      page: emptyPage({ banner: { title: 'New subcategory' } }),
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
        const writePage = (page) => {
          const items = (page?.highlights?.items || []).map((entry) => (entry.id === nextItem.id ? nextItem : entry))
          return { ...page, highlights: { ...(page?.highlights || {}), items } }
        }
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
    const used = new Set((page.gallery?.items || []).filter((entry) => entry.id !== item.id).map((entry) => entry.slug).filter(Boolean))
    const nextItem = normalizeGalleryItem(item, 0, reservedGallerySlugs, used)
    const nextTree = {
      categories: tree.categories.map((cat) => {
        if (cat.id !== category?.id) return cat
        const writePage = (currentPage) => {
          const items = (currentPage?.gallery?.items || []).map((entry) => (entry.id === nextItem.id ? nextItem : entry))
          return { ...currentPage, gallery: { ...(currentPage?.gallery || {}), items } }
        }
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
    const liveHref = category
      ? storyKind === 'gallery'
        ? isPortfolio
          ? portfolioGalleryPath(category, subcategory, editingStory)
          : serviceGalleryPath(category, subcategory, editingStory)
        : isPortfolio
          ? portfolioHighlightPath(category, subcategory, editingStory)
          : serviceHighlightPath(category, subcategory, editingStory)
      : ''
    const detail = emptyHighlightDetail(editingStory.detail)
    const patchDetail = (patch) => setStory((current) => ({ ...current, detail: { ...emptyHighlightDetail(current.detail), ...patch } }))
    return (
      <div className="space-y-5 pb-24 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <button type="button" className="mb-2 text-[12px] text-white/50 hover:text-[#e3943f]" onClick={() => setStory(null)}>
              ‹ Back to {editing?.name || 'page'}
            </button>
            <h1 className="text-[20px] font-semibold">
              {storyKind === 'gallery' ? 'Add gallery photos & text' : 'Add photos & text'}
            </h1>
            <p className="mt-1 text-[13px] text-white/50">
              Fill the banner, text, extra photos, then Save to website. This becomes {liveHref || 'the card page'}.
            </p>
          </div>
          <div className="flex gap-2">
            <button type="button" className={btnGhost} onClick={() => setStory(null)}>Cancel</button>
            <button type="button" className={btnPrimary} onClick={saveStory} disabled={loading || uploading}>
              {loading ? 'Saving…' : 'Save to website'}
            </button>
          </div>
        </div>
        {uploading ? <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[13px]">Uploading…</p> : null}
        <article className="space-y-3 rounded-2xl border border-white/10 bg-[#121212] p-5">
          <Field label="Page title">
            <input className={inputClass} value={detail.banner?.title || ''} onChange={(e) => patchDetail({ banner: { ...detail.banner, title: e.target.value } })} />
          </Field>
          <Field label="Accent line">
            <input className={inputClass} value={detail.banner?.accent || ''} onChange={(e) => patchDetail({ banner: { ...detail.banner, accent: e.target.value } })} />
          </Field>
          <Field label="Small label">
            <input className={inputClass} value={detail.banner?.label || ''} onChange={(e) => patchDetail({ banner: { ...detail.banner, label: e.target.value } })} />
          </Field>
          <Field label="Subtitle">
            <textarea className={inputClass} rows={3} value={detail.banner?.subtitle || ''} onChange={(e) => patchDetail({ banner: { ...detail.banner, subtitle: e.target.value } })} />
          </Field>
          {[0, 1, 2].map((index) => {
            const src = detail.banner?.images?.[index] || ''
            return (
              <Field key={index} label={`Banner photo / video ${index + 1}`}>
                <div className="flex items-center gap-3">
                  <MediaThumb src={src} />
                  <div className="min-w-0 flex-1 space-y-2">
          <input
            className={inputClass}
                      value={src}
                      onChange={(e) => {
                        const images = [...(detail.banner?.images || ['', '', ''])]
                        images[index] = e.target.value
                        patchDetail({ banner: { ...detail.banner, images } })
                      }}
                    />
                    <input type="file" accept="image/*,video/*" className={fileClass} onChange={(e) => storeFile(e.target.files?.[0], (url) => {
                      const images = [...(detail.banner?.images || ['', '', ''])]
                      images[index] = url
                      patchDetail({ banner: { ...detail.banner, images } })
                    })} />
                  </div>
                </div>
        </Field>
            )
          })}
        </article>
        <article className="space-y-3 rounded-2xl border border-white/10 bg-[#121212] p-5">
          <h3 className="font-bold">Intro</h3>
          <Field label="Heading"><input className={inputClass} value={detail.intro?.heading || ''} onChange={(e) => patchDetail({ intro: { ...detail.intro, heading: e.target.value } })} /></Field>
          <Field label="Paragraph"><textarea className={inputClass} rows={3} value={detail.intro?.paragraph1 || ''} onChange={(e) => patchDetail({ intro: { ...detail.intro, paragraph1: e.target.value } })} /></Field>
          <Field label="Second paragraph"><textarea className={inputClass} rows={3} value={detail.intro?.paragraph2 || ''} onChange={(e) => patchDetail({ intro: { ...detail.intro, paragraph2: e.target.value } })} /></Field>
        </article>
        <article className="space-y-3 rounded-2xl border border-white/10 bg-[#121212] p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Story sections</h3>
            <button
              type="button"
              className="text-[12px] font-bold text-[#e3943f]"
              onClick={() => patchDetail({ sections: [...(detail.sections || []), { id: uid('sec'), title: 'New section', text: '', media: '', caption: '' }] })}
            >
              + Add section
            </button>
          </div>
          {(detail.sections || []).map((section, index) => (
            <div key={section.id || index} className="space-y-2 rounded-xl border border-white/10 p-3">
              <input className={inputClass} placeholder="Section title" value={section.title || ''} onChange={(e) => {
                const sections = [...(detail.sections || [])]
                sections[index] = { ...sections[index], title: e.target.value }
                patchDetail({ sections })
              }} />
              <textarea className={inputClass} rows={2} placeholder="Text" value={section.text || ''} onChange={(e) => {
                const sections = [...(detail.sections || [])]
                sections[index] = { ...sections[index], text: e.target.value }
                patchDetail({ sections })
              }} />
              <MediaPicker
                src={section.media}
                onChange={(value) => {
                  const sections = [...(detail.sections || [])]
                  sections[index] = { ...sections[index], media: value }
                  patchDetail({ sections })
                }}
                onFile={(file) => storeFile(file, (url) => {
                  const sections = [...(detail.sections || [])]
                  sections[index] = { ...sections[index], media: url }
                  patchDetail({ sections })
                })}
              />
              <input className={inputClass} placeholder="Caption" value={section.caption || ''} onChange={(e) => {
                const sections = [...(detail.sections || [])]
                sections[index] = { ...sections[index], caption: e.target.value }
                patchDetail({ sections })
              }} />
              <button type="button" className="text-[11px] text-red-300" onClick={() => patchDetail({ sections: (detail.sections || []).filter((_, i) => i !== index) })}>Remove</button>
            </div>
          ))}
        </article>
        <article className="space-y-3 rounded-2xl border border-white/10 bg-[#121212] p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Gallery</h3>
            <button
              type="button"
              className="text-[12px] font-bold text-[#e3943f]"
              onClick={() => patchDetail({ gallery: [...(detail.gallery || []), { id: uid('photo'), image: '', caption: '' }] })}
            >
              + Add photo
            </button>
          </div>
          {(detail.gallery || []).map((item, index) => (
            <div key={item.id || index} className="space-y-2 rounded-xl border border-white/10 p-3">
              <div className="flex items-center gap-3">
                <MediaThumb src={item.image} />
                <div className="min-w-0 flex-1 space-y-2">
                  <input className={inputClass} value={item.image || ''} onChange={(e) => {
                    const gallery = [...(detail.gallery || [])]
                    gallery[index] = { ...gallery[index], image: e.target.value }
                    patchDetail({ gallery })
                  }} />
                  <input type="file" accept="image/*,video/*" className={fileClass} onChange={(e) => storeFile(e.target.files?.[0], (url) => {
                    const gallery = [...(detail.gallery || [])]
                    gallery[index] = { ...gallery[index], image: url }
                    patchDetail({ gallery })
                  })} />
                </div>
              </div>
              <input className={inputClass} placeholder="Caption" value={item.caption || ''} onChange={(e) => {
                const gallery = [...(detail.gallery || [])]
                gallery[index] = { ...gallery[index], caption: e.target.value }
                patchDetail({ gallery })
              }} />
              <button type="button" className="text-[11px] text-red-300" onClick={() => patchDetail({ gallery: (detail.gallery || []).filter((_, i) => i !== index) })}>Remove</button>
            </div>
          ))}
        </article>
        <article className="space-y-3 rounded-2xl border border-white/10 bg-[#121212] p-5">
          <h3 className="font-bold">Closing note</h3>
          <Field label="Heading"><input className={inputClass} value={detail.closing?.heading || ''} onChange={(e) => patchDetail({ closing: { ...detail.closing, heading: e.target.value } })} /></Field>
          <Field label="Paragraph"><textarea className={inputClass} rows={3} value={detail.closing?.paragraph || ''} onChange={(e) => patchDetail({ closing: { ...detail.closing, paragraph: e.target.value } })} /></Field>
          <Field label="Button label"><input className={inputClass} value={detail.closing?.buttonLabel || ''} onChange={(e) => patchDetail({ closing: { ...detail.closing, buttonLabel: e.target.value } })} /></Field>
          <Field label="Button link"><input className={inputClass} value={detail.closing?.buttonLink || ''} onChange={(e) => patchDetail({ closing: { ...detail.closing, buttonLink: e.target.value } })} /></Field>
        </article>
        <div className="flex gap-2">
          <button type="button" className={btnGhost} onClick={() => setStory(null)}>Cancel</button>
          <button type="button" className={btnPrimary} onClick={saveStory} disabled={loading || uploading}>
              {loading ? 'Saving…' : 'Save to website'}
          </button>
        </div>
      </div>
    )
  }

  if (editingProject) {
    return (
      <div className="space-y-5 pb-24 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <button type="button" className="mb-2 text-[12px] text-white/50 hover:text-[#e3943f]" onClick={() => setEditingProject(null)}>
              ‹ Back to {editing?.name || 'page'}
            </button>
            <h1 className="text-[20px] font-semibold">{isNewProject ? 'Add project' : 'Edit project'}</h1>
            <p className="mt-1 text-[13px] text-white/50">This card opens /project/{editingProject.id} on the website.</p>
          </div>
          <div className="flex gap-2">
            <button type="button" className={btnGhost} onClick={() => setEditingProject(null)}>Cancel</button>
            <button type="button" className={btnPrimary} onClick={saveProject}>Save on this page</button>
          </div>
        </div>
        {uploading ? <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[13px]">Uploading…</p> : null}
        <article className="space-y-3 rounded-2xl border border-white/10 bg-[#121212] p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Title">
              <input className={inputClass} value={editingProject.titlePre || ''} onChange={(e) => setEditingProject((p) => ({ ...p, titlePre: e.target.value }))} />
        </Field>
            <Field label="Location">
              <input className={`${inputClass} text-[#e3943f]`} value={editingProject.location || ''} onChange={(e) => setEditingProject((p) => ({ ...p, location: e.target.value }))} />
            </Field>
            <Field label="Title end">
              <input className={inputClass} value={editingProject.titlePost || ''} onChange={(e) => setEditingProject((p) => ({ ...p, titlePost: e.target.value }))} />
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="City"><input className={inputClass} value={editingProject.city || ''} onChange={(e) => setEditingProject((p) => ({ ...p, city: e.target.value }))} /></Field>
            <Field label="Country"><input className={inputClass} value={editingProject.country || ''} onChange={(e) => setEditingProject((p) => ({ ...p, country: e.target.value }))} /></Field>
            <Field label="Type"><input className={inputClass} value={editingProject.type || ''} onChange={(e) => setEditingProject((p) => ({ ...p, type: e.target.value }))} /></Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Area"><input className={inputClass} value={editingProject.area || ''} onChange={(e) => setEditingProject((p) => ({ ...p, area: e.target.value }))} /></Field>
            <Field label="Materials"><input className={inputClass} value={editingProject.tone || ''} onChange={(e) => setEditingProject((p) => ({ ...p, tone: e.target.value }))} /></Field>
          </div>
          <Field label="Short description">
            <textarea className={inputClass} rows={3} value={editingProject.description || ''} onChange={(e) => setEditingProject((p) => ({ ...p, description: e.target.value }))} />
          </Field>
          <Field label="Full detail">
            <textarea className={inputClass} rows={4} value={editingProject.detail || ''} onChange={(e) => setEditingProject((p) => ({ ...p, detail: e.target.value }))} />
          </Field>
          <Field label="Features (one per line)">
            <textarea
            className={inputClass}
              rows={3}
              value={(editingProject.scope || []).join('\n')}
              onChange={(e) => setEditingProject((p) => ({ ...p, scope: e.target.value.split('\n').map((line) => line.trim()).filter(Boolean) }))}
          />
        </Field>
        </article>
        <article className="space-y-3 rounded-2xl border border-white/10 bg-[#121212] p-5">
          <Field label="Card / cover (image or video)">
            <div className="flex items-center gap-3">
              <MediaThumb src={editingProject.image} />
            <div className="min-w-0 flex-1 space-y-2">
                <input className={inputClass} value={editingProject.image || ''} onChange={(e) => setEditingProject((p) => ({ ...p, image: e.target.value }))} />
                <input type="file" accept="image/*,video/*" className={fileClass} onChange={(e) => storeFile(e.target.files?.[0], (url) => setEditingProject((p) => ({ ...p, image: url })))} />
            </div>
          </div>
        </Field>
          <Field label="Hero media (optional)">
            <input className={inputClass} value={editingProject.video || ''} onChange={(e) => setEditingProject((p) => ({ ...p, video: e.target.value }))} />
            <input type="file" accept="image/*,video/*" className={`${fileClass} mt-2`} onChange={(e) => storeFile(e.target.files?.[0], (url) => setEditingProject((p) => ({ ...p, video: url })))} />
          </Field>
        </article>
        <article className="space-y-3 rounded-2xl border border-white/10 bg-[#121212] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold">Page visuals</h3>
              <p className="mt-1 text-[12px] text-white/45">Table of contents on this project page. Same photos that are live on the website.</p>
            </div>
            <button
              type="button"
              className="text-[12px] font-bold text-[#e3943f]"
              onClick={() => setEditingProject((p) => ({
                ...p,
                gallery: [...normalizeProjectVisuals(p.gallery), { id: uid('vis'), image: '', title: '', text: '', caption: '' }],
              }))}
            >
              + Add visual
            </button>
          </div>
          {normalizeProjectVisuals(editingProject.gallery).length === 0 ? (
            <p className="rounded-xl border border-dashed border-white/15 px-4 py-8 text-center text-[13px] text-white/40">
              No visuals yet — Add visual
            </p>
          ) : (
            normalizeProjectVisuals(editingProject.gallery).map((visual, index) => (
              <div key={visual.id || index} className="space-y-3 rounded-xl border border-white/10 p-3">
                <Field label="Title">
                  <input className={inputClass} value={visual.title || ''} onChange={(e) => patchVisual(index, { title: e.target.value })} />
                </Field>
                <Field label="Description">
                  <textarea
              className={inputClass}
                    rows={4}
                    placeholder="Text beside this photo on the live page"
                    value={visual.text || ''}
                    onChange={(e) => patchVisual(index, { text: e.target.value, description: e.target.value })}
            />
          </Field>
                <MediaPicker
                  src={visual.image}
                  label="Photo"
                  onChange={(value) => patchVisual(index, { image: value })}
                  onFile={(file) => storeFile(file, (url) => patchVisual(index, { image: url }))}
                />
                <Field label="Caption">
              <input
                    className={inputClass}
                    placeholder="Short line under the photo"
                    value={visual.caption || ''}
                    onChange={(e) => patchVisual(index, { caption: e.target.value })}
                  />
                </Field>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className={btnGhost} disabled={index === 0} onClick={() => setEditingProject((p) => ({ ...p, gallery: move(normalizeProjectVisuals(p.gallery), index, -1) }))}>Up</button>
                  <button type="button" className={btnGhost} disabled={index === normalizeProjectVisuals(editingProject.gallery).length - 1} onClick={() => setEditingProject((p) => ({ ...p, gallery: move(normalizeProjectVisuals(p.gallery), index, 1) }))}>Down</button>
                  <button type="button" className="text-[11px] text-red-300" onClick={() => setEditingProject((p) => ({ ...p, gallery: normalizeProjectVisuals(p.gallery).filter((_, i) => i !== index) }))}>Remove</button>
        </div>
              </div>
            ))
          )}
        </article>
        <article className="space-y-3 rounded-2xl border border-white/10 bg-[#121212] p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Story sections</h3>
            <button
              type="button"
              className="text-[12px] font-bold text-[#e3943f]"
              onClick={() => setEditingProject((p) => ({ ...p, sections: [...(p.sections || []), { id: uid('sec'), title: 'New section', text: '', media: '', caption: '' }] }))}
            >
              + Add section
            </button>
          </div>
          {(editingProject.sections || []).map((section, index) => (
            <div key={section.id || index} className="space-y-2 rounded-xl border border-white/10 p-3">
              <input className={inputClass} placeholder="Section title" value={section.title || ''} onChange={(e) => {
                const next = [...(editingProject.sections || [])]
                next[index] = { ...next[index], title: e.target.value }
                setEditingProject((p) => ({ ...p, sections: next }))
              }} />
              <textarea className={inputClass} rows={2} placeholder="Text" value={section.text || ''} onChange={(e) => {
                const next = [...(editingProject.sections || [])]
                next[index] = { ...next[index], text: e.target.value }
                setEditingProject((p) => ({ ...p, sections: next }))
              }} />
              <MediaPicker
                src={section.media}
                onChange={(value) => {
                  const next = [...(editingProject.sections || [])]
                  next[index] = { ...next[index], media: value }
                  setEditingProject((p) => ({ ...p, sections: next }))
                }}
                onFile={(file) => storeFile(file, (url) => {
                  const next = [...(editingProject.sections || [])]
                  next[index] = { ...next[index], media: url }
                  setEditingProject((p) => ({ ...p, sections: next }))
                })}
              />
              <button type="button" className="text-[11px] text-red-300" onClick={() => setEditingProject((p) => ({ ...p, sections: (p.sections || []).filter((_, i) => i !== index) }))}>Remove</button>
        </div>
          ))}
        </article>
        <div className="flex gap-2">
          <button type="button" className={btnGhost} onClick={() => setEditingProject(null)}>Cancel</button>
          <button type="button" className={btnPrimary} onClick={saveProject}>Apply to this page</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-24 text-white">
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#121212] p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-[20px] font-semibold">{title}</h1>
          <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-white/55">{intro}</p>
          {livePath ? (
            <a href={livePath} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[13px] text-[#e3943f]">
              Open this page on the website
            </a>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-3">
          {isPortfolio ? null : (
          <button
            type="button"
            onClick={() => {
                if (window.confirm(`Replace the ${title.toLowerCase()} list with starter pages?`)) {
                const next = resetTree()
                setTree(next)
                  setCategoryId(next.categories[0]?.id || '')
                setSubId('')
              }
            }}
            className={btnGhost}
          >
              Restore examples
          </button>
          )}
          <button type="button" onClick={save} disabled={loading || uploading} className={btnPrimary}>
            {loading ? 'Saving…' : 'Save to website'}
          </button>
        </div>
      </div>

      {uploading ? <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[13px]">Uploading file… wait, then press Save.</p> : null}
      {status === 'uploaded' ? <p className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-[13px]">File uploaded. Press Save to publish it.</p> : null}
      {status === 'saved' ? <p className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-[13px]">Saved. The live website now uses this content.</p> : null}
      {status === 'error' ? <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-[13px]">{error || 'Could not save.'}</p> : null}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="space-y-3 self-start rounded-2xl border border-white/10 bg-[#121212] p-4 md:sticky md:top-24">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-[13px] font-semibold text-white/60">{isPortfolio ? 'Sections' : 'Pages'}</h2>
            <button type="button" className="text-[12px] font-semibold text-[#e3943f]" onClick={addCategory}>
              {isPortfolio ? '+ New section' : '+ Category'}
            </button>
        </div>
          <p className="text-[12px] leading-relaxed text-white/40">
            {isPortfolio
              ? 'Click a section to edit that page. All projects is the big website list — add work in Residences, Architecture, and the others.'
              : 'Click a page on the left, then edit it on the right.'}
          </p>
          <div className="max-h-[70vh] space-y-1 overflow-y-auto pr-1" data-lenis-prevent="true">
            {categories.map((item, index) => (
              <div key={item.id} className="rounded-xl">
                <button
                  type="button"
                  onClick={() => selectCategory(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13px] ${
                    category?.id === item.id && !subcategory ? 'bg-[#e3943f] text-black' : 'text-white hover:bg-white/5'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{item.name || 'Untitled'}</span>
                    {isPortfolio && item.slug === 'all-projects' ? (
                      <span className={`block text-[11px] ${category?.id === item.id && !subcategory ? 'text-black/60' : 'text-white/40'}`}>
                        Website list
                      </span>
      ) : null}
                  </span>
                  <span className={`text-[11px] ${category?.id === item.id && !subcategory ? 'text-black/60' : 'text-white/35'}`}>
                    {(item.subcategories || []).length || ''}
                  </span>
            </button>
                {category?.id === item.id ? (
                  <div className="ml-3 mt-1 space-y-1 border-l border-white/10 pl-2">
                    <button
                      type="button"
                      onClick={() => selectSub('')}
                      className={`block w-full truncate rounded-lg px-2 py-1.5 text-left text-[12px] ${
                        !subcategory ? 'text-[#e3943f]' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      This page
              </button>
                    {subcategories.map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => selectSub(sub.id)}
                        className={`block w-full truncate rounded-lg px-2 py-1.5 text-left text-[12px] ${
                          subcategory?.id === sub.id ? 'bg-[#e3943f]/20 text-[#e3943f]' : 'text-white/60 hover:text-white'
                        }`}
                      >
                        {sub.name || 'Untitled'}
              </button>
                    ))}
                    <button type="button" className="px-2 py-1 text-[12px] text-[#e3943f]" onClick={addSubcategory}>
                      {isPortfolio ? '+ Sub page' : '+ Subcategory'}
                </button>
                    <div className="flex flex-wrap gap-2 px-2 pb-2">
                      <button type="button" className="text-[11px] text-white/45" disabled={index === 0} onClick={() => setTree({ categories: move(categories, index, -1) })}>Move up</button>
                      <button type="button" className="text-[11px] text-white/45" disabled={index === categories.length - 1} onClick={() => setTree({ categories: move(categories, index, 1) })}>Move down</button>
                      <button type="button" className="text-[11px] text-red-300" onClick={() => deleteCategory(item)}>Delete</button>
              </div>
            </div>
                ) : null}
                </div>
                  ))}
                </div>
        </aside>

        <section className="min-w-0 space-y-4">
          {editing ? (
            <>
              <div className="rounded-xl border border-white/10 bg-[#141414] px-4 py-3 text-[13px] text-white/55">
                You are editing <span className="font-semibold text-white">{category?.name}</span>
                {subcategory ? (
                  <>
                    {' '}→ <span className="font-semibold text-[#e3943f]">{subcategory.name}</span>
                  </>
      ) : null}
                {subcategory ? (
                  <button type="button" className="ml-3 text-red-300" onClick={() => deleteSubcategory(subcategory)}>
                    Delete this sub page
                </button>
                ) : null}
              </div>

              {isAllProjects ? (
                <div className="rounded-xl border border-[#e3943f]/30 bg-[#e3943f]/10 px-4 py-3 text-[13px] leading-relaxed text-white/80">
                  This is the big Portfolio page. It collects {collectedProjectCount} project{collectedProjectCount === 1 ? '' : 's'} from Residences, Architecture, Interior, and the other sections. Add new work in those sections — not here. You can still change the banner and text on this page.
            </div>
              ) : null}

              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'menu', label: 'Menu' },
                  { id: 'page', label: 'This page' },
                  { id: 'projects', label: isPortfolio ? (isAllProjects ? `Projects (${collectedProjectCount})` : `Projects (${projects.length})`) : `Cards (${projects.length})` },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={`rounded-xl px-4 py-2.5 text-[13px] font-semibold ${
                      tab === item.id ? 'bg-[#e3943f] text-black' : 'border border-white/10 bg-[#161616] text-white/70'
                    }`}
                  >
                    {item.label}
                </button>
                ))}
              </div>

              {tab === 'menu' ? (
                <article className="space-y-4 rounded-2xl border border-white/10 bg-[#121212] p-5">
                  <Field label="Name">
                  <input
                    className={inputClass}
                      value={editing.name}
                      onChange={(event) => {
                        const name = event.target.value
                        const nextSlug = editing.slug || slugify(name)
                        const patch = { name, slug: nextSlug }
                        if (isPortfolio && !subcategory) patch.href = portfolioCategoryPath({ slug: nextSlug })
                        patchEditing(patch)
                      }}
                  />
                </Field>
                  <Field label="Website address" hint="This becomes the page link, for example /residences.">
                  <input
                    className={inputClass}
                      value={editing.slug}
                      onChange={(event) => {
                        const nextSlug = slugify(event.target.value)
                        const patch = { slug: nextSlug }
                        if (isPortfolio && !subcategory) patch.href = portfolioCategoryPath({ slug: nextSlug })
                        patchEditing(patch)
                      }}
                  />
                </Field>
                  <Field label="Short description" hint="Shown when someone hovers the menu.">
                    <input className={inputClass} value={editing.menuDescription || ''} onChange={(event) => patchEditing({ menuDescription: event.target.value })} />
                </Field>
                  <Field label="Menu photo" hint={hoverNote}>
                    <div className="flex items-center gap-4">
                      <MediaThumb src={editing.menuImage} />
                      <div className="min-w-0 flex-1 space-y-2">
                        <input className={inputClass} value={editing.menuImage || ''} onChange={(event) => patchEditing({ menuImage: event.target.value })} />
                        <input type="file" accept="image/*" className={fileClass} onChange={(event) => storeFile(event.target.files?.[0], (url) => patchEditing({ menuImage: url }))} />
                      </div>
                    </div>
                </Field>
                  <Field label="Menu video (optional)">
                    <input className={inputClass} value={editing.menuVideo || ''} onChange={(event) => patchEditing({ menuVideo: event.target.value })} />
                    <input type="file" accept="video/*" className={`${fileClass} mt-2`} onChange={(event) => storeFile(event.target.files?.[0], (url) => patchEditing({ menuVideo: url }))} />
                  </Field>
                  <div className="flex flex-wrap gap-5 border-t border-white/10 pt-4">
                    <label className="inline-flex items-center gap-2 text-[13px]">
                      <input type="checkbox" checked={editing.published !== false} onChange={(event) => patchEditing({ published: event.target.checked })} />
                      Show on the website
                    </label>
                    <label className="inline-flex items-center gap-2 text-[13px]">
                      <input type="checkbox" checked={editing.showInMenu !== false} onChange={(event) => patchEditing({ showInMenu: event.target.checked })} />
                      Show in the website menu
                    </label>
                  </div>
                  {livePath ? <p className="text-[13px] text-white/40">Website page: {isPortfolio && subcategory ? portfolioSubcategoryPath(category, subcategory) : livePath}</p> : null}
                </article>
              ) : null}

              {tab === 'page' ? (
                <div className="space-y-4">
                  {isPortfolio ? (
                    <div className="rounded-xl border border-[#e3943f]/30 bg-[#e3943f]/10 px-4 py-3 text-[13px] leading-relaxed text-white/80">
                      Add content here, then press <span className="font-semibold text-white">Save to website</span>.
                      Banner, intro, story cards, and gallery all belong to this page.
                      A story card needs <span className="font-semibold text-white">Add photos &amp; text</span> — that is the page people open when they click the card.
                    </div>
                  ) : null}
                  <article className="space-y-3 rounded-2xl border border-white/10 bg-[#121212] p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold">Banner</h3>
                      <BlockToggle checked={Boolean(page.banner?.show)} onChange={(show) => patchPage('banner', { ...(page.banner || {}), show })} />
                    </div>
                    <Field label="Small label"><input className={inputClass} value={page.banner?.label || ''} onChange={(event) => patchPage('banner', { ...(page.banner || {}), label: event.target.value })} /></Field>
                    <Field label="Page title"><input className={inputClass} value={page.banner?.title || ''} onChange={(event) => patchPage('banner', { ...(page.banner || {}), title: event.target.value })} /></Field>
                    <Field label="Accent line"><input className={inputClass} value={page.banner?.accent || ''} onChange={(event) => patchPage('banner', { ...(page.banner || {}), accent: event.target.value })} /></Field>
                    <Field label="Description"><textarea className={inputClass} rows={3} value={page.banner?.subtitle || ''} onChange={(event) => patchPage('banner', { ...(page.banner || {}), subtitle: event.target.value })} /></Field>
                {[0, 1, 2].map((index) => {
                  const src = page.banner?.images?.[index] || ''
                  return (
                    <Field key={index} label={`Banner photo / video ${index + 1}`}>
                      <div className="flex items-center gap-3">
                        <MediaThumb src={src} />
                        <div className="min-w-0 flex-1 space-y-2">
                          <input
                            className={inputClass}
                            value={src}
                            onChange={(event) => {
                              const images = [...(page.banner?.images || ['', '', ''])]
                              images[index] = event.target.value
                              patchPage('banner', { ...(page.banner || {}), images })
                            }}
                          />
                          <input
                            type="file"
                            accept="image/*,video/mp4,video/webm,video/ogg,.mov"
                            className={fileClass}
                            onChange={(event) =>
                              storeFile(event.target.files?.[0], (url) => {
                                const images = [...(page.banner?.images || ['', '', ''])]
                                images[index] = url
                                patchPage('banner', { ...(page.banner || {}), images })
                              })
                            }
                          />
                        </div>
                      </div>
                    </Field>
                  )
                })}
              </article>

              <article className="space-y-3 rounded-2xl border border-white/10 bg-[#121212] p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">Intro text</h3>
                      <BlockToggle checked={Boolean(page.intro?.show)} onChange={(show) => patchPage('intro', { ...(page.intro || {}), show })} />
                </div>
                    <Field label="Heading"><input className={inputClass} value={page.intro?.heading || ''} onChange={(event) => patchPage('intro', { ...(page.intro || {}), heading: event.target.value })} /></Field>
                    <Field label="Paragraph"><textarea className={inputClass} rows={3} value={page.intro?.paragraph1 || ''} onChange={(event) => patchPage('intro', { ...(page.intro || {}), paragraph1: event.target.value })} /></Field>
                    <Field label="Second paragraph"><textarea className={inputClass} rows={3} value={page.intro?.paragraph2 || ''} onChange={(event) => patchPage('intro', { ...(page.intro || {}), paragraph2: event.target.value })} /></Field>
              </article>

              <RepeatBlock
                    title={isPortfolio ? 'Story cards' : 'Highlights'}
                    addLabel={isPortfolio ? '+ Add a story page' : '+ Add'}
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
                        <Field label="Title"><input className={inputClass} value={item.title || ''} onChange={(event) => update({ title: event.target.value, slug: item.slug || slugify(event.target.value) })} /></Field>
                        <Field label="Text"><textarea className={inputClass} rows={2} value={item.text || ''} onChange={(event) => update({ text: event.target.value })} /></Field>
                        <Field label="Photo or video">
                      <div className="flex items-center gap-3">
                        <MediaThumb src={item.image} />
                        <div className="min-w-0 flex-1 space-y-2">
                          <input className={inputClass} value={item.image || ''} onChange={(event) => update({ image: event.target.value })} />
                              <input type="file" accept="image/*,video/*" className={fileClass} onChange={(event) => storeFile(event.target.files?.[0], (url) => update({ image: url }))} />
                        </div>
                      </div>
                    </Field>
                        <Field label="Page address" hint="Creates the website page automatically.">
                          <input
                            className={inputClass}
                            value={item.slug || ''}
                            onChange={(event) => update({ slug: slugify(event.target.value) })}
                          />
                        </Field>
                        {category && item.slug ? (
                          <p className="text-[12px] text-white/40">
                            Website page:{' '}
                            <a
                              href={
                                isPortfolio
                                  ? portfolioHighlightPath(category, subcategory, item)
                                  : serviceHighlightPath(category, subcategory, item)
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#e3943f]"
                            >
                              {isPortfolio
                                ? portfolioHighlightPath(category, subcategory, item)
                                : serviceHighlightPath(category, subcategory, item)}
                            </a>
                          </p>
                        ) : null}
                        <label className="inline-flex items-center gap-2 text-[12px] text-white/70">
                          <input type="checkbox" checked={item.published !== false} onChange={(event) => update({ published: event.target.checked })} />
                          Published
                        </label>
                        <button
                          type="button"
                          className={btnPrimary}
                          onClick={() => setEditingHighlight(normalizeHighlightItem(item, 0, reservedHighlightSlugs, new Set()))}
                        >
                          Add photos & text
                        </button>
                  </>
                )}
              />

              <RepeatBlock
                title="Process steps"
                show={Boolean(page.steps?.show)}
                onShow={(show) => patchPage('steps', { ...(page.steps || {}), show })}
                items={page.steps?.items || []}
                onItems={(items) => patchPage('steps', { ...(page.steps || {}), items })}
                blank={() => ({ id: uid('step'), number: '', title: '', text: '' })}
                render={(item, update) => (
                  <>
                        <Field label="Step number"><input className={inputClass} value={item.number || ''} onChange={(event) => update({ number: event.target.value })} /></Field>
                        <Field label="Title"><input className={inputClass} value={item.title || ''} onChange={(event) => update({ title: event.target.value })} /></Field>
                        <Field label="Text"><textarea className={inputClass} rows={2} value={item.text || ''} onChange={(event) => update({ text: event.target.value })} /></Field>
                  </>
                )}
              />

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
                    <Field label="Photo or video">
                      <div className="flex items-center gap-3">
                        <MediaThumb src={item.image} />
                        <div className="min-w-0 flex-1 space-y-2">
                          <input className={inputClass} value={item.image || ''} onChange={(event) => update({ image: event.target.value })} />
                              <input type="file" accept="image/*,video/*" className={fileClass} onChange={(event) => storeFile(event.target.files?.[0], (url) => update({ image: url }))} />
                        </div>
                      </div>
                    </Field>
                        <Field label="Caption"><input className={inputClass} value={item.caption || ''} onChange={(event) => update({ caption: event.target.value, title: item.title || event.target.value, slug: item.slug || slugify(event.target.value) })} /></Field>
                        <Field label="Title">
                          <input className={inputClass} value={item.title || ''} onChange={(event) => update({ title: event.target.value, slug: item.slug || slugify(event.target.value) })} />
                    </Field>
                        <Field label="Page address" hint="Creates the website page automatically.">
                          <input
                            className={inputClass}
                            value={item.slug || ''}
                            onChange={(event) => update({ slug: slugify(event.target.value) })}
                          />
                        </Field>
                        {category && item.slug ? (
                          <p className="text-[12px] text-white/40">
                            Website page:{' '}
                            <a
                              href={
                                isPortfolio
                                  ? portfolioGalleryPath(category, subcategory, item)
                                  : serviceGalleryPath(category, subcategory, item)
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#e3943f]"
                            >
                              {isPortfolio
                                ? portfolioGalleryPath(category, subcategory, item)
                                : serviceGalleryPath(category, subcategory, item)}
                            </a>
                          </p>
                        ) : null}
                        <label className="inline-flex items-center gap-2 text-[12px] text-white/70">
                          <input type="checkbox" checked={item.published !== false} onChange={(event) => update({ published: event.target.checked })} />
                          Published
                        </label>
                        <button
                          type="button"
                          className={btnPrimary}
                          onClick={() => setEditingGallery(normalizeGalleryItem(item, 0, reservedGallerySlugs, new Set()))}
                        >
                          Add photos & text
                        </button>
                  </>
                )}
              />

              <article className="space-y-3 rounded-2xl border border-white/10 bg-[#121212] p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">Closing note</h3>
                      <BlockToggle checked={Boolean(page.closing?.show)} onChange={(show) => patchPage('closing', { ...(page.closing || {}), show })} />
                </div>
                    <Field label="Heading"><input className={inputClass} value={page.closing?.heading || ''} onChange={(event) => patchPage('closing', { ...(page.closing || {}), heading: event.target.value })} /></Field>
                    <Field label="Paragraph"><textarea className={inputClass} rows={3} value={page.closing?.paragraph || ''} onChange={(event) => patchPage('closing', { ...(page.closing || {}), paragraph: event.target.value })} /></Field>
                    <Field label="Button label"><input className={inputClass} value={page.closing?.buttonLabel || ''} onChange={(event) => patchPage('closing', { ...(page.closing || {}), buttonLabel: event.target.value })} /></Field>
                    <Field label="Button link"><input className={inputClass} value={page.closing?.buttonLink || ''} onChange={(event) => patchPage('closing', { ...(page.closing || {}), buttonLink: event.target.value })} /></Field>
              </article>
                </div>
              ) : null}

              {tab === 'projects' ? (
                <article className="space-y-4 rounded-2xl border border-white/10 bg-[#121212] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{isPortfolio ? 'Project cards' : 'Cards on this page'}</h3>
                      <p className="text-[13px] text-white/45">
                        {isAllProjects
                          ? 'These cards are collected from the other sections. Open Residences, Architectural design, or Interior design to add or edit a project.'
                          : isPortfolio
                            ? 'Only this section. Sub pages keep their own project cards.'
                            : 'Only this selected page. Parent and subcategory stay separate.'}
                      </p>
                    </div>
                    {isAllProjects ? null : (
                      <button type="button" className={btnPrimary} onClick={() => { setIsNewProject(true); setEditingProject(hydrateProjectForEdit(blankProject(editing.name))) }}>
                        {isPortfolio ? 'Add project' : 'Add card'}
                </button>
                    )}
                  </div>
                  {isAllProjects ? (
                    <p className="rounded-xl border border-dashed border-white/15 px-4 py-10 text-center text-[13px] text-white/50">
                      {collectedProjectCount} project{collectedProjectCount === 1 ? '' : 's'} already appear on this website page from the other sections.
                    </p>
                  ) : projects.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-white/15 px-4 py-10 text-center text-[13px] text-white/40">
                      {isPortfolio ? 'No projects here yet — add one' : 'No cards yet — Add one'}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {projects.map((project, index) => (
                        <div key={project.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 p-4 sm:flex-row sm:items-center">
                          <div className="h-14 w-16 overflow-hidden rounded-xl bg-black">
                            {project.image ? <img src={project.image} alt="" className="h-full w-full object-cover" /> : null}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-semibold">{project.titlePre || 'Untitled'} <span className="text-[#e3943f]">{project.location || ''}</span></p>
                            <p className="text-[12px] text-white/40">/project/{project.id}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button type="button" className={btnGhost} disabled={index === 0} onClick={() => patchEditing({ projects: move(projects, index, -1) })}>Up</button>
                            <button type="button" className={btnGhost} disabled={index === projects.length - 1} onClick={() => patchEditing({ projects: move(projects, index, 1) })}>Down</button>
                            <button type="button" className={btnGhost} onClick={() => { setIsNewProject(false); setEditingProject(hydrateProjectForEdit(project)) }}>Edit</button>
                            <button
                              type="button"
                              className="rounded-xl border border-red-500/25 bg-red-500/10 px-3.5 py-2 text-[12px] font-semibold text-red-300"
                              onClick={() => patchEditing({ projects: projects.filter((item) => item.id !== project.id) })}
                            >
                              Delete
                </button>
              </div>
                        </div>
                      ))}
                    </div>
          )}
                </article>
      ) : null}

              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={save} disabled={loading || uploading} className={btnPrimary}>
                  {loading ? 'Saving…' : 'Save to website'}
              </button>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-[13px] text-white/45">
              {isPortfolio ? 'Add a section on the left to create a website page.' : 'Add a category on the left to create a live page.'}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function RepeatBlock({ title, show, onShow, items, onItems, blank, render, addLabel = '+ Add' }) {
  const list = items || []
  const updateAt = (index, patch) => {
    onItems(list.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)))
  }
  return (
    <article className="space-y-3 rounded-2xl border border-white/10 bg-[#121212] p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">{title}</h3>
        <BlockToggle checked={show} onChange={onShow} />
      </div>
      {list.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-[12px] text-white/40">Nothing here yet — Add one</p>
      ) : null}
      {list.map((item, index) => (
        <div key={item.id || index} className="space-y-3 rounded-xl border border-white/10 p-3">
          {render(item, (patch) => updateAt(index, patch))}
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btnGhost} onClick={() => onItems(move(list, index, -1))} disabled={index === 0}>Up</button>
            <button type="button" className={btnGhost} onClick={() => onItems(move(list, index, 1))} disabled={index === list.length - 1}>Down</button>
            <button type="button" className="rounded-xl border border-red-500/25 bg-red-500/10 px-3.5 py-2 text-[12px] font-semibold text-red-300" onClick={() => onItems(list.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => onItems([...list, blank()])} className="text-[13px] font-semibold text-[#e3943f]">{addLabel}</button>
    </article>
  )
}

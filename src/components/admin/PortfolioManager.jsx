import { useEffect, useRef, useState } from 'react'
import {
  DEFAULT_PORTFOLIO_CONFIG,
  getStoredPortfolioConfig,
  setStoredPortfolioConfig,
  getProjectsForCategory,
  setProjectsForCategory,
  seedPortfolioCategory,
  resolveProjectListKey,
} from '../../data/portfolioConfig'
import { getStoredPortfolioTree, setStoredPortfolioTree } from '../../data/portfolioTree'

const BUILTIN_CATEGORY_KEYS = [
  { id: 'all-projects', label: 'All Projects', path: '/all-projects' },
  { id: 'architectural-design', label: 'Architectural Design', path: '/architectural-design' },
  { id: 'interior-design', label: 'Interior Design', path: '/interior-design' },
  { id: 'commercial-design', label: 'Commercial Design', path: '/commercial-design' },
]

const BUILTIN_DISCIPLINES = [
  { id: 'architectural', label: 'Architecture', tab: 'arch' },
  { id: 'interior', label: 'Interior', tab: 'int' },
  { id: 'commercial', label: 'Commercial', tab: 'comm' },
]

function buildCategoryKeysFromTree() {
  const categories = getStoredPortfolioTree()?.categories || []
  const base = [...BUILTIN_CATEGORY_KEYS]
  const seen = new Set(base.map((c) => c.id))
  for (const cat of categories) {
    const id = cat.slug || cat.id
    if (!id || seen.has(id) || id === 'all-projects') continue
    seen.add(id)
    base.push({
      id,
      label: cat.name || id,
      path: `/portfolio/${id}`,
    })
  }
  return labelsFromTree(base)
}

function buildDisciplinesFromTree() {
  const categories = getStoredPortfolioTree()?.categories || []
  const list = [...BUILTIN_DISCIPLINES]
  const seen = new Set(list.map((d) => d.id))
  for (const cat of categories) {
    const slug = cat.slug || cat.id
    if (!slug || slug === 'all-projects') continue
    const listKey = resolveProjectListKey(slug)
    if (!listKey || seen.has(listKey)) continue
    seen.add(listKey)
    list.push({
      id: listKey,
      label: cat.name || listKey,
      tab: listKey.slice(0, 4),
    })
  }
  return list
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Could not read that file'))
    reader.readAsDataURL(file)
  })
}

async function uploadAnyFile(file, token) {
  const dataUrl = await fileToDataUrl(file)
  const res = await fetch('/api/blogs/uploads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || localStorage.getItem('ug_admin_token') || localStorage.getItem('token') || ''}`,
    },
    body: JSON.stringify({ filename: file.name, dataUrl }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.url) throw new Error(data.message || 'Upload failed')
  return data.url
}

function isVideoLike(src) {
  const value = String(src || '').toLowerCase()
  return value.startsWith('data:video') || /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/.test(value)
}

function uid(prefix = 'sec') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

function normalizeGalleryItem(item) {
  if (!item) return { src: '', title: '', caption: '' }
  if (typeof item === 'string') return { src: item, title: '', caption: '' }
  return {
    src: item.src || item.url || item.image || '',
    title: item.title || item.tocTitle || item.label || '',
    caption: item.caption || '',
  }
}

function MediaPreview({ src }) {
  if (!src) {
    return (
      <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-xl border border-dashed border-white/15 bg-black/40 text-[10px] text-white/35">
        No preview
      </div>
    )
  }
  return (
    <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black">
      {isVideoLike(src) ? (
        <video src={src} muted playsInline preload="metadata" className="h-full w-full object-cover" />
      ) : (
        <img src={src} alt="" className="h-full w-full object-cover" />
      )}
    </div>
  )
}

const inputClass =
  'w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]'
const btnGhost =
  'rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[11px] font-bold tracking-wider text-white/75 uppercase hover:bg-white/[0.08] hover:text-white'
const btnPrimary =
  'rounded-xl bg-gradient-to-r from-[#e3943f] to-[#d68532] px-5 py-2.5 text-[11.5px] font-bold tracking-wider text-black uppercase shadow-md shadow-[#e3943f]/25 disabled:opacity-50'

function labelsFromTree(keys) {
  const categories = getStoredPortfolioTree().categories || []
  return keys.map((item) => {
    const match = categories.find((category) => category.slug === item.id || category.id === item.id)
    return match?.name ? { ...item, label: match.name } : item
  })
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10.5px] font-bold tracking-wider text-white/50 uppercase">{label}</span>
      {hint ? <p className="mb-2 text-[12px] text-white/40">{hint}</p> : null}
      {children}
    </label>
  )
}

function StepTabs({ step, onChange, projectCount }) {
  const steps = [
    { id: 'nav', label: '1. Menu cards', hint: 'Header hover cards' },
    { id: 'heroes', label: '2. Page banners', hint: 'Top of each page' },
    { id: 'projects', label: '3. Projects list', hint: `${projectCount} cards` },
  ]
  return (
    <div className="flex flex-wrap gap-2">
      {steps.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={`rounded-xl px-4 py-2.5 text-left transition-all ${
            step === item.id
              ? 'bg-[#e3943f] text-black shadow-md shadow-[#e3943f]/20'
              : 'border border-white/10 bg-[#161616] text-white/70 hover:bg-white/[0.06] hover:text-white'
          }`}
        >
          <span className="block text-[12px] font-bold tracking-wide uppercase">{item.label}</span>
          <span className={`mt-0.5 block text-[10px] ${step === item.id ? 'text-black/60' : 'text-white/40'}`}>{item.hint}</span>
        </button>
      ))}
    </div>
  )
}

function pushAdminProjectUrl({ mode, id, discipline }) {
  if (typeof window === 'undefined') return
  const next =
    mode === 'new'
      ? `/admin/portfolio/new?discipline=${encodeURIComponent(discipline || 'architectural')}`
      : mode === 'edit' && id
        ? `/admin/portfolio/edit/${encodeURIComponent(id)}?discipline=${encodeURIComponent(discipline || 'architectural')}`
        : '/admin'
  const current = `${window.location.pathname}${window.location.search}`
  if (current === next) return
  window.history.pushState({ adminPortfolioEditor: true }, '', next)
}

export default function PortfolioManager({ token, onEditingChange }) {
  const [step, setStep] = useState('projects')
  const [selectedCategory, setSelectedCategory] = useState('all-projects')
  const [discipline, setDiscipline] = useState('architectural')
  const [previewProjectId, setPreviewProjectId] = useState(null)
  const [config, setConfig] = useState(() => getStoredPortfolioConfig())
  const [loading, setLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)
  const [categoryKeys, setCategoryKeys] = useState(() => buildCategoryKeysFromTree())
  const [disciplines, setDisciplines] = useState(() => buildDisciplinesFromTree())
  const [editingProject, setEditingProject] = useState(null)
  const [editingDiscipline, setEditingDiscipline] = useState('architectural')
  const [isNewProject, setIsNewProject] = useState(false)
  const [searchProjectQuery, setSearchProjectQuery] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [galleryUrlDraft, setGalleryUrlDraft] = useState('')
  const [modalStatus, setModalStatus] = useState('')

  useEffect(() => {
    const refreshLabels = () => {
      setCategoryKeys(buildCategoryKeysFromTree())
      setDisciplines(buildDisciplinesFromTree())
    }
    window.addEventListener('portfolio-pages-config-changed', refreshLabels)
    return () => window.removeEventListener('portfolio-pages-config-changed', refreshLabels)
  }, [])

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/blogs/settings/portfolio-pages')
        const data = await res.json()
        if (data.success && data.data) {
          setConfig((prev) => ({
            ...prev,
            ...data.data,
            navCards: { ...prev.navCards, ...(data.data.navCards || {}) },
            heroes: { ...prev.heroes, ...(data.data.heroes || {}) },
            architectural:
              Array.isArray(data.data.architectural) && data.data.architectural.length > 0
                ? data.data.architectural
                : prev.architectural,
            interior:
              Array.isArray(data.data.interior) && data.data.interior.length > 0
                ? data.data.interior
                : prev.interior,
            commercial:
              Array.isArray(data.data.commercial) && data.data.commercial.length > 0
                ? data.data.commercial
                : prev.commercial,
            projectLists: {
              ...(prev.projectLists || {}),
              ...(data.data.projectLists || {}),
            },
          }))
          setStoredPortfolioConfig(data.data)
          setCategoryKeys(buildCategoryKeysFromTree())
          setDisciplines(buildDisciplinesFromTree())
        }
      } catch (err) {
        console.error('Failed to load portfolio pages settings:', err)
      }
    }
    fetchSettings()
  }, [])

  useEffect(() => {
    if (!saveStatus) return undefined
    const timer = setTimeout(() => setSaveStatus(null), 3500)
    return () => clearTimeout(timer)
  }, [saveStatus])

  const handleSave = async () => {
    setLoading(true)
    setSaveStatus(null)
    try {
      setStoredPortfolioConfig(config)
      const res = await fetch('/api/blogs/settings/portfolio-pages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(config),
      })
      const data = await res.json()
      setSaveStatus(data.success === false ? 'error' : 'saved')
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err)
      setSaveStatus('saved')
    } finally {
      setLoading(false)
    }
  }

  const authToken = token || (typeof localStorage !== 'undefined' ? localStorage.getItem('ug_admin_token') || localStorage.getItem('token') : '')

  const storeFiles = async (files, apply) => {
    const list = Array.from(files || []).filter(Boolean)
    if (!list.length) return
    setUploading(true)
    setUploadError('')
    setUploadProgress(`Uploading 0 of ${list.length}…`)
    try {
      const urls = []
      for (let i = 0; i < list.length; i += 1) {
        setUploadProgress(`Uploading ${i + 1} of ${list.length}…`)
        urls.push(await uploadAnyFile(list[i], authToken))
      }
      apply(urls)
      setUploadProgress(`${list.length} file${list.length === 1 ? '' : 's'} uploaded`)
      setTimeout(() => setUploadProgress(''), 2500)
    } catch (err) {
      setUploadError(err.message || 'Upload failed. Try again with any photo or video.')
      setUploadProgress('')
    } finally {
      setUploading(false)
    }
  }

  const handleMediaUpload = (targetKey, file) => {
    if (!file) return
    storeFiles([file], ([url]) => {
      if (targetKey.startsWith('nav.')) {
        const catId = targetKey.split('.')[1]
        setConfig((prev) => ({
          ...prev,
          navCards: {
            ...prev.navCards,
            [catId]: { ...prev.navCards[catId], image: url },
          },
        }))
      } else if (targetKey.startsWith('hero.')) {
        const [, catId, bannerField] = targetKey.split('.')
        setConfig((prev) => ({
          ...prev,
          heroes: {
            ...prev.heroes,
            [catId]: { ...prev.heroes[catId], [bannerField]: url },
          },
        }))
      } else if (targetKey === 'project') {
        setEditingProject((prev) => ({ ...prev, image: url }))
      } else if (targetKey === 'project-video') {
        // Hero media: image or video both OK
        setEditingProject((prev) => ({ ...prev, video: url }))
      } else if (targetKey === 'project-360') {
        setEditingProject((prev) => ({ ...prev, tour360: url, badge: prev?.badge || '360°' }))
      }
    })
  }

  const handleResetToDefault = () => {
    if (window.confirm('Reset all portfolio categories and projects to starter defaults? This cannot be undone.')) {
      setConfig(DEFAULT_PORTFOLIO_CONFIG)
      setStoredPortfolioConfig(DEFAULT_PORTFOLIO_CONFIG)
      setSaveStatus('saved')
    }
  }

  const routeBootRef = useRef(false)

  useEffect(() => {
    onEditingChange?.(Boolean(editingProject))
  }, [editingProject, onEditingChange])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const onPop = () => {
      const path = window.location.pathname
      if (!path.startsWith('/admin/portfolio/')) {
        setEditingProject(null)
      }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const closeProjectEditor = () => {
    setEditingProject(null)
    setModalStatus('')
    pushAdminProjectUrl({ mode: 'list' })
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const buildBlankProject = (listKey) => ({
    id: `${listKey}-${Date.now().toString().slice(-4)}`,
    image:
      listKey === 'interior'
        ? '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png'
        : listKey === 'commercial'
          ? '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/2a52ad1e-4050-4783-b269-36dcd2bb72b0.png'
          : '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg',
    video: '',
    gallery: [],
    sections: [
      {
        id: uid('sec'),
        title: 'The Unique Graphics® style',
        text: 'Every space is crafted as a complete living world — architecture, light, and material in one continuous language.',
        media: '',
        caption: '',
      },
    ],
    tour360: '',
    area: '1500 m²',
    type: listKey === 'architectural' ? 'Modern Villas' : listKey === 'interior' ? 'Penthouses' : 'Hotel',
    tone: 'Travertine & Bronze',
    city: 'Dubai',
    country: 'UAE',
    badge: '',
    award: '',
    titlePre: 'MONUMENTAL CONTEMPORARY RESIDENCE',
    location: 'IN DUBAI, UAE',
    titlePost: 'WITH PRIVATE POOL',
    description:
      'Architectural masterpiece crafted with bespoke joinery, museum-grade architectural lighting, and sweeping panoramic views.',
    detail: '',
    scope: ['Architectural Design', 'Interior Architecture', '3D Visualization', 'Material Selection'],
    aboutHeading: 'About the project:',
    featuresTitle: 'Project features',
    enquireLabel: 'Enquire',
    enquireLink: '/contacts',
    tour360Heading: '360° experience',
    tocHeading: 'Table of contents:',
    readAlsoHeading: 'Read also:',
    closingEyebrow: 'Unique Graphics®',
    closingTitle: 'Step into the world of Unique Graphics®',
    closingText:
      'A place where your dreams take shape through the unique vision of our studio. We look forward to embarking on this inspiring journey with you.',
    closingButtonLabel: 'Discuss this project',
    closingButtonLink: '/contacts',
  })

  const openNewProjectModal = (listKey) => {
    setStep('projects')
    setEditingDiscipline(listKey)
    setDiscipline(listKey)
    setIsNewProject(true)
    setGalleryUrlDraft('')
    setUploadError('')
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
    setEditingProject(buildBlankProject(listKey))
    pushAdminProjectUrl({ mode: 'new', discipline: listKey })
  }

  const openEditProjectModal = (listKey, project) => {
    setStep('projects')
    setEditingDiscipline(listKey)
    setDiscipline(listKey)
    setIsNewProject(false)
    setGalleryUrlDraft('')
    setUploadError('')
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
    setEditingProject({
      video: '',
      tour360: '',
      detail: '',
      aboutHeading: 'About the project:',
      featuresTitle: 'Project features',
      enquireLabel: 'Enquire',
      enquireLink: '/contacts',
      tour360Heading: '360° experience',
      tocHeading: 'Table of contents:',
      readAlsoHeading: 'Read also:',
      closingEyebrow: 'Unique Graphics®',
      closingTitle: 'Step into the world of Unique Graphics®',
      closingText:
        'A place where your dreams take shape through the unique vision of our studio. We look forward to embarking on this inspiring journey with you.',
      closingButtonLabel: 'Discuss this project',
      closingButtonLink: '/contacts',
      ...project,
      gallery: Array.isArray(project.gallery) ? project.gallery.map(normalizeGalleryItem) : [],
      sections: Array.isArray(project.sections)
        ? project.sections.map((section) => ({
            id: section.id || uid('sec'),
            title: section.title || '',
            text: section.text || '',
            media: section.media || section.image || '',
            caption: section.caption || '',
          }))
        : [],
      scope: Array.isArray(project.scope) ? [...project.scope] : [],
    })
    pushAdminProjectUrl({ mode: 'edit', id: project.id, discipline: listKey })
  }

  useEffect(() => {
    if (typeof window === 'undefined' || routeBootRef.current) return
    const path = window.location.pathname
    if (!path.startsWith('/admin/portfolio/')) {
      routeBootRef.current = true
      return
    }
    const params = new URLSearchParams(window.location.search)
    const listKey = params.get('discipline') || 'architectural'
    if (path === '/admin/portfolio/new' || path.startsWith('/admin/portfolio/new')) {
      routeBootRef.current = true
      openNewProjectModal(listKey)
      return
    }
    const editMatch = path.match(/^\/admin\/portfolio\/edit\/([^/]+)/)
    if (!editMatch) {
      routeBootRef.current = true
      return
    }
    const id = decodeURIComponent(editMatch[1])
    const project = getProjectsForCategory(config, listKey).find((p) => String(p.id) === String(id))
    if (project) {
      routeBootRef.current = true
      openEditProjectModal(listKey, project)
    }
  }, [config])

  const buildUpdatedConfig = (prev) => {
    const listKey = editingDiscipline
    const currentList = getProjectsForCategory(prev, listKey)
    const updatedList = isNewProject
      ? [editingProject, ...currentList]
      : currentList.map((p) => (p.id === editingProject.id ? editingProject : p))
    return setProjectsForCategory(prev, listKey, updatedList)
  }

  const saveProjectModal = (publish = false) => {
    if (!editingProject) return
    if (JSON.stringify(editingProject).includes('data:')) {
      setUploadError('A file is still local only. Upload it first, then Apply.')
      return
    }
    const next = buildUpdatedConfig(config)
    setConfig(next)
    setStoredPortfolioConfig(next)
    setPreviewProjectId(editingProject.id)
    setIsNewProject(false)
    setModalStatus(publish ? 'publishing' : 'applied')

    if (!publish) {
      closeProjectEditor()
      setSaveStatus('saved')
      return
    }

    setLoading(true)
    fetch('/api/blogs/settings/portfolio-pages', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken || ''}`,
      },
      body: JSON.stringify(next),
    })
      .then((res) => res.json())
      .then((data) => {
        setSaveStatus(data.success === false ? 'error' : 'saved')
        closeProjectEditor()
      })
      .catch(() => {
        setSaveStatus('saved')
        closeProjectEditor()
      })
      .finally(() => {
        setLoading(false)
        setModalStatus('')
      })
  }

  const deleteProject = (listKey, id) => {
    if (window.confirm('Delete this project card?')) {
      setConfig((prev) =>
        setProjectsForCategory(
          prev,
          listKey,
          getProjectsForCategory(prev, listKey).filter((p) => p.id !== id)
        )
      )
    }
  }

  const duplicateProject = (listKey, project) => {
    const copy = {
      ...project,
      id: `${project.id}-copy-${Date.now().toString().slice(-3)}`,
      titlePre: `${project.titlePre || ''} (COPY)`,
    }
    setConfig((prev) =>
      setProjectsForCategory(prev, listKey, [copy, ...getProjectsForCategory(prev, listKey)])
    )
  }

  const projectCount = disciplines.reduce(
    (sum, item) => sum + getProjectsForCategory(config, item.id).length,
    0
  )
  const currentProjectsList = getProjectsForCategory(config, discipline)
  const filteredProjectsList = currentProjectsList.filter((p) => {
    const q = searchProjectQuery.toLowerCase().trim()
    if (!q) return true
    return (
      (p.titlePre && p.titlePre.toLowerCase().includes(q)) ||
      (p.location && p.location.toLowerCase().includes(q)) ||
      (p.city && p.city.toLowerCase().includes(q)) ||
      (p.country && p.country.toLowerCase().includes(q)) ||
      (p.type && p.type.toLowerCase().includes(q))
    )
  })
  const previewProject =
    filteredProjectsList.find((project) => project.id === previewProjectId) || filteredProjectsList[0]

  const card = config.navCards?.[selectedCategory] || {}
  const hero = config.heroes?.[selectedCategory] || {}
  const selectedLabel = categoryKeys.find((item) => item.id === selectedCategory)?.label || selectedCategory

  const renameCategory = (name) => {
    const tree = getStoredPortfolioTree()
    setStoredPortfolioTree({
      categories: (tree.categories || []).map((category) =>
        category.slug === selectedCategory || category.id === selectedCategory
          ? { ...category, name }
          : category
      ),
    })
    setCategoryKeys(buildCategoryKeysFromTree())
    setDisciplines(buildDisciplinesFromTree())
  }

  const ensureCategorySeeded = (catId) => {
    if (!catId || catId === 'all-projects') return
    setConfig((prev) => {
      if (prev.heroes?.[catId] && prev.navCards?.[catId]) return prev
      const label = categoryKeys.find((c) => c.id === catId)?.label || catId
      return seedPortfolioCategory(prev, { slug: catId, name: label })
    })
  }


  return (
    <div className="space-y-5 pb-24 text-white">
      {!editingProject ? (
      <>
      <div className="rounded-2xl border border-white/10 bg-[#121212] p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-[20px] font-bold tracking-tight text-white">Project cards</h1>
            <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-white/55">
              Category page banner → <strong className="text-white">2. Page banners</strong> (pick <em>test</em> etc).
              Project pages → <strong className="text-white">3. Projects list</strong> → Add project → Apply &amp; Publish.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={handleResetToDefault} className={btnGhost}>
              Reset starter
            </button>
            <button type="button" onClick={handleSave} disabled={loading} className={btnPrimary}>
              {loading ? 'Saving…' : 'Save / Publish'}
            </button>
          </div>
        </div>

        {saveStatus === 'saved' ? (
          <p className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-[12px] text-emerald-400">
            Saved. Portfolio pages on the live website are updated.
          </p>
        ) : null}
        {saveStatus === 'error' ? (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-[12px] text-red-300">
            Could not save to server. Changes are kept on this computer — try Save again.
          </p>
        ) : null}
      </div>

      <StepTabs step={step} onChange={setStep} projectCount={projectCount} />

      {step === 'nav' || step === 'heroes' ? (
        <div className="rounded-2xl border border-white/10 bg-[#141414] p-4">
          <p className="mb-3 text-[12px] text-white/45">Which portfolio page?</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {categoryKeys.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id)
                  ensureCategorySeeded(cat.id)
                }}
                className={`rounded-xl border p-3 text-left text-[11.5px] font-bold tracking-wider uppercase transition-all ${
                  selectedCategory === cat.id
                    ? 'border-[#e3943f] bg-[#e3943f]/15 text-[#e3943f]'
                    : 'border-white/10 bg-[#1a1a1a] text-white/60 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {step === 'nav' ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-4 rounded-2xl border border-white/10 bg-[#141414] p-5 lg:col-span-7">
            <div>
              <h2 className="text-[15px] font-semibold">Menu card — {selectedLabel}</h2>
              <p className="text-[12px] text-white/45">Name, short line, and picture in the Portfolio header menu.</p>
            </div>
            <Field label="Menu name">
              <input
                type="text"
                value={selectedLabel}
                onChange={(e) => {
                  const name = e.target.value
                  setConfig((prev) => ({
                    ...prev,
                    navCards: {
                      ...prev.navCards,
                      [selectedCategory]: { ...card, title: name },
                    },
                  }))
                  renameCategory(name)
                }}
                placeholder="e.g. ALL PROJECTS"
                className={inputClass}
              />
            </Field>
            <Field label="Hover text" hint="Short line under the name.">
              <textarea
                rows={2}
                value={card.hover || ''}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    navCards: {
                      ...prev.navCards,
                      [selectedCategory]: { ...card, hover: e.target.value },
                    },
                  }))
                }
                placeholder="e.g. Houses and rooms from the full portfolio."
                className={`${inputClass} resize-none`}
              />
            </Field>
            <Field label="Card picture" hint="Upload a photo, or paste an image URL.">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={card.image || ''}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      navCards: {
                        ...prev.navCards,
                        [selectedCategory]: { ...card, image: e.target.value },
                      },
                    }))
                  }
                  placeholder="/nav/portfolio-card.jpg"
                  className={inputClass}
                />
                <label className={`${btnGhost} inline-flex cursor-pointer items-center justify-center gap-2 shrink-0`}>
                  Upload
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => handleMediaUpload(`nav.${selectedCategory}`, e.target.files?.[0])}
                  />
                </label>
              </div>
            </Field>
            <div className="flex flex-wrap gap-3 pt-2">
              <button type="button" className={btnGhost} onClick={() => setStep('heroes')}>
                Next: Page banners →
              </button>
              <button type="button" onClick={handleSave} disabled={loading} className={btnPrimary}>
                {loading ? 'Saving…' : 'Save / Publish'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-[#121212] p-5">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-white/40">Preview</p>
              <div className="mx-auto w-full max-w-[260px] rounded-[26px] border border-white/10 bg-[#161616] p-4">
                <div className="aspect-square overflow-hidden rounded-[20px] border border-white/10 bg-black">
                  {card.image ? (
                    <img src={card.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[11px] text-white/30">No image</div>
                  )}
                </div>
                <p className="mt-4 text-[12px] font-bold uppercase tracking-[0.16em] text-[#e3943f]">{selectedLabel}</p>
                <p className="mt-2 text-[13px] leading-snug text-white/80">
                  {card.hover || 'Houses and rooms from the full portfolio.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {step === 'heroes' ? (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#141414] p-5">
          <div>
            <h2 className="text-[15px] font-semibold">Page banner — {selectedLabel}</h2>
            <p className="text-[12px] text-white/45">Big heading and background at the top of that portfolio page.</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Title">
              <input
                type="text"
                value={hero.titleLead || ''}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    heroes: {
                      ...prev.heroes,
                      [selectedCategory]: { ...hero, titleLead: e.target.value },
                    },
                  }))
                }
                placeholder="e.g. Architectural design"
                className={inputClass}
              />
            </Field>
            <Field label="Accent line">
              <input
                type="text"
                value={hero.titleAccent || ''}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    heroes: {
                      ...prev.heroes,
                      [selectedCategory]: { ...hero, titleAccent: e.target.value },
                    },
                  }))
                }
                placeholder="e.g. by Unique Graphics®"
                className={`${inputClass} font-bold text-[#e3943f]`}
              />
            </Field>
          </div>
          <Field label="Description">
            <textarea
              rows={3}
              value={hero.description || ''}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  heroes: {
                    ...prev.heroes,
                    [selectedCategory]: { ...hero, description: e.target.value },
                  },
                }))
              }
              placeholder="Short intro under the heading…"
              className={`${inputClass} resize-none`}
            />
          </Field>
          <div className="space-y-3 border-t border-white/10 pt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#e3943f]">Background clips (optional)</p>
            {['banner1', 'banner2', 'banner3'].map((bKey, idx) => (
              <Field key={bKey} label={`Clip ${idx + 1}`}>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={hero[bKey] || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        heroes: {
                          ...prev.heroes,
                          [selectedCategory]: { ...hero, [bKey]: e.target.value },
                        },
                      }))
                    }
                    placeholder={`Video or image URL ${idx + 1}`}
                    className={inputClass}
                  />
                  <label className={`${btnGhost} inline-flex cursor-pointer items-center justify-center shrink-0`}>
                    Upload
                    <input
                      type="file"
                      accept="video/*,image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleMediaUpload(`hero.${selectedCategory}.${bKey}`, e.target.files?.[0])
                      }
                    />
                  </label>
                </div>
              </Field>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <button type="button" className={btnGhost} onClick={() => setStep('nav')}>
              ← Back
            </button>
            <button type="button" className={btnGhost} onClick={() => setStep('projects')}>
              Next: Projects list →
            </button>
            <button type="button" onClick={handleSave} disabled={loading} className={btnPrimary}>
              {loading ? 'Saving…' : 'Save / Publish'}
            </button>
          </div>
        </div>
      ) : null}

      {step === 'projects' ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {disciplines.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setDiscipline(item.id)
                  setPreviewProjectId(null)
                  ensureCategorySeeded(
                    item.id === 'architectural'
                      ? 'architectural-design'
                      : item.id === 'interior'
                        ? 'interior-design'
                        : item.id === 'commercial'
                          ? 'commercial-design'
                          : item.id
                  )
                }}
                className={`rounded-xl px-4 py-2 text-[12px] font-bold tracking-wider uppercase ${
                  discipline === item.id
                    ? 'bg-[#e3943f] text-black'
                    : 'border border-white/10 bg-[#161616] text-white/70 hover:text-white'
                }`}
              >
                {item.label} ({getProjectsForCategory(config, item.id).length})
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#141414] p-4 sm:flex-row sm:items-center">
            <input
              type="text"
              value={searchProjectQuery}
              onChange={(e) => setSearchProjectQuery(e.target.value)}
              placeholder="Search by city or title"
              className={`${inputClass} flex-1`}
            />
            <button type="button" onClick={() => openNewProjectModal(discipline)} className={btnPrimary}>
              ADD PROJECT
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-7">
              {filteredProjectsList.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-[13px] text-white/45">
                  No projects yet — Add one
                </div>
              ) : (
                filteredProjectsList.map((project) => (
                  <div
                    key={project.id}
                    className={`flex flex-col gap-3 rounded-2xl border bg-[#141414] p-4 sm:flex-row sm:items-center sm:justify-between ${
                      previewProject?.id === project.id ? 'border-[#e3943f]' : 'border-white/10'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setPreviewProjectId(project.id)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <div className="h-14 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black sm:h-16 sm:w-20">
                        {project.image ? (
                          <img src={project.image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[9px] text-white/30">No image</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[12.5px] font-bold uppercase text-white">
                          {project.titlePre || 'Untitled'}{' '}
                          <span className="text-[#e3943f]">{project.location || ''}</span>
                        </p>
                        <p className="mt-1 truncate text-[11px] text-white/45">
                          {[project.city, project.country, project.type].filter(Boolean).join(' · ') || 'No details yet'}
                        </p>
                      </div>
                    </button>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className={btnGhost} onClick={() => openEditProjectModal(discipline, project)}>
                        Edit
                      </button>
                      <button type="button" className={btnGhost} onClick={() => duplicateProject(discipline, project)}>
                        Copy
                      </button>
                      <button
                        type="button"
                        className="rounded-xl border border-red-500/25 bg-red-500/10 px-3.5 py-2 text-[11px] font-bold tracking-wider text-red-300 uppercase hover:bg-red-500 hover:text-white"
                        onClick={() => deleteProject(discipline, project.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="lg:col-span-5">
              <div className="sticky top-6 rounded-2xl border border-white/10 bg-[#121212] p-5">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-white/40">Preview</p>
                {previewProject ? (
                  <div className="space-y-3">
                    <div className="aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-black">
                      {previewProject.image ? (
                        <img src={previewProject.image} alt="" className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <h4 className="text-[12px] font-bold uppercase leading-snug text-white">
                      {previewProject.titlePre}{' '}
                      <span className="text-[#e3943f]">{previewProject.location}</span> {previewProject.titlePost}
                    </h4>
                    <p className="text-[11px] leading-relaxed text-white/55 line-clamp-3">{previewProject.description}</p>
                  </div>
                ) : (
                  <p className="py-8 text-center text-[12px] text-white/40">No project selected</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" className={btnGhost} onClick={() => setStep('heroes')}>
              ← Back
            </button>
            <button type="button" onClick={handleSave} disabled={loading} className={btnPrimary}>
              {loading ? 'Saving…' : 'Save / Publish'}
            </button>
          </div>
        </div>
      ) : null}
      </>
      ) : null}

      {editingProject ? (
        <div className="min-h-[75vh] space-y-5 pb-28 text-white">
          <div className="sticky top-0 z-20 border-b border-white/10 bg-[#0b0b0b]/95 py-4 backdrop-blur-md">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <button
                  type="button"
                  onClick={closeProjectEditor}
                  className="mb-3 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-white/50 transition-colors hover:text-[#e3943f]"
                >
                  <span aria-hidden="true">‹</span>
                  Back to projects list
                </button>
                <h1 className="text-[22px] font-bold tracking-tight text-white uppercase sm:text-[26px]">
                  {isNewProject ? 'Add project details' : 'Edit project details'}
                </h1>
                <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-white/50">
                  Full-page editor — title, about text, TOC sections, captions, gallery, 360°, labels, and
                  bottom CTA. Scroll the page, then Apply &amp; Publish.
                </p>
                {editingProject.titlePre ? (
                  <p className="mt-2 truncate text-[12px] uppercase tracking-wide text-[#e3943f]">
                    {editingProject.titlePre} {editingProject.location || ''}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button type="button" className={btnGhost} onClick={closeProjectEditor}>
                  Cancel
                </button>
                <button
                  type="button"
                  className={btnGhost}
                  disabled={uploading || loading}
                  onClick={() => saveProjectModal(false)}
                >
                  Apply
                </button>
                <button
                  type="button"
                  className={btnPrimary}
                  disabled={uploading || loading}
                  onClick={() => saveProjectModal(true)}
                >
                  {loading ? 'Publishing…' : 'Apply & Publish'}
                </button>
              </div>
            </div>
            {uploading || uploadProgress ? (
              <p className="mt-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[13px]">
                {uploadProgress || 'Uploading… please wait.'}
              </p>
            ) : null}
            {uploadError ? (
              <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-[13px] text-red-300">
                {uploadError}
              </p>
            ) : null}
            {modalStatus === 'publishing' ? (
              <p className="mt-3 rounded-xl border border-[#e3943f]/30 bg-[#e3943f]/10 px-4 py-2.5 text-[13px] text-[#e3943f]">
                Publishing to live site…
              </p>
            ) : null}
          </div>

          <div className="mx-auto max-w-4xl space-y-5">

              <div className="space-y-3 rounded-2xl border border-white/10 bg-[#121212] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#e3943f]">1. Project text (About)</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Field label="Title">
                    <input
                      type="text"
                      value={editingProject.titlePre || ''}
                      onChange={(e) => setEditingProject((prev) => ({ ...prev, titlePre: e.target.value }))}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Location (gold on banner)">
                    <input
                      type="text"
                      value={editingProject.location || ''}
                      onChange={(e) => setEditingProject((prev) => ({ ...prev, location: e.target.value }))}
                      className={`${inputClass} font-bold text-[#e3943f]`}
                    />
                  </Field>
                  <Field label="Title end">
                    <input
                      type="text"
                      value={editingProject.titlePost || ''}
                      onChange={(e) => setEditingProject((prev) => ({ ...prev, titlePost: e.target.value }))}
                      className={inputClass}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Field label="Area">
                    <input
                      type="text"
                      value={editingProject.area || ''}
                      onChange={(e) => setEditingProject((prev) => ({ ...prev, area: e.target.value }))}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Project type">
                    <input
                      type="text"
                      value={editingProject.type || ''}
                      onChange={(e) => setEditingProject((prev) => ({ ...prev, type: e.target.value }))}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Materials & tone">
                    <input
                      type="text"
                      value={editingProject.tone || ''}
                      onChange={(e) => setEditingProject((prev) => ({ ...prev, tone: e.target.value }))}
                      className={inputClass}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="City">
                    <input
                      type="text"
                      value={editingProject.city || ''}
                      onChange={(e) => setEditingProject((prev) => ({ ...prev, city: e.target.value }))}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Country">
                    <input
                      type="text"
                      value={editingProject.country || ''}
                      onChange={(e) => setEditingProject((prev) => ({ ...prev, country: e.target.value }))}
                      className={inputClass}
                    />
                  </Field>
                </div>
                <Field label="Award (optional)">
                  <input
                    type="text"
                    value={editingProject.award || ''}
                    onChange={(e) => setEditingProject((prev) => ({ ...prev, award: e.target.value }))}
                    className={inputClass}
                  />
                </Field>
                <Field label="Short description" hint="First paragraph under About the project.">
                  <textarea
                    rows={3}
                    value={editingProject.description || ''}
                    onChange={(e) => setEditingProject((prev) => ({ ...prev, description: e.target.value }))}
                    className={`${inputClass} resize-none`}
                  />
                </Field>
                <Field label="Full detail text" hint="Second paragraph on the project page.">
                  <textarea
                    rows={4}
                    value={editingProject.detail || ''}
                    onChange={(e) => setEditingProject((prev) => ({ ...prev, detail: e.target.value }))}
                    className={`${inputClass} resize-none`}
                  />
                </Field>
                <Field
                  label="Project features"
                  hint="One per line — shows as overlay card on the About image."
                >
                  <textarea
                    rows={4}
                    value={(editingProject.scope || []).join('\n')}
                    onChange={(e) =>
                      setEditingProject((prev) => ({
                        ...prev,
                        scope: e.target.value
                          .split('\n')
                          .map((line) => line.trim())
                          .filter(Boolean),
                      }))
                    }
                    placeholder={'3 bedrooms\n2 terraces\n1 winter garden'}
                    className={`${inputClass} resize-none`}
                  />
                </Field>
              </div>

              <div className="space-y-3 rounded-2xl border border-white/10 bg-[#121212] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#e3943f]">2. Cover media</p>
                <Field
                  label="Main cover (image or video)"
                  hint="Card thumbnail + fallback hero. JPG, PNG, WebP, MP4, WebM — sab OK."
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <MediaPreview src={editingProject.image} />
                    <div className="min-w-0 flex-1 space-y-2">
                      <input
                        type="text"
                        value={editingProject.image || ''}
                        onChange={(e) => setEditingProject((prev) => ({ ...prev, image: e.target.value }))}
                        placeholder="Paste image or video URL"
                        className={inputClass}
                      />
                      <label className={`${btnGhost} inline-flex cursor-pointer items-center justify-center`}>
                        Upload image / video
                        <input
                          type="file"
                          accept="image/*,video/*"
                          className="hidden"
                          onChange={(e) => handleMediaUpload('project', e.target.files?.[0])}
                        />
                      </label>
                    </div>
                  </div>
                </Field>
                <Field
                  label="Hero media (optional — image or video)"
                  hint="If set, this shows first on the project page (plays if video, full-bleed if image)."
                >
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      value={editingProject.video || ''}
                      onChange={(e) => setEditingProject((prev) => ({ ...prev, video: e.target.value }))}
                      placeholder="Image or video URL"
                      className={inputClass}
                    />
                    <label className={`${btnGhost} inline-flex cursor-pointer items-center justify-center shrink-0`}>
                      Upload
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={(e) => handleMediaUpload('project-video', e.target.files?.[0])}
                      />
                    </label>
                  </div>
                </Field>
              </div>

              <div className="space-y-3 rounded-2xl border border-white/10 bg-[#121212] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#e3943f]">3. 360° view</p>
                <Field
                  label="360 media"
                  hint="Upload image, video, or paste any URL / embed link. No format lock."
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <MediaPreview src={editingProject.tour360} />
                    <div className="min-w-0 flex-1 space-y-2">
                      <input
                        type="text"
                        value={editingProject.tour360 || ''}
                        onChange={(e) =>
                          setEditingProject((prev) => ({
                            ...prev,
                            tour360: e.target.value,
                            badge: e.target.value ? prev.badge || '360°' : prev.badge,
                          }))
                        }
                        placeholder="360 image / video / tour URL"
                        className={inputClass}
                      />
                      <label className={`${btnGhost} inline-flex cursor-pointer items-center justify-center`}>
                        Upload 360 file
                        <input
                          type="file"
                          accept="image/*,video/*"
                          className="hidden"
                          onChange={(e) => handleMediaUpload('project-360', e.target.files?.[0])}
                        />
                      </label>
                    </div>
                  </div>
                </Field>
                <Field label="Badge on card">
                  <input
                    type="text"
                    value={editingProject.badge || ''}
                    onChange={(e) => setEditingProject((prev) => ({ ...prev, badge: e.target.value }))}
                    placeholder="360° / FEATURED / NEW / custom"
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="space-y-3 rounded-2xl border border-white/10 bg-[#121212] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#e3943f]">
                    4. Story sections (Table of Contents)
                  </p>
                  <button
                    type="button"
                    className={btnPrimary}
                    onClick={() =>
                      setEditingProject((prev) => ({
                        ...prev,
                        sections: [
                          ...(prev.sections || []),
                          { id: uid('sec'), title: 'New section', text: '', media: '', caption: '' },
                        ],
                      }))
                    }
                  >
                    Add section
                  </button>
                </div>
                <p className="text-[12px] text-white/45">
                  Section title = left TOC label (e.g. Visual 1 → rename to anything). Fill text,
                  media, and caption under the image.
                </p>
                {(editingProject.sections || []).length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/15 px-4 py-8 text-center text-[12px] text-white/40">
                    No story sections yet — Add section
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(editingProject.sections || []).map((section, index) => (
                      <div key={section.id || index} className="space-y-3 rounded-xl border border-white/10 bg-black/30 p-3">
                        <Field label={`TOC label / section ${index + 1} title`}>
                          <input
                            type="text"
                            value={section.title || ''}
                            onChange={(e) => {
                              const next = [...(editingProject.sections || [])]
                              next[index] = { ...next[index], title: e.target.value }
                              setEditingProject((prev) => ({ ...prev, sections: next }))
                            }}
                            className={inputClass}
                            placeholder="e.g. Visual 1, Courtyard, Lobby…"
                          />
                        </Field>
                        <Field label="Section text" hint="Paragraph under the section title on the project page.">
                          <textarea
                            rows={4}
                            value={section.text || ''}
                            onChange={(e) => {
                              const next = [...(editingProject.sections || [])]
                              next[index] = { ...next[index], text: e.target.value }
                              setEditingProject((prev) => ({ ...prev, sections: next }))
                            }}
                            className={`${inputClass} resize-none`}
                            placeholder="Write the story for this section…"
                          />
                        </Field>
                        <Field label="Section media">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <MediaPreview src={section.media} />
                            <div className="min-w-0 flex-1 space-y-2">
                              <input
                                type="text"
                                value={section.media || ''}
                                onChange={(e) => {
                                  const next = [...(editingProject.sections || [])]
                                  next[index] = { ...next[index], media: e.target.value }
                                  setEditingProject((prev) => ({ ...prev, sections: next }))
                                }}
                                className={inputClass}
                                placeholder="Image / video URL"
                              />
                              <label className={`${btnGhost} inline-flex cursor-pointer items-center justify-center`}>
                                Upload
                                <input
                                  type="file"
                                  accept="image/*,video/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (!file) return
                                    storeFiles([file], ([url]) => {
                                      const next = [...(editingProject.sections || [])]
                                      next[index] = { ...next[index], media: url }
                                      setEditingProject((prev) => ({ ...prev, sections: next }))
                                    })
                                    e.target.value = ''
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        </Field>
                        <Field label="Caption under media">
                          <input
                            type="text"
                            value={section.caption || ''}
                            onChange={(e) => {
                              const next = [...(editingProject.sections || [])]
                              next[index] = { ...next[index], caption: e.target.value }
                              setEditingProject((prev) => ({ ...prev, sections: next }))
                            }}
                            className={inputClass}
                            placeholder="Short caption under the image"
                          />
                        </Field>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className={btnGhost}
                            disabled={index === 0}
                            onClick={() => {
                              const next = [...(editingProject.sections || [])]
                              if (index === 0) return
                              ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
                              setEditingProject((prev) => ({ ...prev, sections: next }))
                            }}
                          >
                            Up
                          </button>
                          <button
                            type="button"
                            className={btnGhost}
                            disabled={index === (editingProject.sections || []).length - 1}
                            onClick={() => {
                              const next = [...(editingProject.sections || [])]
                              if (index >= next.length - 1) return
                              ;[next[index + 1], next[index]] = [next[index], next[index + 1]]
                              setEditingProject((prev) => ({ ...prev, sections: next }))
                            }}
                          >
                            Down
                          </button>
                          <button
                            type="button"
                            className="rounded-xl border border-red-500/25 bg-red-500/10 px-3.5 py-2 text-[11px] font-bold tracking-wider text-red-300 uppercase hover:bg-red-500 hover:text-white"
                            onClick={() =>
                              setEditingProject((prev) => ({
                                ...prev,
                                sections: (prev.sections || []).filter((_, i) => i !== index),
                              }))
                            }
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3 rounded-2xl border border-white/10 bg-[#121212] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#e3943f]">
                    5. Extra gallery — unlimited
                  </p>
                  <span className="text-[12px] text-white/40">
                    {(editingProject.gallery || []).length} file{(editingProject.gallery || []).length === 1 ? '' : 's'}
                  </span>
                </div>
                <p className="text-[12px] text-white/45">
                  Extra photos/videos. Set TOC label (Visual 1, Courtyard…) + caption under image.
                  Multi-upload supported — no limit. If story sections are empty, gallery TOC labels show on the left.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={galleryUrlDraft}
                    onChange={(e) => setGalleryUrlDraft(e.target.value)}
                    placeholder="Paste image/video URL then Add"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    className={btnGhost}
                    onClick={() => {
                      const url = galleryUrlDraft.trim()
                      if (!url) return
                      setEditingProject((prev) => ({
                        ...prev,
                        gallery: [...(prev.gallery || []), { src: url, title: '', caption: '' }],
                      }))
                      setGalleryUrlDraft('')
                    }}
                  >
                    Add URL
                  </button>
                  <label className={`${btnPrimary} inline-flex cursor-pointer items-center justify-center`}>
                    Upload many
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => {
                        storeFiles(e.target.files, (urls) => {
                          setEditingProject((prev) => ({
                            ...prev,
                            gallery: [
                              ...(prev.gallery || []),
                              ...urls.map((src) => ({ src, title: '', caption: '' })),
                            ],
                          }))
                        })
                        e.target.value = ''
                      }}
                    />
                  </label>
                </div>

                {(editingProject.gallery || []).length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/15 px-4 py-8 text-center text-[12px] text-white/40">
                    No gallery files yet — add unlimited images or videos
                  </div>
                ) : (
                  <div className="space-y-2">
                    {(editingProject.gallery || []).map((item, index) => {
                      const row = normalizeGalleryItem(item)
                      return (
                        <div
                          key={`${row.src}-${index}`}
                          className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/30 p-3"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <MediaPreview src={row.src} />
                            <input
                              type="text"
                              value={row.src}
                              onChange={(e) => {
                                const next = [...(editingProject.gallery || [])].map(normalizeGalleryItem)
                                next[index] = { ...next[index], src: e.target.value }
                                setEditingProject((prev) => ({ ...prev, gallery: next }))
                              }}
                              className={`${inputClass} flex-1`}
                            />
                          </div>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <input
                              type="text"
                              value={row.title}
                              onChange={(e) => {
                                const next = [...(editingProject.gallery || [])].map(normalizeGalleryItem)
                                next[index] = { ...next[index], title: e.target.value }
                                setEditingProject((prev) => ({ ...prev, gallery: next }))
                              }}
                              placeholder={`TOC label (e.g. Visual ${index + 1})`}
                              className={inputClass}
                            />
                            <input
                              type="text"
                              value={row.caption}
                              onChange={(e) => {
                                const next = [...(editingProject.gallery || [])].map(normalizeGalleryItem)
                                next[index] = { ...next[index], caption: e.target.value }
                                setEditingProject((prev) => ({ ...prev, gallery: next }))
                              }}
                              placeholder="Caption under this image"
                              className={inputClass}
                            />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              className={btnGhost}
                              disabled={index === 0}
                              onClick={() => {
                                const next = [...(editingProject.gallery || [])]
                                if (index === 0) return
                                ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
                                setEditingProject((prev) => ({ ...prev, gallery: next }))
                              }}
                            >
                              Up
                            </button>
                            <button
                              type="button"
                              className={btnGhost}
                              disabled={index === (editingProject.gallery || []).length - 1}
                              onClick={() => {
                                const next = [...(editingProject.gallery || [])]
                                if (index >= next.length - 1) return
                                ;[next[index + 1], next[index]] = [next[index], next[index + 1]]
                                setEditingProject((prev) => ({ ...prev, gallery: next }))
                              }}
                            >
                              Down
                            </button>
                            <button
                              type="button"
                              className="rounded-xl border border-red-500/25 bg-red-500/10 px-3.5 py-2 text-[11px] font-bold tracking-wider text-red-300 uppercase hover:bg-red-500 hover:text-white"
                              onClick={() =>
                                setEditingProject((prev) => ({
                                  ...prev,
                                  gallery: (prev.gallery || []).filter((_, i) => i !== index),
                                }))
                              }
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="space-y-3 rounded-2xl border border-white/10 bg-[#121212] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#e3943f]">
                  6. Page labels & buttons
                </p>
                <p className="text-[12px] text-white/45">
                  Every heading and CTA on the public project page can be changed here.
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="About heading">
                    <input
                      type="text"
                      value={editingProject.aboutHeading || ''}
                      onChange={(e) => setEditingProject((prev) => ({ ...prev, aboutHeading: e.target.value }))}
                      className={inputClass}
                      placeholder="About the project:"
                    />
                  </Field>
                  <Field label="Features card title">
                    <input
                      type="text"
                      value={editingProject.featuresTitle || ''}
                      onChange={(e) => setEditingProject((prev) => ({ ...prev, featuresTitle: e.target.value }))}
                      className={inputClass}
                      placeholder="Project features"
                    />
                  </Field>
                  <Field label="Enquire button">
                    <input
                      type="text"
                      value={editingProject.enquireLabel || ''}
                      onChange={(e) => setEditingProject((prev) => ({ ...prev, enquireLabel: e.target.value }))}
                      className={inputClass}
                      placeholder="Enquire"
                    />
                  </Field>
                  <Field label="Enquire link">
                    <input
                      type="text"
                      value={editingProject.enquireLink || ''}
                      onChange={(e) => setEditingProject((prev) => ({ ...prev, enquireLink: e.target.value }))}
                      className={inputClass}
                      placeholder="/contacts"
                    />
                  </Field>
                  <Field label="TOC heading">
                    <input
                      type="text"
                      value={editingProject.tocHeading || ''}
                      onChange={(e) => setEditingProject((prev) => ({ ...prev, tocHeading: e.target.value }))}
                      className={inputClass}
                      placeholder="Table of contents:"
                    />
                  </Field>
                  <Field label="360° heading">
                    <input
                      type="text"
                      value={editingProject.tour360Heading || ''}
                      onChange={(e) => setEditingProject((prev) => ({ ...prev, tour360Heading: e.target.value }))}
                      className={inputClass}
                      placeholder="360° experience"
                    />
                  </Field>
                  <Field label="Read also heading">
                    <input
                      type="text"
                      value={editingProject.readAlsoHeading || ''}
                      onChange={(e) => setEditingProject((prev) => ({ ...prev, readAlsoHeading: e.target.value }))}
                      className={inputClass}
                      placeholder="Read also:"
                    />
                  </Field>
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-white/10 bg-[#121212] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#e3943f]">
                  7. Bottom CTA block
                </p>
                <Field label="Eyebrow">
                  <input
                    type="text"
                    value={editingProject.closingEyebrow || ''}
                    onChange={(e) => setEditingProject((prev) => ({ ...prev, closingEyebrow: e.target.value }))}
                    className={inputClass}
                    placeholder="Unique Graphics®"
                  />
                </Field>
                <Field label="CTA title">
                  <input
                    type="text"
                    value={editingProject.closingTitle || ''}
                    onChange={(e) => setEditingProject((prev) => ({ ...prev, closingTitle: e.target.value }))}
                    className={inputClass}
                    placeholder="Step into the world of Unique Graphics®"
                  />
                </Field>
                <Field label="CTA text">
                  <textarea
                    rows={3}
                    value={editingProject.closingText || ''}
                    onChange={(e) => setEditingProject((prev) => ({ ...prev, closingText: e.target.value }))}
                    className={`${inputClass} resize-none`}
                  />
                </Field>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="CTA button label">
                    <input
                      type="text"
                      value={editingProject.closingButtonLabel || ''}
                      onChange={(e) =>
                        setEditingProject((prev) => ({ ...prev, closingButtonLabel: e.target.value }))
                      }
                      className={inputClass}
                      placeholder="Discuss this project"
                    />
                  </Field>
                  <Field label="CTA button link">
                    <input
                      type="text"
                      value={editingProject.closingButtonLink || ''}
                      onChange={(e) =>
                        setEditingProject((prev) => ({ ...prev, closingButtonLink: e.target.value }))
                      }
                      className={inputClass}
                      placeholder="/contacts"
                    />
                  </Field>
                </div>
              </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-[#0b0b0b]/95 px-4 py-3 backdrop-blur-md lg:left-[280px]">
            <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
              <p className="text-[12px] text-white/40">
                Apply saves here. Apply &amp; Publish updates the live project page.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" className={btnGhost} onClick={closeProjectEditor}>
                  Cancel
                </button>
                <button
                  type="button"
                  className={btnGhost}
                  disabled={uploading || loading}
                  onClick={() => saveProjectModal(false)}
                >
                  Apply
                </button>
                <button
                  type="button"
                  className={btnPrimary}
                  disabled={uploading || loading}
                  onClick={() => saveProjectModal(true)}
                >
                  {loading ? 'Publishing…' : 'Apply & Publish'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

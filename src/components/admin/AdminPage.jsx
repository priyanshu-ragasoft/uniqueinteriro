import { useState, useEffect } from 'react'
import { BLOG_POSTS } from '../blog/BlogPage'
import { DEFAULT_PROJECTS_CONFIG, STAT_ICONS } from '../Projects'
import { DEFAULT_COMPLETED_PROJECTS_CONFIG } from '../CompletedProjects'
import { DEFAULT_DISCOVER_CONFIG } from '../Discover'
import { DEFAULT_CLIENTS_CONFIG } from '../Clients'
import { DEFAULT_RECOGNITION_CONFIG } from '../Recognition'
import { DEFAULT_EXPERT_STEPS_CONFIG } from '../ExpertSteps'
import { DEFAULT_DREAM_HOME_CONFIG } from '../DreamHome'
import { DEFAULT_CLOSING_CONFIG } from '../Closing'
import { FaInstagram, FaPinterest, FaVk, FaYoutube } from 'react-icons/fa'
import AboutPageManager from './AboutPageManager'
import PortfolioManager from './PortfolioManager'
import ServicesManager from './ServicesManager'
import ContactPageManager from './ContactPageManager'
import { getStoredContactConfig } from '../../data/contactConfig'
import { getStoredAboutConfig } from '../../data/aboutConfig'
import { getStoredPortfolioConfig } from '../../data/portfolioConfig'
import { getStoredServicesConfig } from '../../data/servicesConfig'
import { projects } from '../../data/projects'
import recognitionDefaultReel from '../../assets/Product/11593543-hd_1920_1080_30fps.mp4'
import LoopVideo from '../LoopVideo'

import areaIcon from '../../assets/icons/avrproj.png'
import recommendIcon from '../../assets/icons/customerrecomadation.png'
import manufacturingIcon from '../../assets/icons/manufacturing.png'
import rewardIcon from '../../assets/icons/reward.png'
import globeImage from '../../assets/hero/globe.png'

import { API_BASE_URL } from '../../config/api.js'

const LUXURY_IMAGE_PRESETS = [
  { label: 'Desert Villa (Dubai)', url: '/architectural/dubai_villa.jpg' },
  { label: 'Monaco Penthouse', url: '/interior/monaco.jpg' },
  { label: 'Hotel Atrium (Commercial)', url: '/commercial/atrium.jpg' },
  { label: 'Courchevel Alpine Chalet', url: '/architectural/courchevel_chalet.jpg' },
  { label: 'Italian Bespoke Millwork', url: '/interior/beverly.jpg' },
  { label: 'Tokyo Atrium / Lighting', url: '/commercial/tokyo.jpg' },
  { label: 'Miami Oceanfront Villa', url: '/interior/miami.jpg' },
  { label: 'Hydrothermal Basalt Spa', url: '/commercial/spa_belgrade.jpg' },
]

const BANNER_MEDIA_PRESETS = [
  { label: 'Cinematic Loop 1 (Interior Living)', type: 'video', url: '/video/1.mp4' },
  { label: 'Cinematic Loop 2 (Glazing Facade)', type: 'video', url: '/video/2.mp4' },
  { label: 'Cinematic Loop 3 (Grand Atrium)', type: 'video', url: '/video/4.mp4' },
  { label: 'Monumental Desert Villa', type: 'image', url: '/architectural/dubai_villa.jpg' },
  { label: 'Neo-Monaco Penthouse', type: 'image', url: '/interior/monaco.jpg' },
  { label: 'Alpine Ski Chalet Spa', type: 'image', url: '/architectural/courchevel_chalet.jpg' },
  { label: 'Biophilic Hotel Atrium', type: 'image', url: '/commercial/atrium.jpg' },
  { label: 'Studio Masterpiece Hero', type: 'image', url: '/hero.jpg' },
]

const INITIAL_INQUIRIES = []

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const savedToken = localStorage.getItem('ug_admin_token')
      const loggedIn = localStorage.getItem('ug_admin_logged_in')
      return Boolean(savedToken || loggedIn === 'true')
    } catch {
      return false
    }
  })
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('ug_admin_user')
      if (savedUser) return JSON.parse(savedUser)
    } catch { }
    return { name: 'Executive Administrator', email: 'admin@uniquegraphics.com', role: 'superadmin' }
  })
  const [token, setToken] = useState(() => localStorage.getItem('ug_admin_token') || '')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [inquiries, setInquiries] = useState(() => {
    try {
      const saved = localStorage.getItem('ug_client_inquiries')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          // Filter out all dummy/static inquiries
          const clean = parsed.filter(
            (i) =>
              !['INQ-9481', 'INQ-9480', 'INQ-9479', 'INQ-9478'].includes(i.id) &&
              !['Al Maktoum Holdings', 'Lord Harrington Private Office', 'Chalet Mont-Blanc Group', 'Dr. Kenji & Associates'].includes(i.client)
          )
          localStorage.setItem('ug_client_inquiries', JSON.stringify(clean))
          return clean
        }
      }
    } catch { }
    return []
  })
  const [serverOnline, setServerOnline] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [inquirySearch, setInquirySearch] = useState('')
  const [inquiryFilter, setInquiryFilter] = useState('ALL')
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [activeToast, setActiveToast] = useState('')

  // ADMIN ACCOUNT & SECURITY SETTINGS STATE
  const [settingsName, setSettingsName] = useState(() => adminUser?.name || 'Executive Administrator')
  const [settingsEmail, setSettingsEmail] = useState(() => adminUser?.email || 'admin@uniquegraphics.com')
  const [settingsCurrentPassword, setSettingsCurrentPassword] = useState('')
  const [settingsNewPassword, setSettingsNewPassword] = useState('')
  const [settingsConfirmPassword, setSettingsConfirmPassword] = useState('')
  const [showSettingsCurrentPass, setShowSettingsCurrentPass] = useState(false)
  const [showSettingsNewPass, setShowSettingsNewPass] = useState(false)
  const [showSettingsConfirmPass, setShowSettingsConfirmPass] = useState(false)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsError, setSettingsError] = useState('')
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState('')

  // MANUAL CONTACT ENTRY STATE
  const [newInquiryModalOpen, setNewInquiryModalOpen] = useState(false)
  const [inquiryFormData, setInquiryFormData] = useState({
    client: '',
    phone: '',
    email: '',
    location: '',
    projectType: 'Monumental Villa',
    budget: '$5M - $10M',
    message: '',
    source: 'Direct Phone / Studio Call',
  })
  const [inquirySaving, setInquirySaving] = useState(false)

  // DYNAMIC BLOG MANAGEMENT STATE (Website & MongoDB Integrated)
  const [blogs, setBlogs] = useState(() => {
    try {
      const saved = localStorage.getItem('ug_studio_blogs')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch { }
    return BLOG_POSTS
  })
  const [blogFilter, setBlogFilter] = useState('All')
  const [blogSearch, setBlogSearch] = useState('')
  const [blogModalOpen, setBlogModalOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [blogSaving, setBlogSaving] = useState(false)
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    category: 'Architecture',
    tag: 'Cover Story',
    author: 'Unique Graphics Architectural Board',
    readTime: '6 min read',
    excerpt: '',
    image: '/architectural/dubai_villa.jpg',
    content: '',
    published: true,
    featured: false,
  })

  // Dynamic Blog Page & Hero Banner Settings State
  const [bannerModalOpen, setBannerModalOpen] = useState(false)
  const [bannerSettings, setBannerSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('ug_blog_banner_config')
      if (saved) return JSON.parse(saved)
    } catch { }
    return {
      badge: 'STUDIO JOURNAL & PUBLICATIONS',
      title: 'Architectural Insights & Design Discourse',
      subtitle:
        'Curated explorations into monumental architecture, rare materials, private residences, and visionary interior spatial philosophy crafted by the Unique Graphics studio.',
      newsletterTitle: 'Subscribe to Architectural Monograph Releases',
      newsletterSubtitle:
        'Receive private quarterly retrospectives, material sourcing guides, and invitations to our international design symposiums directly in your inbox.',
      mediaType: 'video',
      mediaUrl: '/video/1.mp4',
    }
  })

  // Dynamic Homepage Hero Banner State
  const [heroBannerConfig, setHeroBannerConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('ug_homepage_hero_config')
      if (saved) return JSON.parse(saved)
    } catch { }
    return {
      title: 'Unique Graphics',
      subtitle: 'Leading international bureau for premium architectural and interior design',
      buttonText: 'Discuss your project',
      buttonLink: '/contacts',
      mediaType: 'video',
      mediaUrl: '/video/4.mp4',
    }
  })
  const [heroBannerSaving, setHeroBannerSaving] = useState(false)

  const showToast = (msg) => {
    setActiveToast(msg)
    setTimeout(() => setActiveToast(''), 3000)
  }

  // Live Section Update & Modification Audit Tracker ("Kaun si cheez kab update hui hai")
  const recordSectionUpdate = (sectionId, sectionName, changeSummary) => {
    try {
      const now = new Date()
      const timeStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' • ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      const raw = localStorage.getItem('ug_section_timestamps')
      const timestamps = raw ? JSON.parse(raw) : {}
      timestamps[sectionId] = { time: timeStr, summary: changeSummary }
      localStorage.setItem('ug_section_timestamps', JSON.stringify(timestamps))

      const rawLogs = localStorage.getItem('ug_activity_changelog')
      const logs = rawLogs ? JSON.parse(rawLogs) : []
      logs.unshift({
        id: `log-${Date.now()}`,
        sectionId,
        sectionName,
        time: timeStr,
        timestamp: Date.now(),
        detail: changeSummary
      })
      localStorage.setItem('ug_activity_changelog', JSON.stringify(logs.slice(0, 50)))
      window.dispatchEvent(new Event('ug_audit_updated'))
    } catch (e) {
      console.warn('Audit record error:', e)
    }
  }

  const getSectionUpdateInfo = (sectionId, fallbackTime, fallbackSummary) => {
    try {
      const raw = localStorage.getItem('ug_section_timestamps')
      if (raw) {
        const timestamps = JSON.parse(raw)
        if (timestamps[sectionId]) {
          return {
            time: timestamps[sectionId].time || timestamps[sectionId],
            summary: timestamps[sectionId].summary || fallbackSummary
          }
        }
      }
    } catch (e) { }
    return { time: fallbackTime, summary: fallbackSummary }
  }

  // Interactive Overview States (Filters & Real-Time Search)
  const [overviewFilter, setOverviewFilter] = useState('all')
  const [overviewSearch, setOverviewSearch] = useState('')

  // Fetch Homepage Hero Banner settings from backend MongoDB
  const fetchHeroBannerSettings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/blogs/settings/hero`)
      const result = await res.json()
      if (result.success && result.data) {
        setHeroBannerConfig(result.data)
        localStorage.setItem('ug_homepage_hero_config', JSON.stringify(result.data))
      }
    } catch { }
  }

  // Save Homepage Hero Banner settings to API and localStorage
  const handleSaveHeroBanner = async (e) => {
    if (e) e.preventDefault()
    setHeroBannerSaving(true)

    try {
      if (serverOnline && token) {
        const res = await fetch(`${API_BASE_URL}/blogs/settings/hero`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(heroBannerConfig),
        })
        const data = await res.json()
        if (data.success && data.data) {
          setHeroBannerConfig(data.data)
          localStorage.setItem('ug_homepage_hero_config', JSON.stringify(data.data))
          window.dispatchEvent(new Event('ug_hero_updated'))
          showToast('Homepage Hero Banner updated live on website!')
          setHeroBannerSaving(false)
          return
        }
      }
    } catch (err) {
      console.warn('API save error:', err)
    }

    localStorage.setItem('ug_homepage_hero_config', JSON.stringify(heroBannerConfig))
    window.dispatchEvent(new Event('ug_hero_updated'))
    showToast('Homepage Hero Banner saved!')
    setHeroBannerSaving(false)
  }

  // Upload custom file for Homepage Hero (Image or Video)
  const handleHeroFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isVideo = file.type.startsWith('video/')
    const reader = new FileReader()
    reader.onload = (event) => {
      setHeroBannerConfig((prev) => ({
        ...prev,
        mediaType: isVideo ? 'video' : 'image',
        mediaUrl: event.target.result,
      }))
      showToast(`${isVideo ? 'Video' : 'Image'} uploaded! Click "Save & Publish" to activate.`)
    }
    reader.readAsDataURL(file)
  }

  // Dynamic Global Projects & 32 Countries Section State
  const [projectsConfig, setProjectsConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('ug_homepage_projects_config')
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          en: { ...DEFAULT_PROJECTS_CONFIG.en, ...(parsed.en || parsed) },
          ru: { ...DEFAULT_PROJECTS_CONFIG.ru, ...(parsed.ru || parsed) },
          globeImage: parsed.globeImage || '',
        }
      }
    } catch { }
    return DEFAULT_PROJECTS_CONFIG
  })
  const [projectsLang, setProjectsLang] = useState('en')
  const [projectsSectionSaving, setProjectsSectionSaving] = useState(false)

  // Fetch Homepage Projects settings from backend MongoDB
  const fetchProjectsSettings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/blogs/settings/projects-section`)
      const result = await res.json()
      if (result.success && result.data) {
        const merged = {
          en: { ...DEFAULT_PROJECTS_CONFIG.en, ...(result.data.en || result.data) },
          ru: { ...DEFAULT_PROJECTS_CONFIG.ru, ...(result.data.ru || result.data) },
          globeImage: result.data.globeImage || '',
        }
        setProjectsConfig(merged)
        localStorage.setItem('ug_homepage_projects_config', JSON.stringify(result.data))
      }
    } catch { }
  }

  // Save Homepage Projects settings to API and localStorage
  const handleSaveProjectsSection = async (e) => {
    if (e) e.preventDefault()
    setProjectsSectionSaving(true)

    try {
      if (serverOnline && token) {
        const res = await fetch(`${API_BASE_URL}/blogs/settings/projects-section`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(projectsConfig),
        })
        const data = await res.json()
        if (data.success && data.data) {
          const merged = {
            en: { ...DEFAULT_PROJECTS_CONFIG.en, ...(data.data.en || data.data) },
            ru: { ...DEFAULT_PROJECTS_CONFIG.ru, ...(data.data.ru || data.data) },
            globeImage: data.data.globeImage || '',
          }
          setProjectsConfig(merged)
          localStorage.setItem('ug_homepage_projects_config', JSON.stringify(data.data))
          window.dispatchEvent(new Event('ug_projects_updated'))
          showToast('Global Projects (32 Countries) & Stats updated live on website!')
          setProjectsSectionSaving(false)
          return
        }
      }
    } catch (err) {
      console.warn('Projects API save error:', err)
    }

    localStorage.setItem('ug_homepage_projects_config', JSON.stringify(projectsConfig))
    window.dispatchEvent(new Event('ug_projects_updated'))
    showToast('Global Projects & Stats saved!')
    setProjectsSectionSaving(false)
  }

  const handleGlobeFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setProjectsConfig((prev) => ({
        ...prev,
        globeImage: event.target.result,
        [projectsLang]: {
          ...prev[projectsLang],
          globeImage: event.target.result,
        },
      }))
      showToast('Custom Globe image uploaded! Click "Save & Publish" to activate.')
    }
    reader.readAsDataURL(file)
  }

  const updateCurrentProjectText = (key, val) => {
    setProjectsConfig((prev) => ({
      ...prev,
      [projectsLang]: {
        ...prev[projectsLang],
        [key]: val,
      },
    }))
  }

  const updateCurrentProjectStat = (index, field, val) => {
    setProjectsConfig((prev) => {
      const currentStats = [...(prev[projectsLang]?.stats || DEFAULT_PROJECTS_CONFIG[projectsLang].stats)]
      currentStats[index] = {
        ...currentStats[index],
        [field]: val,
      }
      return {
        ...prev,
        [projectsLang]: {
          ...prev[projectsLang],
          stats: currentStats,
        },
      }
    })
  }

  // Dynamic 650+ Completed Projects Gallery State
  const [completedProjectsConfig, setCompletedProjectsConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('ug_completed_projects_config')
      if (saved) return JSON.parse(saved)
    } catch { }
    return DEFAULT_COMPLETED_PROJECTS_CONFIG
  })
  const [completedLang, setCompletedLang] = useState('en')
  const [completedProjectsSaving, setCompletedProjectsSaving] = useState(false)
  const [projectModalOpen, setProjectModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [projectSearch, setProjectSearch] = useState('')
  const [projectCatFilter, setProjectCatFilter] = useState('all')
  const [projectFormData, setProjectFormData] = useState({
    id: '',
    cat: 'living',
    video: '/video/1.mp4',
    titleEn: '',
    titleRu: '',
    summaryEn: '',
    summaryRu: '',
    scopeEn: '',
    scopeRu: '',
    detailEn: '',
    detailRu: '',
  })
  const [newCatOpen, setNewCatOpen] = useState(false)
  const [newCatData, setNewCatData] = useState({
    id: '',
    labelEn: '',
    labelRu: '',
  })

  const handleAddCategory = (e) => {
    if (e) e.preventDefault()
    const labelEn = newCatData.labelEn.trim()
    if (!labelEn) {
      showToast('Category name is required.')
      return
    }
    const catId = (newCatData.id.trim() || labelEn.toLowerCase().replace(/[^a-z0-9]+/g, '-')).trim()
    const labelRu = newCatData.labelRu.trim() || labelEn

    const currentEn = completedProjectsConfig.categories?.en || DEFAULT_COMPLETED_PROJECTS_CONFIG.categories.en
    const currentRu = completedProjectsConfig.categories?.ru || DEFAULT_COMPLETED_PROJECTS_CONFIG.categories.ru

    if (currentEn.some(([id]) => id === catId)) {
      showToast(`Category ID "${catId}" already exists.`)
      return
    }

    const updatedCategories = {
      en: [...currentEn, [catId, labelEn]],
      ru: [...currentRu, [catId, labelRu]],
    }

    setCompletedProjectsConfig((prev) => ({
      ...prev,
      categories: updatedCategories,
    }))

    setNewCatData({ id: '', labelEn: '', labelRu: '' })
    setNewCatOpen(false)
    showToast(`Category "${labelEn}" added! Click "Save & Publish" to activate.`)
  }

  const handleDeleteCategory = (catId, catLabel) => {
    if (catId === 'all') {
      showToast('The "All" category is required and cannot be removed.')
      return
    }
    if (!window.confirm(`Delete category "${catLabel}"? Projects with this category will not be deleted.`)) return

    const currentEn = completedProjectsConfig.categories?.en || DEFAULT_COMPLETED_PROJECTS_CONFIG.categories.en
    const currentRu = completedProjectsConfig.categories?.ru || DEFAULT_COMPLETED_PROJECTS_CONFIG.categories.ru

    const updatedCategories = {
      en: currentEn.filter(([id]) => id !== catId),
      ru: currentRu.filter(([id]) => id !== catId),
    }

    setCompletedProjectsConfig((prev) => ({
      ...prev,
      categories: updatedCategories,
    }))
    showToast(`Category "${catLabel}" deleted.`)
  }

  // Fetch Completed Projects settings from backend MongoDB
  const fetchCompletedProjectsSettings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/blogs/settings/completed-projects`)
      const result = await res.json()
      if (result.success && result.data) {
        setCompletedProjectsConfig(result.data)
        localStorage.setItem('ug_completed_projects_config', JSON.stringify(result.data))
      }
    } catch { }
  }

  // Save Completed Projects settings to API and localStorage
  const handleSaveCompletedProjects = async (e) => {
    if (e) e.preventDefault()
    setCompletedProjectsSaving(true)

    try {
      if (serverOnline && token) {
        const res = await fetch(`${API_BASE_URL}/blogs/settings/completed-projects`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(completedProjectsConfig),
        })
        const data = await res.json()
        if (data.success && data.data) {
          setCompletedProjectsConfig(data.data)
          localStorage.setItem('ug_completed_projects_config', JSON.stringify(data.data))
          window.dispatchEvent(new Event('ug_completed_projects_updated'))
          showToast('Completed Projects Gallery updated live on website!')
          setCompletedProjectsSaving(false)
          return
        }
      }
    } catch (err) {
      console.warn('Completed Projects API save error:', err)
    }

    localStorage.setItem('ug_completed_projects_config', JSON.stringify(completedProjectsConfig))
    window.dispatchEvent(new Event('ug_completed_projects_updated'))
    showToast('Completed Projects Gallery saved!')
    setCompletedProjectsSaving(false)
  }

  const updateCompletedCopy = (key, val) => {
    setCompletedProjectsConfig((prev) => ({
      ...prev,
      copy: {
        ...prev.copy,
        [completedLang]: {
          ...prev.copy[completedLang],
          [key]: val,
        },
      },
    }))
  }

  const openNewProjectModal = () => {
    setEditingProject(null)
    setProjectFormData({
      id: `project-${Date.now()}`,
      cat: 'living',
      video: '/video/1.mp4',
      titleEn: '',
      titleRu: '',
      summaryEn: '',
      summaryRu: '',
      scopeEn: 'Furniture layout, Daylight and lamps, Custom Joinery',
      scopeRu: 'Расстановка мебели, Дневной свет и лампы, Мебель на заказ',
      detailEn: '',
      detailRu: '',
    })
    setProjectModalOpen(true)
  }

  const openEditProjectModal = (proj) => {
    setEditingProject(proj)
    setProjectFormData({
      id: proj.id,
      cat: proj.cat || 'living',
      video: proj.video || '/video/1.mp4',
      titleEn: proj.en?.title || proj.title || '',
      titleRu: proj.ru?.title || '',
      summaryEn: proj.en?.summary || proj.summary || '',
      summaryRu: proj.ru?.summary || '',
      scopeEn: Array.isArray(proj.en?.scope) ? proj.en.scope.join(', ') : (proj.en?.scope || ''),
      scopeRu: Array.isArray(proj.ru?.scope) ? proj.ru.scope.join(', ') : (proj.ru?.scope || ''),
      detailEn: proj.en?.detail || proj.detail || '',
      detailRu: proj.ru?.detail || '',
    })
    setProjectModalOpen(true)
  }

  const handleSaveProjectModal = (e) => {
    e.preventDefault()
    if (!projectFormData.titleEn.trim()) {
      showToast('Project title is required.')
      return
    }

    const scopeArrayEn = projectFormData.scopeEn
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const scopeArrayRu = (projectFormData.scopeRu || projectFormData.scopeEn)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const updatedProjectItem = {
      id: projectFormData.id || `project-${Date.now()}`,
      cat: projectFormData.cat,
      video: projectFormData.video,
      en: {
        category: projectFormData.cat,
        title: projectFormData.titleEn,
        summary: projectFormData.summaryEn,
        detail: projectFormData.detailEn,
        scope: scopeArrayEn,
      },
      ru: {
        category: projectFormData.cat,
        title: projectFormData.titleRu || projectFormData.titleEn,
        summary: projectFormData.summaryRu || projectFormData.summaryEn,
        detail: projectFormData.detailRu || projectFormData.detailEn,
        scope: scopeArrayRu,
      },
    }

    const currentList = Array.isArray(completedProjectsConfig.projects) && completedProjectsConfig.projects.length > 0
      ? completedProjectsConfig.projects
      : DEFAULT_COMPLETED_PROJECTS_CONFIG.projects

    let newList
    if (editingProject) {
      newList = currentList.map((p) => (p.id === editingProject.id ? updatedProjectItem : p))
      showToast(`Project "${projectFormData.titleEn}" updated!`)
    } else {
      newList = [updatedProjectItem, ...currentList]
      showToast(`New project "${projectFormData.titleEn}" added!`)
    }

    const updatedConfig = {
      ...completedProjectsConfig,
      projects: newList,
    }

    setCompletedProjectsConfig(updatedConfig)
    localStorage.setItem('ug_completed_projects_config', JSON.stringify(updatedConfig))
    window.dispatchEvent(new Event('ug_completed_projects_updated'))
    setProjectModalOpen(false)
  }

  const handleDeleteProject = (projId, projTitle) => {
    if (!window.confirm(`Are you sure you want to delete project "${projTitle}"?`)) return
    const currentList = Array.isArray(completedProjectsConfig.projects) && completedProjectsConfig.projects.length > 0
      ? completedProjectsConfig.projects
      : DEFAULT_COMPLETED_PROJECTS_CONFIG.projects
    const newList = currentList.filter((p) => p.id !== projId)
    setCompletedProjectsConfig((prev) => ({
      ...prev,
      projects: newList,
    }))
    showToast(`Project "${projTitle}" removed.`)
  }

  const handleProjectVideoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setProjectFormData((prev) => ({
        ...prev,
        video: event.target.result,
      }))
      showToast('Project video clip uploaded successfully!')
    }
    reader.readAsDataURL(file)
  }

  // Dynamic Brand Sections State (Discover, Clients, Recognition, Expert Steps, Dream Home, Closing)
  const [brandSectionsConfig, setBrandSectionsConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('ug_brand_sections_config')
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          discover: {
            ...DEFAULT_DISCOVER_CONFIG,
            ...(parsed.discover || {}),
            en: { ...DEFAULT_DISCOVER_CONFIG.en, ...(parsed.discover?.en || {}) },
            ru: { ...DEFAULT_DISCOVER_CONFIG.ru, ...(parsed.discover?.ru || {}) },
          },
          clients: {
            ...DEFAULT_CLIENTS_CONFIG,
            ...(parsed.clients || {}),
            en: { ...DEFAULT_CLIENTS_CONFIG.en, ...(parsed.clients?.en || {}) },
            ru: { ...DEFAULT_CLIENTS_CONFIG.ru, ...(parsed.clients?.ru || {}) },
            brands: Array.isArray(parsed.clients?.brands) ? parsed.clients.brands : DEFAULT_CLIENTS_CONFIG.brands,
          },
          recognition: {
            ...DEFAULT_RECOGNITION_CONFIG,
            ...(parsed.recognition || {}),
            en: { ...DEFAULT_RECOGNITION_CONFIG.en, ...(parsed.recognition?.en || {}) },
            ru: { ...DEFAULT_RECOGNITION_CONFIG.ru, ...(parsed.recognition?.ru || {}) },
            socials: { ...DEFAULT_RECOGNITION_CONFIG.socials, ...(parsed.recognition?.socials || {}) },
          },
          expertSteps: {
            ...DEFAULT_EXPERT_STEPS_CONFIG,
            ...(parsed.expertSteps || {}),
            en: { ...DEFAULT_EXPERT_STEPS_CONFIG.en, ...(parsed.expertSteps?.en || {}) },
            ru: { ...DEFAULT_EXPERT_STEPS_CONFIG.ru, ...(parsed.expertSteps?.ru || {}) },
          },
          dreamHome: {
            ...DEFAULT_DREAM_HOME_CONFIG,
            ...(parsed.dreamHome || {}),
            en: { ...DEFAULT_DREAM_HOME_CONFIG.en, ...(parsed.dreamHome?.en || {}) },
            ru: { ...DEFAULT_DREAM_HOME_CONFIG.ru, ...(parsed.dreamHome?.ru || {}) },
          },
          closing: {
            ...DEFAULT_CLOSING_CONFIG,
            ...(parsed.closing || {}),
            en: { ...DEFAULT_CLOSING_CONFIG.en, ...(parsed.closing?.en || {}) },
            ru: { ...DEFAULT_CLOSING_CONFIG.ru, ...(parsed.closing?.ru || {}) },
          },
        }
      }
    } catch { }
    return {
      discover: DEFAULT_DISCOVER_CONFIG,
      clients: DEFAULT_CLIENTS_CONFIG,
      recognition: DEFAULT_RECOGNITION_CONFIG,
      expertSteps: DEFAULT_EXPERT_STEPS_CONFIG,
      dreamHome: DEFAULT_DREAM_HOME_CONFIG,
      closing: DEFAULT_CLOSING_CONFIG,
    }
  })
  const [brandSubTab, setBrandSubTab] = useState('discover') // 'discover' | 'clients' | 'recognition' | 'expertSteps' | 'dreamHome' | 'closing'
  const [brandLang, setBrandLang] = useState('en')
  const [brandSaving, setBrandSaving] = useState(false)
  const [newBrandForm, setNewBrandForm] = useState({
    type: 'text',
    name: '',
    sub: '',
    bold: true,
  })

  // Fetch Homepage Brand Sections settings from MongoDB backend
  const fetchBrandSectionsSettings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/blogs/settings/brand-sections`)
      const result = await res.json()
      if (result.success && result.data) {
        const merged = {
          discover: {
            ...DEFAULT_DISCOVER_CONFIG,
            ...(result.data.discover || {}),
            en: { ...DEFAULT_DISCOVER_CONFIG.en, ...(result.data.discover?.en || {}) },
            ru: { ...DEFAULT_DISCOVER_CONFIG.ru, ...(result.data.discover?.ru || {}) },
          },
          clients: {
            ...DEFAULT_CLIENTS_CONFIG,
            ...(result.data.clients || {}),
            en: { ...DEFAULT_CLIENTS_CONFIG.en, ...(result.data.clients?.en || {}) },
            ru: { ...DEFAULT_CLIENTS_CONFIG.ru, ...(result.data.clients?.ru || {}) },
            brands: Array.isArray(result.data.clients?.brands) ? result.data.clients.brands : DEFAULT_CLIENTS_CONFIG.brands,
          },
          recognition: {
            ...DEFAULT_RECOGNITION_CONFIG,
            ...(result.data.recognition || {}),
            en: { ...DEFAULT_RECOGNITION_CONFIG.en, ...(result.data.recognition?.en || {}) },
            ru: { ...DEFAULT_RECOGNITION_CONFIG.ru, ...(result.data.recognition?.ru || {}) },
            socials: { ...DEFAULT_RECOGNITION_CONFIG.socials, ...(result.data.recognition?.socials || {}) },
          },
          expertSteps: {
            ...DEFAULT_EXPERT_STEPS_CONFIG,
            ...(result.data.expertSteps || {}),
            en: { ...DEFAULT_EXPERT_STEPS_CONFIG.en, ...(result.data.expertSteps?.en || {}) },
            ru: { ...DEFAULT_EXPERT_STEPS_CONFIG.ru, ...(result.data.expertSteps?.ru || {}) },
          },
          dreamHome: {
            ...DEFAULT_DREAM_HOME_CONFIG,
            ...(result.data.dreamHome || {}),
            en: { ...DEFAULT_DREAM_HOME_CONFIG.en, ...(result.data.dreamHome?.en || {}) },
            ru: { ...DEFAULT_DREAM_HOME_CONFIG.ru, ...(result.data.dreamHome?.ru || {}) },
          },
          closing: {
            ...DEFAULT_CLOSING_CONFIG,
            ...(result.data.closing || {}),
            en: { ...DEFAULT_CLOSING_CONFIG.en, ...(result.data.closing?.en || {}) },
            ru: { ...DEFAULT_CLOSING_CONFIG.ru, ...(result.data.closing?.ru || {}) },
          },
        }
        setBrandSectionsConfig(merged)
        localStorage.setItem('ug_brand_sections_config', JSON.stringify(result.data))
      }
    } catch { }
  }

  // Save Brand Sections settings to API and localStorage
  const handleSaveBrandSections = async (e) => {
    if (e) e.preventDefault()
    setBrandSaving(true)

    try {
      if (serverOnline && token) {
        const res = await fetch(`${API_BASE_URL}/blogs/settings/brand-sections`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(brandSectionsConfig),
        })
        const data = await res.json()
        if (data.success && data.data) {
          const merged = {
            discover: {
              ...DEFAULT_DISCOVER_CONFIG,
              ...(data.data.discover || {}),
              en: { ...DEFAULT_DISCOVER_CONFIG.en, ...(data.data.discover?.en || {}) },
              ru: { ...DEFAULT_DISCOVER_CONFIG.ru, ...(data.data.discover?.ru || {}) },
            },
            clients: {
              ...DEFAULT_CLIENTS_CONFIG,
              ...(data.data.clients || {}),
              en: { ...DEFAULT_CLIENTS_CONFIG.en, ...(data.data.clients?.en || {}) },
              ru: { ...DEFAULT_CLIENTS_CONFIG.ru, ...(data.data.clients?.ru || {}) },
              brands: Array.isArray(data.data.clients?.brands) ? data.data.clients.brands : DEFAULT_CLIENTS_CONFIG.brands,
            },
            recognition: {
              ...DEFAULT_RECOGNITION_CONFIG,
              ...(data.data.recognition || {}),
              en: { ...DEFAULT_RECOGNITION_CONFIG.en, ...(data.data.recognition?.en || {}) },
              ru: { ...DEFAULT_RECOGNITION_CONFIG.ru, ...(data.data.recognition?.ru || {}) },
              socials: { ...DEFAULT_RECOGNITION_CONFIG.socials, ...(data.data.recognition?.socials || {}) },
            },
            expertSteps: {
              ...DEFAULT_EXPERT_STEPS_CONFIG,
              ...(data.data.expertSteps || {}),
              en: { ...DEFAULT_EXPERT_STEPS_CONFIG.en, ...(data.data.expertSteps?.en || {}) },
              ru: { ...DEFAULT_EXPERT_STEPS_CONFIG.ru, ...(data.data.expertSteps?.ru || {}) },
            },
            dreamHome: {
              ...DEFAULT_DREAM_HOME_CONFIG,
              ...(data.data.dreamHome || {}),
              en: { ...DEFAULT_DREAM_HOME_CONFIG.en, ...(data.data.dreamHome?.en || {}) },
              ru: { ...DEFAULT_DREAM_HOME_CONFIG.ru, ...(data.data.dreamHome?.ru || {}) },
            },
            closing: {
              ...DEFAULT_CLOSING_CONFIG,
              ...(data.data.closing || {}),
              en: { ...DEFAULT_CLOSING_CONFIG.en, ...(data.data.closing?.en || {}) },
              ru: { ...DEFAULT_CLOSING_CONFIG.ru, ...(data.data.closing?.ru || {}) },
            },
          }
          setBrandSectionsConfig(merged)
          localStorage.setItem('ug_brand_sections_config', JSON.stringify(data.data))
          window.dispatchEvent(new Event('ug_brand_updated'))
          showToast('Brand & Showcase sections published live on website!')
          setBrandSaving(false)
          return
        }
      }
    } catch (err) {
      console.warn('Brand sections API save error:', err)
    }

    localStorage.setItem('ug_brand_sections_config', JSON.stringify(brandSectionsConfig))
    window.dispatchEvent(new Event('ug_brand_updated'))
    showToast('Brand & Showcase sections updated locally!')
    setBrandSaving(false)
  }

  // Discover Section Field Updaters
  const updateDiscoverCopy = (key, val) => {
    setBrandSectionsConfig((prev) => ({
      ...prev,
      discover: {
        ...prev.discover,
        [brandLang]: {
          ...prev.discover[brandLang],
          [key]: val,
        },
      },
    }))
  }

  const handleDiscoverMediaUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setBrandSectionsConfig((prev) => ({
        ...prev,
        discover: {
          ...prev.discover,
          mediaUrl: event.target.result,
        },
      }))
      showToast('Discover video/image uploaded! Click "Save & Publish" to activate.')
    }
    reader.readAsDataURL(file)
  }

  // Clients Section Field Updaters
  const updateClientsCopy = (key, val) => {
    setBrandSectionsConfig((prev) => ({
      ...prev,
      clients: {
        ...prev.clients,
        [brandLang]: {
          ...prev.clients[brandLang],
          [key]: val,
        },
      },
    }))
  }

  const handleAddClientBrand = (e) => {
    if (e) e.preventDefault()
    if (!newBrandForm.name.trim()) {
      showToast('Please enter brand name or logo text.')
      return
    }
    const brandItem = {
      type: newBrandForm.type,
      name: newBrandForm.name.trim(),
      ...(newBrandForm.sub ? { sub: newBrandForm.sub.trim() } : {}),
      ...(newBrandForm.bold ? { bold: true } : {}),
    }

    setBrandSectionsConfig((prev) => ({
      ...prev,
      clients: {
        ...prev.clients,
        brands: [...(prev.clients.brands || []), brandItem],
      },
    }))

    setNewBrandForm({ type: 'text', name: '', sub: '', bold: true })
    showToast(`Brand "${brandItem.name}" added to Clients bar!`)
  }

  const handleRemoveClientBrand = (index) => {
    setBrandSectionsConfig((prev) => {
      const current = [...(prev.clients.brands || [])]
      current.splice(index, 1)
      return {
        ...prev,
        clients: {
          ...prev.clients,
          brands: current,
        },
      }
    })
    showToast('Brand removed from list.')
  }

  const handleResetClientBrands = () => {
    setBrandSectionsConfig((prev) => ({
      ...prev,
      clients: {
        ...prev.clients,
        brands: DEFAULT_CLIENTS_CONFIG.brands,
      },
    }))
    showToast('Reset to default studio client brands.')
  }

  // Recognition Section Field Updaters
  const updateRecognitionCopy = (key, val) => {
    setBrandSectionsConfig((prev) => ({
      ...prev,
      recognition: {
        ...prev.recognition,
        [brandLang]: {
          ...prev.recognition[brandLang],
          [key]: val,
        },
      },
    }))
  }

  const updateRecognitionSocial = (platform, val) => {
    setBrandSectionsConfig((prev) => ({
      ...prev,
      recognition: {
        ...prev.recognition,
        socials: {
          ...prev.recognition.socials,
          [platform]: val,
        },
      },
    }))
  }

  const handleRecognitionMediaUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setBrandSectionsConfig((prev) => ({
        ...prev,
        recognition: {
          ...prev.recognition,
          mediaUrl: event.target.result,
        },
      }))
      showToast('Recognition background video/image uploaded! Click "Save & Publish" to activate.')
    }
    reader.readAsDataURL(file)
  }

  // Expert Steps Section Field Updaters
  const updateExpertStepsCopy = (key, val) => {
    setBrandSectionsConfig((prev) => ({
      ...prev,
      expertSteps: {
        ...prev.expertSteps,
        [brandLang]: {
          ...prev.expertSteps[brandLang],
          [key]: val,
        },
      },
    }))
  }

  const updateExpertStepItem = (stepIndex, field, val) => {
    setBrandSectionsConfig((prev) => {
      const currentSteps = [...(prev.expertSteps[brandLang]?.steps || DEFAULT_EXPERT_STEPS_CONFIG[brandLang].steps)]
      currentSteps[stepIndex] = {
        ...currentSteps[stepIndex],
        [field]: val,
      }
      return {
        ...prev,
        expertSteps: {
          ...prev.expertSteps,
          [brandLang]: {
            ...prev.expertSteps[brandLang],
            steps: currentSteps,
          },
        },
      }
    })
  }

  // Dream Home Section Field Updaters
  const updateDreamHomeCopy = (key, val) => {
    setBrandSectionsConfig((prev) => ({
      ...prev,
      dreamHome: {
        ...prev.dreamHome,
        [brandLang]: {
          ...prev.dreamHome[brandLang],
          [key]: val,
        },
      },
    }))
  }

  const handleDreamHomeMediaUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setBrandSectionsConfig((prev) => ({
        ...prev,
        dreamHome: {
          ...prev.dreamHome,
          mediaUrl: event.target.result,
        },
      }))
      showToast('Dream Home visual uploaded! Click "Save & Publish" to activate.')
    }
    reader.readAsDataURL(file)
  }

  // Closing Section Field Updaters
  const updateClosingCopy = (key, val) => {
    setBrandSectionsConfig((prev) => ({
      ...prev,
      closing: {
        ...prev.closing,
        [brandLang]: {
          ...prev.closing[brandLang],
          [key]: val,
        },
      },
    }))
  }

  const updateClosingSetting = (key, val) => {
    setBrandSectionsConfig((prev) => ({
      ...prev,
      closing: {
        ...prev.closing,
        [key]: val,
      },
    }))
  }

  const handleClosingLogoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setBrandSectionsConfig((prev) => ({
        ...prev,
        closing: {
          ...prev.closing,
          logoUrl: event.target.result,
        },
      }))
      showToast('Studio logo uploaded! Click "Save & Publish" to activate.')
    }
    reader.readAsDataURL(file)
  }

  const handleStatusChange = async (inquiryId, newStatus) => {
    let updatedStatusColor = 'text-[#e3943f] border-[#e3943f]/40 bg-[#e3943f]/10'
    if (newStatus === 'Offer Sent') updatedStatusColor = 'text-blue-400 border-blue-400/30 bg-blue-400/10'
    if (newStatus === 'In Review') updatedStatusColor = 'text-amber-300 border-amber-300/30 bg-amber-300/10'
    if (newStatus === 'Contract Signed') updatedStatusColor = 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'

    setInquiries((prev) =>
      prev.map((inq) =>
        inq.id === inquiryId ? { ...inq, status: newStatus, statusColor: updatedStatusColor } : inq
      )
    )

    showToast(`Inquiry ${inquiryId} updated to "${newStatus}"`)

    try {
      if (serverOnline && token) {
        await fetch(`${API_BASE_URL}/inquiries/${inquiryId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        })
      }
    } catch {
      // Offline fallback
    }
  }

  // Fetch live blogs from MongoDB API with public site sync
  const fetchBlogs = async (authToken) => {
    try {
      const res = await fetch(`${API_BASE_URL}/blogs?published=all`, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      })
      const result = await res.json()
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        setBlogs(result.data)
        localStorage.setItem('ug_studio_blogs', JSON.stringify(result.data))
        setServerOnline(true)
      }
    } catch {
      // offline fallback maintains localStorage
    }
  }

  // Fetch live blog banner configuration from backend MongoDB
  const fetchBannerSettings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/blogs/settings/banner`)
      const result = await res.json()
      if (result.success && result.data) {
        setBannerSettings(result.data)
        localStorage.setItem('ug_blog_banner_config', JSON.stringify(result.data))
      }
    } catch { }
  }

  // Verify stored token on initial load
  useEffect(() => {
    fetchBannerSettings()
    fetchHeroBannerSettings()
    fetchProjectsSettings()
    fetchCompletedProjectsSettings()
    fetchBrandSectionsSettings()
    const verifySavedSession = async () => {
      const savedToken = localStorage.getItem('ug_admin_token')
      const loggedIn = localStorage.getItem('ug_admin_logged_in')
      if (!savedToken && loggedIn !== 'true') return

      // Keep admin authenticated immediately across all page reloads & refreshes
      setIsAuthenticated(true)

      try {
        if (savedToken && !savedToken.startsWith('ug_vault_session_')) {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 3500)

          const res = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${savedToken}`,
            },
            signal: controller.signal,
          })
          clearTimeout(timeoutId)

          if (res.ok) {
            const data = await res.json()
            if (data.success && data.admin) {
              setAdminUser(data.admin)
              localStorage.setItem('ug_admin_user', JSON.stringify(data.admin))
              localStorage.setItem('ug_admin_logged_in', 'true')
              setIsAuthenticated(true)
              setServerOnline(true)
              fetchInquiries(savedToken)
              fetchBlogs(savedToken)
              return
            }
          }

          // If backend returns 401 or non-ok (e.g. server restarted or token expired),
          // DO NOT kick the admin out! Gracefully switch to secure local vault session.
          console.warn('[Admin Session]: Preserving admin access in secure studio vault mode.')
          const fallbackToken = 'ug_vault_session_' + Date.now()
          localStorage.setItem('ug_admin_token', fallbackToken)
          localStorage.setItem('ug_admin_logged_in', 'true')
          setToken(fallbackToken)
          setServerOnline(false)
          setIsAuthenticated(true)
          return
        }

        // If vault session or fallback token
        setIsAuthenticated(true)
        setServerOnline(false)
      } catch (err) {
        // Network offline, timeout, or server starting: maintain authenticated status
        console.warn('[Admin Session]: Operating in offline executive vault mode:', err?.message)
        setIsAuthenticated(true)
        setServerOnline(false)
      }
    }

    verifySavedSession()
  }, [])

  // Fetch live client contact entries and inquiries from backend MongoDB
  const fetchInquiries = async (authToken) => {
    try {
      const res = await fetch(`${API_BASE_URL}/inquiries`, {
        headers: {
          Authorization: `Bearer ${authToken || token}`,
        },
      })
      const result = await res.json()
      if (result.success && Array.isArray(result.data)) {
        // Filter out any legacy dummy/static inquiries
        const cleanData = result.data.filter(
          (item) =>
            !['INQ-9481', 'INQ-9480', 'INQ-9479', 'INQ-9478'].includes(item.inquiryCode) &&
            !['Al Maktoum Holdings', 'Lord Harrington Private Office', 'Chalet Mont-Blanc Group', 'Dr. Kenji & Associates'].includes(item.client)
        )
        const mapped = cleanData.map((item) => ({
          _id: item._id,
          id: item.inquiryCode || item._id,
          client: item.client,
          phone: item.phone || '',
          email: item.email || '',
          location: item.location || 'International',
          type: item.projectType || 'Architecture & Haute Interior',
          budget: item.budget || 'Consultation Requested',
          message: item.message || '',
          source: item.source || 'Contact Us Page',
          date: new Date(item.createdAt).toLocaleDateString(),
          status: item.status || 'New Inquiry',
          statusColor: item.statusColor || 'text-[#e3943f] border-[#e3943f]/40 bg-[#e3943f]/10',
        }))
        setInquiries(mapped)
        localStorage.setItem('ug_client_inquiries', JSON.stringify(mapped))
        setServerOnline(true)
      }
    } catch {
      // Keep state clean
    }
  }

  // Purge all inquiries
  const handlePurgeAllInquiries = async () => {
    if (!window.confirm('Delete all client contact entries? This cannot be undone.')) return
    try {
      if (serverOnline && token) {
        await fetch(`${API_BASE_URL}/inquiries/purge/all`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch { }

    setInquiries([])
    localStorage.removeItem('ug_client_inquiries')
    showToast('All contact inquiries cleared.')
  }

  // Delete a client inquiry dossier
  const handleDeleteInquiry = async (inq) => {
    const id = inq._id || inq.id
    if (!window.confirm(`Delete contact dossier for "${inq.client}"?`)) return

    try {
      if (serverOnline && token && inq._id) {
        await fetch(`${API_BASE_URL}/inquiries/${inq._id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch { }

    const updated = inquiries.filter((item) => (item._id || item.id) !== id)
    setInquiries(updated)
    localStorage.setItem('ug_client_inquiries', JSON.stringify(updated))
    showToast(`Dossier for ${inq.client} removed.`)
    if (selectedInquiry && (selectedInquiry._id || selectedInquiry.id) === id) {
      setSelectedInquiry(null)
    }
  }

  // Create / Log a manual contact entry
  const handleCreateInquiry = async (e) => {
    e.preventDefault()
    if (!inquiryFormData.client.trim()) return

    setInquirySaving(true)
    const newInq = {
      client: inquiryFormData.client.trim(),
      phone: inquiryFormData.phone.trim(),
      email: inquiryFormData.email.trim(),
      location: inquiryFormData.location.trim() || 'International Client',
      projectType: inquiryFormData.projectType,
      budget: inquiryFormData.budget,
      message: inquiryFormData.message.trim() || 'Direct client consultation inquiry.',
      source: inquiryFormData.source || 'Studio Direct Entry',
    }

    try {
      if (serverOnline && token) {
        const res = await fetch(`${API_BASE_URL}/inquiries`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newInq),
        })
        const data = await res.json()
        if (data.success && data.data) {
          fetchInquiries(token)
          showToast(`Contact entry for "${newInq.client}" recorded in database!`)
          setNewInquiryModalOpen(false)
          setInquirySaving(false)
          return
        }
      }
    } catch { }

    const localItem = {
      id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
      ...newInq,
      type: newInq.projectType,
      date: new Date().toLocaleDateString(),
      status: 'New Inquiry',
      statusColor: 'text-[#e3943f] border-[#e3943f]/40 bg-[#e3943f]/10',
    }
    const updated = [localItem, ...inquiries]
    setInquiries(updated)
    localStorage.setItem('ug_client_inquiries', JSON.stringify(updated))
    showToast(`Contact entry for "${newInq.client}" saved!`)
    setNewInquiryModalOpen(false)
    setInquirySaving(false)
  }

  // Blog Management Handlers
  const openCreateBlogModal = () => {
    setEditingBlog(null)
    setBlogFormData({
      title: '',
      category: 'Architecture',
      tag: 'Cover Story',
      author: 'Unique Graphics Architectural Board',
      readTime: '6 min read',
      excerpt: '',
      image: '/architectural/dubai_villa.jpg',
      content: '',
      published: true,
      featured: false,
    })
    setBlogModalOpen(true)
  }

  const openEditBlogModal = (blog) => {
    setEditingBlog(blog)
    let contentString = ''
    if (Array.isArray(blog.content)) {
      contentString = blog.content.map((c) => c.text).join('\n\n')
    } else if (typeof blog.content === 'string') {
      contentString = blog.content
    } else {
      contentString = blog.excerpt || ''
    }

    setBlogFormData({
      title: blog.title || '',
      category: blog.category || 'Architecture',
      tag: blog.tag || 'Editorial',
      author: blog.author || 'Unique Graphics Atelier Lead',
      readTime: blog.readTime || '5 min read',
      excerpt: blog.excerpt || '',
      image: blog.image || '/architectural/dubai_villa.jpg',
      content: contentString,
      published: blog.published !== false,
      featured: Boolean(blog.featured),
    })
    setBlogModalOpen(true)
  }

  const handleSaveBlog = async (e) => {
    e.preventDefault()
    if (!blogFormData.title.trim() || !blogFormData.excerpt.trim()) {
      showToast('Article title and excerpt are required.')
      return
    }

    setBlogSaving(true)
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date())

    const contentBlocks = blogFormData.content
      .split('\n\n')
      .filter(Boolean)
      .map((p) => ({ type: 'paragraph', text: p.trim() }))

    const payload = {
      ...blogFormData,
      content: contentBlocks.length > 0 ? contentBlocks : [{ type: 'paragraph', text: blogFormData.excerpt }],
      date: editingBlog?.date || formattedDate,
    }

    const blogId = editingBlog?._id || editingBlog?.slug || editingBlog?.id

    try {
      if (serverOnline && token) {
        const url = editingBlog
          ? `${API_BASE_URL}/blogs/${blogId}`
          : `${API_BASE_URL}/blogs`
        const method = editingBlog ? 'PUT' : 'POST'

        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })
        const data = await res.json()

        if (res.ok && data.success && data.data) {
          let updatedList
          if (editingBlog) {
            updatedList = blogs.map((b) => ((b._id || b.slug || b.id) === blogId ? data.data : b))
          } else {
            updatedList = [data.data, ...blogs]
          }
          setBlogs(updatedList)
          localStorage.setItem('ug_studio_blogs', JSON.stringify(updatedList))
          showToast(`Article "${blogFormData.title}" updated in MongoDB.`)
          setBlogModalOpen(false)
          setBlogSaving(false)
          return
        }
      }
    } catch (err) {
      console.warn('API update failed, applying local synchronization:', err)
    }

    // Local / Vault synchronization fallback
    if (editingBlog) {
      const updatedList = blogs.map((b) =>
        (b._id || b.slug || b.id) === blogId ? { ...b, ...payload } : b
      )
      setBlogs(updatedList)
      localStorage.setItem('ug_studio_blogs', JSON.stringify(updatedList))
      showToast(`Article "${blogFormData.title}" updated successfully.`)
    } else {
      const generatedSlug = blogFormData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      const newLocalBlog = {
        id: generatedSlug,
        slug: generatedSlug,
        ...payload,
        views: 10,
      }
      const updatedList = [newLocalBlog, ...blogs]
      setBlogs(updatedList)
      localStorage.setItem('ug_studio_blogs', JSON.stringify(updatedList))
      showToast(`New article "${blogFormData.title}" published!`)
    }

    setBlogModalOpen(false)
    setBlogSaving(false)
  }

  const handleDeleteBlog = async (blog) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${blog.title}"?`)) return

    const blogId = blog._id || blog.slug || blog.id

    try {
      if (serverOnline && token) {
        await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch { }

    const updatedList = blogs.filter((b) => (b._id || b.slug || b.id) !== blogId)
    setBlogs(updatedList)
    localStorage.setItem('ug_studio_blogs', JSON.stringify(updatedList))
    showToast(`Article removed from architectural journal.`)
  }

  const handleTogglePublish = async (blog) => {
    const blogId = blog._id || blog.slug || blog.id
    const newStatus = blog.published === false ? true : false

    try {
      if (serverOnline && token) {
        await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ published: newStatus }),
        })
      }
    } catch { }

    const updatedList = blogs.map((b) =>
      (b._id || b.slug || b.id) === blogId ? { ...b, published: newStatus } : b
    )
    setBlogs(updatedList)
    localStorage.setItem('ug_studio_blogs', JSON.stringify(updatedList))
    showToast(`Article status set to ${newStatus ? 'Live / Published' : 'Draft'}.`)
  }

  // Set selected blog as the primary Top Cover Story Banner on the public website
  const handleSetFeaturedCover = async (blog) => {
    const blogId = blog._id || blog.slug || blog.id

    try {
      if (serverOnline && token) {
        await fetch(`${API_BASE_URL}/blogs/${blogId}/featured-cover`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch { }

    const updated = blogs.map((b) => {
      const match = (b._id || b.slug || b.id) === blogId
      return { ...b, featured: match, published: match ? true : b.published }
    })
    setBlogs(updated)
    localStorage.setItem('ug_studio_blogs', JSON.stringify(updated))
    showToast(`"${blog.title}" is now the Main Top Cover Banner on the website!`)
  }

  // Handle uploading custom image or video file directly from user device
  const handleBannerMediaFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isVideo = file.type.startsWith('video')
    const reader = new FileReader()
    reader.onload = () => {
      setBannerSettings((prev) => ({
        ...prev,
        mediaType: isVideo ? 'video' : 'image',
        mediaUrl: reader.result,
      }))
      showToast(`Selected ${isVideo ? 'video' : 'image'} from device as hero banner.`)
    }
    reader.readAsDataURL(file)
  }

  // Handle uploading custom image or video file for a blog article
  const handleBlogImageFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isVideo = file.type.startsWith('video')
    const reader = new FileReader()
    reader.onload = () => {
      setBlogFormData((prev) => ({
        ...prev,
        image: reader.result,
      }))
      showToast(`Attached ${isVideo ? 'video clip' : 'photo'} from device to article.`)
    }
    reader.readAsDataURL(file)
  }

  // Save Blog Page Banner & Typography Settings
  const handleSaveBannerSettings = async (e) => {
    e.preventDefault()
    try {
      if (serverOnline && token) {
        await fetch(`${API_BASE_URL}/blogs/settings/banner`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bannerSettings),
        })
      }
    } catch { }

    localStorage.setItem('ug_blog_banner_config', JSON.stringify(bannerSettings))
    showToast('Blog banner and page typography updated on website!')
    setBannerModalOpen(false)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)

    try {
      // 1. Try real backend MongoDB API first
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok && data.success && data.token) {
        // Successful MongoDB authentication with JWT Token
        localStorage.setItem('ug_admin_token', data.token)
        localStorage.setItem('ug_admin_user', JSON.stringify(data.admin))
        localStorage.setItem('ug_admin_logged_in', 'true')
        setToken(data.token)
        setAdminUser(data.admin)
        setIsAuthenticated(true)
        setServerOnline(true)
        fetchInquiries(data.token)
        fetchBlogs(data.token)
        setLoading(false)
        return
      } else {
        setErrorMessage(data.message || 'Passcode verification failed.')
        setLoading(false)
        return
      }
    } catch (networkErr) {
      // 2. Strict offline validation: check saved offline credentials or defaults
      console.warn('[Backend Offline / Vault Mode]', networkErr.message)
      const storedOffline = (() => {
        try {
          return JSON.parse(localStorage.getItem('ug_offline_admin_credentials') || '{}')
        } catch { return {} }
      })()
      const validEmail = (storedOffline.email || 'admin@uniquegraphics.com').toLowerCase().trim()
      const validPass = storedOffline.password || 'admin2026'

      if (
        email.toLowerCase().trim() === validEmail &&
        password === validPass
      ) {
        const dummyToken = 'ug_vault_session_' + Date.now()
        const defaultAdmin = {
          name: storedOffline.name || adminUser?.name || 'Executive Administrator',
          email: validEmail,
          role: 'superadmin',
        }
        localStorage.setItem('ug_admin_token', dummyToken)
        localStorage.setItem('ug_admin_user', JSON.stringify(defaultAdmin))
        localStorage.setItem('ug_admin_logged_in', 'true')
        setToken(dummyToken)
        setAdminUser(defaultAdmin)
        setIsAuthenticated(true)
        setServerOnline(false)
        setLoading(false)
      } else {
        setErrorMessage('Invalid access credentials. Wrong email or passcode.')
        setLoading(false)
      }
    }
  }

  const fillDemoCredentials = () => {
    const storedOffline = (() => {
      try {
        return JSON.parse(localStorage.getItem('ug_offline_admin_credentials') || '{}')
      } catch { return {} }
    })()
    setEmail(storedOffline.email || 'admin@uniquegraphics.com')
    setPassword(storedOffline.password || 'admin2026')
    setErrorMessage('')
  }

  const handleLogout = () => {
    localStorage.removeItem('ug_admin_token')
    localStorage.removeItem('ug_admin_user')
    localStorage.removeItem('ug_admin_logged_in')
    setToken('')
    setAdminUser(null)
    setIsAuthenticated(false)
    setPassword('')
    setErrorMessage('')
    showToast('Signed out from executive dashboard.')
  }

  // Handle Save Admin Settings & Password Update
  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault()
    setSettingsError('')
    setSettingsSuccessMsg('')

    if (!settingsName.trim() || !settingsEmail.trim()) {
      setSettingsError('Name and email cannot be empty.')
      return
    }

    if (settingsNewPassword) {
      if (!settingsCurrentPassword) {
        setSettingsError('Please provide your current password to set a new password.')
        return
      }
      if (settingsNewPassword.length < 6) {
        setSettingsError('New password must be at least 6 characters long.')
        return
      }
      if (settingsNewPassword !== settingsConfirmPassword) {
        setSettingsError('New passwords do not match. Please re-enter.')
        return
      }
    }

    setSettingsSaving(true)

    // 1. Try MongoDB API update if backend is online
    try {
      if (serverOnline && token) {
        const res = await fetch(`${API_BASE_URL}/auth/update-credentials`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: settingsName.trim(),
            email: settingsEmail.trim(),
            currentPassword: settingsCurrentPassword || undefined,
            newPassword: settingsNewPassword || undefined,
          }),
        })
        const data = await res.json()
        if (data.success && data.admin) {
          setAdminUser(data.admin)
          localStorage.setItem('ug_admin_user', JSON.stringify(data.admin))
          if (data.token) {
            setToken(data.token)
            localStorage.setItem('ug_admin_token', data.token)
          }
          if (settingsNewPassword) {
            localStorage.setItem(
              'ug_offline_admin_credentials',
              JSON.stringify({
                name: settingsName.trim(),
                email: settingsEmail.trim(),
                password: settingsNewPassword,
              })
            )
          }
          setSettingsCurrentPassword('')
          setSettingsNewPassword('')
          setSettingsConfirmPassword('')
          setSettingsSuccessMsg('Credentials and password successfully updated in MongoDB!')
          showToast('Settings & password updated successfully!')
          setSettingsSaving(false)
          return
        } else {
          setSettingsError(data.message || 'Failed to update credentials.')
          setSettingsSaving(false)
          return
        }
      }
    } catch (err) {
      console.warn('[Settings API Error]', err)
    }

    // 2. Offline Vault update
    const storedOffline = (() => {
      try {
        return JSON.parse(localStorage.getItem('ug_offline_admin_credentials') || '{}')
      } catch { return {} }
    })()
    const currentValidPass = storedOffline.password || 'admin2026'

    if (settingsNewPassword) {
      if (settingsCurrentPassword !== currentValidPass) {
        setSettingsError('Current password is incorrect.')
        setSettingsSaving(false)
        return
      }
    }

    const updatedAdmin = {
      ...(adminUser || {}),
      name: settingsName.trim(),
      email: settingsEmail.trim(),
      role: 'superadmin',
    }
    localStorage.setItem('ug_admin_user', JSON.stringify(updatedAdmin))
    setAdminUser(updatedAdmin)

    localStorage.setItem(
      'ug_offline_admin_credentials',
      JSON.stringify({
        name: settingsName.trim(),
        email: settingsEmail.trim(),
        password: settingsNewPassword || currentValidPass,
      })
    )

    setSettingsCurrentPassword('')
    setSettingsNewPassword('')
    setSettingsConfirmPassword('')
    setSettingsSuccessMsg('Security credentials updated in local vault storage.')
    showToast('Settings saved successfully!')
    setSettingsSaving(false)
  }

  const navigateTo = (path) => {
    if (window.location.pathname !== path) {
      history.pushState(null, '', path)
      window.dispatchEvent(new PopStateEvent('popstate'))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // --- LOGGED IN EXECUTIVE DASHBOARD WITH DEDICATED SIDEBAR ---
  if (isAuthenticated) {
    // Filter inquiries by tab status and search query
    const filteredInquiries = inquiries.filter((inq) => {
      const matchesStatus =
        inquiryFilter === 'ALL' || inq.status?.toUpperCase() === inquiryFilter.toUpperCase()
      const search = inquirySearch.toLowerCase()
      const matchesSearch =
        !inquirySearch ||
        inq.client?.toLowerCase().includes(search) ||
        inq.phone?.toLowerCase().includes(search) ||
        inq.location?.toLowerCase().includes(search) ||
        inq.type?.toLowerCase().includes(search) ||
        inq.message?.toLowerCase().includes(search) ||
        inq.id?.toLowerCase().includes(search)
      return matchesStatus && matchesSearch
    })

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col lg:flex-row font-sans">
        {/* Floating Toast Notification */}
        {activeToast && (
          <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 rounded-xl border border-[#e3943f]/40 bg-[#141414] px-4 py-3 text-[12px] text-white shadow-2xl backdrop-blur-md animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-[#e3943f] animate-ping" />
            <span>{activeToast}</span>
          </div>
        )}

        {/* Mobile Top App Bar with Sidebar Toggle */}
        <header className="lg:hidden flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#121212] sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Sidebar"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e3943f] text-black font-extrabold text-[11px]">
                UG
              </span>
              <span className="text-[12px] font-bold tracking-widest text-white uppercase">
                ATELIER OS
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-[11px] font-bold text-red-400 uppercase tracking-wider hover:underline"
          >
            Sign Out
          </button>
        </header>

        {/* Backdrop for mobile drawer */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* DEDICATED LUXURY SIDEBAR */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 max-h-screen h-full bg-[#111111] border-r border-white/[0.08] px-5 py-5 flex flex-col justify-between transition-transform duration-300 backdrop-blur-2xl lg:translate-x-0 lg:static lg:w-72 lg:h-screen lg:sticky lg:top-0 shrink-0 overflow-hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          {/* Sidebar Brand Header */}
          <div className="shrink-0 flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#e3943f] to-[#b36e22] text-black font-black text-[13px] shadow-lg shadow-[#e3943f]/25">
                UG
              </span>
              <div>
                <span className="text-[9.5px] font-bold tracking-[0.22em] text-[#e3943f] uppercase block">
                  EXECUTIVE OS
                </span>
                <h2 className="text-[13px] font-bold tracking-wider text-white uppercase">
                  Unique Graphics
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden h-8 w-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Navigation Menu Links (Scrollable Container for all screen heights) */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain py-3.5 pr-1 space-y-1.5 no-scrollbar">
            <span className="block text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-2 px-3">
              MANAGEMENT MODULES
            </span>
            <nav className="space-y-1.5">

              {/* Tab 1: Overview */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('overview')
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-[12px] font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${activeTab === 'overview'
                  ? 'bg-[#e3943f] text-black shadow-md shadow-[#e3943f]/25 font-bold'
                  : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="9" />
                    <rect x="14" y="3" width="7" height="5" />
                    <rect x="14" y="12" width="7" height="9" />
                    <rect x="3" y="16" width="7" height="5" />
                  </svg>
                  <span>Overview</span>
                </div>
              </button>

              {/* Tab 2: Homepage Hero Banner */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('hero_banner')
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-[12px] font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${activeTab === 'hero_banner'
                  ? 'bg-[#e3943f] text-black shadow-md shadow-[#e3943f]/25 font-bold'
                  : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  <span>Homepage Banner</span>
                </div>

              </button>

              {/* Tab: 32 Countries & Global Stats */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('projects_section')
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-[12px] font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${activeTab === 'projects_section'
                  ? 'bg-[#e3943f] text-black shadow-md shadow-[#e3943f]/25 font-bold'
                  : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <span>Countries & Stats</span>
                </div>

              </button>

              {/* Tab: 650+ Completed Projects Gallery */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('completed_projects')
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-[12px] font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${activeTab === 'completed_projects'
                  ? 'bg-[#e3943f] text-black shadow-md shadow-[#e3943f]/25 font-bold'
                  : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                    <line x1="7" y1="2" x2="7" y2="22" />
                    <line x1="17" y1="2" x2="17" y2="22" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                  </svg>
                  <span>Projects Gallery</span>
                </div>

              </button>

              {/* Tab: Brand Showcase (Discover, Clients, Recognition) */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('brand_showcase')
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-[12px] font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${activeTab === 'brand_showcase'
                  ? 'bg-[#e3943f] text-black shadow-md shadow-[#e3943f]/25 font-bold'
                  : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span>Brand & Showcase</span>
                </div>

              </button>

              {/* Tab: About Us Page Studio */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('about_page')
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-[12px] font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${activeTab === 'about_page'
                  ? 'bg-[#e3943f] text-black shadow-md shadow-[#e3943f]/25 font-bold'
                  : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>About Us Page</span>
                </div>
              </button>

              {/* Tab: Portfolio & Categories Manager */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('portfolio_pages')
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[12px] font-semibold tracking-wider uppercase whitespace-nowrap transition-all duration-200 cursor-pointer ${activeTab === 'portfolio_pages'
                  ? 'bg-[#e3943f] text-black shadow-md shadow-[#e3943f]/25 font-bold'
                  : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
                  }`}
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span className="whitespace-nowrap">Portfolio & Disciplines</span>
              </button>

              {/* Tab: Services & Disciplines Manager */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('services_pages')
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[12px] font-semibold tracking-wider uppercase whitespace-nowrap transition-all duration-200 cursor-pointer ${activeTab === 'services_pages'
                  ? 'bg-[#e3943f] text-black shadow-md shadow-[#e3943f]/25 font-bold'
                  : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
                  }`}
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
                <span className="whitespace-nowrap">Services & Disciplines</span>
              </button>

              {/* Tab: Contact Page Customizer */}


              {/* Tab 3: Client Inquiries */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('inquiries')
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-[12px] font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${activeTab === 'inquiries'
                  ? 'bg-[#e3943f] text-black shadow-md shadow-[#e3943f]/25 font-bold'
                  : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>Contact Us & Leads</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${activeTab === 'inquiries' ? 'bg-black/20 text-black' : 'bg-[#e3943f]/20 text-[#e3943f]'
                    }`}
                >
                  {inquiries.length}
                </span>
              </button>

              {/* Tab 3: Blog & Publications */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('blog')
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-[12px] font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${activeTab === 'blog'
                  ? 'bg-[#e3943f] text-black shadow-md shadow-[#e3943f]/25 font-bold'
                  : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                  <span>Journal & Blog</span>
                </div>
              </button>

              {/* Tab 4: Admin Settings & Password Security */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('settings')
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-[12px] font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${activeTab === 'settings'
                  ? 'bg-[#e3943f] text-black shadow-md shadow-[#e3943f]/25 font-bold'
                  : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  <span>Admin Settings</span>
                </div>
                <span className="h-1.5 w-1.5 rounded-full bg-[#e3943f]" />
              </button>
            </nav>
          </div>

          {/* Sidebar Footer Controls - LOGOUT */}
          <div className="shrink-0 pt-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/25 bg-red-500/[0.08] py-2.5 text-[11px] font-bold tracking-wider text-red-400 uppercase hover:border-red-500/50 hover:bg-red-500/20 hover:text-red-300 transition-all cursor-pointer shadow-sm group"
              title="Logout from Executive Dashboard"
            >
              <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* MAIN STAGE CONTENT AREA */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Stage Header */}
          <header className="border-b border-white/[0.08] bg-[#121212]/80 px-6 sm:px-10 py-5 backdrop-blur-md sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e3943f]" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#e3943f] uppercase">
                  ATELIER EXECUTIVE CONSOLE
                </span>
              </div>
              <h1 className="text-[18px] sm:text-[22px] font-normal tracking-[-0.01em] text-white uppercase mt-0.5">
                {activeTab === 'overview' && 'Studio Overview & Management Console'}
                {activeTab === 'hero_banner' && 'Homepage Hero Banner & Media Engine'}
                {activeTab === 'projects_section' && 'Global Portfolio (32 Countries) & Architectural Stats'}
                {activeTab === 'completed_projects' && 'Completed Projects Gallery (650+) & Video Portfolio'}
                {activeTab === 'brand_showcase' && 'Brand Showcase, Clients & Worldwide Recognition'}
                {activeTab === 'about_page' && 'About Us Page & Studio Culture Customizer'}
                {activeTab === 'portfolio_pages' && 'Portfolio & Category Pages Engine'}
                {activeTab === 'services_pages' && 'Services & Disciplines Customizer'}
                {activeTab === 'contact_page' && 'Contact Us Portal & Video Reel Customizer'}
                {activeTab === 'inquiries' && 'Client Inquiries & Leads Pipeline'}
                {activeTab === 'blog' && 'Architectural Journal & Publications'}
                {activeTab === 'settings' && 'Admin Account & Password Security Settings'}
              </h1>
            </div>

            <div className="flex items-center gap-3">


            </div>
          </header>

          {/* STAGE BODY VIEW ROUTING */}
          <div className="p-6 sm:p-10 space-y-8 flex-1">
            {/* VIEW 1: BESPOKE LUXURY ARCHITECTURAL AUDIT & REVISION MATRIX */}
            {activeTab === 'overview' && (() => {
              const contactConfig = getStoredContactConfig()
              const aboutConfig = getStoredAboutConfig()
              const portfolioConfig = getStoredPortfolioConfig()
              const servicesConfig = getStoredServicesConfig()

              // Monitored Architectural Modules Registry with Target Tabs & Live Data
              const modulesRegistry = [
                {
                  id: 'contact_page',
                  index: '01',
                  category: 'crm',
                  targetTab: 'inquiries',
                  name: 'Contact Us Portal & Lead Intake',
                  route: '/contacts',
                  tag: 'Primary Inbound Hub',
                  icon: (
                    <svg className="w-5 h-5 text-[#e3943f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  ),
                  ...getSectionUpdateInfo(
                    'contact_page',
                    'Today • 02:35 PM',
                    'Contact form narrative, WhatsApp number (+91 98765 43210), input fields, and Nina video reel.'
                  ),
                  badgeNote: `${inquiries.length} client leads • WhatsApp active`,
                  chips: ['Nina Video Reel', 'WhatsApp API', 'Direct Brief Intake'],
                },
                {
                  id: 'hero_banner',
                  index: '02',
                  category: 'homepage',
                  targetTab: 'hero_banner',
                  name: 'Homepage Hero Banner & 4K Loop',
                  route: '/#hero',
                  tag: 'Cinematic Gateway',
                  icon: (
                    <svg className="w-5 h-5 text-[#e3943f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  ),
                  ...getSectionUpdateInfo(
                    'hero_banner',
                    'Today • 01:20 PM',
                    `Headline "${heroBannerConfig.title || 'Unique Graphics'}", video loop, and CTA navigation link.`
                  ),
                  badgeNote: `Media: ${(heroBannerConfig.mediaType || 'video').toUpperCase()} • CTA: ${heroBannerConfig.buttonText || 'Discuss project'}`,
                  chips: ['4K Media Loop', 'Custom Typography', 'Dynamic CTA'],
                },
                {
                  id: 'projects_section',
                  index: '03',
                  category: 'homepage',
                  targetTab: 'projects_section',
                  name: '32 Countries & Global Metrics',
                  route: '/#portfolio',
                  tag: 'International Footprint',
                  icon: (
                    <svg className="w-5 h-5 text-[#e3943f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  ),
                  ...getSectionUpdateInfo(
                    'projects_section',
                    '15 Oct 2026 • 12:45 PM',
                    '1,200,000+ sq.m area, 98% recommendation, 15+ factories, 28+ awards, and gold 3D globe.'
                  ),
                  badgeNote: '4 global metrics • Gold 3D globe active',
                  chips: ['1.2M+ sq.m Area', 'Gold 3D Globe', '28+ Design Awards'],
                },
                {
                  id: 'completed_projects',
                  index: '04',
                  category: 'homepage',
                  targetTab: 'completed_projects',
                  name: 'Completed Projects Gallery (650+)',
                  route: '/#projects',
                  tag: 'Built Works Showcase',
                  icon: (
                    <svg className="w-5 h-5 text-[#e3943f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                      <line x1="7" y1="2" x2="7" y2="22" />
                      <line x1="17" y1="2" x2="17" y2="22" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                    </svg>
                  ),
                  ...getSectionUpdateInfo(
                    'completed_projects',
                    '15 Oct 2026 • 11:30 AM',
                    `${projects.length} completed showcase projects catalog, category filters, and showcase video presentations.`
                  ),
                  badgeNote: `${projects.length} flagship projects • Interactive player active`,
                  chips: [`${projects.length} Flagship Works`, 'Video Presentation', 'Bilingual EN/RU'],
                },
                {
                  id: 'brand_showcase',
                  index: '05',
                  category: 'homepage',
                  targetTab: 'brand_showcase',
                  name: 'Brand Showcase & 6 Manifestos',
                  route: '/#brand',
                  tag: 'Atelier Philosophy',
                  icon: (
                    <svg className="w-5 h-5 text-[#e3943f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ),
                  ...getSectionUpdateInfo(
                    'brand_showcase',
                    '14 Oct 2026 • 06:15 PM',
                    'Discover, Clients, Recognition, Expert Steps, Dream Home, and Closing manifesto copy.'
                  ),
                  badgeNote: '6 integrated manifesto modules live',
                  chips: ['6 Studio Manifestos', 'Editorial Copy', 'Atelier Heritage'],
                },
                {
                  id: 'about_page',
                  index: '06',
                  category: 'portals',
                  targetTab: 'about_page',
                  name: 'About Us Studio Monograph Page',
                  route: '/about',
                  tag: 'Full Studio Dossier',
                  icon: (
                    <svg className="w-5 h-5 text-[#e3943f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  ),
                  ...getSectionUpdateInfo(
                    'about_page',
                    '14 Oct 2026 • 04:50 PM',
                    'Studio banner, 10+ years team mark, Unique Graphics style, and 5-stage architectural workflow.'
                  ),
                  badgeNote: `${aboutConfig.story?.en?.years || '10+ years'} experience • 5 workflow stages`,
                  chips: ['5 Workflow Stages', 'Studio Philosophy', 'Bilingual Profiles'],
                },
                {
                  id: 'portfolio_pages',
                  index: '07',
                  category: 'portals',
                  targetTab: 'portfolio_pages',
                  name: 'Portfolio Categories & Landing Portals',
                  route: '/all-projects',
                  tag: '4 Category Gateways',
                  icon: (
                    <svg className="w-5 h-5 text-[#e3943f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                  ),
                  ...getSectionUpdateInfo(
                    'portfolio_pages',
                    '14 Oct 2026 • 02:10 PM',
                    'All Projects, Architecture, Interior, and Commercial design landing portals.'
                  ),
                  badgeNote: '4 dedicated portals & cinematic video banners',
                  chips: ['4 Landing Portals', 'Dedicated Banners', 'Category Dispatcher'],
                },
                {
                  id: 'services_pages',
                  index: '08',
                  category: 'portals',
                  targetTab: 'services_pages',
                  name: 'Services & Disciplines Engine (10)',
                  route: '/all-services',
                  tag: '10 Disciplines',
                  icon: (
                    <svg className="w-5 h-5 text-[#e3943f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                    </svg>
                  ),
                  ...getSectionUpdateInfo(
                    'services_pages',
                    '14 Oct 2026 • 11:00 AM',
                    '10 specialized services (Architecture, Interiors, 3D Walkthrough, BIM, etc.) with reels.'
                  ),
                  badgeNote: '10 services with steps, deliverables & reels',
                  chips: ['10 Architectural Specs', 'Video Reels', 'Deliverable Lists'],
                },
                {
                  id: 'inquiries',
                  index: '09',
                  category: 'crm',
                  targetTab: 'inquiries',
                  name: 'Client Inquiries & CRM Pipeline',
                  route: '/contacts',
                  tag: 'Client Briefs Pipeline',
                  icon: (
                    <svg className="w-5 h-5 text-[#e3943f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  ),
                  ...getSectionUpdateInfo(
                    'inquiries',
                    inquiries[0] ? `${inquiries[0].date}` : 'Live Synced',
                    `${inquiries.length} total client briefs logged from /contacts form and manual registrations.`
                  ),
                  badgeNote: `${inquiries.length} total client submissions registered`,
                  chips: [`${inquiries.length} Active Leads`, 'Real-time Mail Sync', 'Status Tracker'],
                },
                {
                  id: 'blog',
                  index: '10',
                  category: 'crm',
                  targetTab: 'blog',
                  name: 'Architectural Journal & Monograph Blog',
                  route: '/blog',
                  tag: 'Publications & Monographs',
                  icon: (
                    <svg className="w-5 h-5 text-[#e3943f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  ),
                  ...getSectionUpdateInfo(
                    'blog',
                    blogs[0]?.date || '13 Oct 2026 • 05:20 PM',
                    `${blogs.length} monographs published with rich editorial copy and hero cover imagery.`
                  ),
                  badgeNote: `${blogs.length} monographs active in journal`,
                  chips: [`${blogs.length} Editorial Posts`, 'Cover Artworks', 'SEO Tags'],
                },
              ]

              // Filter logic
              const filteredModules = modulesRegistry.filter((mod) => {
                const matchesCategory =
                  overviewFilter === 'all' || mod.category === overviewFilter
                const matchesSearch =
                  !overviewSearch ||
                  mod.name.toLowerCase().includes(overviewSearch.toLowerCase()) ||
                  mod.summary.toLowerCase().includes(overviewSearch.toLowerCase()) ||
                  mod.route.toLowerCase().includes(overviewSearch.toLowerCase()) ||
                  mod.tag.toLowerCase().includes(overviewSearch.toLowerCase())
                return matchesCategory && matchesSearch
              })

              // Retrieve live changelog entries from localStorage
              const getRecentLogs = () => {
                try {
                  const raw = localStorage.getItem('ug_activity_changelog')
                  if (raw) {
                    const parsed = JSON.parse(raw)
                    if (Array.isArray(parsed) && parsed.length > 0) return parsed.slice(0, 4)
                  }
                } catch { }
                return [
                  {
                    id: 'default-1',
                    sectionName: 'Hero Banner & Video Engine',
                    time: 'Today • 01:20 PM',
                    detail: 'Updated video loop playback settings and primary CTA link.'
                  },
                  {
                    id: 'default-2',
                    sectionName: 'Completed Projects Gallery',
                    time: '15 Oct 2026 • 11:30 AM',
                    detail: 'Refreshed 650+ showcase projects catalog & bilingual scopes.'
                  },
                  {
                    id: 'default-3',
                    sectionName: '32 Countries & Global Stats',
                    time: '15 Oct 2026 • 12:45 PM',
                    detail: 'Re-calibrated metrics for 1,200,000+ sq.m and 28+ international awards.'
                  }
                ]
              }
              const recentActivityLogs = getRecentLogs()

              return (
                <div className="space-y-8 animate-fade-in pb-12">
                  {/* HERO COMMAND STRIP WITH HIGH-FASHION ARCHITECTURAL GLOW */}
                  <div className="relative rounded-3xl border border-[#e3943f]/30 bg-gradient-to-br from-[#18140f] via-[#111111] to-[#0a0a0a] p-6 sm:p-8 overflow-hidden shadow-2xl backdrop-blur-2xl">
                    {/* Background Decorative Gold Ambient Orbs */}
                    <div className="pointer-events-none absolute -top-28 -right-28 h-80 w-80 rounded-full bg-[#e3943f]/15 blur-3xl animate-pulse" />
                    <div className="pointer-events-none absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
                    <div className="pointer-events-none absolute top-1/2 left-1/3 -translate-y-1/2 h-44 w-96 rounded-full bg-amber-500/5 blur-3xl" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-2.5">
                        <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-[#e3943f]/10 border border-[#e3943f]/30 backdrop-blur-md">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e3943f] opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e3943f]" />
                          </span>
                          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#e3943f] uppercase">
                            UNIQUE GRAPHICS ARCHITECTURAL ATELIER • AUDIT MATRIX
                          </span>
                        </div>
                        <h2 className="text-[26px] sm:text-[32px] font-light tracking-wide text-white">
                          Studio Production & Revision <span className="font-semibold text-gradient bg-gradient-to-r from-white via-amber-100 to-[#e3943f] bg-clip-text text-transparent">Telemetry</span>
                        </h2>
                        <p className="text-[13px] text-white/60 max-w-2xl leading-relaxed">
                          Live chronological control monitor tracking all 10 architectural sections — inspect updates, review live parameters, or jump directly into the module editor.
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* 4 LUXURY KPI METRIC TILES */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Metric 1 */}
                    <div className="group relative rounded-2xl border border-white/[0.09] bg-gradient-to-b from-[#161616] to-[#101010] p-5 hover:border-[#e3943f]/50 transition-all duration-300 shadow-xl overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#e3943f]/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110" />
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-[#e3943f] uppercase">
                          MONITORED MODULES
                        </span>
                        <span className="h-2 w-2 rounded-full bg-[#e3943f] shadow-sm shadow-[#e3943f]" />
                      </div>
                      <p className="mt-2.5 text-[34px] font-extralight text-white tracking-tight">
                        10<span className="text-[14px] text-white/40 ml-1">/10</span>
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-[11px] text-white/50">
                        <span className="text-emerald-400 font-medium font-mono">100% Synced</span>
                        <span>•</span>
                        <span>Production Site</span>
                      </div>
                    </div>

                    {/* Metric 2 */}
                    <div
                      onClick={() => setActiveTab('inquiries')}
                      className="group relative rounded-2xl border border-white/[0.09] bg-gradient-to-b from-[#161616] to-[#101010] p-5 hover:border-emerald-500/50 transition-all duration-300 shadow-xl overflow-hidden cursor-pointer"
                      title="Click to view inquiries"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110" />
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                          CLIENT INQUIRIES
                        </span>
                        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                      </div>
                      <p className="mt-2.5 text-[34px] font-extralight text-emerald-400 tracking-tight">
                        {inquiries.length}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-white/50">
                        <span>Active Briefs</span>
                        <span className="text-emerald-400/80 group-hover:text-emerald-300 group-hover:underline">Open CRM ↗</span>
                      </div>
                    </div>

                    {/* Metric 3 */}
                    <div
                      onClick={() => setActiveTab('blog')}
                      className="group relative rounded-2xl border border-white/[0.09] bg-gradient-to-b from-[#161616] to-[#101010] p-5 hover:border-purple-500/50 transition-all duration-300 shadow-xl overflow-hidden cursor-pointer"
                      title="Click to view journal"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110" />
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-purple-400 uppercase">
                          JOURNAL ESSAYS
                        </span>
                        <span className="h-2 w-2 rounded-full bg-purple-400 shadow-sm shadow-purple-400" />
                      </div>
                      <p className="mt-2.5 text-[34px] font-extralight text-purple-400 tracking-tight">
                        {blogs.length}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-white/50">
                        <span>Monographs</span>
                        <span className="text-purple-400/80 group-hover:text-purple-300 group-hover:underline">Open Blog ↗</span>
                      </div>
                    </div>

                    {/* Metric 4: Portfolio Works (Replacing MongoDB Atlas) */}
                    <div
                      onClick={() => setActiveTab('completed_projects')}
                      className="group relative rounded-2xl border border-white/[0.09] bg-gradient-to-b from-[#161616] to-[#101010] p-5 hover:border-sky-400/50 transition-all duration-300 shadow-xl overflow-hidden cursor-pointer"
                      title="Click to view completed projects gallery"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110" />
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-sky-400 uppercase">
                          PORTFOLIO WORKS
                        </span>
                        <span className="h-2 w-2 rounded-full bg-sky-400 shadow-sm shadow-sky-400" />
                      </div>
                      <p className="mt-2.5 text-[34px] font-extralight text-sky-400 tracking-tight">
                        {completedProjectsConfig?.projects?.length ? `${completedProjectsConfig.projects.length}+` : '650+'}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-white/50">
                        <span>Built Works</span>
                        <span className="text-sky-400/80 group-hover:text-sky-300 group-hover:underline">Open Gallery ↗</span>
                      </div>
                    </div>
                  </div>

                  {/* INTERACTIVE CONTROLS BAR: REAL-TIME HUD WITH SEARCH & CATEGORY PILLS */}
                  <div className="rounded-2xl border border-white/10 bg-[#141414]/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md shadow-xl">
                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2">
                      {[
                        { id: 'all', label: 'All Modules', count: 10 },
                        { id: 'homepage', label: 'Homepage Canvas', count: 4 },
                        { id: 'portals', label: 'Studio Portals', count: 4 },
                        { id: 'crm', label: 'CRM & Journal', count: 2 },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setOverviewFilter(tab.id)}
                          className={`px-4 py-2 rounded-xl text-[12px] font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${overviewFilter === tab.id
                            ? 'bg-[#e3943f] text-black font-bold shadow-lg shadow-[#e3943f]/25 scale-[1.02]'
                            : 'bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                            }`}
                        >
                          <span>{tab.label}</span>
                          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${overviewFilter === tab.id ? 'bg-black/20 text-black font-bold' : 'bg-white/10 text-white/60'}`}>
                            {tab.count}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Search Bar & Counter */}
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-white/40 hidden md:inline font-mono">
                        Showing {filteredModules.length} of 10
                      </span>
                      <div className="relative w-full sm:w-72">
                        <svg className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                          type="text"
                          value={overviewSearch}
                          onChange={(e) => setOverviewSearch(e.target.value)}
                          placeholder="Search section, route, tags..."
                          className="w-full rounded-xl border border-white/10 bg-black/60 pl-10 pr-8 py-2 text-[12px] text-white placeholder-white/40 outline-none focus:border-[#e3943f] transition-all"
                        />
                        {overviewSearch && (
                          <button
                            type="button"
                            onClick={() => setOverviewSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs cursor-pointer"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* BESPOKE LUXURY SECTION UPDATE STREAM (NON-BORING ARCHITECTURAL SPEC ROWS) */}
                  <div className="space-y-3.5">
                    {filteredModules.length === 0 ? (
                      <div className="rounded-2xl border border-white/10 bg-[#141414] p-12 text-center space-y-3">
                        <svg className="w-8 h-8 text-white/30 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <p className="text-[14px] text-white/60">No sections match your search "{overviewSearch}"</p>
                        <button
                          type="button"
                          onClick={() => { setOverviewSearch(''); setOverviewFilter('all'); }}
                          className="text-[12px] text-[#e3943f] hover:underline cursor-pointer"
                        >
                          Clear search and filters
                        </button>
                      </div>
                    ) : (
                      filteredModules.map((mod) => (
                        <div
                          key={mod.id}
                          className="group relative rounded-2xl border border-white/[0.08] bg-gradient-to-r from-[#171717] via-[#141414] to-[#101010] p-4 sm:p-5 hover:border-[#e3943f]/40 hover:bg-gradient-to-r hover:from-[#1d1812] hover:to-[#141414] transition-all duration-300 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                        >
                          {/* Left: Index Number & Glowing Icon & Section Identity */}
                          <div className="flex items-center gap-3.5 min-w-[280px]">
                            <span className="text-[11px] font-mono text-white/25 w-6 shrink-0 font-semibold">
                              {mod.index}
                            </span>
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#e3943f]/20 via-[#e3943f]/10 to-transparent border border-[#e3943f]/30 shrink-0 group-hover:scale-105 group-hover:border-[#e3943f]/60 transition-all shadow-inner">
                              {mod.icon}
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <h3 className="text-[15px] font-bold text-white group-hover:text-[#e3943f] transition-colors tracking-wide truncate">
                                {mod.name}
                              </h3>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-mono text-[#e3943f] font-semibold">
                                  {mod.route}
                                </span>
                                <span className="text-white/20">•</span>
                                <span className="text-[9.5px] uppercase tracking-wider text-white/40 font-semibold">
                                  {mod.tag}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Middle: What was Updated & Active Live Parameters & Chips */}
                          <div className="flex-1 min-w-0 space-y-2 lg:px-4">
                            <p className="text-[13px] text-white/85 leading-snug">
                              {mod.summary}
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                              {mod.chips && mod.chips.map((chip, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-mono text-white/60 bg-white/[0.04] px-2.5 py-0.5 rounded-md border border-white/[0.07]"
                                >
                                  {chip}
                                </span>
                              ))}
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#e3943f]/80 bg-[#e3943f]/10 px-2.5 py-0.5 rounded-md border border-[#e3943f]/20">
                                {mod.badgeNote}
                              </span>
                            </div>
                          </div>

                          {/* Right: Timestamp & Dual Actions (Configure & Preview) */}
                          <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/[0.06]">
                            {/* Kab Update Hua Badge */}
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-mono font-semibold bg-[#e3943f]/10 text-[#e3943f] border border-[#e3943f]/30 shadow-inner">
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              <span>{mod.time}</span>
                            </div>

                            {/* Production Live Beacon */}
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Live
                            </span>

                            {/* Quick Configure / Switch Tab Action */}
                            <button
                              type="button"
                              onClick={() => {
                                if (mod.targetTab) {
                                  setActiveTab(mod.targetTab)
                                  window.scrollTo({ top: 0, behavior: 'smooth' })
                                }
                              }}
                              className="px-3 py-1.5 rounded-xl border border-[#e3943f]/40 bg-[#e3943f]/15 hover:bg-[#e3943f] hover:text-black text-[11.5px] font-bold text-[#e3943f] transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                              title={`Jump into ${mod.name} Editor`}
                            >
                              <span>Configure</span>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>

                            {/* Live Site Preview Button */}
                            <a
                              href={mod.route.startsWith('/#') ? `/${mod.route}` : mod.route}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] text-[11.5px] font-semibold text-white/80 hover:text-white hover:border-[#e3943f]/50 hover:bg-[#e3943f]/10 transition-all cursor-pointer flex items-center gap-1.5"
                              title="Preview on live site"
                            >
                              <span>Site ↗</span>
                            </a>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* RECENT STUDIO CHANGELOG & AUDIT LOGS STREAM */}
                  <div className="rounded-3xl border border-white/[0.09] bg-gradient-to-br from-[#151515] to-[#0d0d0d] p-6 sm:p-7 shadow-2xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.07]">
                      <div className="flex items-center gap-2.5">
                        <span className="h-2 w-2 rounded-full bg-[#e3943f]" />
                        <h4 className="text-[14px] font-mono font-bold tracking-widest text-white uppercase">
                          STUDIO AUDIT FEED & RECENT CHANGELOG
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono text-white/40">
                        Auto-logged whenever you save or publish changes
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                      {recentActivityLogs.map((log, i) => (
                        <div
                          key={log.id || i}
                          className="rounded-xl border border-white/[0.06] bg-black/40 p-4 space-y-1.5 hover:border-[#e3943f]/30 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] font-bold text-white tracking-wide">
                              {log.sectionName || 'Studio Core Module'}
                            </span>
                            <span className="text-[10px] font-mono text-[#e3943f] bg-[#e3943f]/10 px-2 py-0.5 rounded border border-[#e3943f]/20">
                              {log.time}
                            </span>
                          </div>
                          <p className="text-[12px] text-white/60 leading-relaxed">
                            {log.detail || 'Configuration parameters updated and verified.'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* VIEW 2: HOMEPAGE HERO BANNER (IMAGE & VIDEO CUSTOMIZER) */}
            {activeTab === 'hero_banner' && (
              <div className="space-y-6 animate-fade-in">
                {/* Header with Title and Quick Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#e3943f] animate-pulse" />
                      <span className="text-[10px] font-bold tracking-[0.2em] text-[#e3943f] uppercase">
                        HOMEPAGE HERO CUSTOMIZER
                      </span>
                    </div>
                    <h3 className="text-[18px] font-semibold text-white mt-1">
                      Homepage Hero Banner & Media Engine
                    </h3>
                    <p className="text-[12.5px] text-white/50">
                      Set video loops or high-resolution luxury imagery with custom typography directly on the website hero.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigateTo('/')}
                      className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[11.5px] font-bold tracking-wider text-white/80 uppercase hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span>Preview Live Site</span>
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveHeroBanner}
                      disabled={heroBannerSaving}
                      className="rounded-xl bg-gradient-to-r from-[#e3943f] to-[#d68532] px-5 py-2.5 text-[11.5px] font-bold tracking-[0.14em] text-black uppercase hover:brightness-105 transition-all shadow-md shadow-[#e3943f]/25 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                    >
                      <svg className="h-4 w-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{heroBannerSaving ? 'Publishing...' : 'Save & Publish Banner'}</span>
                    </button>
                  </div>
                </div>

                {/* Split Grid: Left Form Controls, Right Live Interactive Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Form Controls (7 cols) */}
                  <form onSubmit={handleSaveHeroBanner} className="lg:col-span-7 space-y-6">
                    {/* 1. Media Type Selector */}
                    <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                      <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                        1. Background Media Type
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setHeroBannerConfig({ ...heroBannerConfig, mediaType: 'video' })}
                          className={`flex items-center justify-center gap-2.5 p-3.5 rounded-xl border text-[12px] font-bold tracking-wider uppercase transition-all cursor-pointer ${heroBannerConfig.mediaType === 'video'
                            ? 'border-[#e3943f] bg-[#e3943f]/15 text-[#e3943f] shadow-lg shadow-[#e3943f]/10'
                            : 'border-white/10 bg-white/[0.02] text-white/60 hover:text-white hover:border-white/20'
                            }`}
                        >
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="23 7 16 12 23 17 23 7" />
                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                          </svg>
                          <span>Video Loop</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setHeroBannerConfig({ ...heroBannerConfig, mediaType: 'image' })}
                          className={`flex items-center justify-center gap-2.5 p-3.5 rounded-xl border text-[12px] font-bold tracking-wider uppercase transition-all cursor-pointer ${heroBannerConfig.mediaType === 'image'
                            ? 'border-[#e3943f] bg-[#e3943f]/15 text-[#e3943f] shadow-lg shadow-[#e3943f]/10'
                            : 'border-white/10 bg-white/[0.02] text-white/60 hover:text-white hover:border-white/20'
                            }`}
                        >
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                          <span>High-Res Photo / Image</span>
                        </button>
                      </div>

                      {/* Media URL Input & Local File Picker */}
                      <div className="space-y-2 pt-2">
                        <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider">
                          Media Source URL / File Path:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={heroBannerConfig.mediaUrl}
                            onChange={(e) => setHeroBannerConfig({ ...heroBannerConfig, mediaUrl: e.target.value })}
                            placeholder={heroBannerConfig.mediaType === 'video' ? 'e.g. /video/1.mp4 or video link' : 'e.g. /hero.jpg or image link'}
                            className="flex-1 rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                          />
                          <label className="rounded-xl border border-white/15 bg-white/[0.05] px-3.5 py-2.5 text-[11px] font-bold text-white/80 uppercase hover:bg-white/10 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 shrink-0">
                            <svg className="h-4 w-4 text-[#e3943f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <span>Upload File</span>
                            <input
                              type="file"
                              accept={heroBannerConfig.mediaType === 'video' ? 'video/*' : 'image/*'}
                              onChange={handleHeroFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Curated Presets */}
                      <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                        <span className="block text-[10.5px] font-bold text-white/40 uppercase tracking-wider">
                          Quick Presets ({heroBannerConfig.mediaType === 'video' ? 'Video Clips' : 'Luxury Architecture Images'}):
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {heroBannerConfig.mediaType === 'video' ? (
                            [
                              { name: 'Grand Atrium (Default)', url: '/video/4.mp4' },
                              { name: 'Cinematic Living', url: '/video/1.mp4' },
                              { name: 'Glazing Facade', url: '/video/2.mp4' },
                              { name: 'Multi-Clip Cycling', url: 'cycle:all' },
                            ].map((preset) => (
                              <button
                                key={preset.url}
                                type="button"
                                onClick={() => setHeroBannerConfig({ ...heroBannerConfig, mediaType: 'video', mediaUrl: preset.url })}
                                className={`px-3 py-1.5 rounded-lg text-[10.5px] font-semibold tracking-wider transition-all cursor-pointer ${heroBannerConfig.mediaUrl === preset.url
                                  ? 'bg-[#e3943f] text-black font-bold'
                                  : 'border border-white/10 bg-white/[0.03] text-white/70 hover:text-white hover:border-white/20'
                                  }`}
                              >
                                {preset.name}
                              </button>
                            ))
                          ) : (
                            [
                              { name: 'Studio Masterpiece Hero', url: '/hero.jpg' },
                              { name: 'Desert Villa (Dubai)', url: '/architectural/dubai_villa.jpg' },
                              { name: 'Monaco Penthouse', url: '/interior/monaco.jpg' },
                              { name: 'Courchevel Chalet', url: '/architectural/courchevel_chalet.jpg' },
                              { name: 'Biophilic Atrium', url: '/commercial/atrium.jpg' },
                            ].map((preset) => (
                              <button
                                key={preset.url}
                                type="button"
                                onClick={() => setHeroBannerConfig({ ...heroBannerConfig, mediaType: 'image', mediaUrl: preset.url })}
                                className={`px-3 py-1.5 rounded-lg text-[10.5px] font-semibold tracking-wider transition-all cursor-pointer ${heroBannerConfig.mediaUrl === preset.url
                                  ? 'bg-[#e3943f] text-black font-bold'
                                  : 'border border-white/10 bg-white/[0.03] text-white/70 hover:text-white hover:border-white/20'
                                  }`}
                              >
                                {preset.name}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 2. Text Content & Typography */}
                    <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                      <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                        2. Headline, Subtitle & Call-To-Action
                      </label>

                      <div>
                        <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1.5">
                          Main Headline (H1 Title)
                        </label>
                        <input
                          type="text"
                          required
                          value={heroBannerConfig.title}
                          onChange={(e) => setHeroBannerConfig({ ...heroBannerConfig, title: e.target.value })}
                          placeholder="e.g. UNIQUE GRAPHICS"
                          className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[14px] text-white font-semibold outline-none focus:border-[#e3943f]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1.5">
                          Subtitle / Tagline Description
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={heroBannerConfig.subtitle}
                          onChange={(e) => setHeroBannerConfig({ ...heroBannerConfig, subtitle: e.target.value })}
                          placeholder="e.g. LEADING INTERNATIONAL BUREAU FOR PREMIUM ARCHITECTURAL AND INTERIOR DESIGN"
                          className="w-full rounded-xl border border-white/10 bg-[#181818] p-3 text-[13px] text-white outline-none focus:border-[#e3943f] resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1.5">
                            CTA Button Label
                          </label>
                          <input
                            type="text"
                            value={heroBannerConfig.buttonText}
                            onChange={(e) => setHeroBannerConfig({ ...heroBannerConfig, buttonText: e.target.value })}
                            placeholder="e.g. DISCUSS YOUR PROJECT"
                            className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[13px] text-white outline-none focus:border-[#e3943f]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1.5">
                            CTA Button Target Link
                          </label>
                          <input
                            type="text"
                            value={heroBannerConfig.buttonLink}
                            onChange={(e) => setHeroBannerConfig({ ...heroBannerConfig, buttonLink: e.target.value })}
                            placeholder="e.g. /contacts"
                            className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[13px] text-white outline-none focus:border-[#e3943f]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const def = {
                            title: 'Unique Graphics',
                            subtitle: 'Leading international bureau for premium architectural and interior design',
                            buttonText: 'Discuss your project',
                            buttonLink: '/contacts',
                            mediaType: 'video',
                            mediaUrl: '/video/4.mp4',
                          }
                          setHeroBannerConfig(def)
                          showToast('Reset to default studio hero configuration.')
                        }}
                        className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[11px] font-bold tracking-wider text-white/60 uppercase hover:text-white transition-colors cursor-pointer"
                      >
                        Reset Defaults
                      </button>

                      <button
                        type="submit"
                        disabled={heroBannerSaving}
                        className="rounded-xl bg-gradient-to-r from-[#e3943f] to-[#d68532] px-6 py-3 text-[12px] font-bold tracking-[0.16em] text-black uppercase hover:brightness-105 transition-all shadow-lg shadow-[#e3943f]/25 disabled:opacity-50 cursor-pointer"
                      >
                        {heroBannerSaving ? 'Saving Changes...' : 'Save & Publish to Homepage'}
                      </button>
                    </div>
                  </form>

                  {/* Right Column: Live Interactive Preview (5 cols) */}
                  <div className="lg:col-span-5 sticky top-28 space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[11px] font-bold tracking-widest text-white/50 uppercase flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                        Live Homepage Hero Preview
                      </span>
                      <span className="text-[10px] font-mono text-[#e3943f] uppercase">
                        {heroBannerConfig.mediaType}
                      </span>
                    </div>

                    <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/15 bg-black shadow-2xl flex flex-col justify-end p-6 select-none group">
                      {/* Media Background */}
                      {heroBannerConfig.mediaType === 'image' ? (
                        <img
                          src={heroBannerConfig.mediaUrl || '/hero.jpg'}
                          alt="Preview"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <video
                          key={heroBannerConfig.mediaUrl}
                          src={heroBannerConfig.mediaUrl && !heroBannerConfig.mediaUrl.startsWith('cycle:') ? heroBannerConfig.mediaUrl : '/video/4.mp4'}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      )}

                      {/* Luxury Dark Gradients & Fog simulation */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />

                      {/* Foreground Content Mockup */}
                      <div className="relative z-10 space-y-2">
                        <h2 className="text-[20px] sm:text-[24px] font-semibold text-white tracking-[0.06em] uppercase leading-tight drop-shadow-md">
                          {heroBannerConfig.title || 'Unique Graphics'}
                        </h2>
                        <p className="text-[10.5px] sm:text-[11px] text-[#e3a15a] uppercase font-medium tracking-wider line-clamp-2 leading-relaxed drop-shadow">
                          {heroBannerConfig.subtitle || 'Leading international bureau for premium architectural and interior design'}
                        </p>
                        <div className="pt-2">
                          <span className="inline-block rounded-full bg-[#e8892c] px-4 py-1.5 text-[10px] font-bold text-white uppercase tracking-wider shadow-lg shadow-[#e8892c]/30">
                            {heroBannerConfig.buttonText || 'Discuss your project'}
                          </span>
                        </div>
                      </div>

                      <div className="absolute top-3 right-3 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[9px] font-mono text-white/70 border border-white/10 uppercase">
                        1:1 Preview
                      </div>
                    </div>

                    <p className="text-[11.5px] text-white/40 italic px-1">
                      * Real-time preview mirrors the exact layout on your public homepage (<span className="text-[#e3943f]">/</span>). Click "Save & Publish" to update website live.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: PROJECTS (32 COUNTRIES) & GLOBAL ARCHITECTURAL STATS CUSTOMIZER */}
            {activeTab === 'projects_section' && (
              <div className="space-y-6 animate-fade-in">
                {/* Header with Title, Language Switcher and Quick Action */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#e3943f] animate-pulse" />
                      <span className="text-[10px] font-bold tracking-[0.2em] text-[#e3943f] uppercase">
                        GLOBAL SHOWCASE & STATS ENGINE
                      </span>
                    </div>
                    <h3 className="text-[18px] font-semibold text-white mt-1">
                      Projects in 32 Countries & Architectural Performance Metrics
                    </h3>
                    <p className="text-[12.5px] text-white/50">
                      Update the global completed projects headline, accent keywords, Discover Portfolio CTA, 3D Globe visual, and all 4 stat cards live on the website.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => navigateTo('/')}
                      className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[11.5px] font-bold tracking-wider text-white/80 uppercase hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span>Preview Live Site</span>
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveProjectsSection}
                      disabled={projectsSectionSaving}
                      className="rounded-xl bg-gradient-to-r from-[#e3943f] to-[#d68532] px-5 py-2.5 text-[11.5px] font-bold tracking-[0.14em] text-black uppercase hover:brightness-105 transition-all shadow-md shadow-[#e3943f]/25 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                    >
                      <svg className="h-4 w-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{projectsSectionSaving ? 'Publishing...' : 'Save & Publish Section'}</span>
                    </button>
                  </div>
                </div>

                {/* Split Grid: Left Form Controls, Right Live Interactive Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Form Controls (7 cols) */}
                  <form onSubmit={handleSaveProjectsSection} className="lg:col-span-7 space-y-6">
                    {/* 1. Section Headline & Accent Framing */}
                    <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                          1. Headline & Portfolio Call-To-Action ({projectsLang.toUpperCase()})
                        </label>
                        <span className="text-[10px] text-white/40 uppercase font-mono">
                          Live on Homepage Section
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">
                            Main Section Headline:
                          </label>
                          <input
                            type="text"
                            value={projectsConfig[projectsLang]?.title || ''}
                            onChange={(e) => updateCurrentProjectText('title', e.target.value)}
                            placeholder="e.g. Completed projects in 32 countries"
                            className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[13px] text-white outline-none focus:border-[#e3943f]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">
                              Lead Description (Before Accent):
                            </label>
                            <input
                              type="text"
                              value={projectsConfig[projectsLang]?.before || ''}
                              onChange={(e) => updateCurrentProjectText('before', e.target.value)}
                              placeholder="e.g. We have showcasing projects in the distinctive Unique Graphics style around the world "
                              className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-[#e3943f] uppercase tracking-wider mb-1">
                              Highlighted Accent Phrase (Gold):
                            </label>
                            <input
                              type="text"
                              value={projectsConfig[projectsLang]?.accent || ''}
                              onChange={(e) => updateCurrentProjectText('accent', e.target.value)}
                              placeholder="e.g. the most extensive portfolio"
                              className="w-full rounded-xl border border-[#e3943f]/40 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-[#e3943f] font-semibold outline-none focus:border-[#e3943f]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">
                              Button Label:
                            </label>
                            <input
                              type="text"
                              value={projectsConfig[projectsLang]?.button || ''}
                              onChange={(e) => updateCurrentProjectText('button', e.target.value)}
                              placeholder="e.g. Discover portfolio"
                              className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">
                              Button Destination URL / Route:
                            </label>
                            <input
                              type="text"
                              value={projectsConfig[projectsLang]?.buttonLink || '/all-projects'}
                              onChange={(e) => updateCurrentProjectText('buttonLink', e.target.value)}
                              placeholder="e.g. /all-projects or /portfolio"
                              className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 2. 3D Globe Visual Showcase Asset */}
                    <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                          2. 3D Globe & Visual Showcase Asset
                        </label>
                        <span className="text-[10px] text-white/40 uppercase font-mono">
                          Right Column Visual
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <div className="h-20 w-20 shrink-0 rounded-xl border border-white/10 bg-black/60 p-2 flex items-center justify-center overflow-hidden">
                            <img
                              src={projectsConfig[projectsLang]?.globeImage || projectsConfig.globeImage || globeImage}
                              alt="Globe preview"
                              className="h-full w-full object-contain"
                            />
                          </div>

                          <div className="flex-1 space-y-2">
                            <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider">
                              Custom Globe Image URL or File Upload:
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={projectsConfig[projectsLang]?.globeImage || projectsConfig.globeImage || ''}
                                onChange={(e) => {
                                  const val = e.target.value
                                  setProjectsConfig((prev) => ({
                                    ...prev,
                                    globeImage: val,
                                    [projectsLang]: {
                                      ...prev[projectsLang],
                                      globeImage: val,
                                    },
                                  }))
                                }}
                                placeholder="Default: 3D Golden Connected Globe (or enter URL)"
                                className="flex-1 rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                              />
                              <label className="rounded-xl border border-white/15 bg-white/[0.05] px-3.5 py-2.5 text-[11px] font-bold text-white/80 uppercase hover:bg-white/10 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 shrink-0">
                                <svg className="h-4 w-4 text-[#e3943f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                  <polyline points="17 8 12 3 7 8" />
                                  <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                <span>Upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleGlobeFileUpload}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Presets */}
                        <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                            Visual Presets:
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setProjectsConfig((prev) => ({
                                ...prev,
                                globeImage: '',
                                [projectsLang]: {
                                  ...prev[projectsLang],
                                  globeImage: '',
                                },
                              }))
                              showToast('Restored default 3D Golden Globe asset.')
                            }}
                            className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.03] text-[10.5px] text-white/70 hover:text-white hover:border-[#e3943f]/40 transition-colors cursor-pointer"
                          >
                            ✦ Default 3D Golden Globe
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setProjectsConfig((prev) => ({
                                ...prev,
                                globeImage: '/architectural/dubai_villa.jpg',
                                [projectsLang]: {
                                  ...prev[projectsLang],
                                  globeImage: '/architectural/dubai_villa.jpg',
                                },
                              }))
                            }}
                            className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.03] text-[10.5px] text-white/70 hover:text-white hover:border-[#e3943f]/40 transition-colors cursor-pointer"
                          >
                            Desert Villa Render
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setProjectsConfig((prev) => ({
                                ...prev,
                                globeImage: '/interior/monaco.jpg',
                                [projectsLang]: {
                                  ...prev[projectsLang],
                                  globeImage: '/interior/monaco.jpg',
                                },
                              }))
                            }}
                            className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.03] text-[10.5px] text-white/70 hover:text-white hover:border-[#e3943f]/40 transition-colors cursor-pointer"
                          >
                            Monaco Penthouse
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 3. 4 Architectural Performance Metrics (The 4 Stat Cards) */}
                    <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                          3. Architectural Metric Cards (4 Cards)
                        </label>
                        <span className="text-[10px] text-white/40 uppercase font-mono">
                          Grid Cards Below Showcase
                        </span>
                      </div>

                      <div className="space-y-4">
                        {(projectsConfig[projectsLang]?.stats || DEFAULT_PROJECTS_CONFIG[projectsLang].stats).map((stat, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-white/[0.08] bg-[#181818] p-4 space-y-3 transition-colors hover:border-white/20"
                          >
                            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                              <span className="text-[11px] font-bold tracking-wider text-[#e3943f] uppercase flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#e3943f]" />
                                Card #{idx + 1}
                              </span>
                              <span className="text-[11px] font-mono font-bold text-white/60">
                                Current: {stat.value}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                                  Metric Highlight (Value):
                                </label>
                                <input
                                  type="text"
                                  value={stat.value || ''}
                                  onChange={(e) => updateCurrentProjectStat(idx, 'value', e.target.value)}
                                  placeholder="e.g. 1 200 m² or 98%"
                                  className="w-full rounded-lg border border-white/10 bg-[#121212] px-3 py-2 text-[13px] font-bold text-white outline-none focus:border-[#e3943f]"
                                />
                              </div>

                              <div>
                                <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                                  Card Title / Label:
                                </label>
                                <input
                                  type="text"
                                  value={stat.label || ''}
                                  onChange={(e) => updateCurrentProjectStat(idx, 'label', e.target.value)}
                                  placeholder="e.g. Average project area"
                                  className="w-full rounded-lg border border-white/10 bg-[#121212] px-3 py-2 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                                Detailed Description:
                              </label>
                              <textarea
                                rows="2"
                                value={stat.desc || ''}
                                onChange={(e) => updateCurrentProjectStat(idx, 'desc', e.target.value)}
                                placeholder="Describe the architectural metric, process or accomplishment..."
                                className="w-full rounded-lg border border-white/10 bg-[#121212] px-3 py-2 text-[12px] text-white/80 outline-none focus:border-[#e3943f]"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10.5px] font-bold text-[#e3943f] uppercase tracking-wider mb-1">
                                  ✦ Feature Detail Highlight (Optional):
                                </label>
                                <input
                                  type="text"
                                  value={stat.detail || ''}
                                  onChange={(e) => updateCurrentProjectStat(idx, 'detail', e.target.value)}
                                  placeholder="e.g. Italian CNC milling & artisan hand finishing"
                                  className="w-full rounded-lg border border-white/10 bg-[#121212] px-3 py-2 text-[11.5px] text-white/80 outline-none focus:border-[#e3943f]"
                                />
                              </div>

                              <div>
                                <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                                  &ldquo;Client Quote / Note&rdquo; (Optional):
                                </label>
                                <input
                                  type="text"
                                  value={stat.note || ''}
                                  onChange={(e) => updateCurrentProjectStat(idx, 'note', e.target.value)}
                                  placeholder="e.g. We continuously measure client loyalty index..."
                                  className="w-full rounded-lg border border-white/10 bg-[#121212] px-3 py-2 text-[11.5px] text-white/60 italic outline-none focus:border-[#e3943f]"
                                />
                              </div>
                            </div>

                            {/* Icon Selector for Card */}
                            <div className="pt-1">
                              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1.5">
                                Glowing 3D Icon Asset:
                              </label>
                              <div className="flex items-center gap-2 flex-wrap">
                                {[
                                  { key: 'area', label: 'Average Area', img: areaIcon },
                                  { key: 'recommend', label: 'Recommendation Rate', img: recommendIcon },
                                  { key: 'manufacturing', label: 'In-House Facility', img: manufacturingIcon },
                                  { key: 'reward', label: 'Award / Leadership', img: rewardIcon },
                                ].map((preset) => {
                                  const isSelected = (stat.iconKey || (idx === 0 ? 'area' : idx === 1 ? 'recommend' : idx === 2 ? 'manufacturing' : 'reward')) === preset.key
                                  return (
                                    <button
                                      key={preset.key}
                                      type="button"
                                      onClick={() => updateCurrentProjectStat(idx, 'iconKey', preset.key)}
                                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] transition-all cursor-pointer ${isSelected
                                        ? 'border-[#e3943f] bg-[#e3943f]/15 text-[#e3943f] font-semibold'
                                        : 'border-white/10 bg-white/[0.02] text-white/60 hover:text-white'
                                        }`}
                                    >
                                      <img src={preset.img} alt="" className="h-4 w-4 object-contain mix-blend-screen" />
                                      <span>{preset.label}</span>
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setProjectsConfig(DEFAULT_PROJECTS_CONFIG)
                          showToast('Reset to default studio projects configuration.')
                        }}
                        className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[11px] font-bold tracking-wider text-white/60 uppercase hover:text-white transition-colors cursor-pointer"
                      >
                        Reset Defaults
                      </button>

                      <button
                        type="submit"
                        disabled={projectsSectionSaving}
                        className="rounded-xl bg-gradient-to-r from-[#e3943f] to-[#d68532] px-6 py-3 text-[12px] font-bold tracking-[0.16em] text-black uppercase hover:brightness-105 transition-all shadow-lg shadow-[#e3943f]/25 disabled:opacity-50 cursor-pointer"
                      >
                        {projectsSectionSaving ? 'Saving Changes...' : 'Save & Publish to Website'}
                      </button>
                    </div>
                  </form>

                  {/* Right Column: Live Interactive Preview (5 cols) */}
                  <div className="lg:col-span-5 sticky top-28 space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[11px] font-bold tracking-widest text-white/50 uppercase flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                        Live Section Preview
                      </span>
                    </div>

                    <div className="rounded-2xl border border-white/15 bg-[#141414] p-5 shadow-2xl space-y-5 select-none group">
                      {/* Top Headline & Globe Preview */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                        <div>
                          <h4 className="text-[16px] sm:text-[18px] font-semibold text-white tracking-tight leading-tight">
                            {projectsConfig[projectsLang]?.title || DEFAULT_PROJECTS_CONFIG[projectsLang].title}
                          </h4>
                          <p className="mt-2 text-[11px] text-[#eceae6] leading-relaxed">
                            {projectsConfig[projectsLang]?.before || DEFAULT_PROJECTS_CONFIG[projectsLang].before}
                            <span className="text-[#e3943f]">
                              {projectsConfig[projectsLang]?.accent || DEFAULT_PROJECTS_CONFIG[projectsLang].accent}
                            </span>
                          </p>
                          <div className="mt-3">
                            <span className="inline-flex rounded-full border border-[#c9843a] px-3 py-1.5 text-[9.5px] font-medium tracking-[0.14em] text-[#e3943f] uppercase">
                              {projectsConfig[projectsLang]?.button || DEFAULT_PROJECTS_CONFIG[projectsLang].button}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-center">
                          <img
                            src={projectsConfig[projectsLang]?.globeImage || projectsConfig.globeImage || globeImage}
                            alt="Globe preview"
                            className="h-28 w-28 sm:h-32 sm:w-32 object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                      </div>

                      {/* 4 Cards Mini Grid Preview */}
                      <div className="pt-3 border-t border-white/[0.08]">
                        <span className="text-[10px] font-bold tracking-wider text-white/40 uppercase block mb-2.5">
                          Architectural Cards Preview:
                        </span>
                        <div className="grid grid-cols-2 gap-2.5">
                          {(projectsConfig[projectsLang]?.stats || DEFAULT_PROJECTS_CONFIG[projectsLang].stats).map((stat, idx) => {
                            const iconKey = stat.iconKey || (idx === 0 ? 'area' : idx === 1 ? 'recommend' : idx === 2 ? 'manufacturing' : 'reward')
                            const iconAsset = STAT_ICONS[iconKey] || areaIcon
                            return (
                              <div
                                key={idx}
                                className="rounded-xl border border-white/10 bg-[#1c1c1c] p-3 flex flex-col justify-between min-h-[140px]"
                              >
                                <div>
                                  <p className="text-[18px] font-bold text-white tracking-tight leading-none">
                                    {stat.value}
                                  </p>
                                  <p className="mt-1 text-[10.5px] font-semibold text-white/90 line-clamp-1">
                                    {stat.label}
                                  </p>
                                  <p className="mt-1 text-[9.5px] text-white/60 line-clamp-2 leading-relaxed">
                                    {stat.desc}
                                  </p>
                                  {stat.detail && (
                                    <p className="mt-1 text-[9px] text-[#e3943f] line-clamp-1 font-medium">
                                      ✦ {stat.detail}
                                    </p>
                                  )}
                                </div>
                                <div className="mt-2 flex justify-end">
                                  <img
                                    src={iconAsset}
                                    alt=""
                                    className="h-8 w-8 object-contain mix-blend-screen"
                                  />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    <p className="text-[11.5px] text-white/40 italic px-1">
                      * Real-time preview mirrors the exact layout on your public homepage (<span className="text-[#e3943f]">/#portfolio</span>). Click "Save & Publish" to update website live.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: 650+ COMPLETED PROJECTS GALLERY & VIDEO PORTFOLIO CUSTOMIZER */}
            {activeTab === 'completed_projects' && (
              <div className="space-y-6 animate-fade-in">
                {/* Header with Title, Language Switcher and Quick Action */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#e3943f] animate-pulse" />
                      <span className="text-[10px] font-bold tracking-[0.2em] text-[#e3943f] uppercase">
                        650+ COMPLETED PROJECTS ENGINE
                      </span>
                    </div>
                    <h3 className="text-[18px] font-semibold text-white mt-1">
                      Completed Projects Gallery & Architectural Video Showcase
                    </h3>
                    <p className="text-[12.5px] text-white/50">
                      Customize the section headline, the gold counter number, filter categories, and add or manage video project cards.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={openNewProjectModal}
                      className="rounded-xl border border-[#e3943f]/40 bg-[#e3943f]/10 px-4 py-2.5 text-[11.5px] font-bold tracking-wider text-[#e3943f] uppercase hover:bg-[#e3943f]/20 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      <span>Add Project</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateTo('/')}
                      className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[11.5px] font-bold tracking-wider text-white/80 uppercase hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span>Preview Live</span>
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveCompletedProjects}
                      disabled={completedProjectsSaving}
                      className="rounded-xl bg-gradient-to-r from-[#e3943f] to-[#d68532] px-5 py-2.5 text-[11.5px] font-bold tracking-[0.14em] text-black uppercase hover:brightness-105 transition-all shadow-md shadow-[#e3943f]/25 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                    >
                      <svg className="h-4 w-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{completedProjectsSaving ? 'Publishing...' : 'Save & Publish Gallery'}</span>
                    </button>
                  </div>
                </div>

                {/* Split Grid: Left Form Controls, Right Live Interactive Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Form Controls (7 cols) */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* 1. Headline & Counter Settings */}
                    <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                          1. Section Headline & Counter ({completedLang.toUpperCase()})
                        </label>
                        <span className="text-[10px] text-white/40 uppercase font-mono">
                          Live Headline Display
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                            Lead Text:
                          </label>
                          <input
                            type="text"
                            value={completedProjectsConfig.copy?.[completedLang]?.lead || ''}
                            onChange={(e) => updateCompletedCopy('lead', e.target.value)}
                            placeholder="e.g. More than"
                            className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10.5px] font-bold text-[#e3943f] uppercase tracking-wider mb-1">
                            Counter (Gold Accent):
                          </label>
                          <input
                            type="text"
                            value={completedProjectsConfig.copy?.[completedLang]?.count || ''}
                            onChange={(e) => updateCompletedCopy('count', e.target.value)}
                            placeholder="e.g. 650"
                            className="w-full rounded-xl border border-[#e3943f]/40 bg-[#181818] px-3.5 py-2.5 text-[13px] font-bold text-[#e3943f] outline-none focus:border-[#e3943f]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                            Tail Text:
                          </label>
                          <input
                            type="text"
                            value={completedProjectsConfig.copy?.[completedLang]?.tail || ''}
                            onChange={(e) => updateCompletedCopy('tail', e.target.value)}
                            placeholder="e.g. completed projects"
                            className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                          />
                        </div>
                      </div>

                      {/* Headline Live Badge Preview */}
                      <div className="rounded-xl border border-white/[0.08] bg-black/40 p-3 flex items-center justify-between">
                        <span className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">
                          Formatted Output:
                        </span>
                        <span className="text-[14px] font-bold tracking-[0.16em] uppercase text-white">
                          {completedProjectsConfig.copy?.[completedLang]?.lead}{' '}
                          <span className="text-[#e3943f]">{completedProjectsConfig.copy?.[completedLang]?.count}</span>{' '}
                          {completedProjectsConfig.copy?.[completedLang]?.tail}
                        </span>
                      </div>
                    </div>

                    {/* 2. Category Filter Row & Manager */}
                    <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div>
                          <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                            2. Project Filter Categories ({completedProjectsConfig.categories?.[completedLang]?.length || 8})
                          </label>
                          <span className="text-[11px] text-white/40">
                            Manage top category filter tabs on website and project assignments
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setNewCatOpen(!newCatOpen)}
                          className="rounded-lg border border-[#e3943f]/40 bg-[#e3943f]/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#e3943f] hover:bg-[#e3943f]/20 transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                        >
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                          <span>{newCatOpen ? 'Close Form' : '+ Add Category'}</span>
                        </button>
                      </div>

                      {/* Add Category Form */}
                      {newCatOpen && (
                        <form onSubmit={handleAddCategory} className="rounded-xl border border-[#e3943f]/30 bg-[#181818] p-4 space-y-3 animate-fade-in">
                          <span className="text-[11px] font-bold text-[#e3943f] uppercase tracking-wider block">
                            Create New Portfolio Category:
                          </span>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                                Category Name (English):
                              </label>
                              <input
                                type="text"
                                required
                                value={newCatData.labelEn}
                                onChange={(e) => setNewCatData({ ...newCatData, labelEn: e.target.value })}
                                placeholder="e.g. Penthouse or Spa"
                                className="w-full rounded-lg border border-white/10 bg-[#121212] px-3 py-2 text-[12px] text-white outline-none focus:border-[#e3943f]"
                              />
                            </div>

                            <div>
                              <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                                Category Name (Russian):
                              </label>
                              <input
                                type="text"
                                value={newCatData.labelRu}
                                onChange={(e) => setNewCatData({ ...newCatData, labelRu: e.target.value })}
                                placeholder="e.g. Пентхаус"
                                className="w-full rounded-lg border border-white/10 bg-[#121212] px-3 py-2 text-[12px] text-white outline-none focus:border-[#e3943f]"
                              />
                            </div>

                            <div>
                              <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                                Identifier (Slug):
                              </label>
                              <input
                                type="text"
                                value={newCatData.id}
                                onChange={(e) => setNewCatData({ ...newCatData, id: e.target.value })}
                                placeholder="Auto: penthouse"
                                className="w-full rounded-lg border border-white/10 bg-[#121212] px-3 py-2 text-[12px] text-white/70 font-mono outline-none focus:border-[#e3943f]"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setNewCatOpen(false)}
                              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="rounded-lg bg-[#e3943f] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-black hover:brightness-105 transition-all shadow-md shadow-[#e3943f]/20 cursor-pointer"
                            >
                              Save Category
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Category Chips with Delete buttons */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {(completedProjectsConfig.categories?.[completedLang] || DEFAULT_COMPLETED_PROJECTS_CONFIG.categories[completedLang]).map(([catId, catLabel]) => {
                          const isAll = catId === 'all'
                          return (
                            <div
                              key={catId}
                              className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#181818] px-3 py-2 text-[11.5px] font-semibold text-white/90 hover:border-[#e3943f]/40 transition-colors"
                            >
                              <span className="text-[#e3943f]">✦</span>
                              <span>{catLabel}</span>
                              <span className="text-[9.5px] font-mono text-white/40 bg-white/5 px-1.5 py-0.5 rounded">
                                {catId}
                              </span>
                              {!isAll && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCategory(catId, catLabel)}
                                  title={`Delete ${catLabel}`}
                                  className="ml-1 text-white/40 hover:text-red-400 p-0.5 rounded hover:bg-white/5 transition-colors cursor-pointer"
                                >
                                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* 3. Project Cards Video Showcase Manager */}
                    <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                            3. Video Projects Portfolio
                          </label>
                          <span className="text-[11px] text-white/40">
                            Hover-to-play interactive project videos on website
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={openNewProjectModal}
                          className="rounded-lg bg-[#e3943f] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-black hover:brightness-105 transition-all cursor-pointer shrink-0"
                        >
                          + New Project
                        </button>
                      </div>

                      {/* Search and Category Filter */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <input
                          type="text"
                          value={projectSearch}
                          onChange={(e) => setProjectSearch(e.target.value)}
                          placeholder="Search projects by title..."
                          className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2 text-[12px] text-white outline-none focus:border-[#e3943f]"
                        />

                        <select
                          value={projectCatFilter}
                          onChange={(e) => setProjectCatFilter(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2 text-[12px] text-white outline-none focus:border-[#e3943f]"
                        >
                          <option value="all">All Categories</option>
                          {(completedProjectsConfig.categories?.[completedLang] || DEFAULT_COMPLETED_PROJECTS_CONFIG.categories[completedLang])
                            .filter(([cId]) => cId !== 'all')
                            .map(([cId, cName]) => (
                              <option key={cId} value={cId}>
                                {cName}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Projects List */}
                      <div className="space-y-3 pt-2">
                        {((Array.isArray(completedProjectsConfig.projects) && completedProjectsConfig.projects.length > 0)
                          ? completedProjectsConfig.projects
                          : DEFAULT_COMPLETED_PROJECTS_CONFIG.projects
                        )
                          .filter((p) => {
                            if (projectCatFilter !== 'all' && p.cat !== projectCatFilter) return false
                            if (projectSearch.trim()) {
                              const q = projectSearch.toLowerCase()
                              const title = (p[completedLang]?.title || p.en?.title || '').toLowerCase()
                              return title.includes(q)
                            }
                            return true
                          })
                          .map((proj) => {
                            const info = proj[completedLang] || proj.en || {}
                            return (
                              <div
                                key={proj.id}
                                className="rounded-xl border border-white/[0.08] bg-[#181818] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/20 transition-colors"
                              >
                                <div className="flex items-center gap-3.5 min-w-0">
                                  <div className="h-14 w-20 shrink-0 rounded-lg bg-black overflow-hidden relative border border-white/10 flex items-center justify-center">
                                    <video
                                      src={proj.video}
                                      muted
                                      loop
                                      className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                      <svg className="h-4 w-4 text-[#e3943f]" viewBox="0 0 24 24" fill="currentColor">
                                        <polygon points="5 3 19 12 5 21 5 3" />
                                      </svg>
                                    </div>
                                  </div>

                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-[13px] font-semibold text-white truncate">
                                        {info.title || proj.id}
                                      </h4>
                                      <span className="rounded-full bg-[#e3943f]/15 px-2 py-0.5 text-[9.5px] font-mono font-bold text-[#e3943f] uppercase">
                                        {proj.cat}
                                      </span>
                                    </div>
                                    <p className="mt-0.5 text-[11px] text-white/50 line-clamp-1">
                                      {info.summary || 'Custom studio commission'}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                  <button
                                    type="button"
                                    onClick={() => openEditProjectModal(proj)}
                                    className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white/80 hover:bg-white/[0.08] hover:text-white transition-colors cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteProject(proj.id, info.title || proj.id)}
                                    className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCompletedProjectsConfig(DEFAULT_COMPLETED_PROJECTS_CONFIG)
                          showToast('Reset to default completed projects configuration.')
                        }}
                        className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[11px] font-bold tracking-wider text-white/60 uppercase hover:text-white transition-colors cursor-pointer"
                      >
                        Reset Defaults
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveCompletedProjects}
                        disabled={completedProjectsSaving}
                        className="rounded-xl bg-gradient-to-r from-[#e3943f] to-[#d68532] px-6 py-3 text-[12px] font-bold tracking-[0.16em] text-black uppercase hover:brightness-105 transition-all shadow-lg shadow-[#e3943f]/25 disabled:opacity-50 cursor-pointer"
                      >
                        {completedProjectsSaving ? 'Saving Changes...' : 'Save & Publish Gallery'}
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Live Interactive Preview (5 cols) */}
                  <div className="lg:col-span-5 sticky top-28 space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[11px] font-bold tracking-widest text-white/50 uppercase flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                        Live Section Preview ({completedLang.toUpperCase()})
                      </span>

                    </div>

                    <div className="rounded-2xl border border-white/15 bg-[#101010] p-5 shadow-2xl space-y-4 select-none">
                      {/* Top Horizontal Categories Scroll */}
                      <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
                        {(completedProjectsConfig.categories?.[completedLang] || DEFAULT_COMPLETED_PROJECTS_CONFIG.categories[completedLang]).map(([cId, cName]) => {
                          const currentList = (Array.isArray(completedProjectsConfig.projects) && completedProjectsConfig.projects.length > 0)
                            ? completedProjectsConfig.projects
                            : DEFAULT_COMPLETED_PROJECTS_CONFIG.projects
                          const sample = cId === 'all'
                            ? currentList[0]
                            : (currentList.find((p) => p.cat === cId) || currentList[0])
                          return (
                            <div
                              key={cId}
                              className="shrink-0 h-[68px] w-[110px] rounded-xl bg-[#181818] border border-white/15 p-2 flex flex-col justify-end relative overflow-hidden group shadow-md"
                            >
                              {sample?.video ? (
                                <video
                                  src={sample.video}
                                  muted
                                  loop
                                  autoPlay
                                  playsInline
                                  className="absolute inset-0 h-full w-full object-cover opacity-65 group-hover:opacity-95 transition-opacity"
                                />
                              ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-[#2a221b] via-[#1c1813] to-[#101010]" />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                              <span className="relative z-20 text-[9.5px] font-bold tracking-wider uppercase text-white truncate drop-shadow-md">
                                {cName}
                              </span>
                            </div>
                          )
                        })}
                      </div>

                      {/* Main Center Card */}
                      <div className="rounded-2xl bg-[#171717] p-5 border border-white/10 space-y-4">
                        <h4 className="text-center text-[15px] font-medium tracking-[0.16em] text-white uppercase">
                          {completedProjectsConfig.copy?.[completedLang]?.lead}{' '}
                          <span className="text-[#e3943f]">{completedProjectsConfig.copy?.[completedLang]?.count}</span>{' '}
                          {completedProjectsConfig.copy?.[completedLang]?.tail}
                        </h4>

                        {/* Video Cards Row Preview */}
                        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                          {((Array.isArray(completedProjectsConfig.projects) && completedProjectsConfig.projects.length > 0)
                            ? completedProjectsConfig.projects
                            : DEFAULT_COMPLETED_PROJECTS_CONFIG.projects
                          ).slice(0, 5).map((p) => {
                            const info = p[completedLang] || p.en || {}
                            return (
                              <div
                                key={p.id}
                                className="shrink-0 h-[100px] w-[140px] rounded-xl bg-black overflow-hidden relative border border-white/15 flex flex-col justify-end p-2.5 group"
                              >
                                <video
                                  src={p.video}
                                  muted
                                  loop
                                  className="absolute inset-0 h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                                <span className="relative z-10 text-[10px] font-medium tracking-tight text-white line-clamp-1">
                                  {info.title}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    <p className="text-[11.5px] text-white/40 italic px-1">
                      * Real-time preview mirrors the exact layout on your public homepage (<span className="text-[#e3943f]">/#all-projects</span>). Click "Save & Publish" to update website live.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: BRAND SHOWCASE, CLIENTS BAR & WORLDWIDE RECOGNITION CUSTOMIZER */}
            {activeTab === 'brand_showcase' && (
              <div className="space-y-6 animate-fade-in">
                {/* Header with Sub-Tab Selector, Language Switcher and Global Save Action */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#e3943f] animate-pulse" />
                      <span className="text-[10px] font-bold tracking-[0.2em] text-[#e3943f] uppercase">
                        BRAND ARCHITECTURE & SHOWCASE ENGINE
                      </span>
                    </div>
                    <h3 className="text-[18px] font-semibold text-white mt-1">
                      Discover Style, Partner Clients & Worldwide Recognition (2M)
                    </h3>
                    <p className="text-[12.5px] text-white/50">
                      Edit copy, brand marks, social media links, metrics and video assets across all 3 flagship homepage sections.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => navigateTo('/')}
                      className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[11.5px] font-bold tracking-wider text-white/80 uppercase hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span>Preview Live</span>
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveBrandSections}
                      disabled={brandSaving}
                      className="rounded-xl bg-gradient-to-r from-[#e3943f] to-[#d68532] px-5 py-2.5 text-[11.5px] font-bold tracking-[0.14em] text-black uppercase hover:brightness-105 transition-all shadow-md shadow-[#e3943f]/25 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                    >
                      <svg className="h-4 w-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{brandSaving ? 'Publishing...' : 'Save & Publish Sections'}</span>
                    </button>
                  </div>
                </div>

                {/* Sub-Section Navigation Tabs */}
                <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-white/10 bg-[#161616] overflow-x-auto no-scrollbar">
                  <button
                    type="button"
                    onClick={() => setBrandSubTab('discover')}
                    className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-[12px] font-bold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${brandSubTab === 'discover'
                      ? 'bg-[#e3943f] text-black shadow-lg shadow-[#e3943f]/20'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
                      }`}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <span>1. Discover The Style (Video + 98%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBrandSubTab('clients')}
                    className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-[12px] font-bold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${brandSubTab === 'clients'
                      ? 'bg-[#e3943f] text-black shadow-lg shadow-[#e3943f]/20'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
                      }`}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    <span>2. Clients & Partners Bar ({brandSectionsConfig.clients?.brands?.length || 0})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBrandSubTab('recognition')}
                    className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-[12px] font-bold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${brandSubTab === 'recognition'
                      ? 'bg-[#e3943f] text-black shadow-lg shadow-[#e3943f]/20'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
                      }`}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                      <path d="M2 12h20" />
                    </svg>
                    <span>3. Worldwide Recognition (2 000 000)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBrandSubTab('expertSteps')}
                    className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-[12px] font-bold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${brandSubTab === 'expertSteps'
                      ? 'bg-[#e3943f] text-black shadow-lg shadow-[#e3943f]/20'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
                      }`}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <line x1="20" y1="8" x2="20" y2="14" />
                      <line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                    <span>4. Personal Expert (3 Steps)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBrandSubTab('dreamHome')}
                    className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-[12px] font-bold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${brandSubTab === 'dreamHome'
                      ? 'bg-[#e3943f] text-black shadow-lg shadow-[#e3943f]/20'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
                      }`}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span>5. Dream Home Consultation</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBrandSubTab('closing')}
                    className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-[12px] font-bold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${brandSubTab === 'closing'
                      ? 'bg-[#e3943f] text-black shadow-lg shadow-[#e3943f]/20'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
                      }`}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                    <span>6. Built Around The Way You Live</span>
                  </button>
                </div>

                {/* Split Grid: Left Form Controls, Right Live Interactive 1:1 Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Form Controls (7 cols) */}
                  <div className="lg:col-span-7 space-y-6">

                    {/* SUB-TAB 1: DISCOVER THE STYLE */}
                    {brandSubTab === 'discover' && (
                      <div className="space-y-6">
                        {/* 1. Headline & Description */}
                        <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                              1. Section Headline & Paragraph ({brandLang.toUpperCase()})
                            </label>
                            <span className="text-[10px] text-white/40 uppercase font-mono">
                              Public Headline Display
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                                Headline Lead:
                              </label>
                              <input
                                type="text"
                                value={brandSectionsConfig.discover?.[brandLang]?.line || ''}
                                onChange={(e) => updateDiscoverCopy('line', e.target.value)}
                                placeholder="e.g. Discover the"
                                className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                              />
                            </div>

                            <div>
                              <label className="block text-[10.5px] font-bold text-[#e3943f] uppercase tracking-wider mb-1">
                                Accent Headline (Gold Accent):
                              </label>
                              <input
                                type="text"
                                value={brandSectionsConfig.discover?.[brandLang]?.accent || ''}
                                onChange={(e) => updateDiscoverCopy('accent', e.target.value)}
                                placeholder="e.g. Unique Graphics style"
                                className="w-full rounded-xl border border-[#e3943f]/40 bg-[#181818] px-3.5 py-2.5 text-[12.5px] font-bold text-[#e3943f] outline-none focus:border-[#e3943f]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                              Body Text / Manifesto:
                            </label>
                            <textarea
                              rows={3}
                              value={brandSectionsConfig.discover?.[brandLang]?.text || ''}
                              onChange={(e) => updateDiscoverCopy('text', e.target.value)}
                              placeholder="We construct houses and design interiors in our signature style..."
                              className="w-full rounded-xl border border-white/10 bg-[#181818] p-3.5 text-[12.5px] text-white outline-none focus:border-[#e3943f] resize-none"
                            />
                          </div>
                        </div>

                        {/* 2. Customer Recommendation Stat & Action Button */}
                        <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                          <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                            2. Recommendation Metric & CTA Button ({brandLang.toUpperCase()})
                          </label>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[10.5px] font-bold text-[#e3943f] uppercase tracking-wider mb-1">
                                Percentage (Gold):
                              </label>
                              <input
                                type="text"
                                value={brandSectionsConfig.discover?.[brandLang]?.percent || ''}
                                onChange={(e) => updateDiscoverCopy('percent', e.target.value)}
                                placeholder="98%"
                                className="w-full rounded-xl border border-[#e3943f]/40 bg-[#181818] px-3.5 py-2.5 text-[13px] font-bold text-[#e3943f] outline-none focus:border-[#e3943f]"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                                Metric Subtitle:
                              </label>
                              <input
                                type="text"
                                value={brandSectionsConfig.discover?.[brandLang]?.recommend || ''}
                                onChange={(e) => updateDiscoverCopy('recommend', e.target.value)}
                                placeholder="of our customers recommend us"
                                className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                              Action Button Text:
                            </label>
                            <input
                              type="text"
                              value={brandSectionsConfig.discover?.[brandLang]?.button || ''}
                              onChange={(e) => updateDiscoverCopy('button', e.target.value)}
                              placeholder="Contact a manager"
                              className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                            />
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                          <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                            3. Showcase Video Loop / Visual
                          </label>

                          <div className="space-y-2">
                            <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider">
                              Video Loop File / Path:
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={brandSectionsConfig.discover?.mediaUrl || ''}
                                onChange={(e) =>
                                  setBrandSectionsConfig((prev) => ({
                                    ...prev,
                                    discover: { ...prev.discover, mediaUrl: e.target.value },
                                  }))
                                }
                                placeholder="Default: Studio internal loop (leave empty for default)"
                                className="flex-1 rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                              />
                              <label className="rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-[11.5px] font-bold tracking-wider text-white uppercase hover:bg-white/[0.1] transition-all cursor-pointer flex items-center gap-2 shrink-0">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                  <polyline points="17 8 12 3 7 8" />
                                  <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                <span>Upload</span>
                                <input
                                  type="file"
                                  accept="video/*,image/*"
                                  className="hidden"
                                  onChange={handleDiscoverMediaUpload}
                                />
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* 4. Consultation Modal Texts */}
                        <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                          <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                            4. Consultation Modal Copy ({brandLang.toUpperCase()})
                          </label>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                                Modal Heading Lead:
                              </label>
                              <input
                                type="text"
                                value={brandSectionsConfig.discover?.[brandLang]?.step || ''}
                                onChange={(e) => updateDiscoverCopy('step', e.target.value)}
                                placeholder="e.g. Step into"
                                className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                              />
                            </div>

                            <div>
                              <label className="block text-[10.5px] font-bold text-[#e3943f] uppercase tracking-wider mb-1">
                                Brand Title:
                              </label>
                              <input
                                type="text"
                                value={brandSectionsConfig.discover?.[brandLang]?.brand || ''}
                                onChange={(e) => updateDiscoverCopy('brand', e.target.value)}
                                placeholder="Unique Graphics"
                                className="w-full rounded-xl border border-[#e3943f]/40 bg-[#181818] px-3.5 py-2.5 text-[12.5px] font-bold text-[#e3943f] outline-none focus:border-[#e3943f]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                              Consultation Pitch Story:
                            </label>
                            <textarea
                              rows={2}
                              value={brandSectionsConfig.discover?.[brandLang]?.story || ''}
                              onChange={(e) => updateDiscoverCopy('story', e.target.value)}
                              placeholder="A place where your dreams take shape..."
                              className="w-full rounded-xl border border-white/10 bg-[#181818] p-3 text-[12px] text-white outline-none focus:border-[#e3943f] resize-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                              Submit Button Label:
                            </label>
                            <input
                              type="text"
                              value={brandSectionsConfig.discover?.[brandLang]?.submit || ''}
                              onChange={(e) => updateDiscoverCopy('submit', e.target.value)}
                              placeholder="Request a manager's consultation"
                              className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUB-TAB 2: CLIENTS & PARTNERS BAR */}
                    {brandSubTab === 'clients' && (
                      <div className="space-y-6">
                        {/* 1. Bar Headline */}
                        <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                          <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                            1. Clients Bar Lead Line ({brandLang.toUpperCase()})
                          </label>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                                Lead Text:
                              </label>
                              <input
                                type="text"
                                value={brandSectionsConfig.clients?.[brandLang]?.before || ''}
                                onChange={(e) => updateClientsCopy('before', e.target.value)}
                                placeholder="We are chosen by those"
                                className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                              />
                            </div>

                            <div>
                              <label className="block text-[10.5px] font-bold text-[#e3943f] uppercase tracking-wider mb-1">
                                Accent Text (Gold):
                              </label>
                              <input
                                type="text"
                                value={brandSectionsConfig.clients?.[brandLang]?.accent || ''}
                                onChange={(e) => updateClientsCopy('accent', e.target.value)}
                                placeholder="who strive for excellence"
                                className="w-full rounded-xl border border-[#e3943f]/40 bg-[#181818] px-3.5 py-2.5 text-[12.5px] font-bold text-[#e3943f] outline-none focus:border-[#e3943f]"
                              />
                            </div>

                            <div>
                              <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                                Tail Text:
                              </label>
                              <input
                                type="text"
                                value={brandSectionsConfig.clients?.[brandLang]?.after || ''}
                                onChange={(e) => updateClientsCopy('after', e.target.value)}
                                placeholder="— among our clients:"
                                className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                              />
                            </div>
                          </div>

                          <div className="rounded-xl border border-white/[0.08] bg-black/40 p-3 flex items-center justify-between">
                            <span className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">
                              Live Bar Header:
                            </span>
                            <span className="text-[12.5px] font-semibold uppercase tracking-wider text-white">
                              {brandSectionsConfig.clients?.[brandLang]?.before}
                              <span className="text-[#e3943f]">{brandSectionsConfig.clients?.[brandLang]?.accent}</span>
                              {brandSectionsConfig.clients?.[brandLang]?.after}
                            </span>
                          </div>
                        </div>

                        {/* 2. Client Brands List */}
                        <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                              2. Active Client Brands & Logos ({brandSectionsConfig.clients?.brands?.length || 0})
                            </label>
                            <button
                              type="button"
                              onClick={handleResetClientBrands}
                              className="text-[11px] text-white/40 hover:text-[#e3943f] transition-colors cursor-pointer"
                            >
                              ↺ Reset to Defaults
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {(brandSectionsConfig.clients?.brands || []).map((b, idx) => {
                              const bName = typeof b === 'string' ? b : b.name
                              const bType = typeof b === 'string' ? 'text' : (b.type || 'text')
                              const bSub = typeof b === 'string' ? '' : (b.sub || '')

                              return (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-[#181818] group hover:border-[#e3943f]/30 transition-all"
                                >
                                  <div className="flex items-center gap-2.5 overflow-hidden">
                                    <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50 uppercase">
                                      {bType}
                                    </span>
                                    <div className="truncate">
                                      <span className="font-bold text-white text-[13px] block truncate">
                                        {bName}
                                      </span>
                                      {bSub && (
                                        <span className="text-[9.5px] text-white/40 block truncate tracking-wider">
                                          {bSub}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleRemoveClientBrand(idx)}
                                    className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                    title="Delete brand"
                                  >
                                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <line x1="18" y1="6" x2="6" y2="18" />
                                      <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                  </button>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* 3. Add Brand Form */}
                        <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                          <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                            3. Add New Brand to Bar
                          </label>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                                Style Type:
                              </label>
                              <select
                                value={newBrandForm.type}
                                onChange={(e) => setNewBrandForm({ ...newBrandForm, type: e.target.value })}
                                className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f] cursor-pointer"
                              >
                                <option value="text">Bold Text (MR GROUP)</option>
                                <option value="badge">Pill Border Badge (ENGEC)</option>
                                <option value="italic">Luxury Italic Serif (DAMAC)</option>
                                <option value="hilton">Emblem + Subtitle (Hilton)</option>
                                <option value="jacob">Stacked Monogram (&Co Jacob)</option>
                                <option value="euro">Cyrillic Heavy (ЕВРОСТРОЙ)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                                Brand Name:
                              </label>
                              <input
                                type="text"
                                value={newBrandForm.name}
                                onChange={(e) => setNewBrandForm({ ...newBrandForm, name: e.target.value })}
                                placeholder="e.g. BULGARI"
                                className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                              />
                            </div>

                            <div>
                              <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                                Subtitle (Optional):
                              </label>
                              <input
                                type="text"
                                value={newBrandForm.sub}
                                onChange={(e) => setNewBrandForm({ ...newBrandForm, sub: e.target.value })}
                                placeholder="HOTELS & RESORTS"
                                className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleAddClientBrand}
                            className="rounded-xl border border-[#e3943f]/40 bg-[#e3943f]/10 px-4 py-2.5 text-[11.5px] font-bold tracking-wider text-[#e3943f] uppercase hover:bg-[#e3943f]/20 transition-all cursor-pointer flex items-center gap-2"
                          >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <line x1="12" y1="5" x2="12" y2="19" />
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            <span>Add Brand to Showcase Bar</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* SUB-TAB 3: WORLDWIDE RECOGNITION */}
                    {brandSubTab === 'recognition' && (
                      <div className="space-y-6">
                        {/* 1. Counter & Text */}
                        <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                          <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                            1. Follower Counter & Title ({brandLang.toUpperCase()})
                          </label>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                                Top Pill / Title:
                              </label>
                              <input
                                type="text"
                                value={brandSectionsConfig.recognition?.[brandLang]?.title || ''}
                                onChange={(e) => updateRecognitionCopy('title', e.target.value)}
                                placeholder="Worldwide recognition"
                                className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                              />
                            </div>

                            <div>
                              <label className="block text-[10.5px] font-bold text-[#e3943f] uppercase tracking-wider mb-1">
                                Follower Count (Gold Accent):
                              </label>
                              <input
                                type="text"
                                value={brandSectionsConfig.recognition?.[brandLang]?.count || ''}
                                onChange={(e) => updateRecognitionCopy('count', e.target.value)}
                                placeholder="2 000 000"
                                className="w-full rounded-xl border border-[#e3943f]/40 bg-[#181818] px-3.5 py-2.5 text-[14px] font-black text-[#e3943f] outline-none focus:border-[#e3943f]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                              Subtitle Description:
                            </label>
                            <input
                              type="text"
                              value={brandSectionsConfig.recognition?.[brandLang]?.text || ''}
                              onChange={(e) => updateRecognitionCopy('text', e.target.value)}
                              placeholder="people follow our development on social media"
                              className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                            />
                          </div>
                        </div>

                        {/* 2. Social Media URLs */}
                        <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                          <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                            2. Social Media Profile Links
                          </label>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <FaInstagram className="text-pink-400" />
                                <span>Instagram Profile:</span>
                              </label>
                              <input
                                type="text"
                                value={brandSectionsConfig.recognition?.socials?.instagram || ''}
                                onChange={(e) => updateRecognitionSocial('instagram', e.target.value)}
                                placeholder="https://instagram.com/..."
                                className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12px] text-white outline-none focus:border-[#e3943f]"
                              />
                            </div>

                            <div>
                              <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <FaPinterest className="text-red-400" />
                                <span>Pinterest Profile:</span>
                              </label>
                              <input
                                type="text"
                                value={brandSectionsConfig.recognition?.socials?.pinterest || ''}
                                onChange={(e) => updateRecognitionSocial('pinterest', e.target.value)}
                                placeholder="https://pinterest.com/..."
                                className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12px] text-white outline-none focus:border-[#e3943f]"
                              />
                            </div>

                            <div>
                              <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <FaVk className="text-blue-400" />
                                <span>VK Profile:</span>
                              </label>
                              <input
                                type="text"
                                value={brandSectionsConfig.recognition?.socials?.vk || ''}
                                onChange={(e) => updateRecognitionSocial('vk', e.target.value)}
                                placeholder="https://vk.com/..."
                                className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12px] text-white outline-none focus:border-[#e3943f]"
                              />
                            </div>

                            <div>
                              <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <FaYoutube className="text-red-500" />
                                <span>YouTube Channel:</span>
                              </label>
                              <input
                                type="text"
                                value={brandSectionsConfig.recognition?.socials?.youtube || ''}
                                onChange={(e) => updateRecognitionSocial('youtube', e.target.value)}
                                placeholder="https://youtube.com/..."
                                className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12px] text-white outline-none focus:border-[#e3943f]"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 3. Background Reel Media */}
                        <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                          <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                            3. Background Video Reel
                          </label>

                          <div className="space-y-2">
                            <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider">
                              Video Reel File / Path:
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={brandSectionsConfig.recognition?.mediaUrl || ''}
                                onChange={(e) =>
                                  setBrandSectionsConfig((prev) => ({
                                    ...prev,
                                    recognition: { ...prev.recognition, mediaUrl: e.target.value },
                                  }))
                                }
                                placeholder="Default: Studio interior showroom reel (leave blank for default)"
                                className="flex-1 rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                              />
                              <label className="rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-[11.5px] font-bold tracking-wider text-white uppercase hover:bg-white/[0.1] transition-all cursor-pointer flex items-center gap-2 shrink-0">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                  <polyline points="17 8 12 3 7 8" />
                                  <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                <span>Upload</span>
                                <input
                                  type="file"
                                  accept="video/*,image/*"
                                  className="hidden"
                                  onChange={handleRecognitionMediaUpload}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUB-TAB 4: PERSONAL EXPERT (3 STEPS) */}
                    {brandSubTab === 'expertSteps' && (
                      <div className="space-y-6">
                        {/* 1. Section Headline */}
                        <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                          <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                            1. Section Headline ({brandLang.toUpperCase()})
                          </label>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                                Lead Text:
                              </label>
                              <input
                                type="text"
                                value={brandSectionsConfig.expertSteps?.[brandLang]?.before || ''}
                                onChange={(e) => updateExpertStepsCopy('before', e.target.value)}
                                placeholder="Learn more about "
                                className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                              />
                            </div>

                            <div>
                              <label className="block text-[10.5px] font-bold text-[#e3943f] uppercase tracking-wider mb-1">
                                Accent Text (Gold):
                              </label>
                              <input
                                type="text"
                                value={brandSectionsConfig.expertSteps?.[brandLang]?.accent || ''}
                                onChange={(e) => updateExpertStepsCopy('accent', e.target.value)}
                                placeholder="creating your dream project"
                                className="w-full rounded-xl border border-[#e3943f]/40 bg-[#181818] px-3.5 py-2.5 text-[12.5px] font-bold text-[#e3943f] outline-none focus:border-[#e3943f]"
                              />
                            </div>

                            <div>
                              <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                                Tail Text:
                              </label>
                              <input
                                type="text"
                                value={brandSectionsConfig.expertSteps?.[brandLang]?.after || ''}
                                onChange={(e) => updateExpertStepsCopy('after', e.target.value)}
                                placeholder=" from your personal expert"
                                className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                              />
                            </div>
                          </div>

                          <div className="rounded-xl border border-white/[0.08] bg-black/40 p-3 flex items-center justify-between">
                            <span className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">
                              Live Headline:
                            </span>
                            <span className="text-[13px] font-bold uppercase tracking-wider text-white">
                              {brandSectionsConfig.expertSteps?.[brandLang]?.before}
                              <span className="text-[#e3943f]">{brandSectionsConfig.expertSteps?.[brandLang]?.accent}</span>
                              {brandSectionsConfig.expertSteps?.[brandLang]?.after}
                            </span>
                          </div>
                        </div>

                        {/* 2. Step 1, 2, 3 Cards */}
                        <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                          <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                            2. Three Sequential Process Steps ({brandLang.toUpperCase()})
                          </label>

                          {[0, 1, 2].map((stepIdx) => {
                            const stepData =
                              brandSectionsConfig.expertSteps?.[brandLang]?.steps?.[stepIdx] ||
                              DEFAULT_EXPERT_STEPS_CONFIG[brandLang]?.steps?.[stepIdx] ||
                              {}

                            return (
                              <div
                                key={stepIdx}
                                className="rounded-xl border border-white/10 bg-[#181818] p-4 space-y-3"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e3943f] text-black font-bold text-xs">
                                    {stepIdx + 1}
                                  </span>
                                  <span className="text-[11.5px] font-bold tracking-wider uppercase text-white">
                                    Step {stepIdx + 1}
                                  </span>
                                </div>

                                <div className="space-y-2">
                                  <div>
                                    <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                                      Step Title:
                                    </label>
                                    <input
                                      type="text"
                                      value={stepData.title || ''}
                                      onChange={(e) => updateExpertStepItem(stepIdx, 'title', e.target.value)}
                                      placeholder="e.g. Fill out the form"
                                      className="w-full rounded-xl border border-white/10 bg-[#121212] px-3.5 py-2 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                                      Step Description:
                                    </label>
                                    <textarea
                                      rows={2}
                                      value={stepData.text || ''}
                                      onChange={(e) => updateExpertStepItem(stepIdx, 'text', e.target.value)}
                                      placeholder="e.g. Provide your name and current phone number..."
                                      className="w-full rounded-xl border border-white/10 bg-[#121212] p-2.5 text-[12px] text-white outline-none focus:border-[#e3943f] resize-none"
                                    />
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* SUB-TAB 5: DREAM HOME CONSULTATION */}
                    {brandSubTab === 'dreamHome' && (
                      <div className="space-y-6">
                        {/* 1. Main Title & Description */}
                        <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                          <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                            1. Banner Title & Story ({brandLang.toUpperCase()})
                          </label>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                                Headline Title:
                              </label>
                              <input
                                type="text"
                                value={brandSectionsConfig.dreamHome?.[brandLang]?.title || ''}
                                onChange={(e) => updateDreamHomeCopy('title', e.target.value)}
                                placeholder="Turn your dreams of the perfect home into reality"
                                className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                              />
                            </div>

                            <div>
                              <label className="block text-[10.5px] font-bold text-[#e3943f] uppercase tracking-wider mb-1">
                                Accent Word (Gold):
                              </label>
                              <input
                                type="text"
                                value={brandSectionsConfig.dreamHome?.[brandLang]?.accent || ''}
                                onChange={(e) => updateDreamHomeCopy('accent', e.target.value)}
                                placeholder="with Unique Graphics"
                                className="w-full rounded-xl border border-[#e3943f]/40 bg-[#181818] px-3.5 py-2.5 text-[12.5px] font-bold text-[#e3943f] outline-none focus:border-[#e3943f]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                              Consultation Narrative Story:
                            </label>
                            <textarea
                              rows={3}
                              value={brandSectionsConfig.dreamHome?.[brandLang]?.story || ''}
                              onChange={(e) => updateDreamHomeCopy('story', e.target.value)}
                              placeholder="Leave your contact details, and our manager will reach out..."
                              className="w-full rounded-xl border border-white/10 bg-[#181818] p-3 text-[12.5px] text-white outline-none focus:border-[#e3943f] resize-none leading-relaxed"
                            />
                          </div>
                        </div>

                        {/* 2. Form Labels & Buttons */}
                        <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                          <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                            2. Form Prompt & Action Button ({brandLang.toUpperCase()})
                          </label>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                                Form Prompt:
                              </label>
                              <input
                                type="text"
                                value={brandSectionsConfig.dreamHome?.[brandLang]?.prompt || ''}
                                onChange={(e) => updateDreamHomeCopy('prompt', e.target.value)}
                                placeholder="Fill out the form and our manager will contact you"
                                className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                              />
                            </div>

                            <div>
                              <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                                Submit Button Label:
                              </label>
                              <input
                                type="text"
                                value={brandSectionsConfig.dreamHome?.[brandLang]?.submit || ''}
                                onChange={(e) => updateDreamHomeCopy('submit', e.target.value)}
                                placeholder="Request a manager's consultation"
                                className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                              Submission Success Message:
                            </label>
                            <input
                              type="text"
                              value={brandSectionsConfig.dreamHome?.[brandLang]?.thanks || ''}
                              onChange={(e) => updateDreamHomeCopy('thanks', e.target.value)}
                              placeholder="Thank you. Your request is noted on this page."
                              className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                            />
                          </div>
                        </div>

                        {/* 3. Media Visual & Video Loop */}
                        <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                          <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                            3. Showcase Visual (Video Loop or Photo)
                          </label>

                          <div className="space-y-2">
                            <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider">
                              Visual Source URL / Path:
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={brandSectionsConfig.dreamHome?.mediaUrl || ''}
                                onChange={(e) =>
                                  setBrandSectionsConfig((prev) => ({
                                    ...prev,
                                    dreamHome: { ...prev.dreamHome, mediaUrl: e.target.value },
                                  }))
                                }
                                placeholder="Default: Architectural gallery video loop (leave empty for default)"
                                className="flex-1 rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                              />
                              <label className="rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-[11.5px] font-bold tracking-wider text-white uppercase hover:bg-white/[0.1] transition-all cursor-pointer flex items-center gap-2 shrink-0">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                  <polyline points="17 8 12 3 7 8" />
                                  <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                <span>Upload</span>
                                <input
                                  type="file"
                                  accept="video/*,image/*"
                                  className="hidden"
                                  onChange={handleDreamHomeMediaUpload}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUB-TAB 6: BUILT AROUND THE WAY YOU LIVE (CLOSING MANIFESTO) */}
                    {brandSubTab === 'closing' && (
                      <div className="space-y-6">
                        {/* 1. Brand Mark & Headline */}
                        <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                          <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                            1. Eyebrow Mark & Big Headline ({brandLang.toUpperCase()})
                          </label>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[10.5px] font-bold text-[#e3943f] uppercase tracking-wider mb-1">
                                Eyebrow Studio Tag:
                              </label>
                              <input
                                type="text"
                                value={brandSectionsConfig.closing?.[brandLang]?.mark || ''}
                                onChange={(e) => updateClosingCopy('mark', e.target.value)}
                                placeholder="Unique Graphics"
                                className="w-full rounded-xl border border-[#e3943f]/40 bg-[#181818] px-3.5 py-2.5 text-[12.5px] font-bold text-[#e3943f] outline-none focus:border-[#e3943f]"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                                Main Title Headline:
                              </label>
                              <input
                                type="text"
                                value={brandSectionsConfig.closing?.[brandLang]?.title || ''}
                                onChange={(e) => updateClosingCopy('title', e.target.value)}
                                placeholder="Built around the way you live."
                                className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[13px] font-semibold text-white outline-none focus:border-[#e3943f]"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 2. Philosophy & Manifesto Body */}
                        <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                          <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                            2. Manifesto Statement Body ({brandLang.toUpperCase()})
                          </label>

                          <div>
                            <textarea
                              rows={4}
                              value={brandSectionsConfig.closing?.[brandLang]?.text || ''}
                              onChange={(e) => updateClosingCopy('text', e.target.value)}
                              placeholder="Plans, rooms, and the work on site. One studio from the first sketch to the last fitting."
                              className="w-full rounded-xl border border-white/10 bg-[#181818] p-3.5 text-[13px] text-white outline-none focus:border-[#e3943f] resize-none leading-relaxed"
                            />
                          </div>
                        </div>

                        {/* 3. Studio 3D Emblem / Logo (Beside Text Showcase) */}
                        <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                              3. Studio Showcase Emblem / Logo (Bagal Me / Beside Text)
                            </label>
                            <label className="inline-flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={brandSectionsConfig.closing?.showLogo !== false}
                                onChange={(e) => updateClosingSetting('showLogo', e.target.checked)}
                                className="h-4 w-4 rounded accent-[#e3943f]"
                              />
                              <span className="text-[11px] text-white/70 font-medium">Show Logo Beside Text</span>
                            </label>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                            {/* Logo Thumbnail Preview */}
                            <div className="relative group rounded-xl border border-white/10 bg-[#0d0d0d] p-3 flex flex-col items-center justify-center min-h-[140px] text-center">
                              {brandSectionsConfig.closing?.logoUrl || '/closing_logo.png' ? (
                                <>
                                  <img
                                    src={brandSectionsConfig.closing?.logoUrl || '/closing_logo.png'}
                                    alt="Closing Section Logo"
                                    className="max-h-24 max-w-full object-contain drop-shadow-md"
                                  />
                                  <span className="mt-2 text-[10px] text-emerald-400 font-mono">Active Logo</span>
                                </>
                              ) : (
                                <span className="text-[11px] text-white/40">No logo selected</span>
                              )}
                            </div>

                            {/* Logo controls & input */}
                            <div className="sm:col-span-2 space-y-3">
                              <div>
                                <label className="block text-[10.5px] font-bold text-white/60 uppercase tracking-wider mb-1">
                                  Logo Image URL or Local Asset:
                                </label>
                                <input
                                  type="text"
                                  value={brandSectionsConfig.closing?.logoUrl || '/closing_logo.png'}
                                  onChange={(e) => updateClosingSetting('logoUrl', e.target.value)}
                                  placeholder="/closing_logo.png"
                                  className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] font-mono text-white outline-none focus:border-[#e3943f]"
                                />
                              </div>

                              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                                <label className="inline-flex items-center gap-2 cursor-pointer rounded-xl border border-[#e3943f]/40 bg-[#e3943f]/10 px-4 py-2 text-[12px] font-bold text-[#e3943f] hover:bg-[#e3943f]/20 transition-colors shadow-sm">
                                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                  </svg>
                                  <span>Upload New Logo</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleClosingLogoUpload}
                                  />
                                </label>

                                <button
                                  type="button"
                                  onClick={() => updateClosingSetting('logoUrl', '/closing_logo.png')}
                                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11.5px] font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                  Use 3D UG Emblem
                                </button>

                                <button
                                  type="button"
                                  onClick={() => updateClosingSetting('logoUrl', '/logouniqe.png')}
                                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11.5px] font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                  Use Header Logo
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Sticky Live Interactive 1:1 Preview (5 cols) */}
                  <div className="lg:col-span-5 sticky top-28 space-y-4">
                    <div className="rounded-2xl border border-[#e3943f]/30 bg-[#111111] p-5 shadow-2xl relative overflow-hidden">
                      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08] mb-4">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                          <span className="text-[10px] font-bold tracking-[0.2em] text-[#e3943f] uppercase">
                            LIVE 1:1 FRONTEND PREVIEW
                          </span>
                        </div>
                        <span className="text-[10px] text-white/40 uppercase font-mono">
                          HOMEPAGE | {brandSubTab.toUpperCase()}
                        </span>
                      </div>

                      {/* PREVIEW FOR SUB-TAB 1: DISCOVER */}
                      {brandSubTab === 'discover' && (
                        <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                          <div>
                            <h4 className="text-[16px] font-bold tracking-[0.08em] uppercase text-white leading-tight">
                              {brandSectionsConfig.discover?.[brandLang]?.line || 'Discover the'}{' '}
                              <span className="text-[#e3943f] block">
                                {brandSectionsConfig.discover?.[brandLang]?.accent || 'Unique Graphics style'}
                              </span>
                            </h4>
                            <p className="text-[11.5px] text-white/60 mt-2 leading-relaxed">
                              {brandSectionsConfig.discover?.[brandLang]?.text ||
                                'We construct houses and design interiors in our signature style...'}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-white/[0.06]">
                            <div className="text-[24px] font-black text-[#e3943f]">
                              {brandSectionsConfig.discover?.[brandLang]?.percent || '98%'}
                            </div>
                            <div className="text-[10.5px] text-white/50 tracking-wider uppercase">
                              {brandSectionsConfig.discover?.[brandLang]?.recommend ||
                                'of our customers recommend us'}
                            </div>
                          </div>

                          <div className="pt-1">
                            <button
                              type="button"
                              className="w-full rounded-xl bg-gradient-to-r from-[#e3943f] to-[#d68532] py-2.5 text-[11px] font-bold tracking-wider text-black uppercase shadow-md shadow-[#e3943f]/20 pointer-events-none"
                            >
                              {brandSectionsConfig.discover?.[brandLang]?.button || 'Contact a manager'}
                            </button>
                          </div>

                          {/* Video Thumbnail mockup */}
                          <div className="mt-2 rounded-xl overflow-hidden border border-white/10 aspect-video relative bg-black flex items-center justify-center">
                            <LoopVideo
                              src={brandSectionsConfig.discover?.mediaUrl || projects[7]?.video}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}

                      {/* PREVIEW FOR SUB-TAB 2: CLIENTS BAR */}
                      {brandSubTab === 'clients' && (
                        <div className="space-y-4">
                          <div className="rounded-2xl border border-white/10 bg-black p-5 space-y-4">
                            <p className="text-[11px] text-center uppercase tracking-[0.14em] text-white font-semibold leading-relaxed">
                              {brandSectionsConfig.clients?.[brandLang]?.before || 'We are chosen by those '}
                              <span className="text-[#e3943f]">
                                {brandSectionsConfig.clients?.[brandLang]?.accent || 'who strive for excellence'}
                              </span>
                              {brandSectionsConfig.clients?.[brandLang]?.after || ' — among our clients:'}
                            </p>

                            <div className="py-3 border-y border-white/[0.08] overflow-x-auto no-scrollbar flex items-center gap-6 justify-center flex-wrap">
                              {(brandSectionsConfig.clients?.brands || []).map((b, idx) => {
                                const bName = typeof b === 'string' ? b : b.name
                                const bType = typeof b === 'string' ? 'text' : (b.type || 'text')
                                const bSub = typeof b === 'string' ? '' : (b.sub || '')

                                if (bType === 'badge') {
                                  return (
                                    <span
                                      key={idx}
                                      className="rounded-full border border-white/80 px-3 py-1 text-[11px] font-bold tracking-widest text-white shrink-0"
                                    >
                                      {bName}
                                    </span>
                                  )
                                }
                                if (bType === 'italic') {
                                  return (
                                    <span
                                      key={idx}
                                      className="font-serif italic font-bold text-[18px] text-white shrink-0"
                                    >
                                      {bName}
                                    </span>
                                  )
                                }
                                if (bType === 'hilton') {
                                  return (
                                    <span key={idx} className="flex items-center gap-1.5 shrink-0">
                                      <span className="h-6 w-6 rounded-full border border-white flex items-center justify-center text-[10px] text-white">
                                        H
                                      </span>
                                      <span className="text-left">
                                        <span className="block font-serif text-[12px] leading-tight text-white">
                                          {bName}
                                        </span>
                                        {bSub && (
                                          <span className="block text-[7px] text-white/60 tracking-wider">
                                            {bSub}
                                          </span>
                                        )}
                                      </span>
                                    </span>
                                  )
                                }
                                if (bType === 'jacob') {
                                  return (
                                    <span key={idx} className="text-center shrink-0">
                                      <span className="block font-serif text-[16px] text-white leading-none">
                                        {bName}
                                      </span>
                                      {bSub && (
                                        <span className="block text-[7px] text-white/60 tracking-wider">
                                          {bSub}
                                        </span>
                                      )}
                                    </span>
                                  )
                                }
                                return (
                                  <span key={idx} className="text-[14px] font-bold tracking-wider text-white shrink-0">
                                    {bName}
                                  </span>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* PREVIEW FOR SUB-TAB 3: WORLDWIDE RECOGNITION */}
                      {brandSubTab === 'recognition' && (
                        <div className="rounded-2xl border border-white/10 bg-[#0d0d0d] p-6 relative overflow-hidden text-center space-y-4 min-h-[300px] flex items-center justify-center">
                          {/* Background Video Reel */}
                          <LoopVideo
                            src={brandSectionsConfig.recognition?.mediaUrl || recognitionDefaultReel}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

                          {/* Glass card mockup */}
                          <div className="relative z-10 rounded-2xl border border-white/15 bg-black/60 backdrop-blur-md p-6 space-y-3 w-full">
                            <span className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase block">
                              {brandSectionsConfig.recognition?.[brandLang]?.title || 'Worldwide recognition'}
                            </span>

                            <div className="text-[34px] font-black text-[#e3943f] tracking-tight leading-none">
                              {brandSectionsConfig.recognition?.[brandLang]?.count || '2 000 000'}
                            </div>

                            <p className="text-[11px] text-white/70 max-w-[260px] mx-auto leading-relaxed">
                              {brandSectionsConfig.recognition?.[brandLang]?.text ||
                                'people follow our development on social media'}
                            </p>

                            {/* Social Icons Mockup */}
                            <div className="flex items-center justify-center gap-3 pt-3">
                              <a
                                href={brandSectionsConfig.recognition?.socials?.instagram || '#'}
                                target="_blank"
                                rel="noreferrer"
                                className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center text-[13px] hover:scale-110 transition-transform"
                                title="Instagram"
                              >
                                <FaInstagram />
                              </a>
                              <a
                                href={brandSectionsConfig.recognition?.socials?.pinterest || '#'}
                                target="_blank"
                                rel="noreferrer"
                                className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center text-[13px] hover:scale-110 transition-transform"
                                title="Pinterest"
                              >
                                <FaPinterest />
                              </a>
                              <a
                                href={brandSectionsConfig.recognition?.socials?.vk || '#'}
                                target="_blank"
                                rel="noreferrer"
                                className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center text-[13px] hover:scale-110 transition-transform"
                                title="VK"
                              >
                                <FaVk />
                              </a>
                              <a
                                href={brandSectionsConfig.recognition?.socials?.youtube || '#'}
                                target="_blank"
                                rel="noreferrer"
                                className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center text-[13px] hover:scale-110 transition-transform"
                                title="YouTube"
                              >
                                <FaYoutube />
                              </a>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* PREVIEW FOR SUB-TAB 4: 3 EXPERT STEPS */}
                      {brandSubTab === 'expertSteps' && (
                        <div className="space-y-4">
                          <p className="text-[12px] uppercase tracking-[0.12em] text-white font-medium leading-relaxed">
                            {brandSectionsConfig.expertSteps?.[brandLang]?.before || 'Learn more about '}{' '}
                            <span className="text-[#e3943f] font-semibold">
                              {brandSectionsConfig.expertSteps?.[brandLang]?.accent || 'creating your dream project'}
                            </span>{' '}
                            {brandSectionsConfig.expertSteps?.[brandLang]?.after || ' from your personal expert'}
                          </p>

                          <div className="space-y-4 pt-2">
                            {(brandSectionsConfig.expertSteps?.[brandLang]?.steps || []).map((step, idx) => (
                              <div
                                key={idx}
                                className="relative rounded-2xl bg-[#1c1c1c] p-4 pt-6 border border-white/5 text-center"
                              >
                                <span className="absolute top-0 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#e3943f] bg-[#141414] text-[13px] font-bold text-[#e3943f] shadow-[0_0_0_4px_rgb(227_148_63_/_15%)]">
                                  {idx + 1}
                                </span>
                                <span className="block text-[11px] font-bold tracking-[0.14em] text-[#e3943f] uppercase">
                                  {step.title}
                                </span>
                                <span className="mt-1.5 block text-[11px] leading-relaxed text-white/70">
                                  {step.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* PREVIEW FOR SUB-TAB 5: DREAM HOME CONSULTATION */}
                      {brandSubTab === 'dreamHome' && (
                        <div className="space-y-4">
                          {/* Media Preview */}
                          <div className="rounded-xl overflow-hidden border border-white/10 aspect-video relative bg-black flex items-center justify-center">
                            {brandSectionsConfig.dreamHome?.mediaUrl ? (
                              brandSectionsConfig.dreamHome.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                                <LoopVideo
                                  src={brandSectionsConfig.dreamHome.mediaUrl}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <img
                                  src={brandSectionsConfig.dreamHome.mediaUrl}
                                  alt="Dream home preview"
                                  className="w-full h-full object-cover"
                                />
                              )
                            ) : (
                              <LoopVideo
                                src={projects[5]?.video}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>

                          {/* Consultation Form Mockup */}
                          <div className="rounded-2xl border border-white/10 bg-[#161616] p-4 space-y-3">
                            <h4 className="text-[15px] font-bold uppercase tracking-wider text-white leading-tight">
                              {brandSectionsConfig.dreamHome?.[brandLang]?.title || 'Turn your dreams of the perfect home into reality'}{' '}
                              <span className="text-[#e3943f] block">
                                {brandSectionsConfig.dreamHome?.[brandLang]?.accent || 'with Unique Graphics'}
                              </span>
                            </h4>

                            <p className="text-[11px] text-white/60 leading-relaxed">
                              {brandSectionsConfig.dreamHome?.[brandLang]?.story ||
                                'Leave your contact details, and our manager will reach out to discuss your project.'}
                            </p>

                            <div className="pt-2 border-t border-white/[0.08] space-y-2.5">
                              <span className="block text-[10.5px] font-bold tracking-wider text-[#e3943f] uppercase">
                                {brandSectionsConfig.dreamHome?.[brandLang]?.prompt || 'Fill out the form and our manager will contact you'}
                              </span>

                              <div className="space-y-2">
                                <div className="rounded-lg border border-white/10 bg-[#121212] px-3 py-2 text-[11px] text-white/40">
                                  {brandSectionsConfig.dreamHome?.[brandLang]?.name || 'Your name'}
                                </div>
                                <div className="flex gap-2">
                                  <div className="rounded-lg border border-white/10 bg-[#121212] px-3 py-2 text-[11px] text-white/50 shrink-0">
                                    India +91
                                  </div>
                                  <div className="flex-1 rounded-lg border border-white/10 bg-[#121212] px-3 py-2 text-[11px] text-white/40">
                                    {brandSectionsConfig.dreamHome?.[brandLang]?.phone || 'Phone number'}
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                className="w-full rounded-xl bg-gradient-to-r from-[#e3943f] to-[#d68532] py-2.5 text-[11px] font-bold tracking-wider text-black uppercase shadow-md shadow-[#e3943f]/20 pointer-events-none"
                              >
                                {brandSectionsConfig.dreamHome?.[brandLang]?.submit || "Request a manager's consultation"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* PREVIEW FOR SUB-TAB 6: CLOSING MANIFESTO */}
                      {brandSubTab === 'closing' && (
                        <div className="rounded-2xl border border-white/10 bg-[#0d0d0d] p-6 relative overflow-hidden">
                          <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
                            <div className="space-y-3 flex-1">
                              <span className="text-[10px] font-bold tracking-[0.2em] text-[#e3943f] uppercase block">
                                {brandSectionsConfig.closing?.[brandLang]?.mark || 'Unique Graphics'}
                              </span>

                              <h3 className="text-[20px] font-bold text-white leading-tight">
                                {brandSectionsConfig.closing?.[brandLang]?.title || 'Built around the way you live.'}
                              </h3>

                              <p className="text-[12px] text-white/70 leading-relaxed pt-2 border-t border-white/[0.08]">
                                {brandSectionsConfig.closing?.[brandLang]?.text ||
                                  'Plans, rooms, and the work on site. One studio from the first sketch to the last fitting.'}
                              </p>
                            </div>

                            {brandSectionsConfig.closing?.showLogo !== false && (
                              <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 flex items-center justify-center rounded-xl bg-black/40 border border-[#e3943f]/20 p-2 relative group">
                                <div className="pointer-events-none absolute -inset-2 rounded-xl bg-gradient-to-tr from-[#e3943f]/20 to-transparent blur-md opacity-50" />
                                <img
                                  src={brandSectionsConfig.closing?.logoUrl || '/closing_logo.png'}
                                  alt="Preview Logo"
                                  className="max-h-full max-w-full object-contain drop-shadow relative z-10"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <p className="text-[11px] text-white/40 italic mt-3 px-1">
                        * Real-time preview mirrors public homepage sections (<span className="text-[#e3943f]">/#brand</span>). Click "Save & Publish" to update website live.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: ABOUT US PAGE STUDIO MANAGER (STANDALONE COMPONENT) */}
            {activeTab === 'about_page' && (
              <AboutPageManager token={token} />
            )}

            {/* VIEW: PORTFOLIO & CATEGORY PAGES MANAGER (STANDALONE COMPONENT) */}
            {activeTab === 'portfolio_pages' && (
              <PortfolioManager token={token} />
            )}

            {/* VIEW: SERVICES & DISCIPLINES MANAGER (STANDALONE COMPONENT) */}
            {activeTab === 'services_pages' && (
              <ServicesManager token={token} />
            )}

            {/* VIEW: CONTACT US PORTAL MANAGER (STANDALONE COMPONENT) */}
            {activeTab === 'contact_page' && (
              <ContactPageManager token={token} />
            )}

            {/* VIEW 3: CLIENT INQUIRIES & CONTACT US PIPELINE */}
            {activeTab === 'inquiries' && (
              <div className="space-y-6 animate-fade-in">
                {/* Switcher Header: Leads vs Portal Customizer */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-[#161616] border border-white/10 rounded-2xl p-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl text-[12px] font-bold uppercase tracking-wider bg-[#e3943f] text-black shadow-md cursor-default flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <span>Client Leads Pipeline ({inquiries.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('contact_page')}
                      className="px-4 py-2 rounded-xl text-[12px] font-semibold uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer flex items-center gap-2 border border-white/10 hover:border-[#e3943f]/40"
                    >
                      <svg className="w-4 h-4 text-[#e3943f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Customize /contacts Portal</span>
                      <span className="text-[10px] text-[#e3943f] font-mono font-bold bg-[#e3943f]/10 px-2 py-0.5 rounded-md">Edit Reel & Copy</span>
                    </button>
                  </div>
                  <a
                    href="/contacts"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-[11px] text-white/50 hover:text-white hover:border-[#e3943f]/50 transition-colors"
                  >
                    <span>View Live /contacts</span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                {/* 4 Metric Summary Cards for Contact Us Inquiries */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-[#141414] p-4">
                    <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase block">
                      TOTAL CONTACT ENTRIES
                    </span>
                    <p className="mt-1 text-[24px] font-light text-white">{inquiries.length}</p>
                    <span className="text-[10.5px] text-white/40">From /contacts & direct leads</span>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#141414] p-4">
                    <span className="text-[10px] font-bold tracking-widest text-[#e3943f] uppercase block">
                      NEW LEADS (PENDING)
                    </span>
                    <p className="mt-1 text-[24px] font-light text-[#e3943f]">
                      {inquiries.filter((i) => i.status === 'New Inquiry').length}
                    </p>
                    <span className="text-[10.5px] text-white/40">Requires client contact</span>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#141414] p-4">
                    <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase block">
                      IN REVIEW / OFFER SENT
                    </span>
                    <p className="mt-1 text-[24px] font-light text-blue-400">
                      {inquiries.filter((i) => i.status === 'Offer Sent' || i.status === 'In Review').length}
                    </p>
                    <span className="text-[10.5px] text-white/40">Negotiation phase</span>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#141414] p-4">
                    <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase block">
                      CONTRACT SIGNED
                    </span>
                    <p className="mt-1 text-[24px] font-light text-emerald-400">
                      {inquiries.filter((i) => i.status === 'Contract Signed').length}
                    </p>
                    <span className="text-[10.5px] text-white/40">Active studio commissions</span>
                  </div>
                </div>

                {/* Filter, Search and Action Buttons Bar */}
                <div className="rounded-2xl border border-white/10 bg-[#141414] p-4 sm:p-5 shadow-xl space-y-4">
                  {/* Top Row: Search Input & Action Buttons */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-md">
                      <input
                        type="text"
                        placeholder="Search client name, phone, location, inquiry notes..."
                        value={inquirySearch}
                        onChange={(e) => setInquirySearch(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#181818] pl-9.5 pr-8 py-2.5 text-[12.5px] text-white placeholder-white/35 outline-none transition-colors focus:border-[#e3943f] focus:bg-[#1a1a1a]"
                      />
                      <svg
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      {inquirySearch && (
                        <button
                          type="button"
                          onClick={() => setInquirySearch('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Action Buttons: Sync, Clear All, and Log Contact Entry */}
                    <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          fetchInquiries(token)
                          showToast('Client inquiries refreshed from MongoDB.')
                        }}
                        className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-[11px] font-bold tracking-wider text-white/80 uppercase hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer flex items-center gap-2 shrink-0 active:scale-95"
                        title="Sync with MongoDB backend"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                        </svg>
                        <span>Sync</span>
                      </button>

                      {inquiries.length > 0 && (
                        <button
                          type="button"
                          onClick={handlePurgeAllInquiries}
                          className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-[11px] font-bold tracking-wider text-red-400 uppercase hover:bg-red-500/20 hover:border-red-500/50 transition-all cursor-pointer flex items-center gap-2 shrink-0 active:scale-95"
                          title="Delete all contact entries"
                        >
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                          <span>Clear All</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setNewInquiryModalOpen(true)}
                        className="rounded-xl bg-gradient-to-r from-[#e3943f] to-[#d68532] px-4.5 py-2.5 text-[11px] font-black tracking-[0.14em] text-black uppercase transition-all hover:brightness-110 shadow-lg shadow-[#e3943f]/25 active:scale-[0.98] cursor-pointer flex items-center gap-2 shrink-0 whitespace-nowrap"
                      >
                        <svg className="h-3.5 w-3.5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        <span>Log Contact Entry</span>
                      </button>
                    </div>
                  </div>

                  {/* Bottom Row: Status Filter Pills (Single clean row with count badges) */}
                  <div className="flex items-center gap-2 pt-3 border-t border-white/[0.08] overflow-x-auto no-scrollbar">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase shrink-0 mr-1 hidden sm:inline-block">
                      STATUS:
                    </span>
                    {['ALL', 'NEW INQUIRY', 'OFFER SENT', 'IN REVIEW', 'CONTRACT SIGNED'].map((st) => {
                      const count =
                        st === 'ALL'
                          ? inquiries.length
                          : inquiries.filter((i) => i.status?.toUpperCase() === st).length

                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setInquiryFilter(st)}
                          className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 shrink-0 ${inquiryFilter === st
                            ? 'bg-[#e3943f] text-black shadow-md shadow-[#e3943f]/20 font-black'
                            : 'border border-white/10 bg-white/[0.02] text-white/60 hover:text-white hover:border-white/20'
                            }`}
                        >
                          <span>{st}</span>
                          <span
                            className={`text-[9.5px] px-1.5 py-0.5 rounded-full font-bold ${inquiryFilter === st
                              ? 'bg-black/25 text-black'
                              : 'bg-white/10 text-white/50'
                              }`}
                          >
                            {count}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Inquiries Table */}
                <div className="rounded-2xl border border-white/10 bg-[#141414] overflow-hidden shadow-xl">
                  <div className="p-5 sm:p-6 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3 bg-[#161616]/70">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#e3943f] animate-pulse" />
                        <h3 className="text-[14px] font-bold tracking-wider text-white uppercase">
                          Contact Us Client Dossiers & Leads Pipeline
                        </h3>
                      </div>
                      <p className="text-[12px] text-white/50 mt-0.5">
                        Showing {filteredInquiries.length} client contact submissions. Click phone to open WhatsApp chat.
                      </p>
                    </div>
                    <span className="rounded-full bg-[#e3943f]/15 border border-[#e3943f]/40 px-3 py-1 text-[10px] font-bold text-[#e3943f] uppercase">
                      Live Feed Connected
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[13px]">
                      <thead className="bg-[#111111] text-white/40 uppercase text-[10.5px] tracking-wider border-b border-white/[0.06]">
                        <tr>
                          <th className="py-3.5 px-5">ID & Date</th>
                          <th className="py-3.5 px-5">Client Name</th>
                          <th className="py-3.5 px-5">Phone & WhatsApp</th>
                          <th className="py-3.5 px-5">Country / Hub</th>
                          <th className="py-3.5 px-5">Typology & Budget</th>
                          <th className="py-3.5 px-5">Project Note / Brief</th>
                          <th className="py-3.5 px-5">Pipeline State</th>
                          <th className="py-3.5 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.05] text-white/80">
                        {filteredInquiries.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="py-16 text-center">
                              <div className="flex flex-col items-center justify-center space-y-2 text-white/40">
                                <svg className="h-8 w-8 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                  <polyline points="22,6 12,13 2,6" />
                                </svg>
                                <p className="text-[14px] font-medium text-white/60">No client contact entries yet</p>
                                <p className="text-[12px] text-white/40 max-w-sm">
                                  Submissions from visitors on the <span className="text-[#e3943f]">/contacts</span> page or entries logged with <span className="text-white/70">+ Log Contact Entry</span> will appear here in real time.
                                </p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredInquiries.map((inq) => {
                            const rawPhone = inq.phone ? inq.phone.replace(/[^0-9]/g, '') : ''
                            const waLink = rawPhone
                              ? `https://wa.me/${rawPhone}?text=Hello%20${encodeURIComponent(inq.client)},%20thank%20you%20for%20contacting%20Unique%20Graphics%20Architectural%20Studio.`
                              : ''

                            return (
                              <tr key={inq.id || inq._id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="py-4 px-5">
                                  <span className="font-mono text-white/70 text-xs block font-bold">{inq.id}</span>
                                  <span className="text-[10px] text-white/40 block mt-0.5">{inq.date}</span>
                                </td>

                                <td className="py-4 px-5">
                                  <div className="flex items-center gap-2.5">
                                    <div className="h-8 w-8 rounded-full bg-[#e3943f]/15 border border-[#e3943f]/30 flex items-center justify-center font-bold text-[11px] text-[#e3943f] shrink-0">
                                      {inq.client?.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                      <span className="font-semibold text-white group-hover:text-[#e3943f] transition-colors block truncate">
                                        {inq.client}
                                      </span>
                                      <span className="text-[10px] text-white/40 font-mono block">
                                        {inq.source || 'Contact Us Page'}
                                      </span>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-4 px-5">
                                  {inq.phone ? (
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-white text-[12px] font-medium">
                                        {inq.phone}
                                      </span>
                                      {waLink && (
                                        <a
                                          href={waLink}
                                          target="_blank"
                                          rel="noreferrer"
                                          title="Chat with client on WhatsApp"
                                          className="inline-flex items-center gap-1 rounded-md bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                                        >
                                          <span>WhatsApp</span>
                                          <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                            <polyline points="15 3 21 3 21 9" />
                                            <line x1="10" y1="14" x2="21" y2="3" />
                                          </svg>
                                        </a>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-white/30 text-xs italic">No phone provided</span>
                                  )}
                                  {inq.email && (
                                    <span className="text-[11px] text-white/50 block truncate mt-0.5 font-mono">
                                      {inq.email}
                                    </span>
                                  )}
                                </td>

                                <td className="py-4 px-5 text-white/75 text-[12.5px]">{inq.location}</td>

                                <td className="py-4 px-5">
                                  <span className="rounded-md bg-white/[0.04] border border-white/10 px-2 py-0.5 text-[10.5px] font-medium text-white/80 block w-fit truncate max-w-[150px]">
                                    {inq.type}
                                  </span>
                                  <span className="font-mono text-[#e3943f] text-[11px] font-bold block mt-1">
                                    {inq.budget}
                                  </span>
                                </td>

                                <td className="py-4 px-5">
                                  <p className="max-w-[200px] truncate text-[11.5px] text-white/60 italic" title={inq.message}>
                                    "{inq.message || 'Direct inquiry submitted from Contact Us page.'}"
                                  </p>
                                </td>

                                <td className="py-4 px-5">
                                  {/* Interactive Status Selector */}
                                  <select
                                    value={inq.status}
                                    onChange={(e) => handleStatusChange(inq.id || inq._id, e.target.value)}
                                    className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase outline-none cursor-pointer bg-[#121212] ${inq.statusColor}`}
                                  >
                                    <option value="New Inquiry" className="bg-[#161616] text-[#e3943f]">New Inquiry</option>
                                    <option value="In Review" className="bg-[#161616] text-amber-300">In Review</option>
                                    <option value="Offer Sent" className="bg-[#161616] text-blue-400">Offer Sent</option>
                                    <option value="Contract Signed" className="bg-[#161616] text-emerald-400">Contract Signed</option>
                                  </select>
                                </td>

                                <td className="py-4 px-5 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedInquiry(inq)}
                                      className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-bold text-white/80 uppercase hover:border-[#e3943f] hover:text-[#e3943f] transition-colors cursor-pointer"
                                    >
                                      Review
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleDeleteInquiry(inq)}
                                      className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                                      title="Delete client entry"
                                    >
                                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}



            {/* VIEW 4: BLOG & JOURNAL MANAGEMENT (WEBSITE INTEGRATED) */}
            {activeTab === 'blog' && (
              <div className="space-y-6 animate-fade-in">
                {/* Header with Stats & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#e3943f]" />
                      <span className="text-[10px] font-bold tracking-[0.2em] text-[#e3943f] uppercase">
                        EDITORIAL ENGINE
                      </span>
                    </div>
                    <h3 className="text-[16px] sm:text-[18px] font-normal tracking-wide text-white uppercase mt-0.5">
                      Architectural Journal & Publications
                    </h3>
                    <p className="text-[12px] text-white/50">
                      Live editorial monographs synchronized directly with the website's public /blog portal.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setBannerModalOpen(true)}
                      className="rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-[11px] font-bold tracking-wider text-white/80 uppercase hover:border-[#e3943f] hover:text-[#e3943f] transition-all cursor-pointer flex items-center gap-2"
                      title="Update Blog Hero Banner Headlines, Badge & Newsletter Typography"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                      <span>Hero & Banner Settings</span>
                    </button>



                    <button
                      type="button"
                      onClick={openCreateBlogModal}
                      className="rounded-xl bg-gradient-to-r from-[#e3943f] via-[#ec9f46] to-[#d68532] px-5 py-2.5 text-[11px] font-bold tracking-[0.14em] text-black uppercase transition-all hover:brightness-105 shadow-md shadow-[#e3943f]/25 active:scale-[0.99] cursor-pointer flex items-center gap-2"
                    >
                      <svg className="h-3.5 w-3.5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      <span> Draft New Essay</span>
                    </button>
                  </div>
                </div>

                {/* Metric Summary Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-xl border border-white/10 bg-[#141414] p-3.5">
                    <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase block">
                      TOTAL ESSAYS
                    </span>
                    <p className="mt-1 text-[22px] font-light text-white">{blogs.length}</p>
                    <span className="text-[10.5px] text-white/40">Monographs in database</span>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#141414] p-3.5">
                    <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase block">
                      LIVE ON SITE
                    </span>
                    <p className="mt-1 text-[22px] font-light text-emerald-400">
                      {blogs.filter((b) => b.published !== false).length}
                    </p>
                    <span className="text-[10.5px] text-white/40">Publicly readable</span>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#141414] p-3.5">
                    <span className="text-[10px] font-bold tracking-widest text-[#e3943f] uppercase block">
                      DRAFTS / UNLISTED
                    </span>
                    <p className="mt-1 text-[22px] font-light text-[#e3943f]">
                      {blogs.filter((b) => b.published === false).length}
                    </p>
                    <span className="text-[10.5px] text-white/40">In review / hidden</span>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#141414] p-3.5">
                    <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase block">
                      READERSHIP
                    </span>
                    <p className="mt-1 text-[22px] font-light text-white">12.8K+</p>
                    <span className="text-[10.5px] text-white/40">HNWI executive readers</span>
                  </div>
                </div>

                {/* ACTIVE LIVE COVER STORY BANNER CONTROL CARD */}
                {(() => {
                  const coverBlog = blogs.find((b) => b.featured) || blogs[0]
                  if (!coverBlog) return null
                  const isVideo =
                    coverBlog.image &&
                    (coverBlog.image.endsWith('.mp4') ||
                      coverBlog.image.includes('/video/') ||
                      coverBlog.image.startsWith('data:video'))

                  return (
                    <div className="relative rounded-2xl border-2 border-[#e3943f]/60 bg-gradient-to-br from-[#1b1b1b] via-[#141414] to-[#0e0e0e] p-5 sm:p-7 shadow-2xl shadow-black/70 overflow-hidden">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3.5 border-b border-white/10">
                        <div className="flex items-center gap-2.5">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e3943f] opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#e3943f]" />
                          </span>
                          <span className="text-[12px] font-black tracking-[0.2em] text-[#e3943f] uppercase">
                            LIVE COVER STORY BANNER (HEADLINER ON /BLOG)
                          </span>
                        </div>

                        {/* Switch Cover Article Selector */}
                        <div className="flex items-center gap-2.5">
                          <span className="text-[10.5px] text-white/50 uppercase font-bold tracking-wider">
                            Promote to Cover:
                          </span>
                          <select
                            value={coverBlog._id || coverBlog.slug || coverBlog.id}
                            onChange={(e) => {
                              const target = blogs.find(
                                (b) => (b._id || b.slug || b.id) === e.target.value
                              )
                              if (target) handleSetFeaturedCover(target)
                            }}
                            className="rounded-xl border border-white/20 bg-black/70 px-3 py-1.5 text-[11.5px] font-medium text-white outline-none focus:border-[#e3943f] cursor-pointer"
                          >
                            {blogs.map((b) => (
                              <option
                                key={b._id || b.slug || b.id}
                                value={b._id || b.slug || b.id}
                                className="bg-[#1c1c1c] text-white"
                              >
                                {b.featured ? '★ [CURRENT COVER] ' : ''}
                                {b.title.slice(0, 48)}...
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        {/* Media Preview Box */}
                        <div className="relative lg:col-span-6 h-52 sm:h-64 rounded-xl overflow-hidden border border-white/15 bg-black/60 group">
                          {isVideo ? (
                            <video
                              src={coverBlog.image}
                              autoPlay
                              loop
                              muted
                              playsInline
                              key={coverBlog.image}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <img
                              src={coverBlog.image || '/architectural/dubai_villa.jpg'}
                              alt={coverBlog.title}
                              className="h-full w-full object-cover"
                            />
                          )}
                          <span className="absolute top-3.5 left-3.5 rounded-full bg-[#e3943f] px-3.5 py-1 text-[9.5px] font-bold tracking-[0.14em] text-black uppercase shadow-lg">
                            {coverBlog.tag || 'COVER STORY'}
                          </span>
                          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md text-[9px] font-mono bg-black/85 text-white/90 border border-white/10 uppercase">
                            {isVideo ? '🎬 Motion Loop' : '🖼️ Still Visual'}
                          </div>
                        </div>

                        {/* Story Details & Action Controls */}
                        <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-4">
                          <div>
                            <div className="flex items-center gap-2.5 text-[11px] font-bold tracking-wider text-white/50 uppercase">
                              <span className="text-[#e3943f]">{coverBlog.category}</span>
                              <span>•</span>
                              <span>{coverBlog.date}</span>
                              <span>•</span>
                              <span>{coverBlog.readTime || '6 min read'}</span>
                            </div>

                            <h3 className="mt-2 text-[19px] sm:text-[23px] font-normal leading-snug text-white">
                              {coverBlog.title}
                            </h3>

                            <p className="mt-2 text-[12.5px] text-white/70 leading-relaxed line-clamp-3">
                              {coverBlog.excerpt}
                            </p>

                            <div className="mt-2 text-[11px] text-white/40 font-mono">
                              By {coverBlog.author || 'Unique Graphics Architectural Board'}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              onClick={() => openEditBlogModal(coverBlog)}
                              className="rounded-xl bg-gradient-to-r from-[#e3943f] via-[#ec9f46] to-[#d68532] px-5 py-2.5 text-[11.5px] font-bold tracking-wider text-black uppercase hover:brightness-105 shadow-md shadow-[#e3943f]/25 transition-all cursor-pointer flex items-center gap-2"
                            >
                              <svg className="h-3.5 w-3.5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                              <span>Edit Cover Banner (Media, Text & Headings)</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => navigateTo('/blog')}
                              className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-[11px] font-bold tracking-wider text-white/80 uppercase hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <span>View Live on /blog</span>
                              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })()}

                {/* Filter and Search Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    {['All', 'Architecture', 'Interior Design', 'Commercial', 'Drafts'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setBlogFilter(cat)}
                        className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer ${blogFilter === cat
                          ? 'bg-[#e3943f] text-black shadow-md shadow-[#e3943f]/20 font-extrabold'
                          : 'border border-white/10 bg-white/[0.02] text-white/60 hover:text-white hover:border-white/20'
                          }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full md:w-80">
                    <input
                      type="text"
                      placeholder="Search essays by title, tag, author..."
                      value={blogSearch}
                      onChange={(e) => setBlogSearch(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#161616] pl-9 pr-4 py-2 text-[12.5px] text-white placeholder-white/30 outline-none focus:border-[#e3943f]"
                    />
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                </div>

                {/* Editorial Essays Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {blogs
                    .filter((blog) => {
                      const matchesCategory =
                        blogFilter === 'All'
                          ? true
                          : blogFilter === 'Drafts'
                            ? blog.published === false
                            : blog.category?.toLowerCase() === blogFilter.toLowerCase()

                      const matchesSearch =
                        !blogSearch ||
                        blog.title?.toLowerCase().includes(blogSearch.toLowerCase()) ||
                        blog.excerpt?.toLowerCase().includes(blogSearch.toLowerCase()) ||
                        blog.author?.toLowerCase().includes(blogSearch.toLowerCase()) ||
                        blog.tag?.toLowerCase().includes(blogSearch.toLowerCase())

                      return matchesCategory && matchesSearch
                    })
                    .map((blog) => {
                      const isLive = blog.published !== false

                      return (
                        <div
                          key={blog._id || blog.slug || blog.id}
                          className="rounded-2xl border border-white/10 bg-[#141414] overflow-hidden flex flex-col justify-between group hover:border-[#e3943f]/40 transition-all duration-300"
                        >
                          <div>
                            {/* Card Image Thumbnail */}
                            <div className="relative h-44 overflow-hidden bg-black/50">
                              <img
                                src={blog.image || '/architectural/dubai_villa.jpg'}
                                alt={blog.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                              {/* Badges on Image */}
                              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="rounded-full bg-black/70 backdrop-blur-md px-2.5 py-0.5 text-[9.5px] font-bold tracking-wider text-[#e3943f] uppercase border border-white/10">
                                    {blog.category}
                                  </span>
                                  {blog.featured && (
                                    <span className="rounded-full bg-[#e3943f] text-black px-2 py-0.5 text-[8.5px] font-black uppercase tracking-wider shadow-md">
                                      ★ COVER BANNER
                                    </span>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleTogglePublish(blog)}
                                  className={`rounded-full px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider backdrop-blur-md border cursor-pointer transition-all ${isLive
                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
                                    : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/30'
                                    }`}
                                  title="Click to toggle publish status"
                                >
                                  {isLive ? '● Live on Site' : '○ Draft'}
                                </button>
                              </div>

                              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10.5px] text-white/50 font-mono">
                                <span>{blog.date}</span>
                                <span>{blog.readTime || '5 min read'}</span>
                              </div>
                            </div>

                            {/* Card Text Content */}
                            <div className="p-5">
                              <span className="text-[10px] font-bold text-[#e3943f] uppercase tracking-wider block mb-1">
                                {blog.tag || 'Editorial'}
                              </span>
                              <h4 className="text-[15px] font-medium leading-snug text-white line-clamp-2 group-hover:text-[#e3943f] transition-colors">
                                {blog.title}
                              </h4>
                              <p className="mt-2 text-[12px] text-white/55 leading-relaxed line-clamp-2">
                                {blog.excerpt}
                              </p>
                              <div className="mt-3 text-[11px] text-white/40 truncate">
                                By {blog.author}
                              </div>
                            </div>
                          </div>

                          {/* Card Action Controls Footer */}
                          <div className="p-4 pt-3 border-t border-white/[0.08] bg-black/20 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => openEditBlogModal(blog)}
                              className="flex-1 rounded-xl bg-white/[0.05] border border-white/10 py-2 text-[11px] font-bold text-white uppercase hover:bg-[#e3943f] hover:text-black hover:border-[#e3943f] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSetFeaturedCover(blog)}
                              className={`px-3 py-2 rounded-xl border text-[10.5px] font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${blog.featured
                                ? 'bg-[#e3943f]/20 border-[#e3943f] text-[#e3943f]'
                                : 'bg-white/[0.04] border-white/10 text-white/60 hover:text-[#e3943f] hover:border-[#e3943f]/50'
                                }`}
                              title={blog.featured ? 'Currently the primary cover banner on website' : 'Promote this essay to main top cover story banner'}
                            >
                              <span>{blog.featured ? '★ Cover' : '☆ Make Cover'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteBlog(blog)}
                              className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/25 hover:text-red-300 transition-colors cursor-pointer"
                              title="Delete essay from database"
                            >
                              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}

            {/* VIEW: ADMIN ACCOUNT, CREDENTIALS & PASSWORD SECURITY SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-8 animate-fade-in">
                {/* Header Banner with Luxury Gold Ambient Glow */}
                <div className="relative rounded-3xl border border-[#e3943f]/25 bg-gradient-to-br from-[#1a1612] via-[#121212] to-[#0a0a0a] p-6 sm:p-8 overflow-hidden shadow-2xl backdrop-blur-2xl">
                  <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#e3943f]/15 blur-3xl animate-pulse" />
                  <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e3943f]/10 border border-[#e3943f]/30">
                        <span className="h-2 w-2 rounded-full bg-[#e3943f] animate-ping" />
                        <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#e3943f] uppercase">
                          UNIQUE GRAPHICS • SECURITY VAULT & PROTOCOLS
                        </span>
                      </div>
                      <h2 className="text-[24px] sm:text-[28px] font-extralight tracking-wide text-white">
                        Executive Profile & <span className="font-semibold text-gradient bg-gradient-to-r from-white via-amber-100 to-[#e3943f] bg-clip-text text-transparent">Password Security</span>
                      </h2>
                      <p className="text-[13px] text-white/50 max-w-2xl leading-relaxed">
                        Manage your administrator identity, update sign-in email, and set a new password. All credentials are protected with 10-round salted Bcrypt encryption.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Messages */}
                {settingsSuccessMsg && (
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[13px] animate-fade-in shadow-lg max-w-4xl mx-auto">
                    <svg className="w-5 h-5 shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span className="font-medium">{settingsSuccessMsg}</span>
                  </div>
                )}

                {settingsError && (
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-[13px] animate-fade-in shadow-lg max-w-4xl mx-auto">
                    <svg className="w-5 h-5 shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span className="font-medium">{settingsError}</span>
                  </div>
                )}

                {/* Main Settings Form */}
                <div className="max-w-4xl mx-auto">
                  <form onSubmit={handleSaveSettings} className="space-y-6">
                    {/* Card 1: Executive Identity Profile */}
                    <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 sm:p-6 space-y-5 shadow-xl">
                      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                        <div className="flex items-center gap-2.5">
                          <span className="h-2 w-2 rounded-full bg-[#e3943f]" />
                          <h3 className="text-[13px] font-mono font-bold tracking-widest text-[#e3943f] uppercase">
                            1. EXECUTIVE PROFILE DETAILS
                          </h3>
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#e3943f]/10 text-[#e3943f] border border-[#e3943f]/30">
                          {adminUser?.role || 'Superadmin'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold tracking-wider text-white/70 uppercase mb-2">
                            Administrator Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={settingsName}
                            onChange={(e) => setSettingsName(e.target.value)}
                            placeholder="e.g. Executive Studio Lead"
                            className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-[13px] text-white placeholder-white/30 outline-none focus:border-[#e3943f] transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold tracking-wider text-white/70 uppercase mb-2">
                            Sign-In Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={settingsEmail}
                            onChange={(e) => setSettingsEmail(e.target.value)}
                            placeholder="admin@uniquegraphics.com"
                            className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-[13px] text-white placeholder-white/30 outline-none focus:border-[#e3943f] transition-all font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Password Management */}
                    <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 sm:p-6 space-y-5 shadow-xl">
                      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                        <div className="flex items-center gap-2.5">
                          <span className="h-2 w-2 rounded-full bg-[#e3943f]" />
                          <h3 className="text-[13px] font-mono font-bold tracking-widest text-[#e3943f] uppercase">
                            2. CHANGE ADMIN PASSWORD
                          </h3>
                        </div>
                        <span className="text-[10px] text-white/40">
                          Leave blank if keeping current password
                        </span>
                      </div>

                      {/* Current Password Field */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-[11px] font-bold tracking-wider text-white/70 uppercase">
                            Current Password
                          </label>
                          <span className="text-[10px] text-white/40">
                            Required only when changing password
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            type={showSettingsCurrentPass ? 'text' : 'password'}
                            value={settingsCurrentPassword}
                            onChange={(e) => setSettingsCurrentPassword(e.target.value)}
                            placeholder="Enter your existing password (default: admin2026)"
                            className="w-full rounded-xl border border-white/10 bg-black/60 pl-4 pr-11 py-2.5 text-[13px] text-white placeholder-white/30 outline-none focus:border-[#e3943f] transition-all font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSettingsCurrentPass(!showSettingsCurrentPass)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                            title={showSettingsCurrentPass ? 'Hide password' : 'Show password'}
                          >
                            {showSettingsCurrentPass ? (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* New Password & Confirm Password Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/[0.06]">
                        <div>
                          <label className="block text-[11px] font-bold tracking-wider text-white/70 uppercase mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showSettingsNewPass ? 'text' : 'password'}
                              value={settingsNewPassword}
                              onChange={(e) => setSettingsNewPassword(e.target.value)}
                              placeholder="Minimum 6 characters"
                              className="w-full rounded-xl border border-white/10 bg-black/60 pl-4 pr-11 py-2.5 text-[13px] text-white placeholder-white/30 outline-none focus:border-[#e3943f] transition-all font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => setShowSettingsNewPass(!showSettingsNewPass)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                              title={showSettingsNewPass ? 'Hide password' : 'Show password'}
                            >
                              {showSettingsNewPass ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold tracking-wider text-white/70 uppercase mb-2">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showSettingsConfirmPass ? 'text' : 'password'}
                              value={settingsConfirmPassword}
                              onChange={(e) => setSettingsConfirmPassword(e.target.value)}
                              placeholder="Re-enter new password"
                              className={`w-full rounded-xl border bg-black/60 pl-4 pr-11 py-2.5 text-[13px] text-white placeholder-white/30 outline-none transition-all font-mono ${settingsNewPassword && settingsConfirmPassword
                                ? settingsNewPassword === settingsConfirmPassword
                                  ? 'border-emerald-500/60 focus:border-emerald-400'
                                  : 'border-red-500/60 focus:border-red-400'
                                : 'border-white/10 focus:border-[#e3943f]'
                                }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowSettingsConfirmPass(!showSettingsConfirmPass)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                              title={showSettingsConfirmPass ? 'Hide password' : 'Show password'}
                            >
                              {showSettingsConfirmPass ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Password Requirements Checklist */}
                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-wrap items-center gap-4 text-[11px] text-white/50">
                        <span className="flex items-center gap-1.5">
                          <span className={settingsNewPassword.length >= 6 ? 'text-emerald-400 font-bold' : 'text-white/30'}>
                            {settingsNewPassword.length >= 6 ? '✓' : '•'}
                          </span>
                          Minimum 6 characters
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className={settingsNewPassword && settingsNewPassword === settingsConfirmPassword ? 'text-emerald-400 font-bold' : 'text-white/30'}>
                            {settingsNewPassword && settingsNewPassword === settingsConfirmPassword ? '✓' : '•'}
                          </span>
                          Passwords match
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="text-[#e3943f] font-bold">✦</span>
                          Encrypted with 10-round bcrypt hash
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={settingsSaving}
                        className="rounded-xl bg-gradient-to-r from-[#e3943f] to-[#d68532] px-6 py-3 text-[12px] font-bold tracking-[0.14em] text-black uppercase hover:brightness-105 transition-all shadow-md shadow-[#e3943f]/25 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                      >
                        {settingsSaving ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-black" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            <span>Updating Security Settings...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                              <polyline points="17 21 17 13 7 13 7 21" />
                              <polyline points="7 3 7 8 15 8" />
                            </svg>
                            <span>Update Password & Save Profile</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSettingsCurrentPassword('')
                          setSettingsNewPassword('')
                          setSettingsConfirmPassword('')
                          setSettingsError('')
                          setSettingsSuccessMsg('')
                        }}
                        className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[12px] font-bold uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        </main>

        {/* INQUIRY DETAIL MODAL DOSSIER */}
        {selectedInquiry && (
          <div
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
            onClick={() => setSelectedInquiry(null)}
          >
            <div
              className="relative w-full max-w-[620px] max-h-[92vh] overflow-y-auto rounded-2xl border border-white/15 bg-[#141414] p-6 text-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#e3943f] uppercase tracking-wider">
                      CLIENT DOSSIER #{selectedInquiry.id}
                    </span>
                    <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[9.5px] font-mono text-white/60 uppercase">
                      {selectedInquiry.source || 'Contact Us Page'}
                    </span>
                  </div>
                  <h3 className="text-[20px] font-semibold text-white mt-1">{selectedInquiry.client}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Direct Communications Banner */}
              <div className="mt-5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10.5px] text-white/40 uppercase tracking-wider block font-bold">Direct Channels</span>
                  <div className="flex flex-wrap items-center gap-3 text-[13px]">
                    {selectedInquiry.phone ? (
                      <span className="font-mono text-white font-medium flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
                        </svg>
                        {selectedInquiry.phone}
                      </span>
                    ) : (
                      <span className="text-white/40 italic">No phone provided</span>
                    )}

                    {selectedInquiry.email && (
                      <a
                        href={`mailto:${selectedInquiry.email}`}
                        className="text-white/70 hover:text-[#e3943f] underline text-xs transition-colors flex items-center gap-1"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                        {selectedInquiry.email}
                      </a>
                    )}
                  </div>
                </div>

                {selectedInquiry.phone && (
                  <a
                    href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedInquiry.client)},%20this%20is%20Unique%20Graphics%20Architectural%20Studio%20regarding%20your%20project%20inquiry.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-2 text-[11.5px] font-bold text-emerald-400 hover:bg-emerald-500/25 transition-all cursor-pointer"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z" />
                    </svg>
                    <span>Open WhatsApp</span>
                  </a>
                )}
              </div>

              {/* Inquiry Meta Grid */}
              <div className="mt-5 space-y-4 text-[13px]">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-black/40 border border-white/5">
                  <div>
                    <span className="text-white/40 text-[10.5px] uppercase block font-bold">Country / Hub</span>
                    <span className="font-semibold text-white mt-0.5 block">{selectedInquiry.location}</span>
                  </div>
                  <div>
                    <span className="text-white/40 text-[10.5px] uppercase block font-bold">Project Typology</span>
                    <span className="font-semibold text-white mt-0.5 block">{selectedInquiry.type}</span>
                  </div>
                  <div>
                    <span className="text-white/40 text-[10.5px] uppercase block font-bold">Estimated Budget</span>
                    <span className="font-mono text-[#e3943f] font-bold mt-0.5 block">{selectedInquiry.budget}</span>
                  </div>
                  <div>
                    <span className="text-white/40 text-[10.5px] uppercase block font-bold">Date Received</span>
                    <span className="text-white/70 mt-0.5 block">{selectedInquiry.date}</span>
                  </div>
                </div>

                {/* Actual Message from Contact Us */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-white/50 text-[11px] font-bold uppercase tracking-wider">
                      Client Brief / Project Inquiry Note:
                    </span>
                    <span className="text-white/30 text-[10px]">Submitted via /contacts form</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/60 p-4 text-white/90 leading-relaxed text-[13.5px] whitespace-pre-wrap">
                    {selectedInquiry.message || 'Direct architectural consultation request submitted via website.'}
                  </div>
                </div>

                {/* Status Selector */}
                <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-white/50 text-xs">Pipeline Status:</span>
                    <select
                      value={selectedInquiry.status}
                      onChange={(e) => {
                        const newSt = e.target.value
                        handleStatusChange(selectedInquiry.id, newSt)
                        setSelectedInquiry({ ...selectedInquiry, status: newSt })
                      }}
                      className="rounded-lg border border-white/15 bg-[#1a1a1a] px-3 py-1 text-xs text-white outline-none cursor-pointer focus:border-[#e3943f]"
                    >
                      <option value="New Inquiry">New Inquiry</option>
                      <option value="In Review">In Review</option>
                      <option value="Offer Sent">Offer Sent</option>
                      <option value="Contract Signed">Contract Signed</option>
                    </select>
                  </div>

                  <span className={`rounded-full border px-3 py-0.5 text-[10.5px] font-bold uppercase ${selectedInquiry.statusColor}`}>
                    {selectedInquiry.status}
                  </span>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => handleDeleteInquiry(selectedInquiry)}
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                >
                  Delete Entry
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleStatusChange(selectedInquiry.id, 'Offer Sent')
                      setSelectedInquiry(null)
                    }}
                    className="rounded-xl bg-[#e3943f] px-4 py-2.5 text-[11.5px] font-bold uppercase tracking-wider text-black hover:bg-[#d68532] transition-colors cursor-pointer"
                  >
                    Mark Offer Sent
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedInquiry(null)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[11.5px] font-semibold text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LOG NEW CLIENT CONTACT ENTRY MODAL */}
        {newInquiryModalOpen && (
          <div
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
            onClick={() => setNewInquiryModalOpen(false)}
          >
            <div
              className="relative w-full max-w-[600px] max-h-[92vh] overflow-y-auto rounded-2xl border border-white/15 bg-[#141414] p-6 text-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#e3943f]" />
                  <h3 className="text-[14px] font-bold tracking-[0.16em] text-white uppercase">
                    Log Client Contact Entry
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setNewInquiryModalOpen(false)}
                  className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateInquiry} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold tracking-wider text-white/50 uppercase mb-1.5">
                      Client Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elena Rostova"
                      value={inquiryFormData.client}
                      onChange={(e) => setInquiryFormData({ ...inquiryFormData, client: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#191919] px-3.5 py-2.5 text-[13px] text-white outline-none focus:border-[#e3943f]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold tracking-wider text-white/50 uppercase mb-1.5">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. +971 50 123 4567"
                      value={inquiryFormData.phone}
                      onChange={(e) => setInquiryFormData({ ...inquiryFormData, phone: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#191919] px-3.5 py-2.5 text-[13px] text-white outline-none focus:border-[#e3943f]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold tracking-wider text-white/50 uppercase mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. client@holdings.com"
                      value={inquiryFormData.email}
                      onChange={(e) => setInquiryFormData({ ...inquiryFormData, email: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#191919] px-3.5 py-2.5 text-[13px] text-white outline-none focus:border-[#e3943f]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold tracking-wider text-white/50 uppercase mb-1.5">
                      Location / Hub / Country
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dubai, UAE"
                      value={inquiryFormData.location}
                      onChange={(e) => setInquiryFormData({ ...inquiryFormData, location: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#191919] px-3.5 py-2.5 text-[13px] text-white outline-none focus:border-[#e3943f]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold tracking-wider text-white/50 uppercase mb-1.5">
                      Project Typology
                    </label>
                    <select
                      value={inquiryFormData.projectType}
                      onChange={(e) => setInquiryFormData({ ...inquiryFormData, projectType: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#191919] px-3.5 py-2.5 text-[13px] text-white outline-none focus:border-[#e3943f] cursor-pointer"
                    >
                      <option value="Luxury Residential Villa">Luxury Residential Villa</option>
                      <option value="Commercial Complex & Atrium">Commercial Complex & Atrium</option>
                      <option value="Penthouse & Private Residence">Penthouse & Private Residence</option>
                      <option value="Hospitality & Boutique Resort">Hospitality & Boutique Resort</option>
                      <option value="Bespoke Italian Interior & Joinery">Bespoke Italian Interior & Joinery</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold tracking-wider text-white/50 uppercase mb-1.5">
                      Estimated Budget Tier
                    </label>
                    <select
                      value={inquiryFormData.budget}
                      onChange={(e) => setInquiryFormData({ ...inquiryFormData, budget: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#191919] px-3.5 py-2.5 text-[13px] text-white outline-none focus:border-[#e3943f] cursor-pointer"
                    >
                      <option value="$1,000,000 - $3,000,000">$1,000,000 - $3,000,000</option>
                      <option value="$3,000,000 - $6,000,000">$3,000,000 - $6,000,000</option>
                      <option value="$6,000,000 - $15,000,000">$6,000,000 - $15,000,000</option>
                      <option value="$15,000,000+">$15,000,000+</option>
                      <option value="Consultation Requested">Consultation Requested</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-white/50 uppercase mb-1.5">
                    Lead Channel / Source
                  </label>
                  <select
                    value={inquiryFormData.source}
                    onChange={(e) => setInquiryFormData({ ...inquiryFormData, source: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#191919] px-3.5 py-2.5 text-[13px] text-white outline-none focus:border-[#e3943f] cursor-pointer"
                  >
                    <option value="Contact Us Page (/contacts)">Contact Us Page (/contacts)</option>
                    <option value="Direct Studio Walk-In">Direct Studio Walk-In</option>
                    <option value="Direct Phone Call">Direct Phone Call</option>
                    <option value="Partner Architect Referral">Partner Architect Referral</option>
                    <option value="VIP Private Client Network">VIP Private Client Network</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-white/50 uppercase mb-1.5">
                    Project Brief / Client Request Note
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter project details, site specifications, or client notes..."
                    value={inquiryFormData.message}
                    onChange={(e) => setInquiryFormData({ ...inquiryFormData, message: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#191919] p-3 text-[13px] text-white placeholder-white/30 outline-none focus:border-[#e3943f] resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setNewInquiryModalOpen(false)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[11.5px] font-semibold text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inquirySaving}
                    className="rounded-xl bg-gradient-to-r from-[#e3943f] to-[#d68532] px-5 py-2.5 text-[11.5px] font-bold tracking-wider text-black uppercase hover:brightness-105 transition-all shadow-md shadow-[#e3943f]/25 disabled:opacity-50 cursor-pointer"
                  >
                    {inquirySaving ? 'Recording Entry...' : 'Save & Record Entry'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* EDITORIAL ESSAY COMPOSER & EDIT MODAL */}
        {blogModalOpen && (
          <div
            className="fixed inset-0 z-[160] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6"
            onClick={() => setBlogModalOpen(false)}
          >
            <div
              className="relative w-full max-w-[800px] max-h-[92vh] flex flex-col rounded-2xl border border-white/15 bg-[#141414] text-white shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Navigation */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#181818]">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#e3943f]" />
                  <span className="text-[11px] font-bold tracking-[0.2em] text-[#e3943f] uppercase">
                    {editingBlog ? 'UPDATE MONOGRAPH' : 'NEW EDITORIAL ESSAY'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setBlogModalOpen(false)}
                  className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Scrollable Form */}
              <form onSubmit={handleSaveBlog} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5 custom-scrollbar">
                {/* 1. Article Title */}
                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-white/70 uppercase mb-1.5">
                    Essay Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Spatial Poetry of Monumental Villas..."
                    value={blogFormData.title}
                    onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-4 py-3 text-[14px] text-white placeholder-white/30 outline-none focus:border-[#e3943f] transition-colors"
                  />
                </div>

                {/* 2. Category & Tag Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold tracking-wider text-white/70 uppercase mb-1.5">
                      Category *
                    </label>
                    <select
                      value={blogFormData.category}
                      onChange={(e) => setBlogFormData({ ...blogFormData, category: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-4 py-3 text-[13px] text-white outline-none focus:border-[#e3943f] transition-colors cursor-pointer"
                    >
                      <option value="Architecture">Architecture</option>
                      <option value="Interior Design">Interior Design</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Residential">Residential</option>
                      <option value="Philosophy">Philosophy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold tracking-wider text-white/70 uppercase mb-1.5">
                      Editorial Tag
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Cover Story, Haute Interiors, Alpine Luxury"
                      value={blogFormData.tag}
                      onChange={(e) => setBlogFormData({ ...blogFormData, tag: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-4 py-3 text-[13px] text-white placeholder-white/30 outline-none focus:border-[#e3943f] transition-colors"
                    />
                  </div>
                </div>

                {/* 3. Author & Read Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold tracking-wider text-white/70 uppercase mb-1.5">
                      Author / Studio Lead
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Elena Rostova, Principal Interior Lead"
                      value={blogFormData.author}
                      onChange={(e) => setBlogFormData({ ...blogFormData, author: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-4 py-3 text-[13px] text-white placeholder-white/30 outline-none focus:border-[#e3943f] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold tracking-wider text-white/70 uppercase mb-1.5">
                      Estimated Read Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 5 min read"
                      value={blogFormData.readTime}
                      onChange={(e) => setBlogFormData({ ...blogFormData, readTime: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-4 py-3 text-[13px] text-white placeholder-white/30 outline-none focus:border-[#e3943f] transition-colors"
                    />
                  </div>
                </div>

                {/* 4. Cover Image / Video Asset with Device Upload */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold tracking-wider text-white/70 uppercase">
                      Cover Visual Asset (Photo or Video Loop)
                    </label>
                    <span className="text-[10px] font-mono text-white/40">
                      Supports .jpg, .png, .mp4, device upload
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Enter photo/video URL or upload below..."
                      value={blogFormData.image}
                      onChange={(e) => setBlogFormData({ ...blogFormData, image: e.target.value })}
                      className="flex-1 rounded-xl border border-white/10 bg-[#1c1c1c] px-4 py-2.5 text-[12.5px] text-white placeholder-white/30 outline-none focus:border-[#e3943f] transition-colors font-mono"
                    />

                    <label className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/15 bg-white/[0.04] text-[11px] font-bold uppercase tracking-wider text-white/80 hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer shrink-0">
                      <svg className="h-3.5 w-3.5 text-[#e3943f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span>Browse Device</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleBlogImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Live Media Preview Box */}
                  {blogFormData.image && (
                    <div className="relative mt-2.5 h-36 rounded-xl overflow-hidden border border-white/15 bg-black/60">
                      {blogFormData.image.endsWith('.mp4') || blogFormData.image.includes('/video/') || blogFormData.image.startsWith('data:video') ? (
                        <video
                          src={blogFormData.image}
                          autoPlay
                          loop
                          muted
                          playsInline
                          key={blogFormData.image}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <img
                          src={blogFormData.image}
                          alt="Cover Asset Preview"
                          className="h-full w-full object-cover"
                        />
                      )}
                      <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded text-[9.5px] font-bold uppercase tracking-wider bg-black/80 text-[#e3943f] border border-white/10">
                        {blogFormData.image.endsWith('.mp4') || blogFormData.image.includes('/video/') || blogFormData.image.startsWith('data:video') ? '🎬 Motion Loop Preview' : '🖼️ Image Asset Preview'}
                      </span>
                    </div>
                  )}

                  {/* Preset Quick Selectors */}
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mt-3 mb-1.5">
                    Quick Studio Presets (Click to Assign):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {/* Video loop quick presets */}
                    <button
                      type="button"
                      onClick={() => setBlogFormData({ ...blogFormData, image: '/video/1.mp4' })}
                      className={`group rounded-xl border p-1.5 text-left transition-all cursor-pointer flex items-center gap-2 ${blogFormData.image === '/video/1.mp4' ? 'border-[#e3943f] bg-[#e3943f]/10 shadow-sm' : 'border-white/10 bg-white/[0.02] hover:border-white/25'}`}
                    >
                      <div className="h-9 w-9 rounded-lg bg-black/70 flex items-center justify-center text-[#e3943f] shrink-0 font-bold text-[10px]">🎬 1</div>
                      <span className="text-[10px] text-white/80 truncate group-hover:text-white">Living Video Loop</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBlogFormData({ ...blogFormData, image: '/video/2.mp4' })}
                      className={`group rounded-xl border p-1.5 text-left transition-all cursor-pointer flex items-center gap-2 ${blogFormData.image === '/video/2.mp4' ? 'border-[#e3943f] bg-[#e3943f]/10 shadow-sm' : 'border-white/10 bg-white/[0.02] hover:border-white/25'}`}
                    >
                      <div className="h-9 w-9 rounded-lg bg-black/70 flex items-center justify-center text-[#e3943f] shrink-0 font-bold text-[10px]">🎬 2</div>
                      <span className="text-[10px] text-white/80 truncate group-hover:text-white">Facade Video Loop</span>
                    </button>

                    {LUXURY_IMAGE_PRESETS.slice(0, 6).map((p) => (
                      <button
                        key={p.url}
                        type="button"
                        onClick={() => setBlogFormData({ ...blogFormData, image: p.url })}
                        className={`group rounded-xl border p-1.5 text-left transition-all cursor-pointer flex items-center gap-2 ${blogFormData.image === p.url
                          ? 'border-[#e3943f] bg-[#e3943f]/10 shadow-sm'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/25'
                          }`}
                      >
                        <img
                          src={p.url}
                          alt={p.label}
                          className="h-9 w-9 rounded-lg object-cover shrink-0"
                        />
                        <span className="text-[10.5px] text-white/80 truncate group-hover:text-white">
                          {p.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Executive Excerpt */}
                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-white/70 uppercase mb-1.5">
                    Lead Excerpt / Synopsis * (Shown on cards & preview)
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Provide a compelling 1-2 sentence overview of the design philosophy..."
                    value={blogFormData.excerpt}
                    onChange={(e) => setBlogFormData({ ...blogFormData, excerpt: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] p-3.5 text-[13px] text-white placeholder-white/30 outline-none focus:border-[#e3943f] transition-colors resize-none"
                  />
                </div>

                {/* 6. Body Paragraphs */}
                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-white/70 uppercase mb-1.5">
                    Article Discourse & Monograph Body
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Write detailed design narrative. Separate paragraphs with double enter (Enter twice)..."
                    value={blogFormData.content}
                    onChange={(e) => setBlogFormData({ ...blogFormData, content: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] p-3.5 text-[13px] text-white placeholder-white/30 outline-none focus:border-[#e3943f] transition-colors leading-relaxed"
                  />
                </div>

                {/* 7. Publishing & Featured Checkboxes */}
                <div className="flex flex-wrap items-center gap-6 pt-2 pb-1 border-t border-white/[0.08]">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={blogFormData.published}
                      onChange={(e) => setBlogFormData({ ...blogFormData, published: e.target.checked })}
                      className="h-4 w-4 rounded border-white/20 bg-white/5 accent-[#e3943f] cursor-pointer"
                    />
                    <span className="text-[12.5px] font-medium text-white">
                      Publish immediately to public website
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={blogFormData.featured}
                      onChange={(e) => setBlogFormData({ ...blogFormData, featured: e.target.checked })}
                      className="h-4 w-4 rounded border-white/20 bg-white/5 accent-[#e3943f] cursor-pointer"
                    />
                    <span className="text-[12.5px] font-medium text-white">
                      Mark as Featured Monograph
                    </span>
                  </label>
                </div>

                {/* Modal Footer Controls */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setBlogModalOpen(false)}
                    className="rounded-xl border border-white/15 bg-white/[0.04] px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                  >
                    Discard
                  </button>

                  <button
                    type="submit"
                    disabled={blogSaving}
                    className="rounded-xl bg-gradient-to-r from-[#e3943f] to-[#d68532] px-6 py-2.5 text-[12px] font-bold uppercase tracking-wider text-black hover:brightness-105 shadow-md shadow-[#e3943f]/25 transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2"
                  >
                    {blogSaving ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-black" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingBlog ? 'Update Monograph' : 'Publish to Journal'}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ADD / EDIT COMPLETED PROJECT MODAL */}
        {projectModalOpen && (
          <div
            className="fixed inset-0 z-[160] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6"
            onClick={() => setProjectModalOpen(false)}
          >
            <div
              className="relative w-full max-w-[680px] max-h-[90vh] flex flex-col rounded-2xl border border-white/15 bg-[#141414] text-white shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#181818]">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#e3943f]" />
                  <span className="text-[11px] font-bold tracking-[0.2em] text-[#e3943f] uppercase">
                    {editingProject ? 'EDIT ARCHITECTURAL COMMISSION' : 'ADD NEW COMPLETED PROJECT'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSaveProjectModal} className="p-6 overflow-y-auto space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">
                      Project Title (English):
                    </label>
                    <input
                      type="text"
                      required
                      value={projectFormData.titleEn}
                      onChange={(e) => setProjectFormData({ ...projectFormData, titleEn: e.target.value })}
                      placeholder="e.g. Day living room"
                      className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[13px] text-white outline-none focus:border-[#e3943f]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">
                      Project Title (Russian):
                    </label>
                    <input
                      type="text"
                      value={projectFormData.titleRu}
                      onChange={(e) => setProjectFormData({ ...projectFormData, titleRu: e.target.value })}
                      placeholder="e.g. Дневная гостиная"
                      className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[13px] text-white outline-none focus:border-[#e3943f]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">
                      Category:
                    </label>
                    <select
                      value={projectFormData.cat}
                      onChange={(e) => setProjectFormData({ ...projectFormData, cat: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[13px] text-white outline-none focus:border-[#e3943f]"
                    >
                      {(completedProjectsConfig.categories?.[completedLang] || DEFAULT_COMPLETED_PROJECTS_CONFIG.categories[completedLang])
                        .filter(([cId]) => cId !== 'all')
                        .map(([cId, cName]) => (
                          <option key={cId} value={cId}>
                            {cName} ({cId})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">
                      Video Clip Source (URL or Upload):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={projectFormData.video}
                        onChange={(e) => setProjectFormData({ ...projectFormData, video: e.target.value })}
                        placeholder="e.g. /video/1.mp4 or video link"
                        className="flex-1 rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12px] text-white outline-none focus:border-[#e3943f]"
                      />
                      <label className="rounded-xl border border-white/15 bg-white/[0.05] px-3 py-2.5 text-[11px] font-bold text-white/80 uppercase hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1 shrink-0">
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleProjectVideoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Summary (English & Russian) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">
                      Summary / Lead Text (English):
                    </label>
                    <textarea
                      rows="2"
                      value={projectFormData.summaryEn}
                      onChange={(e) => setProjectFormData({ ...projectFormData, summaryEn: e.target.value })}
                      placeholder="e.g. A living room arranged for daylight, with seating that faces the room..."
                      className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2 text-[12.5px] text-white outline-none focus:border-[#e3943f] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">
                      Summary / Lead Text (Russian):
                    </label>
                    <textarea
                      rows="2"
                      value={projectFormData.summaryRu}
                      onChange={(e) => setProjectFormData({ ...projectFormData, summaryRu: e.target.value })}
                      placeholder="e.g. Гостиная под дневной свет: посадка смотрит в комнату..."
                      className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2 text-[12.5px] text-white outline-none focus:border-[#e3943f] resize-none"
                    />
                  </div>
                </div>

                {/* Detail Description / Narrative (The sofa sits off the glass...) */}
                <div className="rounded-xl border border-[#e3943f]/30 bg-[#171717] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-[#e3943f] uppercase tracking-wider">
                      ✦ Design Narrative & Detailed Description (Project Page Paragraph)
                    </label>
                    <span className="text-[10px] text-white/40 uppercase font-mono">
                      detail text
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                        Narrative (English):
                      </label>
                      <textarea
                        rows="3"
                        value={projectFormData.detailEn}
                        onChange={(e) => setProjectFormData({ ...projectFormData, detailEn: e.target.value })}
                        placeholder="e.g. The sofa sits off the glass so the walk past the window stays clear. Light comes from the side, with one lamp for the evening. Storage is kept low so the wall stays open."
                        className="w-full rounded-xl border border-white/10 bg-[#121212] p-3 text-[12.5px] text-white outline-none focus:border-[#e3943f] resize-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                        Narrative (Russian):
                      </label>
                      <textarea
                        rows="3"
                        value={projectFormData.detailRu}
                        onChange={(e) => setProjectFormData({ ...projectFormData, detailRu: e.target.value })}
                        placeholder="e.g. Диван стоит не у стекла, проход у окна свободен. Свет сбоку и одна лампа на вечер. Хранение низкое, стена остаётся открытой."
                        className="w-full rounded-xl border border-white/10 bg-[#121212] p-3 text-[12.5px] text-white outline-none focus:border-[#e3943f] resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                {/* Scope of Work (English & Russian) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">
                      Scope of Work (English - comma separated):
                    </label>
                    <input
                      type="text"
                      value={projectFormData.scopeEn}
                      onChange={(e) => setProjectFormData({ ...projectFormData, scopeEn: e.target.value })}
                      placeholder="e.g. Furniture layout, Daylight and lamps, Sofa and chairs, Wall and floor finish"
                      className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">
                      Scope of Work (Russian - comma separated):
                    </label>
                    <input
                      type="text"
                      value={projectFormData.scopeRu}
                      onChange={(e) => setProjectFormData({ ...projectFormData, scopeRu: e.target.value })}
                      placeholder="e.g. Расстановка, Дневной свет и лампы, Диван и кресла, Стены и пол"
                      className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setProjectModalOpen(false)}
                    className="rounded-xl border border-white/15 bg-white/[0.04] px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-[#e3943f] to-[#d68532] px-6 py-2.5 text-[12px] font-bold uppercase tracking-wider text-black hover:brightness-105 shadow-md shadow-[#e3943f]/25 transition-all cursor-pointer"
                  >
                    {editingProject ? 'Save Project' : 'Add Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* BLOG PAGE HERO BANNER & TYPOGRAPHY SETTINGS MODAL */}
        {bannerModalOpen && (
          <div
            className="fixed inset-0 z-[160] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6"
            onClick={() => setBannerModalOpen(false)}
          >
            <div
              className="relative w-full max-w-[760px] max-h-[90vh] flex flex-col rounded-2xl border border-white/15 bg-[#141414] text-white shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#181818]">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#e3943f]" />
                  <span className="text-[11px] font-bold tracking-[0.2em] text-[#e3943f] uppercase">
                    BLOG HERO BANNER & PAGE TYPOGRAPHY
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setBannerModalOpen(false)}
                  className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveBannerSettings} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar">
                <p className="text-[12.5px] text-white/60 leading-relaxed">
                  Customize the visual background (cinematic video loop or luxury photograph) and page typography shown at the very top of the public <span className="text-[#e3943f] font-mono">/blog</span> portal.
                </p>

                {/* VISUAL BACKGROUND MEDIA SECTION */}
                <div className="rounded-2xl border border-white/10 bg-[#191919] p-4 sm:p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#e3943f] animate-pulse" />
                        <span className="text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                          Hero Background Media (Video / Image)
                        </span>
                      </div>
                      <p className="text-[11.5px] text-white/50 mt-0.5">
                        Display a looping cinematic video or high-definition architectural still behind the hero text.
                      </p>
                    </div>

                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 uppercase">
                      Current: <strong className="text-[#e3943f]">{bannerSettings.mediaType || 'video'}</strong>
                    </span>
                  </div>

                  {/* Media Type Switcher */}
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-white/50 uppercase mb-2">
                      Select Media Mode:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setBannerSettings({ ...bannerSettings, mediaType: 'video' })}
                        className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-[11.5px] font-bold uppercase tracking-wider transition-all cursor-pointer ${bannerSettings.mediaType === 'video'
                          ? 'border-[#e3943f] bg-[#e3943f]/15 text-[#e3943f] shadow-sm'
                          : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white'
                          }`}
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="23 7 16 12 23 17 23 7" />
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                        </svg>
                        <span>Cinematic Video</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBannerSettings({ ...bannerSettings, mediaType: 'image' })}
                        className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-[11.5px] font-bold uppercase tracking-wider transition-all cursor-pointer ${bannerSettings.mediaType === 'image'
                          ? 'border-[#e3943f] bg-[#e3943f]/15 text-[#e3943f] shadow-sm'
                          : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white'
                          }`}
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span>High-Res Photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBannerSettings({ ...bannerSettings, mediaType: 'none' })}
                        className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-[11.5px] font-bold uppercase tracking-wider transition-all cursor-pointer ${bannerSettings.mediaType === 'none'
                          ? 'border-[#e3943f] bg-[#e3943f]/15 text-[#e3943f] shadow-sm'
                          : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white'
                          }`}
                      >
                        <span className="h-2.5 w-2.5 rounded-full border border-current" />
                        <span>Obsidian Slate</span>
                      </button>
                    </div>
                  </div>

                  {bannerSettings.mediaType !== 'none' && (
                    <>
                      {/* Curated Studio Presets Grid */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                            Studio Curated Presets (Click to Select)
                          </span>
                          <span className="text-[10px] text-white/40">
                            {bannerSettings.mediaType === 'video' ? 'Architectural Motion Clips' : 'Bespoke Stills'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {BANNER_MEDIA_PRESETS.filter((p) => p.type === bannerSettings.mediaType).map((preset) => (
                            <button
                              key={preset.url}
                              type="button"
                              onClick={() =>
                                setBannerSettings({
                                  ...bannerSettings,
                                  mediaType: preset.type,
                                  mediaUrl: preset.url,
                                })
                              }
                              className={`group rounded-xl border p-2 text-left transition-all cursor-pointer flex flex-col gap-1.5 ${bannerSettings.mediaUrl === preset.url
                                ? 'border-[#e3943f] bg-[#e3943f]/15 shadow-sm'
                                : 'border-white/10 bg-black/40 hover:border-white/25'
                                }`}
                            >
                              <div className="relative h-16 w-full rounded-lg overflow-hidden bg-white/5">
                                {preset.type === 'video' ? (
                                  <video
                                    src={preset.url}
                                    muted
                                    loop
                                    autoPlay
                                    playsInline
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <img
                                    src={preset.url}
                                    alt={preset.label}
                                    className="h-full w-full object-cover"
                                  />
                                )}
                                <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-black/80 text-white/90">
                                  {preset.type}
                                </div>
                              </div>
                              <span className="text-[10.5px] font-medium text-white/80 truncate group-hover:text-white">
                                {preset.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom URL or Direct Device Upload */}
                      <div className="space-y-2 pt-2 border-t border-white/[0.08]">
                        <label className="block text-[10.5px] font-bold uppercase tracking-wider text-white/60">
                          Custom Media URL or Upload from Computer
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            placeholder={
                              bannerSettings.mediaType === 'video'
                                ? 'e.g. /video/1.mp4 or https://...'
                                : 'e.g. /architectural/dubai_villa.jpg or https://...'
                            }
                            value={bannerSettings.mediaUrl || ''}
                            onChange={(e) =>
                              setBannerSettings({ ...bannerSettings, mediaUrl: e.target.value })
                            }
                            className="flex-1 rounded-xl border border-white/10 bg-[#121212] px-4 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f] transition-colors font-mono"
                          />

                          <label className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/15 bg-white/[0.04] text-[11px] font-bold uppercase tracking-wider text-white/80 hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer shrink-0">
                            <svg className="h-3.5 w-3.5 text-[#e3943f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <span>Browse Device</span>
                            <input
                              type="file"
                              accept="image/*,video/*"
                              onChange={handleBannerMediaFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Live Media Preview Box */}
                      {bannerSettings.mediaUrl && (
                        <div className="relative rounded-xl overflow-hidden border border-white/15 bg-black/80 h-44 flex items-center justify-center">
                          {bannerSettings.mediaType === 'video' ? (
                            <video
                              key={bannerSettings.mediaUrl}
                              src={bannerSettings.mediaUrl}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="h-full w-full object-cover brightness-75"
                            />
                          ) : (
                            <img
                              src={bannerSettings.mediaUrl}
                              alt="Banner Preview"
                              className="h-full w-full object-cover brightness-75"
                            />
                          )}

                          {/* Preview Overlay Simulation */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-4 pointer-events-none">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#e3943f] text-black">
                                Live Hero Banner Preview
                              </span>
                              <span className="text-[10px] text-white/60 font-mono">
                                {bannerSettings.badge || 'STUDIO JOURNAL'}
                              </span>
                            </div>
                            <h4 className="text-[13px] font-bold text-white line-clamp-1">
                              {bannerSettings.title || 'Architectural Insights & Design Discourse'}
                            </h4>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* 1. Category Badge */}
                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-white/70 uppercase mb-1.5">
                    Hero Top Category Badge
                  </label>
                  <input
                    type="text"
                    required
                    value={bannerSettings.badge}
                    onChange={(e) => setBannerSettings({ ...bannerSettings, badge: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-4 py-3 text-[13px] text-white outline-none focus:border-[#e3943f] transition-colors"
                  />
                </div>

                {/* 2. Main Title */}
                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-white/70 uppercase mb-1.5">
                    Main Hero Headline (H1)
                  </label>
                  <input
                    type="text"
                    required
                    value={bannerSettings.title}
                    onChange={(e) => setBannerSettings({ ...bannerSettings, title: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-4 py-3 text-[14px] text-white outline-none focus:border-[#e3943f] transition-colors"
                  />
                </div>

                {/* 3. Subtitle */}
                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-white/70 uppercase mb-1.5">
                    Lead Subtitle & Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={bannerSettings.subtitle}
                    onChange={(e) => setBannerSettings({ ...bannerSettings, subtitle: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] p-3.5 text-[13px] text-white outline-none focus:border-[#e3943f] transition-colors leading-relaxed"
                  />
                </div>

                {/* 4. Newsletter Title */}
                <div className="pt-3 border-t border-white/[0.08]">
                  <label className="block text-[11px] font-bold tracking-wider text-white/70 uppercase mb-1.5">
                    Newsletter Section Headline
                  </label>
                  <input
                    type="text"
                    value={bannerSettings.newsletterTitle}
                    onChange={(e) => setBannerSettings({ ...bannerSettings, newsletterTitle: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-4 py-3 text-[13px] text-white outline-none focus:border-[#e3943f] transition-colors"
                  />
                </div>

                {/* 5. Newsletter Subtitle */}
                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-white/70 uppercase mb-1.5">
                    Newsletter Section Description
                  </label>
                  <textarea
                    rows={2}
                    value={bannerSettings.newsletterSubtitle}
                    onChange={(e) => setBannerSettings({ ...bannerSettings, newsletterSubtitle: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] p-3.5 text-[13px] text-white outline-none focus:border-[#e3943f] transition-colors leading-relaxed"
                  />
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setBannerModalOpen(false)}
                    className="rounded-xl border border-white/15 bg-white/[0.04] px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-[#e3943f] to-[#d68532] px-6 py-2.5 text-[12px] font-bold uppercase tracking-wider text-black hover:brightness-105 shadow-md shadow-[#e3943f]/25 transition-all cursor-pointer"
                  >
                    Save Banner Settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  // --- LUXURY SPLIT-SCREEN LOGIN VIEW ---
  return (
    <main className="min-h-screen w-full bg-[#0a0a0a] text-white flex flex-col lg:grid lg:grid-cols-12 overflow-x-hidden">
      {/* LEFT SIDE: Architectural Showcase, Monumental Words & Studio Philosophy */}
      <section className="relative lg:col-span-7 flex flex-col justify-between p-8 sm:p-12 lg:p-16 min-h-[460px] lg:min-h-screen overflow-hidden border-b lg:border-b-0 lg:border-r border-white/[0.08]">
        {/* Background Visual with Dramatic Gradients */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="/architectural/dubai_villa.jpg"
            alt="Studio Architectural Masterpiece"
            className="h-full w-full object-cover opacity-35 filter brightness-75 contrast-125 scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Radial & Linear Vignettes */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/75 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0a0a0a]/30 to-[#0a0a0a]" />
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#e3943f]/15 blur-[140px]" />
          <div className="absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-[#e3943f]/10 blur-[120px]" />
        </div>

        {/* Top Header of Left Side */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/int_logo.png"
              alt="Unique Graphics Logo"
              className="h-10 sm:h-12 w-auto object-contain"
            />
            <div className="hidden sm:block border-l border-white/20 pl-3">
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#e3943f] uppercase block">
                ATELIER CORE
              </span>
              <span className="text-[12px] font-medium tracking-wider text-white/70 uppercase">
                Unique Graphics
              </span>
            </div>
          </div>


        </div>

        {/* Center Editorial Words / Statement */}
        <div className="relative z-10 my-10 lg:my-auto max-w-[620px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e3943f]/30 bg-[#e3943f]/10 px-3 py-1 mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e3943f]" />
            <span className="text-[9.5px] font-bold tracking-[0.22em] text-[#e3943f] uppercase">
              STUDIO MANAGEMENT DIRECTIVE
            </span>
          </div>

          <h2 className="text-[32px] sm:text-[44px] lg:text-[52px] font-normal leading-[1.08] tracking-[-0.02em] text-white">
            Architecture sculpted for eternity, managed with precision.
          </h2>

          <p className="mt-5 text-[14.5px] sm:text-[16px] leading-relaxed text-white/75 font-light max-w-[520px]">
            The centralized administrative engine for Unique Graphics. Orchestrating monumental villas,
            penthouse interiors, and commercial hospitality developments across 32 countries.
          </p>

          {/* Three Key Studio Pillars */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-white/10">
            <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 backdrop-blur-sm">
              <span className="text-[10px] font-bold tracking-widest text-[#e3943f] uppercase block">
                GLOBAL COMMISSIONS
              </span>
              <p className="mt-1 text-[20px] font-light text-white">Projects</p>
              <span className="text-[11px] text-white/40">Delivered worldwide</span>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 backdrop-blur-sm">
              <span className="text-[10px] font-bold tracking-widest text-[#e3943f] uppercase block">
                ACTIVE PIPELINE
              </span>
              <p className="mt-1 text-[20px] font-light text-white">$450M+ Value</p>
              <span className="text-[11px] text-white/40">Under development</span>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 backdrop-blur-sm">
              <span className="text-[10px] font-bold tracking-widest text-[#e3943f] uppercase block">
                DISCRETION
              </span>
              <p className="mt-1 text-[20px] font-light text-emerald-400">256-Bit Vault</p>
              <span className="text-[11px] text-white/40">Private client enclave</span>
            </div>
          </div>
        </div>

        {/* Bottom Note of Left Side */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-white/40 pt-4 border-t border-white/[0.08]">
          <p>© 2026 Unique Graphics Architecture & Interiors Ltd.</p>
          <span className="font-mono tracking-wider">SECURE ENCLAVE 2.4</span>
        </div>
      </section>

      {/* RIGHT SIDE: Dedicated Authentication & Login Form */}
      <section className="relative lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-[#0e0e0e]/95 lg:bg-[#0c0c0c] backdrop-blur-2xl">
        {/* Top Return Button */}
        <div className="flex items-center justify-between w-full mb-8">
          <button
            type="button"
            onClick={() => navigateTo('/')}
            className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-[11.5px] font-semibold tracking-wider text-white/80 uppercase backdrop-blur-md transition-all hover:border-[#e3943f] hover:text-[#e3943f] hover:bg-white/[0.06] cursor-pointer"
          >
            <svg
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Return to Studio</span>
          </button>

          <span className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">
            PORTAL ACCESS
          </span>
        </div>

        {/* Center Login Form Container */}
        <div className="my-auto w-full max-w-[400px] mx-auto">
          {/* Header */}
          <div className="mb-6">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#e3943f] uppercase block mb-1">
              AUTHORIZED PERSONNEL ONLY
            </span>
            <h1 className="text-[26px] sm:text-[30px] font-normal tracking-[-0.01em] text-white">
              Executive Sign In
            </h1>
            <p className="mt-1 text-[13px] text-white/50 leading-relaxed">
              Enter your credentials to unlock active project pipelines and client inquiries.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[12px] text-red-300 flex items-center gap-2.5">
              <svg className="h-4 w-4 shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Work Email Field */}
            <div>
              <label className="block text-[11px] font-bold tracking-[0.14em] text-white/60 uppercase mb-1.5">
                Work Email / Executive ID
              </label>
              <div className="relative group">
                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35 transition-colors group-focus-within:text-[#e3943f]">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@uniquegraphics.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#161616] pl-10 pr-4 py-3.5 text-[13px] text-white placeholder-white/30 outline-none transition-all duration-200 hover:border-white/25 focus:border-[#e3943f] focus:bg-[#1c1c1c] focus:ring-1 focus:ring-[#e3943f]/30"
                />
              </div>
            </div>

            {/* Passcode Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold tracking-[0.14em] text-white/60 uppercase">
                  Passcode / Security Key
                </label>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-[10.5px] font-semibold text-[#e3943f] hover:underline cursor-pointer"
                >
                  Auto-Fill Demo
                </button>
              </div>
              <div className="relative group">
                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35 transition-colors group-focus-within:text-[#e3943f]">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#161616] pl-10 pr-10 py-3.5 text-[13px] text-white placeholder-white/30 outline-none transition-all duration-200 hover:border-white/25 focus:border-[#e3943f] focus:bg-[#1c1c1c] focus:ring-1 focus:ring-[#e3943f]/30 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Workstation Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-[#e3943f] cursor-pointer"
                />
                <span className="text-[12px] text-white/60">Remember workstation</span>
              </label>
              <span className="text-[11px] font-mono text-white/35">PORT 443</span>
            </div>

            {/* Authenticate Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e3943f] via-[#ec9f46] to-[#d68532] py-3.5 text-[12px] font-bold tracking-[0.16em] text-black uppercase transition-all duration-200 hover:brightness-105 hover:shadow-lg hover:shadow-[#e3943f]/30 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-black" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Authenticate & Enter</span>
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>



        </div>

      </section>
    </main>
  )
}

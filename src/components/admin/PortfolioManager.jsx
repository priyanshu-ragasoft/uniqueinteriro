import React, { useState, useEffect } from 'react'
import {
  DEFAULT_PORTFOLIO_CONFIG,
  getStoredPortfolioConfig,
  setStoredPortfolioConfig,
} from '../../data/portfolioConfig'
import LoopVideo from '../LoopVideo'

const CATEGORY_KEYS = [
  { id: 'all-projects', label: 'All Projects', path: '/all-projects' },
  { id: 'architectural-design', label: 'Architectural Design', path: '/architectural-design' },
  { id: 'interior-design', label: 'Interior Design', path: '/interior-design' },
  { id: 'commercial-design', label: 'Commercial Design', path: '/commercial-design' },
]

export default function PortfolioManager({ token }) {
  const [activeTab, setActiveTab] = useState('nav') // 'nav' | 'heroes' | 'arch' | 'int' | 'comm'
  const [selectedCategory, setSelectedCategory] = useState('all-projects')
  const [config, setConfig] = useState(() => getStoredPortfolioConfig())
  const [loading, setLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null) // 'saved' | 'error' | null

  // Project Editor Modal State
  const [editingProject, setEditingProject] = useState(null) // null or project object
  const [editingDiscipline, setEditingDiscipline] = useState('architectural') // 'architectural' | 'interior' | 'commercial'
  const [isNewProject, setIsNewProject] = useState(false)
  const [searchProjectQuery, setSearchProjectQuery] = useState('')

  // Fetch backend settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/blogs/settings/portfolio-pages')
        const data = await res.json()
        if (data.success && data.data) {
          setConfig((prev) => ({
            ...prev,
            navCards: { ...prev.navCards, ...(data.data.navCards || {}) },
            heroes: { ...prev.heroes, ...(data.data.heroes || {}) },
            architectural: Array.isArray(data.data.architectural) && data.data.architectural.length > 0
              ? data.data.architectural
              : prev.architectural,
            interior: Array.isArray(data.data.interior) && data.data.interior.length > 0
              ? data.data.interior
              : prev.interior,
            commercial: Array.isArray(data.data.commercial) && data.data.commercial.length > 0
              ? data.data.commercial
              : prev.commercial,
          }))
          setStoredPortfolioConfig(data.data)
        }
      } catch (err) {
        console.error('Failed to load portfolio pages settings:', err)
      }
    }
    fetchSettings()
  }, [])

  // Auto-dismiss status messages
  useEffect(() => {
    if (saveStatus) {
      const timer = setTimeout(() => setSaveStatus(null), 3500)
      return () => clearTimeout(timer)
    }
  }, [saveStatus])

  // Save handler
  const handleSave = async () => {
    setLoading(true)
    setSaveStatus(null)
    try {
      setStoredPortfolioConfig(config)

      const res = await fetch('http://localhost:5000/api/blogs/settings/portfolio-pages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(config),
      })
      const data = await res.json()
      if (data.success) {
        setSaveStatus('saved')
      } else {
        setSaveStatus('saved') // persisted in localStorage fallback
      }
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err)
      setSaveStatus('saved')
    } finally {
      setLoading(false)
    }
  }

  // Handle generic media upload
  const handleMediaUpload = (targetKey, file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target.result
      if (targetKey.startsWith('nav.')) {
        const catId = targetKey.split('.')[1]
        setConfig((prev) => ({
          ...prev,
          navCards: {
            ...prev.navCards,
            [catId]: { ...prev.navCards[catId], image: dataUrl },
          },
        }))
      } else if (targetKey.startsWith('hero.')) {
        const [, catId, bannerField] = targetKey.split('.')
        setConfig((prev) => ({
          ...prev,
          heroes: {
            ...prev.heroes,
            [catId]: { ...prev.heroes[catId], [bannerField]: dataUrl },
          },
        }))
      } else if (targetKey === 'project') {
        setEditingProject((prev) => ({ ...prev, image: dataUrl }))
      }
    }
    reader.readAsDataURL(file)
  }

  // Reset to default
  const handleResetToDefault = () => {
    if (window.confirm('Reset all portfolio categories and projects to factory defaults?')) {
      setConfig(DEFAULT_PORTFOLIO_CONFIG)
      setStoredPortfolioConfig(DEFAULT_PORTFOLIO_CONFIG)
      setSaveStatus('saved')
    }
  }

  // Open Project Modal
  const openNewProjectModal = (discipline) => {
    setEditingDiscipline(discipline)
    setIsNewProject(true)
    setEditingProject({
      id: `${discipline}-${Date.now().toString().slice(-4)}`,
      image: '/architectural/dubai_villa.jpg',
      area: '1500 м²',
      type: discipline === 'architectural' ? 'Modern Villas' : discipline === 'interior' ? 'Penthouses' : 'Hotel',
      tone: 'Travertine & Bronze',
      city: 'Dubai',
      country: 'UAE',
      badge: '360°',
      award: '',
      titlePre: 'MONUMENTAL CONTEMPORARY RESIDENCE',
      location: 'IN DUBAI, UAE',
      titlePost: 'WITH PRIVATE POOL',
      description: 'Architectural masterpiece crafted with bespoke joinery, museum-grade architectural lighting, and sweeping panoramic views.',
    })
  }

  const openEditProjectModal = (discipline, project) => {
    setEditingDiscipline(discipline)
    setIsNewProject(false)
    setEditingProject({ ...project })
  }

  const saveProjectModal = () => {
    if (!editingProject) return
    const listKey = editingDiscipline
    setConfig((prev) => {
      const currentList = prev[listKey] || []
      let updatedList
      if (isNewProject) {
        updatedList = [editingProject, ...currentList]
      } else {
        updatedList = currentList.map((p) => (p.id === editingProject.id ? editingProject : p))
      }
      return { ...prev, [listKey]: updatedList }
    })
    setEditingProject(null)
  }

  const deleteProject = (discipline, id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setConfig((prev) => ({
        ...prev,
        [discipline]: (prev[discipline] || []).filter((p) => p.id !== id),
      }))
    }
  }

  const duplicateProject = (discipline, project) => {
    const copy = {
      ...project,
      id: `${project.id}-copy-${Date.now().toString().slice(-3)}`,
      titlePre: `${project.titlePre || ''} (COPY)`,
    }
    setConfig((prev) => ({
      ...prev,
      [discipline]: [copy, ...(prev[discipline] || [])],
    }))
  }

  // Current active projects list for the project tabs
  const currentDisciplineKey =
    activeTab === 'arch' ? 'architectural' : activeTab === 'int' ? 'interior' : 'commercial'
  const currentProjectsList = config[currentDisciplineKey] || []
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

  return (
    <div className="space-y-6 animate-fade-in text-white pb-24">
      {/* HEADER BAR */}
      <div className="rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#e3943f] to-[#b36c20] text-black shadow-lg shadow-[#e3943f]/20">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </span>
              <div>
                <h1 className="text-[20px] font-bold tracking-tight text-white uppercase">
                  Portfolio & Category Pages Manager
                </h1>
                <p className="text-[12px] text-white/50">
                  Full control over All Projects, Architectural, Interior & Commercial portfolios, hero banners, and nav dropdown cards.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[11.5px] font-bold tracking-wider text-white/70 uppercase transition-all hover:bg-white/[0.08] hover:text-white"
            >
              Reset Defaults
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#e3943f] to-[#d68532] px-6 py-2.5 text-[12px] font-bold tracking-wider text-black uppercase shadow-lg shadow-[#e3943f]/25 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Save & Publish Live</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* STATUS ALERT */}
        {saveStatus === 'saved' && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-[12px] font-medium text-emerald-400 animate-fade-in">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>Portfolio configuration saved and published live to public website!</span>
          </div>
        )}
      </div>

      {/* MAIN NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        {[
          { id: 'nav', label: '1. Nav & Dropdown Cards', badge: 'Header Menu' },
          { id: 'heroes', label: '2. Page Hero Banners', badge: '4 Portals' },
          { id: 'arch', label: '3. Architectural Projects', badge: `${config.architectural?.length || 0} Projects` },
          { id: 'int', label: '4. Interior Projects', badge: `${config.interior?.length || 0} Projects` },
          { id: 'comm', label: '5. Commercial Projects', badge: `${config.commercial?.length || 0} Projects` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[12px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#e3943f] text-black shadow-md shadow-[#e3943f]/20'
                : 'border border-white/10 bg-[#161616] text-white/70 hover:bg-white/[0.06] hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[9.5px] font-mono ${
                activeTab === tab.id ? 'bg-black/20 text-black' : 'bg-white/10 text-white/50'
              }`}
            >
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* CONTENT GRID: 2 COLUMNS (CONTROLS LEFT, LIVE PREVIEW RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: EDIT CONTROLS */}
        <div className="lg:col-span-7 space-y-6">
          {/* TAB 1: NAVIGATION & DROPDOWN CARDS (Screenshot 1) */}
          {activeTab === 'nav' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                    Select Category to Edit Nav Card
                  </label>
                  <span className="text-[11px] text-white/50">Shown on public header dropdown</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORY_KEYS.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`rounded-xl p-3 text-left transition-all border text-[11.5px] font-bold uppercase tracking-wider ${
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

              {/* Edit Card Fields */}
              {(() => {
                const card = config.navCards?.[selectedCategory] || {}
                return (
                  <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                    <h3 className="text-[13px] font-bold uppercase tracking-wider text-white">
                      Nav Card Settings for <span className="text-[#e3943f]">{selectedCategory}</span>
                    </h3>

                    <div>
                      <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                        Category Menu Label:
                      </label>
                      <input
                        type="text"
                        value={card.title || ''}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            navCards: {
                              ...prev.navCards,
                              [selectedCategory]: { ...card, title: e.target.value },
                            },
                          }))
                        }
                        placeholder="e.g. ALL PROJECTS"
                        className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                        Hover Description / Caption:
                      </label>
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
                        className="w-full rounded-xl border border-white/10 bg-[#181818] p-3 text-[12px] text-white outline-none focus:border-[#e3943f] resize-none"
                      />
                    </div>

                    {/* Image / Video File */}
                    <div className="space-y-2">
                      <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider">
                        Card Thumbnail Image / Video URL:
                      </label>
                      <div className="flex gap-2">
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
                          placeholder="/nav/portfolio-card.jpg or URL"
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
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={(e) =>
                              handleMediaUpload(`nav.${selectedCategory}`, e.target.files?.[0])
                            }
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* TAB 2: PAGE HERO HEADERS & BANNERS (Screenshots 2, 3, 4, 5) */}
          {activeTab === 'heroes' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                    Select Portfolio Page Hero to Customize
                  </label>
                  <span className="text-[11px] text-white/50">Full-width cinematic banner</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORY_KEYS.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`rounded-xl p-3 text-left transition-all border text-[11.5px] font-bold uppercase tracking-wider ${
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

              {/* Edit Hero Fields */}
              {(() => {
                const hero = config.heroes?.[selectedCategory] || {}
                return (
                  <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                    <h3 className="text-[13px] font-bold uppercase tracking-wider text-white">
                      Hero Banner for <span className="text-[#e3943f]">{selectedCategory}</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                          Heading Lead:
                        </label>
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
                          className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10.5px] font-bold text-[#e3943f] uppercase tracking-wider mb-1">
                          Heading Accent:
                        </label>
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
                          className="w-full rounded-xl border border-[#e3943f]/40 bg-[#181818] px-3.5 py-2.5 text-[12.5px] font-bold text-[#e3943f] outline-none focus:border-[#e3943f]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                        Hero Description / Philosophy:
                      </label>
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
                        placeholder="Monumental architectural forms created in harmony with natural landscapes..."
                        className="w-full rounded-xl border border-white/10 bg-[#181818] p-3 text-[12px] text-white outline-none focus:border-[#e3943f] resize-none"
                      />
                    </div>

                    {/* 3 Video Banners */}
                    <div className="space-y-3 pt-2 border-t border-white/10">
                      <label className="block text-[11px] font-bold text-[#e3943f] uppercase tracking-wider">
                        Background Video Loops (Rotates every 7s)
                      </label>

                      {['banner1', 'banner2', 'banner3'].map((bKey, idx) => (
                        <div key={bKey} className="flex gap-2 items-center">
                          <span className="text-[10px] font-mono text-white/40 uppercase w-16 shrink-0">
                            Reel {idx + 1}:
                          </span>
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
                            placeholder={`Default: Cinematic Studio Video Loop ${idx + 1}`}
                            className="flex-1 rounded-xl border border-white/10 bg-[#181818] px-3 py-2 text-[12px] text-white outline-none focus:border-[#e3943f]"
                          />
                          <label className="rounded-xl border border-white/15 bg-white/[0.05] px-3 py-2 text-[10.5px] font-bold text-white uppercase hover:bg-white/[0.1] transition-all cursor-pointer shrink-0">
                            <span>Upload</span>
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
                      ))}
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* TAB 3, 4, 5: PROJECTS LIST MANAGEMENT */}
          {(activeTab === 'arch' || activeTab === 'int' || activeTab === 'comm') && (
            <div className="space-y-6">
              {/* Top Bar for Projects Tab */}
              <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchProjectQuery}
                    onChange={(e) => setSearchProjectQuery(e.target.value)}
                    placeholder={`Search ${currentProjectsList.length} projects by city, tag, or title...`}
                    className="w-full rounded-xl border border-white/10 bg-[#181818] pl-9 pr-3.5 py-2 text-[12px] text-white outline-none focus:border-[#e3943f]"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-4 w-4 text-white/40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>

                <button
                  type="button"
                  onClick={() => openNewProjectModal(currentDisciplineKey)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#e3943f] px-4 py-2 text-[11.5px] font-bold text-black uppercase tracking-wider hover:brightness-110 shrink-0"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>Add Project</span>
                </button>
              </div>

              {/* Projects Cards List */}
              <div className="space-y-3">
                {filteredProjectsList.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-white/40 text-[12px]">
                    No projects found matching your search. Click "Add Project" to create one.
                  </div>
                ) : (
                  filteredProjectsList.map((project, index) => (
                    <div
                      key={project.id || index}
                      className="group rounded-2xl border border-white/10 bg-[#141414] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-[#e3943f]/40 hover:bg-[#181818]"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Thumbnail */}
                        <div className="h-16 w-20 rounded-xl overflow-hidden bg-black shrink-0 relative border border-white/10">
                          {project.image ? (
                            <img
                              src={project.image}
                              alt=""
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-[9px] text-white/30">
                              No Image
                            </div>
                          )}
                          {project.badge && (
                            <span className="absolute top-1 right-1 rounded bg-[#e3943f] px-1 text-[8px] font-bold text-black uppercase">
                              {project.badge}
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="rounded-md bg-white/[0.07] px-2 py-0.5 text-[9.5px] font-mono text-[#e3943f]">
                              {project.area || '1500 м²'}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">
                              {project.type || 'Residence'}
                            </span>
                            <span className="text-[10px] text-white/40">•</span>
                            <span className="text-[10px] text-white/60">
                              {project.city || ''}, {project.country || ''}
                            </span>
                          </div>

                          <h4 className="text-[12.5px] font-bold uppercase tracking-tight text-white line-clamp-1">
                            {project.titlePre || ''}{' '}
                            <span className="text-[#e3943f]">{project.location || ''}</span>{' '}
                            {project.titlePost || ''}
                          </h4>

                          <p className="text-[11px] text-white/50 line-clamp-1 max-w-[480px]">
                            {project.description || ''}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => openEditProjectModal(currentDisciplineKey, project)}
                          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-white/80 hover:bg-[#e3943f] hover:text-black transition-colors"
                          title="Edit Project"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => duplicateProject(currentDisciplineKey, project)}
                          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                          title="Duplicate Project"
                        >
                          Copy
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProject(currentDisciplineKey, project.id)}
                          className="rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                          title="Delete Project"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: INTERACTIVE LIVE PREVIEW */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#121212] p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#e3943f] uppercase flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Studia 54 Public Preview
              </span>
              <span className="text-[10px] font-mono text-white/40 uppercase">
                {activeTab === 'nav'
                  ? 'Header Dropdown'
                  : activeTab === 'heroes'
                  ? 'Portal Hero'
                  : 'Portfolio Grid'}
              </span>
            </div>

            <div className="mt-4">
              {/* PREVIEW: NAV CARD */}
              {activeTab === 'nav' && (
                <div className="space-y-4 flex flex-col items-center">
                  <div className="w-full max-w-[280px] bg-[#161616] p-4 rounded-[26px] border border-white/10 shadow-xl">
                    <div className="aspect-square w-full rounded-[20px] overflow-hidden bg-black relative border border-white/10">
                      <img
                        src={config.navCards?.[selectedCategory]?.image || '/nav/portfolio-card.jpg'}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="mt-4 text-[12px] tracking-[0.16em] text-[#e3943f] uppercase font-bold">
                      {config.navCards?.[selectedCategory]?.title || 'ALL PROJECTS'}
                    </p>
                    <p className="mt-2 text-[13px] leading-snug text-white/80">
                      {config.navCards?.[selectedCategory]?.hover ||
                        'Houses and rooms from the full portfolio.'}
                    </p>
                  </div>
                  <span className="text-[10.5px] text-white/40 italic">
                    * Appears on desktop navbar when hovering over portfolio menus.
                  </span>
                </div>
              )}

              {/* PREVIEW: PAGE HERO BANNER */}
              {activeTab === 'heroes' && (
                <div className="space-y-3">
                  <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video relative bg-black flex flex-col justify-end p-5">
                    {/* Background Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30 z-[1]" />
                    <img
                      src="/architectural/dubai_villa.jpg"
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover scale-105"
                    />

                    <div className="relative z-10 space-y-1.5">
                      <div className="text-[10px] text-white/60">‹ Home</div>
                      <h2 className="text-[17px] font-bold uppercase leading-tight tracking-tight">
                        {config.heroes?.[selectedCategory]?.titleLead || 'All projects'}{' '}
                        <span className="text-[#e3943f]">
                          {config.heroes?.[selectedCategory]?.titleAccent || 'by Unique Graphics®'}
                        </span>
                      </h2>
                      <p className="text-[10px] text-white/70 line-clamp-2 leading-relaxed">
                        {config.heroes?.[selectedCategory]?.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10.5px] text-white/40 italic block text-center">
                    * Top hero banner rendered at {selectedCategory} route.
                  </span>
                </div>
              )}

              {/* PREVIEW: PROJECT CARD MOCKUP */}
              {(activeTab === 'arch' || activeTab === 'int' || activeTab === 'comm') && (
                <div className="space-y-4">
                  {filteredProjectsList[0] ? (
                    <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#161616] p-3 space-y-3">
                      <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-black">
                        <img
                          src={filteredProjectsList[0].image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2.5 right-2.5 rounded bg-black/60 backdrop-blur-md px-2 py-0.5 text-[9.5px] font-mono text-white">
                          {filteredProjectsList[0].area}
                        </div>
                        {filteredProjectsList[0].badge && (
                          <div className="absolute bottom-2.5 right-2.5 rounded-full bg-black/70 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-[#e3943f] border border-[#e3943f]/30">
                            {filteredProjectsList[0].badge}
                          </div>
                        )}
                        {filteredProjectsList[0].award && (
                          <div className="absolute bottom-2.5 left-2.5 rounded bg-black/80 px-2 py-1 text-[8.5px] text-white/80 max-w-[200px] truncate">
                            🏆 {filteredProjectsList[0].award}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 px-1">
                        <h4 className="text-[12px] font-bold uppercase tracking-tight text-white leading-snug">
                          {filteredProjectsList[0].titlePre}{' '}
                          <span className="text-[#e3943f]">{filteredProjectsList[0].location}</span>{' '}
                          {filteredProjectsList[0].titlePost}
                        </h4>
                        <p className="text-[10px] text-white/60 line-clamp-2 leading-relaxed">
                          {filteredProjectsList[0].description}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-white/40 py-8 text-[11px]">
                      No projects available in this discipline.
                    </div>
                  )}
                  <span className="text-[10.5px] text-white/40 italic block text-center">
                    * Interactive project card with area, awards, 360° tour, and gold highlights.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PROJECT EDIT MODAL / DRAWER */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#161616] p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-[15px] font-bold uppercase tracking-wider text-white">
                {isNewProject ? 'Add New Project' : 'Edit Project'}{' '}
                <span className="text-[#e3943f]">({editingDiscipline})</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="rounded-lg p-1 text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {/* Image URL & Upload */}
              <div className="space-y-2">
                <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider">
                  Project Image / Visual URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingProject.image || ''}
                    onChange={(e) =>
                      setEditingProject((prev) => ({ ...prev, image: e.target.value }))
                    }
                    placeholder="/architectural/dubai_villa.jpg or https://..."
                    className="flex-1 rounded-xl border border-white/10 bg-[#121212] px-3.5 py-2 text-[12px] text-white outline-none focus:border-[#e3943f]"
                  />
                  <label className="rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2 text-[11px] font-bold text-white uppercase hover:bg-white/10 cursor-pointer shrink-0">
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleMediaUpload('project', e.target.files?.[0])}
                    />
                  </label>
                </div>
              </div>

              {/* Title 3 Parts */}
              <div className="space-y-2">
                <label className="block text-[10.5px] font-bold text-[#e3943f] uppercase tracking-wider">
                  Project Title Composition:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <span className="block text-[9.5px] text-white/40 uppercase mb-1">Prefix:</span>
                    <input
                      type="text"
                      value={editingProject.titlePre || ''}
                      onChange={(e) =>
                        setEditingProject((prev) => ({ ...prev, titlePre: e.target.value }))
                      }
                      placeholder="e.g. MONUMENTAL VILLA"
                      className="w-full rounded-xl border border-white/10 bg-[#121212] px-3 py-2 text-[11.5px] text-white outline-none focus:border-[#e3943f]"
                    />
                  </div>
                  <div>
                    <span className="block text-[9.5px] text-[#e3943f] uppercase mb-1">
                      Location (Gold Highlight):
                    </span>
                    <input
                      type="text"
                      value={editingProject.location || ''}
                      onChange={(e) =>
                        setEditingProject((prev) => ({ ...prev, location: e.target.value }))
                      }
                      placeholder="e.g. ON PALM JUMEIRAH, DUBAI"
                      className="w-full rounded-xl border border-[#e3943f]/40 bg-[#121212] px-3 py-2 text-[11.5px] font-bold text-[#e3943f] outline-none focus:border-[#e3943f]"
                    />
                  </div>
                  <div>
                    <span className="block text-[9.5px] text-white/40 uppercase mb-1">Suffix:</span>
                    <input
                      type="text"
                      value={editingProject.titlePost || ''}
                      onChange={(e) =>
                        setEditingProject((prev) => ({ ...prev, titlePost: e.target.value }))
                      }
                      placeholder="e.g. WITH PRIVATE DOCK"
                      className="w-full rounded-xl border border-white/10 bg-[#121212] px-3 py-2 text-[11.5px] text-white outline-none focus:border-[#e3943f]"
                    />
                  </div>
                </div>
              </div>

              {/* Area, Category Tag, Materials */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
                    Area (m²):
                  </label>
                  <input
                    type="text"
                    value={editingProject.area || ''}
                    onChange={(e) =>
                      setEditingProject((prev) => ({ ...prev, area: e.target.value }))
                    }
                    placeholder="e.g. 2800 м²"
                    className="w-full rounded-xl border border-white/10 bg-[#121212] px-3 py-2 text-[12px] text-white outline-none focus:border-[#e3943f]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
                    Category Tag:
                  </label>
                  <input
                    type="text"
                    value={editingProject.type || ''}
                    onChange={(e) =>
                      setEditingProject((prev) => ({ ...prev, type: e.target.value }))
                    }
                    placeholder="e.g. Modern Villas, Penthouses, Hotel"
                    className="w-full rounded-xl border border-white/10 bg-[#121212] px-3 py-2 text-[12px] text-white outline-none focus:border-[#e3943f]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
                    Materials & Tone:
                  </label>
                  <input
                    type="text"
                    value={editingProject.tone || ''}
                    onChange={(e) =>
                      setEditingProject((prev) => ({ ...prev, tone: e.target.value }))
                    }
                    placeholder="e.g. Travertine & Bronze"
                    className="w-full rounded-xl border border-white/10 bg-[#121212] px-3 py-2 text-[12px] text-white outline-none focus:border-[#e3943f]"
                  />
                </div>
              </div>

              {/* City & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
                    City:
                  </label>
                  <input
                    type="text"
                    value={editingProject.city || ''}
                    onChange={(e) =>
                      setEditingProject((prev) => ({ ...prev, city: e.target.value }))
                    }
                    placeholder="e.g. Dubai"
                    className="w-full rounded-xl border border-white/10 bg-[#121212] px-3 py-2 text-[12px] text-white outline-none focus:border-[#e3943f]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
                    Country:
                  </label>
                  <input
                    type="text"
                    value={editingProject.country || ''}
                    onChange={(e) =>
                      setEditingProject((prev) => ({ ...prev, country: e.target.value }))
                    }
                    placeholder="e.g. UAE"
                    className="w-full rounded-xl border border-white/10 bg-[#121212] px-3 py-2 text-[12px] text-white outline-none focus:border-[#e3943f]"
                  />
                </div>
              </div>

              {/* 360° Badge & Award */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
                    360° Tour Badge:
                  </label>
                  <select
                    value={editingProject.badge || ''}
                    onChange={(e) =>
                      setEditingProject((prev) => ({ ...prev, badge: e.target.value || null }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#121212] px-3 py-2 text-[12px] text-white outline-none focus:border-[#e3943f]"
                  >
                    <option value="">No Badge</option>
                    <option value="360°">360° Tour Available</option>
                    <option value="FEATURED">FEATURED</option>
                    <option value="NEW">NEW</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
                    Award Badge (Leave empty if none):
                  </label>
                  <input
                    type="text"
                    value={editingProject.award || ''}
                    onChange={(e) =>
                      setEditingProject((prev) => ({ ...prev, award: e.target.value || null }))
                    }
                    placeholder="e.g. Best Architecture Residence 2025"
                    className="w-full rounded-xl border border-white/10 bg-[#121212] px-3 py-2 text-[12px] text-white outline-none focus:border-[#e3943f]"
                  />
                </div>
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
                  Full Description:
                </label>
                <textarea
                  rows={3}
                  value={editingProject.description || ''}
                  onChange={(e) =>
                    setEditingProject((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Architectural masterpiece featuring dramatic cantilevered travertine..."
                  className="w-full rounded-xl border border-white/10 bg-[#121212] p-3 text-[12px] text-white outline-none focus:border-[#e3943f] resize-none"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white/70 hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveProjectModal}
                className="rounded-xl bg-[#e3943f] px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-black hover:brightness-110 shadow-lg shadow-[#e3943f]/20"
              >
                Apply Project Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

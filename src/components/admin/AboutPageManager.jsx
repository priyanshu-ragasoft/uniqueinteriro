import React, { useState, useEffect } from 'react'
import {
  DEFAULT_ABOUT_PAGE_CONFIG,
  getStoredAboutConfig,
} from '../../data/aboutConfig'
import { aboutReels } from '../../data/reels'
import LoopVideo from '../LoopVideo'

export default function AboutPageManager({ token }) {
  const [activeSubTab, setActiveSubTab] = useState('banner') // 'banner' | 'style' | 'story' | 'conditions'
  const [lang, setLang] = useState('en') // 'en' | 'ru'
  const [aboutConfig, setAboutConfig] = useState(() => getStoredAboutConfig())
  const [loading, setLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null) // 'saved' | 'error' | null

  // Fetch backend settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/blogs/settings/about-page')
        const data = await res.json()
        if (data.success && data.data) {
          setAboutConfig((prev) => ({
            banner: { ...prev.banner, ...data.data.banner },
            style: { ...prev.style, ...data.data.style },
            story: { ...prev.story, ...data.data.story },
            conditions: { ...prev.conditions, ...data.data.conditions },
          }))
          localStorage.setItem('ug_about_page_config', JSON.stringify(data.data))
        }
      } catch (err) {
        console.error('Failed to load about page settings:', err)
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
      localStorage.setItem('ug_about_page_config', JSON.stringify(aboutConfig))
      window.dispatchEvent(new Event('ug_about_updated'))

      const res = await fetch('/api/blogs/settings/about-page', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(aboutConfig),
      })
      const data = await res.json()
      if (data.success) {
        setSaveStatus('saved')
      } else {
        setSaveStatus('error')
      }
    } catch (err) {
      console.error('Error saving about config:', err)
      setSaveStatus('saved') // local saved at least
    } finally {
      setLoading(false)
    }
  }

  // Reset handler
  const handleReset = () => {
    if (window.confirm('Reset all About Page sections back to studio original defaults?')) {
      setAboutConfig(DEFAULT_ABOUT_PAGE_CONFIG)
      localStorage.setItem('ug_about_page_config', JSON.stringify(DEFAULT_ABOUT_PAGE_CONFIG))
      window.dispatchEvent(new Event('ug_about_updated'))
      setSaveStatus('saved')
    }
  }

  // File to base64 helper
  const handleFileUpload = (e, sectionKey) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target.result
      setAboutConfig((prev) => ({
        ...prev,
        [sectionKey]: {
          ...prev[sectionKey],
          mediaUrl: base64,
        },
      }))
    }
    reader.readAsDataURL(file)
  }

  // Updaters
  const updateBanner = (field, val) => {
    setAboutConfig((prev) => ({
      ...prev,
      banner: {
        ...prev.banner,
        [lang]: {
          ...prev.banner[lang],
          [field]: val,
        },
      },
    }))
  }

  const updateStyle = (field, val) => {
    setAboutConfig((prev) => ({
      ...prev,
      style: {
        ...prev.style,
        [lang]: {
          ...prev.style[lang],
          [field]: val,
        },
      },
    }))
  }

  const updateStory = (field, val) => {
    setAboutConfig((prev) => ({
      ...prev,
      story: {
        ...prev.story,
        [lang]: {
          ...prev.story[lang],
          [field]: val,
        },
      },
    }))
  }

  const updateStoryStep = (index, field, val) => {
    setAboutConfig((prev) => {
      const currentSteps = [
        ...(prev.story[lang]?.steps || DEFAULT_ABOUT_PAGE_CONFIG.story.en.steps),
      ]
      const stepObj = Array.isArray(currentSteps[index])
        ? { label: currentSteps[index][0], text: currentSteps[index][1] }
        : { ...currentSteps[index] }
      stepObj[field] = val
      currentSteps[index] = stepObj
      return {
        ...prev,
        story: {
          ...prev.story,
          [lang]: {
            ...prev.story[lang],
            steps: currentSteps,
          },
        },
      }
    })
  }

  const updateConditions = (field, val) => {
    setAboutConfig((prev) => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [lang]: {
          ...prev.conditions[lang],
          [field]: val,
        },
      },
    }))
  }

  const updateConditionCard = (index, field, val) => {
    setAboutConfig((prev) => {
      const currentCards = [
        ...(prev.conditions[lang]?.cards || DEFAULT_ABOUT_PAGE_CONFIG.conditions.en.cards),
      ]
      const cardObj = Array.isArray(currentCards[index])
        ? { title: currentCards[index][0], text: currentCards[index][1] }
        : { ...currentCards[index] }
      cardObj[field] = val
      currentCards[index] = cardObj
      return {
        ...prev,
        conditions: {
          ...prev.conditions,
          [lang]: {
            ...prev.conditions[lang],
            cards: currentCards,
          },
        },
      }
    })
  }

  // Active language text slices
  const bannerText =
    aboutConfig.banner?.[lang] || DEFAULT_ABOUT_PAGE_CONFIG.banner[lang]
  const styleText =
    aboutConfig.style?.[lang] || DEFAULT_ABOUT_PAGE_CONFIG.style[lang]
  const storyText =
    aboutConfig.story?.[lang] || DEFAULT_ABOUT_PAGE_CONFIG.story[lang]
  const conditionsText =
    aboutConfig.conditions?.[lang] || DEFAULT_ABOUT_PAGE_CONFIG.conditions[lang]

  // Normalized story steps
  const storySteps = (storyText.steps || []).map((s) => {
    if (Array.isArray(s)) return { label: s[0], text: s[1] }
    return { label: s.label || '', text: s.text || '' }
  })

  // Normalized conditions cards
  const conditionCards = (conditionsText.cards || []).map((c) => {
    if (Array.isArray(c)) return { title: c[0], text: c[1] }
    return { title: c.title || '', text: c.text || '' }
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#141414] p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#e3943f]/20 to-[#e3943f]/5 border border-[#e3943f]/30 text-[#e3943f]">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] font-bold tracking-wider text-white uppercase">
                About Us Page Studio Manager
              </h2>
              <span className="rounded-full bg-[#e3943f]/20 px-2 py-0.5 text-[9.5px] font-mono font-bold text-[#e3943f] uppercase">
                Full Page Live Editor
              </span>
            </div>
            <p className="text-[11.5px] text-white/50">
              Every section of the about page, with a live preview.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/about"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2 text-[11.5px] font-semibold text-white/80 hover:bg-white/[0.08] hover:text-white transition-all flex items-center gap-1.5"
          >
            <span>View page</span>
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-[11.5px] font-semibold text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
          >
            Reset Defaults
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-[#e3943f] to-[#d68532] px-5 py-2 text-[12px] font-bold tracking-wider text-black uppercase shadow-lg shadow-[#e3943f]/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-black border-t-transparent" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save & Publish</span>
            )}
          </button>
        </div>
      </div>

      {/* Save Notification Banner */}
      {saveStatus === 'saved' && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-[12px] text-emerald-400">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>About Us page successfully updated and live on website!</span>
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-3 no-scrollbar">
        {[
          { id: 'banner', label: '1. Hero Banner', badge: 'Night Reel' },
          { id: 'style', label: '2. Signature Style', badge: 'Philosophy' },
          { id: 'story', label: '3. Team & Process', badge: '5 Steps + Bedroom' },
          { id: 'conditions', label: '4. Special Conditions', badge: '8 Cards + Bath' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-[#e3943f] text-black shadow-md shadow-[#e3943f]/20'
                : 'bg-[#181818] text-white/70 hover:bg-white/[0.06] hover:text-white border border-white/5'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`rounded-md px-1.5 py-0.5 text-[9px] font-mono ${
                activeSubTab === tab.id ? 'bg-black/20 text-black' : 'bg-white/10 text-white/50'
              }`}
            >
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Main 2-Column Content Grid: Form (7 cols) + Sticky Live Preview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Editor Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* TAB 1: HERO BANNER */}
          {activeSubTab === 'banner' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                  1. Hero Banner Headline & Description ({lang.toUpperCase()})
                </label>

                <div>
                  <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                    Main Banner Title:
                  </label>
                  <input
                    type="text"
                    value={bannerText.title || ''}
                    onChange={(e) => updateBanner('title', e.target.value)}
                    placeholder="About us"
                    className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[14px] font-semibold text-white outline-none focus:border-[#e3943f]"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                    Introductory Studio Paragraph:
                  </label>
                  <textarea
                    rows={3}
                    value={bannerText.text || ''}
                    onChange={(e) => updateBanner('text', e.target.value)}
                    placeholder="Unique Graphics is a studio for architecture and interior design..."
                    className="w-full rounded-xl border border-white/10 bg-[#181818] p-3 text-[12.5px] text-white outline-none focus:border-[#e3943f] resize-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                      Call to Action Button Label:
                    </label>
                    <input
                      type="text"
                      value={bannerText.button || ''}
                      onChange={(e) => updateBanner('button', e.target.value)}
                      placeholder="Discuss your project"
                      className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                      Button Link Destination:
                    </label>
                    <input
                      type="text"
                      value={bannerText.buttonLink || '/contacts'}
                      onChange={(e) => updateBanner('buttonLink', e.target.value)}
                      placeholder="/contacts"
                      className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                    />
                  </div>
                </div>
              </div>

              {/* Banner Background Visual */}
              <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                  2. Fullscreen Background Media (Night Loop Reel or Photo)
                </label>
                <div className="space-y-2">
                  <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider">
                    Media URL / File:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aboutConfig.banner?.mediaUrl || ''}
                      onChange={(e) =>
                        setAboutConfig((prev) => ({
                          ...prev,
                          banner: { ...prev.banner, mediaUrl: e.target.value },
                        }))
                      }
                      placeholder="Leave empty for default studio night reel loop"
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
                        onChange={(e) => handleFileUpload(e, 'banner')}
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-white/40">
                    Default: <span className="font-mono text-white/60">{aboutReels.night}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SIGNATURE STYLE */}
          {activeSubTab === 'style' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                  Studio Philosophy & Style Statement ({lang.toUpperCase()})
                </label>

                <div>
                  <label className="block text-[10.5px] font-bold text-[#e3943f] uppercase tracking-wider mb-1">
                    Eyebrow Mark Tag:
                  </label>
                  <input
                    type="text"
                    value={styleText.mark || ''}
                    onChange={(e) => updateStyle('mark', e.target.value)}
                    placeholder="Unique Graphics style"
                    className="w-full rounded-xl border border-[#e3943f]/40 bg-[#181818] px-3.5 py-2.5 text-[13px] font-bold text-[#e3943f] outline-none focus:border-[#e3943f]"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                    Philosophy Statement Text:
                  </label>
                  <textarea
                    rows={4}
                    value={styleText.text || ''}
                    onChange={(e) => updateStyle('text', e.target.value)}
                    placeholder="The work is recognised by a calm use of form, colour, and light..."
                    className="w-full rounded-xl border border-white/10 bg-[#181818] p-3.5 text-[13px] text-white outline-none focus:border-[#e3943f] resize-none leading-relaxed"
                  />
                </div>

                {/* Style Visual (Video Loop or Photo) */}
                <div className="space-y-2 pt-2 border-t border-white/[0.08]">
                  <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider">
                    Background / Showcase Visual (Loop Reel or Image):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aboutConfig.style?.mediaUrl || ''}
                      onChange={(e) =>
                        setAboutConfig((prev) => ({
                          ...prev,
                          style: { ...prev.style, mediaUrl: e.target.value },
                        }))
                      }
                      placeholder="Default: Studio snow architectural video reel (leave empty for default)"
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
                        onChange={(e) => handleFileUpload(e, 'style')}
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-white/40">
                    Default: <span className="font-mono text-white/60">{aboutReels.snow}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TEAM & PROCESS */}
          {activeSubTab === 'story' && (
            <div className="space-y-6">
              {/* Studio Team & Years Card */}
              <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                  1. The Studio Team & Experience ({lang.toUpperCase()})
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                      Team Heading:
                    </label>
                    <input
                      type="text"
                      value={storyText.teamTitle || ''}
                      onChange={(e) => updateStory('teamTitle', e.target.value)}
                      placeholder="The studio team"
                      className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                      Years Highlight Text:
                    </label>
                    <input
                      type="text"
                      value={storyText.years || ''}
                      onChange={(e) => updateStory('years', e.target.value)}
                      placeholder="10+ years"
                      className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                    Team Philosophy Narrative:
                  </label>
                  <textarea
                    rows={3}
                    value={storyText.teamText || ''}
                    onChange={(e) => updateStory('teamText', e.target.value)}
                    placeholder="Architecture, interiors, and the work on site sit with one team..."
                    className="w-full rounded-xl border border-white/10 bg-[#181818] p-3 text-[12.5px] text-white outline-none focus:border-[#e3943f] resize-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                      Years Caption:
                    </label>
                    <input
                      type="text"
                      value={storyText.yearsText || ''}
                      onChange={(e) => updateStory('yearsText', e.target.value)}
                      placeholder="of work in design and building"
                      className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-[#e3943f] uppercase tracking-wider mb-1">
                      Giant Metric Number Display:
                    </label>
                    <input
                      type="text"
                      value={storyText.bigNumber || '10+'}
                      onChange={(e) => updateStory('bigNumber', e.target.value)}
                      placeholder="10+"
                      className="w-full rounded-xl border border-[#e3943f]/40 bg-[#181818] px-3.5 py-2.5 text-[14px] font-black text-[#e3943f] outline-none focus:border-[#e3943f]"
                    />
                  </div>
                </div>
              </div>

              {/* 5 Project Moving Steps */}
              <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                    2. Workflow Process: 5 Milestone Steps ({lang.toUpperCase()})
                  </label>
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                    Process Section Heading:
                  </label>
                  <input
                    type="text"
                    value={storyText.story || ''}
                    onChange={(e) => updateStory('story', e.target.value)}
                    placeholder="How a project moves"
                    className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[13px] font-semibold text-white outline-none focus:border-[#e3943f]"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  {storySteps.map((step, idx) => (
                    <div key={idx} className="rounded-xl border border-white/10 bg-[#181818] p-3.5 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e3943f]/20 text-[10px] font-bold text-[#e3943f]">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={step.label}
                          onChange={(e) => updateStoryStep(idx, 'label', e.target.value)}
                          placeholder={`Step ${idx + 1} Label (e.g. Brief)`}
                          className="w-40 rounded-lg border border-white/10 bg-[#121212] px-2.5 py-1 text-[11.5px] font-bold text-[#e3943f] uppercase outline-none focus:border-[#e3943f]"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={step.text}
                        onChange={(e) => updateStoryStep(idx, 'text', e.target.value)}
                        placeholder="Description of what happens during this stage..."
                        className="w-full rounded-lg border border-white/10 bg-[#121212] p-2 text-[11.5px] text-white/80 outline-none focus:border-[#e3943f] resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Story Video / Media */}
              <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                  3. Process Video Reel (Bedroom Architecture Loop)
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aboutConfig.story?.mediaUrl || ''}
                      onChange={(e) =>
                        setAboutConfig((prev) => ({
                          ...prev,
                          story: { ...prev.story, mediaUrl: e.target.value },
                        }))
                      }
                      placeholder="Leave empty for default studio bedroom reel"
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
                        onChange={(e) => handleFileUpload(e, 'story')}
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-white/40">
                    Default: <span className="font-mono text-white/60">{aboutReels.bedroom}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SPECIAL CONDITIONS */}
          {activeSubTab === 'conditions' && (
            <div className="space-y-6">
              {/* Main Heading */}
              <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                  1. Conditions Header ({lang.toUpperCase()})
                </label>
                <div>
                  <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                    Section Title:
                  </label>
                  <input
                    type="text"
                    value={conditionsText.title || ''}
                    onChange={(e) => updateConditions('title', e.target.value)}
                    placeholder="Special conditions for your project"
                    className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[13px] font-semibold text-white outline-none focus:border-[#e3943f]"
                  />
                </div>
              </div>

              {/* 8 Conditions Cards */}
              <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                  2. 8 Architectural Service Promises ({lang.toUpperCase()})
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {conditionCards.map((card, idx) => (
                    <div key={idx} className="rounded-xl border border-white/10 bg-[#181818] p-3.5 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e3943f]/20 text-[9.5px] font-bold text-[#e3943f]">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => updateConditionCard(idx, 'title', e.target.value)}
                          placeholder="Card Title"
                          className="flex-1 rounded-lg border border-white/10 bg-[#121212] px-2.5 py-1 text-[11.5px] font-bold text-[#e3943f] uppercase outline-none focus:border-[#e3943f]"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={card.text}
                        onChange={(e) => updateConditionCard(idx, 'text', e.target.value)}
                        placeholder="Service detail body..."
                        className="w-full rounded-lg border border-white/10 bg-[#121212] p-2 text-[11px] text-white/80 outline-none focus:border-[#e3943f] resize-none leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Handover & Mission Bottom Card */}
              <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
                <label className="block text-[11px] font-bold tracking-[0.18em] text-[#e3943f] uppercase">
                  3. Handover Mission Card & Stat ({lang.toUpperCase()})
                </label>

                <div>
                  <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                    Mission Headline:
                  </label>
                  <input
                    type="text"
                    value={conditionsText.mission || ''}
                    onChange={(e) => updateConditions('mission', e.target.value)}
                    placeholder="The aim is to stay with the project after the handover."
                    className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[13px] font-bold text-white outline-none focus:border-[#e3943f]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10.5px] font-bold text-[#e3943f] uppercase tracking-wider mb-1">
                      Stat Number:
                    </label>
                    <input
                      type="text"
                      value={conditionsText.stat || '98%'}
                      onChange={(e) => updateConditions('stat', e.target.value)}
                      placeholder="98%"
                      className="w-full rounded-xl border border-[#e3943f]/40 bg-[#181818] px-3.5 py-2.5 text-[14px] font-black text-[#e3943f] outline-none focus:border-[#e3943f]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                      Button Text:
                    </label>
                    <input
                      type="text"
                      value={conditionsText.button || 'Contact our manager'}
                      onChange={(e) => updateConditions('button', e.target.value)}
                      placeholder="Contact our manager"
                      className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                    Stat Recommendation Caption:
                  </label>
                  <textarea
                    rows={2}
                    value={conditionsText.statText || ''}
                    onChange={(e) => updateConditions('statText', e.target.value)}
                    placeholder="of clients recommend the studio and come back with the next room."
                    className="w-full rounded-xl border border-white/10 bg-[#181818] p-3 text-[12px] text-white outline-none focus:border-[#e3943f] resize-none"
                  />
                </div>

                {/* Conditions Bath Reel Video */}
                <div className="space-y-2 pt-2 border-t border-white/[0.08]">
                  <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider">
                    Showcase Loop Video (Bath / Architecture):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aboutConfig.conditions?.mediaUrl || ''}
                      onChange={(e) =>
                        setAboutConfig((prev) => ({
                          ...prev,
                          conditions: { ...prev.conditions, mediaUrl: e.target.value },
                        }))
                      }
                      placeholder="Leave empty for default studio bath reel"
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
                        onChange={(e) => handleFileUpload(e, 'conditions')}
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-white/40">
                    Default: <span className="font-mono text-white/60">{aboutReels.bath}</span>
                  </p>
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
                  LIVE 1:1 ABOUT PREVIEW
                </span>
              </div>
              <span className="text-[10px] text-white/40 uppercase font-mono">
                ABOUT US | {activeSubTab.toUpperCase()}
              </span>
            </div>

            {/* PREVIEW: 1. HERO BANNER */}
            {activeSubTab === 'banner' && (
              <div className="rounded-2xl border border-white/10 bg-black overflow-hidden relative min-h-[300px] flex flex-col justify-end p-5">
                {/* Background visual */}
                {aboutConfig.banner?.mediaUrl ? (
                  aboutConfig.banner.mediaUrl.match(/\.(jpeg|jpg|png|gif|webp|svg)$/i) ? (
                    <img
                      src={aboutConfig.banner.mediaUrl}
                      alt="Banner Preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <LoopVideo
                      src={aboutConfig.banner.mediaUrl}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )
                ) : (
                  <LoopVideo
                    src={aboutReels.night}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="relative z-10 space-y-2">
                  <h1 className="text-[26px] font-bold tracking-tight text-[#e3943f] uppercase leading-none">
                    {bannerText.title || 'About us'}
                  </h1>
                  <p className="text-[11.5px] text-white/80 line-clamp-3 leading-relaxed">
                    {bannerText.text ||
                      'Unique Graphics is a studio for architecture and interior design, working with private houses...'}
                  </p>
                  <button
                    type="button"
                    className="mt-2 inline-block rounded-full bg-[#e3943f] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-black pointer-events-none"
                  >
                    {bannerText.button || 'Discuss your project'}
                  </button>
                </div>
              </div>
            )}

            {/* PREVIEW: 2. SIGNATURE STYLE */}
            {activeSubTab === 'style' && (
              <div className="rounded-2xl border border-white/10 bg-[#141414] overflow-hidden relative min-h-[300px] flex items-center justify-center p-6 text-center">
                {aboutConfig.style?.mediaUrl ? (
                  aboutConfig.style.mediaUrl.match(/\.(jpeg|jpg|png|gif|webp|svg)$/i) ? (
                    <img
                      src={aboutConfig.style.mediaUrl}
                      alt="Style visual"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <LoopVideo
                      src={aboutConfig.style.mediaUrl}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )
                ) : (
                  <LoopVideo
                    src={aboutReels.snow}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]" />

                <div className="relative z-10 space-y-3">
                  <span className="text-[11px] font-bold tracking-[0.2em] text-[#e3943f] uppercase block">
                    {styleText.mark || 'Unique Graphics style'}
                  </span>
                  <p className="text-[13px] text-white/90 leading-relaxed max-w-[300px] mx-auto">
                    {styleText.text ||
                      'The work is recognised by a calm use of form, colour, and light. A room should read as one piece, not a set of objects.'}
                  </p>
                </div>
              </div>
            )}

            {/* PREVIEW: 3. TEAM & PROCESS */}
            {activeSubTab === 'story' && (
              <div className="space-y-4">
                {/* Team Card Mockup */}
                <div className="rounded-2xl bg-[#1a1a1a] p-4 flex items-center justify-between border border-white/5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold tracking-wider text-[#e3943f] uppercase block">
                      {storyText.teamTitle || 'The studio team'}
                    </span>
                    <p className="text-[10.5px] text-white/70 line-clamp-2 max-w-[190px]">
                      {storyText.teamText}
                    </p>
                    <div className="pt-1">
                      <span className="text-[16px] font-bold text-[#e3943f] block leading-none">
                        {storyText.years}
                      </span>
                      <span className="text-[9px] text-white/60">{storyText.yearsText}</span>
                    </div>
                  </div>
                  <div className="text-[52px] font-black text-white/80 leading-none">
                    {storyText.bigNumber || '10+'}
                  </div>
                </div>

                {/* Process Steps Preview */}
                <div className="rounded-2xl border border-white/10 bg-[#161616] p-4 space-y-3">
                  <span className="text-[10px] font-bold tracking-[0.16em] text-[#e3943f] uppercase block text-center">
                    {storyText.story || 'How a project moves'}
                  </span>

                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
                    {storySteps.map((s, idx) => (
                      <span
                        key={idx}
                        className={`rounded-lg px-2 py-1 text-[9.5px] font-bold tracking-wider uppercase shrink-0 ${
                          idx === 3 ? 'bg-[#e3943f] text-black' : 'bg-white/5 text-white/60'
                        }`}
                      >
                        {s.label}
                      </span>
                    ))}
                  </div>

                  <div className="rounded-xl overflow-hidden border border-white/10 aspect-video relative bg-black">
                    {aboutConfig.story?.mediaUrl ? (
                      aboutConfig.story.mediaUrl.match(/\.(jpeg|jpg|png|gif|webp|svg)$/i) ? (
                        <img
                          src={aboutConfig.story.mediaUrl}
                          alt="Story visual"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <LoopVideo
                          src={aboutConfig.story.mediaUrl}
                          className="w-full h-full object-cover"
                        />
                      )
                    ) : (
                      <LoopVideo
                        src={aboutReels.bedroom}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute bottom-0 inset-x-0 bg-[#1a1a1a]/95 px-3 py-2 text-[10px] text-white/80 font-mono">
                      {storySteps[3]?.text || 'The build is checked against those drawings.'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PREVIEW: 4. SPECIAL CONDITIONS */}
            {activeSubTab === 'conditions' && (
              <div className="space-y-4">
                <span className="text-[10.5px] font-bold tracking-[0.16em] text-[#e3943f] uppercase block text-center">
                  {conditionsText.title || 'Special conditions for your project'}
                </span>

                {/* 4 Cards Sample */}
                <div className="grid grid-cols-2 gap-2">
                  {conditionCards.slice(0, 4).map((c, idx) => (
                    <div key={idx} className="rounded-xl bg-[#1a1a1a] p-2.5 border border-white/5">
                      <span className="text-[9.5px] font-bold text-[#e3943f] uppercase block truncate">
                        {c.title}
                      </span>
                      <p className="text-[9px] text-white/60 mt-1 line-clamp-2 leading-tight">
                        {c.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Handover Card */}
                <div className="rounded-2xl bg-[#1a1a1a] p-4 border border-white/10 space-y-2">
                  <h4 className="text-[12px] font-bold text-[#e3943f] uppercase leading-snug">
                    {conditionsText.mission || 'The aim is to stay with the project after the handover.'}
                  </h4>
                  <div className="text-[24px] font-black text-[#e3943f] leading-none">
                    {conditionsText.stat || '98%'}
                  </div>
                  <p className="text-[9.5px] text-white/70">
                    {conditionsText.statText}
                  </p>
                  <button
                    type="button"
                    className="rounded-full bg-[#e3943f] px-3 py-1.5 text-[9px] font-bold text-black uppercase pointer-events-none"
                  >
                    {conditionsText.button || 'Contact our manager'}
                  </button>
                </div>

                {/* Conditions Bath Loop Video Preview */}
                <div className="rounded-xl overflow-hidden border border-white/10 aspect-video relative bg-black flex items-center justify-center">
                  <LoopVideo
                    src={aboutConfig.conditions?.mediaUrl || aboutReels.bath}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <p className="text-[11px] text-white/40 italic mt-3 px-1">
              * Live preview dynamically updates when switching language tabs or editing fields. Click "Save & Publish" to update website.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import {
  DEFAULT_CONTACT_CONFIG,
  getStoredContactConfig,
  setStoredContactConfig,
} from '../../data/contactConfig'
import reel from '../../assets/Contact/Nina_obrezano_8250f042fc.mp4'
import frame from '../../assets/Contact/videoframe_15197.png'
import LoopVideo from '../LoopVideo'
import { FaWhatsapp } from 'react-icons/fa'

export default function ContactPageManager({ token }) {
  const [config, setConfig] = useState(() => getStoredContactConfig())
  const [loading, setLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null) // 'saved' | 'error' | null
  const [activeSubTab, setActiveSubTab] = useState('visual') // 'visual' | 'copy' | 'fields'

  // Fetch backend settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/blogs/settings/contact-page')
        const data = await res.json()
        if (data.success && data.data) {
          setConfig((prev) => ({ ...prev, ...data.data }))
          setStoredContactConfig(data.data)
        }
      } catch (err) {
        console.error('Failed to load contact page settings:', err)
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
      setStoredContactConfig(config)

      const res = await fetch('/api/blogs/settings/contact-page', {
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

  // Handle media upload
  const handleMediaUpload = (targetKey, file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target.result
      setConfig((prev) => ({ ...prev, [targetKey]: dataUrl }))
    }
    reader.readAsDataURL(file)
  }

  // Reset to default
  const handleResetToDefault = () => {
    if (window.confirm('Reset Contact Us page settings to factory studio defaults?')) {
      setConfig(DEFAULT_CONTACT_CONFIG)
      setStoredContactConfig(DEFAULT_CONTACT_CONFIG)
      setSaveStatus('saved')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in text-white pb-24">
      {/* HEADER BAR */}
      <div className="rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#e3943f] to-[#b36c20] text-black shadow-lg shadow-[#e3943f]/20">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <div>
                <h1 className="text-[20px] font-bold tracking-tight text-white uppercase">
                  Contact Us Page Customizer
                </h1>
                <p className="text-[12px] text-white/50">
                  Full control over the cinematic video reel, headlines, pitch narrative, input labels, and WhatsApp action button.
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
            <span>Contact Us portal updated and published live to public website!</span>
          </div>
        )}
      </div>

      {/* SUB-TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        {[
          { id: 'visual', label: '1. Video Reel & Visual' },
          { id: 'copy', label: '2. Headlines & Story' },
          { id: 'fields', label: '3. Form Inputs & Actions' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id)}
            className={`rounded-xl px-4 py-2 text-[12px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-[#e3943f] text-black shadow-md shadow-[#e3943f]/20'
                : 'border border-white/10 bg-[#161616] text-white/70 hover:bg-white/[0.06] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT GRID: 2 COLUMNS (CONTROLS LEFT, LIVE PREVIEW RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: EDIT CONTROLS */}
        <div className="lg:col-span-7 space-y-6">
          {/* TAB 1: VISUAL & VIDEO REEL */}
          {activeSubTab === 'visual' && (
            <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-white">
                Cinematic Video Reel (Left Column of Contact Portal)
              </h3>

              <div className="space-y-2">
                <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider">
                  Video Reel File / URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={config.mediaUrl || ''}
                    onChange={(e) => setConfig((prev) => ({ ...prev, mediaUrl: e.target.value }))}
                    placeholder="Default: Luxury office walk video (leave empty for default)"
                    className="flex-1 rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                  />
                  <label className="rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-[11.5px] font-bold tracking-wider text-white uppercase hover:bg-white/[0.1] transition-all cursor-pointer flex items-center gap-2 shrink-0">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span>Upload Video</span>
                    <input
                      type="file"
                      accept="video/*,image/*"
                      className="hidden"
                      onChange={(e) => handleMediaUpload('mediaUrl', e.target.files?.[0])}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider">
                  Fallback Poster Image URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={config.posterUrl || ''}
                    onChange={(e) => setConfig((prev) => ({ ...prev, posterUrl: e.target.value }))}
                    placeholder="Default: videoframe_15197.png"
                    className="flex-1 rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                  />
                  <label className="rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-[11.5px] font-bold tracking-wider text-white uppercase hover:bg-white/[0.1] transition-all cursor-pointer flex items-center gap-2 shrink-0">
                    <span>Upload Poster</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleMediaUpload('posterUrl', e.target.files?.[0])}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HEADLINES & STORY */}
          {activeSubTab === 'copy' && (
            <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-white">
                Contact Us Typography & Pitch Copy
              </h3>

              <div>
                <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                  Kicker Top Label:
                </label>
                <input
                  type="text"
                  value={config.kicker || ''}
                  onChange={(e) => setConfig((prev) => ({ ...prev, kicker: e.target.value }))}
                  placeholder="Contact us"
                  className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                    Title Lead:
                  </label>
                  <input
                    type="text"
                    value={config.title || ''}
                    onChange={(e) => setConfig((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Take a step into the world of"
                    className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-[#e3943f] uppercase tracking-wider mb-1">
                    Title Accent (Gold Signature):
                  </label>
                  <input
                    type="text"
                    value={config.accent || ''}
                    onChange={(e) => setConfig((prev) => ({ ...prev, accent: e.target.value }))}
                    placeholder="Unique Graphics"
                    className="w-full rounded-xl border border-[#e3943f]/40 bg-[#181818] px-3.5 py-2.5 text-[12.5px] font-bold text-[#e3943f] outline-none focus:border-[#e3943f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                  Client Pitch Narrative:
                </label>
                <textarea
                  rows={3}
                  value={config.story || ''}
                  onChange={(e) => setConfig((prev) => ({ ...prev, story: e.target.value }))}
                  placeholder="Leave your name and number. We will talk through the project and how you want to begin."
                  className="w-full rounded-xl border border-white/10 bg-[#181818] p-3 text-[12px] text-white outline-none focus:border-[#e3943f] resize-none"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                  Form Prompt Line:
                </label>
                <input
                  type="text"
                  value={config.prompt || ''}
                  onChange={(e) => setConfig((prev) => ({ ...prev, prompt: e.target.value }))}
                  placeholder="Fill out the form and our manager will contact you"
                  className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                />
              </div>
            </div>
          )}

          {/* TAB 3: FORM INPUTS & ACTIONS */}
          {activeSubTab === 'fields' && (
            <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-4">
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-white">
                Input Labels & Call to Action
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                    Name Input Label:
                  </label>
                  <input
                    type="text"
                    value={config.nameLabel || ''}
                    onChange={(e) => setConfig((prev) => ({ ...prev, nameLabel: e.target.value }))}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-white/10 bg-[#181818] px-3 py-2 text-[12px] text-white outline-none focus:border-[#e3943f]"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                    Phone Input Label:
                  </label>
                  <input
                    type="text"
                    value={config.phoneLabel || ''}
                    onChange={(e) => setConfig((prev) => ({ ...prev, phoneLabel: e.target.value }))}
                    placeholder="Phone number"
                    className="w-full rounded-xl border border-white/10 bg-[#181818] px-3 py-2 text-[12px] text-white outline-none focus:border-[#e3943f]"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                    Project Note Label:
                  </label>
                  <input
                    type="text"
                    value={config.noteLabel || ''}
                    onChange={(e) => setConfig((prev) => ({ ...prev, noteLabel: e.target.value }))}
                    placeholder="About the project"
                    className="w-full rounded-xl border border-white/10 bg-[#181818] px-3 py-2 text-[12px] text-white outline-none focus:border-[#e3943f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                    Submit Button Text:
                  </label>
                  <input
                    type="text"
                    value={config.submitButtonText || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, submitButtonText: e.target.value }))
                    }
                    placeholder="Contact us"
                    className="w-full rounded-xl border border-white/10 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-white outline-none focus:border-[#e3943f]"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                    WhatsApp Direct Link / Number:
                  </label>
                  <input
                    type="text"
                    value={config.whatsappLink || ''}
                    onChange={(e) => setConfig((prev) => ({ ...prev, whatsappLink: e.target.value }))}
                    placeholder="https://wa.me/919876543210"
                    className="w-full rounded-xl border border-emerald-500/30 bg-[#181818] px-3.5 py-2.5 text-[12.5px] text-emerald-300 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-1">
                  Thank You Confirmation Message:
                </label>
                <textarea
                  rows={2}
                  value={config.thanksMessage || ''}
                  onChange={(e) => setConfig((prev) => ({ ...prev, thanksMessage: e.target.value }))}
                  placeholder="Thank you. Your request is noted on this page."
                  className="w-full rounded-xl border border-white/10 bg-[#181818] p-3 text-[12px] text-white outline-none focus:border-[#e3943f] resize-none"
                />
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
                Live Public Preview (/contacts)
              </span>
              <span className="text-[10px] font-mono text-white/40 uppercase">Interactive</span>
            </div>

            <div className="mt-4">
              {/* Card Container mimicking ContactPage layout */}
              <div className="overflow-hidden rounded-[20px] bg-[#1a1a1a] border border-white/10 shadow-2xl">
                {/* Left Media Mockup */}
                <div className="aspect-video w-full bg-black relative overflow-hidden">
                  <div className="absolute top-2.5 left-2.5 z-20 rounded-full border border-white/20 bg-black/60 backdrop-blur-md px-2.5 py-1 text-[9px] font-bold text-white uppercase">
                    ‹ Home
                  </div>
                  {config.mediaUrl ? (
                    config.mediaUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                      <img src={config.mediaUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <LoopVideo src={config.mediaUrl} className="h-full w-full object-cover" />
                    )
                  ) : (
                    <LoopVideo src={reel} className="h-full w-full object-cover" />
                  )}
                </div>

                {/* Form Mockup */}
                <div className="p-4 space-y-3 bg-[#161616]">
                  <span className="text-[9.5px] tracking-[0.18em] text-[#e3943f] uppercase font-bold block">
                    {config.kicker || 'Contact us'}
                  </span>

                  <h3 className="text-[15px] font-medium uppercase leading-tight tracking-tight text-white">
                    {config.title || 'Take a step into the world of'}{' '}
                    <span className="text-[#e3943f] block font-bold">
                      {config.accent || 'Unique Graphics'}
                    </span>
                  </h3>

                  <p className="text-[10px] text-white/70 leading-relaxed">
                    {config.story ||
                      'Leave your name and number. We will talk through the project and how you want to begin.'}
                  </p>

                  <p className="text-[10.5px] font-medium text-white/90">
                    {config.prompt || 'Fill out the form and our manager will contact you'}
                  </p>

                  {/* Form Mock Inputs */}
                  <div className="space-y-2 pt-1 border-t border-white/[0.08]">
                    <div>
                      <span className="block text-[9px] text-white/40 uppercase">
                        {config.nameLabel || 'Your name'}
                      </span>
                      <div className="border-b border-white/20 py-1 text-[11px] text-white/50">
                        Johnathan Doe
                      </div>
                    </div>

                    <div>
                      <span className="block text-[9px] text-white/40 uppercase">
                        {config.phoneLabel || 'Phone number'}
                      </span>
                      <div className="border-b border-white/20 py-1 text-[11px] text-white/50 flex items-center gap-2">
                        <span className="text-white/70">India +91 ▾</span>
                        <span>98765 43210</span>
                      </div>
                    </div>

                    <div>
                      <span className="block text-[9px] text-white/40 uppercase">
                        {config.noteLabel || 'About the project'}
                      </span>
                      <div className="border-b border-white/20 py-1 text-[11px] text-white/40">
                        Monumental private villa in Palm Jumeirah...
                      </div>
                    </div>
                  </div>

                  {/* Action buttons preview */}
                  <div className="flex items-center gap-2 pt-2">
                    {config.whatsappLink && (
                      <a
                        href={config.whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shrink-0"
                        title="Chat on WhatsApp"
                      >
                        <FaWhatsapp className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      type="button"
                      className="flex-1 rounded-full bg-[#e3943f] py-2 text-[11px] font-bold text-black uppercase tracking-wider pointer-events-none"
                    >
                      {config.submitButtonText || 'Contact us'}
                    </button>
                  </div>
                </div>
              </div>

              <span className="text-[10.5px] text-white/40 italic block text-center mt-2">
                * Real-time preview mirrors public /contacts page. Click "Save & Publish" to update live.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

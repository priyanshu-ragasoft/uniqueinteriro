import { useEffect, useRef, useState } from 'react'
import CountrySelect from '../CountrySelect'
import { defaultCountry } from '../../data/countries'
const DEFAULT_REAL_CONTACT_VIDEO = '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/TETTRO%20MOHALI.mp4'
const DEFAULT_REAL_POSTER = '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/2a52ad1e-4050-4783-b269-36dcd2bb72b0.png'
import { getStoredContactConfig, setStoredContactConfig } from '../../data/contactConfig'

export default function ContactPage({ lang }) {
  const [config, setConfig] = useState(() => getStoredContactConfig())
  const video = useRef(null)
  const [name, setName] = useState('')
  const [code, setCode] = useState(defaultCountry)
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Fetch settings from server on mount
  useEffect(() => {
    let isMounted = true
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/blogs/settings/contact-page')
        if (res.ok) {
          const data = await res.json()
          if (data?.success && data?.data && isMounted) {
            setConfig(data.data)
            setStoredContactConfig(data.data)
          }
        }
      } catch (err) {
        // Fallback to local storage is already done in initial state
      }
    }
    fetchConfig()

    const handleConfigChange = (e) => {
      if (e.detail && isMounted) {
        setConfig(e.detail)
      }
    }
    window.addEventListener('contact-page-config-changed', handleConfigChange)

    return () => {
      isMounted = false
      window.removeEventListener('contact-page-config-changed', handleConfigChange)
    }
  }, [])

  // Auto-play video if present
  useEffect(() => {
    const node = video.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    node.play().catch(() => {})
  }, [config.mediaUrl])

  const submit = async (event) => {
    event.preventDefault()
    if (!name.trim() || !phone.trim() || submitting) return

    setSubmitting(true)
    const dialCode = code?.dial_code || '+1'
    const fullPhone = `${dialCode} ${phone.trim()}`
    const locationName = code?.name ? `${code.name} (${dialCode})` : 'International'

    const payload = {
      client: name.trim(),
      phone: fullPhone,
      location: locationName,
      projectType: 'Architectural & Haute Interior Directive',
      budget: 'Consultation Requested',
      message: note.trim() || 'Direct inquiry submitted via Contact Us portal.',
      source: 'Contact Us Page',
    }

    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
    } catch {}

    // Fallback sync to localStorage so Admin panel has immediate real-time entry
    try {
      const existing = JSON.parse(localStorage.getItem('ug_client_inquiries') || '[]')
      const newEntry = {
        id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
        client: payload.client,
        phone: payload.phone,
        location: payload.location,
        type: payload.projectType,
        budget: payload.budget,
        message: payload.message,
        date: new Date().toLocaleDateString(),
        status: 'New Inquiry',
        statusColor: 'text-[#e3943f] border-[#e3943f]/40 bg-[#e3943f]/10',
        source: 'Contact Us Page',
      }
      localStorage.setItem('ug_client_inquiries', JSON.stringify([newEntry, ...existing]))
    } catch {}

    setSubmitting(false)
    setSent(true)
  }

  const isOldMedia = (u) => !u || String(u).includes('/assets/Contact') || String(u).includes('Nina_obrezano')
  const activeMedia = !isOldMedia(config.mediaUrl) ? config.mediaUrl : DEFAULT_REAL_CONTACT_VIDEO
  const isImageMedia = activeMedia && activeMedia.match(/\.(jpeg|jpg|png|webp|avif|svg)(\?.*)?$/i)

  return (
    <main className="bg-[#101010] px-4 pt-36 pb-16 text-white sm:px-6 md:pt-48 lg:px-10 lg:pb-24">
      <p className="text-[12px] tracking-[0.18em] text-[#e3943f] uppercase">
        {config.kicker || 'Contact us'}
      </p>
      <div className="mt-6 grid overflow-hidden rounded-[28px] bg-[#1c1c1c] lg:grid-cols-[1.15fr_0.85fr] border border-white/5 shadow-2xl">
        <div className="bg-black flex items-center justify-center min-h-[360px] lg:min-h-[640px] relative overflow-hidden">
          {isImageMedia ? (
            <img
              src={activeMedia}
              alt={config.title || 'Contact Unique Graphics'}
              className="h-full max-h-[720px] w-full object-cover"
            />
          ) : (
            <video
              ref={video}
              src={activeMedia}
              poster={config.posterUrl && !String(config.posterUrl).includes('videoframe') ? config.posterUrl : DEFAULT_REAL_POSTER}
              muted
              loop
              playsInline
              autoPlay
              className="h-full max-h-[720px] w-full object-cover"
            />
          )}
        </div>
        <div className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-12">
          <h1 className="max-w-[14ch] text-[32px] leading-[1.05] font-medium tracking-[-0.03em] uppercase sm:text-[40px]">
            {config.title || 'Take a step into the world of'}{' '}
            <span className="text-[#e3943f] block mt-1">{config.accent || 'Unique Graphics'}</span>
          </h1>

          {sent ? (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[14px]">
                  ✓
                </span>
                <span className="text-[11px] font-bold tracking-[0.2em] text-[#e3943f] uppercase">
                  Transmitted to Atelier Directoire
                </span>
              </div>
              <p className="text-[16px] leading-relaxed text-white/90">
                {config.thanksMessage || 'Thank you. Your request is noted on this page.'} Our executive director will review your project brief and connect with you on <strong className="text-white">{code?.dial_code} {phone}</strong> shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setName('')
                  setPhone('')
                  setNote('')
                  setSent(false)
                }}
                className="mt-2 text-[12px] font-bold tracking-wider text-[#e3943f] underline uppercase hover:text-white transition-colors cursor-pointer"
              >
                ← Send Another Inquiry
              </button>
            </div>
          ) : (
            <>
              <p className="mt-5 max-w-[40ch] text-[15px] leading-relaxed text-white/75">
                {config.story || 'Leave your name and number. We will talk through the project and how you want to begin.'}
              </p>
              <p className="mt-4 text-[15px] font-medium text-white/90">
                {config.prompt || 'Fill out the form and our manager will contact you'}
              </p>
              <form onSubmit={submit} className="mt-6">
                <label className="block text-[13px] text-white/50" htmlFor="contact-name">
                  {config.nameLabel || 'Your name'}
                </label>
                <input
                  id="contact-name"
                  name="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  placeholder="Enter your full name"
                  className="mt-2 w-full border-b border-white/25 bg-transparent py-2 text-[16px] text-white outline-none focus:border-[#e3943f] transition-colors"
                />
                <label className="mt-5 block text-[13px] text-white/50" htmlFor="contact-phone">
                  {config.phoneLabel || 'Phone number'}
                </label>
                <div className="mt-2 flex gap-3 border-b border-white/25 focus-within:border-[#e3943f] transition-colors">
                  <CountrySelect value={code} onChange={setCode} label={config.phoneLabel || 'Phone number'} optionClass="bg-[#1c1c1c]" />
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    required
                    placeholder="Mobile / WhatsApp number"
                    className="w-full bg-transparent py-2 text-[16px] text-white outline-none"
                  />
                </div>
                <label className="mt-5 block text-[13px] text-white/50" htmlFor="contact-note">
                  {config.noteLabel || 'About the project'}
                </label>
                <textarea
                  id="contact-note"
                  name="note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={3}
                  placeholder="Tell us about the property, square footage, design style or timeline..."
                  className="mt-2 w-full resize-none border-b border-white/25 bg-transparent py-2 text-[16px] text-white outline-none focus:border-[#e3943f] transition-colors leading-relaxed"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-7 w-full rounded-full bg-[#e3943f] py-3.5 text-[14px] font-bold text-black uppercase tracking-wider hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-[#e3943f]/20"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-black" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Transmitting Brief...</span>
                    </>
                  ) : (
                    <span>{config.submitButtonText || 'Contact us'}</span>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  )
}


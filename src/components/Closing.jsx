import { useState, useEffect } from 'react'

export const DEFAULT_CLOSING_CONFIG = {
  logoUrl: '/closing_logo.png',
  showLogo: true,
  en: {
    mark: 'Unique Graphics',
    title: 'Built around the way you live.',
    text: 'Plans, rooms, and the work on site. One studio from the first sketch to the last fitting.',
  },
  ru: {
    mark: 'Unique Graphics',
    title: 'Собрано вокруг того, как вы живёте.',
    text: 'Планы, комнаты и работа на площадке. Одна студия от первого эскиза до последней примерки.',
  },
}

export default function Closing({ lang }) {
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('ug_brand_sections_config')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.closing) return { ...DEFAULT_CLOSING_CONFIG, ...parsed.closing }
      }
    } catch {}
    return DEFAULT_CLOSING_CONFIG
  })

  // Sync with MongoDB backend setting
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/blogs/settings/brand-sections')
        const data = await res.json()
        if (data.success && data.data?.closing) {
          const merged = { ...DEFAULT_CLOSING_CONFIG, ...data.data.closing }
          setConfig(merged)
          const saved = localStorage.getItem('ug_brand_sections_config')
          const full = saved ? JSON.parse(saved) : {}
          localStorage.setItem('ug_brand_sections_config', JSON.stringify({ ...full, closing: merged }))
        }
      } catch {}
    }
    fetchConfig()

    const onBrandUpdate = () => {
      try {
        const saved = localStorage.getItem('ug_brand_sections_config')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.closing) setConfig({ ...DEFAULT_CLOSING_CONFIG, ...parsed.closing })
        }
      } catch {}
    }

    window.addEventListener('ug_brand_updated', onBrandUpdate)
    window.addEventListener('storage', onBrandUpdate)
    return () => {
      window.removeEventListener('ug_brand_updated', onBrandUpdate)
      window.removeEventListener('storage', onBrandUpdate)
    }
  }, [])

  const text = config[lang] ?? config.en ?? DEFAULT_CLOSING_CONFIG[lang] ?? DEFAULT_CLOSING_CONFIG.en
  const logoUrl = config?.logoUrl || DEFAULT_CLOSING_CONFIG.logoUrl || '/closing_logo.png'
  const showLogo = config?.showLogo !== undefined ? config.showLogo : true

  return (
    <section className="relative overflow-hidden bg-[#101010] px-5 py-24 text-white sm:px-10 lg:px-16 lg:py-32">
      {/* Subtle luxury ambient backlight / radial glow */}
      <div className="pointer-events-none absolute -right-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-gradient-to-br from-[#e3943f]/15 via-[#e3943f]/5 to-transparent blur-3xl opacity-60" />

      <div className="relative z-10 mx-auto max-w-[1240px] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-16">
        {/* Left Column: Typography */}
        <div className="flex-1 max-w-[640px]">
          <p className="text-[12px] tracking-[0.22em] text-[#e3943f] uppercase font-semibold">{text.mark}</p>
          <h2 className="mt-6 max-w-[12ch] text-[46px] leading-[0.95] font-medium tracking-[-0.03em] sm:text-[68px] lg:text-[74px]">
            {text.title}
          </h2>
          <p className="mt-8 max-w-[38ch] text-[18px] leading-relaxed text-white/70">{text.text}</p>
        </div>

        {/* Right Column: Studio 3D Emblem Showcase ("bagal me") */}
        {showLogo && logoUrl && (
          <div className="flex flex-1 items-center justify-center lg:justify-end">
            <div className="relative group">
              {/* Luxury ambient glow behind emblem */}
              <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-tr from-[#e3943f]/20 via-amber-500/10 to-transparent blur-2xl opacity-60 transition-opacity duration-700 group-hover:opacity-100" />
              <img
                src={logoUrl}
                alt="Unique Graphics Studio Emblem"
                className="relative z-10 w-full max-w-[280px] sm:max-w-[340px] md:max-w-[390px] lg:max-w-[440px] object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.9)] filter transition-all duration-500 hover:scale-[1.03] select-none"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

import { useState, useEffect } from 'react'

export const DEFAULT_CLIENTS_CONFIG = {
  en: {
    before: 'We are chosen by those ',
    accent: 'who strive for excellence',
    after: ' — among our clients:',
  },
  ru: {
    before: 'Нас выбирают те, ',
    accent: 'кто стремится к совершенству',
    after: ' — среди наших клиентов:',
  },
  brands: [
    { type: 'text', name: 'MR GROUP', bold: true },
    { type: 'hilton', name: 'Hilton', sub: 'HOTELS & RESORTS' },
    { type: 'jacob', name: '&Co', sub: 'JACOB & CO' },
    { type: 'badge', name: 'ENGEC' },
    { type: 'italic', name: 'DAMAC' },
    { type: 'mandarin', name: 'MANDARIN ORIENTAL', sub: 'THE HOTEL GROUP' },
    { type: 'euro', name: 'ЕВРОСТРОЙ' },
  ],
}

function RenderBrand({ brand }) {
  if (typeof brand === 'string') {
    return <span className="shrink-0 text-[24px] font-bold tracking-wider">{brand}</span>
  }
  if (brand.type === 'hilton') {
    return (
      <span className="flex shrink-0 items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white text-[16px]">H</span>
        <span>
          <span className="block font-serif text-[18px] leading-none">{brand.name || 'Hilton'}</span>
          <span className="mt-1 block text-[9px] tracking-[0.14em]">{brand.sub || 'HOTELS & RESORTS'}</span>
        </span>
      </span>
    )
  }
  if (brand.type === 'jacob') {
    return (
      <span className="shrink-0 text-center">
        <span className="block font-serif text-[28px] leading-none">{brand.name || '&Co'}</span>
        <span className="mt-1 block text-[9px] tracking-[0.16em]">{brand.sub || 'JACOB & CO'}</span>
      </span>
    )
  }
  if (brand.type === 'badge') {
    return (
      <span className="flex h-11 shrink-0 items-center rounded-full border border-white px-5 text-[16px] font-bold tracking-[0.18em]">
        {brand.name || 'ENGEC'}
      </span>
    )
  }
  if (brand.type === 'italic') {
    return (
      <span className="shrink-0 font-serif text-[28px] italic font-bold">
        {brand.name || 'DAMAC'}
      </span>
    )
  }
  if (brand.type === 'mandarin') {
    return (
      <span className="flex shrink-0 items-center gap-2">
        <span className="text-[22px] leading-none">⌒</span>
        <span>
          <span className="block text-[11px] tracking-[0.14em]">{brand.name || 'MANDARIN ORIENTAL'}</span>
          <span className="mt-1 block text-[9px] tracking-[0.12em]">{brand.sub || 'THE HOTEL GROUP'}</span>
        </span>
      </span>
    )
  }
  if (brand.type === 'euro') {
    return (
      <span className="flex shrink-0 items-center gap-2 text-[20px] font-bold">
        <span className="text-[18px] leading-none">≡</span>
        {brand.name || 'ЕВРОСТРОЙ'}
      </span>
    )
  }
  return <span className="shrink-0 text-[24px] font-bold tracking-wider">{brand.name}</span>
}

export default function Clients({ lang = 'en' }) {
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('ug_brand_sections_config')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.clients) return parsed.clients
      }
    } catch {}
    return DEFAULT_CLIENTS_CONFIG
  })

  // Sync with MongoDB backend setting
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/blogs/settings/brand-sections')
        const data = await res.json()
        if (data.success && data.data?.clients) {
          setConfig(data.data.clients)
          const saved = localStorage.getItem('ug_brand_sections_config')
          const full = saved ? JSON.parse(saved) : {}
          localStorage.setItem('ug_brand_sections_config', JSON.stringify({ ...full, clients: data.data.clients }))
        }
      } catch {}
    }

    fetchConfig()

    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('ug_brand_sections_config')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.clients) setConfig(parsed.clients)
        }
      } catch {}
    }

    window.addEventListener('ug_brand_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('ug_brand_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  const currentLang = lang === 'ru' ? 'ru' : 'en'
  const text = config?.[currentLang] || DEFAULT_CLIENTS_CONFIG[currentLang]
  const brandsList = (Array.isArray(config?.brands) && config.brands.length > 0)
    ? config.brands
    : DEFAULT_CLIENTS_CONFIG.brands

  return (
    <section className="w-full overflow-hidden bg-[#141414] py-10 text-white">
      <h2 className="px-4 text-center text-[16px] leading-snug font-medium tracking-[0.04em] uppercase sm:text-[22px]">
        {text.before || DEFAULT_CLIENTS_CONFIG.en.before}
        <span className="text-[#e3943f]">{text.accent || DEFAULT_CLIENTS_CONFIG.en.accent}</span>
        {text.after || DEFAULT_CLIENTS_CONFIG.en.after}
      </h2>
      <div className="no-scrollbar mt-8 w-full overflow-hidden">
        <div className="logo-run flex w-max items-center gap-16">
          {brandsList.map((brand, i) => (
            <RenderBrand key={`b1-${i}`} brand={brand} />
          ))}
          {brandsList.map((brand, i) => (
            <RenderBrand key={`b2-${i}`} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  )
}

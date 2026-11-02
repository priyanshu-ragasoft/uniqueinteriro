import { useState, useEffect } from 'react'

export const DEFAULT_CLIENTS_CONFIG = {
  en: {
    before: 'We are chosen by those ',
    accent: 'who strive for excellence',
    after: ' — among our clients:',
  },
  brands: [
    { type: 'text', name: 'MR GROUP', bold: true },
    { type: 'hilton', name: 'Hilton', sub: 'HOTELS & RESORTS' },
    { type: 'jacob', name: '&Co', sub: 'JACOB & CO' },
    { type: 'badge', name: 'ENGEC' },
    { type: 'italic', name: 'DAMAC' },
    { type: 'mandarin', name: 'MANDARIN ORIENTAL', sub: 'THE HOTEL GROUP' },
    { type: 'euro', name: 'EUROSTROY' },
  ],
}

export function RenderBrand({ brand }) {
  if (!brand) return null
  if (typeof brand === 'string') {
    return <span className="shrink-0 text-[24px] font-bold tracking-wider">{brand}</span>
  }
  if (brand.image || brand.logo || brand.type === 'image') {
    const src = brand.image || brand.logo
    return (
      <img
        src={src}
        alt={brand.name || 'Brand Logo'}
        className="h-8 max-h-9 w-auto max-w-[150px] object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity shrink-0"
      />
    )
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
    const brandName = (!brand.name || brand.name === '\u0415\u0412\u0420\u041E\u0421\u0422\u0420\u041E\u0419') ? 'EUROSTROY' : brand.name
    return (
      <span className="flex shrink-0 items-center gap-2 text-[20px] font-bold">
        <span className="text-[18px] leading-none">≡</span>
        {brandName}
      </span>
    )
  }
  return <span className="shrink-0 text-[24px] font-bold tracking-wider">{brand.name}</span>
}

export default function Clients({ lang = 'en', runnerOnly = false, className = '' }) {
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
        const res = await fetch('/api/blogs/settings/brand-sections')
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

  const text = config?.en || DEFAULT_CLIENTS_CONFIG.en
  const rawBrands = (Array.isArray(config?.brands) && config.brands.length > 0)
    ? config.brands
    : DEFAULT_CLIENTS_CONFIG.brands
  const brandsList = rawBrands.map((b) => {
    if (!b) return b
    if (typeof b === 'string') return b === '\u0415\u0412\u0420\u041E\u0421\u0422\u0420\u041E\u0419' ? 'EUROSTROY' : b
    if (b.name === '\u0415\u0412\u0420\u041E\u0421\u0422\u0420\u041E\u0419') return { ...b, name: 'EUROSTROY' }
    return b
  })

  return (
    <section className={`w-full overflow-hidden bg-[#141414] py-10 text-white ${className}`}>
      {runnerOnly ? null : (
        <h2 className="px-4 text-center text-[16px] leading-snug font-medium tracking-[0.04em] uppercase sm:text-[22px]">
          {text.before || DEFAULT_CLIENTS_CONFIG.en.before}
          <span className="text-[#e3943f]">{text.accent || DEFAULT_CLIENTS_CONFIG.en.accent}</span>
          {text.after || DEFAULT_CLIENTS_CONFIG.en.after}
        </h2>
      )}
      <div className={`no-scrollbar w-full overflow-hidden ${runnerOnly ? '' : 'mt-8'}`}>
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

import { useEffect, useState } from 'react'
import CountrySelect from './CountrySelect'
import { defaultCountry } from '../data/countries'
import LoopVideo from './LoopVideo'
import { projects } from '../data/projects'

export const DEFAULT_DISCOVER_CONFIG = {
  en: {
    line: 'Discover the',
    accent: 'Unique Graphics style',
    text: 'We construct houses and design interiors in our signature style, thoughtfully tailored to your lifestyle scenarios',
    percent: '98%',
    recommend: 'of our customers recommend us',
    button: 'Contact a manager',
    close: 'Close',
    step: 'Step into',
    world: 'the world of',
    brand: 'Unique Graphics',
    story:
      'A place where your dreams take shape through the unique vision of our studio. We look forward to embarking on this inspiring journey with you and bringing your project to life.',
    prompt: 'Fill out the form and our manager will contact you',
    name: 'Your name',
    phone: 'Phone number',
    submit: "Request a manager's consultation",
    thanks: 'Thank you. Your request is noted on this page.',
  },
  ru: {
    line: 'Откройте',
    accent: 'стиль Unique Graphics',
    text: 'Мы строим дома и делаем интерьеры в своём стиле, собранном под ваш образ жизни',
    percent: '98%',
    recommend: 'клиентов рекомендуют нас',
    button: 'Связаться с менеджером',
    close: 'Закрыть',
    step: 'Шагните',
    world: 'в мир',
    brand: 'Unique Graphics',
    story:
      'Место, где замысел обретает форму в видении студии. Мы готовы пройти этот путь вместе и довести проект до реализации.',
    prompt: 'Заполните форму, и менеджер свяжется с вами',
    name: 'Ваше имя',
    phone: 'Телефон',
    submit: 'Запросить консультацию менеджера',
    thanks: 'Спасибо. Заявка отмечена на этой странице.',
  },
  mediaUrl: '',
}

export const consultCopy = {
  en: DEFAULT_DISCOVER_CONFIG.en,
  ru: DEFAULT_DISCOVER_CONFIG.ru,
}

export function ConsultModal({ text, onClose }) {
  const [name, setName] = useState('')
  const [code, setCode] = useState(defaultCountry)
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const submit = (event) => {
    event.preventDefault()
    if (!name.trim() || !phone.trim()) return
    setSent(true)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="consult-title"
        className="w-full max-w-[440px] overflow-hidden rounded-[22px] bg-[#2a2a2a] px-7 py-6 text-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-end">
          <button type="button" onClick={onClose} aria-label={text.close || 'Close'} className="text-[20px] leading-none text-white/70">
            ×
          </button>
        </div>
        <h3 id="consult-title" className="max-w-[16ch] text-[28px] leading-[1.05] font-medium tracking-[-0.02em] uppercase">
          {text.step || 'Step into'} <span className="text-[#e3943f]">{text.world || 'the world of'}</span> {text.brand || 'Unique Graphics'}
        </h3>
        {sent ? (
          <p className="mt-6 text-[16px] leading-relaxed text-white/85">{text.thanks}</p>
        ) : (
          <>
            <p className="mt-5 text-[15px] leading-relaxed text-white/80">{text.story}</p>
            <p className="mt-4 text-[15px] font-medium">{text.prompt}</p>
            <form onSubmit={submit} className="mt-6">
              <label className="block text-[13px] text-white/55" htmlFor="consult-name">
                {text.name}
              </label>
              <input
                id="consult-name"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="mt-2 w-full border-b border-white/25 bg-transparent py-2 text-[16px] outline-none"
              />
              <label className="mt-5 block text-[13px] text-white/55" htmlFor="consult-phone">
                {text.phone}
              </label>
              <div className="mt-2 flex gap-3 border-b border-white/25">
                <CountrySelect value={code} onChange={setCode} label={text.phone} optionClass="bg-[#2a2a2a]" />
                <input
                  id="consult-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                  className="w-full bg-transparent py-2 text-[16px] outline-none"
                />
              </div>
              <button
                type="submit"
                className="mt-7 w-full rounded-full bg-[#e3943f] py-3.5 text-[12px] font-medium tracking-[0.12em] text-black uppercase"
              >
                {text.submit}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default function Discover({ lang = 'en' }) {
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('ug_brand_sections_config')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.discover) return parsed.discover
      }
    } catch {}
    return DEFAULT_DISCOVER_CONFIG
  })

  // Sync with MongoDB backend setting
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/blogs/settings/brand-sections')
        const data = await res.json()
        if (data.success && data.data?.discover) {
          setConfig(data.data.discover)
          const saved = localStorage.getItem('ug_brand_sections_config')
          const full = saved ? JSON.parse(saved) : {}
          localStorage.setItem('ug_brand_sections_config', JSON.stringify({ ...full, discover: data.data.discover }))
        }
      } catch {}
    }

    fetchConfig()

    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('ug_brand_sections_config')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.discover) setConfig(parsed.discover)
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
  const text = config?.[currentLang] || DEFAULT_DISCOVER_CONFIG[currentLang]
  const [open, setOpen] = useState(false)
  const videoSrc = config?.mediaUrl || projects[7]?.video

  return (
    <section className="bg-[#141414] px-4 py-8 text-white sm:px-8 lg:px-10 lg:py-12">
      <div className="mx-auto grid max-w-[1180px] items-center gap-8 rounded-[28px] bg-[#1a1a1a] px-6 py-8 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10 lg:px-10 lg:py-10">
        <div>
          <h2 className="max-w-[12ch] text-[32px] leading-[1.05] font-medium tracking-[-0.02em] uppercase sm:text-[40px]">
            {text.line} <span className="text-[#e3943f]">{text.accent}</span>
          </h2>
          <p className="mt-5 max-w-[34ch] text-[16px] leading-relaxed text-white/80">{text.text}</p>
          <p className="mt-6 text-[28px] leading-none font-medium text-[#e3943f]">{text.percent}</p>
          <p className="mt-2 text-[16px] text-white/80">{text.recommend}</p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-7 rounded-full bg-[#e3943f] px-8 py-3.5 text-[12px] font-medium tracking-[0.12em] text-black uppercase hover:brightness-105 transition-all shadow-md shadow-[#e3943f]/25 cursor-pointer"
          >
            {text.button}
          </button>
        </div>
        <LoopVideo
          src={videoSrc}
          className="h-[280px] w-full rounded-[22px] object-cover sm:h-[360px] lg:h-[420px]"
        />
      </div>
      {open ? <ConsultModal text={text} onClose={() => setOpen(false)} /> : null}
    </section>
  )
}

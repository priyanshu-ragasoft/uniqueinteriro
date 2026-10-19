import { useState, useEffect } from 'react'
import CountrySelect from './CountrySelect'
import { defaultCountry } from '../data/countries'
import LoopVideo from './LoopVideo'
import { projects } from '../data/projects'

export const DEFAULT_DREAM_HOME_CONFIG = {
  en: {
    title: 'Turn your dreams of the perfect home into reality',
    accent: 'with Unique Graphics',
    story:
      'Leave your contact details, and our manager will reach out to discuss your project. We look forward to beginning this inspiring journey with you.',
    prompt: 'Fill out the form and our manager will contact you',
    name: 'Your name',
    phone: 'Phone number',
    submit: "Request a manager's consultation",
    thanks: 'Thank you. Your request is noted on this page.',
  },
  ru: {
    title: 'Превратите мечту об идеальном доме в реальность',
    accent: 'вместе с Unique Graphics',
    story:
      'Оставьте контакты, и менеджер свяжется, чтобы обсудить проект. Мы будем рады начать этот путь вместе с вами.',
    prompt: 'Заполните форму, и менеджер свяжется с вами',
    name: 'Ваше имя',
    phone: 'Телефон',
    submit: 'Запросить консультацию менеджера',
    thanks: 'Спасибо. Заявка отмечена на этой странице.',
  },
  mediaUrl: '',
}

export default function DreamHome({ lang, video, crop = true }) {
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('ug_brand_sections_config')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.dreamHome) return parsed.dreamHome
      }
    } catch {}
    return DEFAULT_DREAM_HOME_CONFIG
  })

  // Sync with MongoDB backend setting
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/blogs/settings/brand-sections')
        const data = await res.json()
        if (data.success && data.data?.dreamHome) {
          setConfig(data.data.dreamHome)
          const saved = localStorage.getItem('ug_brand_sections_config')
          const full = saved ? JSON.parse(saved) : {}
          localStorage.setItem('ug_brand_sections_config', JSON.stringify({ ...full, dreamHome: data.data.dreamHome }))
        }
      } catch {}
    }
    fetchConfig()

    const onBrandUpdate = () => {
      try {
        const saved = localStorage.getItem('ug_brand_sections_config')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.dreamHome) setConfig(parsed.dreamHome)
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

  const text = config[lang] ?? config.en ?? DEFAULT_DREAM_HOME_CONFIG[lang] ?? DEFAULT_DREAM_HOME_CONFIG.en
  const [name, setName] = useState('')
  const [code, setCode] = useState(defaultCountry)
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)

  const activeVideo = config.mediaUrl || video || projects[5]?.video

  const submit = (event) => {
    event.preventDefault()
    if (!name.trim() || !phone.trim()) return
    setSent(true)
  }

  return (
    <section className="bg-[#141414] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto grid max-w-[1180px] overflow-hidden rounded-[28px] bg-[#1c1c1c] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-w-0 overflow-hidden">
          <LoopVideo
            src={activeVideo}
            className={`h-[280px] w-full object-cover sm:h-[380px] lg:h-full lg:min-h-[520px] ${crop ? 'origin-center scale-[1.34]' : ''}`}
          />
        </div>
        <div className="flex min-w-0 flex-col justify-center px-6 py-8 sm:px-10 sm:py-12">
          <h2 className="text-[26px] leading-[1.12] font-medium tracking-[-0.02em] uppercase sm:text-[32px]">
            {text.title} <span className="text-[#e3943f]">{text.accent}</span>
          </h2>
          {sent ? (
            <p className="mt-6 text-[16px] leading-relaxed text-white/80">{text.thanks}</p>
          ) : (
            <>
              <p className="mt-5 max-w-[42ch] text-[15px] leading-relaxed text-white/75">{text.story}</p>
              <p className="mt-5 text-[15px] font-medium">{text.prompt}</p>
              <form onSubmit={submit} className="mt-6 max-w-[440px]">
                <label className="block text-[13px] text-white/50" htmlFor="dream-name">
                  {text.name}
                </label>
                <input
                  id="dream-name"
                  name="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="mt-2 w-full border-b border-white/25 bg-transparent py-2 text-[16px] outline-none"
                />
                <label className="mt-5 block text-[13px] text-white/50" htmlFor="dream-phone">
                  {text.phone}
                </label>
                <div className="mt-2 flex gap-3 border-b border-white/25">
                  <CountrySelect value={code} onChange={setCode} label={text.phone} optionClass="bg-[#1c1c1c]" />
                  <input
                    id="dream-phone"
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
                  className="mt-7 w-full rounded-full bg-[#e3943f] py-3.5 text-[14px] font-medium text-black cursor-pointer hover:brightness-105 transition-all"
                >
                  {text.submit}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

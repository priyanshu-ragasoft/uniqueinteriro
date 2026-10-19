import { useEffect, useRef, useState } from 'react'
import { FaInstagram, FaPinterest, FaVk, FaYoutube } from 'react-icons/fa'
import reel from '../assets/Product/11593543-hd_1920_1080_30fps.mp4'

export const DEFAULT_RECOGNITION_CONFIG = {
  en: {
    title: 'Worldwide recognition',
    count: '2 000 000',
    text: 'people follow our development on social media',
  },
  ru: {
    title: 'Мировое признание',
    count: '2 000 000',
    text: 'человек следят за нашей работой в социальных сетях',
  },
  mediaUrl: '',
  socials: {
    instagram: 'https://instagram.com',
    pinterest: 'https://pinterest.com',
    vk: 'https://vk.com',
    youtube: 'https://youtube.com',
  },
}

export default function Recognition({ lang = 'en', src }) {
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('ug_brand_sections_config')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.recognition) return parsed.recognition
      }
    } catch {}
    return DEFAULT_RECOGNITION_CONFIG
  })

  const video = useRef(null)

  // Sync with MongoDB backend setting
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/blogs/settings/brand-sections')
        const data = await res.json()
        if (data.success && data.data?.recognition) {
          setConfig(data.data.recognition)
          const saved = localStorage.getItem('ug_brand_sections_config')
          const full = saved ? JSON.parse(saved) : {}
          localStorage.setItem('ug_brand_sections_config', JSON.stringify({ ...full, recognition: data.data.recognition }))
        }
      } catch {}
    }

    fetchConfig()

    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('ug_brand_sections_config')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.recognition) setConfig(parsed.recognition)
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

  useEffect(() => {
    const node = video.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    node.play().catch(() => {})
  }, [])

  const currentLang = lang === 'ru' ? 'ru' : 'en'
  const text = config?.[currentLang] || DEFAULT_RECOGNITION_CONFIG[currentLang]
  const backgroundMedia = config?.mediaUrl || src || reel

  const socialLinks = [
    { name: 'Instagram', Icon: FaInstagram, url: config?.socials?.instagram || 'https://instagram.com' },
    { name: 'Pinterest', Icon: FaPinterest, url: config?.socials?.pinterest || 'https://pinterest.com' },
    { name: 'VK', Icon: FaVk, url: config?.socials?.vk || 'https://vk.com' },
    { name: 'YouTube', Icon: FaYoutube, url: config?.socials?.youtube || 'https://youtube.com' },
  ]

  return (
    <section className="bg-[#141414] px-4 py-8 text-white sm:px-8 lg:px-10 lg:py-12">
      <div className="relative mx-auto min-h-[460px] max-w-[1180px] overflow-hidden rounded-[28px] sm:min-h-[520px]">
        <video
          ref={video}
          src={backgroundMedia}
          muted
          loop
          playsInline
          autoPlay
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative flex min-h-[460px] items-center justify-center px-5 py-16 sm:min-h-[520px]">
          <div className="w-full max-w-[460px] rounded-[18px] bg-black/60 px-8 py-8 text-center backdrop-blur-[4px] border border-white/10 sm:px-10 sm:py-9 shadow-2xl">
            <p className="text-[13px] tracking-[0.16em] uppercase sm:text-[15px] font-semibold text-white/90">
              {text.title || DEFAULT_RECOGNITION_CONFIG.en.title}
            </p>
            <p className="mt-3 text-[42px] leading-none font-bold tracking-[-0.03em] text-[#e3943f] sm:text-[56px]">
              {text.count || DEFAULT_RECOGNITION_CONFIG.en.count}
            </p>
            <p className="mx-auto mt-3 max-w-[28ch] text-[15px] leading-snug text-white/85">
              {text.text || DEFAULT_RECOGNITION_CONFIG.en.text}
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              {socialLinks.map(({ name, Icon, url }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[16px] text-black hover:bg-[#e3943f] hover:text-black hover:scale-110 transition-all shadow-md cursor-pointer"
                >
                  <Icon aria-hidden />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

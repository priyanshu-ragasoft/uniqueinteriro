import { useEffect, useRef, useState } from 'react'
import clip1 from '../assets/video/1.mp4'
import clip2 from '../assets/video/2.mp4'
import clip3 from '../assets/video/3.mp4'
import clip4 from '../assets/video/4.mp4'
import { gsap, prefersReducedMotion } from '../animations/gsapConfig'

const clips = [clip4, clip3, clip2, clip1]

const copy = {
  en: {
    title: 'Unique Graphics',
    subtitle: 'Leading international bureau for premium architectural and interior design',
    discuss: 'Discuss your project',
  },
  ru: {
    title: 'Unique Graphics',
    subtitle: 'Ведущее международное бюро премиальной архитектуры и дизайна интерьера',
    discuss: 'Обсудить проект',
  },
}

const fogBlobs = [
  { x: '22%', y: '72%', size: '28%' },
  { x: '40%', y: '84%', size: '22%' },
  { x: '58%', y: '68%', size: '26%' },
  { x: '74%', y: '86%', size: '20%' },
]

function Fog() {
  return (
    <div className="hero-fog" aria-hidden="true">
      <div className="fog-bank">
        {[0, 1].map((tile) => (
          <div className="fog-tile" key={tile}>
            {fogBlobs.map((blob) => (
              <span
                key={blob.x}
                className="fog-blob"
                style={{ left: blob.x, top: blob.y, width: blob.size, height: blob.size }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

const DEFAULT_HERO_CONFIG = {
  title: 'Unique Graphics',
  subtitle: 'Leading international bureau for premium architectural and interior design',
  buttonText: 'Discuss your project',
  buttonLink: '/contacts',
  mediaType: 'video', // 'video' | 'image'
  mediaUrl: 'cycle:default',
}

function HeroMedia({ config }) {
  const reduced = prefersReducedMotion()
  const [slot, setSlot] = useState(0)
  const [clip, setClip] = useState(0)
  const first = useRef(null)
  const second = useRef(null)
  const refs = [first, second]

  // If configured as an image background
  if (config?.mediaType === 'image' && config?.mediaUrl && !config.mediaUrl.startsWith('cycle:')) {
    return (
      <img
        src={config.mediaUrl}
        alt={config.title || 'Unique Graphics Luxury Architecture'}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 scale-[1.02]"
      />
    )
  }

  // If a custom single video is explicitly configured (and not cycle or heavy 900mb file)
  if (
    config?.mediaType === 'video' &&
    config?.mediaUrl &&
    !config.mediaUrl.startsWith('cycle:') &&
    !config.mediaUrl.includes('GREEN%20WOOD.mp4') &&
    !config.mediaUrl.includes('GREEN WOOD.mp4') &&
    !config.mediaUrl.includes('/video/4.mp4') // treat default old path as cycle
  ) {
    return (
      <video
        key={config.mediaUrl}
        src={config.mediaUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="hero-clip absolute inset-0 h-full w-full object-cover is-front"
      />
    )
  }

  // Default purana original multi-clip cycling banner
  useEffect(() => {
    if (reduced) return
    const video = first.current
    if (!video) return
    video.src = clips[0]
    video.play().catch(() => {})
    return () => video.pause()
  }, [reduced])

  useEffect(() => {
    const outgoing = refs[slot === 0 ? 1 : 0].current
    const timer = window.setTimeout(() => outgoing?.pause(), 900)
    return () => window.clearTimeout(timer)
  }, [slot])

  const onEnded = () => {
    const nextClip = (clip + 1) % clips.length
    const nextSlot = slot === 0 ? 1 : 0
    const incoming = refs[nextSlot].current
    if (!incoming) return
    incoming.src = clips[nextClip]
    incoming.play().catch(() => {})
    setClip(nextClip)
    setSlot(nextSlot)
  }

  if (reduced) {
    return <img src="/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
  }

  return refs.map((ref, layer) => (
    <video
      key={layer}
      ref={ref}
      src={layer === 0 ? clips[0] : undefined}
      muted
      autoPlay
      playsInline
      preload="auto"
      aria-hidden="true"
      onEnded={layer === slot ? onEnded : undefined}
      className={`hero-clip absolute inset-0 h-full w-full object-cover ${layer === slot ? 'is-front' : ''}`}
    />
  ))
}

export default function Hero({ lang }) {
  const text = copy[lang] ?? copy.en
  const root = useRef(null)

  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('ug_homepage_hero_config')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (!parsed.mediaType || parsed.mediaType === 'video') {
          parsed.mediaUrl = 'cycle:default'
        }
        return parsed
      }
    } catch {}
    return DEFAULT_HERO_CONFIG
  })

  // Sync with MongoDB backend setting
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/blogs/settings/hero')
        const data = await res.json()
        if (data.success && data.data) {
          const remote = { ...data.data }
          if (!remote.mediaType || remote.mediaType === 'video') {
            remote.mediaUrl = 'cycle:default'
          }
          setConfig(remote)
          localStorage.setItem('ug_homepage_hero_config', JSON.stringify(remote))
        }
      } catch {}
    }

    fetchConfig()

    // Listen to real-time update events from Admin panel
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('ug_homepage_hero_config')
        if (saved) setConfig(JSON.parse(saved))
      } catch {}
    }

    window.addEventListener('ug_hero_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('ug_hero_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  useEffect(() => {
    const section = root.current
    if (!section || prefersReducedMotion()) return

    const context = gsap.context(() => {
      gsap.from('[data-hero-rise]', {
        y: 40,
        opacity: 0,
        duration: 1.1,
        stagger: 0.16,
        ease: 'power3.out',
        delay: 0.2,
      })
    }, section)

    return () => context.revert()
  }, [config.title, config.subtitle])

  const titleText = config?.title || text.title
  const subtitleText = config?.subtitle || text.subtitle
  const buttonLabel = config?.buttonText || text.discuss
  const buttonHref = config?.buttonLink || '/contacts'

  return (
    <section id="top" ref={root} className="hero-stage relative min-h-svh text-white" aria-label={titleText}>
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_68%,transparent_100%)]">
        <HeroMedia config={config} />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[34%] bg-gradient-to-b from-transparent via-[#141414]/55 to-[#141414]" />
      <Fog />

      <div className="relative z-10 flex min-h-svh items-end px-5 pt-28 pb-16 sm:px-10 lg:px-16 lg:pb-20">
        <div className="w-full max-w-[680px] min-w-0">
          <h1
            data-hero-rise
            className="text-[2rem] leading-none font-medium tracking-[0.06em] uppercase sm:text-6xl sm:tracking-[0.08em]"
          >
            {titleText}
          </h1>
          <p
            data-hero-rise
            className="mt-4 w-full max-w-full text-[12px] leading-relaxed font-medium tracking-[0.04em] wrap-break-word text-[#e3a15a] uppercase sm:max-w-[34rem] sm:text-[15px] sm:tracking-[0.12em]"
          >
            {subtitleText}
          </p>
          <a
            data-hero-rise
            href={buttonHref}
            className="mt-8 inline-flex rounded-full bg-[#e8892c] px-7 py-3.5 text-[12px] font-medium tracking-[0.14em] text-white uppercase transition-colors hover:bg-[#f0973d]"
          >
            {buttonLabel}
          </a>
        </div>
      </div>
    </section>
  )
}

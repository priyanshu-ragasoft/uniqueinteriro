import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../animations/gsapConfig'
import { DEPLOYED_VIDEOS, normalizeProjectVideoUrl } from '../utils/videoUrl'

/** Same fallback video admin preview uses for cycle:default */
const DEFAULT_REAL_HERO_VIDEO = DEPLOYED_VIDEOS.rydhum

const DEFAULT_VIDEO_PRESETS = [
  {
    name: 'Rydhum Hotel & Banquet Hall',
    url: DEPLOYED_VIDEOS.rydhum,
  },
  {
    name: 'Vecterrace Hotel Dance Bar Kolkata',
    url: DEPLOYED_VIDEOS.victerrace,
  },
  {
    name: 'Smart City Society Walkthrough',
    url: DEPLOYED_VIDEOS.smartCity,
  },
  {
    name: 'Pushpa The Fire Dance Bar',
    url: DEPLOYED_VIDEOS.pushpa,
  },
]

const DEFAULT_IMAGE_PRESETS = [
  {
    name: 'Greenwood Avenue Mullanpur',
    url: '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg',
  },
  {
    name: 'Neo Classic Villa Bijnor',
    url: '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png',
  },
]

const copy = {
  en: {
    title: 'Unique Graphics',
    subtitle: 'Leading international bureau for premium architectural and interior design',
    discuss: 'Discuss your project',
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
  mediaType: 'video',
  mediaUrl: DEFAULT_REAL_HERO_VIDEO,
  videoPresets: DEFAULT_VIDEO_PRESETS,
  imagePresets: DEFAULT_IMAGE_PRESETS,
}

function isCycleUrl(url) {
  return !url || String(url).startsWith('cycle:') || String(url).includes('/video/4.mp4')
}

function isImageUrl(url) {
  return /\.(jpe?g|png|webp|gif|avif)(\?|#|$)/i.test(String(url || '')) || String(url || '').startsWith('data:image')
}

function isBadLegacyUrl(url) {
  const s = String(url || '')
  return s.includes('GREEN%20WOOD.mp4') || s.includes('GREEN WOOD.mp4')
}

/** Build the slides home + admin should share */
function buildHeroSlides(config) {
  const mediaType = config?.mediaType === 'image' ? 'image' : 'video'
  const defaults = mediaType === 'image' ? DEFAULT_IMAGE_PRESETS : DEFAULT_VIDEO_PRESETS
  const rawPresets =
    mediaType === 'image'
      ? Array.isArray(config?.imagePresets) && config.imagePresets.length
        ? config.imagePresets
        : defaults
      : Array.isArray(config?.videoPresets) && config.videoPresets.length
        ? config.videoPresets
        : defaults

  const fromPresets = rawPresets
    .filter((p) => p?.url && !isCycleUrl(p.url) && !isBadLegacyUrl(p.url))
    .map((p) => {
      const normalizedUrl = normalizeProjectVideoUrl(p.url)
      return {
        url: normalizedUrl,
        kind: isImageUrl(normalizedUrl) ? 'image' : 'video',
        title: p.title || config?.title || DEFAULT_HERO_CONFIG.title,
        subtitle: p.subtitle || config?.subtitle || DEFAULT_HERO_CONFIG.subtitle,
        buttonText: p.buttonText || config?.buttonText || DEFAULT_HERO_CONFIG.buttonText,
        buttonLink: p.buttonLink || config?.buttonLink || DEFAULT_HERO_CONFIG.buttonLink,
      }
    })

  const mediaUrl = normalizeProjectVideoUrl(config?.mediaUrl || '')

  // Specific selected banner (not cycle) → start with that, then rest in order
  if (mediaUrl && !isCycleUrl(mediaUrl) && !isBadLegacyUrl(mediaUrl)) {
    const idx = fromPresets.findIndex((p) => p.url === mediaUrl)
    if (idx >= 0) {
      return [...fromPresets.slice(idx), ...fromPresets.slice(0, idx)]
    }
    return [
      {
        url: mediaUrl,
        kind: mediaType === 'image' || isImageUrl(mediaUrl) ? 'image' : 'video',
        title: config?.title || DEFAULT_HERO_CONFIG.title,
        subtitle: config?.subtitle || DEFAULT_HERO_CONFIG.subtitle,
        buttonText: config?.buttonText || DEFAULT_HERO_CONFIG.buttonText,
        buttonLink: config?.buttonLink || DEFAULT_HERO_CONFIG.buttonLink,
      },
      ...fromPresets.filter((p) => p.url !== mediaUrl),
    ]
  }

  // cycle:default → same playlist admin preview uses (real presets, Rydhum first)
  if (fromPresets.length) return fromPresets

  return [
    {
      url: mediaType === 'image' ? '/hero.jpg' : DEFAULT_REAL_HERO_VIDEO,
      kind: mediaType === 'image' ? 'image' : 'video',
      title: config?.title || DEFAULT_HERO_CONFIG.title,
      subtitle: config?.subtitle || DEFAULT_HERO_CONFIG.subtitle,
      buttonText: config?.buttonText || DEFAULT_HERO_CONFIG.buttonText,
      buttonLink: config?.buttonLink || DEFAULT_HERO_CONFIG.buttonLink,
    },
  ]
}

function HeroMedia({ slide, onEnded }) {
  const video = useRef(null)

  useEffect(() => {
    const node = video.current
    if (!node || slide?.kind === 'image') return
    if (prefersReducedMotion()) return
    node.play().catch(() => {})
  }, [slide?.url, slide?.kind])

  if (!slide?.url) {
    return <div className="absolute inset-0 bg-black" />
  }

  if (slide.kind === 'image' || prefersReducedMotion()) {
    return (
      <img
        key={slide.url}
        src={slide.kind === 'image' ? slide.url : '/hero.jpg'}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
    )
  }

  return (
    <video
      key={slide.url}
      ref={video}
      src={slide.url}
      poster="/hero.jpg"
      autoPlay
      muted
      loop={false}
      playsInline
      preload="auto"
      aria-hidden="true"
      onEnded={onEnded}
      onError={onEnded}
      className="hero-clip absolute inset-0 h-full w-full object-cover is-front"
    />
  )
}

export default function Hero({ lang }) {
  const text = copy.en
  const root = useRef(null)

  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('ug_homepage_hero_config')
      if (saved) return JSON.parse(saved)
    } catch {}
    return DEFAULT_HERO_CONFIG
  })

  const slides = useMemo(() => buildHeroSlides(config), [config])
  const [slideIndex, setSlideIndex] = useState(0)

  useEffect(() => {
    setSlideIndex(0)
  }, [slides])

  const activeSlide = slides[slideIndex] || slides[0]

  // Sync with MongoDB — prefer newer local save so admin Save wins immediately
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/blogs/settings/hero')
        const data = await res.json()
        if (data.success && data.data) {
          const localRaw = localStorage.getItem('ug_homepage_hero_config')
          let local = null
          try {
            local = localRaw ? JSON.parse(localRaw) : null
          } catch {
            local = null
          }
          const remote = { ...data.data }
          const keepLocal =
            local?.updatedAt && (!remote.updatedAt || Number(local.updatedAt) >= Number(remote.updatedAt))
          const next = keepLocal ? local : remote
          setConfig(next)
          localStorage.setItem('ug_homepage_hero_config', JSON.stringify(next))
        }
      } catch {}
    }

    fetchConfig()

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

  // Image slides: advance on timer; videos advance onEnded
  useEffect(() => {
    if (!activeSlide || activeSlide.kind !== 'image' || slides.length < 2) return undefined
    const timer = window.setTimeout(() => {
      setSlideIndex((i) => (i + 1) % slides.length)
    }, 8000)
    return () => window.clearTimeout(timer)
  }, [activeSlide, slides.length])

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
  }, [activeSlide?.title, activeSlide?.subtitle])

  const titleText = activeSlide?.title || config?.title || text.title
  const subtitleText = activeSlide?.subtitle || config?.subtitle || text.subtitle
  const buttonLabel = activeSlide?.buttonText || config?.buttonText || text.discuss
  const buttonHref = activeSlide?.buttonLink || config?.buttonLink || '/contacts'

  const goNext = () => {
    if (slides.length < 2) return
    setSlideIndex((i) => (i + 1) % slides.length)
  }

  return (
    <section id="top" ref={root} className="hero-stage relative min-h-svh text-white" aria-label={titleText}>
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_68%,transparent_100%)]">
        <HeroMedia
          slide={activeSlide}
          onEnded={() => {
            if (slides.length < 2) {
              // single video: restart
              const node = root.current?.querySelector('video')
              if (node) {
                node.currentTime = 0
                node.play().catch(() => {})
              }
              return
            }
            goNext()
          }}
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-transparent" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[34%] bg-gradient-to-b from-transparent via-[#141414]/55 to-[#141414]"
      />
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

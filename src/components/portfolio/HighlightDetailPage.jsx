import { useEffect, useMemo, useRef, useState } from 'react'
import {
  findPortfolioStory,
  getStoredPortfolioTree,
  portfolioCategoryPath,
  portfolioSubcategoryPath,
} from '../../data/portfolioTree'
import { getStoredPortfolioConfig, setStoredPortfolioConfig } from '../../data/portfolioConfig'
import NotFoundPage from '../NotFoundPage'
import { normalizeProjectVideoUrl } from '../../utils/videoUrl'

function isVideoSrc(src) {
  return /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(String(src || '')) || String(src || '').startsWith('data:video')
}

function visibleMedia(images) {
  return (images || []).map((src) => normalizeProjectVideoUrl(String(src || '').trim())).filter(Boolean)
}

export default function HighlightDetailPage({
  categorySlug,
  subcategorySlug = '',
  highlightSlug,
  storySlug = '',
  lang = 'en',
}) {
  const [tree, setTree] = useState(() => getStoredPortfolioTree())
  const [hydrated, setHydrated] = useState(false)
  const [currentBanner, setCurrentBanner] = useState(0)
  const [lightbox, setLightbox] = useState(null)
  const videoRefs = useRef([])

  useEffect(() => {
    const apply = () => setTree(getStoredPortfolioTree())
    window.addEventListener('portfolio-pages-config-changed', apply)
    fetch('/api/blogs/settings/portfolio-pages')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data.data) {
          setStoredPortfolioConfig({ ...getStoredPortfolioConfig(), ...data.data })
          setTree(getStoredPortfolioTree())
        }
      })
      .catch(() => {})
      .finally(() => setHydrated(true))
    return () => window.removeEventListener('portfolio-pages-config-changed', apply)
  }, [])

  useEffect(() => {
    setCurrentBanner(0)
    setLightbox(null)
  }, [categorySlug, subcategorySlug, highlightSlug, storySlug])

  const itemSlug = String(storySlug || highlightSlug || '').trim()
  const match = findPortfolioStory(tree, categorySlug, subcategorySlug, itemSlug)
  const highlight = match?.highlight
  const detail = highlight?.detail || {}
  const banner = detail.banner || {}
  const intro = detail.intro || {}
  const closing = detail.closing || {}
  const sections = Array.isArray(detail.sections) ? detail.sections : []
  const gallery = Array.isArray(detail.gallery) ? detail.gallery : []
  const title = banner.title || highlight?.title || itemSlug
  const slides = useMemo(() => {
    const fromBanner = visibleMedia(banner.images)
    const srcs = fromBanner.length ? fromBanner : visibleMedia([highlight?.image])
    return srcs.map((src, i) => ({
      id: i + 1,
      src,
      isVideo: isVideoSrc(src),
    }))
  }, [banner.images, highlight?.image])
  const uniqueSections = useMemo(() => {
    const used = new Set(slides.map((item) => item.src))
    return sections.map((section) => {
      const repeatPhoto = Boolean(section.media && used.has(section.media))
      if (section.media) used.add(section.media)
      return { ...section, media: repeatPhoto ? '' : section.media }
    })
  }, [sections, slides])
  const uniqueGallery = useMemo(() => {
    const used = new Set([
      ...slides.map((item) => item.src),
      ...uniqueSections.map((section) => section.media).filter(Boolean),
    ])
    return gallery.filter((item) => {
      if (!item.image) return Boolean(item.caption)
      if (used.has(item.image)) return false
      used.add(item.image)
      return true
    })
  }, [gallery, slides, uniqueSections])

  useEffect(() => {
    if (slides.length < 2) return undefined
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % slides.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [slides.length])

  useEffect(() => {
    if (!lightbox) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return
      if (idx === currentBanner) {
        try {
          vid.currentTime = 0
          vid.play()?.catch?.(() => {})
        } catch {
          /* ignore */
        }
      } else {
        try {
          vid.pause()
        } catch {
          /* ignore */
        }
      }
    })
  }, [currentBanner, slides])

  if (!hydrated && !match) {
    return <main className="min-h-screen bg-[#111111]" />
  }

  if (!match || match.category.published === false || (match.subcategory && match.subcategory.published === false) || highlight.published === false) {
    return (
      <NotFoundPage
        title="404"
        message="This page does not exist."
        homeHref={match?.subcategory ? portfolioSubcategoryPath(match.category, match.subcategory) : match?.category ? portfolioCategoryPath(match.category) : '/all-projects'}
      />
    )
  }

  const parentHref = match.subcategory
    ? portfolioSubcategoryPath(match.category, match.subcategory)
    : portfolioCategoryPath(match.category)
  const parentLabel = match.subcategory?.name || match.category?.name || 'Portfolio'
  const mediaList = [
    ...slides.map((item) => item.src),
    ...uniqueSections.map((section) => section.media).filter(Boolean),
    ...uniqueGallery.map((item) => item.image).filter(Boolean),
  ].filter((src, index, list) => list.indexOf(src) === index)
  const openLightbox = (src) => {
    if (!src) return
    const index = Math.max(0, mediaList.indexOf(src))
    setLightbox({ list: mediaList.length ? mediaList : [src], index })
  }
  const lightboxSrc = lightbox?.list?.[lightbox.index]

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      {banner.show !== false ? (
        <section className="relative flex min-h-[75vh] w-full flex-col justify-end overflow-hidden px-6 pt-32 pb-12 sm:px-10 lg:min-h-[85vh] lg:px-16 lg:pt-40 lg:pb-16">
          <div className="absolute inset-0 z-0 overflow-hidden bg-black">
            {slides.length ? (
              slides.map((bannerItem, idx) =>
                bannerItem.isVideo ? (
                  <video
                    key={bannerItem.id}
                    ref={(el) => {
                      videoRefs.current[idx] = el
                    }}
                    src={bannerItem.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className={`absolute inset-0 h-full w-full object-cover object-center scale-105 transition-opacity duration-1000 ease-in-out ${
                      idx === currentBanner ? 'opacity-100 z-[1]' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  />
                ) : (
                  <img
                    key={bannerItem.id}
                    src={bannerItem.src}
                    alt=""
                    className={`absolute inset-0 h-full w-full object-cover object-center scale-105 transition-opacity duration-1000 ease-in-out ${
                      idx === currentBanner ? 'opacity-100 z-[1]' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  />
                )
              )
            ) : (
              <div className="absolute inset-0 bg-[#161616]" />
            )}
            <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#111111] via-black/40 to-black/60 pointer-events-none" />
          </div>
          <div className="relative z-10 mx-auto w-full max-w-[1600px]">
            <a href={parentHref} className="inline-flex items-center gap-2 text-[13px] font-medium text-white/70 transition-colors hover:text-[#e3943f]">
              <span className="text-[16px] text-white/50">‹</span>
              <span>{parentLabel}</span>
            </a>
            <div className="mt-6 max-w-[1050px]">
              {banner.label ? <p className="text-[12px] tracking-[0.2em] text-[#e3943f] uppercase">{banner.label}</p> : null}
              <h1 className="text-[32px] leading-[1.08] font-bold tracking-[-0.02em] uppercase sm:text-[46px] md:text-[54px] lg:text-[64px]">
                {title} {banner.accent ? <span className="text-[#e3943f]">{banner.accent}</span> : null}
              </h1>
              {banner.subtitle ? <p className="mt-5 max-w-[85ch] text-[15px] leading-relaxed text-white/80 sm:text-[17px]">{banner.subtitle}</p> : null}
            </div>
          </div>
        </section>
      ) : null}

      {intro.show !== false && (intro.heading || intro.paragraph1 || intro.paragraph2) ? (
        <section className="mx-auto max-w-[1600px] px-6 pt-16 sm:px-10 lg:px-16">
          <div className="max-w-[820px]">
            {intro.heading ? <h2 className="text-[28px] font-medium tracking-tight sm:text-[38px]">{intro.heading}</h2> : null}
            {intro.paragraph1 ? <p className="mt-6 text-[16px] leading-relaxed text-white/80">{intro.paragraph1}</p> : null}
            {intro.paragraph2 ? <p className="mt-4 text-[16px] leading-relaxed text-white/80">{intro.paragraph2}</p> : null}
          </div>
        </section>
      ) : null}

      {uniqueSections.length ? (
        <section className="mx-auto max-w-[1600px] space-y-16 px-6 pt-16 sm:px-10 lg:px-16">
          {uniqueSections.map((section) => (
            <article key={section.id || section.title} className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                {section.title ? <h2 className="text-[26px] font-semibold tracking-tight sm:text-[32px]">{section.title}</h2> : null}
                {section.text ? <p className="mt-4 text-[16px] leading-relaxed text-white/75">{section.text}</p> : null}
              </div>
              {section.media ? (
                <figure>
                  <button type="button" onClick={() => openLightbox(section.media)} aria-label="Open photo" className="block w-full cursor-pointer text-left">
                    {isVideoSrc(section.media) ? (
                      <video src={section.media} muted loop playsInline autoPlay className="pointer-events-none aspect-[16/10] w-full rounded-[20px] object-cover" />
                    ) : (
                      <img src={section.media} alt="" className="aspect-[16/10] w-full rounded-[20px] object-cover" />
                    )}
                  </button>
                  {section.caption ? <figcaption className="mt-3 text-[13px] text-white/50">{section.caption}</figcaption> : null}
                </figure>
              ) : null}
            </article>
          ))}
        </section>
      ) : null}

      {uniqueGallery.length ? (
        <section className="mx-auto max-w-[1600px] px-6 pt-16 sm:px-10 lg:px-16">
          <div className="grid gap-4 sm:grid-cols-2">
            {uniqueGallery.map((item, index) => (
              <figure key={item.id || index} className="overflow-hidden rounded-2xl border border-white/10">
                {item.image ? (
                  <button type="button" onClick={() => openLightbox(item.image)} aria-label="Open photo" className="block w-full cursor-pointer text-left">
                    {isVideoSrc(item.image) ? (
                      <video src={item.image} muted loop playsInline autoPlay className="pointer-events-none aspect-[16/10] w-full object-cover" />
                    ) : (
                      <img src={item.image} alt="" className="aspect-[16/10] w-full object-cover" />
                    )}
                  </button>
                ) : null}
                {item.caption ? <figcaption className="px-4 py-3 text-[13px] text-white/60">{item.caption}</figcaption> : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {closing.show !== false && (closing.heading || closing.paragraph || closing.buttonLabel) ? (
        <section className="mx-auto max-w-[1600px] px-6 py-24 sm:px-10 lg:px-16">
          <div className="rounded-3xl border border-white/10 bg-[#161616] px-6 py-12 sm:px-10">
            {closing.heading ? <h2 className="text-[28px] font-semibold tracking-tight sm:text-[36px]">{closing.heading}</h2> : null}
            {closing.paragraph ? <p className="mt-4 max-w-[70ch] text-[16px] leading-relaxed text-white/70">{closing.paragraph}</p> : null}
            {closing.buttonLabel ? (
              <a href={closing.buttonLink || '/contacts'} className="mt-8 inline-flex rounded-xl bg-[#e3943f] px-5 py-3 text-[12px] font-bold tracking-[0.14em] text-black uppercase">
                {closing.buttonLabel}
              </a>
            ) : null}
          </div>
        </section>
      ) : null}

      {lightboxSrc ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm sm:p-8"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            ×
          </button>
          <div className="max-h-[88vh] max-w-[1200px]" onClick={(event) => event.stopPropagation()}>
            {isVideoSrc(lightboxSrc) ? (
              <video src={lightboxSrc} controls autoPlay className="max-h-[88vh] w-full rounded-2xl object-contain" />
            ) : (
              <img src={lightboxSrc} alt="" className="max-h-[88vh] w-full rounded-2xl object-contain" />
            )}
          </div>
        </div>
      ) : null}
    </main>
  )
}

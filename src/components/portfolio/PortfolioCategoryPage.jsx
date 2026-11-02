import { useEffect, useMemo, useRef, useState } from 'react'
import {
  findPortfolioPage,
  getStoredPortfolioTree,
  portfolioCategoryPath,
  portfolioGalleryPath,
  portfolioHighlightPath,
  projectsForPortfolioPage,
} from '../../data/portfolioTree'
import { getStoredPortfolioConfig, setStoredPortfolioConfig } from '../../data/portfolioConfig'
import FilterDrawer from '../commercial/FilterDrawer'
import PortfolioProjectCard from './PortfolioProjectCard'
import NotFoundPage from '../NotFoundPage'
import { normalizeProjectVideoUrl } from '../../utils/videoUrl'

function isVideoSrc(src) {
  return /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(String(src || '')) || String(src || '').startsWith('data:video')
}

function visibleMedia(images) {
  return (images || [])
    .map((src) => normalizeProjectVideoUrl(String(src || '').trim()))
    .filter(Boolean)
}

export default function PortfolioCategoryPage({ categorySlug, subcategorySlug = '', lang = 'en' }) {
  const slug = String(categorySlug || '').trim()
  const subSlug = String(subcategorySlug || '').trim()
  const [selectedType, setSelectedType] = useState('ALL PROJECTS')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentBanner, setCurrentBanner] = useState(0)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [tree, setTree] = useState(() => getStoredPortfolioTree())
  const [hydrated, setHydrated] = useState(false)
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

  const match = findPortfolioPage(tree, slug, subSlug)
  const page = match?.page || {}
  const banner = page.banner || {}
  const intro = page.intro || {}
  const closing = page.closing || {}
  const title = match?.subcategory?.name || match?.category?.name || slug
  const slides = useMemo(() => visibleMedia(banner.images).map((src, i) => ({ id: i + 1, src, isVideo: isVideoSrc(src) })), [banner.images])
  const projects = useMemo(() => projectsForPortfolioPage(tree, slug, subSlug), [tree, slug, subSlug])
  const highlights = (page.highlights?.show !== false ? page.highlights?.items : []) || []
  const steps = (page.steps?.show !== false ? page.steps?.items : []) || []
  const gallery = (page.gallery?.show !== false ? page.gallery?.items : []) || []

  useEffect(() => {
    setCurrentBanner(0)
    setSelectedType('ALL PROJECTS')
    setSearchQuery('')
  }, [slug, subSlug])

  useEffect(() => {
    if (slides.length < 2) return undefined
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % slides.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [slides.length])

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

  const filteredProjects = useMemo(() => {
    return projects.filter((item) => {
      const typeOk =
        !selectedType ||
        selectedType === 'ALL' ||
        selectedType === 'ALL PROJECTS' ||
        String(item.type || '').toLowerCase() === selectedType.toLowerCase()
      const q = searchQuery.toLowerCase().trim()
      const searchOk =
        !q ||
        [item.city, item.country, item.titlePre, item.location, item.titlePost]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      return typeOk && searchOk
    })
  }, [projects, selectedType, searchQuery])

  if (!hydrated && !match) {
    return <main className="min-h-screen bg-[#111111]" />
  }

  if (!match || match.category.published === false || (match.subcategory && match.subcategory.published === false)) {
    return (
      <NotFoundPage
        title="404"
        message="This portfolio page does not exist."
        homeHref="/all-projects"
      />
    )
  }

  const parentHref = match.kind === 'subcategory' ? portfolioCategoryPath(match.category) : '/all-projects'
  const parentLabel = match.kind === 'subcategory' ? match.category.name : 'Portfolio'

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
            <div className="absolute inset-0 z-[2] bg-black/25 pointer-events-none" />
          </div>

          <div className="relative z-10 mx-auto max-w-[1600px] w-full">
            <div className="mb-4">
              <a
                href={parentHref}
                className="inline-flex items-center gap-2 text-[13px] font-medium text-white/70 transition-colors hover:text-[#e3943f] group cursor-pointer"
              >
                <span className="text-[16px] text-white/50 transition-transform group-hover:-translate-x-1 group-hover:text-[#e3943f]">‹</span>
                <span>{parentLabel}</span>
              </a>
            </div>
            <div className="max-w-[1050px]">
              {banner.label ? (
                <p className="text-[12px] tracking-[0.2em] text-[#e3943f] uppercase">{banner.label}</p>
              ) : null}
              <h1 className="text-[32px] leading-[1.08] font-bold tracking-[-0.02em] uppercase sm:text-[46px] md:text-[54px] lg:text-[64px]">
                {banner.title || title}{' '}
                {banner.accent ? <span className="text-[#e3943f]">{banner.accent}</span> : null}
              </h1>
              {banner.subtitle ? (
                <p className="mt-5 max-w-[85ch] text-[15px] leading-relaxed text-white/80 sm:text-[17px]">{banner.subtitle}</p>
              ) : null}
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

      {highlights.length ? (
        <section className="mx-auto max-w-[1600px] px-6 pt-16 sm:px-10 lg:px-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlights
              .filter((item) => item.published !== false)
              .map((item) => (
              <a
                key={item.id}
                href={portfolioHighlightPath(match.category, match.subcategory, item)}
                className="cursor-pointer rounded-[20px] border border-white/10 bg-[#161616] p-4 text-left transition hover:border-[#e3943f]/50"
              >
                {item.image ? (
                  isVideoSrc(item.image) ? (
                    <video src={item.image} muted loop playsInline autoPlay className="pointer-events-none aspect-[16/10] w-full rounded-[14px] object-cover" />
                  ) : (
                    <img src={item.image} alt="" className="pointer-events-none aspect-[16/10] w-full rounded-[14px] object-cover" />
                  )
                ) : null}
                {item.title ? <h3 className="mt-4 text-[17px] font-bold">{item.title}</h3> : null}
                {item.text ? <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-white/70">{item.text}</p> : null}
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {steps.length ? (
        <section className="mx-auto max-w-[1600px] px-6 pt-16 sm:px-10 lg:px-16">
          <div className="grid gap-6 md:grid-cols-2">
            {steps.map((item) => (
              <article key={item.id} className="rounded-2xl border border-white/10 bg-[#161616] p-6">
                {item.number ? <p className="text-[13px] tracking-[0.16em] text-[#e3943f]">{item.number}</p> : null}
                {item.title ? <h3 className="mt-2 text-[20px] font-semibold">{item.title}</h3> : null}
                {item.text ? <p className="mt-3 text-[14px] leading-relaxed text-white/70">{item.text}</p> : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {gallery.length ? (
        <section className="mx-auto max-w-[1600px] px-6 pt-16 sm:px-10 lg:px-16">
          <div className="grid gap-4 sm:grid-cols-2">
            {gallery
              .filter((item) => item.published !== false)
              .map((item) => (
              <a
                key={item.id}
                href={portfolioGalleryPath(match.category, match.subcategory, item)}
                className="cursor-pointer overflow-hidden rounded-2xl border border-white/10 transition hover:border-[#e3943f]/50"
              >
                {item.image ? (
                  isVideoSrc(item.image) ? (
                    <video src={item.image} muted loop playsInline autoPlay className="pointer-events-none aspect-[16/10] w-full object-cover" />
                  ) : (
                    <img src={item.image} alt="" className="pointer-events-none aspect-[16/10] w-full object-cover" />
                  )
                ) : null}
                {item.caption || item.title ? (
                  <p className="px-4 py-3 text-[13px] text-white/60">{item.caption || item.title}</p>
                ) : null}
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeDirection={subSlug || slug}
        selectedType={selectedType}
        onSelectType={(type) => setSelectedType(type)}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        onReset={() => {
          setSelectedType('ALL PROJECTS')
          setSearchQuery('')
        }}
        onApply={() => setIsDrawerOpen(false)}
      />

      <section className="mx-auto max-w-[1600px] px-6 pt-10 pb-2 sm:px-10 lg:px-16">
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="inline-flex items-center gap-3 text-[15px] font-medium tracking-wide text-white transition-colors hover:text-[#e3943f] cursor-pointer"
        >
          <span>Filters and sorting</span>
          <svg className="h-5 w-5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h10m4 0h4M3 12h4m4 0h10M3 18h14m4 0h1" />
            <circle cx="15" cy="6" r="2" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="9" cy="12" r="2" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="19" cy="18" r="2" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </button>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 pt-4 pb-20 sm:px-10 lg:px-16 lg:pb-28">
        {filteredProjects.length ? (
          <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:gap-x-10 lg:gap-y-14">
            {filteredProjects.map((project) => (
              <PortfolioProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 px-6 py-20 text-center">
            <p className="text-lg text-white/60">No projects yet.</p>
            <p className="mt-2 text-[14px] text-white/40">Add cards from Admin → Portfolio → Projects.</p>
          </div>
        )}
      </section>

      {closing.show !== false && (closing.heading || closing.paragraph || closing.buttonLabel) ? (
        <section className="mx-auto max-w-[1600px] px-6 pb-24 sm:px-10 lg:px-16">
          <div className="rounded-3xl border border-white/10 bg-[#161616] px-6 py-12 sm:px-10">
            {closing.heading ? <h2 className="text-[28px] font-semibold tracking-tight sm:text-[36px]">{closing.heading}</h2> : null}
            {closing.paragraph ? <p className="mt-4 max-w-[70ch] text-[16px] leading-relaxed text-white/70">{closing.paragraph}</p> : null}
            {closing.buttonLabel ? (
              <a
                href={closing.buttonLink || '/contacts'}
                className="mt-8 inline-flex rounded-xl bg-[#e3943f] px-5 py-3 text-[12px] font-bold tracking-[0.14em] text-black uppercase"
              >
                {closing.buttonLabel}
              </a>
            ) : null}
          </div>
        </section>
      ) : null}

    </main>
  )
}

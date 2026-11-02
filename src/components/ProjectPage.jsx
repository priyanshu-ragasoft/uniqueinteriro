import { useEffect, useMemo, useRef, useState } from 'react'
import { findProject, projects as allProjects } from '../data/projects'
import { setStoredPortfolioConfig } from '../data/portfolioConfig'
import { normalizeProjectVideoUrl } from '../utils/videoUrl'

function cleanText(value) {
  return String(value || '')
    .replace(/mÂ²/g, 'm²')
    .replace(/Ð¼Â²/g, 'm²')
    .replace(/Ð¼²/g, 'm²')
    .replace(/360Â°/g, '360°')
    .replace(/Unique GraphicsÂ®/g, 'Unique Graphics®')
    .replace(/\s+/g, ' ')
    .trim()
}

function isVideoSrc(src) {
  return /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(String(src || '')) || String(src || '').startsWith('data:video')
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60)
}

function mediaSrc(item) {
  if (!item) return ''
  if (typeof item === 'string') return normalizeProjectVideoUrl(item)
  return normalizeProjectVideoUrl(item.src || item.url || item.image || '')
}

function mediaCaption(item) {
  if (!item || typeof item === 'string') return ''
  return item.caption || ''
}

function mediaTitle(item) {
  if (!item || typeof item === 'string') return ''
  return item.title || item.tocTitle || item.label || ''
}

function mediaText(item) {
  if (!item || typeof item === 'string') return ''
  return item.text || item.description || ''
}

const ENQUIRE_PROJECT_KEY = 'ug_enquire_project'

function stashEnquireProject({ mediaUrl, posterUrl, title, id }) {
  if (typeof window === 'undefined') return
  try {
    if (!mediaUrl) {
      sessionStorage.removeItem(ENQUIRE_PROJECT_KEY)
      return
    }
    sessionStorage.setItem(
      ENQUIRE_PROJECT_KEY,
      JSON.stringify({
        mediaUrl,
        posterUrl: posterUrl || '',
        title: title || '',
        id: id || '',
      })
    )
  } catch {
    /* ignore quota / private mode */
  }
}

function prepareEnquireNavigation(href, projectPayload) {
  const target = String(href || '/contacts').trim() || '/contacts'
  const goesToContacts =
    target === '/contacts' || target.startsWith('/contacts?') || target.startsWith('/contacts#')
  if (goesToContacts) stashEnquireProject(projectPayload)
  return target
}

function AreaIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="1.5" />
      <path d="M4 10h16M10 4v16" />
    </svg>
  )
}

function TypeIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 14.5V11l3.5-2.5L15.5 11v3.5" />
      <path d="M10.5 14.5V12h3v2.5" />
    </svg>
  )
}

function PinIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" aria-hidden="true">
      <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  )
}

function ClockIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v4.5l3 1.5" />
    </svg>
  )
}

function ShareIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="18" cy="5" r="2.4" />
      <circle cx="6" cy="12" r="2.4" />
      <circle cx="18" cy="19" r="2.4" />
      <path d="M8.2 13.1l7.5 4.3M15.7 6.6l-7.5 4.3" />
    </svg>
  )
}

function SpecCol({ icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3.5">
      <span className="mt-1 text-[#e3943f]">{icon}</span>
      <div>
        <p className="text-[13px] leading-none text-white/45">{label}</p>
        <p className="mt-2.5 text-[18px] leading-snug text-white sm:text-[20px]">{value}</p>
      </div>
    </div>
  )
}

function MediaBlock({ src, caption, onOpen, features, featuresTitle = 'Project features', className = '' }) {
  if (!src) return null
  const video = isVideoSrc(src)
  return (
    <figure className={className || 'mt-10'}>
      <div className="relative overflow-hidden rounded-[18px] bg-[#121212] sm:rounded-[22px]">
        <button type="button" onClick={onOpen} className="block w-full text-left">
          {video ? (
            <video src={src} controls playsInline className="aspect-[16/10] w-full object-cover" />
          ) : (
            <img src={src} alt={caption || ''} loading="lazy" className="aspect-[16/10] w-full object-cover" />
          )}
        </button>
        {features?.length ? (
          <div className="absolute top-4 right-4 z-10 w-[min(100%,210px)] rounded-[14px] border border-white/10 bg-black/75 px-4 py-3.5 backdrop-blur-md">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#e3943f]">{featuresTitle}</p>
            <ul className="mt-3 space-y-1.5">
              {features.slice(0, 6).map((item) => (
                <li key={item} className="text-[12.5px] leading-snug text-white/85">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      {caption ? (
        <figcaption className="mt-3.5 text-[13px] leading-relaxed text-white/45">{caption}</figcaption>
      ) : null}
    </figure>
  )
}

function TocList({ items, activeToc, onSelect }) {
  return (
    <div className="relative mt-6">
      <div className="absolute bottom-1 left-0 top-1 w-px bg-[#e3943f]" aria-hidden="true" />
      <ul className="space-y-4 pl-5">
        {items.map((item) => {
          const active = activeToc === item.id
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className={`flex w-full items-start gap-2.5 text-left text-[14px] leading-[1.4] transition-colors ${
                  active ? 'font-semibold text-[#e3943f]' : 'font-normal text-white/55 hover:text-white'
                }`}
              >
                <span
                  className={`mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full ${
                    active ? 'bg-[#e3943f]' : 'bg-[#e3943f]/55'
                  }`}
                  aria-hidden="true"
                />
                <span>{item.title}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function ProjectPage({ lang, id }) {
  const [project, setProject] = useState(() => findProject(id))
  const [lightbox, setLightbox] = useState(null)
  const [activeToc, setActiveToc] = useState('about')
  const text = project?.[lang] ?? project?.en
  const video = useRef(null)

  useEffect(() => {
    setProject(findProject(id))
    setLightbox(null)
    setActiveToc('about')
    // Pull latest admin media (gallery / sections) so uploads show without hard refresh
    let cancelled = false
    fetch('/api/blogs/settings/portfolio-pages')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data?.success || !data.data) return
        setStoredPortfolioConfig(data.data)
        setProject(findProject(id))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    const handleUpdate = () => setProject(findProject(id))
    window.addEventListener('ug_completed_projects_updated', handleUpdate)
    window.addEventListener('portfolio-pages-config-changed', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('ug_completed_projects_updated', handleUpdate)
      window.removeEventListener('portfolio-pages-config-changed', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [id])

  useEffect(() => {
    const node = video.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    node.play().catch(() => {})
  }, [id, project?.video])

  const galleryItems = useMemo(() => {
    if (!project) return []
    const raw = Array.isArray(project.gallery) ? project.gallery : []
    return raw
      .map((item, index) => {
        const src = mediaSrc(item)
        const title = cleanText(mediaTitle(item))
        return {
          src,
          caption: cleanText(mediaCaption(item)),
          title,
          text: cleanText(mediaText(item)),
          fallbackTitle: src && !title ? `Visual ${index + 1}` : '',
        }
      })
      .filter((item) => item.src || item.title)
  }, [project])

  const hasCustomSections = Array.isArray(project?.sections) && project.sections.length > 0

  const storySections = useMemo(() => {
    if (!project) return []
    const fromSections = hasCustomSections
      ? project.sections
          .map((section, index) => ({
            id: section.id || `section-${slugify(section.title) || index}`,
            title: cleanText(section.title || `Section ${index + 1}`),
            text: cleanText(section.text || ''),
            media: mediaSrc(section.media || section.image || section.video),
            caption: cleanText(section.caption || ''),
          }))
          .filter((section) => section.title || section.text || section.media)
      : []
    const used = new Set(fromSections.map((s) => s.media).filter(Boolean))
    // Always append gallery images that aren't already used as section media
    const fromGallery = galleryItems
      .filter((item) => (item.src || item.title) && !(item.src && used.has(item.src)))
      .map((item, index) => ({
        id: `gallery-${index}`,
        title: cleanText(item.title || item.caption || item.fallbackTitle),
        text: cleanText(item.text),
        media: item.src,
        caption: cleanText(item.caption),
      }))
    if (fromSections.length) return [...fromSections, ...fromGallery]
    return fromGallery
  }, [project, hasCustomSections, galleryItems])

  const tocItems = useMemo(() => {
    const aboutLabel = cleanText(project?.aboutHeading || 'About the project:')
    const tourLabel = cleanText(project?.tour360Heading || '360° experience')
    const items = [{ id: 'about', title: aboutLabel }]
    if (project?.tour360) items.push({ id: 'tour-360', title: tourLabel })
    storySections.forEach((section) => {
      if (section.title) items.push({ id: section.id, title: section.title })
    })
    return items
  }, [project, storySections])

  useEffect(() => {
    const nodes = tocItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean)
    if (!nodes.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target?.id) setActiveToc(visible.target.id)
      },
      { rootMargin: '-18% 0px -58% 0px', threshold: [0.12, 0.3, 0.55] }
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [tocItems, id])

  useEffect(() => {
    if (lightbox === null) return undefined
    const total = lightbox.list?.length || 1
    const onKey = (event) => {
      if (event.key === 'Escape') setLightbox(null)
      if (event.key === 'ArrowRight') {
        setLightbox((state) =>
          state ? { ...state, index: (state.index + 1) % total } : state
        )
      }
      if (event.key === 'ArrowLeft') {
        setLightbox((state) =>
          state ? { ...state, index: (state.index - 1 + total) % total } : state
        )
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  const related = useMemo(() => {
    if (!project) return []
    return allProjects.filter((item) => item.id !== project.id && item.cat === project.cat).slice(0, 3)
  }, [project])

  if (!project || !text) {
    return (
      <main className="bg-[#0b0b0b] px-5 pt-36 pb-24 text-white sm:px-10">
        <h1 className="text-4xl">Project not found</h1>
        <a href="/all-projects" className="mt-6 inline-block text-[14px] text-[#e3943f]">
          ← Back to portfolio
        </a>
      </main>
    )
  }

  const titlePre = cleanText(project.titlePre || '')
  const titleLocation = cleanText(project.location || '')
  const titlePost = cleanText(project.titlePost || '')
  const title = cleanText(
    text.title || [titlePre, titleLocation, titlePost].filter(Boolean).join(' ') || 'Project'
  )
  const category = cleanText(text.category || project.type || 'Project')
  const area = cleanText(project.area || '')
  const locationLine = cleanText(
    [project.city, project.country].filter(Boolean).join(', ') || project.location || ''
  )
  const materials = cleanText(project.tone || '')
  // Hero accepts image OR video (admin may put either in video/image fields)
  const heroMedia = project.video || project.image || galleryItems[0]?.src || ''
  const isHeroVideo = isVideoSrc(heroMedia)
  const tour360 = cleanText(project.tour360 || '')
  const summary = cleanText(project.description || text.summary || '')
  const detailText = cleanText(project.detail || text.detail || '')
  const scopeList =
    Array.isArray(project.scope) && project.scope.length
      ? project.scope.map(cleanText).filter(Boolean)
      : Array.isArray(text.scope)
        ? text.scope.map(cleanText).filter(Boolean)
        : []
  const aboutHeading = cleanText(project.aboutHeading || 'About the project:')
  const featuresTitle = cleanText(project.featuresTitle || 'Project features')
  const enquireLabel = cleanText(project.enquireLabel || 'Enquire')
  const enquireLink = cleanText(project.enquireLink || '/contacts')
  const tour360Heading = cleanText(project.tour360Heading || '360° experience')
  const tocHeading = cleanText(project.tocHeading || 'Table of contents:')
  const readAlsoHeading = cleanText(project.readAlsoHeading || 'Read also:')
  const closingEyebrow = cleanText(project.closingEyebrow || 'Unique Graphics®')
  const closingTitle = cleanText(project.closingTitle || 'Step into the world of Unique Graphics®')
  const closingText = cleanText(
    project.closingText ||
      'A place where your dreams take shape through the unique vision of our studio. We look forward to embarking on this inspiring journey with you.'
  )
  const closingButtonLabel = cleanText(project.closingButtonLabel || 'Discuss this project')
  const closingButtonLink = cleanText(project.closingButtonLink || '/contacts')
  const readingMins = Math.max(
    3,
    Math.round(
      ([summary, detailText, ...storySections.map((s) => s.text)].join(' ').split(/\s+/).filter(Boolean).length || 200) /
        180
    )
  )
  const categoryHref =
    project.cat === 'interior'
      ? '/interior-design'
      : project.cat === 'commercial'
        ? '/commercial-interiors'
        : '/architectural-design'

  const openLightbox = (list, index) => setLightbox({ list, index })

  const sharePage = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title, url })
        return
      }
      await navigator.clipboard.writeText(url)
    } catch {
      // ignore
    }
  }

  const scrollToId = (sectionId) => {
    const node = document.getElementById(sectionId)
    if (!node) return
    node.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveToc(sectionId)
  }

  const lightboxSrc = lightbox?.list?.[lightbox.index]
  const storyMediaList = storySections.filter((s) => s.media).map((s) => s.media)
  // First story image used inside About card when no custom sections (Studia pattern)
  const aboutFeature = !hasCustomSections ? storySections[0] : null
  const remainingStories = (aboutFeature ? storySections.slice(1) : storySections).map((section) => ({
    ...section,
    media: section.media && section.media !== heroMedia ? section.media : '',
  }))
  const aboutCardMedia =
    aboutFeature?.media && aboutFeature.media !== heroMedia
      ? aboutFeature.media
      : ''
  const bannerMedia = heroMedia || aboutCardMedia || galleryItems[0]?.src || ''
  const enquireMediaPayload = {
    mediaUrl: bannerMedia,
    posterUrl: project.image || aboutFeature?.media || galleryItems[0]?.src || '',
    title,
    id: project.id || id,
  }

  return (
    <main className="bg-black text-white">
      {/* Full-bleed hero — Studia style */}
      <section className="relative min-h-[72vh] overflow-hidden bg-black pt-[72px] sm:min-h-[82vh] sm:pt-[80px] lg:min-h-[88vh]">
        {isHeroVideo ? (
          <video
            key={project.id}
            ref={video}
            src={heroMedia}
            muted
            loop
            playsInline
            autoPlay
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : heroMedia ? (
          <img
            key={project.id}
            src={heroMedia}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[#141414]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-transparent" />

        <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-10 sm:px-8 sm:pb-12 lg:px-12 lg:pb-14">
          <h1 className="max-w-[18ch] text-[34px] font-bold uppercase leading-[0.94] tracking-[-0.03em] text-white sm:max-w-[20ch] sm:text-[52px] lg:text-[64px] xl:text-[72px]">
            {titlePre || titleLocation || titlePost ? (
              <>
                {titlePre ? <span className="block">{titlePre}</span> : null}
                {titleLocation ? <span className="block text-[#e3943f]">{titleLocation}</span> : null}
                {titlePost ? <span className="block">{titlePost}</span> : null}
              </>
            ) : (
              <span className="block">{title}</span>
            )}
          </h1>
        </div>
      </section>

      {/* 3-column body */}
      <section className="relative z-10 mx-auto max-w-[1520px] px-4 pb-24 sm:px-6 lg:px-10 lg:pb-32">
        <div className="grid gap-12 lg:grid-cols-[200px_minmax(0,1fr)_220px] xl:grid-cols-[220px_minmax(0,1fr)_240px] xl:gap-16">
          {/* Left TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <a
                href={categoryHref}
                className="inline-flex items-center gap-1.5 text-[13px] text-white/50 transition-colors hover:text-[#e3943f]"
              >
                <span aria-hidden="true">‹</span>
                {category}
              </a>
              <p className="mt-9 text-[12px] font-bold uppercase tracking-[0.16em] text-[#e3943f]">
                {tocHeading}
              </p>
              <TocList items={tocItems} activeToc={activeToc} onSelect={scrollToId} />
            </div>
          </aside>

          {/* Center */}
          <div className="min-w-0">
            <div className="mb-10 lg:hidden">
              <a
                href={categoryHref}
                className="inline-flex items-center gap-1.5 text-[13px] text-white/50 hover:text-[#e3943f]"
              >
                <span aria-hidden="true">‹</span>
                {category}
              </a>
              <p className="mt-6 text-[12px] font-bold uppercase tracking-[0.16em] text-[#e3943f]">
                {tocHeading}
              </p>
              <TocList items={tocItems} activeToc={activeToc} onSelect={scrollToId} />
            </div>

            <article
              id="about"
              className="scroll-mt-28 rounded-[22px] bg-[#141414] p-6 sm:rounded-[28px] sm:p-9 lg:p-10"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <h2 className="text-[18px] font-semibold uppercase tracking-[0.06em] text-[#e3943f] sm:text-[20px]">
                  {aboutHeading}
                </h2>
                <div className="flex items-center gap-3 text-[13px] text-white/45">
                  <span className="inline-flex items-center gap-1.5">
                    <ClockIcon />~ {readingMins} min
                  </span>
                  <button
                    type="button"
                    onClick={sharePage}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/65 transition-colors hover:border-[#e3943f]/50 hover:text-[#e3943f]"
                    aria-label="Share"
                  >
                    <ShareIcon />
                  </button>
                </div>
              </div>

              <div className="mt-9 grid gap-8 border-t border-white/10 pt-8 sm:grid-cols-3 sm:gap-6">
                <SpecCol icon={<AreaIcon />} label="Area:" value={area} />
                <SpecCol icon={<TypeIcon />} label="Project type:" value={category} />
                <SpecCol icon={<PinIcon />} label="Location:" value={locationLine} />
              </div>

              {materials ? (
                <p className="mt-6 text-[13px] text-white/40">
                  Materials & tone: <span className="text-white/70">{materials}</span>
                </p>
              ) : null}

              <div className="mt-8 space-y-5 text-[15px] leading-[1.85] text-white/75 sm:text-[16px]">
                {summary ? <p>{summary}</p> : null}
                {detailText && detailText !== summary ? <p>{detailText}</p> : null}
              </div>

              <a
                href={enquireLink || '/contacts'}
                data-enquire-media={enquireMediaPayload.mediaUrl || undefined}
                data-enquire-poster={enquireMediaPayload.posterUrl || undefined}
                data-enquire-title={enquireMediaPayload.title || undefined}
                data-enquire-id={enquireMediaPayload.id || undefined}
                onMouseDown={() => prepareEnquireNavigation(enquireLink, enquireMediaPayload)}
                onClick={() => prepareEnquireNavigation(enquireLink, enquireMediaPayload)}
                className="mt-9 inline-flex rounded-full bg-[#e3943f] px-9 py-3.5 text-[12px] font-bold uppercase tracking-[0.16em] text-black transition-all hover:brightness-110"
              >
                {enquireLabel}
              </a>

              {aboutCardMedia ? (
                <MediaBlock
                  src={aboutCardMedia}
                  features={scopeList}
                  featuresTitle={featuresTitle}
                  onOpen={() => openLightbox(storyMediaList.length ? storyMediaList : [aboutCardMedia], 0)}
                />
              ) : null}
            </article>

            {tour360 ? (
              <section id="tour-360" className="mt-16 scroll-mt-28">
                <h2 className="text-[24px] font-semibold uppercase tracking-[0.04em] text-[#e3943f] sm:text-[28px]">
                  {tour360Heading}
                </h2>
                <div className="mt-7 overflow-hidden rounded-[22px] bg-[#141414]">
                  {isVideoSrc(tour360) ? (
                    <video src={tour360} controls playsInline className="aspect-[16/9] w-full object-cover" />
                  ) : /\.(jpg|jpeg|png|webp|gif|avif)(\?|#|$)/i.test(tour360) ||
                    tour360.startsWith('/') ||
                    tour360.startsWith('data:image') ? (
                    <img src={tour360} alt="360 view" className="aspect-[16/9] w-full object-cover" />
                  ) : (
                    <iframe
                      title="360 tour"
                      src={tour360}
                      className="aspect-[16/9] w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking"
                      allowFullScreen
                    />
                  )}
                </div>
              </section>
            ) : null}

            {remainingStories.map((section) => {
              const tocTitle =
                section.title ||
                tocItems.find((item) => item.id === section.id)?.title ||
                ''
              return (
                <section key={section.id} id={section.id} className="mt-16 scroll-mt-28 sm:mt-20">
                  {tocTitle ? (
                    <h2 className="text-[24px] font-semibold uppercase tracking-[0.04em] text-[#e3943f] sm:text-[28px]">
                      {tocTitle}
                    </h2>
                  ) : null}
                  {section.text ? (
                    <div className="mt-6 space-y-4 text-[15px] leading-[1.9] text-white/72 sm:text-[16px]">
                      {section.text.split(/\n+/).filter(Boolean).map((para) => (
                        <p key={para.slice(0, 24) + para.length}>{para}</p>
                      ))}
                    </div>
                  ) : null}
                  <MediaBlock
                    src={section.media}
                    caption={section.caption}
                    className={tocTitle || section.text ? 'mt-8' : 'mt-0'}
                    onOpen={() =>
                      openLightbox(
                        storyMediaList,
                        Math.max(0, storyMediaList.findIndex((src) => src === section.media))
                      )
                    }
                  />
                </section>
              )
            })}

            <div className="mt-20 border-t border-white/10 pt-12">
              {closingEyebrow ? (
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#e3943f]">
                  {closingEyebrow}
                </p>
              ) : null}
              {closingTitle ? (
                <h2 className="mt-3 max-w-[22ch] text-[26px] font-medium leading-tight sm:text-[32px]">
                  {closingTitle}
                </h2>
              ) : null}
              {closingText ? (
                <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-white/50">{closingText}</p>
              ) : null}
              {closingButtonLabel ? (
                <a
                  href={closingButtonLink || '/contacts'}
                  data-enquire-media={enquireMediaPayload.mediaUrl || undefined}
                  data-enquire-poster={enquireMediaPayload.posterUrl || undefined}
                  data-enquire-title={enquireMediaPayload.title || undefined}
                  data-enquire-id={enquireMediaPayload.id || undefined}
                  onMouseDown={() => prepareEnquireNavigation(closingButtonLink, enquireMediaPayload)}
                  onClick={() => prepareEnquireNavigation(closingButtonLink, enquireMediaPayload)}
                  className="mt-8 inline-flex rounded-full bg-[#e3943f] px-8 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-black transition-all hover:brightness-110"
                >
                  {closingButtonLabel}
                </a>
              ) : null}
            </div>
          </div>

          {/* Right — Read also */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#e3943f]">{readAlsoHeading}</p>
              <div className="mt-7 space-y-8">
                {related.length === 0 ? (
                  <p className="text-[13px] text-white/40">More projects coming soon.</p>
                ) : (
                  related.map((item) => {
                    const relatedTitle = cleanText(item.en?.title || item.titlePre || item.id)
                    return (
                      <a key={item.id} href={`/project/${item.id}`} className="group block">
                        <div className="overflow-hidden rounded-[14px] bg-[#141414]">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt=""
                              className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="aspect-[16/10] bg-[#1a1a1a]" />
                          )}
                        </div>
                        <p className="mt-3 text-[12px] font-semibold uppercase leading-snug tracking-[0.03em] text-[#e3943f] transition-opacity group-hover:opacity-80">
                          {relatedTitle}
                        </p>
                      </a>
                    )
                  })
                )}
              </div>
            </div>
          </aside>
        </div>

        {related.length > 0 ? (
          <div className="mt-16 lg:hidden">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#e3943f]">{readAlsoHeading}</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {related.map((item) => (
                <a key={item.id} href={`/project/${item.id}`} className="group block">
                  <div className="overflow-hidden rounded-[16px] bg-[#141414]">
                    {item.image ? (
                      <img src={item.image} alt="" className="aspect-[16/10] w-full object-cover" loading="lazy" />
                    ) : null}
                  </div>
                  <p className="mt-3 text-[12px] font-semibold uppercase text-[#e3943f]">
                    {cleanText(item.en?.title || item.titlePre || item.id)}
                  </p>
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </section>

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
          <div className="max-h-[88vh] max-w-[1200px]" onClick={(e) => e.stopPropagation()}>
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

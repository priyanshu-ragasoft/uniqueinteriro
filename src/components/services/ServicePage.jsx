import { useEffect, useState } from 'react'
import { categoryPath, findServicePage, getStoredServiceTree, setStoredServiceTree, subcategoryPath, SUBCATEGORY_MEDIA_MAP } from '../../data/serviceTree'
import { getRichPageForSlug } from '../../data/serviceDetailsConfig'

function visibleImages(images) {
  return (images || []).map((src) => String(src || '').trim()).filter(Boolean).slice(0, 3)
}

function isVideoSource(src) {
  const value = String(src || '').toLowerCase()
  return value.startsWith('data:video') || /\.(mp4|webm|ogg|mov)(\?|#|$)/.test(value)
}

export default function ServicePage({
  categorySlug,
  subcategorySlug,
  readTree = getStoredServiceTree,
  writeTree = setStoredServiceTree,
  endpoint = '/api/blogs/settings/services-pages',
  eventName = 'services-pages-config-changed',
}) {
  const [tree, setTree] = useState(() => readTree())
  const [bannerIndex, setBannerIndex] = useState(0)
  const [openHighlight, setOpenHighlight] = useState(null)

  useEffect(() => {
    const apply = (next) => setTree(next?.categories ? next : readTree())
    const onLocal = () => apply(readTree())
    window.addEventListener(eventName, onLocal)
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data?.categories) && data.data.categories.length) {
          writeTree({ categories: data.data.categories })
          apply(readTree())
        }
      })
      .catch(() => {})
    return () => window.removeEventListener(eventName, onLocal)
  }, [endpoint, eventName, readTree, writeTree])

  const match = findServicePage(tree, categorySlug, subcategorySlug)
  const slugKey = subcategorySlug || categorySlug
  const richFallback = getRichPageForSlug(slugKey, match?.subcategory?.name || match?.category?.name)
  const rawPage = match?.page || {}

  const defaultHighlightMedia =
    SUBCATEGORY_MEDIA_MAP[slugKey] ||
    '/website-assets/architecture/The%20Romania%20-%20Luxury%20Wedding%20Spaces%20BANQUET%20HALL/Golden%20Arch%20Banquet%20Hall%20at%20Night-6.png'

  const isBadMedia = (src) => {
    const s = String(src || '').trim().toLowerCase()
    if (!s) return true
    if (s === '/hero.jpg' || s.includes('hero.jpg')) return true
    if (s.includes('services-card.jpg')) return true
    if (s.includes('/uploads/1792')) return true
    if (s.includes('09.jpg') || s.includes('01.jpg')) return true
    if (s.includes('iphone') || s.includes('mockup')) return true
    return false
  }

  const sanitizeMedia = (src) => {
    return isBadMedia(src) ? defaultHighlightMedia : src
  }

  const rawImages = visibleImages(rawPage?.banner?.images).filter((src) => !isBadMedia(src))
  const images = rawImages.length
    ? rawImages
    : (richFallback?.banner?.images?.length
      ? richFallback.banner.images.filter((src) => !isBadMedia(src))
      : [defaultHighlightMedia])

  useEffect(() => {
    setBannerIndex(0)
  }, [categorySlug, subcategorySlug, images.length])

  useEffect(() => {
    if (images.length < 2) return undefined
    const timer = setInterval(() => {
      setBannerIndex((current) => (current + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [images.length, categorySlug, subcategorySlug])

  if (!match) {
    return (
      <main className="min-h-screen bg-[#111111] px-6 pt-40 pb-24 text-white">
        <div className="mx-auto max-w-[1600px]">
          <h1 className="text-4xl">Page not found</h1>
          <a href="/all-services" className="mt-4 inline-block text-[#e3943f] underline">
            Back to all services
          </a>
        </div>
      </main>
    )
  }

  const banner = {
    show: true,
    ...(richFallback?.banner || {}),
    ...(rawPage.banner || {}),
  }
  if (!banner.subtitle && richFallback?.banner?.subtitle) {
    banner.subtitle = richFallback.banner.subtitle
  }
  if (!banner.label && richFallback?.banner?.label) {
    banner.label = richFallback.banner.label
  }

  const intro = {
    show: true,
    ...(richFallback?.intro || {}),
    ...(rawPage.intro || {}),
  }
  if (!intro.heading && richFallback?.intro?.heading) intro.heading = richFallback.intro.heading
  if (!intro.paragraph1 && richFallback?.intro?.paragraph1) intro.paragraph1 = richFallback.intro.paragraph1
  if (!intro.paragraph2 && richFallback?.intro?.paragraph2) intro.paragraph2 = richFallback.intro.paragraph2

  const rawHighlights = (rawPage.highlights?.items || [])
    .filter((item) => item.title || item.text)
    .map((item) => ({
      ...item,
      image: sanitizeMedia(item.image),
    }))
  const highlights = (rawHighlights.length ? rawHighlights : (richFallback?.highlights?.items || [])).map((item) => ({
    ...item,
    image: sanitizeMedia(item.image),
  }))

  const rawSteps = (rawPage.steps?.items || []).filter((item) => item.title || item.text)
  const steps = rawSteps.length ? rawSteps : (richFallback?.steps?.items || [])

  const rawGallery = (rawPage.gallery?.items || [])
    .filter((item) => item.image)
    .map((item) => ({
      ...item,
      image: sanitizeMedia(item.image),
    }))
  const gallery = (rawGallery.length ? rawGallery : (richFallback?.gallery?.items || [])).map((item) => ({
    ...item,
    image: sanitizeMedia(item.image),
  }))

  const closing = {
    show: true,
    ...(richFallback?.closing || {}),
    ...(rawPage.closing || {}),
  }
  if (!closing.heading && richFallback?.closing?.heading) closing.heading = richFallback.closing.heading
  if (!closing.paragraph && richFallback?.closing?.paragraph) closing.paragraph = richFallback.closing.paragraph

  const slides = images.length ? images : [defaultHighlightMedia]
  const parentHref = match.kind === 'subcategory' ? categoryPath(match.category) : '/all-services'
  const parentLabel = match.kind === 'subcategory' ? match.category.name : 'Services'

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      {banner.show ? (
        <section className="relative flex min-h-[75vh] w-full flex-col justify-end overflow-hidden px-6 pt-32 pb-12 sm:px-10 lg:min-h-[85vh] lg:px-16 lg:pt-40 lg:pb-16">
          <div className="absolute inset-0 z-0 overflow-hidden bg-black">
            {slides.map((src, index) => (
              isVideoSource(src) ? (
                <video
                  key={`${src.slice(0, 48)}-${index}`}
                  src={src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={`absolute inset-0 h-full w-full object-cover object-center scale-105 transition-opacity duration-1000 ease-in-out ${
                    index === bannerIndex ? 'opacity-100 z-[1]' : 'opacity-0 z-0'
                  }`}
                />
              ) : (
                <img
                  key={`${src.slice(0, 48)}-${index}`}
                  src={src}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = defaultHighlightMedia
                  }}
                  className={`absolute inset-0 h-full w-full object-cover object-center scale-105 transition-opacity duration-1000 ease-in-out ${
                    index === bannerIndex ? 'opacity-100 z-[1]' : 'opacity-0 z-0'
                  }`}
                />
              )
            ))}
            <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#111111] via-black/40 to-black/60" />
            <div className="absolute inset-0 z-[2] bg-black/25" />
          </div>
          <div className="relative z-10 mx-auto w-full max-w-[1600px]">
            <a href={parentHref} className="mb-4 inline-flex items-center gap-2 text-[13px] font-medium text-white/70 hover:text-[#e3943f]">
              <span>‹</span>
              <span>{parentLabel}</span>
            </a>
            {banner.label ? (
              <p className="text-[12px] tracking-[0.2em] text-[#e3943f] uppercase">{banner.label}</p>
            ) : null}
            <h1 className="mt-3 text-[40px] leading-[0.95] font-bold tracking-[-0.02em] uppercase sm:text-[56px] lg:text-[72px]">
              <span className="block">{banner.title || match.subcategory?.name || match.category.name}</span>
              {banner.accent ? (
                <span className="mt-1 block text-[28px] text-[#e3943f] sm:text-[40px] lg:text-[52px]">{banner.accent}</span>
              ) : null}
            </h1>
            {banner.subtitle ? (
              <p className="mt-5 max-w-[85ch] text-[15px] leading-relaxed text-white/80 sm:text-[17px]">{banner.subtitle}</p>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-[1600px] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        {intro.heading || intro.paragraph1 || intro.paragraph2 ? (
          <div className="max-w-[820px]">
            {intro.heading ? <h2 className="text-[28px] font-medium tracking-tight sm:text-[38px]">{intro.heading}</h2> : null}
            {intro.paragraph1 ? <p className="mt-6 text-[16px] leading-relaxed text-white/80">{intro.paragraph1}</p> : null}
            {intro.paragraph2 ? <p className="mt-4 text-[16px] leading-relaxed text-white/80">{intro.paragraph2}</p> : null}
          </div>
        ) : null}

        {highlights.length ? (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setOpenHighlight(item)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="rounded-[20px] border border-white/10 bg-[#161616] p-4 text-left transition hover:border-[#e3943f]/50"
              >
                {item.image ? (
                  isVideoSource(item.image) ? (
                    <video src={item.image} muted loop playsInline autoPlay className="aspect-[16/10] w-full rounded-[14px] object-cover" />
                  ) : (
                    <img
                      src={item.image}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = defaultHighlightMedia
                      }}
                      className="aspect-[16/10] w-full rounded-[14px] object-cover"
                    />
                  )
                ) : null}
                {item.title ? <h3 className="mt-4 text-[17px] font-bold">{item.title}</h3> : null}
                {item.text ? <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-white/70">{item.text}</p> : null}
              </button>
            ))}
          </div>
        ) : null}

        {openHighlight ? (
          <div className="fixed inset-0 z-[80] overflow-y-auto bg-[#111111]">
            <div className="mx-auto max-w-[1100px] px-6 py-8 sm:px-10">
              <button
                type="button"
                onClick={() => setOpenHighlight(null)}
                className="text-[14px] text-white/70 hover:text-[#e3943f]"
              >
                ‹ Back
              </button>
              {openHighlight.image ? (
                isVideoSource(openHighlight.image) ? (
                  <video src={openHighlight.image} controls autoPlay muted loop playsInline className="mt-6 max-h-[70vh] w-full rounded-[20px] bg-black object-contain" />
                ) : (
                  <img
                    src={openHighlight.image}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = defaultHighlightMedia
                    }}
                    className="mt-6 max-h-[70vh] w-full rounded-[20px] bg-black object-contain"
                  />
                )
              ) : null}
              {openHighlight.title ? <h2 className="mt-8 text-[32px] font-semibold sm:text-[44px]">{openHighlight.title}</h2> : null}
              {openHighlight.text ? <p className="mt-4 max-w-[75ch] whitespace-pre-wrap text-[16px] leading-relaxed text-white/80">{openHighlight.text}</p> : null}
            </div>
          </div>
        ) : null}

        {steps.length ? (
          <div className="mt-16">
            <h3 className="text-[12px] tracking-[0.2em] text-white/50 uppercase">Implementation process</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {steps.map((step) => (
                <article key={step.id} className="rounded-[18px] border border-white/10 bg-[#161616] p-5">
                  <span className="text-[18px] font-bold text-[#e3943f]">{step.number}</span>
                  <h4 className="mt-2 text-[15px] font-bold">{step.title}</h4>
                  {step.text ? <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/70">{step.text}</p> : null}
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {gallery.length ? (
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item) => (
              <figure key={item.id} className="overflow-hidden rounded-[18px] border border-white/10 bg-[#161616]">
                {isVideoSource(item.image) ? (
                  <video src={item.image} muted loop playsInline autoPlay className="aspect-[4/3] w-full object-cover" />
                ) : (
                  <img
                    src={item.image}
                    alt={item.caption || ''}
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = defaultHighlightMedia
                    }}
                    className="aspect-[4/3] w-full object-cover"
                  />
                )}
                {item.caption ? <figcaption className="px-4 py-3 text-[13px] text-white/70">{item.caption}</figcaption> : null}
              </figure>
            ))}
          </div>
        ) : null}

        {closing.heading || closing.paragraph ? (
          <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-[24px] border border-[#e3943f]/30 bg-[#161616] p-8 sm:p-12 md:flex-row md:items-center">
            <div>
              {closing.heading ? <h3 className="text-[24px] font-bold sm:text-[30px]">{closing.heading}</h3> : null}
              {closing.paragraph ? <p className="mt-2 max-w-[65ch] text-[15px] text-white/75">{closing.paragraph}</p> : null}
            </div>
            {closing.buttonLabel ? (
              <a href={closing.buttonLink || '/contacts'} className="shrink-0 rounded-full bg-[#e3943f] px-8 py-4 text-[13px] font-bold tracking-[0.14em] text-black uppercase">
                {closing.buttonLabel}
              </a>
            ) : null}
          </div>
        ) : null}

        {match.kind === 'category' && match.category.subcategories.some((sub) => sub.published) ? (
          <div className="mt-16">
            <h3 className="text-[12px] tracking-[0.2em] text-[#e3943f] uppercase">Within {match.category.name}</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {match.category.subcategories
                .filter((sub) => sub.published)
                .map((sub) => (
                  <a key={sub.id} href={subcategoryPath(match.category, sub)} className="rounded-[18px] border border-white/10 bg-[#161616] p-5 hover:border-[#e3943f]/60">
                    <p className="text-[16px] font-bold">{sub.name}</p>
                    {sub.menuDescription ? <p className="mt-2 text-[13px] text-white/70">{sub.menuDescription}</p> : null}
                  </a>
                ))}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  )
}

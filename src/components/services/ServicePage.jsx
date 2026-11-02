import { useEffect, useState } from 'react'
import {
  categoryPath,
  findServicePage,
  getStoredServiceTree,
  serviceGalleryPath,
  serviceHighlightPath,
  setStoredServiceTree,
  subcategoryPath,
  SUBCATEGORY_MEDIA_MAP,
} from '../../data/serviceTree'

function visibleImages(images) {
  return (images || []).map((src) => String(src || '').trim()).filter(Boolean).slice(0, 3)
}

function isVideoSource(src) {
  const value = String(src || '').toLowerCase()
  return value.startsWith('data:video') || /\.(mp4|webm|ogg|mov)(\?|#|$)/.test(value)
}

function Media({ src, className, alt = '', fallback = '' }) {
  if (!src) return null
  if (isVideoSource(src)) {
    return <video src={src} muted loop playsInline autoPlay className={className} />
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={(event) => {
        if (!fallback) return
        event.currentTarget.onerror = null
        event.currentTarget.src = fallback
      }}
      className={className}
    />
  )
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
  const rawPage = match?.page || {}
  const fallbackMedia =
    SUBCATEGORY_MEDIA_MAP[subcategorySlug || categorySlug] ||
    '/website-assets/architecture/The%20Romania%20-%20Luxury%20Wedding%20Spaces%20BANQUET%20HALL/Golden%20Arch%20Banquet%20Hall%20at%20Night-6.png'

  const isBadMedia = (src) => {
    const s = String(src || '').trim().toLowerCase()
    if (!s) return true
    if (s === '/hero.jpg' || s.includes('hero.jpg')) return true
    if (s.includes('services-card.jpg')) return true
    if (s.includes('/uploads/1792')) return true
    if (s.includes('iphone') || s.includes('mockup')) return true
    return false
  }

  const images = visibleImages(rawPage?.banner?.images).filter((src) => !isBadMedia(src))
  const heroImage = images[0] || ''
  const extraBanners = images.slice(1)

  if (!match) {
    return (
      <main className="min-h-screen bg-[#111111] px-6 pt-40 pb-24 text-white">
        <div className="mx-auto max-w-[1600px]">
          <h1 className="text-4xl">Page not found</h1>
          <a href="/services" className="mt-4 inline-block text-[#e3943f] underline">
            Back to all services
          </a>
        </div>
      </main>
    )
  }

  const banner = rawPage.banner || { show: true }
  const intro = rawPage.intro || {}
  const highlights = (rawPage.highlights?.show === false ? [] : rawPage.highlights?.items || [])
    .filter((item) => item.published !== false && (item.title || item.text || item.image))
    .map((item) => ({ ...item, image: item.image && !isBadMedia(item.image) ? item.image : '' }))
  const steps = (rawPage.steps?.show === false ? [] : rawPage.steps?.items || []).filter((item) => item.title || item.text)
  const gallery = (rawPage.gallery?.show === false ? [] : rawPage.gallery?.items || [])
    .filter((item) => item.published !== false && item.image && !isBadMedia(item.image))
  const closing = rawPage.closing || {}
  const showIntro = intro.show !== false && (intro.heading || intro.paragraph1 || intro.paragraph2)
  const showClosing = closing.show !== false && (closing.heading || closing.paragraph || closing.buttonLabel)
  const title = banner.title || match.subcategory?.name || match.category.name
  const parentHref = match.kind === 'subcategory' ? categoryPath(match.category) : '/services'
  const parentLabel = match.kind === 'subcategory' ? match.category.name : 'Services'
  const introVisual = highlights.find((item) => item.image) || null
  const featureList = highlights.filter((item) => item !== introVisual)
  const subs = (match.kind === 'category' ? match.category.subcategories : []).filter((sub) => sub.published && sub.showInMenu !== false)
  const used = new Set([heroImage, introVisual?.image].filter(Boolean))
  const widePhotos = [
    ...gallery,
    ...extraBanners.map((src, index) => ({ id: `banner-extra-${index}`, image: src, caption: '', title: '' })),
  ].filter((item) => {
    if (!item.image || used.has(item.image)) return false
    used.add(item.image)
    return true
  })
  const midPhoto = widePhotos[0]
  const landscapePhotos = widePhotos.slice(1)
  const closingPhoto = landscapePhotos[landscapePhotos.length - 1]?.image || midPhoto?.image || extraBanners[0] || ''

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      {banner.show !== false ? (
        <section className="relative flex min-h-[88svh] w-full flex-col justify-end overflow-hidden px-6 pb-16 pt-32 sm:px-10 lg:min-h-[92svh] lg:px-16 lg:pb-24">
          <div className="absolute inset-0 z-0 overflow-hidden bg-black">
            {heroImage ? (
              <Media src={heroImage} fallback={fallbackMedia} className="absolute inset-0 h-full w-full object-cover object-center" />
            ) : null}
            <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/80 via-black/25 to-black/15" />
          </div>
          <div className="relative z-10 mx-auto w-full max-w-[1180px]">
            <a
              href={parentHref}
              className="mb-10 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[13px] text-white/85 backdrop-blur-sm hover:bg-white/20"
            >
              <span>‹</span>
              <span>{parentLabel}</span>
            </a>
            {banner.label ? (
              <p className="mb-4 text-[12px] tracking-[0.22em] text-white/55 uppercase">{banner.label}</p>
            ) : null}
            {title ? (
              <h1 className="max-w-[18ch] text-[32px] font-light leading-[1.08] tracking-[-0.03em] sm:text-[46px] lg:text-[56px]">
                {title}
                {banner.accent ? ` ${banner.accent}` : ''}
              </h1>
            ) : null}
            {banner.subtitle ? (
              <p className="mt-6 max-w-[60ch] text-[16px] leading-relaxed text-white/80 sm:text-[18px]">{banner.subtitle}</p>
            ) : null}
          </div>
        </section>
      ) : null}

      {showIntro || introVisual ? (
        <section className="mx-auto grid max-w-[1180px] items-center gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:px-16 lg:py-28">
          {showIntro ? (
            <div>
              {intro.heading ? (
                <h2 className="max-w-[18ch] text-[28px] font-light leading-[1.15] tracking-[-0.03em] sm:text-[40px]">
                  {intro.heading}
                </h2>
              ) : null}
              {intro.paragraph1 ? <p className="mt-6 text-[16px] leading-relaxed text-white/70">{intro.paragraph1}</p> : null}
              {intro.paragraph2 ? <p className="mt-4 text-[16px] leading-relaxed text-white/70">{intro.paragraph2}</p> : null}
              {showClosing && closing.buttonLabel ? (
                <a
                  href={closing.buttonLink || '/contacts'}
                  className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-[13px] text-black hover:bg-[#e3943f]"
                >
                  {closing.buttonLabel}
                </a>
              ) : null}
            </div>
          ) : null}
          {introVisual ? (
            <a
              href={serviceHighlightPath(match.category, match.subcategory, introVisual)}
              className="flex min-h-[360px] items-center justify-center rounded-[28px] bg-black/40 p-6 lg:min-h-[480px]"
            >
              <Media
                src={introVisual.image}
                fallback={fallbackMedia}
                alt={introVisual.title || ''}
                className="max-h-[460px] w-full object-contain"
              />
            </a>
          ) : extraBanners[0] ? (
            <Media src={extraBanners[0]} fallback={fallbackMedia} className="w-full rounded-[28px] object-cover lg:min-h-[420px]" />
          ) : null}
        </section>
      ) : null}

      {featureList.length ? (
        <section className="mx-auto max-w-[1180px] px-6 pb-20 sm:px-10 lg:px-16">
          <div className="grid gap-x-16 gap-y-12 sm:grid-cols-2">
            {featureList.map((item) => (
              <a
                key={item.id}
                href={serviceHighlightPath(match.category, match.subcategory, item)}
                className="group flex items-start gap-5"
              >
                {item.image ? (
                  <Media src={item.image} fallback={fallbackMedia} className="mt-0.5 h-14 w-14 shrink-0 rounded-xl object-cover" />
                ) : (
                  <span className="mt-0.5 h-14 w-14 shrink-0 rounded-xl bg-white/5" />
                )}
                <div>
                  {item.title ? (
                    <h3 className="text-[20px] font-light leading-tight group-hover:text-[#e3943f]">{item.title}</h3>
                  ) : null}
                  {item.text ? <p className="mt-2 text-[14px] leading-relaxed text-white/60">{item.text}</p> : null}
                </div>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {steps.length ? (
        <section className="mx-auto max-w-[1180px] px-6 pb-20 sm:px-10 lg:px-16">
          <div className="grid gap-x-16 gap-y-10 sm:grid-cols-2">
            {steps.map((step) => (
              <article key={step.id} className="flex items-start gap-5">
                <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-[13px] text-white/50">
                  {step.number || ''}
                </span>
                <div>
                  <h4 className="text-[20px] font-light">{step.title}</h4>
                  {step.text ? <p className="mt-2 text-[14px] leading-relaxed text-white/60">{step.text}</p> : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {midPhoto ? (
        <section className="relative my-6 overflow-hidden">
          <Media
            src={midPhoto.image}
            fallback={fallbackMedia}
            alt={midPhoto.caption || midPhoto.title || ''}
            className="h-[42vw] min-h-[260px] max-h-[520px] w-full object-cover"
          />
          {showClosing && closing.buttonLabel ? (
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent px-6 py-10 sm:px-10 lg:px-16">
              <a
                href={closing.buttonLink || '/contacts'}
                className="rounded-full bg-white px-6 py-3 text-[13px] text-black hover:bg-[#e3943f]"
              >
                {closing.buttonLabel}
              </a>
            </div>
          ) : null}
        </section>
      ) : null}

      {landscapePhotos.length ? (
        <section className="space-y-8 py-10">
          {landscapePhotos.map((item) => (
            <a
              key={item.id}
              href={item.slug ? serviceGalleryPath(match.category, match.subcategory, item) : serviceGalleryPath(match.category, match.subcategory, item)}
              className="block"
            >
              <Media
                src={item.image}
                fallback={fallbackMedia}
                alt={item.caption || item.title || ''}
                className="h-[46vw] min-h-[240px] max-h-[580px] w-full object-cover"
              />
              {item.caption || item.title ? (
                <p className="mx-auto max-w-[1180px] px-6 pt-3 text-[14px] text-white/55 sm:px-10 lg:px-16">
                  {item.caption || item.title}
                </p>
              ) : null}
            </a>
          ))}
        </section>
      ) : null}

      {subs.length ? (
        <section className="mx-auto max-w-[1180px] px-6 pb-16 sm:px-10 lg:px-16">
          <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {subs.map((sub) => (
              <a key={sub.id} href={subcategoryPath(match.category, sub)} className="group">
                <p className="text-[20px] font-light group-hover:text-[#e3943f]">{sub.name}</p>
                {sub.menuDescription ? <p className="mt-2 text-[14px] text-white/55">{sub.menuDescription}</p> : null}
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {showClosing ? (
        <section className="relative overflow-hidden">
          {closingPhoto ? (
            <Media src={closingPhoto} fallback={fallbackMedia} className="absolute inset-0 h-full w-full object-cover" />
          ) : null}
          <div className={`relative px-6 py-24 sm:px-10 lg:px-16 ${closingPhoto ? 'bg-black/55' : ''}`}>
            <div className="mx-auto max-w-[1180px]">
              {closing.heading ? (
                <h3 className="max-w-[18ch] text-[32px] font-light leading-[1.1] tracking-[-0.03em] sm:text-[44px]">
                  {closing.heading}
                </h3>
              ) : null}
              {closing.paragraph ? (
                <p className="mt-5 max-w-[60ch] text-[16px] leading-relaxed text-white/75">{closing.paragraph}</p>
              ) : null}
              {closing.buttonLabel ? (
                <a
                  href={closing.buttonLink || '/contacts'}
                  className="mt-8 inline-flex rounded-full bg-white px-7 py-3 text-[14px] text-black hover:bg-[#e3943f]"
                >
                  {closing.buttonLabel}
                </a>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  )
}

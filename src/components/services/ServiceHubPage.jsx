import { useEffect, useState } from 'react'
import Clients from '../Clients'
import {
  categoryPath,
  findServicePage,
  getStoredServiceTree,
  menuCategories,
  serviceGalleryPath,
  setStoredServiceTree,
} from '../../data/serviceTree'
import { getMediaDetailsInfo } from '../../utils/mediaProjectMatcher'

function ImageDetailModal({ open, item, onClose }) {
  if (!open || !item) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl bg-[#161616] border border-white/10 p-6 sm:p-8 text-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
        >
          ✕
        </button>
        {item.image ? (
          <div className="relative overflow-hidden rounded-xl bg-black max-h-[60vh] flex items-center justify-center mb-6">
            <Media src={item.image} className="max-h-[60vh] w-auto max-w-full object-contain" />
          </div>
        ) : null}
        <h3 className="text-xl sm:text-2xl font-light tracking-tight">{item.title || 'Project Details'}</h3>
        {item.subtitle ? <p className="mt-3 text-sm sm:text-base text-white/70 leading-relaxed">{item.subtitle}</p> : null}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a
            href="/contacts"
            className="inline-flex rounded-full bg-[#e3943f] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-black hover:bg-white transition-colors"
          >
            Discuss a project
          </a>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white/70 hover:bg-white/10 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function visibleImages(images) {
  return (images || []).map((src) => String(src || '').trim()).filter(Boolean).slice(0, 3)
}

function isVideoSource(src) {
  const value = String(src || '').toLowerCase()
  return value.startsWith('data:video') || /\.(mp4|webm|ogg|mov)(\?|#|$)/.test(value)
}

function isBadMedia(src) {
  const s = String(src || '').trim().toLowerCase()
  if (!s) return true
  if (s === '/hero.jpg' || s.includes('hero.jpg')) return true
  if (s.includes('services-card.jpg')) return true
  if (s.includes('/uploads/1792')) return true
  if (s.includes('iphone') || s.includes('mockup')) return true
  return false
}

function categoryMedia(item) {
  const menuImage = String(item.menuImage || '').trim()
  const menuVideo = String(item.menuVideo || '').trim()
  const banner = visibleImages(item.page?.banner?.images).find((src) => !isBadMedia(src)) || ''
  if (menuImage && !isBadMedia(menuImage)) return menuImage
  if (menuVideo && !isBadMedia(menuVideo)) return menuVideo
  return banner
}

function Media({ src, className, alt = '' }) {
  if (!src) return null
  if (isVideoSource(src)) {
    return <video src={src} muted loop playsInline autoPlay className={className} />
  }
  return <img src={src} alt={alt} className={className} />
}

const SERVICE_CARDS = {
  architecture: {
    icon: '/services/benefit-icons/column.webp',
    text: 'The house is drawn before it is built: plans, sections, and elevations so the structure, the openings, and the ceiling heights already agree.',
  },
  interiors: {
    icon: '/services/benefit-icons/house-star.webp',
    text: 'Rooms planned for daily use, with layouts, finishes, joinery, and light set out for the way the house is lived in.',
  },
  'for-business': {
    icon: '/services/benefit-icons/value.webp',
    text: 'Commercial rooms for guests and staff, arranged so the brand, the seating, and the service line hold up on a busy night.',
  },
  'bim-engineering': {
    icon: '/services/benefit-icons/star.webp',
    text: 'One coordinated model, so architecture, structure, and services are checked against each other before they meet on site.',
  },
  'design-supervision': {
    icon: '/services/benefit-icons/shield.webp',
    text: 'The site is checked against the drawings, so a finish is not closed up until the built work matches what was approved.',
  },
  'construction-management': {
    icon: '/services/benefit-icons/hourglass.webp',
    text: 'The build stays on an agreed sequence, with trades, deliveries, and inspections lined up so the site does not stall.',
  },
}

function photoItem(src, id) {
  return { id, image: src, caption: '', title: '', slug: '' }
}

function DisciplineStrip({ items }) {
  return (
    <div className="mx-auto grid w-full max-w-[1480px] grid-cols-2 gap-x-8 gap-y-14 sm:grid-cols-3 lg:grid-cols-7">
      {items.map((item) => {
        const media = categoryMedia(item)
        return (
          <a key={item.id} href={categoryPath(item)} className="group flex flex-col items-center text-center">
            <span className="flex h-[108px] w-[108px] items-center justify-center rounded-full bg-[#e3943f] p-[2px] shadow-[0_16px_40px_rgba(0,0,0,0.4)] transition duration-300 group-hover:shadow-[0_0_0_1px_#e3943f,0_0_32px_rgba(227,148,63,0.45)] sm:h-[124px] sm:w-[124px]">
              <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-black">
                {media ? (
                  <Media src={media} alt="" className="pointer-events-none h-full w-full object-cover object-center transition duration-500 group-hover:scale-105" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                )}
              </span>
            </span>
            <span className="mt-5 max-w-[14ch] text-[14px] font-light leading-snug text-white/88 transition-colors group-hover:text-[#e3943f] sm:text-[15px]">
              {item.name}
            </span>
          </a>
        )
      })}
    </div>
  )
}

export default function ServiceHubPage({
  readTree = getStoredServiceTree,
  writeTree = setStoredServiceTree,
  endpoint = '/api/blogs/settings/services-pages',
  eventName = 'services-pages-config-changed',
}) {
  const [tree, setTree] = useState(() => readTree())
  const [fallbackModal, setFallbackModal] = useState({ open: false, image: '', title: '', subtitle: '' })

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

  const match = findServicePage(tree, 'all-services', '')
  const rawPage = match?.page || {}
  const hub = match?.category || { slug: 'all-services' }
  const images = visibleImages(rawPage?.banner?.images).filter((src) => !isBadMedia(src))
  const disciplines = menuCategories(tree)
  const banner = rawPage.banner || { show: true }
  const intro = rawPage.intro || {}
  const gallery = (rawPage.gallery?.show === false ? [] : rawPage.gallery?.items || [])
    .filter((item) => item.published !== false && item.image && !isBadMedia(item.image))
  const closing = rawPage.closing || {}
  const showClosing = closing.show !== false && (closing.heading || closing.buttonLabel)
  const title = banner.title || ''
  const heroImage = images[0] || ''
  const heroDetails = getMediaDetailsInfo(heroImage, title, banner.link || banner.href)
  const widePhotos = (gallery.length ? gallery : images.slice(1).map((src, index) => photoItem(src, `banner-${index + 2}`)))
  const villaPhoto = widePhotos[0]
  const secondHouse = widePhotos[2]
  const closingBg = widePhotos[widePhotos.length - 1]?.image || images[2] || ''

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      {banner.show !== false ? (
        <section className="relative h-[100dvh] w-full overflow-hidden bg-black group">
          {heroImage ? (
            <a
              href={heroDetails.href || '#'}
              onClick={(e) => {
                if (!heroDetails.href) {
                  e.preventDefault()
                  setFallbackModal({
                    open: true,
                    image: heroImage,
                    title: title || 'Project Details',
                    subtitle: banner.subtitle || '',
                  })
                }
              }}
              className="group/hero block absolute inset-0 h-full w-full cursor-pointer z-10"
              aria-label={heroDetails.title || 'View project details'}
              title={heroDetails.title ? `View details: ${heroDetails.title}` : 'View project details'}
            >
              <Media
                src={heroImage}
                className="absolute inset-0 h-full w-full max-w-none origin-center scale-[1.38] object-cover object-center transition-transform duration-700 ease-out group-hover/hero:scale-[1.42]"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 pointer-events-none" />

              {/* Floating Pill Badge */}
              <div className="absolute bottom-8 left-6 sm:bottom-12 sm:left-12 z-20 pointer-events-none">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/25 bg-black/65 px-5 py-2.5 text-[12px] sm:text-[13px] font-medium tracking-[0.14em] text-white uppercase backdrop-blur-md shadow-2xl transition-all duration-300 group-hover/hero:border-[#e3943f] group-hover/hero:bg-black/90 group-hover/hero:text-[#e3943f]">
                  <span className="max-w-[260px] sm:max-w-[420px] truncate">
                    {heroDetails.title || 'View Project Details'}
                  </span>
                  <span className="text-[14px] text-[#e3943f] transition-transform duration-300 group-hover/hero:translate-x-1">
                    ↗
                  </span>
                </div>
              </div>
            </a>
          ) : null}
          {title ? <h1 className="sr-only">{title}{banner.accent ? ` ${banner.accent}` : ''}</h1> : null}
        </section>
      ) : null}

      {disciplines.length ? (
        <section className="bg-[#111111] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
          {intro.show !== false ? (
            <h2 className="mx-auto mb-16 max-w-[16ch] text-center text-[26px] font-light leading-[1.15] tracking-[-0.03em] sm:text-[38px]">
              From the first drawing to the finished room.
            </h2>
          ) : null}
          <DisciplineStrip items={disciplines} />
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-[1560px] px-5 pb-16 sm:px-8 lg:px-10">
        <div className="grid gap-3 sm:grid-cols-2 lg:gap-4">
          {disciplines.filter((item) => SERVICE_CARDS[item.id] || SERVICE_CARDS[item.slug]).map((item) => {
            const card = SERVICE_CARDS[item.id] || SERVICE_CARDS[item.slug]
            return (
              <a
                key={item.id}
                href={categoryPath(item)}
                className="flex min-h-[220px] items-center justify-between gap-6 rounded-[22px] bg-[#1a1a1a] px-7 py-6 sm:min-h-[250px] sm:px-9"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="text-[18px] font-medium uppercase tracking-[0.08em] text-[#e3943f] sm:text-[22px]">
                    {item.name}
                  </h3>
                  <p className="mt-4 text-[16px] leading-[1.55] text-white/72 sm:text-[18px]">{card.text}</p>
                </div>
                <img src={card.icon} alt="" className="h-[150px] w-[150px] shrink-0 object-contain sm:h-[190px] sm:w-[190px]" />
              </a>
            )
          })}
        </div>
      </section>

      {villaPhoto ? (
        <section>
          {(() => {
            const details = getMediaDetailsInfo(villaPhoto.image, villaPhoto.caption || villaPhoto.title)
            const targetHref = villaPhoto.slug ? serviceGalleryPath(hub, null, villaPhoto) : (details.href || '/services')
            return (
              <a
                href={targetHref}
                className="group block relative overflow-hidden"
                title={details.title ? `View details: ${details.title}` : 'View project details'}
              >
                <Media
                  src={villaPhoto.image}
                  alt={villaPhoto.caption || villaPhoto.title || ''}
                  className="h-[48vw] min-h-[280px] max-h-[640px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </a>
            )
          })()}
        </section>
      ) : null}

      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <p className="mx-auto max-w-[22ch] text-center text-[24px] font-light leading-[1.25] tracking-[-0.03em] text-white/85 sm:text-[32px]">
          The sketch, the room, and the site, held in one hand.
        </p>
      </section>

     

      {secondHouse ? (
        <section>
          {(() => {
            const details = getMediaDetailsInfo(secondHouse.image, secondHouse.caption || secondHouse.title)
            const targetHref = secondHouse.slug ? serviceGalleryPath(hub, null, secondHouse) : (details.href || '/services')
            return (
              <a
                href={targetHref}
                className="group block relative overflow-hidden"
                title={details.title ? `View details: ${details.title}` : 'View project details'}
              >
                <Media
                  src={secondHouse.image}
                  alt={secondHouse.caption || secondHouse.title || ''}
                  className="h-[46vw] min-h-[260px] max-h-[600px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </a>
            )
          })()}
        </section>
      ) : null}

      {showClosing ? (
        <section className="relative overflow-hidden">
          {closingBg ? (
            <Media src={closingBg} className="absolute inset-0 h-full w-full object-cover" />
          ) : null}
          <div className={`relative px-6 py-24 sm:px-10 lg:px-16 ${closingBg ? 'bg-black/55' : ''}`}>
            <div className="mx-auto max-w-[1100px]">
              {closing.heading ? (
                <h3 className="max-w-[16ch] text-[30px] font-light leading-[1.1] tracking-[-0.03em] sm:text-[42px]">
                  {closing.heading}
                </h3>
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

      <div className="pt-10 sm:pt-16 lg:pt-20">
        <Clients runnerOnly />
      </div>
       <section className="px-4 pt-16 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1280px] items-center gap-10 rounded-[28px] bg-[#161616] px-6 py-10 sm:px-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:px-14 lg:py-12">
          <div>
            <h2 className="max-w-[18ch] text-[22px] font-medium uppercase leading-[1.25] tracking-[0.04em] text-white sm:text-[28px]">
              A project with Unique Graphics is a partnership that stays after handover
            </h2>
            <p className="mt-5 max-w-[42ch] text-[15px] leading-relaxed text-white/62 sm:text-[16px]">
              The same studio stays on the work once the keys are handed over, so the next room begins from what was already built.
            </p>
            <p className="mt-8 text-[28px] font-medium text-[#e3943f] sm:text-[34px]">98%</p>
            <p className="mt-2 max-w-[28ch] text-[15px] leading-snug text-white/70">
              of clients recommend the studio
            </p>
            <a
              href="/contacts"
              className="mt-8 inline-flex rounded-full bg-[#e3943f] px-6 py-3 text-[12px] font-medium uppercase tracking-[0.14em] text-black hover:bg-white"
            >
              Contact the studio
            </a>
          </div>
          <div className="overflow-hidden rounded-[24px]">
            {(() => {
              const gwUrl = '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg'
              const details = getMediaDetailsInfo(gwUrl, 'Greenwood Avenue Mullanpur')
              return (
                <a
                  href={details.href || '/all-projects'}
                  className="group block overflow-hidden rounded-[24px]"
                  title={details.title ? `View details: ${details.title}` : 'View project details'}
                >
                  <img
                    src={gwUrl}
                    alt="Unique Graphics project"
                    className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[460px] transition-transform duration-700 group-hover:scale-105"
                  />
                </a>
              )
            })()}
          </div>
        </div>
      </section>

      <ImageDetailModal
        open={fallbackModal.open}
        item={fallbackModal}
        onClose={() => setFallbackModal({ open: false, image: '', title: '', subtitle: '' })}
      />
    </main>
  )
}

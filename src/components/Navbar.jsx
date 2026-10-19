import { useEffect, useRef, useState } from 'react'
import { menuPages } from '../data/menuPages'
import { reelForPage } from '../data/reels'
import LoopVideo from './LoopVideo'
import { FaInstagram, FaPinterest, FaVk, FaYoutube } from 'react-icons/fa'

const copy = {
  en: {
    contact: 'Contact us',
    about: 'About',
    portfolio: 'Portfolio',
    contacts: 'Contacts',
    services: 'Services',
    blog: 'Blog',
    menu: 'Menu',
    search: 'Search',
    portfolioLinks: [
      ['all-projects', 'All projects'],
      ['architectural-design', 'Architectural design'],
      ['interior-design', 'Interior design'],
      ['commercial-design', 'Commercial design'],
    ],
    serviceLinks: [
      ['all-services', 'All services'],
      ['architecture', 'Architecture'],
      ['interiors', 'Interiors'],
      ['commercial-interiors', 'Commercial interiors'],
      ['2d-3d-design', '2D / 3D design'],
      ['walkthrough', 'Walkthrough'],
      ['bim-engineering', 'BIM engineering'],
      ['design-supervision', 'Design supervision'],
      ['construction-management', 'Construction management'],
      ['procurement', 'Procurement'],
    ],
  },
  ru: {
    contact: 'Связаться',
    about: 'О нас',
    portfolio: 'Портфолио',
    contacts: 'Контакты',
    services: 'Услуги',
    blog: 'Блог',
    menu: 'Меню',
    search: 'Поиск',
    portfolioLinks: [
      ['all-projects', 'Все проекты'],
      ['architectural-design', 'Архитектурное проектирование'],
      ['interior-design', 'Дизайн интерьера'],
      ['commercial-design', 'Коммерческий дизайн'],
    ],
    serviceLinks: [
      ['all-services', 'Все услуги'],
      ['architecture', 'Архитектура'],
      ['interiors', 'Интерьеры'],
      ['commercial-interiors', 'Коммерческие интерьеры'],
      ['2d-3d-design', '2D / 3D дизайн'],
      ['walkthrough', '3D Видеотур (Walkthrough)'],
      ['bim-engineering', 'BIM проектирование'],
      ['design-supervision', 'Авторский надзор'],
      ['construction-management', 'Управление строительством'],
      ['procurement', 'Комплектация'],
    ],
  },
}

const menus = {
  portfolio: {
    links: 'portfolioLinks',
    image: '/nav/portfolio-card.jpg',
    alt: 'Courtyard outside a glass living room',
  },
  services: {
    links: 'serviceLinks',
    image: '/nav/services-card.jpg',
    alt: 'Modern villa at dusk',
  },
}

function Chevron({ open }) {
  return (
    <svg
      viewBox="0 0 12 8"
      aria-hidden="true"
      className={`size-2 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    >
      <path
        d="M1 1.4 L6 6.4 L11 1.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M7 16H41" />
      <path d="M19 24H41" />
      <path d="M7 32H41" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.5 11.5a8.5 8.5 0 0 1-12.9 7.3L3 20l1.2-4.1A8.5 8.5 0 1 1 20.5 11.5Z" />
      <circle cx="8.5" cy="11.5" r=".7" fill="currentColor" stroke="none" />
      <circle cx="12" cy="11.5" r=".7" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="11.5" r=".7" fill="currentColor" stroke="none" />
    </svg>
  )
}
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[18px]">
      <path
        d="M12 21.5s6.2-5.35 6.2-10.15A6.2 6.2 0 0 0 12 5.15a6.2 6.2 0 0 0-6.2 6.2C5.8 16.15 12 21.5 12 21.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="12" cy="11.2" r="2.1" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

import { getStoredPortfolioConfig } from '../data/portfolioConfig'
import { getStoredServicesConfig } from '../data/servicesConfig'

function MenuLinks({ items, onNavigate, onHover, activeId }) {
  const [portfolioNav, setPortfolioNav] = useState(() => getStoredPortfolioConfig().navCards)
  const [servicesNav, setServicesNav] = useState(() => getStoredServicesConfig().navCards)

  useEffect(() => {
    const handlePortfolioUpdate = () => {
      setPortfolioNav(getStoredPortfolioConfig().navCards)
    }
    const handleServicesUpdate = () => {
      setServicesNav(getStoredServicesConfig().navCards)
    }
    window.addEventListener('portfolio-pages-config-changed', handlePortfolioUpdate)
    window.addEventListener('services-pages-config-changed', handleServicesUpdate)
    return () => {
      window.removeEventListener('portfolio-pages-config-changed', handlePortfolioUpdate)
      window.removeEventListener('services-pages-config-changed', handleServicesUpdate)
    }
  }, [])

  return (
    <ul className="flex flex-col gap-4">
      {items.map(([id, label]) => {
        const customTitle = portfolioNav?.[id]?.title || servicesNav?.[id]?.title
        return (
          <li key={id}>
            <a
              href={`/${id}`}
              onClick={onNavigate}
              onMouseEnter={() => onHover?.(id)}
              onFocus={() => onHover?.(id)}
              className={`text-[13px] tracking-[0.16em] uppercase transition-colors hover:text-[#e3943f] ${activeId === id ? 'text-[#e3943f]' : 'text-white'
                }`}
            >
              {customTitle || label}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

function MenuPreview({ id, fallback }) {
  const [portfolioNav, setPortfolioNav] = useState(() => getStoredPortfolioConfig().navCards)
  const [servicesNav, setServicesNav] = useState(() => getStoredServicesConfig().navCards)

  useEffect(() => {
    const handlePortfolioUpdate = () => {
      setPortfolioNav(getStoredPortfolioConfig().navCards)
    }
    const handleServicesUpdate = () => {
      setServicesNav(getStoredServicesConfig().navCards)
    }
    window.addEventListener('portfolio-pages-config-changed', handlePortfolioUpdate)
    window.addEventListener('services-pages-config-changed', handleServicesUpdate)
    return () => {
      window.removeEventListener('portfolio-pages-config-changed', handlePortfolioUpdate)
      window.removeEventListener('services-pages-config-changed', handleServicesUpdate)
    }
  }, [])

  const customCard = portfolioNav?.[id] || servicesNav?.[id]
  const page = menuPages.find((item) => item.id === id)
  const text = page?.en

  const title = customCard?.title || text?.title || ''
  const caption = customCard?.hover || text?.hover || ''
  const image = customCard?.image || page?.image || fallback.image
  const video = customCard?.video ? customCard.video : (page ? reelForPage(page.id) : null)

  return (
    <PreviewCard
      video={video}
      image={image}
      focus={page?.focus ?? 'center'}
      title={title}
      caption={caption}
    />
  )
}

function PreviewCard({ image, focus, title, caption, video }) {
  return (
    <div className="w-full max-w-[280px]">
      {video ? (
        <LoopVideo
          src={video}
          className="aspect-square w-full rounded-[22px] object-cover shadow-[0_18px_40px_rgba(0,0,0,0.28)]"
        />
      ) : (
        <img
          src={image}
          alt=""
          style={{ objectPosition: focus }}
          className="aspect-square w-full rounded-[22px] object-cover shadow-[0_18px_40px_rgba(0,0,0,0.28)]"
        />
      )}
      <p className="mt-4 text-[12px] tracking-[0.16em] text-[#e3943f] uppercase font-bold">{title}</p>
      <p className="mt-2 text-[14px] leading-snug text-white/80">{caption}</p>
    </div>
  )
}

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [barHover, setBarHover] = useState(false)
  const [previewId, setPreviewId] = useState(null)
  const headerRef = useRef(null)
  const closeTimer = useRef(null)
  const scrollTimer = useRef(null)
  const scrolling = useRef(false)
  const text = copy.en
  const activeMenu = openMenu ? menus[openMenu] : null

  useEffect(() => {
    const onScroll = () => {
      scrolling.current = true
      setScrolled(window.scrollY > 40)
      setBarHover(false)
      setOpenMenu(null)
      clearTimeout(scrollTimer.current)
      scrollTimer.current = setTimeout(() => {
        scrolling.current = false
      }, 160)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(scrollTimer.current)
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenMenu(null)
        setMobileOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      clearTimeout(closeTimer.current)
    }
  }, [])

  const clearClose = () => clearTimeout(closeTimer.current)

  const scheduleClose = () => {
    clearClose()
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140)
  }

  const showMenu = (id) => {
    clearClose()
    setOpenMenu(id)
    const first = text[menus[id].links][0][0]
    setPreviewId(first)
  }

  const toggleMenu = (id) => {
    clearClose()
    setOpenMenu((current) => (current === id ? null : id))
  }

  const closeAll = () => {
    setOpenMenu(null)
    setMobileOpen(false)
  }

  const revealLinks = () => {
    if (scrolling.current) return
    setBarHover(true)
  }

  const linksOpen = !scrolled || barHover
  const path = window.location.pathname

  const linkClass =
    'text-[13px] tracking-[0.2em] text-white uppercase transition-opacity hover:opacity-70'

  const mobileItem = (href) =>
    `text-[16px] tracking-[0.14em] uppercase ${path === href ? 'text-[#e3943f]' : 'text-white'}`

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-[80] text-white"
      onMouseEnter={() => {
        clearClose()
        revealLinks()
      }}
      onMouseMove={revealLinks}
      onMouseLeave={() => {
        setBarHover(false)
        scheduleClose()
      }}
    >
      <div
        className={`nav-glass relative border-b border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] ${openMenu || mobileOpen ? 'nav-glass-open' : ''
          }`}
      >
        <div className="relative">
          <div className="flex h-16 items-center justify-between px-4 sm:h-20 sm:px-8 lg:px-12">
            {/* Left Side: Logo */}
            <a href="/" className="relative flex items-center" onClick={closeAll}>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-1/2 h-10 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/45 blur-lg"
              />
              <img
                src="/logouniqe.png"
                alt="Unique Graphics"
                className="relative h-11 w-auto max-w-[140px] object-contain md:h-14 md:max-w-[200px]"
              />
            </a>

            {/* Right Side: Contact Us & Mobile Actions */}
            <div className="flex items-center justify-end gap-4">
              <a
                href="/contacts"
                className="hidden items-center gap-2.5 text-[13px] tracking-[0.2em] uppercase md:flex transition-opacity hover:opacity-75"
                onClick={closeAll}
              >
                {text.contact}
                <PinIcon />
              </a>
              <a
                href="/contacts"
                className="flex size-10 items-center justify-center md:hidden"
                aria-label={text.contact}
                onClick={closeAll}
              >
                <ChatIcon />
              </a>
              <button
                type="button"
                className="flex size-10 items-center justify-center md:hidden"
                aria-expanded={mobileOpen}
                aria-controls="mobile-navigation"
                aria-label={text.menu}
                onClick={() => {
                  setMobileOpen((open) => !open)
                  setOpenMenu(null)
                }}
              >
                <MenuIcon />
              </button>
            </div>
          </div>

          <div
            className={`hidden transition-[grid-template-rows,opacity] duration-500 ease-out md:grid ${linksOpen ? 'grid-rows-[1fr] opacity-100' : 'pointer-events-none grid-rows-[0fr] opacity-0'
              }`}
          >
            <div className="overflow-hidden">
              <div className="mx-4 border-t border-white/30 sm:mx-8 lg:mx-10" />

              <nav aria-label="Primary" className="flex h-14 items-center justify-center gap-10 lg:gap-14">
                <a href="/about" className={linkClass} onMouseEnter={() => setOpenMenu(null)} onClick={closeAll}>
                  {text.about}
                </a>
                <button
                  type="button"
                  className={`${linkClass} inline-flex items-center gap-2`}
                  aria-expanded={openMenu === 'portfolio'}
                  aria-controls="portfolio-menu"
                  onMouseEnter={() => showMenu('portfolio')}
                  onClick={() => toggleMenu('portfolio')}
                >
                  <span className={openMenu === 'portfolio' ? 'underline decoration-white underline-offset-[10px]' : ''}>
                    {text.portfolio}
                  </span>
                  <Chevron open={openMenu === 'portfolio'} />
                </button>
                <a href="/contacts" className={linkClass} onMouseEnter={() => setOpenMenu(null)} onClick={closeAll}>
                  {text.contacts}
                </a>
                <button
                  type="button"
                  className={`${linkClass} inline-flex items-center gap-2`}
                  aria-expanded={openMenu === 'services'}
                  aria-controls="services-menu"
                  onMouseEnter={() => showMenu('services')}
                  onClick={() => toggleMenu('services')}
                >
                  <span className={openMenu === 'services' ? 'underline decoration-white underline-offset-[10px]' : ''}>
                    {text.services}
                  </span>
                  <Chevron open={openMenu === 'services'} />
                </button>
                <a href="/blog" className={linkClass} onMouseEnter={() => setOpenMenu(null)} onClick={closeAll}>
                  {text.blog}
                </a>
              </nav>
            </div>
          </div>

          {activeMenu && linksOpen ? (
            <div id={`${openMenu}-menu`} className="nav-panel hidden px-8 pt-8 pb-12 md:block lg:px-10">
              <div className="mx-auto flex max-w-[760px] items-start justify-center gap-16 lg:gap-24">
                <MenuLinks
                  items={text[activeMenu.links]}
                  onNavigate={closeAll}
                  onHover={setPreviewId}
                  activeId={previewId}
                />
                <MenuPreview id={previewId} fallback={activeMenu} />
              </div>
            </div>
          ) : null}

        </div>
      </div>

      <div className={`fixed inset-0 z-[90] md:hidden ${mobileOpen ? '' : 'pointer-events-none'}`}>
        <button
          type="button"
          aria-label="Close"
          className={`absolute inset-0 bg-black/25 transition-opacity duration-500 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileOpen(false)}
        />
        <nav
          id="mobile-navigation"
          aria-label="Primary"
          className={`absolute inset-y-0 right-0 flex w-[84%] flex-col overflow-y-auto bg-black/50 px-7 py-8 shadow-[-24px_0_40px_rgba(0,0,0,0.25)] backdrop-blur-sm transition-transform duration-500 ease-out ${mobileOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className="flex items-start justify-between gap-4">
            <a href="/" onClick={closeAll} className="max-w-[12ch] text-[28px] leading-[0.95] font-light tracking-[0.08em] text-white uppercase">
              Unique Graphics
            </a>
            <button type="button" className="flex size-10 shrink-0 items-center justify-center" aria-label="Close" onClick={() => setMobileOpen(false)}>
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M6 6 L18 18 M18 6 L6 18" />
              </svg>
            </button>
          </div>
          <div className="mt-10 flex flex-col gap-6">
            <a href="/about" className={mobileItem('/about')} onClick={closeAll}>
              {text.about}
            </a>
            <button
              type="button"
              className={`${mobileItem()} inline-flex items-center gap-3 self-start`}
              aria-expanded={openMenu === 'portfolio'}
              onClick={() => toggleMenu('portfolio')}
            >
              {text.portfolio}
              <Chevron open={openMenu === 'portfolio'} />
            </button>
            {openMenu === 'portfolio' ? (
              <div className="-mt-2 pl-1">
                <MenuLinks items={text.portfolioLinks} onNavigate={closeAll} onHover={setPreviewId} activeId={previewId} />
              </div>
            ) : null}
            <a href="/contacts" className="text-[16px] tracking-[0.14em] text-[#e3943f] uppercase" onClick={closeAll}>
              {text.contacts}
            </a>
            <button
              type="button"
              className={`${mobileItem()} inline-flex items-center gap-3 self-start`}
              aria-expanded={openMenu === 'services'}
              onClick={() => toggleMenu('services')}
            >
              {text.services}
              <Chevron open={openMenu === 'services'} />
            </button>
            {openMenu === 'services' ? (
              <div className="-mt-2 pl-1">
                <MenuLinks items={text.serviceLinks} onNavigate={closeAll} onHover={setPreviewId} activeId={previewId} />
              </div>
            ) : null}
            <a href="/career" className={mobileItem('/career')} onClick={closeAll}>
              Career
            </a>
            <a href="/blog" className={mobileItem('/blog')} onClick={closeAll}>
              Blog
            </a>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-[11.5px] tracking-[0.18em] text-white/50 uppercase">We're on social media</p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/80 transition-all duration-300 hover:scale-110 hover:border-[#e3943f] hover:bg-[#e3943f] hover:text-black"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Pinterest"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/80 transition-all duration-300 hover:scale-110 hover:border-[#e3943f] hover:bg-[#e3943f] hover:text-black"
              >
                <FaPinterest className="h-5 w-5" />
              </a>
              <a
                href="https://vk.com"
                target="_blank"
                rel="noreferrer"
                aria-label="VKontakte"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/80 transition-all duration-300 hover:scale-110 hover:border-[#e3943f] hover:bg-[#e3943f] hover:text-black"
              >
                <FaVk className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/80 transition-all duration-300 hover:scale-110 hover:border-[#e3943f] hover:bg-[#e3943f] hover:text-black"
              >
                <FaYoutube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}

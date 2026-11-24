import { useEffect, useState } from 'react'
import { FaInstagram, FaFacebook, FaBehance } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { DEFAULT_SITE_CHROME, getStoredSiteChrome, setStoredSiteChrome } from '../data/siteChrome'
function newestFirst(list) {
  return [...list].sort((a, b) => {
    const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime()
    const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime()
    return bTime - aTime
  })
}

const copy = {
  en: {
    primary: [
      ['/about', 'About us'],
      ['/contacts', 'Contacts'],
      ['/services', 'Services'],
      ['/all-projects', 'Portfolio'],
      ['/commercial-interiors', 'Commercials'],
      ['/blog', 'Studio Blog & Journal'],
      ['/', 'Home'],
    ],
    secondary: [
      ['/architectural-design', 'Architectural design'],
      ['/interior-design', 'Residential interiors'],
      ['/all-projects', 'Living room'],
      ['/all-projects', 'Bedroom'],
      ['/all-projects', 'Kitchen'],
      ['/all-projects', 'Villa'],
      ['/all-projects', 'Office'],
    ],
    worldwide: 'We work all over the world',
    facts: [
      ['/', '32 countries', 'portfolio'],
      ['/all-projects', '650 completed projects'],
      ['/', '98% of clients recommend us', 'partner'],
      ['/', '10+ years of practice', 'partner'],
    ],
    cooperation: 'Cooperation',
    steps: [
      ['/contacts', '1. Fill out the form'],
      ['/contacts', '2. We contact you'],
      ['/contacts', '3. Receive a tailored offer'],
    ],
    contactLink: 'Contact the studio',
    brand: 'Unique Graphics',
    rights: '© 2026 Unique Graphics. All rights reserved.',
    privacy: 'Privacy Policy',
    terms: 'Terms & Conditions',
    socialTitle: "We're on social media",
    socials: ['Instagram', 'Facebook', 'X', 'Behance'],
    contact: 'Contact us',
  },
}

const SOCIAL_LINKS = [
  { name: 'Instagram', url: 'https://www.instagram.com/uniquegraphics.interior/', Icon: FaInstagram },
  { name: 'Facebook', url: 'https://www.facebook.com/UniqueGraphics.Interior', Icon: FaFacebook },
  { name: 'X', url: 'https://x.com/UniqueGraphicsX', Icon: FaXTwitter },
  { name: 'Behance', url: 'https://www.behance.net/uniquegraphics02', Icon: FaBehance },
]

function ColumnLinks({ items }) {
  return (
    <ul className="flex flex-col gap-4">
      {items.map(([href, label, section]) => (
        <li key={label}>
          <a
            href={href}
            data-section={section}
            className={`text-[13px] tracking-[0.12em] uppercase transition-colors ${
              href === '/blog'
                ? 'text-[#e3943f] font-semibold hover:text-[#f2ad61]'
                : 'hover:text-white/70'
            }`}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  )
}

export default function Footer() {
  const [chrome, setChrome] = useState(() => getStoredSiteChrome())
  const text = { ...copy.en, ...chrome.footer }
  const [journal, setJournal] = useState([])

  useEffect(() => {
    const apply = () => setChrome(getStoredSiteChrome())
    window.addEventListener('site-chrome-config-changed', apply)
    fetch('/api/blogs/settings/site-chrome')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data.data) {
          const next = { ...DEFAULT_SITE_CHROME, ...data.data }
          setStoredSiteChrome(next)
          setChrome(next)
        }
      })
      .catch(() => {})
    return () => window.removeEventListener('site-chrome-config-changed', apply)
  }, [])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch('/api/blogs?published=true')
        if (!res.ok) return
        const json = await res.json()
        if (!json.success || !Array.isArray(json.data)) return
        const live = newestFirst(json.data).filter((post) => post.published !== false).slice(0, 8)
        if (!cancelled) setJournal(live)
      } catch {}
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      {journal.length > 0 && (
      <section className="bg-black text-white">
        <div className="mx-auto max-w-[1440px] px-6 pt-14 pb-12 sm:px-10">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[#e3943f]" />
              <h3 className="text-[11px] font-bold tracking-[0.2em] text-white/60 uppercase">
                Studio Journal & Recent Publications
              </h3>
            </div>
            <a
              href="/blog"
              className="group flex items-center gap-2 text-[12px] font-bold tracking-[0.12em] text-[#e3943f] uppercase hover:text-[#f4b56c]"
            >
              <span>Read All Articles</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
            {journal.map((item) => (
              <a
                key={item.slug || item._id || item.title}
                href="/blog"
                className="group flex w-[82%] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-3.5 transition-all duration-300 hover:border-[#e3943f]/60 hover:bg-white/[0.05] sm:w-auto sm:shrink"
              >
                <div>
                  <div className="relative mb-3 h-[160px] w-full overflow-hidden rounded-lg">
                    <img src={item.image || '/hero.jpg'} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute top-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-[9px] font-bold tracking-wider text-[#e3943f] uppercase">
                      {item.category}
                    </span>
                  </div>
                  <h4 className="line-clamp-2 text-[14px] leading-snug font-medium text-white/90 group-hover:text-[#e3943f]">
                    {item.title}
                  </h4>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-white/[0.05] pt-2 text-[11px] text-white/40">
                  <span>{item.readTime || ''}</span>
                  <span className="font-semibold text-[#e3943f]">Explore →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      )}
    <footer className="bg-black text-white">
      {/* Main Grid Navigation */}
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-14 sm:px-10 lg:grid-cols-[0.8fr_1fr_1fr_1fr_1.1fr] lg:gap-8 lg:py-16">
        <ColumnLinks items={text.primary} />
        <ColumnLinks items={text.secondary} />
        <div>
          <p className="text-[13px] tracking-[0.12em] uppercase">{text.worldwide}</p>
          <ul className="mt-4 flex flex-col gap-3">
            {text.facts.map(([href, label, section]) => (
              <li key={label}>
                <a
                  href={href}
                  data-section={section}
                  className="text-[15px] leading-snug text-white/80 hover:text-white"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a href="/contacts" className="mt-4 inline-block text-[14px] underline underline-offset-4">
            {text.contactLink}
          </a>
        </div>
        <div>
          <p className="text-[13px] tracking-[0.12em] uppercase">{text.cooperation}</p>
          <ul className="mt-4 flex flex-col gap-3">
            {text.steps.map(([href, label, section]) => (
              <li key={label}>
                <a
                  href={href}
                  data-section={section}
                  className="text-[15px] leading-snug text-white/80 hover:text-white"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[34px] leading-none font-medium tracking-[-0.03em] sm:text-[42px]">
            {text.brand}
          </p>
          <p className="mt-8 text-[12px] tracking-[0.14em] uppercase">{text.socialTitle}</p>
          <div className="mt-4 flex items-center gap-3">
            {SOCIAL_LINKS.map(({ name, url, Icon }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-[15px] text-white/85 transition-all hover:scale-110 hover:border-[#e3943f] hover:bg-[#e3943f] hover:text-black"
              >
                <Icon aria-hidden />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright & Legal Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-6 py-4 sm:px-10">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-white/65">
          <a href="/privacy" className="hover:text-white">
            {text.privacy}
          </a>
          <a href="/terms" className="hover:text-white">
            {text.terms}
          </a>
         
        
        </div>
        <p className="text-[13px] text-white/55">{text.rights}</p>
      </div>
    </footer>
    </>
  )
}

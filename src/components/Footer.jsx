import { useEffect, useState } from 'react'
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
      ['/all-services', 'Services'],
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
    socials: ['Instagram', 'Pinterest', 'VKontakte', 'YouTube'],
    contact: 'Contact us',
  },
  ru: {
    primary: [
      ['/about', 'О нас'],
      ['/contacts', 'Контакты'],
      ['/all-services', 'Услуги'],
      ['/all-projects', 'Портфолио'],
      ['/commercial-interiors', 'Коммерция'],
      ['/blog', 'Блог и Журнал'],
      ['/', 'Начало'],
    ],
    secondary: [
      ['/architectural-design', 'Архитектура'],
      ['/interior-design', 'Жилые интерьеры'],
      ['/all-projects', 'Гостиная'],
      ['/all-projects', 'Спальня'],
      ['/all-projects', 'Кухня'],
      ['/all-projects', 'Вилла'],
      ['/all-projects', 'Офис'],
    ],
    worldwide: 'Работаем по всему миру',
    facts: [
      ['/', '32 страны', 'portfolio'],
      ['/all-projects', '650 реализованных проектов'],
      ['/', '98% клиентов рекомендуют нас', 'partner'],
      ['/', '10+ лет практики', 'partner'],
    ],
    cooperation: 'Сотрудничество',
    steps: [
      ['/contacts', '1. Заполните форму'],
      ['/contacts', '2. Мы свяжемся'],
      ['/contacts', '3. Получите предложение'],
      ['/blog', 'Архитектурный журнал'],
    ],
    contactLink: 'Связаться со студией',
    brand: 'Unique Graphics',
    rights: '© 2026 Unique Graphics',
    socialTitle: 'Мы в социальных сетях',
    socials: ['Instagram', 'Pinterest', 'VKontakte', 'YouTube'],
    contact: 'Связаться',
  },
}

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
  const text = copy.en
  const [journal, setJournal] = useState([])

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
          <ul className="mt-4 flex flex-col gap-2">
            {text.socials.map((name) => (
              <li key={name} className="text-[15px] text-white/85">
                {name}
              </li>
            ))}
          </ul>
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

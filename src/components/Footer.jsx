const featuredJournal = [
  {
    title: 'The Spatial Poetry of Monumental Villas',
    category: 'Architecture',
    image: '/architectural/dubai_villa.jpg',
    readTime: '6 min read',
  },
  {
    title: 'The Neo-Monaco Aesthetic: Liquid Bronze & Onyx',
    category: 'Interior Design',
    image: '/interior/monaco.jpg',
    readTime: '5 min read',
  },
  {
    title: 'Biophilic Grand Atriums in Hospitality',
    category: 'Commercial',
    image: '/commercial/atrium.jpg',
    readTime: '7 min read',
  },
  {
    title: 'Alpine Haute Living in Courchevel 1850',
    category: 'Alpine Architecture',
    image: '/architectural/courchevel_chalet.jpg',
    readTime: '6 min read',
  },
]

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
      ['/blog', 'Studio Journal & Insights'],
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

  return (
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

      {/* Featured Studio Journal & Blog Section in Footer */}
      <div className="border-t border-white/10 mx-auto max-w-[1440px] px-6 sm:px-10 pt-10 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-[#e3943f]" />
            <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/60">
              STUDIO JOURNAL & RECENT PUBLICATIONS
            </h3>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <span className="sm:hidden text-[10.5px] font-mono tracking-wider text-[#e3943f] uppercase flex items-center gap-1">
              Swipe <span>→</span>
            </span>
            <a
              href="/blog"
              className="group flex items-center gap-2 text-[12px] font-bold tracking-[0.12em] text-[#e3943f] uppercase hover:text-[#f4b56c] transition-colors"
            >
              <span>Read All Articles</span>
              <svg
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>

        <div
          data-lenis-prevent="true"
          className="flex sm:grid overflow-x-auto sm:overflow-visible sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-3 sm:pb-0 no-scrollbar snap-x snap-mandatory -mx-6 px-6 sm:mx-0 sm:px-0"
        >
          {featuredJournal.map((item) => (
            <a
              key={item.title}
              href="/blog"
              className="group flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-3.5 transition-all duration-300 hover:border-[#e3943f]/60 hover:bg-white/[0.05] shrink-0 w-[275px] sm:w-auto snap-start"
            >
              <div>
                <div className="relative h-[130px] w-full overflow-hidden rounded-lg mb-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-[9px] font-bold tracking-wider text-[#e3943f] uppercase">
                    {item.category}
                  </span>
                </div>
                <h4 className="text-[13px] font-medium leading-snug text-white/90 group-hover:text-[#e3943f] transition-colors line-clamp-2">
                  {item.title}
                </h4>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-white/40 pt-2 border-t border-white/[0.05]">
                <span>{item.readTime}</span>
                <span className="text-[#e3943f] font-semibold group-hover:underline">Explore →</span>
              </div>
            </a>
          ))}
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
          <a href="/blog" className="hover:text-[#e3943f] text-[#e3943f]/80">
            Journal
          </a>
          <a href="/admin" className="hover:text-[#e3943f] text-white/40 transition-colors">
            Portal
          </a>
        </div>
        <p className="text-[13px] text-white/55">{text.rights}</p>
      </div>
    </footer>
  )
}

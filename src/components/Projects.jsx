import { useState, useEffect } from 'react'
import areaIcon from '../assets/icons/avrproj.png'
import recommendIcon from '../assets/icons/customerrecomadation.png'
import manufacturingIcon from '../assets/icons/manufacturing.png'
import rewardIcon from '../assets/icons/reward.png'
import globeImage from '../assets/hero/globe.png'

export const STAT_ICONS = {
  area: areaIcon,
  recommend: recommendIcon,
  manufacturing: manufacturingIcon,
  reward: rewardIcon,
}

export const DEFAULT_PROJECTS_CONFIG = {
  en: {
    title: 'Completed projects in 32 countries',
    before: 'We have showcasing projects in the distinctive Unique Graphics style around the world ',
    accent: 'the most extensive portfolio',
    button: 'Discover portfolio',
    buttonLink: '/all-projects',
    globeImage: '',
    stats: [
      {
        value: '1 200 m²',
        label: 'Average project area',
        desc: 'Private residences, luxury estates, and penthouses designed with bespoke spatial flow and volumetric architecture.',
        detail: 'From 600 m² urban apartments to 4,500 m² hillside villas.',
        note: '',
        iconKey: 'area',
      },
      {
        value: '98%',
        label: 'Client recommendation rate',
        desc: 'Over 85% of our new commissions originate from direct client referrals and repeat projects for secondary vacation estates.',
        detail: '',
        note: 'We continuously measure client loyalty index (NPS) across each project phase.',
        iconKey: 'recommend',
      },
      {
        value: '2 000 m²',
        label: 'In-house manufacturing facility',
        desc: 'Dedicated joinery, stone carving, custom metalwork, and upholstery workshops delivering flawless execution without third-party delays.',
        detail: 'Italian CNC milling & artisan hand finishing.',
        note: '',
        iconKey: 'manufacturing',
      },
      {
        value: '10+ years',
        label: 'Global architectural leadership',
        desc: 'International portfolio spanning Dubai, London, Miami, Como, and Moscow with complete engineering and design precision.',
        detail: 'Honored by international luxury design juries.',
        note: '',
        iconKey: 'reward',
      },
    ],
  },
  ru: {
    title: 'Реализованные проекты в 32 странах',
    before: 'Мы показываем проекты в узнаваемом стиле Unique Graphics по всему миру ',
    accent: 'самое обширное портфолио',
    button: 'Смотреть портфолио',
    buttonLink: '/all-projects',
    globeImage: '',
    stats: [
      {
        value: '1 200 м²',
        label: 'Средняя площадь проекта',
        desc: 'Частные резиденции, загородные виллы и пентхаусы с авторской эргономикой и индивидуальным объёмно-пространственным решением.',
        detail: 'От городских апартаментов 600 м² до загородных резиденций свыше 4 500 м².',
        note: '',
        iconKey: 'area',
      },
      {
        value: '98%',
        label: 'Индекс рекомендации клиентов',
        desc: 'Более 85% новых проектов начинаются по личной рекомендации клиентов и повторных обращений для обустройства новых резиденций.',
        detail: '',
        note: 'Мы непрерывно измеряем индекс лояльности NPS на всех этапах проектирования.',
        iconKey: 'recommend',
      },
      {
        value: '2 000 м²',
        label: 'Собственное производство в Санкт-Петербурге',
        desc: 'Столярные цеха, камнеобработка, витражные и металлические мастерские гарантируют безупречное совпадение чертежей и готовых изделий.',
        detail: 'Итальянские ЧПУ станки и авторская ручная доводка.',
        note: '',
        iconKey: 'manufacturing',
      },
      {
        value: '10+ лет',
        label: 'Опыта в премиальной архитектуре',
        desc: 'Международное портфолио в Дубае, Лондоне, Майами, Комо и Москве с бескомпромиссным контролем качества и сроков строительства.',
        detail: 'Лауреаты международных премий в сфере люксовой архитектуры.',
        note: '',
        iconKey: 'reward',
      },
    ],
  },
}

export default function Projects({ lang = 'en' }) {
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('ug_homepage_projects_config')
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          en: { ...DEFAULT_PROJECTS_CONFIG.en, ...(parsed.en || parsed) },
          ru: { ...DEFAULT_PROJECTS_CONFIG.ru, ...(parsed.ru || parsed) },
          globeImage: parsed.globeImage || '',
        }
      }
    } catch {}
    return DEFAULT_PROJECTS_CONFIG
  })

  // Sync with MongoDB backend setting
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/blogs/settings/projects-section')
        const data = await res.json()
        if (data.success && data.data) {
          const merged = {
            en: { ...DEFAULT_PROJECTS_CONFIG.en, ...(data.data.en || data.data) },
            ru: { ...DEFAULT_PROJECTS_CONFIG.ru, ...(data.data.ru || data.data) },
            globeImage: data.data.globeImage || '',
          }
          setConfig(merged)
          localStorage.setItem('ug_homepage_projects_config', JSON.stringify(data.data))
        }
      } catch {}
    }

    fetchConfig()

    // Listen to real-time update events from Admin panel
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('ug_homepage_projects_config')
        if (saved) {
          const parsed = JSON.parse(saved)
          setConfig({
            en: { ...DEFAULT_PROJECTS_CONFIG.en, ...(parsed.en || parsed) },
            ru: { ...DEFAULT_PROJECTS_CONFIG.ru, ...(parsed.ru || parsed) },
            globeImage: parsed.globeImage || '',
          })
        }
      } catch {}
    }

    window.addEventListener('ug_projects_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('ug_projects_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  const currentLang = lang === 'ru' ? 'ru' : 'en'
  const text = config[currentLang] || DEFAULT_PROJECTS_CONFIG[currentLang]
  const displayedGlobe = text.globeImage || config.globeImage || globeImage

  const getStatIcon = (stat) => {
    if (!stat) return areaIcon
    if (stat.iconKey && STAT_ICONS[stat.iconKey]) {
      return STAT_ICONS[stat.iconKey]
    }
    if (stat.icon) {
      if (typeof stat.icon === 'string' && STAT_ICONS[stat.icon]) {
        return STAT_ICONS[stat.icon]
      }
      return stat.icon
    }
    return areaIcon
  }

  return (
    <section id="portfolio" className="scroll-mt-16 bg-[#141414] text-white">
      <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 pt-16 pb-6 sm:px-10 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)] lg:gap-16 lg:px-16 lg:pt-20 lg:pb-4">
        <div className="w-full max-w-[520px]">
          <h2 className="max-w-[11em] text-[34px] leading-[1.12] font-normal tracking-[-0.02em] text-white sm:text-[46px] lg:text-[52px]">
            {text.title || DEFAULT_PROJECTS_CONFIG.en.title}
          </h2>
          <p className="mt-7 max-w-[390px] text-[16px] leading-[1.55] text-[#eceae6] sm:mt-8 sm:text-[18px]">
            {text.before || DEFAULT_PROJECTS_CONFIG.en.before}
            <span className="text-[#e3943f]">{text.accent || DEFAULT_PROJECTS_CONFIG.en.accent}</span>
          </p>
          <a
            href={text.buttonLink || '/all-projects'}
            className="mt-9 inline-flex rounded-full border border-[#c9843a] px-7 py-3.5 text-[12px] font-medium tracking-[0.14em] text-[#e3943f] uppercase transition-colors hover:bg-[#e3943f]/10 sm:mt-10"
          >
            {text.button || DEFAULT_PROJECTS_CONFIG.en.button}
          </a>
        </div>

        <div className="w-full lg:justify-self-end">
          <img
            src={displayedGlobe}
            alt="Unique Graphics Global Architecture"
            className="block h-auto w-full max-w-[540px] select-none object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-[1480px] grid-cols-1 gap-5 px-5 pb-20 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-10 lg:pb-28">
        {(text.stats || DEFAULT_PROJECTS_CONFIG.en.stats).map((stat, idx) => (
          <article
            key={idx}
            className="group relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-[26px] border border-white/10 bg-[#1c1c1c] p-7 transition-all duration-300 hover:border-[#e3943f]/50 hover:bg-[#202020] hover:shadow-xl hover:shadow-black/60"
          >
            <div>
              <p className="text-[44px] leading-none font-bold tracking-[-0.03em] text-white sm:text-[50px]">
                {stat.value}
              </p>
              <h3 className="mt-4 text-[17px] font-semibold leading-[1.3] text-white">
                {stat.label}
              </h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-white/70">
                {stat.desc}
              </p>
              {stat.note ? (
                <p className="mt-3 border-l-2 border-[#e3943f]/60 pl-3 text-[12px] leading-relaxed text-white/50 italic">
                  &ldquo;{stat.note}&rdquo;
                </p>
              ) : null}
              {stat.detail ? (
                <p className="mt-3 text-[12px] font-medium text-[#e3943f]">
                  ✦ {stat.detail}
                </p>
              ) : null}
            </div>

            {/* Glowing 3D Icon centered and enlarged */}
            <div className="mt-6 flex w-full items-center justify-center pt-2">
              <img
                src={getStatIcon(stat)}
                alt=""
                className="h-36 w-36 object-contain object-center mix-blend-screen transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1.5 sm:h-40 sm:w-40 pointer-events-none"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

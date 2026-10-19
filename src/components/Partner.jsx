import { useEffect, useState } from 'react'
import LoopVideo from './LoopVideo'
import { projects } from '../data/projects'

const services = {
  en: {
    title: 'Unique Graphics — your life-long partner',
    lead: 'An exceptional service experience tailored to discerning clients',
    close: 'Close',
    items: [
      {
        id: 'premium',
        title: 'Customary premium service',
        text: 'Enjoy your usual lifestyle while we bring your vision to life',
        icon: 'diamond',
        image: '/nav/services-card.jpg',
        modalTitle: 'Unique Graphics takes over the full cycle of the project implementation',
        intro: 'The studio team manages:',
        points: ['architectural design', 'interior design', 'engineering solutions'],
        detail: 'You get a fully implemented project without having to dive into technical processes.',
        button: 'Discuss the implementation of your project',
      },
      {
        id: 'expert',
        title: 'Personal architecture & design expert',
        text: 'Your trusted advisor within Unique Graphics',
        icon: 'advisor',
        image: '/hero.jpg',
        modalTitle: 'One person stays with the project from the first conversation',
        intro: 'Your expert handles:',
        points: ['the brief and the way you live', 'design decisions as they come up', 'the link between you and the site'],
        detail: 'You are not passed between departments. The same person knows the project and answers for it.',
        button: 'Talk with your expert',
      },
      {
        id: 'bespoke',
        title: 'Bespoke design',
        text: 'The project will be designed exclusively for you based on individual sketches',
        icon: 'lock',
        image: '/nav/portfolio-card.jpg',
        modalTitle: 'The design is drawn for this house, and for no other',
        intro: 'What we prepare for you:',
        points: ['sketches from your brief', 'plans sized to the rooms you use', 'materials chosen for this project'],
        detail: 'Nothing is taken from a catalogue set. The drawings start from how you use the rooms.',
        button: 'Start a bespoke project',
      },
      {
        id: 'roadmap',
        title: 'Roadmap',
        text: 'A precise project management system with clear approval milestones',
        icon: 'pins',
        image: '/nav/nav-backdrop.jpg',
        modalTitle: 'Each stage is agreed before the next one starts',
        intro: 'The roadmap marks:',
        points: ['concept approval', 'drawings and specifications', 'site milestones you sign off'],
        detail: 'You see what is next, what is waiting for you, and what is already done.',
        button: 'See how the roadmap works',
      },
      {
        id: 'reporting',
        title: 'Reporting system',
        text: 'You can monitor the construction process online',
        icon: 'report',
        image: '/nav/services-card.jpg',
        modalTitle: 'The site progress is visible without a visit every week',
        intro: 'The report shows:',
        points: ['what was completed', 'what is in progress', 'what needs your decision'],
        detail: 'Photos and a short note keep the work in view while you stay where you are.',
        button: 'Ask about project reports',
      },
      {
        id: 'transparency',
        title: 'Transparency',
        text: 'Detailed timelines for your project',
        icon: 'chart',
        image: '/hero.jpg',
        modalTitle: 'The timeline is written down, not kept in someone’s head',
        intro: 'You can follow:',
        points: ['the sequence of works', 'the dates for each stage', 'where a delay would land'],
        detail: 'If a date moves, you see it on the timeline before it becomes a surprise on site.',
        button: 'Discuss your timeline',
      },
    ],
  },
  ru: {
    title: 'Unique Graphics — партнёр на долгие годы',
    lead: 'Сервис, собранный под требовательного заказчика',
    close: 'Закрыть',
    items: [
      {
        id: 'premium',
        title: 'Привычный премиальный сервис',
        text: 'Живите как привыкли, пока мы воплощаем ваш замысел',
        icon: 'diamond',
        image: '/nav/services-card.jpg',
        modalTitle: 'Unique Graphics берёт на себя полный цикл реализации проекта',
        intro: 'Команда студии ведёт:',
        points: ['архитектуру', 'интерьер', 'инженерные решения'],
        detail: 'Вы получаете реализованный проект и не погружаетесь в технические процессы.',
        button: 'Обсудить реализацию проекта',
      },
      {
        id: 'expert',
        title: 'Личный эксперт по архитектуре и дизайну',
        text: 'Ваш постоянный советник в Unique Graphics',
        icon: 'advisor',
        image: '/hero.jpg',
        modalTitle: 'Один человек ведёт проект с первого разговора',
        intro: 'Эксперт берёт на себя:',
        points: ['бриф и ваш образ жизни', 'решения по ходу проекта', 'связь между вами и площадкой'],
        detail: 'Вас не передают из отдела в отдел. Один человек знает проект и отвечает за него.',
        button: 'Поговорить с экспертом',
      },
      {
        id: 'bespoke',
        title: 'Индивидуальный дизайн',
        text: 'Проект рисуется только для вас, по отдельным эскизам',
        icon: 'lock',
        image: '/nav/portfolio-card.jpg',
        modalTitle: 'Дизайн делается для этого дома и ни для какого другого',
        intro: 'Мы готовим:',
        points: ['эскизы по вашему брифу', 'планы под комнаты, которыми вы пользуетесь', 'материалы именно этого проекта'],
        detail: 'Ничего не берётся готовым набором. Чертежи начинаются с того, как вы живёте.',
        button: 'Начать индивидуальный проект',
      },
      {
        id: 'roadmap',
        title: 'Дорожная карта',
        text: 'Точная система ведения проекта с ясными точками согласования',
        icon: 'pins',
        image: '/nav/nav-backdrop.jpg',
        modalTitle: 'Каждый этап согласуется до начала следующего',
        intro: 'На карте отмечены:',
        points: ['согласование концепции', 'чертежи и спецификации', 'этапы площадки, которые вы принимаете'],
        detail: 'Видно, что дальше, что ждёт вашего решения и что уже сделано.',
        button: 'Как устроена дорожная карта',
      },
      {
        id: 'reporting',
        title: 'Система отчётов',
        text: 'Ход строительства можно смотреть онлайн',
        icon: 'report',
        image: '/nav/services-card.jpg',
        modalTitle: 'Прогресс площадки виден без визита каждую неделю',
        intro: 'В отчёте:',
        points: ['что завершено', 'что в работе', 'какое решение нужно от вас'],
        detail: 'Фото и короткая заметка держат работу в поле зрения, пока вы на своём месте.',
        button: 'Спросить про отчёты',
      },
      {
        id: 'transparency',
        title: 'Прозрачность',
        text: 'Подробные сроки по вашему проекту',
        icon: 'chart',
        image: '/hero.jpg',
        modalTitle: 'Сроки записаны, а не держатся в чьей-то голове',
        intro: 'Можно следить за:',
        points: ['порядком работ', 'датами каждого этапа', 'тем, куда сядет задержка'],
        detail: 'Если дата сдвигается, это видно в графике раньше, чем станет сюрпризом на площадке.',
        button: 'Обсудить сроки',
      },
    ],
  },
}

const partnerReels = {
  premium: 0,
  expert: 1,
  bespoke: 2,
  roadmap: 3,
  reporting: 4,
  transparency: 8,
}

function Icon({ name }) {
  const common = {
    viewBox: '0 0 64 64',
    fill: 'none',
    stroke: '#e3943f',
    strokeWidth: '1.6',
    className: 'h-[72px] w-[72px] shrink-0',
    'aria-hidden': true,
  }

  if (name === 'diamond') {
    return (
      <svg {...common}>
        <path d="M32 8l18 16-18 32L14 24 32 8z" />
        <path d="M14 24h36M22 24l10 32 10-32" />
      </svg>
    )
  }
  if (name === 'advisor') {
    return (
      <svg {...common}>
        <circle cx="28" cy="22" r="8" />
        <path d="M14 48c2-10 8-14 14-14s12 4 14 14" />
        <path d="M46 18l2.2 4.6 5 .6-3.7 3.4.9 4.9L46 29.2 41.6 31.5l.9-4.9-3.7-3.4 5-.6L46 18z" />
      </svg>
    )
  }
  if (name === 'lock') {
    return (
      <svg {...common}>
        <rect x="16" y="28" width="32" height="24" rx="4" />
        <path d="M24 28v-6a8 8 0 0 1 16 0v6" />
        <circle cx="32" cy="40" r="2.5" fill="#e3943f" stroke="none" />
      </svg>
    )
  }
  if (name === 'pins') {
    return (
      <svg {...common}>
        <path d="M24 38c0-8 8-14 8-22a8 8 0 1 1 8 14c0 6-8 8-8 16" />
        <circle cx="32" cy="18" r="3" />
        <path d="M44 44c6-2 10-1 12 4" />
        <circle cx="50" cy="36" r="5" />
      </svg>
    )
  }
  if (name === 'report') {
    return (
      <svg {...common}>
        <rect x="12" y="16" width="40" height="28" rx="4" />
        <path d="M12 24h40M24 50h16M32 44v6" />
        <circle cx="32" cy="34" r="5" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <path d="M12 46h40M16 46V34M28 46V26M40 46V18" />
      <path d="M16 34l12-8 8 6 12-14" />
    </svg>
  )
}

function ServiceModal({ item, onClose, closeLabel }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-3 sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="partner-dialog-title"
        className="relative flex max-h-[92vh] w-full max-w-[860px] flex-col overflow-y-auto rounded-[24px] bg-[#1a1a1a] p-6 text-white shadow-2xl no-scrollbar sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-[24px] leading-none text-white/80 backdrop-blur-md transition-colors hover:bg-black/90 hover:text-white sm:top-5 sm:right-5"
          aria-label={closeLabel}
        >
          ×
        </button>

        <div className="grid gap-6 md:grid-cols-[1.12fr_0.88fr] md:gap-8 md:items-start">
          {/* Left side: Text details and button */}
          <div className="flex flex-col">
            <h3 id="partner-dialog-title" className="pr-8 text-[22px] leading-[1.15] font-medium tracking-[-0.02em] text-[#e3943f] uppercase sm:text-[26px] md:pr-0">
              {item.modalTitle}
            </h3>
            <p className="mt-3.5 text-[15px] font-medium text-white/90">{item.intro}</p>
            <ul className="mt-2 list-disc pl-5 text-[14px] leading-relaxed text-white/80 sm:text-[15px]">
              {item.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p className="mt-3.5 text-[14px] leading-relaxed text-white/75 sm:text-[15px]">{item.detail}</p>
            <div className="mt-5">
              <a
                href="/contacts"
                onClick={onClose}
                className="inline-flex w-fit rounded-full bg-[#e3943f] px-6 py-3.5 text-[12px] font-medium tracking-[0.12em] text-black uppercase transition-all hover:bg-[#d68532]"
              >
                {item.button}
              </a>
            </div>
          </div>

          {/* Right side upper: Video */}
          <div className="w-full shrink-0 overflow-hidden rounded-[18px] md:mt-1">
            <LoopVideo
              src={projects[partnerReels[item.id] ?? 0].video}
              className="aspect-[4/3] w-full rounded-[18px] object-cover sm:max-h-[290px]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Partner({ lang }) {
  const text = services[lang] ?? services.en
  const [openId, setOpenId] = useState(null)
  const open = text.items.find((item) => item.id === openId) ?? null

  return (
    <section id="partner" className="scroll-mt-16 bg-[#141414] px-4 py-16 text-white sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1100px]">
        <h2 className="text-center text-[22px] leading-tight font-medium tracking-[0.08em] text-[#e3943f] uppercase sm:text-[30px]">
          {text.title}
        </h2>
        <p className="mt-3 text-center text-[15px] text-white/75 sm:text-[17px]">{text.lead}</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {text.items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setOpenId(item.id)}
              className="flex items-center justify-between gap-6 rounded-[22px] border border-white/10 bg-[#1b1b1b] px-6 py-6 text-left transition-colors hover:border-[#e3943f] focus-visible:border-[#e3943f] sm:px-7 sm:py-7"
            >
              <span>
                <span className="block text-[13px] tracking-[0.12em] text-[#e3943f] uppercase">{item.title}</span>
                <span className="mt-2 block max-w-[36ch] text-[15px] leading-snug text-white/80">{item.text}</span>
              </span>
              <Icon name={item.icon} />
            </button>
          ))}
        </div>
      </div>
      {open ? <ServiceModal item={open} onClose={() => setOpenId(null)} closeLabel={text.close} /> : null}
    </section>
  )
}

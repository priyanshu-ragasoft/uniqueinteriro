import { useState, useEffect } from 'react'
import { ConsultModal, consultCopy } from './Discover'

export const DEFAULT_EXPERT_STEPS_CONFIG = {
  en: {
    before: 'Learn more about ',
    accent: 'creating your dream project',
    after: ' from your personal expert',
    steps: [
      {
        title: 'Fill out the form',
        text: 'Provide your name and current phone number',
      },
      {
        title: 'We will contact you',
        text: "Our personal expert will discuss your project's requirements and introduce you to our approach",
      },
      {
        title: 'Receive a tailored offer',
        text: 'After a detailed review of your wishes, we will prepare a personalized project plan',
      },
    ],
  },
  ru: {
    before: 'Узнайте, как ',
    accent: 'создаётся проект вашей мечты',
    after: ' вместе с личным экспертом',
    steps: [
      {
        title: 'Заполните форму',
        text: 'Оставьте имя и телефон',
      },
      {
        title: 'Мы свяжемся с вами',
        text: 'Личный эксперт обсудит задачи проекта и познакомит с нашим подходом',
      },
      {
        title: 'Получите предложение',
        text: 'После разбора пожеланий мы подготовим персональный план проекта',
      },
    ],
  },
}

function StepCard({ index, title, text, onClick }) {
  const body = (
    <>
      <span className="absolute top-0 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#e3943f] bg-[#141414] text-[16px] text-[#e3943f] shadow-[0_0_0_7px_rgb(227_148_63_/_12%)]">
        {index}
      </span>
      <span className="block text-[15px] tracking-[0.12em] text-[#e3943f] uppercase">{title}</span>
      <span className="mt-4 block text-[15px] leading-relaxed text-white/75">{text}</span>
    </>
  )
  const className =
    'relative mt-6 block w-full rounded-[22px] bg-[#1c1c1c] px-6 pt-12 pb-8 text-center'

  if (!onClick) {
    return <article className={className}>{body}</article>
  }

  return (
    <button type="button" onClick={onClick} className={`${className} transition-colors hover:bg-[#222] cursor-pointer`}>
      {body}
    </button>
  )
}

export default function ExpertSteps({ lang }) {
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('ug_brand_sections_config')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.expertSteps) return parsed.expertSteps
      }
    } catch {}
    return DEFAULT_EXPERT_STEPS_CONFIG
  })

  // Sync with MongoDB backend setting
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/blogs/settings/brand-sections')
        const data = await res.json()
        if (data.success && data.data?.expertSteps) {
          setConfig(data.data.expertSteps)
          const saved = localStorage.getItem('ug_brand_sections_config')
          const full = saved ? JSON.parse(saved) : {}
          localStorage.setItem('ug_brand_sections_config', JSON.stringify({ ...full, expertSteps: data.data.expertSteps }))
        }
      } catch {}
    }
    fetchConfig()

    const onBrandUpdate = () => {
      try {
        const saved = localStorage.getItem('ug_brand_sections_config')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.expertSteps) setConfig(parsed.expertSteps)
        }
      } catch {}
    }

    window.addEventListener('ug_brand_updated', onBrandUpdate)
    window.addEventListener('storage', onBrandUpdate)
    return () => {
      window.removeEventListener('ug_brand_updated', onBrandUpdate)
      window.removeEventListener('storage', onBrandUpdate)
    }
  }, [])

  const text = config[lang] ?? config.en ?? DEFAULT_EXPERT_STEPS_CONFIG[lang] ?? DEFAULT_EXPERT_STEPS_CONFIG.en
  const consult = consultCopy[lang] ?? consultCopy.en
  const [open, setOpen] = useState(false)

  return (
    <section className="bg-[#141414] px-4 py-16 text-white sm:px-8 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-[1100px]">
        <h2 className="mx-auto max-w-[22ch] text-center text-[26px] leading-tight font-medium tracking-[0.04em] uppercase sm:text-[34px]">
          {text.before}
          <span className="text-[#e3943f]">{text.accent}</span>
          {text.after}
        </h2>
        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
          {(text.steps || []).map((step, index) => (
            <StepCard
              key={step.title || index}
              index={index + 1}
              title={step.title}
              text={step.text}
              onClick={index === 0 ? () => setOpen(true) : undefined}
            />
          ))}
        </div>
      </div>
      {open ? <ConsultModal text={consult} onClose={() => setOpen(false)} /> : null}
    </section>
  )
}

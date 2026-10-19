import { useState, useEffect } from 'react'
import LoopVideo from '../LoopVideo'
import { aboutReels } from '../../data/reels'
import { getStoredAboutConfig, DEFAULT_ABOUT_PAGE_CONFIG } from '../../data/aboutConfig'

export default function AboutStory({ lang }) {
  const [storyConfig, setStoryConfig] = useState(() => {
    return getStoredAboutConfig().story
  })
  const [activeStepIndex, setActiveStepIndex] = useState(3) // default to 'Site'

  useEffect(() => {
    const onUpdate = () => {
      setStoryConfig(getStoredAboutConfig().story)
    }
    window.addEventListener('ug_about_updated', onUpdate)
    window.addEventListener('storage', onUpdate)
    return () => {
      window.removeEventListener('ug_about_updated', onUpdate)
      window.removeEventListener('storage', onUpdate)
    }
  }, [])

  const text =
    storyConfig[lang] ??
    storyConfig.en ??
    DEFAULT_ABOUT_PAGE_CONFIG.story[lang] ??
    DEFAULT_ABOUT_PAGE_CONFIG.story.en

  // Normalize steps to array of { label, text }
  const rawSteps = text.steps || DEFAULT_ABOUT_PAGE_CONFIG.story.en.steps
  const steps = rawSteps.map((s) => {
    if (Array.isArray(s)) return { label: s[0], text: s[1] }
    return { label: s.label || '', text: s.text || '' }
  })

  const mediaSrc = storyConfig.mediaUrl?.trim() || aboutReels.bedroom
  const isVideo = !mediaSrc.match(/\.(jpeg|jpg|png|gif|webp|svg)$/i)
  const activeStep = steps[activeStepIndex] || steps[0] || { label: '', text: '' }

  return (
    <section className="bg-[#101010] px-4 py-16 text-white sm:px-8 lg:px-10 lg:py-20">
      <div className="mx-auto grid max-w-[1100px] items-center gap-8 rounded-[28px] bg-[#1a1a1a] px-6 py-8 lg:grid-cols-[1fr_auto] lg:px-10">
        <div>
          <h2 className="text-[13px] tracking-[0.16em] text-[#e3943f] uppercase">{text.teamTitle}</h2>
          <p className="mt-4 max-w-[46ch] text-[16px] leading-relaxed text-white/80">{text.teamText}</p>
          <p className="mt-6 text-[28px] leading-none text-[#e3943f]">{text.years}</p>
          <p className="mt-2 text-[15px] text-white/70">{text.yearsText}</p>
        </div>
        <p className="text-center text-[92px] leading-none font-medium tracking-[-0.06em] text-white/90 sm:text-[120px]">
          {text.bigNumber || '10+'}
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-[1100px]">
        <h2 className="text-center text-[14px] tracking-[0.18em] text-[#e3943f] uppercase">{text.story}</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-[160px_1fr] lg:items-center">
          <ol className="flex gap-4 overflow-x-auto lg:flex-col lg:gap-5 no-scrollbar">
            {steps.map((s, idx) => (
              <li key={idx} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className={`text-[13px] tracking-[0.14em] uppercase text-left transition-colors cursor-pointer ${
                    activeStepIndex === idx ? 'text-[#e3943f] font-semibold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ol>
          <figure className="overflow-hidden rounded-[24px]">
            {isVideo ? (
              <LoopVideo src={mediaSrc} className="h-[320px] w-full object-cover sm:h-[420px]" />
            ) : (
              <img src={mediaSrc} alt="Process visual" className="h-[320px] w-full object-cover sm:h-[420px]" />
            )}
            <figcaption className="bg-[#1a1a1a] px-5 py-4 text-[13px] tracking-[0.08em] text-white/80 uppercase">
              {activeStep.text}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

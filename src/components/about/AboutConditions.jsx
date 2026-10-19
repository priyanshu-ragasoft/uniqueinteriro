import { useState, useEffect } from 'react'
import LoopVideo from '../LoopVideo'
import { aboutReels } from '../../data/reels'
import { getStoredAboutConfig, DEFAULT_ABOUT_PAGE_CONFIG } from '../../data/aboutConfig'

export default function AboutConditions({ lang }) {
  const [conditionsConfig, setConditionsConfig] = useState(() => {
    return getStoredAboutConfig().conditions
  })

  useEffect(() => {
    const onUpdate = () => {
      setConditionsConfig(getStoredAboutConfig().conditions)
    }
    window.addEventListener('ug_about_updated', onUpdate)
    window.addEventListener('storage', onUpdate)
    return () => {
      window.removeEventListener('ug_about_updated', onUpdate)
      window.removeEventListener('storage', onUpdate)
    }
  }, [])

  const text =
    conditionsConfig[lang] ??
    conditionsConfig.en ??
    DEFAULT_ABOUT_PAGE_CONFIG.conditions[lang] ??
    DEFAULT_ABOUT_PAGE_CONFIG.conditions.en

  // Normalize cards
  const rawCards = text.cards || DEFAULT_ABOUT_PAGE_CONFIG.conditions.en.cards
  const cards = rawCards.map((c) => {
    if (Array.isArray(c)) return { title: c[0], text: c[1] }
    return { title: c.title || '', text: c.text || '' }
  })

  const mediaSrc = conditionsConfig.mediaUrl?.trim() || aboutReels.bath
  const isVideo = !mediaSrc.match(/\.(jpeg|jpg|png|gif|webp|svg)$/i)

  return (
    <section className="bg-[#101010] px-4 py-16 text-white sm:px-8 lg:px-10 lg:py-20">
      <h2 className="text-center text-[14px] tracking-[0.16em] text-[#e3943f] uppercase">{text.title}</h2>
      <div className="mx-auto mt-10 grid max-w-[1100px] gap-4 md:grid-cols-2">
        {cards.map((c, idx) => (
          <article key={idx} className="rounded-[22px] bg-[#1a1a1a] px-6 py-6 border border-white/5 hover:border-[#e3943f]/25 transition-colors">
            <h3 className="text-[13px] tracking-[0.12em] text-[#e3943f] uppercase">{c.title}</h3>
            <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-white/75">{c.text}</p>
          </article>
        ))}
      </div>
      <div className="mx-auto mt-8 grid max-w-[1100px] items-center gap-6 overflow-hidden rounded-[28px] bg-[#1a1a1a] lg:grid-cols-[1fr_1.1fr]">
        <div className="px-6 py-8 sm:px-10">
          <h2 className="max-w-[16ch] text-[22px] leading-tight font-medium tracking-[0.04em] text-[#e3943f] uppercase">
            {text.mission}
          </h2>
          <p className="mt-6 text-[40px] leading-none text-[#e3943f]">{text.stat}</p>
          <p className="mt-3 max-w-[32ch] text-[15px] leading-relaxed text-white/75">{text.statText}</p>
          <a
            href={text.buttonLink || '/contacts'}
            className="mt-6 inline-flex rounded-full bg-[#e3943f] px-6 py-3 text-[12px] font-medium tracking-[0.12em] text-black uppercase transition-transform hover:scale-105"
          >
            {text.button}
          </a>
        </div>
        {isVideo ? (
          <LoopVideo src={mediaSrc} className="h-[280px] w-full object-cover lg:h-full lg:min-h-[320px]" />
        ) : (
          <img src={mediaSrc} alt="Conditions visual" className="h-[280px] w-full object-cover lg:h-full lg:min-h-[320px]" />
        )}
      </div>
    </section>
  )
}

import { useEffect, useRef, useState } from 'react'
import { aboutReels } from '../../data/reels'
import { getStoredAboutConfig, DEFAULT_ABOUT_PAGE_CONFIG } from '../../data/aboutConfig'

export default function AboutBanner({ lang }) {
  const [bannerConfig, setBannerConfig] = useState(() => {
    return getStoredAboutConfig().banner
  })
  const video = useRef(null)

  useEffect(() => {
    const onUpdate = () => {
      setBannerConfig(getStoredAboutConfig().banner)
    }
    window.addEventListener('ug_about_updated', onUpdate)
    window.addEventListener('storage', onUpdate)
    return () => {
      window.removeEventListener('ug_about_updated', onUpdate)
      window.removeEventListener('storage', onUpdate)
    }
  }, [])

  const text =
    bannerConfig[lang] ??
    bannerConfig.en ??
    DEFAULT_ABOUT_PAGE_CONFIG.banner[lang] ??
    DEFAULT_ABOUT_PAGE_CONFIG.banner.en

  const mediaSrc = bannerConfig.mediaUrl?.trim() || aboutReels.night
  const isVideo = !mediaSrc.match(/\.(jpeg|jpg|png|gif|webp|svg)$/i)

  useEffect(() => {
    const node = video.current
    if (!node || !isVideo) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    node.play().catch(() => {})
  }, [mediaSrc, isVideo])

  return (
    <section className="relative min-h-svh overflow-hidden bg-black text-white">
      {isVideo ? (
        <video
          key={mediaSrc}
          ref={video}
          src={mediaSrc}
          muted
          loop
          playsInline
          autoPlay
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <img
          src={mediaSrc}
          alt={text.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/35" />
      <div className="relative flex min-h-svh flex-col justify-end px-5 pt-28 pb-16 sm:px-10 lg:px-16 lg:pb-20">
        <h1 className="text-[42px] leading-none font-medium tracking-[-0.03em] text-[#e3943f] uppercase sm:text-6xl">
          {text.title}
        </h1>
        <p className="mt-4 max-w-[36ch] text-[18px] leading-relaxed text-white/90 sm:text-[20px]">{text.text}</p>
        <a
          href={text.buttonLink || '/contacts'}
          className="mt-8 inline-flex w-fit rounded-full bg-[#e3943f] px-8 py-3.5 text-[13px] font-medium tracking-[0.12em] text-black uppercase transition-transform hover:scale-105"
        >
          {text.button}
        </a>
      </div>
    </section>
  )
}

import { useState, useEffect } from 'react'
import { getStoredAboutConfig, DEFAULT_ABOUT_PAGE_CONFIG } from '../../data/aboutConfig'

export default function AboutStyle({ lang }) {
  const [styleConfig, setStyleConfig] = useState(() => {
    return getStoredAboutConfig().style
  })

  useEffect(() => {
    const onUpdate = () => {
      setStyleConfig(getStoredAboutConfig().style)
    }
    window.addEventListener('ug_about_updated', onUpdate)
    window.addEventListener('storage', onUpdate)
    return () => {
      window.removeEventListener('ug_about_updated', onUpdate)
      window.removeEventListener('storage', onUpdate)
    }
  }, [])

  const text =
    styleConfig[lang] ??
    styleConfig.en ??
    DEFAULT_ABOUT_PAGE_CONFIG.style[lang] ??
    DEFAULT_ABOUT_PAGE_CONFIG.style.en

  const mediaSrc = styleConfig?.mediaUrl?.trim()
  const isVideo = mediaSrc && !mediaSrc.match(/\.(jpeg|jpg|png|gif|webp|svg)$/i)

  return (
    <section className="relative overflow-hidden bg-[#141414] px-5 py-16 text-center text-white sm:px-10 lg:py-20">
      {mediaSrc && (
        <>
          {isVideo ? (
            <video
              key={mediaSrc}
              src={mediaSrc}
              muted
              loop
              playsInline
              autoPlay
              className="absolute inset-0 h-full w-full object-cover opacity-25"
            />
          ) : (
            <img
              src={mediaSrc}
              alt={text.mark}
              className="absolute inset-0 h-full w-full object-cover opacity-25"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/75 to-[#141414]" />
        </>
      )}
      <div className="relative z-10">
        <h2 className="text-[13px] tracking-[0.2em] text-[#e3943f] uppercase">{text.mark}</h2>
        <p className="mx-auto mt-4 max-w-[62ch] text-[16px] leading-relaxed text-white/80 sm:text-[18px]">
          {text.text}
        </p>
      </div>
    </section>
  )
}

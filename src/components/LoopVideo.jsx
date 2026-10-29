import { useEffect, useRef, useState } from 'react'

const DEFAULT_POSTER = '/website-assets/architecture/AUTOMOTIVE%20GALLERY/9ea0e852-0904-49c5-b948-f8504d0ea7fb.png'

export default function LoopVideo({ src, className = '', alt = '', poster = '' }) {
  const video = useRef(null)
  const [hasError, setHasError] = useState(false)

  const defaultPoster = poster || DEFAULT_POSTER

  const isVideo = Boolean(
    !hasError &&
    src &&
    typeof src === 'string' &&
    (src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov') || src.includes('.mp4?'))
  )

  useEffect(() => {
    setHasError(false)
  }, [src])

  useEffect(() => {
    if (!isVideo) return
    const node = video.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.pause()
      return
    }
    node.play().catch(() => {})
  }, [src, isVideo])

  if (!src) {
    return <div className={`bg-neutral-900 ${className}`} />
  }

  if (!isVideo) {
    return (
      <img
        src={hasError ? defaultPoster : src}
        alt={alt}
        loading="lazy"
        className={`${className} object-cover`}
      />
    )
  }

  return (
    <video
      ref={video}
      src={src}
      poster={defaultPoster}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      onError={() => setHasError(true)}
      className={className}
    />
  )
}



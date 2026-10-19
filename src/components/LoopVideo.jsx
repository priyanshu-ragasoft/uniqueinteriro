import { useEffect, useRef } from 'react'

export default function LoopVideo({ src, className }) {
  const video = useRef(null)

  useEffect(() => {
    const node = video.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.pause()
      return
    }
    node.play().catch(() => {})
  }, [src])

  return <video ref={video} src={src} muted loop playsInline autoPlay className={className} />
}

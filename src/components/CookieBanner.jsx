import { useEffect, useState } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookies_accepted')
      if (!consent) {
        // Small delay so it slides in smoothly after initial load
        const timer = setTimeout(() => setVisible(true), 600)
        return () => clearTimeout(timer)
      }
    } catch {
      setVisible(true)
    }
  }, [])

  const handleAccept = () => {
    try {
      localStorage.setItem('cookies_accepted', 'true')
    } catch {
      // ignore
    }
    setClosing(true)
    setTimeout(() => setVisible(false), 300)
  }

  if (!visible) return null

  return (
    <div
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-[85] w-max max-w-[calc(100vw-32px)] sm:bottom-7 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        closing
          ? 'opacity-0 scale-95 translate-y-3 pointer-events-none'
          : 'opacity-100 scale-100 translate-y-0'
      }`}
    >
      <div className="flex min-w-[320px] items-center justify-between gap-10 rounded-full border border-white/10 bg-[#222428]/95 px-8 py-2 text-white shadow-2xl backdrop-blur-md sm:min-w-[440px] sm:gap-14 sm:px-10 sm:py-2.5">
        <span className="text-[13.5px] font-normal tracking-wide text-white sm:text-[14.5px]">
          This website uses Cookies.
        </span>
        <button
          type="button"
          onClick={handleAccept}
          className="text-[13.5px] font-medium text-[#e3943f] underline underline-offset-4 transition-colors hover:text-[#f3a854] cursor-pointer sm:text-[14.5px]"
        >
          Accept
        </button>
      </div>
    </div>
  )
}

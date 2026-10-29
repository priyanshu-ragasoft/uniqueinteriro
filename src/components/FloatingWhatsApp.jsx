import { useEffect, useRef, useState } from 'react'

function WhatsAppIcon({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.57 20.15 9.12 19.76 7.85 19L7.55 18.82L4.43 19.64L5.26 16.59L5.07 16.29C4.24 14.97 3.8 13.46 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.05 20.15ZM16.57 14.33C16.32 14.2 15.11 13.61 14.88 13.53C14.66 13.44 14.5 13.4 14.33 13.65C14.17 13.9 13.71 14.44 13.57 14.6C13.43 14.77 13.29 14.79 13.04 14.66C12.79 14.54 11.99 14.28 11.04 13.43C10.3 12.77 9.8 11.96 9.66 11.71C9.51 11.46 9.64 11.33 9.77 11.2C9.88 11.09 10.02 10.91 10.15 10.76C10.27 10.61 10.31 10.51 10.4 10.34C10.48 10.17 10.44 10.02 10.38 9.9C10.32 9.77 9.82 8.55 9.61 8.05C9.41 7.56 9.2 7.63 9.05 7.62C8.91 7.61 8.74 7.61 8.58 7.61C8.41 7.61 8.14 7.67 7.91 7.92C7.68 8.17 7.04 8.77 7.04 9.99C7.04 11.21 7.93 12.39 8.05 12.56C8.18 12.73 9.8 15.22 12.27 16.29C12.86 16.54 13.32 16.7 13.67 16.81C14.27 17 14.81 16.97 15.24 16.91C15.72 16.84 16.72 16.3 16.93 15.72C17.14 15.13 17.14 14.63 17.07 14.52C17.01 14.42 16.82 14.46 16.57 14.33Z" />
    </svg>
  )
}

function ChatBubbleIcon({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      <circle cx="9" cy="12" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  )
}

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    if (open) {
      window.addEventListener('keydown', onKey)
      document.addEventListener('pointerdown', onClickOutside)
    }
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onClickOutside)
    }
  }, [open])

  return (
    <div ref={containerRef} className="fixed right-5 bottom-5 z-[90] sm:right-8 sm:bottom-8">
      {/* WhatsApp Popup Card with Silky-Smooth Fluid Transition */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="WhatsApp"
        className={`absolute right-0 bottom-16 mb-3 w-[min(350px,calc(100vw-2.5rem))] origin-bottom-right rounded-[34px] bg-white p-7 text-black shadow-[0_25px_70px_-15px_rgba(0,0,0,0.35)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-[min(400px,calc(100vw-4rem))] sm:p-8 ${
          open
            ? 'visible opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'invisible opacity-0 scale-90 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Header Controls */}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 hover:text-black"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Heading & Subtitle */}
        <h3 className="mt-4 text-[24px] font-bold tracking-tight text-gray-950 sm:text-[26px]">WhatsApp</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-gray-500">
          Write to us in the messenger from a computer or scan the QR code from your mobile device
        </p>

        {/* Open Chat Pill Button */}
        <a
          href="https://wa.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center justify-between rounded-[20px] bg-[#f4f5f7] px-4.5 py-4 transition-all duration-200 hover:bg-[#eaecee] hover:scale-[1.01] active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <ChatBubbleIcon className="h-6 w-6 text-gray-900" />
            <span className="text-[15px] font-semibold text-gray-900">Open chat</span>
          </div>
          <svg className="h-4 w-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </a>

        {/* QR Code Section */}
        <div className="mt-7">
          <h4 className="text-[15px] font-bold tracking-wide text-gray-900">QR - code</h4>
          <div className="mt-3.5 flex items-center justify-center rounded-[22px] bg-white p-2">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&ecc=Q&data=https%3A%2F%2Fwa.me%2F%3Ftext%3DHello%20Unique%20Graphics"
              alt="WhatsApp QR Code"
              className="h-auto w-full max-w-[210px] object-contain sm:max-w-[245px]"
              loading="eager"
            />
          </div>
        </div>
      </div>

      {/* Floating Buttons: WhatsApp & Contact us */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={`flex h-13 w-13 items-center justify-center rounded-full text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 ${
            open ? 'bg-black ring-2 ring-white/20' : 'bg-[#1c1f24]/95 hover:bg-black'
          }`}
          aria-label="WhatsApp"
        >
          <WhatsAppIcon className="h-6 w-6" />
        </button>

        <a
          href="/contacts"
          className="flex h-13 items-center justify-center rounded-full bg-[#1c1f24]/95 px-6.5 text-[14px] font-medium text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:bg-black hover:scale-105 active:scale-95"
        >
          Contact us
        </a>
      </div>
    </div>
  )
}

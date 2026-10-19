import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../animations/gsapConfig'
import { isAppPath, legacyHashPath, queueSection, setScroller } from '../routes'

function openPath(path) {
  if (window.location.pathname === path && !window.location.hash) return false
  history.pushState(null, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  return true
}

export function useLenis() {
  useEffect(() => {
    let active = true

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      smoothWheel: true,
      respectReducedMotion: true,
      anchors: false,
    })

    setScroller((target) => {
      lenis.scrollTo(target, { immediate: true, force: true })
    })

    const onAnchorClick = (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target.closest?.('a[href]')
      if (!link) return
      const href = link.getAttribute('href')
      if (!href || href.startsWith('http') || href.startsWith('mailto:')) return

      const section = link.dataset.section
      if (section) {
        event.preventDefault()
        const target = `#${section}`
        if (window.location.pathname !== '/' || window.location.hash) {
          queueSection(target)
          openPath('/')
        } else {
          lenis.scrollTo(target)
        }
        return
      }

      if (href.startsWith('#')) {
        event.preventDefault()
        const next = legacyHashPath(href)
        if (typeof next === 'string') {
          if (!openPath(next)) lenis.scrollTo(0, { immediate: true })
          return
        }
        queueSection(next.section)
        if (!openPath('/')) lenis.scrollTo(next.section)
        return
      }

      if (href.startsWith('/') && isAppPath(href)) {
        event.preventDefault()
        const path = new URL(href, window.location.origin).pathname
        sessionStorage.setItem('prev_scroll_y', String(Math.round(window.scrollY)))
        sessionStorage.setItem('prev_path', window.location.pathname)
        if (!openPath(path)) lenis.scrollTo(0, { immediate: true })
      }
    }

    const onLenisScroll = (e) => {
      ScrollTrigger.update()
      const y = Math.round(e?.scroll ?? window.scrollY)
      if (window.location.pathname === '/') {
        sessionStorage.setItem('home_scroll_y', String(y))
      }
      sessionStorage.setItem('scroll_' + window.location.pathname, String(y))
    }

    const onTick = (time) => {
      lenis.raf(time * 1000)
    }

    lenis.on('scroll', onLenisScroll)
    window.addEventListener('click', onAnchorClick, true)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    const refreshId = requestAnimationFrame(() => {
      if (!active) return
      lenis.resize()
      ScrollTrigger.refresh()
    })

    return () => {
      active = false
      cancelAnimationFrame(refreshId)
      gsap.ticker.remove(onTick)
      window.removeEventListener('click', onAnchorClick, true)
      setScroller(null)
      lenis.off('scroll', onLenisScroll)
      lenis.destroy()
      gsap.ticker.lagSmoothing(500, 33)
    }
  }, [])
}

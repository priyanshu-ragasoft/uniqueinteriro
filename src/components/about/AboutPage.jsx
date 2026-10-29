import { useEffect } from 'react'
import { aboutReels } from '../../data/reels'
import Clients from '../Clients'
import DreamHome from '../DreamHome'
import Recognition from '../Recognition'
import AboutBanner from './AboutBanner'
import AboutConditions from './AboutConditions'
import AboutStory from './AboutStory'
import AboutStyle from './AboutStyle'
import { DEFAULT_ABOUT_PAGE_CONFIG } from '../../data/aboutConfig'

export default function AboutPage({ lang }) {
  useEffect(() => {
    // Sanitize any existing cached config with bad/heavy video
    try {
      const saved = localStorage.getItem('ug_about_page_config')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (
          !parsed.banner?.mediaUrl ||
          parsed.banner.mediaUrl.includes('GREEN%20WOOD.mp4') ||
          parsed.banner.mediaUrl.includes('GREEN WOOD.mp4')
        ) {
          parsed.banner = {
            ...parsed.banner,
            mediaUrl: '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg',
          }
          localStorage.setItem('ug_about_page_config', JSON.stringify(parsed))
          window.dispatchEvent(new Event('ug_about_updated'))
        }
      }
    } catch {}

    // Fetch live settings from backend
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/blogs/settings/about-page')
        const data = await res.json()
        if (data.success && data.data) {
          const cfg = data.data
          if (
            !cfg.banner?.mediaUrl ||
            cfg.banner.mediaUrl.includes('GREEN%20WOOD.mp4') ||
            cfg.banner.mediaUrl.includes('GREEN WOOD.mp4')
          ) {
            cfg.banner = {
              ...cfg.banner,
              mediaUrl: '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg',
            }
          }
          localStorage.setItem('ug_about_page_config', JSON.stringify(cfg))
          window.dispatchEvent(new Event('ug_about_updated'))
        }
      } catch (err) {
        console.error('Failed to fetch about settings:', err)
      }
    }
    fetchSettings()
  }, [])

  return (
    <>
      <AboutBanner lang={lang} />
      <AboutStyle lang={lang} />
      <Recognition lang={lang} src={aboutReels.snow} />
      <Clients lang={lang} />
      <AboutStory lang={lang} />
      <AboutConditions lang={lang} />
      <DreamHome lang={lang} video={aboutReels.plants} crop />
    </>
  )
}

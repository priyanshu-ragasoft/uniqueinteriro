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
    // Fetch live settings from backend
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/blogs/settings/about-page')
        const data = await res.json()
        if (data.success && data.data) {
          localStorage.setItem('ug_about_page_config', JSON.stringify(data.data))
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

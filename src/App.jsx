import { useEffect, useState } from 'react'
import CompletedProjects from './components/CompletedProjects'
import Clients from './components/Clients'
import AboutPage from './components/about/AboutPage'
import ServiceEntryPage from './components/services/ServiceEntryPage'
import PortfolioEntryPage from './components/portfolio/PortfolioEntryPage'
import Closing from './components/Closing'
import ContactPage from './components/contact/ContactPage'
import Discover from './components/Discover'
import DreamHome from './components/DreamHome'
import ExpertSteps from './components/ExpertSteps'
import Footer from './components/Footer'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import CookieBanner from './components/CookieBanner'
import HomeButton from './components/HomeButton'
import Hero from './components/Hero'
import LegalPage from './components/LegalPage'
import Navbar from './components/Navbar'
import Partner from './components/Partner'
import ProjectPage from './components/ProjectPage'
import Projects from './components/Projects'
import Recognition from './components/Recognition'
import StudioNote from './components/StudioNote'
import StudioPage from './components/StudioPage'
import BlogPage from './components/blog/BlogPage'
import AdminPage from './components/admin/AdminPage'
import { useLenis } from './hooks/useLenis'
import { consumeSection, consumeScroll, migrateLegacyHash, routeFromPath, scrollApp } from './routes'

function usePath() {
  const [path, setPath] = useState(() => {
    migrateLegacyHash()
    return window.location.pathname
  })

  useEffect(() => {
    const onChange = () => {
      if (window.location.hash) migrateLegacyHash()
      setPath(window.location.pathname)
    }
    window.addEventListener('popstate', onChange)
    window.addEventListener('hashchange', onChange)
    return () => {
      window.removeEventListener('popstate', onChange)
      window.removeEventListener('hashchange', onChange)
    }
  }, [])

  return path
}

export default function App() {
  const lang = 'en'
  const path = usePath()
  const route = routeFromPath(path)
  const projectId = route.page === 'project' ? route.id : ''
  const studioId = route.page === 'studio' ? route.id : ''
  const serviceOpen = route.page === 'service'
  const aboutOpen = route.page === 'about'
  const contactOpen = route.page === 'contacts'
  const portfolioCategoryOpen = route.page === 'portfolio-category' || route.page === 'portfolio-entry'
  const blogOpen = route.page === 'blog'
  const adminOpen = route.page === 'admin'
  const legalId = route.page === 'privacy' || route.page === 'terms' ? route.page : ''
  const noteId = route.page === 'career' ? route.page : ''
  const innerPage = Boolean(
    projectId ||
    studioId ||
    serviceOpen ||
    portfolioCategoryOpen ||
    aboutOpen ||
    contactOpen ||
    blogOpen ||
    legalId ||
    noteId
  )
  useLenis()

  useEffect(() => {
    const section = consumeSection()
    if (section) {
      requestAnimationFrame(() => scrollApp(section))
      return
    }

    const queuedScroll = consumeScroll()
    if (queuedScroll !== null && typeof queuedScroll === 'number' && queuedScroll > 0) {
      requestAnimationFrame(() => {
        scrollApp(queuedScroll)
        setTimeout(() => scrollApp(queuedScroll), 60)
        setTimeout(() => scrollApp(queuedScroll), 180)
      })
      return
    }

    scrollApp(0)
  }, [path])

  if (adminOpen) {
    return <AdminPage />
  }

  return (
    <>
      <Navbar />
      {innerPage && !projectId ? <HomeButton lang={lang} /> : null}
      {projectId ? (
        <ProjectPage lang={lang} id={projectId} />
      ) : aboutOpen ? (
        <AboutPage lang={lang} />
      ) : contactOpen ? (
        <ContactPage lang={lang} />
      ) : portfolioCategoryOpen ? (
        <PortfolioEntryPage
          key={`${route.category || ''}/${route.second || route.subcategory || ''}/${route.third || ''}`}
          lang={lang}
          categorySlug={route.category}
          secondSlug={route.second || route.subcategory || ''}
          thirdSlug={route.third || ''}
        />
      ) : blogOpen ? (
        <BlogPage />
      ) : legalId ? (
        <LegalPage id={legalId} />
      ) : noteId ? (
        <StudioNote id={noteId} />
      ) : serviceOpen ? (
        <ServiceEntryPage
          key={`${route.category || ''}/${route.subcategory || ''}/${route.story || ''}`}
          categorySlug={route.category}
          subcategorySlug={route.subcategory}
          storySlug={route.story}
        />
      ) : studioId ? (
        <StudioPage lang={lang} id={studioId} />
      ) : (
        <>
          <Hero lang={lang} />
          <Projects lang={lang} />
          <CompletedProjects lang={lang} />
          <Partner lang={lang} />
          <Discover lang={lang} />
          <Clients lang={lang} />
          <Recognition lang={lang} />
          <ExpertSteps lang={lang} />
          <DreamHome lang={lang} />
          <Closing lang={lang} />
        </>
      )}
      <Footer />
      <FloatingWhatsApp />
      <CookieBanner />
    </>
  )
}

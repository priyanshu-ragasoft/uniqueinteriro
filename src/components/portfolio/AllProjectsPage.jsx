import { useState, useMemo, useEffect, useRef } from 'react'
import { getStoredPortfolioConfig } from '../../data/portfolioConfig'
import FilterDrawer from '../commercial/FilterDrawer'
import PortfolioProjectCard from './PortfolioProjectCard'
const banner1 = '/website-assets/commercial%20interior/RYDHUM%20HOTEL%20&%20BANQUET%20HALL%20FIROZEPURE%20PUNJAB/RYDHUM%20HOTEL.mp4'
const banner2 = '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/PUSHPA%20THE%20FIRE.mp4'
const banner3 = '/website-assets/commercial%20interior/VECTERRACE%20HOTEL%20DANCE%20BAR%20KOLKATA/VICTERRACE%20KOLKATA.mp4'

const defaultBannerVideos = [
  { id: 1, src: banner1 },
  { id: 2, src: banner2 },
  { id: 3, src: banner3 },
]

export default function AllProjectsPage({ lang = 'en' }) {
  const [selectedType, setSelectedType] = useState('ALL PROJECTS')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentBanner, setCurrentBanner] = useState(0)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [portfolioData, setPortfolioData] = useState(() => getStoredPortfolioConfig())
  const videoRefs = useRef([])

  useEffect(() => {
    const handleUpdate = () => {
      setPortfolioData(getStoredPortfolioConfig())
    }
    window.addEventListener('portfolio-pages-config-changed', handleUpdate)
    return () => window.removeEventListener('portfolio-pages-config-changed', handleUpdate)
  }, [])

  const heroConfig = portfolioData.heroes?.['all-projects'] || {}
  const isOld = (u) => !u || String(u).includes('/assets/project') || String(u).includes('8347237')
  const bannerVideos = useMemo(() => {
    return [
      { id: 1, src: !isOld(heroConfig.banner1) ? heroConfig.banner1 : banner1 },
      { id: 2, src: !isOld(heroConfig.banner2) ? heroConfig.banner2 : banner2 },
      { id: 3, src: !isOld(heroConfig.banner3) ? heroConfig.banner3 : banner3 },
    ]
  }, [heroConfig.banner1, heroConfig.banner2, heroConfig.banner3])

  // Combine projects from all disciplines for the complete portfolio
  const allProjects = useMemo(() => {
    const arch = (portfolioData.architectural || []).map((p) => ({ ...p, discipline: 'Architecture' }))
    const int = (portfolioData.interior || []).map((p) => ({ ...p, discipline: 'Interior' }))
    const comm = (portfolioData.commercial || []).map((p) => ({ ...p, discipline: 'Commercial' }))
    return [...arch, ...int, ...comm]
  }, [portfolioData])

  // Auto transition every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerVideos.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [])

  // Play active video and pause others for silky smooth performance
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return
      if (idx === currentBanner) {
        try {
          vid.currentTime = 0
          const playPromise = vid.play()
          if (playPromise !== undefined) {
            playPromise.catch(() => {})
          }
        } catch {
          // ignore
        }
      } else {
        try {
          vid.pause()
        } catch {
          // ignore
        }
      }
    })
  }, [currentBanner])

  const filteredProjects = useMemo(() => {
    return allProjects.filter((item) => {
      const matchesType = () => {
        if (!selectedType || selectedType === 'ALL' || selectedType === 'ALL PROJECTS') return true
        const p = (item.type || '').toLowerCase()
        const d = (item.discipline || '').toLowerCase()
        const s = selectedType.toLowerCase()

        if (s === 'modern villas' && (p.includes('villa') || p.includes('mansion'))) return true
        if (s === 'penthouses & estates' && (p.includes('penthouse') || p.includes('estate') || p.includes('chalet'))) return true
        if (s === 'commercial & hotels' && (d === 'commercial' || p.includes('hotel') || p.includes('lobby') || p.includes('office'))) return true
        if (s === 'residential living' && (p.includes('living') || p.includes('bedroom') || p.includes('dining'))) return true
        if (s === 'spa & wellness' && (p.includes('spa') || p.includes('wellness') || p.includes('bath'))) return true
        return p === s
      }

      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        (item.city && item.city.toLowerCase().includes(q)) ||
        (item.country && item.country.toLowerCase().includes(q)) ||
        (item.titlePre && item.titlePre.toLowerCase().includes(q)) ||
        (item.location && item.location.toLowerCase().includes(q))

      return matchesType() && matchesSearch
    })
  }, [allProjects, selectedType, searchQuery])

  return (
    <main className="min-h-screen bg-[#111111] text-white">

      {/* 1. Grand Monumental Hero Section with 3 Video Banners */}
      <section className="relative flex min-h-[75vh] w-full flex-col justify-end overflow-hidden px-6 pt-32 pb-12 sm:px-10 lg:min-h-[85vh] lg:px-16 lg:pt-40 lg:pb-16">

        {/* Background Videos with Smooth Opacity Crossfade */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          {bannerVideos.map((banner, idx) => (
            <video
              key={banner.id}
              ref={(el) => (videoRefs.current[idx] = el)}
              src={banner.src}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className={`absolute inset-0 h-full w-full object-cover object-center scale-105 transition-opacity duration-1000 ease-in-out ${
                idx === currentBanner ? 'opacity-100 z-[1]' : 'opacity-0 z-0 pointer-events-none'
              }`}
            />
          ))}
          <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#111111] via-black/40 to-black/60 pointer-events-none" />
          <div className="absolute inset-0 z-[2] bg-black/25 pointer-events-none" />
        </div>

        {/* Bottom Hero Text */}
        <div className="relative z-10 mx-auto max-w-[1600px] w-full">
          {/* Top Left: < Home */}
          <div className="mb-4">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-[13px] font-medium text-white/70 transition-colors hover:text-[#e3943f] group cursor-pointer"
            >
              <span className="text-[16px] text-white/50 transition-transform group-hover:-translate-x-1 group-hover:text-[#e3943f]">‹</span>
              <span>Home</span>
            </a>
          </div>

          <div className="max-w-[1050px]">
            <h1 className="text-[32px] leading-[1.08] font-bold tracking-[-0.02em] uppercase sm:text-[46px] md:text-[54px] lg:text-[64px]">
              {heroConfig.titleLead || 'All projects'}{' '}
              <span className="text-[#e3943f]">{heroConfig.titleAccent || 'by Unique Graphics®'}</span>
            </h1>
            <p className="mt-5 max-w-[85ch] text-[15px] leading-relaxed text-white/80 sm:text-[17px]">
              {heroConfig.description ||
                'The complete global portfolio of Unique Graphics® — from landmark architectural villas and private estates to haute couture residential interiors and monumental commercial headquarters worldwide.'}
            </p>
          </div>
        </div>
      </section>

      {/* Slideout Filter Drawer Matching Studia 54 */}
      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeDirection="all-projects"
        selectedType={selectedType}
        onSelectType={(type) => setSelectedType(type)}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        onReset={() => {
          setSelectedType('ALL PROJECTS')
          setSearchQuery('')
        }}
        onApply={() => setIsDrawerOpen(false)}
      />

      {/* 2. Filters and Sorting Bar - Positioned Below Banner */}
      <section className="mx-auto max-w-[1600px] px-6 pt-10 pb-2 sm:px-10 lg:px-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="inline-flex items-center gap-3 text-[15px] font-medium tracking-wide text-white transition-colors hover:text-[#e3943f] cursor-pointer"
          >
            <span>Filters and sorting</span>
            <svg className="h-5 w-5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h10m4 0h4M3 12h4m4 0h10M3 18h14m4 0h1" />
              <circle cx="15" cy="6" r="2" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="9" cy="12" r="2" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="19" cy="18" r="2" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </button>

          {/* Quick Category Jump Links */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/60">
            <a href="/architectural-design" className="rounded-full border border-white/10 px-3.5 py-1.5 transition-colors hover:border-[#e3943f] hover:text-[#e3943f]">Architecture</a>
            <a href="/interior-design" className="rounded-full border border-white/10 px-3.5 py-1.5 transition-colors hover:border-[#e3943f] hover:text-[#e3943f]">Interior</a>
            <a href="/commercial-interiors" className="rounded-full border border-white/10 px-3.5 py-1.5 transition-colors hover:border-[#e3943f] hover:text-[#e3943f]">Commercial</a>
          </div>
        </div>
      </section>

      {/* 3. 2-Column Luxury Project Grid Matching Studia 54 */}
      <section className="mx-auto max-w-[1600px] px-6 pt-4 pb-20 sm:px-10 lg:px-16 lg:pb-28">
        {/* Active Filter Indicator if filtered */}
        {(selectedType !== 'ALL PROJECTS' || searchQuery) && (
          <div className="mb-10 flex flex-wrap items-center gap-3">
            <span className="text-[13px] text-white/50">Active filter:</span>
            {selectedType !== 'ALL PROJECTS' && (
              <span className="inline-flex items-center gap-2 rounded-full border border-[#e3943f]/40 bg-[#e3943f]/10 px-3.5 py-1 text-[12px] font-semibold text-[#e3943f]">
                <span>{selectedType}</span>
                <button
                  type="button"
                  onClick={() => setSelectedType('ALL PROJECTS')}
                  className="cursor-pointer hover:text-white"
                  title="Remove filter"
                >
                  ✕
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[12px] text-white">
                <span>"{searchQuery}"</span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="cursor-pointer hover:text-[#e3943f]"
                  title="Clear search"
                >
                  ✕
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setSelectedType('ALL PROJECTS')
                setSearchQuery('')
              }}
              className="text-[12px] text-white/50 underline hover:text-white cursor-pointer ml-2"
            >
              Reset all
            </button>
          </div>
        )}

        <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:gap-x-10 lg:gap-y-14">
          {filteredProjects.map((project) => (
            <PortfolioProjectCard key={project.id} project={project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg text-white/60">No projects found matching your criteria.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedType('ALL PROJECTS')
                setSearchQuery('')
              }}
              className="mt-4 rounded-full bg-[#e3943f] px-6 py-2.5 text-xs font-semibold uppercase text-black cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

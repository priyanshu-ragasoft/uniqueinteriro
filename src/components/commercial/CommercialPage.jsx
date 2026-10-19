import { useState, useMemo, useEffect, useRef } from 'react'
import { getStoredPortfolioConfig } from '../../data/portfolioConfig'
import FilterDrawer from './FilterDrawer'
import banner1 from '../../assets/commercial/commercialbanner.mp4'
import banner2 from '../../assets/commercial/commercialbanner2.mp4'
import banner3 from '../../assets/commercial/commerceialbannner3.mp4'

const defaultBannerVideos = [
  { id: 1, num: '01', title: 'Grand Commercial Architecture', src: banner1 },
  { id: 2, num: '02', title: 'Luxury Hospitality & Lounges', src: banner2 },
  { id: 3, num: '03', title: 'Monumental Business Complexes', src: banner3 },
]

export default function CommercialPage({ lang = 'en' }) {
  const [selectedType, setSelectedType] = useState('ALL PROJECTS')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeProject, setActiveProject] = useState(null)
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

  const heroConfig = portfolioData.heroes?.['commercial-design'] || {}
  const bannerVideos = useMemo(() => {
    return [
      { id: 1, num: '01', title: 'Grand Commercial Architecture', src: heroConfig.banner1 || banner1 },
      { id: 2, num: '02', title: 'Luxury Hospitality & Lounges', src: heroConfig.banner2 || banner2 },
      { id: 3, num: '03', title: 'Monumental Business Complexes', src: heroConfig.banner3 || banner3 },
    ]
  }, [heroConfig.banner1, heroConfig.banner2, heroConfig.banner3])

  const commercialProjects = portfolioData.commercial || []

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
    return commercialProjects.filter((item) => {
      const matchesType = () => {
        if (!selectedType || selectedType === 'ALL' || selectedType === 'ALL PROJECTS') return true
        const p = (item.type || '').toLowerCase()
        const s = selectedType.toLowerCase()
        if (s === 'restaurants' && p.includes('restaurant')) return true
        if (s === 'offices' && p.includes('office')) return true
        if (s === 'hotels' && p.includes('hotel')) return true
        if (s === 'lobbies' && p.includes('lobby')) return true
        if (s === 'vip lounges' && p.includes('vip')) return true
        if (s === 'spa & wellness' && (p.includes('spa') || p.includes('wellness'))) return true
        if (s === 'residential complexes' && (p.includes('residential') || p.includes('complex'))) return true
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
  }, [selectedType, searchQuery])

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

        {/* Bottom Hero Text & Slide Indicators */}
        <div className="relative z-10 mx-auto max-w-[1600px] w-full">
          {/* Top Left: < Portfolio */}
          <div className="mb-4">
            <a
              href="/all-projects"
              className="inline-flex items-center gap-2 text-[13px] font-medium text-white/70 transition-colors hover:text-[#e3943f] group cursor-pointer"
            >
              <span className="text-[16px] text-white/50 transition-transform group-hover:-translate-x-1 group-hover:text-[#e3943f]">‹</span>
              <span>Portfolio</span>
            </a>
          </div>

          <div className="max-w-[1050px]">
            <h1 className="text-[32px] leading-[1.08] font-bold tracking-[-0.02em] uppercase sm:text-[46px] md:text-[54px] lg:text-[64px]">
              {heroConfig.titleLead || 'Commercial interiors'}{' '}
              <span className="text-[#e3943f]">{heroConfig.titleAccent || 'by Unique Graphics®'}</span>
            </h1>
            <p className="mt-5 max-w-[85ch] text-[15px] leading-relaxed text-white/80 sm:text-[17px]">
              {heroConfig.description ||
                'We are chosen by those who strive for excellence — among our clients: Mandarin Oriental Hotel Group, Damac, Jacob&Co, Marriott, Hilton, MR Group, River Park, Engeo Development.'}
            </p>
          </div>
        </div>
      </section>

      {/* Slideout Filter Drawer Matching Studia 54 */}
      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeDirection="commercial-interiors"
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

        <div className="grid gap-x-10 gap-y-14 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              onClick={() => setActiveProject(project)}
              className="group cursor-pointer flex flex-col"
            >
              {/* Image Card Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[26px] bg-[#1a1a1a] shadow-2xl">
                <img
                  src={project.image}
                  alt={project.titlePre}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Top Right: Area Badge (e.g. 400 м²) */}
                {project.area && (
                  <div className="absolute top-4 right-4 rounded-xl border border-white/10 bg-black/60 px-3.5 py-1.5 text-[13px] font-semibold text-white backdrop-blur-md shadow-lg sm:top-5 sm:right-5">
                    {project.area}
                  </div>
                )}

                {/* Bottom Left: Award Badge (if any) */}
                {project.award && (
                  <div className="absolute bottom-4 left-4 max-w-[200px] rounded-lg border border-white/10 bg-black/75 p-2 text-[11px] leading-tight text-white backdrop-blur-md">
                    <span className="block font-bold text-[#e3943f] uppercase">SBID Award</span>
                    <span className="text-white/80">{project.award}</span>
                  </div>
                )}

                {/* Bottom Right: 360° View Badge */}
                {project.badge && (
                  <div className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-transform group-hover:scale-110">
                    <span className="text-[12px] font-bold">360°</span>
                  </div>
                )}
              </div>

              {/* Title & Location Under Card */}
              <div className="mt-5">
                <h3 className="text-[15px] font-semibold tracking-wide text-white/95 uppercase transition-colors group-hover:text-white sm:text-[17px]">
                  {project.titlePre}{' '}
                  <span className="font-bold text-[#e3943f]">{project.location}</span>{' '}
                  {project.titlePost}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-white/60 line-clamp-2">
                  {project.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg text-white/60">No commercial projects found matching your criteria.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedType('All')
                setSearchQuery('')
              }}
              className="mt-4 rounded-full bg-[#e3943f] px-6 py-2.5 text-xs font-semibold uppercase text-black"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>

      {/* 4. Project Lightbox / Detailed Preview Modal */}
      {activeProject && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 p-4 sm:p-8 backdrop-blur-md"
          onClick={() => setActiveProject(null)}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-[1100px] flex-col overflow-y-auto rounded-[28px] bg-[#1a1a1a] p-6 text-white shadow-2xl sm:p-10 no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveProject(null)}
              className="absolute top-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-[24px] text-white backdrop-blur-md hover:bg-black"
            >
              ×
            </button>

            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[22px]">
              <img
                src={activeProject.image}
                alt={activeProject.titlePre}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-4 right-4 rounded-xl bg-black/70 px-4 py-2 text-sm font-semibold text-[#e3943f] backdrop-blur-md">
                {activeProject.area}
              </div>
            </div>

            <div className="mt-6 flex flex-col">
              <h2 className="text-[24px] font-bold tracking-tight uppercase sm:text-[32px]">
                {activeProject.titlePre}{' '}
                <span className="text-[#e3943f]">{activeProject.location}</span>{' '}
                {activeProject.titlePost}
              </h2>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/60 uppercase tracking-wider">
                <span className="rounded-full bg-white/10 px-3 py-1">Type: {activeProject.type}</span>
                <span className="rounded-full bg-white/10 px-3 py-1">Location: {activeProject.city}, {activeProject.country}</span>
                <span className="rounded-full bg-white/10 px-3 py-1">Palette: {activeProject.tone}</span>
              </div>
              <p className="mt-5 text-[16px] leading-relaxed text-white/80">
                {activeProject.description}
              </p>
              <div className="mt-8 flex gap-4">
                <a
                  href="/contacts"
                  className="inline-flex rounded-full bg-[#e3943f] px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-black transition-all hover:bg-[#d68532]"
                >
                  Discuss this project
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

import { useState, useMemo, useEffect, useRef } from 'react'
import { findMenuPage, menuPages } from '../data/menuPages'
import { reelForPage } from '../data/reels'
import LoopVideo from './LoopVideo'
import FilterDrawer, { SERVICE_DIRECTIONS } from './commercial/FilterDrawer'
import { getStoredServicesConfig } from '../data/servicesConfig'

// Dedicated Ultra-HD Video Banners from 'moree' directory
import moreeBim from '../assets/moree/7311107-uhd_2160_4096_25fps.mp4'
import moreeSupervision from '../assets/moree/14807010_3840_2160_25fps.mp4'
import moreeConstruction from '../assets/moree/13002564-hd_1920_1080_24fps.mp4'
import moreeProcurement from '../assets/moree/17224631-uhd_3840_2160_30fps.mp4'
import moreeAllServices1 from '../assets/moree/17211936-hd_1920_1080_30fps.mp4'
import moreeAllServices2 from '../assets/moree/17224730-hd_1920_1080_30fps.mp4'
import moreeArchitecture from '../assets/moree/19728710-uhd_3840_2160_25fps.mp4'

// Dedicated Video Banners for 2D/3D Design
import video2d3d_1 from '../assets/2d3d/18531414-uhd_3840_2160_60fps.mp4'
import video2d3d_2 from '../assets/2d3d/7490395-hd_1920_1080_30fps.mp4'
import video2d3d_3 from '../assets/2d3d/2480790-hd_1920_1080_25fps.mp4'

// Dedicated Video Banners for Walkthrough
import videoWalkthrough_1 from '../assets/walkthrough/6789568-uhd_2160_3840_25fps.mp4'
import videoWalkthrough_2 from '../assets/walkthrough/7480744-uhd_4096_2160_25fps.mp4'
import videoWalkthrough_3 from '../assets/walkthrough/7484777-uhd_4096_2160_25fps.mp4'

const BANNERS_BY_SERVICE = {
  'all-services': [
    { id: 1, title: 'Integrated Architectural & Turnkey Engineering', src: moreeAllServices1 },
    { id: 2, title: 'Global Execution & Multi-Discipline Craft', src: moreeAllServices2 },
  ],
  '2d-3d-design': [
    { id: 1, title: 'Photorealistic 3D Architectural Visualization & CGI', src: video2d3d_1 },
    { id: 2, title: 'Precision 2D Blueprint Drafting & Elevations', src: video2d3d_2 },
    { id: 3, title: 'Volumetric Spatial Modeling & Light Simulation', src: video2d3d_3 },
  ],
  'walkthrough': [
    { id: 1, title: 'Ultra-HD Cinematic 4K Architectural Walkthrough', src: videoWalkthrough_1 },
    { id: 2, title: 'Dynamic Camera Trajectories & Spatial Experience', src: videoWalkthrough_2 },
    { id: 3, title: 'Immersive Flythrough Animation & Day-to-Night Light', src: videoWalkthrough_3 },
  ],
  'bim-engineering': [
    { id: 1, title: 'Computational BIM Modeling & Clash Detection', src: moreeBim },
  ],
  'design-supervision': [
    { id: 1, title: 'On-Site Author Supervision & Blueprints Verification', src: moreeSupervision },
  ],
  'construction-management': [
    { id: 1, title: 'Full Turnkey Site Coordination & Master Scheduling', src: moreeConstruction },
  ],
  'procurement': [
    { id: 1, title: 'Luxury European FF&E & Bespoke Stone Sourcing', src: moreeProcurement },
  ],
  'architecture': [
    { id: 1, title: 'Architectural Volumes & Panoramic Facades', src: moreeArchitecture },
  ],
  'interiors': [
    { id: 1, title: 'Haute Couture Interior Spaces', src: moreeAllServices2 },
  ],
}

const SERVICE_DETAILS = {
  'all-services': {
    subtitle: 'From initial architectural sketches to final white-glove furnishing handover.',
    stages: [
      { num: '01', title: 'Consultation & Site Audit', desc: 'Detailed topographical analysis, regulatory checks, and architectural brief development.' },
      { num: '02', title: 'Concept & 3D Visualization', desc: 'Photorealistic CGI imagery, volume studies, and interior moodboards.' },
      { num: '03', title: 'BIM & Working Blueprints', desc: 'Complete coordinated engineering packages, MEP routes, and clash detection.' },
      { num: '04', title: 'Turnkey Handover & FF&E', desc: 'On-site execution, author supervision, and direct factory furnishing installation.' },
    ],
  },
  '2d-3d-design': {
    subtitle: 'From 2D planning layouts and drafting to photorealistic 3D CGI architectural renderings.',
    stages: [
      { num: '01', title: '2D Floor Plans & Elevations', desc: 'Drafting precise millimeter-accurate CAD floor plans, section cuts, and exterior facade elevations.' },
      { num: '02', title: '3D Geometry & Volumetric Modeling', desc: 'Constructing high-fidelity polygon geometry reflecting exact structural and architectural parameters.' },
      { num: '03', title: 'PBR Shaders & Custom Textures', desc: 'Applying physically based natural marbles, wood grains, metals, and glass reflections.' },
      { num: '04', title: '4K Photorealistic CGI Final Renders', desc: 'Multi-angle cinematic exterior and interior visual presentations with natural light simulations.' },
    ],
  },
  'walkthrough': {
    subtitle: 'Cinematic 4K architectural video tours and dynamic flythrough animation for luxury estates.',
    stages: [
      { num: '01', title: 'Cinematic Camera Pathing', desc: 'Choreographing continuous fluid camera trajectories that guide the viewer through estate spaces.' },
      { num: '02', title: 'Dynamic Lighting & Atmosphere', desc: 'Simulating sun movement, golden hour transitions, and interior evening lighting ambiance.' },
      { num: '03', title: 'High-Fidelity Ray-Traced Animation', desc: 'Rendering ultra-smooth 60fps walkthrough footage with realistic glass refractions and nature.' },
      { num: '04', title: 'Post-Production & Sound Design Handover', desc: 'Professional color grading, atmospheric audio composition, and final 4K video delivery.' },
    ],
  },
  'bim-engineering': {
    subtitle: 'High-precision computational modeling eliminating on-site conflicts before construction begins.',
    stages: [
      { num: '01', title: 'Model Federation & LOD 350-400', desc: 'Integrating structural, MEP, HVAC, and architectural frameworks into a unified Autodesk Revit model.' },
      { num: '02', title: 'Automated Clash Detection', desc: 'Navisworks algorithmic clash reports to resolve pipeline, duct, and beam collisions digitally.' },
      { num: '03', title: 'Bill of Quantities (BOQ)', desc: 'Parametric material takeoffs generating exact procurement schedules and volume estimates.' },
      { num: '04', title: 'Issue Sets & As-Built Model', desc: 'Detailed fabrication sheets for fabricators and digital twin handovers for building facilities.' },
    ],
  },
  'design-supervision': {
    subtitle: 'Unyielding on-site author oversight ensuring 100% adherence to approved blueprints.',
    stages: [
      { num: '01', title: 'Weekly On-Site Audits', desc: 'Rigorous inspection visits by lead architects comparing constructed geometries with master drawings.' },
      { num: '02', title: 'Material Sample Sign-Offs', desc: 'Physical inspection and approval of marble slabs, natural woods, glass panes, and custom metals on-site.' },
      { num: '03', title: 'Contractor Defect Logs', desc: 'Immediate issue logs with photographic logs sent to general contractors for correction before next trades begin.' },
      { num: '04', title: 'As-Built Certification', desc: 'Final architectural sign-off and verification of completed spaces prior to client move-in.' },
    ],
  },
  'construction-management': {
    subtitle: 'Comprehensive general coordination, sequence control, and budget stewardship.',
    stages: [
      { num: '01', title: 'Master Gantt Scheduling', desc: 'Sequenced timeline coordinating structural trades, MEP installers, and luxury finish craftsmen without delays.' },
      { num: '02', title: 'Subcontractor Tendering', desc: 'Rigorous vetting of licensed contractors, contract negotiations, and technical compliance enforcement.' },
      { num: '03', title: 'Staged Milestone Inspections', desc: 'Strict milestone sign-offs linked to quality audits before financial disbursements are authorized.' },
      { num: '04', title: 'Turnkey Commissioning', desc: 'Comprehensive testing of HVAC, smart home automation, security, and final architectural handover.' },
    ],
  },
  'procurement': {
    subtitle: 'Direct worldwide sourcing of luxury European furniture, bespoke joinery, and fine finishes.',
    stages: [
      { num: '01', title: 'Comprehensive FF&E Matrix', desc: 'Itemized specification lists covering every furniture item, custom chandelier, textile, and hardware piece.' },
      { num: '02', title: 'Direct Factory Contracting', desc: 'Purchasing directly from premium Italian, French, and German ateliers at preferred studio trade pricing.' },
      { num: '03', title: 'Quality Audits & Logistics', desc: 'Factory workshop inspections before crating, international customs clearance, and secure insured transit.' },
      { num: '04', title: 'White-Glove Installation', desc: 'On-site unpacking, assembly, styling, and placement under our interior designers’ supervision.' },
    ],
  },
  'architecture': {
    subtitle: 'Monumental modern villas, chalets, and private residences crafted around panoramic views.',
    stages: [
      { num: '01', title: 'Topography & Climate Analysis', desc: 'Sun orientation, terrain contours, and panoramic vista alignment for optimal energy and views.' },
      { num: '02', title: 'Volumetric Architectural Concept', desc: 'Sculptural massing, exterior materials palette, and spatial zoning for master and service quarters.' },
      { num: '03', title: 'Structural & Facade Engineering', desc: 'Full engineering drawings, cantilevered terraces, floor-to-ceiling panoramic glass walls, and roof systems.' },
      { num: '04', title: 'Builder Coordination', desc: 'Full construction packages and technical coordination with general engineering teams.' },
    ],
  },
  'interiors': {
    subtitle: 'Haute couture residential interiors celebrating natural materials, layered lighting, and tactile warmth.',
    stages: [
      { num: '01', title: 'Ergonomic Space Planning', desc: 'Optimal flow, private zoning, and spatial proportions tailored to your daily lifestyle.' },
      { num: '02', title: 'Photorealistic 3D Concept', desc: 'Detailed CGI renders illustrating marble selections, custom wood veneers, and bespoke brass accents.' },
      { num: '03', title: 'Technical Drawings Package', desc: 'Full architectural drawing sets for electrical switches, plumbing, tile layouts, and bespoke cabinetry.' },
      { num: '04', title: 'Final Styling & Dressing', desc: 'Curating art pieces, sculptural accessories, rugs, and custom window treatments for move-in perfection.' },
    ],
  },
  'commercial-interiors': {
    subtitle: 'Monumental hospitality, flagship retail, and executive business spaces that inspire admiration.',
    stages: [
      { num: '01', title: 'Brand Identity & Flow Strategy', desc: 'Aligning architectural layout with guest psychology, guest zoning, and secluded service corridors.' },
      { num: '02', title: 'Hospitality Lighting & Acoustics', desc: 'Engineered acoustic ceiling treatments and scene-based evening lighting design.' },
      { num: '03', title: 'Commercial Grade FF&E', desc: 'High-traffic certified textiles, bespoke joinery, and durable marble surfaces meeting luxury hospitality standards.' },
      { num: '04', title: 'Opening Readiness & Handover', desc: 'Coordination with operations teams, kitchen consultants, and local municipal authorities.' },
    ],
  },
}

function getServicePreview(itemId) {
  if (itemId === '2d-3d-design') return video2d3d_1
  if (itemId === 'walkthrough') return videoWalkthrough_1
  return reelForPage(itemId)
}

export default function StudioPage({ lang = 'en', id }) {
  const [selectedType, setSelectedType] = useState('ALL SERVICES')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentBanner, setCurrentBanner] = useState(0)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [servicesData, setServicesData] = useState(() => getStoredServicesConfig())
  const videoRefs = useRef([])

  useEffect(() => {
    const handleUpdate = () => {
      setServicesData(getStoredServicesConfig())
    }
    window.addEventListener('services-pages-config-changed', handleUpdate)
    return () => window.removeEventListener('services-pages-config-changed', handleUpdate)
  }, [])

  const page = findMenuPage(id)
  const text = page?.[lang] ?? page?.en
  const isAllServices = id === 'all-services'

  const currentHero = servicesData.heroes?.[id] || {}
  const currentStages = servicesData.stages?.[id] || null

  const bannerVideos = useMemo(() => {
    const defaultList = BANNERS_BY_SERVICE[id] || BANNERS_BY_SERVICE['all-services']
    if (currentHero.banner1 || currentHero.banner2 || currentHero.banner3) {
      const customList = []
      if (currentHero.banner1) customList.push({ id: 1, title: 'Studio Showcase 01', src: currentHero.banner1 })
      if (currentHero.banner2) customList.push({ id: 2, title: 'Studio Showcase 02', src: currentHero.banner2 })
      if (currentHero.banner3) customList.push({ id: 3, title: 'Studio Showcase 03', src: currentHero.banner3 })
      if (customList.length > 0) return customList
    }
    return defaultList
  }, [id, currentHero.banner1, currentHero.banner2, currentHero.banner3])

  // Reset banner index when id changes
  useEffect(() => {
    setCurrentBanner(0)
  }, [id])

  // Auto transition banner every 7 seconds if more than 1 video
  useEffect(() => {
    if (bannerVideos.length <= 1) return
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerVideos.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [bannerVideos.length])

  // Play active video and pause others
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
  }, [currentBanner, id])

  // Services catalog list
  const allServicesList = useMemo(() => {
    return menuPages.filter((item) => item.group === 'services' && item.id !== 'all-services')
  }, [])

  // Other related services for single-service page
  const relatedServices = useMemo(() => {
    return menuPages.filter((item) => item.group === 'services' && item.id !== id && item.id !== 'all-services')
  }, [id])

  // Filtered services on /all-services
  const filteredServices = useMemo(() => {
    return allServicesList.filter((item) => {
      const itemText = item[lang] ?? item.en
      const matchesType = () => {
        if (!selectedType || selectedType === 'ALL SERVICES' || selectedType === 'ALL DISCIPLINES') return true
        const s = selectedType.toLowerCase()
        const t = (itemText.title || '').toLowerCase()
        const i = (item.id || '').toLowerCase()
        return t.includes(s) || i.includes(s)
      }

      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        (itemText.title && itemText.title.toLowerCase().includes(q)) ||
        (itemText.summary && itemText.summary.toLowerCase().includes(q)) ||
        (itemText.points && itemText.points.some((p) => p.toLowerCase().includes(q)))

      return matchesType() && matchesSearch
    })
  }, [allServicesList, selectedType, searchQuery, lang])

  if (!page || !text) {
    return (
      <main className="min-h-screen bg-[#111111] px-6 pt-40 pb-24 text-white">
        <div className="mx-auto max-w-[1600px]">
          <h1 className="text-4xl">{lang === 'ru' ? 'Страница не найдена' : 'Page not found'}</h1>
          <a href="/all-services" className="mt-4 inline-block text-[#e3943f] underline">
            {lang === 'ru' ? 'Все услуги' : 'Back to all services'}
          </a>
        </div>
      </main>
    )
  }

  const extraDetails = SERVICE_DETAILS[id] || SERVICE_DETAILS['all-services']

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      {/* 1. Grand Monumental Hero Section with 3 Auto-Crossfading Video Banners */}
      <section className="relative flex min-h-[75vh] w-full flex-col justify-end overflow-hidden px-6 pt-32 pb-12 sm:px-10 lg:min-h-[85vh] lg:px-16 lg:pt-40 lg:pb-16">
        {/* Background Videos with Smooth Opacity Crossfade */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          {bannerVideos.map((banner, idx) => (
            <video
              key={`${id}-${banner.id}-${idx}`}
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

        {/* Bottom Hero Text & Category Breadcrumb */}
        <div className="relative z-10 mx-auto max-w-[1600px] w-full">
          {/* Top Left: < Services or < Home */}
          <div className="mb-4">
            <a
              href={isAllServices ? '/' : '/all-services'}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-white/70 transition-colors hover:text-[#e3943f] group cursor-pointer"
            >
              <span className="text-[16px] text-white/50 transition-transform group-hover:-translate-x-1 group-hover:text-[#e3943f]">
                ‹
              </span>
              <span>{isAllServices ? (lang === 'ru' ? 'Главная' : 'Home') : (lang === 'ru' ? 'Все услуги' : 'Services')}</span>
            </a>
          </div>

          <div className="max-w-[1100px]">
            <h1 className="text-[32px] leading-[1.08] font-bold tracking-[-0.02em] uppercase sm:text-[46px] md:text-[54px] lg:text-[64px]">
              {currentHero.titleLead || text.title}{' '}
              <span className="text-[#e3943f]">{currentHero.titleAccent || 'by Unique Graphics®'}</span>
            </h1>
            <p className="mt-5 max-w-[85ch] text-[15px] leading-relaxed text-white/80 sm:text-[17px]">
              {currentHero.subtitle || extraDetails.subtitle || text.summary}
            </p>
          </div>
        </div>
      </section>

      {/* Slideout Filter Drawer Matching Studia 54 */}
      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeDirection={id}
        selectedType={selectedType}
        onSelectType={(type) => setSelectedType(type)}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        onReset={() => {
          setSelectedType('ALL SERVICES')
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

      {/* 3. Main Content Section */}
      <section className="mx-auto max-w-[1600px] px-6 pt-4 pb-20 sm:px-10 lg:px-16 lg:pb-28">
        {/* Active Filter Indicator if filtered */}
        {(selectedType !== 'ALL SERVICES' || searchQuery) && (
          <div className="mb-10 flex flex-wrap items-center gap-3">
            <span className="text-[13px] text-white/50">Active filter:</span>
            {selectedType !== 'ALL SERVICES' && (
              <span className="inline-flex items-center gap-2 rounded-full border border-[#e3943f]/40 bg-[#e3943f]/10 px-3.5 py-1 text-[12px] font-semibold text-[#e3943f]">
                <span>{selectedType}</span>
                <button
                  type="button"
                  onClick={() => setSelectedType('ALL SERVICES')}
                  className="cursor-pointer hover:text-white"
                  title="Remove filter"
                >
                  ✕
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-1 text-[12px] text-white">
                <span>&ldquo;{searchQuery}&rdquo;</span>
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
                setSelectedType('ALL SERVICES')
                setSearchQuery('')
              }}
              className="text-[12px] text-white/50 underline hover:text-white cursor-pointer ml-2"
            >
              Reset all
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* CASE A: ALL SERVICES CATALOG GRID                            */}
        {/* ============================================================ */}
        {isAllServices ? (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <p className="text-[12px] tracking-[0.2em] text-[#e3943f] uppercase">
                  {lang === 'ru' ? 'Полный спектр услуг' : 'Full Scope of Services'}
                </p>
                <h2 className="mt-2 text-[28px] font-medium tracking-tight text-white sm:text-[38px]">
                  {lang === 'ru' ? 'Наши ключевые направления' : 'Our Design & Engineering Disciplines'}
                </h2>
              </div>
              <p className="text-[13px] text-white/60">
                {filteredServices.length} {filteredServices.length === 1 ? 'discipline' : 'disciplines'}
              </p>
            </div>

            {/* Exactly 4 cards per row on desktop */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredServices.map((item) => {
                const itemText = item[lang] ?? item.en
                return (
                  <a
                    key={item.id}
                    href={`/${item.id}`}
                    className="group flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-[#161616] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#e3943f]/60 hover:bg-[#1d1d1d] hover:shadow-2xl hover:shadow-[#e3943f]/10"
                  >
                    <div>
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px] bg-black">
                        <LoopVideo
                          src={getServicePreview(item.id)}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      </div>

                      <p className="mt-4 text-[11px] tracking-[0.16em] text-[#e3943f] uppercase font-semibold">
                        {itemText.category}
                      </p>
                      <h3 className="mt-1.5 text-[20px] font-bold text-white transition-colors group-hover:text-[#e3943f]">
                        {itemText.title}
                      </h3>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-white/70 line-clamp-3">
                        {itemText.summary}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {itemText.points.slice(0, 3).map((pt) => (
                          <span
                            key={pt}
                            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/70"
                          >
                            {pt}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-[12px] font-bold tracking-wider text-[#e3943f] uppercase">
                      <span>{lang === 'ru' ? 'Подробнее' : 'Explore discipline'}</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                    </div>
                  </a>
                )
              })}
            </div>

            {/* Turnkey Standards of Excellence Section */}
            <div className="mt-20 border-t border-white/10 pt-16">
              <div className="max-w-[760px]">
                <p className="text-[12px] tracking-[0.2em] text-[#e3943f] uppercase">
                  {lang === 'ru' ? 'Стандарты Unique Graphics®' : 'Unique Graphics® Standards'}
                </p>
                <h2 className="mt-2 text-[28px] font-medium tracking-tight text-white sm:text-[36px]">
                  {servicesData.turnkey?.title || 'Full Turnkey Integration Without Compromise'}
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-white/70">
                  {servicesData.turnkey?.subtitle || (lang === 'ru'
                    ? 'Мы объединяем архитекторов, дизайнеров интерьера, инженеров BIM и специалистов по закупкам в одну слаженную команду, гарантируя безупречное совпадение проекта и реальности.'
                    : 'We integrate architects, interior designers, BIM engineers, and global procurement specialists into one cohesive team, guaranteeing exact alignment between approved blueprints and physical handover.')}
                </p>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {(servicesData.turnkey?.pillars || []).map((pillar, idx) => (
                  <div key={idx} className="rounded-[20px] border border-white/10 bg-[#161616] p-6">
                    <span className="text-[28px] font-bold text-[#e3943f]">{pillar.num || `0${idx + 1}`}</span>
                    <h4 className="mt-3 text-[17px] font-bold text-white">{pillar.title}</h4>
                    <p className="mt-2 text-[13px] leading-relaxed text-white/70">{pillar.desc}</p>
                  </div>
                ))}
              </div>

              {/* Consultation CTA Card */}
              <div className="mt-12 rounded-[24px] border border-[#e3943f]/30 bg-gradient-to-r from-[#1c1813] via-[#161616] to-[#1c1813] p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-[24px] sm:text-[30px] font-bold text-white">
                    {servicesData.cta?.title || 'Ready to initiate your luxury estate or commercial project?'}
                  </h3>
                  <p className="mt-2 text-[15px] text-white/75 max-w-[65ch]">
                    {servicesData.cta?.subtitle || 'Contact our architectural directors to arrange a confidential consultation and comprehensive project feasibility audit.'}
                  </p>
                </div>
                <a
                  href={servicesData.cta?.buttonLink || '/contacts'}
                  className="shrink-0 rounded-full bg-[#e3943f] px-8 py-4 text-[13px] font-bold tracking-[0.14em] text-black uppercase transition-all duration-300 hover:bg-[#d68532] hover:shadow-lg hover:shadow-[#e3943f]/25"
                >
                  {servicesData.cta?.buttonText || (lang === 'ru' ? 'Обсудить проект' : 'Discuss a project')}
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* CASE B: INDIVIDUAL DISCIPLINE / SERVICE PAGE                 */
          /* ============================================================ */
          <div>
            {/* 2-Column Luxury Layout */}
            <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr]">
              {/* Left Column: Scope narrative, stages & CTA */}
              <div>
                <p className="text-[12px] tracking-[0.2em] text-[#e3943f] uppercase font-semibold">
                  {text.category} — {text.title}
                </p>
                <h2 className="mt-3 text-[28px] leading-tight font-medium text-white sm:text-[38px] max-w-[22ch]">
                  {text.summary}
                </h2>
                <p className="mt-6 text-[16px] leading-relaxed text-white/80 max-w-[70ch]">
                  {text.detail}
                </p>

                {/* 4-Stage Architectural Process */}
                {(currentStages || extraDetails.stages) && (
                  <div className="mt-12">
                    <h3 className="text-[12px] tracking-[0.2em] text-white/50 uppercase font-semibold">
                      {lang === 'ru' ? 'Этапы реализации' : 'Implementation Process'}
                    </h3>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {(currentStages || extraDetails.stages).map((stage) => (
                        <div
                          key={stage.num}
                          className="rounded-[18px] border border-white/10 bg-[#161616] p-5 transition-colors hover:border-[#e3943f]/40"
                        >
                          <span className="text-[18px] font-bold text-[#e3943f]">{stage.num}</span>
                          <h4 className="mt-2 text-[15px] font-bold text-white">{stage.title}</h4>
                          <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/70">{stage.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action CTA Buttons */}
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <a
                    href="/contacts"
                    className="inline-flex items-center gap-2 rounded-full bg-[#e3943f] px-8 py-4 text-[12.5px] font-bold tracking-[0.14em] text-black uppercase transition-all duration-300 hover:bg-[#d68532] hover:shadow-lg hover:shadow-[#e3943f]/25"
                  >
                    <span>{lang === 'ru' ? 'Обсудить эту услугу' : 'Discuss this service'}</span>
                    <span>→</span>
                  </a>
                  <a
                    href="/all-services"
                    className="inline-flex rounded-full border border-white/20 px-6 py-3.5 text-[12px] font-medium tracking-wider text-white transition-colors hover:border-white hover:bg-white/5"
                  >
                    {lang === 'ru' ? 'Все услуги' : 'View all services'}
                  </a>
                </div>
              </div>

              {/* Right Column: Glassmorphic Scope & Deliverables Card */}
              <div className="rounded-[24px] border border-white/10 bg-[#161616] p-8 lg:p-9 shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <h3 className="text-[12px] tracking-[0.2em] text-[#e3943f] uppercase font-bold">
                      {lang === 'ru' ? 'Состав документации' : 'Included Deliverables'}
                    </h3>
                    <span className="rounded-full bg-[#e3943f]/15 px-3 py-1 text-[11px] font-semibold text-[#e3943f]">
                      Turnkey
                    </span>
                  </div>

                  <ul className="mt-6 flex flex-col gap-4">
                    {text.points.map((item, idx) => (
                      <li key={item} className="flex items-start gap-3 text-[14.5px] text-white/90">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e3943f]/20 text-[#e3943f] text-[12px] font-bold mt-0.5">
                          ✓
                        </span>
                        <div>
                          <span className="font-semibold text-white">{item}</span>
                          <p className="text-[12px] text-white/50 mt-0.5">
                            Standard {idx + 1} compliance package with author verification.
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 rounded-[16px] border border-white/10 bg-white/5 p-4">
                    <p className="text-[11px] tracking-wider text-white/50 uppercase font-semibold">
                      Quality Standard
                    </p>
                    <p className="mt-1 text-[13px] text-white/80">
                      ISO 19650 / BIM LOD 400 / Eurocodes & International Building Code Compliant.
                    </p>
                  </div>
                </div>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="text-[13px] text-white/60">
                    Need a tailored scope for your private residence or commercial property?
                  </p>
                  <a
                    href="/contacts"
                    className="mt-3 inline-block text-[13px] font-bold text-[#e3943f] hover:underline"
                  >
                    Request custom proposal →
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Section: Explore Other Disciplines (4-column grid) */}
            <div className="mt-24 border-t border-white/10 pt-16">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                <div>
                  <p className="text-[12px] tracking-[0.2em] text-[#e3943f] uppercase">
                    {lang === 'ru' ? 'Смежные дисциплины' : 'Interdisciplinary Capabilities'}
                  </p>
                  <h3 className="mt-2 text-[26px] font-medium tracking-tight text-white sm:text-[34px]">
                    {lang === 'ru' ? 'Другие услуги студии' : 'Explore Other Disciplines'}
                  </h3>
                </div>
                <a
                  href="/all-services"
                  className="text-[13px] font-semibold text-[#e3943f] hover:underline"
                >
                  {lang === 'ru' ? 'Все услуги →' : 'All services →'}
                </a>
              </div>

              {/* 4 Cards per row */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedServices.slice(0, 4).map((item) => {
                  const itemText = item[lang] ?? item.en
                  return (
                    <a
                      key={item.id}
                      href={`/${item.id}`}
                      className="group flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-[#161616] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#e3943f]/60 hover:bg-[#1d1d1d] hover:shadow-2xl"
                    >
                      <div>
                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px] bg-black">
                          <LoopVideo
                            src={getServicePreview(item.id)}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>

                        <p className="mt-4 text-[11px] tracking-[0.16em] text-[#e3943f] uppercase font-semibold">
                          {itemText.category}
                        </p>
                        <h4 className="mt-1.5 text-[18px] font-bold text-white transition-colors group-hover:text-[#e3943f]">
                          {itemText.title}
                        </h4>
                        <p className="mt-2 text-[13px] leading-relaxed text-white/70 line-clamp-2">
                          {itemText.summary}
                        </p>
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-[12px] font-bold tracking-wider text-[#e3943f] uppercase">
                        <span>{lang === 'ru' ? 'Подробнее' : 'View service'}</span>
                        <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

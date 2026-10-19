import { useEffect, useState } from 'react'

export const PORTFOLIO_DIRECTIONS = [
  { id: 'all-projects', label: 'ALL PROJECTS', path: '/all-projects' },
  { id: 'interior-design', label: 'INTERIOR DESIGN', path: '/interior-design' },
  { id: 'architectural-design', label: 'ARCHITECTURAL DESIGN', path: '/architectural-design' },
  { id: 'commercial-interiors', label: 'COMMERCIAL INTERIORS', path: '/commercial-interiors' },
]

export const SERVICE_DIRECTIONS = [
  { id: 'all-services', label: 'ALL SERVICES', path: '/all-services' },
  { id: 'architecture', label: 'ARCHITECTURE', path: '/architecture' },
  { id: 'interiors', label: 'INTERIORS', path: '/interiors' },
  { id: 'commercial-interiors', label: 'COMMERCIAL INTERIORS', path: '/commercial-interiors' },
  { id: '2d-3d-design', label: '2D / 3D DESIGN', path: '/2d-3d-design' },
  { id: 'walkthrough', label: 'WALKTHROUGH', path: '/walkthrough' },
  { id: 'bim-engineering', label: 'BIM ENGINEERING', path: '/bim-engineering' },
  { id: 'design-supervision', label: 'DESIGN SUPERVISION', path: '/design-supervision' },
  { id: 'construction-management', label: 'CONSTRUCTION MANAGEMENT', path: '/construction-management' },
  { id: 'procurement', label: 'PROCUREMENT', path: '/procurement' },
]

export const DIRECTIONS = PORTFOLIO_DIRECTIONS

export const OBJECT_TYPES_BY_DIRECTION = {
  'commercial-interiors': [
    { id: 'ALL PROJECTS', label: 'ALL PROJECTS' },
    { id: 'RESTAURANTS', label: 'RESTAURANTS' },
    { id: 'OFFICES', label: 'OFFICES' },
    { id: 'HOTELS', label: 'HOTELS' },
    { id: 'LOBBIES', label: 'LOBBIES' },
    { id: 'VIP LOUNGES', label: 'VIP LOUNGES' },
    { id: 'SPA & WELLNESS', label: 'SPA & WELLNESS' },
    { id: 'RESIDENTIAL COMPLEXES', label: 'RESIDENTIAL COMPLEXES' },
  ],
  'interior-design': [
    { id: 'ALL PROJECTS', label: 'ALL PROJECTS' },
    { id: 'PENTHOUSES', label: 'PENTHOUSES' },
    { id: 'MASTER BEDROOMS', label: 'MASTER BEDROOMS' },
    { id: 'LIVING ROOMS', label: 'LIVING ROOMS' },
    { id: 'DINING & KITCHENS', label: 'DINING & KITCHENS' },
    { id: 'BATHROOMS & SPA', label: 'BATHROOMS & SPA' },
    { id: 'VILLAS', label: 'VILLAS' },
  ],
  'architectural-design': [
    { id: 'ALL PROJECTS', label: 'ALL PROJECTS' },
    { id: 'MODERN VILLAS', label: 'MODERN VILLAS' },
    { id: 'CLASSIC MANSIONS', label: 'CLASSIC MANSIONS' },
    { id: 'MOUNTAIN CHALETS', label: 'MOUNTAIN CHALETS' },
    { id: 'PRIVATE RESIDENCES', label: 'PRIVATE RESIDENCES' },
  ],
  'all-projects': [
    { id: 'ALL PROJECTS', label: 'ALL PROJECTS' },
    { id: 'MODERN VILLAS', label: 'MODERN VILLAS' },
    { id: 'PENTHOUSES', label: 'PENTHOUSES' },
    { id: 'HOTELS & COMMERCIAL', label: 'HOTELS & COMMERCIAL' },
    { id: 'SPA & WELLNESS', label: 'SPA & WELLNESS' },
  ],
  'all-services': [
    { id: 'ALL SERVICES', label: 'ALL SERVICES' },
    { id: 'ARCHITECTURE', label: 'ARCHITECTURE' },
    { id: 'INTERIORS', label: 'INTERIORS' },
    { id: 'COMMERCIAL INTERIORS', label: 'COMMERCIAL INTERIORS' },
    { id: '2D / 3D DESIGN', label: '2D / 3D DESIGN' },
    { id: 'WALKTHROUGH', label: 'WALKTHROUGH' },
    { id: 'BIM ENGINEERING', label: 'BIM ENGINEERING' },
    { id: 'DESIGN SUPERVISION', label: 'DESIGN SUPERVISION' },
    { id: 'CONSTRUCTION MANAGEMENT', label: 'CONSTRUCTION MANAGEMENT' },
    { id: 'PROCUREMENT', label: 'PROCUREMENT' },
  ],
  '2d-3d-design': [
    { id: 'ALL DELIVERABLES', label: 'ALL DELIVERABLES' },
    { id: '2D FLOOR PLANS', label: '2D FLOOR PLANS' },
    { id: '3D EXTERIOR RENDERS', label: '3D EXTERIOR RENDERS' },
    { id: '3D INTERIOR RENDERS', label: '3D INTERIOR RENDERS' },
    { id: 'MATERIAL MOODBOARDS', label: 'MATERIAL MOODBOARDS' },
  ],
  'walkthrough': [
    { id: 'ALL TOURS', label: 'ALL TOURS' },
    { id: 'CINEMATIC FLYTHROUGHS', label: 'CINEMATIC FLYTHROUGHS' },
    { id: 'INTERIOR ANIMATION', label: 'INTERIOR ANIMATION' },
    { id: 'DAY TO NIGHT CYCLES', label: 'DAY TO NIGHT CYCLES' },
    { id: 'VR 360 TOURS', label: 'VR 360 TOURS' },
  ],
  'bim-engineering': [
    { id: 'ALL DELIVERABLES', label: 'ALL DELIVERABLES' },
    { id: 'REVIT 3D MODELING', label: 'REVIT 3D MODELING' },
    { id: 'CLASH DETECTION', label: 'CLASH DETECTION' },
    { id: 'MEP COORDINATION', label: 'MEP COORDINATION' },
    { id: 'LOD 400 PACKAGES', label: 'LOD 400 PACKAGES' },
  ],
  'design-supervision': [
    { id: 'ALL PHASES', label: 'ALL PHASES' },
    { id: 'SITE INSPECTIONS', label: 'SITE INSPECTIONS' },
    { id: 'DRAWING COMPLIANCE', label: 'DRAWING COMPLIANCE' },
    { id: 'MATERIAL APPROVALS', label: 'MATERIAL APPROVALS' },
    { id: 'AS-BUILT AUDITS', label: 'AS-BUILT AUDITS' },
  ],
  'construction-management': [
    { id: 'ALL PHASES', label: 'ALL PHASES' },
    { id: 'MASTER SCHEDULING', label: 'MASTER SCHEDULING' },
    { id: 'CONTRACTOR TENDERING', label: 'CONTRACTOR TENDERING' },
    { id: 'QUALITY CONTROL', label: 'QUALITY CONTROL' },
    { id: 'COMMISSIONING', label: 'COMMISSIONING' },
  ],
  'procurement': [
    { id: 'ALL CATEGORIES', label: 'ALL CATEGORIES' },
    { id: 'ITALIAN FURNITURE', label: 'ITALIAN FURNITURE' },
    { id: 'ARCHITECTURAL LIGHTING', label: 'ARCHITECTURAL LIGHTING' },
    { id: 'BESPOKE JOINERY', label: 'BESPOKE JOINERY' },
    { id: 'NATURAL STONE & MARBLE', label: 'NATURAL STONE & MARBLE' },
  ],
}

export default function FilterDrawer({
  isOpen,
  onClose,
  activeDirection = 'commercial-interiors',
  selectedType,
  onSelectType,
  searchQuery,
  onSearchChange,
  onReset,
  onApply,
  customObjectTypes,
  customDirections,
}) {
  const isServiceDirection =
    activeDirection === 'all-services' ||
    activeDirection === '2d-3d-design' ||
    activeDirection === 'walkthrough' ||
    activeDirection === 'bim-engineering' ||
    activeDirection === 'design-supervision' ||
    activeDirection === 'construction-management' ||
    activeDirection === 'procurement' ||
    activeDirection === 'architecture' ||
    activeDirection === 'interiors'

  const [activeTab, setActiveTab] = useState(() => (isServiceDirection ? 'SERVICES' : 'PORTFOLIO'))

  useEffect(() => {
    setActiveTab(isServiceDirection ? 'SERVICES' : 'PORTFOLIO')
  }, [activeDirection, isServiceDirection])

  const currentDirectionsList =
    customDirections ||
    (activeTab === 'SERVICES' ? SERVICE_DIRECTIONS : PORTFOLIO_DIRECTIONS)

  const typesToRender =
    customObjectTypes ||
    OBJECT_TYPES_BY_DIRECTION[activeDirection] ||
    (isServiceDirection ? OBJECT_TYPES_BY_DIRECTION['all-services'] : OBJECT_TYPES_BY_DIRECTION['commercial-interiors'])
  // Prevent background body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const navigateTo = (path) => {
    onClose()
    if (window.location.pathname !== path) {
      history.pushState(null, '', path)
      window.dispatchEvent(new PopStateEvent('popstate'))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-[115] bg-black/75 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <aside
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        onWheel={(e) => e.stopPropagation()}
        className={`fixed top-0 right-0 bottom-0 z-[120] flex w-full max-w-[480px] flex-col border-l border-white/10 bg-[#131313]/98 backdrop-blur-2xl text-white shadow-[0_0_60px_rgba(0,0,0,0.85)] transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-all duration-200 hover:border-[#e3943f] hover:bg-[#e3943f]/10 hover:text-[#e3943f] active:scale-95 cursor-pointer"
            aria-label="Close filters"
          >
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center">
            <span className="block text-[9.5px] font-bold tracking-[0.25em] text-[#e3943f] uppercase">
              STUDIA 54
            </span>
            <h2 className="text-[12px] font-semibold tracking-[0.16em] text-white uppercase">
              Filter Directory
            </h2>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="rounded-lg px-2.5 py-1.5 text-[10.5px] font-bold tracking-[0.14em] text-white/45 uppercase transition-colors hover:bg-white/[0.06] hover:text-[#e3943f] cursor-pointer"
          >
            Reset
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          onWheel={(e) => e.stopPropagation()}
          className="flex-1 overflow-y-auto overscroll-contain px-6 py-5 space-y-6 custom-scrollbar"
        >
          {/* Search Box */}
          <div className="relative group">
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center text-white/40 transition-colors group-focus-within:text-[#e3943f]">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Filter by country, city or keyword..."
              value={searchQuery || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#1a1a1a] pl-10 pr-9 py-3 text-[12.5px] text-white placeholder-white/35 outline-none transition-all duration-200 hover:border-white/20 focus:border-[#e3943f]/80 focus:bg-[#202020] focus:ring-1 focus:ring-[#e3943f]/30"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer p-1"
                aria-label="Clear search"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Segmented Portfolio / Services Switcher */}
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#0d0d0d] p-1 border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setActiveTab('PORTFOLIO')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-[11px] font-bold tracking-[0.14em] uppercase transition-all duration-200 cursor-pointer ${
                activeTab === 'PORTFOLIO'
                  ? 'bg-[#e3943f] text-black shadow-md shadow-[#e3943f]/20 font-extrabold'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span>Portfolio</span>
              <span
                className={`rounded px-1.5 py-0.5 text-[9px] font-mono ${
                  activeTab === 'PORTFOLIO' ? 'bg-black/20 text-black' : 'bg-white/10 text-white/50'
                }`}
              >
                {PORTFOLIO_DIRECTIONS.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('SERVICES')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-[11px] font-bold tracking-[0.14em] uppercase transition-all duration-200 cursor-pointer ${
                activeTab === 'SERVICES'
                  ? 'bg-[#e3943f] text-black shadow-md shadow-[#e3943f]/20 font-extrabold'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span>Services</span>
              <span
                className={`rounded px-1.5 py-0.5 text-[9px] font-mono ${
                  activeTab === 'SERVICES' ? 'bg-black/20 text-black' : 'bg-white/10 text-white/50'
                }`}
              >
                {SERVICE_DIRECTIONS.length}
              </span>
            </button>
          </div>

          {/* DIRECTIONS SECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e3943f]" />
                <h3 className="text-[10px] font-bold tracking-[0.18em] text-white/50 uppercase">
                  01 / {activeTab === 'SERVICES' ? 'SERVICES SELECTION' : 'PORTFOLIO DIRECTIONS'}
                </h3>
              </div>
              <span className="text-[9.5px] font-mono tracking-wider text-white/35">
                {currentDirectionsList.length} ITEMS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentDirectionsList.map((dir) => {
                const isCurrent = activeDirection === dir.id
                return (
                  <button
                    key={dir.id}
                    type="button"
                    onClick={() => navigateTo(dir.path)}
                    className={`group relative flex items-center justify-between rounded-xl px-3.5 py-3 text-left transition-all duration-200 cursor-pointer ${
                      isCurrent
                        ? 'border border-[#e3943f] bg-gradient-to-r from-[#e3943f]/20 to-[#e3943f]/5 text-white shadow-[0_0_20px_rgba(227,148,63,0.15)] ring-1 ring-[#e3943f]/40'
                        : 'border border-white/[0.08] bg-[#1a1a1a]/70 text-white/75 hover:border-white/20 hover:bg-[#222222] hover:text-white'
                    }`}
                  >
                    <span className="text-[11px] font-semibold tracking-[0.06em] uppercase line-clamp-1 pr-1">
                      {dir.label}
                    </span>
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-all ${
                        isCurrent
                          ? 'bg-[#e3943f] text-black'
                          : 'text-white/25 group-hover:text-white/70'
                      }`}
                    >
                      {isCurrent ? (
                        <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* OBJECT TYPE / CATEGORIES SECTION */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between pb-1 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e3943f]" />
                <h3 className="text-[10px] font-bold tracking-[0.18em] text-white/50 uppercase">
                  02 / CATEGORIES & TYPOLOGY
                </h3>
              </div>
              <span className="text-[9.5px] font-mono tracking-wider text-white/35">
                {typesToRender.length} TYPES
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {typesToRender.map((type) => {
                const isSelected = selectedType === type.id
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => onSelectType(type.id)}
                    className={`group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border border-[#e3943f] bg-[#e3943f] text-black shadow-md shadow-[#e3943f]/25 font-bold'
                        : 'border border-white/[0.08] bg-[#1a1a1a]/60 text-white/70 hover:border-white/20 hover:bg-[#222222] hover:text-white'
                    }`}
                  >
                    <span className="text-[10.5px] font-semibold tracking-[0.05em] uppercase line-clamp-1 pr-1">
                      {type.label}
                    </span>
                    {isSelected ? (
                      <svg
                        className="h-3 w-3 shrink-0 text-black"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-white/10 group-hover:bg-white/30" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sticky Apply Footer */}
        <div className="sticky bottom-0 border-t border-white/10 bg-[#131313]/95 backdrop-blur-md px-6 py-4 flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/60 transition-all hover:border-[#e3943f]/50 hover:bg-[#e3943f]/10 hover:text-[#e3943f] active:scale-95 cursor-pointer shrink-0"
            title="Reset all filters"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onApply}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e3943f] via-[#ec9f46] to-[#d68532] py-3.5 text-[12px] font-bold tracking-[0.16em] text-black uppercase transition-all duration-200 hover:brightness-105 hover:shadow-lg hover:shadow-[#e3943f]/30 active:scale-[0.99] cursor-pointer"
          >
            <span>Apply Selection</span>
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </aside>
    </>
  )
}

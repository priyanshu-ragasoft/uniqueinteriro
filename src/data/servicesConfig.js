export const SERVICES_LIST = [
  { id: 'all-services', label: 'All Services', path: '/all-services' },
  { id: 'architecture', label: 'Architecture', path: '/architecture' },
  { id: 'interiors', label: 'Interiors', path: '/interiors' },
  { id: 'commercial-interiors', label: 'Commercial Interiors', path: '/commercial-interiors' },
  { id: '2d-3d-design', label: '2D / 3D Design', path: '/2d-3d-design' },
  { id: 'walkthrough', label: 'Walkthrough', path: '/walkthrough' },
  { id: 'bim-engineering', label: 'BIM Engineering', path: '/bim-engineering' },
  { id: 'design-supervision', label: 'Design Supervision', path: '/design-supervision' },
  { id: 'construction-management', label: 'Construction Management', path: '/construction-management' },
  { id: 'procurement', label: 'Procurement', path: '/procurement' },
]

export const DEFAULT_SERVICES_CONFIG = {
  // Navigation Dropdown Cards (Screenshot 1)
  navCards: {
    'all-services': {
      title: 'ALL SERVICES',
      hover: 'From the first drawing to the finished room.',
      image: '/nav/services-card.jpg',
      video: '',
    },
    'architecture': {
      title: 'ARCHITECTURE',
      hover: 'The building, planned before it is built.',
      image: '/nav/services-card.jpg',
      video: '',
    },
    'interiors': {
      title: 'INTERIORS',
      hover: 'Rooms planned for daily use.',
      image: '/hero.jpg',
      video: '',
    },
    'commercial-interiors': {
      title: 'COMMERCIAL INTERIORS',
      hover: 'Interiors for guests and for staff.',
      image: '/nav/nav-backdrop.jpg',
      video: '',
    },
    '2d-3d-design': {
      title: '2D / 3D DESIGN',
      hover: 'Precise architectural blueprints and photorealistic 3D visualization.',
      image: '/nav/services-card.jpg',
      video: '',
    },
    'walkthrough': {
      title: 'WALKTHROUGH',
      hover: 'Cinematic 3D architectural walkthroughs and animated flythroughs.',
      image: '/hero.jpg',
      video: '',
    },
    'bim-engineering': {
      title: 'BIM ENGINEERING',
      hover: 'Drawings that agree with each other.',
      image: '/hero.jpg',
      video: '',
    },
    'design-supervision': {
      title: 'DESIGN SUPERVISION',
      hover: 'The site checked against the drawings.',
      image: '/nav/portfolio-card.jpg',
      video: '',
    },
    'construction-management': {
      title: 'CONSTRUCTION MANAGEMENT',
      hover: 'The build, kept to the agreed sequence.',
      image: '/nav/services-card.jpg',
      video: '',
    },
    'procurement': {
      title: 'PROCUREMENT',
      hover: 'Materials and furniture, ordered to the drawings.',
      image: '/hero.jpg',
      video: '',
    },
  },

  // Hero Banners & Texts for all 10 services
  heroes: {
    'all-services': {
      titleLead: 'All services',
      titleAccent: 'by Unique Graphics®',
      subtitle: 'From initial architectural sketches to final white-glove furnishing handover.',
      summary: 'Design, drawings, site checks, building, and the things that fill the rooms.',
      detail: 'One studio can hold the project from the sketch to the last delivery, so the drawings and the site stay in step.',
      banner1: '',
      banner2: '',
      banner3: '',
    },
    'architecture': {
      titleLead: 'Architecture',
      titleAccent: 'by Unique Graphics®',
      subtitle: 'Monumental modern villas, chalets, and private residences crafted around panoramic views.',
      summary: 'Plans and sections for the house, with the structure and the openings drawn together.',
      detail: 'We draw the house so ceiling heights, doors, and the stair agree before anyone is on site.',
      banner1: '',
      banner2: '',
      banner3: '',
    },
    'interiors': {
      titleLead: 'Interiors',
      titleAccent: 'by Unique Graphics®',
      subtitle: 'Haute couture residential interiors celebrating natural materials, layered lighting, and tactile warmth.',
      summary: 'Layouts, finishes, and light for the rooms people actually sit in.',
      detail: 'The plan shows where you sit, where you store, and where the light falls at night.',
      banner1: '',
      banner2: '',
      banner3: '',
    },
    'commercial-interiors': {
      titleLead: 'Commercial interiors',
      titleAccent: 'by Unique Graphics®',
      subtitle: 'Monumental hospitality, flagship retail, and executive business spaces that inspire admiration.',
      summary: 'Lounges, dining rooms, and work rooms with a service path kept out of sight.',
      detail: 'The room has to work on a busy evening and still feel calm. Service stays on its own side.',
      banner1: '',
      banner2: '',
      banner3: '',
    },
    '2d-3d-design': {
      titleLead: '2D / 3D design',
      titleAccent: 'by Unique Graphics®',
      subtitle: 'From 2D planning layouts and drafting to photorealistic 3D CGI architectural renderings.',
      summary: '2D technical floor plans, section details, and cinematic 3D visual renderings for exterior and interior spaces.',
      detail: 'Every project begins with precision 2D drafting before transitioning into ultra-realistic 3D CGI simulations, revealing exact natural light, spatial geometry, and textures before execution.',
      banner1: '',
      banner2: '',
      banner3: '',
    },
    'walkthrough': {
      titleLead: 'Walkthrough',
      titleAccent: 'by Unique Graphics®',
      subtitle: 'Cinematic 4K architectural video tours and dynamic flythrough animation for luxury estates.',
      summary: 'Ultra-HD cinematic video walkthroughs and immersive digital flythrough tours through future villas and estates.',
      detail: 'Experience the flow, volume, and atmosphere of your residence through cinematic camera movements, dynamic evening lighting, and realistic environmental reflections.',
      banner1: '',
      banner2: '',
      banner3: '',
    },
    'bim-engineering': {
      titleLead: 'BIM engineering',
      titleAccent: 'by Unique Graphics®',
      subtitle: 'High-precision computational modeling eliminating on-site conflicts before construction begins.',
      summary: 'Plans, sections, and services drawn in one model so clashes show up on paper.',
      detail: 'A duct and a beam should meet in the model, not on the ceiling during construction.',
      banner1: '',
      banner2: '',
      banner3: '',
    },
    'design-supervision': {
      titleLead: 'Design supervision',
      titleAccent: 'by Unique Graphics®',
      subtitle: 'Unyielding on-site author oversight ensuring 100% adherence to approved blueprints.',
      summary: 'Visits that compare the built work with the approved drawings.',
      detail: 'If a wall or a finish drifts from the drawing, it is caught while it can still be corrected.',
      banner1: '',
      banner2: '',
      banner3: '',
    },
    'construction-management': {
      titleLead: 'Construction management',
      titleAccent: 'by Unique Graphics®',
      subtitle: 'Comprehensive general coordination, sequence control, and budget stewardship.',
      summary: 'The order of work on site, with dates and the points you approve.',
      detail: 'The next trade starts when the last one is accepted. You see the date before it slips.',
      banner1: '',
      banner2: '',
      banner3: '',
    },
    'procurement': {
      titleLead: 'Procurement',
      titleAccent: 'by Unique Graphics®',
      subtitle: 'Direct worldwide sourcing of luxury European furniture, bespoke joinery, and fine finishes.',
      summary: 'Stone, timber, lights, and furniture bought to match the specification.',
      detail: 'What arrives should be what was drawn. Dates are set so the site is not waiting on a missing piece.',
      banner1: '',
      banner2: '',
      banner3: '',
    },
  },

  // 4 Stages for each service
  stages: {
    'all-services': [
      { num: '01', title: 'Consultation & Site Audit', desc: 'Detailed topographical analysis, regulatory checks, and architectural brief development.' },
      { num: '02', title: 'Concept & 3D Visualization', desc: 'Photorealistic CGI imagery, volume studies, and interior moodboards.' },
      { num: '03', title: 'BIM & Working Blueprints', desc: 'Complete coordinated engineering packages, MEP routes, and clash detection.' },
      { num: '04', title: 'Turnkey Handover & FF&E', desc: 'On-site execution, author supervision, and direct factory furnishing installation.' },
    ],
    'architecture': [
      { num: '01', title: 'Topography & Climate Analysis', desc: 'Sun orientation, terrain contours, and panoramic vista alignment for optimal energy and views.' },
      { num: '02', title: 'Volumetric Architectural Concept', desc: 'Sculptural massing, exterior materials palette, and spatial zoning for master and service quarters.' },
      { num: '03', title: 'Structural & Facade Engineering', desc: 'Full engineering drawings, cantilevered terraces, floor-to-ceiling panoramic glass walls, and roof systems.' },
      { num: '04', title: 'Builder Coordination', desc: 'Full construction packages and technical coordination with general engineering teams.' },
    ],
    'interiors': [
      { num: '01', title: 'Ergonomic Space Planning', desc: 'Optimal flow, private zoning, and spatial proportions tailored to your daily lifestyle.' },
      { num: '02', title: 'Photorealistic 3D Concept', desc: 'Detailed CGI renders illustrating marble selections, custom wood veneers, and bespoke brass accents.' },
      { num: '03', title: 'Technical Drawings Package', desc: 'Full architectural drawing sets for electrical switches, plumbing, tile layouts, and bespoke cabinetry.' },
      { num: '04', title: 'Final Styling & Dressing', desc: 'Curating art pieces, sculptural accessories, rugs, and custom window treatments for move-in perfection.' },
    ],
    'commercial-interiors': [
      { num: '01', title: 'Brand Identity & Flow Strategy', desc: 'Aligning architectural layout with guest psychology, guest zoning, and secluded service corridors.' },
      { num: '02', title: 'Hospitality Lighting & Acoustics', desc: 'Engineered acoustic ceiling treatments and scene-based evening lighting design.' },
      { num: '03', title: 'Commercial Grade FF&E', desc: 'High-traffic certified textiles, bespoke joinery, and durable marble surfaces meeting luxury hospitality standards.' },
      { num: '04', title: 'Opening Readiness & Handover', desc: 'Coordination with operations teams, kitchen consultants, and local municipal authorities.' },
    ],
    '2d-3d-design': [
      { num: '01', title: '2D Floor Plans & Elevations', desc: 'Drafting precise millimeter-accurate CAD floor plans, section cuts, and exterior facade elevations.' },
      { num: '02', title: '3D Geometry & Volumetric Modeling', desc: 'Constructing high-fidelity polygon geometry reflecting exact structural and architectural parameters.' },
      { num: '03', title: 'PBR Shaders & Custom Textures', desc: 'Applying physically based natural marbles, wood grains, metals, and glass reflections.' },
      { num: '04', title: '4K Photorealistic CGI Final Renders', desc: 'Multi-angle cinematic exterior and interior visual presentations with natural light simulations.' },
    ],
    'walkthrough': [
      { num: '01', title: 'Cinematic Camera Pathing', desc: 'Choreographing continuous fluid camera trajectories that guide the viewer through estate spaces.' },
      { num: '02', title: 'Dynamic Lighting & Atmosphere', desc: 'Simulating sun movement, golden hour transitions, and interior evening lighting ambiance.' },
      { num: '03', title: 'High-Fidelity Ray-Traced Animation', desc: 'Rendering ultra-smooth 60fps walkthrough footage with realistic glass refractions and nature.' },
      { num: '04', title: 'Post-Production & Sound Design Handover', desc: 'Professional color grading, atmospheric audio composition, and final 4K video delivery.' },
    ],
    'bim-engineering': [
      { num: '01', title: 'Model Federation & LOD 350-400', desc: 'Integrating structural, MEP, HVAC, and architectural frameworks into a unified Autodesk Revit model.' },
      { num: '02', title: 'Automated Clash Detection', desc: 'Navisworks algorithmic clash reports to resolve pipeline, duct, and beam collisions digitally.' },
      { num: '03', title: 'Bill of Quantities (BOQ)', desc: 'Parametric material takeoffs generating exact procurement schedules and volume estimates.' },
      { num: '04', title: 'Issue Sets & As-Built Model', desc: 'Detailed fabrication sheets for fabricators and digital twin handovers for building facilities.' },
    ],
    'design-supervision': [
      { num: '01', title: 'Weekly On-Site Audits', desc: 'Rigorous inspection visits by lead architects comparing constructed geometries with master drawings.' },
      { num: '02', title: 'Material Sample Sign-Offs', desc: 'Physical inspection and approval of marble slabs, natural woods, glass panes, and custom metals on-site.' },
      { num: '03', title: 'Contractor Defect Logs', desc: 'Immediate issue logs with photographic logs sent to general contractors for correction before next trades begin.' },
      { num: '04', title: 'As-Built Certification', desc: 'Final architectural sign-off and verification of completed spaces prior to client move-in.' },
    ],
    'construction-management': [
      { num: '01', title: 'Master Gantt Scheduling', desc: 'Sequenced timeline coordinating structural trades, MEP installers, and luxury finish craftsmen without delays.' },
      { num: '02', title: 'Subcontractor Tendering', desc: 'Rigorous vetting of licensed contractors, contract negotiations, and technical compliance enforcement.' },
      { num: '03', title: 'Staged Milestone Inspections', desc: 'Strict milestone sign-offs linked to quality audits before financial disbursements are authorized.' },
      { num: '04', title: 'Turnkey Commissioning', desc: 'Comprehensive testing of HVAC, smart home automation, security, and final architectural handover.' },
    ],
    'procurement': [
      { num: '01', title: 'Comprehensive FF&E Matrix', desc: 'Itemized specification lists covering every furniture item, custom chandelier, textile, and hardware piece.' },
      { num: '02', title: 'Direct Factory Contracting', desc: 'Purchasing directly from premium Italian, French, and German ateliers at preferred studio trade pricing.' },
      { num: '03', title: 'Quality Audits & Logistics', desc: 'Factory workshop inspections before crating, international customs clearance, and secure insured transit.' },
      { num: '04', title: 'White-Glove Installation', desc: 'On-site unpacking, assembly, styling, and placement under our interior designers’ supervision.' },
    ],
  },

  // Turnkey Integration Section (For /all-services page)
  turnkey: {
    title: 'Full Turnkey Integration Without Compromise',
    subtitle: 'We integrate architects, interior designers, BIM engineers, and global procurement specialists into one cohesive team, guaranteeing exact alignment between approved blueprints and physical handover.',
    pillars: [
      { num: '01', title: 'Full Turnkey Delivery', desc: 'A single studio stewards your estate from first hand-sketch to key handover, eliminating inter-contractor friction.' },
      { num: '02', title: 'BIM LOD 400 Precision', desc: 'Millimeter-exact clash detection ensures pipes, HVAC conduits, and structural beams fit invisibly inside architectural volumes.' },
      { num: '03', title: 'Fixed Milestone Budgets', desc: 'Transparent financial schedules and vetted supplier pricing protect your investment from unexpected budget overruns.' },
      { num: '04', title: 'European FF&E Sourcing', desc: 'Direct procurement agreements with Italy and France’s most prestigious ateliers ensure factory-direct authenticity.' },
    ],
  },

  // Consultation CTA Card
  cta: {
    title: 'Ready to initiate your luxury estate or commercial project?',
    subtitle: 'Contact our architectural directors to arrange a confidential consultation and comprehensive project feasibility audit.',
    buttonText: 'Discuss a project',
    buttonLink: '/contacts',
  },
}

const STORAGE_KEY = 'ug_services_pages_config'

export function getStoredServicesConfig() {
  if (typeof window === 'undefined') return DEFAULT_SERVICES_CONFIG
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SERVICES_CONFIG
    const parsed = JSON.parse(raw)
    return {
      ...DEFAULT_SERVICES_CONFIG,
      ...parsed,
      navCards: { ...DEFAULT_SERVICES_CONFIG.navCards, ...(parsed.navCards || {}) },
      heroes: { ...DEFAULT_SERVICES_CONFIG.heroes, ...(parsed.heroes || {}) },
      stages: { ...DEFAULT_SERVICES_CONFIG.stages, ...(parsed.stages || {}) },
      turnkey: {
        ...DEFAULT_SERVICES_CONFIG.turnkey,
        ...(parsed.turnkey || {}),
        pillars: Array.isArray(parsed.turnkey?.pillars) && parsed.turnkey.pillars.length > 0
          ? parsed.turnkey.pillars
          : DEFAULT_SERVICES_CONFIG.turnkey.pillars,
      },
      cta: { ...DEFAULT_SERVICES_CONFIG.cta, ...(parsed.cta || {}) },
    }
  } catch (e) {
    console.warn('[servicesConfig] Failed to parse local config:', e)
    return DEFAULT_SERVICES_CONFIG
  }
}

export function setStoredServicesConfig(config) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    window.dispatchEvent(new CustomEvent('services-pages-config-changed', { detail: config }))
  } catch (e) {
    console.error('[servicesConfig] Failed to persist:', e)
  }
}

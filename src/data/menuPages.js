const shots = {
  courtyard: { image: '/nav/portfolio-card.jpg', focus: 'center' },
  villa: { image: '/nav/services-card.jpg', focus: 'center' },
  living: { image: '/hero.jpg', focus: 'center' },
  room: { image: '/nav/nav-backdrop.jpg', focus: 'center' },
  villaRight: { image: '/nav/services-card.jpg', focus: '70% center' },
  livingLeft: { image: '/hero.jpg', focus: '30% center' },
}

export const menuPages = [
  {
    id: 'all-projects',
    group: 'portfolio',
    ...shots.courtyard,
    en: {
      category: 'Portfolio',
      title: 'All projects',
      hover: 'Houses and rooms from the full portfolio.',
      summary: 'The whole set, from private houses to the rooms inside them.',
      points: ['Houses', 'Interiors', 'Commercial rooms', 'Courts and gardens'],
      detail: 'Each project starts with how the place is used. The drawings follow that, not a repeated plan.',
    },
  },
  {
    id: 'architectural-design',
    group: 'portfolio',
    ...shots.villa,
    en: {
      category: 'Portfolio',
      title: 'Architectural design',
      hover: 'Plans, facades, and the shape of the house.',
      summary: 'The house as a building: site, floors, light, and the line of the facade.',
      points: ['Site and approach', 'Floor plans', 'Facade and roof', 'Stair and structure'],
      detail: 'Rooms face the garden or the court. Service rooms stay on the quieter side. Sections are agreed before building starts.',
    },
  },
  {
    id: 'interior-design',
    group: 'portfolio',
    ...shots.living,
    en: {
      category: 'Portfolio',
      title: 'Interior design',
      hover: 'Furniture, light, and the finish of each room.',
      summary: 'The rooms after the shell: seating, storage, light, and materials.',
      points: ['Furniture layout', 'Lighting', 'Joinery', 'Textiles and finishes'],
      detail: 'One room is planned at a time. The light is layered, and storage stays out of the way of the view.',
    },
  },
  {
    id: 'commercial-design',
    group: 'portfolio',
    ...shots.room,
    en: {
      category: 'Portfolio',
      title: 'Commercial design',
      hover: 'Guest rooms, lounges, and places of work.',
      summary: 'Rooms for guests and for work, with a clear path and a quiet service side.',
      points: ['Guest flow', 'Work rooms', 'Service path', 'Lighting for evening use'],
      detail: 'Guests should not cross the kitchen. Staff have their own door. The light can be lowered without one harsh switch.',
    },
  },
  {
    id: 'all-services',
    group: 'services',
    ...shots.villaRight,
    en: {
      category: 'Services',
      title: 'All services',
      hover: 'From the first drawing to the finished room.',
      summary: 'Design, drawings, site checks, building, and the things that fill the rooms.',
      points: ['Architecture', 'Interiors', 'Site supervision', 'Procurement'],
      detail: 'One studio can hold the project from the sketch to the last delivery, so the drawings and the site stay in step.',
    },
  },
  {
    id: 'architecture',
    group: 'services',
    ...shots.villa,
    en: {
      category: 'Services',
      title: 'Architecture',
      hover: 'The building, planned before it is built.',
      summary: 'Plans and sections for the house, with the structure and the openings drawn together.',
      points: ['Concept', 'Plans and sections', 'Facade', 'Coordination with the builder'],
      detail: 'We draw the house so ceiling heights, doors, and the stair agree before anyone is on site.',
    },
  },
  {
    id: 'interiors',
    group: 'services',
    ...shots.livingLeft,
    en: {
      category: 'Services',
      title: 'Interiors',
      hover: 'Rooms planned for daily use.',
      summary: 'Layouts, finishes, and light for the rooms people actually sit in.',
      points: ['Layout', 'Finishes', 'Lighting plan', 'Furniture'],
      detail: 'The plan shows where you sit, where you store, and where the light falls at night.',
    },
  },
  {
    id: 'commercial-interiors',
    group: 'services',
    ...shots.room,
    en: {
      category: 'Services',
      title: 'Commercial interiors',
      hover: 'Interiors for guests and for staff.',
      summary: 'Lounges, dining rooms, and work rooms with a service path kept out of sight.',
      points: ['Guest rooms', 'Workrooms', 'Acoustic finishes', 'Dimmable light'],
      detail: 'The room has to work on a busy evening and still feel calm. Service stays on its own side.',
    },
  },
  {
    id: 'bim-engineering',
    group: 'services',
    ...shots.living,
    en: {
      category: 'Services',
      title: 'BIM engineering',
      hover: 'Drawings that agree with each other.',
      summary: 'Plans, sections, and services drawn in one model so clashes show up on paper.',
      points: ['Coordinated model', 'Plans and sections', 'Services routes', 'Issue sets for the site'],
      detail: 'A duct and a beam should meet in the model, not on the ceiling during construction.',
    },
  },
  {
    id: 'design-supervision',
    group: 'services',
    ...shots.courtyard,
    en: {
      category: 'Services',
      title: 'Design supervision',
      hover: 'The site checked against the drawings.',
      summary: 'Visits that compare the built work with the approved drawings.',
      points: ['Site visits', 'Checks against drawings', 'Notes for the builder', 'Samples and finishes'],
      detail: 'If a wall or a finish drifts from the drawing, it is caught while it can still be corrected.',
    },
  },
  {
    id: 'construction-management',
    group: 'services',
    ...shots.villaRight,
    en: {
      category: 'Services',
      title: 'Construction management',
      hover: 'The build, kept to the agreed sequence.',
      summary: 'The order of work on site, with dates and the points you approve.',
      points: ['Sequence of works', 'Dates', 'Approvals', 'Reports from site'],
      detail: 'The next trade starts when the last one is accepted. You see the date before it slips.',
    },
  },
  {
    id: 'procurement',
    group: 'services',
    ...shots.livingLeft,
    en: {
      category: 'Services',
      title: 'Procurement',
      hover: 'Materials and furniture, ordered to the drawings.',
      summary: 'Stone, timber, lights, and furniture bought to match the specification.',
      points: ['Specification', 'Orders', 'Delivery dates', 'Check on arrival'],
      detail: 'What arrives should be what was drawn. Dates are set so the site is not waiting on a missing piece.',
    },
  },
  {
    id: '2d-3d-design',
    group: 'services',
    ...shots.villa,
    en: {
      category: 'Services',
      title: '2D / 3D design',
      hover: 'Precise architectural blueprints and photorealistic 3D visualization.',
      summary: '2D technical floor plans, section details, and cinematic 3D visual renderings for exterior and interior spaces.',
      points: ['2D Floor plans & elevations', 'Photorealistic 3D CGI renders', 'Lighting & texture studies', 'Material moodboards & finishes'],
      detail: 'Every project begins with precision 2D drafting before transitioning into ultra-realistic 3D CGI simulations, revealing exact natural light, spatial geometry, and textures before execution.',
    },
  },
  {
    id: 'walkthrough',
    group: 'services',
    ...shots.living,
    en: {
      category: 'Services',
      title: 'Walkthrough',
      hover: 'Cinematic 3D architectural walkthroughs and animated flythroughs.',
      summary: 'Ultra-HD cinematic video walkthroughs and immersive digital flythrough tours through future villas and estates.',
      points: ['4K Cinematic camera flythroughs', 'Interior & exterior tours', 'Day-to-night lighting transitions', 'Virtual reality (VR) ready models'],
      detail: 'Experience the flow, volume, and atmosphere of your residence through cinematic camera movements, dynamic evening lighting, and realistic environmental reflections.',
    },
  },
]

const byId = new Map(menuPages.map((page) => [page.id, page]))

export function findMenuPage(id) {
  return byId.get(id) ?? null
}

export function isMenuPage(id) {
  return byId.has(id)
}

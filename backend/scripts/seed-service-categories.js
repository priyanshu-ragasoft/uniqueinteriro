import { connectDB } from '../config/db.js'
import Setting from '../models/Setting.js'
import mongoose from 'mongoose'

const MEDIA = {
  'all-services': '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg',
  architecture: '/website-assets/architecture/AUTOMOTIVE%20GALLERY/9ea0e852-0904-49c5-b948-f8504d0ea7fb.png',
  interiors: '/website-assets/INTERIOR/INTERIOR%20MODERN/LIVING%20ROOM/A1.jpg',
  'for-business': '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/2a52ad1e-4050-4783-b269-36dcd2bb72b0.png',
  'bim-engineering': '/website-assets/architecture/The%20Romania%20-%20Luxury%20Wedding%20Spaces%20BANQUET%20HALL/Golden%20Arch%20Banquet%20Hall%20at%20Night-6.png',
  'design-supervision': '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg',
  'construction-management': '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/2a52ad1e-4050-4783-b269-36dcd2bb72b0.png',
  procurement: '/website-assets/INTERIOR/MODERN%20KITCHEN/a1.jpg',
  villas: '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png',
  'private-houses': '/website-assets/architecture/contemporary%20exterior%20house%20design/c6d60406-e39c-4e68-9abc-9df4e692ace2.png',
  residences: '/website-assets/INTERIOR/INTERIOR%20MODERN/LIVING%20ROOM/A2.jpg',
  cottages: '/website-assets/INTERIOR/CLASSIC%20LUXURY%20LIVING/Contemporary%20neoclassical%20ivory%20and%20sage%20interior-7.png',
  mansions: '/website-assets/architecture/NEO%20CLASSIC%20EXTERIOR%20DESIGN%20BIJNOR/Blue-hour%20classical%20villa%20with%20glowing%20pool-15.png',
  penthouses: '/website-assets/architecture/AL%20REHMAN%20TOWER%20KOLKATA/7e4f4312-846d-4e35-9f2b-af632b7dfc0a.png',
  apartments: '/website-assets/INTERIOR/MODERN%20KITCHEN/a1.jpg',
  hotels: '/website-assets/commercial%20interior/Hotel%20Mangalore%20International/v4.jpg',
  restaurants: '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/2a52ad1e-4050-4783-b269-36dcd2bb72b0.png',
  resorts: '/website-assets/architecture/SOUTH%20GOA%20RESORTS%20EXTERIOR/243e4630-d2b6-4e95-931a-03302219585b.png',
  offices: '/website-assets/commercial%20interior/REAL%20ESTATE%20OFFICE%20CHANDIGARH/v6.jpg',
  'spa-and-wellness': '/website-assets/commercial%20interior/SOUTH%20GOA%20RESORTS%20AND%20RESTAURANT/BEDROOM%20POOL%2002.jpg',
  'common-areas': '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg',
  bars: '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/5bc6357d-ec0e-4160-84da-758f3ed7101c.png',
}

const HIDDEN_MENU_SLUGS = new Set(['astro-vastu', '2d-3d-design', 'walkthrough'])
const HIDDEN_SUB_SLUGS = new Set(['banquet-halls', 'retail-showrooms', 'bars-and-night-clubs'])

const MENU = [
  {
    id: 'all-services',
    name: 'All services',
    hover: 'From the first drawing to the finished room.',
    title: 'All services',
    subtitle: 'From initial architectural sketches to final white-glove furnishing handover.',
    heading: 'Full Turnkey Integration Without Compromise',
    detail: 'One studio can hold the project from the sketch to the last delivery, so the drawings and the site stay in step.',
    steps: [
      ['Consultation & Site Audit', 'Detailed topographical analysis, regulatory checks, and architectural brief development.'],
      ['Concept & 3D Visualization', 'Photorealistic CGI imagery, volume studies, and interior moodboards.'],
      ['BIM & Working Blueprints', 'Complete coordinated engineering packages, MEP routes, and clash detection.'],
      ['Turnkey Handover & FF&E', 'On-site execution, author supervision, and direct factory furnishing installation.'],
    ],
  },
  {
    id: 'architecture',
    name: 'Architecture',
    hover: 'The building, planned before it is built.',
    title: 'Architecture',
    subtitle: 'Monumental modern villas, chalets, and private residences crafted around panoramic views.',
    heading: 'Plans and sections for the house, with structure and openings drawn together.',
    detail: 'We draw the house so ceiling heights, doors, and the stair agree before anyone is on site.',
    steps: [
      ['Topography & Climate Analysis', 'Sun orientation, terrain contours, and panoramic vista alignment.'],
      ['Volumetric Architectural Concept', 'Sculptural massing, exterior materials, and spatial zoning.'],
      ['Structural & Facade Engineering', 'Full engineering drawings, cantilevers, glass walls, and roof systems.'],
      ['Builder Coordination', 'Construction packages and technical coordination with engineering teams.'],
    ],
  },
  {
    id: 'interiors',
    name: 'Interiors',
    hover: 'Rooms planned for daily use.',
    title: 'Interiors',
    subtitle: 'Haute couture residential interiors celebrating natural materials, layered lighting, and tactile warmth.',
    heading: 'Layouts, finishes, and light for the rooms people actually live in.',
    detail: 'The plan shows where you sit, where you store, and where the light falls at night.',
    steps: [
      ['Ergonomic Space Planning', 'Optimal flow, private zoning, and spatial proportions.'],
      ['Photorealistic 3D Concept', 'CGI renders of marble, wood veneers, and brass accents.'],
      ['Technical Drawings Package', 'Electrical, plumbing, tile, and cabinetry drawing sets.'],
      ['Final Styling & Dressing', 'Art, rugs, and window treatments for move-in.'],
    ],
    subs: [
      ['villas', 'Villas', 'Palatial private estates with neoclassical atriums and Italian marble.'],
      ['private-houses', 'Private houses', 'Contemporary houses in stone, timber, and heated glass.'],
      ['residences', 'Residences', 'Bespoke living rooms, marble, and tactile walnut joinery.'],
      ['cottages', 'Cottages', 'Intimate cottages and row houses with garden terraces.'],
      ['mansions', 'Mansions', 'Monumental mansions, colonnades, and palatial estates.'],
      ['penthouses', 'Penthouses', 'High-rise residences with glass horizons and sky decks.'],
      ['apartments', 'Apartments', 'Precision planning, appliance walls, and artisanal kitchens.'],
    ],
  },
  {
    id: 'for-business',
    name: 'For business',
    hover: 'Interiors for guests and for staff.',
    title: 'For business',
    subtitle: 'Monumental hospitality, flagship retail, and executive business spaces.',
    heading: 'Lounges, dining rooms, and work rooms with service kept out of sight.',
    detail: 'The room has to work on a busy evening and still feel calm.',
    steps: [
      ['Brand Identity & Flow Strategy', 'Guest zoning and secluded service corridors.'],
      ['Hospitality Lighting & Acoustics', 'Scene lighting and acoustic ceiling treatments.'],
      ['Commercial Grade FF&E', 'High-traffic textiles, joinery, and marble surfaces.'],
      ['Opening Readiness & Handover', 'Operations, kitchen consultants, and municipal sign-off.'],
    ],
    subs: [
      ['hotels', 'Hotels', '5-star boutique hotels and luxury guest-room architecture.'],
      ['restaurants', 'Restaurants', 'Fine dining rooms with choreographed guest flow.'],
      ['resorts', 'Resorts', 'Destination hospitality escapes for rest and grandeur.'],
      ['offices', 'Offices', 'Headquarters and high-performance executive suites.'],
      ['spa-and-wellness', 'Spa & Wellness', 'Hydrotherapy sanctuaries in marble and natural light.'],
      ['common-areas', 'Common areas', 'Lobbies, atriums, and curated arrival gateways.'],
      ['bars', 'Bars', 'Nightlife lounges, scene lighting, and cocktail bars.'],
    ],
  },
  {
    id: 'bim-engineering',
    name: 'Bim engineering',
    hover: 'Drawings that agree with each other.',
    title: 'Bim engineering',
    subtitle: 'High-precision computational modeling eliminating on-site conflicts before construction begins.',
    heading: 'Plans, sections, and services drawn in one model so clashes show up on paper.',
    detail: 'A duct and a beam should meet in the model, not on the ceiling during construction.',
    steps: [
      ['Model Federation & LOD 350-400', 'Structural, MEP, HVAC, and architecture in one Revit model.'],
      ['Automated Clash Detection', 'Navisworks reports resolve pipeline, duct, and beam collisions digitally.'],
      ['Bill of Quantities (BOQ)', 'Parametric takeoffs for procurement schedules and volumes.'],
      ['Issue Sets & As-Built Model', 'Fabrication sheets and digital twin handover.'],
    ],
  },
  {
    id: 'design-supervision',
    name: 'Design supervision',
    hover: 'The site checked against the drawings.',
    title: 'Design supervision',
    subtitle: 'Unyielding on-site author oversight ensuring 100% adherence to approved blueprints.',
    heading: 'Visits that compare the built work with the approved drawings.',
    detail: 'If a wall or a finish drifts from the drawing, it is caught while it can still be corrected.',
    steps: [
      ['Weekly On-Site Audits', 'Lead architects compare constructed geometry with master drawings.'],
      ['Material Sample Sign-Offs', 'Marble, woods, glass, and metals approved on site.'],
      ['Contractor Defect Logs', 'Photographic issue logs before the next trade starts.'],
      ['As-Built Certification', 'Final architectural sign-off before move-in.'],
    ],
  },
  {
    id: 'construction-management',
    name: 'Construction management',
    hover: 'The build, kept to the agreed sequence.',
    title: 'Construction management',
    subtitle: 'Comprehensive general coordination, sequence control, and budget stewardship.',
    heading: 'The order of work on site, with dates and the points you approve.',
    detail: 'The next trade starts when the last one is accepted. You see the date before it slips.',
    steps: [
      ['Master Gantt Scheduling', 'Structural, MEP, and finish trades sequenced without delay.'],
      ['Subcontractor Tendering', 'Vetted contractors and technical compliance.'],
      ['Staged Milestone Inspections', 'Quality audits before financial disbursements.'],
      ['Turnkey Commissioning', 'HVAC, automation, security, and architectural handover.'],
    ],
  },
  {
    id: 'procurement',
    name: 'Procurement',
    hover: 'Materials and furniture, ordered to the drawings.',
    title: 'Procurement',
    subtitle: 'Direct worldwide sourcing of luxury European furniture, bespoke joinery, and fine finishes.',
    heading: 'Stone, timber, lights, and furniture bought to match the specification.',
    detail: 'What arrives should be what was drawn. Dates are set so the site is not waiting on a missing piece.',
    steps: [
      ['Comprehensive FF&E Matrix', 'Every furniture item, chandelier, textile, and hardware piece listed.'],
      ['Direct Factory Contracting', 'Italian, French, and German ateliers at studio trade pricing.'],
      ['Quality Audits & Logistics', 'Workshop inspections, customs, and insured transit.'],
      ['White-Glove Installation', 'Unpacking, assembly, and placement under studio supervision.'],
    ],
  },
]

function emptyPage(partial = {}) {
  return {
    banner: {
      show: true,
      label: 'Services',
      title: '',
      accent: 'by Unique Graphics®',
      subtitle: '',
      images: ['', '', ''],
      ...(partial.banner || {}),
    },
    intro: {
      show: true,
      heading: '',
      paragraph1: '',
      paragraph2: '',
      ...(partial.intro || {}),
    },
    highlights: { show: false, items: [], ...(partial.highlights || {}) },
    steps: { show: false, items: [], ...(partial.steps || {}) },
    gallery: { show: false, items: [], ...(partial.gallery || {}) },
    closing: {
      show: true,
      heading: '',
      paragraph: '',
      buttonLabel: 'Discuss a project',
      buttonLink: '/contacts',
      ...(partial.closing || {}),
    },
  }
}

function pageFromSpec(spec, slug) {
  const image = MEDIA[slug] || MEDIA['all-services']
  const steps = (spec.steps || []).map((step, index) => ({
    id: `${slug}-step-${index + 1}`,
    number: String(index + 1).padStart(2, '0'),
    title: step[0],
    text: step[1],
  }))
  return emptyPage({
    banner: {
      show: true,
      label: 'Services',
      title: spec.title || spec.name,
      accent: 'by Unique Graphics®',
      subtitle: spec.subtitle || spec.hover || '',
      images: [image, image, image],
    },
    intro: {
      show: true,
      heading: spec.heading || spec.title || spec.name,
      paragraph1: spec.detail || spec.hover || '',
      paragraph2: '',
    },
    steps: { show: steps.length > 0, items: steps },
    closing: {
      show: true,
      heading: `Discuss ${spec.name}.`,
      paragraph: spec.hover || spec.detail || '',
      buttonLabel: 'Discuss a project',
      buttonLink: '/contacts',
    },
  })
}

function hasPage(node) {
  const page = node?.page
  if (!page || typeof page !== 'object') return false
  return Boolean(page.banner?.title || page.intro?.heading || page.intro?.paragraph1)
}

function desiredSub(parentSlug, [slug, name, hover], order) {
  return {
    id: slug,
    name,
    slug,
    menuDescription: hover,
    menuImage: MEDIA[slug] || MEDIA[parentSlug],
    published: true,
    showInMenu: true,
    order,
    page: pageFromSpec({ name, title: name, subtitle: hover, hover, heading: name, detail: hover }, slug),
    projects: [],
  }
}

function desiredCategory(spec, order) {
  return {
    id: spec.id,
    name: spec.name,
    slug: spec.id,
    menuDescription: spec.hover,
    menuImage: MEDIA[spec.id],
    published: true,
    showInMenu: true,
    order,
    page: pageFromSpec(spec, spec.id),
    projects: [],
    subcategories: (spec.subs || []).map((sub, index) => desiredSub(spec.id, sub, index)),
  }
}

function mergeNode(existing, incoming) {
  if (!existing) return incoming
  return {
    ...incoming,
    ...existing,
    id: existing.id || incoming.id,
    name: incoming.name || existing.name,
    slug: incoming.slug || existing.slug,
    menuDescription: existing.menuDescription || incoming.menuDescription,
    menuImage: existing.menuImage || incoming.menuImage,
    menuVideo: existing.menuVideo || incoming.menuVideo || '',
    published: incoming.published,
    showInMenu: incoming.showInMenu,
    order: incoming.order,
    page: hasPage(existing) ? existing.page : incoming.page,
    projects: Array.isArray(existing.projects) ? existing.projects : incoming.projects || [],
    subcategories: incoming.subcategories,
  }
}

function mergeSubs(existingSubs = [], desiredSubs = []) {
  const bySlug = new Map((existingSubs || []).map((sub) => [sub.slug || sub.id, sub]))
  const used = new Set()
  const next = desiredSubs.map((desired) => {
    const existing = bySlug.get(desired.slug)
    used.add(desired.slug)
    return mergeNode(existing, desired)
  })
  for (const extra of existingSubs) {
    const slug = extra.slug || extra.id
    if (used.has(slug)) continue
    next.push({
      ...extra,
      published: HIDDEN_SUB_SLUGS.has(slug) ? false : extra.published !== false,
      showInMenu: false,
      order: next.length,
    })
  }
  return next
}

async function run() {
  await connectDB()
  const setting = await Setting.findOne({ key: 'services_pages_config' })
  const value = JSON.parse(JSON.stringify(setting?.value || {}))
  const existing = Array.isArray(value.categories) ? value.categories : []
  const bySlug = new Map(existing.map((item) => [item.slug || item.id, item]))
  const used = new Set()

  const categories = MENU.map((spec, order) => {
    const incoming = desiredCategory(spec, order)
    const current = bySlug.get(spec.id)
    used.add(spec.id)
    if (!current) return incoming
    return mergeNode(current, {
      ...incoming,
      subcategories: mergeSubs(current.subcategories, incoming.subcategories),
    })
  })

  for (const extra of existing) {
    const slug = extra.slug || extra.id
    if (used.has(slug)) continue
    categories.push({
      ...extra,
      published: extra.published !== false,
      showInMenu: HIDDEN_MENU_SLUGS.has(slug) ? false : extra.showInMenu !== false,
      order: categories.length,
      subcategories: (extra.subcategories || []).map((sub, index) => ({
        ...sub,
        published: HIDDEN_SUB_SLUGS.has(sub.slug) ? false : sub.published !== false,
        showInMenu: HIDDEN_SUB_SLUGS.has(sub.slug) ? false : sub.showInMenu !== false,
        order: Number.isFinite(sub.order) ? sub.order : index,
      })),
    })
  }

  const saved = await Setting.findOneAndUpdate(
    { key: 'services_pages_config' },
    { value: { ...value, categories } },
    { upsert: true, new: true }
  )

  const menu = (saved?.value?.categories || [])
    .filter((item) => item.published !== false && item.showInMenu !== false)
    .sort((a, b) => a.order - b.order)
    .map((item) => {
      const subs = (item.subcategories || [])
        .filter((sub) => sub.published !== false && sub.showInMenu !== false)
        .sort((a, b) => a.order - b.order)
        .map((sub) => sub.name)
      return subs.length ? `${item.name} [${subs.join(', ')}]` : item.name
    })

  console.log(`[seed-service-categories] Saved ${categories.length} services. Live menu: ${menu.join(' | ')}`)
  await mongoose.disconnect()
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})

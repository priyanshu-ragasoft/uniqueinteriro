import {
  DEFAULT_PORTFOLIO_CONFIG,
  getProjectsForCategory as getLegacyProjects,
  getStoredPortfolioConfig,
  resolveProjectListKey,
  setStoredPortfolioConfig,
} from './portfolioConfig'
import { emptyPage, isJunkText, slugify, validateServiceTree } from './serviceTree'

export function buildDefaultPortfolioTree() {
  const cards = DEFAULT_PORTFOLIO_CONFIG.navCards

  const allProjectsPage = emptyPage({
    banner: {
      show: true,
      label: 'ATELIER PORTFOLIO',
      title: 'All Projects & Masterpieces',
      accent: 'by Unique Graphics®',
      subtitle: 'The complete archive of bespoke architectural villas, signature residences, and landmark commercial destinations crafted worldwide.',
      images: [
        '/website-assets/commercial%20interior/RYDHUM%20HOTEL%20&%20BANQUET%20HALL%20FIROZEPURE%20PUNJAB/RYDHUM%20HOTEL.mp4',
        '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/PUSHPA%20THE%20FIRE.mp4',
        '/website-assets/architecture/SMART%20CITY%20SOCITY%20BANUR/WhatsApp%20Video%202025-07-03%20at%2019.14.48.mp4',
      ],
    },
    intro: {
      show: true,
      heading: 'Architectural excellence and bespoke interior luxury engineered to transcend generations.',
      paragraph1: 'Unique Graphics® delivers an integrated design and construction paradigm where spatial emotion, structural mastery, and material elegance converge into living art.',
      paragraph2: 'From monumental banquet halls and luxury high-energy nightclubs to private neoclassical residences, every commission is tailored around singular lifestyle scenarios.',
    },
    highlights: {
      show: true,
      items: [
        {
          id: 'all-hl-1',
          title: 'Curated Material Mastery',
          text: 'Handpicked Italian Statuario marbles, brushed champagne brass, and acoustically decoupled joinery.',
          image: '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png',
        },
        {
          id: 'all-hl-2',
          title: 'Precision BIM LOD 400 Engineering',
          text: 'Clash-free MEP integration, parametric structural modeling, and intelligent circadian lighting matrices.',
          image: '/website-assets/architecture/The%20Romania%20-%20Luxury%20Wedding%20Spaces%20BANQUET%20HALL/Sunlit%20Luxury%20Banquet%20Hall-1.png',
        },
        {
          id: 'all-hl-3',
          title: 'Complete Turnkey Realization',
          text: 'Direct factory procurement, meticulous craftsmanship supervision, and guaranteed milestone delivery.',
          image: '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/2a52ad1e-4050-4783-b269-36dcd2bb72b0.png',
        },
      ],
    },
    steps: {
      show: true,
      items: [
        {
          id: 'all-step-1',
          number: '01',
          title: 'Architectural Vision & Spatial Narrative',
          text: 'Translating client lifestyle aspirations into bespoke structural schematics, sightline studies, and mood boards.',
        },
        {
          id: 'all-step-2',
          number: '02',
          title: 'Photorealistic 3D Cinematics & VR Walkthrough',
          text: 'Experiencing each room, facade, and lighting scene in photorealistic real-time detail prior to ground break.',
        },
        {
          id: 'all-step-3',
          number: '03',
          title: 'Global Procurement & Fine Craftsmanship',
          text: 'Direct sourcing of rare natural stones, exotic timbers, and European luminaires with strict quality control.',
        },
        {
          id: 'all-step-4',
          number: '04',
          title: 'White-Glove Commissioning & Turnkey Handover',
          text: 'Acoustic tuning, scene programming, and flawless white-glove site delivery ready for immediate occupancy.',
        },
      ],
    },
    gallery: {
      show: true,
      items: [
        {
          id: 'all-gal-1',
          image: '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/129a7d57-c895-4ecc-a079-cbc6aa3c7308.png',
          caption: 'Pushpa Fire Dance Bar - Grand Lounge & VIP Stage',
        },
        {
          id: 'all-gal-2',
          image: '/website-assets/architecture/AL%20REHMAN%20TOWER%20KOLKATA/7e4f4312-846d-4e35-9f2b-af632b7dfc0a.png',
          caption: 'Al Rehman Commercial Tower - Glass Facade & Atrium',
        },
        {
          id: 'all-gal-3',
          image: '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png',
          caption: 'Neoclassical Private Villa - Grand Double-Height Salon',
        },
        {
          id: 'all-gal-4',
          image: '/website-assets/architecture/The%20Romania%20-%20Luxury%20Wedding%20Spaces%20BANQUET%20HALL/Sunlit%20Luxury%20Banquet%20Hall-1.png',
          caption: 'The Romania Luxury Banquet Hall - Sunlit Palace Architecture',
        },
      ],
    },
    closing: {
      show: true,
      heading: 'Ready to bring your architectural vision into reality?',
      paragraph: 'Consult directly with our principal architects and luxury interior directors to initiate your custom commission.',
      buttonLabel: 'Request Private Consultation',
      buttonLink: '/contacts',
    },
  })

  const archPage = emptyPage({
    banner: {
      show: true,
      label: 'ARCHITECTURAL MASTERWORKS',
      title: 'Landmark Architecture & Estates',
      accent: 'by Unique Graphics®',
      subtitle: 'Monumental architectural forms created in harmony with natural landscapes — private villas, cliffside residences, and modern estates engineered to transcend generations.',
      images: [
        '/website-assets/commercial%20interior/RYDHUM%20HOTEL%20&%20BANQUET%20HALL%20FIROZEPURE%20PUNJAB/RYDHUM%20HOTEL.mp4',
        '/website-assets/architecture/SMART%20CITY%20SOCITY%20BANUR/WhatsApp%20Video%202025-07-03%20at%2019.14.48.mp4',
        '/website-assets/commercial%20interior/VECTERRACE%20HOTEL%20DANCE%20BAR%20KOLKATA/VICTERRACE%20KOLKATA.mp4',
      ],
    },
    intro: {
      show: true,
      heading: 'Sculptural facades, climatic intelligence, and harmonious structural engineering.',
      paragraph1: 'Our architectural philosophy merges sculptural geometry with structural integrity. We design residences and commercial landmarks that frame surrounding panoramas, optimize passive solar comfort, and evoke timeless grandeur.',
      paragraph2: 'Every elevation, cantilever, and entry portal is crafted using advanced structural BIM modeling and resilient premium stone cladding.',
    },
    highlights: {
      show: true,
      items: [
        {
          id: 'arch-hl-1',
          title: 'Bespoke Facade Engineering',
          text: 'Double-curved curtain walls, thermal-break aluminium extrusions, and stone masonry.',
          image: '/website-assets/architecture/AL%20REHMAN%20TOWER%20KOLKATA/7e4f4312-846d-4e35-9f2b-af632b7dfc0a.png',
        },
        {
          id: 'arch-hl-2',
          title: 'Landscape Integration & Water Pavilions',
          text: 'Infinity lap pools, sunken reflection courtyards, and seamless indoor-outdoor transitions.',
          image: '/website-assets/architecture/SOUTH%20GOA%20RESORTS%20EXTERIOR/243e4630-d2b6-4e95-931a-03302219585b.png',
        },
        {
          id: 'arch-hl-3',
          title: 'Vastu & Micro-Climate Planning',
          text: 'Harmonizing planetary directional axes, cross-ventilation breezes, and natural daylight penetration.',
          image: '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg',
        },
      ],
    },
    steps: {
      show: true,
      items: [
        {
          id: 'arch-step-1',
          number: '01',
          title: 'Topographical & Solar Analysis',
          text: 'Conducting 3D drone mapping, solar angle studies, and municipal zoning audits.',
        },
        {
          id: 'arch-step-2',
          number: '02',
          title: 'Conceptual Massing & Facade Styling',
          text: 'Iterating bold architectural volumes and choosing natural stone and timber cladding palettes.',
        },
        {
          id: 'arch-step-3',
          number: '03',
          title: 'Detailed Engineering & BIM Coordination',
          text: 'Producing LOD 400 structural steel and reinforced concrete working drawings.',
        },
        {
          id: 'arch-step-4',
          number: '04',
          title: 'On-Site Architectural Supervision',
          text: 'Rigorous quality inspections during foundation, structural pouring, and envelope installation.',
        },
      ],
    },
    gallery: {
      show: true,
      items: [
        {
          id: 'arch-gal-1',
          image: '/website-assets/architecture/AUTOMOTIVE%20GALLERY/9ea0e852-0904-49c5-b948-f8504d0ea7fb.png',
          caption: 'Automotive Luxury Gallery - Minimalist Steel & Glass Showcase',
        },
        {
          id: 'arch-gal-2',
          image: '/website-assets/architecture/NEO%20CLASSIC%20EXTERIOR%20DESIGN%20BIJNOR/Sunlit%20Classical%20Villa%20with%20Palm%20Gardens-11.png',
          caption: 'Neoclassical Classical Villa - Symmetrical Facade & Palm Gardens',
        },
        {
          id: 'arch-gal-3',
          image: '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg',
          caption: 'Greenwood Avenue Luxury Residences - Contemporary Street Elevation',
        },
        {
          id: 'arch-gal-4',
          image: '/website-assets/architecture/contemporary%20exterior%20house%20design%20NOORPUR%20BIJNOR/14f096b3-4749-4d63-ab89-19a59d193f77.png',
          caption: 'Contemporary Private Villa Noorpur - Cantilevered Terraces',
        },
      ],
    },
    closing: {
      show: true,
      heading: 'Commission an architectural statement piece.',
      paragraph: 'Schedule an exploratory conversation to review site blueprints, feasibility, and design direction.',
      buttonLabel: 'Discuss Architecture Project',
      buttonLink: '/contacts',
    },
  })

  const interiorPage = emptyPage({
    banner: {
      show: true,
      label: 'BESPOKE INTERIORS',
      title: 'Haute Couture Interior Design',
      accent: 'by Unique Graphics®',
      subtitle: 'Every interior is an emotional sanctuary designed around personal luxury — bespoke joinery, rare marbles, museum-grade architectural lighting, and curated furniture ensembles crafted without compromise.',
      images: [
        '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png',
        '/website-assets/INTERIOR/INTERIOR%20MODERN/LIVING%20ROOM/A1.jpg',
        '/website-assets/INTERIOR/CLASSIC%20LUXURY%20LIVING/Contemporary%20neoclassical%20ivory%20and%20sage%20interior-7.png',
      ],
    },
    intro: {
      show: true,
      heading: 'Sensory spaces where tactile elegance meets everyday serenity.',
      paragraph1: 'We sculpt living environments that awaken the senses. From dramatic double-height reception salons to intimate master dressing suites, each zone is orchestrated with bespoke wall paneling, indirect lighting temperatures, and hand-selected natural materials.',
      paragraph2: 'Our interior architects ensure custom cabinetry, concealed air distribution, and automated shades align in perfect harmony with the architecture.',
    },
    highlights: {
      show: true,
      items: [
        {
          id: 'int-hl-1',
          title: 'Bookmatched Natural Stone Art',
          text: 'Calacatta Viola, Black Marquina, and backlit Italian onyx slabs installed with vein-continuous alignment.',
          image: '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png',
        },
        {
          id: 'int-hl-2',
          title: 'Bespoke Italian Millwork',
          text: 'Concealed flush-to-wall magnetic doors, fluted walnut paneling, and suede-lined custom wardrobe suites.',
          image: '/website-assets/INTERIOR/INTERIOR%20MODERN/LIVING%20ROOM/A1.jpg',
        },
        {
          id: 'int-hl-3',
          title: 'Circadian Smart Lighting Design',
          text: 'Layered warm cove illumination, glare-free architectural downlights, and programmable mood keypads.',
          image: '/website-assets/INTERIOR/MODERN%20KITCHEN/a1.jpg',
        },
      ],
    },
    steps: {
      show: true,
      items: [
        {
          id: 'int-step-1',
          number: '01',
          title: 'Lifestyle Scenario Profiling',
          text: 'Understanding family daily habits, entertaining needs, and personal tactile preferences.',
        },
        {
          id: 'int-step-2',
          number: '02',
          title: 'Material Mood Boards & Finish Palettes',
          text: 'Curating physical samples of leathers, bouclé fabrics, patinated metals, and natural stones.',
        },
        {
          id: 'int-step-3',
          number: '03',
          title: '3D Millwork & Lighting Schematics',
          text: 'Drafting millimeter-precise joinery shop drawings and reflected ceiling lighting plans.',
        },
        {
          id: 'int-step-4',
          number: '04',
          title: 'White-Glove Styling & Turnkey Installation',
          text: 'Managing delivery, custom furniture placement, art hanging, and scent curation.',
        },
      ],
    },
    gallery: {
      show: true,
      items: [
        {
          id: 'int-gal-1',
          image: '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png',
          caption: 'Neoclassical Villa - Marble Fireplace & Fluted Wainscoting',
        },
        {
          id: 'int-gal-2',
          image: '/website-assets/INTERIOR/INTERIOR%20MODERN/LIVING%20ROOM/A1.jpg',
          caption: 'Modern Minimalist Living Room - Low-Slung Custom Seating',
        },
        {
          id: 'int-gal-3',
          image: '/website-assets/INTERIOR/MODERN%20KITCHEN/a1.jpg',
          caption: 'Sculptural Kitchen Island - Monolithic Quartz & Concealed Storage',
        },
        {
          id: 'int-gal-4',
          image: '/website-assets/INTERIOR/CLASSIC%20LUXURY%20LIVING/Contemporary%20neoclassical%20ivory%20and%20sage%20interior-7.png',
          caption: 'Contemporary Neoclassical Salon - Ivory & Champagne Gold Accents',
        },
      ],
    },
    closing: {
      show: true,
      heading: 'Elevate your private living sanctuary.',
      paragraph: 'Connect with our lead interior designers to discuss your residence, penthouse, or villa interior.',
      buttonLabel: 'Book Interior Consultation',
      buttonLink: '/contacts',
    },
  })

  const commercialPage = emptyPage({
    banner: {
      show: true,
      label: 'COMMERCIAL & HOSPITALITY',
      title: 'Commercial Destinations & Nightlife',
      accent: 'by Unique Graphics®',
      subtitle: 'Atmospheric nightclubs, landmark banquet halls, destination resorts, and flagship corporate headquarters engineered to captivate guests and drive business excellence.',
      images: [
        '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/TETTRO%20MOHALI.mp4',
        '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/PUSHPA%20THE%20FIRE.mp4',
        '/website-assets/commercial%20interior/RYDHUM%20HOTEL%20&%20BANQUET%20HALL%20FIROZEPURE%20PUNJAB/RYDHUM%20HOTEL.mp4',
      ],
    },
    intro: {
      show: true,
      heading: 'Commercial spaces engineered for unforgettable guest experiences and operational flow.',
      paragraph1: 'Hospitality and corporate design must simultaneously enchant patrons and optimize workflow. We design dramatic guest arrival sequences, high-efficiency service conduits, and resilient luxury finishes capable of enduring high footfall.',
      paragraph2: 'From acoustic nightclub baffling to grand banquet lighting trusses, our turnkey solutions deliver measurable commercial ROI.',
    },
    highlights: {
      show: true,
      items: [
        {
          id: 'comm-hl-1',
          title: 'Acoustic Engineering & DMX Lighting',
          text: 'Tuned bass dampening, decoupled sound barriers, and synchronized musical lighting rigs.',
          image: '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/129a7d57-c895-4ecc-a079-cbc6aa3c7308.png',
        },
        {
          id: 'comm-hl-2',
          title: 'High-Flow Guest & Service Circulation',
          text: 'Dual-conduit pathways ensuring guest luxury without ever intersecting back-of-house operations.',
          image: '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/2a52ad1e-4050-4783-b269-36dcd2bb72b0.png',
        },
        {
          id: 'comm-hl-3',
          title: 'Monumental Banquet & Event Architecture',
          text: 'Pillarless ballroom spans, automated partition walls, and crystalline chandelier matrices.',
          image: '/website-assets/architecture/The%20Romania%20-%20Luxury%20Wedding%20Spaces%20BANQUET%20HALL/Sunlit%20Luxury%20Banquet%20Hall-1.png',
        },
      ],
    },
    steps: {
      show: true,
      items: [
        {
          id: 'comm-step-1',
          number: '01',
          title: 'Brand & Commercial Viability Strategy',
          text: 'Evaluating customer demographics, seating density, turnaround velocity, and brand positioning.',
        },
        {
          id: 'comm-step-2',
          number: '02',
          title: 'MEP & Smoke Evacuation Engineering',
          text: 'LOD 400 modeling of commercial kitchen hoods, high-volume HVAC, and 3-phase audio power.',
        },
        {
          id: 'comm-step-3',
          number: '03',
          title: 'Turnkey Fit-Out & Custom Fabrication',
          text: 'Fabricating stain-resistant commercial leather banquettes, stainless bar wells, and acoustic ceilings.',
        },
        {
          id: 'comm-step-4',
          number: '04',
          title: 'Operational Handover & Staff Training',
          text: 'Commissioning scene controls, safety certification, and complete handover for grand opening.',
        },
      ],
    },
    gallery: {
      show: true,
      items: [
        {
          id: 'comm-gal-1',
          image: '/website-assets/commercial%20interior/PUSHPA-II%20DANCE%20BAR%20KOLKATA/A1.jpg',
          caption: 'Pushpa-II Dance Bar - High-Gloss Neon Dancefloor & VIP Lounge',
        },
        {
          id: 'comm-gal-2',
          image: '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/61a49ab7-c934-4b53-8d00-ae0593441ef3.png',
          caption: 'Teetro Restaurant & Bar Mohali - Kinetic Chandelier & Seating',
        },
        {
          id: 'comm-gal-3',
          image: '/website-assets/architecture/The%20Romania%20-%20Luxury%20Wedding%20Spaces%20BANQUET%20HALL/Sunlit%20Luxury%20Banquet%20Hall-1.png',
          caption: 'The Romania Luxury Banquet Hall - Monumental Wedding Ballroom',
        },
        {
          id: 'comm-gal-4',
          image: '/website-assets/commercial%20interior/VECTERRACE%20HOTEL%20DANCE%20BAR%20KOLKATA/V.jpg',
          caption: 'Victerrace Hotel Bar - Golden Onyx Backlit Counter',
        },
      ],
    },
    closing: {
      show: true,
      heading: 'Build an iconic hospitality or commercial flagship.',
      paragraph: 'Discuss location requirements, layout optimization, and project timelines with our commercial development team.',
      buttonLabel: 'Inquire About Commercial Projects',
      buttonLink: '/contacts',
    },
  })

  return {
    categories: [
      {
        id: 'all-projects',
        name: 'All projects',
        slug: 'all-projects',
        href: '/all-projects',
        menuDescription: cards['all-projects']?.hover || 'Bespoke villas, residences, and landmark commercial spaces.',
        menuImage: cards['all-projects']?.image || '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg',
        menuVideo: cards['all-projects']?.video || '/website-assets/commercial%20interior/RYDHUM%20HOTEL%20&%20BANQUET%20HALL%20FIROZEPURE%20PUNJAB/RYDHUM%20HOTEL.mp4',
        published: true,
        showInMenu: true,
        order: 0,
        page: allProjectsPage,
        subcategories: [],
      },
      {
        id: 'architectural-design',
        name: 'Architectural design',
        slug: 'architectural-design',
        href: '/architectural-design',
        menuDescription: cards['architectural-design']?.hover || 'Plans, facades, and the structural shape of the house.',
        menuImage: cards['architectural-design']?.image || '/website-assets/architecture/G%20S%20STREET%20MARKET/076fc39d-c3b1-48a3-a1df-4abaa5bbf7c1.png',
        menuVideo: cards['architectural-design']?.video || '/website-assets/architecture/SMART%20CITY%20SOCITY%20BANUR/WhatsApp%20Video%202025-07-03%20at%2019.14.48.mp4',
        published: true,
        showInMenu: true,
        order: 1,
        page: archPage,
        subcategories: [],
      },
      {
        id: 'interior-design',
        name: 'Interior design',
        slug: 'interior-design',
        href: '/interior-design',
        menuDescription: cards['interior-design']?.hover || 'Furniture, lighting, and the refined finish of each living room.',
        menuImage: cards['interior-design']?.image || '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png',
        menuVideo: cards['interior-design']?.video || '',
        published: true,
        showInMenu: true,
        order: 2,
        page: interiorPage,
        subcategories: [],
      },
      {
        id: 'commercial-design',
        name: 'Commercial design',
        slug: 'commercial-design',
        href: '/commercial-design',
        menuDescription: cards['commercial-design']?.hover || 'Guest rooms, cocktail lounges, and premier places of work.',
        menuImage: cards['commercial-design']?.image || '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/2a52ad1e-4050-4783-b269-36dcd2bb72b0.png',
        menuVideo: cards['commercial-design']?.video || '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/PUSHPA%20THE%20FIRE.mp4',
        published: true,
        showInMenu: true,
        order: 3,
        page: commercialPage,
        subcategories: [],
      },
    ],
  }
}

/** Public path for a portfolio menu category. Slug wins over a leftover href. */
export function portfolioCategoryPath(item) {
  const slug = String(item?.slug || '').trim()
  if (!slug || slug === 'all-projects') return '/all-projects'
  if (slug === 'architectural-design') return '/architectural-design'
  if (slug === 'interior-design') return '/interior-design'
  if (slug === 'commercial-design' || slug === 'commercial-interiors') return '/commercial-design'
  return `/${slug}`
}

export function portfolioSubcategoryPath(categoryItem, sub) {
  if (!categoryItem || !sub?.slug) return portfolioCategoryPath(categoryItem)
  return `${portfolioCategoryPath(categoryItem)}/${sub.slug}`
}

export function emptyHighlightDetail(partial = {}) {
  return {
    banner: {
      show: true,
      label: '',
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
    sections: Array.isArray(partial.sections) ? partial.sections : [],
    gallery: Array.isArray(partial.gallery) ? partial.gallery : [],
    closing: {
      show: true,
      heading: '',
      paragraph: '',
      buttonLabel: 'Request a consultation',
      buttonLink: '/contacts',
      ...(partial.closing || {}),
    },
  }
}

function highlightDetailHasContent(detail) {
  if (!detail || typeof detail !== 'object') return false
  const banner = detail.banner || {}
  return Boolean(
    banner.title ||
      banner.subtitle ||
      banner.label ||
      (banner.images || []).some(Boolean) ||
      detail.intro?.heading ||
      detail.intro?.paragraph1 ||
      (Array.isArray(detail.sections) && detail.sections.length) ||
      (Array.isArray(detail.gallery) && detail.gallery.length) ||
      detail.closing?.heading
  )
}

export function migrateHighlightDetail(item) {
  if (highlightDetailHasContent(item?.detail)) return emptyHighlightDetail(item.detail)
  const title = String(item?.title || '').trim()
  const text = String(item?.text || '').trim()
  const image = String(item?.image || '').trim()
  const id = item?.id || 'hl'
  return emptyHighlightDetail({
    banner: {
      show: true,
      label: '',
      title,
      accent: 'by Unique Graphics®',
      subtitle: text,
      images: [image, '', ''],
    },
    intro: {
      show: true,
      heading: title,
      paragraph1: text,
      paragraph2: '',
    },
    sections: [],
    gallery: [],
    closing: {
      show: true,
      heading: title ? `Continue ${title.toLowerCase()}.` : 'Discuss this space.',
      paragraph: text || 'Share the site and how the rooms should feel.',
      buttonLabel: 'Request a consultation',
      buttonLink: '/contacts',
    },
  })
}

function uniqueHighlightSlug(rawSlug, reserved, used) {
  let slug = slugify(rawSlug) || 'highlight'
  if (reserved.has(slug) || used.has(slug)) slug = `${slug}-story`
  let index = 2
  while (reserved.has(slug) || used.has(slug)) {
    slug = `${slugify(rawSlug) || 'highlight'}-story-${index}`
    index += 1
  }
  used.add(slug)
  return slug
}

export function normalizeHighlightItem(raw, index = 0, reservedSlugs = [], usedSlugs = new Set()) {
  const title = String(raw?.title || '').trim()
  const reserved = reservedSlugs instanceof Set ? reservedSlugs : new Set(reservedSlugs)
  const slug = uniqueHighlightSlug(raw?.slug || title || raw?.id || `highlight-${index + 1}`, reserved, usedSlugs)
  return {
    id: raw?.id || `hl-${index + 1}`,
    title,
    text: String(raw?.text || ''),
    image: String(raw?.image || ''),
    slug,
    published: raw?.published !== false,
    detail: migrateHighlightDetail(raw),
  }
}

export function normalizeHighlightItems(items, reservedSlugs = []) {
  const reserved = new Set((reservedSlugs || []).map((value) => String(value || '').trim()).filter(Boolean))
  const used = new Set()
  return (Array.isArray(items) ? items : []).map((item, index) => normalizeHighlightItem(item, index, reserved, used))
}

export function portfolioHighlightPath(categoryItem, sub, highlight) {
  const parent = sub?.slug ? portfolioSubcategoryPath(categoryItem, sub) : portfolioCategoryPath(categoryItem)
  const slug = highlight?.slug || slugify(highlight?.title || highlight?.id || '')
  if (!slug) return parent
  return `${parent}/${slug}`
}

export function findHighlightOnPage(page, highlightSlug) {
  const slug = String(highlightSlug || '').trim()
  if (!slug) return null
  return (page?.highlights?.items || []).find((item) => item.slug === slug || item.id === slug) || null
}

export function findPortfolioHighlight(tree, categorySlug, subcategorySlug, highlightSlug) {
  const match = findPortfolioPage(tree, categorySlug, subcategorySlug || '')
  if (!match) return null
  const highlight = findHighlightOnPage(match.page, highlightSlug)
  if (!highlight) return null
  return { ...match, highlight, detail: highlight.detail || emptyHighlightDetail() }
}

function uniqueGallerySlug(rawSlug, reserved, used) {
  let slug = slugify(rawSlug) || 'gallery'
  if (reserved.has(slug) || used.has(slug)) slug = `${slug}-gallery`
  let index = 2
  while (reserved.has(slug) || used.has(slug)) {
    slug = `${slugify(rawSlug) || 'gallery'}-gallery-${index}`
    index += 1
  }
  used.add(slug)
  return slug
}

export function migrateGalleryDetail(item) {
  if (highlightDetailHasContent(item?.detail)) return emptyHighlightDetail(item.detail)
  const title = String(item?.title || item?.caption || '').trim()
  const text = String(item?.caption || item?.text || '').trim()
  const image = String(item?.image || '').trim()
  const id = item?.id || 'gal'
  return emptyHighlightDetail({
    banner: {
      show: true,
      label: '',
      title,
      accent: 'by Unique Graphics®',
      subtitle: text,
      images: [image, '', ''],
    },
    intro: {
      show: true,
      heading: title,
      paragraph1: text,
      paragraph2: '',
    },
    sections: [],
    gallery: [],
    closing: {
      show: true,
      heading: title ? `Continue ${title.toLowerCase()}.` : 'Discuss this space.',
      paragraph: text || 'Share the site and how the rooms should feel.',
      buttonLabel: 'Request a consultation',
      buttonLink: '/contacts',
    },
  })
}

export function normalizeGalleryItem(raw, index = 0, reservedSlugs = [], usedSlugs = new Set()) {
  const caption = String(raw?.caption || '').trim()
  const title = String(raw?.title || caption).trim()
  const reserved = reservedSlugs instanceof Set ? reservedSlugs : new Set(reservedSlugs)
  const slug = uniqueGallerySlug(raw?.slug || title || raw?.id || `gallery-${index + 1}`, reserved, usedSlugs)
  return {
    id: raw?.id || `gal-${index + 1}`,
    image: String(raw?.image || ''),
    caption,
    title,
    slug,
    published: raw?.published !== false,
    detail: migrateGalleryDetail({ ...raw, title, caption }),
  }
}

export function normalizeGalleryItems(items, reservedSlugs = []) {
  const reserved = new Set((reservedSlugs || []).map((value) => String(value || '').trim()).filter(Boolean))
  const used = new Set()
  return (Array.isArray(items) ? items : []).map((item, index) => normalizeGalleryItem(item, index, reserved, used))
}

export function portfolioGalleryPath(categoryItem, sub, item) {
  const parent = sub?.slug ? portfolioSubcategoryPath(categoryItem, sub) : portfolioCategoryPath(categoryItem)
  const slug = item?.slug || slugify(item?.title || item?.caption || item?.id || '')
  if (!slug) return parent
  return `${parent}/${slug}`
}

export function findGalleryOnPage(page, gallerySlug) {
  const slug = String(gallerySlug || '').trim()
  if (!slug) return null
  return (page?.gallery?.items || []).find((item) => item.slug === slug || item.id === slug) || null
}

export function findPortfolioGallery(tree, categorySlug, subcategorySlug, gallerySlug) {
  const match = findPortfolioPage(tree, categorySlug, subcategorySlug || '')
  if (!match) return null
  const item = findGalleryOnPage(match.page, gallerySlug)
  if (!item) return null
  const highlight = {
    ...item,
    title: item.title || item.caption || '',
    text: item.caption || item.text || '',
    image: item.image || '',
  }
  return { ...match, highlight, galleryItem: item, detail: item.detail || emptyHighlightDetail() }
}

export function findPortfolioStory(tree, categorySlug, subcategorySlug, storySlug) {
  return (
    findPortfolioHighlight(tree, categorySlug, subcategorySlug, storySlug) ||
    findPortfolioGallery(tree, categorySlug, subcategorySlug, storySlug)
  )
}

function cleanMenuVideo(value) {
  const v = String(value || '').trim()
  if (!v) return ''
  if (v.startsWith('data:video')) return v
  if (v.startsWith('/') || /^https?:\/\//i.test(v)) {
    return /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(v) ? v : ''
  }
  return ''
}

function pageFromLegacyHero(hero, fallbackTitle) {
  if (!hero) return emptyPage({ banner: { title: fallbackTitle || '' } })
  return emptyPage({
    banner: {
      show: true,
      title: hero.titleLead || fallbackTitle || '',
      accent: hero.titleAccent || 'by Unique Graphics®',
      subtitle: hero.description || '',
      images: [hero.banner1, hero.banner2, hero.banner3].filter(Boolean),
    },
  })
}

function normalizeNode(raw, index, legacy, parentSlug) {
  const slug = String(raw?.slug || raw?.id || '').trim() || `page-${index + 1}`
  const name = isJunkText(raw?.name) ? '' : String(raw?.name || '')
  const legacyKey = parentSlug || slug
  const hero = legacy?.heroes?.[slug] || legacy?.heroes?.[legacyKey]
  const nav = legacy?.navCards?.[slug] || legacy?.navCards?.[legacyKey]
  const rawPage = raw?.page && typeof raw.page === 'object' ? raw.page : {}
  const hasBannerMedia = (rawPage.banner?.images || []).some(Boolean)
  const hasBannerText = Boolean(rawPage.banner?.title || rawPage.banner?.subtitle || rawPage.banner?.label)
  const page = emptyPage(
    hasBannerMedia || hasBannerText ? rawPage : { ...pageFromLegacyHero(hero, name), ...rawPage }
  )

  let projects = Array.isArray(raw?.projects) ? raw.projects : null
  if ((!projects || !projects.length) && slug !== 'all-projects' && !parentSlug) {
    const legacyList = getLegacyProjects(legacy, slug)
    projects = Array.isArray(legacyList) ? legacyList : []
  }
  if (!projects) projects = []

  const reservedHighlightSlugs = parentSlug
    ? []
    : (Array.isArray(raw?.subcategories) ? raw.subcategories : []).map((sub) => String(sub?.slug || sub?.id || '').trim())
  const highlightItems = normalizeHighlightItems(page.highlights?.items, reservedHighlightSlugs)
  const reservedGallerySlugs = [
    ...reservedHighlightSlugs,
    ...highlightItems.map((item) => item.slug),
  ]
  const pageWithHighlights = {
    ...page,
    highlights: {
      ...(page.highlights || {}),
      items: highlightItems,
    },
    gallery: {
      ...(page.gallery || {}),
      items: normalizeGalleryItems(page.gallery?.items, reservedGallerySlugs),
    },
  }

  return {
    id: raw?.id || slug,
    name,
    slug,
    menuDescription: raw?.menuDescription || nav?.hover || '',
    menuImage: raw?.menuImage || nav?.image || '',
    menuVideo: cleanMenuVideo(raw?.menuVideo || nav?.video || ''),
    href: parentSlug ? '' : portfolioCategoryPath({ slug }),
    published: raw?.published !== false,
    showInMenu: raw?.showInMenu !== false,
    order: Number.isFinite(raw?.order) ? raw.order : index,
    page: pageWithHighlights,
    projects,
    subcategories: parentSlug
      ? []
      : (Array.isArray(raw?.subcategories) ? raw.subcategories : []).map((sub, subIndex) =>
          normalizeNode(sub, subIndex, legacy, slug)
        ),
  }
}

export function normalizePortfolioTree(raw, legacyConfig) {
  if (!raw || !Array.isArray(raw.categories) || raw.categories.length === 0) {
    return buildDefaultPortfolioTree()
  }

  const nameJunk = raw.categories.some((c) => isJunkText(c.name) || isJunkText(c.slug))
  if (nameJunk) {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ug_portfolio_pages_config')
      }
    } catch {
      /* ignore */
    }
    return buildDefaultPortfolioTree()
  }

  return {
    categories: raw.categories.map((c, index) => normalizeNode(c, index, legacyConfig || raw)),
  }
}

export function findPortfolioPage(tree, categorySlug, subcategorySlug) {
  const categories = tree?.categories || []
  const category = categories.find((item) => item.slug === categorySlug || item.id === categorySlug)
  if (!category) return null
  if (!subcategorySlug) {
    return { category, subcategory: null, page: category.page, projects: category.projects || [], kind: 'category' }
  }
  const sub = (category.subcategories || []).find((item) => item.slug === subcategorySlug || item.id === subcategorySlug)
  if (!sub) return null
  return { category, subcategory: sub, page: sub.page, projects: sub.projects || [], kind: 'subcategory' }
}

export function flattenPortfolioProjects(tree) {
  const list = []
  for (const cat of tree?.categories || []) {
    for (const project of cat.projects || []) {
      list.push({ ...project, categoryId: cat.id, categorySlug: cat.slug })
    }
    for (const sub of cat.subcategories || []) {
      for (const project of sub.projects || []) {
        list.push({
          ...project,
          categoryId: cat.id,
          subcategoryId: sub.id,
          categorySlug: cat.slug,
          subcategorySlug: sub.slug,
        })
      }
    }
  }
  return list
}

export function projectsForPortfolioPage(tree, categorySlug, subcategorySlug) {
  const match = findPortfolioPage(tree, categorySlug, subcategorySlug)
  if (!match) return []
  if (match.kind === 'subcategory') return match.projects || []
  if (match.category.slug === 'all-projects' || match.category.id === 'all-projects') {
    const own = match.projects || []
    const rest = flattenPortfolioProjects(tree).filter((item) => item.categorySlug !== 'all-projects')
    const seen = new Set()
    const merged = [...own, ...rest].filter((item) => {
      const key = String(item.id || '')
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })
    if (merged.length) return merged
    return getLegacyProjects(getStoredPortfolioConfig(), 'all-projects')
  }
  if (match.projects?.length) return match.projects
  return getLegacyProjects(getStoredPortfolioConfig(), match.category.slug)
}

export function syncLegacyPortfolioConfig(tree, current = {}) {
  const navCards = { ...(current.navCards || {}) }
  const heroes = { ...(current.heroes || {}) }
  const projectLists = { ...(current.projectLists || {}) }
  const next = { ...current, navCards, heroes, projectLists, categories: tree.categories }

  for (const cat of tree.categories || []) {
    navCards[cat.slug] = {
      title: cat.name || cat.slug,
      hover: cat.menuDescription || '',
      image: cat.menuImage || '',
      video: cat.menuVideo || '',
    }
    const images = cat.page?.banner?.images || []
    heroes[cat.slug] = {
      titleLead: cat.page?.banner?.title || cat.name || '',
      titleAccent: cat.page?.banner?.accent || '',
      description: cat.page?.banner?.subtitle || '',
      banner1: images[0] || '',
      banner2: images[1] || '',
      banner3: images[2] || '',
    }
    const listKey = resolveProjectListKey(cat.slug)
    if (Array.isArray(cat.projects)) {
      if (listKey === 'architectural' || listKey === 'interior' || listKey === 'commercial') {
        next[listKey] = cat.projects
      } else if (cat.slug !== 'all-projects') {
        projectLists[listKey || cat.slug] = cat.projects
      }
    }
    for (const sub of cat.subcategories || []) {
      const subKey = `${cat.slug}__${sub.slug}`
      projectLists[subKey] = Array.isArray(sub.projects) ? sub.projects : []
    }
  }

  return next
}

export function getStoredPortfolioTree() {
  const cfg = getStoredPortfolioConfig()
  const raw = Array.isArray(cfg.categories) && cfg.categories.length ? cfg : buildDefaultPortfolioTree()
  return normalizePortfolioTree(raw, cfg)
}

export function setStoredPortfolioTree(tree) {
  const current = getStoredPortfolioConfig()
  const normalized = normalizePortfolioTree(tree, current)
  setStoredPortfolioConfig(syncLegacyPortfolioConfig(normalized, current))
}

export function validatePortfolioTree(tree) {
  return validateServiceTree(tree)
}

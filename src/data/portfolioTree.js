import { DEFAULT_PORTFOLIO_CONFIG, getStoredPortfolioConfig, setStoredPortfolioConfig } from './portfolioConfig'
import { emptyPage, isJunkText, validateServiceTree } from './serviceTree'

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

export function normalizePortfolioTree(raw) {
  if (!raw || !Array.isArray(raw.categories) || raw.categories.length === 0) {
    return buildDefaultPortfolioTree()
  }

  // Detect any junk in categories or page fields
  const hasJunk = raw.categories.some((c) => {
    if (isJunkText(c.name) || isJunkText(c.slug) || isJunkText(c.menuDescription)) return true
    const p = c.page || {}
    if (isJunkText(p.banner?.subtitle) || isJunkText(p.banner?.title) || isJunkText(p.banner?.label)) return true
    if (isJunkText(p.intro?.heading) || isJunkText(p.intro?.paragraph1) || isJunkText(p.intro?.paragraph2)) return true
    if (isJunkText(p.closing?.heading) || isJunkText(p.closing?.paragraph) || isJunkText(p.closing?.buttonLabel)) return true
    if (p.highlights?.items?.some((h) => isJunkText(h.title) || isJunkText(h.text))) return true
    if (p.steps?.items?.some((s) => isJunkText(s.title) || isJunkText(s.text))) return true
    if (p.gallery?.items?.some((g) => isJunkText(g.caption))) return true
    return false
  })

  if (hasJunk) {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ug_portfolio_pages_config')
      }
    } catch {}
    return buildDefaultPortfolioTree()
  }

  const def = buildDefaultPortfolioTree()
  return {
    categories: raw.categories.map((c, index) => {
      const match = def.categories.find((d) => d.slug === c.slug || d.id === c.id) || def.categories[index] || def.categories[0]
      const rawPage = c.page || {}
      // If the category page banner has empty or junk values, use default
      const bannerSubtitle = isJunkText(rawPage.banner?.subtitle) || !rawPage.banner?.subtitle ? match.page.banner.subtitle : rawPage.banner.subtitle
      const introHeading = isJunkText(rawPage.intro?.heading) || !rawPage.intro?.heading ? match.page.intro.heading : rawPage.intro.heading
      const introP1 = isJunkText(rawPage.intro?.paragraph1) || !rawPage.intro?.paragraph1 ? match.page.intro.paragraph1 : rawPage.intro.paragraph1

      const cleanPage = emptyPage({
        ...match.page,
        ...rawPage,
        banner: {
          ...match.page.banner,
          ...(rawPage.banner || {}),
          subtitle: bannerSubtitle,
          images: (rawPage.banner?.images || []).filter(Boolean).length ? rawPage.banner.images : match.page.banner.images,
        },
        intro: {
          ...match.page.intro,
          ...(rawPage.intro || {}),
          heading: introHeading,
          paragraph1: introP1,
        },
        highlights: rawPage.highlights?.items?.length ? rawPage.highlights : match.page.highlights,
        steps: rawPage.steps?.items?.length ? rawPage.steps : match.page.steps,
        gallery: rawPage.gallery?.items?.length ? rawPage.gallery : match.page.gallery,
        closing: (rawPage.closing?.heading && !isJunkText(rawPage.closing.heading)) ? rawPage.closing : match.page.closing,
      })

      return {
        ...match,
        ...c,
        name: c.name || match.name,
        slug: c.slug || match.slug,
        menuDescription: c.menuDescription || match.menuDescription,
        menuImage: c.menuImage || match.menuImage,
        menuVideo: c.menuVideo || match.menuVideo,
        published: c.published !== false,
        showInMenu: c.showInMenu !== false,
        page: cleanPage,
        subcategories: Array.isArray(c.subcategories) ? c.subcategories : [],
      }
    }),
  }
}

export function getStoredPortfolioTree() {
  return normalizePortfolioTree(getStoredPortfolioConfig().categories ? getStoredPortfolioConfig() : buildDefaultPortfolioTree())
}

export function setStoredPortfolioTree(tree) {
  const current = getStoredPortfolioConfig()
  setStoredPortfolioConfig({ ...current, categories: tree.categories })
}

export function validatePortfolioTree(tree) {
  return validateServiceTree(tree)
}

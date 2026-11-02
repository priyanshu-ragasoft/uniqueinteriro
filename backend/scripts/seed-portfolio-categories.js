import { connectDB } from '../config/db.js'
import Setting from '../models/Setting.js'
import mongoose from 'mongoose'

const A = {
  villa: '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png',
  living: '/website-assets/INTERIOR/INTERIOR%20MODERN/LIVING%20ROOM/A1.jpg',
  living2: '/website-assets/INTERIOR/INTERIOR%20MODERN/LIVING%20ROOM/A2.jpg',
  classicLiving: '/website-assets/INTERIOR/CLASSIC%20LUXURY%20LIVING/Contemporary%20neoclassical%20ivory%20and%20sage%20interior-7.png',
  kitchen: '/website-assets/INTERIOR/MODERN%20KITCHEN/a1.jpg',
  neoExt: '/website-assets/architecture/NEO%20CLASSIC%20EXTERIOR%20DESIGN%20BIJNOR/Sunlit%20Classical%20Villa%20with%20Palm%20Gardens-11.png',
  contemp: '/website-assets/architecture/contemporary%20exterior%20house%20design%20NOORPUR%20BIJNOR/14f096b3-4749-4d63-ab89-19a59d193f77.png',
  greenwood: '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg',
  tower: '/website-assets/architecture/AL%20REHMAN%20TOWER%20KOLKATA/7e4f4312-846d-4e35-9f2b-af632b7dfc0a.png',
  romania: '/website-assets/architecture/The%20Romania%20-%20Luxury%20Wedding%20Spaces%20BANQUET%20HALL/Sunlit%20Luxury%20Banquet%20Hall-1.png',
  romaniaNight: '/website-assets/architecture/The%20Romania%20-%20Luxury%20Wedding%20Spaces%20BANQUET%20HALL/Golden%20Arch%20Banquet%20Hall%20at%20Night-6.png',
  goa: '/website-assets/architecture/SOUTH%20GOA%20RESORTS%20EXTERIOR/243e4630-d2b6-4e95-931a-03302219585b.png',
  teetro: '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/2a52ad1e-4050-4783-b269-36dcd2bb72b0.png',
  teetro2: '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/61a49ab7-c934-4b53-8d00-ae0593441ef3.png',
  teetroVid: '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/TETTRO%20MOHALI.mp4',
  pushpa: '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/129a7d57-c895-4ecc-a079-cbc6aa3c7308.png',
  pushpaVid: '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/PUSHPA%20THE%20FIRE.mp4',
  pushpa2: '/website-assets/commercial%20interior/PUSHPA-II%20DANCE%20BAR%20KOLKATA/A1.jpg',
  rydhumVid: '/website-assets/commercial%20interior/RYDHUM%20HOTEL%20&%20BANQUET%20HALL%20FIROZEPURE%20PUNJAB/RYDHUM%20HOTEL.mp4',
  victerrace: '/website-assets/commercial%20interior/VECTERRACE%20HOTEL%20DANCE%20BAR%20KOLKATA/V.jpg',
  victerraceVid: '/website-assets/commercial%20interior/VECTERRACE%20HOTEL%20DANCE%20BAR%20KOLKATA/VICTERRACE%20KOLKATA.mp4',
  hotel: '/website-assets/commercial%20interior/Hotel%20Mangalore%20International/v4.jpg',
  smartVid: '/website-assets/architecture/SMART%20CITY%20SOCITY%20BANUR/WhatsApp%20Video%202025-07-03%20at%2019.14.48.mp4',
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function highlightDetail(item) {
  const title = item.title || ''
  const text = item.text || ''
  const image = item.image || ''
  const extras = (item.gallery || []).filter(Boolean)
  const slides = [image, ...extras].filter(Boolean).slice(0, 3)
  while (slides.length < 3) slides.push('')
  return {
    banner: {
      show: true,
      label: item.label || '',
      title,
      accent: 'by Unique Graphics®',
      subtitle: text,
      images: slides,
    },
    intro: {
      show: true,
      heading: title,
      paragraph1: text,
      paragraph2: item.paragraph2 || '',
    },
    sections: [
      {
        id: `${item.id}-sec-1`,
        title: title,
        text: item.paragraph2 || text,
        media: extras[0] || image,
        caption: '',
      },
    ],
    gallery: [image, ...extras].filter(Boolean).slice(0, 4).map((src, index) => ({
      id: `${item.id}-gal-${index + 1}`,
      image: src,
      caption: title,
    })),
    closing: {
      show: true,
      heading: item.closingHeading || `Continue ${title.toLowerCase()}.`,
      paragraph: item.closingParagraph || text,
      buttonLabel: 'Request a consultation',
      buttonLink: '/contacts',
    },
  }
}

function withHighlightMeta(item, reserved = []) {
  let slug = slugify(item.slug || item.title || item.id)
  if (reserved.includes(slug)) slug = `${slug}-story`
  return {
    id: item.id,
    title: item.title,
    text: item.text,
    image: item.image,
    slug,
    published: true,
    detail: item.detail || highlightDetail(item),
  }
}

function page({ label, title, accent = 'by Unique Graphics®', subtitle, images, heading, p1, p2, highlights, steps, gallery, closing, reservedSlugs = [] }) {
  return {
    banner: { show: true, label, title, accent, subtitle, images },
    intro: { show: true, heading, paragraph1: p1, paragraph2: p2 || '' },
    highlights: { show: true, items: (highlights || []).map((item) => withHighlightMeta(item, reservedSlugs)) },
    steps: { show: true, items: steps },
    gallery: { show: true, items: gallery },
    closing: {
      show: true,
      heading: closing.heading,
      paragraph: closing.paragraph,
      buttonLabel: closing.buttonLabel || 'Request a consultation',
      buttonLink: closing.buttonLink || '/contacts',
    },
  }
}

function project({ id, titlePre, location, titlePost = '', city, country, type, image, video = '', description, detail, gallery }) {
  return {
    id,
    image,
    video,
    gallery: (gallery || [image]).map((src, index) => ({ src, title: '', caption: '' })),
    sections: [
      {
        id: `${id}-sec-1`,
        title: 'The Unique Graphics® approach',
        text: detail,
        media: gallery?.[1] || image,
        caption: '',
      },
    ],
    tour360: '',
    area: '1 200 – 6 500 m²',
    type,
    tone: 'Stone, timber, and quiet metal',
    city,
    country,
    badge: '',
    award: '',
    titlePre,
    location,
    titlePost,
    description,
    detail,
    scope: ['Architectural Design', 'Interior Architecture', '3D Visualization', 'Material Selection'],
    aboutHeading: 'About the project:',
    featuresTitle: 'Project features',
    enquireLabel: 'Enquire',
    enquireLink: '/contacts',
    tour360Heading: '360° experience',
    tocHeading: 'Table of contents:',
    readAlsoHeading: 'Read also:',
    closingEyebrow: 'Unique Graphics®',
    closingTitle: 'Step into the world of Unique Graphics®',
    closingText: 'A place where your dreams take shape through the unique vision of our studio.',
    closingButtonLabel: 'Discuss this project',
    closingButtonLink: '/contacts',
  }
}

function node({ id, name, slug, menuDescription, menuImage, menuVideo, order, page: pageData, projects, subcategories = [] }) {
  return {
    id,
    name,
    slug,
    menuDescription,
    menuImage,
    menuVideo,
    published: true,
    showInMenu: true,
    order,
    href: `/${slug}`,
    page: pageData,
    projects,
    subcategories,
  }
}

const NEW_CATEGORIES = [
  node({
    id: 'residences',
    name: 'Residences',
    slug: 'residences',
    menuDescription: 'Private villas and apartments composed as complete living worlds.',
    menuImage: A.villa,
    menuVideo: A.smartVid,
    order: 10,
    page: page({
      label: 'Private living',
      title: 'Residences',
      subtitle: 'Houses and apartments drawn around daily life — light, sequence, and materials that last.',
      images: [A.villa, A.living, A.neoExt],
      heading: 'Rooms that hold a family, not a trend.',
      p1: 'Unique Graphics® designs residences as a single language from the gate to the last fitting. Architecture, interior, and landscape stay in conversation.',
      p2: 'Each commission begins with how people move through the day, then becomes stone, timber, and quiet light.',
      highlights: [
        { id: 'res-hl-1', title: 'Arrival and threshold', text: 'A first court, a shaded walk, a door that belongs to the house.', image: A.neoExt },
        { id: 'res-hl-2', title: 'Living rooms as salons', text: 'Proportions for gathering, with joinery and light that stay calm at night.', image: A.living },
        { id: 'res-hl-3', title: 'Private suites', text: 'Bedrooms and dressing rooms resolved as complete interiors, not leftover space.', image: A.classicLiving },
      ],
      steps: [
        { id: 'res-st-1', number: '01', title: 'Life of the house', text: 'How the family arrives, cooks, rests, and receives guests.' },
        { id: 'res-st-2', number: '02', title: 'Massing and light', text: 'Volumes, courts, and daylight before a single finish is chosen.' },
        { id: 'res-st-3', number: '03', title: 'Materials in the hand', text: 'Stone, timber, metal, and fabric sampled on site.' },
        { id: 'res-st-4', number: '04', title: 'Turnkey handover', text: 'Joinery, lighting scenes, and a house ready to live in.' },
      ],
      gallery: [
        { id: 'res-g-1', image: A.villa, caption: 'Neoclassical villa salon' },
        { id: 'res-g-2', image: A.living, caption: 'Modern living room' },
        { id: 'res-g-3', image: A.kitchen, caption: 'Kitchen as architecture' },
        { id: 'res-g-4', image: A.contemp, caption: 'Contemporary house exterior' },
      ],
      closing: {
        heading: 'Begin a private residence.',
        paragraph: 'Share the site, the brief, and how the house should feel at the end of the day.',
      },
      reservedSlugs: ['villas', 'apartments'],
    }),
    projects: [
      project({
        id: 'res-bijnor-villa',
        titlePre: 'NEOCLASSICAL VILLA',
        location: 'IN BIJNOR',
        city: 'Bijnor',
        country: 'India',
        type: 'Private Villa',
        image: A.villa,
        description: 'A double-height salon, fluted joinery, and a quiet garden court for a private family house.',
        detail: 'The villa is composed around a central salon. Light arrives from the garden side; rooms step down in scale toward the private wing.',
        gallery: [A.villa, A.classicLiving, A.neoExt],
      }),
    ],
    subcategories: [
      node({
        id: 'villas',
        name: 'Villas',
        slug: 'villas',
        menuDescription: 'Independent houses with gardens, courts, and a full architectural envelope.',
        menuImage: A.neoExt,
        menuVideo: A.smartVid,
        order: 0,
        page: page({
          label: 'Private houses',
          title: 'Villas',
          subtitle: 'Independent residences where facade, garden, and interior are drawn as one commission.',
          images: [A.neoExt, A.villa, A.contemp],
          heading: 'A villa is a small estate, not a large room.',
          p1: 'We plan the approach, the shade, the water, and the rooms that look onto them. The house should feel complete from the road and from the garden.',
          p2: 'Structure, joinery, and landscape are coordinated so the last fitting still belongs to the first sketch.',
          highlights: [
            { id: 'vil-hl-1', title: 'Facade and garden', text: 'Stone, plaster, and planted courts that hold the climate.', image: A.neoExt },
            { id: 'vil-hl-2', title: 'Grand salon', text: 'A room for gathering with height, light, and quiet acoustics.', image: A.villa },
            { id: 'vil-hl-3', title: 'Outdoor rooms', text: 'Terraces and pools treated as interiors without a roof.', image: A.contemp },
          ],
          steps: [
            { id: 'vil-st-1', number: '01', title: 'Site and climate', text: 'Sun, wind, and the existing trees before the plan is locked.' },
            { id: 'vil-st-2', number: '02', title: 'House and court', text: 'Massing that makes shade and a clear sequence of rooms.' },
            { id: 'vil-st-3', number: '03', title: 'Interior language', text: 'Joinery, stone, and light as one specification.' },
            { id: 'vil-st-4', number: '04', title: 'On-site finish', text: 'Supervision through structure, envelope, and last fittings.' },
          ],
          gallery: [
            { id: 'vil-g-1', image: A.neoExt, caption: 'Sunlit classical villa' },
            { id: 'vil-g-2', image: A.villa, caption: 'Villa interior' },
            { id: 'vil-g-3', image: A.contemp, caption: 'Contemporary house' },
          ],
          closing: { heading: 'Commission a villa.', paragraph: 'Send the plot and a note on how the family lives.' },
        }),
        projects: [
          project({
            id: 'res-villas-noorpur',
            titlePre: 'CONTEMPORARY VILLA',
            location: 'IN NOORPUR, BIJNOR',
            city: 'Noorpur',
            country: 'India',
            type: 'Modern Villas',
            image: A.contemp,
            description: 'Cantilevered terraces and a quiet street elevation for a private contemporary house.',
            detail: 'The house is set back from the road. Living rooms open to the garden; bedrooms sit above with deep shade.',
            gallery: [A.contemp, A.living, A.greenwood],
          }),
        ],
      }),
      node({
        id: 'apartments',
        name: 'Apartments',
        slug: 'apartments',
        menuDescription: 'Penthouses and city residences finished as complete interiors.',
        menuImage: A.tower,
        menuVideo: '',
        order: 1,
        page: page({
          label: 'City living',
          title: 'Apartments',
          subtitle: 'High-rise residences and penthouses where every millimetre of joinery has a purpose.',
          images: [A.tower, A.living2, A.kitchen],
          heading: 'A city apartment should feel as considered as a house.',
          p1: 'We plan storage, light, and silence first. Then the rooms receive stone, timber, and a lighting plan that works after dark.',
          p2: 'Kitchens, dressing rooms, and living spaces share one language so the apartment reads as a single interior.',
          highlights: [
            { id: 'apt-hl-1', title: 'Plan efficiency', text: 'Clear rooms without leftover corridors.', image: A.living2 },
            { id: 'apt-hl-2', title: 'Kitchen as architecture', text: 'Islands, concealment, and service that does not interrupt the living room.', image: A.kitchen },
            { id: 'apt-hl-3', title: 'High-rise envelope', text: 'Glazing, shade, and a calm interior against the city.', image: A.tower },
          ],
          steps: [
            { id: 'apt-st-1', number: '01', title: 'Survey the shell', text: 'Services, structure, and what can be opened or closed.' },
            { id: 'apt-st-2', number: '02', title: 'Plan the rooms', text: 'A sequence that works for a family or a single household.' },
            { id: 'apt-st-3', number: '03', title: 'Joinery and light', text: 'Millimetre drawings and a lighting scene for each room.' },
            { id: 'apt-st-4', number: '04', title: 'Install and style', text: 'Fit-out, furniture placement, and handover.' },
          ],
          gallery: [
            { id: 'apt-g-1', image: A.tower, caption: 'Tower residence' },
            { id: 'apt-g-2', image: A.living2, caption: 'City living room' },
            { id: 'apt-g-3', image: A.kitchen, caption: 'Apartment kitchen' },
          ],
          closing: { heading: 'Plan an apartment interior.', paragraph: 'Share the floor plate and how the rooms should work.' },
        }),
        projects: [
          project({
            id: 'res-apt-kolkata-tower',
            titlePre: 'RESIDENCE IN',
            location: 'AL REHMAN TOWER, KOLKATA',
            city: 'Kolkata',
            country: 'India',
            type: 'Apartment',
            image: A.tower,
            description: 'A high-rise residence with a quiet interior set against a glass facade.',
            detail: 'The apartment keeps the living room open to the view and conceals service behind flush joinery.',
            gallery: [A.tower, A.living2],
          }),
        ],
      }),
    ],
  }),
  node({
    id: 'hospitality',
    name: 'Hospitality',
    slug: 'hospitality',
    menuDescription: 'Hotels and banquet halls built for guests, service, and long evenings.',
    menuImage: A.romania,
    menuVideo: A.rydhumVid,
    order: 11,
    page: page({
      label: 'Guest houses',
      title: 'Hospitality',
      subtitle: 'Hotels, resorts, and banquet halls where arrival, service, and atmosphere are engineered together.',
      images: [A.rydhumVid, A.romania, A.goa],
      heading: 'A guest should never meet the service corridor.',
      p1: 'Unique Graphics® plans hospitality as two paths: one for the guest, one for the house. Both must work on a busy night.',
      p2: 'Materials are chosen to last under footfall, and light is written as scenes rather than a single switch.',
      highlights: [
        { id: 'hos-hl-1', title: 'Arrival sequence', text: 'Porte-cochère, lobby, and the first room that sets the house.', image: A.hotel },
        { id: 'hos-hl-2', title: 'Banquet span', text: 'Pillar-light halls with light that can change with the event.', image: A.romania },
        { id: 'hos-hl-3', title: 'Resort landscape', text: 'Rooms that open to water, shade, and a slow walk.', image: A.goa },
      ],
      steps: [
        { id: 'hos-st-1', number: '01', title: 'Guest and service', text: 'Two circulations that never cross in public view.' },
        { id: 'hos-st-2', number: '02', title: 'Rooms and halls', text: 'Keys, suites, and the large rooms that earn the house.' },
        { id: 'hos-st-3', number: '03', title: 'Kitchen and plant', text: 'MEP, hoods, and power planned with the architecture.' },
        { id: 'hos-st-4', number: '04', title: 'Opening night', text: 'Commissioning, scenes, and staff walkthrough.' },
      ],
      gallery: [
        { id: 'hos-g-1', image: A.romania, caption: 'Luxury banquet hall' },
        { id: 'hos-g-2', image: A.goa, caption: 'Resort exterior' },
        { id: 'hos-g-3', image: A.hotel, caption: 'Hotel interior' },
        { id: 'hos-g-4', image: A.romaniaNight, caption: 'Hall at night' },
      ],
      closing: { heading: 'Discuss a hospitality house.', paragraph: 'Tell us the site, the room count, and the kind of guest you expect.' },
      reservedSlugs: ['hotels', 'banquet-halls'],
    }),
    projects: [
      project({
        id: 'hos-romania-hall',
        titlePre: 'THE ROMANIA',
        location: 'LUXURY WEDDING HALL',
        city: 'India',
        country: 'India',
        type: 'Banquet Hall',
        image: A.romania,
        video: A.rydhumVid,
        description: 'A sunlit banquet hall with a long span and a lighting plan written for ceremonies.',
        detail: 'The hall is planned for processions and seated dinners. Service enters from a hidden side; guests never see it.',
        gallery: [A.romania, A.romaniaNight],
      }),
    ],
    subcategories: [
      node({
        id: 'hotels',
        name: 'Hotels',
        slug: 'hotels',
        menuDescription: 'Lobbies, rooms, and the quiet work of a hotel that runs every day.',
        menuImage: A.hotel,
        menuVideo: A.rydhumVid,
        order: 0,
        page: page({
          label: 'Hotels & resorts',
          title: 'Hotels',
          subtitle: 'Guest rooms, lobbies, and back-of-house planned so the house can work every morning.',
          images: [A.rydhumVid, A.hotel, A.goa],
          heading: 'A hotel is judged at 7 a.m. as much as at 9 p.m.',
          p1: 'We design the lobby, the corridor, the room, and the linen path. Beauty that cannot be cleaned does not last a season.',
          p2: 'Resorts receive the same discipline: shade, water, and rooms that open without losing privacy.',
          highlights: [
            { id: 'hot-hl-1', title: 'Lobby as greeting', text: 'A room that holds arrival without noise.', image: A.hotel },
            { id: 'hot-hl-2', title: 'Guest room kit', text: 'A repeatable room that still feels particular.', image: A.goa },
            { id: 'hot-hl-3', title: 'Service that disappears', text: 'Housekeeping and kitchen never cross the guest path.', image: A.teetro },
          ],
          steps: [
            { id: 'hot-st-1', number: '01', title: 'Room count and mix', text: 'Keys, suites, and F&B that the site can support.' },
            { id: 'hot-st-2', number: '02', title: 'Public rooms', text: 'Lobby, dining, and the first walk upstairs.' },
            { id: 'hot-st-3', number: '03', title: 'Typical room', text: 'A prototype room signed before the floors are rolled out.' },
            { id: 'hot-st-4', number: '04', title: 'Fit-out and opening', text: 'FF&E, scenes, and a staff rehearsal.' },
          ],
          gallery: [
            { id: 'hot-g-1', image: A.hotel, caption: 'Hotel room' },
            { id: 'hot-g-2', image: A.goa, caption: 'Resort exterior' },
          ],
          closing: { heading: 'Plan a hotel.', paragraph: 'Share the site and the number of keys.' },
        }),
        projects: [
          project({
            id: 'hos-hotels-rydhum',
            titlePre: 'RYDHUM HOTEL',
            location: 'IN FEROZEPUR',
            city: 'Ferozepur',
            country: 'India',
            type: 'Hotel',
            image: A.hotel,
            video: A.rydhumVid,
            description: 'A hotel and banquet house planned for guests who stay the night and guests who come only for the hall.',
            detail: 'Public rooms sit on the arrival axis. Guest rooms sit above, away from the banquet service.',
            gallery: [A.hotel, A.goa],
          }),
        ],
      }),
      node({
        id: 'banquet-halls',
        name: 'Banquet halls',
        slug: 'banquet-halls',
        menuDescription: 'Large rooms for ceremonies, with light and service that can change in an evening.',
        menuImage: A.romania,
        menuVideo: A.rydhumVid,
        order: 1,
        page: page({
          label: 'Ceremonial rooms',
          title: 'Banquet halls',
          subtitle: 'Halls for weddings and gatherings — span, procession, and a lighting plot that can shift.',
          images: [A.romania, A.romaniaNight, A.rydhumVid],
          heading: 'A banquet hall is architecture that must change clothes.',
          p1: 'Daylight for one ceremony, candle-warm light for another. The room stays the same; the scene changes.',
          p2: 'Kitchens, staging, and guest toilets are placed so a thousand people can move without seeing the work.',
          highlights: [
            { id: 'ban-hl-1', title: 'Clear span', text: 'A floor that can be seated, danced, or processed.', image: A.romania },
            { id: 'ban-hl-2', title: 'Night architecture', text: 'Arches and light that hold after sunset.', image: A.romaniaNight },
            { id: 'ban-hl-3', title: 'Service edge', text: 'A hidden line for catering and staging.', image: A.teetro2 },
          ],
          steps: [
            { id: 'ban-st-1', number: '01', title: 'Capacity', text: 'Seated, standing, and the procession that opens the night.' },
            { id: 'ban-st-2', number: '02', title: 'Hall and foyer', text: 'Arrival, cloak, and the first view of the room.' },
            { id: 'ban-st-3', number: '03', title: 'Light and sound', text: 'Scenes, truss, and acoustics that do not fight the room.' },
            { id: 'ban-st-4', number: '04', title: 'First event', text: 'A rehearsal dinner before the house opens.' },
          ],
          gallery: [
            { id: 'ban-g-1', image: A.romania, caption: 'Sunlit banquet hall' },
            { id: 'ban-g-2', image: A.romaniaNight, caption: 'Hall at night' },
          ],
          closing: { heading: 'Commission a hall.', paragraph: 'Tell us the guest count and the kind of ceremony.' },
        }),
        projects: [
          project({
            id: 'hos-banquet-romania',
            titlePre: 'GRAND BANQUET',
            location: 'THE ROMANIA',
            city: 'India',
            country: 'India',
            type: 'Banquet Hall',
            image: A.romaniaNight,
            description: 'A ceremonial hall with a golden arch and a lighting plot for night events.',
            detail: 'Guests enter on axis. Service runs in a parallel corridor. The hall can be reset between ceremonies.',
            gallery: [A.romaniaNight, A.romania],
          }),
        ],
      }),
    ],
  }),
  node({
    id: 'nightlife',
    name: 'Nightlife',
    slug: 'nightlife',
    menuDescription: 'Bars and night clubs built for sound, light, and a long service night.',
    menuImage: A.pushpa,
    menuVideo: A.pushpaVid,
    order: 12,
    page: page({
      label: 'Night rooms',
      title: 'Nightlife',
      subtitle: 'Bars and clubs where acoustics, light, and the bar itself are designed as architecture.',
      images: [A.pushpaVid, A.teetroVid, A.victerraceVid],
      heading: 'A night room must work at 1 a.m. and still look composed.',
      p1: 'We design the dance floor, the bar well, the VIP line, and the door that keeps sound inside.',
      p2: 'Materials take spill and late service. Light is DMX, not a chandelier left on.',
      highlights: [
        { id: 'nl-hl-1', title: 'Tuned rooms', text: 'Bass that stays on the floor, not in the neighbours.', image: A.pushpa },
        { id: 'nl-hl-2', title: 'Bar as object', text: 'A counter that can work a full night without looking tired.', image: A.teetro },
        { id: 'nl-hl-3', title: 'VIP without a wall', text: 'Sightlines that feel private without killing the room.', image: A.pushpa2 },
      ],
      steps: [
        { id: 'nl-st-1', number: '01', title: 'The night programme', text: 'Who arrives, when the room turns, and what the bar must serve.' },
        { id: 'nl-st-2', number: '02', title: 'Plan the floor', text: 'Door, cloak, bar, dance, VIP, and the service spine.' },
        { id: 'nl-st-3', number: '03', title: 'Sound and light', text: 'Isolation, arrays, and a lighting plot that can change with the set.' },
        { id: 'nl-st-4', number: '04', title: 'First service', text: 'A dry run with staff before doors open.' },
      ],
      gallery: [
        { id: 'nl-g-1', image: A.pushpa, caption: 'Dance bar lounge' },
        { id: 'nl-g-2', image: A.teetro, caption: 'Restaurant bar' },
        { id: 'nl-g-3', image: A.victerrace, caption: 'Hotel bar' },
        { id: 'nl-g-4', image: A.pushpa2, caption: 'Night club floor' },
      ],
      closing: { heading: 'Build a night room.', paragraph: 'Share the address, the licence, and the kind of night you want.' },
      reservedSlugs: ['bars', 'night-clubs'],
    }),
    projects: [
      project({
        id: 'nl-pushpa-kolkata',
        titlePre: 'PUSHPA THE FIRE',
        location: 'DANCE BAR, KOLKATA',
        city: 'Kolkata',
        country: 'India',
        type: 'Night Club',
        image: A.pushpa,
        video: A.pushpaVid,
        description: 'A high-energy dance bar with a stage, VIP line, and a room tuned for late service.',
        detail: 'The floor sits in the centre. VIP rooms look on without leaving the music. Service runs behind the bar wall.',
        gallery: [A.pushpa, A.pushpa2],
      }),
    ],
    subcategories: [
      node({
        id: 'bars',
        name: 'Bars',
        slug: 'bars',
        menuDescription: 'Counters, booths, and rooms for a slower night.',
        menuImage: A.teetro,
        menuVideo: A.teetroVid,
        order: 0,
        page: page({
          label: 'Bars & lounges',
          title: 'Bars',
          subtitle: 'Rooms built around the counter — seating, service wells, and light that holds a conversation.',
          images: [A.teetroVid, A.teetro, A.victerrace],
          heading: 'The bar is the architecture.',
          p1: 'Guests should reach a seat without crossing the well. Staff should reach ice, glass, and the pass without leaving the line.',
          p2: 'We design the counter, the booth, and the light temperature so the room still looks composed at last call.',
          highlights: [
            { id: 'bar-hl-1', title: 'The counter', text: 'Stone or metal that can work every night.', image: A.victerrace },
            { id: 'bar-hl-2', title: 'Seating density', text: 'Booths and stools that turn without feeling packed.', image: A.teetro },
            { id: 'bar-hl-3', title: 'A quieter room', text: 'A lounge that can sit beside a louder floor.', image: A.teetro2 },
          ],
          steps: [
            { id: 'bar-st-1', number: '01', title: 'Licence and plan', text: 'What the room is allowed to be, and how people enter.' },
            { id: 'bar-st-2', number: '02', title: 'Bar well', text: 'Stations, speed rail, and a counter that photographs well.' },
            { id: 'bar-st-3', number: '03', title: 'Light and finish', text: 'A palette that hides wear and still feels rich.' },
            { id: 'bar-st-4', number: '04', title: 'Open the room', text: 'Staff walkthrough and the first service night.' },
          ],
          gallery: [
            { id: 'bar-g-1', image: A.teetro, caption: 'Teetro bar' },
            { id: 'bar-g-2', image: A.victerrace, caption: 'Backlit bar' },
          ],
          closing: { heading: 'Design a bar.', paragraph: 'Send the plan and the kind of evening you want to hold.' },
        }),
        projects: [
          project({
            id: 'nl-bars-teetro',
            titlePre: 'TEETRO BAR',
            location: 'IN MOHALI',
            city: 'Mohali',
            country: 'India',
            type: 'Bar',
            image: A.teetro,
            video: A.teetroVid,
            description: 'A restaurant bar with a kinetic ceiling and a counter planned for full service.',
            detail: 'Dining and the bar share a room without sharing noise. The well is hidden from the first table.',
            gallery: [A.teetro, A.teetro2],
          }),
        ],
      }),
      node({
        id: 'night-clubs',
        name: 'Night clubs',
        slug: 'night-clubs',
        menuDescription: 'Dance floors, stages, and rooms built for sound and a late door.',
        menuImage: A.pushpa2,
        menuVideo: A.pushpaVid,
        order: 1,
        page: page({
          label: 'Clubs',
          title: 'Night clubs',
          subtitle: 'Dance floors and stages with isolation, light, and a door that can hold a queue.',
          images: [A.pushpaVid, A.pushpa2, A.victerraceVid],
          heading: 'A club is a machine that must still look like a room.',
          p1: 'We isolate the bass, place the arrays, and keep a clear line from door to floor to VIP.',
          p2: 'Finishes take heels, spill, and a long night. Light follows the music, not the other way around.',
          highlights: [
            { id: 'nc-hl-1', title: 'The floor', text: 'A centre that can hold a crowd and still be seen from the bar.', image: A.pushpa2 },
            { id: 'nc-hl-2', title: 'The stage', text: 'A performance line with power, hang points, and a clean sightline.', image: A.pushpa },
            { id: 'nc-hl-3', title: 'The door', text: 'Queue, cloak, and a threshold that keeps the night inside.', image: A.victerrace },
          ],
          steps: [
            { id: 'nc-st-1', number: '01', title: 'Capacity and licence', text: 'How many people, and what the room is allowed to be.' },
            { id: 'nc-st-2', number: '02', title: 'Acoustic box', text: 'Isolation, lobby locks, and neighbours who will still sleep.' },
            { id: 'nc-st-3', number: '03', title: 'Light and stage', text: 'A plot that can change with the resident and the guest set.' },
            { id: 'nc-st-4', number: '04', title: 'Doors open', text: 'A technical rehearsal and a first night with staff.' },
          ],
          gallery: [
            { id: 'nc-g-1', image: A.pushpa2, caption: 'Dance floor' },
            { id: 'nc-g-2', image: A.pushpa, caption: 'Lounge and stage' },
          ],
          closing: { heading: 'Commission a club.', paragraph: 'Share the shell, the licence, and the kind of night.' },
        }),
        projects: [
          project({
            id: 'nl-clubs-pushpa-ii',
            titlePre: 'PUSHPA II',
            location: 'DANCE BAR, KOLKATA',
            city: 'Kolkata',
            country: 'India',
            type: 'Night Club',
            image: A.pushpa2,
            video: A.pushpaVid,
            description: 'A second room for late service — high-gloss floor, neon, and a VIP line above the dance.',
            detail: 'The floor is the centre. VIP sits a step above. Service never crosses the dance.',
            gallery: [A.pushpa2, A.pushpa],
          }),
        ],
      }),
    ],
  }),
]

function mergeCategories(existing = [], incoming = []) {
  const list = Array.isArray(existing) ? [...existing] : []
  for (const next of incoming) {
    const index = list.findIndex((item) => item.slug === next.slug || item.id === next.id)
    if (index >= 0) {
      const prev = list[index]
      list[index] = {
        ...prev,
        ...next,
        page: next.page || prev.page,
        projects: next.projects?.length ? next.projects : prev.projects || [],
        subcategories: next.subcategories?.length ? next.subcategories : prev.subcategories || [],
      }
    } else {
      list.push(next)
    }
  }
  return list
}

function summarize(categories) {
  return (categories || []).map((cat) => ({
    slug: cat.slug,
    subs: (cat.subcategories || []).map((sub) => sub.slug),
    projects: [
      ...(cat.projects || []).map((p) => p.id),
      ...(cat.subcategories || []).flatMap((sub) => (sub.projects || []).map((p) => p.id)),
    ],
  }))
}

const run = async () => {
  await connectDB()
  const existing = await Setting.findOne({ key: 'portfolio_pages_config' })
  const prev = existing?.value && typeof existing.value === 'object' ? existing.value : {}
  const nextCategories = mergeCategories(prev.categories, NEW_CATEGORIES)

  const navCards = { ...(prev.navCards || {}) }
  const heroes = { ...(prev.heroes || {}) }
  const projectLists = { ...(prev.projectLists || {}) }

  for (const cat of NEW_CATEGORIES) {
    navCards[cat.slug] = {
      title: cat.name,
      hover: cat.menuDescription,
      image: cat.menuImage,
      video: cat.menuVideo,
    }
    const images = cat.page?.banner?.images || []
    heroes[cat.slug] = {
      titleLead: cat.page?.banner?.title || cat.name,
      titleAccent: cat.page?.banner?.accent || '',
      description: cat.page?.banner?.subtitle || '',
      banner1: images[0] || '',
      banner2: images[1] || '',
      banner3: images[2] || '',
    }
    projectLists[cat.slug] = cat.projects || []
    for (const sub of cat.subcategories || []) {
      projectLists[`${cat.slug}__${sub.slug}`] = sub.projects || []
    }
  }

  const value = {
    ...prev,
    categories: nextCategories,
    navCards,
    heroes,
    projectLists,
  }

  const saved = await Setting.findOneAndUpdate(
    { key: 'portfolio_pages_config' },
    { value },
    { upsert: true, new: true }
  )

  const written = NEW_CATEGORIES.map((c) => c.slug)
  const allSlugs = (saved.value.categories || []).map((c) => c.slug)
  const seeded = summarize(NEW_CATEGORIES)

  console.log('Mongo key: portfolio_pages_config')
  console.log('Document keys:', Object.keys(saved.value || {}))
  console.log('All category slugs:', allSlugs.join(', '))
  console.log('Seeded / updated:', JSON.stringify(seeded, null, 2))
  console.log('Category count:', allSlugs.length)
  console.log('_id:', String(saved._id))

  await mongoose.disconnect()
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})

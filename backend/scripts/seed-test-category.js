import { connectDB } from '../config/db.js'
import Setting from '../models/Setting.js'
import mongoose from 'mongoose'

const IMG = {
  A: '/website-assets/architecture/NEO%20CLASSIC%20EXTERIOR%20DESIGN%20BIJNOR/Blue-hour%20classical%20villa%20with%20glowing%20pool-15.png',
  B: '/website-assets/architecture/AUTOMOTIVE%20GALLERY/9ea0e852-0904-49c5-b948-f8504d0ea7fb.png',
  C: '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/045f28e6-6ae6-4e3f-bd9c-4c9b90b29904.png',
  D: '/website-assets/INTERIOR/INTERIOR%20MODERN/LIVING%20ROOM/A1.jpg',
  E: '/website-assets/INTERIOR/MODERN%20KITCHEN/a1.jpg',
  F: '/website-assets/INTERIOR/CLASSIC%20LUXURY%20LIVING/a88db789-1058-48e8-b9e2-f78410f22367.png',
  G: '/website-assets/INTERIOR/LUXURY%20POWDER%20ROOM/8450856b-fb15-4d24-8320-8ac7974ea9fa.png',
  H: '/website-assets/architecture/The%20Romania%20-%20Luxury%20Wedding%20Spaces%20BANQUET%20HALL/11f3efea-6d7a-41d9-aebf-08686b09e7bc.png',
  I: '/website-assets/architecture/AL%20REHMAN%20TOWER%20KOLKATA/7e4f4312-846d-4e35-9f2b-af632b7dfc0a.png',
  J: '/website-assets/architecture/SOUTH%20GOA%20RESORTS%20EXTERIOR/243e4630-d2b6-4e95-931a-03302219585b.png',
  K: '/website-assets/architecture/G%20S%20STREET%20MARKET/076fc39d-c3b1-48a3-a1df-4abaa5bbf7c1.png',
  L: '/website-assets/commercial%20interior/Hotel%20Mangalore%20International/V1%20(2).jpg',
  M: '/website-assets/commercial%20interior/TEETRO%20BAR%20%26%20RESTURANT%20MOHALI%2079%20CHANDIGARH/2a52ad1e-4050-4783-b269-36dcd2bb72b0.png',
  N: '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/129a7d57-c895-4ecc-a079-cbc6aa3c7308.png',
  O: '/website-assets/commercial%20interior/VECTERRACE%20HOTEL%20DANCE%20BAR%20KOLKATA/V.jpg',
  P: '/website-assets/commercial%20interior/DARK%20JEWELLERY%20SHOWROOM%20LUDHIANA/278ba19b-4102-4be0-aeee-764d93cbc3b5.png',
}

function storyDetail({ title, subtitle, banner, sectionMedia, galleryMedia, closing }) {
  return {
    banner: {
      show: true,
      label: 'Test page',
      title,
      accent: 'by Unique Graphics®',
      subtitle,
      images: [banner, '', ''],
    },
    intro: {
      show: true,
      heading: title,
      paragraph1: subtitle,
      paragraph2: 'Open this URL from the parent card. It is a separate page.',
    },
    sections: sectionMedia
      ? [
          {
            id: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-sec-1`,
            title: 'Story section',
            text: 'This block is only on the detail page. Its photo is different from the card and the banner.',
            media: sectionMedia,
            caption: '',
          },
        ]
      : [],
    gallery: galleryMedia
      ? [{ id: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-gal-1`, image: galleryMedia, caption: 'Gallery on this detail page' }]
      : [],
    closing: {
      show: true,
      heading: closing,
      paragraph: 'This closing belongs to the detail page, not the parent.',
      buttonLabel: 'Request a consultation',
      buttonLink: '/contacts',
    },
  }
}

function project({ id, titlePre, location, city, image, sectionImage, description }) {
  return {
    id,
    image,
    video: '',
    gallery: [],
    sections: [
      {
        id: `${id}-sec-1`,
        title: 'Project story',
        text: description,
        media: sectionImage,
        caption: '',
      },
    ],
    tour360: '',
    area: '420 m²',
    type: 'Residence',
    tone: 'Stone and timber',
    city,
    country: 'India',
    badge: 'Test',
    award: '',
    titlePre,
    location,
    titlePost: '',
    description,
    detail: description,
    scope: ['Test slot', 'Unique cover', 'Unique section photo'],
    aboutHeading: 'About the project:',
    featuresTitle: 'Project features',
    enquireLabel: 'Enquire',
    enquireLink: '/contacts',
    tour360Heading: '360° experience',
    tocHeading: 'Table of contents:',
    readAlsoHeading: 'Read also:',
    closingEyebrow: 'Unique Graphics®',
    closingTitle: 'Step into the world of Unique Graphics®',
    closingText: 'A test project page opened from a card.',
    closingButtonLabel: 'Discuss this project',
    closingButtonLink: '/contacts',
  }
}

const TEST_CATEGORY = {
  id: 'cat-test-category',
  name: 'Test category',
  slug: 'test-category',
  href: '/test-category',
  menuDescription: 'Demo section — parent page.',
  menuImage: IMG.A,
  menuVideo: '',
  published: true,
  showInMenu: true,
  order: 90,
  page: {
    banner: {
      show: true,
      label: 'Test parent',
      title: 'Test category',
      accent: 'by Unique Graphics®',
      subtitle: 'This is the parent page.',
      images: [IMG.C, '', ''],
    },
    intro: {
      show: true,
      heading: 'This is the main category page',
      paragraph1: 'Admin → Test category → This page writes this screen. The banner, intro, cards, and project below belong only to /test-category.',
      paragraph2: 'Open the story card, the gallery card, or the project card. Each one has its own URL and a different photo.',
    },
    highlights: {
      show: true,
      items: [
        {
          id: 'hl-test-story',
          title: 'Test story card',
          text: 'Click this card. It opens /test-category/test-story.',
          image: IMG.D,
          slug: 'test-story',
          published: true,
          detail: storyDetail({
            title: 'Test story card',
            subtitle: 'Detail page for the parent story card.',
            banner: IMG.E,
            sectionMedia: IMG.F,
            galleryMedia: IMG.G,
            closing: 'Continue the test story.',
          }),
        },
      ],
    },
    steps: { show: false, items: [] },
    gallery: {
      show: true,
      items: [
        {
          id: 'gal-test-gallery',
          image: IMG.H,
          caption: 'Test gallery card',
          title: 'Test gallery card',
          slug: 'test-gallery',
          published: true,
          detail: storyDetail({
            title: 'Test gallery card',
            subtitle: 'Detail page for the parent gallery card.',
            banner: IMG.I,
            sectionMedia: '',
            galleryMedia: '',
            closing: 'Continue the test gallery.',
          }),
        },
      ],
    },
    closing: {
      show: true,
      heading: 'You are still on the parent test page.',
      paragraph: 'The subcategory lives at /test-category/test-sub and uses different photos.',
      buttonLabel: 'Open the sub page',
      buttonLink: '/test-category/test-sub',
    },
  },
  projects: [
    project({
      id: 'proj-test-one',
      titlePre: 'Test project one',
      location: 'Demo city',
      city: 'Demo city',
      image: IMG.J,
      sectionImage: IMG.K,
      description: 'This project card sits only on the parent Test category page. The cover and the story photo are different files.',
    }),
  ],
  subcategories: [
    {
      id: 'sub-test-sub',
      name: 'Test sub page',
      slug: 'test-sub',
      menuDescription: 'Demo section — subcategory page.',
      menuImage: IMG.B,
      menuVideo: '',
      published: true,
      showInMenu: true,
      order: 0,
      page: {
        banner: {
          show: true,
          label: 'Test sub',
          title: 'Test sub page',
          accent: 'by Unique Graphics®',
          subtitle: 'This is the subcategory page — separate from the parent.',
          images: [IMG.L, '', ''],
        },
        intro: {
          show: true,
          heading: 'This is the subcategory page',
          paragraph1: 'Admin → Test category → Test sub page writes this screen. It does not reuse the parent banner or cards.',
          paragraph2: 'The story card and project below belong only to /test-category/test-sub.',
        },
        highlights: {
          show: true,
          items: [
            {
              id: 'hl-test-sub-story',
              title: 'Test sub story',
              text: 'Click this card. It opens /test-category/test-sub/test-sub-story.',
              image: IMG.M,
              slug: 'test-sub-story',
              published: true,
              detail: storyDetail({
                title: 'Test sub story',
                subtitle: 'Detail page under the subcategory.',
                banner: IMG.N,
                sectionMedia: '',
                galleryMedia: '',
                closing: 'Continue the sub story.',
              }),
            },
          ],
        },
        steps: { show: false, items: [] },
        gallery: { show: false, items: [] },
        closing: {
          show: true,
          heading: 'You are on the subcategory test page.',
          paragraph: 'Go back to /test-category to see the parent page again.',
          buttonLabel: 'Back to parent',
          buttonLink: '/test-category',
        },
      },
      projects: [
        project({
          id: 'proj-test-two',
          titlePre: 'Test project two',
          location: 'Second city',
          city: 'Second city',
          image: IMG.O,
          sectionImage: IMG.P,
          description: 'This project card sits only on the Test sub page. It is not the same project as Test project one.',
        }),
      ],
    },
  ],
}

const run = async () => {
  const used = Object.values(IMG)
  const unique = new Set(used)
  if (unique.size !== used.length) {
    throw new Error('Image map has duplicates — fix IMG before writing Mongo.')
  }

  await connectDB()
  const existing = await Setting.findOne({ key: 'portfolio_pages_config' })
  const prev = existing?.value && typeof existing.value === 'object' ? existing.value : {}
  const categories = Array.isArray(prev.categories) ? [...prev.categories] : []
  const index = categories.findIndex((item) => item.slug === 'test-category' || item.id === TEST_CATEGORY.id)
  if (index >= 0) categories[index] = { ...categories[index], ...TEST_CATEGORY }
  else categories.push(TEST_CATEGORY)

  const value = { ...prev, categories }
  const saved = await Setting.findOneAndUpdate(
    { key: 'portfolio_pages_config' },
    { value },
    { upsert: true, new: true }
  )

  const slugs = (saved.value.categories || []).map((item) => item.slug)
  const test = (saved.value.categories || []).find((item) => item.slug === 'test-category')
  console.log('All slugs:', slugs.join(', '))
  console.log('Test category:', test?.name, test?.slug)
  console.log('Sub pages:', (test?.subcategories || []).map((item) => item.slug).join(', '))
  console.log('Parent projects:', (test?.projects || []).map((item) => item.id).join(', '))
  console.log(
    'Sub projects:',
    (test?.subcategories || []).flatMap((item) => (item.projects || []).map((p) => p.id)).join(', ')
  )
  console.log('Unique images:', unique.size)
  await mongoose.disconnect()
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})

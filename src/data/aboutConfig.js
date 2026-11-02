export const DEFAULT_ABOUT_PAGE_CONFIG = {
  banner: {
    mediaUrl: '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg',
    en: {
      title: 'About us',
      text: 'Unique Graphics is a premier studio for luxury architecture and visionary interior design, crafting bespoke residences, private estates, and landmark commercial spaces.',
      button: 'Discuss your project',
      buttonLink: '/contacts',
    },
  },
  style: {
    mediaUrl: '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png',
    en: {
      mark: 'Unique Graphics Style & Philosophy',
      text: 'Our signature philosophy unites architectural purity, refined materiality, and ambient illumination. Every space is curated as a unified masterpiece of form, light, and enduring elegance.',
    },
  },
  story: {
    mediaUrl: '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png',
    en: {
      teamTitle: 'The Studio Collective',
      teamText:
        'Architectural masterminds, interior designers, 3D visualizers, and project directors work as one dedicated team. From concept sketch to finished residence, your vision remains impeccably uncompromised.',
      years: '15+ years',
      yearsText: 'of architectural mastery and turnkey interior execution',
      bigNumber: '15+',
      story: 'How a project moves from vision to reality',
      steps: [
        { label: 'Brief & Discovery', text: 'We delve into your lifestyle, aesthetic aspirations, spatial needs, and site orientation.' },
        { label: 'Master Concept', text: 'Volumetric planning, functional layout zoning, and photorealistic 3D architectural views.' },
        { label: 'Technical Blueprints', text: 'Complete architectural sections, electrical & MEP schematics, custom millwork, and finishes schedule.' },
        { label: 'Site Supervision', text: 'Rigorous engineering oversight on-site to ensure uncompromising fidelity to blueprints.' },
        { label: 'Turnkey Handover', text: 'Impeccable styling, bespoke furnishing reveal, and ongoing post-completion concierge care.' },
      ],
    },
  },
  conditions: {
    mediaUrl: '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/2a52ad1e-4050-4783-b269-36dcd2bb72b0.png',
    en: {
      title: 'Distinctive advantages for your project',
      cards: [
        { title: 'Lifelong Support After Completion', text: 'We remain your trusted partners after handover, assisting with seasonal upkeep, art curation, and spatial enhancements.' },
        { title: 'White-Glove Turnkey Service', text: 'Your daily routine continues smoothly while our studio manages all contractors, shipments, and artisan trades.' },
        { title: 'Dedicated Principal Architect', text: 'A dedicated partner coordinates every facet of your project from the initial consultation through final inspection.' },
        { title: 'Artisan & Material Curation', text: 'Exclusive direct access to master joinery artisans, rare stone quarries, and bespoke European furnishings.' },
        { title: 'Transparent Fixed Budgeting', text: 'Comprehensive itemized bills of quantities and fixed stage agreements eliminate budget surprises.' },
        { title: 'Interactive Milestone Roadmap', text: 'Clear progressive phases with formal milestones so you have total control at every stage.' },
        { title: 'Virtual Site Walkthroughs', text: 'High-definition photo logs, 360° virtual tours, and regular milestone reports sent directly to you.' },
        { title: 'Vastu & Acoustic Excellence', text: 'Harmonious spatial orientations, sound-insulated sanctuaries, and climate-responsive architecture.' },
      ],
      mission: 'Our commitment is to create spaces of enduring legacy that elevate life every single day.',
      stat: '98%',
      statText: 'of our private and commercial clients return to us for their next expansion and recommend our studio.',
      button: 'Contact our design director',
      buttonLink: '/contacts',
    },
  },
}

export const getStoredAboutConfig = () => {
  try {
    const saved = localStorage.getItem('ug_about_page_config')
    if (saved) {
      const parsed = JSON.parse(saved)
      const bannerMedia = parsed.banner?.mediaUrl?.trim()
      const isBadBanner =
        !bannerMedia ||
        bannerMedia.includes('GREEN%20WOOD.mp4') ||
        bannerMedia.includes('GREEN WOOD.mp4')

      return {
        banner: {
          ...DEFAULT_ABOUT_PAGE_CONFIG.banner,
          ...parsed.banner,
          mediaUrl: isBadBanner ? DEFAULT_ABOUT_PAGE_CONFIG.banner.mediaUrl : bannerMedia,
        },
        style: {
          ...DEFAULT_ABOUT_PAGE_CONFIG.style,
          ...parsed.style,
          mediaUrl: parsed.style?.mediaUrl || DEFAULT_ABOUT_PAGE_CONFIG.style.mediaUrl,
        },
        story: {
          ...DEFAULT_ABOUT_PAGE_CONFIG.story,
          ...parsed.story,
          mediaUrl: parsed.story?.mediaUrl || DEFAULT_ABOUT_PAGE_CONFIG.story.mediaUrl,
        },
        conditions: {
          ...DEFAULT_ABOUT_PAGE_CONFIG.conditions,
          ...parsed.conditions,
          mediaUrl: parsed.conditions?.mediaUrl || DEFAULT_ABOUT_PAGE_CONFIG.conditions.mediaUrl,
        },
      }
    }
  } catch (e) {
    console.error('Error reading stored about config:', e)
  }
  return DEFAULT_ABOUT_PAGE_CONFIG
}

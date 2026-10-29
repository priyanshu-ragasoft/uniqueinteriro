import Blog from '../models/Blog.js'
import Setting from '../models/Setting.js'

export const INITIAL_BLOG_POSTS = [
  {
    slug: 'monumental-classical-villas',
    category: 'Architecture',
    tag: 'Cover Story',
    date: 'October 24, 2026',
    readTime: '6 min read',
    title: 'The Classical Revival: Symmetrical Colonnades and Palatial Villa Architecture',
    excerpt:
      'An architectural case study on crafting timeless neoclassical estates with Portuguese limestone colonnades, grand central courtyards, and olympic reflection pools.',
    image: '/website-assets/architecture/NEO%20CLASSIC%20EXTERIOR%20DESIGN%20BIJNOR/Sunlit%20Classical%20Villa%20with%20Palm%20Gardens-11.png',
    author: 'Unique Graphics Architectural Practice',
    published: true,
    featured: true,
    views: 1840,
    content: [
      {
        type: 'paragraph',
        text: 'Neoclassical residential architecture represents the pinnacle of formal symmetry, proportion, and enduring permanence. In our Bijnor Villa masterwork, monumental Portuguese limestone colonnades, Corinthian pediments, and expansive travertine promenades merge into one cohesive, generational estate.',
      },
      {
        type: 'quote',
        text: 'True architectural luxury does not clamor for attention with fleeting novelty; it commands enduring reverence through classical geometric proportion and authentic natural stone.',
      },
      {
        type: 'heading',
        text: 'Symmetry, Axial Alignment & Daylight Dynamics',
      },
      {
        type: 'paragraph',
        text: 'Every archway, colonnade, and garden vista is plotted along strict architectural axes. Floor-to-ceiling thermal glass panels allow golden afternoon sunlight to wash across double-height reception halls, casting sculptural shadow rhythms across Portuguese stone porticos.',
      },
      {
        type: 'heading',
        text: 'Olympic Pool Integration & Dusk Illumination',
      },
      {
        type: 'paragraph',
        text: 'At twilight, concealed 2700K museum-grade LED grazing lights illuminate the hand-fluted stone pillars while reflection pools mirror glowing architectural pavilions in deep blue-hour stillness.',
      },
    ],
  },
  {
    slug: 'high-rise-tower-facades',
    category: 'Architecture',
    tag: 'Metropolitan Landmark',
    date: 'October 18, 2026',
    readTime: '5 min read',
    title: 'Skyline Monumentality: High-Performance Glazing and Facade BIM Engineering',
    excerpt:
      'Engineering aerodynamic building envelopes for landmark commercial and residential towers, merging thermal efficiency with dramatic architectural presence.',
    image: '/website-assets/architecture/AL%20REHMAN%20TOWER%20KOLKATA/7e4f4312-846d-4e35-9f2b-af632b7dfc0a.png',
    author: 'Structural & Envelope Design Board',
    published: true,
    featured: false,
    views: 1420,
    content: [
      {
        type: 'paragraph',
        text: 'Designing landmark towers like Al Rehman Tower requires synthesizing complex aerodynamic wind loads, solar heat-gain coefficients, and dramatic vertical aesthetics into an integrated BIM envelope.',
      },
      {
        type: 'quote',
        text: 'A metropolitan skyscraper must serve dual masters: defining the city’s skyline from afar while providing an intimate, sheltered sanctuary for its occupants.',
      },
      {
        type: 'heading',
        text: 'Unitized Curtain Wall Precision',
      },
      {
        type: 'paragraph',
        text: 'We utilize pre-glazed unitized aluminum panels with integrated thermal breaks and high-performance low-E glass coatings, reducing solar radiation by 42% while retaining panoramic optical clarity across urban skylines.',
      },
    ],
  },
  {
    slug: 'haute-neoclassic-interiors',
    category: 'Interior Design',
    tag: 'Haute Living',
    date: 'October 10, 2026',
    readTime: '7 min read',
    title: 'The Neo-Classic Sanctuary: Bookmatched Italian Marble, Fluted Brass & Acoustic Warmth',
    excerpt:
      'How our interior studio crafts sensory residential havens balancing classical wall paneling, liquid bronze inlays, and calibrated acoustic resonance.',
    image: '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png',
    author: 'Elena Rostova & Interior Atelier',
    published: true,
    featured: false,
    views: 1290,
    content: [
      {
        type: 'paragraph',
        text: 'High-end interior design is not merely decorative styling—it is the orchestration of sensory atmosphere, tactile materiality, and acoustic calm. In our signature neoclassical living suites, wall moldings, brass trim reveals, and bookmatched Calacatta marble create an atmosphere of profound serenity.',
      },
      {
        type: 'quote',
        text: 'When natural stone, noble hardwoods, and indirect illumination achieve perfect harmony, living spaces transcend everyday shelter to become personal sanctuaries.',
      },
      {
        type: 'heading',
        text: 'Calibrated Reverberation & Invisible Climate Control',
      },
      {
        type: 'paragraph',
        text: 'By integrating micro-perforated acoustic timber paneling beneath plaster cornices, we lower room reverberation times to an ultra-plush 0.4 seconds. Invisible slot linear diffusers eliminate intrusive grilles, maintaining pure ceiling coffer geometry.',
      },
    ],
  },
  {
    slug: 'sensory-nightlife-architecture',
    category: 'Commercial',
    tag: 'Hospitality Architecture',
    date: 'September 30, 2026',
    readTime: '6 min read',
    title: 'High-Energy Hospitality: Acoustic Shells and DMX Dynamic Lighting in Modern Nightclubs',
    excerpt:
      'Inside the engineering of Pushpa The Fire and Kolkata’s premiere dance bars: creating high-impact entertainment architecture with soundproof floating slabs.',
    image: '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/129a7d57-c895-4ecc-a079-cbc6aa3c7308.png',
    author: 'Commercial Interiors & Hospitality Studio',
    published: true,
    featured: false,
    views: 1750,
    content: [
      {
        type: 'paragraph',
        text: 'Designing premier nightclubs and dance bars demands mastery over high-intensity acoustics, crowd circulation, and programmable lighting architecture. Projects like Pushpa The Fire and Vecterrace combine subterranean bass isolation with electrifying spatial aesthetics.',
      },
      {
        type: 'quote',
        text: 'Great hospitality spaces transform ordinary evenings into theatrical sensory journeys through pulse, illumination, and raw spatial drama.',
      },
      {
        type: 'heading',
        text: 'Box-in-Box Acoustic Isolation',
      },
      {
        type: 'paragraph',
        text: 'Floating concrete slabs on elastomeric springs and decoupled perimeter partitions prevent sound transmission to adjacent hotel suites, allowing internal sound pressure levels of 110 dB with absolute external silence.',
      },
    ],
  },
  {
    slug: 'grand-wedding-banquet-architecture',
    category: 'Commercial',
    tag: 'Event Architecture',
    date: 'September 22, 2026',
    readTime: '5 min read',
    title: 'Monumental Celebration Venues: Cathedral Arches and Symmetrical Colonnades at The Romania',
    excerpt:
      'Designing grand celebration palaces that accommodate thousands of guests with seamless hospitality logistics and museum-grade evening lighting.',
    image: '/website-assets/architecture/The%20Romania%20-%20Luxury%20Wedding%20Spaces%20BANQUET%20HALL/Golden%20Arch%20Banquet%20Hall%20at%20Night-6.png',
    author: 'Boutique Event Architecture Division',
    published: true,
    featured: false,
    views: 1530,
    content: [
      {
        type: 'paragraph',
        text: 'Destination wedding venues require balancing palatial ceremony backdrops with sophisticated back-of-house logistics. At The Romania, monumental gold-lit arches frame arrival motor courts while column-free ballrooms accommodate expansive banquet seating.',
      },
      {
        type: 'quote',
        text: 'A wedding palace is the stage for life’s grandest milestones; its architecture must evoke timeless wonder and effortless celebration.',
      },
      {
        type: 'heading',
        text: 'Column-Free Long-Span Engineering',
      },
      {
        type: 'paragraph',
        text: 'Post-tensioned steel portal frames eliminate central columns, providing unobstructed sightlines across the 3,000-guest ballroom toward the ceremonial stage.',
      },
    ],
  },
  {
    slug: 'fine-dining-lounge-spatial-design',
    category: 'Commercial',
    tag: 'Culinary Spaces',
    date: 'September 15, 2026',
    readTime: '5 min read',
    title: 'Signature Dining Aesthetics: Spatial Circulation & Intimate Pods at Teetro Bar & Restaurant',
    excerpt:
      'How our studio creates dynamic restaurant interiors that optimize service pathways while providing secluded, atmospheric dining booths.',
    image: '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/2a52ad1e-4050-4783-b269-36dcd2bb72b0.png',
    author: 'Hospitality Design Atelier',
    published: true,
    featured: false,
    views: 1380,
    content: [
      {
        type: 'paragraph',
        text: 'Restaurant design is an intricate choreography of sensory pleasure and logistical precision. At Teetro Mohali, rich fluted timber walls, brushed brass bar portals, and tiered seating layouts curate high-energy social zones alongside private culinary alcoves.',
      },
      {
        type: 'quote',
        text: 'Atmosphere in a great restaurant is as essential as the cuisine itself; it creates the emotional backdrop for memorable conversation.',
      },
      {
        type: 'heading',
        text: 'Discreet Service Ergonomics',
      },
      {
        type: 'paragraph',
        text: 'Dedicated service corridors and acoustic screening ensure kitchen prep noise and staff movement remain invisible to diners, sustaining an immersive ambient mood throughout the evening.',
      },
    ],
  },
  {
    slug: 'coastal-resort-villa-design',
    category: 'Residential',
    tag: 'Tropical Architecture',
    date: 'September 05, 2026',
    readTime: '6 min read',
    title: 'Tropical Modernism: Oceanfront Villas, Cantilevered Decks & Coastal Goa Sanctuaries',
    excerpt:
      'Balancing high-humidity saline winds with marine-grade bronze, local laterite stone, and seamless indoor-outdoor pool pavilions.',
    image: '/website-assets/architecture/SOUTH%20GOA%20RESORTS%20EXTERIOR/V5.jpg',
    author: 'Tropical Architecture Studio',
    published: true,
    featured: false,
    views: 1210,
    content: [
      {
        type: 'paragraph',
        text: 'Coastal architecture in tropical climates requires deep respect for maritime elements. In our South Goa resort villa projects, deep overhanging roof eaves, cross-ventilation breezes, and native laterite stone masonry insulate against intense monsoons and tropical sunshine.',
      },
      {
        type: 'quote',
        text: 'Tropical architecture should breathe with the ocean tides, dissolving boundaries between garden foliage and living pavilions.',
      },
    ],
  },
  {
    slug: 'culinary-architecture-kitchens',
    category: 'Residential',
    tag: 'Kitchen Design',
    date: 'August 25, 2026',
    readTime: '4 min read',
    title: 'Culinary Architecture: Minimalist Kitchen Islands, Concealed Pantries & Precision Joinery',
    excerpt:
      'Transforming residential kitchens into sculptural architectural centerpieces with quartzite waterfall islands and integrated appliance concealment.',
    image: '/website-assets/INTERIOR/MODERN%20KITCHEN/a1.jpg',
    author: 'Residential Interiors Practice',
    published: true,
    featured: false,
    views: 940,
    content: [
      {
        type: 'paragraph',
        text: 'The contemporary luxury kitchen has evolved from a utility workspace into the primary social spine of the modern residence. Monolithic 4-meter quartzite waterfall countertops, touch-latch handleless cabinetry, and discrete prep sculleries deliver sculptural purity.',
      },
      {
        type: 'quote',
        text: 'A truly great kitchen merges the rigorous precision of professional culinary equipment with the serene beauty of a private sculpture gallery.',
      },
    ],
  },
  {
    slug: 'sacred-spatial-geometry-vastu',
    category: 'Philosophy',
    tag: 'Astro Vastu',
    date: 'August 12, 2026',
    readTime: '5 min read',
    title: 'Cosmic Geometry in Contemporary Architecture: Harmonizing Astro Vastu and Spatial Flow',
    excerpt:
      'Integrating ancient Vedic spatial energy grids with cutting-edge residential luxury to cultivate vitality, abundance, and architectural harmony.',
    image: '/website-assets/INTERIOR/CLASSIC%20LUXURY%20LIVING/Contemporary%20neoclassical%20ivory%20and%20sage%20interior-7.png',
    author: 'Vedic Architecture & Spatial Geometry Lead',
    published: true,
    featured: false,
    views: 1100,
    content: [
      {
        type: 'paragraph',
        text: 'Astro Vastu is the sophisticated alignment of spatial geography with celestial energy vectors. By preserving an unobstructed central Brahmasthan and calibrating water, fire, and earth zones according to astrological coordinates, living spaces foster tangible peace and vitality.',
      },
      {
        type: 'quote',
        text: 'When architecture aligns with celestial geometry, space itself becomes a restorative sanctuary that nurtures both mind and spirit.',
      },
    ],
  },
]

/**
 * @desc    Get all blogs (supports category filter, search, published query)
 * @route   GET /api/blogs
 * @access  Public
 */
export const getBlogs = async (req, res) => {
  try {
    const { category, search, published } = req.query
    const query = {}

    if (published !== undefined && published !== 'all') {
      query.published = published === 'true'
    }

    if (category && category !== 'All') {
      query.category = category
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { tag: { $regex: search, $options: 'i' } },
      ]
    }

    // Auto-seed if empty or replace legacy placeholder blogs
    const count = await Blog.countDocuments()
    if (count === 0) {
      await Blog.insertMany(INITIAL_BLOG_POSTS)
    } else {
      const hasOldPlaceholders = await Blog.exists({
        image: { $regex: /dubai_villa|monaco\.jpg|atrium\.jpg|tokyo\.jpg|miami\.jpg|spa_belgrade/ },
      })
      if (hasOldPlaceholders) {
        await Blog.deleteMany({
          image: { $regex: /dubai_villa|monaco\.jpg|atrium\.jpg|tokyo\.jpg|miami\.jpg|spa_belgrade/ },
        })
        const remaining = await Blog.countDocuments()
        if (remaining === 0) {
          await Blog.insertMany(INITIAL_BLOG_POSTS)
        }
      }
    }

    const blogs = await Blog.find(query).sort({ updatedAt: -1, createdAt: -1 })
    return res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    })
  } catch (error) {
    console.error('[Get Blogs Error]:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve blogs.',
    })
  }
}

/**
 * @desc    Get single blog by slug or ID
 * @route   GET /api/blogs/:identifier
 * @access  Public
 */
export const getBlogByIdentifier = async (req, res) => {
  try {
    const { identifier } = req.params
    const isMongoId = identifier.match(/^[0-9a-fA-F]{24}$/)

    let blog
    if (isMongoId) {
      blog = await Blog.findById(identifier)
    }
    if (!blog) {
      blog = await Blog.findOne({ slug: identifier.toLowerCase() })
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.',
      })
    }

    // Increment views
    blog.views = (blog.views || 0) + 1
    await blog.save()

    return res.status(200).json({
      success: true,
      data: blog,
    })
  } catch (error) {
    console.error('[Get Blog By Identifier Error]:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to load article.',
    })
  }
}

/**
 * @desc    Create new blog post
 * @route   POST /api/blogs
 * @access  Private (Admin)
 */
export const createBlog = async (req, res) => {
  try {
    const {
      title,
      category,
      tag,
      excerpt,
      image,
      author,
      content,
      readTime,
      published,
      featured,
    } = req.body

    if (!title || !excerpt) {
      return res.status(400).json({
        success: false,
        message: 'Title and excerpt are required.',
      })
    }

    // Generate unique slug
    let generatedSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    const existingSlug = await Blog.findOne({ slug: generatedSlug })
    if (existingSlug) {
      generatedSlug = `${generatedSlug}-${Date.now().toString().slice(-4)}`
    }

    // Format current date
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date())

    // Format content array if passed as string or raw
    let formattedContent = []
    if (Array.isArray(content) && content.length > 0) {
      formattedContent = content
    } else if (typeof content === 'string' && content.trim()) {
      formattedContent = content
        .split('\n\n')
        .filter(Boolean)
        .map((p) => ({ type: 'paragraph', text: p.trim() }))
    } else {
      formattedContent = [{ type: 'paragraph', text: excerpt }]
    }

    const newBlog = await Blog.create({
      slug: generatedSlug,
      title,
      category: category || 'Architecture',
      tag: tag || 'Editorial',
      date: formattedDate,
      readTime: readTime || '5 min read',
      excerpt,
      image: image || '/architectural/dubai_villa.jpg',
      author: author || 'Unique Graphics Atelier Lead',
      content: formattedContent,
      published: published !== undefined ? published : true,
      featured: featured || false,
    })

    return res.status(201).json({
      success: true,
      message: 'Article published successfully.',
      data: newBlog,
    })
  } catch (error) {
    console.error('[Create Blog Error]:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create article.',
    })
  }
}

/**
 * @desc    Update existing blog post
 * @route   PUT /api/blogs/:id
 * @access  Private (Admin)
 */
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params
    const isMongoId = id.match(/^[0-9a-fA-F]{24}$/)

    let blog
    if (isMongoId) {
      blog = await Blog.findById(id)
    }
    if (!blog) {
      blog = await Blog.findOne({ slug: id.toLowerCase() })
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Article not found to update.',
      })
    }

    const {
      title,
      category,
      tag,
      excerpt,
      image,
      author,
      content,
      readTime,
      published,
      featured,
    } = req.body

    if (title) blog.title = title
    if (category) blog.category = category
    if (tag !== undefined) blog.tag = tag
    if (excerpt) blog.excerpt = excerpt
    if (image) blog.image = image
    if (author) blog.author = author
    if (readTime) blog.readTime = readTime
    if (published !== undefined) blog.published = published
    if (featured !== undefined) blog.featured = featured

    if (content) {
      if (Array.isArray(content)) {
        blog.content = content
      } else if (typeof content === 'string') {
        blog.content = content
          .split('\n\n')
          .filter(Boolean)
          .map((p) => ({ type: 'paragraph', text: p.trim() }))
      }
    }

    await blog.save()

    return res.status(200).json({
      success: true,
      message: 'Article updated successfully.',
      data: blog,
    })
  } catch (error) {
    console.error('[Update Blog Error]:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update article.',
    })
  }
}

/**
 * @desc    Delete a blog post
 * @route   DELETE /api/blogs/:id
 * @access  Private (Admin)
 */
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params
    const isMongoId = id.match(/^[0-9a-fA-F]{24}$/)

    let blog
    if (isMongoId) {
      blog = await Blog.findById(id)
    }
    if (!blog) {
      blog = await Blog.findOne({ slug: id.toLowerCase() })
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.',
      })
    }

    await blog.deleteOne()

    return res.status(200).json({
      success: true,
      message: 'Article deleted successfully.',
    })
  } catch (error) {
    console.error('[Delete Blog Error]:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to delete article.',
    })
  }
}

/**
 * @desc    Get Blog Page Hero Banner Typography & Text settings
 * @route   GET /api/blogs/settings/banner
 * @access  Public
 */
export const getBlogBannerSettings = async (req, res) => {
  try {
    const defaultMediaUrl =
      '/website-assets/architecture/SMART%20CITY%20SOCITY%20BANUR/WhatsApp%20Video%202025-07-03%20at%2019.14.48.mp4'

    const defaults = {
      badge: 'STUDIO JOURNAL & PUBLICATIONS',
      title: 'Architectural Insights & Design Discourse',
      subtitle:
        'Curated explorations into monumental architecture, rare materials, private residences, and visionary interior spatial philosophy crafted by the Unique Graphics studio.',
      newsletterTitle: 'Subscribe to Architectural Monograph Releases',
      newsletterSubtitle:
        'Receive private quarterly retrospectives, material sourcing guides, and invitations to our international design symposiums directly in your inbox.',
      mediaType: 'video',
      mediaUrl: defaultMediaUrl,
    }

    let setting = await Setting.findOne({ key: 'blog_banner_config' })

    // Auto-migrate if setting contains legacy dummy or repeated video path
    if (
      setting &&
      setting.value &&
      (!setting.value.mediaUrl ||
        setting.value.mediaUrl === '/video/1.mp4' ||
        setting.value.mediaUrl.includes('RYDHUM%20HOTEL') ||
        setting.value.mediaUrl.includes('dubai_villa'))
    ) {
      setting.value.mediaUrl = defaultMediaUrl
      setting.markModified('value')
      await setting.save()
    }

    return res.status(200).json({
      success: true,
      data: setting ? setting.value : defaults,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * @desc    Update Blog Page Hero Banner Typography & Text settings
 * @route   PUT /api/blogs/settings/banner
 * @access  Private (Admin)
 */
export const updateBlogBannerSettings = async (req, res) => {
  try {
    const { badge, title, subtitle, newsletterTitle, newsletterSubtitle, mediaType, mediaUrl } = req.body
    const updated = await Setting.findOneAndUpdate(
      { key: 'blog_banner_config' },
      {
        value: {
          badge: badge || 'STUDIO JOURNAL & PUBLICATIONS',
          title: title || 'Architectural Insights & Design Discourse',
          subtitle:
            subtitle ||
            'Curated explorations into monumental architecture, rare materials, private residences, and visionary interior spatial philosophy crafted by the Unique Graphics studio.',
          newsletterTitle: newsletterTitle || 'Subscribe to Architectural Monograph Releases',
          newsletterSubtitle:
            newsletterSubtitle ||
            'Receive private quarterly retrospectives, material sourcing guides, and invitations to our international design symposiums directly in your inbox.',
          mediaType: mediaType || 'video',
          mediaUrl: mediaUrl !== undefined ? mediaUrl : '/video/1.mp4',
          categories: Array.isArray(req.body.categories) ? req.body.categories : undefined,
        },
      },
      { upsert: true, new: true }
    )
    return res.status(200).json({
      success: true,
      message: 'Blog banner & hero typography updated successfully.',
      data: updated.value,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * @desc    Get Homepage Hero Banner Settings
 * @route   GET /api/blogs/settings/hero
 * @access  Public
 */
export const getHomepageHeroSettings = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'homepage_hero_config' })
    const defaults = {
      title: 'Unique Graphics',
      subtitle: 'Leading international bureau for premium architectural and interior design',
      buttonText: 'Discuss your project',
      buttonLink: '/contacts',
      mediaType: 'video',
      mediaUrl: 'cycle:default',
    }
    const val = setting ? { ...setting.value } : defaults
    if (!val.mediaUrl || val.mediaUrl.includes('GREEN%20WOOD.mp4') || val.mediaUrl.includes('GREEN WOOD.mp4')) {
      val.mediaUrl = 'cycle:default'
    }
    return res.status(200).json({
      success: true,
      data: val,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * @desc    Update Homepage Hero Banner Settings
 * @route   PUT /api/blogs/settings/hero
 * @access  Private (Admin)
 */
export const updateHomepageHeroSettings = async (req, res) => {
  try {
    const { title, subtitle, buttonText, buttonLink, mediaType, mediaUrl, videoPresets, imagePresets } = req.body
    const cleanMedia = !mediaUrl || mediaUrl.includes('GREEN%20WOOD.mp4') || mediaUrl.includes('GREEN WOOD.mp4') ? 'cycle:default' : mediaUrl
    const updated = await Setting.findOneAndUpdate(
      { key: 'homepage_hero_config' },
      {
        value: {
          title: title || 'Unique Graphics',
          subtitle: subtitle || 'Leading international bureau for premium architectural and interior design',
          buttonText: buttonText || 'Discuss your project',
          buttonLink: buttonLink || '/contacts',
          mediaType: mediaType || 'video',
          mediaUrl: cleanMedia,
          videoPresets: Array.isArray(videoPresets) ? videoPresets : [],
          imagePresets: Array.isArray(imagePresets) ? imagePresets : [],
          updatedAt: req.body.updatedAt || Date.now(),
        },
      },
      { upsert: true, new: true }
    )
    return res.status(200).json({
      success: true,
      message: 'Homepage hero banner updated successfully.',
      data: updated.value,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * @desc    Get Global Projects Section Settings (32 Countries & Stats)
 * @route   GET /api/blogs/settings/projects-section
 * @access  Public
 */
export const getProjectsSectionSettings = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'homepage_projects_config' })
    return res.status(200).json({
      success: true,
      data: setting ? setting.value : null,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * @desc    Update Global Projects Section Settings (32 Countries & Stats)
 * @route   PUT /api/blogs/settings/projects-section
 * @access  Private (Admin)
 */
export const updateProjectsSectionSettings = async (req, res) => {
  try {
    const updated = await Setting.findOneAndUpdate(
      { key: 'homepage_projects_config' },
      { value: req.body },
      { upsert: true, new: true }
    )
    return res.status(200).json({
      success: true,
      message: 'Projects & Global Stats section updated successfully.',
      data: updated.value,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * @desc    Get Completed Projects Gallery Settings (Headline & Projects)
 * @route   GET /api/blogs/settings/completed-projects
 * @access  Public
 */
export const getCompletedProjectsSettings = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'homepage_completed_projects_config' })
    return res.status(200).json({
      success: true,
      data: setting ? setting.value : null,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * @desc    Update Completed Projects Gallery Settings (Headline & Projects)
 * @route   PUT /api/blogs/settings/completed-projects
 * @access  Private (Admin)
 */
export const updateCompletedProjectsSettings = async (req, res) => {
  try {
    const updated = await Setting.findOneAndUpdate(
      { key: 'homepage_completed_projects_config' },
      { value: req.body },
      { upsert: true, new: true }
    )
    return res.status(200).json({
      success: true,
      message: 'Completed Projects gallery updated successfully.',
      data: updated.value,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * @desc    Get Brand Showcase Sections (Discover, Clients, Recognition)
 * @route   GET /api/blogs/settings/brand-sections
 * @access  Public
 */
export const getBrandSectionsSettings = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'homepage_brand_sections_config' })
    return res.status(200).json({
      success: true,
      data: setting ? setting.value : null,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * @desc    Update Brand Showcase Sections (Discover, Clients, Recognition)
 * @route   PUT /api/blogs/settings/brand-sections
 * @access  Private (Admin)
 */
export const updateBrandSectionsSettings = async (req, res) => {
  try {
    const updated = await Setting.findOneAndUpdate(
      { key: 'homepage_brand_sections_config' },
      { value: req.body },
      { upsert: true, new: true }
    )
    return res.status(200).json({
      success: true,
      message: 'Brand, Clients & Recognition sections updated successfully.',
      data: updated.value,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * @desc    Get About Page Sections Configuration
 * @route   GET /api/blogs/settings/about-page
 * @access  Public
 */
export const getAboutPageSettings = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'about_page_config' })
    let data = setting ? setting.value : null
    if (data && data.banner) {
      const bMedia = data.banner.mediaUrl?.trim()
      if (!bMedia || bMedia.includes('GREEN%20WOOD.mp4') || bMedia.includes('GREEN WOOD.mp4')) {
        data.banner.mediaUrl = '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg'
      }
    }
    return res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * @desc    Update About Page Sections Configuration
 * @route   PUT /api/blogs/settings/about-page
 * @access  Private (Admin)
 */
export const updateAboutPageSettings = async (req, res) => {
  try {
    const updated = await Setting.findOneAndUpdate(
      { key: 'about_page_config' },
      { value: req.body },
      { upsert: true, new: true }
    )
    return res.status(200).json({
      success: true,
      message: 'About page configuration updated successfully.',
      data: updated.value,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * @desc    Get Portfolio Pages & Categories Configuration
 * @route   GET /api/blogs/settings/portfolio-pages
 * @access  Public
 */
export const getPortfolioPagesSettings = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'portfolio_pages_config' })
    if (setting && setting.value) {
      const str = JSON.stringify(setting.value).toLowerCase()
      if (
        str.includes('snjks') ||
        str.includes('xshbj') ||
        str.includes('kmbgv') ||
        str.includes('kpkju') ||
        str.includes('chygyt') ||
        str.includes('sbdutfy')
      ) {
        await Setting.deleteOne({ key: 'portfolio_pages_config' })
        return res.status(200).json({
          success: true,
          data: null,
        })
      }
    }
    return res.status(200).json({
      success: true,
      data: setting ? setting.value : null,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * @desc    Update Portfolio Pages & Categories Configuration
 * @route   PUT /api/blogs/settings/portfolio-pages
 * @access  Private (Admin)
 */
export const updatePortfolioPagesSettings = async (req, res) => {
  try {
    const updated = await Setting.findOneAndUpdate(
      { key: 'portfolio_pages_config' },
      { value: req.body },
      { upsert: true, new: true }
    )
    return res.status(200).json({
      success: true,
      message: 'Portfolio pages configuration updated successfully.',
      data: updated.value,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * @desc    Get Services Pages & Disciplines Configuration
 * @route   GET /api/blogs/settings/services-pages
 * @access  Public
 */
export const getServicesPagesSettings = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'services_pages_config' })
    let data = setting ? setting.value : null
    if (data && Array.isArray(data.categories)) {
      const cleanUrl = (u) => {
        const s = String(u || '').trim()
        if (!s || s === '/hero.jpg' || s.includes('hero.jpg') || s.includes('services-card.jpg') || s.includes('/uploads/1792')) {
          return ''
        }
        return s
      }
      data.categories = data.categories.map((cat) => ({
        ...cat,
        page: cat.page ? {
          ...cat.page,
          banner: cat.page.banner ? {
            ...cat.page.banner,
            images: (cat.page.banner.images || []).map(cleanUrl),
          } : cat.page.banner,
        } : cat.page,
        subcategories: (cat.subcategories || []).map((sub) => ({
          ...sub,
          page: sub.page ? {
            ...sub.page,
            banner: sub.page.banner ? {
              ...sub.page.banner,
              images: (sub.page.banner.images || []).map(cleanUrl),
            } : sub.page.banner,
          } : sub.page,
        })),
      }))
    }
    return res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * @desc    Update Services Pages & Disciplines Configuration
 * @route   PUT /api/blogs/settings/services-pages
 * @access  Private (Admin)
 */
export const updateServicesPagesSettings = async (req, res) => {
  try {
    if (Array.isArray(req.body?.categories)) {
      const slugs = new Set()
      for (const category of req.body.categories) {
        if (!String(category?.name || '').trim()) {
          return res.status(400).json({ success: false, message: 'Every category needs a menu name.' })
        }
        if (!String(category?.slug || '').trim()) {
          return res.status(400).json({ success: false, message: 'Every category needs a URL slug.' })
        }
        if (slugs.has(category.slug)) {
          return res.status(400).json({ success: false, message: `Category slug “${category.slug}” is used more than once.` })
        }
        slugs.add(category.slug)
        const subSlugs = new Set()
        for (const sub of category.subcategories || []) {
          if (!String(sub?.name || '').trim() || !String(sub?.slug || '').trim()) {
            return res.status(400).json({ success: false, message: 'Every subcategory needs a menu name and URL slug.' })
          }
          if (subSlugs.has(sub.slug)) {
            return res.status(400).json({ success: false, message: `Subcategory slug “${sub.slug}” is repeated.` })
          }
          subSlugs.add(sub.slug)
        }
      }
    }
    const updated = await Setting.findOneAndUpdate(
      { key: 'services_pages_config' },
      { value: req.body },
      { upsert: true, new: true }
    )
    return res.status(200).json({
      success: true,
      message: 'Services pages configuration updated successfully.',
      data: updated.value,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * @desc    Get Contact Us Page Configuration
 * @route   GET /api/blogs/settings/contact-page
 * @access  Public
 */
export const getContactPageSettings = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'contact_page_config' })
    return res.status(200).json({
      success: true,
      data: setting ? setting.value : null,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * @desc    Update Contact Us Page Configuration
 * @route   PUT /api/blogs/settings/contact-page
 * @access  Private (Admin)
 */
export const updateContactPageSettings = async (req, res) => {
  try {
    const updated = await Setting.findOneAndUpdate(
      { key: 'contact_page_config' },
      { value: req.body },
      { upsert: true, new: true }
    )
    return res.status(200).json({
      success: true,
      message: 'Contact page configuration updated successfully.',
      data: updated.value,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * @desc    Get Overview Directives settings
 * @route   GET /api/blogs/settings/overview-directives
 * @access  Public
 */
export const getOverviewDirectivesSettings = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'overview_directives' })
    const defaults = [
      {
        id: 'dir-1',
        title: 'The Royal Palm Residence',
        location: 'Dubai, UAE',
        progress: 85,
        phase: 'Curtain wall glazing & interior travertine marble',
      },
      {
        id: 'dir-2',
        title: 'Courchevel 1850 Alpine Chalet',
        location: 'France',
        progress: 65,
        phase: 'Subterranean basalt spa & heated cantilever framing',
      },
      {
        id: 'dir-3',
        title: 'Mayfair Sky Penthouse',
        location: 'London, UK',
        progress: 90,
        phase: 'Italian bespoke bronze joinery & acoustic tuning',
      },
      {
        id: 'dir-4',
        title: 'Minato Grand Atrium',
        location: 'Tokyo, Japan',
        progress: 45,
        phase: 'Structural steel & triple-height laminar water curtain',
      },
    ]
    return res.status(200).json({
      success: true,
      data: setting ? setting.value : defaults,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * @desc    Update Overview Directives settings
 * @route   PUT /api/blogs/settings/overview-directives
 * @access  Private (Admin)
 */
export const updateOverviewDirectivesSettings = async (req, res) => {
  try {
    const updated = await Setting.findOneAndUpdate(
      { key: 'overview_directives' },
      { value: req.body },
      { upsert: true, new: true }
    )
    return res.status(200).json({
      success: true,
      message: 'Overview directives updated successfully.',
      data: updated.value,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * @desc    Set specific blog as primary Top Cover Story Banner
 * @route   PATCH /api/blogs/:id/featured-cover
 * @access  Private (Admin)
 */
export const setFeaturedCoverBlog = async (req, res) => {
  try {
    const { id } = req.params
    const isMongoId = id.match(/^[0-9a-fA-F]{24}$/)

    let target
    if (isMongoId) target = await Blog.findById(id)
    if (!target) target = await Blog.findOne({ slug: id.toLowerCase() })

    if (!target) {
      return res.status(404).json({ success: false, message: 'Article not found.' })
    }

    // Set all other blogs featured to false
    await Blog.updateMany({}, { featured: false })

    // Set target blog featured to true and ensure it is published
    target.featured = true
    target.published = true
    await target.save()

    return res.status(200).json({
      success: true,
      message: `"${target.title}" set as primary Top Cover Story Banner on website.`,
      data: target,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * @desc    Seed initial 8 blogs into MongoDB if collection is empty
 */
export const seedDefaultBlogs = async () => {
  try {
    const count = await Blog.countDocuments()
    if (count === 0) {
      await Blog.insertMany(INITIAL_BLOG_POSTS)
      console.log('[Blog Seeder]: Seeded initial 8 luxury architectural essays into MongoDB.')
    }
  } catch (error) {
    console.error('[Blog Seeder Error]:', error.message)
  }
}

/**
 * @desc    Seed and sync projects from website directory & generatedProjectsData into MongoDB
 */
export const seedDefaultProjectsAndServices = async () => {
  try {
    const fs = await import('fs')
    const path = await import('path')
    const { fileURLToPath } = await import('url')
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const jsonPath = path.resolve(__dirname, '../../src/data/generatedProjectsData.json')

    if (fs.existsSync(jsonPath)) {
      const raw = fs.readFileSync(jsonPath, 'utf8')
      const data = JSON.parse(raw)

      const existing = await Setting.findOne({ key: 'portfolio_pages_config' })
      const prevVal = existing ? existing.value : {}

      const updatedPortfolio = {
        ...prevVal,
        navCards: prevVal.navCards || {},
        heroes: prevVal.heroes || {},
        architectural: Array.isArray(data.architectural) && data.architectural.length > 0 ? data.architectural : (prevVal.architectural || []),
        commercial: Array.isArray(data.commercial) && data.commercial.length > 0 ? data.commercial : (prevVal.commercial || []),
        interior: Array.isArray(data.interior) && data.interior.length > 0 ? data.interior : (prevVal.interior || []),
      }

      await Setting.findOneAndUpdate(
        { key: 'portfolio_pages_config' },
        { value: updatedPortfolio },
        { upsert: true, new: true }
      )
      console.log(`[Project & Services Seeder]: Synced ${updatedPortfolio.architectural.length} Arch, ${updatedPortfolio.commercial.length} Comm, ${updatedPortfolio.interior.length} Interior projects to MongoDB!`)
    }

    // Also ensure services_pages_config is cleaned of test junk and populated with real luxury data
    const servicesSetting = await Setting.findOne({ key: 'services_pages_config' })
    const isJunkName = (val) => {
      const s = String(val || '').toLowerCase()
      return s.includes('chygyt') || s.includes('sbdutfy') || s.includes('wf,njhg') || s.includes('hghugu') || s.includes('chygytityq')
    }
    const hasJunk = servicesSetting?.value?.categories?.some((c) =>
      isJunkName(c.name) ||
      isJunkName(c.slug) ||
      c.page?.highlights?.items?.some((h) => isJunkName(h.title) || isJunkName(h.text))
    )
    const hasBadMedia = servicesSetting?.value?.categories?.some((c) =>
      c.menuImage?.includes('/uploads/1792') ||
      c.menuImage?.includes('iphone') ||
      c.menuImage?.includes('01.jpg') ||
      c.subcategories?.some((s) => s.menuImage?.includes('/uploads/1792') || s.menuImage?.includes('iphone') || s.menuImage?.includes('01.jpg') || s.menuImage?.includes('.mp4'))
    )
    const hasAstro = servicesSetting?.value?.categories?.some((c) => c.slug === 'astro-vastu')
    const needsRichSubPages = !servicesSetting?.value?.categories?.some((c) =>
      c.subcategories?.some((s) => s.slug === 'bars' && s.page?.banner?.images?.length)
    )

    if (!servicesSetting || !Array.isArray(servicesSetting.value?.categories) || hasJunk || hasBadMedia || !hasAstro || needsRichSubPages) {
      const cleanCategories = [
        {
          id: 'all-services',
          name: 'All services',
          slug: 'all-services',
          menuDescription: 'From the first drawing to the finished room.',
          menuImage: '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg',
          published: true,
          showInMenu: true,
          order: 0,
          page: {
            banner: {
              show: true,
              label: 'Services',
              title: 'All Services',
              accent: 'by Unique Graphics®',
              subtitle: 'From initial architectural sketches to final white-glove furnishing handover.',
              images: [
                '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg',
                '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/2a52ad1e-4050-4783-b269-36dcd2bb72b0.png',
                '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png'
              ]
            },
            intro: {
              show: true,
              heading: 'Full Turnkey Integration Without Compromise',
              paragraph1: 'We integrate architects, interior designers, BIM engineers, and global procurement specialists into one cohesive team, guaranteeing exact alignment between approved blueprints and physical handover.',
              paragraph2: ''
            },
            highlights: {
              show: true,
              items: [
                {
                  id: 'pillar-1',
                  title: 'Full Turnkey Delivery',
                  text: 'A single studio stewards your estate from first hand-sketch to key handover, eliminating inter-contractor friction.',
                  image: '/website-assets/architecture/AUTOMOTIVE%20GALLERY/9ea0e852-0904-49c5-b948-f8504d0ea7fb.png'
                },
                {
                  id: 'pillar-2',
                  title: 'BIM LOD 400 Precision',
                  text: 'Millimeter-exact clash detection ensures pipes, HVAC conduits, and structural beams fit invisibly inside architectural volumes.',
                  image: '/website-assets/architecture/The%20Romania%20-%20Luxury%20Wedding%20Spaces%20BANQUET%20HALL/Golden%20Arch%20Banquet%20Hall%20at%20Night-6.png'
                },
                {
                  id: 'pillar-3',
                  title: 'Fixed Milestone Budgets',
                  text: 'Transparent financial schedules and vetted supplier pricing protect your investment from unexpected budget overruns.',
                  image: '/website-assets/INTERIOR/INTERIOR%20MODERN/LIVING%20ROOM/A1.jpg'
                },
                {
                  id: 'pillar-4',
                  title: 'European FF&E Sourcing',
                  text: 'Direct procurement agreements with Italy and France’s most prestigious ateliers ensure factory-direct authenticity.',
                  image: '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/2a52ad1e-4050-4783-b269-36dcd2bb72b0.png'
                }
              ]
            },
            steps: {
              show: true,
              items: [
                { id: 'as-step-1', number: '01', title: 'Consultation & Site Audit', text: 'Detailed topographical analysis, regulatory checks, and architectural brief development.' },
                { id: 'as-step-2', number: '02', title: 'Concept & 3D Visualization', text: 'Photorealistic CGI imagery, volume studies, and interior moodboards.' },
                { id: 'as-step-3', number: '03', title: 'BIM & Working Blueprints', text: 'Complete coordinated engineering packages, MEP routes, and clash detection.' },
                { id: 'as-step-4', number: '04', title: 'Turnkey Handover & FF&E', text: 'On-site execution, author supervision, and direct factory furnishing installation.' }
              ]
            },
            closing: {
              show: true,
              heading: 'Ready to initiate your luxury estate or commercial project?',
              paragraph: 'Contact our architectural directors to arrange a confidential consultation and comprehensive project feasibility audit.',
              buttonLabel: 'Discuss a project',
              buttonLink: '/contacts'
            }
          },
          subcategories: []
        },
        {
          id: 'architecture',
          name: 'Architecture',
          slug: 'architecture',
          menuDescription: 'The building, planned before it is built.',
          menuImage: '/website-assets/architecture/AUTOMOTIVE%20GALLERY/9ea0e852-0904-49c5-b948-f8504d0ea7fb.png',
          published: true,
          showInMenu: true,
          order: 1,
          page: {
            banner: {
              show: true,
              label: 'Services',
              title: 'Architecture',
              accent: 'by Unique Graphics®',
              subtitle: 'Monumental modern villas, chalets, and private residences crafted around panoramic views.',
              images: [
                '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg',
                '/website-assets/architecture/AL%20REHMAN%20TOWER%20KOLKATA/7e4f4312-846d-4e35-9f2b-af632b7dfc0a.png',
                '/website-assets/architecture/AUTOMOTIVE%20GALLERY/9ea0e852-0904-49c5-b948-f8504d0ea7fb.png'
              ]
            },
            intro: {
              show: true,
              heading: 'Plans and sections for the house, with structure and openings drawn together.',
              paragraph1: 'We draw the house so ceiling heights, doors, and the stair agree before anyone is on site.',
              paragraph2: ''
            },
            highlights: {
              show: true,
              items: [
                {
                  id: 'arch-hl-1',
                  title: 'Monumental High-Rise Towers',
                  text: 'High-rise structural design and engineering crafted by Unique Graphics.',
                  image: '/website-assets/architecture/AL%20REHMAN%20TOWER%20KOLKATA/7e4f4312-846d-4e35-9f2b-af632b7dfc0a.png'
                },
                {
                  id: 'arch-hl-2',
                  title: 'Private Luxury Estates',
                  text: 'Bespoke modern villas, chalets, and private residences crafted around panoramic views.',
                  image: '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg'
                },
                {
                  id: 'arch-hl-3',
                  title: 'Commercial & Cultural Landmarks',
                  text: 'State-of-the-art automotive galleries, institutional campuses, and landmark facades.',
                  image: '/website-assets/architecture/AUTOMOTIVE%20GALLERY/9ea0e852-0904-49c5-b948-f8504d0ea7fb.png'
                }
              ]
            },
            steps: {
              show: true,
              items: [
                { id: 'arch-step-1', number: '01', title: 'Topography & Climate Analysis', text: 'Sun orientation, terrain contours, and panoramic vista alignment for optimal energy and views.' },
                { id: 'arch-step-2', number: '02', title: 'Volumetric Architectural Concept', text: 'Sculptural massing, exterior materials palette, and spatial zoning for master and service quarters.' },
                { id: 'arch-step-3', number: '03', title: 'Structural & Facade Engineering', text: 'Full engineering drawings, cantilevered terraces, floor-to-ceiling panoramic glass walls, and roof systems.' },
                { id: 'arch-step-4', number: '04', title: 'Builder Coordination', text: 'Full construction packages and technical coordination with general engineering teams.' }
              ]
            },
            closing: {
              show: true,
              heading: 'Discuss your architectural vision',
              paragraph: 'Meet with our principal architects to outline your residence or development.',
              buttonLabel: 'Discuss an architectural project',
              buttonLink: '/contacts'
            }
          },
          subcategories: []
        },
        {
          id: 'interiors',
          name: 'Interiors',
          slug: 'interiors',
          menuDescription: 'Rooms planned for daily use.',
          menuImage: '/website-assets/INTERIOR/INTERIOR%20MODERN/LIVING%20ROOM/A1.jpg',
          published: true,
          showInMenu: true,
          order: 2,
          page: {
            banner: {
              show: true,
              label: 'Services',
              title: 'Interiors',
              accent: 'by Unique Graphics®',
              subtitle: 'Haute couture residential interiors celebrating natural materials, layered lighting, and tactile warmth.',
              images: [
                '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png',
                '/website-assets/INTERIOR/INTERIOR%20MODERN/LIVING%20ROOM/A1.jpg',
                '/website-assets/INTERIOR/MODERN%20KITCHEN/a1.jpg'
              ]
            },
            intro: {
              show: true,
              heading: 'Layouts, finishes, and light for the rooms people actually live in.',
              paragraph1: 'The plan shows where you sit, where you store, and where the light falls at night.',
              paragraph2: ''
            },
            highlights: {
              show: true,
              items: [
                {
                  id: 'inter-hl-1',
                  title: 'Master Living Ensembles',
                  text: 'Curated spatial harmony, bespoke Italian marble, and custom acoustic ceiling integration.',
                  image: '/website-assets/INTERIOR/INTERIOR%20MODERN/LIVING%20ROOM/A1.jpg'
                },
                {
                  id: 'inter-hl-2',
                  title: 'Haute Cuisine Culinary Suites',
                  text: 'Precision engineered kitchen architectures with seamless appliance integration.',
                  image: '/website-assets/INTERIOR/MODERN%20KITCHEN/a1.jpg'
                },
                {
                  id: 'inter-hl-3',
                  title: 'Neo-Classic Sanctuaries',
                  text: 'Timeless architectural detailing, layered ambient lighting, and bespoke joinery.',
                  image: '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png'
                }
              ]
            },
            steps: {
              show: true,
              items: [
                { id: 'int-step-1', number: '01', title: 'Ergonomic Space Planning', text: 'Optimal flow, private zoning, and spatial proportions tailored to your daily lifestyle.' },
                { id: 'int-step-2', number: '02', title: 'Photorealistic 3D Concept', text: 'Detailed CGI renders illustrating marble selections, custom wood veneers, and bespoke brass accents.' },
                { id: 'int-step-3', number: '03', title: 'Technical Drawings Package', text: 'Full architectural drawing sets for electrical switches, plumbing, tile layouts, and bespoke cabinetry.' },
                { id: 'int-step-4', number: '04', title: 'Final Styling & Dressing', text: 'Curating art pieces, sculptural accessories, rugs, and custom window treatments for move-in perfection.' }
              ]
            },
            closing: {
              show: true,
              heading: 'Transform your living spaces',
              paragraph: 'Book a design consultation with our interior directors.',
              buttonLabel: 'Discuss an interior project',
              buttonLink: '/contacts'
            }
          },
          subcategories: [
            {
              id: 'villas',
              name: 'Villas',
              slug: 'villas',
              menuDescription: 'Palatial private estates uniting double-height neoclassical atriums and bookmatched Italian marble.',
              menuImage: '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png',
              published: true,
              order: 0,
              page: {
                banner: {
                  show: true,
                  label: 'Services',
                  title: 'Monumental Private Villas',
                  accent: 'by Unique Graphics®',
                  subtitle: 'Palatial private estates uniting double-height neoclassical atriums, bookmatched Italian marble, and biophilic garden colonnades.',
                  images: [
                    '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png',
                    '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V2.png',
                    '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/Luxurious%20neoclassical%20atrium%20with%20marble%20and%20greenery-1.png'
                  ]
                },
                intro: {
                  show: true,
                  heading: 'Enduring residential monuments crafted for multigenerational sanctuary and quiet grandeur.',
                  paragraph1: 'A truly magnificent villa asserts authority through timeless classical geometry, soaring vertical double-height volumes, and noble raw materials. We compose sweeping grand salons featuring coffered acoustic ceilings, skylit central atriums, and private garden porticos.',
                  paragraph2: 'Engineered drawings, photorealistic 3D visual sets, and turnkey white-glove site delivery by Unique Graphics.'
                },
                highlights: {
                  show: true,
                  items: [
                    { id: 'v-hl-1', title: 'Double-Height Neoclassical Atriums', text: 'Monumental fluted pilasters, handcrafted brass balustrades, and expansive skylights flooding polished marble in sunlight.', image: '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/Luminous%20Neoclassical%20Atrium%20Residence-4.png' },
                    { id: 'v-hl-2', title: 'Bookmatched Italian Calacatta Marble', text: 'Hand-selected continuous stone veins stretching from grand arrival staircases to bespoke formal salon fireplaces.', image: '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/Opulent%20neoclassical%20atrium%20with%20marble%20elegance-3.png' },
                    { id: 'v-hl-3', title: 'Handcrafted Millwork & Concealed Storage', text: 'Custom Italian walnut joinery and lacquered ivory wall compositions integrating concealed service doors.', image: '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/Luminous%20neoclassical%20atrium%20residence-2.png' }
                  ]
                },
                steps: {
                  show: true,
                  items: [
                    { id: 'v-s1', number: '01', title: 'Spatial & Orientation Zoning', text: 'Aligning light axes, carriage gates, and scenic garden vistas.' },
                    { id: 'v-s2', number: '02', title: 'Photorealistic 3D Concept', text: 'Experiencing every room, marble finish, and ceiling coffer in photorealistic CGI.' },
                    { id: 'v-s3', number: '03', title: 'Atelier Stone & Timber Sourcing', text: 'Direct import of Italian marble blocks, bespoke joinery, and bronze hardware.' },
                    { id: 'v-s4', number: '04', title: 'Turnkey Handover & Dressing', text: 'Millimeter-precise installation, acoustic tuning, and white-glove handover.' }
                  ]
                },
                gallery: {
                  show: true,
                  items: [
                    { id: 'v-gal-1', image: '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png', caption: 'Grand Neoclassical Villa Atrium with Double-Height Glass Dome' },
                    { id: 'v-gal-2', image: '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V2.png', caption: 'Luminous Reception Foyer with Polished Marble & Sculptural Foliage' },
                    { id: 'v-gal-3', image: '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/Luxurious%20neoclassical%20atrium%20with%20marble%20and%20greenery-1.png', caption: 'Formal Living Portico with Classical Molding & Gold Accents' },
                    { id: 'v-gal-4', image: '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/Luminous%20Neoclassical%20Atrium%20Residence-4.png', caption: 'Upper Balcony Colonnade Overlooking Central Courtyard' }
                  ]
                },
                closing: {
                  show: true,
                  heading: 'Transform your vision into a monumental private villa estate.',
                  paragraph: 'Schedule a confidential design consultation with our principal residential architects.',
                  buttonLabel: 'Discuss a Villa Project',
                  buttonLink: '/contacts'
                }
              }
            },
            { id: 'private-houses', name: 'Private houses', slug: 'private-houses', menuDescription: 'Contemporary residential architecture harmonizing raw stone and heated glass facades.', menuImage: '/website-assets/architecture/contemporary%20exterior%20house%20design%20NOORPUR%20BIJNOR/3ac8827f-63ec-4a62-8155-07e8ef834097.png', published: true, order: 1 },
            { id: 'residences', name: 'Residences', slug: 'residences', menuDescription: 'Curated spatial harmony, bespoke Italian marble, and tactile walnut joinery.', menuImage: '/website-assets/INTERIOR/INTERIOR%20MODERN/LIVING%20ROOM/A1.jpg', published: true, order: 2 },
            { id: 'penthouses', name: 'Penthouses', slug: 'penthouses', menuDescription: 'Ultra-luxury high-rise residences with panoramic glass horizons and cantilevered sky decks.', menuImage: '/website-assets/architecture/AL%20REHMAN%20TOWER%20KOLKATA/7e4f4312-846d-4e35-9f2b-af632b7dfc0a.png', published: true, order: 3 },
            { id: 'apartments', name: 'Apartments', slug: 'apartments', menuDescription: 'Precision architectural space planning, seamless appliance walls, and artisanal marble kitchens.', menuImage: '/website-assets/INTERIOR/MODERN%20KITCHEN/a1.jpg', published: true, order: 4 }
          ]
        },
        {
          id: 'for-business',
          name: 'For business',
          slug: 'for-business',
          menuDescription: 'Interiors for guests and for staff.',
          menuImage: '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/2a52ad1e-4050-4783-b269-36dcd2bb72b0.png',
          published: true,
          showInMenu: true,
          order: 3,
          page: {
            banner: {
              show: true,
              label: 'Services',
              title: 'Commercial Interiors',
              accent: 'by Unique Graphics®',
              subtitle: 'Monumental hospitality, flagship retail, and executive business spaces that inspire admiration.',
              images: [
                '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/129a7d57-c895-4ecc-a079-cbc6aa3c7308.png',
                '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/2a52ad1e-4050-4783-b269-36dcd2bb72b0.png',
                '/website-assets/architecture/The%20Romania%20-%20Luxury%20Wedding%20Spaces%20BANQUET%20HALL/Sunlit%20Luxury%20Banquet%20Hall-1.png'
              ]
            },
            intro: {
              show: true,
              heading: 'Lounges, dining rooms, and hospitality venues with service pathways kept discreetly out of sight.',
              paragraph1: 'The space has to work efficiently on a busy evening and still feel serene and cinematic for patrons.',
              paragraph2: ''
            },
            highlights: {
              show: true,
              items: [
                {
                  id: 'biz-hl-1',
                  title: 'Nightclubs & Themed Lounges',
                  text: 'High-energy hospitality architecture, engineered acoustics, and scene-based evening lighting.',
                  image: '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/129a7d57-c895-4ecc-a079-cbc6aa3c7308.png'
                },
                {
                  id: 'biz-hl-2',
                  title: 'Grand Banquet Halls & Resorts',
                  text: 'Monumental event spaces and destination hospitality resorts designed for unforgettable experiences.',
                  image: '/website-assets/architecture/The%20Romania%20-%20Luxury%20Wedding%20Spaces%20BANQUET%20HALL/Sunlit%20Luxury%20Banquet%20Hall-1.png'
                },
                {
                  id: 'biz-hl-3',
                  title: 'Signature Dining & Bars',
                  text: 'Luxury restaurant interiors balancing guest circulation and discreet service pathways.',
                  image: '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/2a52ad1e-4050-4783-b269-36dcd2bb72b0.png'
                }
              ]
            },
            steps: {
              show: true,
              items: [
                { id: 'biz-step-1', number: '01', title: 'Brand Identity & Flow Strategy', text: 'Aligning architectural layout with guest psychology, guest zoning, and secluded service corridors.' },
                { id: 'biz-step-2', number: '02', title: 'Hospitality Lighting & Acoustics', text: 'Engineered acoustic ceiling treatments and scene-based evening lighting design.' },
                { id: 'biz-step-3', number: '03', title: 'Commercial Grade FF&E', text: 'High-traffic certified textiles, bespoke joinery, and durable marble surfaces meeting luxury hospitality standards.' },
                { id: 'biz-step-4', number: '04', title: 'Opening Readiness & Handover', text: 'Coordination with operations teams, kitchen consultants, and local municipal authorities.' }
              ]
            },
            closing: {
              show: true,
              heading: 'Elevate your commercial enterprise',
              paragraph: 'Consult with our commercial studio on concepts, timelines, and budgets.',
              buttonLabel: 'Discuss a commercial project',
              buttonLink: '/contacts'
            }
          },
          subcategories: [
            { id: 'hotels', name: 'Hotels', slug: 'hotels', menuDescription: '5-star boutique resorts and luxury hotel architectures.', menuImage: '/website-assets/commercial%20interior/VECTERRACE%20HOTEL%20DANCE%20BAR%20KOLKATA/V.jpg', published: true, order: 0 },
            { id: 'restaurants', name: 'Restaurants', slug: 'restaurants', menuDescription: 'Signature fine dining environments with choreographed guest flow.', menuImage: '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/2a52ad1e-4050-4783-b269-36dcd2bb72b0.png', published: true, order: 1 },
            { id: 'resorts', name: 'Resorts', slug: 'resorts', menuDescription: 'Destination hospitality escapes tailored for rest and grandeur.', menuImage: '/website-assets/commercial%20interior/RYDHUM%20HOTEL%20&%20BANQUET%20HALL%20FIROZEPURE%20PUNJAB/BANQUET%20HALL/2e5bdd4a-8ef9-4ec8-9ddf-4715a6dea97f.png', published: true, order: 2 },
            { id: 'offices', name: 'Offices', slug: 'offices', menuDescription: 'Corporate headquarters and high-performance executive suites.', menuImage: '/website-assets/architecture/AL%20REHMAN%20TOWER%20KOLKATA/7e4f4312-846d-4e35-9f2b-af632b7dfc0a.png', published: true, order: 3 },
            { id: 'spa-and-wellness', name: 'Spa & Wellness', slug: 'spa-and-wellness', menuDescription: 'Tranquil hydrotherapy sanctuaries crafted in marble and natural light.', menuImage: '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png', published: true, order: 4 },
            { id: 'common-areas', name: 'Common areas', slug: 'common-areas', menuDescription: 'Grand lobbies, public atriums, and curated arrival gateways.', menuImage: '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg', published: true, order: 5 },
            {
              id: 'bars',
              name: 'Bars',
              slug: 'bars',
              menuDescription: 'High-energy nightlife lounges, scene lighting & bespoke cocktail bars.',
              menuImage: '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/129a7d57-c895-4ecc-a079-cbc6aa3c7308.png',
              published: true,
              order: 6,
              page: {
                banner: {
                  show: true,
                  label: 'Services',
                  title: 'Bars & High-Energy Lounges',
                  accent: 'by Unique Graphics®',
                  subtitle: 'Atmospheric nightlife architecture uniting bespoke illuminated onyx bars, precision acoustic baffling, and choreographed DMX scene lighting.',
                  images: [
                    '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/129a7d57-c895-4ecc-a079-cbc6aa3c7308.png',
                    '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/2a52ad1e-4050-4783-b269-36dcd2bb72b0.png',
                    '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/5bc6357d-ec0e-4160-84da-758f3ed7101c.png'
                  ]
                },
                intro: {
                  show: true,
                  heading: 'Sensory evening architecture orchestrating sound, light, and guest circulation.',
                  paragraph1: 'Designing a premier nightclub or high-concept cocktail lounge requires an uncompromising balance of sensory drama and behind-the-scenes efficiency. We engineer decoupled acoustic wall assemblies that control deep bass frequencies without bleeding into adjacent structures.',
                  paragraph2: 'Bartender speed wells, ice wells, and restock pathways are designed with ergonomic millimeter precision to maximize drink output during peak midnight rushes.'
                },
                highlights: {
                  show: true,
                  items: [
                    { id: 'b-hl-1', title: 'Acoustic Sound Isolation & Bass Tuning', text: 'Micro-perforated acoustic timber wall systems and vibration dampening ensure concert-grade sonic clarity.', image: '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/9cda9917-cca3-4b91-9321-ae7ef239937a.png' },
                    { id: 'b-hl-2', title: 'Choreographed DMX Scene Illumination', text: 'Intelligent multi-zone lighting seamlessly transitions the venue from warm golden sunset lounge tones to midnight dynamic nightclub beats.', image: '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/3db23d90-a3d8-49cc-8219-0582bbc41890.png' },
                    { id: 'b-hl-3', title: 'Ergonomic Speed Bars & Service Conduits', text: 'Commercial grade stainless bar layouts with concealed plumbing, glasswashers, and discreet service corridors.', image: '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/a122555b-1e9c-4ae4-922e-8e0867866535.png' }
                  ]
                },
                steps: {
                  show: true,
                  items: [
                    { id: 'b-s1', number: '01', title: 'Flow & VIP Zoning', text: 'Zoning entry security airlocks, coat check, high-energy dancefloors, and secluded VIP booth enclaves.' },
                    { id: 'b-s2', number: '02', title: 'Acoustic & MEP Modeling', text: '3D BIM LOD 400 clash detection for heavy HVAC smoke evacuation and 3-phase sound distribution.' },
                    { id: 'b-s3', number: '03', title: 'High-Traffic Joinery & Stone', text: 'Direct procurement of fluted Italian marble, brushed brass footrails, and stain-resistant leather banquette upholstery.' },
                    { id: 'b-s4', number: '04', title: 'Commissioning & Sound Handover', text: 'Calibrating architectural luminaires, sound stage limits, and municipal compliance certificates prior to grand opening.' }
                  ]
                },
                gallery: {
                  show: true,
                  items: [
                    { id: 'b-gal-1', image: '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/129a7d57-c895-4ecc-a079-cbc6aa3c7308.png', caption: 'Pushpa Fire Dance Bar - Grand Lounge & VIP Stage' },
                    { id: 'b-gal-2', image: '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/2a52ad1e-4050-4783-b269-36dcd2bb72b0.png', caption: 'Teetro Dance Bar - Sculptural Kinetic Ceiling Chandelier' },
                    { id: 'b-gal-3', image: '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/5bc6357d-ec0e-4160-84da-758f3ed7101c.png', caption: 'Illuminated Acrylic & Onyx Bar Counter Ensemble' },
                    { id: 'b-gal-4', image: '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/df20aafa-5ac4-4e54-8929-980e5f747e7b.png', caption: 'Deep Tufted Chesterfield VIP Seating Enclave' }
                  ]
                },
                closing: {
                  show: true,
                  heading: 'Ready to create an iconic bar or nightclub destination?',
                  paragraph: 'Consult with our principal commercial architects on acoustic schematics, mood boards, and complete turnkey delivery.',
                  buttonLabel: 'Discuss a Bar Project',
                  buttonLink: '/contacts'
                }
              }
            },
            { id: 'bars-and-night-clubs', name: 'Bars & Night Clubs', slug: 'bars-and-night-clubs', menuDescription: 'High-energy nightlife lounges, scene lighting & bespoke cocktail bars.', menuImage: '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/129a7d57-c895-4ecc-a079-cbc6aa3c7308.png', published: true, order: 7 },
            { id: 'banquet-halls', name: 'Banquet Halls', slug: 'banquet-halls', menuDescription: 'Monumental celebration halls with soaring architectural arches.', menuImage: '/website-assets/architecture/The%20Romania%20-%20Luxury%20Wedding%20Spaces%20BANQUET%20HALL/Sunlit%20Luxury%20Banquet%20Hall-1.png', published: true, order: 8 },
            { id: 'retail-showrooms', name: 'Retail Showrooms', slug: 'retail-showrooms', menuDescription: 'Flagship automotive and haute-couture luxury gallery experiences.', menuImage: '/website-assets/architecture/AUTOMOTIVE%20GALLERY/9ea0e852-0904-49c5-b948-f8504d0ea7fb.png', published: true, order: 9 }
          ]
        },
        {
          id: 'astro-vastu',
          name: 'Astro Vastu',
          slug: 'astro-vastu',
          menuDescription: 'Sacred energy alignment, planetary harmony & scientific Vastu architecture.',
          menuImage: '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png',
          published: true,
          showInMenu: true,
          order: 4,
          page: {
            banner: {
              show: true,
              label: 'Services',
              title: 'Astro Vastu Design',
              accent: 'by Unique Graphics®',
              subtitle: 'Holistic Spatial Energy, Vedic Harmony & Planetary Alignment',
              images: [
                '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png',
                '/website-assets/INTERIOR/INTERIOR%20MODERN/LIVING%20ROOM/A1.jpg',
                '/website-assets/architecture/The%20Romania%20-%20Luxury%20Wedding%20Spaces%20BANQUET%20HALL/Sunlit%20Luxury%20Banquet%20Hall-1.png'
              ]
            },
            intro: {
              show: true,
              heading: 'Harmonizing sacred cosmic geometry with cutting-edge architectural luxury.',
              paragraph1: 'Our Astro Vastu methodology synchronizes elemental forces with planetary astrological coordinates, ensuring your residence or commercial enterprise attracts prosperity, balance, and perpetual vitality.',
              paragraph2: ''
            },
            highlights: {
              show: true,
              items: [
                {
                  id: 'astro-hl-1',
                  title: 'Energy & Planetary Alignment',
                  text: 'Analyzing property orientation, directional axes, and cosmic energy flow.',
                  image: '/website-assets/INTERIOR/NEO%20CLASSIC%20VILLA%20INTERIOR%20BIJNOR/V.png'
                },
                {
                  id: 'astro-hl-2',
                  title: 'Vastu Purusha Grid Architecture',
                  text: 'Allocating functions, entry thresholds, and power centers to optimal planetary zones.',
                  image: '/website-assets/architecture/The%20Romania%20-%20Luxury%20Wedding%20Spaces%20BANQUET%20HALL/Golden%20Arch%20Banquet%20Hall%20at%20Night-6.png'
                }
              ]
            },
            steps: {
              show: true,
              items: [
                { id: 'astro-step-1', number: '01', title: 'Energy & Astrological Charting', text: 'Analyzing property orientation, directional axes, and astrological coordinates.' },
                { id: 'astro-step-2', number: '02', title: 'Vastu Purusha Grid Planning', text: 'Allocating functions, entry thresholds, and power zones.' },
                { id: 'astro-step-3', number: '03', title: 'Material & Color Frequency Harmony', text: 'Integrating stone, metals, and chromatic balance.' },
                { id: 'astro-step-4', number: '04', title: 'Cosmic Energy Consecration', text: 'Final environmental audit and spatial fine-tuning.' }
              ]
            },
            closing: {
              show: true,
              heading: 'Harmonize your environment',
              paragraph: 'Speak with our senior Astro Vastu architect to review your estate plan.',
              buttonLabel: 'Discuss an Astro Vastu project',
              buttonLink: '/contacts'
            }
          },
          subcategories: []
        }
      ]

      await Setting.findOneAndUpdate(
        { key: 'services_pages_config' },
        { value: { categories: cleanCategories } },
        { upsert: true, new: true }
      )
      console.log('[Project & Services Seeder]: Synced clean, real luxury services into services_pages_config in MongoDB!')
    }

    // Also sync homepage_completed_projects_config so homepage displays all projects & categories
    const completedProjectsSetting = await Setting.findOne({ key: 'homepage_completed_projects_config' })
    const prevCompleted = completedProjectsSetting ? completedProjectsSetting.value : {}
    const hasOldDummy = Array.isArray(prevCompleted?.projects) && prevCompleted.projects.some((p) => p.id === 'day-living' || p.id === 'quiet-bedroom' || (p.image && p.image.includes('/assets/')))
    const hasEnoughProjects = Array.isArray(prevCompleted?.projects) && prevCompleted.projects.length >= 70 && !hasOldDummy

    if (!hasEnoughProjects && fs.existsSync(jsonPath)) {
      const raw = fs.readFileSync(jsonPath, 'utf8')
      const data = JSON.parse(raw)
      const allProjects = [
        ...(data.architectural || []),
        ...(data.commercial || []),
        ...(data.interior || [])
      ]

      const mappedProjects = allProjects.map((p) => {
        let cat = 'commercial'
        const type = (p.type || '').toLowerCase()
        const title = (p.titlePre || p.id || '').toLowerCase()
        if (type.includes('banquet') || title.includes('banquet')) cat = 'banquet'
        else if (type.includes('bar') || type.includes('club') || title.includes('bar') || title.includes('club')) cat = 'bars-clubs'
        else if (type.includes('office') || title.includes('office')) cat = 'office'
        else if (type.includes('tower') || type.includes('landmark') || type.includes('campus') || type.includes('facade') || p.id.startsWith('arch-')) cat = 'architecture'
        else if (type.includes('interior') || type.includes('living') || type.includes('suite') || p.id.startsWith('interior-')) cat = 'interior'

        return {
          id: p.id,
          cat,
          image: p.image,
          video: p.video || null,
          gallery: p.gallery || [],
          en: {
            category: p.type || 'Bespoke Design',
            title: p.titlePre || p.id,
            summary: (p.location ? p.location + ' • ' : '') + (p.area || '1 200 m²'),
            scope: ['Architectural Design', 'Interior Architecture', '3D Visualization'],
            detail: p.description || 'Bespoke project crafted by Unique Graphics®.'
          },
          ru: {
            category: p.type || 'Проект',
            title: p.titlePre || p.id,
            summary: (p.location ? p.location + ' • ' : '') + (p.area || '1 200 m²'),
            scope: ['Архитектура', 'Интерьер', '3D визуализация'],
            detail: p.description || 'Проект студии Unique Graphics®.'
          }
        }
      })

      const updatedCompletedConfig = {
        copy: prevCompleted.copy || {
          en: { lead: 'More than', count: '650', tail: 'completed projects' },
          ru: { lead: 'Более', count: '650', tail: 'реализованных проектов' }
        },
        categories: {
          en: [
            ['all', 'All'],
            ['architecture', 'Architecture'],
            ['commercial', 'Commercial'],
            ['banquet', 'Banquet Halls'],
            ['bars-clubs', 'Bars & Clubs'],
            ['interior', 'Luxury Interior'],
            ['office', 'Office']
          ],
          ru: [
            ['all', 'Все'],
            ['architecture', 'Архитектура'],
            ['commercial', 'Коммерческие'],
            ['banquet', 'Банкетные залы'],
            ['bars-clubs', 'Бары и Клубы'],
            ['interior', 'Интерьеры'],
            ['office', 'Офис']
          ]
        },
        projects: mappedProjects
      }

      await Setting.findOneAndUpdate(
        { key: 'homepage_completed_projects_config' },
        { value: updatedCompletedConfig },
        { upsert: true, new: true }
      )
      console.log(`[Project Seeder]: Synced ${mappedProjects.length} projects into homepage_completed_projects_config in MongoDB!`)
    }

    // Also sync hero settings if set to old /video/4.mp4
    const heroSetting = await Setting.findOne({ key: 'homepage_hero_config' })
    if (heroSetting && (!heroSetting.value?.mediaUrl || heroSetting.value.mediaUrl.includes('/video/') || heroSetting.value.mediaUrl.startsWith('cycle:'))) {
      await Setting.findOneAndUpdate(
        { key: 'homepage_hero_config' },
        {
          $set: {
            'value.mediaUrl': DEFAULT_REAL_HERO_VIDEO,
            'value.videoPresets': [
              { name: 'Greenwood Avenue (Default)', url: DEFAULT_REAL_HERO_VIDEO },
              { name: 'Teetro Bar & Restaurant Mohali', url: '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/TETTRO%20MOHALI.mp4' },
              { name: 'G S Street Market Walkthrough', url: '/website-assets/architecture/G%20S%20STREET%20MARKET/G%20S%20STREET.mp4' },
              { name: 'Pushpa The Fire Dance Bar', url: '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/PUSHPA%20THE%20FIRE.mp4' },
            ]
          }
        }
      )
      console.log('[Project Seeder]: Synced real hero video in MongoDB!')
    }

    // Also sync brand recognition video if set to old stock asset
    const brandSetting = await Setting.findOne({ key: 'homepage_brand_sections_config' })
    if (brandSetting && (!brandSetting.value?.recognition?.mediaUrl || brandSetting.value.recognition.mediaUrl.includes('/assets/Product') || brandSetting.value.recognition.mediaUrl.includes('11593543') || brandSetting.value.recognition.mediaUrl.includes('/video/'))) {
      await Setting.findOneAndUpdate(
        { key: 'homepage_brand_sections_config' },
        {
          $set: {
            'value.recognition.mediaUrl': '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/TETTRO%20MOHALI.mp4'
          }
        }
      )
      console.log('[Project Seeder]: Synced real recognition video in MongoDB!')
    }
  } catch (err) {
    console.error('[Project & Services Seeder Error]:', err.message)
  }
}


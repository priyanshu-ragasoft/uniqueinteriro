import Blog from '../models/Blog.js'
import Setting from '../models/Setting.js'

export const INITIAL_BLOG_POSTS = [
  {
    slug: 'monumental-desert-villas',
    category: 'Architecture',
    tag: 'Cover Story',
    date: 'October 12, 2026',
    readTime: '6 min read',
    title: 'The Spatial Poetry of Monumental Villas: Blending Desert Rock and Floating Bronze',
    excerpt:
      'How our studio crafts cantilevered architectural marvels that celebrate dramatic desert topography while insulating against extreme thermal shifts through monolithic stone and smart aero-façades.',
    image: '/architectural/dubai_villa.jpg',
    author: 'Unique Graphics Architectural Board',
    published: true,
    featured: true,
    views: 1420,
    content: [
      {
        type: 'paragraph',
        text: 'Monumental architecture in arid climates demands an uncompromising dialogue between elemental forces and human sanctuary. When designing private residences across the Emirates and Palm Jumeirah, our approach transcends decorative luxury—it operates as an engineering masterwork anchored directly into natural bedrock.',
      },
      {
        type: 'quote',
        text: 'True architectural grandeur does not impose itself upon the landscape; it emerges from the earth as if geological time had sculpted it into bronze and travertine.',
      },
      {
        type: 'heading',
        text: 'Thermal Mass Meets Cantilevered Defiance',
      },
      {
        type: 'paragraph',
        text: 'By pairing 1200mm monolithic Portuguese travertine slabs with triple-glazed aerodynamic structural glass, we establish an interior microclimate that reduces active cooling dependency by 38%. Overhanging bronze eaves cast sweeping geometrical shadows across cascading infinity water features, creating atmospheric cooling currents throughout open-air colonnades.',
      },
    ],
  },
  {
    slug: 'neo-monaco-penthouse',
    category: 'Interior Design',
    tag: 'Haute Interiors',
    date: 'October 08, 2026',
    readTime: '5 min read',
    title: 'The Neo-Monaco Aesthetic: Penthouse Interiors Defined by Liquid Bronze & Onyx',
    excerpt:
      'An intimate breakdown of acoustic dampening, concealed climate diffusion, and bespoke backlit onyx installations in the Côte d’Azur’s most prestigious sky residences.',
    image: '/interior/monaco.jpg',
    author: 'Elena Rostova, Principal Interior Lead',
    published: true,
    featured: false,
    views: 980,
    content: [
      {
        type: 'paragraph',
        text: 'In high-altitude coastal penthouses, light is both a blessing and a relentless challenge. The glare of the Mediterranean noon must be subdued into velvety, tactile warmth without compromising panoramic horizon vistas.',
      },
      {
        type: 'quote',
        text: 'Liquid metal coatings, brushed smoked bronze, and bookmatched backlit Iranian white onyx turn living quarters into private galleries of sensory calm.',
      },
      {
        type: 'heading',
        text: 'Acoustic Engineering in Modern High-Rises',
      },
      {
        type: 'paragraph',
        text: 'We integrate micro-perforated acoustic timber wall paneling finished in matte Italian walnut, dampening reverberation times to an ultra-plush 0.4 seconds.',
      },
    ],
  },
  {
    slug: 'biophilic-hotel-atriums',
    category: 'Commercial',
    tag: 'Hospitality',
    date: 'September 28, 2026',
    readTime: '7 min read',
    title: 'Biophilic Grand Atriums: Reimagining 5-Star Hospitality for 2027',
    excerpt:
      'How 18-meter vertical water curtains, live ficus canopies, and sculpted brass lattices transform commercial hotel lobbies into world-renowned public sanctuaries.',
    image: '/commercial/atrium.jpg',
    author: 'Unique Graphics Commercial Practice',
    published: true,
    featured: false,
    views: 860,
    content: [
      {
        type: 'paragraph',
        text: 'The era of sterile, echo-prone hotel lobbies is definitively over. Today’s premier hotel guests seek immediate decompression from intense transit. Our commercial atrium designs establish an intoxicating sensory narrative from the precise millisecond of arrival.',
      },
      {
        type: 'quote',
        text: 'A great lobby is not merely a waiting lounge; it is an unforgettable civic threshold that commands awe and quiet reverence.',
      },
    ],
  },
  {
    slug: 'alpine-haute-courchevel',
    category: 'Architecture',
    tag: 'Alpine Luxury',
    date: 'September 20, 2026',
    readTime: '6 min read',
    title: 'Alpine Haute Living: Thermal Engineering Meets Raw Granite in Courchevel 1850',
    excerpt:
      'Balancing extreme snow load dynamics with triple-height panoramic heated glazing, charred Shou Sugi Ban timber, and indoor wellness spas cut into living mountainside rock.',
    image: '/architectural/courchevel_chalet.jpg',
    author: 'Marc Dubois, Alpine Projects Director',
    published: true,
    featured: false,
    views: 1140,
    content: [
      {
        type: 'paragraph',
        text: 'Designing in the French Alps requires reverence for nature’s untamed hostility. In Courchevel 1850, structural beams must support up to 600 kg/m² of heavy winter snow while sustaining immense expansive cantilevers.',
      },
      {
        type: 'quote',
        text: 'Heated glass systems prevent ice condensation, keeping panoramic vistas razor-sharp even during ferocious sub-zero alpine blizzards.',
      },
    ],
  },
  {
    slug: 'italian-bespoke-millwork',
    category: 'Interior Design',
    tag: 'Bespoke Craft',
    date: 'September 14, 2026',
    readTime: '5 min read',
    title: 'Italian Craftsmanship: Why Bespoke Joinery Defines Authentic Residential Luxury',
    excerpt:
      'Why catalog luxury furniture falls short in high-end architecture, and how our direct ateliers in Brianza fabricate custom bronze-inlaid millwork tailored to exact architectural geometry.',
    image: '/interior/beverly.jpg',
    author: 'Unique Graphics Procurement Division',
    published: true,
    featured: false,
    views: 740,
    content: [
      {
        type: 'paragraph',
        text: 'Every premier residence contains unique geometrical anomalies: subtle ceiling rake angles, specific sightlines toward exterior gardens, and individual storage ergonomics.',
      },
    ],
  },
  {
    slug: 'circadian-lighting-philosophy',
    category: 'Commercial',
    tag: 'Lighting Tech',
    date: 'August 30, 2026',
    readTime: '4 min read',
    title: 'Architectural Illuminance: The Invisible Fixture & Circadian Glow Philosophy',
    excerpt:
      'Transitioning luxury hospitality and private estates from harsh glare to biodynamic 1800K–4000K lighting scenarios tailored to biological rhythms.',
    image: '/commercial/tokyo.jpg',
    author: 'Kenji Takahashi, Lighting Architecture Specialist',
    published: true,
    featured: false,
    views: 690,
    content: [
      {
        type: 'paragraph',
        text: 'The best lighting in world-class architecture is that which you never explicitly see. By banishing visible bulbs and high-contrast glare points, spatial volumes are sculpted purely through light reflection and graduated wall grazing.',
      },
    ],
  },
  {
    slug: 'miami-biscayne-transitions',
    category: 'Interior Design',
    tag: 'Coastal Estates',
    date: 'August 22, 2026',
    readTime: '5 min read',
    title: 'Oceanfront Villa Living: Seamless Indoor-Outdoor Transitions in Biscayne Bay',
    excerpt:
      'Eliminating visual and physical thresholds through motorized pocketing glass doors, flush floor drainage, and marine-grade stainless bronze alloys.',
    image: '/interior/miami.jpg',
    author: 'Unique Graphics Residential Team',
    published: true,
    featured: false,
    views: 920,
    content: [
      {
        type: 'paragraph',
        text: 'In South Florida’s prime coastal sanctuaries, living rooms and pool terraces must merge into a single boundless entertainment arena.',
      },
    ],
  },
  {
    slug: 'sensory-spa-hydrotherapy',
    category: 'Commercial',
    tag: 'Wellness Design',
    date: 'August 10, 2026',
    readTime: '6 min read',
    title: 'Sensory Serenity: Acoustics, Natural Stone, and Hydro-Thermal Spatial Design',
    excerpt:
      'Crafting private thermal sanctuaries that harmonize volcanic basalt, salt inhalation rooms, and tranquil water acoustics for ultra-high-net-worth wellness.',
    image: '/commercial/spa_belgrade.jpg',
    author: 'Unique Graphics Wellness Studio',
    published: true,
    featured: false,
    views: 1350,
    content: [
      {
        type: 'paragraph',
        text: 'Wellness spatial design has shifted from clinical fitness rooms to deeply sacred sensory decompression temples. Stone selection is paramount: textured volcanic basalt provides tactile traction while retaining thermal energy.',
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

    const blogs = await Blog.find(query).sort({ createdAt: -1 })
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
    const setting = await Setting.findOne({ key: 'blog_banner_config' })
    const defaults = {
      badge: 'STUDIO JOURNAL & PUBLICATIONS',
      title: 'Architectural Insights & Design Discourse',
      subtitle:
        'Curated explorations into monumental architecture, rare materials, private residences, and visionary interior spatial philosophy crafted by the Unique Graphics studio.',
      newsletterTitle: 'Subscribe to Architectural Monograph Releases',
      newsletterSubtitle:
        'Receive private quarterly retrospectives, material sourcing guides, and invitations to our international design symposiums directly in your inbox.',
      mediaType: 'video',
      mediaUrl: '/video/1.mp4',
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
      mediaUrl: '/video/4.mp4',
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
 * @desc    Update Homepage Hero Banner Settings
 * @route   PUT /api/blogs/settings/hero
 * @access  Private (Admin)
 */
export const updateHomepageHeroSettings = async (req, res) => {
  try {
    const { title, subtitle, buttonText, buttonLink, mediaType, mediaUrl } = req.body
    const updated = await Setting.findOneAndUpdate(
      { key: 'homepage_hero_config' },
      {
        value: {
          title: title || 'Unique Graphics',
          subtitle: subtitle || 'Leading international bureau for premium architectural and interior design',
          buttonText: buttonText || 'Discuss your project',
          buttonLink: buttonLink || '/contacts',
          mediaType: mediaType || 'video',
          mediaUrl: mediaUrl || '/video/4.mp4',
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
    return res.status(200).json({
      success: true,
      data: setting ? setting.value : null,
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
    return res.status(200).json({
      success: true,
      data: setting ? setting.value : null,
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

import { useState, useMemo, useEffect } from 'react'
import { readBlogCategories, withoutStaticBlogs } from '../../data/blogCategories'
import { DEFAULT_BLOGS, getStoredBlogs, setStoredBlogs, sanitizeBlogItem } from '../../data/blogConfig'

export const BLOG_POSTS = DEFAULT_BLOGS

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [categories, setCategories] = useState(() => readBlogCategories())
  const [searchQuery, setSearchQuery] = useState('')
  const [activeArticle, setActiveArticle] = useState(null)
  const [emailSubscribed, setEmailSubscribed] = useState(false)
  const [emailInput, setEmailInput] = useState('')

  // Dynamic posts state with initial static or localStorage fallback
  const [posts, setPosts] = useState(() => getStoredBlogs())

  // Dynamic hero banner and page typography settings
  const [bannerConfig, setBannerConfig] = useState(() => {
    const defaultUrl =
      '/website-assets/architecture/SMART%20CITY%20SOCITY%20BANUR/WhatsApp%20Video%202025-07-03%20at%2019.14.48.mp4'
    try {
      const saved = localStorage.getItem('ug_blog_banner_config')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (
          parsed.mediaUrl &&
          !parsed.mediaUrl.includes('RYDHUM%20HOTEL') &&
          !parsed.mediaUrl.includes('dubai_villa') &&
          parsed.mediaUrl !== '/video/1.mp4'
        ) {
          return parsed
        }
      }
    } catch {}
    return {
      badge: 'STUDIO JOURNAL & PUBLICATIONS',
      title: 'Architectural Insights & Design Discourse',
      subtitle:
        'Curated explorations into monumental architecture, rare materials, private residences, and visionary interior spatial philosophy crafted by the Unique Graphics studio.',
      newsletterTitle: 'Subscribe to Architectural Monograph Releases',
      newsletterSubtitle:
        'Receive private quarterly retrospectives, material sourcing guides, and invitations to our international design symposiums directly in your inbox.',
      mediaType: 'video',
      mediaUrl: defaultUrl,
    }
  })

  // Synchronize with backend API on mount
  useEffect(() => {
    const fetchApiBlogs = async () => {
      try {
        const res = await fetch('/api/blogs?published=true')
        if (res.ok) {
          const json = await res.json()
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            const live = json.data
              .map((p, idx) => sanitizeBlogItem(p, idx))
              .sort((a, b) => {
                const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime()
                const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime()
                return bTime - aTime
              })
            setStoredBlogs(live)
            setPosts(live)
          }
        }
      } catch {
        // Backend offline, fallback remains active
      }
    }

    const fetchBannerSettings = async () => {
      try {
        const res = await fetch('/api/blogs/settings/banner')
        if (res.ok) {
          const json = await res.json()
          if (json.success && json.data) {
            setBannerConfig(json.data)
            localStorage.setItem('ug_blog_banner_config', JSON.stringify(json.data))
            if (Array.isArray(json.data.categories) && json.data.categories.length) {
              localStorage.setItem('ug_blog_categories', JSON.stringify(json.data.categories))
              setCategories(json.data.categories)
            }
          }
        }
      } catch {}
    }

    fetchApiBlogs()
    fetchBannerSettings()

    const refreshBlogs = () => setPosts(getStoredBlogs())
    const refreshCategories = () => setCategories(readBlogCategories())
    const refreshBanner = () => {
      try {
        const saved = localStorage.getItem('ug_blog_banner_config')
        if (saved) setBannerConfig(JSON.parse(saved))
      } catch {}
    }
    window.addEventListener('ug_blogs_updated', refreshBlogs)
    window.addEventListener('blog-categories-changed', refreshCategories)
    window.addEventListener('ug_blog_banner_updated', refreshBanner)
    return () => {
      window.removeEventListener('ug_blogs_updated', refreshBlogs)
      window.removeEventListener('blog-categories-changed', refreshCategories)
      window.removeEventListener('ug_blog_banner_updated', refreshBanner)
    }
  }, [])

  const featuredPost = posts.find((p) => p.featured) || posts[0] || null

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'All' || post.category.toLowerCase() === selectedCategory.toLowerCase()
      const matchesSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [posts, selectedCategory, searchQuery])

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (emailInput.trim()) {
      setEmailSubscribed(true)
      setEmailInput('')
    }
  }

  return (
    <main className="min-h-screen bg-[#101010] text-white pt-28 sm:pt-36 pb-24">
      {/* Top Hero Section with Dynamic Background Media (Image / Video) */}
      <section className="relative mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16 pt-12 sm:pt-16 pb-12 sm:pb-16 rounded-3xl overflow-hidden border border-white/10 mb-8 bg-[#141414]">
        {/* Dynamic Background Video or Image */}
        {bannerConfig.mediaType === 'video' && bannerConfig.mediaUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            key={bannerConfig.mediaUrl}
            className="absolute inset-0 h-full w-full object-cover opacity-60 filter brightness-90 contrast-105 saturate-105 scale-105 pointer-events-none transition-all duration-700"
            src={bannerConfig.mediaUrl}
          />
        ) : bannerConfig.mediaUrl && bannerConfig.mediaType !== 'none' ? (
          <img
            key={bannerConfig.mediaUrl}
            src={bannerConfig.mediaUrl}
            alt="Blog Banner Background"
            className="absolute inset-0 h-full w-full object-cover opacity-60 filter brightness-90 contrast-105 saturate-105 scale-105 pointer-events-none transition-all duration-700"
          />
        ) : null}

        {/* Cinematic Ambient Dark Gradients: preserves text legibility on left while keeping architectural motion vibrant */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/35 to-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/90 via-[#141414]/50 to-transparent pointer-events-none" />

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col items-start gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#e3943f]" />
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#e3943f] uppercase">
              {bannerConfig.badge || 'STUDIO JOURNAL & PUBLICATIONS'}
            </span>
          </div>

          <h1 className="text-[38px] sm:text-[56px] lg:text-[68px] font-normal leading-[1.05] tracking-[-0.03em] max-w-[22ch]">
            {bannerConfig.title || 'Architectural Insights & Design Discourse'}
          </h1>

          <p className="mt-2 max-w-[65ch] text-[15px] sm:text-[17px] leading-relaxed text-white/75 font-light">
            {bannerConfig.subtitle ||
              'Curated explorations into monumental architecture, rare materials, private residences, and visionary interior spatial philosophy crafted by the Unique Graphics studio.'}
          </p>
        </div>
      </section>

      {/* Filter Controls Bar */}
      <section className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="mt-10 flex flex-col md:flex-row md:items-center justify-between gap-5 border-y border-white/10 py-5">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {Array.from(new Set(['All', ...(categories || [])])).map((cat, catIdx) => {
              const isSelected = selectedCategory === cat
              const count =
                cat === 'All'
                  ? posts.length
                  : posts.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length

              return (
                <button
                  key={`${cat}-${catIdx}`}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#e3943f] text-black shadow-md shadow-[#e3943f]/25'
                      : 'border border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                      isSelected ? 'bg-black/20 text-black' : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-[320px]">
            <input
              type="text"
              placeholder="Search insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-white/10 bg-[#181818] px-4 py-2.5 pr-10 text-[13px] text-white placeholder-white/35 outline-none transition-colors hover:border-white/20 focus:border-[#e3943f]"
            />
            <svg
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>
      </section>

      {/* Featured Cover Story */}
      {!searchQuery && selectedCategory === 'All' && featuredPost && (
        <section className="mx-auto mt-10 max-w-[1440px] px-6 sm:px-10 lg:px-16">
          <div
            onClick={() => setActiveArticle(featuredPost)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#161616] transition-all duration-300 hover:border-[#e3943f]/60 hover:shadow-[0_0_40px_rgba(227,148,63,0.15)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Image / Video side */}
              <div className="relative h-[320px] sm:h-[420px] lg:col-span-7 lg:h-[500px] overflow-hidden bg-black/60">
                {featuredPost.image && (featuredPost.image.endsWith('.mp4') || featuredPost.image.includes('/video/') || featuredPost.image.startsWith('data:video')) ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    key={featuredPost.image}
                    src={featuredPost.image}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={featuredPost.image || '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg'}
                    alt={featuredPost.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:hidden" />
                <span className="absolute top-5 left-5 rounded-full bg-[#e3943f] px-3.5 py-1 text-[10px] font-bold tracking-[0.14em] text-black uppercase shadow-lg">
                  {featuredPost.tag || 'COVER STORY'}
                </span>
              </div>

              {/* Text side */}
              <div className="flex flex-col justify-between p-6 sm:p-10 lg:col-span-5 lg:p-12">
                <div>
                  <div className="flex items-center gap-3 text-[11px] font-medium tracking-wider text-white/50 uppercase">
                    <span className="text-[#e3943f]">{featuredPost.category}</span>
                    <span>•</span>
                    <span>{featuredPost.date}</span>
                    <span>•</span>
                    <span>{featuredPost.readTime}</span>
                  </div>

                  <h2 className="mt-4 text-[24px] sm:text-[30px] lg:text-[34px] font-normal leading-tight tracking-[-0.02em] text-white transition-colors group-hover:text-[#e3943f]">
                    {featuredPost.title}
                  </h2>

                  <p className="mt-4 text-[14px] sm:text-[15px] leading-relaxed text-white/70 line-clamp-4">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                  <div className="flex items-center gap-2 text-[12px] text-white/50">
                    <span className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px] text-[#e3943f]">
                      UG
                    </span>
                    <span>{featuredPost.author}</span>
                  </div>

                  <span className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.12em] text-[#e3943f] uppercase group-hover:underline">
                    Read Story
                    <svg
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="mx-auto mt-14 max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h2 className="text-[12px] font-bold tracking-[0.2em] text-white/50 uppercase">
            {selectedCategory === 'All' ? 'ALL PUBLICATIONS' : `${selectedCategory.toUpperCase()} ARTICLES`}
          </h2>
          <span className="text-[11px] font-mono text-white/40">
            {filteredPosts.length} ARTICLES FOUND
          </span>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-[18px] text-white/60">No articles match your criteria.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All')
                setSearchQuery('')
              }}
              className="mt-4 rounded-full bg-[#e3943f] px-6 py-2.5 text-[12px] font-bold tracking-wider text-black uppercase cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPosts.map((post, idx) => (
              <article
                key={post.id || post._id || post.slug || `post-${idx}`}
                onClick={() => setActiveArticle(post)}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#161616] transition-all duration-300 hover:border-[#e3943f]/50 hover:shadow-[0_0_30px_rgba(227,148,63,0.12)] cursor-pointer"
              >
                <div>
                  {/* Article Thumbnail */}
                  <div className="relative h-[240px] sm:h-[260px] overflow-hidden bg-black/40">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    <span className="absolute top-4 left-4 rounded-full bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 text-[10px] font-bold tracking-wider text-[#e3943f] uppercase">
                      {post.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-[11px] font-medium text-white/45 uppercase tracking-wider">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="mt-3 text-[19px] sm:text-[21px] font-normal leading-snug tracking-[-0.01em] text-white transition-colors group-hover:text-[#e3943f]">
                      {post.title}
                    </h3>

                    <p className="mt-3 text-[13.5px] leading-relaxed text-white/65 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer of Card */}
                <div className="px-6 pb-6 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[12px]">
                  <span className="text-white/40 text-[11px] line-clamp-1">{post.author}</span>
                  <span className="inline-flex items-center gap-1 font-bold text-[#e3943f] tracking-wider uppercase group-hover:translate-x-1 transition-transform">
                    <span>Read</span>
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* VIP Studio Journal Dispatch / Newsletter */}
      <section className="mx-auto mt-20 max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#1b1b1b] to-[#121212] p-8 sm:p-12 lg:p-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#e3943f]/10 blur-3xl pointer-events-none" />

          <div className="max-w-[700px]">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e3943f]" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#e3943f] uppercase">
                STUDIO DISPATCH
              </span>
            </div>

            <h2 className="mt-3 text-[28px] sm:text-[38px] font-normal tracking-[-0.02em] text-white">
              {bannerConfig.newsletterTitle || 'Subscribe to Architectural Monograph Releases'}
            </h2>

            <p className="mt-3 text-[14px] sm:text-[15px] leading-relaxed text-white/70">
              {bannerConfig.newsletterSubtitle ||
                'Receive private quarterly retrospectives, material sourcing guides, and invitations to our international design symposiums directly in your inbox.'}
            </p>

            {emailSubscribed ? (
              <div className="mt-6 rounded-xl border border-[#e3943f]/40 bg-[#e3943f]/10 px-5 py-4 text-[13px] font-semibold text-[#e3943f]">
                ✓ Thank you. You have been added to the Unique Graphics VIP Dispatch list.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="Enter your executive email address..."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="flex-1 rounded-xl border border-white/15 bg-black/50 px-5 py-3.5 text-[13px] text-white placeholder-white/40 outline-none transition-colors hover:border-white/30 focus:border-[#e3943f]"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#e3943f] to-[#d68532] px-8 py-3.5 text-[12px] font-bold tracking-[0.14em] text-black uppercase transition-all hover:brightness-105 active:scale-[0.99] cursor-pointer shadow-lg shadow-[#e3943f]/25"
                >
                  Join Dispatch
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Article Reading Modal */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6"
          onClick={() => setActiveArticle(null)}
        >
          <div
            className="relative flex flex-col max-h-[90vh] w-full max-w-[850px] overflow-hidden rounded-2xl border border-white/15 bg-[#141414] text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent="true"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#181818]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#e3943f] uppercase">
                  {activeArticle.category}
                </span>
                <span className="text-white/30">•</span>
                <span className="text-[11px] text-white/50">{activeArticle.readTime}</span>
              </div>

              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white cursor-pointer"
                aria-label="Close article"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div
              className="flex-1 overflow-y-auto px-6 sm:px-10 py-6 space-y-6 custom-scrollbar"
              data-lenis-prevent="true"
            >
              {/* Article Hero Banner */}
              <div className="relative h-[280px] sm:h-[360px] overflow-hidden rounded-xl">
                <img
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-[11px] font-bold tracking-wider text-[#e3943f] uppercase">
                    {activeArticle.date}
                  </p>
                  <h2 className="text-[22px] sm:text-[28px] font-normal leading-snug text-white">
                    {activeArticle.title}
                  </h2>
                </div>
              </div>

              {/* Author & Excerpt */}
              <div className="border-l-2 border-[#e3943f] pl-4 py-1">
                <p className="text-[12px] font-semibold text-white/50 uppercase tracking-wider">
                  By {activeArticle.author}
                </p>
                <p className="mt-2 text-[15px] font-medium leading-relaxed text-white/80 italic">
                  "{activeArticle.excerpt}"
                </p>
              </div>

              {/* Full Article Content */}
              <div className="space-y-5 text-[15px] leading-relaxed text-white/75">
                {(Array.isArray(activeArticle.content)
                  ? activeArticle.content
                  : typeof activeArticle.content === 'string'
                  ? activeArticle.content.split('\n\n').map((p) => ({ type: 'paragraph', text: p }))
                  : [{ type: 'paragraph', text: activeArticle.excerpt }]
                ).map((block, idx) => {
                  if (block.type === 'heading') {
                    return (
                      <h3
                        key={idx}
                        className="pt-3 text-[18px] sm:text-[20px] font-medium text-white tracking-tight"
                      >
                        {block.text}
                      </h3>
                    )
                  }
                  if (block.type === 'quote') {
                    return (
                      <blockquote
                        key={idx}
                        className="rounded-xl border border-[#e3943f]/30 bg-[#e3943f]/5 p-5 text-[15px] italic text-[#f0ba7b]"
                      >
                        {block.text}
                      </blockquote>
                    )
                  }
                  return <p key={idx}>{block.text}</p>
                })}
              </div>

              {/* CTA at Bottom of Modal */}
              <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
                <p className="text-[12px] font-bold tracking-widest text-[#e3943f] uppercase">
                  READY TO DISCUSS A MONUMENTAL PROJECT?
                </p>
                <p className="mt-2 text-[14px] text-white/70">
                  Connect with our architectural directors to realize your vision.
                </p>
                <a
                  href="/contacts"
                  className="mt-4 inline-block rounded-full bg-[#e3943f] px-6 py-2.5 text-[12px] font-bold tracking-wider text-black uppercase hover:bg-[#d68532] transition-colors"
                >
                  Contact The Studio
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

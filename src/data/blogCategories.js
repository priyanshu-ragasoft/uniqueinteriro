export const DEFAULT_BLOG_CATEGORIES = ['Architecture', 'Interior Design', 'Commercial', 'Residential', 'Philosophy']

export function withoutStaticBlogs(list) {
  if (!Array.isArray(list)) return []
  return list.filter((post) => post && (post.title || post.id || post.slug))
}

export function readBlogCategories() {
  try {
    const raw = localStorage.getItem('ug_blog_categories')
    const parsed = raw ? JSON.parse(raw) : null
    if (Array.isArray(parsed) && parsed.length) return parsed.filter(Boolean)
  } catch { }
  return DEFAULT_BLOG_CATEGORIES
}

export function writeBlogCategories(list) {
  const next = [...new Set(list.map((name) => String(name || '').trim()).filter(Boolean))]
  localStorage.setItem('ug_blog_categories', JSON.stringify(next))
  window.dispatchEvent(new Event('blog-categories-changed'))
  return next
}

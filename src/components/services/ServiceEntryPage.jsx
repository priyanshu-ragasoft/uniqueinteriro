import { useEffect, useState } from 'react'
import {
  findServicePage,
  findServiceStory,
  getStoredServiceTree,
  setStoredServiceTree,
} from '../../data/serviceTree'
import NotFoundPage from '../NotFoundPage'
import ServiceHubPage from './ServiceHubPage'
import ServicePage from './ServicePage'
import ServiceStoryPage from './ServiceStoryPage'

export default function ServiceEntryPage({
  categorySlug,
  subcategorySlug = '',
  storySlug = '',
}) {
  const [tree, setTree] = useState(() => getStoredServiceTree())
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const apply = () => setTree(getStoredServiceTree())
    window.addEventListener('services-pages-config-changed', apply)
    fetch('/api/blogs/settings/services-pages')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data?.categories) && data.data.categories.length) {
          setStoredServiceTree({ categories: data.data.categories })
          setTree(getStoredServiceTree())
        }
      })
      .catch(() => {})
      .finally(() => setHydrated(true))
    return () => window.removeEventListener('services-pages-config-changed', apply)
  }, [])

  const category = String(categorySlug || '').trim()
  const sub = String(subcategorySlug || '').trim()
  const story = String(storySlug || '').trim()

  if (story) {
    return <ServiceStoryPage categorySlug={category} subcategorySlug={sub} storySlug={story} />
  }

  if (!category || category === 'all-services') {
    if (!sub) return <ServiceHubPage />
    return <ServiceStoryPage categorySlug="all-services" subcategorySlug="" storySlug={sub} />
  }

  if (!sub) {
    const catPage = findServicePage(tree, category, '')
    if (catPage) return <ServicePage categorySlug={category} subcategorySlug="" />
    const hubStory = findServiceStory(tree, 'all-services', '', category)
    if (hubStory) {
      return <ServiceStoryPage categorySlug="all-services" subcategorySlug="" storySlug={category} />
    }
    if (!hydrated) return <main className="min-h-screen bg-[#111111]" />
    return <ServicePage categorySlug={category} subcategorySlug="" />
  }

  const subPage = findServicePage(tree, category, sub)
  if (subPage) {
    return <ServicePage categorySlug={category} subcategorySlug={sub} />
  }

  const categoryStory = findServiceStory(tree, category, '', sub)
  if (categoryStory) {
    return <ServiceStoryPage categorySlug={category} subcategorySlug="" storySlug={sub} />
  }

  if (!hydrated) {
    return <main className="min-h-screen bg-[#111111]" />
  }

  return (
    <NotFoundPage
      title="404"
      message="This service page does not exist."
      homeHref="/services"
    />
  )
}

import { useEffect, useState } from 'react'
import {
  findPortfolioGallery,
  findPortfolioHighlight,
  findPortfolioPage,
  getStoredPortfolioTree,
} from '../../data/portfolioTree'
import { getStoredPortfolioConfig, setStoredPortfolioConfig } from '../../data/portfolioConfig'
import NotFoundPage from '../NotFoundPage'
import HighlightDetailPage from './HighlightDetailPage'
import PortfolioCategoryPage from './PortfolioCategoryPage'

export default function PortfolioEntryPage({
  categorySlug,
  secondSlug = '',
  thirdSlug = '',
  lang = 'en',
}) {
  const [tree, setTree] = useState(() => getStoredPortfolioTree())
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const apply = () => setTree(getStoredPortfolioTree())
    window.addEventListener('portfolio-pages-config-changed', apply)
    fetch('/api/blogs/settings/portfolio-pages')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data.data) {
          setStoredPortfolioConfig({ ...getStoredPortfolioConfig(), ...data.data })
          setTree(getStoredPortfolioTree())
        }
      })
      .catch(() => {})
      .finally(() => setHydrated(true))
    return () => window.removeEventListener('portfolio-pages-config-changed', apply)
  }, [])

  const second = String(secondSlug || '').trim()
  const third = String(thirdSlug || '').trim()

  if (third) {
    return (
      <HighlightDetailPage
        lang={lang}
        categorySlug={categorySlug}
        subcategorySlug={second}
        highlightSlug={third}
        storySlug={third}
      />
    )
  }

  if (!second) {
    return <PortfolioCategoryPage lang={lang} categorySlug={categorySlug} subcategorySlug="" />
  }

  const subPage = findPortfolioPage(tree, categorySlug, second)
  const highlight = findPortfolioHighlight(tree, categorySlug, '', second)
  const gallery = findPortfolioGallery(tree, categorySlug, '', second)

  if (subPage) {
    return <PortfolioCategoryPage lang={lang} categorySlug={categorySlug} subcategorySlug={second} />
  }

  if (highlight || gallery) {
    return (
      <HighlightDetailPage
        lang={lang}
        categorySlug={categorySlug}
        subcategorySlug=""
        highlightSlug={second}
        storySlug={second}
      />
    )
  }

  if (!hydrated) {
    return <main className="min-h-screen bg-[#111111]" />
  }

  return (
    <NotFoundPage
      title="404"
      message="This portfolio page does not exist."
      homeHref="/all-projects"
    />
  )
}

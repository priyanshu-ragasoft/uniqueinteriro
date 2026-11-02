import { useEffect, useState } from 'react'
import { DEFAULT_SITE_CHROME, getStoredSiteChrome, setStoredSiteChrome } from '../data/siteChrome'

export default function LegalPage({ id }) {
  const [config, setConfig] = useState(() => getStoredSiteChrome())

  useEffect(() => {
    const apply = () => setConfig(getStoredSiteChrome())
    window.addEventListener('site-chrome-config-changed', apply)
    fetch('/api/blogs/settings/site-chrome')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data.data) {
          const next = { ...DEFAULT_SITE_CHROME, ...data.data }
          setStoredSiteChrome(next)
          setConfig(next)
        }
      })
      .catch(() => {})
    return () => window.removeEventListener('site-chrome-config-changed', apply)
  }, [])

  const page = config.legal?.[id]
  if (!page) return null

  return (
    <main className="bg-[#101010] px-5 pt-36 pb-24 text-white sm:px-10 md:pt-48 lg:px-16">
      <p className="text-[12px] tracking-[0.18em] text-[#e3943f] uppercase">{page.kicker}</p>
      <h1 className="mt-3 max-w-[14ch] text-[40px] leading-none font-normal tracking-[-0.02em] sm:text-6xl">
        {page.title}
      </h1>
      {page.updated ? <p className="mt-5 text-[14px] text-white/50">Updated {page.updated}</p> : null}
      <div className="mt-10 flex max-w-[68ch] flex-col gap-8">
        {(page.sections || []).map((section, index) => (
          <section key={`${section.heading || 'section'}-${index}`}>
            {section.heading ? <h2 className="text-[13px] tracking-[0.14em] text-[#e3943f] uppercase">{section.heading}</h2> : null}
            {section.body ? <p className="mt-3 text-[16px] leading-relaxed text-white/80">{section.body}</p> : null}
          </section>
        ))}
      </div>
    </main>
  )
}

import { useEffect, useState } from 'react'
import { DEFAULT_SITE_CHROME, getStoredSiteChrome, setStoredSiteChrome } from '../../data/siteChrome'

const inputClass =
  'w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-[13px] text-white outline-none focus:border-[#e3943f]'
const btnPrimary =
  'rounded-xl bg-gradient-to-r from-[#e3943f] to-[#d68532] px-5 py-2.5 text-[11.5px] font-bold tracking-[0.14em] text-black uppercase'

function pairsToText(list) {
  return (list || []).map((row) => (Array.isArray(row) ? row.join(' | ') : '')).join('\n')
}

function textToPairs(text) {
  return String(text || '')
    .split('\n')
    .map((line) => line.split('|').map((part) => part.trim()))
    .filter((row) => row[0] && row[1])
}

export default function SiteChromeManager({ token }) {
  const [config, setConfig] = useState(() => getStoredSiteChrome())
  const [status, setStatus] = useState('')
  const privacy = config.legal?.privacy || DEFAULT_SITE_CHROME.legal.privacy
  const terms = config.legal?.terms || DEFAULT_SITE_CHROME.legal.terms
  const footer = config.footer || DEFAULT_SITE_CHROME.footer

  useEffect(() => {
    fetch('/api/blogs/settings/site-chrome')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data.data) {
          setConfig({ ...DEFAULT_SITE_CHROME, ...data.data })
          setStoredSiteChrome({ ...DEFAULT_SITE_CHROME, ...data.data })
        }
      })
      .catch(() => {})
  }, [])

  const save = async () => {
    setStoredSiteChrome(config)
    try {
      await fetch('/api/blogs/settings/site-chrome', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || localStorage.getItem('ug_admin_token') || ''}`,
        },
        body: JSON.stringify(config),
      })
    } catch {
      /* local save still applies */
    }
    setStatus('Saved. Footer, Privacy, and Terms now use this content.')
    setTimeout(() => setStatus(''), 3000)
  }

  const setLegal = (id, patch) => {
    setConfig((current) => ({
      ...current,
      legal: { ...current.legal, [id]: { ...current.legal[id], ...patch } },
    }))
  }

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold uppercase">Footer & legal pages</h2>
          <p className="mt-1 text-[13px] text-white/50">These are the links and text visitors see in the footer, Privacy, and Terms.</p>
        </div>
        <button type="button" className={btnPrimary} onClick={save}>Save / Publish</button>
      </div>
      {status ? <p className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-[13px]">{status}</p> : null}

      <article className="space-y-3 rounded-2xl border border-white/10 bg-[#121212] p-5">
        <h3 className="font-bold">Footer</h3>
        <label className="block text-[11px] font-bold uppercase text-white/50">Brand
          <input className={`${inputClass} mt-1`} value={footer.brand || ''} onChange={(e) => setConfig((c) => ({ ...c, footer: { ...c.footer, brand: e.target.value } }))} />
        </label>
        <label className="block text-[11px] font-bold uppercase text-white/50">Copyright
          <input className={`${inputClass} mt-1`} value={footer.rights || ''} onChange={(e) => setConfig((c) => ({ ...c, footer: { ...c.footer, rights: e.target.value } }))} />
        </label>
        <label className="block text-[11px] font-bold uppercase text-white/50">Primary links (url | label)
          <textarea className={`${inputClass} mt-1`} rows={6} value={pairsToText(footer.primary)} onChange={(e) => setConfig((c) => ({ ...c, footer: { ...c.footer, primary: textToPairs(e.target.value) } }))} />
        </label>
        <label className="block text-[11px] font-bold uppercase text-white/50">Secondary links (url | label)
          <textarea className={`${inputClass} mt-1`} rows={6} value={pairsToText(footer.secondary)} onChange={(e) => setConfig((c) => ({ ...c, footer: { ...c.footer, secondary: textToPairs(e.target.value) } }))} />
        </label>
        <label className="block text-[11px] font-bold uppercase text-white/50">Social names (one per line)
          <textarea className={`${inputClass} mt-1`} rows={4} value={(footer.socials || []).join('\n')} onChange={(e) => setConfig((c) => ({ ...c, footer: { ...c.footer, socials: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) } }))} />
        </label>
      </article>

      {[['privacy', privacy], ['terms', terms]].map(([id, page]) => (
        <article key={id} className="space-y-3 rounded-2xl border border-white/10 bg-[#121212] p-5">
          <h3 className="font-bold capitalize">{id} page</h3>
          <input className={inputClass} value={page.title || ''} onChange={(e) => setLegal(id, { title: e.target.value })} />
          <input className={inputClass} value={page.kicker || ''} onChange={(e) => setLegal(id, { kicker: e.target.value })} />
          <input className={inputClass} value={page.updated || ''} onChange={(e) => setLegal(id, { updated: e.target.value })} />
          {(page.sections || []).map((section, index) => (
            <div key={index} className="space-y-2 rounded-xl border border-white/10 p-3">
              <input className={inputClass} value={section.heading || ''} onChange={(e) => {
                const sections = [...(page.sections || [])]
                sections[index] = { ...sections[index], heading: e.target.value }
                setLegal(id, { sections })
              }} />
              <textarea className={inputClass} rows={3} value={section.body || ''} onChange={(e) => {
                const sections = [...(page.sections || [])]
                sections[index] = { ...sections[index], body: e.target.value }
                setLegal(id, { sections })
              }} />
            </div>
          ))}
        </article>
      ))}
    </div>
  )
}

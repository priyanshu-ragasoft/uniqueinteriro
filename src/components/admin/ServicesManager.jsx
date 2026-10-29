import { useEffect, useState } from 'react'
import {
  buildDefaultServiceTree,
  emptyPage,
  getStoredServiceTree,
  normalizeTree,
  setStoredServiceTree,
  slugify,
  validateServiceTree,
} from '../../data/serviceTree'

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

function move(list, index, direction) {
  const next = [...list]
  const target = index + direction
  if (target < 0 || target >= next.length) return list
  const [item] = next.splice(index, 1)
  next.splice(target, 0, item)
  return next.map((entry, order) => ({ ...entry, order }))
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Could not read that file'))
    reader.readAsDataURL(file)
  })
}

async function uploadMedia(file, token) {
  const dataUrl = await fileToDataUrl(file)
  const res = await fetch('/api/blogs/uploads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || localStorage.getItem('ug_admin_token') || ''}`,
    },
    body: JSON.stringify({ filename: file.name, dataUrl }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.url) throw new Error(data.message || 'Upload failed')
  return data.url
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold tracking-wider text-white/50 uppercase">{label}</span>
      {children}
    </label>
  )
}

const inputClass = 'w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-[13px] text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#e3943f]'

function isVideoSource(src) {
  const value = String(src || '').toLowerCase()
  return value.startsWith('data:video') || /\.(mp4|webm|ogg|mov)(\?|#|$)/.test(value)
}

function MediaThumb({ src }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [src])
  if (!src) return null
  return (
    <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black">
      {failed ? (
        <span className="px-2 text-center text-[10px] text-white/40">Preview unavailable</span>
      ) : isVideoSource(src) ? (
        <video src={src} muted playsInline preload="metadata" className="h-full w-full object-contain" onError={() => setFailed(true)} />
      ) : (
        <img src={src} alt="" className="h-full w-full object-contain" onError={() => setFailed(true)} />
      )}
    </div>
  )
}

const fileClass = 'block w-full text-[12px] text-white/60 file:mr-3 file:rounded-lg file:border-0 file:bg-[#e3943f] file:px-3 file:py-1.5 file:text-[11px] file:font-bold file:uppercase file:text-black'

function BlockToggle({ checked, onChange }) {
  return (
    <label className="inline-flex items-center gap-2 text-[12px] text-white/70">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      Show this block
    </label>
  )
}

export default function ServicesManager({
  token,
  title = 'Services',
  endpoint = '/api/blogs/settings/services-pages',
  readTree = getStoredServiceTree,
  writeTree = setStoredServiceTree,
  resetTree = buildDefaultServiceTree,
  checkTree = validateServiceTree,
  normalize = normalizeTree,
  urlFor = (categoryItem, sub) => (sub ? `/services/${categoryItem.slug}/${sub.slug}` : `/services/${categoryItem.slug}`),
  packTree = (value) => value,
  hoverNote = 'Only the small picture in the Services menu. The page banner is set below.',
  intro = 'Menu name, subcategories, banner, and page text. One save publishes the live site.',
}) {
  const [tree, setTree] = useState(() => readTree())
  const [categoryId, setCategoryId] = useState(() => readTree().categories[0]?.id || '')
  const [subId, setSubId] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const authToken = token || (typeof localStorage !== 'undefined' ? localStorage.getItem('ug_admin_token') : '')

  const storeFile = async (file, apply) => {
    if (!file) return
    setUploading(true)
    setError('')
    setStatus(null)
    try {
      const url = await uploadMedia(file, authToken)
      apply(url)
      setStatus('uploaded')
    } catch (err) {
      setError(err.message || 'Upload failed')
      setStatus('error')
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data?.categories) && data.data.categories.length) {
          const next = normalize({ categories: data.data.categories })
          setTree(next)
          writeTree(next)
          setCategoryId((curr) => curr || next.categories[0]?.id || '')
        }
      })
      .catch(() => {})
  }, [endpoint, normalize])

  useEffect(() => {
    if (!status) return undefined
    const timer = setTimeout(() => setStatus(null), 3500)
      return () => clearTimeout(timer)
  }, [status])

  const categories = [...tree.categories].sort((a, b) => a.order - b.order)
  const category = categories.find((item) => item.id === categoryId) || categories[0]
  const subcategories = [...(category?.subcategories || [])].sort((a, b) => a.order - b.order)
  const subcategory = subcategories.find((item) => item.id === subId) || null
  const editing = subcategory || category
  const page = emptyPage(editing?.page || {})

  const patchCategory = (id, patch) => {
    setTree((current) => ({
      categories: current.categories.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }))
  }

  const patchSub = (id, patch) => {
    if (!category) return
    patchCategory(category.id, {
      subcategories: category.subcategories.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    })
  }

  const patchEditing = (patch) => {
    if (subcategory) patchSub(subcategory.id, patch)
    else if (category) patchCategory(category.id, patch)
  }

  const patchPage = (block, value) => {
    patchEditing({ page: { ...page, [block]: value } })
  }

  const save = async () => {
    const errors = checkTree(tree)
    if (errors.length) {
      setError(errors[0])
      setStatus('error')
      return
    }
    if (JSON.stringify(tree).includes('data:')) {
      setError('A photo or video is still stored inside the page. Choose the file again so it uploads, then Save.')
      setStatus('error')
      return
    }
    setLoading(true)
    setError('')
    writeTree(tree)
    try {
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || localStorage.getItem('ug_admin_token') || ''}`,
        },
        body: JSON.stringify(packTree(tree)),
      })
      const data = await res.json()
      if (!res.ok || data.success === false) {
        setError(data.message || 'Save failed')
        setStatus('error')
      } else {
        setStatus('saved')
      }
    } catch {
      setStatus('saved')
    } finally {
      setLoading(false)
    }
  }

  const addCategory = () => {
    const item = {
      id: uid('cat'),
      name: 'New category',
      slug: `new-category-${tree.categories.length + 1}`,
      menuDescription: '',
      menuImage: '/nav/services-card.jpg',
      menuVideo: '',
      published: true,
      showInMenu: true,
      order: tree.categories.length,
      page: emptyPage({ banner: { title: 'New category' } }),
      subcategories: [],
    }
    setTree((current) => ({ categories: [...current.categories, item] }))
    setCategoryId(item.id)
    setSubId('')
  }

  const addSubcategory = () => {
    if (!category) return
    const item = {
      id: uid('sub'),
      name: 'New subcategory',
      slug: `new-page-${category.subcategories.length + 1}`,
      menuDescription: '',
      menuImage: category.menuImage || '',
      published: true,
      order: category.subcategories.length,
      page: emptyPage({ banner: { title: 'New subcategory' } }),
    }
    patchCategory(category.id, { subcategories: [...category.subcategories, item] })
    setSubId(item.id)
  }

  return (
    <div className="space-y-6 pb-24 text-white">
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#121212] p-6 md:flex-row md:items-center md:justify-between">
          <div>
          <h1 className="text-[20px] font-bold uppercase">{title}</h1>
          <p className="max-w-xl text-[13px] leading-relaxed text-white/55">{intro}</p>
              </div>
        <div className="flex gap-3">
            <button
              type="button"
            onClick={() => {
              if (window.confirm(`Replace the ${title.toLowerCase()} menu with the starter categories?`)) {
                const next = resetTree()
                setTree(next)
                setCategoryId(next.categories[0].id)
                setSubId('')
              }
            }}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[11.5px] font-bold tracking-wider text-white/80 uppercase hover:bg-white/[0.08]"
          >
            Reset starter menu
            </button>
          <button type="button" onClick={save} disabled={loading} className="rounded-xl bg-gradient-to-r from-[#e3943f] to-[#d68532] px-5 py-2.5 text-[11.5px] font-bold tracking-[0.14em] text-black uppercase shadow-md shadow-[#e3943f]/25 disabled:opacity-50">
            {loading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

      {uploading ? <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[13px]">Uploading file… wait for this to finish, then press Save.</p> : null}
      {status === 'uploaded' ? <p className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-[13px]">File uploaded. Press Save to publish it.</p> : null}
      {status === 'saved' ? <p className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-[13px]">Saved. The public menu and pages use this content.</p> : null}
      {status === 'error' ? <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-[13px]">{error || 'Could not save.'}</p> : null}

      <div className="space-y-4">
        <section className="rounded-2xl border border-white/10 bg-[#141414] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">1. Category</h2>
            <button type="button" onClick={addCategory} className="text-[12px] font-bold text-[#e3943f]">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
          <button
                key={item.id}
            type="button"
                onClick={() => { setCategoryId(item.id); setSubId('') }}
                className={`rounded-full border px-4 py-2 text-[12px] font-semibold tracking-wide ${category?.id === item.id ? 'border-[#e3943f] bg-[#e3943f] text-black' : 'border-white/10 bg-white/[0.03] text-white/80'}`}
              >
                {item.name || 'Untitled'}
          </button>
        ))}
      </div>
          {category ? (
            <div className="mt-3 flex gap-3 text-[11px] uppercase tracking-wider text-white/45">
              <button type="button" onClick={() => setTree((current) => ({ categories: move(categories, categories.findIndex((item) => item.id === category.id), -1) }))}>Move left</button>
              <button type="button" onClick={() => setTree((current) => ({ categories: move(categories, categories.findIndex((item) => item.id === category.id), 1) }))}>Move right</button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete “${category.name}” and its subcategories?`)) {
                    setTree((current) => ({ categories: current.categories.filter((entry) => entry.id !== category.id) }))
                    setSubId('')
                  }
                }}
              >
                Delete
              </button>
            </div>
          ) : null}
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#141414] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">2. Subcategory</h2>
            <button type="button" onClick={addSubcategory} className="text-[12px] font-bold text-[#e3943f]">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setSubId('')} className={`rounded-full border px-4 py-2 text-[12px] font-semibold ${!subcategory ? 'border-[#e3943f] bg-[#e3943f] text-black' : 'border-white/10 text-white/80'}`}>
              Category page
            </button>
            {subcategories.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSubId(item.id)}
                className={`rounded-full border px-4 py-2 text-[12px] font-semibold ${subcategory?.id === item.id ? 'border-[#e3943f] bg-[#e3943f] text-black' : 'border-white/10 bg-white/[0.03] text-white/80'}`}
              >
                {item.name || 'Untitled'}
              </button>
            ))}
          </div>
          {subcategory ? (
            <div className="mt-3 flex gap-3 text-[11px] uppercase tracking-wider text-white/45">
              <button type="button" onClick={() => patchCategory(category.id, { subcategories: move(subcategories, subcategories.findIndex((item) => item.id === subcategory.id), -1) })}>Move left</button>
              <button type="button" onClick={() => patchCategory(category.id, { subcategories: move(subcategories, subcategories.findIndex((item) => item.id === subcategory.id), 1) })}>Move right</button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete “${subcategory.name}”?`)) {
                    patchCategory(category.id, { subcategories: category.subcategories.filter((entry) => entry.id !== subcategory.id) })
                    setSubId('')
                  }
                }}
              >
                Delete
              </button>
              </div>
          ) : null}
        </section>

        {editing ? (
          <section className="space-y-4">
            <div className="space-y-5 rounded-2xl border border-white/10 bg-[#141414] p-5">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-[#e3943f] uppercase">Menu card</p>
                <h2 className="mt-1 text-[16px] font-semibold">{subcategory ? 'Subcategory' : 'Category'}</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Menu name">
                  <input
                    className={inputClass}
                    value={editing.name}
                    onChange={(event) => {
                      const name = event.target.value
                      patchEditing({ name, slug: editing.slug || slugify(name) })
                    }}
                  />
                </Field>
                <Field label="URL slug">
                  <input className={inputClass} value={editing.slug} onChange={(event) => patchEditing({ slug: slugify(event.target.value) })} />
                </Field>
              </div>
              <Field label="Hover text">
                <input className={inputClass} value={editing.menuDescription || ''} onChange={(event) => patchEditing({ menuDescription: event.target.value })} placeholder="Short line under the picture" />
              </Field>
              <Field label="Hover image">
                <p className="mb-2 text-[12px] leading-relaxed text-white/45">{hoverNote}</p>
                <div className="flex items-center gap-4">
                  <MediaThumb src={editing.menuImage || '/nav/services-card.jpg'} />
                  <div className="min-w-0 flex-1 space-y-2">
                    <input className={inputClass} value={editing.menuImage || ''} onChange={(event) => patchEditing({ menuImage: event.target.value })} placeholder="/uploads/photo.jpg" />
                    <input type="file" accept="image/*" className="block w-full text-[12px] text-white/60 file:mr-3 file:rounded-lg file:border-0 file:bg-[#e3943f] file:px-3 file:py-1.5 file:text-[11px] file:font-bold file:uppercase file:text-black" onChange={(event) => storeFile(event.target.files?.[0], (url) => patchEditing({ menuImage: url }))} />
            </div>
                </div>
              </Field>
              {!subcategory ? (
                <Field label="Menu video (optional)">
                  <input className={inputClass} value={editing.menuVideo || ''} onChange={(event) => patchEditing({ menuVideo: event.target.value })} placeholder="Video URL" />
                </Field>
              ) : null}
              <div className="flex flex-wrap items-center gap-5 border-t border-white/10 pt-4">
                <label className="inline-flex items-center gap-2 text-[13px]">
                  <input type="checkbox" checked={editing.published !== false} onChange={(event) => patchEditing({ published: event.target.checked })} />
                  Published
                </label>
                {!subcategory ? (
                  <label className="inline-flex items-center gap-2 text-[13px]">
                    <input type="checkbox" checked={editing.showInMenu !== false} onChange={(event) => patchEditing({ showInMenu: event.target.checked })} />
                    Show in the services menu
                </label>
                ) : null}
              </div>
            </div>

            <article className="rounded-2xl border border-white/10 bg-[#121212] p-5 space-y-3">
              <div className="flex items-center justify-between"><h3 className="font-bold">1. Banner</h3><BlockToggle checked={Boolean(page.banner?.show)} onChange={(show) => patchPage('banner', { ...(page.banner || {}), show })} /></div>
              <Field label="Small label"><input className={inputClass} value={page.banner?.label || ''} onChange={(event) => patchPage('banner', { ...(page.banner || {}), label: event.target.value })} /></Field>
              <Field label="Page title"><input className={inputClass} value={page.banner?.title || ''} onChange={(event) => patchPage('banner', { ...(page.banner || {}), title: event.target.value })} /></Field>
              <Field label="Accent line"><input className={inputClass} value={page.banner?.accent || ''} onChange={(event) => patchPage('banner', { ...(page.banner || {}), accent: event.target.value })} /></Field>
              <Field label="Subtitle"><textarea className={inputClass} rows={3} value={page.banner?.subtitle || ''} onChange={(event) => patchPage('banner', { ...(page.banner || {}), subtitle: event.target.value })} /></Field>
              {[0, 1, 2].map((index) => {
                const src = page.banner?.images?.[index] || ''
                return (
                  <Field key={index} label={`Banner photo or video ${index + 1}`}>
                    <div className="flex items-center gap-3">
                      <MediaThumb src={src} />
                      <div className="min-w-0 flex-1 space-y-2">
                      <input
                          className={inputClass}
                          value={src}
                          placeholder="Image or video URL"
                          onChange={(event) => {
                            const images = [...(page.banner?.images || ['', '', ''])]
                            images[index] = event.target.value
                            patchPage('banner', { ...(page.banner || {}), images })
                          }}
                        />
                <input
                          type="file"
                          accept="image/*,video/mp4,video/webm,video/ogg,.mov"
                          className={fileClass}
                          onChange={(event) => storeFile(event.target.files?.[0], (url) => {
                            const images = [...(page.banner?.images || ['', '', ''])]
                            images[index] = url
                            patchPage('banner', { ...(page.banner || {}), images })
                          })}
                />
              </div>
                    </div>
                  </Field>
                )
              })}
            </article>

            <article className="rounded-2xl border border-white/10 bg-[#121212] p-5 space-y-3">
              <div className="flex items-center justify-between"><h3 className="font-bold">2. Intro</h3><BlockToggle checked={Boolean(page.intro?.show)} onChange={(show) => patchPage('intro', { ...(page.intro || {}), show })} /></div>
              <Field label="Heading"><input className={inputClass} value={page.intro?.heading || ''} onChange={(event) => patchPage('intro', { ...(page.intro || {}), heading: event.target.value })} /></Field>
              <Field label="Paragraph"><textarea className={inputClass} rows={3} value={page.intro?.paragraph1 || ''} onChange={(event) => patchPage('intro', { ...(page.intro || {}), paragraph1: event.target.value })} /></Field>
              <Field label="Second paragraph"><textarea className={inputClass} rows={3} value={page.intro?.paragraph2 || ''} onChange={(event) => patchPage('intro', { ...(page.intro || {}), paragraph2: event.target.value })} /></Field>
            </article>

            <RepeatBlock
              title="3. Highlights"
              show={Boolean(page.highlights?.show)}
              onShow={(show) => patchPage('highlights', { ...(page.highlights || {}), show })}
              items={page.highlights?.items || []}
              onItems={(items) => patchPage('highlights', { ...(page.highlights || {}), items })}
              blank={() => ({ id: uid('card'), title: '', text: '', image: '' })}
              render={(item, update) => (
                <>
                  <Field label="Title"><input className={inputClass} value={item.title || ''} onChange={(event) => update({ title: event.target.value })} /></Field>
                  <Field label="Text"><textarea className={inputClass} rows={2} value={item.text || ''} onChange={(event) => update({ text: event.target.value })} /></Field>
                  <Field label="Photo or video (optional)">
                    <div className="flex items-center gap-3">
                      <MediaThumb src={item.image} />
                      <div className="min-w-0 flex-1 space-y-2">
                        <input className={inputClass} value={item.image || ''} onChange={(event) => update({ image: event.target.value })} />
                        <input type="file" accept="image/*,video/mp4,video/webm,video/ogg,.mov" className={fileClass} onChange={(event) => storeFile(event.target.files?.[0], (url) => update({ image: url }))} />
            </div>
                    </div>
                  </Field>
                </>
              )}
            />

            <RepeatBlock
              title="4. Process steps"
              show={Boolean(page.steps?.show)}
              onShow={(show) => patchPage('steps', { ...(page.steps || {}), show })}
              items={page.steps?.items || []}
              onItems={(items) => patchPage('steps', { ...(page.steps || {}), items })}
              blank={() => ({ id: uid('step'), number: '', title: '', text: '' })}
              render={(item, update) => (
                <>
                  <Field label="Step number"><input className={inputClass} value={item.number || ''} onChange={(event) => update({ number: event.target.value })} /></Field>
                  <Field label="Title"><input className={inputClass} value={item.title || ''} onChange={(event) => update({ title: event.target.value })} /></Field>
                  <Field label="Text"><textarea className={inputClass} rows={2} value={item.text || ''} onChange={(event) => update({ text: event.target.value })} /></Field>
                </>
              )}
            />

            <RepeatBlock
              title="5. Gallery"
              show={Boolean(page.gallery?.show)}
              onShow={(show) => patchPage('gallery', { ...(page.gallery || {}), show })}
              items={page.gallery?.items || []}
              onItems={(items) => patchPage('gallery', { ...(page.gallery || {}), items })}
              blank={() => ({ id: uid('photo'), image: '', caption: '' })}
              render={(item, update) => (
                <>
                  <Field label="Photo or video">
                    <div className="flex items-center gap-3">
                      <MediaThumb src={item.image} />
                      <div className="min-w-0 flex-1 space-y-2">
                        <input className={inputClass} value={item.image || ''} onChange={(event) => update({ image: event.target.value })} />
                        <input type="file" accept="image/*,video/mp4,video/webm,video/ogg,.mov" className={fileClass} onChange={(event) => storeFile(event.target.files?.[0], (url) => update({ image: url }))} />
                      </div>
                    </div>
                  </Field>
                  <Field label="Caption"><input className={inputClass} value={item.caption || ''} onChange={(event) => update({ caption: event.target.value })} /></Field>
                </>
              )}
            />

            <article className="rounded-2xl border border-white/10 bg-[#121212] p-5 space-y-3">
              <div className="flex items-center justify-between"><h3 className="font-bold">6. Closing note</h3><BlockToggle checked={Boolean(page.closing?.show)} onChange={(show) => patchPage('closing', { ...(page.closing || {}), show })} /></div>
              <Field label="Heading"><input className={inputClass} value={page.closing?.heading || ''} onChange={(event) => patchPage('closing', { ...(page.closing || {}), heading: event.target.value })} /></Field>
              <Field label="Paragraph"><textarea className={inputClass} rows={3} value={page.closing?.paragraph || ''} onChange={(event) => patchPage('closing', { ...(page.closing || {}), paragraph: event.target.value })} /></Field>
              <Field label="Button label"><input className={inputClass} value={page.closing?.buttonLabel || ''} onChange={(event) => patchPage('closing', { ...(page.closing || {}), buttonLabel: event.target.value })} /></Field>
              <Field label="Button link"><input className={inputClass} value={page.closing?.buttonLink || ''} onChange={(event) => patchPage('closing', { ...(page.closing || {}), buttonLink: event.target.value })} /></Field>
            </article>
          </section>
        ) : null}
      </div>
    </div>
  )
}

function RepeatBlock({ title, show, onShow, items, onItems, blank, render }) {
  const list = items || []
  const updateAt = (index, patch) => {
    onItems(list.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)))
  }
  return (
    <article className="rounded-2xl border border-white/10 bg-[#121212] p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">{title}</h3>
        <BlockToggle checked={show} onChange={onShow} />
      </div>
      {list.map((item, index) => (
        <div key={item.id || index} className="space-y-3 rounded-xl border border-white/10 p-3">
          {render(item, (patch) => updateAt(index, patch))}
          <div className="flex gap-3 text-[12px] text-white/50">
            <button type="button" onClick={() => onItems(move(list, index, -1))}>Up</button>
            <button type="button" onClick={() => onItems(move(list, index, 1))}>Down</button>
            <button type="button" onClick={() => onItems(list.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => onItems([...list, blank()])} className="text-[12px] font-bold text-[#e3943f]">Add</button>
    </article>
  )
}

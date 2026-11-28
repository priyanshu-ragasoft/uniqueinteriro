/** Canonical site logo — keep all surfaces on this path. */
export const BRAND_LOGO_URL = '/unique-gold-logo.png'

const LEGACY_LOGO_URLS = new Set([
  '/closing_logo.png',
  '/logouniqe.png',
  '/int_logo.png',
  '/logonew.png',
  '/favicon.png',
])

/** Map old logo paths (localStorage / Mongo) to the current brand mark. */
export function resolveBrandLogo(url) {
  const raw = String(url || '').trim()
  if (!raw || LEGACY_LOGO_URLS.has(raw)) return BRAND_LOGO_URL
  // Filename-only legacy matches (query/hash ignored)
  try {
    const path = raw.split('?')[0].split('#')[0]
    if (LEGACY_LOGO_URLS.has(path)) return BRAND_LOGO_URL
    const name = path.split('/').pop()?.toLowerCase()
    if (
      name === 'closing_logo.png' ||
      name === 'logouniqe.png' ||
      name === 'int_logo.png' ||
      name === 'logonew.png'
    ) {
      return BRAND_LOGO_URL
    }
  } catch {}
  return raw
}

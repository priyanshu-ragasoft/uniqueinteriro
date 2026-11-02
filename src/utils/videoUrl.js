export const DEPLOYED_VIDEOS = {
  rydhum: '/project-videos/rydhum-hotel.mp4',
  victerrace: '/project-videos/victerrace-kolkata.mp4',
  smartCity: '/project-videos/smart-city-banur.mp4',
  pushpa: '/project-videos/pushpa-the-fire.mp4',
}

/**
 * Normalizes any legacy /website-assets/.../*.mp4 path (including URL-encoded paths
 * and oversized local-only MP4s) to clean, CDN-served /project-videos/*.mp4 URLs.
 */
export function normalizeProjectVideoUrl(url) {
  if (!url || typeof url !== 'string') return url
  let decoded = url
  try {
    decoded = decodeURIComponent(url)
  } catch {}
  const upper = decoded.toUpperCase()

  if (upper.includes('RYDHUM HOTEL.MP4')) {
    return DEPLOYED_VIDEOS.rydhum
  }
  if (upper.includes('VICTERRACE KOLKATA.MP4') || upper.includes('TETTRO MOHALI.MP4')) {
    return DEPLOYED_VIDEOS.victerrace
  }
  if (upper.includes('PUSHPA THE FIRE.MP4')) {
    return DEPLOYED_VIDEOS.pushpa
  }
  if (
    upper.includes('WHATSAPP VIDEO') ||
    upper.includes('HILL VIEW APARTMENT PRESENTATION/B.MP4') ||
    upper.endsWith('/B.MP4') ||
    upper.includes('G S STREET.MP4') ||
    upper.includes('GREEN WOOD.MP4')
  ) {
    return DEPLOYED_VIDEOS.smartCity
  }
  return url
}

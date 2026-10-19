export const DEFAULT_CONTACT_CONFIG = {
  // Visual media
  mediaUrl: '', // default falls back to /assets/Contact/Nina_obrezano_8250f042fc.mp4
  posterUrl: '', // default falls back to /assets/Contact/videoframe_15197.png

  // Typography & Headers
  kicker: 'Contact us',
  title: 'Take a step into the world of',
  accent: 'Unique Graphics',
  story: 'Leave your name and number. We will talk through the project and how you want to begin.',
  prompt: 'Fill out the form and our manager will contact you',

  // Form Field Labels
  nameLabel: 'Your name',
  phoneLabel: 'Phone number',
  noteLabel: 'About the project',
  submitButtonText: 'Contact us',
  whatsappNumber: '+91 98765 43210',
  whatsappLink: 'https://wa.me/919876543210',

  // Post-submit Confirmation
  thanksMessage: 'Thank you. Your request is noted on this page.',
}

const STORAGE_KEY = 'ug_contact_page_config'

export function getStoredContactConfig() {
  if (typeof window === 'undefined') return DEFAULT_CONTACT_CONFIG
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_CONTACT_CONFIG
    return { ...DEFAULT_CONTACT_CONFIG, ...JSON.parse(raw) }
  } catch (e) {
    console.warn('[contactConfig] Failed to parse local config:', e)
    return DEFAULT_CONTACT_CONFIG
  }
}

export function setStoredContactConfig(config) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    window.dispatchEvent(new CustomEvent('contact-page-config-changed', { detail: config }))
  } catch (e) {
    console.error('[contactConfig] Failed to persist:', e)
  }
}

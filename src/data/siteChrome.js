const STORAGE_KEY = 'ug_site_chrome_config'

export const DEFAULT_SITE_CHROME = {
  footer: {
    primary: [
      ['/about', 'About us'],
      ['/contacts', 'Contacts'],
      ['/services', 'Services'],
      ['/all-projects', 'Portfolio'],
      ['/commercial-design', 'Commercials'],
      ['/blog', 'Studio Blog & Journal'],
      ['/', 'Home'],
    ],
    secondary: [
      ['/architectural-design', 'Architectural design'],
      ['/interior-design', 'Residential interiors'],
      ['/all-projects', 'Living room'],
      ['/all-projects', 'Bedroom'],
      ['/all-projects', 'Kitchen'],
      ['/all-projects', 'Villa'],
      ['/all-projects', 'Office'],
    ],
    worldwide: 'We work all over the world',
    facts: [
      ['/', '32 countries'],
      ['/all-projects', '650 completed projects'],
      ['/', '98% of clients recommend us'],
      ['/', '10+ years of practice'],
    ],
    cooperation: 'Cooperation',
    steps: [
      ['/contacts', '1. Fill out the form'],
      ['/contacts', '2. We contact you'],
      ['/contacts', '3. Receive a tailored offer'],
    ],
    contactLink: 'Contact the studio',
    brand: 'Unique Graphics',
    rights: '© 2026 Unique Graphics. All rights reserved.',
    privacy: 'Privacy Policy',
    terms: 'Terms & Conditions',
    socialTitle: "We're on social media",
    socials: ['Instagram', 'Facebook', 'X', 'Behance'],
  },
  legal: {
    privacy: {
      kicker: 'Legal',
      title: 'Privacy Policy',
      updated: '13 October 2026',
      sections: [
        { heading: 'What this page is', body: 'This policy explains what Unique Graphics does with the details you type into the forms on this website.' },
        { heading: 'What you can send', body: 'The forms ask for your name, a country calling code, a phone number, and, on the contact page, a short note about the project. You choose what to write.' },
        { heading: 'Where it stays', body: 'The request is noted on the page in your browser. This website does not email it, store it on a server, or pass it to another company.' },
        { heading: 'What we do not do', body: 'We do not sell personal information, and we do not ask for payment details on this site. A project is agreed separately, after a real conversation.' },
      ],
    },
    terms: {
      kicker: 'Legal',
      title: 'Terms & Conditions',
      updated: '13 October 2026',
      sections: [
        { heading: 'Using the site', body: 'This website presents the work of Unique Graphics. You may look through the pages and send a request to talk about a project.' },
        { heading: 'A form is not a contract', body: 'Sending a form only notes your request on the page. It does not book the studio, set a price, or start the work. Scope, cost, and dates are agreed in writing after that conversation.' },
        { heading: 'The pictures and films', body: 'The photographs and videos are shown so you can see the kind of rooms the studio works on. Please do not copy them for another business.' },
        { heading: 'Changes', body: 'Project pages and descriptions can be updated. The version on the site is the one that applies when you read it.' },
      ],
    },
  },
}

export function getStoredSiteChrome() {
  if (typeof window === 'undefined') return DEFAULT_SITE_CHROME
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SITE_CHROME
    const parsed = JSON.parse(raw)
    return {
      footer: { ...DEFAULT_SITE_CHROME.footer, ...(parsed.footer || {}) },
      legal: {
        privacy: { ...DEFAULT_SITE_CHROME.legal.privacy, ...(parsed.legal?.privacy || {}) },
        terms: { ...DEFAULT_SITE_CHROME.legal.terms, ...(parsed.legal?.terms || {}) },
      },
    }
  } catch {
    return DEFAULT_SITE_CHROME
  }
}

export function setStoredSiteChrome(config) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  window.dispatchEvent(new CustomEvent('site-chrome-config-changed', { detail: config }))
}

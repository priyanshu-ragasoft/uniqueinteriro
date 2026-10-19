import { useEffect, useLayoutEffect, useRef } from 'react'
import { FaSalesforce } from 'react-icons/fa6'
import {
  SiBootstrap,
  SiCloudflare,
  SiGoogleanalytics,
  SiGoogleads,
  SiGooglemaps,
  SiGoogletagmanager,
  SiGraphql,
  SiHotjar,
  SiHubspot,
  SiLeaflet,
  SiLighthouse,
  SiMapbox,
  SiMeta,
  SiMui,
  SiNodedotjs,
  SiPagespeedinsights,
  SiPinterest,
  SiReact,
  SiSvelte,
  SiTailwindcss,
  SiTiktok,
  SiVite,
  SiWebpack,
} from 'react-icons/si'
import { gsap, prefersReducedMotion } from '../animations/gsapConfig'
import { initTechnologyAnimations } from '../animations/scrollAnimations'

const ICON_BG = '#2a2a2a'
const ICON_BG_HOVER = '#3c3c3c'
const NAME_COLOR = '#c4c4c4'
const NAME_HOVER = '#ffffff'

const leftColumn = [
  {
    id: 'analytics',
    title: 'Analytics',
    items: [
      { id: 'google-analytics', name: 'Google Analytics', icon: SiGoogleanalytics, color: '#E37400' },
      { id: 'pinterest', name: 'Pinterest', icon: SiPinterest, color: '#BD081C' },
      { id: 'hotjar', name: 'Hotjar', icon: SiHotjar, color: '#FF3C00' },
    ],
  },
  {
    id: 'javascript-frameworks',
    title: 'JavaScript Frameworks',
    items: [
      { id: 'svelte', name: 'Svelte', icon: SiSvelte, color: '#FF3E00' },
      { id: 'vite', name: 'Vite', icon: SiVite, color: '#9135FF' },
      { id: 'react', name: 'React', icon: SiReact, color: '#61DAFB' },
    ],
  },
  {
    id: 'miscellaneous',
    title: 'Miscellaneous',
    items: [
      { id: 'nodejs', name: 'Node.js', icon: SiNodedotjs, color: '#5FA04E' },
      { id: 'graphql', name: 'GraphQL', icon: SiGraphql, color: '#E10098' },
      { id: 'webpack', name: 'Webpack', icon: SiWebpack, color: '#8DD6F9' },
    ],
  },
  {
    id: 'advertising',
    title: 'Advertising',
    items: [
      { id: 'google-ads', name: 'Google Ads', icon: SiGoogleads, color: '#4285F4' },
      { id: 'meta', name: 'Meta', icon: SiMeta, color: '#0467DF' },
      { id: 'tiktok', name: 'TikTok', icon: SiTiktok, color: '#FFFFFF' },
    ],
  },
]

const rightColumn = [
  {
    id: 'tag-managers',
    title: 'Tag Managers',
    items: [
      { id: 'gtm', name: 'Google Tag Manager', icon: SiGoogletagmanager, color: '#246FDB' },
      { id: 'segment', name: 'Segment', icon: SegmentIcon, color: '#52BD95' },
    ],
  },
  {
    id: 'crm',
    title: 'CRM',
    items: [
      { id: 'bitrix24', name: 'Bitrix24', icon: Bitrix24Icon, color: '#2FC6F6' },
      { id: 'hubspot', name: 'HubSpot', icon: SiHubspot, color: '#FF7A59' },
      { id: 'salesforce', name: 'Salesforce', icon: FaSalesforce, color: '#00A1E0' },
    ],
  },
  {
    id: 'ui-frameworks',
    title: 'UI Frameworks',
    items: [
      { id: 'tailwind', name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
      { id: 'bootstrap', name: 'Bootstrap', icon: SiBootstrap, color: '#7952B3' },
      { id: 'mui', name: 'Material UI', icon: SiMui, color: '#007FFF' },
    ],
  },
  {
    id: 'geolocation',
    title: 'Geolocation',
    items: [
      { id: 'google-maps', name: 'Google Maps', icon: SiGooglemaps, color: '#4285F4' },
      { id: 'leaflet', name: 'Leaflet', icon: SiLeaflet, color: '#199900' },
      { id: 'mapbox', name: 'Mapbox', icon: SiMapbox, color: '#FFFFFF' },
    ],
  },
  {
    id: 'performance',
    title: 'Performance',
    items: [
      { id: 'lighthouse', name: 'Lighthouse', icon: SiLighthouse, color: '#F44B21' },
      { id: 'cloudflare', name: 'Cloudflare', icon: SiCloudflare, color: '#F38020' },
      { id: 'pagespeed', name: 'PageSpeed Insights', icon: SiPagespeedinsights, color: '#4285F4' },
    ],
  },
]

function SegmentIcon({ size = 20, color = '#52BD95' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill={color}
        fillRule="evenodd"
        d="M12 2.25a9.75 9.75 0 1 0 .01 0zM12 12 L12 2.25 A9.75 9.75 0 0 1 21.75 12 Z"
      />
    </svg>
  )
}

function Bitrix24Icon({ size = 20, color = '#2FC6F6' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <text
        x="12"
        y="12.5"
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        fontFamily="Inter, Segoe UI, system-ui, sans-serif"
        fontSize="15.5"
        fontWeight="700"
      >
        24
      </text>
    </svg>
  )
}

function TechnologyItem({ item }) {
  const iconRef = useRef(null)
  const nameRef = useRef(null)
  const Icon = item.icon

  useEffect(() => {
    const icon = iconRef.current
    const name = nameRef.current
    return () => {
      gsap.killTweensOf([icon, name])
    }
  }, [])

  const animateHover = (active) => {
    const duration = prefersReducedMotion() ? 0 : 0.28
    gsap.to(iconRef.current, {
      scale: active ? 1.08 : 1,
      backgroundColor: active ? ICON_BG_HOVER : ICON_BG,
      duration,
      ease: 'power2.out',
      overwrite: 'auto',
      transformOrigin: 'center center',
    })
    gsap.to(nameRef.current, {
      color: active ? NAME_HOVER : NAME_COLOR,
      duration,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }

  return (
    <li
      data-tech-row
      className="flex items-center gap-4"
      onMouseEnter={() => animateHover(true)}
      onMouseLeave={() => animateHover(false)}
    >
      <span
        ref={iconRef}
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#2a2a2a]"
      >
        <Icon size={22} color={item.color} aria-hidden="true" />
      </span>
      <span
        ref={nameRef}
        className="text-[15px] leading-none text-[#c4c4c4] underline decoration-current decoration-1 underline-offset-[6px]"
      >
        {item.name}
      </span>
    </li>
  )
}

function TechnologyCategory({ category }) {
  const headingId = `${category.id}-heading`

  return (
    <div data-tech-category className="min-w-0">
      <h2
        id={headingId}
        data-tech-heading
        className="mb-6 text-[17px] font-medium tracking-[-0.011em] text-white"
      >
        {category.title}
      </h2>
      <ul aria-labelledby={headingId} className="flex flex-col gap-6">
        {category.items.map((item) => (
          <TechnologyItem key={item.id} item={item} />
        ))}
      </ul>
    </div>
  )
}

function TechnologyColumn({ categories }) {
  return (
    <div className="flex min-w-0 flex-col gap-16">
      {categories.map((category) => (
        <TechnologyCategory key={category.id} category={category} />
      ))}
    </div>
  )
}

export default function TechnologySection() {
  const rootRef = useRef(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    return initTechnologyAnimations(root)
  }, [])

  return (
    <main className="min-h-svh bg-[#111111] text-white">
      <section
        ref={rootRef}
        aria-labelledby="technology-heading"
        className="bg-[#111111]"
      >
        <h1 id="technology-heading" className="sr-only">
          Technology stack
        </h1>
        <div
          data-tech-content
          className="mx-auto w-full max-w-[1000px] px-5 py-20 sm:px-8 md:py-28"
        >
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-x-12 lg:gap-x-24">
            <TechnologyColumn categories={leftColumn} />
            <TechnologyColumn categories={rightColumn} />
          </div>
        </div>
      </section>
    </main>
  )
}

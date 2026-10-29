import { useRef, useState, useEffect } from 'react'
import { categories as defaultCategories, projects as defaultProjects } from '../data/projects'

export const DEFAULT_COMPLETED_PROJECTS_CONFIG = {
  copy: {
    en: {
      lead: 'More than',
      count: '650',
      tail: 'completed projects',
    },
    ru: {
      lead: 'Более',
      count: '650',
      tail: 'реализованных проектов',
    },
  },
  categories: defaultCategories,
  projects: defaultProjects,
}

const FALLBACK_PROJECT_IMAGE = '/website-assets/architecture/AUTOMOTIVE%20GALLERY/9ea0e852-0904-49c5-b948-f8504d0ea7fb.png'

function HoverClip({ video, image, className, children }) {
  const clip = useRef(null)
  const [videoFailed, setVideoFailed] = useState(false)
  const [imgSrc, setImgSrc] = useState(image || FALLBACK_PROJECT_IMAGE)

  useEffect(() => {
    setImgSrc(image || FALLBACK_PROJECT_IMAGE)
    setVideoFailed(false)
  }, [image, video])

  useEffect(() => {
    const node = clip.current
    if (!node || videoFailed) return
    node.play().catch(() => {})
  }, [video, videoFailed])

  const play = () => {
    const node = clip.current
    if (!node || videoFailed) return
    node.play().catch(() => {})
  }

  const stop = () => {
    const node = clip.current
    if (!node) return
  }

  const showVideo = video && !videoFailed

  return (
    <div className={`group relative overflow-hidden bg-[#181818] ${className}`} onMouseEnter={play} onMouseLeave={stop}>
      {showVideo ? (
        <video
          ref={clip}
          src={video}
          poster={imgSrc}
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          onError={() => setVideoFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <img
          src={imgSrc}
          alt=""
          loading="lazy"
          onError={() => {
            if (imgSrc !== FALLBACK_PROJECT_IMAGE) {
              setImgSrc(FALLBACK_PROJECT_IMAGE)
            }
          }}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}
      {children}
    </div>
  )
}

export default function CompletedProjects({ lang = 'en' }) {
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('ug_completed_projects_config_v3')
      if (saved) {
        const parsed = JSON.parse(saved)
        const hasDummy = parsed?.projects?.some((p) => p.id === 'day-living' || (p.image && p.image.includes('/assets/')))
        if (!hasDummy && Array.isArray(parsed?.projects) && parsed.projects.length >= 70) {
          return parsed
        }
      }
    } catch {}
    return DEFAULT_COMPLETED_PROJECTS_CONFIG
  })

  // Sync with MongoDB backend setting
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/blogs/settings/completed-projects')
        const data = await res.json()
        const hasDummy = data?.data?.projects?.some((p) => p.id === 'day-living' || (p.image && p.image.includes('/assets/')))
        if (data.success && data.data && Array.isArray(data.data.projects) && data.data.projects.length >= defaultProjects.length && !hasDummy) {
          setConfig(data.data)
          localStorage.setItem('ug_completed_projects_config_v3', JSON.stringify(data.data))
        } else {
          // Store fresh defaults
          localStorage.setItem('ug_completed_projects_config_v3', JSON.stringify(DEFAULT_COMPLETED_PROJECTS_CONFIG))
        }
      } catch {}
    }

    fetchConfig()

    // Listen to real-time update events from Admin panel
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('ug_completed_projects_config_v3')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (!parsed?.projects?.some((p) => p.id === 'day-living')) {
            setConfig(parsed)
          }
        }
      } catch {}
    }

    window.addEventListener('ug_completed_projects_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('ug_completed_projects_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  const currentLang = lang === 'ru' ? 'ru' : 'en'
  const text = config?.copy?.[currentLang] || DEFAULT_COMPLETED_PROJECTS_CONFIG.copy[currentLang]
  const labels = defaultCategories[currentLang] || defaultCategories.en
  const currentProjects = (Array.isArray(config?.projects) && config.projects.length >= defaultProjects.length && !config.projects.some((p) => p.id === 'day-living'))
    ? config.projects
    : defaultProjects

  const [active, setActive] = useState('all')
  const visible = active === 'all'
    ? currentProjects
    : currentProjects.filter((project) => project.cat === active)

  return (
    <section id="all-projects" className="scroll-mt-16 bg-[#101010] pb-20 text-white">
      {/* Top category selector row */}
      <div className="no-scrollbar flex gap-4 overflow-x-auto px-4 pt-8 pb-2 sm:px-8 lg:px-10">
        {labels.map(([id, label]) => {
          const selected = active === id
          const sample = id === 'all'
            ? currentProjects[0]
            : (currentProjects.find((project) => project.cat === id) || currentProjects[0])
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              aria-pressed={selected}
              className="shrink-0 text-left cursor-pointer"
            >
              <HoverClip
                video={sample?.video}
                image={sample?.image}
                className={`h-[132px] w-[210px] rounded-[22px] sm:h-[148px] sm:w-[240px] transition-all duration-300 ${
                  selected ? 'ring-2 ring-[#e3943f] shadow-lg shadow-[#e3943f]/25 scale-[1.02]' : 'opacity-85 hover:opacity-100'
                }`}
              >
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-[12px] font-semibold tracking-[0.16em] text-white uppercase drop-shadow-md">
                    {label}
                  </span>
                  {selected && (
                    <span className="h-2 w-2 rounded-full bg-[#e3943f] shadow-sm shadow-[#e3943f]" />
                  )}
                </div>
              </HoverClip>
            </button>
          )
        })}
      </div>

      {/* Main projects showcase card */}
      <div className="mx-3 mt-6 rounded-[28px] bg-[#171717] px-4 py-10 sm:mx-6 sm:px-6 sm:py-12 lg:mx-8">
        <h2 className="text-center text-[18px] font-medium tracking-[0.16em] text-white uppercase sm:text-[26px] lg:text-[30px]">
          {text.lead} <span className="text-[#e3943f]">{text.count}</span> {text.tail}
        </h2>

        <div className="no-scrollbar mt-9 flex gap-4 overflow-x-auto pb-2">
          {visible.map((project) => {
            const info = project[currentLang] ?? project.en ?? { title: project.title || 'Untitled' }
            return (
              <a key={project.id} href={`/project/${project.id}`} className="shrink-0">
                <HoverClip video={project.video} image={project.image} className="h-[190px] w-[250px] rounded-[18px] sm:h-[230px] sm:w-[300px] transition-transform hover:scale-[1.03]">
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 text-[13px] font-medium tracking-[0.06em]">
                    {info.title}
                  </span>
                </HoverClip>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

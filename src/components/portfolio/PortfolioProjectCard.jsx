function AreaIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="1.5" />
      <path d="M4 10h16M10 4v16" />
    </svg>
  )
}

function ShareIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="18" cy="5" r="2.4" />
      <circle cx="6" cy="12" r="2.4" />
      <circle cx="18" cy="19" r="2.4" />
      <path d="M8.2 13.1l7.5 4.3M15.7 6.6l-7.5 4.3" />
    </svg>
  )
}

function projectHref(project) {
  return project?.href || (project?.id ? `/project/${project.id}` : '#')
}

function categoryLabel(project) {
  return (
    project?.type ||
    project?.discipline ||
    project?.en?.category ||
    'Project'
  )
}

function displayTitle(project) {
  if (project?.en?.title) return project.en.title
  return [project?.titlePre, project?.location, project?.titlePost].filter(Boolean).join(' ')
}

function displayArea(project) {
  return project?.area || project?.en?.summary || ''
}

export default function PortfolioProjectCard({ project }) {
  const title = displayTitle(project)
  const area = displayArea(project)
  const category = categoryLabel(project)
  const href = projectHref(project)

  const onShare = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    const url = `${window.location.origin}${href}`
    try {
      if (navigator.share) {
        await navigator.share({ title, url })
        return
      }
      await navigator.clipboard.writeText(url)
    } catch {
      // ignore share cancel / clipboard failures
    }
  }

  return (
    <article className="group flex flex-col">
      <a href={href} className="block cursor-pointer">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[22px] bg-[#1a1a1a] sm:rounded-[28px]">
          {project?.image ? (
            <img
              src={project.image}
              alt={title}
              className="pointer-events-none h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[12px] text-white/30">No image</div>
          )}

          <div className="absolute top-4 right-4 sm:top-5 sm:right-5">
            <span className="inline-flex rounded-full border border-white/15 bg-black/55 px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-white backdrop-blur-md sm:text-[12px]">
              {category}
            </span>
          </div>

          <button
            type="button"
            onClick={onShare}
            aria-label="Share project"
            className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-md transition-colors hover:bg-black/70 sm:bottom-5 sm:right-5"
          >
            <ShareIcon />
          </button>
        </div>

        <div className="mt-4 sm:mt-5">
          <h3 className="text-[15px] font-semibold uppercase leading-[1.25] tracking-[0.02em] text-white sm:text-[17px] lg:text-[18px]">
            {title}
          </h3>
          {area ? (
            <p className="mt-2.5 flex items-center gap-2 text-[13px] text-white/55 sm:text-[14px]">
              <AreaIcon className="h-[15px] w-[15px] text-white/45" />
              <span>{String(area).replace(/mÂ²/g, 'm²').replace(/360Â°/g, '360°')}</span>
            </p>
          ) : null}
        </div>
      </a>
    </article>
  )
}

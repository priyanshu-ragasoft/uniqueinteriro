import { useEffect, useRef, useState } from 'react'
import { findProject } from '../data/projects'

export default function ProjectPage({ lang, id }) {
  const [project, setProject] = useState(() => findProject(id))
  const text = project?.[lang] ?? project?.en
  const video = useRef(null)

  useEffect(() => {
    setProject(findProject(id))
  }, [id])

  useEffect(() => {
    const handleUpdate = () => {
      setProject(findProject(id))
    }
    window.addEventListener('ug_completed_projects_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('ug_completed_projects_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [id])

  useEffect(() => {
    const node = video.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    node.play().catch(() => {})
  }, [id, project?.video])

  if (!project || !text) {
    return (
      <main className="bg-[#101010] px-5 pt-36 pb-24 text-white sm:px-10 md:pt-48">
        <h1 className="text-4xl">{lang === 'ru' ? 'Проект не найден' : 'Project not found'}</h1>
      </main>
    )
  }

  return (
    <main className="bg-[#101010] px-4 pt-36 pb-20 text-white sm:px-8 md:pt-44 lg:px-12 lg:pb-28">
      <p className="text-[13px] tracking-[0.18em] text-[#e3943f] uppercase">{text.category}</p>
      <h1 className="mt-3 max-w-[18ch] text-[44px] leading-[0.95] font-normal tracking-[-0.03em] sm:text-6xl lg:text-7xl">
        {text.title}
      </h1>
      {project.video ? (
        <video
          key={project.id}
          ref={video}
          src={project.video}
          muted
          loop
          playsInline
          controls
          className="mt-8 h-[58vh] min-h-[420px] w-full rounded-[28px] bg-black object-cover sm:h-[72vh]"
        />
      ) : project.image ? (
        <img
          key={project.id}
          src={project.image}
          alt={text.title}
          className="mt-8 h-[58vh] min-h-[420px] w-full rounded-[28px] bg-black object-cover sm:h-[72vh]"
        />
      ) : null}

      {/* Gallery Grid if project has multiple gallery images */}
      {project.gallery && project.gallery.length > 1 && (
        <div className="mt-12">
          <h2 className="mb-6 text-[13px] tracking-[0.18em] text-[#e3943f] uppercase font-bold">
            Project Visual Gallery ({project.gallery.length} Renders)
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {project.gallery.map((imgSrc, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-2xl bg-[#181818] border border-white/5">
                {imgSrc.endsWith('.mp4') ? (
                  <video src={imgSrc} controls playsInline className="h-[280px] w-full object-cover" />
                ) : (
                  <img src={imgSrc} alt="" className="h-[280px] w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
        <div>
          <p className="max-w-[62ch] text-[20px] leading-relaxed text-[#f3f0ea] sm:text-[22px]">{text.summary}</p>
          <p className="mt-5 max-w-[68ch] text-[17px] leading-relaxed text-white/75 sm:text-[18px]">{text.detail}</p>
        </div>
        <div>
          <h2 className="text-[13px] tracking-[0.18em] text-white/60 uppercase">
            {lang === 'ru' ? 'Состав' : 'Scope'}
          </h2>
          <ul className="mt-5 flex flex-col gap-3">
            {text.scope.map((item) => (
              <li key={item} className="border-b border-white/10 pb-3 text-[17px]">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}

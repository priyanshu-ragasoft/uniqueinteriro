import { gsap, ScrollTrigger } from './gsapConfig'

export function initTechnologyAnimations(root) {
  const motion = gsap.matchMedia()

  motion.add('(prefers-reduced-motion: no-preference)', () => {
    const content = root.querySelector('[data-tech-content]')
    const categories = gsap.utils.toArray('[data-tech-category]', root)

    if (content) {
      gsap.fromTo(
        content,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' },
      )
    }

    categories.forEach((category) => {
      const heading = category.querySelector('[data-tech-heading]')
      const rows = gsap.utils.toArray('[data-tech-row]', category)

      if (heading) gsap.set(heading, { opacity: 0, y: 14 })
      if (rows.length) gsap.set(rows, { opacity: 0, y: 10 })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: category,
          start: 'top 86%',
          once: true,
        },
      })

      if (heading) {
        timeline.to(heading, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        })
      }

      if (rows.length) {
        timeline.to(
          rows,
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.07,
            ease: 'power2.out',
          },
          heading ? '-=0.26' : 0,
        )
      }
    })

    let alive = true
    document.fonts?.ready?.then(() => {
      if (alive) ScrollTrigger.refresh()
    })

    return () => {
      alive = false
    }
  })

  return () => motion.revert()
}

import { queueScroll, scrollApp } from '../routes'

export default function HomeButton({ lang }) {
  const handleClick = (e) => {
    e.preventDefault()

    const prevPath = sessionStorage.getItem('prev_path')
    const prevScrollY = sessionStorage.getItem('prev_scroll_y')
    const homeScrollY = sessionStorage.getItem('home_scroll_y')

    const targetPath = prevPath || '/'
    const targetScroll = prevScrollY !== null
      ? Number(prevScrollY)
      : (targetPath === '/' && homeScrollY !== null ? Number(homeScrollY) : 0)

    if (targetScroll > 0) {
      queueScroll(targetScroll)
    }

    if (window.history.length > 1 && prevPath) {
      window.history.back()
      return
    }

    // Direct pushState fallback if no history
    if (window.location.pathname !== targetPath) {
      history.pushState(null, '', targetPath)
      window.dispatchEvent(new PopStateEvent('popstate'))
    } else if (targetScroll > 0) {
      scrollApp(targetScroll)
    }
  }

  return (
    <a
      href="/"
      onClick={handleClick}
      className="fixed top-[5.35rem] left-4 z-[70] inline-flex items-center gap-2 rounded-full border border-white/35 bg-black/55 px-4 py-2 text-[13px] leading-none tracking-[0.14em] text-white uppercase backdrop-blur-md transition-all duration-200 hover:border-[#e3943f] hover:text-[#e3943f] hover:bg-black/75 md:top-[9.6rem] md:left-10 cursor-pointer"
    >
      <span aria-hidden="true" className="text-[18px] leading-none">
        ‹
      </span>
      {lang === 'ru' ? 'На главную' : 'Home'}
    </a>
  )
}

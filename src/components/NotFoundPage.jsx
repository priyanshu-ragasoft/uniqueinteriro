export default function NotFoundPage({
  title = '404',
  message = 'This page has no content yet.',
  homeHref = '/',
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#111111] px-6 text-white">
      <p className="text-[13px] tracking-[0.2em] text-[#e3943f] uppercase">Not found</p>
      <h1 className="mt-4 text-[64px] font-bold leading-none tracking-tight sm:text-[88px]">{title}</h1>
      <p className="mt-5 max-w-md text-center text-[16px] leading-relaxed text-white/70">{message}</p>
      <a
        href={homeHref}
        className="mt-10 inline-flex items-center gap-2 text-[14px] tracking-wide text-white transition-colors hover:text-[#e3943f]"
      >
        <span aria-hidden>‹</span>
        <span>Back to home</span>
      </a>
    </main>
  )
}

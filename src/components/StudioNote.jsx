const pages = {
  career: {
    kicker: 'Studio',
    title: 'Career',
    text: 'Unique Graphics works as one team. If you want to talk about joining the studio, leave your name and number on the contact page.',
    button: 'Contact the studio',
  },
  blog: {
    kicker: 'Studio',
    title: 'Blog',
    text: 'Project notes are published with the work itself. Open the portfolio to see the rooms, and the contact page if you want to talk about your own.',
    button: 'See the portfolio',
    href: '/all-projects',
  },
}

export default function StudioNote({ id }) {
  const page = pages[id]
  if (!page) return null

  return (
    <main className="bg-[#101010] px-5 pt-36 pb-24 text-white sm:px-10 md:pt-48 lg:px-16">
      <p className="text-[12px] tracking-[0.18em] text-[#e3943f] uppercase">{page.kicker}</p>
      <h1 className="mt-3 text-[44px] leading-none font-normal tracking-[-0.03em] sm:text-6xl">{page.title}</h1>
      <p className="mt-6 max-w-[42ch] text-[18px] leading-relaxed text-white/80">{page.text}</p>
      <a
        href={page.href ?? '/contacts'}
        className="mt-8 inline-flex rounded-full bg-[#e3943f] px-6 py-3.5 text-[12px] font-medium tracking-[0.12em] text-black uppercase"
      >
        {page.button}
      </a>
    </main>
  )
}

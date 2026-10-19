const pages = {
  privacy: {
    kicker: 'Legal',
    title: 'Privacy Policy',
    updated: '13 October 2026',
    sections: [
      {
        heading: 'What this page is',
        body: 'This policy explains what Unique Graphics does with the details you type into the forms on this website.',
      },
      {
        heading: 'What you can send',
        body: 'The forms ask for your name, a country calling code, a phone number, and, on the contact page, a short note about the project. You choose what to write.',
      },
      {
        heading: 'Where it stays',
        body: 'The request is noted on the page in your browser. This website does not email it, store it on a server, or pass it to another company.',
      },
      {
        heading: 'What we do not do',
        body: 'We do not sell personal information, and we do not ask for payment details on this site. A project is agreed separately, after a real conversation.',
      },
    ],
  },
  terms: {
    kicker: 'Legal',
    title: 'Terms & Conditions',
    updated: '13 October 2026',
    sections: [
      {
        heading: 'Using the site',
        body: 'This website presents the work of Unique Graphics. You may look through the pages and send a request to talk about a project.',
      },
      {
        heading: 'A form is not a contract',
        body: 'Sending a form only notes your request on the page. It does not book the studio, set a price, or start the work. Scope, cost, and dates are agreed in writing after that conversation.',
      },
      {
        heading: 'The pictures and films',
        body: 'The photographs and videos are shown so you can see the kind of rooms the studio works on. Please do not copy them for another business.',
      },
      {
        heading: 'Changes',
        body: 'Project pages and descriptions can be updated. The version on the site is the one that applies when you read it.',
      },
    ],
  },
}

export default function LegalPage({ id }) {
  const page = pages[id]
  if (!page) return null

  return (
    <main className="bg-[#101010] px-5 pt-36 pb-24 text-white sm:px-10 md:pt-48 lg:px-16">
      <p className="text-[12px] tracking-[0.18em] text-[#e3943f] uppercase">{page.kicker}</p>
      <h1 className="mt-3 max-w-[14ch] text-[40px] leading-none font-normal tracking-[-0.02em] sm:text-6xl">
        {page.title}
      </h1>
      <p className="mt-5 text-[14px] text-white/50">Updated {page.updated}</p>
      <div className="mt-10 flex max-w-[68ch] flex-col gap-8">
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-[13px] tracking-[0.14em] text-[#e3943f] uppercase">{section.heading}</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-white/80">{section.body}</p>
          </section>
        ))}
      </div>
    </main>
  )
}

export const DEFAULT_ABOUT_PAGE_CONFIG = {
  banner: {
    mediaUrl: '',
    en: {
      title: 'About us',
      text: 'Unique Graphics is a studio for architecture and interior design, working with private houses and the rooms inside them.',
      button: 'Discuss your project',
      buttonLink: '/contacts',
    },
    ru: {
      title: 'О нас',
      text: 'Unique Graphics — студия архитектуры и интерьера. Мы делаем частные дома и комнаты внутри них.',
      button: 'Обсудить проект',
      buttonLink: '/contacts',
    },
  },
  style: {
    en: {
      mark: 'Unique Graphics style',
      text: 'The work is recognised by a calm use of form, colour, and light. A room should read as one piece, not a set of objects.',
    },
    ru: {
      mark: 'Стиль Unique Graphics',
      text: 'Работу узнают по спокойной форме, цвету и свету. Комната должна читаться целиком, а не набором предметов.',
    },
  },
  story: {
    mediaUrl: '',
    en: {
      teamTitle: 'The studio team',
      teamText:
        'Architecture, interiors, and the work on site sit with one team, so the drawing and the built room stay the same idea.',
      years: '10+ years',
      yearsText: 'of work in design and building',
      bigNumber: '10+',
      story: 'How a project moves',
      steps: [
        { label: 'Brief', text: 'We listen to how you live and what the plot allows.' },
        { label: 'Concept', text: 'Plans and a first view of the rooms, before details.' },
        { label: 'Drawings', text: 'Sections, finishes, and the list of what will be ordered.' },
        { label: 'Site', text: 'The build is checked against those drawings.' },
        { label: 'Handover', text: 'The rooms are complete, and we stay for what follows.' },
      ],
    },
    ru: {
      teamTitle: 'Команда студии',
      teamText:
        'Архитектура, интерьер и площадка у одной команды, поэтому чертёж и построенная комната остаются одной идеей.',
      years: '10+ лет',
      yearsText: 'работы в дизайне и строительстве',
      bigNumber: '10+',
      story: 'Как движется проект',
      steps: [
        { label: 'Бриф', text: 'Слушаем, как вы живёте и что позволяет участок.' },
        { label: 'Концепция', text: 'Планы и первый вид комнат, до деталей.' },
        { label: 'Чертежи', text: 'Разрезы, отделка и список того, что закажут.' },
        { label: 'Площадка', text: 'Стройку сверяем с этими чертежами.' },
        { label: 'Сдача', text: 'Комнаты готовы, и мы остаёмся на то, что после.' },
      ],
    },
  },
  conditions: {
    mediaUrl: '',
    en: {
      title: 'Special conditions for your project',
      cards: [
        { title: 'Support after completion', text: 'We remain after the rooms are finished and do not disappear on the last day.' },
        { title: 'Familiar premium service', text: 'You keep your usual days while the work is carried for you.' },
        { title: 'Personal expert', text: 'One person at Unique Graphics knows the project from the first talk.' },
        { title: 'Special attention', text: 'A closer level of care when the house or the deadline asks for it.' },
        { title: 'Pricing framework', text: 'The cost is set out so the project can be agreed before work starts.' },
        { title: 'Roadmap', text: 'Stages are written down, and each one waits for your approval.' },
        { title: 'Reporting system', text: 'You can see the site without travelling to it every week.' },
        { title: 'Transparency', text: 'Dates and the order of work stay visible for the whole build.' },
      ],
      mission: 'The aim is to stay with the project after the handover.',
      stat: '98%',
      statText: 'of clients recommend the studio and come back with the next room.',
      button: 'Contact our manager',
      buttonLink: '/contacts',
    },
    ru: {
      title: 'Особые условия для вашего проекта',
      cards: [
        { title: 'Поддержка после сдачи', text: 'Мы остаёмся, когда комнаты готовы, и не исчезаем в последний день.' },
        { title: 'Привычный сервис', text: 'Ваши дни остаются вашими, пока работу ведут за вас.' },
        { title: 'Личный эксперт', text: 'Один человек в Unique Graphics знает проект с первого разговора.' },
        { title: 'Особое внимание', text: 'Более плотное ведение, когда дом или срок этого просят.' },
        { title: 'Рамка стоимости', text: 'Стоимость раскладываем так, чтобы её можно было согласовать до работ.' },
        { title: 'Дорожная карта', text: 'Этапы записаны, и каждый ждёт вашего согласия.' },
        { title: 'Отчёты', text: 'Площадку видно без поездки каждую неделю.' },
        { title: 'Прозрачность', text: 'Даты и порядок работ видны на всю стройку.' },
      ],
      mission: 'Задача — остаться с проектом и после сдачи.',
      stat: '98%',
      statText: 'клиентов рекомендуют студию и возвращаются со следующей комнатой.',
      button: 'Связаться с менеджером',
      buttonLink: '/contacts',
    },
  },
}

export const getStoredAboutConfig = () => {
  try {
    const saved = localStorage.getItem('ug_about_page_config')
    if (saved) {
      const parsed = JSON.parse(saved)
      return {
        banner: { ...DEFAULT_ABOUT_PAGE_CONFIG.banner, ...parsed.banner },
        style: { ...DEFAULT_ABOUT_PAGE_CONFIG.style, ...parsed.style },
        story: { ...DEFAULT_ABOUT_PAGE_CONFIG.story, ...parsed.story },
        conditions: { ...DEFAULT_ABOUT_PAGE_CONFIG.conditions, ...parsed.conditions },
      }
    }
  } catch (e) {
    console.error('Error reading stored about config:', e)
  }
  return DEFAULT_ABOUT_PAGE_CONFIG
}

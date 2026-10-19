import livingDay from '../assets/Product/11593543-hd_1920_1080_30fps.mp4'
import bedroom from '../assets/Product/12829048_1440_2560_60fps.mp4'
import kitchen from '../assets/Product/13578853_2560_1440_30fps.mp4'
import dining from '../assets/Product/15844424_1080_1920_24fps.mp4'
import bathroom from '../assets/Product/15906009_2160_3840_30fps.mp4'
import villa from '../assets/Product/16199324_3840_2160_30fps.mp4'
import office from '../assets/Product/16311811_2160_3840_30fps.mp4'
import livingEvening from '../assets/Product/16311877_2160_3840_30fps.mp4'
import bedroomLight from '../assets/Product/16605510_3840_2160_30fps.mp4'
import villaCourt from '../assets/Product/17098497_1920_1080_24fps.mp4'

export const categories = {
  en: [
    ['all', 'All'],
    ['living', 'Living room'],
    ['bedroom', 'Bedroom'],
    ['kitchen', 'Kitchen'],
    ['dining', 'Dining'],
    ['bathroom', 'Bathroom'],
    ['villa', 'Villa'],
    ['office', 'Office'],
  ],
  ru: [
    ['all', 'Все'],
    ['living', 'Гостиная'],
    ['bedroom', 'Спальня'],
    ['kitchen', 'Кухня'],
    ['dining', 'Столовая'],
    ['bathroom', 'Ванная'],
    ['villa', 'Вилла'],
    ['office', 'Офис'],
  ],
}

export const projects = [
  {
    id: 'day-living',
    cat: 'living',
    video: livingDay,
    en: {
      category: 'Living room',
      title: 'Day living room',
      summary: 'A living room arranged for daylight, with seating that faces the room rather than a screen.',
      scope: ['Furniture layout', 'Daylight and lamps', 'Sofa and chairs', 'Wall and floor finish'],
      detail:
        'The sofa sits off the glass so the walk past the window stays clear. Light comes from the side, with one lamp for the evening. Storage is kept low so the wall stays open.',
    },
    ru: {
      category: 'Гостиная',
      title: 'Дневная гостиная',
      summary: 'Гостиная под дневной свет: посадка смотрит в комнату, а не на экран.',
      scope: ['Расстановка', 'Дневной свет и лампы', 'Диван и кресла', 'Стены и пол'],
      detail:
        'Диван стоит не у стекла, проход у окна свободен. Свет сбоку и одна лампа на вечер. Хранение низкое, стена остаётся открытой.',
    },
  },
  {
    id: 'quiet-bedroom',
    cat: 'bedroom',
    video: bedroom,
    en: {
      category: 'Bedroom',
      title: 'Quiet bedroom',
      summary: 'A bedroom with a darker wall behind the bed and light kept off the pillow.',
      scope: ['Bed wall', 'Wardrobe', 'Blackout and sheers', 'Bedside light'],
      detail:
        'The bed sits against the quieter wall. Wardrobes run to the ceiling so the floor stays clear. A small lamp on each side is enough; the ceiling light is only for dressing.',
    },
    ru: {
      category: 'Спальня',
      title: 'Тихая спальня',
      summary: 'Спальня с тёмной стеной у изголовья и светом, который не бьёт в подушку.',
      scope: ['Стена у кровати', 'Шкаф', 'Шторы', 'Прикроватный свет'],
      detail:
        'Кровать у более тихой стены. Шкафы до потолка, пол свободен. По лампе с каждой стороны, потолочный свет только чтобы одеться.',
    },
  },
  {
    id: 'working-kitchen',
    cat: 'kitchen',
    video: kitchen,
    en: {
      category: 'Kitchen',
      title: 'Working kitchen',
      summary: 'A kitchen with a clear run from sink to hob, and a place to sit without standing in the cook’s way.',
      scope: ['Work triangle', 'Tall storage', 'Counter finish', 'Task light'],
      detail:
        'The hob, sink, and fridge sit in one line so the cook does not cross the room. Seating is on the outer edge of the island. Light falls on the counter, not into the eyes.',
    },
    ru: {
      category: 'Кухня',
      title: 'Рабочая кухня',
      summary: 'Кухня с прямым ходом от мойки к плите и местом сесть, не мешая тому, кто готовит.',
      scope: ['Рабочий треугольник', 'Высокое хранение', 'Столешница', 'Рабочий свет'],
      detail:
        'Плита, мойка и холодильник в одной линии. Посадка с внешней стороны острова. Свет падает на столешницу, а не в глаза.',
    },
  },
  {
    id: 'dining-table',
    cat: 'dining',
    video: dining,
    en: {
      category: 'Dining',
      title: 'Dining room',
      summary: 'One table, one light above it, and enough room to walk behind every chair.',
      scope: ['Table size', 'Pendant', 'Sideboard', 'Chair clearance'],
      detail:
        'The light hangs over the centre of the table, not the centre of the room. Chairs pull out without hitting a wall. A sideboard holds what does not belong on the table.',
    },
    ru: {
      category: 'Столовая',
      title: 'Столовая',
      summary: 'Один стол, один свет над ним и место пройти за каждым стулом.',
      scope: ['Размер стола', 'Светильник', 'Буфет', 'Проход у стульев'],
      detail:
        'Свет над центром стола, а не над центром комнаты. Стул выдвигается и не упирается в стену. Буфет забирает то, чему не место на столе.',
    },
  },
  {
    id: 'stone-bath',
    cat: 'bathroom',
    video: bathroom,
    en: {
      category: 'Bathroom',
      title: 'Stone bathroom',
      summary: 'A bathroom planned wet and dry: the shower holds the water, and the basin stays clear of it.',
      scope: ['Wet zone', 'Basin and mirror', 'Storage', 'Warm light'],
      detail:
        'The shower is a closed zone with its own fall to the drain. The basin sits outside that splash. The mirror has light at both sides so the face is even, and towels have a bar that does not drip on the floor.',
    },
    ru: {
      category: 'Ванная',
      title: 'Каменная ванная',
      summary: 'Ванная с мокрой и сухой зоной: вода остаётся в душе, раковина — снаружи.',
      scope: ['Мокрая зона', 'Раковина и зеркало', 'Хранение', 'Тёплый свет'],
      detail:
        'Душ закрыт и имеет свой уклон к сливу. Раковина вне брызг. Свет у зеркала с двух сторон, полотенца на штанге, которая не капает на пол.',
    },
  },
  {
    id: 'villa-hall',
    cat: 'villa',
    video: villa,
    en: {
      category: 'Villa',
      title: 'Villa hall',
      summary: 'The main room of a house: tall enough for the volume, with the private rooms kept off this space.',
      scope: ['Double-height hall', 'Stair', 'Glazing', 'Link to private rooms'],
      detail:
        'The hall takes the height. The stair sits to one side so it does not cut the room in two. Bedrooms open from a quieter corridor, not straight off the hall.',
    },
    ru: {
      category: 'Вилла',
      title: 'Зал виллы',
      summary: 'Главная комната дома: высота есть, а личные комнаты от этого зала отделены.',
      scope: ['Зал в два света', 'Лестница', 'Остекление', 'Связь с комнатами'],
      detail:
        'Высоту забирает зал. Лестница сбоку и не режет комнату. Спальни выходят в более тихий коридор, а не прямо в зал.',
    },
  },
  {
    id: 'office-room',
    cat: 'office',
    video: office,
    en: {
      category: 'Office',
      title: 'Work room',
      summary: 'A room for work inside the house: a desk in the light, and a door that can close.',
      scope: ['Desk position', 'Storage', 'Screen light', 'Door and quiet'],
      detail:
        'The desk faces a wall or a side window, not a bright window behind the screen. Shelves take the files off the desk. The door closes so the rest of the house can stay loud.',
    },
    ru: {
      category: 'Офис',
      title: 'Рабочая комната',
      summary: 'Комната для работы в доме: стол на свету и дверь, которую можно закрыть.',
      scope: ['Место стола', 'Хранение', 'Свет у экрана', 'Дверь и тишина'],
      detail:
        'Стол смотрит в стену или в боковое окно, не в яркое окно за экраном. Полки снимают бумаги со стола. Дверь закрывается, и дом может шуметь.',
    },
  },
  {
    id: 'evening-living',
    cat: 'living',
    video: livingEvening,
    en: {
      category: 'Living room',
      title: 'Evening living room',
      summary: 'The same kind of room after dark: fewer lights, lower, and warm enough to sit for a long time.',
      scope: ['Lamp positions', 'Dimmer', 'Curtains', 'Low tables'],
      detail:
        'Three lights are enough: one by the sofa, one on a far wall, and a dim wash if the room is large. Curtains close fully. Tables stay lower than the arm of the sofa.',
    },
    ru: {
      category: 'Гостиная',
      title: 'Вечерняя гостиная',
      summary: 'Та же комната после темноты: меньше света, ниже и достаточно тепло, чтобы сидеть долго.',
      scope: ['Лампы', 'Диммер', 'Шторы', 'Низкие столы'],
      detail:
        'Трёх источников хватает: у дивана, на дальней стене и мягкая заливка, если комната большая. Шторы закрываются полностью. Столы ниже подлокотника.',
    },
  },
  {
    id: 'light-bedroom',
    cat: 'bedroom',
    video: bedroomLight,
    en: {
      category: 'Bedroom',
      title: 'Light bedroom',
      summary: 'A paler bedroom, with linen, a clear floor, and morning light that can be cut when needed.',
      scope: ['Bed and linen', 'Sheer and blackout', 'Floor kept clear', 'Wardrobe doors'],
      detail:
        'Sheers take the morning glare and a second layer takes the night. The floor in front of the bed is left empty. Wardrobe doors are quiet and do not need a swing into the bed.',
    },
    ru: {
      category: 'Спальня',
      title: 'Светлая спальня',
      summary: 'Более светлая спальня: лён, свободный пол и утренний свет, который можно перекрыть.',
      scope: ['Кровать и текстиль', 'Тюль и блэкаут', 'Свободный пол', 'Двери шкафа'],
      detail:
        'Тюль снимает утренний блик, второй слой закрывает ночь. Пол перед кроватью пустой. Двери шкафа не распахиваются в кровать.',
    },
  },
  {
    id: 'court-villa',
    cat: 'villa',
    video: villaCourt,
    en: {
      category: 'Villa',
      title: 'Court villa',
      summary: 'A house turned toward its own court, so the main rooms get light without opening onto the street.',
      scope: ['Court', 'Room openings', 'Privacy from the street', 'Planting edge'],
      detail:
        'Living and dining look into the court. The street side is the service side. A planted edge takes the rain and keeps the paving from meeting the glass in a hard line.',
    },
    ru: {
      category: 'Вилла',
      title: 'Вилла с двором',
      summary: 'Дом развёрнут во двор, поэтому главные комнаты получают свет и не выходят на улицу.',
      scope: ['Двор', 'Проёмы комнат', 'Закрытость от улицы', 'Посадки'],
      detail:
        'Гостиная и столовая смотрят во двор. Улица остаётся служебной стороной. Зелень принимает дождь и не даёт мощению упереться в стекло жёсткой линией.',
    },
  },
]

export function findProject(id) {
  try {
    const saved = localStorage.getItem('ug_completed_projects_config')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed.projects)) {
        const found = parsed.projects.find((project) => project.id === id)
        if (found) return found
      }
    }
  } catch {}
  return projects.find((project) => project.id === id) ?? null
}

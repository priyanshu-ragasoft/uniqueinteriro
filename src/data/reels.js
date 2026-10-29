const night = '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg'
const bedroom = '/website-assets/commercial%20interior/TEETRO%20BAR%20&%20RESTURANT%20MOHALI%2079%20CHANDIGARH/TETTRO%20MOHALI.mp4'
const snow = '/website-assets/commercial%20interior/RYDHUM%20HOTEL%20&%20BANQUET%20HALL%20FIROZEPURE%20PUNJAB/RYDHUM%20HOTEL.mp4'
const bath = '/website-assets/commercial%20interior/PUSHPA%20THE%20FIRE%20DANCE%20BAR%20KOLKATA/PUSHPA%20THE%20FIRE.mp4'
const plants = '/website-assets/commercial%20interior/VECTERRACE%20HOTEL%20DANCE%20BAR%20KOLKATA/VICTERRACE%20KOLKATA.mp4'
import { menuPages } from './menuPages'
import { projects } from './projects'

export const aboutReels = { night, bedroom, snow, bath, plants }

export function reelForPage(id) {
  const index = menuPages.findIndex((item) => item.id === id)
  const reel = projects[(index < 0 ? 0 : index) % projects.length]
  return reel?.video
}

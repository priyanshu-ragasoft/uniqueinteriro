const night = '/website-assets/architecture/Greenwood%20Avenue%20Ferozepur%20Road%20Mullanpur/v1.jpg'
const bedroom = '/project-videos/victerrace-kolkata.mp4'
const snow = '/project-videos/rydhum-hotel.mp4'
const bath = '/project-videos/pushpa-the-fire.mp4'
const plants = '/project-videos/victerrace-kolkata.mp4'
import { menuPages } from './menuPages'
import { projects } from './projects'

export const aboutReels = { night, bedroom, snow, bath, plants }

export function reelForPage(id) {
  const index = menuPages.findIndex((item) => item.id === id)
  const reel = projects[(index < 0 ? 0 : index) % projects.length]
  return reel?.video
}

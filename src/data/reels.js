import night from '../assets/more/267347_medium.mp4'
import bedroom from '../assets/more/261682_medium.mp4'
import snow from '../assets/more/261755_medium.mp4'
import bath from '../assets/more/3967-175963622_medium.mp4'
import plants from '../assets/more/1303-145340146_medium.mp4'
import { menuPages } from './menuPages'
import { projects } from './projects'

export const aboutReels = { night, bedroom, snow, bath, plants }

export function reelForPage(id) {
  const index = menuPages.findIndex((item) => item.id === id)
  const reel = projects[(index < 0 ? 0 : index) % projects.length]
  return reel?.video
}

import { connectDB } from '../config/db.js'
import Setting from '../models/Setting.js'
import mongoose from 'mongoose'

const PHOTOS = [
  {
    title: 'Contemporary house exterior',
    image: '/website-assets/architecture/contemporary%20exterior%20house%20design/c6d60406-e39c-4e68-9abc-9df4e692ace2.png',
    slug: 'contemporary-house-exterior',
  },
  {
    title: 'Neo classic villa by the pool',
    image: '/website-assets/architecture/NEO%20CLASSIC%20EXTERIOR%20DESIGN%20BIJNOR/Blue-hour%20classical%20villa%20with%20glowing%20pool-15.png',
    slug: 'neo-classic-villa-by-the-pool',
  },
  {
    title: 'Modern luxury exterior',
    image: '/website-assets/architecture/MODERN%20LUXURY%20EXTERIOR/3208a8c0-03ea-4fd9-911a-eb81f41c8119.png',
    slug: 'modern-luxury-exterior',
  },
]

async function run() {
  await connectDB()
  const doc = await Setting.findOne({ key: 'services_pages_config' })
  const value = doc?.value
  if (!value || !Array.isArray(value.categories)) {
    throw new Error('No services tree')
  }
  const arch = value.categories.find((item) => item.slug === 'architecture')
  if (!arch?.page) throw new Error('No architecture page')
  const existing = arch.page.gallery?.items || []
  if (existing.some((item) => item.image)) {
    console.log('Architecture gallery already has photos. Skip.')
    await mongoose.disconnect()
    return
  }
  arch.page.gallery = {
    show: true,
    items: PHOTOS.map((item, index) => ({
      id: `arch-gal-${index + 1}`,
      image: item.image,
      caption: item.title,
      title: item.title,
      slug: item.slug,
      published: true,
    })),
  }
  await Setting.findOneAndUpdate({ key: 'services_pages_config' }, { value }, { new: true })
  console.log('Added', PHOTOS.length, 'Architecture gallery photos from website-assets.')
  await mongoose.disconnect()
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})

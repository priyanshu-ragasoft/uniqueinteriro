import express from 'express'
import {
  getBlogs,
  getBlogByIdentifier,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogBannerSettings,
  updateBlogBannerSettings,
  getHomepageHeroSettings,
  updateHomepageHeroSettings,
  getProjectsSectionSettings,
  updateProjectsSectionSettings,
  getCompletedProjectsSettings,
  updateCompletedProjectsSettings,
  getBrandSectionsSettings,
  updateBrandSectionsSettings,
  getAboutPageSettings,
  updateAboutPageSettings,
  getPortfolioPagesSettings,
  updatePortfolioPagesSettings,
  getServicesPagesSettings,
  updateServicesPagesSettings,
  getContactPageSettings,
  updateContactPageSettings,
  getOverviewDirectivesSettings,
  updateOverviewDirectivesSettings,
  setFeaturedCoverBlog,
} from '../controllers/blogController.js'
import { protectAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

// Overview Directives Progress Settings
router.get('/settings/overview-directives', getOverviewDirectivesSettings)
router.put('/settings/overview-directives', protectAdmin, updateOverviewDirectivesSettings)

// Homepage Hero Banner Settings
router.get('/settings/hero', getHomepageHeroSettings)
router.put('/settings/hero', protectAdmin, updateHomepageHeroSettings)

// Homepage Global Projects Section Settings (32 Countries & Stats)
router.get('/settings/projects-section', getProjectsSectionSettings)
router.put('/settings/projects-section', protectAdmin, updateProjectsSectionSettings)

// Homepage 650+ Completed Projects Gallery Settings
router.get('/settings/completed-projects', getCompletedProjectsSettings)
router.put('/settings/completed-projects', protectAdmin, updateCompletedProjectsSettings)

// Homepage Brand Showcase (Discover, Clients, Recognition)
router.get('/settings/brand-sections', getBrandSectionsSettings)
router.put('/settings/brand-sections', protectAdmin, updateBrandSectionsSettings)

// About Page Full Studio Configuration
router.get('/settings/about-page', getAboutPageSettings)
router.put('/settings/about-page', protectAdmin, updateAboutPageSettings)

// Portfolio Categories & Pages Configuration (All, Architectural, Interior, Commercial)
router.get('/settings/portfolio-pages', getPortfolioPagesSettings)
router.put('/settings/portfolio-pages', protectAdmin, updatePortfolioPagesSettings)

// Services Pages & Disciplines Configuration (All 10 Services)
router.get('/settings/services-pages', getServicesPagesSettings)
router.put('/settings/services-pages', protectAdmin, updateServicesPagesSettings)

// Contact Us Page Configuration
router.get('/settings/contact-page', getContactPageSettings)
router.put('/settings/contact-page', protectAdmin, updateContactPageSettings)

// Blog Page Banner & Typography Settings
router.get('/settings/banner', getBlogBannerSettings)
router.put('/settings/banner', protectAdmin, updateBlogBannerSettings)


// Set article as primary Top Cover Story Banner
router.patch('/:id/featured-cover', protectAdmin, setFeaturedCoverBlog)

// Public routes for website visitors
router.get('/', getBlogs)
router.get('/:identifier', getBlogByIdentifier)

// Protected routes for studio executives
router.post('/', protectAdmin, createBlog)
router.put('/:id', protectAdmin, updateBlog)
router.delete('/:id', protectAdmin, deleteBlog)

export default router


const express = require('express')
const {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcements')
const { protect, authorize } = require('../middleware/auth')
const { announcementValidation } = require('../middleware/validators')
const upload = require('../middleware/upload')

const router = express.Router()

router
  .route('/')
  .get(getAnnouncements)
  .post(
    protect,
    authorize('admin'),
    upload.single('image'),               
    announcementValidation,
    createAnnouncement
  )

router
  .route('/:id')
  .get(getAnnouncement)
  .put(
    protect,
    authorize('admin'),
    upload.single('image'),              
    announcementValidation,
    updateAnnouncement
  )
  .delete(
    protect,
    authorize('admin'),
    deleteAnnouncement
  )

module.exports = router

const express = require('express');
const {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcements');
const { cookieMiddleware, csrfProtection } = require('../middleware/csrf');
const { protect, authorize } = require('../middleware/auth');
const { announcementValidation } = require('../middleware/validators');

const router = express.Router();

router
  .route('/')
  .get(getAnnouncements)
  .post(/*cookieMiddleware,csrfProtection,protect*/ authorize('admin'), announcementValidation, createAnnouncement);

router
  .route('/:id')
  .get(getAnnouncement)
  .put(/*cookieMiddleware,csrfProtection,protect*/protect, authorize('admin'), announcementValidation, updateAnnouncement)
  .delete(/*cookieMiddleware,csrfProtection,protect*/protect, authorize('admin'), deleteAnnouncement);

module.exports = router;

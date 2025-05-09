const express = require('express');
const {
  getStats,
  updateSession,
  endSession
} = require('../controllers/stats');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Admin only route
router.get('/', protect, authorize('admin'), getStats);

// User session routes
router.put('/session',cookieMiddleware,csrfProtection, protect, updateSession);
router.put('/session/end',cookieMiddleware,csrfProtection, protect, endSession);

module.exports = router;

const express = require('express');
const router = express.Router();
const { incrementVisit, getVisitCount } = require('../controllers/visitController');
const { protect, authorize } = require('../middleware/auth');

// Sayaç artır – herkese açık
router.post('/', incrementVisit);

// Sayaç göster – sadece admin
router.get('/', protect, authorize('admin'), getVisitCount);

module.exports = router;

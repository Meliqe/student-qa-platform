const express = require('express');
const {
  getUsers,
  getUser,
  getUserProfile,
  updateUser,
  deleteUser,
  getUserQuestions,
  getUserAnswers,
  getOnlineUsers
} = require('../controllers/users');
const { protect, authorize } = require('../middleware/auth');
const { cookieMiddleware, csrfProtection } = require('../middleware/csrf');

const router = express.Router();

// Public
router.get('/profile/:username',protect,getUserProfile);
router.get('/me/my-questions',protect, getUserQuestions);
router.get('/me/my-answers',protect,getUserAnswers);

// Protected – Admin only
router.use(protect);
router.use(authorize('admin'));


router.get('/', getUsers); 
router.get('/:id', getUser);
router.get('/online', getOnlineUsers);
// POST / PUT / DELETE – CSRF ile korunmalı
router.put('/:id', /*cookieMiddleware,csrfProtection,protect*/ updateUser);
router.delete('/:id', /*cookieMiddleware,csrfProtection,protect*/ deleteUser);

module.exports = router;

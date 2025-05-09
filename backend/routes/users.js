const express = require('express');
const {
  getUsers,
  getUser,
  getUserProfile,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users');
const { protect, authorize } = require('../middleware/auth');
const { cookieMiddleware, csrfProtection } = require('../middleware/csrf');

const router = express.Router();

// Public
router.get('/profile/:username', getUserProfile);

// Protected – Admin only
router.use(protect);
router.use(authorize('admin'));


router.get('/', getUsers);
router.get('/:id', getUser);

// POST / PUT / DELETE – CSRF ile korunmalı
router.post('/', cookieMiddleware, csrfProtection, createUser);
router.put('/:id', cookieMiddleware, csrfProtection, updateUser);
router.delete('/:id', cookieMiddleware, csrfProtection, deleteUser);

module.exports = router;

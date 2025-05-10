const express = require('express');
const { register, login, getMe ,logout } = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../middleware/validators');
const { csrfProtection, cookieMiddleware } = require('../middleware/csrf');
const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.post('/logout',cookieMiddleware,csrfProtection,protect,logout);

module.exports = router;

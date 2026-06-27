const express = require('express');
const router = express.Router();
const {
  register,
  login,
  googleAuth,
  appleAuth,
  logout,
  me,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiters');
const {
  registerValidators,
  loginValidators,
  googleAuthValidators,
  appleAuthValidators,
  forgotPasswordValidators,
  resetPasswordValidators,
} = require('../middleware/validators');

router.post('/register', authLimiter, registerValidators, register);
router.post('/login', authLimiter, loginValidators, login);
router.post('/google', authLimiter, googleAuthValidators, googleAuth);
router.post('/apple', authLimiter, appleAuthValidators, appleAuth);
router.post('/logout', logout);
router.post('/forgot-password', authLimiter, forgotPasswordValidators, forgotPassword);
router.post('/reset-password', authLimiter, resetPasswordValidators, resetPassword);
router.get('/me', authenticateToken, me);

module.exports = router;

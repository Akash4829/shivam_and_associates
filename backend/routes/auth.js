const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { login } = require('../controllers/authController');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/auth/login - Admin login
router.post('/login', loginLimiter, login);

module.exports = router;

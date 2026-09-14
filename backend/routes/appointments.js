const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAllAppointments,
  updateAppointmentStatus,
} = require('../controllers/appointmentController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const { formSubmissionLimiter } = require('../middleware/rateLimiters');
const { appointmentValidators } = require('../middleware/validators');

function honeypotGuard(req, res, next) {
  const bait = String(req.body?.website || req.body?.company || '').trim();
  if (bait) {
    return res.status(201).json({
      message: 'Your consultation request has been received. We will contact you shortly.',
    });
  }
  return next();
}

router.post('/', formSubmissionLimiter, honeypotGuard, appointmentValidators, createAppointment);
router.get('/', authenticateToken, adminMiddleware, getAllAppointments);
router.put('/:id', authenticateToken, adminMiddleware, updateAppointmentStatus);

module.exports = router;

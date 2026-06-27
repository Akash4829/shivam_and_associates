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

router.post('/', authenticateToken, formSubmissionLimiter, appointmentValidators, createAppointment);
router.get('/', authenticateToken, adminMiddleware, getAllAppointments);
router.put('/:id', authenticateToken, adminMiddleware, updateAppointmentStatus);

module.exports = router;

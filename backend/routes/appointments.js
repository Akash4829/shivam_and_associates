const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAllAppointments,
  updateAppointmentStatus
} = require('../controllers/appointmentController');
const { authenticateToken } = require('../middleware/authMiddleware');

// POST /api/appointments - Create a new appointment
router.post('/', createAppointment);

// GET /api/appointments - Get all appointments (protected)
router.get('/', authenticateToken, getAllAppointments);

// PUT /api/appointments/:id - Update appointment status (protected)
router.put('/:id', authenticateToken, updateAppointmentStatus);

module.exports = router;

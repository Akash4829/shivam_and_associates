const express = require('express');
const router = express.Router();
const {
  createInternshipApplication,
  getInternshipApplications,
} = require('../controllers/internshipController');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * Internship application intake (public).
 * Body: { applicant_name, email, phone_number, statement? }
 */
router.post('/', createInternshipApplication);

/**
 * List all internship applications (admin).
 */
router.get('/', authenticateToken, getInternshipApplications);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createInternshipApplication,
  getInternshipApplications,
  getInternshipStats,
  updateInternshipApplication,
} = require('../controllers/internshipController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const { uploadResume } = require('../middleware/upload');
const { formSubmissionLimiter } = require('../middleware/rateLimiters');
const { internshipValidators, internshipUpdateValidators } = require('../middleware/validators');

router.post(
  '/',
  authenticateToken,
  formSubmissionLimiter,
  uploadResume.single('resume'),
  internshipValidators,
  createInternshipApplication
);

router.get('/stats', authenticateToken, adminMiddleware, getInternshipStats);
router.get('/', authenticateToken, adminMiddleware, getInternshipApplications);
router.patch('/:id', authenticateToken, adminMiddleware, internshipUpdateValidators, updateInternshipApplication);

module.exports = router;

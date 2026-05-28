const express = require('express');
const router = express.Router();
const {
  createCaseStudy,
  getAllCaseStudies,
  getCaseStudyById,
  updateCaseStudy,
  deleteCaseStudy,
} = require('../controllers/blogController');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * =============================================================================
 * Case studies API (base path mounted at /api/case-studies in server.js)
 * =============================================================================
 *
 * ----------------------------------------------------------------------------
 * POST /
 * ----------------------------------------------------------------------------
 * Summary: Create a new case study (admin only).
 * Middleware: `authenticateToken` — requires valid JWT; anonymous requests receive 401/403
 *   from the auth middleware.
 *
 * Request headers:
 *   - Authorization: Bearer <token>   (required)
 *   - Content-Type: application/json  (required)
 *
 * Request body: see `createCaseStudy` in blogController.js (title, summary, full_content,
 *   court_name, optional image_url).
 *
 * Success: 201 + { message, caseStudy }
 * Errors: 400 validation, 401/403 auth (middleware), 500 server
 *
 * SDLC / audit: changes here should stay aligned with the controller contract and
 *   frontend Admin Dashboard form fields.
 */
router.post('/', authenticateToken, createCaseStudy);

/**
 * ----------------------------------------------------------------------------
 * GET /
 * ----------------------------------------------------------------------------
 * Summary: List case studies. Supports two modes for backward compatibility:
 *   1) No `page`/`limit` query params → returns a raw JSON array of all studies.
 *   2) With `page` and/or `limit` → returns { data, totalCount, page, limit }.
 *
 * Query parameters (optional):
 *   - page  — 1-based page index (default 1 when paginating)
 *   - limit — page size (default 10 when paginating, max 100)
 *
 * See `getAllCaseStudies` in blogController.js for full response shapes.
 */
router.get('/', getAllCaseStudies);

/**
 * ----------------------------------------------------------------------------
 * GET /:id
 * ----------------------------------------------------------------------------
 * Summary: Fetch one case study by primary key. Path parameter `id` must be numeric
 *   (Express passes it as string; DB cast handles it).
 * Response: 200 object or 404 { error }.
 */
router.get('/:id', getCaseStudyById);

/**
 * ----------------------------------------------------------------------------
 * PUT /:id
 * ----------------------------------------------------------------------------
 * Summary: Update an existing case study (admin only). Same auth as POST /.
 * Body: full field set as documented on create (caller should send all updatable fields).
 */
router.put('/:id', authenticateToken, updateCaseStudy);

/**
 * ----------------------------------------------------------------------------
 * DELETE /:id
 * ----------------------------------------------------------------------------
 * Summary: Delete a case study (admin only). Returns 200 with message on success.
 */
router.delete('/:id', authenticateToken, deleteCaseStudy);

module.exports = router;

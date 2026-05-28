const pool = require('../config/db');

/**
 * ---------------------------------------------------------------------------
 * createCaseStudy — HTTP handler for POST /api/case-studies
 * ---------------------------------------------------------------------------
 * Security: Invoked only after `authenticateToken` (see routes). The client must
 * send `Authorization: Bearer <JWT>` for a valid admin session.
 *
 * Request cycle:
 *   1. Client sends JSON body with required fields (and optional image_url).
 *   2. Handler validates required columns, inserts into `case_studies`, returns 201
 *      with the created row (including generated id, timestamps).
 *   3. On validation failure → 400 with `{ error: string }`.
 *   4. On server/DB failure → 500 with `{ error: 'Internal server error' }`.
 *
 * Request body (JSON):
 *   - title         (string, required) — display title, max length enforced by DB VARCHAR(255)
 *   - summary       (string, required) — short description / teaser
 *   - full_content  (string, required) — HTML body (e.g. from a rich-text editor)
 *   - court_name    (string, required) — jurisdiction label
 *   - image_url     (string, optional)  — absolute or site-relative URL for a hero image
 *
 * Success response (201):
 *   { message: string, caseStudy: { id, title, summary, full_content, court_name, image_url?, ... } }
 */
const createCaseStudy = async (req, res) => {
  try {
    const { title, summary, full_content, court_name, image_url } = req.body;

    if (!title || !summary || !full_content || !court_name) {
      return res.status(400).json({
        error: 'Title, summary, full content, and court name are required',
      });
    }

    const query = `
      INSERT INTO case_studies (title, summary, full_content, court_name, image_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [title, summary, full_content, court_name, image_url || null];
    const result = await pool.query(query, values);

    res.status(201).json({
      message: 'Case study created successfully',
      caseStudy: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating case study:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * getAllCaseStudies — GET /api/case-studies
 * Query: page (default 1), limit (default 10, max 100).
 * Response: { data, totalCount, page, limit }
 */
const getAllCaseStudies = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const offset = (page - 1) * limit;

    const countResult = await pool.query(
      'SELECT COUNT(*)::int AS total FROM case_studies'
    );
    const totalCount = countResult.rows[0].total;

    const dataResult = await pool.query(
      `SELECT * FROM case_studies
       ORDER BY date_posted DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.status(200).json({
      data: dataResult.rows,
      totalCount,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching case studies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * getCaseStudyById — GET /api/case-studies/:id
 * Returns a single row or 404. No pagination.
 */
const getCaseStudyById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT * FROM case_studies
      WHERE id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Case study not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching case study:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * updateCaseStudy — PUT /api/case-studies/:id (protected)
 * Request body: same fields as create (title, summary, full_content, court_name, optional image_url).
 */
const updateCaseStudy = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, summary, full_content, court_name, image_url } = req.body;

    const query = `
      UPDATE case_studies
      SET title = $1, summary = $2, full_content = $3, court_name = $4, image_url = $5
      WHERE id = $6
      RETURNING *
    `;

    const values = [title, summary, full_content, court_name, image_url || null, id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Case study not found' });
    }

    res.status(200).json({
      message: 'Case study updated successfully',
      caseStudy: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating case study:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * deleteCaseStudy — DELETE /api/case-studies/:id (protected)
 */
const deleteCaseStudy = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      DELETE FROM case_studies
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Case study not found' });
    }

    res.status(200).json({
      message: 'Case study deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting case study:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createCaseStudy,
  getAllCaseStudies,
  getCaseStudyById,
  updateCaseStudy,
  deleteCaseStudy,
};

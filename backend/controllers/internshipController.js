const fs = require('fs');
const path = require('path');
const pool = require('../config/db');
const { sanitizeFields, INTERNSHIP_FIELDS } = require('../utils/sanitize');
const { sendMail } = require('../utils/mail');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'resumes');

const ALLOWED_STATUSES = ['Pending', 'Shortlisted', 'Approved', 'Rejected'];

const STATUS_EMAIL_SUBJECTS = {
  Shortlisted: 'Internship Application — Shortlisted | Mishra Juris Chamber',
  Approved: 'Internship Application Approved | Mishra Juris Chamber',
  Rejected: 'Internship Application Update | Mishra Juris Chamber',
};

const STATUS_EMAIL_BODIES = {
  Shortlisted: (name) => `
    <p>Dear ${escapeHtml(name)},</p>
    <p>Thank you for applying for an internship at <strong>Mishra Juris Chamber</strong>.</p>
    <p>We are pleased to inform you that your application has been <strong>shortlisted</strong> for further review. Our team may contact you shortly regarding the next steps.</p>
    <p>Regards,<br>Mishra Juris Chamber</p>
  `,
  Approved: (name) => `
    <p>Dear ${escapeHtml(name)},</p>
    <p>Congratulations! Your internship application with <strong>Mishra Juris Chamber</strong> has been <strong>approved</strong>.</p>
    <p>Our office will reach out to you with onboarding details, schedule, and any documents required.</p>
    <p>Regards,<br>Mishra Juris Chamber</p>
  `,
  Rejected: (name) => `
    <p>Dear ${escapeHtml(name)},</p>
    <p>Thank you for your interest in interning with <strong>Mishra Juris Chamber</strong>.</p>
    <p>After careful review, we are unable to proceed with your application at this time. We encourage you to apply again in a future intake cycle.</p>
    <p>Regards,<br>Mishra Juris Chamber</p>
  `,
};

function escapeHtml(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function notifyApplicantStatusChange(application, newStatus) {
  if (!STATUS_EMAIL_SUBJECTS[newStatus]) return;

  sendMail({
    to: application.email,
    subject: STATUS_EMAIL_SUBJECTS[newStatus],
    html: STATUS_EMAIL_BODIES[newStatus](application.applicant_name),
  }).catch((err) => console.error('Internship status email failed:', err.message));
}

const createInternshipApplication = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Resume upload is required' });
    }

    const body = sanitizeFields(req.body, INTERNSHIP_FIELDS);
    const {
      applicant_name,
      email,
      phone_number,
      college_university,
      current_year_semester,
      areas_of_interest,
      cover_letter = null,
      statement = null,
    } = body;

    const query = `
      INSERT INTO internship_applications (
        applicant_name, email, phone_number, statement,
        college_university, current_year_semester, areas_of_interest,
        cover_letter, resume_filename, resume_path, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'Pending')
      RETURNING id, applicant_name, email, phone_number, college_university,
                current_year_semester, areas_of_interest, resume_filename, status, created_at
    `;

    const interestText = statement || areas_of_interest || null;
    const values = [
      applicant_name,
      email,
      phone_number,
      interestText,
      college_university,
      current_year_semester,
      areas_of_interest,
      cover_letter || null,
      req.file.originalname,
      req.file.filename,
    ];

    const result = await pool.query(query, values);

    sendMail({
      to: process.env.FIRM_EMAIL || 'advshivammishra2124@gmail.com',
      subject: 'New Internship Application — Mishra Juris Chamber',
      html: `
        <h2>New Internship Application</h2>
        <p><strong>Name:</strong> ${escapeHtml(applicant_name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone_number)}</p>
        <p><strong>College:</strong> ${escapeHtml(college_university)}</p>
        <p><strong>Year / Semester:</strong> ${escapeHtml(current_year_semester)}</p>
        <p><strong>Areas of interest:</strong> ${escapeHtml(areas_of_interest)}</p>
        <p><strong>Cover letter:</strong></p>
        <p>${escapeHtml(cover_letter) || 'Not provided'}</p>
        <p><strong>Resume:</strong> ${escapeHtml(req.file.originalname)}</p>
        <hr>
        <p><em>Review this application in the admin dashboard.</em></p>
      `,
      attachments: [
        {
          filename: req.file.originalname,
          path: req.file.path,
        },
      ],
    }).catch((err) => console.error('Internship email failed:', err.message));

    res.status(201).json({
      message: 'Application received successfully',
      application: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating internship application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getInternshipApplications = async (req, res) => {
  try {
    const status = req.query.status;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const offset = (page - 1) * limit;

    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (status && ALLOWED_STATUSES.includes(status)) {
      conditions.push(`ia.status = $${paramIndex}`);
      params.push(status);
      paramIndex += 1;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total FROM internship_applications ia ${whereClause}`,
      params
    );
    const totalCount = countResult.rows[0].total;

    const dataResult = await pool.query(
      `SELECT ia.id, ia.applicant_name, ia.email, ia.phone_number,
              ia.college_university, ia.current_year_semester, ia.areas_of_interest,
              ia.cover_letter, ia.statement, ia.resume_filename, ia.resume_path,
              ia.status, ia.admin_notes, ia.reviewed_at, ia.created_at,
              u.full_name AS reviewed_by_name, u.email AS reviewed_by_email
       FROM internship_applications ia
       LEFT JOIN users u ON u.id = ia.reviewed_by
       ${whereClause}
       ORDER BY ia.created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    res.status(200).json({
      data: dataResult.rows,
      totalCount,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching internship applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getInternshipStats = async (_req, res) => {
  try {
    const [applications, appointments, caseStudies, recentApplications, recentAppointments] =
      await Promise.all([
        pool.query(`
          SELECT
            COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE status = 'Pending')::int AS pending,
            COUNT(*) FILTER (WHERE status = 'Shortlisted')::int AS shortlisted,
            COUNT(*) FILTER (WHERE status = 'Approved')::int AS approved,
            COUNT(*) FILTER (WHERE status = 'Rejected')::int AS rejected,
            COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')::int AS new_this_week
          FROM internship_applications
        `),
        pool.query(`
          SELECT
            COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE status = 'Pending')::int AS pending
          FROM appointments
        `),
        pool.query('SELECT COUNT(*)::int AS total FROM case_studies'),
        pool.query(`
          SELECT id, applicant_name, email, status, created_at
          FROM internship_applications
          ORDER BY created_at DESC
          LIMIT 5
        `),
        pool.query(`
          SELECT id, client_name, email, status, created_at
          FROM appointments
          ORDER BY created_at DESC
          LIMIT 5
        `),
      ]);

    res.status(200).json({
      internships: applications.rows[0],
      appointments: appointments.rows[0],
      caseStudies: caseStudies.rows[0].total,
      recentApplications: recentApplications.rows,
      recentAppointments: recentAppointments.rows,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateInternshipApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id, 10);
    if (Number.isNaN(numericId)) {
      return res.status(400).json({ error: 'Invalid application id' });
    }

    const { status, admin_notes: adminNotes } = req.body;
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (status !== undefined) {
      if (!ALLOWED_STATUSES.includes(status)) {
        return res.status(400).json({
          error: `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`,
        });
      }
      updates.push(`status = $${paramIndex}`);
      values.push(status);
      paramIndex += 1;
    }

    if (adminNotes !== undefined) {
      const sanitizedNotes =
        adminNotes === null || adminNotes === ''
          ? null
          : String(adminNotes).trim().slice(0, 2000);
      updates.push(`admin_notes = $${paramIndex}`);
      values.push(sanitizedNotes);
      paramIndex += 1;
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const shouldRecordReview = status !== undefined && status !== 'Pending';
    if (shouldRecordReview) {
      updates.push(`reviewed_at = NOW()`);
      if (req.user?.userId) {
        updates.push(`reviewed_by = $${paramIndex}`);
        values.push(req.user.userId);
        paramIndex += 1;
      }
    }

    values.push(numericId);

    const existing = await pool.query(
      'SELECT id, applicant_name, email, status FROM internship_applications WHERE id = $1',
      [numericId]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const previousStatus = existing.rows[0].status;

    const result = await pool.query(
      `UPDATE internship_applications
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, applicant_name, email, phone_number, college_university,
                 current_year_semester, areas_of_interest, cover_letter, statement,
                 resume_filename, resume_path, status, admin_notes, reviewed_at, created_at`,
      values
    );

    const application = result.rows[0];

    if (status && status !== previousStatus && status !== 'Pending') {
      notifyApplicantStatusChange(application, status);
    }

    const reviewer = req.user?.userId
      ? await pool.query('SELECT full_name, email FROM users WHERE id = $1', [req.user.userId])
      : { rows: [] };

    res.status(200).json({
      message: 'Application updated successfully',
      application: {
        ...application,
        reviewed_by_name: reviewer.rows[0]?.full_name || null,
        reviewed_by_email: reviewer.rows[0]?.email || null,
      },
    });
  } catch (error) {
    console.error('Error updating internship application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const resumeDownload = async (req, res) => {
  try {
    const requested = req.params.filename || '';
    const safeBase = path.basename(requested);
    if (safeBase !== requested) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const resolved = path.resolve(UPLOAD_DIR, safeBase);
    if (!resolved.startsWith(UPLOAD_DIR + path.sep)) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const record = await pool.query(
      'SELECT applicant_name, resume_filename FROM internship_applications WHERE resume_path = $1',
      [safeBase]
    );
    if (record.rows.length === 0 || !fs.existsSync(resolved)) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.download(resolved, record.rows[0].resume_filename || safeBase);
  } catch (error) {
    console.error('Resume download error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createInternshipApplication,
  getInternshipApplications,
  getInternshipStats,
  updateInternshipApplication,
  resumeDownload,
  ALLOWED_STATUSES,
};

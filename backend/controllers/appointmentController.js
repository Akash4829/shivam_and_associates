const pool = require('../config/db');
const { sanitizeFields, APPOINTMENT_FIELDS } = require('../utils/sanitize');
const { sendMail } = require('../utils/mail');

function escapeHtml(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const createAppointment = async (req, res) => {
  try {
    const body = sanitizeFields(req.body, APPOINTMENT_FIELDS);
    const {
      client_name,
      phone_number,
      email,
      case_summary = null,
      preferred_date = null,
    } = body;

    const query = `
      INSERT INTO appointments (client_name, phone_number, email, case_summary, preferred_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, client_name, phone_number, email, preferred_date, status, created_at
    `;
    const values = [client_name, phone_number, email, case_summary, preferred_date || null];
    const result = await pool.query(query, values);

    sendMail({
      to: process.env.FIRM_EMAIL || 'advshivammishra2124@gmail.com',
      subject: 'New Appointment Request — Mishra Juris Chamber',
      html: `
        <h2>New Appointment Request</h2>
        <p><strong>Client Name:</strong> ${escapeHtml(client_name)}</p>
        <p><strong>Phone Number:</strong> ${escapeHtml(phone_number)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Preferred Date:</strong> ${escapeHtml(preferred_date) || 'Not specified'}</p>
        <p><strong>Case Summary:</strong></p>
        <p>${escapeHtml(case_summary) || 'No case summary provided'}</p>
        <hr>
        <p><em>Automated notification from the firm website.</em></p>
      `,
    }).catch((err) => console.error('Appointment email failed:', err.message));

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const offset = (page - 1) * limit;

    const countResult = await pool.query('SELECT COUNT(*)::int AS total FROM appointments');
    const totalCount = countResult.rows[0].total;

    const dataResult = await pool.query(
      `SELECT id, client_name, phone_number, email, case_summary, preferred_date, status, created_at
       FROM appointments
       ORDER BY created_at DESC
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
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const ALLOWED_STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`,
      });
    }

    const numericId = parseInt(id, 10);
    if (Number.isNaN(numericId)) {
      return res.status(400).json({ error: 'Invalid appointment id' });
    }

    const result = await pool.query(
      `UPDATE appointments SET status = $1 WHERE id = $2
       RETURNING id, client_name, phone_number, email, status, created_at`,
      [status, numericId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json({
      message: 'Appointment status updated successfully',
      appointment: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  updateAppointmentStatus,
};

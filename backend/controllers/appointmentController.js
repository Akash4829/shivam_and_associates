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

    // FIRM_EMAIL = where alerts are delivered. SMTP_USER = Gmail account that sends them.
    const notifyTo =
      process.env.FIRM_EMAIL ||
      process.env.SMTP_USER ||
      'advshivammishra2124@gmail.com';
    let emailSent = false;
    let emailError = null;
    try {
      const mailResult = await sendMail({
        to: notifyTo,
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
      });
      emailSent = Boolean(mailResult?.sent);
      if (!emailSent) emailError = mailResult?.reason || 'Email skipped';
    } catch (err) {
      emailError = err.message;
      console.error('Appointment email failed:', err.message);
    }

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: result.rows[0],
      emailSent,
      emailError,
      notifiedTo: notifyTo,
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const ALLOWED_STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
const CLIENT_NOTIFY_STATUSES = ['Confirmed', 'Cancelled'];

const getAllAppointments = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const offset = (page - 1) * limit;
    const status = typeof req.query.status === 'string' ? req.query.status.trim() : '';

    const filters = [];
    const params = [];
    if (status && ALLOWED_STATUSES.includes(status)) {
      params.push(status);
      filters.push(`status = $${params.length}`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total FROM appointments ${whereClause}`,
      params
    );
    const totalCount = countResult.rows[0].total;

    const dataParams = [...params, limit, offset];
    const dataResult = await pool.query(
      `SELECT id, client_name, phone_number, email, case_summary, preferred_date, status, created_at
       FROM appointments
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      dataParams
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

async function notifyClientOfStatus(appointment, status) {
  if (!CLIENT_NOTIFY_STATUSES.includes(status) || !appointment?.email) {
    return { sent: false, reason: 'skipped' };
  }

  const subject =
    status === 'Confirmed'
      ? 'Your appointment request has been confirmed — Mishra Juris Chamber'
      : 'Update on your appointment request — Mishra Juris Chamber';

  const body =
    status === 'Confirmed'
      ? `<p>Dear ${escapeHtml(appointment.client_name)},</p>
         <p>Your consultation request has been <strong>confirmed</strong>. Our chambers will contact you shortly to finalize the schedule.</p>`
      : `<p>Dear ${escapeHtml(appointment.client_name)},</p>
         <p>Your consultation request has been marked as <strong>cancelled</strong>. If this was unexpected, please reply to this email or call us.</p>`;

  return sendMail({
    to: appointment.email,
    subject,
    html: `
      ${body}
      <p><strong>Preferred date:</strong> ${escapeHtml(appointment.preferred_date) || 'Not specified'}</p>
      <hr>
      <p><em>Mishra Juris Chamber</em></p>
    `,
  });
}

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notify_client: notifyClient = true } = req.body;

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
       RETURNING id, client_name, phone_number, email, case_summary, preferred_date, status, created_at`,
      [status, numericId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const appointment = result.rows[0];
    let emailSent = false;
    let emailError = null;

    if (notifyClient !== false && CLIENT_NOTIFY_STATUSES.includes(status)) {
      try {
        const mailResult = await notifyClientOfStatus(appointment, status);
        emailSent = Boolean(mailResult?.sent);
        if (!emailSent) emailError = mailResult?.reason || 'Email skipped';
      } catch (err) {
        emailError = err.message;
        console.error('Appointment client notify failed:', err.message);
      }
    }

    res.status(200).json({
      message: 'Appointment status updated successfully',
      appointment,
      emailSent,
      emailError,
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

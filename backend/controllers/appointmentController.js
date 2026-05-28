const pool = require('../config/db');
const nodemailer = require('nodemailer');

// Create a new appointment
const createAppointment = async (req, res) => {
  try {
    const { client_name, phone_number, email, case_summary, preferred_date } = req.body;

    // Validate required fields
    if (!client_name || !phone_number || !email) {
      return res.status(400).json({ 
        error: 'Client name, phone number, and email are required' 
      });
    }

    const query = `
      INSERT INTO appointments (client_name, phone_number, email, case_summary, preferred_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [client_name, phone_number, email, case_summary, preferred_date];
    const result = await pool.query(query, values);

    // Send email notification
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER || 'your-email@gmail.com',
          pass: process.env.SMTP_PASS || 'your-app-password'
        }
      });

      const mailOptions = {
        from: process.env.SMTP_FROM || '"Law Firm" <noreply@lawfirm.com>',
        to: 'advshivammishra2124@gmail.com',
        subject: 'New Appointment Request - Shivam Mishra and Associates',
        html: `
          <h2>New Appointment Request</h2>
          <p><strong>Client Name:</strong> ${client_name}</p>
          <p><strong>Phone Number:</strong> ${phone_number}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Preferred Date:</strong> ${preferred_date || 'Not specified'}</p>
          <p><strong>Case Summary:</strong></p>
          <p>${case_summary || 'No case summary provided'}</p>
          <hr>
          <p><em>This is an automated notification from Shivam Mishra and Associates Law Firm.</em></p>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('Email notification sent successfully');
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Don't fail the request if email fails, just log the error
    }

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get appointments (paginated)
const getAllAppointments = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const offset = (page - 1) * limit;

    const countResult = await pool.query(
      'SELECT COUNT(*)::int AS total FROM appointments'
    );
    const totalCount = countResult.rows[0].total;

    const dataResult = await pool.query(
      `SELECT * FROM appointments
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

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const query = `
      UPDATE appointments 
      SET status = $1 
      WHERE id = $2 
      RETURNING *
    `;
    
    const result = await pool.query(query, [status, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json({
      message: 'Appointment status updated successfully',
      appointment: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  updateAppointmentStatus
};

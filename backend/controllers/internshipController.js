const pool = require('../config/db');
const nodemailer = require('nodemailer');

/**
 * POST /api/internship-applications
 * Public endpoint: accepts a law-student internship inquiry. Persists the row and sends
 * an email alert to the firm inbox (same transport as appointments). Email failure does
 * not fail the HTTP response so the applicant still receives confirmation of receipt.
 */
const createInternshipApplication = async (req, res) => {
  try {
    const { applicant_name, email, phone_number, statement } = req.body;

    if (!applicant_name || !email || !phone_number) {
      return res.status(400).json({
        error: 'Applicant name, email, and phone number are required',
      });
    }

    const query = `
      INSERT INTO internship_applications (applicant_name, email, phone_number, statement)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [applicant_name, email, phone_number, statement || null];
    const result = await pool.query(query, values);

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER || 'your-email@gmail.com',
          pass: process.env.SMTP_PASS || 'your-app-password',
        },
      });

      const mailOptions = {
        from: process.env.SMTP_FROM || '"Law Firm" <noreply@lawfirm.com>',
        to: 'advshivammishra2124@gmail.com',
        subject: 'New Internship Application — Shivam Mishra and Associates',
        html: `
          <h2>New Internship Application</h2>
          <p><strong>Name:</strong> ${applicant_name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone_number}</p>
          <p><strong>Statement / interest:</strong></p>
          <p>${statement || 'Not provided'}</p>
          <hr>
          <p><em>Automated message from the firm website.</em></p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log('Internship application email notification sent');
    } catch (emailError) {
      console.error('Error sending internship application email:', emailError);
    }

    res.status(201).json({
      message: 'Application received successfully',
      application: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating internship application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/internship-applications
 * Protected (JWT): returns all internship applications newest first, for the admin dashboard.
 */
const getInternshipApplications = async (req, res) => {
  try {
    const query = `
      SELECT * FROM internship_applications
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching internship applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createInternshipApplication,
  getInternshipApplications,
};

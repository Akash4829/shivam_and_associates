const nodemailer = require('nodemailer');

let transporter;

function smtpConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransporter() {
  if (!transporter) {
    const port = parseInt(process.env.SMTP_PORT, 10) || 587;
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port,
      // 465 = SSL; 587 = STARTTLS
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

/**
 * Send an email via SMTP.
 * Gmail requires an App Password (not the normal account password):
 * Google Account → Security → 2-Step Verification → App passwords
 *
 * Required env: SMTP_USER, SMTP_PASS
 * Optional: SMTP_HOST, SMTP_PORT, SMTP_FROM
 */
async function sendMail({ to, subject, html, attachments }) {
  if (!smtpConfigured()) {
    const reason = 'SMTP_USER/SMTP_PASS not set — email skipped';
    console.warn(reason);
    return { sent: false, reason };
  }

  const transport = getTransporter();
  const from =
    process.env.SMTP_FROM ||
    `"Mishra Juris Chamber" <${process.env.SMTP_USER}>`;

  const message = {
    from,
    to,
    subject,
    html,
  };
  if (attachments && attachments.length > 0) {
    message.attachments = attachments;
  }

  try {
    const info = await transport.sendMail(message);
    console.log(`Email sent to ${to} (messageId=${info.messageId})`);
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error(`Email send failed to ${to}:`, err.message);
    // Common Gmail auth failure tip
    if (/Invalid login|Username and Password not accepted|EAUTH/i.test(err.message)) {
      console.error(
        'Hint: For Gmail use a 16-character App Password as SMTP_PASS (not your normal Gmail password).'
      );
    }
    throw err;
  }
}

module.exports = { sendMail, smtpConfigured };

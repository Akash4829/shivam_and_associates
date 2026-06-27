const nodemailer = require('nodemailer');

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

async function sendMail({ to, subject, html, attachments }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP not configured; skipping email send.');
    return;
  }
  const transport = getTransporter();
  const message = {
    from: process.env.SMTP_FROM || '"Mishra Juris Chamber" <noreply@lawfirm.com>',
    to,
    subject,
    html,
  };
  if (attachments && attachments.length > 0) {
    message.attachments = attachments;
  }
  await transport.sendMail(message);
}

module.exports = { sendMail };

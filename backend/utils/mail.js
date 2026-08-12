const nodemailer = require('nodemailer');

let transporter;

function smtpConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

function resendConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

function getTransporter() {
  if (!transporter) {
    const port = parseInt(process.env.SMTP_PORT, 10) || 587;
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port,
      secure: port === 465,
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
      auth: {
        user: process.env.SMTP_USER,
        // App passwords are often copied with spaces — strip them
        pass: String(process.env.SMTP_PASS || '').replace(/\s+/g, ''),
      },
    });
  }
  return transporter;
}

function resolveFrom() {
  return (
    process.env.RESEND_FROM ||
    process.env.SMTP_FROM ||
    (process.env.SMTP_USER
      ? `"Mishra Juris Chamber" <${process.env.SMTP_USER}>`
      : '"Mishra Juris Chamber" <onboarding@resend.dev>')
  );
}

/**
 * Prefer Resend (HTTPS) on Render free tier — SMTP ports 25/465/587 are blocked there.
 * Falls back to Gmail SMTP for local/dev or paid hosts.
 *
 * Resend: https://resend.com → API key → RESEND_API_KEY
 * Free tier: use from onboarding@resend.dev (or verify a domain).
 */
async function sendMailViaResend({ to, subject, html }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: resolveFrom(),
      to: [to],
      subject,
      html,
    }),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = body?.message || body?.error || response.statusText;
    throw new Error(`Resend API error: ${detail}`);
  }

  console.log(`Email sent via Resend to ${to} (id=${body.id || 'ok'})`);
  return { sent: true, provider: 'resend', messageId: body.id };
}

async function sendMailViaSmtp({ to, subject, html, attachments }) {
  const transport = getTransporter();
  const message = {
    from: resolveFrom(),
    to,
    subject,
    html,
  };
  if (attachments && attachments.length > 0) {
    message.attachments = attachments;
  }

  const info = await transport.sendMail(message);
  console.log(`Email sent via SMTP to ${to} (messageId=${info.messageId})`);
  return { sent: true, provider: 'smtp', messageId: info.messageId };
}

async function sendMail({ to, subject, html, attachments }) {
  if (resendConfigured()) {
    try {
      return await sendMailViaResend({ to, subject, html });
    } catch (err) {
      console.error(`Resend send failed to ${to}:`, err.message);
      throw err;
    }
  }

  if (!smtpConfigured()) {
    const reason =
      'No email provider configured. Set RESEND_API_KEY (recommended on Render free) or SMTP_USER/SMTP_PASS.';
    console.warn(reason);
    return { sent: false, reason };
  }

  try {
    return await sendMailViaSmtp({ to, subject, html, attachments });
  } catch (err) {
    console.error(`SMTP send failed to ${to}:`, err.message);
    if (/Invalid login|Username and Password not accepted|EAUTH/i.test(err.message)) {
      console.error(
        'Hint: For Gmail use a 16-character App Password as SMTP_PASS (not your normal Gmail password).'
      );
    }
    if (/ETIMEDOUT|ECONNREFUSED|ENETUNREACH|ESOCKET|timeout/i.test(err.message)) {
      console.error(
        'Hint: Render free tier blocks outbound SMTP (ports 25/465/587). Use RESEND_API_KEY (HTTPS) or upgrade Render.'
      );
    }
    throw err;
  }
}

module.exports = { sendMail, smtpConfigured, resendConfigured };

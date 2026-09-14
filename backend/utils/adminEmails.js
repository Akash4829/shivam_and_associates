function parseEmailList(value) {
  return String(value || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

/** Advocate / seeded accounts that should always have dashboard access. */
const DEFAULT_ADMIN_EMAILS = [
  'advshivammishra2124@gmail.com',
  'sharmaakash64501@gmail.com',
  'admin@shivammishraassociates.com',
];

function getAdminEmails() {
  return new Set([
    ...DEFAULT_ADMIN_EMAILS,
    ...parseEmailList(process.env.ADMIN_EMAILS),
    ...parseEmailList(process.env.ADMIN_SEED_EMAIL),
  ]);
}

function isAdminEmail(email) {
  if (!email) return false;
  return getAdminEmails().has(String(email).trim().toLowerCase());
}

module.exports = {
  DEFAULT_ADMIN_EMAILS,
  getAdminEmails,
  isAdminEmail,
};

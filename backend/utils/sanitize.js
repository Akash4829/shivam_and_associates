/**
 * Server-side input sanitization for text fields before database insertion.
 * Strips HTML tags and trims whitespace.
 */
function stripHtml(value) {
  if (value == null) return value;
  return String(value)
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .trim();
}

function sanitizeFields(body, fields) {
  const sanitized = { ...body };
  for (const field of fields) {
    if (sanitized[field] !== undefined && sanitized[field] !== null) {
      sanitized[field] = stripHtml(sanitized[field]);
    }
  }
  return sanitized;
}

const APPOINTMENT_FIELDS = ['client_name', 'phone_number', 'email', 'case_summary'];
const INTERNSHIP_FIELDS = [
  'applicant_name',
  'email',
  'phone_number',
  'statement',
  'college_university',
  'current_year_semester',
  'areas_of_interest',
  'cover_letter',
  'address',
  'notes',
];

module.exports = {
  stripHtml,
  sanitizeFields,
  APPOINTMENT_FIELDS,
  INTERNSHIP_FIELDS,
};

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET.trim() === '') {
  console.error('FATAL: JWT_SECRET environment variable is required but not set.');
  process.exit(1);
}

module.exports = { JWT_SECRET };

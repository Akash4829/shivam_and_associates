/**
 * Verify admin login against the database (run locally with Neon DATABASE_URL).
 * Usage:
 *   set DATABASE_URL=postgresql://...@neon.tech/...?sslmode=require
 *   node database/verify-admin-login.js
 */
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

require('dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });

const email = (process.env.ADMIN_SEED_EMAIL || 'admin@shivammishraassociates.com').toLowerCase();
const password = process.env.ADMIN_SEED_PASSWORD || 'admin123';

const databaseUrl = process.env.DATABASE_URL && String(process.env.DATABASE_URL).trim();
if (!databaseUrl) {
  console.error('Set DATABASE_URL to your Neon connection string first.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  const result = await pool.query(
    `SELECT id, email, role, auth_provider, password_hash IS NOT NULL AS has_password,
            LEFT(password_hash, 20) AS hash_prefix
     FROM users WHERE email = $1`,
    [email]
  );

  if (result.rows.length === 0) {
    console.error('NO USER found for email:', email);
    console.error('Run: node database/seed-admin.js');
    process.exit(1);
  }

  const user = result.rows[0];
  console.log('User found:', user);

  const full = await pool.query('SELECT password_hash FROM users WHERE email = $1', [email]);
  const hash = full.rows[0].password_hash;

  if (!hash) {
    console.error('password_hash is NULL — cannot login with password.');
    process.exit(1);
  }

  const ok = await bcrypt.compare(password, hash);
  console.log(`Password "${password}" matches hash:`, ok);

  if (!ok) {
    console.error('Re-seed with: node database/seed-admin.js');
    process.exit(1);
  }

  console.log('\nDatabase credentials are OK.');
  console.log('If live login still fails, the problem is Railway/Vercel config (not Neon data).');
  await pool.end();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});

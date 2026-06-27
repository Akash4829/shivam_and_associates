const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// Load backend .env when run locally (optional).
require('dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });

const databaseUrl = process.env.DATABASE_URL && String(process.env.DATABASE_URL).trim();

const pool = new Pool(
  databaseUrl
    ? {
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false },
      }
    : {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'lawfirm_db',
        password: process.env.DB_PASSWORD || process.env.PGPASSWORD || '',
        port: Number(process.env.DB_PORT) || 5432,
      }
);

async function seedAdmin() {
  try {
    const password = process.env.ADMIN_SEED_PASSWORD || 'admin123';
    const adminEmail = process.env.ADMIN_SEED_EMAIL || 'admin@shivammishraassociates.com';
    const passwordHash = await bcrypt.hash(password, 12);

    const adminQuery = `
      INSERT INTO admin_users (username, password_hash)
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING *
    `;
    const adminResult = await pool.query(adminQuery, ['admin', passwordHash]);

    const userQuery = `
      INSERT INTO users (full_name, email, password_hash, auth_provider, role, email_verified)
      VALUES ($1, $2, $3, 'local', 'admin', TRUE)
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        role = 'admin',
        updated_at = NOW()
      RETURNING id, email, role
    `;
    const userResult = await pool.query(userQuery, ['Administrator', adminEmail.toLowerCase(), passwordHash]);

    console.log('Admin seeded successfully in users table:');
    console.log(`  Email:    ${userResult.rows[0].email}`);
    console.log(`  Role:     ${userResult.rows[0].role}`);
    console.log(`  Password: ${password}`);
    if (adminResult.rows.length > 0) {
      console.log('  Legacy admin_users: admin / (same password)');
    }
    console.log('\nSign in at /login on your live site, then open /admin');
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
    if (error.code === '42P01') {
      console.error('\nThe users table does not exist. Run schema.sql on Neon first.');
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedAdmin();

const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'law_firm',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

async function seedAdmin() {
  try {
    const password = 'admin123';
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
      RETURNING *
    `;
    await pool.query(userQuery, [
      'Administrator',
      'admin@shivammishraassociates.com',
      passwordHash,
    ]);

    if (adminResult.rows.length > 0) {
      console.log('Admin credentials seeded:');
      console.log('  Panel username: admin / admin123');
      console.log('  User email: admin@shivammishraassociates.com / admin123');
    } else {
      console.log('Admin user already exists (credentials refreshed in users table)');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    await pool.end();
  }
}

seedAdmin();

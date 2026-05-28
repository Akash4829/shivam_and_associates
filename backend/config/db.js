const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL && String(process.env.DATABASE_URL).trim();

const poolConfig = databaseUrl
  ? {
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : {
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'lawfirm_db',
      password: process.env.DB_PASSWORD || process.env.PGPASSWORD || '',
      port: Number(process.env.DB_PORT) || 5432,
    };

const pool = new Pool(poolConfig);

module.exports = pool;

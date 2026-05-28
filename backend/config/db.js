const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL && String(process.env.DATABASE_URL).trim();

const buildSslConfig = () => {
  if (!databaseUrl) {
    return undefined;
  }

  if (process.env.NODE_ENV === 'production') {
    const caPath = process.env.DB_SSL_CA_PATH;
    const caContent = process.env.DB_SSL_CA;

    if (!caPath && !caContent) {
      console.error(
        'FATAL: DB_SSL_CA or DB_SSL_CA_PATH is required in production when DATABASE_URL uses SSL.'
      );
      process.exit(1);
    }

    const ca = caPath
      ? fs.readFileSync(path.resolve(caPath), 'utf8')
      : caContent;

    return {
      rejectUnauthorized: true,
      ca,
    };
  }

  return { rejectUnauthorized: false };
};

const poolConfig = databaseUrl
  ? {
      connectionString: databaseUrl,
      ssl: buildSslConfig(),
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

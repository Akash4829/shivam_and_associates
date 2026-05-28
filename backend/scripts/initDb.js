const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const fs = require('fs');
const { Client } = require('pg');

const databaseUrl = process.env.DATABASE_URL && String(process.env.DATABASE_URL).trim();

function escapeIdent(name) {
  return `"${String(name).replace(/"/g, '""')}"`;
}

async function ensureDatabaseExists() {
  if (databaseUrl) {
    return;
  }

  const dbName = process.env.DB_NAME || 'lawfirm_db';
  const adminClient = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'postgres',
    password: process.env.DB_PASSWORD || process.env.PGPASSWORD || '',
    port: Number(process.env.DB_PORT) || 5432,
  });

  await adminClient.connect();
  try {
    const { rows } = await adminClient.query('SELECT 1 FROM pg_database WHERE datname = $1', [
      dbName,
    ]);
    if (rows.length === 0) {
      await adminClient.query(`CREATE DATABASE ${escapeIdent(dbName)}`);
      console.log(`Created database "${dbName}".`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
  } finally {
    await adminClient.end();
  }
}

async function initDb() {
  try {
    await ensureDatabaseExists();

    const pool = require('../config/db');
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    console.log('Executing database schema...');
    await pool.query(sql);
    console.log('Database initialized successfully.');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDb();

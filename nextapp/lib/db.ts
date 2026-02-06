import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || '172.84.20.6',
  database: process.env.DATABASE_NAME || 'personal',
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  ssl: {
    rejectUnauthorized: false, // Use true with CA cert in production
  },
});

export async function query(text: string, params?: (string | number | boolean | null)[]) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Database error', error);
    throw error;
  }
}

export default pool;

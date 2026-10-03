import pg from 'pg';
import { config } from './appConfig.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/playnex_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

/**
 * Execute a query with automatic connection management
 */
export async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (config.environment === 'development') {
    console.log(`[SQL Query] executed: ${text.slice(0, 80)}... | Duration: ${duration}ms | Rows: ${res.rowCount}`);
  }
  return res;
}

/**
 * Test PostgreSQL connection
 */
export async function testDbConnection() {
  try {
    const res = await pool.query('SELECT NOW() as current_time');
    console.log('✅ PostgreSQL connected successfully at:', res.rows[0].current_time);
    return true;
  } catch (error) {
    console.warn('⚠️ PostgreSQL connection failed:', error.message);
    console.warn('👉 Verify PostgreSQL is running on localhost:5432 and credentials in .env match.');
    return false;
  }
}

export default { pool, query, testDbConnection };

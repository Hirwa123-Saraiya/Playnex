import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, testDbConnection } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrations() {
  console.log('🚀 Checking PostgreSQL connection...');
  const isConnected = await testDbConnection();
  if (!isConnected) {
    console.error('❌ Cannot run migrations: PostgreSQL connection failed.');
    console.error('👉 Make sure PostgreSQL service is running on localhost:5432 and credentials in .env are correct.');
    process.exit(1);
  }

  const client = await pool.connect();

  try {
    // 1. Create migrations tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations_meta (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Fetch already applied migrations
    const { rows: appliedRows } = await client.query('SELECT name FROM migrations_meta');
    const appliedSet = new Set(appliedRows.map((r) => r.name));

    // 3. Read migration files sorted in numerical order
    const migrationFiles = fs
      .readdirSync(__dirname)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    console.log(`📁 Found ${migrationFiles.length} migration files in src/migrations/`);

    let appliedCount = 0;

    for (const file of migrationFiles) {
      if (appliedSet.has(file)) {
        console.log(`⏩ [Skipped] Already applied: ${file}`);
        continue;
      }

      console.log(`⚡ [Applying] Running migration: ${file}...`);
      const filePath = path.join(__dirname, file);
      const sqlContent = fs.readFileSync(filePath, 'utf8');

      await client.query('BEGIN');
      try {
        await client.query(sqlContent);
        await client.query('INSERT INTO migrations_meta (name) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`✅ [OK] Successfully applied: ${file}`);
        appliedCount++;
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`❌ [Failed] Error executing ${file}:`, err.message);
        throw err;
      }
    }

    if (appliedCount === 0) {
      console.log('✨ All migrations are up to date! Nothing to apply.');
    } else {
      console.log(`🎉 Successfully applied ${appliedCount} new migrations!`);
    }
  } catch (error) {
    console.error('❌ Migration process aborted:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();

import { pool } from '../config/database.js';

async function check() {
  const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
  console.log('Tables in DB:', tables.rows.map(r => r.table_name));

  const tenants = await pool.query("SELECT tenant_id, club_name, status, sport, location FROM tenants");
  console.log('Tenants:', tenants.rows);

  const facs = await pool.query("SELECT * FROM facilities LIMIT 5");
  console.log('Facilities count:', facs.rows.length);

  await pool.end();
}

check().catch(console.error);

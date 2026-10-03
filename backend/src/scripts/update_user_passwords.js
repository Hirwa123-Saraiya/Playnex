import bcrypt from 'bcryptjs';
import { pool } from '../config/database.js';

async function update() {
  const hash = bcrypt.hashSync('password123', 10);
  await pool.query('UPDATE users SET password_hash = $1 WHERE email = ANY($2)', [hash, ['john@example.com', 'demo@playnex.com']]);
  console.log('✅ Updated password hashes successfully for john@example.com and demo@playnex.com');
  await pool.end();
}

update().catch(console.error);

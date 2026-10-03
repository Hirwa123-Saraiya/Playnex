import { hashSync } from 'bcryptjs';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/playnex_db'
});

const KAVYA_TENANT = 'tenant_1791065725498';
const DEFAULT_PASSWORD = 'staff@123';

const staffList = [
  { userId: 'usr_shop_kavya',       name: 'Vikram Mehta (Shop Lead)',      email: 'shop.kavya@playnex.com',       prefix: 'shop' },
  { userId: 'usr_bar_kavya',        name: 'Chef Manish Joshi (Bar Lead)',  email: 'bar.kavya@playnex.com',        prefix: 'bar' },
  { userId: 'usr_frontdesk_kavya',  name: 'Sneha Vyas (Front Desk)',       email: 'frontdesk.kavya@playnex.com',  prefix: 'frontdesk' },
  { userId: 'usr_accountant_kavya', name: 'Nirav Shah (Accountant)',       email: 'accountant.kavya@playnex.com', prefix: 'accountant' },
  { userId: 'usr_coach_kavya',      name: 'Coach Anand Iyer',              email: 'coach.kavya@playnex.com',      prefix: 'coach' },
  { userId: 'usr_hr_kavya',         name: 'Pooja Nair (HR Lead)',           email: 'hr.kavya@playnex.com',         prefix: 'hr' },
  { userId: 'usr_grounds_kavya',    name: 'Ramesh Patel (Grounds)',         email: 'grounds.kavya@playnex.com',    prefix: 'grounds' },
];

const passwordHash = hashSync(DEFAULT_PASSWORD, 10);

try {
  for (const s of staffList) {
    const { rows: existing } = await pool.query(
      `SELECT user_id FROM users WHERE email = $1`, [s.email]
    );
    if (existing.length > 0) {
      // Update password in case it was wrong
      await pool.query(
        `UPDATE users SET password_hash = $1, is_active = TRUE WHERE email = $2`,
        [passwordHash, s.email]
      );
      console.log(`UPDATED: ${s.email}`);
      continue;
    }
    await pool.query(
      `INSERT INTO users (user_id, tenant_id, name, email, password_hash, system_role, is_active, status)
       VALUES ($1, $2, $3, $4, $5, 'STAFF', TRUE, 'active')`,
      [s.userId, KAVYA_TENANT, s.name, s.email, passwordHash]
    );
    console.log(`CREATED: ${s.email}`);
  }

  console.log('\n✅ Kavya staff ready!');
  console.log('\nLogin at: http://localhost:3000/login');
  console.log('Password for all staff: staff@123\n');
  console.log('Staff accounts:');
  for (const s of staffList) {
    console.log(`  ${s.prefix.padEnd(12)} → ${s.email}`);
  }
} catch(e) {
  console.error('Error:', e.message);
} finally {
  await pool.end();
}

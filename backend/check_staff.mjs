import { hashSync } from 'bcryptjs';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres@localhost:5434/playnex_db'
});

const DEFAULT_PASSWORD = 'staff@123';
const passwordHash = hashSync(DEFAULT_PASSWORD, 10);

try {
  // Get all tenants first
  const { rows: tenants } = await pool.query(`SELECT tenant_id, club_name FROM tenants ORDER BY created_at`);
  console.log('All tenants:');
  tenants.forEach(t => console.log(`  ${t.tenant_id} → ${t.club_name}`));

  // For each tenant, create staff if they don't have them
  for (const tenant of tenants) {
    const staffList = [
      { role: 'shop',       name: 'Shop Manager',       suffix: 'Pro Shop & Inventory' },
      { role: 'bar',        name: 'Bar & Kitchen Lead',  suffix: 'Bar & Kitchen' },
      { role: 'frontdesk',  name: 'Front Desk Officer',  suffix: 'Front Desk' },
      { role: 'accountant', name: 'Finance & Accounts',  suffix: 'Finance & Accounts' },
      { role: 'coach',      name: 'Head Coach',          suffix: 'Coaching' },
      { role: 'hr',         name: 'HR Manager',          suffix: 'HR & Personnel' },
      { role: 'grounds',    name: 'Grounds Manager',     suffix: 'Facility & Grounds' },
    ];

    const slug = tenant.club_name.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    for (const s of staffList) {
      const email = `${s.role}.${slug}@playnex.com`;
      const userId = `usr_${s.role}_${slug}`;
      
      const { rows: existing } = await pool.query(`SELECT user_id FROM users WHERE email = $1`, [email]);
      if (existing.length > 0) {
        await pool.query(`UPDATE users SET password_hash = $1, is_active = TRUE WHERE email = $2`, [passwordHash, email]);
        console.log(`  UPDATED: ${email}`);
      } else {
        await pool.query(
          `INSERT INTO users (user_id, tenant_id, name, email, password_hash, system_role, is_active, status)
           VALUES ($1, $2, $3, $4, $5, 'STAFF', TRUE, 'active')
           ON CONFLICT (user_id) DO NOTHING`,
          [userId, tenant.tenant_id, `${s.name} (${tenant.club_name})`, email, passwordHash]
        );
        console.log(`  CREATED: ${email}`);
      }
    }
    console.log(`  → ${tenant.club_name}: done\n`);
  }

  console.log('\n✅ All staff provisioned!');
  console.log('Default password: staff@123');
  console.log('\nExample logins for Kavya club:');
  console.log('  shop.kavya@playnex.com / staff@123 → Pro Shop');
  console.log('  bar.kavya@playnex.com / staff@123 → Bar & Kitchen');
  console.log('  frontdesk.kavya@playnex.com / staff@123 → Front Desk');
  console.log('  accountant.kavya@playnex.com / staff@123 → Finance');
  console.log('  coach.kavya@playnex.com / staff@123 → Coach');
  console.log('  hr.kavya@playnex.com / staff@123 → HR');
  console.log('  grounds.kavya@playnex.com / staff@123 → Facility Ops');

} catch(e) {
  console.error('Error:', e.message);
  console.error(e.stack);
} finally {
  await pool.end();
}

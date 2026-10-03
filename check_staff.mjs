import { dbService } from './src/data/dbService.js';

try {
  // Check staff users
  const staff = await dbService.getStaffMembers?.('kavya') || [];
  console.log('Staff via dbService:', JSON.stringify(staff?.slice(0,5), null, 2));

  // Try findUserByEmail on a known staff email
  const testEmails = ['kavya@yopmail.com', 'admin@playnex.com', 'proshop@kavya.com'];
  for (const email of testEmails) {
    const u = await dbService.findUserByEmail(email);
    if (u) {
      console.log(`\nFound user: ${email}`);
      console.log('  system_role:', u.system_role);
      console.log('  is_active:', u.is_active);
      console.log('  target_module:', u.target_module);
      console.log('  has_password:', !!u.password_hash);
    }
  }
} catch(e) {
  console.error('Error:', e.message);
  process.exit(1);
}
process.exit(0);

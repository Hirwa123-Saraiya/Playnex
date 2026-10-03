import { pool } from '../config/database.js';

async function seed() {
  // 0. Ensure default customer users exist
  await pool.query(`
    INSERT INTO users (user_id, email, name, system_role, password_hash)
    VALUES 
      ('usr_johndoe_101', 'john@example.com', 'John Doe', 'MEMBER', '$2b$10$eWkZ.WkG28R...hash'),
      ('usr_demo_customer', 'demo@playnex.com', 'Demo Customer', 'MEMBER', '$2b$10$eWkZ.WkG28R...hash')
    ON CONFLICT (user_id) DO NOTHING;
  `);
  console.log('Customer users verified.');

  const tenantsRes = await pool.query("SELECT tenant_id, club_name, location FROM tenants WHERE LOWER(status) = 'active'");
  if (tenantsRes.rows.length === 0) {
    console.log('No active tenants found.');
    await pool.end();
    return;
  }

  for (const tenant of tenantsRes.rows) {
    const tid = tenant.tenant_id;
    console.log(`Processing tenant: ${tenant.club_name} (${tid})`);

    // 1. Facilities
    const facCountRes = await pool.query('SELECT count(*) FROM facilities WHERE tenant_id = $1', [tid]);
    if (parseInt(facCountRes.rows[0].count, 10) === 0) {
      const sampleFacilities = [
        {
          id: `fac_${tid}_badminton_1`,
          name: 'Olympic Badminton Arena 1',
          type: 'Badminton',
          hourly_rate: 650,
          surface: 'Synthetic Mat (BWF Approved)',
          open_time: '06:00:00',
          close_time: '23:00:00',
        },
        {
          id: `fac_${tid}_badminton_2`,
          name: 'Olympic Badminton Arena 2',
          type: 'Badminton',
          hourly_rate: 650,
          surface: 'Synthetic Mat (BWF Approved)',
          open_time: '06:00:00',
          close_time: '23:00:00',
        },
        {
          id: `fac_${tid}_tennis_1`,
          name: 'Centre Clay Tennis Court',
          type: 'Tennis',
          hourly_rate: 900,
          surface: 'Red Clay',
          open_time: '06:00:00',
          close_time: '22:00:00',
        },
        {
          id: `fac_${tid}_squash_1`,
          name: 'Glassback Squash Court A',
          type: 'Squash',
          hourly_rate: 750,
          surface: 'Hardwood Maple',
          open_time: '07:00:00',
          close_time: '22:00:00',
        },
        {
          id: `fac_${tid}_swim_1`,
          name: 'Semi-Olympic Heated Pool',
          type: 'Swimming',
          hourly_rate: 500,
          surface: 'Tiled Heated',
          open_time: '06:00:00',
          close_time: '21:00:00',
        },
      ];

      for (const f of sampleFacilities) {
        await pool.query(
          `INSERT INTO facilities (facility_id, tenant_id, name, type, hourly_rate, surface, open_time, close_time, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
           ON CONFLICT (facility_id) DO NOTHING`,
          [f.id, tid, f.name, f.type, f.hourly_rate, f.surface, f.open_time, f.close_time]
        );
      }
      console.log(`  Added ${sampleFacilities.length} facilities for ${tenant.club_name}`);
    }

    // 2. Membership Plans
    const planCountRes = await pool.query('SELECT count(*) FROM membership_plans WHERE tenant_id = $1', [tid]);
    if (parseInt(planCountRes.rows[0].count, 10) === 0) {
      const samplePlans = [
        {
          id: `plan_${tid}_silver`,
          name: 'Silver Sports Pass',
          price: 2499,
          billing_cycle: 'monthly',
          tier: 'Silver',
          features: JSON.stringify(['Access to Badminton & Squash', '1 guest pass per month', '10% discount on cafe', 'Off-peak court priority']),
        },
        {
          id: `plan_${tid}_gold`,
          name: 'Gold All-Access Club Membership',
          price: 5999,
          billing_cycle: 'quarterly',
          tier: 'Gold',
          features: JSON.stringify(['All courts & Swimming Pool access', 'Peak hour booking 7 days in advance', '4 guest passes per quarter', 'Free locker & towel service', '15% pro-shop discount']),
        },
        {
          id: `plan_${tid}_platinum`,
          name: 'Platinum Elite Annual Pass',
          price: 19999,
          billing_cycle: 'yearly',
          tier: 'Platinum',
          features: JSON.stringify(['Unlimited facility booking', 'Dedicated locker and valet', '10 guest passes per year', 'Complimentary coaching session/mo', 'Access to exclusive lounge & VIP events']),
        },
      ];

      for (const p of samplePlans) {
        await pool.query(
          `INSERT INTO membership_plans (plan_id, tenant_id, name, price, billing_cycle, tier, features, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, TRUE)
           ON CONFLICT (plan_id) DO NOTHING`,
          [p.id, tid, p.name, p.price, p.billing_cycle, p.tier, p.features]
        );
      }
      console.log(`  Added ${samplePlans.length} membership plans for ${tenant.club_name}`);
    }

    // 3. Club Events
    const eventCountRes = await pool.query('SELECT count(*) FROM club_events WHERE tenant_id = $1', [tid]);
    if (parseInt(eventCountRes.rows[0].count, 10) === 0) {
      const sampleEvents = [
        {
          id: `evt_${tid}_badminton_cup`,
          title: 'Monsoon Smash Badminton Open 2026',
          description: 'Annual double-elimination tournament for amateur and semi-pro badminton players. Trophies and cash prizes for top 3 finishers.',
          sport: 'Badminton',
          event_date: '2026-10-15',
          start_time: '09:00:00',
          end_time: '18:00:00',
          entry_fee: 499,
          max_participants: 32,
          registered_count: 14,
        },
        {
          id: `evt_${tid}_tennis_weekend`,
          title: 'Weekend Clay Court Tennis Championship',
          description: 'Single-set tiebreaker weekend championship. Singles men and women divisions with refreshments provided.',
          sport: 'Tennis',
          event_date: '2026-10-22',
          start_time: '08:00:00',
          end_time: '17:00:00',
          entry_fee: 799,
          max_participants: 16,
          registered_count: 9,
        },
        {
          id: `evt_${tid}_squash_clinic`,
          title: 'Masterclass: Advanced Squash Techniques & Drills',
          description: 'Exclusive 3-hour coaching clinic led by national-level coaches focusing on footwork, deceptive drops, and shot accuracy.',
          sport: 'Squash',
          event_date: '2026-10-28',
          start_time: '10:00:00',
          end_time: '13:00:00',
          entry_fee: 1200,
          max_participants: 12,
          registered_count: 8,
        },
      ];

      for (const e of sampleEvents) {
        await pool.query(
          `INSERT INTO club_events (event_id, tenant_id, title, description, sport, event_date, start_time, end_time, entry_fee, max_participants, registered_count, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'upcoming')
           ON CONFLICT (event_id) DO NOTHING`,
          [e.id, tid, e.title, e.description, e.sport, e.event_date, e.start_time, e.end_time, e.entry_fee, e.max_participants, e.registered_count]
        );
      }
      console.log(`  Added ${sampleEvents.length} events for ${tenant.club_name}`);
    }

    // 4. Reviews
    const revCountRes = await pool.query('SELECT count(*) FROM club_reviews WHERE tenant_id = $1', [tid]);
    if (parseInt(revCountRes.rows[0].count, 10) === 0) {
      const sampleReviews = [
        {
          id: `rev_${tid}_1`,
          user_name: 'Rahul Sharma',
          rating: 5,
          comment: 'Outstanding courts and lighting! BWF synthetic mats are top grade. Clean locker rooms and polite staff.',
        },
        {
          id: `rev_${tid}_2`,
          user_name: 'Pooja Mehta',
          rating: 5,
          comment: 'Best squash and badminton facility in Ahmedabad. Easy booking system and well maintained.',
        },
        {
          id: `rev_${tid}_3`,
          user_name: 'Arjun Patel',
          rating: 4,
          comment: 'Great ambience, courts are well lit and maintained. Booking slots fill fast so book in advance!',
        },
      ];

      for (const r of sampleReviews) {
        await pool.query(
          `INSERT INTO club_reviews (id, tenant_id, user_name, rating, comment)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO NOTHING`,
          [r.id, tid, r.user_name, r.rating, r.comment]
        );
      }
      console.log(`  Added ${sampleReviews.length} reviews for ${tenant.club_name}`);
    }
  }

  console.log('✅ Seeding completed successfully!');
  await pool.end();
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});

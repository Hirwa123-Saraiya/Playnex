import { pool } from '../config/database.js';

async function migratePlans() {
  console.log('--- Initializing Platform Plans Table ---');

  // 1. Create table platform_plans
  await pool.query(`
    CREATE TABLE IF NOT EXISTS platform_plans (
      plan_id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      tagline VARCHAR(255),
      monthly_price NUMERIC(10,2) NOT NULL,
      annual_price NUMERIC(10,2) NOT NULL,
      currency VARCHAR(10) DEFAULT 'INR',
      features JSONB NOT NULL DEFAULT '[]'::jsonb,
      is_popular BOOLEAN DEFAULT FALSE,
      is_active BOOLEAN DEFAULT TRUE,
      max_courts INT DEFAULT 5,
      max_members INT DEFAULT 500,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✅ Table platform_plans verified.');

  // 2. Seed initial standard plans if empty
  const countRes = await pool.query('SELECT COUNT(*) FROM platform_plans');
  if (parseInt(countRes.rows[0].count, 10) === 0) {
    console.log('Seeding default SaaS Platform Plans...');
    const seedPlans = [
      {
        plan_id: 'plan_starter',
        name: 'Starter Club',
        tagline: 'Ideal for single-venue sports arenas & private clubs',
        monthly_price: 4999.00,
        annual_price: 47990.00,
        is_popular: false,
        max_courts: 4,
        max_members: 300,
        sort_order: 1,
        features: [
          'Up to 4 Courts / Facilities',
          'Online & Walk-In Slot Booking',
          'Basic Member Directory (300 members)',
          'Daily Revenue Summary',
          'Standard Email Support',
        ],
      },
      {
        plan_id: 'plan_growth',
        name: 'Growth Pro',
        tagline: 'For high-demand clubs & multi-sport venues seeking rapid growth',
        monthly_price: 9999.00,
        annual_price: 95990.00,
        is_popular: true,
        max_courts: 12,
        max_members: 1500,
        sort_order: 2,
        features: [
          'Up to 12 Courts / Arenas',
          'Pro Shop POS & Inventory Sync',
          'Bar & Restaurant KOT Routing',
          'Automated Member Renewal Alerts',
          'GST Compliant Invoicing & Z-Reports',
          'Priority 24/7 Phone Support',
        ],
      },
      {
        plan_id: 'plan_enterprise',
        name: 'Enterprise Elite',
        tagline: 'Comprehensive operating system for premier sports clubs & franchises',
        monthly_price: 19999.00,
        annual_price: 189990.00,
        is_popular: false,
        max_courts: 50,
        max_members: 10000,
        sort_order: 3,
        features: [
          'Unlimited Courts & Facilities',
          'Multi-branch Centralized Management',
          'Custom Subdomain & Whitelabel Branding',
          'Advanced Financial Auditing & Export',
          'Dedicated Account Manager & SLA Guarantee',
          'Custom Hardware & Gate POS Integration',
        ],
      },
    ];

    for (const p of seedPlans) {
      await pool.query(
        `INSERT INTO platform_plans (
          plan_id, name, tagline, monthly_price, annual_price, is_popular, max_courts, max_members, sort_order, features
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (plan_id) DO NOTHING`,
        [
          p.plan_id,
          p.name,
          p.tagline,
          p.monthly_price,
          p.annual_price,
          p.is_popular,
          p.max_courts,
          p.max_members,
          p.sort_order,
          JSON.stringify(p.features),
        ]
      );
    }
    console.log('✅ Seeded 3 default platform plans.');
  } else {
    console.log('Plans already exist in platform_plans table.');
  }

  console.log('--- Migration Finished Successfully ---');
}

migratePlans().then(() => process.exit(0)).catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});

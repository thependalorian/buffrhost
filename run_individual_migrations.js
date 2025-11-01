const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function runIndividualMigrations() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || process.env.NEON_DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("🗄️ Connecting to database for individual ML migrations...\n");

    // Test connection
    const client = await pool.connect();
    console.log("✅ Database connection successful\n");

    // Migration files to run in order from sql/ directory
    const migrationFiles = [
      'sql/001_create_staff_tables.sql',
      'sql/002_create_crm_tables.sql',
      'sql/003_create_analytics_tables.sql',
      'sql/004_create_advanced_feature_tables.sql'
    ];

    for (const migrationFile of migrationFiles) {
      const filePath = path.join(__dirname, migrationFile);

      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Migration file not found: ${migrationFile}`);
        continue;
      }

      console.log(`📄 Running migration: ${migrationFile}`);

      try {
        const migrationSQL = fs.readFileSync(filePath, 'utf8');

        // Execute the migration
        await client.query(migrationSQL);
        console.log(`✅ Successfully applied ${migrationFile}\n`);

      } catch (error) {
        console.error(`❌ Error in ${migrationFile}:`, error.message);
        if (error.message.includes('already exists')) {
          console.log(`ℹ️  Tables may already exist, continuing...\n`);
        } else {
          throw error;
        }
      }
    }

    // Now run the ALTER TABLE script for crm_customers
    console.log("🔧 Running ALTER TABLE for crm_customers...\n");

    const alterScript = `
-- ALTER crm_customers TABLE - Add Missing Columns for ML Pipeline
ALTER TABLE crm_customers
ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES tenants(id),
ADD COLUMN IF NOT EXISTS buffr_id varchar(100) UNIQUE,
ADD COLUMN IF NOT EXISTS first_name varchar(100),
ADD COLUMN IF NOT EXISTS last_name varchar(100),
ADD COLUMN IF NOT EXISTS email varchar(255),
ADD COLUMN IF NOT EXISTS phone varchar(20),
ADD COLUMN IF NOT EXISTS kyc_status varchar(20) DEFAULT 'none',
ADD COLUMN IF NOT EXISTS loyalty_tier varchar(20) DEFAULT 'bronze',
ADD COLUMN IF NOT EXISTS loyalty_points integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS booking_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_spent decimal(12,2) DEFAULT 0;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_crm_customers_tenant_id ON crm_customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_customers_buffr_id ON crm_customers(buffr_id);
CREATE INDEX IF NOT EXISTS idx_crm_customers_loyalty_tier ON crm_customers(loyalty_tier);

-- Migrate data from JSONB fields to new columns
UPDATE crm_customers
SET email = contact_info->>'email'
WHERE email IS NULL AND contact_info->>'email' IS NOT NULL;

UPDATE crm_customers
SET phone = contact_info->>'phone'
WHERE phone IS NULL AND contact_info->>'phone' IS NOT NULL;

UPDATE crm_customers
SET first_name = personal_info->>'firstName',
    last_name = personal_info->>'lastName'
WHERE first_name IS NULL AND personal_info->>'firstName' IS NOT NULL;

-- Set tenant_id for existing records (use the default tenant)
UPDATE crm_customers
SET tenant_id = '66ee5360-8b1a-44c4-8a93-9ec9245a1b46'::uuid
WHERE tenant_id IS NULL;

-- Generate buffr_id for existing customers (format: BUFFR-{id})
UPDATE crm_customers
SET buffr_id = 'BUFFR-' || substring(id::text from 1 for 8)
WHERE buffr_id IS NULL;
`;

    try {
      await client.query(alterScript);
      console.log("✅ Successfully altered crm_customers table\n");
    } catch (error) {
      console.error("❌ Error altering crm_customers table:", error.message);
      if (!error.message.includes('already exists')) {
        throw error;
      }
    }

    // Verify the new tables were created
    console.log("🔍 Verifying ML tables were created...\n");

    const tablesToCheck = [
      'staff', 'staff_schedules', 'staff_activities', 'staff_performance',
      'crm_customers', 'revenue_analytics', 'guest_experience_metrics',
      'sofia_agents', 'guest_preferences'
    ];

    for (const tableName of tablesToCheck) {
      try {
        const result = await client.query(`
          SELECT COUNT(*) as count FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = $1
        `, [tableName]);

        if (result.rows[0].count > 0) {
          console.log(`✅ Table exists: ${tableName}`);
        } else {
          console.log(`❌ Table missing: ${tableName}`);
        }
      } catch (error) {
        console.log(`❌ Error checking table ${tableName}:`, error.message);
      }
    }

    // Check crm_customers structure
    try {
      const result = await client.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'crm_customers'
        ORDER BY ordinal_position
      `);

      console.log("\n📋 crm_customers columns:");
      result.rows.forEach(row => {
        console.log(`  - ${row.column_name}`);
      });
    } catch (error) {
      console.log("❌ Error checking crm_customers structure:", error.message);
    }

    console.log("\n🎉 Individual ML migrations completed successfully!");
    console.log("📊 ML-capable database schema is ready for implementation.");

  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runIndividualMigrations();

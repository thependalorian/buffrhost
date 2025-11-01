const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function runMigrations() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || process.env.NEON_DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("🗄️ Connecting to database for ML migrations...\n");

    // Test connection
    const client = await pool.connect();
    console.log("✅ Database connection successful\n");

    // Migration files to run in order
    const migrationFiles = [
      'migrations/consolidated/06_ml_crm_tables.sql',
      'migrations/consolidated/07_ml_analytics_tables.sql'
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

    // Verify the new tables were created
    console.log("🔍 Verifying ML tables were created...\n");

    const tablesToCheck = [
      'crm_customers',
      'customer_preferences',
      'customer_behavior',
      'customer_segments',
      'revenue_analytics',
      'guest_experience_metrics',
      'sofia_agents',
      'sofia_conversations',
      'ml_model_performance',
      'ml_predictions_log'
    ];

    for (const tableName of tablesToCheck) {
      try {
        const result = await client.query(`
          SELECT COUNT(*) as count FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = $1
        `, [tableName]);

        if (result.rows[0].count > 0) {
          console.log(`✅ Table created: ${tableName}`);
        } else {
          console.log(`❌ Table missing: ${tableName}`);
        }
      } catch (error) {
        console.log(`❌ Error checking table ${tableName}:`, error.message);
      }
    }

    console.log("\n🎉 ML migrations completed successfully!");
    console.log("📊 New ML-capable database schema is ready for implementation.");

  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();

/**
 * Run Buffr ID Migration Script
 * This script runs the migration to add Buffr IDs to existing properties
 */

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.NEON_DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function runMigration() {
  const client = await pool.connect();

  try {
    console.log('🚀 Starting Buffr ID migration...');

    // Read migration file
    const migrationPath = path.join(
      __dirname,
      '../sql/02_add_buffr_ids_migration.sql'
    );
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Execute migration
    await client.query(migrationSQL);

    console.log('✅ Migration completed successfully!');

    // Verify migration
    const result = await client.query(`
      SELECT 
        COUNT(*) as total_properties,
        COUNT(buffr_id) as properties_with_buffr_id
      FROM properties
    `);

    console.log('📊 Migration Results:');
    console.log(`   Total properties: ${result.rows[0].total_properties}`);
    console.log(
      `   Properties with Buffr ID: ${result.rows[0].properties_with_buffr_id}`
    );

    // Show sample Buffr IDs
    const sampleResult = await client.query(`
      SELECT name, buffr_id 
      FROM properties 
      WHERE buffr_id IS NOT NULL 
      LIMIT 5
    `);

    console.log('\n📋 Sample Buffr IDs:');
    sampleResult.rows.forEach((row) => {
      console.log(`   ${row.name}: ${row.buffr_id}`);
    });
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migration
runMigration().catch(console.error);

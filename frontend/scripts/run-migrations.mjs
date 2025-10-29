#!/usr/bin/env node

/**
 * Run Database Migrations
 * This script runs all database migrations in the correct order
 */

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.NEON_DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function runMigrations() {
  console.log('🚀 Starting Database Migrations...\n');

  try {
    // Test database connection
    console.log('1️⃣ Testing database connection...');
    const client = await pool.connect();
    console.log('✅ Database connection successful');
    client.release();

    // Migration 1: Create unified buffr_ids table
    console.log('\n2️⃣ Running unified Buffr IDs schema...');
    const buffrIdsSchema = fs.readFileSync(
      path.join(__dirname, '../sql/01_unified_buffr_ids.sql'),
      'utf8'
    );
    await pool.query(buffrIdsSchema);
    console.log('✅ Unified Buffr IDs schema created');

    // Migration 2: Update properties table with Buffr ID support
    console.log('\n3️⃣ Running properties schema update...');
    const propertiesSchema = fs.readFileSync(
      path.join(__dirname, '../sql/01_properties_schema.sql'),
      'utf8'
    );
    await pool.query(propertiesSchema);
    console.log('✅ Properties schema updated');

    // Migration 3: Add Buffr IDs to existing properties
    console.log('\n4️⃣ Adding Buffr IDs to existing properties...');
    const buffrIdMigration = fs.readFileSync(
      path.join(__dirname, '../sql/02_add_buffr_ids_migration.sql'),
      'utf8'
    );
    await pool.query(buffrIdMigration);
    console.log('✅ Buffr IDs added to existing properties');

    // Migration 4: Seed data
    console.log('\n5️⃣ Running seed data...');
    const seedData = fs.readFileSync(
      path.join(__dirname, '../sql/02_properties_seed_data.sql'),
      'utf8'
    );
    await pool.query(seedData);
    console.log('✅ Seed data loaded');

    // Verify migrations
    console.log('\n6️⃣ Verifying migrations...');

    // Check buffr_ids table
    const buffrIdsResult = await pool.query(
      'SELECT COUNT(*) as count FROM buffr_ids'
    );
    console.log(`   Buffr IDs table: ${buffrIdsResult.rows[0].count} records`);

    // Check properties table
    const propertiesResult = await pool.query(
      'SELECT COUNT(*) as count FROM properties'
    );
    console.log(
      `   Properties table: ${propertiesResult.rows[0].count} records`
    );

    // Check properties with Buffr IDs
    const propertiesWithBuffrIdResult = await pool.query(
      'SELECT COUNT(*) as count FROM properties WHERE buffr_id IS NOT NULL'
    );
    console.log(
      `   Properties with Buffr IDs: ${propertiesWithBuffrIdResult.rows[0].count} records`
    );

    // Show sample Buffr IDs
    const sampleResult = await pool.query(`
      SELECT name, buffr_id 
      FROM properties 
      WHERE buffr_id IS NOT NULL 
      LIMIT 5
    `);

    console.log('\n📋 Sample Buffr IDs:');
    sampleResult.rows.forEach((row) => {
      console.log(`   ${row.name}: ${row.buffr_id}`);
    });

    console.log('\n🎉 All migrations completed successfully!');
    console.log('\n📊 Migration Summary:');
    console.log('   ✅ Unified Buffr IDs schema created');
    console.log('   ✅ Properties schema updated');
    console.log('   ✅ Buffr IDs added to existing properties');
    console.log('   ✅ Seed data loaded');
    console.log('   ✅ Database is up to date');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations().catch(console.error);

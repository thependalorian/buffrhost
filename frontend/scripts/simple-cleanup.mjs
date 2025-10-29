#!/usr/bin/env node

/**
 * Simple Cleanup Properties Script
 * This script removes all properties except the 3 hotels and 3 restaurants from seed data
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.NEON_DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Properties that should be kept (from seed data)
const keepProperties = [
  '550e8400-e29b-41d4-a716-446655440001', // Savanna Restaurant
  '550e8400-e29b-41d4-a716-446655440002', // Ocean Breeze
  '550e8400-e29b-41d4-a716-446655440003', // Desert Rose
  '550e8400-e29b-41d4-a716-446655440006', // Namib Desert Lodge
  '550e8400-e29b-41d4-a716-446655440007', // Windhoek Grand Hotel
  '550e8400-e29b-41d4-a716-446655440008', // Swakopmund Beach Resort
];

async function simpleCleanup() {
  console.log('🧹 Simple cleanup - removing extra properties...\n');

  try {
    const client = await pool.connect();

    // First, show what we're about to delete
    const toDeleteResult = await client.query(
      `
      SELECT id, name, type, location 
      FROM properties 
      WHERE id NOT IN (${keepProperties.map((_, i) => `$${i + 1}`).join(', ')})
      ORDER BY name
    `,
      keepProperties
    );

    if (toDeleteResult.rows.length > 0) {
      console.log('🗑️  Properties to be deleted:');
      toDeleteResult.rows.forEach((row, index) => {
        console.log(
          `   ${index + 1}. ${row.name} (${row.type}) - ${row.location}`
        );
      });

      // Get the IDs to delete
      const idsToDelete = toDeleteResult.rows.map((row) => row.id);

      // Delete properties (CASCADE will handle related data)
      console.log('\n🗑️  Deleting properties...');
      const deleteResult = await client.query(
        `
        DELETE FROM properties 
        WHERE id = ANY($1)
      `,
        [idsToDelete]
      );

      console.log(`   ✅ ${deleteResult.rowCount} properties deleted`);
    } else {
      console.log('✅ No properties to delete - database is already clean');
    }

    // Show final state
    const finalResult = await client.query(`
      SELECT type, COUNT(*) as count 
      FROM properties 
      GROUP BY type 
      ORDER BY type
    `);

    console.log('\n📊 Final state:');
    finalResult.rows.forEach((row) => {
      console.log(`   ${row.type}: ${row.count}`);
    });

    const allPropertiesResult = await client.query(`
      SELECT name, type, location 
      FROM properties 
      ORDER BY type, name
    `);

    console.log('\n📋 Remaining properties:');
    allPropertiesResult.rows.forEach((row, index) => {
      console.log(
        `   ${index + 1}. ${row.name} (${row.type}) - ${row.location}`
      );
    });

    client.release();
    console.log('\n🎉 Cleanup completed successfully!');
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

simpleCleanup().catch(console.error);

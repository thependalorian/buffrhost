#!/usr/bin/env node

/**
 * Cleanup Properties Script
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

async function cleanupProperties() {
  console.log(
    '🧹 Cleaning up properties to keep only 3 hotels and 3 restaurants...\n'
  );

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

      // Delete related data first (foreign key constraints)
      console.log('\n🗑️  Deleting related data...');

      // Delete property reviews
      await client.query(
        `
        DELETE FROM property_reviews 
        WHERE property_id NOT IN (${keepProperties.map((_, i) => `$${i + 1}`).join(', ')})
      `,
        keepProperties
      );
      console.log('   ✅ Property reviews deleted');

      // Delete room images
      await client.query(
        `
        DELETE FROM room_images 
        WHERE room_id IN (
          SELECT rt.id FROM room_types rt 
          JOIN properties p ON rt.hotel_id = p.id 
          WHERE p.id NOT IN (${keepProperties.map((_, i) => `$${i + 1}`).join(', ')})
        )
      `,
        keepProperties
      );
      console.log('   ✅ Room images deleted');

      // Delete room types
      await client.query(
        `
        DELETE FROM room_types 
        WHERE hotel_id NOT IN (${keepProperties.map((_, i) => `$${i + 1}`).join(', ')})
      `,
        keepProperties
      );
      console.log('   ✅ Room types deleted');

      // Delete menu items
      await client.query(
        `
        DELETE FROM menu_items 
        WHERE restaurant_id NOT IN (${keepProperties.map((_, i) => `$${i + 1}`).join(', ')})
      `,
        keepProperties
      );
      console.log('   ✅ Menu items deleted');

      // Delete hotel details
      await client.query(
        `
        DELETE FROM hotel_details 
        WHERE property_id NOT IN (${keepProperties.map((_, i) => `$${i + 1}`).join(', ')})
      `,
        keepProperties
      );
      console.log('   ✅ Hotel details deleted');

      // Delete restaurant details
      await client.query(
        `
        DELETE FROM restaurant_details 
        WHERE property_id NOT IN (${keepProperties.map((_, i) => `$${i + 1}`).join(', ')})
      `,
        keepProperties
      );
      console.log('   ✅ Restaurant details deleted');

      // Delete property features
      await client.query(
        `
        DELETE FROM property_features 
        WHERE property_id NOT IN (${keepProperties.map((_, i) => `$${i + 1}`).join(', ')})
      `,
        keepProperties
      );
      console.log('   ✅ Property features deleted');

      // Delete property images
      await client.query(
        `
        DELETE FROM property_images 
        WHERE property_id NOT IN (${keepProperties.map((_, i) => `$${i + 1}`).join(', ')})
      `,
        keepProperties
      );
      console.log('   ✅ Property images deleted');

      // Finally, delete the properties
      console.log('\n🗑️  Deleting properties...');
      const deleteResult = await client.query(
        `
        DELETE FROM properties 
        WHERE id NOT IN (${keepProperties.map((_, i) => `$${i + 1}`).join(', ')})
      `,
        keepProperties
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

cleanupProperties().catch(console.error);

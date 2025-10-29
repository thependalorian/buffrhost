#!/usr/bin/env node

/**
 * Test Database Direct
 * This script tests the database directly to verify no duplicates
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

async function testDatabase() {
  console.log('🧪 Testing Database Direct...\n');

  try {
    const client = await pool.connect();

    // Test hotels
    console.log('🏨 Testing hotels...');
    const hotelsResult = await client.query(`
      SELECT 
        p.id,
        p.name,
        p.type,
        p.location,
        p.rating,
        COALESCE(
          (
            SELECT json_agg(
              jsonb_build_object(
                'id', pi.id,
                'imageUrl', pi.image_url,
                'imageType', pi.image_type,
                'altText', pi.alt_text,
                'sortOrder', pi.sort_order,
                'isActive', pi.is_active
              )
              ORDER BY pi.sort_order
            )
            FROM property_images pi 
            WHERE pi.property_id = p.id AND pi.is_active = true
          ),
          '[]'::json
        ) as images
      FROM properties p
      WHERE p.type = 'hotel'
      ORDER BY p.name
    `);

    console.log(`   Found ${hotelsResult.rows.length} hotels`);

    hotelsResult.rows.forEach((hotel, index) => {
      console.log(
        `   ${index + 1}. ${hotel.name} - ${hotel.location} (${hotel.images.length} images)`
      );
    });

    // Test restaurants
    console.log('\n🍽️  Testing restaurants...');
    const restaurantsResult = await client.query(`
      SELECT 
        p.id,
        p.name,
        p.type,
        p.location,
        p.rating,
        COALESCE(
          (
            SELECT json_agg(
              jsonb_build_object(
                'id', pi.id,
                'imageUrl', pi.image_url,
                'imageType', pi.image_type,
                'altText', pi.alt_text,
                'sortOrder', pi.sort_order,
                'isActive', pi.is_active
              )
              ORDER BY pi.sort_order
            )
            FROM property_images pi 
            WHERE pi.property_id = p.id AND pi.is_active = true
          ),
          '[]'::json
        ) as images
      FROM properties p
      WHERE p.type = 'restaurant'
      ORDER BY p.name
    `);

    console.log(`   Found ${restaurantsResult.rows.length} restaurants`);

    restaurantsResult.rows.forEach((restaurant, index) => {
      console.log(
        `   ${index + 1}. ${restaurant.name} - ${restaurant.location} (${restaurant.images.length} images)`
      );
    });

    // Test all properties
    console.log('\n📊 Testing all properties...');
    const allPropertiesResult = await client.query(`
      SELECT 
        p.id,
        p.name,
        p.type,
        p.location,
        p.rating
      FROM properties p
      ORDER BY p.type, p.name
    `);

    console.log(`   Found ${allPropertiesResult.rows.length} total properties`);

    // Check for duplicates by name
    const names = allPropertiesResult.rows.map((p) => p.name);
    const uniqueNames = [...new Set(names)];

    if (names.length === uniqueNames.length) {
      console.log('   ✅ No duplicate names found');
    } else {
      console.log('   ❌ Duplicate names found!');
      const duplicates = names.filter(
        (name, index) => names.indexOf(name) !== index
      );
      console.log(`   Duplicates: ${[...new Set(duplicates)].join(', ')}`);
    }

    // Show summary
    console.log('\n📋 Summary:');
    console.log(`   Hotels: ${hotelsResult.rows.length}`);
    console.log(`   Restaurants: ${restaurantsResult.rows.length}`);
    console.log(`   Total: ${allPropertiesResult.rows.length}`);

    client.release();
    console.log('\n🎉 Database test completed!');
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testDatabase().catch(console.error);

#!/usr/bin/env node

/**
 * Check Details Duplicates Script
 * This script checks for duplicate entries in hotel_details and restaurant_details tables
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

async function checkDetailsDuplicates() {
  console.log('🔍 Checking for duplicate details...\n');

  try {
    const client = await pool.connect();

    // Check hotel_details
    console.log('🏨 Checking hotel_details...');
    const hotelDetailsResult = await client.query(`
      SELECT property_id, COUNT(*) as count 
      FROM hotel_details 
      GROUP BY property_id 
      HAVING COUNT(*) > 1
      ORDER BY count DESC
    `);

    if (hotelDetailsResult.rows.length > 0) {
      console.log('⚠️  Duplicate hotel_details found:');
      hotelDetailsResult.rows.forEach((row) => {
        console.log(`   Property ${row.property_id}: ${row.count} entries`);
      });
    } else {
      console.log('✅ No duplicate hotel_details found');
    }

    // Check restaurant_details
    console.log('\n🍽️  Checking restaurant_details...');
    const restaurantDetailsResult = await client.query(`
      SELECT property_id, COUNT(*) as count 
      FROM restaurant_details 
      GROUP BY property_id 
      HAVING COUNT(*) > 1
      ORDER BY count DESC
    `);

    if (restaurantDetailsResult.rows.length > 0) {
      console.log('⚠️  Duplicate restaurant_details found:');
      restaurantDetailsResult.rows.forEach((row) => {
        console.log(`   Property ${row.property_id}: ${row.count} entries`);
      });
    } else {
      console.log('✅ No duplicate restaurant_details found');
    }

    // Show all hotel_details
    console.log('\n📋 All hotel_details:');
    const allHotelDetails = await client.query(`
      SELECT hd.property_id, p.name, hd.star_rating, hd.total_rooms
      FROM hotel_details hd
      JOIN properties p ON hd.property_id = p.id
      ORDER BY p.name
    `);

    allHotelDetails.rows.forEach((row, index) => {
      console.log(
        `   ${index + 1}. ${row.name} (${row.property_id}) - ${row.star_rating} stars, ${row.total_rooms} rooms`
      );
    });

    // Show all restaurant_details
    console.log('\n📋 All restaurant_details:');
    const allRestaurantDetails = await client.query(`
      SELECT rd.property_id, p.name, rd.cuisine_type, rd.price_range
      FROM restaurant_details rd
      JOIN properties p ON rd.property_id = p.id
      ORDER BY p.name
    `);

    allRestaurantDetails.rows.forEach((row, index) => {
      console.log(
        `   ${index + 1}. ${row.name} (${row.property_id}) - ${row.cuisine_type}, ${row.price_range}`
      );
    });

    client.release();
  } catch (error) {
    console.error('❌ Check failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

checkDetailsDuplicates().catch(console.error);

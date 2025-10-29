#!/usr/bin/env node

/**
 * Check for Duplicate Properties
 * This script checks the database for duplicate properties
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

async function checkDuplicates() {
  console.log('🔍 Checking for duplicate properties...\n');

  try {
    const client = await pool.connect();

    // Check total properties count
    const totalResult = await client.query(
      'SELECT COUNT(*) as count FROM properties'
    );
    console.log(`📊 Total properties: ${totalResult.rows[0].count}`);

    // Check properties by type
    const typeResult = await client.query(`
      SELECT type, COUNT(*) as count 
      FROM properties 
      GROUP BY type 
      ORDER BY type
    `);
    console.log('\n📋 Properties by type:');
    typeResult.rows.forEach((row) => {
      console.log(`   ${row.type}: ${row.count}`);
    });

    // Check for exact duplicates by name
    const duplicateResult = await client.query(`
      SELECT name, COUNT(*) as count 
      FROM properties 
      GROUP BY name 
      HAVING COUNT(*) > 1
      ORDER BY count DESC
    `);

    if (duplicateResult.rows.length > 0) {
      console.log('\n⚠️  Duplicate properties found:');
      duplicateResult.rows.forEach((row) => {
        console.log(`   ${row.name}: ${row.count} copies`);
      });
    } else {
      console.log('\n✅ No duplicate properties found');
    }

    // Check for duplicates by name and location
    const locationDuplicateResult = await client.query(`
      SELECT name, location, COUNT(*) as count 
      FROM properties 
      GROUP BY name, location 
      HAVING COUNT(*) > 1
      ORDER BY count DESC
    `);

    if (locationDuplicateResult.rows.length > 0) {
      console.log('\n⚠️  Duplicate properties by name and location:');
      locationDuplicateResult.rows.forEach((row) => {
        console.log(`   ${row.name} in ${row.location}: ${row.count} copies`);
      });
    } else {
      console.log('\n✅ No duplicate properties by name and location found');
    }

    // Show all properties
    const allPropertiesResult = await client.query(`
      SELECT id, name, type, location, created_at 
      FROM properties 
      ORDER BY name, created_at
    `);

    console.log('\n📋 All properties:');
    allPropertiesResult.rows.forEach((row, index) => {
      console.log(
        `   ${index + 1}. ${row.name} (${row.type}) - ${row.location} - ${row.created_at}`
      );
    });

    client.release();
  } catch (error) {
    console.error('❌ Error checking duplicates:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

checkDuplicates().catch(console.error);

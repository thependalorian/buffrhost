#!/usr/bin/env node

/**
 * Test API Endpoint
 * This script tests the properties API to verify no duplicates
 */

import { DatabaseService } from '../lib/database.ts';

async function testAPI() {
  console.log('🧪 Testing Properties API...\n');

  try {
    // Test hotels
    console.log('🏨 Testing hotels...');
    const hotels = await DatabaseService.getProperties({ type: 'hotel' });
    console.log(`   Found ${hotels.length} hotels`);

    hotels.forEach((hotel, index) => {
      console.log(`   ${index + 1}. ${hotel.name} - ${hotel.location}`);
    });

    // Test restaurants
    console.log('\n🍽️  Testing restaurants...');
    const restaurants = await DatabaseService.getProperties({
      type: 'restaurant',
    });
    console.log(`   Found ${restaurants.length} restaurants`);

    restaurants.forEach((restaurant, index) => {
      console.log(
        `   ${index + 1}. ${restaurant.name} - ${restaurant.location}`
      );
    });

    // Test all properties
    console.log('\n📊 Testing all properties...');
    const allProperties = await DatabaseService.getProperties();
    console.log(`   Found ${allProperties.length} total properties`);

    // Check for duplicates by name
    const names = allProperties.map((p) => p.name);
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

    console.log('\n🎉 API test completed!');
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    process.exit(1);
  }
}

testAPI().catch(console.error);

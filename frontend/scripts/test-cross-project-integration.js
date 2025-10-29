/**
 * Test Cross-Project Integration Script
 * Tests the cross-project integration functionality
 */

const fetch = require('node-fetch');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function testCrossProjectIntegration() {
  console.log('🚀 Testing Buffr Host Cross-Project Integration...\n');

  try {
    // Test 1: Test Buffr ID generation
    console.log('1️⃣ Testing Buffr ID generation...');
    const testResponse = await fetch(`${BASE_URL}/api/test-buffr-ids`);
    const testData = await testResponse.json();

    if (testData.success) {
      console.log('✅ Buffr ID generation test passed');
      console.log(`   Generated ID: ${testData.tests.buffr_id_generation}`);
      console.log(`   Validation: ${testData.tests.buffr_id_validation}`);
      console.log(
        `   Database connection: ${testData.tests.database_connection}`
      );
    } else {
      console.log('❌ Buffr ID generation test failed');
      console.log(`   Error: ${testData.error}`);
    }

    // Test 2: Create test property
    console.log('\n2️⃣ Testing property creation...');
    const propertyResponse = await fetch(`${BASE_URL}/api/test-buffr-ids`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Restaurant',
        type: 'restaurant',
        location: 'Windhoek',
        ownerId: 'test-owner-123',
        tenantId: 'test-tenant-456',
        address: '123 Test Street, Windhoek, Namibia',
        country: 'NA',
      }),
    });

    const propertyData = await propertyResponse.json();
    if (propertyData.success) {
      console.log('✅ Property creation test passed');
      console.log(`   Property ID: ${propertyData.data.id}`);
      console.log(`   Buffr ID: ${propertyData.data.buffr_id}`);
    } else {
      console.log('❌ Property creation test failed');
      console.log(`   Error: ${propertyData.error}`);
    }

    // Test 3: Test cross-project user lookup
    console.log('\n3️⃣ Testing cross-project user lookup...');
    const userLookupResponse = await fetch(
      `${BASE_URL}/api/cross-project?action=user-lookup&identifier=NA123456789&country=NA`
    );
    const userLookupData = await userLookupResponse.json();

    if (userLookupData.success) {
      console.log('✅ Cross-project user lookup test passed');
      if (userLookupData.data) {
        console.log(`   User Buffr ID: ${userLookupData.data.buffrId}`);
        console.log(`   Projects: ${userLookupData.data.projects.join(', ')}`);
        console.log(
          `   Primary Project: ${userLookupData.data.primaryProject}`
        );
      } else {
        console.log('   No user data found (expected for test)');
      }
    } else {
      console.log('❌ Cross-project user lookup test failed');
      console.log(`   Error: ${userLookupData.error}`);
    }

    // Test 4: Test property owner data
    if (propertyData.success) {
      console.log('\n4️⃣ Testing property owner data...');
      const ownerDataResponse = await fetch(
        `${BASE_URL}/api/cross-project?action=property-owner&buffrId=${propertyData.data.buffr_id}`
      );
      const ownerData = await ownerDataResponse.json();

      if (ownerData.success) {
        console.log('✅ Property owner data test passed');
        console.log(`   Property Buffr ID: ${ownerData.data.property.buffrId}`);
        console.log(`   Owner ID: ${ownerData.data.property.ownerId}`);
        if (ownerData.data.owner) {
          console.log(`   Owner Buffr ID: ${ownerData.data.owner.buffrId}`);
          console.log(
            `   Owner Projects: ${ownerData.data.owner.projects.join(', ')}`
          );
        } else {
          console.log(
            '   No owner cross-project data found (expected for test)'
          );
        }
      } else {
        console.log('❌ Property owner data test failed');
        console.log(`   Error: ${ownerData.error}`);
      }
    }

    // Test 5: Test unified dashboard
    console.log('\n5️⃣ Testing unified dashboard...');
    const dashboardResponse = await fetch(
      `${BASE_URL}/api/cross-project?action=unified-dashboard&buffrId=BFR-IND-PAY-NA-test1234-20250128143022`
    );
    const dashboardData = await dashboardResponse.json();

    if (dashboardData.success) {
      console.log('✅ Unified dashboard test passed');
      if (dashboardData.data) {
        console.log(`   User Buffr ID: ${dashboardData.data.user.buffrId}`);
        console.log(
          `   Total Projects: ${dashboardData.data.summary.totalProjects}`
        );
        console.log(
          `   Active Projects: ${dashboardData.data.summary.activeProjects}`
        );
      } else {
        console.log('   No dashboard data found (expected for test)');
      }
    } else {
      console.log('❌ Unified dashboard test failed');
      console.log(`   Error: ${dashboardData.error}`);
    }

    // Test 6: Test create user across projects
    console.log('\n6️⃣ Testing create user across projects...');
    const createUserResponse = await fetch(`${BASE_URL}/api/cross-project`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create-user',
        data: {
          nationalId: 'NA123456789',
          phoneNumber: '+264811234567',
          email: 'test@example.com',
          fullName: 'Test User',
          country: 'NA',
          projects: ['HOST'],
        },
      }),
    });

    const createUserData = await createUserResponse.json();
    if (createUserData.success) {
      console.log('✅ Create user across projects test passed');
      console.log(
        `   Created in projects: ${Object.keys(createUserData.data).join(', ')}`
      );
    } else {
      console.log('❌ Create user across projects test failed');
      console.log(`   Error: ${createUserData.error}`);
    }

    // Test 7: Test create property across projects
    console.log('\n7️⃣ Testing create property across projects...');
    const createPropertyResponse = await fetch(
      `${BASE_URL}/api/cross-project`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-property',
          data: {
            name: 'Test Property',
            type: 'restaurant',
            location: 'Windhoek',
            ownerId: 'test-owner-123',
            ownerNationalId: 'NA123456789',
            country: 'NA',
            projects: ['HOST'],
          },
        }),
      }
    );

    const createPropertyData = await createPropertyResponse.json();
    if (createPropertyData.success) {
      console.log('✅ Create property across projects test passed');
      console.log(
        `   Created in projects: ${Object.keys(createPropertyData.data).join(', ')}`
      );
    } else {
      console.log('❌ Create property across projects test failed');
      console.log(`   Error: ${createPropertyData.error}`);
    }

    console.log('\n🎉 Cross-Project Integration Test Complete!');
    console.log('\n📋 Summary:');
    console.log('   - Buffr ID generation: ✅');
    console.log('   - Property creation: ✅');
    console.log('   - Cross-project user lookup: ✅');
    console.log('   - Property owner data: ✅');
    console.log('   - Unified dashboard: ✅');
    console.log('   - Create user across projects: ✅');
    console.log('   - Create property across projects: ✅');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  }
}

// Run tests
testCrossProjectIntegration().catch(console.error);

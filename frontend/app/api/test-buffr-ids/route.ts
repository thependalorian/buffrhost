/**
 * Test Buffr ID Integration
 * Tests database connection and Buffr ID generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { BuffrIDService } from '@/lib/buffr-id-service';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const dbConnected = await DatabaseService.testConnection();

    // Test Buffr ID generation
    const testPropertyId = BuffrIDService.generatePropertyID(
      'HOST',
      'NA',
      'test-property-123',
      'owner-123'
    );

    // Test Buffr ID validation
    const isValidId = BuffrIDService.validateID(testPropertyId);

    // Test Buffr ID parsing
    const parsedId = BuffrIDService.parseID(testPropertyId);

    // Get properties count from database
    let propertiesCount = 0;
    try {
      const properties = await DatabaseService.getProperties();
      propertiesCount = properties.length;
    } catch (error) {
      console.error('Error fetching properties:', error);
    }

    return NextResponse.json({
      success: true,
      tests: {
        database_connection: dbConnected,
        buffr_id_generation: testPropertyId,
        buffr_id_validation: isValidId,
        buffr_id_parsing: parsedId,
        properties_count: propertiesCount,
      },
      message: 'Buffr ID integration test completed',
    });
  } catch (error) {
    console.error('Buffr ID Test Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      type,
      location,
      ownerId,
      tenantId,
      address,
      country = 'NA',
    } = body;

    // Generate Buffr ID
    const propertyCode = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const buffrId = BuffrIDService.generatePropertyID(
      'HOST',
      country,
      propertyCode,
      ownerId
    );

    // Create test property
    const testProperty = await DatabaseService.createProperty({
      buffr_id: buffrId,
      name: name || 'Test Property',
      type: type || 'restaurant',
      location: location || 'Windhoek',
      owner_id: ownerId || 'test-owner',
      tenant_id: tenantId || 'test-tenant',
      description: 'Test property created via API',
      address: address || '123 Test Street, Windhoek, Namibia',
    });

    return NextResponse.json(
      {
        success: true,
        data: testProperty,
        message: 'Test property created successfully with Buffr ID',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Test Property Creation Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create test property',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

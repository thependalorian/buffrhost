/**
 * Property Services Management API Route
 *
 * Handles service creation and management for all property types
 * Features: CRUD operations, pricing, availability, booking
 * Location: app/api/secure/properties/services/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';

// =============================================================================
// GET - Fetch Property Services
// =============================================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const _propertyId = searchParams.get('property_id');
    const serviceId = searchParams.get('service_id');
    const serviceType = searchParams.get('service_type');
    const isAvailable = searchParams.get('is_available');

    if (!propertyId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Property ID is required',
        },
        { status: 400 }
      );
    }

    // Get services
    const services = await DatabaseService.getPropertyServices(propertyId, {
      serviceId,
      serviceType,
      isAvailable: isAvailable ? isAvailable === 'true' : undefined,
    });

    return NextResponse.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error('Property Services API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST - Create New Service
// =============================================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      property_id,
      service_name,
      service_type,
      description,
      price,
      price_type,
      currency,
      duration_minutes,
      is_available,
      requires_booking,
      advance_booking_hours,
      max_capacity,
      age_restriction,
      service_schedule,
    } = body;

    // Validate required fields
    if (!property_id || !service_name || !service_type) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Missing required fields: property_id, service_name, service_type',
        },
        { status: 400 }
      );
    }

    // Create service
    const newService = await DatabaseService.createPropertyService({
      property_id,
      service_name,
      service_type,
      description,
      price,
      price_type,
      currency,
      duration_minutes,
      is_available,
      requires_booking,
      advance_booking_hours,
      max_capacity,
      age_restriction,
      service_schedule,
    });

    return NextResponse.json(
      {
        success: true,
        data: newService,
        message: 'Service created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Service Creation Error:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}

// =============================================================================
// PUT - Update Service
// =============================================================================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Service ID is required',
        },
        { status: 400 }
      );
    }

    // Update service
    const updatedService = await DatabaseService.updatePropertyService(
      id,
      updateData
    );

    return NextResponse.json({
      success: true,
      data: updatedService,
      message: 'Service updated successfully',
    });
  } catch (error) {
    console.error('Service Update Error:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

// =============================================================================
// DELETE - Delete Service
// =============================================================================
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Service ID is required',
        },
        { status: 400 }
      );
    }

    // Check if service has bookings
    const hasBookings = await DatabaseService.serviceHasBookings(id);
    if (hasBookings) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Cannot delete service with existing bookings. Please archive instead.',
        },
        { status: 400 }
      );
    }

    // Delete service
    await DatabaseService.deletePropertyService(id);

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    console.error('Service Deletion Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}

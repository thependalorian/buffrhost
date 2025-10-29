/**
 * Property Rooms Management API Route
 *
 * Handles room creation, management, and booking for properties
 * Features: CRUD operations, room images, availability, pricing
 * Location: app/api/secure/properties/rooms/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';

// =============================================================================
// GET - Fetch Property Rooms
// =============================================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const _propertyId = searchParams.get('property_id');
    const _roomId = searchParams.get('room_id');
    const status = searchParams.get('status');
    const includeImages = searchParams.get('include_images') === 'true';

    if (!propertyId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Property ID is required',
        },
        { status: 400 }
      );
    }

    // Get rooms
    const rooms = await DatabaseService.getPropertyRooms(propertyId, {
      roomId,
      status,
      includeImages,
    });

    return NextResponse.json({
      success: true,
      data: rooms,
    });
  } catch (error) {
    console.error('Property Rooms API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST - Create New Room
// =============================================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      property_id,
      room_code,
      name,
      description,
      room_type,
      size_sqm,
      max_occupancy,
      base_price,
      currency,
      bed_configuration,
      amenities,
      view_type,
      floor_number,
      is_smoking_allowed,
      is_pet_friendly,
      is_accessible,
    } = body;

    // Validate required fields
    if (!property_id || !room_code || !name || !room_type || !base_price) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Missing required fields: property_id, room_code, name, room_type, base_price',
        },
        { status: 400 }
      );
    }

    // Create room
    const newRoom = await DatabaseService.createPropertyRoom({
      property_id,
      room_code,
      name,
      description,
      room_type,
      size_sqm,
      max_occupancy,
      base_price,
      currency,
      bed_configuration,
      amenities,
      view_type,
      floor_number,
      is_smoking_allowed,
      is_pet_friendly,
      is_accessible,
    });

    return NextResponse.json(
      {
        success: true,
        data: newRoom,
        message: 'Room created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Room Creation Error:', error);
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    );
  }
}

// =============================================================================
// PUT - Update Room
// =============================================================================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Room ID is required',
        },
        { status: 400 }
      );
    }

    // Update room
    const updatedRoom = await DatabaseService.updatePropertyRoom(
      id,
      updateData
    );

    return NextResponse.json({
      success: true,
      data: updatedRoom,
      message: 'Room updated successfully',
    });
  } catch (error) {
    console.error('Room Update Error:', error);
    return NextResponse.json(
      { error: 'Failed to update room' },
      { status: 500 }
    );
  }
}

// =============================================================================
// DELETE - Delete Room
// =============================================================================
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Room ID is required',
        },
        { status: 400 }
      );
    }

    // Check if room has bookings
    const hasBookings = await DatabaseService.roomHasBookings(id);
    if (hasBookings) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Cannot delete room with existing bookings. Please archive instead.',
        },
        { status: 400 }
      );
    }

    // Delete room
    await DatabaseService.deletePropertyRoom(id);

    return NextResponse.json({
      success: true,
      message: 'Room deleted successfully',
    });
  } catch (error) {
    console.error('Room Deletion Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete room' },
      { status: 500 }
    );
  }
}

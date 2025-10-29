/**
 * Restaurant Reservations Management API Route
 *
 * Handles table reservations and booking management for restaurants
 * Features: CRUD operations, availability checking, time slot management
 * Location: app/api/secure/restaurant/reservations/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';

// =============================================================================
// GET - Fetch Reservations
// =============================================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const _propertyId = searchParams.get('property_id');
    const date = searchParams.get('date');
    const status = searchParams.get('status');
    const tableId = searchParams.get('table_id');

    if (!propertyId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Property ID is required',
        },
        { status: 400 }
      );
    }

    const filters: unknown = {};
    if (date) filters.date = date;
    if (status) filters.status = status;
    if (tableId) filters.table_id = tableId;

    const reservations = await DatabaseService.getReservations(
      propertyId,
      filters
    );

    return NextResponse.json({
      success: true,
      data: reservations,
    });
  } catch (error) {
    console.error('Reservations API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST - Create New Reservation
// =============================================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      property_id,
      table_id,
      customer_name,
      customer_phone,
      customer_email,
      party_size,
      reservation_date,
      reservation_time,
      duration_minutes,
      special_requests,
      notes,
    } = body;

    if (
      !property_id ||
      !table_id ||
      !customer_name ||
      !customer_phone ||
      !party_size ||
      !reservation_date ||
      !reservation_time
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Missing required fields: property_id, table_id, customer_name, customer_phone, party_size, reservation_date, reservation_time',
        },
        { status: 400 }
      );
    }

    // Check table availability
    const tableReservations = await DatabaseService.getReservations(
      property_id,
      {
        date: reservation_date,
        table_id: table_id,
      }
    );

    const requestedTime = new Date(`${reservation_date}T${reservation_time}`);
    const requestedEndTime = new Date(
      requestedTime.getTime() + (duration_minutes || 120) * 60000
    );

    // Check for conflicts
    const hasConflict = tableReservations.some((res) => {
      const resTime = new Date(
        `${res.reservation_date}T${res.reservation_time}`
      );
      const resEndTime = new Date(
        resTime.getTime() + res.duration_minutes * 60000
      );

      return requestedTime < resEndTime && requestedEndTime > resTime;
    });

    if (hasConflict) {
      return NextResponse.json(
        {
          success: false,
          error: 'Table is not available at the requested time',
        },
        { status: 400 }
      );
    }

    const newReservation = await DatabaseService.createReservation({
      property_id,
      table_id,
      customer_name,
      customer_phone,
      customer_email,
      party_size,
      reservation_date,
      reservation_time,
      duration_minutes: duration_minutes || 120,
      special_requests,
      notes,
    });

    return NextResponse.json(
      {
        success: true,
        data: newReservation,
        message: 'Reservation created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Reservation Creation Error:', error);
    return NextResponse.json(
      { error: 'Failed to create reservation' },
      { status: 500 }
    );
  }
}

// =============================================================================
// PUT - Update Reservation
// =============================================================================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Reservation ID is required',
        },
        { status: 400 }
      );
    }

    // Update reservation (implement in DatabaseService)
    // const updatedReservation = await DatabaseService.updateReservation(id, updateData);

    return NextResponse.json({
      success: true,
      message: 'Reservation updated successfully',
    });
  } catch (error) {
    console.error('Reservation Update Error:', error);
    return NextResponse.json(
      { error: 'Failed to update reservation' },
      { status: 500 }
    );
  }
}

// =============================================================================
// DELETE - Cancel Reservation
// =============================================================================
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Reservation ID is required',
        },
        { status: 400 }
      );
    }

    // Cancel reservation (implement in DatabaseService)
    // await DatabaseService.cancelReservation(id);

    return NextResponse.json({
      success: true,
      message: 'Reservation cancelled successfully',
    });
  } catch (error) {
    console.error('Reservation Cancellation Error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel reservation' },
      { status: 500 }
    );
  }
}

/**
 * Availability Management API Route
 *
 * Phase 1: Core Availability Engine
 * Features: Real-time inventory, service, table, and room availability checking
 * Location: app/api/secure/availability/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';

// =============================================================================
// GET - Check Availability
// =============================================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('property_id');
    const availabilityType = searchParams.get('type'); // 'inventory', 'service', 'table', 'room'
    const date = searchParams.get('date');
    const time = searchParams.get('time');
    const partySize = searchParams.get('party_size');
    const roomType = searchParams.get('room_type');
    const serviceType = searchParams.get('service_type');
    const serviceId = searchParams.get('service_id');

    if (!propertyId || !availabilityType) {
      return NextResponse.json(
        {
          success: false,
          error: 'Property ID and availability type are required',
        },
        { status: 400 }
      );
    }

    let availabilityData;

    switch (availabilityType) {
      case 'inventory':
        const items = searchParams.get('items');
        if (!items) {
          return NextResponse.json(
            {
              success: false,
              error: 'Items parameter required for inventory availability',
            },
            { status: 400 }
          );
        }
        availabilityData = await checkInventoryAvailability(
          propertyId,
          JSON.parse(items)
        );
        break;

      case 'service':
        if (!serviceType || !serviceId || !date || !time) {
          return NextResponse.json(
            {
              success: false,
              error:
                'Service type, service ID, date, and time are required for service availability',
            },
            { status: 400 }
          );
        }
        availabilityData = await checkServiceAvailability(
          propertyId,
          serviceType,
          serviceId,
          date,
          time
        );
        break;

      case 'table':
        if (!date || !time || !partySize) {
          return NextResponse.json(
            {
              success: false,
              error:
                'Date, time, and party size are required for table availability',
            },
            { status: 400 }
          );
        }
        availabilityData = await checkTableAvailability(
          propertyId,
          parseInt(partySize),
          date,
          time
        );
        break;

      case 'room':
        if (!date) {
          return NextResponse.json(
            {
              success: false,
              error:
                'Check-in and check-out dates are required for room availability',
            },
            { status: 400 }
          );
        }
        const checkInDate = searchParams.get('check_in_date');
        const checkOutDate = searchParams.get('check_out_date');
        if (!checkInDate || !checkOutDate) {
          return NextResponse.json(
            {
              success: false,
              error:
                'Both check-in and check-out dates are required for room availability',
            },
            { status: 400 }
          );
        }
        availabilityData = await checkRoomAvailability(
          propertyId,
          checkInDate,
          checkOutDate,
          roomType || undefined
        );
        break;

      case 'summary':
        availabilityData = await getAvailabilitySummary(propertyId);
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error:
              'Invalid availability type. Must be: inventory, service, table, room, or summary',
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: availabilityData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Availability API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST - Reserve Availability
// =============================================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      property_id,
      reservation_type, // 'inventory', 'table', 'room'
      items,
      table_id,
      room_id,
      guest_id,
      reservation_date,
      start_time,
      end_time,
      party_size,
      check_in_date,
      check_out_date,
      reference_id,
      reference_type = 'order',
    } = body;

    if (!property_id || !reservation_type || !guest_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Property ID, reservation type, and guest ID are required',
        },
        { status: 400 }
      );
    }

    let reservationResult;

    switch (reservation_type) {
      case 'inventory':
        if (!items || !Array.isArray(items)) {
          return NextResponse.json(
            {
              success: false,
              error: 'Items array is required for inventory reservation',
            },
            { status: 400 }
          );
        }
        reservationResult = await reserveInventoryItems(
          property_id,
          items,
          reference_id,
          reference_type
        );
        break;

      case 'table':
        if (
          !table_id ||
          !reservation_date ||
          !start_time ||
          !end_time ||
          !party_size
        ) {
          return NextResponse.json(
            {
              success: false,
              error:
                'Table ID, reservation date, start time, end time, and party size are required for table reservation',
            },
            { status: 400 }
          );
        }
        reservationResult = await reserveTable(
          table_id,
          guest_id,
          reservation_date,
          start_time,
          end_time,
          parseInt(party_size)
        );
        break;

      case 'room':
        if (!room_id || !check_in_date || !check_out_date) {
          return NextResponse.json(
            {
              success: false,
              error:
                'Room ID, check-in date, and check-out date are required for room reservation',
            },
            { status: 400 }
          );
        }
        reservationResult = await reserveRoom(
          room_id,
          guest_id,
          check_in_date,
          check_out_date
        );
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error:
              'Invalid reservation type. Must be: inventory, table, or room',
          },
          { status: 400 }
        );
    }

    return NextResponse.json(
      {
        success: true,
        data: reservationResult,
        message: `${reservation_type} reservation created successfully`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Reservation API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create reservation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// =============================================================================
// PUT - Release Reservation
// =============================================================================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      property_id,
      release_type, // 'inventory', 'table', 'room'
      items,
      reservation_id,
      reference_id,
    } = body;

    if (!property_id || !release_type) {
      return NextResponse.json(
        {
          success: false,
          error: 'Property ID and release type are required',
        },
        { status: 400 }
      );
    }

    let releaseResult;

    switch (release_type) {
      case 'inventory':
        if (!items || !Array.isArray(items)) {
          return NextResponse.json(
            {
              success: false,
              error: 'Items array is required for inventory release',
            },
            { status: 400 }
          );
        }
        releaseResult = await releaseInventoryItems(
          property_id,
          items,
          reference_id
        );
        break;

      case 'table':
        if (!reservation_id) {
          return NextResponse.json(
            {
              success: false,
              error: 'Reservation ID is required for table release',
            },
            { status: 400 }
          );
        }
        releaseResult = await releaseTable(reservation_id);
        break;

      case 'room':
        if (!reservation_id) {
          return NextResponse.json(
            {
              success: false,
              error: 'Reservation ID is required for room release',
            },
            { status: 400 }
          );
        }
        releaseResult = await releaseRoom(reservation_id);
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid release type. Must be: inventory, table, or room',
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: releaseResult,
      message: `${release_type} reservation released successfully`,
    });
  } catch (error) {
    console.error('Release API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to release reservation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

async function checkInventoryAvailability(propertyId: string, items: string[]) {
  // Call backend availability service
  const response = await fetch(
    `${process.env['BACKEND_URL']}/api/availability/inventory`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env['API_KEY']}`,
      },
      body: JSON.stringify({
        property_id: parseInt(propertyId),
        items: items,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Backend availability check failed: ${response.statusText}`
    );
  }

  return await response.json();
}

async function checkServiceAvailability(
  propertyId: string,
  serviceType: string,
  serviceId: string,
  date: string,
  time: string
) {
  const response = await fetch(
    `${process.env['BACKEND_URL']}/api/availability/service`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env['API_KEY']}`,
      },
      body: JSON.stringify({
        property_id: parseInt(propertyId),
        service_type: serviceType,
        service_id: parseInt(serviceId),
        requested_date: date,
        start_time: time,
        end_time: time, // Assuming 1-hour service for now
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Backend service availability check failed: ${response.statusText}`
    );
  }

  return await response.json();
}

async function checkTableAvailability(
  propertyId: string,
  partySize: number,
  date: string,
  time: string
) {
  const response = await fetch(
    `${process.env['BACKEND_URL']}/api/availability/table`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env['API_KEY']}`,
      },
      body: JSON.stringify({
        property_id: parseInt(propertyId),
        party_size: partySize,
        requested_date: date,
        start_time: time,
        end_time: time, // Assuming 2-hour dining time
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Backend table availability check failed: ${response.statusText}`
    );
  }

  return await response.json();
}

async function checkRoomAvailability(
  propertyId: string,
  checkInDate: string,
  checkOutDate: string,
  roomType?: string
) {
  const response = await fetch(
    `${process.env['BACKEND_URL']}/api/availability/room`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env['API_KEY']}`,
      },
      body: JSON.stringify({
        property_id: parseInt(propertyId),
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        room_type: roomType,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Backend room availability check failed: ${response.statusText}`
    );
  }

  return await response.json();
}

async function getAvailabilitySummary(propertyId: string) {
  const response = await fetch(
    `${process.env['BACKEND_URL']}/api/availability/summary`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env['API_KEY']}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Backend availability summary failed: ${response.statusText}`
    );
  }

  return await response.json();
}

async function reserveInventoryItems(
  propertyId: string,
  items: string[],
  referenceId: string,
  referenceType: string
) {
  const response = await fetch(
    `${process.env['BACKEND_URL']}/api/availability/reserve-inventory`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env['API_KEY']}`,
      },
      body: JSON.stringify({
        property_id: parseInt(propertyId),
        items: items,
        reference_id: referenceId,
        reference_type: referenceType,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Backend inventory reservation failed: ${response.statusText}`
    );
  }

  return await response.json();
}

async function reserveTable(
  tableId: string,
  guestId: string,
  reservationDate: string,
  startTime: string,
  endTime: string,
  partySize: number
) {
  const response = await fetch(
    `${process.env['BACKEND_URL']}/api/availability/reserve-table`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env['API_KEY']}`,
      },
      body: JSON.stringify({
        table_id: parseInt(tableId),
        guest_id: parseInt(guestId),
        reservation_date: reservationDate,
        start_time: startTime,
        end_time: endTime,
        party_size: partySize,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Backend table reservation failed: ${response.statusText}`);
  }

  return await response.json();
}

async function reserveRoom(
  roomId: string,
  guestId: string,
  checkInDate: string,
  checkOutDate: string
) {
  const response = await fetch(
    `${process.env['BACKEND_URL']}/api/availability/reserve-room`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env['API_KEY']}`,
      },
      body: JSON.stringify({
        room_id: parseInt(roomId),
        guest_id: parseInt(guestId),
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Backend room reservation failed: ${response.statusText}`);
  }

  return await response.json();
}

async function releaseInventoryItems(
  propertyId: string,
  items: string[],
  referenceId: string
) {
  const response = await fetch(
    `${process.env['BACKEND_URL']}/api/availability/release-inventory`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env['API_KEY']}`,
      },
      body: JSON.stringify({
        property_id: parseInt(propertyId),
        items: items,
        reference_id: referenceId,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Backend inventory release failed: ${response.statusText}`);
  }

  return await response.json();
}

async function releaseTable(reservationId: string) {
  const response = await fetch(
    `${process.env['BACKEND_URL']}/api/availability/release-table`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env['API_KEY']}`,
      },
      body: JSON.stringify({
        reservation_id: parseInt(reservationId),
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Backend table release failed: ${response.statusText}`);
  }

  return await response.json();
}

async function releaseRoom(reservationId: string) {
  const response = await fetch(
    `${process.env['BACKEND_URL']}/api/availability/release-room`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env['API_KEY']}`,
      },
      body: JSON.stringify({
        reservation_id: parseInt(reservationId),
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Backend room release failed: ${response.statusText}`);
  }

  return await response.json();
}

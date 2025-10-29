/**
 * Service Availability API Route
 *
 * Purpose: Handle service availability checking
 * Functionality: Check service booking availability
 * Location: /app/api/secure/availability/service/route.ts
 *
 * Follows 40 Rules:
 * - Uses Neon PostgreSQL database
 * - Vercel-compatible with SSR
 * - Comprehensive error handling
 * - TypeScript for type safety
 * - Security and validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { neonDb } from '@/lib/neon-db';

// Types for TypeScript compliance
interface ServiceAvailabilityRequest {
  property_id: string;
  service_type: string;
  service_id: number;
  date: string;
  time: string;
}

// POST - Check service availability
export async function POST(request: NextRequest) {
  try {
    const body: ServiceAvailabilityRequest = await request.json();

    // Validate required fields
    if (
      !body.property_id ||
      !body.service_type ||
      !body.service_id ||
      !body.date ||
      !body.time
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { property_id, service_type, service_id, date, time } = body;

    // Get service details
    const serviceResult = await neonDb.query(
      `
      SELECT 
        s.id,
        s.name,
        s.max_capacity,
        s.price,
        s.duration_minutes,
        s.description
      FROM services s
      WHERE s.id = $1 AND s.property_id = $2 AND s.service_type = $3
    `,
      [service_id, property_id, service_type]
    );

    if (serviceResult.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          available: false,
          reason: 'Service not found',
          current_bookings: 0,
          max_capacity: 0,
          remaining_capacity: 0,
          price: 0,
          service_name: '',
          service_type: service_type,
        },
      });
    }

    const service = serviceResult[0];

    // Get current bookings for the service at the specified date and time
    const bookingsResult = await neonDb.query(
      `
      SELECT COUNT(*) as current_bookings
      FROM service_bookings sb
      WHERE sb.service_id = $1 
        AND sb.booking_date = $2 
        AND sb.booking_time = $3
        AND sb.status IN ('confirmed', 'pending')
    `,
      [service_id, date, time]
    );

    const current_bookings = parseInt(
      bookingsResult[0]?.current_bookings || '0'
    );
    const max_capacity = service.max_capacity;
    const remaining_capacity = max_capacity - current_bookings;
    const available = remaining_capacity > 0;

    return NextResponse.json({
      success: true,
      data: {
        available,
        reason: available ? 'Service available' : 'Service fully booked',
        current_bookings,
        max_capacity,
        remaining_capacity,
        price: parseFloat(service.price),
        service_name: service.name,
        service_type: service_type,
        duration_minutes: service.duration_minutes,
        description: service.description,
        checked_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error checking service availability:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

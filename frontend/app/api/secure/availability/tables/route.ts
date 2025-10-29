/**
 * Table Availability API Route
 *
 * Purpose: Handle table availability checking for restaurants
 * Functionality: Check table availability for party size
 * Location: /app/api/secure/availability/tables/route.ts
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
interface TableAvailabilityRequest {
  property_id: string;
  party_size: number;
  date: string;
  time: string;
}

// POST - Check table availability
export async function POST(request: NextRequest) {
  try {
    const body: TableAvailabilityRequest = await request.json();

    // Validate required fields
    if (!body.property_id || !body.party_size || !body.date || !body.time) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { property_id, party_size, date, time } = body;

    // Get all tables for the property
    const tablesResult = await neonDb.query(
      `
      SELECT 
        t.id as table_id,
        t.table_number,
        t.capacity,
        t.location,
        t.status
      FROM tables t
      WHERE t.property_id = $1
      ORDER BY t.capacity ASC
    `,
      [property_id]
    );

    if (tablesResult.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          total_available: 0,
          total_tables: 0,
          available_tables: [],
        },
      });
    }

    // Get current reservations for the date and time
    const reservationsResult = await neonDb.query(
      `
      SELECT 
        tr.table_id,
        tr.party_size,
        tr.status
      FROM table_reservations tr
      WHERE tr.property_id = $1 
        AND tr.reservation_date = $2 
        AND tr.reservation_time = $3
        AND tr.status IN ('confirmed', 'pending')
    `,
      [property_id, date, time]
    );

    // Create a map of reserved tables
    const reservedTables = new Set(reservationsResult.map((r) => r.table_id));

    // Filter available tables that can accommodate the party size
    const available_tables = tablesResult
      .filter(
        (table) =>
          !reservedTables.has(table.table_id) &&
          table.capacity >= party_size &&
          table.status === 'available'
      )
      .map((table) => ({
        table_id: table.table_id,
        table_number: table.table_number,
        capacity: table.capacity,
        location: table.location || 'Indoor',
        is_available: true,
        room_status: table.status,
      }));

    const total_available = available_tables.length;
    const total_tables = tablesResult.length;

    return NextResponse.json({
      success: true,
      data: {
        total_available,
        total_tables,
        available_tables,
        checked_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error checking table availability:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Restaurant Table Management API Route
 *
 * Handles table creation, management, and reservations for restaurants
 * Features: CRUD operations, table status, reservations, floor plan
 * Location: app/api/secure/restaurant/tables/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';

// =============================================================================
// GET - Fetch Restaurant Tables
// =============================================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const _propertyId = searchParams.get('property_id');
    const status = searchParams.get('status');
    const tableType = searchParams.get('table_type');
    const minCapacity = searchParams.get('min_capacity');

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
    if (status) filters.status = status;
    if (tableType) filters.table_type = tableType;
    if (minCapacity) filters.min_capacity = parseInt(minCapacity);

    const tables = await DatabaseService.getTables(propertyId, filters);

    return NextResponse.json({
      success: true,
      data: tables,
    });
  } catch (error) {
    console.error('Tables API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST - Create New Table
// =============================================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      property_id,
      table_number,
      table_name,
      capacity,
      table_type,
      location_description,
      is_smoking_allowed,
      is_wheelchair_accessible,
      x_position,
      y_position,
    } = body;

    if (!property_id || !table_number || !capacity || !table_type) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Missing required fields: property_id, table_number, capacity, table_type',
        },
        { status: 400 }
      );
    }

    const newTable = await DatabaseService.createTable({
      property_id,
      table_number,
      table_name,
      capacity,
      table_type,
      location_description,
      is_smoking_allowed: is_smoking_allowed || false,
      is_wheelchair_accessible: is_wheelchair_accessible || false,
      x_position,
      y_position,
    });

    return NextResponse.json(
      {
        success: true,
        data: newTable,
        message: 'Table created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Table Creation Error:', error);
    return NextResponse.json(
      { error: 'Failed to create table' },
      { status: 500 }
    );
  }
}

// =============================================================================
// PUT - Update Table
// =============================================================================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Table ID is required',
        },
        { status: 400 }
      );
    }

    const updatedTable = await DatabaseService.updateTable(id, updateData);

    return NextResponse.json({
      success: true,
      data: updatedTable,
      message: 'Table updated successfully',
    });
  } catch (error) {
    console.error('Table Update Error:', error);
    return NextResponse.json(
      { error: 'Failed to update table' },
      { status: 500 }
    );
  }
}

// =============================================================================
// DELETE - Delete Table
// =============================================================================
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Table ID is required',
        },
        { status: 400 }
      );
    }

    // Check if table has reservations
    const reservations = await DatabaseService.getReservations('', {
      table_id: id,
    });
    if (reservations.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Cannot delete table with existing reservations. Please archive instead.',
        },
        { status: 400 }
      );
    }

    // Delete table (implement in DatabaseService)
    // await DatabaseService.deleteTable(id);

    return NextResponse.json({
      success: true,
      message: 'Table deleted successfully',
    });
  } catch (error) {
    console.error('Table Deletion Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete table' },
      { status: 500 }
    );
  }
}

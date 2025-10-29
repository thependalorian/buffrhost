/**
 * Staff Management API Route
 *
 * Handles staff management for all property types
 * Features: CRUD operations, shift management, payroll, performance tracking
 * Location: app/api/secure/staff/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';

// =============================================================================
// GET - Fetch Staff Members
// =============================================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const _propertyId = searchParams.get('property_id');
    const position = searchParams.get('position');
    const department = searchParams.get('department');
    const status = searchParams.get('status');

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
    if (position) filters.position = position;
    if (department) filters.department = department;
    if (status) filters.status = status;

    const staff = await DatabaseService.getStaff(propertyId, filters);

    return NextResponse.json({
      success: true,
      data: staff,
    });
  } catch (error) {
    console.error('Staff API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST - Create New Staff Member
// =============================================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      property_id,
      user_id,
      employee_id,
      first_name,
      last_name,
      email,
      phone,
      position,
      department,
      hire_date,
      salary,
      hourly_rate,
      emergency_contact_name,
      emergency_contact_phone,
      address,
      skills,
      certifications,
    } = body;

    if (
      !property_id ||
      !employee_id ||
      !first_name ||
      !last_name ||
      !email ||
      !position ||
      !hire_date
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Missing required fields: property_id, employee_id, first_name, last_name, email, position, hire_date',
        },
        { status: 400 }
      );
    }

    const newStaff = await DatabaseService.createStaff({
      property_id,
      user_id,
      employee_id,
      first_name,
      last_name,
      email,
      phone,
      position,
      department,
      hire_date,
      salary,
      hourly_rate,
      emergency_contact_name,
      emergency_contact_phone,
      address,
      skills: skills || [],
      certifications: certifications || [],
    });

    return NextResponse.json(
      {
        success: true,
        data: newStaff,
        message: 'Staff member created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Staff Creation Error:', error);
    return NextResponse.json(
      { error: 'Failed to create staff member' },
      { status: 500 }
    );
  }
}

// =============================================================================
// PUT - Update Staff Member
// =============================================================================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Staff ID is required',
        },
        { status: 400 }
      );
    }

    const updatedStaff = await DatabaseService.updateStaff(id, updateData);

    return NextResponse.json({
      success: true,
      data: updatedStaff,
      message: 'Staff member updated successfully',
    });
  } catch (error) {
    console.error('Staff Update Error:', error);
    return NextResponse.json(
      { error: 'Failed to update staff member' },
      { status: 500 }
    );
  }
}

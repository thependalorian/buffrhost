import { NextRequest, NextResponse } from 'next/server';
import { BusinessContext } from '@/lib/types/ids';

// Mock business context extraction (in real app, this would come from auth middleware)
function extractBusinessContext(request: NextRequest): BusinessContext {
  const url = new URL(request.url);
  const tenantId = url.searchParams.get('tenant_id') || 'tenant_123';
  const businessId = url.searchParams.get('business_id') || 'business_456';
  const userId = url.searchParams.get('user_id') || 'user_789';
  
  return {
    tenantId,
    tenantType: 'hotel',
    userId,
    role: 'manager',
    permissions: ['read_bookings', 'write_bookings'],
    businessId,
    businessGroupId: 'group_123'
  };
}

export async function GET(request: NextRequest) {
  try {
    const context = extractBusinessContext(request);
    const url = new URL(request.url);
    const businessId = url.searchParams.get('business_id');
    
    if (!businessId) {
      return NextResponse.json(
        { error: 'business_id is required' },
        { status: 400 }
      );
    }

    // Mock bookings data with proper tenant isolation
    const mockBookings = [
      {
        id: 'booking_123',
        guest_id: 'guest_456',
        room_id: 'room_789',
        check_in: '2024-01-15',
        check_out: '2024-01-17',
        status: 'confirmed',
        total_amount: 299.99,
        created_at: '2024-01-10T10:00:00Z',
        // These fields ensure tenant isolation
        tenant_id: context.tenantId,
        business_id: businessId
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockBookings,
      security: {
        tenantId: context.tenantId,
        businessId: businessId,
        userId: context.userId,
        role: context.role
      }
    });

  } catch (error) {
    console.error('[BOOKINGS_API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = extractBusinessContext(request);
    const body = await request.json();
    const { guest_id, room_id, check_in, check_out, total_amount } = body;

    // Validate required fields
    if (!guest_id || !room_id || !check_in || !check_out || !total_amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new booking with tenant isolation
    const newBooking = {
      id: `booking_${Date.now()}`,
      guest_id,
      room_id,
      check_in,
      check_out,
      total_amount: parseFloat(total_amount),
      status: 'pending',
      created_at: new Date().toISOString(),
      // Critical: Always include tenant_id for isolation
      tenant_id: context.tenantId,
      business_id: context.businessId,
      created_by: context.userId
    };

    return NextResponse.json({
      success: true,
      data: newBooking,
      message: 'Booking created successfully',
      security: {
        tenantId: context.tenantId,
        businessId: context.businessId,
        userId: context.userId
      }
    });

  } catch (error) {
    console.error('[BOOKINGS_API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
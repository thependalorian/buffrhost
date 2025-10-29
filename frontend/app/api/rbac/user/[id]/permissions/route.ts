/**
 * RBAC User Permissions API Endpoint
 *
 * Returns user permissions for RBAC system
 * Location: app/api/rbac/user/[id]/permissions/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // For now, return mock data to prevent 500 errors
    // TODO: Implement proper database integration once tables are populated
    return NextResponse.json({
      success: true,
      data: {
        permissions: ['read:hotels', 'write:bookings', 'read:restaurants'],
        roles: ['guest'],
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('RBAC API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

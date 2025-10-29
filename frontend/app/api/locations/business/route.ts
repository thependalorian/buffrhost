import { NextRequest, NextResponse } from 'next/server';
import { NamibiaLocationService } from '@/lib/data/namibia-locations';

// GET /api/locations/business - Get business locations
export async function GET(request: NextRequest) {
  try {
    const locations = NamibiaLocationService.getBusinessLocations();

    return NextResponse.json({
      success: true,
      data: locations,
      total: locations.length,
    });
  } catch (error) {
    console.error('Business locations API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business locations' },
      { status: 500 }
    );
  }
}

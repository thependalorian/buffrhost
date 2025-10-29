import { NextRequest, NextResponse } from 'next/server';
import { NamibiaLocationService } from '@/lib/data/namibia-locations';

// GET /api/locations/tourist - Get tourist locations
export async function GET(request: NextRequest) {
  try {
    const locations = NamibiaLocationService.getTouristLocations();

    return NextResponse.json({
      success: true,
      data: locations,
      total: locations.length,
    });
  } catch (error) {
    console.error('Tourist locations API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tourist locations' },
      { status: 500 }
    );
  }
}

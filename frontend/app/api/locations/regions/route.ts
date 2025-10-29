import { NextRequest, NextResponse } from 'next/server';
import { NamibiaLocationService } from '@/lib/data/namibia-locations';

// GET /api/locations/regions - Get all regions
export async function GET(request: NextRequest) {
  try {
    const regions = NamibiaLocationService.getAllRegions();

    return NextResponse.json({
      success: true,
      data: regions,
      total: regions.length,
    });
  } catch (error) {
    console.error('Regions API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch regions' },
      { status: 500 }
    );
  }
}

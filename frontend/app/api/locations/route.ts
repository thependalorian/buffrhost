/**
 * Locations API Endpoint
 *
 * Provides location search and filtering for Namibia
 * Includes regions, towns, cities, and villages
 *
 * Location: app/api/locations/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { NamibiaLocationService, Location } from '@/lib/data/namibia-locations';
import SecureAPIWrapper from '@/lib/security/secure-api-wrapper';

// GET /api/locations - Search and filter locations
export const GET = SecureAPIWrapper.createSecureGET(
  async (request: NextRequest, sanitizedQuery: Record<string, string>) => {
    try {
      const {
        search = '',
        region = '',
        type = '',
        limit = '50',
        nearby = '',
        radius = '50',
      } = sanitizedQuery;

      let results: Location[] = [];

      // Search by text query
      if (search) {
        results = NamibiaLocationService.searchLocations(search);
      } else {
        // Get all locations if no search query
        results = NamibiaLocationService.searchLocations('');
      }

      // Filter by region
      if (region) {
        results = results.filter(
          (location) => location.region?.toLowerCase() === region.toLowerCase()
        );
      }

      // Filter by type
      if (type) {
        results = results.filter((location) => location.type === type);
      }

      // Filter by nearby coordinates
      if (nearby) {
        const coords = nearby.split(',').map(Number);
        if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
          results = NamibiaLocationService.getNearbyLocations(
            coords[0],
            coords[1],
            parseInt(radius) || 50
          );
        }
      }

      // Apply limit
      const limitNum = parseInt(limit) || 50;
      results = results.slice(0, limitNum);

      return NextResponse.json({
        success: true,
        data: results,
        total: results.length,
        filters: {
          search,
          region,
          type,
          limit: limitNum,
          nearby: nearby ? nearby.split(',') : null,
          radius: parseInt(radius) || 50,
        },
      });
    } catch (error) {
      console.error('Locations API error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch locations' },
        { status: 500 }
      );
    }
  },
  {
    inputSchema: {
      search: { type: 'string', options: { maxLength: 100, trim: true } },
      region: { type: 'string', options: { maxLength: 50, trim: true } },
      type: { type: 'string', options: { maxLength: 20, trim: true } },
      limit: { type: 'string', options: { maxLength: 10, trim: true } },
      nearby: { type: 'string', options: { maxLength: 50, trim: true } },
      radius: { type: 'string', options: { maxLength: 10, trim: true } },
    },
  }
);

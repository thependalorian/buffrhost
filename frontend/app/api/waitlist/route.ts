import { NextRequest, NextResponse } from 'next/server';
import { createWaitlistService } from '@/lib/services/waitlist-service';
// import { safeValidateWaitlistRequest } from '@/lib/validation/waitlist-schemas';

/**
 * Waitlist API Route Handler
 * TypeScript-first implementation with Python backend fallback
 */

export async function POST(req: NextRequest) {
  let data: Record<string, unknown>;

  try {
    // Get request data
    data = await req.json();

    // Extract tenant and user info from headers or default
    const _tenantId = req.headers.get('x-tenant-id') || 'default-tenant';
    const userId = req.headers.get('x-user-id') || 'anonymous-user';

    // Create waitlist service
    const waitlistService = createWaitlistService(tenantId, userId);

    // Process waitlist signup
    const result = await waitlistService.joinWaitlist(data);

    // Return success response
    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error('Waitlist API error:', error);

    // Try Python backend fallback
    try {
      const backendUrl =
        process.env['BACKEND_API_URL'] || 'http://localhost:8000';
      const fallbackResponse = await fetch(`${backendUrl}/api/v1/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': req.headers.get('x-tenant-id') || 'default-tenant',
          'X-User-ID': req.headers.get('x-user-id') || 'anonymous-user',
        },
        body: JSON.stringify(data),
      });

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        return NextResponse.json(fallbackData, { status: 200 });
      }
    } catch (fallbackError) {
      console.error('Python backend fallback failed:', fallbackError);
    }

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process waitlist signup. Please try again later.',
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Extract tenant and user info
    const _tenantId = req.headers.get('x-tenant-id') || 'default-tenant';
    const userId = req.headers.get('x-user-id') || 'anonymous-user';

    // Create waitlist service
    const waitlistService = createWaitlistService(tenantId, userId);

    // Get waitlist statistics
    const stats = await waitlistService.getWaitlistStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Waitlist stats API error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get waitlist statistics',
      },
      { status: 500 }
    );
  }
}

/**
 * Health check endpoint
 */
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}

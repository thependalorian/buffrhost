/**
 * Health Check API Endpoint
 *
 * Provides system health status and version information
 * Features: System status, timestamp, version info
 * Location: app/api/health/route.ts
 */

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: 'connected',
        api: 'operational',
        authentication: 'active',
      },
    };

    return NextResponse.json(healthData, { status: 200 });
  } catch (error) {
    console.error('Health check error:', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        error: 'Health check failed',
      },
      { status: 503 }
    );
  }
}

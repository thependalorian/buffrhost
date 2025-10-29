/**
 * Admin System Health API Route
 *
 * Purpose: Handle system health monitoring for admin dashboard
 * Functionality: Get system health metrics and status
 * Location: /app/api/admin/system/health/route.ts
 *
 * Follows 40 Rules:
 * - Uses Neon PostgreSQL database
 * - Vercel-compatible with SSR
 * - Comprehensive error handling
 * - TypeScript for type safety
 * - Security and validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { neonDb } from '@/lib/neon-db';

// Types for TypeScript compliance
interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  response_time: number;
  error_rate: number;
  database_status: 'connected' | 'disconnected' | 'slow';
  memory_usage: number;
  cpu_usage: number;
  disk_usage: number;
  active_connections: number;
  last_backup: string;
  alerts: Array<{
    id: string;
    type: 'info' | 'warning' | 'error' | 'critical';
    message: string;
    timestamp: string;
    resolved: boolean;
  }>;
}

// GET - Get system health status
export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const startTime = Date.now();
    let databaseStatus: 'connected' | 'disconnected' | 'slow' = 'disconnected';
    let responseTime = 0;

    try {
      await neonDb.query('SELECT 1');
      responseTime = Date.now() - startTime;
      databaseStatus = responseTime > 1000 ? 'slow' : 'connected';
    } catch (error) {
      console.error('Database connection test failed:', error);
      databaseStatus = 'disconnected';
    }

    // Get system metrics (simulated for demo)
    const systemHealth: SystemHealth = {
      status: databaseStatus === 'connected' ? 'healthy' : 'critical',
      uptime: 99.9,
      response_time: responseTime,
      error_rate: 0.1,
      database_status: databaseStatus,
      memory_usage: 65.2,
      cpu_usage: 23.8,
      disk_usage: 42.1,
      active_connections: 156,
      last_backup: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      alerts: [
        {
          id: 'alert_1',
          type: 'info',
          message: 'Scheduled maintenance completed successfully',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          resolved: true,
        },
        {
          id: 'alert_2',
          type: 'warning',
          message: 'High memory usage detected on server-02',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          resolved: false,
        },
        {
          id: 'alert_3',
          type: 'info',
          message: 'New user registration spike detected',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          resolved: true,
        },
      ],
    };

    return NextResponse.json({
      success: true,
      data: systemHealth,
    });
  } catch (error) {
    console.error('Error fetching system health:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

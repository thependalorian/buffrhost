/**
 * Admin Activity Feed API Route
 *
 * Provides recent activity feed for admin dashboard
 * Features: System events, user actions, property changes, order activities
 * Location: app/api/admin/activity/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { neonClient } from '@/lib/database/neon-client';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('[ADMIN_ACTIVITY_API] Fetching recent activity...');

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type') || 'all';

    // Build the activity query with multiple sources
    let query = `
      WITH recent_activities AS (
        -- Order activities
        SELECT 
          o.id::text as id,
          'order' as type,
          CASE 
            WHEN o.status = 'completed' THEN 'Order #' || o.order_number || ' completed'
            WHEN o.status = 'cancelled' THEN 'Order #' || o.order_number || ' cancelled'
            WHEN o.status = 'pending' THEN 'New order #' || o.order_number || ' received'
            ELSE 'Order #' || o.order_number || ' status changed to ' || o.status
          END as description,
          o.created_at as timestamp,
          CASE 
            WHEN o.status = 'completed' THEN 'success'
            WHEN o.status = 'cancelled' THEN 'error'
            WHEN o.status = 'pending' THEN 'info'
            ELSE 'warning'
          END as severity,
          o.customer_name as user_name,
          p.name as property_name
        FROM orders o
        LEFT JOIN properties p ON o.property_id = p.id
        WHERE o.created_at >= NOW() - INTERVAL '7 days'
        
        UNION ALL
        
        -- Property activities
        SELECT 
          p.id::text as id,
          'property' as type,
          CASE 
            WHEN p.status = 'active' THEN 'Property "' || p.name || '" activated'
            WHEN p.status = 'pending' THEN 'New property "' || p.name || '" registered'
            WHEN p.status = 'suspended' THEN 'Property "' || p.name || '" suspended'
            ELSE 'Property "' || p.name || '" status changed to ' || p.status
          END as description,
          p.created_at as timestamp,
          CASE 
            WHEN p.status = 'active' THEN 'success'
            WHEN p.status = 'pending' THEN 'info'
            WHEN p.status = 'suspended' THEN 'warning'
            ELSE 'info'
          END as severity,
          u.name as user_name,
          p.name as property_name
        FROM properties p
        LEFT JOIN users u ON p.owner_id = u.id
        WHERE p.created_at >= NOW() - INTERVAL '7 days'
        
        UNION ALL
        
        -- User activities
        SELECT 
          u.id::text as id,
          'user' as type,
          CASE 
            WHEN u.role = 'property_owner' THEN 'New property owner "' || u.name || '" registered'
            WHEN u.role = 'customer' THEN 'New customer "' || u.name || '" registered'
            WHEN u.role = 'admin' THEN 'New admin "' || u.name || '" added'
            ELSE 'New user "' || u.name || '" registered'
          END as description,
          u.created_at as timestamp,
          'info' as severity,
          u.name as user_name,
          NULL as property_name
        FROM users u
        WHERE u.created_at >= NOW() - INTERVAL '7 days'
        
        UNION ALL
        
        -- Payment activities
        SELECT 
          o.id::text as id,
          'payment' as type,
          'Payment of ' || o.total_amount || ' NAD received for order #' || o.order_number as description,
          o.created_at as timestamp,
          'success' as severity,
          o.customer_name as user_name,
          p.name as property_name
        FROM orders o
        LEFT JOIN properties p ON o.property_id = p.id
        WHERE o.payment_status = 'paid' 
        AND o.created_at >= NOW() - INTERVAL '7 days'
      )
      SELECT 
        id,
        type,
        description,
        timestamp,
        severity,
        user_name,
        property_name
      FROM recent_activities
    `;

    const queryParams: string[] = [];

    // Add type filter
    if (type !== 'all') {
      query += ` WHERE type = $1`;
      queryParams.push(type);
    }

    // Add ordering and limit
    query += ` ORDER BY timestamp DESC LIMIT $${queryParams.length + 1}`;
    queryParams.push(limit.toString());

    // Execute the query
    const activities = await neonClient.query(query, queryParams);

    console.log(`[ADMIN_ACTIVITY_API] Found ${activities.length} activities`);

    return NextResponse.json({
      success: true,
      data: activities,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[ADMIN_ACTIVITY_API] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch activity feed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

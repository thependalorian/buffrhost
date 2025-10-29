/**
 * Dashboard Statistics API
 *
 * Provides comprehensive statistics for property owner dashboard
 * Features: Revenue, orders, ratings, disbursements with Neon PostgreSQL
 * Location: app/api/secure/dashboard/stats/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { neonClient } from '../../../../lib/database/neon-client';
import { ApiResponse, DashboardStats } from '../../../../lib/types/database';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const propertyId = searchParams.get('property_id');
    const tenantId = searchParams.get('tenant_id') || 'default-tenant';

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // Get today's date range
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    // Get month's date range
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    // Fetch comprehensive statistics
    const [
      totalOrdersResult,
      totalRevenueResult,
      pendingOrdersResult,
      completedOrdersResult,
      todayRevenueResult,
      monthlyRevenueResult,
      averageRatingResult,
      totalReviewsResult,
      disbursementStatusResult,
    ] = await Promise.all([
      // Total orders
      neonClient.query(
        `SELECT COUNT(*) as count FROM orders 
         WHERE property_id = $1 AND tenant_id = $2`,
        [propertyId, tenantId]
      ),

      // Total revenue
      neonClient.query(
        `SELECT COALESCE(SUM(total_amount), 0) as total FROM orders 
         WHERE property_id = $1 AND tenant_id = $2 AND status != 'cancelled'`,
        [propertyId, tenantId]
      ),

      // Pending orders
      neonClient.query(
        `SELECT COUNT(*) as count FROM orders 
         WHERE property_id = $1 AND tenant_id = $2 AND status IN ('pending', 'confirmed', 'preparing')`,
        [propertyId, tenantId]
      ),

      // Completed orders
      neonClient.query(
        `SELECT COUNT(*) as count FROM orders 
         WHERE property_id = $1 AND tenant_id = $2 AND status = 'completed'`,
        [propertyId, tenantId]
      ),

      // Today's revenue
      neonClient.query(
        `SELECT COALESCE(SUM(total_amount), 0) as total FROM orders 
         WHERE property_id = $1 AND tenant_id = $2 
         AND created_at >= $3 AND created_at < $4 AND status != 'cancelled'`,
        [propertyId, tenantId, todayStart.toISOString(), todayEnd.toISOString()]
      ),

      // Monthly revenue
      neonClient.query(
        `SELECT COALESCE(SUM(total_amount), 0) as total FROM orders 
         WHERE property_id = $1 AND tenant_id = $2 
         AND created_at >= $3 AND created_at < $4 AND status != 'cancelled'`,
        [propertyId, tenantId, monthStart.toISOString(), monthEnd.toISOString()]
      ),

      // Average rating (using guest_feedback table)
      neonClient.query(
        `SELECT COALESCE(AVG(rating), 0) as average FROM guest_feedback 
         WHERE property_id = $1 AND tenant_id = $2`,
        [propertyId, tenantId]
      ),

      // Total reviews (using guest_feedback table)
      neonClient.query(
        `SELECT COUNT(*) as count FROM guest_feedback 
         WHERE property_id = $1 AND tenant_id = $2`,
        [propertyId, tenantId]
      ),

      // Disbursement status (mock for now)
      Promise.resolve([{ status: 'pending', next_disbursement: '2024-01-15' }]),
    ]);

    // Calculate next disbursement date (daily at 6 PM)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(18, 0, 0, 0);
    const nextDisbursement = tomorrow.toLocaleDateString('en-NA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const stats: DashboardStats = {
      totalOrders: parseInt(totalOrdersResult[0]?.count || '0'),
      totalRevenue: parseFloat(totalRevenueResult[0]?.total || '0'),
      pendingOrders: parseInt(pendingOrdersResult[0]?.count || '0'),
      completedOrders: parseInt(completedOrdersResult[0]?.count || '0'),
      averageRating: parseFloat(averageRatingResult[0]?.average || '0'),
      totalReviews: parseInt(totalReviewsResult[0]?.count || '0'),
      todayRevenue: parseFloat(todayRevenueResult[0]?.total || '0'),
      monthlyRevenue: parseFloat(monthlyRevenueResult[0]?.total || '0'),
      disbursementStatus: disbursementStatusResult[0]?.status || 'pending',
      nextDisbursement: nextDisbursement,
    };

    const response: ApiResponse<DashboardStats> = {
      success: true,
      data: stats,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[DASHBOARD_STATS_API] Error:', error);
    const errorResponse: ApiResponse = {
      success: false,
      error: 'Failed to fetch dashboard statistics',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

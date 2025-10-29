import { NextRequest, NextResponse } from 'next/server';
import { BusinessContext } from '@/lib/types/ids';
import { neonClient } from '@/lib/database/neon-client';

// Mock business context extraction
function extractBusinessContext(request: NextRequest): BusinessContext {
  const url = new URL(request.url);
  const _tenantId = url.searchParams.get('tenant_id') || 'tenant_123';
  const businessId = url.searchParams.get('business_id') || 'business_456';
  const userId = url.searchParams.get('user_id') || 'user_789';

  return {
    tenantId,
    tenantType: 'restaurant',
    userId,
    role: 'manager',
    permissions: ['read_inventory', 'write_inventory'],
    businessId,
    businessGroupId: 'group_456',
  };
}

// GET - Retrieve inventory alerts
export async function GET(request: NextRequest) {
  try {
    const context = extractBusinessContext(request);
    const url = new URL(request.url);
    const alertType = url.searchParams.get('alert_type');
    const alertLevel = url.searchParams.get('alert_level');
    const resolved = url.searchParams.get('resolved');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    let query = `
      SELECT 
        ia.id, ia.inventory_item_id, ia.alert_type, ia.alert_level,
        ia.current_stock, ia.threshold_value, ia.message, ia.is_resolved,
        ia.resolved_at, ia.resolved_by, ia.created_at,
        ii.item_name, ii.category, ii.unit_of_measure, ii.supplier_name,
        ii.reorder_quantity, ii.unit_cost
      FROM inventory_alerts ia
      JOIN inventory_items ii ON ia.inventory_item_id = ii.id
      WHERE ia.tenant_id = $1 AND ia.property_id = $2
    `;

    const queryParams = [context.tenantId, context.businessId];
    let paramIndex = 3;

    if (alertType) {
      query += ` AND ia.alert_type = $${paramIndex}`;
      queryParams.push(alertType);
      paramIndex++;
    }

    if (alertLevel) {
      query += ` AND ia.alert_level = $${paramIndex}`;
      queryParams.push(alertLevel);
      paramIndex++;
    }

    if (resolved !== null) {
      query += ` AND ia.is_resolved = $${paramIndex}`;
      queryParams.push(resolved === 'true' ? 'true' : 'false');
      paramIndex++;
    }

    query += ` ORDER BY 
      CASE ia.alert_level 
        WHEN 'critical' THEN 1 
        WHEN 'urgent' THEN 2 
        WHEN 'warning' THEN 3 
        ELSE 4 
      END, 
      ia.created_at DESC 
      LIMIT $${paramIndex}`;
    queryParams.push(limit.toString());

    const result = await neonClient.query(query, queryParams);

    // Add calculated fields
    const alerts = result.map((alert) => ({
      ...alert,
      days_since_alert: Math.floor(
        (Date.now() - new Date(alert.created_at).getTime()) /
          (1000 * 60 * 60 * 24)
      ),
      reorder_cost: alert.reorder_quantity * alert.unit_cost,
      stock_shortage: Math.max(0, alert.threshold_value - alert.current_stock),
    }));

    return NextResponse.json({
      success: true,
      data: alerts,
      count: alerts.length,
      summary: {
        total: alerts.length,
        critical: alerts.filter((a) => a.alert_level === 'critical').length,
        urgent: alerts.filter((a) => a.alert_level === 'urgent').length,
        warning: alerts.filter((a) => a.alert_level === 'warning').length,
        resolved: alerts.filter((a) => a.is_resolved).length,
        unresolved: alerts.filter((a) => !a.is_resolved).length,
      },
      security: {
        tenantId: context.tenantId,
        businessId: context.businessId,
        userId: context.userId,
        role: context.role,
      },
    });
  } catch (error) {
    console.error('[INVENTORY_ALERTS_API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory alerts' },
      { status: 500 }
    );
  }
}

// POST - Resolve inventory alert
export async function POST(request: NextRequest) {
  try {
    const context = extractBusinessContext(request);
    const body = await request.json();
    const { alert_id, resolution_notes } = body;

    if (!alert_id) {
      return NextResponse.json(
        { error: 'Alert ID is required' },
        { status: 400 }
      );
    }

    // Resolve the alert
    const result = await neonClient.query(
      `UPDATE inventory_alerts 
       SET is_resolved = true, resolved_at = NOW(), resolved_by = $1
       WHERE id = $2 AND tenant_id = $3 AND property_id = $4
       RETURNING *`,
      [context.userId, alert_id, context.tenantId, context.businessId]
    );

    if (result.length === 0) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    const resolvedAlert = result[0];

    // Log resolution notes if provided
    if (resolution_notes) {
      await neonClient.query(
        `INSERT INTO stock_movements (
          inventory_item_id, movement_type, quantity, reason, notes, performed_by,
          tenant_id, property_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          resolvedAlert.inventory_item_id,
          'adjustment',
          0,
          'Alert Resolution',
          `Alert resolved: ${resolution_notes}`,
          context.userId,
          context.tenantId,
          context.businessId,
        ]
      );
    }

    return NextResponse.json({
      success: true,
      data: resolvedAlert,
      message: 'Alert resolved successfully',
      security: {
        tenantId: context.tenantId,
        businessId: context.businessId,
        userId: context.userId,
      },
    });
  } catch (error) {
    console.error('[INVENTORY_ALERTS_API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to resolve alert' },
      { status: 500 }
    );
  }
}

// PUT - Update alert (e.g., change priority)
export async function PUT(request: NextRequest) {
  try {
    const context = extractBusinessContext(request);
    const body = await request.json();
    const { alert_id, alert_level, message } = body;

    if (!alert_id) {
      return NextResponse.json(
        { error: 'Alert ID is required' },
        { status: 400 }
      );
    }

    const updateFields: string[] = [];
    const values: string[] = [];
    let paramIndex = 1;

    if (alert_level) {
      updateFields.push(`alert_level = $${paramIndex}`);
      values.push(alert_level);
      paramIndex++;
    }

    if (message) {
      updateFields.push(`message = $${paramIndex}`);
      values.push(message);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    values.push(alert_id, context.tenantId, context.businessId);
    const query = `
      UPDATE inventory_alerts 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex} AND tenant_id = $${paramIndex + 1} AND property_id = $${paramIndex + 2}
      RETURNING *
    `;

    const result = await neonClient.query(query, values);

    if (result.length === 0) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Alert updated successfully',
      security: {
        tenantId: context.tenantId,
        businessId: context.businessId,
        userId: context.userId,
      },
    });
  } catch (error) {
    console.error('[INVENTORY_ALERTS_API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update alert' },
      { status: 500 }
    );
  }
}

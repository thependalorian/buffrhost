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

// GET - Retrieve stock movements
export async function GET(request: NextRequest) {
  try {
    const context = extractBusinessContext(request);
    const url = new URL(request.url);
    const itemId = url.searchParams.get('item_id');
    const movementType = url.searchParams.get('movement_type');
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    let query = `
      SELECT 
        sm.id, sm.inventory_item_id, sm.movement_type, sm.quantity,
        sm.unit_cost, sm.total_cost, sm.reason, sm.reference_id,
        sm.reference_type, sm.notes, sm.performed_by, sm.created_at,
        ii.item_name, ii.unit_of_measure
      FROM stock_movements sm
      JOIN inventory_items ii ON sm.inventory_item_id = ii.id
      WHERE sm.tenant_id = $1 AND sm.property_id = $2
    `;

    const queryParams = [context.tenantId, context.businessId];
    let paramIndex = 3;

    if (itemId) {
      query += ` AND sm.inventory_item_id = $${paramIndex}`;
      queryParams.push(itemId);
      paramIndex++;
    }

    if (movementType) {
      query += ` AND sm.movement_type = $${paramIndex}`;
      queryParams.push(movementType);
      paramIndex++;
    }

    if (startDate) {
      query += ` AND sm.created_at >= $${paramIndex}`;
      queryParams.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      query += ` AND sm.created_at <= $${paramIndex}`;
      queryParams.push(endDate);
      paramIndex++;
    }

    query += ` ORDER BY sm.created_at DESC LIMIT $${paramIndex}`;
    queryParams.push(limit.toString());

    const result = await neonClient.query(query, queryParams);

    return NextResponse.json({
      success: true,
      data: result,
      count: result.length,
      security: {
        tenantId: context.tenantId,
        businessId: context.businessId,
        userId: context.userId,
        role: context.role,
      },
    });
  } catch (error) {
    console.error('[STOCK_MOVEMENTS_API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock movements' },
      { status: 500 }
    );
  }
}

// POST - Record stock movement
export async function POST(request: NextRequest) {
  try {
    const context = extractBusinessContext(request);
    const body = await request.json();
    const {
      inventory_item_id,
      movement_type,
      quantity,
      unit_cost,
      reason,
      reference_id,
      reference_type,
      notes,
    } = body;

    // Validate required fields
    if (!inventory_item_id || !movement_type || !quantity) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: inventory_item_id, movement_type, quantity',
        },
        { status: 400 }
      );
    }

    // Validate movement type
    const validMovementTypes = ['in', 'out', 'adjustment', 'waste', 'transfer'];
    if (!validMovementTypes.includes(movement_type)) {
      return NextResponse.json(
        {
          error: `Invalid movement_type. Must be one of: ${validMovementTypes.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Calculate total cost
    const totalCost = unit_cost ? quantity * unit_cost : null;

    // Record the stock movement
    const result = await neonClient.query(
      `INSERT INTO stock_movements (
        inventory_item_id, movement_type, quantity, unit_cost, total_cost,
        reason, reference_id, reference_type, notes, performed_by,
        tenant_id, property_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        inventory_item_id,
        movement_type,
        quantity,
        unit_cost,
        totalCost,
        reason,
        reference_id,
        reference_type,
        notes,
        context.userId,
        context.tenantId,
        context.businessId,
      ]
    );

    const newMovement = result[0];

    // Get updated item details
    const itemResult = await neonClient.query(
      `SELECT item_name, current_stock, minimum_threshold, reorder_point
       FROM inventory_items WHERE id = $1`,
      [inventory_item_id]
    );

    const item = itemResult[0];

    // Check for low stock alerts after movement
    if (item.current_stock <= item.minimum_threshold) {
      // Check if alert already exists
      const existingAlert = await neonClient.query(
        `SELECT id FROM inventory_alerts 
         WHERE inventory_item_id = $1 AND alert_type = 'low_stock' AND is_resolved = false`,
        [inventory_item_id]
      );

      if (existingAlert.length === 0) {
        await neonClient.query(
          `INSERT INTO inventory_alerts (
            inventory_item_id, alert_type, alert_level, current_stock,
            threshold_value, message, tenant_id, property_id
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            inventory_item_id,
            'low_stock',
            item.current_stock <= 0 ? 'critical' : 'warning',
            item.current_stock,
            item.minimum_threshold,
            `Stock level is below minimum threshold for ${item.item_name}`,
            context.tenantId,
            context.businessId,
          ]
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...newMovement,
        item_name: item.item_name,
        updated_stock: item.current_stock,
      },
      message: 'Stock movement recorded successfully',
      security: {
        tenantId: context.tenantId,
        businessId: context.businessId,
        userId: context.userId,
      },
    });
  } catch (error) {
    console.error('[STOCK_MOVEMENTS_API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to record stock movement' },
      { status: 500 }
    );
  }
}

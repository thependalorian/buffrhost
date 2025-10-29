/**
 * Inventory Availability API Route
 *
 * Purpose: Handle inventory availability checking
 * Functionality: Check inventory item availability
 * Location: /app/api/secure/availability/inventory/route.ts
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
interface InventoryItem {
  inventory_item_id: number;
  quantity: number;
  name: string;
}

interface InventoryAvailabilityRequest {
  property_id: string;
  items: InventoryItem[];
}

// POST - Check inventory availability
export async function POST(request: NextRequest) {
  try {
    const body: InventoryAvailabilityRequest = await request.json();

    // Validate required fields
    if (!body.property_id || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { property_id, items } = body;
    const unavailable_items: Array<{
      item_name: string;
      reason: string;
      required_quantity: number;
      available_stock?: number;
    }> = [];
    const low_stock_items: Array<{
      item_name: string;
      available_stock: number;
      minimum_stock: number;
    }> = [];
    let total_available = 0;
    let total_unavailable = 0;

    // Check each item's availability
    for (const item of items) {
      try {
        // Get current stock for the item
        const stockResult = await neonDb.query(
          `
          SELECT 
            i.id,
            i.name,
            i.current_stock,
            i.minimum_stock,
            i.unit_price
          FROM inventory_items i
          WHERE i.id = $1 AND i.property_id = $2
        `,
          [item.inventory_item_id, property_id]
        );

        if (stockResult.length === 0) {
          unavailable_items.push({
            item_name: item.name,
            reason: 'Item not found in inventory',
            required_quantity: item.quantity,
          });
          total_unavailable += item.quantity;
          continue;
        }

        const stock = stockResult[0];
        const available_stock = stock.current_stock;
        const required_quantity = item.quantity;

        if (available_stock < required_quantity) {
          unavailable_items.push({
            item_name: stock.name,
            reason: 'Insufficient stock',
            available_stock,
            required_quantity,
          });
          total_unavailable += required_quantity;
        } else {
          total_available += required_quantity;
        }

        // Check for low stock warning
        if (available_stock <= stock.minimum_stock) {
          low_stock_items.push({
            item_name: stock.name,
            available_stock,
            minimum_stock: stock.minimum_stock,
          });
        }
      } catch (itemError) {
        console.error(
          `Error checking item ${item.inventory_item_id}:`,
          itemError
        );
        unavailable_items.push({
          item_name: item.name,
          reason: 'Error checking availability',
          required_quantity: item.quantity,
        });
        total_unavailable += item.quantity;
      }
    }

    const available = unavailable_items.length === 0;

    return NextResponse.json({
      success: true,
      data: {
        available,
        total_available,
        total_unavailable,
        unavailable_items,
        low_stock_items,
        checked_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error checking inventory availability:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Sofia AI Notifications API Route
 *
 * Purpose: Handle Sofia AI notifications and alerts
 * Functionality: Get, create, update, and manage AI notifications
 * Location: /app/api/secure/sofia/[propertyId]/notifications/route.ts
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
interface SofiaNotification {
  id: string;
  property_id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  is_read: boolean;
  is_archived: boolean;
  action_required: boolean;
  action_url?: string;
  created_at: string;
  updated_at: string;
}

interface NotificationUpdate {
  is_read?: boolean;
  is_archived?: boolean;
}

// GET - Get Sofia AI notifications
export async function GET(
  request: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  try {
    const { propertyId } = params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const priority = searchParams.get('priority');
    const is_read = searchParams.get('is_read');
    const is_archived = searchParams.get('is_archived');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!propertyId) {
      return NextResponse.json(
        { success: false, error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // Build query with filters
    let query = `
      SELECT 
        id, property_id, type, priority, title, message, is_read,
        is_archived, action_required, action_url, created_at, updated_at
      FROM sofia_notifications 
      WHERE property_id = $1
    `;

    const queryParams = [propertyId];
    let paramIndex = 2;

    if (type) {
      query += ` AND type = $${paramIndex}`;
      queryParams.push(type);
      paramIndex++;
    }

    if (priority) {
      query += ` AND priority = $${paramIndex}`;
      queryParams.push(priority);
      paramIndex++;
    }

    if (is_read !== null) {
      query += ` AND is_read = $${paramIndex}`;
      queryParams.push(is_read === 'true' ? 'true' : 'false');
      paramIndex++;
    }

    if (is_archived !== null) {
      query += ` AND is_archived = $${paramIndex}`;
      queryParams.push(is_archived === 'true' ? 'true' : 'false');
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit.toString(), offset.toString());

    const result = await neonDb.query(query, queryParams);

    const notifications: SofiaNotification[] = result.map((notif) => ({
      id: notif.id,
      property_id: notif.property_id,
      type: notif.type,
      priority: notif.priority,
      title: notif.title,
      message: notif.message,
      is_read: notif.is_read,
      is_archived: notif.is_archived,
      action_required: notif.action_required,
      action_url: notif.action_url,
      created_at: notif.created_at,
      updated_at: notif.updated_at,
    }));

    return NextResponse.json({
      success: true,
      data: notifications,
      pagination: {
        limit,
        offset,
        total: notifications.length,
      },
    });
  } catch (error) {
    console.error('Error fetching Sofia AI notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update notification status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  try {
    const { propertyId } = params;
    const body: { notification_id: string; update: NotificationUpdate } =
      await request.json();

    if (!propertyId || !body.notification_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { notification_id, update } = body;

    // Build update query dynamically
    const updateFields: (string | number)[] = [];
    const updateValues: (string | number)[] = [];
    let paramIndex = 1;

    if (update.is_read !== undefined) {
      updateFields.push(`is_read = $${paramIndex}`);
      updateValues.push(update.is_read);
      paramIndex++;
    }

    if (update.is_archived !== undefined) {
      updateFields.push(`is_archived = $${paramIndex}`);
      updateValues.push(update.is_archived);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(notification_id, propertyId);

    const query = `
      UPDATE sofia_notifications 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex} AND property_id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await neonDb.query(query, updateValues);

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Notification not found' },
        { status: 404 }
      );
    }

    const updatedNotification = result[0];

    return NextResponse.json({
      success: true,
      data: {
        id: updatedNotification.id,
        is_read: updatedNotification.is_read,
        is_archived: updatedNotification.is_archived,
        updated_at: updatedNotification.updated_at,
      },
    });
  } catch (error) {
    console.error('Error updating Sofia AI notification:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Mark all notifications as read
export async function POST(
  request: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  try {
    const { propertyId } = params;
    const body: { action: 'mark_all_read' | 'mark_all_archived' } =
      await request.json();

    if (!propertyId || !body.action) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { action } = body;

    let query: string;
    if (action === 'mark_all_read') {
      query = `
        UPDATE sofia_notifications 
        SET is_read = true, updated_at = NOW()
        WHERE property_id = $1 AND is_read = false
        RETURNING COUNT(*) as updated_count
      `;
    } else {
      query = `
        UPDATE sofia_notifications 
        SET is_archived = true, updated_at = NOW()
        WHERE property_id = $1 AND is_archived = false
        RETURNING COUNT(*) as updated_count
      `;
    }

    const result = await neonDb.query(query, [propertyId]);
    const updatedCount = parseInt(result[0]?.updated_count || '0');

    return NextResponse.json({
      success: true,
      data: {
        action,
        updated_count: updatedCount,
      },
    });
  } catch (error) {
    console.error('Error updating Sofia AI notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

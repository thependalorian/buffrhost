import { NextRequest, NextResponse } from 'next/server';
import { BusinessContext } from '@/lib/types/ids';

// Mock business context extraction (in real app, this would come from auth middleware)
function extractBusinessContext(request: NextRequest): BusinessContext {
  const url = new URL(request.url);
  const tenantId = url.searchParams.get('tenant_id') || 'tenant_123';
  const businessId = url.searchParams.get('business_id') || 'business_456';
  const userId = url.searchParams.get('user_id') || 'user_789';
  
  return {
    tenantId,
    tenantType: 'restaurant',
    userId,
    role: 'manager',
    permissions: ['read_menu', 'write_menu'],
    businessId,
    businessGroupId: 'group_456'
  };
}

export async function GET(request: NextRequest) {
  try {
    const context = extractBusinessContext(request);
    const url = new URL(request.url);
    const businessId = url.searchParams.get('business_id');
    
    if (!businessId) {
      return NextResponse.json(
        { error: 'business_id is required' },
        { status: 400 }
      );
    }

    // Mock menu data with proper tenant isolation
    const mockMenuItems = [
      {
        id: 'menu_item_123',
        name: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon with herbs and lemon',
        price: 28.99,
        category: 'main_course',
        is_available: true,
        created_at: '2024-01-10T10:00:00Z',
        // These fields ensure tenant isolation
        tenant_id: context.tenantId,
        business_id: businessId
      },
      {
        id: 'menu_item_124',
        name: 'Caesar Salad',
        description: 'Crisp romaine lettuce with parmesan and croutons',
        price: 14.99,
        category: 'appetizer',
        is_available: true,
        created_at: '2024-01-10T10:00:00Z',
        tenant_id: context.tenantId,
        business_id: businessId
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockMenuItems,
      security: {
        tenantId: context.tenantId,
        businessId: businessId,
        userId: context.userId,
        role: context.role
      }
    });

  } catch (error) {
    console.error('[MENU_API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = extractBusinessContext(request);
    const body = await request.json();
    const { name, description, price, category } = body;

    // Validate required fields
    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new menu item with tenant isolation
    const newMenuItem = {
      id: `menu_item_${Date.now()}`,
      name,
      description,
      price: parseFloat(price),
      category,
      is_available: true,
      created_at: new Date().toISOString(),
      // Critical: Always include tenant_id for isolation
      tenant_id: context.tenantId,
      business_id: context.businessId,
      created_by: context.userId
    };

    return NextResponse.json({
      success: true,
      data: newMenuItem,
      message: 'Menu item created successfully',
      security: {
        tenantId: context.tenantId,
        businessId: context.businessId,
        userId: context.userId
      }
    });

  } catch (error) {
    console.error('[MENU_API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const context = extractBusinessContext(request);
    const body = await request.json();
    const { id, name, description, price, category, is_available } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Menu item ID is required' },
        { status: 400 }
      );
    }

    // Update menu item with tenant isolation
    const updatedMenuItem = {
      id,
      name,
      description,
      price: price ? parseFloat(price) : undefined,
      category,
      is_available,
      updated_at: new Date().toISOString(),
      // Critical: Always include tenant_id for isolation
      tenant_id: context.tenantId,
      business_id: context.businessId,
      updated_by: context.userId
    };

    return NextResponse.json({
      success: true,
      data: updatedMenuItem,
      message: 'Menu item updated successfully',
      security: {
        tenantId: context.tenantId,
        businessId: context.businessId,
        userId: context.userId
      }
    });

  } catch (error) {
    console.error('[MENU_API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update menu item' },
      { status: 500 }
    );
  }
}
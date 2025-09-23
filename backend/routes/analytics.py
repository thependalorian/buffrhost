"""
Analytics and reporting routes for The Shandi platform.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func, desc
from typing import List, Optional
from datetime import datetime, timedelta

from database import get_db
from models.order import Order, OrderItem
from models.menu import Menu
from models.customer import Customer
from models.user import BuffrHostUser
from models.inventory import InventoryItem
from routes.auth import get_current_user

router = APIRouter()


@router.get("/restaurants/{restaurant_id}/analytics/inventory")
async def get_inventory_analytics(
    restaurant_id: int,
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get inventory analytics for a restaurant."""
    if current_user.restaurant_id != restaurant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this restaurant"
        )

    total_items_result = await db.execute(
        select(func.count(InventoryItem.inventory_id)).where(InventoryItem.property_id == restaurant_id)
    )
    total_items = total_items_result.scalar_one_or_none() or 0

    low_stock_items_result = await db.execute(
        select(func.count(InventoryItem.inventory_id)).where(
            and_(
                InventoryItem.property_id == restaurant_id,
                InventoryItem.current_stock < InventoryItem.reorder_level
            )
        )
    )
    low_stock_items = low_stock_items_result.scalar_one_or_none() or 0

    total_value_result = await db.execute(
        select(func.sum(InventoryItem.current_stock * InventoryItem.cost_per_unit)).where(
            InventoryItem.property_id == restaurant_id
        )
    )
    total_value = total_value_result.scalar_one_or_none() or 0

    top_expensive_items_result = await db.execute(
        select(InventoryItem).where(InventoryItem.property_id == restaurant_id)
        .order_by(desc(InventoryItem.cost_per_unit))
        .limit(10)
    )
    top_expensive_items = top_expensive_items_result.scalars().all()

    return {
        "total_items": total_items,
        "low_stock_items": low_stock_items,
        "total_inventory_value": float(total_value),
        "top_expensive_items": [
            {
                "name": item.name,
                "cost_per_unit": float(item.cost_per_unit),
                "current_stock": float(item.current_stock)
            }
            for item in top_expensive_items
        ]
    }

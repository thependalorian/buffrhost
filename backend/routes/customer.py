"""
Profile management routes for The Shandi platform.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func, desc
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from database import get_db
from models.user import User, Profile
from models.order import Order, OrderItem
from models.menu import Menu
from schemas.customer import (
    CustomerCreate, CustomerUpdate, CustomerResponse, CustomerSummary,
    LoyaltyPointsUpdate, LoyaltyPointsResponse, CustomerSearch
)
from routes.auth import get_current_user

router = APIRouter()


@router.get("/restaurants/{restaurant_id}/customers/{customer_id}/analytics")
async def get_customer_analytics(
    restaurant_id: int,
    customer_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get customer analytics and insights."""
    if current_user.restaurant_id != restaurant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this restaurant"
        )
    
    customer_result = await db.execute(select(Profile).where(Profile.customer_id == customer_id))
    customer = customer_result.scalar_one_or_none()
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    orders_result = await db.execute(
        select(Order).where(Order.customer_id == customer_id).order_by(desc(Order.order_date))
    )
    orders = orders_result.scalars().all()

    total_orders = len(orders)
    total_spent = sum(order.total for order in orders)
    average_order_value = total_spent / total_orders if total_orders > 0 else 0
    last_order_date = orders[0].order_date if total_orders > 0 else None

    favorite_items_result = await db.execute(
        select(Menu.name, func.count(OrderItem.menu_item_id).label("count"))
        .join(OrderItem, OrderItem.menu_item_id == Menu.menu_item_id)
        .join(Order, Order.order_id == OrderItem.order_id)
        .where(Order.customer_id == customer_id)
        .group_by(Menu.name)
        .order_by(desc("count"))
        .limit(5)
    )
    favorite_items = [item[0] for item in favorite_items_result.all()]

    order_frequency_days = None
    if total_orders > 1:
        first_order_date = orders[-1].order_date
        time_span_days = (datetime.utcnow() - first_order_date).days
        order_frequency_days = time_span_days / total_orders

    return {
        "customer_id": str(customer.customer_id),
        "total_orders": total_orders,
        "total_spent": float(total_spent),
        "average_order_value": float(average_order_value),
        "last_order_date": last_order_date,
        "favorite_items": favorite_items,
        "order_frequency_days": order_frequency_days,
        "loyalty_tier": customer.loyalty_tier
    }

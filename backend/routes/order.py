"""
Order management routes for The Shandi platform.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from database import get_db
from models.order import Order, OrderItem, OrderItemOption
from models.user import User, Profile
from models.menu import Menu, MenuOptionValue
from schemas.order import (
    OrderCreate, OrderUpdate, OrderResponse, OrderSummary,
    OrderStatusUpdate, OrderSearch
)
from routes.auth import get_current_user

router = APIRouter()


@router.post("/properties/{property_id}/orders", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    property_id: int,
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new order."""
    # Check if user has access to this property
    if hasattr(current_user, 'profile') and current_user.profile.property_id != property_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this property"
        )
    
    if order_data.customer_id:
        customer_result = await db.execute(select(Profile).where(Profile.id == order_data.customer_id))
        if not customer_result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer not found"
            )
    
    order = Order(
        customer_id=order_data.customer_id,
        property_id=property_id,
        payment_method=order_data.payment_method,
        special_instructions=order_data.special_instructions
    )
    
    db.add(order)
    await db.flush()
    
    total_amount = 0
    for item_data in order_data.order_items:
        menu_result = await db.execute(
            select(Menu).where(
                and_(
                    Menu.menu_item_id == item_data.menu_item_id,
                    Menu.restaurant_id == restaurant_id,
                    Menu.is_available == True
                )
            )
        )
        menu_item = menu_result.scalar_one_or_none()
        
        if not menu_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Menu item {item_data.menu_item_id} not found or unavailable"
            )
        
        order_item = OrderItem(
            order_id=order.order_id,
            menu_item_id=item_data.menu_item_id,
            quantity=item_data.quantity,
            price_at_order=menu_item.base_price,
            special_instructions=item_data.special_instructions
        )
        
        db.add(order_item)
        await db.flush()
        
        item_total = float(menu_item.base_price) * item_data.quantity
        
        for option_data in item_data.selected_options:
            option_value_result = await db.execute(
                select(MenuOptionValue).where(MenuOptionValue.option_value_id == option_data.option_value_id)
            )
            option_value = option_value_result.scalar_one_or_none()

            if not option_value:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Menu option value {option_data.option_value_id} not found"
                )

            order_item_option = OrderItemOption(
                order_item_id=order_item.order_item_id,
                option_value_id=option_data.option_value_id
            )
            db.add(order_item_option)
            item_total += float(option_value.additional_price) * item_data.quantity
        
        total_amount += item_total
    
    order.total = total_amount
    
    await db.commit()
    await db.refresh(order)
    
    return OrderResponse.from_orm(order)

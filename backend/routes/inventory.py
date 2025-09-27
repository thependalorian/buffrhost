"""
Inventory management routes for The Shandi platform.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import List, Optional

from database import get_db
from models.inventory import UnitOfMeasurement, InventoryItem
from models.user import User
from schemas.inventory import (
    UnitCreate, UnitResponse,
    InventoryItemCreate, InventoryItemUpdate, InventoryItemResponse, InventoryItemSummary,
    StockUpdate, LowStockAlert
)
from routes.auth import get_current_user

router = APIRouter()


# Units of Measurement
@router.get("/restaurants/{restaurant_id}/units", response_model=List[UnitResponse])
async def get_units(
    restaurant_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all units of measurement for a restaurant."""
    # Verify user has access to this restaurant
    if current_user.restaurant_id != restaurant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this restaurant"
        )
    
    result = await db.execute(
        select(UnitOfMeasurement)
        .where(UnitOfMeasurement.restaurant_id == restaurant_id)
        .order_by(UnitOfMeasurement.name)
    )
    units = result.scalars().all()
    
    return [UnitResponse.from_orm(unit) for unit in units]


@router.post("/restaurants/{restaurant_id}/units", response_model=UnitResponse, status_code=status.HTTP_201_CREATED)
async def create_unit(
    restaurant_id: int,
    unit_data: UnitCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new unit of measurement."""
    # Verify user has access to this restaurant
    if current_user.restaurant_id != restaurant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this restaurant"
        )
    
    unit = UnitOfMeasurement(
        restaurant_id=restaurant_id,
        **unit_data.dict()
    )
    
    db.add(unit)
    await db.commit()
    await db.refresh(unit)
    
    return UnitResponse.from_orm(unit)


# Inventory Items
@router.get("/restaurants/{restaurant_id}/inventory", response_model=List[InventoryItemResponse])
async def get_inventory_items(
    restaurant_id: int,
    low_stock: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get inventory items for a restaurant with optional filtering."""
    # Verify user has access to this restaurant
    if current_user.restaurant_id != restaurant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this restaurant"
        )
    
    # Build query
    query = select(InventoryItem).where(InventoryItem.restaurant_id == restaurant_id)
    
    if low_stock:
        query = query.where(InventoryItem.current_stock <= InventoryItem.reorder_level)
    
    if search:
        query = query.where(InventoryItem.name.ilike(f"%{search}%"))
    
    # Add pagination
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)
    
    result = await db.execute(query)
    inventory_items = result.scalars().all()
    
    return [InventoryItemResponse.from_orm(item) for item in inventory_items]


@router.post("/restaurants/{restaurant_id}/inventory", response_model=InventoryItemResponse, status_code=status.HTTP_201_CREATED)
async def create_inventory_item(
    restaurant_id: int,
    inventory_data: InventoryItemCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new inventory item."""
    # Verify user has access to this restaurant
    if current_user.restaurant_id != restaurant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this restaurant"
        )
    
    # Verify unit exists and belongs to restaurant
    unit_result = await db.execute(
        select(UnitOfMeasurement).where(
            and_(
                UnitOfMeasurement.unit_id == inventory_data.unit_id,
                UnitOfMeasurement.restaurant_id == restaurant_id
            )
        )
    )
    if not unit_result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Unit of measurement not found"
        )
    
    inventory_item = InventoryItem(
        restaurant_id=restaurant_id,
        **inventory_data.dict()
    )
    
    db.add(inventory_item)
    await db.commit()
    await db.refresh(inventory_item)
    
    return InventoryItemResponse.from_orm(inventory_item)


@router.get("/restaurants/{restaurant_id}/inventory/{inventory_id}", response_model=InventoryItemResponse)
async def get_inventory_item(
    restaurant_id: int,
    inventory_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific inventory item."""
    # Verify user has access to this restaurant
    if current_user.restaurant_id != restaurant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this restaurant"
        )
    
    result = await db.execute(
        select(InventoryItem).where(
            and_(
                InventoryItem.inventory_id == inventory_id,
                InventoryItem.restaurant_id == restaurant_id
            )
        )
    )
    inventory_item = result.scalar_one_or_none()
    
    if not inventory_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found"
        )
    
    return InventoryItemResponse.from_orm(inventory_item)


@router.put("/restaurants/{restaurant_id}/inventory/{inventory_id}", response_model=InventoryItemResponse)
async def update_inventory_item(
    restaurant_id: int,
    inventory_id: int,
    inventory_update: InventoryItemUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update an inventory item."""
    # Verify user has access to this restaurant
    if current_user.restaurant_id != restaurant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this restaurant"
        )
    
    result = await db.execute(
        select(InventoryItem).where(
            and_(
                InventoryItem.inventory_id == inventory_id,
                InventoryItem.restaurant_id == restaurant_id
            )
        )
    )
    inventory_item = result.scalar_one_or_none()
    
    if not inventory_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found"
        )
    
    # Update inventory item fields
    update_data = inventory_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if hasattr(inventory_item, field):
            setattr(inventory_item, field, value)
    
    await db.commit()
    await db.refresh(inventory_item)
    
    return InventoryItemResponse.from_orm(inventory_item)


@router.put("/restaurants/{restaurant_id}/inventory/{inventory_id}/stock", response_model=InventoryItemResponse)
async def update_inventory_stock(
    restaurant_id: int,
    inventory_id: int,
    stock_update: StockUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update inventory stock levels."""
    # Verify user has access to this restaurant
    if current_user.restaurant_id != restaurant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this restaurant"
        )
    
    result = await db.execute(
        select(InventoryItem).where(
            and_(
                InventoryItem.inventory_id == inventory_id,
                InventoryItem.restaurant_id == restaurant_id
            )
        )
    )
    inventory_item = result.scalar_one_or_none()
    
    if not inventory_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found"
        )
    
    # Update stock information
    inventory_item.current_stock = stock_update.current_stock
    if stock_update.expiration_date:
        inventory_item.expiration_date = stock_update.expiration_date
    if stock_update.batch_number:
        inventory_item.batch_number = stock_update.batch_number
    
    await db.commit()
    await db.refresh(inventory_item)
    
    return InventoryItemResponse.from_orm(inventory_item)


@router.get("/restaurants/{restaurant_id}/inventory/low-stock", response_model=List[LowStockAlert])
async def get_low_stock_alerts(
    restaurant_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get low stock alerts for a restaurant."""
    # Verify user has access to this restaurant
    if current_user.restaurant_id != restaurant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this restaurant"
        )
    
    result = await db.execute(
        select(InventoryItem).where(
            and_(
                InventoryItem.restaurant_id == restaurant_id,
                InventoryItem.current_stock <= InventoryItem.reorder_level
            )
        )
    )
    low_stock_items = result.scalars().all()
    
    alerts = []
    for item in low_stock_items:
        alert = LowStockAlert(
            inventory_id=item.inventory_id,
            name=item.name,
            current_stock=item.current_stock,
            reorder_level=item.reorder_level,
            unit=UnitResponse.from_orm(item.unit) if item.unit else None
        )
        alerts.append(alert)
    
    return alerts

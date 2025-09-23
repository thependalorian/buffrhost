"""
Menu management routes for The Shandi platform.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import List, Optional

from database import get_db
from models.menu import MenuCategory, Menu, MenuMedia
from models.user import BuffrHostUser
from schemas.menu import (
    MenuCategoryCreate, MenuCategoryUpdate, MenuCategoryResponse,
    MenuItemCreate, MenuItemUpdate, MenuItemResponse, MenuItemSummary,
    MenuMediaCreate, MenuMediaResponse
)
from routes.auth import get_current_user

router = APIRouter()


# Menu Categories
@router.get("/restaurants/{restaurant_id}/menu-categories", response_model=List[MenuCategoryResponse])
async def get_menu_categories(
    restaurant_id: int,
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all menu categories for a restaurant."""
    # Verify user has access to this restaurant
    if current_user.restaurant_id != restaurant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this restaurant"
        )
    
    result = await db.execute(
        select(MenuCategory)
        .where(MenuCategory.restaurant_id == restaurant_id)
        .order_by(MenuCategory.display_order)
    )
    categories = result.scalars().all()
    
    return [MenuCategoryResponse.from_orm(category) for category in categories]


@router.post("/restaurants/{restaurant_id}/menu-categories", response_model=MenuCategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_menu_category(
    restaurant_id: int,
    category_data: MenuCategoryCreate,
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new menu category."""
    # Verify user has access to this restaurant
    if current_user.restaurant_id != restaurant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this restaurant"
        )
    
    category = MenuCategory(
        restaurant_id=restaurant_id,
        **category_data.dict()
    )
    
    db.add(category)
    await db.commit()
    await db.refresh(category)
    
    return MenuCategoryResponse.from_orm(category)


@router.put("/restaurants/{restaurant_id}/menu-categories/{category_id}", response_model=MenuCategoryResponse)
async def update_menu_category(
    restaurant_id: int,
    category_id: int,
    category_update: MenuCategoryUpdate,
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a menu category."""
    # Verify user has access to this restaurant
    if current_user.restaurant_id != restaurant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this restaurant"
        )
    
    result = await db.execute(
        select(MenuCategory).where(
            and_(
                MenuCategory.category_id == category_id,
                MenuCategory.restaurant_id == restaurant_id
            )
        )
    )
    category = result.scalar_one_or_none()
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu category not found"
        )
    
    # Update category fields
    update_data = category_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if hasattr(category, field):
            setattr(category, field, value)
    
    await db.commit()
    await db.refresh(category)
    
    return MenuCategoryResponse.from_orm(category)


@router.delete("/restaurants/{restaurant_id}/menu-categories/{category_id}")
async def delete_menu_category(
    restaurant_id: int,
    category_id: int,
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a menu category."""
    # Verify user has access to this restaurant
    if current_user.restaurant_id != restaurant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this restaurant"
        )
    
    result = await db.execute(
        select(MenuCategory).where(
            and_(
                MenuCategory.category_id == category_id,
                MenuCategory.restaurant_id == restaurant_id
            )
        )
    )
    category = result.scalar_one_or_none()
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu category not found"
        )
    
    await db.delete(category)
    await db.commit()
    
    return {"message": "Menu category deleted successfully"}


# Menu Items
@router.get("/restaurants/{restaurant_id}/menu-items", response_model=List[MenuItemResponse])
async def get_menu_items(
    restaurant_id: int,
    category_id: Optional[int] = Query(None),
    is_available: Optional[bool] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get menu items for a restaurant with optional filtering."""
    # Verify user has access to this restaurant
    if current_user.restaurant_id != restaurant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this restaurant"
        )
    
    # Build query
    query = select(Menu).where(Menu.restaurant_id == restaurant_id)
    
    if category_id:
        query = query.where(Menu.category_id == category_id)
    
    if is_available is not None:
        query = query.where(Menu.is_available == is_available)
    
    # Add pagination
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)
    
    result = await db.execute(query)
    menu_items = result.scalars().all()
    
    return [MenuItemResponse.from_orm(item) for item in menu_items]


@router.post("/restaurants/{restaurant_id}/menu-items", response_model=MenuItemResponse, status_code=status.HTTP_201_CREATED)
async def create_menu_item(
    restaurant_id: int,
    menu_data: MenuItemCreate,
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new menu item."""
    # Verify user has access to this restaurant
    if current_user.restaurant_id != restaurant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this restaurant"
        )
    
    # Verify category exists and belongs to restaurant
    category_result = await db.execute(
        select(MenuCategory).where(
            and_(
                MenuCategory.category_id == menu_data.category_id,
                MenuCategory.restaurant_id == restaurant_id
            )
        )
    )
    if not category_result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu category not found"
        )
    
    menu_item = Menu(
        restaurant_id=restaurant_id,
        **menu_data.dict()
    )
    
    db.add(menu_item)
    await db.commit()
    await db.refresh(menu_item)
    
    return MenuItemResponse.from_orm(menu_item)


@router.get("/restaurants/{restaurant_id}/menu-items/{menu_item_id}", response_model=MenuItemResponse)
async def get_menu_item(
    restaurant_id: int,
    menu_item_id: int,
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific menu item."""
    # Verify user has access to this restaurant
    if current_user.restaurant_id != restaurant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this restaurant"
        )
    
    result = await db.execute(
        select(Menu).where(
            and_(
                Menu.menu_item_id == menu_item_id,
                Menu.restaurant_id == restaurant_id
            )
        )
    )
    menu_item = result.scalar_one_or_none()
    
    if not menu_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found"
        )
    
    return MenuItemResponse.from_orm(menu_item)


@router.put("/restaurants/{restaurant_id}/menu-items/{menu_item_id}", response_model=MenuItemResponse)
async def update_menu_item(
    restaurant_id: int,
    menu_item_id: int,
    menu_update: MenuItemUpdate,
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a menu item."""
    # Verify user has access to this restaurant
    if current_user.restaurant_id != restaurant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this restaurant"
        )
    
    result = await db.execute(
        select(Menu).where(
            and_(
                Menu.menu_item_id == menu_item_id,
                Menu.restaurant_id == restaurant_id
            )
        )
    )
    menu_item = result.scalar_one_or_none()
    
    if not menu_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found"
        )
    
    # Update menu item fields
    update_data = menu_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if hasattr(menu_item, field):
            setattr(menu_item, field, value)
    
    await db.commit()
    await db.refresh(menu_item)
    
    return MenuItemResponse.from_orm(menu_item)


@router.delete("/restaurants/{restaurant_id}/menu-items/{menu_item_id}")
async def delete_menu_item(
    restaurant_id: int,
    menu_item_id: int,
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a menu item."""
    # Verify user has access to this restaurant
    if current_user.restaurant_id != restaurant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this restaurant"
        )
    
    result = await db.execute(
        select(Menu).where(
            and_(
                Menu.menu_item_id == menu_item_id,
                Menu.restaurant_id == restaurant_id
            )
        )
    )
    menu_item = result.scalar_one_or_none()
    
    if not menu_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found"
        )
    
    await db.delete(menu_item)
    await db.commit()
    
    return {"message": "Menu item deleted successfully"}

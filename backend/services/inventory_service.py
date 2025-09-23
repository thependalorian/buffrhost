"""
Inventory service for Buffr Host platform.
"""
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from sqlalchemy.orm import selectinload

from models.inventory import InventoryItem, UnitOfMeasurement, MenuItemRawMaterial
from models.menu import Menu


class InventoryService:
    """Service for inventory management."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_inventory_items(
        self, 
        property_id: int,
        skip: int = 0,
        limit: int = 100,
        search: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Get inventory items for a property."""
        query = select(InventoryItem).where(
            InventoryItem.property_id == property_id
        )
        
        if search:
            query = query.where(
                or_(
                    InventoryItem.item_name.ilike(f"%{search}%"),
                    InventoryItem.description.ilike(f"%{search}%")
                )
            )
        
        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        items = result.scalars().all()
        
        return [
            {
                "inventory_id": item.inventory_id,
                "item_name": item.item_name,
                "description": item.description,
                "current_stock": item.current_stock,
                "minimum_stock": item.minimum_stock,
                "unit_price": float(item.unit_price),
                "unit_of_measurement": item.unit_of_measurement,
                "supplier": item.supplier,
                "last_restocked": item.last_restocked.isoformat() if item.last_restocked else None,
                "is_active": item.is_active
            }
            for item in items
        ]
    
    async def get_low_stock_items(
        self, 
        property_id: int
    ) -> List[Dict[str, Any]]:
        """Get items that are below minimum stock level."""
        query = select(InventoryItem).where(
            and_(
                InventoryItem.property_id == property_id,
                InventoryItem.current_stock <= InventoryItem.minimum_stock,
                InventoryItem.is_active == True
            )
        )
        
        result = await self.db.execute(query)
        items = result.scalars().all()
        
        return [
            {
                "inventory_id": item.inventory_id,
                "item_name": item.item_name,
                "current_stock": item.current_stock,
                "minimum_stock": item.minimum_stock,
                "unit_of_measurement": item.unit_of_measurement,
                "supplier": item.supplier,
                "stock_difference": item.minimum_stock - item.current_stock
            }
            for item in items
        ]
    
    async def update_stock(
        self, 
        inventory_id: int, 
        new_stock: float,
        property_id: int
    ) -> Dict[str, Any]:
        """Update inventory stock level."""
        query = select(InventoryItem).where(
            and_(
                InventoryItem.inventory_id == inventory_id,
                InventoryItem.property_id == property_id
            )
        )
        
        result = await self.db.execute(query)
        item = result.scalar_one_or_none()
        
        if not item:
            raise ValueError("Inventory item not found")
        
        old_stock = item.current_stock
        item.current_stock = new_stock
        
        await self.db.commit()
        await self.db.refresh(item)
        
        return {
            "inventory_id": item.inventory_id,
            "item_name": item.item_name,
            "old_stock": old_stock,
            "new_stock": item.current_stock,
            "unit_of_measurement": item.unit_of_measurement
        }
    
    async def get_menu_item_ingredients(
        self, 
        menu_item_id: int,
        property_id: int
    ) -> List[Dict[str, Any]]:
        """Get ingredients required for a menu item."""
        query = select(
            MenuItemRawMaterial,
            InventoryItem
        ).join(
            InventoryItem, MenuItemRawMaterial.inventory_id == InventoryItem.inventory_id
        ).where(
            and_(
                MenuItemRawMaterial.menu_item_id == menu_item_id,
                InventoryItem.property_id == property_id
            )
        )
        
        result = await self.db.execute(query)
        ingredients = result.all()
        
        return [
            {
                "inventory_id": ingredient.InventoryItem.inventory_id,
                "item_name": ingredient.InventoryItem.item_name,
                "required_quantity": ingredient.MenuItemRawMaterial.quantity,
                "unit_of_measurement": ingredient.InventoryItem.unit_of_measurement,
                "current_stock": ingredient.InventoryItem.current_stock,
                "sufficient_stock": ingredient.InventoryItem.current_stock >= ingredient.MenuItemRawMaterial.quantity
            }
            for ingredient in ingredients
        ]
    
    async def get_inventory_usage_analytics(
        self, 
        property_id: int,
        days: int = 30
    ) -> Dict[str, Any]:
        """Get inventory usage analytics."""
        # This would typically involve order history and consumption tracking
        # For now, return basic analytics
        
        query = select(InventoryItem).where(
            InventoryItem.property_id == property_id
        )
        
        result = await self.db.execute(query)
        items = result.scalars().all()
        
        total_items = len(items)
        low_stock_items = len([item for item in items if item.current_stock <= item.minimum_stock])
        out_of_stock_items = len([item for item in items if item.current_stock <= 0])
        
        return {
            "total_items": total_items,
            "low_stock_items": low_stock_items,
            "out_of_stock_items": out_of_stock_items,
            "low_stock_percentage": (low_stock_items / total_items * 100) if total_items > 0 else 0,
            "out_of_stock_percentage": (out_of_stock_items / total_items * 100) if total_items > 0 else 0
        }

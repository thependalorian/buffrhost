"""
Hospitality Property Service for The Shandi Hospitality Ecosystem Management Platform
Provides business logic for hospitality property operations.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional

from sqlalchemy import and_, func, select
from sqlalchemy.orm import Session

from models.hospitality_property import HospitalityProperty
from models.inventory import InventoryItem
# Customer models are now part of the unified User/Profile schema
from models.menu import Menu
from models.order import Order
from models.user import Profile, User


class HospitalityPropertyService:
    """Service class for hospitality property operations"""

    def __init__(self, db: Session):
        self.db = db

    def get_property_statistics(self, property_id: int) -> Dict[str, Any]:
        """Get property statistics and metrics"""
        property = self.get_property(property_id)
        if not property:
            return {}

        total_orders_result = self.db.execute(
            select(func.count(Order.order_id)).where(Order.property_id == property_id)
        )
        total_orders = total_orders_result.scalar_one_or_none() or 0

        total_revenue_result = self.db.execute(
            select(func.sum(Order.total)).where(Order.property_id == property_id)
        )
        total_revenue = total_revenue_result.scalar_one_or_none() or 0

        total_customers_result = self.db.execute(
            select(func.count(Customer.customer_id)).where(
                Customer.property_id == property_id
            )
        )
        total_customers = total_customers_result.scalar_one_or_none() or 0

        active_menu_items_result = self.db.execute(
            select(func.count(Menu.menu_item_id)).where(
                and_(Menu.property_id == property_id, Menu.is_available == True)
            )
        )
        active_menu_items = active_menu_items_result.scalar_one_or_none() or 0

        low_stock_items_result = self.db.execute(
            select(func.count(InventoryItem.inventory_id)).where(
                and_(
                    InventoryItem.property_id == property_id,
                    InventoryItem.current_stock < InventoryItem.reorder_level,
                )
            )
        )
        low_stock_items = low_stock_items_result.scalar_one_or_none() or 0

        stats = {
            "property_id": property_id,
            "property_name": property.property_name,
            "property_type": property.property_type,
            "total_orders": total_orders,
            "total_revenue": float(total_revenue),
            "total_customers": total_customers,
            "active_menu_items": active_menu_items,
            "low_stock_items": low_stock_items,
            "total_rooms": property.total_rooms or 0,
            "occupancy_rate": 0.0,  # Placeholder
            "last_updated": datetime.utcnow().isoformat(),
        }

        return stats

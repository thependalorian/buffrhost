"""
Menu Service for The Shandi Hospitality Ecosystem Management Platform
Provides business logic for menu operations.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional

from sqlalchemy import and_, desc, func, or_, select
from sqlalchemy.orm import Session

from models.hospitality_property import HospitalityProperty
from models.menu import Menu, MenuCategory
from models.order import OrderItem


class MenuService:
    """Service class for menu operations"""

    def __init__(self, db: Session):
        self.db = db

    # ... (rest of the class)

    def get_popular_menu_items(
        self, property_id: int, limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Get popular menu items (based on order frequency)"""
        result = self.db.execute(
            select(
                Menu.menu_item_id,
                Menu.name,
                Menu.base_price,
                func.count(OrderItem.order_item_id).label("order_count"),
                func.sum(OrderItem.price_at_order * OrderItem.quantity).label(
                    "revenue"
                ),
            )
            .join(OrderItem, OrderItem.menu_item_id == Menu.menu_item_id)
            .where(Menu.property_id == property_id)
            .group_by(Menu.menu_item_id)
            .order_by(desc("order_count"))
            .limit(limit)
        )

        return [
            {
                "menu_id": item.menu_item_id,
                "name": item.name,
                "price": float(item.base_price) if item.base_price else 0,
                "order_count": item.order_count,
                "revenue": float(item.revenue) if item.revenue else 0,
            }
            for item in result.all()
        ]

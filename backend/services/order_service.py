"""
Order Service for The Shandi Hospitality Ecosystem Management Platform
Provides business logic for order operations.
"""

from datetime import date, datetime
from decimal import Decimal
from typing import Any, Dict, List, Optional

from sqlalchemy import and_, func, or_, select
from sqlalchemy.orm import Session

from models.hospitality_property import HospitalityProperty
from models.order import Order, OrderItem, OrderItemOption
from models.user import Profile, User


class OrderService:
    """Service class for order operations"""

    def __init__(self, db: Session):
        self.db = db

    def create_order(self, order_data: Dict[str, Any]) -> Order:
        """Create new order"""
        order = Order(**order_data)
        self.db.add(order)
        self.db.commit()
        self.db.refresh(order)
        return order

    def get_order(self, order_id: int) -> Optional[Order]:
        """Get order by ID"""
        result = self.db.execute(select(Order).where(Order.order_id == order_id))
        return result.scalar_one_or_none()

    def update_order(
        self, order_id: int, update_data: Dict[str, Any]
    ) -> Optional[Order]:
        """Update existing order"""
        order = self.get_order(order_id)
        if not order:
            return None

        # Update fields
        for key, value in update_data.items():
            if hasattr(order, key):
                setattr(order, key, value)

        order.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(order)
        return order

    def cancel_order(self, order_id: int) -> bool:
        """Cancel an order"""
        order = self.get_order(order_id)
        if not order:
            return False

        order.status = "cancelled"
        order.updated_at = datetime.utcnow()
        self.db.commit()
        return True

    def complete_order(self, order_id: int) -> bool:
        """Mark order as completed"""
        order = self.get_order(order_id)
        if not order:
            return False

        order.status = "completed"
        order.completed_at = datetime.utcnow()
        order.updated_at = datetime.utcnow()
        self.db.commit()
        return True

    def list_orders(
        self,
        property_id: int,
        status: Optional[str] = None,
        customer_id: Optional[str] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> List[Order]:
        """List orders with filters"""
        query = select(Order).where(Order.property_id == property_id)

        if status:
            query = query.where(Order.status == status)

        if customer_id:
            query = query.where(Order.customer_id == customer_id)

        if start_date:
            query = query.where(Order.created_at >= start_date)

        if end_date:
            query = query.where(Order.created_at <= end_date)

        query = query.order_by(Order.created_at.desc()).offset(offset).limit(limit)
        result = self.db.execute(query)
        return result.scalars().all()

    def get_orders_by_customer(self, customer_id: str) -> List[Order]:
        """Get all orders for a customer"""
        result = self.db.execute(
            select(Order)
            .where(Order.customer_id == customer_id)
            .order_by(Order.created_at.desc())
        )
        return result.scalars().all()

    def get_order_items(self, order_id: int) -> List[OrderItem]:
        """Get all items in an order"""
        result = self.db.execute(
            select(OrderItem).where(OrderItem.order_id == order_id)
        )
        return result.scalars().all()

    def add_order_item(self, order_id: int, item_data: Dict[str, Any]) -> OrderItem:
        """Add item to existing order"""
        item_data["order_id"] = order_id
        order_item = OrderItem(**item_data)
        self.db.add(order_item)
        self.db.commit()
        self.db.refresh(order_item)

        # Recalculate order total
        self._recalculate_order_total(order_id)

        return order_item

    def update_order_item(
        self, item_id: int, update_data: Dict[str, Any]
    ) -> Optional[OrderItem]:
        """Update order item"""
        result = self.db.execute(select(OrderItem).where(OrderItem.item_id == item_id))
        order_item = result.scalar_one_or_none()

        if not order_item:
            return None

        # Update fields
        for key, value in update_data.items():
            if hasattr(order_item, key):
                setattr(order_item, key, value)

        order_item.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(order_item)

        # Recalculate order total
        self._recalculate_order_total(order_item.order_id)

        return order_item

    def remove_order_item(self, item_id: int) -> bool:
        """Remove item from order"""
        result = self.db.execute(select(OrderItem).where(OrderItem.item_id == item_id))
        order_item = result.scalar_one_or_none()

        if not order_item:
            return False

        order_id = order_item.order_id
        self.db.delete(order_item)
        self.db.commit()

        # Recalculate order total
        self._recalculate_order_total(order_id)

        return True

    def _recalculate_order_total(self, order_id: int) -> None:
        """Recalculate order total based on items"""
        order = self.get_order(order_id)
        if not order:
            return

        items = self.get_order_items(order_id)
        total_amount = sum(
            (item.quantity * item.unit_price) + (item.total_modifier_price or 0)
            for item in items
        )

        order.total_amount = Decimal(str(total_amount))
        order.updated_at = datetime.utcnow()
        self.db.commit()

    def get_order_statistics(
        self,
        property_id: int,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
    ) -> Dict[str, Any]:
        """Get order statistics for a property"""
        query = select(Order).where(Order.property_id == property_id)

        if start_date:
            query = query.where(Order.created_at >= start_date)

        if end_date:
            query = query.where(Order.created_at <= end_date)

        result = self.db.execute(query)
        orders = result.scalars().all()

        if not orders:
            return {
                "property_id": property_id,
                "total_orders": 0,
                "total_revenue": 0.0,
                "average_order_value": 0.0,
                "orders_by_status": {},
                "orders_by_date": {},
                "last_updated": datetime.utcnow().isoformat(),
            }

        # Calculate statistics
        total_orders = len(orders)
        total_revenue = sum(
            float(order.total_amount) for order in orders if order.total_amount
        )
        average_order_value = total_revenue / total_orders if total_orders > 0 else 0

        # Orders by status
        orders_by_status = {}
        for order in orders:
            status = order.status or "unknown"
            orders_by_status[status] = orders_by_status.get(status, 0) + 1

        # Orders by date (daily breakdown)
        orders_by_date = {}
        for order in orders:
            order_date = order.created_at.date().isoformat()
            orders_by_date[order_date] = orders_by_date.get(order_date, 0) + 1

        stats = {
            "property_id": property_id,
            "total_orders": total_orders,
            "total_revenue": round(total_revenue, 2),
            "average_order_value": round(average_order_value, 2),
            "orders_by_status": orders_by_status,
            "orders_by_date": orders_by_date,
            "last_updated": datetime.utcnow().isoformat(),
        }

        return stats

    def get_revenue_analytics(self, property_id: int, days: int = 30) -> Dict[str, Any]:
        """Get revenue analytics for a property"""
        end_date = date.today()
        start_date = date.fromordinal(end_date.toordinal() - days)

        query = select(Order).where(
            and_(
                Order.property_id == property_id,
                Order.created_at >= start_date,
                Order.created_at <= end_date,
                Order.status == "completed",
            )
        )

        result = self.db.execute(query)
        orders = result.scalars().all()

        # Daily revenue breakdown
        daily_revenue = {}
        for order in orders:
            order_date = order.created_at.date().isoformat()
            revenue = float(order.total_amount) if order.total_amount else 0
            daily_revenue[order_date] = daily_revenue.get(order_date, 0) + revenue

        # Calculate trends
        total_revenue = sum(daily_revenue.values())
        average_daily_revenue = total_revenue / days if days > 0 else 0

        analytics = {
            "property_id": property_id,
            "period_days": days,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "total_revenue": round(total_revenue, 2),
            "average_daily_revenue": round(average_daily_revenue, 2),
            "daily_revenue": daily_revenue,
            "last_updated": datetime.utcnow().isoformat(),
        }

        return analytics

    def get_top_customers(
        self, property_id: int, limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Get top customers by order value"""
        # TODO: Implement based on actual order data
        # This would require joining with customer data
        return []

    def get_popular_items(
        self, property_id: int, limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Get popular menu items based on order frequency"""
        # TODO: Implement based on actual order item data
        return []

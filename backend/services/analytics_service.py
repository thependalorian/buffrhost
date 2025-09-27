"""
Analytics service for Buffr Host platform.
"""
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from sqlalchemy.orm import selectinload

from models.order import Order, OrderItem
from models.menu import Menu
from models.user import User, Profile
from models.hospitality_property import HospitalityProperty


class AnalyticsService:
    """Service for analytics and reporting."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_sales_analytics(
        self, 
        property_id: int, 
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """Get sales analytics for a property."""
        if not start_date:
            start_date = datetime.now() - timedelta(days=30)
        if not end_date:
            end_date = datetime.now()
        
        # Total sales
        total_sales_query = select(func.sum(Order.total_amount)).where(
            and_(
                Order.property_id == property_id,
                Order.created_at >= start_date,
                Order.created_at <= end_date,
                Order.status == "completed"
            )
        )
        total_sales_result = await self.db.execute(total_sales_query)
        total_sales = total_sales_result.scalar() or 0
        
        # Order count
        order_count_query = select(func.count(Order.order_id)).where(
            and_(
                Order.property_id == property_id,
                Order.created_at >= start_date,
                Order.created_at <= end_date
            )
        )
        order_count_result = await self.db.execute(order_count_query)
        order_count = order_count_result.scalar() or 0
        
        # Average order value
        avg_order_value = total_sales / order_count if order_count > 0 else 0
        
        return {
            "total_sales": float(total_sales),
            "order_count": order_count,
            "average_order_value": float(avg_order_value),
            "period": {
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat()
            }
        }
    
    async def get_top_menu_items(
        self, 
        property_id: int, 
        limit: int = 10,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[Dict[str, Any]]:
        """Get top selling menu items."""
        if not start_date:
            start_date = datetime.now() - timedelta(days=30)
        if not end_date:
            end_date = datetime.now()
        
        query = select(
            Menu.menu_item_id,
            Menu.item_name,
            func.sum(OrderItem.quantity).label("total_quantity"),
            func.sum(OrderItem.total_price).label("total_revenue")
        ).join(
            OrderItem, Menu.menu_item_id == OrderItem.menu_item_id
        ).join(
            Order, OrderItem.order_id == Order.order_id
        ).where(
            and_(
                Order.property_id == property_id,
                Order.created_at >= start_date,
                Order.created_at <= end_date,
                Order.status == "completed"
            )
        ).group_by(
            Menu.menu_item_id, Menu.item_name
        ).order_by(
            func.sum(OrderItem.quantity).desc()
        ).limit(limit)
        
        result = await self.db.execute(query)
        return [
            {
                "menu_item_id": row.menu_item_id,
                "item_name": row.item_name,
                "total_quantity": row.total_quantity,
                "total_revenue": float(row.total_revenue)
            }
            for row in result
        ]
    
    async def get_customer_analytics(
        self, 
        property_id: int,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """Get customer analytics."""
        if not start_date:
            start_date = datetime.now() - timedelta(days=30)
        if not end_date:
            end_date = datetime.now()
        
        # Total customers
        total_customers_query = select(func.count(Customer.customer_id)).where(
            Customer.property_id == property_id
        )
        total_customers_result = await self.db.execute(total_customers_query)
        total_customers = total_customers_result.scalar() or 0
        
        # New customers in period
        new_customers_query = select(func.count(Customer.customer_id)).where(
            and_(
                Customer.property_id == property_id,
                Customer.created_at >= start_date,
                Customer.created_at <= end_date
            )
        )
        new_customers_result = await self.db.execute(new_customers_query)
        new_customers = new_customers_result.scalar() or 0
        
        # Repeat customers
        repeat_customers_query = select(func.count(func.distinct(Order.customer_id))).where(
            and_(
                Order.property_id == property_id,
                Order.created_at >= start_date,
                Order.created_at <= end_date
            )
        )
        repeat_customers_result = await self.db.execute(repeat_customers_query)
        repeat_customers = repeat_customers_result.scalar() or 0
        
        return {
            "total_customers": total_customers,
            "new_customers": new_customers,
            "repeat_customers": repeat_customers,
            "period": {
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat()
            }
        }
    
    async def get_revenue_by_hour(
        self, 
        property_id: int,
        date: Optional[datetime] = None
    ) -> List[Dict[str, Any]]:
        """Get revenue breakdown by hour."""
        if not date:
            date = datetime.now().date()
        
        start_datetime = datetime.combine(date, datetime.min.time())
        end_datetime = datetime.combine(date, datetime.max.time())
        
        query = select(
            func.extract('hour', Order.created_at).label('hour'),
            func.sum(Order.total_amount).label('revenue'),
            func.count(Order.order_id).label('order_count')
        ).where(
            and_(
                Order.property_id == property_id,
                Order.created_at >= start_datetime,
                Order.created_at <= end_datetime,
                Order.status == "completed"
            )
        ).group_by(
            func.extract('hour', Order.created_at)
        ).order_by(
            func.extract('hour', Order.created_at)
        )
        
        result = await self.db.execute(query)
        return [
            {
                "hour": int(row.hour),
                "revenue": float(row.revenue),
                "order_count": row.order_count
            }
            for row in result
        ]

"""
Profile Service for The Shandi Hospitality Ecosystem Management Platform
Provides business logic for customer operations.
"""

from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import select, and_, or_
from models.user import User, Profile
from models.order import Order
from datetime import datetime
import uuid

class ProfileService:
    """Service class for customer operations"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_customer(self, customer_data: Dict[str, Any]) -> Profile:
        """Create new customer"""
        customer = Profile(**customer_data)
        self.db.add(customer)
        self.db.commit()
        self.db.refresh(customer)
        return customer
    
    def get_customer(self, customer_id: uuid.UUID) -> Optional[Profile]:
        """Get customer by ID"""
        result = self.db.execute(
            select(Profile).where(Profile.customer_id == customer_id)
        )
        return result.scalar_one_or_none()
    
    def get_customer_by_email(self, email: str) -> Optional[Profile]:
        """Get customer by email"""
        result = self.db.execute(
            select(Profile).where(Profile.email == email)
        )
        return result.scalar_one_or_none()
    
    def get_customer_by_phone(self, phone: str) -> Optional[Profile]:
        """Get customer by phone"""
        result = self.db.execute(
            select(Profile).where(Profile.phone == phone)
        )
        return result.scalar_one_or_none()
    
    def update_customer(self, customer_id: uuid.UUID, update_data: Dict[str, Any]) -> Optional[Profile]:
        """Update existing customer"""
        customer = self.get_customer(customer_id)
        if not customer:
            return None
        
        # Update fields
        for key, value in update_data.items():
            if hasattr(customer, key):
                setattr(customer, key, value)
        
        customer.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(customer)
        return customer
    
    def delete_customer(self, customer_id: uuid.UUID) -> bool:
        """Delete customer (hard delete)"""
        customer = self.get_customer(customer_id)
        if not customer:
            return False
        
        self.db.delete(customer)
        self.db.commit()
        return True
    
    def list_customers(
        self, 
        limit: int = 50,
        offset: int = 0,
        search_term: Optional[str] = None
    ) -> List[Profile]:
        """List customers with optional search"""
        query = select(Profile)
        
        if search_term:
            query = query.where(
                or_(
                    Profile.first_name.ilike(f"%{search_term}%"),
                    Profile.last_name.ilike(f"%{search_term}%"),
                    Profile.email.ilike(f"%{search_term}%"),
                    Profile.phone.ilike(f"%{search_term}%")
                )
            )
        
        query = query.offset(offset).limit(limit)
        result = self.db.execute(query)
        return result.scalars().all()
    
    def add_loyalty_points(self, customer_id: uuid.UUID, points: int) -> bool:
        """Add loyalty points to customer"""
        customer = self.get_customer(customer_id)
        if not customer:
            return False
        
        customer.loyalty_points += points
        customer.updated_at = datetime.utcnow()
        self.db.commit()
        return True
    
    def redeem_loyalty_points(self, customer_id: uuid.UUID, points: int) -> bool:
        """Redeem loyalty points from customer"""
        customer = self.get_customer(customer_id)
        if not customer:
            return False
        
        if customer.loyalty_points < points:
            return False  # Insufficient points
        
        customer.loyalty_points -= points
        customer.updated_at = datetime.utcnow()
        self.db.commit()
        return True
    
    def get_customer_orders(self, customer_id: uuid.UUID) -> List[Order]:
        """Get all orders for a customer"""
        result = self.db.execute(
            select(Order).where(Order.customer_id == customer_id)
        )
        return result.scalars().all()
    
    def get_customer_statistics(self, customer_id: uuid.UUID) -> Dict[str, Any]:
        """Get customer statistics"""
        customer = self.get_customer(customer_id)
        if not customer:
            return {}
        
        orders = self.get_customer_orders(customer_id)
        total_spent = sum(order.total_amount for order in orders if order.total_amount)
        
        stats = {
            "customer_id": str(customer_id),
            "customer_name": customer.get_full_name(),
            "email": customer.email,
            "phone": customer.phone,
            "loyalty_points": customer.loyalty_points,
            "total_orders": len(orders),
            "total_spent": float(total_spent) if total_spent else 0.0,
            "first_order_date": min(order.created_at for order in orders).isoformat() if orders else None,
            "last_order_date": max(order.created_at for order in orders).isoformat() if orders else None,
            "created_at": customer.created_at.isoformat()
        }
        
        return stats
    
    def search_customers(self, search_term: str) -> List[Profile]:
        """Search customers by name, email, or phone"""
        query = select(Profile).where(
            or_(
                Profile.first_name.ilike(f"%{search_term}%"),
                Profile.last_name.ilike(f"%{search_term}%"),
                Profile.email.ilike(f"%{search_term}%"),
                Profile.phone.ilike(f"%{search_term}%")
            )
        )
        result = self.db.execute(query)
        return result.scalars().all()
    
    def get_top_customers(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get top customers by loyalty points"""
        query = select(Profile).order_by(Profile.loyalty_points.desc()).limit(limit)
        result = self.db.execute(query)
        customers = result.scalars().all()
        
        return [
            {
                "customer_id": str(customer.customer_id),
                "name": customer.get_full_name(),
                "email": customer.email,
                "loyalty_points": customer.loyalty_points,
                "total_orders": len(self.get_customer_orders(customer.customer_id))
            }
            for customer in customers
        ]
    
    def merge_customers(self, primary_customer_id: uuid.UUID, secondary_customer_id: uuid.UUID) -> bool:
        """Merge two customer records (for duplicate handling)"""
        primary_customer = self.get_customer(primary_customer_id)
        secondary_customer = self.get_customer(secondary_customer_id)
        
        if not primary_customer or not secondary_customer:
            return False
        
        # Transfer loyalty points
        primary_customer.loyalty_points += secondary_customer.loyalty_points
        
        # Transfer orders (update customer_id in orders)
        orders = self.get_customer_orders(secondary_customer_id)
        for order in orders:
            order.customer_id = primary_customer_id
        
        # Delete secondary customer
        self.db.delete(secondary_customer)
        self.db.commit()
        
        return True

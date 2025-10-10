"""
Loyalty Service for Buffr Host Hospitality Ecosystem Management Platform
Provides business logic for cross-business loyalty operations.
"""

import uuid
from datetime import date, datetime, timedelta
from decimal import Decimal
from typing import Any, Dict, List, Optional

from sqlalchemy import and_, func, select
from sqlalchemy.orm import Session

from models.hospitality_property import HospitalityProperty
from models.loyalty import LoyaltyCampaign, LoyaltyTransaction
from models.order import Order
from models.user import User
from schemas.loyalty import LoyaltyCampaignCreate


class LoyaltyService:
    """Service class for loyalty program operations"""

    def __init__(self, db: Session):
        self.db = db

    # Core Loyalty Operations
    def earn_points(
        self,
        customer_id: uuid.UUID,
        property_id: int,
        amount: Decimal,
        service_type: str = "restaurant",
        multiplier: float = 1.0,
        order_id: Optional[uuid.UUID] = None,
    ) -> bool:
        """Earn loyalty points for a customer"""
        customer = self._get_customer(customer_id)
        if not customer:
            return False

        points_earned = int(float(amount) * multiplier)

        customer.loyalty_points += points_earned
        customer.updated_at = datetime.utcnow()

        self._create_loyalty_transaction(
            customer_id=customer_id,
            property_id=property_id,
            points_amount=points_earned,
            transaction_type="earned",
            service_type=service_type,
            order_id=order_id,
        )

        self.db.commit()
        return True

    def redeem_points(
        self,
        customer_id: uuid.UUID,
        property_id: int,
        points: int,
        service_type: str = "restaurant",
        order_id: Optional[uuid.UUID] = None,
    ) -> bool:
        """Redeem loyalty points for a customer"""
        customer = self._get_customer(customer_id)
        if not customer:
            return False

        if customer.loyalty_points < points:
            return False

        customer.loyalty_points -= points
        customer.updated_at = datetime.utcnow()

        self._create_loyalty_transaction(
            customer_id=customer_id,
            property_id=property_id,
            points_amount=points,
            transaction_type="redeemed",
            service_type=service_type,
            order_id=order_id,
        )

        self.db.commit()
        return True

    def _create_loyalty_transaction(
        self,
        customer_id: uuid.UUID,
        property_id: int,
        points_amount: int,
        transaction_type: str,
        service_type: str,
        order_id: Optional[uuid.UUID] = None,
        booking_id: Optional[uuid.UUID] = None,
        description: Optional[str] = None,
    ):
        """Create a loyalty transaction record."""
        transaction = LoyaltyTransaction(
            customer_id=customer_id,
            property_id=property_id,
            points_amount=points_amount,
            transaction_type=transaction_type,
            service_type=service_type,
            order_id=order_id,
            booking_id=booking_id,
            description=description,
        )
        self.db.add(transaction)

    def transfer_points_cross_business(
        self,
        customer_id: uuid.UUID,
        from_property_id: int,
        to_property_id: int,
        points: int,
    ) -> bool:
        """Transfer loyalty points between different business types"""
        customer = self._get_customer(customer_id)
        if not customer:
            return False

        if customer.loyalty_points < points:
            return False

        from_property = self._get_property(from_property_id)
        to_property = self._get_property(to_property_id)

        if not from_property or not to_property:
            return False

        if not self._is_cross_business_transfer_allowed(from_property, to_property):
            return False

        customer.loyalty_points -= points
        customer.updated_at = datetime.utcnow()

        self._create_loyalty_transaction(
            customer_id=customer_id,
            property_id=from_property_id,
            points_amount=points,
            transaction_type="transfer_out",
            service_type="cross_business",
            description=f"Transfer to property {to_property_id}",
        )
        self._create_loyalty_transaction(
            customer_id=customer_id,
            property_id=to_property_id,
            points_amount=points,
            transaction_type="transfer_in",
            service_type="cross_business",
            description=f"Transfer from property {from_property_id}",
        )

        self.db.commit()
        return True

    # Loyalty Campaign Management
    def create_loyalty_campaign(
        self, property_id: int, campaign_data: LoyaltyCampaignCreate
    ) -> LoyaltyCampaign:
        """Create a new loyalty campaign"""
        campaign = LoyaltyCampaign(**campaign_data.dict(), property_id=property_id)
        self.db.add(campaign)
        self.db.commit()
        self.db.refresh(campaign)
        return campaign

    def get_active_campaigns(self, property_id: int) -> List[LoyaltyCampaign]:
        """Get active loyalty campaigns for a property"""
        today = date.today()
        query = select(LoyaltyCampaign).where(
            LoyaltyCampaign.property_id == property_id,
            LoyaltyCampaign.is_active == True,
            LoyaltyCampaign.start_date <= today,
            LoyaltyCampaign.end_date >= today,
        )
        result = self.db.execute(query)
        return result.scalars().all()

    # Helper Methods
    def _get_customer(self, customer_id: uuid.UUID) -> Optional[User]:
        """Get customer by ID"""
        result = self.db.execute(
            select(User).where(User.customer_id == customer_id)
        )
        return result.scalar_one_or_none()

    def _get_property(self, property_id: int) -> Optional[HospitalityProperty]:
        """Get property by ID"""
        result = self.db.execute(
            select(HospitalityProperty).where(
                HospitalityProperty.property_id == property_id
            )
        )
        return result.scalar_one_or_none()

    def _is_cross_business_transfer_allowed(
        self, from_property: HospitalityProperty, to_property: HospitalityProperty
    ) -> bool:
        """Check if cross-business transfers are allowed between properties"""
        # For now, allow all transfers between properties of the same owner
        return from_property.owner_id == to_property.owner_id

    def _get_customer_total_spent(self, customer_id: uuid.UUID) -> Decimal:
        """Get total amount spent by customer"""
        result = self.db.execute(
            select(func.sum(Order.total_amount)).where(Order.customer_id == customer_id)
        )
        total = result.scalar() or Decimal("0")
        return total

    def _get_customer_total_orders(self, customer_id: uuid.UUID) -> int:
        """Get total number of orders by customer"""
        result = self.db.execute(
            select(func.count(Order.order_id)).where(Order.customer_id == customer_id)
        )
        return result.scalar() or 0

"""
Pydantic schemas for Loyalty services.
"""
import uuid
from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class LoyaltyTransactionBase(BaseModel):
    customer_id: uuid.UUID
    property_id: int
    transaction_type: str
    points_amount: int
    service_type: Optional[str] = None
    order_id: Optional[uuid.UUID] = None
    booking_id: Optional[uuid.UUID] = None
    description: Optional[str] = None


class LoyaltyTransactionCreate(LoyaltyTransactionBase):
    pass


class LoyaltyTransaction(LoyaltyTransactionBase):
    transaction_id: uuid.UUID
    created_at: datetime

    class Config:
        orm_mode = True


class LoyaltyCampaignBase(BaseModel):
    campaign_name: str
    description: Optional[str] = None
    start_date: date
    end_date: date
    points_multiplier: int = 1
    target_tiers: Optional[List[str]] = None
    is_active: bool = True


class LoyaltyCampaignCreate(LoyaltyCampaignBase):
    pass


class LoyaltyCampaign(LoyaltyCampaignBase):
    campaign_id: int
    property_id: int

    class Config:
        orm_mode = True

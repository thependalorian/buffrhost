"""
Loyalty program routes for The Shandi Hospitality Ecosystem Management Platform
Provides API endpoints for cross-business loyalty operations.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import date
from decimal import Decimal
import uuid

from database import get_db
from models.user import BuffrHostUser
from routes.auth import get_current_user, require_property_access, require_permission
from auth.rbac import Permission
from services.loyalty_service import LoyaltyService
from schemas.loyalty import LoyaltyCampaignCreate, LoyaltyCampaign, LoyaltyTransaction

router = APIRouter()

@router.get("/{property_id}/loyalty/members", response_model=List[dict])
async def get_loyalty_members(
    property_id: int,
    tier: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get loyalty program members for a property"""
    service = LoyaltyService(db)
    members = await service.get_loyalty_members(property_id=property_id, tier=tier, limit=limit, offset=offset)
    return members

@router.get("/{property_id}/loyalty/members/{customer_id}", response_model=dict)
async def get_loyalty_member_details(
    property_id: int,
    customer_id: uuid.UUID,
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get detailed loyalty information for a specific member"""
    service = LoyaltyService(db)
    summary = await service.get_customer_loyalty_summary(customer_id=customer_id)
    if not summary:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    return summary

@router.post("/{property_id}/loyalty/earn-points", response_model=LoyaltyTransaction)
async def earn_loyalty_points(
    property_id: int,
    customer_id: uuid.UUID,
    amount: Decimal,
    service_type: str,
    order_id: Optional[uuid.UUID] = None,
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Earn loyalty points for a customer"""
    service = LoyaltyService(db)
    transaction = await service.earn_points(
        customer_id=customer_id, 
        property_id=property_id, 
        amount=amount, 
        service_type=service_type,
        order_id=order_id
    )
    if not transaction:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to earn loyalty points")
    return transaction

@router.post("/{property_id}/loyalty/redeem-points", response_model=LoyaltyTransaction)
async def redeem_loyalty_points(
    property_id: int,
    customer_id: uuid.UUID,
    points: int,
    service_type: str,
    order_id: Optional[uuid.UUID] = None,
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Redeem loyalty points for a customer"""
    service = LoyaltyService(db)
    transaction = await service.redeem_points(
        customer_id=customer_id, 
        property_id=property_id, 
        points=points, 
        service_type=service_type,
        order_id=order_id
    )
    if not transaction:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to redeem points")
    return transaction

@router.get("/{property_id}/loyalty/campaigns", response_model=List[LoyaltyCampaign])
async def get_loyalty_campaigns(
    property_id: int,
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get active loyalty campaigns for a property"""
    service = LoyaltyService(db)
    return await service.get_active_campaigns(property_id=property_id)

@router.post("/{property_id}/loyalty/campaigns", response_model=LoyaltyCampaign)
async def create_loyalty_campaign(
    property_id: int,
    campaign_data: LoyaltyCampaignCreate,
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new loyalty campaign"""
    service = LoyaltyService(db)
    return await service.create_loyalty_campaign(property_id=property_id, campaign_data=campaign_data)

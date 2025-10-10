"""
QR Code Loyalty routes for Buffr Host Hospitality Ecosystem Management Platform
Provides API endpoints for QR code loyalty operations.
"""

from datetime import datetime, timedelta
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from auth.rbac import Permission
from database import get_db
from models.user import User
from routes.auth import (get_current_user, require_permission,
                         require_property_access)
from services.qr_loyalty_service import QRLoyaltyService

router = APIRouter()


@router.get("/{property_id}/qr/loyalty-enrollment")
async def generate_loyalty_enrollment_qr(
    property_id: int,
    customer_id: Optional[str] = Query(
        None, description="Customer ID for personalized QR"
    ),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Generate QR code for loyalty program enrollment"""
    service = QRLoyaltyService(db)

    result = service.generate_loyalty_enrollment_qr(property_id, customer_id)

    if not result.get("success"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", "Failed to generate enrollment QR code"),
        )

    return {
        "success": True,
        "property_id": property_id,
        "qr_code": result["qr_code"],
        "enrollment_url": result["enrollment_url"],
        "expires_at": result["expires_at"],
    }


@router.post("/{property_id}/qr/cross-business-redemption")
async def generate_cross_business_redemption_qr(
    property_id: int,
    redemption_data: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Generate QR code for cross-business redemption"""
    service = QRLoyaltyService(db)

    customer_id = redemption_data.get("customer_id")
    source_service = redemption_data.get("source_service")
    target_service = redemption_data.get("target_service")
    points = redemption_data.get("points", 0)

    if not all([customer_id, source_service, target_service]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Customer ID, source service, and target service are required",
        )

    result = service.generate_cross_business_redemption_qr(
        customer_id, property_id, source_service, target_service, points
    )

    if not result.get("success"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", "Failed to generate redemption QR code"),
        )

    return {
        "success": True,
        "property_id": property_id,
        "qr_code": result["qr_code"],
        "redemption_id": result["redemption_id"],
        "expires_at": result["expires_at"],
        "customer_tier": result["customer_tier"],
    }


@router.get("/{property_id}/qr/menu-with-loyalty")
async def generate_menu_with_loyalty_qr(
    property_id: int,
    customer_id: Optional[str] = Query(
        None, description="Customer ID for personalized experience"
    ),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Generate QR code that combines menu access with loyalty enrollment"""
    service = QRLoyaltyService(db)

    result = service.generate_menu_with_loyalty_qr(property_id, customer_id)

    if not result.get("success"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", "Failed to generate menu with loyalty QR code"),
        )

    return {
        "success": True,
        "property_id": property_id,
        "qr_code": result["qr_code"],
        "menu_url": result["menu_url"],
        "loyalty_url": result["loyalty_url"],
        "property_name": result["property_name"],
    }


@router.post("/{property_id}/qr/scan")
async def scan_loyalty_qr(
    property_id: int,
    qr_data: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Process scanned QR code for loyalty operations"""
    service = QRLoyaltyService(db)

    qr_content = qr_data.get("qr_content")
    if not qr_content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="QR code content is required",
        )

    result = service.scan_loyalty_qr(qr_content, property_id)

    if not result.get("success"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", "Failed to process QR code"),
        )

    return {
        "success": True,
        "property_id": property_id,
        "action": result.get("action"),
        "message": result.get("message"),
        "data": result,
    }


@router.get("/{property_id}/qr/analytics")
async def get_loyalty_qr_analytics(
    property_id: int,
    start_date: Optional[datetime] = Query(
        None, description="Start date for analytics"
    ),
    end_date: Optional[datetime] = Query(None, description="End date for analytics"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get analytics for QR code loyalty interactions"""
    service = QRLoyaltyService(db)

    analytics = service.get_loyalty_qr_analytics(property_id, start_date, end_date)

    return {"success": True, "property_id": property_id, "analytics": analytics}


@router.get("/{property_id}/qr/loyalty-wallet")
async def get_loyalty_wallet_qr(
    property_id: int,
    customer_id: str = Query(..., description="Customer ID for loyalty wallet"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Generate QR code for customer loyalty wallet access"""
    service = QRLoyaltyService(db)

    # Create loyalty wallet data
    wallet_data = {
        "type": "loyalty_wallet",
        "customer_id": customer_id,
        "property_id": property_id,
        "wallet_url": f"https://shandi.app/loyalty/wallet/{customer_id}",
        "timestamp": datetime.utcnow().isoformat(),
    }

    # Generate QR code
    qr_code_data = service._create_qr_code(wallet_data)

    return {
        "success": True,
        "property_id": property_id,
        "customer_id": customer_id,
        "qr_code": qr_code_data,
        "wallet_url": wallet_data["wallet_url"],
    }


@router.get("/{property_id}/qr/quick-redemption")
async def generate_quick_redemption_qr(
    property_id: int,
    customer_id: str = Query(..., description="Customer ID"),
    service_type: str = Query(..., description="Service type for redemption"),
    points: int = Query(..., description="Points to redeem"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Generate QR code for quick loyalty redemption"""
    service = QRLoyaltyService(db)

    # Create quick redemption data
    redemption_data = {
        "type": "quick_redemption",
        "customer_id": customer_id,
        "property_id": property_id,
        "service_type": service_type,
        "points": points,
        "timestamp": datetime.utcnow().isoformat(),
        "expires_at": (datetime.utcnow() + timedelta(hours=1)).isoformat(),
    }

    # Generate QR code
    qr_code_data = service._create_qr_code(redemption_data)

    return {
        "success": True,
        "property_id": property_id,
        "customer_id": customer_id,
        "qr_code": qr_code_data,
        "service_type": service_type,
        "points": points,
        "expires_at": redemption_data["expires_at"],
    }

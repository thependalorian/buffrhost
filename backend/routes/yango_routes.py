"""
Yango API Routes
FastAPI routes for Yango ride-hailing integration
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, List
from ..services.yango_service import YangoService, YangoTripInfo, YangoZoneInfo, create_yango_service
from ..auth.dependencies import get_current_user
from ..models.user import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/yango", tags=["yango"])

@router.get("/trip-info", response_model=YangoTripInfo)
async def get_trip_info(
    pickup_lat: float = Query(..., description="Pickup latitude"),
    pickup_lon: float = Query(..., description="Pickup longitude"),
    destination_lat: float = Query(..., description="Destination latitude"),
    destination_lon: float = Query(..., description="Destination longitude"),
    fare_class: str = Query("econom", description="Fare class (econom, business, comfortplus, minivan, vip)"),
    requirements: Optional[str] = Query(None, description="Comma-separated requirements"),
    language: str = Query("en", description="Response language"),
    current_user: User = Depends(get_current_user)
) -> YangoTripInfo:
    """
    Get trip information for a route
    
    Returns pricing, availability, and estimated time for different fare classes
    """
    try:
        yango_service = create_yango_service()
        
        req_list = requirements.split(",") if requirements else []
        
        trip_info = await yango_service.get_trip_info(
            pickup_lat=pickup_lat,
            pickup_lon=pickup_lon,
            destination_lat=destination_lat,
            destination_lon=destination_lon,
            fare_class=fare_class,
            requirements=req_list,
            language=language
        )
        
        logger.info(f"Trip info retrieved for user {current_user.id}")
        return trip_info
        
    except ValueError as e:
        logger.error(f"Configuration error: {str(e)}")
        raise HTTPException(status_code=500, detail="Yango service not configured")
    except Exception as e:
        logger.error(f"Failed to get trip info: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/zone-info", response_model=YangoZoneInfo)
async def get_zone_info(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    current_user: User = Depends(get_current_user)
) -> YangoZoneInfo:
    """
    Check if Yango services are available in the area
    
    Returns available fare classes and services for the specified location
    """
    try:
        yango_service = create_yango_service()
        
        zone_info = await yango_service.get_zone_info(lat=lat, lon=lon)
        
        logger.info(f"Zone info retrieved for user {current_user.id}")
        return zone_info
        
    except ValueError as e:
        logger.error(f"Configuration error: {str(e)}")
        raise HTTPException(status_code=500, detail="Yango service not configured")
    except Exception as e:
        logger.error(f"Failed to get zone info: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/booking-link")
async def get_booking_link(
    pickup_lat: float = Query(..., description="Pickup latitude"),
    pickup_lon: float = Query(..., description="Pickup longitude"),
    destination_lat: float = Query(..., description="Destination latitude"),
    destination_lon: float = Query(..., description="Destination longitude"),
    ref: str = Query("buffr_host", description="Reference identifier"),
    current_user: User = Depends(get_current_user)
) -> dict:
    """
    Generate a booking link for the Yango app
    
    Returns a URL that opens the Yango app with pre-filled trip details
    """
    try:
        yango_service = create_yango_service()
        
        booking_link = yango_service.generate_booking_link(
            pickup_lat=pickup_lat,
            pickup_lon=pickup_lon,
            destination_lat=destination_lat,
            destination_lon=destination_lon,
            ref=ref
        )
        
        logger.info(f"Booking link generated for user {current_user.id}")
        return {"booking_url": booking_link}
        
    except ValueError as e:
        logger.error(f"Configuration error: {str(e)}")
        raise HTTPException(status_code=500, detail="Yango service not configured")
    except Exception as e:
        logger.error(f"Failed to generate booking link: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/service-availability")
async def check_service_availability(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    current_user: User = Depends(get_current_user)
) -> dict:
    """
    Check if Yango services are available in the area
    
    Returns availability status and basic information
    """
    try:
        yango_service = create_yango_service()
        
        is_available = await yango_service.check_service_availability(lat=lat, lon=lon)
        
        logger.info(f"Service availability checked for user {current_user.id}: {is_available}")
        return {
            "available": is_available,
            "location": {"lat": lat, "lon": lon}
        }
        
    except ValueError as e:
        logger.error(f"Configuration error: {str(e)}")
        raise HTTPException(status_code=500, detail="Yango service not configured")
    except Exception as e:
        logger.error(f"Failed to check service availability: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/health")
async def health_check() -> dict:
    """
    Health check endpoint for Yango service
    
    Returns service status and configuration info
    """
    try:
        yango_service = create_yango_service()
        
        return {
            "status": "healthy",
            "service": "yango",
            "configured": True,
            "base_url": yango_service.base_url
        }
        
    except ValueError as e:
        logger.warning(f"Yango service not configured: {str(e)}")
        return {
            "status": "unhealthy",
            "service": "yango",
            "configured": False,
            "error": str(e)
        }
    except Exception as e:
        logger.error(f"Yango health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "service": "yango",
            "configured": True,
            "error": str(e)
        }
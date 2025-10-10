"""
Yango Service Integration
Service for integrating with Yango ride-hailing API
"""

import httpx
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)

class YangoTripOption(BaseModel):
    """Yango trip option model"""
    class_name: str
    class_text: str
    class_level: int
    min_price: float
    price: float
    price_text: str
    waiting_time: Optional[float] = None

class YangoTripInfo(BaseModel):
    """Yango trip information model"""
    currency: str
    distance: Optional[float] = None
    time: Optional[float] = None
    options: List[YangoTripOption]

class YangoZoneInfo(BaseModel):
    """Yango zone information model"""
    tariffs: List[Dict[str, Any]]

class YangoService:
    """Service for integrating with Yango API"""
    
    def __init__(self, api_key: str, client_id: str):
        self.api_key = api_key
        self.client_id = client_id
        self.base_url = "https://taxi-routeinfo.taxi.yandex.net"
    
    async def get_trip_info(
        self,
        pickup_lat: float,
        pickup_lon: float,
        destination_lat: float,
        destination_lon: float,
        fare_class: str = "econom",
        requirements: List[str] = None,
        language: str = "en"
    ) -> YangoTripInfo:
        """
        Get trip information including pricing and availability
        
        Args:
            pickup_lat: Pickup latitude
            pickup_lon: Pickup longitude
            destination_lat: Destination latitude
            destination_lon: Destination longitude
            fare_class: Fare class (econom, business, comfortplus, minivan, vip)
            requirements: List of requirements (yellowcarnumber, nosmoking, etc.)
            language: Response language
            
        Returns:
            YangoTripInfo object with trip details
        """
        if requirements is None:
            requirements = []
            
        params = {
            "clid": self.client_id,
            "apikey": self.api_key,
            "rll": f"{pickup_lon},{pickup_lat}~{destination_lon},{destination_lat}",
            "class": fare_class,
            "req": ",".join(requirements),
            "lang": language
        }
        
        headers = {
            "Accept": "application/json",
            "YaTaxi-Api-Key": self.api_key
        }
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{self.base_url}/taxi_info",
                    params=params,
                    headers=headers
                )
                response.raise_for_status()
                
                data = response.json()
                logger.info(f"Yango trip info retrieved: {len(data.get('options', []))} options")
                
                return YangoTripInfo(**data)
                
        except httpx.HTTPStatusError as e:
            logger.error(f"Yango API HTTP error: {e.response.status_code}")
            raise Exception(f"Yango API error: {e.response.status_code}")
        except httpx.RequestError as e:
            logger.error(f"Yango API request error: {str(e)}")
            raise Exception(f"Yango API request failed: {str(e)}")
        except Exception as e:
            logger.error(f"Yango API error: {str(e)}")
            raise Exception(f"Failed to get trip info: {str(e)}")
    
    async def get_zone_info(self, lat: float, lon: float) -> YangoZoneInfo:
        """
        Check if Yango services are available in the area
        
        Args:
            lat: Latitude
            lon: Longitude
            
        Returns:
            YangoZoneInfo object with zone details
        """
        params = {
            "clid": self.client_id,
            "apikey": self.api_key,
            "rll": f"{lon},{lat}"
        }
        
        headers = {
            "Accept": "application/json",
            "YaTaxi-Api-Key": self.api_key
        }
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{self.base_url}/zone_info",
                    params=params,
                    headers=headers
                )
                response.raise_for_status()
                
                data = response.json()
                logger.info(f"Yango zone info retrieved: {len(data.get('tariffs', []))} tariffs")
                
                return YangoZoneInfo(**data)
                
        except httpx.HTTPStatusError as e:
            logger.error(f"Yango API HTTP error: {e.response.status_code}")
            raise Exception(f"Yango API error: {e.response.status_code}")
        except httpx.RequestError as e:
            logger.error(f"Yango API request error: {str(e)}")
            raise Exception(f"Yango API request failed: {str(e)}")
        except Exception as e:
            logger.error(f"Yango API error: {str(e)}")
            raise Exception(f"Failed to get zone info: {str(e)}")
    
    def generate_booking_link(
        self,
        pickup_lat: float,
        pickup_lon: float,
        destination_lat: float,
        destination_lon: float,
        ref: str = "buffr_host"
    ) -> str:
        """
        Generate a booking link for the Yango app
        
        Args:
            pickup_lat: Pickup latitude
            pickup_lon: Pickup longitude
            destination_lat: Destination latitude
            destination_lon: Destination longitude
            ref: Reference identifier
            
        Returns:
            Booking URL string
        """
        base_url = "https://yango.go.link/route"
        params = {
            "start-lat": str(pickup_lat),
            "start-lon": str(pickup_lon),
            "end-lat": str(destination_lat),
            "end-lon": str(destination_lon),
            "ref": ref,
            "adj_t": "vokme8e_nd9s9z9",
            "lang": "en",
            "adj_deeplink_js": "1",
            "adj_fallback": f"https://yango.com/en_int/order/?gfrom={pickup_lon},{pickup_lat}&gto={destination_lon},{destination_lat}&ref={ref}"
        }
        
        query_string = "&".join([f"{k}={v}" for k, v in params.items()])
        return f"{base_url}?{query_string}"
    
    async def check_service_availability(self, lat: float, lon: float) -> bool:
        """
        Check if Yango services are available in the area
        
        Args:
            lat: Latitude
            lon: Longitude
            
        Returns:
            True if services are available, False otherwise
        """
        try:
            zone_info = await self.get_zone_info(lat, lon)
            return len(zone_info.tariffs) > 0
        except Exception as e:
            logger.error(f"Failed to check service availability: {str(e)}")
            return False

# Service factory
def create_yango_service() -> YangoService:
    """Create Yango service instance with environment variables"""
    import os
    
    api_key = os.getenv("YANGO_API_KEY")
    client_id = os.getenv("YANGO_CLIENT_ID")
    
    if not api_key or not client_id:
        raise ValueError("YANGO_API_KEY and YANGO_CLIENT_ID environment variables are required")
    
    return YangoService(api_key=api_key, client_id=client_id)
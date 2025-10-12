"""
LOCATION MANAGEMENT SYSTEM
Advanced location and geospatial management for Buffr Host
"""

from typing import Dict, List, Optional, Any, Union, Tuple
from datetime import datetime
from enum import Enum
from dataclasses import dataclass, field
from sqlalchemy import Column, Integer, String, DateTime, JSON, Boolean, ForeignKey, Text, Float, Index
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
import json
import uuid
import math
from geopy.distance import geodesic
from geopy.geocoders import Nominatim

Base = declarative_base()

class LocationType(Enum):
    """Location types"""
    PROPERTY = "property"
    ROOM = "room"
    FACILITY = "facility"
    RESTAURANT = "restaurant"
    SPA = "spa"
    POOL = "pool"
    GYM = "gym"
    PARKING = "parking"
    EVENT_SPACE = "event_space"
    MEETING_ROOM = "meeting_room"
    LANDMARK = "landmark"
    TRANSPORT = "transport"
    CUSTOM = "custom"

class LocationStatus(Enum):
    """Location status"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    MAINTENANCE = "maintenance"
    CLOSED = "closed"
    TEMPORARILY_UNAVAILABLE = "temporarily_unavailable"

@dataclass
class Coordinates:
    """Geographic coordinates"""
    latitude: float
    longitude: float
    altitude: Optional[float] = None
    accuracy: Optional[float] = None

@dataclass
class Address:
    """Address information"""
    street: str
    city: str
    state: str
    country: str
    postal_code: str
    address_line_2: Optional[str] = None
    formatted_address: Optional[str] = None

@dataclass
class LocationMetadata:
    """Location metadata"""
    timezone: str = "UTC"
    language: str = "en"
    currency: str = "NAD"
    amenities: List[str] = field(default_factory=list)
    accessibility_features: List[str] = field(default_factory=list)
    operating_hours: Dict[str, Any] = field(default_factory=dict)
    contact_info: Dict[str, Any] = field(default_factory=dict)
    social_media: Dict[str, Any] = field(default_factory=dict)
    images: List[str] = field(default_factory=list)
    tags: List[str] = field(default_factory=list)

class Location(Base):
    """Location model"""
    __tablename__ = 'locations'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    description = Column(Text)
    type = Column(String(50), nullable=False)
    status = Column(String(50), default=LocationStatus.ACTIVE.value)
    
    # Geographic coordinates
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    altitude = Column(Float)
    accuracy = Column(Float)
    
    # Address information
    street = Column(String(255))
    city = Column(String(100))
    state = Column(String(100))
    country = Column(String(100))
    postal_code = Column(String(20))
    address_line_2 = Column(String(255))
    formatted_address = Column(Text)
    
    # Location hierarchy
    parent_location_id = Column(String, ForeignKey('locations.id'))
    property_id = Column(String(255))  # Associated property
    
    # Metadata
    metadata = Column(JSON)  # LocationMetadata object
    
    # Timestamps
    created_by = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    parent_location = relationship("Location", remote_side=[id])
    child_locations = relationship("Location", back_populates="parent_location")
    nearby_locations = relationship("LocationDistance", back_populates="location")
    
    # Indexes for geospatial queries
    __table_args__ = (
        Index('idx_location_coordinates', 'latitude', 'longitude'),
        Index('idx_location_type', 'type'),
        Index('idx_location_status', 'status'),
        Index('idx_location_property', 'property_id'),
    )

class LocationDistance(Base):
    """Location distance relationships"""
    __tablename__ = 'location_distances'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    location_id = Column(String, ForeignKey('locations.id'))
    nearby_location_id = Column(String, ForeignKey('locations.id'))
    distance_meters = Column(Float, nullable=False)
    walking_time_minutes = Column(Float)
    driving_time_minutes = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    location = relationship("Location", foreign_keys=[location_id], back_populates="nearby_locations")
    nearby_location = relationship("Location", foreign_keys=[nearby_location_id])

class LocationManager:
    """Advanced location management system"""
    
    def __init__(self, db_session, geocoder_api_key: str = None):
        self.db = db_session
        self.geocoder = Nominatim(user_agent="buffr_host") if not geocoder_api_key else None
        self.location_cache: Dict[str, Location] = {}
    
    async def create_location(self, location_data: Dict[str, Any]) -> Location:
        """Create a new location"""
        try:
            # Validate coordinates
            if not self._validate_coordinates(location_data.get('latitude'), location_data.get('longitude')):
                raise Exception("Invalid coordinates")
            
            # Geocode address if coordinates not provided
            if not location_data.get('latitude') or not location_data.get('longitude'):
                coords = await self._geocode_address(location_data.get('address', {}))
                if coords:
                    location_data['latitude'] = coords.latitude
                    location_data['longitude'] = coords.longitude
            
            # Create location
            location = Location(
                name=location_data['name'],
                description=location_data.get('description', ''),
                type=location_data['type'],
                status=location_data.get('status', LocationStatus.ACTIVE.value),
                latitude=location_data['latitude'],
                longitude=location_data['longitude'],
                altitude=location_data.get('altitude'),
                accuracy=location_data.get('accuracy'),
                street=location_data.get('address', {}).get('street'),
                city=location_data.get('address', {}).get('city'),
                state=location_data.get('address', {}).get('state'),
                country=location_data.get('address', {}).get('country'),
                postal_code=location_data.get('address', {}).get('postal_code'),
                address_line_2=location_data.get('address', {}).get('address_line_2'),
                formatted_address=location_data.get('address', {}).get('formatted_address'),
                parent_location_id=location_data.get('parent_location_id'),
                property_id=location_data.get('property_id'),
                metadata=location_data.get('metadata', {}),
                created_by=location_data.get('created_by', 'system')
            )
            
            self.db.add(location)
            await self.db.commit()
            await self.db.refresh(location)
            
            # Calculate nearby locations
            await self._calculate_nearby_locations(location)
            
            return location
        except Exception as e:
            await self.db.rollback()
            raise Exception(f"Failed to create location: {str(e)}")
    
    def _validate_coordinates(self, latitude: float, longitude: float) -> bool:
        """Validate geographic coordinates"""
        if latitude is None or longitude is None:
            return False
        return -90 <= latitude <= 90 and -180 <= longitude <= 180
    
    async def _geocode_address(self, address: Dict[str, Any]) -> Optional[Coordinates]:
        """Geocode address to coordinates"""
        try:
            if not self.geocoder:
                return None
            
            # Build address string
            address_parts = []
            if address.get('street'):
                address_parts.append(address['street'])
            if address.get('city'):
                address_parts.append(address['city'])
            if address.get('state'):
                address_parts.append(address['state'])
            if address.get('country'):
                address_parts.append(address['country'])
            
            address_string = ', '.join(address_parts)
            
            # Geocode
            location = self.geocoder.geocode(address_string)
            if location:
                return Coordinates(
                    latitude=location.latitude,
                    longitude=location.longitude,
                    altitude=location.altitude
                )
            
            return None
        except Exception:
            return None
    
    async def _calculate_nearby_locations(self, location: Location, radius_km: float = 10.0):
        """Calculate nearby locations within radius"""
        try:
            # Find locations within radius
            nearby_locations = await self._find_locations_within_radius(
                location.latitude, location.longitude, radius_km
            )
            
            # Calculate distances and create relationships
            for nearby in nearby_locations:
                if nearby.id == location.id:
                    continue
                
                distance = geodesic(
                    (location.latitude, location.longitude),
                    (nearby.latitude, nearby.longitude)
                ).kilometers * 1000  # Convert to meters
                
                # Estimate walking and driving times
                walking_time = distance / 1000 / 5 * 60  # 5 km/h walking speed
                driving_time = distance / 1000 / 50 * 60  # 50 km/h average driving speed
                
                # Create distance relationship
                distance_rel = LocationDistance(
                    location_id=location.id,
                    nearby_location_id=nearby.id,
                    distance_meters=distance,
                    walking_time_minutes=walking_time,
                    driving_time_minutes=driving_time
                )
                self.db.add(distance_rel)
            
            await self.db.commit()
        except Exception as e:
            print(f"Error calculating nearby locations: {e}")
    
    async def _find_locations_within_radius(self, latitude: float, longitude: float, 
                                          radius_km: float) -> List[Location]:
        """Find locations within radius using bounding box approximation"""
        try:
            # Calculate bounding box
            lat_delta = radius_km / 111.0  # Approximate km per degree latitude
            lng_delta = radius_km / (111.0 * math.cos(math.radians(latitude)))
            
            min_lat = latitude - lat_delta
            max_lat = latitude + lat_delta
            min_lng = longitude - lng_delta
            max_lng = longitude + lng_delta
            
            # Query locations in bounding box
            locations = await self.db.query(Location).filter(
                Location.latitude.between(min_lat, max_lat),
                Location.longitude.between(min_lng, max_lng)
            ).all()
            
            # Filter by actual distance
            nearby_locations = []
            for loc in locations:
                distance = geodesic(
                    (latitude, longitude),
                    (loc.latitude, loc.longitude)
                ).kilometers
                
                if distance <= radius_km:
                    nearby_locations.append(loc)
            
            return nearby_locations
        except Exception:
            return []
    
    async def get_location(self, location_id: str) -> Optional[Location]:
        """Get location by ID"""
        try:
            if location_id in self.location_cache:
                return self.location_cache[location_id]
            
            location = await self.db.get(Location, location_id)
            if location:
                self.location_cache[location_id] = location
            
            return location
        except Exception:
            return None
    
    async def get_locations_by_type(self, location_type: LocationType, 
                                  property_id: str = None, 
                                  status: LocationStatus = None) -> List[Location]:
        """Get locations by type"""
        try:
            query = self.db.query(Location).filter(Location.type == location_type.value)
            
            if property_id:
                query = query.filter(Location.property_id == property_id)
            if status:
                query = query.filter(Location.status == status.value)
            
            return await query.all()
        except Exception:
            return []
    
    async def search_locations(self, query: str, location_type: LocationType = None,
                             property_id: str = None, limit: int = 50) -> List[Location]:
        """Search locations by name or description"""
        try:
            db_query = self.db.query(Location).filter(
                Location.name.ilike(f"%{query}%") |
                Location.description.ilike(f"%{query}%")
            )
            
            if location_type:
                db_query = db_query.filter(Location.type == location_type.value)
            if property_id:
                db_query = db_query.filter(Location.property_id == property_id)
            
            return await db_query.limit(limit).all()
        except Exception:
            return []
    
    async def find_nearby_locations(self, latitude: float, longitude: float,
                                  radius_km: float = 5.0, location_type: LocationType = None,
                                  limit: int = 20) -> List[Dict[str, Any]]:
        """Find locations near given coordinates"""
        try:
            # Find locations within radius
            nearby_locations = await self._find_locations_within_radius(
                latitude, longitude, radius_km
            )
            
            # Filter by type if specified
            if location_type:
                nearby_locations = [loc for loc in nearby_locations 
                                 if loc.type == location_type.value]
            
            # Calculate distances and sort
            results = []
            for location in nearby_locations[:limit]:
                distance = geodesic(
                    (latitude, longitude),
                    (location.latitude, location.longitude)
                ).kilometers
                
                results.append({
                    "location": location,
                    "distance_km": round(distance, 2),
                    "walking_time_minutes": round(distance / 5 * 60, 1),
                    "driving_time_minutes": round(distance / 50 * 60, 1)
                })
            
            # Sort by distance
            results.sort(key=lambda x: x['distance_km'])
            return results
        except Exception:
            return []
    
    async def get_location_hierarchy(self, location_id: str) -> Dict[str, Any]:
        """Get location hierarchy (parent and children)"""
        try:
            location = await self.get_location(location_id)
            if not location:
                return {}
            
            # Get parent location
            parent = None
            if location.parent_location_id:
                parent = await self.get_location(location.parent_location_id)
            
            # Get child locations
            children = await self.db.query(Location).filter(
                Location.parent_location_id == location_id
            ).all()
            
            return {
                "location": location,
                "parent": parent,
                "children": children,
                "hierarchy_level": await self._calculate_hierarchy_level(location)
            }
        except Exception:
            return {}
    
    async def _calculate_hierarchy_level(self, location: Location) -> int:
        """Calculate location hierarchy level"""
        level = 0
        current = location
        
        while current.parent_location_id:
            current = await self.get_location(current.parent_location_id)
            if not current:
                break
            level += 1
        
        return level
    
    async def update_location(self, location_id: str, updates: Dict[str, Any]) -> Location:
        """Update location"""
        try:
            location = await self.get_location(location_id)
            if not location:
                raise Exception("Location not found")
            
            # Update fields
            for key, value in updates.items():
                if hasattr(location, key) and key not in ['id', 'created_at', 'created_by']:
                    setattr(location, key, value)
            
            # Recalculate nearby locations if coordinates changed
            if 'latitude' in updates or 'longitude' in updates:
                await self._recalculate_nearby_locations(location)
            
            location.updated_at = datetime.utcnow()
            await self.db.commit()
            await self.db.refresh(location)
            
            return location
        except Exception as e:
            await self.db.rollback()
            raise Exception(f"Failed to update location: {str(e)}")
    
    async def _recalculate_nearby_locations(self, location: Location):
        """Recalculate nearby locations for updated location"""
        try:
            # Delete existing distance relationships
            await self.db.query(LocationDistance).filter(
                LocationDistance.location_id == location.id
            ).delete()
            
            # Recalculate
            await self._calculate_nearby_locations(location)
        except Exception as e:
            print(f"Error recalculating nearby locations: {e}")
    
    async def delete_location(self, location_id: str) -> bool:
        """Delete location"""
        try:
            location = await self.get_location(location_id)
            if not location:
                return False
            
            # Delete distance relationships
            await self.db.query(LocationDistance).filter(
                (LocationDistance.location_id == location_id) |
                (LocationDistance.nearby_location_id == location_id)
            ).delete()
            
            # Delete child locations (cascade)
            children = await self.db.query(Location).filter(
                Location.parent_location_id == location_id
            ).all()
            
            for child in children:
                await self.delete_location(child.id)
            
            # Delete location
            await self.db.delete(location)
            await self.db.commit()
            
            # Remove from cache
            if location_id in self.location_cache:
                del self.location_cache[location_id]
            
            return True
        except Exception:
            return False
    
    async def get_location_statistics(self, property_id: str = None) -> Dict[str, Any]:
        """Get location statistics"""
        try:
            query = self.db.query(Location)
            if property_id:
                query = query.filter(Location.property_id == property_id)
            
            total_locations = await query.count()
            
            # Count by type
            type_counts = {}
            for location_type in LocationType:
                count = await query.filter(Location.type == location_type.value).count()
                type_counts[location_type.value] = count
            
            # Count by status
            status_counts = {}
            for status in LocationStatus:
                count = await query.filter(Location.status == status.value).count()
                status_counts[status.value] = count
            
            return {
                "total_locations": total_locations,
                "by_type": type_counts,
                "by_status": status_counts
            }
        except Exception:
            return {}
    
    async def export_locations(self, property_id: str = None, 
                             location_type: LocationType = None) -> List[Dict[str, Any]]:
        """Export locations to list of dictionaries"""
        try:
            query = self.db.query(Location)
            
            if property_id:
                query = query.filter(Location.property_id == property_id)
            if location_type:
                query = query.filter(Location.type == location_type.value)
            
            locations = await query.all()
            
            return [
                {
                    "id": loc.id,
                    "name": loc.name,
                    "description": loc.description,
                    "type": loc.type,
                    "status": loc.status,
                    "coordinates": {
                        "latitude": loc.latitude,
                        "longitude": loc.longitude,
                        "altitude": loc.altitude,
                        "accuracy": loc.accuracy
                    },
                    "address": {
                        "street": loc.street,
                        "city": loc.city,
                        "state": loc.state,
                        "country": loc.country,
                        "postal_code": loc.postal_code,
                        "address_line_2": loc.address_line_2,
                        "formatted_address": loc.formatted_address
                    },
                    "property_id": loc.property_id,
                    "parent_location_id": loc.parent_location_id,
                    "metadata": loc.metadata,
                    "created_at": loc.created_at.isoformat(),
                    "updated_at": loc.updated_at.isoformat()
                }
                for loc in locations
            ]
        except Exception:
            return []
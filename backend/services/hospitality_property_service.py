"""
Hospitality Property Service
Complete property management with rooms, amenities, and operations
"""

from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import logging

from models.hospitality_property import HospitalityProperty
from models.room import Room
from models.room import RoomType
from schemas.hospitality_property import PropertyCreate, PropertyUpdate, PropertyResponse
from utils.calculators import calculate_occupancy, calculate_revenue, calculate_adr, calculate_revpar
from utils.validation import validate_email, validate_phone

logger = logging.getLogger(__name__)

class HospitalityPropertyService:
    """Hospitality property management service"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_property(self, property_id: str) -> Optional[HospitalityProperty]:
        """Get property by ID"""
        try:
            return self.db.query(HospitalityProperty).filter(
                HospitalityProperty.id == property_id
            ).first()
        except Exception as e:
            logger.error(f"Failed to get property {property_id}: {str(e)}")
            return None
    
    def get_properties_by_tenant(
        self, 
        tenant_id: str, 
        skip: int = 0, 
        limit: int = 100,
        is_active: Optional[bool] = None
    ) -> List[HospitalityProperty]:
        """Get properties by tenant ID"""
        try:
            query = self.db.query(HospitalityProperty).filter(
                HospitalityProperty.tenant_id == tenant_id
            )
            
            if is_active is not None:
                query = query.filter(HospitalityProperty.is_active == is_active)
            
            return query.offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Failed to get properties for tenant {tenant_id}: {str(e)}")
            return []
    
    def create_property(self, tenant_id: str, property_data: PropertyCreate) -> Optional[HospitalityProperty]:
        """Create new property"""
        try:
            # Validate contact information
            if property_data.contact_email and not validate_email(property_data.contact_email):
                raise ValueError("Invalid contact email format")
            
            if property_data.contact_phone and not validate_phone(property_data.contact_phone):
                raise ValueError("Invalid contact phone format")
            
            # Create property
            db_property = HospitalityProperty(
                tenant_id=tenant_id,
                property_name=property_data.property_name,
                property_type=property_data.property_type,
                description=property_data.description,
                address=property_data.address,
                contact_email=property_data.contact_email,
                contact_phone=property_data.contact_phone,
                website=property_data.website,
                star_rating=property_data.star_rating,
                total_rooms=property_data.total_rooms,
                check_in_time=property_data.check_in_time,
                check_out_time=property_data.check_out_time,
                amenities=property_data.amenities,
                policies=property_data.policies,
                is_active=property_data.is_active,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
            self.db.add(db_property)
            self.db.commit()
            self.db.refresh(db_property)
            
            logger.info(f"Property created successfully: {db_property.property_name}")
            return db_property
            
        except Exception as e:
            logger.error(f"Failed to create property: {str(e)}")
            self.db.rollback()
            raise
    
    def update_property(self, property_id: str, property_data: PropertyUpdate) -> Optional[HospitalityProperty]:
        """Update property information"""
        try:
            db_property = self.get_property(property_id)
            if not db_property:
                raise ValueError("Property not found")
            
            # Validate contact information if being updated
            if property_data.contact_email and not validate_email(property_data.contact_email):
                raise ValueError("Invalid contact email format")
            
            if property_data.contact_phone and not validate_phone(property_data.contact_phone):
                raise ValueError("Invalid contact phone format")
            
            # Update fields
            update_data = property_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                if hasattr(db_property, field):
                    setattr(db_property, field, value)
            
            db_property.updated_at = datetime.utcnow()
            
            self.db.commit()
            self.db.refresh(db_property)
            
            logger.info(f"Property updated successfully: {db_property.property_name}")
            return db_property
            
        except Exception as e:
            logger.error(f"Failed to update property: {str(e)}")
            self.db.rollback()
            raise
    
    def delete_property(self, property_id: str) -> bool:
        """Delete property (soft delete)"""
        try:
            db_property = self.get_property(property_id)
            if not db_property:
                return False
            
            # Soft delete - mark as inactive
            db_property.is_active = False
            db_property.updated_at = datetime.utcnow()
            
            self.db.commit()
            
            logger.info(f"Property deleted successfully: {db_property.property_name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to delete property: {str(e)}")
            self.db.rollback()
            return False
    
    def get_property_stats(self, property_id: str) -> Dict[str, Any]:
        """Get property statistics and metrics"""
        try:
            property = self.get_property(property_id)
            if not property:
                return {}
            
            # Get room statistics
            total_rooms = self.db.query(Room).filter(Room.property_id == property_id).count()
            occupied_rooms = self.db.query(Room).filter(
                Room.property_id == property_id,
                Room.status == 'occupied'
            ).count()
            out_of_order_rooms = self.db.query(Room).filter(
                Room.property_id == property_id,
                Room.status == 'out_of_order'
            ).count()
            
            # Calculate occupancy rate
            occupancy_rate = calculate_occupancy(total_rooms, occupied_rooms, out_of_order_rooms)
            
            # Get room type distribution
            room_types = self.db.query(RoomType).filter(RoomType.property_id == property_id).all()
            room_type_stats = {}
            for room_type in room_types:
                room_count = self.db.query(Room).filter(
                    Room.property_id == property_id,
                    Room.room_type_id == room_type.id
                ).count()
                room_type_stats[room_type.name] = room_count
            
            # Get recent bookings (last 30 days)
            thirty_days_ago = datetime.utcnow() - timedelta(days=30)
            recent_bookings = self.db.query(Room).filter(
                Room.property_id == property_id,
                Room.created_at >= thirty_days_ago
            ).count()
            
            return {
                "property_id": property_id,
                "property_name": property.property_name,
                "total_rooms": total_rooms,
                "occupied_rooms": occupied_rooms,
                "available_rooms": total_rooms - occupied_rooms - out_of_order_rooms,
                "out_of_order_rooms": out_of_order_rooms,
                "occupancy_rate": occupancy_rate,
                "room_type_distribution": room_type_stats,
                "recent_bookings": recent_bookings,
                "star_rating": property.star_rating,
                "is_active": property.is_active
            }
            
        except Exception as e:
            logger.error(f"Failed to get property stats: {str(e)}")
            return {}
    
    def search_properties(
        self, 
        query: str, 
        tenant_id: Optional[str] = None,
        property_type: Optional[str] = None,
        star_rating: Optional[int] = None,
        limit: int = 20
    ) -> List[HospitalityProperty]:
        """Search properties by name, description, or location"""
        try:
            db_query = self.db.query(HospitalityProperty)
            
            if tenant_id:
                db_query = db_query.filter(HospitalityProperty.tenant_id == tenant_id)
            
            if property_type:
                db_query = db_query.filter(HospitalityProperty.property_type == property_type)
            
            if star_rating:
                db_query = db_query.filter(HospitalityProperty.star_rating >= star_rating)
            
            # Search in name, description, and address
            search_filter = (
                HospitalityProperty.property_name.ilike(f"%{query}%") |
                HospitalityProperty.description.ilike(f"%{query}%") |
                HospitalityProperty.address.ilike(f"%{query}%")
            )
            
            return db_query.filter(search_filter).limit(limit).all()
            
        except Exception as e:
            logger.error(f"Failed to search properties: {str(e)}")
            return []
    
    def get_properties_by_location(
        self, 
        city: str, 
        country: str,
        tenant_id: Optional[str] = None,
        limit: int = 20
    ) -> List[HospitalityProperty]:
        """Get properties by location"""
        try:
            query = self.db.query(HospitalityProperty).filter(
                HospitalityProperty.address.ilike(f"%{city}%"),
                HospitalityProperty.address.ilike(f"%{country}%")
            )
            
            if tenant_id:
                query = query.filter(HospitalityProperty.tenant_id == tenant_id)
            
            return query.limit(limit).all()
            
        except Exception as e:
            logger.error(f"Failed to get properties by location: {str(e)}")
            return []
    
    def get_property_amenities(self, property_id: str) -> List[str]:
        """Get property amenities"""
        try:
            property = self.get_property(property_id)
            if not property or not property.amenities:
                return []
            
            return property.amenities
            
        except Exception as e:
            logger.error(f"Failed to get property amenities: {str(e)}")
            return []
    
    def update_property_amenities(self, property_id: str, amenities: List[str]) -> bool:
        """Update property amenities"""
        try:
            property = self.get_property(property_id)
            if not property:
                return False
            
            property.amenities = amenities
            property.updated_at = datetime.utcnow()
            
            self.db.commit()
            
            logger.info(f"Property amenities updated: {property.property_name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to update property amenities: {str(e)}")
            self.db.rollback()
            return False
    
    def get_property_policies(self, property_id: str) -> Dict[str, Any]:
        """Get property policies"""
        try:
            property = self.get_property(property_id)
            if not property or not property.policies:
                return {}
            
            return property.policies
            
        except Exception as e:
            logger.error(f"Failed to get property policies: {str(e)}")
            return {}
    
    def update_property_policies(self, property_id: str, policies: Dict[str, Any]) -> bool:
        """Update property policies"""
        try:
            property = self.get_property(property_id)
            if not property:
                return False
            
            property.policies = policies
            property.updated_at = datetime.utcnow()
            
            self.db.commit()
            
            logger.info(f"Property policies updated: {property.property_name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to update property policies: {str(e)}")
            self.db.rollback()
            return False
    
    def activate_property(self, property_id: str) -> bool:
        """Activate property"""
        try:
            property = self.get_property(property_id)
            if not property:
                return False
            
            property.is_active = True
            property.updated_at = datetime.utcnow()
            
            self.db.commit()
            
            logger.info(f"Property activated: {property.property_name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to activate property: {str(e)}")
            self.db.rollback()
            return False
    
    def deactivate_property(self, property_id: str) -> bool:
        """Deactivate property"""
        try:
            property = self.get_property(property_id)
            if not property:
                return False
            
            property.is_active = False
            property.updated_at = datetime.utcnow()
            
            self.db.commit()
            
            logger.info(f"Property deactivated: {property.property_name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to deactivate property: {str(e)}")
            self.db.rollback()
            return False
    
    def get_property_availability(
        self, 
        property_id: str, 
        start_date: datetime, 
        end_date: datetime
    ) -> Dict[str, Any]:
        """Get property availability for date range"""
        try:
            property = self.get_property(property_id)
            if not property:
                return {}
            
            # Get total rooms
            total_rooms = self.db.query(Room).filter(Room.property_id == property_id).count()
            
            # Get booked rooms for each day in range
            availability = {}
            current_date = start_date.date()
            end_date_only = end_date.date()
            
            while current_date <= end_date_only:
                # Count rooms booked on this date
                booked_rooms = self.db.query(Room).join(RoomType).filter(
                    Room.property_id == property_id,
                    Room.status.in_(['occupied', 'reserved']),
                    Room.check_in <= current_date,
                    Room.check_out > current_date
                ).count()
                
                available_rooms = total_rooms - booked_rooms
                
                availability[current_date.strftime('%Y-%m-%d')] = {
                    'total_rooms': total_rooms,
                    'booked_rooms': booked_rooms,
                    'available_rooms': available_rooms,
                    'occupancy_rate': (booked_rooms / total_rooms * 100) if total_rooms > 0 else 0
                }
                
                current_date += timedelta(days=1)
            
            return {
                'property_id': property_id,
                'property_name': property.property_name,
                'date_range': {
                    'start': start_date.strftime('%Y-%m-%d'),
                    'end': end_date.strftime('%Y-%m-%d')
                },
                'availability': availability
            }
            
        except Exception as e:
            logger.error(f"Failed to get property availability: {str(e)}")
            return {}
    
    def get_property_revenue(
        self, 
        property_id: str, 
        start_date: datetime, 
        end_date: datetime
    ) -> Dict[str, Any]:
        """Get property revenue for date range"""
        try:
            property = self.get_property(property_id)
            if not property:
                return {}
            
            # This would typically join with booking and payment tables
            # For now, return mock data structure
            return {
                'property_id': property_id,
                'property_name': property.property_name,
                'date_range': {
                    'start': start_date.strftime('%Y-%m-%d'),
                    'end': end_date.strftime('%Y-%m-%d')
                },
                'total_revenue': 0.0,
                'room_revenue': 0.0,
                'other_revenue': 0.0,
                'average_daily_rate': 0.0,
                'revenue_per_available_room': 0.0
            }
            
        except Exception as e:
            logger.error(f"Failed to get property revenue: {str(e)}")
            return {}
    
    def get_property_analytics(self, property_id: str, days: int = 30) -> Dict[str, Any]:
        """Get comprehensive property analytics"""
        try:
            property = self.get_property(property_id)
            if not property:
                return {}
            
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=days)
            
            # Get basic stats
            stats = self.get_property_stats(property_id)
            
            # Get availability data
            availability = self.get_property_availability(property_id, start_date, end_date)
            
            # Get revenue data
            revenue = self.get_property_revenue(property_id, start_date, end_date)
            
            return {
                'property_id': property_id,
                'property_name': property.property_name,
                'period': {
                    'start': start_date.strftime('%Y-%m-%d'),
                    'end': end_date.strftime('%Y-%m-%d'),
                    'days': days
                },
                'stats': stats,
                'availability': availability,
                'revenue': revenue,
                'generated_at': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Failed to get property analytics: {str(e)}")
            return {}
    
    async def get_availability_calendar(self, property_id: str, start_date: datetime, end_date: datetime) -> Dict[str, Any]:
        """Get property availability calendar for public API"""
        try:
            total_rooms = self.db.query(Room).filter(Room.property_id == property_id).count()
            availability = {}
            
            current_date = start_date
            while current_date <= end_date:
                next_date = current_date + timedelta(days=1)
                
                # Count bookings for this date
                booked_rooms = self.db.query(Room).filter(
                    Room.property_id == property_id,
                    Room.status.in_(['occupied', 'reserved']),
                    Room.check_in < next_date,
                    Room.check_out > current_date
                ).count()
                
                date_str = current_date.strftime('%Y-%m-%d')
                availability[date_str] = {
                    'total_rooms': total_rooms,
                    'booked_rooms': booked_rooms,
                    'available_rooms': total_rooms - booked_rooms,
                    'occupancy_rate': round((booked_rooms / total_rooms * 100), 2) if total_rooms > 0 else 0
                }
                
                current_date = next_date
            
            return availability
            
        except Exception as e:
            logger.error(f"Failed to get availability calendar: {str(e)}")
            return {}
    
    async def _generate_property_code(self, property_name: str) -> str:
        """Generate unique property code from name"""
        base_code = ''.join([word[0].upper() for word in property_name.split()])[:4]
        counter = 1
        
        while True:
            code = f"{base_code}{counter:02d}"
            existing = self.db.query(HospitalityProperty).filter(
                HospitalityProperty.property_code == code
            ).first()
            
            if not existing:
                return code
            counter += 1
    
    async def _create_default_room_types(self, property_id: str):
        """Create default room types for new property"""
        default_room_types = [
            {
                "name": "Standard Room",
                "description": "Comfortable room with essential amenities",
                "base_occupancy": 2,
                "max_occupancy": 3,
                "base_price": 150.00,
                "amenities": ["wifi", "tv", "air-conditioning", "work-desk"]
            },
            {
                "name": "Deluxe Room",
                "description": "Spacious room with enhanced amenities", 
                "base_occupancy": 2,
                "max_occupancy": 4,
                "base_price": 200.00,
                "amenities": ["wifi", "tv", "air-conditioning", "work-desk", "minibar", "premium-toiletries"]
            }
        ]
        
        for room_type_data in default_room_types:
            room = Room(
                property_id=property_id,
                **room_type_data
            )
            self.db.add(room)
        
        self.db.commit()
    
    async def _calculate_adr(self, property_id: str) -> float:
        """Calculate Average Daily Rate"""
        from sqlalchemy import func
        result = self.db.query(func.avg(Room.base_price)).filter(
            Room.property_id == property_id,
            Room.created_at >= datetime.utcnow() - timedelta(days=30)
        ).scalar()
        
        return round(float(result or 0), 2)
    
    async def _calculate_revpar(self, property_id: str) -> float:
        """Calculate Revenue Per Available Room"""
        from sqlalchemy import func
        total_rooms = self.db.query(Room).filter(Room.property_id == property_id).count()
        total_revenue = self.db.query(func.sum(Room.base_price)).filter(
            Room.property_id == property_id,
            Room.created_at >= datetime.utcnow() - timedelta(days=30)
        ).scalar() or 0
        
        return round(float(total_revenue) / total_rooms if total_rooms > 0 else 0, 2)
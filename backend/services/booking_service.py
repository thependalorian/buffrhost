"""
Booking Service
Complete booking engine with availability, pricing, and reservation management
"""

from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import logging

from models.booking import Booking
from models.room import Room
from models.room_type import RoomType
from schemas.booking import BookingCreate, BookingUpdate, BookingResponse
from utils.calculators import calculate_length_of_stay, calculate_adr
from utils.validation import validate_email, validate_phone

logger = logging.getLogger(__name__)

class BookingService:
    """Booking management service with availability and pricing"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_booking(self, booking_id: str) -> Optional[Booking]:
        """Get booking by ID"""
        try:
            return self.db.query(Booking).filter(Booking.id == booking_id).first()
        except Exception as e:
            logger.error(f"Failed to get booking {booking_id}: {str(e)}")
            return None
    
    def get_bookings_by_property(
        self, 
        property_id: str, 
        skip: int = 0, 
        limit: int = 100,
        status: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[Booking]:
        """Get bookings by property with optional filters"""
        try:
            query = self.db.query(Booking).filter(Booking.property_id == property_id)
            
            if status:
                query = query.filter(Booking.status == status)
            
            if start_date:
                query = query.filter(Booking.check_in >= start_date)
            
            if end_date:
                query = query.filter(Booking.check_out <= end_date)
            
            return query.offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Failed to get bookings for property {property_id}: {str(e)}")
            return []
    
    def get_bookings_by_guest(
        self, 
        guest_email: str, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[Booking]:
        """Get bookings by guest email"""
        try:
            return self.db.query(Booking).filter(
                Booking.guest_email == guest_email
            ).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Failed to get bookings for guest {guest_email}: {str(e)}")
            return []
    
    def create_booking(self, booking_data: BookingCreate) -> Optional[Booking]:
        """Create new booking"""
        try:
            # Validate guest information
            if not validate_email(booking_data.guest_email):
                raise ValueError("Invalid guest email format")
            
            if booking_data.guest_phone and not validate_phone(booking_data.guest_phone):
                raise ValueError("Invalid guest phone format")
            
            # Check room availability
            if not self._is_room_available(
                booking_data.room_id, 
                booking_data.check_in, 
                booking_data.check_out
            ):
                raise ValueError("Room not available for selected dates")
            
            # Calculate booking details
            length_of_stay = calculate_length_of_stay(booking_data.check_in, booking_data.check_out)
            total_amount = booking_data.room_rate * length_of_stay
            
            # Create booking
            db_booking = Booking(
                property_id=booking_data.property_id,
                room_id=booking_data.room_id,
                guest_name=booking_data.guest_name,
                guest_email=booking_data.guest_email,
                guest_phone=booking_data.guest_phone,
                check_in=booking_data.check_in,
                check_out=booking_data.check_out,
                adults=booking_data.adults,
                children=booking_data.children,
                room_rate=booking_data.room_rate,
                total_amount=total_amount,
                status=booking_data.status or "confirmed",
                special_requests=booking_data.special_requests,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
            self.db.add(db_booking)
            
            # Update room status
            room = self.db.query(Room).filter(Room.id == booking_data.room_id).first()
            if room:
                room.status = "occupied"
                room.check_in = booking_data.check_in
                room.check_out = booking_data.check_out
                room.guest_name = booking_data.guest_name
                room.guest_contact = booking_data.guest_email
            
            self.db.commit()
            self.db.refresh(db_booking)
            
            logger.info(f"Booking created successfully: {db_booking.id}")
            return db_booking
            
        except Exception as e:
            logger.error(f"Failed to create booking: {str(e)}")
            self.db.rollback()
            raise
    
    def update_booking(self, booking_id: str, booking_data: BookingUpdate) -> Optional[Booking]:
        """Update booking information"""
        try:
            db_booking = self.get_booking(booking_id)
            if not db_booking:
                raise ValueError("Booking not found")
            
            # Validate guest information if being updated
            if booking_data.guest_email and not validate_email(booking_data.guest_email):
                raise ValueError("Invalid guest email format")
            
            if booking_data.guest_phone and not validate_phone(booking_data.guest_phone):
                raise ValueError("Invalid guest phone format")
            
            # Check room availability if dates are being changed
            if booking_data.check_in or booking_data.check_out:
                check_in = booking_data.check_in or db_booking.check_in
                check_out = booking_data.check_out or db_booking.check_out
                
                if not self._is_room_available(
                    db_booking.room_id, 
                    check_in, 
                    check_out, 
                    exclude_booking_id=booking_id
                ):
                    raise ValueError("Room not available for selected dates")
            
            # Update fields
            update_data = booking_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                if hasattr(db_booking, field):
                    setattr(db_booking, field, value)
            
            # Recalculate total amount if room rate or dates changed
            if booking_data.room_rate or booking_data.check_in or booking_data.check_out:
                length_of_stay = calculate_length_of_stay(db_booking.check_in, db_booking.check_out)
                db_booking.total_amount = db_booking.room_rate * length_of_stay
            
            db_booking.updated_at = datetime.utcnow()
            
            self.db.commit()
            self.db.refresh(db_booking)
            
            logger.info(f"Booking updated successfully: {db_booking.id}")
            return db_booking
            
        except Exception as e:
            logger.error(f"Failed to update booking: {str(e)}")
            self.db.rollback()
            raise
    
    def cancel_booking(self, booking_id: str, reason: Optional[str] = None) -> bool:
        """Cancel booking"""
        try:
            db_booking = self.get_booking(booking_id)
            if not db_booking:
                return False
            
            # Update booking status
            db_booking.status = "cancelled"
            db_booking.cancellation_reason = reason
            db_booking.cancelled_at = datetime.utcnow()
            db_booking.updated_at = datetime.utcnow()
            
            # Free up the room
            room = self.db.query(Room).filter(Room.id == db_booking.room_id).first()
            if room:
                room.status = "available"
                room.check_in = None
                room.check_out = None
                room.guest_name = None
                room.guest_contact = None
            
            self.db.commit()
            
            logger.info(f"Booking cancelled successfully: {db_booking.id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to cancel booking: {str(e)}")
            self.db.rollback()
            return False
    
    def check_in_booking(self, booking_id: str) -> bool:
        """Check in booking"""
        try:
            db_booking = self.get_booking(booking_id)
            if not db_booking:
                return False
            
            if db_booking.status != "confirmed":
                raise ValueError("Only confirmed bookings can be checked in")
            
            db_booking.status = "checked_in"
            db_booking.checked_in_at = datetime.utcnow()
            db_booking.updated_at = datetime.utcnow()
            
            self.db.commit()
            
            logger.info(f"Booking checked in successfully: {db_booking.id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to check in booking: {str(e)}")
            self.db.rollback()
            return False
    
    def check_out_booking(self, booking_id: str) -> bool:
        """Check out booking"""
        try:
            db_booking = self.get_booking(booking_id)
            if not db_booking:
                return False
            
            if db_booking.status != "checked_in":
                raise ValueError("Only checked-in bookings can be checked out")
            
            db_booking.status = "checked_out"
            db_booking.checked_out_at = datetime.utcnow()
            db_booking.updated_at = datetime.utcnow()
            
            # Free up the room
            room = self.db.query(Room).filter(Room.id == db_booking.room_id).first()
            if room:
                room.status = "available"
                room.check_in = None
                room.check_out = None
                room.guest_name = None
                room.guest_contact = None
            
            self.db.commit()
            
            logger.info(f"Booking checked out successfully: {db_booking.id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to check out booking: {str(e)}")
            self.db.rollback()
            return False
    
    def get_availability(
        self, 
        property_id: str, 
        start_date: datetime, 
        end_date: datetime,
        room_type_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get room availability for date range"""
        try:
            # Get total rooms
            query = self.db.query(Room).filter(Room.property_id == property_id)
            if room_type_id:
                query = query.filter(Room.room_type_id == room_type_id)
            
            total_rooms = query.count()
            
            # Calculate availability for each day
            availability = {}
            current_date = start_date.date()
            end_date_only = end_date.date()
            
            while current_date <= end_date_only:
                # Count rooms booked on this date
                booked_rooms = self.db.query(Booking).join(Room).filter(
                    Room.property_id == property_id,
                    Booking.status.in_(['confirmed', 'checked_in']),
                    Booking.check_in <= current_date,
                    Booking.check_out > current_date
                )
                
                if room_type_id:
                    booked_rooms = booked_rooms.filter(Room.room_type_id == room_type_id)
                
                booked_count = booked_rooms.count()
                available_rooms = total_rooms - booked_count
                
                availability[current_date.strftime('%Y-%m-%d')] = {
                    'total_rooms': total_rooms,
                    'booked_rooms': booked_count,
                    'available_rooms': available_rooms,
                    'occupancy_rate': (booked_count / total_rooms * 100) if total_rooms > 0 else 0
                }
                
                current_date += timedelta(days=1)
            
            return {
                'property_id': property_id,
                'room_type_id': room_type_id,
                'date_range': {
                    'start': start_date.strftime('%Y-%m-%d'),
                    'end': end_date.strftime('%Y-%m-%d')
                },
                'availability': availability
            }
            
        except Exception as e:
            logger.error(f"Failed to get availability: {str(e)}")
            return {}
    
    def search_available_rooms(
        self, 
        property_id: str, 
        check_in: datetime, 
        check_out: datetime,
        adults: int = 1,
        children: int = 0,
        room_type_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Search for available rooms"""
        try:
            # Get room types that can accommodate the guests
            query = self.db.query(RoomType).filter(RoomType.property_id == property_id)
            if room_type_id:
                query = query.filter(RoomType.id == room_type_id)
            
            room_types = query.filter(
                RoomType.max_occupancy >= (adults + children)
            ).all()
            
            available_rooms = []
            
            for room_type in room_types:
                # Get available rooms of this type
                available_room_query = self.db.query(Room).filter(
                    Room.property_id == property_id,
                    Room.room_type_id == room_type.id,
                    Room.status == "available"
                )
                
                # Check for overlapping bookings
                overlapping_bookings = self.db.query(Booking).join(Room).filter(
                    Room.property_id == property_id,
                    Room.room_type_id == room_type.id,
                    Booking.status.in_(['confirmed', 'checked_in']),
                    Booking.check_in < check_out,
                    Booking.check_out > check_in
                ).count()
                
                available_count = available_room_query.count() - overlapping_bookings
                
                if available_count > 0:
                    length_of_stay = calculate_length_of_stay(check_in, check_out)
                    total_price = room_type.base_price * length_of_stay
                    
                    available_rooms.append({
                        'room_type_id': room_type.id,
                        'room_type_name': room_type.name,
                        'description': room_type.description,
                        'base_price': room_type.base_price,
                        'total_price': total_price,
                        'max_occupancy': room_type.max_occupancy,
                        'room_size': room_type.room_size,
                        'bed_type': room_type.bed_type,
                        'amenities': room_type.amenities or [],
                        'available_count': available_count,
                        'length_of_stay': length_of_stay
                    })
            
            return available_rooms
            
        except Exception as e:
            logger.error(f"Failed to search available rooms: {str(e)}")
            return []
    
    def get_booking_stats(self, property_id: str, days: int = 30) -> Dict[str, Any]:
        """Get booking statistics for property"""
        try:
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=days)
            
            # Get total bookings
            total_bookings = self.db.query(Booking).filter(
                Booking.property_id == property_id,
                Booking.created_at >= start_date
            ).count()
            
            # Get bookings by status
            status_counts = {}
            for status in ['confirmed', 'checked_in', 'checked_out', 'cancelled']:
                count = self.db.query(Booking).filter(
                    Booking.property_id == property_id,
                    Booking.status == status,
                    Booking.created_at >= start_date
                ).count()
                status_counts[status] = count
            
            # Get total revenue
            total_revenue = self.db.query(Booking).filter(
                Booking.property_id == property_id,
                Booking.status.in_(['confirmed', 'checked_in', 'checked_out']),
                Booking.created_at >= start_date
            ).with_entities(Booking.total_amount).all()
            
            total_revenue = sum(booking.total_amount for booking in total_revenue if booking.total_amount)
            
            # Get average booking value
            avg_booking_value = total_revenue / total_bookings if total_bookings > 0 else 0
            
            # Get cancellation rate
            cancellation_rate = (status_counts['cancelled'] / total_bookings * 100) if total_bookings > 0 else 0
            
            return {
                'property_id': property_id,
                'period_days': days,
                'total_bookings': total_bookings,
                'status_breakdown': status_counts,
                'total_revenue': total_revenue,
                'average_booking_value': avg_booking_value,
                'cancellation_rate': cancellation_rate,
                'generated_at': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Failed to get booking stats: {str(e)}")
            return {}
    
    def _is_room_available(
        self, 
        room_id: str, 
        check_in: datetime, 
        check_out: datetime,
        exclude_booking_id: Optional[str] = None
    ) -> bool:
        """Check if room is available for given dates"""
        try:
            # Check room status
            room = self.db.query(Room).filter(Room.id == room_id).first()
            if not room or room.status != "available":
                return False
            
            # Check for overlapping bookings
            query = self.db.query(Booking).filter(
                Booking.room_id == room_id,
                Booking.status.in_(['confirmed', 'checked_in']),
                Booking.check_in < check_out,
                Booking.check_out > check_in
            )
            
            if exclude_booking_id:
                query = query.filter(Booking.id != exclude_booking_id)
            
            overlapping_booking = query.first()
            return overlapping_booking is None
            
        except Exception as e:
            logger.error(f"Failed to check room availability: {str(e)}")
            return False

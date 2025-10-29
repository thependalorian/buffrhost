"""
Availability Service for Buffr Host platform.
Phase 1: Core Availability Engine
"""
from datetime import date, datetime, time, timedelta
from typing import Any, Dict, List, Optional, Tuple
from decimal import Decimal

from sqlalchemy import and_, or_, select, func, text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.inventory import InventoryItem
from models.services import SpaService, ServiceBooking
from models.hospitality_property import HospitalityProperty
from models.room import Room, RoomType
from models.restaurant import RestaurantTable


class AvailabilityService:
    """Core availability checking service for all property types."""

    def __init__(self, db: AsyncSession):
        self.db = db

    # =============================================================================
    # INVENTORY AVAILABILITY
    # =============================================================================

    async def check_inventory_availability(
        self, 
        property_id: int, 
        items: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Check real-time inventory availability for order items."""
        results = {
            "available": True,
            "unavailable_items": [],
            "low_stock_items": [],
            "total_available": 0,
            "total_unavailable": 0
        }

        for item in items:
            item_id = item.get("inventory_item_id") or item.get("menu_item_id")
            required_quantity = item.get("quantity", 1)
            
            if not item_id:
                continue

            # Check inventory availability
            availability = await self.get_inventory_item_availability(property_id, item_id)
            
            if not availability:
                results["unavailable_items"].append({
                    "item_id": item_id,
                    "item_name": item.get("name", "Unknown"),
                    "required_quantity": required_quantity,
                    "reason": "Item not found in inventory"
                })
                results["available"] = False
                results["total_unavailable"] += required_quantity
                continue

            if availability["available_stock"] < required_quantity:
                results["unavailable_items"].append({
                    "item_id": item_id,
                    "item_name": availability["item_name"],
                    "required_quantity": required_quantity,
                    "available_stock": availability["available_stock"],
                    "reason": "Insufficient stock"
                })
                results["available"] = False
                results["total_unavailable"] += required_quantity
            else:
                results["total_available"] += required_quantity

            if availability["is_low_stock"]:
                results["low_stock_items"].append({
                    "item_id": item_id,
                    "item_name": availability["item_name"],
                    "available_stock": availability["available_stock"],
                    "minimum_stock": availability["minimum_stock"]
                })

        return results

    async def get_inventory_item_availability(
        self, 
        property_id: int, 
        item_id: int
    ) -> Optional[Dict[str, Any]]:
        """Get real-time availability for a specific inventory item."""
        query = text("""
            SELECT 
                ia.id,
                ii.item_name,
                ia.current_stock,
                ia.reserved_stock,
                ia.available_stock,
                ia.minimum_stock,
                ia.is_low_stock,
                ia.is_out_of_stock,
                ia.last_updated
            FROM inventory_availability ia
            JOIN inventory_items ii ON ia.inventory_item_id = ii.id
            WHERE ia.property_id = :property_id 
            AND ia.inventory_item_id = :item_id
        """)
        
        result = await self.db.execute(query, {
            "property_id": property_id,
            "item_id": item_id
        })
        
        row = result.fetchone()
        if not row:
            return None

        return {
            "id": row.id,
            "item_name": row.item_name,
            "current_stock": float(row.current_stock),
            "reserved_stock": float(row.reserved_stock),
            "available_stock": float(row.available_stock),
            "minimum_stock": float(row.minimum_stock),
            "is_low_stock": row.is_low_stock,
            "is_out_of_stock": row.is_out_of_stock,
            "last_updated": row.last_updated
        }

    async def reserve_inventory_stock(
        self, 
        property_id: int, 
        item_id: int, 
        quantity: Decimal,
        reference_id: str,
        reference_type: str = "order"
    ) -> bool:
        """Reserve inventory stock for an order."""
        # Check if enough stock is available
        availability = await self.get_inventory_item_availability(property_id, item_id)
        if not availability or availability["available_stock"] < float(quantity):
            return False

        # Create reservation movement
        movement_query = text("""
            INSERT INTO inventory_movements 
            (property_id, inventory_item_id, movement_type, quantity, reason, reference_id, reference_type)
            VALUES (:property_id, :item_id, 'reservation', :quantity, :reason, :reference_id, :reference_type)
        """)
        
        await self.db.execute(movement_query, {
            "property_id": property_id,
            "item_id": item_id,
            "quantity": quantity,
            "reason": f"Reserved for {reference_type}",
            "reference_id": reference_id,
            "reference_type": reference_type
        })
        
        await self.db.commit()
        return True

    async def release_inventory_stock(
        self, 
        property_id: int, 
        item_id: int, 
        quantity: Decimal,
        reference_id: str
    ) -> bool:
        """Release reserved inventory stock."""
        movement_query = text("""
            INSERT INTO inventory_movements 
            (property_id, inventory_item_id, movement_type, quantity, reason, reference_id, reference_type)
            VALUES (:property_id, :item_id, 'release', :quantity, :reason, :reference_id, 'order')
        """)
        
        await self.db.execute(movement_query, {
            "property_id": property_id,
            "item_id": item_id,
            "quantity": quantity,
            "reason": f"Released from order {reference_id}",
            "reference_id": reference_id
        })
        
        await self.db.commit()
        return True

    # =============================================================================
    # SERVICE AVAILABILITY
    # =============================================================================

    async def check_service_availability(
        self, 
        property_id: int, 
        service_type: str, 
        service_id: int,
        requested_date: date,
        start_time: time,
        end_time: time
    ) -> Dict[str, Any]:
        """Check service availability for a specific time slot."""
        query = text("""
            SELECT 
                sa.id,
                sa.max_capacity,
                sa.current_bookings,
                sa.is_available,
                sa.price
            FROM service_availability sa
            WHERE sa.property_id = :property_id
            AND sa.service_id = :service_id
            AND sa.service_type = :service_type
            AND sa.available_date = :requested_date
            AND sa.start_time <= :start_time
            AND sa.end_time >= :end_time
        """)
        
        result = await self.db.execute(query, {
            "property_id": property_id,
            "service_id": service_id,
            "service_type": service_type,
            "requested_date": requested_date,
            "start_time": start_time,
            "end_time": end_time
        })
        
        row = result.fetchone()
        if not row:
            return {
                "available": False,
                "reason": "Service not available for this time slot"
            }

        return {
            "available": row.is_available,
            "max_capacity": row.max_capacity,
            "current_bookings": row.current_bookings,
            "remaining_capacity": row.max_capacity - row.current_bookings,
            "price": float(row.price) if row.price else 0.0,
            "reason": "Fully booked" if not row.is_available else None
        }

    async def get_service_availability_calendar(
        self, 
        property_id: int, 
        service_type: str,
        start_date: date,
        end_date: date
    ) -> List[Dict[str, Any]]:
        """Get service availability calendar for a date range."""
        query = text("""
            SELECT 
                sa.id,
                sa.service_id,
                sa.available_date,
                sa.start_time,
                sa.end_time,
                sa.max_capacity,
                sa.current_bookings,
                sa.is_available,
                sa.price
            FROM service_availability sa
            WHERE sa.property_id = :property_id
            AND sa.service_type = :service_type
            AND sa.available_date BETWEEN :start_date AND :end_date
            ORDER BY sa.available_date, sa.start_time
        """)
        
        result = await self.db.execute(query, {
            "property_id": property_id,
            "service_type": service_type,
            "start_date": start_date,
            "end_date": end_date
        })
        
        return [
            {
                "id": row.id,
                "service_id": row.service_id,
                "available_date": row.available_date,
                "start_time": row.start_time,
                "end_time": row.end_time,
                "max_capacity": row.max_capacity,
                "current_bookings": row.current_bookings,
                "is_available": row.is_available,
                "remaining_capacity": row.max_capacity - row.current_bookings,
                "price": float(row.price) if row.price else 0.0
            }
            for row in result.fetchall()
        ]

    # =============================================================================
    # TABLE AVAILABILITY
    # =============================================================================

    async def check_table_availability(
        self, 
        property_id: int, 
        party_size: int,
        requested_date: date,
        start_time: time,
        end_time: time
    ) -> List[Dict[str, Any]]:
        """Check table availability for a specific time and party size."""
        query = text("""
            SELECT 
                rt.id as table_id,
                rt.table_number,
                rt.capacity,
                rt.location,
                ta.is_available,
                ta.reservation_id
            FROM restaurant_tables rt
            LEFT JOIN table_availability ta ON rt.id = ta.table_id
            WHERE rt.property_id = :property_id
            AND rt.capacity >= :party_size
            AND rt.is_active = true
            AND (ta.available_date = :requested_date OR ta.available_date IS NULL)
            AND (ta.start_time <= :start_time OR ta.start_time IS NULL)
            AND (ta.end_time >= :end_time OR ta.end_time IS NULL)
            AND (ta.is_available = true OR ta.is_available IS NULL)
            ORDER BY rt.capacity ASC
        """)
        
        result = await self.db.execute(query, {
            "property_id": property_id,
            "party_size": party_size,
            "requested_date": requested_date,
            "start_time": start_time,
            "end_time": end_time
        })
        
        return [
            {
                "table_id": row.table_id,
                "table_number": row.table_number,
                "capacity": row.capacity,
                "location": row.location,
                "is_available": row.is_available or True,
                "reservation_id": row.reservation_id
            }
            for row in result.fetchall()
        ]

    async def reserve_table(
        self, 
        table_id: int, 
        guest_id: int,
        reservation_date: date,
        start_time: time,
        end_time: time,
        party_size: int
    ) -> bool:
        """Reserve a table for a specific time slot."""
        # Check if table is available
        query = text("""
            SELECT is_available 
            FROM table_availability 
            WHERE table_id = :table_id 
            AND available_date = :reservation_date
            AND start_time <= :start_time
            AND end_time >= :end_time
        """)
        
        result = await self.db.execute(query, {
            "table_id": table_id,
            "reservation_date": reservation_date,
            "start_time": start_time,
            "end_time": end_time
        })
        
        row = result.fetchone()
        if row and not row.is_available:
            return False

        # Create table reservation
        reservation_query = text("""
            INSERT INTO table_reservations 
            (guest_id, table_id, reservation_date, reservation_time, party_size, status)
            VALUES (:guest_id, :table_id, :reservation_date, :start_time, :party_size, 'confirmed')
            RETURNING id
        """)
        
        result = await self.db.execute(reservation_query, {
            "guest_id": guest_id,
            "table_id": table_id,
            "reservation_date": reservation_date,
            "start_time": start_time,
            "party_size": party_size
        })
        
        reservation_id = result.fetchone().id

        # Update table availability
        update_query = text("""
            INSERT INTO table_availability 
            (property_id, table_id, available_date, start_time, end_time, is_available, reservation_id, party_size)
            VALUES (
                (SELECT property_id FROM restaurant_tables WHERE id = :table_id),
                :table_id, 
                :reservation_date, 
                :start_time, 
                :end_time, 
                false, 
                :reservation_id, 
                :party_size
            )
            ON CONFLICT (table_id, available_date, start_time)
            DO UPDATE SET 
                is_available = false,
                reservation_id = :reservation_id,
                party_size = :party_size
        """)
        
        await self.db.execute(update_query, {
            "table_id": table_id,
            "reservation_date": reservation_date,
            "start_time": start_time,
            "end_time": end_time,
            "reservation_id": reservation_id,
            "party_size": party_size
        })
        
        await self.db.commit()
        return True

    # =============================================================================
    # ROOM AVAILABILITY
    # =============================================================================

    async def check_room_availability(
        self, 
        property_id: int, 
        check_in_date: date,
        check_out_date: date,
        room_type: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Check room availability for a date range."""
        query = text("""
            SELECT 
                r.id as room_id,
                r.room_number,
                rt.type_name,
                rt.capacity,
                rt.base_price,
                rae.is_available,
                rae.room_status
            FROM rooms r
            JOIN room_types rt ON r.room_type_id = rt.id
            LEFT JOIN room_availability_enhanced rae ON r.id = rae.room_id
            WHERE r.property_id = :property_id
            AND r.is_active = true
            AND (rae.available_date BETWEEN :check_in_date AND :check_out_date OR rae.available_date IS NULL)
            AND (rae.is_available = true OR rae.is_available IS NULL)
            AND (rt.type_name = :room_type OR :room_type IS NULL)
            ORDER BY rt.base_price ASC
        """)
        
        result = await self.db.execute(query, {
            "property_id": property_id,
            "check_in_date": check_in_date,
            "check_out_date": check_out_date,
            "room_type": room_type
        })
        
        return [
            {
                "room_id": row.room_id,
                "room_number": row.room_number,
                "room_type": row.type_name,
                "capacity": row.capacity,
                "base_price": float(row.base_price),
                "is_available": row.is_available or True,
                "room_status": row.room_status or "available"
            }
            for row in result.fetchall()
        ]

    async def reserve_room(
        self, 
        room_id: int, 
        guest_id: int,
        check_in_date: date,
        check_out_date: date
    ) -> bool:
        """Reserve a room for a date range."""
        # Check if room is available for the entire period
        query = text("""
            SELECT COUNT(*) as unavailable_days
            FROM room_availability_enhanced 
            WHERE room_id = :room_id 
            AND available_date BETWEEN :check_in_date AND :check_out_date
            AND is_available = false
        """)
        
        result = await self.db.execute(query, {
            "room_id": room_id,
            "check_in_date": check_in_date,
            "check_out_date": check_out_date
        })
        
        unavailable_days = result.fetchone().unavailable_days
        if unavailable_days > 0:
            return False

        # Create room booking
        booking_query = text("""
            INSERT INTO bookings 
            (property_id, customer_id, room_id, check_in_date, check_out_date, status, total_amount)
            VALUES (
                (SELECT property_id FROM rooms WHERE id = :room_id),
                :guest_id, 
                :room_id, 
                :check_in_date, 
                :check_out_date, 
                'confirmed',
                (SELECT base_price FROM room_types rt JOIN rooms r ON rt.id = r.room_type_id WHERE r.id = :room_id) * 
                (DATE_PART('day', :check_out_date - :check_in_date))
            )
            RETURNING id
        """)
        
        result = await self.db.execute(booking_query, {
            "room_id": room_id,
            "guest_id": guest_id,
            "check_in_date": check_in_date,
            "check_out_date": check_out_date
        })
        
        booking_id = result.fetchone().id

        # Update room availability for each day
        for single_date in self._date_range(check_in_date, check_out_date):
            update_query = text("""
                INSERT INTO room_availability_enhanced 
                (property_id, room_id, available_date, is_available, booking_id, check_in_date, check_out_date)
                VALUES (
                    (SELECT property_id FROM rooms WHERE id = :room_id),
                    :room_id, 
                    :single_date, 
                    false, 
                    :booking_id,
                    :check_in_date,
                    :check_out_date
                )
                ON CONFLICT (room_id, available_date)
                DO UPDATE SET 
                    is_available = false,
                    booking_id = :booking_id,
                    check_in_date = :check_in_date,
                    check_out_date = :check_out_date
            """)
            
            await self.db.execute(update_query, {
                "room_id": room_id,
                "single_date": single_date,
                "booking_id": booking_id,
                "check_in_date": check_in_date,
                "check_out_date": check_out_date
            })
        
        await self.db.commit()
        return True

    # =============================================================================
    # UTILITY METHODS
    # =============================================================================

    def _date_range(self, start_date: date, end_date: date):
        """Generate date range between start and end dates."""
        current = start_date
        while current < end_date:
            yield current
            current += timedelta(days=1)

    async def get_availability_summary(self, property_id: int) -> Dict[str, Any]:
        """Get comprehensive availability summary for a property."""
        # Get inventory summary
        inventory_query = text("""
            SELECT 
                COUNT(*) as total_items,
                COUNT(CASE WHEN is_low_stock THEN 1 END) as low_stock_items,
                COUNT(CASE WHEN is_out_of_stock THEN 1 END) as out_of_stock_items
            FROM inventory_availability 
            WHERE property_id = :property_id
        """)
        
        inventory_result = await self.db.execute(inventory_query, {"property_id": property_id})
        inventory_summary = inventory_result.fetchone()

        # Get table summary
        table_query = text("""
            SELECT 
                COUNT(*) as total_tables,
                COUNT(CASE WHEN is_available THEN 1 END) as available_tables
            FROM table_availability ta
            JOIN restaurant_tables rt ON ta.table_id = rt.id
            WHERE rt.property_id = :property_id
            AND ta.available_date = CURRENT_DATE
        """)
        
        table_result = await self.db.execute(table_query, {"property_id": property_id})
        table_summary = table_result.fetchone()

        # Get room summary
        room_query = text("""
            SELECT 
                COUNT(*) as total_rooms,
                COUNT(CASE WHEN is_available THEN 1 END) as available_rooms
            FROM room_availability_enhanced rae
            JOIN rooms r ON rae.room_id = r.id
            WHERE r.property_id = :property_id
            AND rae.available_date = CURRENT_DATE
        """)
        
        room_result = await self.db.execute(room_query, {"property_id": property_id})
        room_summary = room_result.fetchone()

        return {
            "inventory": {
                "total_items": inventory_summary.total_items,
                "low_stock_items": inventory_summary.low_stock_items,
                "out_of_stock_items": inventory_summary.out_of_stock_items
            },
            "tables": {
                "total_tables": table_summary.total_tables,
                "available_tables": table_summary.available_tables
            },
            "rooms": {
                "total_rooms": room_summary.total_rooms,
                "available_rooms": room_summary.available_rooms
            }
        }
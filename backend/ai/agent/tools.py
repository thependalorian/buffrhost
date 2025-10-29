"""
Buffr Host Agent Tools
Hospitality-specific tools for booking, ordering, calculations, and service management
"""

import asyncio
import uuid
from datetime import datetime, date, time
from typing import Dict, List, Optional, Any
from pydantic import BaseModel

from .models import (
    BookingRequest, BookingType, RestaurantOrder, ServiceRequest, ServiceType,
    BookingConfirmation, OrderConfirmation, ServiceConfirmation,
    CostCalculation, MenuItem, PropertyService, ToolResult
)


class BuffrAgentTools:
    """Collection of tools for Buffr Host agent"""
    
    def __init__(self, neon_client, tenant_id: str, property_id: int):
        self.neon_client = neon_client
        self.tenant_id = tenant_id
        self.property_id = property_id
    
    async def create_booking(self, booking_request: BookingRequest) -> ToolResult:
        """Create a booking for room, service, spa, tour, shuttle, etc"""
        try:
            booking_id = str(uuid.uuid4())
            confirmation_number = self._generate_confirmation_number(booking_request.booking_type)
            
            # Calculate cost based on booking type
            total_cost = await self._calculate_booking_cost(booking_request)
            
            # Insert booking into database
            await self.neon_client.query(
                """
                INSERT INTO bookings 
                (id, tenant_id, property_id, booking_type, guest_name, booking_date, 
                 booking_time, service_name, special_requests, party_size, total_cost, 
                 confirmation_number, status, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                """,
                [
                    booking_id, self.tenant_id, self.property_id,
                    booking_request.booking_type.value, booking_request.guest_name,
                    booking_request.date, booking_request.time,
                    booking_request.service_name, booking_request.special_requests,
                    booking_request.party_size, total_cost, confirmation_number,
                    "confirmed", datetime.now()
                ]
            )
            
            confirmation = BookingConfirmation(
                booking_id=booking_id,
                booking_type=booking_request.booking_type,
                guest_name=booking_request.guest_name,
                date=booking_request.date,
                time=booking_request.time,
                service_name=booking_request.service_name,
                total_cost=total_cost,
                confirmation_number=confirmation_number,
                special_requests=booking_request.special_requests,
                contact_info=booking_request.contact_info
            )
            
            return ToolResult(
                success=True,
                result=confirmation.dict(),
                execution_time=0.0
            )
            
        except Exception as e:
            return ToolResult(
                success=False,
                result={},
                error_message=f"Failed to create booking: {str(e)}"
            )
    
    async def place_restaurant_order(self, order: RestaurantOrder) -> ToolResult:
        """Place an order from the restaurant menu"""
        try:
            order_id = str(uuid.uuid4())
            
            # Calculate total cost
            total_cost = await self._calculate_order_total(order)
            
            # Estimate preparation time
            estimated_ready_time = await self._estimate_preparation_time(order)
            
            # Insert order into database
            await self.neon_client.query(
                """
                INSERT INTO restaurant_orders 
                (id, tenant_id, property_id, order_items, table_number, delivery_room,
                 special_instructions, total_cost, estimated_ready_time, status, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                """,
                [
                    order_id, self.tenant_id, self.property_id,
                    [item.dict() for item in order.items],
                    order.table_number, order.delivery_room,
                    order.special_instructions, total_cost, estimated_ready_time,
                    "confirmed", datetime.now()
                ]
            )
            
            confirmation = OrderConfirmation(
                order_id=order_id,
                items=order.items,
                table_number=order.table_number,
                delivery_room=order.delivery_room,
                total_cost=total_cost,
                estimated_ready_time=estimated_ready_time,
                special_instructions=order.special_instructions
            )
            
            return ToolResult(
                success=True,
                result=confirmation.dict(),
                execution_time=0.0
            )
            
        except Exception as e:
            return ToolResult(
                success=False,
                result={},
                error_message=f"Failed to place order: {str(e)}"
            )
    
    async def calculate_cost(self, items: List[Dict], apply_taxes: bool = True, 
                           apply_service_charge: bool = True) -> ToolResult:
        """Calculate total cost with taxes and fees"""
        try:
            calculation = CostCalculation(
                items=items,
                apply_taxes=apply_taxes,
                apply_service_charge=apply_service_charge
            )
            
            result = {
                "subtotal": calculation.subtotal,
                "tax_amount": calculation.tax_amount,
                "service_charge_amount": calculation.service_charge_amount,
                "total": calculation.total,
                "breakdown": {
                    "items": items,
                    "subtotal": calculation.subtotal,
                    "tax_rate": calculation.tax_rate if apply_taxes else 0.0,
                    "tax_amount": calculation.tax_amount,
                    "service_charge_rate": calculation.service_charge_rate if apply_service_charge else 0.0,
                    "service_charge_amount": calculation.service_charge_amount,
                    "total": calculation.total
                }
            }
            
            return ToolResult(
                success=True,
                result=result,
                execution_time=0.0
            )
            
        except Exception as e:
            return ToolResult(
                success=False,
                result={},
                error_message=f"Failed to calculate cost: {str(e)}"
            )
    
    async def check_availability(self, service_type: str, date: date, time: Optional[time] = None) -> ToolResult:
        """Check availability for a service or room"""
        try:
            # Query availability based on service type
            if service_type == "room":
                result = await self._check_room_availability(date)
            else:
                result = await self._check_service_availability(service_type, date, time)
            
            return ToolResult(
                success=True,
                result=result,
                execution_time=0.0
            )
            
        except Exception as e:
            return ToolResult(
                success=False,
                result={},
                error_message=f"Failed to check availability: {str(e)}"
            )
    
    async def get_service_info(self, service_type: str, service_name: Optional[str] = None) -> ToolResult:
        """Get information about available services"""
        try:
            if service_name:
                # Get specific service info
                result = await self.neon_client.query(
                    """
                    SELECT name, description, base_price, duration_minutes, capacity,
                           requires_booking, advance_booking_hours, operating_hours, metadata
                    FROM service_catalog 
                    WHERE property_id = $1 AND service_type = $2 AND name ILIKE $3 AND is_active = true
                    """,
                    [self.property_id, service_type, f"%{service_name}%"]
                )
            else:
                # Get all services of this type
                result = await self.neon_client.query(
                    """
                    SELECT name, description, base_price, duration_minutes, capacity,
                           requires_booking, advance_booking_hours, operating_hours, metadata
                    FROM service_catalog 
                    WHERE property_id = $1 AND service_type = $2 AND is_active = true
                    ORDER BY name
                    """,
                    [self.property_id, service_type]
                )
            
            services = []
            for row in result:
                services.append({
                    "name": row['name'],
                    "description": row['description'],
                    "base_price": float(row['base_price']),
                    "duration_minutes": row['duration_minutes'],
                    "capacity": row['capacity'],
                    "requires_booking": row['requires_booking'],
                    "advance_booking_hours": row['advance_booking_hours'],
                    "operating_hours": row['operating_hours'],
                    "metadata": row['metadata']
                })
            
            return ToolResult(
                success=True,
                result={"services": services, "count": len(services)},
                execution_time=0.0
            )
            
        except Exception as e:
            return ToolResult(
                success=False,
                result={},
                error_message=f"Failed to get service info: {str(e)}"
            )
    
    async def send_confirmation(self, confirmation_type: str, confirmation_data: Dict) -> ToolResult:
        """Send confirmation email/SMS for booking or order"""
        try:
            # Queue confirmation for sending
            await self.neon_client.query(
                """
                INSERT INTO email_queue 
                (tenant_id, property_id, email_type, recipient_email, recipient_name,
                 subject, content, metadata, status, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                """,
                [
                    self.tenant_id, self.property_id, confirmation_type,
                    confirmation_data.get('email', ''),
                    confirmation_data.get('name', ''),
                    confirmation_data.get('subject', ''),
                    confirmation_data.get('content', ''),
                    confirmation_data,
                    'pending', datetime.now()
                ]
            )
            
            return ToolResult(
                success=True,
                result={"message": "Confirmation queued for sending"},
                execution_time=0.0
            )
            
        except Exception as e:
            return ToolResult(
                success=False,
                result={},
                error_message=f"Failed to send confirmation: {str(e)}"
            )
    
    async def get_menu_items(self, category: Optional[str] = None) -> ToolResult:
        """Get restaurant menu items"""
        try:
            if category:
                result = await self.neon_client.query(
                    """
                    SELECT mi.id, mi.name, mi.description, mi.price, mi.category,
                           mi.dietary_info, mi.allergens, mi.preparation_time_minutes
                    FROM menu_items mi
                    JOIN service_catalog sc ON mi.service_id = sc.id
                    WHERE sc.property_id = $1 AND sc.service_type = 'restaurant' 
                    AND mi.category = $2 AND mi.is_available = true
                    ORDER BY mi.name
                    """,
                    [self.property_id, category]
                )
            else:
                result = await self.neon_client.query(
                    """
                    SELECT mi.id, mi.name, mi.description, mi.price, mi.category,
                           mi.dietary_info, mi.allergens, mi.preparation_time_minutes
                    FROM menu_items mi
                    JOIN service_catalog sc ON mi.service_id = sc.id
                    WHERE sc.property_id = $1 AND sc.service_type = 'restaurant' 
                    AND mi.is_available = true
                    ORDER BY mi.category, mi.name
                    """,
                    [self.property_id]
                )
            
            menu_items = []
            for row in result:
                menu_items.append({
                    "id": row['id'],
                    "name": row['name'],
                    "description": row['description'],
                    "price": float(row['price']),
                    "category": row['category'],
                    "dietary_info": row['dietary_info'],
                    "allergens": row['allergens'],
                    "preparation_time_minutes": row['preparation_time_minutes']
                })
            
            return ToolResult(
                success=True,
                result={"menu_items": menu_items, "count": len(menu_items)},
                execution_time=0.0
            )
            
        except Exception as e:
            return ToolResult(
                success=False,
                result={},
                error_message=f"Failed to get menu items: {str(e)}"
            )
    
    # Helper methods
    async def _calculate_booking_cost(self, booking_request: BookingRequest) -> float:
        """Calculate cost for a booking"""
        if booking_request.booking_type == BookingType.ROOM:
            # Get room rate
            result = await self.neon_client.query(
                """
                SELECT base_rate FROM rate_configuration 
                WHERE property_id = $1 AND is_active = true
                ORDER BY base_rate LIMIT 1
                """,
                [self.property_id]
            )
            return float(result[0]['base_rate']) if result else 0.0
        
        elif booking_request.booking_type in [BookingType.SPA, BookingType.TOUR, BookingType.SERVICE]:
            # Get service price
            if booking_request.service_name:
                result = await self.neon_client.query(
                    """
                    SELECT base_price FROM service_catalog 
                    WHERE property_id = $1 AND name ILIKE $2 AND is_active = true
                    """,
                    [self.property_id, f"%{booking_request.service_name}%"]
                )
                return float(result[0]['base_price']) if result else 0.0
        
        return 0.0
    
    async def _calculate_order_total(self, order: RestaurantOrder) -> float:
        """Calculate total for restaurant order"""
        subtotal = sum(item.total_price for item in order.items)
        tax = subtotal * 0.15  # 15% VAT
        service_charge = subtotal * 0.10  # 10% service charge
        return subtotal + tax + service_charge
    
    async def _estimate_preparation_time(self, order: RestaurantOrder) -> datetime:
        """Estimate when order will be ready"""
        # Get max preparation time from menu items
        max_prep_time = 0
        for item in order.items:
            result = await self.neon_client.query(
                """
                SELECT preparation_time_minutes FROM menu_items 
                WHERE id = $1
                """,
                [item.menu_item_id]
            )
            if result:
                prep_time = result[0]['preparation_time_minutes']
                max_prep_time = max(max_prep_time, prep_time)
        
        # Add buffer time
        total_minutes = max_prep_time + 15  # 15 minute buffer
        return datetime.now() + timedelta(minutes=total_minutes)
    
    async def _check_room_availability(self, date: date) -> Dict:
        """Check room availability for a date"""
        # This would check against existing bookings
        # For now, return mock availability
        return {
            "date": date.isoformat(),
            "available_rooms": 5,
            "total_rooms": 10,
            "room_types": [
                {"type": "Standard Room", "available": 3, "rate": 200.00},
                {"type": "Deluxe Suite", "available": 2, "rate": 350.00}
            ]
        }
    
    async def _check_service_availability(self, service_type: str, date: date, time: Optional[time]) -> Dict:
        """Check service availability"""
        # This would check against existing bookings and operating hours
        return {
            "service_type": service_type,
            "date": date.isoformat(),
            "time": time.isoformat() if time else None,
            "available": True,
            "slots_remaining": 3
        }
    
    def _generate_confirmation_number(self, booking_type: BookingType) -> str:
        """Generate unique confirmation number"""
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        prefix = booking_type.value.upper()[:3]
        return f"{prefix}{self.property_id:03d}{timestamp}"


# Factory function for creating tools
def create_buffr_tools(neon_client, tenant_id: str, property_id: int) -> BuffrAgentTools:
    """Create a new Buffr agent tools instance"""
    return BuffrAgentTools(neon_client, tenant_id, property_id)

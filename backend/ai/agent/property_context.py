"""
Property Context Service
Loads and caches property-specific context for Buffr Host agent
"""

from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from datetime import time, date
import json
from dataclasses import dataclass


class PropertyContext(BaseModel):
    """Complete property context loaded from database"""
    property_id: int
    property_name: str
    check_in_time: time
    check_out_time: time
    operating_hours: Dict[int, Dict[str, time]]  # day_of_week -> {open, close}
    services: List[Dict]  # Available services
    menu_items: List[Dict]  # Restaurant menu
    rates: Dict[str, float]  # Room types and rates
    policies: Dict[str, str]  # Cancellation, deposit, etc
    amenities: List[str]
    
    def get_operating_hours_text(self) -> str:
        """Format operating hours as readable text"""
        days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        hours_text = []
        
        for day_num in range(7):
            day_hours = self.operating_hours.get(day_num, {})
            if day_hours:
                open_time = day_hours.get("open", "Closed")
                close_time = day_hours.get("close", "Closed")
                if open_time != "Closed" and close_time != "Closed":
                    hours_text.append(f"{days[day_num]}: {open_time} - {close_time}")
                else:
                    hours_text.append(f"{days[day_num]}: Closed")
        
        return "\n".join(hours_text)
    
    def get_services_summary(self) -> str:
        """Format services as readable text"""
        if not self.services:
            return "No services available"
        
        service_summary = []
        for service in self.services:
            name = service.get("name", "Unknown Service")
            service_type = service.get("service_type", "service")
            price = service.get("base_price", 0)
            duration = service.get("duration_minutes", 0)
            
            price_text = f"${price:.2f}" if price > 0 else "Free"
            duration_text = f"({duration} min)" if duration > 0 else ""
            
            service_summary.append(f"• {name} ({service_type}) - {price_text} {duration_text}")
        
        return "\n".join(service_summary)
    
    def get_menu_summary(self) -> str:
        """Format menu as readable text"""
        if not self.menu_items:
            return "No menu items available"
        
        # Group by category
        categories = {}
        for item in self.menu_items:
            category = item.get("category", "Other")
            if category not in categories:
                categories[category] = []
            categories[category].append(item)
        
        menu_text = []
        for category, items in categories.items():
            menu_text.append(f"\n{category.title()}:")
            for item in items:
                name = item.get("name", "Unknown Item")
                price = item.get("price", 0)
                description = item.get("description", "")
                price_text = f"${price:.2f}"
                
                if description:
                    menu_text.append(f"  • {name} - {price_text} ({description})")
                else:
                    menu_text.append(f"  • {name} - {price_text}")
        
        return "\n".join(menu_text)
    
    def get_rates_summary(self) -> str:
        """Format rates as readable text"""
        if not self.rates:
            return "No rates available"
        
        rates_text = []
        for room_type, rate in self.rates.items():
            rates_text.append(f"• {room_type}: ${rate:.2f}/night")
        
        return "\n".join(rates_text)


class PropertyContextService:
    """Loads and caches property-specific context"""
    
    def __init__(self, neon_client):
        self.neon_client = neon_client
        self._cache: Dict[int, PropertyContext] = {}
    
    async def load_property_context(self, property_id: int) -> PropertyContext:
        """Load complete property context from database"""
        if property_id in self._cache:
            return self._cache[property_id]
        
        try:
            # Load property basic info
            property_info = await self._load_property_info(property_id)
            if not property_info:
                raise ValueError(f"Property {property_id} not found")
            
            # Load all context data
            operating_hours = await self._load_operating_hours(property_id)
            services = await self._load_services(property_id)
            menu = await self._load_menu(property_id)
            rates = await self._load_rates(property_id)
            config = await self._load_configuration(property_id)
            
            context = PropertyContext(
                property_id=property_id,
                property_name=property_info['name'],
                check_in_time=config['check_in_time'],
                check_out_time=config['check_out_time'],
                operating_hours=operating_hours,
                services=services,
                menu_items=menu,
                rates=rates,
                policies={
                    'cancellation': config.get('cancellation_policy', 'Standard cancellation policy'),
                    'deposit': config.get('deposit_policy', 'Credit card required for incidentals')
                },
                amenities=config.get('amenities', [])
            )
            
            self._cache[property_id] = context
            return context
            
        except Exception as e:
            print(f"Error loading property context: {e}")
            # Return minimal context on error
            return PropertyContext(
                property_id=property_id,
                property_name="Unknown Property",
                check_in_time=time(15, 0),
                check_out_time=time(11, 0),
                operating_hours={},
                services=[],
                menu_items=[],
                rates={},
                policies={},
                amenities=[]
            )
    
    async def _load_property_info(self, property_id: int) -> Optional[Dict]:
        """Load basic property information"""
        try:
            result = await self.neon_client.query(
                "SELECT id, name, description FROM hospitality_properties WHERE id = $1",
                [property_id]
            )
            return result[0] if result else None
        except Exception as e:
            print(f"Error loading property info: {e}")
            return None
    
    async def _load_operating_hours(self, property_id: int) -> Dict[int, Dict[str, time]]:
        """Load operating hours for each day of week"""
        try:
            result = await self.neon_client.query(
                """
                SELECT day_of_week, open_time, close_time, is_closed
                FROM property_operating_hours 
                WHERE property_id = $1
                ORDER BY day_of_week
                """,
                [property_id]
            )
            
            hours = {}
            for row in result:
                day = row['day_of_week']
                if row['is_closed']:
                    hours[day] = {"open": "Closed", "close": "Closed"}
                else:
                    hours[day] = {
                        "open": str(row['open_time']),
                        "close": str(row['close_time'])
                    }
            
            return hours
        except Exception as e:
            print(f"Error loading operating hours: {e}")
            return {}
    
    async def _load_services(self, property_id: int) -> List[Dict]:
        """Load available services"""
        try:
            result = await self.neon_client.query(
                """
                SELECT service_type, name, description, base_price, duration_minutes, 
                       capacity, requires_booking, advance_booking_hours, operating_hours, metadata
                FROM service_catalog 
                WHERE property_id = $1 AND is_active = true
                ORDER BY service_type, name
                """,
                [property_id]
            )
            
            services = []
            for row in result:
                services.append({
                    "service_type": row['service_type'],
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
            
            return services
        except Exception as e:
            print(f"Error loading services: {e}")
            return []
    
    async def _load_menu(self, property_id: int) -> List[Dict]:
        """Load restaurant menu items"""
        try:
            result = await self.neon_client.query(
                """
                SELECT mi.category, mi.name, mi.description, mi.price, mi.dietary_info, 
                       mi.allergens, mi.preparation_time_minutes, mi.is_available
                FROM menu_items mi
                JOIN service_catalog sc ON mi.service_id = sc.id
                WHERE sc.property_id = $1 AND sc.service_type = 'restaurant' 
                AND mi.is_available = true
                ORDER BY mi.category, mi.name
                """,
                [property_id]
            )
            
            menu_items = []
            for row in result:
                menu_items.append({
                    "category": row['category'],
                    "name": row['name'],
                    "description": row['description'],
                    "price": float(row['price']),
                    "dietary_info": row['dietary_info'],
                    "allergens": row['allergens'],
                    "preparation_time_minutes": row['preparation_time_minutes'],
                    "is_available": row['is_available']
                })
            
            return menu_items
        except Exception as e:
            print(f"Error loading menu: {e}")
            return []
    
    async def _load_rates(self, property_id: int) -> Dict[str, float]:
        """Load room rates"""
        try:
            result = await self.neon_client.query(
                """
                SELECT room_type, base_rate, weekend_rate
                FROM rate_configuration 
                WHERE property_id = $1 AND is_active = true
                AND valid_from <= CURRENT_DATE 
                AND (valid_to IS NULL OR valid_to >= CURRENT_DATE)
                ORDER BY room_type
                """,
                [property_id]
            )
            
            rates = {}
            for row in result:
                room_type = row['room_type']
                base_rate = float(row['base_rate'])
                weekend_rate = float(row['weekend_rate']) if row['weekend_rate'] else base_rate
                
                rates[room_type] = base_rate
                if weekend_rate != base_rate:
                    rates[f"{room_type} (Weekend)"] = weekend_rate
            
            return rates
        except Exception as e:
            print(f"Error loading rates: {e}")
            return {}
    
    async def _load_configuration(self, property_id: int) -> Dict:
        """Load property configuration"""
        try:
            result = await self.neon_client.query(
                """
                SELECT check_in_time, check_out_time, early_checkin_fee, late_checkout_fee,
                       cancellation_policy, deposit_policy, house_rules, amenities
                FROM property_configuration 
                WHERE property_id = $1
                """,
                [property_id]
            )
            
            if result:
                row = result[0]
                return {
                    "check_in_time": row['check_in_time'],
                    "check_out_time": row['check_out_time'],
                    "early_checkin_fee": float(row['early_checkin_fee']),
                    "late_checkout_fee": float(row['late_checkout_fee']),
                    "cancellation_policy": row['cancellation_policy'],
                    "deposit_policy": row['deposit_policy'],
                    "house_rules": row['house_rules'],
                    "amenities": row['amenities']
                }
            else:
                # Return defaults
                return {
                    "check_in_time": time(15, 0),
                    "check_out_time": time(11, 0),
                    "early_checkin_fee": 0.0,
                    "late_checkout_fee": 0.0,
                    "cancellation_policy": "Standard cancellation policy",
                    "deposit_policy": "Credit card required for incidentals",
                    "house_rules": {},
                    "amenities": []
                }
        except Exception as e:
            print(f"Error loading configuration: {e}")
            return {
                "check_in_time": time(15, 0),
                "check_out_time": time(11, 0),
                "early_checkin_fee": 0.0,
                "late_checkout_fee": 0.0,
                "cancellation_policy": "Standard cancellation policy",
                "deposit_policy": "Credit card required for incidentals",
                "house_rules": {},
                "amenities": []
            }
    
    def format_for_prompt(self, context: PropertyContext) -> str:
        """Format property context for agent prompt"""
        return f"""
PROPERTY: {context.property_name}

CHECK-IN/OUT:
- Check-in: {context.check_in_time}
- Check-out: {context.check_out_time}

OPERATING HOURS:
{context.get_operating_hours_text()}

AVAILABLE SERVICES:
{context.get_services_summary()}

RESTAURANT MENU:
{context.get_menu_summary()}

ROOM RATES:
{context.get_rates_summary()}

POLICIES:
- Cancellation: {context.policies.get('cancellation', 'Standard policy')}
- Deposit: {context.policies.get('deposit', 'Credit card required')}

AMENITIES:
{', '.join(context.amenities) if context.amenities else 'Standard amenities'}
"""
    
    def clear_cache(self, property_id: Optional[int] = None):
        """Clear property context cache"""
        if property_id:
            self._cache.pop(property_id, None)
        else:
            self._cache.clear()
    
    async def refresh_property_context(self, property_id: int) -> PropertyContext:
        """Force refresh property context from database"""
        self.clear_cache(property_id)
        return await self.load_property_context(property_id)


# Factory function for creating property context service
def create_property_context_service(neon_client) -> PropertyContextService:
    """Create a new property context service instance"""
    return PropertyContextService(neon_client)

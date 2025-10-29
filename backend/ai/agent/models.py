"""
Pydantic Models for Buffr Host Agent
Data models for agent interactions, bookings, orders, and responses
"""

from pydantic import BaseModel, Field, validator
from typing import List, Dict, Optional, Any, Union
from datetime import datetime, date, time
from enum import Enum


class BookingType(str, Enum):
    """Types of bookings the agent can handle"""
    ROOM = "room"
    SPA = "spa"
    RESTAURANT = "restaurant"
    SHUTTLE = "shuttle"
    TOUR = "tour"
    SERVICE = "service"


class OrderStatus(str, Enum):
    """Status of restaurant orders"""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PREPARING = "preparing"
    READY = "ready"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class ServiceType(str, Enum):
    """Types of services available"""
    SPA = "spa"
    SHUTTLE = "shuttle"
    TOUR = "tour"
    RENTAL = "rental"
    RESTAURANT = "restaurant"


class MenuItem(BaseModel):
    """Restaurant menu item"""
    id: str
    name: str
    description: Optional[str] = None
    price: float = Field(ge=0.0)
    category: str
    dietary_info: Dict[str, bool] = Field(default_factory=dict)
    allergens: List[str] = Field(default_factory=list)
    preparation_time_minutes: int = Field(default=15, ge=0)
    is_available: bool = True


class OrderItem(BaseModel):
    """Item in a restaurant order"""
    menu_item_id: str
    name: str
    quantity: int = Field(ge=1)
    price: float = Field(ge=0.0)
    special_instructions: Optional[str] = None
    
    @property
    def total_price(self) -> float:
        return self.price * self.quantity


class BookingRequest(BaseModel):
    """Request to create a booking"""
    booking_type: BookingType
    guest_name: str = Field(min_length=1, max_length=255)
    date: date
    time: Optional[time] = None
    service_name: Optional[str] = None
    special_requests: Optional[str] = None
    contact_info: Optional[str] = None
    party_size: int = Field(default=1, ge=1)
    
    @validator('date')
    def date_not_past(cls, v):
        if v < date.today():
            raise ValueError('Booking date cannot be in the past')
        return v


class RestaurantOrder(BaseModel):
    """Restaurant order request"""
    items: List[OrderItem] = Field(min_items=1)
    table_number: Optional[int] = Field(None, ge=1, le=100)
    delivery_room: Optional[str] = None
    special_instructions: Optional[str] = None
    contact_phone: Optional[str] = None
    
    @validator('items')
    def items_not_empty(cls, v):
        if not v:
            raise ValueError('Order must contain at least one item')
        return v


class ServiceRequest(BaseModel):
    """Request for a service (spa, shuttle, tour, etc)"""
    service_type: ServiceType
    service_name: str
    guest_name: str = Field(min_length=1, max_length=255)
    date: date
    time: time
    party_size: int = Field(default=1, ge=1)
    special_requests: Optional[str] = None
    contact_info: Optional[str] = None
    
    @validator('date')
    def date_not_past(cls, v):
        if v < date.today():
            raise ValueError('Service date cannot be in the past')
        return v


class CostCalculation(BaseModel):
    """Cost calculation request"""
    items: List[Dict[str, Any]]  # Flexible items for different types
    apply_taxes: bool = True
    apply_service_charge: bool = True
    tax_rate: float = Field(default=0.15, ge=0.0, le=1.0)  # 15% VAT
    service_charge_rate: float = Field(default=0.10, ge=0.0, le=1.0)  # 10% service charge
    
    @property
    def subtotal(self) -> float:
        return sum(item.get('price', 0) * item.get('quantity', 1) for item in self.items)
    
    @property
    def tax_amount(self) -> float:
        return self.subtotal * self.tax_rate if self.apply_taxes else 0.0
    
    @property
    def service_charge_amount(self) -> float:
        return self.subtotal * self.service_charge_rate if self.apply_service_charge else 0.0
    
    @property
    def total(self) -> float:
        return self.subtotal + self.tax_amount + self.service_charge_amount


class BookingConfirmation(BaseModel):
    """Booking confirmation response"""
    booking_id: str
    booking_type: BookingType
    guest_name: str
    date: date
    time: Optional[time]
    service_name: Optional[str]
    total_cost: float
    confirmation_number: str
    status: str = "confirmed"
    special_requests: Optional[str] = None
    contact_info: Optional[str] = None


class OrderConfirmation(BaseModel):
    """Restaurant order confirmation"""
    order_id: str
    items: List[OrderItem]
    table_number: Optional[int]
    delivery_room: Optional[str]
    total_cost: float
    estimated_ready_time: datetime
    status: OrderStatus = OrderStatus.CONFIRMED
    special_instructions: Optional[str] = None


class ServiceConfirmation(BaseModel):
    """Service booking confirmation"""
    service_id: str
    service_type: ServiceType
    service_name: str
    guest_name: str
    date: date
    time: time
    total_cost: float
    confirmation_number: str
    status: str = "confirmed"
    special_requests: Optional[str] = None


class AgentResponse(BaseModel):
    """Agent response with personality and context"""
    message: str
    personality_state: Dict[str, Any]
    suggested_actions: List[str] = Field(default_factory=list)
    requires_follow_up: bool = False
    confidence_score: float = Field(ge=0.0, le=1.0)
    response_type: str = "text"  # text, booking, order, service, calculation


class InteractionMetadata(BaseModel):
    """Metadata for agent interactions"""
    interaction_id: str
    user_id: str
    tenant_id: str
    property_id: int
    timestamp: datetime
    interaction_type: str  # booking, order, service, question, complaint
    success: bool
    complexity: float = Field(ge=0.0, le=1.0)
    sentiment: str = "neutral"  # positive, neutral, negative
    requires_human: bool = False
    follow_up_required: bool = False


class PropertyService(BaseModel):
    """Property service information"""
    id: str
    name: str
    service_type: ServiceType
    description: Optional[str]
    base_price: float
    duration_minutes: Optional[int]
    capacity: Optional[int]
    requires_booking: bool
    advance_booking_hours: int
    operating_hours: Dict[str, Any]
    metadata: Dict[str, Any] = Field(default_factory=dict)


class PropertyRate(BaseModel):
    """Property rate information"""
    room_type: str
    base_rate: float
    weekend_rate: Optional[float]
    min_nights: int = 1
    valid_from: date
    valid_to: Optional[date]


class PropertyAmenity(BaseModel):
    """Property amenity"""
    name: str
    description: Optional[str]
    category: str  # facility, service, feature


class AgentDependencies(BaseModel):
    """Dependencies injected into agent context"""
    tenant_id: str
    user_id: str
    property_id: int
    property_context: Dict[str, Any]
    personality: Dict[str, Any]
    mem0_service: Any  # Will be injected at runtime
    session_id: Optional[str] = None


class ToolResult(BaseModel):
    """Result from agent tool execution"""
    success: bool
    result: Dict[str, Any]
    error_message: Optional[str] = None
    execution_time: float = 0.0


class AgentHealth(BaseModel):
    """Agent health status"""
    status: str  # healthy, degraded, unhealthy
    personality_loaded: bool
    property_context_loaded: bool
    memory_service_available: bool
    tools_available: List[str]
    last_interaction: Optional[datetime]
    uptime_seconds: float
    error_count: int = 0
    success_rate: float = Field(ge=0.0, le=1.0)


class ConversationContext(BaseModel):
    """Context for ongoing conversation"""
    session_id: str
    user_id: str
    tenant_id: str
    property_id: int
    conversation_history: List[Dict[str, str]] = Field(default_factory=list)
    current_intent: Optional[str] = None
    pending_booking: Optional[BookingRequest] = None
    pending_order: Optional[RestaurantOrder] = None
    pending_service: Optional[ServiceRequest] = None
    user_preferences: Dict[str, Any] = Field(default_factory=dict)
    last_activity: datetime = Field(default_factory=datetime.now)


# Utility functions for model validation
def validate_booking_time(booking_type: BookingType, time: Optional[time]) -> bool:
    """Validate if booking time is appropriate for booking type"""
    if booking_type in [BookingType.ROOM, BookingType.SHUTTLE]:
        return time is None  # These don't require specific times
    elif booking_type in [BookingType.SPA, BookingType.RESTAURANT, BookingType.TOUR]:
        return time is not None  # These require specific times
    return True


def calculate_order_total(order: RestaurantOrder, tax_rate: float = 0.15, service_charge_rate: float = 0.10) -> float:
    """Calculate total cost for restaurant order"""
    subtotal = sum(item.total_price for item in order.items)
    tax = subtotal * tax_rate
    service_charge = subtotal * service_charge_rate
    return subtotal + tax + service_charge


def format_currency(amount: float, currency: str = "NAD") -> str:
    """Format amount as currency string"""
    return f"{currency} {amount:.2f}"


def generate_confirmation_number(booking_type: BookingType, property_id: int) -> str:
    """Generate unique confirmation number"""
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    prefix = booking_type.value.upper()[:3]
    return f"{prefix}{property_id:03d}{timestamp}"

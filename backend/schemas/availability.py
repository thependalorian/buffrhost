"""
Availability schemas for Buffr Host platform.
Phase 1: Core Availability Engine
"""
from datetime import date, time, datetime
from typing import List, Optional, Dict, Any
from decimal import Decimal
from pydantic import BaseModel, Field, validator


# =============================================================================
# REQUEST SCHEMAS
# =============================================================================

class InventoryItemRequest(BaseModel):
    """Request schema for inventory item availability check."""
    inventory_item_id: int = Field(..., description="Inventory item ID")
    menu_item_id: Optional[int] = Field(None, description="Menu item ID (alternative to inventory_item_id)")
    quantity: int = Field(..., ge=1, description="Required quantity")
    name: Optional[str] = Field(None, description="Item name for reference")

class InventoryAvailabilityRequest(BaseModel):
    """Request schema for inventory availability check."""
    property_id: int = Field(..., description="Property ID")
    items: List[InventoryItemRequest] = Field(..., description="List of items to check")

class ServiceAvailabilityRequest(BaseModel):
    """Request schema for service availability check."""
    property_id: int = Field(..., description="Property ID")
    service_type: str = Field(..., description="Service type (spa, conference, transportation)")
    service_id: int = Field(..., description="Service ID")
    requested_date: date = Field(..., description="Requested date")
    start_time: time = Field(..., description="Start time")
    end_time: time = Field(..., description="End time")

class TableAvailabilityRequest(BaseModel):
    """Request schema for table availability check."""
    property_id: int = Field(..., description="Property ID")
    party_size: int = Field(..., ge=1, description="Party size")
    requested_date: date = Field(..., description="Requested date")
    start_time: time = Field(..., description="Start time")
    end_time: time = Field(..., description="End time")

class RoomAvailabilityRequest(BaseModel):
    """Request schema for room availability check."""
    property_id: int = Field(..., description="Property ID")
    check_in_date: date = Field(..., description="Check-in date")
    check_out_date: date = Field(..., description="Check-out date")
    room_type: Optional[str] = Field(None, description="Room type filter")

class ReservationRequest(BaseModel):
    """Request schema for reservations."""
    property_id: int = Field(..., description="Property ID")
    items: Optional[List[InventoryItemRequest]] = Field(None, description="Items to reserve (for inventory)")
    reference_id: str = Field(..., description="Reference ID (order ID, etc.)")
    reference_type: str = Field(default="order", description="Reference type")

# =============================================================================
# RESPONSE SCHEMAS
# =============================================================================

class UnavailableItem(BaseModel):
    """Schema for unavailable items."""
    item_id: int = Field(..., description="Item ID")
    item_name: str = Field(..., description="Item name")
    required_quantity: int = Field(..., description="Required quantity")
    available_stock: Optional[float] = Field(None, description="Available stock")
    reason: str = Field(..., description="Reason for unavailability")

class LowStockItem(BaseModel):
    """Schema for low stock items."""
    item_id: int = Field(..., description="Item ID")
    item_name: str = Field(..., description="Item name")
    available_stock: float = Field(..., description="Available stock")
    minimum_stock: float = Field(..., description="Minimum stock level")

class InventoryAvailabilityResponse(BaseModel):
    """Response schema for inventory availability check."""
    available: bool = Field(..., description="Whether all items are available")
    unavailable_items: List[UnavailableItem] = Field(default=[], description="Unavailable items")
    low_stock_items: List[LowStockItem] = Field(default=[], description="Low stock items")
    total_available: int = Field(..., description="Total available quantity")
    total_unavailable: int = Field(..., description="Total unavailable quantity")

class ServiceAvailabilityResponse(BaseModel):
    """Response schema for service availability check."""
    available: bool = Field(..., description="Whether service is available")
    max_capacity: int = Field(..., description="Maximum capacity")
    current_bookings: int = Field(..., description="Current bookings")
    remaining_capacity: int = Field(..., description="Remaining capacity")
    price: float = Field(..., description="Service price")
    reason: Optional[str] = Field(None, description="Reason if not available")

class TableAvailabilityItem(BaseModel):
    """Schema for available table."""
    table_id: int = Field(..., description="Table ID")
    table_number: str = Field(..., description="Table number")
    capacity: int = Field(..., description="Table capacity")
    location: Optional[str] = Field(None, description="Table location")
    is_available: bool = Field(..., description="Whether table is available")
    reservation_id: Optional[int] = Field(None, description="Existing reservation ID")

class TableAvailabilityResponse(BaseModel):
    """Response schema for table availability check."""
    available_tables: List[TableAvailabilityItem] = Field(..., description="Available tables")
    total_available: int = Field(..., description="Total available tables")
    total_tables: int = Field(..., description="Total tables checked")

class RoomAvailabilityItem(BaseModel):
    """Schema for available room."""
    room_id: int = Field(..., description="Room ID")
    room_number: str = Field(..., description="Room number")
    room_type: str = Field(..., description="Room type")
    capacity: int = Field(..., description="Room capacity")
    base_price: float = Field(..., description="Base price per night")
    is_available: bool = Field(..., description="Whether room is available")
    room_status: str = Field(..., description="Room status")

class RoomAvailabilityResponse(BaseModel):
    """Response schema for room availability check."""
    available_rooms: List[RoomAvailabilityItem] = Field(..., description="Available rooms")
    total_available: int = Field(..., description="Total available rooms")
    total_rooms: int = Field(..., description="Total rooms checked")

class FailedItem(BaseModel):
    """Schema for failed reservation items."""
    item_id: int = Field(..., description="Item ID")
    reason: str = Field(..., description="Failure reason")

class ReservationResponse(BaseModel):
    """Response schema for reservations."""
    success: bool = Field(..., description="Whether reservation was successful")
    success_count: int = Field(..., description="Number of successful reservations")
    failed_items: List[FailedItem] = Field(default=[], description="Failed items")
    message: str = Field(..., description="Response message")

class InventorySummary(BaseModel):
    """Schema for inventory summary."""
    total_items: int = Field(..., description="Total inventory items")
    low_stock_items: int = Field(..., description="Low stock items count")
    out_of_stock_items: int = Field(..., description="Out of stock items count")

class TableSummary(BaseModel):
    """Schema for table summary."""
    total_tables: int = Field(..., description="Total tables")
    available_tables: int = Field(..., description="Available tables")

class RoomSummary(BaseModel):
    """Schema for room summary."""
    total_rooms: int = Field(..., description="Total rooms")
    available_rooms: int = Field(..., description="Available rooms")

class AvailabilitySummaryResponse(BaseModel):
    """Response schema for availability summary."""
    property_id: int = Field(..., description="Property ID")
    inventory: InventorySummary = Field(..., description="Inventory summary")
    tables: TableSummary = Field(..., description="Table summary")
    rooms: RoomSummary = Field(..., description="Room summary")
    timestamp: str = Field(..., description="Response timestamp")

# =============================================================================
# VALIDATION SCHEMAS
# =============================================================================

class AvailabilityCheckRequest(BaseModel):
    """Generic availability check request."""
    property_id: int = Field(..., description="Property ID")
    check_type: str = Field(..., description="Type of availability check")
    parameters: Dict[str, Any] = Field(..., description="Check-specific parameters")

    @validator('check_type')
    def validate_check_type(cls, v):
        allowed_types = ['inventory', 'service', 'table', 'room', 'summary']
        if v not in allowed_types:
            raise ValueError(f'check_type must be one of: {allowed_types}')
        return v

class BulkAvailabilityRequest(BaseModel):
    """Request schema for bulk availability checks."""
    property_id: int = Field(..., description="Property ID")
    checks: List[AvailabilityCheckRequest] = Field(..., description="List of availability checks")

# =============================================================================
# NOTIFICATION SCHEMAS
# =============================================================================

class AvailabilityAlert(BaseModel):
    """Schema for availability alerts."""
    alert_type: str = Field(..., description="Type of alert")
    severity: str = Field(..., description="Alert severity")
    message: str = Field(..., description="Alert message")
    property_id: int = Field(..., description="Property ID")
    item_id: Optional[int] = Field(None, description="Item ID (if applicable)")
    created_at: datetime = Field(default_factory=datetime.now, description="Alert creation time")

class AvailabilityNotification(BaseModel):
    """Schema for availability notifications."""
    notification_type: str = Field(..., description="Type of notification")
    title: str = Field(..., description="Notification title")
    message: str = Field(..., description="Notification message")
    target_audience: str = Field(..., description="Target audience")
    property_id: int = Field(..., description="Property ID")
    is_sent: bool = Field(default=False, description="Whether notification was sent")
    created_at: datetime = Field(default_factory=datetime.now, description="Notification creation time")

# =============================================================================
# ANALYTICS SCHEMAS
# =============================================================================

class AvailabilityMetrics(BaseModel):
    """Schema for availability metrics."""
    property_id: int = Field(..., description="Property ID")
    date: date = Field(..., description="Metrics date")
    inventory_accuracy: float = Field(..., description="Inventory accuracy percentage")
    table_utilization: float = Field(..., description="Table utilization percentage")
    room_occupancy: float = Field(..., description="Room occupancy percentage")
    service_booking_rate: float = Field(..., description="Service booking rate percentage")
    total_checks: int = Field(..., description="Total availability checks")
    successful_checks: int = Field(..., description="Successful availability checks")

class AvailabilityTrend(BaseModel):
    """Schema for availability trends."""
    property_id: int = Field(..., description="Property ID")
    metric_type: str = Field(..., description="Type of metric")
    period: str = Field(..., description="Time period")
    values: List[float] = Field(..., description="Metric values")
    dates: List[date] = Field(..., description="Corresponding dates")
    trend_direction: str = Field(..., description="Trend direction (up, down, stable)")

# =============================================================================
# CONFIGURATION SCHEMAS
# =============================================================================

class AvailabilityConfig(BaseModel):
    """Schema for availability configuration."""
    property_id: int = Field(..., description="Property ID")
    inventory_low_stock_threshold: float = Field(default=0.2, description="Low stock threshold (percentage)")
    table_booking_advance_hours: int = Field(default=24, description="Minimum advance booking hours")
    room_booking_advance_days: int = Field(default=1, description="Minimum advance booking days")
    service_booking_advance_hours: int = Field(default=2, description="Minimum advance booking hours")
    auto_release_hours: int = Field(default=24, description="Auto-release after hours")
    enable_notifications: bool = Field(default=True, description="Enable availability notifications")
    enable_alerts: bool = Field(default=True, description="Enable availability alerts")

class AvailabilityRule(BaseModel):
    """Schema for availability rules."""
    rule_id: int = Field(..., description="Rule ID")
    property_id: int = Field(..., description="Property ID")
    rule_type: str = Field(..., description="Rule type")
    conditions: Dict[str, Any] = Field(..., description="Rule conditions")
    actions: Dict[str, Any] = Field(..., description="Rule actions")
    is_active: bool = Field(default=True, description="Whether rule is active")
    created_at: datetime = Field(default_factory=datetime.now, description="Rule creation time")
    updated_at: datetime = Field(default_factory=datetime.now, description="Rule update time")
"""
Etuna Guesthouse & Tours - Public Demo Routes

This module provides a public showcase of Buffr Host capabilities
without requiring authentication. It's a demonstration-only system.
"""

from fastapi import APIRouter, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func, desc
from typing import List, Optional
from uuid import UUID
from datetime import datetime, date
import logging

from database import get_db
from models.hospitality_property import HospitalityProperty
from models.menu import Menu, MenuCategory
from models.order import Order, OrderItem
from models.room import RoomType
from models.transportation import TransportationService
from models.recreation import RecreationService
from models.specialized import SpecializedService
from schemas.hospitality_property import PropertyResponse
from schemas.menu import MenuItemResponse, MenuCategoryResponse
from schemas.order import OrderResponse, OrderCreate
from schemas.room import RoomTypeResponse, RoomReservationResponse, RoomReservationCreate

logger = logging.getLogger(__name__)
router = APIRouter()

# Etuna Property ID (will be set in database migration)
ETUNA_PROPERTY_ID = 1

# ============================================================================
# PUBLIC DEMO ENDPOINTS (NO AUTHENTICATION REQUIRED)
# ============================================================================

@router.get("/property", response_model=PropertyResponse)
async def get_etuna_property(
    db: AsyncSession = Depends(get_db)
):
    """Get Etuna Guesthouse property information for public demo display."""
    try:
        result = await db.execute(
            select(HospitalityProperty).where(HospitalityProperty.property_id == ETUNA_PROPERTY_ID)
        )
        property = result.scalar_one_or_none()
        
        if not property:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Etuna property not found"
            )
        
        return PropertyResponse.from_orm(property)
    except Exception as e:
        logger.error(f"Error fetching Etuna property: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch property information"
        )

@router.get("/rooms", response_model=List[RoomTypeResponse])
async def get_etuna_rooms(
    db: AsyncSession = Depends(get_db)
):
    """Get all available room types at Etuna Guesthouse for demo."""
    try:
        result = await db.execute(
            select(RoomType)
            .where(RoomType.property_id == ETUNA_PROPERTY_ID)
            .where(RoomType.is_active == True)
            .order_by(RoomType.base_price_per_night)
        )
        room_types = result.scalars().all()
        
        return [RoomTypeResponse.from_orm(room_type) for room_type in room_types]
    except Exception as e:
        logger.error(f"Error fetching Etuna rooms: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch room information"
        )

@router.get("/menu", response_model=List[MenuItemResponse])
async def get_etuna_menu(
    category_id: Optional[int] = Query(None, description="Filter by menu category"),
    db: AsyncSession = Depends(get_db)
):
    """Get Etuna restaurant menu items for demo."""
    try:
        query = select(Menu).where(Menu.property_id == ETUNA_PROPERTY_ID)
        
        if category_id:
            query = query.where(Menu.category_id == category_id)
        
        query = query.where(Menu.is_available == True).order_by(Menu.name)
        
        result = await db.execute(query)
        menu_items = result.scalars().all()
        
        return [MenuItemResponse.from_orm(item) for item in menu_items]
    except Exception as e:
        logger.error(f"Error fetching Etuna menu: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch menu information"
        )

@router.get("/menu/categories", response_model=List[MenuCategoryResponse])
async def get_etuna_menu_categories(
    db: AsyncSession = Depends(get_db)
):
    """Get Etuna restaurant menu categories for demo."""
    try:
        result = await db.execute(
            select(MenuCategory)
            .where(MenuCategory.property_id == ETUNA_PROPERTY_ID)
            .order_by(MenuCategory.display_order)
        )
        categories = result.scalars().all()
        
        return [MenuCategoryResponse.from_orm(category) for category in categories]
    except Exception as e:
        logger.error(f"Error fetching Etuna menu categories: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch menu categories"
        )

@router.get("/services/transportation")
async def get_etuna_transportation_services(
    db: AsyncSession = Depends(get_db)
):
    """Get Etuna transportation services (tours, shuttles, etc.) for demo."""
    try:
        result = await db.execute(
            select(TransportationService)
            .where(TransportationService.property_id == ETUNA_PROPERTY_ID)
            .where(TransportationService.is_available == True)
            .order_by(TransportationService.service_name)
        )
        services = result.scalars().all()
        
        return [
            {
                "service_id": service.service_id,
                "service_name": service.service_name,
                "service_type": service.service_type,
                "description": service.description,
                "base_price": float(service.base_price),
                "duration_minutes": service.duration_minutes,
                "capacity": service.capacity,
                "requires_booking": service.requires_booking
            }
            for service in services
        ]
    except Exception as e:
        logger.error(f"Error fetching Etuna transportation services: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch transportation services"
        )

@router.get("/services/recreation")
async def get_etuna_recreation_services(
    db: AsyncSession = Depends(get_db)
):
    """Get Etuna recreation services (activities, tours, etc.) for demo."""
    try:
        result = await db.execute(
            select(RecreationService)
            .where(RecreationService.property_id == ETUNA_PROPERTY_ID)
            .where(RecreationService.is_available == True)
            .order_by(RecreationService.service_name)
        )
        services = result.scalars().all()
        
        return [
            {
                "recreation_id": service.recreation_id,
                "service_name": service.service_name,
                "service_type": service.service_type,
                "description": service.description,
                "base_price": float(service.base_price),
                "duration_minutes": service.duration_minutes,
                "capacity": service.capacity,
                "equipment_included": service.equipment_included,
                "requires_booking": service.requires_booking
            }
            for service in services
        ]
    except Exception as e:
        logger.error(f"Error fetching Etuna recreation services: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch recreation services"
        )

@router.get("/services/specialized")
async def get_etuna_specialized_services(
    db: AsyncSession = Depends(get_db)
):
    """Get Etuna specialized services (concierge, laundry, etc.) for demo."""
    try:
        result = await db.execute(
            select(SpecializedService)
            .where(SpecializedService.property_id == ETUNA_PROPERTY_ID)
            .where(SpecializedService.is_available == True)
            .order_by(SpecializedService.service_name)
        )
        services = result.scalars().all()
        
        return [
            {
                "service_id": service.service_id,
                "service_name": service.service_name,
                "service_type": service.service_type,
                "description": service.description,
                "base_price": float(service.base_price),
                "duration_minutes": service.duration_minutes,
                "requires_booking": service.requires_booking
            }
            for service in services
        ]
    except Exception as e:
        logger.error(f"Error fetching Etuna specialized services: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch specialized services"
        )

@router.post("/demo/reservation", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_demo_reservation(
    reservation_data: RoomReservationCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a demo reservation (simulation only - no real booking)."""
    try:
        # Validate room type exists
        room_type_result = await db.execute(
            select(RoomType).where(
                and_(
                    RoomType.room_type_id == reservation_data.room_type_id,
                    RoomType.property_id == ETUNA_PROPERTY_ID,
                    RoomType.is_active == True
                )
            )
        )
        room_type = room_type_result.scalar_one_or_none()
        
        if not room_type:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Room type not found or not available"
            )
        
        # Return demo response (no actual database insert)
        demo_reservation = {
            "reservation_id": f"DEMO-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "property_id": ETUNA_PROPERTY_ID,
            "room_type_id": reservation_data.room_type_id,
            "customer_name": reservation_data.customer_name,
            "customer_email": reservation_data.customer_email,
            "customer_phone": reservation_data.customer_phone,
            "check_in_date": reservation_data.check_in_date,
            "check_out_date": reservation_data.check_out_date,
            "adults": reservation_data.adults,
            "children": reservation_data.children,
            "special_requests": reservation_data.special_requests,
            "total_amount": reservation_data.total_amount,
            "status": "demo_confirmed",
            "created_at": datetime.utcnow().isoformat(),
            "demo_note": "This is a demo reservation. No actual booking was created."
        }
        
        return demo_reservation
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating demo reservation: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create demo reservation"
        )

@router.post("/demo/order", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_demo_order(
    order_data: OrderCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a demo order (simulation only - no real order)."""
    try:
        # Return demo response (no actual database insert)
        demo_order = {
            "order_id": f"DEMO-ORD-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "customer_id": order_data.customer_id,
            "property_id": ETUNA_PROPERTY_ID,
            "payment_method": order_data.payment_method,
            "order_type": order_data.order_type,
            "status": "demo_confirmed",
            "total_amount": order_data.total_amount,
            "notes": order_data.notes,
            "order_date": datetime.utcnow().isoformat(),
            "items": order_data.items,
            "demo_note": "This is a demo order. No actual order was created."
        }
        
        return demo_order
        
    except Exception as e:
        logger.error(f"Error creating demo order: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create demo order"
        )

# ============================================================================
# DEMO MANAGEMENT ENDPOINTS (PUBLIC ACCESS - SIMULATION ONLY)
# ============================================================================

@router.get("/demo/dashboard")
async def get_demo_dashboard(
    db: AsyncSession = Depends(get_db)
):
    """Get demo dashboard data (simulation only)."""
    try:
        # Return simulated dashboard data
        demo_dashboard = {
            "occupancy_rate": 78.5,
            "today_revenue": 12450.00,
            "active_guests": 28,
            "guest_satisfaction": 4.8,
            "recent_reservations": [
                {
                    "id": "DEMO-RES-001",
                    "guest_name": "John Smith",
                    "room_type": "Executive Room",
                    "check_in": "2024-01-15",
                    "check_out": "2024-01-17",
                    "status": "confirmed",
                    "amount": 2000.00
                },
                {
                    "id": "DEMO-RES-002",
                    "guest_name": "Maria Garcia",
                    "room_type": "Family Suite",
                    "check_in": "2024-01-16",
                    "check_out": "2024-01-19",
                    "status": "pending",
                    "amount": 4500.00
                }
            ],
            "recent_orders": [
                {
                    "id": "DEMO-ORD-001",
                    "customer_name": "Guest",
                    "total_amount": 285.00,
                    "status": "delivered",
                    "order_date": "2024-01-15T19:30:00Z"
                },
                {
                    "id": "DEMO-ORD-002",
                    "customer_name": "Guest",
                    "total_amount": 150.00,
                    "status": "ready",
                    "order_date": "2024-01-15T20:15:00Z"
                }
            ],
            "demo_note": "This is demo data for showcase purposes only."
        }
        
        return demo_dashboard
        
    except Exception as e:
        logger.error(f"Error fetching demo dashboard: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo dashboard"
        )

@router.get("/demo/reservations")
async def get_demo_reservations(
    status_filter: Optional[str] = Query(None, description="Filter by reservation status"),
    db: AsyncSession = Depends(get_db)
):
    """Get demo reservations (simulation only)."""
    try:
        # Return simulated reservations data
        demo_reservations = [
            {
                "reservation_id": 1,
                "property_id": ETUNA_PROPERTY_ID,
                "room_type_id": 2,
                "customer_name": "John Smith",
                "customer_email": "john.smith@email.com",
                "customer_phone": "+264 81 234 5678",
                "check_in_date": "2024-01-15",
                "check_out_date": "2024-01-17",
                "adults": 2,
                "children": 0,
                "special_requests": "Late check-in requested",
                "total_amount": 2000.00,
                "status": "confirmed",
                "created_at": "2024-01-10T00:00:00Z"
            },
            {
                "reservation_id": 2,
                "property_id": ETUNA_PROPERTY_ID,
                "room_type_id": 4,
                "customer_name": "Maria Garcia",
                "customer_email": "maria.garcia@email.com",
                "customer_phone": "+264 81 345 6789",
                "check_in_date": "2024-01-16",
                "check_out_date": "2024-01-19",
                "adults": 2,
                "children": 2,
                "special_requests": "High chair needed for toddler",
                "total_amount": 4500.00,
                "status": "pending",
                "created_at": "2024-01-11T00:00:00Z"
            }
        ]
        
        # Filter by status if provided
        if status_filter:
            demo_reservations = [r for r in demo_reservations if r["status"] == status_filter]
        
        return demo_reservations
        
    except Exception as e:
        logger.error(f"Error fetching demo reservations: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo reservations"
        )

@router.get("/demo/orders")
async def get_demo_orders(
    status_filter: Optional[str] = Query(None, description="Filter by order status"),
    db: AsyncSession = Depends(get_db)
):
    """Get demo orders (simulation only)."""
    try:
        # Return simulated orders data
        demo_orders = [
            {
                "order_id": 1,
                "customer_id": None,
                "property_id": ETUNA_PROPERTY_ID,
                "payment_method": "cash",
                "order_type": "restaurant",
                "status": "delivered",
                "total_amount": 285.00,
                "notes": "Table T-05",
                "order_date": "2024-01-15T19:30:00Z"
            },
            {
                "order_id": 2,
                "customer_id": None,
                "property_id": ETUNA_PROPERTY_ID,
                "payment_method": "card",
                "order_type": "restaurant",
                "status": "ready",
                "total_amount": 150.00,
                "notes": "Table T-12",
                "order_date": "2024-01-15T20:15:00Z"
            }
        ]
        
        # Filter by status if provided
        if status_filter:
            demo_orders = [o for o in demo_orders if o["status"] == status_filter]
        
        return demo_orders
        
    except Exception as e:
        logger.error(f"Error fetching demo orders: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo orders"
        )

# ============================================================================
# PHASE 1 DEMO ENDPOINTS (QR CODES, LOYALTY, INVENTORY, STAFF, PAYMENTS)
# ============================================================================

@router.get("/demo/qr-codes")
async def get_demo_qr_codes(
    db: AsyncSession = Depends(get_db)
):
    """Get demo QR codes for showcase purposes."""
    try:
        # Return simulated QR code data
        demo_qr_codes = [
            {
                "qr_id": "QR-001",
                "qr_type": "table",
                "location": "Table T-05",
                "qr_url": "https://demo.etuna.com/table/t05",
                "scans_today": 23,
                "scans_total": 1247,
                "status": "active",
                "created_at": "2024-01-01T00:00:00Z"
            },
            {
                "qr_id": "QR-002", 
                "qr_type": "menu",
                "location": "Main Entrance",
                "qr_url": "https://demo.etuna.com/menu",
                "scans_today": 45,
                "scans_total": 3421,
                "status": "active",
                "created_at": "2024-01-01T00:00:00Z"
            },
            {
                "qr_id": "QR-003",
                "qr_type": "loyalty",
                "location": "Reception Desk",
                "qr_url": "https://demo.etuna.com/loyalty/join",
                "scans_today": 12,
                "scans_total": 567,
                "status": "active",
                "created_at": "2024-01-01T00:00:00Z"
            }
        ]
        
        return demo_qr_codes
        
    except Exception as e:
        logger.error(f"Error fetching demo QR codes: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo QR codes"
        )

@router.get("/demo/loyalty/members")
async def get_demo_loyalty_members(
    tier_filter: Optional[str] = Query(None, description="Filter by loyalty tier"),
    db: AsyncSession = Depends(get_db)
):
    """Get demo loyalty members for showcase purposes."""
    try:
        # Return simulated loyalty member data
        demo_members = [
            {
                "member_id": "LOY-001",
                "name": "John Smith",
                "email": "john.smith@email.com",
                "phone": "+264 81 234 5678",
                "tier": "Gold",
                "points_balance": 2450,
                "points_to_next_tier": 550,
                "total_spent": 12500.00,
                "join_date": "2024-01-15",
                "last_visit": "2024-01-20",
                "status": "active"
            },
            {
                "member_id": "LOY-002",
                "name": "Maria Garcia",
                "email": "maria.garcia@email.com", 
                "phone": "+264 81 345 6789",
                "tier": "Silver",
                "points_balance": 1200,
                "points_to_next_tier": 1300,
                "total_spent": 6800.00,
                "join_date": "2024-01-10",
                "last_visit": "2024-01-18",
                "status": "active"
            },
            {
                "member_id": "LOY-003",
                "name": "David Johnson",
                "email": "david.johnson@email.com",
                "phone": "+264 81 456 7890",
                "tier": "Platinum",
                "points_balance": 5200,
                "points_to_next_tier": 0,
                "total_spent": 25000.00,
                "join_date": "2023-12-01",
                "last_visit": "2024-01-22",
                "status": "active"
            }
        ]
        
        # Filter by tier if provided
        if tier_filter:
            demo_members = [m for m in demo_members if m["tier"].lower() == tier_filter.lower()]
        
        return demo_members
        
    except Exception as e:
        logger.error(f"Error fetching demo loyalty members: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo loyalty members"
        )

@router.get("/demo/inventory")
async def get_demo_inventory(
    category_filter: Optional[str] = Query(None, description="Filter by inventory category"),
    db: AsyncSession = Depends(get_db)
):
    """Get demo inventory data for showcase purposes."""
    try:
        # Return simulated inventory data
        demo_inventory = [
            {
                "item_id": "INV-001",
                "name": "Chicken Breast",
                "category": "Food",
                "current_stock": 45,
                "min_stock": 20,
                "max_stock": 100,
                "unit_cost": 25.50,
                "total_value": 1147.50,
                "last_restocked": "2024-01-18",
                "status": "in_stock",
                "supplier": "Fresh Foods Ltd"
            },
            {
                "item_id": "INV-002",
                "name": "Rice (5kg)",
                "category": "Food",
                "current_stock": 8,
                "min_stock": 15,
                "max_stock": 50,
                "unit_cost": 45.00,
                "total_value": 360.00,
                "last_restocked": "2024-01-15",
                "status": "low_stock",
                "supplier": "Grain Suppliers"
            },
            {
                "item_id": "INV-003",
                "name": "Tomatoes",
                "category": "Food",
                "current_stock": 0,
                "min_stock": 10,
                "max_stock": 30,
                "unit_cost": 8.50,
                "total_value": 0.00,
                "last_restocked": "2024-01-12",
                "status": "out_of_stock",
                "supplier": "Fresh Produce Co"
            },
            {
                "item_id": "INV-004",
                "name": "Towels",
                "category": "Hotel Supplies",
                "current_stock": 120,
                "min_stock": 50,
                "max_stock": 200,
                "unit_cost": 15.00,
                "total_value": 1800.00,
                "last_restocked": "2024-01-20",
                "status": "in_stock",
                "supplier": "Hotel Supplies Inc"
            }
        ]
        
        # Filter by category if provided
        if category_filter:
            demo_inventory = [i for i in demo_inventory if i["category"].lower() == category_filter.lower()]
        
        return demo_inventory
        
    except Exception as e:
        logger.error(f"Error fetching demo inventory: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo inventory"
        )

@router.get("/demo/staff")
async def get_demo_staff(
    department_filter: Optional[str] = Query(None, description="Filter by department"),
    db: AsyncSession = Depends(get_db)
):
    """Get demo staff data for showcase purposes."""
    try:
        # Return simulated staff data
        demo_staff = [
            {
                "staff_id": "STAFF-001",
                "name": "Anna Smith",
                "position": "Restaurant Manager",
                "department": "Restaurant",
                "email": "anna.smith@etuna.com",
                "phone": "+264 81 111 1111",
                "hire_date": "2023-06-01",
                "status": "active",
                "shift_today": "8:00 AM - 6:00 PM",
                "hours_this_week": 40,
                "performance_rating": 4.8
            },
            {
                "staff_id": "STAFF-002",
                "name": "John Doe",
                "position": "Front Desk Agent",
                "department": "Hotel",
                "email": "john.doe@etuna.com",
                "phone": "+264 81 222 2222",
                "hire_date": "2023-08-15",
                "status": "active",
                "shift_today": "2:00 PM - 10:00 PM",
                "hours_this_week": 32,
                "performance_rating": 4.5
            },
            {
                "staff_id": "STAFF-003",
                "name": "Maria Garcia",
                "position": "Housekeeping Supervisor",
                "department": "Hotel",
                "email": "maria.garcia@etuna.com",
                "phone": "+264 81 333 3333",
                "hire_date": "2023-05-20",
                "status": "active",
                "shift_today": "7:00 AM - 3:00 PM",
                "hours_this_week": 35,
                "performance_rating": 4.9
            },
            {
                "staff_id": "STAFF-004",
                "name": "David Johnson",
                "position": "Tour Guide",
                "department": "Tours",
                "email": "david.johnson@etuna.com",
                "phone": "+264 81 444 4444",
                "hire_date": "2023-09-01",
                "status": "active",
                "shift_today": "9:00 AM - 5:00 PM",
                "hours_this_week": 38,
                "performance_rating": 4.7
            }
        ]
        
        # Filter by department if provided
        if department_filter:
            demo_staff = [s for s in demo_staff if s["department"].lower() == department_filter.lower()]
        
        return demo_staff
        
    except Exception as e:
        logger.error(f"Error fetching demo staff: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo staff"
        )

@router.get("/demo/payments")
async def get_demo_payments(
    method_filter: Optional[str] = Query(None, description="Filter by payment method"),
    db: AsyncSession = Depends(get_db)
):
    """Get demo payment data for showcase purposes."""
    try:
        # Return simulated payment data
        demo_payments = [
            {
                "payment_id": "PAY-001",
                "transaction_id": "TXN-001",
                "amount": 285.00,
                "currency": "NAD",
                "payment_method": "card",
                "card_type": "Visa",
                "status": "completed",
                "customer_name": "John Smith",
                "order_id": "ORD-001",
                "processed_at": "2024-01-20T14:30:00Z",
                "processing_fee": 8.55
            },
            {
                "payment_id": "PAY-002",
                "transaction_id": "TXN-002",
                "amount": 150.00,
                "currency": "NAD",
                "payment_method": "mobile",
                "card_type": "Apple Pay",
                "status": "completed",
                "customer_name": "Maria Garcia",
                "order_id": "ORD-002",
                "processed_at": "2024-01-20T15:45:00Z",
                "processing_fee": 4.50
            },
            {
                "payment_id": "PAY-003",
                "transaction_id": "TXN-003",
                "amount": 2000.00,
                "currency": "NAD",
                "payment_method": "qr_code",
                "card_type": "QR Payment",
                "status": "completed",
                "customer_name": "David Johnson",
                "order_id": "RES-001",
                "processed_at": "2024-01-20T16:20:00Z",
                "processing_fee": 60.00
            },
            {
                "payment_id": "PAY-004",
                "transaction_id": "TXN-004",
                "amount": 75.00,
                "currency": "NAD",
                "payment_method": "cash",
                "card_type": "Cash",
                "status": "completed",
                "customer_name": "Sarah Wilson",
                "order_id": "ORD-003",
                "processed_at": "2024-01-20T17:10:00Z",
                "processing_fee": 0.00
            }
        ]
        
        # Filter by payment method if provided
        if method_filter:
            demo_payments = [p for p in demo_payments if p["payment_method"].lower() == method_filter.lower()]
        
        return demo_payments
        
    except Exception as e:
        logger.error(f"Error fetching demo payments: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo payments"
        )

# ============================================================================
# PHASE 2 DEMO ENDPOINTS (MARKETING, CMS, FINANCIAL, VOICE AI, DOCUMENTS, PREDICTIVE)
# ============================================================================

@router.get("/demo/marketing/campaigns")
async def get_demo_marketing_campaigns(
    status_filter: Optional[str] = Query(None, description="Filter by campaign status"),
    db: AsyncSession = Depends(get_db)
):
    """Get demo marketing campaigns for showcase purposes."""
    try:
        # Return simulated marketing campaign data
        demo_campaigns = [
            {
                "campaign_id": "CAMP-001",
                "name": "Welcome Series",
                "type": "email",
                "status": "active",
                "target_audience": "new_guests",
                "open_rate": 85.2,
                "click_rate": 42.1,
                "conversion_rate": 28.3,
                "created_at": "2024-01-15T00:00:00Z",
                "last_sent": "2024-01-20T10:30:00Z"
            },
            {
                "campaign_id": "CAMP-002",
                "name": "Birthday Offers",
                "type": "email",
                "status": "active",
                "target_audience": "loyalty_members",
                "open_rate": 92.1,
                "click_rate": 67.4,
                "conversion_rate": 89.2,
                "created_at": "2024-01-10T00:00:00Z",
                "last_sent": "2024-01-22T09:15:00Z"
            },
            {
                "campaign_id": "CAMP-003",
                "name": "Re-engagement Campaign",
                "type": "email",
                "status": "active",
                "target_audience": "inactive_guests",
                "open_rate": 67.8,
                "click_rate": 34.2,
                "conversion_rate": 23.1,
                "created_at": "2024-01-05T00:00:00Z",
                "last_sent": "2024-01-21T14:45:00Z"
            }
        ]
        
        # Filter by status if provided
        if status_filter:
            demo_campaigns = [c for c in demo_campaigns if c["status"].lower() == status_filter.lower()]
        
        return demo_campaigns
        
    except Exception as e:
        logger.error(f"Error fetching demo marketing campaigns: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo marketing campaigns"
        )

@router.get("/demo/cms/content")
async def get_demo_cms_content(
    type_filter: Optional[str] = Query(None, description="Filter by content type"),
    db: AsyncSession = Depends(get_db)
):
    """Get demo CMS content for showcase purposes."""
    try:
        # Return simulated CMS content data
        demo_content = [
            {
                "content_id": "CONT-001",
                "title": "Restaurant Menu",
                "type": "page",
                "status": "published",
                "author": "Anna Smith",
                "last_modified": "2024-01-20T15:30:00Z",
                "views": 1247,
                "category": "restaurant"
            },
            {
                "content_id": "CONT-002",
                "title": "Room Gallery",
                "type": "gallery",
                "status": "published",
                "author": "John Doe",
                "last_modified": "2024-01-19T11:20:00Z",
                "views": 3421,
                "category": "hotel"
            },
            {
                "content_id": "CONT-003",
                "title": "Property Tour Video",
                "type": "video",
                "status": "draft",
                "author": "Maria Garcia",
                "last_modified": "2024-01-18T16:45:00Z",
                "views": 0,
                "category": "marketing"
            }
        ]
        
        # Filter by type if provided
        if type_filter:
            demo_content = [c for c in demo_content if c["type"].lower() == type_filter.lower()]
        
        return demo_content
        
    except Exception as e:
        logger.error(f"Error fetching demo CMS content: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo CMS content"
        )

@router.get("/demo/financial/metrics")
async def get_demo_financial_metrics(
    period: Optional[str] = Query("monthly", description="Time period for metrics"),
    db: AsyncSession = Depends(get_db)
):
    """Get demo financial metrics for showcase purposes."""
    try:
        # Return simulated financial metrics data
        demo_metrics = {
            "period": period,
            "revenue": {
                "total": 125000.00,
                "daily_average": 4032.26,
                "growth_rate": 12.5,
                "forecast_next_month": 140625.00
            },
            "costs": {
                "total": 79800.00,
                "daily_average": 2574.19,
                "growth_rate": 8.2,
                "forecast_next_month": 86346.00
            },
            "profit": {
                "total": 45200.00,
                "daily_average": 1458.06,
                "margin_percentage": 36.2,
                "forecast_next_month": 54279.00
            },
            "roi": {
                "monthly": 18.5,
                "annual": 222.0,
                "trend": "+5.2%"
            }
        }
        
        return demo_metrics
        
    except Exception as e:
        logger.error(f"Error fetching demo financial metrics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo financial metrics"
        )

@router.get("/demo/voice-ai/conversations")
async def get_demo_voice_conversations(
    db: AsyncSession = Depends(get_db)
):
    """Get demo voice AI conversations for showcase purposes."""
    try:
        # Return simulated voice AI conversation data
        demo_conversations = [
            {
                "conversation_id": "VOICE-001",
                "user_input": "Book a room for tonight",
                "ai_response": "I'd be happy to help you book a room for tonight. Let me check our availability...",
                "intent": "room_booking",
                "confidence": 0.95,
                "processing_time": 2.3,
                "timestamp": "2024-01-20T14:30:00Z",
                "status": "completed"
            },
            {
                "conversation_id": "VOICE-002",
                "user_input": "What's on the menu today?",
                "ai_response": "Today we have our traditional Namibian dishes including oshifima, kapana, and fresh fish...",
                "intent": "menu_inquiry",
                "confidence": 0.92,
                "processing_time": 1.8,
                "timestamp": "2024-01-20T15:45:00Z",
                "status": "completed"
            },
            {
                "conversation_id": "VOICE-003",
                "user_input": "Schedule a tour for tomorrow",
                "ai_response": "I can help you schedule a tour for tomorrow. We have several options available...",
                "intent": "tour_booking",
                "confidence": 0.88,
                "processing_time": 3.1,
                "timestamp": "2024-01-20T16:20:00Z",
                "status": "completed"
            }
        ]
        
        return demo_conversations
        
    except Exception as e:
        logger.error(f"Error fetching demo voice conversations: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo voice conversations"
        )

@router.get("/demo/documents/processing")
async def get_demo_document_processing(
    status_filter: Optional[str] = Query(None, description="Filter by processing status"),
    db: AsyncSession = Depends(get_db)
):
    """Get demo document processing data for showcase purposes."""
    try:
        # Return simulated document processing data
        demo_documents = [
            {
                "document_id": "DOC-001",
                "filename": "Invoice_2024_001.pdf",
                "type": "invoice",
                "status": "completed",
                "confidence_score": 0.98,
                "processing_time": 2.3,
                "extracted_data": {
                    "amount": 2850.00,
                    "vendor": "Fresh Foods Ltd",
                    "date": "2024-01-15",
                    "items": 12
                },
                "uploaded_at": "2024-01-20T14:30:00Z"
            },
            {
                "document_id": "DOC-002",
                "filename": "Contract_Supplier_ABC.docx",
                "type": "contract",
                "status": "processing",
                "confidence_score": 0.45,
                "processing_time": 0.0,
                "extracted_data": None,
                "uploaded_at": "2024-01-20T15:45:00Z"
            },
            {
                "document_id": "DOC-003",
                "filename": "Receipt_Scan_001.jpg",
                "type": "receipt",
                "status": "review_required",
                "confidence_score": 0.23,
                "processing_time": 1.2,
                "extracted_data": {
                    "amount": 150.00,
                    "vendor": "Unknown",
                    "date": "2024-01-20",
                    "items": 3
                },
                "uploaded_at": "2024-01-20T16:20:00Z"
            }
        ]
        
        # Filter by status if provided
        if status_filter:
            demo_documents = [d for d in demo_documents if d["status"].lower() == status_filter.lower()]
        
        return demo_documents
        
    except Exception as e:
        logger.error(f"Error fetching demo document processing: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo document processing"
        )

@router.get("/demo/predictive/forecasts")
async def get_demo_predictive_forecasts(
    forecast_type: Optional[str] = Query(None, description="Type of forecast"),
    db: AsyncSession = Depends(get_db)
):
    """Get demo predictive forecasts for showcase purposes."""
    try:
        # Return simulated predictive forecast data
        demo_forecasts = [
            {
                "forecast_id": "FCST-001",
                "type": "revenue",
                "period": "30_days",
                "predicted_value": 140625.00,
                "confidence_level": 0.95,
                "growth_rate": 15.0,
                "factors": ["seasonal_trends", "booking_patterns", "market_conditions"],
                "created_at": "2024-01-20T00:00:00Z"
            },
            {
                "forecast_id": "FCST-002",
                "type": "occupancy",
                "period": "7_days",
                "predicted_value": 87.0,
                "confidence_level": 0.92,
                "growth_rate": 5.2,
                "factors": ["historical_data", "seasonal_patterns", "events"],
                "created_at": "2024-01-20T00:00:00Z"
            },
            {
                "forecast_id": "FCST-003",
                "type": "demand",
                "period": "peak_hours",
                "predicted_value": "high",
                "confidence_level": 0.88,
                "growth_rate": 12.5,
                "factors": ["time_patterns", "service_types", "customer_behavior"],
                "created_at": "2024-01-20T00:00:00Z"
            }
        ]
        
        # Filter by type if provided
        if forecast_type:
            demo_forecasts = [f for f in demo_forecasts if f["type"].lower() == forecast_type.lower()]
        
        return demo_forecasts
        
    except Exception as e:
        logger.error(f"Error fetching demo predictive forecasts: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo predictive forecasts"
        )

# ============================================================================
# PHASE 3 DEMO ENDPOINTS (MULTI-TENANT, WHITE-LABEL, SECURITY, API, BI, INTEGRATIONS)
# ============================================================================

@router.get("/demo/multi-tenant/tenants")
async def get_demo_multi_tenant_tenants(
    status_filter: Optional[str] = Query(None, description="Filter by tenant status"),
    db: AsyncSession = Depends(get_db)
):
    """Get demo multi-tenant data for showcase purposes."""
    try:
        # Return simulated multi-tenant data
        demo_tenants = [
            {
                "tenant_id": "TENANT-001",
                "name": "Etuna Guesthouse",
                "type": "single_property",
                "status": "active",
                "properties_count": 5,
                "users_count": 45,
                "storage_used": "85GB",
                "created_at": "2024-01-15T00:00:00Z",
                "last_activity": "2024-01-20T14:30:00Z"
            },
            {
                "tenant_id": "TENANT-002",
                "name": "Namibian Safari Lodge",
                "type": "multi_property",
                "status": "active",
                "properties_count": 12,
                "users_count": 156,
                "storage_used": "420GB",
                "created_at": "2024-01-10T00:00:00Z",
                "last_activity": "2024-01-20T15:45:00Z"
            },
            {
                "tenant_id": "TENANT-003",
                "name": "Coastal Resort Group",
                "type": "enterprise",
                "status": "active",
                "properties_count": 25,
                "users_count": 450,
                "storage_used": "1.2TB",
                "created_at": "2024-01-05T00:00:00Z",
                "last_activity": "2024-01-20T16:20:00Z"
            }
        ]
        
        # Filter by status if provided
        if status_filter:
            demo_tenants = [t for t in demo_tenants if t["status"].lower() == status_filter.lower()]
        
        return demo_tenants
        
    except Exception as e:
        logger.error(f"Error fetching demo multi-tenant data: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo multi-tenant data"
        )

@router.get("/demo/white-label/brands")
async def get_demo_white_label_brands(
    db: AsyncSession = Depends(get_db)
):
    """Get demo white-label brand data for showcase purposes."""
    try:
        # Return simulated white-label brand data
        demo_brands = [
            {
                "brand_id": "BRAND-001",
                "name": "Etuna Brand",
                "type": "original",
                "status": "active",
                "custom_domain": "etuna.buffrhost.com",
                "theme": "default",
                "logo_url": "/images/etuna-logo.png",
                "primary_color": "#3B82F6",
                "created_at": "2024-01-15T00:00:00Z"
            },
            {
                "brand_id": "BRAND-002",
                "name": "Safari Lodge Brand",
                "type": "custom",
                "status": "active",
                "custom_domain": "safari.buffrhost.com",
                "theme": "safari",
                "logo_url": "/images/safari-logo.png",
                "primary_color": "#059669",
                "created_at": "2024-01-10T00:00:00Z"
            },
            {
                "brand_id": "BRAND-003",
                "name": "Resort Group Brand",
                "type": "enterprise",
                "status": "active",
                "custom_domain": "resortgroup.com",
                "theme": "luxury",
                "logo_url": "/images/resort-logo.png",
                "primary_color": "#7C3AED",
                "created_at": "2024-01-05T00:00:00Z"
            }
        ]
        
        return demo_brands
        
    except Exception as e:
        logger.error(f"Error fetching demo white-label data: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo white-label data"
        )

@router.get("/demo/enterprise-security/status")
async def get_demo_enterprise_security_status(
    db: AsyncSession = Depends(get_db)
):
    """Get demo enterprise security status for showcase purposes."""
    try:
        # Return simulated enterprise security data
        demo_security = {
            "overall_score": 98,
            "encryption": {
                "status": "active",
                "algorithm": "AES-256",
                "coverage": "100%",
                "last_updated": "2024-01-20T00:00:00Z"
            },
            "threat_detection": {
                "status": "active",
                "monitoring": "24/7",
                "threats_blocked": 1247,
                "last_threat": "2024-01-20T14:30:00Z"
            },
            "access_control": {
                "status": "active",
                "mfa_enabled": True,
                "rbac_enabled": True,
                "active_sessions": 89
            },
            "compliance": {
                "soc2": "certified",
                "gdpr": "compliant",
                "pci_dss": "certified",
                "iso27001": "certified"
            }
        }
        
        return demo_security
        
    except Exception as e:
        logger.error(f"Error fetching demo enterprise security data: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo enterprise security data"
        )

@router.get("/demo/api-management/endpoints")
async def get_demo_api_management_endpoints(
    category_filter: Optional[str] = Query(None, description="Filter by API category"),
    db: AsyncSession = Depends(get_db)
):
    """Get demo API management endpoints for showcase purposes."""
    try:
        # Return simulated API management data
        demo_endpoints = [
            {
                "endpoint_id": "API-001",
                "name": "Property Management API",
                "category": "core",
                "version": "v2.1.0",
                "status": "active",
                "uptime": 99.9,
                "avg_response_time": 1.2,
                "requests_today": 15420,
                "last_updated": "2024-01-20T00:00:00Z"
            },
            {
                "endpoint_id": "API-002",
                "name": "Booking API",
                "category": "business",
                "version": "v1.8.0",
                "status": "active",
                "uptime": 99.8,
                "avg_response_time": 0.8,
                "requests_today": 8930,
                "last_updated": "2024-01-20T00:00:00Z"
            },
            {
                "endpoint_id": "API-003",
                "name": "Payment API",
                "category": "business",
                "version": "v3.0.0",
                "status": "active",
                "uptime": 99.95,
                "avg_response_time": 0.6,
                "requests_today": 6780,
                "last_updated": "2024-01-20T00:00:00Z"
            }
        ]
        
        # Filter by category if provided
        if category_filter:
            demo_endpoints = [e for e in demo_endpoints if e["category"].lower() == category_filter.lower()]
        
        return demo_endpoints
        
    except Exception as e:
        logger.error(f"Error fetching demo API management data: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo API management data"
        )

@router.get("/demo/business-intelligence/kpis")
async def get_demo_business_intelligence_kpis(
    db: AsyncSession = Depends(get_db)
):
    """Get demo business intelligence KPIs for showcase purposes."""
    try:
        # Return simulated business intelligence data
        demo_kpis = {
            "revenue_growth": {
                "current": 15.2,
                "previous": 12.8,
                "trend": "up",
                "target": 20.0
            },
            "customer_satisfaction": {
                "current": 4.8,
                "previous": 4.5,
                "trend": "up",
                "target": 5.0
            },
            "operational_efficiency": {
                "current": 92.0,
                "previous": 87.0,
                "trend": "up",
                "target": 95.0
            },
            "cost_optimization": {
                "current": 8.5,
                "previous": 6.2,
                "trend": "up",
                "target": 10.0
            }
        }
        
        return demo_kpis
        
    except Exception as e:
        logger.error(f"Error fetching demo business intelligence data: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo business intelligence data"
        )

@router.get("/demo/advanced-integrations/connectors")
async def get_demo_advanced_integrations_connectors(
    type_filter: Optional[str] = Query(None, description="Filter by integration type"),
    db: AsyncSession = Depends(get_db)
):
    """Get demo advanced integrations connectors for showcase purposes."""
    try:
        # Return simulated advanced integrations data
        demo_connectors = [
            {
                "connector_id": "CONN-001",
                "name": "Payment Gateway",
                "type": "payment",
                "provider": "RealPay",
                "status": "connected",
                "uptime": 99.9,
                "last_sync": "2024-01-20T14:30:00Z",
                "data_synced": 1247
            },
            {
                "connector_id": "CONN-002",
                "name": "Booking Platform",
                "type": "booking",
                "provider": "Booking.com",
                "status": "connected",
                "uptime": 99.8,
                "last_sync": "2024-01-20T15:45:00Z",
                "data_synced": 893
            },
            {
                "connector_id": "CONN-003",
                "name": "Accounting System",
                "type": "enterprise",
                "provider": "QuickBooks",
                "status": "connected",
                "uptime": 99.95,
                "last_sync": "2024-01-20T16:20:00Z",
                "data_synced": 567
            }
        ]
        
        # Filter by type if provided
        if type_filter:
            demo_connectors = [c for c in demo_connectors if c["type"].lower() == type_filter.lower()]
        
        return demo_connectors
        
    except Exception as e:
        logger.error(f"Error fetching demo advanced integrations data: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo advanced integrations data"
        )

# ============================================================================
# FINAL OPTIMIZATION DEMO ENDPOINTS (PERFORMANCE, MOBILE, WORKFLOWS, COLLABORATION, REPORTING, MARKETPLACE)
# ============================================================================

@router.get("/demo/performance-optimization/metrics")
async def get_demo_performance_optimization_metrics(
    db: AsyncSession = Depends(get_db)
):
    """Get demo performance optimization metrics for showcase purposes."""
    try:
        # Return simulated performance optimization data
        demo_performance = {
            "page_load_time": {
                "current": 0.8,
                "baseline": 2.0,
                "improvement": 60.0,
                "target": 0.5
            },
            "cache_hit_rate": {
                "current": 98.5,
                "baseline": 83.5,
                "improvement": 15.0,
                "target": 99.0
            },
            "database_performance": {
                "current": 99.9,
                "baseline": 95.2,
                "improvement": 4.7,
                "target": 99.95
            },
            "cdn_performance": {
                "current": 99.8,
                "baseline": 92.1,
                "improvement": 7.7,
                "target": 99.9
            }
        }
        
        return demo_performance
        
    except Exception as e:
        logger.error(f"Error fetching demo performance optimization data: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo performance optimization data"
        )

@router.get("/demo/mobile-app/features")
async def get_demo_mobile_app_features(
    platform_filter: Optional[str] = Query(None, description="Filter by platform"),
    db: AsyncSession = Depends(get_db)
):
    """Get demo mobile app features for showcase purposes."""
    try:
        # Return simulated mobile app data
        demo_features = [
            {
                "feature_id": "MOBILE-001",
                "name": "Offline Access",
                "platform": "both",
                "status": "available",
                "description": "Full functionality without internet",
                "coverage": "core_features"
            },
            {
                "feature_id": "MOBILE-002",
                "name": "Push Notifications",
                "platform": "both",
                "status": "active",
                "description": "Real-time updates and alerts",
                "coverage": "all_features"
            },
            {
                "feature_id": "MOBILE-003",
                "name": "QR Code Scanner",
                "platform": "both",
                "status": "ready",
                "description": "Built-in camera integration",
                "coverage": "native_camera"
            },
            {
                "feature_id": "MOBILE-004",
                "name": "Biometric Security",
                "platform": "both",
                "status": "available",
                "description": "Fingerprint and face recognition",
                "coverage": "security_features"
            }
        ]
        
        # Filter by platform if provided
        if platform_filter:
            demo_features = [f for f in demo_features if f["platform"].lower() == platform_filter.lower()]
        
        return demo_features
        
    except Exception as e:
        logger.error(f"Error fetching demo mobile app data: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo mobile app data"
        )

@router.get("/demo/advanced-workflows/processes")
async def get_demo_advanced_workflows_processes(
    status_filter: Optional[str] = Query(None, description="Filter by workflow status"),
    db: AsyncSession = Depends(get_db)
):
    """Get demo advanced workflows processes for showcase purposes."""
    try:
        # Return simulated advanced workflows data
        demo_workflows = [
            {
                "workflow_id": "WF-001",
                "name": "Guest Check-in",
                "type": "automated",
                "status": "active",
                "efficiency": 95.0,
                "steps": 8,
                "last_run": "2024-01-20T14:30:00Z"
            },
            {
                "workflow_id": "WF-002",
                "name": "Inventory Reorder",
                "type": "smart_automation",
                "status": "active",
                "efficiency": 98.0,
                "steps": 12,
                "last_run": "2024-01-20T15:45:00Z"
            },
            {
                "workflow_id": "WF-003",
                "name": "Staff Scheduling",
                "type": "ai_optimization",
                "status": "active",
                "efficiency": 92.0,
                "steps": 15,
                "last_run": "2024-01-20T16:20:00Z"
            }
        ]
        
        # Filter by status if provided
        if status_filter:
            demo_workflows = [w for w in demo_workflows if w["status"].lower() == status_filter.lower()]
        
        return demo_workflows
        
    except Exception as e:
        logger.error(f"Error fetching demo advanced workflows data: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo advanced workflows data"
        )

@router.get("/demo/realtime-collaboration/sessions")
async def get_demo_realtime_collaboration_sessions(
    db: AsyncSession = Depends(get_db)
):
    """Get demo real-time collaboration sessions for showcase purposes."""
    try:
        # Return simulated real-time collaboration data
        demo_sessions = [
            {
                "session_id": "COLLAB-001",
                "name": "Guest Services Team",
                "type": "chat",
                "status": "active",
                "members_online": 5,
                "messages_count": 12,
                "last_activity": "2024-01-20T14:30:00Z"
            },
            {
                "session_id": "COLLAB-002",
                "name": "Management Meeting",
                "type": "video_call",
                "status": "live",
                "members_online": 3,
                "messages_count": 0,
                "last_activity": "2024-01-20T15:45:00Z"
            },
            {
                "session_id": "COLLAB-003",
                "name": "Project Workspace",
                "type": "shared_documents",
                "status": "shared",
                "members_online": 4,
                "messages_count": 8,
                "last_activity": "2024-01-20T16:20:00Z"
            }
        ]
        
        return demo_sessions
        
    except Exception as e:
        logger.error(f"Error fetching demo real-time collaboration data: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo real-time collaboration data"
        )

@router.get("/demo/advanced-reporting/templates")
async def get_demo_advanced_reporting_templates(
    category_filter: Optional[str] = Query(None, description="Filter by report category"),
    db: AsyncSession = Depends(get_db)
):
    """Get demo advanced reporting templates for showcase purposes."""
    try:
        # Return simulated advanced reporting data
        demo_templates = [
            {
                "template_id": "REPORT-001",
                "name": "Financial Summary",
                "category": "financial",
                "type": "scheduled",
                "frequency": "monthly",
                "last_generated": "2024-01-20T00:00:00Z",
                "status": "active"
            },
            {
                "template_id": "REPORT-002",
                "name": "Guest Analytics",
                "category": "customer",
                "type": "custom",
                "frequency": "on_demand",
                "last_generated": "2024-01-20T14:30:00Z",
                "status": "active"
            },
            {
                "template_id": "REPORT-003",
                "name": "Operational Metrics",
                "category": "operational",
                "type": "real_time",
                "frequency": "continuous",
                "last_generated": "2024-01-20T16:20:00Z",
                "status": "active"
            }
        ]
        
        # Filter by category if provided
        if category_filter:
            demo_templates = [t for t in demo_templates if t["category"].lower() == category_filter.lower()]
        
        return demo_templates
        
    except Exception as e:
        logger.error(f"Error fetching demo advanced reporting data: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo advanced reporting data"
        )

@router.get("/demo/marketplace-integration/apps")
async def get_demo_marketplace_integration_apps(
    category_filter: Optional[str] = Query(None, description="Filter by app category"),
    db: AsyncSession = Depends(get_db)
):
    """Get demo marketplace integration apps for showcase purposes."""
    try:
        # Return simulated marketplace integration data
        demo_apps = [
            {
                "app_id": "APP-001",
                "name": "Advanced Analytics Pro",
                "category": "business_intelligence",
                "rating": 4.9,
                "price": 29.0,
                "currency": "USD",
                "period": "monthly",
                "status": "featured",
                "downloads": 15420
            },
            {
                "app_id": "APP-002",
                "name": "Social Media Manager",
                "category": "marketing",
                "rating": 4.8,
                "price": 19.0,
                "currency": "USD",
                "period": "monthly",
                "status": "popular",
                "downloads": 8930
            },
            {
                "app_id": "APP-003",
                "name": "Inventory Optimizer",
                "category": "operations",
                "rating": 4.7,
                "price": 39.0,
                "currency": "USD",
                "period": "monthly",
                "status": "new",
                "downloads": 6780
            }
        ]
        
        # Filter by category if provided
        if category_filter:
            demo_apps = [a for a in demo_apps if a["category"].lower() == category_filter.lower()]
        
        return demo_apps
        
    except Exception as e:
        logger.error(f"Error fetching demo marketplace integration data: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo marketplace integration data"
        )

# ============================================================================
# DEMO ANALYTICS ENDPOINTS (PUBLIC ACCESS - SIMULATION ONLY)
# ============================================================================

@router.get("/demo/analytics/revenue")
async def get_demo_revenue_analytics(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """Get demo revenue analytics (simulation only)."""
    try:
        # Return simulated analytics data
        demo_analytics = {
            "period": {
                "start_date": start_date.isoformat() if start_date else "2024-01-01",
                "end_date": end_date.isoformat() if end_date else "2024-01-31"
            },
            "revenue": {
                "total": 125000.00,
                "reservations": 95000.00,
                "orders": 30000.00
            },
            "reservations_count": 45,
            "orders_count": 120,
            "demo_note": "This is demo analytics data for showcase purposes only."
        }
        
        return demo_analytics
        
    except Exception as e:
        logger.error(f"Error fetching demo revenue analytics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo revenue analytics"
        )

@router.get("/demo/analytics/occupancy")
async def get_demo_occupancy_analytics(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """Get demo occupancy analytics (simulation only)."""
    try:
        # Return simulated occupancy data
        demo_occupancy = {
            "period": {
                "start_date": start_date.isoformat() if start_date else "2024-01-01",
                "end_date": end_date.isoformat() if end_date else "2024-01-31"
            },
            "total_rooms": 35,
            "daily_occupancy": {
                "2024-01-01": {"occupancy_count": 25, "occupancy_rate": 71.4},
                "2024-01-02": {"occupancy_count": 28, "occupancy_rate": 80.0},
                "2024-01-03": {"occupancy_count": 30, "occupancy_rate": 85.7},
                "2024-01-04": {"occupancy_count": 27, "occupancy_rate": 77.1},
                "2024-01-05": {"occupancy_count": 32, "occupancy_rate": 91.4}
            },
            "average_occupancy": 81.1,
            "demo_note": "This is demo occupancy data for showcase purposes only."
        }
        
        return demo_occupancy
        
    except Exception as e:
        logger.error(f"Error fetching demo occupancy analytics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch demo occupancy analytics"
        )
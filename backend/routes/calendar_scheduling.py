from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from auth.dependencies import \
    get_current_admin_user  # Assuming only admins can manage calendar/scheduling
from database import get_db
from models.user import User
from schemas.calendar_scheduling import (BookingCreate, BookingResponse,
                                         BookingUpdate, EventCreate,
                                         EventResponse, EventUpdate,
                                         ResourceCreate, ResourceResponse,
                                         ResourceUpdate, ScheduleCreate,
                                         ScheduleResponse, ScheduleUpdate)
from services.calendar_scheduling_service import CalendarSchedulingService

router = APIRouter()


# Dependency to get CalendarSchedulingService instance
async def get_calendar_scheduling_service(
    db: AsyncSession = Depends(get_db),
) -> CalendarSchedulingService:
    return CalendarSchedulingService(db)


# --- Booking Endpoints ---
@router.post(
    "/bookings", response_model=BookingResponse, status_code=status.HTTP_201_CREATED
)
async def create_booking(
    booking_data: BookingCreate,
    calendar_service: CalendarSchedulingService = Depends(
        get_calendar_scheduling_service
    ),
    current_user: User = Depends(get_current_admin_user),
):
    """Create a new booking."""
    return await calendar_service.create_booking(booking_data)


@router.get("/bookings", response_model=List[BookingResponse])
async def get_bookings(
    skip: int = 0,
    limit: int = 100,
    calendar_service: CalendarSchedulingService = Depends(
        get_calendar_scheduling_service
    ),
    current_user: User = Depends(get_current_admin_user),
):
    """Retrieve a list of bookings."""
    return await calendar_service.get_bookings(skip=skip, limit=limit)


@router.get("/bookings/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: UUID,
    calendar_service: CalendarSchedulingService = Depends(
        get_calendar_scheduling_service
    ),
    current_user: User = Depends(get_current_admin_user),
):
    """Retrieve a single booking by ID."""
    booking = await calendar_service.get_booking(booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found"
        )
    return booking


@router.put("/bookings/{booking_id}", response_model=BookingResponse)
async def update_booking(
    booking_id: UUID,
    booking_data: BookingUpdate,
    calendar_service: CalendarSchedulingService = Depends(
        get_calendar_scheduling_service
    ),
    current_user: User = Depends(get_current_admin_user),
):
    """Update an existing booking."""
    booking = await calendar_service.update_booking(booking_id, booking_data)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found"
        )
    return booking


@router.delete("/bookings/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_booking(
    booking_id: UUID,
    calendar_service: CalendarSchedulingService = Depends(
        get_calendar_scheduling_service
    ),
    current_user: User = Depends(get_current_admin_user),
):
    """Delete a booking."""
    success = await calendar_service.delete_booking(booking_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found"
        )
    return


# --- Schedule Endpoints ---
@router.post(
    "/schedules", response_model=ScheduleResponse, status_code=status.HTTP_201_CREATED
)
async def create_schedule(
    schedule_data: ScheduleCreate,
    calendar_service: CalendarSchedulingService = Depends(
        get_calendar_scheduling_service
    ),
    current_user: User = Depends(get_current_admin_user),
):
    """Create a new schedule."""
    return await calendar_service.create_schedule(schedule_data)


@router.get("/schedules", response_model=List[ScheduleResponse])
async def get_schedules(
    skip: int = 0,
    limit: int = 100,
    calendar_service: CalendarSchedulingService = Depends(
        get_calendar_scheduling_service
    ),
    current_user: User = Depends(get_current_admin_user),
):
    """Retrieve a list of schedules."""
    return await calendar_service.get_schedules(skip=skip, limit=limit)


@router.get("/schedules/{schedule_id}", response_model=ScheduleResponse)
async def get_schedule(
    schedule_id: UUID,
    calendar_service: CalendarSchedulingService = Depends(
        get_calendar_scheduling_service
    ),
    current_user: User = Depends(get_current_admin_user),
):
    """Retrieve a single schedule by ID."""
    schedule = await calendar_service.get_schedule(schedule_id)
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Schedule not found"
        )
    return schedule


@router.put("/schedules/{schedule_id}", response_model=ScheduleResponse)
async def update_schedule(
    schedule_id: UUID,
    schedule_data: ScheduleUpdate,
    calendar_service: CalendarSchedulingService = Depends(
        get_calendar_scheduling_service
    ),
    current_user: User = Depends(get_current_admin_user),
):
    """Update an existing schedule."""
    schedule = await calendar_service.update_schedule(schedule_id, schedule_data)
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Schedule not found"
        )
    return schedule


@router.delete("/schedules/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_schedule(
    schedule_id: UUID,
    calendar_service: CalendarSchedulingService = Depends(
        get_calendar_scheduling_service
    ),
    current_user: User = Depends(get_current_admin_user),
):
    """Delete a schedule."""
    success = await calendar_service.delete_schedule(schedule_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Schedule not found"
        )
    return


# --- Resource Endpoints ---
@router.post(
    "/resources", response_model=ResourceResponse, status_code=status.HTTP_201_CREATED
)
async def create_resource(
    resource_data: ResourceCreate,
    calendar_service: CalendarSchedulingService = Depends(
        get_calendar_scheduling_service
    ),
    current_user: User = Depends(get_current_admin_user),
):
    """Create a new resource."""
    return await calendar_service.create_resource(resource_data)


@router.get("/resources", response_model=List[ResourceResponse])
async def get_resources(
    skip: int = 0,
    limit: int = 100,
    calendar_service: CalendarSchedulingService = Depends(
        get_calendar_scheduling_service
    ),
    current_user: User = Depends(get_current_admin_user),
):
    """Retrieve a list of resources."""
    return await calendar_service.get_resources(skip=skip, limit=limit)


@router.get("/resources/{resource_id}", response_model=ResourceResponse)
async def get_resource(
    resource_id: UUID,
    calendar_service: CalendarSchedulingService = Depends(
        get_calendar_scheduling_service
    ),
    current_user: User = Depends(get_current_admin_user),
):
    """Retrieve a single resource by ID."""
    resource = await calendar_service.get_resource(resource_id)
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found"
        )
    return resource


@router.put("/resources/{resource_id}", response_model=ResourceResponse)
async def update_resource(
    resource_id: UUID,
    resource_data: ResourceUpdate,
    calendar_service: CalendarSchedulingService = Depends(
        get_calendar_scheduling_service
    ),
    current_user: User = Depends(get_current_admin_user),
):
    """Update an existing resource."""
    resource = await calendar_service.update_resource(resource_id, resource_data)
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found"
        )
    return resource


@router.delete("/resources/{resource_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resource(
    resource_id: UUID,
    calendar_service: CalendarSchedulingService = Depends(
        get_calendar_scheduling_service
    ),
    current_user: User = Depends(get_current_admin_user),
):
    """Delete a resource."""
    success = await calendar_service.delete_resource(resource_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found"
        )
    return


# --- Event Endpoints ---
@router.post(
    "/events", response_model=EventResponse, status_code=status.HTTP_201_CREATED
)
async def create_event(
    event_data: EventCreate,
    calendar_service: CalendarSchedulingService = Depends(
        get_calendar_scheduling_service
    ),
    current_user: User = Depends(get_current_admin_user),
):
    """Create a new event."""
    return await calendar_service.create_event(event_data)


@router.get("/events", response_model=List[EventResponse])
async def get_events(
    skip: int = 0,
    limit: int = 100,
    calendar_service: CalendarSchedulingService = Depends(
        get_calendar_scheduling_service
    ),
    current_user: User = Depends(get_current_admin_user),
):
    """Retrieve a list of events."""
    return await calendar_service.get_events(skip=skip, limit=limit)


@router.get("/events/{event_id}", response_model=EventResponse)
async def get_event(
    event_id: UUID,
    calendar_service: CalendarSchedulingService = Depends(
        get_calendar_scheduling_service
    ),
    current_user: User = Depends(get_current_admin_user),
):
    """Retrieve a single event by ID."""
    event = await calendar_service.get_event(event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Event not found"
        )
    return event


@router.put("/events/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: UUID,
    event_data: EventUpdate,
    calendar_service: CalendarSchedulingService = Depends(
        get_calendar_scheduling_service
    ),
    current_user: User = Depends(get_current_admin_user),
):
    """Update an existing event."""
    event = await calendar_service.update_event(event_id, event_data)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Event not found"
        )
    return event


@router.delete("/events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(
    event_id: UUID,
    calendar_service: CalendarSchedulingService = Depends(
        get_calendar_scheduling_service
    ),
    current_user: User = Depends(get_current_admin_user),
):
    """Delete an event."""
    success = await calendar_service.delete_event(event_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Event not found"
        )
    return

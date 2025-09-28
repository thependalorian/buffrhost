"""
Staff management API routes for The Shandi platform.
"""
from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from auth.dependencies import get_current_user
from database import get_db
from models.user import User
from schemas.staff import (StaffAttendance, StaffAttendanceCreate,
                           StaffAttendanceUpdate, StaffAttendanceWithDetails,
                           StaffCommunication, StaffCommunicationCreate,
                           StaffCommunicationUpdate,
                           StaffCommunicationWithDetails, StaffDepartment,
                           StaffDepartmentCreate, StaffDepartmentUpdate,
                           StaffLeaveRequest, StaffLeaveRequestCreate,
                           StaffLeaveRequestUpdate,
                           StaffLeaveRequestWithDetails, StaffPerformance,
                           StaffPerformanceCreate, StaffPerformanceUpdate,
                           StaffPerformanceWithDetails, StaffPosition,
                           StaffPositionCreate, StaffPositionUpdate,
                           StaffProfile, StaffProfileCreate,
                           StaffProfileUpdate, StaffProfileWithDetails,
                           StaffSchedule, StaffScheduleCreate,
                           StaffScheduleUpdate, StaffScheduleWithDetails,
                           StaffTask, StaffTaskCreate, StaffTaskUpdate,
                           StaffTaskWithDetails)
from services.staff_service import StaffService

router = APIRouter(prefix="/staff", tags=["Staff Management"])


# Department Management Routes
@router.post(
    "/departments", response_model=StaffDepartment, status_code=status.HTTP_201_CREATED
)
async def create_department(
    department_data: StaffDepartmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new staff department."""

    staff_service = StaffService(db)
    return staff_service.create_department(department_data)


@router.get("/departments", response_model=List[StaffDepartment])
async def get_departments(
    property_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all departments for a property."""

    staff_service = StaffService(db)
    return staff_service.get_departments(property_id, skip, limit)


@router.get("/departments/{department_id}", response_model=StaffDepartment)
async def get_department(
    department_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific department by ID."""

    staff_service = StaffService(db)
    department = staff_service.get_department(department_id)
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")
    return department


@router.put("/departments/{department_id}", response_model=StaffDepartment)
async def update_department(
    department_id: int,
    department_data: StaffDepartmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a department."""

    staff_service = StaffService(db)
    department = staff_service.update_department(department_id, department_data)
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")
    return department


@router.delete("/departments/{department_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_department(
    department_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a department."""

    staff_service = StaffService(db)
    if not staff_service.delete_department(department_id):
        raise HTTPException(status_code=404, detail="Department not found")


# Position Management Routes
@router.post(
    "/positions", response_model=StaffPosition, status_code=status.HTTP_201_CREATED
)
async def create_position(
    position_data: StaffPositionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new staff position."""

    staff_service = StaffService(db)
    return staff_service.create_position(position_data)


@router.get("/positions", response_model=List[StaffPosition])
async def get_positions(
    property_id: int,
    department_id: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all positions for a property, optionally filtered by department."""

    staff_service = StaffService(db)
    return staff_service.get_positions(property_id, department_id, skip, limit)


@router.get("/positions/{position_id}", response_model=StaffPosition)
async def get_position(
    position_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific position by ID."""

    staff_service = StaffService(db)
    position = staff_service.get_position(position_id)
    if not position:
        raise HTTPException(status_code=404, detail="Position not found")
    return position


@router.put("/positions/{position_id}", response_model=StaffPosition)
async def update_position(
    position_id: int,
    position_data: StaffPositionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a position."""

    staff_service = StaffService(db)
    position = staff_service.update_position(position_id, position_data)
    if not position:
        raise HTTPException(status_code=404, detail="Position not found")
    return position


@router.delete("/positions/{position_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_position(
    position_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a position."""

    staff_service = StaffService(db)
    if not staff_service.delete_position(position_id):
        raise HTTPException(status_code=404, detail="Position not found")


# Staff Profile Management Routes
@router.post(
    "/profiles", response_model=StaffProfile, status_code=status.HTTP_201_CREATED
)
async def create_staff_profile(
    profile_data: StaffProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new staff profile."""

    staff_service = StaffService(db)
    return staff_service.create_staff_profile(profile_data)


@router.get("/profiles", response_model=List[StaffProfileWithDetails])
async def get_staff_profiles(
    property_id: int,
    department_id: Optional[int] = Query(None),
    employment_status: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all staff profiles for a property with optional filters."""

    staff_service = StaffService(db)
    return staff_service.get_staff_profiles(
        property_id, department_id, employment_status, skip, limit
    )


@router.get("/profiles/{staff_id}", response_model=StaffProfileWithDetails)
async def get_staff_profile(
    staff_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific staff profile by ID."""

    staff_service = StaffService(db)
    profile = staff_service.get_staff_profile(staff_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Staff profile not found")
    return profile


@router.put("/profiles/{staff_id}", response_model=StaffProfile)
async def update_staff_profile(
    staff_id: str,
    profile_data: StaffProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a staff profile."""

    staff_service = StaffService(db)
    profile = staff_service.update_staff_profile(staff_id, profile_data)
    if not profile:
        raise HTTPException(status_code=404, detail="Staff profile not found")
    return profile


@router.delete("/profiles/{staff_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_staff_profile(
    staff_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a staff profile."""

    staff_service = StaffService(db)
    if not staff_service.delete_staff_profile(staff_id):
        raise HTTPException(status_code=404, detail="Staff profile not found")


# Schedule Management Routes
@router.post(
    "/schedules", response_model=StaffSchedule, status_code=status.HTTP_201_CREATED
)
async def create_schedule(
    schedule_data: StaffScheduleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new staff schedule."""

    staff_service = StaffService(db)
    return staff_service.create_schedule(schedule_data)


@router.get("/schedules", response_model=List[StaffScheduleWithDetails])
async def get_schedules(
    property_id: int,
    staff_id: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get staff schedules with optional filters."""

    staff_service = StaffService(db)
    return staff_service.get_schedules(
        property_id, staff_id, start_date, end_date, skip, limit
    )


@router.get("/schedules/{schedule_id}", response_model=StaffScheduleWithDetails)
async def get_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific schedule by ID."""

    staff_service = StaffService(db)
    schedule = staff_service.get_schedule(schedule_id)
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return schedule


@router.put("/schedules/{schedule_id}", response_model=StaffSchedule)
async def update_schedule(
    schedule_id: int,
    schedule_data: StaffScheduleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a schedule."""

    staff_service = StaffService(db)
    schedule = staff_service.update_schedule(schedule_id, schedule_data)
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return schedule


@router.delete("/schedules/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a schedule."""

    staff_service = StaffService(db)
    if not staff_service.delete_schedule(schedule_id):
        raise HTTPException(status_code=404, detail="Schedule not found")


# Attendance Management Routes
@router.post(
    "/attendance", response_model=StaffAttendance, status_code=status.HTTP_201_CREATED
)
async def create_attendance(
    attendance_data: StaffAttendanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new attendance record."""

    staff_service = StaffService(db)
    return staff_service.create_attendance(attendance_data)


@router.get("/attendance", response_model=List[StaffAttendanceWithDetails])
async def get_attendance(
    property_id: int,
    staff_id: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get attendance records with optional filters."""

    staff_service = StaffService(db)
    return staff_service.get_attendance(
        property_id, staff_id, start_date, end_date, skip, limit
    )


@router.get("/attendance/{attendance_id}", response_model=StaffAttendanceWithDetails)
async def get_attendance_record(
    attendance_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific attendance record by ID."""

    staff_service = StaffService(db)
    attendance = staff_service.get_attendance_record(attendance_id)
    if not attendance:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    return attendance


@router.put("/attendance/{attendance_id}", response_model=StaffAttendance)
async def update_attendance(
    attendance_id: int,
    attendance_data: StaffAttendanceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update an attendance record."""

    staff_service = StaffService(db)
    attendance = staff_service.update_attendance(attendance_id, attendance_data)
    if not attendance:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    return attendance


@router.delete("/attendance/{attendance_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_attendance(
    attendance_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete an attendance record."""

    staff_service = StaffService(db)
    if not staff_service.delete_attendance(attendance_id):
        raise HTTPException(status_code=404, detail="Attendance record not found")


# Task Management Routes
@router.post("/tasks", response_model=StaffTask, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: StaffTaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new staff task."""

    staff_service = StaffService(db)
    return staff_service.create_task(task_data)


@router.get("/tasks", response_model=List[StaffTaskWithDetails])
async def get_tasks(
    property_id: int,
    staff_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get staff tasks with optional filters."""

    staff_service = StaffService(db)
    return staff_service.get_tasks(property_id, staff_id, status, priority, skip, limit)


@router.get("/tasks/{task_id}", response_model=StaffTaskWithDetails)
async def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific task by ID."""

    staff_service = StaffService(db)
    task = staff_service.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.put("/tasks/{task_id}", response_model=StaffTask)
async def update_task(
    task_id: int,
    task_data: StaffTaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a task."""

    staff_service = StaffService(db)
    task = staff_service.update_task(task_id, task_data)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a task."""

    staff_service = StaffService(db)
    if not staff_service.delete_task(task_id):
        raise HTTPException(status_code=404, detail="Task not found")


# Performance Management Routes
@router.post(
    "/performance", response_model=StaffPerformance, status_code=status.HTTP_201_CREATED
)
async def create_performance_review(
    performance_data: StaffPerformanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new performance review."""

    staff_service = StaffService(db)
    return staff_service.create_performance_review(performance_data)


@router.get("/performance", response_model=List[StaffPerformanceWithDetails])
async def get_performance_reviews(
    property_id: int,
    staff_id: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get performance reviews with optional filters."""

    staff_service = StaffService(db)
    return staff_service.get_performance_reviews(property_id, staff_id, skip, limit)


@router.get("/performance/{performance_id}", response_model=StaffPerformanceWithDetails)
async def get_performance_review(
    performance_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific performance review by ID."""

    staff_service = StaffService(db)
    performance = staff_service.get_performance_review(performance_id)
    if not performance:
        raise HTTPException(status_code=404, detail="Performance review not found")
    return performance


@router.put("/performance/{performance_id}", response_model=StaffPerformance)
async def update_performance_review(
    performance_id: int,
    performance_data: StaffPerformanceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a performance review."""

    staff_service = StaffService(db)
    performance = staff_service.update_performance_review(
        performance_id, performance_data
    )
    if not performance:
        raise HTTPException(status_code=404, detail="Performance review not found")
    return performance


@router.delete("/performance/{performance_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_performance_review(
    performance_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a performance review."""

    staff_service = StaffService(db)
    if not staff_service.delete_performance_review(performance_id):
        raise HTTPException(status_code=404, detail="Performance review not found")


# Communication Management Routes
@router.post(
    "/communications",
    response_model=StaffCommunication,
    status_code=status.HTTP_201_CREATED,
)
async def create_communication(
    communication_data: StaffCommunicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new staff communication."""

    staff_service = StaffService(db)
    return staff_service.create_communication(communication_data)


@router.get("/communications", response_model=List[StaffCommunicationWithDetails])
async def get_communications(
    property_id: int,
    recipient_id: Optional[str] = Query(None),
    communication_type: Optional[str] = Query(None),
    is_read: Optional[bool] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get staff communications with optional filters."""

    staff_service = StaffService(db)
    return staff_service.get_communications(
        property_id, recipient_id, communication_type, is_read, skip, limit
    )


@router.get(
    "/communications/{communication_id}", response_model=StaffCommunicationWithDetails
)
async def get_communication(
    communication_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific communication by ID."""

    staff_service = StaffService(db)
    communication = staff_service.get_communication(communication_id)
    if not communication:
        raise HTTPException(status_code=404, detail="Communication not found")
    return communication


@router.put("/communications/{communication_id}", response_model=StaffCommunication)
async def update_communication(
    communication_id: int,
    communication_data: StaffCommunicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a communication."""

    staff_service = StaffService(db)
    communication = staff_service.update_communication(
        communication_id, communication_data
    )
    if not communication:
        raise HTTPException(status_code=404, detail="Communication not found")
    return communication


@router.delete(
    "/communications/{communication_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_communication(
    communication_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a communication."""

    staff_service = StaffService(db)
    if not staff_service.delete_communication(communication_id):
        raise HTTPException(status_code=404, detail="Communication not found")


# Leave Request Management Routes
@router.post(
    "/leave-requests",
    response_model=StaffLeaveRequest,
    status_code=status.HTTP_201_CREATED,
)
async def create_leave_request(
    leave_data: StaffLeaveRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new leave request."""

    staff_service = StaffService(db)
    return staff_service.create_leave_request(leave_data)


@router.get("/leave-requests", response_model=List[StaffLeaveRequestWithDetails])
async def get_leave_requests(
    property_id: int,
    staff_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    leave_type: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get leave requests with optional filters."""

    staff_service = StaffService(db)
    return staff_service.get_leave_requests(
        property_id, staff_id, status, leave_type, skip, limit
    )


@router.get(
    "/leave-requests/{leave_request_id}", response_model=StaffLeaveRequestWithDetails
)
async def get_leave_request(
    leave_request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific leave request by ID."""

    staff_service = StaffService(db)
    leave_request = staff_service.get_leave_request(leave_request_id)
    if not leave_request:
        raise HTTPException(status_code=404, detail="Leave request not found")
    return leave_request


@router.put("/leave-requests/{leave_request_id}", response_model=StaffLeaveRequest)
async def update_leave_request(
    leave_request_id: int,
    leave_data: StaffLeaveRequestUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a leave request."""

    staff_service = StaffService(db)
    leave_request = staff_service.update_leave_request(leave_request_id, leave_data)
    if not leave_request:
        raise HTTPException(status_code=404, detail="Leave request not found")
    return leave_request


@router.delete(
    "/leave-requests/{leave_request_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_leave_request(
    leave_request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a leave request."""

    staff_service = StaffService(db)
    if not staff_service.delete_leave_request(leave_request_id):
        raise HTTPException(status_code=404, detail="Leave request not found")


# Analytics and Reporting Routes
@router.get("/analytics")
async def get_staff_analytics(
    property_id: int,
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get staff analytics and metrics."""

    staff_service = StaffService(db)
    return staff_service.get_staff_analytics(property_id, start_date, end_date)

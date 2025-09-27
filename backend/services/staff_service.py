"""
Staff management service for The Shandi platform.
"""
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_, func, desc, asc
from typing import List, Optional, Dict, Any
from datetime import datetime, date, time, timedelta
from decimal import Decimal

from models.staff import (
    StaffDepartment, StaffPosition, StaffProfile, StaffSchedule,
    StaffAttendance, StaffTask, StaffPerformance, StaffCommunication, StaffLeaveRequest
)
from models.hospitality_property import HospitalityProperty
from models.user import User
from schemas.staff import (
    StaffDepartmentCreate, StaffDepartmentUpdate,
    StaffPositionCreate, StaffPositionUpdate,
    StaffProfileCreate, StaffProfileUpdate,
    StaffScheduleCreate, StaffScheduleUpdate,
    StaffAttendanceCreate, StaffAttendanceUpdate,
    StaffTaskCreate, StaffTaskUpdate,
    StaffPerformanceCreate, StaffPerformanceUpdate,
    StaffCommunicationCreate, StaffCommunicationUpdate,
    StaffLeaveRequestCreate, StaffLeaveRequestUpdate
)


class StaffService:
    def __init__(self, db: Session):
        self.db = db

    # Department Management
    def create_department(self, department_data: StaffDepartmentCreate) -> StaffDepartment:
        """Create a new staff department."""
        department = StaffDepartment(**department_data.dict())
        self.db.add(department)
        self.db.commit()
        self.db.refresh(department)
        return department

    def get_departments(self, property_id: int, skip: int = 0, limit: int = 100) -> List[StaffDepartment]:
        """Get all departments for a property."""
        return self.db.query(StaffDepartment)\
            .filter(and_(
                StaffDepartment.property_id == property_id,
                StaffDepartment.is_active == True
            ))\
            .offset(skip)\
            .limit(limit)\
            .all()

    def get_department(self, department_id: int) -> Optional[StaffDepartment]:
        """Get a specific department by ID."""
        return self.db.query(StaffDepartment)\
            .filter(StaffDepartment.department_id == department_id)\
            .first()

    def update_department(self, department_id: int, department_data: StaffDepartmentUpdate) -> Optional[StaffDepartment]:
        """Update a department."""
        department = self.get_department(department_id)
        if not department:
            return None
        
        update_data = department_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(department, field, value)
        
        department.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(department)
        return department

    def delete_department(self, department_id: int) -> bool:
        """Delete a department (soft delete)."""
        department = self.get_department(department_id)
        if not department:
            return False
        
        department.is_active = False
        department.updated_at = datetime.utcnow()
        self.db.commit()
        return True

    # Position Management
    def create_position(self, position_data: StaffPositionCreate) -> StaffPosition:
        """Create a new staff position."""
        position = StaffPosition(**position_data.dict())
        self.db.add(position)
        self.db.commit()
        self.db.refresh(position)
        return position

    def get_positions(self, property_id: int, department_id: Optional[int] = None, skip: int = 0, limit: int = 100) -> List[StaffPosition]:
        """Get all positions for a property, optionally filtered by department."""
        query = self.db.query(StaffPosition)\
            .filter(and_(
                StaffPosition.property_id == property_id,
                StaffPosition.is_active == True
            ))
        
        if department_id:
            query = query.filter(StaffPosition.department_id == department_id)
        
        return query.offset(skip).limit(limit).all()

    def get_position(self, position_id: int) -> Optional[StaffPosition]:
        """Get a specific position by ID."""
        return self.db.query(StaffPosition)\
            .filter(StaffPosition.position_id == position_id)\
            .first()

    def update_position(self, position_id: int, position_data: StaffPositionUpdate) -> Optional[StaffPosition]:
        """Update a position."""
        position = self.get_position(position_id)
        if not position:
            return None
        
        update_data = position_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(position, field, value)
        
        position.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(position)
        return position

    def delete_position(self, position_id: int) -> bool:
        """Delete a position (soft delete)."""
        position = self.get_position(position_id)
        if not position:
            return False
        
        position.is_active = False
        position.updated_at = datetime.utcnow()
        self.db.commit()
        return True

    # Staff Profile Management
    def create_staff_profile(self, profile_data: StaffProfileCreate) -> StaffProfile:
        """Create a new staff profile."""
        profile = StaffProfile(**profile_data.dict())
        self.db.add(profile)
        self.db.commit()
        self.db.refresh(profile)
        return profile

    def get_staff_profiles(self, property_id: int, department_id: Optional[int] = None, 
                          employment_status: Optional[str] = None, skip: int = 0, limit: int = 100) -> List[StaffProfile]:
        """Get all staff profiles for a property with optional filters."""
        query = self.db.query(StaffProfile)\
            .options(
                joinedload(StaffProfile.department),
                joinedload(StaffProfile.position),
                joinedload(StaffProfile.user)
            )\
            .filter(and_(
                StaffProfile.property_id == property_id,
                StaffProfile.is_active == True
            ))
        
        if department_id:
            query = query.filter(StaffProfile.department_id == department_id)
        
        if employment_status:
            query = query.filter(StaffProfile.employment_status == employment_status)
        
        return query.offset(skip).limit(limit).all()

    def get_staff_profile(self, staff_id: str) -> Optional[StaffProfile]:
        """Get a specific staff profile by ID."""
        return self.db.query(StaffProfile)\
            .options(
                joinedload(StaffProfile.department),
                joinedload(StaffProfile.position),
                joinedload(StaffProfile.user)
            )\
            .filter(StaffProfile.staff_id == staff_id)\
            .first()

    def update_staff_profile(self, staff_id: str, profile_data: StaffProfileUpdate) -> Optional[StaffProfile]:
        """Update a staff profile."""
        profile = self.get_staff_profile(staff_id)
        if not profile:
            return None
        
        update_data = profile_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(profile, field, value)
        
        profile.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(profile)
        return profile

    def delete_staff_profile(self, staff_id: str) -> bool:
        """Delete a staff profile (soft delete)."""
        profile = self.get_staff_profile(staff_id)
        if not profile:
            return False
        
        profile.is_active = False
        profile.updated_at = datetime.utcnow()
        self.db.commit()
        return True

    # Schedule Management
    def create_schedule(self, schedule_data: StaffScheduleCreate) -> StaffSchedule:
        """Create a new staff schedule."""
        schedule = StaffSchedule(**schedule_data.dict())
        self.db.add(schedule)
        self.db.commit()
        self.db.refresh(schedule)
        return schedule

    def get_schedules(self, property_id: int, staff_id: Optional[str] = None, 
                     start_date: Optional[date] = None, end_date: Optional[date] = None,
                     skip: int = 0, limit: int = 100) -> List[StaffSchedule]:
        """Get staff schedules with optional filters."""
        query = self.db.query(StaffSchedule)\
            .options(joinedload(StaffSchedule.staff))\
            .filter(StaffSchedule.property_id == property_id)
        
        if staff_id:
            query = query.filter(StaffSchedule.staff_id == staff_id)
        
        if start_date:
            query = query.filter(StaffSchedule.schedule_date >= start_date)
        
        if end_date:
            query = query.filter(StaffSchedule.schedule_date <= end_date)
        
        return query.order_by(StaffSchedule.schedule_date, StaffSchedule.start_time)\
            .offset(skip).limit(limit).all()

    def get_schedule(self, schedule_id: int) -> Optional[StaffSchedule]:
        """Get a specific schedule by ID."""
        return self.db.query(StaffSchedule)\
            .options(joinedload(StaffSchedule.staff))\
            .filter(StaffSchedule.schedule_id == schedule_id)\
            .first()

    def update_schedule(self, schedule_id: int, schedule_data: StaffScheduleUpdate) -> Optional[StaffSchedule]:
        """Update a schedule."""
        schedule = self.get_schedule(schedule_id)
        if not schedule:
            return None
        
        update_data = schedule_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(schedule, field, value)
        
        schedule.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(schedule)
        return schedule

    def delete_schedule(self, schedule_id: int) -> bool:
        """Delete a schedule."""
        schedule = self.get_schedule(schedule_id)
        if not schedule:
            return False
        
        self.db.delete(schedule)
        self.db.commit()
        return True

    # Attendance Management
    def create_attendance(self, attendance_data: StaffAttendanceCreate) -> StaffAttendance:
        """Create a new attendance record."""
        attendance = StaffAttendance(**attendance_data.dict())
        self.db.add(attendance)
        self.db.commit()
        self.db.refresh(attendance)
        return attendance

    def get_attendance(self, property_id: int, staff_id: Optional[str] = None,
                      start_date: Optional[date] = None, end_date: Optional[date] = None,
                      skip: int = 0, limit: int = 100) -> List[StaffAttendance]:
        """Get attendance records with optional filters."""
        query = self.db.query(StaffAttendance)\
            .options(
                joinedload(StaffAttendance.staff),
                joinedload(StaffAttendance.schedule)
            )\
            .filter(StaffAttendance.property_id == property_id)
        
        if staff_id:
            query = query.filter(StaffAttendance.staff_id == staff_id)
        
        if start_date:
            query = query.filter(func.date(StaffAttendance.created_at) >= start_date)
        
        if end_date:
            query = query.filter(func.date(StaffAttendance.created_at) <= end_date)
        
        return query.order_by(desc(StaffAttendance.created_at))\
            .offset(skip).limit(limit).all()

    def get_attendance_record(self, attendance_id: int) -> Optional[StaffAttendance]:
        """Get a specific attendance record by ID."""
        return self.db.query(StaffAttendance)\
            .options(
                joinedload(StaffAttendance.staff),
                joinedload(StaffAttendance.schedule)
            )\
            .filter(StaffAttendance.attendance_id == attendance_id)\
            .first()

    def update_attendance(self, attendance_id: int, attendance_data: StaffAttendanceUpdate) -> Optional[StaffAttendance]:
        """Update an attendance record."""
        attendance = self.get_attendance_record(attendance_id)
        if not attendance:
            return None
        
        update_data = attendance_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(attendance, field, value)
        
        # Calculate total hours worked if check-in and check-out times are provided
        if attendance.check_in_time and attendance.check_out_time:
            time_diff = attendance.check_out_time - attendance.check_in_time
            total_minutes = time_diff.total_seconds() / 60
            
            # Subtract break time if provided
            if attendance.break_start_time and attendance.break_end_time:
                break_diff = attendance.break_end_time - attendance.break_start_time
                break_minutes = break_diff.total_seconds() / 60
                total_minutes -= break_minutes
            
            attendance.total_hours_worked = Decimal(str(round(total_minutes / 60, 2)))
        
        attendance.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(attendance)
        return attendance

    def delete_attendance(self, attendance_id: int) -> bool:
        """Delete an attendance record."""
        attendance = self.get_attendance_record(attendance_id)
        if not attendance:
            return False
        
        self.db.delete(attendance)
        self.db.commit()
        return True

    # Task Management
    def create_task(self, task_data: StaffTaskCreate) -> StaffTask:
        """Create a new staff task."""
        task = StaffTask(**task_data.dict())
        self.db.add(task)
        self.db.commit()
        self.db.refresh(task)
        return task

    def get_tasks(self, property_id: int, staff_id: Optional[str] = None,
                 status: Optional[str] = None, priority: Optional[str] = None,
                 skip: int = 0, limit: int = 100) -> List[StaffTask]:
        """Get staff tasks with optional filters."""
        query = self.db.query(StaffTask)\
            .options(joinedload(StaffTask.staff))\
            .filter(StaffTask.property_id == property_id)
        
        if staff_id:
            query = query.filter(StaffTask.assigned_to == staff_id)
        
        if status:
            query = query.filter(StaffTask.status == status)
        
        if priority:
            query = query.filter(StaffTask.priority == priority)
        
        return query.order_by(desc(StaffTask.created_at))\
            .offset(skip).limit(limit).all()

    def get_task(self, task_id: int) -> Optional[StaffTask]:
        """Get a specific task by ID."""
        return self.db.query(StaffTask)\
            .options(joinedload(StaffTask.staff))\
            .filter(StaffTask.task_id == task_id)\
            .first()

    def update_task(self, task_id: int, task_data: StaffTaskUpdate) -> Optional[StaffTask]:
        """Update a task."""
        task = self.get_task(task_id)
        if not task:
            return None
        
        update_data = task_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)
        
        # Set completion time if status is changed to completed
        if task_data.status == "completed" and not task.completed_at:
            task.completed_at = datetime.utcnow()
        
        task.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(task)
        return task

    def delete_task(self, task_id: int) -> bool:
        """Delete a task."""
        task = self.get_task(task_id)
        if not task:
            return False
        
        self.db.delete(task)
        self.db.commit()
        return True

    # Performance Management
    def create_performance_review(self, performance_data: StaffPerformanceCreate) -> StaffPerformance:
        """Create a new performance review."""
        performance = StaffPerformance(**performance_data.dict())
        self.db.add(performance)
        self.db.commit()
        self.db.refresh(performance)
        return performance

    def get_performance_reviews(self, property_id: int, staff_id: Optional[str] = None,
                               skip: int = 0, limit: int = 100) -> List[StaffPerformance]:
        """Get performance reviews with optional filters."""
        query = self.db.query(StaffPerformance)\
            .options(joinedload(StaffPerformance.staff))\
            .filter(and_(
                StaffPerformance.property_id == property_id,
                StaffPerformance.is_active == True
            ))
        
        if staff_id:
            query = query.filter(StaffPerformance.staff_id == staff_id)
        
        return query.order_by(desc(StaffPerformance.created_at))\
            .offset(skip).limit(limit).all()

    def get_performance_review(self, performance_id: int) -> Optional[StaffPerformance]:
        """Get a specific performance review by ID."""
        return self.db.query(StaffPerformance)\
            .options(joinedload(StaffPerformance.staff))\
            .filter(StaffPerformance.performance_id == performance_id)\
            .first()

    def update_performance_review(self, performance_id: int, performance_data: StaffPerformanceUpdate) -> Optional[StaffPerformance]:
        """Update a performance review."""
        performance = self.get_performance_review(performance_id)
        if not performance:
            return None
        
        update_data = performance_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(performance, field, value)
        
        performance.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(performance)
        return performance

    def delete_performance_review(self, performance_id: int) -> bool:
        """Delete a performance review (soft delete)."""
        performance = self.get_performance_review(performance_id)
        if not performance:
            return False
        
        performance.is_active = False
        performance.updated_at = datetime.utcnow()
        self.db.commit()
        return True

    # Communication Management
    def create_communication(self, communication_data: StaffCommunicationCreate) -> StaffCommunication:
        """Create a new staff communication."""
        communication = StaffCommunication(**communication_data.dict())
        self.db.add(communication)
        self.db.commit()
        self.db.refresh(communication)
        return communication

    def get_communications(self, property_id: int, recipient_id: Optional[str] = None,
                          communication_type: Optional[str] = None, is_read: Optional[bool] = None,
                          skip: int = 0, limit: int = 100) -> List[StaffCommunication]:
        """Get staff communications with optional filters."""
        query = self.db.query(StaffCommunication)\
            .options(
                joinedload(StaffCommunication.sender),
                joinedload(StaffCommunication.staff)
            )\
            .filter(StaffCommunication.property_id == property_id)
        
        if recipient_id:
            query = query.filter(StaffCommunication.recipient_id == recipient_id)
        
        if communication_type:
            query = query.filter(StaffCommunication.communication_type == communication_type)
        
        if is_read is not None:
            query = query.filter(StaffCommunication.is_read == is_read)
        
        return query.order_by(desc(StaffCommunication.created_at))\
            .offset(skip).limit(limit).all()

    def get_communication(self, communication_id: int) -> Optional[StaffCommunication]:
        """Get a specific communication by ID."""
        return self.db.query(StaffCommunication)\
            .options(
                joinedload(StaffCommunication.sender),
                joinedload(StaffCommunication.staff)
            )\
            .filter(StaffCommunication.communication_id == communication_id)\
            .first()

    def update_communication(self, communication_id: int, communication_data: StaffCommunicationUpdate) -> Optional[StaffCommunication]:
        """Update a communication."""
        communication = self.get_communication(communication_id)
        if not communication:
            return None
        
        update_data = communication_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(communication, field, value)
        
        # Set read time if marked as read
        if communication_data.is_read and not communication.read_at:
            communication.read_at = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(communication)
        return communication

    def delete_communication(self, communication_id: int) -> bool:
        """Delete a communication."""
        communication = self.get_communication(communication_id)
        if not communication:
            return False
        
        self.db.delete(communication)
        self.db.commit()
        return True

    # Leave Request Management
    def create_leave_request(self, leave_data: StaffLeaveRequestCreate) -> StaffLeaveRequest:
        """Create a new leave request."""
        leave_request = StaffLeaveRequest(**leave_data.dict())
        self.db.add(leave_request)
        self.db.commit()
        self.db.refresh(leave_request)
        return leave_request

    def get_leave_requests(self, property_id: int, staff_id: Optional[str] = None,
                          status: Optional[str] = None, leave_type: Optional[str] = None,
                          skip: int = 0, limit: int = 100) -> List[StaffLeaveRequest]:
        """Get leave requests with optional filters."""
        query = self.db.query(StaffLeaveRequest)\
            .options(joinedload(StaffLeaveRequest.staff))\
            .filter(StaffLeaveRequest.property_id == property_id)
        
        if staff_id:
            query = query.filter(StaffLeaveRequest.staff_id == staff_id)
        
        if status:
            query = query.filter(StaffLeaveRequest.status == status)
        
        if leave_type:
            query = query.filter(StaffLeaveRequest.leave_type == leave_type)
        
        return query.order_by(desc(StaffLeaveRequest.requested_at))\
            .offset(skip).limit(limit).all()

    def get_leave_request(self, leave_request_id: int) -> Optional[StaffLeaveRequest]:
        """Get a specific leave request by ID."""
        return self.db.query(StaffLeaveRequest)\
            .options(joinedload(StaffLeaveRequest.staff))\
            .filter(StaffLeaveRequest.leave_request_id == leave_request_id)\
            .first()

    def update_leave_request(self, leave_request_id: int, leave_data: StaffLeaveRequestUpdate) -> Optional[StaffLeaveRequest]:
        """Update a leave request."""
        leave_request = self.get_leave_request(leave_request_id)
        if not leave_request:
            return None
        
        update_data = leave_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(leave_request, field, value)
        
        # Set review time if status is changed from pending
        if leave_data.status and leave_data.status != "pending" and not leave_request.reviewed_at:
            leave_request.reviewed_at = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(leave_request)
        return leave_request

    def delete_leave_request(self, leave_request_id: int) -> bool:
        """Delete a leave request."""
        leave_request = self.get_leave_request(leave_request_id)
        if not leave_request:
            return False
        
        self.db.delete(leave_request)
        self.db.commit()
        return True

    # Analytics and Reporting
    def get_staff_analytics(self, property_id: int, start_date: Optional[date] = None, end_date: Optional[date] = None) -> Dict[str, Any]:
        """Get staff analytics and metrics."""
        # Total staff count
        total_staff = self.db.query(StaffProfile)\
            .filter(and_(
                StaffProfile.property_id == property_id,
                StaffProfile.is_active == True
            ))\
            .count()
        
        # Active staff count
        active_staff = self.db.query(StaffProfile)\
            .filter(and_(
                StaffProfile.property_id == property_id,
                StaffProfile.is_active == True,
                StaffProfile.employment_status == "active"
            ))\
            .count()
        
        # Department distribution
        department_stats = self.db.query(
            StaffDepartment.department_name,
            func.count(StaffProfile.staff_id).label('staff_count')
        )\
        .join(StaffProfile, StaffDepartment.department_id == StaffProfile.department_id)\
        .filter(and_(
            StaffDepartment.property_id == property_id,
            StaffProfile.is_active == True
        ))\
        .group_by(StaffDepartment.department_name)\
        .all()
        
        # Attendance summary
        attendance_query = self.db.query(StaffAttendance)\
            .filter(StaffAttendance.property_id == property_id)
        
        if start_date:
            attendance_query = attendance_query.filter(func.date(StaffAttendance.created_at) >= start_date)
        if end_date:
            attendance_query = attendance_query.filter(func.date(StaffAttendance.created_at) <= end_date)
        
        attendance_records = attendance_query.all()
        
        attendance_summary = {
            "total_records": len(attendance_records),
            "present": len([r for r in attendance_records if r.status == "present"]),
            "absent": len([r for r in attendance_records if r.status == "absent"]),
            "late": len([r for r in attendance_records if r.status == "late"]),
            "total_hours": sum([r.total_hours_worked or 0 for r in attendance_records]),
            "overtime_hours": sum([r.overtime_hours or 0 for r in attendance_records])
        }
        
        return {
            "total_staff": total_staff,
            "active_staff": active_staff,
            "department_distribution": [{"department": d.department_name, "count": d.staff_count} for d in department_stats],
            "attendance_summary": attendance_summary
        }

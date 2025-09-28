"""
Staff management schemas for Buffr Host platform.
"""
from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, validator


# Base schemas
class StaffDepartmentBase(BaseModel):
    department_name: str = Field(..., max_length=100)
    description: Optional[str] = None
    manager_id: Optional[str] = None
    is_active: bool = True


class StaffDepartmentCreate(StaffDepartmentBase):
    property_id: int


class StaffDepartmentUpdate(BaseModel):
    department_name: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    manager_id: Optional[str] = None
    is_active: Optional[bool] = None


class StaffDepartment(StaffDepartmentBase):
    department_id: int
    property_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Staff Position schemas
class StaffPositionBase(BaseModel):
    position_name: str = Field(..., max_length=100)
    description: Optional[str] = None
    hourly_rate: Optional[Decimal] = None
    salary_range_min: Optional[Decimal] = None
    salary_range_max: Optional[Decimal] = None
    required_skills: Optional[List[str]] = None
    responsibilities: Optional[List[str]] = None
    is_active: bool = True


class StaffPositionCreate(StaffPositionBase):
    property_id: int
    department_id: int


class StaffPositionUpdate(BaseModel):
    position_name: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    hourly_rate: Optional[Decimal] = None
    salary_range_min: Optional[Decimal] = None
    salary_range_max: Optional[Decimal] = None
    required_skills: Optional[List[str]] = None
    responsibilities: Optional[List[str]] = None
    is_active: Optional[bool] = None


class StaffPosition(StaffPositionBase):
    position_id: int
    property_id: int
    department_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Staff Profile schemas
class StaffProfileBase(BaseModel):
    employee_id: Optional[str] = Field(None, max_length=50)
    department_id: Optional[int] = None
    position_id: Optional[int] = None
    hire_date: date
    employment_type: str = Field(
        default="full_time", pattern="^(full_time|part_time|contract|temporary)$"
    )
    employment_status: str = Field(
        default="active", pattern="^(active|inactive|terminated|on_leave)$"
    )
    phone: Optional[str] = Field(None, max_length=20)
    emergency_contact_name: Optional[str] = Field(None, max_length=255)
    emergency_contact_phone: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = None
    date_of_birth: Optional[date] = None
    national_id: Optional[str] = Field(None, max_length=50)
    tax_id: Optional[str] = Field(None, max_length=50)
    bank_account: Optional[str] = Field(None, max_length=50)
    skills: Optional[List[str]] = None
    certifications: Optional[List[str]] = None
    notes: Optional[str] = None
    is_active: bool = True


class StaffProfileCreate(StaffProfileBase):
    staff_id: str = Field(..., max_length=255)
    property_id: int


class StaffProfileUpdate(BaseModel):
    employee_id: Optional[str] = Field(None, max_length=50)
    department_id: Optional[int] = None
    position_id: Optional[int] = None
    employment_type: Optional[str] = Field(
        None, pattern="^(full_time|part_time|contract|temporary)$"
    )
    employment_status: Optional[str] = Field(
        None, pattern="^(active|inactive|terminated|on_leave)$"
    )
    phone: Optional[str] = Field(None, max_length=20)
    emergency_contact_name: Optional[str] = Field(None, max_length=255)
    emergency_contact_phone: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = None
    date_of_birth: Optional[date] = None
    national_id: Optional[str] = Field(None, max_length=50)
    tax_id: Optional[str] = Field(None, max_length=50)
    bank_account: Optional[str] = Field(None, max_length=50)
    skills: Optional[List[str]] = None
    certifications: Optional[List[str]] = None
    notes: Optional[str] = None
    is_active: Optional[bool] = None


class StaffProfile(StaffProfileBase):
    staff_id: str
    property_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Staff Schedule schemas
class StaffScheduleBase(BaseModel):
    schedule_date: date
    start_time: time
    end_time: time
    break_duration: int = Field(default=30, ge=0, le=480)  # 0-8 hours in minutes
    shift_type: str = Field(
        default="regular", pattern="^(regular|overtime|holiday|on_call)$"
    )
    status: str = Field(
        default="scheduled",
        pattern="^(scheduled|confirmed|completed|cancelled|no_show)$",
    )
    notes: Optional[str] = None


class StaffScheduleCreate(StaffScheduleBase):
    staff_id: str = Field(..., max_length=255)
    property_id: int
    created_by: Optional[str] = None


class StaffScheduleUpdate(BaseModel):
    schedule_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    break_duration: Optional[int] = Field(None, ge=0, le=480)
    shift_type: Optional[str] = Field(
        None, pattern="^(regular|overtime|holiday|on_call)$"
    )
    status: Optional[str] = Field(
        None, pattern="^(scheduled|confirmed|completed|cancelled|no_show)$"
    )
    notes: Optional[str] = None


class StaffSchedule(StaffScheduleBase):
    schedule_id: int
    staff_id: str
    property_id: int
    created_by: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Staff Attendance schemas
class StaffAttendanceBase(BaseModel):
    check_in_time: Optional[datetime] = None
    check_out_time: Optional[datetime] = None
    break_start_time: Optional[datetime] = None
    break_end_time: Optional[datetime] = None
    total_hours_worked: Optional[Decimal] = None
    overtime_hours: Decimal = Field(default=0, ge=0)
    status: str = Field(
        default="present",
        pattern="^(present|absent|late|early_departure|sick_leave|vacation)$",
    )
    notes: Optional[str] = None


class StaffAttendanceCreate(StaffAttendanceBase):
    staff_id: str = Field(..., max_length=255)
    property_id: int
    schedule_id: Optional[int] = None
    approved_by: Optional[str] = None


class StaffAttendanceUpdate(BaseModel):
    check_in_time: Optional[datetime] = None
    check_out_time: Optional[datetime] = None
    break_start_time: Optional[datetime] = None
    break_end_time: Optional[datetime] = None
    total_hours_worked: Optional[Decimal] = None
    overtime_hours: Optional[Decimal] = Field(None, ge=0)
    status: Optional[str] = Field(
        None, pattern="^(present|absent|late|early_departure|sick_leave|vacation)$"
    )
    notes: Optional[str] = None
    approved_by: Optional[str] = None


class StaffAttendance(StaffAttendanceBase):
    attendance_id: int
    staff_id: str
    property_id: int
    schedule_id: Optional[int] = None
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Staff Task schemas
class StaffTaskBase(BaseModel):
    task_title: str = Field(..., max_length=255)
    task_description: Optional[str] = None
    task_type: str = Field(
        default="general",
        pattern="^(cleaning|maintenance|guest_service|kitchen|front_desk|general)$",
    )
    priority: str = Field(default="medium", pattern="^(low|medium|high|urgent)$")
    status: str = Field(
        default="assigned",
        pattern="^(assigned|in_progress|completed|cancelled|overdue)$",
    )
    due_date: Optional[datetime] = None
    estimated_duration: Optional[int] = Field(None, ge=1)  # minutes
    actual_duration: Optional[int] = Field(None, ge=0)  # minutes
    notes: Optional[str] = None


class StaffTaskCreate(StaffTaskBase):
    assigned_to: str = Field(..., max_length=255)
    property_id: int
    assigned_by: Optional[str] = None


class StaffTaskUpdate(BaseModel):
    task_title: Optional[str] = Field(None, max_length=255)
    task_description: Optional[str] = None
    task_type: Optional[str] = Field(
        None,
        pattern="^(cleaning|maintenance|guest_service|kitchen|front_desk|general)$",
    )
    priority: Optional[str] = Field(None, pattern="^(low|medium|high|urgent)$")
    status: Optional[str] = Field(
        None, pattern="^(assigned|in_progress|completed|cancelled|overdue)$"
    )
    due_date: Optional[datetime] = None
    estimated_duration: Optional[int] = Field(None, ge=1)
    actual_duration: Optional[int] = Field(None, ge=0)
    notes: Optional[str] = None


class StaffTask(StaffTaskBase):
    task_id: int
    property_id: int
    assigned_to: str
    assigned_by: Optional[str] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Staff Performance schemas
class StaffPerformanceBase(BaseModel):
    review_period_start: date
    review_period_end: date
    overall_rating: Optional[int] = Field(None, ge=1, le=5)
    punctuality_rating: Optional[int] = Field(None, ge=1, le=5)
    work_quality_rating: Optional[int] = Field(None, ge=1, le=5)
    teamwork_rating: Optional[int] = Field(None, ge=1, le=5)
    customer_service_rating: Optional[int] = Field(None, ge=1, le=5)
    strengths: Optional[str] = None
    areas_for_improvement: Optional[str] = None
    goals: Optional[str] = None
    comments: Optional[str] = None
    is_active: bool = True


class StaffPerformanceCreate(StaffPerformanceBase):
    staff_id: str = Field(..., max_length=255)
    property_id: int
    reviewed_by: Optional[str] = None


class StaffPerformanceUpdate(BaseModel):
    review_period_start: Optional[date] = None
    review_period_end: Optional[date] = None
    overall_rating: Optional[int] = Field(None, ge=1, le=5)
    punctuality_rating: Optional[int] = Field(None, ge=1, le=5)
    work_quality_rating: Optional[int] = Field(None, ge=1, le=5)
    teamwork_rating: Optional[int] = Field(None, ge=1, le=5)
    customer_service_rating: Optional[int] = Field(None, ge=1, le=5)
    strengths: Optional[str] = None
    areas_for_improvement: Optional[str] = None
    goals: Optional[str] = None
    comments: Optional[str] = None
    is_active: Optional[bool] = None


class StaffPerformance(StaffPerformanceBase):
    performance_id: int
    staff_id: str
    property_id: int
    reviewed_by: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Staff Communication schemas
class StaffCommunicationBase(BaseModel):
    recipient_id: str = Field(..., max_length=255)
    subject: str = Field(..., max_length=255)
    message: str
    communication_type: str = Field(
        default="message", pattern="^(message|announcement|alert|reminder)$"
    )
    priority: str = Field(default="normal", pattern="^(low|normal|high|urgent)$")


class StaffCommunicationCreate(StaffCommunicationBase):
    property_id: int
    sender_id: Optional[str] = None


class StaffCommunicationUpdate(BaseModel):
    subject: Optional[str] = Field(None, max_length=255)
    message: Optional[str] = None
    communication_type: Optional[str] = Field(
        None, pattern="^(message|announcement|alert|reminder)$"
    )
    priority: Optional[str] = Field(None, pattern="^(low|normal|high|urgent)$")
    is_read: Optional[bool] = None


class StaffCommunication(StaffCommunicationBase):
    communication_id: int
    property_id: int
    sender_id: Optional[str] = None
    is_read: bool = False
    read_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Staff Leave Request schemas
class StaffLeaveRequestBase(BaseModel):
    leave_type: str = Field(
        ..., pattern="^(vacation|sick_leave|personal|emergency|maternity|paternity)$"
    )
    start_date: date
    end_date: date
    total_days: int = Field(..., ge=1)
    reason: Optional[str] = None


class StaffLeaveRequestCreate(StaffLeaveRequestBase):
    staff_id: str = Field(..., max_length=255)
    property_id: int

    @validator("end_date")
    def end_date_must_be_after_start_date(cls, v, values):
        if "start_date" in values and v <= values["start_date"]:
            raise ValueError("End date must be after start date")
        return v


class StaffLeaveRequestUpdate(BaseModel):
    leave_type: Optional[str] = Field(
        None, pattern="^(vacation|sick_leave|personal|emergency|maternity|paternity)$"
    )
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    total_days: Optional[int] = Field(None, ge=1)
    reason: Optional[str] = None
    status: Optional[str] = Field(
        None, pattern="^(pending|approved|rejected|cancelled)$"
    )
    review_notes: Optional[str] = None


class StaffLeaveRequest(StaffLeaveRequestBase):
    leave_request_id: int
    staff_id: str
    property_id: int
    status: str = "pending"
    requested_at: datetime
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    review_notes: Optional[str] = None

    class Config:
        from_attributes = True


# Response schemas with relationships
class StaffProfileWithDetails(StaffProfile):
    department: Optional[StaffDepartment] = None
    position: Optional[StaffPosition] = None
    user: Optional[Dict[str, Any]] = None


class StaffScheduleWithDetails(StaffSchedule):
    staff: Optional[StaffProfile] = None


class StaffAttendanceWithDetails(StaffAttendance):
    staff: Optional[StaffProfile] = None
    schedule: Optional[StaffSchedule] = None


class StaffTaskWithDetails(StaffTask):
    staff: Optional[StaffProfile] = None
    assigner: Optional[Dict[str, Any]] = None


class StaffPerformanceWithDetails(StaffPerformance):
    staff: Optional[StaffProfile] = None
    reviewer: Optional[Dict[str, Any]] = None


class StaffCommunicationWithDetails(StaffCommunication):
    sender: Optional[Dict[str, Any]] = None
    staff: Optional[StaffProfile] = None


class StaffLeaveRequestWithDetails(StaffLeaveRequest):
    staff: Optional[StaffProfile] = None
    reviewer: Optional[Dict[str, Any]] = None

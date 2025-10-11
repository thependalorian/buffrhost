"""
Staff management models for Buffr Host platform.
"""
import uuid
from sqlalchemy import (Boolean, CheckConstraint, Column, Date, DateTime,
                        ForeignKey, Integer, Numeric, String, Text, Time)
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class StaffUser(Base):
    """Staff user model - links users to staff roles"""
    __tablename__ = "staff_users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, unique=True)
    employee_id = Column(String(50), unique=True, nullable=False)
    department_id = Column(String, ForeignKey("staff_departments.id"))
    position_id = Column(String, ForeignKey("staff_positions.id"))
    hire_date = Column(DateTime(timezone=True), nullable=False)
    salary = Column(Numeric(10, 2))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id])
    department = relationship("StaffDepartment", foreign_keys=[department_id])
    position = relationship("StaffPosition", foreign_keys=[position_id])

class StaffDepartment(Base):
    __tablename__ = "staff_department"

    department_id = Column(Integer, primary_key=True, index=True)
    property_id = Column(
        Integer,
        ForeignKey("hospitality_property.property_id", ondelete="CASCADE"),
        nullable=False,
    )
    department_name = Column(String(100), nullable=False)
    description = Column(Text)
    manager_id = Column(String(255), ForeignKey("buffr_host_user.owner_id"))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    property = relationship("HospitalityProperty", back_populates="staff_departments")
    manager = relationship("User", foreign_keys=[manager_id])
    positions = relationship(
        "StaffPosition", back_populates="department", cascade="all, delete-orphan"
    )
    staff_profiles = relationship("StaffProfile", back_populates="department")


class StaffPosition(Base):
    __tablename__ = "staff_position"

    position_id = Column(Integer, primary_key=True, index=True)
    property_id = Column(
        Integer,
        ForeignKey("hospitality_property.property_id", ondelete="CASCADE"),
        nullable=False,
    )
    department_id = Column(
        Integer,
        ForeignKey("staff_department.department_id", ondelete="CASCADE"),
        nullable=False,
    )
    position_name = Column(String(100), nullable=False)
    description = Column(Text)
    hourly_rate = Column(Numeric(8, 2))
    salary_range_min = Column(Numeric(10, 2))
    salary_range_max = Column(Numeric(10, 2))
    required_skills = Column(ARRAY(String))
    responsibilities = Column(ARRAY(String))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    property = relationship("HospitalityProperty", back_populates="staff_positions")
    department = relationship("StaffDepartment", back_populates="positions")
    staff_profiles = relationship("StaffProfile", back_populates="position")


class StaffProfile(Base):
    __tablename__ = "staff_profile"

    staff_id = Column(
        String(255),
        ForeignKey("buffr_host_user.owner_id", ondelete="CASCADE"),
        primary_key=True,
    )
    employee_id = Column(String(50), unique=True, index=True)
    property_id = Column(
        Integer,
        ForeignKey("hospitality_property.property_id", ondelete="CASCADE"),
        nullable=False,
    )
    department_id = Column(Integer, ForeignKey("staff_department.department_id"))
    position_id = Column(Integer, ForeignKey("staff_position.position_id"))
    hire_date = Column(Date, nullable=False)
    employment_type = Column(
        String(20), default="full_time"
    )  # full_time, part_time, contract, temporary
    employment_status = Column(
        String(20), default="active"
    )  # active, inactive, terminated, on_leave
    phone = Column(String(20))
    emergency_contact_name = Column(String(255))
    emergency_contact_phone = Column(String(20))
    address = Column(Text)
    date_of_birth = Column(Date)
    national_id = Column(String(50))
    tax_id = Column(String(50))
    bank_account = Column(String(50))
    skills = Column(ARRAY(String))
    certifications = Column(ARRAY(String))
    notes = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", foreign_keys=[staff_id])
    property = relationship("HospitalityProperty", back_populates="staff_profiles")
    department = relationship("StaffDepartment", back_populates="staff_profiles")
    position = relationship("StaffPosition", back_populates="staff_profiles")
    schedules = relationship(
        "StaffSchedule", back_populates="staff", cascade="all, delete-orphan"
    )
    attendance = relationship(
        "StaffAttendance", back_populates="staff", cascade="all, delete-orphan"
    )
    tasks = relationship(
        "StaffTask", back_populates="staff", cascade="all, delete-orphan"
    )
    performance_reviews = relationship(
        "StaffPerformance", back_populates="staff", cascade="all, delete-orphan"
    )
    communications = relationship(
        "StaffCommunication", back_populates="staff", cascade="all, delete-orphan"
    )
    leave_requests = relationship(
        "StaffLeaveRequest", back_populates="staff", cascade="all, delete-orphan"
    )


class StaffSchedule(Base):
    __tablename__ = "staff_schedule"

    schedule_id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(
        String(255),
        ForeignKey("staff_profile.staff_id", ondelete="CASCADE"),
        nullable=False,
    )
    property_id = Column(
        Integer,
        ForeignKey("hospitality_property.property_id", ondelete="CASCADE"),
        nullable=False,
    )
    schedule_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    break_duration = Column(Integer, default=30)  # minutes
    shift_type = Column(
        String(20), default="regular"
    )  # regular, overtime, holiday, on_call
    status = Column(
        String(20), default="scheduled"
    )  # scheduled, confirmed, completed, cancelled, no_show
    notes = Column(Text)
    created_by = Column(String(255), ForeignKey("buffr_host_user.owner_id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    staff = relationship("StaffProfile", back_populates="schedules")
    property = relationship("HospitalityProperty", back_populates="staff_schedules")
    creator = relationship("User", foreign_keys=[created_by])
    attendance_records = relationship(
        "StaffAttendance", back_populates="schedule", cascade="all, delete-orphan"
    )


class StaffAttendance(Base):
    __tablename__ = "staff_attendance"

    attendance_id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(
        String(255),
        ForeignKey("staff_profile.staff_id", ondelete="CASCADE"),
        nullable=False,
    )
    property_id = Column(
        Integer,
        ForeignKey("hospitality_property.property_id", ondelete="CASCADE"),
        nullable=False,
    )
    schedule_id = Column(Integer, ForeignKey("staff_schedule.schedule_id"))
    check_in_time = Column(DateTime(timezone=True))
    check_out_time = Column(DateTime(timezone=True))
    break_start_time = Column(DateTime(timezone=True))
    break_end_time = Column(DateTime(timezone=True))
    total_hours_worked = Column(Numeric(4, 2))
    overtime_hours = Column(Numeric(4, 2), default=0)
    status = Column(
        String(20), default="present"
    )  # present, absent, late, early_departure, sick_leave, vacation
    notes = Column(Text)
    approved_by = Column(String(255), ForeignKey("buffr_host_user.owner_id"))
    approved_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    staff = relationship("StaffProfile", back_populates="attendance")
    property = relationship("HospitalityProperty", back_populates="staff_attendance")
    schedule = relationship("StaffSchedule", back_populates="attendance_records")
    approver = relationship("User", foreign_keys=[approved_by])


class StaffTask(Base):
    __tablename__ = "staff_task"

    task_id = Column(Integer, primary_key=True, index=True)
    property_id = Column(
        Integer,
        ForeignKey("hospitality_property.property_id", ondelete="CASCADE"),
        nullable=False,
    )
    assigned_to = Column(
        String(255),
        ForeignKey("staff_profile.staff_id", ondelete="CASCADE"),
        nullable=False,
    )
    assigned_by = Column(String(255), ForeignKey("buffr_host_user.owner_id"))
    task_title = Column(String(255), nullable=False)
    task_description = Column(Text)
    task_type = Column(
        String(50), default="general"
    )  # cleaning, maintenance, guest_service, kitchen, front_desk, general
    priority = Column(String(20), default="medium")  # low, medium, high, urgent
    status = Column(
        String(20), default="assigned"
    )  # assigned, in_progress, completed, cancelled, overdue
    due_date = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    estimated_duration = Column(Integer)  # minutes
    actual_duration = Column(Integer)  # minutes
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    property = relationship("HospitalityProperty", back_populates="staff_tasks")
    staff = relationship("StaffProfile", back_populates="tasks")
    assigner = relationship("User", foreign_keys=[assigned_by])


class StaffPerformance(Base):
    __tablename__ = "staff_performance"

    performance_id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(
        String(255),
        ForeignKey("staff_profile.staff_id", ondelete="CASCADE"),
        nullable=False,
    )
    property_id = Column(
        Integer,
        ForeignKey("hospitality_property.property_id", ondelete="CASCADE"),
        nullable=False,
    )
    review_period_start = Column(Date, nullable=False)
    review_period_end = Column(Date, nullable=False)
    reviewed_by = Column(String(255), ForeignKey("buffr_host_user.owner_id"))
    overall_rating = Column(
        Integer, CheckConstraint("overall_rating >= 1 AND overall_rating <= 5")
    )
    punctuality_rating = Column(
        Integer, CheckConstraint("punctuality_rating >= 1 AND punctuality_rating <= 5")
    )
    work_quality_rating = Column(
        Integer,
        CheckConstraint("work_quality_rating >= 1 AND work_quality_rating <= 5"),
    )
    teamwork_rating = Column(
        Integer, CheckConstraint("teamwork_rating >= 1 AND teamwork_rating <= 5")
    )
    customer_service_rating = Column(
        Integer,
        CheckConstraint(
            "customer_service_rating >= 1 AND customer_service_rating <= 5"
        ),
    )
    strengths = Column(Text)
    areas_for_improvement = Column(Text)
    goals = Column(Text)
    comments = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    staff = relationship("StaffProfile", back_populates="performance_reviews")
    property = relationship("HospitalityProperty", back_populates="staff_performance")
    reviewer = relationship("User", foreign_keys=[reviewed_by])


class StaffCommunication(Base):
    __tablename__ = "staff_communication"

    communication_id = Column(Integer, primary_key=True, index=True)
    property_id = Column(
        Integer,
        ForeignKey("hospitality_property.property_id", ondelete="CASCADE"),
        nullable=False,
    )
    sender_id = Column(String(255), ForeignKey("buffr_host_user.owner_id"))
    recipient_id = Column(String(255), ForeignKey("staff_profile.staff_id"))
    subject = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    communication_type = Column(
        String(20), default="message"
    )  # message, announcement, alert, reminder
    priority = Column(String(20), default="normal")  # low, normal, high, urgent
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    property = relationship(
        "HospitalityProperty", back_populates="staff_communications"
    )
    sender = relationship("User", foreign_keys=[sender_id])
    staff = relationship("StaffProfile", back_populates="communications")


class StaffLeaveRequest(Base):
    __tablename__ = "staff_leave_request"

    leave_request_id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(
        String(255),
        ForeignKey("staff_profile.staff_id", ondelete="CASCADE"),
        nullable=False,
    )
    property_id = Column(
        Integer,
        ForeignKey("hospitality_property.property_id", ondelete="CASCADE"),
        nullable=False,
    )
    leave_type = Column(
        String(20), nullable=False
    )  # vacation, sick_leave, personal, emergency, maternity, paternity
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    total_days = Column(Integer, nullable=False)
    reason = Column(Text)
    status = Column(
        String(20), default="pending"
    )  # pending, approved, rejected, cancelled
    requested_at = Column(DateTime(timezone=True), server_default=func.now())
    reviewed_by = Column(String(255), ForeignKey("buffr_host_user.owner_id"))
    reviewed_at = Column(DateTime(timezone=True))
    review_notes = Column(Text)

    # Relationships
    staff = relationship("StaffProfile", back_populates="leave_requests")
    property = relationship(
        "HospitalityProperty", back_populates="staff_leave_requests"
    )
    reviewer = relationship("User", foreign_keys=[reviewed_by])

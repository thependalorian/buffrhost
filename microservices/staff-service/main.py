"""
Buffr Host Staff Service - Microservice
Handles human resources, staff management, payroll, and workforce operations for Buffr Host platform
"""

import os
import logging
import uuid
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from enum import Enum

import redis.asyncio as redis
from fastapi import FastAPI, HTTPException, status, Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text, JSON, create_engine, ForeignKey, Float, Numeric, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
import jwt
from contextlib import asynccontextmanager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/buffr_host_staff")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Redis setup
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
redis_client = None

# Security
security = HTTPBearer()

# JWT Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")

# Service configuration
SERVICE_NAME = "staff-service"
SERVICE_VERSION = "1.0.0"
SERVICE_PORT = int(os.getenv("SERVICE_PORT", 8009))

# Enums
class EmployeeStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    TERMINATED = "terminated"
    ON_LEAVE = "on_leave"

class EmploymentType(str, Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    CONTRACT = "contract"
    INTERN = "intern"
    VOLUNTEER = "volunteer"

class PayFrequency(str, Enum):
    WEEKLY = "weekly"
    BI_WEEKLY = "bi_weekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    ANNUALLY = "annually"

class AttendanceStatus(str, Enum):
    PRESENT = "present"
    ABSENT = "absent"
    LATE = "late"
    EARLY_LEAVE = "early_leave"
    HALF_DAY = "half_day"

class LeaveType(str, Enum):
    ANNUAL = "annual"
    SICK = "sick"
    MATERNITY = "maternity"
    PATERNITY = "paternity"
    EMERGENCY = "emergency"
    UNPAID = "unpaid"

# Database Models
class Department(Base):
    __tablename__ = "departments"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # Department Information
    department_code = Column(String, nullable=True, index=True)
    manager_id = Column(String, nullable=True, index=True)
    budget = Column(Numeric(10, 2), nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Position(Base):
    __tablename__ = "positions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    department_id = Column(String, ForeignKey("departments.id"), nullable=False, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # Position Information
    position_code = Column(String, nullable=True, index=True)
    level = Column(String, nullable=True)  # entry, mid, senior, executive
    employment_type = Column(String, nullable=False)
    
    # Compensation
    min_salary = Column(Numeric(10, 2), nullable=True)
    max_salary = Column(Numeric(10, 2), nullable=True)
    currency = Column(String, default="NAD")
    
    # Requirements
    requirements = Column(JSON, default=list)
    responsibilities = Column(JSON, default=list)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_open = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    user_id = Column(String, nullable=True, index=True)  # Link to auth service
    
    # Personal Information
    employee_number = Column(String, unique=True, nullable=False, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=True, index=True)
    phone = Column(String, nullable=True)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String, nullable=True)
    
    # Address Information
    address = Column(Text, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    country = Column(String, nullable=True)
    postal_code = Column(String, nullable=True)
    
    # Employment Information
    department_id = Column(String, ForeignKey("departments.id"), nullable=False, index=True)
    position_id = Column(String, ForeignKey("positions.id"), nullable=False, index=True)
    employment_type = Column(String, nullable=False)
    status = Column(String, default=EmployeeStatus.ACTIVE)
    
    # Employment Dates
    hire_date = Column(Date, nullable=False)
    termination_date = Column(Date, nullable=True)
    probation_end_date = Column(Date, nullable=True)
    
    # Compensation
    salary = Column(Numeric(10, 2), nullable=True)
    hourly_rate = Column(Numeric(10, 2), nullable=True)
    pay_frequency = Column(String, default=PayFrequency.MONTHLY)
    currency = Column(String, default="NAD")
    
    # Manager Information
    manager_id = Column(String, nullable=True, index=True)
    
    # Emergency Contact
    emergency_contact_name = Column(String, nullable=True)
    emergency_contact_phone = Column(String, nullable=True)
    emergency_contact_relationship = Column(String, nullable=True)
    
    # Additional Information
    skills = Column(JSON, default=list)
    certifications = Column(JSON, default=list)
    notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Attendance(Base):
    __tablename__ = "attendance"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    employee_id = Column(String, ForeignKey("employees.id"), nullable=False, index=True)
    property_id = Column(String, nullable=False, index=True)
    
    # Attendance Information
    date = Column(Date, nullable=False, index=True)
    check_in_time = Column(DateTime, nullable=True)
    check_out_time = Column(DateTime, nullable=True)
    status = Column(String, default=AttendanceStatus.PRESENT)
    
    # Hours Information
    hours_worked = Column(Numeric(5, 2), nullable=True)
    overtime_hours = Column(Numeric(5, 2), default=0.0)
    
    # Notes
    notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class LeaveRequest(Base):
    __tablename__ = "leave_requests"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    employee_id = Column(String, ForeignKey("employees.id"), nullable=False, index=True)
    property_id = Column(String, nullable=False, index=True)
    
    # Leave Information
    leave_type = Column(String, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    total_days = Column(Integer, nullable=False)
    
    # Request Information
    reason = Column(Text, nullable=True)
    status = Column(String, default="pending")  # pending, approved, rejected, cancelled
    
    # Approval Information
    requested_at = Column(DateTime, default=datetime.utcnow)
    approved_by = Column(String, nullable=True)
    approved_at = Column(DateTime, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PayrollRecord(Base):
    __tablename__ = "payroll_records"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    employee_id = Column(String, ForeignKey("employees.id"), nullable=False, index=True)
    property_id = Column(String, nullable=False, index=True)
    
    # Payroll Period
    pay_period_start = Column(Date, nullable=False)
    pay_period_end = Column(Date, nullable=False)
    pay_date = Column(Date, nullable=False)
    
    # Earnings
    basic_salary = Column(Numeric(10, 2), nullable=False)
    overtime_pay = Column(Numeric(10, 2), default=0.0)
    bonus = Column(Numeric(10, 2), default=0.0)
    allowances = Column(Numeric(10, 2), default=0.0)
    gross_pay = Column(Numeric(10, 2), nullable=False)
    
    # Deductions
    tax_deduction = Column(Numeric(10, 2), default=0.0)
    social_security = Column(Numeric(10, 2), default=0.0)
    health_insurance = Column(Numeric(10, 2), default=0.0)
    other_deductions = Column(Numeric(10, 2), default=0.0)
    total_deductions = Column(Numeric(10, 2), default=0.0)
    
    # Net Pay
    net_pay = Column(Numeric(10, 2), nullable=False)
    currency = Column(String, default="NAD")
    
    # Status
    status = Column(String, default="pending")  # pending, processed, paid
    processed_at = Column(DateTime, nullable=True)
    processed_by = Column(String, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)

class PerformanceReview(Base):
    __tablename__ = "performance_reviews"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    employee_id = Column(String, ForeignKey("employees.id"), nullable=False, index=True)
    property_id = Column(String, nullable=False, index=True)
    
    # Review Information
    review_period_start = Column(Date, nullable=False)
    review_period_end = Column(Date, nullable=False)
    review_date = Column(Date, nullable=False)
    
    # Review Details
    overall_rating = Column(Integer, nullable=False)  # 1-5 scale
    goals_achieved = Column(JSON, default=list)
    areas_for_improvement = Column(JSON, default=list)
    comments = Column(Text, nullable=True)
    
    # Reviewer Information
    reviewed_by = Column(String, nullable=True)
    reviewer_position = Column(String, nullable=True)
    
    # Status
    status = Column(String, default="draft")  # draft, completed, approved
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Pydantic Models
class DepartmentCreate(BaseModel):
    property_id: str
    name: str
    description: Optional[str] = None
    department_code: Optional[str] = None
    manager_id: Optional[str] = None
    budget: Optional[float] = None

class PositionCreate(BaseModel):
    department_id: str
    title: str
    description: Optional[str] = None
    position_code: Optional[str] = None
    level: Optional[str] = None
    employment_type: EmploymentType
    min_salary: Optional[float] = None
    max_salary: Optional[float] = None
    currency: str = "NAD"
    requirements: Optional[List[str]] = []
    responsibilities: Optional[List[str]] = []

class EmployeeCreate(BaseModel):
    property_id: str
    user_id: Optional[str] = None
    first_name: str
    last_name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    department_id: str
    position_id: str
    employment_type: EmploymentType
    hire_date: datetime
    probation_end_date: Optional[datetime] = None
    salary: Optional[float] = None
    hourly_rate: Optional[float] = None
    pay_frequency: PayFrequency = PayFrequency.MONTHLY
    currency: str = "NAD"
    manager_id: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relationship: Optional[str] = None
    skills: Optional[List[str]] = []
    certifications: Optional[List[str]] = []
    notes: Optional[str] = None

class AttendanceCreate(BaseModel):
    employee_id: str
    property_id: str
    date: datetime
    check_in_time: Optional[datetime] = None
    check_out_time: Optional[datetime] = None
    status: AttendanceStatus = AttendanceStatus.PRESENT
    notes: Optional[str] = None

class LeaveRequestCreate(BaseModel):
    employee_id: str
    property_id: str
    leave_type: LeaveType
    start_date: datetime
    end_date: datetime
    reason: Optional[str] = None

class EmployeeResponse(BaseModel):
    id: str
    property_id: str
    user_id: Optional[str]
    employee_number: str
    first_name: str
    last_name: str
    email: Optional[str]
    phone: Optional[str]
    date_of_birth: Optional[datetime]
    gender: Optional[str]
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    country: Optional[str]
    postal_code: Optional[str]
    department_id: str
    position_id: str
    employment_type: str
    status: str
    hire_date: datetime
    termination_date: Optional[datetime]
    probation_end_date: Optional[datetime]
    salary: Optional[float]
    hourly_rate: Optional[float]
    pay_frequency: str
    currency: str
    manager_id: Optional[str]
    emergency_contact_name: Optional[str]
    emergency_contact_phone: Optional[str]
    emergency_contact_relationship: Optional[str]
    skills: List[str]
    certifications: List[str]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

class StaffMetrics(BaseModel):
    total_employees: int
    active_employees: int
    employees_by_department: Dict[str, int]
    employees_by_position: Dict[str, int]
    employees_by_status: Dict[str, int]
    employees_by_type: Dict[str, int]
    total_departments: int
    total_positions: int
    average_salary: float
    total_payroll_this_month: float
    attendance_rate: float
    leave_requests_pending: int

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Redis connection
async def connect_redis():
    global redis_client
    try:
        redis_client = redis.from_url(REDIS_URL)
        await redis_client.ping()
        logger.info("✅ Redis connected for staff service")
    except Exception as e:
        logger.warning(f"⚠️ Redis not available: {e}")
        redis_client = None

# Authentication dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Get current user from JWT token"""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return {"user_id": user_id, "email": payload.get("email"), "role": payload.get("role")}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

# Utility functions
def generate_employee_number() -> str:
    """Generate unique employee number"""
    timestamp = datetime.utcnow().strftime("%Y%m%d")
    random_suffix = str(uuid.uuid4())[:4].upper()
    return f"EMP-{timestamp}-{random_suffix}"

def calculate_hours_worked(check_in: datetime, check_out: datetime) -> float:
    """Calculate hours worked between check-in and check-out"""
    if not check_in or not check_out:
        return 0.0
    
    time_diff = check_out - check_in
    return time_diff.total_seconds() / 3600  # Convert to hours

def calculate_overtime_hours(hours_worked: float, regular_hours: float = 8.0) -> float:
    """Calculate overtime hours"""
    if hours_worked <= regular_hours:
        return 0.0
    return hours_worked - regular_hours

# Application lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info(f"🚀 Starting {SERVICE_NAME} v{SERVICE_VERSION}")
    await connect_redis()
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Database tables created/verified")
    
    yield
    
    # Shutdown
    if redis_client:
        await redis_client.close()
    logger.info(f"🛑 {SERVICE_NAME} shutdown complete")

# FastAPI app
app = FastAPI(
    title=f"{SERVICE_NAME.title()}",
    description="Human resources and staff management microservice",
    version=SERVICE_VERSION,
    lifespan=lifespan
)

# API Endpoints
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "service": SERVICE_NAME,
        "version": SERVICE_VERSION,
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": SERVICE_NAME,
        "version": SERVICE_VERSION,
        "description": "Human resources and staff management",
        "endpoints": {
            "health": "/health",
            "departments": "/api/staff/departments",
            "positions": "/api/staff/positions",
            "employees": "/api/staff/employees",
            "attendance": "/api/staff/attendance",
            "leave": "/api/staff/leave",
            "payroll": "/api/staff/payroll",
            "performance": "/api/staff/performance",
            "metrics": "/api/staff/metrics"
        }
    }

@app.post("/api/staff/employees", response_model=EmployeeResponse)
async def create_employee(
    employee_data: EmployeeCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new employee"""
    # Generate employee number
    employee_number = generate_employee_number()
    
    # Create employee
    new_employee = Employee(
        property_id=employee_data.property_id,
        user_id=employee_data.user_id,
        employee_number=employee_number,
        first_name=employee_data.first_name,
        last_name=employee_data.last_name,
        email=employee_data.email,
        phone=employee_data.phone,
        date_of_birth=employee_data.date_of_birth,
        gender=employee_data.gender,
        address=employee_data.address,
        city=employee_data.city,
        state=employee_data.state,
        country=employee_data.country,
        postal_code=employee_data.postal_code,
        department_id=employee_data.department_id,
        position_id=employee_data.position_id,
        employment_type=employee_data.employment_type,
        hire_date=employee_data.hire_date,
        probation_end_date=employee_data.probation_end_date,
        salary=employee_data.salary,
        hourly_rate=employee_data.hourly_rate,
        pay_frequency=employee_data.pay_frequency,
        currency=employee_data.currency,
        manager_id=employee_data.manager_id,
        emergency_contact_name=employee_data.emergency_contact_name,
        emergency_contact_phone=employee_data.emergency_contact_phone,
        emergency_contact_relationship=employee_data.emergency_contact_relationship,
        skills=employee_data.skills,
        certifications=employee_data.certifications,
        notes=employee_data.notes
    )
    
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    
    logger.info(f"✅ Employee created: {employee_number}")
    
    return EmployeeResponse(
        id=new_employee.id,
        property_id=new_employee.property_id,
        user_id=new_employee.user_id,
        employee_number=new_employee.employee_number,
        first_name=new_employee.first_name,
        last_name=new_employee.last_name,
        email=new_employee.email,
        phone=new_employee.phone,
        date_of_birth=new_employee.date_of_birth,
        gender=new_employee.gender,
        address=new_employee.address,
        city=new_employee.city,
        state=new_employee.state,
        country=new_employee.country,
        postal_code=new_employee.postal_code,
        department_id=new_employee.department_id,
        position_id=new_employee.position_id,
        employment_type=new_employee.employment_type,
        status=new_employee.status,
        hire_date=new_employee.hire_date,
        termination_date=new_employee.termination_date,
        probation_end_date=new_employee.probation_end_date,
        salary=float(new_employee.salary) if new_employee.salary else None,
        hourly_rate=float(new_employee.hourly_rate) if new_employee.hourly_rate else None,
        pay_frequency=new_employee.pay_frequency,
        currency=new_employee.currency,
        manager_id=new_employee.manager_id,
        emergency_contact_name=new_employee.emergency_contact_name,
        emergency_contact_phone=new_employee.emergency_contact_phone,
        emergency_contact_relationship=new_employee.emergency_contact_relationship,
        skills=new_employee.skills,
        certifications=new_employee.certifications,
        notes=new_employee.notes,
        created_at=new_employee.created_at,
        updated_at=new_employee.updated_at
    )

@app.get("/api/staff/employees", response_model=List[EmployeeResponse])
async def get_employees(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    property_id: Optional[str] = None,
    department_id: Optional[str] = None,
    position_id: Optional[str] = None,
    status: Optional[EmployeeStatus] = None,
    employment_type: Optional[EmploymentType] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get employees with filtering and search"""
    query = db.query(Employee)
    
    if property_id:
        query = query.filter(Employee.property_id == property_id)
    if department_id:
        query = query.filter(Employee.department_id == department_id)
    if position_id:
        query = query.filter(Employee.position_id == position_id)
    if status:
        query = query.filter(Employee.status == status)
    if employment_type:
        query = query.filter(Employee.employment_type == employment_type)
    if search:
        query = query.filter(
            (Employee.first_name.ilike(f"%{search}%")) |
            (Employee.last_name.ilike(f"%{search}%")) |
            (Employee.employee_number.ilike(f"%{search}%")) |
            (Employee.email.ilike(f"%{search}%"))
        )
    
    employees = query.order_by(Employee.created_at.desc()).offset(skip).limit(limit).all()
    
    return [
        EmployeeResponse(
            id=employee.id,
            property_id=employee.property_id,
            user_id=employee.user_id,
            employee_number=employee.employee_number,
            first_name=employee.first_name,
            last_name=employee.last_name,
            email=employee.email,
            phone=employee.phone,
            date_of_birth=employee.date_of_birth,
            gender=employee.gender,
            address=employee.address,
            city=employee.city,
            state=employee.state,
            country=employee.country,
            postal_code=employee.postal_code,
            department_id=employee.department_id,
            position_id=employee.position_id,
            employment_type=employee.employment_type,
            status=employee.status,
            hire_date=employee.hire_date,
            termination_date=employee.termination_date,
            probation_end_date=employee.probation_end_date,
            salary=float(employee.salary) if employee.salary else None,
            hourly_rate=float(employee.hourly_rate) if employee.hourly_rate else None,
            pay_frequency=employee.pay_frequency,
            currency=employee.currency,
            manager_id=employee.manager_id,
            emergency_contact_name=employee.emergency_contact_name,
            emergency_contact_phone=employee.emergency_contact_phone,
            emergency_contact_relationship=employee.emergency_contact_relationship,
            skills=employee.skills,
            certifications=employee.certifications,
            notes=employee.notes,
            created_at=employee.created_at,
            updated_at=employee.updated_at
        )
        for employee in employees
    ]

@app.post("/api/staff/attendance")
async def record_attendance(
    attendance_data: AttendanceCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Record employee attendance"""
    # Check if attendance already exists for this date
    existing_attendance = db.query(Attendance).filter(
        Attendance.employee_id == attendance_data.employee_id,
        Attendance.date == attendance_data.date.date()
    ).first()
    
    if existing_attendance:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Attendance already recorded for this date"
        )
    
    # Calculate hours worked
    hours_worked = 0.0
    overtime_hours = 0.0
    
    if attendance_data.check_in_time and attendance_data.check_out_time:
        hours_worked = calculate_hours_worked(
            attendance_data.check_in_time,
            attendance_data.check_out_time
        )
        overtime_hours = calculate_overtime_hours(hours_worked)
    
    # Create attendance record
    new_attendance = Attendance(
        employee_id=attendance_data.employee_id,
        property_id=attendance_data.property_id,
        date=attendance_data.date.date(),
        check_in_time=attendance_data.check_in_time,
        check_out_time=attendance_data.check_out_time,
        status=attendance_data.status,
        hours_worked=hours_worked,
        overtime_hours=overtime_hours,
        notes=attendance_data.notes
    )
    
    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)
    
    logger.info(f"✅ Attendance recorded for employee: {attendance_data.employee_id}")
    
    return {
        "message": "Attendance recorded successfully",
        "attendance_id": new_attendance.id,
        "employee_id": attendance_data.employee_id,
        "date": attendance_data.date.date(),
        "hours_worked": hours_worked,
        "overtime_hours": overtime_hours
    }

@app.post("/api/staff/leave")
async def create_leave_request(
    leave_data: LeaveRequestCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a leave request"""
    # Calculate total days
    total_days = (leave_data.end_date.date() - leave_data.start_date.date()).days + 1
    
    # Create leave request
    new_leave_request = LeaveRequest(
        employee_id=leave_data.employee_id,
        property_id=leave_data.property_id,
        leave_type=leave_data.leave_type,
        start_date=leave_data.start_date.date(),
        end_date=leave_data.end_date.date(),
        total_days=total_days,
        reason=leave_data.reason
    )
    
    db.add(new_leave_request)
    db.commit()
    db.refresh(new_leave_request)
    
    logger.info(f"✅ Leave request created: {new_leave_request.id}")
    
    return {
        "message": "Leave request created successfully",
        "leave_request_id": new_leave_request.id,
        "employee_id": leave_data.employee_id,
        "leave_type": leave_data.leave_type,
        "total_days": total_days,
        "status": "pending"
    }

@app.get("/api/staff/metrics", response_model=StaffMetrics)
async def get_staff_metrics(
    property_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get staff metrics"""
    # Get employee counts
    employee_query = db.query(Employee)
    if property_id:
        employee_query = employee_query.filter(Employee.property_id == property_id)
    
    total_employees = employee_query.count()
    active_employees = employee_query.filter(Employee.status == EmployeeStatus.ACTIVE).count()
    
    # Get employees by department
    employees_by_department = {}
    departments = db.query(Department).all()
    for department in departments:
        count = employee_query.filter(Employee.department_id == department.id).count()
        employees_by_department[department.name] = count
    
    # Get employees by position
    employees_by_position = {}
    positions = db.query(Position).all()
    for position in positions:
        count = employee_query.filter(Employee.position_id == position.id).count()
        employees_by_position[position.title] = count
    
    # Get employees by status
    employees_by_status = {}
    for status in EmployeeStatus:
        count = employee_query.filter(Employee.status == status).count()
        employees_by_status[status] = count
    
    # Get employees by type
    employees_by_type = {}
    for emp_type in EmploymentType:
        count = employee_query.filter(Employee.employment_type == emp_type).count()
        employees_by_type[emp_type] = count
    
    # Get department and position counts
    dept_query = db.query(Department)
    pos_query = db.query(Position)
    if property_id:
        dept_query = dept_query.filter(Department.property_id == property_id)
        pos_query = pos_query.join(Department).filter(Department.property_id == property_id)
    
    total_departments = dept_query.count()
    total_positions = pos_query.count()
    
    # Calculate average salary
    employees_with_salary = employee_query.filter(Employee.salary.isnot(None)).all()
    average_salary = 0.0
    if employees_with_salary:
        average_salary = sum(float(emp.salary) for emp in employees_with_salary) / len(employees_with_salary)
    
    # Get payroll for this month
    this_month = datetime.utcnow().replace(day=1)
    payroll_this_month = db.query(PayrollRecord).filter(
        PayrollRecord.pay_period_start >= this_month
    )
    if property_id:
        payroll_this_month = payroll_this_month.filter(PayrollRecord.property_id == property_id)
    
    total_payroll_this_month = sum(float(pay.net_pay) for pay in payroll_this_month.all())
    
    # Calculate attendance rate
    today = datetime.utcnow().date()
    attendance_today = db.query(Attendance).filter(Attendance.date == today)
    if property_id:
        attendance_today = attendance_today.filter(Attendance.property_id == property_id)
    
    present_count = attendance_today.filter(Attendance.status == AttendanceStatus.PRESENT).count()
    total_attendance = attendance_today.count()
    attendance_rate = 0.0
    if total_attendance > 0:
        attendance_rate = (present_count / total_attendance) * 100
    
    # Get pending leave requests
    leave_query = db.query(LeaveRequest).filter(LeaveRequest.status == "pending")
    if property_id:
        leave_query = leave_query.filter(LeaveRequest.property_id == property_id)
    
    leave_requests_pending = leave_query.count()
    
    return StaffMetrics(
        total_employees=total_employees,
        active_employees=active_employees,
        employees_by_department=employees_by_department,
        employees_by_position=employees_by_position,
        employees_by_status=employees_by_status,
        employees_by_type=employees_by_type,
        total_departments=total_departments,
        total_positions=total_positions,
        average_salary=average_salary,
        total_payroll_this_month=total_payroll_this_month,
        attendance_rate=attendance_rate,
        leave_requests_pending=leave_requests_pending
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=SERVICE_PORT,
        reload=True
    )
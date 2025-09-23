from sqlalchemy import Column, String, Integer, Float, Date, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from datetime import datetime
import uuid

from database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), unique=True, nullable=False) # Assuming a unified profiles table
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone_number = Column(String)
    job_title = Column(String)
    department = Column(String)
    hire_date = Column(Date, default=datetime.utcnow)
    salary = Column(Float)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    payroll_records = relationship("PayrollRecord", back_populates="employee")
    tax_details = relationship("TaxDetail", back_populates="employee")
    benefit_enrollments = relationship("BenefitEnrollment", back_populates="employee")

class PayrollRecord(Base):
    __tablename__ = "payroll_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False)
    pay_period_start = Column(Date, nullable=False)
    pay_period_end = Column(Date, nullable=False)
    gross_pay = Column(Float, nullable=False)
    net_pay = Column(Float, nullable=False)
    deductions = Column(JSONB) # e.g., {"taxes": 100.0, "benefits": 50.0}
    bonuses = Column(Float, default=0.0)
    payment_date = Column(Date, default=datetime.utcnow)
    status = Column(String, default="processed") # e.g., processed, pending, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    employee = relationship("Employee", back_populates="payroll_records")

class TaxDetail(Base):
    __tablename__ = "tax_details"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False)
    tax_year = Column(Integer, nullable=False)
    tax_id_number = Column(String)
    tax_jurisdiction = Column(String) # e.g., Namibia, Windhoek
    tax_withheld = Column(Float, default=0.0)
    tax_filing_status = Column(String) # e.g., single, married
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    employee = relationship("Employee", back_populates="tax_details")

class BenefitEnrollment(Base):
    __tablename__ = "benefit_enrollments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False)
    benefit_type = Column(String, nullable=False) # e.g., health_insurance, retirement_plan
    provider = Column(String)
    enrollment_date = Column(Date, default=datetime.utcnow)
    status = Column(String, default="active") # e.g., active, inactive, pending
    employee_contribution = Column(Float, default=0.0)
    company_contribution = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    employee = relationship("Employee", back_populates="benefit_enrollments")

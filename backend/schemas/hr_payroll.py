from datetime import date, datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr


class EmployeeBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: Optional[str] = None
    job_title: Optional[str] = None
    department: Optional[str] = None
    salary: Optional[float] = None
    is_active: Optional[bool] = True


class EmployeeCreate(EmployeeBase):
    user_id: UUID  # Link to the existing user profile


class EmployeeUpdate(EmployeeBase):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None


class EmployeeResponse(EmployeeBase):
    id: UUID
    user_id: UUID
    hire_date: date
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PayrollRecordBase(BaseModel):
    employee_id: UUID
    pay_period_start: date
    pay_period_end: date
    gross_pay: float
    net_pay: float
    deductions: Optional[dict] = None
    bonuses: Optional[float] = 0.0
    payment_date: Optional[date] = None
    status: Optional[str] = "processed"


class PayrollRecordCreate(PayrollRecordBase):
    pass


class PayrollRecordUpdate(BaseModel):
    gross_pay: Optional[float] = None
    net_pay: Optional[float] = None
    deductions: Optional[dict] = None
    bonuses: Optional[float] = None
    payment_date: Optional[date] = None
    status: Optional[str] = None


class PayrollRecordResponse(PayrollRecordBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TaxDetailBase(BaseModel):
    employee_id: UUID
    tax_year: int
    tax_id_number: Optional[str] = None
    tax_jurisdiction: Optional[str] = None
    tax_withheld: Optional[float] = 0.0
    tax_filing_status: Optional[str] = None


class TaxDetailCreate(TaxDetailBase):
    pass


class TaxDetailUpdate(BaseModel):
    tax_id_number: Optional[str] = None
    tax_jurisdiction: Optional[str] = None
    tax_withheld: Optional[float] = None
    tax_filing_status: Optional[str] = None


class TaxDetailResponse(TaxDetailBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BenefitEnrollmentBase(BaseModel):
    employee_id: UUID
    benefit_type: str
    provider: Optional[str] = None
    enrollment_date: Optional[date] = None
    status: Optional[str] = "active"
    employee_contribution: Optional[float] = 0.0
    company_contribution: Optional[float] = 0.0


class BenefitEnrollmentCreate(BenefitEnrollmentBase):
    pass


class BenefitEnrollmentUpdate(BaseModel):
    benefit_type: Optional[str] = None
    provider: Optional[str] = None
    enrollment_date: Optional[date] = None
    status: Optional[str] = None
    employee_contribution: Optional[float] = None
    company_contribution: Optional[float] = None


class BenefitEnrollmentResponse(BenefitEnrollmentBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

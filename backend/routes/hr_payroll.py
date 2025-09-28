from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from auth.dependencies import \
    get_current_admin_user  # Assuming only admins can manage HR/Payroll
from database import get_db
from models.user import User
from schemas.hr_payroll import (BenefitEnrollmentCreate,
                                BenefitEnrollmentResponse,
                                BenefitEnrollmentUpdate, EmployeeCreate,
                                EmployeeResponse, EmployeeUpdate,
                                PayrollRecordCreate, PayrollRecordResponse,
                                PayrollRecordUpdate, TaxDetailCreate,
                                TaxDetailResponse, TaxDetailUpdate)
from services.hr_payroll_service import HRPayrollService

router = APIRouter()


# Dependency to get HRPayrollService instance
async def get_hr_payroll_service(
    db: AsyncSession = Depends(get_db),
) -> HRPayrollService:
    return HRPayrollService(db)


# --- Employee Endpoints ---
@router.post(
    "/employees", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED
)
async def create_employee(
    employee_data: EmployeeCreate,
    hr_payroll_service: HRPayrollService = Depends(get_hr_payroll_service),
    current_user: User = Depends(get_current_admin_user),
):
    """Create a new employee record."""
    return await hr_payroll_service.create_employee(employee_data)


@router.get("/employees", response_model=List[EmployeeResponse])
async def get_employees(
    skip: int = 0,
    limit: int = 100,
    hr_payroll_service: HRPayrollService = Depends(get_hr_payroll_service),
    current_user: User = Depends(get_current_admin_user),
):
    """Retrieve a list of employee records."""
    return await hr_payroll_service.get_employees(skip=skip, limit=limit)


@router.get("/employees/{employee_id}", response_model=EmployeeResponse)
async def get_employee(
    employee_id: UUID,
    hr_payroll_service: HRPayrollService = Depends(get_hr_payroll_service),
    current_user: User = Depends(get_current_admin_user),
):
    """Retrieve a single employee record by ID."""
    employee = await hr_payroll_service.get_employee(employee_id)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found"
        )
    return employee


@router.put("/employees/{employee_id}", response_model=EmployeeResponse)
async def update_employee(
    employee_id: UUID,
    employee_data: EmployeeUpdate,
    hr_payroll_service: HRPayrollService = Depends(get_hr_payroll_service),
    current_user: User = Depends(get_current_admin_user),
):
    """Update an existing employee record."""
    employee = await hr_payroll_service.update_employee(employee_id, employee_data)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found"
        )
    return employee


@router.delete("/employees/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(
    employee_id: UUID,
    hr_payroll_service: HRPayrollService = Depends(get_hr_payroll_service),
    current_user: User = Depends(get_current_admin_user),
):
    """Delete an employee record."""
    success = await hr_payroll_service.delete_employee(employee_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found"
        )
    return


# --- Payroll Record Endpoints ---
@router.post(
    "/payroll-records",
    response_model=PayrollRecordResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_payroll_record(
    payroll_data: PayrollRecordCreate,
    hr_payroll_service: HRPayrollService = Depends(get_hr_payroll_service),
    current_user: User = Depends(get_current_admin_user),
):
    """Create a new payroll record."""
    return await hr_payroll_service.create_payroll_record(payroll_data)


@router.get(
    "/employees/{employee_id}/payroll-records",
    response_model=List[PayrollRecordResponse],
)
async def get_payroll_records_by_employee(
    employee_id: UUID,
    skip: int = 0,
    limit: int = 100,
    hr_payroll_service: HRPayrollService = Depends(get_hr_payroll_service),
    current_user: User = Depends(get_current_admin_user),
):
    """Retrieve payroll records for a specific employee."""
    return await hr_payroll_service.get_payroll_records_by_employee(
        employee_id, skip=skip, limit=limit
    )


@router.get("/payroll-records/{record_id}", response_model=PayrollRecordResponse)
async def get_payroll_record(
    record_id: UUID,
    hr_payroll_service: HRPayrollService = Depends(get_hr_payroll_service),
    current_user: User = Depends(get_current_admin_user),
):
    """Retrieve a single payroll record by ID."""
    record = await hr_payroll_service.get_payroll_record(record_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Payroll record not found"
        )
    return record


@router.put("/payroll-records/{record_id}", response_model=PayrollRecordResponse)
async def update_payroll_record(
    record_id: UUID,
    payroll_data: PayrollRecordUpdate,
    hr_payroll_service: HRPayrollService = Depends(get_hr_payroll_service),
    current_user: User = Depends(get_current_admin_user),
):
    """Update an existing payroll record."""
    record = await hr_payroll_service.update_payroll_record(record_id, payroll_data)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Payroll record not found"
        )
    return record


@router.delete("/payroll-records/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_payroll_record(
    record_id: UUID,
    hr_payroll_service: HRPayrollService = Depends(get_hr_payroll_service),
    current_user: User = Depends(get_current_admin_user),
):
    """Delete a payroll record."""
    success = await hr_payroll_service.delete_payroll_record(record_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Payroll record not found"
        )
    return


# --- Tax Detail Endpoints ---
@router.post(
    "/tax-details",
    response_model=TaxDetailResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_tax_detail(
    tax_data: TaxDetailCreate,
    hr_payroll_service: HRPayrollService = Depends(get_hr_payroll_service),
    current_user: User = Depends(get_current_admin_user),
):
    """Create a new tax detail record."""
    return await hr_payroll_service.create_tax_detail(tax_data)


@router.get(
    "/employees/{employee_id}/tax-details", response_model=List[TaxDetailResponse]
)
async def get_tax_details_by_employee(
    employee_id: UUID,
    skip: int = 0,
    limit: int = 100,
    hr_payroll_service: HRPayrollService = Depends(get_hr_payroll_service),
    current_user: User = Depends(get_current_admin_user),
):
    """Retrieve tax details for a specific employee."""
    return await hr_payroll_service.get_tax_details_by_employee(
        employee_id, skip=skip, limit=limit
    )


@router.get("/tax-details/{tax_id}", response_model=TaxDetailResponse)
async def get_tax_detail(
    tax_id: UUID,
    hr_payroll_service: HRPayrollService = Depends(get_hr_payroll_service),
    current_user: User = Depends(get_current_admin_user),
):
    """Retrieve a single tax detail record by ID."""
    detail = await hr_payroll_service.get_tax_detail(tax_id)
    if not detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Tax detail not found"
        )
    return detail


@router.put("/tax-details/{tax_id}", response_model=TaxDetailResponse)
async def update_tax_detail(
    tax_id: UUID,
    tax_data: TaxDetailUpdate,
    hr_payroll_service: HRPayrollService = Depends(get_hr_payroll_service),
    current_user: User = Depends(get_current_admin_user),
):
    """Update an existing tax detail record."""
    detail = await hr_payroll_service.update_tax_detail(tax_id, tax_data)
    if not detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Tax detail not found"
        )
    return detail


@router.delete("/tax-details/{tax_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tax_detail(
    tax_id: UUID,
    hr_payroll_service: HRPayrollService = Depends(get_hr_payroll_service),
    current_user: User = Depends(get_current_admin_user),
):
    """Delete a tax detail record."""
    success = await hr_payroll_service.delete_tax_detail(tax_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Tax detail not found"
        )
    return


# --- Benefit Enrollment Endpoints ---
@router.post(
    "/benefit-enrollments",
    response_model=BenefitEnrollmentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_benefit_enrollment(
    benefit_data: BenefitEnrollmentCreate,
    hr_payroll_service: HRPayrollService = Depends(get_hr_payroll_service),
    current_user: User = Depends(get_current_admin_user),
):
    """Create a new benefit enrollment record."""
    return await hr_payroll_service.create_benefit_enrollment(benefit_data)


@router.get(
    "/employees/{employee_id}/benefit-enrollments",
    response_model=List[BenefitEnrollmentResponse],
)
async def get_benefit_enrollments_by_employee(
    employee_id: UUID,
    skip: int = 0,
    limit: int = 100,
    hr_payroll_service: HRPayrollService = Depends(get_hr_payroll_service),
    current_user: User = Depends(get_current_admin_user),
):
    """Retrieve benefit enrollments for a specific employee."""
    return await hr_payroll_service.get_benefit_enrollments_by_employee(
        employee_id, skip=skip, limit=limit
    )


@router.get(
    "/benefit-enrollments/{benefit_id}", response_model=BenefitEnrollmentResponse
)
async def get_benefit_enrollment(
    benefit_id: UUID,
    hr_payroll_service: HRPayrollService = Depends(get_hr_payroll_service),
    current_user: User = Depends(get_current_admin_user),
):
    """Retrieve a single benefit enrollment record by ID."""
    enrollment = await hr_payroll_service.get_benefit_enrollment(benefit_id)
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Benefit enrollment not found"
        )
    return enrollment


@router.put(
    "/benefit-enrollments/{benefit_id}", response_model=BenefitEnrollmentResponse
)
async def update_benefit_enrollment(
    benefit_id: UUID,
    benefit_data: BenefitEnrollmentUpdate,
    hr_payroll_service: HRPayrollService = Depends(get_hr_payroll_service),
    current_user: User = Depends(get_current_admin_user),
):
    """Update an existing benefit enrollment record."""
    enrollment = await hr_payroll_service.update_benefit_enrollment(
        benefit_id, benefit_data
    )
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Benefit enrollment not found"
        )
    return enrollment


@router.delete(
    "/benefit-enrollments/{benefit_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_benefit_enrollment(
    benefit_id: UUID,
    hr_payroll_service: HRPayrollService = Depends(get_hr_payroll_service),
    current_user: User = Depends(get_current_admin_user),
):
    """Delete a benefit enrollment record."""
    success = await hr_payroll_service.delete_benefit_enrollment(benefit_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Benefit enrollment not found"
        )
    return

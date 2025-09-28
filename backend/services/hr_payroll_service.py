from typing import List, Optional
from uuid import UUID

from sqlalchemy import delete, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from models.hr_payroll import (BenefitEnrollment, Employee, PayrollRecord,
                               TaxDetail)
from schemas.hr_payroll import (BenefitEnrollmentCreate,
                                BenefitEnrollmentUpdate, EmployeeCreate,
                                EmployeeUpdate, PayrollRecordCreate,
                                PayrollRecordUpdate, TaxDetailCreate,
                                TaxDetailUpdate)


class HRPayrollService:
    def __init__(self, db: AsyncSession):
        self.db = db

    # Employee Operations
    async def create_employee(self, employee_data: EmployeeCreate) -> Employee:
        employee = Employee(**employee_data.model_dump())
        self.db.add(employee)
        await self.db.commit()
        await self.db.refresh(employee)
        return employee

    async def get_employee(self, employee_id: UUID) -> Optional[Employee]:
        result = await self.db.execute(
            select(Employee).where(Employee.id == employee_id)
        )
        return result.scalar_one_or_none()

    async def get_employees(self, skip: int = 0, limit: int = 100) -> List[Employee]:
        result = await self.db.execute(select(Employee).offset(skip).limit(limit))
        return list(result.scalars().all())

    async def update_employee(
        self, employee_id: UUID, employee_data: EmployeeUpdate
    ) -> Optional[Employee]:
        employee = await self.get_employee(employee_id)
        if employee:
            update_data = employee_data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(employee, key, value)
            await self.db.commit()
            await self.db.refresh(employee)
        return employee

    async def delete_employee(self, employee_id: UUID) -> bool:
        employee = await self.get_employee(employee_id)
        if employee:
            await self.db.delete(employee)
            await self.db.commit()
            return True
        return False

    # PayrollRecord Operations
    async def create_payroll_record(
        self, payroll_data: PayrollRecordCreate
    ) -> PayrollRecord:
        payroll_record = PayrollRecord(**payroll_data.model_dump())
        self.db.add(payroll_record)
        await self.db.commit()
        await self.db.refresh(payroll_record)
        return payroll_record

    async def get_payroll_record(self, record_id: UUID) -> Optional[PayrollRecord]:
        result = await self.db.execute(
            select(PayrollRecord).where(PayrollRecord.id == record_id)
        )
        return result.scalar_one_or_none()

    async def get_payroll_records_by_employee(
        self, employee_id: UUID, skip: int = 0, limit: int = 100
    ) -> List[PayrollRecord]:
        result = await self.db.execute(
            select(PayrollRecord)
            .where(PayrollRecord.employee_id == employee_id)
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def update_payroll_record(
        self, record_id: UUID, payroll_data: PayrollRecordUpdate
    ) -> Optional[PayrollRecord]:
        payroll_record = await self.get_payroll_record(record_id)
        if payroll_record:
            update_data = payroll_data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(payroll_record, key, value)
            await self.db.commit()
            await self.db.refresh(payroll_record)
        return payroll_record

    async def delete_payroll_record(self, record_id: UUID) -> bool:
        payroll_record = await self.get_payroll_record(record_id)
        if payroll_record:
            await self.db.delete(payroll_record)
            await self.db.commit()
            return True
        return False

    # TaxDetail Operations
    async def create_tax_detail(self, tax_data: TaxDetailCreate) -> TaxDetail:
        tax_detail = TaxDetail(**tax_data.model_dump())
        self.db.add(tax_detail)
        await self.db.commit()
        await self.db.refresh(tax_detail)
        return tax_detail

    async def get_tax_detail(self, tax_id: UUID) -> Optional[TaxDetail]:
        result = await self.db.execute(select(TaxDetail).where(TaxDetail.id == tax_id))
        return result.scalar_one_or_none()

    async def get_tax_details_by_employee(
        self, employee_id: UUID, skip: int = 0, limit: int = 100
    ) -> List[TaxDetail]:
        result = await self.db.execute(
            select(TaxDetail)
            .where(TaxDetail.employee_id == employee_id)
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def update_tax_detail(
        self, tax_id: UUID, tax_data: TaxDetailUpdate
    ) -> Optional[TaxDetail]:
        tax_detail = await self.get_tax_detail(tax_id)
        if tax_detail:
            update_data = tax_data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(tax_detail, key, value)
            await self.db.commit()
            await self.db.refresh(tax_detail)
        return tax_detail

    async def delete_tax_detail(self, tax_id: UUID) -> bool:
        tax_detail = await self.get_tax_detail(tax_id)
        if tax_detail:
            await self.db.delete(tax_detail)
            await self.db.commit()
            return True
        return False

    # BenefitEnrollment Operations
    async def create_benefit_enrollment(
        self, benefit_data: BenefitEnrollmentCreate
    ) -> BenefitEnrollment:
        benefit_enrollment = BenefitEnrollment(**benefit_data.model_dump())
        self.db.add(benefit_enrollment)
        await self.db.commit()
        await self.db.refresh(benefit_enrollment)
        return benefit_enrollment

    async def get_benefit_enrollment(
        self, benefit_id: UUID
    ) -> Optional[BenefitEnrollment]:
        result = await self.db.execute(
            select(BenefitEnrollment).where(BenefitEnrollment.id == benefit_id)
        )
        return result.scalar_one_or_none()

    async def get_benefit_enrollments_by_employee(
        self, employee_id: UUID, skip: int = 0, limit: int = 100
    ) -> List[BenefitEnrollment]:
        result = await self.db.execute(
            select(BenefitEnrollment)
            .where(BenefitEnrollment.employee_id == employee_id)
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def update_benefit_enrollment(
        self, benefit_id: UUID, benefit_data: BenefitEnrollmentUpdate
    ) -> Optional[BenefitEnrollment]:
        benefit_enrollment = await self.get_benefit_enrollment(benefit_id)
        if benefit_enrollment:
            update_data = benefit_data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(benefit_enrollment, key, value)
            await self.db.commit()
            await self.db.refresh(benefit_enrollment)
        return benefit_enrollment

    async def delete_benefit_enrollment(self, benefit_id: UUID) -> bool:
        benefit_enrollment = await self.get_benefit_enrollment(benefit_id)
        if benefit_enrollment:
            await self.db.delete(benefit_enrollment)
            await self.db.commit()
            return True
        return False

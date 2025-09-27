from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from typing import List, Optional
from uuid import UUID

from models.revenue_model import Subscription, ServiceFee, CommissionStructure, from schemas.revenue_model import (
    SubscriptionCreate, SubscriptionUpdate, 
    ServiceFeeCreate, ServiceFeeUpdate, 
    CommissionStructureCreate, CommissionStructureUpdate, 
    Create, Update
)

class RevenueModelService:
    def __init__(self, db: AsyncSession):
        self.db = db

    # Subscription Operations
    async def create_subscription(self, subscription_data: SubscriptionCreate) -> Subscription:
        subscription = Subscription(**subscription_data.model_dump())
        self.db.add(subscription)
        await self.db.commit()
        await self.db.refresh(subscription)
        return subscription

    async def get_subscription(self, subscription_id: UUID) -> Optional[Subscription]:
        result = await self.db.execute(select(Subscription).where(Subscription.id == subscription_id))
        return result.scalar_one_or_none()

    async def get_subscriptions(self, skip: int = 0, limit: int = 100) -> List[Subscription]:
        result = await self.db.execute(select(Subscription).offset(skip).limit(limit))
        return list(result.scalars().all())

    async def update_subscription(self, subscription_id: UUID, subscription_data: SubscriptionUpdate) -> Optional[Subscription]:
        subscription = await self.get_subscription(subscription_id)
        if subscription:
            update_data = subscription_data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(subscription, key, value)
            await self.db.commit()
            await self.db.refresh(subscription)
        return subscription

    async def delete_subscription(self, subscription_id: UUID) -> bool:
        subscription = await self.get_subscription(subscription_id)
        if subscription:
            await self.db.delete(subscription)
            await self.db.commit()
            return True
        return False

    # ServiceFee Operations
    async def create_service_fee(self, fee_data: ServiceFeeCreate) -> ServiceFee:
        fee = ServiceFee(**fee_data.model_dump())
        self.db.add(fee)
        await self.db.commit()
        await self.db.refresh(fee)
        return fee

    async def get_service_fee(self, fee_id: UUID) -> Optional[ServiceFee]:
        result = await self.db.execute(select(ServiceFee).where(ServiceFee.id == fee_id))
        return result.scalar_one_or_none()

    async def get_service_fees(self, skip: int = 0, limit: int = 100) -> List[ServiceFee]:
        result = await self.db.execute(select(ServiceFee).offset(skip).limit(limit))
        return list(result.scalars().all())

    async def update_service_fee(self, fee_id: UUID, fee_data: ServiceFeeUpdate) -> Optional[ServiceFee]:
        fee = await self.get_service_fee(fee_id)
        if fee:
            update_data = fee_data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(fee, key, value)
            await self.db.commit()
            await self.db.refresh(fee)
        return fee

    async def delete_service_fee(self, fee_id: UUID) -> bool:
        fee = await self.get_service_fee(fee_id)
        if fee:
            await self.db.delete(fee)
            await self.db.commit()
            return True
        return False

    # CommissionStructure Operations
    async def create_commission_structure(self, commission_data: CommissionStructureCreate) -> CommissionStructure:
        commission = CommissionStructure(**commission_data.model_dump())
        self.db.add(commission)
        await self.db.commit()
        await self.db.refresh(commission)
        return commission

    async def get_commission_structure(self, commission_id: UUID) -> Optional[CommissionStructure]:
        result = await self.db.execute(select(CommissionStructure).where(CommissionStructure.id == commission_id))
        return result.scalar_one_or_none()

    async def get_commission_structures(self, skip: int = 0, limit: int = 100) -> List[CommissionStructure]:
        result = await self.db.execute(select(CommissionStructure).offset(skip).limit(limit))
        return list(result.scalars().all())

    async def update_commission_structure(self, commission_id: UUID, commission_data: CommissionStructureUpdate) -> Optional[CommissionStructure]:
        commission = await self.get_commission_structure(commission_id)
        if commission:
            update_data = commission_data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(commission, key, value)
            await self.db.commit()
            await self.db.refresh(commission)
        return commission

    async def delete_commission_structure(self, commission_id: UUID) -> bool:
        commission = await self.get_commission_structure(commission_id)
        if commission:
            await self.db.delete(commission)
            await self.db.commit()
            return True
        return False

    # Operations
    async def create_invoice(self, invoice_data: Create) -> :
        invoice = (**invoice_data.model_dump())
        self.db.add(invoice)
        await self.db.commit()
        await self.db.refresh(invoice)
        return invoice

    async def get_invoice(self, invoice_id: UUID) -> Optional[]:
        result = await self.db.execute(select().where(.id == invoice_id))
        return result.scalar_one_or_none()

    async def get_invoices(self, skip: int = 0, limit: int = 100) -> List[]:
        result = await self.db.execute(select().offset(skip).limit(limit))
        return list(result.scalars().all())

    async def update_invoice(self, invoice_id: UUID, invoice_data: Update) -> Optional[]:
        invoice = await self.get_invoice(invoice_id)
        if invoice:
            update_data = invoice_data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(invoice, key, value)
            await self.db.commit()
            await self.db.refresh(invoice)
        return invoice

    async def delete_invoice(self, invoice_id: UUID) -> bool:
        invoice = await self.get_invoice(invoice_id)
        if invoice:
            await self.db.delete(invoice)
            await self.db.commit()
            return True
        return False

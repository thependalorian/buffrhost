from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from typing import List, Optional
from uuid import UUID

from models.banking_financial import BankAccount, Transaction, PaymentGateway, Disbursement
from schemas.banking_financial import (
    BankAccountCreate, BankAccountUpdate, 
    TransactionCreate, TransactionUpdate, 
    PaymentGatewayCreate, PaymentGatewayUpdate, 
    DisbursementCreate, DisbursementUpdate
)

class BankingFinancialService:
    def __init__(self, db: AsyncSession):
        self.db = db

    # BankAccount Operations
    async def create_bank_account(self, account_data: BankAccountCreate) -> BankAccount:
        account = BankAccount(**account_data.model_dump())
        self.db.add(account)
        await self.db.commit()
        await self.db.refresh(account)
        return account

    async def get_bank_account(self, account_id: UUID) -> Optional[BankAccount]:
        result = await self.db.execute(select(BankAccount).where(BankAccount.id == account_id))
        return result.scalar_one_or_none()

    async def get_bank_accounts(self, skip: int = 0, limit: int = 100) -> List[BankAccount]:
        result = await self.db.execute(select(BankAccount).offset(skip).limit(limit))
        return list(result.scalars().all())

    async def update_bank_account(self, account_id: UUID, account_data: BankAccountUpdate) -> Optional[BankAccount]:
        account = await self.get_bank_account(account_id)
        if account:
            update_data = account_data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(account, key, value)
            await self.db.commit()
            await self.db.refresh(account)
        return account

    async def delete_bank_account(self, account_id: UUID) -> bool:
        account = await self.get_bank_account(account_id)
        if account:
            await self.db.delete(account)
            await self.db.commit()
            return True
        return False

    # Transaction Operations
    async def create_transaction(self, transaction_data: TransactionCreate) -> Transaction:
        transaction = Transaction(**transaction_data.model_dump())
        self.db.add(transaction)
        await self.db.commit()
        await self.db.refresh(transaction)
        return transaction

    async def get_transaction(self, transaction_id: UUID) -> Optional[Transaction]:
        result = await self.db.execute(select(Transaction).where(Transaction.id == transaction_id))
        return result.scalar_one_or_none()

    async def get_transactions(self, skip: int = 0, limit: int = 100) -> List[Transaction]:
        result = await self.db.execute(select(Transaction).offset(skip).limit(limit))
        return list(result.scalars().all())

    async def update_transaction(self, transaction_id: UUID, transaction_data: TransactionUpdate) -> Optional[Transaction]:
        transaction = await self.get_transaction(transaction_id)
        if transaction:
            update_data = transaction_data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(transaction, key, value)
            await self.db.commit()
            await self.db.refresh(transaction)
        return transaction

    async def delete_transaction(self, transaction_id: UUID) -> bool:
        transaction = await self.get_transaction(transaction_id)
        if transaction:
            await self.db.delete(transaction)
            await self.db.commit()
            return True
        return False

    # PaymentGateway Operations
    async def create_payment_gateway(self, gateway_data: PaymentGatewayCreate) -> PaymentGateway:
        gateway = PaymentGateway(**gateway_data.model_dump())
        self.db.add(gateway)
        await self.db.commit()
        await self.db.refresh(gateway)
        return gateway

    async def get_payment_gateway(self, gateway_id: UUID) -> Optional[PaymentGateway]:
        result = await self.db.execute(select(PaymentGateway).where(PaymentGateway.id == gateway_id))
        return result.scalar_one_or_none()

    async def get_payment_gateways(self, skip: int = 0, limit: int = 100) -> List[PaymentGateway]:
        result = await self.db.execute(select(PaymentGateway).offset(skip).limit(limit))
        return list(result.scalars().all())

    async def update_payment_gateway(self, gateway_id: UUID, gateway_data: PaymentGatewayUpdate) -> Optional[PaymentGateway]:
        gateway = await self.get_payment_gateway(gateway_id)
        if gateway:
            update_data = gateway_data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(gateway, key, value)
            await self.db.commit()
            await self.db.refresh(gateway)
        return gateway

    async def delete_payment_gateway(self, gateway_id: UUID) -> bool:
        gateway = await self.get_payment_gateway(gateway_id)
        if gateway:
            await self.db.delete(gateway)
            await self.db.commit()
            return True
        return False

    # Disbursement Operations
    async def create_disbursement(self, disbursement_data: DisbursementCreate) -> Disbursement:
        disbursement = Disbursement(**disbursement_data.model_dump())
        self.db.add(disbursement)
        await self.db.commit()
        await self.db.refresh(disbursement)
        return disbursement

    async def get_disbursement(self, disbursement_id: UUID) -> Optional[Disbursement]:
        result = await self.db.execute(select(Disbursement).where(Disbursement.id == disbursement_id))
        return result.scalar_one_or_none()

    async def get_disbursements(self, skip: int = 0, limit: int = 100) -> List[Disbursement]:
        result = await self.db.execute(select(Disbursement).offset(skip).limit(limit))
        return list(result.scalars().all())

    async def update_disbursement(self, disbursement_id: UUID, disbursement_data: DisbursementUpdate) -> Optional[Disbursement]:
        disbursement = await self.get_disbursement(disbursement_id)
        if disbursement:
            update_data = disbursement_data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(disbursement, key, value)
            await self.db.commit()
            await self.db.refresh(disbursement)
        return disbursement

    async def delete_disbursement(self, disbursement_id: UUID) -> bool:
        disbursement = await self.get_disbursement(disbursement_id)
        if disbursement:
            await self.db.delete(disbursement)
            await self.db.commit()
            return True
        return False

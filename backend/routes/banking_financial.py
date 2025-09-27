from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from database import get_db
from services.banking_financial_service import BankingFinancialService
from schemas.banking_financial import (
    Create, Update, Response,
    TransactionCreate, TransactionUpdate, TransactionResponse,
    PaymentGatewayCreate, PaymentGatewayUpdate, PaymentGatewayResponse,
    DisbursementCreate, DisbursementUpdate, DisbursementResponse
)
from auth.dependencies import get_current_admin_user # Assuming only admins can manage banking/financial
from models.user import User

router = APIRouter()

# Dependency to get BankingFinancialService instance
async def get_banking_financial_service(db: AsyncSession = Depends(get_db)) -> BankingFinancialService:
    return BankingFinancialService(db)

# --- Bank Account Endpoints ---
@router.post("/bank-accounts", response_model=Response, status_code=status.HTTP_201_CREATED)
async def create_bank_account(
    account_data: Create,
    banking_service: BankingFinancialService = Depends(get_banking_financial_service),
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new bank account record."""
    return await banking_service.create_bank_account(account_data)

@router.get("/bank-accounts", response_model=List[Response])
async def get_bank_accounts(
    skip: int = 0,
    limit: int = 100,
    banking_service: BankingFinancialService = Depends(get_banking_financial_service),
    current_user: User = Depends(get_current_admin_user)
):
    """Retrieve a list of bank accounts."""
    return await banking_service.get_bank_accounts(skip=skip, limit=limit)

@router.get("/bank-accounts/{account_id}", response_model=Response)
async def get_bank_account(
    account_id: UUID,
    banking_service: BankingFinancialService = Depends(get_banking_financial_service),
    current_user: User = Depends(get_current_admin_user)
):
    """Retrieve a single bank account record by ID."""
    account = await banking_service.get_bank_account(account_id)
    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bank account not found")
    return account

@router.put("/bank-accounts/{account_id}", response_model=Response)
async def update_bank_account(
    account_id: UUID,
    account_data: Update,
    banking_service: BankingFinancialService = Depends(get_banking_financial_service),
    current_user: User = Depends(get_current_admin_user)
):
    """Update an existing bank account record."""
    account = await banking_service.update_bank_account(account_id, account_data)
    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bank account not found")
    return account

@router.delete("/bank-accounts/{account_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_bank_account(
    account_id: UUID,
    banking_service: BankingFinancialService = Depends(get_banking_financial_service),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete a bank account record."""
    success = await banking_service.delete_bank_account(account_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bank account not found")
    return

# --- Transaction Endpoints ---
@router.post("/transactions", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
async def create_transaction(
    transaction_data: TransactionCreate,
    banking_service: BankingFinancialService = Depends(get_banking_financial_service),
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new transaction record."""
    return await banking_service.create_transaction(transaction_data)

@router.get("/transactions", response_model=List[TransactionResponse])
async def get_transactions(
    skip: int = 0,
    limit: int = 100,
    banking_service: BankingFinancialService = Depends(get_banking_financial_service),
    current_user: User = Depends(get_current_admin_user)
):
    """Retrieve a list of transactions."""
    return await banking_service.get_transactions(skip=skip, limit=limit)

@router.get("/transactions/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(
    transaction_id: UUID,
    banking_service: BankingFinancialService = Depends(get_banking_financial_service),
    current_user: User = Depends(get_current_admin_user)
):
    """Retrieve a single transaction record by ID."""
    transaction = await banking_service.get_transaction(transaction_id)
    if not transaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    return transaction

@router.put("/transactions/{transaction_id}", response_model=TransactionResponse)
async def update_transaction(
    transaction_id: UUID,
    transaction_data: TransactionUpdate,
    banking_service: BankingFinancialService = Depends(get_banking_financial_service),
    current_user: User = Depends(get_current_admin_user)
):
    """Update an existing transaction record."""
    transaction = await banking_service.update_transaction(transaction_id, transaction_data)
    if not transaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    return transaction

@router.delete("/transactions/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction(
    transaction_id: UUID,
    banking_service: BankingFinancialService = Depends(get_banking_financial_service),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete a transaction record."""
    success = await banking_service.delete_transaction(transaction_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    return

# --- Payment Gateway Endpoints ---
@router.post("/payment-gateways", response_model=PaymentGatewayResponse, status_code=status.HTTP_201_CREATED)
async def create_payment_gateway(
    gateway_data: PaymentGatewayCreate,
    banking_service: BankingFinancialService = Depends(get_banking_financial_service),
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new payment gateway record."""
    return await banking_service.create_payment_gateway(gateway_data)

@router.get("/payment-gateways", response_model=List[PaymentGatewayResponse])
async def get_payment_gateways(
    skip: int = 0,
    limit: int = 100,
    banking_service: BankingFinancialService = Depends(get_banking_financial_service),
    current_user: User = Depends(get_current_admin_user)
):
    """Retrieve a list of payment gateways."""
    return await banking_service.get_payment_gateways(skip=skip, limit=limit)

@router.get("/payment-gateways/{gateway_id}", response_model=PaymentGatewayResponse)
async def get_payment_gateway(
    gateway_id: UUID,
    banking_service: BankingFinancialService = Depends(get_banking_financial_service),
    current_user: User = Depends(get_current_admin_user)
):
    """Retrieve a single payment gateway record by ID."""
    gateway = await banking_service.get_payment_gateway(gateway_id)
    if not gateway:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment gateway not found")
    return gateway

@router.put("/payment-gateways/{gateway_id}", response_model=PaymentGatewayResponse)
async def update_payment_gateway(
    gateway_id: UUID,
    gateway_data: PaymentGatewayUpdate,
    banking_service: BankingFinancialService = Depends(get_banking_financial_service),
    current_user: User = Depends(get_current_admin_user)
):
    """Update an existing payment gateway record."""
    gateway = await banking_service.update_payment_gateway(gateway_id, gateway_data)
    if not gateway:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment gateway not found")
    return gateway

@router.delete("/payment-gateways/{gateway_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_payment_gateway(
    gateway_id: UUID,
    banking_service: BankingFinancialService = Depends(get_banking_financial_service),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete a payment gateway record."""
    success = await banking_service.delete_payment_gateway(gateway_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment gateway not found")
    return

# --- Disbursement Endpoints ---
@router.post("/disbursements", response_model=DisbursementResponse, status_code=status.HTTP_201_CREATED)
async def create_disbursement(
    disbursement_data: DisbursementCreate,
    banking_service: BankingFinancialService = Depends(get_banking_financial_service),
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new disbursement record."""
    return await banking_service.create_disbursement(disbursement_data)

@router.get("/disbursements", response_model=List[DisbursementResponse])
async def get_disbursements(
    skip: int = 0,
    limit: int = 100,
    banking_service: BankingFinancialService = Depends(get_banking_financial_service),
    current_user: User = Depends(get_current_admin_user)
):
    """Retrieve a list of disbursements."""
    return await banking_service.get_disbursements(skip=skip, limit=limit)

@router.get("/disbursements/{disbursement_id}", response_model=DisbursementResponse)
async def get_disbursement(
    disbursement_id: UUID,
    banking_service: BankingFinancialService = Depends(get_banking_financial_service),
    current_user: User = Depends(get_current_admin_user)
):
    """Retrieve a single disbursement record by ID."""
    disbursement = await banking_service.get_disbursement(disbursement_id)
    if not disbursement:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Disbursement not found")
    return disbursement

@router.put("/disbursements/{disbursement_id}", response_model=DisbursementResponse)
async def update_disbursement(
    disbursement_id: UUID,
    disbursement_data: DisbursementUpdate,
    banking_service: BankingFinancialService = Depends(get_banking_financial_service),
    current_user: User = Depends(get_current_admin_user)
):
    """Update an existing disbursement record."""
    disbursement = await banking_service.update_disbursement(disbursement_id, disbursement_data)
    if not disbursement:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Disbursement not found")
    return disbursement

@router.delete("/disbursements/{disbursement_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_disbursement(
    disbursement_id: UUID,
    banking_service: BankingFinancialService = Depends(get_banking_financial_service),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete a disbursement record."""
    success = await banking_service.delete_disbursement(disbursement_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Disbursement not found")
    return

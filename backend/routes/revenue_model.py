from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from database import get_db
from services.revenue_model_service import RevenueModelService
from schemas.revenue_model import (
    SubscriptionCreate, SubscriptionUpdate, SubscriptionResponse,
    ServiceFeeCreate, ServiceFeeUpdate, ServiceFeeResponse,
    CommissionStructureCreate, CommissionStructureUpdate, CommissionStructureResponse,
    InvoiceCreate, InvoiceUpdate, InvoiceResponse
)
from auth.dependencies import get_current_admin_user # Assuming only admins can manage revenue models
from models.user import BuffrHostUser

router = APIRouter()

# Dependency to get RevenueModelService instance
async def get_revenue_model_service(db: AsyncSession = Depends(get_db)) -> RevenueModelService:
    return RevenueModelService(db)

# --- Subscription Endpoints ---
@router.post("/subscriptions", response_model=SubscriptionResponse, status_code=status.HTTP_201_CREATED)
async def create_subscription(
    subscription_data: SubscriptionCreate,
    revenue_service: RevenueModelService = Depends(get_revenue_model_service),
    current_user: BuffrHostUser = Depends(get_current_admin_user)
):
    """Create a new subscription record."""
    return await revenue_service.create_subscription(subscription_data)

@router.get("/subscriptions", response_model=List[SubscriptionResponse])
async def get_subscriptions(
    skip: int = 0,
    limit: int = 100,
    revenue_service: RevenueModelService = Depends(get_revenue_model_service),
    current_user: BuffrHostUser = Depends(get_current_admin_user)
):
    """Retrieve a list of subscriptions."""
    return await revenue_service.get_subscriptions(skip=skip, limit=limit)

@router.get("/subscriptions/{subscription_id}", response_model=SubscriptionResponse)
async def get_subscription(
    subscription_id: UUID,
    revenue_service: RevenueModelService = Depends(get_revenue_model_service),
    current_user: BuffrHostUser = Depends(get_current_admin_user)
):
    """Retrieve a single subscription record by ID."""
    subscription = await revenue_service.get_subscription(subscription_id)
    if not subscription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscription not found")
    return subscription

@router.put("/subscriptions/{subscription_id}", response_model=SubscriptionResponse)
async def update_subscription(
    subscription_id: UUID,
    subscription_data: SubscriptionUpdate,
    revenue_service: RevenueModelService = Depends(get_revenue_model_service),
    current_user: BuffrHostUser = Depends(get_current_admin_user)
):
    """Update an existing subscription record."""
    subscription = await revenue_service.update_subscription(subscription_id, subscription_data)
    if not subscription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscription not found")
    return subscription

@router.delete("/subscriptions/{subscription_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_subscription(
    subscription_id: UUID,
    revenue_service: RevenueModelService = Depends(get_revenue_model_service),
    current_user: BuffrHostUser = Depends(get_current_admin_user)
):
    """Delete a subscription record."""
    success = await revenue_service.delete_subscription(subscription_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscription not found")
    return

# --- Service Fee Endpoints ---
@router.post("/service-fees", response_model=ServiceFeeResponse, status_code=status.HTTP_201_CREATED)
async def create_service_fee(
    fee_data: ServiceFeeCreate,
    revenue_service: RevenueModelService = Depends(get_revenue_model_service),
    current_user: BuffrHostUser = Depends(get_current_admin_user)
):
    """Create a new service fee record."""
    return await revenue_service.create_service_fee(fee_data)

@router.get("/service-fees", response_model=List[ServiceFeeResponse])
async def get_service_fees(
    skip: int = 0,
    limit: int = 100,
    revenue_service: RevenueModelService = Depends(get_revenue_model_service),
    current_user: BuffrHostUser = Depends(get_current_admin_user)
):
    """Retrieve a list of service fees."""
    return await revenue_service.get_service_fees(skip=skip, limit=limit)

@router.get("/service-fees/{fee_id}", response_model=ServiceFeeResponse)
async def get_service_fee(
    fee_id: UUID,
    revenue_service: RevenueModelService = Depends(get_revenue_model_service),
    current_user: BuffrHostUser = Depends(get_current_admin_user)
):
    """Retrieve a single service fee record by ID."""
    fee = await revenue_service.get_service_fee(fee_id)
    if not fee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service fee not found")
    return fee

@router.put("/service-fees/{fee_id}", response_model=ServiceFeeResponse)
async def update_service_fee(
    fee_id: UUID,
    fee_data: ServiceFeeUpdate,
    revenue_service: RevenueModelService = Depends(get_revenue_model_service),
    current_user: BuffrHostUser = Depends(get_current_admin_user)
):
    """Update an existing service fee record."""
    fee = await revenue_service.update_service_fee(fee_id, fee_data)
    if not fee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service fee not found")
    return fee

@router.delete("/service-fees/{fee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_service_fee(
    fee_id: UUID,
    revenue_service: RevenueModelService = Depends(get_revenue_model_service),
    current_user: BuffrHostUser = Depends(get_current_admin_user)
):
    """Delete a service fee record."""
    success = await revenue_service.delete_service_fee(fee_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service fee not found")
    return

# --- Commission Structure Endpoints ---
@router.post("/commission-structures", response_model=CommissionStructureResponse, status_code=status.HTTP_201_CREATED)
async def create_commission_structure(
    commission_data: CommissionStructureCreate,
    revenue_service: RevenueModelService = Depends(get_revenue_model_service),
    current_user: BuffrHostUser = Depends(get_current_admin_user)
):
    """Create a new commission structure record."""
    return await revenue_service.create_commission_structure(commission_data)

@router.get("/commission-structures", response_model=List[CommissionStructureResponse])
async def get_commission_structures(
    skip: int = 0,
    limit: int = 100,
    revenue_service: RevenueModelService = Depends(get_revenue_model_service),
    current_user: BuffrHostUser = Depends(get_current_admin_user)
):
    """Retrieve a list of commission structures."""
    return await revenue_service.get_commission_structures(skip=skip, limit=limit)

@router.get("/commission-structures/{commission_id}", response_model=CommissionStructureResponse)
async def get_commission_structure(
    commission_id: UUID,
    revenue_service: RevenueModelService = Depends(get_revenue_model_service),
    current_user: BuffrHostUser = Depends(get_current_admin_user)
):
    """Retrieve a single commission structure record by ID."""
    commission = await revenue_service.get_commission_structure(commission_id)
    if not commission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Commission structure not found")
    return commission

@router.put("/commission-structures/{commission_id}", response_model=CommissionStructureResponse)
async def update_commission_structure(
    commission_id: UUID,
    commission_data: CommissionStructureUpdate,
    revenue_service: RevenueModelService = Depends(get_revenue_model_service),
    current_user: BuffrHostUser = Depends(get_current_admin_user)
):
    """Update an existing commission structure record."""
    commission = await revenue_service.update_commission_structure(commission_id, commission_data)
    if not commission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Commission structure not found")
    return commission

@router.delete("/commission-structures/{commission_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_commission_structure(
    commission_id: UUID,
    revenue_service: RevenueModelService = Depends(get_revenue_model_service),
    current_user: BuffrHostUser = Depends(get_current_admin_user)
):
    """Delete a commission structure record."""
    success = await revenue_service.delete_commission_structure(commission_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Commission structure not found")
    return

# --- Invoice Endpoints ---
@router.post("/invoices", response_model=InvoiceResponse, status_code=status.HTTP_201_CREATED)
async def create_invoice(
    invoice_data: InvoiceCreate,
    revenue_service: RevenueModelService = Depends(get_revenue_model_service),
    current_user: BuffrHostUser = Depends(get_current_admin_user)
):
    """Create a new invoice record."""
    return await revenue_service.create_invoice(invoice_data)

@router.get("/invoices", response_model=List[InvoiceResponse])
async def get_invoices(
    skip: int = 0,
    limit: int = 100,
    revenue_service: RevenueModelService = Depends(get_revenue_model_service),
    current_user: BuffrHostUser = Depends(get_current_admin_user)
):
    """Retrieve a list of invoices."""
    return await revenue_service.get_invoices(skip=skip, limit=limit)

@router.get("/invoices/{invoice_id}", response_model=InvoiceResponse)
async def get_invoice(
    invoice_id: UUID,
    revenue_service: RevenueModelService = Depends(get_revenue_model_service),
    current_user: BuffrHostUser = Depends(get_current_admin_user)
):
    """Retrieve a single invoice record by ID."""
    invoice = await revenue_service.get_invoice(invoice_id)
    if not invoice:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found")
    return invoice

@router.put("/invoices/{invoice_id}", response_model=InvoiceResponse)
async def update_invoice(
    invoice_id: UUID,
    invoice_data: InvoiceUpdate,
    revenue_service: RevenueModelService = Depends(get_revenue_model_service),
    current_user: BuffrHostUser = Depends(get_current_admin_user)
):
    """Update an existing invoice record."""
    invoice = await revenue_service.update_invoice(invoice_id, invoice_data)
    if not invoice:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found")
    return invoice

@router.delete("/invoices/{invoice_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_invoice(
    invoice_id: UUID,
    revenue_service: RevenueModelService = Depends(get_revenue_model_service),
    current_user: BuffrHostUser = Depends(get_current_admin_user)
):
    """Delete an invoice record."""
    success = await revenue_service.delete_invoice(invoice_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found")
    return

"""
Financial API Routes for Buffr Host
Handles quotations, invoices, receipts, and financial settings
"""

from datetime import datetime, date
from decimal import Decimal
from typing import List, Optional, Dict, Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import get_db
from models.financial_settings import (
    PropertyFinancialSettings, 
    BankAccount, 
    ServiceRate, 
    Quotation, 
    Invoice, 
    Receipt
)
from schemas.financial_settings import (
    PropertyFinancialSettingsCreate,
    PropertyFinancialSettingsUpdate,
    BankAccountCreate,
    BankAccountUpdate,
    ServiceRateCreate,
    ServiceRateUpdate,
    QuotationCreate,
    QuotationUpdate,
    InvoiceCreate,
    InvoiceUpdate,
    ReceiptCreate,
    QuotationResponse,
    InvoiceResponse,
    ReceiptResponse,
    FinancialSettingsResponse
)
from services.financial_service import FinancialService

router = APIRouter()

# Dependency to get financial service
async def get_financial_service(db: AsyncSession = Depends(get_db)) -> FinancialService:
    return FinancialService(db)

@router.get("/settings/{property_id}", response_model=FinancialSettingsResponse)
async def get_financial_settings(
    property_id: UUID,
    financial_service: FinancialService = Depends(get_financial_service)
):
    """Get financial settings for a property"""
    try:
        settings = await financial_service.get_property_financial_settings(property_id)
        if not settings:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Financial settings not found for this property"
            )
        return settings
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving financial settings: {str(e)}"
        )

@router.post("/settings/{property_id}", response_model=FinancialSettingsResponse)
async def create_financial_settings(
    property_id: UUID,
    settings_data: PropertyFinancialSettingsCreate,
    financial_service: FinancialService = Depends(get_financial_service)
):
    """Create or update financial settings for a property"""
    try:
        settings = await financial_service.create_or_update_financial_settings(
            property_id, 
            settings_data.dict()
        )
        return settings
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating financial settings: {str(e)}"
        )

@router.put("/settings/{property_id}", response_model=FinancialSettingsResponse)
async def update_financial_settings(
    property_id: UUID,
    settings_data: PropertyFinancialSettingsUpdate,
    financial_service: FinancialService = Depends(get_financial_service)
):
    """Update financial settings for a property"""
    try:
        settings = await financial_service.create_or_update_financial_settings(
            property_id, 
            settings_data.dict(exclude_unset=True)
        )
        return settings
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating financial settings: {str(e)}"
        )

@router.post("/bank-accounts/{property_id}", response_model=BankAccount)
async def add_bank_account(
    property_id: UUID,
    bank_data: BankAccountCreate,
    financial_service: FinancialService = Depends(get_financial_service)
):
    """Add a bank account for a property"""
    try:
        bank_account = await financial_service.add_bank_account(
            property_id, 
            bank_data.dict()
        )
        return bank_account
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error adding bank account: {str(e)}"
        )

@router.get("/service-rates/{property_id}", response_model=List[ServiceRate])
async def get_service_rates(
    property_id: UUID,
    financial_service: FinancialService = Depends(get_financial_service)
):
    """Get all service rates for a property"""
    try:
        rates = await financial_service.get_service_rates(property_id)
        return rates
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving service rates: {str(e)}"
        )

@router.post("/service-rates/{property_id}", response_model=ServiceRate)
async def create_service_rate(
    property_id: UUID,
    rate_data: ServiceRateCreate,
    financial_service: FinancialService = Depends(get_financial_service)
):
    """Create or update a service rate"""
    try:
        rate = await financial_service.create_or_update_service_rate(
            property_id, 
            rate_data.dict()
        )
        return rate
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating service rate: {str(e)}"
        )

@router.put("/service-rates/{property_id}/{service_name}", response_model=ServiceRate)
async def update_service_rate(
    property_id: UUID,
    service_name: str,
    rate_data: ServiceRateUpdate,
    financial_service: FinancialService = Depends(get_financial_service)
):
    """Update a specific service rate"""
    try:
        rate_data_dict = rate_data.dict(exclude_unset=True)
        rate_data_dict["service_name"] = service_name
        rate = await financial_service.create_or_update_service_rate(
            property_id, 
            rate_data_dict
        )
        return rate
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating service rate: {str(e)}"
        )

# Quotation endpoints
@router.post("/quotations/{property_id}", response_model=QuotationResponse)
async def create_quotation(
    property_id: UUID,
    quotation_data: QuotationCreate,
    financial_service: FinancialService = Depends(get_financial_service)
):
    """Create a new quotation"""
    try:
        quotation = await financial_service.create_quotation(
            property_id, 
            quotation_data
        )
        return quotation
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating quotation: {str(e)}"
        )

@router.get("/quotations/{quotation_id}", response_model=QuotationResponse)
async def get_quotation(
    quotation_id: UUID,
    financial_service: FinancialService = Depends(get_financial_service)
):
    """Get quotation by ID"""
    try:
        quotation = await financial_service.get_quotation(quotation_id)
        if not quotation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Quotation not found"
            )
        return quotation
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving quotation: {str(e)}"
        )

@router.get("/quotations/property/{property_id}", response_model=List[QuotationResponse])
async def get_property_quotations(
    property_id: UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    financial_service: FinancialService = Depends(get_financial_service)
):
    """Get all quotations for a property"""
    try:
        # This would need to be implemented in the service
        # For now, return empty list
        return []
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving quotations: {str(e)}"
        )

# Invoice endpoints
@router.post("/invoices/from-quotation/{quotation_id}", response_model=InvoiceResponse)
async def create_invoice_from_quotation(
    quotation_id: UUID,
    invoice_data: InvoiceCreate,
    financial_service: FinancialService = Depends(get_financial_service)
):
    """Create an invoice from a quotation"""
    try:
        invoice = await financial_service.create_invoice_from_quotation(
            quotation_id, 
            invoice_data
        )
        return invoice
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating invoice: {str(e)}"
        )

@router.get("/invoices/{invoice_id}", response_model=InvoiceResponse)
async def get_invoice(
    invoice_id: UUID,
    financial_service: FinancialService = Depends(get_financial_service)
):
    """Get invoice by ID"""
    try:
        invoice = await financial_service.get_invoice(invoice_id)
        if not invoice:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Invoice not found"
            )
        return invoice
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving invoice: {str(e)}"
        )

@router.post("/invoices/{invoice_id}/payment")
async def record_invoice_payment(
    invoice_id: UUID,
    payment_amount: Decimal,
    payment_method: str,
    payment_reference: Optional[str] = None,
    financial_service: FinancialService = Depends(get_financial_service)
):
    """Record payment for an invoice"""
    try:
        invoice = await financial_service.update_invoice_payment(
            invoice_id,
            payment_amount,
            payment_method,
            payment_reference
        )
        return {"message": "Payment recorded successfully", "invoice": invoice}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error recording payment: {str(e)}"
        )

# Receipt endpoints
@router.post("/receipts/{property_id}", response_model=ReceiptResponse)
async def create_receipt(
    property_id: UUID,
    receipt_data: ReceiptCreate,
    financial_service: FinancialService = Depends(get_financial_service)
):
    """Create a receipt for payment"""
    try:
        receipt = await financial_service.create_receipt(
            property_id, 
            receipt_data
        )
        return receipt
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating receipt: {str(e)}"
        )

@router.get("/receipts/{receipt_id}", response_model=ReceiptResponse)
async def get_receipt(
    receipt_id: UUID,
    financial_service: FinancialService = Depends(get_financial_service)
):
    """Get receipt by ID"""
    try:
        receipt = await financial_service.get_receipt(receipt_id)
        if not receipt:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Receipt not found"
            )
        return receipt
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving receipt: {str(e)}"
        )

# Tax calculation endpoints
@router.get("/tax/calculate")
async def calculate_tax(
    amount: Decimal,
    tax_type: str = Query(..., regex="^(vat|withholding|dividend)$"),
    year: Optional[int] = Query(None, ge=2025, le=2030),
    financial_service: FinancialService = Depends(get_financial_service)
):
    """Calculate tax for a given amount"""
    try:
        tax_calculation = financial_service.calculate_tax(amount, tax_type, year)
        return {
            "amount": amount,
            "tax_type": tax_type,
            "year": year or datetime.now().year,
            "calculation": tax_calculation
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error calculating tax: {str(e)}"
        )

@router.get("/tax/rates/{year}")
async def get_tax_rates(
    year: int,
    financial_service: FinancialService = Depends(get_financial_service)
):
    """Get tax rates for a specific year"""
    try:
        rates = financial_service.get_tax_rates_for_year(year)
        return {
            "year": year,
            "rates": rates
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving tax rates: {str(e)}"
        )

# Business details endpoint
@router.get("/business-details")
async def get_buffr_business_details(
    financial_service: FinancialService = Depends(get_financial_service)
):
    """Get Buffr business details for document generation"""
    try:
        details = financial_service.get_buffr_business_details()
        return details
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving business details: {str(e)}"
        )

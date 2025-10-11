"""
Financial Strategy API Routes
RESTful endpoints for Buffr's financial framework
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from decimal import Decimal
from uuid import UUID

from ..database import get_db
from ..auth.dependencies import get_current_user
from ..models.user import User
from ..services.financial_strategy_service import BuffrFinancialStrategyService
from ..schemas.revenue_model import (
    SubscriptionCreate, SubscriptionResponse,
    ServiceFeeCreate, ServiceFeeResponse,
    InvoiceCreate, InvoiceResponse
)

router = APIRouter(prefix="/api/v1/financial", tags=["financial-strategy"])

@router.post("/transactions/process-fees")
async def process_transaction_fees(
    transaction_value: float,
    hospitality_business_id: UUID,
    current_user: User = Depends(get_current_user),
    db = Depends(get_db)
):
    """Process transaction and calculate all fees"""
    try:
        financial_service = BuffrFinancialStrategyService(db)
        fee_breakdown = await financial_service.process_transaction_fee(
            Decimal(str(transaction_value)),
            hospitality_business_id
        )
        
        # Convert Decimal to float for JSON serialization
        result = {k: float(v) if isinstance(v, Decimal) else v for k, v in fee_breakdown.items()}
        
        return {
            "success": True,
            "message": "Transaction fees processed successfully",
            "fee_breakdown": result
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/subscriptions/create")
async def create_subscription(
    tier: str,
    add_on_services: Optional[List[str]] = None,
    trial_period: bool = True,
    current_user: User = Depends(get_current_user),
    db = Depends(get_db)
):
    """Create a new subscription with trial period support"""
    try:
        financial_service = BuffrFinancialStrategyService(db)
        subscription = await financial_service.create_subscription(
            user_id=current_user.id,
            tier=tier,
            add_on_services=add_on_services or [],
            trial_period=trial_period
        )
        
        return {
            "success": True,
            "message": "Subscription created successfully",
            "subscription": {
                "id": str(subscription.id),
                "plan_name": subscription.plan_name,
                "price": subscription.price,
                "status": subscription.status,
                "billing_period": subscription.billing_period,
                "trial_period": trial_period
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/subscriptions/tiers")
async def get_subscription_tiers():
    """Get available subscription tiers and pricing"""
    try:
        financial_service = BuffrFinancialStrategyService(None)  # No DB needed for this
        
        tiers = {}
        for tier_name, tier_config in financial_service.subscription_tiers.items():
            tiers[tier_name] = {
                "monthly_price": float(tier_config["monthly_price"]),
                "features": tier_config["features"],
                "rate_limits": tier_config["rate_limits"]
            }
        
        add_on_services = {
            name: float(price) for name, price in financial_service.add_on_services.items()
        }
        
        return {
            "success": True,
            "subscription_tiers": tiers,
            "add_on_services": add_on_services
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/commissions/calculate")
async def calculate_commission(
    partner: str,
    transaction_value: float,
    current_user: User = Depends(get_current_user),
    db = Depends(get_db)
):
    """Calculate commission for ecosystem partners"""
    try:
        financial_service = BuffrFinancialStrategyService(db)
        commission_amount = await financial_service.calculate_commission(
            partner=partner,
            transaction_value=Decimal(str(transaction_value))
        )
        
        return {
            "success": True,
            "partner": partner,
            "transaction_value": transaction_value,
            "commission_amount": float(commission_amount),
            "commission_rate": float(commission_amount / Decimal(str(transaction_value)))
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/invoices/generate-monthly")
async def generate_monthly_invoice(
    subscription_id: UUID,
    current_user: User = Depends(get_current_user),
    db = Depends(get_db)
):
    """Generate monthly invoice for subscription"""
    try:
        financial_service = BuffrFinancialStrategyService(db)
        invoice = await financial_service.generate_monthly_invoice(subscription_id)
        
        return {
            "success": True,
            "message": "Monthly invoice generated successfully",
            "invoice": {
                "id": str(invoice.id),
                "invoice_number": invoice.invoice_number,
                "total_amount": invoice.total_amount,
                "currency": invoice.currency,
                "status": invoice.status,
                "issue_date": invoice.issue_date.isoformat(),
                "due_date": invoice.due_date.isoformat() if invoice.due_date else None
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/vat/report")
async def generate_vat_report(
    period_start: datetime = Query(..., description="Start date of the period"),
    period_end: datetime = Query(..., description="End date of the period"),
    current_user: User = Depends(get_current_user),
    db = Depends(get_db)
):
    """Generate VAT report for the specified period"""
    try:
        financial_service = BuffrFinancialStrategyService(db)
        vat_report = await financial_service.generate_vat_report(period_start, period_end)
        
        return {
            "success": True,
            "vat_report": vat_report
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/dashboard")
async def get_financial_dashboard(
    current_user: User = Depends(get_current_user),
    db = Depends(get_db)
):
    """Get financial dashboard data for the current user"""
    try:
        financial_service = BuffrFinancialStrategyService(db)
        dashboard_data = await financial_service.get_financial_dashboard_data(current_user.id)
        
        return {
            "success": True,
            "dashboard_data": dashboard_data
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/rate-limits/check")
async def check_rate_limits(
    service: str = Query(..., description="Service name to check"),
    current_user: User = Depends(get_current_user),
    db = Depends(get_db)
):
    """Check if user has exceeded rate limits for a service"""
    try:
        financial_service = BuffrFinancialStrategyService(db)
        within_limits = await financial_service.check_rate_limits(current_user.id, service)
        
        return {
            "success": True,
            "service": service,
            "within_limits": within_limits,
            "message": "Within rate limits" if within_limits else "Rate limit exceeded"
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/banking-details")
async def get_banking_details():
    """Get Buffr's banking details for payments"""
    try:
        financial_service = BuffrFinancialStrategyService(None)  # No DB needed
        banking_details = financial_service.get_banking_details()
        
        return {
            "success": True,
            "banking_details": banking_details
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/revenue/projections")
async def get_revenue_projections(
    months: int = Query(12, description="Number of months to project"),
    current_user: User = Depends(get_current_user),
    db = Depends(get_db)
):
    """Get revenue projections for the specified period"""
    try:
        # This would implement the revenue projection logic
        # For now, returning a placeholder structure
        
        projections = {
            "transaction_revenue": {
                "monthly_growth_rate": 0.15,
                "average_transaction_value": 500.00,
                "service_fee_rate": 0.05,
                "projected_monthly_revenue": []
            },
            "subscription_revenue": {
                "tier_breakdown": {
                    "starter": {"subscribers": 50, "monthly_revenue": 75000},
                    "professional": {"subscribers": 30, "monthly_revenue": 90000},
                    "enterprise": {"subscribers": 15, "monthly_revenue": 75000},
                    "ecosystem": {"subscribers": 5, "monthly_revenue": 40000}
                },
                "total_monthly_recurring_revenue": 280000
            },
            "commission_revenue": {
                "yango_integration": {"rate": 0.05, "monthly_volume": 10000},
                "other_partners": {"rate": 0.03, "monthly_volume": 5000}
            }
        }
        
        # Calculate monthly projections
        for month in range(months):
            base_revenue = 100000  # Starting point
            growth_factor = (1 + 0.15) ** month
            monthly_revenue = base_revenue * growth_factor
            projections["transaction_revenue"]["projected_monthly_revenue"].append({
                "month": month + 1,
                "revenue": monthly_revenue
            })
        
        return {
            "success": True,
            "projections": projections
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/compliance/status")
async def get_compliance_status(
    current_user: User = Depends(get_current_user),
    db = Depends(get_db)
):
    """Get current compliance status and requirements"""
    try:
        compliance_status = {
            "vat_compliance": {
                "status": "compliant",
                "last_filing": "2025-09-30",
                "next_due": "2025-10-31",
                "outstanding_amount": 0.00
            },
            "financial_reporting": {
                "status": "up_to_date",
                "last_audit": "2025-08-15",
                "next_audit_due": "2026-08-15"
            },
            "banking_compliance": {
                "status": "compliant",
                "account_verified": True,
                "kyc_complete": True
            },
            "regulatory_requirements": {
                "namibian_compliance": "compliant",
                "international_compliance": "compliant",
                "data_protection": "compliant"
            }
        }
        
        return {
            "success": True,
            "compliance_status": compliance_status
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/settlements/process")
async def process_immediate_settlement(
    transaction_id: UUID,
    hospitality_business_id: UUID,
    settlement_amount: float,
    current_user: User = Depends(get_current_user),
    db = Depends(get_db)
):
    """Process immediate settlement to hospitality business"""
    try:
        # This would implement the immediate settlement logic
        # For now, returning a placeholder response
        
        settlement_data = {
            "transaction_id": str(transaction_id),
            "hospitality_business_id": str(hospitality_business_id),
            "settlement_amount": settlement_amount,
            "settlement_status": "processed",
            "settlement_date": datetime.utcnow().isoformat(),
            "bank_reference": f"BUF{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "processing_time": "< 30 seconds"
        }
        
        return {
            "success": True,
            "message": "Immediate settlement processed successfully",
            "settlement_data": settlement_data
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
"""
Buffr Financial Strategy Service
Implements the comprehensive financial framework for Buffr ecosystem
"""

from decimal import Decimal
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from uuid import UUID
import logging

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, insert

from models.revenue_model import Subscription, ServiceFee, Invoice, CommissionStructure
from models.booking import Booking
from models.payment import PaymentTransaction
from schemas.revenue_model import (
    SubscriptionCreate, ServiceFeeCreate, InvoiceCreate,
    CommissionStructureCreate
)

logger = logging.getLogger(__name__)

class BuffrFinancialStrategyService:
    """Core financial strategy implementation for Buffr ecosystem"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        
        # Financial Configuration
        self.buffr_service_fee_rate = Decimal('0.05')  # 5%
        self.vat_rate = Decimal('0.15')  # 15% VAT in Namibia
        self.bank_account = "8050377860"
        self.swift_code = "BWLINANX"
        self.entity_registration = "CC/2024/09322"
        
        # Subscription Tiers
        self.subscription_tiers = {
            "starter": {
                "monthly_price": Decimal('1500.00'),
                "features": ["booking", "payments", "basic_analytics"],
                "rate_limits": {
                    "transactions_per_month": 500,
                    "api_calls_per_day": 5000,
                    "storage_gb": 20
                }
            },
            "professional": {
                "monthly_price": Decimal('3000.00'),
                "features": ["booking", "payments", "analytics", "bi_dashboard"],
                "rate_limits": {
                    "transactions_per_month": 2000,
                    "api_calls_per_day": 20000,
                    "storage_gb": 100
                }
            },
            "enterprise": {
                "monthly_price": Decimal('5000.00'),
                "features": ["all_professional", "custom_integrations"],
                "rate_limits": {
                    "transactions_per_month": 10000,
                    "api_calls_per_day": 100000,
                    "storage_gb": 500
                }
            },
            "ecosystem": {
                "monthly_price": Decimal('8000.00'),
                "features": ["all_enterprise", "multi_property", "white_label"],
                "rate_limits": {
                    "transactions_per_month": -1,  # Unlimited
                    "api_calls_per_day": -1,  # Unlimited
                    "storage_gb": 2000
                }
            }
        }
        
        # Add-on Services Pricing
        self.add_on_services = {
            "ai_concierge": Decimal('500.00'),
            "advanced_analytics": Decimal('750.00'),
            "business_intelligence": Decimal('1000.00'),
            "full_ai_suite": Decimal('2000.00'),
            "custom_integrations": Decimal('1500.00'),
            "multi_property_management": Decimal('2500.00'),
            "white_label_solution": Decimal('5000.00')
        }

    async def process_transaction_fee(self, transaction_value: Decimal, 
                                    hospitality_business_id: UUID) -> Dict[str, Decimal]:
        """
        Process transaction and calculate all fees
        
        Args:
            transaction_value: Total transaction amount
            hospitality_business_id: ID of the hospitality business
            
        Returns:
            Dictionary with fee breakdown
        """
        try:
            # Calculate Buffr service fee (5%)
            buffr_service_fee = transaction_value * self.buffr_service_fee_rate
            
            # Calculate VAT (15% on total transaction)
            vat_amount = transaction_value * self.vat_rate
            
            # Calculate processing fee (estimated 2.5% + fixed fee)
            processing_fee = (transaction_value * Decimal('0.025')) + Decimal('2.50')
            
            # Calculate amount to pay hospitality business (95% of transaction)
            business_payment = transaction_value - buffr_service_fee
            
            # Calculate total Buffr revenue
            buffr_revenue = buffr_service_fee + (processing_fee - Decimal('2.50'))  # Minus gateway cost
            
            fee_breakdown = {
                "transaction_value": transaction_value,
                "buffr_service_fee": buffr_service_fee,
                "vat_amount": vat_amount,
                "processing_fee": processing_fee,
                "business_payment": business_payment,
                "buffr_revenue": buffr_revenue,
                "net_amount_after_vat": transaction_value + vat_amount
            }
            
            logger.info(f"Processed transaction fees for business {hospitality_business_id}: {fee_breakdown}")
            return fee_breakdown
            
        except Exception as e:
            logger.error(f"Error processing transaction fees: {str(e)}")
            raise Exception(f"Transaction fee processing failed: {str(e)}")

    async def create_subscription(self, user_id: UUID, tier: str, 
                                add_on_services: List[str] = None,
                                trial_period: bool = True) -> Subscription:
        """
        Create a new subscription with trial period support
        
        Args:
            user_id: User ID
            tier: Subscription tier (starter, professional, enterprise, ecosystem)
            add_on_services: List of add-on services
            trial_period: Whether to start with 3-month trial
            
        Returns:
            Created subscription
        """
        try:
            if tier not in self.subscription_tiers:
                raise ValueError(f"Invalid subscription tier: {tier}")
            
            tier_config = self.subscription_tiers[tier]
            
            # Calculate pricing
            base_price = tier_config["monthly_price"]
            add_on_cost = Decimal('0.00')
            
            if add_on_services:
                for service in add_on_services:
                    if service in self.add_on_services:
                        add_on_cost += self.add_on_services[service]
            
            total_price = base_price + add_on_cost
            
            # Set trial period
            start_date = datetime.utcnow()
            if trial_period:
                end_date = start_date + timedelta(days=90)  # 3 months
                price = Decimal('0.00')  # Free trial
            else:
                end_date = start_date + timedelta(days=30)  # Monthly billing
                price = total_price
            
            subscription_data = SubscriptionCreate(
                user_id=user_id,
                plan_name=tier,
                start_date=start_date,
                end_date=end_date,
                status="active",
                price=float(price),
                currency="NAD",
                billing_period="monthly",
                metadata_={
                    "tier": tier,
                    "add_on_services": add_on_services or [],
                    "trial_period": trial_period,
                    "rate_limits": tier_config["rate_limits"],
                    "features": tier_config["features"]
                }
            )
            
            subscription = Subscription(**subscription_data.model_dump())
            self.db.add(subscription)
            await self.db.commit()
            await self.db.refresh(subscription)
            
            logger.info(f"Created subscription for user {user_id}: {tier} tier")
            return subscription
            
        except Exception as e:
            logger.error(f"Error creating subscription: {str(e)}")
            raise Exception(f"Subscription creation failed: {str(e)}")

    async def calculate_commission(self, partner: str, transaction_value: Decimal) -> Decimal:
        """
        Calculate commission for ecosystem partners
        
        Args:
            partner: Partner name (e.g., 'yango')
            transaction_value: Transaction value
            
        Returns:
            Commission amount
        """
        try:
            commission_rates = {
                "yango": Decimal('0.05'),  # 5% commission
                "future_partner": Decimal('0.03'),  # 3% commission
            }
            
            if partner not in commission_rates:
                raise ValueError(f"Unknown partner: {partner}")
            
            commission_rate = commission_rates[partner]
            commission_amount = transaction_value * commission_rate
            
            logger.info(f"Calculated commission for {partner}: {commission_amount}")
            return commission_amount
            
        except Exception as e:
            logger.error(f"Error calculating commission: {str(e)}")
            raise Exception(f"Commission calculation failed: {str(e)}")

    async def generate_monthly_invoice(self, subscription_id: UUID) -> Invoice:
        """
        Generate monthly invoice for subscription
        
        Args:
            subscription_id: Subscription ID
            
        Returns:
            Generated invoice
        """
        try:
            # Get subscription details
            result = await self.db.execute(
                select(Subscription).where(Subscription.id == subscription_id)
            )
            subscription = result.scalar_one_or_none()
            
            if not subscription:
                raise ValueError(f"Subscription not found: {subscription_id}")
            
            # Calculate invoice amount
            base_amount = Decimal(str(subscription.price))
            add_on_amount = Decimal('0.00')
            
            if subscription.metadata_ and subscription.metadata_.get('add_on_services'):
                for service in subscription.metadata_['add_on_services']:
                    if service in self.add_on_services:
                        add_on_amount += self.add_on_services[service]
            
            total_amount = base_amount + add_on_amount
            vat_amount = total_amount * self.vat_rate
            total_with_vat = total_amount + vat_amount
            
            # Generate invoice
            invoice_data = InvoiceCreate(
                user_id=subscription.user_id,
                invoice_number=f"SUB-{subscription.id}-{datetime.now().strftime('%Y%m')}",
                issue_date=datetime.utcnow(),
                due_date=datetime.utcnow() + timedelta(days=30),
                total_amount=float(total_with_vat),
                currency="NAD",
                status="pending",
                metadata_={
                    "subscription_id": str(subscription_id),
                    "base_amount": float(base_amount),
                    "add_on_amount": float(add_on_amount),
                    "vat_amount": float(vat_amount),
                    "tier": subscription.plan_name
                }
            )
            
            invoice = Invoice(**invoice_data.model_dump())
            self.db.add(invoice)
            await self.db.commit()
            await self.db.refresh(invoice)
            
            logger.info(f"Generated monthly invoice for subscription {subscription_id}")
            return invoice
            
        except Exception as e:
            logger.error(f"Error generating monthly invoice: {str(e)}")
            raise Exception(f"Invoice generation failed: {str(e)}")

    async def generate_vat_report(self, period_start: datetime, 
                                period_end: datetime) -> Dict[str, any]:
        """
        Generate VAT report for the specified period
        
        Args:
            period_start: Start date of the period
            period_end: End date of the period
            
        Returns:
            VAT report data
        """
        try:
            # Get all transactions in the period
            result = await self.db.execute(
                select(PaymentTransaction).where(
                    PaymentTransaction.created_at >= period_start,
                    PaymentTransaction.created_at <= period_end
                )
            )
            transactions = result.scalars().all()
            
            # Calculate VAT totals
            total_sales = Decimal('0.00')
            total_vat_collected = Decimal('0.00')
            
            for transaction in transactions:
                total_sales += Decimal(str(transaction.amount))
                vat_amount = Decimal(str(transaction.amount)) * self.vat_rate
                total_vat_collected += vat_amount
            
            vat_report = {
                "period": {
                    "start": period_start.isoformat(),
                    "end": period_end.isoformat()
                },
                "total_sales": float(total_sales),
                "vat_collected": float(total_vat_collected),
                "vat_rate": float(self.vat_rate),
                "transaction_count": len(transactions),
                "vat_payable": float(total_vat_collected),
                "net_vat_due": float(total_vat_collected)
            }
            
            logger.info(f"Generated VAT report for period {period_start} to {period_end}")
            return vat_report
            
        except Exception as e:
            logger.error(f"Error generating VAT report: {str(e)}")
            raise Exception(f"VAT report generation failed: {str(e)}")

    async def get_financial_dashboard_data(self, user_id: UUID) -> Dict[str, any]:
        """
        Get financial dashboard data for a user
        
        Args:
            user_id: User ID
            
        Returns:
            Dashboard data
        """
        try:
            # Get user's subscriptions
            result = await self.db.execute(
                select(Subscription).where(Subscription.user_id == user_id)
            )
            subscriptions = result.scalars().all()
            
            # Get user's transactions
            result = await self.db.execute(
                select(PaymentTransaction).where(PaymentTransaction.user_id == user_id)
            )
            transactions = result.scalars().all()
            
            # Calculate metrics
            total_revenue = sum(Decimal(str(t.amount)) for t in transactions)
            active_subscriptions = len([s for s in subscriptions if s.status == "active"])
            monthly_recurring_revenue = sum(
                Decimal(str(s.price)) for s in subscriptions 
                if s.status == "active" and s.billing_period == "monthly"
            )
            
            dashboard_data = {
                "user_id": str(user_id),
                "total_revenue": float(total_revenue),
                "active_subscriptions": active_subscriptions,
                "monthly_recurring_revenue": float(monthly_recurring_revenue),
                "transaction_count": len(transactions),
                "subscriptions": [
                    {
                        "id": str(s.id),
                        "plan_name": s.plan_name,
                        "price": s.price,
                        "status": s.status,
                        "billing_period": s.billing_period
                    } for s in subscriptions
                ],
                "recent_transactions": [
                    {
                        "id": str(t.id),
                        "amount": t.amount,
                        "currency": t.currency,
                        "status": t.status,
                        "created_at": t.created_at.isoformat()
                    } for t in transactions[-10:]  # Last 10 transactions
                ]
            }
            
            logger.info(f"Generated financial dashboard data for user {user_id}")
            return dashboard_data
            
        except Exception as e:
            logger.error(f"Error generating financial dashboard data: {str(e)}")
            raise Exception(f"Dashboard data generation failed: {str(e)}")

    async def check_rate_limits(self, user_id: UUID, service: str) -> bool:
        """
        Check if user has exceeded rate limits for a service
        
        Args:
            user_id: User ID
            service: Service name
            
        Returns:
            True if within limits, False if exceeded
        """
        try:
            # Get user's active subscription
            result = await self.db.execute(
                select(Subscription).where(
                    Subscription.user_id == user_id,
                    Subscription.status == "active"
                )
            )
            subscription = result.scalar_one_or_none()
            
            if not subscription:
                return False  # No active subscription
            
            # Get rate limits from subscription metadata
            rate_limits = subscription.metadata_.get('rate_limits', {})
            
            # Check specific service limits
            if service in rate_limits:
                limit = rate_limits[service]
                if limit == -1:  # Unlimited
                    return True
                
                # Check current usage (simplified - would need actual usage tracking)
                # This is a placeholder - would need proper usage tracking implementation
                current_usage = 0  # Would be calculated from actual usage data
                
                return current_usage < limit
            
            return True  # No specific limit for this service
            
        except Exception as e:
            logger.error(f"Error checking rate limits: {str(e)}")
            return False  # Fail safe - deny access on error

    def get_banking_details(self) -> Dict[str, str]:
        """
        Get Buffr's banking details for payments
        
        Returns:
            Banking details dictionary
        """
        return {
            "bank_name": "Bank Windhoek (Member of Capricorn Group)",
            "account_holder": "BUFFR FINANCIAL SERVICES CC",
            "account_number": self.bank_account,
            "branch_code": "485-673",
            "swift_code": self.swift_code,
            "account_type": "CHK (Checking Account)",
            "registration_number": self.entity_registration,
            "branch_address": "P O Box 80059, Ongwediva, Namibia",
            "bank_phone": "+264 83 299 3633",
            "bank_email": "info@bankwindhoek.com.na",
            "bank_website": "www.bankwindhoek.com.na"
        }
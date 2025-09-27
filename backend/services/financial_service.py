"""
Financial Service for Buffr Host
Handles quotations, invoices, receipts, and tax calculations for Namibia
"""

from datetime import datetime, date, timedelta
from decimal import Decimal
from typing import List, Optional, Dict, Any
from uuid import UUID, uuid4
import logging

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from sqlalchemy.orm import selectinload

from models.financial_settings import (
    PropertyFinancialSettings, 
    ServiceRate, 
    Receipt,
    ReceiptItem,
    FinancialTransaction
)
from models.corporate import Quotation, Invoice
from models.corporate import CorporateCustomer, CorporateBooking
from schemas.financial_settings import (
    Create, 
    Update,
    Create, 
    Update,
    ReceiptCreate,
    ServiceRateCreate,
    Create
)

logger = logging.getLogger(__name__)

class FinancialService:
    """Service for managing financial operations including quotations, invoices, and receipts"""
    
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session
        
        # Buffr business details
        self.buffr_details = {
            "company_name": "Buffr Financial Services CC",
            "registration_number": "CC/2024/09322", 
            "vat_number": "VAT123456789",  
            "physical_address": "Hochland Park, Kingfisher Street, ERF 1937, Fisher Courts, Unit 51, Windhoek",
            "postal_address": "PO Box 90022, Ongwediva, Namibia",
            "email": "george@buffr.ai",
            "phone": "+264 61 123 4567",  
            "website": "https://www.hostbuffr.ai"
        }
        
        # Namibia tax rates by year (updated with 2025/2026 budget changes)
        self.tax_rates = {
            2025: {
                "vat_rate": Decimal("0.15"),  # 15% VAT
                "corporate_tax": Decimal("0.30"),  # Reduced to 30% for non-mining
                "dividend_tax": Decimal("0.00"),  # No dividend tax in 2025
                "withholding_tax": Decimal("0.10"),  # 10% WHT
                "personal_tax_brackets": [
                    {"min": 0, "max": 100000, "rate": Decimal("0.00")},
                    {"min": 100000, "max": 150000, "rate": Decimal("0.18")},
                    {"min": 150000, "max": 350000, "rate": Decimal("0.25")},
                    {"min": 350000, "max": 550000, "rate": Decimal("0.28")},
                    {"min": 550000, "max": 850000, "rate": Decimal("0.30")},
                    {"min": 850000, "max": 1550000, "rate": Decimal("0.32")},
                    {"min": 1550000, "max": None, "rate": Decimal("0.37")}
                ]
            },
            2026: {
                "vat_rate": Decimal("0.15"),  # 15% VAT
                "corporate_tax": Decimal("0.28"),  # Further reduced to 28%
                "dividend_tax": Decimal("0.10"),  # 10% dividend tax introduced
                "withholding_tax": Decimal("0.10"),  # 10% WHT
                "personal_tax_brackets": [
                    {"min": 0, "max": 100000, "rate": Decimal("0.00")},
                    {"min": 100000, "max": 150000, "rate": Decimal("0.18")},
                    {"min": 150000, "max": 350000, "rate": Decimal("0.25")},
                    {"min": 350000, "max": 550000, "rate": Decimal("0.28")},
                    {"min": 550000, "max": 850000, "rate": Decimal("0.30")},
                    {"min": 850000, "max": 1550000, "rate": Decimal("0.32")},
                    {"min": 1550000, "max": None, "rate": Decimal("0.37")}
                ]
            },
            2027: {
                "vat_rate": Decimal("0.15"),  # 15% VAT
                "corporate_tax": Decimal("0.28"),  # Maintained at 28%
                "dividend_tax": Decimal("0.10"),  # 10% dividend tax
                "withholding_tax": Decimal("0.10"),  # 10% WHT
                "personal_tax_brackets": [
                    # Adjusted for inflation (to be updated when announced)
                    {"min": 0, "max": 100000, "rate": Decimal("0.00")},
                    {"min": 100000, "max": 150000, "rate": Decimal("0.18")},
                    {"min": 150000, "max": 350000, "rate": Decimal("0.25")},
                    {"min": 350000, "max": 550000, "rate": Decimal("0.28")},
                    {"min": 550000, "max": 850000, "rate": Decimal("0.30")},
                    {"min": 850000, "max": 1550000, "rate": Decimal("0.32")},
                    {"min": 1550000, "max": None, "rate": Decimal("0.37")}
                ]
            }
        }

    async def get_property_financial_settings(self, property_id: UUID) -> Optional[PropertyFinancialSettings]:
        """Get financial settings for a property"""
        try:
            result = await self.db_session.execute(
                select(PropertyFinancialSettings)
                .where(PropertyFinancialSettings.property_id == property_id)
                .options(selectinload(PropertyFinancialSettings.bank_accounts))
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error getting property financial settings: {e}")
            return None

    async def create_or_update_financial_settings(
        self, 
        property_id: UUID, 
        settings_data: Dict[str, Any]
    ) -> PropertyFinancialSettings:
        """Create or update financial settings for a property"""
        try:
            # Check if settings exist
            existing = await self.get_property_financial_settings(property_id)
            
            if existing:
                # Update existing settings
                for key, value in settings_data.items():
                    if hasattr(existing, key):
                        setattr(existing, key, value)
                existing.updated_at = datetime.utcnow()
                await self.db_session.commit()
                return existing
            else:
                # Create new settings
                settings = PropertyFinancialSettings(
                    property_id=property_id,
                    **settings_data
                )
                self.db_session.add(settings)
                await self.db_session.commit()
                await self.db_session.refresh(settings)
                return settings
        except Exception as e:
            logger.error(f"Error creating/updating financial settings: {e}")
            await self.db_session.rollback()
            raise

    async def add_bank_account(
        self, 
        property_id: UUID, 
        bank_data: Dict[str, Any]
    ) -> PropertyFinancialSettings:
        """Add a bank account for a property"""
        try:
            bank_account = PropertyFinancialSettings(
                property_id=property_id,
                **bank_data
            )
            self.db_session.add(bank_account)
            await self.db_session.commit()
            await self.db_session.refresh(bank_account)
            return bank_account
        except Exception as e:
            logger.error(f"Error adding bank account: {e}")
            await self.db_session.rollback()
            raise

    async def get_service_rates(self, property_id: UUID) -> List[ServiceRate]:
        """Get all service rates for a property"""
        try:
            result = await self.db_session.execute(
                select(ServiceRate)
                .where(ServiceRate.property_id == property_id)
                .order_by(ServiceRate.service_name)
            )
            return result.scalars().all()
        except Exception as e:
            logger.error(f"Error getting service rates: {e}")
            return []

    async def create_or_update_service_rate(
        self, 
        property_id: UUID, 
        rate_data: Dict[str, Any]
    ) -> ServiceRate:
        """Create or update a service rate"""
        try:
            # Check if rate exists
            existing = await self.db_session.execute(
                select(ServiceRate)
                .where(
                    and_(
                        ServiceRate.property_id == property_id,
                        ServiceRate.service_name == rate_data["service_name"]
                    )
                )
            )
            existing_rate = existing.scalar_one_or_none()
            
            if existing_rate:
                # Update existing rate
                for key, value in rate_data.items():
                    if hasattr(existing_rate, key):
                        setattr(existing_rate, key, value)
                existing_rate.updated_at = datetime.utcnow()
                await self.db_session.commit()
                return existing_rate
            else:
                # Create new rate
                rate = ServiceRate(
                    property_id=property_id,
                    **rate_data
                )
                self.db_session.add(rate)
                await self.db_session.commit()
                await self.db_session.refresh(rate)
                return rate
        except Exception as e:
            logger.error(f"Error creating/updating service rate: {e}")
            await self.db_session.rollback()
            raise

    def calculate_tax(self, amount: Decimal, tax_type: str, year: int = None) -> Dict[str, Decimal]:
        """Calculate tax based on Namibia tax rates"""
        if year is None:
            year = datetime.now().year
        
        if year not in self.tax_rates:
            year = max(self.tax_rates.keys())  # Use latest available rates
        
        rates = self.tax_rates[year]
        
        if tax_type == "vat":
            vat_amount = amount * rates["vat_rate"]
            return {
                "tax_amount": vat_amount,
                "tax_rate": rates["vat_rate"],
                "gross_amount": amount + vat_amount
            }
        elif tax_type == "withholding":
            wht_amount = amount * rates["withholding_tax"]
            return {
                "tax_amount": wht_amount,
                "tax_rate": rates["withholding_tax"],
                "net_amount": amount - wht_amount
            }
        elif tax_type == "dividend":
            dividend_tax = amount * rates["dividend_tax"]
            return {
                "tax_amount": dividend_tax,
                "tax_rate": rates["dividend_tax"],
                "net_amount": amount - dividend_tax
            }
        
        return {"tax_amount": Decimal("0"), "tax_rate": Decimal("0"), "gross_amount": amount}

    async def create_quotation(
        self, 
        property_id: UUID, 
        quotation_data: Create
    ) -> PropertyFinancialSettings:
        """Create a new quotation"""
        try:
            # Generate quotation number
            quotation_number = await self._generate_quotation_number(property_id)
            
            # Calculate totals
            subtotal = sum(item.quantity * item.unit_price for item in quotation_data.items)
            tax_calc = self.calculate_tax(subtotal, "vat")
            tax_amount = tax_calc["tax_amount"]
            
            # Calculate discount
            discount_amount = subtotal * (quotation_data.discount_rate / 100) if quotation_data.discount_rate else Decimal("0")
            
            total_amount = subtotal + tax_amount - discount_amount
            
            # Create quotation
            quotation = Quotation(
                property_id=property_id,
                quotation_number=quotation_number,
                quotation_date=quotation_data.quotation_date or date.today(),
                valid_until=quotation_data.valid_until or date.today() + timedelta(days=30),
                status=quotation_data.status or "draft",
                subtotal=subtotal,
                tax_rate=Decimal("15.00"),  # 15% VAT
                tax_amount=tax_amount,
                discount_rate=quotation_data.discount_rate or Decimal("0"),
                discount_amount=discount_amount,
                total_amount=total_amount,
                terms_and_conditions=quotation_data.terms_and_conditions,
                notes=quotation_data.notes,
                prepared_by=quotation_data.prepared_by,
                sent_to_email=quotation_data.sent_to_email
            )
            
            self.db_session.add(quotation)
            await self.db_session.flush()  # Get the ID
            
            # Create quotation items
            for item_data in quotation_data.items:
                item = Item(
                    quotation_id=quotation.quotation_id,
                    item_type=item_data.item_type,
                    item_name=item_data.item_name,
                    description=item_data.description,
                    quantity=item_data.quantity,
                    unit_price=item_data.unit_price,
                    total_price=item_data.quantity * item_data.unit_price
                )
                self.db_session.add(item)
            
            await self.db_session.commit()
            await self.db_session.refresh(quotation)
            return quotation
            
        except Exception as e:
            logger.error(f"Error creating quotation: {e}")
            await self.db_session.rollback()
            raise

    async def create_invoice_from_quotation(
        self, 
        quotation_id: UUID, 
        invoice_data: Create
    ) -> PropertyFinancialSettings:
        """Create an invoice from a quotation"""
        try:
            # Get the quotation
            quotation_result = await self.db_session.execute(
                select(Quotation)
                .where(Quotation.quotation_id == quotation_id)
                .options(selectinload(Quotation.items))
            )
            quotation = quotation_result.scalar_one_or_none()
            
            if not quotation:
                raise ValueError("not found")
            
            # Generate invoice number
            invoice_number = await self._generate_invoice_number(quotation.property_id)
            
            # Create invoice
            invoice = Invoice(
                property_id=quotation.property_id,
                quotation_id=quotation_id,
                invoice_number=invoice_number,
                invoice_date=invoice_data.invoice_date or date.today(),
                due_date=invoice_data.due_date or date.today() + timedelta(days=30),
                status=invoice_data.status or "draft",
                subtotal=quotation.subtotal,
                tax_rate=quotation.tax_rate,
                tax_amount=quotation.tax_amount,
                discount_rate=quotation.discount_rate,
                discount_amount=quotation.discount_amount,
                total_amount=quotation.total_amount,
                balance_amount=quotation.total_amount,  # Initially unpaid
                payment_terms=invoice_data.payment_terms or 30,
                notes=invoice_data.notes
            )
            
            self.db_session.add(invoice)
            await self.db_session.flush()
            
            # Create invoice items from quotation items
            for quotation_item in quotation.items:
                item = Item(
                    invoice_id=invoice.invoice_id,
                    item_type=quotation_item.item_type,
                    item_name=quotation_item.item_name,
                    description=quotation_item.description,
                    quantity=quotation_item.quantity,
                    unit_price=quotation_item.unit_price,
                    total_price=quotation_item.total_price
                )
                self.db_session.add(item)
            
            # Update quotation status
            quotation.status = "converted_to_invoice"
            quotation.updated_at = datetime.utcnow()
            
            await self.db_session.commit()
            await self.db_session.refresh(invoice)
            return invoice
            
        except Exception as e:
            logger.error(f"Error creating invoice from quotation: {e}")
            await self.db_session.rollback()
            raise

    async def create_receipt(
        self, 
        property_id: UUID, 
        receipt_data: ReceiptCreate
    ) -> Receipt:
        """Create a receipt for payment"""
        try:
            # Generate receipt number
            receipt_number = await self._generate_receipt_number(property_id)
            
            # Calculate totals
            subtotal = sum(item.quantity * item.unit_price for item in receipt_data.items)
            tax_calc = self.calculate_tax(subtotal, "vat")
            tax_amount = tax_calc["tax_amount"]
            total_amount = subtotal + tax_amount
            
            # Create receipt
            receipt = Receipt(
                property_id=property_id,
                receipt_number=receipt_number,
                receipt_date=receipt_data.receipt_date or date.today(),
                payment_method=receipt_data.payment_method,
                payment_reference=receipt_data.payment_reference,
                subtotal=subtotal,
                tax_rate=Decimal("15.00"),  # 15% VAT
                tax_amount=tax_amount,
                total_amount=total_amount,
                notes=receipt_data.notes,
                issued_by=receipt_data.issued_by
            )
            
            self.db_session.add(receipt)
            await self.db_session.flush()
            
            # Create receipt items
            for item_data in receipt_data.items:
                item = ReceiptItem(
                    receipt_id=receipt.receipt_id,
                    item_type=item_data.item_type,
                    item_name=item_data.item_name,
                    description=item_data.description,
                    quantity=item_data.quantity,
                    unit_price=item_data.unit_price,
                    total_price=item_data.quantity * item_data.unit_price
                )
                self.db_session.add(item)
            
            await self.db_session.commit()
            await self.db_session.refresh(receipt)
            return receipt
            
        except Exception as e:
            logger.error(f"Error creating receipt: {e}")
            await self.db_session.rollback()
            raise

    async def _generate_quotation_number(self, property_id: UUID) -> str:
        """Generate unique quotation number"""
        year = datetime.now().year
        result = await self.db_session.execute(
            select(func.count(Quotation.quotation_id))
            .where(
                and_(
                    Quotation.property_id == property_id,
                    func.extract('year', Quotation.created_at) == year
                )
            )
        )
        count = result.scalar() or 0
        return f"QTN-{year}-{property_id.hex[:8].upper()}-{count + 1:04d}"

    async def _generate_invoice_number(self, property_id: UUID) -> str:
        """Generate unique invoice number"""
        year = datetime.now().year
        result = await self.db_session.execute(
            select(func.count(Invoice.invoice_id))
            .where(
                and_(
                    Invoice.property_id == property_id,
                    func.extract('year', Invoice.created_at) == year
                )
            )
        )
        count = result.scalar() or 0
        return f"INV-{year}-{property_id.hex[:8].upper()}-{count + 1:04d}"

    async def _generate_receipt_number(self, property_id: UUID) -> str:
        """Generate unique receipt number"""
        year = datetime.now().year
        result = await self.db_session.execute(
            select(func.count(Receipt.receipt_id))
            .where(
                and_(
                    Receipt.property_id == property_id,
                    func.extract('year', Receipt.created_at) == year
                )
            )
        )
        count = result.scalar() or 0
        return f"RCP-{year}-{property_id.hex[:8].upper()}-{count + 1:04d}"

    async def get_quotation(self, quotation_id: UUID) -> Optional[Quotation]:
        """Get quotation by ID with items"""
        try:
            result = await self.db_session.execute(
                select(Quotation)
                .where(Quotation.quotation_id == quotation_id)
                .options(selectinload(Quotation.items))
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error getting quotation: {e}")
            return None

    async def get_invoice(self, invoice_id: UUID) -> Optional[Invoice]:
        """Get invoice by ID with items"""
        try:
            result = await self.db_session.execute(
                select(Invoice)
                .where(Invoice.invoice_id == invoice_id)
                .options(selectinload(Invoice.items))
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error getting invoice: {e}")
            return None

    async def get_receipt(self, receipt_id: UUID) -> Optional[Receipt]:
        """Get receipt by ID with items"""
        try:
            result = await self.db_session.execute(
                select(Receipt)
                .where(Receipt.receipt_id == receipt_id)
                .options(selectinload(Receipt.items))
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error getting receipt: {e}")
            return None

    async def update_invoice_payment(
        self, 
        invoice_id: UUID, 
        payment_amount: Decimal, 
        payment_method: str,
        payment_reference: str = None
    ) -> PropertyFinancialSettings:
        """Update invoice with payment information"""
        try:
            result = await self.db_session.execute(
                select(Invoice)
                .where(Invoice.invoice_id == invoice_id)
            )
            invoice = result.scalar_one_or_none()
            
            if not invoice:
                raise ValueError("not found")
            
            # Update payment information
            invoice.paid_amount += payment_amount
            invoice.balance_amount = invoice.total_amount - invoice.paid_amount
            invoice.payment_method = payment_method
            invoice.payment_reference = payment_reference
            
            if invoice.balance_amount <= 0:
                invoice.status = "paid"
                invoice.paid_at = datetime.utcnow()
            else:
                invoice.status = "partially_paid"
            
            invoice.updated_at = datetime.utcnow()
            
            await self.db_session.commit()
            await self.db_session.refresh(invoice)
            return invoice
            
        except Exception as e:
            logger.error(f"Error updating invoice payment: {e}")
            await self.db_session.rollback()
            raise

    def get_buffr_business_details(self) -> Dict[str, str]:
        """Get Buffr business details for document generation"""
        return self.buffr_details.copy()

    def get_tax_rates_for_year(self, year: int) -> Dict[str, Any]:
        """Get tax rates for a specific year"""
        return self.tax_rates.get(year, self.tax_rates[max(self.tax_rates.keys())])

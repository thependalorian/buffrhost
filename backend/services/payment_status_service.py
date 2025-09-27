"""
Payment Status Tracking Service for Buffr Host.
Handles payment status updates, order completion flow, and notifications.
"""
import logging
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from models.order import Order
from models.payment import PaymentTransaction, PaymentWebhook
from models.user import User, Profile
from services.notification_service import NotificationService

logger = logging.getLogger(__name__)

class PaymentStatusService:
    """Service for tracking payment status and managing order completion flow."""
    
    def __init__(self, notification_service: Optional[NotificationService] = None):
        """Initialize payment status service."""
        self.notification_service = notification_service or NotificationService()
    
    async def update_payment_status(
        self,
        db: AsyncSession,
        transaction_id: UUID,
        status: str,
        is_successful: bool,
        additional_data: Optional[Dict[str, Any]] = None
    ) -> bool:
        """
        Update payment transaction status and trigger order completion flow.
        
        Args:
            db: Database session
            transaction_id: Payment transaction ID
            status: New payment status
            is_successful: Whether payment was successful
            additional_data: Additional transaction data
            
        Returns:
            True if update was successful
        """
        try:
            # Find payment transaction
            payment_result = await db.execute(
                select(PaymentTransaction).where(
                    PaymentTransaction.transaction_id == transaction_id
                )
            )
            payment_transaction = payment_result.scalar_one_or_none()
            
            if not payment_transaction:
                logger.error(f"Payment transaction not found: {transaction_id}")
                return False
            
            # Update payment transaction
            payment_transaction.status = status
            payment_transaction.is_successful = is_successful
            payment_transaction.completed_at = datetime.now()
            
            if additional_data:
                if "adumo_transaction_index" in additional_data:
                    payment_transaction.adumo_transaction_index = additional_data["adumo_transaction_index"]
                if "adumo_result_code" in additional_data:
                    payment_transaction.adumo_result_code = additional_data["adumo_result_code"]
                if "adumo_status" in additional_data:
                    payment_transaction.adumo_status = additional_data["adumo_status"]
                if "payment_method" in additional_data:
                    payment_transaction.payment_method = additional_data["payment_method"]
                if "error_message" in additional_data:
                    payment_transaction.adumo_error_message = additional_data["error_message"]
            
            # Update related order
            await self._update_order_status(db, payment_transaction.order_id, is_successful)
            
            # Send notifications
            await self._send_payment_notifications(db, payment_transaction, is_successful)
            
            await db.commit()
            logger.info(f"Updated payment status for transaction {transaction_id}: {status}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to update payment status: {str(e)}")
            await db.rollback()
            return False
    
    async def _update_order_status(
        self,
        db: AsyncSession,
        order_id: UUID,
        payment_successful: bool
    ) -> None:
        """Update order status based on payment result."""
        try:
            # Find order
            order_result = await db.execute(
                select(Order).where(Order.order_id == order_id)
            )
            order = order_result.scalar_one_or_none()
            
            if not order:
                logger.error(f"Order not found: {order_id}")
                return
            
            # Update order status based on payment result
            if payment_successful:
                order.payment_status = "paid"
                order.status = "confirmed"  # Move to confirmed status
                logger.info(f"Order {order_id} marked as paid and confirmed")
            else:
                order.payment_status = "failed"
                order.status = "payment_failed"
                logger.info(f"Order {order_id} marked as payment failed")
            
        except Exception as e:
            logger.error(f"Failed to update order status: {str(e)}")
            raise
    
    async def _send_payment_notifications(
        self,
        db: AsyncSession,
        payment_transaction: PaymentTransaction,
        is_successful: bool
    ) -> None:
        """Send payment notifications to customer and staff."""
        try:
            # Get order and customer details
            order_result = await db.execute(
                select(Order).where(Order.order_id == payment_transaction.order_id)
            )
            order = order_result.scalar_one_or_none()
            
            if not order:
                return
            
            customer_result = await db.execute(
                select(Profile).where(Customer.customer_id == order.customer_id)
            )
            customer = customer_result.scalar_one_or_none()
            
            # Prepare notification data
            notification_data = {
                "order_id": str(order.order_id),
                "order_number": order.order_number,
                "amount": float(payment_transaction.amount),
                "currency": payment_transaction.currency,
                "payment_method": payment_transaction.payment_method,
                "transaction_id": str(payment_transaction.transaction_id),
                "merchant_reference": payment_transaction.merchant_reference,
            }
            
            if customer:
                notification_data.update({
                    "customer_name": customer.first_name + " " + customer.last_name,
                    "customer_email": customer.email,
                    "customer_phone": customer.phone_number,
                })
            
            # Send notifications based on payment result
            if is_successful:
                await self._send_payment_success_notifications(notification_data)
            else:
                await self._send_payment_failure_notifications(notification_data)
                
        except Exception as e:
            logger.error(f"Failed to send payment notifications: {str(e)}")
    
    async def _send_payment_success_notifications(self, data: Dict[str, Any]) -> None:
        """Send payment success notifications."""
        try:
            # Customer notification
            if data.get("customer_email"):
                await self.notification_service.send_email(
                    to_email=data["customer_email"],
                    subject="Payment Successful - Order Confirmed",
                    template="payment_success",
                    data=data
                )
            
            # SMS notification if phone available
            if data.get("customer_phone"):
                message = f"Payment successful! Order #{data['order_number']} confirmed. Amount: N${data['amount']:.2f}"
                await self.notification_service.send_sms(
                    to_phone=data["customer_phone"],
                    message=message
                )
            
            # Staff notification (internal)
            await self.notification_service.send_internal_notification(
                type="payment_success",
                title=f"Payment Received - Order #{data['order_number']}",
                message=f"Payment of N${data['amount']:.2f} received for order #{data['order_number']}",
                data=data
            )
            
        except Exception as e:
            logger.error(f"Failed to send payment success notifications: {str(e)}")
    
    async def _send_payment_failure_notifications(self, data: Dict[str, Any]) -> None:
        """Send payment failure notifications."""
        try:
            # Customer notification
            if data.get("customer_email"):
                await self.notification_service.send_email(
                    to_email=data["customer_email"],
                    subject="Payment Failed - Order Not Confirmed",
                    template="payment_failure",
                    data=data
                )
            
            # Staff notification (internal)
            await self.notification_service.send_internal_notification(
                type="payment_failure",
                title=f"Payment Failed - Order #{data['order_number']}",
                message=f"Payment failed for order #{data['order_number']}. Amount: N${data['amount']:.2f}",
                data=data
            )
            
        except Exception as e:
            logger.error(f"Failed to send payment failure notifications: {str(e)}")
    
    async def get_payment_analytics(
        self,
        db: AsyncSession,
        property_id: int,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """Get payment analytics for a property."""
        try:
            # Build query filters
            filters = []
            
            # Join with orders to filter by property
            query = select(PaymentTransaction).join(Order).where(
                Order.property_id == property_id
            )
            
            if start_date:
                query = query.where(PaymentTransaction.initiated_at >= start_date)
            if end_date:
                query = query.where(PaymentTransaction.initiated_at <= end_date)
            
            # Execute query
            result = await db.execute(query)
            transactions = result.scalars().all()
            
            # Calculate analytics
            total_transactions = len(transactions)
            successful_transactions = sum(1 for t in transactions if t.is_successful)
            failed_transactions = total_transactions - successful_transactions
            total_amount = sum(float(t.amount) for t in transactions if t.is_successful)
            
            success_rate = (successful_transactions / total_transactions * 100) if total_transactions > 0 else 0
            average_amount = (total_amount / successful_transactions) if successful_transactions > 0 else 0
            
            # Group by status
            status_counts = {}
            for transaction in transactions:
                status = transaction.status
                status_counts[status] = status_counts.get(status, 0) + 1
            
            # Group by payment method
            method_counts = {}
            for transaction in transactions:
                method = transaction.payment_method or "unknown"
                method_counts[method] = method_counts.get(method, 0) + 1
            
            return {
                "total_transactions": total_transactions,
                "successful_transactions": successful_transactions,
                "failed_transactions": failed_transactions,
                "total_amount": total_amount,
                "success_rate": round(success_rate, 2),
                "average_transaction_amount": round(average_amount, 2),
                "transactions_by_status": status_counts,
                "transactions_by_payment_method": method_counts,
            }
            
        except Exception as e:
            logger.error(f"Failed to get payment analytics: {str(e)}")
            return {}
    
    async def process_webhook_notification(
        self,
        db: AsyncSession,
        webhook_data: Dict[str, Any]
    ) -> bool:
        """Process webhook notification from Adumo."""
        try:
            merchant_reference = webhook_data.get("mref")
            if not merchant_reference:
                logger.error("Missing merchant reference in webhook")
                return False
            
            # Find payment transaction
            payment_result = await db.execute(
                select(PaymentTransaction).where(
                    PaymentTransaction.merchant_reference == merchant_reference
                )
            )
            payment_transaction = payment_result.scalar_one_or_none()
            
            if not payment_transaction:
                logger.error(f"Payment transaction not found for webhook: {merchant_reference}")
                return False
            
            # Create webhook record
            webhook = PaymentWebhook(
                transaction_id=payment_transaction.transaction_id,
                raw_data=str(webhook_data),
                event_type=webhook_data.get("event_type", "payment_update"),
                processed=False
            )
            
            db.add(webhook)
            await db.commit()
            
            # Process webhook data if needed
            # This could include additional status updates or notifications
            
            logger.info(f"Processed webhook for transaction {payment_transaction.transaction_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to process webhook notification: {str(e)}")
            await db.rollback()
            return False

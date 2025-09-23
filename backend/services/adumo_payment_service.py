"""
Adumo Online Payment Service for Buffr Host.
Handles JWT token generation, payment initialization, and response validation.
"""
import jwt
import uuid
import time
import base64
from typing import Dict, Any, Optional
from decimal import Decimal
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class AdumoPaymentService:
    """Service for handling Adumo Online payment integration."""
    
    def __init__(self, merchant_id: str, application_id: str, jwt_secret: str, 
                 test_mode: bool = True):
        """
        Initialize Adumo payment service.
        
        Args:
            merchant_id: Adumo merchant ID
            application_id: Adumo application ID  
            jwt_secret: JWT secret key
            test_mode: Whether to use test URLs
        """
        self.merchant_id = merchant_id
        self.application_id = application_id
        self.jwt_secret = jwt_secret
        self.test_mode = test_mode
        
        # URLs based on environment
        if test_mode:
            self.base_url = "https://staging-apiv3.adumoonline.com"
        else:
            self.base_url = "https://apiv3.adumoonline.com"
            
        self.initialize_url = f"{self.base_url}/product/payment/v1/initialisevirtual"
    
    def generate_jwt_token(self, amount: Decimal, merchant_reference: str, 
                          notification_url: Optional[str] = None) -> str:
        """
        Generate JWT token for Adumo payment request.
        
        Args:
            amount: Payment amount
            merchant_reference: Unique order reference
            notification_url: Optional webhook URL
            
        Returns:
            JWT token string
        """
        try:
            # Generate unique JTI (JWT ID)
            jti = base64.b64encode(uuid.uuid4().bytes).decode('utf-8')
            
            # Current time
            current_time = int(time.time())
            
            # Build payload
            payload = {
                "iss": "Buffr Host",  # Issuer
                "cuid": self.merchant_id,  # Customer UID (Merchant ID)
                "auid": self.application_id,  # Application UID
                "amount": str(amount),  # Amount as string
                "mref": merchant_reference,  # Merchant reference
                "jti": jti,  # JWT ID
                "iat": current_time - 60,  # Issued at (1 minute ago)
                "exp": current_time + 600,  # Expires in 10 minutes
            }
            
            # Add notification URL if provided
            if notification_url:
                payload["notificationURL"] = notification_url
            
            # Generate token
            token = jwt.encode(payload, self.jwt_secret, algorithm="HS256")
            
            logger.info(f"Generated JWT token for order {merchant_reference}")
            return token
            
        except Exception as e:
            logger.error(f"Failed to generate JWT token: {str(e)}")
            raise Exception(f"JWT token generation failed: {str(e)}")
    
    def validate_response_token(self, response_token: str, expected_amount: Decimal, 
                               expected_mref: str) -> Dict[str, Any]:
        """
        Validate Adumo response JWT token.
        
        Args:
            response_token: JWT token from Adumo response
            expected_amount: Expected payment amount
            expected_mref: Expected merchant reference
            
        Returns:
            Decoded token payload
            
        Raises:
            Exception: If validation fails
        """
        try:
            # Decode and verify token
            decoded = jwt.decode(response_token, self.jwt_secret, algorithms=["HS256"])
            
            # Validate required fields
            if decoded.get("cuid") != self.merchant_id:
                raise Exception("Invalid merchant ID in response")
                
            if decoded.get("auid") != self.application_id:
                raise Exception("Invalid application ID in response")
                
            if Decimal(decoded.get("amount", "0")) != expected_amount:
                raise Exception("Amount mismatch in response")
                
            if decoded.get("mref") != expected_mref:
                raise Exception("Merchant reference mismatch in response")
            
            logger.info(f"Successfully validated response token for order {expected_mref}")
            return decoded
            
        except jwt.ExpiredSignatureError:
            raise Exception("Response token has expired")
        except jwt.InvalidTokenError as e:
            raise Exception(f"Invalid response token: {str(e)}")
        except Exception as e:
            logger.error(f"Response token validation failed: {str(e)}")
            raise
    
    def create_payment_form_data(self, order_id: str, amount: Decimal, 
                                success_url: str, failed_url: str,
                                customer_details: Optional[Dict] = None,
                                order_items: Optional[list] = None) -> Dict[str, Any]:
        """
        Create form data for Adumo payment initialization.
        
        Args:
            order_id: Unique order identifier
            amount: Payment amount
            success_url: URL to redirect on success
            failed_url: URL to redirect on failure
            customer_details: Optional customer information
            order_items: Optional order items details
            
        Returns:
            Form data dictionary
        """
        try:
            # Generate merchant reference
            merchant_reference = f"BUFFR_{order_id}_{int(time.time())}"
            
            # Generate JWT token
            notification_url = f"{self.base_url.replace('apiv3', 'webhooks')}/buffr/notifications"
            token = self.generate_jwt_token(amount, merchant_reference, notification_url)
            
            # Build form data
            form_data = {
                "MerchantID": self.merchant_id,
                "ApplicationID": self.application_id,
                "MerchantReference": merchant_reference,
                "Amount": str(amount),
                "Token": token,
                "RedirectSuccessfulURL": success_url,
                "RedirectFailedURL": failed_url,
                "txtCurrencyCode": "NAD",  # Namibian Dollar
            }
            
            # Add customer details if provided
            if customer_details:
                form_data.update({
                    "Recipient": customer_details.get("name", ""),
                    "ShippingAddress1": customer_details.get("address1", ""),
                    "ShippingAddress2": customer_details.get("address2", ""),
                    "ShippingAddress3": customer_details.get("city", ""),
                    "ShippingAddress4": customer_details.get("postal_code", ""),
                    "ShippingAddress5": customer_details.get("country", "Namibia"),
                })
            
            # Add order items if provided
            if order_items:
                for i, item in enumerate(order_items, 1):
                    form_data.update({
                        f"Qty{i}": item.get("quantity", 1),
                        f"ItemRef{i}": item.get("item_id", ""),
                        f"ItemDescr{i}": item.get("description", ""),
                        f"ItemAmount{i}": str(item.get("price", 0)),
                    })
            
            logger.info(f"Created payment form data for order {order_id}")
            return form_data
            
        except Exception as e:
            logger.error(f"Failed to create payment form data: {str(e)}")
            raise Exception(f"Payment form data creation failed: {str(e)}")
    
    def is_successful_transaction(self, result_code: int) -> bool:
        """
        Check if transaction was successful based on result code.
        
        Args:
            result_code: Adumo result code
            
        Returns:
            True if successful, False otherwise
        """
        # 0 = successful, 1 = successful with warning, -1 = failed
        return result_code in [0, 1]

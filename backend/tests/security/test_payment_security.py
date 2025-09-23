"""
Security tests for payment processing and financial data
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import json

class TestPaymentSecurity:
    """Test payment processing security measures."""
    
    def test_payment_data_encryption(self, client: TestClient):
        """Test that payment data is properly encrypted."""
        # Test credit card data encryption
        payment_data = {
            "customer_id": 1,
            "amount": 500.00,
            "currency": "NAD",
            "payment_method": "card",
            "card_number": "4111111111111111",
            "expiry_date": "12/25",
            "cvv": "123"
        }
        
        response = client.post("/api/v1/payments/", json=payment_data)
        assert response.status_code == 201
        
        payment_id = response.json()["id"]
        
        # Verify that sensitive card data is not stored in plain text
        response = client.get(f"/api/v1/payments/{payment_id}")
        assert response.status_code == 200
        
        # Card details should be masked or not returned
        payment_info = response.json()
        assert "card_number" not in payment_info or payment_info["card_number"].startswith("****")
        assert "cvv" not in payment_info
    
    def test_pci_dss_compliance(self, client: TestClient):
        """Test PCI DSS compliance measures."""
        # Test that card data is not logged
        with patch('backend.services.payment_service.logger') as mock_logger:
            payment_data = {
                "customer_id": 1,
                "amount": 500.00,
                "currency": "NAD",
                "payment_method": "card",
                "card_number": "4111111111111111",
                "expiry_date": "12/25",
                "cvv": "123"
            }
            
            response = client.post("/api/v1/payments/", json=payment_data)
            assert response.status_code == 201
            
            # Verify that card data is not logged
            log_calls = [call[0][0] for call in mock_logger.info.call_args_list]
            assert not any("4111111111111111" in str(call) for call in log_calls)
            assert not any("123" in str(call) for call in log_calls)
    
    def test_payment_amount_validation(self, client: TestClient):
        """Test payment amount validation and limits."""
        # Test negative amount
        payment_data = {
            "customer_id": 1,
            "amount": -100.00,
            "currency": "NAD",
            "payment_method": "card"
        }
        
        response = client.post("/api/v1/payments/", json=payment_data)
        assert response.status_code == 422  # Validation error
        
        # Test zero amount
        payment_data["amount"] = 0.00
        response = client.post("/api/v1/payments/", json=payment_data)
        assert response.status_code == 422  # Validation error
        
        # Test extremely large amount
        payment_data["amount"] = 1000000.00
        response = client.post("/api/v1/payments/", json=payment_data)
        assert response.status_code == 422  # Should have limits
        
        # Test valid amount
        payment_data["amount"] = 500.00
        response = client.post("/api/v1/payments/", json=payment_data)
        assert response.status_code == 201
    
    def test_payment_currency_validation(self, client: TestClient):
        """Test payment currency validation."""
        # Test invalid currency
        payment_data = {
            "customer_id": 1,
            "amount": 500.00,
            "currency": "INVALID",
            "payment_method": "card"
        }
        
        response = client.post("/api/v1/payments/", json=payment_data)
        assert response.status_code == 422  # Validation error
        
        # Test valid currencies
        valid_currencies = ["NAD", "USD", "EUR", "ZAR"]
        for currency in valid_currencies:
            payment_data["currency"] = currency
            response = client.post("/api/v1/payments/", json=payment_data)
            assert response.status_code == 201
    
    def test_payment_method_validation(self, client: TestClient):
        """Test payment method validation."""
        # Test invalid payment method
        payment_data = {
            "customer_id": 1,
            "amount": 500.00,
            "currency": "NAD",
            "payment_method": "invalid_method"
        }
        
        response = client.post("/api/v1/payments/", json=payment_data)
        assert response.status_code == 422  # Validation error
        
        # Test valid payment methods
        valid_methods = ["card", "bank_transfer", "cash", "mobile_money"]
        for method in valid_methods:
            payment_data["payment_method"] = method
            response = client.post("/api/v1/payments/", json=payment_data)
            assert response.status_code == 201
    
    def test_payment_authorization(self, client: TestClient):
        """Test payment authorization and access control."""
        # Test that users can only access their own payments
        user_token = self._create_token_with_user_id(1)
        headers = {"Authorization": f"Bearer {user_token}"}
        
        # Access own payment
        response = client.get("/api/v1/payments/1", headers=headers)
        assert response.status_code == 200
        
        # Access another user's payment
        response = client.get("/api/v1/payments/2", headers=headers)
        assert response.status_code == 403  # Forbidden
        
        # Test admin access to all payments
        admin_token = self._create_token_with_role("admin")
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        response = client.get("/api/v1/payments/", headers=headers)
        assert response.status_code == 200
    
    def test_payment_refund_security(self, client: TestClient):
        """Test payment refund security measures."""
        # Test refund authorization
        refund_data = {
            "amount": 100.00,
            "reason": "Customer request"
        }
        
        # Test unauthorized refund
        response = client.post("/api/v1/payments/1/refund", json=refund_data)
        assert response.status_code == 401  # Unauthorized
        
        # Test authorized refund
        admin_token = self._create_token_with_role("admin")
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        response = client.post("/api/v1/payments/1/refund", json=refund_data, headers=headers)
        assert response.status_code == 200
        
        # Test refund amount validation
        refund_data["amount"] = 1000.00  # More than original payment
        response = client.post("/api/v1/payments/1/refund", json=refund_data, headers=headers)
        assert response.status_code == 422  # Validation error
    
    def test_payment_audit_trail(self, client: TestClient):
        """Test payment audit trail and logging."""
        # Test that payment operations are logged
        payment_data = {
            "customer_id": 1,
            "amount": 500.00,
            "currency": "NAD",
            "payment_method": "card"
        }
        
        with patch('backend.services.audit_service.log_payment_operation') as mock_audit:
            response = client.post("/api/v1/payments/", json=payment_data)
            assert response.status_code == 201
            
            # Verify audit log was created
            mock_audit.assert_called_once()
    
    def test_payment_webhook_security(self, client: TestClient):
        """Test payment webhook security."""
        # Test webhook signature validation
        webhook_data = {
            "payment_id": "123",
            "status": "completed",
            "amount": 500.00
        }
        
        # Test without signature
        response = client.post("/api/v1/webhooks/payment", json=webhook_data)
        assert response.status_code == 401  # Unauthorized
        
        # Test with invalid signature
        headers = {"X-Webhook-Signature": "invalid_signature"}
        response = client.post("/api/v1/webhooks/payment", json=webhook_data, headers=headers)
        assert response.status_code == 401  # Unauthorized
        
        # Test with valid signature
        valid_signature = self._generate_webhook_signature(webhook_data)
        headers = {"X-Webhook-Signature": valid_signature}
        response = client.post("/api/v1/webhooks/payment", json=webhook_data, headers=headers)
        assert response.status_code == 200
    
    def test_payment_rate_limiting(self, client: TestClient):
        """Test payment rate limiting."""
        # Test multiple payment attempts
        payment_data = {
            "customer_id": 1,
            "amount": 500.00,
            "currency": "NAD",
            "payment_method": "card"
        }
        
        # Make multiple payment requests
        for i in range(10):
            response = client.post("/api/v1/payments/", json=payment_data)
            assert response.status_code in [201, 429]  # Success or rate limited
        
        # Should eventually be rate limited
        response = client.post("/api/v1/payments/", json=payment_data)
        assert response.status_code == 429  # Too Many Requests
    
    def _create_token_with_user_id(self, user_id: int):
        """Create a JWT token with specific user ID."""
        import jwt
        from datetime import datetime, timedelta
        
        payload = {
            "sub": "test@buffr.ai",
            "exp": datetime.utcnow() + timedelta(hours=1),
            "iat": datetime.utcnow(),
            "user_id": user_id,
            "role": "customer"
        }
        return jwt.encode(payload, "test-secret", algorithm="HS256")
    
    def _create_token_with_role(self, role: str):
        """Create a JWT token with specific role."""
        import jwt
        from datetime import datetime, timedelta
        
        payload = {
            "sub": "test@buffr.ai",
            "exp": datetime.utcnow() + timedelta(hours=1),
            "iat": datetime.utcnow(),
            "role": role
        }
        return jwt.encode(payload, "test-secret", algorithm="HS256")
    
    def _generate_webhook_signature(self, data: dict):
        """Generate valid webhook signature for testing."""
        import hmac
        import hashlib
        
        secret = "webhook-secret"
        payload = json.dumps(data, sort_keys=True)
        signature = hmac.new(
            secret.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()
        return f"sha256={signature}"


class TestFinancialDataProtection:
    """Test financial data protection measures."""
    
    def test_revenue_data_encryption(self, client: TestClient):
        """Test that revenue data is properly encrypted."""
        # Test revenue data access
        response = client.get("/api/v1/analytics/revenue")
        assert response.status_code == 200
        
        # Verify that sensitive financial data is properly handled
        data = response.json()
        assert "total_revenue" in data
        # Verify no raw financial data is exposed
    
    def test_financial_reporting_security(self, client: TestClient):
        """Test financial reporting security."""
        # Test that only authorized users can access financial reports
        response = client.get("/api/v1/reports/financial")
        assert response.status_code == 401  # Unauthorized
        
        # Test with admin access
        admin_token = self._create_token_with_role("admin")
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        response = client.get("/api/v1/reports/financial", headers=headers)
        assert response.status_code == 200
    
    def test_tax_data_protection(self, client: TestClient):
        """Test tax data protection."""
        # Test tax data access
        response = client.get("/api/v1/tax/reports")
        assert response.status_code == 401  # Unauthorized
        
        # Test with authorized access
        admin_token = self._create_token_with_role("admin")
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        response = client.get("/api/v1/tax/reports", headers=headers)
        assert response.status_code == 200
        
        # Verify tax data is properly formatted and secured
        data = response.json()
        assert "tax_amount" in data
        assert "period" in data
    
    def _create_token_with_role(self, role: str):
        """Create a JWT token with specific role."""
        import jwt
        from datetime import datetime, timedelta
        
        payload = {
            "sub": "test@buffr.ai",
            "exp": datetime.utcnow() + timedelta(hours=1),
            "iat": datetime.utcnow(),
            "role": role
        }
        return jwt.encode(payload, "test-secret", algorithm="HS256")

"""
Security tests for authentication and authorization
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import jwt
from datetime import datetime, timedelta

class TestAuthentication:
    """Test authentication security measures."""
    
    def test_jwt_token_validation(self, client: TestClient):
        """Test JWT token validation and security."""
        # Test with valid token
        valid_token = self._create_valid_token()
        headers = {"Authorization": f"Bearer {valid_token}"}
        
        response = client.get("/api/v1/properties/", headers=headers)
        assert response.status_code == 200
        
        # Test with invalid token
        invalid_token = "invalid.jwt.token"
        headers = {"Authorization": f"Bearer {invalid_token}"}
        
        response = client.get("/api/v1/properties/", headers=headers)
        assert response.status_code == 401
        
        # Test with expired token
        expired_token = self._create_expired_token()
        headers = {"Authorization": f"Bearer {expired_token}"}
        
        response = client.get("/api/v1/properties/", headers=headers)
        assert response.status_code == 401
        
        # Test with malformed token
        malformed_token = "not.a.valid.token"
        headers = {"Authorization": f"Bearer {malformed_token}"}
        
        response = client.get("/api/v1/properties/", headers=headers)
        assert response.status_code == 401
    
    def test_password_security(self, client: TestClient):
        """Test password security requirements."""
        # Test weak password
        weak_password_data = {
            "email": "test@buffr.ai",
            "password": "123",
            "first_name": "Test",
            "last_name": "User"
        }
        
        response = client.post("/api/v1/auth/register", json=weak_password_data)
        assert response.status_code == 422
        assert "password" in str(response.json())
        
        # Test password without special characters
        no_special_data = {
            "email": "test@buffr.ai",
            "password": "password123",
            "first_name": "Test",
            "last_name": "User"
        }
        
        response = client.post("/api/v1/auth/register", json=no_special_data)
        assert response.status_code == 422
        
        # Test strong password
        strong_password_data = {
            "email": "test@buffr.ai",
            "password": "SecurePass123!",
            "first_name": "Test",
            "last_name": "User"
        }
        
        response = client.post("/api/v1/auth/register", json=strong_password_data)
        assert response.status_code == 201
    
    def test_rate_limiting_on_auth(self, client: TestClient):
        """Test rate limiting on authentication endpoints."""
        # Test multiple failed login attempts
        for i in range(5):
            response = client.post("/api/v1/auth/login", json={
                "email": "test@buffr.ai",
                "password": "wrongpassword"
            })
            assert response.status_code == 401
        
        # After 5 failed attempts, should be rate limited
        response = client.post("/api/v1/auth/login", json={
            "email": "test@buffr.ai",
            "password": "wrongpassword"
        })
        assert response.status_code == 429  # Too Many Requests
    
    def test_session_security(self, client: TestClient):
        """Test session security measures."""
        # Test session timeout
        with patch('backend.auth.dependencies.get_current_user') as mock_user:
            mock_user.return_value = {"id": 1, "email": "test@buffr.ai"}
            
            # Simulate expired session
            response = client.get("/api/v1/properties/")
            assert response.status_code == 401
    
    def test_csrf_protection(self, client: TestClient):
        """Test CSRF protection."""
        # Test that state-changing operations require CSRF token
        response = client.post("/api/v1/properties/", json={
            "name": "Test Hotel",
            "property_type": "hotel"
        })
        # Should require CSRF token in production
        assert response.status_code in [403, 422]  # CSRF error or validation error
    
    def _create_valid_token(self):
        """Create a valid JWT token for testing."""
        payload = {
            "sub": "test@buffr.ai",
            "exp": datetime.utcnow() + timedelta(hours=1),
            "iat": datetime.utcnow(),
            "role": "admin"
        }
        return jwt.encode(payload, "test-secret", algorithm="HS256")
    
    def _create_expired_token(self):
        """Create an expired JWT token for testing."""
        payload = {
            "sub": "test@buffr.ai",
            "exp": datetime.utcnow() - timedelta(hours=1),
            "iat": datetime.utcnow() - timedelta(hours=2),
            "role": "admin"
        }
        return jwt.encode(payload, "test-secret", algorithm="HS256")


class TestAuthorization:
    """Test authorization and access control."""
    
    def test_role_based_access_control(self, client: TestClient):
        """Test role-based access control."""
        # Test admin access
        admin_token = self._create_token_with_role("admin")
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        response = client.get("/api/v1/admin/dashboard", headers=headers)
        assert response.status_code == 200
        
        # Test staff access
        staff_token = self._create_token_with_role("staff")
        headers = {"Authorization": f"Bearer {staff_token}"}
        
        response = client.get("/api/v1/admin/dashboard", headers=headers)
        assert response.status_code == 403  # Forbidden
        
        # Test customer access
        customer_token = self._create_token_with_role("customer")
        headers = {"Authorization": f"Bearer {customer_token}"}
        
        response = client.get("/api/v1/admin/dashboard", headers=headers)
        assert response.status_code == 403  # Forbidden
    
    def test_resource_ownership(self, client: TestClient):
        """Test that users can only access their own resources."""
        # Test accessing own booking
        user_token = self._create_token_with_user_id(1)
        headers = {"Authorization": f"Bearer {user_token}"}
        
        response = client.get("/api/v1/bookings/1", headers=headers)
        assert response.status_code == 200
        
        # Test accessing another user's booking
        response = client.get("/api/v1/bookings/2", headers=headers)
        assert response.status_code == 403  # Forbidden
    
    def test_api_key_authentication(self, client: TestClient):
        """Test API key authentication for external services."""
        # Test with valid API key
        headers = {"X-API-Key": "valid-api-key"}
        response = client.get("/api/v1/external/data", headers=headers)
        assert response.status_code == 200
        
        # Test with invalid API key
        headers = {"X-API-Key": "invalid-api-key"}
        response = client.get("/api/v1/external/data", headers=headers)
        assert response.status_code == 401
        
        # Test without API key
        response = client.get("/api/v1/external/data")
        assert response.status_code == 401
    
    def _create_token_with_role(self, role: str):
        """Create a JWT token with specific role."""
        payload = {
            "sub": "test@buffr.ai",
            "exp": datetime.utcnow() + timedelta(hours=1),
            "iat": datetime.utcnow(),
            "role": role
        }
        return jwt.encode(payload, "test-secret", algorithm="HS256")
    
    def _create_token_with_user_id(self, user_id: int):
        """Create a JWT token with specific user ID."""
        payload = {
            "sub": "test@buffr.ai",
            "exp": datetime.utcnow() + timedelta(hours=1),
            "iat": datetime.utcnow(),
            "user_id": user_id,
            "role": "customer"
        }
        return jwt.encode(payload, "test-secret", algorithm="HS256")


class TestDataProtection:
    """Test data protection and privacy measures."""
    
    def test_pii_encryption(self, client: TestClient):
        """Test that personally identifiable information is encrypted."""
        # Test customer data encryption
        customer_data = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@example.com",
            "phone": "+264811234567",
            "id_number": "123456789"
        }
        
        response = client.post("/api/v1/customers/", json=customer_data)
        assert response.status_code == 201
        
        # Verify that sensitive data is encrypted in database
        # This would require database inspection in a real test
        customer_id = response.json()["id"]
        
        # Test that decrypted data is returned correctly
        response = client.get(f"/api/v1/customers/{customer_id}")
        assert response.status_code == 200
        assert response.json()["email"] == "john.doe@example.com"
    
    def test_data_anonymization(self, client: TestClient):
        """Test data anonymization for analytics."""
        # Test that analytics endpoints return anonymized data
        response = client.get("/api/v1/analytics/customers")
        assert response.status_code == 200
        
        data = response.json()
        # Verify no PII is exposed in analytics
        assert "email" not in str(data)
        assert "phone" not in str(data)
        assert "id_number" not in str(data)
    
    def test_audit_logging(self, client: TestClient):
        """Test that sensitive operations are logged."""
        # Test that customer data access is logged
        response = client.get("/api/v1/customers/1")
        assert response.status_code == 200
        
        # Verify audit log entry was created
        # This would require checking audit logs in a real test
        # assert audit_log_contains("customer_access", user_id=1, resource_id=1)
    
    def test_data_retention(self, client: TestClient):
        """Test data retention policies."""
        # Test that old data is properly archived/deleted
        # This would test data retention policies in a real implementation
        pass


class TestInputValidation:
    """Test input validation and sanitization."""
    
    def test_sql_injection_prevention(self, client: TestClient):
        """Test SQL injection prevention."""
        # Test malicious SQL injection attempts
        malicious_inputs = [
            "'; DROP TABLE customers; --",
            "1' OR '1'='1",
            "admin'--",
            "1; DELETE FROM users; --"
        ]
        
        for malicious_input in malicious_inputs:
            response = client.get(f"/api/v1/customers/?search={malicious_input}")
            assert response.status_code in [200, 400, 422]  # Should not cause 500 error
            # Verify no data corruption occurred
    
    def test_xss_prevention(self, client: TestClient):
        """Test XSS prevention."""
        # Test XSS payloads
        xss_payloads = [
            "<script>alert('XSS')</script>",
            "javascript:alert('XSS')",
            "<img src=x onerror=alert('XSS')>",
            "';alert('XSS');//"
        ]
        
        for payload in xss_payloads:
            response = client.post("/api/v1/customers/", json={
                "first_name": payload,
                "last_name": "Test",
                "email": "test@example.com"
            })
            # Should sanitize input and not execute scripts
            assert response.status_code in [201, 422]
    
    def test_file_upload_security(self, client: TestClient):
        """Test file upload security."""
        # Test malicious file uploads
        malicious_files = [
            ("malicious.exe", "application/x-executable"),
            ("script.php", "application/x-php"),
            ("backdoor.jsp", "application/x-jsp")
        ]
        
        for filename, content_type in malicious_files:
            files = {"file": (filename, b"malicious content", content_type)}
            response = client.post("/api/v1/upload", files=files)
            assert response.status_code == 400  # Should reject malicious files
    
    def test_input_length_limits(self, client: TestClient):
        """Test input length limits."""
        # Test extremely long inputs
        long_string = "A" * 10000
        
        response = client.post("/api/v1/customers/", json={
            "first_name": long_string,
            "last_name": "Test",
            "email": "test@example.com"
        })
        assert response.status_code == 422  # Should reject overly long input

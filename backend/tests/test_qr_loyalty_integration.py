"""
Integration tests for QR Loyalty System
Tests the complete QR code loyalty integration including cross-business features.
"""

import pytest
import uuid
from datetime import datetime, timedelta
from unittest.mock import Mock, patch
from services.qr_loyalty_service import QRLoyaltyService
from services.loyalty_service import LoyaltyService
from models.customer import Customer
from models.hospitality_property import HospitalityProperty

class TestQRLoyaltyIntegration:
    """Test QR loyalty system integration"""
    
    @pytest.fixture
    def mock_db_session(self):
        """Mock database session"""
        return Mock()
    
    @pytest.fixture
    def sample_customer(self):
        """Sample customer for testing"""
        customer = Mock(spec=Customer)
        customer.customer_id = uuid.uuid4()
        customer.loyalty_points = 1000
        customer.first_name = "John"
        customer.last_name = "Doe"
        customer.email = "john.doe@example.com"
        customer.created_at = datetime.utcnow()
        return customer
    
    @pytest.fixture
    def sample_property(self):
        """Sample property for testing"""
        property = Mock(spec=HospitalityProperty)
        property.property_id = 1
        property.property_name = "Buffr Host Hotel"
        property.is_spa = True
        property.is_conference_facility = True
        return property
    
    def test_generate_loyalty_enrollment_qr(self, mock_db_session, sample_property):
        """Test loyalty enrollment QR code generation"""
        service = QRLoyaltyService(mock_db_session)
        
        # Mock property retrieval
        with patch.object(service, '_get_property', return_value=sample_property):
            result = service.generate_loyalty_enrollment_qr(1, None)
        
        assert result["success"] == True
        assert "qr_code" in result
        assert result["qr_code"].startswith("data:image/png;base64,")
        assert "enrollment_url" in result
        assert "expires_at" in result
        
        # Verify QR code contains expected data
        import base64
        import json
        
        # Extract base64 data
        qr_data = result["qr_code"].split(",")[1]
        decoded_data = base64.b64decode(qr_data)
        
        # QR code should be a valid PNG image
        assert decoded_data.startswith(b'\x89PNG')
    
    def test_generate_cross_business_redemption_qr(self, mock_db_session, sample_customer):
        """Test cross-business redemption QR code generation"""
        service = QRLoyaltyService(mock_db_session)
        
        # Mock customer retrieval
        with patch.object(service, '_get_customer', return_value=sample_customer):
            result = service.generate_cross_business_redemption_qr(
                sample_customer.customer_id, 1, "restaurant", "hotel", 500
            )
        
        assert result["success"] == True
        assert "qr_code" in result
        assert result["qr_code"].startswith("data:image/png;base64,")
        assert "redemption_id" in result
        assert "expires_at" in result
        assert "customer_tier" in result
    
    def test_generate_menu_with_loyalty_qr(self, mock_db_session, sample_property):
        """Test menu with loyalty QR code generation"""
        service = QRLoyaltyService(mock_db_session)
        
        # Mock property retrieval
        with patch.object(service, '_get_property', return_value=sample_property):
            result = service.generate_menu_with_loyalty_qr(1, None)
        
        assert result["success"] == True
        assert "qr_code" in result
        assert result["qr_code"].startswith("data:image/png;base64,")
        assert "menu_url" in result
        assert "loyalty_url" in result
        assert result["property_name"] == "Buffr Host Hotel"
    
    def test_scan_loyalty_enrollment_qr(self, mock_db_session):
        """Test scanning loyalty enrollment QR code"""
        service = QRLoyaltyService(mock_db_session)
        
        # Create test QR data
        qr_data = {
            "type": "loyalty_enrollment",
            "property_id": 1,
            "property_name": "Buffr Host Hotel",
            "customer_id": None,
            "timestamp": datetime.utcnow().isoformat(),
            "expires_at": (datetime.utcnow() + timedelta(days=7)).isoformat()
        }
        
        import json
        qr_json = json.dumps(qr_data)
        
        # Mock property retrieval
        with patch.object(service, '_get_property', return_value=Mock()):
            result = service.scan_loyalty_qr(qr_json, 1)
        
        assert result["success"] == True
        assert result["action"] == "enrollment_required"
        assert "enrollment_url" in result
    
    def test_scan_cross_business_redemption_qr(self, mock_db_session, sample_customer):
        """Test scanning cross-business redemption QR code"""
        service = QRLoyaltyService(mock_db_session)
        
        # Create test QR data
        qr_data = {
            "type": "cross_business_redemption",
            "customer_id": str(sample_customer.customer_id),
            "property_id": 1,
            "source_service": "restaurant",
            "target_service": "hotel",
            "points": 500,
            "tier": "gold",
            "timestamp": datetime.utcnow().isoformat(),
            "expires_at": (datetime.utcnow() + timedelta(hours=24)).isoformat()
        }
        
        import json
        qr_json = json.dumps(qr_data)
        
        # Mock customer retrieval and loyalty service
        with patch.object(service, '_get_customer', return_value=sample_customer):
            with patch.object(service.loyalty_service, 'create_cross_business_redemption') as mock_redemption:
                mock_redemption.return_value = {
                    "success": True,
                    "redemption": {"redemption_id": "test-123"},
                    "remaining_points": 500
                }
                
                result = service.scan_loyalty_qr(qr_json, 1)
        
        assert result["success"] == True
        assert "redemption" in result
    
    def test_qr_code_expiration_validation(self, mock_db_session):
        """Test QR code expiration validation"""
        service = QRLoyaltyService(mock_db_session)
        
        # Create expired QR data
        expired_qr_data = {
            "type": "loyalty_enrollment",
            "property_id": 1,
            "expires_at": (datetime.utcnow() - timedelta(days=1)).isoformat()
        }
        
        import json
        qr_json = json.dumps(expired_qr_data)
        
        result = service.scan_loyalty_qr(qr_json, 1)
        
        # Should handle expired codes gracefully
        assert result["success"] == False
        assert "error" in result
    
    def test_loyalty_analytics_integration(self, mock_db_session):
        """Test loyalty analytics integration"""
        service = QRLoyaltyService(mock_db_session)
        
        result = service.get_loyalty_qr_analytics(1)
        
        assert "property_id" in result
        assert "total_qr_scans" in result
        assert "enrollment_qr_scans" in result
        assert "redemption_qr_scans" in result
        assert "conversion_rates" in result
        assert "popular_redemptions" in result
        assert "peak_scan_times" in result
    
    def test_cross_business_offers_integration(self, mock_db_session, sample_customer):
        """Test cross-business offers integration"""
        loyalty_service = LoyaltyService(mock_db_session)
        
        # Mock customer retrieval
        with patch.object(loyalty_service, '_get_customer', return_value=sample_customer):
            with patch.object(loyalty_service, 'calculate_loyalty_tier', return_value="gold"):
                offers = loyalty_service.get_cross_business_offers(sample_customer.customer_id, 1)
        
        assert len(offers) > 0
        
        # Verify offer structure
        for offer in offers:
            assert "offer_id" in offer
            assert "title" in offer
            assert "description" in offer
            assert "source_service" in offer
            assert "target_service" in offer
            assert "points_required" in offer
            assert "qr_code" in offer
            assert offer["qr_code"].startswith("LOYALTY_CROSS_")
    
    def test_tier_based_benefits_application(self, mock_db_session, sample_customer):
        """Test tier-based benefits application in cross-business redemptions"""
        loyalty_service = LoyaltyService(mock_db_session)
        
        # Mock customer and tier calculation
        with patch.object(loyalty_service, '_get_customer', return_value=sample_customer):
            with patch.object(loyalty_service, 'calculate_loyalty_tier', return_value="platinum"):
                with patch.object(loyalty_service, 'get_tier_benefits') as mock_benefits:
                    mock_benefits.return_value = {
                        "points_multiplier": 2.0,
                        "discount_percentage": 15
                    }
                    
                    result = loyalty_service.create_cross_business_redemption(
                        sample_customer.customer_id, "restaurant", "hotel", 500, 1
                    )
        
        assert result["success"] == True
        assert "tier_benefits_applied" in result
        assert result["tier_benefits_applied"]["points_multiplier"] == 2.0
    
    def test_qr_code_security_features(self, mock_db_session, sample_customer):
        """Test QR code security features"""
        service = QRLoyaltyService(mock_db_session)
        
        # Test customer-specific QR codes
        with patch.object(service, '_get_customer', return_value=sample_customer):
            result = service.generate_cross_business_redemption_qr(
                sample_customer.customer_id, 1, "restaurant", "hotel", 500
            )
        
        assert result["success"] == True
        
        # Verify QR code contains customer-specific data
        import json
        import base64
        
        # Extract and decode QR data
        qr_data = result["qr_code"].split(",")[1]
        decoded_data = base64.b64decode(qr_data)
        
        # QR code should be a valid PNG image
        assert decoded_data.startswith(b'\x89PNG')
        
        # Verify expiration is set
        assert "expires_at" in result
        expires_at = datetime.fromisoformat(result["expires_at"].replace('Z', '+00:00'))
        assert expires_at > datetime.utcnow()
        assert expires_at < datetime.utcnow() + timedelta(hours=25)  # 24 hours + buffer

class TestLoyaltyServiceIntegration:
    """Test enhanced loyalty service integration"""
    
    @pytest.fixture
    def mock_db_session(self):
        """Mock database session"""
        return Mock()
    
    def test_enhanced_analytics_structure(self, mock_db_session):
        """Test enhanced analytics structure"""
        service = LoyaltyService(mock_db_session)
        
        analytics = service.get_loyalty_analytics(1)
        
        # Verify enhanced analytics structure
        assert "cross_business_metrics" in analytics
        assert "customer_lifetime_value" in analytics
        assert "engagement_metrics" in analytics
        
        # Verify cross-business metrics
        cross_business = analytics["cross_business_metrics"]
        assert "restaurant_to_hotel_redemptions" in cross_business
        assert "hotel_to_spa_redemptions" in cross_business
        assert "conference_to_restaurant_redemptions" in cross_business
        assert "cross_business_revenue_impact" in cross_business
        
        # Verify engagement metrics
        engagement = analytics["engagement_metrics"]
        assert "qr_code_scans" in engagement
        assert "mobile_app_usage" in engagement
        assert "social_sharing" in engagement
        assert "referral_conversions" in engagement
    
    def test_tier_benefits_structure(self, mock_db_session):
        """Test tier benefits structure"""
        service = LoyaltyService(mock_db_session)
        
        # Test all tier benefits
        tiers = ["bronze", "silver", "gold", "platinum"]
        
        for tier in tiers:
            benefits = service.get_tier_benefits(tier)
            
            assert "points_multiplier" in benefits
            assert "discount_percentage" in benefits
            assert "free_amenities" in benefits
            assert "priority_booking" in benefits
            assert "concierge_service" in benefits
            
            # Verify tier progression
            if tier == "platinum":
                assert benefits["points_multiplier"] == 2.0
                assert benefits["discount_percentage"] == 15
            elif tier == "gold":
                assert benefits["points_multiplier"] == 1.5
                assert benefits["discount_percentage"] == 10

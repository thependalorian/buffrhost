#!/usr/bin/env python3
"""
QR Loyalty System Validation Script
Validates the complete QR code loyalty integration including cross-business features.
"""

import os
import sys
import uuid
from datetime import datetime, timedelta

# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def test_qrcode_import():
    """Test that qrcode library can be imported"""
    try:
        import qrcode

        print("✅ qrcode library imported successfully")
        return True
    except ImportError as e:
        print(f"❌ Failed to import qrcode library: {e}")
        return False


def test_qrcode_generation():
    """Test basic QR code generation"""
    try:
        import base64
        import io

        import qrcode

        # Create a simple QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data("test data")
        qr.make(fit=True)

        # Create image
        img = qr.make_image(fill_color="black", back_color="white")

        # Convert to base64
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        img_str = base64.b64encode(buffer.getvalue()).decode()

        # Verify it's a valid base64 PNG
        assert img_str.startswith("iVBORw0KGgo")  # PNG base64 signature
        print("✅ QR code generation test passed")
        return True

    except Exception as e:
        print(f"❌ QR code generation test failed: {e}")
        return False


def test_qr_loyalty_service_import():
    """Test that QRLoyaltyService can be imported"""
    try:
        from services.qr_loyalty_service import QRLoyaltyService

        print("✅ QRLoyaltyService imported successfully")
        return True
    except ImportError as e:
        print(f"❌ Failed to import QRLoyaltyService: {e}")
        return False


def test_loyalty_service_import():
    """Test that enhanced LoyaltyService can be imported"""
    try:
        from services.loyalty_service import LoyaltyService

        print("✅ Enhanced LoyaltyService imported successfully")
        return True
    except ImportError as e:
        print(f"❌ Failed to import LoyaltyService: {e}")
        return False


def test_qr_loyalty_routes_import():
    """Test that QR loyalty routes can be imported"""
    try:
        from routes.qr_loyalty import router

        print("✅ QR loyalty routes imported successfully")
        return True
    except ImportError as e:
        print(f"❌ Failed to import QR loyalty routes: {e}")
        return False


def test_enhanced_loyalty_routes_import():
    """Test that enhanced loyalty routes can be imported"""
    try:
        from routes.loyalty import router

        print("✅ Enhanced loyalty routes imported successfully")
        return True
    except ImportError as e:
        print(f"❌ Failed to import enhanced loyalty routes: {e}")
        return False


def test_qr_loyalty_service_instantiation():
    """Test that QRLoyaltyService can be instantiated"""
    try:
        from services.qr_loyalty_service import QRLoyaltyService

        # Mock database session
        class MockDB:
            pass

        service = QRLoyaltyService(MockDB())
        print("✅ QRLoyaltyService instantiated successfully")
        return True
    except Exception as e:
        print(f"❌ QRLoyaltyService instantiation failed: {e}")
        return False


def test_enhanced_loyalty_service_instantiation():
    """Test that enhanced LoyaltyService can be instantiated"""
    try:
        from services.loyalty_service import LoyaltyService

        # Mock database session
        class MockDB:
            pass

        service = LoyaltyService(MockDB())
        print("✅ Enhanced LoyaltyService instantiated successfully")
        return True
    except Exception as e:
        print(f"❌ Enhanced LoyaltyService instantiation failed: {e}")
        return False


def test_cross_business_offers_method():
    """Test cross-business offers method exists and is callable"""
    try:
        from services.loyalty_service import LoyaltyService

        # Mock database session
        class MockDB:
            pass

        service = LoyaltyService(MockDB())

        # Test that the method exists and is callable
        assert hasattr(service, "get_cross_business_offers")
        assert callable(getattr(service, "get_cross_business_offers"))

        print("✅ Cross-business offers method exists and is callable")
        return True
    except Exception as e:
        print(f"❌ Cross-business offers method test failed: {e}")
        return False


def test_qr_code_generation_method():
    """Test QR code generation method exists and is callable"""
    try:
        from services.qr_loyalty_service import QRLoyaltyService

        # Mock database session
        class MockDB:
            pass

        service = QRLoyaltyService(MockDB())

        # Test that the method exists and is callable
        assert hasattr(service, "generate_loyalty_enrollment_qr")
        assert callable(getattr(service, "generate_loyalty_enrollment_qr"))

        print("✅ QR code generation method exists and is callable")
        return True
    except Exception as e:
        print(f"❌ QR code generation method test failed: {e}")
        return False


def test_tier_benefits_structure():
    """Test tier benefits structure"""
    try:
        from services.loyalty_service import LoyaltyService

        # Mock database session
        class MockDB:
            pass

        service = LoyaltyService(MockDB())

        # Test tier benefits for all tiers
        tiers = ["bronze", "silver", "gold", "platinum"]

        for tier in tiers:
            benefits = service.get_tier_benefits(tier)

            # Verify required fields
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

        print("✅ Tier benefits structure test passed")
        return True
    except Exception as e:
        print(f"❌ Tier benefits structure test failed: {e}")
        return False


def test_enhanced_analytics_structure():
    """Test enhanced analytics structure"""
    try:
        from services.loyalty_service import LoyaltyService

        # Mock database session
        class MockDB:
            pass

        service = LoyaltyService(MockDB())

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

        # Verify engagement metrics
        engagement = analytics["engagement_metrics"]
        assert "qr_code_scans" in engagement
        assert "mobile_app_usage" in engagement
        assert "social_sharing" in engagement

        print("✅ Enhanced analytics structure test passed")
        return True
    except Exception as e:
        print(f"❌ Enhanced analytics structure test failed: {e}")
        return False


def main():
    """Run all validation tests"""
    print("🔍 QR Loyalty System Validation")
    print("=" * 50)

    tests = [
        test_qrcode_import,
        test_qrcode_generation,
        test_qr_loyalty_service_import,
        test_loyalty_service_import,
        test_qr_loyalty_routes_import,
        test_enhanced_loyalty_routes_import,
        test_qr_loyalty_service_instantiation,
        test_enhanced_loyalty_service_instantiation,
        test_cross_business_offers_method,
        test_qr_code_generation_method,
        test_tier_benefits_structure,
        test_enhanced_analytics_structure,
    ]

    passed = 0
    failed = 0

    for test in tests:
        try:
            if test():
                passed += 1
            else:
                failed += 1
        except Exception as e:
            print(f"❌ Test {test.__name__} failed with exception: {e}")
            failed += 1
        print()

    print("=" * 50)
    print(f"📊 Validation Results: {passed} passed, {failed} failed")

    if failed == 0:
        print("🎉 All tests passed! QR Loyalty System is ready for deployment.")
        return 0
    else:
        print("⚠️  Some tests failed. Please address the issues before deployment.")
        return 1


if __name__ == "__main__":
    sys.exit(main())

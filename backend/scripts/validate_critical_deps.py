#!/usr/bin/env python3
"""
Critical Dependencies Validation Script
Focuses on validating the most critical dependencies that could cause runtime failures
"""

import sys
import importlib
from pathlib import Path

def test_critical_imports():
    """Test critical imports that are essential for the application to run"""
    print("🔍 Testing Critical Dependencies...")
    
    critical_imports = [
        # Core framework
        ("fastapi", "FastAPI framework"),
        ("uvicorn", "ASGI server"),
        ("pydantic", "Data validation"),
        
        # Database
        ("sqlalchemy", "ORM"),
        ("asyncpg", "PostgreSQL driver"),
        
        # Authentication
        ("jose", "JWT handling"),
        ("passlib", "Password hashing"),
        
        # QR Code (the dependency we just fixed)
        ("qrcode", "QR code generation"),
        
        # AI/ML (if used)
        ("openai", "OpenAI API"),
        ("langchain", "LangChain framework"),
        
        # HTTP client
        ("httpx", "HTTP client"),
        ("requests", "HTTP requests"),
    ]
    
    results = {"passed": [], "failed": []}
    
    for module_name, description in critical_imports:
        try:
            importlib.import_module(module_name)
            results["passed"].append((module_name, description))
            print(f"  ✅ {module_name} - {description}")
        except ImportError as e:
            results["failed"].append((module_name, description, str(e)))
            print(f"  ❌ {module_name} - {description}: {e}")
    
    return results

def test_qr_code_functionality():
    """Test QR code generation functionality specifically"""
    print("\n🔍 Testing QR Code Functionality...")
    
    try:
        import qrcode
        import io
        import base64
        
        # Create a test QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4)
        qr.add_data("test loyalty enrollment")
        qr.make(fit=True)
        
        # Generate image
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to base64
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        # Verify it's a valid PNG
        if img_str.startswith("iVBORw0KGgo"):
            print("  ✅ QR code generation works correctly")
            return True
        else:
            print("  ❌ QR code generation failed - invalid PNG")
            return False
            
    except Exception as e:
        print(f"  ❌ QR code generation failed: {e}")
        return False

def test_loyalty_services():
    """Test that loyalty services can be imported"""
    print("\n🔍 Testing Loyalty Services...")
    
    try:
        # Add backend to path
        backend_dir = Path(__file__).parent.parent
        sys.path.insert(0, str(backend_dir))
        
        # Test importing loyalty services
        from services.loyalty_service import LoyaltyService
        from services.qr_loyalty_service import QRLoyaltyService
        
        print("  ✅ Loyalty services import successfully")
        return True
        
    except ImportError as e:
        print(f"  ❌ Loyalty service import failed: {e}")
        return False
    except Exception as e:
        print(f"  ❌ Loyalty service import error: {e}")
        return False

def main():
    """Main validation function"""
    print("🚀 Critical Dependencies Validation")
    print("=" * 50)
    
    # Test critical imports
    import_results = test_critical_imports()
    
    # Test QR code functionality
    qr_test = test_qr_code_functionality()
    
    # Test loyalty services
    loyalty_test = test_loyalty_services()
    
    print("\n" + "=" * 50)
    print("📊 Validation Results:")
    print(f"  ✅ Critical imports passed: {len(import_results['passed'])}")
    print(f"  ❌ Critical imports failed: {len(import_results['failed'])}")
    print(f"  {'✅' if qr_test else '❌'} QR code functionality")
    print(f"  {'✅' if loyalty_test else '❌'} Loyalty services")
    
    if import_results["failed"]:
        print("\n❌ Failed Critical Imports:")
        for module, description, error in import_results["failed"]:
            print(f"   - {module}: {error}")
    
    if not import_results["failed"] and qr_test and loyalty_test:
        print("\n🎉 All critical dependencies are working!")
        print("✅ System is ready for deployment")
        return 0
    else:
        print("\n⚠️  Some critical dependencies are missing or not working")
        print("❌ Please fix the issues before deployment")
        return 1

if __name__ == "__main__":
    sys.exit(main())

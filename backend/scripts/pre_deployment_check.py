#!/usr/bin/env python3
"""
Pre-Deployment Validation Script
Comprehensive validation before deployment to catch issues like missing dependencies
"""

import sys
import subprocess
import importlib
from pathlib import Path
from typing import Dict, List, Tuple

def run_command(cmd: str, cwd: Path = None) -> Tuple[bool, str, str]:
    """Run a command and return success status, stdout, stderr"""
    try:
        result = subprocess.run(
            cmd, 
            shell=True, 
            capture_output=True, 
            text=True, 
            cwd=cwd
        )
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def test_imports() -> Dict[str, any]:
    """Test that all critical imports work"""
    print("🔍 Testing Critical Imports...")
    
    critical_imports = [
        "fastapi",
        "sqlalchemy", 
        "pydantic",
        "qrcode",  # The dependency we just fixed
        "jose",
        "passlib",
        "asyncpg",
        "redis",
        "celery"
    ]
    
    results = {"passed": [], "failed": []}
    
    for module in critical_imports:
        try:
            importlib.import_module(module)
            results["passed"].append(module)
            print(f"  ✅ {module}")
        except ImportError as e:
            results["failed"].append({"module": module, "error": str(e)})
            print(f"  ❌ {module}: {e}")
    
    return results

def test_qr_code_generation() -> bool:
    """Test QR code generation functionality"""
    print("🔍 Testing QR Code Generation...")
    
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
            print("  ✅ QR code generation works")
            return True
        else:
            print("  ❌ QR code generation failed - invalid PNG")
            return False
            
    except Exception as e:
        print(f"  ❌ QR code generation failed: {e}")
        return False

def test_docker_build() -> bool:
    """Test Docker build without cache"""
    print("🔍 Testing Docker Build...")
    
    backend_dir = Path(__file__).parent.parent
    dockerfile = backend_dir / "Dockerfile"
    
    if not dockerfile.exists():
        print("  ⚠️  No Dockerfile found, skipping Docker build test")
        return True
    
    success, stdout, stderr = run_command(
        "docker build --no-cache -t shandi-backend-test .",
        cwd=backend_dir
    )
    
    if success:
        print("  ✅ Docker build successful")
        return True
    else:
        print(f"  ❌ Docker build failed: {stderr}")
        return False

def test_requirements_consistency() -> bool:
    """Test that requirements.txt is consistent with actual imports"""
    print("🔍 Testing Requirements Consistency...")
    
    backend_dir = Path(__file__).parent.parent
    script_dir = backend_dir / "scripts"
    
    # Run our dependency validation script
    success, stdout, stderr = run_command(
        f"{sys.executable} validate_dependencies.py",
        cwd=script_dir
    )
    
    if success:
        print("  ✅ Requirements consistency check passed")
        return True
    else:
        print(f"  ❌ Requirements consistency check failed: {stderr}")
        return False

def test_import_validation() -> bool:
    """Test that all imports can be resolved"""
    print("🔍 Testing Import Validation...")
    
    backend_dir = Path(__file__).parent.parent
    script_dir = backend_dir / "scripts"
    
    # Run our import validation script
    success, stdout, stderr = run_command(
        f"{sys.executable} validate_imports.py",
        cwd=script_dir
    )
    
    if success:
        print("  ✅ Import validation passed")
        return True
    else:
        print(f"  ❌ Import validation failed: {stderr}")
        return False

def test_loyalty_service_imports() -> bool:
    """Test that loyalty service can be imported"""
    print("🔍 Testing Loyalty Service Imports...")
    
    try:
        # Test importing our loyalty services
        sys.path.insert(0, str(Path(__file__).parent.parent))
        
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

def test_rbac_imports() -> bool:
    """Test that RBAC system can be imported"""
    print("🔍 Testing RBAC System Imports...")
    
    try:
        sys.path.insert(0, str(Path(__file__).parent.parent))
        
        from auth.rbac import Permission, Role, rbac_manager
        
        print("  ✅ RBAC system imports successfully")
        return True
        
    except ImportError as e:
        print(f"  ❌ RBAC system import failed: {e}")
        return False
    except Exception as e:
        print(f"  ❌ RBAC system import error: {e}")
        return False

def main():
    """Main validation function"""
    print("🚀 Pre-Deployment Validation")
    print("=" * 60)
    print()
    
    tests = [
        ("Critical Imports", test_imports),
        ("QR Code Generation", test_qr_code_generation),
        ("Requirements Consistency", test_requirements_consistency),
        ("Import Validation", test_import_validation),
        ("Loyalty Service Imports", test_loyalty_service_imports),
        ("RBAC System Imports", test_rbac_imports),
        ("Docker Build", test_docker_build),
    ]
    
    results = {}
    passed = 0
    failed = 0
    
    for test_name, test_func in tests:
        print(f"📋 {test_name}")
        try:
            result = test_func()
            if isinstance(result, dict):
                # Handle test_imports which returns a dict
                if result.get("failed"):
                    results[test_name] = False
                    failed += 1
                else:
                    results[test_name] = True
                    passed += 1
            else:
                # Handle boolean results
                results[test_name] = result
                if result:
                    passed += 1
                else:
                    failed += 1
        except Exception as e:
            print(f"  ❌ Test failed with exception: {e}")
            results[test_name] = False
            failed += 1
        
        print()
    
    print("=" * 60)
    print(f"📊 Validation Results: {passed} passed, {failed} failed")
    print()
    
    if failed == 0:
        print("🎉 All pre-deployment checks passed!")
        print("✅ System is ready for deployment")
        return 0
    else:
        print("⚠️  Some pre-deployment checks failed:")
        for test_name, result in results.items():
            if not result:
                print(f"   ❌ {test_name}")
        print()
        print("❌ Please fix the issues before deployment")
        return 1

if __name__ == "__main__":
    sys.exit(main())

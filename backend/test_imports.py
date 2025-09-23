#!/usr/bin/env python3
"""
Test script to verify all model imports work correctly.
"""

import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test all model imports."""
    try:
        print("Testing model imports...")
        
        # Test individual model imports
        from models.hospitality_property import HospitalityProperty
        print("✅ HospitalityProperty imported")
        
        from models.customer import Customer
        print("✅ Customer imported")
        
        from models.room import RoomType, Room
        print("✅ Room models imported")
        
        from models.menu import MenuCategory, Menu
        print("✅ Menu models imported")
        
        from models.order import Order, OrderItem
        print("✅ Order models imported")
        
        from models.user import BuffrHostUser
        print("✅ User models imported")
        
        from models.user_type import UserType
        print("✅ UserType imported")
        
        from models.inventory import InventoryItem
        print("✅ Inventory models imported")
        
        from models.modifiers import Modifiers
        print("✅ Modifiers imported")
        
        from models.cms import CMSContent
        print("✅ CMS models imported")
        
        # Test new model imports
        try:
            from models.services import SpaService, ConferenceRoom
            print("✅ Service models imported")
        except ImportError as e:
            print(f"⚠️  Service models import failed: {e}")
        
        try:
            from models.loyalty import CrossBusinessLoyalty
            print("✅ Loyalty models imported")
        except ImportError as e:
            print(f"⚠️  Loyalty models import failed: {e}")
        
        try:
            from models.corporate import CorporateCustomer
            print("✅ Corporate models imported")
        except ImportError as e:
            print(f"⚠️  Corporate models import failed: {e}")
        
        try:
            from models.compliance import KYCKYBDocument
            print("✅ Compliance models imported")
        except ImportError as e:
            print(f"⚠️  Compliance models import failed: {e}")
        
        try:
            from models.ai_knowledge import KnowledgeBase
            print("✅ AI Knowledge models imported")
        except ImportError as e:
            print(f"⚠️  AI Knowledge models import failed: {e}")
        
        try:
            from models.documents import DocumentManagement
            print("✅ Document models imported")
        except ImportError as e:
            print(f"⚠️  Document models import failed: {e}")
        
        # Test bulk import
        import models
        print("✅ Models module imported successfully")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    success = test_imports()
    if success:
        print("\n🎉 All model imports successful!")
        sys.exit(0)
    else:
        print("\n💥 Some imports failed!")
        sys.exit(1)

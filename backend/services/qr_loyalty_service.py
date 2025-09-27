"""
QR Code Loyalty Integration Service for The Shandi Hospitality Ecosystem Management Platform
Provides QR code generation and scanning for loyalty enrollment and redemption.
"""

from typing import Dict, Any, Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import select
from models.user import User, Profile
from models.hospitality_property import HospitalityProperty
from services.loyalty_service import LoyaltyService
from datetime import datetime, timedelta
import uuid
import qrcode
import io
import base64

class QRLoyaltyService:
    """Service class for QR code loyalty operations"""
    
    def __init__(self, db: Session):
        self.db = db
        self.loyalty_service = LoyaltyService(db)
    
    def generate_loyalty_enrollment_qr(self, property_id: int, 
                                     customer_id: Optional[uuid.UUID] = None) -> Dict[str, Any]:
        """Generate QR code for loyalty program enrollment"""
        property = self._get_property(property_id)
        if not property:
            return {"success": False, "error": "Property not found"}
        
        # Create enrollment URL with property and customer info
        enrollment_data = {
            "type": "loyalty_enrollment",
            "property_id": property_id,
            "property_name": property.property_name,
            "customer_id": str(customer_id) if customer_id else None,
            "timestamp": datetime.utcnow().isoformat(),
            "expires_at": (datetime.utcnow() + timedelta(days=7)).isoformat()
        }
        
        # Generate QR code
        qr_code_data = self._create_qr_code(enrollment_data)
        
        return {
            "success": True,
            "qr_code": qr_code_data,
            "enrollment_url": f"https://shandi.app/loyalty/enroll/{property_id}",
            "expires_at": enrollment_data["expires_at"]
        }
    
    def generate_cross_business_redemption_qr(self, customer_id: uuid.UUID, 
                                            property_id: int,
                                            source_service: str, 
                                            target_service: str,
                                            points: int) -> Dict[str, Any]:
        """Generate QR code for cross-business redemption"""
        customer = self._get_customer(customer_id)
        if not customer:
            return {"success": False, "error": "Profile not found"}
        
        # Check if customer has sufficient points
        if customer.loyalty_points < points:
            return {"success": False, "error": "Insufficient loyalty points"}
        
        # Create redemption data
        redemption_data = {
            "type": "cross_business_redemption",
            "customer_id": str(customer_id),
            "property_id": property_id,
            "source_service": source_service,
            "target_service": target_service,
            "points": points,
            "tier": self.loyalty_service.calculate_loyalty_tier(customer_id),
            "timestamp": datetime.utcnow().isoformat(),
            "expires_at": (datetime.utcnow() + timedelta(hours=24)).isoformat()
        }
        
        # Generate QR code
        qr_code_data = self._create_qr_code(redemption_data)
        
        return {
            "success": True,
            "qr_code": qr_code_data,
            "redemption_id": str(uuid.uuid4()),
            "expires_at": redemption_data["expires_at"],
            "customer_tier": redemption_data["tier"]
        }
    
    def generate_menu_with_loyalty_qr(self, property_id: int, 
                                    customer_id: Optional[uuid.UUID] = None) -> Dict[str, Any]:
        """Generate QR code that combines menu access with loyalty enrollment"""
        property = self._get_property(property_id)
        if not property:
            return {"success": False, "error": "Property not found"}
        
        # Create combined menu + loyalty data
        menu_loyalty_data = {
            "type": "menu_with_loyalty",
            "property_id": property_id,
            "property_name": property.property_name,
            "customer_id": str(customer_id) if customer_id else None,
            "menu_url": f"https://shandi.app/menu/{property_id}",
            "loyalty_url": f"https://shandi.app/loyalty/{property_id}",
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Generate QR code
        qr_code_data = self._create_qr_code(menu_loyalty_data)
        
        return {
            "success": True,
            "qr_code": qr_code_data,
            "menu_url": menu_loyalty_data["menu_url"],
            "loyalty_url": menu_loyalty_data["loyalty_url"],
            "property_name": property.property_name
        }
    
    def scan_loyalty_qr(self, qr_data: str, property_id: int) -> Dict[str, Any]:
        """Process scanned QR code for loyalty operations"""
        try:
            # Parse QR code data
            import json
            data = json.loads(qr_data)
            
            if data.get("type") == "loyalty_enrollment":
                return self._process_enrollment_qr(data, property_id)
            elif data.get("type") == "cross_business_redemption":
                return self._process_redemption_qr(data, property_id)
            elif data.get("type") == "menu_with_loyalty":
                return self._process_menu_loyalty_qr(data, property_id)
            else:
                return {"success": False, "error": "Invalid QR code type"}
                
        except Exception as e:
            return {"success": False, "error": f"Invalid QR code data: {str(e)}"}
    
    def get_loyalty_qr_analytics(self, property_id: int, 
                               start_date: Optional[datetime] = None,
                               end_date: Optional[datetime] = None) -> Dict[str, Any]:
        """Get analytics for QR code loyalty interactions"""
        # TODO: Implement actual analytics based on QR scans
        analytics = {
            "property_id": property_id,
            "total_qr_scans": 0,
            "enrollment_qr_scans": 0,
            "redemption_qr_scans": 0,
            "menu_loyalty_qr_scans": 0,
            "conversion_rates": {
                "enrollment_conversion": 0.0,
                "redemption_conversion": 0.0,
                "menu_to_loyalty_conversion": 0.0
            },
            "popular_redemptions": [],
            "peak_scan_times": [],
            "period": {
                "start_date": start_date.isoformat() if start_date else None,
                "end_date": end_date.isoformat() if end_date else None
            }
        }
        
        return analytics
    
    def _create_qr_code(self, data: Dict[str, Any]) -> str:
        """Create QR code image from data"""
        import json
        
        # Convert data to JSON string
        qr_data = json.dumps(data)
        
        # Generate QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4)
        qr.add_data(qr_data)
        qr.make(fit=True)
        
        # Create image
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to base64 string
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        return f"data:image/png;base64,{img_str}"
    
    def _process_enrollment_qr(self, data: Dict[str, Any], property_id: int) -> Dict[str, Any]:
        """Process loyalty enrollment QR code"""
        customer_id = data.get("customer_id")
        
        if not customer_id:
            return {
                "success": True,
                "action": "enrollment_required",
                "message": "Profile needs to enroll in loyalty program",
                "enrollment_url": f"https://shandi.app/loyalty/enroll/{property_id}"
            }
        
        # Check if customer is already enrolled
        customer = self._get_customer(customer_id)
        if customer and customer.loyalty_points > 0:
            return {
                "success": True,
                "action": "already_enrolled",
                "message": "Profile is already enrolled in loyalty program",
                "loyalty_summary": self.loyalty_service.get_customer_loyalty_summary(customer_id)
            }
        
        return {
            "success": True,
            "action": "enrollment_ready",
            "message": "Profile can enroll in loyalty program",
            "customer_id": customer_id
        }
    
    def _process_redemption_qr(self, data: Dict[str, Any], property_id: int) -> Dict[str, Any]:
        """Process cross-business redemption QR code"""
        customer_id = data.get("customer_id")
        source_service = data.get("source_service")
        target_service = data.get("target_service")
        points = data.get("points", 0)
        
        # Process the redemption
        result = self.loyalty_service.create_cross_business_redemption(
            customer_id, source_service, target_service, points, property_id
        )
        
        return result
    
    def _process_menu_loyalty_qr(self, data: Dict[str, Any], property_id: int) -> Dict[str, Any]:
        """Process menu with loyalty QR code"""
        customer_id = data.get("customer_id")
        
        response = {
            "success": True,
            "action": "menu_with_loyalty",
            "menu_url": data.get("menu_url"),
            "loyalty_url": data.get("loyalty_url"),
            "property_name": data.get("property_name")
        }
        
        if customer_id:
            # Get customer loyalty status
            loyalty_summary = self.loyalty_service.get_customer_loyalty_summary(customer_id)
            response["loyalty_status"] = loyalty_summary
        
        return response
    
    def _get_customer(self, customer_id: uuid.UUID) -> Optional[Profile]:
        """Get customer by ID"""
        result = self.db.execute(
            select(Profile).where(Profile.customer_id == customer_id)
        )
        return result.scalar_one_or_none()
    
    def _get_property(self, property_id: int) -> Optional[HospitalityProperty]:
        """Get property by ID"""
        result = self.db.execute(
            select(HospitalityProperty).where(HospitalityProperty.property_id == property_id)
        )
        return result.scalar_one_or_none()

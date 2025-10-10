"""
BuffrSign-Starter: Template Service
Signature template management and hospitality-specific templates
"""

import os
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from supabase import create_client, Client
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="BuffrSign Template Service",
    description="Signature template management and hospitality-specific templates",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase client initialization
supabase: Client = create_client(
    os.getenv("SUPABASE_URL", "http://localhost:54321"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY", "your-service-role-key")
)

# Pydantic models
class CreateTemplateRequest(BaseModel):
    template_id: str = Field(..., min_length=1, max_length=255)
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    category: str = Field(default="general", regex="^(general|hospitality|legal|hr|vendor)$")
    field_definitions: List[Dict[str, Any]]
    recipient_definitions: List[Dict[str, Any]]
    workflow_rules: Dict[str, Any] = Field(default_factory=dict)
    ai_enhancements: Dict[str, Any] = Field(default_factory=dict)

class TemplateResponse(BaseModel):
    id: str
    template_id: str
    name: str
    description: Optional[str]
    category: str
    field_count: int
    recipient_count: int
    is_active: bool
    created_at: str

class HospitalityTemplateRequest(BaseModel):
    template_type: str = Field(..., regex="^(guest_checkin|event_contract|employee_onboarding|vendor_agreement|service_agreement|liability_waiver)$")
    property_data: Dict[str, Any]

# Dependency to get current user (placeholder)
async def get_current_user(request: Request) -> str:
    """Get current user from request headers (placeholder for auth integration)"""
    return str(uuid.uuid4())

# Hospitality Template Manager
class HospitalityTemplateManager:
    def __init__(self):
        self.templates = {
            "guest_checkin": self._create_guest_checkin_template,
            "event_contract": self._create_event_contract_template,
            "employee_onboarding": self._create_employee_onboarding_template,
            "vendor_agreement": self._create_vendor_agreement_template,
            "service_agreement": self._create_service_agreement_template,
            "liability_waiver": self._create_liability_waiver_template
        }
    
    def create_hospitality_template(self, template_type: str, property_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create hospitality-specific template"""
        if template_type not in self.templates:
            raise ValueError(f"Unknown template type: {template_type}")
        
        template_func = self.templates[template_type]
        return template_func(property_data)
    
    def _create_guest_checkin_template(self, property_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create guest check-in signature template"""
        return {
            "template_id": f"guest_checkin_{property_data.get('property_id', 'default')}",
            "name": f"{property_data.get('property_name', 'Property')} Guest Check-in",
            "description": "Digital signature template for guest check-in process",
            "category": "hospitality",
            "field_definitions": [
                {
                    "type": "text",
                    "label": "Guest Name",
                    "required": True,
                    "validation": {"min_length": 2, "max_length": 100},
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 100,
                    "width": 200,
                    "height": 30
                },
                {
                    "type": "text",
                    "label": "Room Number",
                    "required": True,
                    "validation": {"pattern": "^[0-9]+$"},
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 150,
                    "width": 100,
                    "height": 30
                },
                {
                    "type": "dateSigned",
                    "label": "Check-in Date",
                    "required": True,
                    "auto_fill": True,
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 200,
                    "width": 120,
                    "height": 30
                },
                {
                    "type": "signHere",
                    "label": "Guest Signature",
                    "required": True,
                    "ai_suggested": True,
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 250,
                    "width": 200,
                    "height": 50
                },
                {
                    "type": "initialHere",
                    "label": "Guest Initials",
                    "required": True,
                    "initials_style": "formal",
                    "page_number": 1,
                    "x_position": 150,
                    "y_position": 250,
                    "width": 100,
                    "height": 30
                },
                {
                    "type": "text",
                    "label": "Emergency Contact",
                    "required": True,
                    "validation": {"min_length": 10},
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 300,
                    "width": 200,
                    "height": 30
                }
            ],
            "recipient_definitions": [
                {
                    "recipient_type": "signer",
                    "recipient_name": "Guest",
                    "routing_order": 1,
                    "authentication_method": ["email"],
                    "required_fields": ["Guest Name", "Room Number", "Guest Signature", "Guest Initials", "Emergency Contact"]
                }
            ],
            "workflow_rules": {
                "steps": ["guest_review", "staff_approval", "completion"],
                "auto_fields": {
                    "property_name": property_data.get("property_name", ""),
                    "check_in_time": "{{current_time}}",
                    "staff_signature": "{{staff_user}}"
                }
            },
            "ai_enhancements": {
                "auto_place_fields": True,
                "contract_analysis": True,
                "compliance_check": True
            }
        }
    
    def _create_event_contract_template(self, property_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create event contract template"""
        return {
            "template_id": f"event_contract_{property_data.get('property_id', 'default')}",
            "name": f"{property_data.get('property_name', 'Property')} Event Contract",
            "description": "Digital signature template for event contracts",
            "category": "hospitality",
            "field_definitions": [
                {
                    "type": "text",
                    "label": "Client Name",
                    "required": True,
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 100,
                    "width": 200,
                    "height": 30
                },
                {
                    "type": "text",
                    "label": "Event Date",
                    "required": True,
                    "validation": {"type": "date"},
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 150,
                    "width": 120,
                    "height": 30
                },
                {
                    "type": "text",
                    "label": "Venue Requirements",
                    "required": True,
                    "multiline": True,
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 200,
                    "width": 300,
                    "height": 60
                },
                {
                    "type": "text",
                    "label": "Cancellation Terms",
                    "required": True,
                    "multiline": True,
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 280,
                    "width": 300,
                    "height": 60
                },
                {
                    "type": "signHere",
                    "label": "Client Signature",
                    "required": True,
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 360,
                    "width": 200,
                    "height": 50
                },
                {
                    "type": "signHere",
                    "label": "Manager Signature",
                    "required": True,
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 420,
                    "width": 200,
                    "height": 50
                }
            ],
            "recipient_definitions": [
                {
                    "recipient_type": "signer",
                    "recipient_name": "Client",
                    "routing_order": 1,
                    "authentication_method": ["email"],
                    "required_fields": ["Client Name", "Event Date", "Venue Requirements", "Cancellation Terms", "Client Signature"]
                },
                {
                    "recipient_type": "signer",
                    "recipient_name": "Manager",
                    "routing_order": 2,
                    "authentication_method": ["email"],
                    "required_fields": ["Manager Signature"]
                }
            ],
            "workflow_rules": {
                "steps": ["client_review", "manager_approval", "final_signing"],
                "integrations": ["calendar_sync", "invoice_generation"]
            },
            "ai_enhancements": {
                "contract_analysis": True,
                "risk_assessment": True,
                "compliance_check": True
            }
        }
    
    def _create_employee_onboarding_template(self, property_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create employee onboarding template"""
        return {
            "template_id": f"employee_onboarding_{property_data.get('property_id', 'default')}",
            "name": f"{property_data.get('property_name', 'Property')} Employee Onboarding",
            "description": "Digital signature template for employee onboarding documents",
            "category": "hr",
            "field_definitions": [
                {
                    "type": "text",
                    "label": "Employee Name",
                    "required": True,
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 100,
                    "width": 200,
                    "height": 30
                },
                {
                    "type": "text",
                    "label": "Position",
                    "required": True,
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 150,
                    "width": 200,
                    "height": 30
                },
                {
                    "type": "text",
                    "label": "Start Date",
                    "required": True,
                    "validation": {"type": "date"},
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 200,
                    "width": 120,
                    "height": 30
                },
                {
                    "type": "signHere",
                    "label": "Employee Signature",
                    "required": True,
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 250,
                    "width": 200,
                    "height": 50
                },
                {
                    "type": "signHere",
                    "label": "HR Signature",
                    "required": True,
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 310,
                    "width": 200,
                    "height": 50
                }
            ],
            "recipient_definitions": [
                {
                    "recipient_type": "signer",
                    "recipient_name": "Employee",
                    "routing_order": 1,
                    "authentication_method": ["email"],
                    "required_fields": ["Employee Name", "Position", "Start Date", "Employee Signature"]
                },
                {
                    "recipient_type": "signer",
                    "recipient_name": "HR Manager",
                    "routing_order": 2,
                    "authentication_method": ["email"],
                    "required_fields": ["HR Signature"]
                }
            ],
            "workflow_rules": {
                "steps": ["employee_review", "hr_approval", "completion"],
                "automation": ["hr_system_sync", "badge_creation", "training_schedule"]
            },
            "ai_enhancements": {
                "contract_analysis": True,
                "compliance_check": True,
                "template_matching": True
            }
        }
    
    def _create_vendor_agreement_template(self, property_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create vendor agreement template"""
        return {
            "template_id": f"vendor_agreement_{property_data.get('property_id', 'default')}",
            "name": f"{property_data.get('property_name', 'Property')} Vendor Agreement",
            "description": "Digital signature template for vendor agreements",
            "category": "vendor",
            "field_definitions": [
                {
                    "type": "text",
                    "label": "Vendor Name",
                    "required": True,
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 100,
                    "width": 200,
                    "height": 30
                },
                {
                    "type": "text",
                    "label": "Service Type",
                    "required": True,
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 150,
                    "width": 200,
                    "height": 30
                },
                {
                    "type": "text",
                    "label": "Contract Terms",
                    "required": True,
                    "multiline": True,
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 200,
                    "width": 300,
                    "height": 60
                },
                {
                    "type": "signHere",
                    "label": "Vendor Signature",
                    "required": True,
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 280,
                    "width": 200,
                    "height": 50
                },
                {
                    "type": "signHere",
                    "label": "Property Manager Signature",
                    "required": True,
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 340,
                    "width": 200,
                    "height": 50
                }
            ],
            "recipient_definitions": [
                {
                    "recipient_type": "signer",
                    "recipient_name": "Vendor",
                    "routing_order": 1,
                    "authentication_method": ["email"],
                    "required_fields": ["Vendor Name", "Service Type", "Contract Terms", "Vendor Signature"]
                },
                {
                    "recipient_type": "signer",
                    "recipient_name": "Property Manager",
                    "routing_order": 2,
                    "authentication_method": ["email"],
                    "required_fields": ["Property Manager Signature"]
                }
            ],
            "workflow_rules": {
                "steps": ["vendor_review", "manager_approval", "completion"],
                "automation": ["vendor_database_update", "payment_setup"]
            },
            "ai_enhancements": {
                "contract_analysis": True,
                "risk_assessment": True,
                "vendor_verification": True
            }
        }
    
    def _create_service_agreement_template(self, property_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create service agreement template"""
        return {
            "template_id": f"service_agreement_{property_data.get('property_id', 'default')}",
            "name": f"{property_data.get('property_name', 'Property')} Service Agreement",
            "description": "Digital signature template for service agreements",
            "category": "hospitality",
            "field_definitions": [
                {
                    "type": "text",
                    "label": "Service Type",
                    "required": True,
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 100,
                    "width": 200,
                    "height": 30
                },
                {
                    "type": "text",
                    "label": "Service Date",
                    "required": True,
                    "validation": {"type": "date"},
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 150,
                    "width": 120,
                    "height": 30
                },
                {
                    "type": "text",
                    "label": "Service Details",
                    "required": True,
                    "multiline": True,
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 200,
                    "width": 300,
                    "height": 60
                },
                {
                    "type": "signHere",
                    "label": "Client Signature",
                    "required": True,
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 280,
                    "width": 200,
                    "height": 50
                }
            ],
            "recipient_definitions": [
                {
                    "recipient_type": "signer",
                    "recipient_name": "Client",
                    "routing_order": 1,
                    "authentication_method": ["email"],
                    "required_fields": ["Service Type", "Service Date", "Service Details", "Client Signature"]
                }
            ],
            "workflow_rules": {
                "steps": ["client_review", "service_confirmation"],
                "automation": ["service_scheduling", "payment_processing"]
            },
            "ai_enhancements": {
                "contract_analysis": True,
                "service_optimization": True
            }
        }
    
    def _create_liability_waiver_template(self, property_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create liability waiver template"""
        return {
            "template_id": f"liability_waiver_{property_data.get('property_id', 'default')}",
            "name": f"{property_data.get('property_name', 'Property')} Liability Waiver",
            "description": "Digital signature template for liability waivers",
            "category": "legal",
            "field_definitions": [
                {
                    "type": "text",
                    "label": "Participant Name",
                    "required": True,
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 100,
                    "width": 200,
                    "height": 30
                },
                {
                    "type": "text",
                    "label": "Activity Type",
                    "required": True,
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 150,
                    "width": 200,
                    "height": 30
                },
                {
                    "type": "checkbox",
                    "label": "I understand the risks",
                    "required": True,
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 200,
                    "width": 20,
                    "height": 20
                },
                {
                    "type": "signHere",
                    "label": "Participant Signature",
                    "required": True,
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 250,
                    "width": 200,
                    "height": 50
                },
                {
                    "type": "dateSigned",
                    "label": "Date",
                    "required": True,
                    "auto_fill": True,
                    "page_number": 1,
                    "x_position": 100,
                    "y_position": 310,
                    "width": 120,
                    "height": 30
                }
            ],
            "recipient_definitions": [
                {
                    "recipient_type": "signer",
                    "recipient_name": "Participant",
                    "routing_order": 1,
                    "authentication_method": ["email"],
                    "required_fields": ["Participant Name", "Activity Type", "I understand the risks", "Participant Signature", "Date"]
                }
            ],
            "workflow_rules": {
                "steps": ["participant_review", "completion"],
                "compliance": ["liability_protection", "legal_requirements"]
            },
            "ai_enhancements": {
                "risk_assessment": True,
                "compliance_check": True,
                "legal_validation": True
            }
        }

# Initialize hospitality template manager
template_manager = HospitalityTemplateManager()

# API Endpoints
@app.post("/templates", response_model=TemplateResponse)
async def create_template(
    request: CreateTemplateRequest,
    user_id: str = Depends(get_current_user)
):
    """Create a new signature template"""
    try:
        # Create template in Supabase
        template_data = {
            "template_id": request.template_id,
            "name": request.name,
            "description": request.description,
            "category": request.category,
            "field_definitions": request.field_definitions,
            "recipient_definitions": request.recipient_definitions,
            "workflow_rules": request.workflow_rules,
            "ai_enhancements": request.ai_enhancements,
            "created_by": user_id
        }
        
        result = supabase.table("signature_templates").insert(template_data).execute()
        
        if result.data:
            template = result.data[0]
            return TemplateResponse(
                id=template["id"],
                template_id=template["template_id"],
                name=template["name"],
                description=template["description"],
                category=template["category"],
                field_count=len(template["field_definitions"]),
                recipient_count=len(template["recipient_definitions"]),
                is_active=template["is_active"],
                created_at=template["created_at"]
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to create template")
            
    except Exception as e:
        logger.error(f"Error creating template: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/templates/hospitality")
async def create_hospitality_template(
    request: HospitalityTemplateRequest,
    user_id: str = Depends(get_current_user)
):
    """Create hospitality-specific template"""
    try:
        # Generate hospitality template
        template_data = template_manager.create_hospitality_template(
            request.template_type,
            request.property_data
        )
        
        # Create template in database
        template_data["created_by"] = user_id
        
        result = supabase.table("signature_templates").insert(template_data).execute()
        
        if result.data:
            template = result.data[0]
            return {
                "id": template["id"],
                "template_id": template["template_id"],
                "name": template["name"],
                "description": template["description"],
                "category": template["category"],
                "field_count": len(template["field_definitions"]),
                "recipient_count": len(template["recipient_definitions"]),
                "is_active": template["is_active"],
                "created_at": template["created_at"]
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to create hospitality template")
            
    except Exception as e:
        logger.error(f"Error creating hospitality template: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/templates")
async def get_templates(
    category: Optional[str] = None,
    user_id: str = Depends(get_current_user)
):
    """Get all templates"""
    try:
        query = supabase.table("signature_templates").select("*")
        
        if category:
            query = query.eq("category", category)
        
        result = query.execute()
        
        if result.data:
            templates = []
            for template in result.data:
                templates.append({
                    "id": template["id"],
                    "template_id": template["template_id"],
                    "name": template["name"],
                    "description": template["description"],
                    "category": template["category"],
                    "field_count": len(template["field_definitions"]),
                    "recipient_count": len(template["recipient_definitions"]),
                    "is_active": template["is_active"],
                    "created_at": template["created_at"]
                })
            return templates
        else:
            return []
            
    except Exception as e:
        logger.error(f"Error getting templates: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/templates/{template_id}")
async def get_template(
    template_id: str,
    user_id: str = Depends(get_current_user)
):
    """Get template details"""
    try:
        result = supabase.table("signature_templates").select("*").eq("template_id", template_id).execute()
        
        if result.data:
            template = result.data[0]
            return template
        else:
            raise HTTPException(status_code=404, detail="Template not found")
            
    except Exception as e:
        logger.error(f"Error getting template: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/templates/{template_id}")
async def update_template(
    template_id: str,
    request: CreateTemplateRequest,
    user_id: str = Depends(get_current_user)
):
    """Update template"""
    try:
        # Verify template exists and user has access
        template_result = supabase.table("signature_templates").select("id").eq("template_id", template_id).eq("created_by", user_id).execute()
        
        if not template_result.data:
            raise HTTPException(status_code=404, detail="Template not found or access denied")
        
        # Update template
        update_data = {
            "name": request.name,
            "description": request.description,
            "category": request.category,
            "field_definitions": request.field_definitions,
            "recipient_definitions": request.recipient_definitions,
            "workflow_rules": request.workflow_rules,
            "ai_enhancements": request.ai_enhancements
        }
        
        result = supabase.table("signature_templates").update(update_data).eq("template_id", template_id).execute()
        
        if result.data:
            return result.data[0]
        else:
            raise HTTPException(status_code=500, detail="Failed to update template")
            
    except Exception as e:
        logger.error(f"Error updating template: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/templates/{template_id}")
async def delete_template(
    template_id: str,
    user_id: str = Depends(get_current_user)
):
    """Delete template"""
    try:
        # Verify template exists and user has access
        template_result = supabase.table("signature_templates").select("id").eq("template_id", template_id).eq("created_by", user_id).execute()
        
        if not template_result.data:
            raise HTTPException(status_code=404, detail="Template not found or access denied")
        
        # Delete template
        result = supabase.table("signature_templates").delete().eq("template_id", template_id).execute()
        
        if result:
            return {"status": "success", "message": "Template deleted successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to delete template")
            
    except Exception as e:
        logger.error(f"Error deleting template: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/templates/hospitality/types")
async def get_hospitality_template_types():
    """Get available hospitality template types"""
    return {
        "template_types": [
            {
                "type": "guest_checkin",
                "name": "Guest Check-in",
                "description": "Digital signature template for guest check-in process",
                "fields": ["guest_signature", "date_arrival", "room_number", "emergency_contact"],
                "auto_fields": ["property_name", "check_in_time", "staff_signature"],
                "compliance": "standard"
            },
            {
                "type": "event_contract",
                "name": "Event Contract",
                "description": "Digital signature template for event contracts",
                "fields": ["client_signature", "event_date", "venue_requirements", "cancellation_terms"],
                "workflows": ["client_review", "manager_approval", "final_signing"],
                "integrations": ["calendar_sync", "invoice_generation"],
                "compliance": "advanced"
            },
            {
                "type": "employee_onboarding",
                "name": "Employee Onboarding",
                "description": "Digital signature template for employee onboarding documents",
                "multi_document": True,
                "documents": ["employment_contract", "nda_agreement", "policy_acknowledgment"],
                "automation": ["hr_system_sync", "badge_creation", "training_schedule"],
                "compliance": "qualified"
            },
            {
                "type": "vendor_agreement",
                "name": "Vendor Agreement",
                "description": "Digital signature template for vendor agreements",
                "fields": ["vendor_signature", "service_type", "contract_terms"],
                "workflows": ["vendor_review", "manager_approval"],
                "automation": ["vendor_database_update", "payment_setup"],
                "compliance": "advanced"
            },
            {
                "type": "service_agreement",
                "name": "Service Agreement",
                "description": "Digital signature template for service agreements",
                "fields": ["client_signature", "service_type", "service_date", "service_details"],
                "workflows": ["client_review", "service_confirmation"],
                "automation": ["service_scheduling", "payment_processing"],
                "compliance": "standard"
            },
            {
                "type": "liability_waiver",
                "name": "Liability Waiver",
                "description": "Digital signature template for liability waivers",
                "fields": ["participant_signature", "activity_type", "risk_acknowledgment"],
                "workflows": ["participant_review", "completion"],
                "compliance": ["liability_protection", "legal_requirements"],
                "compliance": "qualified"
            }
        ]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "template-service",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8008)
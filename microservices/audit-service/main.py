"""
BuffrSign-Starter: Audit Service
Comprehensive audit trail and compliance monitoring (Phase 3)
"""

import os
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from supabase import create_client, Client
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="BuffrSign Audit Service",
    description="Comprehensive audit trail and compliance monitoring",
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
class CreateAuditLogRequest(BaseModel):
    envelope_id: str
    event_type: str
    event_description: str
    user_id: Optional[str] = None
    recipient_id: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    session_id: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

# Dependency to get current user (placeholder)
async def get_current_user(request: Request) -> str:
    """Get current user from request headers (placeholder for auth integration)"""
    return str(uuid.uuid4())

# API Endpoints
@app.post("/audit/log")
async def create_audit_log(
    request: CreateAuditLogRequest,
    user_id: str = Depends(get_current_user)
):
    """Create audit log entry"""
    try:
        # Create audit log in Supabase
        audit_data = {
            "envelope_id": request.envelope_id,
            "event_type": request.event_type,
            "event_description": request.event_description,
            "user_id": request.user_id or user_id,
            "recipient_id": request.recipient_id,
            "ip_address": request.ip_address,
            "user_agent": request.user_agent,
            "session_id": request.session_id,
            "metadata": request.metadata
        }
        
        result = supabase.table("signature_audit_log").insert(audit_data).execute()
        
        if result.data:
            return result.data[0]
        else:
            raise HTTPException(status_code=500, detail="Failed to create audit log")
            
    except Exception as e:
        logger.error(f"Error creating audit log: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/audit/{envelope_id}")
async def get_audit_trail(
    envelope_id: str,
    user_id: str = Depends(get_current_user)
):
    """Get audit trail for envelope"""
    try:
        result = supabase.table("signature_audit_log").select("*").eq("envelope_id", envelope_id).order("timestamp", desc=True).execute()
        
        if result.data:
            return result.data
        else:
            return []
            
    except Exception as e:
        logger.error(f"Error getting audit trail: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/audit/compliance/{envelope_id}")
async def get_compliance_report(
    envelope_id: str,
    user_id: str = Depends(get_current_user)
):
    """Get compliance report for envelope"""
    try:
        # Placeholder compliance report
        # In Phase 3, this will generate actual compliance reports
        
        return {
            "envelope_id": envelope_id,
            "compliance_status": "compliant",
            "checks": {
                "eIDAS": {"status": "passed", "level": "standard"},
                "ESIGN": {"status": "passed"},
                "GDPR": {"status": "passed"},
                "audit_trail": {"status": "complete"}
            },
            "recommendations": [],
            "generated_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting compliance report: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "audit-service",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8011)
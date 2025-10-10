"""
BuffrSign Signature Service
Core signature envelope management and digital signature processing
"""

import os
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, validator
import uvicorn

from supabase import create_client, Client
from services.signature_manager import SignatureManager
from services.digital_initials_manager import DigitalInitialsManager
from models.signature_models import (
    EnvelopeCreateRequest, EnvelopeResponse, EnvelopeUpdateRequest,
    SignatureFieldRequest, SignatureFieldResponse, DigitalInitialsRequest,
    DigitalInitialsResponse, EnvelopeStatus
)
from utils.database import get_supabase_client
from utils.auth import verify_jwt_token
from utils.logging_config import setup_logging

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

# Global variables for services
signature_manager: Optional[SignatureManager] = None
initials_manager: Optional[DigitalInitialsManager] = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global supabase_client
    
    # Startup
    logger.info("Starting Buffr Host Signature Service Service...")
    
    try:
        # Initialize Supabase client
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        if not supabase_url or not supabase_key:
            raise ValueError("Missing Supabase configuration")
        
        supabase_client = create_client(supabase_url, supabase_key)
        
        # Run database migrations
        try:
            from shared.supabase_migrations.supabase_migration_runner import SignatureserviceServiceSupabaseMigrationRunner
            database_url = os.getenv("DATABASE_URL")
            if database_url:
                migration_runner = SignatureserviceServiceSupabaseMigrationRunner(database_url)
                migration_success = await migration_runner.run_migrations()
                if migration_success:
                    logger.info("Database migrations completed successfully")
                else:
                    logger.warning("Database migrations failed - continuing anyway")
            else:
                logger.warning("No DATABASE_URL provided - skipping migrations")
        except Exception as migration_error:
            logger.error(f"Migration error: {migration_error} - continuing anyway")
        
        logger.info("Signature Service Service initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize Signature Service Service: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down Signature Service Service...")# Create FastAPI app
app = FastAPI(
    title="BuffrSign Signature Service",
    description="Core signature envelope management and digital signature processing",
    version="1.0.0",
    lifespan=lifespan
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Configure appropriately for production
)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "signature-service",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

# Signature envelope endpoints
@app.post("/envelopes", response_model=EnvelopeResponse)
async def create_envelope(
    request: EnvelopeCreateRequest,
    current_user: dict = Depends(verify_jwt_token)
):
    """Create a new signature envelope"""
    try:
        logger.info(f"Creating envelope: {request.envelope_name}")
        
        envelope = await signature_manager.create_envelope(
            request=request,
            user_id=current_user["sub"]
        )
        
        logger.info(f"Envelope created successfully: {envelope.id}")
        return envelope
        
    except Exception as e:
        logger.error(f"Failed to create envelope: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create envelope: {str(e)}"
        )

@app.get("/envelopes/{envelope_id}", response_model=EnvelopeResponse)
async def get_envelope(
    envelope_id: str,
    current_user: dict = Depends(verify_jwt_token)
):
    """Get envelope details"""
    try:
        envelope = await signature_manager.get_envelope(envelope_id, current_user["sub"])
        
        if not envelope:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Envelope not found"
            )
        
        return envelope
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get envelope {envelope_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get envelope: {str(e)}"
        )

@app.put("/envelopes/{envelope_id}", response_model=EnvelopeResponse)
async def update_envelope(
    envelope_id: str,
    request: EnvelopeUpdateRequest,
    current_user: dict = Depends(verify_jwt_token)
):
    """Update envelope details"""
    try:
        envelope = await signature_manager.update_envelope(
            envelope_id=envelope_id,
            request=request,
            user_id=current_user["sub"]
        )
        
        if not envelope:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Envelope not found"
            )
        
        return envelope
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update envelope {envelope_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update envelope: {str(e)}"
        )

@app.delete("/envelopes/{envelope_id}")
async def delete_envelope(
    envelope_id: str,
    current_user: dict = Depends(verify_jwt_token)
):
    """Delete an envelope"""
    try:
        success = await signature_manager.delete_envelope(envelope_id, current_user["sub"])
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Envelope not found"
            )
        
        return {"message": "Envelope deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete envelope {envelope_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete envelope: {str(e)}"
        )

@app.post("/envelopes/{envelope_id}/sign")
async def sign_field(
    envelope_id: str,
    request: SignatureFieldRequest,
    current_user: dict = Depends(verify_jwt_token)
):
    """Sign a field in an envelope"""
    try:
        success = await signature_manager.sign_field(
            envelope_id=envelope_id,
            field_id=request.field_id,
            signature_data=request.signature_data,
            user_id=current_user["sub"]
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Envelope or field not found"
            )
        
        return {"message": "Field signed successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to sign field in envelope {envelope_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to sign field: {str(e)}"
        )

# Digital initials endpoints
@app.post("/initials/generate", response_model=DigitalInitialsResponse)
async def generate_digital_initials(
    request: DigitalInitialsRequest,
    current_user: dict = Depends(verify_jwt_token)
):
    """Generate digital initials for a user"""
    try:
        initials = await initials_manager.create_initials(
            user_id=current_user["sub"],
            name=request.name,
            preferred_style=request.preferred_style
        )
        
        return initials
        
    except Exception as e:
        logger.error(f"Failed to generate digital initials: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate digital initials: {str(e)}"
        )

@app.get("/envelopes/{envelope_id}/status")
async def get_envelope_status(
    envelope_id: str,
    current_user: dict = Depends(verify_jwt_token)
):
    """Get envelope status"""
    try:
        status = await signature_manager.get_envelope_status(envelope_id, current_user["sub"])
        
        if not status:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Envelope not found"
            )
        
        return status
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get envelope status {envelope_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get envelope status: {str(e)}"
        )

@app.get("/envelopes")
async def list_user_envelopes(
    status_filter: Optional[EnvelopeStatus] = None,
    limit: int = 50,
    offset: int = 0,
    current_user: dict = Depends(verify_jwt_token)
):
    """List envelopes for the current user"""
    try:
        envelopes = await signature_manager.list_user_envelopes(
            user_id=current_user["sub"],
            status_filter=status_filter,
            limit=limit,
            offset=offset
        )
        
        return {
            "envelopes": envelopes,
            "total": len(envelopes),
            "limit": limit,
            "offset": offset
        }
        
    except Exception as e:
        logger.error(f"Failed to list envelopes: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list envelopes: {str(e)}"
        )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8006,
        reload=True,
        log_level="info"
    )
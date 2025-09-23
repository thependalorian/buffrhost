"""
Preview API Routes for Buffr Host
Provides endpoints for generating preview URLs and managing draft content.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
import uuid
import json

from database import get_db
from models.user import BuffrHostUser
from routes.auth import get_current_user
from schemas.preview import (
    PreviewRequest, PreviewResponse, DraftContent, 
    PreviewType, PreviewStatus
)

router = APIRouter(prefix="/api/preview", tags=["Preview"])

# In-memory storage for preview content (in production, use Redis or database)
preview_storage: Dict[str, Dict[str, Any]] = {}

@router.post("/generate", response_model=PreviewResponse)
async def generate_preview(
    request: PreviewRequest,
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Generate a preview URL for content that will be visible to visitors.
    """
    try:
        # Generate unique preview ID
        preview_id = str(uuid.uuid4())
        
        # Store preview content with expiration (24 hours)
        expires_at = datetime.utcnow() + timedelta(hours=24)
        
        preview_data = {
            "id": preview_id,
            "user_id": current_user.id,
            "property_id": request.property_id,
            "content_type": request.content_type,
            "content_data": request.content_data,
            "preview_type": request.preview_type,
            "status": PreviewStatus.DRAFT,
            "created_at": datetime.utcnow().isoformat(),
            "expires_at": expires_at.isoformat(),
            "metadata": request.metadata or {}
        }
        
        preview_storage[preview_id] = preview_data
        
        # Generate preview URL
        preview_url = f"/preview/{preview_id}"
        
        return PreviewResponse(
            preview_id=preview_id,
            preview_url=preview_url,
            expires_at=expires_at.isoformat(),
            status=PreviewStatus.DRAFT,
            message="Preview generated successfully"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate preview: {str(e)}"
        )

@router.get("/{preview_id}", response_model=Dict[str, Any])
async def get_preview_content(
    preview_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Get preview content by ID (public endpoint for preview URLs).
    """
    try:
        if preview_id not in preview_storage:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Preview not found or expired"
            )
        
        preview_data = preview_storage[preview_id]
        
        # Check if preview has expired
        expires_at = datetime.fromisoformat(preview_data["expires_at"])
        if datetime.utcnow() > expires_at:
            # Remove expired preview
            del preview_storage[preview_id]
            raise HTTPException(
                status_code=status.HTTP_410_GONE,
                detail="Preview has expired"
            )
        
        return {
            "success": True,
            "preview_data": preview_data,
            "message": "Preview content retrieved successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve preview: {str(e)}"
        )

@router.put("/{preview_id}/publish", response_model=Dict[str, Any])
async def publish_preview(
    preview_id: str,
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Publish preview content to make it live.
    """
    try:
        if preview_id not in preview_storage:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Preview not found"
            )
        
        preview_data = preview_storage[preview_id]
        
        # Verify user owns this preview
        if preview_data["user_id"] != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this preview"
            )
        
        # Update preview status
        preview_data["status"] = PreviewStatus.PUBLISHED
        preview_data["published_at"] = datetime.utcnow().isoformat()
        
        # Here you would typically save to the actual content tables
        # For now, we'll just update the preview status
        
        return {
            "success": True,
            "preview_id": preview_id,
            "status": PreviewStatus.PUBLISHED,
            "message": "Content published successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to publish content: {str(e)}"
        )

@router.get("/user/{user_id}/drafts", response_model=List[Dict[str, Any]])
async def get_user_drafts(
    user_id: int,
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all draft previews for a user.
    """
    try:
        # Verify user access
        if current_user.id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        # Get user's draft previews
        user_drafts = [
            preview_data for preview_data in preview_storage.values()
            if preview_data["user_id"] == user_id and 
               preview_data["status"] == PreviewStatus.DRAFT
        ]
        
        # Sort by creation date (newest first)
        user_drafts.sort(key=lambda x: x["created_at"], reverse=True)
        
        return {
            "success": True,
            "drafts": user_drafts,
            "count": len(user_drafts),
            "message": "Drafts retrieved successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve drafts: {str(e)}"
        )

@router.delete("/{preview_id}", response_model=Dict[str, Any])
async def delete_preview(
    preview_id: str,
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a preview.
    """
    try:
        if preview_id not in preview_storage:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Preview not found"
            )
        
        preview_data = preview_storage[preview_id]
        
        # Verify user owns this preview
        if preview_data["user_id"] != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this preview"
            )
        
        # Delete preview
        del preview_storage[preview_id]
        
        return {
            "success": True,
            "message": "Preview deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete preview: {str(e)}"
        )

@router.post("/qr-code", response_model=Dict[str, Any])
async def generate_qr_code(
    preview_id: str,
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Generate QR code for a preview URL.
    """
    try:
        if preview_id not in preview_storage:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Preview not found"
            )
        
        preview_data = preview_storage[preview_id]
        
        # Verify user owns this preview
        if preview_data["user_id"] != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this preview"
            )
        
        # Generate QR code URL (in production, use a QR code service)
        preview_url = f"https://host.buffr.ai/preview/{preview_id}"
        qr_code_url = f"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={preview_url}"
        
        return {
            "success": True,
            "qr_code_url": qr_code_url,
            "preview_url": preview_url,
            "message": "QR code generated successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate QR code: {str(e)}"
        )

@router.get("/analytics/{preview_id}", response_model=Dict[str, Any])
async def get_preview_analytics(
    preview_id: str,
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get analytics for a preview (views, interactions, etc.).
    """
    try:
        if preview_id not in preview_storage:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Preview not found"
            )
        
        preview_data = preview_storage[preview_id]
        
        # Verify user owns this preview
        if preview_data["user_id"] != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this preview"
            )
        
        # Mock analytics data (in production, get from analytics service)
        analytics = {
            "views": 42,
            "unique_views": 38,
            "avg_view_duration": "2m 15s",
            "device_breakdown": {
                "mobile": 65,
                "desktop": 25,
                "tablet": 10
            },
            "last_viewed": datetime.utcnow().isoformat()
        }
        
        return {
            "success": True,
            "preview_id": preview_id,
            "analytics": analytics,
            "message": "Analytics retrieved successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve analytics: {str(e)}"
        )

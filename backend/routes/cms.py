"""
CMS API Routes for Buffr Host Hospitality Ecosystem Management Platform
Provides RESTful endpoints for content management operations.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional

from fastapi import (APIRouter, Depends, File, Form, HTTPException, Query,
                     UploadFile)
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models.cms import ContentStatus, ContentType
from routes.auth import get_current_user
from services.cms_service import CMSService

router = APIRouter(prefix="/api/cms", tags=["CMS"])


# Pydantic Models for API
class ContentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    content_type: ContentType
    property_id: int
    metadata: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None
    categories: Optional[List[str]] = None
    alt_text: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None


class ContentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None
    categories: Optional[List[str]] = None
    alt_text: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    status: Optional[ContentStatus] = None


class CollectionCreate(BaseModel):
    name: str
    description: Optional[str] = None
    property_id: int
    collection_type: str
    display_order: int = 0
    is_featured: bool = False


class TemplateCreate(BaseModel):
    name: str
    content_type: ContentType
    description: Optional[str] = None
    template_schema: Dict[str, Any]
    default_metadata: Optional[Dict[str, Any]] = None
    required_fields: Optional[List[str]] = None


class WorkflowCreate(BaseModel):
    content_id: int
    current_step: str
    assigned_to: Optional[int] = None
    comments: Optional[str] = None


# Content Management Endpoints
@router.post("/content", response_model=Dict[str, Any])
async def create_content(
    content_data: ContentCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Create new CMS content"""
    try:
        cms_service = CMSService(db)

        # Generate slug if not provided
        slug = cms_service.generate_slug(content_data.title)

        content_dict = content_data.dict()
        content_dict["slug"] = slug
        content_dict["status"] = ContentStatus.DRAFT

        content = cms_service.create_content(content_dict)

        return {
            "success": True,
            "message": "Content created successfully",
            "content": {
                "id": content.id,
                "title": content.title,
                "slug": content.slug,
                "content_type": content.content_type.value,
                "status": content.status.value,
                "created_at": content.created_at,
            },
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/content/{content_id}", response_model=Dict[str, Any])
async def get_content(
    content_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Get content by ID"""
    cms_service = CMSService(db)
    content = cms_service.get_content(content_id)

    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    return {
        "success": True,
        "content": {
            "id": content.id,
            "title": content.title,
            "description": content.description,
            "content_type": content.content_type.value,
            "status": content.status.value,
            "metadata": content.metadata,
            "tags": content.tags,
            "categories": content.categories,
            "file_path": content.file_path,
            "alt_text": content.alt_text,
            "slug": content.slug,
            "meta_title": content.meta_title,
            "meta_description": content.meta_description,
            "property_id": content.property_id,
            "created_at": content.created_at,
            "updated_at": content.updated_at,
            "published_at": content.published_at,
        },
    }


@router.get("/content", response_model=Dict[str, Any])
async def list_content(
    property_id: Optional[int] = Query(None),
    content_type: Optional[ContentType] = Query(None),
    status: Optional[ContentStatus] = Query(None),
    limit: int = Query(50, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """List content with filters"""
    cms_service = CMSService(db)
    content_list = cms_service.list_content(
        property_id=property_id,
        content_type=content_type,
        status=status,
        limit=limit,
        offset=offset,
    )

    return {
        "success": True,
        "content": [
            {
                "id": content.id,
                "title": content.title,
                "content_type": content.content_type.value,
                "status": content.status.value,
                "created_at": content.created_at,
                "updated_at": content.updated_at,
            }
            for content in content_list
        ],
        "total": len(content_list),
    }


@router.put("/content/{content_id}", response_model=Dict[str, Any])
async def update_content(
    content_id: int,
    update_data: ContentUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Update existing content"""
    cms_service = CMSService(db)

    # Remove None values
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}

    content = cms_service.update_content(content_id, update_dict)

    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    return {
        "success": True,
        "message": "Content updated successfully",
        "content": {
            "id": content.id,
            "title": content.title,
            "status": content.status.value,
            "updated_at": content.updated_at,
        },
    }


@router.delete("/content/{content_id}", response_model=Dict[str, Any])
async def delete_content(
    content_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Delete content (soft delete)"""
    cms_service = CMSService(db)
    success = cms_service.delete_content(content_id)

    if not success:
        raise HTTPException(status_code=404, detail="Content not found")

    return {"success": True, "message": "Content deleted successfully"}


@router.get("/content/search", response_model=Dict[str, Any])
async def search_content(
    q: str = Query(..., min_length=1),
    property_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Search content"""
    cms_service = CMSService(db)
    results = cms_service.search_content(q, property_id)

    return {
        "success": True,
        "results": [
            {
                "id": content.id,
                "title": content.title,
                "description": content.description,
                "content_type": content.content_type.value,
                "status": content.status.value,
                "created_at": content.created_at,
            }
            for content in results
        ],
        "total": len(results),
    }


# Media Management Endpoints
@router.post("/media/upload", response_model=Dict[str, Any])
async def upload_media(
    file: UploadFile = File(...),
    property_id: int = Form(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Upload media file"""
    try:
        # Validate file type
        allowed_types = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "video/mp4",
            "video/webm",
        ]
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="File type not allowed")

        # Generate unique filename
        file_extension = file.filename.split(".")[-1] if "." in file.filename else ""
        unique_filename = f"{uuid.uuid4()}.{file_extension}"

        # Save file (in production, use cloud storage)
        upload_path = f"uploads/media/{property_id}/{unique_filename}"
        os.makedirs(os.path.dirname(upload_path), exist_ok=True)

        with open(upload_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        # Create media record
        cms_service = CMSService(db)
        media_data = {
            "filename": unique_filename,
            "original_filename": file.filename,
            "file_path": upload_path,
            "file_size": len(content),
            "mime_type": file.content_type,
            "property_id": property_id,
        }

        media = cms_service.upload_media(media_data)

        return {
            "success": True,
            "message": "Media uploaded successfully",
            "media": {
                "id": media.id,
                "filename": media.filename,
                "original_filename": media.original_filename,
                "file_path": media.file_path,
                "file_size": media.file_size,
                "mime_type": media.mime_type,
                "uploaded_at": media.uploaded_at,
            },
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/media", response_model=Dict[str, Any])
async def list_media(
    property_id: Optional[int] = Query(None),
    mime_type: Optional[str] = Query(None),
    limit: int = Query(50, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """List media files"""
    cms_service = CMSService(db)
    media_list = cms_service.list_media(
        property_id=property_id, mime_type=mime_type, limit=limit, offset=offset
    )

    return {
        "success": True,
        "media": [
            {
                "id": media.id,
                "filename": media.filename,
                "original_filename": media.original_filename,
                "file_path": media.file_path,
                "file_size": media.file_size,
                "mime_type": media.mime_type,
                "uploaded_at": media.uploaded_at,
            }
            for media in media_list
        ],
        "total": len(media_list),
    }


# Collections Management Endpoints
@router.post("/collections", response_model=Dict[str, Any])
async def create_collection(
    collection_data: CollectionCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Create new content collection"""
    cms_service = CMSService(db)
    collection = cms_service.create_collection(collection_data.dict())

    return {
        "success": True,
        "message": "Collection created successfully",
        "collection": {
            "id": collection.id,
            "name": collection.name,
            "description": collection.description,
            "collection_type": collection.collection_type,
            "created_at": collection.created_at,
        },
    }


@router.get("/collections/{collection_id}", response_model=Dict[str, Any])
async def get_collection(
    collection_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Get collection with content"""
    cms_service = CMSService(db)
    collection = cms_service.get_collection(collection_id)

    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")

    content = cms_service.get_collection_content(collection_id)

    return {
        "success": True,
        "collection": {
            "id": collection.id,
            "name": collection.name,
            "description": collection.description,
            "collection_type": collection.collection_type,
            "created_at": collection.created_at,
            "content": [
                {
                    "id": item.id,
                    "title": item.title,
                    "content_type": item.content_type.value,
                    "status": item.status.value,
                }
                for item in content
            ],
        },
    }


@router.post("/collections/{collection_id}/content", response_model=Dict[str, Any])
async def add_content_to_collection(
    collection_id: int,
    content_id: int = Form(...),
    display_order: int = Form(0),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Add content to collection"""
    cms_service = CMSService(db)
    success = cms_service.add_content_to_collection(
        collection_id, content_id, display_order
    )

    if not success:
        raise HTTPException(
            status_code=400, detail="Failed to add content to collection"
        )

    return {"success": True, "message": "Content added to collection successfully"}


# Templates Management Endpoints
@router.post("/templates", response_model=Dict[str, Any])
async def create_template(
    template_data: TemplateCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Create new content template"""
    cms_service = CMSService(db)
    template = cms_service.create_template(template_data.dict())

    return {
        "success": True,
        "message": "Template created successfully",
        "template": {
            "id": template.id,
            "name": template.name,
            "content_type": template.content_type.value,
            "description": template.description,
            "created_at": template.created_at,
        },
    }


@router.get("/templates/{content_type}", response_model=Dict[str, Any])
async def get_templates_by_type(
    content_type: ContentType,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Get templates by content type"""
    cms_service = CMSService(db)
    templates = cms_service.get_templates_by_type(content_type)

    return {
        "success": True,
        "templates": [
            {
                "id": template.id,
                "name": template.name,
                "description": template.description,
                "template_schema": template.template_schema,
                "default_metadata": template.default_metadata,
                "required_fields": template.required_fields,
            }
            for template in templates
        ],
    }


# Statistics Endpoint
@router.get("/statistics", response_model=Dict[str, Any])
async def get_content_statistics(
    property_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Get content statistics"""
    cms_service = CMSService(db)
    stats = cms_service.get_content_statistics(property_id)

    return {"success": True, "statistics": stats}

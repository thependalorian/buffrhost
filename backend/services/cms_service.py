"""
CMS (Content Management System) service for Buffr Host platform.
"""
from typing import Any, Dict, List, Optional

from sqlalchemy import and_, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.cms import CMSContent, ContentTemplate, MediaLibrary


class CMSService:
    """Service for content management system."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_content_items(
        self,
        property_id: int,
        content_type: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Dict[str, Any]]:
        """Get content items for a property."""
        query = select(CMSContent).where(CMSContent.property_id == property_id)

        if content_type:
            query = query.where(CMSContent.content_type == content_type)

        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        items = result.scalars().all()

        return [
            {
                "content_id": item.content_id,
                "title": item.title,
                "content_type": item.content_type,
                "content_data": item.content_data,
                "is_published": item.is_published,
                "created_at": item.created_at.isoformat(),
                "updated_at": item.updated_at.isoformat() if item.updated_at else None,
            }
            for item in items
        ]

    async def get_media_library(
        self,
        property_id: int,
        media_type: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Dict[str, Any]]:
        """Get media library items."""
        query = select(MediaLibrary).where(MediaLibrary.property_id == property_id)

        if media_type:
            query = query.where(MediaLibrary.media_type == media_type)

        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        items = result.scalars().all()

        return [
            {
                "media_id": item.media_id,
                "filename": item.filename,
                "file_path": item.file_path,
                "media_type": item.media_type,
                "file_size": item.file_size,
                "mime_type": item.mime_type,
                "alt_text": item.alt_text,
                "created_at": item.created_at.isoformat(),
            }
            for item in items
        ]

    async def get_content_templates(
        self, property_id: int, template_type: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Get content templates."""
        query = select(ContentTemplate).where(
            ContentTemplate.property_id == property_id
        )

        if template_type:
            query = query.where(ContentTemplate.template_type == template_type)

        result = await self.db.execute(query)
        templates = result.scalars().all()

        return [
            {
                "template_id": template.template_id,
                "name": template.name,
                "template_type": template.template_type,
                "template_data": template.template_data,
                "is_active": template.is_active,
                "created_at": template.created_at.isoformat(),
            }
            for template in templates
        ]

    async def create_content_item(
        self,
        property_id: int,
        title: str,
        content_type: str,
        content_data: Dict[str, Any],
        is_published: bool = False,
    ) -> Dict[str, Any]:
        """Create a new content item."""
        content_item = CMSContent(
            property_id=property_id,
            title=title,
            content_type=content_type,
            content_data=content_data,
            is_published=is_published,
        )

        self.db.add(content_item)
        await self.db.commit()
        await self.db.refresh(content_item)

        return {
            "content_id": content_item.content_id,
            "title": content_item.title,
            "content_type": content_item.content_type,
            "is_published": content_item.is_published,
            "created_at": content_item.created_at.isoformat(),
        }

    async def update_content_item(
        self, content_id: int, property_id: int, **updates
    ) -> Dict[str, Any]:
        """Update a content item."""
        query = select(CMSContent).where(
            and_(CMSContent.id == content_id, CMSContent.property_id == property_id)
        )

        result = await self.db.execute(query)
        item = result.scalar_one_or_none()

        if not item:
            raise ValueError("Content item not found")

        for key, value in updates.items():
            if hasattr(item, key):
                setattr(item, key, value)

        await self.db.commit()
        await self.db.refresh(item)

        return {
            "content_id": item.content_id,
            "title": item.title,
            "content_type": item.content_type,
            "is_published": item.is_published,
            "updated_at": item.updated_at.isoformat() if item.updated_at else None,
        }

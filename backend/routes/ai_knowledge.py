"""
AI Knowledge Base Management API Routes

This module provides API endpoints for managing the AI receptionist's knowledge base,
including document uploads, web crawling, and knowledge retrieval.
"""

import logging
import os
import tempfile
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import (APIRouter, BackgroundTasks, Depends, File, Form,
                     HTTPException, UploadFile)
from sqlalchemy.ext.asyncio import AsyncSession

from ai.conversational_ai import (ConversationalAI, KnowledgeBaseQuery,
                                  KnowledgeBaseResult)
from auth.dependencies import get_current_user
from auth.permissions import HospitalityPermissions, require_permission
from database import get_db
from models.ai_knowledge import KnowledgeBase
from models.user import User
from rag.document_processor import DocumentProcessor

logger = logging.getLogger(__name__)

router = APIRouter()

# Global AI instance (would be initialized with proper config in production)
ai_instance: Optional[ConversationalAI] = None


async def get_ai_instance(db: AsyncSession = Depends(get_db)) -> ConversationalAI:
    """Get or create AI instance"""
    global ai_instance
    if ai_instance is None:
        # Initialize with proper configuration
        openai_api_key = os.getenv("OPENAI_API_KEY")
        if not openai_api_key:
            raise HTTPException(status_code=500, detail="OpenAI API key not configured")

        ai_instance = ConversationalAI(db, openai_api_key)

    return ai_instance


@router.post("/properties/{property_id}/knowledge/upload")
async def upload_document(
    property_id: int,
    file: UploadFile = File(...),
    category: str = Form(default="general"),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    ai: ConversationalAI = Depends(get_ai_instance),
):
    """
    Upload a document to the property's knowledge base

    Supported formats: PDF, TXT, DOCX, PPTX, XLSX, JSON
    """
    # Check permissions
    await require_permission(
        current_user, HospitalityPermissions.MANAGE_KNOWLEDGE_BASE, property_id
    )

    # Validate file type
    allowed_extensions = {
        ".pdf",
        ".txt",
        ".docx",
        ".pptx",
        ".xlsx",
        ".xls",
        ".json",
        ".md",
        ".html",
    }
    file_extension = Path(file.filename).suffix.lower()

    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}",
        )

    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(
            delete=False, suffix=file_extension
        ) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        # Process document in background
        background_tasks.add_task(
            process_document_background,
            temp_file_path,
            property_id,
            category,
            current_user.owner_id,
        )

        return {
            "message": "Document uploaded successfully and is being processed",
            "filename": file.filename,
            "category": category,
            "property_id": property_id,
        }

    except Exception as e:
        logger.error(f"Error uploading document: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload document")


@router.post("/properties/{property_id}/knowledge/crawl")
async def crawl_website(
    property_id: int,
    urls: List[str],
    category: str = "web_content",
    background_tasks: BackgroundTasks = BackgroundTasks(),
    current_user: User = Depends(get_current_user),
    ai: ConversationalAI = Depends(get_ai_instance),
):
    """
    Crawl a website and add content to the knowledge base
    """
    # Check permissions
    await require_permission(
        current_user, HospitalityPermissions.MANAGE_KNOWLEDGE_BASE, property_id
    )

    if not urls:
        raise HTTPException(status_code=400, detail="At least one URL is required")

    # Validate URLs
    for url in urls:
        if not url.startswith(("http://", "https://")):
            raise HTTPException(status_code=400, detail=f"Invalid URL: {url}")

    try:
        # Process crawling in background
        background_tasks.add_task(
            crawl_website_background, urls, property_id, category, current_user.owner_id
        )

        return {
            "message": "Website crawling started",
            "urls": urls,
            "category": category,
            "property_id": property_id,
        }

    except Exception as e:
        logger.error(f"Error starting website crawl: {e}")
        raise HTTPException(status_code=500, detail="Failed to start website crawl")


@router.post("/properties/{property_id}/knowledge/crawl-sitemap")
async def crawl_sitemap(
    property_id: int,
    sitemap_url: str,
    category: str = "web_content",
    background_tasks: BackgroundTasks = BackgroundTasks(),
    current_user: User = Depends(get_current_user),
    ai: ConversationalAI = Depends(get_ai_instance),
):
    """
    Crawl a sitemap and add all content to the knowledge base
    """
    # Check permissions
    await require_permission(
        current_user, HospitalityPermissions.MANAGE_KNOWLEDGE_BASE, property_id
    )

    if not sitemap_url.startswith(("http://", "https://")):
        raise HTTPException(status_code=400, detail="Invalid sitemap URL")

    try:
        # Process sitemap crawling in background
        background_tasks.add_task(
            crawl_sitemap_background,
            sitemap_url,
            property_id,
            category,
            current_user.owner_id,
        )

        return {
            "message": "Sitemap crawling started",
            "sitemap_url": sitemap_url,
            "category": category,
            "property_id": property_id,
        }

    except Exception as e:
        logger.error(f"Error starting sitemap crawl: {e}")
        raise HTTPException(status_code=500, detail="Failed to start sitemap crawl")


@router.get("/properties/{property_id}/knowledge/search")
async def search_knowledge(
    property_id: int,
    query: str,
    top_k: int = 5,
    current_user: User = Depends(get_current_user),
    ai: ConversationalAI = Depends(get_ai_instance),
):
    """
    Search the property's knowledge base
    """
    # Check permissions
    await require_permission(
        current_user, HospitalityPermissions.VIEW_KNOWLEDGE_BASE, property_id
    )

    if not query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    try:
        results = await ai.search_property_knowledge(query, property_id, top_k)

        return {
            "query": query,
            "property_id": property_id,
            "results": [
                {
                    "content": result.content,
                    "source": result.source,
                    "relevance_score": result.relevance_score,
                    "metadata": result.metadata,
                }
                for result in results
            ],
            "total_results": len(results),
        }

    except Exception as e:
        logger.error(f"Error searching knowledge base: {e}")
        raise HTTPException(status_code=500, detail="Failed to search knowledge base")


@router.get("/properties/{property_id}/knowledge/stats")
async def get_knowledge_stats(
    property_id: int,
    current_user: User = Depends(get_current_user),
    ai: ConversationalAI = Depends(get_ai_instance),
):
    """
    Get statistics about the property's knowledge base
    """
    # Check permissions
    await require_permission(
        current_user, HospitalityPermissions.VIEW_KNOWLEDGE_BASE, property_id
    )

    try:
        stats = await ai.get_knowledge_base_stats(property_id)
        return {"property_id": property_id, "stats": stats}

    except Exception as e:
        logger.error(f"Error getting knowledge base stats: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to get knowledge base stats"
        )


@router.post("/properties/{property_id}/knowledge/reload")
async def reload_knowledge_base(
    property_id: int,
    current_user: User = Depends(get_current_user),
    ai: ConversationalAI = Depends(get_ai_instance),
):
    """
    Reload the property's knowledge base from the database
    """
    # Check permissions
    await require_permission(
        current_user, HospitalityPermissions.MANAGE_KNOWLEDGE_BASE, property_id
    )

    try:
        success = await ai.reload_property_knowledge(property_id)

        if success:
            return {
                "message": "Knowledge base reloaded successfully",
                "property_id": property_id,
            }
        else:
            raise HTTPException(
                status_code=500, detail="Failed to reload knowledge base"
            )

    except Exception as e:
        logger.error(f"Error reloading knowledge base: {e}")
        raise HTTPException(status_code=500, detail="Failed to reload knowledge base")


@router.get("/properties/{property_id}/knowledge/documents")
async def list_knowledge_documents(
    property_id: int,
    category: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    List knowledge base documents for a property
    """
    # Check permissions
    await require_permission(
        current_user, HospitalityPermissions.VIEW_KNOWLEDGE_BASE, property_id
    )

    try:
        from sqlalchemy import and_, select

        query = select(KnowledgeBase).where(
            and_(
                KnowledgeBase.property_id == property_id,
                KnowledgeBase.is_active == True,
            )
        )

        if category:
            query = query.where(KnowledgeBase.category == category)

        query = (
            query.order_by(KnowledgeBase.updated_at.desc()).offset(offset).limit(limit)
        )

        result = await db.execute(query)
        documents = result.scalars().all()

        return {
            "property_id": property_id,
            "documents": [
                {
                    "id": str(doc.knowledge_id),
                    "title": doc.title,
                    "category": doc.category,
                    "subcategory": doc.subcategory,
                    "tags": doc.tags,
                    "priority": doc.priority,
                    "created_at": doc.created_at,
                    "updated_at": doc.updated_at,
                    "last_updated_by": doc.last_updated_by,
                }
                for doc in documents
            ],
            "total_count": len(documents),
            "offset": offset,
            "limit": limit,
        }

    except Exception as e:
        logger.error(f"Error listing knowledge documents: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to list knowledge documents"
        )


@router.delete("/properties/{property_id}/knowledge/documents/{document_id}")
async def delete_knowledge_document(
    property_id: int,
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Delete a knowledge base document
    """
    # Check permissions
    await require_permission(
        current_user, HospitalityPermissions.MANAGE_KNOWLEDGE_BASE, property_id
    )

    try:
        from sqlalchemy import and_, select
        from sqlalchemy.dialects.postgresql import UUID

        query = select(KnowledgeBase).where(
            and_(
                KnowledgeBase.knowledge_id == UUID(document_id),
                KnowledgeBase.property_id == property_id,
            )
        )

        result = await db.execute(query)
        document = result.scalar_one_or_none()

        if not document:
            raise HTTPException(status_code=404, detail="Document not found")

        # Soft delete by setting is_active to False
        document.is_active = False
        document.last_updated_by = current_user.owner_id

        await db.commit()

        return {
            "message": "Document deleted successfully",
            "document_id": document_id,
            "property_id": property_id,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting knowledge document: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to delete knowledge document"
        )


@router.post("/properties/{property_id}/knowledge/process-enhanced")
async def process_document_enhanced(
    property_id: int,
    file: UploadFile = File(...),
    category: str = Form(default="general"),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    current_user: User = Depends(get_current_user),
    ai: ConversationalAI = Depends(get_ai_instance),
):
    """
    Process document with enhanced LlamaIndex/LlamaParse capabilities

    This endpoint uses LlamaParse for superior document processing that preserves
    tables, structure, and context for optimal LLM ingestion.
    """
    # Check permissions
    await require_permission(
        current_user, HospitalityPermissions.MANAGE_KNOWLEDGE_BASE, property_id
    )

    # Validate file type
    allowed_extensions = {
        ".pdf",
        ".txt",
        ".docx",
        ".pptx",
        ".xlsx",
        ".xls",
        ".json",
        ".md",
        ".html",
    }
    file_extension = Path(file.filename).suffix.lower()

    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}",
        )

    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(
            delete=False, suffix=file_extension
        ) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        # Process document with enhanced capabilities in background
        background_tasks.add_task(
            process_document_enhanced_background,
            temp_file_path,
            property_id,
            category,
            current_user.owner_id,
            file.filename,
        )

        return {
            "message": "Document uploaded and is being processed with enhanced LlamaIndex capabilities",
            "filename": file.filename,
            "category": category,
            "property_id": property_id,
            "processing_method": "llama_parse_enhanced",
        }

    except Exception as e:
        logger.error(f"Error uploading document for enhanced processing: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to upload document for enhanced processing"
        )


@router.get("/properties/{property_id}/knowledge/processing-status")
async def get_processing_status(
    property_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get the processing status of documents for a property
    """
    # Check permissions
    await require_permission(
        current_user, HospitalityPermissions.VIEW_KNOWLEDGE_BASE, property_id
    )

    try:
        from sqlalchemy import and_, select

        # Get recent knowledge base entries
        query = (
            select(KnowledgeBase)
            .where(
                and_(
                    KnowledgeBase.property_id == property_id,
                    KnowledgeBase.is_active == True,
                )
            )
            .order_by(KnowledgeBase.updated_at.desc())
            .limit(10)
        )

        result = await db.execute(query)
        documents = result.scalars().all()

        return {
            "property_id": property_id,
            "recent_documents": [
                {
                    "id": str(doc.knowledge_id),
                    "title": doc.title,
                    "category": doc.category,
                    "created_at": doc.created_at,
                    "updated_at": doc.updated_at,
                    "last_updated_by": doc.last_updated_by,
                }
                for doc in documents
            ],
            "total_documents": len(documents),
        }

    except Exception as e:
        logger.error(f"Error getting processing status: {e}")
        raise HTTPException(status_code=500, detail="Failed to get processing status")


# Background task functions
async def process_document_background(
    file_path: str, property_id: int, category: str, user_id: str
):
    """Background task to process uploaded document"""
    try:
        # Get AI instance
        from database import get_async_db

        async for db in get_async_db():
            openai_api_key = os.getenv("OPENAI_API_KEY")
            ai = ConversationalAI(db, openai_api_key)

            # Process document
            success = await ai.upload_property_knowledge(
                property_id, file_path, category
            )

            if success:
                logger.info(
                    f"Successfully processed document {file_path} for property {property_id}"
                )
            else:
                logger.error(
                    f"Failed to process document {file_path} for property {property_id}"
                )

            break

    except Exception as e:
        logger.error(f"Error in background document processing: {e}")
    finally:
        # Clean up temporary file
        try:
            os.unlink(file_path)
        except:
            pass


async def crawl_website_background(
    urls: List[str], property_id: int, category: str, user_id: str
):
    """Background task to crawl website"""
    try:
        # Get AI instance
        from database import get_async_db

        async for db in get_async_db():
            openai_api_key = os.getenv("OPENAI_API_KEY")
            ai = ConversationalAI(db, openai_api_key)

            # Crawl website
            success = await ai.crawl_property_website(urls, property_id, category)

            if success:
                logger.info(f"Successfully crawled website for property {property_id}")
            else:
                logger.error(f"Failed to crawl website for property {property_id}")

            break

    except Exception as e:
        logger.error(f"Error in background website crawling: {e}")


async def crawl_sitemap_background(
    sitemap_url: str, property_id: int, category: str, user_id: str
):
    """Background task to crawl sitemap"""
    try:
        # Get AI instance
        from database import get_async_db

        async for db in get_async_db():
            openai_api_key = os.getenv("OPENAI_API_KEY")
            ai = ConversationalAI(db, openai_api_key)

            # Crawl sitemap
            success = await ai.crawl_property_sitemap(
                sitemap_url, property_id, category
            )

            if success:
                logger.info(f"Successfully crawled sitemap for property {property_id}")
            else:
                logger.error(f"Failed to crawl sitemap for property {property_id}")

            break

    except Exception as e:
        logger.error(f"Error in background sitemap crawling: {e}")


async def process_document_enhanced_background(
    file_path: str, property_id: int, category: str, user_id: str, filename: str
):
    """Background task to process document with enhanced LlamaIndex capabilities"""
    try:
        # Get AI instance
        from database import get_async_db
        from rag.document_processor import DocumentProcessor
        from rag.knowledge_base import DocumentType

        async for db in get_async_db():
            openai_api_key = os.getenv("OPENAI_API_KEY")
            ai = ConversationalAI(db, openai_api_key)

            # Initialize enhanced document processor
            processor = DocumentProcessor()

            # Map category to document type
            doc_type_mapping = {
                "policies": DocumentType.POLICIES,
                "procedures": DocumentType.PROCEDURES,
                "faq": DocumentType.FAQ,
                "menu": DocumentType.MENU_INFO,
                "rooms": DocumentType.ROOM_INFO,
                "services": DocumentType.SERVICES,
                "amenities": DocumentType.AMENITIES,
                "contact": DocumentType.CONTACT_INFO,
                "emergency": DocumentType.EMERGENCY_PROCEDURES,
                "training": DocumentType.STAFF_TRAINING,
                "customer_service": DocumentType.CUSTOMER_SERVICE,
                "booking": DocumentType.BOOKING_PROCEDURES,
                "payment": DocumentType.PAYMENT_POLICIES,
                "cancellation": DocumentType.CANCELLATION_POLICIES,
                "loyalty": DocumentType.LOYALTY_PROGRAM,
                "general": DocumentType.OTHER,
            }

            document_type = doc_type_mapping.get(category.lower(), DocumentType.OTHER)

            # Process document with enhanced capabilities
            result = await processor.process_document_with_llama_index(
                file_path=file_path,
                document_type=document_type,
                metadata={
                    "original_filename": filename,
                    "processed_by": "llama_parse_enhanced",
                    "property_id": property_id,
                    "category": category,
                },
            )

            # Store each chunk in the knowledge base
            for i, chunk in enumerate(result["chunks"]):
                # Create a new knowledge base entry for each chunk
                kb_entry = KnowledgeBase(
                    property_id=property_id,
                    category=category,
                    title=f"{filename} - Chunk {i+1}",
                    content=chunk["text"],
                    tags=f'["{category}", "chunked", "llama_parse", "chunk_{i+1}"]',
                    priority=1,
                    is_active=True,
                    last_updated_by=user_id,
                )

                db.add(kb_entry)

            await db.commit()

            # Reload knowledge base
            await ai.reload_property_knowledge(property_id)

            logger.info(
                f"Successfully processed {filename} with enhanced LlamaIndex into {result['total_chunks']} chunks"
            )

            break

    except Exception as e:
        logger.error(f"Error in enhanced document processing: {e}")
    finally:
        # Clean up temporary file
        try:
            os.unlink(file_path)
        except:
            pass

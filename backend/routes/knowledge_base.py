"""
Knowledge Base API Routes for The Shandi Hospitality Platform

This module provides API endpoints for managing the knowledge base,
including document upload, search, and AI agent interactions.
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, Field

from database import get_db
from rag.knowledge_base import KnowledgeBaseManager, DocumentType, DocumentStatus
from rag.rag_agent import RAGAgent, QueryType
from rag.document_processor import DocumentProcessor

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/knowledge", tags=["knowledge-base"])


# Pydantic models for API requests/responses
class DocumentCreateRequest(BaseModel):
    title: str = Field(..., description="Document title")
    content: str = Field(..., description="Document content")
    document_type: DocumentType = Field(..., description="Type of document")
    tags: Optional[List[str]] = Field(default_factory=list, description="Document tags")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional metadata")


class DocumentUpdateRequest(BaseModel):
    title: Optional[str] = Field(None, description="New document title")
    content: Optional[str] = Field(None, description="New document content")
    document_type: Optional[DocumentType] = Field(None, description="New document type")
    tags: Optional[List[str]] = Field(None, description="New document tags")
    metadata: Optional[Dict[str, Any]] = Field(None, description="New metadata")


class QueryRequest(BaseModel):
    question: str = Field(..., description="Question to ask")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional context")


class QueryResponse(BaseModel):
    answer: str = Field(..., description="Generated answer")
    confidence: float = Field(..., description="Confidence score")
    sources: List[Dict[str, Any]] = Field(default_factory=list, description="Source documents")
    query_type: QueryType = Field(..., description="Type of query")
    follow_up_questions: List[str] = Field(default_factory=list, description="Follow-up questions")
    requires_human: bool = Field(..., description="Whether human assistance is needed")


class SearchRequest(BaseModel):
    query: str = Field(..., description="Search query")
    document_types: Optional[List[DocumentType]] = Field(None, description="Filter by document types")
    tags: Optional[List[str]] = Field(None, description="Filter by tags")
    limit: int = Field(default=10, description="Maximum number of results")


# Dependency to get knowledge base manager
async def get_knowledge_base(db: AsyncSession = Depends(get_db)) -> KnowledgeBaseManager:
    return KnowledgeBaseManager(db)


# Dependency to get RAG agent
async def get_rag_agent(kb: KnowledgeBaseManager = Depends(get_knowledge_base)) -> RAGAgent:
    return RAGAgent(kb)


@router.post("/properties/{property_id}/documents")
async def create_document(
    property_id: int,
    request: DocumentCreateRequest,
    created_by: str = Form(...),
    kb: KnowledgeBaseManager = Depends(get_knowledge_base)
):
    """Create a new document in the knowledge base."""
    try:
        document = await kb.add_document(
            property_id=property_id,
            title=request.title,
            content=request.content,
            document_type=request.document_type,
            created_by=created_by,
            metadata=request.metadata,
            tags=request.tags
        )
        
        return JSONResponse(
            status_code=201,
            content={
                "message": "Document created successfully",
                "document_id": document.document_id,
                "status": document.status.value
            }
        )
        
    except Exception as e:
        logger.error(f"Error creating document: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/properties/{property_id}/documents/upload")
async def upload_document(
    property_id: int,
    file: UploadFile = File(...),
    title: str = Form(...),
    document_type: DocumentType = Form(...),
    tags: str = Form(default=""),
    created_by: str = Form(...),
    kb: KnowledgeBaseManager = Depends(get_knowledge_base)
):
    """Upload and process a document file."""
    try:
        # Read file content
        content = await file.read()
        
        # Process the file based on its type
        processor = DocumentProcessor()
        processed_content = await processor.process_file(
            file_path=file.filename,
            document_type=document_type,
            metadata={"original_filename": file.filename}
        )
        
        # Parse tags
        tag_list = [tag.strip() for tag in tags.split(",") if tag.strip()]
        
        # Create document
        document = await kb.add_document(
            property_id=property_id,
            title=title,
            content=processed_content,
            document_type=document_type,
            created_by=created_by,
            tags=tag_list,
            file_path=file.filename,
            file_type=file.content_type,
            file_size=len(content)
        )
        
        return JSONResponse(
            status_code=201,
            content={
                "message": "Document uploaded and processed successfully",
                "document_id": document.document_id,
                "status": document.status.value
            }
        )
        
    except Exception as e:
        logger.error(f"Error uploading document: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/documents/{document_id}")
async def update_document(
    document_id: str,
    request: DocumentUpdateRequest,
    updated_by: str = Form(...),
    kb: KnowledgeBaseManager = Depends(get_knowledge_base)
):
    """Update an existing document."""
    try:
        document = await kb.update_document(
            document_id=document_id,
            title=request.title,
            content=request.content,
            document_type=request.document_type,
            metadata=request.metadata,
            tags=request.tags,
            updated_by=updated_by
        )
        
        return JSONResponse(
            status_code=200,
            content={
                "message": "Document updated successfully",
                "document_id": document.document_id,
                "status": document.status.value
            }
        )
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating document: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/documents/{document_id}")
async def delete_document(
    document_id: str,
    kb: KnowledgeBaseManager = Depends(get_knowledge_base)
):
    """Delete a document from the knowledge base."""
    try:
        success = await kb.delete_document(document_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Document not found")
        
        return JSONResponse(
            status_code=200,
            content={"message": "Document deleted successfully"}
        )
        
    except Exception as e:
        logger.error(f"Error deleting document: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/documents/{document_id}")
async def get_document(
    document_id: str,
    kb: KnowledgeBaseManager = Depends(get_knowledge_base)
):
    """Get a document by ID."""
    try:
        document = await kb.get_document(document_id)
        
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        return JSONResponse(
            status_code=200,
            content=document.dict()
        )
        
    except Exception as e:
        logger.error(f"Error getting document: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/properties/{property_id}/search")
async def search_documents(
    property_id: int,
    request: SearchRequest,
    kb: KnowledgeBaseManager = Depends(get_knowledge_base)
):
    """Search documents in the knowledge base."""
    try:
        documents = await kb.search_documents(
            property_id=property_id,
            query=request.query,
            document_types=request.document_types,
            tags=request.tags,
            limit=request.limit
        )
        
        return JSONResponse(
            status_code=200,
            content={
                "query": request.query,
                "results": [doc.dict() for doc in documents],
                "total": len(documents)
            }
        )
        
    except Exception as e:
        logger.error(f"Error searching documents: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/properties/{property_id}/query")
async def query_knowledge_base(
    property_id: int,
    request: QueryRequest,
    rag_agent: RAGAgent = Depends(get_rag_agent)
):
    """Query the knowledge base using the RAG agent."""
    try:
        response = await rag_agent.query(
            property_id=property_id,
            question=request.question,
            user_context=request.context
        )
        
        return JSONResponse(
            status_code=200,
            content=response.dict()
        )
        
    except Exception as e:
        logger.error(f"Error querying knowledge base: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/properties/{property_id}/suggested-questions")
async def get_suggested_questions(
    property_id: int,
    rag_agent: RAGAgent = Depends(get_rag_agent)
):
    """Get suggested questions based on available knowledge."""
    try:
        questions = await rag_agent.get_suggested_questions(property_id)
        
        return JSONResponse(
            status_code=200,
            content={
                "property_id": property_id,
                "suggested_questions": questions
            }
        )
        
    except Exception as e:
        logger.error(f"Error getting suggested questions: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/properties/{property_id}/summary")
async def get_knowledge_summary(
    property_id: int,
    kb: KnowledgeBaseManager = Depends(get_knowledge_base)
):
    """Get a summary of the knowledge base for a property."""
    try:
        summary = await kb.get_property_knowledge_summary(property_id)
        
        return JSONResponse(
            status_code=200,
            content=summary
        )
        
    except Exception as e:
        logger.error(f"Error getting knowledge summary: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/properties/{property_id}/analyze-gaps")
async def analyze_knowledge_gaps(
    property_id: int,
    common_questions: List[str],
    rag_agent: RAGAgent = Depends(get_rag_agent)
):
    """Analyze knowledge gaps based on common questions."""
    try:
        gaps = await rag_agent.get_knowledge_gaps(property_id, common_questions)
        
        return JSONResponse(
            status_code=200,
            content={
                "property_id": property_id,
                "knowledge_gaps": gaps,
                "total_gaps": len(gaps)
            }
        )
        
    except Exception as e:
        logger.error(f"Error analyzing knowledge gaps: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/document-types")
async def get_document_types():
    """Get available document types."""
    return JSONResponse(
        status_code=200,
        content={
            "document_types": [
                {
                    "value": doc_type.value,
                    "label": doc_type.value.replace("_", " ").title(),
                    "description": f"Documents related to {doc_type.value.replace('_', ' ')}"
                }
                for doc_type in DocumentType
            ]
        }
    )


@router.get("/query-types")
async def get_query_types():
    """Get available query types."""
    return JSONResponse(
        status_code=200,
        content={
            "query_types": [
                {
                    "value": query_type.value,
                    "label": query_type.value.replace("_", " ").title(),
                    "description": f"Queries related to {query_type.value.replace('_', ' ')}"
                }
                for query_type in QueryType
            ]
        }
    )

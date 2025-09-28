"""
Knowledge Base Manager for Buffr Host Hospitality Platform

This module manages the knowledge base for hospitality properties, allowing them
to add company information, policies, procedures, and other knowledge that AI
agents can use to provide accurate and contextual responses to customers.
"""

import asyncio
import logging
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field
from sqlalchemy import and_, delete, func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from models.knowledge import KnowledgeDocument as KnowledgeDocumentModel

from .document_processor import DocumentProcessor
from .types import DocumentStatus, DocumentType
from .vector_store import VectorStoreManager

logger = logging.getLogger(__name__)


class KnowledgeDocument(BaseModel):
    """Model for knowledge base documents."""

    document_id: str
    property_id: int
    title: str
    content: str
    document_type: DocumentType
    status: DocumentStatus
    metadata: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    created_by: str
    tags: List[str]
    file_path: Optional[str]
    file_type: Optional[str]
    file_size: Optional[int]

    class Config:
        orm_mode = True


class KnowledgeBaseManager:
    """
    Manages the knowledge base for hospitality properties.
    """

    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session
        self.document_processor = DocumentProcessor()
        self.vector_store = VectorStoreManager(db_session)

    async def add_document(
        self,
        property_id: int,
        title: str,
        content: str,
        document_type: DocumentType,
        created_by: str,
        metadata: Optional[Dict[str, Any]] = None,
        tags: Optional[List[str]] = None,
        file_path: Optional[str] = None,
        file_type: Optional[str] = None,
        file_size: Optional[int] = None,
    ) -> KnowledgeDocument:
        """
        Add a new document to the knowledge base.
        """
        document_id = str(uuid.uuid4())
        document = KnowledgeDocumentModel(
            document_id=document_id,
            property_id=property_id,
            title=title,
            content=content,
            document_type=document_type.value,
            created_by=created_by,
            metadata=metadata or {},
            tags=tags or [],
            file_path=file_path,
            file_type=file_type,
            file_size=file_size,
            status=DocumentStatus.UPLOADED.value,
        )

        await self._store_document_in_db(document)
        await self._process_and_index_document(KnowledgeDocument.from_orm(document))

        logger.info(
            f"Document {document_id} added to knowledge base for property {property_id}"
        )
        return KnowledgeDocument.from_orm(document)

    async def get_document(self, document_id: str) -> Optional[KnowledgeDocument]:
        """
        Get a document by ID.
        """
        result = await self.db_session.execute(
            select(KnowledgeDocumentModel).where(
                KnowledgeDocumentModel.document_id == document_id
            )
        )
        document = result.scalar_one_or_none()
        return KnowledgeDocument.from_orm(document) if document else None

    async def get_property_knowledge_summary(self, property_id: int) -> Dict[str, Any]:
        """
        Get a summary of the knowledge base for a property.
        """
        async with self.db_session.begin():
            total_docs_result = await self.db_session.execute(
                select(func.count(KnowledgeDocumentModel.document_id)).where(
                    KnowledgeDocumentModel.property_id == property_id
                )
            )
            total_documents = total_docs_result.scalar_one_or_none() or 0

            doc_types_result = await self.db_session.execute(
                select(
                    KnowledgeDocumentModel.document_type,
                    func.count(KnowledgeDocumentModel.document_id),
                )
                .where(KnowledgeDocumentModel.property_id == property_id)
                .group_by(KnowledgeDocumentModel.document_type)
            )
            document_types = {row[0]: row[1] for row in doc_types_result.all()}

        return {
            "property_id": property_id,
            "total_documents": total_documents,
            "document_types": document_types,
            "last_updated": datetime.utcnow().isoformat(),
            "status": "active",
        }

    async def _store_document_in_db(self, document: KnowledgeDocumentModel) -> None:
        """Store document in database."""
        self.db_session.add(document)
        await self.db_session.commit()
        await self.db_session.refresh(document)

    async def _update_document_in_db(self, document: KnowledgeDocument) -> None:
        """Update document in database."""
        await self.db_session.execute(
            update(KnowledgeDocumentModel)
            .where(KnowledgeDocumentModel.document_id == document.document_id)
            .values(**document.dict())
        )
        await self.db_session.commit()

    async def _delete_document_from_db(self, document_id: str) -> None:
        """Delete document from database."""
        await self.db_session.execute(
            delete(KnowledgeDocumentModel).where(
                KnowledgeDocumentModel.document_id == document_id
            )
        )
        await self.db_session.commit()

    async def _process_and_index_document(self, document: KnowledgeDocument) -> None:
        """Process and index a document."""
        try:
            document.status = DocumentStatus.PROCESSING
            await self._update_document_in_db(document)

            processed_content = await self.document_processor.process_document(
                content=document.content,
                document_type=document.document_type,
                metadata=document.metadata,
            )

            await self.vector_store.add_document(
                property_id=document.property_id,
                document_id=document.document_id,
                content=processed_content,
                metadata={
                    "title": document.title,
                    "document_type": document.document_type.value,
                    "tags": document.tags,
                    "created_at": document.created_at.isoformat(),
                    "updated_at": document.updated_at.isoformat(),
                },
            )

            document.status = DocumentStatus.INDEXED
            await self._update_document_in_db(document)

            logger.info(
                f"Document {document.document_id} processed and indexed successfully"
            )

        except Exception as e:
            logger.error(f"Error processing document {document.document_id}: {e}")
            document.status = DocumentStatus.ERROR
            await self._update_document_in_db(document)
            raise

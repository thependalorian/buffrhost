"""
Vector Store Manager for Buffr Host Hospitality Platform

This module manages vector embeddings and similarity search for the knowledge base.
It uses pgvector for storing embeddings and provides semantic search capabilities
for AI agents.
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
try:
    from llama_index.embeddings.openai import OpenAIEmbedding
except ImportError:
    from llama_index.core.embeddings import OpenAIEmbedding
from llama_index.vector_stores.postgres import PGVectorStore
from llama_index.core import VectorStoreIndex
from llama_index.core.schema import TextNode

from .types import DocumentType

logger = logging.getLogger(__name__)


class VectorStoreManager:
    """
    Manages vector embeddings and similarity search for the knowledge base.
    
    Uses pgvector for storing embeddings and provides semantic search capabilities.
    """
    
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session
        self.embedding_model = OpenAIEmbedding()
        self.vector_store = None
        self.index = None
        
    async def initialize(self, connection_string: str) -> None:
        """
        Initialize the vector store with database connection.
        
        Args:
            connection_string: PostgreSQL connection string
        """
        try:
            self.vector_store = PGVectorStore.from_params(
                database="shandi_db",
                host="localhost",
                password="password",
                port=5432,
                user="postgres",
                table_name="knowledge_embeddings",
                embed_dim=1536
            )
            self.index = VectorStoreIndex.from_vector_store(self.vector_store)
            logger.info("Vector store initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing vector store: {e}")
            raise
    
    async def add_document(
        self,
        property_id: int,
        document_id: str,
        content: str,
        metadata: Dict[str, Any]
    ) -> None:
        """
        Add a document to the vector store.
        """
        try:
            node = TextNode(
                text=content,
                metadata={
                    "property_id": property_id,
                    "document_id": document_id,
                    **metadata
                }
            )
            self.vector_store.add([node])
            logger.info(f"Document {document_id} added to vector store")
        except Exception as e:
            logger.error(f"Error adding document to vector store: {e}")
            raise
    
    async def delete_document(self, property_id: int, document_id: str) -> None:
        """
        Delete a document from the vector store.
        """
        try:
            await self.vector_store.adelete(ref_doc_id=document_id)
            logger.info(f"Document {document_id} deleted from vector store")
        except Exception as e:
            logger.error(f"Error deleting document from vector store: {e}")
            raise
    
    async def search(
        self,
        property_id: int,
        query: str,
        document_types: Optional[List[DocumentType]] = None,
        tags: Optional[List[str]] = None,
        limit: int = 10,
        similarity_threshold: float = 0.7
    ) -> List[Dict[str, Any]]:
        """
        Search for similar documents in the vector store.
        """
        try:
            retriever = self.index.as_retriever(
                similarity_top_k=limit,
                filters={"property_id": property_id}
            )
            results = await retriever.aretrieve(query)
            
            filtered_results = []
            for result in results:
                if result.score >= similarity_threshold:
                    if document_types and result.metadata.get("document_type") not in [dt.value for dt in document_types]:
                        continue
                    if tags and not any(tag in result.metadata.get("tags", []) for tag in tags):
                        continue
                    filtered_results.append({
                        "document_id": result.metadata.get("document_id"),
                        "content": result.text,
                        "score": result.score,
                        "metadata": result.metadata
                    })
            
            logger.info(f"Found {len(filtered_results)} matching documents for query: {query}")
            return filtered_results
        except Exception as e:
            logger.error(f"Error searching vector store: {e}")
            raise
    
    async def get_similar_documents(
        self,
        property_id: int,
        document_id: str,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Find documents similar to a given document.
        """
        try:
            kb_manager = KnowledgeBaseManager(self.db_session)
            document = await kb_manager.get_document(property_id, document_id)
            if not document:
                return []
            return await self.search(property_id, document.content, limit=limit)
        except Exception as e:
            logger.error(f"Error finding similar documents: {e}")
            raise
    
    async def get_property_embeddings_stats(self, property_id: int) -> Dict[str, Any]:
        """
        Get statistics about embeddings for a property.
        """
        try:
            async with self.db_session.begin():
                result = await self.db_session.execute(
                    text("SELECT COUNT(*) FROM knowledge_embeddings WHERE (metadata_->>'property_id')::int = :property_id"),
                    {"property_id": property_id}
                )
                total_embeddings = result.scalar_one_or_none() or 0
            return {
                "property_id": property_id,
                "total_embeddings": total_embeddings,
                "embedding_dimension": 1536
            }
        except Exception as e:
            logger.error(f"Error getting embedding stats: {e}")
            raise

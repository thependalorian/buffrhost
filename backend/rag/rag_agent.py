"""
RAG Agent for Buffr Host Hospitality Platform

This module provides the RAG (Retrieval Augmented Generation) agent that combines
document retrieval with AI generation for intelligent responses about hospitality
knowledge and procedures.
"""

from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from enum import Enum
import logging

from .knowledge_base import KnowledgeBaseManager
from .vector_store import VectorStoreManager
from .types import Document, SearchResult


class QueryType(str, Enum):
    """Types of queries for the RAG agent."""
    
    GENERAL = "general"
    POLICY = "policy"
    PROCEDURE = "procedure"
    FAQ = "faq"
    CONTACT = "contact"
    EMERGENCY = "emergency"

logger = logging.getLogger(__name__)

@dataclass
class RAGResponse:
    """Response from RAG agent"""
    answer: str
    sources: List[Document]
    confidence: float
    context: str

class RAGAgent:
    """
    RAG Agent for hospitality knowledge retrieval and generation
    
    This agent combines vector search with AI generation to provide
    intelligent responses about hospitality procedures, policies, and
    knowledge base content.
    """
    
    def __init__(
        self,
        knowledge_base_manager: KnowledgeBaseManager,
        vector_store_manager: VectorStoreManager
    ):
        self.kb_manager = knowledge_base_manager
        self.vector_store = vector_store_manager
        self.logger = logging.getLogger(__name__)
    
    async def query(
        self,
        question: str,
        property_id: str,
        max_results: int = 5,
        min_confidence: float = 0.7
    ) -> RAGResponse:
        """
        Query the knowledge base and generate a response
        
        Args:
            question: The question to answer
            property_id: Property ID for knowledge isolation
            max_results: Maximum number of documents to retrieve
            min_confidence: Minimum confidence threshold for results
            
        Returns:
            RAGResponse with answer, sources, and metadata
        """
        try:
            # Search for relevant documents
            search_results = await self.vector_store.search(
                query=question,
                property_id=property_id,
                limit=max_results,
                min_score=min_confidence
            )
            
            if not search_results:
                return RAGResponse(
                    answer="I don't have specific information about that topic in our knowledge base.",
                    sources=[],
                    confidence=0.0,
                    context="No relevant documents found"
                )
            
            # Extract documents and context
            documents = [result.document for result in search_results]
            context = self._build_context(documents)
            
            # Generate answer (placeholder - would integrate with LLM)
            answer = await self._generate_answer(question, context, documents)
            
            # Calculate overall confidence
            confidence = sum(result.score for result in search_results) / len(search_results)
            
            return RAGResponse(
                answer=answer,
                sources=documents,
                confidence=confidence,
                context=context
            )
            
        except Exception as e:
            self.logger.error(f"Error in RAG query: {e}")
            return RAGResponse(
                answer="I encountered an error while processing your question. Please try again.",
                sources=[],
                confidence=0.0,
                context="Error occurred during processing"
            )
    
    def _build_context(self, documents: List[Document]) -> str:
        """Build context string from retrieved documents"""
        context_parts = []
        for i, doc in enumerate(documents, 1):
            context_parts.append(f"Source {i}: {doc.title}\n{doc.content[:500]}...")
        
        return "\n\n".join(context_parts)
    
    async def _generate_answer(
        self,
        question: str,
        context: str,
        sources: List[Document]
    ) -> str:
        """
        Generate answer using retrieved context
        
        This is a placeholder implementation. In production, this would
        integrate with an LLM like OpenAI GPT, Anthropic Claude, or similar.
        """
        # Placeholder implementation
        if not sources:
            return "I don't have specific information about that topic in our knowledge base."
        
        # Simple template-based response
        source_titles = [doc.title for doc in sources]
        return f"Based on our knowledge base, here's what I found: {', '.join(source_titles)}. For more detailed information, please refer to the specific documents or contact our team."
    
    async def add_document(
        self,
        document: Document,
        property_id: str
    ) -> bool:
        """
        Add a document to the knowledge base
        
        Args:
            document: Document to add
            property_id: Property ID for isolation
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Add to knowledge base
            success = await self.kb_manager.add_document(document, property_id)
            
            if success:
                # Add to vector store
                await self.vector_store.add_document(document, property_id)
                self.logger.info(f"Document '{document.title}' added successfully")
                return True
            else:
                self.logger.error(f"Failed to add document '{document.title}'")
                return False
                
        except Exception as e:
            self.logger.error(f"Error adding document: {e}")
            return False
    
    async def delete_document(
        self,
        document_id: str,
        property_id: str
    ) -> bool:
        """
        Delete a document from the knowledge base
        
        Args:
            document_id: ID of document to delete
            property_id: Property ID for isolation
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Delete from knowledge base
            kb_success = await self.kb_manager.delete_document(document_id, property_id)
            
            # Delete from vector store
            vector_success = await self.vector_store.delete_document(document_id, property_id)
            
            if kb_success and vector_success:
                self.logger.info(f"Document {document_id} deleted successfully")
                return True
            else:
                self.logger.error(f"Failed to delete document {document_id}")
                return False
                
        except Exception as e:
            self.logger.error(f"Error deleting document: {e}")
            return False
    
    async def get_documents(
        self,
        property_id: str,
        limit: int = 50,
        offset: int = 0
    ) -> List[Document]:
        """
        Get all documents for a property
        
        Args:
            property_id: Property ID for isolation
            limit: Maximum number of documents to return
            offset: Number of documents to skip
            
        Returns:
            List of documents
        """
        try:
            return await self.kb_manager.get_documents(property_id, limit, offset)
        except Exception as e:
            self.logger.error(f"Error getting documents: {e}")
            return []
    
    async def search_documents(
        self,
        query: str,
        property_id: str,
        limit: int = 10
    ) -> List[SearchResult]:
        """
        Search documents using vector similarity
        
        Args:
            query: Search query
            property_id: Property ID for isolation
            limit: Maximum number of results
            
        Returns:
            List of search results
        """
        try:
            return await self.vector_store.search(query, property_id, limit)
        except Exception as e:
            self.logger.error(f"Error searching documents: {e}")
            return []

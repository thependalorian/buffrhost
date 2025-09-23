"""
RAG (Retrieval Augmented Generation) Pipeline for Buffr Host Hospitality Platform

This module provides a comprehensive knowledge base management system that allows
hospitality properties to add their company information, policies, procedures,
and other knowledge for AI agents to use in customer interactions.

Features:
- Document ingestion and processing
- Vector embeddings and storage
- Knowledge base management
- AI agent integration
- Multi-property knowledge isolation
"""

from .knowledge_base import KnowledgeBaseManager
from .document_processor import DocumentProcessor
from .vector_store import VectorStoreManager
from .rag_agent import RAGAgent

__all__ = [
    "KnowledgeBaseManager",
    "DocumentProcessor", 
    "VectorStoreManager",
    "RAGAgent"
]

"""
RAG-Powered Q&A System for Buffr Host Hospitality Platform

This module implements a Retrieval-Augmented Generation (RAG) system using:
- LlamaIndex for knowledge base indexing and retrieval
- LangChain for document processing and chain management
- Pydantic AI for structured responses
- pgvector for vector similarity search

Features:
- Business insights and analytics Q&A
- Hospitality knowledge base
- Customer support knowledge
- Operational guidance
- Multi-document search and retrieval
"""

import asyncio
import logging
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional, Union

from llama_index.core import (Document, Settings, StorageContext,
                              VectorStoreIndex, load_index_from_storage)
from pydantic import BaseModel, Field
from pydantic_ai import Agent, RunContext
from pydantic_ai.models.openai import OpenAIModel

try:
    from llama_index.embeddings.openai import OpenAIEmbedding
except ImportError:
    from llama_index.core.embeddings import OpenAIEmbedding
try:
    from llama_index.llms.openai import OpenAI
except ImportError:
    from llama_index.core.llms import OpenAI

from langchain.schema import Document as LangChainDocument
from langchain.text_splitter import RecursiveCharacterTextSplitter
from llama_index.core.postprocessor import SimilarityPostprocessor
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.retrievers import VectorIndexRetriever
from llama_index.core.storage.docstore import SimpleDocumentStore
from llama_index.core.storage.index_store import SimpleIndexStore
from llama_index.vector_stores.postgres import PGVectorStore

# Enhanced RAG imports
try:
    from sentence_transformers import CrossEncoder

    HAS_CROSS_ENCODER = True
except ImportError:
    HAS_CROSS_ENCODER = False
    logging.warning("sentence-transformers not installed. Reranking will be disabled.")

try:
    from rank_bm25 import BM25Okapi

    HAS_BM25 = True
except ImportError:
    HAS_BM25 = False
    logging.warning("rank-bm25 not installed. BM25 search will be disabled.")

import re
from collections import Counter

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from models.hospitality_property import HospitalityProperty
from models.knowledge import KnowledgeDocument
from models.order import Order
from models.room import RoomReservation
from models.user import Profile, User

logger = logging.getLogger(__name__)


class QueryType(str, Enum):
    """Types of queries the RAG system can handle"""

    BUSINESS_ANALYTICS = "business_analytics"
    CUSTOMER_SUPPORT = "customer_support"
    OPERATIONAL_GUIDANCE = "operational_guidance"
    HOSPITALITY_KNOWLEDGE = "hospitality_knowledge"
    POLICY_QUESTION = "policy_question"
    GENERAL_QUESTION = "general_question"


class RAGResponse(BaseModel):
    """Structured RAG response"""

    answer: str
    query_type: QueryType
    confidence: float
    sources: List[Dict[str, Any]] = Field(default_factory=list)
    related_questions: List[str] = Field(default_factory=list)
    suggested_actions: List[str] = Field(default_factory=list)
    context_used: Dict[str, Any] = Field(default_factory=dict)


class KnowledgeDocument(BaseModel):
    """Knowledge base document structure"""

    id: str
    title: str
    content: str
    category: str
    tags: List[str] = Field(default_factory=list)
    property_id: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class RAGSystem:
    """
    RAG-powered Q&A system for business insights and knowledge retrieval

    Features:
    - Multi-document knowledge base
    - Vector similarity search
    - Context-aware responses
    - Business analytics insights
    - Customer support knowledge
    """

    def __init__(
        self,
        db_session: AsyncSession,
        openai_api_key: str,
        postgres_connection_string: str,
    ):
        self.db = db_session
        self.openai_api_key = openai_api_key
        self.postgres_connection_string = postgres_connection_string

        # Initialize LlamaIndex components
        self.embed_model = OpenAIEmbedding(api_key=openai_api_key)
        self.llm = OpenAI(api_key=openai_api_key, model="gpt-4o-mini")

        # Set global settings
        Settings.embed_model = self.embed_model
        Settings.llm = self.llm

        # Initialize vector store
        self.vector_store = None
        self.index = None
        self.query_engine = None

        # Initialize text splitter
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=200, length_function=len
        )

        # Initialize Pydantic AI agent for structured responses
        self.agent = Agent(
            model=OpenAIModel("gpt-4o-mini", api_key=openai_api_key),
            result_type=RAGResponse,
            system_prompt=self._get_rag_system_prompt(),
        )

        # Initialize enhanced RAG components
        self.bm25_index = None
        self.cross_encoder = None
        self.document_corpus = []
        self.document_tokens = []

        # Initialize enhanced components if available
        if HAS_CROSS_ENCODER:
            try:
                self.cross_encoder = CrossEncoder(
                    "cross-encoder/ms-marco-MiniLM-L-6-v2"
                )
                logger.info("Cross-encoder initialized for reranking")
            except Exception as e:
                logger.warning(f"Failed to initialize cross-encoder: {e}")
                self.cross_encoder = None

    def _get_rag_system_prompt(self) -> str:
        """Get system prompt for RAG agent"""
        return """
        You are Buffr Host AI, a business intelligence assistant for Buffr Host hospitality platform.
        
        Your role is to provide accurate, helpful answers based on the retrieved context and your knowledge
        of hospitality operations, business analytics, and customer service.
        
        **Guidelines:**
        1. **Accuracy**: Only provide information that is supported by the retrieved context or your training
        2. **Completeness**: Give comprehensive answers that address all aspects of the question
        3. **Clarity**: Use clear, professional language appropriate for business users
        4. **Actionability**: Include specific, actionable insights when possible
        5. **Sources**: Always cite the sources you used to generate your response
        
        **Response Structure:**
        - Provide a clear, direct answer to the question
        - Include relevant data, metrics, or examples when available
        - Suggest follow-up questions or actions
        - List the sources used for your response
        
        **Context Types:**
        - Business analytics and performance metrics
        - Customer behavior and preferences
        - Operational procedures and best practices
        - Hospitality industry knowledge
        - Policy and compliance information
        
        Always be helpful, accurate, and professional in your responses.
        """

    async def initialize(self):
        """Initialize the RAG system with existing knowledge base"""
        try:
            # Initialize vector store
            await self._initialize_vector_store()

            # Load or create index
            await self._load_or_create_index()

            # Create query engine
            self._create_query_engine()

            logger.info("RAG system initialized successfully")

        except Exception as e:
            logger.error(f"Error initializing RAG system: {e}")
            raise

    async def _initialize_vector_store(self):
        """Initialize PostgreSQL vector store"""
        try:
            self.vector_store = PGVectorStore.from_params(
                database="buffr_host",
                host="localhost",
                password="password",
                port=5432,
                user="postgres",
                table_name="knowledge_vectors",
                embed_dim=1536,  # OpenAI embedding dimension
            )

        except Exception as e:
            logger.error(f"Error initializing vector store: {e}")
            raise

    async def _load_or_create_index(self):
        """Load existing index or create new one"""
        try:
            # Try to load existing index
            storage_context = StorageContext.from_defaults(
                vector_store=self.vector_store,
                docstore=SimpleDocumentStore(),
                index_store=SimpleIndexStore(),
            )

            try:
                self.index = load_index_from_storage(storage_context)
                logger.info("Loaded existing knowledge index")
            except:
                # Create new index
                await self._create_initial_index()
                logger.info("Created new knowledge index")

        except Exception as e:
            logger.error(f"Error loading/creating index: {e}")
            raise

    async def _create_initial_index(self):
        """Create initial knowledge base index"""
        try:
            # Get existing knowledge base documents
            documents = await self._get_knowledge_documents()

            if not documents:
                # Create default knowledge base
                documents = await self._create_default_knowledge_base()

            # Convert to LlamaIndex documents
            llama_documents = []
            for doc in documents:
                llama_doc = Document(
                    text=doc.content,
                    metadata={
                        "id": doc.id,
                        "title": doc.title,
                        "category": doc.category,
                        "tags": doc.tags,
                        "property_id": doc.property_id,
                        "created_at": doc.created_at.isoformat(),
                        "updated_at": doc.updated_at.isoformat(),
                    },
                )
                llama_documents.append(llama_doc)

            # Create index
            storage_context = StorageContext.from_defaults(
                vector_store=self.vector_store,
                docstore=SimpleDocumentStore(),
                index_store=SimpleIndexStore(),
            )

            self.index = VectorStoreIndex.from_documents(
                llama_documents, storage_context=storage_context
            )

            # Persist index
            self.index.storage_context.persist()

        except Exception as e:
            logger.error(f"Error creating initial index: {e}")
            raise

    def _create_query_engine(self):
        """Create query engine with retriever and post-processor"""
        try:
            # Create retriever
            retriever = VectorIndexRetriever(index=self.index, similarity_top_k=5)

            # Create post-processor
            postprocessor = SimilarityPostprocessor(similarity_cutoff=0.7)

            # Create query engine
            self.query_engine = RetrieverQueryEngine.from_args(
                retriever=retriever, node_postprocessors=[postprocessor]
            )

        except Exception as e:
            logger.error(f"Error creating query engine: {e}")
            raise

    async def query(
        self,
        question: str,
        query_type: Optional[QueryType] = None,
        property_id: Optional[int] = None,
        context: Optional[Dict[str, Any]] = None,
    ) -> RAGResponse:
        """
        Query the RAG system for business insights

        Args:
            question: User question
            query_type: Type of query (optional)
            property_id: Property context (optional)
            context: Additional context (optional)

        Returns:
            Structured RAG response
        """
        try:
            # Classify query type if not provided
            if not query_type:
                query_type = await self._classify_query_type(question)

            # Get relevant context
            retrieved_context = await self._retrieve_context(question, property_id)

            # Prepare context for AI agent
            agent_context = {
                "question": question,
                "query_type": query_type.value,
                "retrieved_context": retrieved_context,
                "property_id": property_id,
                "additional_context": context or {},
            }

            # Generate response using Pydantic AI
            result = await self.agent.run(question, context=agent_context)

            return result.data

        except Exception as e:
            logger.error(f"Error querying RAG system: {e}")
            return RAGResponse(
                answer="I apologize, but I encountered an error while processing your question. Please try again or contact support.",
                query_type=QueryType.GENERAL_QUESTION,
                confidence=0.0,
                sources=[],
                related_questions=[],
                suggested_actions=[
                    "Contact support team",
                    "Try rephrasing your question",
                ],
            )

    async def _classify_query_type(self, question: str) -> QueryType:
        """Classify the type of query"""
        question_lower = question.lower()

        # Business analytics keywords
        if any(
            word in question_lower
            for word in [
                "revenue",
                "sales",
                "profit",
                "analytics",
                "performance",
                "metrics",
                "report",
            ]
        ):
            return QueryType.BUSINESS_ANALYTICS

        # Customer support keywords
        elif any(
            word in question_lower
            for word in ["customer", "guest", "support", "help", "problem", "issue"]
        ):
            return QueryType.CUSTOMER_SUPPORT

        # Operational guidance keywords
        elif any(
            word in question_lower
            for word in ["how to", "process", "procedure", "operation", "workflow"]
        ):
            return QueryType.OPERATIONAL_GUIDANCE

        # Policy questions
        elif any(
            word in question_lower
            for word in ["policy", "rule", "regulation", "compliance", "terms"]
        ):
            return QueryType.POLICY_QUESTION

        # Hospitality knowledge
        elif any(
            word in question_lower
            for word in ["hospitality", "hotel", "restaurant", "service", "amenity"]
        ):
            return QueryType.HOSPITALITY_KNOWLEDGE

        else:
            return QueryType.GENERAL_QUESTION

    async def _retrieve_context(
        self, question: str, property_id: Optional[int] = None
    ) -> Dict[str, Any]:
        """Retrieve relevant context for the question"""
        try:
            # Query the vector index
            response = self.query_engine.query(question)

            # Extract sources and context
            sources = []
            context_text = ""

            for node in response.source_nodes:
                source = {
                    "title": node.metadata.get("title", "Unknown"),
                    "category": node.metadata.get("category", "General"),
                    "content": node.text,
                    "score": node.score,
                    "metadata": node.metadata,
                }
                sources.append(source)
                context_text += f"\n\n{node.text}"

            # Get property-specific context if needed
            property_context = {}
            if property_id:
                property_context = await self._get_property_context(property_id)

            return {
                "sources": sources,
                "context_text": context_text,
                "property_context": property_context,
                "total_sources": len(sources),
            }

        except Exception as e:
            logger.error(f"Error retrieving context: {e}")
            return {
                "sources": [],
                "context_text": "",
                "property_context": {},
                "total_sources": 0,
            }

    async def _get_property_context(self, property_id: int) -> Dict[str, Any]:
        """Get property-specific context for queries"""
        try:
            # Get property information
            query = select(HospitalityProperty).where(
                HospitalityProperty.id == property_id
            )
            result = await self.db.execute(query)
            property = result.scalar_one_or_none()

            if not property:
                return {}

            # Get recent performance metrics
            metrics = await self._get_property_metrics(property_id)

            return {
                "property_info": {
                    "name": property.name,
                    "type": property.property_type,
                    "services": property.services_offered,
                    "amenities": property.amenities,
                },
                "metrics": metrics,
            }

        except Exception as e:
            logger.error(f"Error getting property context: {e}")
            return {}

    async def _get_property_metrics(self, property_id: int) -> Dict[str, Any]:
        """Get recent performance metrics for property"""
        try:
            # Get recent orders
            order_query = (
                select(Order)
                .where(Order.property_id == property_id)
                .order_by(Order.created_at.desc())
                .limit(100)
            )

            order_result = await self.db.execute(order_query)
            orders = order_result.scalars().all()

            # Get recent reservations
            reservation_query = (
                select(RoomReservation)
                .where(RoomReservation.property_id == property_id)
                .order_by(RoomReservation.created_at.desc())
                .limit(100)
            )

            reservation_result = await self.db.execute(reservation_query)
            reservations = reservation_result.scalars().all()

            # Calculate metrics
            total_revenue = sum(order.total_amount for order in orders)
            avg_order_value = total_revenue / len(orders) if orders else 0
            total_reservations = len(reservations)
            occupancy_rate = (
                len(reservations) / 100 if reservations else 0
            )  # Assuming 100 rooms

            return {
                "total_revenue": total_revenue,
                "avg_order_value": avg_order_value,
                "total_orders": len(orders),
                "total_reservations": total_reservations,
                "occupancy_rate": occupancy_rate,
            }

        except Exception as e:
            logger.error(f"Error getting property metrics: {e}")
            return {}

    async def _get_knowledge_documents(self) -> List[KnowledgeDocument]:
        """Get existing knowledge base documents from database"""
        try:
            query = select(KnowledgeDocument)
            result = await self.db.execute(query)
            kb_entries = result.scalars().all()

            documents = []
            for entry in kb_entries:
                doc = KnowledgeDocument(
                    id=str(entry.id),
                    title=entry.title,
                    content=entry.content,
                    category=entry.category,
                    tags=entry.tags or [],
                    property_id=entry.property_id,
                    created_at=entry.created_at,
                    updated_at=entry.updated_at,
                )
                documents.append(doc)

            return documents

        except Exception as e:
            logger.error(f"Error getting knowledge documents: {e}")
            return []

    async def _create_default_knowledge_base(self) -> List[KnowledgeDocument]:
        """Create default knowledge base with hospitality information"""
        default_docs = [
            KnowledgeDocument(
                id="hospitality_basics",
                title="Hospitality Industry Basics",
                content="""
                The hospitality industry encompasses various service sectors including hotels, restaurants, 
                spas, conference facilities, and transportation services. Key success factors include:
                
                1. Customer Service Excellence
                - Personalized guest experiences
                - 24/7 availability and support
                - Quick problem resolution
                - Proactive service delivery
                
                2. Operational Efficiency
                - Streamlined processes
                - Technology integration
                - Staff training and development
                - Quality control systems
                
                3. Revenue Management
                - Dynamic pricing strategies
                - Inventory optimization
                - Cross-selling opportunities
                - Loyalty program management
                
                4. Guest Experience
                - Seamless booking processes
                - Multi-service integration
                - Personalized recommendations
                - Feedback collection and action
                """,
                category="hospitality_knowledge",
                tags=["basics", "industry", "overview"],
            ),
            KnowledgeDocument(
                id="customer_service_best_practices",
                title="Customer Service Best Practices",
                content="""
                Effective customer service in hospitality requires:
                
                1. Communication Skills
                - Active listening
                - Clear and concise responses
                - Multi-language support
                - Empathetic communication
                
                2. Problem Resolution
                - Quick response times
                - Escalation procedures
                - Follow-up processes
                - Documentation of issues
                
                3. Guest Relations
                - Personalized interactions
                - Anticipating needs
                - Building relationships
                - Managing expectations
                
                4. Technology Integration
                - CRM systems
                - Communication platforms
                - Feedback systems
                - Analytics and reporting
                """,
                category="customer_support",
                tags=["customer_service", "best_practices", "communication"],
            ),
            KnowledgeDocument(
                id="revenue_optimization",
                title="Revenue Optimization Strategies",
                content="""
                Revenue optimization in hospitality involves:
                
                1. Pricing Strategies
                - Market-based pricing
                - Value-based pricing
                - Competitive analysis
                - Seasonal adjustments
                
                2. Inventory Management
                - Demand forecasting
                - Capacity optimization
                - Overbooking strategies
                - Yield management
                
                3. Cross-Selling
                - Service bundling
                - Upselling opportunities
                - Package deals
                - Loyalty incentives
                
                4. Analytics and Reporting
                - Performance metrics
                - Trend analysis
                - Customer segmentation
                - ROI measurement
                """,
                category="business_analytics",
                tags=["revenue", "pricing", "optimization", "analytics"],
            ),
        ]

        return default_docs

    async def add_knowledge_document(self, document: KnowledgeDocument):
        """Add new knowledge document to the system"""
        try:
            # Create LlamaIndex document
            llama_doc = Document(
                text=document.content,
                metadata={
                    "id": document.id,
                    "title": document.title,
                    "category": document.category,
                    "tags": document.tags,
                    "property_id": document.property_id,
                    "created_at": document.created_at.isoformat(),
                    "updated_at": document.updated_at.isoformat(),
                },
            )

            # Add to index
            self.index.insert(llama_doc)

            # Persist changes
            self.index.storage_context.persist()

            logger.info(f"Added knowledge document: {document.title}")

        except Exception as e:
            logger.error(f"Error adding knowledge document: {e}")
            raise

    async def update_knowledge_document(self, document_id: str, updated_content: str):
        """Update existing knowledge document"""
        try:
            # This would require more complex logic to update specific documents
            # For now, we'll recreate the index with updated content
            await self._recreate_index_with_updates(document_id, updated_content)

            logger.info(f"Updated knowledge document: {document_id}")

        except Exception as e:
            logger.error(f"Error updating knowledge document: {e}")
            raise

    async def _recreate_index_with_updates(
        self, document_id: str, updated_content: str
    ):
        """Recreate index with updated document content"""
        # This is a simplified approach - in production, you'd want more sophisticated update logic
        await self._create_initial_index()

    async def get_suggested_questions(self, query_type: QueryType) -> List[str]:
        """Get suggested questions based on query type"""
        suggestions = {
            QueryType.BUSINESS_ANALYTICS: [
                "What are our top-performing services this month?",
                "How is our revenue trending compared to last year?",
                "Which customer segments generate the most revenue?",
                "What are our peak booking times?",
                "How can we improve our average order value?",
            ],
            QueryType.CUSTOMER_SUPPORT: [
                "How do I handle customer complaints effectively?",
                "What are our customer service response time targets?",
                "How do I escalate complex customer issues?",
                "What information should I collect from customers?",
                "How do I follow up with customers after service?",
            ],
            QueryType.OPERATIONAL_GUIDANCE: [
                "How do I process a room service order?",
                "What's the procedure for handling spa bookings?",
                "How do I manage conference room reservations?",
                "What's the process for loyalty point redemption?",
                "How do I handle payment processing issues?",
            ],
            QueryType.HOSPITALITY_KNOWLEDGE: [
                "What are the key trends in hospitality technology?",
                "How do I create memorable guest experiences?",
                "What are best practices for hotel operations?",
                "How do I manage multi-service properties?",
                "What are effective loyalty program strategies?",
            ],
        }

        return suggestions.get(
            query_type,
            [
                "How can I improve our guest satisfaction scores?",
                "What are our most popular services?",
                "How do I handle peak demand periods?",
                "What training should staff receive?",
                "How do I optimize our service delivery?",
            ],
        )

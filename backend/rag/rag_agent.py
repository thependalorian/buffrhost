"""
RAG Agent for Buffr Host Hospitality Platform

This module provides an AI agent that uses the knowledge base to answer questions
and provide contextual information about hospitality properties. It combines
retrieval-augmented generation with conversational AI capabilities.
"""

import asyncio
import logging
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional, Union

from pydantic import BaseModel, Field
from pydantic_ai import Agent, RunContext
from pydantic_ai.models.openai import OpenAIModel

from .knowledge_base import DocumentType, KnowledgeBaseManager
from .vector_store import VectorStoreManager

logger = logging.getLogger(__name__)


class QueryType(str, Enum):
    """Types of queries the RAG agent can handle."""

    GENERAL_INFO = "general_info"
    POLICY_QUESTION = "policy_question"
    PROCEDURE_QUESTION = "procedure_question"
    CONTACT_INFO = "contact_info"
    BOOKING_HELP = "booking_help"
    SERVICE_INFO = "service_info"
    EMERGENCY = "emergency"
    FAQ = "faq"
    OTHER = "other"


class RAGResponse(BaseModel):
    """Response from the RAG agent."""

    answer: str = Field(..., description="The generated answer")
    confidence: float = Field(..., description="Confidence score (0-1)")
    sources: List[Dict[str, Any]] = Field(
        default_factory=list, description="Source documents used"
    )
    query_type: QueryType = Field(..., description="Type of query detected")
    follow_up_questions: List[str] = Field(
        default_factory=list, description="Suggested follow-up questions"
    )
    requires_human: bool = Field(
        default=False, description="Whether human assistance is needed"
    )


class RAGAgent:
    """
    RAG Agent that uses the knowledge base to answer questions.

    Combines retrieval-augmented generation with conversational AI capabilities
    to provide accurate and contextual responses about hospitality properties.
    """

    def __init__(self, knowledge_base: KnowledgeBaseManager):
        self.knowledge_base = knowledge_base
        self.agent = Agent(
            model=OpenAIModel("gpt-4"),
            result_type=RAGResponse,
            system_prompt=self._get_system_prompt(),
        )

    def _get_system_prompt(self) -> str:
        """Get the system prompt for the RAG agent."""
        return """
        You are an AI assistant for Buffr Host hospitality platform. Your role is to help customers
        and staff by providing accurate information about hospitality properties using the knowledge base.
        
        Guidelines:
        1. Always provide accurate, helpful, and professional responses
        2. Use the retrieved knowledge base information to answer questions
        3. If you don't have enough information, clearly state what you don't know
        4. For emergency situations, always recommend contacting staff immediately
        5. Be conversational but maintain professionalism
        6. Suggest relevant follow-up questions when appropriate
        7. If the query requires human assistance, set requires_human to true
        
        Response format:
        - Provide a clear, comprehensive answer
        - Include confidence score based on available information
        - List the sources used (document titles and types)
        - Classify the query type
        - Suggest 2-3 relevant follow-up questions
        - Indicate if human assistance is needed
        """

    async def query(
        self,
        property_id: int,
        question: str,
        user_context: Optional[Dict[str, Any]] = None,
    ) -> RAGResponse:
        """
        Answer a question using the knowledge base.

        Args:
            property_id: Hospitality property ID
            question: User's question
            user_context: Additional context about the user

        Returns:
            RAGResponse with answer and metadata
        """
        try:
            # Classify the query type
            query_type = await self._classify_query(question)

            # Retrieve relevant documents
            relevant_docs = await self._retrieve_relevant_documents(
                property_id, question, query_type
            )

            # Generate response using the agent
            response = await self.agent.run(
                question=question,
                context=user_context or {},
                relevant_documents=relevant_docs,
                query_type=query_type,
            )

            # Post-process the response
            response = await self._post_process_response(response, relevant_docs)

            logger.info(f"RAG query processed for property {property_id}: {query_type}")
            return response

        except Exception as e:
            logger.error(f"Error processing RAG query: {e}")
            # Return a fallback response
            return RAGResponse(
                answer="I apologize, but I'm having trouble accessing the information right now. Please contact our staff for assistance.",
                confidence=0.0,
                sources=[],
                query_type=QueryType.OTHER,
                follow_up_questions=[],
                requires_human=True,
            )

    async def _classify_query(self, question: str) -> QueryType:
        """Classify the type of query."""
        question_lower = question.lower()

        # Emergency keywords
        if any(
            word in question_lower
            for word in ["emergency", "urgent", "help", "fire", "medical", "police"]
        ):
            return QueryType.EMERGENCY

        # Policy keywords
        if any(
            word in question_lower
            for word in ["policy", "rule", "regulation", "allowed", "prohibited"]
        ):
            return QueryType.POLICY_QUESTION

        # Procedure keywords
        if any(
            word in question_lower
            for word in ["how to", "procedure", "process", "steps", "guide"]
        ):
            return QueryType.PROCEDURE_QUESTION

        # Contact keywords
        if any(
            word in question_lower
            for word in ["contact", "phone", "email", "address", "location"]
        ):
            return QueryType.CONTACT_INFO

        # Booking keywords
        if any(
            word in question_lower
            for word in ["book", "reservation", "check-in", "check-out", "room"]
        ):
            return QueryType.BOOKING_HELP

        # Service keywords
        if any(
            word in question_lower
            for word in ["service", "amenity", "facility", "restaurant", "spa"]
        ):
            return QueryType.SERVICE_INFO

        # FAQ keywords
        if any(
            word in question_lower
            for word in ["what", "when", "where", "why", "how", "?"]
        ):
            return QueryType.FAQ

        return QueryType.GENERAL_INFO

    async def _retrieve_relevant_documents(
        self, property_id: int, question: str, query_type: QueryType
    ) -> List[Dict[str, Any]]:
        """Retrieve relevant documents from the knowledge base."""
        try:
            # Map query types to document types
            document_type_mapping = {
                QueryType.POLICY_QUESTION: [DocumentType.POLICIES],
                QueryType.PROCEDURE_QUESTION: [DocumentType.PROCEDURES],
                QueryType.CONTACT_INFO: [DocumentType.CONTACT_INFO],
                QueryType.BOOKING_HELP: [
                    DocumentType.BOOKING_PROCEDURES,
                    DocumentType.ROOM_INFO,
                ],
                QueryType.SERVICE_INFO: [DocumentType.SERVICES, DocumentType.AMENITIES],
                QueryType.EMERGENCY: [DocumentType.EMERGENCY_PROCEDURES],
                QueryType.FAQ: [DocumentType.FAQ],
                QueryType.GENERAL_INFO: [DocumentType.COMPANY_INFO, DocumentType.FAQ],
            }

            # Get relevant document types
            relevant_doc_types = document_type_mapping.get(query_type, [])

            # Search for relevant documents
            documents = await self.knowledge_base.search_documents(
                property_id=property_id,
                query=question,
                document_types=relevant_doc_types,
                limit=5,
            )

            # Convert to the format expected by the agent
            relevant_docs = []
            for doc in documents:
                relevant_docs.append(
                    {
                        "title": doc.title,
                        "content": doc.content,
                        "document_type": doc.document_type.value,
                        "tags": doc.tags,
                    }
                )

            return relevant_docs

        except Exception as e:
            logger.error(f"Error retrieving relevant documents: {e}")
            return []

    async def _post_process_response(
        self, response: RAGResponse, sources: List[Dict[str, Any]]
    ) -> RAGResponse:
        """Post-process the response to add source information."""
        try:
            # Add source information
            response.sources = [
                {
                    "title": source.get("title", "Unknown"),
                    "type": source.get("document_type", "Unknown"),
                    "tags": source.get("tags", []),
                }
                for source in sources
            ]

            # Adjust confidence based on number of sources
            if len(sources) == 0:
                response.confidence = min(response.confidence, 0.3)
            elif len(sources) >= 3:
                response.confidence = min(response.confidence + 0.1, 1.0)

            # Add emergency handling
            if response.query_type == QueryType.EMERGENCY:
                response.requires_human = True
                response.answer = f"EMERGENCY: {response.answer}\n\nPlease contact hotel staff immediately at the front desk or call emergency services."

            return response

        except Exception as e:
            logger.error(f"Error post-processing response: {e}")
            return response

    async def get_suggested_questions(
        self, property_id: int, context: Optional[Dict[str, Any]] = None
    ) -> List[str]:
        """
        Get suggested questions based on available knowledge.

        Args:
            property_id: Hospitality property ID
            context: User context (optional)

        Returns:
            List of suggested questions
        """
        try:
            # Get knowledge base summary
            summary = await self.knowledge_base.get_property_knowledge_summary(
                property_id
            )

            # Generate suggested questions based on available document types
            suggested_questions = []

            if summary.get("document_types", {}).get("company_info"):
                suggested_questions.append("Tell me about this property")

            if summary.get("document_types", {}).get("services"):
                suggested_questions.append("What services do you offer?")

            if summary.get("document_types", {}).get("amenities"):
                suggested_questions.append("What amenities are available?")

            if summary.get("document_types", {}).get("contact_info"):
                suggested_questions.append("How can I contact the hotel?")

            if summary.get("document_types", {}).get("booking_procedures"):
                suggested_questions.append("How do I make a reservation?")

            if summary.get("document_types", {}).get("policies"):
                suggested_questions.append("What are your policies?")

            return suggested_questions[:5]  # Return top 5 suggestions

        except Exception as e:
            logger.error(f"Error getting suggested questions: {e}")
            return []

    async def get_knowledge_gaps(
        self, property_id: int, common_questions: List[str]
    ) -> List[str]:
        """
        Identify knowledge gaps based on common questions.

        Args:
            property_id: Hospitality property ID
            common_questions: List of frequently asked questions

        Returns:
            List of knowledge gaps
        """
        try:
            gaps = []

            for question in common_questions:
                # Try to answer the question
                response = await self.query(property_id, question)

                # If confidence is low, it might be a knowledge gap
                if response.confidence < 0.5:
                    gaps.append(question)

            return gaps

        except Exception as e:
            logger.error(f"Error identifying knowledge gaps: {e}")
            return []

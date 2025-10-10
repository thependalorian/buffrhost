"""
AI Receptionist Service
Tenant-aware omnichannel AI receptionist with voice and RAG capabilities
"""

from sqlalchemy.orm import Session
from typing import Dict, Any, List, Optional
from datetime import datetime
import logging
import json
import asyncio
from langchain.llms import OpenAI
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import PGVector
from langchain.chains import RetrievalQA
from langchain.memory import ConversationBufferMemory

from models.tenant import TenantUser
from models.knowledge_base import KnowledgeBase
from schemas.ai import (
    ReceptionistRequest,
    ReceptionistResponse,
    VoiceRequest,
    VoiceResponse,
    KnowledgeUploadRequest,
    KnowledgeUploadResponse
)

logger = logging.getLogger(__name__)

class AIReceptionistService:
    """Tenant-aware AI receptionist service"""
    
    def __init__(self, db: Session, tenant_id: str):
        self.db = db
        self.tenant_id = tenant_id
        self.tenant = self._get_tenant()
        self.llm = None
        self.embeddings = None
        self.vectorstore = None
        self.memory = None
        self._initialize_ai_components()
    
    def _get_tenant(self) -> Optional[TenantUser]:
        """Get tenant profile"""
        return self.db.query(TenantUser).filter(
            TenantUser.id == self.tenant_id
        ).first()
    
    def _initialize_ai_components(self):
        """Initialize AI components for the tenant"""
        try:
            # Initialize LLM with tenant-specific configuration
            self.llm = OpenAI(
                temperature=0.7,
                max_tokens=500,
                model_name="gpt-4"
            )
            
            # Initialize embeddings
            self.embeddings = OpenAIEmbeddings()
            
            # Initialize vector store with tenant-specific collection
            self.vectorstore = PGVector(
                connection_string=self._get_connection_string(),
                embedding_function=self.embeddings,
                collection_name=f"tenant_{self.tenant_id}_knowledge"
            )
            
            # Initialize memory
            self.memory = ConversationBufferMemory(
                memory_key="chat_history",
                return_messages=True
            )
            
            logger.info(f"AI components initialized for tenant {self.tenant_id}")
            
        except Exception as e:
            logger.error(f"Failed to initialize AI components: {str(e)}")
            raise
    
    def _get_connection_string(self) -> str:
        """Get database connection string for vector store"""
        # This would use the tenant's database configuration
        return f"postgresql://user:password@localhost:5432/buffr_host_tenant_{self.tenant_id}"
    
    async def process_message(
        self, 
        request: ReceptionistRequest
    ) -> ReceptionistResponse:
        """Process incoming message through AI receptionist"""
        try:
            # Get tenant-specific knowledge base
            knowledge_base = self._get_tenant_knowledge_base()
            
            # Create retrieval QA chain
            qa_chain = RetrievalQA.from_chain_type(
                llm=self.llm,
                chain_type="stuff",
                retriever=knowledge_base.as_retriever(),
                memory=self.memory,
                return_source_documents=True
            )
            
            # Process the message
            response = qa_chain({"query": request.message})
            
            # Generate response with tenant branding
            formatted_response = self._format_response(
                response["result"],
                request.customer_id,
                request.channel
            )
            
            # Log interaction
            await self._log_interaction(request, formatted_response)
            
            return ReceptionistResponse(
                message=formatted_response,
                confidence_score=self._calculate_confidence(response),
                suggested_actions=self._get_suggested_actions(response),
                requires_human=self._requires_human_escalation(response),
                tenant_id=self.tenant_id,
                processed_at=datetime.utcnow()
            )
            
        except Exception as e:
            logger.error(f"Failed to process message: {str(e)}")
            return ReceptionistResponse(
                message="I apologize, but I'm experiencing technical difficulties. Please try again or contact our support team.",
                confidence_score=0.0,
                requires_human=True,
                tenant_id=self.tenant_id,
                processed_at=datetime.utcnow()
            )
    
    async def process_voice(
        self, 
        request: VoiceRequest
    ) -> VoiceResponse:
        """Process voice input through AI receptionist"""
        try:
            # Convert speech to text (would integrate with actual STT service)
            text = await self._speech_to_text(request.audio_data)
            
            # Process as text message
            text_request = ReceptionistRequest(
                message=text,
                customer_id=request.customer_id,
                channel="voice",
                language=request.language
            )
            
            text_response = await self.process_message(text_request)
            
            # Convert response to speech
            audio_response = await self._text_to_speech(
                text_response.message,
                voice=request.preferred_voice
            )
            
            return VoiceResponse(
                audio_data=audio_response,
                transcript=text,
                response=text_response.message,
                confidence_score=text_response.confidence_score,
                tenant_id=self.tenant_id,
                processed_at=datetime.utcnow()
            )
            
        except Exception as e:
            logger.error(f"Failed to process voice: {str(e)}")
            return VoiceResponse(
                audio_data=b"",
                transcript="",
                response="I apologize, but I couldn't process your voice input. Please try again.",
                confidence_score=0.0,
                tenant_id=self.tenant_id,
                processed_at=datetime.utcnow()
            )
    
    async def upload_knowledge(
        self, 
        request: KnowledgeUploadRequest
    ) -> KnowledgeUploadResponse:
        """Upload knowledge base content for the tenant"""
        try:
            # Process and chunk the content
            chunks = await self._process_document(request.content, request.content_type)
            
            # Add to vector store
            doc_ids = []
            for chunk in chunks:
                doc_id = await self._add_to_vectorstore(chunk, request.category)
                doc_ids.append(doc_id)
            
            # Store metadata in database
            knowledge_entry = KnowledgeBase(
                tenant_id=self.tenant_id,
                title=request.title,
                category=request.category,
                content_type=request.content_type,
                content=request.content,
                chunk_count=len(chunks),
                document_ids=doc_ids,
                created_at=datetime.utcnow()
            )
            
            self.db.add(knowledge_entry)
            self.db.commit()
            
            return KnowledgeUploadResponse(
                success=True,
                document_id=knowledge_entry.id,
                chunks_created=len(chunks),
                message="Knowledge base updated successfully"
            )
            
        except Exception as e:
            logger.error(f"Failed to upload knowledge: {str(e)}")
            return KnowledgeUploadResponse(
                success=False,
                message=f"Failed to upload knowledge: {str(e)}"
            )
    
    def _get_tenant_knowledge_base(self):
        """Get tenant-specific knowledge base"""
        # This would retrieve and return the tenant's knowledge base
        return self.vectorstore
    
    def _format_response(
        self, 
        response: str, 
        customer_id: str, 
        channel: str
    ) -> str:
        """Format response with tenant branding and personalization"""
        # Add tenant-specific branding
        if self.tenant:
            company_name = self.tenant.company_name
            response = f"Hello! I'm the AI assistant for {company_name}. {response}"
        
        # Add channel-specific formatting
        if channel == "voice":
            response = response.replace("\n", " ")
        elif channel == "sms":
            response = response[:160]  # SMS character limit
        
        return response
    
    def _calculate_confidence(self, response: Dict[str, Any]) -> float:
        """Calculate confidence score for the response"""
        # Simple confidence calculation based on source documents
        source_docs = response.get("source_documents", [])
        if not source_docs:
            return 0.3  # Low confidence if no sources
        
        # Higher confidence with more relevant sources
        confidence = min(0.9, 0.5 + (len(source_docs) * 0.1))
        return confidence
    
    def _get_suggested_actions(self, response: Dict[str, Any]) -> List[str]:
        """Get suggested follow-up actions"""
        # Analyze response to suggest actions
        actions = []
        
        if "booking" in response["result"].lower():
            actions.append("View available rooms")
            actions.append("Check pricing")
        
        if "support" in response["result"].lower():
            actions.append("Contact support")
            actions.append("View help articles")
        
        return actions
    
    def _requires_human_escalation(self, response: Dict[str, Any]) -> bool:
        """Determine if human escalation is required"""
        # Check for escalation triggers
        escalation_keywords = [
            "complaint", "refund", "cancellation", "urgent", 
            "emergency", "manager", "supervisor"
        ]
        
        response_text = response["result"].lower()
        return any(keyword in response_text for keyword in escalation_keywords)
    
    async def _log_interaction(
        self, 
        request: ReceptionistRequest, 
        response: str
    ):
        """Log interaction for analytics"""
        # This would log to the tenant's analytics system
        logger.info(f"AI Receptionist interaction for tenant {self.tenant_id}")
    
    async def _speech_to_text(self, audio_data: bytes) -> str:
        """Convert speech to text"""
        # This would integrate with actual STT service
        return "Hello, I need help with my booking"
    
    async def _text_to_speech(
        self, 
        text: str, 
        voice: str = "default"
    ) -> bytes:
        """Convert text to speech"""
        # This would integrate with actual TTS service
        return b"audio_data_placeholder"
    
    async def _process_document(
        self, 
        content: str, 
        content_type: str
    ) -> List[Dict[str, Any]]:
        """Process document into chunks"""
        # Simple text chunking (would use more sophisticated chunking)
        chunk_size = 1000
        chunks = []
        
        for i in range(0, len(content), chunk_size):
            chunk = content[i:i + chunk_size]
            chunks.append({
                "content": chunk,
                "metadata": {
                    "chunk_index": i // chunk_size,
                    "content_type": content_type
                }
            })
        
        return chunks
    
    async def _add_to_vectorstore(
        self, 
        chunk: Dict[str, Any], 
        category: str
    ) -> str:
        """Add chunk to vector store"""
        # This would add to the tenant's vector store
        return f"doc_{len(chunk['content'])}"
    
    def get_analytics(self, days: int = 30) -> Dict[str, Any]:
        """Get AI receptionist analytics for the tenant"""
        # This would return tenant-specific analytics
        return {
            "tenant_id": self.tenant_id,
            "total_interactions": 0,
            "average_response_time": 0.0,
            "resolution_rate": 0.0,
            "escalation_rate": 0.0,
            "customer_satisfaction": 0.0
        }
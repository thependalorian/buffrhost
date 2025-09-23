"""
AI and Knowledge Base models for Buffr Host.
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID, JSONB, INET

from database import Base

class KnowledgeBase(Base):
    __tablename__ = "knowledgebase"
    knowledge_id = Column(UUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id"))
    category = Column(String(100), nullable=False)
    subcategory = Column(String(100))
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    content_type = Column(String(50), default='text')
    tags = Column(Text, server_default='{}')
    priority = Column(Integer, default=1)
    is_active = Column(Boolean, default=True)
    last_updated_by = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class AIAgentSession(Base):
    __tablename__ = "aiagentsession"
    session_id = Column(UUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customer.customer_id"))
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id"))
    agent_type = Column(String(50), nullable=False)
    session_status = Column(String(50), default='active')
    language = Column(String(10), default='en')
    user_intent = Column(String(100))
    context_data = Column(JSONB)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True))
    transferred_to_human = Column(Boolean, default=False)
    satisfaction_rating = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AIAgentMessage(Base):
    __tablename__ = "aiagentmessage"
    message_id = Column(UUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    session_id = Column(UUID(as_uuid=True), ForeignKey("aiagentsession.session_id"))
    message_type = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    intent_detected = Column(String(100))
    entities_extracted = Column(JSONB)
    confidence_score = Column(Numeric(3, 2))
    response_time_ms = Column(Integer)
    model_used = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AIAgentWorkflow(Base):
    __tablename__ = "aiagentworkflow"
    workflow_id = Column(UUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    workflow_name = Column(String(255), nullable=False)
    workflow_type = Column(String(100), nullable=False)
    description = Column(Text)
    workflow_definition = Column(JSONB, nullable=False)
    input_schema = Column(JSONB)
    output_schema = Column(JSONB)
    is_active = Column(Boolean, default=True)
    version = Column(String(20), default='1.0')
    created_by = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class AIAgentExecution(Base):
    __tablename__ = "aiagentexecution"
    execution_id = Column(UUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    workflow_id = Column(UUID(as_uuid=True), ForeignKey("aiagentworkflow.workflow_id"))
    session_id = Column(UUID(as_uuid=True), ForeignKey("aiagentsession.session_id"))
    execution_status = Column(String(50), default='running')
    input_data = Column(JSONB)
    output_data = Column(JSONB)
    error_message = Column(Text)
    execution_time_ms = Column(Integer)
    steps_completed = Column(Integer, default=0)
    total_steps = Column(Integer)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))
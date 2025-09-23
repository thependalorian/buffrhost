"""
Voice capabilities models for TTS/STT implementation.
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text, Float, LargeBinary
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class VoiceModel(Base):
    """Voice model configurations for TTS/STT."""
    __tablename__ = "voice_models"
    
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id", ondelete="CASCADE"), nullable=False)
    model_name = Column(String(100), nullable=False)
    model_type = Column(String(20), nullable=False)  # 'tts' or 'stt'
    provider = Column(String(50), nullable=False)  # 'openai', 'local', 'azure', 'aws'
    model_id = Column(String(100), nullable=False)
    language = Column(String(10), default='en')
    voice = Column(String(50))  # For TTS models
    is_active = Column(Boolean, default=True)
    configuration = Column(JSONB, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    property = relationship("HospitalityProperty", back_populates="voice_models")


class VoiceInteraction(Base):
    """Voice interactions tracking."""
    __tablename__ = "voice_interactions"
    
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id", ondelete="CASCADE"), nullable=False)
    session_id = Column(String(255), ForeignKey("aiagentsession.session_id", ondelete="CASCADE"))
    interaction_type = Column(String(20), nullable=False)  # 'tts', 'stt', 'conversation'
    input_text = Column(Text)
    output_audio = Column(LargeBinary)
    input_audio = Column(LargeBinary)
    output_text = Column(Text)
    model_used = Column(String(100))
    processing_time_ms = Column(Integer)
    audio_duration_seconds = Column(Float)
    quality_score = Column(Float)
    voice_metadata = Column(JSONB, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    property = relationship("HospitalityProperty", back_populates="voice_interactions")


class AudioFile(Base):
    """Audio files and their metadata."""
    __tablename__ = "audio_files"
    
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id", ondelete="CASCADE"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(20), nullable=False)  # 'wav', 'mp3', 'ogg', 'm4a'
    file_size = Column(Integer, nullable=False)
    duration_seconds = Column(Float)
    sample_rate = Column(Integer)
    channels = Column(Integer)
    bit_rate = Column(Integer)
    purpose = Column(String(50))  # 'tts_output', 'stt_input', 'background_music', 'notification'
    is_processed = Column(Boolean, default=False)
    voice_metadata = Column(JSONB, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True))
    
    # Relationships
    property = relationship("HospitalityProperty", back_populates="audio_files")

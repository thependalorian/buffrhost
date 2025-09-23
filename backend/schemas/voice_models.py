"""
Pydantic schemas for voice models.
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime


class VoiceModelBase(BaseModel):
    """Base schema for voice model."""
    model_name: str = Field(..., max_length=100)
    model_type: str = Field(..., max_length=20)  # 'tts' or 'stt'
    provider: str = Field(..., max_length=50)  # 'openai', 'local', 'azure', 'aws'
    model_id: str = Field(..., max_length=100)
    language: str = Field(default='en', max_length=10)
    voice: Optional[str] = Field(None, max_length=50)  # For TTS models
    is_active: bool = Field(default=True)
    configuration: Dict[str, Any] = Field(default_factory=dict)


class VoiceModelCreate(VoiceModelBase):
    """Schema for creating a voice model."""
    pass


class VoiceModelUpdate(BaseModel):
    """Schema for updating a voice model."""
    model_name: Optional[str] = Field(None, max_length=100)
    model_type: Optional[str] = Field(None, max_length=20)
    provider: Optional[str] = Field(None, max_length=50)
    model_id: Optional[str] = Field(None, max_length=100)
    language: Optional[str] = Field(None, max_length=10)
    voice: Optional[str] = Field(None, max_length=50)
    is_active: Optional[bool] = None
    configuration: Optional[Dict[str, Any]] = None


class VoiceModelResponse(VoiceModelBase):
    """Schema for voice model response."""
    id: int
    property_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class VoiceInteractionBase(BaseModel):
    """Base schema for voice interaction."""
    session_id: Optional[str] = Field(None, max_length=255)
    interaction_type: str = Field(..., max_length=20)  # 'tts', 'stt', 'conversation'
    input_text: Optional[str] = None
    output_text: Optional[str] = None
    model_used: Optional[str] = Field(None, max_length=100)
    processing_time_ms: Optional[int] = None
    audio_duration_seconds: Optional[float] = None
    quality_score: Optional[float] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class VoiceInteractionCreate(VoiceInteractionBase):
    """Schema for creating a voice interaction."""
    pass


class VoiceInteractionResponse(VoiceInteractionBase):
    """Schema for voice interaction response."""
    id: int
    property_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class AudioFileBase(BaseModel):
    """Base schema for audio file."""
    file_name: str = Field(..., max_length=255)
    file_path: str = Field(..., max_length=500)
    file_type: str = Field(..., max_length=20)  # 'wav', 'mp3', 'ogg', 'm4a'
    file_size: int
    duration_seconds: Optional[float] = None
    sample_rate: Optional[int] = None
    channels: Optional[int] = None
    bit_rate: Optional[int] = None
    purpose: Optional[str] = Field(None, max_length=50)  # 'tts_output', 'stt_input', etc.
    is_processed: bool = Field(default=False)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    expires_at: Optional[datetime] = None


class AudioFileCreate(AudioFileBase):
    """Schema for creating an audio file."""
    pass


class AudioFileResponse(AudioFileBase):
    """Schema for audio file response."""
    id: int
    property_id: int
    created_at: datetime

    class Config:
        from_attributes = True

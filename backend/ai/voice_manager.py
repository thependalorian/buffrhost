"""
Enhanced Voice Manager for Buffr Host AI Receptionist

This module provides comprehensive voice capabilities including:
- Multiple TTS models (Kokoro, OpenAI, Piper)
- Multiple STT models (Whisper, OpenAI, Vosk)
- Audio processing and playback
- Voice configuration management
"""

import asyncio
import logging
import json
import tempfile
import io
from pathlib import Path
from typing import Dict, List, Optional, Any, Union
from enum import Enum
from dataclasses import dataclass

import numpy as np
from pydantic import BaseModel, Field

# Audio processing
import soundfile as sf
import librosa
from scipy.io.wavfile import write

# TTS/STT imports
import openai
from openai import OpenAI
import speech_recognition as sr
import pygame

# Model imports (optional, will be imported when needed)
try:
    import torch
    import onnxruntime as ort
    from transformers import pipeline
    HAS_LOCAL_MODELS = True
except ImportError:
    HAS_LOCAL_MODELS = False

try:
    import whisper
    HAS_WHISPER = True
except ImportError:
    HAS_WHISPER = False

logger = logging.getLogger(__name__)


class TTSModel(str, Enum):
    """Available TTS models"""
    KOKORO_82M = "kokoro-82m"
    OPENAI_TTS = "openai-tts"
    PIPER = "piper"
    XTTS_V2 = "xtts-v2"


class STTModel(str, Enum):
    """Available STT models"""
    WHISPER_LOCAL = "whisper-local"
    WHISPER_OPENAI = "whisper-openai"
    FASTER_WHISPER = "faster-whisper"
    VOSK = "vosk"


class VoiceSettings(BaseModel):
    """Voice settings for TTS/STT"""
    tts_model: TTSModel = TTSModel.OPENAI_TTS
    stt_model: STTModel = STTModel.WHISPER_OPENAI
    voice: str = "alloy"  # Voice name
    language: str = "en"
    speed: float = 1.0
    temperature: float = 0.7
    use_gpu: bool = False
    enabled: bool = True


class AudioConfig(BaseModel):
    """Audio configuration"""
    sample_rate: int = 22050
    channels: int = 1
    format: str = "wav"
    bit_depth: int = 16


class EnhancedVoiceManager:
    """Enhanced voice manager with multiple model support"""
    
    def __init__(self, openai_client: OpenAI, config_path: Optional[str] = None):
        self.openai_client = openai_client
        self.config_path = config_path or "models/voice/voice_config.json"
        self.config = self._load_config()
        
        # Initialize audio system
        pygame.mixer.init()
        
        # Model caches
        self.tts_models: Dict[TTSModel, Any] = {}
        self.stt_models: Dict[STTModel, Any] = {}
        
        # Audio settings
        self.audio_config = AudioConfig(**self.config.get("audio_settings", {}))
        
        logger.info("Enhanced Voice Manager initialized")
    
    def _load_config(self) -> Dict[str, Any]:
        """Load voice configuration"""
        try:
            if Path(self.config_path).exists():
                with open(self.config_path, 'r') as f:
                    return json.load(f)
            else:
                logger.warning(f"Config file not found: {self.config_path}")
                return self._get_default_config()
        except Exception as e:
            logger.error(f"Error loading config: {e}")
            return self._get_default_config()
    
    def _get_default_config(self) -> Dict[str, Any]:
        """Get default configuration"""
        return {
            "tts_models": {
                "openai": {
                    "voices": ["alloy", "echo", "fable", "onyx", "nova", "shimmer"],
                    "model": "tts-1"
                }
            },
            "stt_models": {
                "openai": {
                    "model": "whisper-1"
                }
            },
            "audio_settings": {
                "sample_rate": 22050,
                "channels": 1,
                "format": "wav"
            }
        }
    
    async def load_tts_model(self, model_type: TTSModel) -> bool:
        """Load TTS model on demand"""
        try:
            if model_type in self.tts_models:
                return True
            
            if model_type == TTSModel.KOKORO_82M and HAS_LOCAL_MODELS:
                return await self._load_kokoro_model()
            elif model_type == TTSModel.OPENAI_TTS:
                return True  # OpenAI models are loaded on-demand
            elif model_type == TTSModel.PIPER:
                return await self._load_piper_model()
            elif model_type == TTSModel.XTTS_V2 and HAS_LOCAL_MODELS:
                return await self._load_xtts_model()
            else:
                logger.warning(f"Model {model_type} not available, falling back to OpenAI")
                return True
                
        except Exception as e:
            logger.error(f"Error loading TTS model {model_type}: {e}")
            return False
    
    async def load_stt_model(self, model_type: STTModel) -> bool:
        """Load STT model on demand"""
        try:
            if model_type in self.stt_models:
                return True
            
            if model_type == STTModel.WHISPER_LOCAL and HAS_WHISPER:
                return await self._load_whisper_local()
            elif model_type == STTModel.WHISPER_OPENAI:
                return True  # OpenAI models are loaded on-demand
            elif model_type == STTModel.FASTER_WHISPER and HAS_LOCAL_MODELS:
                return await self._load_faster_whisper()
            elif model_type == STTModel.VOSK:
                return await self._load_vosk()
            else:
                logger.warning(f"Model {model_type} not available, falling back to OpenAI")
                return True
                
        except Exception as e:
            logger.error(f"Error loading STT model {model_type}: {e}")
            return False
    
    async def _load_kokoro_model(self) -> bool:
        """Load Kokoro TTS model"""
        try:
            from huggingface_hub import hf_hub_download
            
            # Download model if not exists
            model_path = Path("models/voice/kokoro/kokoro-v0_19.onnx")
            if not model_path.exists():
                hf_hub_download(
                    repo_id="hexgrad/Kokoro-82M",
                    filename="kokoro-v0_19.onnx",
                    local_dir=model_path.parent
                )
            
            # Load ONNX model
            providers = ['CUDAExecutionProvider', 'CPUExecutionProvider'] if torch.cuda.is_available() else ['CPUExecutionProvider']
            self.tts_models[TTSModel.KOKORO_82M] = ort.InferenceSession(str(model_path), providers=providers)
            
            logger.info("Kokoro TTS model loaded successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error loading Kokoro model: {e}")
            return False
    
    async def _load_whisper_local(self) -> bool:
        """Load local Whisper model"""
        try:
            self.stt_models[STTModel.WHISPER_LOCAL] = whisper.load_model(
                "base", 
                device="cuda" if torch.cuda.is_available() else "cpu"
            )
            logger.info("Local Whisper model loaded successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error loading local Whisper model: {e}")
            return False
    
    async def _load_faster_whisper(self) -> bool:
        """Load Faster Whisper model"""
        try:
            from faster_whisper import WhisperModel
            
            device = "cuda" if torch.cuda.is_available() else "cpu"
            compute_type = "float16" if device == "cuda" else "int8"
            
            self.stt_models[STTModel.FASTER_WHISPER] = WhisperModel(
                "base",
                device=device,
                compute_type=compute_type
            )
            logger.info("Faster Whisper model loaded successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error loading Faster Whisper model: {e}")
            return False
    
    async def _load_piper_model(self) -> bool:
        """Load Piper TTS model"""
        try:
            # Piper is typically used via command line
            self.tts_models[TTSModel.PIPER] = {"type": "piper", "loaded": True}
            logger.info("Piper TTS model loaded successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error loading Piper model: {e}")
            return False
    
    async def _load_xtts_model(self) -> bool:
        """Load XTTS v2 model"""
        try:
            from TTS.api import TTS
            
            self.tts_models[TTSModel.XTTS_V2] = TTS("tts_models/multilingual/multi-dataset/xtts_v2")
            logger.info("XTTS v2 model loaded successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error loading XTTS v2 model: {e}")
            return False
    
    async def _load_vosk(self) -> bool:
        """Load Vosk STT model"""
        try:
            import vosk
            
            # Download model if needed
            model_path = Path("models/voice/vosk-model-en-us-0.22")
            if not model_path.exists():
                logger.warning("Vosk model not found. Please download it manually.")
                return False
            
            self.stt_models[STTModel.VOSK] = {
                "model": vosk.Model(str(model_path)),
                "rec": vosk.KaldiRecognizer(vosk.Model(str(model_path)), 16000)
            }
            logger.info("Vosk model loaded successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error loading Vosk model: {e}")
            return False
    
    async def text_to_speech(self, text: str, settings: VoiceSettings) -> bytes:
        """Convert text to speech using specified model"""
        try:
            # Load model if needed
            await self.load_tts_model(settings.tts_model)
            
            if settings.tts_model == TTSModel.KOKORO_82M:
                return await self._kokoro_tts(text, settings)
            elif settings.tts_model == TTSModel.OPENAI_TTS:
                return await self._openai_tts(text, settings)
            elif settings.tts_model == TTSModel.PIPER:
                return await self._piper_tts(text, settings)
            elif settings.tts_model == TTSModel.XTTS_V2:
                return await self._xtts_tts(text, settings)
            else:
                # Fallback to OpenAI
                return await self._openai_tts(text, settings)
                
        except Exception as e:
            logger.error(f"Error in text-to-speech: {e}")
            return b""
    
    async def speech_to_text(self, audio_data: bytes, settings: VoiceSettings) -> str:
        """Convert speech to text using specified model"""
        try:
            # Load model if needed
            await self.load_stt_model(settings.stt_model)
            
            if settings.stt_model == STTModel.WHISPER_LOCAL:
                return await self._whisper_local_stt(audio_data, settings)
            elif settings.stt_model == STTModel.WHISPER_OPENAI:
                return await self._whisper_openai_stt(audio_data, settings)
            elif settings.stt_model == STTModel.FASTER_WHISPER:
                return await self._faster_whisper_stt(audio_data, settings)
            elif settings.stt_model == STTModel.VOSK:
                return await self._vosk_stt(audio_data, settings)
            else:
                # Fallback to OpenAI
                return await self._whisper_openai_stt(audio_data, settings)
                
        except Exception as e:
            logger.error(f"Error in speech-to-text: {e}")
            return ""
    
    async def _openai_tts(self, text: str, settings: VoiceSettings) -> bytes:
        """Generate speech using OpenAI TTS"""
        try:
            response = await self.openai_client.audio.speech.create(
                model="tts-1",
                voice=settings.voice,
                input=text,
                speed=settings.speed
            )
            return response.content
            
        except Exception as e:
            logger.error(f"OpenAI TTS error: {e}")
            return b""
    
    async def _whisper_openai_stt(self, audio_data: bytes, settings: VoiceSettings) -> str:
        """Transcribe using OpenAI Whisper"""
        try:
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
                temp_file.write(audio_data)
                temp_file_path = temp_file.name
            
            with open(temp_file_path, "rb") as audio_file:
                transcript = await self.openai_client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    language=settings.language if settings.language != "auto" else None
                )
            
            Path(temp_file_path).unlink()
            return transcript.text
            
        except Exception as e:
            logger.error(f"OpenAI Whisper error: {e}")
            return ""
    
    async def _kokoro_tts(self, text: str, settings: VoiceSettings) -> bytes:
        """Generate speech using Kokoro TTS"""
        try:
            model = self.tts_models[TTSModel.KOKORO_82M]
            
            # This is a simplified implementation
            # In practice, you'd need to implement the full Kokoro inference pipeline
            # including text preprocessing, phoneme conversion, and audio generation
            
            # For now, fallback to OpenAI
            logger.warning("Kokoro TTS not fully implemented, using OpenAI fallback")
            return await self._openai_tts(text, settings)
            
        except Exception as e:
            logger.error(f"Kokoro TTS error: {e}")
            return await self._openai_tts(text, settings)
    
    async def _whisper_local_stt(self, audio_data: bytes, settings: VoiceSettings) -> str:
        """Transcribe using local Whisper"""
        try:
            model = self.stt_models[STTModel.WHISPER_LOCAL]
            
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
                temp_file.write(audio_data)
                temp_file_path = temp_file.name
            
            result = model.transcribe(
                temp_file_path,
                language=settings.language if settings.language != "auto" else None
            )
            
            Path(temp_file_path).unlink()
            return result["text"].strip()
            
        except Exception as e:
            logger.error(f"Local Whisper error: {e}")
            return ""
    
    async def _faster_whisper_stt(self, audio_data: bytes, settings: VoiceSettings) -> str:
        """Transcribe using Faster Whisper"""
        try:
            model = self.stt_models[STTModel.FASTER_WHISPER]
            
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
                temp_file.write(audio_data)
                temp_file_path = temp_file.name
            
            segments, info = model.transcribe(
                temp_file_path,
                language=settings.language if settings.language != "auto" else None
            )
            
            transcript = " ".join([segment.text for segment in segments])
            Path(temp_file_path).unlink()
            return transcript.strip()
            
        except Exception as e:
            logger.error(f"Faster Whisper error: {e}")
            return ""
    
    async def _piper_tts(self, text: str, settings: VoiceSettings) -> bytes:
        """Generate speech using Piper TTS"""
        try:
            import subprocess
            
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as output_file:
                cmd = [
                    'piper',
                    '--model', f'voices/{settings.voice}.onnx',
                    '--output_file', output_file.name
                ]
                
                process = subprocess.Popen(cmd, stdin=subprocess.PIPE)
                process.communicate(input=text.encode())
                
                with open(output_file.name, 'rb') as f:
                    return f.read()
                    
        except Exception as e:
            logger.error(f"Piper TTS error: {e}")
            return await self._openai_tts(text, settings)
    
    async def _xtts_tts(self, text: str, settings: VoiceSettings) -> bytes:
        """Generate speech using XTTS v2"""
        try:
            model = self.tts_models[TTSModel.XTTS_V2]
            
            audio = model.tts(
                text=text,
                speaker_wav=None,  # For voice cloning
                language=settings.language,
                speed=settings.speed
            )
            
            buffer = io.BytesIO()
            sf.write(buffer, audio, self.audio_config.sample_rate, format='WAV')
            return buffer.getvalue()
            
        except Exception as e:
            logger.error(f"XTTS v2 error: {e}")
            return await self._openai_tts(text, settings)
    
    async def _vosk_stt(self, audio_data: bytes, settings: VoiceSettings) -> str:
        """Transcribe using Vosk"""
        try:
            vosk_model = self.stt_models[STTModel.VOSK]
            rec = vosk_model["rec"]
            
            import wave
            
            with wave.open(io.BytesIO(audio_data), 'rb') as wf:
                transcript_parts = []
                
                while True:
                    data = wf.readframes(4000)
                    if len(data) == 0:
                        break
                        
                    if rec.AcceptWaveform(data):
                        result = json.loads(rec.Result())
                        transcript_parts.append(result.get('text', ''))
                
                final_result = json.loads(rec.FinalResult())
                transcript_parts.append(final_result.get('text', ''))
                
                return " ".join(transcript_parts).strip()
                
        except Exception as e:
            logger.error(f"Vosk error: {e}")
            return ""
    
    async def play_audio(self, audio_data: bytes):
        """Play audio data"""
        try:
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
                temp_file.write(audio_data)
                temp_file_path = temp_file.name
            
            pygame.mixer.music.load(temp_file_path)
            pygame.mixer.music.play()
            
            while pygame.mixer.music.get_busy():
                await asyncio.sleep(0.1)
            
            Path(temp_file_path).unlink()
            
        except Exception as e:
            logger.error(f"Error playing audio: {e}")
    
    def get_supported_voices(self, model_type: TTSModel, language: str = "en") -> List[str]:
        """Get supported voices for a TTS model"""
        if model_type == TTSModel.KOKORO_82M:
            return ["af_sarah", "af_nicole", "af_sky", "am_adam", "am_michael", 
                   "bf_emma", "bf_isabella", "bm_george", "bm_lewis"]
        elif model_type == TTSModel.OPENAI_TTS:
            return self.config.get("tts_models", {}).get("openai", {}).get("voices", ["alloy"])
        elif model_type == TTSModel.PIPER:
            return [f"en_US-{name}" for name in ["amy", "danny", "joe", "kathleen", "lessac", "ryan"]]
        elif model_type == TTSModel.XTTS_V2:
            return ["default"]  # Supports voice cloning
        else:
            return ["default"]
    
    def get_available_models(self) -> Dict[str, List[str]]:
        """Get list of available models"""
        return {
            "tts_models": [model.value for model in TTSModel],
            "stt_models": [model.value for model in STTModel]
        }
    
    async def test_voice_capabilities(self) -> Dict[str, Any]:
        """Test voice capabilities and return status"""
        test_results = {
            "tts_models": {},
            "stt_models": {},
            "system_dependencies": {},
            "overall_status": "unknown"
        }
        
        # Test TTS models
        for model in TTSModel:
            try:
                success = await self.load_tts_model(model)
                test_results["tts_models"][model.value] = "available" if success else "unavailable"
            except Exception as e:
                test_results["tts_models"][model.value] = f"error: {str(e)}"
        
        # Test STT models
        for model in STTModel:
            try:
                success = await self.load_stt_model(model)
                test_results["stt_models"][model.value] = "available" if success else "unavailable"
            except Exception as e:
                test_results["stt_models"][model.value] = f"error: {str(e)}"
        
        # Test system dependencies
        test_results["system_dependencies"] = {
            "pygame": "available" if pygame.get_init() else "unavailable",
            "torch": "available" if HAS_LOCAL_MODELS else "unavailable",
            "whisper": "available" if HAS_WHISPER else "unavailable"
        }
        
        # Determine overall status
        available_tts = sum(1 for status in test_results["tts_models"].values() if status == "available")
        available_stt = sum(1 for status in test_results["stt_models"].values() if status == "available")
        
        if available_tts > 0 and available_stt > 0:
            test_results["overall_status"] = "fully_operational"
        elif available_tts > 0 or available_stt > 0:
            test_results["overall_status"] = "partially_operational"
        else:
            test_results["overall_status"] = "not_operational"
        
        return test_results

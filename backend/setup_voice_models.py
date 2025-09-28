#!/usr/bin/env python3
"""
Voice Model Setup Script for Buffr Host AI Receptionist

This script sets up the necessary voice models and dependencies for the AI receptionist.
It handles both local TTS/STT models and cloud-based alternatives.
"""

import logging
import os
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)


class VoiceModelSetup:
    """Setup voice models for AI receptionist"""

    def __init__(self, models_dir: str = "models/voice"):
        self.models_dir = Path(models_dir)
        self.models_dir.mkdir(parents=True, exist_ok=True)

    def install_system_dependencies(self) -> bool:
        """Install system-level dependencies"""
        try:
            # Install espeak-ng for phonemizer
            subprocess.run(
                ["sudo", "apt-get", "update"], check=True, capture_output=True
            )

            subprocess.run(
                ["sudo", "apt-get", "install", "-y", "espeak-ng", "ffmpeg"],
                check=True,
                capture_output=True,
            )

            logger.info("System dependencies installed successfully")
            return True

        except subprocess.CalledProcessError as e:
            logger.error(f"Failed to install system dependencies: {e}")
            return False
        except FileNotFoundError:
            logger.warning(
                "apt-get not found. Please install espeak-ng and ffmpeg manually."
            )
            return False

    def install_python_dependencies(self) -> bool:
        """Install Python dependencies for voice models"""
        try:
            # Core voice dependencies
            dependencies = [
                "torch>=2.0.0",
                "transformers>=4.30.0",
                "scipy>=1.10.0",
                "munch>=2.5.0",
                "phonemizer>=3.2.0",
                "soundfile>=0.12.0",
                "librosa>=0.10.0",
                "numpy>=1.24.0",
                "onnxruntime>=1.15.0",
                "huggingface-hub>=0.16.0",
            ]

            for dep in dependencies:
                subprocess.run(
                    [sys.executable, "-m", "pip", "install", dep],
                    check=True,
                    capture_output=True,
                )

            logger.info("Python voice dependencies installed successfully")
            return True

        except subprocess.CalledProcessError as e:
            logger.error(f"Failed to install Python dependencies: {e}")
            return False

    def download_kokoro_model(self) -> bool:
        """Download Kokoro TTS model"""
        try:
            from huggingface_hub import hf_hub_download

            # Download Kokoro model files
            model_files = ["kokoro-v0_19.onnx", "kokoro-v0_19.pth", "config.json"]

            for file in model_files:
                try:
                    hf_hub_download(
                        repo_id="hexgrad/Kokoro-82M",
                        filename=file,
                        local_dir=self.models_dir / "kokoro",
                    )
                    logger.info(f"Downloaded {file}")
                except Exception as e:
                    logger.warning(f"Could not download {file}: {e}")

            return True

        except ImportError:
            logger.error("huggingface-hub not installed. Please install it first.")
            return False
        except Exception as e:
            logger.error(f"Failed to download Kokoro model: {e}")
            return False

    def download_whisper_model(self) -> bool:
        """Download Whisper STT model"""
        try:
            import whisper

            # Download Whisper model
            model = whisper.load_model(
                "base", download_root=self.models_dir / "whisper"
            )
            logger.info("Whisper model downloaded successfully")
            return True

        except ImportError:
            logger.error("openai-whisper not installed. Please install it first.")
            return False
        except Exception as e:
            logger.error(f"Failed to download Whisper model: {e}")
            return False

    def setup_voice_config(self) -> bool:
        """Create voice configuration file"""
        try:
            config = {
                "tts_models": {
                    "kokoro": {
                        "model_path": str(
                            self.models_dir / "kokoro" / "kokoro-v0_19.onnx"
                        ),
                        "voices": [
                            "af_sarah",
                            "af_nicole",
                            "af_sky",
                            "am_adam",
                            "am_michael",
                            "bf_emma",
                            "bf_isabella",
                            "bm_george",
                            "bm_lewis",
                        ],
                        "sample_rate": 22050,
                    },
                    "openai": {
                        "voices": ["alloy", "echo", "fable", "onyx", "nova", "shimmer"],
                        "model": "tts-1",
                    },
                },
                "stt_models": {
                    "whisper": {
                        "model_path": str(self.models_dir / "whisper"),
                        "model_size": "base",
                    },
                    "openai": {"model": "whisper-1"},
                },
                "audio_settings": {
                    "sample_rate": 22050,
                    "channels": 1,
                    "format": "wav",
                },
            }

            import json

            config_path = self.models_dir / "voice_config.json"
            with open(config_path, "w") as f:
                json.dump(config, f, indent=2)

            logger.info(f"Voice configuration saved to {config_path}")
            return True

        except Exception as e:
            logger.error(f"Failed to create voice config: {e}")
            return False

    def setup_all(self) -> bool:
        """Setup all voice models and dependencies"""
        logger.info("Starting voice model setup...")

        steps = [
            ("Installing system dependencies", self.install_system_dependencies),
            ("Installing Python dependencies", self.install_python_dependencies),
            ("Downloading Kokoro TTS model", self.download_kokoro_model),
            ("Downloading Whisper STT model", self.download_whisper_model),
            ("Creating voice configuration", self.setup_voice_config),
        ]

        for step_name, step_func in steps:
            logger.info(f"Step: {step_name}")
            if not step_func():
                logger.warning(f"Step failed: {step_name}")
                # Continue with other steps even if one fails

        logger.info("Voice model setup completed!")
        return True


def main():
    """Main setup function"""
    logging.basicConfig(level=logging.INFO)

    setup = VoiceModelSetup()
    setup.setup_all()


if __name__ == "__main__":
    main()

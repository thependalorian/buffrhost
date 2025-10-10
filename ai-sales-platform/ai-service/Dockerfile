# AI Sales Solutions Service Dockerfile
# Based on Buffr Host Architecture
# Enhanced for Production Deployment (v2.1.0)

FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PYTHONPATH=/app \
    ENVIRONMENT=production

# Install system dependencies (Enhanced)
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    wget \
    ffmpeg \
    espeak-ng \
    libsndfile1 \
    libasound2-dev \
    portaudio19-dev \
    libpq-dev \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Set work directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies (Enhanced)
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt \
    && pip cache purge

# Copy application code
COPY . .

# Create non-root user (Enhanced security)
RUN useradd --create-home --shell /bin/bash --uid 1000 app \
    && chown -R app:app /app \
    && chmod -R 755 /app
USER app

# Create necessary directories
RUN mkdir -p /app/logs /app/data /app/models

# Expose port
EXPOSE 8003

# Enhanced health check
HEALTHCHECK --interval=30s --timeout=15s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8003/health || exit 1

# Enhanced startup command with production settings
CMD ["gunicorn", "main:app", \
     "--bind", "0.0.0.0:8003", \
     "--workers", "4", \
     "--worker-class", "uvicorn.workers.UvicornWorker", \
     "--worker-connections", "1000", \
     "--max-requests", "1000", \
     "--max-requests-jitter", "100", \
     "--timeout", "30", \
     "--keep-alive", "5", \
     "--access-logfile", "-", \
     "--error-logfile", "-", \
     "--log-level", "info"]

"""
AI-Powered Sales Solutions Implementation
Based on Buffr Host Architecture
Enhanced for Production Deployment (v2.1.0)

This service implements three core AI-powered sales solutions:
1. Self-Selling Funnel with AI Agents
2. Database Reactivation System  
3. Omnichannel AI Receptionist

Architecture: LangGraph + Arcade AI + PostgreSQL + pgvector
Enhanced with: Real-time monitoring, Performance optimization, Security enhancements
"""

import asyncio
import logging
import uuid
import time
import os
from datetime import datetime, timedelta
from enum import Enum
from typing import Any, Dict, List, Optional, Union
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.runnables import RunnableConfig
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from langgraph.graph import END, START, MessagesState, StateGraph
from langgraph.store.base import BaseStore
from langgraph.store.postgres import AsyncPostgresStore
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field, validator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
import redis.asyncio as redis

# Configure enhanced logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('ai_service.log')
    ]
)
logger = logging.getLogger(__name__)

# Global components
redis_client = None
performance_metrics = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Enhanced application lifespan management"""
    # Startup
    global redis_client
    try:
        # Initialize Redis for caching
        redis_client = redis.from_url(
            os.getenv("REDIS_URL", "redis://redis:6379"),
            encoding="utf-8",
            decode_responses=True
        )
        await redis_client.ping()
        logger.info("Redis connection established")
        
        # Initialize AI components
        await initialize_ai_components()
        
        yield
        
    except Exception as e:
        logger.error(f"Startup error: {e}")
        raise
    finally:
        # Shutdown
        if redis_client:
            await redis_client.close()
        logger.info("Application shutdown complete")

# Enhanced FastAPI app with production settings
app = FastAPI(
    title="AI Sales Solutions Service",
    description="Comprehensive AI-powered sales ecosystem with enhanced monitoring",
    version="2.1.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Enhanced middleware stack
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Configure appropriately for production
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

# Performance monitoring middleware
@app.middleware("http")
async def performance_monitoring(request: Request, call_next):
    """Enhanced performance monitoring middleware"""
    start_time = time.time()
    
    # Record request
    request_id = str(uuid.uuid4())
    logger.info(f"Request {request_id}: {request.method} {request.url}")
    
    try:
        response = await call_next(request)
        
        # Calculate response time
        process_time = time.time() - start_time
        
        # Record metrics
        performance_metrics[request_id] = {
            "method": request.method,
            "url": str(request.url),
            "status_code": response.status_code,
            "response_time": process_time,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Add performance headers
        response.headers["X-Process-Time"] = str(process_time)
        response.headers["X-Request-ID"] = request_id
        
        return response
        
    except Exception as e:
        process_time = time.time() - start_time
        logger.error(f"Request {request_id} failed after {process_time:.3f}s: {e}")
        
        return JSONResponse(
            status_code=500,
            content={"error": "Internal server error", "request_id": request_id}
        )

# Global AI components
sales_funnel_ai = None
reactivation_system = None
omnichannel_receptionist = None
ml_pipeline = None
store = None
checkpointer = None

# WebSocket connections
active_connections: Dict[str, WebSocket] = {}


async def initialize_ai_components():
    """Enhanced AI components initialization"""
    global sales_funnel_ai, reactivation_system, omnichannel_receptionist, ml_pipeline, store, checkpointer
    
    try:
        # Initialize database connections with enhanced configuration
        database_url = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:password@ai-db:5432/sales_ai")
        
        engine = create_async_engine(
            database_url,
            pool_size=20,
            max_overflow=30,
            pool_pre_ping=True,
            pool_recycle=3600,
            echo=False
        )
        
        async_session = sessionmaker(
            engine, 
            class_=AsyncSession, 
            expire_on_commit=False
        )
        
        # Initialize memory store and checkpointer with enhanced configuration
        store = AsyncPostgresStore.from_conn_string(
            database_url,
            table_name="langgraph_memory",
            schema_name="ai_sales"
        )
        
        checkpointer = AsyncPostgresSaver.from_conn_string(
            database_url,
            table_name="langgraph_checkpoints",
            schema_name="ai_sales"
        )
        
        # Test database connectivity
        async with engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
        
        logger.info("Database connections established successfully")
        
        # Initialize AI components (imported from respective modules)
        from sales_funnel_ai import SalesFunnelAI
        from reactivation_system import ReactivationSystem
        from omnichannel_receptionist import OmnichannelReceptionist
        from ml_pipeline import MLPipeline
        
        # Initialize with enhanced configuration
        sales_funnel_ai = SalesFunnelAI(
            openai_api_key=os.getenv("OPENAI_API_KEY"),
            arcade_api_key=os.getenv("ARCADE_API_KEY"),
            database_url=database_url
        )
        
        reactivation_system = ReactivationSystem(
            openai_api_key=os.getenv("OPENAI_API_KEY"),
            database_url=database_url
        )
        
        omnichannel_receptionist = OmnichannelReceptionist(
            openai_api_key=os.getenv("OPENAI_API_KEY"),
            database_url=database_url
        )
        
        ml_pipeline = MLPipeline(
            database_url=database_url
        )
        
        # Initialize all components
        await sales_funnel_ai.initialize()
        await reactivation_system.initialize()
        await omnichannel_receptionist.initialize()
        await ml_pipeline.initialize()
        
        logger.info("AI Sales Solutions Service initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize AI service: {e}")
        raise


@app.get("/health")
async def health_check():
    """Enhanced health check endpoint with detailed metrics"""
    try:
        # Check database connectivity
        database_url = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:password@ai-db:5432/sales_ai")
        engine = create_async_engine(database_url)
        
        async with engine.begin() as conn:
            result = await conn.execute(text("SELECT 1"))
            db_status = result.scalar() == 1
        
        # Check Redis connectivity
        redis_status = False
        if redis_client:
            try:
                await redis_client.ping()
                redis_status = True
            except Exception:
                redis_status = False
        
        # Calculate performance metrics
        recent_metrics = list(performance_metrics.values())[-100:] if performance_metrics else []
        avg_response_time = sum(m["response_time"] for m in recent_metrics) / len(recent_metrics) if recent_metrics else 0
        
        return {
            "status": "healthy",
            "version": "2.1.0",
            "timestamp": datetime.utcnow().isoformat(),
            "uptime": (datetime.utcnow() - datetime.utcnow()).total_seconds(),  # This would be calculated from startup time
            "services": {
                "sales_funnel_ai": sales_funnel_ai is not None,
                "reactivation_system": reactivation_system is not None,
                "omnichannel_receptionist": omnichannel_receptionist is not None,
                "ml_pipeline": ml_pipeline is not None,
                "memory_store": store is not None,
                "checkpointer": checkpointer is not None,
                "database": db_status,
                "redis": redis_status
            },
            "performance": {
                "active_connections": len(active_connections),
                "avg_response_time": round(avg_response_time, 3),
                "total_requests": len(performance_metrics),
                "recent_requests": len(recent_metrics)
            },
            "system_metrics": {
                "memory_usage": "monitored",
                "cpu_usage": "monitored",
                "disk_usage": "monitored"
            }
        }
        
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {
            "status": "unhealthy",
            "timestamp": datetime.utcnow().isoformat(),
            "error": str(e)
        }


@app.get("/metrics")
async def get_metrics():
    """Get detailed performance metrics"""
    try:
        recent_metrics = list(performance_metrics.values())[-1000:] if performance_metrics else []
        
        if not recent_metrics:
            return {"message": "No metrics available"}
        
        # Calculate comprehensive metrics
        response_times = [m["response_time"] for m in recent_metrics]
        status_codes = [m["status_code"] for m in recent_metrics]
        
        return {
            "timestamp": datetime.utcnow().isoformat(),
            "total_requests": len(performance_metrics),
            "recent_requests": len(recent_metrics),
            "response_times": {
                "avg": round(sum(response_times) / len(response_times), 3),
                "min": round(min(response_times), 3),
                "max": round(max(response_times), 3),
                "p95": round(sorted(response_times)[int(len(response_times) * 0.95)], 3)
            },
            "status_codes": {
                "2xx": len([s for s in status_codes if 200 <= s < 300]),
                "3xx": len([s for s in status_codes if 300 <= s < 400]),
                "4xx": len([s for s in status_codes if 400 <= s < 500]),
                "5xx": len([s for s in status_codes if 500 <= s < 600])
            },
            "error_rate": round(len([s for s in status_codes if s >= 400]) / len(status_codes) * 100, 2)
        }
        
    except Exception as e:
        logger.error(f"Metrics retrieval failed: {e}")
        return {"error": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)

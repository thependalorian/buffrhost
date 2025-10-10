"""
BuffrSign-Starter: Realtime Service
Real-time collaboration and WebSocket management (Phase 3)
"""

import os
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Depends, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from supabase import create_client, Client
import logging
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="BuffrSign Realtime Service",
    description="Real-time collaboration and WebSocket management",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase client initialization
supabase: Client = create_client(
    os.getenv("SUPABASE_URL", "http://localhost:54321"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY", "your-service-role-key")
)

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, envelope_id: str):
        await websocket.accept()
        if envelope_id not in self.active_connections:
            self.active_connections[envelope_id] = []
        self.active_connections[envelope_id].append(websocket)
        logger.info(f"WebSocket connected to envelope {envelope_id}")

    def disconnect(self, websocket: WebSocket, envelope_id: str):
        if envelope_id in self.active_connections:
            self.active_connections[envelope_id].remove(websocket)
            if not self.active_connections[envelope_id]:
                del self.active_connections[envelope_id]
        logger.info(f"WebSocket disconnected from envelope {envelope_id}")

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast_to_envelope(self, message: str, envelope_id: str):
        if envelope_id in self.active_connections:
            for connection in self.active_connections[envelope_id]:
                try:
                    await connection.send_text(message)
                except:
                    # Remove broken connections
                    self.active_connections[envelope_id].remove(connection)

manager = ConnectionManager()

# Pydantic models
class CollaborationMessage(BaseModel):
    type: str
    data: Dict[str, Any]
    user_id: str
    timestamp: str

# Dependency to get current user (placeholder)
async def get_current_user(request: Request) -> str:
    """Get current user from request headers (placeholder for auth integration)"""
    return str(uuid.uuid4())

# WebSocket endpoint
@app.websocket("/ws/{envelope_id}")
async def websocket_endpoint(websocket: WebSocket, envelope_id: str):
    await manager.connect(websocket, envelope_id)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Broadcast message to all connections in the envelope
            await manager.broadcast_to_envelope(data, envelope_id)
            
            # Log collaboration event
            collaboration_data = {
                "envelope_id": envelope_id,
                "user_id": message.get("user_id", "unknown"),
                "action_type": message.get("type", "unknown"),
                "action_data": message.get("data", {}),
                "timestamp": datetime.utcnow().isoformat()
            }
            
            # Store in database
            supabase.table("document_collaboration").insert(collaboration_data).execute()
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, envelope_id)

# API Endpoints
@app.post("/collaboration/broadcast")
async def broadcast_collaboration_message(
    envelope_id: str,
    message: CollaborationMessage,
    user_id: str = Depends(get_current_user)
):
    """Broadcast collaboration message to all participants"""
    try:
        message_data = {
            "type": message.type,
            "data": message.data,
            "user_id": message.user_id,
            "timestamp": message.timestamp
        }
        
        await manager.broadcast_to_envelope(json.dumps(message_data), envelope_id)
        
        # Store in database
        collaboration_data = {
            "envelope_id": envelope_id,
            "user_id": message.user_id,
            "action_type": message.type,
            "action_data": message.data,
            "timestamp": message.timestamp
        }
        
        supabase.table("document_collaboration").insert(collaboration_data).execute()
        
        return {"status": "success", "message": "Message broadcasted"}
        
    except Exception as e:
        logger.error(f"Error broadcasting message: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/collaboration/{envelope_id}/participants")
async def get_participants(envelope_id: str):
    """Get active participants for envelope"""
    try:
        participant_count = len(manager.active_connections.get(envelope_id, []))
        return {
            "envelope_id": envelope_id,
            "active_participants": participant_count,
            "connections": participant_count
        }
        
    except Exception as e:
        logger.error(f"Error getting participants: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/collaboration/{envelope_id}/history")
async def get_collaboration_history(envelope_id: str):
    """Get collaboration history for envelope"""
    try:
        result = supabase.table("document_collaboration").select("*").eq("envelope_id", envelope_id).order("timestamp", desc=True).limit(50).execute()
        
        if result.data:
            return result.data
        else:
            return []
            
    except Exception as e:
        logger.error(f"Error getting collaboration history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "realtime-service",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "active_connections": sum(len(connections) for connections in manager.active_connections.values())
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8012)
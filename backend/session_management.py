"""
SESSION MANAGEMENT SYSTEM
Advanced session and user state management for Buffr Host
"""

from typing import Dict, List, Optional, Any, Union
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass, field
from sqlalchemy import Column, Integer, String, DateTime, JSON, Boolean, ForeignKey, Text, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import json
import uuid
import hashlib
import secrets
import asyncio
from cryptography.fernet import Fernet
import redis
import pickle

Base = declarative_base()

class SessionStatus(Enum):
    """Session status"""
    ACTIVE = "active"
    EXPIRED = "expired"
    TERMINATED = "terminated"
    SUSPENDED = "suspended"

class SessionType(Enum):
    """Session types"""
    WEB = "web"
    MOBILE = "mobile"
    API = "api"
    ADMIN = "admin"
    GUEST = "guest"

class DeviceType(Enum):
    """Device types for sessions"""
    DESKTOP = "desktop"
    MOBILE = "mobile"
    TABLET = "tablet"
    UNKNOWN = "unknown"

@dataclass
class SessionData:
    """Session data structure"""
    user_id: str
    session_type: SessionType
    device_info: Dict[str, Any] = field(default_factory=dict)
    ip_address: str = ""
    user_agent: str = ""
    location: Optional[Dict[str, Any]] = None
    permissions: List[str] = field(default_factory=list)
    preferences: Dict[str, Any] = field(default_factory=dict)
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class SessionActivity:
    """Session activity log"""
    action: str
    resource: str
    timestamp: datetime
    ip_address: str
    user_agent: str
    metadata: Dict[str, Any] = field(default_factory=dict)

class Session(Base):
    """Session model"""
    __tablename__ = 'sessions'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_token = Column(String(255), unique=True, nullable=False)
    user_id = Column(String(255), nullable=False)
    session_type = Column(String(50), nullable=False)
    status = Column(String(50), default=SessionStatus.ACTIVE.value)
    
    # Session data
    data = Column(JSON)  # SessionData object
    
    # Device and network info
    device_type = Column(String(50))
    device_id = Column(String(255))
    ip_address = Column(String(45))  # IPv6 compatible
    user_agent = Column(Text)
    location = Column(JSON)
    
    # Security
    is_secure = Column(Boolean, default=False)
    is_http_only = Column(Boolean, default=True)
    same_site = Column(String(20), default="Lax")
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    last_activity = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    
    # Relationships
    activities = relationship("SessionActivity", back_populates="session")

class SessionActivity(Base):
    """Session activity model"""
    __tablename__ = 'session_activities'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String, ForeignKey('sessions.id'))
    action = Column(String(100), nullable=False)
    resource = Column(String(255), nullable=False)
    ip_address = Column(String(45))
    user_agent = Column(Text)
    metadata = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    session = relationship("Session", back_populates="activities")

class SessionManager:
    """Advanced session management system"""
    
    def __init__(self, db_session, redis_client: redis.Redis = None, 
                 encryption_key: str = None, session_timeout: int = 1800):
        self.db = db_session
        self.redis = redis_client
        self.encryption_key = encryption_key or Fernet.generate_key()
        self.cipher = Fernet(self.encryption_key)
        self.session_timeout = session_timeout  # 30 minutes default
        self.session_cache: Dict[str, Session] = {}
        self.cleanup_task = None
        self._start_cleanup_task()
    
    def _start_cleanup_task(self):
        """Start background cleanup task"""
        if not self.cleanup_task:
            self.cleanup_task = asyncio.create_task(self._cleanup_expired_sessions())
    
    async def _cleanup_expired_sessions(self):
        """Background task to clean up expired sessions"""
        while True:
            try:
                await asyncio.sleep(300)  # Run every 5 minutes
                await self.cleanup_expired_sessions()
            except Exception as e:
                print(f"Session cleanup error: {e}")
    
    async def create_session(self, user_id: str, session_type: SessionType,
                           device_info: Dict[str, Any] = None,
                           ip_address: str = "", user_agent: str = "",
                           location: Dict[str, Any] = None,
                           permissions: List[str] = None,
                           preferences: Dict[str, Any] = None,
                           metadata: Dict[str, Any] = None,
                           expires_in: int = None) -> Session:
        """Create a new session"""
        try:
            # Generate session token
            session_token = self._generate_session_token()
            
            # Calculate expiration time
            expires_in = expires_in or self.session_timeout
            expires_at = datetime.utcnow() + timedelta(seconds=expires_in)
            
            # Create session data
            session_data = SessionData(
                user_id=user_id,
                session_type=session_type,
                device_info=device_info or {},
                ip_address=ip_address,
                user_agent=user_agent,
                location=location,
                permissions=permissions or [],
                preferences=preferences or {},
                metadata=metadata or {}
            )
            
            # Detect device type
            device_type = self._detect_device_type(user_agent)
            
            # Create session
            session = Session(
                session_token=session_token,
                user_id=user_id,
                session_type=session_type.value,
                data=session_data.__dict__,
                device_type=device_type.value,
                ip_address=ip_address,
                user_agent=user_agent,
                location=location,
                expires_at=expires_at
            )
            
            self.db.add(session)
            await self.db.commit()
            await self.db.refresh(session)
            
            # Cache session
            self.session_cache[session_token] = session
            
            # Store in Redis if available
            if self.redis:
                await self._store_session_in_redis(session)
            
            return session
        except Exception as e:
            await self.db.rollback()
            raise Exception(f"Failed to create session: {str(e)}")
    
    def _generate_session_token(self) -> str:
        """Generate secure session token"""
        return secrets.token_urlsafe(32)
    
    def _detect_device_type(self, user_agent: str) -> DeviceType:
        """Detect device type from user agent"""
        if not user_agent:
            return DeviceType.UNKNOWN
        
        user_agent_lower = user_agent.lower()
        
        if any(mobile in user_agent_lower for mobile in ['mobile', 'android', 'iphone']):
            return DeviceType.MOBILE
        elif any(tablet in user_agent_lower for tablet in ['tablet', 'ipad']):
            return DeviceType.TABLET
        else:
            return DeviceType.DESKTOP
    
    async def _store_session_in_redis(self, session: Session):
        """Store session in Redis cache"""
        try:
            if self.redis:
                session_data = {
                    'id': session.id,
                    'user_id': session.user_id,
                    'session_type': session.session_type,
                    'status': session.status,
                    'data': session.data,
                    'device_type': session.device_type,
                    'ip_address': session.ip_address,
                    'user_agent': session.user_agent,
                    'location': session.location,
                    'created_at': session.created_at.isoformat(),
                    'last_activity': session.last_activity.isoformat(),
                    'expires_at': session.expires_at.isoformat()
                }
                
                # Encrypt sensitive data
                encrypted_data = self.cipher.encrypt(json.dumps(session_data).encode())
                
                # Store with expiration
                ttl = int((session.expires_at - datetime.utcnow()).total_seconds())
                self.redis.setex(
                    f"session:{session.session_token}",
                    ttl,
                    encrypted_data
                )
        except Exception as e:
            print(f"Error storing session in Redis: {e}")
    
    async def get_session(self, session_token: str) -> Optional[Session]:
        """Get session by token"""
        try:
            # Check cache first
            if session_token in self.session_cache:
                session = self.session_cache[session_token]
                if session.status == SessionStatus.ACTIVE.value and session.expires_at > datetime.utcnow():
                    return session
                else:
                    del self.session_cache[session_token]
                    return None
            
            # Check Redis cache
            if self.redis:
                cached_data = self.redis.get(f"session:{session_token}")
                if cached_data:
                    try:
                        decrypted_data = self.cipher.decrypt(cached_data)
                        session_data = json.loads(decrypted_data.decode())
                        
                        # Create session object from cached data
                        session = Session(
                            id=session_data['id'],
                            session_token=session_token,
                            user_id=session_data['user_id'],
                            session_type=session_data['session_type'],
                            status=session_data['status'],
                            data=session_data['data'],
                            device_type=session_data['device_type'],
                            ip_address=session_data['ip_address'],
                            user_agent=session_data['user_agent'],
                            location=session_data['location'],
                            created_at=datetime.fromisoformat(session_data['created_at']),
                            last_activity=datetime.fromisoformat(session_data['last_activity']),
                            expires_at=datetime.fromisoformat(session_data['expires_at'])
                        )
                        
                        # Cache in memory
                        self.session_cache[session_token] = session
                        return session
                    except Exception:
                        pass
            
            # Check database
            session = await self.db.query(Session).filter(
                Session.session_token == session_token
            ).first()
            
            if session and session.status == SessionStatus.ACTIVE.value and session.expires_at > datetime.utcnow():
                self.session_cache[session_token] = session
                return session
            
            return None
        except Exception:
            return None
    
    async def update_session_activity(self, session_token: str, action: str,
                                    resource: str, ip_address: str = "",
                                    user_agent: str = "", metadata: Dict[str, Any] = None) -> bool:
        """Update session activity"""
        try:
            session = await self.get_session(session_token)
            if not session:
                return False
            
            # Update last activity
            session.last_activity = datetime.utcnow()
            await self.db.commit()
            
            # Log activity
            activity = SessionActivity(
                session_id=session.id,
                action=action,
                resource=resource,
                ip_address=ip_address,
                user_agent=user_agent,
                metadata=metadata or {}
            )
            
            self.db.add(activity)
            await self.db.commit()
            
            # Update Redis cache
            if self.redis:
                await self._store_session_in_redis(session)
            
            return True
        except Exception:
            return False
    
    async def extend_session(self, session_token: str, extend_by: int = None) -> bool:
        """Extend session expiration"""
        try:
            session = await self.get_session(session_token)
            if not session:
                return False
            
            extend_by = extend_by or self.session_timeout
            session.expires_at = datetime.utcnow() + timedelta(seconds=extend_by)
            session.last_activity = datetime.utcnow()
            
            await self.db.commit()
            
            # Update Redis cache
            if self.redis:
                await self._store_session_in_redis(session)
            
            return True
        except Exception:
            return False
    
    async def terminate_session(self, session_token: str, reason: str = "manual") -> bool:
        """Terminate a session"""
        try:
            session = await self.get_session(session_token)
            if not session:
                return False
            
            session.status = SessionStatus.TERMINATED.value
            await self.db.commit()
            
            # Remove from cache
            if session_token in self.session_cache:
                del self.session_cache[session_token]
            
            # Remove from Redis
            if self.redis:
                self.redis.delete(f"session:{session_token}")
            
            return True
        except Exception:
            return False
    
    async def terminate_user_sessions(self, user_id: str, exclude_token: str = None) -> int:
        """Terminate all sessions for a user"""
        try:
            query = self.db.query(Session).filter(
                Session.user_id == user_id,
                Session.status == SessionStatus.ACTIVE.value
            )
            
            if exclude_token:
                query = query.filter(Session.session_token != exclude_token)
            
            sessions = await query.all()
            count = 0
            
            for session in sessions:
                session.status = SessionStatus.TERMINATED.value
                count += 1
                
                # Remove from cache
                if session.session_token in self.session_cache:
                    del self.session_cache[session.session_token]
                
                # Remove from Redis
                if self.redis:
                    self.redis.delete(f"session:{session.session_token}")
            
            await self.db.commit()
            return count
        except Exception:
            return 0
    
    async def suspend_session(self, session_token: str, reason: str = "security") -> bool:
        """Suspend a session"""
        try:
            session = await self.get_session(session_token)
            if not session:
                return False
            
            session.status = SessionStatus.SUSPENDED.value
            await self.db.commit()
            
            # Update Redis cache
            if self.redis:
                await self._store_session_in_redis(session)
            
            return True
        except Exception:
            return False
    
    async def resume_session(self, session_token: str) -> bool:
        """Resume a suspended session"""
        try:
            session = await self.get_session(session_token)
            if not session or session.status != SessionStatus.SUSPENDED.value:
                return False
            
            session.status = SessionStatus.ACTIVE.value
            session.last_activity = datetime.utcnow()
            await self.db.commit()
            
            # Update Redis cache
            if self.redis:
                await self._store_session_in_redis(session)
            
            return True
        except Exception:
            return False
    
    async def get_user_sessions(self, user_id: str, active_only: bool = True) -> List[Session]:
        """Get all sessions for a user"""
        try:
            query = self.db.query(Session).filter(Session.user_id == user_id)
            
            if active_only:
                query = query.filter(Session.status == SessionStatus.ACTIVE.value)
            
            return await query.order_by(Session.last_activity.desc()).all()
        except Exception:
            return []
    
    async def get_session_activities(self, session_id: str, limit: int = 100) -> List[SessionActivity]:
        """Get session activities"""
        try:
            return await self.db.query(SessionActivity).filter(
                SessionActivity.session_id == session_id
            ).order_by(SessionActivity.created_at.desc()).limit(limit).all()
        except Exception:
            return []
    
    async def cleanup_expired_sessions(self) -> int:
        """Clean up expired sessions"""
        try:
            now = datetime.utcnow()
            
            # Find expired sessions
            expired_sessions = await self.db.query(Session).filter(
                Session.expires_at < now,
                Session.status == SessionStatus.ACTIVE.value
            ).all()
            
            count = 0
            for session in expired_sessions:
                session.status = SessionStatus.EXPIRED.value
                count += 1
                
                # Remove from cache
                if session.session_token in self.session_cache:
                    del self.session_cache[session.session_token]
                
                # Remove from Redis
                if self.redis:
                    self.redis.delete(f"session:{session.session_token}")
            
            await self.db.commit()
            return count
        except Exception:
            return 0
    
    async def get_session_statistics(self, user_id: str = None) -> Dict[str, Any]:
        """Get session statistics"""
        try:
            query = self.db.query(Session)
            if user_id:
                query = query.filter(Session.user_id == user_id)
            
            total_sessions = await query.count()
            active_sessions = await query.filter(Session.status == SessionStatus.ACTIVE.value).count()
            expired_sessions = await query.filter(Session.status == SessionStatus.EXPIRED.value).count()
            terminated_sessions = await query.filter(Session.status == SessionStatus.TERMINATED.value).count()
            suspended_sessions = await query.filter(Session.status == SessionStatus.SUSPENDED.value).count()
            
            # Count by type
            type_counts = {}
            for session_type in SessionType:
                count = await query.filter(Session.session_type == session_type.value).count()
                type_counts[session_type.value] = count
            
            # Count by device type
            device_counts = {}
            for device_type in DeviceType:
                count = await query.filter(Session.device_type == device_type.value).count()
                device_counts[device_type.value] = count
            
            return {
                "total_sessions": total_sessions,
                "active_sessions": active_sessions,
                "expired_sessions": expired_sessions,
                "terminated_sessions": terminated_sessions,
                "suspended_sessions": suspended_sessions,
                "by_type": type_counts,
                "by_device": device_counts
            }
        except Exception:
            return {}
    
    async def validate_session(self, session_token: str, required_permissions: List[str] = None) -> bool:
        """Validate session and check permissions"""
        try:
            session = await self.get_session(session_token)
            if not session:
                return False
            
            # Check if session is active
            if session.status != SessionStatus.ACTIVE.value:
                return False
            
            # Check if session is expired
            if session.expires_at <= datetime.utcnow():
                session.status = SessionStatus.EXPIRED.value
                await self.db.commit()
                return False
            
            # Check permissions if required
            if required_permissions:
                session_data = SessionData(**session.data)
                user_permissions = session_data.permissions
                
                for permission in required_permissions:
                    if permission not in user_permissions:
                        return False
            
            return True
        except Exception:
            return False
    
    async def get_session_data(self, session_token: str) -> Optional[SessionData]:
        """Get session data"""
        try:
            session = await self.get_session(session_token)
            if not session:
                return None
            
            return SessionData(**session.data)
        except Exception:
            return None
    
    async def update_session_data(self, session_token: str, data_updates: Dict[str, Any]) -> bool:
        """Update session data"""
        try:
            session = await self.get_session(session_token)
            if not session:
                return False
            
            # Update session data
            session_data = SessionData(**session.data)
            for key, value in data_updates.items():
                if hasattr(session_data, key):
                    setattr(session_data, key, value)
            
            session.data = session_data.__dict__
            session.last_activity = datetime.utcnow()
            await self.db.commit()
            
            # Update Redis cache
            if self.redis:
                await self._store_session_in_redis(session)
            
            return True
        except Exception:
            return False
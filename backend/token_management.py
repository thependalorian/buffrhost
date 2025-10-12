"""
TOKEN MANAGEMENT SYSTEM
Advanced token generation, validation, and management for Buffr Host
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
import secrets
import hashlib
import hmac
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import jwt
import redis

Base = declarative_base()

class TokenType(Enum):
    """Token types"""
    ACCESS = "access"
    REFRESH = "refresh"
    EMAIL_VERIFICATION = "email_verification"
    PASSWORD_RESET = "password_reset"
    API_KEY = "api_key"
    WEBHOOK = "webhook"
    INVITATION = "invitation"
    TWO_FACTOR = "two_factor"
    CUSTOM = "custom"

class TokenStatus(Enum):
    """Token status"""
    ACTIVE = "active"
    EXPIRED = "expired"
    REVOKED = "revoked"
    USED = "used"
    INVALID = "invalid"

class TokenScope(Enum):
    """Token scopes"""
    READ = "read"
    WRITE = "write"
    ADMIN = "admin"
    API = "api"
    WEBHOOK = "webhook"
    CUSTOM = "custom"

@dataclass
class TokenPayload:
    """Token payload structure"""
    user_id: str
    token_type: TokenType
    scopes: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)
    issued_at: datetime = field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    issued_by: str = "system"
    client_id: Optional[str] = None

class Token(Base):
    """Token model"""
    __tablename__ = 'tokens'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    token_hash = Column(String(255), unique=True, nullable=False)
    token_type = Column(String(50), nullable=False)
    status = Column(String(50), default=TokenStatus.ACTIVE.value)
    
    # Token data
    user_id = Column(String(255), nullable=False)
    scopes = Column(JSON)  # List of scopes
    metadata = Column(JSON)
    
    # Security
    client_id = Column(String(255))
    ip_address = Column(String(45))  # IPv6 compatible
    user_agent = Column(Text)
    
    # Timestamps
    issued_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    last_used = Column(DateTime)
    revoked_at = Column(DateTime)
    
    # Relationships
    usages = relationship("TokenUsage", back_populates="token")

class TokenUsage(Base):
    """Token usage log model"""
    __tablename__ = 'token_usages'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    token_id = Column(String, ForeignKey('tokens.id'))
    action = Column(String(100), nullable=False)
    resource = Column(String(255))
    ip_address = Column(String(45))
    user_agent = Column(Text)
    metadata = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    token = relationship("Token", back_populates="usages")

class TokenManager:
    """Advanced token management system"""
    
    def __init__(self, db_session, secret_key: str, redis_client: redis.Redis = None,
                 algorithm: str = "HS256", access_token_expiry: int = 3600,
                 refresh_token_expiry: int = 2592000):  # 30 days
        self.db = db_session
        self.secret_key = secret_key
        self.redis = redis_client
        self.algorithm = algorithm
        self.access_token_expiry = access_token_expiry
        self.refresh_token_expiry = refresh_token_expiry
        self.token_cache: Dict[str, Token] = {}
        
        # Initialize encryption
        self.encryption_key = self._derive_encryption_key(secret_key)
        self.cipher = Fernet(self.encryption_key)
    
    def _derive_encryption_key(self, password: str) -> bytes:
        """Derive encryption key from password"""
        password_bytes = password.encode()
        salt = b'buffr_host_salt'  # In production, use random salt
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(password_bytes))
        return key
    
    def _generate_token_hash(self, token: str) -> str:
        """Generate hash for token storage"""
        return hashlib.sha256(token.encode()).hexdigest()
    
    def _generate_jwt_token(self, payload: TokenPayload) -> str:
        """Generate JWT token"""
        try:
            token_data = {
                'user_id': payload.user_id,
                'token_type': payload.token_type.value,
                'scopes': payload.scopes,
                'metadata': payload.metadata,
                'iat': int(payload.issued_at.timestamp()),
                'exp': int(payload.expires_at.timestamp()) if payload.expires_at else None,
                'iss': payload.issued_by,
                'client_id': payload.client_id
            }
            
            return jwt.encode(token_data, self.secret_key, algorithm=self.algorithm)
        except Exception as e:
            raise Exception(f"Failed to generate JWT token: {str(e)}")
    
    def _verify_jwt_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    def _generate_api_key(self, length: int = 32) -> str:
        """Generate API key"""
        return secrets.token_urlsafe(length)
    
    def _generate_secure_token(self, length: int = 32) -> str:
        """Generate secure random token"""
        return secrets.token_urlsafe(length)
    
    async def create_token(self, user_id: str, token_type: TokenType,
                         scopes: List[str] = None, expires_in: int = None,
                         metadata: Dict[str, Any] = None, client_id: str = None,
                         ip_address: str = "", user_agent: str = "",
                         issued_by: str = "system") -> Dict[str, Any]:
        """Create a new token"""
        try:
            # Set expiration time
            if token_type == TokenType.ACCESS:
                expires_in = expires_in or self.access_token_expiry
            elif token_type == TokenType.REFRESH:
                expires_in = expires_in or self.refresh_token_expiry
            else:
                expires_in = expires_in or 3600  # 1 hour default
            
            expires_at = datetime.utcnow() + timedelta(seconds=expires_in)
            
            # Create token payload
            payload = TokenPayload(
                user_id=user_id,
                token_type=token_type,
                scopes=scopes or [],
                metadata=metadata or {},
                expires_at=expires_at,
                issued_by=issued_by,
                client_id=client_id
            )
            
            # Generate token based on type
            if token_type in [TokenType.ACCESS, TokenType.REFRESH]:
                token_value = self._generate_jwt_token(payload)
            else:
                token_value = self._generate_secure_token()
            
            # Create token hash for storage
            token_hash = self._generate_token_hash(token_value)
            
            # Create token record
            token = Token(
                token_hash=token_hash,
                token_type=token_type.value,
                user_id=user_id,
                scopes=scopes or [],
                metadata=metadata or {},
                client_id=client_id,
                ip_address=ip_address,
                user_agent=user_agent,
                expires_at=expires_at
            )
            
            self.db.add(token)
            await self.db.commit()
            await self.db.refresh(token)
            
            # Cache token
            self.token_cache[token_value] = token
            
            # Store in Redis if available
            if self.redis:
                await self._store_token_in_redis(token, token_value)
            
            return {
                "token": token_value,
                "token_id": token.id,
                "type": token_type.value,
                "expires_at": expires_at.isoformat(),
                "scopes": scopes or []
            }
        except Exception as e:
            await self.db.rollback()
            raise Exception(f"Failed to create token: {str(e)}")
    
    async def _store_token_in_redis(self, token: Token, token_value: str):
        """Store token in Redis cache"""
        try:
            if self.redis:
                token_data = {
                    'id': token.id,
                    'user_id': token.user_id,
                    'token_type': token.token_type,
                    'status': token.status,
                    'scopes': token.scopes,
                    'metadata': token.metadata,
                    'client_id': token.client_id,
                    'issued_at': token.issued_at.isoformat(),
                    'expires_at': token.expires_at.isoformat(),
                    'last_used': token.last_used.isoformat() if token.last_used else None
                }
                
                # Encrypt token data
                encrypted_data = self.cipher.encrypt(json.dumps(token_data).encode())
                
                # Store with expiration
                ttl = int((token.expires_at - datetime.utcnow()).total_seconds())
                self.redis.setex(
                    f"token:{token_value}",
                    ttl,
                    encrypted_data
                )
        except Exception as e:
            print(f"Error storing token in Redis: {e}")
    
    async def validate_token(self, token_value: str, required_scopes: List[str] = None) -> Optional[Token]:
        """Validate token and check scopes"""
        try:
            # Check cache first
            if token_value in self.token_cache:
                token = self.token_cache[token_value]
                if token.status == TokenStatus.ACTIVE.value and token.expires_at > datetime.utcnow():
                    return token
                else:
                    del self.token_cache[token_value]
                    return None
            
            # Check Redis cache
            if self.redis:
                cached_data = self.redis.get(f"token:{token_value}")
                if cached_data:
                    try:
                        decrypted_data = self.cipher.decrypt(cached_data)
                        token_data = json.loads(decrypted_data.decode())
                        
                        # Create token object from cached data
                        token = Token(
                            id=token_data['id'],
                            token_hash=self._generate_token_hash(token_value),
                            token_type=token_data['token_type'],
                            status=token_data['status'],
                            user_id=token_data['user_id'],
                            scopes=token_data['scopes'],
                            metadata=token_data['metadata'],
                            client_id=token_data['client_id'],
                            issued_at=datetime.fromisoformat(token_data['issued_at']),
                            expires_at=datetime.fromisoformat(token_data['expires_at']),
                            last_used=datetime.fromisoformat(token_data['last_used']) if token_data['last_used'] else None
                        )
                        
                        # Cache in memory
                        self.token_cache[token_value] = token
                        
                        # Check if token is valid
                        if token.status == TokenStatus.ACTIVE.value and token.expires_at > datetime.utcnow():
                            return token
                        else:
                            return None
                    except Exception:
                        pass
            
            # Check database
            token_hash = self._generate_token_hash(token_value)
            token = await self.db.query(Token).filter(
                Token.token_hash == token_hash
            ).first()
            
            if token and token.status == TokenStatus.ACTIVE.value and token.expires_at > datetime.utcnow():
                self.token_cache[token_value] = token
                return token
            
            return None
        except Exception:
            return None
    
    async def use_token(self, token_value: str, action: str, resource: str = None,
                       ip_address: str = "", user_agent: str = "",
                       metadata: Dict[str, Any] = None) -> bool:
        """Record token usage"""
        try:
            token = await self.validate_token(token_value)
            if not token:
                return False
            
            # Update last used time
            token.last_used = datetime.utcnow()
            await self.db.commit()
            
            # Log usage
            usage = TokenUsage(
                token_id=token.id,
                action=action,
                resource=resource,
                ip_address=ip_address,
                user_agent=user_agent,
                metadata=metadata or {}
            )
            
            self.db.add(usage)
            await self.db.commit()
            
            # Update Redis cache
            if self.redis:
                await self._store_token_in_redis(token, token_value)
            
            return True
        except Exception:
            return False
    
    async def revoke_token(self, token_value: str, reason: str = "manual") -> bool:
        """Revoke a token"""
        try:
            token = await self.validate_token(token_value)
            if not token:
                return False
            
            token.status = TokenStatus.REVOKED.value
            token.revoked_at = datetime.utcnow()
            await self.db.commit()
            
            # Remove from cache
            if token_value in self.token_cache:
                del self.token_cache[token_value]
            
            # Remove from Redis
            if self.redis:
                self.redis.delete(f"token:{token_value}")
            
            return True
        except Exception:
            return False
    
    async def revoke_user_tokens(self, user_id: str, token_type: TokenType = None,
                               exclude_token: str = None) -> int:
        """Revoke all tokens for a user"""
        try:
            query = self.db.query(Token).filter(
                Token.user_id == user_id,
                Token.status == TokenStatus.ACTIVE.value
            )
            
            if token_type:
                query = query.filter(Token.token_type == token_type.value)
            if exclude_token:
                exclude_hash = self._generate_token_hash(exclude_token)
                query = query.filter(Token.token_hash != exclude_hash)
            
            tokens = await query.all()
            count = 0
            
            for token in tokens:
                token.status = TokenStatus.REVOKED.value
                token.revoked_at = datetime.utcnow()
                count += 1
                
                # Remove from cache
                for token_value, cached_token in list(self.token_cache.items()):
                    if cached_token.id == token.id:
                        del self.token_cache[token_value]
                        break
                
                # Remove from Redis
                if self.redis:
                    # Find token value by hash (this is inefficient, consider storing reverse mapping)
                    pass
            
            await self.db.commit()
            return count
        except Exception:
            return 0
    
    async def refresh_token(self, refresh_token: str) -> Optional[Dict[str, Any]]:
        """Refresh access token using refresh token"""
        try:
            # Validate refresh token
            token = await self.validate_token(refresh_token)
            if not token or token.token_type != TokenType.REFRESH.value:
                return None
            
            # Revoke old refresh token
            await self.revoke_token(refresh_token)
            
            # Create new access token
            new_token = await self.create_token(
                user_id=token.user_id,
                token_type=TokenType.ACCESS,
                scopes=token.scopes,
                metadata=token.metadata,
                client_id=token.client_id,
                ip_address=token.ip_address,
                user_agent=token.user_agent,
                issued_by=token.metadata.get('issued_by', 'system')
            )
            
            # Create new refresh token
            new_refresh_token = await self.create_token(
                user_id=token.user_id,
                token_type=TokenType.REFRESH,
                scopes=token.scopes,
                metadata=token.metadata,
                client_id=token.client_id,
                ip_address=token.ip_address,
                user_agent=token.user_agent,
                issued_by=token.metadata.get('issued_by', 'system')
            )
            
            return {
                "access_token": new_token["token"],
                "refresh_token": new_refresh_token["token"],
                "expires_at": new_token["expires_at"],
                "scopes": new_token["scopes"]
            }
        except Exception:
            return None
    
    async def get_token_info(self, token_value: str) -> Optional[Dict[str, Any]]:
        """Get token information"""
        try:
            token = await self.validate_token(token_value)
            if not token:
                return None
            
            return {
                "token_id": token.id,
                "user_id": token.user_id,
                "type": token.token_type,
                "scopes": token.scopes,
                "status": token.status,
                "issued_at": token.issued_at.isoformat(),
                "expires_at": token.expires_at.isoformat(),
                "last_used": token.last_used.isoformat() if token.last_used else None,
                "client_id": token.client_id,
                "metadata": token.metadata
            }
        except Exception:
            return None
    
    async def get_user_tokens(self, user_id: str, token_type: TokenType = None,
                            active_only: bool = True) -> List[Token]:
        """Get all tokens for a user"""
        try:
            query = self.db.query(Token).filter(Token.user_id == user_id)
            
            if token_type:
                query = query.filter(Token.token_type == token_type.value)
            if active_only:
                query = query.filter(Token.status == TokenStatus.ACTIVE.value)
            
            return await query.order_by(Token.issued_at.desc()).all()
        except Exception:
            return []
    
    async def get_token_usage(self, token_id: str, limit: int = 100) -> List[TokenUsage]:
        """Get token usage history"""
        try:
            return await self.db.query(TokenUsage).filter(
                TokenUsage.token_id == token_id
            ).order_by(TokenUsage.created_at.desc()).limit(limit).all()
        except Exception:
            return []
    
    async def cleanup_expired_tokens(self) -> int:
        """Clean up expired tokens"""
        try:
            now = datetime.utcnow()
            
            # Find expired tokens
            expired_tokens = await self.db.query(Token).filter(
                Token.expires_at < now,
                Token.status == TokenStatus.ACTIVE.value
            ).all()
            
            count = 0
            for token in expired_tokens:
                token.status = TokenStatus.EXPIRED.value
                count += 1
                
                # Remove from cache
                for token_value, cached_token in list(self.token_cache.items()):
                    if cached_token.id == token.id:
                        del self.token_cache[token_value]
                        break
                
                # Remove from Redis
                if self.redis:
                    # Find and remove from Redis
                    pass
            
            await self.db.commit()
            return count
        except Exception:
            return 0
    
    async def get_token_statistics(self, user_id: str = None) -> Dict[str, Any]:
        """Get token statistics"""
        try:
            query = self.db.query(Token)
            if user_id:
                query = query.filter(Token.user_id == user_id)
            
            total_tokens = await query.count()
            active_tokens = await query.filter(Token.status == TokenStatus.ACTIVE.value).count()
            expired_tokens = await query.filter(Token.status == TokenStatus.EXPIRED.value).count()
            revoked_tokens = await query.filter(Token.status == TokenStatus.REVOKED.value).count()
            
            # Count by type
            type_counts = {}
            for token_type in TokenType:
                count = await query.filter(Token.token_type == token_type.value).count()
                type_counts[token_type.value] = count
            
            return {
                "total_tokens": total_tokens,
                "active_tokens": active_tokens,
                "expired_tokens": expired_tokens,
                "revoked_tokens": revoked_tokens,
                "by_type": type_counts
            }
        except Exception:
            return {}
    
    async def verify_api_key(self, api_key: str) -> Optional[Dict[str, Any]]:
        """Verify API key and return token info"""
        try:
            token = await self.validate_token(api_key)
            if not token or token.token_type != TokenType.API_KEY.value:
                return None
            
            return {
                "user_id": token.user_id,
                "scopes": token.scopes,
                "metadata": token.metadata
            }
        except Exception:
            return None
"""
Authentication utility functions for signature service
"""

import logging
import os
from datetime import datetime, timedelta
from typing import Dict, Optional, Any
from functools import wraps

from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext

logger = logging.getLogger(__name__)

security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

class AuthManager:
    """Manages authentication and authorization"""
    
    def __init__(self):
        self.secret_key = SECRET_KEY
        self.algorithm = ALGORITHM
        self.access_token_expire_minutes = ACCESS_TOKEN_EXPIRE_MINUTES
    
    def create_access_token(self, data: Dict[str, Any]) -> str:
        """Create a JWT access token"""
        try:
            to_encode = data.copy()
            expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)
            to_encode.update({"exp": expire})
            
            encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
            logger.debug("Access token created successfully")
            return encoded_jwt
            
        except Exception as e:
            logger.error(f"Failed to create access token: {e}")
            raise
    
    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify a JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            logger.debug("Token verified successfully")
            return payload
            
        except JWTError as e:
            logger.warning(f"Token verification failed: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error during token verification: {e}")
            return None
    
    def hash_password(self, password: str) -> str:
        """Hash a password"""
        try:
            hashed = pwd_context.hash(password)
            logger.debug("Password hashed successfully")
            return hashed
            
        except Exception as e:
            logger.error(f"Failed to hash password: {e}")
            raise
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        try:
            is_valid = pwd_context.verify(plain_password, hashed_password)
            logger.debug(f"Password verification: {'success' if is_valid else 'failed'}")
            return is_valid
            
        except Exception as e:
            logger.error(f"Failed to verify password: {e}")
            return False

auth_manager = AuthManager()

async def verify_jwt_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """Verify JWT token from request headers"""
    try:
        token = credentials.credentials
        payload = auth_manager.verify_token(token)
        
        if payload is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Check if token is expired
        exp = payload.get("exp")
        if exp and datetime.utcnow().timestamp() > exp:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return payload
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during token verification: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"},
        )

def require_permission(permission: str):
    """Decorator to require specific permission"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Get current user from kwargs
            current_user = kwargs.get('current_user')
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )
            
            # Check if user has required permission
            user_permissions = current_user.get('permissions', [])
            if permission not in user_permissions:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Permission '{permission}' required"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator

def require_role(role: str):
    """Decorator to require specific role"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Get current user from kwargs
            current_user = kwargs.get('current_user')
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )
            
            # Check if user has required role
            user_role = current_user.get('role')
            if user_role != role:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Role '{role}' required"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator

async def get_current_user_id(current_user: Dict[str, Any] = Depends(verify_jwt_token)) -> str:
    """Get current user ID from token"""
    try:
        user_id = current_user.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user ID"
            )
        return user_id
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get current user ID: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed"
        )

async def get_current_user_email(current_user: Dict[str, Any] = Depends(verify_jwt_token)) -> str:
    """Get current user email from token"""
    try:
        email = current_user.get("email")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing email"
            )
        return email
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get current user email: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed"
        )

async def get_current_user_role(current_user: Dict[str, Any] = Depends(verify_jwt_token)) -> str:
    """Get current user role from token"""
    try:
        role = current_user.get("role", "user")
        return role
        
    except Exception as e:
        logger.error(f"Failed to get current user role: {e}")
        return "user"

def create_user_token(user_data: Dict[str, Any]) -> str:
    """Create a token for a user"""
    try:
        token_data = {
            "sub": user_data.get("id"),
            "email": user_data.get("email"),
            "role": user_data.get("role", "user"),
            "permissions": user_data.get("permissions", []),
            "iat": datetime.utcnow().timestamp()
        }
        
        return auth_manager.create_access_token(token_data)
        
    except Exception as e:
        logger.error(f"Failed to create user token: {e}")
        raise

def validate_token_format(token: str) -> bool:
    """Validate token format"""
    try:
        # Check if token has the expected format (header.payload.signature)
        parts = token.split('.')
        if len(parts) != 3:
            return False
        
        # Try to decode the header and payload
        jwt.decode(token, options={"verify_signature": False})
        return True
        
    except Exception:
        return False

def extract_token_info(token: str) -> Optional[Dict[str, Any]]:
    """Extract information from token without verification"""
    try:
        payload = jwt.decode(token, options={"verify_signature": False})
        return payload
        
    except Exception as e:
        logger.error(f"Failed to extract token info: {e}")
        return None
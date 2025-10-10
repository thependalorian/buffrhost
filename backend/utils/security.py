"""
Security Utilities
Password hashing, JWT tokens, encryption, and security helpers
"""

from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import secrets
import hashlib
import hmac
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

from config import settings

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash
    """
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create JWT access token
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: Dict[str, Any]) -> str:
    """
    Create JWT refresh token (longer expiration)
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify and decode JWT token
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None

def generate_password_reset_token(email: str) -> str:
    """
    Generate password reset token
    """
    data = {
        "email": email,
        "purpose": "password_reset",
        "exp": datetime.utcnow() + timedelta(hours=1)  # 1 hour expiration
    }
    return jwt.encode(data, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def verify_password_reset_token(token: str) -> Optional[str]:
    """
    Verify password reset token and return email
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("purpose") == "password_reset":
            return payload.get("email")
    except JWTError:
        pass
    return None

def generate_api_key() -> str:
    """
    Generate a secure API key
    """
    return secrets.token_urlsafe(32)

def generate_secure_token(length: int = 32) -> str:
    """
    Generate a secure random token
    """
    return secrets.token_urlsafe(length)

def hash_data(data: str, salt: Optional[str] = None) -> str:
    """
    Hash data with optional salt
    """
    if salt is None:
        salt = secrets.token_hex(16)
    
    salted_data = f"{data}{salt}".encode('utf-8')
    hash_obj = hashlib.sha256(salted_data)
    return f"{salt}:{hash_obj.hexdigest()}"

def verify_hashed_data(data: str, hashed_data: str) -> bool:
    """
    Verify data against its hash
    """
    try:
        salt, hash_value = hashed_data.split(':', 1)
        expected_hash = hash_data(data, salt)
        return hmac.compare_digest(hashed_data, expected_hash)
    except ValueError:
        return False

def generate_encryption_key(password: str, salt: Optional[bytes] = None) -> bytes:
    """
    Generate encryption key from password using PBKDF2
    """
    if salt is None:
        salt = secrets.token_bytes(16)
    
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
    return key

def encrypt_data(data: str, password: str) -> str:
    """
    Encrypt data with password
    """
    key = generate_encryption_key(password)
    fernet = Fernet(key)
    encrypted_data = fernet.encrypt(data.encode())
    return base64.urlsafe_b64encode(encrypted_data).decode()

def decrypt_data(encrypted_data: str, password: str) -> Optional[str]:
    """
    Decrypt data with password
    """
    try:
        key = generate_encryption_key(password)
        fernet = Fernet(key)
        encrypted_bytes = base64.urlsafe_b64decode(encrypted_data.encode())
        decrypted_data = fernet.decrypt(encrypted_bytes)
        return decrypted_data.decode()
    except Exception:
        return None

def generate_hmac_signature(data: str, secret: str) -> str:
    """
    Generate HMAC signature for data integrity
    """
    signature = hmac.new(
        secret.encode('utf-8'),
        data.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    return signature

def verify_hmac_signature(data: str, signature: str, secret: str) -> bool:
    """
    Verify HMAC signature
    """
    expected_signature = generate_hmac_signature(data, secret)
    return hmac.compare_digest(signature, expected_signature)

def sanitize_input(input_string: str) -> str:
    """
    Sanitize user input to prevent XSS and injection attacks
    """
    if not isinstance(input_string, str):
        return str(input_string)
    
    # Remove null bytes
    input_string = input_string.replace('\x00', '')
    
    # Remove control characters except newlines and tabs
    input_string = ''.join(char for char in input_string if ord(char) >= 32 or char in '\n\t')
    
    # Limit length
    if len(input_string) > 10000:
        input_string = input_string[:10000]
    
    return input_string.strip()

def validate_password_strength(password: str) -> Dict[str, Any]:
    """
    Validate password strength and return detailed feedback
    """
    feedback = {
        "is_valid": True,
        "score": 0,
        "issues": [],
        "suggestions": []
    }
    
    if len(password) < 8:
        feedback["is_valid"] = False
        feedback["issues"].append("Password must be at least 8 characters long")
    else:
        feedback["score"] += 1
    
    if not any(c.islower() for c in password):
        feedback["issues"].append("Password must contain at least one lowercase letter")
    else:
        feedback["score"] += 1
    
    if not any(c.isupper() for c in password):
        feedback["issues"].append("Password must contain at least one uppercase letter")
    else:
        feedback["score"] += 1
    
    if not any(c.isdigit() for c in password):
        feedback["issues"].append("Password must contain at least one number")
    else:
        feedback["score"] += 1
    
    if not any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password):
        feedback["issues"].append("Password must contain at least one special character")
    else:
        feedback["score"] += 1
    
    # Check for common patterns
    common_patterns = ["123", "abc", "password", "qwerty", "admin"]
    if any(pattern in password.lower() for pattern in common_patterns):
        feedback["issues"].append("Password contains common patterns")
        feedback["suggestions"].append("Avoid common words and patterns")
    
    # Check for repeated characters
    if len(set(password)) < len(password) * 0.6:
        feedback["issues"].append("Password has too many repeated characters")
        feedback["suggestions"].append("Use more diverse characters")
    
    # Overall validation
    if feedback["score"] < 3:
        feedback["is_valid"] = False
    
    if not feedback["is_valid"]:
        feedback["suggestions"].extend([
            "Use a mix of uppercase and lowercase letters",
            "Include numbers and special characters",
            "Make it at least 12 characters long",
            "Avoid personal information"
        ])
    
    return feedback

def generate_otp(length: int = 6) -> str:
    """
    Generate a numeric OTP (One-Time Password)
    """
    return ''.join([str(secrets.randbelow(10)) for _ in range(length)])

def generate_secure_filename(original_filename: str) -> str:
    """
    Generate a secure filename to prevent path traversal attacks
    """
    import os
    import uuid
    
    # Get file extension
    _, ext = os.path.splitext(original_filename)
    
    # Generate secure filename
    secure_name = f"{uuid.uuid4().hex}{ext}"
    
    return secure_name

def check_rate_limit(identifier: str, limit: int = 100, window: int = 3600) -> bool:
    """
    Simple in-memory rate limiting (use Redis in production)
    """
    # This is a simplified version - use Redis for production
    import time
    
    # In production, implement with Redis
    return True

def mask_sensitive_data(data: str, visible_chars: int = 4) -> str:
    """
    Mask sensitive data for logging (e.g., credit card numbers, API keys)
    """
    if len(data) <= visible_chars * 2:
        return "*" * len(data)
    
    visible_start = data[:visible_chars]
    visible_end = data[-visible_chars:]
    masked_middle = "*" * (len(data) - visible_chars * 2)
    
    return f"{visible_start}{masked_middle}{visible_end}"

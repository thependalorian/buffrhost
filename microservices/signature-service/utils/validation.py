"""
Validation utility functions for signature service
"""

import logging
import re
import base64
from typing import Dict, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

class ValidationError(Exception):
    """Custom validation error"""
    pass

async def validate_envelope_data(data: Dict[str, Any]) -> bool:
    """Validate envelope data"""
    try:
        logger.debug("Validating envelope data")
        
        # Check required fields
        required_fields = ["envelope_name"]
        for field in required_fields:
            if field not in data:
                raise ValidationError(f"Missing required field: {field}")
        
        # Validate envelope name
        envelope_name = data.get("envelope_name", "")
        if not envelope_name or len(envelope_name.strip()) == 0:
            raise ValidationError("Envelope name cannot be empty")
        
        if len(envelope_name) > 255:
            raise ValidationError("Envelope name too long (max 255 characters)")
        
        # Validate description if provided
        description = data.get("description")
        if description and len(description) > 1000:
            raise ValidationError("Description too long (max 1000 characters)")
        
        # Validate recipients if provided
        recipients = data.get("recipients", [])
        if recipients:
            await validate_recipient_data({"recipients": recipients})
        
        # Validate fields if provided
        fields = data.get("fields", [])
        if fields:
            for field_data in fields:
                await validate_field_data(field_data)
        
        logger.debug("Envelope data validation successful")
        return True
        
    except ValidationError:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during envelope validation: {e}")
        raise ValidationError(f"Validation failed: {str(e)}")

async def validate_signature_data(signature_data: str) -> bool:
    """Validate signature data"""
    try:
        logger.debug("Validating signature data")
        
        if not signature_data:
            raise ValidationError("Signature data cannot be empty")
        
        # Check if it's base64 encoded
        if not validate_base64(signature_data):
            raise ValidationError("Signature data must be base64 encoded")
        
        # Check minimum length (base64 encoded signature should be at least 100 chars)
        if len(signature_data) < 100:
            raise ValidationError("Signature data too short")
        
        # Check maximum length (prevent extremely large signatures)
        if len(signature_data) > 100000:  # 100KB
            raise ValidationError("Signature data too large")
        
        logger.debug("Signature data validation successful")
        return True
        
    except ValidationError:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during signature validation: {e}")
        raise ValidationError(f"Signature validation failed: {str(e)}")

async def validate_field_data(field_data: Dict[str, Any]) -> bool:
    """Validate field data"""
    try:
        logger.debug("Validating field data")
        
        # Check required fields
        required_fields = ["field_type", "field_name"]
        for field in required_fields:
            if field not in field_data:
                raise ValidationError(f"Missing required field: {field}")
        
        # Validate field type
        valid_field_types = ["signHere", "initialHere", "dateSigned", "text", "checkbox", "radio", "dropdown"]
        field_type = field_data.get("field_type")
        if field_type not in valid_field_types:
            raise ValidationError(f"Invalid field type: {field_type}")
        
        # Validate field name
        field_name = field_data.get("field_name", "")
        if not field_name or len(field_name.strip()) == 0:
            raise ValidationError("Field name cannot be empty")
        
        if len(field_name) > 100:
            raise ValidationError("Field name too long (max 100 characters)")
        
        # Validate position data
        x_position = field_data.get("x_position", 0)
        y_position = field_data.get("y_position", 0)
        width = field_data.get("width", 100)
        height = field_data.get("height", 50)
        
        if x_position < 0 or y_position < 0:
            raise ValidationError("Field position cannot be negative")
        
        if width <= 0 or height <= 0:
            raise ValidationError("Field dimensions must be positive")
        
        # Validate page number
        page_number = field_data.get("page_number", 1)
        if page_number < 1:
            raise ValidationError("Page number must be at least 1")
        
        logger.debug("Field data validation successful")
        return True
        
    except ValidationError:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during field validation: {e}")
        raise ValidationError(f"Field validation failed: {str(e)}")

async def validate_recipient_data(recipient_data: Dict[str, Any]) -> bool:
    """Validate recipient data"""
    try:
        logger.debug("Validating recipient data")
        
        # Handle both single recipient and list of recipients
        recipients = recipient_data.get("recipients", [recipient_data])
        
        for recipient in recipients:
            # Check required fields
            required_fields = ["email", "name"]
            for field in required_fields:
                if field not in recipient:
                    raise ValidationError(f"Missing required field: {field}")
            
            # Validate email
            email = recipient.get("email", "")
            if not validate_email(email):
                raise ValidationError(f"Invalid email address: {email}")
            
            # Validate name
            name = recipient.get("name", "")
            if not name or len(name.strip()) == 0:
                raise ValidationError("Recipient name cannot be empty")
            
            if len(name) > 255:
                raise ValidationError("Recipient name too long (max 255 characters)")
            
            # Validate recipient type if provided
            recipient_type = recipient.get("recipient_type", "signer")
            valid_types = ["signer", "carbon_copy", "approver", "witness"]
            if recipient_type not in valid_types:
                raise ValidationError(f"Invalid recipient type: {recipient_type}")
        
        logger.debug("Recipient data validation successful")
        return True
        
    except ValidationError:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during recipient validation: {e}")
        raise ValidationError(f"Recipient validation failed: {str(e)}")

async def validate_initials_data(initials_data: Dict[str, Any]) -> bool:
    """Validate initials data"""
    try:
        logger.debug("Validating initials data")
        
        # Check required fields
        required_fields = ["name"]
        for field in required_fields:
            if field not in initials_data:
                raise ValidationError(f"Missing required field: {field}")
        
        # Validate name
        name = initials_data.get("name", "")
        if not name or len(name.strip()) == 0:
            raise ValidationError("Name cannot be empty")
        
        if len(name) > 255:
            raise ValidationError("Name too long (max 255 characters)")
        
        # Validate preferred style if provided
        preferred_style = initials_data.get("preferred_style", "formal")
        valid_styles = ["formal", "cursive", "block", "signature_style"]
        if preferred_style not in valid_styles:
            raise ValidationError(f"Invalid initials style: {preferred_style}")
        
        logger.debug("Initials data validation successful")
        return True
        
    except ValidationError:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during initials validation: {e}")
        raise ValidationError(f"Initials validation failed: {str(e)}")

def validate_uuid(uuid_string: str) -> bool:
    """Validate UUID format"""
    try:
        uuid_pattern = re.compile(
            r'^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
            re.IGNORECASE
        )
        return bool(uuid_pattern.match(uuid_string))
        
    except Exception:
        return False

def validate_email(email: str) -> bool:
    """Validate email format"""
    try:
        email_pattern = re.compile(
            r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        )
        return bool(email_pattern.match(email))
        
    except Exception:
        return False

def validate_base64(data: str) -> bool:
    """Validate base64 encoding"""
    try:
        # Try to decode the data
        decoded = base64.b64decode(data)
        # Re-encode to check if it matches
        re_encoded = base64.b64encode(decoded).decode('utf-8')
        return data == re_encoded
        
    except Exception:
        return False

def sanitize_string(input_string: str, max_length: Optional[int] = None) -> str:
    """Sanitize string input"""
    try:
        if not input_string:
            return ""
        
        # Remove leading/trailing whitespace
        sanitized = input_string.strip()
        
        # Remove control characters
        sanitized = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', sanitized)
        
        # Limit length if specified
        if max_length and len(sanitized) > max_length:
            sanitized = sanitized[:max_length]
        
        return sanitized
        
    except Exception as e:
        logger.error(f"Failed to sanitize string: {e}")
        return ""

def validate_json_size(json_data: Dict[str, Any], max_size_kb: int = 100) -> bool:
    """Validate JSON data size"""
    try:
        import json
        json_string = json.dumps(json_data)
        size_kb = len(json_string.encode('utf-8')) / 1024
        
        if size_kb > max_size_kb:
            raise ValidationError(f"JSON data too large: {size_kb:.2f}KB (max {max_size_kb}KB)")
        
        return True
        
    except ValidationError:
        raise
    except Exception as e:
        logger.error(f"Failed to validate JSON size: {e}")
        raise ValidationError("JSON size validation failed")
"""
Shared utility functions for Buffr Host microservices
"""
import uuid
import logging
from datetime import datetime
from typing import Dict, Any

# Configure logging
logger = logging.getLogger(__name__)

def generate_id(prefix: str = "") -> str:
    """Generate a unique ID with optional prefix."""
    return f"{prefix}{str(uuid.uuid4())[:12].upper()}"

def generate_booking_reference() -> str:
    """Generate a unique booking reference."""
    return f"BUF{str(uuid.uuid4())[:8].upper()}"

def generate_transaction_id() -> str:
    """Generate a unique transaction ID."""
    return f"TXN{str(uuid.uuid4())[:12].upper()}"

def generate_notification_id() -> str:
    """Generate a unique notification ID."""
    return f"NOT{str(uuid.uuid4())[:12].upper()}"

def log_event(service_name: str, event_type: str, data: Dict[str, Any]):
    """Log an event for analytics."""
    logger.info(f"[{service_name}] {event_type}: {data}")

def format_currency(amount: float, currency: str = "NAD") -> str:
    """Format currency amount."""
    if currency == "NAD":
        return f"N${amount:,.2f}"
    elif currency == "USD":
        return f"${amount:,.2f}"
    elif currency == "EUR":
        return f"€{amount:,.2f}"
    else:
        return f"{amount:,.2f} {currency}"

def validate_email(email: str) -> bool:
    """Validate email format."""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone: str) -> bool:
    """Validate phone number format."""
    import re
    # Basic phone validation - adjust for your needs
    pattern = r'^\+?[1-9]\d{1,14}$'
    return re.match(pattern, phone) is not None

def sanitize_input(text: str) -> str:
    """Sanitize user input."""
    if not text:
        return ""
    
    # Remove potentially dangerous characters
    import html
    return html.escape(text.strip())

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two coordinates in kilometers."""
    import math
    
    R = 6371  # Earth's radius in kilometers
    
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = (math.sin(dlat/2) * math.sin(dlat/2) + 
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * 
         math.sin(dlon/2) * math.sin(dlon/2))
    
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    return R * c

def format_datetime(dt: datetime, format_str: str = "%Y-%m-%d %H:%M:%S") -> str:
    """Format datetime object."""
    return dt.strftime(format_str)

def parse_datetime(date_str: str, format_str: str = "%Y-%m-%d %H:%M:%S") -> datetime:
    """Parse datetime string."""
    return datetime.strptime(date_str, format_str)

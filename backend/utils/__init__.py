"""
Utility Functions
Common utilities for security, validation, formatting, and calculations
"""

from .security import hash_password, verify_password, create_access_token, create_refresh_token
from .validation import validate_email, validate_phone, validate_currency, validate_url
from .formatters import format_currency, format_date, format_phone, format_percentage
from .calculators import calculate_occupancy, calculate_revenue, calculate_adr, calculate_revpar
from .helpers import generate_uuid, generate_random_string, slugify, sanitize_html
from .file_utils import save_file, delete_file, get_file_info, validate_file_type
from .email_utils import send_email, send_bulk_email, validate_email_address
from .date_utils import get_timezone_offset, format_datetime, parse_date_range
# from .crypto_utils import encrypt_data, decrypt_data, generate_encryption_key  # File is empty

__all__ = [
    # Security
    "hash_password", "verify_password", "create_access_token", "create_refresh_token",
    
    # Validation
    "validate_email", "validate_phone", "validate_currency", "validate_url",
    
    # Formatting
    "format_currency", "format_date", "format_phone", "format_percentage",
    
    # Calculations
    "calculate_occupancy", "calculate_revenue", "calculate_adr", "calculate_revpar",
    
    # Helpers
    "generate_uuid", "generate_random_string", "slugify", "sanitize_html",
    
    # File utilities
    "save_file", "delete_file", "get_file_info", "validate_file_type",
    
    # Email utilities
    "send_email", "send_bulk_email", "validate_email_address",
    
    # Date utilities
    "get_timezone_offset", "format_datetime", "parse_date_range",
    
    # Crypto utilities
    "encrypt_data", "decrypt_data", "generate_encryption_key"
]

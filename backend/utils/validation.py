"""
Validation Utilities
Input validation, data sanitization, and format checking
"""

import re
import phonenumbers
from typing import Optional, List, Dict, Any, Union
from datetime import datetime, date
from decimal import Decimal, InvalidOperation
import validators
from urllib.parse import urlparse

def validate_email(email: str) -> bool:
    """
    Validate email address format
    """
    if not email or not isinstance(email, str):
        return False
    
    # Basic regex pattern
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    if not re.match(pattern, email):
        return False
    
    # Additional checks
    if len(email) > 254:  # RFC 5321 limit
        return False
    
    local_part, domain = email.rsplit('@', 1)
    if len(local_part) > 64:  # RFC 5321 limit
        return False
    
    return True

def validate_phone(phone: str, country_code: str = "US") -> bool:
    """
    Validate phone number using phonenumbers library
    """
    if not phone or not isinstance(phone, str):
        return False
    
    try:
        parsed_number = phonenumbers.parse(phone, country_code)
        return phonenumbers.is_valid_number(parsed_number)
    except phonenumbers.NumberParseException:
        return False

def validate_phone_with_format(phone: str, country_code: str = "US") -> Dict[str, Any]:
    """
    Validate phone number and return formatted result
    """
    result = {
        "is_valid": False,
        "formatted": None,
        "country_code": None,
        "national_number": None,
        "error": None
    }
    
    if not phone or not isinstance(phone, str):
        result["error"] = "Invalid input"
        return result
    
    try:
        parsed_number = phonenumbers.parse(phone, country_code)
        
        if phonenumbers.is_valid_number(parsed_number):
            result["is_valid"] = True
            result["formatted"] = phonenumbers.format_number(
                parsed_number, phonenumbers.PhoneNumberFormat.INTERNATIONAL
            )
            result["country_code"] = str(parsed_number.country_code)
            result["national_number"] = str(parsed_number.national_number)
        else:
            result["error"] = "Invalid phone number"
    except phonenumbers.NumberParseException as e:
        result["error"] = str(e)
    
    return result

def validate_currency(currency_code: str) -> bool:
    """
    Validate currency code (ISO 4217)
    """
    if not currency_code or not isinstance(currency_code, str):
        return False
    
    # Common currency codes
    valid_currencies = {
        'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'SEK', 'NZD',
        'MXN', 'SGD', 'HKD', 'NOK', 'TRY', 'RUB', 'INR', 'BRL', 'ZAR', 'KRW',
        'AED', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR', 'JOD', 'LBP', 'EGP', 'MAD',
        'TND', 'DZD', 'LYD', 'SDG', 'ETB', 'KES', 'UGX', 'TZS', 'ZMW', 'BWP',
        'SZL', 'LSL', 'NAD', 'MUR', 'SCR', 'KMF', 'DJF', 'SOS', 'ERN', 'ETB'
    }
    
    return currency_code.upper() in valid_currencies

def validate_url(url: str) -> bool:
    """
    Validate URL format
    """
    if not url or not isinstance(url, str):
        return False
    
    return validators.url(url)

def validate_url_with_details(url: str) -> Dict[str, Any]:
    """
    Validate URL and return detailed information
    """
    result = {
        "is_valid": False,
        "scheme": None,
        "domain": None,
        "path": None,
        "query": None,
        "fragment": None,
        "error": None
    }
    
    if not url or not isinstance(url, str):
        result["error"] = "Invalid input"
        return result
    
    try:
        parsed = urlparse(url)
        
        if not parsed.scheme or not parsed.netloc:
            result["error"] = "Invalid URL format"
            return result
        
        result["is_valid"] = True
        result["scheme"] = parsed.scheme
        result["domain"] = parsed.netloc
        result["path"] = parsed.path
        result["query"] = parsed.query
        result["fragment"] = parsed.fragment
        
    except Exception as e:
        result["error"] = str(e)
    
    return result

def validate_date(date_string: str, format_string: str = "%Y-%m-%d") -> bool:
    """
    Validate date string format
    """
    if not date_string or not isinstance(date_string, str):
        return False
    
    try:
        datetime.strptime(date_string, format_string)
        return True
    except ValueError:
        return False

def validate_datetime(datetime_string: str, format_string: str = "%Y-%m-%d %H:%M:%S") -> bool:
    """
    Validate datetime string format
    """
    if not datetime_string or not isinstance(datetime_string, str):
        return False
    
    try:
        datetime.strptime(datetime_string, format_string)
        return True
    except ValueError:
        return False

def validate_decimal(value: Union[str, int, float], precision: int = 2) -> bool:
    """
    Validate decimal value
    """
    if value is None:
        return False
    
    try:
        decimal_value = Decimal(str(value))
        
        # Check precision
        if precision is not None:
            decimal_places = decimal_value.as_tuple().exponent
            if decimal_places is not None and abs(decimal_places) > precision:
                return False
        
        return True
    except (InvalidOperation, ValueError):
        return False

def validate_integer(value: Union[str, int], min_value: Optional[int] = None, max_value: Optional[int] = None) -> bool:
    """
    Validate integer value with optional range
    """
    if value is None:
        return False
    
    try:
        int_value = int(value)
        
        if min_value is not None and int_value < min_value:
            return False
        
        if max_value is not None and int_value > max_value:
            return False
        
        return True
    except (ValueError, TypeError):
        return False

def validate_float(value: Union[str, int, float], min_value: Optional[float] = None, max_value: Optional[float] = None) -> bool:
    """
    Validate float value with optional range
    """
    if value is None:
        return False
    
    try:
        float_value = float(value)
        
        if min_value is not None and float_value < min_value:
            return False
        
        if max_value is not None and float_value > max_value:
            return False
        
        return True
    except (ValueError, TypeError):
        return False

def validate_boolean(value: Any) -> bool:
    """
    Validate boolean value
    """
    if isinstance(value, bool):
        return True
    
    if isinstance(value, str):
        return value.lower() in ['true', 'false', '1', '0', 'yes', 'no', 'on', 'off']
    
    if isinstance(value, (int, float)):
        return value in [0, 1]
    
    return False

def validate_enum(value: Any, allowed_values: List[Any]) -> bool:
    """
    Validate value against allowed enum values
    """
    if value is None:
        return False
    
    return value in allowed_values

def validate_regex(value: str, pattern: str) -> bool:
    """
    Validate string against regex pattern
    """
    if not value or not isinstance(value, str):
        return False
    
    try:
        return bool(re.match(pattern, value))
    except re.error:
        return False

def validate_length(value: str, min_length: int = 0, max_length: Optional[int] = None) -> bool:
    """
    Validate string length
    """
    if not isinstance(value, str):
        return False
    
    if len(value) < min_length:
        return False
    
    if max_length is not None and len(value) > max_length:
        return False
    
    return True

def validate_required_fields(data: Dict[str, Any], required_fields: List[str]) -> Dict[str, Any]:
    """
    Validate that all required fields are present and not empty
    """
    result = {
        "is_valid": True,
        "missing_fields": [],
        "empty_fields": []
    }
    
    for field in required_fields:
        if field not in data:
            result["missing_fields"].append(field)
            result["is_valid"] = False
        elif data[field] is None or (isinstance(data[field], str) and not data[field].strip()):
            result["empty_fields"].append(field)
            result["is_valid"] = False
    
    return result

def validate_json_schema(data: Dict[str, Any], schema: Dict[str, Any]) -> Dict[str, Any]:
    """
    Simple JSON schema validation
    """
    result = {
        "is_valid": True,
        "errors": []
    }
    
    for field, rules in schema.items():
        if field not in data:
            if rules.get("required", False):
                result["errors"].append(f"Field '{field}' is required")
                result["is_valid"] = False
            continue
        
        value = data[field]
        
        # Type validation
        expected_type = rules.get("type")
        if expected_type == "string" and not isinstance(value, str):
            result["errors"].append(f"Field '{field}' must be a string")
            result["is_valid"] = False
        elif expected_type == "integer" and not isinstance(value, int):
            result["errors"].append(f"Field '{field}' must be an integer")
            result["is_valid"] = False
        elif expected_type == "number" and not isinstance(value, (int, float)):
            result["errors"].append(f"Field '{field}' must be a number")
            result["is_valid"] = False
        elif expected_type == "boolean" and not isinstance(value, bool):
            result["errors"].append(f"Field '{field}' must be a boolean")
            result["is_valid"] = False
        
        # Length validation for strings
        if isinstance(value, str) and "min_length" in rules:
            if len(value) < rules["min_length"]:
                result["errors"].append(f"Field '{field}' must be at least {rules['min_length']} characters")
                result["is_valid"] = False
        
        if isinstance(value, str) and "max_length" in rules:
            if len(value) > rules["max_length"]:
                result["errors"].append(f"Field '{field}' must be no more than {rules['max_length']} characters")
                result["is_valid"] = False
        
        # Range validation for numbers
        if isinstance(value, (int, float)) and "min" in rules:
            if value < rules["min"]:
                result["errors"].append(f"Field '{field}' must be at least {rules['min']}")
                result["is_valid"] = False
        
        if isinstance(value, (int, float)) and "max" in rules:
            if value > rules["max"]:
                result["errors"].append(f"Field '{field}' must be no more than {rules['max']}")
                result["is_valid"] = False
        
        # Enum validation
        if "enum" in rules:
            if value not in rules["enum"]:
                result["errors"].append(f"Field '{field}' must be one of {rules['enum']}")
                result["is_valid"] = False
    
    return result

def sanitize_string(value: str, max_length: Optional[int] = None) -> str:
    """
    Sanitize string input
    """
    if not isinstance(value, str):
        return str(value)
    
    # Remove null bytes and control characters
    value = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', value)
    
    # Strip whitespace
    value = value.strip()
    
    # Limit length
    if max_length and len(value) > max_length:
        value = value[:max_length]
    
    return value

def validate_credit_card(card_number: str) -> Dict[str, Any]:
    """
    Validate credit card number using Luhn algorithm
    """
    result = {
        "is_valid": False,
        "card_type": None,
        "error": None
    }
    
    if not card_number or not isinstance(card_number, str):
        result["error"] = "Invalid input"
        return result
    
    # Remove spaces and non-digits
    card_number = re.sub(r'\D', '', card_number)
    
    if len(card_number) < 13 or len(card_number) > 19:
        result["error"] = "Invalid card number length"
        return result
    
    # Luhn algorithm
    def luhn_checksum(card_num):
        def digits_of(n):
            return [int(d) for d in str(n)]
        digits = digits_of(card_num)
        odd_digits = digits[-1::-2]
        even_digits = digits[-2::-2]
        checksum = sum(odd_digits)
        for d in even_digits:
            checksum += sum(digits_of(d*2))
        return checksum % 10
    
    if luhn_checksum(card_number) == 0:
        result["is_valid"] = True
        
        # Determine card type
        if card_number.startswith('4'):
            result["card_type"] = "Visa"
        elif card_number.startswith('5') or card_number.startswith('2'):
            result["card_type"] = "Mastercard"
        elif card_number.startswith('3'):
            result["card_type"] = "American Express"
        elif card_number.startswith('6'):
            result["card_type"] = "Discover"
        else:
            result["card_type"] = "Unknown"
    else:
        result["error"] = "Invalid card number"
    
    return result

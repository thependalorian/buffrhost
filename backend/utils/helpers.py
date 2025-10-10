"""
Helper utility functions for Buffr Host platform.

This module provides common helper functions for data manipulation,
string operations, and general utility tasks used throughout the application.
"""

import re
import uuid
import random
import string
import unicodedata
from typing import Any, Dict, List, Optional, Union
from datetime import datetime, date, time


def generate_uuid() -> str:
    """
    Generate a UUID string.

    Returns:
        UUID as string
    """
    return str(uuid.uuid4())


def generate_random_string(length: int = 8, charset: str = None) -> str:
    """
    Generate a random string of specified length.

    Args:
        length: Length of the string to generate
        charset: Character set to use (defaults to alphanumeric)

    Returns:
        Random string
    """
    if charset is None:
        charset = string.ascii_letters + string.digits

    return ''.join(random.choice(charset) for _ in range(length))


def slugify(text: str, separator: str = '-') -> str:
    """
    Convert text to a URL-friendly slug.

    Args:
        text: Text to convert
        separator: Word separator character

    Returns:
        Slugified text
    """
    if not text:
        return ""

    # Convert to lowercase and normalize unicode
    text = unicodedata.normalize('NFKD', text.lower())

    # Remove non-alphanumeric characters except spaces and separators
    text = re.sub(r'[^\w\s' + separator + ']', '', text)

    # Replace spaces with separator
    text = re.sub(r'[\s_]+', separator, text)

    # Remove leading/trailing separators
    text = text.strip(separator)

    return text


def sanitize_html(html_content: str, allowed_tags: List[str] = None) -> str:
    """
    Sanitize HTML content by removing potentially dangerous tags.

    Args:
        html_content: HTML content to sanitize
        allowed_tags: List of allowed HTML tags

    Returns:
        Sanitized HTML content
    """
    if not html_content:
        return ""

    if allowed_tags is None:
        allowed_tags = ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li']

    # Remove script and style tags
    html_content = re.sub(r'<script[^>]*>.*?</script>', '', html_content, flags=re.DOTALL | re.IGNORECASE)
    html_content = re.sub(r'<style[^>]*>.*?</style>', '', html_content, flags=re.DOTALL | re.IGNORECASE)

    # Remove dangerous attributes
    dangerous_attrs = ['onload', 'onerror', 'onclick', 'onmouseover', 'onmouseout', 'onkeydown', 'onkeyup', 'onkeypress']
    for attr in dangerous_attrs:
        html_content = re.sub(f'{attr}[^\\s]*', '', html_content, flags=re.IGNORECASE)

    # Remove tags that are not in allowed list
    if allowed_tags:
        # Keep only allowed tags
        allowed_pattern = '|'.join(allowed_tags)
        html_content = re.sub(f'<(?!/?({allowed_pattern})\\b)[^>]*>', '', html_content, flags=re.IGNORECASE)

    return html_content


def truncate_string(text: str, max_length: int, suffix: str = "...") -> str:
    """
    Truncate a string to specified length with suffix.

    Args:
        text: Text to truncate
        max_length: Maximum length including suffix
        suffix: Suffix to add when truncating

    Returns:
        Truncated text
    """
    if not text or len(text) <= max_length:
        return text

    return text[:max_length - len(suffix)] + suffix


def extract_domain_from_email(email: str) -> Optional[str]:
    """
    Extract domain from email address.

    Args:
        email: Email address

    Returns:
        Domain part of email or None if invalid
    """
    if not email or '@' not in email:
        return None

    try:
        return email.split('@')[1].lower()
    except (IndexError, AttributeError):
        return None


def extract_phone_country_code(phone: str) -> Optional[str]:
    """
    Extract country code from international phone number.

    Args:
        phone: Phone number

    Returns:
        Country code or None if not found
    """
    if not phone:
        return None

    # Remove all non-digit characters except +
    digits = re.sub(r'[^\d+]', '', phone)

    if digits.startswith('+'):
        # Find the end of country code (usually 1-4 digits after +)
        for i in range(1, 5):
            if i < len(digits) and digits[i].isdigit():
                continue
            else:
                return digits[1:i] if i > 1 else None
        return digits[1:4]  # Fallback to first 3 digits

    return None


def format_phone_international(phone: str, country_code: str = "US") -> str:
    """
    Format phone number in international format.

    Args:
        phone: Phone number to format
        country_code: Country code for formatting

    Returns:
        Formatted international phone number
    """
    try:
        import phonenumbers

        parsed_number = phonenumbers.parse(phone, country_code)

        if phonenumbers.is_valid_number(parsed_number):
            return phonenumbers.format_number(
                parsed_number,
                phonenumbers.PhoneNumberFormat.INTERNATIONAL
            )
        else:
            return phone

    except Exception:
        return phone


def generate_initials(name: str) -> str:
    """
    Generate initials from a name.

    Args:
        name: Full name

    Returns:
        Initials (e.g., "John Doe" -> "JD")
    """
    if not name:
        return ""

    # Split by spaces and take first letter of each word
    words = name.strip().split()
    initials = []

    for word in words[:2]:  # Take first two words only
        if word:
            initials.append(word[0].upper())

    return ''.join(initials)[:2]  # Limit to 2 characters


def mask_string(text: str, visible_start: int = 2, visible_end: int = 2, mask_char: str = "*") -> str:
    """
    Mask a string, showing only start and end characters.

    Args:
        text: Text to mask
        visible_start: Number of characters to show at start
        visible_end: Number of characters to show at end
        mask_char: Character to use for masking

    Returns:
        Masked string
    """
    if not text:
        return ""

    text_len = len(text)

    if text_len <= visible_start + visible_end:
        return text

    visible_part = text[:visible_start] + text[-visible_end:]
    masked_part = mask_char * (text_len - visible_start - visible_end)

    return visible_part[:visible_start] + masked_part + visible_part[-visible_end:]


def normalize_phone(phone: str) -> str:
    """
    Normalize phone number by removing all non-digit characters.

    Args:
        phone: Phone number to normalize

    Returns:
        Normalized phone number
    """
    if not phone:
        return ""

    return re.sub(r'\D', '', phone)


def normalize_email(email: str) -> str:
    """
    Normalize email address by lowercasing and trimming.

    Args:
        email: Email address to normalize

    Returns:
        Normalized email address
    """
    if not email:
        return ""

    return email.strip().lower()


def calculate_age(birth_date: Union[str, datetime, date]) -> int:
    """
    Calculate age from birth date.

    Args:
        birth_date: Birth date

    Returns:
        Age in years
    """
    try:
        if isinstance(birth_date, str):
            birth_date = datetime.fromisoformat(birth_date.replace('Z', '+00:00'))

        if isinstance(birth_date, datetime):
            birth_date = birth_date.date()

        today = date.today()
        age = today.year - birth_date.year

        # Adjust if birthday hasn't occurred this year
        if (today.month, today.day) < (birth_date.month, birth_date.day):
            age -= 1

        return max(0, age)

    except (ValueError, TypeError):
        return 0


def is_valid_uuid(value: str) -> bool:
    """
    Check if a string is a valid UUID.

    Args:
        value: String to check

    Returns:
        True if valid UUID, False otherwise
    """
    if not value:
        return False

    try:
        uuid.UUID(value)
        return True
    except (ValueError, TypeError):
        return False


def parse_boolean(value: Any) -> bool:
    """
    Parse various values to boolean.

    Args:
        value: Value to parse

    Returns:
        Boolean value
    """
    if isinstance(value, bool):
        return value

    if isinstance(value, str):
        return value.lower() in ['true', '1', 'yes', 'on', 'enabled']

    if isinstance(value, (int, float)):
        return bool(value)

    return False


def safe_int(value: Any, default: int = 0) -> int:
    """
    Safely convert value to integer with default fallback.

    Args:
        value: Value to convert
        default: Default value if conversion fails

    Returns:
        Integer value or default
    """
    try:
        if isinstance(value, str):
            value = value.strip()

        return int(float(value)) if value else default
    except (ValueError, TypeError):
        return default


def safe_float(value: Any, default: float = 0.0) -> float:
    """
    Safely convert value to float with default fallback.

    Args:
        value: Value to convert
        default: Default value if conversion fails

    Returns:
        Float value or default
    """
    try:
        if isinstance(value, str):
            value = value.strip()

        return float(value) if value else default
    except (ValueError, TypeError):
        return default


def safe_str(value: Any, default: str = "") -> str:
    """
    Safely convert value to string with default fallback.

    Args:
        value: Value to convert
        default: Default value if conversion fails

    Returns:
        String value or default
    """
    if value is None:
        return default

    return str(value)


def deep_merge_dicts(base_dict: Dict[str, Any], update_dict: Dict[str, Any]) -> Dict[str, Any]:
    """
    Deep merge two dictionaries.

    Args:
        base_dict: Base dictionary
        update_dict: Dictionary with updates

    Returns:
        Merged dictionary
    """
    result = base_dict.copy()

    for key, value in update_dict.items():
        if key in result and isinstance(result[key], dict) and isinstance(value, dict):
            result[key] = deep_merge_dicts(result[key], value)
        else:
            result[key] = value

    return result


def flatten_dict(nested_dict: Dict[str, Any], prefix: str = "", separator: str = ".") -> Dict[str, Any]:
    """
    Flatten a nested dictionary.

    Args:
        nested_dict: Nested dictionary to flatten
        prefix: Key prefix for nested keys
        separator: Separator between keys

    Returns:
        Flattened dictionary
    """
    flattened = {}

    for key, value in nested_dict.items():
        new_key = f"{prefix}{separator}{key}" if prefix else key

        if isinstance(value, dict):
            flattened.update(flatten_dict(value, new_key, separator))
        elif isinstance(value, list):
            for i, item in enumerate(value):
                list_key = f"{new_key}{separator}{i}"
                if isinstance(item, dict):
                    flattened.update(flatten_dict(item, list_key, separator))
                else:
                    flattened[list_key] = item
        else:
            flattened[new_key] = value

    return flattened


def group_list_by_key(items: List[Dict[str, Any]], key: str) -> Dict[str, List[Dict[str, Any]]]:
    """
    Group a list of dictionaries by a key.

    Args:
        items: List of dictionaries to group
        key: Key to group by

    Returns:
        Dictionary with grouped items
    """
    grouped = {}

    for item in items:
        group_key = item.get(key)
        if group_key is not None:
            if group_key not in grouped:
                grouped[group_key] = []
            grouped[group_key].append(item)

    return grouped


def find_duplicates_in_list(items: List[Any]) -> List[Any]:
    """
    Find duplicate items in a list.

    Args:
        items: List to check for duplicates

    Returns:
        List of duplicate items
    """
    seen = set()
    duplicates = set()

    for item in items:
        if item in seen:
            duplicates.add(item)
        else:
            seen.add(item)

    return list(duplicates)


def remove_duplicates_from_list(items: List[Any], key: Optional[str] = None) -> List[Any]:
    """
    Remove duplicates from a list.

    Args:
        items: List to remove duplicates from
        key: Key to use for comparison (for dict items)

    Returns:
        List with duplicates removed
    """
    if not key:
        return list(dict.fromkeys(items))

    seen = set()
    result = []

    for item in items:
        item_key = item.get(key) if isinstance(item, dict) else item
        if item_key not in seen:
            seen.add(item_key)
            result.append(item)

    return result


def chunk_list(items: List[Any], chunk_size: int) -> List[List[Any]]:
    """
    Split a list into chunks of specified size.

    Args:
        items: List to chunk
        chunk_size: Size of each chunk

    Returns:
        List of chunks
    """
    if chunk_size <= 0:
        return [items]

    return [items[i:i + chunk_size] for i in range(0, len(items), chunk_size)]


def safe_get_dict_value(data: Dict[str, Any], key_path: str, default: Any = None, separator: str = ".") -> Any:
    """
    Safely get a nested dictionary value using dot notation.

    Args:
        data: Dictionary to search
        key_path: Dot-separated key path (e.g., "user.profile.name")
        default: Default value if key not found
        separator: Key separator

    Returns:
        Value at key path or default
    """
    keys = key_path.split(separator)
    current = data

    try:
        for key in keys:
            if isinstance(current, dict):
                current = current[key]
            else:
                return default
        return current
    except (KeyError, TypeError):
        return default


def set_dict_value(data: Dict[str, Any], key_path: str, value: Any, separator: str = ".") -> Dict[str, Any]:
    """
    Set a nested dictionary value using dot notation.

    Args:
        data: Dictionary to modify
        key_path: Dot-separated key path
        value: Value to set
        separator: Key separator

    Returns:
        Modified dictionary
    """
    keys = key_path.split(separator)
    current = data

    # Navigate to the parent of the target key
    for key in keys[:-1]:
        if key not in current:
            current[key] = {}
        current = current[key]

    # Set the final value
    current[keys[-1]] = value

    return data


def generate_random_color() -> str:
    """
    Generate a random hex color.

    Returns:
        Hex color string (e.g., "#FF5733")
    """
    return f"#{random.randint(0, 0xFFFFFF):06x}"


def format_bytes(bytes_value: int) -> str:
    """
    Format bytes to human-readable format.

    Args:
        bytes_value: Number of bytes

    Returns:
        Formatted string (e.g., "1.5 MB")
    """
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if bytes_value < 1024.0:
            return f"{bytes_value:.1f} {unit}"
        bytes_value /= 1024.0
    return f"{bytes_value:.1f} PB"


def is_empty(value: Any) -> bool:
    """
    Check if a value is empty (None, empty string, empty list, etc.).

    Args:
        value: Value to check

    Returns:
        True if empty, False otherwise
    """
    if value is None:
        return True

    if isinstance(value, str):
        return len(value.strip()) == 0

    if isinstance(value, (list, tuple, dict, set)):
        return len(value) == 0

    return False


def safe_divide(dividend: Union[int, float], divisor: Union[int, float], default: Union[int, float] = 0) -> Union[int, float]:
    """
    Safely divide two numbers.

    Args:
        dividend: Number to be divided
        divisor: Number to divide by
        default: Default value if division fails

    Returns:
        Division result or default
    """
    try:
        if divisor == 0:
            return default

        result = dividend / divisor

        # Check for infinity or NaN
        if result in (float('inf'), float('-inf')) or str(result) == 'nan':
            return default

        return result

    except (ZeroDivisionError, TypeError, ValueError):
        return default


def retry_function(func, max_retries: int = 3, delay: float = 1.0, backoff: float = 2.0):
    """
    Retry a function with exponential backoff.

    Args:
        func: Function to retry
        max_retries: Maximum number of retries
        delay: Initial delay between retries
        backoff: Backoff multiplier

    Returns:
        Function result or raises last exception
    """
    import time

    last_exception = None

    for attempt in range(max_retries + 1):
        try:
            return func()
        except Exception as e:
            last_exception = e

            if attempt < max_retries:
                time.sleep(delay * (backoff ** attempt))
            else:
                raise last_exception

    raise last_exception


"""
Formatting Utilities
Data formatting for display, currency, dates, and user-friendly output
"""

from typing import Union, Optional, Dict, Any
from datetime import datetime, date, time
from decimal import Decimal
import locale
import re

def format_currency(
    amount: Union[int, float, Decimal, str], 
    currency_code: str = "USD", 
    locale_code: str = "en_US"
) -> str:
    """
    Format amount as currency
    """
    try:
        # Convert to Decimal for precision
        if isinstance(amount, str):
            amount = Decimal(amount)
        elif isinstance(amount, (int, float)):
            amount = Decimal(str(amount))
        
        # Set locale for currency formatting
        try:
            locale.setlocale(locale.LC_ALL, locale_code)
        except locale.Error:
            # Fallback to default locale
            pass
        
        # Format based on currency
        if currency_code == "USD":
            return f"${amount:,.2f}"
        elif currency_code == "EUR":
            return f"€{amount:,.2f}"
        elif currency_code == "GBP":
            return f"£{amount:,.2f}"
        elif currency_code == "JPY":
            return f"¥{amount:,.0f}"
        else:
            return f"{currency_code} {amount:,.2f}"
    
    except (ValueError, TypeError, InvalidOperation):
        return f"{currency_code} 0.00"

def format_percentage(value: Union[int, float, Decimal], decimals: int = 2) -> str:
    """
    Format value as percentage
    """
    try:
        if isinstance(value, str):
            value = float(value)
        
        return f"{value:.{decimals}f}%"
    except (ValueError, TypeError):
        return "0.00%"

def format_date(
    date_value: Union[datetime, date, str], 
    format_string: str = "%Y-%m-%d",
    locale_code: str = "en_US"
) -> str:
    """
    Format date for display
    """
    try:
        if isinstance(date_value, str):
            # Try to parse common date formats
            for fmt in ["%Y-%m-%d", "%m/%d/%Y", "%d/%m/%Y", "%Y-%m-%d %H:%M:%S"]:
                try:
                    date_value = datetime.strptime(date_value, fmt)
                    break
                except ValueError:
                    continue
        
        if isinstance(date_value, datetime):
            return date_value.strftime(format_string)
        elif isinstance(date_value, date):
            return date_value.strftime(format_string)
        else:
            return str(date_value)
    
    except (ValueError, TypeError):
        return "Invalid Date"

def format_datetime(
    datetime_value: Union[datetime, str], 
    format_string: str = "%Y-%m-%d %H:%M:%S",
    timezone: Optional[str] = None
) -> str:
    """
    Format datetime for display
    """
    try:
        if isinstance(datetime_value, str):
            # Try to parse common datetime formats
            for fmt in ["%Y-%m-%d %H:%M:%S", "%Y-%m-%dT%H:%M:%S", "%m/%d/%Y %H:%M:%S"]:
                try:
                    datetime_value = datetime.strptime(datetime_value, fmt)
                    break
                except ValueError:
                    continue
        
        if isinstance(datetime_value, datetime):
            if timezone:
                # Handle timezone conversion if needed
                pass
            return datetime_value.strftime(format_string)
        else:
            return str(datetime_value)
    
    except (ValueError, TypeError):
        return "Invalid DateTime"

def format_phone(phone_number: str, country_code: str = "US") -> str:
    """
    Format phone number for display
    """
    try:
        import phonenumbers
        
        parsed_number = phonenumbers.parse(phone_number, country_code)
        
        if phonenumbers.is_valid_number(parsed_number):
            return phonenumbers.format_number(
                parsed_number, 
                phonenumbers.PhoneNumberFormat.INTERNATIONAL
            )
        else:
            return phone_number
    
    except Exception:
        return phone_number

def format_file_size(size_bytes: int) -> str:
    """
    Format file size in human-readable format
    """
    if size_bytes == 0:
        return "0 B"
    
    size_names = ["B", "KB", "MB", "GB", "TB", "PB"]
    i = 0
    while size_bytes >= 1024 and i < len(size_names) - 1:
        size_bytes /= 1024.0
        i += 1
    
    return f"{size_bytes:.1f} {size_names[i]}"

def format_duration(seconds: Union[int, float]) -> str:
    """
    Format duration in human-readable format
    """
    if seconds < 60:
        return f"{int(seconds)}s"
    elif seconds < 3600:
        minutes = int(seconds // 60)
        remaining_seconds = int(seconds % 60)
        return f"{minutes}m {remaining_seconds}s"
    elif seconds < 86400:
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        return f"{hours}h {minutes}m"
    else:
        days = int(seconds // 86400)
        hours = int((seconds % 86400) // 3600)
        return f"{days}d {hours}h"

def format_relative_time(datetime_value: Union[datetime, str]) -> str:
    """
    Format datetime as relative time (e.g., "2 hours ago")
    """
    try:
        if isinstance(datetime_value, str):
            datetime_value = datetime.fromisoformat(datetime_value.replace('Z', '+00:00'))
        
        now = datetime.utcnow()
        if datetime_value.tzinfo:
            now = now.replace(tzinfo=datetime_value.tzinfo)
        
        diff = now - datetime_value
        
        if diff.days > 0:
            if diff.days == 1:
                return "Yesterday"
            elif diff.days < 7:
                return f"{diff.days} days ago"
            elif diff.days < 30:
                weeks = diff.days // 7
                return f"{weeks} week{'s' if weeks > 1 else ''} ago"
            elif diff.days < 365:
                months = diff.days // 30
                return f"{months} month{'s' if months > 1 else ''} ago"
            else:
                years = diff.days // 365
                return f"{years} year{'s' if years > 1 else ''} ago"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"{hours} hour{'s' if hours > 1 else ''} ago"
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
        else:
            return "Just now"
    
    except Exception:
        return "Unknown"

def format_address(address_data: Dict[str, Any]) -> str:
    """
    Format address data into a readable string
    """
    parts = []
    
    if address_data.get("street"):
        parts.append(address_data["street"])
    
    if address_data.get("city"):
        parts.append(address_data["city"])
    
    if address_data.get("state"):
        parts.append(address_data["state"])
    
    if address_data.get("postal_code"):
        parts.append(address_data["postal_code"])
    
    if address_data.get("country"):
        parts.append(address_data["country"])
    
    return ", ".join(parts)

def format_name(first_name: str, last_name: str, middle_name: Optional[str] = None) -> str:
    """
    Format full name from components
    """
    parts = [first_name]
    
    if middle_name:
        parts.append(middle_name)
    
    parts.append(last_name)
    
    return " ".join(parts)

def format_initial_name(first_name: str, last_name: str) -> str:
    """
    Format name with first name initial (e.g., "J. Smith")
    """
    if not first_name or not last_name:
        return first_name or last_name or ""
    
    return f"{first_name[0].upper()}. {last_name.title()}"

def format_credit_card(card_number: str, mask_char: str = "*") -> str:
    """
    Format credit card number with masking
    """
    if not card_number or len(card_number) < 4:
        return card_number
    
    # Remove non-digits
    digits = re.sub(r'\D', '', card_number)
    
    if len(digits) < 4:
        return card_number
    
    # Show last 4 digits, mask the rest
    masked = mask_char * (len(digits) - 4) + digits[-4:]
    
    # Add spaces every 4 digits
    formatted = ' '.join([masked[i:i+4] for i in range(0, len(masked), 4)])
    
    return formatted

def format_ssn(ssn: str, mask_char: str = "*") -> str:
    """
    Format SSN with masking
    """
    if not ssn or len(ssn) < 4:
        return ssn
    
    # Remove non-digits
    digits = re.sub(r'\D', '', ssn)
    
    if len(digits) < 4:
        return ssn
    
    # Show last 4 digits, mask the rest
    masked = mask_char * (len(digits) - 4) + digits[-4:]
    
    # Add dashes
    if len(masked) == 9:
        return f"{masked[:3]}-{masked[3:5]}-{masked[5:]}"
    else:
        return masked

def format_phone_masked(phone_number: str, mask_char: str = "*") -> str:
    """
    Format phone number with masking
    """
    if not phone_number or len(phone_number) < 4:
        return phone_number
    
    # Remove non-digits
    digits = re.sub(r'\D', '', phone_number)
    
    if len(digits) < 4:
        return phone_number
    
    # Show last 4 digits, mask the rest
    masked = mask_char * (len(digits) - 4) + digits[-4:]
    
    # Add formatting
    if len(masked) == 10:
        return f"({masked[:3]}) {masked[3:6]}-{masked[6:]}"
    else:
        return masked

def format_number_with_commas(number: Union[int, float, str]) -> str:
    """
    Format number with comma separators
    """
    try:
        if isinstance(number, str):
            number = float(number)
        
        return f"{number:,.0f}"
    except (ValueError, TypeError):
        return str(number)

def format_decimal(number: Union[int, float, str], decimal_places: int = 2) -> str:
    """
    Format number with specific decimal places
    """
    try:
        if isinstance(number, str):
            number = float(number)
        
        return f"{number:.{decimal_places}f}"
    except (ValueError, TypeError):
        return str(number)

def format_boolean(value: Any, true_text: str = "Yes", false_text: str = "No") -> str:
    """
    Format boolean value as text
    """
    if isinstance(value, bool):
        return true_text if value else false_text
    
    if isinstance(value, str):
        return true_text if value.lower() in ['true', '1', 'yes', 'on'] else false_text
    
    if isinstance(value, (int, float)):
        return true_text if value else false_text
    
    return false_text

def format_list(items: list, separator: str = ", ", max_items: Optional[int] = None) -> str:
    """
    Format list of items as a string
    """
    if not items:
        return ""
    
    if max_items and len(items) > max_items:
        visible_items = items[:max_items]
        return separator.join(str(item) for item in visible_items) + f" and {len(items) - max_items} more"
    
    return separator.join(str(item) for item in items)

def format_json(data: Dict[str, Any], indent: int = 2) -> str:
    """
    Format dictionary as pretty JSON string
    """
    import json
    
    try:
        return json.dumps(data, indent=indent, default=str)
    except (TypeError, ValueError):
        return str(data)

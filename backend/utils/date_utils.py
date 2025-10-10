"""
Date utility functions for Buffr Host platform.

This module provides date and time operations including timezone handling,
date formatting, parsing, and date-related calculations.
"""

import pytz
from datetime import datetime, date, time, timedelta
from typing import Optional, List, Dict, Any, Union
import calendar

from config import settings


def get_timezone_offset(timezone_str: str = None) -> int:
    """
    Get timezone offset in hours from UTC.

    Args:
        timezone_str: Timezone string (uses settings default if None)

    Returns:
        Offset in hours
    """
    try:
        tz = timezone_str or settings.DEFAULT_TIMEZONE

        if tz == 'UTC':
            return 0

        timezone = pytz.timezone(tz)
        now = datetime.utcnow()
        offset = timezone.utcoffset(now)

        if offset:
            return int(offset.total_seconds() / 3600)

        return 0

    except Exception:
        return 0


def format_datetime(
    dt: Union[datetime, str],
    format_string: str = "%Y-%m-%d %H:%M:%S",
    timezone: str = None,
    locale: str = "en_US"
) -> str:
    """
    Format datetime with timezone support.

    Args:
        dt: Datetime object or ISO string
        format_string: Format string
        timezone: Target timezone
        locale: Locale for formatting

    Returns:
        Formatted datetime string
    """
    try:
        # Parse datetime if it's a string
        if isinstance(dt, str):
            try:
                dt = datetime.fromisoformat(dt.replace('Z', '+00:00'))
            except ValueError:
                # Try common formats
                for fmt in ["%Y-%m-%d %H:%M:%S", "%Y-%m-%dT%H:%M:%S", "%m/%d/%Y %H:%M:%S"]:
                    try:
                        dt = datetime.strptime(dt, fmt)
                        break
                    except ValueError:
                        continue

        if not isinstance(dt, datetime):
            return str(dt)

        # Convert timezone if specified
        if timezone and timezone != settings.DEFAULT_TIMEZONE:
            try:
                from_tz = pytz.timezone(settings.DEFAULT_TIMEZONE)
                to_tz = pytz.timezone(timezone)

                if dt.tzinfo:
                    dt = dt.astimezone(to_tz)
                else:
                    dt = from_tz.localize(dt).astimezone(to_tz)
            except Exception:
                pass  # Use original datetime if timezone conversion fails

        return dt.strftime(format_string)

    except Exception:
        return "Invalid DateTime"


def parse_date_range(
    start_date: Union[str, datetime, date],
    end_date: Union[str, datetime, date],
    inclusive: bool = True
) -> Dict[str, datetime]:
    """
    Parse date range and return datetime objects.

    Args:
        start_date: Start date
        end_date: End date
        inclusive: Whether end date is inclusive

    Returns:
        Dictionary with start and end datetime objects
    """
    result = {
        "start": None,
        "end": None,
        "error": None
    }

    try:
        # Parse start date
        if isinstance(start_date, str):
            result["start"] = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
        elif isinstance(start_date, datetime):
            result["start"] = start_date
        elif isinstance(start_date, date):
            result["start"] = datetime.combine(start_date, time.min)

        # Parse end date
        if isinstance(end_date, str):
            result["end"] = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
        elif isinstance(end_date, datetime):
            result["end"] = end_date
        elif isinstance(end_date, date):
            if inclusive:
                result["end"] = datetime.combine(end_date, time.max)
            else:
                result["end"] = datetime.combine(end_date, time.min)

        # Validate range
        if result["start"] and result["end"] and result["start"] >= result["end"]:
            result["error"] = "Start date must be before end date"

    except Exception as e:
        result["error"] = f"Invalid date format: {str(e)}"

    return result


def get_date_range(
    period: str = "today",
    reference_date: Union[datetime, date] = None
) -> Dict[str, datetime]:
    """
    Get date range for common periods.

    Args:
        period: Period type (today, yesterday, this_week, last_week, this_month, last_month, etc.)
        reference_date: Reference date (uses today if None)

    Returns:
        Dictionary with start and end datetime objects
    """
    if reference_date is None:
        reference_date = datetime.utcnow()
    elif isinstance(reference_date, date) and not isinstance(reference_date, datetime):
        reference_date = datetime.combine(reference_date, time.min)

    result = {
        "start": None,
        "end": None
    }

    if period == "today":
        result["start"] = datetime.combine(reference_date.date(), time.min)
        result["end"] = datetime.combine(reference_date.date(), time.max)

    elif period == "yesterday":
        yesterday = reference_date.date() - timedelta(days=1)
        result["start"] = datetime.combine(yesterday, time.min)
        result["end"] = datetime.combine(yesterday, time.max)

    elif period == "this_week":
        # Start from Monday of current week
        start_of_week = reference_date.date() - timedelta(days=reference_date.weekday())
        result["start"] = datetime.combine(start_of_week, time.min)
        result["end"] = datetime.combine(reference_date.date(), time.max)

    elif period == "last_week":
        # Last week (Monday to Sunday)
        last_week_end = reference_date.date() - timedelta(days=reference_date.weekday() + 1)
        last_week_start = last_week_end - timedelta(days=6)
        result["start"] = datetime.combine(last_week_start, time.min)
        result["end"] = datetime.combine(last_week_end, time.max)

    elif period == "this_month":
        # Current month
        start_of_month = reference_date.date().replace(day=1)
        result["start"] = datetime.combine(start_of_month, time.min)

        # End of month
        if reference_date.month == 12:
            end_of_month = reference_date.date().replace(year=reference_date.year + 1, month=1, day=1) - timedelta(days=1)
        else:
            end_of_month = reference_date.date().replace(month=reference_date.month + 1, day=1) - timedelta(days=1)

        result["end"] = datetime.combine(end_of_month, time.max)

    elif period == "last_month":
        # Previous month
        if reference_date.month == 1:
            last_month = 12
            year = reference_date.year - 1
        else:
            last_month = reference_date.month - 1
            year = reference_date.year

        # Start of last month
        start_of_last_month = reference_date.date().replace(year=year, month=last_month, day=1)
        result["start"] = datetime.combine(start_of_last_month, time.min)

        # End of last month
        if last_month == 12:
            end_of_last_month = start_of_last_month.replace(year=year + 1, month=1, day=1) - timedelta(days=1)
        else:
            end_of_last_month = start_of_last_month.replace(month=last_month + 1, day=1) - timedelta(days=1)

        result["end"] = datetime.combine(end_of_last_month, time.max)

    elif period == "last_7_days":
        result["start"] = reference_date - timedelta(days=7)
        result["end"] = reference_date

    elif period == "last_30_days":
        result["start"] = reference_date - timedelta(days=30)
        result["end"] = reference_date

    elif period == "last_90_days":
        result["start"] = reference_date - timedelta(days=90)
        result["end"] = reference_date

    return result


def add_business_days(start_date: date, days: int) -> date:
    """
    Add business days (excluding weekends) to a date.

    Args:
        start_date: Starting date
        days: Number of business days to add

    Returns:
        New date after adding business days
    """
    current_date = start_date
    added_days = 0

    while added_days < days:
        current_date += timedelta(days=1)

        # Skip weekends (Saturday = 5, Sunday = 6)
        if current_date.weekday() < 5:
            added_days += 1

    return current_date


def get_business_days_between(start_date: date, end_date: date) -> int:
    """
    Count business days between two dates.

    Args:
        start_date: Start date
        end_date: End date

    Returns:
        Number of business days
    """
    if start_date > end_date:
        return 0

    business_days = 0
    current_date = start_date

    while current_date <= end_date:
        if current_date.weekday() < 5:  # Monday to Friday
            business_days += 1
        current_date += timedelta(days=1)

    return business_days


def is_business_day(check_date: date) -> bool:
    """
    Check if a date is a business day (Monday to Friday).

    Args:
        check_date: Date to check

    Returns:
        True if business day, False otherwise
    """
    return check_date.weekday() < 5


def get_month_name(month_number: int, locale: str = "en") -> str:
    """
    Get month name from month number.

    Args:
        month_number: Month number (1-12)
        locale: Locale for month name

    Returns:
        Month name
    """
    try:
        return calendar.month_name[month_number]
    except (IndexError, KeyError):
        return f"Month {month_number}"


def get_day_name(day_number: int, locale: str = "en") -> str:
    """
    Get day name from day number (0 = Monday, 6 = Sunday).

    Args:
        day_number: Day number (0-6)
        locale: Locale for day name

    Returns:
        Day name
    """
    try:
        return calendar.day_name[day_number]
    except (IndexError, KeyError):
        return f"Day {day_number}"


def calculate_age(birth_date: Union[str, datetime, date], reference_date: Union[datetime, date] = None) -> int:
    """
    Calculate age in years from birth date.

    Args:
        birth_date: Birth date
        reference_date: Reference date for age calculation (uses today if None)

    Returns:
        Age in years
    """
    try:
        if isinstance(birth_date, str):
            birth_date = datetime.fromisoformat(birth_date.replace('Z', '+00:00'))

        if isinstance(birth_date, datetime):
            birth_date = birth_date.date()

        if reference_date is None:
            reference_date = date.today()
        elif isinstance(reference_date, datetime):
            reference_date = reference_date.date()

        age = reference_date.year - birth_date.year

        # Adjust if birthday hasn't occurred this year
        if (reference_date.month, reference_date.day) < (birth_date.month, birth_date.day):
            age -= 1

        return max(0, age)

    except Exception:
        return 0


def get_date_range_list(
    start_date: date,
    end_date: date,
    include_end: bool = True
) -> List[date]:
    """
    Generate list of dates between start and end dates.

    Args:
        start_date: Start date
        end_date: End date
        include_end: Whether to include end date

    Returns:
        List of dates
    """
    if start_date > end_date:
        return []

    dates = []
    current_date = start_date

    while current_date <= end_date:
        dates.append(current_date)

        if current_date == end_date and not include_end:
            break

        current_date += timedelta(days=1)

    return dates


def format_relative_time(
    target_datetime: Union[datetime, str],
    reference_datetime: Union[datetime, str] = None,
    locale: str = "en"
) -> str:
    """
    Format datetime as relative time (e.g., "2 hours ago").

    Args:
        target_datetime: Target datetime
        reference_datetime: Reference datetime (uses now if None)
        locale: Locale for formatting

    Returns:
        Relative time string
    """
    try:
        # Parse datetimes
        if isinstance(target_datetime, str):
            target_datetime = datetime.fromisoformat(target_datetime.replace('Z', '+00:00'))

        if reference_datetime is None:
            reference_datetime = datetime.utcnow()
        elif isinstance(reference_datetime, str):
            reference_datetime = datetime.fromisoformat(reference_datetime.replace('Z', '+00:00'))

        if not isinstance(target_datetime, datetime) or not isinstance(reference_datetime, datetime):
            return "Unknown"

        # Calculate difference
        diff = reference_datetime - target_datetime

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


def get_next_occurrence(
    target_time: time,
    reference_date: date = None,
    include_today: bool = True
) -> datetime:
    """
    Get next occurrence of a specific time.

    Args:
        target_time: Target time
        reference_date: Reference date (uses today if None)
        include_today: Whether to include today if time hasn't passed

    Returns:
        Next datetime occurrence
    """
    if reference_date is None:
        reference_date = date.today()

    target_datetime = datetime.combine(reference_date, target_time)
    now = datetime.utcnow()

    # If target time is today and hasn't passed, return today
    if (include_today and
        target_datetime.date() == now.date() and
        target_datetime > now):
        return target_datetime

    # Otherwise, return next day
    next_date = reference_date + timedelta(days=1)
    return datetime.combine(next_date, target_time)


def get_working_hours_range(
    start_hour: int = 9,
    end_hour: int = 17,
    reference_date: date = None
) -> Dict[str, datetime]:
    """
    Get working hours range for a date.

    Args:
        start_hour: Start hour (24-hour format)
        end_hour: End hour (24-hour format)
        reference_date: Reference date (uses today if None)

    Returns:
        Dictionary with start and end datetime
    """
    if reference_date is None:
        reference_date = date.today()

    start_time = time(start_hour, 0, 0)
    end_time = time(end_hour, 0, 0)

    return {
        "start": datetime.combine(reference_date, start_time),
        "end": datetime.combine(reference_date, end_time)
    }


def is_within_business_hours(
    check_datetime: datetime,
    start_hour: int = 9,
    end_hour: int = 17,
    business_days_only: bool = True
) -> bool:
    """
    Check if datetime is within business hours.

    Args:
        check_datetime: Datetime to check
        start_hour: Business start hour
        end_hour: Business end hour
        business_days_only: Only consider Monday-Friday

    Returns:
        True if within business hours, False otherwise
    """
    # Check if it's a business day
    if business_days_only and check_datetime.weekday() >= 5:
        return False

    # Check if within business hours
    start_time = time(start_hour, 0, 0)
    end_time = time(end_hour, 0, 0)

    check_time = check_datetime.time()

    return start_time <= check_time <= end_time


def get_quarter_dates(year: int) -> List[Dict[str, Any]]:
    """
    Get quarter date ranges for a year.

    Args:
        year: Year

    Returns:
        List of quarter date ranges
    """
    quarters = []

    for quarter in range(1, 5):
        if quarter == 1:
            start_month, end_month = 1, 3
        elif quarter == 2:
            start_month, end_month = 4, 6
        elif quarter == 3:
            start_month, end_month = 7, 9
        else:
            start_month, end_month = 10, 12

        start_date = date(year, start_month, 1)

        if end_month == 12:
            end_date = date(year, end_month, 31)
        else:
            end_date = date(year, end_month + 1, 1) - timedelta(days=1)

        quarters.append({
            "quarter": quarter,
            "year": year,
            "start_date": start_date,
            "end_date": end_date,
            "start_datetime": datetime.combine(start_date, time.min),
            "end_datetime": datetime.combine(end_date, time.max)
        })

    return quarters


def get_fiscal_year_dates(
    fiscal_year_start_month: int = 4,
    year: int = None
) -> Dict[str, Any]:
    """
    Get fiscal year date range.

    Args:
        fiscal_year_start_month: Month when fiscal year starts (1-12)
        year: Year (uses current year if None)

    Returns:
        Dictionary with fiscal year dates
    """
    if year is None:
        year = datetime.utcnow().year

    # Fiscal year starts in specified month
    if fiscal_year_start_month <= datetime.utcnow().month:
        start_year = year
        end_year = year + 1
    else:
        start_year = year - 1
        end_year = year

    start_date = date(start_year, fiscal_year_start_month, 1)

    if fiscal_year_start_month == 12:
        end_date = date(end_year, 12, 31)
    else:
        end_date = date(end_year, fiscal_year_start_month, 1) - timedelta(days=1)

    return {
        "fiscal_year": f"{start_year}-{end_year}",
        "start_date": start_date,
        "end_date": end_date,
        "start_datetime": datetime.combine(start_date, time.min),
        "end_datetime": datetime.combine(end_date, time.max)
    }


def calculate_duration(
    start_datetime: Union[datetime, str],
    end_datetime: Union[datetime, str],
    unit: str = "hours"
) -> float:
    """
    Calculate duration between two datetimes.

    Args:
        start_datetime: Start datetime
        end_datetime: End datetime
        unit: Unit for result ('seconds', 'minutes', 'hours', 'days')

    Returns:
        Duration in specified unit
    """
    try:
        # Parse datetimes
        if isinstance(start_datetime, str):
            start_datetime = datetime.fromisoformat(start_datetime.replace('Z', '+00:00'))

        if isinstance(end_datetime, str):
            end_datetime = datetime.fromisoformat(end_datetime.replace('Z', '+00:00'))

        if not isinstance(start_datetime, datetime) or not isinstance(end_datetime, datetime):
            return 0.0

        duration = end_datetime - start_datetime
        total_seconds = duration.total_seconds()

        if unit == "seconds":
            return total_seconds
        elif unit == "minutes":
            return total_seconds / 60
        elif unit == "hours":
            return total_seconds / 3600
        elif unit == "days":
            return total_seconds / 86400
        else:
            return total_seconds / 3600  # Default to hours

    except Exception:
        return 0.0


def format_duration(
    seconds: Union[int, float],
    format_type: str = "smart"
) -> str:
    """
    Format duration in human-readable format.

    Args:
        seconds: Duration in seconds
        format_type: Format type ('smart', 'short', 'long')

    Returns:
        Formatted duration string
    """
    try:
        total_seconds = int(seconds)

        if format_type == "short":
            if total_seconds < 60:
                return f"{total_seconds}s"
            elif total_seconds < 3600:
                return f"{total_seconds // 60}m"
            elif total_seconds < 86400:
                return f"{total_seconds // 3600}h"
            else:
                return f"{total_seconds // 86400}d"

        elif format_type == "long":
            days = total_seconds // 86400
            hours = (total_seconds % 86400) // 3600
            minutes = (total_seconds % 3600) // 60
            seconds = total_seconds % 60

            parts = []
            if days:
                parts.append(f"{days} day{'s' if days != 1 else ''}")
            if hours:
                parts.append(f"{hours} hour{'s' if hours != 1 else ''}")
            if minutes:
                parts.append(f"{minutes} minute{'s' if minutes != 1 else ''}")
            if seconds and not parts:  # Only show seconds if no larger units
                parts.append(f"{seconds} second{'s' if seconds != 1 else ''}")

            return ", ".join(parts) if parts else "0 seconds"

        else:  # smart format
            if total_seconds < 60:
                return f"{total_seconds} second{'s' if total_seconds != 1 else ''}"
            elif total_seconds < 3600:
                minutes = total_seconds // 60
                remaining_seconds = total_seconds % 60
                if remaining_seconds == 0:
                    return f"{minutes} minute{'s' if minutes != 1 else ''}"
                else:
                    return f"{minutes}m {remaining_seconds}s"
            elif total_seconds < 86400:
                hours = total_seconds // 3600
                remaining_minutes = (total_seconds % 3600) // 60
                if remaining_minutes == 0:
                    return f"{hours} hour{'s' if hours != 1 else ''}"
                else:
                    return f"{hours}h {remaining_minutes}m"
            else:
                days = total_seconds // 86400
                remaining_hours = (total_seconds % 86400) // 3600
                if remaining_hours == 0:
                    return f"{days} day{'s' if days != 1 else ''}"
                else:
                    return f"{days}d {remaining_hours}h"

    except (ValueError, TypeError):
        return "0 seconds"


def parse_datetime_string(
    datetime_string: str,
    formats: List[str] = None
) -> Optional[datetime]:
    """
    Parse datetime string with multiple format attempts.

    Args:
        datetime_string: Datetime string to parse
        formats: List of format strings to try

    Returns:
        Parsed datetime or None if parsing fails
    """
    if formats is None:
        formats = [
            "%Y-%m-%d %H:%M:%S",
            "%Y-%m-%dT%H:%M:%S",
            "%Y-%m-%d %H:%M",
            "%m/%d/%Y %H:%M:%S",
            "%d/%m/%Y %H:%M:%S",
            "%Y-%m-%d",
            "%m/%d/%Y",
            "%d/%m/%Y"
        ]

    for fmt in formats:
        try:
            return datetime.strptime(datetime_string, fmt)
        except ValueError:
            continue

    return None


def get_current_time_in_timezone(timezone: str = None) -> datetime:
    """
    Get current time in specified timezone.

    Args:
        timezone: Timezone string (uses settings default if None)

    Returns:
        Current datetime in timezone
    """
    try:
        tz = timezone or settings.DEFAULT_TIMEZONE

        if tz == 'UTC':
            return datetime.utcnow()

        timezone_obj = pytz.timezone(tz)
        return datetime.now(timezone_obj)

    except Exception:
        return datetime.utcnow()


def convert_timezone(
    dt: datetime,
    from_timezone: str,
    to_timezone: str
) -> datetime:
    """
    Convert datetime between timezones.

    Args:
        dt: Datetime to convert
        from_timezone: Source timezone
        to_timezone: Target timezone

    Returns:
        Converted datetime
    """
    try:
        from_tz = pytz.timezone(from_timezone)
        to_tz = pytz.timezone(to_timezone)

        # Localize if not already localized
        if dt.tzinfo is None:
            dt = from_tz.localize(dt)

        return dt.astimezone(to_tz)

    except Exception:
        return dt  # Return original if conversion fails


def get_timezones_list() -> List[Dict[str, str]]:
    """
    Get list of common timezones.

    Returns:
        List of timezone dictionaries with name and offset
    """
    common_timezones = [
        "UTC",
        "America/New_York",
        "America/Chicago",
        "America/Denver",
        "America/Los_Angeles",
        "Europe/London",
        "Europe/Paris",
        "Europe/Berlin",
        "Asia/Tokyo",
        "Asia/Shanghai",
        "Asia/Kolkata",
        "Australia/Sydney",
        "Africa/Johannesburg",
        "Africa/Cairo",
        "America/Toronto",
        "America/Vancouver"
    ]

    timezones_info = []

    for tz_name in common_timezones:
        try:
            tz = pytz.timezone(tz_name)
            offset = tz.utcoffset(datetime.utcnow())
            offset_hours = int(offset.total_seconds() / 3600) if offset else 0

            timezones_info.append({
                "name": tz_name,
                "offset": f"UTC{offset_hours:+d}:00" if offset_hours != 0 else "UTC",
                "offset_hours": offset_hours
            })

        except Exception:
            continue

    return timezones_info


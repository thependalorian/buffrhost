"""
Email utility functions for Buffr Host platform.

This module provides email operations including sending, validation,
and email-related helper functions for the application.
"""

import re
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from typing import Dict, List, Optional, Any, Union
from pathlib import Path
import logging

from config import settings

logger = logging.getLogger(__name__)


def send_email(
    to_email: Union[str, List[str]],
    subject: str,
    body: str,
    from_email: str = None,
    html_body: str = None,
    cc: List[str] = None,
    bcc: List[str] = None,
    attachments: List[Dict[str, Any]] = None,
    smtp_config: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Send an email using SMTP.

    Args:
        to_email: Recipient email(s)
        subject: Email subject
        body: Plain text body
        from_email: Sender email (uses settings default if None)
        html_body: HTML body (optional)
        cc: CC recipients
        bcc: BCC recipients
        attachments: List of attachment dictionaries with 'filename' and 'data'
        smtp_config: Custom SMTP configuration

    Returns:
        Dictionary with send result
    """
    result = {
        "success": False,
        "message_id": None,
        "error": None
    }

    try:
        # Normalize email addresses
        if isinstance(to_email, str):
            to_email = [to_email]

        if from_email is None:
            from_email = settings.SMTP_FROM_EMAIL

        if cc is None:
            cc = []

        if bcc is None:
            bcc = []

        # Validate email addresses
        all_recipients = to_email + cc + bcc

        for email in all_recipients:
            if not validate_email_address(email):
                result["error"] = f"Invalid email address: {email}"
                return result

        # Get SMTP configuration
        if smtp_config is None:
            smtp_config = {
                "host": settings.SMTP_HOST,
                "port": settings.SMTP_PORT,
                "username": settings.SMTP_USERNAME,
                "password": settings.SMTP_PASSWORD,
                "use_tls": True
            }

        # Create message
        if html_body:
            msg = MIMEMultipart('alternative')
            msg.attach(MIMEText(body, 'plain'))
            msg.attach(MIMEText(html_body, 'html'))
        else:
            msg = MIMEText(body, 'plain')

        msg['Subject'] = subject
        msg['From'] = from_email
        msg['To'] = ', '.join(to_email)

        if cc:
            msg['Cc'] = ', '.join(cc)

        if bcc:
            msg['Bcc'] = ', '.join(bcc)

        # Add attachments
        if attachments:
            for attachment in attachments:
                filename = attachment.get('filename')
                data = attachment.get('data')

                if filename and data:
                    part = MIMEBase('application', 'octet-stream')
                    part.set_payload(data)

                    # Encode file in ASCII characters to send by email
                    encoders.encode_base64(part)

                    # Add header as key/value pair to attachment part
                    part.add_header(
                        'Content-Disposition',
                        f"attachment; filename= {filename}",
                    )

                    msg.attach(part)

        # Send email
        with smtplib.SMTP(smtp_config['host'], smtp_config['port']) as server:
            if smtp_config['use_tls']:
                server.starttls()

            if smtp_config.get('username') and smtp_config.get('password'):
                server.login(smtp_config['username'], smtp_config['password'])

            # Combine all recipients for sending
            all_recipients = to_email + cc + bcc
            server.sendmail(from_email, all_recipients, msg.as_string())

        result.update({
            "success": True,
            "message_id": f"msg_{hash(str(msg))}"
        })

        logger.info(f"Email sent successfully to {to_email}")

    except smtplib.SMTPAuthenticationError as e:
        result["error"] = f"SMTP authentication failed: {str(e)}"
        logger.error(f"SMTP authentication failed: {str(e)}")
    except smtplib.SMTPConnectError as e:
        result["error"] = f"SMTP connection failed: {str(e)}"
        logger.error(f"SMTP connection failed: {str(e)}")
    except smtplib.SMTPException as e:
        result["error"] = f"SMTP error: {str(e)}"
        logger.error(f"SMTP error: {str(e)}")
    except Exception as e:
        result["error"] = f"Failed to send email: {str(e)}"
        logger.error(f"Failed to send email: {str(e)}")

    return result


def send_bulk_email(
    recipients: List[Dict[str, Any]],
    subject: str,
    body_template: str,
    from_email: str = None,
    html_template: str = None,
    personalization_data: Dict[str, Any] = None,
    batch_size: int = 50,
    delay_between_batches: float = 1.0
) -> Dict[str, Any]:
    """
    Send bulk emails with personalization.

    Args:
        recipients: List of recipient dictionaries with email and personalization data
        subject: Email subject
        body_template: Plain text template with {placeholder} syntax
        from_email: Sender email
        html_template: HTML template (optional)
        personalization_data: Global personalization data
        batch_size: Emails per batch
        delay_between_batches: Delay between batches in seconds

    Returns:
        Dictionary with bulk send results
    """
    import time

    result = {
        "success": False,
        "total_sent": 0,
        "total_failed": 0,
        "errors": [],
        "results": []
    }

    try:
        if personalization_data is None:
            personalization_data = {}

        # Process in batches
        for i in range(0, len(recipients), batch_size):
            batch = recipients[i:i + batch_size]

            for recipient in batch:
                recipient_email = recipient.get('email')
                recipient_data = {**personalization_data, **recipient}

                if not recipient_email:
                    result["errors"].append(f"Missing email for recipient: {recipient}")
                    result["total_failed"] += 1
                    continue

                # Personalize content
                personalized_body = body_template.format(**recipient_data) if body_template else ""
                personalized_html = html_template.format(**recipient_data) if html_template else None

                # Send email
                send_result = send_email(
                    to_email=recipient_email,
                    subject=subject,
                    body=personalized_body,
                    from_email=from_email,
                    html_body=personalized_html
                )

                if send_result["success"]:
                    result["total_sent"] += 1
                else:
                    result["total_failed"] += 1
                    result["errors"].append(f"Failed to send to {recipient_email}: {send_result['error']}")

                result["results"].append({
                    "email": recipient_email,
                    "success": send_result["success"],
                    "error": send_result.get("error")
                })

            # Delay between batches
            if i + batch_size < len(recipients):
                time.sleep(delay_between_batches)

        result["success"] = result["total_failed"] == 0

        logger.info(f"Bulk email completed: {result['total_sent']} sent, {result['total_failed']} failed")

    except Exception as e:
        result["error"] = f"Bulk email failed: {str(e)}"
        logger.error(f"Bulk email failed: {str(e)}")

    return result


def validate_email_address(email: str) -> bool:
    """
    Validate email address format.

    Args:
        email: Email address to validate

    Returns:
        True if valid, False otherwise
    """
    if not email or not isinstance(email, str):
        return False

    # Basic regex pattern for email validation
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

    if not re.match(pattern, email):
        return False

    # Additional checks
    if len(email) > 254:  # RFC 5321 limit
        return False

    local_part, domain = email.rsplit('@', 1)

    if len(local_part) > 64:  # RFC 5321 limit
        return False

    if not domain or '.' not in domain:
        return False

    return True


def validate_email_list(emails: List[str]) -> Dict[str, Any]:
    """
    Validate a list of email addresses.

    Args:
        emails: List of email addresses

    Returns:
        Dictionary with validation results
    """
    result = {
        "valid": True,
        "valid_emails": [],
        "invalid_emails": [],
        "errors": []
    }

    if not emails:
        result["valid"] = False
        result["errors"].append("No email addresses provided")
        return result

    for email in emails:
        if validate_email_address(email):
            result["valid_emails"].append(email)
        else:
            result["invalid_emails"].append(email)
            result["valid"] = False

    return result


def extract_emails_from_text(text: str) -> List[str]:
    """
    Extract email addresses from text.

    Args:
        text: Text to search for emails

    Returns:
        List of extracted email addresses
    """
    if not text:
        return []

    # Email regex pattern
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'

    matches = re.findall(email_pattern, text, re.IGNORECASE)

    # Filter valid emails
    valid_emails = []
    for match in matches:
        if validate_email_address(match):
            valid_emails.append(match)

    return list(set(valid_emails))  # Remove duplicates


def format_email_template(
    template: str,
    variables: Dict[str, Any],
    default_value: str = ""
) -> str:
    """
    Format an email template with variables.

    Args:
        template: Template string with {variable} placeholders
        variables: Dictionary of variables to substitute
        default_value: Default value for missing variables

    Returns:
        Formatted template string
    """
    try:
        # Create a safe dictionary with defaults
        safe_vars = {}
        for key, value in variables.items():
            if value is not None:
                safe_vars[key] = str(value)
            else:
                safe_vars[key] = default_value

        return template.format(**safe_vars)

    except (KeyError, ValueError) as e:
        logger.warning(f"Template formatting error: {str(e)}")
        return template


def create_email_template_context(
    user_data: Dict[str, Any],
    booking_data: Dict[str, Any] = None,
    property_data: Dict[str, Any] = None,
    custom_data: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Create context data for email templates.

    Args:
        user_data: User information
        booking_data: Booking information
        property_data: Property information
        custom_data: Additional custom data

    Returns:
        Dictionary with all context data
    """
    context = {
        "current_year": datetime.utcnow().year,
        "current_date": datetime.utcnow().strftime("%Y-%m-%d"),
        "app_name": settings.APP_NAME,
        "app_url": "https://buffr.host",  # Update with actual URL
        "support_email": settings.SMTP_FROM_EMAIL,
    }

    # Add user data
    if user_data:
        context.update({
            "user_name": user_data.get("full_name", ""),
            "user_email": user_data.get("email", ""),
            "user_first_name": user_data.get("full_name", "").split()[0] if user_data.get("full_name") else "",
        })

    # Add booking data
    if booking_data:
        context.update({
            "booking_id": booking_data.get("id", ""),
            "booking_reference": booking_data.get("booking_reference", ""),
            "check_in_date": booking_data.get("check_in", ""),
            "check_out_date": booking_data.get("check_out", ""),
            "room_type": booking_data.get("room_type", ""),
            "total_amount": booking_data.get("total_amount", ""),
            "guest_name": booking_data.get("guest_name", ""),
        })

    # Add property data
    if property_data:
        context.update({
            "property_name": property_data.get("name", ""),
            "property_address": property_data.get("address", ""),
            "property_phone": property_data.get("phone", ""),
        })

    # Add custom data
    if custom_data:
        context.update(custom_data)

    return context


def generate_email_verification_token(email: str) -> str:
    """
    Generate email verification token.

    Args:
        email: Email address to verify

    Returns:
        Verification token
    """
    import hashlib
    import secrets

    # Create a unique token based on email and timestamp
    timestamp = str(datetime.utcnow().timestamp())
    random_salt = secrets.token_hex(16)

    token_data = f"{email}:{timestamp}:{random_salt}"
    token_hash = hashlib.sha256(token_data.encode()).hexdigest()

    return f"{timestamp}:{random_salt}:{token_hash}"


def verify_email_token(token: str, email: str) -> bool:
    """
    Verify email verification token.

    Args:
        token: Token to verify
        email: Email address

    Returns:
        True if token is valid, False otherwise
    """
    try:
        parts = token.split(':')

        if len(parts) != 3:
            return False

        timestamp_str, salt, token_hash = parts

        # Recreate the hash
        timestamp = str(datetime.utcnow().timestamp())
        token_data = f"{email}:{timestamp_str}:{salt}"
        expected_hash = hashlib.sha256(token_data.encode()).hexdigest()

        return token_hash == expected_hash

    except Exception:
        return False


def generate_password_reset_token(email: str, expires_minutes: int = 60) -> str:
    """
    Generate password reset token.

    Args:
        email: Email address
        expires_minutes: Token expiration in minutes

    Returns:
        Password reset token
    """
    import jwt

    expiration = datetime.utcnow() + timedelta(minutes=expires_minutes)

    token_data = {
        "email": email,
        "purpose": "password_reset",
        "exp": expiration
    }

    return jwt.encode(token_data, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def verify_password_reset_token(token: str) -> Optional[str]:
    """
    Verify password reset token and return email.

    Args:
        token: Token to verify

    Returns:
        Email address if valid, None otherwise
    """
    import jwt

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])

        if payload.get("purpose") == "password_reset":
            return payload.get("email")

    except jwt.ExpiredSignatureError:
        logger.warning("Password reset token expired")
    except jwt.JWTError as e:
        logger.warning(f"Invalid password reset token: {str(e)}")

    return None


def create_email_signature(company_name: str = None, website: str = None, phone: str = None) -> str:
    """
    Create a professional email signature.

    Args:
        company_name: Company name
        website: Company website
        phone: Company phone

    Returns:
        HTML email signature
    """
    company = company_name or settings.APP_NAME
    site = website or "https://buffr.host"

    signature = f"""
    <div style="font-family: Arial, sans-serif; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 10px; margin-top: 20px;">
        <p><strong>{company}</strong></p>
    """

    if phone:
        signature += f"<p>Phone: {phone}</p>"

    signature += f"""
        <p>Website: <a href="{site}" style="color: #007cba;">{site}</a></p>
        <p>This email was sent automatically. Please do not reply to this message.</p>
    </div>
    """

    return signature


def create_html_email_template(
    title: str,
    content: str,
    header_image: str = None,
    footer_text: str = None,
    primary_color: str = "#007cba",
    secondary_color: str = "#f8f9fa"
) -> str:
    """
    Create a professional HTML email template.

    Args:
        title: Email title
        content: Email content (HTML)
        header_image: Header image URL
        footer_text: Footer text
        primary_color: Primary brand color
        secondary_color: Secondary background color

    Returns:
        Complete HTML email template
    """
    template = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{title}</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: white; }}
            .header {{ background-color: {primary_color}; color: white; padding: 20px; text-align: center; }}
            .content {{ padding: 30px; line-height: 1.6; color: #333; }}
            .footer {{ background-color: {secondary_color}; padding: 20px; text-align: center; font-size: 12px; color: #666; }}
            .button {{ display: inline-block; padding: 12px 24px; background-color: {primary_color}; color: white; text-decoration: none; border-radius: 4px; margin: 10px 0; }}
            .button:hover {{ opacity: 0.9; }}
        </style>
    </head>
    <body>
        <div class="container">
    """

    if header_image:
        template += f"""
            <div class="header">
                <img src="{header_image}" alt="{settings.APP_NAME}" style="max-width: 200px; height: auto;">
            </div>
        """

    template += f"""
            <div class="content">
                {content}
            </div>
            <div class="footer">
                {footer_text or f'Thank you for choosing {settings.APP_NAME}!'}

                <p style="margin-top: 20px; font-size: 11px;">
                    This email was sent to you because you are a valued customer.
                    If you no longer wish to receive these emails, please contact our support team.
                </p>
            </div>
        </div>
    </body>
    </html>
    """

    return template


def send_test_email(to_email: str, from_email: str = None) -> Dict[str, Any]:
    """
    Send a test email to verify email configuration.

    Args:
        to_email: Test recipient email
        from_email: Test sender email

    Returns:
        Dictionary with test result
    """
    subject = f"Test Email - {settings.APP_NAME}"
    body = f"""
    This is a test email from {settings.APP_NAME}.

    If you received this email, your email configuration is working correctly.

    Sent at: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}
    """

    return send_email(
        to_email=to_email,
        subject=subject,
        body=body,
        from_email=from_email
    )


def validate_email_domain(email: str) -> bool:
    """
    Validate email domain (basic check for common patterns).

    Args:
        email: Email address

    Returns:
        True if domain looks valid, False otherwise
    """
    if not email or '@' not in email:
        return False

    domain = email.split('@')[1].lower()

    # Check for suspicious patterns
    suspicious_patterns = [
        '10minutemail', 'guerrillamail', 'mailinator', 'tempmail',
        'throwaway', 'yopmail', 'maildrop', 'dispostable'
    ]

    if any(pattern in domain for pattern in suspicious_patterns):
        return False

    # Basic domain format check
    if not re.match(r'^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', domain):
        return False

    return True


def get_email_provider(email: str) -> Optional[str]:
    """
    Get email provider from email address.

    Args:
        email: Email address

    Returns:
        Email provider name or None
    """
    if not email or '@' not in email:
        return None

    domain = email.split('@')[1].lower()

    # Common email providers
    providers = {
        'gmail.com': 'Gmail',
        'yahoo.com': 'Yahoo',
        'outlook.com': 'Outlook',
        'hotmail.com': 'Hotmail',
        'icloud.com': 'iCloud',
        'me.com': 'Apple Mail',
        'live.com': 'Microsoft Live',
        'protonmail.com': 'ProtonMail',
        'mail.com': 'Mail.com'
    }

    return providers.get(domain)


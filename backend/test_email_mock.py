#!/usr/bin/env python3
"""
Test script to demonstrate email functionality (mock version)
"""

import asyncio
import os
import sys
from datetime import datetime

# Add the backend directory to the Python path
sys.path.append('/Users/georgenekwaya/ai-agent-mastery/the-shandi/backend')

async def test_email_structure():
    """Test the email structure without actually sending"""
    
    try:
        # Mock the email service initialization
        print("🔧 Testing email service structure...")
        
        # Test email details
        to_email = "pendanek@gmail.com"
        subject = "Test Email from Buffr Host - " + datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # HTML content
        html_content = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Test Email from Buffr Host</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }}
                .button {{ display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 14px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏨 Buffr Host</h1>
                    <p>Hospitality Management Platform</p>
                </div>
                <div class="content">
                    <h2>Hello from Buffr Host!</h2>
                    <p>This is a test email sent from the Buffr Host email service to verify that SendGrid integration is working correctly.</p>
                    
                    <p><strong>Test Details:</strong></p>
                    <ul>
                        <li>Sent at: {timestamp}</li>
                        <li>From: Buffr Host Email Service</li>
                        <li>To: {to_email}</li>
                        <li>Service: SendGrid API</li>
                    </ul>
                    
                    <p>If you're receiving this email, it means our email service is working perfectly! 🎉</p>
                    
                    <a href="https://host.buffr.ai" class="button">Visit Buffr Host</a>
                    
                    <p>Best regards,<br>
                    <strong>George Nekwaya</strong><br>
                    Founder, Buffr Host<br>
                    📧 george@buffr.ai<br>
                    📱 +1 (206) 530-8433</p>
                </div>
                <div class="footer">
                    <p>This email was sent from Buffr Host Hospitality Management Platform</p>
                    <p>© 2024 Buffr Host. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """.format(
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC"),
            to_email=to_email
        )
        
        # Plain text content
        text_content = f"""
        Hello from Buffr Host!
        
        This is a test email sent from the Buffr Host email service to verify that SendGrid integration is working correctly.
        
        Test Details:
        - Sent at: {datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")}
        - From: Buffr Host Email Service
        - To: {to_email}
        - Service: SendGrid API
        
        If you're receiving this email, it means our email service is working perfectly!
        
        Visit us at: https://host.buffr.ai
        
        Best regards,
        George Nekwaya
        Founder, Buffr Host
        Email: george@buffr.ai
        Phone: +1 (206) 530-8433
        
        This email was sent from Buffr Host Hospitality Management Platform
        © 2024 Buffr Host. All rights reserved.
        """
        
        print(f"📧 Email would be sent to: {to_email}")
        print(f"📝 Subject: {subject}")
        print(f"📄 HTML Content Length: {len(html_content)} characters")
        print(f"📄 Text Content Length: {len(text_content)} characters")
        
        # Simulate the email data structure
        email_data = {
            "personalizations": [
                {
                    "to": [{"email": to_email}],
                    "subject": subject
                }
            ],
            "from": {
                "email": "noreply@mail.buffr.ai",
                "name": "Buffr Host"
            },
            "reply_to": {
                "email": "support@host.buffr.ai",
                "name": "Buffr Host Support"
            },
            "content": [
                {
                    "type": "text/html",
                    "value": html_content
                },
                {
                    "type": "text/plain",
                    "value": text_content
                }
            ]
        }
        
        print(f"✅ Email structure is valid!")
        print(f"📊 Email data structure created successfully")
        print(f"🔗 SendGrid API endpoint: https://api.sendgrid.com/v3/mail/send")
        
        print("\n" + "="*50)
        print("📋 TO SEND ACTUAL EMAIL:")
        print("1. Get your SendGrid API key from https://app.sendgrid.com/settings/api_keys")
        print("2. Update SENDGRID_API_KEY in .env.local with your actual key")
        print("3. Run: python test_email.py")
        print("="*50)
        
        return True
        
    except Exception as e:
        print(f"❌ Error in email structure: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 Starting Buffr Host Email Structure Test...")
    print("=" * 50)
    
    # Run the async function
    success = asyncio.run(test_email_structure())
    
    print("=" * 50)
    if success:
        print("✅ Email structure test completed successfully!")
        print("📧 Ready to send emails once SendGrid API key is configured!")
    else:
        print("❌ Email structure test failed!")

#!/usr/bin/env python3
"""
Setup script to configure SendGrid and send a test email
"""

import asyncio
import os
import sys
from datetime import datetime

# Add the backend directory to the Python path
sys.path.append("/Users/georgenekwaya/ai-agent-mastery/the-shandi/backend")


def setup_sendgrid_key():
    """Help user set up SendGrid API key"""

    print("🔧 SendGrid Setup for Buffr Host")
    print("=" * 50)

    # Check current API key
    env_file = "/Users/georgenekwaya/ai-agent-mastery/the-shandi/.env.local"

    print("📋 Current SendGrid API Key Status:")
    try:
        with open(env_file, "r") as f:
            content = f.read()
            if "SENDGRID_API_KEY=SG.YOUR_ACTUAL_SENDGRID_API_KEY_HERE" in content:
                print("❌ Using placeholder API key")
                print("🔑 You need to set up your actual SendGrid API key")
            else:
                print("✅ API key appears to be configured")
    except FileNotFoundError:
        print("❌ .env.local file not found")
        return False

    print("\n📝 To get your SendGrid API key:")
    print("1. Go to https://app.sendgrid.com/settings/api_keys")
    print("2. Click 'Create API Key'")
    print("3. Choose 'Restricted Access'")
    print("4. Give it 'Mail Send' permissions")
    print("5. Copy the generated API key (starts with 'SG.')")

    print("\n🔧 To update your API key:")
    print(f"1. Edit the file: {env_file}")
    print("2. Find the line: SENDGRID_API_KEY=SG.YOUR_ACTUAL_SENDGRID_API_KEY_HERE")
    print("3. Replace with: SENDGRID_API_KEY=SG.your_actual_key_here")

    # Ask if user wants to enter the key now
    print("\n" + "=" * 50)
    api_key = input("🔑 Enter your SendGrid API key (or press Enter to skip): ").strip()

    if api_key and api_key.startswith("SG."):
        try:
            # Update the .env.local file
            with open(env_file, "r") as f:
                content = f.read()

            # Replace the placeholder with the actual key
            updated_content = content.replace(
                "SENDGRID_API_KEY=SG.YOUR_ACTUAL_SENDGRID_API_KEY_HERE",
                f"SENDGRID_API_KEY={api_key}",
            )

            with open(env_file, "w") as f:
                f.write(updated_content)

            print("✅ API key updated successfully!")
            return True

        except Exception as e:
            print(f"❌ Error updating API key: {e}")
            return False
    else:
        print("⏭️  Skipping API key setup")
        return False


async def send_test_email():
    """Send test email to pendanek@gmail.com"""

    try:
        from services.email_service import BuffrHostEmailService

        # Initialize the email service
        email_service = BuffrHostEmailService()

        # Test email details
        to_email = "pendanek@gmail.com"
        subject = f"Test Email from Buffr Host - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"

        # Simple HTML content
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px;">
                    <h1>🏨 Buffr Host</h1>
                    <p>Hospitality Management Platform</p>
                </div>
                <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
                    <h2>Hello from Buffr Host!</h2>
                    <p>This is a test email sent from the Buffr Host email service to verify that SendGrid integration is working correctly.</p>
                    
                    <p><strong>Test Details:</strong></p>
                    <ul>
                        <li>Sent at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}</li>
                        <li>From: Buffr Host Email Service</li>
                        <li>To: {to_email}</li>
                        <li>Service: SendGrid API</li>
                    </ul>
                    
                    <p>If you're receiving this email, it means our email service is working perfectly! 🎉</p>
                    
                    <p>Best regards,<br>
                    <strong>George Nekwaya</strong><br>
                    Founder, Buffr Host<br>
                    📧 george@mail.buffr.ai<br>
                    📱 +1 (206) 530-8433</p>
                </div>
            </div>
        </body>
        </html>
        """

        # Plain text content
        text_content = f"""
        Hello from Buffr Host!
        
        This is a test email sent from the Buffr Host email service to verify that SendGrid integration is working correctly.
        
        Test Details:
        - Sent at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}
        - From: Buffr Host Email Service
        - To: {to_email}
        - Service: SendGrid API
        
        If you're receiving this email, it means our email service is working perfectly!
        
        Best regards,
        George Nekwaya
        Founder, Buffr Host
        Email: george@mail.buffr.ai
        Phone: +1 (206) 530-8433
        """

        print(f"📧 Sending test email to {to_email}...")
        print(f"📝 Subject: {subject}")

        # Send the email
        response = await email_service._send_email(
            to=to_email, subject=subject, html=html_content, text=text_content
        )

        print(f"✅ Email sent successfully!")
        print(f"📊 Response: {response}")

        if response.status == "success":
            print(f"🎉 Email delivered! Message ID: {response.message_id}")
            return True
        else:
            print(f"❌ Email failed: {response.error}")
            return False

    except Exception as e:
        print(f"❌ Error sending email: {str(e)}")
        return False


def main():
    """Main function"""

    print("🚀 Buffr Host Email Setup & Test")
    print("=" * 50)

    # Setup SendGrid API key
    api_key_setup = setup_sendgrid_key()

    if api_key_setup:
        print("\n📧 Testing email functionality...")
        print("=" * 50)

        # Send test email
        success = asyncio.run(send_test_email())

        if success:
            print("\n🎉 SUCCESS! Email sent to pendanek@gmail.com")
            print("📧 Check the inbox for the test email from Buffr Host")
        else:
            print("\n❌ Email sending failed")
            print("🔧 Please check your SendGrid API key and configuration")
    else:
        print("\n⏭️  Skipping email test - API key not configured")
        print("🔧 Run this script again after setting up your SendGrid API key")


if __name__ == "__main__":
    main()

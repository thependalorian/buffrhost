#!/usr/bin/env python3
"""
Instructions for setting up SendGrid and sending test email
"""

import os
from datetime import datetime


def show_instructions():
    """Show instructions for setting up SendGrid"""

    print("🚀 Buffr Host Email Setup Instructions")
    print("=" * 60)

    print("\n📋 STEP 1: Get Your SendGrid API Key")
    print("-" * 40)
    print("1. Go to: https://app.sendgrid.com/settings/api_keys")
    print("2. Click 'Create API Key'")
    print("3. Choose 'Restricted Access'")
    print("4. Give it 'Mail Send' permissions")
    print("5. Copy the generated API key (starts with 'SG.')")

    print("\n🔧 STEP 2: Update Your Environment File")
    print("-" * 40)
    env_file = "/Users/georgenekwaya/ai-agent-mastery/the-shandi/.env.local"
    print(f"Edit this file: {env_file}")
    print("Find this line:")
    print("  SENDGRID_API_KEY=SG.YOUR_ACTUAL_SENDGRID_API_KEY_HERE")
    print("Replace with:")
    print("  SENDGRID_API_KEY=SG.your_actual_key_here")

    print("\n📧 STEP 3: Send Test Email")
    print("-" * 40)
    print("After updating the API key, run:")
    print("  cd /Users/georgenekwaya/ai-agent-mastery/the-shandi/backend")
    print("  source ../.env.local")
    print("  python test_email.py")

    print("\n📊 EMAIL DETAILS")
    print("-" * 40)
    print("To: pendanek@gmail.com")
    print("From: noreply@mail.buffr.ai (Buffr Host)")
    print("Subject: Test Email from Buffr Host")
    print("Content: Professional HTML email with Buffr Host branding")

    print("\n🎯 EMAIL CONTENT PREVIEW")
    print("-" * 40)
    print("The email will include:")
    print("• Buffr Host logo and branding")
    print("• Test confirmation message")
    print("• Timestamp and service details")
    print("• Contact information for George Nekwaya")
    print("• Professional HTML formatting")

    print("\n✅ VERIFICATION")
    print("-" * 40)
    print("After sending, check:")
    print("• pendanek@gmail.com inbox")
    print("• Spam/junk folder (if not in inbox)")
    print("• SendGrid dashboard for delivery status")

    print("\n🔗 USEFUL LINKS")
    print("-" * 40)
    print("• SendGrid Dashboard: https://app.sendgrid.com/")
    print("• API Keys: https://app.sendgrid.com/settings/api_keys")
    print("• Activity Feed: https://app.sendgrid.com/activity")
    print("• Buffr Host: https://host.buffr.ai")

    print("\n" + "=" * 60)
    print("📧 Ready to send professional emails from Buffr Host!")
    print("=" * 60)


def show_email_structure():
    """Show the email structure that will be sent"""

    print("\n📄 EMAIL STRUCTURE PREVIEW")
    print("=" * 60)

    html_preview = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Test Email from Buffr Host</title>
    </head>
    <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; padding: 20px; text-align: center; border-radius: 8px;">
                <h1>🏨 Buffr Host</h1>
                <p>Hospitality Management Platform</p>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
                <h2>Hello from Buffr Host!</h2>
                <p>This is a test email sent from the Buffr Host email service...</p>
                
                <p><strong>Test Details:</strong></p>
                <ul>
                    <li>Sent at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}</li>
                    <li>From: Buffr Host Email Service</li>
                    <li>To: pendanek@gmail.com</li>
                    <li>Service: SendGrid API</li>
                </ul>
                
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

    print(html_preview)
    print("\n" + "=" * 60)


if __name__ == "__main__":
    show_instructions()
    show_email_structure()

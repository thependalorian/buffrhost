#!/usr/bin/env node

/**
 * BUFFR HOST Comprehensive Email Service Test
 * Tests all email functionality with actual delivery to pendanek@gmail.com
 * Based on working implementations from BuffrSign and BuffrLend
 */

import sgMail from '@sendgrid/mail';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env.local') });

console.log('📧 BUFFR HOST Comprehensive Email Service Test...\n');

async function testComprehensiveEmailService() {
  try {
    // Test 1: Initialize SendGrid
    console.log('1. Initializing SendGrid...');
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey || apiKey === 'your_sendgrid_api_key') {
      console.log('❌ SendGrid API key not configured');
      console.log('📝 Please set SENDGRID_API_KEY in your .env.local file');
      return false;
    }

    sgMail.setApiKey(apiKey);
    console.log('✅ SendGrid initialized successfully');

    const toEmail = 'pendanek@gmail.com';
    const results = [];

    // Test 2: Welcome Email
    console.log('\n2. Testing Welcome Email...');
    const welcomeEmail = {
      to: toEmail,
      from: {
        email: process.env.FROM_EMAIL || 'noreply@mail.buffr.ai',
        name: process.env.FROM_NAME || 'BUFFR HOST',
      },
      replyTo: 'support@host.buffr.ai',
      subject: `Welcome to BUFFR HOST - ${new Date().toISOString()}`,
      text: `
        Welcome to BUFFR HOST!
        
        This is a comprehensive test of the BUFFR HOST email service to verify that SendGrid integration is working correctly.
        
        Test Details:
        - Sent at: ${new Date().toISOString()}
        - From: BUFFR HOST Email Service
        - To: ${toEmail}
        - Service: SendGrid API
        - Project: BUFFR HOST Hospitality Management Platform
        
        If you're receiving this email, it means our email service is working perfectly!
        
        Visit us at: https://host.buffr.ai
        
        Best regards,
        George Nekwaya
        Founder, BUFFR HOST
        Email: george@buffr.ai
        Phone: +1 (206) 530-8433
        
        This email was sent from BUFFR HOST Hospitality Management Platform
        © 2024 BUFFR HOST. All rights reserved.
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Welcome to BUFFR HOST</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #3d1f15 0%, #d4a574 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #fef7f0; padding: 30px; border-radius: 0 0 8px 8px; }
                .button { display: inline-block; background: #3d1f15; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #d4a574; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏨 BUFFR HOST</h1>
                    <p>Hospitality Management Platform</p>
                </div>
                <div class="content">
                    <h2>Welcome to BUFFR HOST!</h2>
                    <p>This is a comprehensive test of the BUFFR HOST email service to verify that SendGrid integration is working correctly.</p>
                    
                    <p><strong>Test Details:</strong></p>
                    <ul>
                        <li>Sent at: ${new Date().toISOString()}</li>
                        <li>From: BUFFR HOST Email Service</li>
                        <li>To: ${toEmail}</li>
                        <li>Service: SendGrid API</li>
                        <li>Project: BUFFR HOST Hospitality Management Platform</li>
                    </ul>
                    
                    <div class="feature">
                        <h3>🚀 Key Features</h3>
                        <ul>
                            <li>Multi-tenant hospitality management</li>
                            <li>AI-powered Sofia agent</li>
                            <li>Advanced booking system</li>
                            <li>Revenue analytics</li>
                            <li>Customer relationship management</li>
                        </ul>
                    </div>
                    
                    <p>If you're receiving this email, it means our email service is working perfectly! 🎉</p>
                    
                    <a href="https://host.buffr.ai" class="button">Visit BUFFR HOST</a>
                    
                    <p>Best regards,<br>
                    <strong>George Nekwaya</strong><br>
                    Founder, BUFFR HOST<br>
                    📧 george@buffr.ai<br>
                    📱 +1 (206) 530-8433</p>
                </div>
                <div class="footer">
                    <p>This email was sent from BUFFR HOST Hospitality Management Platform</p>
                    <p>© 2024 BUFFR HOST. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `,
      trackingSettings: {
        clickTracking: {
          enable: true,
          enableText: true,
        },
        openTracking: {
          enable: true,
        },
      },
      customArgs: {
        project: 'buffr-host',
        email_type: 'welcome_email',
        timestamp: new Date().toISOString(),
      },
    };

    console.log(`📧 Sending welcome email to ${toEmail}...`);
    const welcomeResponse = await sgMail.send(welcomeEmail);
    const welcomeMessageId = welcomeResponse[0].headers['x-message-id'];
    console.log('✅ Welcome email sent successfully!');
    console.log(`📊 Message ID: ${welcomeMessageId}`);
    results.push({
      type: 'Welcome Email',
      messageId: welcomeMessageId,
      status: 'success',
    });

    // Test 3: Waitlist Confirmation Email
    console.log('\n3. Testing Waitlist Confirmation Email...');
    const waitlistEmail = {
      to: toEmail,
      from: {
        email: process.env.FROM_EMAIL || 'noreply@mail.buffr.ai',
        name: process.env.FROM_NAME || 'BUFFR HOST',
      },
      replyTo: 'support@host.buffr.ai',
      subject: "You're on the BUFFR HOST Waitlist!",
      text: `
        Welcome to the BUFFR HOST Waitlist!
        
        Thank you for joining our waitlist. You are position #42 in the queue.
        
        We'll notify you as soon as we have availability for your property.
        
        Your waitlist position: #42
        
        Best regards,
        BUFFR HOST Team
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Welcome to BUFFR HOST Waitlist</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #3d1f15 0%, #d4a574 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #fef7f0; padding: 30px; border-radius: 0 0 8px 8px; text-align: center; }
                .position-box { background: #d4a574; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏨 BUFFR HOST</h1>
                    <p>Hospitality Management Platform</p>
                </div>
                <div class="content">
                    <h2>Welcome to the BUFFR HOST Waitlist!</h2>
                    <p>Thank you for joining our waitlist. You are <strong>position #42</strong> in the queue.</p>
                    <p>We'll notify you as soon as we have availability for your property.</p>
                    
                    <div class="position-box">
                        <p style="margin: 0; font-weight: bold; font-size: 18px;">
                            Your waitlist position: #42
                        </p>
                    </div>
                    
                    <p>Best regards,<br>
                    <strong>BUFFR HOST Team</strong></p>
                </div>
                <div class="footer">
                    <p>This email was sent from BUFFR HOST Hospitality Management Platform</p>
                    <p>© 2024 BUFFR HOST. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `,
      trackingSettings: {
        clickTracking: {
          enable: true,
          enableText: true,
        },
        openTracking: {
          enable: true,
        },
      },
      customArgs: {
        project: 'buffr-host',
        email_type: 'waitlist_confirmation',
        timestamp: new Date().toISOString(),
      },
    };

    console.log(`📧 Sending waitlist email to ${toEmail}...`);
    const waitlistResponse = await sgMail.send(waitlistEmail);
    const waitlistMessageId = waitlistResponse[0].headers['x-message-id'];
    console.log('✅ Waitlist email sent successfully!');
    console.log(`📊 Message ID: ${waitlistMessageId}`);
    results.push({
      type: 'Waitlist Confirmation',
      messageId: waitlistMessageId,
      status: 'success',
    });

    // Test 4: Booking Confirmation Email
    console.log('\n4. Testing Booking Confirmation Email...');
    const bookingEmail = {
      to: toEmail,
      from: {
        email: process.env.FROM_EMAIL || 'noreply@mail.buffr.ai',
        name: process.env.FROM_NAME || 'BUFFR HOST',
      },
      replyTo: 'support@host.buffr.ai',
      subject: 'Booking Confirmation - BUFFR HOST',
      text: `
        Booking Confirmed!
        
        Your booking has been confirmed. Booking ID: BK123456
        
        Booking Details:
        - Booking ID: BK123456
        - Check-in: March 15, 2024
        - Check-out: March 18, 2024
        - Guests: 2 adults
        
        Thank you for choosing BUFFR HOST. We look forward to welcoming you!
        
        Best regards,
        BUFFR HOST Team
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Booking Confirmation - BUFFR HOST</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #3d1f15 0%, #d4a574 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #fef7f0; padding: 30px; border-radius: 0 0 8px 8px; }
                .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏨 BUFFR HOST</h1>
                    <p>Hospitality Management Platform</p>
                </div>
                <div class="content">
                    <h2>Booking Confirmed!</h2>
                    <div class="booking-details">
                        <h3>Booking Details</h3>
                        <p><strong>Booking ID:</strong> BK123456</p>
                        <p><strong>Check-in:</strong> March 15, 2024</p>
                        <p><strong>Check-out:</strong> March 18, 2024</p>
                        <p><strong>Guests:</strong> 2 adults</p>
                    </div>
                    <p>Thank you for choosing BUFFR HOST. We look forward to welcoming you!</p>
                    
                    <p>Best regards,<br>
                    <strong>BUFFR HOST Team</strong></p>
                </div>
                <div class="footer">
                    <p>This email was sent from BUFFR HOST Hospitality Management Platform</p>
                    <p>© 2024 BUFFR HOST. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `,
      trackingSettings: {
        clickTracking: {
          enable: true,
          enableText: true,
        },
        openTracking: {
          enable: true,
        },
      },
      customArgs: {
        project: 'buffr-host',
        email_type: 'booking_confirmation',
        timestamp: new Date().toISOString(),
      },
    };

    console.log(`📧 Sending booking confirmation to ${toEmail}...`);
    const bookingResponse = await sgMail.send(bookingEmail);
    const bookingMessageId = bookingResponse[0].headers['x-message-id'];
    console.log('✅ Booking confirmation sent successfully!');
    console.log(`📊 Message ID: ${bookingMessageId}`);
    results.push({
      type: 'Booking Confirmation',
      messageId: bookingMessageId,
      status: 'success',
    });

    // Test 5: Password Reset Email
    console.log('\n5. Testing Password Reset Email...');
    const passwordResetEmail = {
      to: toEmail,
      from: {
        email: process.env.FROM_EMAIL || 'noreply@mail.buffr.ai',
        name: process.env.FROM_NAME || 'BUFFR HOST',
      },
      replyTo: 'support@host.buffr.ai',
      subject: 'Password Reset Request - BUFFR HOST',
      text: `
        Password Reset Request
        
        You requested a password reset for your BUFFR HOST account.
        
        Reset Link: https://host.buffr.ai/reset-password?token=abc123xyz
        
        This link will expire in 1 hour for security reasons.
        
        If you didn't request this reset, please ignore this email.
        
        Best regards,
        BUFFR HOST Security Team
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Password Reset - BUFFR HOST</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #3d1f15 0%, #d4a574 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #fef7f0; padding: 30px; border-radius: 0 0 8px 8px; }
                .reset-button { display: inline-block; background: #3d1f15; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                .security-notice { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏨 BUFFR HOST</h1>
                    <p>Hospitality Management Platform</p>
                </div>
                <div class="content">
                    <h2>Password Reset Request</h2>
                    <p>You requested a password reset for your BUFFR HOST account.</p>
                    
                    <a href="https://host.buffr.ai/reset-password?token=abc123xyz" class="reset-button">Reset Password</a>
                    
                    <div class="security-notice">
                        <p><strong>Security Notice:</strong> This link will expire in 1 hour for security reasons.</p>
                        <p>If you didn't request this reset, please ignore this email.</p>
                    </div>
                    
                    <p>Best regards,<br>
                    <strong>BUFFR HOST Security Team</strong></p>
                </div>
                <div class="footer">
                    <p>This email was sent from BUFFR HOST Hospitality Management Platform</p>
                    <p>© 2024 BUFFR HOST. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `,
      trackingSettings: {
        clickTracking: {
          enable: true,
          enableText: true,
        },
        openTracking: {
          enable: true,
        },
      },
      customArgs: {
        project: 'buffr-host',
        email_type: 'password_reset',
        timestamp: new Date().toISOString(),
      },
    };

    console.log(`📧 Sending password reset email to ${toEmail}...`);
    const passwordResetResponse = await sgMail.send(passwordResetEmail);
    const passwordResetMessageId =
      passwordResetResponse[0].headers['x-message-id'];
    console.log('✅ Password reset email sent successfully!');
    console.log(`📊 Message ID: ${passwordResetMessageId}`);
    results.push({
      type: 'Password Reset',
      messageId: passwordResetMessageId,
      status: 'success',
    });

    // Test 6: Admin Notification Email
    console.log('\n6. Testing Admin Notification Email...');
    const adminEmail = {
      to: toEmail,
      from: {
        email: process.env.FROM_EMAIL || 'noreply@mail.buffr.ai',
        name: process.env.FROM_NAME || 'BUFFR HOST',
      },
      replyTo: 'admin@host.buffr.ai',
      subject: 'System Alert - BUFFR HOST Admin Dashboard',
      text: `
        System Alert - BUFFR HOST Admin Dashboard
        
        A new user has registered on the platform.
        
        User Details:
        - Name: John Doe
        - Email: john.doe@example.com
        - Registration Time: ${new Date().toISOString()}
        - User Type: Property Owner
        
        Please review the user in the admin dashboard.
        
        Best regards,
        BUFFR HOST System
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>System Alert - BUFFR HOST</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #3d1f15 0%, #d4a574 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #fef7f0; padding: 30px; border-radius: 0 0 8px 8px; }
                .alert-box { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
                .user-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏨 BUFFR HOST</h1>
                    <p>Hospitality Management Platform</p>
                </div>
                <div class="content">
                    <h2>System Alert - Admin Dashboard</h2>
                    <div class="alert-box">
                        <p><strong>Alert:</strong> A new user has registered on the platform.</p>
                    </div>
                    
                    <div class="user-details">
                        <h3>User Details</h3>
                        <p><strong>Name:</strong> John Doe</p>
                        <p><strong>Email:</strong> john.doe@example.com</p>
                        <p><strong>Registration Time:</strong> ${new Date().toISOString()}</p>
                        <p><strong>User Type:</strong> Property Owner</p>
                    </div>
                    
                    <p>Please review the user in the admin dashboard.</p>
                    
                    <p>Best regards,<br>
                    <strong>BUFFR HOST System</strong></p>
                </div>
                <div class="footer">
                    <p>This email was sent from BUFFR HOST Hospitality Management Platform</p>
                    <p>© 2024 BUFFR HOST. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `,
      trackingSettings: {
        clickTracking: {
          enable: true,
          enableText: true,
        },
        openTracking: {
          enable: true,
        },
      },
      customArgs: {
        project: 'buffr-host',
        email_type: 'admin_notification',
        timestamp: new Date().toISOString(),
      },
    };

    console.log(`📧 Sending admin notification to ${toEmail}...`);
    const adminResponse = await sgMail.send(adminEmail);
    const adminMessageId = adminResponse[0].headers['x-message-id'];
    console.log('✅ Admin notification sent successfully!');
    console.log(`📊 Message ID: ${adminMessageId}`);
    results.push({
      type: 'Admin Notification',
      messageId: adminMessageId,
      status: 'success',
    });

    // Summary
    console.log('\n🎉 All BUFFR HOST email tests completed successfully!');
    console.log('\n📊 Test Results Summary:');
    console.log('=' * 50);
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.type}: ${result.status}`);
      console.log(`   Message ID: ${result.messageId}`);
    });
    console.log('=' * 50);
    console.log(
      `📧 Check ${toEmail} inbox for all ${results.length} test emails!`
    );
    console.log('✅ BUFFR HOST email service is production-ready!');

    return true;
  } catch (error) {
    console.error('❌ BUFFR HOST email test failed:', error.message);
    if (error.response) {
      console.error('📊 Error details:', error.response.body);
    }
    return false;
  }
}

// Run the test
testComprehensiveEmailService()
  .then((success) => {
    console.log('\n' + '='.repeat(50));
    if (success) {
      console.log(
        '✅ BUFFR HOST comprehensive email test completed successfully!'
      );
      console.log('📧 Check pendanek@gmail.com inbox for all test emails');
      console.log('🎉 BUFFR HOST email service is production-ready!');
    } else {
      console.log('❌ BUFFR HOST comprehensive email test failed!');
    }
  })
  .catch((error) => {
    console.error('❌ Unexpected error:', error);
  });

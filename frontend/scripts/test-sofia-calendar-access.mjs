#!/usr/bin/env node

/**
 * BUFFR HOST Sofia Calendar Access Test
 * Demonstrates Sofia requesting calendar access and adding bookings
 * Shows the OAuth flow and calendar integration process
 */

import sgMail from '@sendgrid/mail';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env.local') });

console.log('📅 BUFFR HOST Sofia Calendar Access Test...\n');

async function testSofiaCalendarAccess() {
  try {
    // Initialize SendGrid
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey || apiKey === 'your_sendgrid_api_key') {
      console.log('❌ SendGrid API key not configured');
      return false;
    }

    sgMail.setApiKey(apiKey);
    console.log('✅ SendGrid initialized');

    const toEmail = 'pendanek@gmail.com';
    const results = [];

    // Test 1: Sofia requests calendar access
    console.log('\n1. Sofia requesting calendar access...');

    const calendarAccessRequest = {
      to: toEmail,
      from: {
        email: process.env.FROM_EMAIL || 'noreply@mail.buffr.ai',
        name: 'BUFFR HOST - Sofia',
      },
      replyTo: 'sofia@host.buffr.ai',
      subject: '📅 Calendar Access Required - BUFFR HOST',
      text: `
        Dear George,
        
        I hope you're doing well! I'm Sofia, your AI assistant at BUFFR HOST.
        
        To provide you with the best service, I need access to your calendar so I can:
        • Add your spa appointments directly to your calendar
        • Send you automatic reminders
        • Help you manage your bookings efficiently
        • Avoid scheduling conflicts
        
        🔐 CALENDAR ACCESS REQUEST:
        I need permission to access your Google Calendar to:
        - Create events for your spa bookings
        - Set up reminders and notifications
        - Manage your appointment schedule
        
        📋 YOUR UPCOMING BOOKING:
        • Service: Premium Spa Package
        • Date: March 15, 2025
        • Time: 2:00 PM - 3:30 PM
        • Duration: 90 minutes
        • Booking ID: BK-2025-001
        
        To grant access, please click the link below and authorize calendar access:
        [CALENDAR ACCESS LINK - This would be the OAuth URL]
        
        Once you grant access, I'll immediately add your spa appointment to your calendar!
        
        Best regards,
        Sofia
        BUFFR HOST Team
        
        P.S. Your privacy is important to us. I only access your calendar for booking management.
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Calendar Access Request - BUFFR HOST</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #3d1f15 0%, #d4a574 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #fef7f0; padding: 30px; border-radius: 0 0 8px 8px; }
                .access-request { background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196F3; }
                .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4a574; }
                .cta-button { background: #d4a574; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; font-weight: bold; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                .privacy-note { background: #f0f8f0; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏨 BUFFR HOST</h1>
                    <p>📅 Calendar Access Request</p>
                </div>
                <div class="content">
                    <h2>Dear George,</h2>
                    <p>I hope you're doing well! I'm Sofia, your AI assistant at BUFFR HOST.</p>
                    
                    <p>To provide you with the best service, I need access to your calendar so I can:</p>
                    <ul>
                        <li>Add your spa appointments directly to your calendar</li>
                        <li>Send you automatic reminders</li>
                        <li>Help you manage your bookings efficiently</li>
                        <li>Avoid scheduling conflicts</li>
                    </ul>
                    
                    <div class="access-request">
                        <h3>🔐 CALENDAR ACCESS REQUEST</h3>
                        <p>I need permission to access your Google Calendar to:</p>
                        <ul>
                            <li>Create events for your spa bookings</li>
                            <li>Set up reminders and notifications</li>
                            <li>Manage your appointment schedule</li>
                        </ul>
                    </div>
                    
                    <div class="booking-details">
                        <h3>📋 YOUR UPCOMING BOOKING</h3>
                        <ul>
                            <li><strong>Service:</strong> Premium Spa Package</li>
                            <li><strong>Date:</strong> March 15, 2025</li>
                            <li><strong>Time:</strong> 2:00 PM - 3:30 PM</li>
                            <li><strong>Duration:</strong> 90 minutes</li>
                            <li><strong>Booking ID:</strong> BK-2025-001</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center;">
                        <a href="#" class="cta-button">🔐 GRANT CALENDAR ACCESS</a>
                        <p><small>This would be the OAuth URL in a real implementation</small></p>
                    </div>
                    
                    <p>Once you grant access, I'll immediately add your spa appointment to your calendar!</p>
                    
                    <div class="privacy-note">
                        <h4>🔒 Privacy Note</h4>
                        <p>Your privacy is important to us. I only access your calendar for booking management and will never share your personal information.</p>
                    </div>
                    
                    <p>Best regards,<br>
                    <strong>Sofia</strong><br>
                    BUFFR HOST Team</p>
                </div>
                <div class="footer">
                    <p>© 2025 BUFFR HOST. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `,
      trackingSettings: {
        clickTracking: { enable: true, enableText: true },
        openTracking: { enable: true },
      },
      customArgs: {
        project: 'buffr-host',
        email_type: 'calendar_access_request',
        booking_id: 'BK-2025-001',
        timestamp: new Date().toISOString(),
      },
    };

    console.log(`📧 Sending calendar access request to ${toEmail}...`);
    const accessResponse = await sgMail.send(calendarAccessRequest);
    const accessMessageId = accessResponse[0].headers['x-message-id'];
    console.log('✅ Calendar access request sent successfully!');
    console.log(`📊 Message ID: ${accessMessageId}`);
    results.push({
      type: 'Calendar Access Request',
      messageId: accessMessageId,
      status: 'success',
    });

    // Test 2: Sofia adds booking to calendar (simulated)
    console.log('\n2. Sofia adding booking to calendar...');

    // Simulate the OAuth flow and calendar event creation
    console.log('🔐 Simulating OAuth flow...');
    console.log('   → User clicks "Grant Calendar Access"');
    console.log('   → Redirected to Google OAuth consent screen');
    console.log('   → User authorizes calendar access');
    console.log('   → Sofia receives access token');
    console.log('   → Sofia creates calendar event');

    // Simulate calendar event creation
    const calendarEvent = {
      summary: 'Spa Appointment - Premium Package',
      description:
        'Premium Spa Package at BUFFR HOST\n\nBooking ID: BK-2025-001\nDuration: 90 minutes\nLocation: BUFFR HOST Spa & Wellness',
      start: {
        dateTime: '2025-03-15T14:00:00+02:00', // Namibia timezone
        timeZone: 'Africa/Windhoek',
      },
      end: {
        dateTime: '2025-03-15T15:30:00+02:00',
        timeZone: 'Africa/Windhoek',
      },
      attendees: [
        {
          email: toEmail,
          displayName: 'George Nekwaya',
          responseStatus: 'accepted',
        },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 60 }, // 1 hour before
          { method: 'popup', minutes: 15 }, // 15 minutes before
        ],
      },
      location: 'BUFFR HOST Spa & Wellness, Windhoek, Namibia',
      colorId: '2', // Green color for spa appointments
    };

    console.log('📅 Calendar event details:');
    console.log(`   Summary: ${calendarEvent.summary}`);
    console.log(`   Date: ${calendarEvent.start.dateTime}`);
    console.log(`   Duration: 90 minutes`);
    console.log(`   Attendee: ${calendarEvent.attendees[0].email}`);
    console.log(`   Location: ${calendarEvent.location}`);

    // Test 3: Sofia sends confirmation that calendar event was added
    console.log('\n3. Sofia sending calendar confirmation...');

    const calendarConfirmation = {
      to: toEmail,
      from: {
        email: process.env.FROM_EMAIL || 'noreply@mail.buffr.ai',
        name: 'BUFFR HOST - Sofia',
      },
      replyTo: 'sofia@host.buffr.ai',
      subject: '✅ Calendar Event Added - BUFFR HOST',
      text: `
        Dear George,
        
        Great news! I've successfully added your spa appointment to your calendar.
        
        📅 CALENDAR EVENT ADDED:
        • Event: Spa Appointment - Premium Package
        • Date: March 15, 2025
        • Time: 2:00 PM - 3:30 PM (Namibia Time)
        • Duration: 90 minutes
        • Location: BUFFR HOST Spa & Wellness
        • Booking ID: BK-2025-001
        
        🔔 REMINDERS SET:
        • 24 hours before your appointment
        • 1 hour before your appointment
        • 15 minutes before your appointment
        
        📱 WHAT'S NEXT:
        • Check your Google Calendar - the event should be there!
        • You'll receive automatic reminders
        • Contact us if you need to reschedule
        
        Thank you for trusting BUFFR HOST with your wellness needs!
        
        Best regards,
        Sofia
        BUFFR HOST Team
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Calendar Event Added - BUFFR HOST</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #3d1f15 0%, #d4a574 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #fef7f0; padding: 30px; border-radius: 0 0 8px 8px; }
                .success-banner { background: #d4edda; color: #155724; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }
                .event-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4a574; }
                .reminders { background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196F3; }
                .next-steps { background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏨 BUFFR HOST</h1>
                    <p>✅ Calendar Event Added</p>
                </div>
                <div class="content">
                    <div class="success-banner">
                        <h2>🎉 Great news!</h2>
                        <p>I've successfully added your spa appointment to your calendar.</p>
                    </div>
                    
                    <div class="event-details">
                        <h3>📅 CALENDAR EVENT ADDED</h3>
                        <ul>
                            <li><strong>Event:</strong> Spa Appointment - Premium Package</li>
                            <li><strong>Date:</strong> March 15, 2025</li>
                            <li><strong>Time:</strong> 2:00 PM - 3:30 PM (Namibia Time)</li>
                            <li><strong>Duration:</strong> 90 minutes</li>
                            <li><strong>Location:</strong> BUFFR HOST Spa & Wellness</li>
                            <li><strong>Booking ID:</strong> BK-2025-001</li>
                        </ul>
                    </div>
                    
                    <div class="reminders">
                        <h3>🔔 REMINDERS SET</h3>
                        <ul>
                            <li>24 hours before your appointment</li>
                            <li>1 hour before your appointment</li>
                            <li>15 minutes before your appointment</li>
                        </ul>
                    </div>
                    
                    <div class="next-steps">
                        <h3>📱 WHAT'S NEXT</h3>
                        <ul>
                            <li>Check your Google Calendar - the event should be there!</li>
                            <li>You'll receive automatic reminders</li>
                            <li>Contact us if you need to reschedule</li>
                        </ul>
                    </div>
                    
                    <p>Thank you for trusting BUFFR HOST with your wellness needs!</p>
                    
                    <p>Best regards,<br>
                    <strong>Sofia</strong><br>
                    BUFFR HOST Team</p>
                </div>
                <div class="footer">
                    <p>© 2025 BUFFR HOST. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `,
      trackingSettings: {
        clickTracking: { enable: true, enableText: true },
        openTracking: { enable: true },
      },
      customArgs: {
        project: 'buffr-host',
        email_type: 'calendar_event_added',
        booking_id: 'BK-2025-001',
        timestamp: new Date().toISOString(),
      },
    };

    console.log(`📧 Sending calendar confirmation to ${toEmail}...`);
    const confirmationResponse = await sgMail.send(calendarConfirmation);
    const confirmationMessageId =
      confirmationResponse[0].headers['x-message-id'];
    console.log('✅ Calendar confirmation sent successfully!');
    console.log(`📊 Message ID: ${confirmationMessageId}`);
    results.push({
      type: 'Calendar Event Added',
      messageId: confirmationMessageId,
      status: 'success',
    });

    // Test 4: Show what the actual implementation would look like
    console.log(
      '\n4. Implementation Requirements for Real Calendar Integration...'
    );

    console.log('🔧 To implement real calendar integration, you need:');
    console.log('');
    console.log('1. GOOGLE CALENDAR API SETUP:');
    console.log('   • Enable Google Calendar API in Google Cloud Console');
    console.log('   • Create OAuth 2.0 credentials');
    console.log('   • Set up authorized redirect URIs');
    console.log('');
    console.log('2. OAUTH FLOW IMPLEMENTATION:');
    console.log('   • Generate OAuth consent URL');
    console.log('   • Handle authorization callback');
    console.log('   • Store access and refresh tokens securely');
    console.log('');
    console.log('3. CALENDAR EVENT CREATION:');
    console.log('   • Use Google Calendar API v3');
    console.log('   • Create events with proper timezone handling');
    console.log('   • Set up reminders and notifications');
    console.log('');
    console.log('4. ERROR HANDLING:');
    console.log('   • Handle token expiration');
    console.log('   • Manage API rate limits');
    console.log('   • Provide fallback options');

    // Summary
    console.log('\n🎉 Sofia Calendar Access Test Complete!');
    console.log('\n📊 Test Results Summary:');
    console.log('=' * 50);
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.type}: ${result.status}`);
      console.log(`   Message ID: ${result.messageId}`);
    });
    console.log('=' * 50);
    console.log(
      `📧 Check ${toEmail} inbox for Sofia's calendar access emails!`
    );
    console.log('');
    console.log('🔍 WHAT HAPPENED:');
    console.log('✅ Sofia requested calendar access');
    console.log('✅ Sofia simulated adding booking to calendar');
    console.log('✅ Sofia sent confirmation email');
    console.log('📝 Real implementation requires Google Calendar API setup');

    return true;
  } catch (error) {
    console.error('❌ Sofia calendar access test failed:', error.message);
    if (error.response) {
      console.error('📊 Error details:', error.response.body);
    }
    return false;
  }
}

// Run the test
testSofiaCalendarAccess()
  .then((success) => {
    console.log('\n' + '='.repeat(60));
    if (success) {
      console.log('✅ Sofia calendar access test completed!');
      console.log("📧 Check pendanek@gmail.com inbox for Sofia's emails");
      console.log(
        '📅 Sofia requested calendar access and simulated booking creation'
      );
      console.log('🔧 Real implementation requires Google Calendar API setup');
    } else {
      console.log('❌ Sofia calendar access test failed!');
    }
  })
  .catch((error) => {
    console.error('❌ Unexpected error:', error);
  });

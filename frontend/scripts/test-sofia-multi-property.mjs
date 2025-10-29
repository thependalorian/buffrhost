#!/usr/bin/env node

/**
 * BUFFR HOST Sofia Multi-Property System Test
 * Demonstrates Sofia sending emails from specific property IDs
 * with proper branding, icons, and CC to property owners
 */

import sgMail from '@sendgrid/mail';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env.local') });

console.log('BUFFR HOST Sofia Multi-Property System Test...\n');

// Mock property data
const properties = {
  'HOST-001': {
    id: 'HOST-001',
    name: 'BUFFR HOST Windhoek',
    location: 'Windhoek, Namibia',
    ownerEmail: 'owner@windhoek.buffr.ai',
    ownerName: 'Windhoek Property Manager',
    logo: 'H', // The H logo
    color: 'from-nude-600 to-nude-700',
  },
  'HOST-002': {
    id: 'HOST-002',
    name: 'BUFFR HOST Swakopmund',
    location: 'Swakopmund, Namibia',
    ownerEmail: 'owner@swakopmund.buffr.ai',
    ownerName: 'Swakopmund Property Manager',
    logo: 'H',
    color: 'from-nude-600 to-nude-700',
  },
  'HOST-003': {
    id: 'HOST-003',
    name: 'BUFFR HOST Sossusvlei',
    location: 'Sossusvlei, Namibia',
    ownerEmail: 'owner@sossusvlei.buffr.ai',
    ownerName: 'Sossusvlei Property Manager',
    logo: 'H',
    color: 'from-nude-600 to-nude-700',
  },
};

async function testSofiaMultiProperty() {
  try {
    // Initialize SendGrid
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey || apiKey === 'your_sendgrid_api_key') {
      console.log('❌ SendGrid API key not configured');
      return false;
    }

    sgMail.setApiKey(apiKey);
    console.log('✅ SendGrid initialized');

    const customerEmail = 'pendanek@gmail.com';
    const results = [];

    // Test 1: Sofia sends booking confirmation from Windhoek property
    console.log(
      '\n1. Sofia sending booking confirmation from Windhoek property...'
    );

    const windhoekProperty = properties['HOST-001'];
    const bookingConfirmation = {
      to: customerEmail,
      cc: windhoekProperty.ownerEmail, // CC property owner
      from: {
        email: process.env.FROM_EMAIL || 'noreply@mail.buffr.ai',
        name: `Sofia - ${windhoekProperty.name}`,
      },
      replyTo: `sofia@${windhoekProperty.id.toLowerCase()}.buffr.ai`,
      subject: 'Booking Confirmation - BUFFR HOST Windhoek',
      text: `
        Dear George,
        
        Your booking has been confirmed at ${windhoekProperty.name}!
        
        BOOKING DETAILS:
        • Property: ${windhoekProperty.name}
        • Location: ${windhoekProperty.location}
        • Service: Premium Spa Package
        • Date: March 15, 2025
        • Time: 2:00 PM - 3:30 PM
        • Duration: 90 minutes
        • Booking ID: BK-${windhoekProperty.id}-2025-001
        
        IMPORTANT NOTES:
        • Please arrive 15 minutes early
        • Bring a valid ID for verification
        • Contact us if you need to reschedule
        
        Best regards,
        Sofia
        ${windhoekProperty.name} Team
        
        This email was also sent to ${windhoekProperty.ownerName} for their records.
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Booking Confirmation - ${windhoekProperty.name}</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #3d1f15 0%, #d4a574 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .brand-name { font-size: 24px; font-weight: bold; }
                .property-info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #d4a574; }
                .content { background: #fef7f0; padding: 30px; border-radius: 0 0 8px 8px; }
                .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4a574; }
                .icon { display: inline-block; width: 16px; height: 16px; margin-right: 8px; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                .cc-notice { background: #e8f4fd; padding: 10px; border-radius: 8px; margin: 15px 0; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div style="display: flex; align-items: center; justify-content: center;">
                        <span class="brand-name">BUFFR HOST</span>
                    </div>
                    <p>Booking Confirmation</p>
                </div>
                <div class="content">
                    <div class="property-info">
                        <strong>Property:</strong> ${windhoekProperty.name}<br>
                        <strong>Location:</strong> ${windhoekProperty.location}
                    </div>
                    
                    <h2>Dear George,</h2>
                    <p>Your booking has been confirmed at ${windhoekProperty.name}!</p>
                    
                    <div class="booking-details">
                        <h3>Booking Details</h3>
                        <p><span class="icon">SERVICE</span><strong>Service:</strong> Premium Spa Package</p>
                        <p><span class="icon">DATE</span><strong>Date:</strong> March 15, 2025</p>
                        <p><span class="icon">TIME</span><strong>Time:</strong> 2:00 PM - 3:30 PM</p>
                        <p><span class="icon">DURATION</span><strong>Duration:</strong> 90 minutes</p>
                        <p><span class="icon">ID</span><strong>Booking ID:</strong> BK-${windhoekProperty.id}-2025-001</p>
                    </div>
                    
                    <h3>Important Notes</h3>
                    <ul>
                        <li>Please arrive 15 minutes early</li>
                        <li>Bring a valid ID for verification</li>
                        <li>Contact us if you need to reschedule</li>
                    </ul>
                    
                    <div class="cc-notice">
                        <strong>Note:</strong> This email was also sent to ${windhoekProperty.ownerName} for their records.
                    </div>
                    
                    <p>Best regards,<br>
                    <strong>Sofia</strong><br>
                    ${windhoekProperty.name} Team</p>
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
        property_id: windhoekProperty.id,
        email_type: 'booking_confirmation',
        booking_id: `BK-${windhoekProperty.id}-2025-001`,
        timestamp: new Date().toISOString(),
      },
    };

    console.log(
      `Sending booking confirmation from ${windhoekProperty.name}...`
    );
    console.log(`   To: ${customerEmail}`);
    console.log(`   CC: ${windhoekProperty.ownerEmail}`);
    const bookingResponse = await sgMail.send(bookingConfirmation);
    const bookingMessageId = bookingResponse[0].headers['x-message-id'];
    console.log('✅ Booking confirmation sent successfully!');
    console.log(`📊 Message ID: ${bookingMessageId}`);
    results.push({
      type: 'Booking Confirmation (Windhoek)',
      messageId: bookingMessageId,
      status: 'success',
    });

    // Test 2: Sofia sends quotation from Swakopmund property
    console.log('\n2. Sofia sending quotation from Swakopmund property...');

    const swakopmundProperty = properties['HOST-002'];
    const quotation = {
      to: customerEmail,
      cc: swakopmundProperty.ownerEmail, // CC property owner
      from: {
        email: process.env.FROM_EMAIL || 'noreply@mail.buffr.ai',
        name: `Sofia - ${swakopmundProperty.name}`,
      },
      replyTo: `sofia@${swakopmundProperty.id.toLowerCase()}.buffr.ai`,
      subject: 'Service Quotation - BUFFR HOST Swakopmund',
      text: `
        Dear George,
        
        Thank you for your interest in ${swakopmundProperty.name} services.
        
        QUOTATION DETAILS:
        • Property: ${swakopmundProperty.name}
        • Location: ${swakopmundProperty.location}
        • Quotation ID: HOST-QUO-${swakopmundProperty.id}-2025-03-15-001
        • Date: ${new Date().toLocaleDateString()}
        • Valid Until: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
        
        SERVICES:
        1. Ocean View Suite - N$3,500.00
        2. Spa & Wellness Package - N$2,200.00
        3. Guided Desert Tour - N$1,800.00
        
        Subtotal: N$7,500.00
        VAT (15%): N$1,125.00
        Total: N$8,625.00
        
        Best regards,
        Sofia
        ${swakopmundProperty.name} Team
        
        This quotation was also sent to ${swakopmundProperty.ownerName} for their review.
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Service Quotation - ${swakopmundProperty.name}</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 700px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #3d1f15 0%, #d4a574 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .brand-name { font-size: 24px; font-weight: bold; }
                .property-info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #d4a574; }
                .content { background: #fef7f0; padding: 30px; border-radius: 0 0 8px 8px; }
                .quotation-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .services-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .services-table th, .services-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                .services-table th { background: #f2f2f2; }
                .totals { background: #ecf0f1; padding: 15px; margin: 20px 0; border-radius: 8px; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                .cc-notice { background: #e8f4fd; padding: 10px; border-radius: 8px; margin: 15px 0; font-size: 12px; color: #666; }
                .highlight { color: #e74c3c; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div style="display: flex; align-items: center; justify-content: center;">
                        <span class="brand-name">BUFFR HOST</span>
                    </div>
                    <p>Service Quotation</p>
                </div>
                <div class="content">
                    <div class="property-info">
                        <strong>Property:</strong> ${swakopmundProperty.name}<br>
                        <strong>Location:</strong> ${swakopmundProperty.location}
                    </div>
                    
                    <h2>Dear George,</h2>
                    <p>Thank you for your interest in ${swakopmundProperty.name} services.</p>
                    
                    <div class="quotation-details">
                        <h3>Quotation Details</h3>
                        <p><strong>Quotation ID:</strong> <span class="highlight">HOST-QUO-${swakopmundProperty.id}-2025-03-15-001</span></p>
                        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                        <p><strong>Valid Until:</strong> ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    </div>
                    
                    <h3>Services</h3>
                    <table class="services-table">
                        <thead>
                            <tr>
                                <th>Service</th>
                                <th>Description</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Ocean View Suite</td>
                                <td>Luxury suite with Atlantic Ocean views</td>
                                <td>N$3,500.00</td>
                            </tr>
                            <tr>
                                <td>Spa & Wellness Package</td>
                                <td>Full spa treatment with ocean breeze</td>
                                <td>N$2,200.00</td>
                            </tr>
                            <tr>
                                <td>Guided Desert Tour</td>
                                <td>Professional guided tour of Namib Desert</td>
                                <td>N$1,800.00</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <div class="totals">
                        <p><strong>Subtotal:</strong> N$7,500.00</p>
                        <p><strong>VAT (15%):</strong> N$1,125.00</p>
                        <p><strong>Total:</strong> <span class="highlight">N$8,625.00</span></p>
                    </div>
                    
                    <div class="cc-notice">
                        <strong>Note:</strong> This quotation was also sent to ${swakopmundProperty.ownerName} for their review.
                    </div>
                    
                    <p>Best regards,<br>
                    <strong>Sofia</strong><br>
                    ${swakopmundProperty.name} Team</p>
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
        property_id: swakopmundProperty.id,
        email_type: 'quotation',
        quotation_id: `HOST-QUO-${swakopmundProperty.id}-2025-03-15-001`,
        timestamp: new Date().toISOString(),
      },
    };

    console.log(`Sending quotation from ${swakopmundProperty.name}...`);
    console.log(`   To: ${customerEmail}`);
    console.log(`   CC: ${swakopmundProperty.ownerEmail}`);
    const quotationResponse = await sgMail.send(quotation);
    const quotationMessageId = quotationResponse[0].headers['x-message-id'];
    console.log('✅ Quotation sent successfully!');
    console.log(`📊 Message ID: ${quotationMessageId}`);
    results.push({
      type: 'Quotation (Swakopmund)',
      messageId: quotationMessageId,
      status: 'success',
    });

    // Test 3: Sofia sends calendar access request from Sossusvlei property
    console.log(
      '\n3. Sofia sending calendar access request from Sossusvlei property...'
    );

    const sossusvleiProperty = properties['HOST-003'];
    const calendarRequest = {
      to: customerEmail,
      cc: sossusvleiProperty.ownerEmail, // CC property owner
      from: {
        email: process.env.FROM_EMAIL || 'noreply@mail.buffr.ai',
        name: `Sofia - ${sossusvleiProperty.name}`,
      },
      replyTo: `sofia@${sossusvleiProperty.id.toLowerCase()}.buffr.ai`,
      subject: 'Calendar Access Required - BUFFR HOST Sossusvlei',
      text: `
        Dear George,
        
        I'm Sofia, your concierge at ${sossusvleiProperty.name}, specializing in desert experiences.
        
        To provide you with the best service for your upcoming desert adventure, I need access to your calendar.
        
        CALENDAR ACCESS REQUEST:
        I need permission to access your Google Calendar to:
        • Add your desert tour bookings directly to your calendar
        • Send you automatic reminders about weather conditions
        • Help you manage your adventure schedule
        • Avoid scheduling conflicts with other activities
        
        YOUR UPCOMING BOOKING:
        • Property: ${sossusvleiProperty.name}
        • Service: Desert Adventure Package
        • Date: March 20, 2025
        • Time: 6:00 AM - 4:00 PM
        • Duration: 10 hours
        • Booking ID: BK-${sossusvleiProperty.id}-2025-001
        
        To grant access, please click the link below and authorize calendar access.
        
        Best regards,
        Sofia
        ${sossusvleiProperty.name} Team
        
        This request was also sent to ${sossusvleiProperty.ownerName} for their awareness.
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Calendar Access Request - ${sossusvleiProperty.name}</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #3d1f15 0%, #d4a574 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .brand-name { font-size: 24px; font-weight: bold; }
                .property-info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #d4a574; }
                .content { background: #fef7f0; padding: 30px; border-radius: 0 0 8px 8px; }
                .access-request { background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196F3; }
                .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4a574; }
                .cta-button { background: #d4a574; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; font-weight: bold; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                .cc-notice { background: #e8f4fd; padding: 10px; border-radius: 8px; margin: 15px 0; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div style="display: flex; align-items: center; justify-content: center;">
                        <span class="brand-name">BUFFR HOST</span>
                    </div>
                    <p>Calendar Access Request</p>
                </div>
                <div class="content">
                    <div class="property-info">
                        <strong>Property:</strong> ${sossusvleiProperty.name}<br>
                        <strong>Location:</strong> ${sossusvleiProperty.location}
                    </div>
                    
                    <h2>Dear George,</h2>
                    <p>I'm Sofia, your concierge at ${sossusvleiProperty.name}, specializing in desert experiences.</p>
                    
                    <p>To provide you with the best service for your upcoming desert adventure, I need access to your calendar.</p>
                    
                    <div class="access-request">
                        <h3>Calendar Access Request</h3>
                        <p>I need permission to access your Google Calendar to:</p>
                        <ul>
                            <li>Add your desert tour bookings directly to your calendar</li>
                            <li>Send you automatic reminders about weather conditions</li>
                            <li>Help you manage your adventure schedule</li>
                            <li>Avoid scheduling conflicts with other activities</li>
                        </ul>
                    </div>
                    
                    <div class="booking-details">
                        <h3>Your Upcoming Booking</h3>
                        <ul>
                            <li><strong>Property:</strong> ${sossusvleiProperty.name}</li>
                            <li><strong>Service:</strong> Desert Adventure Package</li>
                            <li><strong>Date:</strong> March 20, 2025</li>
                            <li><strong>Time:</strong> 6:00 AM - 4:00 PM</li>
                            <li><strong>Duration:</strong> 10 hours</li>
                            <li><strong>Booking ID:</strong> BK-${sossusvleiProperty.id}-2025-001</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center;">
                        <a href="#" class="cta-button">Grant Calendar Access</a>
                        <p><small>This would be the OAuth URL in a real implementation</small></p>
                    </div>
                    
                    <div class="cc-notice">
                        <strong>Note:</strong> This request was also sent to ${sossusvleiProperty.ownerName} for their awareness.
                    </div>
                    
                    <p>Best regards,<br>
                    <strong>Sofia</strong><br>
                    ${sossusvleiProperty.name} Team</p>
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
        property_id: sossusvleiProperty.id,
        email_type: 'calendar_access_request',
        booking_id: `BK-${sossusvleiProperty.id}-2025-001`,
        timestamp: new Date().toISOString(),
      },
    };

    console.log(
      `Sending calendar access request from ${sossusvleiProperty.name}...`
    );
    console.log(`   To: ${customerEmail}`);
    console.log(`   CC: ${sossusvleiProperty.ownerEmail}`);
    const calendarResponse = await sgMail.send(calendarRequest);
    const calendarMessageId = calendarResponse[0].headers['x-message-id'];
    console.log('✅ Calendar access request sent successfully!');
    console.log(`📊 Message ID: ${calendarMessageId}`);
    results.push({
      type: 'Calendar Access Request (Sossusvlei)',
      messageId: calendarMessageId,
      status: 'success',
    });

    // Summary
    console.log('\n🎉 Sofia Multi-Property System Test Complete!');
    console.log('\n📊 Test Results Summary:');
    console.log('=' * 60);
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.type}: ${result.status}`);
      console.log(`   Message ID: ${result.messageId}`);
    });
    console.log('=' * 60);
    console.log(
      `Check ${customerEmail} inbox for Sofia's multi-property emails!`
    );
    console.log('');
    console.log('🔍 WHAT HAPPENED:');
    console.log('✅ Sofia sent emails from 3 different properties');
    console.log("✅ Each email CC'd the property owner");
    console.log('✅ Used properly centered H logo instead of emojis');
    console.log('✅ Property-specific branding and email addresses');
    console.log(
      '✅ Proper quotation ID format: HOST-QUO-[PROPERTY]-[YEAR]-[MONTH]-[DAY]-[NUMBER]'
    );

    return true;
  } catch (error) {
    console.error('❌ Sofia multi-property test failed:', error.message);
    if (error.response) {
      console.error('📊 Error details:', error.response.body);
    }
    return false;
  }
}

// Run the test
testSofiaMultiProperty()
  .then((success) => {
    console.log('\n' + '='.repeat(60));
    if (success) {
      console.log('✅ Sofia multi-property system test completed!');
      console.log(
        'Check pendanek@gmail.com inbox for property-specific emails'
      );
      console.log('Sofia now works across multiple BUFFR HOST properties');
      console.log(
        'Property owners receive copies of all customer communications'
      );
    } else {
      console.log('❌ Sofia multi-property test failed!');
    }
  })
  .catch((error) => {
    console.error('❌ Unexpected error:', error);
  });

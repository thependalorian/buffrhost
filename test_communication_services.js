// test_communication_services.js
// Test script for Buffr Host communication services

const { BuffrCommunicationService } = require('./lib/services/communication/BuffrCommunicationService');

async function testCommunicationServices() {
  console.log('🧪 Testing Buffr Host Communication Services');
  console.log('============================================\n');

  const testPropertyId = 'test-property-123';
  const commService = new BuffrCommunicationService(testPropertyId);

  // Test 1: Check service authorization status
  console.log('1️⃣ Testing Service Authorization Status...');
  try {
    const gmailAuth = await commService.checkServiceAuthorization('gmail');
    const outlookAuth = await commService.checkServiceAuthorization('outlook');
    const calendarAuth = await commService.checkServiceAuthorization('google_calendar');
    const whatsappAuth = await commService.checkServiceAuthorization('twilio_whatsapp');

    console.log(`   Gmail authorized: ${gmailAuth}`);
    console.log(`   Outlook authorized: ${outlookAuth}`);
    console.log(`   Google Calendar authorized: ${calendarAuth}`);
    console.log(`   WhatsApp authorized: ${whatsappAuth}`);
    console.log('   ✅ Service authorization check completed\n');
  } catch (error) {
    console.log('   ❌ Service authorization check failed:', error.message);
  }

  // Test 2: Test email sending (will fail without auth, but tests the flow)
  console.log('2️⃣ Testing Email Service (Dry Run)...');
  try {
    const emailResult = await commService.sendGuestEmail({
      guestEmail: 'test@example.com',
      subject: 'Test Booking Confirmation',
      body: 'This is a test email for Buffr Host booking confirmation.',
      template: 'booking_confirmation'
    });

    if (emailResult.success) {
      console.log('   ✅ Email sent successfully');
      console.log(`   Message ID: ${emailResult.messageId}`);
      console.log(`   Provider: ${emailResult.provider}`);
    } else {
      console.log(`   ⚠️ Email sending failed (expected without auth): ${emailResult.error}`);
    }
  } catch (error) {
    console.log('   ❌ Email service test error:', error.message);
  }
  console.log('');

  // Test 3: Test calendar booking (will fail without auth, but tests the flow)
  console.log('3️⃣ Testing Calendar Service (Dry Run)...');
  try {
    const calendarResult = await commService.scheduleBooking({
      guestName: 'John Doe',
      checkIn: '2024-12-25T14:00:00Z',
      checkOut: '2024-12-27T11:00:00Z',
      roomNumber: '101',
      guestCount: 2,
      details: 'Christmas holiday booking',
      guestEmail: 'john@example.com'
    });

    if (calendarResult.success) {
      console.log('   ✅ Calendar event created successfully');
      console.log(`   Event ID: ${calendarResult.eventId}`);
    } else {
      console.log(`   ⚠️ Calendar booking failed (expected without auth): ${calendarResult.error}`);
    }
  } catch (error) {
    console.log('   ❌ Calendar service test error:', error.message);
  }
  console.log('');

  // Test 4: Test WhatsApp service (will fail without auth, but tests the flow)
  console.log('4️⃣ Testing WhatsApp Service (Dry Run)...');
  try {
    const whatsappResult = await commService.sendWhatsAppMessage({
      phoneNumber: '+1234567890',
      content: 'Hello! Your booking at Buffr Host is confirmed. 🎉',
      template: 'booking_welcome'
    });

    if (whatsappResult.success) {
      console.log('   ✅ WhatsApp message sent successfully');
      console.log(`   Message ID: ${whatsappResult.messageId}`);
      console.log(`   Cost: $${whatsappResult.cost}`);
    } else {
      console.log(`   ⚠️ WhatsApp sending failed (expected without auth): ${whatsappResult.error}`);
    }
  } catch (error) {
    console.log('   ❌ WhatsApp service test error:', error.message);
  }
  console.log('');

  // Test 5: Test unified communication method
  console.log('5️⃣ Testing Unified Communication Router...');
  try {
    const unifiedResult = await commService.sendCommunication('email', {
      guestEmail: 'test@example.com',
      subject: 'Unified Test',
      body: 'Testing unified communication router'
    });

    if (unifiedResult.success) {
      console.log('   ✅ Unified communication successful');
    } else {
      console.log(`   ⚠️ Unified communication failed: ${unifiedResult.error}`);
    }
  } catch (error) {
    console.log('   ❌ Unified communication test error:', error.message);
  }
  console.log('');

  console.log('🎉 Communication Services Test Completed!');
  console.log('================================================');
  console.log('\n📝 Notes:');
  console.log('   - Tests will fail without proper OAuth setup (expected)');
  console.log('   - Set up OAuth credentials to test real functionality');
  console.log('   - Check database for communication logs after real tests');
}

// Run the tests
testCommunicationServices().catch(console.error);

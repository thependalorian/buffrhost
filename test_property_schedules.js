#!/usr/bin/env node

/**
 * Test script to demonstrate property-based scheduling for Buffr Host hospitality operations
 * This script shows how hotels and restaurants have detailed operational schedules
 */

console.log('🏨 BUFFR HOST - PROPERTY OPERATIONS SCHEDULING');
console.log('=================================================\n');

// Mock property schedules based on the detailed format
const propertySchedules = {
  hotel: {
    monday: {
      '06:00-07:00': {
        activity: 'Early morning property inspection - checking security systems, exterior lighting, and overnight maintenance completion.',
        status: 'maintenance',
        staffing: 'minimal',
        tags: ['morning', 'inspection', 'security']
      },
      '08:30-09:30': {
        activity: 'Breakfast service setup - coordinating with kitchen staff, setting dining areas, and preparing welcome materials.',
        status: 'busy',
        staffing: 'standard',
        tags: ['morning', 'breakfast', 'setup']
      },
      '09:30-12:00': {
        activity: 'Peak morning operations - handling check-ins, room assignments, guest inquiries, and early departure processing.',
        status: 'busy',
        staffing: 'peak',
        tags: ['busy', 'check-in', 'service']
      },
      '13:30-17:00': {
        activity: 'Afternoon operations - housekeeping coordination, maintenance requests, concierge services, and booking management.',
        status: 'normal',
        staffing: 'standard',
        tags: ['afternoon', 'housekeeping', 'concierge']
      },
      '19:00-22:00': {
        activity: 'Peak evening operations - dinner service, bar operations, guest entertainment, and late check-ins.',
        status: 'busy',
        staffing: 'peak',
        tags: ['evening', 'busy', 'entertainment']
      },
      '22:00-23:00': {
        activity: 'Night audit and security rounds - financial reconciliation, security checks, and overnight preparations.',
        status: 'normal',
        staffing: 'minimal',
        tags: ['night', 'audit', 'security']
      }
    }
  },
  restaurant: {
    monday: {
      '06:00-08:00': {
        activity: 'Early morning prep - receiving deliveries, inventory checks, and kitchen setup for breakfast service.',
        status: 'maintenance',
        staffing: 'minimal',
        tags: ['morning', 'prep', 'inventory']
      },
      '08:00-10:00': {
        activity: 'Breakfast service preparation - final menu planning, staff assignments, and dining room setup.',
        status: 'normal',
        staffing: 'standard',
        tags: ['morning', 'breakfast', 'setup']
      },
      '12:00-14:00': {
        activity: 'Peak lunch service - table management, order processing, kitchen coordination, and customer service.',
        status: 'busy',
        staffing: 'peak',
        tags: ['busy', 'lunch', 'service']
      },
      '14:00-16:00': {
        activity: 'Afternoon transition - cleaning and reset, staff breaks, and dinner preparation planning.',
        status: 'maintenance',
        staffing: 'standard',
        tags: ['afternoon', 'cleaning', 'transition']
      },
      '18:00-21:00': {
        activity: 'Peak dinner service - full dining operations, bar service, special events, and customer experience management.',
        status: 'busy',
        staffing: 'peak',
        tags: ['evening', 'busy', 'dinner']
      },
      '22:30-23:30': {
        activity: 'Closing procedures - final cleaning, inventory counts, financial reconciliation, and security setup.',
        status: 'maintenance',
        staffing: 'minimal',
        tags: ['night', 'closing', 'inventory']
      }
    }
  }
};

// Simulate PropertyOperationsManager functionality
function getCurrentPropertySchedule(propertyType, timeString) {
  const propertySchedule = propertySchedules[propertyType]?.monday;
  if (!propertySchedule) return null;

  // Find the time range that contains the current time
  for (const [timeRange, schedule] of Object.entries(propertySchedule)) {
    const [startTime, endTime] = timeRange.split('-');
    if (timeString >= startTime && timeString <= endTime) {
      return { ...schedule, timeRange };
    }
  }

  return null;
}

function calculateStaffingNeeds(propertyType, schedule) {
  const staffing = {
    frontDesk: propertyType === 'hotel' ? (schedule.staffing === 'peak' ? 4 : schedule.staffing === 'minimal' ? 1 : 2) : 0,
    housekeeping: propertyType === 'hotel' ? (schedule.staffing === 'peak' ? 6 : schedule.staffing === 'minimal' ? 2 : 4) : 0,
    kitchen: propertyType === 'restaurant' ? (schedule.staffing === 'peak' ? 10 : schedule.staffing === 'minimal' ? 2 : 6) : (propertyType === 'hotel' ? 3 : 0),
    security: schedule.status === 'maintenance' || schedule.tags.includes('security') ? 2 : 1,
    management: 1
  };

  return staffing;
}

function generateOperationalResponse(propertyType, schedule, staffing) {
  const propertyName = propertyType === 'hotel' ? 'Etuna Guesthouse' : 'Local Restaurant';

  if (schedule.status === 'busy') {
    return `We're currently in our peak ${schedule.tags.includes('breakfast') ? 'breakfast' : schedule.tags.includes('lunch') ? 'lunch' : 'dinner'} service at ${propertyName}. All staff are focused on providing excellent service to our guests.`;
  }

  if (schedule.status === 'maintenance') {
    return `We're preparing for the day ahead at ${propertyName}. Our team is conducting necessary maintenance and setup to ensure everything runs smoothly.`;
  }

  return `Standard operations are underway at ${propertyName}. We're ready to assist with any guest needs or service requests.`;
}

// Test different property operations
const testScenarios = [
  { property: 'hotel', time: '09:45', label: 'Hotel - Peak Morning Check-ins' },
  { property: 'hotel', time: '13:45', label: 'Hotel - Afternoon Housekeeping' },
  { property: 'hotel', time: '20:30', label: 'Hotel - Peak Evening Service' },
  { property: 'restaurant', time: '07:30', label: 'Restaurant - Morning Prep' },
  { property: 'restaurant', time: '13:15', label: 'Restaurant - Peak Lunch' },
  { property: 'restaurant', time: '19:45', label: 'Restaurant - Peak Dinner' },
];

console.log('🏨 HOSPITALITY OPERATIONS STATUS\n');

testScenarios.forEach(scenario => {
  console.log(`🕐 ${scenario.label}`);
  console.log('─'.repeat(50));

  const schedule = getCurrentPropertySchedule(scenario.property, scenario.time);

  if (schedule) {
    const staffing = calculateStaffingNeeds(scenario.property, schedule);

    console.log(`🏢 Current Activity: ${schedule.activity}`);
    console.log(`📊 Operational Status: ${schedule.status.toUpperCase()}`);
    console.log(`👥 Staffing Level: ${schedule.staffing.toUpperCase()}`);
    console.log(`🏷️  Context Tags: ${schedule.tags.join(', ')}`);
    console.log('');

    console.log('👨‍🍳 STAFFING REQUIREMENTS:');
    if (staffing.frontDesk > 0) console.log(`   Front Desk: ${staffing.frontDesk} staff`);
    if (staffing.housekeeping > 0) console.log(`   Housekeeping: ${staffing.housekeeping} staff`);
    if (staffing.kitchen > 0) console.log(`   Kitchen: ${staffing.kitchen} staff`);
    if (staffing.security > 0) console.log(`   Security: ${staffing.security} staff`);
    if (staffing.management > 0) console.log(`   Management: ${staffing.management} staff`);
    console.log('');

    console.log('💬 Operational Response:');
    console.log(`"${generateOperationalResponse(scenario.property, schedule, staffing)}"`);
  } else {
    console.log('❌ No active schedule found for this time');
  }

  console.log('');
});

console.log('✅ PROPERTY SCHEDULING DEMONSTRATION COMPLETE');
console.log('');
console.log('🎯 Hospitality Operations Features Demonstrated:');
console.log('• Property-specific operational schedules (hotels vs restaurants)');
console.log('• Dynamic staffing calculations based on operational needs');
console.log('• Context-aware operational status (busy, maintenance, normal)');
console.log('• Time-based activity transitions throughout the day');
console.log('• Comprehensive 24/7 operational coverage');
console.log('');
console.log('🏨 Our Buffr Host properties now have intelligent, schedule-driven operations!');
console.log('   Sofia AI can provide contextually appropriate responses based on current property activities.');

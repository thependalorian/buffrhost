#!/usr/bin/env node

/**
 * Test script to demonstrate agent scheduling functionality
 * This script shows how Sofia agents have dynamic schedules and personalities
 */

console.log('🤖 BUFFR HOST - AGENT SCHEDULES DEMONSTRATION');
console.log('================================================\n');

// Simulate different times and days to show schedule changes
const testScenarios = [
  { day: 0, time: '08:30:00', expectedSlot: '08:30', label: 'Monday 8:30 AM - Peak Morning' },
  { day: 0, time: '14:00:00', expectedSlot: '14:00', label: 'Monday 2:00 PM - Afternoon' },
  { day: 0, time: '22:30:00', expectedSlot: '22:30', label: 'Monday 10:30 PM - Night Shift' },
  { day: 5, time: '10:00:00', expectedSlot: '10:00', label: 'Saturday 10:00 AM - Weekend Peak' },
  { day: 6, time: '08:00:00', expectedSlot: '08:00', label: 'Sunday 8:00 AM - Recovery Mode' },
];

// Mock schedule data (normally from database)
const mockSchedules = {
  0: { // Monday
    '08:30': {
      activity: 'Peak morning hours - handling check-ins, breakfast service coordination, guest inquiries',
      tags: ['busy', 'hospitality', 'service'],
      urgency: 'medium',
      personality: 'professional',
      knowledge: ['guest services', 'room management', 'dining']
    },
    '14:00': {
      activity: 'Afternoon activities - room cleaning coordination, maintenance requests, guest assistance',
      tags: ['afternoon', 'maintenance', 'hospitality'],
      urgency: 'low',
      personality: 'friendly',
      knowledge: ['facility issues', 'repair coordination', 'service requests']
    },
    '22:30': {
      activity: 'Night operations - security monitoring, emergency response availability',
      tags: ['night', 'security', 'emergency'],
      urgency: 'high',
      personality: 'urgent',
      knowledge: ['emergency procedures', 'safety protocols', 'access control']
    }
  },
  5: { // Saturday
    '10:00': {
      activity: 'Peak weekend breakfast and morning activities',
      tags: ['busy', 'hospitality', 'breakfast'],
      urgency: 'medium',
      personality: 'friendly',
      knowledge: ['guest services', 'room management', 'local attractions']
    }
  },
  6: { // Sunday
    '08:00': {
      activity: 'Sunday morning quiet operations',
      tags: ['morning', 'quiet', 'recovery'],
      urgency: 'low',
      personality: 'casual',
      knowledge: ['guest services', 'local attractions']
    }
  }
};

// Simulate AgentScheduleManager functionality
function getCurrentSchedule(dayOfWeek, timeString) {
  const daySchedules = mockSchedules[dayOfWeek];
  if (!daySchedules) return null;

  // Direct match for demo (in real implementation, we'd use time ranges)
  const timeSlot = timeString.substring(0, 5); // Get HH:MM part
  return daySchedules[timeSlot] || null;
}

function generateScheduleBasedResponse(scenario, schedule) {
  const responses = {
    professional: {
      medium: `Good ${scenario.time.includes('08:') ? 'morning' : scenario.time.includes('14:') ? 'afternoon' : 'evening'}! I'm currently ${schedule.activity.toLowerCase()}. How may I assist you with your hospitality needs?`,
      low: `Hello! I'm ${schedule.activity.toLowerCase()}. I'm here to help make your stay exceptional.`,
      high: `EMERGENCY PROTOCOLS ACTIVE: ${schedule.activity.toUpperCase()}. Please state the nature of your emergency immediately.`
    },
    friendly: {
      medium: `Hey there! 😊 Right now I'm ${schedule.activity.toLowerCase()}. What can I help you with today?`,
      low: `Hi! I'm just ${schedule.activity.toLowerCase()}. Love helping guests have an amazing experience!`,
      high: `🚨 URGENT: ${schedule.activity.toUpperCase()}. What's the emergency situation?`
    },
    urgent: {
      high: `🚨 CRITICAL SITUATION: ${schedule.activity.toUpperCase()}. EMERGENCY RESPONSE ACTIVATED.`
    },
    casual: {
      low: `Hey! Taking it easy with ${schedule.activity.toLowerCase()}. What's up?`
    }
  };

  const personalityResponses = responses[schedule.personality] || responses.professional;
  return personalityResponses[schedule.urgency] || personalityResponses.low;
}

// Run demonstration
testScenarios.forEach(scenario => {
  console.log(`🕐 ${scenario.label}`);
  console.log('─'.repeat(50));

  const schedule = getCurrentSchedule(scenario.day, scenario.time);

  if (schedule) {
    console.log(`📋 Current Activity: ${schedule.activity}`);
    console.log(`🏷️  Context Tags: ${schedule.tags.join(', ')}`);
    console.log(`🚨 Urgency Level: ${schedule.urgency.toUpperCase()}`);
    console.log(`🎭 Personality: ${schedule.personality}`);
    console.log(`🧠 Specialized Knowledge: ${schedule.knowledge.join(', ')}`);
    console.log('');

    // Show schedule-based response
    console.log('💬 Sample Response:');
    console.log(`"${generateScheduleBasedResponse(scenario, schedule)}"`);
  } else {
    console.log('❌ No active schedule found for this time');
  }

  console.log('');
});

console.log('✅ AGENT SCHEDULES DEMONSTRATION COMPLETE');
console.log('');
console.log('Key Features Demonstrated:');
console.log('• Time-based activity changes');
console.log('• Context-aware personality shifts');
console.log('• Urgency-driven response styles');
console.log('• Specialized knowledge areas');
console.log('• Multi-channel adaptability');
console.log('');
console.log('🎯 Our Sofia agents are now schedule-aware AI assistants!');
console.log('   They adapt their personality and responses based on current activities.');

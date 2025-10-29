#!/usr/bin/env node

/**
 * Sofia AI Agent Test Script
 * Tests the Sofia AI agent functionality with Deepseek LLM integration
 */

import { BuffrAgentService } from '../lib/services/agent-service.js';
import { Mem0Service } from '../lib/services/mem0-service.js';
import { PersonalityService } from '../lib/services/personality-service.js';

console.log('🤖 Testing Sofia AI Agent Integration...\n');

async function testSofiaAgent() {
  try {
    // Test 1: Initialize services
    console.log('1. Initializing services...');
    const tenantId = 'test-tenant-123';
    const userId = 'test-user-456';
    const propertyId = 1;

    const mem0Service = new Mem0Service(tenantId);
    const personalityService = new PersonalityService(tenantId);
    const agentService = new BuffrAgentService(tenantId, userId, propertyId);

    console.log('✅ Services initialized successfully');

    // Test 2: Test memory service
    console.log('\n2. Testing Mem0 memory service...');
    const testMessages = [
      { role: 'user', content: 'Hello, I need help with my hotel booking' },
      {
        role: 'assistant',
        content:
          "I'd be happy to help you with your hotel booking. What specific assistance do you need?",
      },
    ];

    await mem0Service.addMemory(userId, testMessages);
    console.log('✅ Memory added successfully');

    const memories = await mem0Service.searchMemories(
      userId,
      'hotel booking',
      5
    );
    console.log(`✅ Found ${memories.length} relevant memories`);

    // Test 3: Test personality service
    console.log('\n3. Testing personality service...');
    const personality = await personalityService.getPersonality('sofia-agent');
    console.log(
      `✅ Personality loaded: ${personality.name} (${personality.role})`
    );
    console.log(`   Confidence: ${personality.confidence_level}`);
    console.log(`   Energy: ${personality.energy_level}`);
    console.log(`   Mood: ${personality.current_mood}`);

    // Test 4: Test agent conversation
    console.log('\n4. Testing agent conversation...');
    const conversationResult = await agentService.processConversation(
      'I want to book a room for next weekend. What are my options?',
      'sofia-agent'
    );

    console.log('✅ Conversation processed successfully');
    console.log(
      `   Response: ${conversationResult.response.substring(0, 100)}...`
    );
    console.log(`   Tools used: ${conversationResult.toolsUsed.join(', ')}`);

    // Test 5: Test tool integration
    console.log('\n5. Testing Arcade AI tool integration...');
    const availableTools = agentService.getAvailableTools();
    console.log(`✅ Available tools: ${availableTools.length}`);
    availableTools.forEach((tool) => {
      console.log(`   - ${tool.name}: ${tool.description}`);
    });

    // Test 6: Test property context loading
    console.log('\n6. Testing property context loading...');
    const propertyContext = await agentService.loadPropertyContext(propertyId);
    console.log(`✅ Property context loaded: ${propertyContext.name}`);
    console.log(`   Rooms: ${propertyContext.rooms.length}`);
    console.log(`   Amenities: ${propertyContext.amenities.length}`);

    console.log('\n🎉 All Sofia AI Agent tests passed!');
  } catch (error) {
    console.error('❌ Sofia AI Agent test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testSofiaAgent();

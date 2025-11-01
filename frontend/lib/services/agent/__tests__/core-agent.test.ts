import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { DatabaseConnectionPool } from '@/lib/database/connection-pool';
import { AgentCore } from '../core/AgentCore';
import { MemoryManager } from '../memory/MemoryManager';
import { PersonalityEngine } from '../personality/PersonalityEngine';
import { ToolExecutor } from '../tools/ToolExecutor';

describe('AgentCore', () => {
  let agentCore: AgentCore;
  let memoryManager: MemoryManager;
  let personalityEngine: PersonalityEngine;
  let toolExecutor: ToolExecutor;

  beforeEach(() => {
    // Mock dependencies
    memoryManager = {
      storeMemory: jest.fn().mockResolvedValue({ success: true }),
      retrieveMemories: jest.fn().mockResolvedValue([]),
      searchMemories: jest.fn().mockResolvedValue([]),
      getHealthStatus: jest.fn().mockResolvedValue({ status: 'healthy' }),
    } as any;

    personalityEngine = {
      adaptPersonality: jest.fn().mockResolvedValue({ success: true }),
      getCurrentMood: jest.fn().mockReturnValue('neutral'),
      updatePersonality: jest.fn().mockResolvedValue({ success: true }),
    } as any;

    toolExecutor = {
      executeTool: jest.fn().mockResolvedValue({ result: 'tool executed' }),
      getAvailableTools: jest.fn().mockReturnValue(['search', 'calculate']),
    } as any;

    agentCore = new AgentCore(memoryManager, personalityEngine, toolExecutor);
  });

  it('should initialize with dependencies', () => {
    expect(agentCore).toBeDefined();
  });

  it('should process user request and store memory', async () => {
    const userRequest = {
      content: 'Hello, how are you?',
      context: { userId: 'user123' },
    };

    const result = await agentCore.processRequest(userRequest);

    expect(result).toBeDefined();
    expect(memoryManager.storeMemory).toHaveBeenCalled();
    expect(personalityEngine.adaptPersonality).toHaveBeenCalled();
  });

  it('should handle tool execution requests', async () => {
    const toolRequest = {
      content: 'Calculate 2 + 2',
      context: { userId: 'user123', requestedTool: 'calculate' },
    };

    const result = await agentCore.processRequest(toolRequest);

    expect(result).toBeDefined();
    expect(toolExecutor.executeTool).toHaveBeenCalled();
  });

  it('should retrieve relevant memories for context', async () => {
    const userRequest = {
      content: 'What did we talk about yesterday?',
      context: { userId: 'user123' },
    };

    const result = await agentCore.processRequest(userRequest);

    expect(result).toBeDefined();
    expect(memoryManager.retrieveMemories).toHaveBeenCalled();
  });

  it('should adapt personality based on interaction', async () => {
    const userRequest = {
      content: 'I need help with something urgent',
      context: { userId: 'user123', urgency: 'high' },
    };

    const result = await agentCore.processRequest(userRequest);

    expect(result).toBeDefined();
    expect(personalityEngine.adaptPersonality).toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    memoryManager.storeMemory = jest.fn().mockRejectedValue(new Error('Memory store failed'));

    const userRequest = {
      content: 'Hello',
      context: { userId: 'user123' },
    };

    const result = await agentCore.processRequest(userRequest);

    expect(result).toBeDefined();
    // Should still return a result even with memory store failure
  });
});

'use client';

import React from 'react';
import AIAgentChat from '../../../components/ai-chat/ai-agent-chat';

export default function AIChatPage() {
  return (
    <div className="min-h-screen bg-nude-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-nude-900">AI Agent Chat</h1>
          <p className="text-nude-600 mt-2">
            Chat with Buffr Host AI agents for strategic, financial, and operational insights
          </p>
        </div>
        
        <div className="h-[calc(100vh-200px)]">
          <AIAgentChat />
        </div>
      </div>
    </div>
  );
}

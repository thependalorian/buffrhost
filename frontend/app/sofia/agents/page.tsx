// /app/sofia/agents/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { SofiaAgent } from '@/lib/types/sofia';
import AgentList from '@/components/features/sofia/AgentList';
import { useSofia } from '@/hooks/useSofia';

export default function SofiaAgentsPage() {
  const [agents, setAgents] = useState<SofiaAgent[]>([]);
  const [loading, setLoading] = useState(true);

  const { getAllAgents } = useSofia();

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const result = await getAllAgents();
      setAgents(result);
    } catch (error) {
      console.error('Failed to load Sofia agents:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Sofia AI Agents</h1>
        <p className="text-gray-600 mt-2">Manage your intelligent AI agents.</p>
      </div>

      <AgentList agents={agents} loading={loading} onAgentUpdate={loadAgents} />
    </div>
  );
}

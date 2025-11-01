// frontend/hooks/useSofia.ts

import { useState } from 'react';
import { SofiaAgent } from '@/lib/types/sofia';

export function useSofia() {
  const [loading, setLoading] = useState(false);

  const getAllAgents = async (): Promise<SofiaAgent[]> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/sofia/agents`);
      if (!response.ok) throw new Error('Failed to fetch Sofia agents');
      const data = await response.json();
      return data;
    } finally {
      setLoading(false);
    }
  };

  const createAgent = async (
    agentData: Omit<SofiaAgent, 'id' | 'created_at' | 'updated_at'>
  ): Promise<SofiaAgent> => {
    const response = await fetch('/api/sofia/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agentData),
    });
    if (!response.ok) throw new Error('Failed to create Sofia agent');
    return await response.json();
  };

  return {
    loading,
    getAllAgents,
    createAgent,
  };
}

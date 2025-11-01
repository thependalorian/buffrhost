// frontend/hooks/useAnalytics.ts

import { useState } from 'react';
import { RevenueAnalytics } from '@/lib/types/analytics';

export function useAnalytics() {
  const [loading, setLoading] = useState(false);

  const getRevenueAnalytics = async (): Promise<RevenueAnalytics[]> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/revenue`);
      if (!response.ok) throw new Error('Failed to fetch revenue analytics');
      const data = await response.json();
      return data;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getRevenueAnalytics,
  };
}

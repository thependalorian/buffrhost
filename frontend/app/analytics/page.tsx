// /app/analytics/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { RevenueAnalytics } from '@/lib/types/analytics';
import RevenueCharts from '@/components/features/analytics/RevenueCharts';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function AnalyticsPage() {
  const [revenueData, setRevenueData] = useState<RevenueAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  const { getRevenueAnalytics } = useAnalytics();

  useEffect(() => {
    loadRevenueData();
  }, []);

  const loadRevenueData = async () => {
    try {
      setLoading(true);
      const result = await getRevenueAnalytics();
      setRevenueData(result);
    } catch (error) {
      console.error('Failed to load revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Sticky on Mobile */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
                Analytics Dashboard
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 break-words">
                Monitor your revenue and business performance
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base border rounded-lg whitespace-nowrap min-h-[44px] sm:min-h-0 hover:bg-gray-50">
                [BuffrIcon name="refresh"] Refresh
              </button>
              <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base bg-blue-600 text-white rounded-lg whitespace-nowrap min-h-[44px] sm:min-h-0 hover:bg-blue-700">
                [BuffrIcon name="download"] Export
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <RevenueCharts revenueData={revenueData} loading={loading} />
      </div>
    </div>
  );
}

// /app/staff/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { Staff } from '@/lib/types/staff';
import StaffList from '@/components/features/staff/StaffList';
import StaffFilters from '@/components/features/staff/StaffFilters';
import { useStaff } from '@/hooks/useStaff';

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    department: '',
    page: 1,
    limit: 10,
  });

  const { getStaff } = useStaff();

  useEffect(() => {
    loadStaff();
  }, [filters]);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const result = await getStaff(filters);
      setStaff(result.staff);
    } catch (error) {
      console.error('Failed to load staff:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Sticky on Mobile */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b">
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
                Staff Management
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 break-words">
                Manage your hotel and restaurant staff efficiently
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button className="flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm md:text-base bg-blue-600 text-white rounded-lg font-medium whitespace-nowrap min-h-[44px] sm:min-h-0 hover:bg-blue-700">
                [BuffrIcon name="plus"] Add Staff
              </button>
              <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base border rounded-lg whitespace-nowrap min-h-[44px] sm:min-h-0 hover:bg-gray-50">
                [BuffrIcon name="filter"] Filter
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Filters - Stack on Mobile */}
        <div className="mb-4 sm:mb-6 bg-white rounded-lg shadow p-4 sm:p-6 overflow-hidden">
          <StaffFilters
            filters={filters}
            onFiltersChange={setFilters}
            onRefresh={loadStaff}
          />
        </div>

        {/* Staff List - Responsive Grid */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <StaffList
            staff={staff}
            loading={loading}
            onStaffUpdate={loadStaff}
          />
        </div>
      </div>
    </div>
  );
}

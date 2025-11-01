// /app/crm/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { Customer } from '@/lib/types';
import CustomerList from '@/components/features/crm/CustomerList';
import { useCrm } from '@/hooks/useCrm';

export default function CrmPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const { getAllCustomers } = useCrm();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const result = await getAllCustomers();
      setCustomers(result);
    } catch (error) {
      console.error('Failed to load customers:', error);
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
                Customer Relationship Management
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 break-words">
                Manage your customers and build strong relationships
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button className="flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm md:text-base bg-blue-600 text-white rounded-lg font-medium whitespace-nowrap min-h-[44px] sm:min-h-0 hover:bg-blue-700">
                [BuffrIcon name="plus"] Add Customer
              </button>
              <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base border rounded-lg whitespace-nowrap min-h-[44px] sm:min-h-0 hover:bg-gray-50">
                [BuffrIcon name="filter"] Filter
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Customer List - Responsive */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <CustomerList
            customers={customers}
            loading={loading}
            onCustomerUpdate={loadCustomers}
          />
        </div>
      </div>
    </div>
  );
}

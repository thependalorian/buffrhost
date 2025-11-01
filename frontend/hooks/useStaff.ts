// /hooks/useStaff.ts

import { useState } from 'react';
import { Staff, StaffActivity, StaffPerformance } from '@/lib/types/staff';

export function useStaff() {
  const [loading, setLoading] = useState(false);

  const getStaff = async (
    filters: any
  ): Promise<{ staff: Staff[]; pagination: any }> => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, String(value));
      });

      const response = await fetch(`/api/staff?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch staff');
      return await response.json();
    } finally {
      setLoading(false);
    }
  };

  const createStaff = async (
    staffData: Omit<Staff, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Staff> => {
    const response = await fetch('/api/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staffData),
    });
    if (!response.ok) throw new Error('Failed to create staff');
    return await response.json();
  };

  const getStaffActivities = async (
    staffId: string
  ): Promise<StaffActivity[]> => {
    const response = await fetch(`/api/staff/${staffId}/activities`);
    if (!response.ok) throw new Error('Failed to fetch staff activities');
    return await response.json();
  };

  return {
    loading,
    getStaff,
    createStaff,
    getStaffActivities,
  };
}

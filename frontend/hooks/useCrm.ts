// frontend/hooks/useCrm.ts

import { useState } from 'react';
import { Customer } from '@/lib/types';

export function useCrm() {
  const [loading, setLoading] = useState(false);

  const getAllCustomers = async (): Promise<Customer[]> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/crm/customers`);
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data = await response.json();
      return data;
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async (
    customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Customer> => {
    const response = await fetch('/api/crm/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData),
    });
    if (!response.ok) throw new Error('Failed to create customer');
    return await response.json();
  };

  return {
    loading,
    getAllCustomers,
    createCustomer,
  };
}

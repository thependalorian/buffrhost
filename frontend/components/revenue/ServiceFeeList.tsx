'use client';
import React from 'react';
import { useState, useEffect } from 'react';

interface ServiceFee {
  id: string;
  name: string;
  value: number;
  fee_type?: string;
  is_active: boolean;
}

const ServiceFeeList: React.FC = () => {
  const [serviceFees, setServiceFees] = useState<ServiceFee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceFees = async () => {
      try {
        // In a real application, this would fetch from your FastAPI backend
        // For now, using mock data
        const mockFees: ServiceFee[] = [
          { id: 'sf1', name: 'Booking Fee', value: 10.00, fee_type: 'fixed', is_active: true },
          { id: 'sf2', name: 'Payment Processing', value: 0.02, fee_type: 'percentage', is_active: true },
        ];
        setServiceFees(mockFees);
      } catch (err) {
        setError('Failed to fetch service fees');
      } finally {
        setLoading(false);
      }
    };
    fetchServiceFees();
  }, []);

  if (loading) return <div>Loading service fees...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="service-fee-list">
      <h2>Service Fees</h2>
      <ul>
        {serviceFees.map(fee => (
          <li key={fee.id}>
            {fee.name} ({fee.fee_type}) - {fee.value} ({fee.is_active ? 'Active' : 'Inactive'})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceFeeList;

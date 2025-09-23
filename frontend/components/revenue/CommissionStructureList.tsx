'use client';
import React from 'react';
import { useState, useEffect } from 'react';

interface CommissionStructure {
  id: string;
  name: string;
  value: number;
  commission_type?: string;
  is_active: boolean;
}

const CommissionStructureList: React.FC = () => {
  const [commissions, setCommissions] = useState<CommissionStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        // In a real application, this would fetch from your FastAPI backend
        // For now, using mock data
        const mockCommissions: CommissionStructure[] = [
          { id: 'cs1', name: 'Staff Sales Commission', value: 0.10, commission_type: 'percentage', is_active: true },
          { id: 'cs2', name: 'Manager Bonus', value: 500.00, commission_type: 'fixed', is_active: true },
        ];
        setCommissions(mockCommissions);
      } catch (err) {
        setError('Failed to fetch commission structures');
      } finally {
        setLoading(false);
      }
    };
    fetchCommissions();
  }, []);

  if (loading) return <div>Loading commission structures...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="commission-structure-list">
      <h2>Commission Structures</h2>
      <ul>
        {commissions.map(comm => (
          <li key={comm.id}>
            {comm.name} ({comm.commission_type}) - {comm.value} ({comm.is_active ? 'Active' : 'Inactive'})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommissionStructureList;

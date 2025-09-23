'use client';
export const dynamic = 'force-dynamic';
import React from 'react';
import CommissionStructureList from '@/components/revenue/CommissionStructureList';
import CommissionStructureForm from '@/components/revenue/CommissionStructureForm';

const CommissionsPage: React.FC = () => {
  const handleAddCommission = (data: any) => {
    console.log('Adding commission structure:', data);
    // In a real app, send data to backend
  };

  return (
    <div className="commissions-page">
      <h1>Commission Management</h1>
      <CommissionStructureList />
      <h2>Add New Commission Structure</h2>
      <CommissionStructureForm onSubmit={handleAddCommission} />
    </div>
  );
};

export default CommissionsPage;

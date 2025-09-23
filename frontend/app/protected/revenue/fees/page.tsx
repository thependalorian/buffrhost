'use client';
export const dynamic = 'force-dynamic';
import React from 'react';
import ServiceFeeList from '@/components/revenue/ServiceFeeList';
import ServiceFeeForm from '@/components/revenue/ServiceFeeForm';

const FeesPage: React.FC = () => {
  const handleAddServiceFee = (data: any) => {
    console.log('Adding service fee:', data);
    // In a real app, send data to backend
  };

  return (
    <div className="fees-page">
      <h1>Service Fee Management</h1>
      <ServiceFeeList />
      <h2>Add New Service Fee</h2>
      <ServiceFeeForm onSubmit={handleAddServiceFee} />
    </div>
  );
};

export default FeesPage;

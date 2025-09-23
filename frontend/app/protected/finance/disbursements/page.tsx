'use client';
export const dynamic = 'force-dynamic';
import React from 'react';
import DisbursementList from '@/components/finance/DisbursementList';
import DisbursementForm from '@/components/finance/DisbursementForm';

const DisbursementsPage: React.FC = () => {
  const handleAddDisbursement = (data: any) => {
    console.log('Adding disbursement:', data);
    // In a real app, send data to backend
  };

  return (
    <div className="disbursements-page">
      <h1>Disbursement Management</h1>
      <DisbursementList />
      <h2>Create New Disbursement</h2>
      <DisbursementForm onSubmit={handleAddDisbursement} />
    </div>
  );
};

export default DisbursementsPage;

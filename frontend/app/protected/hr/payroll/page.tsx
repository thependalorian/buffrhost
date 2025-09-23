'use client';
export const dynamic = 'force-dynamic';
import React from 'react';
import PayrollRecordList from '@/components/hr/PayrollRecordList';
import PayrollRecordForm from '@/components/hr/PayrollRecordForm';

const PayrollPage: React.FC = () => {
  const employeeId = 'mock-employee-id'; // This should come from context or route params

  const handleAddPayrollRecord = (data: any) => {
    console.log('Adding payroll record:', data);
    // In a real app, send data to backend
  };

  return (
    <div className="payroll-page">
      <h1>Payroll Management</h1>
      <PayrollRecordList employeeId={employeeId} />
      <h2>Add New Payroll Record</h2>
      <PayrollRecordForm employeeId={employeeId} onSubmit={handleAddPayrollRecord} />
    </div>
  );
};

export default PayrollPage;

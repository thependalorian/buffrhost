'use client';
export const dynamic = 'force-dynamic';
import React from 'react';
import BenefitEnrollmentForm from '@/components/hr/BenefitEnrollmentForm';

const BenefitsPage: React.FC = () => {
  const employeeId = 'mock-employee-id'; // This should come from context or route params

  const handleAddBenefitEnrollment = (data: any) => {
    console.log('Adding benefit enrollment:', data);
    // In a real app, send data to backend
  };

  return (
    <div className="benefits-page">
      <h1>Benefit Management</h1>
      <p>Manage benefit enrollments for employees.</p>
      <h2>Add New Benefit Enrollment</h2>
      <BenefitEnrollmentForm employeeId={employeeId} onSubmit={handleAddBenefitEnrollment} />
    </div>
  );
};

export default BenefitsPage;

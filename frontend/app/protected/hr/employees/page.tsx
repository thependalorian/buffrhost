'use client';
export const dynamic = 'force-dynamic';
import React from 'react';
import EmployeeList from '@/components/hr/EmployeeList';
import EmployeeForm from '@/components/hr/EmployeeForm';

const EmployeesPage: React.FC = () => {
  const handleAddEmployee = (data: any) => {
    console.log('Adding employee:', data);
    // In a real app, send data to backend
  };

  return (
    <div className="employees-page">
      <h1>Employee Management</h1>
      <EmployeeList />
      <h2>Add New Employee</h2>
      <EmployeeForm onSubmit={handleAddEmployee} />
    </div>
  );
};

export default EmployeesPage;

'use client';
import React from 'react';
import { useState } from 'react';

interface BenefitEnrollmentFormData {
  employee_id: string;
  benefit_type: string;
  provider?: string;
  enrollment_date?: string;
  status?: string;
  employee_contribution?: number;
  company_contribution?: number;
}

interface BenefitEnrollmentFormProps {
  employeeId: string;
  initialData?: BenefitEnrollmentFormData;
  onSubmit: (data: BenefitEnrollmentFormData) => void;
}

const BenefitEnrollmentForm: React.FC<BenefitEnrollmentFormProps> = ({ employeeId, initialData, onSubmit }) => {
  const [formData, setFormData] = useState<BenefitEnrollmentFormData>(initialData || {
    employee_id: employeeId,
    benefit_type: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'employee_contribution' || name === 'company_contribution' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="benefit-enrollment-form">
      <h3>{initialData ? 'Edit' : 'Add'} Benefit Enrollment for Employee {employeeId}</h3>
      <div>
        <label htmlFor="benefit_type">Benefit Type:</label>
        <input type="text" id="benefit_type" name="benefit_type" value={formData.benefit_type} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="provider">Provider:</label>
        <input type="text" id="provider" name="provider" value={formData.provider || ''} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="enrollment_date">Enrollment Date:</label>
        <input type="date" id="enrollment_date" name="enrollment_date" value={formData.enrollment_date || ''} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="status">Status:</label>
        <input type="text" id="status" name="status" value={formData.status || ''} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="employee_contribution">Employee Contribution:</label>
        <input type="number" id="employee_contribution" name="employee_contribution" value={formData.employee_contribution || ''} onChange={handleChange} step="0.01" />
      </div>
      <div>
        <label htmlFor="company_contribution">Company Contribution:</label>
        <input type="number" id="company_contribution" name="company_contribution" value={formData.company_contribution || ''} onChange={handleChange} step="0.01" />
      </div>
      <button type="submit">{initialData ? 'Update Enrollment' : 'Add Enrollment'}</button>
    </form>
  );
};

export default BenefitEnrollmentForm;

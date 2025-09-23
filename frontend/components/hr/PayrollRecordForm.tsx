'use client';
import React from 'react';
import { useState } from 'react';

interface PayrollRecordFormData {
  employee_id: string;
  pay_period_start: string;
  pay_period_end: string;
  gross_pay: number;
  net_pay: number;
  deductions?: Record<string, any>;
  bonuses?: number;
  payment_date?: string;
  status?: string;
}

interface PayrollRecordFormProps {
  employeeId: string;
  initialData?: PayrollRecordFormData;
  onSubmit: (data: PayrollRecordFormData) => void;
}

const PayrollRecordForm: React.FC<PayrollRecordFormProps> = ({ employeeId, initialData, onSubmit }) => {
  const [formData, setFormData] = useState<PayrollRecordFormData>(initialData || {
    employee_id: employeeId,
    pay_period_start: '',
    pay_period_end: '',
    gross_pay: 0,
    net_pay: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gross_pay' || name === 'net_pay' || name === 'bonuses' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="payroll-record-form">
      <h3>{initialData ? 'Edit' : 'Add'} Payroll Record for Employee {employeeId}</h3>
      <div>
        <label htmlFor="pay_period_start">Pay Period Start:</label>
        <input type="date" id="pay_period_start" name="pay_period_start" value={formData.pay_period_start} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="pay_period_end">Pay Period End:</label>
        <input type="date" id="pay_period_end" name="pay_period_end" value={formData.pay_period_end} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="gross_pay">Gross Pay:</label>
        <input type="number" id="gross_pay" name="gross_pay" value={formData.gross_pay} onChange={handleChange} step="0.01" required />
      </div>
      <div>
        <label htmlFor="net_pay">Net Pay:</label>
        <input type="number" id="net_pay" name="net_pay" value={formData.net_pay} onChange={handleChange} step="0.01" required />
      </div>
      <div>
        <label htmlFor="bonuses">Bonuses:</label>
        <input type="number" id="bonuses" name="bonuses" value={formData.bonuses || ''} onChange={handleChange} step="0.01" />
      </div>
      <div>
        <label htmlFor="status">Status:</label>
        <input type="text" id="status" name="status" value={formData.status || ''} onChange={handleChange} />
      </div>
      <button type="submit">{initialData ? 'Update Record' : 'Add Record'}</button>
    </form>
  );
};

export default PayrollRecordForm;

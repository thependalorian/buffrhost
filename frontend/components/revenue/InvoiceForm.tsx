'use client';
import React from 'react';
import { useState } from 'react';

interface InvoiceFormData {
  user_id: string;
  invoice_number: string;
  issue_date: string;
  due_date?: string;
  total_amount: number;
  currency?: string;
  status?: string;
  items?: any[];
  payment_details?: Record<string, any>;
}

interface InvoiceFormProps {
  onSubmit: (data: InvoiceFormData) => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<InvoiceFormData>({
    user_id: 'mock-user-id',
    invoice_number: '',
    issue_date: '',
    total_amount: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'total_amount' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="invoice-form">
      <h2>Create New Invoice</h2>
      <div>
        <label htmlFor="invoice_number">Invoice Number:</label>
        <input type="text" id="invoice_number" name="invoice_number" value={formData.invoice_number} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="issue_date">Issue Date:</label>
        <input type="datetime-local" id="issue_date" name="issue_date" value={formData.issue_date} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="due_date">Due Date:</label>
        <input type="datetime-local" id="due_date" name="due_date" value={formData.due_date || ''} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="total_amount">Total Amount:</label>
        <input type="number" id="total_amount" name="total_amount" value={formData.total_amount} onChange={handleChange} step="0.01" required />
      </div>
      <div>
        <label htmlFor="currency">Currency:</label>
        <input type="text" id="currency" name="currency" value={formData.currency || 'NAD'} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="status">Status:</label>
        <input type="text" id="status" name="status" value={formData.status || ''} onChange={handleChange} />
      </div>
      <button type="submit">Create Invoice</button>
    </form>
  );
};

export default InvoiceForm;

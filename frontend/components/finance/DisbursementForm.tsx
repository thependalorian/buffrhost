'use client';

import React from 'react';
import { useState } from 'react';

interface DisbursementFormData {
  source_account_id: string;
  destination_account_details: Record<string, any>;
  amount: number;
  currency?: string;
  notes?: string;
}

interface DisbursementFormProps {
  onSubmit: (data: DisbursementFormData) => void;
}

const DisbursementForm: React.FC<DisbursementFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<DisbursementFormData>({
    source_account_id: '',
    destination_account_details: {},
    amount: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      destination_account_details: { ...prev.destination_account_details, [name]: value }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="disbursement-form">
      <h2>Create New Disbursement</h2>
      <div>
        <label htmlFor="source_account_id">Source Account ID:</label>
        <input type="text" id="source_account_id" name="source_account_id" value={formData.source_account_id} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="amount">Amount:</label>
        <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} step="0.01" required />
      </div>
      <div>
        <label htmlFor="currency">Currency:</label>
        <input type="text" id="currency" name="currency" value={formData.currency || 'NAD'} onChange={handleChange} />
      </div>
      <h3>Destination Account Details</h3>
      <div>
        <label htmlFor="bank_name">Bank Name:</label>
        <input type="text" id="bank_name" name="bank_name" value={formData.destination_account_details.bank_name || ''} onChange={handleDestinationChange} />
      </div>
      <div>
        <label htmlFor="account_number">Account Number:</label>
        <input type="text" id="account_number" name="account_number" value={formData.destination_account_details.account_number || ''} onChange={handleDestinationChange} />
      </div>
      <div>
        <label htmlFor="notes">Notes:</label>
        <textarea id="notes" name="notes" value={formData.notes || ''} onChange={handleChange} />
      </div>
      <button type="submit">Create Disbursement</button>
    </form>
  );
};

export default DisbursementForm;

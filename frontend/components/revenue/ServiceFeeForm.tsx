'use client';
import React from 'react';
import { useState } from 'react';

interface ServiceFeeFormData {
  name: string;
  description?: string;
  fee_type?: string;
  value: number;
  applies_to?: string;
  is_active?: boolean;
}

interface ServiceFeeFormProps {
  onSubmit: (data: ServiceFeeFormData) => void;
}

const ServiceFeeForm: React.FC<ServiceFeeFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ServiceFeeFormData>({
    name: '',
    value: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'value' ? parseFloat(value) : value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="service-fee-form">
      <h2>Add New Service Fee</h2>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="fee_type">Fee Type:</label>
        <input type="text" id="fee_type" name="fee_type" value={formData.fee_type || ''} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="value">Value:</label>
        <input type="number" id="value" name="value" value={formData.value} onChange={handleChange} step="0.01" required />
      </div>
      <div>
        <label htmlFor="applies_to">Applies To:</label>
        <input type="text" id="applies_to" name="applies_to" value={formData.applies_to || ''} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="is_active">Is Active:</label>
        <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={handleChange} />
      </div>
      <button type="submit">Add Service Fee</button>
    </form>
  );
};

export default ServiceFeeForm;

'use client';

import React from 'react';
import { useState } from 'react';

interface BookingFormData {
  user_id: string;
  resource_id: string;
  resource_type: string;
  start_time: string;
  end_time: string;
  notes?: string;
}

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<BookingFormData>({
    user_id: 'mock-user-id',
    resource_id: '',
    resource_type: '',
    start_time: '',
    end_time: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <h2>Create New Booking</h2>
      <div>
        <label htmlFor="resource_id">Resource ID:</label>
        <input type="text" id="resource_id" name="resource_id" value={formData.resource_id} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="resource_type">Resource Type:</label>
        <select id="resource_type" name="resource_type" value={formData.resource_type} onChange={handleChange} required>
          <option value="">Select Type</option>
          <option value="room">Room</option>
          <option value="service">Service</option>
          <option value="staff">Staff</option>
        </select>
      </div>
      <div>
        <label htmlFor="start_time">Start Time:</label>
        <input type="datetime-local" id="start_time" name="start_time" value={formData.start_time} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="end_time">End Time:</label>
        <input type="datetime-local" id="end_time" name="end_time" value={formData.end_time} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="notes">Notes:</label>
        <textarea id="notes" name="notes" value={formData.notes || ''} onChange={handleChange} />
      </div>
      <button type="submit">Create Booking</button>
    </form>
  );
};

export default BookingForm;

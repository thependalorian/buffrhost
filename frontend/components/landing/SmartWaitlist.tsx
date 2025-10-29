'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

/**
 * Smart Waitlist Component
 * 
 * Modal for collecting user information for the waitlist
 * Location: components/landing/SmartWaitlist.tsx
 * Features: Modal overlay, form inputs, validation
 */

interface SmartWaitlistProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmartWaitlist: React.FC<SmartWaitlistProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessType: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-luxury-strong max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-nude-900">Join the Waitlist</h2>
            <button
              onClick={onClose}
              className="text-nude-500 hover:text-nude-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-nude-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-nude-300 rounded-lg focus:ring-2 focus:ring-nude-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-nude-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-nude-300 rounded-lg focus:ring-2 focus:ring-nude-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="businessType" className="block text-sm font-medium text-nude-700 mb-2">
                Business Type
              </label>
              <select
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-nude-300 rounded-lg focus:ring-2 focus:ring-nude-500 focus:border-transparent"
              >
                <option value="">Select your business type</option>
                <option value="hotel">Hotel</option>
                <option value="restaurant">Restaurant</option>
                <option value="vacation-rental">Vacation Rental</option>
                <option value="resort">Resort</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-nude-700 mb-2">
                Additional Information (Optional)
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-nude-300 rounded-lg focus:ring-2 focus:ring-nude-500 focus:border-transparent"
                placeholder="Tell us about your business needs..."
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-nude-600 hover:bg-nude-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Join Waitlist
              </button>
              <p className="text-xs text-nude-500 text-center mt-2">
                We'll notify you when we're ready to launch
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

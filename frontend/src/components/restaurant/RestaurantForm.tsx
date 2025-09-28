/**
 * Restaurant Form Component
 * Form for creating and editing restaurants
 */

import React, { useState, useEffect } from 'react';
import { RestaurantFormData, RestaurantFormErrors } from '@/src/types/restaurant';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Alert } from '@/src/components/ui/alert';

interface RestaurantFormProps {
  initialData?: Partial<RestaurantFormData>;
  onSubmit: (data: RestaurantFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  submitText?: string;
  cancelText?: string;
  className?: string;
}

export function RestaurantForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  submitText = 'Save Restaurant',
  cancelText = 'Cancel',
  className = '',
}: RestaurantFormProps) {
  const [formData, setFormData] = useState<RestaurantFormData>({
    restaurant_name: '',
    logo_url: '',
    address: '',
    phone: '',
    is_active: true,
    timezone: '',
    ...initialData,
  });

  const [errors, setErrors] = useState<RestaurantFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: RestaurantFormErrors = {};

    if (!formData.restaurant_name.trim()) {
      newErrors.restaurant_name = 'Restaurant name is required';
    } else if (formData.restaurant_name.length < 2) {
      newErrors.restaurant_name = 'Restaurant name must be at least 2 characters';
    } else if (formData.restaurant_name.length > 255) {
      newErrors.restaurant_name = 'Restaurant name must be less than 255 characters';
    }

    if (formData.logo_url && !isValidUrl(formData.logo_url)) {
      newErrors.logo_url = 'Please enter a valid URL';
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.address && formData.address.length > 500) {
      newErrors.address = 'Address must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof RestaurantFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Restaurant Name */}
      <div>
        <Label htmlFor="restaurant_name" className="text-sm font-medium text-gray-700">
          Restaurant Name *
        </Label>
        <Input
          id="restaurant_name"
          type="text"
          value={formData.restaurant_name}
          onChange={(e) => handleInputChange('restaurant_name', e.target.value)}
          placeholder="Enter restaurant name"
          className={errors.restaurant_name ? 'border-red-500' : ''}
        />
        {errors.restaurant_name && (
          <p className="mt-1 text-sm text-red-600">{errors.restaurant_name}</p>
        )}
      </div>

      {/* Logo URL */}
      <div>
        <Label htmlFor="logo_url" className="text-sm font-medium text-gray-700">
          Logo URL
        </Label>
        <Input
          id="logo_url"
          type="url"
          value={formData.logo_url}
          onChange={(e) => handleInputChange('logo_url', e.target.value)}
          placeholder="https://example.com/logo.png"
          className={errors.logo_url ? 'border-red-500' : ''}
        />
        {errors.logo_url && (
          <p className="mt-1 text-sm text-red-600">{errors.logo_url}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <Label htmlFor="address" className="text-sm font-medium text-gray-700">
          Address
        </Label>
        <textarea
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="Enter restaurant address"
          rows={3}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.address ? 'border-red-500' : ''
          }`}
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
          Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="+264 81 123 4567"
          className={errors.phone ? 'border-red-500' : ''}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
        )}
      </div>

      {/* Timezone */}
      <div>
        <Label htmlFor="timezone" className="text-sm font-medium text-gray-700">
          Timezone
        </Label>
        <select
          id="timezone"
          value={formData.timezone}
          onChange={(e) => handleInputChange('timezone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select timezone</option>
          <option value="Africa/Windhoek">Africa/Windhoek (Namibia)</option>
          <option value="Africa/Johannesburg">Africa/Johannesburg (South Africa)</option>
          <option value="Africa/Cairo">Africa/Cairo (Egypt)</option>
          <option value="Europe/London">Europe/London (UK)</option>
          <option value="America/New_York">America/New_York (US East)</option>
          <option value="America/Los_Angeles">America/Los_Angeles (US West)</option>
        </select>
      </div>

      {/* Active Status */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => handleInputChange('is_active', checked as boolean)}
        />
        <Label htmlFor="is_active" className="text-sm font-medium text-gray-700">
          Restaurant is active
        </Label>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting || loading}
          >
            {cancelText}
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting || loading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSubmitting || loading ? 'Saving...' : submitText}
        </Button>
      </div>
    </form>
  );
}

export default RestaurantForm;

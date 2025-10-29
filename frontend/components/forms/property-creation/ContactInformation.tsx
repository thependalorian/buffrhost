/**
 * Contact Information Component
 *
 * Purpose: Handles contact information and property-specific details
 * Functionality: Phone, email, website, cuisine type, star rating, check-in/out times
 * Location: /components/forms/property-creation/ContactInformation.tsx
 *
 * Follows 40 Rules:
 * - Uses DaisyUI for consistent styling
 * - Modular component design for easy maintenance
 * - TypeScript for type safety
 * - Vercel-compatible with SSR
 * - Uses Neon PostgreSQL database
 * - Comprehensive error handling
 * - Optimized for performance
 */

'use client';

import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import {
  Phone,
  Mail,
  Globe,
  Utensils,
  Star,
  Clock,
  DollarSign,
} from 'lucide-react';

// Types for TypeScript compliance
interface ContactFormData {
  phone: string;
  email: string;
  website: string;
  cuisine_type: string;
  price_range: string;
  star_rating: number;
  check_in_time: string;
  check_out_time: string;
  minimum_stay: number;
  maximum_stay: number;
}

interface ContactInformationProps {
  formData: ContactFormData;
  propertyType: string;
  onUpdate: (field: keyof ContactFormData, value: unknown) => void;
  onNext: () => void;
  onPrevious: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

// Cuisine types
const cuisineTypes = [
  'African',
  'Asian',
  'European',
  'Mediterranean',
  'American',
  'Mexican',
  'Indian',
  'Chinese',
  'Japanese',
  'Italian',
  'French',
  'Thai',
  'Vietnamese',
  'Middle Eastern',
  'Caribbean',
  'Fusion',
  'Vegetarian',
  'Vegan',
  'Other',
];

// Price ranges
const priceRanges = [
  { value: '$', label: '$ - Budget' },
  { value: '$$', label: '$$ - Moderate' },
  { value: '$$$', label: '$$$ - Expensive' },
  { value: '$$$$', label: '$$$$ - Very Expensive' },
];

// Star ratings
const starRatings = [
  { value: 1, label: '1 Star' },
  { value: 2, label: '2 Stars' },
  { value: 3, label: '3 Stars' },
  { value: 4, label: '4 Stars' },
  { value: 5, label: '5 Stars' },
];

// Main Contact Information Component
export const ContactInformation: React.FC<ContactInformationProps> = ({
  formData,
  propertyType,
  onUpdate,
  onNext,
  onPrevious,
  onCancel,
  isLoading = false,
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    if (propertyType === 'hotel' && formData.minimum_stay < 1) {
      newErrors.minimum_stay = 'Minimum stay must be at least 1 day';
    }

    if (
      propertyType === 'hotel' &&
      formData.maximum_stay > 0 &&
      formData.maximum_stay < formData.minimum_stay
    ) {
      newErrors.maximum_stay = 'Maximum stay must be greater than minimum stay';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate phone number
  const isValidPhone = (phone: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  // Validate email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate URL
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Handle next step
  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  // Handle input change
  const handleInputChange = (field: keyof ContactFormData, value: unknown) => {
    onUpdate(field, value);

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="loading loading-spinner loading-md text-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="w-5 h-5" />
          Contact Information
        </CardTitle>
        <p className="text-base-content/70">
          Provide contact details and property-specific information
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contact Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contact Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number *
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+264 XX XXX XXXX"
                  className={`pl-10 ${errors.phone ? 'input-error' : ''}`}
                />
              </div>
              {errors.phone && (
                <p className="text-error text-xs">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="contact@property.com"
                  className={`pl-10 ${errors.email ? 'input-error' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-error text-xs">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-sm font-medium">
              Website
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://www.property.com"
                className={`pl-10 ${errors.website ? 'input-error' : ''}`}
              />
            </div>
            {errors.website && (
              <p className="text-error text-xs">{errors.website}</p>
            )}
            <p className="text-xs text-base-content/50">
              Optional: Your property's website URL
            </p>
          </div>
        </div>

        {/* Restaurant Specific Fields */}
        {propertyType === 'restaurant' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Utensils className="w-5 h-5" />
              Restaurant Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cuisine_type" className="text-sm font-medium">
                  Cuisine Type
                </Label>
                <Select
                  value={formData.cuisine_type}
                  onValueChange={(value) =>
                    handleInputChange('cuisine_type', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cuisine type" />
                  </SelectTrigger>
                  <SelectContent>
                    {cuisineTypes.map((cuisine) => (
                      <SelectItem key={cuisine} value={cuisine}>
                        {cuisine}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_range" className="text-sm font-medium">
                  Price Range
                </Label>
                <Select
                  value={formData.price_range}
                  onValueChange={(value) =>
                    handleInputChange('price_range', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span>{range.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Hotel Specific Fields */}
        {propertyType === 'hotel' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Star className="w-5 h-5" />
              Hotel Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="star_rating" className="text-sm font-medium">
                  Star Rating
                </Label>
                <Select
                  value={formData.star_rating.toString()}
                  onValueChange={(value) =>
                    handleInputChange('star_rating', parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select star rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {starRatings.map((rating) => (
                      <SelectItem
                        key={rating.value}
                        value={rating.value.toString()}
                      >
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-warning fill-current" />
                          <span>{rating.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_range" className="text-sm font-medium">
                  Price Range
                </Label>
                <Select
                  value={formData.price_range}
                  onValueChange={(value) =>
                    handleInputChange('price_range', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span>{range.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="check_in_time" className="text-sm font-medium">
                  Check-in Time
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                  <Input
                    id="check_in_time"
                    type="time"
                    value={formData.check_in_time}
                    onChange={(e) =>
                      handleInputChange('check_in_time', e.target.value)
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="check_out_time" className="text-sm font-medium">
                  Check-out Time
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                  <Input
                    id="check_out_time"
                    type="time"
                    value={formData.check_out_time}
                    onChange={(e) =>
                      handleInputChange('check_out_time', e.target.value)
                    }
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="minimum_stay" className="text-sm font-medium">
                  Minimum Stay (days)
                </Label>
                <Input
                  id="minimum_stay"
                  type="number"
                  min="1"
                  value={formData.minimum_stay || ''}
                  onChange={(e) =>
                    handleInputChange(
                      'minimum_stay',
                      parseInt(e.target.value) || 1
                    )
                  }
                  className={errors.minimum_stay ? 'input-error' : ''}
                />
                {errors.minimum_stay && (
                  <p className="text-error text-xs">{errors.minimum_stay}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maximum_stay" className="text-sm font-medium">
                  Maximum Stay (days)
                </Label>
                <Input
                  id="maximum_stay"
                  type="number"
                  min="0"
                  value={formData.maximum_stay || ''}
                  onChange={(e) =>
                    handleInputChange(
                      'maximum_stay',
                      parseInt(e.target.value) || 0
                    )
                  }
                  className={errors.maximum_stay ? 'input-error' : ''}
                />
                {errors.maximum_stay && (
                  <p className="text-error text-xs">{errors.maximum_stay}</p>
                )}
                <p className="text-xs text-base-content/50">
                  Leave empty for no maximum limit
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button variant="outline" onClick={onPrevious}>
            <Clock className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button onClick={handleNext} className="btn-primary">
              Next Step
              <Phone className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInformation;

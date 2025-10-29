/**
 * Basic Information Component
 *
 * Purpose: Handles basic property information input
 * Functionality: Property name, type, location, address, description, capacity
 * Location: /components/forms/property-creation/BasicInformation.tsx
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { Building2, MapPin, Hash, Users, RefreshCw } from 'lucide-react';

// Types for TypeScript compliance
interface PropertyFormData {
  name: string;
  type: string;
  location: string;
  description: string;
  address: string;
  property_code: string;
  capacity: number;
}

interface BasicInformationProps {
  formData: PropertyFormData;
  onUpdate: (field: keyof PropertyFormData, value: unknown) => void;
  onNext: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

// Property types with icons
const propertyTypes = [
  { value: 'hotel', label: 'Hotel', icon: 'building-2' },
  { value: 'restaurant', label: 'Restaurant', icon: 'utensils' },
  { value: 'cafe', label: 'Cafe', icon: 'coffee' },
  { value: 'bar', label: 'Bar', icon: 'wine' },
  { value: 'spa', label: 'Spa', icon: 'spa' },
  { value: 'conference_center', label: 'Conference Center', icon: 'users' },
];

// Main Basic Information Component
export const BasicInformation: React.FC<BasicInformationProps> = ({
  formData,
  onUpdate,
  onNext,
  onCancel,
  isLoading = false,
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  // Refs for performance optimization
  const generateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Generate property code
  const generatePropertyCode = () => {
    setIsGeneratingCode(true);

    if (generateTimeoutRef.current) {
      clearTimeout(generateTimeoutRef.current);
    }

    generateTimeoutRef.current = setTimeout(() => {
      const prefix = formData.type.toUpperCase().substring(0, 3);
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      const code = `${prefix}-${random}`;
      onUpdate('property_code', code);
      setIsGeneratingCode(false);
    }, 500);
  };

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Property name is required';
    }

    if (!formData.type) {
      newErrors.type = 'Property type is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (formData.capacity < 0) {
      newErrors.capacity = 'Capacity must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  // Handle input change
  const handleInputChange = (field: keyof PropertyFormData, value: unknown) => {
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
            <Building2 className="w-5 h-5" />
            Basic Information
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
          <Building2 className="w-5 h-5" />
          Basic Information
        </CardTitle>
        <p className="text-base-content/70">
          Provide the essential details about your property
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Property Name and Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Property Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter property name"
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <p className="text-error text-xs">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">
              Property Type *
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange('type', value)}
            >
              <SelectTrigger className={errors.type ? 'input-error' : ''}>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {getPropertyIcon(type.icon)}
                      </span>
                      <span>{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && <p className="text-error text-xs">{errors.type}</p>}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium">
            Location *
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="City, Country"
              className={`pl-10 ${errors.location ? 'input-error' : ''}`}
            />
          </div>
          {errors.location && (
            <p className="text-error text-xs">{errors.location}</p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium">
            Address *
          </Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Full address including street, city, postal code"
            rows={3}
            className={errors.address ? 'textarea-error' : ''}
          />
          {errors.address && (
            <p className="text-error text-xs">{errors.address}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your property, its unique features, and what makes it special"
            rows={4}
          />
          <p className="text-xs text-base-content/50">
            Help guests understand what to expect from your property
          </p>
        </div>

        {/* Property Code and Capacity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="property_code" className="text-sm font-medium">
              Property Code
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                <Input
                  id="property_code"
                  value={formData.property_code}
                  onChange={(e) =>
                    handleInputChange('property_code', e.target.value)
                  }
                  placeholder="Auto-generated"
                  className="pl-10"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={generatePropertyCode}
                disabled={isGeneratingCode || !formData.type}
                className="px-3"
              >
                {isGeneratingCode ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-base-content/50">
              Unique identifier for your property
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity" className="text-sm font-medium">
              Capacity
            </Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
              <Input
                id="capacity"
                type="number"
                min="0"
                value={formData.capacity || ''}
                onChange={(e) =>
                  handleInputChange('capacity', parseInt(e.target.value) || 0)
                }
                placeholder="Maximum capacity"
                className={`pl-10 ${errors.capacity ? 'input-error' : ''}`}
              />
            </div>
            {errors.capacity && (
              <p className="text-error text-xs">{errors.capacity}</p>
            )}
            <p className="text-xs text-base-content/50">
              Maximum number of guests/occupants
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div>
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>

          <Button onClick={handleNext} className="btn-primary">
            Next Step
            <Building2 className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to get property icon
const getPropertyIcon = (iconName: string) => {
  const icons: { [key: string]: string } = {
    'building-2': '🏢',
    utensils: '🍽️',
    coffee: '☕',
    wine: '🍷',
    spa: '🧘',
    users: '👥',
  };
  return icons[iconName] || '🏢';
};

export default BasicInformation;

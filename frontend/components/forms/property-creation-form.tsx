/**
 * Property Creation Form - Modular Implementation
 *
 * Purpose: Multi-step property creation form with modular architecture
 * Functionality: Step management, form validation, data submission
 * Location: /components/forms/property-creation/PropertyCreationFormModular.tsx
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

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Button } from '@/components/ui';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
} from 'lucide-react';

// Import modular components
import BasicInformation from './BasicInformation';
import ContactInformation from './ContactInformation';
import BusinessHours from './BusinessHours';
import AmenitiesAndFeatures from './AmenitiesAndFeatures';

// Types for TypeScript compliance
interface PropertyFormData {
  // Basic Information
  name: string;
  type: string;
  location: string;
  description: string;
  address: string;
  property_code: string;
  capacity: number;

  // Contact Information
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

  // Business Hours
  opening_hours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };

  // Amenities and Features
  amenities: string[];
  cancellation_policy: string;
  house_rules: string;
  instant_booking: boolean;
  featured: boolean;
  social_media: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
}

interface PropertyCreationFormProps {
  onSuccess?: (property: unknown) => void;
  onCancel?: () => void;
  ownerId: string;
  className?: string;
}

// Form steps configuration
const formSteps = [
  {
    id: 1,
    title: 'Basic Information',
    description: 'Property details and location',
    icon: Building2,
  },
  {
    id: 2,
    title: 'Contact Information',
    description: 'Contact details and property type specifics',
    icon: Clock,
  },
  {
    id: 3,
    title: 'Business Hours',
    description: 'Operating hours and availability',
    icon: Clock,
  },
  {
    id: 4,
    title: 'Amenities & Features',
    description: 'Amenities, policies, and features',
    icon: CheckCircle,
  },
];

// Main Property Creation Form Component
export const PropertyCreationFormModular: React.FC<
  PropertyCreationFormProps
> = ({ onSuccess, onCancel, ownerId, className = '' }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form data state
  const [formData, setFormData] = useState<PropertyFormData>({
    // Basic Information
    name: '',
    type: '',
    location: '',
    description: '',
    address: '',
    property_code: '',
    capacity: 0,

    // Contact Information
    phone: '',
    email: '',
    website: '',
    cuisine_type: '',
    price_range: '',
    star_rating: 0,
    check_in_time: '15:00',
    check_out_time: '11:00',
    minimum_stay: 1,
    maximum_stay: 0,

    // Business Hours
    opening_hours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '18:00', closed: false },
      sunday: { open: '09:00', close: '18:00', closed: false },
    },

    // Amenities and Features
    amenities: [],
    cancellation_policy: '',
    house_rules: '',
    instant_booking: false,
    featured: false,
    social_media: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
    },
  });

  // Refs for performance optimization
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle form data update
  const handleFormUpdate = (field: keyof PropertyFormData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle nested form data update
  const handleNestedUpdate = (
    parent: keyof PropertyFormData,
    field: string,
    value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof typeof prev] as unknown),
        [field]: value,
      },
    }));
  };

  // Handle step navigation
  const handleNext = () => {
    if (currentStep < formSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/secure/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          owner_id: ownerId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Property created successfully!');
        onSuccess?.(data.data);
      } else {
        throw new Error(data.error || 'Failed to create property');
      }
    } catch (err) {
      console.error('Error creating property:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create property. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current step configuration
  const currentStepConfig = formSteps.find((step) => step.id === currentStep);

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* Progress Indicator */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-4">
            {formSteps.map((step, index) => {
              const IconComponent = step.icon;
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;
              const isClickable = step.id <= currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => isClickable && handleStepClick(step.id)}
                      disabled={!isClickable}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        isCompleted
                          ? 'bg-success text-white'
                          : isCurrent
                            ? 'bg-primary text-white'
                            : 'bg-base-200 text-base-content/50'
                      } ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <IconComponent className="w-6 h-6" />
                      )}
                    </button>
                    <div className="mt-2 text-center">
                      <div className="text-xs font-medium text-base-content">
                        {step.title}
                      </div>
                      <div className="text-xs text-base-content/70">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  {index < formSteps.length - 1 && (
                    <div
                      className={`w-16 h-1 mx-4 ${
                        step.id < currentStep ? 'bg-success' : 'bg-base-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Error/Success Messages */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
          <Button onClick={() => setError(null)} className="btn-sm btn-ghost">
            ×
          </Button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <CheckCircle className="w-4 h-4" />
          <span>{success}</span>
          <Button onClick={() => setSuccess(null)} className="btn-sm btn-ghost">
            ×
          </Button>
        </div>
      )}

      {/* Step Content */}
      {currentStep === 1 && (
        <BasicInformation
          formData={{
            name: formData.name,
            type: formData.type,
            location: formData.location,
            description: formData.description,
            address: formData.address,
            property_code: formData.property_code,
            capacity: formData.capacity,
          }}
          onUpdate={handleFormUpdate}
          onNext={handleNext}
          onCancel={onCancel}
          isLoading={isSubmitting}
        />
      )}

      {currentStep === 2 && (
        <ContactInformation
          formData={{
            phone: formData.phone,
            email: formData.email,
            website: formData.website,
            cuisine_type: formData.cuisine_type,
            price_range: formData.price_range,
            star_rating: formData.star_rating,
            check_in_time: formData.check_in_time,
            check_out_time: formData.check_out_time,
            minimum_stay: formData.minimum_stay,
            maximum_stay: formData.maximum_stay,
          }}
          propertyType={formData.type}
          onUpdate={handleFormUpdate}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onCancel={onCancel}
          isLoading={isSubmitting}
        />
      )}

      {currentStep === 3 && (
        <BusinessHours
          formData={{
            opening_hours: formData.opening_hours,
          }}
          onUpdate={handleFormUpdate}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onCancel={onCancel}
          isLoading={isSubmitting}
        />
      )}

      {currentStep === 4 && (
        <AmenitiesAndFeatures
          formData={{
            amenities: formData.amenities,
            cancellation_policy: formData.cancellation_policy,
            house_rules: formData.house_rules,
            instant_booking: formData.instant_booking,
            featured: formData.featured,
            social_media: formData.social_media,
          }}
          onUpdate={handleFormUpdate}
          onNestedUpdate={handleNestedUpdate}
          onSubmit={handleSubmit}
          onPrevious={handlePrevious}
          onCancel={onCancel}
          isLoading={isSubmitting}
        />
      )}

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-64">
            <CardContent className="p-6 text-center">
              <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
              <h3 className="font-medium text-base-content mb-2">
                Creating Property
              </h3>
              <p className="text-sm text-base-content/70">
                Please wait while we create your property...
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PropertyCreationFormModular;

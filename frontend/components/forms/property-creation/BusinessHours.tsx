/**
 * Business Hours Component
 *
 * Purpose: Handles business hours configuration for each day of the week
 * Functionality: Day-by-day hours, closed days, time pickers
 * Location: /components/forms/property-creation/BusinessHours.tsx
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
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Calendar, Copy, RotateCcw } from 'lucide-react';

// Types for TypeScript compliance
interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

interface BusinessHoursData {
  opening_hours: {
    monday: DayHours;
    tuesday: DayHours;
    wednesday: DayHours;
    thursday: DayHours;
    friday: DayHours;
    saturday: DayHours;
    sunday: DayHours;
  };
}

interface BusinessHoursProps {
  formData: BusinessHoursData;
  onUpdate: (field: keyof BusinessHoursData, value: unknown) => void;
  onNext: () => void;
  onPrevious: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

// Days of the week
const daysOfWeek = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

// Preset templates
const hourTemplates = [
  {
    name: 'Standard Business Hours',
    hours: {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '10:00', close: '15:00', closed: false },
      sunday: { open: '10:00', close: '15:00', closed: false },
    },
  },
  {
    name: '24/7 Operations',
    hours: {
      monday: { open: '00:00', close: '23:59', closed: false },
      tuesday: { open: '00:00', close: '23:59', closed: false },
      wednesday: { open: '00:00', close: '23:59', closed: false },
      thursday: { open: '00:00', close: '23:59', closed: false },
      friday: { open: '00:00', close: '23:59', closed: false },
      saturday: { open: '00:00', close: '23:59', closed: false },
      sunday: { open: '00:00', close: '23:59', closed: false },
    },
  },
  {
    name: 'Weekdays Only',
    hours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '18:00', closed: true },
      sunday: { open: '09:00', close: '18:00', closed: true },
    },
  },
];

// Main Business Hours Component
export const BusinessHours: React.FC<BusinessHoursProps> = ({
  formData,
  onUpdate,
  onNext,
  onPrevious,
  onCancel,
  isLoading = false,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Handle day hours change
  const handleDayChange = (day: string, field: keyof DayHours, value: unknown) => {
    const updatedHours = {
      ...formData.opening_hours,
      [day]: {
        ...formData.opening_hours[day as keyof typeof formData.opening_hours],
        [field]: value,
      },
    };
    onUpdate('opening_hours', updatedHours);
  };

  // Apply template
  const applyTemplate = (template: (typeof hourTemplates)[0]) => {
    onUpdate('opening_hours', template.hours);
    setSelectedTemplate(template.name);
  };

  // Copy hours from one day to all days
  const copyToAllDays = (sourceDay: string) => {
    const sourceHours =
      formData.opening_hours[sourceDay as keyof typeof formData.opening_hours];
    const updatedHours = { ...formData.opening_hours };

    daysOfWeek.forEach((day) => {
      if (day.key !== sourceDay) {
        updatedHours[day.key as keyof typeof updatedHours] = { ...sourceHours };
      }
    });

    onUpdate('opening_hours', updatedHours);
  };

  // Reset all hours to default
  const resetToDefault = () => {
    const defaultHours = {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '18:00', closed: false },
      sunday: { open: '09:00', close: '18:00', closed: false },
    };
    onUpdate('opening_hours', defaultHours);
    setSelectedTemplate('');
  };

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Check if at least one day is open
    const hasOpenDay = Object.values(formData.opening_hours).some(
      (day) => !day.closed
    );
    if (!hasOpenDay) {
      newErrors.general = 'At least one day must be open';
    }

    // Check for valid time ranges
    Object.entries(formData.opening_hours).forEach(([day, hours]) => {
      if (!hours.closed && hours.open >= hours.close) {
        newErrors[day] = 'Opening time must be before closing time';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Business Hours
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
          <Clock className="w-5 h-5" />
          Business Hours
        </CardTitle>
        <p className="text-base-content/70">
          Set your property's operating hours for each day of the week
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Templates */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Quick Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hourTemplates.map((template) => (
              <Button
                key={template.name}
                variant="outline"
                onClick={() => applyTemplate(template)}
                className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                  selectedTemplate === template.name
                    ? 'ring-2 ring-primary'
                    : ''
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-medium">{template.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {errors.general && (
          <div className="alert alert-error">
            <Clock className="w-4 h-4" />
            <span>{errors.general}</span>
          </div>
        )}

        {/* Day-by-Day Hours */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Daily Hours</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetToDefault}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {daysOfWeek.map((day) => {
              const dayHours =
                formData.opening_hours[
                  day.key as keyof typeof formData.opening_hours
                ];
              const isWeekend = day.key === 'saturday' || day.key === 'sunday';

              return (
                <div
                  key={day.key}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <div className="w-24">
                    <Label
                      className={`capitalize font-medium ${isWeekend ? 'text-warning' : ''}`}
                    >
                      {day.label}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`${day.key}-closed`}
                      checked={dayHours.closed}
                      onCheckedChange={(checked) =>
                        handleDayChange(day.key, 'closed', checked)
                      }
                    />
                    <Label htmlFor={`${day.key}-closed`} className="text-sm">
                      Closed
                    </Label>
                  </div>

                  {!dayHours.closed && (
                    <div className="flex items-center space-x-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-base-content/50" />
                        <Input
                          type="time"
                          value={dayHours.open}
                          onChange={(e) =>
                            handleDayChange(day.key, 'open', e.target.value)
                          }
                          className="w-32"
                        />
                      </div>
                      <span className="text-base-content/70">to</span>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-base-content/50" />
                        <Input
                          type="time"
                          value={dayHours.close}
                          onChange={(e) =>
                            handleDayChange(day.key, 'close', e.target.value)
                          }
                          className="w-32"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToAllDays(day.key)}
                        className="ml-2"
                        title={`Copy ${day.label} hours to all days`}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {errors[day.key] && (
                    <p className="text-error text-xs">{errors[day.key]}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-base-200 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Hours Summary</h4>
          <div className="text-sm text-base-content/70 space-y-1">
            {daysOfWeek.map((day) => {
              const dayHours =
                formData.opening_hours[
                  day.key as keyof typeof formData.opening_hours
                ];
              return (
                <div key={day.key} className="flex justify-between">
                  <span className="capitalize">{day.label}:</span>
                  <span>
                    {dayHours.closed
                      ? 'Closed'
                      : `${dayHours.open} - ${dayHours.close}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

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
              <Calendar className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessHours;

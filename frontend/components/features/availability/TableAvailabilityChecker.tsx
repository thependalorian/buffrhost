/**
 * Table Availability Checker Component
 *
 * Purpose: Handles table availability checking for restaurants
 * Functionality: Party size selection, date/time input, table availability checking
 * Location: /components/features/availability/TableAvailabilityChecker.tsx
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
import { Badge } from '@/components/ui';
import {
  Utensils,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  MapPin,
} from 'lucide-react';

// Types for TypeScript compliance
interface TableAvailability {
  total_available: number;
  total_tables: number;
  available_tables: Array<{
    table_id: number;
    table_number: string;
    capacity: number;
    location?: string;
    is_available: boolean;
    room_status?: string;
  }>;
}

interface TableAvailabilityCheckerProps {
  propertyId: string;
  onAvailabilityChange?: (availability: TableAvailability) => void;
  onError?: (error: string) => void;
  isLoading?: boolean;
}

// Main Table Availability Checker Component
export const TableAvailabilityChecker: React.FC<
  TableAvailabilityCheckerProps
> = ({ propertyId, onAvailabilityChange, onError, isLoading = false }) => {
  const [partySize, setPartySize] = useState(2);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [availability, setAvailability] = useState<TableAvailability | null>(
    null
  );
  const [isChecking, setIsChecking] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Refs for performance optimization
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!date) {
      newErrors.date = 'Date is required';
    } else if (new Date(date) < new Date()) {
      newErrors.date = 'Date cannot be in the past';
    }

    if (!time) {
      newErrors.time = 'Time is required';
    }

    if (partySize < 1 || partySize > 20) {
      newErrors.partySize = 'Party size must be between 1 and 20';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check availability
  const handleCheckAvailability = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsChecking(true);
      setErrors({});

      // Simulate API call to Neon database
      const response = await fetch('/api/secure/availability/tables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_id: propertyId,
          party_size: partySize,
          date: date,
          time: time,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAvailability(data.data);
        onAvailabilityChange?.(data.data);
      } else {
        throw new Error(data.error || 'Failed to check table availability');
      }
    } catch (error) {
      console.error('Error checking table availability:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to check table availability';
      setErrors({ general: errorMessage });
      onError?.(errorMessage);
    } finally {
      setIsChecking(false);
    }
  };

  // Handle input change
  const handleInputChange = (field: string, value: unknown) => {
    switch (field) {
      case 'partySize':
        setPartySize(parseInt(value) || 1);
        break;
      case 'date':
        setDate(value);
        break;
      case 'time':
        setTime(value);
        break;
    }

    // Clear errors when user starts typing
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
            <Utensils className="w-5 h-5" />
            Table Availability Checker
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
          <Utensils className="w-5 h-5" />
          Table Availability Checker
        </CardTitle>
        <p className="text-base-content/70">
          Check table availability for your party size
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Error Messages */}
        {errors.general && (
          <div className="alert alert-error">
            <XCircle className="w-4 h-4" />
            <span>{errors.general}</span>
          </div>
        )}

        {/* Table Selection Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Party Size</Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
              <Input
                type="number"
                value={partySize}
                onChange={(e) => handleInputChange('partySize', e.target.value)}
                className={`pl-10 ${errors.partySize ? 'input-error' : ''}`}
                min="1"
                max="20"
                placeholder="Number of guests"
              />
            </div>
            {errors.partySize && (
              <p className="text-error text-xs">{errors.partySize}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
              <Input
                type="date"
                value={date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`pl-10 ${errors.date ? 'input-error' : ''}`}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            {errors.date && <p className="text-error text-xs">{errors.date}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
              <Input
                type="time"
                value={time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className={`pl-10 ${errors.time ? 'input-error' : ''}`}
              />
            </div>
            {errors.time && <p className="text-error text-xs">{errors.time}</p>}
          </div>
        </div>

        {/* Check Availability Button */}
        <Button
          onClick={handleCheckAvailability}
          disabled={!date || !time || isChecking}
          className="w-full"
        >
          {isChecking ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Checking Availability...
            </>
          ) : (
            <>
              <Utensils className="w-4 h-4 mr-2" />
              Check Table Availability
            </>
          )}
        </Button>

        {/* Availability Results */}
        {availability && (
          <div className="space-y-4">
            <div className="divider">Table Availability</div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success">
                  {availability.total_available}
                </div>
                <div className="text-sm text-base-content/70">
                  Available Tables
                </div>
              </div>
              <div className="text-center p-4 bg-info/10 rounded-lg">
                <div className="text-2xl font-bold text-info">
                  {availability.total_tables}
                </div>
                <div className="text-sm text-base-content/70">Total Tables</div>
              </div>
            </div>

            {/* Availability Status */}
            <div
              className={`alert ${availability.total_available > 0 ? 'alert-success' : 'alert-error'}`}
            >
              {availability.total_available > 0 ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <span>
                {availability.total_available > 0
                  ? `${availability.total_available} table${availability.total_available > 1 ? 's' : ''} available for ${partySize} guest${partySize > 1 ? 's' : ''}`
                  : `No tables available for ${partySize} guest${partySize > 1 ? 's' : ''} at this time`}
              </span>
            </div>

            {/* Available Tables List */}
            {availability.available_tables.length > 0 && (
              <div className="space-y-3">
                <h6 className="font-medium flex items-center gap-2">
                  <Utensils className="w-4 h-4" />
                  Available Tables
                </h6>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availability.available_tables.map((table) => (
                    <div
                      key={table.table_id}
                      className={`p-4 border rounded-lg transition-colors ${
                        table.is_available
                          ? 'border-success bg-success/5 hover:bg-success/10'
                          : 'border-error bg-error/5'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h6 className="font-medium text-base-content">
                            Table {table.table_number}
                          </h6>
                          <div className="flex items-center gap-2 text-sm text-base-content/70">
                            <Users className="w-4 h-4" />
                            <span>Capacity: {table.capacity}</span>
                          </div>
                          {table.location && (
                            <div className="flex items-center gap-2 text-sm text-base-content/70 mt-1">
                              <MapPin className="w-4 h-4" />
                              <span>{table.location}</span>
                            </div>
                          )}
                        </div>
                        <Badge
                          className={
                            table.is_available ? 'badge-success' : 'badge-error'
                          }
                        >
                          {table.is_available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>

                      {!table.is_available && table.room_status && (
                        <div className="text-xs text-error mt-2">
                          Status: {table.room_status}
                        </div>
                      )}

                      {table.is_available && (
                        <div className="mt-3">
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              // Handle table selection
                              console.log('Select table:', table.table_id);
                            }}
                          >
                            Select Table
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Tables Available Message */}
            {availability.total_available === 0 && (
              <div className="text-center py-8">
                <Utensils className="w-12 h-12 mx-auto mb-4 text-base-content/30" />
                <h6 className="font-medium text-base-content mb-2">
                  No Tables Available
                </h6>
                <p className="text-sm text-base-content/70 mb-4">
                  No tables are available for {partySize} guest
                  {partySize > 1 ? 's' : ''} at this time.
                </p>
                <div className="text-xs text-base-content/50">
                  Try selecting a different date or time, or reduce your party
                  size.
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TableAvailabilityChecker;

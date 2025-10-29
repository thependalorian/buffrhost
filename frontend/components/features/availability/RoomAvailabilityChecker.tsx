/**
 * Room Availability Checker Component
 *
 * Purpose: Handles room availability checking for hotels
 * Functionality: Check-in/out dates, room type selection, availability checking
 * Location: /components/features/availability/RoomAvailabilityChecker.tsx
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
import { Badge } from '@/components/ui';
import {
  Bed,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  RefreshCw,
  DollarSign,
  Star,
} from 'lucide-react';

// Types for TypeScript compliance
interface RoomAvailability {
  total_available: number;
  total_rooms: number;
  available_rooms: Array<{
    room_id: number;
    room_number: string;
    room_type: string;
    capacity: number;
    base_price: number;
    is_available: boolean;
    room_status?: string;
    amenities?: string[];
    images?: string[];
  }>;
}

interface RoomAvailabilityCheckerProps {
  propertyId: string;
  onAvailabilityChange?: (availability: RoomAvailability) => void;
  onError?: (error: string) => void;
  isLoading?: boolean;
}

// Room types
const roomTypes = [
  'Standard',
  'Deluxe',
  'Suite',
  'Presidential',
  'Family',
  'Executive',
  'Ocean View',
  'Garden View',
];

// Main Room Availability Checker Component
export const RoomAvailabilityChecker: React.FC<
  RoomAvailabilityCheckerProps
> = ({ propertyId, onAvailabilityChange, onError, isLoading = false }) => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [roomType, setRoomType] = useState('');
  const [availability, setAvailability] = useState<RoomAvailability | null>(
    null
  );
  const [isChecking, setIsChecking] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Refs for performance optimization
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!checkInDate) {
      newErrors.checkInDate = 'Check-in date is required';
    } else if (new Date(checkInDate) < new Date()) {
      newErrors.checkInDate = 'Check-in date cannot be in the past';
    }

    if (!checkOutDate) {
      newErrors.checkOutDate = 'Check-out date is required';
    } else if (new Date(checkOutDate) <= new Date(checkInDate)) {
      newErrors.checkOutDate = 'Check-out date must be after check-in date';
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
      const response = await fetch('/api/secure/availability/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_id: propertyId,
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
          room_type: roomType || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAvailability(data.data);
        onAvailabilityChange?.(data.data);
      } else {
        throw new Error(data.error || 'Failed to check room availability');
      }
    } catch (error) {
      console.error('Error checking room availability:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to check room availability';
      setErrors({ general: errorMessage });
      onError?.(errorMessage);
    } finally {
      setIsChecking(false);
    }
  };

  // Handle input change
  const handleInputChange = (field: string, value: unknown) => {
    switch (field) {
      case 'checkInDate':
        setCheckInDate(value);
        // Auto-set check-out date to next day if not set
        if (!checkOutDate && value) {
          const nextDay = new Date(value);
          nextDay.setDate(nextDay.getDate() + 1);
          setCheckOutDate(nextDay.toISOString().split('T')[0]);
        }
        break;
      case 'checkOutDate':
        setCheckOutDate(value);
        break;
      case 'roomType':
        setRoomType(value);
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

  // Calculate nights
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bed className="w-5 h-5" />
            Room Availability Checker
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
          <Bed className="w-5 h-5" />
          Room Availability Checker
        </CardTitle>
        <p className="text-base-content/70">
          Check room availability for your stay dates
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

        {/* Room Selection Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Check-in Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
              <Input
                type="date"
                value={checkInDate}
                onChange={(e) =>
                  handleInputChange('checkInDate', e.target.value)
                }
                className={`pl-10 ${errors.checkInDate ? 'input-error' : ''}`}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            {errors.checkInDate && (
              <p className="text-error text-xs">{errors.checkInDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Check-out Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
              <Input
                type="date"
                value={checkOutDate}
                onChange={(e) =>
                  handleInputChange('checkOutDate', e.target.value)
                }
                className={`pl-10 ${errors.checkOutDate ? 'input-error' : ''}`}
                min={checkInDate || new Date().toISOString().split('T')[0]}
              />
            </div>
            {errors.checkOutDate && (
              <p className="text-error text-xs">{errors.checkOutDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Room Type (Optional)</Label>
            <Select
              value={roomType}
              onValueChange={(value) => handleInputChange('roomType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any room type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any room type</SelectItem>
                {roomTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stay Duration */}
        {checkInDate && checkOutDate && (
          <div className="text-center p-3 bg-info/10 rounded-lg">
            <div className="text-sm text-base-content/70">
              Stay Duration:{' '}
              <span className="font-medium">
                {calculateNights()} night{calculateNights() > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        {/* Check Availability Button */}
        <Button
          onClick={handleCheckAvailability}
          disabled={!checkInDate || !checkOutDate || isChecking}
          className="w-full"
        >
          {isChecking ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Checking Availability...
            </>
          ) : (
            <>
              <Bed className="w-4 h-4 mr-2" />
              Check Room Availability
            </>
          )}
        </Button>

        {/* Availability Results */}
        {availability && (
          <div className="space-y-4">
            <div className="divider">Room Availability</div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success">
                  {availability.total_available}
                </div>
                <div className="text-sm text-base-content/70">
                  Available Rooms
                </div>
              </div>
              <div className="text-center p-4 bg-info/10 rounded-lg">
                <div className="text-2xl font-bold text-info">
                  {availability.total_rooms}
                </div>
                <div className="text-sm text-base-content/70">Total Rooms</div>
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
                  ? `${availability.total_available} room${availability.total_available > 1 ? 's' : ''} available for your stay`
                  : 'No rooms available for your selected dates'}
              </span>
            </div>

            {/* Available Rooms List */}
            {availability.available_rooms.length > 0 && (
              <div className="space-y-3">
                <h6 className="font-medium flex items-center gap-2">
                  <Bed className="w-4 h-4" />
                  Available Rooms
                </h6>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availability.available_rooms.map((room) => (
                    <div
                      key={room.room_id}
                      className={`p-4 border rounded-lg transition-colors ${
                        room.is_available
                          ? 'border-success bg-success/5 hover:bg-success/10'
                          : 'border-error bg-error/5'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h6 className="font-medium text-base-content">
                            Room {room.room_number}
                          </h6>
                          <div className="flex items-center gap-2 text-sm text-base-content/70 mt-1">
                            <Star className="w-4 h-4" />
                            <span>{room.room_type}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-base-content/70 mt-1">
                            <Users className="w-4 h-4" />
                            <span>Capacity: {room.capacity}</span>
                          </div>
                        </div>
                        <Badge
                          className={
                            room.is_available ? 'badge-success' : 'badge-error'
                          }
                        >
                          {room.is_available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-success" />
                          <span className="font-medium text-lg">
                            N${room.base_price.toFixed(2)}
                          </span>
                          <span className="text-sm text-base-content/70">
                            /night
                          </span>
                        </div>
                        {calculateNights() > 0 && (
                          <div className="text-sm text-base-content/70">
                            Total: N$
                            {(room.base_price * calculateNights()).toFixed(2)}
                          </div>
                        )}
                      </div>

                      {/* Amenities */}
                      {room.amenities && room.amenities.length > 0 && (
                        <div className="mb-3">
                          <div className="text-xs text-base-content/70 mb-1">
                            Amenities:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {room.amenities
                              .slice(0, 3)
                              .map((amenity, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {amenity}
                                </Badge>
                              ))}
                            {room.amenities.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{room.amenities.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {!room.is_available && room.room_status && (
                        <div className="text-xs text-error mb-3">
                          Status: {room.room_status}
                        </div>
                      )}

                      {room.is_available && (
                        <div className="mt-3">
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              // Handle room selection
                              console.log('Select room:', room.room_id);
                            }}
                          >
                            Select Room
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Rooms Available Message */}
            {availability.total_available === 0 && (
              <div className="text-center py-8">
                <Bed className="w-12 h-12 mx-auto mb-4 text-base-content/30" />
                <h6 className="font-medium text-base-content mb-2">
                  No Rooms Available
                </h6>
                <p className="text-sm text-base-content/70 mb-4">
                  No rooms are available for your selected dates.
                </p>
                <div className="text-xs text-base-content/50">
                  Try selecting different dates or a different room type.
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RoomAvailabilityChecker;

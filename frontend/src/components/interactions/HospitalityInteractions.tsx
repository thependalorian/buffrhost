"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { 
  CheckCircle, 
  X, 
  Bed, 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Star,
  Calendar,
  CreditCard
} from "lucide-react";

interface BookingConfirmationAnimationProps {
  isVisible: boolean;
  bookingDetails: {
    roomNumber: string;
    guestName: string;
    checkIn: string;
    checkOut: string;
    total: number;
  };
  onClose?: () => void;
}

export function BookingConfirmationAnimation({ 
  isVisible, 
  bookingDetails, 
  onClose 
}: BookingConfirmationAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowAnimation(true);
      const timer = setTimeout(() => {
        setShowAnimation(false);
        onClose?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md animate-scale-in">
        <CardContent className="p-8 text-center">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-500 ${
            showAnimation ? 'bg-semantic-success scale-110' : 'bg-nude-600'
          }`}>
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          
          <h3 className="text-2xl font-display font-bold text-nude-900 mb-2">
            Booking Confirmed!
          </h3>
          <p className="text-nude-600 mb-6">
            Your reservation has been successfully created
          </p>
          
          <div className="space-y-3 text-left">
            <div className="flex justify-between">
              <span className="text-nude-600">Room:</span>
              <span className="font-medium text-nude-900">{bookingDetails.roomNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-nude-600">Guest:</span>
              <span className="font-medium text-nude-900">{bookingDetails.guestName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-nude-600">Check-in:</span>
              <span className="font-medium text-nude-900">{bookingDetails.checkIn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-nude-600">Check-out:</span>
              <span className="font-medium text-nude-900">{bookingDetails.checkOut}</span>
            </div>
            <div className="flex justify-between border-t border-nude-200 pt-3">
              <span className="text-nude-600 font-semibold">Total:</span>
              <span className="font-bold text-nude-900">N$ {bookingDetails.total}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface RoomStatusIndicatorProps {
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  roomNumber: string;
  onStatusChange?: (status: string) => void;
}

export function RoomStatusIndicator({ 
  status, 
  roomNumber, 
  onStatusChange 
}: RoomStatusIndicatorProps) {
  const statusConfig = {
    available: {
      color: 'bg-semantic-success',
      textColor: 'text-semantic-success',
      icon: CheckCircle,
      label: 'Available'
    },
    occupied: {
      color: 'bg-semantic-error',
      textColor: 'text-semantic-error',
      icon: Users,
      label: 'Occupied'
    },
    maintenance: {
      color: 'bg-semantic-warning',
      textColor: 'text-semantic-warning',
      icon: Clock,
      label: 'Maintenance'
    },
    cleaning: {
      color: 'bg-semantic-info',
      textColor: 'text-semantic-info',
      icon: Clock,
      label: 'Cleaning'
    }
  };

  const config = statusConfig[status];
  const IconComponent = config.icon;

  return (
    <Card className="group hover:shadow-luxury-medium transition-all duration-300 cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 ${config.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-nude-900">Room {roomNumber}</div>
              <div className={`text-sm ${config.textColor} font-medium`}>
                {config.label}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-nude-600">Status</div>
            <div className={`text-xs ${config.textColor} font-medium`}>
              {status.toUpperCase()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface GuestCheckInAnimationProps {
  isVisible: boolean;
  guestInfo: {
    name: string;
    roomNumber: string;
    checkInTime: string;
  };
  onClose?: () => void;
}

export function GuestCheckInAnimation({ 
  isVisible, 
  guestInfo, 
  onClose 
}: GuestCheckInAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowAnimation(true);
      const timer = setTimeout(() => {
        setShowAnimation(false);
        onClose?.();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md animate-scale-in">
        <CardContent className="p-8 text-center">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-500 ${
            showAnimation ? 'bg-nude-600 scale-110' : 'bg-nude-400'
          }`}>
            <Users className="w-10 h-10 text-white" />
          </div>
          
          <h3 className="text-2xl font-display font-bold text-nude-900 mb-2">
            Welcome, {guestInfo.name}!
          </h3>
          <p className="text-nude-600 mb-6">
            Check-in completed successfully
          </p>
          
          <div className="space-y-3 text-left">
            <div className="flex justify-between">
              <span className="text-nude-600">Room Number:</span>
              <span className="font-medium text-nude-900">{guestInfo.roomNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-nude-600">Check-in Time:</span>
              <span className="font-medium text-nude-900">{guestInfo.checkInTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-nude-600">Status:</span>
              <span className="font-medium text-semantic-success">Checked In</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface RevenuePulseAnimationProps {
  revenue: number;
  previousRevenue: number;
  period?: string;
}

export function RevenuePulseAnimation({ 
  revenue, 
  previousRevenue, 
  period = "today" 
}: RevenuePulseAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const growth = ((revenue - previousRevenue) / previousRevenue) * 100;
  const isPositive = growth >= 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="group hover:shadow-luxury-medium transition-all duration-300">
      <CardContent className="p-6 text-center">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 ${
          isAnimating ? 'scale-110' : 'scale-100'
        } ${isPositive ? 'bg-semantic-success' : 'bg-semantic-error'}`}>
          <DollarSign className="w-8 h-8 text-white" />
        </div>
        
        <div className="text-3xl font-bold text-nude-900 mb-2">
          N$ {revenue.toLocaleString()}
        </div>
        
        <div className="text-sm text-nude-600 mb-3">
          Revenue {period}
        </div>
        
        <div className={`flex items-center justify-center space-x-1 ${
          isPositive ? 'text-semantic-success' : 'text-semantic-error'
        }`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {Math.abs(growth).toFixed(1)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

interface LoadingSkeletonProps {
  type: 'card' | 'text' | 'button' | 'avatar';
  count?: number;
  className?: string;
}

export function LoadingSkeleton({ 
  type, 
  count = 1, 
  className = "" 
}: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`bg-nude-200 rounded-lg p-4 animate-pulse ${className}`}>
            <div className="h-4 bg-nude-300 rounded mb-2"></div>
            <div className="h-3 bg-nude-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-nude-300 rounded w-1/2"></div>
          </div>
        );
      case 'text':
        return (
          <div className={`space-y-2 ${className}`}>
            <div className="h-4 bg-nude-200 rounded animate-pulse"></div>
            <div className="h-4 bg-nude-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-nude-200 rounded w-1/2 animate-pulse"></div>
          </div>
        );
      case 'button':
        return (
          <div className={`h-10 bg-nude-200 rounded animate-pulse ${className}`}></div>
        );
      case 'avatar':
        return (
          <div className={`w-12 h-12 bg-nude-200 rounded-full animate-pulse ${className}`}></div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
}
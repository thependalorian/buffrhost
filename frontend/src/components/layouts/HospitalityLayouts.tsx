"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Calendar, 
  Users, 
  CreditCard,
  Bed,
  Utensils,
  Car,
  Wifi,
  Phone,
  Mail,
  Star,
  MapPin
} from "lucide-react";

interface BookingFlowLayoutProps {
  steps: Array<{ id: string; title: string; completed: boolean }>;
  onStepChange: (step: string) => void;
  children?: React.ReactNode;
}

export function BookingFlowLayout({ steps, onStepChange, children }: BookingFlowLayoutProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-display font-bold text-nude-900">
              Booking Flow
            </CardTitle>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center space-x-4 mt-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.completed 
                    ? 'bg-semantic-success text-white' 
                    : 'bg-nude-200 text-nude-600'
                }`}>
                  {step.completed ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                <span className={`ml-2 text-sm ${
                  step.completed ? 'text-nude-900' : 'text-nude-600'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className="w-8 h-0.5 bg-nude-200 mx-4"></div>
                )}
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {children || (
            <div className="space-y-6">
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-nude-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-nude-900 mb-2">
                  Select Your Dates
                </h3>
                <p className="text-nude-600">
                  Choose your check-in and check-out dates
                </p>
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button variant="outline">Cancel</Button>
                <Button>Continue</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface PropertyManagementLayoutProps {
  property: {
    name: string;
    location: string;
    rating: number;
    rooms: number;
  };
  children?: React.ReactNode;
}

export function PropertyManagementLayout({ property, children }: PropertyManagementLayoutProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-display font-bold text-nude-900">
                {property.name}
              </CardTitle>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-nude-600" />
                  <span className="text-nude-600">{property.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-nude-600">{property.rating}/5</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Bed className="w-4 h-4 text-nude-600" />
                  <span className="text-nude-600">{property.rooms} rooms</span>
                </div>
              </div>
            </div>
            <Button>Edit Property</Button>
          </div>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}

interface GuestPortalLayoutProps {
  guestInfo: {
    name: string;
    email: string;
    phone: string;
    preferences: string[];
    loyaltyTier: string;
    totalStays: number;
  };
  children?: React.ReactNode;
}

export function GuestPortalLayout({ guestInfo, children }: GuestPortalLayoutProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-display font-bold text-nude-900">
              Guest Portal
            </CardTitle>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Guest Info Header */}
            <div className="flex items-center space-x-4 p-4 bg-nude-50 rounded-lg">
              <div className="w-16 h-16 bg-nude-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {guestInfo.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-nude-900">{guestInfo.name}</h3>
                <p className="text-nude-600">{guestInfo.email}</p>
                <p className="text-sm text-nude-500">{guestInfo.phone}</p>
              </div>
            </div>

            {/* Guest Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-nude-900 mb-3">Preferences</h4>
                <div className="space-y-2">
                  {guestInfo.preferences.map((pref, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-semantic-success" />
                      <span className="text-sm text-nude-700">{pref}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-nude-900 mb-3">Loyalty Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-nude-600">Tier:</span>
                    <span className="text-sm font-medium text-nude-900">{guestInfo.loyaltyTier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-nude-600">Total Stays:</span>
                    <span className="text-sm font-medium text-nude-900">{guestInfo.totalStays}</span>
                  </div>
                </div>
              </div>
            </div>

            {children}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface MobileBookingInterfaceProps {
  onBook: () => void;
  children?: React.ReactNode;
}

export function MobileBookingInterface({ onBook, children }: MobileBookingInterfaceProps) {
  return (
    <div className="space-y-4">
      <div className="sticky top-0 bg-white border-b border-nude-200 p-4">
        <h2 className="text-lg font-semibold text-nude-900">Book Your Stay</h2>
      </div>
      
      <div className="p-4 space-y-4">
        {children || (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-nude-700 mb-1">Check-in</label>
                <input type="date" className="w-full p-2 border border-nude-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-nude-700 mb-1">Check-out</label>
                <input type="date" className="w-full p-2 border border-nude-300 rounded-lg" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-nude-700 mb-1">Guests</label>
              <select className="w-full p-2 border border-nude-300 rounded-lg">
                <option>1 Guest</option>
                <option>2 Guests</option>
                <option>3 Guests</option>
                <option>4+ Guests</option>
              </select>
            </div>
          </div>
        )}
        
        <Button onClick={onBook} className="w-full">
          Book Now
        </Button>
      </div>
    </div>
  );
}

interface TabletManagementInterfaceProps {
  children?: React.ReactNode;
}

export function TabletManagementInterface({ children }: TabletManagementInterfaceProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-nude-900">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-20 flex flex-col space-y-2">
            <Bed className="w-6 h-6" />
            <span>Rooms</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col space-y-2">
            <Users className="w-6 h-6" />
            <span>Guests</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col space-y-2">
            <Utensils className="w-6 h-6" />
            <span>Restaurant</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col space-y-2">
            <Calendar className="w-6 h-6" />
            <span>Calendar</span>
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-nude-900">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-nude-50 rounded-lg">
            <div className="w-2 h-2 bg-semantic-success rounded-full"></div>
            <span className="text-sm text-nude-700">Room 101 checked in</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-nude-50 rounded-lg">
            <div className="w-2 h-2 bg-semantic-warning rounded-full"></div>
            <span className="text-sm text-nude-700">Room 205 maintenance required</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-nude-50 rounded-lg">
            <div className="w-2 h-2 bg-semantic-info rounded-full"></div>
            <span className="text-sm text-nude-700">New booking received</span>
          </div>
        </div>
      </div>
      
      {children}
    </div>
  );
}
"use client";
'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Star, 
  Users, 
  Bed, 
  Utensils, 
  Car, 
  Wifi, 
  Phone, 
  Mail, 
  Heart, 
  Share2, 
  Camera, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Settings, 
  Eye, 
  EyeOff, 
  Contrast,
  Languages,
  Monitor
} from 'lucide-react';

// Import our new hospitality components
import {
  BookingFlowLayout,
  PropertyManagementLayout,
  GuestPortalLayout,
  MobileBookingInterface,
  TabletManagementInterface
} from '@/src/components/layouts/HospitalityLayouts';

import {
  RoomAvailabilityCalendar,
  GuestProfileCard,
  RevenueAnalyticsChart,
  QROrderingInterface
} from '@/src/components/hospitality/HospitalityComponents';

import {
  BookingConfirmationAnimation,
  RoomStatusIndicator,
  GuestCheckInAnimation,
  RevenuePulseAnimation,
  LoadingSkeleton
} from '@/src/components/interactions/HospitalityInteractions';

import {
  MobileFirstNavigation,
  BottomNavigation,
  SwipeableImageGallery,
  StickyBookingBar,
  CollapsibleDetails,
  TabletSplitView,
  ResponsiveGrid,
  PullToRefresh
} from '@/src/components/responsive/HospitalityResponsive';

import {
  AccessibilityPanel,
  ScreenReaderAnnouncements,
  KeyboardNavigationHelper,
  VoiceCommandsInterface,
  AccessibilityShortcuts
} from '@/src/components/accessibility/HospitalityAccessibility';

export default function HospitalityShowcasePage() {
  const [activeDemo, setActiveDemo] = useState('layouts');
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [showGuestPortal, setShowGuestPortal] = useState(false);
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  const [showVoiceCommands, setShowVoiceCommands] = useState(false);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [showGuestCheckIn, setShowGuestCheckIn] = useState(false);

  // Sample data
  const rooms = [
    { id: 1, number: '101', type: 'Deluxe', price: 500, status: 'available' },
    { id: 2, number: '102', type: 'Standard', price: 350, status: 'occupied' },
    { id: 3, number: '103', type: 'Suite', price: 800, status: 'maintenance' }
  ];

  const availability = {
    '2024-01-20': { available: 15, occupied: 8, maintenance: 2 },
    '2024-01-21': { available: 12, occupied: 10, maintenance: 3 },
    '2024-01-22': { available: 18, occupied: 5, maintenance: 2 }
  };

  const guestInfo = {
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+264 81 123 4567',
    preferences: ['Non-smoking', 'High floor', 'City view'],
    loyaltyTier: 'Gold',
    totalStays: 12
  };

  const revenueData = [
    { date: '2024-01-15', revenue: 45000, bookings: 23 },
    { date: '2024-01-16', revenue: 52000, bookings: 28 },
    { date: '2024-01-17', revenue: 48000, bookings: 25 },
    { date: '2024-01-18', revenue: 61000, bookings: 32 },
    { date: '2024-01-19', revenue: 55000, bookings: 29 }
  ];

  const propertyInfo = {
    name: 'Luxury Resort & Spa',
    location: 'Windhoek, Namibia',
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
    ]
  };

  const bookingSteps = [
    { id: 'dates', title: 'Select Dates', completed: true },
    { id: 'rooms', title: 'Choose Room', completed: true },
    { id: 'guests', title: 'Guest Details', completed: false },
    { id: 'payment', title: 'Payment', completed: false }
  ];

  const bottomNavItems = [
    { id: 'home', label: 'Home', icon: Bed },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'guests', label: 'Guests', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const voiceCommands = [
    { command: 'book room', action: () => setShowBookingFlow(true), description: 'Start room booking process' },
    { command: 'guest portal', action: () => setShowGuestPortal(true), description: 'Open guest portal' },
    { command: 'check in', action: () => setShowGuestCheckIn(true), description: 'Process guest check-in' },
    { command: 'show analytics', action: () => setActiveDemo('analytics'), description: 'View revenue analytics' },
    { command: 'accessibility', action: () => setShowAccessibilityPanel(true), description: 'Open accessibility settings' }
  ];

  const menuItems = [
    { label: 'Home', href: '#', icon: Bed },
    { label: 'Bookings', href: '#', icon: Calendar },
    { label: 'Guests', href: '#', icon: Users },
    { label: 'Analytics', href: '#', icon: Star },
    { label: 'Settings', href: '#', icon: Settings }
  ];

  return (
    <KeyboardNavigationHelper>
      <div className="min-h-screen bg-nude-50">
        {/* Skip Link for Accessibility */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-nude-600 text-white px-4 py-2 rounded">
          Skip to main content
        </a>

        {/* Screen Reader Announcements */}
        <ScreenReaderAnnouncements announcements={[
          'Hospitality showcase page loaded',
          `Currently viewing ${activeDemo} section`
        ]} />

        {/* Navigation */}
        <MobileFirstNavigation
          logo={
            <div className="w-9 h-9 bg-gradient-to-br from-nude-800 to-black rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">H</span>
            </div>
          }
          menuItems={menuItems}
          userMenu={
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAccessibilityPanel(true)}
                className="p-2 hover:bg-nude-100 rounded-lg transition-colors"
                aria-label="Accessibility settings"
              >
                <Settings className="w-5 h-5 text-nude-600" />
              </button>
            </div>
          }
        />

        {/* Main Content */}
        <main id="main-content" className="container mx-auto px-6 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold text-nude-900 mb-4">
              Hospitality Platform Showcase
            </h1>
            <p className="text-lg text-nude-600 max-w-3xl mx-auto">
              Experience the future of hospitality management with our comprehensive platform
            </p>
          </div>

          {/* Demo Sections */}
          <div className="space-y-12">
            {/* Layouts Section */}
            <section className="bg-white rounded-2xl shadow-luxury-soft p-8">
              <h2 className="text-2xl font-display font-bold text-nude-900 mb-6">Layouts & Interfaces</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RoomAvailabilityCalendar
                  rooms={rooms}
                  availability={availability}
                  onRoomSelect={(room) => console.log('Room selected:', room)}
                />
                
                <GuestProfileCard
                  guest={guestInfo}
                  onEdit={() => console.log('Edit guest')}
                  onDelete={() => console.log('Delete guest')}
                />
              </div>
              
              <div className="mt-8">
                <RevenueAnalyticsChart
                  data={revenueData}
                  period="daily"
                />
              </div>
            </section>

            {/* Interactive Elements Section */}
            <section className="bg-white rounded-2xl shadow-luxury-soft p-8">
              <h2 className="text-2xl font-display font-bold text-nude-900 mb-6">Interactive Elements</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <RoomStatusIndicator
                  status="available"
                  roomNumber="101"
                  onStatusChange={(status) => console.log('Status changed:', status)}
                />
                
                <RevenuePulseAnimation
                  revenue={12500}
                  previousRevenue={9800}
                  period="today"
                />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-nude-800">Loading States</h3>
                  <LoadingSkeleton type="card" count={2} />
                </div>
              </div>
            </section>

            {/* Responsive Design Section */}
            <section className="bg-white rounded-2xl shadow-luxury-soft p-8">
              <h2 className="text-2xl font-display font-bold text-nude-900 mb-6">Responsive Design</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-nude-800 mb-4">Swipeable Image Gallery</h3>
                  <SwipeableImageGallery
                    images={propertyInfo.images}
                    alt="Property images"
                    onImageChange={(index) => console.log('Image changed:', index)}
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-nude-800 mb-4">Collapsible Details</h3>
                  <div className="max-w-2xl mx-auto space-y-4">
                    <CollapsibleDetails title="Property Amenities" defaultOpen>
                      <div className="grid grid-cols-2 gap-2">
                        {['Wifi', 'Parking', 'Pool', 'Spa', 'Restaurant', 'Bar'].map(amenity => (
                          <div key={amenity} className="flex items-center space-x-2 text-sm text-nude-700">
                            <div className="w-2 h-2 bg-nude-600 rounded-full"></div>
                            {amenity}
                          </div>
                        ))}
                      </div>
                    </CollapsibleDetails>
                    
                    <CollapsibleDetails title="Booking Policies">
                      <div className="space-y-2 text-sm text-nude-600">
                        <p>• Check-in: 2:00 PM - 10:00 PM</p>
                        <p>• Check-out: 11:00 AM</p>
                        <p>• Cancellation: Free up to 24 hours before</p>
                        <p>• No smoking in rooms</p>
                      </div>
                    </CollapsibleDetails>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-nude-800 mb-4">Responsive Grid</h3>
                  <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }} className="max-w-4xl mx-auto">
                    {rooms.map(room => (
                      <div key={room.id} className="hospitality-card p-4">
                        <div className="font-medium text-nude-900">Room {room.number}</div>
                        <div className="text-sm text-nude-600">{room.type}</div>
                      </div>
                    ))}
                  </ResponsiveGrid>
                </div>
              </div>
            </section>

            {/* QR Ordering Section */}
            <section className="bg-white rounded-2xl shadow-luxury-soft p-8">
              <h2 className="text-2xl font-display font-bold text-nude-900 mb-6">QR Ordering System</h2>
              <QROrderingInterface onOrder={(order) => console.log('Order placed:', order)} />
            </section>

            {/* Accessibility Section */}
            <section className="bg-white rounded-2xl shadow-luxury-soft p-8">
              <h2 className="text-2xl font-display font-bold text-nude-900 mb-6">Accessibility Features</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-nude-800 mb-4">Accessibility Controls</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-nude-50 rounded-lg">
                      <span className="text-nude-700">High Contrast Mode</span>
                      <button className="p-2 bg-nude-200 rounded-lg">
                        <Contrast className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-nude-50 rounded-lg">
                      <span className="text-nude-700">Screen Reader</span>
                      <button className="p-2 bg-nude-200 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-nude-50 rounded-lg">
                      <span className="text-nude-700">Font Size</span>
                      <div className="flex space-x-2">
                        <button className="p-1 bg-nude-200 rounded text-xs">A</button>
                        <button className="p-1 bg-nude-600 text-white rounded text-sm">A</button>
                        <button className="p-1 bg-nude-200 rounded text-base">A</button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-nude-800 mb-4">Voice Commands</h3>
                  <div className="space-y-2">
                    {voiceCommands.map((cmd, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-nude-50 rounded-lg">
                        <div>
                          <div className="font-medium text-nude-900">"{cmd.command}"</div>
                          <div className="text-sm text-nude-600">{cmd.description}</div>
                        </div>
                        <button 
                          onClick={cmd.action}
                          className="p-2 bg-nude-600 text-white rounded-lg hover:bg-nude-700 transition-colors"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Bottom Navigation (Mobile) */}
        <BottomNavigation items={bottomNavItems} activeItem="home" />

        {/* Modals and Overlays */}
        {showBookingFlow && (
          <BookingFlowLayout
            steps={bookingSteps}
            onStepChange={(step) => console.log('Step changed:', step)}
          >
            <div className="space-y-6">
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-nude-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-nude-900 mb-2">
                  Select Your Dates
                </h3>
                <p className="text-nude-600">
                  Choose your check-in and check-out dates
                </p>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button className="px-4 py-2 text-nude-600 hover:text-nude-800">
                  Cancel
                </button>
                <button 
                  className="px-6 py-2 bg-nude-600 text-white rounded-lg hover:bg-nude-700"
                  onClick={() => setShowBookingConfirmation(true)}
                >
                  Continue
                </button>
              </div>
            </div>
          </BookingFlowLayout>
        )}

        {showGuestPortal && (
          <GuestPortalLayout
            guestInfo={{
              name: 'John Smith',
              email: 'john@example.com',
              phone: '+264 81 123 4567',
              preferences: ['Non-smoking', 'High floor', 'City view'],
              loyaltyTier: 'Gold',
              totalStays: 12
            }}
          >
            <div className="space-y-4">
              <h4 className="font-semibold text-nude-900">Recent Bookings</h4>
              <div className="space-y-2">
                <div className="p-3 bg-nude-50 rounded-lg">
                  <div className="font-medium text-nude-900">Room 101 - Deluxe</div>
                  <div className="text-sm text-nude-600">Jan 15-17, 2024</div>
                </div>
                <div className="p-3 bg-nude-50 rounded-lg">
                  <div className="font-medium text-nude-900">Room 205 - Suite</div>
                  <div className="text-sm text-nude-600">Dec 20-25, 2023</div>
                </div>
              </div>
            </div>
          </GuestPortalLayout>
        )}

        {/* Accessibility Panel */}
        <AccessibilityPanel
          isOpen={showAccessibilityPanel}
          onClose={() => setShowAccessibilityPanel(false)}
        />

        {/* Voice Commands */}
        <VoiceCommandsInterface
          isEnabled={showVoiceCommands}
          onToggle={() => setShowVoiceCommands(!showVoiceCommands)}
          commands={voiceCommands}
        />

        {/* Booking Confirmation Animation */}
        <BookingConfirmationAnimation
          isVisible={showBookingConfirmation}
          bookingDetails={{
            roomNumber: '101',
            guestName: 'John Smith',
            checkIn: '2024-01-20',
            checkOut: '2024-01-22',
            total: 1000
          }}
          onClose={() => setShowBookingConfirmation(false)}
        />

        {/* Guest Check-in Animation */}
        <GuestCheckInAnimation
          isVisible={showGuestCheckIn}
          guestInfo={{
            name: 'John Smith',
            roomNumber: '101',
            checkInTime: '2:30 PM'
          }}
          onClose={() => setShowGuestCheckIn(false)}
        />

        {/* Accessibility Shortcuts */}
        <AccessibilityShortcuts />
      </div>
    </KeyboardNavigationHelper>
  );
}
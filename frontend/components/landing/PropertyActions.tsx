'use client';

import React, { useState } from 'react';
import { Phone, Mail, Globe, MapPin, X, MessageSquare } from 'lucide-react';
import { BookingModal } from '@/components/booking/BookingModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { BuffrButton } from '@/components/ui/buttons/BuffrButton';
import { BuffrInput } from '@/components/ui/forms/BuffrInput';
import { BuffrTextarea } from '@/components/ui/forms/BuffrTextarea';

/**
 * Property Actions Component
 * 
 * Modular action buttons and contact information for properties
 * Location: components/landing/PropertyActions.tsx
 * Features: Contact info, booking actions, consistent styling
 */

interface PropertyActionsProps {
  property: {
    id: string;
    name: string;
    address: string;
    phone?: string;
    email?: string;
    website?: string;
    type: 'hotel' | 'restaurant';
  };
  onBookNow?: (id: string) => void;
  onContact?: (id: string) => void;
  className?: string;
}

export const PropertyActions: React.FC<PropertyActionsProps> = ({
  property,
  onBookNow,
  onContact,
  className = ''
}) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  const getActionText = () => {
    return property.type === 'hotel' ? 'Book Your Stay' : 'Make a Reservation';
  };

  const getActionDescription = () => {
    return property.type === 'hotel' 
      ? 'Experience luxury and comfort at this exceptional property'
      : 'Reserve your table for an unforgettable dining experience';
  };

  const getButtonText = () => {
    return property.type === 'hotel' ? 'Book Now' : 'Reserve Table';
  };

  const handleBookNow = () => {
    setShowBookingModal(true);
    onBookNow?.(property.id);
  };

  const handleBookingSuccess = (bookingId: string) => {
    console.log('Booking successful:', bookingId);
    // You can add additional success handling here
  };

  const handleContactClick = () => {
    // Check if user is authenticated first
    // AuthGuard will handle showing auth modal if needed
    setShowContactModal(true);
    onContact?.(property.id);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);
    setContactError(null);

    try {
      // Validate form
      if (!contactFormData.name || !contactFormData.email || !contactFormData.message) {
        throw new Error('Please fill in all required fields');
      }

      // TODO: Implement actual API call to send contact message
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     propertyId: property.id,
      //     ...contactFormData
      //   })
      // });
      
      // For now, just show error that API is not implemented
      throw new Error('Contact feature is not yet available. Please use the direct contact information below.');
    } catch (err) {
      setContactError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Contact Information */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-sm">{property.address}</span>
            </div>
            {property.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <a href={`tel:${property.phone}`} className="text-sm link link-hover">
                  {property.phone}
                </a>
              </div>
            )}
            {property.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <a href={`mailto:${property.email}`} className="text-sm link link-hover">
                  {property.email}
                </a>
              </div>
            )}
            {property.website && (
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                <a href={property.website} target="_blank" rel="noopener noreferrer" className="text-sm link link-hover">
                  Visit Website
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking/Action Card */}
      <div className="card bg-primary text-primary-content shadow-xl">
        <div className="card-body text-center">
          <h3 className="card-title justify-center mb-4">
            {getActionText()}
          </h3>
          <p className="mb-6">
            {getActionDescription()}
          </p>
                 <div className="space-y-3">
                   <BuffrButton 
                     onClick={handleBookNow}
                     variant="secondary"
                     size="lg"
                     className="w-full"
                   >
                     {getButtonText()}
                   </BuffrButton>
                   <BuffrButton 
                     onClick={handleContactClick}
                     variant="outline"
                     size="lg"
                     className="w-full"
                   >
                     Contact Property
                   </BuffrButton>
                 </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        property={property}
        onBookingSuccess={handleBookingSuccess}
        onAuthRequired={() => setShowAuthModal(true)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          // If contact modal was intended, reopen it after auth
          if (showContactModal) {
            setShowContactModal(true);
          } else {
            setShowBookingModal(true);
          }
        }}
      />

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <MessageSquare className="w-6 h-6 text-nude-600" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      Contact {property.name}
                    </h2>
                  </div>
                  <p className="text-gray-600">
                    Send a message to the property
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowContactModal(false);
                    setContactSuccess(false);
                    setContactError(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Authentication Guard */}
              <AuthGuard 
                requireAuth={true} 
                service="contact property"
                className="mb-6"
                fallback={
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-nude-600 to-nude-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h3>
                    <p className="text-gray-600 mb-6">Please sign in to contact the property</p>
                    <BuffrButton
                      onClick={() => {
                        setShowContactModal(false);
                        setShowAuthModal(true);
                      }}
                      variant="primary"
                      size="lg"
                    >
                      Sign In to Continue
                    </BuffrButton>
                  </div>
                }
              >
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <BuffrInput
                      id="contact-name"
                      name="name"
                      type="text"
                      label="Your Name"
                      value={contactFormData.name}
                      onChange={handleContactInputChange}
                      placeholder="Enter your name"
                      required
                      variant="primary"
                      size="md"
                    />
                    <BuffrInput
                      id="contact-email"
                      name="email"
                      type="email"
                      label="Email Address"
                      value={contactFormData.email}
                      onChange={handleContactInputChange}
                      placeholder="your.email@example.com"
                      required
                      variant="primary"
                      size="md"
                    />
                  </div>

                  <BuffrInput
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    label="Phone Number (Optional)"
                    value={contactFormData.phone}
                    onChange={handleContactInputChange}
                    placeholder="+264 81 123 4567"
                    variant="primary"
                    size="md"
                  />

                  <BuffrTextarea
                    id="contact-message"
                    name="message"
                    label="Message"
                    value={contactFormData.message}
                    onChange={handleContactInputChange}
                    placeholder="Tell the property what you need..."
                    required
                    variant="primary"
                    size="md"
                    rows={5}
                  />

                  {/* Error Message */}
                  {contactError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-600 text-sm">{contactError}</p>
                    </div>
                  )}

                  {/* Property Contact Info */}
                  <div className="bg-nude-50 rounded-lg p-4 border border-nude-200">
                    <p className="text-sm font-medium text-nude-900 mb-2">Or contact directly:</p>
                    <div className="space-y-2">
                      {property.phone && (
                        <a href={`tel:${property.phone}`} className="flex items-center gap-2 text-sm text-nude-700 hover:text-nude-900">
                          <Phone className="w-4 h-4" />
                          {property.phone}
                        </a>
                      )}
                      {property.email && (
                        <a href={`mailto:${property.email}`} className="flex items-center gap-2 text-sm text-nude-700 hover:text-nude-900">
                          <Mail className="w-4 h-4" />
                          {property.email}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-4">
                    <BuffrButton
                      type="button"
                      onClick={() => {
                        setShowContactModal(false);
                        setContactError(null);
                      }}
                      variant="outline"
                      size="md"
                      className="flex-1"
                    >
                      Cancel
                    </BuffrButton>
                    <BuffrButton
                      type="submit"
                      disabled={isSubmittingContact}
                      variant="primary"
                      size="md"
                      className="flex-1"
                    >
                      {isSubmittingContact ? 'Sending...' : 'Send Message'}
                    </BuffrButton>
                  </div>
                </form>
                )}
              </AuthGuard>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
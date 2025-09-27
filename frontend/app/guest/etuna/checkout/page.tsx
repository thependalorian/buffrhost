/**
 * Etuna Checkout Page - Customer View
 * 
 * Comprehensive checkout and booking flow with payment processing
 * Demonstrates Buffr Host platform capabilities for booking management
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft,
  CreditCard,
  Shield,
  CheckCircle,
  Clock,
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Star,
  DollarSign,
  Plus,
  Minus,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Heart,
  MessageCircle
} from 'lucide-react';

export default function EtunaCheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Demo booking data
  const bookingData = {
    room: {
      id: 'room-002',
      name: 'Executive Room',
      type: 'Executive',
      price: 1000,
      currency: 'NAD',
      nights: 3,
      total: 3000,
      image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=2070&auto=format&fit=crop'
    },
    services: [
      {
        id: 'service-001',
        name: 'Airport Transfer',
        price: 300,
        currency: 'NAD',
        quantity: 2
      },
      {
        id: 'service-002',
        name: 'Laundry Service',
        price: 50,
        currency: 'NAD',
        quantity: 5
      }
    ],
    tours: [
      {
        id: 'tour-001',
        name: 'Etosha National Park Safari',
        price: 1200,
        currency: 'NAD',
        quantity: 2,
        date: '2024-02-20'
      }
    ]
  };

  const getSubtotal = () => {
    const roomTotal = bookingData.room.total;
    const servicesTotal = bookingData.services.reduce((sum, service) => sum + (service.price * service.quantity), 0);
    const toursTotal = bookingData.tours.reduce((sum, tour) => sum + (tour.price * tour.quantity), 0);
    return roomTotal + servicesTotal + toursTotal;
  };

  const getTax = () => {
    return Math.round(getSubtotal() * 0.15); // 15% VAT
  };

  const getTotal = () => {
    return getSubtotal() + getTax();
  };

  const steps = [
    { id: 1, name: 'Review Booking', description: 'Check your selection' },
    { id: 2, name: 'Guest Information', description: 'Personal details' },
    { id: 3, name: 'Payment', description: 'Secure payment' },
    { id: 4, name: 'Confirmation', description: 'Booking confirmed' }
  ];

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-primary text-primary-content py-6">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <Link href="/guest/etuna" className="btn btn-ghost text-primary-content">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Etuna
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-bold">Complete Your Booking</h1>
              <p className="text-primary-content/80">Secure and easy booking process</p>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-base-200 py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.id ? 'bg-primary text-primary-content' : 'bg-base-300 text-base-content/50'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="font-bold">{step.id}</span>
                  )}
                </div>
                <div className="ml-3">
                  <div className={`font-semibold ${currentStep >= step.id ? 'text-primary' : 'text-base-content/50'}`}>
                    {step.name}
                  </div>
                  <div className="text-sm text-base-content/70">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-base-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Review Your Booking</h2>
                
                {/* Room Selection */}
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title">Accommodation</h3>
                    <div className="flex items-center gap-4">
                      <Image
                        src={bookingData.room.image}
                        alt={bookingData.room.name}
                        width={100}
                        height={100}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{bookingData.room.name}</h4>
                        <p className="text-sm text-base-content/70">{bookingData.room.type}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm">{bookingData.room.nights} nights</span>
                          <span className="font-semibold">{bookingData.room.currency} {bookingData.room.total}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services */}
                {bookingData.services.length > 0 && (
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h3 className="card-title">Additional Services</h3>
                      <div className="space-y-3">
                        {bookingData.services.map((service) => (
                          <div key={service.id} className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">{service.name}</span>
                              <span className="text-sm text-base-content/70 ml-2">× {service.quantity}</span>
                            </div>
                            <span className="font-semibold">
                              {service.currency} {service.price * service.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tours */}
                {bookingData.tours.length > 0 && (
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h3 className="card-title">Tours & Activities</h3>
                      <div className="space-y-3">
                        {bookingData.tours.map((tour) => (
                          <div key={tour.id} className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">{tour.name}</span>
                              <span className="text-sm text-base-content/70 ml-2">× {tour.quantity}</span>
                              <div className="text-sm text-base-content/70">Date: {tour.date}</div>
                            </div>
                            <span className="font-semibold">
                              {tour.currency} {tour.price * tour.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button className="btn btn-primary flex-1" onClick={() => setCurrentStep(2)}>
                    Continue to Guest Information
                  </button>
                  <button className="btn btn-outline">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Support
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Guest Information</h2>
                
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title mb-4">Personal Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">First Name *</span>
                        </label>
                        <input type="text" className="input input-bordered" placeholder="Enter first name" />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Last Name *</span>
                        </label>
                        <input type="text" className="input input-bordered" placeholder="Enter last name" />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Email Address *</span>
                        </label>
                        <input type="email" className="input input-bordered" placeholder="Enter email address" />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Phone Number *</span>
                        </label>
                        <input type="tel" className="input input-bordered" placeholder="Enter phone number" />
                      </div>
                      <div className="form-control md:col-span-2">
                        <label className="label">
                          <span className="label-text">Special Requests</span>
                        </label>
                        <textarea className="textarea textarea-bordered" placeholder="Any special requests or requirements"></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="btn btn-outline" onClick={() => setCurrentStep(1)}>
                    Back
                  </button>
                  <button className="btn btn-primary flex-1" onClick={() => setCurrentStep(3)}>
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Payment Information</h2>
                
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title mb-4">Payment Method</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="payment"
                            className="radio radio-primary"
                            checked={paymentMethod === 'card'}
                            onChange={() => setPaymentMethod('card')}
                          />
                          <CreditCard className="w-5 h-5" />
                          Credit/Debit Card
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="payment"
                            className="radio radio-primary"
                            checked={paymentMethod === 'bank'}
                            onChange={() => setPaymentMethod('bank')}
                          />
                          <Shield className="w-5 h-5" />
                          Bank Transfer
                        </label>
                      </div>

                      {paymentMethod === 'card' && (
                        <div className="space-y-4">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text">Card Number *</span>
                            </label>
                            <input type="text" className="input input-bordered" placeholder="1234 5678 9012 3456" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                              <label className="label">
                                <span className="label-text">Expiry Date *</span>
                              </label>
                              <input type="text" className="input input-bordered" placeholder="MM/YY" />
                            </div>
                            <div className="form-control">
                              <label className="label">
                                <span className="label-text">CVV *</span>
                              </label>
                              <div className="relative">
                                <input
                                  type={showPassword ? 'text' : 'password'}
                                  className="input input-bordered w-full pr-10"
                                  placeholder="123"
                                />
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="form-control">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary"
                            checked={agreeToTerms}
                            onChange={(e) => setAgreeToTerms(e.target.checked)}
                          />
                          <span className="text-sm">
                            I agree to the <span className="link link-primary cursor-pointer" onClick={() => alert('Terms & Conditions will be available soon')}>Terms & Conditions</span> and <span className="link link-primary cursor-pointer" onClick={() => alert('Privacy Policy will be available soon')}>Privacy Policy</span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="btn btn-outline" onClick={() => setCurrentStep(2)}>
                    Back
                  </button>
                  <button 
                    className="btn btn-primary flex-1" 
                    onClick={() => setCurrentStep(4)}
                    disabled={!agreeToTerms}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Complete Booking
                  </button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h2>
                  <p className="text-base-content/70 mb-6">
                    Your booking has been successfully processed. You will receive a confirmation email shortly.
                  </p>
                </div>

                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title">Booking Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Booking Reference:</span>
                        <span className="font-mono">ETU-2024-001234</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-in:</span>
                        <span>February 15, 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-out:</span>
                        <span>February 18, 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Amount:</span>
                        <span className="font-bold">NAD {getTotal()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link href="/guest/etuna" className="btn btn-primary flex-1">
                    Return to Etuna
                  </Link>
                  <button className="btn btn-outline">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Support
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl sticky top-6">
              <div className="card-body">
                <h3 className="card-title">Order Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Room ({bookingData.room.nights} nights)</span>
                    <span>{bookingData.room.currency} {bookingData.room.total}</span>
                  </div>
                  
                  {bookingData.services.map((service) => (
                    <div key={service.id} className="flex justify-between text-sm">
                      <span>{service.name} × {service.quantity}</span>
                      <span>{service.currency} {service.price * service.quantity}</span>
                    </div>
                  ))}
                  
                  {bookingData.tours.map((tour) => (
                    <div key={tour.id} className="flex justify-between text-sm">
                      <span>{tour.name} × {tour.quantity}</span>
                      <span>{tour.currency} {tour.price * tour.quantity}</span>
                    </div>
                  ))}
                  
                  <div className="divider"></div>
                  
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{bookingData.room.currency} {getSubtotal()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>VAT (15%)</span>
                    <span>{bookingData.room.currency} {getTax()}</span>
                  </div>
                  
                  <div className="divider"></div>
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{bookingData.room.currency} {getTotal()}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-base-content/70">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-base-content/70">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>Instant confirmation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-base-content/70">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

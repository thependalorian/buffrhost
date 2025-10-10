'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Button } from '@/src/components/ui/button';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Upload,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface PropertyRegistrationData {
  propertyName: string;
  propertyType: 'hotel' | 'guesthouse' | 'resort' | 'b&b' | 'apartment' | 'other';
  description: string;
  address: {
    street: string;
    city: string;
    region: string;
    country: string;
    postalCode: string;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  amenities: string[];
  capacity: {
    rooms: number;
    beds: number;
  };
  businessInfo: {
    registrationNumber: string;
    taxId: string;
    establishedYear: number;
  };
}

export default function PropertyRegistrationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PropertyRegistrationData>({
    propertyName: '',
    propertyType: 'hotel',
    description: '',
    address: {
      street: '',
      city: '',
      region: '',
      country: '',
      postalCode: ''
    },
    contact: {
      phone: '',
      email: '',
      website: ''
    },
    amenities: [],
    capacity: {
      rooms: 0,
      beds: 0
    },
    businessInfo: {
      registrationNumber: '',
      taxId: '',
      establishedYear: new Date().getFullYear()
    }
  });

  const [loading, setLoading] = useState(false);

  const steps = [
    { id: 1, title: 'Basic Information', description: 'Tell us about your property' },
    { id: 2, title: 'Location & Contact', description: 'Where are you located?' },
    { id: 3, title: 'Amenities & Capacity', description: 'What do you offer?' },
    { id: 4, title: 'Business Details', description: 'Legal information' },
    { id: 5, title: 'Review & Submit', description: 'Final review' }
  ];

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof PropertyRegistrationData] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // This would submit to your API
      // const response = await fetch('/api/properties/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // Mock success for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to property dashboard
      router.push('/properties/123'); // This would be the actual property ID
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="propertyName">Property Name *</Label>
              <Input
                id="propertyName"
                value={formData.propertyName}
                onChange={(e) => handleInputChange('propertyName', e.target.value)}
                placeholder="Enter your property name"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="propertyType">Property Type *</Label>
              <select
                id="propertyType"
                value={formData.propertyType}
                onChange={(e) => handleInputChange('propertyType', e.target.value)}
                className="mt-1 w-full p-3 border border-nude-300 rounded-lg focus:ring-2 focus:ring-nude-500 focus:border-transparent"
              >
                <option value="hotel">Hotel</option>
                <option value="guesthouse">Guesthouse</option>
                <option value="resort">Resort</option>
                <option value="b&b">Bed & Breakfast</option>
                <option value="apartment">Apartment</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Tell us about your property..."
                rows={4}
                className="mt-1 w-full p-3 border border-nude-300 rounded-lg focus:ring-2 focus:ring-nude-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  value={formData.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  placeholder="123 Main Street"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  placeholder="Windhoek"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="region">Region/State</Label>
                <Input
                  id="region"
                  value={formData.address.region}
                  onChange={(e) => handleInputChange('address.region', e.target.value)}
                  placeholder="Khomas"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.address.country}
                  onChange={(e) => handleInputChange('address.country', e.target.value)}
                  placeholder="Namibia"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={formData.address.postalCode}
                  onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                  placeholder="10001"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.contact.phone}
                  onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                  placeholder="+264 65 231 177"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => handleInputChange('contact.email', e.target.value)}
                  placeholder="contact@yourproperty.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.contact.website}
                  onChange={(e) => handleInputChange('contact.website', e.target.value)}
                  placeholder="https://yourproperty.com"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        const availableAmenities = [
          'WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Parking',
          'Airport Shuttle', 'Room Service', 'Concierge', 'Business Center',
          'Meeting Rooms', 'Laundry', 'Pet Friendly', 'Smoking Allowed'
        ];

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="rooms">Number of Rooms *</Label>
                <Input
                  id="rooms"
                  type="number"
                  value={formData.capacity.rooms}
                  onChange={(e) => handleInputChange('capacity.rooms', parseInt(e.target.value) || 0)}
                  placeholder="25"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="beds">Total Beds *</Label>
                <Input
                  id="beds"
                  type="number"
                  value={formData.capacity.beds}
                  onChange={(e) => handleInputChange('capacity.beds', parseInt(e.target.value) || 0)}
                  placeholder="50"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label>Amenities</Label>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableAmenities.map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="rounded border-nude-300 text-nude-600 focus:ring-nude-500"
                    />
                    <span className="text-sm text-nude-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="registrationNumber">Business Registration Number</Label>
                <Input
                  id="registrationNumber"
                  value={formData.businessInfo.registrationNumber}
                  onChange={(e) => handleInputChange('businessInfo.registrationNumber', e.target.value)}
                  placeholder="123456789"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="taxId">Tax ID/VAT Number</Label>
                <Input
                  id="taxId"
                  value={formData.businessInfo.taxId}
                  onChange={(e) => handleInputChange('businessInfo.taxId', e.target.value)}
                  placeholder="VAT123456789"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="establishedYear">Year Established</Label>
              <Input
                id="establishedYear"
                type="number"
                value={formData.businessInfo.establishedYear}
                onChange={(e) => handleInputChange('businessInfo.establishedYear', parseInt(e.target.value) || new Date().getFullYear())}
                placeholder="2020"
                className="mt-1"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-nude-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-nude-800 mb-4">Review Your Information</h3>
              <div className="space-y-4">
                <div>
                  <strong>Property Name:</strong> {formData.propertyName}
                </div>
                <div>
                  <strong>Type:</strong> {formData.propertyType}
                </div>
                <div>
                  <strong>Location:</strong> {formData.address.street}, {formData.address.city}, {formData.address.country}
                </div>
                <div>
                  <strong>Contact:</strong> {formData.contact.phone} | {formData.contact.email}
                </div>
                <div>
                  <strong>Capacity:</strong> {formData.capacity.rooms} rooms, {formData.capacity.beds} beds
                </div>
                <div>
                  <strong>Amenities:</strong> {formData.amenities.join(', ')}
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                By submitting this form, you agree to our Terms of Service and Privacy Policy. 
                Your property will be reviewed before going live on the platform.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-nude-50">
      <PageHeader
        title="Register Your Property"
        description="Join Buffr Host and start managing your hospitality business"
        icon={<Building2 className="h-6 w-6" />}
        breadcrumbs={[
          { label: 'Properties', href: '/properties' },
          { label: 'Register', href: '/properties/register', current: true }
        ]}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id 
                      ? 'bg-nude-600 border-nude-600 text-white' 
                      : 'border-nude-300 text-nude-400'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-semibold">{step.id}</span>
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-nude-800' : 'text-nude-400'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-nude-500">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden sm:block w-16 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-nude-600' : 'bg-nude-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {steps[currentStep - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                
                {currentStep < steps.length ? (
                  <Button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    {loading ? 'Submitting...' : 'Submit Registration'}
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
'use client';
import {
  BuffrIcon,
  BuffrCard,
  BuffrCardBody,
  BuffrCardHeader,
  BuffrCardTitle,
  BuffrButton,
  BuffrInput,
  BuffrLabel,
  BuffrSelect,
} from '@/components/ui';
/**
 * Property Owner Login Page
 *
 * Simple login page for property owners to access their CMS
 * Features: Authentication, property selection, dashboard access
 * Location: app/property-owner/login/page.tsx
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function PropertyOwnerLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    propertyId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock property data - in real app, this would come from API
  const mockProperties = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Savanna Restaurant',
      type: 'restaurant',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Ocean Breeze',
      type: 'restaurant',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Desert Rose',
      type: 'restaurant',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440008',
      name: 'Swakopmund Beach Resort',
      type: 'hotel',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440006',
      name: 'Namib Desert Lodge',
      type: 'hotel',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440007',
      name: 'Windhoek Grand Hotel',
      type: 'hotel',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Mock authentication - in real app, this would call auth API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, accept any email/password
      if (formData.email && formData.password && formData.propertyId) {
        // Redirect to property dashboard
        router.push(`/property-dashboard/${formData.propertyId}`);
      } else {
        setError('Please fill in all fields');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nude-50 to-nude-100 flex items-center justify-center p-4">
      <BuffrCard className="w-full max-w-md">
        <BuffrCardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-nude-100 rounded-full">
              <BuffrIcon name="building-2" className="h-8 w-8 text-nude-600" />
            </div>
          </div>
          <BuffrCardTitle className="text-2xl font-bold text-nude-900">
            Property Owner Login
          </BuffrCardTitle>
          <p className="text-nude-600 mt-2">
            Access your property management dashboard
          </p>
        </BuffrCardHeader>

        <BuffrCardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <BuffrLabel htmlFor="email">Email Address</BuffrLabel>
              <div className="relative">
                <BuffrIcon
                  name="user"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-nude-400"
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="owner@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <BuffrLabel htmlFor="password">Password</BuffrLabel>
              <div className="relative">
                <BuffrIcon
                  name="lock"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-nude-400"
                />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value)
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <BuffrLabel htmlFor="property">Select Property</BuffrLabel>
              <BuffrSelect
                value={formData.propertyId}
                onValueChange={(value) =>
                  handleInputChange('propertyId', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose your property" />
                </SelectTrigger>
                <SelectContent>
                  {mockProperties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name} ({property.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </BuffrSelect>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <BuffrButton type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Access Dashboard'}
            </BuffrButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-nude-600">
              Demo Credentials: Use any email/password
            </p>
            <p className="text-xs text-nude-500 mt-2">
              Select a property to access its management dashboard
            </p>
          </div>
        </BuffrCardContent>
      </BuffrCard>
    </div>
  );
}

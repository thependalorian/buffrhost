'use client';
/**
 * Property Owner Dashboard Page with Dynamic Property ID
 *
 * Main page for property owners to access their dashboard
 * Features: Property-specific routing, role-based access, property management
 * Location: app/property-dashboard/[id]/page.tsx
 */

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PropertyOwnerDashboard from '@/components/dashboard/property-owner/property-dashboard';

export default function PropertyDashboardPage() {
  const params = useParams();
  const _propertyId = params?.['id'] as string;
  const [tenantId, setTenantId] = useState<string>('default-tenant');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication and validate property access
    if (propertyId) {
      checkAuthenticationAndPropertyAccess();
    }
  }, [propertyId]);

  const checkAuthenticationAndPropertyAccess = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate property ID format
      if (!propertyId || typeof propertyId !== 'string') {
        throw new Error('Invalid property ID');
      }

      // In a real app, this would:
      // 1. Check JWT token for authentication
      // 2. Verify user has access to this specific property
      // 3. Get tenant ID from user context
      // 4. Validate property exists and is active

      // Mock validation for demo
      const mockPropertyValidation = await validatePropertyAccess(propertyId);

      if (!mockPropertyValidation.valid) {
        throw new Error(mockPropertyValidation.error);
      }

      setTenantId(mockPropertyValidation.tenantId || 'default-tenant');
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Authentication/Property access error:', error);
      setError(error instanceof Error ? error.message : 'Access denied');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Real property validation function using Neon database
  const validatePropertyAccess = async (
    propertyId: string
  ): Promise<{
    valid: boolean;
    tenantId?: string;
    error?: string;
  }> => {
    try {
      // Get user ID from authentication context
      const userId = 'user_123'; // This should come from auth context

      // Validate property access via API
      const response = await fetch(
        `/api/secure/properties?property_id=${propertyId}&owner_id=${userId}&include_details=true`
      );

      if (!response.ok) {
        return {
          valid: false,
          error: 'Property not found or access denied',
        };
      }

      const data = await response.json();

      if (!data.success || !data.data || data.data.length === 0) {
        return {
          valid: false,
          error: 'Property not found or access denied',
        };
      }

      const property = data.data[0];

      return {
        valid: true,
        tenantId: property.tenant_id || 'default-tenant',
      };
    } catch (error) {
      console.error('Property validation error:', error);
      return {
        valid: false,
        error: 'Failed to validate property access',
      };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nude-600 mx-auto mb-4"></div>
          <p className="text-nude-600">Loading property dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-nude-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="text-semantic-error text-6xl mb-4">🚫</div>
            <h2 className="mt-6 text-3xl font-extrabold text-nude-900">
              Access Denied
            </h2>
            <p className="mt-2 text-sm text-nude-600">
              {error ||
                'You need to be logged in as a property owner to access this dashboard.'}
            </p>
            <p className="mt-1 text-xs text-nude-500">
              Property ID: {propertyId}
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <button
              onClick={() => (window.location.href = '/auth/login')}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-nude-50 bg-nude-600 hover:bg-nude-700 focus:outline-none focus:ring-2 focus:ring-luxury-charlotte/20 focus:ring-offset-2 focus:ring-nude-500"
            >
              Sign In
            </button>
            <button
              onClick={() => (window.location.href = '/property-dashboard')}
              className="group relative w-full flex justify-center py-2 px-4 border border-nude-300 text-sm font-medium rounded-md text-nude-700 bg-nude-50 hover:bg-nude-50 focus:outline-none focus:ring-2 focus:ring-luxury-charlotte/20 focus:ring-offset-2 focus:ring-nude-500"
            >
              Back to Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <PropertyOwnerDashboard propertyId={propertyId} tenantId={tenantId} />;
}

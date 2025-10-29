'use client';
/**
 * Buffr Host Admin Dashboard Page
 *
 * Main administrative interface for platform management
 * Features: Platform overview, property management, user management, analytics
 * Location: app/admin-dashboard/page.tsx
 */

import { useState, useEffect } from 'react';
import BuffrHostAdminDashboard from '@/components/dashboard/admin/buffr-host-admin-dashboard';

export default function AdminDashboardPage() {
  const [adminId, setAdminId] = useState<string>('admin-001');
  const [tenantId] = useState<string>('default-tenant');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthenticationAndAccess();
  }, []);

  const checkAuthenticationAndAccess = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Mock authentication check for admin access
      const mockAdminAuth = {
        isAuthenticated: true,
        adminId: 'admin-001',
        role: 'admin',
        permissions: [
          'platform_management',
          'user_management',
          'property_management',
          'financial_access',
          'system_monitoring',
        ],
      };

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (mockAdminAuth.isAuthenticated && mockAdminAuth.role === 'admin') {
        setIsAuthenticated(true);
        setAdminId(mockAdminAuth.adminId);
      } else {
        setError('Access denied. Admin privileges required.');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('Failed to authenticate admin access');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nude-600 mx-auto mb-4"></div>
          <p className="text-nude-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (error || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-nude-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-nude-50 shadow-luxury-strong rounded-lg p-8">
          <div className="text-center">
            <div className="text-semantic-error text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-nude-900 mb-2">
              Access Denied
            </h2>
            <p className="text-nude-600 mb-6">
              {error || 'Admin privileges required to access this dashboard.'}
            </p>
            <div className="space-y-3">
              <BuffrButton
                onClick={checkAuthenticationAndAccess}
                variant="primary"
                size="lg"
                className="w-full"
              >
                Try Again
              </BuffrButton>
              <BuffrButton
                onClick={() => (window.location.href = '/')}
                variant="outline"
                size="lg"
                className="w-full"
              >
                Return to Home
              </BuffrButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <BuffrHostAdminDashboard adminId={adminId} tenantId={tenantId} />;
}

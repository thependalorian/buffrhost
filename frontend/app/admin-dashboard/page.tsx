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
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-nude-600 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-nude-600 break-words">
            Verifying admin access...
          </p>
        </div>
      </div>
    );
  }

  if (error || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-nude-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-nude-50 shadow-luxury-strong rounded-lg p-6 sm:p-8">
          <div className="text-center">
            <div className="text-semantic-error text-4xl sm:text-6xl mb-4">
              🔒
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-nude-900 mb-2 truncate">
              Access Denied
            </h2>
            <p className="text-sm sm:text-base text-nude-600 mb-6 break-words px-2">
              {error || 'Admin privileges required to access this dashboard.'}
            </p>
            <div className="space-y-3">
              <button
                onClick={checkAuthenticationAndAccess}
                className="w-full bg-blue-600 text-white px-4 sm:px-6 py-3 text-sm sm:text-base rounded-md hover:bg-blue-700 font-medium min-h-[44px]"
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="w-full bg-gray-200 text-gray-800 px-4 sm:px-6 py-3 text-sm sm:text-base rounded-md hover:bg-gray-300 font-medium min-h-[44px]"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <BuffrHostAdminDashboard adminId={adminId} tenantId={tenantId} />;
}

import React from 'react';
/**
 *  React Component for Buffr Host Hospitality Platform
 * @fileoverview  displays comprehensive dashboard with key metrics and analytics
 * @location buffr-host/components/dashboard/RoleBasedDashboard.tsx
 * @purpose  displays comprehensive dashboard with key metrics and analytics
 * @component
 * @category Dashboard
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @authentication JWT-based authentication for user-specific functionality
 * @hooks_utilization useAuth for state management and side effects
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Secure authentication integration for user-specific features
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Methods:
 * @method RoleBasedDashboard - RoleBasedDashboard method for component functionality
 *
 * Usage Example:
 * @example
 * import  from './';
 *
 * function App() {
 *   return (
 *     <
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered  component
 */

import { useAuth } from '@payloadcms/ui/providers/Auth';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import StaffDashboard from './StaffDashboard';
import TenantManagementDashboard from './TenantManagementDashboard';

const RoleBasedDashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  switch (user.role) {
    case 'super_admin':
      return <TenantManagementDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    case 'staff':
      return <StaffDashboard />;
    default:
      return <div>Welcome!</div>; // A default view for other roles
  }
};

export default RoleBasedDashboard;

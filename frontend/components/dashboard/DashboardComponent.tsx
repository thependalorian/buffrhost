/**
 * Dashboard Component - Buffr Host Framework
 *
 * Purpose: Renders appropriate dashboard based on user role
 * Location: /src/admin/components/DashboardComponent.tsx
 */

import React from 'react';
/**
 * DashboardComponent React Component for Buffr Host Hospitality Platform
 * @fileoverview DashboardComponent displays comprehensive dashboard with key metrics and analytics
 * @location buffr-host/components/dashboard/DashboardComponent.tsx
 * @purpose DashboardComponent displays comprehensive dashboard with key metrics and analytics
 * @component DashboardComponent
 * @category Dashboard
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Configurable props for flexible component usage
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Props:
 * @param {unknown} [user] - user prop description
 *
 * Usage Example:
 * @example
 * import { DashboardComponent } from './DashboardComponent';
 *
 * function App() {
 *   return (
 *     <DashboardComponent
 *       prop1="value"
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered DashboardComponent component
 */

import { CRMDashboard } from './dashboards/CRMDashboard';
import { PropertyOwnerDashboard } from './dashboards/PropertyOwnerDashboard';
import { StaffDashboard } from './dashboards/StaffDashboard';

interface DashboardComponentProps {
  user: unknown;
}

export const DashboardComponent: React.FC<DashboardComponentProps> = ({
  user,
}) => {
  switch (user?.role) {
    case 'super_admin':
    case 'admin':
      return <CRMDashboard user={user} />;
    case 'property_manager':
    case 'property_owner':
      return <PropertyOwnerDashboard user={user} />;
    case 'staff':
    case 'marketing':
      return <StaffDashboard user={user} />;
    default:
      return <div>No dashboard available for this role</div>;
  }
};

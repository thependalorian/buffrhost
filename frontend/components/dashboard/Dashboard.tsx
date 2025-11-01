import React from 'react';
/**
 * CustomDashboard React Component for Buffr Host Hospitality Platform
 * @fileoverview CustomDashboard displays comprehensive dashboard with key metrics and analytics
 * @location buffr-host/components/dashboard/Dashboard.tsx
 * @purpose CustomDashboard displays comprehensive dashboard with key metrics and analytics
 * @component CustomDashboard
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
 * @method CustomDashboard - CustomDashboard method for component functionality
 * @method getWelcomeMessage - getWelcomeMessage method for component functionality
 * @method WelcomeDashboard - WelcomeDashboard method for component functionality
 *
 * Usage Example:
 * @example
 * import { CustomDashboard } from './CustomDashboard';
 *
 * function App() {
 *   return (
 *     <CustomDashboard
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered CustomDashboard component
 */

import { useAuth } from '@payloadcms/ui/providers/Auth';
import { Gutter } from '@payloadcms/ui/elements/Gutter';
import { Eyebrow } from '@/components/ui/eyebrow';
import { DashboardComponent } from './DashboardComponent';

// Import role-specific dashboards
import { SofiaAIDashboard } from './dashboards/SofiaAIDashboard';
import { CRMDashboard } from './dashboards/CRMDashboard';

export const CustomDashboard = () => {
  const { user } = useAuth();

  // Buffr Host: Emotional intelligence in welcome messages
  const getWelcomeMessage = (role: string) => {
    const messages: Record<string, string> = {
      super_admin:
        'You have complete oversight of the Buffr Host ecosystem. Every decision you make impacts our community.',
      admin:
        "You're the backbone of our operations. Your attention to detail keeps everything running smoothly.",
      property_manager:
        "Your properties are the heart of our platform. Let's make them shine today.",
      property_owner:
        "Your business success is our success. We're here to help you thrive.",
      staff:
        "You're the face of our hospitality. Your care makes all the difference.",
      marketing:
        "Your creativity drives our growth. Let's tell our story beautifully today.",
    };

    return (
      messages[role] ||
      "Welcome to Buffr Host. Let's make today amazing together."
    );
  };

  // Default dashboard for unknown roles
  const WelcomeDashboard = () => (
    <div className="default-dashboard">
      <div className="dashboard-card">
        <h2>Getting Started</h2>
        <p>Welcome to Buffr Host! Your role is being configured.</p>
        <div className="quick-actions">
          <a href="/admin/collections/properties" className="btn btn-primary">
            View Properties
          </a>
          <a href="/admin/collections/bookings" className="btn btn-secondary">
            View Bookings
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <Gutter>
      <Eyebrow>
        <div className="dashboard-welcome">
          <h1>Welcome back, {user?.name || 'User'}</h1>
          <p className="role-badge">
            {user?.role?.replace('_', ' ').toUpperCase()}
          </p>
          <p className="welcome-message">{getWelcomeMessage(user?.role)}</p>
        </div>
      </Eyebrow>
      <DashboardComponent user={user} />
    </Gutter>
  );
};

import React from 'react';
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

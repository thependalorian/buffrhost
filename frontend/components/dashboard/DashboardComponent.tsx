/**
 * Dashboard Component - Buffr Host Framework
 *
 * Purpose: Renders appropriate dashboard based on user role
 * Location: /src/admin/components/DashboardComponent.tsx
 */

import React from 'react';
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

import React from 'react';
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

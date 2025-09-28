import React from "react";
import AdminEmailControlsDashboard from "@/components/email/AdminEmailControlsDashboard";

const AdminEmailDashboardPage: React.FC = () => {
  return (
    <div className="admin-email-dashboard-page">
      <h1>Admin Email Dashboard (Buffr Host)</h1>
      <p>
        This page provides an overview and access to all admin email control
        features for Buffr Host.
      </p>
      <AdminEmailControlsDashboard />
    </div>
  );
};

export default AdminEmailDashboardPage;

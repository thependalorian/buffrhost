import React from 'react';
import EmailAnalyticsChart from '@/components/email/EmailAnalyticsChart';

const AdminEmailAnalyticsPage: React.FC = () => {
  return (
    <div className="admin-email-analytics-page">
      <h1>Email Analytics Dashboard (Buffr Host)</h1>
      <p>View email delivery, open, and click rates for Buffr Host.</p>
      <EmailAnalyticsChart />
    </div>
  );
};

export default AdminEmailAnalyticsPage;

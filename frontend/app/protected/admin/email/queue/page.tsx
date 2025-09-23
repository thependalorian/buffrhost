import React from 'react';
import EmailQueueManager from '@/components/email/EmailQueueManager';

const AdminEmailQueuePage: React.FC = () => {
  return (
    <div className="admin-email-queue-page">
      <h1>Email Queue Management (Buffr Host)</h1>
      <p>Monitor and manage the email sending queue for Buffr Host.</p>
      <EmailQueueManager />
    </div>
  );
};

export default AdminEmailQueuePage;

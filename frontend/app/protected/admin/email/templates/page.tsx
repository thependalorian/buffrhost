import React from 'react';
import EmailTemplateManager from '@/components/email/EmailTemplateManager';

const AdminEmailTemplatesPage: React.FC = () => {
  return (
    <div className="admin-email-templates-page">
      <h1>Email Template Management (Buffr Host)</h1>
      <p>Manage all email templates for the Buffr Host system.</p>
      <EmailTemplateManager />
    </div>
  );
};

export default AdminEmailTemplatesPage;

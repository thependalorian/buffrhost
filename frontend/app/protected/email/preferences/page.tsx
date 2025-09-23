import React from 'react';
import EmailPreferencesForm from '@/components/email/EmailPreferencesForm';

const UserEmailPreferencesPage: React.FC = () => {
  return (
    <div className="user-email-preferences-page">
      <h1>Email Preferences (Buffr Host)</h1>
      <p>Manage your email notification settings for Buffr Host.</p>
      <EmailPreferencesForm />
    </div>
  );
};

export default UserEmailPreferencesPage;

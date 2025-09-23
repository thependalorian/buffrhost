
import { Metadata } from 'next';
import { EmailPreferencesForm } from '@/components/email/EmailPreferencesForm';

export const metadata: Metadata = {
  title: 'Email Preferences',
  description: 'Manage your email notification preferences.',
};

export default function EmailPreferencesPage() {
  return <EmailPreferencesForm />;
}

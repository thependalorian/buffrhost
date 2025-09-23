
import { Metadata } from 'next';
import EmailBlacklistManager from '@/components/email/EmailBlacklistManager';

export const metadata: Metadata = {
  title: 'Email Blacklist Management',
  description: 'Manage the email blacklist.',
};

export default function EmailBlacklistPage() {
  return <EmailBlacklistManager />;
}


import { Metadata } from 'next';
import { EmailHistory } from '@/components/email/EmailHistory';

export const metadata: Metadata = {
  title: 'Email History',
  description: 'View your email history.',
};

export default function EmailHistoryPage() {
  return <EmailHistory />;
}


import { Metadata } from 'next';
import EmailQueueManager from '@/components/email/EmailQueueManager';

export const metadata: Metadata = {
  title: 'Email Queue Management',
  description: 'Monitor and manage the email queue.',
};

export default function EmailQueuePage() {
  return <EmailQueueManager />;
}

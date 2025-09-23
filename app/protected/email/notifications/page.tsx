
import { Metadata } from 'next';
import { EmailNotificationList } from '@/components/email/EmailNotificationList';

export const metadata: Metadata = {
  title: 'Email Notifications',
  description: 'View your recent email notifications.',
};

export default function EmailNotificationsPage() {
  return <EmailNotificationList />;
}

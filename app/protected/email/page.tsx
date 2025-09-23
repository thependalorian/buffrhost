
import { Metadata } from 'next';
import { UserEmailDashboard } from '@/components/email/UserEmailDashboard';

export const metadata: Metadata = {
  title: 'Email Dashboard',
  description: 'Manage your email notifications and preferences.',
};

export default function UserEmailDashboardPage() {
  return <UserEmailDashboard />;
}

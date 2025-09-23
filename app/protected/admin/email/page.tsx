
import { Metadata } from 'next';
import { AdminEmailDashboard } from '@/components/email/AdminEmailDashboard';

export const metadata: Metadata = {
  title: 'Admin Email Dashboard',
  description: 'Manage and monitor the email system.',
};

export default function AdminEmailPage() {
  return <AdminEmailDashboard />;
}

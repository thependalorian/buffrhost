
import { Metadata } from 'next';
import EmailAnalyticsDashboard from '@/components/email/EmailAnalyticsDashboard';

export const metadata: Metadata = {
  title: 'Email Analytics',
  description: 'Analyze email performance and engagement.',
};

export default function EmailAnalyticsPage() {
  return <EmailAnalyticsDashboard />;
}

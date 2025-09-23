
import { Metadata } from 'next';
import EmailTemplateManager from '@/components/email/EmailTemplateManager';

export const metadata: Metadata = {
  title: 'Email Template Management',
  description: 'Create, edit, and manage email templates.',
};

export default function EmailTemplatesPage() {
  return <EmailTemplateManager />;
}

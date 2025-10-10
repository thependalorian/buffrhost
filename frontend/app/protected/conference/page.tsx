import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conference Management',
  description: 'Manage conference events, rooms, and bookings.',
};

export default function ConferencePage() {
  return <h1>Conference Management</h1>;
}

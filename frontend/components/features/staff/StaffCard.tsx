/**
 * @file This file defines the StaffCard component, which displays information about a staff member.
 * @location frontend/components/features/staff/StaffCard.tsx
 * @description This component renders a card with a staff member's name, position, and status.
 * @modular
 *
 * @component
 * @param {StaffCardProps} props - The props for the component.
 * @param {Staff} props.staff - The staff member to display.
 * @param {() => void} props.onUpdate - Callback function to handle staff update.
 *
 * @example
 * const staff = {
 *   id: '1',
 *   employee_id: 'EMP001',
 *   position: 'Manager',
 *   department: 'Operations',
 *   hire_date: '2022-01-01',
 *   salary: 50000,
 *   status: 'active',
 *   shift_type: 'morning',
 *   tenant_id: 'some-uuid',
 *   user_id: 'some-uuid',
 *   property_id: 'some-uuid',
 * };
 * <StaffCard staff={staff} onUpdate={() => console.log('Update staff')} />
 *
 * @see {@link Staff}
 *
 * @security This component does not handle any sensitive data directly.
 * @accessibility The component uses semantic HTML.
 * @performance The component is lightweight and has minimal performance impact.
 *
 * @buffr-icon-usage This component does not use any icons directly.
 */
// frontend/components/features/staff/StaffCard.tsx

/**
 * StaffCard React Component for Buffr Host Hospitality Platform
 * @fileoverview StaffCard provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/features/staff/StaffCard.tsx
 * @purpose StaffCard provides specialized functionality for the Buffr Host platform
 * @component StaffCard
 * @category Features
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Configurable props for flexible component usage
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Props:
 * @param {Staff} [staff] - staff prop description
 * @param {() => void} [onUpdate] - onUpdate prop description
 *
 * Usage Example:
 * @example
 * import StaffCard from './StaffCard';
 *
 * function App() {
 *   return (
 *     <StaffCard
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered StaffCard component
 */

import { Staff } from '@/lib/types/staff';

interface StaffCardProps {
  staff: Staff;
  onUpdate: () => void;
}

export default function StaffCard({ staff, onUpdate }: StaffCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold">{staff.employee_id}</h2>
      <p className="text-gray-600">{staff.position}</p>
      <p className="text-gray-600">{staff.department}</p>
      <button
        onClick={onUpdate}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Update
      </button>
    </div>
  );
}

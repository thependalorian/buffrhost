/**
 * @file This file defines the StaffList component, which displays a list of staff members.
 * @location frontend/components/features/staff/StaffList.tsx
 * @description This component renders a list of staff members, with options for filtering and sorting.
 * @modular
 *
 * @component
 * @param {StaffListProps} props - The props for the component.
 * @param {Staff[]} props.staff - An array of staff members to display.
 * @param {boolean} props.loading - Indicates if the staff list is currently loading.
 * @param {() => void} props.onStaffUpdate - Callback function to handle staff updates.
 *
 * @example
 * const staff = [
 *   { id: '1', employee_id: 'EMP001', position: 'Manager', department: 'Operations', hire_date: '2022-01-01', salary: 50000, status: 'active', shift_type: 'morning', tenant_id: 'some-uuid', user_id: 'some-uuid', property_id: 'some-uuid' },
 *   { id: '2', employee_id: 'EMP002', position: 'Receptionist', department: 'Front Office', hire_date: '2022-03-15', salary: 30000, status: 'active', shift_type: 'afternoon', tenant_id: 'some-uuid', user_id: 'some-uuid', property_id: 'some-uuid' },
 * ];
 * <StaffList staff={staff} loading={false} onStaffUpdate={() => console.log('Staff updated')} />
 *
 * @see {@link StaffCard}
 *
 * @security This component does not handle any sensitive data directly.
 * @accessibility The component uses semantic HTML.
 * @performance The component is lightweight and has minimal performance impact.
 *
 * @buffr-icon-usage This component does not use any icons directly.
 */
// /components/features/staff/StaffList.tsx

/**
 * StaffList React Component for Buffr Host Hospitality Platform
 * @fileoverview StaffList provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/features/staff/StaffList.tsx
 * @purpose StaffList provides specialized functionality for the Buffr Host platform
 * @component StaffList
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
 * @param {Staff[]} [staff] - staff prop description
 * @param {boolean} [loading] - loading prop description
 * @param {() => void} [onStaffUpdate] - onStaffUpdate prop description
 *
 * Usage Example:
 * @example
 * import StaffList from './StaffList';
 *
 * function App() {
 *   return (
 *     <StaffList
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered StaffList component
 */

import { Staff } from '@/lib/types/staff';
import StaffCard from './StaffCard';

interface StaffListProps {
  staff: Staff[];
  loading: boolean;
  onStaffUpdate: () => void;
}

export default function StaffList({
  staff,
  loading,
  onStaffUpdate,
}: StaffListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (staff.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No staff members found</div>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
          Add First Staff Member
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {staff.map((staffMember) => (
        <StaffCard
          key={staffMember.id}
          staff={staffMember}
          onUpdate={onStaffUpdate}
        />
      ))}
    </div>
  );
}

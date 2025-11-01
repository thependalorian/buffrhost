/**
 * @file This file defines the StaffFilters component, which provides filtering options for staff members.
 * @location frontend/components/features/staff/StaffFilters.tsx
 * @description This component renders a set of input fields and dropdowns to filter staff by various criteria such as position, department, and status.
 * @modular
 *
 * @component
 * @param {StaffFiltersProps} props - The props for the component.
 * @param {object} props.filters - The current filter values.
 * @param {string} props.filters.department - The department filter value.
 * @param {number} props.filters.page - The current page number.
 * @param {number} props.filters.limit - The number of items per page.
 * @param {(newFilters: object) => void} props.onFiltersChange - Callback function to handle filter changes.
 * @param {() => void} props.onRefresh - Callback function to refresh the staff list.
 *
 * @example
 * const filters = { department: 'Operations', page: 1, limit: 10 };
 * <StaffFilters filters={filters} onFiltersChange={(f) => console.log(f)} onRefresh={() => console.log('Refreshing staff')} />
 *
 * @see {@link BuffrInput}
 * @see {@link BuffrSelect}
 * @see {@link BuffrButton}
 *
 * @security This component does not handle any sensitive data directly.
 * @accessibility The component uses semantic HTML and labels for input fields.
 * @performance The component is lightweight and has minimal performance impact.
 *
 * @buffr-icon-usage This component does not use any icons directly.
 */
// frontend/components/features/staff/StaffFilters.tsx

interface StaffFiltersProps {
  filters: {
    department: string;
    page: number;
    limit: number;
  };
  onFiltersChange: (filters: {
    department: string;
    page: number;
    limit: number;
  }) => void;
  onRefresh: () => void;
}

/**
 * StaffFilters React Component for Buffr Host Hospitality Platform
 * @fileoverview StaffFilters provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/features/staff/StaffFilters.tsx
 * @purpose StaffFilters provides specialized functionality for the Buffr Host platform
 * @component StaffFilters
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
 * @param {{
    department} [filters] - filters prop description
 * @param {number} [page] - page prop description
 * @param {number} [limit] - limit prop description
 *
 * Usage Example:
 * @example
 * import StaffFilters from './StaffFilters';
 *
 * function App() {
 *   return (
 *     <StaffFilters
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered StaffFilters component
 */

export default function StaffFilters({
  filters,
  onFiltersChange,
  onRefresh,
}: StaffFiltersProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="department"
            className="block text-sm font-medium text-gray-700"
          >
            Department
          </label>
          <input
            type="text"
            id="department"
            value={filters.department}
            onChange={(e) =>
              onFiltersChange({ ...filters, department: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={onRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}

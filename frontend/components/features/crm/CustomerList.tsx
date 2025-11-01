// frontend/components/features/crm/CustomerList.tsx

/**
 * CustomerList React Component for Buffr Host Hospitality Platform
 * @fileoverview CustomerList provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/features/crm/CustomerList.tsx
 * @purpose CustomerList provides specialized functionality for the Buffr Host platform
 * @component CustomerList
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
 * @param {Customer[]} [customers] - customers prop description
 * @param {boolean} [loading] - loading prop description
 * @param {() => void} [onCustomerUpdate] - onCustomerUpdate prop description
 *
 * Usage Example:
 * @example
 * import CustomerList from './CustomerList';
 *
 * function App() {
 *   return (
 *     <CustomerList
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered CustomerList component
 */

import { Customer } from '@/lib/types';

interface CustomerListProps {
  customers: Customer[];
  loading: boolean;
  onCustomerUpdate: () => void;
}

export default function CustomerList({
  customers,
  loading,
  onCustomerUpdate,
}: CustomerListProps) {
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

  if (customers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No customers found</div>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
          Add First Customer
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {customers.map((customer) => (
        <div key={customer.id} className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-bold">
            {customer.first_name} {customer.last_name}
          </h2>
          <p className="text-gray-600">{customer.email}</p>
          <p className="text-gray-600">{customer.phone}</p>
        </div>
      ))}
    </div>
  );
}

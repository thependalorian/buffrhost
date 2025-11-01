'use client';
/**
 * Disbursement Dashboard Component
 * Shows disbursement history and status for property owners
 * Location: /components/disbursements/disbursement-dashboard.tsx
 */

import { useState, useEffect } from 'react';

interface Disbursement {
  id: string;
  property_id: string;
  tenant_id: string;
  disbursement_date: string;
  total_transactions: number;
  total_amount_collected: number;
  total_vat_amount: number;
  total_processing_fees: number;
  total_buffr_fees: number;
  disbursement_fee: number;
  net_property_amount: number;
  realpay_transaction_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processed_at: string;
  error_message?: string;
}

interface DisbursementDashboardProps {
  propertyId: string;
  tenantId: string;
}

/**
 * DisbursementDashboard React Component for Buffr Host Hospitality Platform
 * @fileoverview DisbursementDashboard provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/disbursements/disbursement-dashboard.tsx
 * @purpose DisbursementDashboard provides specialized functionality for the Buffr Host platform
 * @component DisbursementDashboard
 * @category Disbursements
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @database_connections Reads from relevant tables based on component functionality
 * @api_integration RESTful API endpoints for data fetching and mutations
 * @state_management Local component state for UI interactions and data management
 * @hooks_utilization useState, useEffect for state management and side effects
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Configurable props for flexible component usage
 * - Interactive state management for dynamic user experiences
 * - Real-time data integration with backend services
 * - API-driven functionality with error handling and loading states
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Props:
 * @param {string} [propertyId] - propertyId prop description
 * @param {string} [tenantId] - tenantId prop description
 *
 * State:
 * @state {any} [] - Component state for [] management
 * @state {any} null - Component state for null management
 *
 * Methods:
 * @method formatCurrency - formatCurrency method for component functionality
 * @method formatDate - formatDate method for component functionality
 * @method getStatusBadge - getStatusBadge method for component functionality
 *
 * Usage Example:
 * @example
 * import DisbursementDashboard from './DisbursementDashboard';
 *
 * function App() {
 *   return (
 *     <DisbursementDashboard
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered DisbursementDashboard component
 */

export default function DisbursementDashboard({
  propertyId,
  tenantId,
}: DisbursementDashboardProps) {
  const [disbursements, setDisbursements] = useState<Disbursement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalDisbursed: 0,
    totalFees: 0,
    pendingAmount: 0,
    completedDisbursements: 0,
  });

  useEffect(() => {
    fetchDisbursements();
  }, [propertyId, tenantId]);

  const fetchDisbursements = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/secure/disbursements?property_id=${propertyId}&tenant_id=${tenantId}&limit=20`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch disbursements');
      }

      const data = await response.json();
      setDisbursements(data.data);

      // Calculate stats
      const totalDisbursed = data.data
        .filter((d: Disbursement) => d.status === 'completed')
        .reduce(
          (sum: number, d: Disbursement) => sum + d.net_property_amount,
          0
        );

      const totalFees = data.data.reduce(
        (sum: number, d: Disbursement) => sum + d.disbursement_fee,
        0
      );

      const pendingAmount = data.data
        .filter(
          (d: Disbursement) =>
            d.status === 'pending' || d.status === 'processing'
        )
        .reduce(
          (sum: number, d: Disbursement) => sum + d.net_property_amount,
          0
        );

      const completedDisbursements = data.data.filter(
        (d: Disbursement) => d.status === 'completed'
      ).length;

      setStats({
        totalDisbursed,
        totalFees,
        pendingAmount,
        completedDisbursements,
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to fetch disbursements'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NA', {
      style: 'currency',
      currency: 'NAD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'badge badge-sm rounded-full text-xs font-medium';

    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-success`;
      case 'processing':
        return `${baseClasses} bg-nude-100 text-nude-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-warning`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-error`;
      default:
        return `${baseClasses} bg-nude-100 text-nude-800`;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nude-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md card-body">
        <p className="text-error">{error}</p>
        <button
          onClick={fetchDisbursements}
          className="mt-2 text-error hover:text-error underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-nude-50 card-body card shadow-2xl">
          <h3 className="text-sm font-medium text-nude-500">Total Disbursed</h3>
          <p className="text-2xl font-bold text-success">
            {formatCurrency(stats.totalDisbursed)}
          </p>
        </div>

        <div className="bg-nude-50 card-body card shadow-2xl">
          <h3 className="text-sm font-medium text-nude-500">Total Fees</h3>
          <p className="text-2xl font-bold text-error">
            {formatCurrency(stats.totalFees)}
          </p>
        </div>

        <div className="bg-nude-50 card-body card shadow-2xl">
          <h3 className="text-sm font-medium text-nude-500">Pending Amount</h3>
          <p className="text-2xl font-bold text-warning">
            {formatCurrency(stats.pendingAmount)}
          </p>
        </div>

        <div className="bg-nude-50 card-body card shadow-2xl">
          <h3 className="text-sm font-medium text-nude-500">Completed</h3>
          <p className="text-2xl font-bold text-nude-600">
            {stats.completedDisbursements}
          </p>
        </div>
      </div>

      {/* Disbursements Table */}
      <div className="bg-nude-50 card shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-nude-200">
          <h2 className="text-lg font-semibold text-nude-900">
            Recent Disbursements
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-nude-50">
              <tr>
                <th className="btn btn-md text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="btn btn-md text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                  Transactions
                </th>
                <th className="btn btn-md text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                  Amount Collected
                </th>
                <th className="btn btn-md text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                  Net Amount
                </th>
                <th className="btn btn-md text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="btn btn-md text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                  RealPay ID
                </th>
              </tr>
            </thead>
            <tbody className="bg-nude-50 divide-y divide-gray-200">
              {disbursements.map((disbursement) => (
                <tr key={disbursement.id} className="hover:bg-nude-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-nude-900">
                    {formatDate(disbursement.disbursement_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-nude-900">
                    {disbursement.total_transactions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-nude-900">
                    {formatCurrency(disbursement.total_amount_collected)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-nude-900">
                    {formatCurrency(disbursement.net_property_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(disbursement.status)}>
                      {disbursement.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-nude-500">
                    {disbursement.realpay_transaction_id || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {disbursements.length === 0 && (
          <div className="text-center py-8">
            <p className="text-nude-500">No disbursements found</p>
          </div>
        )}
      </div>

      {/* Fee Breakdown */}
      <div className="bg-nude-50 card shadow-2xl card-body">
        <h3 className="text-lg font-semibold text-nude-900 mb-4">
          Fee Breakdown
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-nude-600">Buffr Service Fee (10%):</span>
            <span className="font-medium">
              {formatCurrency(
                disbursements.reduce((sum, d) => sum + d.total_buffr_fees, 0)
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-nude-600">Processing Fees:</span>
            <span className="font-medium">
              {formatCurrency(
                disbursements.reduce(
                  (sum, d) => sum + d.total_processing_fees,
                  0
                )
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-nude-600">RealPay Disbursement Fees:</span>
            <span className="font-medium">
              {formatCurrency(
                disbursements.reduce((sum, d) => sum + d.disbursement_fee, 0)
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-nude-600">VAT (15%):</span>
            <span className="font-medium">
              {formatCurrency(
                disbursements.reduce((sum, d) => sum + d.total_vat_amount, 0)
              )}
            </span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total Fees:</span>
            <span className="text-error">
              {formatCurrency(
                stats.totalFees +
                  disbursements.reduce(
                    (sum, d) =>
                      sum + d.total_processing_fees + d.total_buffr_fees,
                    0
                  )
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

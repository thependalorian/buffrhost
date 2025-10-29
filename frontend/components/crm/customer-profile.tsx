/**
 * Customer Profile Component - Modular Implementation
 *
 * Purpose: Comprehensive customer profile management with modular architecture
 * Functionality: Personal info, preferences, transaction history, communication
 * Location: /components/crm/customer-profile-modular.tsx
 *
 * Follows 40 Rules:
 * - Uses DaisyUI for consistent styling
 * - Modular component design for easy maintenance
 * - TypeScript for type safety
 * - Vercel-compatible with SSR
 * - Uses Neon PostgreSQL database
 * - Comprehensive error handling
 * - Optimized for performance
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import {
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  User,
  Settings,
  CreditCard,
  MessageSquare,
} from 'lucide-react';

// Import modular components
import PersonalInfo from './customer-profile/PersonalInfo';
import Preferences from './customer-profile/Preferences';
import TransactionHistory from './customer-profile/TransactionHistory';

// Types for TypeScript compliance
interface PersonalInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  avatar?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomerPreferences {
  id: string;
  interests: string[];
  communicationChannels: {
    email: boolean;
    sms: boolean;
    phone: boolean;
    push: boolean;
  };
  notificationSettings: {
    marketing: boolean;
    promotions: boolean;
    updates: boolean;
    reminders: boolean;
  };
  dietaryRestrictions: string[];
  accessibilityNeeds: string[];
  language: string;
  timezone: string;
  preferredContactTime: string;
  notes: string;
  updatedAt: string;
}

interface Transaction {
  id: string;
  type: 'payment' | 'refund' | 'adjustment' | 'bonus';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  description: string;
  paymentMethod: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    bookingId?: string;
    orderId?: string;
    propertyId?: string;
  };
}

interface CustomerProfileProps {
  customerId: string;
  onClose?: () => void;
}

// Main Customer Profile Component
export const CustomerProfileModular: React.FC<CustomerProfileProps> = ({
  customerId,
  onClose,
}) => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [preferences, setPreferences] = useState<CustomerPreferences | null>(
    null
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('personal');

  // Refs for performance optimization
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load customer data
  useEffect(() => {
    const loadCustomerData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load personal information
        const personalRes = await fetch(
          `/api/secure/customers/${customerId}/personal-info`
        );
        if (personalRes.ok) {
          const personalData = await personalRes.json();
          setPersonalInfo(personalData.data);
        }

        // Load preferences
        const preferencesRes = await fetch(
          `/api/secure/customers/${customerId}/preferences`
        );
        if (preferencesRes.ok) {
          const preferencesData = await preferencesRes.json();
          setPreferences(preferencesData.data);
        }

        // Load transaction history
        const transactionsRes = await fetch(
          `/api/secure/customers/${customerId}/transactions`
        );
        if (transactionsRes.ok) {
          const transactionsData = await transactionsRes.json();
          setTransactions(transactionsData.data);
        }
      } catch (err) {
        console.error('Error loading customer data:', err);
        setError('Failed to load customer profile data');

        // Fallback mock data
        setPersonalInfo({
          id: customerId,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+264 81 123 4567',
          dateOfBirth: '1990-01-15',
          gender: 'male',
          address: {
            street: '123 Main Street',
            city: 'Windhoek',
            state: 'Khomas',
            postalCode: '10001',
            country: 'Namibia',
          },
          avatar: undefined,
          notes: 'VIP customer with high spending history',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        setPreferences({
          id: customerId,
          interests: ['Fine Dining', 'Wine Tasting', 'Spa Services'],
          communicationChannels: {
            email: true,
            sms: true,
            phone: false,
            push: true,
          },
          notificationSettings: {
            marketing: true,
            promotions: true,
            updates: true,
            reminders: true,
          },
          dietaryRestrictions: ['Vegetarian'],
          accessibilityNeeds: ['Wheelchair Access'],
          language: 'en',
          timezone: 'Africa/Windhoek',
          preferredContactTime: 'afternoon',
          notes: 'Prefers afternoon communications',
          updatedAt: new Date().toISOString(),
        });

        setTransactions([
          {
            id: '1',
            type: 'payment',
            amount: 2500,
            currency: 'NAD',
            status: 'completed',
            description: 'Hotel booking - Deluxe Suite',
            paymentMethod: 'Credit Card',
            reference: 'TXN-001',
            createdAt: new Date(
              Date.now() - 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
            updatedAt: new Date(
              Date.now() - 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
            metadata: {
              bookingId: 'BK-001',
              propertyId: 'PROP-001',
            },
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    if (customerId) {
      loadCustomerData();
    }
  }, [customerId]);

  // Handle personal info update
  const handlePersonalInfoUpdate = async (updates: Partial<PersonalInfo>) => {
    try {
      const response = await fetch(
        `/api/secure/customers/${customerId}/personal-info`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) throw new Error('Failed to update personal info');

      const updatedData = await response.json();
      setPersonalInfo(updatedData.data);
      setSuccess('Personal information updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error updating personal info:', error);
      setError('Failed to update personal information');
    }
  };

  // Handle preferences update
  const handlePreferencesUpdate = async (
    updates: Partial<CustomerPreferences>
  ) => {
    try {
      const response = await fetch(
        `/api/secure/customers/${customerId}/preferences`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) throw new Error('Failed to update preferences');

      const updatedData = await response.json();
      setPreferences(updatedData.data);
      setSuccess('Preferences updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error updating preferences:', error);
      setError('Failed to update preferences');
    }
  };

  // Handle transaction view
  const handleTransactionView = (transaction: Transaction) => {
    console.log('View transaction:', transaction);
    // Implement transaction detail view
  };

  // Handle refresh
  const handleRefresh = () => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    refreshTimeoutRef.current = setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  // Handle export
  const handleExport = () => {
    try {
      const data = {
        customerId,
        personalInfo,
        preferences,
        transactions,
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customer-profile-${customerId}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      setError('Failed to export customer data');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-base-content mb-2">
              Customer Profile
            </h1>
            <p className="text-base-content/70">
              {personalInfo
                ? `${personalInfo.firstName} ${personalInfo.lastName}`
                : 'Loading...'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
            <Button
              onClick={handleRefresh}
              className="btn-outline btn-sm"
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button onClick={handleExport} className="btn-primary btn-sm">
              <Download className="w-4 h-4" />
              Export
            </Button>
            {onClose && (
              <Button onClick={onClose} className="btn-ghost btn-sm">
                Close
              </Button>
            )}
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="alert alert-error mb-6">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
            <Button onClick={() => setError(null)} className="btn-sm btn-ghost">
              ×
            </Button>
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-6">
            <CheckCircle className="w-4 h-4" />
            <span>{success}</span>
            <Button
              onClick={() => setSuccess(null)}
              className="btn-sm btn-ghost"
            >
              ×
            </Button>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Personal Info
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger
              value="communication"
              className="flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Communication
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal">
            {personalInfo && (
              <PersonalInfo
                personalInfo={personalInfo}
                onUpdate={handlePersonalInfoUpdate}
                isLoading={isLoading}
              />
            )}
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            {preferences && (
              <Preferences
                preferences={preferences}
                onUpdate={handlePreferencesUpdate}
                isLoading={isLoading}
              />
            )}
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <TransactionHistory
              transactions={transactions}
              customerId={customerId}
              onTransactionView={handleTransactionView}
              isLoading={isLoading}
            />
          </TabsContent>

          {/* Communication Tab */}
          <TabsContent value="communication">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Communication History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-base-content/30" />
                  <h3 className="text-lg font-semibold mb-2">
                    Communication Coming Soon
                  </h3>
                  <p className="text-base-content/70">
                    Communication history and messaging features will be
                    available soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerProfileModular;

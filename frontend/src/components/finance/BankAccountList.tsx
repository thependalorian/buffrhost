/**
 * Bank Account List Component
 * Displays a list of bank accounts with management actions
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Building2, 
  CreditCard, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Plus
} from 'lucide-react';

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: 'checking' | 'savings' | 'business';
  currency: string;
  balance: number;
  status: 'active' | 'inactive' | 'pending';
  isPrimary: boolean;
  lastUpdated: string;
}

interface BankAccountListProps {
  accounts?: BankAccount[];
  onEdit?: (account: BankAccount) => void;
  onDelete?: (accountId: string) => void;
  onView?: (account: BankAccount) => void;
  onAdd?: () => void;
  className?: string;
}

const mockAccounts: BankAccount[] = [
  {
    id: '1',
    bankName: 'Bank Windhoek',
    accountNumber: '8050377860',
    accountType: 'business',
    currency: 'NAD',
    balance: 125000.50,
    status: 'active',
    isPrimary: true,
    lastUpdated: '2025-01-10T10:30:00Z'
  },
  {
    id: '2',
    bankName: 'First National Bank',
    accountNumber: '6234567890',
    accountType: 'checking',
    currency: 'NAD',
    balance: 45000.25,
    status: 'active',
    isPrimary: false,
    lastUpdated: '2025-01-09T14:20:00Z'
  },
  {
    id: '3',
    bankName: 'Standard Bank',
    accountNumber: '9876543210',
    accountType: 'savings',
    currency: 'USD',
    balance: 15000.00,
    status: 'inactive',
    isPrimary: false,
    lastUpdated: '2025-01-05T09:15:00Z'
  }
];

export const BankAccountList: React.FC<BankAccountListProps> = ({
  accounts = mockAccounts,
  onEdit,
  onDelete,
  onView,
  onAdd,
  className = ''
}) => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-NA', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'business':
        return Building2;
      case 'checking':
      case 'savings':
        return CreditCard;
      default:
        return CreditCard;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bank Accounts</h2>
          <p className="text-gray-600">Manage your business bank accounts</p>
        </div>
        {onAdd && (
          <Button onClick={onAdd} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Account
          </Button>
        )}
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => {
          const IconComponent = getAccountTypeIcon(account.accountType);
          
          return (
            <Card key={account.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{account.bankName}</CardTitle>
                      <p className="text-sm text-gray-500 font-mono">
                        ****{account.accountNumber.slice(-4)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {account.isPrimary && (
                      <Badge variant="default" className="bg-blue-100 text-blue-800">
                        Primary
                      </Badge>
                    )}
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedAccount(
                          selectedAccount === account.id ? null : account.id
                        )}
                        className="h-8 w-8"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                      
                      {selectedAccount === account.id && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                          {onView && (
                            <button
                              onClick={() => {
                                onView(account);
                                setSelectedAccount(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => {
                                onEdit(account);
                                setSelectedAccount(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => {
                                onDelete(account.id);
                                setSelectedAccount(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Balance */}
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(account.balance, account.currency)}
                    </p>
                    <p className="text-sm text-gray-500">Current Balance</p>
                  </div>
                  
                  {/* Account Details */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Type:</span>
                      <span className="font-medium capitalize">{account.accountType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Status:</span>
                      <Badge className={getStatusColor(account.status)}>
                        {account.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Last Updated:</span>
                      <span className="font-medium">{formatDate(account.lastUpdated)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {accounts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bank Accounts</h3>
            <p className="text-gray-500 mb-4">
              Get started by adding your first bank account
            </p>
            {onAdd && (
              <Button onClick={onAdd} className="flex items-center gap-2 mx-auto">
                <Plus className="w-4 h-4" />
                Add Bank Account
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BankAccountList;
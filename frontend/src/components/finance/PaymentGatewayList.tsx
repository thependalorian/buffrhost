import React from 'react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { 
  CreditCard, 
  Shield, 
  Globe, 
  Zap, 
  Edit, 
  Trash2, 
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface PaymentGateway {
  id: string;
  name: string;
  type: 'adumo' | 'realpay' | 'buffr' | 'stripe' | 'paypal';
  status: 'active' | 'inactive' | 'pending' | 'error';
  country: string;
  currency: string;
  transactionFee: string;
  monthlyFee: string;
  setupFee: string;
  lastUsed?: string;
  transactionsCount: number;
  totalProcessed: number;
}

interface PaymentGatewayListProps {
  gateways?: PaymentGateway[];
  onEdit?: (gateway: PaymentGateway) => void;
  onDelete?: (gateway: PaymentGateway) => void;
  onView?: (gateway: PaymentGateway) => void;
  onAdd?: () => void;
  className?: string;
}

const mockGateways: PaymentGateway[] = [
  {
    id: '1',
    name: 'Adumo Virtual',
    type: 'adumo',
    status: 'active',
    country: 'South Africa',
    currency: 'ZAR',
    transactionFee: '2.9% + R0.50',
    monthlyFee: 'R0',
    setupFee: 'R0',
    lastUsed: '2024-01-15',
    transactionsCount: 1250,
    totalProcessed: 125000
  },
  {
    id: '2',
    name: 'RealPay EnDO',
    type: 'realpay',
    status: 'active',
    country: 'Namibia',
    currency: 'NAD',
    transactionFee: 'N$8.35 - N$9.88',
    monthlyFee: 'N$770',
    setupFee: 'N$3,064.50',
    lastUsed: '2024-01-14',
    transactionsCount: 890,
    totalProcessed: 89000
  },
  {
    id: '3',
    name: 'Buffr Pay',
    type: 'buffr',
    status: 'active',
    country: 'Multi-region',
    currency: 'Multi',
    transactionFee: '2.5% + R0.30',
    monthlyFee: 'R0',
    setupFee: 'R0',
    lastUsed: '2024-01-15',
    transactionsCount: 2100,
    totalProcessed: 210000
  },
  {
    id: '4',
    name: 'Stripe',
    type: 'stripe',
    status: 'inactive',
    country: 'Global',
    currency: 'Multi',
    transactionFee: '2.9% + $0.30',
    monthlyFee: '$0',
    setupFee: '$0',
    lastUsed: '2024-01-10',
    transactionsCount: 0,
    totalProcessed: 0
  }
];

export const PaymentGatewayList: React.FC<PaymentGatewayListProps> = ({
  gateways = mockGateways,
  onEdit,
  onDelete,
  onView,
  onAdd,
  className = ''
}) => {
  const getGatewayIcon = (type: string) => {
    switch (type) {
      case 'adumo':
        return <Shield className="w-6 h-6" />;
      case 'realpay':
        return <Globe className="w-6 h-6" />;
      case 'buffr':
        return <Zap className="w-6 h-6" />;
      case 'stripe':
        return <CreditCard className="w-6 h-6" />;
      case 'paypal':
        return <CreditCard className="w-6 h-6" />;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="w-4 h-4 text-gray-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCountryFlag = (country: string) => {
    switch (country) {
      case 'South Africa':
        return '🇿🇦';
      case 'Namibia':
        return '🇳🇦';
      case 'Multi-region':
        return '🌍';
      case 'Global':
        return '🌐';
      default:
        return '🏦';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Gateways</h2>
          <p className="text-gray-600">Manage your payment processing integrations</p>
        </div>
        {onAdd && (
          <Button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700">
            Add Gateway
          </Button>
        )}
      </div>

      {/* Gateways Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gateways.map((gateway) => (
          <Card key={gateway.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {getGatewayIcon(gateway.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{gateway.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600">
                        {getCountryFlag(gateway.country)} {gateway.country}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(gateway.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(gateway.status)}
                    <span className="text-xs font-medium capitalize">
                      {gateway.status}
                    </span>
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Fees */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Transaction Fee:</span>
                    <span className="font-medium">{gateway.transactionFee}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Monthly Fee:</span>
                    <span className="font-medium">{gateway.monthlyFee}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Setup Fee:</span>
                    <span className="font-medium">{gateway.setupFee}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Transactions:</span>
                      <div className="font-semibold">{gateway.transactionsCount.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Processed:</span>
                      <div className="font-semibold">
                        {gateway.currency} {gateway.totalProcessed.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {gateway.lastUsed && (
                    <div className="text-xs text-gray-500 mt-2">
                      Last used: {new Date(gateway.lastUsed).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  {onView && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(gateway)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(gateway)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(gateway)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {gateways.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No payment gateways configured
          </h3>
          <p className="text-gray-600 mb-6">
            Add your first payment gateway to start processing payments
          </p>
          {onAdd && (
            <Button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700">
              Add Gateway
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentGatewayList;

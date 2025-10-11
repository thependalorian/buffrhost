import React, { useState } from 'react';
import { Check, X, DollarSign, Clock, Shield, Globe, Zap } from 'lucide-react';

interface PaymentGateway {
  id: string;
  name: string;
  country: string;
  description: string;
  icon: React.ComponentType<any>;
  features: {
    setupCost: string;
    transactionFees: string;
    settlement: string;
    security: string;
    customization: string;
    bestFor: string;
  };
  pricing: {
    monthly: string;
    perTransaction: string;
    activation: string;
    additional: string;
  };
  pros: string[];
  cons: string[];
  isRecommended?: boolean;
}

const paymentGateways: PaymentGateway[] = [
  {
    id: 'adumo-virtual',
    name: 'Adumo Virtual',
    country: 'South Africa',
    description: 'Hosted payment pages with high security and easy integration',
    icon: Shield,
    features: {
      setupCost: 'Free',
      transactionFees: '2.9% + R0.50',
      settlement: '2-3 business days',
      security: 'PCI DSS + 3D Secure',
      customization: 'High (logo, colors, branding)',
      bestFor: 'Quick integration, high security'
    },
    pricing: {
      monthly: 'R0',
      perTransaction: '2.9% + R0.50',
      activation: 'R0',
      additional: 'SMS: R0.50'
    },
    pros: [
      'No setup costs',
      'High security standards',
      'Easy integration',
      'Full customization',
      '3D Secure support'
    ],
    cons: [
      'Slower settlement',
      'Higher transaction fees',
      'Limited to South Africa'
    ],
    isRecommended: true
  },
  {
    id: 'realpay-endo',
    name: 'RealPay EnDO',
    country: 'Namibia',
    description: 'EnDO + Payouts integration with sliding scale fees',
    icon: Globe,
    features: {
      setupCost: 'N$3,064.50',
      transactionFees: 'N$8.35 - N$9.88',
      settlement: 'Same day/Next day',
      security: 'PCI DSS compliant',
      customization: 'Medium',
      bestFor: 'High-volume transactions, cost-effective scaling'
    },
    pricing: {
      monthly: 'N$770 (EnDO) + N$150 (Payouts)',
      perTransaction: 'N$8.35 - N$9.88',
      activation: 'N$3,064.50',
      additional: 'User fee: N$87.50, SMS: N$1.05'
    },
    pros: [
      'Fast settlement',
      'Sliding scale fees',
      'Cost-effective for high volume',
      'Same day processing',
      'Local expertise'
    ],
    cons: [
      'High activation cost',
      'Monthly fees required',
      'Limited to Namibia',
      'Complex pricing structure'
    ]
  },
  {
    id: 'buffr-pay',
    name: 'Buffr Pay',
    country: 'Multi-region',
    description: 'Internal payment solution with instant settlement',
    icon: Zap,
    features: {
      setupCost: 'Free',
      transactionFees: '2.5% + R0.30',
      settlement: 'Instant',
      security: 'End-to-end encryption',
      customization: 'Full control',
      bestFor: 'Internal transactions, loyalty programs'
    },
    pricing: {
      monthly: 'R0',
      perTransaction: '2.5% + R0.30',
      activation: 'R0',
      additional: 'Fraud detection included'
    },
    pros: [
      'Instant settlement',
      'Lowest fees',
      'Full control',
      'No monthly costs',
      'Built-in fraud detection'
    ],
    cons: [
      'Limited to Buffr ecosystem',
      'Requires development',
      'No external merchant support'
    ]
  }
];

interface PaymentGatewayComparisonProps {
  selectedGateway?: string;
  onGatewaySelect: (gatewayId: string) => void;
  className?: string;
}

export const PaymentGatewayComparison: React.FC<PaymentGatewayComparisonProps> = ({
  selectedGateway,
  onGatewaySelect,
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const getCountryFlag = (country: string) => {
    switch (country) {
      case 'South Africa':
        return '🇿🇦';
      case 'Namibia':
        return '🇳🇦';
      case 'Multi-region':
        return '🌍';
      default:
        return '🏦';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Gateway Comparison
        </h3>
        <p className="text-gray-600 text-lg">
          Choose the best payment solution for your business needs
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-center">
        <div className="bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Grid View
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'table'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Table View
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {paymentGateways.map((gateway) => {
            const IconComponent = gateway.icon;
            const isSelected = selectedGateway === gateway.id;
            
            return (
              <div
                key={gateway.id}
                className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-xl ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-xl'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => onGatewaySelect(gateway.id)}
              >
                {/* Recommended Badge */}
                {gateway.isRecommended && (
                  <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Recommended
                  </div>
                )}

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${
                    isSelected ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <IconComponent className={`w-8 h-8 ${
                      isSelected ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-bold text-gray-900">
                      {gateway.name}
                    </h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">{getCountryFlag(gateway.country)}</span>
                      <span>{gateway.country}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                  {gateway.description}
                </p>

                {/* Key Features */}
                <div className="space-y-3 mb-6">
                  <h5 className="font-semibold text-gray-900">Key Features:</h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Setup Cost:</span>
                      <span className="text-sm font-medium">{gateway.features.setupCost}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Transaction Fees:</span>
                      <span className="text-sm font-medium">{gateway.features.transactionFees}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Settlement:</span>
                      <span className="text-sm font-medium">{gateway.features.settlement}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Security:</span>
                      <span className="text-sm font-medium">{gateway.features.security}</span>
                    </div>
                  </div>
                </div>

                {/* Pros and Cons */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h6 className="text-sm font-medium text-green-700 mb-2">Pros:</h6>
                    <ul className="space-y-1">
                      {gateway.pros.slice(0, 3).map((pro, index) => (
                        <li key={index} className="text-xs text-green-600 flex items-center">
                          <Check className="w-3 h-3 mr-1" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-sm font-medium text-red-700 mb-2">Cons:</h6>
                    <ul className="space-y-1">
                      {gateway.cons.slice(0, 3).map((con, index) => (
                        <li key={index} className="text-xs text-red-600 flex items-center">
                          <X className="w-3 h-3 mr-1" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Selection Button */}
                <button
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    isSelected
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Select Gateway'}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Gateway
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Country
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Setup Cost
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Transaction Fees
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Settlement
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Security
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Best For
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paymentGateways.map((gateway) => {
                  const IconComponent = gateway.icon;
                  const isSelected = selectedGateway === gateway.id;
                  
                  return (
                    <tr
                      key={gateway.id}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        isSelected ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => onGatewaySelect(gateway.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="p-2 rounded-lg bg-gray-100">
                            <IconComponent className="w-6 h-6 text-gray-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {gateway.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {gateway.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="mr-2">{getCountryFlag(gateway.country)}</span>
                          <span className="text-sm text-gray-900">{gateway.country}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{gateway.features.setupCost}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{gateway.features.transactionFees}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{gateway.features.settlement}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{gateway.features.security}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{gateway.features.bestFor}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isSelected
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="mt-8 p-6 bg-gray-50 rounded-xl">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Payment Gateway Summary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">Adumo Virtual</div>
            <p className="text-sm text-gray-600">
              Best for South African businesses needing quick integration with high security
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">RealPay EnDO</div>
            <p className="text-sm text-gray-600">
              Best for Namibian businesses with high transaction volumes
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">Buffr Pay</div>
            <p className="text-sm text-gray-600">
              Best for internal transactions and loyalty programs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGatewayComparison;

import React, { useState } from 'react';
import { Check, Building2, Globe, Users, CreditCard } from 'lucide-react';

interface NamibianBank {
  id: string;
  name: string;
  type: 'commercial' | 'foreign' | 'microfinance';
  description: string;
  icon: React.ComponentType<any>;
  features: string[];
  isRecommended?: boolean;
}

const namibianBanks: NamibianBank[] = [
  {
    id: 'bank-windhoek',
    name: 'Bank Windhoek Limited',
    type: 'commercial',
    description: 'Primary commercial bank in Namibia with extensive local network',
    icon: Building2,
    features: ['Primary Partnership', 'Largest Local Bank', 'Full Banking Services', 'Local Expertise'],
    isRecommended: true
  },
  {
    id: 'fnb-namibia',
    name: 'First National Bank Namibia Limited',
    type: 'commercial',
    description: 'FNB subsidiary with established banking network across Southern Africa',
    icon: Globe,
    features: ['Established Network', 'Regional Presence', 'Digital Banking', 'Corporate Services']
  },
  {
    id: 'standard-bank-namibia',
    name: 'Standard Bank Namibia Limited',
    type: 'commercial',
    description: 'Standard Bank subsidiary with strong corporate and retail banking',
    icon: Building2,
    features: ['Corporate Banking', 'Retail Services', 'International Network', 'Investment Banking']
  },
  {
    id: 'nedbank-namibia',
    name: 'Nedbank Namibia Limited',
    type: 'commercial',
    description: 'Nedbank subsidiary with focus on sustainable banking solutions',
    icon: Building2,
    features: ['Sustainable Banking', 'Green Finance', 'Retail Banking', 'Business Banking']
  },
  {
    id: 'bank-bic-namibia',
    name: 'Bank BIC Namibia Limited',
    type: 'commercial',
    description: 'Local commercial bank with specialized services',
    icon: Building2,
    features: ['Local Focus', 'Specialized Services', 'Personal Banking', 'SME Support']
  },
  {
    id: 'letshego-bank-namibia',
    name: 'Letshego Bank Namibia Limited',
    type: 'microfinance',
    description: 'Microfinance-focused bank for small businesses and individuals',
    icon: Users,
    features: ['Microfinance', 'Small Business Focus', 'Accessible Banking', 'Community Development']
  },
  {
    id: 'banco-atlantico',
    name: 'Banco Atlántico',
    type: 'foreign',
    description: 'Spanish bank branch providing international banking services',
    icon: Globe,
    features: ['International Banking', 'European Connections', 'Foreign Exchange', 'Trade Finance']
  }
];

interface NamibianBankSelectorProps {
  selectedBank?: string;
  onBankSelect: (bankId: string) => void;
  className?: string;
}

export const NamibianBankSelector: React.FC<NamibianBankSelectorProps> = ({
  selectedBank,
  onBankSelect,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBanks = namibianBanks.filter(bank =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getBankTypeColor = (type: string) => {
    switch (type) {
      case 'commercial':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'microfinance':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'foreign':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBankTypeLabel = (type: string) => {
    switch (type) {
      case 'commercial':
        return 'Commercial Bank';
      case 'microfinance':
        return 'Microfinance Bank';
      case 'foreign':
        return 'Foreign Branch';
      default:
        return 'Bank';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Namibian Banking Partners
        </h3>
        <p className="text-gray-600">
          Choose from authorized banking institutions in Namibia
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search banks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Building2 className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
      </div>

      {/* Bank Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBanks.map((bank) => {
          const IconComponent = bank.icon;
          const isSelected = selectedBank === bank.id;
          
          return (
            <div
              key={bank.id}
              onClick={() => onBankSelect(bank.id)}
              className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {/* Recommended Badge */}
              {bank.isRecommended && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
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

              {/* Bank Icon */}
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg ${
                  isSelected ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <IconComponent className={`w-8 h-8 ${
                    isSelected ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {bank.name}
                  </h4>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${
                    getBankTypeColor(bank.type)
                  }`}>
                    {getBankTypeLabel(bank.type)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4">
                {bank.description}
              </p>

              {/* Features */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-700">Key Features:</h5>
                <div className="flex flex-wrap gap-1">
                  {bank.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Selection Button */}
              <div className="mt-4">
                <button
                  className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Select Bank'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredBanks.length === 0 && (
        <div className="text-center py-8">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No banks found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search terms
          </p>
        </div>
      )}

      {/* Banking Information */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Banking System Overview
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Commercial Banks</h5>
            <p className="text-gray-600">
              Primary mobilizers of funds and main source of financing for business operations
            </p>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Microfinance</h5>
            <p className="text-gray-600">
              Specialized services for small businesses and community development
            </p>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-2">International</h5>
            <p className="text-gray-600">
              Foreign branches providing international banking and trade finance services
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NamibianBankSelector;

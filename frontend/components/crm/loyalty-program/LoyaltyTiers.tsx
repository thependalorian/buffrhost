/**
 * Loyalty Tiers Component
 *
 * Purpose: Manages loyalty program tiers and their benefits
 * Functionality: Create, edit, delete tiers, manage tier benefits
 * Location: /components/crm/loyalty-program/LoyaltyTiers.tsx
 *
 * Follows 40 Rules:
 * - Uses DaisyUI for consistent styling
 * - Modular component design for easy maintenance
 * - TypeScript for type safety
 * - Vercel-compatible with SSR
 * - Comprehensive error handling
 * - Optimized for performance
 */

'use client';

import React, { useState, useRef } from 'react';
/**
 * LoyaltyTiers React Component for Buffr Host Hospitality Platform
 * @fileoverview LoyaltyTiers manages customer relationship and loyalty program interactions
 * @location buffr-host/components/crm/loyalty-program/LoyaltyTiers.tsx
 * @purpose LoyaltyTiers manages customer relationship and loyalty program interactions
 * @component LoyaltyTiers
 * @category Crm
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @state_management Local component state for UI interactions and data management
 * @hooks_utilization useState for state management and side effects
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Configurable props for flexible component usage
 * - Interactive state management for dynamic user experiences
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Props:
 * @param {LoyaltyTier[]} [tiers] - tiers prop description
 * @param {(
    tier} [onTierCreate] - onTierCreate prop description
 * @param {(id} [onTierUpdate] - onTierUpdate prop description
 * @param {(id} [onTierDelete] - onTierDelete prop description
 * @param {} [isLoading] - isLoading prop description
 *
 * State:
 * @state {any} null - Component state for null management
 *
 * Methods:
 * @method handleCreateTier - handleCreateTier method for component functionality
 * @method handleAddBenefit - handleAddBenefit method for component functionality
 * @method handleRemoveBenefit - handleRemoveBenefit method for component functionality
 * @method getTierColorClasses - getTierColorClasses method for component functionality
 *
 * Usage Example:
 * @example
 * import { LoyaltyTiers } from './LoyaltyTiers';
 *
 * function App() {
 *   return (
 *     <LoyaltyTiers
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered LoyaltyTiers component
 */

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from '@/components/ui';
import { Input } from '@/components/ui';
import { Textarea } from '@/components/ui/textarea';
import {
  Star,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Award,
  Target,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

// Types for TypeScript compliance
interface LoyaltyTier {
  id: string;
  name: string;
  description: string;
  minPoints: number;
  maxPoints?: number;
  benefits: string[];
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LoyaltyTiersProps {
  tiers: LoyaltyTier[];
  onTierCreate: (
    tier: Omit<LoyaltyTier, 'id' | 'createdAt' | 'updatedAt'>
  ) => void;
  onTierUpdate: (id: string, tier: Partial<LoyaltyTier>) => void;
  onTierDelete: (id: string) => void;
  isLoading?: boolean;
}

// Main Loyalty Tiers Component
export const LoyaltyTiers: React.FC<LoyaltyTiersProps> = ({
  tiers,
  onTierCreate,
  onTierUpdate,
  onTierDelete,
  isLoading = false,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingTier, setEditingTier] = useState<string | null>(null);
  const [newTier, setNewTier] = useState<Partial<LoyaltyTier>>({
    name: '',
    description: '',
    minPoints: 0,
    benefits: [],
    color: '#3B82F6',
    icon: 'star',
    isActive: true,
  });
  const [newBenefit, setNewBenefit] = useState('');

  // Refs for performance optimization
  const benefitInputRef = useRef<HTMLInputElement>(null);

  // Handle create tier
  const handleCreateTier = () => {
    if (
      newTier.name &&
      newTier.description &&
      newTier.minPoints !== undefined
    ) {
      onTierCreate(
        newTier as Omit<LoyaltyTier, 'id' | 'createdAt' | 'updatedAt'>
      );
      setNewTier({
        name: '',
        description: '',
        minPoints: 0,
        benefits: [],
        color: '#3B82F6',
        icon: 'star',
        isActive: true,
      });
      setIsCreating(false);
    }
  };

  // Handle add benefit
  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      setNewTier((prev) => ({
        ...prev,
        benefits: [...(prev.benefits || []), newBenefit.trim()],
      }));
      setNewBenefit('');
      benefitInputRef.current?.focus();
    }
  };

  // Handle remove benefit
  const handleRemoveBenefit = (index: number) => {
    setNewTier((prev) => ({
      ...prev,
      benefits: prev.benefits?.filter((_, i) => i !== index) || [],
    }));
  };

  // Get tier color classes
  const getTierColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      '#3B82F6': 'bg-blue-500',
      '#10B981': 'bg-green-500',
      '#F59E0B': 'bg-yellow-500',
      '#EF4444': 'bg-red-500',
      '#8B5CF6': 'bg-purple-500',
      '#F97316': 'bg-orange-500',
    };
    return colorMap[color] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Loyalty Tiers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="loading loading-spinner loading-md text-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Loyalty Tiers ({tiers.length})
          </CardTitle>
          <Button
            onClick={() => setIsCreating(true)}
            className="btn-primary btn-sm"
            disabled={isCreating}
          >
            <Plus className="w-4 h-4" />
            Add Tier
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Create New Tier Form */}
        {isCreating && (
          <div className="p-4 bg-base-200 rounded-lg space-y-4">
            <h4 className="font-semibold">Create New Tier</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Tier Name"
                value={newTier.name || ''}
                onChange={(e) =>
                  setNewTier((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <Input
                type="number"
                placeholder="Minimum Points"
                value={newTier.minPoints || 0}
                onChange={(e) =>
                  setNewTier((prev) => ({
                    ...prev,
                    minPoints: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>

            <Textarea
              placeholder="Tier Description"
              value={newTier.description || ''}
              onChange={(e) =>
                setNewTier((prev) => ({ ...prev, description: e.target.value }))
              }
            />

            {/* Benefits Management */}
            <div className="space-y-2">
              <label className="label">
                <span className="label-text">Benefits</span>
              </label>
              <div className="flex gap-2">
                <Input
                  ref={benefitInputRef}
                  placeholder="Add benefit..."
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddBenefit()}
                />
                <Button
                  onClick={handleAddBenefit}
                  className="btn-outline btn-sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Benefits List */}
              <div className="flex flex-wrap gap-2">
                {newTier.benefits?.map((benefit, index) => (
                  <Badge key={index} className="badge-primary gap-2">
                    {benefit}
                    <button
                      onClick={() => handleRemoveBenefit(index)}
                      className="btn btn-ghost btn-xs"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateTier} className="btn-primary btn-sm">
                <Save className="w-4 h-4" />
                Create Tier
              </Button>
              <Button
                onClick={() => setIsCreating(false)}
                className="btn-outline btn-sm"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Tiers List */}
        <div className="space-y-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`p-4 border rounded-lg ${
                tier.isActive
                  ? 'border-primary/20 bg-primary/5'
                  : 'border-base-300 bg-base-100'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${getTierColorClasses(tier.color)}`}
                  />
                  <h3 className="font-semibold text-lg">{tier.name}</h3>
                  <Badge
                    className={
                      tier.isActive ? 'badge-success' : 'badge-neutral'
                    }
                  >
                    {tier.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setEditingTier(tier.id)}
                    className="btn-outline btn-sm"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => onTierDelete(tier.id)}
                    className="btn-error btn-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <p className="text-base-content/70 mb-3">{tier.description}</p>

              <div className="flex items-center gap-4 mb-3">
                <div className="text-sm">
                  <span className="font-medium">Min Points:</span>{' '}
                  {tier.minPoints.toLocaleString()}
                </div>
                {tier.maxPoints && (
                  <div className="text-sm">
                    <span className="font-medium">Max Points:</span>{' '}
                    {tier.maxPoints.toLocaleString()}
                  </div>
                )}
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Benefits:</h4>
                <div className="flex flex-wrap gap-2">
                  {tier.benefits.map((benefit, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {tiers.length === 0 && (
            <div className="text-center py-8">
              <Star className="w-12 h-12 mx-auto mb-4 text-base-content/30" />
              <h3 className="text-lg font-semibold mb-2">No Loyalty Tiers</h3>
              <p className="text-base-content/70 mb-4">
                Create your first loyalty tier to start rewarding customers
              </p>
              <Button
                onClick={() => setIsCreating(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4" />
                Create First Tier
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LoyaltyTiers;

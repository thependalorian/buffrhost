/**
 * Rewards Component
 *
 * Purpose: Manages loyalty program rewards and redemption options
 * Functionality: Create, edit, delete rewards, manage redemption rules
 * Location: /components/crm/loyalty-program/Rewards.tsx
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import {
  Gift,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  DollarSign,
  Percent,
  Calendar,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
} from 'lucide-react';

// Types for TypeScript compliance
interface Reward {
  id: string;
  name: string;
  description: string;
  type: 'discount' | 'free_item' | 'points_bonus' | 'experience';
  value: number;
  valueType: 'percentage' | 'fixed' | 'points';
  pointsRequired: number;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usageCount: number;
  category: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface RewardsProps {
  rewards: Reward[];
  onRewardCreate: (
    reward: Omit<Reward, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>
  ) => void;
  onRewardUpdate: (id: string, reward: Partial<Reward>) => void;
  onRewardDelete: (id: string) => void;
  isLoading?: boolean;
}

// Main Rewards Component
export const Rewards: React.FC<RewardsProps> = ({
  rewards,
  onRewardCreate,
  onRewardUpdate,
  onRewardDelete,
  isLoading = false,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingReward, setEditingReward] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [newReward, setNewReward] = useState<Partial<Reward>>({
    name: '',
    description: '',
    type: 'discount',
    value: 0,
    valueType: 'percentage',
    pointsRequired: 0,
    isActive: true,
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    category: 'general',
  });

  // Refs for performance optimization
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter rewards
  const filteredRewards = rewards.filter((reward) => {
    const matchesSearch =
      reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reward.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || reward.type === filterType;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && reward.isActive) ||
      (filterStatus === 'inactive' && !reward.isActive);
    return matchesSearch && matchesType && matchesStatus;
  });

  // Handle create reward
  const handleCreateReward = () => {
    if (
      newReward.name &&
      newReward.description &&
      newReward.pointsRequired !== undefined
    ) {
      onRewardCreate(
        newReward as Omit<
          Reward,
          'id' | 'createdAt' | 'updatedAt' | 'usageCount'
        >
      );
      setNewReward({
        name: '',
        description: '',
        type: 'discount',
        value: 0,
        valueType: 'percentage',
        pointsRequired: 0,
        isActive: true,
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        category: 'general',
      });
      setIsCreating(false);
    }
  };

  // Get reward type icon
  const getRewardTypeIcon = (type: string) => {
    switch (type) {
      case 'discount':
        return <Percent className="w-4 h-4" />;
      case 'free_item':
        return <Gift className="w-4 h-4" />;
      case 'points_bonus':
        return <DollarSign className="w-4 h-4" />;
      case 'experience':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Gift className="w-4 h-4" />;
    }
  };

  // Get reward type color
  const getRewardTypeColor = (type: string) => {
    switch (type) {
      case 'discount':
        return 'badge-primary';
      case 'free_item':
        return 'badge-success';
      case 'points_bonus':
        return 'badge-warning';
      case 'experience':
        return 'badge-info';
      default:
        return 'badge-neutral';
    }
  };

  // Format reward value
  const formatRewardValue = (reward: Reward) => {
    if (reward.valueType === 'percentage') {
      return `${reward.value}%`;
    } else if (reward.valueType === 'fixed') {
      return `N$ ${reward.value}`;
    } else {
      return `${reward.value} points`;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Rewards
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
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Rewards ({filteredRewards.length})
          </CardTitle>
          <Button
            onClick={() => setIsCreating(true)}
            className="btn-primary btn-sm"
            disabled={isCreating}
          >
            <Plus className="w-4 h-4" />
            Add Reward
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-4 h-4" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search rewards..."
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="discount">Discount</SelectItem>
                <SelectItem value="free_item">Free Item</SelectItem>
                <SelectItem value="points_bonus">Points Bonus</SelectItem>
                <SelectItem value="experience">Experience</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Create New Reward Form */}
        {isCreating && (
          <div className="p-4 bg-base-200 rounded-lg space-y-4">
            <h4 className="font-semibold">Create New Reward</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Reward Name"
                value={newReward.name || ''}
                onChange={(e) =>
                  setNewReward((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <Select
                value={newReward.type || 'discount'}
                onValueChange={(value) =>
                  setNewReward((prev) => ({ ...prev, type: value as unknown }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discount">Discount</SelectItem>
                  <SelectItem value="free_item">Free Item</SelectItem>
                  <SelectItem value="points_bonus">Points Bonus</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Textarea
              placeholder="Reward Description"
              value={newReward.description || ''}
              onChange={(e) =>
                setNewReward((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="number"
                placeholder="Value"
                value={newReward.value || 0}
                onChange={(e) =>
                  setNewReward((prev) => ({
                    ...prev,
                    value: parseFloat(e.target.value) || 0,
                  }))
                }
              />
              <Select
                value={newReward.valueType || 'percentage'}
                onValueChange={(value) =>
                  setNewReward((prev) => ({ ...prev, valueType: value as unknown }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                  <SelectItem value="points">Points</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Points Required"
                value={newReward.pointsRequired || 0}
                onChange={(e) =>
                  setNewReward((prev) => ({
                    ...prev,
                    pointsRequired: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Valid From"
                value={newReward.validFrom || ''}
                onChange={(e) =>
                  setNewReward((prev) => ({
                    ...prev,
                    validFrom: e.target.value,
                  }))
                }
              />
              <Input
                type="date"
                label="Valid Until"
                value={newReward.validUntil || ''}
                onChange={(e) =>
                  setNewReward((prev) => ({
                    ...prev,
                    validUntil: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCreateReward}
                className="btn-primary btn-sm"
              >
                <Save className="w-4 h-4" />
                Create Reward
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

        {/* Rewards List */}
        <div className="space-y-3">
          {filteredRewards.map((reward) => (
            <div
              key={reward.id}
              className={`p-4 border rounded-lg ${
                reward.isActive
                  ? 'border-primary/20 bg-primary/5'
                  : 'border-base-300 bg-base-100'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getRewardTypeIcon(reward.type)}
                  <h3 className="font-semibold text-lg">{reward.name}</h3>
                  <Badge className={getRewardTypeColor(reward.type)}>
                    {reward.type.replace('_', ' ')}
                  </Badge>
                  <Badge
                    className={
                      reward.isActive ? 'badge-success' : 'badge-neutral'
                    }
                  >
                    {reward.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setEditingReward(reward.id)}
                    className="btn-outline btn-sm"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => onRewardDelete(reward.id)}
                    className="btn-error btn-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <p className="text-base-content/70 mb-3">{reward.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Value:</span>{' '}
                  {formatRewardValue(reward)}
                </div>
                <div>
                  <span className="font-medium">Points Required:</span>{' '}
                  {reward.pointsRequired.toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Usage:</span>{' '}
                  {reward.usageCount} / {reward.usageLimit || '∞'}
                </div>
                <div>
                  <span className="font-medium">Valid Until:</span>{' '}
                  {new Date(reward.validUntil).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}

          {filteredRewards.length === 0 && (
            <div className="text-center py-8">
              <Gift className="w-12 h-12 mx-auto mb-4 text-base-content/30" />
              <h3 className="text-lg font-semibold mb-2">No Rewards Found</h3>
              <p className="text-base-content/70 mb-4">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first reward to start your loyalty program'}
              </p>
              {!searchTerm &&
                filterType === 'all' &&
                filterStatus === 'all' && (
                  <Button
                    onClick={() => setIsCreating(true)}
                    className="btn-primary"
                  >
                    <Plus className="w-4 h-4" />
                    Create First Reward
                  </Button>
                )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Rewards;

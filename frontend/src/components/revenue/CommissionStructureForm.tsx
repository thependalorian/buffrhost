"use client";
import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Textarea } from '@/src/components/ui/textarea';
import { Badge } from '@/src/components/ui/badge';
import {
  Plus,
  Trash2,
  DollarSign,
  Percent,
  TrendingUp,
  Calculator,
  Save
} from 'lucide-react';

interface CommissionStructure {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'tiered';
  rate: number;
  minAmount?: number;
  maxAmount?: number;
  applicableTo: string[];
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
  description?: string;
  tiers?: {
    min: number;
    max: number;
    rate: number;
  }[];
}

interface CommissionStructureFormProps {
  structure?: CommissionStructure;
  onSave: (structure: CommissionStructure) => void;
  onCancel: () => void;
  className?: string;
}

const availableServices = [
  'Restaurant Orders',
  'Food Delivery',
  'Hotel Bookings',
  'Room Reservations',
  'Spa Services',
  'Event Bookings',
  'Transportation',
  'Service Charges',
  'Processing Fees',
  'Premium Partners',
  'VIP Services',
  'Loyalty Programs'
];

export const CommissionStructureForm: React.FC<CommissionStructureFormProps> = ({
  structure,
  onSave,
  onCancel,
  className = ''
}) => {
  const [formData, setFormData] = useState({
    name: structure?.name || '',
    type: structure?.type || 'percentage',
    rate: structure?.rate || 0,
    minAmount: structure?.minAmount || 0,
    maxAmount: structure?.maxAmount || 0,
    applicableTo: structure?.applicableTo || [],
    status: structure?.status || 'draft',
    description: structure?.description || '',
    tiers: structure?.tiers || []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTier, setNewTier] = useState({ min: 0, max: 0, rate: 0 });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Structure name is required';
    }

    if (formData.type === 'percentage' && (formData.rate < 0 || formData.rate > 100)) {
      newErrors.rate = 'Percentage rate must be between 0 and 100';
    }

    if (formData.type === 'fixed' && formData.rate < 0) {
      newErrors.rate = 'Fixed rate cannot be negative';
    }

    if (formData.type === 'tiered' && formData.tiers.length === 0) {
      newErrors.tiers = 'At least one tier is required for tiered structures';
    }

    if (formData.applicableTo.length === 0) {
      newErrors.applicableTo = 'At least one service must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const structureData: CommissionStructure = {
      id: structure?.id || Date.now().toString(),
      ...formData,
      createdAt: structure?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(structureData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleServiceToggle = (service: string, checked: boolean) => {
    const newServices = checked
      ? [...formData.applicableTo, service]
      : formData.applicableTo.filter(s => s !== service);
    
    handleInputChange('applicableTo', newServices);
  };

  const addTier = () => {
    if (newTier.min >= 0 && newTier.max > newTier.min && newTier.rate >= 0) {
      const updatedTiers = [...formData.tiers, { ...newTier }].sort((a, b) => a.min - b.min);
      handleInputChange('tiers', updatedTiers);
      setNewTier({ min: 0, max: 0, rate: 0 });
    }
  };

  const removeTier = (index: number) => {
    const updatedTiers = formData.tiers.filter((_, i) => i !== index);
    handleInputChange('tiers', updatedTiers);
  };

  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-6 h-6" />
          {structure ? 'Edit Commission Structure' : 'Create Commission Structure'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Structure Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter structure name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter structure description"
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Commission Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Commission Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="tiered">Tiered Structure</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type !== 'tiered' && (
                <div className="space-y-2">
                  <Label htmlFor="rate">
                    {formData.type === 'percentage' ? 'Rate (%)' : 'Amount ($)'}
                  </Label>
                  <Input
                    id="rate"
                    type="number"
                    step={formData.type === 'percentage' ? '0.01' : '0.01'}
                    min="0"
                    max={formData.type === 'percentage' ? '100' : undefined}
                    value={formData.rate}
                    onChange={(e) => handleInputChange('rate', parseFloat(e.target.value) || 0)}
                    placeholder={formData.type === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                    className={errors.rate ? 'border-red-500' : ''}
                  />
                  {errors.rate && (
                    <p className="text-sm text-red-500">{errors.rate}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Applicable Services</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableServices.map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox
                    id={service}
                    checked={formData.applicableTo.includes(service)}
                    onCheckedChange={(checked) => handleServiceToggle(service, checked as boolean)}
                  />
                  <Label htmlFor={service} className="text-sm cursor-pointer">
                    {service}
                  </Label>
                </div>
              ))}
            </div>
            {errors.applicableTo && (
              <p className="text-sm text-red-500">{errors.applicableTo}</p>
            )}
          </div>

          {formData.applicableTo.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-md font-medium text-gray-900">Selected Services</h4>
              <div className="flex flex-wrap gap-2">
                {formData.applicableTo.map((service) => (
                  <Badge key={service} variant="outline">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6"
            >
              <Save className="w-4 h-4 mr-2" />
              {structure ? 'Update Structure' : 'Create Structure'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CommissionStructureForm;

/**
 * Segment Builder Component
 *
 * Purpose: Interactive segment creation and editing with criteria builder
 * Functionality: Add criteria, preview segment, save/update segments
 * Location: /components/crm/customer-segmentation/SegmentBuilder.tsx
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
  Plus,
  Trash2,
  Save,
  X,
  Eye,
  AlertCircle,
  CheckCircle,
  Users,
  Filter,
  Target,
} from 'lucide-react';

// Types for TypeScript compliance
interface SegmentCriteria {
  id: string;
  field: string;
  operator: string;
  value: unknown;
  logicalOperator?: 'AND' | 'OR';
}

interface CustomerSegment {
  id?: string;
  name: string;
  description: string;
  criteria: SegmentCriteria[];
  isActive: boolean;
  tags: string[];
  color: string;
}

interface SegmentBuilderProps {
  segment?: CustomerSegment;
  onSave: (segment: CustomerSegment) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// Available fields for segmentation
const SEGMENT_FIELDS = [
  { value: 'total_spent', label: 'Total Spent', type: 'number' },
  { value: 'visit_count', label: 'Visit Count', type: 'number' },
  { value: 'last_visit', label: 'Last Visit', type: 'date' },
  { value: 'loyalty_tier', label: 'Loyalty Tier', type: 'select' },
  { value: 'age', label: 'Age', type: 'number' },
  { value: 'location', label: 'Location', type: 'text' },
  { value: 'preferences', label: 'Preferences', type: 'array' },
  {
    value: 'communication_channel',
    label: 'Communication Channel',
    type: 'select',
  },
  { value: 'created_at', label: 'Registration Date', type: 'date' },
];

// Available operators
const OPERATORS = {
  number: [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'between', label: 'Between' },
  ],
  text: [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'not_contains', label: 'Does Not Contain' },
    { value: 'starts_with', label: 'Starts With' },
    { value: 'ends_with', label: 'Ends With' },
  ],
  date: [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'after', label: 'After' },
    { value: 'before', label: 'Before' },
    { value: 'between', label: 'Between' },
  ],
  select: [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'in', label: 'In' },
    { value: 'not_in', label: 'Not In' },
  ],
  array: [
    { value: 'contains', label: 'Contains' },
    { value: 'not_contains', label: 'Does Not Contain' },
    { value: 'contains_all', label: 'Contains All' },
    { value: 'contains_any', label: 'Contains Any' },
  ],
};

// Main Segment Builder Component
export const SegmentBuilder: React.FC<SegmentBuilderProps> = ({
  segment,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CustomerSegment>({
    id: segment?.id,
    name: segment?.name || '',
    description: segment?.description || '',
    criteria: segment?.criteria || [],
    isActive: segment?.isActive ?? true,
    tags: segment?.tags || [],
    color: segment?.color || 'blue',
  });

  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState<string | null>(null);

  // Refs for performance optimization
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Add new criteria
  const addCriteria = () => {
    const newCriteria: SegmentCriteria = {
      id: Math.random().toString(36).substr(2, 9),
      field: '',
      operator: '',
      value: '',
      logicalOperator: formData.criteria.length > 0 ? 'AND' : undefined,
    };

    setFormData((prev) => ({
      ...prev,
      criteria: [...prev.criteria, newCriteria],
    }));
  };

  // Remove criteria
  const removeCriteria = (criteriaId: string) => {
    setFormData((prev) => ({
      ...prev,
      criteria: prev.criteria.filter((c) => c.id !== criteriaId),
    }));
  };

  // Update criteria
  const updateCriteria = (
    criteriaId: string,
    field: keyof SegmentCriteria,
    value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      criteria: prev.criteria.map((c) =>
        c.id === criteriaId ? { ...c, [field]: value } : c
      ),
    }));
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
      tagInputRef.current?.focus();
    }
  };

  // Remove tag
  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  // Get field type
  const getFieldType = (fieldValue: string) => {
    const field = SEGMENT_FIELDS.find((f) => f.value === fieldValue);
    return field?.type || 'text';
  };

  // Get operators for field type
  const getOperators = (fieldType: string) => {
    return OPERATORS[fieldType as keyof typeof OPERATORS] || OPERATORS.text;
  };

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Segment name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Segment description is required';
    }

    if (formData.criteria.length === 0) {
      newErrors.criteria = 'At least one criteria is required';
    }

    // Validate criteria
    formData.criteria.forEach((criteria, index) => {
      if (!criteria.field) {
        newErrors[`criteria_${index}_field`] = 'Field is required';
      }
      if (!criteria.operator) {
        newErrors[`criteria_${index}_operator`] = 'Operator is required';
      }
      if (
        criteria.value === '' ||
        criteria.value === null ||
        criteria.value === undefined
      ) {
        newErrors[`criteria_${index}_value`] = 'Value is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await onSave(formData);
      setSuccess('Segment saved successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error saving segment:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Segment Builder
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
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          {segment ? 'Edit Segment' : 'Create New Segment'}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Success Message */}
        {success && (
          <div className="alert alert-success">
            <CheckCircle className="w-4 h-4" />
            <span>{success}</span>
          </div>
        )}

        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Basic Information</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Segment Name *</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className={errors.name ? 'input-error' : ''}
                placeholder="Enter segment name..."
              />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.name}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Color</span>
              </label>
              <Select
                value={formData.color}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, color: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="pink">Pink</SelectItem>
                  <SelectItem value="indigo">Indigo</SelectItem>
                  <SelectItem value="teal">Teal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Description *</span>
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className={errors.description ? 'textarea-error' : ''}
              placeholder="Describe this segment..."
              rows={3}
            />
            {errors.description && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.description}
                </span>
              </label>
            )}
          </div>
        </div>

        {/* Criteria Builder */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-lg">Segmentation Criteria</h4>
            <Button onClick={addCriteria} className="btn-outline btn-sm">
              <Plus className="w-4 h-4" />
              Add Criteria
            </Button>
          </div>

          {errors.criteria && (
            <div className="alert alert-error">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.criteria}</span>
            </div>
          )}

          <div className="space-y-4">
            {formData.criteria.map((criteria, index) => (
              <div
                key={criteria.id}
                className="p-4 border rounded-lg bg-base-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium">Criteria {index + 1}</h5>
                  {formData.criteria.length > 1 && (
                    <Button
                      onClick={() => removeCriteria(criteria.id)}
                      className="btn-error btn-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {/* Logical Operator */}
                  {index > 0 && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Logic</span>
                      </label>
                      <Select
                        value={criteria.logicalOperator || 'AND'}
                        onValueChange={(value) =>
                          updateCriteria(criteria.id, 'logicalOperator', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AND">AND</SelectItem>
                          <SelectItem value="OR">OR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Field */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Field *</span>
                    </label>
                    <Select
                      value={criteria.field}
                      onValueChange={(value) => {
                        updateCriteria(criteria.id, 'field', value);
                        updateCriteria(criteria.id, 'operator', '');
                        updateCriteria(criteria.id, 'value', '');
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {SEGMENT_FIELDS.map((field) => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors[`criteria_${index}_field`] && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors[`criteria_${index}_field`]}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Operator */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Operator *</span>
                    </label>
                    <Select
                      value={criteria.operator}
                      onValueChange={(value) =>
                        updateCriteria(criteria.id, 'operator', value)
                      }
                      disabled={!criteria.field}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {getOperators(getFieldType(criteria.field)).map(
                          (op) => (
                            <SelectItem key={op.value} value={op.value}>
                              {op.label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    {errors[`criteria_${index}_operator`] && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors[`criteria_${index}_operator`]}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Value */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Value *</span>
                    </label>
                    <Input
                      value={criteria.value}
                      onChange={(e) =>
                        updateCriteria(criteria.id, 'value', e.target.value)
                      }
                      placeholder="Enter value..."
                      disabled={!criteria.operator}
                    />
                    {errors[`criteria_${index}_value`] && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors[`criteria_${index}_value`]}
                        </span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <h4 className="font-semibold text-lg">Tags</h4>

          <div className="flex gap-2">
            <Input
              ref={tagInputRef}
              placeholder="Add tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              className="flex-1"
            />
            <Button onClick={addTag} className="btn-outline btn-sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <Badge key={index} className="badge-primary gap-2">
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="btn btn-ghost btn-xs"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Active Segment</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
              }
            />
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={handleSave} className="btn-primary">
            <Save className="w-4 h-4" />
            {segment ? 'Update Segment' : 'Create Segment'}
          </Button>
          <Button onClick={onCancel} className="btn-outline">
            <X className="w-4 h-4" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SegmentBuilder;

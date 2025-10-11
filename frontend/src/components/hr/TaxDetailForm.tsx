import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Checkbox } from '@/src/components/ui/checkbox';
import { 
  User, 
  FileText, 
  DollarSign,
  Calculator,
  Building2,
  CreditCard
} from 'lucide-react';

interface TaxDetail {
  id: string;
  employeeId: string;
  taxId: string;
  taxType: 'income' | 'social_security' | 'medicare' | 'unemployment' | 'state' | 'local' | 'other';
  taxName: string;
  taxRate: number;
  taxAmount: number;
  isExempt: boolean;
  exemptionReason?: string;
  effectiveDate: string;
  endDate?: string;
  status: 'active' | 'inactive' | 'pending';
}

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  hireDate: string;
  salary: number;
}

interface TaxDetailFormProps {
  employee?: Employee;
  taxDetail?: TaxDetail;
  onSave: (taxDetail: TaxDetail) => void;
  onCancel: () => void;
  className?: string;
}

export const TaxDetailForm: React.FC<TaxDetailFormProps> = ({
  employee,
  taxDetail,
  onSave,
  onCancel,
  className = ''
}) => {
  const [formData, setFormData] = useState({
    taxId: taxDetail?.taxId || '',
    taxType: taxDetail?.taxType || 'income',
    taxName: taxDetail?.taxName || '',
    taxRate: taxDetail?.taxRate || 0,
    taxAmount: taxDetail?.taxAmount || 0,
    isExempt: taxDetail?.isExempt || false,
    exemptionReason: taxDetail?.exemptionReason || '',
    effectiveDate: taxDetail?.effectiveDate || '',
    endDate: taxDetail?.endDate || '',
    status: taxDetail?.status || 'active'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.taxId.trim()) {
      newErrors.taxId = 'Tax ID is required';
    }

    if (!formData.taxName.trim()) {
      newErrors.taxName = 'Tax name is required';
    }

    if (formData.taxRate < 0 || formData.taxRate > 100) {
      newErrors.taxRate = 'Tax rate must be between 0 and 100';
    }

    if (formData.taxAmount < 0) {
      newErrors.taxAmount = 'Tax amount cannot be negative';
    }

    if (!formData.effectiveDate) {
      newErrors.effectiveDate = 'Effective date is required';
    }

    if (formData.isExempt && !formData.exemptionReason.trim()) {
      newErrors.exemptionReason = 'Exemption reason is required when tax is exempt';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const taxDetailData: TaxDetail = {
      id: taxDetail?.id || Date.now().toString(),
      employeeId: employee?.id || '',
      ...formData
    };

    onSave(taxDetailData);
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const getTaxTypeIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <DollarSign className="w-5 h-5 text-green-500" />;
      case 'social_security':
        return <Building2 className="w-5 h-5 text-blue-500" />;
      case 'medicare':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'unemployment':
        return <User className="w-5 h-5 text-orange-500" />;
      case 'state':
        return <Building2 className="w-5 h-5 text-purple-500" />;
      case 'local':
        return <Building2 className="w-5 h-5 text-yellow-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTaxTypeLabel = (type: string) => {
    switch (type) {
      case 'income':
        return 'Income Tax';
      case 'social_security':
        return 'Social Security';
      case 'medicare':
        return 'Medicare';
      case 'unemployment':
        return 'Unemployment Insurance';
      case 'state':
        return 'State Tax';
      case 'local':
        return 'Local Tax';
      default:
        return 'Other Tax';
    }
  };

  const calculateTaxAmount = () => {
    if (employee?.salary && formData.taxRate) {
      return (employee.salary * formData.taxRate) / 100;
    }
    return formData.taxAmount;
  };

  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-6 h-6" />
          {taxDetail ? 'Edit Tax Detail' : 'Add Tax Detail'}
        </CardTitle>
        {employee && (
          <p className="text-gray-600">
            Managing tax details for {employee.name} ({employee.employeeId})
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employee Information */}
          {employee && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Employee Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Name</Label>
                  <p className="text-gray-900">{employee.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Employee ID</Label>
                  <p className="text-gray-900">{employee.employeeId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Department</Label>
                  <p className="text-gray-900">{employee.department}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Annual Salary</Label>
                  <p className="text-gray-900">${employee.salary?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tax Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Tax Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID</Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => handleInputChange('taxId', e.target.value)}
                  placeholder="Enter tax ID"
                  className={errors.taxId ? 'border-red-500' : ''}
                />
                {errors.taxId && (
                  <p className="text-sm text-red-500">{errors.taxId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxType">Tax Type</Label>
                <Select
                  value={formData.taxType}
                  onValueChange={(value) => handleInputChange('taxType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tax type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income Tax</SelectItem>
                    <SelectItem value="social_security">Social Security</SelectItem>
                    <SelectItem value="medicare">Medicare</SelectItem>
                    <SelectItem value="unemployment">Unemployment Insurance</SelectItem>
                    <SelectItem value="state">State Tax</SelectItem>
                    <SelectItem value="local">Local Tax</SelectItem>
                    <SelectItem value="other">Other Tax</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxName">Tax Name</Label>
                <Input
                  id="taxName"
                  value={formData.taxName}
                  onChange={(e) => handleInputChange('taxName', e.target.value)}
                  placeholder="Enter tax name"
                  className={errors.taxName ? 'border-red-500' : ''}
                />
                {errors.taxName && (
                  <p className="text-sm text-red-500">{errors.taxName}</p>
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Tax Calculation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Tax Calculation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.taxRate}
                  onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                  placeholder="Enter tax rate percentage"
                  className={errors.taxRate ? 'border-red-500' : ''}
                />
                {errors.taxRate && (
                  <p className="text-sm text-red-500">{errors.taxRate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxAmount">Tax Amount ($)</Label>
                <Input
                  id="taxAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.taxAmount}
                  onChange={(e) => handleInputChange('taxAmount', parseFloat(e.target.value) || 0)}
                  placeholder="Enter tax amount"
                  className={errors.taxAmount ? 'border-red-500' : ''}
                />
                {errors.taxAmount && (
                  <p className="text-sm text-red-500">{errors.taxAmount}</p>
                )}
              </div>
            </div>

            {/* Calculated Amount Display */}
            {employee?.salary && formData.taxRate && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Calculated Amount:</span>
                  <span className="text-lg font-semibold text-blue-600">
                    ${calculateTaxAmount().toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Based on {formData.taxRate}% of ${employee.salary.toLocaleString()} annual salary
                </p>
              </div>
            )}
          </div>

          {/* Exemption Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Exemption Details</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isExempt"
                checked={formData.isExempt}
                onCheckedChange={(checked) => handleInputChange('isExempt', checked as boolean)}
              />
              <Label htmlFor="isExempt" className="text-sm font-medium">
                This tax is exempt
              </Label>
            </div>

            {formData.isExempt && (
              <div className="space-y-2">
                <Label htmlFor="exemptionReason">Exemption Reason</Label>
                <Input
                  id="exemptionReason"
                  value={formData.exemptionReason}
                  onChange={(e) => handleInputChange('exemptionReason', e.target.value)}
                  placeholder="Enter reason for exemption"
                  className={errors.exemptionReason ? 'border-red-500' : ''}
                />
                {errors.exemptionReason && (
                  <p className="text-sm text-red-500">{errors.exemptionReason}</p>
                )}
              </div>
            )}
          </div>

          {/* Effective Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Effective Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="effectiveDate">Effective Date</Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
                  className={errors.effectiveDate ? 'border-red-500' : ''}
                />
                {errors.effectiveDate && (
                  <p className="text-sm text-red-500">{errors.effectiveDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
              </div>
            </div>
          </div>

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
              {taxDetail ? 'Update Tax Detail' : 'Add Tax Detail'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaxDetailForm;

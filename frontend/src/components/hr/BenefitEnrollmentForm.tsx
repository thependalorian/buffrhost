import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Textarea } from '@/src/components/ui/textarea';
import { 
  User, 
  Heart, 
  Shield, 
  DollarSign,
  Calendar,
  FileText
} from 'lucide-react';

interface Benefit {
  id: string;
  name: string;
  type: 'health' | 'dental' | 'vision' | 'life' | 'disability' | 'retirement' | 'other';
  description: string;
  cost: number;
  coverage: string;
  isActive: boolean;
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
}

interface BenefitEnrollmentFormProps {
  employee?: Employee;
  benefits?: Benefit[];
  onSave: (enrollment: any) => void;
  onCancel: () => void;
  className?: string;
}

const mockBenefits: Benefit[] = [
  {
    id: '1',
    name: 'Medical Insurance',
    type: 'health',
    description: 'Comprehensive medical coverage including hospitalization and outpatient care',
    cost: 500,
    coverage: 'Family',
    isActive: true
  },
  {
    id: '2',
    name: 'Dental Insurance',
    type: 'dental',
    description: 'Dental care coverage including preventive and major procedures',
    cost: 150,
    coverage: 'Individual',
    isActive: true
  },
  {
    id: '3',
    name: 'Vision Insurance',
    type: 'vision',
    description: 'Eye care coverage including exams, glasses, and contacts',
    cost: 100,
    coverage: 'Individual',
    isActive: true
  },
  {
    id: '4',
    name: 'Life Insurance',
    type: 'life',
    description: 'Term life insurance coverage',
    cost: 200,
    coverage: 'Family',
    isActive: true
  },
  {
    id: '5',
    name: 'Retirement Plan',
    type: 'retirement',
    description: '401(k) retirement savings plan with company matching',
    cost: 0,
    coverage: 'Individual',
    isActive: true
  }
];

export const BenefitEnrollmentForm: React.FC<BenefitEnrollmentFormProps> = ({
  employee,
  benefits = mockBenefits,
  onSave,
  onCancel,
  className = ''
}) => {
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [enrollmentData, setEnrollmentData] = useState({
    effectiveDate: '',
    notes: '',
    emergencyContact: '',
    emergencyPhone: '',
    beneficiary: '',
    beneficiaryRelationship: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (selectedBenefits.length === 0) {
      newErrors.benefits = 'Please select at least one benefit';
    }

    if (!enrollmentData.effectiveDate) {
      newErrors.effectiveDate = 'Effective date is required';
    }

    if (!enrollmentData.emergencyContact) {
      newErrors.emergencyContact = 'Emergency contact is required';
    }

    if (!enrollmentData.emergencyPhone) {
      newErrors.emergencyPhone = 'Emergency phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const enrollment = {
      employeeId: employee?.id,
      employeeName: employee?.name,
      selectedBenefits: selectedBenefits.map(benefitId => 
        benefits.find(b => b.id === benefitId)
      ),
      enrollmentData,
      totalCost: selectedBenefits.reduce((total, benefitId) => {
        const benefit = benefits.find(b => b.id === benefitId);
        return total + (benefit?.cost || 0);
      }, 0),
      enrollmentDate: new Date().toISOString()
    };

    onSave(enrollment);
  };

  const handleBenefitToggle = (benefitId: string, checked: boolean) => {
    if (checked) {
      setSelectedBenefits(prev => [...prev, benefitId]);
    } else {
      setSelectedBenefits(prev => prev.filter(id => id !== benefitId));
    }
  };

  const getBenefitIcon = (type: string) => {
    switch (type) {
      case 'health':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'dental':
        return <Shield className="w-5 h-5 text-blue-500" />;
      case 'vision':
        return <User className="w-5 h-5 text-green-500" />;
      case 'life':
        return <Shield className="w-5 h-5 text-purple-500" />;
      case 'disability':
        return <Shield className="w-5 h-5 text-orange-500" />;
      case 'retirement':
        return <DollarSign className="w-5 h-5 text-yellow-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBenefitTypeLabel = (type: string) => {
    switch (type) {
      case 'health':
        return 'Health Insurance';
      case 'dental':
        return 'Dental Insurance';
      case 'vision':
        return 'Vision Insurance';
      case 'life':
        return 'Life Insurance';
      case 'disability':
        return 'Disability Insurance';
      case 'retirement':
        return 'Retirement Plan';
      default:
        return 'Other Benefit';
    }
  };

  const totalCost = selectedBenefits.reduce((total, benefitId) => {
    const benefit = benefits.find(b => b.id === benefitId);
    return total + (benefit?.cost || 0);
  }, 0);

  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-6 h-6" />
          Benefit Enrollment
        </CardTitle>
        {employee && (
          <p className="text-gray-600">
            Enrolling {employee.name} ({employee.employeeId}) in benefits
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
                  <Label className="text-sm font-medium text-gray-600">Position</Label>
                  <p className="text-gray-900">{employee.position}</p>
                </div>
              </div>
            </div>
          )}

          {/* Available Benefits */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Available Benefits</h3>
            <div className="space-y-3">
              {benefits.map((benefit) => (
                <div
                  key={benefit.id}
                  className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Checkbox
                    id={benefit.id}
                    checked={selectedBenefits.includes(benefit.id)}
                    onCheckedChange={(checked) => handleBenefitToggle(benefit.id, checked as boolean)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getBenefitIcon(benefit.type)}
                      <Label htmlFor={benefit.id} className="text-lg font-medium cursor-pointer">
                        {benefit.name}
                      </Label>
                      <span className="text-sm text-gray-500">
                        ({getBenefitTypeLabel(benefit.type)})
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{benefit.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">Coverage: {benefit.coverage}</span>
                      <span className="text-gray-600">Cost: ${benefit.cost}/month</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {errors.benefits && (
              <p className="text-sm text-red-500">{errors.benefits}</p>
            )}
          </div>

          {/* Enrollment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Enrollment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="effectiveDate">Effective Date</Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  value={enrollmentData.effectiveDate}
                  onChange={(e) => setEnrollmentData(prev => ({
                    ...prev,
                    effectiveDate: e.target.value
                  }))}
                  className={errors.effectiveDate ? 'border-red-500' : ''}
                />
                {errors.effectiveDate && (
                  <p className="text-sm text-red-500">{errors.effectiveDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={enrollmentData.emergencyContact}
                  onChange={(e) => setEnrollmentData(prev => ({
                    ...prev,
                    emergencyContact: e.target.value
                  }))}
                  placeholder="Emergency contact name"
                  className={errors.emergencyContact ? 'border-red-500' : ''}
                />
                {errors.emergencyContact && (
                  <p className="text-sm text-red-500">{errors.emergencyContact}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                <Input
                  id="emergencyPhone"
                  value={enrollmentData.emergencyPhone}
                  onChange={(e) => setEnrollmentData(prev => ({
                    ...prev,
                    emergencyPhone: e.target.value
                  }))}
                  placeholder="Emergency contact phone"
                  className={errors.emergencyPhone ? 'border-red-500' : ''}
                />
                {errors.emergencyPhone && (
                  <p className="text-sm text-red-500">{errors.emergencyPhone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="beneficiary">Beneficiary (Optional)</Label>
                <Input
                  id="beneficiary"
                  value={enrollmentData.beneficiary}
                  onChange={(e) => setEnrollmentData(prev => ({
                    ...prev,
                    beneficiary: e.target.value
                  }))}
                  placeholder="Beneficiary name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="beneficiaryRelationship">Relationship to Beneficiary</Label>
                <Select
                  value={enrollmentData.beneficiaryRelationship}
                  onValueChange={(value) => setEnrollmentData(prev => ({
                    ...prev,
                    beneficiaryRelationship: value
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={enrollmentData.notes}
                onChange={(e) => setEnrollmentData(prev => ({
                  ...prev,
                  notes: e.target.value
                }))}
                placeholder="Any additional information or special requests"
                rows={3}
              />
            </div>
          </div>

          {/* Cost Summary */}
          {selectedBenefits.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Cost Summary</h3>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Total Monthly Cost:</span>
                  <span className="text-2xl font-bold text-blue-600">${totalCost}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  This amount will be deducted from the employee's salary
                </p>
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
              Enroll in Benefits
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BenefitEnrollmentForm;

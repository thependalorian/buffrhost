"use client";
import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Input } from '@/src/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  Percent,
  TrendingUp
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

interface CommissionStructureListProps {
  structures?: CommissionStructure[];
  onEdit: (structure: CommissionStructure) => void;
  onDelete: (id: string) => void;
  onView: (structure: CommissionStructure) => void;
  onAdd: () => void;
  className?: string;
}

const mockStructures: CommissionStructure[] = [
  {
    id: '1',
    name: 'Standard Restaurant Commission',
    type: 'percentage',
    rate: 5.0,
    applicableTo: ['Restaurant Orders', 'Food Delivery'],
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    description: 'Standard commission for restaurant orders'
  }
];

export const CommissionStructureList: React.FC<CommissionStructureListProps> = ({
  structures = mockStructures,
  onEdit,
  onDelete,
  onView,
  onAdd,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredStructures = structures.filter(structure => {
    const matchesSearch = structure.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         structure.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || structure.status === statusFilter;
    const matchesType = typeFilter === 'all' || structure.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <Percent className="w-4 h-4 text-blue-500" />;
      case 'fixed':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'tiered':
        return <TrendingUp className="w-4 h-4 text-purple-500" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatRate = (structure: CommissionStructure) => {
    if (structure.type === 'fixed') {
      return `$${structure.rate}`;
    } else if (structure.type === 'tiered') {
      return 'Tiered';
    } else {
      return `${structure.rate}%`;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Commission Structures</h2>
          <p className="text-gray-600">Manage commission rates and structures</p>
        </div>
        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Structure
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search structures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="percentage">Percentage</SelectItem>
            <SelectItem value="fixed">Fixed</SelectItem>
            <SelectItem value="tiered">Tiered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredStructures.map((structure) => (
          <Card key={structure.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {getTypeIcon(structure.type)}
                  <div>
                    <CardTitle className="text-lg">{structure.name}</CardTitle>
                    {structure.description && (
                      <p className="text-sm text-gray-600 mt-1">{structure.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(structure.status)}>
                    {structure.status}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(structure)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(structure)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(structure.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rate</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatRate(structure)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Applicable To</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {structure.applicableTo.slice(0, 2).map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                    {structure.applicableTo.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{structure.applicableTo.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Updated</p>
                  <p className="text-sm text-gray-900">
                    {new Date(structure.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStructures.length === 0 && (
        <div className="text-center py-12">
          <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No structures found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first commission structure'
            }
          </p>
          <Button onClick={onAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Structure
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommissionStructureList;

/**
 * Segment List Component
 *
 * Purpose: Displays and manages customer segments with filtering and search
 * Functionality: List segments, search, filter, create new segments
 * Location: /components/crm/customer-segmentation/SegmentList.tsx
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
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Eye,
  BarChart3,
  Calendar,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

// Types for TypeScript compliance
interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: {
    field: string;
    operator: string;
    value: unknown;
  }[];
  customerCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
  color: string;
}

interface SegmentListProps {
  segments: CustomerSegment[];
  onSegmentCreate: () => void;
  onSegmentEdit: (segment: CustomerSegment) => void;
  onSegmentDelete: (segmentId: string) => void;
  onSegmentView: (segment: CustomerSegment) => void;
  isLoading?: boolean;
}

// Main Segment List Component
export const SegmentList: React.FC<SegmentListProps> = ({
  segments,
  onSegmentCreate,
  onSegmentEdit,
  onSegmentDelete,
  onSegmentView,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Refs for performance optimization
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter and sort segments
  const filteredSegments = segments
    .filter((segment) => {
      const matchesSearch =
        segment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        segment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        segment.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && segment.isActive) ||
        (filterStatus === 'inactive' && !segment.isActive);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'customerCount':
          comparison = a.customerCount - b.customerCount;
          break;
        case 'createdAt':
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          comparison =
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Get segment color
  const getSegmentColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      pink: 'bg-pink-500',
      indigo: 'bg-indigo-500',
      teal: 'bg-teal-500',
    };
    return colorMap[color] || 'bg-gray-500';
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Customer Segments
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
            <Users className="w-5 h-5" />
            Customer Segments ({filteredSegments.length})
          </CardTitle>
          <Button onClick={onSegmentCreate} className="btn-primary btn-sm">
            <Plus className="w-4 h-4" />
            Create Segment
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-4 h-4" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search segments..."
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Segments</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="customerCount">Customer Count</SelectItem>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="updatedAt">Updated Date</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortOrder}
              onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {filteredSegments.length > 0 ? (
            filteredSegments.map((segment) => (
              <div
                key={segment.id}
                className="p-4 border rounded-lg hover:bg-base-200 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${getSegmentColor(segment.color)}`}
                    />
                    <h3 className="font-semibold text-lg">{segment.name}</h3>
                    <Badge
                      className={
                        segment.isActive ? 'badge-success' : 'badge-neutral'
                      }
                    >
                      {segment.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => onSegmentView(segment)}
                      className="btn-outline btn-sm"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => onSegmentEdit(segment)}
                      className="btn-outline btn-sm"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => onSegmentDelete(segment.id)}
                      className="btn-error btn-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-base-content/70 mb-3">
                  {segment.description}
                </p>

                <div className="flex items-center gap-6 text-sm text-base-content/70 mb-3">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{segment.customerCount} customers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Created {formatDate(segment.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart3 className="w-4 h-4" />
                    <span>{segment.criteria.length} criteria</span>
                  </div>
                </div>

                {/* Tags */}
                {segment.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {segment.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto mb-4 text-base-content/30" />
              <h3 className="text-lg font-semibold mb-2">No Segments Found</h3>
              <p className="text-base-content/70 mb-4">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first customer segment to start organizing customers'}
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Button onClick={onSegmentCreate} className="btn-primary">
                  <Plus className="w-4 h-4" />
                  Create First Segment
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SegmentList;

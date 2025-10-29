/**
 * Customer Segmentation Component - Modular Implementation
 *
 * Purpose: Advanced customer segmentation and analytics with modular architecture
 * Functionality: Create segments, manage criteria, view analytics, export data
 * Location: /components/crm/customer-segmentation-modular.tsx
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

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import {
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Users,
  Filter,
  BarChart3,
} from 'lucide-react';

// Import modular components
import SegmentList from './customer-segmentation/SegmentList';
import SegmentBuilder from './customer-segmentation/SegmentBuilder';

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

interface SegmentAnalytics {
  totalSegments: number;
  activeSegments: number;
  totalCustomers: number;
  averageSegmentSize: number;
  topSegments: {
    id: string;
    name: string;
    customerCount: number;
    growthRate: number;
  }[];
}

// Main Customer Segmentation Component
export const CustomerSegmentationModular: React.FC = () => {
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [analytics, setAnalytics] = useState<SegmentAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('segments');
  const [editingSegment, setEditingSegment] = useState<CustomerSegment | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);

  // Refs for performance optimization
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load segmentation data
  useEffect(() => {
    const loadSegmentationData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load segments
        const segmentsRes = await fetch(
          '/api/secure/customer-segmentation/segments'
        );
        if (segmentsRes.ok) {
          const segmentsData = await segmentsRes.json();
          setSegments(segmentsData.data);
        }

        // Load analytics
        const analyticsRes = await fetch(
          '/api/secure/customer-segmentation/analytics'
        );
        if (analyticsRes.ok) {
          const analyticsData = await analyticsRes.json();
          setAnalytics(analyticsData.data);
        }
      } catch (err) {
        console.error('Error loading segmentation data:', err);
        setError('Failed to load segmentation data');

        // Fallback mock data
        setSegments([
          {
            id: '1',
            name: 'High Value Customers',
            description: 'Customers with total spend over N$ 10,000',
            criteria: [
              { field: 'total_spent', operator: 'greater_than', value: 10000 },
            ],
            customerCount: 45,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'admin',
            tags: ['VIP', 'High Value'],
            color: 'purple',
          },
          {
            id: '2',
            name: 'Frequent Visitors',
            description: 'Customers with 5+ visits in the last 6 months',
            criteria: [
              { field: 'visit_count', operator: 'greater_than', value: 5 },
            ],
            customerCount: 128,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'admin',
            tags: ['Loyal', 'Regular'],
            color: 'green',
          },
        ]);

        setAnalytics({
          totalSegments: 2,
          activeSegments: 2,
          totalCustomers: 173,
          averageSegmentSize: 86.5,
          topSegments: [
            {
              id: '2',
              name: 'Frequent Visitors',
              customerCount: 128,
              growthRate: 15.2,
            },
            {
              id: '1',
              name: 'High Value Customers',
              customerCount: 45,
              growthRate: 8.7,
            },
          ],
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSegmentationData();
  }, []);

  // Handle segment creation
  const handleSegmentCreate = () => {
    setEditingSegment(null);
    setIsCreating(true);
    setActiveTab('builder');
  };

  // Handle segment edit
  const handleSegmentEdit = (segment: CustomerSegment) => {
    setEditingSegment(segment);
    setIsCreating(false);
    setActiveTab('builder');
  };

  // Handle segment save
  const handleSegmentSave = async (segmentData: CustomerSegment) => {
    try {
      const url = segmentData.id
        ? `/api/secure/customer-segmentation/segments/${segmentData.id}`
        : '/api/secure/customer-segmentation/segments';

      const method = segmentData.id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(segmentData),
      });

      if (!response.ok) throw new Error('Failed to save segment');

      const savedSegment = await response.json();

      if (segmentData.id) {
        setSegments((prev) =>
          prev.map((s) => (s.id === segmentData.id ? savedSegment.data : s))
        );
      } else {
        setSegments((prev) => [...prev, savedSegment.data]);
      }

      setEditingSegment(null);
      setIsCreating(false);
      setActiveTab('segments');
      setSuccess('Segment saved successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error saving segment:', error);
      setError('Failed to save segment');
    }
  };

  // Handle segment delete
  const handleSegmentDelete = async (segmentId: string) => {
    try {
      const response = await fetch(
        `/api/secure/customer-segmentation/segments/${segmentId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) throw new Error('Failed to delete segment');

      setSegments((prev) => prev.filter((s) => s.id !== segmentId));
      setSuccess('Segment deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error deleting segment:', error);
      setError('Failed to delete segment');
    }
  };

  // Handle segment view
  const handleSegmentView = (segment: CustomerSegment) => {
    console.log('View segment:', segment);
    // Implement segment detail view
  };

  // Handle refresh
  const handleRefresh = () => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    refreshTimeoutRef.current = setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  // Handle export
  const handleExport = () => {
    try {
      const data = {
        segments,
        analytics,
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customer-segments-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      setError('Failed to export segmentation data');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-base-content mb-2">
              Customer Segmentation
            </h1>
            <p className="text-base-content/70">
              Create and manage customer segments for targeted marketing
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
            <Button
              onClick={handleRefresh}
              className="btn-outline btn-sm"
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button onClick={handleExport} className="btn-primary btn-sm">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="alert alert-error mb-6">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
            <Button onClick={() => setError(null)} className="btn-sm btn-ghost">
              ×
            </Button>
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-6">
            <CheckCircle className="w-4 h-4" />
            <span>{success}</span>
            <Button
              onClick={() => setSuccess(null)}
              className="btn-sm btn-ghost"
            >
              ×
            </Button>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="segments" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Segments
            </TabsTrigger>
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              {editingSegment ? 'Edit Segment' : 'Create Segment'}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Segments Tab */}
          <TabsContent value="segments">
            <SegmentList
              segments={segments}
              onSegmentCreate={handleSegmentCreate}
              onSegmentEdit={handleSegmentEdit}
              onSegmentDelete={handleSegmentDelete}
              onSegmentView={handleSegmentView}
              isLoading={isLoading}
            />
          </TabsContent>

          {/* Builder Tab */}
          <TabsContent value="builder">
            <SegmentBuilder
              segment={editingSegment || undefined}
              onSave={handleSegmentSave}
              onCancel={() => {
                setEditingSegment(null);
                setIsCreating(false);
                setActiveTab('segments');
              }}
              isLoading={isLoading}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            {analytics && (
              <div className="space-y-6">
                {/* Analytics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {analytics.totalSegments}
                      </div>
                      <div className="text-sm text-base-content/70">
                        Total Segments
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-success">
                        {analytics.activeSegments}
                      </div>
                      <div className="text-sm text-base-content/70">
                        Active Segments
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-warning">
                        {analytics.totalCustomers}
                      </div>
                      <div className="text-sm text-base-content/70">
                        Total Customers
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-info">
                        {Math.round(analytics.averageSegmentSize)}
                      </div>
                      <div className="text-sm text-base-content/70">
                        Avg Segment Size
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Segments */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Top Performing Segments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.topSegments.map((segment, index) => (
                        <div
                          key={segment.id}
                          className="flex items-center justify-between p-4 bg-base-200 rounded"
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-2xl font-bold text-primary">
                              #{index + 1}
                            </div>
                            <div>
                              <h3 className="font-semibold">{segment.name}</h3>
                              <p className="text-sm text-base-content/70">
                                {segment.customerCount} customers
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-success">
                              +{segment.growthRate}%
                            </div>
                            <div className="text-sm text-base-content/70">
                              Growth Rate
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerSegmentationModular;

'use client';

import React, { useState, useEffect } from 'react';
import { MLDashboardLayout } from '@/components/features/bi/MLDashboardLayout';
import {
  BuffrCard,
  BuffrCardHeader,
  BuffrCardTitle,
  BuffrCardBody,
  BuffrButton,
  BuffrBadge,
} from '@/components/ui';
import { BuffrIcon } from '@/components/ui/icons/BuffrIcons';

interface MLModel {
  id: string;
  name: string;
  type: string;
  status: string;
  accuracy?: number;
  lastTrained?: string;
  featureCount?: number;
}

interface MLStatus {
  isInitialized: boolean;
  modelCount: number;
  pipelineCount: number;
  recommendationEngineStatus: any;
}

export default function MLDashboardPage() {
  const [models, setModels] = useState<MLModel[]>([]);
  const [status, setStatus] = useState<MLStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('Never');

  useEffect(() => {
    fetchMLData();
  }, []);

  const fetchMLData = async () => {
    try {
      setLoading(true);

      // Fetch available models
      const modelsResponse = await fetch('/api/ml/predict');
      const modelsData = await modelsResponse.json();
      setModels(modelsData.models || []);

      // Fetch ML service status
      const statusResponse = await fetch('/api/ml/models');
      const statusData = await statusResponse.json();
      setStatus(statusData);

      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Failed to fetch ML data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return (
          <BuffrBadge className="bg-green-100 text-green-800">Ready</BuffrBadge>
        );
      case 'training':
        return (
          <BuffrBadge className="bg-yellow-100 text-yellow-800">
            Training
          </BuffrBadge>
        );
      case 'error':
        return (
          <BuffrBadge className="bg-red-100 text-red-800">Error</BuffrBadge>
        );
      default:
        return (
          <BuffrBadge className="bg-gray-100 text-gray-800">
            {status}
          </BuffrBadge>
        );
    }
  };

  const getModelTypeIcon = (type: string) => {
    switch (type) {
      case 'regression':
        return 'trending-up';
      case 'classification':
        return 'check-circle';
      case 'clustering':
        return 'users';
      case 'forecasting':
        return 'calendar';
      default:
        return 'brain';
    }
  };

  if (loading) {
    return (
      <MLDashboardLayout
        title="Machine Learning Dashboard"
        description="AI-powered insights and predictions for hospitality operations"
        status="warning"
        lastUpdated="Loading..."
      >
        <BuffrCard>
          <BuffrCardBody>
            <div className="flex items-center justify-center p-8">
              <BuffrIcon name="refresh-cw" className="h-8 w-8 animate-spin mr-2" />
              <span>Loading ML dashboard...</span>
            </div>
          </BuffrCardBody>
        </BuffrCard>
      </MLDashboardLayout>
    );
  }

  return (
    <MLDashboardLayout
      title="Machine Learning Dashboard"
      description="AI-powered insights and predictions for hospitality operations"
      status={status?.isInitialized ? 'healthy' : 'error'}
      lastUpdated={lastUpdated}
      onRefresh={fetchMLData}
      onExport={() => console.log('Export functionality')}
      onConfigure={() => console.log('Configure functionality')}
    >
      {/* ML Service Status */}
      <BuffrCard className="overflow-hidden">
        <BuffrCardHeader>
          <BuffrCardTitle className="flex items-center truncate">
            <BuffrIcon
              name="activity"
              className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0"
            />
            <span className="truncate">ML Service Status</span>
          </BuffrCardTitle>
        </BuffrCardHeader>
        <BuffrCardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="text-center p-2 md:p-4 bg-gray-50 rounded-lg">
              <div className="text-xl md:text-2xl font-bold text-blue-600 truncate">
                {status?.modelCount || 0}
              </div>
              <div className="text-xs md:text-sm text-gray-600 truncate">
                Models
              </div>
            </div>
            <div className="text-center p-2 md:p-4 bg-gray-50 rounded-lg">
              <div className="text-xl md:text-2xl font-bold text-green-600 truncate">
                {status?.pipelineCount || 0}
              </div>
              <div className="text-xs md:text-sm text-gray-600 truncate">
                Pipelines
              </div>
            </div>
            <div className="text-center p-2 md:p-4 bg-gray-50 rounded-lg">
              <div className="text-lg md:text-2xl font-bold text-purple-600 truncate">
                {status?.recommendationEngineStatus?.isInitialized
                  ? 'Active'
                  : 'Inactive'}
              </div>
              <div className="text-xs md:text-sm text-gray-600 line-clamp-2 break-words">
                Recommendation Engine
              </div>
            </div>
            <div className="text-center p-2 md:p-4 bg-gray-50 rounded-lg">
              <div className="text-xl md:text-2xl font-bold text-orange-600 truncate">
                {models.filter((m) => m.status === 'ready').length}
              </div>
              <div className="text-xs md:text-sm text-gray-600 truncate">
                Ready Models
              </div>
            </div>
          </div>
        </BuffrCardBody>
      </BuffrCard>

      {/* Available Models */}
      <BuffrCard>
        <BuffrCardHeader>
          <BuffrCardTitle className="flex items-center">
            <BuffrIcon name="brain" className="h-5 w-5 mr-2" />
            Available Models
          </BuffrCardTitle>
        </BuffrCardHeader>
        <BuffrCardBody>
          {models.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BuffrIcon
                name="brain"
                className="h-12 w-12 mx-auto mb-4 opacity-50"
              />
              <p>No models available. Train your first model to get started.</p>
              <BuffrButton className="mt-4">Train New Model</BuffrButton>
            </div>
          ) : (
            <div className="grid gap-3 md:gap-4">
              {models.map((model) => (
                <div
                  key={model.id}
                  className="border rounded-lg p-3 md:p-4 hover:bg-gray-50 overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 md:mb-2">
                    <div className="flex items-center min-w-0 flex-1">
                      <BuffrIcon
                        name={getModelTypeIcon(model.type)}
                        className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 text-blue-600 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm md:text-base truncate">
                          {model.name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 capitalize truncate">
                          {model.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {getStatusBadge(model.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-3 md:mt-4">
                    <div className="min-w-0">
                      <div className="text-xs md:text-sm text-gray-600 truncate">
                        Accuracy
                      </div>
                      <div className="font-semibold text-sm md:text-base truncate">
                        {model.accuracy
                          ? `${(model.accuracy * 100).toFixed(1)}%`
                          : 'N/A'}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs md:text-sm text-gray-600 truncate">
                        Features
                      </div>
                      <div className="font-semibold text-sm md:text-base truncate">
                        {model.featureCount || 'N/A'}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs md:text-sm text-gray-600 truncate">
                        Last Trained
                      </div>
                      <div className="font-semibold text-xs md:text-sm truncate">
                        {model.lastTrained
                          ? new Date(model.lastTrained).toLocaleDateString()
                          : 'Never'}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 col-span-2 md:col-span-1">
                      <BuffrButton
                        size="sm"
                        variant="outline"
                        className="min-h-[36px] md:min-h-[32px] text-xs md:text-sm w-full sm:w-auto"
                      >
                        Test
                      </BuffrButton>
                      <BuffrButton
                        size="sm"
                        variant="outline"
                        className="min-h-[36px] md:min-h-[32px] text-xs md:text-sm w-full sm:w-auto"
                      >
                        Retrain
                      </BuffrButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </BuffrCardBody>
      </BuffrCard>

      {/* Quick Actions */}
      <BuffrCard>
        <BuffrCardHeader>
          <BuffrCardTitle className="flex items-center">
            <BuffrIcon name="zap" className="h-5 w-5 mr-2" />
            Quick Actions
          </BuffrCardTitle>
        </BuffrCardHeader>
        <BuffrCardBody>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <BuffrButton className="min-h-[80px] md:h-20 flex-col text-sm md:text-base">
              <BuffrIcon
                name="plus"
                className="h-5 w-5 md:h-6 md:w-6 mb-2 flex-shrink-0"
              />
              <span className="truncate">Train New Model</span>
            </BuffrButton>
            <BuffrButton
              variant="outline"
              className="min-h-[80px] md:h-20 flex-col text-sm md:text-base"
            >
              <BuffrIcon
                name="check-circle"
                className="h-5 w-5 md:h-6 md:w-6 mb-2 flex-shrink-0"
              />
              <span className="truncate">Run Predictions</span>
            </BuffrButton>
            <BuffrButton
              variant="outline"
              className="min-h-[80px] md:h-20 flex-col text-sm md:text-base"
            >
              <BuffrIcon
                name="bar-chart"
                className="h-5 w-5 md:h-6 md:w-6 mb-2 flex-shrink-0"
              />
              <span className="truncate">View Analytics</span>
            </BuffrButton>
          </div>
        </BuffrCardBody>
      </BuffrCard>

      {/* Recent Activity */}
      <BuffrCard>
        <BuffrCardHeader>
          <BuffrCardTitle className="flex items-center">
            <BuffrIcon name="clock" className="h-5 w-5 mr-2" />
            Recent Activity
          </BuffrCardTitle>
        </BuffrCardHeader>
        <BuffrCardBody>
          <div className="space-y-2 md:space-y-3">
            <div className="flex items-center justify-between py-2 border-b gap-2">
              <div className="flex items-center min-w-0 flex-1">
                <BuffrIcon
                  name="check-circle"
                  className="h-4 w-4 text-green-600 mr-2 md:mr-3 flex-shrink-0"
                />
                <span className="text-xs md:text-sm truncate break-words">
                  Revenue prediction model updated
                </span>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                2 minutes ago
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b gap-2">
              <div className="flex items-center min-w-0 flex-1">
                <BuffrIcon
                  name="users"
                  className="h-4 w-4 text-blue-600 mr-2 md:mr-3 flex-shrink-0"
                />
                <span className="text-xs md:text-sm truncate break-words">
                  Customer segmentation completed
                </span>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                15 minutes ago
              </span>
            </div>
            <div className="flex items-center justify-between py-2 gap-2">
              <div className="flex items-center min-w-0 flex-1">
                <BuffrIcon
                  name="calendar"
                  className="h-4 w-4 text-purple-600 mr-2 md:mr-3 flex-shrink-0"
                />
                <span className="text-xs md:text-sm truncate break-words">
                  Demand forecast generated
                </span>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                1 hour ago
              </span>
            </div>
          </div>
        </BuffrCardBody>
      </BuffrCard>
    </MLDashboardLayout>
  );
}

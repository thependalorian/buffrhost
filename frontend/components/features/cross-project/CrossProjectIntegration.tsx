'use client';
import {
  BuffrCard,
  BuffrCardBody,
  BuffrCardHeader,
  BuffrCardTitle,
  BuffrButton,
  BuffrInput,
  BuffrBadge,
  BuffrAlert,
} from '@/components/ui';
/**
 * Cross-Project Integration Component
 *
 * Provides UI for cross-project functionality with Buffr ID system
 * Features: User lookup, property management, unified dashboard
 * Location: components/features/cross-project/CrossProjectIntegration.tsx
 */

import React, { useState, useEffect } from 'react';
import {
  CrossProjectUser,
  PropertyData,
  UnifiedDashboardData,
  BuffrIDComponents,
} from '@/lib/types';
import { CrossProjectIntegrationService } from '@/lib/cross-project-integration';
import { BuffrIDService } from '@/lib/buffr-id-service';
import {
  MagnifyingGlassIcon,
  UserIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
interface CrossProjectIntegrationProps {
  onUserFound?: (user: CrossProjectUser) => void;
  onPropertyFound?: (property: PropertyData) => void;
  onDashboardLoaded?: (dashboard: UnifiedDashboardData) => void;
  className?: string;
}

export default function CrossProjectIntegration({
  onUserFound,
  onPropertyFound,
  onDashboardLoaded,
  className = '',
}: CrossProjectIntegrationProps) {
  const [searchType, setSearchType] = useState<'user' | 'property'>('user');
  const [searchQuery, setSearchQuery] = useState('');
  const [country, setCountry] = useState('NA');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    user?: CrossProjectUser;
    property?: PropertyData;
    dashboard?: UnifiedDashboardData;
  }>({});

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults({});

    try {
      if (searchType === 'user') {
        const user = await CrossProjectIntegrationService.getUserBuffrIDs(
          searchQuery,
          country
        );
        if (user) {
          setResults({ user });
          onUserFound?.(user);
        } else {
          setError('User not found across projects');
        }
      } else {
        // For property search, we need owner ID
        const property =
          await CrossProjectIntegrationService.getPropertyBuffrIDs(
            searchQuery,
            'owner-123',
            country
          );
        if (property) {
          setResults({ property });
          onPropertyFound?.(property);
        } else {
          setError('Property not found across projects');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadDashboard = async (buffrId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const dashboard =
        await CrossProjectIntegrationService.getUnifiedDashboard(buffrId);
      if (dashboard) {
        setResults((prev) => ({ ...prev, dashboard }));
        onDashboardLoaded?.(dashboard);
      } else {
        setError('Failed to load unified dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dashboard load failed');
    } finally {
      setIsLoading(false);
    }
  };

  const parseBuffrId = (buffrId: string): BuffrIDComponents | null => {
    return BuffrIDService.parseID(buffrId);
  };

  const getProjectColor = (project: string): string => {
    const colors = {
      PAY: 'bg-nude-100 text-nude-800',
      SIGN: 'bg-green-100 text-success',
      LEND: 'bg-purple-100 text-purple-800',
      HOST: 'bg-orange-100 text-orange-800',
    };
    return (
      colors[project as keyof typeof colors] || 'bg-nude-100 text-nude-800'
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GlobeAltIcon className="h-5 w-5" />
            Cross-Project Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Type Selection */}
          <div className="flex gap-2">
            <Button
              variant={searchType === 'user' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSearchType('user')}
            >
              <UserIcon className="h-4 w-4 mr-1" />
              User
            </Button>
            <Button
              variant={searchType === 'property' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSearchType('property')}
            >
              <BuildingOfficeIcon className="h-4 w-4 mr-1" />
              Property
            </Button>
          </div>

          {/* Search Input */}
          <div className="flex gap-2">
            <Input
              placeholder={`Enter ${searchType === 'user' ? 'user identifier' : 'property identifier'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="px-3 py-2 border border-nude-300 rounded-md"
            >
              <option value="NA">Namibia</option>
              <option value="ZA">South Africa</option>
              <option value="BW">Botswana</option>
              <option value="ZM">Zambia</option>
            </select>
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="px-4"
            >
              {isLoading ? (
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
              ) : (
                <MagnifyingGlassIcon className="h-4 w-4" />
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="error">
              <XCircleIcon className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {results.user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              User Found
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-nude-500">Buffr ID</p>
                <p className="font-mono text-sm">{results.user.buffrId}</p>
              </div>
              <div>
                <p className="text-sm text-nude-500">Entity Type</p>
                <Badge>{results.user.entityType}</Badge>
              </div>
              <div>
                <p className="text-sm text-nude-500">Country</p>
                <p className="text-sm">{results.user.country}</p>
              </div>
              <div>
                <p className="text-sm text-nude-500">Verified</p>
                <div className="flex items-center gap-1">
                  {results.user.isVerified ? (
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircleIcon className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">
                    {results.user.isVerified ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-nude-500 mb-2">Active Projects</p>
              <div className="flex gap-2">
                {results.user.projects.map((project) => (
                  <Badge key={project} className={getProjectColor(project)}>
                    {project}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-nude-500">Last Active</p>
              <p className="text-sm">
                {results.user.lastActive.toLocaleDateString()}
              </p>
            </div>

            <Button
              onClick={() => handleLoadDashboard(results.user!.buffrId)}
              disabled={isLoading}
              className="w-full"
            >
              Load Unified Dashboard
            </Button>
          </CardContent>
        </Card>
      )}

      {results.property && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BuildingOfficeIcon className="h-5 w-5" />
              Property Found
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-nude-500">Buffr ID</p>
                <p className="font-mono text-sm">{results.property.buffrId}</p>
              </div>
              <div>
                <p className="text-sm text-nude-500">Name</p>
                <p className="text-sm">{results.property.name}</p>
              </div>
              <div>
                <p className="text-sm text-nude-500">Type</p>
                <Badge>{results.property.type}</Badge>
              </div>
              <div>
                <p className="text-sm text-nude-500">Location</p>
                <p className="text-sm">{results.property.location}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-nude-500">Status</p>
              <Badge className="bg-green-100 text-success">
                {results.property.status}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-nude-500">Last Activity</p>
              <p className="text-sm">
                {results.property.lastActivity.toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {results.dashboard && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GlobeAltIcon className="h-5 w-5" />
              Unified Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-nude-600">
                  {results.dashboard.summary.totalProjects}
                </p>
                <p className="text-sm text-nude-500">Total Projects</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success">
                  {results.dashboard.summary.activeProjects}
                </p>
                <p className="text-sm text-nude-500">Active Projects</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {results.dashboard.user.projects.length}
                </p>
                <p className="text-sm text-nude-500">Connected</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-nude-500 mb-2">Project Data</p>
              <div className="space-y-2">
                {Object.entries(results.dashboard.projects).map(
                  ([project, data]) => (
                    <div
                      key={project}
                      className="flex items-center justify-between p-2 bg-nude-50 rounded"
                    >
                      <Badge className={getProjectColor(project)}>
                        {project}
                      </Badge>
                      <span className="text-sm text-nude-600">
                        {data ? 'Connected' : 'Not Available'}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import {
  BuffrIcon,
  BuffrCard,
  BuffrCardBody,
  BuffrCardHeader,
  BuffrCardTitle,
  BuffrButton,
  BuffrBadge,
} from '@/components/ui';
/**
 * ML Dashboard Layout Component
 * Reusable layout for all BI/ML system dashboards
 */

import React from 'react';
interface MLDashboardLayoutProps {
  title: string;
  description: string;
  status: 'healthy' | 'warning' | 'error';
  lastUpdated: string;
  children: React.ReactNode;
  onRefresh?: () => void;
  onExport?: () => void;
  onConfigure?: () => void;
}

export function MLDashboardLayout({
  title,
  description,
  status,
  lastUpdated,
  children,
  onRefresh,
  onExport,
  onConfigure,
}: MLDashboardLayoutProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'healthy':
        return (
          <BuffrIcon name="check-circle" className="h-4 w-4 text-green-500" />
        );
      case 'warning':
        return (
          <BuffrIcon
            name="alert-triangle"
            className="h-4 w-4 text-yellow-500"
          />
        );
      case 'error':
        return (
          <BuffrIcon name="alert-triangle" className="h-4 w-4 text-red-500" />
        );
      default:
        return (
          <BuffrIcon name="alert-triangle" className="h-4 w-4 text-nude-500" />
        );
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-success';
      case 'warning':
        return 'bg-yellow-100 text-warning';
      case 'error':
        return 'bg-red-100 text-error';
      default:
        return 'bg-nude-100 text-nude-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor()}>
            {getStatusIcon()}
            <span className="ml-1 capitalize">{status}</span>
          </Badge>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            Last updated: {lastUpdated}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="flex items-center space-x-2"
          >
            <BuffrIcon name="download" className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onConfigure}
            className="flex items-center space-x-2"
          >
            <BuffrIcon name="settings" className="h-4 w-4" />
            <span>Configure</span>
          </Button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="grid gap-6">{children}</div>
    </div>
  );
}

export default MLDashboardLayout;

'use client';

import React, { useState, useEffect } from 'react';
import { PermissionGuard } from '@/components/features/rbac/PermissionGuard';
import { Permission } from '@/lib/types/rbac';
import {
  BuffrCard,
  BuffrCardBody,
  BuffrCardHeader,
  BuffrCardTitle,
  BuffrBadge,
  BuffrButton,
  BuffrTabs,
  BuffrTabsContent,
  BuffrTabsList,
  BuffrTabsTrigger,
  BuffrAlert,
  BuffrIcon,
} from '@/components/ui';
interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  server_uptime: number;
  database_connections: number;
  cache_hit_rate: number;
  response_time: number;
  error_rate: number;
  last_updated: string;
}

interface TenantSummary {
  id: string;
  name: string;
  status: 'active' | 'suspended' | 'trial';
  users_count: number;
  last_activity: string;
  plan: string;
  usage_percentage: number;
}

interface UserStats {
  total_users: number;
  active_sessions: number;
  users_by_role: Record<string, number>;
  recent_registrations: number;
}

interface SystemMetrics {
  api_requests: number;
  response_time_avg: number;
  error_rate: number;
  active_tenants: number;
  total_revenue: number;
  system_load: number;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  status: 'success' | 'failed';
  ip_address: string;
}

/**
 * Super Admin Dashboard
 * System-wide administration and monitoring interface
 */
function SuperAdminDashboard() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [tenants, setTenants] = useState<TenantSummary[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(
    null
  );
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string>('');

  useEffect(() => {
    loadDashboardData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [healthData, tenantsData, usersData, metricsData, auditData] =
        await Promise.all([
          fetch('/api/admin/system/health').then((res) => res.json()),
          fetch('/api/admin/tenants').then((res) => res.json()),
          fetch('/api/admin/users/stats').then((res) => res.json()),
          fetch('/api/admin/analytics/system').then((res) => res.json()),
          fetch('/api/admin/audit-logs?limit=10').then((res) => res.json()),
        ]);

      setSystemHealth(healthData);
      setTenants(tenantsData.tenants || []);
      setUserStats(usersData);
      setSystemMetrics(metricsData);
      setAuditLog(auditData.entries || []);
      setLastRefresh(new Date().toLocaleString());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load dashboard data'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const handleSystemAction = async (action: string) => {
    try {
      const response = await fetch(`/api/admin/system/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`Failed to ${action}`);

      // Refresh data after action
      loadDashboardData();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${action}`);
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-semantic-success bg-green-100';
      case 'warning':
        return 'text-semantic-warning bg-yellow-100';
      case 'critical':
        return 'text-semantic-error bg-red-100';
      default:
        return 'text-nude-600 bg-nude-100';
    }
  };

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <BuffrIcon name="check-circle" className="h-4 w-4" />;
      case 'warning':
        return <BuffrIcon name="alert-triangle" className="h-4 w-4" />;
      case 'critical':
        return <BuffrIcon name="alert-triangle" className="h-4 w-4" />;
      default:
        return <BuffrIcon name="clock" className="h-4 w-4" />;
    }
  };
}

export default SuperAdminDashboard;

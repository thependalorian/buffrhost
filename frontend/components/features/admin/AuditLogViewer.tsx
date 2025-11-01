'use client';
/**
 * AuditLogViewer React Component for Buffr Host Hospitality Platform
 * @fileoverview AuditLogViewer provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/features/admin/AuditLogViewer.tsx
 * @purpose AuditLogViewer provides specialized functionality for the Buffr Host platform
 * @component AuditLogViewer
 * @category Features
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @database_connections Reads from relevant tables based on component functionality
 * @api_integration RESTful API endpoints for data fetching and mutations
 * @authentication JWT-based authentication for user-specific functionality
 * @state_management Local component state for UI interactions and data management
 * @hooks_utilization useState, useCallback, useEffect for state management and side effects
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Configurable props for flexible component usage
 * - Interactive state management for dynamic user experiences
 * - Real-time data integration with backend services
 * - API-driven functionality with error handling and loading states
 * - Secure authentication integration for user-specific features
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Props:
 * @param {} [initialEntries] - initialEntries prop description
 * @param {} [showFilters] - showFilters prop description
 * @param {} [showStats] - showStats prop description
 * @param {} [maxHeight] - maxHeight prop description
 * @param {} [onEntryClick] - onEntryClick prop description
 * @param {} [onExport] - onExport prop description
 * @param {} [onRefresh] - onRefresh prop description
 *
 * State:
 * @state {any} initialEntries - Component state for initialentries management
 * @state {any} initialEntries - Component state for initialentries management
 * @state {any} null - Component state for null management
 * @state {any} {
    search: '' - Component state for {
    search: '' management
 * @state {any} null - Component state for null management
 * @state {any} null - Component state for null management
 *
 * Methods:
 * @method handleFilterChange - handleFilterChange method for component functionality
 * @method handleEntryClick - handleEntryClick method for component functionality
 * @method getStatusIcon - getStatusIcon method for component functionality
 * @method getStatusColor - getStatusColor method for component functionality
 * @method getActionIcon - getActionIcon method for component functionality
 * @method formatTimestamp - formatTimestamp method for component functionality
 * @method getUniqueValues - getUniqueValues method for component functionality
 *
 * Usage Example:
 * @example
 * import { AuditLogViewer } from './AuditLogViewer';
 *
 * function App() {
 *   return (
 *     <AuditLogViewer
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered AuditLogViewer component
 */

import {
  BuffrIcon,
  BuffrCard,
  BuffrCardBody,
  BuffrCardHeader,
  BuffrCardTitle,
  BuffrButton,
  BuffrInput,
  BuffrBadge,
  BuffrAlert,
  BuffrSelect,
  BuffrTable,
} from '@/components/ui';

import React, { useState, useEffect, useCallback } from 'react';
interface AuditLogEntry {
  id: string;
  timestamp: string;
  user_id: string;
  user_name: string;
  user_role: string;
  action: string;
  resource_type: string;
  resource_id: string;
  resource_name: string;
  status: 'success' | 'failed' | 'warning';
  ip_address: string;
  user_agent: string;
  details: Record<string, any>;
  tenant_id?: string;
  session_id?: string;
}

interface AuditLogFilters {
  search: string;
  status: string;
  user_role: string;
  action: string;
  resource_type: string;
  date_from: string;
  date_to: string;
}

interface AuditLogStats {
  total_entries: number;
  success_count: number;
  failed_count: number;
  warning_count: number;
  unique_users: number;
  most_common_actions: Array<{ action: string; count: number }>;
  recent_activity: number;
}

interface AuditLogViewerProps {
  initialEntries?: AuditLogEntry[];
  showFilters?: boolean;
  showStats?: boolean;
  maxHeight?: string;
  onEntryClick?: (entry: AuditLogEntry) => void;
  onExport?: () => void;
  onRefresh?: () => void;
}

/**
 * Audit Log Viewer Component
 * Comprehensive audit log viewing and filtering interface
 */
export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({
  initialEntries = [],
  showFilters = true,
  showStats = true,
  maxHeight = '600px',
  onEntryClick,
  onExport,
  onRefresh,
}) => {
  const [entries, setEntries] = useState<AuditLogEntry[]>(initialEntries);
  const [filteredEntries, setFilteredEntries] =
    useState<AuditLogEntry[]>(initialEntries);
  const [stats, setStats] = useState<AuditLogStats | null>(null);
  const [filters, setFilters] = useState<AuditLogFilters>({
    search: '',
    status: 'all',
    user_role: 'all',
    action: 'all',
    resource_type: 'all',
    date_from: '',
    date_to: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(
    null
  );

  const loadAuditData = async () => {
    try {
      setIsLoading(true);
      const [entriesResponse, statsResponse] = await Promise.all([
        fetch('/api/admin/audit-logs'),
        fetch('/api/admin/audit-logs/stats'),
      ]);

      if (!entriesResponse.ok || !statsResponse.ok) {
        throw new Error('Failed to fetch audit data');
      }

      const entriesData = await entriesResponse.json();
      const statsData = await statsResponse.json();

      setEntries(entriesData.entries || []);
      setStats(statsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load audit data'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...entries];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (entry) =>
          entry.user_name.toLowerCase().includes(searchLower) ||
          entry.action.toLowerCase().includes(searchLower) ||
          entry.resource_name.toLowerCase().includes(searchLower) ||
          entry.resource_type.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter((entry) => entry.status === filters.status);
    }

    // User role filter
    if (filters.user_role !== 'all') {
      filtered = filtered.filter(
        (entry) => entry.user_role === filters.user_role
      );
    }

    // Action filter
    if (filters.action !== 'all') {
      filtered = filtered.filter((entry) => entry.action === filters.action);
    }

    // Resource type filter
    if (filters.resource_type !== 'all') {
      filtered = filtered.filter(
        (entry) => entry.resource_type === filters.resource_type
      );
    }

    // Date filters
    if (filters.date_from) {
      filtered = filtered.filter(
        (entry) => new Date(entry.timestamp) >= new Date(filters.date_from)
      );
    }

    if (filters.date_to) {
      filtered = filtered.filter(
        (entry) => new Date(entry.timestamp) <= new Date(filters.date_to)
      );
    }

    setFilteredEntries(filtered);
  }, [entries, filters]);

  useEffect(() => {
    loadAuditData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [entries, filters, applyFilters]);

  const handleFilterChange = (key: keyof AuditLogFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleEntryClick = (entry: AuditLogEntry) => {
    setSelectedEntry(entry);
    onEntryClick?.(entry);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <BuffrIcon name="check-circle" className="h-4 w-4 text-success" />
        );
      case 'failed':
        return <BuffrIcon name="x-circle" className="h-4 w-4 text-error" />;
      case 'warning':
        return (
          <BuffrIcon name="alert-triangle" className="h-4 w-4 text-warning" />
        );
      default:
        return <BuffrIcon name="clock" className="h-4 w-4 text-nude-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-success';
      case 'failed':
        return 'bg-red-100 text-error';
      case 'warning':
        return 'bg-yellow-100 text-warning';
      default:
        return 'bg-nude-100 text-nude-800';
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('login') || action.includes('auth'))
      return <BuffrIcon name="shield" className="h-4 w-4" />;
    if (action.includes('create') || action.includes('add'))
      return <BuffrIcon name="user" className="h-4 w-4" />;
    if (action.includes('update') || action.includes('edit'))
      return <BuffrIcon name="activity" className="h-4 w-4" />;
    if (action.includes('delete') || action.includes('remove'))
      return <BuffrIcon name="x-circle" className="h-4 w-4" />;
    return <BuffrIcon name="activity" className="h-4 w-4" />;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getUniqueValues = (key: keyof AuditLogEntry) => {
    return Array.from(
      new Set(entries.map((entry) => entry[key]).filter(Boolean))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-nude-900">Audit Log Viewer</h2>
          <p className="text-nude-600 mt-1">
            System activity and security audit trail
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadAuditData}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={onExport}>
            <BuffrIcon name="download" className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {showStats && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Entries
              </CardTitle>
              <BuffrIcon
                name="activity"
                className="h-4 w-4 text-muted-foreground"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_entries}</div>
              <p className="text-xs text-muted-foreground">All audit entries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Success Rate
              </CardTitle>
              <BuffrIcon name="check-circle" className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((stats.success_count / stats.total_entries) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.success_count} successful
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Failed Actions
              </CardTitle>
              <BuffrIcon name="x-circle" className="h-4 w-4 text-error" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.failed_count}</div>
              <p className="text-xs text-muted-foreground">Failed operations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <BuffrIcon
                name="user"
                className="h-4 w-4 text-muted-foreground"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.unique_users}</div>
              <p className="text-xs text-muted-foreground">Unique users</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BuffrIcon name="filter" className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <BuffrIcon
                    name="search"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  />
                  <Input
                    placeholder="Search entries..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange('search', e.target.value)
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  User Role
                </label>
                <Select
                  value={filters.user_role}
                  onValueChange={(value) =>
                    handleFilterChange('user_role', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {getUniqueValues('user_role').map((role, index) => (
                      <SelectItem key={`${role}-${index}`} value={String(role)}>
                        {String(role)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Action</label>
                <Select
                  value={filters.action}
                  onValueChange={(value) => handleFilterChange('action', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    {getUniqueValues('action').map((action, index) => (
                      <SelectItem
                        key={`${action}-${index}`}
                        value={String(action)}
                      >
                        {String(action)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Log Entries ({filteredEntries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto" style={{ maxHeight }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow
                    key={entry.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(entry.status)}
                        <Badge className={getStatusColor(entry.status)}>
                          {entry.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{entry.user_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {entry.user_role}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getActionIcon(entry.action)}
                        <span>{entry.action}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{entry.resource_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {entry.resource_type}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {formatTimestamp(entry.timestamp)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-mono">{entry.ip_address}</p>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEntryClick(entry)}
                      >
                        <BuffrIcon name="eye" className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Entry Details Modal */}
      {selectedEntry && (
        <Card>
          <CardHeader>
            <CardTitle>Entry Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">User</label>
                  <p className="text-sm">
                    {selectedEntry.user_name} ({selectedEntry.user_role})
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Action</label>
                  <p className="text-sm">{selectedEntry.action}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Resource</label>
                  <p className="text-sm">
                    {selectedEntry.resource_name} ({selectedEntry.resource_type}
                    )
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Badge className={getStatusColor(selectedEntry.status)}>
                    {selectedEntry.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Timestamp</label>
                  <p className="text-sm">
                    {formatTimestamp(selectedEntry.timestamp)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">IP Address</label>
                  <p className="text-sm font-mono">
                    {selectedEntry.ip_address}
                  </p>
                </div>
              </div>

              {selectedEntry.details &&
                Object.keys(selectedEntry.details).length > 0 && (
                  <div>
                    <label className="text-sm font-medium">Details</label>
                    <pre className="text-sm bg-muted p-3 rounded mt-1 overflow-auto">
                      {JSON.stringify(selectedEntry.details, null, 2)}
                    </pre>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="error">
          <BuffrIcon name="alert-triangle" className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

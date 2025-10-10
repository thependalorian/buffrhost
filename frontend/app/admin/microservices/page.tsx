"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  Server, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  
  CheckCircle,
  AlertCircle,
  Clock,
  Activity,
  Globe,
  Shield,
  Zap,
  Database,
  Users,
  Settings,
  BarChart3,
  Download,
  Upload,
  Terminal,
  Monitor
} from 'lucide-react';

export default function AdminMicroservicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('services');

  // Sample microservices data
  const microservices = [
    {
      id: 'MS001',
      name: 'auth-service',
      version: '1.2.0',
      port: 8001,
      host: 'localhost',
      status: 'running',
      health: 'healthy',
      uptime: '99.8%',
      responseTime: 45,
      cpu: 23,
      memory: 45,
      disk: 12,
      lastDeployment: '2024-01-20 14:30:00',
      replicas: 2,
      environment: 'production',
      dependencies: ['database', 'redis'],
      endpoints: 12,
      requests: 15420,
      errors: 23,
      description: 'Authentication and authorization service',
      team: 'Backend Team',
      owner: 'john.doe@etuna.com'
    },
    {
      id: 'MS002',
      name: 'booking-service',
      version: '1.1.5',
      port: 8002,
      host: 'localhost',
      status: 'running',
      health: 'healthy',
      uptime: '99.5%',
      responseTime: 78,
      cpu: 34,
      memory: 67,
      disk: 18,
      lastDeployment: '2024-01-19 16:45:00',
      replicas: 3,
      environment: 'production',
      dependencies: ['database', 'payment-service'],
      endpoints: 18,
      requests: 8950,
      errors: 12,
      description: 'Room booking and reservation management',
      team: 'Backend Team',
      owner: 'jane.smith@etuna.com'
    },
    {
      id: 'MS003',
      name: 'payment-service',
      version: '1.3.2',
      port: 8003,
      host: 'localhost',
      status: 'running',
      health: 'warning',
      uptime: '98.2%',
      responseTime: 156,
      cpu: 67,
      memory: 89,
      disk: 25,
      lastDeployment: '2024-01-18 10:15:00',
      replicas: 2,
      environment: 'production',
      dependencies: ['database', 'gateway'],
      endpoints: 15,
      requests: 6780,
      errors: 45,
      description: 'Payment processing and transaction management',
      team: 'Payment Team',
      owner: 'mike.wilson@etuna.com'
    },
    {
      id: 'MS004',
      name: 'notification-service',
      version: '1.0.8',
      port: 8004,
      host: 'localhost',
      status: 'stopped',
      health: 'unhealthy',
      uptime: '95.1%',
      responseTime: 234,
      cpu: 89,
      memory: 95,
      disk: 45,
      lastDeployment: '2024-01-15 09:30:00',
      replicas: 1,
      environment: 'production',
      dependencies: ['database', 'email-service'],
      endpoints: 8,
      requests: 3240,
      errors: 89,
      description: 'Email and SMS notification service',
      team: 'Communication Team',
      owner: 'sarah.jones@etuna.com'
    },
    {
      id: 'MS005',
      name: 'analytics-service',
      version: '2.0.1',
      port: 8005,
      host: 'localhost',
      status: 'running',
      health: 'healthy',
      uptime: '99.9%',
      responseTime: 32,
      cpu: 12,
      memory: 34,
      disk: 8,
      lastDeployment: '2024-01-20 11:20:00',
      replicas: 2,
      environment: 'production',
      dependencies: ['database', 'cache'],
      endpoints: 22,
      requests: 12300,
      errors: 5,
      description: 'Business analytics and reporting service',
      team: 'Analytics Team',
      owner: 'david.brown@etuna.com'
    }
  ];

  const environments = [
    { name: 'Production', count: 5, color: 'bg-red-500' },
    { name: 'Staging', count: 3, color: 'bg-yellow-500' },
    { name: 'Development', count: 2, color: 'bg-green-500' },
    { name: 'Testing', count: 1, color: 'bg-blue-500' }
  ];

  const teams = [
    { name: 'Backend Team', count: 2, color: 'bg-blue-500' },
    { name: 'Payment Team', count: 1, color: 'bg-green-500' },
    { name: 'Communication Team', count: 1, color: 'bg-purple-500' },
    { name: 'Analytics Team', count: 1, color: 'bg-orange-500' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-success bg-success/10';
      case 'stopped':
        return 'text-error bg-error/10';
      case 'starting':
        return 'text-warning bg-warning/10';
      case 'stopping':
        return 'text-warning bg-warning/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return Play;
      case 'stopped':
        return Pause;
      case 'starting':
        return Clock;
      case 'stopping':
        return Clock;
      default:
        return Server;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'text-success bg-success/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      case 'unhealthy':
        return 'text-error bg-error/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy':
        return CheckCircle;
      case 'warning':
        return AlertCircle;
      case 'unhealthy':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getResourceColor = (value: number, type: string) => {
    if (type === 'cpu' || type === 'memory') {
      if (value > 80) return 'text-error';
      if (value > 60) return 'text-warning';
      return 'text-success';
    }
    return 'text-base-content';
  };

  const filteredMicroservices = microservices.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'services', label: 'Services', icon: Server },
    { id: 'environments', label: 'Environments', icon: Globe },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'monitoring', label: 'Monitoring', icon: Monitor },
    { id: 'deployments', label: 'Deployments', icon: Upload }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Microservices Administration"
        description="Manage microservices, deployments, monitoring, and system administration"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Admin', href: '/admin' },
          { label: 'Microservices', href: '/admin/microservices' }
        ]}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="tabs tabs-boxed">
                {tabs.map((tab) => {
                  const TabIcon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <TabIcon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <ActionButton variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </ActionButton>
                <ActionButton>
                  <Plus className="w-4 h-4 mr-2" />
                  Deploy Service
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Services Tab */}
        {activeTab === 'services' && (
          <>
            {/* Search and Filter */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="form-control flex-1">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search microservices..."
                        className="input input-bordered w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button className="btn btn-square">
                        <Search className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <select
                    className="select select-bordered w-full md:w-40"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="running">Running</option>
                    <option value="stopped">Stopped</option>
                    <option value="starting">Starting</option>
                    <option value="stopping">Stopping</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Microservices Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredMicroservices.map((service) => {
                const StatusIcon = getStatusIcon(service.status);
                const HealthIcon = getHealthIcon(service.health);
                return (
                  <div key={service.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="card-title text-lg">{service.name}</h3>
                          <p className="text-sm text-base-content/70">v{service.version}</p>
                          <p className="text-sm font-semibold">{service.host}:{service.port}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className={`badge ${getStatusColor(service.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                          </div>
                          <div className={`badge ${getHealthColor(service.health)}`}>
                            <HealthIcon className="w-3 h-3 mr-1" />
                            {service.health.charAt(0).toUpperCase() + service.health.slice(1)}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center space-x-3">
                          <Database className="w-4 h-4 text-primary" />
                          <span className="text-sm">{service.environment}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-sm">{service.team}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Activity className="w-4 h-4 text-primary" />
                          <span className="text-sm">{service.uptime} uptime</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">CPU</p>
                          <p className={`font-semibold ${getResourceColor(service.cpu, 'cpu')}`}>
                            {service.cpu}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Memory</p>
                          <p className={`font-semibold ${getResourceColor(service.memory, 'memory')}`}>
                            {service.memory}%
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Replicas</p>
                          <p className="font-semibold">{service.replicas}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Response Time</p>
                          <p className="font-semibold">{service.responseTime}ms</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Dependencies</p>
                        <div className="flex flex-wrap gap-1">
                          {service.dependencies.map((dep, index) => (
                            <span key={index} className="badge badge-outline badge-sm">
                              {dep}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-1">Description</p>
                        <p className="text-sm bg-base-200 p-2 rounded">{service.description}</p>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-base-content/70">
                          Owner: {service.owner}
                        </div>
                        <div className="text-sm text-base-content/70">
                          Deployed: {service.lastDeployment}
                        </div>
                      </div>

                      <div className="card-actions justify-end">
                        <button className="btn btn-ghost btn-sm">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <Settings className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <Terminal className="w-4 h-4" />
                        </button>
                        {service.status === 'running' ? (
                          <button className="btn btn-ghost btn-sm">
                            <Pause className="w-4 h-4" />
                          </button>
                        ) : (
                          <button className="btn btn-ghost btn-sm">
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Environments Tab */}
        {activeTab === 'environments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {environments.map((env, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-3 rounded-lg ${env.color} text-white`}>
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="card-title text-lg">{env.name}</h3>
                      <p className="text-sm text-base-content/70">{env.count} services</p>
                    </div>
                  </div>
                  <div className="card-actions justify-end">
                    <button className="btn btn-ghost btn-sm">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Teams Tab */}
        {activeTab === 'teams' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {teams.map((team, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-3 rounded-lg ${team.color} text-white`}>
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="card-title text-lg">{team.name}</h3>
                      <p className="text-sm text-base-content/70">{team.count} services</p>
                    </div>
                  </div>
                  <div className="card-actions justify-end">
                    <button className="btn btn-ghost btn-sm">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Monitoring Tab */}
        {activeTab === 'monitoring' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">System Health Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Services</span>
                    <span className="font-semibold">{microservices.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Running Services</span>
                    <span className="font-semibold text-success">
                      {microservices.filter(s => s.status === 'running').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Healthy Services</span>
                    <span className="font-semibold text-success">
                      {microservices.filter(s => s.health === 'healthy').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Warning Services</span>
                    <span className="font-semibold text-warning">
                      {microservices.filter(s => s.health === 'warning').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Unhealthy Services</span>
                    <span className="font-semibold text-error">
                      {microservices.filter(s => s.health === 'unhealthy').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Resource Usage</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average CPU Usage</span>
                    <span className="font-semibold">
                      {Math.round(microservices.reduce((sum, s) => sum + s.cpu, 0) / microservices.length)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Memory Usage</span>
                    <span className="font-semibold">
                      {Math.round(microservices.reduce((sum, s) => sum + s.memory, 0) / microservices.length)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Response Time</span>
                    <span className="font-semibold">
                      {Math.round(microservices.reduce((sum, s) => sum + s.responseTime, 0) / microservices.length)}ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Requests</span>
                    <span className="font-semibold">
                      {microservices.reduce((sum, s) => sum + s.requests, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Errors</span>
                    <span className="font-semibold text-error">
                      {microservices.reduce((sum, s) => sum + s.errors, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-blue-500 text-white">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Services</p>
                  <p className="text-2xl font-bold">{microservices.length}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-green-500 text-white">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Running Services</p>
                  <p className="text-2xl font-bold">
                    {microservices.filter(s => s.status === 'running').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-purple-500 text-white">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Requests</p>
                  <p className="text-2xl font-bold">
                    {microservices.reduce((sum, s) => sum + s.requests, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Avg Response Time</p>
                  <p className="text-2xl font-bold">
                    {Math.round(microservices.reduce((sum, s) => sum + s.responseTime, 0) / microservices.length)}ms
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
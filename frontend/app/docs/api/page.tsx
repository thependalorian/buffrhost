"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Download,
  Code,
  Globe,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  FileText,
  Zap,
  Database,
  Server,
  Users,
  Settings,
  BarChart3
} from 'lucide-react';

export default function APIDocumentationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('endpoints');

  // Sample API endpoints data
  const endpoints = [
    {
      id: 'EP001',
      method: 'GET',
      path: '/api/v1/auth/profile',
      description: 'Get current user profile',
      category: 'Authentication',
      status: 'active',
      authentication: 'required',
      parameters: [
        { name: 'include', type: 'string', required: false, description: 'Include related data (roles, permissions)' }
      ],
      responses: [
        { code: 200, description: 'User profile retrieved successfully', example: '{ "id": "user_123", "email": "user@example.com", "name": "John Doe" }' },
        { code: 401, description: 'Unauthorized', example: '{ "error": "Invalid token" }' }
      ],
      rateLimit: '100/hour',
      lastUpdated: '2024-01-20'
    },
    {
      id: 'EP002',
      method: 'POST',
      path: '/api/v1/bookings',
      description: 'Create a new booking',
      category: 'Bookings',
      status: 'active',
      authentication: 'required',
      parameters: [
        { name: 'property_id', type: 'string', required: true, description: 'Property identifier' },
        { name: 'room_id', type: 'string', required: true, description: 'Room identifier' },
        { name: 'check_in', type: 'date', required: true, description: 'Check-in date' },
        { name: 'check_out', type: 'date', required: true, description: 'Check-out date' },
        { name: 'guests', type: 'integer', required: true, description: 'Number of guests' }
      ],
      responses: [
        { code: 201, description: 'Booking created successfully', example: '{ "id": "booking_123", "status": "confirmed", "total_amount": 1500 }' },
        { code: 400, description: 'Invalid request data', example: '{ "error": "Invalid dates" }' },
        { code: 401, description: 'Unauthorized', example: '{ "error": "Invalid token" }' }
      ],
      rateLimit: '50/hour',
      lastUpdated: '2024-01-19'
    },
    {
      id: 'EP003',
      method: 'GET',
      path: '/api/v1/payments/transactions',
      description: 'Get payment transactions',
      category: 'Payments',
      status: 'active',
      authentication: 'required',
      parameters: [
        { name: 'status', type: 'string', required: false, description: 'Filter by status (pending, completed, failed)' },
        { name: 'limit', type: 'integer', required: false, description: 'Number of results (max 100)' },
        { name: 'offset', type: 'integer', required: false, description: 'Offset for pagination' }
      ],
      responses: [
        { code: 200, description: 'Transactions retrieved successfully', example: '{ "transactions": [...], "total": 150, "limit": 20 }' },
        { code: 401, description: 'Unauthorized', example: '{ "error": "Invalid token" }' }
      ],
      rateLimit: '200/hour',
      lastUpdated: '2024-01-18'
    },
    {
      id: 'EP004',
      method: 'PUT',
      path: '/api/v1/notifications/templates/{id}',
      description: 'Update notification template',
      category: 'Notifications',
      status: 'active',
      authentication: 'admin',
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Template identifier' },
        { name: 'name', type: 'string', required: false, description: 'Template name' },
        { name: 'subject', type: 'string', required: false, description: 'Email subject' },
        { name: 'content', type: 'string', required: false, description: 'Template content' }
      ],
      responses: [
        { code: 200, description: 'Template updated successfully', example: '{ "id": "template_123", "name": "Welcome Email", "status": "active" }' },
        { code: 404, description: 'Template not found', example: '{ "error": "Template not found" }' },
        { code: 403, description: 'Insufficient permissions', example: '{ "error": "Admin access required" }' }
      ],
      rateLimit: '20/hour',
      lastUpdated: '2024-01-17'
    },
    {
      id: 'EP005',
      method: 'DELETE',
      path: '/api/v1/menu/items/{id}',
      description: 'Delete menu item',
      category: 'Menu',
      status: 'deprecated',
      authentication: 'admin',
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Menu item identifier' }
      ],
      responses: [
        { code: 204, description: 'Menu item deleted successfully' },
        { code: 404, description: 'Menu item not found', example: '{ "error": "Menu item not found" }' },
        { code: 403, description: 'Insufficient permissions', example: '{ "error": "Admin access required" }' }
      ],
      rateLimit: '10/hour',
      lastUpdated: '2024-01-16',
      deprecationNotice: 'This endpoint will be removed in v2.0. Use PATCH /api/v1/menu/items/{id} with status=deleted instead.'
    }
  ];

  const categories = [
    { name: 'Authentication', count: 1, color: 'bg-blue-500' },
    { name: 'Bookings', count: 1, color: 'bg-green-500' },
    { name: 'Payments', count: 1, color: 'bg-purple-500' },
    { name: 'Notifications', count: 1, color: 'bg-orange-500' },
    { name: 'Menu', count: 1, color: 'bg-red-500' }
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'badge-success';
      case 'POST':
        return 'badge-primary';
      case 'PUT':
        return 'badge-warning';
      case 'DELETE':
        return 'badge-error';
      case 'PATCH':
        return 'badge-info';
      default:
        return 'badge-base-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10';
      case 'deprecated':
        return 'text-warning bg-warning/10';
      case 'beta':
        return 'text-info bg-info/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return CheckCircle;
      case 'deprecated':
        return AlertCircle;
      case 'beta':
        return Clock;
      default:
        return Code;
    }
  };

  const getAuthColor = (auth: string) => {
    switch (auth) {
      case 'required':
        return 'badge-error';
      case 'admin':
        return 'badge-warning';
      case 'optional':
        return 'badge-info';
      case 'none':
        return 'badge-success';
      default:
        return 'badge-base-300';
    }
  };

  const filteredEndpoints = endpoints.filter(endpoint =>
    endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'endpoints', label: 'API Endpoints', icon: Code },
    { id: 'categories', label: 'Categories', icon: FileText },
    { id: 'authentication', label: 'Authentication', icon: Shield },
    { id: 'examples', label: 'Examples', icon: BookOpen }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="API Documentation"
        description="Comprehensive API documentation, endpoints, authentication, and examples"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Documentation', href: '/docs' },
          { label: 'API Documentation', href: '/docs/api' }
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
                  <Download className="w-4 h-4 mr-2" />
                  Download OpenAPI
                </ActionButton>
                <ActionButton>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Swagger
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Endpoints Tab */}
        {activeTab === 'endpoints' && (
          <>
            {/* Search and Filter */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="form-control flex-1">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search API endpoints..."
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
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="Authentication">Authentication</option>
                    <option value="Bookings">Bookings</option>
                    <option value="Payments">Payments</option>
                    <option value="Notifications">Notifications</option>
                    <option value="Menu">Menu</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Endpoints List */}
            <div className="space-y-6 mb-8">
              {filteredEndpoints.map((endpoint) => {
                const StatusIcon = getStatusIcon(endpoint.status);
                return (
                  <div key={endpoint.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Code className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <span className={`badge ${getMethodColor(endpoint.method)} badge-lg`}>
                                {endpoint.method}
                              </span>
                              <code className="text-lg font-mono bg-base-200 px-2 py-1 rounded">
                                {endpoint.path}
                              </code>
                            </div>
                            <h3 className="font-semibold text-lg">{endpoint.description}</h3>
                            <p className="text-sm text-base-content/70">{endpoint.category}</p>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className={`badge ${getStatusColor(endpoint.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {endpoint.status.charAt(0).toUpperCase() + endpoint.status.slice(1)}
                          </div>
                          <div className={`badge ${getAuthColor(endpoint.authentication)}`}>
                            {endpoint.authentication.charAt(0).toUpperCase() + endpoint.authentication.slice(1)}
                          </div>
                        </div>
                      </div>

                      {endpoint.deprecationNotice && (
                        <div className="alert alert-warning mb-4">
                          <AlertCircle className="w-5 h-5" />
                          <span>{endpoint.deprecationNotice}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Parameters */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center">
                            <Database className="w-4 h-4 mr-2" />
                            Parameters
                          </h4>
                          <div className="space-y-2">
                            {endpoint.parameters.map((param, index) => (
                              <div key={index} className="p-3 bg-base-200 rounded">
                                <div className="flex items-center justify-between mb-1">
                                  <code className="font-mono text-sm">{param.name}</code>
                                  <span className="badge badge-outline badge-sm">{param.type}</span>
                                </div>
                                <p className="text-sm text-base-content/70">{param.description}</p>
                                {param.required && (
                                  <span className="badge badge-error badge-xs mt-1">Required</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Responses */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center">
                            <Server className="w-4 h-4 mr-2" />
                            Responses
                          </h4>
                          <div className="space-y-2">
                            {endpoint.responses.map((response, index) => (
                              <div key={index} className="p-3 bg-base-200 rounded">
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`badge ${
                                    response.code >= 200 && response.code < 300 ? 'badge-success' :
                                    response.code >= 400 && response.code < 500 ? 'badge-error' :
                                    'badge-warning'
                                  } badge-sm`}>
                                    {response.code}
                                  </span>
                                </div>
                                <p className="text-sm text-base-content/70 mb-2">{response.description}</p>
                                {response.example && (
                                  <details className="text-xs">
                                    <summary className="cursor-pointer text-primary">View Example</summary>
                                    <pre className="mt-2 p-2 bg-base-300 rounded overflow-x-auto">
                                      {response.example}
                                    </pre>
                                  </details>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-base-content/70">
                          Rate Limit: {endpoint.rateLimit} | Last Updated: {endpoint.lastUpdated}
                        </div>
                        <div className="flex space-x-2">
                          <button className="btn btn-ghost btn-sm">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className="btn btn-ghost btn-sm">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button className="btn btn-ghost btn-sm">
                            <Zap className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {categories.map((category, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-3 rounded-lg ${category.color} text-white`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="card-title text-lg">{category.name}</h3>
                      <p className="text-sm text-base-content/70">{category.count} endpoints</p>
                    </div>
                  </div>
                  <div className="card-actions justify-end">
                    <button className="btn btn-ghost btn-sm">
                      <BookOpen className="w-4 h-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Authentication Tab */}
        {activeTab === 'authentication' && (
          <div className="space-y-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Authentication Methods</h3>
                <div className="space-y-6">
                  <div className="p-4 bg-base-200 rounded-lg">
                    <h4 className="font-semibold mb-2">JWT Token Authentication</h4>
                    <p className="text-sm text-base-content/70 mb-3">
                      Most endpoints require a valid JWT token in the Authorization header.
                    </p>
                    <div className="bg-base-300 p-3 rounded">
                      <code className="text-sm">
                        Authorization: Bearer your_jwt_token_here
                      </code>
                    </div>
                  </div>
                  <div className="p-4 bg-base-200 rounded-lg">
                    <h4 className="font-semibold mb-2">API Key Authentication</h4>
                    <p className="text-sm text-base-content/70 mb-3">
                      Some endpoints support API key authentication for service-to-service communication.
                    </p>
                    <div className="bg-base-300 p-3 rounded">
                      <code className="text-sm">
                        X-API-Key: your_api_key_here
                      </code>
                    </div>
                  </div>
                  <div className="p-4 bg-base-200 rounded-lg">
                    <h4 className="font-semibold mb-2">Rate Limiting</h4>
                    <p className="text-sm text-base-content/70 mb-3">
                      All endpoints have rate limits to ensure fair usage and system stability.
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-semibold">Standard</p>
                        <p>100 requests/hour</p>
                      </div>
                      <div>
                        <p className="font-semibold">Admin</p>
                        <p>500 requests/hour</p>
                      </div>
                      <div>
                        <p className="font-semibold">Premium</p>
                        <p>1000 requests/hour</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Examples Tab */}
        {activeTab === 'examples' && (
          <div className="space-y-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Code Examples</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">JavaScript/Node.js</h4>
                    <div className="bg-base-300 p-4 rounded">
                      <pre className="text-sm">
{`const response = await fetch('/api/v1/bookings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_jwt_token'
  },
  body: JSON.stringify({
    property_id: 'prop_123',
    room_id: 'room_456',
    check_in: '2024-02-01',
    check_out: '2024-02-03',
    guests: 2
  })
});

const booking = await response.json();`}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Python</h4>
                    <div className="bg-base-300 p-4 rounded">
                      <pre className="text-sm">
{`import requests

headers = {
    'Authorization': 'Bearer your_jwt_token',
    'Content-Type': 'application/json'
}

data = {
    'property_id': 'prop_123',
    'room_id': 'room_456',
    'check_in': '2024-02-01',
    'check_out': '2024-02-03',
    'guests': 2
}

response = requests.post(
    'https://api.etuna.com/v1/bookings',
    headers=headers,
    json=data
)

booking = response.json()`}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">cURL</h4>
                    <div className="bg-base-300 p-4 rounded">
                      <pre className="text-sm">
{`curl -X POST https://api.etuna.com/v1/bookings \\
  -H "Authorization: Bearer your_jwt_token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "property_id": "prop_123",
    "room_id": "room_456",
    "check_in": "2024-02-01",
    "check_out": "2024-02-03",
    "guests": 2
  }'`}
                      </pre>
                    </div>
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
                  <Code className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Endpoints</p>
                  <p className="text-2xl font-bold">{endpoints.length}</p>
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
                  <p className="text-sm text-base-content/70">Active</p>
                  <p className="text-2xl font-bold">
                    {endpoints.filter(e => e.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-purple-500 text-white">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Categories</p>
                  <p className="text-2xl font-bold">{categories.length}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Auth Required</p>
                  <p className="text-2xl font-bold">
                    {endpoints.filter(e => e.authentication === 'required').length}
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
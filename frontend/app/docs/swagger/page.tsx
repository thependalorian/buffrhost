"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  FileText, 
  Search, 
  Filter, 
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Zap,
  Globe,
  Shield,
  Settings,
  BarChart3,
  Copy,
  ExternalLink,
  TestTube,
  Activity,
  Database,
  Server,
  Lock,
  Unlock,
  Play,
  Pause,
  Timer,
  Users,
  Globe2,
  HardDrive,
  Wifi,
  Code,
  Layers,
  Filter as FilterIcon,
  
  Archive,
  Fingerprint,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  Building,
  Smartphone,
  Key,
  Mail,
  CreditCard,
  MapPin,
  Phone,
  MessageSquare,
  Cloud,
  Download,
  Upload,
  BookOpen,
  Terminal,
  PlayCircle,
  Square,
  RotateCcw,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  ChevronDown,
  Info,
  Bug,
  Tag
} from 'lucide-react';

export default function SwaggerDocumentationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('endpoints');
  const [expandedEndpoints, setExpandedEndpoints] = useState<Set<string>>(new Set());

  // Sample Swagger/OpenAPI data
  const apiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Etuna Guesthouse API',
      description: 'Comprehensive API for hospitality management',
      version: '1.0.0',
      contact: {
        name: 'API Support',
        email: 'api-support@etuna.com'
      }
    },
    servers: [
      { url: 'https://api.etuna.com/v1', description: 'Production server' },
      { url: 'https://staging-api.etuna.com/v1', description: 'Staging server' },
      { url: 'http://localhost:8000/v1', description: 'Development server' }
    ],
    paths: {
      '/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'User Login',
          description: 'Authenticate user and return JWT token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 8 }
                  },
                  required: ['email', 'password']
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      access_token: { type: 'string' },
                      refresh_token: { type: 'string' },
                      user: { $ref: '#/components/schemas/User' }
                    }
                  }
                }
              }
            },
            '401': { description: 'Invalid credentials' },
            '422': { description: 'Validation error' }
          }
        }
      },
      '/bookings': {
        get: {
          tags: ['Bookings'],
          summary: 'List Bookings',
          description: 'Retrieve list of bookings with filtering',
          parameters: [
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['confirmed', 'pending', 'cancelled'] } },
            { name: 'check_in', in: 'query', schema: { type: 'string', format: 'date' } },
            { name: 'check_out', in: 'query', schema: { type: 'string', format: 'date' } },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } }
          ],
          responses: {
            '200': {
              description: 'List of bookings',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: { type: 'array', items: { $ref: '#/components/schemas/Booking' } },
                      pagination: { $ref: '#/components/schemas/Pagination' }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Bookings'],
          summary: 'Create Booking',
          description: 'Create a new booking reservation',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateBookingRequest' }
              }
            }
          },
          responses: {
            '201': {
              description: 'Booking created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Booking' }
                }
              }
            },
            '400': { description: 'Bad request' },
            '422': { description: 'Validation error' }
          }
        }
      },
      '/bookings/{id}': {
        get: {
          tags: ['Bookings'],
          summary: 'Get Booking',
          description: 'Retrieve a specific booking by ID',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            '200': {
              description: 'Booking details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Booking' }
                }
              }
            },
            '404': { description: 'Booking not found' }
          }
        },
        put: {
          tags: ['Bookings'],
          summary: 'Update Booking',
          description: 'Update an existing booking',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateBookingRequest' }
              }
            }
          },
          responses: {
            '200': {
              description: 'Booking updated successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Booking' }
                }
              }
            },
            '404': { description: 'Booking not found' }
          }
        },
        delete: {
          tags: ['Bookings'],
          summary: 'Cancel Booking',
          description: 'Cancel a booking reservation',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            '204': { description: 'Booking cancelled successfully' },
            '404': { description: 'Booking not found' }
          }
        }
      },
      '/payments': {
        post: {
          tags: ['Payments'],
          summary: 'Process Payment',
          description: 'Process a payment for a booking',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    booking_id: { type: 'string' },
                    amount: { type: 'number', format: 'decimal' },
                    currency: { type: 'string', default: 'USD' },
                    payment_method: { type: 'string', enum: ['card', 'bank_transfer', 'cash'] },
                    card_details: {
                      type: 'object',
                      properties: {
                        number: { type: 'string' },
                        expiry_month: { type: 'integer' },
                        expiry_year: { type: 'integer' },
                        cvv: { type: 'string' }
                      }
                    }
                  },
                  required: ['booking_id', 'amount', 'payment_method']
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Payment processed successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Payment' }
                }
              }
            },
            '400': { description: 'Payment failed' },
            '422': { description: 'Validation error' }
          }
        }
      },
      '/notifications': {
        post: {
          tags: ['Notifications'],
          summary: 'Send Notification',
          description: 'Send notification to user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user_id: { type: 'string' },
                    type: { type: 'string', enum: ['email', 'sms', 'push'] },
                    subject: { type: 'string' },
                    message: { type: 'string' },
                    template_id: { type: 'string' }
                  },
                  required: ['user_id', 'type', 'message']
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Notification sent successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      notification_id: { type: 'string' },
                      status: { type: 'string', enum: ['sent', 'pending', 'failed'] }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'staff', 'guest'] },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Booking: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            guest_id: { type: 'string' },
            room_id: { type: 'string' },
            check_in: { type: 'string', format: 'date' },
            check_out: { type: 'string', format: 'date' },
            status: { type: 'string', enum: ['confirmed', 'pending', 'cancelled'] },
            total_amount: { type: 'number', format: 'decimal' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Payment: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            booking_id: { type: 'string' },
            amount: { type: 'number', format: 'decimal' },
            currency: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'completed', 'failed', 'refunded'] },
            payment_method: { type: 'string' },
            transaction_id: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
            limit: { type: 'integer' },
            total: { type: 'integer' },
            pages: { type: 'integer' }
          }
        }
      }
    }
  };

  const endpoints = [
    {
      path: '/auth/login',
      method: 'POST',
      summary: 'User Login',
      description: 'Authenticate user and return JWT token',
      tags: ['Authentication'],
      parameters: [],
      responses: [
        { code: '200', description: 'Login successful' },
        { code: '401', description: 'Invalid credentials' },
        { code: '422', description: 'Validation error' }
      ]
    },
    {
      path: '/bookings',
      method: 'GET',
      summary: 'List Bookings',
      description: 'Retrieve list of bookings with filtering',
      tags: ['Bookings'],
      parameters: [
        { name: 'status', type: 'string', required: false, description: 'Booking status filter' },
        { name: 'check_in', type: 'date', required: false, description: 'Check-in date filter' },
        { name: 'check_out', type: 'date', required: false, description: 'Check-out date filter' },
        { name: 'page', type: 'integer', required: false, description: 'Page number' },
        { name: 'limit', type: 'integer', required: false, description: 'Items per page' }
      ],
      responses: [
        { code: '200', description: 'List of bookings' }
      ]
    },
    {
      path: '/bookings',
      method: 'POST',
      summary: 'Create Booking',
      description: 'Create a new booking reservation',
      tags: ['Bookings'],
      parameters: [],
      responses: [
        { code: '201', description: 'Booking created successfully' },
        { code: '400', description: 'Bad request' },
        { code: '422', description: 'Validation error' }
      ]
    },
    {
      path: '/bookings/{id}',
      method: 'GET',
      summary: 'Get Booking',
      description: 'Retrieve a specific booking by ID',
      tags: ['Bookings'],
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Booking ID' }
      ],
      responses: [
        { code: '200', description: 'Booking details' },
        { code: '404', description: 'Booking not found' }
      ]
    },
    {
      path: '/bookings/{id}',
      method: 'PUT',
      summary: 'Update Booking',
      description: 'Update an existing booking',
      tags: ['Bookings'],
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Booking ID' }
      ],
      responses: [
        { code: '200', description: 'Booking updated successfully' },
        { code: '404', description: 'Booking not found' }
      ]
    },
    {
      path: '/bookings/{id}',
      method: 'DELETE',
      summary: 'Cancel Booking',
      description: 'Cancel a booking reservation',
      tags: ['Bookings'],
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Booking ID' }
      ],
      responses: [
        { code: '204', description: 'Booking cancelled successfully' },
        { code: '404', description: 'Booking not found' }
      ]
    },
    {
      path: '/payments',
      method: 'POST',
      summary: 'Process Payment',
      description: 'Process a payment for a booking',
      tags: ['Payments'],
      parameters: [],
      responses: [
        { code: '200', description: 'Payment processed successfully' },
        { code: '400', description: 'Payment failed' },
        { code: '422', description: 'Validation error' }
      ]
    },
    {
      path: '/notifications',
      method: 'POST',
      summary: 'Send Notification',
      description: 'Send notification to user',
      tags: ['Notifications'],
      parameters: [],
      responses: [
        { code: '200', description: 'Notification sent successfully' }
      ]
    }
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

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'GET':
        return Download;
      case 'POST':
        return Upload;
      case 'PUT':
        return Edit;
      case 'DELETE':
        return Trash2;
      case 'PATCH':
        return Edit;
      default:
        return Terminal;
    }
  };

  const filteredEndpoints = endpoints.filter(endpoint =>
    endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const tabs = [
    { id: 'endpoints', label: 'Endpoints', icon: Terminal },
    { id: 'schemas', label: 'Schemas', icon: FileText },
    { id: 'servers', label: 'Servers', icon: Server },
    { id: 'testing', label: 'Testing', icon: TestTube }
  ];

  const toggleEndpoint = (path: string) => {
    const newExpanded = new Set(expandedEndpoints);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedEndpoints(newExpanded);
  };

  const testEndpoint = (endpoint: any) => {
    // In a real app, this would open a testing interface
    console.log('Testing endpoint:', endpoint.path);
  };

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Swagger API Documentation"
        description="Interactive API documentation with Swagger/OpenAPI specification"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Documentation', href: '/docs' },
          { label: 'Swagger', href: '/docs/swagger' }
        ]}
      />

      <div className="container mx-auto px-4 py-8">
        {/* API Info */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">{apiSpec.info.title}</h2>
                <p className="text-base-content/70">{apiSpec.info.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="badge badge-outline">v{apiSpec.info.version}</span>
                  <span className="badge badge-outline">OpenAPI {apiSpec.openapi}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <ActionButton variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Spec
                </ActionButton>
                <ActionButton>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Swagger UI
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

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
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </ActionButton>
                <ActionButton>
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
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
                        placeholder="Search endpoints..."
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
                    value={methodFilter}
                    onChange={(e) => setMethodFilter(e.target.value)}
                  >
                    <option value="all">All Methods</option>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Endpoints List */}
            <div className="space-y-4 mb-8">
              {filteredEndpoints.map((endpoint) => {
                const MethodIcon = getMethodIcon(endpoint.method);
                const isExpanded = expandedEndpoints.has(endpoint.path);
                return (
                  <div key={`${endpoint.method}-${endpoint.path}`} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Terminal className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{endpoint.summary}</h3>
                            <p className="text-sm text-base-content/70">{endpoint.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="badge badge-outline badge-sm">
                                {endpoint.path}
                              </span>
                              <span className="badge badge-outline badge-sm">
                                {endpoint.tags.join(', ')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <span className={`badge ${getMethodColor(endpoint.method)}`}>
                            <MethodIcon className="w-3 h-3 mr-1" />
                            {endpoint.method}
                          </span>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => toggleEndpoint(endpoint.path)}
                          >
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="space-y-4">
                          {/* Parameters */}
                          {endpoint.parameters.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Parameters</h4>
                              <div className="overflow-x-auto">
                                <table className="table table-sm">
                                  <thead>
                                    <tr>
                                      <th>Name</th>
                                      <th>Type</th>
                                      <th>Required</th>
                                      <th>Description</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {endpoint.parameters.map((param, index) => (
                                      <tr key={index}>
                                        <td>
                                          <code className="bg-base-200 px-1 rounded">{param.name}</code>
                                        </td>
                                        <td>
                                          <span className="badge badge-outline badge-sm">{param.type}</span>
                                        </td>
                                        <td>
                                          <span className={`badge ${param.required ? 'badge-error' : 'badge-success'} badge-sm`}>
                                            {param.required ? 'Required' : 'Optional'}
                                          </span>
                                        </td>
                                        <td>{param.description}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Responses */}
                          <div>
                            <h4 className="font-semibold mb-2">Responses</h4>
                            <div className="space-y-2">
                              {endpoint.responses.map((response, index) => (
                                <div key={index} className="flex items-center space-x-4 p-2 bg-base-200 rounded">
                                  <span className="badge badge-outline">{response.code}</span>
                                  <span className="text-sm">{response.description}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Example Request */}
                          <div>
                            <h4 className="font-semibold mb-2">Example Request</h4>
                            <div className="bg-base-200 p-3 rounded">
                              <pre className="text-sm">
                                <code>
                                  {endpoint.method} {endpoint.path}
                                  {endpoint.method === 'POST' && '\nContent-Type: application/json\n\n{\n  "example": "data"\n}'}
                                </code>
                              </pre>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="card-actions justify-end mt-4">
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => testEndpoint(endpoint)}
                        >
                          <TestTube className="w-4 h-4 mr-2" />
                          Test Endpoint
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Schemas Tab */}
        {activeTab === 'schemas' && (
          <div className="space-y-4 mb-8">
            {Object.entries(apiSpec.components.schemas).map(([name, schema]: [string, any]) => (
              <div key={name} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{name}</h3>
                        <p className="text-sm text-base-content/70">Data model schema</p>
                      </div>
                    </div>
                    <span className="badge badge-outline">Schema</span>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Properties</h4>
                    <div className="overflow-x-auto">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Property</th>
                            <th>Type</th>
                            <th>Required</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(schema.properties || {}).map(([prop, propSchema]: [string, any]) => (
                            <tr key={prop}>
                              <td>
                                <code className="bg-base-200 px-1 rounded">{prop}</code>
                              </td>
                              <td>
                                <span className="badge badge-outline badge-sm">
                                  {propSchema.type || 'object'}
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${schema.required?.includes(prop) ? 'badge-error' : 'badge-success'} badge-sm`}>
                                  {schema.required?.includes(prop) ? 'Required' : 'Optional'}
                                </span>
                              </td>
                              <td>{propSchema.description || 'No description'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="card-actions justify-end">
                    <button className="btn btn-ghost btn-sm">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Servers Tab */}
        {activeTab === 'servers' && (
          <div className="space-y-4 mb-8">
            {apiSpec.servers.map((server, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Server className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{server.description}</h3>
                        <p className="text-sm text-base-content/70">
                          <code className="bg-base-200 px-1 rounded">{server.url}</code>
                        </p>
                      </div>
                    </div>
                    <span className="badge badge-outline">Server</span>
                  </div>

                  <div className="card-actions justify-end">
                    <button className="btn btn-ghost btn-sm">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <TestTube className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Testing Tab */}
        {activeTab === 'testing' && (
          <div className="space-y-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">API Testing Interface</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {endpoints.slice(0, 6).map((endpoint) => (
                    <div key={`${endpoint.method}-${endpoint.path}`} className="card bg-base-200">
                      <div className="card-body">
                        <h4 className="card-title text-lg">{endpoint.summary}</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Method</span>
                            <span className={`badge ${getMethodColor(endpoint.method)} badge-sm`}>
                              {endpoint.method}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Path</span>
                            <code className="text-xs bg-base-300 px-1 rounded">{endpoint.path}</code>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Tags</span>
                            <span className="text-xs">{endpoint.tags.join(', ')}</span>
                          </div>
                        </div>
                        <div className="card-actions justify-end mt-4">
                          <button className="btn btn-sm btn-primary">
                            <TestTube className="w-4 h-4 mr-2" />
                            Test
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
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
                  <Terminal className="w-6 h-6" />
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
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Schemas</p>
                  <p className="text-2xl font-bold">{Object.keys(apiSpec.components.schemas).length}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-purple-500 text-white">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Servers</p>
                  <p className="text-2xl font-bold">{apiSpec.servers.length}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Tags</p>
                  <p className="text-2xl font-bold">
                    {new Set(endpoints.flatMap(e => e.tags)).size}
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
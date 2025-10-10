"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  Terminal, 
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
  //  // Icon not available in lucide-react
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
  Book,
  ScrollText,
  Tag,
  Info,
  Bug,
  ChevronRight,
  ChevronDown,
  Minus,
  Plus,
  PlayCircle,
  Square,
  RotateCcw,
  Target,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export default function EndpointsDocumentationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('endpoints');
  const [expandedEndpoints, setExpandedEndpoints] = useState<Set<string>>(new Set());

  // Sample endpoints data
  const endpoints = [
    {
      id: 'auth-login',
      path: '/auth/login',
      method: 'POST',
      summary: 'User Login',
      description: 'Authenticate user and return JWT token',
      tags: ['Authentication'],
      authentication: 'none',
      rateLimit: '10/minute',
      parameters: [],
      requestBody: {
        required: true,
        contentType: 'application/json',
        schema: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email', description: 'User email address' },
            password: { type: 'string', minLength: 8, description: 'User password' }
          },
          required: ['email', 'password']
        }
      },
      responses: [
        {
          code: 200,
          description: 'Login successful',
          contentType: 'application/json',
          schema: {
            type: 'object',
            properties: {
              access_token: { type: 'string', description: 'JWT access token' },
              refresh_token: { type: 'string', description: 'JWT refresh token' },
              user: { $ref: '#/components/schemas/User' }
            }
          }
        },
        { code: 401, description: 'Invalid credentials' },
        { code: 422, description: 'Validation error' }
      ],
      examples: [
        {
          title: 'Successful Login',
          request: {
            email: 'user@example.com',
            password: 'password123'
          },
          response: {
            access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            user: {
              id: 'user_123',
              email: 'user@example.com',
              first_name: 'John',
              last_name: 'Doe'
            }
          }
        }
      ]
    },
    {
      id: 'bookings-list',
      path: '/bookings',
      method: 'GET',
      summary: 'List Bookings',
      description: 'Retrieve list of bookings with filtering and pagination',
      tags: ['Bookings'],
      authentication: 'required',
      rateLimit: '100/hour',
      parameters: [
        { name: 'status', in: 'query', type: 'string', required: false, description: 'Filter by booking status', enum: ['confirmed', 'pending', 'cancelled'] },
        { name: 'check_in', in: 'query', type: 'date', required: false, description: 'Filter by check-in date' },
        { name: 'check_out', in: 'query', type: 'date', required: false, description: 'Filter by check-out date' },
        { name: 'guest_id', in: 'query', type: 'string', required: false, description: 'Filter by guest ID' },
        { name: 'page', in: 'query', type: 'integer', required: false, description: 'Page number for pagination', default: 1 },
        { name: 'limit', in: 'query', type: 'integer', required: false, description: 'Items per page', default: 20 }
      ],
      requestBody: null,
      responses: [
        {
          code: 200,
          description: 'List of bookings',
          contentType: 'application/json',
          schema: {
            type: 'object',
            properties: {
              data: { type: 'array', items: { $ref: '#/components/schemas/Booking' } },
              pagination: { $ref: '#/components/schemas/Pagination' }
            }
          }
        },
        { code: 401, description: 'Unauthorized' },
        { code: 403, description: 'Forbidden' }
      ],
      examples: [
        {
          title: 'Get All Bookings',
          request: {},
          response: {
            data: [
              {
                id: 'booking_123',
                guest_id: 'guest_456',
                room_id: 'room_789',
                check_in: '2024-01-20',
                check_out: '2024-01-25',
                status: 'confirmed',
                total_amount: 500.00
              }
            ],
            pagination: {
              page: 1,
              limit: 20,
              total: 1,
              pages: 1
            }
          }
        }
      ]
    },
    {
      id: 'bookings-create',
      path: '/bookings',
      method: 'POST',
      summary: 'Create Booking',
      description: 'Create a new booking reservation',
      tags: ['Bookings'],
      authentication: 'required',
      rateLimit: '50/hour',
      parameters: [],
      requestBody: {
        required: true,
        contentType: 'application/json',
        schema: {
          type: 'object',
          properties: {
            guest_id: { type: 'string', description: 'Guest identifier' },
            room_id: { type: 'string', description: 'Room identifier' },
            check_in: { type: 'string', format: 'date', description: 'Check-in date' },
            check_out: { type: 'string', format: 'date', description: 'Check-out date' },
            guests: { type: 'integer', minimum: 1, description: 'Number of guests' },
            special_requests: { type: 'string', description: 'Special requests or notes' }
          },
          required: ['guest_id', 'room_id', 'check_in', 'check_out', 'guests']
        }
      },
      responses: [
        {
          code: 201,
          description: 'Booking created successfully',
          contentType: 'application/json',
          schema: { $ref: '#/components/schemas/Booking' }
        },
        { code: 400, description: 'Bad request' },
        { code: 401, description: 'Unauthorized' },
        { code: 422, description: 'Validation error' }
      ],
      examples: [
        {
          title: 'Create New Booking',
          request: {
            guest_id: 'guest_456',
            room_id: 'room_789',
            check_in: '2024-01-20',
            check_out: '2024-01-25',
            guests: 2,
            special_requests: 'Late check-in requested'
          },
          response: {
            id: 'booking_123',
            guest_id: 'guest_456',
            room_id: 'room_789',
            check_in: '2024-01-20',
            check_out: '2024-01-25',
            status: 'confirmed',
            total_amount: 500.00,
            created_at: '2024-01-15T10:30:00Z'
          }
        }
      ]
    },
    {
      id: 'bookings-get',
      path: '/bookings/{id}',
      method: 'GET',
      summary: 'Get Booking',
      description: 'Retrieve a specific booking by ID',
      tags: ['Bookings'],
      authentication: 'required',
      rateLimit: '200/hour',
      parameters: [
        { name: 'id', in: 'path', type: 'string', required: true, description: 'Booking identifier' }
      ],
      requestBody: null,
      responses: [
        {
          code: 200,
          description: 'Booking details',
          contentType: 'application/json',
          schema: { $ref: '#/components/schemas/Booking' }
        },
        { code: 401, description: 'Unauthorized' },
        { code: 404, description: 'Booking not found' }
      ],
      examples: [
        {
          title: 'Get Booking Details',
          request: { id: 'booking_123' },
          response: {
            id: 'booking_123',
            guest_id: 'guest_456',
            room_id: 'room_789',
            check_in: '2024-01-20',
            check_out: '2024-01-25',
            status: 'confirmed',
            total_amount: 500.00,
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-01-15T10:30:00Z'
          }
        }
      ]
    },
    {
      id: 'payments-process',
      path: '/payments',
      method: 'POST',
      summary: 'Process Payment',
      description: 'Process a payment for a booking',
      tags: ['Payments'],
      authentication: 'required',
      rateLimit: '30/hour',
      parameters: [],
      requestBody: {
        required: true,
        contentType: 'application/json',
        schema: {
          type: 'object',
          properties: {
            booking_id: { type: 'string', description: 'Booking identifier' },
            amount: { type: 'number', format: 'decimal', description: 'Payment amount' },
            currency: { type: 'string', default: 'USD', description: 'Payment currency' },
            payment_method: { type: 'string', enum: ['card', 'bank_transfer', 'cash'], description: 'Payment method' },
            card_details: {
              type: 'object',
              properties: {
                number: { type: 'string', description: 'Card number' },
                expiry_month: { type: 'integer', minimum: 1, maximum: 12, description: 'Expiry month' },
                expiry_year: { type: 'integer', description: 'Expiry year' },
                cvv: { type: 'string', description: 'Card CVV' }
              }
            }
          },
          required: ['booking_id', 'amount', 'payment_method']
        }
      },
      responses: [
        {
          code: 200,
          description: 'Payment processed successfully',
          contentType: 'application/json',
          schema: { $ref: '#/components/schemas/Payment' }
        },
        { code: 400, description: 'Payment failed' },
        { code: 401, description: 'Unauthorized' },
        { code: 422, description: 'Validation error' }
      ],
      examples: [
        {
          title: 'Process Card Payment',
          request: {
            booking_id: 'booking_123',
            amount: 500.00,
            currency: 'USD',
            payment_method: 'card',
            card_details: {
              number: '4111111111111111',
              expiry_month: 12,
              expiry_year: 2025,
              cvv: '123'
            }
          },
          response: {
            id: 'payment_456',
            booking_id: 'booking_123',
            amount: 500.00,
            currency: 'USD',
            status: 'completed',
            payment_method: 'card',
            transaction_id: 'txn_789',
            created_at: '2024-01-15T11:00:00Z'
          }
        }
      ]
    },
    {
      id: 'notifications-send',
      path: '/notifications',
      method: 'POST',
      summary: 'Send Notification',
      description: 'Send notification to user via email, SMS, or push',
      tags: ['Notifications'],
      authentication: 'required',
      rateLimit: '100/hour',
      parameters: [],
      requestBody: {
        required: true,
        contentType: 'application/json',
        schema: {
          type: 'object',
          properties: {
            user_id: { type: 'string', description: 'User identifier' },
            type: { type: 'string', enum: ['email', 'sms', 'push'], description: 'Notification type' },
            subject: { type: 'string', description: 'Notification subject' },
            message: { type: 'string', description: 'Notification message' },
            template_id: { type: 'string', description: 'Template identifier' },
            variables: { type: 'object', description: 'Template variables' }
          },
          required: ['user_id', 'type', 'message']
        }
      },
      responses: [
        {
          code: 200,
          description: 'Notification sent successfully',
          contentType: 'application/json',
          schema: {
            type: 'object',
            properties: {
              notification_id: { type: 'string', description: 'Notification identifier' },
              status: { type: 'string', enum: ['sent', 'pending', 'failed'], description: 'Delivery status' }
            }
          }
        },
        { code: 400, description: 'Bad request' },
        { code: 401, description: 'Unauthorized' }
      ],
      examples: [
        {
          title: 'Send Email Notification',
          request: {
            user_id: 'user_123',
            type: 'email',
            subject: 'Booking Confirmation',
            message: 'Your booking has been confirmed',
            template_id: 'booking_confirmation'
          },
          response: {
            notification_id: 'notif_456',
            status: 'sent'
          }
        }
      ]
    }
  ];

  const tags = [
    { name: 'Authentication', count: 1, color: 'text-error bg-error/10' },
    { name: 'Bookings', count: 3, color: 'text-primary bg-primary/10' },
    { name: 'Payments', count: 1, color: 'text-success bg-success/10' },
    { name: 'Notifications', count: 1, color: 'text-info bg-info/10' }
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

  const getAuthColor = (auth: string) => {
    switch (auth) {
      case 'required':
        return 'text-error bg-error/10';
      case 'optional':
        return 'text-warning bg-warning/10';
      case 'none':
        return 'text-success bg-success/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getAuthIcon = (auth: string) => {
    switch (auth) {
      case 'required':
        return Lock;
      case 'optional':
        return Unlock;
      case 'none':
        return Globe;
      default:
        return Shield;
    }
  };

  const filteredEndpoints = endpoints.filter(endpoint =>
    endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  ).filter(endpoint =>
    methodFilter === 'all' || endpoint.method === methodFilter
  ).filter(endpoint =>
    tagFilter === 'all' || endpoint.tags.includes(tagFilter)
  );

  const tabs = [
    { id: 'endpoints', label: 'Endpoints', icon: Terminal },
    { id: 'tags', label: 'Tags', icon: Tag },
    { id: 'testing', label: 'Testing', icon: TestTube },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const toggleEndpoint = (id: string) => {
    const newExpanded = new Set(expandedEndpoints);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
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
        title="API Endpoints Documentation"
        description="Complete API endpoint reference with examples and testing tools"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Documentation', href: '/docs' },
          { label: 'Endpoints', href: '/docs/endpoints' }
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
                  <select
                    className="select select-bordered w-full md:w-40"
                    value={tagFilter}
                    onChange={(e) => setTagFilter(e.target.value)}
                  >
                    <option value="all">All Tags</option>
                    {tags.map((tag) => (
                      <option key={tag.name} value={tag.name}>{tag.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Endpoints List */}
            <div className="space-y-4 mb-8">
              {filteredEndpoints.map((endpoint) => {
                const MethodIcon = getMethodIcon(endpoint.method);
                const AuthIcon = getAuthIcon(endpoint.authentication);
                const isExpanded = expandedEndpoints.has(endpoint.id);
                return (
                  <div key={endpoint.id} className="card bg-base-100 shadow-xl">
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
                          <div className={`badge ${getAuthColor(endpoint.authentication)}`}>
                            <AuthIcon className="w-3 h-3 mr-1" />
                            {endpoint.authentication.charAt(0).toUpperCase() + endpoint.authentication.slice(1)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Rate Limit</p>
                          <p className="font-semibold">{endpoint.rateLimit}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Authentication</p>
                          <div className={`badge ${getAuthColor(endpoint.authentication)} badge-sm`}>
                            <AuthIcon className="w-3 h-3 mr-1" />
                            {endpoint.authentication.charAt(0).toUpperCase() + endpoint.authentication.slice(1)}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Parameters</p>
                          <p className="font-semibold">{endpoint.parameters.length}</p>
                        </div>
                      </div>

                      <button
                        className="btn btn-ghost btn-sm mb-4"
                        onClick={() => toggleEndpoint(endpoint.id)}
                      >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        {isExpanded ? 'Hide Details' : 'Show Details'}
                      </button>

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
                                      <th>In</th>
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
                                          <span className="badge badge-outline badge-sm">{param.in}</span>
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

                          {/* Request Body */}
                          {endpoint.requestBody && (
                            <div>
                              <h4 className="font-semibold mb-2">Request Body</h4>
                              <div className="p-3 bg-base-200 rounded">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">{endpoint.requestBody.contentType}</span>
                                  <span className={`badge ${endpoint.requestBody.required ? 'badge-error' : 'badge-success'} badge-sm`}>
                                    {endpoint.requestBody.required ? 'Required' : 'Optional'}
                                  </span>
                                </div>
                                <pre className="text-sm overflow-x-auto">
                                  <code>{JSON.stringify(endpoint.requestBody.schema, null, 2)}</code>
                                </pre>
                              </div>
                            </div>
                          )}

                          {/* Responses */}
                          <div>
                            <h4 className="font-semibold mb-2">Responses</h4>
                            <div className="space-y-2">
                              {endpoint.responses.map((response, index) => (
                                <div key={index} className="p-3 bg-base-200 rounded">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="badge badge-outline">{response.code}</span>
                                    <span className="text-sm">{response.description}</span>
                                  </div>
                                  {response.contentType && (
                                    <div className="text-sm text-base-content/70 mb-2">
                                      Content-Type: {response.contentType}
                                    </div>
                                  )}
                                  {response.schema && (
                                    <pre className="text-xs overflow-x-auto">
                                      <code>{JSON.stringify(response.schema, null, 2)}</code>
                                    </pre>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Examples */}
                          {endpoint.examples.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Examples</h4>
                              <div className="space-y-3">
                                {endpoint.examples.map((example, index) => (
                                  <div key={index} className="p-3 bg-base-200 rounded">
                                    <h5 className="font-medium mb-2">{example.title}</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div>
                                        <h6 className="text-sm font-medium mb-1">Request</h6>
                                        <pre className="text-xs bg-base-300 p-2 rounded overflow-x-auto">
                                          <code>{JSON.stringify(example.request, null, 2)}</code>
                                        </pre>
                                      </div>
                                      <div>
                                        <h6 className="text-sm font-medium mb-1">Response</h6>
                                        <pre className="text-xs bg-base-300 p-2 rounded overflow-x-auto">
                                          <code>{JSON.stringify(example.response, null, 2)}</code>
                                        </pre>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
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

        {/* Tags Tab */}
        {activeTab === 'tags' && (
          <div className="space-y-4 mb-8">
            {tags.map((tag, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Tag className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{tag.name}</h3>
                        <p className="text-sm text-base-content/70">
                          {tag.count} endpoint{tag.count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className={`badge ${tag.color}`}>
                      <Tag className="w-3 h-3 mr-1" />
                      {tag.name}
                    </div>
                  </div>

                  <div className="card-actions justify-end">
                    <button className="btn btn-ghost btn-sm">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="btn btn-primary btn-sm">
                      <TestTube className="w-4 h-4 mr-2" />
                      Test All
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
                  {endpoints.map((endpoint) => (
                    <div key={endpoint.id} className="card bg-base-200">
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
                            <span className="text-sm">Auth</span>
                            <div className={`badge ${getAuthColor(endpoint.authentication)} badge-sm`}>
                              {endpoint.authentication.charAt(0).toUpperCase() + endpoint.authentication.slice(1)}
                            </div>
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

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Endpoint Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Endpoints</span>
                    <span className="font-semibold">{endpoints.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">GET Endpoints</span>
                    <span className="font-semibold text-success">
                      {endpoints.filter(e => e.method === 'GET').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">POST Endpoints</span>
                    <span className="font-semibold text-primary">
                      {endpoints.filter(e => e.method === 'POST').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">PUT Endpoints</span>
                    <span className="font-semibold text-warning">
                      {endpoints.filter(e => e.method === 'PUT').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">DELETE Endpoints</span>
                    <span className="font-semibold text-error">
                      {endpoints.filter(e => e.method === 'DELETE').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Authentication Distribution</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Authentication Required</span>
                    <span className="font-semibold text-error">
                      {endpoints.filter(e => e.authentication === 'required').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Authentication Optional</span>
                    <span className="font-semibold text-warning">
                      {endpoints.filter(e => e.authentication === 'optional').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">No Authentication</span>
                    <span className="font-semibold text-success">
                      {endpoints.filter(e => e.authentication === 'none').length}
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
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Tags</p>
                  <p className="text-2xl font-bold">{tags.length}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-purple-500 text-white">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Auth Required</p>
                  <p className="text-2xl font-bold text-error">
                    {endpoints.filter(e => e.authentication === 'required').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <TestTube className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Testable</p>
                  <p className="text-2xl font-bold">{endpoints.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
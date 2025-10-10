"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  BookOpen, 
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
  Tag,
  FileText,
  Book,
  ScrollText
} from 'lucide-react';

export default function ReDocDocumentationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  // Sample ReDoc documentation data
  const documentation = {
    title: 'Etuna Guesthouse API Documentation',
    version: '1.0.0',
    description: 'Comprehensive API documentation for hospitality management system',
    sections: [
      {
        id: 'getting-started',
        title: 'Getting Started',
        description: 'Quick start guide for API integration',
        content: [
          {
            type: 'text',
            content: 'Welcome to the Etuna Guesthouse API! This documentation will help you integrate with our hospitality management system.'
          },
          {
            type: 'code',
            language: 'bash',
            content: 'curl -X GET "https://api.etuna.com/v1/bookings" \\\n  -H "Authorization: Bearer YOUR_TOKEN"'
          },
          {
            type: 'text',
            content: 'All API requests must include your API key in the Authorization header.'
          }
        ]
      },
      {
        id: 'authentication',
        title: 'Authentication',
        description: 'API authentication methods and security',
        content: [
          {
            type: 'text',
            content: 'The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header.'
          },
          {
            type: 'code',
            language: 'javascript',
            content: 'const response = await fetch(\'https://api.etuna.com/v1/bookings\', {\n  headers: {\n    \'Authorization\': \'Bearer YOUR_JWT_TOKEN\',\n    \'Content-Type\': \'application/json\'\n  }\n});'
          }
        ]
      },
      {
        id: 'endpoints',
        title: 'API Endpoints',
        description: 'Complete list of available API endpoints',
        content: [
          {
            type: 'endpoint',
            method: 'GET',
            path: '/bookings',
            description: 'Retrieve list of bookings',
            parameters: [
              { name: 'status', type: 'string', required: false, description: 'Filter by booking status' },
              { name: 'page', type: 'integer', required: false, description: 'Page number for pagination' }
            ],
            responses: [
              { code: 200, description: 'Success', example: '{ "data": [...], "pagination": {...} }' },
              { code: 401, description: 'Unauthorized' }
            ]
          },
          {
            type: 'endpoint',
            method: 'POST',
            path: '/bookings',
            description: 'Create a new booking',
            parameters: [],
            responses: [
              { code: 201, description: 'Booking created', example: '{ "id": "123", "status": "confirmed" }' },
              { code: 400, description: 'Bad request' }
            ]
          }
        ]
      },
      {
        id: 'models',
        title: 'Data Models',
        description: 'API data models and schemas',
        content: [
          {
            type: 'model',
            name: 'Booking',
            description: 'Booking reservation model',
            fields: [
              { name: 'id', type: 'string', required: true, description: 'Unique booking identifier' },
              { name: 'guest_id', type: 'string', required: true, description: 'Guest identifier' },
              { name: 'room_id', type: 'string', required: true, description: 'Room identifier' },
              { name: 'check_in', type: 'date', required: true, description: 'Check-in date' },
              { name: 'check_out', type: 'date', required: true, description: 'Check-out date' },
              { name: 'status', type: 'string', required: true, description: 'Booking status' },
              { name: 'total_amount', type: 'number', required: true, description: 'Total booking amount' }
            ]
          },
          {
            type: 'model',
            name: 'User',
            description: 'User account model',
            fields: [
              { name: 'id', type: 'string', required: true, description: 'Unique user identifier' },
              { name: 'email', type: 'string', required: true, description: 'User email address' },
              { name: 'first_name', type: 'string', required: true, description: 'User first name' },
              { name: 'last_name', type: 'string', required: true, description: 'User last name' },
              { name: 'role', type: 'string', required: true, description: 'User role' }
            ]
          }
        ]
      },
      {
        id: 'examples',
        title: 'Code Examples',
        description: 'Practical code examples for common operations',
        content: [
          {
            type: 'example',
            title: 'Create Booking',
            language: 'javascript',
            description: 'Example of creating a new booking',
            code: `const createBooking = async (bookingData) => {
  const response = await fetch('https://api.etuna.com/v1/bookings', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookingData)
  });
  
  if (!response.ok) {
    throw new Error('Failed to create booking');
  }
  
  return await response.json();
};`
          },
          {
            type: 'example',
            title: 'List Bookings',
            language: 'python',
            description: 'Example of retrieving bookings with Python',
            code: `import requests

def get_bookings(token, status=None, page=1):
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    params = {'page': page}
    if status:
        params['status'] = status
    
    response = requests.get(
        'https://api.etuna.com/v1/bookings',
        headers=headers,
        params=params
    )
    
    response.raise_for_status()
    return response.json()`
          }
        ]
      },
      {
        id: 'errors',
        title: 'Error Handling',
        description: 'API error codes and handling',
        content: [
          {
            type: 'error',
            code: 400,
            name: 'Bad Request',
            description: 'The request was invalid or cannot be served',
            example: '{ "error": "Invalid request parameters", "code": 400 }'
          },
          {
            type: 'error',
            code: 401,
            name: 'Unauthorized',
            description: 'Authentication required or failed',
            example: '{ "error": "Invalid or missing authentication token", "code": 401 }'
          },
          {
            type: 'error',
            code: 404,
            name: 'Not Found',
            description: 'The requested resource was not found',
            example: '{ "error": "Resource not found", "code": 404 }'
          },
          {
            type: 'error',
            code: 422,
            name: 'Unprocessable Entity',
            description: 'The request was well-formed but contains semantic errors',
            example: '{ "error": "Validation failed", "code": 422, "details": {...} }'
          },
          {
            type: 'error',
            code: 500,
            name: 'Internal Server Error',
            description: 'An internal server error occurred',
            example: '{ "error": "Internal server error", "code": 500 }'
          }
        ]
      }
    ]
  };

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

  const filteredSections = documentation.sections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'sections', label: 'Sections', icon: ScrollText },
    { id: 'examples', label: 'Examples', icon: Code },
    { id: 'reference', label: 'Reference', icon: Book }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="ReDoc API Documentation"
        description="Clean, responsive API documentation with ReDoc styling"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Documentation', href: '/docs' },
          { label: 'ReDoc', href: '/docs/redoc' }
        ]}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Documentation Header */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">{documentation.title}</h2>
                <p className="text-base-content/70">{documentation.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="badge badge-outline">v{documentation.version}</span>
                  <span className="badge badge-outline">ReDoc</span>
                </div>
              </div>
              <div className="flex gap-2">
                <ActionButton variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </ActionButton>
                <ActionButton>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open ReDoc
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">API Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="p-3 rounded-lg bg-primary/10 w-fit mx-auto mb-3">
                      <Terminal className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">RESTful API</h4>
                    <p className="text-sm text-base-content/70">
                      Clean REST endpoints following industry standards
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="p-3 rounded-lg bg-success/10 w-fit mx-auto mb-3">
                      <Shield className="w-6 h-6 text-success" />
                    </div>
                    <h4 className="font-semibold mb-2">Secure Authentication</h4>
                    <p className="text-sm text-base-content/70">
                      JWT-based authentication with role-based access
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="p-3 rounded-lg bg-info/10 w-fit mx-auto mb-3">
                      <Activity className="w-6 h-6 text-info" />
                    </div>
                    <h4 className="font-semibold mb-2">Real-time Updates</h4>
                    <p className="text-sm text-base-content/70">
                      WebSocket support for real-time data synchronization
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Quick Start</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-base-200 rounded-lg">
                    <h4 className="font-semibold mb-2">1. Get Your API Key</h4>
                    <p className="text-sm text-base-content/70 mb-3">
                      Contact support to obtain your API key and access credentials.
                    </p>
                    <button className="btn btn-sm btn-primary">
                      <Key className="w-4 h-4 mr-2" />
                      Request API Key
                    </button>
                  </div>
                  <div className="p-4 bg-base-200 rounded-lg">
                    <h4 className="font-semibold mb-2">2. Make Your First Request</h4>
                    <div className="bg-base-300 p-3 rounded mt-2">
                      <pre className="text-sm">
                        <code>
                          curl -X GET &quot;https://api.etuna.com/v1/bookings&quot; \<br/>
                          &nbsp;&nbsp;-H &quot;Authorization: Bearer YOUR_TOKEN&quot;
                        </code>
                      </pre>
                    </div>
                  </div>
                  <div className="p-4 bg-base-200 rounded-lg">
                    <h4 className="font-semibold mb-2">3. Explore the Documentation</h4>
                    <p className="text-sm text-base-content/70">
                      Browse through the sections below to understand all available endpoints and features.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sections Tab */}
        {activeTab === 'sections' && (
          <>
            {/* Search */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="form-control flex-1">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search documentation..."
                        className="input input-bordered w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button className="btn btn-square">
                        <Search className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Documentation Sections */}
            <div className="space-y-4 mb-8">
              {filteredSections.map((section) => (
                <div key={section.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{section.title}</h3>
                          <p className="text-sm text-base-content/70">{section.description}</p>
                        </div>
                      </div>
                      <span className="badge badge-outline">Section</span>
                    </div>

                    <div className="space-y-4">
                      {section.content.map((item, index) => {
                        if (item.type === 'text') {
                          return (
                            <div key={index} className="prose max-w-none">
                              <p className="text-base-content/80">{item.content}</p>
                            </div>
                          );
                        }

                        if (item.type === 'code') {
                          return (
                            <div key={index}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">{item.language}</span>
                                <button className="btn btn-ghost btn-sm">
                                  <Copy className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="bg-base-300 p-3 rounded">
                                <pre className="text-sm overflow-x-auto">
                                  <code>{item.content}</code>
                                </pre>
                              </div>
                            </div>
                          );
                        }

                        if (item.type === 'endpoint') {
                          const MethodIcon = getMethodIcon(item.method);
                          return (
                            <div key={index} className="p-4 bg-base-200 rounded-lg">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <span className={`badge ${getMethodColor(item.method)}`}>
                                    <MethodIcon className="w-3 h-3 mr-1" />
                                    {item.method}
                                  </span>
                                  <code className="bg-base-300 px-2 py-1 rounded text-sm">{item.path}</code>
                                </div>
                                <button className="btn btn-ghost btn-sm">
                                  <TestTube className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-sm text-base-content/70 mb-3">{item.description}</p>
                              
                              {item.parameters && item.parameters.length > 0 && (
                                <div className="mb-3">
                                  <h5 className="font-medium mb-2">Parameters</h5>
                                  <div className="space-y-1">
                                    {item.parameters.map((param, paramIndex) => (
                                      <div key={paramIndex} className="flex items-center space-x-2 text-sm">
                                        <code className="bg-base-300 px-1 rounded">{param.name}</code>
                                        <span className="badge badge-outline badge-sm">{param.type}</span>
                                        <span className={`badge ${param.required ? 'badge-error' : 'badge-success'} badge-sm`}>
                                          {param.required ? 'Required' : 'Optional'}
                                        </span>
                                        <span className="text-base-content/70">{param.description}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div>
                                <h5 className="font-medium mb-2">Responses</h5>
                                <div className="space-y-1">
                                  {item.responses.map((response, responseIndex) => (
                                    <div key={responseIndex} className="flex items-center space-x-2 text-sm">
                                      <span className="badge badge-outline">{response.code}</span>
                                      <span>{response.description}</span>
                                      {response.example && (
                                        <code className="bg-base-300 px-1 rounded text-xs">{response.example}</code>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        }

                        if (item.type === 'model') {
                          return (
                            <div key={index} className="p-4 bg-base-200 rounded-lg">
                              <h5 className="font-medium mb-3">{item.name}</h5>
                              <p className="text-sm text-base-content/70 mb-3">{item.description}</p>
                              <div className="overflow-x-auto">
                                <table className="table table-sm">
                                  <thead>
                                    <tr>
                                      <th>Field</th>
                                      <th>Type</th>
                                      <th>Required</th>
                                      <th>Description</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {item.fields.map((field, fieldIndex) => (
                                      <tr key={fieldIndex}>
                                        <td>
                                          <code className="bg-base-300 px-1 rounded">{field.name}</code>
                                        </td>
                                        <td>
                                          <span className="badge badge-outline badge-sm">{field.type}</span>
                                        </td>
                                        <td>
                                          <span className={`badge ${field.required ? 'badge-error' : 'badge-success'} badge-sm`}>
                                            {field.required ? 'Required' : 'Optional'}
                                          </span>
                                        </td>
                                        <td>{field.description}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          );
                        }

                        if (item.type === 'error') {
                          return (
                            <div key={index} className="p-4 bg-base-200 rounded-lg">
                              <div className="flex items-center space-x-3 mb-2">
                                <span className="badge badge-error">{item.code}</span>
                                <h5 className="font-medium">{item.name}</h5>
                              </div>
                              <p className="text-sm text-base-content/70 mb-2">{item.description}</p>
                              <div className="bg-base-300 p-2 rounded">
                                <pre className="text-xs">
                                  <code>{item.example}</code>
                                </pre>
                              </div>
                            </div>
                          );
                        }

                        return null;
                      })}
                    </div>

                    <div className="card-actions justify-end mt-4">
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
          </>
        )}

        {/* Examples Tab */}
        {activeTab === 'examples' && (
          <div className="space-y-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Code Examples</h3>
                <div className="space-y-6">
                  {documentation.sections
                    .find(s => s.id === 'examples')
                    ?.content.map((example, index) => (
                      <div key={index} className="p-4 bg-base-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{example.title}</h4>
                          <span className="badge badge-outline">{example.language}</span>
                        </div>
                        <p className="text-sm text-base-content/70 mb-3">{example.description}</p>
                        <div className="bg-base-300 p-3 rounded">
                          <pre className="text-sm overflow-x-auto">
                            <code>{example.code}</code>
                          </pre>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reference Tab */}
        {activeTab === 'reference' && (
          <div className="space-y-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">API Reference</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="card bg-base-200">
                    <div className="card-body">
                      <h4 className="card-title text-lg">Authentication</h4>
                      <p className="text-sm text-base-content/70">
                        JWT-based authentication with role-based access control
                      </p>
                      <div className="card-actions justify-end">
                        <button className="btn btn-sm btn-primary">View Details</button>
                      </div>
                    </div>
                  </div>
                  <div className="card bg-base-200">
                    <div className="card-body">
                      <h4 className="card-title text-lg">Rate Limiting</h4>
                      <p className="text-sm text-base-content/70">
                        1000 requests per hour per API key
                      </p>
                      <div className="card-actions justify-end">
                        <button className="btn btn-sm btn-primary">View Details</button>
                      </div>
                    </div>
                  </div>
                  <div className="card bg-base-200">
                    <div className="card-body">
                      <h4 className="card-title text-lg">Error Codes</h4>
                      <p className="text-sm text-base-content/70">
                        Standard HTTP status codes with detailed error messages
                      </p>
                      <div className="card-actions justify-end">
                        <button className="btn btn-sm btn-primary">View Details</button>
                      </div>
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
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Documentation Sections</p>
                  <p className="text-2xl font-bold">{documentation.sections.length}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-green-500 text-white">
                  <Terminal className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">API Endpoints</p>
                  <p className="text-2xl font-bold">25+</p>
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
                  <p className="text-sm text-base-content/70">Data Models</p>
                  <p className="text-2xl font-bold">15+</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <Code className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Code Examples</p>
                  <p className="text-2xl font-bold">10+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
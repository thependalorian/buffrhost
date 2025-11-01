'use client';

import React from 'react';
/**
 * PlatformOverview React Component for Buffr Host Hospitality Platform
 * @fileoverview PlatformOverview provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/landing/PlatformOverview.tsx
 * @purpose PlatformOverview provides specialized functionality for the Buffr Host platform
 * @component PlatformOverview
 * @category Landing
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Configurable props for flexible component usage
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Props:
 * @param {} [className] - className prop description
 *
 * Usage Example:
 * @example
 * import { PlatformOverview } from './PlatformOverview';
 *
 * function App() {
 *   return (
 *     <PlatformOverview
 *       prop1="value"
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered PlatformOverview component
 */

import { BarChart3, CheckCircle, Smartphone } from 'lucide-react';

/**
 * Platform Overview Component
 *
 * Shows platform features with visual mockups
 * Location: components/landing/PlatformOverview.tsx
 * Features: Dashboard preview, mobile experience, feature lists
 */

interface PlatformOverviewProps {
  className?: string;
}

export const PlatformOverview: React.FC<PlatformOverviewProps> = ({
  className = '',
}) => {
  return (
    <section className={`py-24 md:py-32 bg-white ${className}`}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-nude-900 mb-6">
            Platform Overview
          </h2>
        </div>

        <div className="space-y-20">
          {/* Dashboard Preview */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-display font-bold text-nude-900">
                Real-time Business Intelligence
              </h3>
              <p className="text-lg text-nude-700 leading-relaxed">
                Get instant insights into occupancy, revenue, guest
                satisfaction, and operational performance across all your
                properties and services.
              </p>
              <ul className="space-y-3">
                {[
                  'Live revenue dashboards with forecasting',
                  'Guest satisfaction tracking and alerts',
                  'Staff performance analytics',
                  'Multi-property comparison views',
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-nude-700"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="bg-nude-50 rounded-2xl shadow-luxury-strong border border-nude-200 overflow-hidden">
                {/* Header matching real dashboard */}
                <div className="bg-nude-50 shadow-2xl-nude-soft border-b border-nude-200">
                  <div className="px-6 py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-display font-bold text-nude-900">
                          Property Dashboard
                        </h3>
                        <p className="text-nude-600 text-sm">
                          Manage your property operations
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-xs text-nude-500">
                          Property ID: prop_123
                        </span>
                        <span className="text-xs text-nude-500">
                          Tenant: default
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI-Powered Business Intelligence Header */}
                <div className="p-6">
                  <div className="bg-gradient-to-r from-nude-50 to-white card shadow-2xl-nude-soft border border-nude-200 mb-6">
                    <div className="px-6 py-4 border-b border-nude-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-nude-600 to-nude-700 rounded-xl flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                              />
                            </svg>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-semibold text-nude-900">
                                Business Intelligence
                              </h3>
                              <span className="bg-gradient-to-r from-green-100 to-blue-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                Live Analysis
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <svg
                                className="w-4 h-4 text-nude-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              <span className="text-sm text-nude-600">
                                Demo Hotel & Restaurant • Windhoek, Namibia
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                                AI-Powered Insights
                              </span>
                              <span className="bg-nude-100 text-nude-800 px-2 py-1 rounded-full text-xs font-medium">
                                Real-time Analytics
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              // Demo - in real app would refresh data
                              alert(
                                'This is a demo dashboard. Start your free trial to see live data!'
                              );
                            }}
                            className="bg-gradient-to-r from-nude-100 to-nude-200 text-nude-700 px-3 py-1 rounded-md text-sm hover:from-nude-200 hover:to-nude-300 flex items-center gap-1 cursor-pointer"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                            Refresh
                          </button>
                          <button
                            onClick={() => {
                              // Demo - in real app would show insights
                              alert(
                                'This is a demo dashboard. Start your free trial to access AI-powered insights!'
                              );
                            }}
                            className="bg-gradient-to-r from-nude-600 to-nude-700 text-white px-3 py-1 rounded-md text-sm hover:from-nude-700 hover:to-nude-800 flex items-center gap-1 cursor-pointer"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                            Insights
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* AI-Powered Insights */}
                    <div className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm text-nude-900 flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-purple-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                              />
                            </svg>
                            Predictions
                          </h4>
                          <div className="space-y-2 text-xs">
                            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-2 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="text-nude-600">
                                  Next 7 days revenue:
                                </span>
                                <span className="font-bold text-green-600">
                                  +23% ↗
                                </span>
                              </div>
                              <div className="text-nude-500">
                                Forecast: N$145,000
                              </div>
                            </div>
                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-2 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="text-nude-600">
                                  Peak occupancy:
                                </span>
                                <span className="font-bold text-orange-600">
                                  Saturday
                                </span>
                              </div>
                              <div className="text-nude-500">
                                Recommendation: Increase staff
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm text-nude-900 flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                              />
                            </svg>
                            Performance Trends
                          </h4>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-nude-600">
                                Revenue Growth:
                              </span>
                              <span className="font-bold text-green-600">
                                +15.3%
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-nude-600">
                                Guest Satisfaction:
                              </span>
                              <span className="font-bold text-blue-600">
                                4.2/5
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-nude-600">
                                Operational Efficiency:
                              </span>
                              <span className="font-bold text-purple-600">
                                72%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm text-nude-900 flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-red-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                              />
                            </svg>
                            Alerts
                          </h4>
                          <div className="space-y-2 text-xs">
                            <div className="bg-red-50 border border-red-200 p-2 rounded-lg">
                              <div className="text-red-800 font-medium">
                                Inventory Alert
                              </div>
                              <div className="text-red-600">
                                3 items low stock - Reorder
                              </div>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 p-2 rounded-lg">
                              <div className="text-yellow-800 font-medium">
                                Revenue Opportunity
                              </div>
                              <div className="text-yellow-600">
                                Pricing optimization potential
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI-Powered KPI Dashboard */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[
                      {
                        label: 'Revenue Today',
                        value: 'N$20,811',
                        icon: (
                          <svg
                            className="w-5 h-5 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                          </svg>
                        ),
                        color: 'text-green-600',
                        bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
                      },
                      {
                        label: 'Orders Today',
                        value: '23',
                        icon: (
                          <svg
                            className="w-5 h-5 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                        ),
                        color: 'text-purple-600',
                        bgColor:
                          'bg-gradient-to-br from-purple-50 to-purple-100',
                      },
                      {
                        label: 'Predictive Alerts',
                        value: '3',
                        icon: (
                          <svg
                            className="w-5 h-5 text-yellow-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                          </svg>
                        ),
                        color: 'text-yellow-600',
                        bgColor:
                          'bg-gradient-to-br from-yellow-50 to-yellow-100',
                      },
                      {
                        label: 'Actionable Recommendations',
                        value: '7',
                        icon: (
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                        ),
                        color: 'text-blue-600',
                        bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
                      },
                    ].map((metric, index) => (
                      <div
                        key={index}
                        className="bg-white card shadow-2xl-nude-soft border border-nude-200 hover:shadow-luxury-strong transition-shadow"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div
                              className={`w-10 h-10 ${metric.bgColor} rounded-full flex items-center justify-center`}
                            >
                              {metric.icon}
                            </div>
                          </div>
                          <div
                            className={`text-2xl font-bold ${metric.color} mb-1`}
                          >
                            {metric.value}
                          </div>
                          <div className="text-xs text-nude-600 font-medium">
                            {metric.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Alerts matching real CRM */}
                  <div className="bg-white card shadow-2xl-nude-soft border border-nude-200">
                    <div className="px-4 py-3 border-b border-nude-200">
                      <h4 className="text-sm font-medium text-nude-900 flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-yellow-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                        Alerts & Notifications
                      </h4>
                    </div>
                    <div className="p-4">
                      <div className="space-y-2">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-yellow-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                          </svg>
                          <span className="text-sm text-yellow-800">
                            3 items are running low on stock
                          </span>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-sm text-blue-800">
                            5 orders are pending processing
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CMS Showcase */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="bg-white rounded-2xl shadow-luxury-strong border border-nude-200 overflow-hidden">
                {/* CMS Header */}
                <div className="bg-nude-600 px-6 py-3">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span>Content Management System</span>
                  </div>
                </div>

                {/* CMS Content */}
                <div className="p-6">
                  {/* Property Details Editor */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-nude-900 mb-3 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-nude-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      Property Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-2 bg-nude-50 rounded-lg">
                        <div className="w-12 h-12 bg-nude-200 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-nude-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-nude-900">
                            Hotel Exterior
                          </div>
                          <div className="text-xs text-nude-500">
                            Main building photo
                          </div>
                        </div>
                        <button className="text-xs bg-nude-600 text-white px-2 py-1 rounded">
                          Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Property Name"
                          className="text-xs p-2 border border-nude-300 rounded"
                          defaultValue="Demo Hotel & Restaurant"
                        />
                        <input
                          type="text"
                          placeholder="Location"
                          className="text-xs p-2 border border-nude-300 rounded"
                          defaultValue="Windhoek, Namibia"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Menu Item Editor */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-nude-900 mb-3 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-nude-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      Menu Item Editor
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-2 bg-nude-50 rounded-lg">
                        <div className="w-12 h-12 bg-nude-200 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-nude-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-nude-900">
                            Grilled Salmon
                          </div>
                          <div className="text-xs text-nude-500">
                            Fresh Atlantic salmon with herbs
                          </div>
                        </div>
                        <div className="text-sm font-bold text-green-600">
                          N$180
                        </div>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Dish Name"
                          className="w-full text-xs p-2 border border-nude-300 rounded"
                          defaultValue="Grilled Salmon"
                        />
                        <textarea
                          placeholder="Description"
                          className="w-full text-xs p-2 border border-nude-300 rounded h-16"
                          defaultValue="Fresh Atlantic salmon grilled with herbs and lemon"
                        ></textarea>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Price"
                            className="text-xs p-2 border border-nude-300 rounded w-20"
                            defaultValue="N$180"
                          />
                          <select className="text-xs p-2 border border-nude-300 rounded">
                            <option>Breakfast</option>
                            <option>Lunch</option>
                            <option>Dinner</option>
                          </select>
                          <button className="text-xs bg-green-600 text-white px-3 py-2 rounded">
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Room Rates Management */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-nude-900 mb-3 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-nude-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      Room Rates & Availability
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-nude-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-nude-200 rounded flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-nude-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-nude-900">
                              Deluxe Suite
                            </div>
                            <div className="text-xs text-nude-500">
                              King bed, ocean view
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            className="w-16 text-xs p-1 border border-nude-300 rounded text-center"
                            defaultValue="N$2,500"
                          />
                          <button className="text-xs bg-nude-600 text-white px-2 py-1 rounded">
                            Update
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-nude-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-nude-200 rounded flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-nude-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-nude-900">
                              Standard Room
                            </div>
                            <div className="text-xs text-nude-500">
                              Queen bed, city view
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            className="w-16 text-xs p-1 border border-nude-300 rounded text-center"
                            defaultValue="N$1,200"
                          />
                          <button className="text-xs bg-nude-600 text-white px-2 py-1 rounded">
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h4 className="text-sm font-semibold text-nude-900 mb-3 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-nude-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Quick Actions
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="p-2 bg-nude-600 text-white rounded-lg text-xs font-medium hover:bg-nude-700">
                        Upload Images
                      </button>
                      <button className="p-2 bg-nude-100 text-nude-700 rounded-lg text-xs font-medium hover:bg-nude-200">
                        Add Room Type
                      </button>
                      <button className="p-2 bg-nude-100 text-nude-700 rounded-lg text-xs font-medium hover:bg-nude-200">
                        Manage Services
                      </button>
                      <button className="p-2 bg-nude-100 text-nude-700 rounded-lg text-xs font-medium hover:bg-nude-200">
                        Update Rates
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <h3 className="text-3xl font-display font-bold text-nude-900">
                Content Management System
              </h3>
              <p className="text-lg text-nude-700 leading-relaxed">
                Easily manage your property's content, menus, rooms, and
                services with our intuitive CMS. Update information in real-time
                without technical knowledge.
              </p>
              <ul className="space-y-3">
                {[
                  'Drag-and-drop menu editor',
                  'Room and service management',
                  'Real-time content updates',
                  'Multi-language support',
                  'Image and media management',
                  'SEO optimization tools',
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-nude-700"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

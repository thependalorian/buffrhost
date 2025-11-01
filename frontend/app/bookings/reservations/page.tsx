'use client';

/**
 * Bookings Reservations Page
 *
 * Comprehensive booking management with responsive design
 * Features: Booking list, filters, search, calendar view toggle
 * Location: app/bookings/reservations/page.tsx
 */

import React, { useState } from 'react';

export default function ReservationsPage() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Sticky on Mobile */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b">
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
                Bookings & Reservations
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 break-words">
                Manage all your property bookings and reservations
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button className="flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm md:text-base bg-blue-600 text-white rounded-lg font-medium whitespace-nowrap min-h-[44px] sm:min-h-0 hover:bg-blue-700">
                [BuffrIcon name="plus"] New Booking
              </button>
              <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base border rounded-lg whitespace-nowrap min-h-[44px] sm:min-h-0 hover:bg-gray-50">
                [BuffrIcon name="filter"] Filter
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* View Toggle - Stack on Mobile */}
        <div className="bg-white rounded-lg shadow mb-4 sm:mb-6 overflow-hidden">
          <div className="p-4 sm:p-6 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              {/* Search - Full Width on Mobile */}
              <div className="flex-1 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search bookings..."
                  className="w-full px-3 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {/* View Mode Toggle */}
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm md:text-base rounded-lg whitespace-nowrap min-h-[44px] sm:min-h-0 ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'border hover:bg-gray-50'
                  }`}
                >
                  [BuffrIcon name="list"] List
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm md:text-base rounded-lg whitespace-nowrap min-h-[44px] sm:min-h-0 ${
                    viewMode === 'calendar'
                      ? 'bg-blue-600 text-white'
                      : 'border hover:bg-gray-50'
                  }`}
                >
                  [BuffrIcon name="calendar"] Calendar
                </button>
              </div>
            </div>
          </div>

          {/* Filters - Horizontal Scroll on Mobile */}
          <div className="p-4 sm:p-6 border-b overflow-x-auto">
            <div className="flex gap-2 sm:gap-3 min-w-max sm:min-w-0 sm:flex-wrap">
              <select className="flex-1 sm:flex-initial px-3 py-2 text-xs sm:text-sm md:text-base border rounded-lg min-w-[120px] sm:min-w-[150px]">
                <option>All Statuses</option>
                <option>Confirmed</option>
                <option>Pending</option>
                <option>Cancelled</option>
              </select>
              <select className="flex-1 sm:flex-initial px-3 py-2 text-xs sm:text-sm md:text-base border rounded-lg min-w-[120px] sm:min-w-[150px]">
                <option>All Properties</option>
                <option>Hotel</option>
                <option>Restaurant</option>
              </select>
              <select className="flex-1 sm:flex-initial px-3 py-2 text-xs sm:text-sm md:text-base border rounded-lg min-w-[120px] sm:min-w-[150px]">
                <option>Last 30 Days</option>
                <option>Last 7 Days</option>
                <option>Today</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Content */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {viewMode === 'list' ? (
            /* List View - Cards on Mobile, Table on Desktop */
            <>
              {/* Mobile: Card View */}
              <div className="md:hidden divide-y divide-gray-200">
                {[1, 2, 3].map((booking) => (
                  <div key={booking} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-600 mb-1">
                          #BK-{booking.toString().padStart(5, '0')}
                        </p>
                        <p className="text-base font-semibold text-gray-900 truncate">
                          Guest Name
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          guest@email.com
                        </p>
                      </div>
                      <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full whitespace-nowrap">
                        Confirmed
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3 pt-3 border-t">
                      <div>
                        <p className="text-xs text-gray-500">Check-in</p>
                        <p className="text-sm font-medium">Dec 15, 2024</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Check-out</p>
                        <p className="text-sm font-medium">Dec 17, 2024</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Room</p>
                        <p className="text-sm font-medium">Deluxe Suite</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="text-sm font-medium">N$1,200</p>
                      </div>
                    </div>
                    <button className="w-full py-2 text-sm border rounded-lg hover:bg-gray-50">
                      View Details
                    </button>
                  </div>
                ))}
              </div>

              {/* Desktop: Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Booking ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Guest
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Room
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[1, 2, 3, 4, 5].map((booking) => (
                      <tr key={booking} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-blue-600">
                            #BK-{booking.toString().padStart(5, '0')}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                            Guest Name
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-[150px]">
                            guest@email.com
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          Dec 15 - Dec 17
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          Deluxe Suite
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          N$1,200
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Confirmed
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            /* Calendar View */
            <div className="p-4 sm:p-6">
              <div className="overflow-x-auto">
                <div className="min-w-[768px]">
                  {/* Calendar grid content */}
                  <p className="text-sm text-gray-600 text-center py-8">
                    Calendar view - coming soon
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pagination - Responsive */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 sm:mt-6">
          <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
            Showing 1-10 of 156 bookings
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-2 text-xs sm:text-sm border rounded-lg hover:bg-gray-50 min-h-[44px] sm:min-h-0">
              Previous
            </button>
            <button className="px-3 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg min-h-[44px] sm:min-h-0">
              1
            </button>
            <button className="px-3 py-2 text-xs sm:text-sm border rounded-lg hover:bg-gray-50 min-h-[44px] sm:min-h-0">
              2
            </button>
            <button className="px-3 py-2 text-xs sm:text-sm border rounded-lg hover:bg-gray-50 min-h-[44px] sm:min-h-0">
              3
            </button>
            <button className="px-3 py-2 text-xs sm:text-sm border rounded-lg hover:bg-gray-50 min-h-[44px] sm:min-h-0">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

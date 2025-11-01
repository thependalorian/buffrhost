'use client';

/**
 * Bookings Calendar Page
 *
 * Interactive calendar view for bookings with responsive design
 * Features: Month/week/day views, booking display, horizontal scroll on mobile
 * Location: app/bookings/calendar/page.tsx
 */

import React, { useState } from 'react';

export default function BookingCalendarPage() {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Sticky on Mobile */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b">
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
                Booking Calendar
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 break-words">
                View and manage bookings in calendar format
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button className="flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm md:text-base bg-blue-600 text-white rounded-lg font-medium whitespace-nowrap min-h-[44px] sm:min-h-0 hover:bg-blue-700">
                [BuffrIcon name="plus"] New Booking
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Calendar Controls - Stack on Mobile */}
        <div className="bg-white rounded-lg shadow mb-4 sm:mb-6 overflow-hidden">
          <div className="p-4 sm:p-6 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <button className="px-3 py-2 text-xs sm:text-sm md:text-base border rounded-lg hover:bg-gray-50 whitespace-nowrap min-h-[44px] sm:min-h-0">
                  [BuffrIcon name="chevron-left"]
                </button>
                <button className="px-4 py-2 text-xs sm:text-sm md:text-base border rounded-lg hover:bg-gray-50 whitespace-nowrap min-h-[44px] sm:min-h-0">
                  Today
                </button>
                <button className="px-3 py-2 text-xs sm:text-sm md:text-base border rounded-lg hover:bg-gray-50 whitespace-nowrap min-h-[44px] sm:min-h-0">
                  [BuffrIcon name="chevron-right"]
                </button>
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 truncate text-center sm:text-left">
                December 2024
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-3 py-2 text-xs sm:text-sm md:text-base rounded-lg whitespace-nowrap min-h-[44px] sm:min-h-0 ${
                    viewMode === 'month'
                      ? 'bg-blue-600 text-white'
                      : 'border hover:bg-gray-50'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-2 text-xs sm:text-sm md:text-base rounded-lg whitespace-nowrap min-h-[44px] sm:min-h-0 ${
                    viewMode === 'week'
                      ? 'bg-blue-600 text-white'
                      : 'border hover:bg-gray-50'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-3 py-2 text-xs sm:text-sm md:text-base rounded-lg whitespace-nowrap min-h-[44px] sm:min-h-0 ${
                    viewMode === 'day'
                      ? 'bg-blue-600 text-white'
                      : 'border hover:bg-gray-50'
                  }`}
                >
                  Day
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Grid - Horizontal Scroll on Mobile */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[768px] p-4 sm:p-6">
              {/* Calendar Header - Days */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-xs sm:text-sm font-medium text-gray-700 py-2 truncate"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, index) => (
                  <div
                    key={index}
                    className="min-h-[80px] sm:min-h-[100px] md:min-h-[120px] border rounded-lg p-2 hover:bg-gray-50 cursor-pointer overflow-hidden"
                  >
                    <div className="text-xs sm:text-sm font-medium text-gray-700 mb-1 truncate">
                      {index + 1}
                    </div>
                    {/* Booking Items */}
                    {index % 7 === 0 && (
                      <div className="space-y-1">
                        <div className="bg-blue-100 text-blue-800 text-xs p-1 rounded truncate">
                          Booking #{index}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

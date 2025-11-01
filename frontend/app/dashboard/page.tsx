'use client';

import React, { useState, useEffect } from 'react';
import { WelcomeSection } from '@/components/dashboard/WelcomeSection';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { NotificationsWidget } from '@/components/dashboard/NotificationsWidget';

/**
 * Refactored Dashboard Page
 *
 * Modular dashboard using smaller, reusable components
 * Location: app/dashboard/page-refactored.tsx
 */

interface DashboardStats {
  totalRevenue: number;
  totalBookings: number;
  occupancyRate: number;
  pendingTasks: number;
  averageRating: number;
  totalGuests: number;
}

interface RecentActivityItem {
  id: string;
  type: 'booking' | 'order' | 'review' | 'payment';
  title: string;
  description: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'cancelled';
  amount?: number;
}

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalBookings: 0,
    occupancyRate: 0,
    pendingTasks: 0,
    averageRating: 0,
    totalGuests: 0,
  });

  const [recentActivities, setRecentActivities] = useState<
    RecentActivityItem[]
  >([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Update time every minute
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString());
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    // Simulate data loading
    const loadDashboardData = async () => {
      try {
        // Simulate API calls
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setStats({
          totalRevenue: 125430.5,
          totalBookings: 342,
          occupancyRate: 87.5,
          pendingTasks: 12,
          averageRating: 4.8,
          totalGuests: 1284,
        });

        setRecentActivities([
          {
            id: '1',
            type: 'booking',
            title: 'New Hotel Booking',
            description: 'Room 205 - 2 nights',
            timestamp: new Date(Date.now() - 1000 * 60 * 15),
            status: 'completed',
            amount: 450,
          },
          {
            id: '2',
            type: 'order',
            title: 'Restaurant Order',
            description: 'Table 12 - Dinner service',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            status: 'pending',
            amount: 125,
          },
          {
            id: '3',
            type: 'review',
            title: 'New Review',
            description: '5-star rating received',
            timestamp: new Date(Date.now() - 1000 * 60 * 45),
            status: 'completed',
          },
        ]);

        setNotifications([
          {
            id: '1',
            type: 'info',
            title: 'System Update',
            message: 'New features available in your dashboard',
            timestamp: new Date(Date.now() - 1000 * 60 * 10),
            isRead: false,
          },
          {
            id: '2',
            type: 'warning',
            title: 'Low Inventory',
            message: 'Room cleaning supplies running low',
            timestamp: new Date(Date.now() - 1000 * 60 * 60),
            isRead: false,
          },
          {
            id: '3',
            type: 'success',
            title: 'Payment Received',
            message: 'Payment of $450.00 processed successfully',
            timestamp: new Date(Date.now() - 1000 * 60 * 90),
            isRead: true,
          },
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();

    return () => clearInterval(interval);
  }, []);

  const statsCards = [
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: stats.totalRevenue,
      change: 12.5,
      changeType: 'increase' as const,
      icon: 'dollar-sign' as const,
      color: 'success' as const,
      format: 'currency' as const,
    },
    {
      id: 'bookings',
      title: 'Total Bookings',
      value: stats.totalBookings,
      change: 8.2,
      changeType: 'increase' as const,
      icon: 'calendar' as const,
      color: 'primary' as const,
      format: 'number' as const,
    },
    {
      id: 'occupancy',
      title: 'Occupancy Rate',
      value: stats.occupancyRate,
      change: -2.1,
      changeType: 'decrease' as const,
      icon: 'trending-up' as const,
      color: 'warning' as const,
      format: 'percentage' as const,
    },
    {
      id: 'tasks',
      title: 'Pending Tasks',
      value: stats.pendingTasks,
      change: 0,
      changeType: 'neutral' as const,
      icon: 'checklist' as const,
      color: 'info' as const,
      format: 'number' as const,
    },
    {
      id: 'rating',
      title: 'Average Rating',
      value: stats.averageRating,
      change: 0.3,
      changeType: 'increase' as const,
      icon: 'star' as const,
      color: 'success' as const,
      format: 'number' as const,
    },
    {
      id: 'guests',
      title: 'Total Guests',
      value: stats.totalGuests,
      change: 15.7,
      changeType: 'increase' as const,
      icon: 'users' as const,
      color: 'primary' as const,
      format: 'number' as const,
    },
  ];

  const quickActions = [
    {
      id: 'new-booking',
      title: 'New Booking',
      description: 'Create a new reservation',
      icon: 'plus' as const,
      href: '/bookings/new',
      variant: 'primary' as const,
      color: 'primary' as const,
    },
    {
      id: 'manage-rooms',
      title: 'Manage Rooms',
      description: 'View and edit room details',
      icon: 'home' as const,
      href: '/rooms',
      variant: 'outline' as const,
      color: 'info' as const,
    },
    {
      id: 'view-reports',
      title: 'View Reports',
      description: 'Access analytics and reports',
      icon: 'bar-chart' as const,
      href: '/analytics',
      variant: 'outline' as const,
      color: 'success' as const,
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure your preferences',
      icon: 'settings' as const,
      href: '/settings',
      variant: 'outline' as const,
      color: 'warning' as const,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Sticky on Mobile */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate flex-1 mr-2">
              Dashboard
            </h1>
            <button className="md:hidden p-2 text-gray-600 hover:text-gray-900 flex-shrink-0">
              {/* Hamburger Menu Icon */}
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Welcome Section - Responsive */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <WelcomeSection
            userName="John Doe"
            userRole="Property Manager"
            currentTime={currentTime}
          />
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <StatsCards stats={statsCards} />
        </div>

        {/* Main Content Grid - Stack on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Full Width on Mobile */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <RecentActivity
                activities={recentActivities}
                maxItems={5}
                showViewAll={true}
              />
            </div>

            {/* Quick Actions - Responsive Grid */}
            <div className="bg-white rounded-lg shadow overflow-hidden p-4 sm:p-6">
              <QuickActions actions={quickActions} columns={4} />
            </div>
          </div>

          {/* Right Column - Full Width on Mobile */}
          <div className="space-y-4 sm:space-y-6">
            {/* Notifications */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <NotificationsWidget
                notifications={notifications}
                maxItems={5}
                showMarkAllRead={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

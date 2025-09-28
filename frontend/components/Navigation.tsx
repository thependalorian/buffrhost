/**
 * Navigation Component
 * 
 * Main navigation component for the Buffr Host application
 * Includes links to Etuna demo, management, and other key sections
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className = '' }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    {
      name: 'Home',
      href: '/',
      icon: HomeIcon,
      description: 'Back to main landing page'
    },
    {
      name: 'Etuna Demo',
      href: '/guest/etuna',
      icon: BuildingOffice2Icon,
      description: 'Experience Etuna Guesthouse & Tours',
      badge: 'Live Demo'
    },
    {
      name: 'Etuna Management',
      href: '/demo/etuna/admin-dashboard-demo/dashboard',
      icon: ChartBarIcon,
      description: 'Etuna admin dashboard',
      badge: 'Admin'
    },
    {
      name: 'Restaurants',
      href: '/restaurants',
      icon: BuildingOffice2Icon,
      description: 'Manage restaurants',
      badge: 'New'
    },
    {
      name: 'Menu Demo',
      href: '/guest/etuna/menu',
      icon: UserGroupIcon,
      description: 'Restaurant & Bar Menu'
    },
    {
      name: 'Tours Demo',
      href: '/guest/etuna/tours',
      icon: MapPinIcon,
      description: 'Guided Tours & Activities'
    },
    {
      name: 'AI Assistant',
      href: '/guest/etuna/ai-assistant',
      icon: ChatBubbleLeftRightIcon,
      description: 'AI-powered guest assistance',
      badge: 'New'
    }
  ];

  const managementItems = [
    {
      name: 'Admin Dashboard',
      href: '/admin',
      icon: ChartBarIcon,
      description: 'System administration'
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: ChartBarIcon,
      description: 'Business analytics'
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Cog6ToothIcon,
      description: 'System settings'
    }
  ];

  return (
    <nav className={`bg-white dark:bg-gray-900 shadow-lg ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Buffr Host
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Demo Links */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/guest/etuna" 
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <BuildingOffice2Icon className="w-4 h-4" />
                <span>Etuna Demo</span>
                <span className="bg-blue-500 text-xs px-2 py-1 rounded-full">Live</span>
              </Link>
              
              <Link 
                href="/demo/etuna/admin-dashboard-demo/dashboard" 
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <ChartBarIcon className="w-4 h-4" />
                <span>Management</span>
              </Link>
            </div>

            {/* Quick Access Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <EyeIcon className="w-4 h-4" />
                <span>Quick Access</span>
              </button>
              
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  {navigationItems.slice(1).map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <item.icon className="w-5 h-5 text-gray-500" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                          {item.badge && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {isOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 dark:bg-gray-800 rounded-lg mt-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{item.name}</span>
                      {item.badge && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

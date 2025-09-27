/**
 * User Email Dashboard Component
 * 
 * Main dashboard for user email management
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Send, 
  Inbox, 
  Archive, 
  Trash2, 
  Plus,
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import EmailNotificationList from './EmailNotificationList';

interface EmailStats {
  total: number;
  unread: number;
  sent: number;
  failed: number;
}

export default function UserEmailDashboard() {
  const [activeTab, setActiveTab] = useState('inbox');

  const emailStats: EmailStats = {
    total: 156,
    unread: 12,
    sent: 89,
    failed: 3
  };

  const handleMarkAsRead = (id: string) => {
    console.log('Mark as read:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete notification:', id);
  };

  const handleFilter = (type: string) => {
    console.log('Filter by type:', type);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Dashboard</h1>
          <p className="text-gray-600">Manage your email communications</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Compose
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Emails</p>
                <p className="text-2xl font-bold">{emailStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold">{emailStats.unread}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Sent</p>
                <p className="text-2xl font-bold">{emailStats.sent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold">{emailStats.failed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inbox" className="flex items-center space-x-2">
            <Inbox className="w-4 h-4" />
            <span>Inbox</span>
          </TabsTrigger>
          <TabsTrigger value="sent" className="flex items-center space-x-2">
            <Send className="w-4 h-4" />
            <span>Sent</span>
          </TabsTrigger>
          <TabsTrigger value="archive" className="flex items-center space-x-2">
            <Archive className="w-4 h-4" />
            <span>Archive</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-4">
          <EmailNotificationList 
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
            onFilter={handleFilter}
          />
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Sent Emails
              </h3>
              <p className="text-gray-500">
                View your sent email history here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archive" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Archived Emails
              </h3>
              <p className="text-gray-500">
                Your archived emails will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Email Analytics
              </h3>
              <p className="text-gray-500">
                View email performance metrics and analytics.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
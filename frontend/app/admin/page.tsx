import { Metadata } from "next";
import { DollarSign, Calendar, Users, Bed, Utensils, Settings, BarChart3, Plus, Eye, Edit, Trash2 } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { NudeStatCard, NudeCard, NudeCardTitle, NudeCardBody, NudeCardActions, NudeButton, NudeBadge } from "@/components/ui/NudeComponents";

export const metadata: Metadata = {
  title: "Admin Dashboard - Buffr Host",
  description: "Comprehensive hospitality management dashboard",
};

export default function AdminDashboardPage() {
  return (
    <AdminLayout
      title="Admin Dashboard"
      subtitle="Comprehensive hospitality ecosystem management"
      breadcrumbs={[
        { label: 'Admin', href: '/admin' }
      ]}
      actions={
        <NudeButton variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          Quick Action
        </NudeButton>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <NudeStatCard
          title="Total Revenue"
          value="N$ 45,678"
          description="This month"
          icon={<DollarSign className="h-4 w-4" />}
          trend={{
            value: 12,
            label: "from last month",
            direction: "up"
          }}
          variant="default"
        />

        <NudeStatCard
          title="Active Bookings"
          value="23"
          description="Today"
          icon={<Calendar className="h-4 w-4" />}
          trend={{
            value: 5,
            label: "from last month",
            direction: "up"
          }}
          variant="info"
        />

        <NudeStatCard
          title="Occupancy Rate"
          value="78%"
          description="This week"
          icon={<Users className="h-4 w-4" />}
          trend={{
            value: 3,
            label: "from last month",
            direction: "up"
          }}
          variant="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NudeCard>
          <NudeCardTitle>Quick Actions</NudeCardTitle>
          <NudeCardBody>
            <div className="grid grid-cols-2 gap-4">
              <NudeButton variant="outline" className="justify-start">
                <Bed className="w-4 h-4 mr-2" />
                Room Management
              </NudeButton>
              <NudeButton variant="outline" className="justify-start">
                <Utensils className="w-4 h-4 mr-2" />
                Menu Management
              </NudeButton>
              <NudeButton variant="outline" className="justify-start">
                <Users className="w-4 h-4 mr-2" />
                Staff Management
              </NudeButton>
              <NudeButton variant="outline" className="justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </NudeButton>
            </div>
          </NudeCardBody>
        </NudeCard>

        <NudeCard>
          <NudeCardTitle>Recent Activity</NudeCardTitle>
          <NudeCardBody>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <NudeBadge variant="success">Booking</NudeBadge>
                <div className="text-sm">
                  <p className="font-medium text-nude-800">New room booking for Room 101</p>
                  <p className="text-nude-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <NudeBadge variant="info">Order</NudeBadge>
                <div className="text-sm">
                  <p className="font-medium text-nude-800">Room service order completed</p>
                  <p className="text-nude-500">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <NudeBadge variant="warning">Check-in</NudeBadge>
                <div className="text-sm">
                  <p className="font-medium text-nude-800">Guest checked in to Room 205</p>
                  <p className="text-nude-500">1 hour ago</p>
                </div>
              </div>
            </div>
          </NudeCardBody>
        </NudeCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <NudeCard>
          <NudeCardTitle>Room Status</NudeCardTitle>
          <NudeCardBody>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-nude-700">Available</span>
                <NudeBadge variant="success">12</NudeBadge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-nude-700">Occupied</span>
                <NudeBadge variant="warning">8</NudeBadge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-nude-700">Maintenance</span>
                <NudeBadge variant="error">2</NudeBadge>
              </div>
            </div>
          </NudeCardBody>
        </NudeCard>

        <NudeCard>
          <NudeCardTitle>Today&apos;s Schedule</NudeCardTitle>
          <NudeCardBody>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium text-nude-800">9:00 AM - Check-out (Room 101)</p>
                <p className="text-nude-500">John Smith</p>
              </div>
              <div className="text-sm">
                <p className="font-medium text-nude-800">2:00 PM - Check-in (Room 205)</p>
                <p className="text-nude-500">Jane Doe</p>
              </div>
              <div className="text-sm">
                <p className="font-medium text-nude-800">6:00 PM - Spa Booking</p>
                <p className="text-nude-500">Massage Therapy</p>
              </div>
            </div>
          </NudeCardBody>
        </NudeCard>

        <NudeCard>
          <NudeCardTitle>System Health</NudeCardTitle>
          <NudeCardBody>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-nude-700">Database</span>
                <NudeBadge variant="success">Online</NudeBadge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-nude-700">Payment System</span>
                <NudeBadge variant="success">Online</NudeBadge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-nude-700">AI Services</span>
                <NudeBadge variant="success">Online</NudeBadge>
              </div>
            </div>
          </NudeCardBody>
        </NudeCard>
      </div>
    </AdminLayout>
  );
}

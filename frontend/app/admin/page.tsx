import { Metadata } from "next";
import { StatCard, PageHeader } from "@/src/components/ui";
import { DollarSign, Calendar, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard - Buffr Host",
  description: "Comprehensive hospitality management dashboard",
};

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Admin Dashboard"
        description="Comprehensive hospitality ecosystem management"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
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

        <StatCard
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

        <StatCard
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
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <a href="/admin/rooms" className="btn btn-outline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
                  />
                </svg>
                Room Management
              </a>
              <a href="/admin/menu" className="btn btn-outline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Menu Management
              </a>
              <a href="/admin/staff" className="btn btn-outline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                Staff Management
              </a>
              <a href="/admin/analytics" className="btn btn-outline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Analytics
              </a>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="badge badge-success">Booking</div>
                <div className="text-sm">
                  <p className="font-medium">New room booking for Room 101</p>
                  <p className="text-base-content/70">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="badge badge-info">Order</div>
                <div className="text-sm">
                  <p className="font-medium">Room service order completed</p>
                  <p className="text-base-content/70">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="badge badge-warning">Check-in</div>
                <div className="text-sm">
                  <p className="font-medium">Guest checked in to Room 205</p>
                  <p className="text-base-content/70">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Room Status</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Available</span>
                <span className="badge badge-success">12</span>
              </div>
              <div className="flex justify-between">
                <span>Occupied</span>
                <span className="badge badge-warning">8</span>
              </div>
              <div className="flex justify-between">
                <span>Maintenance</span>
                <span className="badge badge-error">2</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Today&apos;s Schedule</h2>
            <div className="space-y-2">
              <div className="text-sm">
                <p className="font-medium">9:00 AM - Check-out (Room 101)</p>
                <p className="text-base-content/70">John Smith</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">2:00 PM - Check-in (Room 205)</p>
                <p className="text-base-content/70">Jane Doe</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">6:00 PM - Spa Booking</p>
                <p className="text-base-content/70">Massage Therapy</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">System Health</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Database</span>
                <span className="badge badge-success">Online</span>
              </div>
              <div className="flex justify-between">
                <span>Payment System</span>
                <span className="badge badge-success">Online</span>
              </div>
              <div className="flex justify-between">
                <span>AI Services</span>
                <span className="badge badge-success">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

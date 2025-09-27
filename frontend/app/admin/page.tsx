import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Buffr Host',
  description: 'Comprehensive hospitality management dashboard',
};

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content">Admin Dashboard</h1>
        <p className="text-base-content/70 mt-2">
          Comprehensive hospitality ecosystem management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <div className="stat-title">Total Revenue</div>
            <div className="stat-value text-primary">N$ 45,678</div>
            <div className="stat-desc">This month</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div className="stat-title">Active Bookings</div>
            <div className="stat-value text-secondary">23</div>
            <div className="stat-desc">Today</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </div>
            <div className="stat-title">Occupancy Rate</div>
            <div className="stat-value text-accent">78%</div>
            <div className="stat-desc">This week</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <a href="/admin/rooms" className="btn btn-outline">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                </svg>
                Room Management
              </a>
              <a href="/admin/menu" className="btn btn-outline">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Menu Management
              </a>
              <a href="/admin/staff" className="btn btn-outline">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                Staff Management
              </a>
              <a href="/admin/analytics" className="btn btn-outline">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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

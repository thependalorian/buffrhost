import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics Dashboard - Buffr Host',
  description: 'Business intelligence and performance analytics',
};

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content">Analytics Dashboard</h1>
        <p className="text-base-content/70 mt-2">
          Business intelligence and performance analytics for your hospitality business
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Revenue</div>
            <div className="stat-value text-primary">N$ 125,678</div>
            <div className="stat-desc">+12% from last month</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Occupancy Rate</div>
            <div className="stat-value text-success">78%</div>
            <div className="stat-desc">+5% from last month</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Average Order Value</div>
            <div className="stat-value text-secondary">N$ 85</div>
            <div className="stat-desc">+3% from last month</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Customer Satisfaction</div>
            <div className="stat-value text-accent">4.8/5</div>
            <div className="stat-desc">+0.2 from last month</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Revenue Trends</h2>
              <div className="h-64 flex items-center justify-center bg-base-200 rounded-lg">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-base-content/50 mt-2">Revenue Chart Placeholder</p>
                  <p className="text-sm text-base-content/30">Chart.js integration needed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Top Performing Services</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Room Bookings</p>
                  <p className="text-sm text-base-content/70">Hotel accommodation</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-success">N$ 45,678</p>
                  <p className="text-sm text-base-content/70">+15%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Restaurant Orders</p>
                  <p className="text-sm text-base-content/70">Food & beverage</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">N$ 32,456</p>
                  <p className="text-sm text-base-content/70">+8%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Spa Services</p>
                  <p className="text-sm text-base-content/70">Wellness treatments</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-secondary">N$ 28,234</p>
                  <p className="text-sm text-base-content/70">+12%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Conference Rooms</p>
                  <p className="text-sm text-base-content/70">Event bookings</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-accent">N$ 19,310</p>
                  <p className="text-sm text-base-content/70">+5%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Customer Demographics</h2>
            <div className="h-48 flex items-center justify-center bg-base-200 rounded-lg">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-base-content/50 mt-2">Demographics Chart</p>
                <p className="text-sm text-base-content/30">Pie chart integration needed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Peak Hours Analysis</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Breakfast (7-10 AM)</p>
                  <p className="text-sm text-base-content/70">Restaurant peak time</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">85%</p>
                  <p className="text-sm text-base-content/70">capacity</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Lunch (12-2 PM)</p>
                  <p className="text-sm text-base-content/70">Restaurant peak time</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">92%</p>
                  <p className="text-sm text-base-content/70">capacity</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dinner (6-9 PM)</p>
                  <p className="text-sm text-base-content/70">Restaurant peak time</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">78%</p>
                  <p className="text-sm text-base-content/70">capacity</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Spa (2-6 PM)</p>
                  <p className="text-sm text-base-content/70">Wellness peak time</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">65%</p>
                  <p className="text-sm text-base-content/70">capacity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Monthly Comparison</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>This Month</span>
                <span className="badge badge-success">N$ 125,678</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Last Month</span>
                <span className="badge badge-primary">N$ 112,345</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Growth</span>
                <span className="badge badge-accent">+11.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Target</span>
                <span className="badge badge-warning">N$ 130,000</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Customer Feedback</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="rating rating-sm">
                  <input type="radio" name="rating-1" className="mask mask-star-2 bg-orange-400" />
                  <input type="radio" name="rating-1" className="mask mask-star-2 bg-orange-400" />
                  <input type="radio" name="rating-1" className="mask mask-star-2 bg-orange-400" />
                  <input type="radio" name="rating-1" className="mask mask-star-2 bg-orange-400" />
                  <input type="radio" name="rating-1" className="mask mask-star-2 bg-orange-400" checked />
                </div>
                <span className="text-sm">4.8/5 (156 reviews)</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Excellent</span>
                  <span>78%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Good</span>
                  <span>18%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Average</span>
                  <span>3%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Poor</span>
                  <span>1%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Operational Metrics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Average Check-in Time</span>
                <span className="badge badge-info">3.2 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Room Service Response</span>
                <span className="badge badge-success">12 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Table Turnover Rate</span>
                <span className="badge badge-warning">2.3x</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Staff Efficiency</span>
                <span className="badge badge-accent">87%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

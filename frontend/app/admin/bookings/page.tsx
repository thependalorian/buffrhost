import { Metadata } from "next";
import { StatCard, PageHeader } from "@/src/components/ui";
import { Calendar, LogIn, LogOut, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Booking Management - Buffr Host",
  description: "Manage reservations, bookings, and scheduling",
};

export default function BookingManagementPage() {
  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Booking Management"
        description="Manage reservations, bookings, and scheduling across all services"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Today's Bookings"
          value="23"
          description="Active reservations"
          icon={<Calendar className="h-4 w-4" />}
          trend={{
            value: 12,
            label: "from last week",
            direction: "up"
          }}
          variant="default"
        />

        <StatCard
          title="Check-ins"
          value="8"
          description="Expected today"
          icon={<LogIn className="h-4 w-4" />}
          trend={{
            value: 3,
            label: "from last week",
            direction: "up"
          }}
          variant="success"
        />

        <StatCard
          title="Check-outs"
          value="6"
          description="Expected today"
          icon={<LogOut className="h-4 w-4" />}
          trend={{
            value: 2,
            label: "from last week",
            direction: "up"
          }}
          variant="warning"
        />

        <StatCard
          title="Occupancy"
          value="78%"
          description="Current rate"
          icon={<TrendingUp className="h-4 w-4" />}
          trend={{
            value: 5,
            label: "from last week",
            direction: "up"
          }}
          variant="info"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title">Active Bookings</h2>
                <div className="flex space-x-2">
                  <select className="select select-bordered select-sm">
                    <option>All Services</option>
                    <option>Hotel Rooms</option>
                    <option>Restaurant</option>
                    <option>Spa Services</option>
                    <option>Conference Rooms</option>
                    <option>Transportation</option>
                  </select>
                  <button className="btn btn-primary btn-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    New Booking
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Guest</th>
                      <th>Service</th>
                      <th>Date/Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="font-mono text-sm">#BK-2025-001</div>
                      </td>
                      <td>
                        <div>
                          <div className="font-bold">John Smith</div>
                          <div className="text-sm opacity-50">
                            john.smith@email.com
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium">Room 101</div>
                          <div className="text-sm opacity-50">
                            Standard Room
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium">Jan 15, 2025</div>
                          <div className="text-sm opacity-50">
                            2:00 PM Check-in
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-success">Confirmed</span>
                      </td>
                      <td>
                        <button className="btn btn-ghost btn-xs">View</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="font-mono text-sm">#BK-2025-002</div>
                      </td>
                      <td>
                        <div>
                          <div className="font-bold">Sarah Johnson</div>
                          <div className="text-sm opacity-50">
                            sarah.j@email.com
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium">Restaurant Table</div>
                          <div className="text-sm opacity-50">
                            Table 5 - 2 people
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium">Jan 15, 2025</div>
                          <div className="text-sm opacity-50">7:30 PM</div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-warning">Pending</span>
                      </td>
                      <td>
                        <button className="btn btn-ghost btn-xs">View</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="font-mono text-sm">#BK-2025-003</div>
                      </td>
                      <td>
                        <div>
                          <div className="font-bold">Mike Wilson</div>
                          <div className="text-sm opacity-50">
                            mike.w@email.com
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium">Spa Treatment</div>
                          <div className="text-sm opacity-50">
                            Deep Tissue Massage
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium">Jan 15, 2025</div>
                          <div className="text-sm opacity-50">3:00 PM</div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-info">Confirmed</span>
                      </td>
                      <td>
                        <button className="btn btn-ghost btn-xs">View</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="font-mono text-sm">#BK-2025-004</div>
                      </td>
                      <td>
                        <div>
                          <div className="font-bold">Emma Davis</div>
                          <div className="text-sm opacity-50">
                            emma.d@email.com
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium">Conference Room A</div>
                          <div className="text-sm opacity-50">
                            Business Meeting
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium">Jan 15, 2025</div>
                          <div className="text-sm opacity-50">
                            10:00 AM - 12:00 PM
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-success">Confirmed</span>
                      </td>
                      <td>
                        <button className="btn btn-ghost btn-xs">View</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="font-mono text-sm">#BK-2025-005</div>
                      </td>
                      <td>
                        <div>
                          <div className="font-bold">David Brown</div>
                          <div className="text-sm opacity-50">
                            david.b@email.com
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium">Airport Transfer</div>
                          <div className="text-sm opacity-50">
                            Pickup Service
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium">Jan 15, 2025</div>
                          <div className="text-sm opacity-50">4:30 PM</div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-warning">Pending</span>
                      </td>
                      <td>
                        <button className="btn btn-ghost btn-xs">View</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Quick Actions</h2>
              <div className="space-y-3">
                <button className="btn btn-outline w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  New Booking
                </button>
                <button className="btn btn-outline w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
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
                  Check-in
                </button>
                <button className="btn btn-outline w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Check-out
                </button>
                <button className="btn btn-outline w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export Report
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Today&apos;s Schedule</h2>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium text-success">
                    9:00 AM - Check-out
                  </p>
                  <p className="text-base-content/70">Room 101 - John Smith</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-info">10:00 AM - Conference</p>
                  <p className="text-base-content/70">Room A - Emma Davis</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-primary">2:00 PM - Check-in</p>
                  <p className="text-base-content/70">Room 101 - New Guest</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-secondary">3:00 PM - Spa</p>
                  <p className="text-base-content/70">Mike Wilson - Massage</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-warning">
                    7:30 PM - Restaurant
                  </p>
                  <p className="text-base-content/70">
                    Table 5 - Sarah Johnson
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Booking Statistics</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Hotel Rooms</span>
                  <span className="badge badge-primary">15 bookings</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Restaurant</span>
                  <span className="badge badge-secondary">8 bookings</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Spa Services</span>
                  <span className="badge badge-accent">5 bookings</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Conference</span>
                  <span className="badge badge-info">3 bookings</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Transportation</span>
                  <span className="badge badge-warning">2 bookings</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Pending Actions</h2>
              <div className="space-y-3">
                <div className="alert alert-warning">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <div>
                    <h3 className="font-bold">Payment Pending</h3>
                    <div className="text-xs">Booking #BK-2025-002</div>
                  </div>
                </div>
                <div className="alert alert-info">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h3 className="font-bold">Confirmation Needed</h3>
                    <div className="text-xs">Booking #BK-2025-005</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

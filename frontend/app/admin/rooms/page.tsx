import { Metadata } from "next";
import { StatCard, PageHeader } from "@/src/components/ui";
import { Bed, CheckCircle, Users, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Room Management - Buffr Host",
  description: "Manage hotel rooms, bookings, and availability",
};

export default function RoomManagementPage() {
  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Room Management"
        description="Manage hotel rooms, bookings, and availability"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Rooms"
          value="22"
          description="All room types"
          icon={<Bed className="h-4 w-4" />}
          trend={{
            value: 1,
            label: "from last month",
            direction: "up"
          }}
          variant="default"
        />

        <StatCard
          title="Available"
          value="12"
          description="Ready for guests"
          icon={<CheckCircle className="h-4 w-4" />}
          trend={{
            value: 3,
            label: "from last month",
            direction: "up"
          }}
          variant="success"
        />

        <StatCard
          title="Occupied"
          value="8"
          description="Currently occupied"
          icon={<Users className="h-4 w-4" />}
          trend={{
            value: 2,
            label: "from last month",
            direction: "up"
          }}
          variant="warning"
        />

        <StatCard
          title="Maintenance"
          value="2"
          description="Under maintenance"
          icon={<Wrench className="h-4 w-4" />}
          trend={{
            value: 1,
            label: "from last month",
            direction: "down"
          }}
          variant="error"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title">Room Status Overview</h2>
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
                  Add Room
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Room</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Guest</th>
                      <th>Check-out</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="font-bold">101</div>
                        </div>
                      </td>
                      <td>Standard</td>
                      <td>
                        <span className="badge badge-success">Available</span>
                      </td>
                      <td>-</td>
                      <td>-</td>
                      <td>
                        <button className="btn btn-ghost btn-xs">View</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="font-bold">102</div>
                        </div>
                      </td>
                      <td>Deluxe</td>
                      <td>
                        <span className="badge badge-warning">Occupied</span>
                      </td>
                      <td>John Smith</td>
                      <td>Tomorrow 11:00 AM</td>
                      <td>
                        <button className="btn btn-ghost btn-xs">View</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="font-bold">103</div>
                        </div>
                      </td>
                      <td>Suite</td>
                      <td>
                        <span className="badge badge-error">Maintenance</span>
                      </td>
                      <td>-</td>
                      <td>-</td>
                      <td>
                        <button className="btn btn-ghost btn-xs">View</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="font-bold">201</div>
                        </div>
                      </td>
                      <td>Standard</td>
                      <td>
                        <span className="badge badge-success">Available</span>
                      </td>
                      <td>-</td>
                      <td>-</td>
                      <td>
                        <button className="btn btn-ghost btn-xs">View</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="font-bold">202</div>
                        </div>
                      </td>
                      <td>Deluxe</td>
                      <td>
                        <span className="badge badge-warning">Occupied</span>
                      </td>
                      <td>Jane Doe</td>
                      <td>Today 2:00 PM</td>
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Maintenance
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Room Types</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Standard</span>
                  <span className="badge badge-primary">8 rooms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Deluxe</span>
                  <span className="badge badge-secondary">6 rooms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Suite</span>
                  <span className="badge badge-accent">4 rooms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Presidential</span>
                  <span className="badge badge-warning">2 rooms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Family</span>
                  <span className="badge badge-info">2 rooms</span>
                </div>
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
                  <p className="font-medium text-info">2:00 PM - Check-in</p>
                  <p className="text-base-content/70">Room 205 - Jane Doe</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-warning">
                    4:00 PM - Check-out
                  </p>
                  <p className="text-base-content/70">
                    Room 102 - Mike Johnson
                  </p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-primary">6:00 PM - Check-in</p>
                  <p className="text-base-content/70">
                    Room 301 - Sarah Wilson
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Staff Management - Buffr Host',
  description: 'Manage staff, schedules, and HR operations',
};

export default function StaffManagementPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content">Staff Management</h1>
        <p className="text-base-content/70 mt-2">
          Manage staff, schedules, payroll, and HR operations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Staff</div>
            <div className="stat-value text-primary">24</div>
            <div className="stat-desc">Active employees</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">On Duty</div>
            <div className="stat-value text-success">18</div>
            <div className="stat-desc">Currently working</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Departments</div>
            <div className="stat-value text-secondary">6</div>
            <div className="stat-desc">Active departments</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Pending Leave</div>
            <div className="stat-value text-warning">3</div>
            <div className="stat-desc">Leave requests</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title">Staff Directory</h2>
                <div className="flex space-x-2">
                  <select className="select select-bordered select-sm">
                    <option>All Departments</option>
                    <option>Front Desk</option>
                    <option>Housekeeping</option>
                    <option>Kitchen</option>
                    <option>Maintenance</option>
                    <option>Management</option>
                    <option>Spa</option>
                  </select>
                  <button className="btn btn-primary btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Staff
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Staff Member</th>
                      <th>Position</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Shift</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <Image src="/placeholder-avatar.jpg" alt="John Smith" width={40} height={40} className="rounded-full" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">John Smith</div>
                            <div className="text-sm opacity-50">john.smith@buffrhost.ai</div>
                          </div>
                        </div>
                      </td>
                      <td>Front Desk Manager</td>
                      <td>Front Desk</td>
                      <td><span className="badge badge-success">On Duty</span></td>
                      <td>Day Shift</td>
                      <td>
                        <button className="btn btn-ghost btn-xs">View</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <Image src="/placeholder-avatar.jpg" alt="Sarah Johnson" width={40} height={40} className="rounded-full" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">Sarah Johnson</div>
                            <div className="text-sm opacity-50">sarah.johnson@buffrhost.ai</div>
                          </div>
                        </div>
                      </td>
                      <td>Housekeeping Supervisor</td>
                      <td>Housekeeping</td>
                      <td><span className="badge badge-success">On Duty</span></td>
                      <td>Day Shift</td>
                      <td>
                        <button className="btn btn-ghost btn-xs">View</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <Image src="/placeholder-avatar.jpg" alt="Mike Wilson" width={40} height={40} className="rounded-full" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">Mike Wilson</div>
                            <div className="text-sm opacity-50">mike.wilson@buffrhost.ai</div>
                          </div>
                        </div>
                      </td>
                      <td>Head Chef</td>
                      <td>Kitchen</td>
                      <td><span className="badge badge-success">On Duty</span></td>
                      <td>Day Shift</td>
                      <td>
                        <button className="btn btn-ghost btn-xs">View</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <Image src="/placeholder-avatar.jpg" alt="Emma Davis" width={40} height={40} className="rounded-full" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">Emma Davis</div>
                            <div className="text-sm opacity-50">emma.davis@buffrhost.ai</div>
                          </div>
                        </div>
                      </td>
                      <td>Spa Therapist</td>
                      <td>Spa</td>
                      <td><span className="badge badge-warning">On Break</span></td>
                      <td>Day Shift</td>
                      <td>
                        <button className="btn btn-ghost btn-xs">View</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <Image src="/placeholder-avatar.jpg" alt="David Brown" width={40} height={40} className="rounded-full" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">David Brown</div>
                            <div className="text-sm opacity-50">david.brown@buffrhost.ai</div>
                          </div>
                        </div>
                      </td>
                      <td>Maintenance Technician</td>
                      <td>Maintenance</td>
                      <td><span className="badge badge-info">Off Duty</span></td>
                      <td>Night Shift</td>
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Staff
                </button>
                <button className="btn btn-outline w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Schedule Management
                </button>
                <button className="btn btn-outline w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Payroll
                </button>
                <button className="btn btn-outline w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Leave Requests
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Departments</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Front Desk</span>
                  <span className="badge badge-primary">5 staff</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Housekeeping</span>
                  <span className="badge badge-secondary">6 staff</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Kitchen</span>
                  <span className="badge badge-accent">4 staff</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Maintenance</span>
                  <span className="badge badge-info">3 staff</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Management</span>
                  <span className="badge badge-warning">3 staff</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Spa</span>
                  <span className="badge badge-success">3 staff</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Today&apos;s Schedule</h2>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium text-success">6:00 AM - Morning Shift</p>
                  <p className="text-base-content/70">Housekeeping team starts</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-info">8:00 AM - Day Shift</p>
                  <p className="text-base-content/70">Front desk and kitchen</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-warning">2:00 PM - Afternoon Break</p>
                  <p className="text-base-content/70">Spa services available</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-primary">6:00 PM - Evening Shift</p>
                  <p className="text-base-content/70">Night maintenance</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Pending Requests</h2>
              <div className="space-y-3">
                <div className="alert alert-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h3 className="font-bold">Leave Request</h3>
                    <div className="text-xs">Sarah Johnson - 3 days off</div>
                  </div>
                </div>
                <div className="alert alert-info">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-bold">Schedule Change</h3>
                    <div className="text-xs">Mike Wilson - Shift swap</div>
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

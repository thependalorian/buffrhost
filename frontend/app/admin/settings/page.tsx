import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'System Settings - Buffr Host',
  description: 'Configure system settings and preferences',
};

export default function SystemSettingsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content">System Settings</h1>
        <p className="text-base-content/70 mt-2">
          Configure system settings, preferences, and integrations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">General Settings</h2>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Property Name</span>
                  </label>
                  <input type="text" placeholder="Buffr Host Property" className="input input-bordered" />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Property Address</span>
                  </label>
                  <textarea className="textarea textarea-bordered" placeholder="Enter full address"></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Phone Number</span>
                    </label>
                    <input type="tel" placeholder="+264 61 123 456" className="input input-bordered" />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email Address</span>
                    </label>
                    <input type="email" placeholder="info@buffrhost.ai" className="input input-bordered" />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Timezone</span>
                  </label>
                  <select className="select select-bordered">
                    <option>Africa/Windhoek (GMT+2)</option>
                    <option>UTC (GMT+0)</option>
                    <option>Europe/London (GMT+0)</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Currency</span>
                  </label>
                  <select className="select select-bordered">
                    <option>Namibian Dollar (NAD)</option>
                    <option>South African Rand (ZAR)</option>
                    <option>US Dollar (USD)</option>
                    <option>Euro (EUR)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Service Configuration</h2>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Hotel Services</span>
                    <input type="checkbox" className="toggle toggle-primary" checked />
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Restaurant Services</span>
                    <input type="checkbox" className="toggle toggle-primary" checked />
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Spa Services</span>
                    <input type="checkbox" className="toggle toggle-primary" checked />
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Conference Facilities</span>
                    <input type="checkbox" className="toggle toggle-primary" />
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Transportation Services</span>
                    <input type="checkbox" className="toggle toggle-primary" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Payment Settings</h2>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Stripe Public Key</span>
                  </label>
                  <input type="text" placeholder="pk_test_..." className="input input-bordered" />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Stripe Secret Key</span>
                  </label>
                  <input type="password" placeholder="sk_test_..." className="input input-bordered" />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">PayPal Client ID</span>
                  </label>
                  <input type="text" placeholder="PayPal Client ID" className="input input-bordered" />
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Enable Test Mode</span>
                    <input type="checkbox" className="toggle toggle-warning" checked />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">AI Configuration</h2>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">OpenAI API Key</span>
                  </label>
                  <input type="password" placeholder="sk-..." className="input input-bordered" />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">AI Model</span>
                  </label>
                  <select className="select select-bordered">
                    <option>GPT-4</option>
                    <option>GPT-3.5 Turbo</option>
                    <option>Claude 3</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Enable AI Receptionist</span>
                    <input type="checkbox" className="toggle toggle-primary" checked />
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Enable Voice Features</span>
                    <input type="checkbox" className="toggle toggle-primary" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">System Status</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Database</span>
                  <span className="badge badge-success">Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Payment Gateway</span>
                  <span className="badge badge-success">Connected</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>AI Services</span>
                  <span className="badge badge-success">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Email Service</span>
                  <span className="badge badge-warning">Limited</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>SMS Service</span>
                  <span className="badge badge-error">Offline</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Quick Actions</h2>
              <div className="space-y-3">
                <button className="btn btn-outline w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Test Connections
                </button>
                <button className="btn btn-outline w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Settings
                </button>
                <button className="btn btn-outline w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Import Settings
                </button>
                <button className="btn btn-outline w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Backup & Security</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Last Backup</span>
                  <span className="text-sm text-base-content/70">2 hours ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Backup Frequency</span>
                  <span className="text-sm text-base-content/70">Daily</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>SSL Certificate</span>
                  <span className="badge badge-success">Valid</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Firewall Status</span>
                  <span className="badge badge-success">Active</span>
                </div>
                <button className="btn btn-primary btn-sm w-full mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Create Backup
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">System Information</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Version:</span>
                  <span>v1.2.3</span>
                </div>
                <div className="flex justify-between">
                  <span>Build:</span>
                  <span>2025.01.15</span>
                </div>
                <div className="flex justify-between">
                  <span>Uptime:</span>
                  <span>15 days</span>
                </div>
                <div className="flex justify-between">
                  <span>Database:</span>
                  <span>PostgreSQL 15</span>
                </div>
                <div className="flex justify-between">
                  <span>Server:</span>
                  <span>Ubuntu 22.04</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          Save Settings
        </button>
      </div>
    </div>
  );
}

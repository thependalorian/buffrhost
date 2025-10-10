"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  Settings, 
  Save,
  Eye,
  EyeOff,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  CreditCard,
  Bell,
  Shield,
  Database,
  Wifi,
  Camera,
  Palette,
  Languages,
  Users,
  Key,
  Upload,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

export default function EtunaSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [showPasswords, setShowPasswords] = useState(false);

  // Sample settings data
  const generalSettings = {
    businessName: 'Etuna Guesthouse & Tours',
    businessType: 'Guesthouse & Tours',
    email: 'info@etuna.com',
    phone: '+264 61 123 4567',
    address: '123 Wildlife Drive, Windhoek, Namibia',
    website: 'https://www.etuna.com',
    timezone: 'Africa/Windhoek',
    currency: 'NAD',
    language: 'English',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24-hour'
  };

  const businessSettings = {
    checkInTime: '14:00',
    checkOutTime: '11:00',
    cancellationPolicy: '24 hours',
    petPolicy: 'Pets allowed with additional fee',
    smokingPolicy: 'Non-smoking rooms available',
    wifiPassword: 'EtunaGuest2024',
    parkingSpaces: 25,
    maxOccupancy: 50,
    breakfastIncluded: true,
    airportShuttle: true
  };

  const paymentSettings = {
    paymentMethods: ['Credit Card', 'Bank Transfer', 'Cash', 'Mobile Payment'],
    currency: 'NAD',
    taxRate: 15,
    serviceCharge: 10,
    depositRequired: true,
    depositPercentage: 20,
    refundPolicy: 'Full refund if cancelled 24 hours before check-in',
    paymentGateway: 'PayGate',
    merchantId: 'ETUNA001',
    apiKey: 'pk_live_etuna_2024_secure_key',
    webhookUrl: 'https://api.etuna.com/webhooks/payment'
  };

  const notificationSettings = {
    emailNotifications: {
      newBooking: true,
      cancellation: true,
      paymentReceived: true,
      checkInReminder: true,
      checkOutReminder: true,
      guestMessage: true,
      lowInventory: true,
      maintenanceAlert: true
    },
    smsNotifications: {
      urgentMessages: true,
      checkInReminder: true,
      tourReminders: true,
      paymentConfirmation: true
    },
    pushNotifications: {
      allNotifications: false,
      bookingUpdates: true,
      guestRequests: true
    }
  };

  const securitySettings = {
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordPolicy: 'Strong passwords required',
    loginAttempts: 5,
    ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
    sslEnabled: true,
    dataEncryption: true,
    auditLogging: true,
    backupFrequency: 'Daily',
    lastBackup: '2024-01-20 02:00:00'
  };

  const integrationSettings = {
    bookingEngine: 'Reservations.com',
    channelManager: 'SiteMinder',
    paymentGateway: 'PayGate',
    emailService: 'SendGrid',
    smsService: 'Twilio',
    analytics: 'Google Analytics',
    socialMedia: ['Facebook', 'Instagram', 'Twitter'],
    reviewPlatforms: ['TripAdvisor', 'Booking.com', 'Google Reviews'],
    calendarSync: 'Google Calendar',
    crmIntegration: 'HubSpot'
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'business', label: 'Business', icon: Users },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Database },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'backup', label: 'Backup', icon: Database }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Settings"
        description="Configure system settings, preferences, and integrations for Etuna Guesthouse"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Etuna Management', href: '/protected/etuna' },
          { label: 'Settings', href: '/protected/etuna/settings' }
        ]}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <div className="tabs tabs-boxed">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <TabIcon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* General Settings Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">General Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Business Name</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      defaultValue={generalSettings.businessName}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Business Type</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      defaultValue={generalSettings.businessType}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      className="input input-bordered"
                      defaultValue={generalSettings.email}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Phone</span>
                    </label>
                    <input
                      type="tel"
                      className="input input-bordered"
                      defaultValue={generalSettings.phone}
                    />
                  </div>
                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text">Address</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered"
                      defaultValue={generalSettings.address}
                    ></textarea>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Website</span>
                    </label>
                    <input
                      type="url"
                      className="input input-bordered"
                      defaultValue={generalSettings.website}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Timezone</span>
                    </label>
                    <select className="select select-bordered">
                      <option value="Africa/Windhoek">Africa/Windhoek</option>
                      <option value="Africa/Johannesburg">Africa/Johannesburg</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Currency</span>
                    </label>
                    <select className="select select-bordered">
                      <option value="NAD">NAD (Namibian Dollar)</option>
                      <option value="USD">USD (US Dollar)</option>
                      <option value="EUR">EUR (Euro)</option>
                      <option value="ZAR">ZAR (South African Rand)</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Language</span>
                    </label>
                    <select className="select select-bordered">
                      <option value="English">English</option>
                      <option value="Afrikaans">Afrikaans</option>
                      <option value="German">German</option>
                      <option value="Portuguese">Portuguese</option>
                    </select>
                  </div>
                </div>
                <div className="card-actions justify-end mt-6">
                  <ActionButton>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Business Settings Tab */}
        {activeTab === 'business' && (
          <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Business Operations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Check-in Time</span>
                    </label>
                    <input
                      type="time"
                      className="input input-bordered"
                      defaultValue={businessSettings.checkInTime}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Check-out Time</span>
                    </label>
                    <input
                      type="time"
                      className="input input-bordered"
                      defaultValue={businessSettings.checkOutTime}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Cancellation Policy</span>
                    </label>
                    <select className="select select-bordered">
                      <option value="24 hours">24 hours</option>
                      <option value="48 hours">48 hours</option>
                      <option value="7 days">7 days</option>
                      <option value="No cancellation">No cancellation</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Parking Spaces</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered"
                      defaultValue={businessSettings.parkingSpaces}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Max Occupancy</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered"
                      defaultValue={businessSettings.maxOccupancy}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">WiFi Password</span>
                    </label>
                    <div className="input-group">
                      <input
                        type={showPasswords ? 'text' : 'password'}
                        className="input input-bordered flex-1"
                        defaultValue={businessSettings.wifiPassword}
                      />
                      <button
                        className="btn btn-square"
                        onClick={() => setShowPasswords(!showPasswords)}
                      >
                        {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text">Pet Policy</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered"
                      defaultValue={businessSettings.petPolicy}
                    ></textarea>
                  </div>
                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text">Smoking Policy</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered"
                      defaultValue={businessSettings.smokingPolicy}
                    ></textarea>
                  </div>
                </div>
                <div className="card-actions justify-end mt-6">
                  <ActionButton>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Settings Tab */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Payment Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Payment Gateway</span>
                    </label>
                    <select className="select select-bordered">
                      <option value="PayGate">PayGate</option>
                      <option value="PayPal">PayPal</option>
                      <option value="Stripe">Stripe</option>
                      <option value="Square">Square</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Merchant ID</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      defaultValue={paymentSettings.merchantId}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">API Key</span>
                    </label>
                    <div className="input-group">
                      <input
                        type={showPasswords ? 'text' : 'password'}
                        className="input input-bordered flex-1"
                        defaultValue={paymentSettings.apiKey}
                      />
                      <button
                        className="btn btn-square"
                        onClick={() => setShowPasswords(!showPasswords)}
                      >
                        {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Tax Rate (%)</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered"
                      defaultValue={paymentSettings.taxRate}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Service Charge (%)</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered"
                      defaultValue={paymentSettings.serviceCharge}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Deposit Required (%)</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered"
                      defaultValue={paymentSettings.depositPercentage}
                    />
                  </div>
                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text">Webhook URL</span>
                    </label>
                    <input
                      type="url"
                      className="input input-bordered"
                      defaultValue={paymentSettings.webhookUrl}
                    />
                  </div>
                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text">Refund Policy</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered"
                      defaultValue={paymentSettings.refundPolicy}
                    ></textarea>
                  </div>
                </div>
                <div className="card-actions justify-end mt-6">
                  <ActionButton>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Settings Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Email Notifications</h3>
                <div className="space-y-4">
                  {Object.entries(notificationSettings.emailNotifications).map(([key, value]) => (
                    <div key={key} className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          defaultChecked={value}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">SMS Notifications</h3>
                <div className="space-y-4">
                  {Object.entries(notificationSettings.smsNotifications).map(([key, value]) => (
                    <div key={key} className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          defaultChecked={value}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Push Notifications</h3>
                <div className="space-y-4">
                  {Object.entries(notificationSettings.pushNotifications).map(([key, value]) => (
                    <div key={key} className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          defaultChecked={value}
                        />
                      </label>
                    </div>
                  ))}
                </div>
                <div className="card-actions justify-end mt-6">
                  <ActionButton>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Security Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Two-Factor Authentication</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        defaultChecked={securitySettings.twoFactorAuth}
                      />
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Session Timeout (minutes)</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered"
                      defaultValue={securitySettings.sessionTimeout}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Max Login Attempts</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered"
                      defaultValue={securitySettings.loginAttempts}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Backup Frequency</span>
                    </label>
                    <select className="select select-bordered">
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>
                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text">IP Whitelist</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered"
                      defaultValue={securitySettings.ipWhitelist.join('\n')}
                    ></textarea>
                  </div>
                </div>
                <div className="card-actions justify-end mt-6">
                  <ActionButton>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Integrations Settings Tab */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Third-Party Integrations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Booking Engine</span>
                    </label>
                    <select className="select select-bordered">
                      <option value="Reservations.com">Reservations.com</option>
                      <option value="Booking.com">Booking.com</option>
                      <option value="Expedia">Expedia</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Channel Manager</span>
                    </label>
                    <select className="select select-bordered">
                      <option value="SiteMinder">SiteMinder</option>
                      <option value="BookingSync">BookingSync</option>
                      <option value="MyAllocator">MyAllocator</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email Service</span>
                    </label>
                    <select className="select select-bordered">
                      <option value="SendGrid">SendGrid</option>
                      <option value="Mailgun">Mailgun</option>
                      <option value="Amazon SES">Amazon SES</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">SMS Service</span>
                    </label>
                    <select className="select select-bordered">
                      <option value="Twilio">Twilio</option>
                      <option value="AWS SNS">AWS SNS</option>
                      <option value="MessageBird">MessageBird</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Analytics</span>
                    </label>
                    <select className="select select-bordered">
                      <option value="Google Analytics">Google Analytics</option>
                      <option value="Adobe Analytics">Adobe Analytics</option>
                      <option value="Mixpanel">Mixpanel</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">CRM Integration</span>
                    </label>
                    <select className="select select-bordered">
                      <option value="HubSpot">HubSpot</option>
                      <option value="Salesforce">Salesforce</option>
                      <option value="Pipedrive">Pipedrive</option>
                    </select>
                  </div>
                </div>
                <div className="card-actions justify-end mt-6">
                  <ActionButton>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appearance Settings Tab */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Theme & Appearance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Theme</span>
                    </label>
                    <select className="select select-bordered">
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Primary Color</span>
                    </label>
                    <input
                      type="color"
                      className="input input-bordered w-full h-12"
                      defaultValue="#3b82f6"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Logo</span>
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="avatar">
                        <div className="w-16 rounded">
                          <img src="/logo.png" alt="Logo" />
                        </div>
                      </div>
                      <ActionButton variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Logo
                      </ActionButton>
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Favicon</span>
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="avatar">
                        <div className="w-8 rounded">
                          <img src="/favicon.ico" alt="Favicon" />
                        </div>
                      </div>
                      <ActionButton variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Favicon
                      </ActionButton>
                    </div>
                  </div>
                </div>
                <div className="card-actions justify-end mt-6">
                  <ActionButton>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Backup Settings Tab */}
        {activeTab === 'backup' && (
          <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Data Backup & Recovery</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Last Backup</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span className="font-semibold">{securitySettings.lastBackup}</span>
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Backup Status</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span className="font-semibold text-success">Success</span>
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Backup Size</span>
                    </label>
                    <span className="font-semibold">2.4 GB</span>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Storage Used</span>
                    </label>
                    <span className="font-semibold">45% of 10 GB</span>
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <ActionButton>
                    <Download className="w-4 h-4 mr-2" />
                    Download Backup
                  </ActionButton>
                  <ActionButton variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Restore Backup
                  </ActionButton>
                  <ActionButton variant="outline">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Old Backups
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-blue-500 text-white">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Settings Categories</p>
                  <p className="text-2xl font-bold">{tabs.length}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-green-500 text-white">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Active Integrations</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-purple-500 text-white">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Security Features</p>
                  <p className="text-2xl font-bold">6</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Notification Types</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
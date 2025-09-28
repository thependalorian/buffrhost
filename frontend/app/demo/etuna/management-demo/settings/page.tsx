'use client';

import { useState } from 'react';
import {
  Settings,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Lock,
  Key,
  Bell,
  Shield,
  Database,
  Server,
  Wifi,
  Monitor,
  Smartphone,
  Tablet,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Plus,
  Edit,
  Search,
  Filter,
  Phone as PhoneIcon,
  Mail as MailIcon,
  MapPin as MapPinIcon,
  Globe as GlobeIcon,
  Building as BuildingIcon,
  Home,
  Key as KeyIcon,
  Lock as LockIcon,
  Unlock,
  Check,
  X as XIcon,
  AlertTriangle,
  Info,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  MoreVertical,
  Grid,
  List,
  Target,
  Award,
  Crown,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  Laugh,
  Angry,
  Sad,
  Surprised,
  Confused,
  Wink,
  Kiss,
  Tongue,
  RollingEyes,
  Shush,
  Thinking,
  Sleeping,
  Dizzy,
  Sick,
  Mask,
  Sunglasses,
  Glasses,
  Headphones,
  Microphone,
  Camera,
  Video,
  Image,
  Music,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Stop,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  RotateCcw,
  RotateCw,
  Maximize,
  Minimize,
  Move,
  Copy,
  Scissors,
  Clipboard,
  Bookmark,
  Tag,
  Flag,
  Pin,
  Map,
  Compass,
  Navigation,
  Route,
  Truck,
  Plane,
  Train,
  Bus,
  Ship,
  Bike,
  Scooter,
  Motorcycle,
  Car as CarIcon,
  Parking,
  Gas,
  Battery,
  Plug,
  Wrench,
  Hammer,
  Screwdriver,
  Drill,
  Saw,
  Axe,
  Pickaxe,
  Shovel,
  Rake,
  Hoe,
  Scythe,
  Pitchfork,
  Fork,
  Knife,
  Spoon,
  Cup,
  Mug,
  Glass,
  Bottle,
  Jar,
  Can,
  Box,
  Bag,
  Basket,
  Bucket,
  Pot,
  Pan,
  Plate,
  Bowl,
  Tray,
  Dish,
  Saucer,
  Napkin,
  Tablecloth,
  Candle,
  Lamp,
  Lightbulb,
  Flashlight,
  Torch,
  Fire,
  Flame,
  Spark,
  Explosion,
  Bomb,
  Grenade,
  Sword,
  Armor,
  Helmet,
  Crown as CrownIcon,
  Scepter,
  Orb,
  Gem,
  Diamond,
  Ruby,
  Emerald,
  Sapphire,
  Pearl,
  Gold,
  Silver,
  Bronze,
  Copper,
  Iron,
  Steel,
  Aluminum,
  Titanium,
  Platinum,
  Palladium,
  Rhodium,
  Iridium,
  Osmium,
  Ruthenium,
  Rhenium,
  Tungsten,
  Molybdenum,
  Chromium,
  Vanadium,
  Niobium,
  Tantalum,
  Hafnium,
  Zirconium,
  Yttrium,
  Lanthanum,
  Cerium,
  Praseodymium,
  Neodymium,
  Promethium,
  Samarium,
  Europium,
  Gadolinium,
  Terbium,
  Dysprosium,
  Holmium,
  Erbium,
  Thulium,
  Ytterbium,
  Lutetium,
  Actinium,
  Thorium,
  Protactinium,
  Uranium,
  Neptunium,
  Plutonium,
  Americium,
  Curium,
  Berkelium,
  Californium,
  Einsteinium,
  Fermium,
  Mendelevium,
  Nobelium,
  Lawrencium,
  Rutherfordium,
  Dubnium,
  Seaborgium,
  Bohrium,
  Hassium,
  Meitnerium,
  Darmstadtium,
  Roentgenium,
  Copernicium,
  Nihonium,
  Flerovium,
  Moscovium,
  Livermorium,
  Tennessine,
  Oganesson,
  ArrowLeft,
  Download as DownloadIcon,
  Upload as UploadIcon,
  FileText,
  CreditCard,
  Wifi as WifiIcon,
  Dumbbell,
  Waves,
  Utensils,
  Coffee,
  Smartphone as SmartphoneIcon,
  Monitor as MonitorIcon,
  Tablet as TabletIcon,
  Eye as EyeIcon,
  Share2,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  User as UserIcon,
  Bed,
  Car,
  Utensils as UtensilsIcon,
  Calendar,
  Clock,
  Star,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  PieChart
} from 'lucide-react';
import Link from 'next/link';

export default function SettingsManagementPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);

  // Mock settings data
  const generalSettings = {
    propertyName: 'Etuna Guesthouse & Tours',
    propertyType: 'Guesthouse',
    address: '123 Main Street, Windhoek, Namibia',
    phone: '+264 61 123 4567',
    email: 'info@etuna.com',
    website: 'https://www.etuna.com',
    timezone: 'Africa/Windhoek',
    currency: 'NAD',
    language: 'English',
    checkInTime: '14:00',
    checkOutTime: '11:00',
    maxGuests: 50,
    totalRooms: 25
  };

  const notificationSettings = {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    bookingAlerts: true,
    paymentAlerts: true,
    maintenanceAlerts: true,
    marketingEmails: false,
    weeklyReports: true,
    monthlyReports: true
  };

  const securitySettings = {
    twoFactorAuth: true,
    passwordExpiry: 90,
    sessionTimeout: 30,
    loginAttempts: 5,
    ipWhitelist: false,
    auditLogging: true,
    dataEncryption: true,
    backupFrequency: 'daily'
  };

  const systemSettings = {
    maintenanceMode: false,
    autoBackup: true,
    logLevel: 'info',
    cacheEnabled: true,
    cdnEnabled: false,
    sslEnabled: true,
    apiRateLimit: 1000,
    maxFileSize: '10MB'
  };

  const integrations = [
    {
      id: 'INT001',
      name: 'Payment Gateway',
      type: 'Payment',
      status: 'connected',
      description: 'Credit card and mobile payment processing',
      lastSync: '2024-01-15 10:30'
    },
    {
      id: 'INT002',
      name: 'Email Service',
      type: 'Communication',
      status: 'connected',
      description: 'Transactional and marketing email delivery',
      lastSync: '2024-01-15 09:15'
    },
    {
      id: 'INT003',
      name: 'SMS Gateway',
      type: 'Communication',
      status: 'connected',
      description: 'SMS notifications and alerts',
      lastSync: '2024-01-15 08:45'
    },
    {
      id: 'INT004',
      name: 'Analytics',
      type: 'Analytics',
      status: 'disconnected',
      description: 'Website and business analytics',
      lastSync: '2024-01-10 14:20'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'badge-success';
      case 'disconnected':
        return 'badge-error';
      case 'pending':
        return 'badge-warning';
      default:
        return 'badge-neutral';
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-primary text-primary-content p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">System Settings</h1>
              <p className="text-primary-content/80">
                Configure system settings, preferences, and integrations for Etuna Guesthouse
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/demo/etuna/management-demo"
                className="btn btn-outline btn-sm text-white border-white hover:bg-white hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Management
              </Link>
              <button className="btn btn-accent btn-sm">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Settings Tabs */}
        <div className="tabs tabs-boxed mb-6">
          <button 
            className={`tab ${activeTab === 'general' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button 
            className={`tab ${activeTab === 'notifications' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
          <button 
            className={`tab ${activeTab === 'security' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
          <button 
            className={`tab ${activeTab === 'integrations' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('integrations')}
          >
            Integrations
          </button>
          <button 
            className={`tab ${activeTab === 'system' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
            System
          </button>
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="card bg-base-100 shadow-xl mb-8">
            <div className="card-body">
              <h3 className="text-2xl font-bold mb-4">General Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Property Name</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={generalSettings.propertyName}
                      onChange={(e) => {/* Handle change */}}
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Property Type</span>
                    </label>
                    <select className="select select-bordered w-full">
                      <option value="guesthouse">Guesthouse</option>
                      <option value="hotel">Hotel</option>
                      <option value="lodge">Lodge</option>
                      <option value="resort">Resort</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Address</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered w-full"
                      value={generalSettings.address}
                      onChange={(e) => {/* Handle change */}}
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Phone</span>
                    </label>
                    <input
                      type="tel"
                      className="input input-bordered w-full"
                      value={generalSettings.phone}
                      onChange={(e) => {/* Handle change */}}
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      className="input input-bordered w-full"
                      value={generalSettings.email}
                      onChange={(e) => {/* Handle change */}}
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Website</span>
                    </label>
                    <input
                      type="url"
                      className="input input-bordered w-full"
                      value={generalSettings.website}
                      onChange={(e) => {/* Handle change */}}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Timezone</span>
                    </label>
                    <select className="select select-bordered w-full">
                      <option value="Africa/Windhoek">Africa/Windhoek</option>
                      <option value="UTC">UTC</option>
                      <option value="Africa/Johannesburg">Africa/Johannesburg</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Currency</span>
                    </label>
                    <select className="select select-bordered w-full">
                      <option value="NAD">Namibian Dollar (NAD)</option>
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="ZAR">South African Rand (ZAR)</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Language</span>
                    </label>
                    <select className="select select-bordered w-full">
                      <option value="en">English</option>
                      <option value="af">Afrikaans</option>
                      <option value="de">German</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text">Check-in Time</span>
                      </label>
                      <input
                        type="time"
                        className="input input-bordered w-full"
                        value={generalSettings.checkInTime}
                        onChange={(e) => {/* Handle change */}}
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Check-out Time</span>
                      </label>
                      <input
                        type="time"
                        className="input input-bordered w-full"
                        value={generalSettings.checkOutTime}
                        onChange={(e) => {/* Handle change */}}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text">Max Guests</span>
                      </label>
                      <input
                        type="number"
                        className="input input-bordered w-full"
                        value={generalSettings.maxGuests}
                        onChange={(e) => {/* Handle change */}}
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Total Rooms</span>
                      </label>
                      <input
                        type="number"
                        className="input input-bordered w-full"
                        value={generalSettings.totalRooms}
                        onChange={(e) => {/* Handle change */}}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="card bg-base-100 shadow-xl mb-8">
            <div className="card-body">
              <h3 className="text-2xl font-bold mb-4">Notification Settings</h3>
              <div className="space-y-4">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <p className="text-sm text-base-content/60">
                        {key === 'emailNotifications' && 'Receive email notifications for important events'}
                        {key === 'smsNotifications' && 'Receive SMS notifications for urgent matters'}
                        {key === 'pushNotifications' && 'Receive push notifications on mobile devices'}
                        {key === 'bookingAlerts' && 'Get alerts for new bookings and cancellations'}
                        {key === 'paymentAlerts' && 'Get alerts for payments and refunds'}
                        {key === 'maintenanceAlerts' && 'Get alerts for maintenance and system issues'}
                        {key === 'marketingEmails' && 'Receive marketing emails and promotions'}
                        {key === 'weeklyReports' && 'Receive weekly performance reports'}
                        {key === 'monthlyReports' && 'Receive monthly business reports'}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={value}
                      onChange={(e) => {/* Handle change */}}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="card bg-base-100 shadow-xl mb-8">
            <div className="card-body">
              <h3 className="text-2xl font-bold mb-4">Security Settings</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">
                      <span className="label-text">Two-Factor Authentication</span>
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={securitySettings.twoFactorAuth}
                        onChange={(e) => {/* Handle change */}}
                      />
                      <span className="text-sm text-base-content/60">
                        {securitySettings.twoFactorAuth ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Password Expiry (days)</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      value={securitySettings.passwordExpiry}
                      onChange={(e) => {/* Handle change */}}
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Session Timeout (minutes)</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => {/* Handle change */}}
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Max Login Attempts</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      value={securitySettings.loginAttempts}
                      onChange={(e) => {/* Handle change */}}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  {Object.entries(securitySettings).slice(4).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <p className="text-sm text-base-content/60">
                          {key === 'ipWhitelist' && 'Restrict access to specific IP addresses'}
                          {key === 'auditLogging' && 'Log all system activities and user actions'}
                          {key === 'dataEncryption' && 'Encrypt sensitive data at rest'}
                          {key === 'backupFrequency' && 'Automated backup frequency'}
                        </p>
                      </div>
                      {typeof value === 'boolean' ? (
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={value}
                          onChange={(e) => {/* Handle change */}}
                        />
                      ) : (
                        <select className="select select-bordered">
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Integrations */}
        {activeTab === 'integrations' && (
          <div className="card bg-base-100 shadow-xl mb-8">
            <div className="card-body">
              <h3 className="text-2xl font-bold mb-4">System Integrations</h3>
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <div key={integration.id} className="card bg-base-200 shadow-sm">
                    <div className="card-body">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content rounded-full w-12">
                              <span className="text-lg font-bold">
                                {integration.name[0]}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">{integration.name}</h4>
                            <p className="text-sm text-base-content/60">{integration.description}</p>
                            <p className="text-xs text-base-content/60">
                              Last sync: {integration.lastSync}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`badge ${getStatusColor(integration.status)}`}>
                            {integration.status}
                          </span>
                          <button className="btn btn-ghost btn-sm">
                            <Settings className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* System Settings */}
        {activeTab === 'system' && (
          <div className="card bg-base-100 shadow-xl mb-8">
            <div className="card-body">
              <h3 className="text-2xl font-bold mb-4">System Settings</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">
                      <span className="label-text">Maintenance Mode</span>
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={systemSettings.maintenanceMode}
                        onChange={(e) => {/* Handle change */}}
                      />
                      <span className="text-sm text-base-content/60">
                        {systemSettings.maintenanceMode ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Auto Backup</span>
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={systemSettings.autoBackup}
                        onChange={(e) => {/* Handle change */}}
                      />
                      <span className="text-sm text-base-content/60">
                        {systemSettings.autoBackup ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Log Level</span>
                    </label>
                    <select className="select select-bordered w-full">
                      <option value="debug">Debug</option>
                      <option value="info">Info</option>
                      <option value="warn">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">API Rate Limit</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      value={systemSettings.apiRateLimit}
                      onChange={(e) => {/* Handle change */}}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  {Object.entries(systemSettings).slice(4).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <p className="text-sm text-base-content/60">
                          {key === 'cacheEnabled' && 'Enable system caching for better performance'}
                          {key === 'cdnEnabled' && 'Enable Content Delivery Network'}
                          {key === 'sslEnabled' && 'Enable SSL/TLS encryption'}
                          {key === 'maxFileSize' && 'Maximum file upload size'}
                        </p>
                      </div>
                      {typeof value === 'boolean' ? (
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={value}
                          onChange={(e) => {/* Handle change */}}
                        />
                      ) : (
                        <input
                          type="text"
                          className="input input-bordered w-32"
                          value={value}
                          onChange={(e) => {/* Handle change */}}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Settings className="w-8 h-8" />
              </div>
              <div className="stat-title">System Status</div>
              <div className="stat-value text-primary">Online</div>
              <div className="stat-desc">All systems operational</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <Shield className="w-8 h-8" />
              </div>
              <div className="stat-title">Security</div>
              <div className="stat-value text-secondary">High</div>
              <div className="stat-desc">Security level</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-accent">
                <Database className="w-8 h-8" />
              </div>
              <div className="stat-title">Backups</div>
              <div className="stat-value text-accent">Daily</div>
              <div className="stat-desc">Backup frequency</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <Server className="w-8 h-8" />
              </div>
              <div className="stat-title">Uptime</div>
              <div className="stat-value text-info">99.9%</div>
              <div className="stat-desc">System uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

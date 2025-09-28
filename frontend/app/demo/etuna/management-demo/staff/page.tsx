'use client';

import { useState } from 'react';
import {
  Users,
  User,
  Clock,
  Calendar,
  Star,
  Award,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  PieChart,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  MapPin,
  Globe,
  Building,
  Home,
  Key,
  Lock,
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
  Shield,
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
  RefreshCw,
  Download,
  Upload,
  Settings,
  Bell,
  MessageSquare,
  FileText,
  CreditCard,
  Wifi,
  Dumbbell,
  Waves,
  Utensils,
  Coffee,
  Smartphone,
  Monitor,
  Tablet,
  Eye as EyeIcon,
  Share2,
  X,
  Phone as PhoneIcon,
  Mail as MailIcon,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bed,
  Car,
  Utensils as UtensilsIcon,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';

export default function StaffManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for staff
  const staff = [
    {
      id: 'STAFF001',
      name: 'John Safari',
      position: 'Tour Guide',
      department: 'Tours',
      email: 'john.safari@etuna.com',
      phone: '+264 81 123 4567',
      status: 'active',
      hireDate: '2022-03-15',
      salary: 8000,
      performance: 4.8,
      attendance: 98,
      skills: ['Wildlife Knowledge', 'Customer Service', 'First Aid', 'Languages'],
      certifications: ['Tour Guide License', 'First Aid Certificate'],
      emergencyContact: 'Jane Safari (+264 81 987 6543)',
      address: '123 Safari Street, Windhoek',
      nextReview: '2024-04-15',
      notes: 'Excellent performance, great with guests'
    },
    {
      id: 'STAFF002',
      name: 'Maria Chef',
      position: 'Head Chef',
      department: 'Restaurant',
      email: 'maria.chef@etuna.com',
      phone: '+264 81 234 5678',
      status: 'active',
      hireDate: '2021-06-10',
      salary: 12000,
      performance: 4.9,
      attendance: 100,
      skills: ['Culinary Arts', 'Menu Planning', 'Kitchen Management', 'Food Safety'],
      certifications: ['Culinary Arts Diploma', 'Food Safety Certificate'],
      emergencyContact: 'Carlos Chef (+264 81 876 5432)',
      address: '456 Chef Avenue, Windhoek',
      nextReview: '2024-06-10',
      notes: 'Outstanding culinary skills, team leader'
    },
    {
      id: 'STAFF003',
      name: 'Peter Waiter',
      position: 'Senior Waiter',
      department: 'Restaurant',
      email: 'peter.waiter@etuna.com',
      phone: '+264 81 345 6789',
      status: 'active',
      hireDate: '2023-01-20',
      salary: 6000,
      performance: 4.6,
      attendance: 95,
      skills: ['Customer Service', 'Wine Knowledge', 'Table Service', 'Languages'],
      certifications: ['Hospitality Certificate', 'Wine Service Certificate'],
      emergencyContact: 'Sarah Waiter (+264 81 765 4321)',
      address: '789 Service Road, Windhoek',
      nextReview: '2024-01-20',
      notes: 'Good customer service, needs improvement in wine knowledge'
    },
    {
      id: 'STAFF004',
      name: 'Anna Housekeeper',
      position: 'Housekeeping Supervisor',
      department: 'Housekeeping',
      email: 'anna.housekeeper@etuna.com',
      phone: '+264 81 456 7890',
      status: 'active',
      hireDate: '2020-09-05',
      salary: 7000,
      performance: 4.7,
      attendance: 97,
      skills: ['Housekeeping', 'Team Management', 'Quality Control', 'Inventory'],
      certifications: ['Housekeeping Certificate', 'Supervisor Training'],
      emergencyContact: 'Michael Housekeeper (+264 81 654 3210)',
      address: '321 Clean Street, Windhoek',
      nextReview: '2024-09-05',
      notes: 'Reliable supervisor, maintains high standards'
    },
    {
      id: 'STAFF005',
      name: 'David Reception',
      position: 'Front Desk Manager',
      department: 'Reception',
      email: 'david.reception@etuna.com',
      phone: '+264 81 567 8901',
      status: 'on_leave',
      hireDate: '2019-11-12',
      salary: 10000,
      performance: 4.8,
      attendance: 92,
      skills: ['Customer Service', 'Reservations', 'Languages', 'Problem Solving'],
      certifications: ['Hospitality Management', 'Customer Service Excellence'],
      emergencyContact: 'Lisa Reception (+264 81 543 2109)',
      address: '654 Front Desk Avenue, Windhoek',
      nextReview: '2024-11-12',
      notes: 'Currently on maternity leave, excellent manager'
    }
  ];

  const schedules = [
    {
      id: 'SCHED001',
      staffId: 'STAFF001',
      staffName: 'John Safari',
      date: '2024-01-20',
      shift: '06:00 - 18:00',
      type: 'Tour Guide',
      status: 'scheduled',
      notes: 'Etosha Safari Tour'
    },
    {
      id: 'SCHED002',
      staffId: 'STAFF002',
      staffName: 'Maria Chef',
      date: '2024-01-20',
      shift: '06:00 - 22:00',
      type: 'Kitchen',
      status: 'scheduled',
      notes: 'Regular kitchen shift'
    },
    {
      id: 'SCHED003',
      staffId: 'STAFF003',
      staffName: 'Peter Waiter',
      date: '2024-01-20',
      shift: '11:00 - 23:00',
      type: 'Restaurant',
      status: 'scheduled',
      notes: 'Dinner service'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'on_leave':
        return 'badge-warning';
      case 'inactive':
        return 'badge-error';
      case 'terminated':
        return 'badge-neutral';
      default:
        return 'badge-neutral';
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 4.5) return 'text-success';
    if (performance >= 4.0) return 'text-warning';
    return 'text-error';
  };

  const filteredStaff = staff.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-primary text-primary-content p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Staff Management</h1>
              <p className="text-primary-content/80">
                Manage staff, schedules, and HR operations for Etuna Guesthouse
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
                <Plus className="w-4 h-4 mr-2" />
                Add Staff
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Tabs */}
        <div className="tabs tabs-boxed mb-6">
          <button className="tab tab-active">Staff</button>
          <button className="tab">Schedules</button>
          <button className="tab">Performance</button>
          <button className="tab">Payroll</button>
        </div>

        {/* Filters and Search */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search staff by name, position, or department..."
                    className="input input-bordered w-full pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  className="select select-bordered"
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                >
                  <option value="all">All Departments</option>
                  <option value="Tours">Tours</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Reception">Reception</option>
                  <option value="Management">Management</option>
                </select>
                <select
                  className="select select-bordered"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="on_leave">On Leave</option>
                  <option value="inactive">Inactive</option>
                  <option value="terminated">Terminated</option>
                </select>
                <button className="btn btn-outline">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </button>
                <button className="btn btn-outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredStaff.map((employee) => (
            <div key={employee.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="avatar placeholder">
                      <div className="bg-primary text-primary-content rounded-full w-12">
                        <span className="text-lg font-bold">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{employee.name}</h3>
                      <p className="text-sm text-base-content/60">{employee.position}</p>
                      <p className="text-xs text-base-content/60">{employee.department}</p>
                    </div>
                  </div>
                  <span className={`badge ${getStatusColor(employee.status)}`}>
                    {employee.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>{employee.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>Hired: {employee.hireDate}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-base-content/60">Performance</p>
                    <p className={`font-semibold ${getPerformanceColor(employee.performance)}`}>
                      {employee.performance}/5.0
                    </p>
                  </div>
                  <div>
                    <p className="text-base-content/60">Attendance</p>
                    <p className="font-semibold">{employee.attendance}%</p>
                  </div>
                  <div>
                    <p className="text-base-content/60">Salary</p>
                    <p className="font-semibold">N$ {employee.salary.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-base-content/60">Next Review</p>
                    <p className="font-semibold">{employee.nextReview}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-base-content/60 mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {employee.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="badge badge-outline badge-sm">
                        {skill}
                      </span>
                    ))}
                    {employee.skills.length > 3 && (
                      <span className="badge badge-outline badge-sm">
                        +{employee.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="card-actions justify-end">
                  <button className="btn btn-ghost btn-sm">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="btn btn-ghost btn-sm">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="btn btn-ghost btn-sm text-error">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Today's Schedule */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h3 className="text-2xl font-bold mb-4">Today&apos;s Schedule</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Staff Member</th>
                    <th>Position</th>
                    <th>Shift</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((schedule) => (
                    <tr key={schedule.id}>
                      <td className="font-medium">{schedule.staffName}</td>
                      <td>Tour Guide</td>
                      <td>{schedule.shift}</td>
                      <td>{schedule.type}</td>
                      <td>
                        <span className="badge badge-success">{schedule.status}</span>
                      </td>
                      <td>{schedule.notes}</td>
                      <td>
                        <div className="flex gap-1">
                          <button className="btn btn-ghost btn-xs">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="btn btn-ghost btn-xs">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Users className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Staff</div>
              <div className="stat-value text-primary">{staff.length}</div>
              <div className="stat-desc">All employees</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="stat-title">Active Staff</div>
              <div className="stat-value text-secondary">
                {staff.filter(s => s.status === 'active').length}
              </div>
              <div className="stat-desc">Currently working</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-accent">
                <Star className="w-8 h-8" />
              </div>
              <div className="stat-title">Avg Performance</div>
              <div className="stat-value text-accent">
                {(staff.reduce((sum, s) => sum + s.performance, 0) / staff.length).toFixed(1)}
              </div>
              <div className="stat-desc">Out of 5.0</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <DollarSign className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Payroll</div>
              <div className="stat-value text-info">
                N$ {staff.reduce((sum, s) => sum + s.salary, 0).toLocaleString()}
              </div>
              <div className="stat-desc">Monthly salary</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

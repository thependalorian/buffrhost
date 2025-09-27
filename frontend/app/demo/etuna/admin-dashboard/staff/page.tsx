/**
 * Etuna Staff Management - Professional Demo
 * 
 * Comprehensive staff management showcasing Buffr Host's HR capabilities
 * Features employee management, scheduling, performance tracking, and automation
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Users, 
  UserPlus, 
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowLeft,
  Home,
  Calendar,
  Award,
  TrendingUp,
  Target,
  Activity,
  Star,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  DollarSign,
  Shield,
  Settings,
  Plus,
  MoreHorizontal,
  BarChart3,
  PieChart,
  TrendingDown,
  UserCheck,
  UserX,
  Clock3,
  Calendar as CalendarIcon,
  Zap,
  Brain,
  Database,
  Network
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Etuna Guesthouse - Staff Management',
  description: 'Comprehensive staff management and HR operations for Etuna Guesthouse',
};

export default function EtunaStaffPage() {
  // Mock staff data
  const staff = [
    {
      id: 'EMP001',
      name: 'Maria Garcia',
      position: 'Front Desk Manager',
      department: 'Reception',
      status: 'active',
      email: 'maria.garcia@etunaguesthouse.com',
      phone: '+264 81 234 5678',
      hireDate: '2022-03-15',
      salary: 8500,
      performance: 4.8,
      attendance: 98.5,
      tasksCompleted: 47,
      tasksPending: 3,
      skills: ['Customer Service', 'Reservations', 'Multi-language', 'Problem Solving'],
      nextShift: '2024-01-16 08:00',
      lastLogin: '2024-01-15 18:30',
      avatar: '/images/staff/maria.jpg'
    },
    {
      id: 'EMP002',
      name: 'Ahmed Hassan',
      position: 'Chef',
      department: 'Kitchen',
      status: 'active',
      email: 'ahmed.hassan@etunaguesthouse.com',
      phone: '+264 81 345 6789',
      hireDate: '2021-08-20',
      salary: 12000,
      performance: 4.9,
      attendance: 99.2,
      tasksCompleted: 52,
      tasksPending: 1,
      skills: ['Culinary Arts', 'Menu Planning', 'Food Safety', 'Team Leadership'],
      nextShift: '2024-01-16 06:00',
      lastLogin: '2024-01-15 22:15',
      avatar: '/images/staff/ahmed.jpg'
    },
    {
      id: 'EMP003',
      name: 'Sarah Johnson',
      position: 'Housekeeping Supervisor',
      department: 'Housekeeping',
      status: 'active',
      email: 'sarah.johnson@etunaguesthouse.com',
      phone: '+264 81 456 7890',
      hireDate: '2023-01-10',
      salary: 7500,
      performance: 4.7,
      attendance: 97.8,
      tasksCompleted: 43,
      tasksPending: 5,
      skills: ['Quality Control', 'Team Management', 'Inventory', 'Training'],
      nextShift: '2024-01-16 07:00',
      lastLogin: '2024-01-15 17:45',
      avatar: '/images/staff/sarah.jpg'
    },
    {
      id: 'EMP004',
      name: 'John Smith',
      position: 'Maintenance Technician',
      department: 'Maintenance',
      status: 'on-leave',
      email: 'john.smith@etunaguesthouse.com',
      phone: '+264 81 567 8901',
      hireDate: '2020-11-05',
      salary: 9000,
      performance: 4.6,
      attendance: 95.5,
      tasksCompleted: 38,
      tasksPending: 8,
      skills: ['Electrical', 'Plumbing', 'HVAC', 'Safety Protocols'],
      nextShift: '2024-01-18 08:00',
      lastLogin: '2024-01-12 16:20',
      avatar: '/images/staff/john.jpg'
    },
    {
      id: 'EMP005',
      name: 'Fatima Al-Zahra',
      position: 'Tour Guide',
      department: 'Tours',
      status: 'active',
      email: 'fatima.alzahra@etunaguesthouse.com',
      phone: '+264 81 678 9012',
      hireDate: '2023-06-01',
      salary: 8000,
      performance: 4.9,
      attendance: 98.9,
      tasksCompleted: 45,
      tasksPending: 2,
      skills: ['Tourism', 'Languages', 'Customer Relations', 'Safety'],
      nextShift: '2024-01-16 09:00',
      lastLogin: '2024-01-15 19:10',
      avatar: '/images/staff/fatima.jpg'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="badge badge-success">Active</span>;
      case 'on-leave':
        return <span className="badge badge-warning">On Leave</span>;
      case 'inactive':
        return <span className="badge badge-error">Inactive</span>;
      default:
        return <span className="badge badge-ghost">{status}</span>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'on-leave':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'inactive':
        return <XCircle className="w-4 h-4 text-error" />;
      default:
        return <AlertCircle className="w-4 h-4 text-ghost" />;
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 4.8) return 'text-success';
    if (score >= 4.5) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-primary text-primary-content py-4 shadow-lg">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/protected/etuna/dashboard" className="btn btn-ghost text-primary-content hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">Staff Management</h1>
                  <p className="text-primary-content/80">Comprehensive HR and workforce management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn btn-secondary">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="btn btn-primary">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Staff
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Filters and Search */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Search staff..." 
                    className="input input-bordered w-full pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select className="select select-bordered">
                  <option>All Departments</option>
                  <option>Reception</option>
                  <option>Kitchen</option>
                  <option>Housekeeping</option>
                  <option>Maintenance</option>
                  <option>Tours</option>
                </select>
                <select className="select select-bordered">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>On Leave</option>
                  <option>Inactive</option>
                </select>
                <button className="btn btn-outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {staff.map((employee) => (
            <div key={employee.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="w-12 rounded-full bg-primary text-primary-content">
                        <Users className="w-6 h-6" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{employee.name}</h3>
                      <p className="text-sm text-base-content/70">{employee.position}</p>
                      <p className="text-xs text-base-content/50">{employee.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(employee.status)}
                    {getStatusBadge(employee.status)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Performance:</span>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-warning" />
                      <span className={`font-semibold ${getPerformanceColor(employee.performance)}`}>
                        {employee.performance}/5.0
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Attendance:</span>
                    <span className="font-semibold text-success">{employee.attendance}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tasks:</span>
                    <span className="text-sm">
                      {employee.tasksCompleted} completed, {employee.tasksPending} pending
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Next Shift:</span>
                    <span className="text-sm">{employee.nextShift}</span>
                  </div>
                </div>

                <div className="divider my-4"></div>

                <div className="space-y-2">
                  <div className="font-semibold text-sm text-base-content/70">Skills</div>
                  <div className="flex flex-wrap gap-1">
                    {employee.skills.map((skill, index) => (
                      <span key={index} className="badge badge-outline badge-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-ghost btn-sm" title="View Profile">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="btn btn-ghost btn-sm" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="btn btn-ghost btn-sm" title="Schedule">
                    <Calendar className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* HR Analytics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Analytics */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title mb-4">
                <BarChart3 className="w-5 h-5 text-primary" />
                Performance Analytics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Performance Score</span>
                  <span className="font-bold text-success">4.8/5.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Top Performers</span>
                  <span className="font-bold text-primary">3 employees</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Training Needed</span>
                  <span className="font-bold text-warning">2 employees</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Promotion Ready</span>
                  <span className="font-bold text-info">1 employee</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Overview */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title mb-4">
                <Clock className="w-5 h-5 text-secondary" />
                Attendance Overview
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Attendance</span>
                  <span className="font-bold text-success">97.8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Perfect Attendance</span>
                  <span className="font-bold text-primary">2 employees</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Late Arrivals</span>
                  <span className="font-bold text-warning">3 this month</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Absences</span>
                  <span className="font-bold text-error">1 this month</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buffr Host HR Features */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title mb-6">
              <Brain className="w-6 h-6 text-primary" />
              Buffr Host HR Automation Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">Automated Scheduling</div>
                  <div className="text-sm text-base-content/70">
                    AI-powered shift optimization based on demand patterns and staff preferences
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Target className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">Performance Tracking</div>
                  <div className="text-sm text-base-content/70">
                    Real-time performance metrics with automated feedback and goal setting
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Database className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">Skills Management</div>
                  <div className="text-sm text-base-content/70">
                    Track competencies, identify training needs, and plan career development
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Network className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">Communication Hub</div>
                  <div className="text-sm text-base-content/70">
                    Integrated messaging, announcements, and team collaboration tools
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">Compliance Management</div>
                  <div className="text-sm text-base-content/70">
                    Automated compliance tracking, training records, and certification management
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">Analytics & Insights</div>
                  <div className="text-sm text-base-content/70">
                    Advanced analytics for workforce optimization and strategic planning
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Users className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Staff</div>
              <div className="stat-value text-primary">{staff.length}</div>
              <div className="stat-desc">Active employees</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-success">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="stat-title">Active</div>
              <div className="stat-value text-success">
                {staff.filter(s => s.status === 'active').length}
              </div>
              <div className="stat-desc">Currently working</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-warning">
                <Award className="w-8 h-8" />
              </div>
              <div className="stat-title">Avg Performance</div>
              <div className="stat-value text-warning">4.8</div>
              <div className="stat-desc">Out of 5.0</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <Clock className="w-8 h-8" />
              </div>
              <div className="stat-title">Attendance</div>
              <div className="stat-value text-info">97.8%</div>
              <div className="stat-desc">This month</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

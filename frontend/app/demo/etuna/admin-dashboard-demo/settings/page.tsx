import { Metadata } from "next";
import Link from "next/link";
import {
  Settings,
  User,
  Shield,
  Bell,
  Globe,
  Database,
  Key,
  Mail,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  CreditCard,
  Wifi,
  Camera,
  Lock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Plus,
  Edit,
  Check,
  X,
  AlertCircle,
  Info,
  ArrowLeft,
  Home,
  Users,
  Bed,
  Utensils,
  Car,
  Star,
  Award,
  Target,
  Zap,
  Activity,
  Network,
  Cpu,
  HardDrive,
  Monitor,
  Printer,
  Router,
  Server,
  Cloud,
  Archive,
  FileText,
  Image,
  Video,
  Music,
  Folder,
  FolderOpen,
  Search,
  Filter,
  ArrowUpDown,
  Grid,
  List,
  Calendar,
  Timer,
  Hourglass,
  Play,
  Pause,
  Square,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Headphones,
  Speaker,
  Radio,
  Tv,
  Smartphone,
  Tablet,
  Laptop,
  Watch,
  Gamepad2,
  Joystick,
  Mouse,
  Keyboard,
  Webcam,
  Scan,
  Copy,
  Projector,
  MemoryStick,
  Disc,
  Usb,
  Heap,
  Tree,
  Graph,
  Chart,
  Table,
  Layout,
  Template,
  Component,
  Module,
  Package,
  Box,
  Container,
  Wrapper,
  Frame,
  Border,
  Margin,
  Padding,
  Spacing,
  Gap,
  Space,
  Distance,
  Width,
  Height,
  Size,
  Dimension,
  Scale,
  Ratio,
  Proportion,
  Percentage,
  Fraction,
  Decimal,
  Integer,
  Number,
  Count,
  Amount,
  Quantity,
  Total,
  Sum,
  Average,
  Mean,
  Median,
  Mode,
  Range,
  Min,
  Max,
  MinMax,
  Limit,
  Boundary,
  Edge,
  Corner,
  Side,
  Top,
  Bottom,
  Left,
  Right,
  Center,
  Middle,
  Front,
  Back,
  Inside,
  Outside,
  Interior,
  Exterior,
  Surface,
  Depth,
  Volume,
  Area,
  Perimeter,
  Circumference,
  Diameter,
  Radius,
  Length,
  Breadth,
  Thickness,
  Weight,
  Mass,
  Density,
  Pressure,
  Force,
  Energy,
  Power,
  Voltage,
  Current,
  Resistance,
  Capacitance,
  Inductance,
  Frequency,
  Wavelength,
  Amplitude,
  Phase,
  Signal,
  Wave,
  Pulse,
  Beat,
  Rhythm,
  Tempo,
  Speed,
  Velocity,
  Acceleration,
  Momentum,
  Inertia,
  Friction,
  Gravity,
  Magnetism,
  Electricity,
  Light,
  Sound,
  Heat,
  Temperature,
  Humidity,
  Altitude,
  Latitude,
  Longitude,
  Coordinate,
  Position,
  Location,
  Address,
  Place,
  Spot,
  Point,
  Line,
  Curve,
  Arc,
  Circle,
  Ellipse,
  Oval,
  Rectangle,
  Triangle,
  Pentagon,
  Hexagon,
  Octagon,
  Polygon,
  Shape,
  Form,
  Structure,
  Pattern,
  Design,
  Style,
  Theme,
  Color,
  Hue,
  Saturation,
  Brightness,
  Contrast,
  Opacity,
  Transparency,
  Visibility,
  Clarity,
  Sharpness,
  Blur,
  Focus,
  Zoom,
  Rotate,
  Flip,
  Mirror,
  Invert,
  Reverse,
  Backward,
  Forward,
  Up,
  Down,
  North,
  South,
  East,
  West,
  Direction,
  Orientation,
  Alignment,
  Placement,
  Arrangement,
  Order,
  Sequence,
  Series,
  Chain,
  Connection,
  Bond,
  Tie,
  Knot,
  Loop,
  Ring,
  Round,
  Spherical,
  Cylindrical,
  Conical,
  Pyramidal,
  Cubic,
  Rectangular,
  Triangular,
  Pentagonal,
  Hexagonal,
  Octagonal,
  Polygonal,
  Geometric,
  Mathematical,
  Logical,
  Rational,
  Irrational,
  Real,
  Imaginary,
  Complex,
  Simple,
  Basic,
  Advanced,
  Expert,
  Professional,
  Amateur,
  Beginner,
  Intermediate,
  Senior,
  Junior,
  Master,
  Apprentice,
  Student,
  Teacher,
  Instructor,
  Mentor,
  Coach,
  Trainer,
  Guide,
  Leader,
  Manager,
  Director,
  Executive,
  Administrator,
  Supervisor,
  Coordinator,
  Facilitator,
  Moderator,
  Mediator,
  Negotiator,
  Arbitrator,
  Judge,
  Jury,
  Panel,
  Committee,
  Board,
  Council,
  Assembly,
  Congress,
  Parliament,
  Senate,
  House,
  Chamber,
  Room,
  Hall,
  Auditorium,
  Theater,
  Stadium,
  Arena,
  Field,
  Court,
  Track,
  Course,
  Route,
  Path,
  Way,
  Road,
  Street,
  Avenue,
  Boulevard,
  Lane,
  Drive,
  Park,
  Garden,
  Forest,
  Mountain,
  Hill,
  Valley,
  River,
  Lake,
  Ocean,
  Sea,
  Bay,
  Harbor,
  Port,
  Dock,
  Pier,
  Bridge,
  Tunnel,
  Underpass,
  Overpass,
  Intersection,
  Junction,
  Crossroad,
  Roundabout,
  Traffic,
  Vehicle,
  Truck,
  Bus,
  Train,
  Plane,
  Ship,
  Boat,
  Bicycle,
  Motorcycle,
  Scooter,
  Skateboard,
  Rollerblade,
  Walk,
  Run,
  Jog,
  Sprint,
  Marathon,
  Race,
  Competition,
  Contest,
  Tournament,
  Championship,
  League,
  Division,
  Conference,
  Association,
  Organization,
  Institution,
  Foundation,
  Corporation,
  Company,
  Business,
  Enterprise,
  Firm,
  Agency,
  Bureau,
  Department,
  Office,
  Workplace,
  Factory,
  Plant,
  Mill,
  Workshop,
  Studio,
  Laboratory,
  Clinic,
  Hospital,
  School,
  University,
  College,
  Academy,
  Institute,
  Museum,
  Library,
  Gallery,
  Exhibition,
  Show,
  Presentation,
  Demonstration,
  Performance,
  Concert,
  Movie,
  Film,
  Audio,
  Song,
  Album,
  Record,
  Streaming,
  Share,
  Like,
  Dislike,
  Love,
  Hate,
  Enjoy,
  Prefer,
  Choose,
  Select,
  Pick,
  Option,
  Alternative,
  Choice,
  Decision,
  Conclusion,
  Result,
  Outcome,
  Consequence,
  Effect,
  Impact,
  Influence,
  Change,
  Modification,
  Adjustment,
  Alteration,
  Variation,
  Difference,
  Similarity,
  Comparison,
  Distinction,
  Feature,
  Characteristic,
  Attribute,
  Property,
  Quality,
  Trait,
  Aspect,
  Element,
  Part,
  Piece,
  Section,
  Segment,
  Category,
  Class,
  Type,
  Kind,
  Variety,
  Species,
  Breed,
  Ethnicity,
  Nationality,
  Citizenship,
  Identity,
  Personality,
  Character,
  Nature,
  Essence,
  Spirit,
  Soul,
  Mind,
  Heart,
  Body,
  Physical,
  Mental,
  Emotional,
  Spiritual,
  Psychological,
  Social,
  Cultural,
  Historical,
  Traditional,
  Modern,
  Contemporary,
  Present,
  Past,
  Future,
  Time,
  Moment,
  Instant,
  Second,
  Minute,
  Hour,
  Day,
  Week,
  Month,
  Year,
  Decade,
  Century,
  Millennium,
  Era,
  Age,
  Period,
  Duration,
  Span,
  Scope,
  Extent,
  Degree,
  Level,
  Stage,
  Process,
  Procedure,
  Method,
  Technique,
  Approach,
  Strategy,
  Plan,
  Scheme,
  Program,
  Project,
  Task,
  Job,
  Work,
  Labor,
  Effort,
  Strength,
  Weakness,
  Advantage,
  Disadvantage,
  Benefit,
  Cost,
  Price,
  Value,
  Worth,
  Importance,
  Significance,
  Relevance,
  Priority,
  Urgency,
  Emergency,
  Crisis,
  Problem,
  Issue,
  Challenge,
  Difficulty,
  Obstacle,
  Barrier,
  Limitation,
  Restriction,
  Constraint,
  Requirement,
  Condition,
  Criteria,
  Standard,
  Rule,
  Regulation,
  Law,
  Policy,
  Guideline,
  Principle,
  Theory,
  Concept,
  Idea,
  Thought,
  Opinion,
  View,
  Perspective,
  Angle,
  Face,
  Layer,
  Tier,
  Row,
  Column,
  Floor,
  Ceiling,
  Wall,
  Door,
  Window,
  Opening,
  Entrance,
  Exit,
  Access,
  Entry,
  Passage,
  Corridor,
  Hallway,
  Staircase,
  Elevator,
  Escalator,
  Ramp,
  Slope,
  Incline,
  Decline,
  Ascent,
  Descent,
  Rise,
  Fall,
  Drop,
  Jump,
  Leap,
  Hop,
  Skip,
  Stride,
  Pace,
  Heartbeat,
  Breathing,
  Respiration,
  Circulation,
  Blood,
  Oxygen,
  Carbon,
  Dioxide,
  Water,
  Liquid,
  Solid,
  Gas,
  Plasma,
  Matter,
  Substance,
  Material,
  Compound,
  Mixture,
  Solution,
  Suspension,
  Colloid,
  Emulsion,
  Foam,
  Gel,
  Paste,
  Powder,
  Granule,
  Particle,
  Atom,
  Molecule,
  Ion,
  Electron,
  Proton,
  Neutron,
  Nucleus,
  Core,
  Self,
  Individual,
  Person,
  Human,
  Being,
  Creature,
  Animal,
  Life,
  Living,
  Dead,
  Alive,
  Existence,
  Reality,
  Truth,
  Fact,
  Fiction,
  Fantasy,
  Dream,
  Nightmare,
  Vision,
  Illusion,
  Hallucination,
  Mirage,
  Phantom,
  Ghost,
  Angel,
  Demon,
  Devil,
  God,
  Goddess,
  Deity,
  Divine,
  Sacred,
  Holy,
  Blessed,
  Cursed,
  Evil,
  Good,
} from "lucide-react";
/**
 * Etuna Settings & Configuration
 *
 * Comprehensive settings management for Etuna Guesthouse
 * Features property configuration, user management, and system settings
 * Based on backend config.py and settings functionality
 */

export const metadata: Metadata = {
  title: "Etuna Guesthouse - Settings",
  description: "Property settings and configuration for Etuna Guesthouse",
};

interface PropertySetting {
  id: string;
  category:
    | "general"
    | "booking"
    | "payment"
    | "communication"
    | "security"
    | "integration";
  name: string;
  description: string;
  value: any;
  type:
    | "text"
    | "number"
    | "boolean"
    | "select"
    | "multiselect"
    | "date"
    | "time"
    | "datetime";
  options?: string[];
  required: boolean;
  editable: boolean;
}

interface UserSetting {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "staff" | "receptionist";
  permissions: string[];
  status: "active" | "inactive" | "suspended";
  lastLogin: string;
  createdAt: string;
}

interface SystemSetting {
  id: string;
  name: string;
  description: string;
  value: any;
  type: "text" | "number" | "boolean" | "select";
  category: "database" | "api" | "email" | "storage" | "security";
  required: boolean;
}

const mockPropertySettings: PropertySetting[] = [
  {
    id: "PS001",
    category: "general",
    name: "Property Name",
    description: "The official name of your property",
    value: "Etuna Guesthouse & Tours",
    type: "text",
    required: true,
    editable: true,
  },
  {
    id: "PS002",
    category: "general",
    name: "Property Address",
    description: "Complete address of your property",
    value: "5544 Valley Street, Ongwediva, Namibia",
    type: "text",
    required: true,
    editable: true,
  },
  {
    id: "PS003",
    category: "general",
    name: "Contact Phone",
    description: "Primary contact phone number",
    value: "+264 65 231 177",
    type: "text",
    required: true,
    editable: true,
  },
  {
    id: "PS004",
    category: "general",
    name: "Contact Email",
    description: "Primary contact email address",
    value: "bookings@etunaguesthouse.com",
    type: "text",
    required: true,
    editable: true,
  },
  {
    id: "PS005",
    category: "booking",
    name: "Check-in Time",
    description: "Standard check-in time",
    value: "14:00",
    type: "time",
    required: true,
    editable: true,
  },
  {
    id: "PS006",
    category: "booking",
    name: "Check-out Time",
    description: "Standard check-out time",
    value: "11:00",
    type: "time",
    required: true,
    editable: true,
  },
  {
    id: "PS007",
    category: "booking",
    name: "Cancellation Policy",
    description: "Cancellation policy for bookings",
    value: "Free cancellation up to 24 hours before check-in",
    type: "text",
    required: true,
    editable: true,
  },
  {
    id: "PS008",
    category: "payment",
    name: "Currency",
    description: "Default currency for transactions",
    value: "NAD",
    type: "select",
    options: ["NAD", "USD", "EUR", "ZAR", "BWP"],
    required: true,
    editable: true,
  },
  {
    id: "PS009",
    category: "payment",
    name: "Payment Methods",
    description: "Accepted payment methods",
    value: ["Credit Card", "Bank Transfer", "Cash"],
    type: "multiselect",
    options: ["Credit Card", "Bank Transfer", "Cash", "Mobile Payment"],
    required: true,
    editable: true,
  },
  {
    id: "PS010",
    category: "communication",
    name: "Email Notifications",
    description: "Enable email notifications for bookings",
    value: true,
    type: "boolean",
    required: false,
    editable: true,
  },
  {
    id: "PS011",
    category: "communication",
    name: "SMS Notifications",
    description: "Enable SMS notifications for bookings",
    value: false,
    type: "boolean",
    required: false,
    editable: true,
  },
  {
    id: "PS012",
    category: "security",
    name: "Two-Factor Authentication",
    description: "Require 2FA for admin accounts",
    value: true,
    type: "boolean",
    required: false,
    editable: true,
  },
  {
    id: "PS013",
    category: "security",
    name: "Session Timeout",
    description: "Automatic logout after inactivity (minutes)",
    value: 30,
    type: "number",
    required: true,
    editable: true,
  },
];

const mockUsers: UserSetting[] = [
  {
    id: "U001",
    name: "Sarah Johnson",
    email: "sarah@etunaguesthouse.com",
    role: "admin",
    permissions: ["all"],
    status: "active",
    lastLogin: "2024-01-15 14:30",
    createdAt: "2023-06-01",
  },
  {
    id: "U002",
    name: "Mike Wilson",
    email: "mike@etunaguesthouse.com",
    role: "manager",
    permissions: ["bookings", "guests", "rooms", "reports"],
    status: "active",
    lastLogin: "2024-01-15 16:45",
    createdAt: "2023-07-15",
  },
  {
    id: "U003",
    name: "Anna Smith",
    email: "anna@etunaguesthouse.com",
    role: "receptionist",
    permissions: ["bookings", "guests"],
    status: "active",
    lastLogin: "2024-01-15 18:20",
    createdAt: "2023-08-20",
  },
  {
    id: "U004",
    name: "John Brown",
    email: "john@etunaguesthouse.com",
    role: "staff",
    permissions: ["rooms", "maintenance"],
    status: "inactive",
    lastLogin: "2024-01-10 09:15",
    createdAt: "2023-09-10",
  },
];

const mockSystemSettings: SystemSetting[] = [
  {
    id: "SS001",
    name: "Database URL",
    description: "Connection string for the database",
    value: "postgresql://user:pass@localhost:5432/etuna",
    type: "text",
    category: "database",
    required: true,
  },
  {
    id: "SS002",
    name: "API Rate Limit",
    description: "Maximum API requests per minute",
    value: 1000,
    type: "number",
    category: "api",
    required: true,
  },
  {
    id: "SS003",
    name: "Email Provider",
    description: "Email service provider",
    value: "SendGrid",
    type: "select",
    category: "email",
    required: true,
  },
  {
    id: "SS004",
    name: "File Storage",
    description: "File storage provider",
    value: "Supabase Storage",
    type: "select",
    category: "storage",
    required: true,
  },
  {
    id: "SS005",
    name: "SSL Certificate",
    description: "SSL certificate status",
    value: true,
    type: "boolean",
    category: "security",
    required: true,
  },
];

export default function EtunaSettingsPage() {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "general":
        return Home;
      case "booking":
        return Calendar;
      case "payment":
        return CreditCard;
      case "communication":
        return Mail;
      case "security":
        return Shield;
      case "integration":
        return Network;
      case "database":
        return Database;
      case "api":
        return Cpu;
      case "email":
        return Mail;
      case "storage":
        return HardDrive;
      default:
        return Settings;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "general":
        return "bg-blue-100 text-blue-800";
      case "booking":
        return "bg-green-100 text-green-800";
      case "payment":
        return "bg-purple-100 text-purple-800";
      case "communication":
        return "bg-orange-100 text-orange-800";
      case "security":
        return "bg-red-100 text-red-800";
      case "integration":
        return "bg-gray-100 text-gray-800";
      case "database":
        return "bg-indigo-100 text-indigo-800";
      case "api":
        return "bg-cyan-100 text-cyan-800";
      case "email":
        return "bg-pink-100 text-pink-800";
      case "storage":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "manager":
        return "bg-orange-100 text-orange-800";
      case "staff":
        return "bg-blue-100 text-blue-800";
      case "receptionist":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header - Mobile Responsive */}
      <div className="bg-primary text-primary-content py-3 sm:py-4">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                href="/demo/etuna/admin-dashboard-demo/dashboard"
                className="btn btn-ghost text-primary-content hover:bg-white/20 btn-sm sm:btn-md"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Link>
              <div className="flex items-center space-x-3">
                <Settings className="w-6 h-6 sm:w-8 sm:h-8" />
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold">Settings</h1>
                  <p className="text-primary-content/80 text-xs sm:text-sm">
                    Property configuration and system settings
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="btn btn-sm sm:btn-md bg-white/20 hover:bg-white/30 text-primary-content">
                <Save className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Save Changes</span>
                <span className="sm:hidden">Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Mobile Responsive */}
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Property Settings - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            Property Settings
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(
              mockPropertySettings.reduce(
                (acc, setting) => {
                  if (!acc[setting.category]) acc[setting.category] = [];
                  acc[setting.category].push(setting);
                  return acc;
                },
                {} as Record<string, PropertySetting[]>,
              ),
            ).map(([category, settings]) => {
              const IconComponent = getCategoryIcon(category);
              return (
                <div
                  key={category}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <IconComponent className="h-5 w-5 text-gray-600" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 capitalize">
                      {category} Settings
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {settings.map((setting) => (
                      <div
                        key={setting.id}
                        className="border-b border-gray-100 pb-4 last:border-b-0"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="min-w-0 flex-1">
                            <label className="text-sm font-medium text-gray-900">
                              {setting.name}
                              {setting.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                              {setting.description}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          {setting.type === "boolean" ? (
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={setting.value}
                                className="checkbox checkbox-primary"
                                disabled={!setting.editable}
                              />
                              <span className="ml-2 text-sm text-gray-600">
                                {setting.value ? "Enabled" : "Disabled"}
                              </span>
                            </label>
                          ) : setting.type === "select" ? (
                            <select
                              className="select select-bordered select-sm w-full"
                              disabled={!setting.editable}
                            >
                              {setting.options?.map((option) => (
                                <option
                                  key={option}
                                  value={option}
                                  selected={option === setting.value}
                                >
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : setting.type === "multiselect" ? (
                            <div className="space-y-2">
                              {setting.options?.map((option) => (
                                <label
                                  key={option}
                                  className="flex items-center"
                                >
                                  <input
                                    type="checkbox"
                                    checked={setting.value.includes(option)}
                                    className="checkbox checkbox-sm"
                                    disabled={!setting.editable}
                                  />
                                  <span className="ml-2 text-sm text-gray-600">
                                    {option}
                                  </span>
                                </label>
                              ))}
                            </div>
                          ) : (
                            <input
                              type={
                                setting.type === "number" ? "number" : "text"
                              }
                              value={setting.value}
                              className="input input-bordered input-sm w-full"
                              disabled={!setting.editable}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Management - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-0">
              User Management
            </h2>
            <button className="btn btn-sm sm:btn-md btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Add User</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                            user.role,
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            user.status,
                          )}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLogin}
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button className="btn btn-xs btn-outline">
                            <Edit className="h-3 w-3" />
                          </button>
                          <button className="btn btn-xs btn-outline">
                            <Eye className="h-3 w-3" />
                          </button>
                          <button className="btn btn-xs btn-outline btn-error">
                            <Trash2 className="h-3 w-3" />
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

        {/* System Settings - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            System Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {Object.entries(
              mockSystemSettings.reduce(
                (acc, setting) => {
                  if (!acc[setting.category]) acc[setting.category] = [];
                  acc[setting.category].push(setting);
                  return acc;
                },
                {} as Record<string, SystemSetting[]>,
              ),
            ).map(([category, settings]) => {
              const IconComponent = getCategoryIcon(category);
              return (
                <div
                  key={category}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <IconComponent className="h-5 w-5 text-gray-600" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 capitalize">
                      {category} Configuration
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {settings.map((setting) => (
                      <div
                        key={setting.id}
                        className="border-b border-gray-100 pb-3 last:border-b-0"
                      >
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <label className="text-sm font-medium text-gray-900">
                              {setting.name}
                              {setting.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                              {setting.description}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          {setting.type === "boolean" ? (
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={setting.value}
                                className="checkbox checkbox-primary checkbox-sm"
                              />
                              <span className="ml-2 text-sm text-gray-600">
                                {setting.value ? "Enabled" : "Disabled"}
                              </span>
                            </label>
                          ) : setting.type === "select" ? (
                            <select className="select select-bordered select-sm w-full">
                              <option value={setting.value}>
                                {setting.value}
                              </option>
                            </select>
                          ) : (
                            <input
                              type={
                                setting.type === "number" ? "number" : "text"
                              }
                              value={setting.value}
                              className="input input-bordered input-sm w-full"
                              readOnly
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions - Mobile Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Link
            href="/demo/etuna/admin-dashboard-demo/settings"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Download className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-blue-600">
                  Export Settings
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Download configuration backup
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/demo/etuna/admin-dashboard-demo/settings"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-green-600">
                  Import Settings
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Restore from backup file
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/demo/etuna/admin-dashboard-demo/settings"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <RefreshCw className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-purple-600">
                  Reset Settings
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Reset to default values
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/demo/etuna/admin-dashboard-demo/settings"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-orange-600">
                  Security Audit
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Review security settings
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Download,
  Eye,
  Edit,
  Send,
  Search,
  Filter,
  Plus,
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  DollarSign,
  Receipt,
  FileSpreadsheet,
  Target,
  Zap,
  Database,
  Network,
  Shield,
  BarChart,
} from "lucide-react";
/**
 * Etuna Invoice Generation - Professional Demo
 *
 * Comprehensive invoice management showcasing Buffr Host's financial capabilities
 * Features automated invoice generation, payment tracking, and financial reporting
 */

export const metadata: Metadata = {
  title: "Etuna Guesthouse - Invoice Generation",
  description:
    "Comprehensive invoice management and generation for Etuna Guesthouse",
};

export default function EtunaInvoicesPage() {
  // Mock invoice data
  const invoices = [
    {
      id: "INV-2024-001",
      customer: "Corporate Retreat Group",
      email: "bookings@namibiamining.com",
      amount: 45000,
      currency: "NAD",
      status: "paid",
      issueDate: "2024-01-15",
      dueDate: "2024-02-15",
      paidDate: "2024-01-20",
      paymentMethod: "Bank Transfer",
      items: [
        {
          description: "Executive Room (3 nights)",
          quantity: 1,
          rate: 12000,
          amount: 36000,
        },
        {
          description: "Conference Facilities",
          quantity: 1,
          rate: 5000,
          amount: 5000,
        },
        {
          description: "Catering Services",
          quantity: 1,
          rate: 4000,
          amount: 4000,
        },
      ],
      subtotal: 45000,
      tax: 0,
      total: 45000,
    },
    {
      id: "INV-2024-002",
      customer: "Wedding Party",
      email: "sarah.wedding@gmail.com",
      amount: 25000,
      currency: "NAD",
      status: "pending",
      issueDate: "2024-01-14",
      dueDate: "2024-02-14",
      paidDate: null,
      paymentMethod: null,
      items: [
        {
          description: "Wedding Reception (80 guests)",
          quantity: 1,
          rate: 20000,
          amount: 20000,
        },
        {
          description: "Room Block (10 rooms)",
          quantity: 1,
          rate: 5000,
          amount: 5000,
        },
      ],
      subtotal: 25000,
      tax: 0,
      total: 25000,
    },
    {
      id: "INV-2024-003",
      customer: "Tech Conference Namibia",
      email: "events@techconf.na",
      amount: 80000,
      currency: "NAD",
      status: "overdue",
      issueDate: "2024-01-10",
      dueDate: "2024-01-25",
      paidDate: null,
      paymentMethod: null,
      items: [
        {
          description: "Conference Hall (200 delegates)",
          quantity: 1,
          rate: 50000,
          amount: 50000,
        },
        {
          description: "Catering (3 days)",
          quantity: 1,
          rate: 20000,
          amount: 20000,
        },
        {
          description: "Audio Visual Equipment",
          quantity: 1,
          rate: 10000,
          amount: 10000,
        },
      ],
      subtotal: 80000,
      tax: 0,
      total: 80000,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <span className="badge badge-success">Paid</span>;
      case "pending":
        return <span className="badge badge-warning">Pending</span>;
      case "overdue":
        return <span className="badge badge-error">Overdue</span>;
      case "draft":
        return <span className="badge badge-neutral">Draft</span>;
      default:
        return <span className="badge badge-ghost">{status}</span>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "pending":
        return <Clock className="w-4 h-4 text-warning" />;
      case "overdue":
        return <XCircle className="w-4 h-4 text-error" />;
      case "draft":
        return <Edit className="w-4 h-4 text-neutral" />;
      default:
        return <AlertCircle className="w-4 h-4 text-ghost" />;
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-primary text-primary-content py-4 shadow-lg">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/demo/etuna/admin-dashboard-demo/dashboard"
                className="btn btn-ghost text-primary-content hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center space-x-3">
                <Receipt className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">Invoice Generation</h1>
                  <p className="text-primary-content/80">
                    Automated invoice management and financial reporting
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn btn-secondary">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                New Invoice
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Invoice Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Receipt className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Invoices</div>
              <div className="stat-value text-primary">{invoices.length}</div>
              <div className="stat-desc">This month</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-success">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="stat-title">Paid</div>
              <div className="stat-value text-success">
                {invoices.filter((i) => i.status === "paid").length}
              </div>
              <div className="stat-desc">Completed</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-warning">
                <Clock className="w-8 h-8" />
              </div>
              <div className="stat-title">Pending</div>
              <div className="stat-value text-warning">
                {invoices.filter((i) => i.status === "pending").length}
              </div>
              <div className="stat-desc">Awaiting payment</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <DollarSign className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Revenue</div>
              <div className="stat-value text-info">
                N${" "}
                {invoices
                  .reduce((sum, inv) => sum + inv.amount, 0)
                  .toLocaleString()}
              </div>
              <div className="stat-desc">This month</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    className="input input-bordered w-full pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select className="select select-bordered">
                  <option>All Status</option>
                  <option>Paid</option>
                  <option>Pending</option>
                  <option>Overdue</option>
                  <option>Draft</option>
                </select>
                <select className="select select-bordered">
                  <option>All Customers</option>
                  <option>Corporate Retreat Group</option>
                  <option>Wedding Party</option>
                  <option>Tech Conference Namibia</option>
                </select>
                <button className="btn btn-outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h3 className="card-title mb-6">
              <Receipt className="w-6 h-6 text-primary" />
              Invoice Management
            </h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Payment Method</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td>
                        <div className="font-semibold">{invoice.id}</div>
                        <div className="text-sm text-base-content/70">
                          {invoice.email}
                        </div>
                      </td>
                      <td>
                        <div className="font-medium">{invoice.customer}</div>
                      </td>
                      <td>
                        <div className="font-semibold text-primary">
                          {invoice.currency} {invoice.amount.toLocaleString()}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(invoice.status)}
                          {getStatusBadge(invoice.status)}
                        </div>
                      </td>
                      <td>{invoice.issueDate}</td>
                      <td>
                        <div
                          className={
                            invoice.status === "overdue" ? "text-error" : ""
                          }
                        >
                          {invoice.dueDate}
                        </div>
                      </td>
                      <td>{invoice.paymentMethod || "-"}</td>
                      <td>
                        <div className="flex space-x-1">
                          <button className="btn btn-ghost btn-sm" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="btn btn-ghost btn-sm" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="btn btn-ghost btn-sm" title="Send">
                            <Send className="w-4 h-4" />
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

        {/* Invoice Generation Features */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title mb-6">
              <Zap className="w-6 h-6 text-primary" />
              Buffr Host Invoice Generation Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">Automated Generation</div>
                  <div className="text-sm text-base-content/70">
                    Auto-generate invoices from bookings, events, and services
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Target className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">Custom Templates</div>
                  <div className="text-sm text-base-content/70">
                    Branded invoice templates with your logo and styling
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Database className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">Payment Tracking</div>
                  <div className="text-sm text-base-content/70">
                    Real-time payment status and automated reminders
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Network className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">Multi-Channel Delivery</div>
                  <div className="text-sm text-base-content/70">
                    Email, SMS, and portal delivery options
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">Tax Compliance</div>
                  <div className="text-sm text-base-content/70">
                    Automated tax calculations and compliance reporting
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <BarChart className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">Financial Analytics</div>
                  <div className="text-sm text-base-content/70">
                    Revenue insights and payment trend analysis
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

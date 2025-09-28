/**
 * Invoice List Component
 *
 * Displays and manages invoices
 */

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Eye,
  Send,
  Search,
  Filter,
  Calendar,
  DollarSign,
  User,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
} from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  dueDate: string;
  issueDate: string;
  paidDate?: string;
  description: string;
  items: InvoiceItem[];
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceListProps {
  invoices?: Invoice[];
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
  onSend?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export default function InvoiceList({
  invoices,
  onView,
  onDownload,
  onSend,
  onEdit,
}: InvoiceListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const mockInvoices: Invoice[] = [
    {
      id: "1",
      invoiceNumber: "INV-2024-001",
      customerName: "John Smith",
      customerEmail: "john.smith@email.com",
      amount: 299.99,
      currency: "NAD",
      status: "paid",
      dueDate: "2024-01-15",
      issueDate: "2024-01-01",
      paidDate: "2024-01-10",
      description: "Monthly subscription - Professional Plan",
      items: [
        {
          description: "Professional Plan",
          quantity: 1,
          unitPrice: 299.99,
          total: 299.99,
        },
      ],
    },
    {
      id: "2",
      invoiceNumber: "INV-2024-002",
      customerName: "Maria Garcia",
      customerEmail: "maria.garcia@company.com",
      amount: 199.99,
      currency: "NAD",
      status: "sent",
      dueDate: "2024-01-20",
      issueDate: "2024-01-05",
      description: "Monthly subscription - Basic Plan",
      items: [
        {
          description: "Basic Plan",
          quantity: 1,
          unitPrice: 199.99,
          total: 199.99,
        },
      ],
    },
    {
      id: "3",
      invoiceNumber: "INV-2024-003",
      customerName: "David Johnson",
      customerEmail: "david.j@email.com",
      amount: 599.99,
      currency: "NAD",
      status: "overdue",
      dueDate: "2024-01-10",
      issueDate: "2023-12-15",
      description: "Monthly subscription - Enterprise Plan",
      items: [
        {
          description: "Enterprise Plan",
          quantity: 1,
          unitPrice: 599.99,
          total: 599.99,
        },
      ],
    },
    {
      id: "4",
      invoiceNumber: "INV-2024-004",
      customerName: "Sarah Wilson",
      customerEmail: "sarah.wilson@email.com",
      amount: 99.99,
      currency: "NAD",
      status: "draft",
      dueDate: "2024-01-25",
      issueDate: "2024-01-15",
      description: "Monthly subscription - Starter Plan",
      items: [
        {
          description: "Starter Plan",
          quantity: 1,
          unitPrice: 99.99,
          total: 99.99,
        },
      ],
    },
  ];

  const displayInvoices = invoices || mockInvoices;

  const filteredInvoices = displayInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || invoice.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "sent":
        return <Send className="w-4 h-4 text-blue-500" />;
      case "overdue":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "draft":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const totalAmount = displayInvoices.reduce(
    (sum, invoice) => sum + invoice.amount,
    0,
  );
  const paidAmount = displayInvoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const overdueAmount = displayInvoices
    .filter((invoice) => invoice.status === "overdue")
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-gray-600">Manage your invoices and billing</p>
        </div>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold">{displayInvoices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold">
                  {formatPrice(totalAmount, "NAD")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Paid Amount</p>
                <p className="text-2xl font-bold">
                  {formatPrice(paidAmount, "NAD")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Overdue Amount</p>
                <p className="text-2xl font-bold">
                  {formatPrice(overdueAmount, "NAD")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Invoice</th>
                  <th className="text-left p-3 font-medium">Customer</th>
                  <th className="text-left p-3 font-medium">Amount</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Due Date</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">
                          {invoice.invoiceNumber}
                        </div>
                        <div className="text-sm text-gray-600">
                          {invoice.description}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium">
                          {invoice.customerName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {invoice.customerEmail}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">
                        {formatPrice(invoice.amount, invoice.currency)}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(invoice.status)}
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        {formatDate(invoice.dueDate)}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onView?.(invoice.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDownload?.(invoice.id)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        {invoice.status === "draft" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onSend?.(invoice.id)}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No invoices found
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== "all"
                  ? "No invoices match your search criteria."
                  : "Create your first invoice to get started."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

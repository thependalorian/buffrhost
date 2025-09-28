/**
 * Service Fee List Component
 *
 * Manages service fees in serverless microservices architecture
 * Integrates with Revenue Service microservice
 */

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Percent,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Settings,
} from "lucide-react";

interface ServiceFee {
  id: string;
  name: string;
  description: string;
  type: "percentage" | "fixed" | "tiered";
  value: number;
  currency: string;
  minAmount?: number;
  maxAmount?: number;
  applicableServices: string[];
  status: "active" | "inactive" | "draft";
  effectiveDate: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
  // Microservice fields
  serviceId: string;
  version: string;
}

interface ServiceFeeListProps {
  serviceFees?: ServiceFee[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onCreate?: () => void;
  // Microservice integration
  revenueServiceUrl?: string;
  apiKey?: string;
}

export default function ServiceFeeList({
  serviceFees,
  onEdit,
  onDelete,
  onView,
  onCreate,
  revenueServiceUrl = process.env.NEXT_PUBLIC_REVENUE_SERVICE_URL ||
    "https://revenue-service.buffrhost.com",
  apiKey,
}: ServiceFeeListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const mockServiceFees: ServiceFee[] = [
    {
      id: "1",
      name: "Payment Processing Fee",
      description: "Standard payment processing fee for all transactions",
      type: "percentage",
      value: 2.9,
      currency: "NAD",
      minAmount: 0.5,
      applicableServices: ["payment", "booking", "subscription"],
      status: "active",
      effectiveDate: "2024-01-01",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-15",
      serviceId: "payment-service",
      version: "1.0.0",
    },
    {
      id: "2",
      name: "Booking Service Fee",
      description: "Fee for booking management services",
      type: "fixed",
      value: 5.0,
      currency: "NAD",
      applicableServices: ["booking"],
      status: "active",
      effectiveDate: "2024-01-01",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-15",
      serviceId: "booking-service",
      version: "1.0.0",
    },
    {
      id: "3",
      name: "Subscription Management Fee",
      description: "Monthly fee for subscription management",
      type: "tiered",
      value: 0,
      currency: "NAD",
      minAmount: 0,
      maxAmount: 1000,
      applicableServices: ["subscription"],
      status: "active",
      effectiveDate: "2024-01-01",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-15",
      serviceId: "subscription-service",
      version: "1.0.0",
    },
    {
      id: "4",
      name: "Premium Support Fee",
      description: "Additional fee for premium support services",
      type: "percentage",
      value: 1.5,
      currency: "NAD",
      applicableServices: ["support", "consulting"],
      status: "draft",
      effectiveDate: "2024-02-01",
      createdAt: "2024-01-10",
      updatedAt: "2024-01-10",
      serviceId: "support-service",
      version: "1.0.0",
    },
  ];

  const displayServiceFees = serviceFees || mockServiceFees;

  const filteredServiceFees = displayServiceFees.filter((fee) => {
    const matchesSearch =
      fee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || fee.type === filterType;
    const matchesStatus = filterStatus === "all" || fee.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "percentage":
        return "bg-blue-100 text-blue-800";
      case "fixed":
        return "bg-green-100 text-green-800";
      case "tiered":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "inactive":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "draft":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatFeeValue = (fee: ServiceFee) => {
    switch (fee.type) {
      case "percentage":
        return `${fee.value}%`;
      case "fixed":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: fee.currency,
        }).format(fee.value);
      case "tiered":
        return "Tiered";
      default:
        return `${fee.value}`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const totalActiveFees = displayServiceFees.filter(
    (fee) => fee.status === "active",
  ).length;
  const totalRevenue = displayServiceFees.reduce((sum, fee) => {
    // This would be calculated from actual usage data in a real implementation
    return sum + fee.value * 100; // Mock calculation
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Service Fees</h1>
          <p className="text-gray-600">
            Manage service fees across microservices
          </p>
        </div>
        <Button onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Create Fee
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Fees</p>
                <p className="text-2xl font-bold">
                  {displayServiceFees.length}
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
                <p className="text-sm text-gray-600">Active Fees</p>
                <p className="text-2xl font-bold">{totalActiveFees}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Percent className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Percentage Fees</p>
                <p className="text-2xl font-bold">
                  {
                    displayServiceFees.filter((f) => f.type === "percentage")
                      .length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Fixed Fees</p>
                <p className="text-2xl font-bold">
                  {displayServiceFees.filter((f) => f.type === "fixed").length}
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
                  placeholder="Search service fees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Types</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
              <option value="tiered">Tiered</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Service Fees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Fee List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Fee Name</th>
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-left p-3 font-medium">Value</th>
                  <th className="text-left p-3 font-medium">Services</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Effective Date</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServiceFees.map((fee) => (
                  <tr key={fee.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{fee.name}</div>
                        <div className="text-sm text-gray-600">
                          {fee.description}
                        </div>
                        <div className="text-xs text-gray-500">
                          Service: {fee.serviceId}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={getTypeColor(fee.type)}>
                        {fee.type}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{formatFeeValue(fee)}</div>
                      {fee.minAmount !== undefined && (
                        <div className="text-xs text-gray-500">
                          Min:{" "}
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: fee.currency,
                          }).format(fee.minAmount)}
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {fee.applicableServices.map((service, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(fee.status)}
                        <Badge className={getStatusColor(fee.status)}>
                          {fee.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        {formatDate(fee.effectiveDate)}
                      </div>
                      {fee.expiryDate && (
                        <div className="text-xs text-gray-500">
                          Expires: {formatDate(fee.expiryDate)}
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onView?.(fee.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit?.(fee.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete?.(fee.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredServiceFees.length === 0 && (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No service fees found
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterType !== "all" || filterStatus !== "all"
                  ? "No service fees match your search criteria."
                  : "Create your first service fee to get started."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Microservice Integration Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-800">
                Microservice Integration
              </h3>
              <p className="text-sm text-blue-700">
                Service fees are managed through the Revenue Service
                microservice at{" "}
                <code className="bg-blue-100 px-1 rounded">
                  {revenueServiceUrl}
                </code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

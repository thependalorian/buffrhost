/**
 * Subscription List Component
 *
 * Displays and manages subscription plans
 */

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  DollarSign,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: "monthly" | "yearly" | "lifetime";
  features: string[];
  status: "active" | "inactive" | "draft";
  subscribers: number;
  revenue: number;
  createdAt: string;
  updatedAt: string;
}

interface SubscriptionListProps {
  subscriptions?: Subscription[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onCreate?: () => void;
}

export default function SubscriptionList({
  subscriptions,
  onEdit,
  onDelete,
  onView,
  onCreate,
}: SubscriptionListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const mockSubscriptions: Subscription[] = [
    {
      id: "1",
      name: "Basic Plan",
      description: "Essential features for small properties",
      price: 29.99,
      currency: "NAD",
      billingCycle: "monthly",
      features: ["Up to 10 rooms", "Basic reporting", "Email support"],
      status: "active",
      subscribers: 45,
      revenue: 1349.55,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Professional Plan",
      description: "Advanced features for growing businesses",
      price: 79.99,
      currency: "NAD",
      billingCycle: "monthly",
      features: [
        "Up to 50 rooms",
        "Advanced analytics",
        "Priority support",
        "API access",
      ],
      status: "active",
      subscribers: 23,
      revenue: 1839.77,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-15",
    },
    {
      id: "3",
      name: "Enterprise Plan",
      description: "Full-featured solution for large properties",
      price: 199.99,
      currency: "NAD",
      billingCycle: "monthly",
      features: [
        "Unlimited rooms",
        "Custom integrations",
        "24/7 support",
        "White-label",
      ],
      status: "active",
      subscribers: 8,
      revenue: 1599.92,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-15",
    },
    {
      id: "4",
      name: "Starter Plan",
      description: "Free plan for new users",
      price: 0,
      currency: "NAD",
      billingCycle: "monthly",
      features: ["Up to 3 rooms", "Basic features"],
      status: "draft",
      subscribers: 0,
      revenue: 0,
      createdAt: "2024-01-10",
      updatedAt: "2024-01-10",
    },
  ];

  const displaySubscriptions = subscriptions || mockSubscriptions;

  const filteredSubscriptions = displaySubscriptions.filter((subscription) => {
    const matchesSearch =
      subscription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || subscription.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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

  const getBillingCycleColor = (cycle: string) => {
    switch (cycle) {
      case "monthly":
        return "bg-blue-100 text-blue-800";
      case "yearly":
        return "bg-purple-100 text-purple-800";
      case "lifetime":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  const totalRevenue = displaySubscriptions.reduce(
    (sum, sub) => sum + sub.revenue,
    0,
  );
  const totalSubscribers = displaySubscriptions.reduce(
    (sum, sub) => sum + sub.subscribers,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subscription Plans</h1>
          <p className="text-gray-600">Manage your subscription offerings</p>
        </div>
        <Button onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Create Plan
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Plans</p>
                <p className="text-2xl font-bold">
                  {displaySubscriptions.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Total Subscribers</p>
                <p className="text-2xl font-bold">{totalSubscribers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold">
                  {formatPrice(totalRevenue, "NAD")}
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
                <p className="text-sm text-gray-600">Active Plans</p>
                <p className="text-2xl font-bold">
                  {
                    displaySubscriptions.filter((s) => s.status === "active")
                      .length
                  }
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
                  placeholder="Search subscriptions..."
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

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubscriptions.map((subscription) => (
          <Card
            key={subscription.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{subscription.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {subscription.description}
                  </p>
                </div>
                {getStatusIcon(subscription.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {formatPrice(subscription.price, subscription.currency)}
                </div>
                <div className="text-sm text-gray-600">
                  per {subscription.billingCycle}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Features:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {subscription.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(subscription.status)}>
                  {subscription.status}
                </Badge>
                <Badge
                  className={getBillingCycleColor(subscription.billingCycle)}
                >
                  {subscription.billingCycle}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-green-600">
                    {subscription.subscribers}
                  </div>
                  <div className="text-gray-600">Subscribers</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-purple-600">
                    {formatPrice(subscription.revenue, subscription.currency)}
                  </div>
                  <div className="text-gray-600">Revenue</div>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView?.(subscription.id)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(subscription.id)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete?.(subscription.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSubscriptions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No subscriptions found
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== "all"
                ? "No subscriptions match your search criteria."
                : "Create your first subscription plan to get started."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * Email Template Manager Component
 *
 * Manages email templates for the system
 */

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  Search,
  Filter,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  type: "booking" | "payment" | "system" | "marketing";
  status: "active" | "draft" | "archived";
  lastModified: string;
  usage: number;
  description: string;
}

interface EmailTemplateManagerProps {
  templates?: EmailTemplate[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onPreview?: (id: string) => void;
}

export default function EmailTemplateManager({
  templates,
  onEdit,
  onDelete,
  onDuplicate,
  onPreview,
}: EmailTemplateManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const mockTemplates: EmailTemplate[] = [
    {
      id: "1",
      name: "Booking Confirmation",
      subject: "Your booking at {{property_name}} is confirmed",
      type: "booking",
      status: "active",
      lastModified: "2024-01-15 10:30",
      usage: 45,
      description: "Standard booking confirmation email",
    },
    {
      id: "2",
      name: "Payment Receipt",
      subject: "Payment Receipt - {{transaction_id}}",
      type: "payment",
      status: "active",
      lastModified: "2024-01-14 16:45",
      usage: 32,
      description: "Payment confirmation and receipt",
    },
    {
      id: "3",
      name: "Welcome Email",
      subject: "Welcome to {{property_name}}!",
      type: "marketing",
      status: "draft",
      lastModified: "2024-01-13 14:20",
      usage: 0,
      description: "Welcome email for new guests",
    },
    {
      id: "4",
      name: "System Maintenance",
      subject: "Scheduled Maintenance Notice",
      type: "system",
      status: "active",
      lastModified: "2024-01-12 09:15",
      usage: 8,
      description: "System maintenance notifications",
    },
  ];

  const displayTemplates = templates || mockTemplates;

  const filteredTemplates = displayTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || template.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "booking":
        return "bg-blue-100 text-blue-800";
      case "payment":
        return "bg-green-100 text-green-800";
      case "system":
        return "bg-purple-100 text-purple-800";
      case "marketing":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "draft":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "archived":
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Templates</h1>
          <p className="text-gray-600">
            Manage email templates for your communications
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Types</option>
              <option value="booking">Booking</option>
              <option value="payment">Payment</option>
              <option value="system">System</option>
              <option value="marketing">Marketing</option>
            </select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {template.description}
                  </p>
                </div>
                {getStatusIcon(template.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Subject:</p>
                <p className="text-sm text-gray-600 truncate">
                  {template.subject}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Badge className={getTypeColor(template.type)}>
                  {template.type}
                </Badge>
                <Badge className={getStatusColor(template.status)}>
                  {template.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <FileText className="w-3 h-3" />
                  <span>{template.usage} uses</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{template.lastModified}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPreview?.(template.id)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(template.id)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDuplicate?.(template.id)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete?.(template.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No templates found
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterType !== "all"
                ? "No templates match your search criteria."
                : "Create your first email template to get started."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Template Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Template Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {displayTemplates.length}
              </div>
              <p className="text-sm text-gray-600">Total Templates</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {displayTemplates.filter((t) => t.status === "active").length}
              </div>
              <p className="text-sm text-gray-600">Active</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {displayTemplates.filter((t) => t.status === "draft").length}
              </div>
              <p className="text-sm text-gray-600">Drafts</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {displayTemplates.reduce((sum, t) => sum + t.usage, 0)}
              </div>
              <p className="text-sm text-gray-600">Total Usage</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

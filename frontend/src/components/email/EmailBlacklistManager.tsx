/**
 * Email Blacklist Manager Component
 *
 * Manages email blacklist and spam prevention
 */

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Plus,
  Trash2,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  User,
  Globe,
} from "lucide-react";

interface BlacklistItem {
  id: string;
  email: string;
  domain?: string;
  reason: "spam" | "bounce" | "complaint" | "manual";
  addedDate: string;
  addedBy: string;
  status: "active" | "disabled";
  description?: string;
}

interface EmailBlacklistManagerProps {
  blacklistItems?: BlacklistItem[];
  onAdd?: (email: string, reason: string, description?: string) => void;
  onRemove?: (id: string) => void;
  onToggle?: (id: string) => void;
}

export default function EmailBlacklistManager({
  blacklistItems,
  onAdd,
  onRemove,
  onToggle,
}: EmailBlacklistManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterReason, setFilterReason] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newReason, setNewReason] = useState("manual");
  const [newDescription, setNewDescription] = useState("");

  const mockBlacklistItems: BlacklistItem[] = [
    {
      id: "1",
      email: "spam@example.com",
      reason: "spam",
      addedDate: "2024-01-15 10:30",
      addedBy: "admin@buffrhost.com",
      status: "active",
      description: "Multiple spam complaints",
    },
    {
      id: "2",
      email: "bounce@invalid.com",
      reason: "bounce",
      addedDate: "2024-01-14 16:45",
      addedBy: "system@buffrhost.com",
      status: "active",
      description: "Hard bounce - invalid domain",
    },
    {
      id: "3",
      domain: "spamdomain.com",
      reason: "spam",
      addedDate: "2024-01-13 14:20",
      addedBy: "admin@buffrhost.com",
      status: "active",
      description: "Known spam domain",
    },
    {
      id: "4",
      email: "complaint@example.com",
      reason: "complaint",
      addedDate: "2024-01-12 09:15",
      addedBy: "system@buffrhost.com",
      status: "disabled",
      description: "Unsubscribe complaint",
    },
  ];

  const displayItems = blacklistItems || mockBlacklistItems;

  const filteredItems = displayItems.filter((item) => {
    const matchesSearch =
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.domain?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterReason === "all" || item.reason === filterReason;
    return matchesSearch && matchesFilter;
  });

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case "spam":
        return "bg-red-100 text-red-800";
      case "bounce":
        return "bg-orange-100 text-orange-800";
      case "complaint":
        return "bg-yellow-100 text-yellow-800";
      case "manual":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "disabled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case "spam":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "bounce":
        return <Mail className="w-4 h-4 text-orange-500" />;
      case "complaint":
        return <User className="w-4 h-4 text-yellow-500" />;
      case "manual":
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleAdd = () => {
    if (newEmail.trim()) {
      onAdd?.(newEmail.trim(), newReason, newDescription.trim());
      setNewEmail("");
      setNewDescription("");
      setShowAddForm(false);
    }
  };

  const blacklistStats = {
    total: displayItems.length,
    active: displayItems.filter((item) => item.status === "active").length,
    disabled: displayItems.filter((item) => item.status === "disabled").length,
    spam: displayItems.filter((item) => item.reason === "spam").length,
    bounce: displayItems.filter((item) => item.reason === "bounce").length,
    complaint: displayItems.filter((item) => item.reason === "complaint")
      .length,
    manual: displayItems.filter((item) => item.reason === "manual").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Blacklist Manager</h1>
          <p className="text-gray-600">
            Manage email blacklist and spam prevention
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Add to Blacklist
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {blacklistStats.total}
            </div>
            <p className="text-sm text-gray-600">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {blacklistStats.active}
            </div>
            <p className="text-sm text-gray-600">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {blacklistStats.disabled}
            </div>
            <p className="text-sm text-gray-600">Disabled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {blacklistStats.spam}
            </div>
            <p className="text-sm text-gray-600">Spam</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {blacklistStats.bounce}
            </div>
            <p className="text-sm text-gray-600">Bounce</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {blacklistStats.complaint}
            </div>
            <p className="text-sm text-gray-600">Complaint</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {blacklistStats.manual}
            </div>
            <p className="text-sm text-gray-600">Manual</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add to Blacklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email or Domain</label>
                <Input
                  placeholder="email@example.com or example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Reason</label>
                <select
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="manual">Manual</option>
                  <option value="spam">Spam</option>
                  <option value="bounce">Bounce</option>
                  <option value="complaint">Complaint</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Description (Optional)
              </label>
              <Input
                placeholder="Reason for blacklisting..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Add to Blacklist
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search emails or domains..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={filterReason}
              onChange={(e) => setFilterReason(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Reasons</option>
              <option value="spam">Spam</option>
              <option value="bounce">Bounce</option>
              <option value="complaint">Complaint</option>
              <option value="manual">Manual</option>
            </select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Blacklist Items */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {getReasonIcon(item.reason)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-sm">
                        {item.email || item.domain}
                      </h3>
                      <Badge className={getReasonColor(item.reason)}>
                        {item.reason}
                      </Badge>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-600 mb-1">
                        {item.description}
                      </p>
                    )}
                    <div className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Added by:</span>{" "}
                      {item.addedBy}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{item.addedDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggle?.(item.id)}
                  >
                    {item.status === "active" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemove?.(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No blacklist items found
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterReason !== "all"
                ? "No items match your search criteria."
                : "No emails or domains are currently blacklisted."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

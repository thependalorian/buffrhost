/**
 * Service Fee Form Component
 *
 * Form for creating and editing service fees in serverless microservices architecture
 * Integrates with Revenue Service microservice
 */

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DollarSign,
  Save,
  X,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Settings,
  Percent,
  Calendar,
} from "lucide-react";

interface ServiceFeeFormData {
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
  notes?: string;
  // Microservice fields
  serviceId: string;
  version: string;
}

interface ServiceFeeFormProps {
  initialData?: Partial<ServiceFeeFormData>;
  onSubmit?: (data: ServiceFeeFormData) => Promise<void>;
  onCancel?: () => void;
  mode?: "create" | "edit";
  // Microservice integration
  revenueServiceUrl?: string;
  apiKey?: string;
  availableServices?: string[];
}

export default function ServiceFeeForm({
  initialData,
  onSubmit,
  onCancel,
  mode = "create",
  revenueServiceUrl = process.env.NEXT_PUBLIC_REVENUE_SERVICE_URL ||
    "https://revenue-service.buffrhost.com",
  apiKey,
  availableServices = [
    "payment",
    "booking",
    "subscription",
    "support",
    "consulting",
    "analytics",
  ],
}: ServiceFeeFormProps) {
  const [formData, setFormData] = useState<ServiceFeeFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    type: initialData?.type || "percentage",
    value: initialData?.value || 0,
    currency: initialData?.currency || "NAD",
    minAmount: initialData?.minAmount,
    maxAmount: initialData?.maxAmount,
    applicableServices: initialData?.applicableServices || [],
    status: initialData?.status || "draft",
    effectiveDate:
      initialData?.effectiveDate || new Date().toISOString().split("T")[0],
    expiryDate: initialData?.expiryDate,
    notes: initialData?.notes || "",
    serviceId: initialData?.serviceId || "",
    version: initialData?.version || "1.0.0",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Fee name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.value < 0) {
      newErrors.value = "Value must be non-negative";
    }

    if (formData.type === "percentage" && formData.value > 100) {
      newErrors.value = "Percentage cannot exceed 100%";
    }

    if (formData.applicableServices.length === 0) {
      newErrors.applicableServices = "At least one service must be selected";
    }

    if (!formData.serviceId.trim()) {
      newErrors.serviceId = "Service ID is required";
    }

    if (
      formData.minAmount !== undefined &&
      formData.maxAmount !== undefined &&
      formData.minAmount > formData.maxAmount
    ) {
      newErrors.minAmount =
        "Minimum amount cannot be greater than maximum amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof ServiceFeeFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleServiceToggle = (service: string) => {
    const newServices = formData.applicableServices.includes(service)
      ? formData.applicableServices.filter((s) => s !== service)
      : [...formData.applicableServices, service];

    setFormData((prev) => ({ ...prev, applicableServices: newServices }));

    if (errors.applicableServices) {
      setErrors((prev) => ({ ...prev, applicableServices: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare data for Revenue Service microservice
      const feeData = {
        ...formData,
        // Add microservice-specific fields
        service: "revenue",
        timestamp: new Date().toISOString(),
        // Include API key for authentication
        ...(apiKey && { apiKey }),
      };

      // Call Revenue Service microservice
      if (onSubmit) {
        await onSubmit(feeData);
      } else {
        // Default microservice call
        const response = await fetch(`${revenueServiceUrl}/api/service-fees`, {
          method: mode === "create" ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
          },
          body: JSON.stringify(feeData),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to ${mode} service fee: ${response.statusText}`,
          );
        }
      }
    } catch (error) {
      console.error("Error submitting service fee:", error);
      setErrors({ submit: "Failed to save service fee. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFeeValue = () => {
    switch (formData.type) {
      case "percentage":
        return `${formData.value}%`;
      case "fixed":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: formData.currency,
        }).format(formData.value);
      case "tiered":
        return "Tiered Structure";
      default:
        return `${formData.value}`;
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5" />
          <span>
            {mode === "create" ? "Create Service Fee" : "Edit Service Fee"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Basic Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Fee Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Payment Processing Fee"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceId">Service ID *</Label>
                <Input
                  id="serviceId"
                  value={formData.serviceId}
                  onChange={(e) =>
                    handleInputChange("serviceId", e.target.value)
                  }
                  placeholder="e.g., payment-service"
                  className={errors.serviceId ? "border-red-500" : ""}
                />
                {errors.serviceId && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.serviceId}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe what this fee covers..."
                rows={3}
                className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? "border-red-500" : ""
                }`}
              />
              {errors.description && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.description}</span>
                </p>
              )}
            </div>
          </div>

          {/* Fee Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Percent className="w-5 h-5" />
              <span>Fee Configuration</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Fee Type *</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                  <option value="tiered">Tiered Structure</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Value *</Label>
                <Input
                  id="value"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) =>
                    handleInputChange("value", parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.00"
                  className={errors.value ? "border-red-500" : ""}
                />
                {errors.value && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.value}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  value={formData.currency}
                  onChange={(e) =>
                    handleInputChange("currency", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="NAD">NAD</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            {/* Amount Limits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minAmount">Minimum Amount (Optional)</Label>
                <Input
                  id="minAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.minAmount || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "minAmount",
                      parseFloat(e.target.value) || undefined,
                    )
                  }
                  placeholder="0.00"
                  className={errors.minAmount ? "border-red-500" : ""}
                />
                {errors.minAmount && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.minAmount}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxAmount">Maximum Amount (Optional)</Label>
                <Input
                  id="maxAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.maxAmount || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "maxAmount",
                      parseFloat(e.target.value) || undefined,
                    )
                  }
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Fee Preview */}
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Fee Preview:</strong> {formatFeeValue()}
                {formData.minAmount && (
                  <span>
                    {" "}
                    (Min:{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: formData.currency,
                    }).format(formData.minAmount)}
                    )
                  </span>
                )}
                {formData.maxAmount && (
                  <span>
                    {" "}
                    (Max:{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: formData.currency,
                    }).format(formData.maxAmount)}
                    )
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Applicable Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Applicable Services *</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableServices.map((service) => (
                <label
                  key={service}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.applicableServices.includes(service)}
                    onChange={() => handleServiceToggle(service)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{service}</span>
                </label>
              ))}
            </div>

            {errors.applicableServices && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.applicableServices}</span>
              </p>
            )}
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Effective Dates</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="effectiveDate">Effective Date *</Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) =>
                    handleInputChange("effectiveDate", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate || ""}
                  onChange={(e) =>
                    handleInputChange("expiryDate", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Status</h3>

            <div className="space-y-2">
              <Label htmlFor="status">Fee Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Additional notes about this service fee..."
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.submit}</span>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSubmitting
                ? "Saving..."
                : mode === "create"
                  ? "Create Fee"
                  : "Update Fee"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

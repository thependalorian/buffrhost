/**
 * Design System Showcase Page for Buffr Host Frontend
 * 
 * Comprehensive demonstration of the emotional design system components.
 * Implements all wireframes and design principles from the comprehensive system.
 */

"use client";

import React, { useState } from "react";
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  KPICard,
  StatusBadge,
  EmotionalInput,
  EmotionalDataTable,
  EmotionalModal,
  LoadingSpinner,
  LoadingSkeleton,
  LoadingOverlay,
  CardSkeleton,
  TableSkeleton,
  ButtonLoading,
} from "@/src/components/ui";
import { EmotionalNavigation, NavigationItem } from "@/src/components/navigation/emotional-navigation";
import { EmotionalDashboard, DashboardHeader } from "@/src/components/layout/emotional-dashboard";

// Sample data for demonstrations
const sampleData = [
  {
    id: 1,
    name: "Sarah Wilson",
    room: "304",
    checkIn: "2024-02-15",
    status: "checked-in",
    amount: "$299",
  },
  {
    id: 2,
    name: "John Smith",
    room: "205",
    checkIn: "2024-02-16",
    status: "pending",
    amount: "$189",
  },
  {
    id: 3,
    name: "Maria Garcia",
    room: "101",
    checkIn: "2024-02-14",
    status: "checked-in",
    amount: "$399",
  },
];

const sampleColumns = [
  {
    key: "name",
    label: "Guest Name",
    sortable: true,
  },
  {
    key: "room",
    label: "Room",
    sortable: true,
  },
  {
    key: "checkIn",
    label: "Check-in",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (value: string) => (
      <StatusBadge 
        status={value === "checked-in" ? "success" : "warning"}
        emotional={true}
      >
        {value === "checked-in" ? "Checked In" : "Pending"}
      </StatusBadge>
    ),
  },
  {
    key: "amount",
    label: "Amount",
    sortable: true,
    align: "right" as const,
  },
];

const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
      </svg>
    ),
    active: true,
  },
  {
    id: "guests",
    label: "Guests",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    badge: "12",
  },
  {
    id: "rooms",
    label: "Rooms",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
      </svg>
    ),
  },
  {
    id: "revenue",
    label: "Revenue",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    ),
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export default function DesignSystemPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const handleSearch = (query: string) => {
    console.log("Search:", query);
  };

  const handleSort = (column: string, direction: "asc" | "desc") => {
    console.log("Sort:", column, direction);
  };

  const handleSelectionChange = (rows: any[]) => {
    setSelectedRows(rows);
  };

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <EmotionalDashboard
      navigation={{
        items: navigationItems,
        user: {
          name: "Sarah Chen",
          email: "sarah.chen@etunahotel.com",
          role: "Administrator",
        },
      }}
      header={{
        title: "Design System Showcase",
        subtitle: "Comprehensive demonstration of Buffr Host's emotional design system",
        breadcrumbs: [
          { label: "Home", href: "/" },
          { label: "Design System" },
        ],
        actions: (
          <div className="flex items-center gap-3">
            <Button variant="secondary">
              Export
            </Button>
            <Button variant="default">
              Add New
            </Button>
          </div>
        ),
      }}
    >
      <div className="space-y-8">
        {/* KPI Cards Section */}
        <section>
          <h2 className="text-2xl font-display font-bold text-nude-900 mb-6">
            KPI Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Total Revenue"
              value="$12,450"
              trend={{ value: 12, label: "vs last month", positive: true }}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              }
            />
            <KPICard
              title="Occupancy Rate"
              value="85%"
              trend={{ value: 5, label: "vs last month", positive: true }}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
              }
            />
            <KPICard
              title="Guest Satisfaction"
              value="4.8/5"
              trend={{ value: 0.2, label: "vs last month", positive: true }}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              }
            />
            <KPICard
              title="Staff Performance"
              value="92%"
              trend={{ value: 3, label: "vs last month", positive: true }}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              }
            />
          </div>
        </section>

        {/* Status Badges Section */}
        <section>
          <h2 className="text-2xl font-display font-bold text-nude-900 mb-6">
            Status Badges
          </h2>
          <div className="flex flex-wrap gap-4">
            <StatusBadge status="success" emotional={true}>
              Success
            </StatusBadge>
            <StatusBadge status="warning" emotional={true}>
              Warning
            </StatusBadge>
            <StatusBadge status="error" emotional={true}>
              Error
            </StatusBadge>
            <StatusBadge status="info" emotional={true}>
              Info
            </StatusBadge>
            <StatusBadge status="active" emotional={true}>
              Active
            </StatusBadge>
            <StatusBadge status="inactive" emotional={true}>
              Inactive
            </StatusBadge>
          </div>
        </section>

        {/* Buttons Section */}
        <section>
          <h2 className="text-2xl font-display font-bold text-nude-900 mb-6">
            Buttons
          </h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="default">
                Primary Button
              </Button>
              <Button variant="secondary">
                Secondary Button
              </Button>
              <Button variant="outline">
                Outline Button
              </Button>
              <Button variant="ghost">
                Ghost Button
              </Button>
              <Button variant="destructive">
                Danger Button
              </Button>
              <Button variant="link">
                Link Button
              </Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="sm">
                Small
              </Button>
              <Button size="default">
                Default
              </Button>
              <Button size="lg">
                Large
              </Button>
            </div>
          </div>
        </section>

        {/* Form Elements Section */}
        <section>
          <h2 className="text-2xl font-display font-bold text-nude-900 mb-6">
            Form Elements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <EmotionalInput
                label="Email Address"
                placeholder="Enter your email"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                }
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-nude-700">Message</label>
                <textarea
                  className="flex w-full rounded-lg border border-nude-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-nude-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nude-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-nude-300 focus:border-nude-600 focus:shadow-nude-soft"
                  placeholder="Enter your message"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-nude-700">Room Type</label>
                <select className="flex w-full rounded-lg border border-nude-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nude-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-nude-300 focus:border-nude-600 focus:shadow-nude-soft">
                  <option value="">Select room type</option>
                  <option value="standard">Standard Room</option>
                  <option value="premium">Premium Room</option>
                  <option value="suite">Suite</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <EmotionalInput
                label="Phone Number"
                placeholder="Enter phone number"
                error="Phone number is required"
              />
              <EmotionalInput
                label="Check-in Date"
                type="date"
                helperText="Select your preferred check-in date"
              />
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section>
          <h2 className="text-2xl font-display font-bold text-nude-900 mb-6">
            Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-nude-600">
                  This is a default hospitality card with emotional design principles.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Luxury Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-nude-600">
                  This is a luxury card with premium styling and gold accents.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Spa Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-nude-600">
                  This is a spa card with serene colors and calming design.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Data Table Section */}
        <section>
          <h2 className="text-2xl font-display font-bold text-nude-900 mb-6">
            Data Table
          </h2>
          <EmotionalDataTable
            data={sampleData}
            columns={sampleColumns}
            searchable={true}
            sortable={true}
            selectable={true}
            selectedRows={selectedRows}
            onSelectionChange={handleSelectionChange}
            onSearch={handleSearch}
            onSort={handleSort}
            pagination={{
              page: 1,
              pageSize: 10,
              total: 3,
              onPageChange: (page) => console.log("Page:", page),
              onPageSizeChange: (size) => console.log("Size:", size),
            }}
            actions={
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  Export
                </Button>
                <Button variant="default" size="sm">
                  Add Guest
                </Button>
              </div>
            }
          />
        </section>

        {/* Loading States Section */}
        <section>
          <h2 className="text-2xl font-display font-bold text-nude-900 mb-6">
            Loading States
          </h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <LoadingSpinner size="sm" />
              <LoadingSpinner size="md" />
              <LoadingSpinner size="lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CardSkeleton />
              <TableSkeleton />
            </div>
            <div className="space-y-4">
              <ButtonLoading
                isLoading={isLoading}
                onClick={handleLoadingDemo}
              >
                {isLoading ? "Loading..." : "Click to Load"}
              </ButtonLoading>
              <LoadingOverlay isLoading={isLoading}>
                <Card>
                  <CardContent className="p-6">
                    <p>This content will be hidden when loading.</p>
                  </CardContent>
                </Card>
              </LoadingOverlay>
            </div>
          </div>
        </section>

        {/* Modals Section */}
        <section>
          <h2 className="text-2xl font-display font-bold text-nude-900 mb-6">
            Modals
          </h2>
          <div className="flex gap-4">
            <Button
              variant="default"
              onClick={() => setIsModalOpen(true)}
            >
              Open Modal
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsConfirmModalOpen(true)}
            >
              Open Confirm Modal
            </Button>
          </div>
        </section>
      </div>

      {/* Modal */}
      <EmotionalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Sample Modal"
        description="This is a sample modal with emotional design principles."
        size="md"
        actions={
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={() => setIsModalOpen(false)}>
              Confirm
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-nude-600">
            This modal demonstrates the emotional design system with warm colors,
            smooth animations, and luxury hospitality styling.
          </p>
          <EmotionalInput
            label="Sample Input"
            placeholder="Enter some text"
          />
        </div>
      </EmotionalModal>

      {/* Confirm Modal */}
      <EmotionalModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Action"
        description="Are you sure you want to perform this action? This cannot be undone."
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => {
              console.log("Confirmed!");
              setIsConfirmModalOpen(false);
            }}>
              Confirm
            </Button>
          </div>
        }
      >
        <div className="text-center">
          <p className="text-nude-600">This action cannot be undone.</p>
        </div>
      </EmotionalModal>
    </EmotionalDashboard>
  );
}
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Badge } from "./badge";

// Button Components
export function ButtonPrimary({ children, className = "", ...props }: any) {
  return (
    <Button className={`bg-nude-600 hover:bg-nude-700 text-white ${className}`} {...props}>
      {children}
    </Button>
  );
}

export function ButtonSecondary({ children, className = "", ...props }: any) {
  return (
    <Button variant="outline" className={`border-nude-300 text-nude-700 hover:bg-nude-50 ${className}`} {...props}>
      {children}
    </Button>
  );
}

export function ButtonAccent({ children, className = "", ...props }: any) {
  return (
    <Button className={`bg-nude-500 hover:bg-nude-600 text-white ${className}`} {...props}>
      {children}
    </Button>
  );
}

// Card Components
export function HospitalityCard({ children, className = "", ...props }: any) {
  return (
    <Card className={`bg-white border-nude-200 shadow-sm hover:shadow-md transition-shadow ${className}`} {...props}>
      {children}
    </Card>
  );
}

export function LayeredNudeCard({ children, className = "", ...props }: any) {
  return (
    <Card className={`bg-gradient-to-br from-nude-50 to-nude-100 border-nude-200 ${className}`} {...props}>
      {children}
    </Card>
  );
}

export function DashboardCard({ children, className = "", ...props }: any) {
  return (
    <Card className={`bg-white border-nude-200 shadow-sm ${className}`} {...props}>
      {children}
    </Card>
  );
}

// Form Components
export function FormInput({ label, className = "", ...props }: any) {
  return (
    <div className="space-y-2">
      {label && <Label className="text-nude-700 font-medium">{label}</Label>}
      <Input className={`border-nude-300 focus:border-nude-600 focus:ring-nude-600 ${className}`} {...props} />
    </div>
  );
}

// Navigation Components
export function NavLink({ href, children, active = false, className = "", ...props }: any) {
  return (
    <a
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active 
          ? 'bg-nude-100 text-nude-900' 
          : 'text-nude-600 hover:text-nude-900 hover:bg-nude-50'
      } ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}

// Data Table Component
export function DataTable({ data, headers, className = "", ...props }: any) {
  return (
    <div className={`overflow-x-auto ${className}`} {...props}>
      <table className="min-w-full divide-y divide-nude-200">
        <thead className="bg-nude-50">
          <tr>
            {headers.map((header: string, index: number) => (
              <th key={index} className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-nude-200">
          {data.map((row: any[], rowIndex: number) => (
            <tr key={rowIndex}>
              {row.map((cell: any, cellIndex: number) => (
                <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-nude-900">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Loading Components
export function NudeWaveLoader({ className = "", ...props }: any) {
  return (
    <div className={`flex justify-center items-center ${className}`} {...props}>
      <div className="animate-pulse flex space-x-1">
        <div className="w-2 h-2 bg-nude-400 rounded-full"></div>
        <div className="w-2 h-2 bg-nude-500 rounded-full"></div>
        <div className="w-2 h-2 bg-nude-600 rounded-full"></div>
      </div>
    </div>
  );
}

export function WarmGlowLoader({ className = "", ...props }: any) {
  return (
    <div className={`flex justify-center items-center ${className}`} {...props}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nude-600"></div>
    </div>
  );
}

// Hover Effects
export function WarmGlowHover({ children, className = "", ...props }: any) {
  return (
    <div className={`transition-all duration-300 hover:shadow-lg hover:shadow-nude-200 ${className}`} {...props}>
      {children}
    </div>
  );
}

// Modal Component
export function Modal({ isOpen, onClose, children, className = "", ...props }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${className}`} {...props}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Toast Component
export function Toast({ message, type = "info", onClose, className = "", ...props }: any) {
  const typeClasses = {
    info: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800"
  };

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${typeClasses[type]} ${className}`} {...props}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        {onClose && (
          <button onClick={onClose} className="ml-4 text-current hover:opacity-75">
            ×
          </button>
        )}
      </div>
    </div>
  );
}

// Additional Nude Components
export function NudeButton({ children, className = "", ...props }: any) {
  return (
    <Button className={`bg-nude-600 hover:bg-nude-700 text-white ${className}`} {...props}>
      {children}
    </Button>
  );
}

export function NudeCard({ children, className = "", ...props }: any) {
  return (
    <Card className={`bg-white border-nude-200 shadow-sm ${className}`} {...props}>
      {children}
    </Card>
  );
}

export function NudeCardTitle({ children, className = "", ...props }: any) {
  return (
    <CardTitle className={`text-nude-900 ${className}`} {...props}>
      {children}
    </CardTitle>
  );
}

export function NudeCardBody({ children, className = "", ...props }: any) {
  return (
    <CardContent className={`text-nude-700 ${className}`} {...props}>
      {children}
    </CardContent>
  );
}

export function NudeCardActions({ children, className = "", ...props }: any) {
  return (
    <div className={`flex justify-end space-x-2 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function NudeBadge({ children, variant = "default", className = "", ...props }: any) {
  const variantClasses = {
    default: "bg-nude-100 text-nude-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800"
  };

  return (
    <Badge className={`${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </Badge>
  );
}

export function NudeStatCard({ title, value, change, changeType, icon, className = "", ...props }: any) {
  const changeColor = changeType === "positive" ? "text-green-600" : changeType === "negative" ? "text-red-600" : "text-gray-600";
  
  return (
    <Card className={`bg-white border-nude-200 shadow-sm ${className}`} {...props}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-nude-600">{title}</p>
            <p className="text-2xl font-bold text-nude-900">{value}</p>
            {change && (
              <p className={`text-sm ${changeColor}`}>
                {changeType === "positive" ? "+" : changeType === "negative" ? "-" : ""}{change}
              </p>
            )}
          </div>
          {icon && (
            <div className="text-nude-400">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Main Design System Component
export function NudeDesignSystem() {
  return (
    <div className="space-y-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-display font-bold text-nude-900 mb-4">
          Nude Design System
        </h1>
        <p className="text-lg text-nude-600">
          A comprehensive design system for luxury hospitality applications
        </p>
      </div>

      {/* Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle>Color Palette</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: "Nude 50", class: "bg-nude-50", text: "text-nude-900" },
              { name: "Nude 100", class: "bg-nude-100", text: "text-nude-900" },
              { name: "Nude 200", class: "bg-nude-200", text: "text-nude-900" },
              { name: "Nude 300", class: "bg-nude-300", text: "text-nude-900" },
              { name: "Nude 400", class: "bg-nude-400", text: "text-white" },
              { name: "Nude 500", class: "bg-nude-500", text: "text-white" },
              { name: "Nude 600", class: "bg-nude-600", text: "text-white" },
              { name: "Nude 700", class: "bg-nude-700", text: "text-white" },
              { name: "Nude 800", class: "bg-nude-800", text: "text-white" },
              { name: "Nude 900", class: "bg-nude-900", text: "text-white" },
            ].map((color) => (
              <div key={color.name} className="text-center">
                <div className={`w-20 h-20 rounded-lg ${color.class} ${color.text} flex items-center justify-center mb-2`}>
                  {color.name}
                </div>
                <div className="text-sm text-nude-600">{color.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-nude-900">Display Heading</h1>
            <p className="text-sm text-nude-600">font-display text-4xl font-bold</p>
          </div>
          <div>
            <h2 className="text-2xl font-display font-semibold text-nude-800">Section Heading</h2>
            <p className="text-sm text-nude-600">font-display text-2xl font-semibold</p>
          </div>
          <div>
            <h3 className="text-xl font-primary font-semibold text-nude-800">Card Heading</h3>
            <p className="text-sm text-nude-600">font-primary text-xl font-semibold</p>
          </div>
          <div>
            <p className="text-base text-nude-700">Body text for regular content and descriptions.</p>
            <p className="text-sm text-nude-600">font-primary text-base text-nude-700</p>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <ButtonPrimary>Primary Button</ButtonPrimary>
            <ButtonSecondary>Secondary Button</ButtonSecondary>
            <ButtonAccent>Accent Button</ButtonAccent>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>
        </CardContent>
      </Card>

      {/* Forms */}
      <Card>
        <CardHeader>
          <CardTitle>Form Elements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput label="Example Input" placeholder="Enter text here" />
          <div>
            <Label htmlFor="example-textarea">Example Textarea</Label>
            <textarea 
              id="example-textarea" 
              className="w-full p-3 border border-nude-300 rounded-lg focus:ring-2 focus:ring-nude-600 focus:border-nude-600"
              placeholder="Enter longer text here"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
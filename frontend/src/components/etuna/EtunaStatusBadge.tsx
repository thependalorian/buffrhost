'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EtunaStatusBadgeProps {
  status: string;
  icon?: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function EtunaStatusBadge({
  status,
  icon: Icon,
  size = 'md',
  className = ''
}: EtunaStatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'completed':
      case 'available':
      case 'active':
      case 'success':
        return 'text-success bg-success/10';
      case 'pending':
      case 'warning':
      case 'preparing':
      case 'cleaning':
        return 'text-warning bg-warning/10';
      case 'checked-in':
      case 'occupied':
      case 'info':
        return 'text-info bg-info/10';
      case 'cancelled':
      case 'error':
      case 'urgent':
      case 'maintenance':
      case 'out-of-order':
        return 'text-error bg-error/10';
      case 'ready':
      case 'delivered':
        return 'text-primary bg-primary/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'badge-sm';
      case 'lg':
        return 'badge-lg';
      default:
        return '';
    }
  };

  return (
    <div className={`badge ${getStatusColor(status)} ${getSizeClasses()} ${className}`}>
      {Icon && <Icon className="w-3 h-3 mr-1" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
}
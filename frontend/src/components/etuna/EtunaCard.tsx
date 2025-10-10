'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EtunaCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export default function EtunaCard({
  title,
  subtitle,
  icon: Icon,
  iconColor = 'bg-primary',
  children,
  actions,
  className = ''
}: EtunaCardProps) {
  return (
    <div className={`card bg-base-100 shadow-xl ${className}`}>
      <div className="card-body">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className={`p-3 rounded-lg ${iconColor} text-white`}>
                <Icon className="w-6 h-6" />
              </div>
            )}
            <div>
              <h3 className="card-title text-lg">{title}</h3>
              {subtitle && (
                <p className="text-sm text-base-content/70">{subtitle}</p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex space-x-2">
              {actions}
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
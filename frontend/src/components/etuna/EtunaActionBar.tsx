'use client';

import React from 'react';
import { ActionButton } from '@/src/components/ui';
import EtunaSearchBar from './EtunaSearchBar';

interface EtunaActionBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export default function EtunaActionBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters,
  actions,
  className = ''
}: EtunaActionBarProps) {
  return (
    <div className={`card bg-base-100 shadow-xl ${className}`}>
      <div className="card-body">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 items-center flex-1">
            <EtunaSearchBar
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={onSearchChange}
            />
            {filters && (
              <div className="flex gap-2">
                {filters}
              </div>
            )}
          </div>
          {actions && (
            <div className="flex gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
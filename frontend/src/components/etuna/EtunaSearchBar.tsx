'use client';

import React from 'react';
import { Search, Filter } from 'lucide-react';

interface EtunaSearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onFilter?: () => void;
  showFilter?: boolean;
  className?: string;
}

export default function EtunaSearchBar({
  placeholder = 'Search...',
  value,
  onChange,
  onFilter,
  showFilter = true,
  className = ''
}: EtunaSearchBarProps) {
  return (
    <div className={`form-control ${className}`}>
      <div className="input-group">
        <input
          type="text"
          placeholder={placeholder}
          className="input input-bordered flex-1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button className="btn btn-square">
          <Search className="w-5 h-5" />
        </button>
        {showFilter && onFilter && (
          <button className="btn btn-square btn-outline" onClick={onFilter}>
            <Filter className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
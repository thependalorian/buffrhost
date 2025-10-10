'use client';

import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';

export interface FormDatePickerProps {
  label?: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  success?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  min?: string;
  max?: string;
}

export default function FormDatePicker({
  label,
  name,
  value,
  onChange,
  placeholder = 'Select date',
  required = false,
  disabled = false,
  error,
  success,
  helperText,
  size = 'md',
  className = '',
  min,
  max
}: FormDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: 'input-sm',
    md: 'input-md',
    lg: 'input-lg'
  };

  const getInputClasses = () => {
    let classes = `input input-bordered w-full ${sizeClasses[size]}`;
    
    if (error) {
      classes += ' input-error';
    } else if (success) {
      classes += ' input-success';
    }
    
    if (disabled) {
      classes += ' input-disabled';
    }
    
    return classes;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const clearDate = () => {
    onChange('');
  };

  return (
    <div className={`form-control ${className}`}>
      {label && (
        <label className="label">
          <span className="label-text">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
      )}
      
      <div className="relative">
        <input
          type="date"
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          className={getInputClasses()}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <Calendar className="w-4 h-4 text-base-content/50" />
        </div>
        
        {value && !disabled && (
          <button
            type="button"
            onClick={clearDate}
            className="absolute inset-y-0 right-8 flex items-center pr-2 hover:text-error"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {(error || success || helperText) && (
        <label className="label">
          <span className={`label-text-alt ${error ? 'text-error' : success ? 'text-success' : 'text-base-content/70'}`}>
            {error || success || helperText}
          </span>
        </label>
      )}
    </div>
  );
}
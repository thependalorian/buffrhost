'use client';

import React from 'react';
import { ChevronDown, AlertCircle, CheckCircle } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps {
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
  success?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'bordered' | 'ghost';
  className?: string;
  multiple?: boolean;
}

export default function FormSelect({
  label,
  name,
  placeholder = 'Select an option',
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  error,
  success,
  helperText,
  size = 'md',
  variant = 'default',
  className = '',
  multiple = false
}: FormSelectProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'select-sm';
      case 'lg':
        return 'select-lg';
      default:
        return '';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'bordered':
        return 'select-bordered';
      case 'ghost':
        return 'select-ghost';
      default:
        return '';
    }
  };

  const getSelectClasses = () => {
    let classes = `select w-full ${getSizeClasses()} ${getVariantClasses()}`;
    
    if (error) {
      classes += ' select-error';
    } else if (success) {
      classes += ' select-success';
    }
    
    if (disabled) {
      classes += ' select-disabled';
    }
    
    return `${classes} ${className}`;
  };

  const getLabelClasses = () => {
    let classes = 'label';
    if (required) {
      classes += ' label-required';
    }
    return classes;
  };

  return (
    <div className="form-control w-full">
      <label className={getLabelClasses()}>
        <span className="label-text font-medium">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </span>
      </label>
      
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          multiple={multiple}
          className={getSelectClasses()}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {(error || success) && (
          <div className="absolute inset-y-0 right-8 flex items-center">
            {error ? (
              <AlertCircle className="h-4 w-4 text-error" />
            ) : (
              <CheckCircle className="h-4 w-4 text-success" />
            )}
          </div>
        )}
      </div>
      
      {(error || success || helperText) && (
        <label className="label">
          <span className={`label-text-alt ${
            error ? 'text-error' : success ? 'text-success' : 'text-base-content/70'
          }`}>
            {error || success || helperText}
          </span>
        </label>
      )}
    </div>
  );
}
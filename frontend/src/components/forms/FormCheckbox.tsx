'use client';

import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface FormCheckboxProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  success?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  indeterminate?: boolean;
}

export default function FormCheckbox({
  label,
  name,
  checked,
  onChange,
  required = false,
  disabled = false,
  error,
  success,
  helperText,
  size = 'md',
  className = '',
  indeterminate = false
}: FormCheckboxProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'checkbox-sm';
      case 'lg':
        return 'checkbox-lg';
      default:
        return '';
    }
  };

  const getCheckboxClasses = () => {
    let classes = `checkbox ${getSizeClasses()}`;
    
    if (error) {
      classes += ' checkbox-error';
    } else if (success) {
      classes += ' checkbox-success';
    }
    
    if (disabled) {
      classes += ' checkbox-disabled';
    }
    
    return `${classes} ${className}`;
  };

  const getLabelClasses = () => {
    let classes = 'label cursor-pointer';
    if (required) {
      classes += ' label-required';
    }
    return classes;
  };

  return (
    <div className="form-control">
      <label className={getLabelClasses()}>
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          required={required}
          disabled={disabled}
          className={getCheckboxClasses()}
          ref={(el) => {
            if (el) el.indeterminate = indeterminate;
          }}
        />
        <span className="label-text font-medium ml-3">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </span>
        {(error || success) && (
          <div className="ml-2">
            {error ? (
              <AlertCircle className="h-4 w-4 text-error" />
            ) : (
              <CheckCircle className="h-4 w-4 text-success" />
            )}
          </div>
        )}
      </label>
      
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
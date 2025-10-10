'use client';

import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormRadioProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
  success?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export default function FormRadio({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  error,
  success,
  helperText,
  size = 'md',
  className = '',
  orientation = 'vertical'
}: FormRadioProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'radio-sm';
      case 'lg':
        return 'radio-lg';
      default:
        return '';
    }
  };

  const getRadioClasses = () => {
    let classes = `radio ${getSizeClasses()}`;
    
    if (error) {
      classes += ' radio-error';
    } else if (success) {
      classes += ' radio-success';
    }
    
    if (disabled) {
      classes += ' radio-disabled';
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

  const getContainerClasses = () => {
    return orientation === 'horizontal' 
      ? 'flex flex-wrap gap-4' 
      : 'space-y-2';
  };

  return (
    <div className="form-control">
      <label className={getLabelClasses()}>
        <span className="label-text font-medium">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </span>
      </label>
      
      <div className={getContainerClasses()}>
        {options.map((option) => (
          <label key={option.value} className="label cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              required={required}
              disabled={disabled || option.disabled}
              className={getRadioClasses()}
            />
            <span className="label-text ml-3">{option.label}</span>
          </label>
        ))}
      </div>
      
      {(error || success || helperText) && (
        <label className="label">
          <span className={`label-text-alt ${
            error ? 'text-error' : success ? 'text-success' : 'text-base-content/70'
          }`}>
            {error || success || helperText}
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
      )}
    </div>
  );
}
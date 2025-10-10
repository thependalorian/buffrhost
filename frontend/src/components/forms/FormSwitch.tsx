'use client';

import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface FormSwitchProps {
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
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export default function FormSwitch({
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
  color = 'primary',
  className = ''
}: FormSwitchProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'toggle-sm';
      case 'lg':
        return 'toggle-lg';
      default:
        return '';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'toggle-primary';
      case 'secondary':
        return 'toggle-secondary';
      case 'accent':
        return 'toggle-accent';
      case 'success':
        return 'toggle-success';
      case 'warning':
        return 'toggle-warning';
      case 'error':
        return 'toggle-error';
      case 'info':
        return 'toggle-info';
      default:
        return 'toggle-primary';
    }
  };

  const getToggleClasses = () => {
    let classes = `toggle ${getSizeClasses()} ${getColorClasses()}`;
    
    if (disabled) {
      classes += ' toggle-disabled';
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
        <span className="label-text font-medium">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </span>
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          required={required}
          disabled={disabled}
          className={getToggleClasses()}
        />
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
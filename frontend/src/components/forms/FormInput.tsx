'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

interface FormInputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  success?: string;
  helperText?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'bordered' | 'ghost';
  className?: string;
}

export default function FormInput({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  success,
  helperText,
  icon,
  size = 'md',
  variant = 'default',
  className = ''
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'input-sm';
      case 'lg':
        return 'input-lg';
      default:
        return '';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'bordered':
        return 'input-bordered';
      case 'ghost':
        return 'input-ghost';
      default:
        return '';
    }
  };

  const getInputClasses = () => {
    let classes = `input w-full ${getSizeClasses()} ${getVariantClasses()}`;
    
    if (error) {
      classes += ' input-error';
    } else if (success) {
      classes += ' input-success';
    }
    
    if (disabled) {
      classes += ' input-disabled';
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

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="form-control w-full">
      <label className={getLabelClasses()}>
        <span className="label-text font-medium">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </span>
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-base-content/50">
              {icon}
            </div>
          </div>
        )}
        
        <input
          type={inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          disabled={disabled}
          className={`${getInputClasses()} ${icon ? 'pl-10' : ''} ${type === 'password' ? 'pr-10' : ''}`}
        />
        
        {type === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-base-content/50" />
            ) : (
              <Eye className="h-4 w-4 text-base-content/50" />
            )}
          </button>
        )}
        
        {(error || success) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
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
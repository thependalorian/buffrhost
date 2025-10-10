'use client';

import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface FormTextareaProps {
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  success?: string;
  helperText?: string;
  rows?: number;
  maxLength?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'bordered' | 'ghost';
  className?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export default function FormTextarea({
  label,
  name,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  success,
  helperText,
  rows = 4,
  maxLength,
  size = 'md',
  variant = 'default',
  className = '',
  resize = 'vertical'
}: FormTextareaProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'textarea-sm';
      case 'lg':
        return 'textarea-lg';
      default:
        return '';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'bordered':
        return 'textarea-bordered';
      case 'ghost':
        return 'textarea-ghost';
      default:
        return '';
    }
  };

  const getResizeClasses = () => {
    switch (resize) {
      case 'none':
        return 'resize-none';
      case 'vertical':
        return 'resize-y';
      case 'horizontal':
        return 'resize-x';
      case 'both':
        return 'resize';
      default:
        return 'resize-y';
    }
  };

  const getTextareaClasses = () => {
    let classes = `textarea w-full ${getSizeClasses()} ${getVariantClasses()} ${getResizeClasses()}`;
    
    if (error) {
      classes += ' textarea-error';
    } else if (success) {
      classes += ' textarea-success';
    }
    
    if (disabled) {
      classes += ' textarea-disabled';
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

  const characterCount = value.length;
  const isOverLimit = maxLength && characterCount > maxLength;

  return (
    <div className="form-control w-full">
      <label className={getLabelClasses()}>
        <span className="label-text font-medium">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </span>
        {maxLength && (
          <span className={`label-text-alt ${
            isOverLimit ? 'text-error' : 'text-base-content/70'
          }`}>
            {characterCount}/{maxLength}
          </span>
        )}
      </label>
      
      <div className="relative">
        <textarea
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={getTextareaClasses()}
        />
        
        {(error || success) && (
          <div className="absolute top-3 right-3 flex items-center">
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
'use client';

import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Search, 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Building2, 
  CreditCard, 
  Star, 
  AlertCircle,
  CheckCircle,
  Upload,
  X,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Base Input Component
interface BaseInputProps {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function FormField({ label, error, required, className = '', children }: BaseInputProps) {
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
      {children}
      {error && (
        <label className="label">
          <span className="label-text-alt text-error flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </span>
        </label>
      )}
    </div>
  );
}

// Text Input Component
interface TextInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'text' | 'email' | 'tel' | 'url';
  icon?: React.ReactNode;
}

export function TextInput({
  label,
  placeholder,
  value,
  onChange,
  error,
  required,
  disabled,
  className = '',
  type = 'text',
  icon
}: TextInputProps) {
  return (
    <FormField label={label} error={error} required={required} className={className}>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={`input input-bordered w-full ${icon ? 'pl-10' : ''} ${error ? 'input-error' : ''} ${className}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    </FormField>
  );
}

// Password Input Component
interface PasswordInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function PasswordInput({
  label,
  placeholder,
  value,
  onChange,
  error,
  required,
  disabled,
  className = ''
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField label={label} error={error} required={required} className={className}>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          className={`input input-bordered w-full pr-10 ${error ? 'input-error' : ''} ${className}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4 text-base-content/50" />
          ) : (
            <Eye className="w-4 h-4 text-base-content/50" />
          )}
        </button>
      </div>
    </FormField>
  );
}

// Textarea Component
interface TextareaProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  rows?: number;
}

export function Textarea({
  label,
  placeholder,
  value,
  onChange,
  error,
  required,
  disabled,
  className = '',
  rows = 4
}: TextareaProps) {
  return (
    <FormField label={label} error={error} required={required} className={className}>
      <textarea
        placeholder={placeholder}
        className={`textarea textarea-bordered w-full ${error ? 'textarea-error' : ''} ${className}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={rows}
      />
    </FormField>
  );
}

// Select Component
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Select({
  label,
  placeholder,
  value,
  onChange,
  options,
  error,
  required,
  disabled,
  className = ''
}: SelectProps) {
  return (
    <FormField label={label} error={error} required={required} className={className}>
      <select
        className={`select select-bordered w-full ${error ? 'select-error' : ''} ${className}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}

// Multi-Select Component
interface MultiSelectProps {
  label?: string;
  placeholder?: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: SelectOption[];
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function MultiSelect({
  label,
  placeholder,
  value,
  onChange,
  options,
  error,
  required,
  disabled,
  className = ''
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <FormField label={label} error={error} required={required} className={className}>
      <div className="relative">
        <button
          type="button"
          className={`select select-bordered w-full ${error ? 'select-error' : ''} ${className}`}
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
        >
          {value.length === 0 ? placeholder : `${value.length} selected`}
        </button>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className={`p-3 cursor-pointer hover:bg-base-200 flex items-center justify-between ${
                  value.includes(option.value) ? 'bg-primary/10' : ''
                }`}
                onClick={() => toggleOption(option.value)}
              >
                <span>{option.label}</span>
                {value.includes(option.value) && (
                  <CheckCircle className="w-4 h-4 text-primary" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </FormField>
  );
}

// Checkbox Component
interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  label,
  checked,
  onChange,
  error,
  disabled,
  className = ''
}: CheckboxProps) {
  return (
    <FormField error={error} className={className}>
      <label className="label cursor-pointer">
        <input
          type="checkbox"
          className="checkbox checkbox-primary"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        {label && <span className="label-text ml-2">{label}</span>}
      </label>
    </FormField>
  );
}

// Radio Group Component
interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function RadioGroup({
  label,
  value,
  onChange,
  options,
  error,
  required,
  disabled,
  className = ''
}: RadioGroupProps) {
  return (
    <FormField label={label} error={error} required={required} className={className}>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="label cursor-pointer">
            <input
              type="radio"
              name={label}
              className="radio radio-primary"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled || option.disabled}
            />
            <span className="label-text ml-2">{option.label}</span>
          </label>
        ))}
      </div>
    </FormField>
  );
}

// Date Input Component
interface DateInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  min?: string;
  max?: string;
}

export function DateInput({
  label,
  value,
  onChange,
  error,
  required,
  disabled,
  className = '',
  min,
  max
}: DateInputProps) {
  return (
    <FormField label={label} error={error} required={required} className={className}>
      <div className="relative">
        <input
          type="date"
          className={`input input-bordered w-full ${error ? 'input-error' : ''} ${className}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          min={min}
          max={max}
        />
        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
      </div>
    </FormField>
  );
}

// Time Input Component
interface TimeInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function TimeInput({
  label,
  value,
  onChange,
  error,
  required,
  disabled,
  className = ''
}: TimeInputProps) {
  return (
    <FormField label={label} error={error} required={required} className={className}>
      <div className="relative">
        <input
          type="time"
          className={`input input-bordered w-full ${error ? 'input-error' : ''} ${className}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
        <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
      </div>
    </FormField>
  );
}

// Number Input Component
interface NumberInputProps {
  label?: string;
  placeholder?: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  icon?: React.ReactNode;
}

export function NumberInput({
  label,
  placeholder,
  value,
  onChange,
  error,
  required,
  disabled,
  className = '',
  min,
  max,
  step = 1,
  icon
}: NumberInputProps) {
  return (
    <FormField label={label} error={error} required={required} className={className}>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type="number"
          placeholder={placeholder}
          className={`input input-bordered w-full ${icon ? 'pl-10' : ''} ${error ? 'input-error' : ''} ${className}`}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
        />
      </div>
    </FormField>
  );
}

// Currency Input Component
interface CurrencyInputProps {
  label?: string;
  placeholder?: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  currency?: string;
  min?: number;
  max?: number;
}

export function CurrencyInput({
  label,
  placeholder,
  value,
  onChange,
  error,
  required,
  disabled,
  className = '',
  currency = 'NAD',
  min,
  max
}: CurrencyInputProps) {
  return (
    <FormField label={label} error={error} required={required} className={className}>
      <div className="relative">
        <input
          type="number"
          placeholder={placeholder}
          className={`input input-bordered w-full pl-8 ${error ? 'input-error' : ''} ${className}`}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          min={min}
          max={max}
          step="0.01"
        />
        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-base-content/70">
          {currency}
        </span>
      </div>
    </FormField>
  );
}

// File Upload Component
interface FileUploadProps {
  label?: string;
  value: File[];
  onChange: (files: File[]) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
}

export function FileUpload({
  label,
  value,
  onChange,
  error,
  required,
  disabled,
  className = '',
  accept,
  multiple = false,
  maxSize = 10
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => file.size <= maxSize * 1024 * 1024);
    
    if (multiple) {
      onChange([...value, ...validFiles]);
    } else {
      onChange(validFiles.slice(0, 1));
    }
  };

  const removeFile = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <FormField label={label} error={error} required={required} className={className}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragOver ? 'border-primary bg-primary/10' : 'border-base-300'
        } ${error ? 'border-error' : ''} ${className}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFileSelect(e.dataTransfer.files);
        }}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-base-content/50" />
        <p className="text-sm text-base-content/70 mb-2">
          Drag and drop files here, or click to select
        </p>
        <input
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={disabled}
        />
        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={() => document.querySelector('input[type="file"]')?.click()}
          disabled={disabled}
        >
          Choose Files
        </button>
        <p className="text-xs text-base-content/50 mt-2">
          Max size: {maxSize}MB
        </p>
      </div>
      
      {value.length > 0 && (
        <div className="mt-4 space-y-2">
          {value.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-base-200 rounded">
              <span className="text-sm">{file.name}</span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => removeFile(index)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </FormField>
  );
}

// Rating Component
interface RatingProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  max?: number;
}

export function Rating({
  label,
  value,
  onChange,
  error,
  required,
  disabled,
  className = '',
  max = 5
}: RatingProps) {
  return (
    <FormField label={label} error={error} required={required} className={className}>
      <div className="flex items-center space-x-1">
        {Array.from({ length: max }, (_, i) => (
          <button
            key={i}
            type="button"
            className={`btn btn-ghost btn-sm p-1 ${
              i < value ? 'text-warning' : 'text-base-content/30'
            }`}
            onClick={() => !disabled && onChange(i + 1)}
            disabled={disabled}
          >
            <Star className="w-5 h-5" />
          </button>
        ))}
        <span className="text-sm text-base-content/70 ml-2">
          {value} / {max}
        </span>
      </div>
    </FormField>
  );
}

// Form Button Component
interface FormButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function FormButton({
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  children,
  onClick
}: FormButtonProps) {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary';
      case 'secondary':
        return 'btn-secondary';
      case 'accent':
        return 'btn-accent';
      case 'ghost':
        return 'btn-ghost';
      case 'outline':
        return 'btn-outline';
      default:
        return 'btn-primary';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'xs':
        return 'btn-xs';
      case 'sm':
        return 'btn-sm';
      case 'md':
        return 'btn-md';
      case 'lg':
        return 'btn-lg';
      default:
        return 'btn-md';
    }
  };

  return (
    <button
      type={type}
      className={`btn ${getVariantClass()} ${getSizeClass()} ${loading ? 'loading' : ''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Form Section Component
interface FormSectionProps {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormSection({
  title,
  description,
  className = '',
  children
}: FormSectionProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {(title || description) && (
        <div className="mb-6">
          {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
          {description && <p className="text-sm text-base-content/70">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

// Form Grid Component
interface FormGridProps {
  columns?: 1 | 2 | 3 | 4;
  className?: string;
  children: React.ReactNode;
}

export function FormGrid({
  columns = 2,
  className = '',
  children
}: FormGridProps) {
  const getGridClass = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1 md:grid-cols-2';
    }
  };

  return (
    <div className={`grid ${getGridClass()} gap-4 ${className}`}>
      {children}
    </div>
  );
}

// Form Actions Component
interface FormActionsProps {
  className?: string;
  children: React.ReactNode;
}

export function FormActions({ className = '', children }: FormActionsProps) {
  return (
    <div className={`flex items-center justify-end space-x-2 pt-6 border-t border-base-300 ${className}`}>
      {children}
    </div>
  );
}
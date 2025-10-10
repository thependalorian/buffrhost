'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormMultiSelectProps {
  label?: string;
  name: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  success?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  searchable?: boolean;
  maxSelections?: number;
}

export default function FormMultiSelect({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = 'Select options',
  required = false,
  disabled = false,
  error,
  success,
  helperText,
  size = 'md',
  className = '',
  searchable = true,
  maxSelections
}: FormMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: 'select-sm',
    md: 'select-md',
    lg: 'select-lg'
  };

  const getInputClasses = () => {
    let classes = `select select-bordered w-full ${sizeClasses[size]}`;
    
    if (error) {
      classes += ' select-error';
    } else if (success) {
      classes += ' select-success';
    }
    
    if (disabled) {
      classes += ' select-disabled';
    }
    
    return classes;
  };

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOptions = options.filter(option => value.includes(option.value));

  const toggleOption = (optionValue: string) => {
    if (disabled) return;
    
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    
    if (maxSelections && newValue.length > maxSelections) {
      return; // Don't add if max selections reached
    }
    
    onChange(newValue);
  };

  const removeOption = (optionValue: string) => {
    if (disabled) return;
    onChange(value.filter(v => v !== optionValue));
  };

  const clearAll = () => {
    if (disabled) return;
    onChange([]);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      
      <div className="relative" ref={dropdownRef}>
        {/* Selected Options Display */}
        <div
          className={`
            min-h-[2.5rem] px-3 py-2 border rounded-lg cursor-pointer
            ${error ? 'border-error' : success ? 'border-success' : 'border-base-300'}
            ${disabled ? 'bg-base-200 cursor-not-allowed' : 'bg-base-100 hover:border-primary'}
            ${sizeClasses[size]}
          `}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          {selectedOptions.length === 0 ? (
            <span className="text-base-content/50">{placeholder}</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {selectedOptions.map(option => (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-content rounded text-sm"
                >
                  {option.label}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeOption(option.value);
                      }}
                      className="hover:text-error"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
              {selectedOptions.length > 0 && !disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAll();
                  }}
                  className="text-base-content/50 hover:text-error"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
          
          <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
        
        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
            {/* Search */}
            {searchable && (
              <div className="p-2 border-b border-base-300">
                <input
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input input-sm input-bordered w-full"
                />
              </div>
            )}
            
            {/* Options */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="p-3 text-center text-base-content/50">
                  No options found
                </div>
              ) : (
                filteredOptions.map(option => {
                  const isSelected = value.includes(option.value);
                  const isDisabled = option.disabled || (maxSelections && !isSelected && value.length >= maxSelections);
                  
                  return (
                    <div
                      key={option.value}
                      className={`
                        flex items-center justify-between px-3 py-2 cursor-pointer
                        ${isSelected ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}
                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                      onClick={() => !isDisabled && toggleOption(option.value)}
                    >
                      <span className="text-sm">{option.label}</span>
                      {isSelected && <Check className="w-4 h-4" />}
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Max Selections Warning */}
            {maxSelections && value.length >= maxSelections && (
              <div className="p-2 text-xs text-warning bg-warning/10 border-t border-base-300">
                Maximum {maxSelections} selections allowed
              </div>
            )}
          </div>
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
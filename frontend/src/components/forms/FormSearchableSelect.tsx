'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check, Search } from 'lucide-react';

export interface SearchableSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface FormSearchableSelectProps {
  label?: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  success?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  clearable?: boolean;
  noOptionsText?: string;
  loading?: boolean;
}

export default function FormSearchableSelect({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = 'Search and select...',
  required = false,
  disabled = false,
  error,
  success,
  helperText,
  size = 'md',
  className = '',
  clearable = true,
  noOptionsText = 'No options found',
  loading = false
}: FormSearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !option.disabled
  );

  const selectedOption = options.find(option => option.value === value);

  const groupedOptions = filteredOptions.reduce((groups, option) => {
    const group = option.group || 'Other';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(option);
    return groups;
  }, {} as Record<string, SearchableSelectOption[]>);

  const selectOption = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
    setFocusedIndex(-1);
  };

  const clearSelection = () => {
    onChange('');
    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        setIsOpen(true);
        return;
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => 
        prev < filteredOptions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
        selectOption(filteredOptions[focusedIndex].value);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            name={name}
            value={isOpen ? searchTerm : (selectedOption?.label || '')}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!isOpen) {
                setIsOpen(true);
              }
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={getInputClasses()}
          />
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {value && clearable && !disabled ? (
              <button
                type="button"
                onClick={clearSelection}
                className="hover:text-error mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <Search className="w-4 h-4 text-base-content/50 mr-1" />
            )}
            <ChevronDown className={`w-4 h-4 text-base-content/50 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
        
        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
            {/* Options */}
            <div className="max-h-60 overflow-y-auto">
              {loading ? (
                <div className="p-3 text-center text-base-content/50">
                  <div className="loading loading-spinner loading-sm"></div>
                  <span className="ml-2">Loading...</span>
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="p-3 text-center text-base-content/50">
                  {noOptionsText}
                </div>
              ) : (
                Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
                  <div key={groupName}>
                    {groupName !== 'Other' && (
                      <div className="px-3 py-2 text-xs font-semibold text-base-content/70 bg-base-200 border-b border-base-300">
                        {groupName}
                      </div>
                    )}
                    {groupOptions.map((option, index) => {
                      const globalIndex = filteredOptions.findIndex(opt => opt.value === option.value);
                      const isFocused = focusedIndex === globalIndex;
                      const isSelected = value === option.value;
                      
                      return (
                        <div
                          key={option.value}
                          className={`
                            flex items-center justify-between px-3 py-2 cursor-pointer
                            ${isSelected ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}
                            ${isFocused ? 'bg-base-200' : ''}
                          `}
                          onClick={() => selectOption(option.value)}
                          onMouseEnter={() => setFocusedIndex(globalIndex)}
                        >
                          <span className="text-sm">{option.label}</span>
                          {isSelected && <Check className="w-4 h-4" />}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
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
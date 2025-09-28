/**
 * Reusable Form Components for The Shandi Frontend
 *
 * Comprehensive form components with consistent styling, validation, and accessibility.
 * Includes FormField, FormSelect, FormTextarea, and FormCheckbox components.
 */

import React from "react";
import { Input } from "./input";
import { Label } from "./label";
import { cn } from "../../lib/utils";

export interface FormFieldProps {
  label: string;
  name: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "date"
    | "file";
  placeholder?: string;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  error?: string;
  helpText?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  accept?: string;
}

export interface FormSelectProps {
  label: string;
  name: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  error?: string;
  helpText?: string;
  className?: string;
  selectClassName?: string;
  disabled?: boolean;
}

export interface FormTextareaProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  error?: string;
  helpText?: string;
  className?: string;
  textareaClassName?: string;
  disabled?: boolean;
  rows?: number;
}

export interface FormCheckboxProps {
  label: string;
  name: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  error?: string;
  helpText?: string;
  className?: string;
  disabled?: boolean;
}

export interface FormCheckboxGroupProps {
  label: string;
  name: string;
  options: Array<{ value: string; label: string; checked?: boolean }>;
  onChange?: (values: string[]) => void;
  error?: string;
  helpText?: string;
  className?: string;
  disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  value,
  defaultValue,
  onChange,
  error,
  helpText,
  className,
  inputClassName,
  disabled = false,
  min,
  max,
  step,
  accept,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        accept={accept}
        className={cn(
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          inputClassName,
        )}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {helpText && !error && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
};

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  options,
  placeholder,
  required = false,
  value,
  defaultValue,
  onChange,
  error,
  helpText,
  className,
  selectClassName,
  disabled = false,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <select
        id={name}
        name={name}
        required={required}
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          selectClassName,
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
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
      {error && <p className="text-sm text-red-500">{error}</p>}
      {helpText && !error && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
};

const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  name,
  placeholder,
  required = false,
  value,
  defaultValue,
  onChange,
  error,
  helpText,
  className,
  textareaClassName,
  disabled = false,
  rows = 3,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        required={required}
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        rows={rows}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          textareaClassName,
        )}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {helpText && !error && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
};

const FormCheckbox: React.FC<FormCheckboxProps> = ({
  label,
  name,
  checked,
  defaultChecked,
  onChange,
  error,
  helpText,
  className,
  disabled = false,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center space-x-2">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
        </Label>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {helpText && !error && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
};

const FormCheckboxGroup: React.FC<FormCheckboxGroupProps> = ({
  label,
  name,
  options,
  onChange,
  error,
  helpText,
  className,
  disabled = false,
}) => {
  const handleChange = (value: string, checked: boolean) => {
    const currentValues = options
      .filter((opt) => opt.checked)
      .map((opt) => opt.value);

    if (checked) {
      onChange?.([...currentValues, value]);
    } else {
      onChange?.(currentValues.filter((v) => v !== value));
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium">{label}</Label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <input
              id={`${name}-${option.value}`}
              name={name}
              type="checkbox"
              value={option.value}
              checked={option.checked}
              onChange={(e) => handleChange(option.value, e.target.checked)}
              disabled={disabled}
              className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Label htmlFor={`${name}-${option.value}`} className="text-sm">
              {option.label}
            </Label>
          </div>
        ))}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {helpText && !error && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
};

export { FormField, FormSelect, FormTextarea, FormCheckbox, FormCheckboxGroup };

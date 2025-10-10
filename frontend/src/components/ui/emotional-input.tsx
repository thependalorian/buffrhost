'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface EmotionalInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  emotional?: boolean
  variant?: 'default' | 'luxury' | 'spa' | 'hospitality'
  size?: 'sm' | 'md' | 'lg'
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
}

const EmotionalInput = forwardRef<HTMLInputElement, EmotionalInputProps>(
  ({ className, emotional = true, variant = 'default', size = 'md', label, error, helperText, icon, ...props }, ref) => {
    const baseClasses = "flex w-full rounded-lg border border-nude-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-nude-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nude-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
    
    const emotionalClasses = emotional ? "hover:border-nude-300 focus:border-nude-600 focus:shadow-nude-soft" : ""
    
    const variantClasses = {
      default: "border-nude-200 focus:ring-nude-600",
      luxury: "border-luxury-charlotte focus:ring-luxury-charlotte focus:shadow-luxury-soft",
      spa: "border-spa-silver focus:ring-spa-copper focus:shadow-spa-glow",
      hospitality: "border-hospitality-terracotta focus:ring-hospitality-terracotta focus:shadow-hospitality-warm"
    }
    
    const sizeClasses = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-2 text-sm",
      lg: "px-4 py-3 text-base"
    }

    const inputElement = (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-nude-400">
            {icon}
          </div>
        )}
        <input
          className={cn(
            baseClasses,
            emotionalClasses,
            variantClasses[variant],
            sizeClasses[size],
            icon && "pl-10",
            error && "border-semantic-error focus:ring-semantic-error",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )

    if (label || error || helperText) {
      return (
        <div className="space-y-2">
          {label && (
            <label className="text-sm font-medium text-nude-700">
              {label}
            </label>
          )}
          {inputElement}
          {error && (
            <p className="text-sm text-semantic-error">{error}</p>
          )}
          {helperText && !error && (
            <p className="text-sm text-nude-500">{helperText}</p>
          )}
        </div>
      )
    }

    return inputElement
  }
)

EmotionalInput.displayName = "EmotionalInput"

export { EmotionalInput }
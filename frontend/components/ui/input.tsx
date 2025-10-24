/**
 * Complete BuffrInput Component
 * 
 * Purpose: Provides consistent input styling with emotional intelligence
 * Location: /components/ui/input.tsx
 * Usage: All form inputs across CMS and CRM
 * 
 * Features:
 * - Josh Yolk emotional validation feedback
 * - DaisyUI integration for consistency
 * - 23 Rules compliance (modular, documented, TypeScript)
 * - Accessibility support
 * - Real-time validation with caring messages
 * - Loading states and error handling
 * - Emotional impact tracking
 */

"use client";

import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { completeBrandTokens, getEmotionalClasses } from "@/lib/design-tokens"

interface BuffrInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: string
  helperText?: string
  emotionalImpact?: 'confident' | 'supportive' | 'gentle' | 'premium'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  variant?: 'default' | 'luxury' | 'minimal'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const BuffrInput = React.forwardRef<HTMLInputElement, BuffrInputProps>(
  ({
    label,
    error,
    success,
    helperText,
    emotionalImpact,
    loading = false,
    icon,
    iconPosition = 'left',
    variant = 'default',
    size = 'md',
    className = '',
    disabled,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)

    // Josh Yolk's Input Variants
    const variantClasses = {
      default: 'bg-nude-50 border-nude-200 focus:border-nude-600 focus:ring-nude-600',
      luxury: 'bg-luxury-champagne border-luxury-charlotte focus:border-luxury-bronze focus:ring-luxury-bronze',
      minimal: 'bg-transparent border-nude-300 focus:border-nude-600 focus:ring-nude-600'
    }

    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-3 text-lg'
    }

    // Emotional impact classes
    const emotionalStyles = emotionalImpact ? getEmotionalClasses(emotionalImpact) : null

    // State classes
    const stateClasses = {
      error: 'border-semantic-error focus:ring-semantic-error bg-red-50',
      success: 'border-semantic-success focus:ring-semantic-success bg-green-50',
      loading: 'opacity-75 cursor-wait',
      disabled: 'bg-nude-100 text-nude-400 cursor-not-allowed'
    }

    // Determine current state
    const currentState = error ? 'error' : success ? 'success' : loading ? 'loading' : disabled ? 'disabled' : 'default'

    useEffect(() => {
      if (props.value !== undefined) {
        setHasValue(String(props.value).length > 0)
      }
    }, [props.value])

    return (
      <div className="w-full">
        {label && (
          <label 
            className={cn(
              'block text-sm font-medium text-nude-700 mb-2',
              emotionalStyles?.animations?.map(anim => `animate-${anim}`).join(' '),
              error && 'text-semantic-error',
              success && 'text-semantic-success'
            )}
            data-emotional-impact={emotionalImpact}
          >
            {label}
            {props.required && <span className="text-semantic-error ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-nude-400">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            className={cn(
              'w-full border rounded-lg transition-all duration-300',
              'focus:outline-none focus:ring-2 focus:ring-offset-1',
              'placeholder:text-nude-400',
              sizeClasses[size],
              variantClasses[variant],
              stateClasses[currentState],
              icon && iconPosition === 'left' && 'pl-10',
              icon && iconPosition === 'right' && 'pr-10',
              emotionalStyles?.animations?.map(anim => `animate-${anim}`).join(' '),
              className
            )}
            disabled={disabled || loading}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => {
              setHasValue(e.target.value.length > 0)
              props.onChange?.(e)
            }}
            data-emotional-impact={emotionalImpact}
            data-josh-yolk-variant={variant}
            data-focused={isFocused}
            data-has-value={hasValue}
            data-loading={loading}
            {...props}
          />
          
          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-nude-400">
              {icon}
            </div>
          )}
          
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="loading loading-spinner loading-sm"></span>
            </div>
          )}
        </div>

        {/* Helper Text */}
        {(helperText || error || success) && (
          <div className="mt-2">
            {error && (
              <p className="text-sm text-semantic-error flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}
            {success && !error && (
              <p className="text-sm text-semantic-success flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </p>
            )}
            {helperText && !error && !success && (
              <p className="text-sm text-nude-600">{helperText}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)

BuffrInput.displayName = "BuffrInput"

// Export for backward compatibility
export default BuffrInput

/**
 * Complete BuffrButton Component
 * 
 * Purpose: Provides consistent button styling with emotional intelligence
 * Location: /components/ui/button.tsx
 * Usage: All button interactions across CMS and CRM
 * 
 * Features:
 * - Josh Yolk emotional hierarchy (confident, supportive, gentle, premium)
 * - DaisyUI integration for consistency
 * - 23 Rules compliance (modular, documented, TypeScript)
 * - Accessibility support
 * - Performance optimized
 * - Loading states with caring messages
 * - Emotional impact tracking
 */

import React from "react"
import { cn } from "@/lib/utils"
import { completeBrandTokens, getEmotionalClasses } from "@/lib/design-tokens"

interface BuffrButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'luxury'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  emotionalImpact?: 'confident' | 'supportive' | 'gentle' | 'premium'
  loadingText?: string
  className?: string
}

export const BuffrButton = React.forwardRef<HTMLButtonElement, BuffrButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    emotionalImpact,
    loadingText = "Please wait...",
    className = '',
    disabled,
    ...props 
  }, ref) => {
    // Josh Yolk's Emotional Hierarchy
    const emotionalClasses = {
      primary: 'bg-gradient-to-r from-nude-600 to-nude-700 text-white hover:from-nude-700 hover:to-nude-800 shadow-nude-soft hover:shadow-nude-medium transition-all duration-300 hover:-translate-y-1',
      secondary: 'bg-nude-500 text-white hover:bg-nude-600 shadow-nude-soft hover:shadow-nude-medium transition-all duration-300 hover:-translate-y-1',
      ghost: 'bg-transparent text-nude-600 hover:bg-nude-50 border border-nude-200 hover:border-nude-300 transition-all duration-300 hover:-translate-y-1',
      luxury: 'bg-gradient-to-r from-luxury-charlotte to-luxury-bronze text-white hover:from-luxury-bronze hover:to-luxury-charlotte shadow-luxury-soft hover:shadow-luxury-medium transition-all duration-300 hover:-translate-y-1'
    }

    // DaisyUI Base Classes
    const baseClasses = 'btn'
    const sizeClasses = {
      sm: 'btn-sm',
      md: 'btn-md', 
      lg: 'btn-lg'
    }

    // Emotional impact classes
    const emotionalStyles = emotionalImpact ? getEmotionalClasses(emotionalImpact) : null
    
    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          emotionalClasses[variant],
          sizeClasses[size],
          'focus:outline-none focus:ring-2 focus:ring-nude-600 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
          emotionalStyles?.animations?.map(anim => `animate-${anim}`).join(' '),
          className
        )}
        disabled={disabled || loading}
        data-emotional-impact={emotionalImpact}
        data-josh-yolk-variant={variant}
        data-loading={loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <span className="loading loading-spinner loading-sm"></span>
            <span className="text-sm">{loadingText}</span>
          </div>
        ) : (
          children
        )}
      </button>
    )
  }
)

BuffrButton.displayName = "BuffrButton"

// Export both for backward compatibility
export const Button = BuffrButton

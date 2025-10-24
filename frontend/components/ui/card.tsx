/**
 * Complete BuffrCard Component System
 * 
 * Purpose: Provides consistent card styling with layered warmth
 * Location: /components/ui/card.tsx
 * Usage: All card displays across CMS and CRM
 * 
 * Features:
 * - Josh Yolk layered warmth system
 * - DaisyUI card integration
 * - 23 Rules compliance (modular, documented, TypeScript)
 * - Responsive design
 * - Accessibility support
 * - Emotional impact tracking
 * - Interactive states with caring feedback
 */

"use client";

import React from "react"
import { cn } from "@/lib/utils"
import { completeBrandTokens, getEmotionalClasses } from "@/lib/design-tokens"

interface BuffrCardProps {
  children: React.ReactNode
  variant?: 'default' | 'luxury' | 'interactive' | 'spa'
  className?: string
  hover?: boolean
  emotionalImpact?: 'trustworthy' | 'premium' | 'engaging' | 'serene'
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
}

export const BuffrCard = ({ 
  children, 
  variant = 'default', 
  className = '',
  hover = true,
  emotionalImpact,
  onClick,
  disabled = false,
  loading = false,
  ...props 
}: BuffrCardProps) => {
  // Josh Yolk's Layered Warmth System
  const emotionalClasses = {
    default: 'bg-nude-50 border border-nude-200 shadow-nude-soft',
    luxury: 'bg-luxury-champagne border border-luxury-charlotte shadow-luxury-soft',
    interactive: 'bg-nude-50 border border-nude-200 shadow-nude-soft hover:-translate-y-1 hover:shadow-luxury-medium cursor-pointer',
    spa: 'bg-gradient-to-br from-nude-50 to-luxury-champagne border border-luxury-rose shadow-luxury-soft hover:shadow-luxury-medium'
  }

  // DaisyUI Base Classes
  const baseClasses = 'card bg-base-100 shadow-sm rounded-lg p-6 transition-all duration-300'
  
  // Emotional impact classes
  const emotionalStyles = emotionalImpact ? getEmotionalClasses(emotionalImpact as any) : null

  return (
    <div 
      className={cn(
        baseClasses,
        emotionalClasses[variant],
        hover && !disabled && 'hover:shadow-nude-soft hover:-translate-y-1 transition-all duration-300',
        disabled && 'opacity-50 cursor-not-allowed',
        loading && 'animate-pulse',
        emotionalStyles?.animations?.map(anim => `animate-${anim}`).join(' '),
        className
      )}
      onClick={disabled || loading ? undefined : onClick}
      data-emotional-impact={emotionalImpact}
      data-josh-yolk-variant={variant}
      data-disabled={disabled}
      data-loading={loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="loading loading-spinner loading-sm"></span>
            <span className="text-sm text-nude-600">Loading...</span>
          </div>
        </div>
      )}
      {children}
    </div>
  )
}

interface BuffrCardHeaderProps {
  children: React.ReactNode
  className?: string
  emotionalImpact?: 'confident' | 'supportive' | 'gentle' | 'premium'
}

export const BuffrCardHeader = ({ 
  children, 
  className = "", 
  emotionalImpact,
  ...props 
}: BuffrCardHeaderProps) => {
  const emotionalStyles = emotionalImpact ? getEmotionalClasses(emotionalImpact) : null
  
  return (
    <div 
      className={cn(
        'p-6 pb-4',
        emotionalStyles?.animations?.map(anim => `animate-${anim}`).join(' '),
        className
      )} 
      data-emotional-impact={emotionalImpact}
      {...props}
    >
      {children}
    </div>
  )
}

interface BuffrCardTitleProps {
  children: React.ReactNode
  className?: string
  level?: 1 | 2 | 3 | 4 | 5 | 6
  emotionalImpact?: 'confident' | 'supportive' | 'gentle' | 'premium'
}

export const BuffrCardTitle = ({ 
  children, 
  className = "", 
  level = 3,
  emotionalImpact,
  ...props 
}: BuffrCardTitleProps) => {
  const emotionalStyles = emotionalImpact ? getEmotionalClasses(emotionalImpact) : null
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements
  
  const sizeClasses = {
    1: 'text-2xl md:text-3xl font-display font-bold text-nude-900',
    2: 'text-xl md:text-2xl font-display font-semibold text-nude-800',
    3: 'text-lg md:text-xl font-display font-medium text-nude-800',
    4: 'text-base md:text-lg font-display font-medium text-nude-700',
    5: 'text-sm md:text-base font-display font-medium text-nude-700',
    6: 'text-xs md:text-sm font-display font-medium text-nude-600'
  }
  
  return (
    <HeadingTag 
      className={cn(
        sizeClasses[level],
        'leading-tight tracking-tight',
        emotionalStyles?.animations?.map(anim => `animate-${anim}`).join(' '),
        className
      )}
      data-emotional-impact={emotionalImpact}
      {...props}
    >
      {children}
    </HeadingTag>
  )
}

interface BuffrCardContentProps {
  children: React.ReactNode
  className?: string
  emotionalImpact?: 'confident' | 'supportive' | 'gentle' | 'premium'
}

export const BuffrCardContent = ({ 
  children, 
  className = "", 
  emotionalImpact,
  ...props 
}: BuffrCardContentProps) => {
  const emotionalStyles = emotionalImpact ? getEmotionalClasses(emotionalImpact) : null
  
  return (
    <div 
      className={cn(
        'p-6 pt-0',
        emotionalStyles?.animations?.map(anim => `animate-${anim}`).join(' '),
        className
      )}
      data-emotional-impact={emotionalImpact}
      {...props}
    >
      {children}
    </div>
  )
}

// Export both for backward compatibility
export const Card = BuffrCard
export const CardHeader = BuffrCardHeader
export const CardTitle = BuffrCardTitle
export const CardContent = BuffrCardContent

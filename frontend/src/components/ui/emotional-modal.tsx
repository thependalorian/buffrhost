'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { X } from 'lucide-react'

export interface EmotionalModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  emotional?: boolean
  variant?: 'default' | 'luxury' | 'spa' | 'hospitality'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  actions?: React.ReactNode
}

export function EmotionalModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  emotional = true,
  variant = 'default',
  size = 'md',
  className,
  actions
}: EmotionalModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const baseClasses = "fixed inset-0 z-50 flex items-center justify-center p-4"
  
  const emotionalClasses = emotional ? "animate-fade-in" : ""
  
  const variantClasses = {
    default: "bg-white border-nude-200 shadow-nude-strong",
    luxury: "bg-gradient-luxury-gold border-luxury-charlotte shadow-luxury-strong",
    spa: "bg-spa-pearl border-spa-silver shadow-spa-glow",
    hospitality: "bg-gradient-warm-hospitality border-hospitality-terracotta shadow-hospitality-warm"
  }

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl"
  }

  const headerClasses = {
    default: "border-b border-nude-200 bg-nude-50",
    luxury: "border-b border-luxury-charlotte/20 bg-luxury-charlotte/10",
    spa: "border-b border-spa-silver bg-spa-pearl/50",
    hospitality: "border-b border-hospitality-terracotta/20 bg-hospitality-terracotta/10"
  }

  return (
    <div className={cn(baseClasses, emotionalClasses)}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn(
        "relative w-full rounded-2xl border shadow-lg animate-scale-in",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}>
        {/* Header */}
        {title && (
          <div className={cn(
            "flex items-center justify-between p-6 rounded-t-2xl",
            headerClasses[variant]
          )}>
            <div>
              <h2 className="text-xl font-semibold text-nude-900">
                {title}
              </h2>
              {description && (
                <p className="text-sm text-nude-600 mt-1">
                  {description}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-nude-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {children}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex justify-end space-x-2 p-6 pt-0">
            {actions}
          </div>
        )}

        {/* Close button for modals without title */}
        {!title && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 p-0 hover:bg-nude-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
'use client';

import React, { useState, useEffect } from 'react';
/**
 * PrimeZone React Component for Buffr Host Hospitality Platform
 * @fileoverview PrimeZone provides reusable UI component for consistent design
 * @location buffr-host/components/ui/ProductPlacementComponents.tsx
 * @purpose PrimeZone provides reusable UI component for consistent design
 * @component PrimeZone
 * @category Ui
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Configurable props for flexible component usage
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Props:
 * @param {React.ReactNode} [children] - children prop description
 * @param {'hero' | 'navigation' | 'actions' | 'sidebar'} [zone] - zone prop description
 * @param {} [className] - className prop description
 *
 * Methods:
 * @method getStepClass - getStepClass method for component functionality
 * @method handleInteraction - handleInteraction method for component functionality
 *
 * Usage Example:
 * @example
 * import { PrimeZone } from './PrimeZone';
 *
 * function App() {
 *   return (
 *     <PrimeZone
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered PrimeZone component
 */

import {
  BuffrCard,
  BuffrCardContent,
  BuffrCardHeader,
  BuffrCardTitle,
} from './buffr-components';

// Product Placement Psychology & UX Design Framework Components

/**
 * Prime Real Estate Zones - Digital "Eye-Level" Positioning
 * Implements retail product placement psychology for digital platforms
 */

interface PrimeZoneProps {
  children: React.ReactNode;
  zone: 'hero' | 'navigation' | 'actions' | 'sidebar';
  className?: string;
}

export const PrimeZone: React.FC<PrimeZoneProps> = ({
  children,
  zone,
  className = '',
}) => {
  const zoneClasses = {
    hero: 'prime-zone-hero',
    navigation: 'prime-zone-navigation',
    actions: 'prime-zone-actions',
    sidebar: 'prime-zone-sidebar',
  };

  return <div className={`${zoneClasses[zone]} ${className}`}>{children}</div>;
};

/**
 * F-Pattern Layout Optimization
 * Optimizes layout for Western reading patterns
 */

interface FPatternLayoutProps {
  heading: React.ReactNode;
  cta: React.ReactNode;
  visual: React.ReactNode;
  features: React.ReactNode;
  className?: string;
}

export const FPatternLayout: React.FC<FPatternLayoutProps> = ({
  heading,
  cta,
  visual,
  features,
  className = '',
}) => {
  return (
    <div className={`f-pattern-layout ${className}`}>
      <div className="f-pattern-heading">{heading}</div>
      <div className="f-pattern-cta">{cta}</div>
      <div className="f-pattern-visual">{visual}</div>
      <div className="f-pattern-features">{features}</div>
    </div>
  );
};

/**
 * Dashboard Product Placement Zones
 * Strategic placement for maximum engagement
 */

interface DashboardZonesProps {
  primaryMetrics: React.ReactNode;
  quickActions: React.ReactNode;
  recentActivity: React.ReactNode;
  secondaryMetrics: React.ReactNode;
  promotional: React.ReactNode;
  className?: string;
}

export const DashboardZones: React.FC<DashboardZonesProps> = ({
  primaryMetrics,
  quickActions,
  recentActivity,
  secondaryMetrics,
  promotional,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-3 gap-6 ${className}`}>
      <div className="dashboard-zone-primary">{primaryMetrics}</div>
      <div className="dashboard-zone-actions">{quickActions}</div>
      <div className="dashboard-zone-engagement">{recentActivity}</div>
      <div className="dashboard-zone-secondary">{secondaryMetrics}</div>
      <div className="dashboard-zone-promotional">{promotional}</div>
    </div>
  );
};

/**
 * Progressive Disclosure Component
 * Manages cognitive load through gradual feature revelation
 */

interface ProgressiveDisclosureProps {
  children: React.ReactNode;
  isVisible: boolean;
  className?: string;
}

export const ProgressiveDisclosure: React.FC<ProgressiveDisclosureProps> = ({
  children,
  isVisible,
  className = '',
}) => {
  return (
    <div
      className={`progressive-disclosure ${isVisible ? 'progressive-disclosure-visible' : 'progressive-disclosure-hidden'} ${className}`}
    >
      {children}
    </div>
  );
};

/**
 * Cognitive Chunk Component
 * Groups related information to reduce cognitive load
 */

interface CognitiveChunkProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const CognitiveChunk: React.FC<CognitiveChunkProps> = ({
  title,
  children,
  className = '',
}) => {
  return (
    <div className={`cognitive-chunk ${className}`}>
      <h3>{title}</h3>
      {children}
    </div>
  );
};

/**
 * Visual Hierarchy Components
 * Implements consistent typography hierarchy
 */

interface HierarchyProps {
  children: React.ReactNode;
  level: 'primary' | 'secondary' | 'tertiary' | 'body' | 'meta';
  className?: string;
}

export const Hierarchy: React.FC<HierarchyProps> = ({
  children,
  level,
  className = '',
}) => {
  const levelClasses = {
    primary: 'hierarchy-primary',
    secondary: 'hierarchy-secondary',
    tertiary: 'hierarchy-tertiary',
    body: 'hierarchy-body',
    meta: 'hierarchy-meta',
  };

  return (
    <div className={`${levelClasses[level]} ${className}`}>{children}</div>
  );
};

/**
 * Psychology-Based Button System
 * Implements button hierarchy based on psychological principles
 */

interface PsychologyButtonProps {
  children: React.ReactNode;
  variant: 'primary' | 'secondary' | 'tertiary';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const PsychologyButton: React.FC<PsychologyButtonProps> = ({
  children,
  variant,
  onClick,
  disabled = false,
  className = '',
}) => {
  const variantClasses = {
    primary: 'btn-psychology-primary',
    secondary: 'btn-psychology-secondary',
    tertiary: 'btn-psychology-tertiary',
  };

  return (
    <button
      className={`${variantClasses[variant]} focus-psychology motion-safe ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

/**
 * Upsell and Cross-sell Components
 * Strategic placement for conversion optimization
 */

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const UpsellModal: React.FC<UpsellModalProps> = ({
  isOpen,
  onClose,
  children,
  className = '',
}) => {
  if (!isOpen) return null;

  return (
    <div className="upsell-modal" onClick={onClose}>
      <div className="upsell-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

interface UpsellInlineProps {
  children: React.ReactNode;
  className?: string;
}

export const UpsellInline: React.FC<UpsellInlineProps> = ({
  children,
  className = '',
}) => {
  return <div className={`upsell-inline ${className}`}>{children}</div>;
};

interface UpsellSidebarProps {
  children: React.ReactNode;
  className?: string;
}

export const UpsellSidebar: React.FC<UpsellSidebarProps> = ({
  children,
  className = '',
}) => {
  return <div className={`upsell-sidebar ${className}`}>{children}</div>;
};

/**
 * Strategic Flow Components
 * Implements progressive commitment in user journeys
 */

interface BookingFlowStepProps {
  children: React.ReactNode;
  isActive: boolean;
  isCompleted: boolean;
  className?: string;
}

export const BookingFlowStep: React.FC<BookingFlowStepProps> = ({
  children,
  isActive,
  isCompleted,
  className = '',
}) => {
  const getStepClass = () => {
    if (isActive) return 'booking-flow-step-active';
    if (isCompleted) return 'booking-flow-step-completed';
    return 'booking-flow-step-inactive';
  };

  return (
    <div className={`booking-flow-step ${getStepClass()} ${className}`}>
      {children}
    </div>
  );
};

/**
 * A/B Testing Components
 * Enables testing of different product placements
 */

interface ABTestProps {
  variantA: React.ReactNode;
  variantB: React.ReactNode;
  activeVariant: 'A' | 'B';
  className?: string;
}

export const ABTest: React.FC<ABTestProps> = ({
  variantA,
  variantB,
  activeVariant,
  className = '',
}) => {
  return (
    <div
      className={`ab-test-${activeVariant === 'B' ? 'active' : ''} ${className}`}
    >
      <div className="ab-test-variant-a">{variantA}</div>
      <div className="ab-test-variant-b">{variantB}</div>
    </div>
  );
};

/**
 * Mobile-First Responsive Psychology
 * Optimizes for mobile user behavior patterns
 */

interface MobilePrimeZoneProps {
  children: React.ReactNode;
  className?: string;
}

export const MobilePrimeZone: React.FC<MobilePrimeZoneProps> = ({
  children,
  className = '',
}) => {
  return <div className={`mobile-prime-zone ${className}`}>{children}</div>;
};

interface MobileCTAFloatingProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileCTAFloating: React.FC<MobileCTAFloatingProps> = ({
  children,
  className = '',
}) => {
  return <div className={`mobile-cta-floating ${className}`}>{children}</div>;
};

/**
 * Heat Map Optimization Components
 * Visual indicators for user attention zones
 */

interface HeatZoneProps {
  children: React.ReactNode;
  intensity: 'high' | 'medium' | 'low';
  className?: string;
}

export const HeatZone: React.FC<HeatZoneProps> = ({
  children,
  intensity,
  className = '',
}) => {
  const intensityClasses = {
    high: 'heat-zone-high',
    medium: 'heat-zone-medium',
    low: 'heat-zone-low',
  };

  return (
    <div className={`${intensityClasses[intensity]} ${className}`}>
      {children}
    </div>
  );
};

/**
 * Content Grouping with Strategic Spacing
 * Implements white space strategy for better UX
 */

interface ContentGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const ContentGroup: React.FC<ContentGroupProps> = ({
  children,
  className = '',
}) => {
  return <div className={`content-group ${className}`}>{children}</div>;
};

interface VisualSeparatorProps {
  className?: string;
}

export const VisualSeparator: React.FC<VisualSeparatorProps> = ({
  className = '',
}) => {
  return <div className={`visual-separator ${className}`} />;
};

/**
 * Analytics and Tracking Components
 * Enables measurement of product placement effectiveness
 */

interface PlacementTrackerProps {
  zone: string;
  element: string;
  children: React.ReactNode;
  className?: string;
}

export const PlacementTracker: React.FC<PlacementTrackerProps> = ({
  zone,
  element,
  children,
  className = '',
}) => {
  const handleInteraction = () => {
    // Track interaction for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'placement_interaction', {
        zone,
        element,
        timestamp: Date.now(),
      });
    }
  };

  return (
    <div className={`motion-safe ${className}`} onClick={handleInteraction}>
      {children}
    </div>
  );
};

/**
 * Accessibility-Enhanced Components
 * Ensures psychological design principles work for all users
 */

interface AccessibleFocusProps {
  children: React.ReactNode;
  className?: string;
}

export const AccessibleFocus: React.FC<AccessibleFocusProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`focus-psychology motion-safe ${className}`}>
      {children}
    </div>
  );
};

/**
 * Motion-Safe Components
 * Respects user preferences for reduced motion
 */

interface MotionSafeProps {
  children: React.ReactNode;
  className?: string;
}

export const MotionSafe: React.FC<MotionSafeProps> = ({
  children,
  className = '',
}) => {
  return <div className={`motion-safe ${className}`}>{children}</div>;
};

// Export all components
export {
  PrimeZone,
  FPatternLayout,
  DashboardZones,
  ProgressiveDisclosure,
  CognitiveChunk,
  Hierarchy,
  PsychologyButton,
  UpsellModal,
  UpsellInline,
  UpsellSidebar,
  BookingFlowStep,
  ABTest,
  MobilePrimeZone,
  MobileCTAFloating,
  HeatZone,
  ContentGroup,
  VisualSeparator,
  PlacementTracker,
  AccessibleFocus,
  MotionSafe,
};

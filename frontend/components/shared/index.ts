/**
 * Shared Components Index
 *
 * Centralized exports for all shared components, utilities, and common functionality.
 * This includes icons, providers, documentation, and example components.
 *
 * Location: components/shared/index.ts
 * Purpose: Clean imports for shared components across the application
 * Usage: Import shared components from this centralized index
 */

// Icons from existing BuffrIcons system
export { BuffrIcon, BuffrIconName } from '../ui/icons/BuffrIcons';

// Providers
export { default as ErrorBoundaryProvider } from './providers/ErrorBoundaryProvider';

// Documentation
export { default as ComponentDocumentation } from './docs/ComponentDocumentation';
export { default as ComponentShowcase } from './docs/ComponentShowcase';

// Examples
export { default as MobileOptimizedDashboard } from './examples/MobileOptimizedDashboard';

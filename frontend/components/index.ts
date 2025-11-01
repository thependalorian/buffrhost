/**
 * Buffr Host Components - Main Index
 *
 * Centralized exports for all Buffr Host React components, organized by category.
 * This provides a clean import interface for the entire component library.
 *
 * Organization:
 * - ui/: Reusable UI components (buttons, inputs, modals, etc.)
 * - features/: Feature-specific components organized by domain
 * - layouts/: Layout components (headers, navigation, footers)
 * - shared/: Shared utilities, icons, providers, and common components
 *
 * Location: components/index.ts
 * Purpose: Unified component exports for clean imports across the application
 */

// ============================================================================
// SHARED COMPONENTS
// ============================================================================

// Icons and Visual Elements
export { BuffrIcon, BuffrIconName } from './ui/icons/BuffrIcons';

// Providers and Context
export { default as ErrorBoundaryProvider } from './shared';

// Documentation and Examples
export { default as ComponentDocumentation } from './shared';
export { default as ComponentShowcase } from './shared';
export { default as MobileOptimizedDashboard } from './shared';

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

// Main Layouts
export {
  AdminLayout,
  HospitalityLayouts,
  PropertyDetailLayout,
  PropertyHeroLayout,
  PropertySearchLayout,
  ResponsiveLayout,
} from './layouts';

// Navigation
export {
  MainNavigation,
  ResponsiveNavigation,
  Navigation,
} from './layouts';

// Headers and Footers
export {
  Header,
  PageHeader,
  Footer,
} from './layouts';

// UI Elements
export {
  Breadcrumb,
  EmotionalDashboard,
  EmotionalNavigation,
} from './layouts';

// ============================================================================
// UI COMPONENTS
// ============================================================================

// Re-export all UI components
export * from './ui';

// ============================================================================
// FEATURE COMPONENTS
// ============================================================================

// Re-export all feature components
export * from './features';

// ============================================================================
// LEGACY COMPONENT EXPORTS
// ============================================================================

// Direct exports for backward compatibility
export { default as BuffrHostDashboard } from './dashboard/BuffrHostDashboard';
export { default as PropertyOwnerDashboard } from './dashboard/PropertyOwnerDashboard';
export { default as AdminDashboard } from './dashboard/AdminDashboard';
export { default as CRMDashboard } from './dashboard/CRMDashboard';
export { default as SofiaAIDashboard } from './dashboard/SofiaAIDashboard';

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

export const components = {
  name: 'Buffr Host Components',
  version: '1.0.0',
  categories: ['ui', 'features', 'layouts', 'shared'],
  totalComponents: 324, // As identified in audit
};

export default components;

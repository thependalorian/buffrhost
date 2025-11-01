/**
 * Layout Components Index
 *
 * Centralized exports for all layout components including headers, navigation,
 * footers, and page-level layout structures.
 *
 * Location: components/layouts/index.ts
 * Purpose: Clean imports for layout components across the application
 * Usage: Import layout components from this centralized index
 */

// Main Layouts
export { default as AdminLayout } from './AdminLayout';
export { default as HospitalityLayouts } from './HospitalityLayouts';
export { default as PropertyDetailLayout } from './PropertyDetailLayout';
export { default as PropertyHeroLayout } from './PropertyHeroLayout';
export { default as PropertySearchLayout } from './PropertySearchLayout';
export { default as ResponsiveLayout } from './ResponsiveLayout';

// Navigation
export { default as MainNavigation } from './MainNavigation';
export { default as ResponsiveNavigation } from './ResponsiveNavigation';
export { default as Navigation } from './Navigation';

// Headers and Footers
export { default as Header } from './Header';
export { default as PageHeader } from './page-header';
export { default as Footer } from './Footer';

// UI Elements
export { default as Breadcrumb } from './breadcrumb';
export { default as EmotionalDashboard } from './emotional-dashboard';
export { default as EmotionalNavigation } from './emotional-navigation';

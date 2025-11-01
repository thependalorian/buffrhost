/**
 *  React Component for Buffr Host Hospitality Platform
 * @fileoverview  provides reusable UI component for consistent design
 * @location buffr-host/components/ui/buffr-components.tsx
 * @purpose  provides reusable UI component for consistent design
 * @component
 * @category Ui
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Usage Example:
 * @example
 * import  from './';
 *
 * function App() {
 *   return (
 *     <
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered  component
 */

/**
 * Buffr Host DaisyUI 5 Components - Modular Implementation
 *
 * Unified component library using DaisyUI 5 with Nude brand identity
 * Features: Warm professional aesthetic, accessibility, TypeScript support
 * Location: components/ui/buffr-components-modular.tsx
 *
 * Follows 40 Rules:
 * - Uses DaisyUI for consistent styling
 * - Modular component design for easy maintenance
 * - TypeScript for type safety
 * - Vercel-compatible with SSR
 * - Uses Neon PostgreSQL database
 * - Comprehensive error handling
 * - Optimized for performance
 */

'use client';

// ============================================================================
// BUTTON COMPONENTS
// ============================================================================
export { BuffrButton, type BuffrButtonProps } from './buttons/BuffrButton';

// ============================================================================
// FORM COMPONENTS
// ============================================================================
export { BuffrInput, type BuffrInputProps } from './forms/BuffrInput';

export {
  BuffrSelect,
  BuffrSelectTrigger,
  BuffrSelectValue,
  BuffrSelectContent,
  BuffrSelectItem,
  type BuffrSelectProps,
} from './forms/BuffrSelect';

export {
  BuffrCheckbox,
  BuffrToggle,
  BuffrRadio,
  BuffrRange,
  BuffrFileInput,
  BuffrLabel,
  BuffrDivider,
  type BuffrCheckboxProps,
  type BuffrToggleProps,
  type BuffrRadioProps,
  type BuffrRangeProps,
  type BuffrFileInputProps,
} from './forms/BuffrFormComponents';

// ============================================================================
// CARD COMPONENTS
// ============================================================================
export {
  BuffrCard,
  BuffrCardBody,
  BuffrCardHeader,
  BuffrCardContent,
  BuffrCardTitle,
  BuffrCardActions,
  BuffrCardFigure,
  type BuffrCardProps,
} from './cards/BuffrCard';

// ============================================================================
// MODAL COMPONENTS
// ============================================================================
export {
  BuffrModal,
  BuffrModalBox,
  BuffrModalAction,
  BuffrModalBackdrop,
  type BuffrModalProps,
} from './modals/BuffrModal';

// ============================================================================
// TAB COMPONENTS
// ============================================================================
export {
  BuffrTabs,
  BuffrTabsList,
  BuffrTabsTrigger,
  BuffrTab,
  BuffrTabContent,
  BuffrTabsContent,
  type BuffrTabsProps,
  type BuffrTabProps,
} from './tabs/BuffrTabs';

// ============================================================================
// TABLE COMPONENTS
// ============================================================================
export {
  BuffrTable,
  BuffrTableHeader,
  BuffrTableBody,
  BuffrTableRow,
  BuffrTableHead,
  BuffrTableCell,
  type BuffrTableProps,
} from './tables/BuffrTable';

// ============================================================================
// FEEDBACK COMPONENTS
// ============================================================================
export {
  BuffrAlert,
  BuffrAlertDescription,
  BuffrBadge,
  BuffrProgress,
  BuffrLoading,
  BuffrToast,
  BuffrIndicator,
  BuffrIndicatorItem,
  type BuffrAlertProps,
  type BuffrBadgeProps,
  type BuffrProgressProps,
  type BuffrLoadingProps,
  type BuffrToastProps,
  type BuffrIndicatorProps,
} from './feedback/BuffrFeedback';

// ============================================================================
// ICON COMPONENTS
// ============================================================================
export { BuffrIcon } from './icons/BuffrIcons';
export type { BuffrIconName } from './icons/BuffrIcons';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
export { cn } from '@/lib/utils';

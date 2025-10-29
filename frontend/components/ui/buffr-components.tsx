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
export { BuffrIcon } from './buffr-icons';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
export { cn } from '@/lib/utils';

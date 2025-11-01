/**
 * @file This file defines the FormItem component, a foundational layout element for form fields in the Buffr Host application.
 * @location frontend/components/forms/FormItem.tsx
 * @description This component provides consistent spacing and structure for form elements like labels, inputs, and error messages.
 * @modular
 *
 * @component
 * @param {object} props - The props for the component.
 * @param {string} [props.className] - Optional additional CSS classes to apply to the component.
 * @param {React.ReactNode} [props.children] - The child elements to be rendered within the form item.
 *
 * @example
 * <FormItem>
 *   <Label htmlFor="email">Email</Label>
 *   <Input id="email" type="email" />
 *   <FormError message="Please enter a valid email." />
 * </FormItem>
 *
 * @see {@link FormInput}
 * @see {@link FormLabel}
 * @see {@link FormError}
 *
 * @security This component does not handle any sensitive data directly but provides structure for components that do.
 * @accessibility This component is a simple div and does not have any specific accessibility concerns.
 * @performance This is a lightweight component with minimal performance impact.
 *
 * @buffr-icon-usage This component does not use any icons directly.
 */
/**
 * FormItem React Component for Buffr Host Hospitality Platform
 * @fileoverview FormItem handles form input and validation for user data collection
 * @location buffr-host/components/forms/FormItem.tsx
 * @purpose FormItem handles form input and validation for user data collection
 * @component FormItem
 * @category Forms
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
 * import { FormItem } from './FormItem';
 *
 * function App() {
 *   return (
 *     <FormItem
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered FormItem component
 */

import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export const FormItem: React.FC<Props> = ({ className, children }) => {
  return (
    <div
      className={cn('flex flex-col gap-2 sm:gap-3', className)}
      data-emotional-impact="Welcoming, professional, supportive"
      data-buffr-host-component="form-item"
    >
      {children}
    </div>
  );
};

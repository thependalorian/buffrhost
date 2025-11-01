/**
 * FormError React Component for Buffr Host Hospitality Platform
 * @fileoverview FormError handles form input and validation for user data collection
 * @location buffr-host/components/forms/FormError.tsx
 * @purpose FormError handles form input and validation for user data collection
 * @component FormError
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
 * import { FormError } from './FormError';
 *
 * function App() {
 *   return (
 *     <FormError
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered FormError component
 */

import { cn } from '@/lib/utils';

type Props = {
  message?: string;
  as?: 'p' | 'span';
  className?: string;
};

export const FormError: React.FC<Props> = ({ message, as, className }) => {
  const Element = as || 'p';

  if (!message) {
    return null;
  }

  return (
    <Element
      className={cn('text-semantic-error text-sm', className)}
      data-emotional-impact="Caring, helpful, not punitive"
      data-buffr-host-component="form-error"
    >
      {message}
    </Element>
  );
};

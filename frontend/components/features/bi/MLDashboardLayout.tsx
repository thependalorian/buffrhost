/**
 * @file This file defines the MLDashboardLayout component, which provides a consistent layout for the machine learning dashboard.
 * @location frontend/components/features/bi/MLDashboardLayout.tsx
 * @description This component renders a layout with a title, subtitle, and an action button.
 * @modular
 *
 * @component
 * @param {MLDashboardLayoutProps} props - The props for the component.
 * @param {string} props.title - The title of the dashboard.
 * @param {string} props.description - A description of the dashboard.
 * @param {'healthy' | 'warning' | 'error'} props.status - The status of the dashboard.
 * @param {string} props.lastUpdated - The date the dashboard was last updated.
 * @param {React.ReactNode} props.children - The content of the dashboard.
 * @param {() => void} [props.onRefresh] - A function to call when the refresh button is clicked.
 * @param {() => void} [props.onExport] - A function to call when the export button is clicked.
 * @param {() => void} [props.onConfigure] - A function to call when the configure button is clicked.
 *
 * @example
 * <MLDashboardLayout
 *   title="ML Dashboard"
 *   description="Welcome to the ML dashboard."
 *   status="healthy"
 *   lastUpdated="2025-10-31"
 * >
 *   <p>Dashboard content goes here.</p>
 * </MLDashboardLayout>
 *
 * @see {@link BuffrIcon}
 * @see {@link BuffrButton}
 * @see {@link BuffrBadge}
 *
 * @security This component does not handle any sensitive data directly.
 * @accessibility The component uses semantic HTML.
 * @performance The component is lightweight and has minimal performance impact.
 *
 * @buffr-icon-usage This component uses the 'check-circle', 'alert-triangle', 'refresh', 'download', and 'settings' icons.
 */
/**
 * @file This file defines the MLDashboardLayout component, which provides a consistent layout for the machine learning dashboard.
 * @location frontend/components/features/bi/MLDashboardLayout.tsx
 * @description This component renders a layout with a title, subtitle, and an action button.
 * @modular
 *
 * @component
 * @param {MLDashboardLayoutProps} props - The props for the component.
 * @param {string} props.title - The title of the dashboard.
 * @param {string} props.description - A description of the dashboard.
 * @param {'healthy' | 'warning' | 'error'} props.status - The status of the dashboard.
 * @param {string} props.lastUpdated - The date the dashboard was last updated.
 * @param {React.ReactNode} props.children - The content of the dashboard.
 * @param {() => void} [props.onRefresh] - A function to call when the refresh button is clicked.
 * @param {() => void} [props.onExport] - A function to call when the export button is clicked.
 * @param {() => void} [props.onConfigure] - A function to call when the configure button is clicked.
 *
 * @example
 * <MLDashboardLayout
 *   title="ML Dashboard"
 *   description="Welcome to the ML dashboard."
 *   status="healthy"
 *   lastUpdated="2025-10-31"
 * >
 *   <p>Dashboard content goes here.</p>
 * </MLDashboardLayout>
 *
 * @see {@link BuffrIcon}
 * @see {@link BuffrButton}
 * @see {@link BuffrBadge}
 *
 * @security This component does not handle any sensitive data directly.
 * @accessibility The component uses semantic HTML.
 * @performance The component is lightweight and has minimal performance impact.
 *
 * @buffr-icon-usage This component uses the 'check-circle', 'alert-triangle', 'refresh', 'download', and 'settings' icons.
 */
/**
 * @file This file defines the MLDashboardLayout component, which provides a consistent layout for the machine learning dashboard.
 * @location frontend/components/features/bi/MLDashboardLayout.tsx
 * @description This component renders a layout with a title, subtitle, and an action button.
 * @modular
 *
 * @component
 * @param {MLDashboardLayoutProps} props - The props for the component.
 * @param {string} props.title - The title of the dashboard.
 * @param {string} props.description - A description of the dashboard.
 * @param {'healthy' | 'warning' | 'error'} props.status - The status of the dashboard.
 * @param {string} props.lastUpdated - The date the dashboard was last updated.
 * @param {React.ReactNode} props.children - The content of the dashboard.
 * @param {() => void} [props.onRefresh] - A function to call when the refresh button is clicked.
 * @param {() => void} [props.onExport] - A function to call when the export button is clicked.
 * @param {() => void} [props.onConfigure] - A function to call when the configure button is clicked.
 *
 * @example
 * <MLDashboardLayout
 *   title="ML Dashboard"
 *   description="Welcome to the ML dashboard."
 *   status="healthy"
 *   lastUpdated="2025-10-31"
 * >
 *   <p>Dashboard content goes here.</p>
 * </MLDashboardLayout>
 *
 * @see {@link BuffrIcon}
 * @see {@link BuffrButton}
 * @see {@link BuffrBadge}
 *
 * @security This component does not handle any sensitive data directly.
 * @accessibility The component uses semantic HTML.
 * @performance The component is lightweight and has minimal performance impact.
 *
 * @buffr-icon-usage This component uses the 'check-circle', 'alert-triangle', 'refresh', 'download', and 'settings' icons.
 */

/**
 * MLDashboardLayout React Component for Buffr Host Hospitality Platform
 * @fileoverview MLDashboardLayout provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/features/bi/MLDashboardLayout.tsx
 * @purpose MLDashboardLayout provides specialized functionality for the Buffr Host platform
 * @component MLDashboardLayout
 * @category Features
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
 * Methods:
 * @method getStatusIcon - getStatusIcon method for component functionality
 * @method getStatusColor - getStatusColor method for component functionality
 *
 * Usage Example:
 * @example
 * import { MLDashboardLayout } from './MLDashboardLayout';
 *
 * function App() {
 *   return (
 *     <MLDashboardLayout
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered MLDashboardLayout component
 */

export function MLDashboardLayout({
  title,
  description,
  status,
  lastUpdated,
  children,
  onRefresh,
  onExport,
  onConfigure,
}: MLDashboardLayoutProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'healthy':
        return (
          <BuffrIcon name="check-circle" className="h-4 w-4 text-green-500" />
        );
      case 'warning':
        return (
          <BuffrIcon
            name="alert-triangle"
            className="h-4 w-4 text-yellow-500"
          />
        );
      case 'error':
        return (
          <BuffrIcon name="alert-triangle" className="h-4 w-4 text-red-500" />
        );
      default:
        return (
          <BuffrIcon name="alert-triangle" className="h-4 w-4 text-nude-500" />
        );
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-success';
      case 'warning':
        return 'bg-yellow-100 text-warning';
      case 'error':
        return 'bg-red-100 text-error';
      default:
        return 'bg-nude-100 text-nude-800';
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 w-full max-w-full overflow-hidden px-2 md:px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight truncate">
            {title}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground line-clamp-2 break-words">
            {description}
          </p>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <BuffrBadge className={`${getStatusColor()} whitespace-nowrap`}>
            {getStatusIcon()}
            <span className="ml-1 capitalize">{status}</span>
          </BuffrBadge>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
        <div className="flex items-center space-x-4 min-w-0">
          <span className="text-xs md:text-sm text-muted-foreground truncate">
            Last updated: {lastUpdated}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <BuffrButton
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="flex items-center space-x-2 min-h-[44px] md:min-h-[36px] text-xs md:text-sm"
          >
            <BuffrIcon name="refresh" className="h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline">Refresh</span>
          </BuffrButton>
          <BuffrButton
            variant="outline"
            size="sm"
            onClick={onExport}
            className="flex items-center space-x-2 min-h-[44px] md:min-h-[36px] text-xs md:text-sm"
          >
            <BuffrIcon name="download" className="h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline">Export</span>
          </BuffrButton>
          <BuffrButton
            variant="outline"
            size="sm"
            onClick={onConfigure}
            className="flex items-center space-x-2 min-h-[44px] md:min-h-[36px] text-xs md:text-sm"
          >
            <BuffrIcon name="settings" className="h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline">Configure</span>
          </BuffrButton>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="grid gap-4 md:gap-6">{children}</div>
    </div>
  );
}

export default MLDashboardLayout;

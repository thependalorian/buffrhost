'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '@/lib/contexts/auth-context';
import { RBACProvider } from '@/lib/contexts/RBACContext';
import { ReactQueryProvider } from '@/lib/providers/react-query-provider';
import { useSystemThemeListener } from '@/lib/stores/ui-store';

/**
 * Application Providers Component
 * @fileoverview Centralized provider setup for the entire application
 * @location buffr-host/frontend/app/providers.tsx
 * @purpose Combine all application providers in the correct order
 * @modularity Single entry point for all context and state providers
 * @performance Providers are memoized and only re-render when necessary
 * @scalability Easy to add new providers without changing component hierarchy
 * @testing Providers can be mocked or replaced in test environments
 */

interface ProvidersProps {
  children: ReactNode;
}

/**
 * System Theme Listener Component
 * Initializes theme detection and updates document classes
 */
function SystemThemeInitializer() {
  useSystemThemeListener();
  return null;
}

/**
 * Main Providers Component
 * Wraps the entire application with all necessary providers
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <RBACProvider>
          {/* Initialize system theme detection */}
          <SystemThemeInitializer />
          {children}
        </RBACProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}

/**
 * Provider Order Explanation:
 *
 * 1. ReactQueryProvider (outermost)
 *    - Provides server state management
 *    - Needs to be outermost for proper query caching across all components
 *
 * 2. AuthProvider
 *    - Provides authentication context
 *    - Available to all components including React Query hooks
 *
 * 3. RBACProvider
 *    - Provides role-based access control
 *    - Depends on AuthProvider for user information
 *
 * 4. SystemThemeInitializer
 *    - Initializes theme detection
 *    - Runs side effects without rendering UI
 *
 * This order ensures proper dependency injection and context availability.
 */

/**
 * Zustand UI Store for Buffr Host Hospitality Platform
 *
 * Global UI state management using Zustand for client-side state.
 * Handles UI-related state like theme, sidebar, notifications, modals, etc.
 * Does not handle server state - that's managed by React Query.
 *
 * Location: lib/stores/ui-store.ts
 * Purpose: Centralized UI state management for consistent global state
 * Modularity: Single Zustand store with clear state slices and actions
 * Performance: Optimized with Zustand's built-in performance features
 * Scalability: Extensible store structure with middleware support
 * Monitoring: State change tracking and debugging capabilities
 *
 * State Management Capabilities:
 * - Theme management (light/dark mode)
 * - Sidebar/navigation state
 * - Modal and overlay management
 * - Notification system
 * - Loading states for UI operations
 * - User preferences and settings
 *
 * Key Features:
 * - TypeScript support with proper typing
 * - Middleware for logging and debugging
 * - Hydration support for SSR
 * - Consistent state update patterns
 * - Error boundary integration
 *
 * @module UIStore
 * @author Buffr Host Development Team
 * @version 1.0.0
 * @since 2025-01-01
 */

import React, { useEffect } from 'react';
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export type Theme = 'light' | 'dark' | 'auto';
export type SidebarState = 'expanded' | 'collapsed' | 'hidden';
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number; // in milliseconds, null for persistent
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ModalState {
  id: string;
  isOpen: boolean;
  component?: string;
  props?: Record<string, any>;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
}

export interface LoadingState {
  id: string;
  message?: string;
  progress?: number; // 0-100
}

export interface UIState {
  // Theme
  theme: Theme;
  systemTheme: 'light' | 'dark';

  // Navigation
  sidebarState: SidebarState;
  mobileMenuOpen: boolean;

  // Modals
  modals: ModalState[];
  activeModalId?: string;

  // Notifications
  notifications: Notification[];
  notificationQueue: Notification[];

  // Loading states
  loadingStates: LoadingState[];
  globalLoading: boolean;

  // User preferences
  preferences: {
    animations: boolean;
    sound: boolean;
    compactMode: boolean;
    language: string;
    timezone: string;
  };

  // Layout
  layout: {
    showBreadcrumbs: boolean;
    showFooter: boolean;
    stickyHeader: boolean;
  };

  // Error state
  globalError?: {
    message: string;
    code?: string;
    retry?: () => void;
  };
}

// ============================================================================
// STORE DEFINITION
// ============================================================================

export const useUIStore = create<UIState & {
  // Theme actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Navigation actions
  setSidebarState: (state: SidebarState) => void;
  toggleSidebar: () => void;
  setMobileMenuOpen: (open: boolean) => void;

  // Modal actions
  openModal: (modal: Omit<ModalState, 'isOpen'>) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  updateModalProps: (id: string, props: Record<string, any>) => void;

  // Notification actions
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string, action?: Notification['action']) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;

  // Loading actions
  setLoading: (id: string, loading: boolean, message?: string, progress?: number) => void;
  removeLoading: (id: string) => void;
  setGlobalLoading: (loading: boolean) => void;

  // Preferences actions
  updatePreferences: (preferences: Partial<UIState['preferences']>) => void;

  // Layout actions
  updateLayout: (layout: Partial<UIState['layout']>) => void;

  // Error actions
  setGlobalError: (error: UIState['globalError']) => void;
  clearGlobalError: () => void;
}>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        theme: 'auto',
        systemTheme: 'light',
        sidebarState: 'expanded',
        mobileMenuOpen: false,
        modals: [],
        notifications: [],
        notificationQueue: [],
        loadingStates: [],
        globalLoading: false,
        preferences: {
          animations: true,
          sound: true,
          compactMode: false,
          language: 'en',
          timezone: 'UTC',
        },
        layout: {
          showBreadcrumbs: true,
          showFooter: true,
          stickyHeader: true,
        },

        // Theme actions
        setTheme: (theme) => set({ theme }),
        toggleTheme: () => {
          const current = get().theme;
          const next = current === 'light' ? 'dark' : current === 'dark' ? 'auto' : 'light';
          set({ theme: next });
        },

        // Navigation actions
        setSidebarState: (sidebarState) => set({ sidebarState }),
        toggleSidebar: () => {
          const current = get().sidebarState;
          const next = current === 'expanded' ? 'collapsed' : 'expanded';
          set({ sidebarState: next });
        },
        setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),

        // Modal actions
        openModal: (modal) => set((state) => ({
          modals: [...state.modals, { ...modal, isOpen: true }],
          activeModalId: modal.id,
        })),
        closeModal: (id) => set((state) => ({
          modals: state.modals.map(modal =>
            modal.id === id ? { ...modal, isOpen: false } : modal
          ),
          activeModalId: state.activeModalId === id ? undefined : state.activeModalId,
        })),
        closeAllModals: () => set({
          modals: [],
          activeModalId: undefined,
        }),
        updateModalProps: (id, props) => set((state) => ({
          modals: state.modals.map(modal =>
            modal.id === id ? { ...modal, props: { ...modal.props, ...props } } : modal
          ),
        })),

        // Notification actions
        addNotification: (notification) => {
          const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const fullNotification: Notification = {
            id,
            duration: 5000, // Default 5 seconds
            ...notification,
          };

          set((state) => ({
            notifications: [...state.notifications, fullNotification],
          }));

          // Auto-remove notification after duration
          if (fullNotification.duration && fullNotification.duration > 0) {
            setTimeout(() => {
              get().removeNotification(id);
            }, fullNotification.duration);
          }
        },
        removeNotification: (id) => set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id),
        })),
        clearNotifications: () => set({ notifications: [] }),

        // Convenience methods for different notification types
        showSuccess: (title, message) => get().addNotification({
          type: 'success',
          title,
          message,
        }),
        showError: (title, message, action) => get().addNotification({
          type: 'error',
          title,
          message,
          action,
          duration: null, // Persistent error notifications
        }),
        showWarning: (title, message) => get().addNotification({
          type: 'warning',
          title,
          message,
        }),
        showInfo: (title, message) => get().addNotification({
          type: 'info',
          title,
          message,
        }),

        // Loading actions
        setLoading: (id, loading, message, progress) => set((state) => {
          if (loading) {
            const existingIndex = state.loadingStates.findIndex(l => l.id === id);
            const newLoadingState: LoadingState = { id, message, progress };

            if (existingIndex >= 0) {
              // Update existing
              const newStates = [...state.loadingStates];
              newStates[existingIndex] = newLoadingState;
              return { loadingStates: newStates };
            } else {
              // Add new
              return { loadingStates: [...state.loadingStates, newLoadingState] };
            }
          } else {
            // Remove loading state
            return {
              loadingStates: state.loadingStates.filter(l => l.id !== id),
            };
          }
        }),
        removeLoading: (id) => get().setLoading(id, false),
        setGlobalLoading: (globalLoading) => set({ globalLoading }),

        // Preferences actions
        updatePreferences: (preferences) => set((state) => ({
          preferences: { ...state.preferences, ...preferences },
        })),

        // Layout actions
        updateLayout: (layout) => set((state) => ({
          layout: { ...state.layout, ...layout },
        })),

        // Error actions
        setGlobalError: (globalError) => set({ globalError }),
        clearGlobalError: () => set({ globalError: undefined }),
      }),
      {
        name: 'buffr-ui-store',
        storage: createJSONStorage(() => localStorage),
        // Only persist certain state
        partialize: (state) => ({
          theme: state.theme,
          sidebarState: state.sidebarState,
          preferences: state.preferences,
          layout: state.layout,
        }),
      }
    ),
    {
      name: 'UI Store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

// ============================================================================
// HOOKS AND UTILITIES
// ============================================================================

/**
 * Hook to listen for system theme changes
 * Automatically updates the system theme in the store
 */
export const useSystemThemeListener = () => {
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Update system theme initially
    const updateSystemTheme = () => {
      const newSystemTheme = mediaQuery.matches ? 'dark' : 'light';
      useUIStore.setState({ systemTheme: newSystemTheme });
    };

    // Listen for changes
    mediaQuery.addEventListener('change', updateSystemTheme);

    // Initial check
    updateSystemTheme();

    // Cleanup
    return () => mediaQuery.removeEventListener('change', updateSystemTheme);
  }, []);
};

/**
 * Hook to check if a specific loading state is active
 * @param id - Loading state ID
 * @returns Loading state information
 */
export const useLoadingState = (id: string) => {
  const loadingStates = useUIStore((state) => state.loadingStates);
  return loadingStates.find(loading => loading.id === id);
};

/**
 * Hook to check if any loading states are active
 * @returns Whether any loading states are active
 */
export const useIsLoading = () => {
  const loadingStates = useUIStore((state) => state.loadingStates);
  const globalLoading = useUIStore((state) => state.globalLoading);
  return loadingStates.length > 0 || globalLoading;
};

/**
 * Hook to get the effective theme (resolving 'auto' to actual theme)
 * @returns Effective theme
 */
export const useEffectiveTheme = () => {
  const { theme, systemTheme } = useUIStore((state) => ({
    theme: state.theme,
    systemTheme: state.systemTheme,
  }));

  return theme === 'auto' ? systemTheme : theme;
};

/**
 * Hook to check if a modal is open
 * @param id - Modal ID
 * @returns Whether the modal is open
 */
export const useModalOpen = (id: string) => {
  const modals = useUIStore((state) => state.modals);
  return modals.some(modal => modal.id === id && modal.isOpen);
};

// ============================================================================
// SELECTORS
// ============================================================================

/**
 * Selector for theme-related state
 */
export const useThemeState = () => useUIStore((state) => ({
  theme: state.theme,
  systemTheme: state.systemTheme,
  effectiveTheme: state.theme === 'auto' ? state.systemTheme : state.theme,
}));

/**
 * Selector for navigation state
 */
export const useNavigationState = () => useUIStore((state) => ({
  sidebarState: state.sidebarState,
  mobileMenuOpen: state.mobileMenuOpen,
}));

/**
 * Selector for notification state
 */
export const useNotificationState = () => useUIStore((state) => ({
  notifications: state.notifications,
  notificationQueue: state.notificationQueue,
}));
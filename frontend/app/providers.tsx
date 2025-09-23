'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: (failureCount, error: any) => {
              // Don't retry on 4xx errors
              if (error?.response?.status >= 400 && error?.response?.status < 500) {
                return false;
              }
              return failureCount < 3;
            },
          },
          mutations: {
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(var(--base-100))',
            color: 'hsl(var(--base-content))',
            border: '1px solid hsl(var(--base-300))',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          },
          success: {
            duration: 3000,
            style: {
              background: 'hsl(var(--success) / 0.1)',
              color: 'hsl(var(--success))',
              border: '1px solid hsl(var(--success) / 0.2)',
            },
            iconTheme: {
              primary: 'hsl(var(--success))',
              secondary: 'hsl(var(--base-100))',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: 'hsl(var(--error) / 0.1)',
              color: 'hsl(var(--error))',
              border: '1px solid hsl(var(--error) / 0.2)',
            },
            iconTheme: {
              primary: 'hsl(var(--error))',
              secondary: 'hsl(var(--base-100))',
            },
          },
          loading: {
            style: {
              background: 'hsl(var(--primary) / 0.1)',
              color: 'hsl(var(--primary))',
              border: '1px solid hsl(var(--primary) / 0.2)',
            },
            iconTheme: {
              primary: 'hsl(var(--primary))',
              secondary: 'hsl(var(--base-100))',
            },
          },
        }}
      />
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiServices } from '../lib/api-client';

// User Profile Hook
export const useProfile = () => {
  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: () => apiServices.auth.getProfile().then(res => res.data),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Login Hook
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) => 
      apiServices.auth.login(credentials),
    onSuccess: (response) => {
      // Store token in localStorage
      if (typeof window !== 'undefined' && response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      // Invalidate and refetch profile
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

// Register Hook
export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: any) => apiServices.auth.register(userData),
    onSuccess: (response) => {
      // Store token in localStorage
      if (typeof window !== 'undefined' && response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      // Invalidate and refetch profile
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

// Logout Hook
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => apiServices.auth.logout(),
    onSuccess: () => {
      // Remove token from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      // Clear all queries
      queryClient.clear();
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
    },
  });
};

// Refresh Token Hook
export const useRefreshToken = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => apiServices.auth.refresh(),
    onSuccess: (response) => {
      // Update token in localStorage
      if (typeof window !== 'undefined' && response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      // Invalidate and refetch profile
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

// Auth state hook
export const useAuth = () => {
  const { data: profile, isLoading, error } = useProfile();
  
  return {
    user: profile?.data,
    isLoading,
    isAuthenticated: !!profile?.data && !error,
    error,
  };
};
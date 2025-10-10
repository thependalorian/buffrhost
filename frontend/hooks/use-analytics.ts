import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiServices } from '../lib/api-client';

// Analytics Dashboard Hook
export const useAnalytics = (propertyId: string) => {
  return useQuery({
    queryKey: ['analytics', 'dashboard', propertyId],
    queryFn: () => apiServices.analytics.getDashboard(propertyId).then(res => res.data),
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Revenue Analytics Hook
export const useRevenueAnalytics = (filters: any) => {
  return useQuery({
    queryKey: ['analytics', 'revenue', filters],
    queryFn: () => apiServices.analytics.getRevenue(filters).then(res => res.data),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!filters,
  });
};

// Occupancy Analytics Hook
export const useOccupancyAnalytics = (filters: any) => {
  return useQuery({
    queryKey: ['analytics', 'occupancy', filters],
    queryFn: () => apiServices.analytics.getOccupancy(filters).then(res => res.data),
    staleTime: 2 * 60 * 1000,
    enabled: !!filters,
  });
};

// Guest Analytics Hook
export const useGuestAnalytics = (filters: any) => {
  return useQuery({
    queryKey: ['analytics', 'guests', filters],
    queryFn: () => apiServices.analytics.getGuests(filters).then(res => res.data),
    staleTime: 2 * 60 * 1000,
    enabled: !!filters,
  });
};

// Performance Analytics Hook
export const usePerformanceAnalytics = (filters: any) => {
  return useQuery({
    queryKey: ['analytics', 'performance', filters],
    queryFn: () => apiServices.analytics.getPerformance(filters).then(res => res.data),
    staleTime: 2 * 60 * 1000,
    enabled: !!filters,
  });
};

// Real-time Metrics Hook
export const useRealTimeMetrics = (propertyId: string) => {
  return useQuery({
    queryKey: ['analytics', 'real-time', propertyId],
    queryFn: () => apiServices.analytics.getRealTimeMetrics(propertyId).then(res => res.data),
    enabled: !!propertyId,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 0, // Always consider stale for real-time data
  });
};

// Forecasting Hook
export const useForecast = (filters: any) => {
  return useQuery({
    queryKey: ['analytics', 'forecast', filters],
    queryFn: () => apiServices.analytics.getForecast(filters).then(res => res.data),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!filters,
  });
};

// Custom Report Generation Hook
export const useCustomReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (filters: any) => apiServices.analytics.getRevenue(filters),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
};